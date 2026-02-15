import { Container } from "@/components/site/Container";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { PublicationCard } from "@/components/content/PublicationCard";
import { MdxRenderer } from "@/components/content/MdxRenderer";
import { getPublicHrefForPost } from "@/lib/content-routing";
import { getPublicPage, listLatestPublicPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const [page, posts] = await Promise.all([
    getPublicPage("posts"),
    listLatestPublicPosts({ limit: 100 }),
  ]);

  return (
    <section className="lab-section reveal-section">
      <Container className="space-y-8">
        <header className="space-y-3">
          <p className={semanticClasses.sectionMarker}>
            <FileText className="h-4 w-4 text-accent2" />
            Published Posts
          </p>
          <h1>{page?.title || "Posts"}</h1>
          {page ? (
            <MdxRenderer content={page.content_mdx} className="text-muted [&_p:first-child]:mt-0" />
          ) : (
            <p className="text-muted">Public notes and papers, rendered with LaTeX support.</p>
          )}
        </header>
        {!page ? <Card className="p-5 text-sm text-muted">Draft not created for <code>posts</code> in <code>public_pages</code>.</Card> : null}

        <div className="space-y-5">
          {posts.length === 0 ? (
            <Card className="p-5 text-sm text-muted">No published posts yet.</Card>
          ) : null}
          {posts.map((post) => (
            <PublicationCard
              key={post.slug}
              href={getPublicHrefForPost(post)}
              typeLabel={
                post.type === "paper"
                  ? "Research Paper"
                  : post.type === "note"
                  ? "Research Note"
                  : "Post"
              }
              title={post.title}
              summary={post.excerpt || "Technical note from the writing lab."}
              dateLabel={format(new Date(post.published_at ?? post.updated_at), "MMMM d, yyyy")}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
