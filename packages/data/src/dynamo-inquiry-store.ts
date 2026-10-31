import 'server-only';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';

import type { InquiryStore } from './inquiry-intake';
import { qualifiedInquirySchema } from './qualified-inquiry';
import type { QualifiedInquiry } from './qualified-inquiry';

export interface DynamoInquiryStoreConfig {
  /** DynamoDB table holding inquiries. Defaults to `SUBMISSIONS_TABLE_NAME` env var; required if that is unset. */
  tableName?: string;
  /** AWS region. Defaults to the runtime region (`AWS_REGION`), then `us-east-1`. */
  region?: string;
  /** Document client to use instead of one built from `region`. */
  client?: DynamoDBDocumentClient;
}

export function createDynamoInquiryStore(config: DynamoInquiryStoreConfig = {}): InquiryStore {
  const region = config.region ?? process.env.AWS_REGION ?? 'us-east-1';
  const tableName = config.tableName ?? process.env.SUBMISSIONS_TABLE_NAME;
  if (!tableName) {
    throw new Error('Set SUBMISSIONS_TABLE_NAME or pass tableName to createDynamoInquiryStore.');
  }
  const client = config.client ?? DynamoDBDocumentClient.from(new DynamoDBClient({ region }));

  return {
    async save(inquiry) {
      await client.send(new PutCommand({ TableName: tableName, Item: inquiry }));
    },
    async list(limit) {
      const inquiries: QualifiedInquiry[] = [];
      let exclusiveStartKey: ScanCommandInput['ExclusiveStartKey'];
      do {
        const result = await client.send(
          new ScanCommand({ TableName: tableName, ExclusiveStartKey: exclusiveStartKey }),
        );
        inquiries.push(...z.array(qualifiedInquirySchema).parse(result.Items ?? []));
        exclusiveStartKey = result.LastEvaluatedKey;
      } while (exclusiveStartKey);

      return inquiries.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
    },
  };
}
