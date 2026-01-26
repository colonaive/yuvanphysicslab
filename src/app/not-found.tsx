import Link from "next/link";
import { Container } from "@/components/site/Container";

export default function NotFound() {
    return (
        <Container>
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
                <h1 className="text-4xl font-bold tracking-tight">404</h1>
                <h2 className="text-xl font-medium text-gray-500">Page not found</h2>
                <p className="text-gray-400 max-w-sm">
                    The page you are looking for might have been moved, deleted, or is temporarily unavailable.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-all"
                >
                    Return Home
                </Link>
            </div>
        </Container>
    );
}
