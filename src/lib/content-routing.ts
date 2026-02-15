import type { PublicPostRecord } from "@/lib/content";

const staticPageToSlug: Record<string, string> = {
  "/": "home",
  "/research": "research",
  "/reading": "reading",
  "/paper": "paper",
  "/about": "about",
  "/contact": "contact",
  "/notes": "notes",
  "/posts": "posts",
};

function normalizePath(pathname: string) {
  if (!pathname) return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function getPageSlugForPath(pathname: string) {
  const normalized = normalizePath(pathname);
  return staticPageToSlug[normalized] ?? null;
}

export function getEditorHrefForPath(pathname?: string | null) {
  if (!pathname) return null;
  const normalized = normalizePath(pathname);

  const staticSlug = getPageSlugForPath(normalized);
  if (staticSlug) return `/lab/editor/pages/${encodeURIComponent(staticSlug)}`;

  const notesMatch = normalized.match(/^\/notes\/([^/]+)$/);
  if (notesMatch) return `/lab/editor/posts/${encodeURIComponent(notesMatch[1])}`;

  const postsMatch = normalized.match(/^\/posts\/([^/]+)$/);
  if (postsMatch) return `/lab/editor/posts/${encodeURIComponent(postsMatch[1])}`;

  const researchMatch = normalized.match(/^\/research\/([^/]+)$/);
  if (researchMatch) return `/lab/editor/posts/${encodeURIComponent(researchMatch[1])}`;

  return null;
}

export function getPublicHrefForPost(post: Pick<PublicPostRecord, "slug" | "type">) {
  if (post.type === "note") return `/notes/${post.slug}`;
  if (post.type === "paper") return `/research/${post.slug}`;
  return `/posts/${post.slug}`;
}
