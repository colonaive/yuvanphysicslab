import { Container } from "@/components/site/Container";
import { Lock } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { verifyLabAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthed = await verifyLabAuth();
  if (!isAuthed) {
    redirect("/login?next=/lab");
  }

  return (
    <>
      <SiteHeader />
      <Container className="pt-5">
        <div className="flex items-center gap-2 rounded-button border border-border bg-surface2 px-3 py-2 text-xs text-muted">
          <Lock className="h-3.5 w-3.5 text-accent" />
          <p>Private Lab: drafts and tools are visible only after login.</p>
        </div>
      </Container>
      {children}
    </>
  );
}
