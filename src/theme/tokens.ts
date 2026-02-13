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
    bg: "#f6f4ef",
    surface: "#fcfbf8",
    surface2: "#efebe2",
    text: "#121723",
    muted: "#5a6270",
    border: "#d2cfc6",
    accent: "#4cc9f0",
    accent2: "#2f89ad",
  },
  dark: {
    bg: "#090d12",
    surface: "#111820",
    surface2: "#18212b",
    text: "#f3f6fb",
    muted: "#a6b2c2",
    border: "#2a3646",
    accent: "#4cc9f0",
    accent2: "#7fdfff",
  },
};

export const radii = {
  card: "1rem",
  button: "0.75rem",
} as const;

export const shadows = {
  soft: "0 14px 40px -26px rgb(10 13 18 / 48%)",
} as const;

export const spacing = {
  pageGutter: "clamp(1.25rem, 4vw, 3rem)",
} as const;

export const semanticClasses = {
  card: "rounded-card border border-border bg-surface shadow-soft",
  cardMuted: "rounded-card border border-border bg-surface2 shadow-soft",
  buttonPrimary:
    "inline-flex items-center justify-center gap-2 rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-accent2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-55",
  buttonOutline:
    "inline-flex items-center justify-center gap-2 rounded-button border border-border bg-transparent px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-55",
  buttonGhost:
    "inline-flex items-center justify-center gap-2 rounded-button px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-55",
  sectionMarker: "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted",
} as const;
