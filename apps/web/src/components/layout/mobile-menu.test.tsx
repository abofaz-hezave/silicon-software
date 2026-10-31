// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { MobileMenu } from './mobile-menu';

function preventLinkNavigation() {
  const handler = (event: MouseEvent) => {
    event.preventDefault();
  };
  document.addEventListener('click', handler);
  return () => {
    document.removeEventListener('click', handler);
  };
}

function getTrigger() {
  const trigger = document.querySelector<HTMLButtonElement>('button[aria-controls]');
  if (!trigger) throw new Error('Menu trigger not found');
  return trigger;
}

describe('MobileMenu', () => {
  afterEach(cleanup);

  it('starts closed with an "Open navigation" trigger and no navigation', () => {
    render(<MobileMenu />);

    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).toBeNull();
  });

  it('opens on click, lists the destinations and focuses the first link', async () => {
    const user = userEvent.setup();
    render(<MobileMenu />);

    await user.click(screen.getByRole('button', { name: 'Open navigation' }));

    const trigger = getTrigger();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-label')).toBe('Close navigation');

    const nav = screen.getByRole('navigation', { name: 'Mobile navigation' });
    const links = [...nav.querySelectorAll('a')].map((a) => [
      a.textContent,
      a.getAttribute('href'),
    ]);
    expect(links).toEqual([
      ['Home', '/'],
      ['Services', '/services'],
      ['Intelligent Briefing', '/intelligent-briefing'],
      ['About', '/about'],
      ['Start a conversation', '/qualification'],
    ]);
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Home' }));
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<MobileMenu />);
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).toBeNull();
    expect(getTrigger().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(getTrigger());
  });

  it('closes when a navigation link is clicked', async () => {
    const user = userEvent.setup();
    const stopPrevent = preventLinkNavigation();
    render(<MobileMenu />);
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));

    await user.click(screen.getByRole('link', { name: 'Services' }));
    stopPrevent();

    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).toBeNull();
    expect(getTrigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('closes when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileMenu />);
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));

    const backdrop = screen
      .getAllByRole('button', { name: 'Close navigation', hidden: true })
      .find((button) => button !== getTrigger());
    if (!backdrop) throw new Error('Backdrop not found');
    await user.click(backdrop);

    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).toBeNull();
    expect(getTrigger().getAttribute('aria-expanded')).toBe('false');
  });
});
