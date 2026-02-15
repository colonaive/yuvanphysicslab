import { NextRequest, NextResponse } from "next/server";
import { requireLabAdminResponse } from "@/lib/lab-admin-guard";
import { listResearchNoteSummaries } from "@/lib/lab-research-notes";

export async function GET(request: NextRequest) {
  const auth = await requireLabAdminResponse();
  if (!auth.ok) return auth.response;

  const type = request.nextUrl.searchParams.get("type");
  if (type && type !== "research-notes") {
    return NextResponse.json(
      { success: false, error: "Invalid type. Expected 'research-notes'." },
      { status: 400 }
    );
  }

  try {
    const posts = (await listResearchNoteSummaries()).map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      updated_at: post.updatedAt,
      published_at: post.publishedAt,
    }));
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Failed to list research notes:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load research notes." },
      { status: 500 }
    );
  }
}
