import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(3001),
  API_CORS_ORIGINS: z.string().default('http://localhost:3000'),
  DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://blackcinnamon:change-me@localhost:5432/blackcinnamon'),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;
let dotenvLoaded = false;

/**
 * Loads the nearest .env file (repository root first, then the current
 * working directory) using Node's built-in loader. Missing files are ignored;
 * real environment variables always win because they are set by the runtime
 * before this runs.
 */
function loadDotenvFile(): void {
  if (dotenvLoaded) {
    return;
  }
  dotenvLoaded = true;

  const candidates = [resolve(process.cwd(), '../../.env'), resolve(process.cwd(), '.env')];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      process.loadEnvFile(candidate);
      return;
    }
  }
}

/**
 * Parses and caches process.env. Throws on invalid configuration so the
 * process fails fast on startup rather than at first use.
 */
export function getEnv(): Env {
  if (cached === null) {
    loadDotenvFile();
    cached = envSchema.parse(process.env);
  }
  return cached;
}

export function getCorsOrigins(): string[] {
  return getEnv()
    .API_CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}
