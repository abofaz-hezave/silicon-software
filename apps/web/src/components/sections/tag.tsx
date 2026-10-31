import type { ReactNode } from 'react';

type TagProps = Readonly<{
  children: ReactNode;
}>;

function Tag({ children }: TagProps) {
  return (
    <span className="text-muted-foreground inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider">
      {children}
    </span>
  );
}

export { Tag };
