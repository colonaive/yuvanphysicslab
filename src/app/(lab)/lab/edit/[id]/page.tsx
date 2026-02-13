import { notFound } from "next/navigation";
import { Container } from "@/components/site/Container";
import { PostEditorForm } from "@/components/lab/PostEditorForm";
import { getLabPostById } from "@/lib/posts";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LabEditDraftPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getLabPostById(id);

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
