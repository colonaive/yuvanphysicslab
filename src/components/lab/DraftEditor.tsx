"use client";

import { useEffect, useState } from "react";
import { Save, Download, FileText, Loader2, Sparkles } from "lucide-react";

interface DraftEditorProps {
    onReview: (text: string) => void;
    isReviewing: boolean;
}

export function DraftEditor({ onReview, isReviewing }: DraftEditorProps) {
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("workbench_draft");
        if (saved) setContent(saved);
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        localStorage.setItem("workbench_draft", content);
        setTimeout(() => setIsSaving(false), 600);
    };

    const handleExport = () => {
        const blob = new Blob([content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `research-draft-${new Date().toISOString().split('T')[0]}.mdx`;
        a.click();
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-semibold">Manuscript Draft</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onReview(content)}
                        disabled={isReviewing || !content.trim()}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                        {isReviewing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                        Get Feedback
                    </button>
                    <div className="h-4 w-px bg-gray-100 mx-1" />
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="p-1.5 text-gray-400 hover:text-black transition-colors"
                        title="Save Draft (Local)"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-green-500" /> : <Save className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={handleExport}
                        className="p-1.5 text-gray-400 hover:text-black transition-colors"
                        title="Export MDX"
                    >
                        <Download className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Exordium: Begin your theoretical derivation here..."
                className="flex-1 w-full p-6 text-sm font-mono leading-relaxed bg-transparent focus:outline-none resize-none placeholder:text-gray-300"
            />

            <div className="border-t border-gray-100 px-4 py-2 flex justify-between items-center bg-gray-50/30 rounded-b-xl">
                <span className="text-[10px] text-gray-400 tracking-tight">
                    {content.split(/\s+/).filter(Boolean).length} words
                </span>
                <span className="text-[10px] text-gray-400">Markdown enabled</span>
            </div>
        </div>
    );
}
