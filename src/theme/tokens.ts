export type ThemeScale = {
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accent2: string;
};

export const colors: { light: ThemeScale; dark: ThemeScale } = {
  light: {
    bg: "#F5F6F8",
    surface: "#FFFFFF",
    surface2: "#F1F5F9",
    text: "#0F172A",
    muted: "#334155",
    border: "rgba(15, 23, 42, 0.10)",
    accent: "#2563EB",
    accent2: "#06B6D4",
  },
  dark: {
    bg: "#0B1220",
    surface: "#0F172A",
    surface2: "#111C33",
    text: "#F8FAFC",
    muted: "#CBD5E1",
    border: "rgba(248, 250, 252, 0.12)",
    accent: "#60A5FA",
    accent2: "#22D3EE",
  },
};

export const typography = {
  fonts: {
    heading: '"Playfair Display", "Libre Baskerville", "Times New Roman", serif',
    body: '"Inter", "Source Sans 3", ui-sans-serif, system-ui, sans-serif',
  },
  scale: {
    h1: "clamp(2.6rem, 4.4vw, 3.7rem)",
    h2: "clamp(1.9rem, 3vw, 2.55rem)",
    h3: "clamp(1.3rem, 2.2vw, 1.75rem)",
    body: "clamp(1rem, 0.98rem + 0.15vw, 1.125rem)",
  },
  lineHeights: {
    headingTight: 1.06,
    h2: 1.18,
    h3: 1.28,
    body: 1.68,
  },
} as const;

export const radii = {
  card: "1rem",
  button: "0.75rem",
} as const;

export const shadows = {
  soft: "0 10px 34px -20px rgb(15 23 42 / 22%)",
} as const;

export const spacing = {
  pageGutter: "clamp(1.25rem, 4vw, 3rem)",
} as const;

export const semanticClasses = {
  card: "rounded-card border border-border/75 bg-surface shadow-soft",
  cardMuted: "rounded-card border border-border/70 bg-surface2 shadow-soft",
  buttonPrimary:
    "inline-flex items-center justify-center gap-2 rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_26px_-16px_rgba(37,99,235,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent/95 hover:shadow-[0_14px_30px_-16px_rgba(37,99,235,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-55",
  buttonOutline:
    "inline-flex items-center justify-center gap-2 rounded-button border border-border/90 bg-surface px-5 py-2.5 text-sm font-semibold text-text transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/55 hover:shadow-[0_10px_22px_-18px_rgba(15,23,42,0.5)] hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-55",
  buttonGhost:
    "inline-flex items-center justify-center gap-2 rounded-button px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-55",
  sectionMarker: "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted",
} as const;
