import { Container } from "@/components/site/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <Container>
      <Card className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center space-y-5 p-8 text-center">
        <h1>404</h1>
        <h2 className="text-muted">Page not found</h2>
        <p className="max-w-sm text-muted">
          The page you are looking for might have been moved, deleted, or is temporarily unavailable.
        </p>
        <Button href="/">Return Home</Button>
      </Card>
    </Container>
  );
}
