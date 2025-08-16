'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, RefreshCw, AlertTriangle, Bug } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
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
                <Bug className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-4xl font-bold text-red-500 mb-2">Critical Error</h1>
              <h2 className="text-2xl font-semibold mb-2">Application Failed</h2>
              <p className="text-muted-foreground">
                A critical error occurred and the application cannot continue.
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
                    System Error
                  </CardTitle>
                  <CardDescription>
                    The application encountered a critical error. Please try the following:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-mono text-muted-foreground break-all">
                      {error.message || 'Unknown critical error'}
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
                      Restart App
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/">
                        <Home className="w-4 h-4 mr-2" />
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
                If this problem persists, please contact technical support immediately.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </body>
    </html>
  )
}
