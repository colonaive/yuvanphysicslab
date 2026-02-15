import { NextRequest, NextResponse } from "next/server";
import { requireLabAdminResponse } from "@/lib/lab-admin-guard";
import {
  createLinkedInDraft,
  getLinkedInDraftLimits,
  listLinkedInDrafts,
  validateLinkedInDraftInput,
} from "@/lib/linkedin-drafts";

export async function GET() {
  const auth = await requireLabAdminResponse();
  if (!auth.ok) return auth.response;

  try {
    const drafts = await listLinkedInDrafts();
    return NextResponse.json({ success: true, drafts });
  } catch (error) {
    console.error("Failed to list linkedin drafts:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load drafts." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireLabAdminResponse();
  if (!auth.ok) return auth.response;

  try {
    const payload = await req.json();
    const validation = validateLinkedInDraftInput(payload, { partial: false });
    if (!validation.valid || !validation.data?.body) {
      return NextResponse.json(
        { success: false, error: validation.error || "Invalid draft payload." },
        { status: 400 }
      );
    }

    const limits = getLinkedInDraftLimits();
    if (validation.data.body.length > limits.maxBodyLength) {
      return NextResponse.json(
        { success: false, error: `Body exceeds ${limits.maxBodyLength} characters.` },
        { status: 400 }
      );
    }

    if ((validation.data.images ?? []).length > limits.maxImages) {
      return NextResponse.json(
        { success: false, error: `No more than ${limits.maxImages} images are allowed.` },
        { status: 400 }
      );
    }

    const draft = await createLinkedInDraft(validation.data);
    return NextResponse.json({ success: true, draft }, { status: 201 });
  } catch (error) {
    console.error("Failed to create linkedin draft:", error);
    return NextResponse.json(
      { success: false, error: "Unable to create draft." },
      { status: 500 }
    );
  }
}

