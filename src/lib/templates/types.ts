export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: 'approval' | 'onboarding' | 'review' | 'data-collection' | 'notification'
  tags: string[]
  estimatedDuration: string
  complexity: 'simple' | 'moderate' | 'complex'
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  formDefinition?: any
  aiAgents?: AIAgentConfig[]
  metadata: {
    createdBy: string
    version: string
    lastUpdated: Date
    usageCount: number
    successRate: number
  }
}

export interface WorkflowNode {
  id: string
  type: 'start' | 'end' | 'approval' | 'task' | 'conditional' | 'parallel' | 'ai-agent' | 'form'
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
    config?: any
    formId?: string
    agentId?: string
    approvers?: string[]
    conditions?: Condition[]
    timeout?: string
    priority?: 'low' | 'medium' | 'high' | 'critical'
  }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  type?: 'default' | 'conditional'
  data?: {
    label?: string
    condition?: string
  }
}

export interface Condition {
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains'
  value: any
  logic?: 'and' | 'or'
}

export interface AIAgentConfig {
  id: string
  name: string
  type: 'approval' | 'analysis' | 'data-processing' | 'notification'
  model: string
  prompt: string
  capabilities: string[]
  rules: {
    autoApprove?: boolean
    escalationThreshold?: number
    maxProcessingTime?: string
  }
}