// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider, ThemeToggle } from './theme-toggle';

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
      <p>Outside</p>
    </ThemeProvider>,
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      })),
    );
    window.localStorage.clear();
    document.documentElement.className = '';
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('starts with the theme menu closed', () => {
    renderToggle();

    const trigger = screen.getByRole('button', { name: 'Change color theme' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('button', { name: 'Light' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Dark' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'System' })).toBeNull();
  });

  it('shows Light, Dark and System options when the trigger is clicked', async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole('button', { name: 'Change color theme' }));

    expect(
      screen.getByRole('button', { name: 'Change color theme' }).getAttribute('aria-expanded'),
    ).toBe('true');
    expect(screen.getByRole('button', { name: 'Light' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Dark' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'System' })).toBeTruthy();
  });

  it('applies the dark theme, closes, refocuses the trigger and marks Dark as pressed', async () => {
    const user = userEvent.setup();
    renderToggle();
    const trigger = screen.getByRole('button', { name: 'Change color theme' });
    await user.click(trigger);

    await user.click(screen.getByRole('button', { name: 'Dark' }));

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.queryByRole('button', { name: 'Dark' })).toBeNull();
    expect(document.activeElement).toBe(trigger);

    await user.click(trigger);
    expect(screen.getByRole('button', { name: 'Dark' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Light' }).getAttribute('aria-pressed')).toBe(
      'false',
    );
    expect(screen.getByRole('button', { name: 'System' }).getAttribute('aria-pressed')).toBe(
      'false',
    );
  });

  it('applies the light theme when Light is chosen', async () => {
    const user = userEvent.setup();
    renderToggle();
    await user.click(screen.getByRole('button', { name: 'Change color theme' }));

    await user.click(screen.getByRole('button', { name: 'Light' }));

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('follows the light operating system preference when System is chosen after Dark', async () => {
    const user = userEvent.setup();
    renderToggle();
    const trigger = screen.getByRole('button', { name: 'Change color theme' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Dark' }));

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'System' }));

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    await user.click(trigger);
    expect(screen.getByRole('button', { name: 'System' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderToggle();
    const trigger = screen.getByRole('button', { name: 'Change color theme' });
    await user.click(trigger);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Light' }));

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('button', { name: 'Dark' })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on a pointer press outside but stays open for a press inside the menu', async () => {
    const user = userEvent.setup();
    renderToggle();
    await user.click(screen.getByRole('button', { name: 'Change color theme' }));

    await user.pointer({
      keys: '[MouseLeft>]',
      target: screen.getByRole('button', { name: 'Light' }),
    });
    expect(screen.getByRole('button', { name: 'Dark' })).toBeTruthy();

    await user.pointer({ keys: '[MouseLeft>]', target: screen.getByText('Outside') });
    expect(screen.queryByRole('button', { name: 'Dark' })).toBeNull();
  });
});
