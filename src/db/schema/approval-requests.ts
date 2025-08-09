import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, integer, index } from 'drizzle-orm/pg-core';
import { workflowExecutions } from './workflow-executions';
import { users } from './users';

export const approvalRequests = pgTable('approval_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  executionId: uuid('execution_id').references(() => workflowExecutions.id, { onDelete: 'cascade' }).notNull(),
  stepId: varchar('step_id', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).default('manual').notNull(), // manual, automatic, conditional
  priority: integer('priority').default(0).notNull(), // 0=low, 1=medium, 2=high, 3=critical
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, approved, rejected, cancelled, expired
  approvalType: varchar('approval_type', { length: 50 }).default('single').notNull(), // single, multiple, unanimous, majority
  requiredApprovals: integer('required_approvals').default(1).notNull(),
  receivedApprovals: integer('received_approvals').default(0).notNull(),
  requestData: jsonb('request_data').$type<{
    context?: Record<string, any>;
    form?: {
      fields: Array<{
        name: string;
        type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'date' | 'file';
        label: string;
        required?: boolean;
        options?: string[];
        value?: any;
      }>;
    };
    attachments?: Array<{
      name: string;
      url: string;
      type: string;
      size: number;
    }>;
    deadline?: string;
  }>().default({}),
  approvalData: jsonb('approval_data').$type<{
    decisions: Array<{
      userId: string;
      decision: 'approved' | 'rejected';
      comment?: string;
      timestamp: string;
      formData?: Record<string, any>;
    }>;
    finalDecision?: 'approved' | 'rejected';
    finalComment?: string;
  }>().default({ decisions: [] }),
  escalationRules: jsonb('escalation_rules').$type<{
    timeoutMinutes?: number;
    escalateTo?: string[]; // user IDs
    autoApprove?: boolean;
    autoReject?: boolean;
  }>(),
  requestedBy: uuid('requested_by').references(() => users.id).notNull(),
  assignedTo: jsonb('assigned_to').$type<string[]>().default([]), // array of user IDs
  approvedBy: uuid('approved_by').references(() => users.id),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  respondedAt: timestamp('responded_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  executionIdIdx: index('approval_requests_execution_id_idx').on(table.executionId),
  stepIdIdx: index('approval_requests_step_id_idx').on(table.stepId),
  statusIdx: index('approval_requests_status_idx').on(table.status),
  priorityIdx: index('approval_requests_priority_idx').on(table.priority),
  requestedByIdx: index('approval_requests_requested_by_idx').on(table.requestedBy),
  approvedByIdx: index('approval_requests_approved_by_idx').on(table.approvedBy),
  expiresAtIdx: index('approval_requests_expires_at_idx').on(table.expiresAt),
  createdAtIdx: index('approval_requests_created_at_idx').on(table.createdAt),
}));