'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Home, Construction, Clock, ArrowLeft, Github } from 'lucide-react'
import Link from 'next/link'

interface NotImplementedProps {
  pageName?: string
  description?: string
  estimatedCompletion?: string
  showDashboardLink?: boolean
  showHomeLink?: boolean
}

export function NotImplemented({
  pageName = 'This Page',
  description = 'This page is currently under development and will be available soon.',
  estimatedCompletion = 'Coming Soon',
  showDashboardLink = true,
  showHomeLink = true
}: NotImplementedProps) {
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
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Construction className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-blue-500 mb-2">Under Construction</h1>
          <h2 className="text-2xl font-semibold mb-2">{pageName}</h2>
          <p className="text-muted-foreground">
            {description}
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
                <Clock className="w-5 h-5" />
                Development Status
              </CardTitle>
              <CardDescription>
                We're working hard to bring you this feature. Here's what's happening:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Construction className="w-3 h-3" />
                    In Development
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estimated Release:</span>
                  <Badge variant="outline">{estimatedCompletion}</Badge>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Our development team is actively working on this feature. 
                    You'll be notified when it's ready!
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {showDashboardLink && (
                  <Button asChild className="flex-1">
                    <Link href="/dashboard">
                      <Home className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </Link>
                  </Button>
                )}
                {showHomeLink && (
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Go Home
                    </Link>
                  </Button>
                )}
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
            Want to contribute? Check out our{' '}
            <Link href="#" className="text-primary hover:underline flex items-center justify-center gap-1 mt-2">
              <Github className="w-4 h-4" />
              GitHub repository
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
