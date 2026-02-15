import { NextRequest, NextResponse } from "next/server";
import { requireLabAdminResponse } from "@/lib/lab-admin-guard";
import {
  deleteLinkedInDraft,
  getLinkedInDraftLimits,
  updateLinkedInDraft,
  validateLinkedInDraftInput,
} from "@/lib/linkedin-drafts";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireLabAdminResponse();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Draft id is required." }, { status: 400 });
    }

    const payload = await req.json();
    const validation = validateLinkedInDraftInput(payload, { partial: true });
    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { success: false, error: validation.error || "Invalid draft payload." },
        { status: 400 }
      );
    }

    const limits = getLinkedInDraftLimits();
    if (
      typeof validation.data.body === "string" &&
      validation.data.body.length > limits.maxBodyLength
    ) {
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

    const draft = await updateLinkedInDraft(id, validation.data);
    return NextResponse.json({ success: true, draft });
  } catch (error) {
    console.error("Failed to update linkedin draft:", error);
    return NextResponse.json(
      { success: false, error: "Unable to update draft." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireLabAdminResponse();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Draft id is required." }, { status: 400 });
    }

    await deleteLinkedInDraft(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete linkedin draft:", error);
    return NextResponse.json(
      { success: false, error: "Unable to delete draft." },
      { status: 500 }
    );
  }
}

