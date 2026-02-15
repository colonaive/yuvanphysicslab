import { NextRequest, NextResponse } from "next/server";
import { getLabAdminState } from "@/lib/admin";
import { updatePublicPage } from "@/lib/content";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

function adminErrorResponse(authenticated: boolean) {
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ error: "Not authorized" }, { status: 403 });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const adminState = await getLabAdminState();
  if (!adminState.isAdmin) {
    return adminErrorResponse(adminState.authenticated);
  }

  const { slug } = await params;

  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title : "";
    const content_mdx = typeof body.content_mdx === "string" ? body.content_mdx : "";

    const updated = await updatePublicPage(slug, { title, content_mdx });
    return NextResponse.json({ success: true, page: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update page.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
