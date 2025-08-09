'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { 
  Bot,
  Plus,
  Search,
  Play,
  Pause,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Brain,
  Zap,
  MessageSquare,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Activity,
  Users,
  Calendar
} from 'lucide-react'

interface AIAgent {
  id: string
  name: string
  description: string
  type: 'chat' | 'analysis' | 'approval' | 'data-processing' | 'notification'
  status: 'active' | 'inactive' | 'training' | 'error'
  model: string
  tasks: number
  successRate: number
  lastActive: Date
  createdBy: string
  prompt: string
  capabilities: string[]
  integrations: string[]
}

const mockAgents: AIAgent[] = [
  {
    id: '1',
    name: 'Purchase Approval Assistant',
    description: 'Automatically reviews and pre-approves purchase requests based on company policies',
    type: 'approval',
    status: 'active',
    model: 'Claude 3.5 Sonnet',
    tasks: 145,
    successRate: 94.2,
    lastActive: new Date('2024-01-21T10:30:00'),
    createdBy: 'John Smith',
    prompt: 'Review purchase requests against company policies and budget limits. Auto-approve requests under $1000 that meet all criteria.',
    capabilities: ['Policy Analysis', 'Budget Checking', 'Risk Assessment', 'Auto-Approval'],
    integrations: ['Purchase Workflow', 'Finance System', 'Slack Notifications']
  },
  {
    id: '2',
    name: 'Contract Review Bot',
    description: 'Analyzes contracts for compliance issues and risk factors',
    type: 'analysis',
    status: 'active',
    model: 'GPT-4',
    tasks: 67,
    successRate: 89.5,
    lastActive: new Date('2024-01-21T09:15:00'),
    createdBy: 'Sarah Johnson',
    prompt: 'Analyze contracts for legal compliance, identify potential risks, and flag unusual terms for human review.',
    capabilities: ['Legal Analysis', 'Risk Detection', 'Compliance Checking', 'Term Extraction'],
    integrations: ['Contract Workflow', 'Legal Database', 'Email Notifications']
  },
  {
    id: '3',
    name: 'Employee Onboarding Guide',
    description: 'Interactive assistant that helps new employees through the onboarding process',
    type: 'chat',
    status: 'active',
    model: 'Claude 3 Haiku',
    tasks: 32,
    successRate: 97.1,
    lastActive: new Date('2024-01-21T11:45:00'),
    createdBy: 'Mike Davis',
    prompt: 'Guide new employees through onboarding steps, answer questions about company policies, and ensure all required forms are completed.',
    capabilities: ['Interactive Chat', 'Process Guidance', 'Form Assistance', 'FAQ Responses'],
    integrations: ['HR System', 'Onboarding Workflow', 'Teams Bot']
  },
  {
    id: '4',
    name: 'Expense Report Validator',
    description: 'Validates expense reports for accuracy and policy compliance',
    type: 'data-processing',
    status: 'training',
    model: 'Claude 3.5 Sonnet',
    tasks: 0,
    successRate: 0,
    lastActive: new Date('2024-01-20T16:20:00'),
    createdBy: 'Lisa Anderson',
    prompt: 'Validate expense reports against company travel policy, check receipt authenticity, and flag suspicious expenses.',
    capabilities: ['Receipt Analysis', 'Policy Validation', 'Fraud Detection', 'Data Extraction'],
    integrations: ['Expense Workflow', 'Finance System']
  }
]

export default function AIAgentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || agent.type === typeFilter
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'training': return 'bg-blue-100 text-blue-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'chat': return 'bg-purple-100 text-purple-800'
      case 'analysis': return 'bg-blue-100 text-blue-800'
      case 'approval': return 'bg-green-100 text-green-800'
      case 'data-processing': return 'bg-orange-100 text-orange-800'
      case 'notification': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat': return <MessageSquare className="h-4 w-4" />
      case 'analysis': return <Brain className="h-4 w-4" />
      case 'approval': return <CheckCircle className="h-4 w-4" />
      case 'data-processing': return <FileText className="h-4 w-4" />
      case 'notification': return <Zap className="h-4 w-4" />
      default: return <Bot className="h-4 w-4" />
    }
  }

  const activeAgents = mockAgents.filter(a => a.status === 'active')
  const totalTasks = mockAgents.reduce((sum, agent) => sum + agent.tasks, 0)
  const avgSuccessRate = mockAgents.reduce((sum, agent) => sum + agent.successRate, 0) / mockAgents.length

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Agents"
        description="Manage and monitor your intelligent automation agents"
        action={
          <Button className="flex items-center gap-2" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" />
            Create Agent
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{activeAgents.length}</div>
                <div className="text-sm text-gray-600">Active Agents</div>
              </div>
              <Bot className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalTasks.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Avg Success Rate</div>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">2.3</div>
                <div className="text-sm text-gray-600">Avg Response Time (s)</div>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                  <SelectItem value="approval">Approval</SelectItem>
                  <SelectItem value="data-processing">Data Processing</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Agents ({mockAgents.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeAgents.length})</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAgents.map(agent => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                        {getTypeIcon(agent.type)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {agent.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(agent.status)}>
                            {agent.status.toUpperCase()}
                          </Badge>
                          <Badge className={getTypeColor(agent.type)}>
                            {agent.type.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {agent.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  {/* Model & Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="font-semibold text-sm">{agent.tasks}</div>
                      <div className="text-xs text-gray-500">Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm">{agent.successRate}%</div>
                      <div className="text-xs text-gray-500">Success</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm text-blue-600">{agent.model.split(' ')[0]}</div>
                      <div className="text-xs text-gray-500">Model</div>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Capabilities</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.slice(0, 3).map(capability => (
                        <Badge key={capability} variant="outline" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{agent.capabilities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mb-3">
                    {agent.status === 'active' && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    )}
                    {agent.status === 'inactive' && (
                      <Button size="sm" className="flex-1">
                        <Play className="h-3 w-3 mr-1" />
                        Activate
                      </Button>
                    )}
                    {agent.status === 'training' && (
                      <Button size="sm" variant="outline" className="flex-1" disabled>
                        <Brain className="h-3 w-3 mr-1" />
                        Training...
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-gray-500 pt-3 border-t">
                    <div className="flex justify-between">
                      <span>Created by {agent.createdBy}</span>
                      <span>Last active {agent.lastActive.toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAgents
              .filter(agent => agent.status === 'active')
              .map(agent => (
                <Card key={agent.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <h3 className="font-semibold">{agent.name}</h3>
                      </div>
                      <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">{agent.tasks}</div>
                        <div className="text-sm text-gray-600">Tasks Today</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{agent.successRate}%</div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Logs
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              {
                name: 'Document Summarizer',
                description: 'Automatically summarizes long documents and extracts key points',
                type: 'analysis',
                useCase: 'Contract Analysis, Report Reviews'
              },
              {
                name: 'Approval Router',
                description: 'Intelligently routes requests to appropriate approvers based on rules',
                type: 'approval',
                useCase: 'Purchase Requests, Leave Applications'
              },
              {
                name: 'Data Validator',
                description: 'Validates and cleanses data entries for accuracy and completeness',
                type: 'data-processing',
                useCase: 'Form Submissions, Data Import'
              },
              {
                name: 'Smart Notifier',
                description: 'Sends contextual notifications based on workflow events',
                type: 'notification',
                useCase: 'Status Updates, Reminders'
              }
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                      <Bot className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge className={getTypeColor(template.type)} variant="outline">
                        {template.type.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>
                  <div className="text-xs text-gray-500 mb-4">
                    <strong>Use Cases:</strong> {template.useCase}
                  </div>
                  <Button className="w-full" size="sm">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAgents.map(agent => (
                    <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          agent.status === 'active' ? 'bg-green-500' : 
                          agent.status === 'training' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <div className="font-medium text-sm">{agent.name}</div>
                          <div className="text-xs text-gray-500">{agent.tasks} tasks</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">{agent.successRate}%</div>
                        <div className="text-xs text-gray-500">success</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Tasks Processed</span>
                    <span className="font-semibold">{totalTasks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Success Rate</span>
                    <span className="font-semibold">{avgSuccessRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Agents</span>
                    <span className="font-semibold">{activeAgents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cost Savings (est.)</span>
                    <span className="font-semibold text-green-600">$12,450</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Most Used Models</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Claude 3.5 Sonnet</span>
                        <span>2 agents</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>GPT-4</span>
                        <span>1 agent</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Claude 3 Haiku</span>
                        <span>1 agent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Agent Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>Create New AI Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Agent Name</label>
                  <Input placeholder="My AI Assistant" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chat">Chat Assistant</SelectItem>
                      <SelectItem value="analysis">Document Analysis</SelectItem>
                      <SelectItem value="approval">Approval Agent</SelectItem>
                      <SelectItem value="data-processing">Data Processing</SelectItem>
                      <SelectItem value="notification">Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Describe what this agent does..." />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">System Prompt</label>
                <Textarea 
                  placeholder="You are an AI assistant that helps with..."
                  className="min-h-24"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button>Create Agent</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}