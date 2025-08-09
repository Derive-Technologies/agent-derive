import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const switchTenantSchema = z.object({
  tenantId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId } = switchTenantSchema.parse(body);

    // Mock tenant switch for development
    // In production, validate tenant access here
    
    // Set tenant cookie
    const response = NextResponse.json({ 
      success: true, 
      tenant: {
        id: tenantId,
        name: 'Acme Corporation'
      }
    });
    
    response.cookies.set('active-tenant', tenantId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error switching tenant:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}