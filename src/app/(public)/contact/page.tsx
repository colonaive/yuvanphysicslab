"use client";

import { useState } from "react";
import { Container } from "@/components/site/Container";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { semanticClasses } from "@/theme/tokens";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const inputClasses =
    "flex h-11 w-full rounded-button border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as never).toString(),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Container>
        <Card className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center space-y-6 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface2 text-accent">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1>Message Received</h1>
            <p className="mx-auto max-w-sm text-muted">
              Thank you for reaching out. I will respond as soon as possible.
            </p>
          </div>
          <Button onClick={() => setStatus("idle")} variant="ghost">
            Send another message
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="mx-auto max-w-3xl space-y-8 p-6 sm:p-8">
        <div className="space-y-2">
          <p className={semanticClasses.sectionMarker}>Contact</p>
          <h1>Discuss Research</h1>
          <p className="text-muted">Questions, collaboration inquiries, and reading suggestions are welcome.</p>
        </div>

        <form name="contact" method="POST" onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="form-name" value="contact" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input id="name" name="name" required placeholder="Your name" className={inputClasses} />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputClasses} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="institution" className="text-sm font-medium">
              Institution / Company (Optional)
            </label>
            <input id="institution" name="institution" placeholder="University or Laboratory" className={inputClasses} />
          </div>

          <div className="space-y-2">
            <label htmlFor="interest" className="text-sm font-medium">
              Primary Interest
            </label>
            <select id="interest" name="interest" required className={inputClasses}>
              <option value="">Select an area</option>
              <option value="geometric-dl">Geometric Deep Learning</option>
              <option value="quantum-gravity">Quantum Gravity</option>
              <option value="categorical-qm">Categorical QM</option>
              <option value="collaboration">General Collaboration</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              placeholder="What can I help you with?"
              rows={5}
              className={`${inputClasses} min-h-[9rem]`}
            />
          </div>

          {status === "error" && (
            <p className="text-sm font-medium text-red-500">
              Something went wrong. Please try again or email me directly.
            </p>
          )}

          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send Message <Send className="h-4 w-4" /></>}
          </Button>
        </form>
      </Card>
    </Container>
  );
}
