import { NextResponse } from "next/server";
import { verifyLabAuth } from "@/lib/auth";

export async function GET() {
  const authenticated = await verifyLabAuth();
  return NextResponse.json({ authenticated });
}
