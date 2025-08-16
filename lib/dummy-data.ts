import { AdminDashboardData, TeacherDashboardData } from './api'

// Generate random data within realistic ranges
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min

// Generate weekly activity data
const generateWeeklyActivity = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map(day => ({
    date: day,
    students: randomBetween(150, 300),
    teachers: randomBetween(20, 50),
    signups: randomBetween(5, 25)
  }))
}

// Generate monthly growth data
const generateMonthlyGrowth = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map(month => ({
    month,
    growth: randomBetween(5, 25),
    revenue: randomBetween(5000, 25000)
  }))
}

// Generate role distribution data
const generateRoleDistribution = () => [
  { role: 'Students', count: randomBetween(800, 1200), percentage: 65 },
  { role: 'Teachers', count: randomBetween(80, 150), percentage: 25 },
  { role: 'Admins', count: randomBetween(10, 30), percentage: 10 }
]

// Generate recent activity data
const generateRecentActivity = () => {
  const activities = [
    'user_registered',
    'course_created',
    'assignment_submitted',
    'grade_updated',
    'announcement_posted',
    'file_uploaded',
    'discussion_started',
    'quiz_completed',
    'feedback_submitted',
    'profile_updated'
  ]
  
  const users = [
    'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
    'Lisa Anderson', 'Robert Taylor', 'Jennifer Martinez', 'Christopher Garcia',
    'Amanda Rodriguez', 'James Lee', 'Michelle White', 'Daniel Thompson'
  ]

  return Array.from({ length: 10 }, (_, i) => ({
    user: users[randomBetween(0, users.length - 1)],
    action: activities[randomBetween(0, activities.length - 1)],
    timestamp: new Date(Date.now() - randomBetween(0, 7 * 24 * 60 * 60 * 1000)).toISOString(),
    details: {
      course: `Course ${randomBetween(1, 10)}`,
      grade: randomBetween(60, 100),
      department: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'][randomBetween(0, 4)]
    }
  }))
}

// Generate system health data
const generateSystemHealth = () => ({
  uptime: randomBetween(7200, 86400), // 2-24 hours in seconds
  memoryUsage: {
    used: randomBetween(60, 85),
    available: randomBetween(15, 40),
    total: 100
  },
  activeConnections: randomBetween(50, 200),
  databaseStatus: ['healthy', 'warning', 'error'][randomBetween(0, 2)]
})

// Generate teaching stats data
const generateTeachingStats = () => ({
  totalStudents: randomBetween(80, 200),
  activeStudents: randomBetween(60, 150),
  coursesTaught: randomBetween(3, 8),
  averageGrade: randomFloat(3.0, 4.0).toFixed(1)
})

// Admin Dashboard Dummy Data
export const adminDashboardData: AdminDashboardData = {
  metrics: {
    totalUsers: 1247,
    activeUsers: 892,
    weeklySignups: 34,
    revenue: 18750
  },
  charts: {
    weeklyActivity: generateWeeklyActivity(),
    monthlyGrowth: generateMonthlyGrowth(),
    roleDistribution: generateRoleDistribution()
  },
  recentActivity: generateRecentActivity(),
  systemHealth: generateSystemHealth()
}

// Teacher Dashboard Dummy Data
export const teacherDashboardData: TeacherDashboardData = {
  metrics: {
    totalUsers: 1247,
    activeUsers: 892,
    weeklySignups: 34,
    revenue: 18750
  },
  charts: {
    weeklyActivity: generateWeeklyActivity(),
    monthlyGrowth: generateMonthlyGrowth(),
    roleDistribution: generateRoleDistribution()
  },
  recentActivity: generateRecentActivity(),
  teachingStats: generateTeachingStats()
}

// Additional detailed data for charts
export const detailedChartData = {
  // Student Performance Data
  studentPerformance: [
    { student: 'Alice Johnson', course: 'Advanced Mathematics', grade: 92, attendance: 95, participation: 88 },
    { student: 'Bob Smith', course: 'Physics 101', grade: 87, attendance: 92, participation: 85 },
    { student: 'Carol Davis', course: 'Computer Science', grade: 94, attendance: 98, participation: 92 },
    { student: 'David Wilson', course: 'Chemistry Lab', grade: 89, attendance: 90, participation: 87 },
    { student: 'Eva Brown', course: 'Literature', grade: 91, attendance: 94, participation: 90 },
    { student: 'Frank Miller', course: 'History', grade: 85, attendance: 88, participation: 82 },
    { student: 'Grace Lee', course: 'Biology', grade: 93, attendance: 96, participation: 89 },
    { student: 'Henry Taylor', course: 'Economics', grade: 88, attendance: 91, participation: 86 }
  ],

  // Course Analytics Data
  courseAnalytics: [
    { course: 'Advanced Mathematics', students: 45, avgGrade: 87.2, completion: 92, satisfaction: 4.3 },
    { course: 'Physics 101', students: 38, avgGrade: 84.5, completion: 89, satisfaction: 4.1 },
    { course: 'Computer Science', students: 52, avgGrade: 89.1, completion: 95, satisfaction: 4.5 },
    { course: 'Chemistry Lab', students: 32, avgGrade: 86.8, completion: 88, satisfaction: 4.2 },
    { course: 'Literature', students: 41, avgGrade: 88.3, completion: 91, satisfaction: 4.4 },
    { course: 'History', students: 35, avgGrade: 83.7, completion: 87, satisfaction: 4.0 }
  ],

  // Weekly Teaching Hours Data
  weeklyTeachingHours: [
    { day: 'Mon', hours: 6, classes: 3, officeHours: 2 },
    { day: 'Tue', hours: 8, classes: 4, officeHours: 1 },
    { day: 'Wed', hours: 5, classes: 2, officeHours: 3 },
    { day: 'Thu', hours: 7, classes: 3, officeHours: 2 },
    { day: 'Fri', hours: 4, classes: 2, officeHours: 1 },
    { day: 'Sat', hours: 2, classes: 1, officeHours: 0 },
    { day: 'Sun', hours: 0, classes: 0, officeHours: 0 }
  ],

  // Student Engagement Data
  studentEngagement: [
    { metric: 'Class Participation', value: 87, target: 85 },
    { metric: 'Assignment Completion', value: 92, target: 90 },
    { metric: 'Office Hours Attendance', value: 78, target: 80 },
    { metric: 'Discussion Forum Activity', value: 84, target: 85 },
    { metric: 'Peer Collaboration', value: 89, target: 88 }
  ],

  // Grade Distribution Data
  gradeDistribution: [
    { grade: 'A', count: 45, color: '#10b981' },
    { grade: 'B', count: 38, color: '#3b82f6' },
    { grade: 'C', count: 25, color: '#f59e0b' },
    { grade: 'D', count: 12, color: '#ef4444' },
    { grade: 'F', count: 5, color: '#dc2626' }
  ],

  // Teaching Efficiency Data
  teachingEfficiency: [
    { month: 'Jan', efficiency: 87, studentSatisfaction: 4.2, workload: 75 },
    { month: 'Feb', efficiency: 89, studentSatisfaction: 4.3, workload: 78 },
    { month: 'Mar', efficiency: 91, studentSatisfaction: 4.4, workload: 72 },
    { month: 'Apr', efficiency: 88, studentSatisfaction: 4.1, workload: 80 },
    { month: 'May', efficiency: 93, studentSatisfaction: 4.5, workload: 70 },
    { month: 'Jun', efficiency: 90, studentSatisfaction: 4.3, workload: 73 }
  ],

  // User Growth Data
  userGrowth: [
    { month: 'Jan', users: 850, growth: 12 },
    { month: 'Feb', users: 920, growth: 8 },
    { month: 'Mar', users: 980, growth: 7 },
    { month: 'Apr', users: 1050, growth: 7 },
    { month: 'May', users: 1120, growth: 7 },
    { month: 'Jun', users: 1180, growth: 5 },
    { month: 'Jul', users: 1247, growth: 6 }
  ],

  // Revenue Trend Data
  revenueTrend: [
    { month: 'Jan', revenue: 12500, growth: 15 },
    { month: 'Feb', revenue: 13800, growth: 10 },
    { month: 'Mar', revenue: 15200, growth: 10 },
    { month: 'Apr', revenue: 16500, growth: 9 },
    { month: 'May', revenue: 17800, growth: 8 },
    { month: 'Jun', revenue: 18750, growth: 5 }
  ],

  // System Metrics Data
  systemMetrics: [
    { metric: 'Uptime', value: 18, unit: 'hours', status: 'healthy' },
    { metric: 'Active Connections', value: 156, unit: 'connections', status: 'healthy' },
    { metric: 'Database Status', value: 100, unit: '%', status: 'healthy' }
  ]
}

// Mock API functions that return dummy data
export const mockApi = {
  getAdminDashboard: async (): Promise<{ success: boolean; data: AdminDashboardData }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: adminDashboardData
    }
  },

  getTeacherDashboard: async (): Promise<{ success: boolean; data: TeacherDashboardData }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: teacherDashboardData
    }
  },

  logActivity: async (action: string, details?: any): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    console.log('Activity logged:', action, details)
    return {
      success: true,
      message: 'Activity logged successfully'
    }
  }
}
