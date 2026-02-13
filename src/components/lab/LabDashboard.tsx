import { PenTool, ArrowRight, Sparkles, Pencil, Eye } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { CmsPost } from "@/lib/posts";
import { format } from "date-fns";

interface LabDashboardProps {
    drafts: CmsPost[];
    published: CmsPost[];
}

function PostRow({ post }: { post: CmsPost }) {
    const isPublished = post.status === "published";
    const viewHref = isPublished ? `/posts/${post.slug}` : `/lab/edit/${post.id}`;

    return (
        <Card className="space-y-3 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <h3 className="text-xl leading-tight">{post.title}</h3>
                    <p className="text-xs text-muted">
                        Last updated: {format(new Date(post.updated_at), "MMMM d, yyyy • HH:mm")}
                    </p>
                </div>
                <span
                    className={
                        isPublished
                            ? "rounded-full border border-accent/40 px-2.5 py-0.5 text-xs font-medium text-accent"
                            : "rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted"
                    }
                >
                    {post.status}
                </span>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button href={`/lab/edit/${post.id}`} variant="outline">
                    <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button href={viewHref} variant="ghost">
                    <Eye className="h-4 w-4" /> View
                </Button>
            </div>
        </Card>
    );
}

export function LabDashboard({ drafts, published }: LabDashboardProps) {
    const total = drafts.length + published.length;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-8">
                <div>
                    <h1 className="mb-1 text-3xl">Lab Dashboard</h1>
                    <p className="text-sm text-muted italic">&quot;Nullius in verba&quot;</p>
                </div>
                <form action="/api/lab/logout" method="POST">
                    <Button type="submit" variant="ghost" className="text-xs">
                        Logout
                    </Button>
                </form>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Button href="/lab/new">New Draft</Button>
                <p className="text-sm text-muted">{total} posts in your workspace</p>
            </div>

            <section className="space-y-3">
                <h2 className="text-2xl">Drafts</h2>
                <div className="space-y-3">
                    {drafts.length === 0 ? (
                        <Card className="p-5 text-sm text-muted">No drafts yet.</Card>
                    ) : (
                        drafts.map((post) => <PostRow key={post.id} post={post} />)
                    )}
                </div>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl">Published</h2>
                <div className="space-y-3">
                    {published.length === 0 ? (
                        <Card className="p-5 text-sm text-muted">No published posts yet.</Card>
                    ) : (
                        published.map((post) => <PostRow key={post.id} post={post} />)
                    )}
                </div>
            </section>

            <div className="grid md:grid-cols-2 gap-6">
                <Link href="/lab/latex" className="group block">
                    <Card className="h-full p-6 transition-colors hover:border-accent/55">
                        <div className="flex items-start justify-between mb-4">
                            <div className="rounded-button border border-border bg-surface2 p-3 text-accent">
                                <PenTool className="h-6 w-6" />
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted group-hover:text-accent transition-colors" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Editor</h2>
                        <p className="text-muted text-sm leading-relaxed">
                            Draft research notes with full LaTeX support and live preview.
                        </p>
                    </Card>
                </Link>

                <Link href="/lab/workbench" className="group block">
                    <Card className="h-full p-6 transition-colors hover:border-accent/55">
                        <div className="flex items-start justify-between mb-4">
                            <div className="rounded-button border border-border bg-surface2 p-3 text-accent">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted group-hover:text-accent transition-colors" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Workbench</h2>
                        <p className="text-muted text-sm leading-relaxed">
                            Research engine with AI-driven critique and manuscript drafting.
                        </p>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
