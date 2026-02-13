import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Link from "next/link";
import { SmartBackButton } from "@/components/site/SmartBackButton";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content:
      "Closed timelike curves (CTCs) challenge classical intuitions about chronology. This paper studies how geometry permits these curves and what physical constraints may still restrict them.",
  },
  {
    id: "time",
    title: "Time",
    content:
      "We distinguish coordinate, proper, and global notions of time. In CTC-admitting spacetimes, local proper time can remain well-defined even when global temporal ordering fails.",
  },
  {
    id: "energy-conditions",
    title: "Energy Conditions",
    content:
      "We evaluate standard energy conditions and their role in constraining candidate geometries. A recurring question is whether chronology-violating regions require stress-energy configurations that are physically unstable.\n\n$$T_{\\mu\\nu}u^\\mu u^\\nu \\ge 0$$",
  },
] as const;

export default function FeaturedPaperPage() {
  const lastUpdated = "February 13, 2026";

  return (
    <Container className="space-y-7">
      <SmartBackButton fallbackHref="/" label="Back" />

      <header className="space-y-3 border-b border-border pb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Featured Preprint
        </p>
        <h1>Investigating Spacetimes with Closed Timelike Curves</h1>
        <p className="text-sm text-muted">
          Yuvan Raam Chandra • December 2023
        </p>
        <p className="text-xs text-muted">Last Updated: {lastUpdated}</p>
      </header>

      <Card className="space-y-2 p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Citation</p>
        <p className="text-sm text-text">
          Chandra, Y. R. (2023). <em>Investigating Spacetimes with Closed Timelike Curves</em>. Independent Manuscript.
        </p>
      </Card>

      <Card muted className="space-y-3 border-l-2 border-l-accent p-6 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Abstract</p>
        <p className="text-sm text-muted">
          This work examines the structure of spacetimes admitting closed timelike
          curves, with emphasis on temporal ordering, causal pathologies, and the
          role played by energy conditions in constraining physically admissible
          geometries.
        </p>
      </Card>

      <Card className="space-y-3 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Sections</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {sections.map((section) => (
            <li key={section.id} className="list-none">
              <a href={`#${section.id}`} className="text-muted">
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </Card>

      <section className="space-y-3">
        {sections.map((section) => (
          <Card key={section.id} id={section.id} className="space-y-2 p-6 md:p-7">
            <h2 className="text-2xl">{section.title}</h2>
            <div className="prose-lab">
              <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {section.content}
              </Markdown>
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">PDF</p>
          <Button href="/papers/ctc-paper.pdf" download>
            Download PDF <Download className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-hidden rounded-card border border-border bg-surface shadow-soft">
          <iframe
            src="/papers/ctc-paper.pdf"
            title="Investigating Spacetimes with Closed Timelike Curves"
            className="h-[70vh] min-h-[30rem] w-full"
          />
        </div>
      </section>

      <div className="border-t border-border pt-5 text-sm">
        <Link href="/notes" className="text-muted">
          Continue to notes →
        </Link>
      </div>
    </Container>
  );
}
