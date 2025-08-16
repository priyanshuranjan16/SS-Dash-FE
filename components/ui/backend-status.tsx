'use client'

import { useState, useEffect } from 'react'
import { Badge } from './badge'
import { Button } from './button'
import { AlertCircle, CheckCircle, RefreshCw, Info } from 'lucide-react'
import { motion } from 'framer-motion'

interface BackendStatusProps {
  className?: string
}

export function BackendStatus({ className }: BackendStatusProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const checkBackendStatus = async () => {
    setStatus('checking')
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch('http://localhost:4000/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        setStatus('online')
      } else {
        setStatus('offline')
      }
    } catch (error) {
      // Silently handle network errors (backend not running)
      // Only log if it's not a network connectivity issue
      if (error instanceof TypeError && error.message.includes('Failed to fetch') || 
          error.name === 'AbortError') {
        // This is expected when backend is not running or request times out
        setStatus('offline')
      } else {
        console.error('Backend status check failed:', error)
        setStatus('offline')
      }
    }
    setLastChecked(new Date())
  }

  useEffect(() => {
    checkBackendStatus()
  }, [])

  // Auto-retry when backend is offline (with exponential backoff)
  useEffect(() => {
    if (status === 'offline' && retryCount < 3) {
      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000) // Max 10 seconds
      const timeoutId = setTimeout(() => {
        setRetryCount(prev => prev + 1)
        checkBackendStatus()
      }, retryDelay)
      
      return () => clearTimeout(timeoutId)
    }
  }, [status, retryCount])

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'offline':
        return 'bg-red-500'
      case 'checking':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4" />
      case 'offline':
        return <AlertCircle className="w-4 h-4" />
      case 'checking':
        return <RefreshCw className="w-4 h-4 animate-spin" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Backend Online'
      case 'offline':
        return retryCount > 0 ? `Backend Offline (Retry ${retryCount}/3)` : 'Backend Offline'
      case 'checking':
        return 'Checking...'
      default:
        return 'Unknown'
    }
  }

  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Badge 
        variant="outline" 
        className={`flex items-center gap-1 ${getStatusColor()} text-white border-0`}
      >
        {getStatusIcon()}
        {getStatusText()}
      </Badge>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setRetryCount(0)
          checkBackendStatus()
        }}
        disabled={status === 'checking'}
        className="h-6 px-2"
        title="Refresh backend status"
      >
        <RefreshCw className={`w-3 h-3 ${status === 'checking' ? 'animate-spin' : ''}`} />
      </Button>
      
      {lastChecked && (
        <span className="text-xs text-muted-foreground">
          Last checked: {lastChecked.toLocaleTimeString()}
        </span>
      )}
      
      {status === 'offline' && retryCount >= 3 && (
        <motion.div 
          className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-xs"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>Start the backend server: <code className="bg-amber-100 px-1 rounded">cd backend && npm start</code></span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
