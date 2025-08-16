'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar, Search, Users, BookOpen, TrendingUp, Filter, Download, LogOut, Shield, UserCheck, GraduationCap, Clock, Target, Award, Loader2 } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { useAuth } from '../../contexts/auth-context'
import { useRouter } from 'next/navigation'
import { RoleNav } from '../../components/ui/role-nav'
import { api, DashboardData } from '../../lib/api'

// Fallback mock data for when API fails
const fallbackData: DashboardData = {
  metrics: {
    totalUsers: 0,
    activeUsers: 0,
    weeklySignups: 0,
    revenue: 0
  },
  charts: {
    weeklyActivity: [],
    monthlyGrowth: [],
    roleDistribution: []
  },
  recentActivity: []
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#dc2626']

export default function DashboardPage() {
  const { user, logout, hasPermission, isRole, isLoading: authLoading } = useAuth()
  
  // Debug log to see user state
  console.log('StudentDashboard - user:', user, 'authLoading:', authLoading)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [dateRange, setDateRange] = useState('7d')
  const [searchQuery, setSearchQuery] = useState('')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push('/login')
    }
  }, [mounted, user, router, authLoading])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await api.getDashboard()
        setDashboardData(response.data)
        
        // Log dashboard view activity
        await api.logActivity('viewed_dashboard', { role: user?.role || 'student' })
        
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
        setDashboardData(fallbackData)
      } finally {
        setIsLoading(false)
      }
    }

    if (mounted && user) {
      fetchDashboardData()
    }
  }, [mounted, user])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  // Transform API data for charts
  const chartData = useMemo(() => {
    if (!dashboardData || !dashboardData.charts) return {
      courseProgress: [],
      weeklyStudyHours: [],
      gradeDistribution: [],
      skillAssessment: [],
      attendanceTrend: []
    }

    // Transform weekly activity to study hours format
    const weeklyStudyHours = dashboardData.charts?.weeklyActivity?.map(item => ({
      day: item.date,
      hours: item.students * 0.5, // Mock calculation
      subjects: Math.floor(item.students / 10) + 1
    })) || []

    // Transform role distribution to grade distribution format
    const gradeDistribution = dashboardData.charts?.roleDistribution?.map((item, index) => ({
      grade: ['A', 'B', 'C', 'D', 'F'][index] || 'F',
      count: item.count,
      color: COLORS[index] || COLORS[0]
    })) || []

    // Create skill assessment from monthly growth
    const skillAssessment = dashboardData.charts?.monthlyGrowth?.map((item, index) => ({
      skill: ['Programming', 'Mathematics', 'Problem Solving', 'Communication', 'Teamwork', 'Research'][index] || 'Skill',
      value: Math.min(100, Math.max(50, item.growth))
    })) || []

    // Create attendance trend from weekly activity
    const attendanceTrend = dashboardData.charts?.weeklyActivity?.map((item, index) => ({
      week: `Week ${index + 1}`,
      attendance: Math.min(100, Math.max(80, 85 + (item.students % 20)))
    })) || []

    // Create course progress from role distribution
    const courseProgress = dashboardData.charts?.roleDistribution?.map((item, index) => ({
      course: `Course ${index + 1}`,
      progress: Math.min(100, Math.max(60, 70 + (item.count % 30))),
      grade: ['A-', 'B+', 'A', 'B-', 'A-'][index] || 'B+',
      attendance: Math.min(100, Math.max(80, 85 + (item.count % 15)))
    })) || []

    return {
      courseProgress,
      weeklyStudyHours,
      gradeDistribution,
      skillAssessment,
      attendanceTrend
    }
  }, [dashboardData])

  const summaryMetrics = [
    {
      title: 'Current GPA',
      value: dashboardData ? '3.85' : '--',
      change: '+0.12',
      trend: 'up',
      icon: GraduationCap,
      color: 'bg-green-500'
    },
    {
      title: 'Courses Enrolled',
      value: dashboardData?.metrics?.totalUsers?.toString() || '--',
      change: 'Current',
      trend: 'stable',
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Study Hours',
      value: dashboardData ? '31.6' : '--',
      change: '+2.3',
      trend: 'up',
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      title: 'Attendance Rate',
      value: dashboardData ? '90.5%' : '--',
      change: '+1.2%',
      trend: 'up',
      icon: Target,
      color: 'bg-amber-500'
    }
  ]

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
              <p className="text-muted-foreground">
                {authLoading ? 'Loading authentication...' : 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <motion.div 
      className="min-h-screen bg-background p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Student
              </Badge>
            </div>
            <p className="text-muted-foreground">Welcome back, {user?.name || user?.email || 'Student'}! Track your academic progress and performance.</p>
          </div>
          <motion.div 
            className="flex gap-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        </motion.div>

        {/* Role-based Navigation */}
        <RoleNav />

        {/* Error Message */}
        {error && (
          <motion.div 
            className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-1">Showing fallback data</p>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="7d">This Week</option>
            <option value="30d">This Month</option>
            <option value="semester">This Semester</option>
          </select>

          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Courses
          </Button>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div 
            className="flex items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading dashboard data...</span>
            </div>
          </motion.div>
        )}

        {/* Dashboard Content */}
        <AnimatePresence>
          {!isLoading && (
            <>
              {/* Summary Metrics */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {summaryMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="hover:shadow-lg">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {metric.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${metric.color}`}>
                          <metric.icon className="w-4 h-4 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <span className={`text-${metric.trend === 'up' ? 'green' : metric.trend === 'down' ? 'red' : 'blue'}-500`}>
                            {metric.change}
                          </span>
                          from last month
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Charts Section */}
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Course Progress Chart */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Progress</CardTitle>
                      <CardDescription>Your current progress across all enrolled courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.courseProgress}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                          <XAxis dataKey="course" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="progress" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Weekly Study Hours */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Study Hours</CardTitle>
                      <CardDescription>Your study time distribution throughout the week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData.weeklyStudyHours}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="hours" 
                            stroke="#06b6d4" 
                            fill="#06b6d4" 
                            fillOpacity={0.6}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Additional Charts */}
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Grade Distribution */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="lg:col-span-1"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Grade Distribution</CardTitle>
                      <CardDescription>Your grade breakdown this semester</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={chartData.gradeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {chartData.gradeDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Skills Assessment */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="lg:col-span-2"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills Assessment</CardTitle>
                      <CardDescription>Your proficiency in different academic areas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <RadarChart data={chartData.skillAssessment}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="skill" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar 
                            name="Skills" 
                            dataKey="value" 
                            stroke="#8b5cf6" 
                            fill="#8b5cf6" 
                            fillOpacity={0.3} 
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Attendance Trend */}
              <motion.div 
                className="grid grid-cols-1 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Trend</CardTitle>
                    <CardDescription>Your attendance rate over the past 8 weeks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData.attendanceTrend}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                        <XAxis dataKey="week" />
                        <YAxis domain={[80, 100]} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="attendance" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Academic Activity</CardTitle>
                    <CardDescription>Your latest academic achievements and activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData?.recentActivity?.length ? (
                        dashboardData.recentActivity?.slice(0, 5).map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Award className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{activity.action}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(activity.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {activity.action.split('_')[0]}
                            </Badge>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No recent activity to display</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
