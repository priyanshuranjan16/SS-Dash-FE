'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  BarChart3, 
  ArrowRight,
  Shield,
  Zap,
  Globe
} from 'lucide-react'

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: GraduationCap,
      title: "Student Dashboard",
      description: "Track your academic progress, grades, and assignments in real-time"
    },
    {
      icon: Users,
      title: "Teacher Portal",
      description: "Manage classes, grade assignments, and monitor student performance"
    },
    {
      icon: Shield,
      title: "Admin Panel",
      description: "Comprehensive system administration and user management"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Advanced analytics and insights for better decision making"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Dashboard</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The comprehensive educational management platform for students, teachers, and administrators. 
              Please login to continue or create a new account to get started.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                <Zap className="w-5 h-5 mr-2" />
                Login to Continue
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Users className="w-5 h-5 mr-2" />
                Sign Up for New Users
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for educational excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform provides comprehensive tools for managing education at every level
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <div className="flex flex-col items-center text-center space-y-4">
                  <motion.div
                    className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    animate={{ 
                      scale: hoveredFeature === index ? 1.1 : 1,
                      backgroundColor: hoveredFeature === index ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--primary) / 0.1)'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="p-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students, teachers, and administrators who trust Dashboard for their educational needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg">
                  Login Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg">
                  Create Account
                  <Globe className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Dashboard</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Dashboard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
