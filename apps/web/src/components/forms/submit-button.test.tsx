// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { SubmitButton } from './submit-button';

describe('SubmitButton', () => {
  afterEach(cleanup);

  it('shows "Send Message" enabled, then "Sending..." disabled while the form action is pending, then recovers', async () => {
    const user = userEvent.setup();
    let finish: () => void = () => undefined;
    const action = () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      });

    render(
      <form action={action}>
        <SubmitButton />
      </form>,
    );
    const idle = screen.getByRole('button', { name: 'Send Message' });
    expect(idle.hasAttribute('disabled')).toBe(false);

    await user.click(idle);

    const pending = await screen.findByRole('button', {
      name: 'Sending...',
    });
    expect(pending.hasAttribute('disabled')).toBe(true);

    finish();

    const done = await screen.findByRole('button', { name: 'Send Message' });
    expect(done.hasAttribute('disabled')).toBe(false);
  });
});
