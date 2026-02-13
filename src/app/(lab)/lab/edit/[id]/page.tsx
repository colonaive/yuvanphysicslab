import { notFound } from "next/navigation";
import { Container } from "@/components/site/Container";
import { PostEditorForm } from "@/components/lab/PostEditorForm";
import { getAuthorPostById } from "@/lib/posts";
import { requireSupabaseUser } from "@/lib/supabase/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LabEditDraftPage({ params }: PageProps) {
  const { id } = await params;
  const user = await requireSupabaseUser();
  const post = await getAuthorPostById(user.id, id);

  if (!post) {
    notFound();
  }

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-4xl">
        <PostEditorForm post={post} />
      </div>
    </Container>
  );
}
