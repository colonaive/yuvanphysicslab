import { NextResponse } from "next/server";
import { LAB_AUTH_COOKIE, LAB_AUTH_SIG_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(LAB_AUTH_COOKIE, "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  response.cookies.set(LAB_AUTH_SIG_COOKIE, "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
