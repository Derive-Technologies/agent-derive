import { pgTable, uuid, varchar, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  description: text('description'),
  isSystemRole: boolean('is_system_role').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  tenantIdNameIdx: index('roles_tenant_id_name_idx').on(table.tenantId, table.name),
  tenantIdIdx: index('roles_tenant_id_idx').on(table.tenantId),
  isSystemRoleIdx: index('roles_is_system_role_idx').on(table.isSystemRole),
  isActiveIdx: index('roles_is_active_idx').on(table.isActive),
}));