import { format } from "date-fns";
import Link from "next/link";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { semanticClasses } from "@/theme/tokens";
import { DraftNotCreated } from "@/components/content/DraftNotCreated";
import { MdxRenderer } from "@/components/content/MdxRenderer";
import { getPublicHrefForPost } from "@/lib/content-routing";
import { getPublicPage, listLatestPublicPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const [page, recentNotes, recentPapers] = await Promise.all([
    getPublicPage("research"),
    listLatestPublicPosts({ limit: 3, type: "note" }),
    listLatestPublicPosts({ limit: 3, type: "paper" }),
  ]);

  const featuredPaper = recentPapers[0] ?? null;

  return (
    <div className="space-y-0">
      <section className="lab-section reveal-section">
        <Container className="space-y-10">
          <header className="space-y-4 border-b border-border/70 pb-8">
            <p className={semanticClasses.sectionMarker}>Research Program</p>
            <h1 className="max-w-4xl">{page?.title || "Research Focus"}</h1>
            <span className="block h-1 w-36 rounded-full bg-gradient-to-r from-accent to-accent2" />
            {page ? (
              <MdxRenderer content={page.content_mdx} className="max-w-3xl text-muted [&_p:first-child]:mt-0" />
            ) : (
              <DraftNotCreated slug="research" tableName="public_pages" />
            )}
          </header>

          <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-8">
              <section className="space-y-4">
                <h2>Current Work</h2>
                {featuredPaper ? (
                  <Card className="space-y-4 p-6 md:p-7">
                    <h3>{featuredPaper.title}</h3>
                    <p className="text-sm text-muted">
                      {featuredPaper.excerpt || "Featured paper from the active research stream."}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button href={getPublicHrefForPost(featuredPaper)}>Read Paper</Button>
                      <Button href="/notes" variant="outline">
                        View Notes
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <DraftNotCreated slug="research-paper" tableName="public_posts" />
                )}
              </section>

              <div className="section-divider" />

              <section className="space-y-4">
                <h2>Collaboration</h2>
                <Card className="space-y-4 p-6 md:p-7">
                  <p className="text-sm text-muted">
                    Open to thoughtful collaboration on causality, gravity, and robust learning
                    systems. Use contact for research discussions.
                  </p>
                  <Button href="/contact" variant="outline">
                    Contact
                  </Button>
                </Card>
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <Card className="space-y-3 p-5">
                <h3 className="text-xl">Research Themes</h3>
                <ul className="space-y-2 text-sm text-muted">
                  <li className="rounded-md border border-border/70 bg-surface2/55 px-3 py-2">
                    Chronology protection and causal structure
                  </li>
                  <li className="rounded-md border border-border/70 bg-surface2/55 px-3 py-2">
                    Semiclassical gravity constraints
                  </li>
                  <li className="rounded-md border border-border/70 bg-surface2/55 px-3 py-2">
                    Geometry-aware machine learning
                  </li>
                </ul>
              </Card>

              <Card className="space-y-3 p-5">
                <h3 className="text-xl">Recent Notes</h3>
                <div className="space-y-3">
                  {recentNotes.map((note) => (
                    <Link
                      key={note.slug}
                      href={getPublicHrefForPost(note)}
                      className="block rounded-md border border-border/70 bg-surface2/55 px-3 py-2.5 transition-colors hover:border-accent/50 hover:text-accent2"
                    >
                      <p className="text-sm font-medium text-text">{note.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">
                        {format(new Date(note.published_at ?? note.updated_at), "MMM d, yyyy")}
                      </p>
                    </Link>
                  ))}
                  {recentNotes.length === 0 ? (
                    <p className="text-xs text-muted">No published notes yet.</p>
                  ) : null}
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
