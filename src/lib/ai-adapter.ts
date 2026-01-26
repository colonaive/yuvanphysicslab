export type ResearchProvider = "perplexity" | "openai" | "gemini";

export interface ResearchCitation {
    title: string;
    url: string;
}

export interface ResearchResult {
    answer: string;
    citations: ResearchCitation[];
    model: string;
    createdAt: string;
}

export interface ProfessorFeedback {
    summary: string;
    conceptGaps: string[];
    mathematicalGaps: string[];
    styleEdits: string[];
    readingList: string[];
    actionChecklist: string[];
}

export async function queryResearch(provider: ResearchProvider, query: string, cite: boolean = true): Promise<ResearchResult | { error: string, code: string }> {
    const keys = {
        perplexity: process.env.PERPLEXITY_API_KEY,
        openai: process.env.OPENAI_API_KEY,
        gemini: process.env.GEMINI_API_KEY,
    };

    if (!keys[provider]) {
        return { error: `Provider ${provider} not configured.`, code: "PROVIDER_NOT_CONFIGURED" };
    }

    // Placeholder implementation for Sprint 2 initial structure
    // Real implementation would use fetch to the respective APIs

    switch (provider) {
        case "perplexity":
            return {
                answer: `Research results for: "${query}" (Perplexity Simulation)`,
                citations: [{ title: "Physics Review Letters", url: "https://journals.aps.org/prl/" }],
                model: "llama-3-sonar-large-32k-online",
                createdAt: new Date().toISOString()
            };
        case "openai":
            return {
                answer: `Research results for: "${query}" (OpenAI Simulation)`,
                citations: [],
                model: "gpt-4o",
                createdAt: new Date().toISOString()
            };
        case "gemini":
            return {
                answer: `Research results for: "${query}" (Gemini Simulation)`,
                citations: [{ title: "Google Scholar", url: "https://scholar.google.com" }],
                model: "gemini-1.5-pro",
                createdAt: new Date().toISOString()
            };
    }
}

export async function reviewDraft(draftText: string, researchContext?: string): Promise<ProfessorFeedback | { error: string, code: string }> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return { error: "No AI provider configured for review.", code: "PROVIDER_NOT_CONFIGURED" };
    }

    // Placeholder for "Professor" prompt logic
    return {
        summary: "An investigation into the symmetries of the provided draft.",
        conceptGaps: ["Missing definition of local gauge invariance."],
        mathematicalGaps: ["The transition between equation 4 and 5 needs explicit derivation of the Jacobian."],
        styleEdits: ["Use 'we' instead of 'I' for academic tone.", "Break down the second paragraph."],
        readingList: ["Peskin & Schroeder, Ch 4", "Nair, Mathematical Physics"],
        actionChecklist: ["Verify normalization of the wave function.", "Update citations."]
    };
}
