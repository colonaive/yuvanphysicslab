"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function sanitizeNextPath(input: string | null) {
  if (!input || !input.startsWith("/")) return "/lab";
  return input;
}

export function SupabaseLoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const nextPath = useMemo(
    () => sanitizeNextPath(searchParams.get("next")),
    [searchParams]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const origin = window.location.origin;
      const redirectTarget = `${origin}/auth/callback?next=${encodeURIComponent(
        nextPath
      )}`;

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTarget,
        },
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setSuccess("Magic link sent. Check your inbox to continue.");
      setEmail("");
    } catch {
      setError("Unable to send sign-in link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-xl space-y-6 p-8">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface2 text-accent">
          <Mail className="h-5 w-5" />
        </div>
        <h1>Sign In</h1>
        <p className="text-sm text-muted">
          Enter your author email to receive a secure magic link for the writing
          lab.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="hidden" name="next" value={nextPath} />
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-button border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/35"
            placeholder="author@example.com"
          />
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {success ? <p className="text-sm text-muted">{success}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending
            </>
          ) : (
            "Send Magic Link"
          )}
        </Button>
      </form>
    </Card>
  );
}
