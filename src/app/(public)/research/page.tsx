import { Container } from "@/components/site/Container";
import Link from "next/link";
import { FileText, Sigma } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { semanticClasses } from "@/theme/tokens";
import { researchFocus } from "@/content/research-focus";

export default function ResearchPage() {
  return (
    <Container className="space-y-8">
      <header className="space-y-3">
        <p className={semanticClasses.sectionMarker}>
          <FileText className="h-4 w-4 text-accent" />
          Research Profile
        </p>
        <h1>Research Focus</h1>
        <p className="text-muted">
          Core themes, active questions, and open problems shaping this lab&apos;s current work.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl">Research Interests</h2>
        <div className="flex flex-wrap gap-2">
          {researchFocus.interests.map((interest) => (
            <span key={interest} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
              {interest}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl">Core Questions Being Explored</h2>
        <Card className="p-6">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
            {researchFocus.coreQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl">Current Paper</h2>
        <Card className="space-y-3 p-6">
          <p className={semanticClasses.sectionMarker}>
            <Sigma className="h-4 w-4 text-accent" />
            Featured Manuscript
          </p>
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

      <section className="space-y-3">
        <h2 className="text-2xl">Open Problems</h2>
        <Card className="p-6">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
            {researchFocus.openProblems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </Card>
      </section>

      <div className="border-t border-border pt-5 text-sm">
        <Link href="/paper" className="text-muted">
          Continue to current paper →
        </Link>
      </div>
    </Container>
  );
}
