import { z } from 'zod';

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

export const qualifiedInquiryInputSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.email('Enter a valid email address.'),
  company: z.string().optional(),
  budget: z.enum(BUDGET_OPTIONS).optional(),
  message: z.string().min(10, 'Please add a bit more detail (at least 10 characters).'),
});

export type QualifiedInquiryInput = z.infer<typeof qualifiedInquiryInputSchema>;

export interface QualifiedInquiry extends QualifiedInquiryInput {
  /** Primary key — the inquiry id. */
  id: string;
  /** Triage status; always `new` when created. */
  status: 'new';
  /** ISO 8601 creation timestamp. */
  createdAt: string;
}

export const qualifiedInquirySchema: z.ZodType<QualifiedInquiry> =
  qualifiedInquiryInputSchema.extend({
    id: z.uuid(),
    status: z.literal('new'),
    createdAt: z.iso.datetime(),
  });
