import { describe, expect, it } from 'vitest';

import { qualifiedInquiryInputSchema } from './qualified-inquiry';

const validInput = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Agency',
  projectType: 'Scoped build',
  budget: '€5,000 – €15,000',
  message: 'We need a briefing tool for our client intake process.',
};

describe('qualifiedInquiryInputSchema', () => {
  it('accepts a complete valid inquiry', () => {
    expect(qualifiedInquiryInputSchema.safeParse(validInput).success).toBe(true);
  });

  it('rejects a project type outside the controlled list', () => {
    const result = qualifiedInquiryInputSchema.safeParse({
      ...validInput,
      projectType: 'Something else',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a missing budget band', () => {
    const { budget: _budget, ...withoutBudget } = validInput;

    expect(qualifiedInquiryInputSchema.safeParse(withoutBudget).success).toBe(false);
  });
});
