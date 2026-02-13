import { Container } from "@/components/site/Container";
import { getPublishedPosts } from "@/lib/posts";
import { format } from "date-fns";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { semanticClasses } from "@/theme/tokens";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await getPublishedPosts();

  return (
    <Container className="space-y-8">
      <header className="space-y-3">
        <p className={semanticClasses.sectionMarker}>
          <FileText className="h-4 w-4 text-accent" />
          Published Posts
        </p>
        <h1>Posts</h1>
        <p className="text-muted">
          Public notes and papers, rendered with LaTeX support.
        </p>
      </header>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="p-5 text-sm text-muted">No published posts yet.</Card>
        ) : null}
        {posts.map((post) => (
          <Card key={post.id} className="p-5 transition-colors hover:border-accent/55">
            <Link href={`/posts/${post.slug}`} className="block space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Research Note
                </p>
                <time className="text-sm text-muted">
                  {format(
                    new Date(post.published_at ?? post.updated_at),
                    "MMMM d, yyyy"
                  )}
                </time>
              </div>
              <h2 className="text-2xl leading-tight">{post.title}</h2>
              <p className="text-sm text-muted">
                {post.excerpt || "Technical note from the writing lab."}
              </p>
            </Link>
          </Card>
        ))}
      </div>
    </Container>
  );
}
