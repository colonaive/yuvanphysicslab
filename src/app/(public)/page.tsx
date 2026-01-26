import { Container } from "@/components/site/Container";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
    return (
        <Container>
            <section className="space-y-8">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                        Physics, Geometry, and Machine Learning
                    </h1>
                    <p className="max-w-xl text-lg text-gray-600 leading-relaxed">
                        Welcome to my digital garden. I explore the intersection of theoretical physics and modern AI.
                        Here you will find my research notes, half-baked ideas, and project logs.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Link
                        href="/research"
                        className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                    >
                        Research Directions <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href="/notes"
                        className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                        Read Notes
                    </Link>
                </div>

                <div className="mt-16 border-t border-gray-100 pt-8">
                    <h2 className="text-lg font-semibold mb-4">Latest Updates</h2>
                    <p className="text-gray-500">
                        Check back soon for more content.
                    </p>
                </div>
            </section>
        </Container>
    );
}
