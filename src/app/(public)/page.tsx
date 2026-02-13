import { Container } from "@/components/site/Container";
import { ArrowRight } from "lucide-react";
import { getRecentContent } from "@/lib/mdx";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { semanticClasses } from "@/theme/tokens";
import { PublicationCard } from "@/components/content/PublicationCard";

export default async function HomePage() {
  const recentContent = await getRecentContent();
  const latestNote = recentContent.find((item) => item.type === "notes");
  const latestUpdate = recentContent[0];

  return (
    <div className="space-y-0">
      <section className="lab-section reveal-section">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Academic Research Notes
              </p>
              <h1 className="max-w-3xl">Precision Notes on Physics, Geometry, and Learning Systems</h1>
              <p className="max-w-2xl text-muted">
                Yuvan Physics Lab is a modern research platform for formal notes, ongoing
                investigations, and long-form analysis across gravity, symmetry, and machine
                intelligence.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href="/research">
                  Research Focus <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href={latestNote ? `/notes/${latestNote.slug}` : "/notes"} variant="outline">
                  Read latest note
                </Button>
                <Button href="/notes" variant="outline">
                  Research notes
                </Button>
              </div>
              {latestUpdate ? (
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  Last updated: {format(new Date(latestUpdate.date), "MMMM d, yyyy")}
                </p>
              ) : null}
            </div>

            <aside className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <p className={semanticClasses.sectionMarker}>Research Snapshot</p>
              <div className="mt-4 space-y-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    Current Direction
                  </p>
                  <p className="font-medium text-text">Chronology protection and causal structure.</p>
                </div>
                <div className="space-y-1 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    Latest Note
                  </p>
                  <p className="font-medium text-text">
                    {latestNote?.title ?? "Research notes are being updated."}
                  </p>
                </div>
                <div className="space-y-1 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    Active Tracks
                  </p>
                  <ul className="space-y-2 text-muted">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                      Semiclassical constraints near chronology horizons.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                      Geometric priors for reliable learning systems.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent2" />
                      Structured note synthesis for ongoing paper drafts.
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <div className="section-divider" />

      <section className="lab-section reveal-section">
        <Container>
          <div className="section-panel">
            <h2 className={semanticClasses.sectionMarker}>Currently Thinking About</h2>
            <ul className="mt-4 space-y-3 text-muted">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                Chronology-horizon instability and physical protection of global causality.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                Semiclassical-compatible averaged energy bounds in curved spacetime regimes.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent2" />
                Geometry-first inductive biases for robust, symmetry-aware learning systems.
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <div className="section-divider" />

      <section className="lab-section lab-section-alt reveal-section">
        <Container className="space-y-6">
          <h2 className={semanticClasses.sectionMarker}>Latest Publications</h2>
          <div className="space-y-4">
            {recentContent.map((item) => (
              <PublicationCard
                key={`${item.type}:${item.slug}`}
                href={`/${item.type}/${item.slug}`}
                typeLabel={item.type === "research" ? "Research Paper" : "Research Note"}
                title={item.title}
                summary={item.summary}
                dateLabel={format(new Date(item.date), "MMMM d, yyyy")}
              />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
