import type { BriefingPreview, PreviewMessage } from '@/content/products';

import { Tag } from './tag';

const speakerLabels = {
  assistant: 'Assistant',
  team: 'Your team',
} as const;

type BriefingWorkspaceProps = Readonly<{
  preview: BriefingPreview;
}>;

type ChatMessageProps = Readonly<{
  message: PreviewMessage;
}>;

function ChatMessage({ message }: ChatMessageProps) {
  const isTeam = message.speaker === 'team';

  return (
    <div className={`flex ${isTeam ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-5 ${
          isTeam ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground border'
        }`}
      >
        <p className="mb-1 font-mono text-[10px] uppercase tracking-wider opacity-60">
          {speakerLabels[message.speaker]}
        </p>
        {message.text}
      </div>
    </div>
  );
}

function BriefingWorkspace({ preview }: BriefingWorkspaceProps) {
  const { fields, missingField, conversation } = preview;
  const captured = `${String(fields.length)} of ${String(fields.length + 1)} captured`;

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-2xl">
      <div className="flex items-center gap-1.5 border-b px-4 py-2.5">
        <span className="bg-muted size-2.5 rounded-full" aria-hidden="true" />
        <span className="bg-muted size-2.5 rounded-full" aria-hidden="true" />
        <span className="bg-muted size-2.5 rounded-full" aria-hidden="true" />
        <span className="text-muted-foreground ml-3 font-mono text-xs">
          briefing-assistant / sample
        </span>
      </div>
      <div className="grid md:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col gap-3 border-b p-4 md:border-b-0 md:border-r">
          {conversation.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          <div
            className="text-muted-foreground mt-auto rounded-md border px-3 py-2 text-xs"
            aria-hidden="true"
          >
            Type a reply…
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <Tag>Structured briefing</Tag>
            <span className="text-muted-foreground font-mono text-[11px]">{captured}</span>
          </div>
          <dl className="mt-4 divide-y text-sm">
            {fields.map((field) => (
              <div key={field.label} className="flex flex-col gap-1 py-3">
                <dt className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                  {field.label}
                </dt>
                <dd className="font-medium">{field.value}</dd>
              </div>
            ))}
            <div className="flex flex-col gap-1 py-3">
              <dt className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                {missingField}
              </dt>
              <dd>
                <span className="inline-flex items-center rounded border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                  Missing — asked in chat
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export { BriefingWorkspace };
