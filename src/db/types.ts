import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type {
  tenants,
  users,
  tenantUsers,
  roles,
  permissions,
  rolePermissions,
  workflows,
  workflowExecutions,
  approvalRequests,
  aiAgentTasks,
  auditLogs,
} from './schema';

// Select types (for reading from database)
export type Tenant = InferSelectModel<typeof tenants>;
export type User = InferSelectModel<typeof users>;
export type TenantUser = InferSelectModel<typeof tenantUsers>;
export type Role = InferSelectModel<typeof roles>;
export type Permission = InferSelectModel<typeof permissions>;
export type RolePermission = InferSelectModel<typeof rolePermissions>;
export type Workflow = InferSelectModel<typeof workflows>;
export type WorkflowExecution = InferSelectModel<typeof workflowExecutions>;
export type ApprovalRequest = InferSelectModel<typeof approvalRequests>;
export type AiAgentTask = InferSelectModel<typeof aiAgentTasks>;
export type AuditLog = InferSelectModel<typeof auditLogs>;

// Insert types (for inserting into database)
export type NewTenant = InferInsertModel<typeof tenants>;
export type NewUser = InferInsertModel<typeof users>;
export type NewTenantUser = InferInsertModel<typeof tenantUsers>;
export type NewRole = InferInsertModel<typeof roles>;
export type NewPermission = InferInsertModel<typeof permissions>;
export type NewRolePermission = InferInsertModel<typeof rolePermissions>;
export type NewWorkflow = InferInsertModel<typeof workflows>;
export type NewWorkflowExecution = InferInsertModel<typeof workflowExecutions>;
export type NewApprovalRequest = InferInsertModel<typeof approvalRequests>;
export type NewAiAgentTask = InferInsertModel<typeof aiAgentTasks>;
export type NewAuditLog = InferInsertModel<typeof auditLogs>;

// Workflow definition types
export type WorkflowNodeType = 
  | 'start' 
  | 'end' 
  | 'task' 
  | 'approval' 
  | 'condition' 
  | 'ai_agent' 
  | 'human_task' 
  | 'api_call' 
  | 'webhook';

export type WorkflowNode = {
  id: string;
  type: WorkflowNodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    config?: Record<string, any>;
    inputs?: Record<string, any>;
    outputs?: Record<string, any>;
  };
};

export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  conditions?: Record<string, any>;
};

export type WorkflowDefinition = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables?: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    default?: any;
    required?: boolean;
    description?: string;
  }>;
};

// Workflow triggers
export type WorkflowTriggers = {
  manual?: boolean;
  schedule?: {
    cron?: string;
    timezone?: string;
  };
  webhook?: {
    enabled: boolean;
    url?: string;
    secret?: string;
  };
  events?: Array<{
    type: string;
    conditions?: Record<string, any>;
  }>;
};

// Workflow settings
export type WorkflowSettings = {
  timeout?: number;
  retryPolicy?: {
    maxRetries?: number;
    retryDelay?: number;
    backoffMultiplier?: number;
  };
  notifications?: {
    onSuccess?: string[];
    onFailure?: string[];
    onApproval?: string[];
  };
  permissions?: {
    execute?: string[];
    view?: string[];
    edit?: string[];
  };
};

// Execution status types
export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'paused';
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';
export type AiTaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

// Trigger types
export type TriggerType = 'manual' | 'scheduled' | 'webhook' | 'event';

// User preferences
export type UserPreferences = {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    workflowUpdates?: boolean;
    approvalRequests?: boolean;
  };
  dashboard?: {
    layout?: string;
    widgets?: string[];
  };
};

// Tenant settings
export type TenantSettings = {
  theme?: string;
  logo?: string;
  primaryColor?: string;
  features?: string[];
  integrations?: Record<string, any>;
  limits?: {
    maxUsers?: number;
    maxWorkflows?: number;
    maxExecutionsPerMonth?: number;
  };
};

// AI Agent configuration
export type AiAgentConfiguration = {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  timeout?: number;
  retryPolicy?: {
    maxRetries?: number;
    retryDelay?: number;
    backoffMultiplier?: number;
  };
  tools?: Array<{
    name: string;
    description: string;
    parameters: Record<string, any>;
  }>;
  functions?: Array<{
    name: string;
    description: string;
    parameters: Record<string, any>;
  }>;
};

// Approval request data types
export type ApprovalFormField = {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'date' | 'file';
  label: string;
  required?: boolean;
  options?: string[];
  value?: any;
};

export type ApprovalRequestData = {
  context?: Record<string, any>;
  form?: {
    fields: ApprovalFormField[];
  };
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  deadline?: string;
};

export type ApprovalDecision = {
  userId: string;
  decision: 'approved' | 'rejected';
  comment?: string;
  timestamp: string;
  formData?: Record<string, any>;
};

export type ApprovalData = {
  decisions: ApprovalDecision[];
  finalDecision?: 'approved' | 'rejected';
  finalComment?: string;
};

// Audit log metadata
export type AuditLogMetadata = {
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  changes?: Record<string, {
    from: any;
    to: any;
  }>;
  executionContext?: {
    workflowId?: string;
    executionId?: string;
    stepId?: string;
  };
  requestId?: string;
  sessionId?: string;
  duration?: number;
  success?: boolean;
  errorDetails?: {
    code?: string;
    message?: string;
    stackTrace?: string;
  };
  additionalData?: Record<string, any>;
};

// Role names (for type safety)
export type RoleName = 'owner' | 'admin' | 'editor' | 'viewer' | 'member';

// Permission categories
export type PermissionCategory = 
  | 'tenants' 
  | 'users' 
  | 'roles' 
  | 'workflows' 
  | 'executions' 
  | 'approvals' 
  | 'ai_agents' 
  | 'audit' 
  | 'analytics' 
  | 'system';

// Resource types
export type ResourceType = 
  | 'tenant' 
  | 'user' 
  | 'role' 
  | 'workflow' 
  | 'execution' 
  | 'approval' 
  | 'ai_agent' 
  | 'audit' 
  | 'analytics' 
  | 'system';

// Action types
export type ActionType = 
  | 'create' 
  | 'read' 
  | 'update' 
  | 'delete' 
  | 'execute' 
  | 'approve' 
  | 'reject' 
  | 'cancel' 
  | 'retry' 
  | 'publish' 
  | 'clone' 
  | 'invite' 
  | 'assign' 
  | 'configure' 
  | 'export' 
  | 'manage' 
  | 'backup' 
  | 'manage_users' 
  | 'manage_settings' 
  | 'manage_roles' 
  | 'manage_permissions' 
  | 'logs';