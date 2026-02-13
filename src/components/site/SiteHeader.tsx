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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-bg/88 backdrop-blur-md">
      <Container className="flex h-[4.5rem] items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-text hover:text-accent sm:text-[1.05rem]"
        >
          <Orbit className="h-4 w-4 text-accent" />
          <span>Yuvan</span>
          <span className="hidden sm:inline">Physics Lab</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="flex items-center gap-3 text-xs font-medium sm:gap-4 sm:text-sm">
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
              href="/reading"
              className={cn(
                "text-muted",
                isActive("/reading") && "text-text underline decoration-accent/80"
              )}
            >
              Reading
            </Link>
            <Link
              href="/paper"
              className={cn(
                "hidden text-muted sm:inline",
                isActive("/paper") && "text-text underline decoration-accent/80"
              )}
            >
              Paper
            </Link>
            <Link
              href="/posts"
              className={cn(
                "hidden text-muted sm:inline",
                isActive("/posts") && "text-text underline decoration-accent/80"
              )}
            >
              Posts
            </Link>
            <Link
              href="/notes"
              className={cn(
                "hidden text-muted md:inline",
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

          {isAuthed ? (
            <Button variant="ghost" className="px-2 py-1 text-xs sm:px-3 sm:py-1.5" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link href="/login" className="text-xs font-medium text-muted hover:text-accent">
              Login
            </Link>
          )}

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

