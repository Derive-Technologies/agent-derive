import { pgTable, uuid, varchar, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { users } from './users';

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(), // create, update, delete, execute, approve, etc.
  resource: varchar('resource', { length: 100 }).notNull(), // workflow, user, tenant, execution, etc.
  resourceId: uuid('resource_id'),
  description: text('description').notNull(),
  category: varchar('category', { length: 50 }).notNull(), // security, workflow, user_management, system, etc.
  severity: varchar('severity', { length: 20 }).default('info').notNull(), // debug, info, warning, error, critical
  ipAddress: varchar('ip_address', { length: 45 }), // supports IPv6
  userAgent: text('user_agent'),
  metadata: jsonb('metadata').$type<{
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
    duration?: number; // in milliseconds
    success?: boolean;
    errorDetails?: {
      code?: string;
      message?: string;
      stackTrace?: string;
    };
    additionalData?: Record<string, any>;
  }>().default({}),
  tags: jsonb('tags').$type<string[]>().default([]),
  correlationId: uuid('correlation_id'), // for linking related audit events
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  tenantIdIdx: index('audit_logs_tenant_id_idx').on(table.tenantId),
  userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
  actionIdx: index('audit_logs_action_idx').on(table.action),
  resourceIdx: index('audit_logs_resource_idx').on(table.resource),
  resourceIdIdx: index('audit_logs_resource_id_idx').on(table.resourceId),
  categoryIdx: index('audit_logs_category_idx').on(table.category),
  severityIdx: index('audit_logs_severity_idx').on(table.severity),
  correlationIdIdx: index('audit_logs_correlation_id_idx').on(table.correlationId),
  createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
  actionResourceIdx: index('audit_logs_action_resource_idx').on(table.action, table.resource),
  tenantIdCreatedAtIdx: index('audit_logs_tenant_id_created_at_idx').on(table.tenantId, table.createdAt),
}));