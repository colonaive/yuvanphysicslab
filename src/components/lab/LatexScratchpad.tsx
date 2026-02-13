"use client";

import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import TextareaAutosize from "react-textarea-autosize";
import { Copy, Trash2 } from "lucide-react";
import { semanticClasses } from "@/theme/tokens";

const INITIAL_CONTENT = "# Scratchpad\n\nStart typing LaTeX formulas here...\n\n$$ \nE = mc^2 \n$$";

const SYMBOLS = [
    "\\alpha", "\\beta", "\\gamma", "\\mu", "\\nu", "\\rho", "\\sigma", "\\Gamma", "\\nabla", "\\partial", "\\Box", "\\Lambda",
    "g_{\\mu\\nu}", "R_{\\mu\\nu}", "T_{\\mu\\nu}", "\\infty", "\\pi"
];

const SNIPPETS = [
    { label: "Frac", code: "\\frac{a}{b}" },
    { label: "Sqrt", code: "\\sqrt{x}" },
    { label: "Eq", code: "$$ ... $$" },
    { label: "Align", code: "\\begin{aligned}\n  a &= b \\\\\n  c &= d\n\\end{aligned}" },
];

export function LatexScratchpad() {
    const [content, setContent] = useState(() => {
        if (typeof window === "undefined") return INITIAL_CONTENT;
        return localStorage.getItem("scratchpad_content") || INITIAL_CONTENT;
    });
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("scratchpad_content", content);
        }
    }, [content]);

    const insertAtCursor = (textToInsert: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + textToInsert + content.substring(end);

        setContent(newContent);

        // Defer focus and selection update to next tick
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
        }, 0);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(content);
    };

    const clearContent = () => {
        if (confirm("Clear all content?")) {
            setContent("");
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
            {/* Toolbar */}
            <div className="rounded-card border border-border bg-surface p-3 shadow-soft flex flex-col md:flex-row gap-4 overflow-x-auto">
                <div className="flex gap-1 flex-wrap min-w-[200px]">
                    {SYMBOLS.map((sym) => (
                        <button
                            key={sym}
                            onClick={() => insertAtCursor(sym)}
                            className="rounded-button p-1.5 text-sm font-mono hover:bg-surface2"
                            title={sym}
                        >
                            ${sym}$
                        </button>
                    ))}
                </div>
                <div className="hidden w-px bg-border md:block" />
                <div className="flex gap-2 flex-wrap">
                    {SNIPPETS.map((snip) => (
                        <button
                            key={snip.label}
                            onClick={() => insertAtCursor(snip.code)}
                            className="rounded-button border border-border bg-surface2 px-2 py-1 text-xs font-medium text-text hover:border-accent/50"
                        >
                            {snip.label}
                        </button>
                    ))}
                </div>
                <div className="md:ml-auto flex gap-2 border-l pl-4 border-border">
                    <button onClick={copyToClipboard} className="text-muted hover:text-accent" title="Copy Markdown">
                        <Copy className="h-5 w-5" />
                    </button>
                    <button onClick={clearContent} className="text-muted hover:text-accent" title="Clear">
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Editor & Preview Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
                <div className="h-full flex flex-col">
                    <label className={semanticClasses.sectionMarker}>Editor</label>
                    <TextareaAutosize
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 w-full resize-none overflow-y-auto rounded-card border border-border bg-surface p-4 font-mono text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/35"
                        placeholder="Type your notes here..."
                        spellCheck={false}
                    />
                </div>

                <div className="h-full flex flex-col min-h-[300px]">
                    <label className={semanticClasses.sectionMarker}>Preview</label>
                    <div className="prose-lab flex-1 overflow-y-auto rounded-card border border-border bg-surface p-6">
                        <Markdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {content}
                        </Markdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
