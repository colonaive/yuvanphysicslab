"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/research", label: "Research" },
  { href: "/reading", label: "Reading" },
  { href: "/paper", label: "Paper" },
  { href: "/posts", label: "Research Notes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function HeaderLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "whitespace-nowrap text-sm font-medium text-muted transition-colors hover:text-text hover:underline hover:decoration-accent/75 underline-offset-4",
        active && "text-text underline decoration-accent/80"
      )}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  const isLabRoute = Boolean(pathname?.startsWith("/lab"));
  const modeLabel = isLabRoute ? "LAB MODE" : "PUBLIC VIEW";
  const modeHref = isLabRoute ? "/" : "/lab";

  const handleLogout = async () => {
    await fetch("/api/lab/logout", { method: "POST" });
    setIsAuthed(false);
    setIsMobileOpen(false);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-bg/92 backdrop-blur-md">
      <Container>
        <div className="flex min-h-[4.9rem] items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Yuvan Physics Lab home"
            className="inline-flex shrink-0 items-center gap-2.5 text-sm font-semibold tracking-wide text-text transition-colors hover:text-accent sm:text-[1.05rem]"
          >
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <Image
                src="/brand/yuvan-logo-badge-light.png"
                alt=""
                aria-hidden="true"
                width={32}
                height={32}
                className="h-full w-full object-contain dark:hidden"
                priority
              />
              <Image
                src="/brand/yuvan-logo-badge-dark.png"
                alt=""
                aria-hidden="true"
                width={32}
                height={32}
                className="hidden h-full w-full object-contain dark:block"
                priority
              />
            </span>
            <span className="sm:hidden">Yuvan</span>
            <span className="hidden sm:inline lg:hidden">Yuvan Physics Lab</span>
            <span className="hidden lg:inline">
              <Image
                src="/brand/yuvan-logo-lockup.png"
                alt=""
                aria-hidden="true"
                width={168}
                height={52}
                className="h-7 w-auto object-contain dark:brightness-110 dark:invert"
                priority
              />
            </span>
            <span className="sr-only">Yuvan Physics Lab</span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center gap-4 overflow-x-auto pr-2 lg:flex">
            {publicLinks.map((link) => (
              <HeaderLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActive(link.href)}
              />
            ))}
            {isAuthed ? (
              <div className="ml-2 flex items-center gap-3 border-l border-border/70 pl-4">
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

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
            ) : (
              <Button
                href="/login"
                variant="outline"
                className="h-9 px-3 text-xs sm:text-sm"
              >
                Login
              </Button>
            )}

            <ThemeToggle />

            <button
              type="button"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMobileOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg lg:hidden"
            >
              {isMobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>

            <Link
              href="/about"
              aria-label="Profile"
              className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-surface md:h-11 md:w-11 lg:h-12 lg:w-12 hover:ring-2 hover:ring-accent/45 hover:ring-offset-2 hover:ring-offset-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Image
                src="/images/yuvan-profile.png"
                alt="Yuvan profile"
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
        </div>

        {isMobileOpen ? (
          <div className="border-t border-border/75 py-4 lg:hidden">
            <nav className="space-y-1">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "block rounded-button px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface2 hover:text-text",
                    isActive(link.href) && "bg-surface2 text-text"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {isAuthed ? (
              <div className="mt-3 space-y-1 border-t border-border/70 pt-3">
                <Link
                  href={modeHref}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em]",
                    isLabRoute
                      ? "border-accent/55 bg-accent/10 text-accent"
                      : "border-border text-muted"
                  )}
                >
                  {modeLabel}
                </Link>
                <Link
                  href="/lab"
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "block rounded-button px-2.5 py-2 text-xs font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:bg-surface2 hover:text-text",
                    isActive("/lab") && "bg-surface2 text-text"
                  )}
                >
                  Writing Lab
                </Link>
                <Link
                  href="/lab/new"
                  onClick={() => setIsMobileOpen(false)}
                  className="block rounded-button px-2.5 py-2 text-xs font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:bg-surface2 hover:text-text"
                >
                  New Draft
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-button px-2.5 py-2 text-left text-xs font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:bg-surface2 hover:text-text"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Container>
    </header>
  );
}
