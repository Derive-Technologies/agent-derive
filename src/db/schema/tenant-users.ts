import { pgTable, uuid, varchar, timestamp, boolean, index, primaryKey } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { users } from './users';

export const tenantUsers = pgTable('tenant_users', {
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 50 }).default('member').notNull(),
  status: varchar('status', { length: 50 }).default('active').notNull(), // active, suspended, invited
  invitedBy: uuid('invited_by').references(() => users.id),
  invitedAt: timestamp('invited_at', { withTimezone: true }),
  joinedAt: timestamp('joined_at', { withTimezone: true }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.tenantId, table.userId] }),
  tenantIdIdx: index('tenant_users_tenant_id_idx').on(table.tenantId),
  userIdIdx: index('tenant_users_user_id_idx').on(table.userId),
  roleIdx: index('tenant_users_role_idx').on(table.role),
  statusIdx: index('tenant_users_status_idx').on(table.status),
  isActiveIdx: index('tenant_users_is_active_idx').on(table.isActive),
}));