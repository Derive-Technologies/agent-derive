import { TRPCError, initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import superjson from 'superjson';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Base router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure that requires authentication
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Tenant-protected procedure that requires tenant access
 */
export const tenantProtectedProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.tenant) {
    throw new TRPCError({ 
      code: 'FORBIDDEN',
      message: 'Tenant access required'
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      tenant: ctx.tenant,
    },
  });
});

/**
 * Permission-based procedure factory
 */
export const createPermissionProcedure = (requiredPermission: string) => {
  return tenantProtectedProcedure.use(({ ctx, next }) => {
    if (!ctx.tenant?.permissions.includes(requiredPermission)) {
      throw new TRPCError({ 
        code: 'FORBIDDEN',
        message: `Missing required permission: ${requiredPermission}`
      });
    }
    
    return next({ ctx });
  });
};

/**
 * Admin procedure - requires admin permissions
 */
export const adminProcedure = createPermissionProcedure('tenant:write');

/**
 * Owner procedure - requires owner permissions
 */
export const ownerProcedure = createPermissionProcedure('tenant:delete');