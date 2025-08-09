import { pgTable, uuid, timestamp, index, primaryKey } from 'drizzle-orm/pg-core';
import { roles } from './roles';
import { permissions } from './permissions';

export const rolePermissions = pgTable('role_permissions', {
  roleId: uuid('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
  permissionId: uuid('permission_id').references(() => permissions.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
  roleIdIdx: index('role_permissions_role_id_idx').on(table.roleId),
  permissionIdIdx: index('role_permissions_permission_id_idx').on(table.permissionId),
}));