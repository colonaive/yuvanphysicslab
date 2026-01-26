import { Container } from "@/components/site/Container";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRecentContent } from "@/lib/mdx";
import { format } from "date-fns";

export default async function HomePage() {
    const recentContent = await getRecentContent();

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
                    <h2 className="text-lg font-semibold mb-6">Latest Updates</h2>
                    <div className="space-y-6">
                        {recentContent.map((item) => (
                            <Link
                                key={item.slug}
                                href={`/${item.type}/${item.slug}`}
                                className="block group"
                            >
                                <article className="flex items-baseline justify-between mb-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${item.type === 'research'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {item.type === 'research' ? 'Research' : 'Note'}
                                        </span>
                                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <time className="text-sm text-gray-400 shrink-0 ml-4">
                                        {format(new Date(item.date), "MMM d")}
                                    </time>
                                </article>
                                <p className="text-sm text-gray-500 line-clamp-1 ml-[calc(2rem+.75rem)]">
                                    {item.summary}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </Container>
    );
}
