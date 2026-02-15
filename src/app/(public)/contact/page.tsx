import { Container } from "@/components/site/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { semanticClasses } from "@/theme/tokens";
import { DraftNotCreated } from "@/components/content/DraftNotCreated";
import { MdxRenderer } from "@/components/content/MdxRenderer";
import { getPublicPage } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const page = await getPublicPage("contact");
  const inputClasses =
    "flex h-11 w-full rounded-button border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45";

  return (
    <section className="lab-section reveal-section">
      <Container>
        <Card className="mx-auto max-w-3xl space-y-8 p-6 sm:p-8">
          <div className="space-y-2">
            <p className={semanticClasses.sectionMarker}>Contact</p>
            <h1>{page?.title || "Contact"}</h1>
            {page ? (
              <MdxRenderer content={page.content_mdx} className="[&_p:first-child]:mt-0 text-muted" />
            ) : (
              <DraftNotCreated slug="contact" tableName="public_pages" />
            )}
          </div>

          <form
            name="contact"
            method="POST"
            action="/contact/thanks"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            className="space-y-6"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden" aria-hidden="true">
              <label>
                Don&apos;t fill this out if you&apos;re human:{" "}
                <input name="bot-field" />
              </label>
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input id="name" name="name" required placeholder="Your name" className={inputClasses} />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputClasses} />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <input id="subject" name="subject" required placeholder="Topic of your message" className={inputClasses} />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                placeholder="What can I help you with?"
                rows={5}
                className={`${inputClasses} min-h-[9rem]`}
              />
            </div>

            <Button type="submit">Send Message</Button>
          </form>
        </Card>
      </Container>
    </section>
  );
}
