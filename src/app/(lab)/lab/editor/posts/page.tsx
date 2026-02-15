import Link from "next/link";
import { format } from "date-fns";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { listPublicPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function LabEditorPostsIndexPage() {
  const posts = await listPublicPosts({ includeUnpublished: true });

  return (
    <Container className="space-y-7 py-12">
      <header className="space-y-2">
        <h1>Post Entries</h1>
        <p className="text-sm text-muted">Choose a post slug to edit.</p>
      </header>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <Card className="p-5 text-sm text-muted">No post rows found.</Card>
        ) : null}

        {posts.map((post) => (
          <Link key={post.slug} href={`/lab/editor/posts/${post.slug}`}>
            <Card className="space-y-2 p-5 transition-colors hover:border-accent/50">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {post.type}
                </p>
                <span className="text-xs text-muted">
                  {post.published ? "Published" : "Unpublished"}
                </span>
              </div>
              <h2 className="text-2xl">{post.title}</h2>
              <p className="text-xs text-muted">
                Updated {format(new Date(post.updated_at), "MMMM d, yyyy HH:mm")}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
