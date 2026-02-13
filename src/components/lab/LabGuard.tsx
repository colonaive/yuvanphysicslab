"use client";

import { useState, useEffect } from "react";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LabGuard({ children }: { children: React.ReactNode }) {
    const [isAuthed, setIsAuthed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const storedAuth = localStorage.getItem("lab_authed");
        const storedTime = localStorage.getItem("lab_auth_time");

        // 7 days expiration
        const EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

        if (storedAuth === "1" && storedTime) {
            const now = Date.now();
            if (now - parseInt(storedTime) < EXPIRATION_MS) {
                setIsAuthed(true);
            } else {
                localStorage.removeItem("lab_authed");
                localStorage.removeItem("lab_auth_time");
            }
        }
        setIsLoading(false);
    }, []);

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

            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem("lab_authed", "1");
                localStorage.setItem("lab_auth_time", Date.now().toString());
                setIsAuthed(true);
            } else {
                setError("Incorrect passcode");
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("lab_authed");
        localStorage.removeItem("lab_auth_time");
        setIsAuthed(false);
        setPasscode("");
    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted/70" />
            </div>
        );
    }

    if (!isAuthed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <Card className="w-full max-w-md space-y-8 p-6 sm:p-8">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface2">
                            <Lock className="h-6 w-6 text-muted" />
                        </div>
                        <h2 className="text-3xl">
                            Private Lab Access
                        </h2>
                        <p className="mt-2 text-sm text-muted">
                            Restricted area for research drafts and logs.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="passcode" className="sr-only">
                                    Passcode
                                </label>
                                <input
                                    id="passcode"
                                    name="passcode"
                                    type="password"
                                    required
                                    className="relative block w-full rounded-button border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted focus:z-10 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/45"
                                    placeholder="Enter passcode"
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-button border border-red-400/30 bg-red-500/10 p-2 text-center text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        <div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Enter Lab <ArrowRight className="h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="absolute top-[-3rem] right-0 md:top-[-4rem]">
                <button
                    onClick={handleLogout}
                    className="text-xs text-muted transition-colors hover:text-accent"
                >
                    Lock Lab
                </button>
            </div>
            {children}
        </div>
    );
}
