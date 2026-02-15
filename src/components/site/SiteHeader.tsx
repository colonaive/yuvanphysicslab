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
import { getEditorHrefForPath } from "@/lib/content-routing";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch("/api/lab/session", { cache: "no-store" });
        const data = await res.json();
        setIsAuthed(Boolean(data.authenticated));
        setIsAdmin(Boolean(data.isAdmin));
      } catch {
        setIsAuthed(false);
        setIsAdmin(false);
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

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => {
      setIsDarkTheme(root.classList.contains("dark"));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const isActive = (path: string) => {
    if (!pathname) return false;
    return path === "/" ? pathname === "/" : pathname.startsWith(path);
  };

  const isLabRoute = Boolean(pathname?.startsWith("/lab"));
  const modeLabel = isLabRoute ? "LAB MODE" : "PUBLIC VIEW";
  const modeHref = isLabRoute ? "/" : "/lab";
  const editorHref = isAuthed && isAdmin ? getEditorHrefForPath(pathname) : null;
  const logoSrc = isDarkTheme
    ? "/brand/yuvan-logo-lockup-header-dark.png"
    : "/brand/yuvan-logo-lockup-header-light.png";

  const handleLogout = async () => {
    setIsAuthed(false);
    setIsAdmin(false);
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
        <div className="py-3 md:py-4">
          <div className="flex min-h-[4.5rem] items-center justify-between gap-3 md:min-h-[4.75rem]">
            <Link
              href="/"
              aria-label="Yuvan Physics Lab home"
              className="inline-flex shrink-0 items-center text-sm font-semibold tracking-wide text-text transition-colors hover:text-accent"
            >
              <span className="relative block h-[2.55rem] w-[168px] sm:h-[2.8rem] sm:w-[206px] md:h-[3rem] md:w-[224px] lg:h-[3.2rem] lg:w-[250px]">
                <Image
                  src={logoSrc}
                  alt=""
                  aria-hidden="true"
                  fill
                  priority
                  sizes="(max-width: 640px) 168px, (max-width: 1024px) 224px, 250px"
                  className="object-contain object-left"
                />
              </span>
              <span className="sr-only">Yuvan Physics Lab</span>
            </Link>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {!isAuthed ? (
                <Button
                  href="/login"
                  variant="outline"
                  className="hidden h-9 px-3 text-xs sm:inline-flex sm:text-sm"
                >
                  Login
                </Button>
              ) : null}

              <ThemeToggle />

              <Link
                href="/about"
                aria-label="Profile"
                className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-surface transition hover:ring-2 hover:ring-accent/45 hover:ring-offset-2 hover:ring-offset-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:h-11 sm:w-11"
              >
                <Image
                  src="/images/yuvan-profile.png"
                  alt="Yuvan profile"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </Link>

              <button
                type="button"
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                onClick={() => setIsMobileOpen((open) => !open)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:hidden"
              >
                {isMobileOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-2.5 hidden items-center justify-between gap-4 md:flex">
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {publicLinks.map((link) => (
                <HeaderLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={isActive(link.href)}
                />
              ))}
            </nav>

            {!isAuthed ? (
              <Button href="/login" variant="outline" className="h-8 px-3 text-xs">
                Login
              </Button>
            ) : null}
          </div>
        </div>

        {isAuthed ? (
          <div className="border-t border-border/75 bg-surface2/45 py-2.5">
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                href="/lab"
                className={cn(
                  "rounded-button px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted transition-colors hover:bg-surface hover:text-text",
                  isActive("/lab") && "bg-surface text-text"
                )}
              >
                Lab
              </Link>
              <Link
                href="/lab/new"
                className={cn(
                  "rounded-button px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted transition-colors hover:bg-surface hover:text-text",
                  isActive("/lab/new") && "bg-surface text-text"
                )}
              >
                New Draft
              </Link>
              {isAdmin ? (
                <Link
                  href="/lab/editor"
                  className={cn(
                    "rounded-button px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted transition-colors hover:bg-surface hover:text-text",
                    isActive("/lab/editor") && "bg-surface text-text"
                  )}
                >
                  CMS
                </Link>
              ) : null}
              {editorHref ? (
                <Button href={editorHref} variant="outline" className="h-8 px-2.5 text-[11px]">
                  Edit
                </Button>
              ) : null}
              <Link
                href={modeHref}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em]",
                  isLabRoute
                    ? "border-accent/55 bg-accent/10 text-accent"
                    : "border-border text-muted"
                )}
              >
                {modeLabel}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-button px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted transition-colors hover:bg-surface hover:text-text"
              >
                Logout
              </button>
            </nav>
          </div>
        ) : null}

        {isMobileOpen ? (
          <div className="border-t border-border/75 py-3 md:hidden">
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
              {!isAuthed ? (
                <Link
                  href="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="block rounded-button px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface2 hover:text-text"
                >
                  Login
                </Link>
              ) : null}
            </nav>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
