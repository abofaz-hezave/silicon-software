'use server';

import { qualifiedInquiryInputSchema } from '@repo/data/qualified-inquiry';
import { z } from 'zod';

import type { QualificationField, QualificationFormState } from '@/lib/qualification-form';
import { getSubmissionsApiUrl } from '@/lib/server-env';

const SUCCESS_MESSAGE =
  "Thanks — we've received your inquiry and will reply by email if it looks like a fit.";
const SUBMIT_FAILED_MESSAGE = "We couldn't send your inquiry. Please try again in a moment.";

const submissionResponseSchema = z.object({ id: z.string() });

function readString(formData: FormData, field: QualificationField): string {
  const value = formData.get(field);

  return typeof value === 'string' ? value : '';
}

function readValues(formData: FormData): Record<QualificationField, string> {
  return {
    name: readString(formData, 'name'),
    email: readString(formData, 'email'),
    company: readString(formData, 'company'),
    projectType: readString(formData, 'projectType'),
    budget: readString(formData, 'budget'),
    message: readString(formData, 'message'),
  };
}

export async function submitQualification(
  prevState: QualificationFormState,
  formData: FormData,
): Promise<QualificationFormState> {
  const attempt = prevState.attempt + 1;
  const values = readValues(formData);
  const parsed = qualifiedInquiryInputSchema.safeParse({
    ...values,
    company: values.company || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Please correct the highlighted fields.',
      errors: z.flattenError(parsed.error).fieldErrors,
      values,
      attempt,
    };
  }

  const failure: QualificationFormState = {
    success: false,
    message: SUBMIT_FAILED_MESSAGE,
    values,
    attempt,
  };

  const apiUrl = getSubmissionsApiUrl();
  if (!apiUrl) {
    console.error({ event: 'qualification_submit_failed', reason: 'missing_api_url' });
    return failure;
  }

  let response: Response;
  try {
    response = await fetch(`${apiUrl.replace(/\/+$/, '')}/submissions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    console.error({ event: 'qualification_submit_failed' });
    return failure;
  }

  if (response.status !== 201) {
    console.error({ event: 'qualification_submit_failed', status: response.status });
    return failure;
  }

  const body: unknown = await response.json().catch(() => undefined);
  const submission = submissionResponseSchema.safeParse(body);
  console.info({
    event: 'qualification_submitted',
    ...(submission.success ? { id: submission.data.id } : {}),
  });

  return { success: true, message: SUCCESS_MESSAGE, attempt };
}
