# Database Setup Instructions

## Quick Start with Neon Database

This project uses Neon (PostgreSQL) for the database. Follow these steps to set up your development database:

### 1. Create a Free Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account (GitHub auth is available)
3. You'll get a free tier with:
   - 0.5 GB storage
   - Always-available database
   - Unlimited compute time

### 2. Create a New Database

1. Once logged in, click "Create Database"
2. Choose your settings:
   - **Database name**: `agent_derive` (or any name you prefer)
   - **Region**: Choose the closest to you
   - **Version**: PostgreSQL 16 (latest)
3. Click "Create Database"

### 3. Get Your Connection String

1. After creating the database, you'll see a connection string
2. It will look like this:
   ```
   postgresql://username:password@ep-example-123456.us-east-2.aws.neon.tech/agent_derive?sslmode=require
   ```
3. Copy this entire string

### 4. Configure Your Environment

1. Open `.env.local` in your project
2. Replace the `DATABASE_URL` placeholder with your connection string:
   ```env
   DATABASE_URL="postgresql://username:password@ep-example-123456.us-east-2.aws.neon.tech/agent_derive?sslmode=require"
   ```

### 5. Run Database Migrations

```bash
# Generate migrations from schema
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed the database with test data
pnpm db:seed
```

### 6. Verify Setup

```bash
# Open Drizzle Studio to view your data
pnpm db:studio
```

This will open a web interface at `http://localhost:4983` where you can browse your database tables and data.

## Available Database Commands

- `pnpm db:generate` - Generate migration files from schema changes
- `pnpm db:migrate` - Run pending migrations
- `pnpm db:push` - Push schema directly to database (for development)
- `pnpm db:seed` - Seed database with test data
- `pnpm db:studio` - Open Drizzle Studio GUI

## Test Credentials

After seeding, you can use these test accounts:

- **Admin User**
  - Email: `admin@acme.com`
  - Password: (set in Auth0 or use mock auth)

- **Regular User**
  - Email: `user@acme.com`
  - Password: (set in Auth0 or use mock auth)

## Troubleshooting

### Connection Refused Error
- Make sure you're using the full connection string from Neon
- Ensure `?sslmode=require` is included at the end
- Check that your IP isn't blocked (Neon allows all IPs by default)

### Migration Errors
- Run `pnpm db:push` for development instead of migrations
- This will sync your schema directly without migration files

### Empty Dashboard
- Make sure to run `pnpm db:seed` after setting up the database
- Check the console for any errors during seeding

## Alternative: Local PostgreSQL

If you prefer local PostgreSQL:

1. Install PostgreSQL locally
2. Create a database: `createdb agent_derive`
3. Update `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agent_derive"
   ```
4. Run the same migration and seed commands

## Next Steps

Once your database is set up:

1. Start the development server: `pnpm dev`
2. Navigate to `http://localhost:3002`
3. The dashboard should load with seeded data
4. All routes should work without errors