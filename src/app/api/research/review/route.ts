import { NextRequest, NextResponse } from "next/server";
import { verifyLabAuth } from "@/lib/auth";
import { reviewDraft } from "@/lib/ai-adapter";

export async function POST(req: NextRequest) {
    const isAuthed = await verifyLabAuth();
    if (!isAuthed) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { draftText, researchContext } = await req.json();

        if (!draftText) {
            return NextResponse.json({ error: "Draft text is required" }, { status: 400 });
        }

        const result = await reviewDraft(draftText, researchContext);

        if ("error" in result) {
            return NextResponse.json(result, { status: result.code === "PROVIDER_NOT_CONFIGURED" ? 503 : 500 });
        }

        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
