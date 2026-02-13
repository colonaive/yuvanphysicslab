import { Container } from "@/components/site/Container";
import { SpacetimeGrid } from "@/components/SpacetimeGrid";
import { Card } from "@/components/ui/Card";
import { Atom, Orbit, Sigma, Waves } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";

export default function AboutPage() {
  return (
    <Container className="space-y-12">
      <section className="relative overflow-hidden rounded-card border border-border bg-surface px-6 py-12 shadow-soft sm:px-10 sm:py-14">
        <SpacetimeGrid />
        <div className="relative space-y-5">
          <p className={semanticClasses.sectionMarker}>
            <Orbit className="h-4 w-4 text-accent" />
            About This Lab
          </p>
          <h1 className="max-w-3xl">Independent Research Practice in Theoretical and Computational Physics</h1>
          <p className="max-w-2xl text-muted">
            This site documents technical reading, derivations, and long-horizon experiments at the
            boundary of geometry, statistical learning, and physical theory.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="space-y-3 p-5">
          <p className={semanticClasses.sectionMarker}>
            <Atom className="h-4 w-4 text-accent" />
            Focus
          </p>
          <p className="text-sm text-muted">Symmetry-aware models, geometric priors, and modern field-theoretic intuition.</p>
        </Card>
        <Card className="space-y-3 p-5">
          <p className={semanticClasses.sectionMarker}>
            <Sigma className="h-4 w-4 text-accent" />
            Method
          </p>
          <p className="text-sm text-muted">Rigorous derivation first, implementation second, with transparent assumptions.</p>
        </Card>
        <Card className="space-y-3 p-5">
          <p className={semanticClasses.sectionMarker}>
            <Waves className="h-4 w-4 text-accent" />
            Output
          </p>
          <p className="text-sm text-muted">Journal-style papers, compact notes, and reproducible research logs.</p>
        </Card>
      </section>
    </Container>
  );
}
