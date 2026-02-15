"use client";

import { useMemo, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MdxRenderer } from "@/components/content/MdxRenderer";

interface PageEditorPaneProps {
  slug: string;
  title: string;
  content: string;
  updatedAt: string | null;
  publicHref: string;
}

export function PageEditorPane({
  slug,
  title: initialTitle,
  content: initialContent,
  updatedAt,
  publicHref,
}: PageEditorPaneProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(updatedAt);

  const wordCount = useMemo(
    () => content.split(/\s+/).filter(Boolean).length,
    [content]
  );

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/lab/content/pages/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content_mdx: content }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        page?: { updated_at?: string };
      };

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Save failed.");
        return;
      }

      setSavedAt(data.page?.updated_at ?? new Date().toISOString());
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
        <h1 className="text-3xl">Edit Page: {slug}</h1>
        <p className="text-sm text-muted">
          Save updates to Supabase and publish instantly without redeploy.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="space-y-4 p-5 md:p-6">
          <div className="space-y-2">
            <label htmlFor="page-title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="page-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11 w-full rounded-button border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="page-content" className="text-sm font-medium">
              Content (Markdown/MDX)
            </label>
            <textarea
              id="page-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-[24rem] w-full rounded-card border border-border bg-surface px-4 py-3 font-mono text-sm leading-relaxed text-text focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <p className="text-xs text-muted">{wordCount} words</p>
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
            <Button href={publicHref} variant="outline">
              View Public
            </Button>
            <Button href="/lab/editor/pages" variant="ghost">
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
            <MdxRenderer content={content || "_Start writing page content..._"} className="mt-4" />
          </div>
        </Card>
      </div>
    </div>
  );
}
