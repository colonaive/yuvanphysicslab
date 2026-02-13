import { Container } from "@/components/site/Container";
import { SpacetimeGrid } from "@/components/SpacetimeGrid";
import { Card } from "@/components/ui/Card";
import { Orbit } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";
import Image from "next/image";
import { aboutContent } from "@/content/about";

export default function AboutPage() {
  return (
    <Container className="space-y-10">
      <section className="relative overflow-hidden rounded-card border border-border bg-surface px-5 py-8 shadow-soft sm:px-8 sm:py-10">
        <SpacetimeGrid />
        <div className="relative grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <Image
              src="/images/yuvan-about.jpg"
              alt="Yuvan working on physics research"
              width={1200}
              height={800}
              priority
              className="h-[16rem] w-full rounded-2xl object-cover shadow-soft md:h-[24rem]"
            />
          </div>
          <div className="space-y-5 md:col-span-7 md:pl-2">
            <p className={semanticClasses.sectionMarker}>
              <Orbit className="h-4 w-4 text-accent" />
              Research Profile
            </p>
            <h1 className="max-w-3xl">{aboutContent.intro.title}</h1>
            <p className="text-muted">{aboutContent.intro.summary}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {aboutContent.sections.map((section) => (
          <Card key={section.heading} className="space-y-2 p-6">
            <h2 className="text-2xl">{section.heading}</h2>
            <p className="text-sm text-muted">{section.body}</p>
          </Card>
        ))}
      </section>
    </Container>
  );
}
