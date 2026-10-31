import { z } from 'zod';

/**
 * Project types offered on the qualification form. Values are display strings;
 * adjust here if the marketing site's enum changes.
 */
export const PROJECT_TYPE_OPTIONS = [
  'Intelligent Briefing customization',
  'Paid discovery',
  'Scoped build',
  'Ongoing product retainer',
  'Not sure yet',
] as const;

/**
 * Budget bands offered on the qualification form, in EUR. Values are display strings;
 * adjust here if the marketing site's enum changes.
 */
export const BUDGET_OPTIONS = [
  'Under €2,500',
  '€2,500 – €5,000',
  '€5,000 – €15,000',
  '€15,000+',
  'Not sure yet',
] as const;

export const qualifiedInquiryInputSchema = z.object({
  name: z.string().trim().min(2, 'Name is required.').max(100, 'Name is too long.'),
  email: z.string().trim().pipe(z.email('Enter a valid email address.')),
  company: z.string().trim().max(200, 'Company name is too long.').optional(),
  projectType: z.enum(PROJECT_TYPE_OPTIONS, { error: 'Choose a project type.' }),
  budget: z.enum(BUDGET_OPTIONS, { error: 'Choose a budget range.' }),
  message: z
    .string()
    .trim()
    .min(10, 'Please add a bit more detail (at least 10 characters).')
    .max(5000, 'Message is too long.'),
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
