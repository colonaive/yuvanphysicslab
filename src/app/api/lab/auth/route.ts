import { NextRequest, NextResponse } from "next/server";
import {
  LAB_AUTH_COOKIE,
  LAB_AUTH_MAX_AGE_SECONDS,
  LAB_AUTH_SIG_COOKIE,
  createLabSignature,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    const correctPasscode = process.env.LAB_PASSCODE;

    if (!correctPasscode) {
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    if (typeof passcode !== "string" || passcode !== correctPasscode) {
      return NextResponse.json(
        { success: false, error: "Incorrect passcode." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
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
      response.cookies.set(LAB_AUTH_SIG_COOKIE, createLabSignature(secret), {
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
