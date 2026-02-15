import { Container } from "@/components/site/Container";
import { getPublicPost } from "@/lib/content";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";
import type { Metadata } from "next";
import { SmartBackButton } from "@/components/site/SmartBackButton";
import { MdxRenderer } from "@/components/content/MdxRenderer";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPost(slug, { type: "post" });

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: post.title,
    description:
      post.excerpt || "Published research note from Yuvan Physics Lab.",
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublicPost(slug, { type: "post" });

  if (!post) {
    notFound();
  }

  return (
    <Container className="space-y-8">
      <SmartBackButton fallbackHref="/posts" label="Back to Research Notes" />

      <article className="space-y-8">
        <header className="space-y-4 border-b border-border pb-8">
          <p className={semanticClasses.sectionMarker}>
            <FileText className="h-4 w-4 text-accent" />
            Post
          </p>
          <h1>{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <time>
              {format(
                new Date(post.published_at ?? post.updated_at),
                "MMMM d, yyyy"
              )}
            </time>
            <span aria-hidden="true">•</span>
            <span>{Math.max(1, Math.round(post.content_mdx.split(/\s+/).length / 220))} min read</span>
          </div>
          {post.excerpt ? <p className="text-sm text-muted">{post.excerpt}</p> : null}
        </header>

        <MdxRenderer content={post.content_mdx} />
      </article>
    </Container>
  );
}
