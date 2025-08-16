'use client'

import { motion } from 'framer-motion'
import { Button } from './button'
import { Badge } from './badge'
import { 
  Users, 
  BookOpen, 
  Settings, 
  BarChart3, 
  Shield, 
  UserCheck,
  GraduationCap,
  FileText,
  Calendar,
  User
} from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  permission?: string
  role?: 'admin' | 'teacher' | 'student'
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    permission: 'view:dashboard'
  },
  {
    label: 'Courses',
    href: '/courses',
    icon: BookOpen,
    permission: 'view:own-courses'
  },
  {
    label: 'Students',
    href: '/students',
    icon: Users,
    permission: 'view:students',
    role: 'teacher'
  },
  {
    label: 'Assignments',
    href: '/assignments',
    icon: FileText,
    permission: 'submit:assignments'
  },
  {
    label: 'Calendar',
    href: '/calendar',
    icon: Calendar,
    permission: 'view:dashboard'
  },
  {
    label: 'User Management',
    href: '/users',
    icon: Shield,
    permission: 'manage:users',
    role: 'admin'
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    permission: 'view:analytics',
    role: 'admin'
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    permission: 'view:dashboard'
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    permission: 'view:dashboard'
  }
]

export function RoleNav() {
  const { user, hasPermission, isRole } = useAuth()

  if (!user) return null

  const filteredItems = navItems.filter(item => {
    // Check if user has the required permission
    if (item.permission && !hasPermission(item.permission)) {
      return false
    }
    
    // Check if user has the required role
    if (item.role && !isRole(item.role)) {
      return false
    }
    
    return true
  })

  return (
    <motion.nav 
      className="flex flex-wrap gap-2 p-4 bg-card/50 rounded-lg border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
    >
      {filteredItems.map((item, index) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => window.location.href = item.href}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
            {item.role === 'admin' && (
              <Badge variant="destructive" className="text-xs">
                Admin
              </Badge>
            )}
            {item.role === 'teacher' && (
              <Badge variant="secondary" className="text-xs">
                Teacher
              </Badge>
            )}
          </Button>
        </motion.div>
      ))}
    </motion.nav>
  )
}
