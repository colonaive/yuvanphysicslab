"use client";

import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import TextareaAutosize from "react-textarea-autosize";
import { Copy, Trash2, Save, FileText } from "lucide-react";

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
    const [content, setContent] = useState("");
    const [mounted, setMounted] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem("scratchpad_content");
        setContent(saved || INITIAL_CONTENT);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("scratchpad_content", content);
        }
    }, [content, mounted]);

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

    if (!mounted) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
            {/* Toolbar */}
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 overflow-x-auto">
                <div className="flex gap-1 flex-wrap min-w-[200px]">
                    {SYMBOLS.map((sym) => (
                        <button
                            key={sym}
                            onClick={() => insertAtCursor(sym)}
                            className="p-1.5 hover:bg-gray-100 rounded text-sm font-mono"
                            title={sym}
                        >
                            ${sym}$
                        </button>
                    ))}
                </div>
                <div className="w-px bg-gray-200 hidden md:block" />
                <div className="flex gap-2 flex-wrap">
                    {SNIPPETS.map((snip) => (
                        <button
                            key={snip.label}
                            onClick={() => insertAtCursor(snip.code)}
                            className="px-2 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-xs font-medium text-gray-700"
                        >
                            {snip.label}
                        </button>
                    ))}
                </div>
                <div className="md:ml-auto flex gap-2 border-l pl-4 border-gray-200">
                    <button onClick={copyToClipboard} className="text-gray-500 hover:text-black" title="Copy Markdown">
                        <Copy className="h-5 w-5" />
                    </button>
                    <button onClick={clearContent} className="text-red-400 hover:text-red-600" title="Clear">
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Editor & Preview Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
                <div className="h-full flex flex-col">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Editor</label>
                    <TextareaAutosize
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 font-mono text-sm resize-none bg-white overflow-y-auto"
                        placeholder="Type your notes here..."
                        spellCheck={false}
                    />
                </div>

                <div className="h-full flex flex-col min-h-[300px]">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Preview</label>
                    <div className="flex-1 p-6 rounded-xl border border-gray-100 bg-white overflow-y-auto prose prose-sm max-w-none">
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
