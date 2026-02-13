import { Container } from "@/components/site/Container";
import { getAllContent, getContentBySlug } from "@/lib/mdx";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const notes = await getAllContent("notes");
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getContentBySlug("notes", slug);

  if (!note) {
    return {
      title: "Note Not Found",
      description: "The requested research note could not be found.",
    };
  }

  return {
    title: note.meta.title,
    description: note.meta.description || note.meta.summary,
  };
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = await getContentBySlug("notes", slug);

  if (!note) {
    notFound();
  }

  const { meta, content } = note;

  return (
    <Container className="space-y-8">
      <Link href="/notes" className="inline-flex items-center gap-2 text-sm text-muted">
        <ArrowLeft className="h-4 w-4" />
        Back to Notes
      </Link>

      <article className="space-y-8">
        <header className="space-y-4 border-b border-border pb-8">
          <p className={semanticClasses.sectionMarker}>
            <FileText className="h-4 w-4 text-accent" />
            Research Note
          </p>
          <h1>{meta.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <time>{format(new Date(meta.date), "MMMM d, yyyy")}</time>
            <span aria-hidden="true">•</span>
            <span>{meta.readingTime || "5 min read"}</span>
          </div>
          {meta.tags && (
            <div className="flex flex-wrap gap-2">
              {meta.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose-lab">{content}</div>
      </article>

      <p className="border-t border-border pt-6 text-sm italic text-muted">End of note.</p>
    </Container>
  );
}
