import { redirect } from "next/navigation";
import { createLabDraft } from "@/lib/posts";

export default async function LabNewDraftPage() {
  const draftId = await createLabDraft();
  if (!draftId) {
    redirect("/lab");
  }

  redirect(`/lab/edit/${draftId}`);
}
