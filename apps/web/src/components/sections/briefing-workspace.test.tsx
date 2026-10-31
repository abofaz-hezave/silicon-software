import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { BriefingWorkspace } from './briefing-workspace';

describe('BriefingWorkspace', () => {
  it('renders each field as a term and value and marks the missing field as asked in chat', () => {
    const html = renderToStaticMarkup(
      <BriefingWorkspace
        fields={[
          { label: 'Project', value: 'Autumn campaign launch' },
          { label: 'Audience', value: 'Returning customers' },
        ]}
        missingField="Budget"
        conversation={[]}
      />,
    );

    expect(html).toContain('>Project</dt>');
    expect(html).toContain('>Autumn campaign launch</dd>');
    expect(html).toContain('>Audience</dt>');
    expect(html).toContain('>Returning customers</dd>');
    expect(html).toContain('>Budget</dt>');
    expect(html).toContain('Missing — asked in chat');
    expect(html).toContain('2 of 3 captured');
  });

  it('renders each chat message with its speaker label', () => {
    const html = renderToStaticMarkup(
      <BriefingWorkspace
        fields={[]}
        missingField="Budget"
        conversation={[
          { speaker: 'assistant', text: 'What is this brief for?' },
          { speaker: 'team', text: 'Autumn campaign launch.' },
        ]}
      />,
    );

    expect(html).toContain('Assistant');
    expect(html).toContain('What is this brief for?');
    expect(html).toContain('Your team');
    expect(html).toContain('Autumn campaign launch.');
  });
});
