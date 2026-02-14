"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function sanitizeNextPath(input: string | null) {
  if (!input || !input.startsWith("/")) return "/lab";
  return input;
}

export function PasscodeLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(
    () => sanitizeNextPath(searchParams.get("next")),
    [searchParams]
  );

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/lab/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(data.error || "Incorrect passcode.");
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-lg space-y-6 p-8">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface2 text-accent">
          <Lock className="h-5 w-5" />
        </div>
        <h1>Private Lab Access</h1>
        <p className="text-sm text-muted">
          Enter your lab passcode to access private research routes.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="passcode" className="text-sm font-medium">
            Passcode
          </label>
          <div className="relative">
            <input
              id="passcode"
              type={showPasscode ? "text" : "password"}
              required
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              className="h-11 w-full rounded-button border border-border bg-surface px-3 pr-11 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/35"
              placeholder="Enter passcode"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPasscode((visible) => !visible)}
              className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-r-button text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
              title={showPasscode ? "Hide passcode" : "Show passcode"}
            >
              {showPasscode ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Entering
            </>
          ) : (
            "Enter Lab"
          )}
        </Button>
      </form>
    </Card>
  );
}
