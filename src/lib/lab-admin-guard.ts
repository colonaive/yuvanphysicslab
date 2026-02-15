import { NextResponse } from "next/server";
import { getLabAdminState } from "@/lib/admin";

export async function requireLabAdminResponse() {
  const state = await getLabAdminState();

  if (!state.authenticated) {
    return {
      ok: false as const,
      response: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!state.isAdmin) {
    return {
      ok: false as const,
      response: NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ok: true as const,
  };
}

