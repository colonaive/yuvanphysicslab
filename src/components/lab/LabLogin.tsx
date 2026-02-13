"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function LabLogin() {
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/lab/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ passcode }),
            });

            if (res.ok) {
                router.refresh(); // Refresh to trigger server-side re-check
            } else {
                setError("Incorrect passcode");
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <Card className="w-full max-w-md space-y-8 p-6 sm:p-8">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface2 text-muted">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl">Private Lab Access</h1>
                    <p className="mt-2 text-sm text-muted">Secure entry for research drafts and tools.</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-button shadow-soft">
                        <input
                            type="password"
                            required
                            className="relative block w-full rounded-button border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted focus:z-10 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/45 transition-all"
                            placeholder="Enter lab passcode"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="rounded-button border border-red-400/30 bg-red-500/10 p-3 text-center text-sm text-red-500 animate-in fade-in zoom-in duration-200">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                Enter Lab <ArrowRight className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
