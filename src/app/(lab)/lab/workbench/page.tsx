"use client";

import { useState } from "react";
import { WorkbenchLayout } from "@/components/lab/WorkbenchLayout";
import { ResearchPane } from "@/components/lab/ResearchPane";
import { DraftEditor } from "@/components/lab/DraftEditor";
import { FeedbackPane } from "@/components/lab/FeedbackPane";
import type { ProfessorFeedback } from "@/lib/ai-adapter";
import { FlaskConical } from "lucide-react";
import { Container } from "@/components/site/Container";

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
        } catch (err) {
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
                        <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center">
                            <FlaskConical className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Lab Workbench</h1>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Experimental Research Environment</p>
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
                                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-[11px] rounded-md border border-red-100">
                                        {error}
                                    </div>
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
