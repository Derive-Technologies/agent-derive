import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from './client';
import { workflows, users, tenants, tenantUsers } from './schema';
import { eq } from 'drizzle-orm';

const sampleWorkflows = [
  {
    name: 'Purchase Approval Workflow',
    description: 'Automated purchase request approval process with multi-level authorization',
    category: 'Finance',
    status: 'active',
    tags: ['finance', 'approval', 'automated'],
    definition: {
      nodes: [
        {
          id: 'start-1',
          type: 'start' as const,
          position: { x: 100, y: 100 },
          data: {
            label: 'Purchase Request',
            config: { triggerType: 'manual' }
          }
        },
        {
          id: 'approval-1',
          type: 'approval' as const,
          position: { x: 300, y: 100 },
          data: {
            label: 'Manager Approval',
            config: {
              approvalType: 'single',
              approvers: ['manager'],
              timeout: 24
            }
          }
        },
        {
          id: 'condition-1',
          type: 'condition' as const,
          position: { x: 500, y: 100 },
          data: {
            label: 'Check Amount',
            config: {
              condition: 'amount > 5000'
            }
          }
        },
        {
          id: 'approval-2',
          type: 'approval' as const,
          position: { x: 700, y: 50 },
          data: {
            label: 'Director Approval',
            config: {
              approvalType: 'single',
              approvers: ['director'],
              timeout: 48
            }
          }
        },
        {
          id: 'task-1',
          type: 'task' as const,
          position: { x: 700, y: 150 },
          data: {
            label: 'Process Purchase',
            config: {
              taskType: 'automated'
            }
          }
        },
        {
          id: 'end-1',
          type: 'end' as const,
          position: { x: 900, y: 100 },
          data: {
            label: 'Complete',
            config: { notifyOnCompletion: true }
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'start-1', target: 'approval-1' },
        { id: 'e2', source: 'approval-1', target: 'condition-1' },
        { id: 'e3', source: 'condition-1', target: 'approval-2', conditions: { result: 'true' } },
        { id: 'e4', source: 'condition-1', target: 'task-1', conditions: { result: 'false' } },
        { id: 'e5', source: 'approval-2', target: 'end-1' },
        { id: 'e6', source: 'task-1', target: 'end-1' }
      ],
      variables: {
        amount: { type: 'number' as const, required: true, description: 'Purchase amount' },
        description: { type: 'string' as const, required: true, description: 'Purchase description' },
        vendor: { type: 'string' as const, required: true, description: 'Vendor name' }
      }
    },
    triggers: {
      manual: true,
      webhook: {
        enabled: true,
        url: '/api/workflows/purchase-approval/trigger'
      }
    },
    settings: {
      timeout: 72,
      retryPolicy: {
        maxRetries: 3,
        retryDelay: 60,
        backoffMultiplier: 2
      },
      notifications: {
        onSuccess: ['requester', 'finance-team'],
        onFailure: ['requester', 'admin'],
        onApproval: ['requester']
      }
    }
  },
  {
    name: 'Employee Onboarding',
    description: 'Comprehensive onboarding process for new employees',
    category: 'HR',
    status: 'active',
    tags: ['hr', 'onboarding', 'automated'],
    definition: {
      nodes: [
        {
          id: 'start-1',
          type: 'start' as const,
          position: { x: 100, y: 100 },
          data: {
            label: 'New Hire',
            config: { triggerType: 'manual' }
          }
        },
        {
          id: 'task-1',
          type: 'task' as const,
          position: { x: 300, y: 100 },
          data: {
            label: 'Create Accounts',
            config: { taskType: 'automated' }
          }
        },
        {
          id: 'ai-1',
          type: 'ai_agent' as const,
          position: { x: 500, y: 100 },
          data: {
            label: 'Generate Welcome Email',
            config: {
              model: 'gpt-4',
              taskType: 'text_generation'
            }
          }
        },
        {
          id: 'end-1',
          type: 'end' as const,
          position: { x: 700, y: 100 },
          data: {
            label: 'Onboarding Complete',
            config: {}
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'start-1', target: 'task-1' },
        { id: 'e2', source: 'task-1', target: 'ai-1' },
        { id: 'e3', source: 'ai-1', target: 'end-1' }
      ],
      variables: {
        employeeName: { type: 'string' as const, required: true },
        department: { type: 'string' as const, required: true },
        startDate: { type: 'string' as const, required: true }
      }
    },
    triggers: {
      manual: true
    },
    settings: {
      timeout: 120
    }
  },
  {
    name: 'Contract Review Process',
    description: 'Legal and business review workflow for contracts',
    category: 'Legal',
    status: 'draft',
    tags: ['legal', 'contracts', 'review'],
    definition: {
      nodes: [
        {
          id: 'start-1',
          type: 'start' as const,
          position: { x: 100, y: 100 },
          data: {
            label: 'Contract Submission',
            config: {}
          }
        },
        {
          id: 'end-1',
          type: 'end' as const,
          position: { x: 500, y: 100 },
          data: {
            label: 'Review Complete',
            config: {}
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'start-1', target: 'end-1' }
      ],
      variables: {}
    },
    triggers: {
      manual: true
    },
    settings: {}
  },
  {
    name: 'Expense Report Approval',
    description: 'Automated expense report submission and approval',
    category: 'Finance',
    status: 'active',
    tags: ['finance', 'expense', 'approval'],
    definition: {
      nodes: [],
      edges: [],
      variables: {}
    },
    triggers: {
      manual: true
    },
    settings: {}
  },
  {
    name: 'Customer Support Ticket',
    description: 'Automated customer support ticket routing and resolution',
    category: 'Support',
    status: 'active',
    tags: ['support', 'customer', 'automated'],
    definition: {
      nodes: [],
      edges: [],
      variables: {}
    },
    triggers: {
      manual: true,
      webhook: {
        enabled: true,
        url: '/api/workflows/support-ticket/trigger'
      }
    },
    settings: {}
  }
];

export async function seedWorkflows() {
  try {
    console.log('🌱 Seeding workflows...');

    // Get or create a default tenant
    let defaultTenant = await db.select().from(tenants).where(eq(tenants.name, 'Default Organization')).limit(1);
    
    if (defaultTenant.length === 0) {
      const [newTenant] = await db.insert(tenants).values({
        name: 'Default Organization',
        subdomain: 'default-org',
        settings: {},
      }).returning();
      defaultTenant = [newTenant];
      console.log('✅ Created default tenant');
    }

    const tenantId = defaultTenant[0].id;

    // Get or create a default user
    let defaultUser = await db.select().from(users).where(eq(users.email, 'admin@example.com')).limit(1);
    
    if (defaultUser.length === 0) {
      const [newUser] = await db.insert(users).values({
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        authProvider: 'auth0',
        authId: 'auth0|admin',
        preferences: {}
      }).returning();
      defaultUser = [newUser];
      console.log('✅ Created default user');

      // Add user to tenant
      await db.insert(tenantUsers).values({
        tenantId,
        userId: newUser.id,
        role: 'admin',
        isActive: true
      });
      console.log('✅ Added user to tenant');
    }

    const userId = defaultUser[0].id;

    // Check if workflows already exist
    const existingWorkflows = await db.select().from(workflows).where(eq(workflows.tenantId, tenantId));
    
    if (existingWorkflows.length > 0) {
      console.log('ℹ️  Workflows already exist, skipping seed');
      return;
    }

    // Insert sample workflows
    for (const workflow of sampleWorkflows) {
      await db.insert(workflows).values({
        tenantId,
        name: workflow.name,
        description: workflow.description,
        category: workflow.category,
        status: workflow.status,
        tags: workflow.tags,
        definition: workflow.definition,
        triggers: workflow.triggers,
        settings: workflow.settings,
        isActive: workflow.status === 'active',
        createdBy: userId,
        updatedBy: userId,
        publishedAt: workflow.status === 'active' ? new Date() : null
      });
      console.log(`✅ Created workflow: ${workflow.name}`);
    }

    console.log('✅ Workflow seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding workflows:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedWorkflows()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}