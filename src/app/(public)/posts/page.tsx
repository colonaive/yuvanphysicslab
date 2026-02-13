import { Container } from "@/components/site/Container";
import { getPublishedPosts } from "@/lib/posts";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { PublicationCard } from "@/components/content/PublicationCard";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="lab-section reveal-section">
      <Container className="space-y-8">
        <header className="space-y-3">
          <p className={semanticClasses.sectionMarker}>
            <FileText className="h-4 w-4 text-accent2" />
            Published Posts
          </p>
          <h1>Posts</h1>
          <p className="text-muted">Public notes and papers, rendered with LaTeX support.</p>
        </header>

        <div className="space-y-5">
          {posts.length === 0 ? (
            <Card className="p-5 text-sm text-muted">No published posts yet.</Card>
          ) : null}
          {posts.map((post) => (
            <PublicationCard
              key={post.id}
              href={`/posts/${post.slug}`}
              typeLabel="Research Note"
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
