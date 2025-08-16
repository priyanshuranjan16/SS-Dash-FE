'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
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
          <h1 className="text-6xl font-bold text-red-500 mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you are looking for is not available.
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
                <Search className="w-5 h-5" />
                What happened?
              </CardTitle>
              <CardDescription>
                The page you requested could not be found. This might be because:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• The page has been moved or deleted</li>
                <li>• You entered an incorrect URL</li>
                <li>• The page is not yet implemented</li>
                <li>• You don't have permission to access this page</li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1">
                  <Link href="/dashboard">
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
            Need help? Contact support or check our{' '}
            <Link href="/dashboard" className="text-primary hover:underline">
              documentation
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
