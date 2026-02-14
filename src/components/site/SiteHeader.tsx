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
        "relative whitespace-nowrap text-sm font-medium text-muted transition-colors duration-200 hover:text-text after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 hover:after:scale-x-100",
        active && "text-text after:scale-x-100"
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
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const isActive = (path: string) => {
    if (!pathname) return false;
    return path === "/" ? pathname === "/" : pathname.startsWith(path);
  };

  const isLabRoute = Boolean(pathname?.startsWith("/lab"));
  const modeLabel = isLabRoute ? "LAB MODE" : "PUBLIC VIEW";
  const modeHref = isLabRoute ? "/" : "/lab";

  const handleLogout = async () => {
    setIsAuthed(false);
    setIsMobileOpen(false);
    router.push("/logout");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 backdrop-blur-[12px]",
        isScrolled || isMobileOpen
          ? "border-b border-border bg-[rgba(245,246,248,0.88)] shadow-[0_8px_22px_-18px_rgba(15,23,42,0.35)] dark:bg-[rgba(11,18,32,0.74)]"
          : "border-b border-border/70 bg-[rgba(245,246,248,0.72)] dark:bg-[rgba(11,18,32,0.55)]"
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-accent/10" />
      <Container>
        <div className="flex min-h-[6rem] items-center justify-between gap-3 md:min-h-[6.5rem]">
          <Link
            href="/"
            aria-label="Yuvan Physics Lab home"
            className="inline-flex shrink-0 items-center gap-3 text-sm font-semibold tracking-wide text-text transition-colors hover:text-accent sm:text-[1.08rem]"
          >
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center sm:h-11 sm:w-11 md:h-12 md:w-12">
              <Image
                src="/brand/yuvan-logo-mark-header-light.png"
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                className="h-full w-full object-contain dark:hidden"
                priority
              />
              <Image
                src="/brand/yuvan-logo-mark-header-dark.png"
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                className="hidden h-full w-full object-contain dark:block"
                priority
              />
            </span>
            <span className="inline text-[1.05rem] font-semibold tracking-[0.01em] sm:text-[1.16rem]">
              Yuvan Physics Lab
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
                  Lab
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
              className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-border bg-surface md:h-12 md:w-12 lg:h-12 lg:w-12 hover:ring-2 hover:ring-accent/45 hover:ring-offset-2 hover:ring-offset-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
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
                  Lab
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
