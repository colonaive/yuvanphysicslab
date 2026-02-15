import { createClient } from "@supabase/supabase-js";

const LIST_SELECT_FIELDS = "id,slug,title,updated_at,published_at,type";
const DETAIL_SELECT_FIELDS = "id,slug,title,content_mdx,updated_at,published_at,type";

export interface ResearchNoteSummary {
  id: string;
  slug: string;
  title: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface ResearchNoteDetail {
  id: string;
  slug: string;
  title: string;
  contentMd: string;
  updatedAt: string;
  publishedAt: string | null;
}

function createLabAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_ADMIN_NOT_CONFIGURED");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function mapSummaryRow(row: Record<string, unknown>): ResearchNoteSummary {
  return {
    id: String(row.id),
    slug: typeof row.slug === "string" ? row.slug : "",
    title: typeof row.title === "string" ? row.title : "Untitled note",
    updatedAt: String(row.updated_at),
    publishedAt: typeof row.published_at === "string" ? row.published_at : null,
  };
}

function mapDetailRow(row: Record<string, unknown>): ResearchNoteDetail {
  return {
    id: String(row.id),
    slug: typeof row.slug === "string" ? row.slug : "",
    title: typeof row.title === "string" ? row.title : "Untitled note",
    contentMd: typeof row.content_mdx === "string" ? row.content_mdx : "",
    updatedAt: String(row.updated_at),
    publishedAt: typeof row.published_at === "string" ? row.published_at : null,
  };
}

export async function listResearchNoteSummaries() {
  const client = createLabAdminClient();
  const { data, error } = await client
    .from("public_posts")
    .select(LIST_SELECT_FIELDS)
    .eq("type", "note")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapSummaryRow(row as Record<string, unknown>));
}

export async function getResearchNoteById(id: string) {
  const client = createLabAdminClient();
  const { data, error } = await client
    .from("public_posts")
    .select(DETAIL_SELECT_FIELDS)
    .eq("id", id)
    .eq("type", "note")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapDetailRow(data as Record<string, unknown>);
}
