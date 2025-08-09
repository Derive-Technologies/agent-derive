import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { db } from '@/db/client';

/**
 * Context for tRPC procedures
 */
export interface Context {
  session: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      tenantId: string;
    };
  } | null;
  tenant: {
    id: string;
    name: string;
  } | null;
  db: typeof db;
  req: CreateNextContextOptions['req'];
  res: CreateNextContextOptions['res'];
}

/**
 * Create context for tRPC procedures
 */
export const createTRPCContext = async (opts: CreateNextContextOptions): Promise<Context> => {
  const { req, res } = opts;
  
  // Mock session for development
  // Replace with actual Auth0 session when configured
  const mockSession = {
    user: {
      id: 'test-user-admin',
      email: 'admin@acme.com',
      name: 'John Admin',
      role: 'admin',
      tenantId: 'test-tenant-001'
    }
  };

  const mockTenant = {
    id: 'test-tenant-001',
    name: 'Acme Corporation'
  };

  return {
    session: mockSession,
    tenant: mockTenant,
    db,
    req,
    res,
  };
};

/**
 * Type for inferring context
 */
export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;