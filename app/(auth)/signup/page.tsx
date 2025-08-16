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

export default function SignupPage() {
  const { setUser } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function onSubmit(values: { name: string; email: string; password: string; role: "student" | "teacher" | "admin" }) {
    console.log('Signup onSubmit called with values:', values)
    
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Registration attempt:', { email: values.email, role: values.role })
      
      // Test backend connection first
      try {
        const healthResponse = await fetch('https://ss-dash-be.onrender.com/health')
        console.log('Backend health check status:', healthResponse.status)
        if (!healthResponse.ok) {
          throw new Error('Backend server is not responding properly')
        }
      } catch (healthError) {
        console.error('Backend health check failed:', healthError)
        setError('Backend server is not accessible. Please ensure the server is running on https://ss-dash-be.onrender.com.')
        return
      }
      
      // Call your backend API using the api utility
      console.log('Calling api.register...')
      const data = await api.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role
      })

      console.log('Registration successful:', data)
      
      // Token is automatically stored in cookie by the API
      // Store user data in localStorage for context
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Update auth context with user data
      console.log('Updating auth context...')
      const user = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role as 'student' | 'teacher' | 'admin',
        name: data.user.name
      }
      console.log('User data for context:', user)
      
      // Set user in auth context
      setUser(user)
      
      // Redirect based on user's role
      const dashboardUrl = getDashboardUrl(user.role)
      console.log('Redirecting to dashboard:', dashboardUrl)
      router.push(dashboardUrl)
    } catch (error) {
      console.error('Registration failed:', error)
      setError(error instanceof Error ? error.message : 'Registration failed. Please try again.')
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
          title="Create an account"
          description="Enter your information to create your account"
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
          <AuthForm type="signup" onSubmit={onSubmit} isLoading={isLoading} />
          <motion.p 
            className="px-8 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Already have an account?{' '}
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign in
              </Link>
            </motion.span>
          </motion.p>
        </AuthCard>
      </div>
    </motion.div>
  )
}