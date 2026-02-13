import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";

export default function ContactThanksPage() {
  return (
    <Container>
      <Card className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center space-y-5 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-accent" />
        <p className={semanticClasses.sectionMarker}>Submission Received</p>
        <h1>Thank You</h1>
        <p className="max-w-md text-muted">
          Your message has been received. I&apos;ll review it and respond when possible.
        </p>
        <Button href="/">Return Home</Button>
      </Card>
    </Container>
  );
}
