// Export all schema tables
export * from './tenants';
export * from './users';
export * from './tenant-users';
export * from './roles';
export * from './permissions';
export * from './role-permissions';
export * from './workflows';
export * from './workflow-executions';
export * from './approval-requests';
export * from './ai-agent-tasks';
export * from './audit-logs';

// Export relations for better type inference
import { relations } from 'drizzle-orm';
import { tenants } from './tenants';
import { users } from './users';
import { tenantUsers } from './tenant-users';
import { roles } from './roles';
import { permissions } from './permissions';
import { rolePermissions } from './role-permissions';
import { workflows } from './workflows';
import { workflowExecutions } from './workflow-executions';
import { approvalRequests } from './approval-requests';
import { aiAgentTasks } from './ai-agent-tasks';
import { auditLogs } from './audit-logs';

// Tenant relations
export const tenantsRelations = relations(tenants, ({ many }) => ({
  tenantUsers: many(tenantUsers),
  roles: many(roles),
  workflows: many(workflows),
  auditLogs: many(auditLogs),
}));

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  tenantUsers: many(tenantUsers),
  createdWorkflows: many(workflows, { relationName: 'createdByUser' }),
  updatedWorkflows: many(workflows, { relationName: 'updatedByUser' }),
  createdExecutions: many(workflowExecutions, { relationName: 'createdByUser' }),
  cancelledExecutions: many(workflowExecutions, { relationName: 'cancelledByUser' }),
  requestedApprovals: many(approvalRequests, { relationName: 'requestedByUser' }),
  approvedRequests: many(approvalRequests, { relationName: 'approvedByUser' }),
  aiAgentTasks: many(aiAgentTasks),
  auditLogs: many(auditLogs),
  invitedTenantUsers: many(tenantUsers, { relationName: 'invitedByUser' }),
}));

// Tenant Users relations
export const tenantUsersRelations = relations(tenantUsers, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantUsers.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [tenantUsers.userId],
    references: [users.id],
  }),
  invitedByUser: one(users, {
    fields: [tenantUsers.invitedBy],
    references: [users.id],
    relationName: 'invitedByUser',
  }),
}));

// Role relations
export const rolesRelations = relations(roles, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [roles.tenantId],
    references: [tenants.id],
  }),
  rolePermissions: many(rolePermissions),
}));

// Permission relations
export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

// Role Permission relations
export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

// Workflow relations
export const workflowsRelations = relations(workflows, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [workflows.tenantId],
    references: [tenants.id],
  }),
  createdByUser: one(users, {
    fields: [workflows.createdBy],
    references: [users.id],
    relationName: 'createdByUser',
  }),
  updatedByUser: one(users, {
    fields: [workflows.updatedBy],
    references: [users.id],
    relationName: 'updatedByUser',
  }),
  template: one(workflows, {
    fields: [workflows.templateId],
    references: [workflows.id],
    relationName: 'template',
  }),
  derivedWorkflows: many(workflows, { relationName: 'template' }),
  executions: many(workflowExecutions),
}));

// Workflow Execution relations
export const workflowExecutionsRelations = relations(workflowExecutions, ({ one, many }) => ({
  workflow: one(workflows, {
    fields: [workflowExecutions.workflowId],
    references: [workflows.id],
  }),
  createdByUser: one(users, {
    fields: [workflowExecutions.createdBy],
    references: [users.id],
    relationName: 'createdByUser',
  }),
  cancelledByUser: one(users, {
    fields: [workflowExecutions.cancelledBy],
    references: [users.id],
    relationName: 'cancelledByUser',
  }),
  approvalRequests: many(approvalRequests),
  aiAgentTasks: many(aiAgentTasks),
}));

// Approval Request relations
export const approvalRequestsRelations = relations(approvalRequests, ({ one }) => ({
  execution: one(workflowExecutions, {
    fields: [approvalRequests.executionId],
    references: [workflowExecutions.id],
  }),
  requestedByUser: one(users, {
    fields: [approvalRequests.requestedBy],
    references: [users.id],
    relationName: 'requestedByUser',
  }),
  approvedByUser: one(users, {
    fields: [approvalRequests.approvedBy],
    references: [users.id],
    relationName: 'approvedByUser',
  }),
}));

// AI Agent Task relations
export const aiAgentTasksRelations = relations(aiAgentTasks, ({ one }) => ({
  execution: one(workflowExecutions, {
    fields: [aiAgentTasks.executionId],
    references: [workflowExecutions.id],
  }),
  requestedByUser: one(users, {
    fields: [aiAgentTasks.requestedBy],
    references: [users.id],
  }),
}));

// Audit Log relations
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [auditLogs.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));