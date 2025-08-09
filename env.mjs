import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // Build Configuration
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),

    // Next.js Configuration
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().optional(),

    // Database Configuration
    DATABASE_URL: z.string().optional(),
    NEON_DATABASE_URL: z.string().optional(),
    DRIZZLE_DATABASE_URL: z.string().optional(),

    // Auth0 Authentication
    AUTH0_SECRET: z.string().optional(),
    AUTH0_BASE_URL: z.string().optional(),
    AUTH0_ISSUER_BASE_URL: z.string().optional(),
    AUTH0_CLIENT_ID: z.string().optional(),
    AUTH0_CLIENT_SECRET: z.string().optional(),
    AUTH0_AUDIENCE: z.string().optional(),

    // Inngest Configuration
    INNGEST_EVENT_KEY: z.string().optional(),
    INNGEST_SIGNING_KEY: z.string().optional(),
    INNGEST_SERVE_HOST: z.string().optional(),
    INNGEST_SERVE_PATH: z.string().optional(),

    // tRPC Configuration
    TRPC_SECRET: z.string().optional(),

    // OpenTelemetry & Observability
    OTEL_SERVICE_NAME: z.string().optional(),
    OTEL_SERVICE_VERSION: z.string().optional(),
    OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
    OTEL_EXPORTER_OTLP_HEADERS: z.string().optional(),

    // AI/ML Service Configuration
    OPENAI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    HUGGINGFACE_API_KEY: z.string().optional(),

    // Workflow Engine Configuration
    WORKFLOW_EXECUTION_TIMEOUT: z.string().optional(),
    MAX_CONCURRENT_WORKFLOWS: z.string().optional(),
    WORKFLOW_RETRY_ATTEMPTS: z.string().optional(),

    // Survey & Forms Configuration
    SURVEY_JS_LICENSE_KEY: z.string().optional(),

    // File Storage & CDN
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().optional(),
    AWS_S3_BUCKET_NAME: z.string().optional(),
    CDN_URL: z.string().optional(),

    // Redis Configuration
    REDIS_URL: z.string().optional(),
    REDIS_PASSWORD: z.string().optional(),

    // Email Service Configuration
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    FROM_EMAIL: z.string().optional(),

    // External API Keys & Services
    SLACK_BOT_TOKEN: z.string().optional(),
    DISCORD_BOT_TOKEN: z.string().optional(),
    GITHUB_TOKEN: z.string().optional(),
    NOTION_API_KEY: z.string().optional(),

    // Security & CORS
    ALLOWED_ORIGINS: z.string().optional(),
    API_RATE_LIMIT: z.string().optional(),
    JWT_SECRET: z.string().optional(),

    // Development & Debug
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    DEBUG: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),

    // Feature Flags
    ENABLE_ANALYTICS: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    ENABLE_MONITORING: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    ENABLE_EXPERIMENTAL_FEATURES: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),

    // Webhook Configuration
    WEBHOOK_SECRET: z.string().optional(),
    WEBHOOK_URL: z.string().optional(),

    // Payment Processing (Optional)
    STRIPE_PUBLIC_KEY: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    // Monitoring & Error Tracking
    SENTRY_DSN: z.string().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
  },
  client: {
    // Client-side environment variables (prefixed with NEXT_PUBLIC_)
    NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
  },
  runtimeEnv: {
    // Build Configuration
    ANALYZE: process.env.ANALYZE,

    // Next.js Configuration
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

    // Database Configuration
    DATABASE_URL: process.env.DATABASE_URL,
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,
    DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL,

    // Auth0 Authentication
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,

    // Inngest Configuration
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    INNGEST_SERVE_HOST: process.env.INNGEST_SERVE_HOST,
    INNGEST_SERVE_PATH: process.env.INNGEST_SERVE_PATH,

    // Client-side variables
    NEXT_PUBLIC_VERCEL_ANALYTICS_ID: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,

    // tRPC Configuration
    TRPC_SECRET: process.env.TRPC_SECRET,

    // OpenTelemetry & Observability
    OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME,
    OTEL_SERVICE_VERSION: process.env.OTEL_SERVICE_VERSION,
    OTEL_EXPORTER_OTLP_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    OTEL_EXPORTER_OTLP_HEADERS: process.env.OTEL_EXPORTER_OTLP_HEADERS,

    // AI/ML Service Configuration
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,

    // Workflow Engine Configuration
    WORKFLOW_EXECUTION_TIMEOUT: process.env.WORKFLOW_EXECUTION_TIMEOUT,
    MAX_CONCURRENT_WORKFLOWS: process.env.MAX_CONCURRENT_WORKFLOWS,
    WORKFLOW_RETRY_ATTEMPTS: process.env.WORKFLOW_RETRY_ATTEMPTS,

    // Survey & Forms Configuration
    SURVEY_JS_LICENSE_KEY: process.env.SURVEY_JS_LICENSE_KEY,

    // File Storage & CDN
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    CDN_URL: process.env.CDN_URL,

    // Redis Configuration
    REDIS_URL: process.env.REDIS_URL,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,

    // Email Service Configuration
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    FROM_EMAIL: process.env.FROM_EMAIL,

    // External API Keys & Services
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    NOTION_API_KEY: process.env.NOTION_API_KEY,

    // Security & CORS
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    API_RATE_LIMIT: process.env.API_RATE_LIMIT,
    JWT_SECRET: process.env.JWT_SECRET,

    // Development & Debug
    NODE_ENV: process.env.NODE_ENV,
    DEBUG: process.env.DEBUG,
    LOG_LEVEL: process.env.LOG_LEVEL,

    // Feature Flags
    ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS,
    ENABLE_MONITORING: process.env.ENABLE_MONITORING,
    ENABLE_EXPERIMENTAL_FEATURES: process.env.ENABLE_EXPERIMENTAL_FEATURES,

    // Webhook Configuration
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    WEBHOOK_URL: process.env.WEBHOOK_URL,

    // Payment Processing (Optional)
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    // Monitoring & Error Tracking
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
  },
})
