import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface UpdatePayload {
  title?: string;
  excerpt?: string;
  content_md?: string;
  status?: "draft" | "published";
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    .select("id,author_id,published_at")
    .eq("id", id)
    .eq("author_id", user.id)
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
    .eq("author_id", user.id)
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
