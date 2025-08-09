import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, index } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  subdomain: varchar('subdomain', { length: 100 }).unique().notNull(),
  domain: varchar('domain', { length: 255 }),
  description: text('description'),
  settings: jsonb('settings').$type<{
    theme?: string;
    logo?: string;
    primaryColor?: string;
    features?: string[];
    integrations?: Record<string, any>;
    limits?: {
      maxUsers?: number;
      maxWorkflows?: number;
      maxExecutionsPerMonth?: number;
    };
  }>().default({}),
  isActive: boolean('is_active').default(true).notNull(),
  subscriptionTier: varchar('subscription_tier', { length: 50 }).default('starter').notNull(),
  subscriptionStatus: varchar('subscription_status', { length: 50 }).default('active').notNull(),
  billingEmail: varchar('billing_email', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  subdomainIdx: index('tenants_subdomain_idx').on(table.subdomain),
  domainIdx: index('tenants_domain_idx').on(table.domain),
  subscriptionTierIdx: index('tenants_subscription_tier_idx').on(table.subscriptionTier),
  isActiveIdx: index('tenants_is_active_idx').on(table.isActive),
}));