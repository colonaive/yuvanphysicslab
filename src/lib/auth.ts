import { sign, unsign } from "cookie-signature";
import { cookies } from "next/headers";

export const LAB_AUTH_COOKIE = "lab_auth";
export const LAB_AUTH_SIG_COOKIE = "lab_auth_sig";
export const LAB_AUTH_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

interface SignedLabPayload {
  authed: true;
  exp: number;
}

export function createLabSignature(secret: string) {
  const payload: SignedLabPayload = {
    authed: true,
    exp: Date.now() + LAB_AUTH_MAX_AGE_SECONDS * 1000,
  };

  return sign(JSON.stringify(payload), secret);
}

export function verifyLabSignature(value: string, secret: string) {
  const unsignedValue = unsign(value, secret);
  if (unsignedValue === false) return false;

  try {
    const payload = JSON.parse(unsignedValue) as SignedLabPayload;
    return payload.authed === true && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function verifyLabAuth() {
  const cookieStore = await cookies();
  const labAuth = cookieStore.get(LAB_AUTH_COOKIE)?.value;

  if (labAuth !== "1") return false;

  const secret = process.env.LAB_SESSION_SECRET;
  if (!secret) return true;

  const signedCookie = cookieStore.get(LAB_AUTH_SIG_COOKIE)?.value;
  if (!signedCookie) return false;

  return verifyLabSignature(signedCookie, secret);
}
