'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/lib/api'

export type UserRole = 'student' | 'teacher' | 'admin'

interface User {
  id: string
  email: string
  role: UserRole
  name?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: UserRole) => Promise<User>
  setUser: (user: User) => void
  logout: () => Promise<void>
  isLoading: boolean
  hasPermission: (permission: string) => boolean
  isRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Permission mapping for different roles
const rolePermissions: Record<UserRole, string[]> = {
  student: [
    'view:dashboard',
    'view:own-courses',
    'submit:assignments',
    'view:own-grades'
  ],
  teacher: [
    'view:dashboard',
    'view:own-courses',
    'create:courses',
    'edit:own-courses',
    'grade:assignments',
    'view:students',
    'manage:own-students'
  ],
  admin: [
    'view:dashboard',
    'view:all-courses',
    'create:courses',
    'edit:all-courses',
    'delete:courses',
    'view:all-users',
    'manage:users',
    'manage:roles',
    'view:analytics',
    'manage:system'
  ]
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session/token
    const checkAuth = async () => {
      try {
        const token = api.getToken()
        console.log('Checking auth with token:', token ? 'exists' : 'none') // Debug log
        
        if (token) {
          try {
            // Try to get user profile from API
            const response = await api.getProfile()
            console.log('Profile response:', response) // Debug log
            
            if (response.success) {
              const user: User = {
                //@ts-ignore
                id: response.user.id || response.user._id || '1', // Handle both id and _id
                email: response.user.email,
                role: response.user.role as UserRole,
                name: response.user.name
              }
              console.log('Set user from profile:', user) // Debug log
              setUser(user)
            }
          } catch (profileError) {
            console.error('Profile fetch failed:', profileError)
            
            // Check if it's a network error (backend not running)
            if (profileError instanceof TypeError && profileError.message.includes('Failed to fetch')) {
              console.warn('Backend server appears to be offline. Attempting to decode token locally.')
              
              // Try to decode JWT token locally as fallback
              try {
                const tokenParts = token.split('.')
                if (tokenParts.length === 3) {
                  const payload = JSON.parse(atob(tokenParts[1]))
                  const currentTime = Date.now() / 1000
                  
                  // Check if token is not expired
                  if (payload.exp && payload.exp > currentTime) {
                    const user: User = {
                      id: payload.id || '1',
                      email: payload.email,
                      role: payload.role as UserRole,
                      name: payload.name
                    }
                    console.log('Set user from token fallback:', user) // Debug log
                    setUser(user)
                    return // Don't clear token if we successfully decoded it
                  } else {
                    console.warn('Token is expired, clearing it')
                    api.removeToken()
                  }
                }
              } catch (decodeError) {
                console.error('Failed to decode token locally:', decodeError)
                // Try to create a fallback user from localStorage if available
                const storedUser = localStorage.getItem('user')
                if (storedUser) {
                  try {
                    const parsedUser = JSON.parse(storedUser)
                    const user: User = {
                      id: parsedUser.id || '1',
                      email: parsedUser.email,
                      role: parsedUser.role as UserRole,
                      name: parsedUser.name
                    }
                    console.log('Set user from localStorage fallback:', user) // Debug log
                    setUser(user)
                    return
                  } catch (localStorageError) {
                    console.error('Failed to parse localStorage user:', localStorageError)
                  }
                }
                // Don't clear token on decode error, just log it
                console.warn('Keeping token despite decode error for offline mode')
              }
              
              // Don't clear token for network errors - allow offline mode
              console.warn('Backend unavailable, but keeping token for offline mode')
            } else {
              // For other errors, clear the token
              console.error('Clearing invalid token due to profile fetch error')
              api.removeToken()
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        // Clear invalid token
        api.removeToken()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string, role?: UserRole): Promise<User> => {
    setIsLoading(true)
    try {
      // Call the real API
      const response = await api.login({ email, password })
      
      console.log('Login response:', response) // Debug log
      
      if (response.success) {
        // Store token
        api.setToken(response.token)
        
        // Convert API user to our User interface
        const user: User = {
          // @ts-ignore
          id: response.user.id || response.user._id, // Handle both id and _id
          email: response.user.email,
          role: response.user.role as UserRole,
          name: response.user.name
        }
        
        console.log('Converted user:', user) // Debug log
        setUser(user)
        return user
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw new Error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const setUserDirectly = (user: User) => {
    setUser(user)
  }

  const logout = async () => {
    console.log('Logout called - clearing all auth data...')
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear all auth data
      api.removeToken()
      setUser(null)
      
      // Clear localStorage completely
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Clear any other potential auth data
      sessionStorage.clear()
      
      console.log('✅ All auth data cleared')
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return rolePermissions[user.role].includes(permission)
  }

  const isRole = (role: UserRole): boolean => {
    return user?.role === role
  }

  const value: AuthContextType = {
    user,
    login,
    setUser: setUserDirectly,
    logout,
    isLoading,
    hasPermission,
    isRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
