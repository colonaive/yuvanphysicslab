import { Container } from "@/components/site/Container";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, FileText } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { meta, content } = post;

  return (
    <Container className="space-y-8">
      <Link href="/posts" className="inline-flex items-center gap-2 text-sm text-muted">
        <ArrowLeft className="h-4 w-4" />
        Back to Posts
      </Link>

      <article className="space-y-8">
        <header className="space-y-4 border-b border-border pb-8">
          <p className={semanticClasses.sectionMarker}>
            <FileText className="h-4 w-4 text-accent" />
            {meta.type === "research" ? "Research Paper" : "Research Note"}
          </p>
          <h1>{meta.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <time>{format(new Date(meta.date), "MMMM d, yyyy")}</time>
            <span aria-hidden="true">•</span>
            <span>{meta.readingTime || "7 min read"}</span>
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
    </Container>
  );
}
