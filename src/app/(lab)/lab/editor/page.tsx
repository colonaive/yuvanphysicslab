import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { FileEdit, FileText, LayoutTemplate } from "lucide-react";
import { listPublicPages, listPublicPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function LabEditorPage() {
  const [pages, posts] = await Promise.all([
    listPublicPages(),
    listPublicPosts({ includeUnpublished: true }),
  ]);

  return (
    <Container className="space-y-8 py-12">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Instant Edit CMS</p>
        <h1>Content Editor</h1>
        <p className="text-sm text-muted">
          Edit public pages and posts. Saved changes are visible immediately on the live site.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <Link href="/lab/editor/pages" className="group">
          <Card className="h-full space-y-3 p-6 transition-colors group-hover:border-accent/55">
            <LayoutTemplate className="h-6 w-6 text-accent" />
            <h2 className="text-2xl">Pages</h2>
            <p className="text-sm text-muted">{pages.length} page entries in Supabase.</p>
          </Card>
        </Link>

        <Link href="/lab/editor/posts" className="group">
          <Card className="h-full space-y-3 p-6 transition-colors group-hover:border-accent/55">
            <FileText className="h-6 w-6 text-accent2" />
            <h2 className="text-2xl">Posts</h2>
            <p className="text-sm text-muted">{posts.length} post entries in Supabase.</p>
          </Card>
        </Link>
      </div>

      <Card className="space-y-2 p-5">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-text">
          <FileEdit className="h-4 w-4 text-accent" />
          Editing flow
        </p>
        <p className="text-sm text-muted">
          Pick a page or post, edit Markdown on the left, verify live preview on the right, then save.
        </p>
      </Card>
    </Container>
  );
}
