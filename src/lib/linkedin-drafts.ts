import { createClient } from "@supabase/supabase-js";
import { normalizeHashtagList } from "@/lib/linkedin-hashtags";

const DRAFT_SELECT_FIELDS =
  "id,slug,title,body,hashtags,link_url,images,created_at,updated_at";

const MAX_BODY_LENGTH = 5000;
const MAX_TITLE_LENGTH = 220;
const MAX_URL_LENGTH = 500;
const MAX_SLUG_LENGTH = 120;
const MAX_IMAGES = 4;

export interface LinkedInImageMeta {
  name: string;
  size: number;
  type: string;
}

export interface LinkedInDraftRecord {
  id: string;
  slug: string | null;
  title: string | null;
  body: string;
  hashtags: string[];
  linkUrl: string | null;
  images: LinkedInImageMeta[];
  createdAt: string;
  updatedAt: string;
}

export interface LinkedInDraftMutationInput {
  slug?: string | null;
  title?: string | null;
  body?: string;
  hashtags?: string[];
  linkUrl?: string | null;
  images?: LinkedInImageMeta[];
}

interface ValidateOptions {
  partial?: boolean;
}

export interface ValidateResult {
  valid: boolean;
  error?: string;
  data?: LinkedInDraftMutationInput;
}

function createLinkedInAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function parseImageMetaList(value: unknown): ValidateResult {
  if (!Array.isArray(value)) {
    return { valid: false, error: "Images must be an array." };
  }

  if (value.length > MAX_IMAGES) {
    return { valid: false, error: `No more than ${MAX_IMAGES} images are allowed.` };
  }

  const parsed: LinkedInImageMeta[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") {
      return { valid: false, error: "Invalid image metadata entry." };
    }

    const candidate = entry as Record<string, unknown>;
    const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
    const type = typeof candidate.type === "string" ? candidate.type.trim() : "";
    const sizeRaw = candidate.size;

    if (!name || !type || typeof sizeRaw !== "number" || !Number.isFinite(sizeRaw) || sizeRaw < 0) {
      return { valid: false, error: "Invalid image metadata values." };
    }

    parsed.push({
      name: name.slice(0, 180),
      type: type.slice(0, 120),
      size: Math.floor(sizeRaw),
    });
  }

  return { valid: true, data: { images: parsed } };
}

function sanitizeSlug(value: unknown): ValidateResult {
  if (value === null || typeof value === "undefined") return { valid: true, data: { slug: null } };
  if (typeof value !== "string") return { valid: false, error: "Slug must be a string." };

  const normalized = value.trim().toLowerCase();
  if (!normalized) return { valid: true, data: { slug: null } };
  if (normalized.length > MAX_SLUG_LENGTH) {
    return { valid: false, error: `Slug must be at most ${MAX_SLUG_LENGTH} characters.` };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    return { valid: false, error: "Slug can contain lowercase letters, numbers, and hyphens only." };
  }

  return { valid: true, data: { slug: normalized } };
}

function sanitizeTitle(value: unknown): ValidateResult {
  if (value === null || typeof value === "undefined") return { valid: true, data: { title: null } };
  if (typeof value !== "string") return { valid: false, error: "Title must be a string." };

  const normalized = value.trim();
  if (!normalized) return { valid: true, data: { title: null } };
  if (normalized.length > MAX_TITLE_LENGTH) {
    return { valid: false, error: `Title must be at most ${MAX_TITLE_LENGTH} characters.` };
  }

  return { valid: true, data: { title: normalized } };
}

function sanitizeBody(value: unknown, partial = false): ValidateResult {
  if (typeof value === "undefined" && partial) return { valid: true, data: {} };
  if (typeof value !== "string") return { valid: false, error: "Body is required." };

  const normalized = value.trim();
  if (!normalized.length) return { valid: false, error: "Body is required." };
  if (normalized.length > MAX_BODY_LENGTH) {
    return { valid: false, error: `Body exceeds ${MAX_BODY_LENGTH} characters.` };
  }

  return { valid: true, data: { body: value } };
}

function sanitizeLinkUrl(value: unknown): ValidateResult {
  if (value === null || typeof value === "undefined") return { valid: true, data: { linkUrl: null } };
  if (typeof value !== "string") return { valid: false, error: "Link URL must be a string." };

  const normalized = value.trim();
  if (!normalized) return { valid: true, data: { linkUrl: null } };
  if (normalized.length > MAX_URL_LENGTH) {
    return { valid: false, error: `Link URL must be at most ${MAX_URL_LENGTH} characters.` };
  }

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { valid: false, error: "Link URL must start with http:// or https://." };
    }
  } catch {
    return { valid: false, error: "Link URL is invalid." };
  }

  return { valid: true, data: { linkUrl: normalized } };
}

function sanitizeHashtags(value: unknown): ValidateResult {
  if (value === null || typeof value === "undefined") return { valid: true, data: { hashtags: [] } };
  if (!Array.isArray(value)) return { valid: false, error: "Hashtags must be an array." };

  const normalized = normalizeHashtagList(
    value.filter((entry): entry is string => typeof entry === "string")
  );

  return { valid: true, data: { hashtags: normalized.slice(0, 20) } };
}

function mapDraftRow(row: Record<string, unknown>): LinkedInDraftRecord {
  const imagesRaw = Array.isArray(row.images) ? row.images : [];
  const images: LinkedInImageMeta[] = imagesRaw
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === "object"))
    .map((entry) => ({
      name: typeof entry.name === "string" ? entry.name : "",
      size: typeof entry.size === "number" ? entry.size : 0,
      type: typeof entry.type === "string" ? entry.type : "image/unknown",
    }))
    .filter((entry) => entry.name);

  return {
    id: String(row.id),
    slug: typeof row.slug === "string" ? row.slug : null,
    title: typeof row.title === "string" ? row.title : null,
    body: typeof row.body === "string" ? row.body : "",
    hashtags: Array.isArray(row.hashtags)
      ? row.hashtags.filter((entry): entry is string => typeof entry === "string")
      : [],
    linkUrl: typeof row.link_url === "string" ? row.link_url : null,
    images,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function validateLinkedInDraftInput(raw: unknown, options?: ValidateOptions): ValidateResult {
  if (!raw || typeof raw !== "object") {
    return { valid: false, error: "Invalid payload." };
  }

  const partial = options?.partial === true;
  const input = raw as Record<string, unknown>;
  const result: LinkedInDraftMutationInput = {};
  const providedKeys = new Set(Object.keys(input));

  if (!partial || providedKeys.has("slug")) {
    const slug = sanitizeSlug(input.slug);
    if (!slug.valid) return slug;
    Object.assign(result, slug.data);
  }

  if (!partial || providedKeys.has("title")) {
    const title = sanitizeTitle(input.title);
    if (!title.valid) return title;
    Object.assign(result, title.data);
  }

  if (!partial || providedKeys.has("body")) {
    const body = sanitizeBody(input.body, partial);
    if (!body.valid) return body;
    Object.assign(result, body.data);
  }

  if (!partial || providedKeys.has("linkUrl")) {
    const linkUrl = sanitizeLinkUrl(input.linkUrl);
    if (!linkUrl.valid) return linkUrl;
    Object.assign(result, linkUrl.data);
  }

  if (!partial || providedKeys.has("hashtags")) {
    const hashtags = sanitizeHashtags(input.hashtags);
    if (!hashtags.valid) return hashtags;
    Object.assign(result, hashtags.data);
  }

  if (!partial || providedKeys.has("images")) {
    const images = parseImageMetaList(input.images ?? []);
    if (!images.valid) return images;
    Object.assign(result, images.data);
  }

  if (partial && Object.keys(result).length === 0) {
    return { valid: false, error: "No fields provided for update." };
  }

  return { valid: true, data: result };
}

export async function listLinkedInDrafts() {
  const client = createLinkedInAdminClient();
  if (!client) throw new Error("SUPABASE_ADMIN_NOT_CONFIGURED");

  const { data, error } = await client
    .from("linkedin_drafts")
    .select(DRAFT_SELECT_FIELDS)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapDraftRow(row as Record<string, unknown>));
}

export async function createLinkedInDraft(input: LinkedInDraftMutationInput) {
  const client = createLinkedInAdminClient();
  if (!client) throw new Error("SUPABASE_ADMIN_NOT_CONFIGURED");

  const payload = {
    slug: input.slug ?? null,
    title: input.title ?? null,
    body: input.body ?? "",
    hashtags: input.hashtags ?? [],
    link_url: input.linkUrl ?? null,
    images: input.images ?? [],
  };

  const { data, error } = await client
    .from("linkedin_drafts")
    .insert(payload)
    .select(DRAFT_SELECT_FIELDS)
    .single();

  if (error) throw new Error(error.message);
  return mapDraftRow(data as Record<string, unknown>);
}

export async function updateLinkedInDraft(id: string, input: LinkedInDraftMutationInput) {
  const client = createLinkedInAdminClient();
  if (!client) throw new Error("SUPABASE_ADMIN_NOT_CONFIGURED");

  const payload: Record<string, unknown> = {};
  if (typeof input.slug !== "undefined") payload.slug = input.slug;
  if (typeof input.title !== "undefined") payload.title = input.title;
  if (typeof input.body !== "undefined") payload.body = input.body;
  if (typeof input.hashtags !== "undefined") payload.hashtags = input.hashtags;
  if (typeof input.linkUrl !== "undefined") payload.link_url = input.linkUrl;
  if (typeof input.images !== "undefined") payload.images = input.images;

  const { data, error } = await client
    .from("linkedin_drafts")
    .update(payload)
    .eq("id", id)
    .select(DRAFT_SELECT_FIELDS)
    .single();

  if (error) throw new Error(error.message);
  return mapDraftRow(data as Record<string, unknown>);
}

export async function deleteLinkedInDraft(id: string) {
  const client = createLinkedInAdminClient();
  if (!client) throw new Error("SUPABASE_ADMIN_NOT_CONFIGURED");

  const { error } = await client.from("linkedin_drafts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export function getLinkedInDraftLimits() {
  return {
    maxBodyLength: MAX_BODY_LENGTH,
    maxImages: MAX_IMAGES,
  };
}

