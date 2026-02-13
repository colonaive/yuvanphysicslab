import { NextResponse } from "next/server";
import { getSupabaseUser } from "@/lib/supabase/auth";

export async function GET() {
  const user = await getSupabaseUser();
  return NextResponse.json({ authenticated: Boolean(user) });
}
