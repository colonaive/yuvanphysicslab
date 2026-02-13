
import { Sparkles, CheckCircle, BookOpen, AlertCircle, ListChecks, Type } from "lucide-react";
import type { ProfessorFeedback } from "@/lib/ai-adapter";

interface FeedbackPaneProps {
    feedback: ProfessorFeedback | null;
    isLoading: boolean;
}

export function FeedbackPane({ feedback, isLoading }: FeedbackPaneProps) {
    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-4 bg-surface rounded w-1/3" />
                <div className="space-y-3">
                    <div className="h-3 bg-surface rounded" />
                    <div className="h-3 bg-surface rounded w-5/6" />
                </div>
                <div className="h-24 bg-surface2 rounded-card" />
            </div>
        );
    }

    if (!feedback) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 select-none py-12">
                <Sparkles className="h-8 w-8" />
                <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-widest">Professor Feedback</p>
                    <p className="text-[10px]">Awaiting manuscript draft for analysis</p>
                </div>
            </div>
        );
    }

    const { summary, conceptGaps, mathematicalGaps, styleEdits, readingList, actionChecklist } = feedback;

    return (
        <div className="space-y-8 pb-4">
            <div className="space-y-1">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" /> Critique & Direction
                </h3>
                <p className="text-[10px] text-muted uppercase tracking-wider">Structured academic review</p>
            </div>

            <section className="space-y-2">
                <p className="text-[11px] leading-relaxed text-muted border-l-2 border-accent/45 pl-3 italic">
                    {summary}
                </p>
            </section>

            {conceptGaps.length > 0 && (
                <section className="space-y-2">
                    <h4 className="text-[10px] font-bold text-muted uppercase flex items-center gap-1.5">
                        <AlertCircle className="h-3 w-3" /> Concept Gaps
                    </h4>
                    <ul className="space-y-1.5">
                        {conceptGaps.map((item, i) => (
                            <li key={i} className="text-[11px] text-text flex gap-2">
                                <span className="text-accent">•</span> {item}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {mathematicalGaps.length > 0 && (
                <section className="space-y-2">
                    <h4 className="text-[10px] font-bold text-muted uppercase flex items-center gap-1.5">
                        <Type className="h-3 w-3" /> Mathematical Rigor
                    </h4>
                    <ul className="space-y-1.5">
                        {mathematicalGaps.map((item, i) => (
                            <li key={i} className="text-[11px] text-text flex gap-2">
                                <span className="text-accent2">•</span> {item}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {styleEdits.length > 0 && (
                <section className="space-y-2">
                    <h4 className="text-[10px] font-bold text-muted uppercase flex items-center gap-1.5">
                        <BookOpen className="h-3 w-3" /> Formulation & Style
                    </h4>
                    <ul className="space-y-1.5">
                        {styleEdits.map((item, i) => (
                            <li key={i} className="text-[11px] text-text flex gap-2">
                                <span className="text-muted">•</span> {item}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {readingList.length > 0 && (
                <section className="space-y-2">
                    <h4 className="text-[10px] font-bold text-muted uppercase flex items-center gap-1.5">
                        <BookOpen className="h-3 w-3" /> Recommended Reading
                    </h4>
                    <div className="grid grid-cols-1 gap-1.5">
                        {readingList.map((item, i) => (
                            <div key={i} className="rounded-button border border-border bg-surface p-2 text-[10px] text-muted">
                                {item}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {actionChecklist.length > 0 && (
                <section className="space-y-3 border border-border bg-surface2/55 p-4 rounded-card">
                    <h4 className="text-[10px] font-bold text-muted uppercase flex items-center gap-1.5">
                        <ListChecks className="h-3 w-3" /> Action Checklist
                    </h4>
                    <ul className="space-y-2">
                        {actionChecklist.map((item, i) => (
                            <li key={i} className="text-[11px] text-text flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 mt-0.5 text-accent shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
