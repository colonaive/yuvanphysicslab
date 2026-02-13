"use client";

import { useState } from "react";
import { WorkbenchLayout } from "@/components/lab/WorkbenchLayout";
import { ResearchPane } from "@/components/lab/ResearchPane";
import { DraftEditor } from "@/components/lab/DraftEditor";
import { FeedbackPane } from "@/components/lab/FeedbackPane";
import type { ProfessorFeedback } from "@/lib/ai-adapter";
import { FlaskConical } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";

export default function WorkbenchPage() {
    const [feedback, setFeedback] = useState<ProfessorFeedback | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [error, setError] = useState("");

    const handleReview = async (draftText: string) => {
        setIsReviewing(true);
        setError("");
        try {
            const res = await fetch("/api/research/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ draftText }),
            });

            const data = await res.json();
            if (res.ok) {
                setFeedback(data);
            } else {
                setError(data.error || "Critique engine failed");
            }
        } catch {
            setError("Connection failure");
        } finally {
            setIsReviewing(false);
        }
    };

    return (
        <Container className="max-w-[1600px] h-screen max-h-[900px]">
            <div className="py-6 h-full flex flex-col space-y-6">
                <header className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-button border border-border bg-surface2 text-accent">
                            <FlaskConical className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Lab Workbench</h1>
                            <p className="text-[10px] text-muted uppercase tracking-widest font-medium">Experimental Research Environment</p>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-hidden">
                    <WorkbenchLayout
                        researchPane={<ResearchPane />}
                        editorPane={<DraftEditor onReview={handleReview} isReviewing={isReviewing} />}
                        feedbackPane={
                            <div className="h-full flex flex-col">
                                {error && (
                                    <Card className="mb-4 border-red-400/30 bg-red-500/10 p-3 text-[11px] text-red-500">
                                        {error}
                                    </Card>
                                )}
                                <FeedbackPane feedback={feedback} isLoading={isReviewing} />
                            </div>
                        }
                    />
                </main>
            </div>
        </Container>
    );
}
