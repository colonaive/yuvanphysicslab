"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type EditorStatus = "draft" | "published";

interface PostEditorFormProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content_md: string;
    status: EditorStatus;
    updated_at: string;
  };
}

export function PostEditorForm({ post }: PostEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [excerpt, setExcerpt] = useState(post.excerpt || "");
  const [content, setContent] = useState(post.content_md);
  const [status, setStatus] = useState<EditorStatus>(post.status);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [saveError, setSaveError] = useState("");

  const wordCount = useMemo(
    () => content.split(/\s+/).filter(Boolean).length,
    [content]
  );
  const viewHref = status === "published" ? `/posts/${post.slug}` : `/lab/edit/${post.id}`;
  const viewLabel = status === "published" ? "View Public" : "View Draft";

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    setFeedback("");

    try {
      const res = await fetch(`/api/lab/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content_md: content,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Save failed.");
      } else {
        setFeedback("Saved successfully.");
        router.refresh();
      }
    } catch {
      setSaveError("Save failed due to network error.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="space-y-6 p-6 md:p-8">
      <header className="space-y-2 border-b border-border pb-5">
        <h1 className="text-3xl">Edit Post</h1>
        <p className="text-sm text-muted">
          Update title, excerpt, Markdown content, and publication status.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 w-full rounded-button border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/35"
            placeholder="Post title"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">
            Slug
          </label>
          <input
            id="slug"
            value={post.slug}
            disabled
            className="h-11 w-full rounded-button border border-border bg-surface2 px-3 text-sm text-muted"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as EditorStatus)}
            className="h-11 w-full rounded-button border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/35"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="excerpt" className="text-sm font-medium">
            Excerpt
          </label>
          <TextareaAutosize
            id="excerpt"
            minRows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full rounded-button border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/35"
            placeholder="Short summary for listings and metadata."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="content" className="text-sm font-medium">
            Content (Markdown + LaTeX)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[28rem] w-full rounded-card border border-border bg-surface px-4 py-3 font-mono text-sm leading-relaxed text-text focus:outline-none focus:ring-2 focus:ring-accent/35"
            placeholder="Write markdown content here..."
          />
          <p className="text-xs text-muted">{wordCount} words</p>
        </div>
      </div>

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
        <Button href={viewHref} variant="outline">
          {viewLabel}
        </Button>
        <p
          className={cn(
            "text-sm",
            saveError ? "text-red-500" : "text-muted"
          )}
        >
          {saveError || feedback || `Last updated: ${new Date(post.updated_at).toLocaleString()}`}
        </p>
      </div>
    </Card>
  );
}
