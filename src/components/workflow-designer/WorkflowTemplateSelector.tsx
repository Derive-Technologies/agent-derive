'use client'

import { useState } from 'react'
import { 
  purchaseApprovalTemplate,
  employeeOnboardingTemplate, 
  contractReviewTemplate,
  expenseReportTemplate
} from '@/src/lib/templates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Search,
  Clock,
  Users,
  Zap,
  Eye,
  Plus,
  BarChart3,
  CheckCircle
} from 'lucide-react'

const workflowTemplates = [
  purchaseApprovalTemplate,
  employeeOnboardingTemplate,
  contractReviewTemplate,
  expenseReportTemplate
]

interface WorkflowTemplateSelectorProps {
  onSelectTemplate: (template: any) => void
  onCreateBlank: () => void
}

export function WorkflowTemplateSelector({
  onSelectTemplate,
  onCreateBlank
}: WorkflowTemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [complexityFilter, setComplexityFilter] = useState<string>('all')
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const filteredTemplates = workflowTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
    const matchesComplexity = complexityFilter === 'all' || template.complexity === complexityFilter
    
    return matchesSearch && matchesCategory && matchesComplexity
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'approval': return 'bg-blue-100 text-blue-800'
      case 'onboarding': return 'bg-green-100 text-green-800'
      case 'review': return 'bg-purple-100 text-purple-800'
      case 'data-collection': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'complex': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handlePreview = (template) => {
    setPreviewTemplate(template)
    setShowPreview(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Choose a Workflow Template</h2>
          <p className="text-gray-600 mt-1">Start with a proven template or create from scratch</p>
        </div>
        <Button onClick={onCreateBlank} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Start from Scratch
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="approval">Approval</SelectItem>
            <SelectItem value="onboarding">Onboarding</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="data-collection">Data Collection</SelectItem>
          </SelectContent>
        </Select>
        <Select value={complexityFilter} onValueChange={setComplexityFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Complexity</SelectItem>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="complex">Complex</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {template.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={getComplexityColor(template.complexity)}>
                      {template.complexity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm text-gray-600 mt-2">
                {template.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="text-xs font-medium">{template.estimatedDuration}</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="text-xs font-medium">{template.metadata.usageCount}</div>
                  <div className="text-xs text-gray-500">Uses</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <BarChart3 className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="text-xs font-medium">{template.metadata.successRate}%</div>
                  <div className="text-xs text-gray-500">Success</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Features */}
              <div className="space-y-1 mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {template.nodes.length} workflow steps
                </div>
                {template.formDefinition && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Built-in forms included
                  </div>
                )}
                {template.aiAgents && template.aiAgents.length > 0 && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    AI agents configured
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => onSelectTemplate(template)}
                  className="flex-1"
                  size="sm"
                >
                  Use Template
                </Button>
                <Button
                  onClick={() => handlePreview(template)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  Preview
                </Button>
              </div>

              {/* Metadata */}
              <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
                Last updated {template.metadata.lastUpdated.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No templates found</div>
          <p className="text-sm text-gray-400 mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button onClick={onCreateBlank} variant="outline">
            Create Custom Workflow
          </Button>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {previewTemplate?.name} - Template Preview
            </DialogTitle>
          </DialogHeader>
          
          {previewTemplate && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Template Details</h4>
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Category:</dt>
                      <dd>{previewTemplate.category}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Complexity:</dt>
                      <dd>{previewTemplate.complexity}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Duration:</dt>
                      <dd>{previewTemplate.estimatedDuration}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Success Rate:</dt>
                      <dd>{previewTemplate.metadata.successRate}%</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {previewTemplate.nodes.length} workflow steps
                    </li>
                    {previewTemplate.formDefinition && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Pre-built forms included
                      </li>
                    )}
                    {previewTemplate.aiAgents && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {previewTemplate.aiAgents.length} AI agents
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Workflow Steps</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {previewTemplate.nodes.map((node, index) => (
                    <div key={node.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{node.data.label}</div>
                        {node.data.description && (
                          <div className="text-xs text-gray-500">{node.data.description}</div>
                        )}
                      </div>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {node.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    onSelectTemplate(previewTemplate)
                    setShowPreview(false)
                  }}
                  className="flex-1"
                >
                  Use This Template
                </Button>
                <Button
                  onClick={() => setShowPreview(false)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}