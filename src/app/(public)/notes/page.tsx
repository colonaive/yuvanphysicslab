import { Container } from "@/components/site/Container";
import { getAllContent } from "@/lib/mdx";
import Link from "next/link";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { semanticClasses } from "@/theme/tokens";
import { Button } from "@/components/ui/Button";

export default async function NotesPage() {
  const notes = await getAllContent("notes");

  return (
    <Container className="space-y-8">
      <header className="space-y-3">
        <p className={semanticClasses.sectionMarker}>
          <FileText className="h-4 w-4 text-accent" />
          Working Notes
        </p>
        <h1>Research Notes</h1>
        <p className="text-muted">Compact derivations, references, and conceptual summaries.</p>
      </header>

      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.slug} className="p-5 transition-colors hover:border-accent/55">
            <Link href={`/notes/${note.slug}`} className="block space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-2xl leading-tight">{note.title}</h2>
                <time className="text-sm text-muted">{format(new Date(note.date), "MMMM d, yyyy")}</time>
              </div>
              <p className="text-muted">{note.summary}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                {note.tags?.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-2.5 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </Card>
        ))}
      </div>

      <div className="border-t border-border pt-5">
        <Button href="/reading" variant="outline">
          Continue to reading list →
        </Button>
      </div>
    </Container>
  );
}
