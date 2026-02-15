"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  FolderOpen,
  Lightbulb,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LINKEDIN_POST_IDEAS } from "@/lib/linkedin-ideas";
import {
  normalizeHashtag,
  normalizeHashtagList,
  suggestLinkedInHashtags,
} from "@/lib/linkedin-hashtags";
import type { LinkedInDraftRecord, LinkedInImageMeta } from "@/lib/linkedin-drafts";
import { cn } from "@/lib/utils";

const SOFT_WARNING_BODY_LENGTH = 2800;
const RECOMMENDED_BODY_LENGTH = 3000;
const API_MAX_BODY_LENGTH = 5000;
const MAX_IMAGES = 4;

const checklistItems = [
  { id: "one-idea", label: "One clear idea per post" },
  { id: "defined-terms", label: "Key terms are defined briefly" },
  { id: "readable", label: "Paragraphs are short and readable" },
  { id: "jargon", label: "No jargon dump without context" },
  { id: "hook", label: "Opening hook is specific" },
  { id: "why-it-matters", label: "Why this matters is explicit" },
  { id: "link", label: "Reference or link included when relevant" },
  { id: "question", label: "Ends with a question or feedback invite" },
];

const templateLibrary = [
  {
    id: "new-insight",
    label: "New insight",
    body:
      "Hook:\nI changed my mind about [topic] after revisiting [method/paper].\n\nWhat I learned:\n- [Point 1]\n- [Point 2]\n- [Point 3]\n\nWhy it matters:\n[1-2 lines]\n\nQuestion:\nWhat alternative viewpoint should I test next?",
  },
  {
    id: "paper-summary",
    label: "Paper summary",
    body:
      "Paper:\n[Title + author]\n\nMain claim:\n[1-2 lines]\n\nWhat was convincing:\n[1-2 lines]\n\nWhat remains unresolved:\n[1-2 lines]\n\nQuestion for researchers:\nWhat follow-up paper best addresses this gap?",
  },
  {
    id: "reading-takeaway",
    label: "Reading takeaway",
    body:
      "Today's takeaway from [book/paper]:\n\nCore idea:\n[1 line]\n\nHow it changed my understanding:\n[2-3 lines]\n\nHow I will use it next:\n[1-2 lines]",
  },
  {
    id: "stuck-problem",
    label: "Problem I'm stuck on",
    body:
      "I am currently stuck on:\n[Specific technical problem]\n\nWhat I tried:\n- [Attempt 1]\n- [Attempt 2]\n\nFailure mode:\n[Where it breaks]\n\nIf you have solved something similar, I would value a pointer.",
  },
  {
    id: "mini-derivation",
    label: "Mini-derivation",
    body:
      "Mini-derivation of [result]:\n\nAssumptions:\n- [A1]\n- [A2]\n\nSketch:\n1) [Step]\n2) [Step]\n3) [Step]\n\nResult:\n[Equation/result]\n\nQuestion:\nWould you frame this derivation differently?",
  },
];

type LeftTab = "composer" | "ideas";
type CoachSection = "formula" | "checklist" | "templates" | "hashtags";

interface ApiDraftListResponse {
  success: boolean;
  drafts?: LinkedInDraftRecord[];
  error?: string;
}

interface ApiDraftMutationResponse {
  success: boolean;
  draft?: LinkedInDraftRecord;
  error?: string;
}

export function LinkedInComposer() {
  const previewUrlsRef = useRef<string[]>([]);

  const [activeLeftTab, setActiveLeftTab] = useState<LeftTab>("composer");
  const [openSections, setOpenSections] = useState<Record<CoachSection, boolean>>({
    formula: true,
    checklist: true,
    templates: false,
    hashtags: true,
  });

  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [images, setImages] = useState<LinkedInImageMeta[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [drafts, setDrafts] = useState<LinkedInDraftRecord[]>([]);
  const [showDraftList, setShowDraftList] = useState(false);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [deletingDraftId, setDeletingDraftId] = useState<string | null>(null);

  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    Object.fromEntries(checklistItems.map((item) => [item.id, false]))
  );

  const replacePreviewUrls = useCallback((urls: string[]) => {
    for (const url of previewUrlsRef.current) {
      URL.revokeObjectURL(url);
    }

    previewUrlsRef.current = urls;
    setImagePreviews(urls);
  }, []);

  useEffect(() => {
    return () => {
      for (const url of previewUrlsRef.current) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  const loadDrafts = useCallback(async () => {
    setIsLoadingDrafts(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/lab/linkedin/drafts", { cache: "no-store" });
      const data = (await response.json()) as ApiDraftListResponse;

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Unable to load drafts.");
        return;
      }

      setDrafts(data.drafts ?? []);
    } catch {
      setErrorMessage("Unable to load drafts.");
    } finally {
      setIsLoadingDrafts(false);
    }
  }, []);

  useEffect(() => {
    void loadDrafts();
  }, [loadDrafts]);

  const bodyLength = body.length;
  const bodyWordCount = useMemo(() => body.split(/\s+/).filter(Boolean).length, [body]);
  const estimatedReadTime = useMemo(
    () => (bodyWordCount === 0 ? 0 : Math.max(1, Math.ceil(bodyWordCount / 200))),
    [bodyWordCount]
  );
  const checklistScore = useMemo(
    () => Object.values(checklistState).filter(Boolean).length,
    [checklistState]
  );
  const suggestedHashtags = useMemo(() => suggestLinkedInHashtags(title, body), [title, body]);

  const composedText = useMemo(() => {
    const sections = [title.trim(), body.trim(), linkUrl.trim(), hashtags.join(" ")].filter(Boolean);
    return sections.join("\n\n");
  }, [title, body, linkUrl, hashtags]);

  const resetForm = useCallback(() => {
    setCurrentDraftId(null);
    setSlug("");
    setTitle("");
    setBody("");
    setLinkUrl("");
    setHashtags([]);
    setHashtagInput("");
    setImages([]);
    replacePreviewUrls([]);
    setStatusMessage("Started a new draft.");
    setErrorMessage("");
  }, [replacePreviewUrls]);

  const loadDraftIntoForm = useCallback(
    (draft: LinkedInDraftRecord) => {
      setCurrentDraftId(draft.id);
      setSlug(draft.slug ?? "");
      setTitle(draft.title ?? "");
      setBody(draft.body);
      setLinkUrl(draft.linkUrl ?? "");
      setHashtags(normalizeHashtagList(draft.hashtags));
      setImages(draft.images ?? []);
      replacePreviewUrls([]);
      setStatusMessage(`Loaded draft updated ${new Date(draft.updatedAt).toLocaleString()}.`);
      setErrorMessage("");
      setShowDraftList(false);
      setActiveLeftTab("composer");
    },
    [replacePreviewUrls]
  );

  const saveDraft = useCallback(async () => {
    setIsSavingDraft(true);
    setErrorMessage("");
    setStatusMessage("");

    if (!body.trim()) {
      setErrorMessage("Body is required.");
      setIsSavingDraft(false);
      return;
    }

    if (bodyLength > API_MAX_BODY_LENGTH) {
      setErrorMessage(`Body exceeds API limit of ${API_MAX_BODY_LENGTH} characters.`);
      setIsSavingDraft(false);
      return;
    }

    const payload = {
      slug: slug.trim() || null,
      title: title.trim() || null,
      body,
      linkUrl: linkUrl.trim() || null,
      hashtags: normalizeHashtagList(hashtags),
      images: images.slice(0, MAX_IMAGES),
    };

    const endpoint = currentDraftId
      ? `/api/lab/linkedin/drafts/${encodeURIComponent(currentDraftId)}`
      : "/api/lab/linkedin/drafts";

    const method = currentDraftId ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ApiDraftMutationResponse;
      if (!response.ok || !data.success || !data.draft) {
        setErrorMessage(data.error || "Unable to save draft.");
        return;
      }

      setCurrentDraftId(data.draft.id);
      setStatusMessage("Draft saved.");
      await loadDrafts();
    } catch {
      setErrorMessage("Unable to save draft.");
    } finally {
      setIsSavingDraft(false);
    }
  }, [body, bodyLength, currentDraftId, hashtags, images, linkUrl, loadDrafts, slug, title]);

  const deleteDraft = useCallback(
    async (id: string) => {
      setDeletingDraftId(id);
      setErrorMessage("");
      setStatusMessage("");

      try {
        const response = await fetch(`/api/lab/linkedin/drafts/${encodeURIComponent(id)}`, {
          method: "DELETE",
        });

        const data = (await response.json()) as { success: boolean; error?: string };
        if (!response.ok || !data.success) {
          setErrorMessage(data.error || "Unable to delete draft.");
          return;
        }

        if (currentDraftId === id) {
          resetForm();
        }

        setStatusMessage("Draft deleted.");
        await loadDrafts();
      } catch {
        setErrorMessage("Unable to delete draft.");
      } finally {
        setDeletingDraftId(null);
      }
    },
    [currentDraftId, loadDrafts, resetForm]
  );

  const addHashtag = useCallback((rawValue: string) => {
    const parsed = normalizeHashtag(rawValue);
    if (!parsed) return;

    setHashtags((current) => normalizeHashtagList([...current, parsed]));
    setHashtagInput("");
  }, []);

  const removeHashtag = useCallback((tagToRemove: string) => {
    setHashtags((current) =>
      current.filter((item) => item.toLowerCase() !== tagToRemove.toLowerCase())
    );
  }, []);

  const handleImageSelection = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const selected = [...files].slice(0, MAX_IMAGES);
      const metadata: LinkedInImageMeta[] = selected.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type || "image/unknown",
      }));

      const previews = selected.map((file) => URL.createObjectURL(file));
      setImages(metadata);
      replacePreviewUrls(previews);

      if (files.length > MAX_IMAGES) {
        setStatusMessage(`Only the first ${MAX_IMAGES} images were kept.`);
      }
    },
    [replacePreviewUrls]
  );

  const copyToClipboard = useCallback(async (text: string, successMessage: string) => {
    if (!text.trim()) {
      setErrorMessage("Nothing to copy yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setStatusMessage(successMessage);
      setErrorMessage("");
    } catch {
      setErrorMessage("Clipboard copy failed.");
    }
  }, []);

  const toggleCoachSection = useCallback((section: CoachSection) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }, []);

  const bodyWarningMessage =
    bodyLength > RECOMMENDED_BODY_LENGTH
      ? `Above recommended ${RECOMMENDED_BODY_LENGTH} characters. Saving is still allowed up to ${API_MAX_BODY_LENGTH}.`
      : bodyLength > SOFT_WARNING_BODY_LENGTH
        ? `Approaching ${RECOMMENDED_BODY_LENGTH} characters.`
        : "";

  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          LinkedIn Composer
        </p>
        <h1 className="text-3xl">Draft, Coach, and Publish Workflow</h1>
        <p className="text-sm text-muted">
          Save drafts in Supabase, preview your post, refine with coaching prompts, then copy and
          paste into LinkedIn.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr_0.95fr]">
        <Card className="space-y-4 p-5 md:p-6">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveLeftTab("composer")}
              className={cn(
                "rounded-button px-3 py-1.5 text-sm font-medium transition-colors",
                activeLeftTab === "composer"
                  ? "bg-surface2 text-text"
                  : "text-muted hover:bg-surface2/60 hover:text-text"
              )}
            >
              Composer
            </button>
            <button
              type="button"
              onClick={() => setActiveLeftTab("ideas")}
              className={cn(
                "rounded-button px-3 py-1.5 text-sm font-medium transition-colors",
                activeLeftTab === "ideas"
                  ? "bg-surface2 text-text"
                  : "text-muted hover:bg-surface2/60 hover:text-text"
              )}
            >
              Post Ideas
            </button>
          </div>

          {activeLeftTab === "ideas" ? (
            <div className="space-y-3">
              {LINKEDIN_POST_IDEAS.map((idea) => (
                <Card key={idea.id} muted className="space-y-2 p-4">
                  <p className="text-sm font-semibold">{idea.label}</p>
                  <p className="text-sm text-muted">{idea.prompt}</p>
                  <Button
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    onClick={() => {
                      setTitle(idea.label);
                      setBody(idea.template);
                      setHashtags(normalizeHashtagList(idea.recommendedHashtags));
                      setActiveLeftTab("composer");
                    }}
                  >
                    <Lightbulb className="h-4 w-4" /> Use Idea
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="linkedin-slug" className="text-sm font-medium">
                  Slug (optional)
                </label>
                <input
                  id="linkedin-slug"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="my-linkedin-draft"
                  className="h-11 w-full rounded-button border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/35"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="linkedin-title" className="text-sm font-medium">
                  Title (optional)
                </label>
                <input
                  id="linkedin-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Short headline"
                  className="h-11 w-full rounded-button border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/35"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="linkedin-body" className="text-sm font-medium">
                  Body
                </label>
                <textarea
                  id="linkedin-body"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Write your LinkedIn post..."
                  className="min-h-[13rem] w-full rounded-card border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-text focus:outline-none focus:ring-2 focus:ring-accent/35"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className={bodyLength > RECOMMENDED_BODY_LENGTH ? "text-amber-500" : "text-muted"}>
                    {bodyLength} characters
                  </span>
                  <span className="text-muted">{bodyWordCount} words</span>
                </div>
                {bodyWarningMessage ? <p className="text-xs text-amber-500">{bodyWarningMessage}</p> : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="linkedin-link" className="text-sm font-medium">
                  Link URL (optional)
                </label>
                <input
                  id="linkedin-link"
                  value={linkUrl}
                  onChange={(event) => setLinkUrl(event.target.value)}
                  placeholder="https://..."
                  className="h-11 w-full rounded-button border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/35"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hashtags</label>
                <div className="flex gap-2">
                  <input
                    value={hashtagInput}
                    onChange={(event) => setHashtagInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addHashtag(hashtagInput);
                      }
                    }}
                    placeholder="#GeneralRelativity"
                    className="h-10 flex-1 rounded-button border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/35"
                  />
                  <Button variant="outline" className="h-10 px-3 text-xs" onClick={() => addHashtag(hashtagInput)}>
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hashtags.length === 0 ? (
                    <span className="text-xs text-muted">No hashtags selected.</span>
                  ) : (
                    hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-surface2 px-2.5 py-1 text-xs"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeHashtag(tag)}
                          className="text-muted transition-colors hover:text-text"
                          aria-label={`Remove ${tag}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="linkedin-images" className="text-sm font-medium">
                  Images (metadata only, up to {MAX_IMAGES})
                </label>
                <input
                  id="linkedin-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => handleImageSelection(event.target.files)}
                  className="block w-full text-sm text-muted file:mr-3 file:rounded-button file:border file:border-border file:bg-surface2 file:px-3 file:py-2 file:text-xs file:font-medium file:text-text hover:file:bg-surface2/80"
                />
                {images.length > 0 ? (
                  <ul className="space-y-1 text-xs text-muted">
                    {images.map((image) => (
                      <li key={`${image.name}-${image.size}`}>
                        {image.name} ({Math.ceil(image.size / 1024)} KB)
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button onClick={saveDraft} disabled={isSavingDraft}>
                  {isSavingDraft ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Draft
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  New Draft
                </Button>
                <Button variant="outline" onClick={() => setShowDraftList((open) => !open)}>
                  <FolderOpen className="h-4 w-4" /> Load Draft
                </Button>
                <Button variant="outline" onClick={() => void copyToClipboard(composedText, "Post text copied.")}>
                  <Copy className="h-4 w-4" /> Copy Post Text
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void copyToClipboard(hashtags.join(" "), "Hashtags copied.")}
                >
                  <Copy className="h-4 w-4" /> Copy Hashtags
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => window.open("https://www.linkedin.com/feed/", "_blank", "noopener,noreferrer")}
                >
                  <ExternalLink className="h-4 w-4" /> Open LinkedIn
                </Button>
              </div>

              {showDraftList ? (
                <Card muted className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Saved drafts</p>
                    <Button
                      variant="ghost"
                      className="h-7 px-2 text-xs"
                      onClick={() => void loadDrafts()}
                      disabled={isLoadingDrafts}
                    >
                      {isLoadingDrafts ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Refresh"}
                    </Button>
                  </div>
                  {drafts.length === 0 ? (
                    <p className="text-xs text-muted">No saved drafts yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {drafts.map((draft) => (
                        <li
                          key={draft.id}
                          className="flex items-start justify-between gap-2 rounded-button border border-border bg-surface px-3 py-2"
                        >
                          <button
                            type="button"
                            onClick={() => loadDraftIntoForm(draft)}
                            className="min-w-0 text-left"
                          >
                            <p className="truncate text-sm font-medium text-text">
                              {draft.title || draft.slug || "Untitled draft"}
                            </p>
                            <p className="text-xs text-muted">
                              {new Date(draft.updatedAt).toLocaleString()}
                            </p>
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteDraft(draft.id)}
                            className="rounded-button p-1 text-muted transition-colors hover:bg-surface2 hover:text-red-500"
                            disabled={deletingDraftId === draft.id}
                            aria-label="Delete draft"
                          >
                            {deletingDraftId === draft.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              ) : null}

              <p className={`text-sm ${errorMessage ? "text-red-500" : "text-muted"}`}>
                {errorMessage ||
                  statusMessage ||
                  (currentDraftId ? `Editing draft ${currentDraftId.slice(0, 8)}...` : "")}
              </p>
            </div>
          )}
        </Card>

        <Card className="space-y-4 p-5 md:p-6">
          <header className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Live Preview</p>
            <h2 className="text-xl">LinkedIn-style Post</h2>
            <p className="text-xs text-muted">Estimated read time: {estimatedReadTime} min</p>
          </header>
          <div className="space-y-3 rounded-card border border-border bg-surface2/45 p-4">
            {title.trim() ? <p className="text-lg font-semibold text-text">{title.trim()}</p> : null}
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">
              {body.trim() || "Your post preview will appear here..."}
            </p>
            {linkUrl.trim() ? <p className="text-sm text-accent2">Link: {linkUrl.trim()}</p> : null}
            {hashtags.length ? <p className="text-sm text-accent">{hashtags.join(" ")}</p> : null}

            {imagePreviews.length > 0 || images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {imagePreviews.length > 0
                  ? imagePreviews.map((src, index) => (
                    <div key={`${src}-${index}`} className="relative h-28 w-full overflow-hidden rounded-button border border-border">
                      <Image
                        src={src}
                        alt={`Selected upload ${index + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ))
                  : images.map((image) => (
                    <div
                      key={`${image.name}-${image.size}`}
                      className="flex h-28 items-center justify-center rounded-button border border-dashed border-border bg-surface px-2 text-center text-xs text-muted"
                    >
                      {image.name}
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
        </Card>

        <Card className="space-y-3 p-5 md:p-6">
          <header className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">LinkedIn Coach</p>
            <h2 className="text-xl">Writing Guidance</h2>
          </header>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => toggleCoachSection("formula")}
              className="flex w-full items-center justify-between rounded-button border border-border bg-surface2/55 px-3 py-2 text-sm font-semibold"
            >
              High-impact post formula
              {openSections.formula ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {openSections.formula ? (
              <div className="space-y-2 rounded-button border border-border bg-surface px-3 py-3 text-sm text-muted">
                <p><span className="font-medium text-text">Hook:</span> 1-2 lines that name the concrete insight.</p>
                <p><span className="font-medium text-text">What I did/learned:</span> 3-5 lines with specifics.</p>
                <p><span className="font-medium text-text">Why it matters:</span> 1-2 lines on implication.</p>
                <p><span className="font-medium text-text">Invitation:</span> ask a precise question to peers.</p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => toggleCoachSection("checklist")}
              className="flex w-full items-center justify-between rounded-button border border-border bg-surface2/55 px-3 py-2 text-sm font-semibold"
            >
              Quality checklist ({checklistScore}/{checklistItems.length})
              {openSections.checklist ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {openSections.checklist ? (
              <div className="space-y-2 rounded-button border border-border bg-surface px-3 py-3 text-sm text-muted">
                {checklistItems.map((item) => (
                  <label key={item.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(checklistState[item.id])}
                      onChange={(event) =>
                        setChecklistState((current) => ({
                          ...current,
                          [item.id]: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-border"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => toggleCoachSection("templates")}
              className="flex w-full items-center justify-between rounded-button border border-border bg-surface2/55 px-3 py-2 text-sm font-semibold"
            >
              Templates
              {openSections.templates ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {openSections.templates ? (
              <div className="grid gap-2 rounded-button border border-border bg-surface px-3 py-3">
                {templateLibrary.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="h-9 justify-start px-3 text-xs"
                    onClick={() =>
                      setBody((current) =>
                        current.trim() ? `${current.trim()}\n\n${template.body}` : template.body
                      )
                    }
                  >
                    {template.label}
                  </Button>
                ))}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => toggleCoachSection("hashtags")}
              className="flex w-full items-center justify-between rounded-button border border-border bg-surface2/55 px-3 py-2 text-sm font-semibold"
            >
              Hashtag suggestions
              {openSections.hashtags ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {openSections.hashtags ? (
              <div className="space-y-2 rounded-button border border-border bg-surface px-3 py-3">
                <p className="text-xs text-muted">
                  Suggestions are generated from title/body keywords and a curated physics set.
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedHashtags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addHashtag(tag)}
                      className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:bg-surface2 hover:text-text"
                    >
                      <Sparkles className="h-3 w-3" /> {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
