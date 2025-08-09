import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  avatar: text('avatar'),
  phoneNumber: varchar('phone_number', { length: 20 }),
  title: varchar('title', { length: 100 }),
  department: varchar('department', { length: 100 }),
  authProvider: varchar('auth_provider', { length: 50 }).default('email').notNull(),
  authId: varchar('auth_id', { length: 255 }),
  preferences: jsonb('preferences').$type<{
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
  }>().default({}),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  isActive: boolean('is_active').default(true).notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  authProviderAuthIdIdx: index('users_auth_provider_auth_id_idx').on(table.authProvider, table.authId),
  isActiveIdx: index('users_is_active_idx').on(table.isActive),
  lastLoginAtIdx: index('users_last_login_at_idx').on(table.lastLoginAt),
}));