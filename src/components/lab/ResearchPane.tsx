
import { useState } from "react";
import { Search, Globe, Loader2, ExternalLink } from "lucide-react";
import type { ResearchResult, ResearchProvider } from "@/lib/ai-adapter";
import { semanticClasses } from "@/theme/tokens";

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
        } catch {
            setError("Connection error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="space-y-1">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Search className="h-4 w-4 text-accent" /> Research Engine
                </h3>
                <p className="text-[10px] text-muted uppercase tracking-wider">Multi-provider access</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-3">
                <div className="flex gap-2">
                    <select
                        value={provider}
                        onChange={(e) => setProvider(e.target.value as ResearchProvider)}
                        className="rounded-button border border-border bg-surface px-2 py-1 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent/40"
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
                        className="w-full rounded-button border border-border bg-surface py-2 pl-3 pr-10 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent/40"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-2 top-1.5 text-muted transition-colors hover:text-accent disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </button>
                </div>
            </form>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {error && (
                    <div className="rounded-button border border-red-400/30 bg-red-500/10 p-3 text-[11px] text-red-500">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed text-text">
                            {result.answer}
                        </div>

                        {result.citations?.length > 0 && (
                            <div className="space-y-2 border-t border-border pt-3">
                                <h4 className={semanticClasses.sectionMarker}>Citations</h4>
                                <div className="space-y-1">
                                    {result.citations.map((cite, i) => (
                                        <a
                                            key={i}
                                            href={cite.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-[11px] text-accent2"
                                        >
                                            <Globe className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{cite.title}</span>
                                            <ExternalLink className="h-2 w-2" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="text-[9px] italic text-muted/70">
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
