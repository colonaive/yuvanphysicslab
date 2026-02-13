"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Container } from "./Container";
import { cn } from "@/lib/utils";
import { Orbit } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch("/api/lab/session", { cache: "no-store" });
        const data = await res.json();
        setIsAuthed(Boolean(data.authenticated));
      } catch {
        setIsAuthed(false);
      }
    };
    loadSession();
  }, [pathname]);

  const isActive = (path: string) => {
    if (!pathname) return false;
    return path === "/" ? pathname === "/" : pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await fetch("/api/lab/logout", { method: "POST" });
    setIsAuthed(false);
    router.refresh();
  };

  const publicLinks = [
    { href: "/research", label: "Research" },
    { href: "/reading", label: "Reading" },
    { href: "/paper", label: "Paper" },
    { href: "/posts", label: "Research Notes" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  const isLabRoute = Boolean(pathname?.startsWith("/lab"));
  const modeLabel = isLabRoute ? "LAB MODE" : "PUBLIC VIEW";
  const modeHref = isLabRoute ? "/" : "/lab";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-bg/88 backdrop-blur-md">
      <Container className="flex min-h-[4.5rem] items-center gap-4 py-3">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold tracking-wide text-text hover:text-accent sm:text-[1.05rem]"
        >
          <Orbit className="h-4 w-4 text-accent" />
          <span>Yuvan</span>
          <span className="hidden sm:inline">Physics Lab</span>
        </Link>

        <div className="min-w-0 flex-1 overflow-x-auto">
          <nav className="flex min-w-max items-center gap-4 pr-2">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap text-sm font-medium text-muted transition-colors hover:text-text hover:underline hover:decoration-accent/75 underline-offset-4",
                  isActive(link.href) &&
                    "text-text underline decoration-accent/80"
                )}
              >
                {link.label}
              </Link>
            ))}

            {isAuthed ? (
              <div className="ml-1 flex items-center gap-3 border-l border-border/75 pl-4">
                <Link
                  href="/lab"
                  className={cn(
                    "whitespace-nowrap text-xs font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:text-text",
                    isActive("/lab") && "text-text"
                  )}
                >
                  Writing Lab
                </Link>
                <Link
                  href="/lab/new"
                  className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:text-text"
                >
                  New Draft
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:text-text"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {isAuthed ? (
            <Link
              href={modeHref}
              className={cn(
                "hidden rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] sm:inline-flex",
                isLabRoute
                  ? "border-accent/55 bg-accent/10 text-accent"
                  : "border-border text-muted"
              )}
            >
              {modeLabel}
            </Link>
          ) : null}

          {!isAuthed ? (
            <Button href="/login" variant="outline" className="h-9 px-3 text-xs">
              Login
            </Button>
          ) : null}

          <Link
            href="/about"
            aria-label="Profile"
            className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-surface md:h-10 md:w-10 hover:ring-2 hover:ring-accent/45 hover:ring-offset-2 hover:ring-offset-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <Image
              src="/images/yuvan-profile.png"
              alt="Yuvan profile"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
      </Container>
    </header>
  );
}

