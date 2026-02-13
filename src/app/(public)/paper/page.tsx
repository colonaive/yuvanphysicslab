import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { FileText, Sigma } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";

const sectionOutline = [
  "Introduction",
  "Time",
  "Coordinate Time",
  "Proper Time",
  "Global Time Functions",
  "Energy Conditions",
];

export default function FeaturedPaperPage() {
  return (
    <Container className="space-y-8">
      <header className="space-y-3 border-b border-border pb-8">
        <p className={semanticClasses.sectionMarker}>
          <FileText className="h-4 w-4 text-accent" />
          Featured Paper
        </p>
        <h1>Investigating Spacetimes with Closed Timelike Curves</h1>
        <p className="text-sm text-muted">
          Yuvan Raam Chandra • December 2023
        </p>
      </header>

      <Card muted className="space-y-3 p-6">
        <p className={semanticClasses.sectionMarker}>
          <Sigma className="h-4 w-4 text-accent" />
          Abstract
        </p>
        <p className="text-sm text-muted">
          This work examines the structure of spacetimes admitting closed timelike
          curves, with emphasis on temporal ordering, causal pathologies, and the
          role played by energy conditions in constraining physically admissible
          geometries.
        </p>
      </Card>

      <Card className="space-y-4 p-6">
        <p className={semanticClasses.sectionMarker}>Section Outline</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
          {sectionOutline.map((section) => (
            <li key={section}>{section}</li>
          ))}
        </ul>
      </Card>

      <section className="space-y-3">
        <p className={semanticClasses.sectionMarker}>
          <FileText className="h-4 w-4 text-accent" />
          PDF
        </p>
        <div className="overflow-hidden rounded-card border border-border bg-surface shadow-soft">
          <iframe
            src="/papers/ctc-paper.pdf"
            title="Investigating Spacetimes with Closed Timelike Curves"
            className="h-[70vh] min-h-[30rem] w-full"
          />
        </div>
      </section>
    </Container>
  );
}
