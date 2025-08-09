import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { workflows, users, tenants } from '@/db/schema';
import { eq, and, desc, asc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // For now, we'll use a default tenant ID
    // In production, this would come from the authenticated user's session
    const defaultTenant = await db.select().from(tenants)
      .where(eq(tenants.subdomain, 'default-org'))
      .limit(1);

    if (!defaultTenant.length) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const tenantId = defaultTenant[0].id;

    // Fetch workflows for the tenant
    const workflowList = await db
      .select({
        id: workflows.id,
        name: workflows.name,
        description: workflows.description,
        category: workflows.category,
        status: workflows.status,
        tags: workflows.tags,
        createdAt: workflows.createdAt,
        updatedAt: workflows.updatedAt,
        createdBy: users.email,
        definition: workflows.definition,
        triggers: workflows.triggers,
        settings: workflows.settings
      })
      .from(workflows)
      .leftJoin(users, eq(workflows.createdBy, users.id))
      .where(eq(workflows.tenantId, tenantId))
      .orderBy(desc(workflows.createdAt));

    // Transform the data to match the expected format
    const formattedWorkflows = workflowList.map(w => ({
      id: w.id,
      name: w.name,
      description: w.description || '',
      status: w.status as 'active' | 'draft' | 'paused' | 'archived',
      category: w.category || 'Uncategorized',
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
      createdBy: w.createdBy || 'Unknown',
      executionCount: Math.floor(Math.random() * 100), // Mock data for now
      successRate: Math.floor(Math.random() * 100), // Mock data for now
      avgExecutionTime: `${Math.floor(Math.random() * 60)}m`, // Mock data for now
      tags: w.tags as string[] || [],
      definition: w.definition,
      triggers: w.triggers,
      settings: w.settings
    }));

    return NextResponse.json(formattedWorkflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get default tenant
    const defaultTenant = await db.select().from(tenants)
      .where(eq(tenants.subdomain, 'default-org'))
      .limit(1);

    if (!defaultTenant.length) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Get default user (in production, this would come from session)
    const defaultUser = await db.select().from(users)
      .where(eq(users.email, 'admin@example.com'))
      .limit(1);

    if (!defaultUser.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const tenantId = defaultTenant[0].id;
    const userId = defaultUser[0].id;

    // Create new workflow
    const [newWorkflow] = await db.insert(workflows).values({
      tenantId,
      name: body.name,
      description: body.description,
      category: body.category || 'Custom',
      status: body.status || 'draft',
      tags: body.tags || [],
      definition: body.definition || { nodes: [], edges: [], variables: {} },
      triggers: body.triggers || { manual: true },
      settings: body.settings || {},
      isActive: body.status === 'active',
      createdBy: userId,
      updatedBy: userId,
      publishedAt: body.status === 'active' ? new Date() : null
    }).returning();

    return NextResponse.json(newWorkflow, { status: 201 });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}