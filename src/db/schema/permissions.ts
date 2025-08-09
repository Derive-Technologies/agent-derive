import { pgTable, uuid, varchar, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';

export const permissions = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(), // workflows, users, tenants, approvals, etc.
  resource: varchar('resource', { length: 50 }).notNull(), // workflow, user, tenant, etc.
  action: varchar('action', { length: 50 }).notNull(), // create, read, update, delete, execute, approve
  isSystemPermission: boolean('is_system_permission').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  nameIdx: index('permissions_name_idx').on(table.name),
  categoryIdx: index('permissions_category_idx').on(table.category),
  resourceActionIdx: index('permissions_resource_action_idx').on(table.resource, table.action),
  isSystemPermissionIdx: index('permissions_is_system_permission_idx').on(table.isSystemPermission),
}));