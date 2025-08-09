# Database Schema

This directory contains the complete database schema for the AI-Native Workflow Orchestration Platform using Drizzle ORM.

## Overview

The database schema supports a multi-tenant architecture with comprehensive workflow orchestration, AI agent integration, approval workflows, and detailed audit logging.

## Schema Structure

### Core Tables

- **`tenants`** - Multi-tenant isolation and configuration
- **`users`** - User accounts and profiles
- **`tenant_users`** - Many-to-many relationship between tenants and users
- **`roles`** - Role-based access control per tenant
- **`permissions`** - System-wide permissions
- **`role_permissions`** - Permission assignments to roles

### Workflow Tables

- **`workflows`** - Workflow definitions with visual builder support
- **`workflow_executions`** - Execution instances with state tracking
- **`approval_requests`** - Human approval steps in workflows
- **`ai_agent_tasks`** - AI agent task execution and monitoring

### System Tables

- **`audit_logs`** - Comprehensive audit trail for all operations

## Key Features

### Multi-Tenancy
- Complete tenant isolation with per-tenant roles and permissions
- Flexible tenant settings and subscription management
- Cross-tenant user management with role-based access

### Workflow Engine
- Visual workflow definitions stored as JSONB
- Support for various node types: tasks, approvals, AI agents, conditions
- Flexible trigger system: manual, scheduled, webhook, event-based
- Comprehensive execution state tracking

### AI Integration
- Native AI agent task support
- Cost tracking and usage monitoring
- Multiple AI provider support
- Configurable retry policies and timeouts

### Approval System
- Multi-step approval workflows
- Various approval types: single, multiple, unanimous, majority
- Form-based approval with custom fields
- Escalation rules and timeout handling

### Security & Compliance
- Comprehensive audit logging
- Role-based permissions with fine-grained control
- IP address and user agent tracking
- Correlation IDs for tracing related operations

## Database Scripts

### Available Commands

```bash
# Generate migration files
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Push schema changes directly (development)
pnpm db:push

# Open Drizzle Studio for database inspection
pnpm db:studio

# Check migration status
pnpm db:check

# Seed database with system permissions
pnpm db:seed
```

### Setup Process

1. **Environment Setup**
   ```bash
   # Set your database URL in .env.local
   DATABASE_URL="postgresql://user:password@host:port/database"
   ```

2. **Generate and Apply Migrations**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

3. **Seed Initial Data**
   ```bash
   pnpm db:seed
   ```

4. **Open Database Studio**
   ```bash
   pnpm db:studio
   ```

## Schema Files

- `schema/tenants.ts` - Tenant management
- `schema/users.ts` - User accounts
- `schema/tenant-users.ts` - Tenant-user relationships
- `schema/roles.ts` - Role definitions
- `schema/permissions.ts` - System permissions
- `schema/role-permissions.ts` - Role-permission mappings
- `schema/workflows.ts` - Workflow definitions
- `schema/workflow-executions.ts` - Execution tracking
- `schema/approval-requests.ts` - Approval workflows
- `schema/ai-agent-tasks.ts` - AI task management
- `schema/audit-logs.ts` - System audit trail
- `schema/index.ts` - Schema exports and relations

## Utility Files

- `client.ts` - Database connection and client setup
- `utils.ts` - Common database operations and utilities
- `types.ts` - TypeScript type definitions
- `seed.ts` - Database seeding with system permissions

## Indexing Strategy

The schema includes comprehensive indexing for optimal performance:

- **Primary keys** - All tables use UUIDs as primary keys
- **Foreign keys** - Proper referential integrity with cascade deletes where appropriate
- **Search indexes** - Common query patterns are indexed (tenant_id, user_id, status, etc.)
- **Composite indexes** - Multi-column indexes for complex queries
- **JSONB indexes** - GIN indexes on JSONB fields for efficient querying

## Data Types

### JSONB Fields
- Flexible schema-less data storage for configuration and metadata
- Efficient querying with PostgreSQL JSONB operators
- Strongly typed with TypeScript interfaces

### UUID Primary Keys
- Distributed system friendly
- No sequential enumeration attacks
- Better performance in distributed scenarios

### Timestamp Tracking
- All tables include `created_at` and `updated_at`
- Timezone-aware timestamps
- Automatic timestamp management

## Security Considerations

### Row Level Security
- Consider implementing RLS policies for multi-tenant isolation
- Tenant-based data access restrictions
- User-based permission filtering

### Audit Trail
- Comprehensive logging of all operations
- IP address and user agent tracking
- Correlation IDs for request tracing
- Sensitive data handling in logs

### Data Encryption
- Consider column-level encryption for sensitive data
- Encrypted communication with database
- Secure credential storage

## Performance Considerations

### Query Optimization
- Proper indexing strategy implemented
- JSONB field access patterns optimized
- Foreign key relationships for efficient joins

### Connection Management
- Connection pooling configured
- Proper connection limits
- Health check endpoints

### Monitoring
- Query performance tracking
- Slow query identification
- Database metrics collection

## Migration Strategy

### Schema Changes
- All changes through migration files
- Backward compatibility considerations
- Data migration scripts when needed

### Rollback Strategy
- Migration rollback procedures
- Data backup before migrations
- Testing on staging environments

## Testing

### Database Testing
- Unit tests for database utilities
- Integration tests for complex queries
- Performance testing for critical paths

### Data Integrity
- Foreign key constraint testing
- Validation rule testing
- Concurrent access testing

## Monitoring and Maintenance

### Health Checks
- Database connectivity monitoring
- Query performance monitoring
- Storage utilization tracking

### Backup Strategy
- Regular automated backups
- Point-in-time recovery capability
- Cross-region backup replication

### Maintenance Tasks
- Regular VACUUM and ANALYZE
- Index maintenance and optimization
- Statistics updates for query planner