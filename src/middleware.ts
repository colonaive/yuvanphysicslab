import { NextRequest, NextResponse } from "next/server";

function isPrivatePath(pathname: string) {
  return (
    pathname.startsWith("/lab") ||
    pathname.startsWith("/draft") ||
    pathname.startsWith("/workbench") ||
    pathname.startsWith("/api/research") ||
    pathname.startsWith("/api/lab/posts") ||
    pathname.startsWith("/api/lab/content") ||
    pathname.startsWith("/api/lab/linkedin")
  );
}

function isPublicBypass(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/public/") ||
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  );
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isPublicBypass(pathname) || !isPrivatePath(pathname)) {
    return NextResponse.next();
  }

  const isAuthed = req.cookies.get("lab_auth")?.value === "1";
  if (isAuthed) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", req.url);
  const nextPath = `${pathname}${search || ""}`;
  loginUrl.searchParams.set("next", nextPath);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/:path*"],
};
