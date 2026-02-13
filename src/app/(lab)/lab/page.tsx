import { LabDashboard } from "@/components/lab/LabDashboard";
import { Container } from "@/components/site/Container";
import { getLabPosts } from "@/lib/posts";

export default async function LabPage() {
  const posts = await getLabPosts();
  const drafts = posts.filter((post) => post.status === "draft");
  const published = posts.filter((post) => post.status === "published");

  return (
    <Container className="py-12">
      <LabDashboard drafts={drafts} published={published} />
    </Container>
  );
}
