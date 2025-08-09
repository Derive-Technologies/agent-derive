import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, integer, index } from 'drizzle-orm/pg-core';
import { workflows } from './workflows';
import { users } from './users';

export const workflowExecutions = pgTable('workflow_executions', {
  id: uuid('id').defaultRandom().primaryKey(),
  workflowId: uuid('workflow_id').references(() => workflows.id, { onDelete: 'cascade' }).notNull(),
  executionNumber: integer('execution_number').notNull(), // auto-incrementing per workflow
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, running, completed, failed, cancelled, paused
  triggerType: varchar('trigger_type', { length: 50 }).notNull(), // manual, scheduled, webhook, event
  triggerData: jsonb('trigger_data').$type<{
    userId?: string;
    scheduledAt?: string;
    webhookPayload?: Record<string, any>;
    eventData?: Record<string, any>;
  }>(),
  input: jsonb('input').$type<Record<string, any>>().default({}),
  output: jsonb('output').$type<Record<string, any>>().default({}),
  variables: jsonb('variables').$type<Record<string, any>>().default({}),
  currentStepId: varchar('current_step_id', { length: 100 }),
  stepStates: jsonb('step_states').$type<Record<string, {
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startedAt?: string;
    completedAt?: string;
    input?: Record<string, any>;
    output?: Record<string, any>;
    error?: string;
    retryCount?: number;
  }>>().default({}),
  executionPath: jsonb('execution_path').$type<Array<{
    stepId: string;
    timestamp: string;
    status: string;
  }>>().default([]),
  error: text('error'),
  errorDetails: jsonb('error_details').$type<{
    stepId?: string;
    errorType?: string;
    stackTrace?: string;
    context?: Record<string, any>;
  }>(),
  metrics: jsonb('metrics').$type<{
    totalSteps?: number;
    completedSteps?: number;
    failedSteps?: number;
    skippedSteps?: number;
    executionTime?: number; // in milliseconds
    waitTime?: number; // time spent waiting for approvals, etc.
  }>().default({}),
  priority: integer('priority').default(0).notNull(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  cancelledBy: uuid('cancelled_by').references(() => users.id),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  workflowIdIdx: index('workflow_executions_workflow_id_idx').on(table.workflowId),
  statusIdx: index('workflow_executions_status_idx').on(table.status),
  triggerTypeIdx: index('workflow_executions_trigger_type_idx').on(table.triggerType),
  createdByIdx: index('workflow_executions_created_by_idx').on(table.createdBy),
  scheduledAtIdx: index('workflow_executions_scheduled_at_idx').on(table.scheduledAt),
  startedAtIdx: index('workflow_executions_started_at_idx').on(table.startedAt),
  completedAtIdx: index('workflow_executions_completed_at_idx').on(table.completedAt),
  createdAtIdx: index('workflow_executions_created_at_idx').on(table.createdAt),
  workflowExecutionNumberIdx: index('workflow_executions_workflow_execution_number_idx').on(table.workflowId, table.executionNumber),
}));