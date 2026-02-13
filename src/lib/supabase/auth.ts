import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";

function hasSupabaseEnv() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

export async function getSupabaseUser() {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) return null;
  return data.user;
}

export async function requireSupabaseUser() {
  const user = await getSupabaseUser();
  if (!user) redirect("/login");
  return user;
}
