import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { passcode } = await req.json();
        const correctPasscode = process.env.LAB_PASSCODE;

        if (!correctPasscode) {
            // If no passcode set in env, always allow
            return NextResponse.json({ success: true });
        }

        if (passcode === correctPasscode) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
