
import { useState } from "react";
import { Save, Download, FileText, Loader2, Sparkles } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";

interface DraftEditorProps {
    onReview: (text: string) => void;
    isReviewing: boolean;
}

export function DraftEditor({ onReview, isReviewing }: DraftEditorProps) {
    const [content, setContent] = useState(() => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem("workbench_draft") ?? "";
    });
    const [isSaving, setIsSaving] = useState(false);

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
            <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted" />
                    <span className="text-sm font-semibold">Manuscript Draft</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onReview(content)}
                        disabled={isReviewing || !content.trim()}
                        className={semanticClasses.buttonPrimary + " px-3 py-1.5 text-xs"}
                    >
                        {isReviewing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                        Get Feedback
                    </button>
                    <div className="h-4 w-px bg-border mx-1" />
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="p-1.5 text-muted transition-colors hover:text-accent"
                        title="Save Draft (Local)"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-accent" /> : <Save className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={handleExport}
                        className="p-1.5 text-muted transition-colors hover:text-accent"
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
                className="flex-1 w-full resize-none bg-transparent p-6 font-mono text-sm leading-relaxed text-text placeholder:text-muted/60 focus:outline-none"
            />

            <div className="border-t border-border rounded-b-card bg-surface2/40 px-4 py-2 flex items-center justify-between">
                <span className="text-[10px] text-muted tracking-tight">
                    {content.split(/\s+/).filter(Boolean).length} words
                </span>
                <span className="text-[10px] text-muted">Markdown enabled</span>
            </div>
        </div>
    );
}
