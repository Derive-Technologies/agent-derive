import { NextRequest, NextResponse } from 'next/server';

// Mock Auth0 handler for development
// This will be replaced with actual Auth0 handlers when properly configured
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Extract the auth route from the pathname
  const authRoute = pathname.replace('/api/auth/', '');

  // Handle different Auth0 routes
  switch (authRoute) {
    case 'login':
      // For now, redirect to Auth0 Universal Login
      const loginUrl = new URL(`https://${process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '')}/authorize`);
      loginUrl.searchParams.set('response_type', 'code');
      loginUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID || '');
      loginUrl.searchParams.set('redirect_uri', `${process.env.AUTH0_BASE_URL}/api/auth/callback`);
      loginUrl.searchParams.set('scope', 'openid profile email');
      loginUrl.searchParams.set('audience', process.env.AUTH0_AUDIENCE || '');
      
      return NextResponse.redirect(loginUrl.toString());
    
    case 'logout':
      // Clear cookies and redirect to Auth0 logout
      const logoutUrl = new URL(`https://${process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '')}/v2/logout`);
      logoutUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID || '');
      logoutUrl.searchParams.set('returnTo', process.env.AUTH0_BASE_URL || '');
      
      const response = NextResponse.redirect(logoutUrl.toString());
      response.cookies.delete('appSession');
      return response;
    
    case 'callback':
      // For now, just redirect to dashboard after callback
      // In production, this would handle the OAuth callback
      return NextResponse.redirect(new URL('/dashboard', request.url));
    
    case 'me':
      // Return mock user data for development
      return NextResponse.json({
        user: {
          email: 'user@example.com',
          name: 'Test User',
          picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestUser',
          sub: 'auth0|test-user-id'
        }
      });
    
    default:
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}