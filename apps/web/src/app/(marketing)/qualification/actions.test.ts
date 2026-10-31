import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { submitQualification } from './actions';
import { initialQualificationState } from '@/lib/qualification-form';

const SUBMISSIONS_API_URL = 'https://api.example.com/';
const SUCCESS_MESSAGE =
  "Thanks — we've received your inquiry and will reply by email if it looks like a fit.";

const validValues = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Agency',
  projectType: 'Scoped build',
  budget: '€5,000 – €15,000',
  message: 'We need a briefing tool for our client intake process.',
};

function buildFormData(overrides: Partial<Record<keyof typeof validValues, string>> = {}) {
  const formData = new FormData();
  for (const [key, value] of Object.entries({ ...validValues, ...overrides })) {
    formData.set(key, value);
  }
  return formData;
}

describe('submitQualification', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubEnv('SUBMISSIONS_API_URL', SUBMISSIONS_API_URL);
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns field errors and preserves values without calling the API for invalid input', async () => {
    const state = await submitQualification(
      initialQualificationState,
      buildFormData({ email: 'not-an-email', projectType: 'Something else' }),
    );

    expect(state.success).toBe(false);
    expect(state.message).toBe('Please correct the highlighted fields.');
    expect(state.errors?.email).toEqual(['Enter a valid email address.']);
    expect(state.errors?.projectType).toEqual(['Choose a project type.']);
    expect(state.values?.email).toBe('not-an-email');
    expect(state.values?.name).toBe(validValues.name);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('increments the attempt counter from the previous state on invalid and successful results', async () => {
    const invalid = await submitQualification(
      { ...initialQualificationState, attempt: 4 },
      buildFormData({ email: 'not-an-email' }),
    );
    expect(invalid.attempt).toBe(5);

    fetchMock.mockResolvedValue(new Response('{}', { status: 201 }));
    const success = await submitQualification(
      { ...initialQualificationState, attempt: 4 },
      buildFormData(),
    );
    expect(success.attempt).toBe(5);
  });

  it('posts a valid inquiry once to the submissions endpoint and reports success on 201', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id: '3f2b8c1e-9a4d-4e6f-8b2a-1c2d3e4f5a6b' }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const state = await submitQualification(initialQualificationState, buildFormData());

    expect(state).toEqual({ success: true, message: SUCCESS_MESSAGE, attempt: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.example.com/submissions');
    expect(init.method).toBe('POST');
    expect(init.cache).toBe('no-store');
    expect(new Headers(init.headers).get('content-type')).toBe('application/json');
    expect(init.body).toBe(JSON.stringify(validValues));
  });

  it.each([400, 500])(
    'reports failure and keeps the entries when the API responds %i',
    async (status) => {
      fetchMock.mockResolvedValue(new Response('{}', { status }));

      const state = await submitQualification(initialQualificationState, buildFormData());

      expect(state).toEqual({
        success: false,
        message: "We couldn't send your inquiry. Please try again in a moment.",
        values: validValues,
        attempt: 1,
      });
    },
  );

  it('reports failure when the API request cannot be completed', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));

    const state = await submitQualification(initialQualificationState, buildFormData());

    expect(state.success).toBe(false);
    expect(state.values).toEqual(validValues);
  });

  it('reports failure without calling the API when the submissions URL is not configured', async () => {
    vi.stubEnv('SUBMISSIONS_API_URL', '');

    const state = await submitQualification(initialQualificationState, buildFormData());

    expect(state.success).toBe(false);
    expect(state.values).toEqual(validValues);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('logs outcomes without submitted personal details', async () => {
    const consoleInfo = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: '3f2b8c1e-9a4d-4e6f-8b2a-1c2d3e4f5a6b' }), { status: 201 }),
    );
    await submitQualification(initialQualificationState, buildFormData());

    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 500 }));
    await submitQualification(initialQualificationState, buildFormData());

    expect(consoleInfo).toHaveBeenCalledWith({
      event: 'qualification_submitted',
      id: '3f2b8c1e-9a4d-4e6f-8b2a-1c2d3e4f5a6b',
    });
    expect(consoleError).toHaveBeenCalledWith({
      event: 'qualification_submit_failed',
      status: 500,
    });
    const logged = JSON.stringify([consoleInfo.mock.calls, consoleError.mock.calls]);
    expect(logged).not.toContain(validValues.email);
    expect(logged).not.toContain(validValues.name);
    expect(logged).not.toContain(validValues.message);
  });

  it('omits an empty company from the posted inquiry', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 201 }));

    await submitQualification(initialQualificationState, buildFormData({ company: '' }));

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      projectType: 'Scoped build',
      budget: '€5,000 – €15,000',
      message: 'We need a briefing tool for our client intake process.',
    });
  });

  it('treats a non-text form entry as empty', async () => {
    const formData = buildFormData();
    formData.set('name', new File(['x'], 'x.txt'));

    const state = await submitQualification(initialQualificationState, formData);

    expect(state.success).toBe(false);
    expect(state.errors?.name).toEqual(['Name is required.']);
    expect(state.values?.name).toBe('');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('still reports success and logs without an id when the 201 body has no id', async () => {
    const consoleInfo = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    fetchMock.mockResolvedValue(new Response('{}', { status: 201 }));

    const state = await submitQualification(initialQualificationState, buildFormData());

    expect(state).toEqual({ success: true, message: SUCCESS_MESSAGE, attempt: 1 });
    expect(consoleInfo).toHaveBeenCalledWith({ event: 'qualification_submitted' });
  });
});
