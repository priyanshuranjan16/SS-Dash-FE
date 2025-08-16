import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type UserRole = 'student' | 'teacher' | 'admin'

/**
 * Get the default dashboard URL for a given user role
 */
export function getDashboardUrl(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'teacher':
      return '/teacher/dashboard'
    case 'student':
    default:
      return '/dashboard'
  }
}

/**
 * Check if a user has permission to access a specific route
 */
export function hasRoutePermission(userRole: UserRole, route: string): boolean {
  const routePermissions: Record<string, UserRole[]> = {
    '/dashboard': ['student', 'teacher', 'admin'],
    '/admin/dashboard': ['admin'],
    '/teacher/dashboard': ['teacher', 'admin'],
    '/student/dashboard': ['student', 'teacher', 'admin'],
    '/courses': ['student', 'teacher', 'admin'],
    '/students': ['teacher', 'admin'],
    '/assignments': ['student', 'teacher', 'admin'],
    '/analytics': ['admin'],
    '/users': ['admin'],
    '/settings': ['student', 'teacher', 'admin'],
    '/profile': ['student', 'teacher', 'admin']
  }

  const allowedRoles = routePermissions[route] || []
  return allowedRoles.includes(userRole)
}

/**
 * Get the role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Administrator'
    case 'teacher':
      return 'Teacher'
    case 'student':
      return 'Student'
    default:
      return 'User'
  }
}

/**
 * Get the role badge color
 */
export function getRoleBadgeColor(role: UserRole): string {
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
