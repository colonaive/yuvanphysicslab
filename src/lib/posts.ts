import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./supabase/server";

export type PostStatus = "draft" | "published";

export interface CmsPost {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_md: string;
  status: PostStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

const postSelectFields =
  "id,author_id,title,slug,excerpt,content_md,status,created_at,updated_at,published_at";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

function createPublicPostsClient() {
  const config = getSupabaseConfig();
  if (!config) return null;
  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function createLabAdminClient() {
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

async function createLabReadClient() {
  const adminClient = createLabAdminClient();
  if (adminClient) return adminClient;

  if (!getSupabaseConfig()) return null;

  try {
    return await createSupabaseServerClient();
  } catch {
    return null;
  }
}

export async function getLabPosts(): Promise<CmsPost[]> {
  const client = await createLabReadClient();
  if (!client) return [];

  const { data, error } = await client
    .from("posts")
    .select(postSelectFields)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to load lab posts:", error.message);
    return [];
  }

  return (data || []) as CmsPost[];
}

export async function getLabPostById(id: string): Promise<CmsPost | null> {
  const client = await createLabReadClient();
  if (!client) return null;

  const { data, error } = await client
    .from("posts")
    .select(postSelectFields)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load lab post:", error.message);
    return null;
  }

  return (data as CmsPost | null) ?? null;
}

export async function createLabDraft(): Promise<string | null> {
  const adminClient = createLabAdminClient();
  if (!adminClient) return null;

  let authorId = process.env.LAB_AUTHOR_ID ?? null;
  if (!authorId) {
    const { data: firstPost } = await adminClient
      .from("posts")
      .select("author_id")
      .limit(1)
      .maybeSingle();
    authorId = firstPost?.author_id ?? null;
  }

  if (!authorId) {
    console.error("LAB_AUTHOR_ID is required to create drafts when no posts exist.");
    return null;
  }

  const now = new Date();
  const slug = `untitled-${now.getTime()}`;
  const nowIso = now.toISOString();

  const { data, error } = await adminClient
    .from("posts")
    .insert({
      author_id: authorId,
      title: "Untitled Draft",
      slug,
      excerpt: null,
      content_md: "# Untitled Draft\n\nStart writing here.",
      status: "draft",
      created_at: nowIso,
      updated_at: nowIso,
      published_at: null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Failed to create lab draft:", error?.message);
    return null;
  }

  return data.id as string;
}

export async function getAuthorPosts(userId: string): Promise<CmsPost[]> {
  if (!getSupabaseConfig()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(postSelectFields)
    .eq("author_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to load author posts:", error.message);
    return [];
  }

  return (data || []) as CmsPost[];
}

export async function getAuthorPostById(
  userId: string,
  id: string
): Promise<CmsPost | null> {
  if (!getSupabaseConfig()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(postSelectFields)
    .eq("id", id)
    .eq("author_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load post:", error.message);
    return null;
  }

  return (data as CmsPost | null) ?? null;
}

export async function getPublishedPosts(): Promise<CmsPost[]> {
  const supabase = createPublicPostsClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select(postSelectFields)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to load published posts:", error.message);
    return [];
  }

  return (data || []) as CmsPost[];
}

export async function getPublishedPostBySlug(
  slug: string
): Promise<CmsPost | null> {
  const supabase = createPublicPostsClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select(postSelectFields)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Failed to load published post:", error.message);
    return null;
  }

  return (data as CmsPost | null) ?? null;
}

export async function getPublishedPostSlugs(): Promise<string[]> {
  const supabase = createPublicPostsClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");

  if (error) {
    console.error("Failed to load published slugs:", error.message);
    return [];
  }

  return (data || []).map((item) => item.slug);
}
