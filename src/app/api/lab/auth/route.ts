import { NextRequest, NextResponse } from "next/server";
import { sign } from "cookie-signature";

export async function POST(req: NextRequest) {
    try {
        const { passcode } = await req.json();
        const correctPasscode = process.env.LAB_PASSCODE;
        const secret = process.env.LAB_SESSION_SECRET;

        if (!correctPasscode || !secret) {
            console.error("Missing LAB_PASSCODE or LAB_SESSION_SECRET");
            return NextResponse.json({ success: false, error: "Server Configuration Error" }, { status: 500 });
        }

        if (passcode === correctPasscode) {
            // Include expiration timestamp in the value (7 days)
            const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
            const sessionValue = JSON.stringify({ authed: true, exp: expiresAt });

            // Sign the value
            const signedValue = sign(sessionValue, secret);

            const response = NextResponse.json({ success: true });

            response.cookies.set("lab_auth", signedValue, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            });

            return response;
        } else {
            return NextResponse.json({ success: false }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
