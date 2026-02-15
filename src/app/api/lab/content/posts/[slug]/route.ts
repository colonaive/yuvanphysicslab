import { NextRequest, NextResponse } from "next/server";
import { getLabAdminState } from "@/lib/admin";
import { updatePublicPost, type PublicPostType } from "@/lib/content";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

function adminErrorResponse(authenticated: boolean) {
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ error: "Not authorized" }, { status: 403 });
}

function normalizePostType(value: unknown): PublicPostType {
  if (value === "note" || value === "paper" || value === "post") {
    return value;
  }
  return "note";
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const adminState = await getLabAdminState();
  if (!adminState.isAdmin) {
    return adminErrorResponse(adminState.authenticated);
  }

  const { slug } = await params;

  try {
    const body = await request.json();
    const type = normalizePostType(body.type);
    const title = typeof body.title === "string" ? body.title : "";
    const excerpt = typeof body.excerpt === "string" ? body.excerpt : "";
    const content_mdx = typeof body.content_mdx === "string" ? body.content_mdx : "";
    const published = Boolean(body.published);
    const published_at =
      typeof body.published_at === "string" && body.published_at.trim().length > 0
        ? body.published_at
        : null;

    const updated = await updatePublicPost(slug, {
      type,
      title,
      excerpt,
      content_mdx,
      published,
      published_at,
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
