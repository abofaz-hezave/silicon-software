type BentoGridProps = Readonly<{
  codePrefix: string;
  items: readonly { title: string; description: string }[];
  spans: readonly string[];
  className: string;
}>;

type BentoTileProps = Readonly<{
  code: string;
  title: string;
  description: string;
  className: string;
}>;

function BentoTile({ code, title, description, className }: BentoTileProps) {
  return (
    <article className={`bg-card flex flex-col rounded-xl border p-5 ${className}`}>
      <p className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider">{code}</p>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm leading-6">{description}</p>
    </article>
  );
}

function BentoGrid({ codePrefix, items, spans, className }: BentoGridProps) {
  return (
    <div className={`mt-12 grid gap-3 ${className}`}>
      {items.map((item, index) => (
        <BentoTile
          key={item.title}
          code={`${codePrefix}-${String(index + 1).padStart(2, '0')}`}
          title={item.title}
          description={item.description}
          className={spans[index] ?? ''}
        />
      ))}
    </div>
  );
}

export { BentoGrid };
