import Link from "next/link";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { listPublicPages } from "@/lib/content";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function LabEditorPagesIndexPage() {
  const pages = await listPublicPages();

  return (
    <Container className="space-y-7 py-12">
      <header className="space-y-2">
        <h1>Page Entries</h1>
        <p className="text-sm text-muted">Choose a page slug to edit public content.</p>
      </header>

      <div className="space-y-3">
        {pages.length === 0 ? (
          <Card className="p-5 text-sm text-muted">No page rows found.</Card>
        ) : null}

        {pages.map((page) => (
          <Link key={page.slug} href={`/lab/editor/pages/${page.slug}`}>
            <Card className="space-y-1 p-5 transition-colors hover:border-accent/50">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{page.slug}</p>
              <h2 className="text-2xl">{page.title || "Untitled page"}</h2>
              <p className="text-xs text-muted">
                Updated {format(new Date(page.updated_at), "MMMM d, yyyy HH:mm")}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
