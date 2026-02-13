import { Container } from "@/components/site/Container";
import Link from "next/link";
import { ArrowRight, Atom, FileText } from "lucide-react";
import { getRecentContent } from "@/lib/mdx";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SpacetimeGrid } from "@/components/SpacetimeGrid";
import { semanticClasses } from "@/theme/tokens";

export default async function HomePage() {
  const recentContent = await getRecentContent();

  return (
    <Container className="space-y-14">
      <section className="relative overflow-hidden rounded-card border border-border bg-surface px-6 py-12 shadow-soft sm:px-10 sm:py-14">
        <SpacetimeGrid />
        <div className="relative space-y-6">
          <p className={semanticClasses.sectionMarker}>
            <Atom className="h-4 w-4 text-accent" />
            Academic Physics Research
          </p>
          <h1 className="max-w-3xl">
            Precision Notes on Physics, Geometry, and Learning Systems
          </h1>
          <p className="max-w-2xl text-muted">
            A focused archive of ongoing research, formal notes, and long-form essays on symmetry,
            field theories, and machine intelligence.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/research">
              Research Focus <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/paper" variant="outline">
              Current Paper
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className={semanticClasses.sectionMarker}>
          <FileText className="h-4 w-4 text-accent" />
          Latest Publications
        </h2>
        <div className="space-y-4">
          {recentContent.map((item) => (
            <Card key={item.slug} className="p-5 transition-colors hover:border-accent/55">
              <Link href={`/${item.type}/${item.slug}`} className="block space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {item.type === "research" ? "Research Paper" : "Research Note"}
                  </p>
                  <time className="text-sm text-muted">
                    {format(new Date(item.date), "MMMM d, yyyy")}
                  </time>
                </div>
                <h3 className="text-xl leading-tight">{item.title}</h3>
                <p className="text-sm text-muted">{item.summary}</p>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
