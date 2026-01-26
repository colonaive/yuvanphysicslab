import { unsign } from "cookie-signature";
import { cookies } from "next/headers";

export async function verifyLabAuth() {
    const cookieStore = await cookies();
    const labAuth = cookieStore.get("lab_auth");
    const secret = process.env.LAB_SESSION_SECRET;

    if (!labAuth || !secret) return false;

    const unsignedValue = unsign(labAuth.value, secret);

    if (unsignedValue === false) return false;

    try {
        const payload = JSON.parse(unsignedValue);
        // Check expiration
        if (payload.exp && Date.now() < payload.exp) {
            return true;
        }
    } catch (e) {
        return false;
    }

    return false;
}
