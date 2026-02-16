import { Container } from "./Container";
import Link from "next/link";

export function SiteFooter() {
  const lastUpdated = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <footer className="mt-auto border-t border-border/80 py-8">
      <Container>
        <div className="flex flex-col gap-2 text-sm text-muted md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-sm">
              <Link href="/contact" className="font-medium text-text">
                Contact
              </Link>
            </p>
            <p className="text-xs">
              <Link href="/research" className="mr-3">
                Research
              </Link>
              <Link href="/reading">Reading</Link>
            </p>
          </div>
          <div className="space-y-1 text-xs md:text-right">
            <p>Last updated: {lastUpdated}</p>
            <p>© {new Date().getFullYear()} YRC Physics Lab</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

