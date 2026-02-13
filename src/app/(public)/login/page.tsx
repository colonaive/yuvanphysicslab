import { Container } from "@/components/site/Container";
import { Suspense } from "react";
import { PasscodeLoginForm } from "@/components/auth/PasscodeLoginForm";
import { verifyLabAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const isAuthed = await verifyLabAuth();
  if (isAuthed) {
    redirect("/lab");
  }

  return (
    <Container>
      <Suspense fallback={null}>
        <PasscodeLoginForm />
      </Suspense>
    </Container>
  );
}
