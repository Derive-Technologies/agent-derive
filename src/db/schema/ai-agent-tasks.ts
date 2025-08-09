import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, decimal, index } from 'drizzle-orm/pg-core';
import { workflowExecutions } from './workflow-executions';
import { users } from './users';

export const aiAgentTasks = pgTable('ai_agent_tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  executionId: uuid('execution_id').references(() => workflowExecutions.id, { onDelete: 'cascade' }).notNull(),
  stepId: varchar('step_id', { length: 100 }).notNull(),
  taskName: varchar('task_name', { length: 255 }).notNull(),
  agentType: varchar('agent_type', { length: 100 }).notNull(), // gpt-4, claude, gemini, custom
  model: varchar('model', { length: 100 }), // specific model version
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, running, completed, failed, cancelled
  priority: integer('priority').default(0).notNull(),
  prompt: text('prompt').notNull(),
  systemPrompt: text('system_prompt'),
  context: jsonb('context').$type<{
    workflowData?: Record<string, any>;
    previousSteps?: Array<{
      stepId: string;
      output: any;
    }>;
    userContext?: Record<string, any>;
    environmentVariables?: Record<string, any>;
  }>().default({}),
  input: jsonb('input').$type<Record<string, any>>().default({}),
  output: jsonb('output').$type<{
    result?: any;
    reasoning?: string;
    confidence?: number;
    metadata?: Record<string, any>;
  }>(),
  configuration: jsonb('configuration').$type<{
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    timeout?: number; // in seconds
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
  }>().default({}),
  usage: jsonb('usage').$type<{
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    cost?: number;
    executionTime?: number; // in milliseconds
    apiCalls?: number;
  }>(),
  error: text('error'),
  errorDetails: jsonb('error_details').$type<{
    errorType?: string;
    errorCode?: string;
    stackTrace?: string;
    context?: Record<string, any>;
  }>(),
  retryCount: integer('retry_count').default(0).notNull(),
  costEstimate: decimal('cost_estimate', { precision: 10, scale: 4 }),
  actualCost: decimal('actual_cost', { precision: 10, scale: 4 }),
  requestedBy: uuid('requested_by').references(() => users.id).notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  executionIdIdx: index('ai_agent_tasks_execution_id_idx').on(table.executionId),
  stepIdIdx: index('ai_agent_tasks_step_id_idx').on(table.stepId),
  statusIdx: index('ai_agent_tasks_status_idx').on(table.status),
  agentTypeIdx: index('ai_agent_tasks_agent_type_idx').on(table.agentType),
  priorityIdx: index('ai_agent_tasks_priority_idx').on(table.priority),
  requestedByIdx: index('ai_agent_tasks_requested_by_idx').on(table.requestedBy),
  startedAtIdx: index('ai_agent_tasks_started_at_idx').on(table.startedAt),
  completedAtIdx: index('ai_agent_tasks_completed_at_idx').on(table.completedAt),
  createdAtIdx: index('ai_agent_tasks_created_at_idx').on(table.createdAt),
}));