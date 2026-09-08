import { randomUUID } from 'node:crypto';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';

import type { DataClient } from './client';

/**
 * Budget bands offered on the qualification form. Values are display strings;
 * adjust here if the marketing site's enum changes.
 */
export const BUDGET_OPTIONS = [
  'Under $5k',
  '$5k – $10k',
  '$10k – $25k',
  '$25k+',
  'Not sure yet',
] as const;

export const submissionInputSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.email('Enter a valid email address.'),
  company: z.string().optional(),
  budget: z.enum(BUDGET_OPTIONS).optional(),
  message: z.string().min(10, 'Please add a bit more detail (at least 10 characters).'),
});

export type SubmissionInput = z.infer<typeof submissionInputSchema>;

export interface Submission extends SubmissionInput {
  /** Primary key — the submission id. */
  id: string;
  /** Triage status; always `new` when created. */
  status: 'new';
  /** ISO 8601 creation timestamp. */
  createdAt: string;
}

const submissionSchema: z.ZodType<Submission> = submissionInputSchema.extend({
  id: z.uuid(),
  status: z.literal('new'),
  createdAt: z.iso.datetime(),
});

/**
 * Validates the input and writes a submission to the `submissions` table.
 *
 * @returns The stored submission, including its generated id and timestamp.
 */
export async function saveSubmission(
  data: DataClient,
  input: SubmissionInput,
): Promise<Submission> {
  const submission: Submission = {
    ...submissionInputSchema.parse(input),
    id: randomUUID(),
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  await data.client.send(
    new PutCommand({
      TableName: data.tableName,
      Item: submission,
    }),
  );

  return submission;
}

/**
 * Lists submissions, most recent first.
 *
 * The table's only key is the submission id, so this uses a scan. Callers that
 * need pagination or a bounded result set can pass `limit`.
 */
export async function listSubmissions(data: DataClient, limit = 100): Promise<Submission[]> {
  const result = await data.client.send(
    new ScanCommand({
      TableName: data.tableName,
      Limit: limit,
    }),
  );

  const submissions = z.array(submissionSchema).parse(result.Items ?? []);
  return submissions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
