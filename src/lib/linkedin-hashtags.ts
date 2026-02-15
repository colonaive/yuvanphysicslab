const STOPWORDS = new Set([
  "about",
  "after",
  "again",
  "also",
  "among",
  "because",
  "being",
  "between",
  "could",
  "does",
  "doing",
  "each",
  "from",
  "have",
  "into",
  "just",
  "like",
  "many",
  "more",
  "most",
  "other",
  "over",
  "same",
  "some",
  "such",
  "than",
  "that",
  "their",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "very",
  "what",
  "when",
  "where",
  "which",
  "while",
  "with",
  "would",
  "your",
  "time",
  "using",
  "notes",
  "note",
  "paper",
  "post",
  "posts",
  "work",
  "today",
  "learned",
  "learning",
  "insight",
  "latest",
]);

const CURATED_POOL = [
  "#Physics",
  "#Research",
  "#TheoreticalPhysics",
  "#Mathematics",
  "#MathPhysics",
  "#ScientificWriting",
  "#STEM",
  "#AcademicResearch",
  "#ProblemSolving",
  "#ScienceCommunication",
  "#PhysicsCommunity",
  "#DifferentialGeometry",
  "#GeneralRelativity",
  "#Causality",
  "#Spacetime",
];

const PHRASE_TO_HASHTAGS: Array<{ pattern: RegExp; tags: string[] }> = [
  {
    pattern: /\bgeneral relativity\b/i,
    tags: ["#GeneralRelativity", "#Relativity", "#EinsteinFieldEquations"],
  },
  {
    pattern: /\bclosed timelike curves?\b|\bctc\b/i,
    tags: ["#ClosedTimelikeCurves", "#Causality", "#Spacetime"],
  },
  {
    pattern: /\bdifferential geometry\b/i,
    tags: ["#DifferentialGeometry", "#Geometry"],
  },
  {
    pattern: /\bquantum gravity\b/i,
    tags: ["#QuantumGravity", "#TheoreticalPhysics"],
  },
  {
    pattern: /\beinstein field equations?\b/i,
    tags: ["#EinsteinFieldEquations", "#GeneralRelativity"],
  },
  {
    pattern: /\bblack holes?\b/i,
    tags: ["#BlackHoles", "#Astrophysics"],
  },
  {
    pattern: /\bchronology protection\b/i,
    tags: ["#ChronologyProtection", "#Causality"],
  },
];

const KEYWORD_TO_HASHTAG: Record<string, string[]> = {
  spacetime: ["#Spacetime"],
  godel: ["#GodelSpacetime"],
  goedel: ["#GodelSpacetime"],
  tensor: ["#TensorCalculus"],
  tensors: ["#TensorCalculus"],
  curvature: ["#Curvature"],
  cosmology: ["#Cosmology"],
  kerr: ["#KerrMetric"],
  einstein: ["#EinsteinFieldEquations"],
  relativity: ["#GeneralRelativity"],
  causality: ["#Causality"],
  topology: ["#Topology"],
  manifold: ["#Manifolds"],
  manifolds: ["#Manifolds"],
  geodesic: ["#Geodesics"],
  geodesics: ["#Geodesics"],
  semiclassical: ["#SemiclassicalGravity"],
  gravity: ["#Gravity"],
  quantum: ["#QuantumGravity"],
  equations: ["#DifferentialEquations"],
  derivation: ["#Derivation"],
  hamiltonian: ["#HamiltonianDynamics"],
  lagrangian: ["#LagrangianMechanics"],
  constraint: ["#ConstraintAnalysis"],
  constraints: ["#ConstraintAnalysis"],
  adm: ["#ADMFormalism"],
  symmetry: ["#Symmetry"],
  variational: ["#VariationalMethods"],
};

function normalizeForTokens(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toCamelCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join("");
}

export function normalizeHashtag(input: string): string | null {
  const raw = input.trim().replace(/^#+/, "");
  if (!raw) return null;

  const cleaned = raw.replace(/[^a-zA-Z0-9\s_-]/g, " ").trim();
  if (!cleaned) return null;

  const normalized = toCamelCase(cleaned);
  if (!normalized || normalized.length > 40) return null;
  return `#${normalized}`;
}

export function normalizeHashtagList(input: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of input) {
    const normalized = normalizeHashtag(item);
    if (!normalized) continue;
    const dedupeKey = normalized.toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    result.push(normalized);
  }

  return result;
}

function extractTopKeywords(input: string) {
  const tokens = normalizeForTokens(input)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 4 && /^[a-z]+$/i.test(token));

  const frequencies = new Map<string, number>();
  for (const token of tokens) {
    const lowered = token.toLowerCase();
    if (STOPWORDS.has(lowered)) continue;
    frequencies.set(lowered, (frequencies.get(lowered) ?? 0) + 1);
  }

  return [...frequencies.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 16)
    .map(([token]) => token);
}

export function suggestLinkedInHashtags(title: string, body: string) {
  const source = `${title}\n${body}`.trim();
  const suggestions: string[] = ["#Physics", "#Research", "#TheoreticalPhysics", "#Mathematics"];

  for (const rule of PHRASE_TO_HASHTAGS) {
    if (rule.pattern.test(source)) {
      suggestions.push(...rule.tags);
    }
  }

  const keywords = extractTopKeywords(source);
  for (const keyword of keywords) {
    const mapped = KEYWORD_TO_HASHTAG[keyword];
    if (mapped?.length) {
      suggestions.push(...mapped);
      continue;
    }

    const fallback = normalizeHashtag(keyword);
    if (fallback) suggestions.push(fallback);
  }

  suggestions.push(...CURATED_POOL);

  const normalized = normalizeHashtagList(suggestions);
  const limited = normalized.slice(0, 15);

  if (limited.length >= 8) return limited;

  const extra = CURATED_POOL.filter(
    (tag) => !limited.map((entry) => entry.toLowerCase()).includes(tag.toLowerCase())
  );

  return [...limited, ...extra].slice(0, 8);
}
