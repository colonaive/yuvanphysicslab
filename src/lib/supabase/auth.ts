import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";

export async function getSupabaseUser() {
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
