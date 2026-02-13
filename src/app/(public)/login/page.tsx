import { Container } from "@/components/site/Container";
import { Suspense } from "react";
import { SupabaseLoginForm } from "@/components/auth/SupabaseLoginForm";

export default function LoginPage() {
  return (
    <Container>
      <Suspense fallback={null}>
        <SupabaseLoginForm />
      </Suspense>
    </Container>
  );
}
