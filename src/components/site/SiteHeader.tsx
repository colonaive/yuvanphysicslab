"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
        "relative whitespace-nowrap text-base font-semibold text-muted transition-colors duration-200 hover:text-text after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 hover:after:scale-x-100 xl:text-[1.08rem]",
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

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

  const isActive = (path: string) => {
    if (!pathname) return false;
    return path === "/" ? pathname === "/" : pathname.startsWith(path);
  };

  const isLabRoute = Boolean(pathname?.startsWith("/lab"));
  const modeLabel = isLabRoute ? "LAB MODE" : "PUBLIC VIEW";
  const modeHref = isLabRoute ? "/" : "/lab";

  const handleLogout = async () => {
    setIsAuthed(false);
    setIsAdmin(false);
    router.push("/logout");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 backdrop-blur-[12px]",
        isScrolled
          ? "border-b border-border bg-[rgba(245,246,248,0.88)] shadow-[0_8px_22px_-18px_rgba(15,23,42,0.35)] dark:bg-[rgba(11,18,32,0.74)]"
          : "border-b border-border/70 bg-[rgba(245,246,248,0.72)] dark:bg-[rgba(11,18,32,0.55)]"
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-accent/10" />
      <Container className="max-w-[84rem]">
        <div className="py-4 md:py-6">
          <div className="flex items-center justify-between gap-4 md:grid md:grid-cols-[auto_1fr_auto] md:gap-12">
            <Link
              href="/"
              aria-label="YRC Physics Lab home"
              className="inline-flex shrink-0 items-center gap-3 text-sm font-semibold tracking-wide text-text"
            >
              <span className="flex items-center">
                <Image
                  src="/brand/ypl-logo-lockup-header-light.png"
                  alt="YRC Physics Lab"
                  width={460}
                  height={185}
                  priority
                  quality={100}
                  className="block h-[4.75rem] w-auto max-w-[min(90vw,40rem)] object-contain dark:hidden md:h-[7rem]"
                />
                <Image
                  src="/brand/ypl-logo-lockup-header-dark.png"
                  alt="YRC Physics Lab"
                  width={460}
                  height={185}
                  priority
                  quality={100}
                  className="hidden h-[4.75rem] w-auto max-w-[min(90vw,40rem)] object-contain dark:block md:h-[7rem]"
                />
              </span>
            </Link>

            <nav className="hidden items-center justify-center gap-x-7 gap-y-3 px-2 md:flex md:flex-wrap">
              {publicLinks.map((link) => (
                <HeaderLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={isActive(link.href)}
                />
              ))}
            </nav>

            <div className="ml-auto hidden shrink-0 items-center justify-end gap-4 md:flex">
              {!isAuthed ? (
                <Button href="/login" variant="outline" className="h-11 px-4 text-sm md:h-12 md:text-base">
                  Login
                </Button>
              ) : null}
              <ThemeToggle className="h-12 w-12 md:h-14 md:w-14" iconClassName="h-5 w-5 md:h-6 md:w-6" />
              {isAuthed ? (
                <Link
                  href="/about"
                  aria-label="Profile"
                  className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border bg-surface transition hover:ring-2 hover:ring-accent/45 hover:ring-offset-2 hover:ring-offset-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:h-16 md:w-16"
                >
                  {profileImageError ? (
                    <span className="inline-flex h-full w-full items-center justify-center bg-surface2 text-sm font-semibold text-text">
                      Y
                    </span>
                  ) : (
                    <Image
                      src="/images/yuvan-profile.png"
                      alt="Yuvan profile"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                      onError={() => setProfileImageError(true)}
                    />
                  )}
                </Link>
              ) : null}
            </div>

            <div className="ml-auto flex items-start gap-2 md:hidden">
              <Link
                href="/about"
                aria-label="Profile"
                className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-border bg-surface transition hover:ring-2 hover:ring-accent/45 hover:ring-offset-2 hover:ring-offset-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {profileImageError ? (
                  <span className="inline-flex h-full w-full items-center justify-center bg-surface2 text-sm font-semibold text-text">
                    Y
                  </span>
                ) : (
                  <Image
                    src="/images/yuvan-profile.png"
                    alt="Yuvan profile"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                    onError={() => setProfileImageError(true)}
                  />
                )}
              </Link>

              <div className="flex flex-col items-center gap-1.5">
                <ThemeToggle className="h-11 w-11" iconClassName="h-5 w-5" />
                {!isAuthed ? (
                  <Button href="/login" variant="outline" className="h-8 px-3 text-xs">
                    Login
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/75 py-2.5 md:hidden">
          <nav className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-button px-2.5 py-1.5 text-sm font-semibold text-muted transition-colors hover:bg-surface2 hover:text-text",
                  isActive(link.href) && "bg-surface2 text-text"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {isAuthed ? (
          <div className="border-t border-border/75 bg-surface2/55 py-3">
            <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2.5">
              <Link
                href="/lab"
                className={cn(
                  "rounded-button px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-muted transition-colors hover:bg-surface hover:text-text",
                  isActive("/lab") && "bg-surface text-text"
                )}
              >
                Lab
              </Link>
              <Link
                href="/lab/new"
                className={cn(
                  "rounded-button px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-muted transition-colors hover:bg-surface hover:text-text",
                  isActive("/lab/new") && "bg-surface text-text"
                )}
              >
                New Draft
              </Link>
              <Link
                href="/lab/linkedin"
                className={cn(
                  "rounded-button px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-muted transition-colors hover:bg-surface hover:text-text",
                  isActive("/lab/linkedin") && "bg-surface text-text"
                )}
              >
                LinkedIn
              </Link>
              {isAdmin ? (
                <Link
                  href="/lab/editor"
                  className={cn(
                    "rounded-button px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-muted transition-colors hover:bg-surface hover:text-text",
                    isActive("/lab/editor") && "bg-surface text-text"
                  )}
                >
                  CMS
                </Link>
              ) : null}
              <Link
                href={modeHref}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.12em]",
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
                className="rounded-button px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-muted transition-colors hover:bg-surface hover:text-text"
              >
                Logout
              </button>
            </nav>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
