import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LabEditDraftPage({ params }: PageProps) {
  await params;
  redirect("/lab/editor");
}
