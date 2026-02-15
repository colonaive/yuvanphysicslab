import Link from "next/link";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SmartBackButton } from "@/components/site/SmartBackButton";
import { DraftNotCreated } from "@/components/content/DraftNotCreated";
import { MdxRenderer } from "@/components/content/MdxRenderer";
import { getPublicHrefForPost } from "@/lib/content-routing";
import { getPublicPage, listLatestPublicPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function FeaturedPaperPage() {
  const [page, paperPosts] = await Promise.all([
    getPublicPage("paper"),
    listLatestPublicPosts({ limit: 1, type: "paper" }),
  ]);

  const paper = paperPosts[0] ?? null;
  const lastUpdated = paper?.updated_at ?? page?.updated_at ?? null;
  const paperPdfHref = "/papers/ctc-paper.pdf";

  return (
    <Container className="space-y-7">
      <SmartBackButton fallbackHref="/" label="Back" />

      <header className="space-y-3 border-b border-border pb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Featured Preprint
        </p>
        <h1>{paper?.title || page?.title || "Featured Paper"}</h1>
        {lastUpdated ? (
          <p className="text-xs text-muted">
            Last Updated: {format(new Date(lastUpdated), "MMMM d, yyyy")}
          </p>
        ) : null}
      </header>

      {paper ? (
        <>
          <Card muted className="space-y-3 border-l-2 border-l-accent p-6 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Abstract</p>
            <p className="text-sm text-muted">{paper.excerpt || "Research manuscript in progress."}</p>
          </Card>

          <Card className="p-6 md:p-7">
            <MdxRenderer content={paper.content_mdx} />
          </Card>
        </>
      ) : page ? (
        <Card className="p-6 md:p-7">
          <MdxRenderer content={page.content_mdx} />
        </Card>
      ) : (
        <DraftNotCreated slug="paper" tableName="public_pages" />
      )}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">PDF</p>
          <Button href={paperPdfHref} download>
            Download PDF <Download className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-hidden rounded-card border border-border bg-surface shadow-soft">
          <object
            data={`${paperPdfHref}#view=FitH`}
            type="application/pdf"
            aria-label="Investigating Spacetimes with Closed Timelike Curves"
            className="h-[70vh] min-h-[30rem] w-full"
          >
            <div className="flex h-[70vh] min-h-[30rem] flex-col items-center justify-center gap-2 px-6 text-center text-sm text-muted">
              <p>Unable to preview the PDF in this browser.</p>
              <Link href={paperPdfHref} target="_blank" rel="noreferrer" className="text-accent2">
                Open PDF in a new tab
              </Link>
            </div>
          </object>
        </div>
      </section>

      <div className="border-t border-border pt-5 text-sm">
        <Link
          href={paper ? getPublicHrefForPost(paper) : "/notes"}
          className="text-muted"
        >
          Continue to notes →
        </Link>
      </div>
    </Container>
  );
}
