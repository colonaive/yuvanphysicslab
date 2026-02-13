import { Container } from "@/components/site/Container";
import { getAllContent } from "@/lib/mdx";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";
import { Button } from "@/components/ui/Button";
import { PublicationCard } from "@/components/content/PublicationCard";

export default async function NotesPage() {
  const notes = await getAllContent("notes");

  return (
    <section className="lab-section reveal-section">
      <Container className="space-y-8">
        <header className="space-y-3">
          <p className={semanticClasses.sectionMarker}>
            <FileText className="h-4 w-4 text-accent2" />
            Working Notes
          </p>
          <h1>Research Notes</h1>
          <p className="text-muted">Compact derivations, references, and conceptual summaries.</p>
        </header>

        <div className="space-y-5">
          {notes.map((note) => (
            <PublicationCard
              key={note.slug}
              href={`/notes/${note.slug}`}
              typeLabel="Research Note"
              title={note.title}
              summary={note.summary}
              dateLabel={format(new Date(note.date), "MMMM d, yyyy")}
              tags={note.tags}
            />
          ))}
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
