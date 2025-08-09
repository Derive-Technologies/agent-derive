'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { MetricsChart } from '@/components/dashboard/metrics-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  BarChart3,
  Calendar,
  Download,
  FileText,
  Activity
} from 'lucide-react'

const workflowExecutionData = [
  { name: 'Jan', executions: 45, success: 42, failed: 3 },
  { name: 'Feb', executions: 52, success: 48, failed: 4 },
  { name: 'Mar', executions: 48, success: 46, failed: 2 },
  { name: 'Apr', executions: 61, success: 58, failed: 3 },
  { name: 'May', executions: 58, success: 55, failed: 3 },
  { name: 'Jun', executions: 67, success: 64, failed: 3 },
]

const approvalTimeData = [
  { name: 'Week 1', avgTime: 2.3, target: 4.0 },
  { name: 'Week 2', avgTime: 1.8, target: 4.0 },
  { name: 'Week 3', avgTime: 2.1, target: 4.0 },
  { name: 'Week 4', avgTime: 1.9, target: 4.0 },
  { name: 'Week 5', avgTime: 2.4, target: 4.0 },
  { name: 'Week 6', avgTime: 2.0, target: 4.0 },
]

const workflowTypeData = [
  { name: 'Purchase Approval', value: 35, color: '#3B82F6' },
  { name: 'Employee Onboarding', value: 25, color: '#10B981' },
  { name: 'Contract Review', value: 20, color: '#F59E0B' },
  { name: 'Expense Reports', value: 15, color: '#EF4444' },
  { name: 'Other', value: 5, color: '#8B5CF6' }
]

const userActivityData = [
  { name: 'Mon', activeUsers: 24, workflowsCreated: 8, approvalsCompleted: 12 },
  { name: 'Tue', activeUsers: 28, workflowsCreated: 12, approvalsCompleted: 15 },
  { name: 'Wed', activeUsers: 32, workflowsCreated: 10, approvalsCompleted: 18 },
  { name: 'Thu', activeUsers: 29, workflowsCreated: 14, approvalsCompleted: 16 },
  { name: 'Fri', activeUsers: 26, workflowsCreated: 6, approvalsCompleted: 14 },
  { name: 'Sat', activeUsers: 8, workflowsCreated: 2, approvalsCompleted: 4 },
  { name: 'Sun', activeUsers: 6, workflowsCreated: 1, approvalsCompleted: 2 },
]

const performanceMetrics = [
  {
    title: 'Total Executions',
    value: '1,234',
    change: '+12.5%',
    trend: 'up',
    icon: BarChart3,
    color: 'blue'
  },
  {
    title: 'Success Rate',
    value: '94.8%',
    change: '+2.1%',
    trend: 'up',
    icon: CheckCircle,
    color: 'green'
  },
  {
    title: 'Avg Execution Time',
    value: '1.2 hours',
    change: '-18.3%',
    trend: 'down',
    icon: Clock,
    color: 'orange'
  },
  {
    title: 'Active Workflows',
    value: '47',
    change: '+8.2%',
    trend: 'up',
    icon: Activity,
    color: 'purple'
  }
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30days')
  const [selectedMetric, setSelectedMetric] = useState('executions')

  const StatCard = ({ metric }: { metric: any }) => {
    const IconComponent = metric.icon
    const isPositive = metric.trend === 'up'
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <div className={`flex items-center mt-1 text-sm ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {metric.change}
              </div>
            </div>
            <div className={`p-3 rounded-full bg-${metric.color}-100`}>
              <IconComponent className={`h-6 w-6 text-${metric.color}-600`} />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Monitor workflow performance and business metrics"
        action={
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <StatCard key={index} metric={metric} />
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workflow Executions Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Workflow Executions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={workflowExecutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="executions"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Workflow Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Workflow Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={workflowTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {workflowTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Success vs Failure Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Success vs Failure Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workflowExecutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="success" fill="#10B981" name="Success" />
                    <Bar dataKey="failed" fill="#EF4444" name="Failed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Average Approval Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Average Approval Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={approvalTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="avgTime"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name="Actual Time"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#EF4444"
                      strokeDasharray="5 5"
                      name="Target Time"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workflow Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Purchase Approval', success: 98.2, executions: 145, avg: '1.8h' },
                    { name: 'Employee Onboarding', success: 95.1, executions: 32, avg: '1.2d' },
                    { name: 'Contract Review', success: 89.3, executions: 28, avg: '4.2h' },
                    { name: 'Expense Reports', success: 96.7, executions: 67, avg: '45m' }
                  ].map((workflow, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{workflow.name}</div>
                        <div className="text-sm text-gray-500">{workflow.executions} executions</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{workflow.success}%</div>
                        <div className="text-sm text-gray-500">Avg: {workflow.avg}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Workflow Bottlenecks */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Bottlenecks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: 'Manager Approval', avgTime: '2.3 hours', workflows: 12 },
                    { step: 'Legal Review', avgTime: '8.5 hours', workflows: 8 },
                    { step: 'Finance Verification', avgTime: '1.8 hours', workflows: 15 },
                    { step: 'IT Provisioning', avgTime: '6.2 hours', workflows: 5 }
                  ].map((bottleneck, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <div className="font-medium">{bottleneck.step}</div>
                        <div className="text-sm text-gray-500">{bottleneck.workflows} workflows affected</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-orange-600">{bottleneck.avgTime}</div>
                        <div className="text-sm text-gray-500">Average delay</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Approval Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Approval Time</span>
                    <span className="font-semibold">2.1 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approval Rate</span>
                    <span className="font-semibold text-green-600">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rejection Rate</span>
                    <span className="font-semibold text-red-600">5.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Approvals</span>
                    <span className="font-semibold text-orange-600">18</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approval Volume by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'Purchase Requests', count: 45, percentage: 40 },
                    { type: 'Expense Reports', count: 32, percentage: 28 },
                    { type: 'Contract Reviews', count: 25, percentage: 22 },
                    { type: 'Hiring Requests', count: 12, percentage: 10 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.type}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Approvers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Johnson', approvals: 28, avgTime: '1.8h' },
                    { name: 'Mike Davis', approvals: 24, avgTime: '2.1h' },
                    { name: 'Lisa Anderson', approvals: 19, avgTime: '1.5h' },
                    { name: 'Tom Brown', approvals: 16, avgTime: '3.2h' }
                  ].map((approver, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{approver.name}</div>
                        <div className="text-xs text-gray-500">{approver.approvals} approvals</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{approver.avgTime}</div>
                        <div className="text-xs text-gray-500">avg time</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Daily User Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="activeUsers" fill="#3B82F6" name="Active Users" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  User Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="workflowsCreated"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Workflows Created"
                    />
                    <Line
                      type="monotone"
                      dataKey="approvalsCompleted"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      name="Approvals Completed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Most Active Users */}
            <Card>
              <CardHeader>
                <CardTitle>Most Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'John Smith', workflows: 12, approvals: 28, score: 95 },
                    { name: 'Sarah Johnson', workflows: 8, approvals: 24, score: 88 },
                    { name: 'Mike Davis', workflows: 6, approvals: 19, score: 82 },
                    { name: 'Lisa Anderson', workflows: 10, approvals: 16, score: 79 }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.workflows} workflows, {user.approvals} approvals
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">{user.score}</div>
                        <div className="text-sm text-gray-500">activity score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Adoption */}
            <Card>
              <CardHeader>
                <CardTitle>User Adoption Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Users</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Active Users</span>
                    <span className="font-semibold">124</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Weekly Active Users</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Daily Active Users</span>
                    <span className="font-semibold">34</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span>User Retention Rate</span>
                      <span className="font-semibold text-green-600">87.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>New User Growth</span>
                      <span className="font-semibold text-blue-600">+12.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}