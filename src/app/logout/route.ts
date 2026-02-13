import { NextRequest, NextResponse } from "next/server";
import { LAB_AUTH_COOKIE, LAB_AUTH_SIG_COOKIE } from "@/lib/auth";

function clearAuthCookies(response: NextResponse) {
  const options = {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  response.cookies.set(LAB_AUTH_COOKIE, "", options);
  response.cookies.set(LAB_AUTH_SIG_COOKIE, "", options);
}

function redirectHome(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));
  clearAuthCookies(response);
  return response;
}

export async function GET(request: NextRequest) {
  return redirectHome(request);
}

export async function POST(request: NextRequest) {
  return redirectHome(request);
}
