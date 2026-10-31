import { afterEach, describe, expect, it, vi } from 'vitest';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { createDynamoInquiryStore } from './dynamo-inquiry-store';
import { createInMemoryInquiryStore } from './in-memory-inquiry-store';
import type { InquiryStore } from './inquiry-intake';
import type { QualifiedInquiry } from './qualified-inquiry';

const SCAN_PAGE_SIZE = 2;

function makeInquiry(id: string, createdAt: string): QualifiedInquiry {
  return {
    id,
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    projectType: 'Scoped build',
    budget: '€5,000 – €15,000',
    message: 'We need a briefing tool for our client intake process.',
    status: 'new',
    createdAt,
  };
}

function createFakeDocumentClient() {
  const items: Record<string, unknown>[] = [];
  const tableNames: string[] = [];

  const send = (command: PutCommand | ScanCommand): Promise<object> => {
    tableNames.push(command.input.TableName ?? '');
    if (command instanceof PutCommand) {
      const item: unknown = command.input.Item;
      items.push({ ...(item as Record<string, unknown>) });
      return Promise.resolve({});
    }
    if (command instanceof ScanCommand) {
      const startKeyId: unknown = command.input.ExclusiveStartKey?.id;
      const start =
        startKeyId === undefined ? 0 : items.findIndex((item) => item.id === startKeyId) + 1;
      const pageSize = Math.min(command.input.Limit ?? SCAN_PAGE_SIZE, SCAN_PAGE_SIZE);
      const page = items.slice(start, start + pageSize);
      const lastItem = page.at(-1);
      const hasMore = start + pageSize < items.length;
      return Promise.resolve({
        Items: page,
        LastEvaluatedKey: hasMore && lastItem ? { id: lastItem.id } : undefined,
      });
    }
    return Promise.reject(new Error('unsupported command'));
  };

  const client = { send } as unknown as DynamoDBDocumentClient;
  return { client, tableNames };
}

function runInquiryStoreContract(name: string, makeStore: () => InquiryStore) {
  describe(`${name} store contract`, () => {
    it('lists newest first across more rows than one scan page', async () => {
      const store = makeStore();
      await store.save(
        makeInquiry('00000000-0000-4000-8000-00000000000a', '2026-10-31T12:00:00.000Z'),
      );
      await store.save(
        makeInquiry('00000000-0000-4000-8000-00000000000b', '2026-10-31T15:00:00.000Z'),
      );
      await store.save(
        makeInquiry('00000000-0000-4000-8000-00000000000c', '2026-10-31T13:00:00.000Z'),
      );
      await store.save(
        makeInquiry('00000000-0000-4000-8000-00000000000d', '2026-10-31T11:00:00.000Z'),
      );
      await store.save(
        makeInquiry('00000000-0000-4000-8000-00000000000e', '2026-10-31T14:00:00.000Z'),
      );

      const listed = await store.list(100);

      expect(listed.map((inquiry) => inquiry.id)).toEqual([
        '00000000-0000-4000-8000-00000000000b',
        '00000000-0000-4000-8000-00000000000e',
        '00000000-0000-4000-8000-00000000000c',
        '00000000-0000-4000-8000-00000000000a',
        '00000000-0000-4000-8000-00000000000d',
      ]);
    });

    it('returns a saved inquiry unchanged from list', async () => {
      const store = makeStore();
      const inquiry = makeInquiry(
        '00000000-0000-4000-8000-00000000000a',
        '2026-10-31T12:00:00.000Z',
      );

      await store.save(inquiry);

      expect(await store.list(100)).toEqual([inquiry]);
    });
  });
}

runInquiryStoreContract('in-memory', createInMemoryInquiryStore);
runInquiryStoreContract('dynamo', () =>
  createDynamoInquiryStore({ tableName: 'submissions', client: createFakeDocumentClient().client }),
);

describe('dynamo store table name', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('throws at creation when neither tableName nor SUBMISSIONS_TABLE_NAME is set', () => {
    vi.stubEnv('SUBMISSIONS_TABLE_NAME', undefined);

    expect(() => createDynamoInquiryStore({ client: createFakeDocumentClient().client })).toThrow(
      'SUBMISSIONS_TABLE_NAME',
    );
  });

  it('uses SUBMISSIONS_TABLE_NAME when no tableName is given', async () => {
    vi.stubEnv('SUBMISSIONS_TABLE_NAME', 'env-inquiries');
    const fake = createFakeDocumentClient();
    const store = createDynamoInquiryStore({ client: fake.client });

    await store.save(
      makeInquiry('00000000-0000-4000-8000-00000000000a', '2026-10-31T12:00:00.000Z'),
    );

    expect(fake.tableNames).toEqual(['env-inquiries']);
  });
});
