type BentoTileProps = Readonly<{
  code: string;
  title: string;
  description: string;
  className?: string;
}>;

function BentoTile({ code, title, description, className }: BentoTileProps) {
  return (
    <article className={`bg-card flex flex-col rounded-xl border p-5 ${className ?? ''}`}>
      <p className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider">{code}</p>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm leading-6">{description}</p>
    </article>
  );
}

export { BentoTile };
