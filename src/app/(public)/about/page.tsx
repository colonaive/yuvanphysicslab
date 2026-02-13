import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import { aboutContent } from "@/content/about";
import { semanticClasses } from "@/theme/tokens";

export default function AboutPage() {
  return (
    <section className="lab-section reveal-section">
      <Container className="space-y-10">
        <section className="section-panel">
          <div className="grid gap-7 md:grid-cols-12 md:items-start">
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
              <p className={semanticClasses.sectionMarker}>Research Profile</p>
              <h1 className="max-w-3xl">{aboutContent.intro.title}</h1>
              <p className="text-muted">{aboutContent.intro.summary}</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {aboutContent.sections.map((section) => (
            <Card key={section.heading} className="space-y-2 p-6">
              <h2 className="text-[1.45rem]">{section.heading}</h2>
              <p className="text-sm text-muted">{section.body}</p>
            </Card>
          ))}
        </section>
      </Container>
    </section>
  );
}
