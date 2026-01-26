import { Container } from "@/components/site/Container";
import { getAllContent } from "@/lib/mdx";
import Link from "next/link";
import { format } from "date-fns";

export default async function ResearchPage() {
    const research = await getAllContent("research");

    return (
        <Container>
            <div className="space-y-8">
                <div className="border-b border-gray-100 pb-8">
                    <h1 className="text-3xl font-bold mb-2">Research Directions</h1>
                    <p className="text-gray-500">Long-form investigations and project logs.</p>
                </div>

                <div className="space-y-8">
                    {research.map((item) => (
                        <article key={item.slug} className="group">
                            <Link href={`/research/${item.slug}`} className="block space-y-3">
                                <div className="flex items-baseline justify-between">
                                    <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h2>
                                    <time className="text-sm text-gray-400">
                                        {format(new Date(item.date), "MMMM d, yyyy")}
                                    </time>
                                </div>
                                <p className="text-gray-600 line-clamp-2">{item.summary}</p>
                                <div className="flex gap-2">
                                    {item.tags?.map((tag) => (
                                        <span key={tag} className="text-xs text-gray-400">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        </article>
                    ))}

                    {research.length === 0 && (
                        <p className="text-gray-500 italic">No research posts yet.</p>
                    )}
                </div>
            </div>
        </Container>
    );
}
