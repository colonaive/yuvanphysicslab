import { NextRequest, NextResponse } from "next/server";
import {
  LAB_AUTH_COOKIE,
  LAB_AUTH_MAX_AGE_SECONDS,
  LAB_AUTH_SIG_COOKIE,
  createLabSignature,
} from "@/lib/auth";
import { getAdminAllowlist } from "@/lib/admin";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const { email, passcode } = await req.json();
    const correctPasscode = process.env.LAB_PASSCODE;

    if (!correctPasscode) {
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    if (typeof email !== "string" || normalizeEmail(email).length === 0) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    if (typeof passcode !== "string" || passcode !== correctPasscode) {
      return NextResponse.json(
        { success: false, error: "Incorrect passcode." },
        { status: 401 }
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const allowlist = getAdminAllowlist();
    const isAdmin = allowlist.has(normalizedEmail);

    const response = NextResponse.json({ success: true, isAdmin });
    const secure = process.env.NODE_ENV === "production";

    response.cookies.set(LAB_AUTH_COOKIE, "1", {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: LAB_AUTH_MAX_AGE_SECONDS,
    });

    const secret = process.env.LAB_SESSION_SECRET;
    if (secret) {
      response.cookies.set(LAB_AUTH_SIG_COOKIE, createLabSignature(secret, normalizedEmail, isAdmin), {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
        maxAge: LAB_AUTH_MAX_AGE_SECONDS,
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
