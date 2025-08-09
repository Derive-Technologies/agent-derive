import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const authRouter = router({
  /**
   * Get current user session
   */
  getSession: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      return null;
    }

    return {
      user: ctx.session.user,
      tenant: ctx.tenant,
      isAuthenticated: true,
    };
  }),

  /**
   * Get user profile
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session.user;
  }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        phoneNumber: z.string().optional(),
        title: z.string().optional(),
        department: z.string().optional(),
        preferences: z
          .object({
            theme: z.enum(['light', 'dark', 'system']).optional(),
            language: z.string().optional(),
            timezone: z.string().optional(),
            notifications: z
              .object({
                email: z.boolean().optional(),
                push: z.boolean().optional(),
                workflowUpdates: z.boolean().optional(),
                approvalRequests: z.boolean().optional(),
              })
              .optional(),
            dashboard: z
              .object({
                layout: z.string().optional(),
                widgets: z.array(z.string()).optional(),
              })
              .optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db
        .update(users)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.session.user.id))
        .returning()
        .then((result) => result[0]);

      return updatedUser;
    }),

  /**
   * Get user's tenants
   */
  getTenants: protectedProcedure.query(async ({ ctx }) => {
    // This would query tenant-users relationship
    // For now, return mock data based on current tenant
    if (ctx.tenant) {
      return [
        {
          id: ctx.tenant.tenantId,
          slug: ctx.tenant.tenantSlug,
          name: ctx.tenant.tenantName,
          role: ctx.tenant.userRole,
          isActive: true,
        },
      ];
    }
    
    return [];
  }),

  /**
   * Switch active tenant
   */
  switchTenant: protectedProcedure
    .input(
      z.object({
        tenantId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantContext = await getUserTenantContext(ctx.session.user.id);
      
      if (!tenantContext || tenantContext.tenantId !== input.tenantId) {
        throw new Error('Access denied to tenant');
      }

      return {
        success: true,
        tenant: tenantContext,
      };
    }),

  /**
   * Logout (placeholder - actual logout handled by Auth0)
   */
  logout: protectedProcedure.mutation(async () => {
    return {
      success: true,
      redirectUrl: '/api/auth/logout',
    };
  }),
});