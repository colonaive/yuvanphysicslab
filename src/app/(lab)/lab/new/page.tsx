import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireSupabaseUser } from "@/lib/supabase/auth";

export default async function LabNewDraftPage() {
  const user = await requireSupabaseUser();
  const supabase = await createSupabaseServerClient();

  const now = new Date();
  const slug = `untitled-${now.getTime()}`;
  const nowIso = now.toISOString();

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      title: "Untitled Draft",
      slug,
      excerpt: null,
      content_md: "# Untitled Draft\n\nStart writing here.",
      status: "draft",
      created_at: nowIso,
      updated_at: nowIso,
      published_at: null,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/lab");
  }

  redirect(`/lab/edit/${data.id}`);
}
