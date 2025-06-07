"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"
import { 
  Users, 
  Building, 
  GraduationCap, 
  FileText, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Server,
  Database,
  HardDrive,
  Cpu,
  RefreshCw,
  Download,
  Calendar,
  Clock
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface SystemStats {
  overview: {
    totalUsers: number
    totalOrganizations: number
    totalClasses: number
    totalExams: number
    totalStudents: number
    activeUsers: number
  }
  performance: {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
    networkIO: number
    responseTime: number
    uptime: number
  }
  activity: {
    dailyLogins: Array<{ date: string; count: number }>
    examActivity: Array<{ date: string; created: number; completed: number }>
    userGrowth: Array<{ month: string; users: number; organizations: number }>
  }
  distribution: {
    usersByRole: Array<{ role: string; count: number; color: string }>
    examsBySubject: Array<{ subject: string; count: number }>
    organizationSizes: Array<{ size: string; count: number }>
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function SystemAnalyticsPage() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [activeTab, setActiveTab] = useState('overview')
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [timeRange])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockStats: SystemStats = {
        overview: {
          totalUsers: 1247,
          totalOrganizations: 45,
          totalClasses: 189,
          totalExams: 567,
          totalStudents: 8934,
          activeUsers: 234
        },
        performance: {
          cpuUsage: 45.2,
          memoryUsage: 67.8,
          diskUsage: 23.4,
          networkIO: 12.5,
          responseTime: 245,
          uptime: 2592000 // 30 days
        },
        activity: {
          dailyLogins: Array.from({ length: 30 }, (_, i) => ({
            date: format(new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), 'dd/MM'),
            count: Math.floor(Math.random() * 100) + 50
          })),
          examActivity: Array.from({ length: 30 }, (_, i) => ({
            date: format(new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), 'dd/MM'),
            created: Math.floor(Math.random() * 20) + 5,
            completed: Math.floor(Math.random() * 50) + 20
          })),
          userGrowth: [
            { month: 'T1', users: 800, organizations: 25 },
            { month: 'T2', users: 850, organizations: 28 },
            { month: 'T3', users: 920, organizations: 32 },
            { month: 'T4', users: 980, organizations: 35 },
            { month: 'T5', users: 1050, organizations: 38 },
            { month: 'T6', users: 1120, organizations: 42 },
            { month: 'T7', users: 1200, organizations: 45 },
            { month: 'T8', users: 1247, organizations: 45 }
          ]
        },
        distribution: {
          usersByRole: [
            { role: 'TEACHER', count: 856, color: '#0088FE' },
            { role: 'MANAGER', count: 234, color: '#00C49F' },
            { role: 'ADMIN', count: 157, color: '#FFBB28' }
          ],
          examsBySubject: [
            { subject: 'Toán học', count: 145 },
            { subject: 'Văn học', count: 123 },
            { subject: 'Tiếng Anh', count: 98 },
            { subject: 'Vật lý', count: 87 },
            { subject: 'Hóa học', count: 76 },
            { subject: 'Sinh học', count: 38 }
          ],
          organizationSizes: [
            { size: 'Nhỏ (1-50)', count: 18 },
            { size: 'Trung bình (51-200)', count: 20 },
            { size: 'Lớn (201-500)', count: 5 },
            { size: 'Rất lớn (500+)', count: 2 }
          ]
        }
      }
      
      setStats(mockStats)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu thống kê",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    return `${days} ngày ${hours} giờ`
  }

  const getPerformanceStatus = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return { status: 'critical', color: 'text-red-600' }
    if (value >= thresholds.warning) return { status: 'warning', color: 'text-yellow-600' }
    return { status: 'good', color: 'text-green-600' }
  }

  if (isLoading || !stats) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Phân tích hệ thống</h1>
            <div className="flex gap-2">
              <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-8 bg-gray-200 animate-pulse rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Phân tích hệ thống</h1>
          <p className="text-muted-foreground">Thống kê và giám sát toàn diện hệ thống EduScan</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 ngày</SelectItem>
              <SelectItem value="30d">30 ngày</SelectItem>
              <SelectItem value="90d">90 ngày</SelectItem>
              <SelectItem value="1y">1 năm</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchStats}>
            <RefreshCw size={16} className="mr-2" />
            Làm mới
          </Button>
          <Button>
            <Download size={16} className="mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
          <TabsTrigger value="activity">Hoạt động</TabsTrigger>
          <TabsTrigger value="distribution">Phân bố</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Người dùng</p>
                      <p className="text-2xl font-bold">{stats.overview.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+12%</span>
                    <span className="text-muted-foreground ml-1">so với tháng trước</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tổ chức</p>
                      <p className="text-2xl font-bold">{stats.overview.totalOrganizations}</p>
                    </div>
                    <Building className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+3</span>
                    <span className="text-muted-foreground ml-1">tổ chức mới</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Lớp học</p>
                      <p className="text-2xl font-bold">{stats.overview.totalClasses}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+8%</span>
                    <span className="text-muted-foreground ml-1">tăng trưởng</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bài kiểm tra</p>
                      <p className="text-2xl font-bold">{stats.overview.totalExams}</p>
                    </div>
                    <FileText className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+15%</span>
                    <span className="text-muted-foreground ml-1">hoạt động cao</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Học sinh</p>
                      <p className="text-2xl font-bold">{stats.overview.totalStudents.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+234</span>
                    <span className="text-muted-foreground ml-1">học sinh mới</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Đang hoạt động</p>
                      <p className="text-2xl font-bold">{stats.overview.activeUsers}</p>
                    </div>
                    <Activity className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2" />
                    <span className="text-muted-foreground">Trực tuyến ngay bây giờ</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Tăng trưởng theo thời gian</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats.activity.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stackId="1" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Người dùng"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="organizations" 
                      stackId="2" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      name="Tổ chức"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-6">
            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">CPU</span>
                    </div>
                    <Badge variant={stats.performance.cpuUsage > 80 ? 'destructive' : stats.performance.cpuUsage > 60 ? 'secondary' : 'default'}>
                      {stats.performance.cpuUsage}%
                    </Badge>
                  </div>
                  <Progress value={stats.performance.cpuUsage} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {stats.performance.cpuUsage > 80 ? 'Cao' : stats.performance.cpuUsage > 60 ? 'Trung bình' : 'Bình thường'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Memory</span>
                    </div>
                    <Badge variant={stats.performance.memoryUsage > 80 ? 'destructive' : stats.performance.memoryUsage > 60 ? 'secondary' : 'default'}>
                      {stats.performance.memoryUsage}%
                    </Badge>
                  </div>
                  <Progress value={stats.performance.memoryUsage} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {stats.performance.memoryUsage > 80 ? 'Cao' : stats.performance.memoryUsage > 60 ? 'Trung bình' : 'Bình thường'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Disk</span>
                    </div>
                    <Badge variant={stats.performance.diskUsage > 80 ? 'destructive' : stats.performance.diskUsage > 60 ? 'secondary' : 'default'}>
                      {stats.performance.diskUsage}%
                    </Badge>
                  </div>
                  <Progress value={stats.performance.diskUsage} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {stats.performance.diskUsage > 80 ? 'Cao' : stats.performance.diskUsage > 60 ? 'Trung bình' : 'Bình thường'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Network</span>
                    </div>
                    <Badge variant="default">
                      {stats.performance.networkIO} MB/s
                    </Badge>
                  </div>
                  <Progress value={stats.performance.networkIO * 4} className="mb-2" />
                  <p className="text-sm text-muted-foreground">I/O bình thường</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{stats.performance.responseTime}ms</div>
                  <p className="text-sm text-muted-foreground">Thời gian phản hồi trung bình</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Mục tiêu: &lt;500ms</span>
                      <span className="text-green-600">✓ Đạt</span>
                    </div>
                    <Progress value={(500 - stats.performance.responseTime) / 500 * 100} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Uptime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">99.9%</div>
                  <p className="text-sm text-muted-foreground">{formatUptime(stats.performance.uptime)}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>SLA: 99.5%</span>
                      <span className="text-green-600">✓ Vượt mục tiêu</span>
                    </div>
                    <Progress value={99.9} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trạng thái hệ thống</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Server</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">File Storage</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Email Service</span>
                      <Badge variant="secondary">Degraded</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="space-y-6">
            {/* Daily Logins */}
            <Card>
              <CardHeader>
                <CardTitle>Đăng nhập hàng ngày</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.activity.dailyLogins}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Số lượng đăng nhập"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Exam Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động bài kiểm tra</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.activity.examActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="created" fill="#8884d8" name="Tạo mới" />
                    <Bar dataKey="completed" fill="#82ca9d" name="Hoàn thành" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users by Role */}
              <Card>
                <CardHeader>
                  <CardTitle>Phân bố người dùng theo vai trò</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.distribution.usersByRole}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ role, percent }) => `${role} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {stats.distribution.usersByRole.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Exams by Subject */}
              <Card>
                <CardHeader>
                  <CardTitle>Bài kiểm tra theo môn học</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.distribution.examsBySubject} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="subject" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Organization Sizes */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bố quy mô tổ chức</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.distribution.organizationSizes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="size" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
