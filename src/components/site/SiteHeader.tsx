import Link from "next/link";
import { Container } from "./Container";

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between">
                <Link href="/" className="font-semibold text-lg hover:text-gray-600 transition-colors">
                    Yuvan
                </Link>
                <nav className="flex gap-6 text-sm font-medium text-gray-500">
                    <Link href="/research" className="hover:text-black transition-colors">
                        Research
                    </Link>
                    <Link href="/notes" className="hover:text-black transition-colors">
                        Notes
                    </Link>
                    <Link href="/contact" className="hover:text-black transition-colors">
                        Contact
                    </Link>
                </nav>
            </Container>
        </header>
    );
}
