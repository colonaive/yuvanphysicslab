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
          <p>
            Contact:{" "}
            <Link href="mailto:yuvan.lab@proton.me" className="font-medium text-text">
              yuvan.lab@proton.me
            </Link>
          </p>
          <p className="text-xs">Last updated: {lastUpdated}</p>
        </div>
      </Container>
    </footer>
  );
}

