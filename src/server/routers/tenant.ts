import { z } from 'zod';
import { router, protectedProcedure, tenantProtectedProcedure, adminProcedure, ownerProcedure } from '../trpc';
import { tenants, tenantUsers, users } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const tenantRouter = router({
  /**
   * Get current tenant info
   */
  getCurrent: tenantProtectedProcedure.query(async ({ ctx }) => {
    const tenant = await ctx.db
      .select()
      .from(tenants)
      .where(eq(tenants.id, ctx.tenant.tenantId))
      .limit(1)
      .then(result => result[0]);

    if (!tenant) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Tenant not found',
      });
    }

    return tenant;
  }),

  /**
   * Update tenant information
   */
  update: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        settings: z.record(z.any()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedTenant = await ctx.db
        .update(tenants)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(tenants.id, ctx.tenant.tenantId))
        .returning()
        .then(result => result[0]);

      return updatedTenant;
    }),

  /**
   * Get tenant users
   */
  getUsers: tenantProtectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
        status: z.enum(['active', 'invited', 'suspended']).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          avatar: users.avatar,
          role: tenantUsers.role,
          status: tenantUsers.status,
          joinedAt: tenantUsers.joinedAt,
        })
        .from(tenantUsers)
        .innerJoin(users, eq(tenantUsers.userId, users.id))
        .where(eq(tenantUsers.tenantId, ctx.tenant.tenantId))
        .orderBy(desc(tenantUsers.joinedAt))
        .limit(input.limit)
        .offset(input.offset);

      if (input.status) {
        query = query.where(
          and(
            eq(tenantUsers.tenantId, ctx.tenant.tenantId),
            eq(tenantUsers.status, input.status)
          )
        );
      }

      const results = await query;
      return results;
    }),

  /**
   * Invite user to tenant
   */
  inviteUser: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.enum(['owner', 'admin', 'editor', 'viewer']).default('viewer'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already exists
      let user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1)
        .then(result => result[0]);

      // Create user if doesn't exist
      if (!user) {
        const [newUser] = await ctx.db
          .insert(users)
          .values({
            email: input.email,
            firstName: input.email.split('@')[0],
            lastName: '',
            authProvider: 'email',
            authId: `email:${input.email}`,
            emailVerified: false,
            isActive: false, // Will be activated when they accept invitation
          })
          .returning();
        user = newUser;
      }

      // Check if user is already in tenant
      const existingTenantUser = await ctx.db
        .select()
        .from(tenantUsers)
        .where(
          and(
            eq(tenantUsers.tenantId, ctx.tenant.tenantId),
            eq(tenantUsers.userId, user.id)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (existingTenantUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User is already a member of this tenant',
        });
      }

      // Create tenant user relationship
      const [tenantUser] = await ctx.db
        .insert(tenantUsers)
        .values({
          tenantId: ctx.tenant.tenantId,
          userId: user.id,
          role: input.role,
          status: 'invited',
          invitedBy: ctx.session.user.id,
        })
        .returning();

      // TODO: Send invitation email

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: input.role,
          status: 'invited',
        },
      };
    }),

  /**
   * Update user role in tenant
   */
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        role: z.enum(['owner', 'admin', 'editor', 'viewer']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Cannot change your own role
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot change your own role',
        });
      }

      const updatedTenantUser = await ctx.db
        .update(tenantUsers)
        .set({
          role: input.role,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(tenantUsers.tenantId, ctx.tenant.tenantId),
            eq(tenantUsers.userId, input.userId)
          )
        )
        .returning()
        .then(result => result[0]);

      if (!updatedTenantUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found in tenant',
        });
      }

      return updatedTenantUser;
    }),

  /**
   * Remove user from tenant
   */
  removeUser: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Cannot remove yourself
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot remove yourself from tenant',
        });
      }

      const deletedTenantUser = await ctx.db
        .delete(tenantUsers)
        .where(
          and(
            eq(tenantUsers.tenantId, ctx.tenant.tenantId),
            eq(tenantUsers.userId, input.userId)
          )
        )
        .returning()
        .then(result => result[0]);

      if (!deletedTenantUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found in tenant',
        });
      }

      return { success: true };
    }),

  /**
   * Delete tenant (owner only)
   */
  delete: ownerProcedure.mutation(async ({ ctx }) => {
    // This would typically involve cascading deletes
    // For now, just soft delete or mark as inactive
    const deletedTenant = await ctx.db
      .update(tenants)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, ctx.tenant.tenantId))
      .returning()
      .then(result => result[0]);

    return { success: true, tenant: deletedTenant };
  }),
});