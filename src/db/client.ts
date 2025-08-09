import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Load env vars if not already loaded (for scripts)
if (!process.env.DATABASE_URL && typeof window === 'undefined') {
  require('dotenv').config({ path: '.env.local' });
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export type Database = typeof db;