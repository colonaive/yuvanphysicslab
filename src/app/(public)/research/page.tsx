import { Container } from "@/components/site/Container";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { researchFocus } from "@/content/research-focus";
import { getAllContent } from "@/lib/mdx";
import { format } from "date-fns";
import { semanticClasses } from "@/theme/tokens";

export default async function ResearchPage() {
  const notes = await getAllContent("notes");
  const recentNotes = notes.slice(0, 3);
  const tags = [...new Set(notes.flatMap((note) => note.tags || []))].slice(0, 12);

  return (
    <div className="space-y-0">
      <section className="lab-section reveal-section">
        <Container className="space-y-10">
          <header className="space-y-4 border-b border-border/70 pb-8">
            <p className={semanticClasses.sectionMarker}>Research Program</p>
            <h1 className="max-w-4xl">Research Focus</h1>
            <span className="block h-1 w-36 rounded-full bg-gradient-to-r from-accent to-accent2" />
            <p className="max-w-3xl text-muted">{researchFocus.focus}</p>
          </header>

          <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-8">
              <section className="space-y-4">
                <h2>Core Questions I Am Exploring</h2>
                <Card className="p-6 md:p-7">
                  <ul className="list-disc space-y-2 pl-5 text-sm text-muted marker:text-accent2">
                    {researchFocus.coreQuestions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                </Card>
              </section>

              <div className="section-divider" />

              <section className="space-y-4">
                <h2>Current Work</h2>
                <Card className="space-y-4 p-6 md:p-7">
                  <h3>{researchFocus.currentPaper.title}</h3>
                  <p className="text-sm text-muted">{researchFocus.currentPaper.summary}</p>
                  <div className="flex flex-wrap gap-3">
                    <Button href={researchFocus.currentPaper.href}>Read Paper</Button>
                    <Button href="/notes" variant="outline">
                      View Notes
                    </Button>
                  </div>
                </Card>
              </section>

              <div className="section-divider" />

              <section className="space-y-4">
                <h2>Collaboration</h2>
                <Card className="space-y-4 p-6 md:p-7">
                  <p className="text-sm text-muted">{researchFocus.collaboration.message}</p>
                  <Button href={researchFocus.collaboration.contactHref} variant="outline">
                    Contact
                  </Button>
                </Card>
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <Card className="space-y-3 p-5">
                <h3 className="text-xl">Research Themes</h3>
                <ul className="space-y-2 text-sm text-muted">
                  {researchFocus.interests.map((theme) => (
                    <li key={theme} className="rounded-md border border-border/70 bg-surface2/55 px-3 py-2">
                      {theme}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="space-y-3 p-5">
                <h3 className="text-xl">Recent Notes</h3>
                <div className="space-y-3">
                  {recentNotes.map((note) => (
                    <Link
                      key={note.slug}
                      href={`/notes/${note.slug}`}
                      className="block rounded-md border border-border/70 bg-surface2/55 px-3 py-2.5 transition-colors hover:border-accent/50 hover:text-accent2"
                    >
                      <p className="text-sm font-medium text-text">{note.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">
                        {format(new Date(note.date), "MMM d, yyyy")}
                      </p>
                    </Link>
                  ))}
                </div>
              </Card>

              <Card className="space-y-3 p-5">
                <h3 className="text-xl">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/80 bg-surface2/65 px-2.5 py-1 text-xs text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </aside>
          </div>

          <div className="border-t border-border pt-6 text-sm">
            <Link href="/paper" className="text-muted hover:text-accent2">
              Continue to current paper →
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
