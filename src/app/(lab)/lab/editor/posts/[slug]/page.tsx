import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { getPublicPost } from "@/lib/content";
import { PostEditorPane } from "@/components/lab/editor/PostEditorPane";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LabEditorPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublicPost(slug, { includeUnpublished: true });

  if (!post) {
    return (
      <Container className="py-12">
        <Card className="space-y-2 p-6">
          <h1 className="text-2xl">Draft not created</h1>
          <p className="text-sm text-muted">
            No <code>public_posts</code> row exists for slug <code>{slug}</code> yet.
          </p>
          <p className="text-sm text-muted">
            Save once from this editor to create it instantly.
          </p>
        </Card>
        <div className="mt-6">
          <PostEditorPane
            slug={slug}
            type="note"
            title=""
            excerpt=""
            content=""
            published
            publishedAt={null}
            updatedAt={null}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <PostEditorPane
        slug={post.slug}
        type={post.type}
        title={post.title}
        excerpt={post.excerpt}
        content={post.content_mdx}
        published={post.published}
        publishedAt={post.published_at}
        updatedAt={post.updated_at}
      />
    </Container>
  );
}
