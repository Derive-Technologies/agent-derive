import { db } from './client';
import { permissions, roles, rolePermissions } from './schema';
import { eq, and } from 'drizzle-orm';

/**
 * System permissions that should be available across all tenants
 */
const SYSTEM_PERMISSIONS = [
  // Tenant Management
  { name: 'tenant.create', displayName: 'Create Tenant', description: 'Create new tenants', category: 'tenants', resource: 'tenant', action: 'create' },
  { name: 'tenant.read', displayName: 'View Tenant', description: 'View tenant details', category: 'tenants', resource: 'tenant', action: 'read' },
  { name: 'tenant.update', displayName: 'Update Tenant', description: 'Update tenant settings', category: 'tenants', resource: 'tenant', action: 'update' },
  { name: 'tenant.delete', displayName: 'Delete Tenant', description: 'Delete tenant', category: 'tenants', resource: 'tenant', action: 'delete' },
  { name: 'tenant.manage_users', displayName: 'Manage Users', description: 'Add/remove users from tenant', category: 'tenants', resource: 'tenant', action: 'manage_users' },
  { name: 'tenant.manage_settings', displayName: 'Manage Settings', description: 'Configure tenant settings', category: 'tenants', resource: 'tenant', action: 'manage_settings' },

  // User Management
  { name: 'user.create', displayName: 'Create User', description: 'Create new users', category: 'users', resource: 'user', action: 'create' },
  { name: 'user.read', displayName: 'View User', description: 'View user details', category: 'users', resource: 'user', action: 'read' },
  { name: 'user.update', displayName: 'Update User', description: 'Update user details', category: 'users', resource: 'user', action: 'update' },
  { name: 'user.delete', displayName: 'Delete User', description: 'Delete user', category: 'users', resource: 'user', action: 'delete' },
  { name: 'user.invite', displayName: 'Invite User', description: 'Invite users to tenant', category: 'users', resource: 'user', action: 'invite' },
  { name: 'user.manage_roles', displayName: 'Manage Roles', description: 'Assign/change user roles', category: 'users', resource: 'user', action: 'manage_roles' },

  // Role Management
  { name: 'role.create', displayName: 'Create Role', description: 'Create new roles', category: 'roles', resource: 'role', action: 'create' },
  { name: 'role.read', displayName: 'View Role', description: 'View role details', category: 'roles', resource: 'role', action: 'read' },
  { name: 'role.update', displayName: 'Update Role', description: 'Update role details', category: 'roles', resource: 'role', action: 'update' },
  { name: 'role.delete', displayName: 'Delete Role', description: 'Delete role', category: 'roles', resource: 'role', action: 'delete' },
  { name: 'role.manage_permissions', displayName: 'Manage Permissions', description: 'Assign permissions to roles', category: 'roles', resource: 'role', action: 'manage_permissions' },

  // Workflow Management
  { name: 'workflow.create', displayName: 'Create Workflow', description: 'Create new workflows', category: 'workflows', resource: 'workflow', action: 'create' },
  { name: 'workflow.read', displayName: 'View Workflow', description: 'View workflow details', category: 'workflows', resource: 'workflow', action: 'read' },
  { name: 'workflow.update', displayName: 'Update Workflow', description: 'Update workflow definition', category: 'workflows', resource: 'workflow', action: 'update' },
  { name: 'workflow.delete', displayName: 'Delete Workflow', description: 'Delete workflow', category: 'workflows', resource: 'workflow', action: 'delete' },
  { name: 'workflow.execute', displayName: 'Execute Workflow', description: 'Execute workflows', category: 'workflows', resource: 'workflow', action: 'execute' },
  { name: 'workflow.publish', displayName: 'Publish Workflow', description: 'Publish workflow to make it available', category: 'workflows', resource: 'workflow', action: 'publish' },
  { name: 'workflow.clone', displayName: 'Clone Workflow', description: 'Clone existing workflows', category: 'workflows', resource: 'workflow', action: 'clone' },

  // Workflow Execution Management
  { name: 'execution.read', displayName: 'View Execution', description: 'View workflow execution details', category: 'executions', resource: 'execution', action: 'read' },
  { name: 'execution.cancel', displayName: 'Cancel Execution', description: 'Cancel running workflows', category: 'executions', resource: 'execution', action: 'cancel' },
  { name: 'execution.retry', displayName: 'Retry Execution', description: 'Retry failed workflows', category: 'executions', resource: 'execution', action: 'retry' },
  { name: 'execution.logs', displayName: 'View Execution Logs', description: 'View detailed execution logs', category: 'executions', resource: 'execution', action: 'logs' },

  // Approval Management
  { name: 'approval.create', displayName: 'Create Approval', description: 'Create approval requests', category: 'approvals', resource: 'approval', action: 'create' },
  { name: 'approval.read', displayName: 'View Approval', description: 'View approval requests', category: 'approvals', resource: 'approval', action: 'read' },
  { name: 'approval.approve', displayName: 'Approve Request', description: 'Approve workflow requests', category: 'approvals', resource: 'approval', action: 'approve' },
  { name: 'approval.reject', displayName: 'Reject Request', description: 'Reject workflow requests', category: 'approvals', resource: 'approval', action: 'reject' },
  { name: 'approval.assign', displayName: 'Assign Approval', description: 'Assign approval requests to users', category: 'approvals', resource: 'approval', action: 'assign' },

  // AI Agent Management
  { name: 'ai_agent.create', displayName: 'Create AI Task', description: 'Create AI agent tasks', category: 'ai_agents', resource: 'ai_agent', action: 'create' },
  { name: 'ai_agent.read', displayName: 'View AI Task', description: 'View AI agent task details', category: 'ai_agents', resource: 'ai_agent', action: 'read' },
  { name: 'ai_agent.configure', displayName: 'Configure AI Agent', description: 'Configure AI agent settings', category: 'ai_agents', resource: 'ai_agent', action: 'configure' },
  { name: 'ai_agent.cancel', displayName: 'Cancel AI Task', description: 'Cancel running AI tasks', category: 'ai_agents', resource: 'ai_agent', action: 'cancel' },

  // Audit Management
  { name: 'audit.read', displayName: 'View Audit Logs', description: 'View audit logs', category: 'audit', resource: 'audit', action: 'read' },
  { name: 'audit.export', displayName: 'Export Audit Logs', description: 'Export audit logs', category: 'audit', resource: 'audit', action: 'export' },

  // Analytics & Reporting
  { name: 'analytics.read', displayName: 'View Analytics', description: 'View analytics and reports', category: 'analytics', resource: 'analytics', action: 'read' },
  { name: 'analytics.export', displayName: 'Export Reports', description: 'Export analytics reports', category: 'analytics', resource: 'analytics', action: 'export' },

  // System Management
  { name: 'system.manage', displayName: 'System Management', description: 'Manage system-wide settings', category: 'system', resource: 'system', action: 'manage' },
  { name: 'system.backup', displayName: 'System Backup', description: 'Create and manage backups', category: 'system', resource: 'system', action: 'backup' },
] as const;

/**
 * Default role permission mappings
 */
const ROLE_PERMISSIONS = {
  owner: [
    // Full access to everything
    'tenant.create', 'tenant.read', 'tenant.update', 'tenant.delete', 'tenant.manage_users', 'tenant.manage_settings',
    'user.create', 'user.read', 'user.update', 'user.delete', 'user.invite', 'user.manage_roles',
    'role.create', 'role.read', 'role.update', 'role.delete', 'role.manage_permissions',
    'workflow.create', 'workflow.read', 'workflow.update', 'workflow.delete', 'workflow.execute', 'workflow.publish', 'workflow.clone',
    'execution.read', 'execution.cancel', 'execution.retry', 'execution.logs',
    'approval.create', 'approval.read', 'approval.approve', 'approval.reject', 'approval.assign',
    'ai_agent.create', 'ai_agent.read', 'ai_agent.configure', 'ai_agent.cancel',
    'audit.read', 'audit.export',
    'analytics.read', 'analytics.export',
    'system.manage', 'system.backup',
  ],
  admin: [
    // Administrative access with some restrictions
    'tenant.read', 'tenant.update', 'tenant.manage_users', 'tenant.manage_settings',
    'user.create', 'user.read', 'user.update', 'user.invite', 'user.manage_roles',
    'role.create', 'role.read', 'role.update', 'role.manage_permissions',
    'workflow.create', 'workflow.read', 'workflow.update', 'workflow.delete', 'workflow.execute', 'workflow.publish', 'workflow.clone',
    'execution.read', 'execution.cancel', 'execution.retry', 'execution.logs',
    'approval.create', 'approval.read', 'approval.approve', 'approval.reject', 'approval.assign',
    'ai_agent.create', 'ai_agent.read', 'ai_agent.configure', 'ai_agent.cancel',
    'audit.read', 'audit.export',
    'analytics.read', 'analytics.export',
  ],
  editor: [
    // Can create and edit workflows
    'user.read',
    'workflow.create', 'workflow.read', 'workflow.update', 'workflow.execute', 'workflow.clone',
    'execution.read', 'execution.cancel', 'execution.retry', 'execution.logs',
    'approval.create', 'approval.read', 'approval.approve', 'approval.reject',
    'ai_agent.create', 'ai_agent.read', 'ai_agent.configure',
    'analytics.read',
  ],
  viewer: [
    // Read-only access
    'user.read',
    'workflow.read',
    'execution.read', 'execution.logs',
    'approval.read',
    'ai_agent.read',
    'analytics.read',
  ],
  member: [
    // Basic access to assigned workflows
    'user.read',
    'workflow.read', 'workflow.execute',
    'execution.read',
    'approval.read', 'approval.approve', 'approval.reject',
    'ai_agent.read',
  ],
} as const;

/**
 * Seed the database with system permissions
 */
export async function seedSystemPermissions() {
  console.log('🌱 Seeding system permissions...');
  
  try {
    // Insert system permissions
    for (const permission of SYSTEM_PERMISSIONS) {
      await db.insert(permissions)
        .values({
          ...permission,
          isSystemPermission: true,
        })
        .onConflictDoNothing({ target: permissions.name });
    }

    console.log(`✅ Seeded ${SYSTEM_PERMISSIONS.length} system permissions`);
  } catch (error) {
    console.error('❌ Error seeding system permissions:', error);
    throw error;
  }
}

/**
 * Assign default permissions to system roles for a specific tenant
 */
export async function assignDefaultRolePermissions(tenantId: string) {
  console.log(`🔐 Assigning default role permissions for tenant ${tenantId}...`);
  
  try {
    // Get all system roles for this tenant
    const tenantRoles = await db.select()
      .from(roles)
      .where(and(
        eq(roles.tenantId, tenantId),
        eq(roles.isSystemRole, true)
      ));

    // Get all system permissions
    const systemPermissions = await db.select()
      .from(permissions)
      .where(eq(permissions.isSystemPermission, true));

    const permissionMap = new Map(
      systemPermissions.map(p => [p.name, p.id])
    );

    // Assign permissions to each role
    for (const role of tenantRoles) {
      const rolePermissionNames = ROLE_PERMISSIONS[role.name as keyof typeof ROLE_PERMISSIONS];
      if (!rolePermissionNames) {
        console.warn(`⚠️  No default permissions found for role: ${role.name}`);
        continue;
      }

      const rolePermissionInserts = rolePermissionNames
        .map(permissionName => {
          const permissionId = permissionMap.get(permissionName);
          if (!permissionId) {
            console.warn(`⚠️  Permission not found: ${permissionName}`);
            return null;
          }
          return {
            roleId: role.id,
            permissionId,
          };
        })
        .filter(Boolean) as Array<{ roleId: string; permissionId: string }>;

      if (rolePermissionInserts.length > 0) {
        await db.insert(rolePermissions)
          .values(rolePermissionInserts)
          .onConflictDoNothing({ target: [rolePermissions.roleId, rolePermissions.permissionId] });

        console.log(`✅ Assigned ${rolePermissionInserts.length} permissions to role: ${role.displayName}`);
      }
    }

    console.log('✅ Default role permissions assigned successfully');
  } catch (error) {
    console.error('❌ Error assigning default role permissions:', error);
    throw error;
  }
}

/**
 * Seed comprehensive data for testing
 */
export async function seedTestData() {
  console.log('🌱 Seeding test data...');
  
  const { 
    tenants, 
    users, 
    workflows, 
    workflowNodes,
    workflowEdges,
    workflowExecutions,
    executionLogs,
    approvals,
    forms,
    formSubmissions,
    aiTasks,
    auditLogs
  } = await import('./schema');
  
  try {
    // Create test tenant
    const [tenant] = await db.insert(tenants).values([{
      id: 'test-tenant-001',
      name: 'Acme Corporation',
      domain: 'acme.com',
      settings: {
        theme: 'light',
        timezone: 'America/New_York',
        features: ['workflows', 'approvals', 'ai-agents', 'forms']
      },
      subscription: 'enterprise',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }]).returning();

    // Create test users
    const [adminUser, regularUser] = await db.insert(users).values([
      {
        id: 'test-user-admin',
        tenantId: tenant.id,
        email: 'admin@acme.com',
        name: 'John Admin',
        passwordHash: 'test-hash',
        role: 'admin',
        department: 'IT',
        status: 'active',
        settings: { notifications: true },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'test-user-regular',
        tenantId: tenant.id,
        email: 'user@acme.com',
        name: 'Jane User',
        passwordHash: 'test-hash',
        role: 'user',
        department: 'Finance',
        status: 'active',
        settings: { notifications: true },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]).returning();

    // Create test workflows
    const [workflow1, workflow2] = await db.insert(workflows).values([
      {
        id: 'test-workflow-001',
        tenantId: tenant.id,
        name: 'Purchase Approval Workflow',
        description: 'Automated purchase request approval process',
        type: 'approval',
        trigger: 'manual',
        status: 'active',
        version: 1,
        config: { approvalLevels: [{ level: 1, amount: 1000, approver: 'manager' }] },
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'test-workflow-002',
        tenantId: tenant.id,
        name: 'Employee Onboarding',
        description: 'Complete onboarding process for new employees',
        type: 'process',
        trigger: 'event',
        status: 'active',
        version: 1,
        config: { steps: ['create_accounts', 'setup_equipment'] },
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]).returning();

    // Create workflow executions
    const [execution1, execution2] = await db.insert(workflowExecutions).values([
      {
        id: 'test-execution-001',
        workflowId: workflow1.id,
        tenantId: tenant.id,
        status: 'completed',
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        initiatedBy: regularUser.id,
        input: { amount: 3500, description: 'New laptops' },
        output: { approved: true },
        metadata: { duration: '24h' },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'test-execution-002',
        workflowId: workflow1.id,
        tenantId: tenant.id,
        status: 'running',
        startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        initiatedBy: regularUser.id,
        input: { amount: 8500, description: 'Office supplies' },
        metadata: { current_step: 'approval' },
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ]).returning();

    // Create approvals
    await db.insert(approvals).values([
      {
        id: 'test-approval-001',
        workflowId: workflow1.id,
        executionId: execution2.id,
        tenantId: tenant.id,
        nodeId: 'test-node-001',
        status: 'pending',
        requestedBy: regularUser.id,
        requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        data: { amount: 8500, description: 'Office supplies', priority: 'high' },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 'test-approval-002',
        workflowId: workflow1.id,
        executionId: execution1.id,
        tenantId: tenant.id,
        nodeId: 'test-node-002',
        status: 'approved',
        requestedBy: regularUser.id,
        requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        approvedBy: adminUser.id,
        approvedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
        data: { amount: 3500, description: 'New laptops', priority: 'medium' },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('✅ Test data seeded successfully');
    console.log('📊 Summary:');
    console.log('  - Tenants: 1');
    console.log('  - Users: 2');
    console.log('  - Workflows: 2');
    console.log('  - Executions: 2');
    console.log('  - Approvals: 2');
    console.log('');
    console.log('🔑 Test Credentials:');
    console.log('  Admin: admin@acme.com');
    console.log('  User: user@acme.com');
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    throw error;
  }
}

/**
 * Run all seed operations
 */
export async function runSeed() {
  console.log('🌱 Starting database seed...');
  
  try {
    await seedSystemPermissions();
    await seedTestData();
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Database seed failed:', error);
    process.exit(1);
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  runSeed();
}