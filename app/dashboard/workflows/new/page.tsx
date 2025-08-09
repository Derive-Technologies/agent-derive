'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { WorkflowCanvas } from '@/components/workflow-designer/WorkflowCanvas'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, Save, Play } from 'lucide-react'

export default function NewWorkflowPage() {
  const router = useRouter()
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [workflowType, setWorkflowType] = useState('approval')
  const [showDesigner, setShowDesigner] = useState(false)

  const handleSaveWorkflow = () => {
    if (!workflowName) {
      toast.error('Please enter a workflow name')
      return
    }
    
    toast.success('Workflow saved successfully!')
    // In a real app, this would save to the database
  }

  const handleTestWorkflow = () => {
    toast.info('Testing workflow...')
    // In a real app, this would validate and test the workflow
  }

  const handleBack = () => {
    router.push('/dashboard/workflows')
  }

  if (showDesigner) {
    return (
      <div className="flex flex-col h-screen">
        <div className="border-b p-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{workflowName || 'New Workflow'}</h1>
              <p className="text-sm text-muted-foreground">{workflowDescription || 'No description'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleTestWorkflow}>
              <Play className="h-4 w-4 mr-2" />
              Test
            </Button>
            <Button onClick={handleSaveWorkflow}>
              <Save className="h-4 w-4 mr-2" />
              Save Workflow
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <WorkflowCanvas
            workflowId={workflowName.toLowerCase().replace(/\s+/g, '-')}
            onSave={async (nodes, edges) => {
              console.log('Saving workflow:', { nodes, edges })
              toast.success('Workflow saved successfully!')
            }}
            onExecute={async (id) => {
              console.log('Executing workflow:', id)
              toast.info('Testing workflow...')
            }}
            className="h-full"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Create New Workflow"
        description="Design and configure a new automated workflow"
        action={
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workflows
          </Button>
        }
      />

      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Workflow Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Workflow Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Purchase Approval Process"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this workflow does..."
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="type">Workflow Type</Label>
              <Select value={workflowType} onValueChange={setWorkflowType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approval">Approval Workflow</SelectItem>
                  <SelectItem value="procurement">Procurement Process</SelectItem>
                  <SelectItem value="onboarding">Employee Onboarding</SelectItem>
                  <SelectItem value="contract">Contract Review</SelectItem>
                  <SelectItem value="expense">Expense Report</SelectItem>
                  <SelectItem value="custom">Custom Workflow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setWorkflowName(workflowName || 'Blank Workflow')
                  setShowDesigner(true)
                }}
                className="p-4 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
              >
                <div className="text-2xl mb-2">📄</div>
                <div className="font-medium">Blank Workflow</div>
                <div className="text-xs text-muted-foreground mt-1">Start from scratch</div>
              </button>

              <button
                onClick={() => {
                  setWorkflowName('Purchase Approval')
                  setWorkflowDescription('Multi-level approval for purchase requests')
                  setWorkflowType('approval')
                  setShowDesigner(true)
                }}
                className="p-4 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
              >
                <div className="text-2xl mb-2">💰</div>
                <div className="font-medium">Purchase Approval</div>
                <div className="text-xs text-muted-foreground mt-1">Pre-built template</div>
              </button>

              <button
                onClick={() => {
                  setWorkflowName('Employee Onboarding')
                  setWorkflowDescription('New employee onboarding process')
                  setWorkflowType('onboarding')
                  setShowDesigner(true)
                }}
                className="p-4 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
              >
                <div className="text-2xl mb-2">👋</div>
                <div className="font-medium">Employee Onboarding</div>
                <div className="text-xs text-muted-foreground mt-1">Pre-built template</div>
              </button>

              <button
                onClick={() => {
                  setWorkflowName('Contract Review')
                  setWorkflowDescription('Legal and business contract review')
                  setWorkflowType('contract')
                  setShowDesigner(true)
                }}
                className="p-4 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
              >
                <div className="text-2xl mb-2">📄</div>
                <div className="font-medium">Contract Review</div>
                <div className="text-xs text-muted-foreground mt-1">Pre-built template</div>
              </button>

              <button
                onClick={() => {
                  setWorkflowName('Expense Report')
                  setWorkflowDescription('Expense submission and approval')
                  setWorkflowType('expense')
                  setShowDesigner(true)
                }}
                className="p-4 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
              >
                <div className="text-2xl mb-2">💳</div>
                <div className="font-medium">Expense Report</div>
                <div className="text-xs text-muted-foreground mt-1">Pre-built template</div>
              </button>

              <button
                onClick={() => {
                  setWorkflowName('IT Request')
                  setWorkflowDescription('IT service and equipment requests')
                  setWorkflowType('custom')
                  setShowDesigner(true)
                }}
                className="p-4 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
              >
                <div className="text-2xl mb-2">💻</div>
                <div className="font-medium">IT Request</div>
                <div className="text-xs text-muted-foreground mt-1">Pre-built template</div>
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (!workflowName) {
                toast.error('Please enter a workflow name')
                return
              }
              setShowDesigner(true)
            }}
          >
            Continue to Designer
          </Button>
        </div>
      </div>
    </div>
  )
}