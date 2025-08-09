# Agent Derive - Intelligent Workflow Automation Platform

A powerful AI-native workflow orchestration platform built with Next.js 15, TypeScript, Neon PostgreSQL, and Auth0. Create, manage, and automate complex business workflows with AI-powered agents.

🚀 **Live Demo**: [https://agent-derive-3egdq85bv-derive-hq.vercel.app](https://agent-derive-3egdq85bv-derive-hq.vercel.app)

## ✨ Features

- **🔐 Secure Authentication**: Auth0 integration with multi-tenant support
- **🎨 Modern UI**: Beautiful, responsive interface with Tailwind CSS v4 and shadcn/ui
- **📊 Visual Workflow Designer**: Drag-and-drop workflow builder with React Flow
- **🤖 AI Agents**: Integrate AI-powered tasks into your workflows
- **🗄️ PostgreSQL Database**: Scalable data storage with Neon serverless PostgreSQL
- **⚡ Real-time Updates**: Live workflow execution tracking
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎯 Smart Sidebar**: Icon-only navigation with hover expansion

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Neon PostgreSQL database (free tier at [neon.tech](https://neon.tech))
- Auth0 account (credentials provided below)

### Local Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/yourusername/agent-derive.git
   cd agent-derive
   pnpm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env.local` and update with your credentials:
   - Neon PostgreSQL connection string
   - Auth0 authentication details
   - Required API keys

3. **Initialize the database:**
   ```bash
   # Push schema to Neon database
   pnpm db:push
   
   # Seed with sample workflows
   pnpm db:seed:workflows
   ```

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

5. **Access the application:**
   - Open [http://localhost:3002](http://localhost:3002)
   - Click "Sign in with Auth0" to log in
   - Explore the dashboard and create workflows

## 📁 Project Structure

```
agent-derive/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Auth0 authentication
│   │   ├── trpc/         # tRPC API endpoints
│   │   └── inngest/      # Workflow orchestration
│   ├── dashboard/         # Dashboard pages
│   └── page.tsx          # Login page
├── src/
│   ├── components/        # React components
│   ├── db/               # Database schema & client
│   ├── lib/              # Utility libraries
│   └── server/           # tRPC server & routers
├── DATABASE_SETUP.md      # Database setup guide
└── .env.local            # Environment variables
```

## 🔑 Key Features

- **🔐 Authentication**: Auth0 integration for secure login
- **🎨 Modern UI**: Built with shadcn/ui and Tailwind CSS v4
- **🗄️ Database**: PostgreSQL with Drizzle ORM
- **🔄 Workflows**: Visual workflow builder with React Flow
- **🤖 AI Integration**: Support for AI agents in workflows
- **📊 Analytics**: Real-time workflow analytics
- **🏢 Multi-tenant**: Row-level security for tenant isolation

## 🛠️ Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build           # Build for production
pnpm start           # Start production server

# Database
pnpm db:generate     # Generate migrations
pnpm db:push        # Push schema to database
pnpm db:seed        # Seed database with test data
pnpm db:studio      # Open Drizzle Studio GUI

# Testing
pnpm test           # Run tests
pnpm lint           # Run ESLint
pnpm typecheck      # Run TypeScript checks
```

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env.local`:

- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `AUTH0_SECRET`: Auth0 session secret
- `AUTH0_BASE_URL`: Application base URL
- `AUTH0_ISSUER_BASE_URL`: Auth0 domain
- `AUTH0_CLIENT_ID`: Auth0 application client ID
- `AUTH0_CLIENT_SECRET`: Auth0 application client secret

### Auth0 Setup

1. Log into your Auth0 dashboard
2. Create a new Regular Web Application
3. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:3002/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3002`
   - **Allowed Web Origins**: `http://localhost:3002`

## 📚 Documentation

- [Database Setup Guide](./DATABASE_SETUP.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Auth0 Next.js SDK](https://github.com/auth0/nextjs-auth0)
- [Drizzle ORM](https://orm.drizzle.team)
- [shadcn/ui](https://ui.shadcn.com)

## 🚀 Deployment

### Current Deployment

- **Production**: [https://agent-derive-3egdq85bv-derive-hq.vercel.app](https://agent-derive-3egdq85bv-derive-hq.vercel.app)
- **Team**: derive-hq
- **Project**: agent-derive
- **Status**: ✅ Live

### Deploy Your Own Instance

1. **Fork this repository** to your GitHub account

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your forked repository
   - Select "agents-derive" as the project name

3. **Configure Environment Variables in Vercel:**
   Add the following environment variables in your Vercel project settings:
   - `DATABASE_URL` - Your Neon PostgreSQL connection string
   - `AUTH0_SECRET` - A secure random string (at least 32 characters)
   - `AUTH0_BASE_URL` - Your production Vercel app URL
   - `AUTH0_ISSUER_BASE_URL` - Your Auth0 domain
   - `AUTH0_CLIENT_ID` - Your Auth0 application client ID
   - `AUTH0_CLIENT_SECRET` - Your Auth0 application client secret
   - `AUTH0_AUDIENCE` - Your Auth0 API audience
   - `NEXT_PUBLIC_APP_URL` - Your production app URL

4. **Update Auth0 Settings:**
   - Add your Vercel URL to Auth0 callback URLs:
     - `https://your-app.vercel.app/api/auth/callback`
   - Add to Allowed Logout URLs:
     - `https://your-app.vercel.app`
   - Add to Allowed Web Origins:
     - `https://your-app.vercel.app`

5. **Deploy:**
   - Click "Deploy" in Vercel
   - Wait for the build to complete
   - Your app will be live at your Vercel URL

### Post-Deployment

After deployment, run the database seed:
1. Access Vercel Functions logs
2. Or manually run seed scripts through Vercel CLI

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:

1. Make sure your `DATABASE_URL` is properly set in `.env.local`
2. Run `pnpm install` to ensure all dependencies are installed
3. The build has ESLint and TypeScript checks disabled for development convenience

### Authentication Issues

If Auth0 login isn't working:

1. Verify your Auth0 credentials in `.env.local`
2. Check that callback URLs are properly configured in Auth0
3. Clear browser cookies and try again

### Database Connection

If you can't connect to the database:

1. Ensure your Neon database is active
2. Check that the connection string includes `?sslmode=require`
3. Verify your IP isn't blocked (Neon allows all IPs by default)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.