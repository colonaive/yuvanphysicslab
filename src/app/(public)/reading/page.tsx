import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { semanticClasses } from "@/theme/tokens";
import { SmartBackButton } from "@/components/site/SmartBackButton";
import { DraftNotCreated } from "@/components/content/DraftNotCreated";
import { MdxRenderer } from "@/components/content/MdxRenderer";
import { getPublicPage } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ReadingPage() {
  const page = await getPublicPage("reading");

  return (
    <Container className="space-y-8">
      <SmartBackButton fallbackHref="/" label="Back" />

      <header className="space-y-3">
        <p className={semanticClasses.sectionMarker}>
          <BookOpen className="h-4 w-4 text-accent" />
          Curated References
        </p>
        <h1>{page?.title || "Reading List"}</h1>
        <p className="text-muted">
          A focused bibliography that informs current work in spacetime geometry and causality.
        </p>
      </header>

      <section className="space-y-4">
        {page ? (
          <Card className="p-6">
            <MdxRenderer content={page.content_mdx} />
          </Card>
        ) : (
          <DraftNotCreated slug="reading" tableName="public_pages" />
        )}
      </section>

      <div className="border-t border-border pt-5 text-sm">
        <Link href="/" className="text-muted">
          Return home →
        </Link>
      </div>
    </Container>
  );
}
