import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

export interface AuthMiddlewareConfig {
  publicRoutes?: string[];
  protectedRoutes?: string[];
  loginUrl?: string;
  afterLoginUrl?: string;
  tenantRequired?: boolean;
}

const defaultConfig: AuthMiddlewareConfig = {
  publicRoutes: [
    '/',
    '/login',
    '/signup',
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/callback',
    '/api/auth/me',
    '/api/health',
  ],
  protectedRoutes: [
    '/dashboard',
    '/workflows',
    '/executions',
    '/approvals',
    '/settings',
    '/admin',
  ],
  loginUrl: '/api/auth/login',
  afterLoginUrl: '/dashboard',
  tenantRequired: false,
};

/**
 * Check if a route matches any pattern in the given array
 */
const matchesRoutePattern = (pathname: string, patterns: string[]): boolean => {
  return patterns.some((pattern) => {
    // Convert pattern to regex (simple implementation)
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\//g, '\\/');
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  });
};

/**
 * Auth middleware for Next.js
 */
export const authMiddleware = (config: AuthMiddlewareConfig = {}) => {
  const mergedConfig = { ...defaultConfig, ...config };

  return async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    // Check if route is public
    if (matchesRoutePattern(pathname, mergedConfig.publicRoutes || [])) {
      return NextResponse.next();
    }

    // Skip auth for API routes that don't require authentication
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/trpc')) {
      return NextResponse.next();
    }

    try {
      // Get user session
      const session = await getSession(request);
      const user = session?.user;

      // Check if user is authenticated for protected routes
      if (matchesRoutePattern(pathname, mergedConfig.protectedRoutes || [])) {
        if (!user) {
          // Redirect to login
          const loginUrl = new URL(mergedConfig.loginUrl || '/api/auth/login', request.url);
          loginUrl.searchParams.set('returnTo', request.url);
          return NextResponse.redirect(loginUrl);
        }

        // Check tenant requirement
        if (mergedConfig.tenantRequired) {
          const tenantSlug = request.nextUrl.searchParams.get('tenant') || 
                            request.cookies.get('tenant-slug')?.value;
          
          if (!tenantSlug) {
            // Redirect to tenant selection
            const tenantSelectUrl = new URL('/select-tenant', request.url);
            tenantSelectUrl.searchParams.set('returnTo', request.url);
            return NextResponse.redirect(tenantSelectUrl);
          }
        }
      }

      // Add user info to headers for server components
      const requestHeaders = new Headers(request.headers);
      if (user) {
        requestHeaders.set('x-user-id', user.sub || '');
        requestHeaders.set('x-user-email', user.email || '');
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      // If it's a protected route and we have an error, redirect to login
      if (matchesRoutePattern(pathname, mergedConfig.protectedRoutes || [])) {
        const loginUrl = new URL(mergedConfig.loginUrl || '/api/auth/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
      
      return NextResponse.next();
    }
  };
};

/**
 * Tenant isolation middleware
 */
export const tenantMiddleware = () => {
  return async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    // Skip for public routes and auth routes
    if (pathname.startsWith('/api/auth') || pathname === '/') {
      return NextResponse.next();
    }

    try {
      // Extract tenant from subdomain, path, or query parameter
      let tenantSlug: string | null = null;
      
      // Method 1: From subdomain (tenant.domain.com)
      const host = request.headers.get('host');
      if (host && host.includes('.')) {
        const subdomain = host.split('.')[0];
        if (subdomain !== 'www' && subdomain !== 'api') {
          tenantSlug = subdomain;
        }
      }
      
      // Method 2: From path (/t/tenant-slug/...)
      const pathMatch = pathname.match(/^\/t\/([^\/]+)/);
      if (pathMatch) {
        tenantSlug = pathMatch[1];
      }
      
      // Method 3: From query parameter or cookie
      if (!tenantSlug) {
        tenantSlug = request.nextUrl.searchParams.get('tenant') || 
                    request.cookies.get('tenant-slug')?.value || null;
      }

      // Add tenant info to headers
      const requestHeaders = new Headers(request.headers);
      if (tenantSlug) {
        requestHeaders.set('x-tenant-slug', tenantSlug);
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Tenant middleware error:', error);
      return NextResponse.next();
    }
  };
};

/**
 * Rate limiting middleware (placeholder - implement with Redis/memory store)
 */
export const rateLimitMiddleware = (
  maxRequests: number = 100,
  windowMs: number = 60 * 1000, // 1 minute
) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return async (request: NextRequest) => {
    const ip = request.ip || 'anonymous';
    const now = Date.now();
    
    // Clean up expired entries
    for (const [key, value] of requests.entries()) {
      if (now > value.resetTime) {
        requests.delete(key);
      }
    }

    // Get or create entry for this IP
    const entry = requests.get(ip) || { count: 0, resetTime: now + windowMs };
    
    if (now > entry.resetTime) {
      // Reset the counter
      entry.count = 0;
      entry.resetTime = now + windowMs;
    }

    entry.count++;
    requests.set(ip, entry);

    // Check rate limit
    if (entry.count > maxRequests) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
          },
        }
      );
    }

    return NextResponse.next();
  };
};