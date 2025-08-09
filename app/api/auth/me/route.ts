import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock user session for development
    // Replace with actual Auth0 session when configured
    const mockUser = {
      id: 'test-user-admin',
      email: 'admin@acme.com',
      name: 'John Admin',
      picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      role: 'admin',
      tenantId: 'test-tenant-001',
      tenantName: 'Acme Corporation'
    };

    return NextResponse.json({
      user: mockUser,
      tenant: {
        id: 'test-tenant-001',
        name: 'Acme Corporation',
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}