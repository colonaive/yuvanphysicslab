import { Container } from "@/components/site/Container";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { researchFocus } from "@/content/research-focus";

export default function ResearchPage() {
  return (
    <Container className="space-y-10">
      <header className="space-y-3 border-b border-border pb-7">
        <h1>Research Focus</h1>
        <p className="text-muted">{researchFocus.focus}</p>
      </header>

      <section className="space-y-3">
        <h2>Core Questions I Am Exploring</h2>
        <Card className="p-6 md:p-7">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
            {researchFocus.coreQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="space-y-3">
        <h2>Current Work</h2>
        <Card className="space-y-3 p-6 md:p-7">
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
        <h2>Collaboration</h2>
        <Card className="space-y-3 p-6 md:p-7">
          <p className="text-sm text-muted">{researchFocus.collaboration.message}</p>
          <Button href={researchFocus.collaboration.contactHref} variant="outline">
            Contact
          </Button>
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
