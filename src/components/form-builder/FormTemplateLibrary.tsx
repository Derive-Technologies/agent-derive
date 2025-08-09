'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Eye } from 'lucide-react'
import { FormTemplate } from './types'
import { formTemplates } from './templates'

interface FormTemplateLibraryProps {
  onSelectTemplate: (template: FormTemplate) => void
  onCreateNew: () => void
  onPreviewTemplate?: (template: FormTemplate) => void
}

export function FormTemplateLibrary({ 
  onSelectTemplate, 
  onCreateNew, 
  onPreviewTemplate 
}: FormTemplateLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'approval', label: 'Approval Forms' },
    { value: 'data-collection', label: 'Data Collection' },
    { value: 'evaluation', label: 'Evaluation Forms' },
    { value: 'reporting', label: 'Reporting Forms' }
  ]

  const filteredTemplates = formTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'approval': return 'bg-blue-100 text-blue-800'
      case 'data-collection': return 'bg-green-100 text-green-800'
      case 'evaluation': return 'bg-purple-100 text-purple-800'
      case 'reporting': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Form Templates</h2>
          <p className="text-gray-600 mt-1">Choose from pre-built templates or create your own</p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Form
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
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
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
                  <Badge className={`mt-2 text-xs ${getCategoryColor(template.category)}`}>
                    {template.category.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-sm text-gray-600 mt-2">
                {template.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
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

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => onSelectTemplate(template)}
                  className="flex-1"
                  size="sm"
                >
                  Use Template
                </Button>
                {onPreviewTemplate && (
                  <Button
                    onClick={() => onPreviewTemplate(template)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </Button>
                )}
              </div>

              {/* Metadata */}
              <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
                Created {template.createdAt.toLocaleDateString()}
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
            Try adjusting your search terms or category filter
          </p>
          <Button onClick={onCreateNew} variant="outline">
            Create New Form Instead
          </Button>
        </div>
      )}
    </div>
  )
}