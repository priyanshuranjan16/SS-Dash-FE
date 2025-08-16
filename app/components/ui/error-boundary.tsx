'use client'

import React, { Component, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
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
                <AlertTriangle className="w-12 h-12 text-orange-500" />
              </div>
              <h1 className="text-4xl font-bold text-orange-500 mb-2">Oops!</h1>
              <h2 className="text-2xl font-semibold mb-2">Component Error</h2>
              <p className="text-muted-foreground">
                Something went wrong with this component.
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
                    Component Error
                  </CardTitle>
                  <CardDescription>
                    This component encountered an error. You can try to recover:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-mono text-muted-foreground break-all">
                      {this.state.error?.message || 'Unknown component error'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                      onClick={() => this.setState({ hasError: false, error: undefined })}
                      className="flex-1"
                    >
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
          </div>
        </motion.div>
      )
    }

    return this.props.children
  }
}
