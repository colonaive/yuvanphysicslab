import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/site/Container";
import { semanticClasses } from "@/theme/tokens";
import { MdxRenderer } from "@/components/content/MdxRenderer";
import { getPublicPost } from "@/lib/content";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getPublicPost(slug, { type: "note" });

  if (!note) {
    return {
      title: "Note Not Found",
      description: "The requested research note could not be found.",
    };
  }

  return {
    title: note.title,
    description: note.excerpt || "Published research note from Yuvan Physics Lab.",
  };
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = await getPublicPost(slug, { type: "note" });

  if (!note) {
    notFound();
  }

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
          <h1>{note.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <time>{format(new Date(note.published_at ?? note.updated_at), "MMMM d, yyyy")}</time>
            <span aria-hidden="true">•</span>
            <span>{Math.max(1, Math.round(note.content_mdx.split(/\s+/).length / 220))} min read</span>
          </div>
          {note.excerpt ? <p className="text-sm text-muted">{note.excerpt}</p> : null}
        </header>

        <MdxRenderer content={note.content_mdx} />
      </article>

      <p className="border-t border-border pt-6 text-sm italic text-muted">End of note.</p>
    </Container>
  );
}
