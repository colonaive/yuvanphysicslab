"use client";

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
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
                <div className="h-24 bg-gray-100 rounded-lg" />
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
                    <Sparkles className="h-4 w-4 text-purple-500" /> Critique & Direction
                </h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Structured academic review</p>
            </div>

            <section className="space-y-2">
                <p className="text-[11px] leading-relaxed text-gray-600 border-l-2 border-purple-200 pl-3 italic">
                    {summary}
                </p>
            </section>

            {conceptGaps.length > 0 && (
                <section className="space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                        <AlertCircle className="h-3 w-3" /> Concept Gaps
                    </h4>
                    <ul className="space-y-1.5">
                        {conceptGaps.map((item, i) => (
                            <li key={i} className="text-[11px] text-gray-700 flex gap-2">
                                <span className="text-purple-300">•</span> {item}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {mathematicalGaps.length > 0 && (
                <section className="space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                        <Type className="h-3 w-3" /> Mathematical Rigor
                    </h4>
                    <ul className="space-y-1.5">
                        {mathematicalGaps.map((item, i) => (
                            <li key={i} className="text-[11px] text-gray-700 flex gap-2">
                                <span className="text-blue-300">•</span> {item}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {styleEdits.length > 0 && (
                <section className="space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                        <BookOpen className="h-3 w-3" /> Formulation & Style
                    </h4>
                    <ul className="space-y-1.5">
                        {styleEdits.map((item, i) => (
                            <li key={i} className="text-[11px] text-gray-700 flex gap-2">
                                <span className="text-gray-300">•</span> {item}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {readingList.length > 0 && (
                <section className="space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                        <BookOpen className="h-3 w-3" /> Recommended Reading
                    </h4>
                    <div className="grid grid-cols-1 gap-1.5">
                        {readingList.map((item, i) => (
                            <div key={i} className="p-2 bg-white border border-gray-100 rounded text-[10px] text-gray-600">
                                {item}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {actionChecklist.length > 0 && (
                <section className="space-y-3 bg-gray-100/50 p-4 rounded-xl border border-gray-100">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
                        <ListChecks className="h-3 w-3" /> Action Checklist
                    </h4>
                    <ul className="space-y-2">
                        {actionChecklist.map((item, i) => (
                            <li key={i} className="text-[11px] text-gray-700 flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
