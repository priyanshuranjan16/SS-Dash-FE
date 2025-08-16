'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, AlertTriangle, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface ErrorMessageProps {
  title?: string
  message?: string
  showDashboardLink?: boolean
  onDismiss?: () => void
  variant?: 'inline' | 'card' | 'full'
}

export function ErrorMessage({
  title = 'Error',
  message = 'Something went wrong. Please try again.',
  showDashboardLink = true,
  onDismiss,
  variant = 'card'
}: ErrorMessageProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
      >
        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">{title}</p>
          <p className="text-xs text-red-600 dark:text-red-300">{message}</p>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </motion.div>
    )
  }

  if (variant === 'full') {
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
            <div className="w-24 h-24 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-red-500 mb-2">Error</h1>
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground">{message}</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  What can you do?
                </CardTitle>
                <CardDescription>
                  Here are some options to resolve this issue:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {showDashboardLink && (
                    <Button asChild className="flex-1">
                      <Link href="/dashboard">
                        <Home className="w-4 h-4 mr-2" />
                        Go to Dashboard
                      </Link>
                    </Button>
                  )}
                  {onDismiss && (
                    <Button variant="outline" onClick={handleDismiss} className="flex-1">
                      <X className="w-4 h-4 mr-2" />
                      Dismiss
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Default card variant
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-red-500/20 bg-red-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              {title}
            </CardTitle>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          <CardDescription className="text-red-600 dark:text-red-300">
            {message}
          </CardDescription>
        </CardHeader>
        {showDashboardLink && (
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}
