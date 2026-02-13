"use client";

import { useRouter } from "next/navigation";
import { PenTool, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function LabDashboard() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const res = await fetch("/api/lab/logout", { method: "POST" });
            if (res.ok) {
                router.refresh();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-8">
                <div>
                    <h1 className="mb-1 text-3xl">Lab Dashboard</h1>
                    <p className="text-sm text-muted italic">&quot;Nullius in verba&quot;</p>
                </div>
                <Button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    variant="ghost"
                    className="text-xs"
                >
                    {isLoggingOut ? <Loader2 className="h-3 w-3 animate-spin" /> : "Logout"}
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Link href="/lab/latex" className="group block">
                    <Card className="h-full p-6 transition-colors hover:border-accent/55">
                        <div className="flex items-start justify-between mb-4">
                            <div className="rounded-button border border-border bg-surface2 p-3 text-accent">
                                <PenTool className="h-6 w-6" />
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted group-hover:text-accent transition-colors" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Editor</h2>
                        <p className="text-muted text-sm leading-relaxed">
                            Draft research notes with full LaTeX support and live preview.
                        </p>
                    </Card>
                </Link>

                <Link href="/lab/workbench" className="group block">
                    <Card className="h-full p-6 transition-colors hover:border-accent/55">
                        <div className="flex items-start justify-between mb-4">
                            <div className="rounded-button border border-border bg-surface2 p-3 text-accent2">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted group-hover:text-accent transition-colors" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Workbench</h2>
                        <p className="text-muted text-sm leading-relaxed">
                            Research engine with AI-driven critique and manuscript drafting.
                        </p>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
