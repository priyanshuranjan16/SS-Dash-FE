'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  User, 
  Mail, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Shield, 
  UserCheck, 
  Users,
  Settings,
  LogOut,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  BookOpen,
  GraduationCap,
  FileText,
  Calendar,
  BarChart3,
  Database,
  UserPlus,
  Bell,
  Award,
  Target,
  Clock
} from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'
import { useRouter } from 'next/navigation'
import { api, ProfileData } from '../../lib/api'

export default function ProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Dedicated student pursuing excellence in computer science and software development. Passionate about learning and building innovative solutions.',
    avatar: `data:image/svg+xml;base64,${btoa(`
      <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <circle cx="75" cy="50" r="25" fill="#9ca3af"/>
        <rect x="37.5" y="90" width="75" height="12" rx="6" fill="#9ca3af"/>
        <rect x="50" y="112.5" width="50" height="12" rx="6" fill="#9ca3af"/>
      </svg>
    `)}`,
    role: 'student',
    joinDate: '2023-01-15',
    lastActive: '2024-01-20'
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !user && !authLoading) {
      console.log('Profile page - redirecting to login because user is null and not loading') // Debug log
      router.push('/login')
    }
  }, [mounted, user, router, authLoading])

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (user && mounted) {
        console.log('Profile page - fetching profile for user:', user) // Debug log
        try {
          setIsLoading(true)
          setError(null)
          const response = await api.getProfile()
          console.log('Profile page - API response:', response) // Debug log
          // Ensure avatar is never empty
          const userData = {
            ...response.user,
            avatar: response.user.avatar || `data:image/svg+xml;base64,${btoa(`
              <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f3f4f6"/>
                <circle cx="75" cy="50" r="25" fill="#9ca3af"/>
                <rect x="37.5" y="90" width="75" height="12" rx="6" fill="#9ca3af"/>
                <rect x="50" y="112.5" width="50" height="12" rx="6" fill="#9ca3af"/>
              </svg>
            `)}`
          }
          setProfileData(userData)
        } catch (error) {
          console.error('Failed to fetch profile:', error)
          setError(error instanceof Error ? error.message : 'Failed to load profile')
          
          // Fallback to mock data if API fails
          const getRoleSpecificData = () => {
            const baseData = {
              name: user.name || 'John Doe',
              email: user.email || 'john@example.com',
              role: user.role,
              joinDate: '2023-01-15',
              lastActive: '2024-01-20',
              avatar: `data:image/svg+xml;base64,${btoa(`
                <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#f3f4f6"/>
                  <circle cx="75" cy="50" r="25" fill="#9ca3af"/>
                  <rect x="37.5" y="90" width="75" height="12" rx="6" fill="#9ca3af"/>
                  <rect x="50" y="112.5" width="50" height="12" rx="6" fill="#9ca3af"/>
                </svg>
              `)}`
            }

            switch (user.role) {
              case 'teacher':
                return {
                  ...baseData,
                  bio: 'Passionate educator with 5+ years of experience in computer science and mathematics. Committed to fostering student growth and innovation in technology education.',
                  department: 'Computer Science & Engineering',
                  specialization: 'Software Engineering, AI & Machine Learning',
                  courses: [
                    'CS101: Introduction to Programming',
                    'CS201: Data Structures & Algorithms', 
                    'CS301: Advanced Algorithms',
                    'CS401: Machine Learning Fundamentals',
                    'CS501: Software Engineering Principles'
                  ],
                  achievements: [
                    'Best Teacher Award 2023 - Computer Science Department',
                    'Published 15 Research Papers in Top-tier Journals',
                    'Mentored 50+ Students to Successful Careers',
                    'Led 3 National Research Projects',
                    'Speaker at 5 International Conferences'
                  ],
                  certifications: [
                    'Google Certified Educator Level 2',
                    'Microsoft Certified Trainer (MCT)',
                    'AWS Certified Solutions Architect',
                    'Certified Scrum Master (CSM)',
                    'Oracle Certified Professional Java Programmer'
                  ],
                  officeHours: 'Mon, Wed, Fri 2:00 PM - 4:00 PM | Tue, Thu 10:00 AM - 12:00 PM',
                  researchInterests: [
                    'Machine Learning & Artificial Intelligence',
                    'Computer Vision & Image Processing',
                    'Educational Technology & E-Learning',
                    'Natural Language Processing',
                    'Software Engineering & DevOps'
                  ],
                  publications: [
                    '"AI in Education: A Comprehensive Review" - IEEE Transactions on Education, 2023',
                    '"Student Performance Prediction Using Machine Learning" - ACM SIGCSE, 2022',
                    '"Adaptive Learning Systems: A Survey" - International Journal of Educational Technology, 2023',
                    '"Computer Vision Applications in Educational Assessment" - Computer Vision and Pattern Recognition, 2022'
                  ],
                  teachingExperience: 7,
                  studentCount: 156,
                  courseCount: 12,
                  averageRating: 4.9
                }
              
              case 'admin':
                return {
                  ...baseData,
                  bio: 'System administrator with expertise in educational technology and platform management. Ensuring secure, efficient, and scalable learning environments.',
                  systemAccess: [
                    'User Management & Role Assignment',
                    'System Configuration & Settings',
                    'Analytics Dashboard & Reporting',
                    'Security Settings & Access Control',
                    'Database Management & Backup',
                    'API Management & Integration',
                    'Log Monitoring & Audit Trails',
                    'Performance Monitoring & Optimization'
                  ],
                  permissions: [
                    'view:all-users', 'manage:users', 'view:analytics', 
                    'manage:system', 'manage:roles', 'manage:security',
                    'manage:database', 'manage:api', 'view:logs',
                    'manage:performance', 'manage:backups'
                  ],
                  lastLogin: '2024-01-20 14:30:00 UTC',
                  ipAddress: '192.168.1.100 (Internal Network)',
                  deviceInfo: 'Chrome 120.0.0.0 on Windows 11 Pro (Build 22621)'
                }
              
              case 'student':
              default:
                return {
                  ...baseData,
                  bio: 'Dedicated student pursuing excellence in computer science and software development. Passionate about learning and building innovative solutions.',
                  completedCourses: 18,
                  currentCourses: 5,
                  gpa: 3.92,
                  major: 'Computer Science & Engineering',
                  graduationYear: 2025,
                  academicStanding: 'Dean\'s List - Outstanding Academic Performance',
                  advisor: 'Dr. Sarah Johnson, Ph.D.',
                  thesis: 'Machine Learning Applications in Educational Technology: A Comprehensive Study',
                  internships: [
                    'Google Summer Internship 2023 - Software Engineering',
                    'Microsoft Research Internship 2022 - AI/ML',
                    'Amazon Web Services Internship 2022 - Cloud Computing',
                    'Meta AI Research Internship 2023 - Computer Vision'
                  ],
                  skills: [
                    'JavaScript/TypeScript', 'Python', 'React/Next.js', 'Node.js', 
                    'Machine Learning', 'TensorFlow', 'PyTorch', 'AWS/Azure',
                    'Docker', 'Kubernetes', 'Git', 'SQL/NoSQL'
                  ],
                  languages: ['English (Native)', 'Spanish (Fluent)', 'Mandarin (Intermediate)']
                }
            }
          }

          setProfileData(getRoleSpecificData())
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchProfile()
  }, [user, mounted])

  // Update form data when profile data changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: profileData.name,
      email: profileData.email,
      bio: profileData.bio
    }))
  }, [profileData])

  const handleLogout = async () => {
    try {
      await api.logout()
      logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Still logout locally even if API call fails
      logout()
      router.push('/login')
    }
  }

  const handleEdit = () => {
    setFormData({
      name: profileData.name,
      email: profileData.email,
      bio: profileData.bio,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setErrors({})
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsChangingPassword(false)
    setErrors({})
  }

  const handleSave = async () => {
    const newErrors: Record<string, string> = {}

    // Validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (isChangingPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required'
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required'
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters'
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      if (isChangingPassword) {
        // Handle password change
        await api.changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
        setSuccess('Password updated successfully!')
      } else {
        // Handle profile update
        const response = await api.updateProfile({
          name: formData.name,
          email: formData.email,
          bio: formData.bio
        })
        
        // Update local profile data
        setProfileData(prev => ({
          ...prev,
          name: formData.name,
          email: formData.email,
          bio: formData.bio
        }))
        
        setSuccess('Profile updated successfully!')
      }

      setIsEditing(false)
      setIsChangingPassword(false)
      setErrors({})
    } catch (error) {
      console.error('Failed to update profile:', error)
      setError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfileData(prev => ({
          ...prev,
          avatar: result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />
      case 'teacher':
        return <UserCheck className="w-4 h-4" />
      case 'student':
        return <Users className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600'
      case 'teacher':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'student':
        return 'bg-green-500 hover:bg-green-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getRoleGradient = (role: string) => {
    switch (role) {
      case 'admin':
        return 'from-red-500 to-red-600'
      case 'teacher':
        return 'from-blue-500 to-blue-600'
      case 'student':
        return 'from-green-500 to-green-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              {authLoading ? 'Checking authentication...' : 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Authentication Required</h1>
            <p className="text-muted-foreground mb-4">
              You need to be logged in to view your profile.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you're seeing this message, it might be because:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Your backend server is not running</li>
                <li>• Your authentication token has expired</li>
                <li>• You need to log in again</li>
              </ul>
              <div className="mt-6 space-x-4">
                <Button onClick={() => router.push('/login')}>
                  Go to Login
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="min-h-screen bg-background p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              {user?.role === 'teacher' 
                ? 'Manage your teaching profile and academic information'
                : user?.role === 'admin'
                ? 'System administration profile and security settings'
                : 'Manage your academic profile and personal information'
              }
            </p>
          </div>
          <motion.div 
            className="flex gap-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        </motion.div>

        {/* Error and Success Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <motion.div
                    className="relative group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAvatarClick}
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border bg-muted">
                      {profileData.avatar && (
                        <img
                          src={profileData.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleAvatarClick}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                                         <Button 
                       variant="outline" 
                       size="sm"
                       onClick={() => setProfileData(prev => ({ 
                         ...prev, 
                         avatar: `data:image/svg+xml;base64,${btoa(`
                           <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                             <rect width="100%" height="100%" fill="#f3f4f6"/>
                             <circle cx="75" cy="50" r="25" fill="#9ca3af"/>
                             <rect x="37.5" y="90" width="75" height="12" rx="6" fill="#9ca3af"/>
                             <rect x="50" y="112.5" width="50" height="12" rx="6" fill="#9ca3af"/>
                           </svg>
                         `)}`
                       }))}
                     >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>

                                 {/* Role Badge */}
                 <div className="flex justify-center">
                   <Badge className={`bg-gradient-to-r ${getRoleGradient(profileData.role)} text-white flex items-center gap-1 shadow-lg`}>
                     {getRoleIcon(profileData.role)}
                     {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                   </Badge>
                 </div>

                                 {/* Account Info */}
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-muted-foreground">Member since:</span>
                     <span>{new Date(profileData.joinDate).toLocaleDateString()}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-muted-foreground">Last active:</span>
                     <span>{new Date(profileData.lastActive).toLocaleDateString()}</span>
                   </div>
                   <div className="pt-2 border-t border-border">
                     <p className="text-xs text-center text-muted-foreground">
                       {user?.role === 'teacher' 
                         ? '🎓 Teaching Excellence'
                         : user?.role === 'admin'
                         ? '⚙️ System Administrator'
                         : '📚 Academic Excellence'
                       }
                     </p>
                   </div>
                 </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal details and preferences
                    </CardDescription>
                  </div>
                  <AnimatePresence mode="wait">
                    {!isEditing ? (
                      <motion.div
                        key="edit"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button onClick={handleEdit} size="sm">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="actions"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-2"
                      >
                        <Button onClick={handleSave} size="sm" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <div className="space-y-1">
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <motion.p 
                            className="text-sm text-red-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">{profileData.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <div className="space-y-1">
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                        />
                        {errors.email && (
                          <motion.p 
                            className="text-sm text-red-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">{profileData.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <div className="space-y-1">
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">{profileData.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Password Change Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Update your password and security preferences
                    </CardDescription>
                  </div>
                  <AnimatePresence mode="wait">
                    {!isChangingPassword ? (
                      <motion.div
                        key="change-password"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsChangingPassword(true)}
                        >
                          Change Password
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="password-actions"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-2"
                      >
                        <Button onClick={handleSave} size="sm" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Update Password
                            </>
                          )}
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {isChangingPassword ? (
                    <motion.div
                      key="password-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            placeholder="Enter current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        {errors.currentPassword && (
                          <motion.p 
                            className="text-sm text-red-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {errors.currentPassword}
                          </motion.p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Enter new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        {errors.newPassword && (
                          <motion.p 
                            className="text-sm text-red-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {errors.newPassword}
                          </motion.p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        {errors.confirmPassword && (
                          <motion.p 
                            className="text-sm text-red-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {errors.confirmPassword}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="password-info"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-muted-foreground"
                    >
                      <p>Your password was last changed on {new Date(profileData.lastActive).toLocaleDateString()}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Role-Based Sections */}
            
            {/* Teacher Section */}
            {profileData.role === 'teacher' && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Teaching Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Teaching Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Department</Label>
                        <p className="text-sm text-muted-foreground">{profileData.department}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Specialization</Label>
                        <p className="text-sm text-muted-foreground">{profileData.specialization}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Teaching Experience</Label>
                        <p className="text-sm text-muted-foreground">{profileData.teachingExperience} years</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Office Hours</Label>
                        <p className="text-sm text-muted-foreground">{profileData.officeHours}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Teaching Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Teaching Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profileData.studentCount}</div>
                        <div className="text-sm text-muted-foreground">Students</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{profileData.courseCount}</div>
                        <div className="text-sm text-muted-foreground">Courses</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-950">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{profileData.averageRating}</div>
                        <div className="text-sm text-muted-foreground">Rating</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Current Courses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {profileData.courses?.map((course, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{course}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements & Certifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Achievements & Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Achievements</Label>
                      <div className="mt-2 space-y-1">
                        {profileData.achievements?.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Award className="w-3 h-3 text-amber-500" />
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Certifications</Label>
                      <div className="mt-2 space-y-1">
                        {profileData.certifications?.map((cert, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Shield className="w-3 h-3 text-green-500" />
                            {cert}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Research & Publications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Research & Publications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Research Interests</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profileData.researchInterests?.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Publications</Label>
                      <div className="mt-2 space-y-2">
                        {profileData.publications?.map((pub, index) => (
                          <div key={index} className="text-sm p-2 rounded-lg bg-muted">
                            {pub}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Student Section */}
            {profileData.role === 'student' && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Academic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Academic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Major</Label>
                        <p className="text-sm text-muted-foreground">{profileData.major}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Graduation Year</Label>
                        <p className="text-sm text-muted-foreground">{profileData.graduationYear}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Academic Standing</Label>
                        <p className="text-sm text-muted-foreground">{profileData.academicStanding}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Academic Advisor</Label>
                        <p className="text-sm text-muted-foreground">{profileData.advisor}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Academic Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Academic Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profileData.gpa}</div>
                        <div className="text-sm text-muted-foreground">GPA</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{profileData.completedCourses}</div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{profileData.currentCourses}</div>
                        <div className="text-sm text-muted-foreground">Current</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills & Languages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Skills & Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Technical Skills</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profileData.skills?.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Languages</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profileData.languages?.map((language, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Internships & Experience */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Internships & Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {profileData.internships?.map((internship, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{internship}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Thesis/Research */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Thesis/Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-muted">
                        <Label className="text-sm font-medium">Thesis Topic</Label>
                        <p className="text-sm text-muted-foreground mt-1">{profileData.thesis}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Admin Section */}
            {profileData.role === 'admin' && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* System Access */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      System Access & Permissions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">System Access</Label>
                      <div className="mt-2 space-y-1">
                        {profileData.systemAccess?.map((access, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Database className="w-3 h-3 text-blue-500" />
                            {access}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Permissions</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profileData.permissions?.map((permission, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* System Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      System Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Last Login</Label>
                        <p className="text-sm text-muted-foreground">{profileData.lastLogin}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">IP Address</Label>
                        <p className="text-sm text-muted-foreground">{profileData.ipAddress}</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium">Device Information</Label>
                        <p className="text-sm text-muted-foreground">{profileData.deviceInfo}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Quick Admin Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button variant="outline" size="sm" className="justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Users
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        System Settings
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Bell className="w-4 h-4 mr-2" />
                        System Notifications
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
