'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, RefreshCw, AlertTriangle, Bug } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

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
            <Bug className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-orange-500 mb-2">Oops!</h1>
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">
            An unexpected error occurred. Please try again.
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
                <AlertTriangle className="w-5 h-5" />
                Error Details
              </CardTitle>
              <CardDescription>
                We're sorry for the inconvenience. Here's what you can do:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {error.message || 'Unknown error occurred'}
                </p>
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={reset} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/dashboard">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Dashboard
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
            If this problem persists, please{' '}
            <Link href="/dashboard" className="text-primary hover:underline">
              contact support
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
