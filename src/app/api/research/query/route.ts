import { NextRequest, NextResponse } from "next/server";
import { verifyLabAuth } from "@/lib/auth";
import { queryResearch } from "@/lib/ai-adapter";

export async function POST(req: NextRequest) {
    const isAuthed = await verifyLabAuth();
    if (!isAuthed) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { provider, query, cite } = await req.json();

        if (!query) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 });
        }

        const result = await queryResearch(provider, query, cite);

        if ("error" in result) {
            return NextResponse.json(result, { status: result.code === "PROVIDER_NOT_CONFIGURED" ? 503 : 500 });
        }

        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
