import { describe, expect, it } from 'vitest';

import { createInMemoryInquiryStore } from './in-memory-inquiry-store';
import { createInquiryIntake } from './inquiry-intake';
import type { RateLimiter } from './inquiry-intake';

const validInput = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Agency',
  projectType: 'Scoped build',
  budget: '€5,000 – €15,000',
  message: 'We need a briefing tool for our client intake process.',
};

const allowingLimiter: RateLimiter = {
  check: () => Promise.resolve({ allowed: true, resetAt: 0 }),
};

describe('submit', () => {
  it('stores a valid inquiry as new with generated id and timestamp', async () => {
    const intake = createInquiryIntake({
      store: createInMemoryInquiryStore(),
      rateLimiter: allowingLimiter,
      now: () => new Date('2026-10-31T12:00:00.000Z'),
      newId: () => '3f2b8c1e-9a4d-4e6f-8b2a-1c2d3e4f5a6b',
    });

    const expected = {
      ...validInput,
      id: '3f2b8c1e-9a4d-4e6f-8b2a-1c2d3e4f5a6b',
      status: 'new',
      createdAt: '2026-10-31T12:00:00.000Z',
    };

    expect(await intake.submit(validInput, { clientId: 'client-1' })).toEqual({
      ok: true,
      inquiry: expected,
    });
    expect(await intake.list()).toEqual([expected]);
  });

  it('rejects invalid input with issues and stores nothing', async () => {
    const intake = createInquiryIntake({
      store: createInMemoryInquiryStore(),
      rateLimiter: allowingLimiter,
    });

    expect(
      await intake.submit({ ...validInput, email: 'not-an-email' }, { clientId: 'client-1' }),
    ).toEqual({
      ok: false,
      reason: 'invalid',
      issues: [{ path: 'email', message: 'Enter a valid email address.' }],
    });
    expect(await intake.list()).toEqual([]);
  });

  it('lists newest first by createdAt regardless of insertion order', async () => {
    let clock = new Date('2026-10-31T12:00:00.000Z');
    let nextId = '3f2b8c1e-9a4d-4e6f-8b2a-1c2d3e4f5a6b';
    const intake = createInquiryIntake({
      store: createInMemoryInquiryStore(),
      rateLimiter: allowingLimiter,
      now: () => clock,
      newId: () => nextId,
    });

    await intake.submit(validInput, { clientId: 'client-1' });
    clock = new Date('2026-10-31T13:00:00.000Z');
    nextId = '7a1d0e2f-5b3c-4d8e-9f6a-2b3c4d5e6f70';
    await intake.submit(validInput, { clientId: 'client-1' });

    const listed = await intake.list();
    expect(listed.map((inquiry) => inquiry.id)).toEqual([
      '7a1d0e2f-5b3c-4d8e-9f6a-2b3c4d5e6f70',
      '3f2b8c1e-9a4d-4e6f-8b2a-1c2d3e4f5a6b',
    ]);
  });

  it('truncates the list to the requested limit, keeping the newest', async () => {
    let clock = new Date('2026-10-31T12:00:00.000Z');
    let nextId = '3f2b8c1e-9a4d-4e6f-8b2a-1c2d3e4f5a6b';
    const intake = createInquiryIntake({
      store: createInMemoryInquiryStore(),
      rateLimiter: allowingLimiter,
      now: () => clock,
      newId: () => nextId,
    });

    await intake.submit(validInput, { clientId: 'client-1' });
    clock = new Date('2026-10-31T13:00:00.000Z');
    nextId = '7a1d0e2f-5b3c-4d8e-9f6a-2b3c4d5e6f70';
    await intake.submit(validInput, { clientId: 'client-1' });
    clock = new Date('2026-10-31T14:00:00.000Z');
    nextId = 'b0c1d2e3-f4a5-4b6c-8d7e-9f0a1b2c3d4e';
    await intake.submit(validInput, { clientId: 'client-1' });

    const listed = await intake.list(2);
    expect(listed.map((inquiry) => inquiry.id)).toEqual([
      'b0c1d2e3-f4a5-4b6c-8d7e-9f0a1b2c3d4e',
      '7a1d0e2f-5b3c-4d8e-9f6a-2b3c4d5e6f70',
    ]);
  });

  it('returns rate_limited before validating and stores nothing', async () => {
    const limitedLimiter: RateLimiter = {
      check: () => Promise.resolve({ allowed: false, resetAt: 1_790_000_000_000 }),
    };
    const intake = createInquiryIntake({
      store: createInMemoryInquiryStore(),
      rateLimiter: limitedLimiter,
    });

    expect(await intake.submit({ name: 'x' }, { clientId: 'client-1' })).toEqual({
      ok: false,
      reason: 'rate_limited',
      resetAt: 1_790_000_000_000,
    });
    expect(await intake.list()).toEqual([]);
  });
});
