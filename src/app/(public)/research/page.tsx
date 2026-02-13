import { Container } from "@/components/site/Container";
import { getAllContent } from "@/lib/mdx";
import Link from "next/link";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { semanticClasses } from "@/theme/tokens";

export default async function ResearchPage() {
  const research = await getAllContent("research");

  return (
    <Container className="space-y-8">
      <header className="space-y-3">
        <p className={semanticClasses.sectionMarker}>
          <FileText className="h-4 w-4 text-accent" />
          Journal Archive
        </p>
        <h1>Research Papers</h1>
        <p className="text-muted">Long-form investigations, formal problems, and active project reports.</p>
      </header>

      <div className="space-y-4">
        {research.map((item) => (
          <Card key={item.slug} className="p-5 transition-colors hover:border-accent/55">
            <Link href={`/research/${item.slug}`} className="block space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-2xl leading-tight">{item.title}</h2>
                <time className="text-sm text-muted">{format(new Date(item.date), "MMMM d, yyyy")}</time>
              </div>
              <p className="text-muted">{item.summary}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                {item.tags?.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-2.5 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </Card>
        ))}

        {research.length === 0 && <p className="italic text-muted">No research papers yet.</p>}
      </div>
    </Container>
  );
}
