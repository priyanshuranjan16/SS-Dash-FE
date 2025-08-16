'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Home, Shield, Lock, ArrowLeft, Users, UserCheck, Shield as AdminIcon } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function UnauthorizedPage() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const from = searchParams.get('from') || 'unknown page'
  const requiredRoles = searchParams.get('requiredRoles')?.split(',') || []
  const userRole = searchParams.get('userRole') || 'unknown'

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <AdminIcon className="w-4 h-4" />
      case 'teacher':
        return <UserCheck className="w-4 h-4" />
      case 'student':
        return <Users className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500'
      case 'teacher':
        return 'bg-blue-500'
      case 'student':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getDashboardPath = (role: string) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard'
      case 'teacher':
        return '/teacher/dashboard'
      case 'student':
        return '/dashboard'
      default:
        return '/dashboard'
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-background flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-orange-500/10 rounded-full flex items-center justify-center">
            <Lock className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-orange-500 mb-2">Access Denied</h1>
          <h2 className="text-2xl font-semibold mb-2">Unauthorized Access</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Access Requirements
              </CardTitle>
              <CardDescription>
                This page requires specific permissions. Here's what you need:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Page you tried to access:</p>
                  <p className="text-sm text-muted-foreground font-mono bg-muted/50 p-2 rounded">
                    {from}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Required roles:</p>
                  <div className="flex flex-wrap gap-2">
                    {requiredRoles.map((role) => (
                      <Badge key={role} className={`${getRoleColor(role)} text-white flex items-center gap-1`}>
                        {getRoleIcon(role)}
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Your current role:</p>
                  <Badge className={`${getRoleColor(userRole)} text-white flex items-center gap-1`}>
                    {getRoleIcon(userRole)}
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1">
                  <Link href={getDashboardPath(userRole)}>
                    <Home className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Need higher permissions? Contact your administrator or{' '}
            <Link href="/profile" className="text-primary hover:underline">
              check your profile
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
