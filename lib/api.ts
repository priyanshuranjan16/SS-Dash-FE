import { mockApi } from './dummy-data'

const API_BASE_URL = 'https://ss-dash-be.onrender.com/api'

// Debug function to test backend connectivity
export const testBackendConnection = async () => {
  try {
    const response = await fetch('https://ss-dash-be.onrender.com')
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Backend is running:', data)
      return true
    } else {
      console.error('❌ Backend health check failed:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error instanceof Error ? error.message : 'Unknown error')
    return false
  }
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role?: 'student' | 'teacher' | 'admin'
}

export interface LoginData {
  email: string
  password: string
  role?: 'student' | 'teacher' | 'admin' // Optional for login
}

export interface ProfileData {
  name: string
  email: string
  bio: string
  avatar: string
  role: string
  joinDate: string
  lastActive: string
  department?: string
  specialization?: string
  courses?: string[]
  achievements?: string[]
  certifications?: string[]
  officeHours?: string
  researchInterests?: string[]
  publications?: string[]
  teachingExperience?: number
  studentCount?: number
  courseCount?: number
  averageRating?: number
  completedCourses?: number
  currentCourses?: number
  gpa?: number
  major?: string
  graduationYear?: number
  academicStanding?: string
  advisor?: string
  thesis?: string
  internships?: string[]
  skills?: string[]
  languages?: string[]
  systemAccess?: string[]
  permissions?: string[]
  lastLogin?: string
  ipAddress?: string
  deviceInfo?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user: {
    id: string
    name: string
    email: string
    role: string
    bio: string
    avatar: string
    lastActive: string
  }
  token: string
}

export interface ProfileResponse {
  success: boolean
  message?: string
  user: ProfileData
}

export interface DashboardData {
  metrics: {
    totalUsers: number
    activeUsers: number
    weeklySignups: number
    revenue: number
  }
  charts: {
    weeklyActivity: Array<{
      date: string
      teachers: number
      students: number
      signups: number
    }>
    monthlyGrowth: Array<{
      month: string
      growth: number
      revenue: number
    }>
    roleDistribution: Array<{
      role: string
      count: number
      percentage: number
    }>
  }
  recentActivity: Array<{
    user: string
    action: string
    timestamp: string
    details: any
  }>
}

export interface DashboardResponse {
  success: boolean
  data: DashboardData
}

export interface AdminDashboardData extends DashboardData {
  systemHealth: {
    uptime: number
    memoryUsage: any
    activeConnections: number
    databaseStatus: string
  }
}

export interface TeacherDashboardData extends DashboardData {
  teachingStats: {
    totalStudents: number
    activeStudents: number
    coursesTaught: number
    averageGrade: string
  }
}

// Cookie utilities
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
}

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

export const api = {
  // Token management
  setToken(token: string) {
    setCookie('auth-token', token, 7) // 7 days
    localStorage.setItem('token', token) // Keep in localStorage as backup
  },

  getToken(): string | null {
    return getCookie('auth-token') || localStorage.getItem('token')
  },

  removeToken() {
    deleteCookie('auth-token')
    localStorage.removeItem('token')
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      // Store token in cookie
      this.setToken(result.token)

      return result
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Backend server is not accessible. Please ensure the server is running.')
      }
      throw error
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    console.log('API login called with data:', data) // Debug log
    console.log('API login URL:', `${API_BASE_URL}/auth/login`) // Debug log
    
    try {
      console.log('Making fetch request to:', `${API_BASE_URL}/auth/login`) // Debug log
      console.log('Request body:', JSON.stringify(data)) // Debug log
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Include cookies for CORS
        body: JSON.stringify(data),
      })

      console.log('Response status:', response.status) // Debug log
      console.log('Response headers:', response.headers) // Debug log

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error text:', errorText) // Debug log
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` }
        }
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Response result:', result) // Debug log

      // Store token in cookie
      this.setToken(result.token)

      return result
    } catch (error) {
      console.error('API login error:', error) // Debug log
      
      // If backend is not accessible, try dummy authentication
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('Backend not available, attempting dummy authentication...')
        return this.dummyLogin(data)
      }
      
      // For other errors (like 400, 401, etc.), throw the original error
      throw error
    }
  },

  // Dummy login for development/testing when backend is not available
  dummyLogin(data: LoginData): Promise<AuthResponse> {
    console.log('Using dummy login for:', data.email)
    
    // Simple validation
    if (!data.email || !data.password) {
      throw new Error('Email and password are required')
    }
    
    // Check against dummy credentials
    const dummyUsers: Record<string, { password: string; role: string; name: string }> = {
      'admin@d-dash.com': { password: 'admin123', role: 'admin', name: 'Admin User' },
      'teacher@d-dash.com': { password: 'teacher123', role: 'teacher', name: 'Teacher User' },
      'student@d-dash.com': { password: 'student123', role: 'student', name: 'Student User' }
    }
    
    const user = dummyUsers[data.email]
    if (!user || user.password !== data.password) {
      throw new Error('Invalid email or password')
    }
    
    // Generate dummy token
    const dummyToken = `dummy_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.setToken(dummyToken)
    
    const result: AuthResponse = {
      success: true,
      message: 'Dummy login successful (backend not available)',
      user: {
        id: `dummy_${user.role}_${Date.now()}`,
        name: user.name,
        email: data.email,
        role: user.role,
        bio: `Dummy ${user.role} user`,
        avatar: '',
        lastActive: new Date().toISOString()
      },
      token: dummyToken
    }
    
    console.log('Dummy login successful:', result)
    return Promise.resolve(result)
  },

  async getProfile(): Promise<ProfileResponse> {
    const token = this.getToken()
    console.log('API getProfile - token exists:', !!token) // Debug log
    
    if (!token) {
      throw new Error('No authentication token found')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('API getProfile - response status:', response.status) // Debug log

      const result = await response.json()
      console.log('API getProfile - result:', result) // Debug log

      if (!response.ok) {
        throw new Error(result.message || 'Failed to get profile')
      }

      return result
    } catch (error) {
      console.error('API getProfile - error:', error) // Debug log
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Backend server is not accessible. Please ensure the server is running.')
      }
      throw error
    }
  },

  async updateProfile(data: Partial<ProfileData>): Promise<ProfileResponse> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update profile')
    }

    return result
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/profile/password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to change password')
    }

    return result
  },

  async logout() {
    console.log('API logout called - clearing all tokens...')
    const token = this.getToken()
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        console.error('Logout API call failed:', error)
      }
    }

    // Remove token from cookie and localStorage
    this.removeToken()
    
    // Clear all potential storage locations
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.clear()
    
    console.log('✅ All tokens and user data cleared from API')
    return { success: true }
  },

  async getDashboard(): Promise<DashboardResponse> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to get dashboard data')
    }

    return result
  },

  async getAdminDashboard(): Promise<{ success: boolean; data: AdminDashboardData }> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to get admin dashboard data')
      }

      return result
    } catch (error) {
      console.warn('Backend not available, using dummy data for admin dashboard:', error)
      return mockApi.getAdminDashboard()
    }
  },

  async getTeacherDashboard(): Promise<{ success: boolean; data: TeacherDashboardData }> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/teacher`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to get teacher dashboard data')
      }

      return result
    } catch (error) {
      console.warn('Backend not available, using dummy data for teacher dashboard:', error)
      return mockApi.getTeacherDashboard()
    }
  },

  async logActivity(action: string, details?: any): Promise<{ success: boolean; message: string }> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/activity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, details }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to log activity')
      }

      return result
    } catch (error) {
      console.warn('Backend not available, using dummy activity logging:', error)
      return mockApi.logActivity(action, details)
    }
  }
}
