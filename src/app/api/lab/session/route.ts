import { NextResponse } from "next/server";
import { getLabAdminState } from "@/lib/admin";

export async function GET() {
  const state = await getLabAdminState();
  return NextResponse.json({
    authenticated: state.authenticated,
    isAdmin: state.isAdmin,
  });
}
