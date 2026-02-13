import { Container } from "@/components/site/Container";
import { getAllContent, getContentBySlug } from "@/lib/mdx";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Sigma } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { semanticClasses } from "@/theme/tokens";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const research = await getAllContent("research");
  return research.map((item) => ({
    slug: item.slug,
  }));
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getContentBySlug("research", slug);

  if (!post) {
    notFound();
  }

  const { meta, content } = post;
  const abstract = meta.abstract || meta.summary;
  const pdfUrl = meta.pdfUrl || "/papers/placeholder-paper.pdf";

  return (
    <Container className="space-y-8">
      <Link href="/research" className="inline-flex items-center gap-2 text-sm text-muted">
        <ArrowLeft className="h-4 w-4" />
        Back to Research
      </Link>

      <article className="space-y-8">
        <header className="space-y-4 border-b border-border pb-8">
          <p className={semanticClasses.sectionMarker}>
            <FileText className="h-4 w-4 text-accent" />
            Research Paper
          </p>
          <h1>{meta.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <time>{format(new Date(meta.date), "MMMM d, yyyy")}</time>
            <span aria-hidden="true">•</span>
            <span>{meta.readingTime || "10 min read"}</span>
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

        <Card muted className="space-y-3 p-6">
          <p className={semanticClasses.sectionMarker}>
            <Sigma className="h-4 w-4 text-accent" />
            Abstract
          </p>
          <p className="text-sm text-muted">{abstract}</p>
        </Card>

        <section className="space-y-3">
          <p className={semanticClasses.sectionMarker}>
            <FileText className="h-4 w-4 text-accent" />
            PDF
          </p>
          <div className="overflow-hidden rounded-card border border-border bg-surface shadow-soft">
            <iframe
              src={pdfUrl}
              title={`${meta.title} PDF`}
              className="h-[60vh] min-h-[26rem] w-full"
            />
          </div>
        </section>

        <div className="prose-lab">{content}</div>
      </article>

      <p className="border-t border-border pt-6 text-sm italic text-muted">End of paper.</p>
    </Container>
  );
}
