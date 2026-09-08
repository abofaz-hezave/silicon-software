import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export interface DataClientConfig {
  /** DynamoDB table holding submissions. Defaults to `SUBMISSIONS_TABLE` env var, then `submissions`. */
  tableName?: string;
  /** AWS region. Defaults to the runtime region (`AWS_REGION`), then `us-east-1`. */
  region?: string;
}

export interface DataClient {
  /** AWS SDK v3 DynamoDB document client used for all storage access. */
  client: DynamoDBDocumentClient;
  /** Name of the submissions table. */
  tableName: string;
}

/**
 * Creates a DynamoDB document client plus the submissions table name.
 *
 * DynamoDB is schema-less: record shapes live as TypeScript types (see
 * `submissions.ts`). No ORM, no drizzle-kit, no migrations.
 *
 * @example
 * ```ts
 * import { createDataClient, saveSubmission } from '@repo/data';
 *
 * const data = createDataClient({ tableName: process.env.SUBMISSIONS_TABLE });
 * await saveSubmission(data, { name: 'Ada', email: 'ada@example.com', message: '...' });
 * ```
 */
export function createDataClient(config: DataClientConfig = {}): DataClient {
  const region = config.region ?? process.env.AWS_REGION ?? 'us-east-1';
  const tableName = config.tableName ?? process.env.SUBMISSIONS_TABLE ?? 'submissions';
  const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region }));
  return { client, tableName };
}
