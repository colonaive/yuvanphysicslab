import { getLabSession } from "@/lib/auth";

export type LabAdminReason =
  | "ok"
  | "not_authenticated"
  | "allowlist_missing"
  | "missing_session_email"
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
  const session = await getLabSession();
  if (!session.authenticated) {
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
      email: session.email,
      reason: "allowlist_missing",
    };
  }

  const email = session.email ? normalizeEmail(session.email) : null;

  if (!email) {
    return {
      authenticated: true,
      isAdmin: false,
      email: null,
      reason: "missing_session_email",
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
