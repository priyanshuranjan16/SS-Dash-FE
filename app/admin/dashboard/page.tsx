'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar, Search, Users, BookOpen, TrendingUp, Filter, Download, LogOut, Shield, UserCheck, GraduationCap, Clock, Target, Award, Settings, BarChart3, FileText, Loader2, Activity, Database, Server } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, ComposedChart } from 'recharts'
import { useAuth } from '../../../contexts/auth-context'
import { useRouter } from 'next/navigation'
import { RoleNav } from '../../../components/ui/role-nav'
import { api, AdminDashboardData } from '../../../lib/api'
import { detailedChartData } from '../../../lib/dummy-data'

// Fallback mock data for when API fails
const fallbackData: AdminDashboardData = {
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
  recentActivity: [],
  systemHealth: {
    uptime: 0,
    memoryUsage: {},
    activeConnections: 0,
    databaseStatus: 'unknown'
  }
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#dc2626']

export default function AdminDashboardPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  
  // Debug log to see user state
  console.log('AdminDashboard - user:', user, 'authLoading:', authLoading)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [dateRange, setDateRange] = useState('7d')
  const [searchQuery, setSearchQuery] = useState('')
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
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
        
        const response = await api.getAdminDashboard()
        setDashboardData(response.data)
        
        // Log dashboard view activity
        await api.logActivity('viewed_admin_dashboard', { role: user?.role || 'admin' })
        
      } catch (err) {
        console.error('Failed to fetch admin dashboard data:', err)
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
      userGrowth: detailedChartData.userGrowth,
      revenueTrend: detailedChartData.revenueTrend,
      roleDistribution: detailedChartData.gradeDistribution.map((item, index) => ({
        role: item.grade,
        count: item.count,
        percentage: (item.count / detailedChartData.gradeDistribution.reduce((sum, i) => sum + i.count, 0)) * 100,
        color: item.color
      })),
      systemMetrics: detailedChartData.systemMetrics,
      weeklyActivity: detailedChartData.weeklyTeachingHours.map(item => ({
        day: item.day,
        users: item.hours * 10,
        signups: item.classes * 5,
        activity: item.hours + item.classes + item.officeHours
      }))
    }

    // Use detailed chart data as fallback and enhance with API data
    const userGrowth = dashboardData.charts?.monthlyGrowth?.length ? 
      dashboardData.charts.monthlyGrowth.map(item => ({
        month: item.month,
        users: item.growth * 10,
        growth: item.growth
      })) : detailedChartData.userGrowth

    const revenueTrend = dashboardData.charts?.monthlyGrowth?.length ?
      dashboardData.charts.monthlyGrowth.map(item => ({
        month: item.month,
        revenue: item.revenue,
        growth: item.growth
      })) : detailedChartData.revenueTrend

    const roleDistribution = dashboardData.charts?.roleDistribution?.length ?
      dashboardData.charts.roleDistribution.map((item, index) => ({
        role: item.role,
        count: item.count,
        percentage: item.percentage,
        color: COLORS[index] || COLORS[0]
      })) : detailedChartData.gradeDistribution.map((item, index) => ({
        role: item.grade,
        count: item.count,
        percentage: (item.count / detailedChartData.gradeDistribution.reduce((sum, i) => sum + i.count, 0)) * 100,
        color: item.color
      }))

    const systemMetrics = [
      {
        metric: 'Uptime',
        value: Math.round((dashboardData.systemHealth?.uptime || detailedChartData.systemMetrics[0].value) / 3600),
        unit: 'hours',
        status: 'healthy'
      },
      {
        metric: 'Active Connections',
        value: dashboardData.systemHealth?.activeConnections || detailedChartData.systemMetrics[1].value,
        unit: 'connections',
        status: 'healthy'
      },
      {
        metric: 'Database Status',
        value: dashboardData.systemHealth?.databaseStatus === 'healthy' ? 100 : 0,
        unit: '%',
        status: dashboardData.systemHealth?.databaseStatus || 'healthy'
      }
    ]

    const weeklyActivity = dashboardData.charts?.weeklyActivity?.length ?
      dashboardData.charts.weeklyActivity.map(item => ({
        day: item.date,
        users: item.students + item.teachers,
        signups: item.signups,
        activity: item.students + item.teachers + item.signups
      })) : detailedChartData.weeklyTeachingHours.map(item => ({
        day: item.day,
        users: item.hours * 10,
        signups: item.classes * 5,
        activity: item.hours + item.classes + item.officeHours
      }))

    return {
      userGrowth,
      revenueTrend,
      roleDistribution,
      systemMetrics,
      weeklyActivity
    }
  }, [dashboardData])

  const summaryMetrics = [
    {
      title: 'Total Users',
      value: dashboardData?.metrics?.totalUsers?.toString() || '--',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users',
      value: dashboardData?.metrics?.activeUsers?.toString() || '--',
      change: '+8%',
      trend: 'up',
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Weekly Signups',
      value: dashboardData?.metrics?.weeklySignups?.toString() || '--',
      change: '+15%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Revenue',
      value: dashboardData?.metrics?.revenue ? `$${dashboardData.metrics?.revenue.toLocaleString()}` : '--',
      change: '+5%',
      trend: 'up',
      icon: Award,
      color: 'bg-amber-500'
    }
  ]

  const systemHealthMetrics = [
    {
      title: 'System Uptime',
      value: dashboardData?.systemHealth?.uptime ? `${Math.round(dashboardData.systemHealth?.uptime / 3600)}h` : '--',
      status: 'healthy',
      icon: Server,
      color: 'bg-green-500'
    },
    {
      title: 'Active Connections',
      value: dashboardData?.systemHealth?.activeConnections?.toString() || '--',
      status: 'healthy',
      icon: Activity,
      color: 'bg-blue-500'
    },
    {
      title: 'Database Status',
      value: dashboardData?.systemHealth?.databaseStatus || '--',
      status: dashboardData?.systemHealth?.databaseStatus === 'healthy' ? 'healthy' : 'warning',
      icon: Database,
      color: dashboardData?.systemHealth?.databaseStatus === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
    }
  ]

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
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
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Administrator
              </Badge>
            </div>
            <p className="text-muted-foreground">Welcome back, {user?.name || user?.email || 'Admin'}! Monitor system performance and user activity.</p>
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
              <Settings className="w-4 h-4 mr-2" />
              System Settings
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
              placeholder="Search users..."
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
            <option value="90d">This Quarter</option>
          </select>

          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Data
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
              <span>Loading admin dashboard data...</span>
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

              {/* System Health Metrics */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {systemHealthMetrics.map((metric, index) => (
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
                          <span className={`text-${metric.status === 'healthy' ? 'green' : 'yellow'}-500`}>
                            {metric.status}
                          </span>
                          status
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
                {/* User Growth Chart */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>User Growth</CardTitle>
                      <CardDescription>Monthly user growth and signup trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData.userGrowth}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                          <XAxis dataKey="month" />
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
                            dataKey="users" 
                            stroke="#8b5cf6" 
                            fill="#8b5cf6" 
                            fillOpacity={0.6}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Revenue Trend */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trend</CardTitle>
                      <CardDescription>Monthly revenue and growth metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData.revenueTrend}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
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
                {/* Role Distribution */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="lg:col-span-1"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Role Distribution</CardTitle>
                      <CardDescription>User distribution by role</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={chartData.roleDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {chartData.roleDistribution.map((entry, index) => (
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

                {/* Weekly Activity */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="lg:col-span-2"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Activity</CardTitle>
                      <CardDescription>User activity and signups by day</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData.weeklyActivity}>
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
                          <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="signups" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Recent System Activity</CardTitle>
                    <CardDescription>Latest system events and user activities</CardDescription>
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
