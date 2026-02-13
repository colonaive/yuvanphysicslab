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
