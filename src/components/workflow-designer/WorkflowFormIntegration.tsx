'use client'

import { useState } from 'react'
import { FormDesigner, FormRenderer, FormTemplateLibrary } from '@/components/form-builder'
import { formTemplates } from '@/components/form-builder/templates'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit,
  Link,
  Settings 
} from 'lucide-react'

interface WorkflowFormIntegrationProps {
  nodeId: string
  nodeData: any
  onFormSelect: (formId: string, formDefinition: any) => void
  onFormCreate: (formDefinition: any) => void
  onFormUpdate: (formDefinition: any) => void
}

export function WorkflowFormIntegration({
  nodeId,
  nodeData,
  onFormSelect,
  onFormCreate,
  onFormUpdate
}: WorkflowFormIntegrationProps) {
  const [showFormDialog, setShowFormDialog] = useState(false)
  const [currentTab, setCurrentTab] = useState<'templates' | 'create' | 'edit'>('templates')
  const [selectedForm, setSelectedForm] = useState(null)
  const [previewForm, setPreviewForm] = useState(null)

  const handleSelectTemplate = (template) => {
    setSelectedForm(template)
    onFormSelect(template.id, template.definition)
    setShowFormDialog(false)
  }

  const handleCreateForm = () => {
    setCurrentTab('create')
    setShowFormDialog(true)
  }

  const handleEditForm = () => {
    setCurrentTab('edit')
    setShowFormDialog(true)
  }

  const handleSaveForm = (formDefinition) => {
    if (currentTab === 'create') {
      onFormCreate(formDefinition)
    } else {
      onFormUpdate(formDefinition)
    }
    setShowFormDialog(false)
  }

  const hasFormAttached = nodeData.formId || nodeData.formDefinition

  return (
    <div className="space-y-4">
      {/* Form Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Form Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasFormAttached ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {nodeData.formTitle || `Form ${nodeData.formId}`}
                  </div>
                  <div className="text-sm text-gray-500">
                    Connected to workflow node
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviewForm(nodeData.formDefinition)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleEditForm}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Form
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFormDialog(true)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="font-medium mb-2">No Form Connected</h3>
              <p className="text-sm text-gray-500 mb-4">
                Connect a form to collect data in this workflow step
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => {
                    setCurrentTab('templates')
                    setShowFormDialog(true)
                  }}
                >
                  <Link className="h-4 w-4 mr-1" />
                  Select Form
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCreateForm}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create New
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Configuration Options */}
      {hasFormAttached && (
        <Card>
          <CardHeader>
            <CardTitle>Form Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Form Timeout</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>No timeout</option>
                  <option>1 day</option>
                  <option>3 days</option>
                  <option>1 week</option>
                  <option>1 month</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Form Priority</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>Normal</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Required form completion</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Allow form editing after submission</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Send reminder notifications</span>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {currentTab === 'templates' && 'Select Form Template'}
              {currentTab === 'create' && 'Create New Form'}
              {currentTab === 'edit' && 'Edit Form'}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="create">Create New</TabsTrigger>
              <TabsTrigger value="edit" disabled={!hasFormAttached}>Edit Current</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="mt-4">
              <FormTemplateLibrary
                onSelectTemplate={handleSelectTemplate}
                onCreateNew={() => setCurrentTab('create')}
                onPreviewTemplate={(template) => setPreviewForm(template.definition)}
              />
            </TabsContent>

            <TabsContent value="create" className="mt-4">
              <FormDesigner
                onSave={handleSaveForm}
                mode="create"
              />
            </TabsContent>

            <TabsContent value="edit" className="mt-4">
              {hasFormAttached && (
                <FormDesigner
                  onSave={handleSaveForm}
                  initialDefinition={nodeData.formDefinition}
                  mode="edit"
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewForm} onOpenChange={() => setPreviewForm(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Form Preview</DialogTitle>
          </DialogHeader>
          
          {previewForm && (
            <FormRenderer
              formDefinition={previewForm}
              onSubmit={() => {}}
              readOnly={true}
              showNavigationButtons={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}