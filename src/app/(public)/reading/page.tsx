import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { semanticClasses } from "@/theme/tokens";
import { readingList } from "@/content/reading-list";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function ReadingPage() {
  return (
    <Container className="space-y-8">
      <header className="space-y-3">
        <p className={semanticClasses.sectionMarker}>
          <BookOpen className="h-4 w-4 text-accent" />
          Curated References
        </p>
        <h1>Reading List</h1>
        <p className="text-muted">
          A focused bibliography that informs current work in spacetime geometry and causality.
        </p>
      </header>

      <section className="space-y-4">
        {readingList.map((item) => (
          <Card key={item.title} className="space-y-3 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl leading-tight">
                <span className="italic">{item.title}</span>
              </h2>
              <span className="text-xs text-muted">{item.year}</span>
            </div>
            <p className="text-sm text-muted">
              {item.authors} ({item.year})
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {item.area}
            </p>
            <p className="text-sm text-muted">{item.commentary}</p>
          </Card>
        ))}
      </section>

      <div className="border-t border-border pt-5 text-sm">
        <Link href="/" className="text-muted">
          Return home →
        </Link>
      </div>
    </Container>
  );
}
