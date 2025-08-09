import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, integer, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { users } from './users';

export const workflows = pgTable('workflows', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  version: integer('version').default(1).notNull(),
  isTemplate: boolean('is_template').default(false).notNull(),
  templateId: uuid('template_id').references(() => workflows.id),
  definition: jsonb('definition').$type<{
    nodes: Array<{
      id: string;
      type: 'start' | 'end' | 'task' | 'approval' | 'condition' | 'ai_agent' | 'human_task' | 'api_call' | 'webhook';
      position: { x: number; y: number };
      data: {
        label: string;
        config?: Record<string, any>;
        inputs?: Record<string, any>;
        outputs?: Record<string, any>;
      };
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
      type?: string;
      conditions?: Record<string, any>;
    }>;
    variables?: Record<string, {
      type: 'string' | 'number' | 'boolean' | 'object' | 'array';
      default?: any;
      required?: boolean;
      description?: string;
    }>;
  }>().notNull(),
  triggers: jsonb('triggers').$type<{
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
  }>().default({}),
  settings: jsonb('settings').$type<{
    timeout?: number; // in minutes
    retryPolicy?: {
      maxRetries?: number;
      retryDelay?: number; // in seconds
      backoffMultiplier?: number;
    };
    notifications?: {
      onSuccess?: string[];
      onFailure?: string[];
      onApproval?: string[];
    };
    permissions?: {
      execute?: string[]; // role names
      view?: string[];
      edit?: string[];
    };
  }>().default({}),
  tags: jsonb('tags').$type<string[]>().default([]),
  status: varchar('status', { length: 50 }).default('draft').notNull(), // draft, active, inactive, archived
  isActive: boolean('is_active').default(true).notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  updatedBy: uuid('updated_by').references(() => users.id),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  tenantIdIdx: index('workflows_tenant_id_idx').on(table.tenantId),
  nameIdx: index('workflows_name_idx').on(table.name),
  categoryIdx: index('workflows_category_idx').on(table.category),
  statusIdx: index('workflows_status_idx').on(table.status),
  isActiveIdx: index('workflows_is_active_idx').on(table.isActive),
  isTemplateIdx: index('workflows_is_template_idx').on(table.isTemplate),
  templateIdIdx: index('workflows_template_id_idx').on(table.templateId),
  createdByIdx: index('workflows_created_by_idx').on(table.createdBy),
  createdAtIdx: index('workflows_created_at_idx').on(table.createdAt),
}));