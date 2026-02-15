import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifyLabAuth } from "@/lib/auth";

interface UpdatePayload {
  title?: string;
  excerpt?: string;
  content_md?: string;
  status?: "draft" | "published";
}

function createLabWriteClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceRoleKey) {
    return createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthed = await verifyLabAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const adminClient = createLabWriteClient();
  let supabase: SupabaseClient;

  if (adminClient) {
    supabase = adminClient;
  } else {
    try {
      supabase = await createSupabaseServerClient();
    } catch {
      return NextResponse.json(
        { error: "Lab write access is not configured." },
        { status: 500 }
      );
    }
  }

  const payload = (await req.json()) as UpdatePayload;
  const title = (payload.title || "").trim();
  const excerpt = (payload.excerpt || "").trim();
  const contentMd = payload.content_md ?? "";
  const status = payload.status ?? "draft";
  const isValidStatus = status === "draft" || status === "published";

  if (!title || !contentMd) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 }
    );
  }

  if (!isValidStatus) {
    return NextResponse.json(
      { error: "Invalid post status." },
      { status: 400 }
    );
  }

  const nowIso = new Date().toISOString();

  const {
    data: existingPost,
    error: existingError,
  } = await supabase
    .from("posts")
    .select("id,published_at")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json(
      { error: "Failed to load post for update." },
      { status: 500 }
    );
  }

  if (!existingPost) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const publishedAt =
    status === "published"
      ? existingPost.published_at || nowIso
      : null;

  const { data, error } = await supabase
    .from("posts")
    .update({
      title,
      excerpt: excerpt || null,
      content_md: contentMd,
      status,
      updated_at: nowIso,
      published_at: publishedAt,
    })
    .eq("id", id)
    .select("id,title,slug,status,updated_at,published_at")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to save changes." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, post: data });
}
