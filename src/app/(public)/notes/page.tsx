import { Container } from "@/components/site/Container";
import { getAllContent } from "@/lib/mdx";
import Link from "next/link";
import { format } from "date-fns";

export default async function NotesPage() {
    const notes = await getAllContent("notes");

    return (
        <Container>
            <div className="space-y-8">
                <div className="border-b border-gray-100 pb-8">
                    <h1 className="text-3xl font-bold mb-2">Notes</h1>
                    <p className="text-gray-500">Thoughts, derivations, and summaries.</p>
                </div>

                <div className="space-y-8">
                    {notes.map((note) => (
                        <article key={note.slug} className="group">
                            <Link href={`/notes/${note.slug}`} className="block space-y-3">
                                <div className="flex items-baseline justify-between">
                                    <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                                        {note.title}
                                    </h2>
                                    <time className="text-sm text-gray-400">
                                        {format(new Date(note.date), "MMMM d, yyyy")}
                                    </time>
                                </div>
                                <p className="text-gray-600 line-clamp-2">{note.summary}</p>
                                <div className="flex gap-2">
                                    {note.tags?.map((tag) => (
                                        <span key={tag} className="text-xs text-gray-400">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </Container>
    );
}
