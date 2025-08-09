# Agent Derive Platform - Setup Guide

## Prerequisites

### System Requirements
- **Node.js**: v20.0.0 or later
- **pnpm**: v10.0.0 (managed via Corepack)
- **PostgreSQL**: v15 or later
- **Redis**: v7 or later (optional, for caching)
- **Git**: Latest version

### Development Tools (Recommended)
- **VS Code** with extensions:
  - TypeScript
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Prisma/Drizzle extensions
- **Docker Desktop** (for containerized development)
- **Postman** or **Thunder Client** (for API testing)

## Initial Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/agent-derive.git
cd agent-derive
```

### 2. Enable Corepack and Install Dependencies
```bash
# Enable Node.js Corepack for pnpm management
corepack enable

# Install dependencies using pnpm
pnpm install
```

### 3. Environment Configuration

#### Create Environment Files
```bash
# Copy the example environment file
cp .env.example .env.local

# Create additional environment files if needed
cp .env.example .env.development
cp .env.example .env.production
```

#### Configure Environment Variables

**Core Configuration (Required)**
```bash
# Application Configuration
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-jwt-key-here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/agent_derive_dev
NEON_DATABASE_URL=your-neon-connection-string  # If using Neon
```

**Auth0 Configuration (Required)**
```bash
# Auth0 Settings - Get these from your Auth0 Dashboard
AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_AUDIENCE=https://your-api-identifier
```

**AI Service Configuration (Required for AI features)**
```bash
# AI API Keys
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
HUGGINGFACE_API_KEY=hf_your-huggingface-token
```

**Inngest Configuration (Required for workflows)**
```bash
# Inngest Event Processing
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=signkey_your-signing-key
INNGEST_SERVE_HOST=http://localhost:3000
INNGEST_SERVE_PATH=/api/inngest
```

**Optional Services**
```bash
# Redis Configuration (Optional - for caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@yourapp.com

# AWS S3 Configuration (Optional - for file storage)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name

# External API Integration (Optional)
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
DISCORD_BOT_TOKEN=your-discord-bot-token
GITHUB_TOKEN=ghp_your-github-token
NOTION_API_KEY=secret_your-notion-integration-key

# Monitoring & Analytics (Optional)
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id

# Feature Flags (Optional)
ENABLE_ANALYTICS=true
ENABLE_MONITORING=true
ENABLE_EXPERIMENTAL_FEATURES=false

# Development & Debug (Optional)
DEBUG=false
LOG_LEVEL=info
```

## Database Setup

### 1. PostgreSQL Installation

#### Option A: Using Docker (Recommended for development)
```bash
# Create and start PostgreSQL container
docker run --name agent-derive-postgres \
  -e POSTGRES_DB=agent_derive_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Verify connection
docker exec -it agent-derive-postgres psql -U postgres -d agent_derive_dev
```

#### Option B: Local Installation
```bash
# macOS (using Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql-15 postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE agent_derive_dev;
CREATE USER agent_derive WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE agent_derive_dev TO agent_derive;
\q
```

#### Option C: Using Neon (Cloud PostgreSQL)
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string
4. Set `NEON_DATABASE_URL` in your environment file

### 2. Database Schema Setup
```bash
# Generate database migration files
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Alternatively, push schema directly (for development)
pnpm db:push

# Seed the database with initial data
pnpm db:seed
```

### 3. Verify Database Setup
```bash
# Open Drizzle Studio to inspect your database
pnpm db:studio

# This will open http://localhost:4983 with a database browser
```

## Auth0 Setup

### 1. Create Auth0 Application
1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new **Single Page Application**
3. Configure the following settings:

#### Application Settings
```
Name: Agent Derive Platform
Type: Single Page Application
```

#### Application URLs
```
Allowed Callback URLs: 
  http://localhost:3000/api/auth/callback

Allowed Logout URLs:
  http://localhost:3000

Allowed Web Origins:
  http://localhost:3000

Allowed Origins (CORS):
  http://localhost:3000
```

### 2. Configure Auth0 API
1. Go to **APIs** section in Auth0 Dashboard
2. Create a new API:
```
Name: Agent Derive API
Identifier: https://agent-derive-api
Signing Algorithm: RS256
```

### 3. Set Up User Roles
1. Go to **User Management > Roles**
2. Create the following roles:
```
- admin: Full system administration
- manager: Workflow and team management
- user: Basic workflow execution and viewing
- viewer: Read-only access
```

### 4. Configure Rules/Actions (Optional)
Create Auth0 Rules or Actions to add custom claims to JWT tokens:
```javascript
// Add custom claims to token
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://agent-derive.com/';
  
  api.idToken.setCustomClaim(`${namespace}roles`, event.user.app_metadata?.roles || []);
  api.accessToken.setCustomClaim(`${namespace}roles`, event.user.app_metadata?.roles || []);
};
```

## Inngest Setup

### 1. Create Inngest Account
1. Go to [Inngest Dashboard](https://www.inngest.com/)
2. Create a new account and project
3. Get your Event Key and Signing Key from the dashboard

### 2. Configure Inngest Environment
```bash
# In your .env.local file
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=signkey_your-signing-key
```

### 3. Test Inngest Integration
```bash
# Start the development server
pnpm dev

# In another terminal, test the Inngest endpoint
curl -X GET http://localhost:3000/api/inngest
```

## AI Service Setup

### 1. OpenAI Setup
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add to your environment file:
```bash
OPENAI_API_KEY=sk-your-openai-api-key
```

### 2. Anthropic Setup
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Add to your environment file:
```bash
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
```

### 3. Hugging Face Setup (Optional)
1. Go to [Hugging Face](https://huggingface.co/)
2. Create an access token
3. Add to your environment file:
```bash
HUGGINGFACE_API_KEY=hf_your-huggingface-token
```

## Development Setup

### 1. Start Development Server
```bash
# Start the Next.js development server with Turbo
pnpm dev

# The application will be available at:
# - Main app: http://localhost:3000
# - Storybook: http://localhost:6006 (run `pnpm storybook`)
# - Database Studio: http://localhost:4983 (run `pnpm db:studio`)
```

### 2. Verify Setup
Visit the following URLs to verify your setup:

1. **Application**: http://localhost:3000
2. **Health Check**: http://localhost:3000/api/health
3. **tRPC Panel** (development only): http://localhost:3000/api/trpc-panel

### 3. Run Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm e2e:headless

# Tests with UI
pnpm e2e:ui

# Test coverage
pnpm test:coverage
```

### 4. Code Quality Checks
```bash
# Lint code
pnpm lint

# Format code
pnpm prettier:fix

# Type checking
pnpm type-check
```

## Docker Setup (Alternative)

### 1. Using Docker Compose
```bash
# Create docker-compose.yml for development
cat > docker-compose.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: agent_derive_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/agent_derive_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
EOF

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app
```

### 2. Dockerfile for Production
```dockerfile
# Multi-stage build for production
FROM node:20-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check if PostgreSQL is running
brew services list | grep postgres  # macOS
sudo systemctl status postgresql    # Linux

# Test database connection
psql -h localhost -U postgres -d agent_derive_dev
```

#### 2. Node.js Version Issues
```bash
# Check Node.js version
node --version

# Use correct version with nvm
nvm use 20
nvm alias default 20
```

#### 3. pnpm Issues
```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 4. Auth0 Configuration Issues
- Verify callback URLs match exactly
- Check if API identifier is correct
- Ensure CORS origins are properly set
- Verify JWT signature algorithm (RS256)

#### 5. Environment Variable Issues
```bash
# Debug environment variables
node -e "console.log(process.env.DATABASE_URL)"

# Check if .env.local is being loaded
console.log('Environment loaded:', !!process.env.CUSTOM_VAR)
```

### Performance Issues
```bash
# Analyze bundle size
pnpm analyze

# Check memory usage
node --max-old-space-size=4096 node_modules/.bin/next build

# Profile application
NODE_OPTIONS="--inspect" pnpm dev
```

### Development Tips

#### 1. Hot Reloading Issues
```bash
# Increase file watchers (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

#### 2. Database Schema Changes
```bash
# Generate new migration
pnpm db:generate

# Apply specific migration
pnpm db:migrate

# Reset database (development only)
pnpm db:push --force
pnpm db:seed
```

#### 3. Debug Mode
```bash
# Enable debug logging
DEBUG=true pnpm dev

# Verbose logging
LOG_LEVEL=debug pnpm dev
```

## Next Steps

After completing the setup:

1. **Explore the Dashboard**: http://localhost:3000/dashboard
2. **Create Your First Workflow**: Navigate to Workflows section
3. **Test the Form Builder**: Try creating a dynamic form
4. **Set Up Your First AI Agent**: Configure an AI workflow
5. **Review the API Documentation**: Check out the tRPC routes
6. **Read the Development Guidelines**: See [DEVELOPMENT.md](./DEVELOPMENT.md)

## Getting Help

- **Documentation**: Check the `/docs` directory
- **GitHub Issues**: Report bugs and feature requests
- **Community**: Join our Discord server
- **Support**: Email support@agent-derive.com