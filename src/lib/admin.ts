import { verifyLabAuth } from "@/lib/auth";
import { getSupabaseUser } from "@/lib/supabase/auth";

export type LabAdminReason =
  | "ok"
  | "not_authenticated"
  | "allowlist_missing"
  | "missing_supabase_user"
  | "email_not_allowed";

export interface LabAdminState {
  authenticated: boolean;
  isAdmin: boolean;
  email: string | null;
  reason: LabAdminReason;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function getAdminAllowlist() {
  const raw = [process.env.ADMIN_EMAIL, process.env.ADMIN_EMAILS]
    .filter(Boolean)
    .join(",");

  const emails = raw
    .split(",")
    .map((entry) => normalizeEmail(entry))
    .filter(Boolean);

  return new Set(emails);
}

export async function getLabAdminState(): Promise<LabAdminState> {
  const authenticated = await verifyLabAuth();
  if (!authenticated) {
    return {
      authenticated: false,
      isAdmin: false,
      email: null,
      reason: "not_authenticated",
    };
  }

  const allowlist = getAdminAllowlist();
  if (allowlist.size === 0) {
    return {
      authenticated: true,
      isAdmin: false,
      email: null,
      reason: "allowlist_missing",
    };
  }

  const user = await getSupabaseUser();
  const email = user?.email ? normalizeEmail(user.email) : null;

  if (!email) {
    return {
      authenticated: true,
      isAdmin: false,
      email: null,
      reason: "missing_supabase_user",
    };
  }

  if (!allowlist.has(email)) {
    return {
      authenticated: true,
      isAdmin: false,
      email,
      reason: "email_not_allowed",
    };
  }

  return {
    authenticated: true,
    isAdmin: true,
    email,
    reason: "ok",
  };
}

export async function isLabAdmin() {
  const state = await getLabAdminState();
  return state.isAdmin;
}
