import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getLabAdminState } from "@/lib/admin";

export type PublicPostType = "note" | "paper" | "post";

export interface PublicPageRecord {
  id: string;
  slug: string;
  title: string;
  content_mdx: string;
  updated_at: string;
}

export interface PublicPostRecord {
  id: string;
  slug: string;
  type: PublicPostType;
  title: string;
  excerpt: string;
  content_mdx: string;
  published: boolean;
  published_at: string | null;
  updated_at: string;
}

interface UpdatePageInput {
  title: string;
  content_mdx: string;
}

interface UpdatePostInput {
  type: PublicPostType;
  title: string;
  excerpt: string;
  content_mdx: string;
  published: boolean;
  published_at?: string | null;
}

const pageSelect = "id,slug,title,content_mdx,updated_at";
const postSelect =
  "id,slug,type,title,excerpt,content_mdx,published,published_at,updated_at";

function getSupabasePublicConfig() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

function createPublicContentClient() {
  const config = getSupabasePublicConfig();
  if (!config) return null;
  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function createAdminContentClient() {
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

export async function listPublicPages() {
  noStore();
  const client = createPublicContentClient();
  if (!client) return [] as PublicPageRecord[];

  const { data, error } = await client
    .from("public_pages")
    .select(pageSelect)
    .order("slug", { ascending: true });

  if (error) {
    console.error("Failed to list public pages:", error.message);
    return [];
  }

  return (data || []) as PublicPageRecord[];
}

export async function getPublicPage(slug: string) {
  noStore();
  const client = createPublicContentClient();
  if (!client) return null;

  const { data, error } = await client
    .from("public_pages")
    .select(pageSelect)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Failed to load public page "${slug}":`, error.message);
    return null;
  }

  return (data as PublicPageRecord | null) ?? null;
}

export async function listPublicPosts(options?: {
  includeUnpublished?: boolean;
  type?: PublicPostType;
}) {
  noStore();
  const shouldUseAdminClient = Boolean(options?.includeUnpublished);
  let client = createPublicContentClient();

  if (shouldUseAdminClient) {
    const adminState = await getLabAdminState();
    if (adminState.isAdmin) {
      client = createAdminContentClient() ?? client;
    }
  }

  if (!client) return [] as PublicPostRecord[];

  let query = client.from("public_posts").select(postSelect);
  if (options?.type) query = query.eq("type", options.type);
  if (!options?.includeUnpublished) query = query.eq("published", true);

  const { data, error } = await query
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to list public posts:", error.message);
    return [];
  }

  return (data || []) as PublicPostRecord[];
}

export async function listLatestPublicPosts(options?: {
  limit?: number;
  type?: PublicPostType;
}) {
  noStore();
  const client = createPublicContentClient();
  if (!client) return [] as PublicPostRecord[];

  let query = client.from("public_posts").select(postSelect).eq("published", true);
  if (options?.type) query = query.eq("type", options.type);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to list latest public posts:", error.message);
    return [];
  }

  return (data || []) as PublicPostRecord[];
}

export async function getPublicPost(
  slug: string,
  options?: { includeUnpublished?: boolean; type?: PublicPostType }
) {
  noStore();
  const shouldUseAdminClient = Boolean(options?.includeUnpublished);
  let client = createPublicContentClient();

  if (shouldUseAdminClient) {
    const adminState = await getLabAdminState();
    if (adminState.isAdmin) {
      client = createAdminContentClient() ?? client;
    }
  }

  if (!client) return null;

  let query = client.from("public_posts").select(postSelect).eq("slug", slug);
  if (options?.type) query = query.eq("type", options.type);
  if (!options?.includeUnpublished) query = query.eq("published", true);

  const { data, error } = await query.maybeSingle();
  if (error) {
    console.error(`Failed to load public post "${slug}":`, error.message);
    return null;
  }

  return (data as PublicPostRecord | null) ?? null;
}

export async function updatePublicPage(slug: string, input: UpdatePageInput) {
  const adminState = await getLabAdminState();
  if (!adminState.isAdmin) {
    throw new Error("NOT_AUTHORIZED");
  }

  const client = createAdminContentClient();
  if (!client) throw new Error("SUPABASE_ADMIN_NOT_CONFIGURED");

  const { data, error } = await client
    .from("public_pages")
    .upsert(
      {
        slug,
        title: input.title.trim(),
        content_mdx: input.content_mdx,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    )
    .select(pageSelect)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PublicPageRecord;
}

export async function updatePublicPost(slug: string, input: UpdatePostInput) {
  const adminState = await getLabAdminState();
  if (!adminState.isAdmin) {
    throw new Error("NOT_AUTHORIZED");
  }

  const client = createAdminContentClient();
  if (!client) throw new Error("SUPABASE_ADMIN_NOT_CONFIGURED");

  const payload = {
    slug,
    type: input.type,
    title: input.title.trim(),
    excerpt: input.excerpt,
    content_mdx: input.content_mdx,
    published: input.published,
    published_at: input.published_at ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client
    .from("public_posts")
    .upsert(payload, { onConflict: "slug" })
    .select(postSelect)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PublicPostRecord;
}
