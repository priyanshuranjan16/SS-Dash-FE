'use client'

import { useState, useEffect } from 'react'
import { AuthCard } from '../../../components/auth/auth-card'
import { AuthForm } from '../../../components/auth/auth-form'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '../../../contexts/auth-context'
import { useRouter } from 'next/navigation'
import { api } from '../../../lib/api'
import { getDashboardUrl } from '../../../lib/utils'
import { BackendStatus } from '../../../components/ui/backend-status'

export default function LoginPage() {
  const { setUser } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function onSubmit(values: { name?: string; email: string; password: string; role: "student" | "teacher" | "admin" }) {
    console.log('Login onSubmit called with values:', values) // Debug log
    
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Login attempt:', { email: values.email, role: values.role })
      
      // Clear any existing auth data before login attempt
      console.log('Clearing any existing auth data...')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.clear()
      
      // Test backend connection first
      try {
        const healthResponse = await fetch('https://ss-dash-be.onrender.com')
        console.log('Backend health check status:', healthResponse.status)
        if (!healthResponse.ok) {
          throw new Error('Backend server is not responding properly')
        }
      } catch (healthError) {
        console.error('Backend health check failed:', healthError)
        setError('Backend server is not accessible. Please ensure the server is running on https://ss-dash-be.onrender.com')
        return
      }
      
      // Call your backend API using the api utility
      console.log('Calling api.login...') // Debug log
      const data = await api.login({
        email: values.email,
        password: values.password
        // Note: role is optional for login, backend will determine role from user data
      })

      console.log('Login successful:', data)
      
      // Token is automatically stored in cookie by the API
      // Store user data in localStorage for context
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Update auth context with user data (no need for second API call)
      console.log('Updating auth context...') // Debug log
      const user = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role as 'student' | 'teacher' | 'admin',
        name: data.user.name
      }
      console.log('User data for context:', user) // Debug log
      
      // Set user in auth context
      setUser(user)
      
      // Get redirect URL from query params or use default based on user's actual role from backend
      const searchParams = new URLSearchParams(window.location.search)
      const redirectTo = searchParams.get('redirect')
      
      if (redirectTo) {
        console.log('Redirecting to:', redirectTo) // Debug log
        router.push(redirectTo)
      } else {
        // Redirect based on user's actual role from backend response
        const userRole = (data.user.role || values.role) as 'student' | 'teacher' | 'admin'
        const dashboardUrl = getDashboardUrl(userRole)
        console.log('Redirecting to dashboard:', dashboardUrl) // Debug log
        router.push(dashboardUrl)
      }
    } catch (error) {
      console.error('Login failed:', error)
      setError(error instanceof Error ? error.message : 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md mx-auto p-6">
        {/* Backend Status Indicator */}
        <div className="mb-4">
          <BackendStatus />
        </div>
        
        <AuthCard
          title="Welcome back"
          description="Enter your credentials to sign in to your account"
        >
          {error && (
            <motion.div 
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
          <AuthForm type="login" onSubmit={onSubmit} isLoading={isLoading} />
          <motion.p 
            className="px-8 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Don't have an account?{' '}
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/signup"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </Link>
            </motion.span>
          </motion.p>
        </AuthCard>
      </div>
    </motion.div>
  )
}
