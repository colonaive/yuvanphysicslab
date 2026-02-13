import { requireSupabaseUser } from "@/lib/supabase/auth";
import { Container } from "@/components/site/Container";
import { Lock } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";

export const dynamic = "force-dynamic";

export default async function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSupabaseUser();

  return (
    <>
      <SiteHeader />
      <Container className="pt-5">
        <div className="flex items-center gap-2 rounded-button border border-border bg-surface2 px-3 py-2 text-xs text-muted">
          <Lock className="h-3.5 w-3.5 text-accent" />
          <p>
            🔒 Writing Lab (Private) — drafts are not visible publicly until published.
          </p>
        </div>
      </Container>
      {children}
    </>
  );
}
