import { Container } from "@/components/site/Container";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";
import { Button } from "@/components/ui/Button";
import { PublicationCard } from "@/components/content/PublicationCard";
import { DraftNotCreated } from "@/components/content/DraftNotCreated";
import { MdxRenderer } from "@/components/content/MdxRenderer";
import { getPublicPage, listLatestPublicPosts } from "@/lib/content";
import { getPublicHrefForPost } from "@/lib/content-routing";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const [page, notes] = await Promise.all([
    getPublicPage("notes"),
    listLatestPublicPosts({ type: "note", limit: 50 }),
  ]);

  return (
    <section className="lab-section reveal-section">
      <Container className="space-y-8">
        <header className="space-y-3">
          <p className={semanticClasses.sectionMarker}>
            <FileText className="h-4 w-4 text-accent2" />
            Working Notes
          </p>
          <h1>{page?.title || "Research Notes"}</h1>
          {page ? (
            <MdxRenderer content={page.content_mdx} className="text-muted [&_p:first-child]:mt-0" />
          ) : (
            <p className="text-muted">Compact derivations, references, and conceptual summaries.</p>
          )}
        </header>
        {!page ? <DraftNotCreated slug="notes" tableName="public_pages" /> : null}

        <div className="space-y-5">
          {notes.map((note) => (
            <PublicationCard
              key={note.slug}
              href={getPublicHrefForPost(note)}
              typeLabel="Research Note"
              title={note.title}
              summary={note.excerpt || "Research note from the writing lab."}
              dateLabel={format(new Date(note.published_at ?? note.updated_at), "MMMM d, yyyy")}
            />
          ))}
          {notes.length === 0 ? <DraftNotCreated slug="notes" tableName="public_posts" /> : null}
        </div>

        <div className="border-t border-border pt-6">
          <Button href="/reading" variant="outline">
            Continue to reading list →
          </Button>
        </div>
      </Container>
    </section>
  );
}
