"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

export function SiteHeader() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname?.startsWith(path);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between">
                <Link href="/" className="font-semibold text-lg hover:text-gray-600 transition-colors">
                    Yuvan
                </Link>
                <nav className="flex gap-6 text-sm font-medium text-gray-500">
                    <Link
                        href="/research"
                        className={cn("hover:text-black transition-colors", isActive("/research") && "text-black")}
                    >
                        Research
                    </Link>
                    <Link
                        href="/notes"
                        className={cn("hover:text-black transition-colors", isActive("/notes") && "text-black")}
                    >
                        Notes
                    </Link>
                    <Link
                        href="/contact"
                        className={cn("hover:text-black transition-colors", isActive("/contact") && "text-black")}
                    >
                        Contact
                    </Link>
                </nav>
            </Container>
        </header>
    );
}

