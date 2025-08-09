import { db } from '@/db/client';
import { users, tenants } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function syncUserWithDatabase(auth0User: any, metadata?: any) {
  try {
    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, auth0User.email))
      .limit(1);

    if (existingUser.length > 0) {
      return existingUser[0];
    }

    // Get default tenant or create one
    const existingTenants = await db.select()
      .from(tenants)
      .limit(1);

    let tenantId = existingTenants[0]?.id;

    if (!tenantId) {
      const [newTenant] = await db.insert(tenants).values({
        id: 'default-tenant',
        name: 'Default Organization',
        domain: 'default.com',
        settings: {},
        subscription: 'free',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      tenantId = newTenant.id;
    }

    // Create new user
    const [newUser] = await db.insert(users).values({
      id: auth0User.sub || `auth0|${Date.now()}`,
      tenantId,
      email: auth0User.email,
      name: auth0User.name || auth0User.email,
      passwordHash: '',
      role: 'user',
      department: 'General',
      status: 'active',
      settings: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    return newUser;
  } catch (error) {
    console.error('Error syncing user:', error);
    return null;
  }
}

export async function getUserTenantContext(userId: string) {
  try {
    const user = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    const tenant = await db.select()
      .from(tenants)
      .where(eq(tenants.id, user[0].tenantId))
      .limit(1);

    return {
      user: user[0],
      tenant: tenant[0]
    };
  } catch (error) {
    console.error('Error getting user context:', error);
    return null;
  }
}