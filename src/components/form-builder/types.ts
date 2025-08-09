export interface FormTemplate {
  id: string
  name: string
  description: string
  category: 'approval' | 'data-collection' | 'evaluation' | 'reporting'
  definition: any // SurveyJS JSON schema
  thumbnail?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface FormValidationRule {
  field: string
  type: 'required' | 'email' | 'number' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: any
  message: string
  condition?: string
}

export interface FormSubmission {
  id: string
  formId: string
  workflowExecutionId?: string
  submittedBy: string
  submittedAt: Date
  data: Record<string, any>
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  reviewNotes?: string
  reviewedBy?: string
  reviewedAt?: Date
}

export interface FormBuilderProps {
  onSave: (formDefinition: any) => void
  initialDefinition?: any
  mode?: 'create' | 'edit'
}

export interface FormRendererProps {
  formDefinition: any
  onSubmit: (data: Record<string, any>) => void
  initialData?: Record<string, any>
  readOnly?: boolean
  showNavigationButtons?: boolean
}