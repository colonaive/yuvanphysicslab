import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { getPublicPage } from "@/lib/content";
import { PageEditorPane } from "@/components/lab/editor/PageEditorPane";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getPublicHrefForPageSlug(slug: string) {
  const map: Record<string, string> = {
    home: "/",
    research: "/research",
    reading: "/reading",
    paper: "/paper",
    about: "/about",
    contact: "/contact",
    notes: "/notes",
    posts: "/posts",
  };
  return map[slug] ?? "/";
}

export default async function LabEditorPageDetail({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPublicPage(slug);

  if (!page) {
    return (
      <Container className="py-12">
        <Card className="space-y-2 p-6">
          <h1 className="text-2xl">Draft not created</h1>
          <p className="text-sm text-muted">
            No <code>public_pages</code> row exists for slug <code>{slug}</code> yet.
          </p>
          <p className="text-sm text-muted">
            Save from this editor to create it instantly.
          </p>
        </Card>
        <div className="mt-6">
          <PageEditorPane
            slug={slug}
            title=""
            content=""
            updatedAt={null}
            publicHref={getPublicHrefForPageSlug(slug)}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <PageEditorPane
        slug={slug}
        title={page.title}
        content={page.content_mdx}
        updatedAt={page.updated_at}
        publicHref={getPublicHrefForPageSlug(slug)}
      />
    </Container>
  );
}
