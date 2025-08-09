import { UserProvider as Auth0UserProvider } from '@auth0/nextjs-auth0/client';
import { env } from '@/env.mjs';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Auth0UserProvider
      profileUrl="/api/auth/me"
      loginUrl="/api/auth/login"
      user={undefined}
    >
      {children}
    </Auth0UserProvider>
  );
};

export const authConfig = {
  domain: env.AUTH0_ISSUER_BASE_URL?.replace('https://', '') || '',
  clientId: env.AUTH0_CLIENT_ID || '',
  clientSecret: env.AUTH0_CLIENT_SECRET || '',
  baseURL: env.AUTH0_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
  secret: env.AUTH0_SECRET || 'fallback-secret-for-dev',
  issuerBaseURL: env.AUTH0_ISSUER_BASE_URL || '',
  routes: {
    callback: '/api/auth/callback',
    postLogoutRedirect: '/',
  },
  session: {
    rolling: true,
    rollingDuration: 24 * 60 * 60, // 24 hours
    absoluteDuration: 7 * 24 * 60 * 60, // 7 days
  },
  authorizationParams: {
    response_type: 'code',
    audience: env.AUTH0_AUDIENCE,
    scope: 'openid profile email',
  },
};