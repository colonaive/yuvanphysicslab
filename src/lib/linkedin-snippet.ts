import { suggestLinkedInHashtags } from "@/lib/linkedin-hashtags";

const MAX_INSIGHT_LINE_LENGTH = 110;
const MAX_SNIPPET_LENGTH = 1600;

const IMPACT_TERMS = [
  "because",
  "therefore",
  "implies",
  "suggests",
  "shows",
  "matters",
  "important",
  "useful",
  "reliable",
  "predict",
  "consistency",
];

interface GenerateSnippetInput {
  title: string;
  slug: string;
  contentMd: string;
  linkUrl?: string | null;
}

export interface GeneratedLinkedInSnippet {
  title: string;
  body: string;
  hashtags: string[];
}

function markdownToPlainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function sentenceSplit(text: string) {
  const chunks = text.match(/[^.!?]+[.!?]?/g) ?? [text];
  return chunks
    .map((entry) => entry.replace(/\s+/g, " ").trim())
    .filter((entry) => entry.length >= 24);
}

function clampLine(line: string, maxLength = MAX_INSIGHT_LINE_LENGTH) {
  const normalized = line.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const sliced = normalized.slice(0, maxLength - 1);
  const boundary = Math.max(sliced.lastIndexOf(" "), sliced.lastIndexOf(","), sliced.lastIndexOf(";"));
  if (boundary >= 55) {
    return `${sliced.slice(0, boundary).trimEnd()}...`;
  }

  return `${sliced.trimEnd()}...`;
}

function toHookLines(title: string, sentences: string[]) {
  const hook: string[] = [];

  if (title.trim()) {
    hook.push(clampLine(title.trim(), 96));
  }

  if (sentences.length > 0) {
    hook.push(clampLine(sentences[0], 110));
  }

  if (hook.length < 2 && sentences.length > 1) {
    hook.push(clampLine(sentences[1], 110));
  }

  return [...new Set(hook)].slice(0, 2);
}

function pickInsightLines(sentences: string[]) {
  const seen = new Set<string>();
  const lines: string[] = [];

  for (const sentence of sentences) {
    const normalized = sentence.toLowerCase();
    if (seen.has(normalized)) continue;
    seen.add(normalized);

    const line = clampLine(sentence, MAX_INSIGHT_LINE_LENGTH);
    if (line.length < 30) continue;
    lines.push(line);
    if (lines.length === 6) break;
  }

  if (lines.length >= 3) return lines;

  const fallback = sentences
    .map((entry) => clampLine(entry, MAX_INSIGHT_LINE_LENGTH))
    .filter((entry) => entry.length >= 25)
    .slice(0, 3);

  return fallback.length > 0 ? fallback : ["Key derivation details are outlined in the full note."];
}

function pickWhyItMatters(sentences: string[]) {
  const weighted = sentences.find((sentence) =>
    IMPACT_TERMS.some((term) => sentence.toLowerCase().includes(term))
  );

  if (weighted) {
    return clampLine(weighted, 128);
  }

  if (sentences.length > 2) {
    return clampLine(sentences[2], 128);
  }

  return "This framing clarifies assumptions and makes follow-up discussion easier.";
}

function pickQuestion(source: string) {
  const normalized = source.toLowerCase();

  if (normalized.includes("causal") || normalized.includes("chronology")) {
    return "Does this causality framing match your intuition?";
  }

  if (normalized.includes("geometry") || normalized.includes("manifold")) {
    return "Which geometric perspective would you test next here?";
  }

  if (normalized.includes("quantum")) {
    return "How would you connect this to your current quantum gravity intuition?";
  }

  return "What would you challenge or extend in this framing?";
}

function buildBody(parts: {
  hookLines: string[];
  insightLines: string[];
  whyItMatters: string;
  question: string;
  linkUrl?: string | null;
}) {
  const sections = [
    `HOOK:\n${parts.hookLines.join("\n")}`,
    `INSIGHT:\n${parts.insightLines.join("\n")}`,
    `WHY IT MATTERS:\n${parts.whyItMatters}`,
    `QUESTION:\n${parts.question}`,
  ];

  if (parts.linkUrl) {
    sections.push(`LINK:\nFull note: ${parts.linkUrl}`);
  }

  return sections.join("\n\n").trim();
}

export function generateLinkedInSnippetFromMarkdown(
  input: GenerateSnippetInput
): GeneratedLinkedInSnippet {
  const title = input.title.trim() || `Research Note: ${input.slug}`;
  const plainText = markdownToPlainText(input.contentMd);
  const paragraphs = plainText
    .split(/\n{2,}/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length >= 20);
  const sourceForSentences = paragraphs.slice(0, 4).join(" ");
  const sentences = sentenceSplit(sourceForSentences);
  const fallbackSentences = sentences.length > 0 ? sentences : sentenceSplit(plainText);

  const hookLines = toHookLines(title, fallbackSentences);
  const insightLines = pickInsightLines(fallbackSentences.slice(1));
  const whyItMatters = pickWhyItMatters(fallbackSentences);
  const question = pickQuestion(`${title}\n${plainText}`);

  let stableInsights = [...insightLines];
  let body = buildBody({
    hookLines,
    insightLines: stableInsights,
    whyItMatters,
    question,
    linkUrl: input.linkUrl,
  });

  while (body.length > MAX_SNIPPET_LENGTH && stableInsights.length > 3) {
    stableInsights = stableInsights.slice(0, -1);
    body = buildBody({
      hookLines,
      insightLines: stableInsights,
      whyItMatters,
      question,
      linkUrl: input.linkUrl,
    });
  }

  if (body.length > MAX_SNIPPET_LENGTH) {
    body = `${body.slice(0, MAX_SNIPPET_LENGTH - 4).trimEnd()}...`;
  }

  const hashtags = suggestLinkedInHashtags(title, body);
  const generatedTitle = /^research note:/i.test(title) ? title : `Research Note: ${title}`;

  return {
    title: generatedTitle,
    body,
    hashtags,
  };
}
