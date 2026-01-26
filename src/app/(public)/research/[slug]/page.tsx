import { Container } from "@/components/site/Container";
import { getAllContent, getContentBySlug } from "@/lib/mdx";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const research = await getAllContent("research");
    return research.map((item) => ({
        slug: item.slug,
    }));
}

export default async function ResearchDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getContentBySlug("research", slug);

    if (!post) {
        notFound();
    }

    const { meta, content } = post;

    return (
        <Container>
            <Link href="/research" className="inline-flex items-center text-sm text-gray-400 hover:text-gray-900 mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Research
            </Link>

            <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-blue-600 prose-img:rounded-xl">
                <header className="mb-10 not-prose border-b border-gray-100 pb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{meta.title}</h1>
                    <div className="flex gap-4 text-sm text-gray-500">
                        <time>{format(new Date(meta.date), "MMMM d, yyyy")}</time>
                        <span className="text-gray-300">•</span>
                        <span>{meta.readingTime || "10 min read"}</span>
                    </div>
                    {meta.tags && (
                        <div className="flex gap-2 mt-4">
                            {meta.tags.map(tag => (
                                <span key={tag} className="bg-gray-50 text-gray-500 px-2 py-1 rounded text-xs px-2.5 py-0.5 rounded-full font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {content}

            </article>

            <div className="mt-16 pt-8 border-t border-gray-100 text-sm italic text-gray-400">
                End of research log.
            </div>
        </Container>
    );
}
