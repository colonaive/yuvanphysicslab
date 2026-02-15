"use client";

import { useMemo, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MdxRenderer } from "@/components/content/MdxRenderer";
import type { PublicPostType } from "@/lib/content";

interface PostEditorPaneProps {
  slug: string;
  type: PublicPostType;
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
  publishedAt: string | null;
  updatedAt: string | null;
}

export function PostEditorPane({
  slug,
  type: initialType,
  title: initialTitle,
  excerpt: initialExcerpt,
  content: initialContent,
  published: initialPublished,
  publishedAt: initialPublishedAt,
  updatedAt,
}: PostEditorPaneProps) {
  const [type, setType] = useState<PublicPostType>(initialType);
  const [title, setTitle] = useState(initialTitle);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [content, setContent] = useState(initialContent);
  const [published, setPublished] = useState(initialPublished);
  const [publishedAt, setPublishedAt] = useState(initialPublishedAt ?? "");
  const [savedAt, setSavedAt] = useState<string | null>(updatedAt);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const wordCount = useMemo(
    () => content.split(/\s+/).filter(Boolean).length,
    [content]
  );
  const publicHref = type === "note" ? `/notes/${slug}` : type === "paper" ? `/research/${slug}` : `/posts/${slug}`;

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/lab/content/posts/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          excerpt,
          content_mdx: content,
          published,
          published_at: publishedAt || null,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        post?: { updated_at?: string };
      };

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Save failed.");
        return;
      }

      setSavedAt(data.post?.updated_at ?? new Date().toISOString());
      setStatusMessage("Saved");
    } catch {
      setErrorMessage("Save failed due to network error.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Instant Edit</p>
        <h1 className="text-3xl">Edit Post: {slug}</h1>
        <p className="text-sm text-muted">
          Save updates to Supabase and publish instantly without redeploy.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="space-y-4 p-5 md:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="post-type">
                Type
              </label>
              <select
                id="post-type"
                value={type}
                onChange={(event) => setType(event.target.value as PublicPostType)}
                className="h-11 w-full rounded-button border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="note">Research Note</option>
                <option value="paper">Research Paper</option>
                <option value="post">Post</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="post-published-at">
                Published Date
              </label>
              <input
                id="post-published-at"
                type="date"
                value={publishedAt}
                onChange={(event) => setPublishedAt(event.target.value)}
                className="h-11 w-full rounded-button border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="post-title">
              Title
            </label>
            <input
              id="post-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11 w-full rounded-button border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="post-excerpt">
              Excerpt
            </label>
            <textarea
              id="post-excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              className="min-h-[6rem] w-full rounded-card border border-border bg-surface px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="post-content">
              Content (Markdown/MDX)
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-[20rem] w-full rounded-card border border-border bg-surface px-4 py-3 font-mono text-sm leading-relaxed text-text focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <p className="text-xs text-muted">{wordCount} words</p>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Published
          </label>

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save
                </>
              )}
            </Button>
            <Button href={publicHref} variant="outline">
              View Public
            </Button>
            <Button href="/lab/editor/posts" variant="ghost">
              Cancel
            </Button>
            <span className={`text-sm ${errorMessage ? "text-red-500" : "text-muted"}`}>
              {errorMessage || statusMessage || (savedAt ? `Updated ${new Date(savedAt).toLocaleString()}` : "")}
            </span>
          </div>
        </Card>

        <Card className="space-y-4 p-5 md:p-6">
          <h2 className="text-xl">Live Preview</h2>
          <div className="rounded-card border border-border bg-surface2/45 p-4">
            <h3 className="text-2xl">{title || "Untitled"}</h3>
            {excerpt ? <p className="mt-2 text-sm text-muted">{excerpt}</p> : null}
            <MdxRenderer content={content || "_Start writing post content..._"} className="mt-4" />
          </div>
        </Card>
      </div>
    </div>
  );
}
