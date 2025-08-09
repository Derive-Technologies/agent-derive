'use client'

import { PageHeader } from '@/components/layout/page-header'
import { StatsCard } from '@/components/dashboard/stats-card'
import { WorkflowList } from '@/components/dashboard/workflow-list'
import { RecentApprovals } from '@/components/dashboard/recent-approvals'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { MetricsChart } from '@/components/dashboard/metrics-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle,
  Users,
  FileText,
  TrendingUp,
  Calendar
} from 'lucide-react'

export default function DashboardPage() {
  // Mock workflow data
  const mockWorkflows = [
    {
      id: '1',
      name: 'Purchase Approval Process',
      description: 'Multi-level approval for purchase requests',
      status: 'active' as const,
      lastRun: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      nextRun: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
      executionCount: 145,
      successRate: 98.5,
      createdBy: {
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      name: 'Employee Onboarding',
      description: 'New employee onboarding workflow',
      status: 'active' as const,
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      executionCount: 89,
      successRate: 100,
      createdBy: {
        name: 'Jane Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
      },
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: '3',
      name: 'Contract Review',
      description: 'Legal and business contract review process',
      status: 'paused' as const,
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      executionCount: 56,
      successRate: 95.2,
      createdBy: {
        name: 'Mike Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
      },
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-19')
    },
    {
      id: '4',
      name: 'Expense Report Approval',
      description: 'Automated expense report processing',
      status: 'active' as const,
      lastRun: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      executionCount: 234,
      successRate: 99.1,
      createdBy: {
        name: 'Sarah Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
      },
      createdAt: new Date('2023-12-20'),
      updatedAt: new Date('2024-01-21')
    },
    {
      id: '5',
      name: 'IT Request Fulfillment',
      description: 'IT service and equipment request workflow',
      status: 'draft' as const,
      executionCount: 0,
      successRate: 0,
      createdBy: {
        name: 'Tom Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom'
      },
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-22')
    }
  ]

  // Mock approval data
  const mockApprovals = [
    {
      id: '1',
      workflowName: 'Purchase Approval Process',
      workflowId: '1',
      title: 'New Laptop Purchase - $2,500',
      description: 'MacBook Pro 16" for development team',
      status: 'pending' as const,
      priority: 'high' as const,
      requestedBy: {
        name: 'Alex Chen',
        email: 'alex.chen@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
      },
      requestedAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: '2',
      workflowName: 'Expense Report Approval',
      workflowId: '4',
      title: 'Q1 Travel Expenses - $3,200',
      description: 'Client meetings and conference attendance',
      status: 'pending' as const,
      priority: 'medium' as const,
      requestedBy: {
        name: 'Emily Johnson',
        email: 'emily.j@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
      },
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      id: '3',
      workflowName: 'Contract Review',
      workflowId: '3',
      title: 'Vendor Agreement - TechCorp',
      description: 'Annual software licensing agreement',
      status: 'pending' as const,
      priority: 'urgent' as const,
      requestedBy: {
        name: 'David Park',
        email: 'david.park@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
      },
      requestedAt: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
    },
    {
      id: '4',
      workflowName: 'Employee Onboarding',
      workflowId: '2',
      title: 'New Hire - Senior Developer',
      description: 'Onboarding for Jane Williams',
      status: 'approved' as const,
      priority: 'medium' as const,
      requestedBy: {
        name: 'HR Department',
        email: 'hr@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HR'
      },
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      approvedBy: {
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      },
      approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
    },
    {
      id: '5',
      workflowName: 'Purchase Approval Process',
      workflowId: '1',
      title: 'Office Supplies - $450',
      description: 'Monthly office supplies order',
      status: 'rejected' as const,
      priority: 'low' as const,
      requestedBy: {
        name: 'Office Manager',
        email: 'office@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Office'
      },
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      rejectionReason: 'Budget exceeded for this quarter'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your workflow automation platform"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Workflows"
          value="24"
          icon={BarChart3}
          trend={+12}
          trendLabel="from last month"
          color="blue"
        />
        <StatsCard
          title="Pending Approvals"
          value="18"
          icon={Clock}
          trend={-5}
          trendLabel="from yesterday"
          color="orange"
        />
        <StatsCard
          title="Completed Tasks"
          value="156"
          icon={CheckCircle}
          trend={+23}
          trendLabel="this week"
          color="green"
        />
        <StatsCard
          title="Failed Tasks"
          value="3"
          icon={XCircle}
          trend={-2}
          trendLabel="from last week"
          color="red"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Metrics Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MetricsChart />
            </CardContent>
          </Card>

          {/* Recent Workflows */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Workflows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WorkflowList workflows={mockWorkflows} showActions={true} limit={5} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickActions />
            </CardContent>
          </Card>

          {/* Recent Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Recent Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentApprovals approvals={mockApprovals} limit={5} />
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={[]} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Analytics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="workflows" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="workflows" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Workflow Status Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Running</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                        </div>
                        <span className="text-sm font-medium">18</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completed</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full w-5/6"></div>
                        </div>
                        <span className="text-sm font-medium">156</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Failed</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full w-1/6"></div>
                        </div>
                        <span className="text-sm font-medium">3</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Most Used Templates</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Purchase Approval</span>
                      <span className="text-sm font-medium">45 uses</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Employee Onboarding</span>
                      <span className="text-sm font-medium">32 uses</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Contract Review</span>
                      <span className="text-sm font-medium">28 uses</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="approvals" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <StatsCard
                  title="Avg. Approval Time"
                  value="2.3 hours"
                  icon={Clock}
                  trend={-15}
                  trendLabel="faster than last month"
                  color="green"
                />
                <StatsCard
                  title="Approval Rate"
                  value="94.2%"
                  icon={CheckCircle}
                  trend={+2.1}
                  trendLabel="from last month"
                  color="blue"
                />
                <StatsCard
                  title="Overdue Items"
                  value="7"
                  icon={XCircle}
                  trend={-3}
                  trendLabel="from yesterday"
                  color="red"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-4">
              <div className="h-64">
                <MetricsChart />
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Active Users</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">John Smith</div>
                        <div className="text-xs text-gray-500">12 workflows active</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Sarah Johnson</div>
                        <div className="text-xs text-gray-500">8 workflows active</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Mike Davis</div>
                        <div className="text-xs text-gray-500">5 workflows active</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">User Activity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Daily Active Users</span>
                      <span className="text-sm font-medium">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Weekly Active Users</span>
                      <span className="text-sm font-medium">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Active Users</span>
                      <span className="text-sm font-medium">156</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}