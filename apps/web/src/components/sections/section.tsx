import type { ReactNode } from 'react';

import { Tag } from './tag';

interface SectionProps {
  id: string;
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  tone?: 'default' | 'muted';
  children: ReactNode;
}

function Section({ id, eyebrow, title, intro, tone, children }: SectionProps) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={tone === 'muted' ? 'bg-muted/40 border-t py-20' : 'border-t py-20'}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <Tag>{eyebrow}</Tag>
          <h2
            id={`${id}-heading`}
            className="font-display mt-4 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl"
          >
            {title}
          </h2>
          {intro}
        </div>
        {children}
      </div>
    </section>
  );
}

export { Section };
