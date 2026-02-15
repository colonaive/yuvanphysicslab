import { redirect } from "next/navigation";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { getLabAdminState } from "@/lib/admin";
import { LinkedInComposer } from "@/components/lab/linkedin/LinkedInComposer";

export const dynamic = "force-dynamic";

export default async function LabLinkedInPage() {
  const adminState = await getLabAdminState();

  if (!adminState.authenticated) {
    redirect("/login?next=/lab/linkedin");
  }

  if (!adminState.isAdmin) {
    return (
      <Container className="py-12">
        <Card className="mx-auto max-w-2xl space-y-3 p-6 text-center">
          <h1 className="text-2xl">Not authorized</h1>
          <p className="text-sm text-muted">
            The LinkedIn Composer is available only to admin accounts listed in
            <code className="mx-1 rounded bg-surface2 px-1.5 py-0.5 text-xs">ADMIN_EMAILS</code>
            or
            <code className="mx-1 rounded bg-surface2 px-1.5 py-0.5 text-xs">ADMIN_EMAIL</code>.
          </p>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <LinkedInComposer />
    </Container>
  );
}

