# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server with Turbo
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm analyze` - Build with bundle analyzer

### Code Quality
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Auto-fix ESLint issues
- `pnpm prettier:fix` - Format code with Prettier
- `pnpm format` - Format all TypeScript, TSX, and Markdown files

### Testing
- `pnpm test` - Run unit tests with Vitest
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate coverage report
- `pnpm e2e:headless` - Run Playwright E2E tests
- `pnpm e2e:ui` - Run Playwright with UI
- `pnpm storybook` - Start Storybook development server
- `pnpm test-storybook` - Run Storybook tests

## Architecture

This is a Next.js 15 enterprise boilerplate using the App Directory pattern with React 19.

### Technology Stack
- **Framework**: Next.js 15 with App Directory
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS v4 with CVA for component variants
- **UI Components**: Radix UI headless components
- **Testing**: Vitest (unit), Playwright (E2E), Storybook (component)
- **Environment**: T3 Env with Zod validation
- **Observability**: OpenTelemetry via @vercel/otel

### Project Structure
- `/app/` - Next.js App Directory routes and layouts
- `/components/` - Reusable UI components with co-located tests and stories
- `/e2e/` - Playwright end-to-end tests
- `/styles/` - Global styles and Tailwind configuration
- `env.mjs` - Type-safe environment variable validation

### Component Development Pattern
Components follow a consistent structure:
- Each component has its own directory
- Co-located files: `Component.tsx`, `Component.test.tsx`, `Component.stories.tsx`
- Use CVA (Class Variance Authority) for variant styling
- Implement with Radix UI primitives for accessibility
- Support dark mode by default

### Code Conventions
- Use absolute imports (configured via TypeScript baseUrl)
- Follow strict TypeScript rules including `noUncheckedIndexedAccess`
- ESLint configured with Next.js, import sorting, and Storybook rules
- Conventional commit messages (feat, fix, docs, style, refactor, test, chore)

### Testing Strategy
1. **Unit Tests**: Test individual components and utilities with Vitest
2. **E2E Tests**: Test user flows with Playwright across multiple browsers
3. **Component Tests**: Visual and interaction testing with Storybook
4. Run a single test file: `pnpm test path/to/file.test.tsx`

### Important Notes
- Package manager is pnpm (managed via Corepack)
- Health check endpoint available at `/api/health`
- Bundle analysis available via `pnpm analyze`
- Strict TypeScript with enhanced type safety enabled
- All components should support both light and dark modes