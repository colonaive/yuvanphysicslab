import Image from "next/image";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { semanticClasses } from "@/theme/tokens";
import { DraftNotCreated } from "@/components/content/DraftNotCreated";
import { MdxRenderer } from "@/components/content/MdxRenderer";
import { getPublicPage } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const page = await getPublicPage("about");

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
              <h1 className="max-w-3xl">{page?.title || "About"}</h1>
              {page ? (
                <MdxRenderer content={page.content_mdx} className="[&_p:first-child]:mt-0" />
              ) : (
                <DraftNotCreated slug="about" tableName="public_pages" />
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <Card className="p-6">
            <p className="text-sm text-muted">
              This profile content is now editable from the Lab CMS at{" "}
              <code>/lab/editor/pages/about</code>.
            </p>
          </Card>
        </section>
      </Container>
    </section>
  );
}
