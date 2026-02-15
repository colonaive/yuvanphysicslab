import { sign, unsign } from "cookie-signature";
import { cookies } from "next/headers";

export const LAB_AUTH_COOKIE = "lab_auth";
export const LAB_AUTH_SIG_COOKIE = "lab_auth_sig";
export const LAB_AUTH_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

interface SignedLabPayload {
  authed: true;
  email: string;
  isAdmin: boolean;
  exp: number;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export interface LabSessionState {
  authenticated: boolean;
  email: string | null;
  isAdmin: boolean;
}

export function createLabSignature(secret: string, email: string, isAdmin: boolean) {
  const payload: SignedLabPayload = {
    authed: true,
    email: normalizeEmail(email),
    isAdmin,
    exp: Date.now() + LAB_AUTH_MAX_AGE_SECONDS * 1000,
  };

  return sign(JSON.stringify(payload), secret);
}

export function verifyLabSignature(value: string, secret: string) {
  const unsignedValue = unsign(value, secret);
  if (unsignedValue === false) return false;

  try {
    const payload = JSON.parse(unsignedValue) as SignedLabPayload;
    const email = typeof payload.email === "string" ? normalizeEmail(payload.email) : "";
    if (!email) return false;

    const isAdmin = payload.isAdmin === true;
    const isValid = payload.authed === true && payload.exp > Date.now();
    if (!isValid) return false;

    return {
      ...payload,
      email,
      isAdmin,
    };
  } catch {
    return false;
  }
}

export async function getLabSession(): Promise<LabSessionState> {
  const cookieStore = await cookies();
  const labAuth = cookieStore.get(LAB_AUTH_COOKIE)?.value;

  if (labAuth !== "1") {
    return {
      authenticated: false,
      email: null,
      isAdmin: false,
    };
  }

  const secret = process.env.LAB_SESSION_SECRET;
  if (!secret) {
    return {
      authenticated: true,
      email: null,
      isAdmin: false,
    };
  }

  const signedCookie = cookieStore.get(LAB_AUTH_SIG_COOKIE)?.value;
  if (!signedCookie) {
    return {
      authenticated: false,
      email: null,
      isAdmin: false,
    };
  }

  const payload = verifyLabSignature(signedCookie, secret);
  if (!payload) {
    return {
      authenticated: false,
      email: null,
      isAdmin: false,
    };
  }

  return {
    authenticated: true,
    email: payload.email,
    isAdmin: payload.isAdmin,
  };
}

export async function verifyLabAuth() {
  const session = await getLabSession();
  return session.authenticated;
}
