import { eq, and, desc, asc, count, sql } from 'drizzle-orm';
import { db } from './client';
import { tenants, users, tenantUsers, roles, permissions, rolePermissions } from './schema';
import type { Database } from './client';

/**
 * Database utility functions for common operations
 */
export class DatabaseUtils {
  private db: Database;

  constructor(database?: Database) {
    this.db = database ?? db;
  }

  /**
   * Get tenant with user count
   */
  async getTenantWithStats(tenantId: string) {
    const result = await this.db
      .select({
        tenant: tenants,
        userCount: count(tenantUsers.userId).as('userCount'),
      })
      .from(tenants)
      .leftJoin(tenantUsers, eq(tenants.id, tenantUsers.tenantId))
      .where(eq(tenants.id, tenantId))
      .groupBy(tenants.id);

    return result[0] || null;
  }

  /**
   * Get user with their tenant memberships
   */
  async getUserWithTenants(userId: string) {
    return await this.db
      .select({
        user: users,
        tenant: tenants,
        role: tenantUsers.role,
        status: tenantUsers.status,
        joinedAt: tenantUsers.joinedAt,
      })
      .from(users)
      .innerJoin(tenantUsers, eq(users.id, tenantUsers.userId))
      .innerJoin(tenants, eq(tenantUsers.tenantId, tenants.id))
      .where(eq(users.id, userId));
  }

  /**
   * Get user permissions within a tenant
   */
  async getUserPermissions(userId: string, tenantId: string) {
    // First get the user's role in the tenant
    const userRole = await this.db
      .select({ role: tenantUsers.role })
      .from(tenantUsers)
      .where(
        and(
          eq(tenantUsers.userId, userId),
          eq(tenantUsers.tenantId, tenantId),
          eq(tenantUsers.isActive, true)
        )
      );

    if (userRole.length === 0) {
      return [];
    }

    // Get role permissions
    const roleRecord = await this.db
      .select({ id: roles.id })
      .from(roles)
      .where(
        and(
          eq(roles.name, userRole[0].role),
          eq(roles.tenantId, tenantId),
          eq(roles.isActive, true)
        )
      );

    if (roleRecord.length === 0) {
      return [];
    }

    // Get permissions for the role
    return await this.db
      .select({
        permission: permissions,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleRecord[0].id));
  }

  /**
   * Check if user has a specific permission
   */
  async hasPermission(userId: string, tenantId: string, permissionName: string): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId, tenantId);
    return userPermissions.some(p => p.permission.name === permissionName);
  }

  /**
   * Create a new tenant with default roles and permissions
   */
  async createTenantWithDefaults(tenantData: {
    name: string;
    subdomain: string;
    description?: string;
    domain?: string;
  }) {
    return await this.db.transaction(async (tx) => {
      // Create tenant
      const [tenant] = await tx.insert(tenants).values(tenantData).returning();

      // Create default roles
      const defaultRoles = [
        {
          tenantId: tenant.id,
          name: 'owner',
          displayName: 'Owner',
          description: 'Full access to all tenant resources',
          isSystemRole: true,
        },
        {
          tenantId: tenant.id,
          name: 'admin',
          displayName: 'Administrator',
          description: 'Administrative access with some restrictions',
          isSystemRole: true,
        },
        {
          tenantId: tenant.id,
          name: 'editor',
          displayName: 'Editor',
          description: 'Can create and edit workflows',
          isSystemRole: true,
        },
        {
          tenantId: tenant.id,
          name: 'viewer',
          displayName: 'Viewer',
          description: 'Read-only access to workflows',
          isSystemRole: true,
        },
        {
          tenantId: tenant.id,
          name: 'member',
          displayName: 'Member',
          description: 'Basic access to assigned workflows',
          isSystemRole: true,
        },
      ];

      await tx.insert(roles).values(defaultRoles);

      return tenant;
    });
  }

  /**
   * Add user to tenant with role
   */
  async addUserToTenant(userId: string, tenantId: string, role: string = 'member', invitedBy?: string) {
    return await this.db.insert(tenantUsers).values({
      userId,
      tenantId,
      role,
      status: 'active',
      invitedBy,
      joinedAt: new Date(),
    }).returning();
  }

  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(userId: string) {
    return await this.db
      .update(users)
      .set({ 
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
  }

  /**
   * Get active workflows for a tenant
   */
  async getActiveWorkflows(tenantId: string, limit: number = 50) {
    return await this.db.query.workflows.findMany({
      where: and(
        eq(tenants.id, tenantId),
        eq(workflows.isActive, true)
      ),
      orderBy: [desc(workflows.createdAt)],
      limit,
      with: {
        createdByUser: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Health check - verify database connectivity
   */
  async healthCheck() {
    try {
      await this.db.select({ count: sql<number>`1` }).limit(1);
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }
}