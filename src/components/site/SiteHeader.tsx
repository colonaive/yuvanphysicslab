"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Container } from "./Container";
import { cn } from "@/lib/utils";
import { Orbit } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!pathname) return false;
    return path === "/" ? pathname === "/" : pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-bg/88 backdrop-blur-md">
      <Container className="flex h-[4.5rem] items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[1.05rem] font-semibold tracking-wide text-text hover:text-accent"
        >
          <Orbit className="h-4 w-4 text-accent" />
          Yuvan Physics Lab
        </Link>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link
              href="/research"
              className={cn(
                "text-muted",
                isActive("/research") && "text-text underline decoration-accent/80"
              )}
            >
              Research
            </Link>
            <Link
              href="/notes"
              className={cn(
                "text-muted",
                isActive("/notes") && "text-text underline decoration-accent/80"
              )}
            >
              Notes
            </Link>
            <Link
              href="/about"
              className={cn(
                "text-muted",
                isActive("/about") && "text-text underline decoration-accent/80"
              )}
            >
              About
            </Link>
          </nav>

          <Link
            href="/about"
            aria-label="Profile"
            className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-surface hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <Image
              src="/profile-circle.svg"
              alt="Yuvan profile"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
      </Container>
    </header>
  );
}

