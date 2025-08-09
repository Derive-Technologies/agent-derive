'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { ApprovalCard } from '@/components/workflow/approval-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Filter,
  Calendar,
  User,
  DollarSign,
  FileText,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react'

interface ApprovalRequest {
  id: string
  title: string
  type: 'purchase' | 'contract' | 'expense' | 'hiring' | 'budget' | 'other'
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  priority: 'low' | 'medium' | 'high' | 'critical'
  amount?: number
  currency?: string
  submittedBy: {
    name: string
    email: string
    avatar?: string
  }
  submittedAt: Date
  dueDate: Date
  description: string
  workflowName: string
  currentApprover: string
  approvalLevel: number
  totalLevels: number
  attachments: number
  comments: number
  history: {
    action: string
    user: string
    timestamp: Date
    comment?: string
  }[]
}

const mockApprovals: ApprovalRequest[] = [
  {
    id: '1',
    title: 'MacBook Pro Purchase Request',
    type: 'purchase',
    status: 'pending',
    priority: 'high',
    amount: 2499,
    currency: 'USD',
    submittedBy: {
      name: 'John Smith',
      email: 'john@company.com'
    },
    submittedAt: new Date('2024-01-20T10:30:00'),
    dueDate: new Date('2024-01-22T17:00:00'),
    description: 'New MacBook Pro for development team member. Current laptop is 4 years old and causing productivity issues.',
    workflowName: 'IT Equipment Purchase',
    currentApprover: 'Sarah Johnson (IT Manager)',
    approvalLevel: 1,
    totalLevels: 2,
    attachments: 2,
    comments: 3,
    history: [
      {
        action: 'Submitted',
        user: 'John Smith',
        timestamp: new Date('2024-01-20T10:30:00')
      }
    ]
  },
  {
    id: '2',
    title: 'Marketing Contract Review',
    type: 'contract',
    status: 'pending',
    priority: 'medium',
    amount: 50000,
    currency: 'USD',
    submittedBy: {
      name: 'Lisa Anderson',
      email: 'lisa@company.com'
    },
    submittedAt: new Date('2024-01-19T14:15:00'),
    dueDate: new Date('2024-01-25T17:00:00'),
    description: 'Annual marketing agency contract for digital advertising campaigns.',
    workflowName: 'Contract Review Process',
    currentApprover: 'Mike Davis (Legal)',
    approvalLevel: 1,
    totalLevels: 3,
    attachments: 5,
    comments: 1,
    history: [
      {
        action: 'Submitted',
        user: 'Lisa Anderson',
        timestamp: new Date('2024-01-19T14:15:00')
      }
    ]
  },
  {
    id: '3',
    title: 'Travel Expense Report - Q4 2023',
    type: 'expense',
    status: 'approved',
    priority: 'low',
    amount: 1250,
    currency: 'USD',
    submittedBy: {
      name: 'David Wilson',
      email: 'david@company.com'
    },
    submittedAt: new Date('2024-01-18T09:00:00'),
    dueDate: new Date('2024-01-21T17:00:00'),
    description: 'Client meetings in New York - flights, hotel, and meals.',
    workflowName: 'Expense Reimbursement',
    currentApprover: 'Completed',
    approvalLevel: 2,
    totalLevels: 2,
    attachments: 8,
    comments: 2,
    history: [
      {
        action: 'Submitted',
        user: 'David Wilson',
        timestamp: new Date('2024-01-18T09:00:00')
      },
      {
        action: 'Approved',
        user: 'Sarah Johnson',
        timestamp: new Date('2024-01-19T11:30:00'),
        comment: 'All receipts provided and amounts verified.'
      }
    ]
  },
  {
    id: '4',
    title: 'Senior Developer Position',
    type: 'hiring',
    status: 'pending',
    priority: 'critical',
    submittedBy: {
      name: 'Tom Brown',
      email: 'tom@company.com'
    },
    submittedAt: new Date('2024-01-21T08:45:00'),
    dueDate: new Date('2024-01-23T17:00:00'),
    description: 'Hiring approval for senior React developer position. Candidate has excellent background.',
    workflowName: 'Hiring Approval',
    currentApprover: 'Jennifer Lee (HR Director)',
    approvalLevel: 2,
    totalLevels: 3,
    attachments: 3,
    comments: 5,
    history: [
      {
        action: 'Submitted',
        user: 'Tom Brown',
        timestamp: new Date('2024-01-21T08:45:00')
      },
      {
        action: 'Approved',
        user: 'Mike Davis',
        timestamp: new Date('2024-01-21T15:20:00'),
        comment: 'Technical skills look good. Proceeding to HR review.'
      }
    ]
  },
  {
    id: '5',
    title: 'Software License Renewal',
    type: 'purchase',
    status: 'rejected',
    priority: 'medium',
    amount: 15000,
    currency: 'USD',
    submittedBy: {
      name: 'Amy Chen',
      email: 'amy@company.com'
    },
    submittedAt: new Date('2024-01-17T16:20:00'),
    dueDate: new Date('2024-01-19T17:00:00'),
    description: 'Annual renewal for design software licenses.',
    workflowName: 'Software Purchase',
    currentApprover: 'Completed',
    approvalLevel: 1,
    totalLevels: 2,
    attachments: 1,
    comments: 2,
    history: [
      {
        action: 'Submitted',
        user: 'Amy Chen',
        timestamp: new Date('2024-01-17T16:20:00')
      },
      {
        action: 'Rejected',
        user: 'Sarah Johnson',
        timestamp: new Date('2024-01-18T10:15:00'),
        comment: 'Budget constraints. Please explore alternative solutions or reduce scope.'
      }
    ]
  }
]

export default function ApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const filteredApprovals = mockApprovals.filter(approval => {
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || approval.status === statusFilter
    const matchesType = typeFilter === 'all' || approval.type === typeFilter
    const matchesPriority = priorityFilter === 'all' || approval.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <DollarSign className="h-4 w-4" />
      case 'contract': return <FileText className="h-4 w-4" />
      case 'expense': return <DollarSign className="h-4 w-4" />
      case 'hiring': return <User className="h-4 w-4" />
      case 'budget': return <DollarSign className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending')
  const completedApprovals = mockApprovals.filter(a => a.status === 'approved' || a.status === 'rejected')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approvals"
        description="Manage pending approvals and review completed requests"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{pendingApprovals.length}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockApprovals.filter(a => a.status === 'approved').length}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockApprovals.filter(a => a.status === 'rejected').length}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{pendingApprovals.filter(a => a.priority === 'critical' || a.priority === 'high').length}</div>
                <div className="text-sm text-gray-600">High Priority</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
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
                  placeholder="Search approvals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="hiring">Hiring</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({mockApprovals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {filteredApprovals
              .filter(a => a.status === 'pending')
              .map(approval => (
                <Card key={approval.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                          {getTypeIcon(approval.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{approval.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(approval.status)}>
                              {approval.status.toUpperCase()}
                            </Badge>
                            <Badge className={getPriorityColor(approval.priority)}>
                              {approval.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {approval.type.toUpperCase()}
                            </Badge>
                            {approval.amount && (
                              <Badge variant="outline">
                                {approval.currency} {approval.amount.toLocaleString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="text-green-600">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{approval.description}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>Submitted by {approval.submittedBy.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Due {approval.dueDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Level {approval.approvalLevel} of {approval.totalLevels}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{approval.attachments} attachments</span>
                        <span>{approval.comments} comments</span>
                        <span>Current: {approval.currentApprover}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {approval.submittedBy.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">
                          {approval.submittedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="space-y-4">
            {filteredApprovals
              .filter(a => a.status === 'approved' || a.status === 'rejected')
              .map(approval => (
                <Card key={approval.id} className="hover:shadow-md transition-shadow opacity-75">
                  <CardContent className="p-6">
                    {/* Similar structure to pending, but read-only */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                          {getTypeIcon(approval.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{approval.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(approval.status)}>
                              {approval.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {approval.type.toUpperCase()}
                            </Badge>
                            {approval.amount && (
                              <Badge variant="outline">
                                {approval.currency} {approval.amount.toLocaleString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>

                    <p className="text-gray-600 mb-4">{approval.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t text-sm text-gray-500">
                      <span>Submitted by {approval.submittedBy.name}</span>
                      <span>Completed {approval.history[approval.history.length - 1]?.timestamp.toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {filteredApprovals.map(approval => (
              <ApprovalCard key={approval.id} approval={approval} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {filteredApprovals.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500 mb-2">No approvals found</div>
            <p className="text-sm text-gray-400 mb-4">
              Try adjusting your search terms or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}