

import { useState } from "react";
import { Search, Globe, Loader2, ExternalLink } from "lucide-react";
import type { ResearchResult, ResearchProvider } from "@/lib/ai-adapter";

export function ResearchPane() {
    const [query, setQuery] = useState("");
    const [provider, setProvider] = useState<ResearchProvider>("perplexity");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ResearchResult | null>(null);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError("");
        try {
            const res = await fetch("/api/research/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ provider, query, cite: true }),
            });

            const data = await res.json();
            if (res.ok) {
                setResult(data);
            } else {
                setError(data.error || "Failed to fetch results");
            }
        } catch (err) {
            setError("Connection error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="space-y-1">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Search className="h-4 w-4 text-blue-500" /> Research Engine
                </h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Multi-provider access</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-3">
                <div className="flex gap-2">
                    <select
                        value={provider}
                        onChange={(e) => setProvider(e.target.value as ResearchProvider)}
                        className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    >
                        <option value="perplexity">Perplexity</option>
                        <option value="openai">OpenAI</option>
                        <option value="gemini">Gemini</option>
                    </select>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Inquire..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-2 top-1.5 text-gray-400 hover:text-black transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </button>
                </div>
            </form>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-[11px] rounded-md border border-red-100">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {result.answer}
                        </div>

                        {result.citations?.length > 0 && (
                            <div className="space-y-2 border-t border-gray-100 pt-3">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase">Citations</h4>
                                <div className="space-y-1">
                                    {result.citations.map((cite, i) => (
                                        <a
                                            key={i}
                                            href={cite.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-[11px] text-blue-600 hover:underline"
                                        >
                                            <Globe className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{cite.title}</span>
                                            <ExternalLink className="h-2 w-2" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="text-[9px] text-gray-300 italic">
                            via {result.model} • {new Date(result.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                )}

                {!result && !isLoading && !error && (
                    <div className="h-32 flex flex-col items-center justify-center text-center opacity-30 select-none">
                        <Globe className="h-8 w-8 mb-2" />
                        <p className="text-[10px]">No active research session</p>
                    </div>
                )}
            </div>
        </div>
    );
}
