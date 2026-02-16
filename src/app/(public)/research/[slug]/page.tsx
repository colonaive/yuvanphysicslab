import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Sigma } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { semanticClasses } from "@/theme/tokens";
import { MdxRenderer } from "@/components/content/MdxRenderer";
import { getPublicPost } from "@/lib/content";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPost(slug, { type: "paper" });

  if (!post) {
    return {
      title: "Research Paper Not Found",
      description: "The requested research page could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || "Research paper from YRC Physics Lab.",
  };
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublicPost(slug, { type: "paper" });

  if (!post) {
    notFound();
  }

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
          <h1>{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <time>{format(new Date(post.published_at ?? post.updated_at), "MMMM d, yyyy")}</time>
            <span aria-hidden="true">•</span>
            <span>{Math.max(1, Math.round(post.content_mdx.split(/\s+/).length / 220))} min read</span>
          </div>
        </header>

        {post.excerpt ? (
          <Card muted className="space-y-3 p-6">
            <p className={semanticClasses.sectionMarker}>
              <Sigma className="h-4 w-4 text-accent" />
              Abstract
            </p>
            <p className="text-sm text-muted">{post.excerpt}</p>
          </Card>
        ) : null}

        <MdxRenderer content={post.content_mdx} />
      </article>

      <p className="border-t border-border pt-6 text-sm italic text-muted">End of paper.</p>
    </Container>
  );
}
