'use client'

// Import warning suppressor first
import '@/lib/suppress-warnings'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { WorkflowCard } from '@/components/workflow/workflow-card'
import { WorkflowToolbar } from '@/components/workflow/workflow-toolbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  Play,
  Pause,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'draft' | 'paused' | 'archived'
  category: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  executionCount: number
  successRate: number
  avgExecutionTime: string
  tags: string[]
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Purchase Approval Workflow',
    description: 'Automated purchase request approval process with multi-level authorization',
    status: 'active',
    category: 'Finance',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'John Smith',
    executionCount: 145,
    successRate: 94.5,
    avgExecutionTime: '2.3 hours',
    tags: ['finance', 'approval', 'automation']
  },
  {
    id: '2',
    name: 'Employee Onboarding',
    description: 'Complete onboarding process for new employees including IT setup and documentation',
    status: 'active',
    category: 'HR',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    createdBy: 'Sarah Johnson',
    executionCount: 32,
    successRate: 98.2,
    avgExecutionTime: '1.5 days',
    tags: ['hr', 'onboarding', 'automation']
  },
  {
    id: '3',
    name: 'Contract Review Process',
    description: 'Legal and business review workflow for all incoming contracts',
    status: 'active',
    category: 'Legal',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16'),
    createdBy: 'Mike Davis',
    executionCount: 28,
    successRate: 89.3,
    avgExecutionTime: '4.2 hours',
    tags: ['legal', 'contracts', 'review']
  },
  {
    id: '4',
    name: 'Vendor Evaluation',
    description: 'Comprehensive vendor assessment and scoring workflow',
    status: 'draft',
    category: 'Procurement',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19'),
    createdBy: 'Lisa Anderson',
    executionCount: 0,
    successRate: 0,
    avgExecutionTime: 'N/A',
    tags: ['procurement', 'vendor', 'evaluation']
  }
]

export default function WorkflowsPage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('updated')

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/workflows')
      if (!response.ok) throw new Error('Failed to fetch workflows')
      const data = await response.json()
      setWorkflows(data)
    } catch (error) {
      console.error('Error fetching workflows:', error)
      // Fall back to mock data if API fails
      setWorkflows(mockWorkflows)
    } finally {
      setLoading(false)
    }
  }

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || workflow.category.toLowerCase() === categoryFilter.toLowerCase()
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const categories = ['all', 'finance', 'hr', 'legal', 'procurement', 'it', 'operations']
  const statuses = ['all', 'active', 'draft', 'paused', 'archived']

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflows"
        description="Create, manage, and monitor your automated workflows"
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => router.push('/dashboard/workflows/new')}
            >
              <Plus className="h-4 w-4" />
              Create Workflow
            </Button>
          </div>
        }
      />

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.slice(1).map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.slice(1).map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Last Updated</SelectItem>
                  <SelectItem value="created">Created Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="executions">Executions</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Workflows ({mockWorkflows.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({mockWorkflows.filter(w => w.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="draft">Drafts ({mockWorkflows.filter(w => w.status === 'draft').length})</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading workflows...</p>
              </div>
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No workflows found</p>
                <Button onClick={() => router.push('/dashboard/workflows/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first workflow
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredWorkflows.map(workflow => (
              <Card 
                key={workflow.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/workflows/${workflow.id}/edit`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {workflow.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs ${getStatusColor(workflow.status)}`}>
                          {workflow.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {workflow.category}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {workflow.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="font-semibold text-sm">{workflow.executionCount}</div>
                      <div className="text-xs text-gray-500">Executions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm">{workflow.successRate}%</div>
                      <div className="text-xs text-gray-500">Success</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm">{workflow.avgExecutionTime}</div>
                      <div className="text-xs text-gray-500">Avg Time</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {workflow.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {workflow.status === 'active' && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    )}
                    {workflow.status === 'paused' && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <Play className="h-3 w-3 mr-1" />
                        Resume
                      </Button>
                    )}
                    {workflow.status === 'draft' && (
                      <Button size="sm" className="flex-1">
                        <Play className="h-3 w-3 mr-1" />
                        Activate
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/dashboard/workflows/${workflow.id}`)
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/dashboard/workflows/${workflow.id}/edit`)
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
                    <div>Created by {workflow.createdBy}</div>
                    <div>Updated {new Date(workflow.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWorkflows
              .filter(w => w.status === 'active')
              .map(workflow => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWorkflows
              .filter(w => w.status === 'draft')
              .map(workflow => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Workflow Templates</h3>
            <p className="text-gray-600 mb-4">
              Choose from pre-built workflow templates to get started quickly
            </p>
            <Button>Browse Templates</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {filteredWorkflows.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500 mb-2">No workflows found</div>
            <p className="text-sm text-gray-400 mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button>Create Your First Workflow</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}