import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        const supabase = await createSupabaseServerClient();
        await supabase.auth.signOut();
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("lab_auth", "", {
        httpOnly: true,
        path: "/",
        expires: new Date(0),
    });
    
    return response;
}
