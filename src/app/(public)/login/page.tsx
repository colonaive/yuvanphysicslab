import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";

export default function LoginPage() {
  return (
    <Container>
      <Card className="mx-auto max-w-xl space-y-6 p-8 text-center">
        <p className={semanticClasses.sectionMarker + " justify-center"}>
          <Lock className="h-4 w-4 text-accent" />
          Private Writing Lab
        </p>
        <h1>Sign In</h1>
        <p className="text-muted">
          Access to the writing workspace is currently controlled through lab
          authentication.
        </p>
        <div className="flex justify-center">
          <Button href="/lab">Continue to Lab</Button>
        </div>
      </Card>
    </Container>
  );
}
