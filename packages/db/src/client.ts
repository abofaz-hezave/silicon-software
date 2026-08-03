import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

import * as schema from './schema/index';

export type DbClient = ReturnType<typeof createDbClient>;

/**
 * Creates a Drizzle ORM database client.
 *
 * @param connectionString - Postgres connection string (e.g., from Neon or Aurora)
 * @returns A typed Drizzle client with all schemas attached
 *
 * @example
 * ```ts
 * import { createDbClient } from '@repo/db/client';
 *
 * const db = createDbClient(process.env.DATABASE_URL!);
 * const users = await db.query.users.findMany();
 * ```
 */
export function createDbClient(connectionString: string) {
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}
