import { Container } from "./Container";
import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="mt-auto border-t border-gray-100 py-6 md:py-8">
            <Container>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-xs text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Yuvan. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="https://github.com/mohan0265" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
                            GitHub
                        </Link>
                        <span>Built with Next.js</span>
                    </div>
                </div>
            </Container>
        </footer>
    );
}

