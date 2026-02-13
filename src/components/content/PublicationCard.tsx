import Link from "next/link";
import { cn } from "@/lib/utils";

interface PublicationCardProps {
  href: string;
  typeLabel: string;
  title: string;
  summary: string;
  dateLabel: string;
  className?: string;
  tags?: string[];
}

export function PublicationCard({
  href,
  typeLabel,
  title,
  summary,
  dateLabel,
  className,
  tags,
}: PublicationCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-card border border-border bg-surface shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-border/90 hover:shadow-[0_14px_28px_-20px_rgba(15,23,42,0.3)]",
        className
      )}
    >
      <div className="absolute left-0 top-0 h-full w-[3px] bg-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <Link href={href} className="block space-y-4 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            {typeLabel}
          </p>
          <time className="text-xs font-medium uppercase tracking-[0.12em] text-muted/95">
            {dateLabel}
          </time>
        </div>
        <h3 className="text-[1.55rem] leading-tight text-text transition-colors group-hover:text-accent">
          {title}
        </h3>
        <p className="text-[0.96rem] leading-relaxed text-muted">{summary}</p>
        {tags?.length ? (
          <div className="flex flex-wrap gap-2 text-xs text-muted">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border px-2.5 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </Link>
    </article>
  );
}
