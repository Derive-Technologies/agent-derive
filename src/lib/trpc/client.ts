'use client';

import { createTRPCReact } from '@trpc/react-query';
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client';
import { createTRPCClient } from '@trpc/client';
import superjson from 'superjson';

import type { AppRouter } from '@/src/server';

/**
 * React Query hooks for tRPC
 */
export const api = createTRPCReact<AppRouter>();

/**
 * Get the base URL for the tRPC API
 */
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/**
 * Create tRPC client configuration
 */
export const createTRPCClientConfig = () => ({
  transformer: superjson,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === 'development' ||
        (op.direction === 'down' && op.result instanceof Error),
    }),
    unstable_httpBatchStreamLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers: () => {
        const headers = new Headers();
        headers.set('x-trpc-source', 'react');
        
        // Add tenant context from localStorage if available
        if (typeof window !== 'undefined') {
          const tenantSlug = localStorage.getItem('tenant-slug');
          if (tenantSlug) {
            headers.set('x-tenant-slug', tenantSlug);
          }
        }
        
        return Object.fromEntries(headers.entries());
      },
    }),
  ],
});

/**
 * Vanilla tRPC client (for use outside of React)
 */
export const vanillaApi = createTRPCClient<AppRouter>(createTRPCClientConfig());