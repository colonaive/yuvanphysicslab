export const THEME_STORAGE_KEY = "yuvan-theme";

export type ThemeMode = "light" | "dark";

export const themeInitScript = `
(() => {
  try {
    const key = "${THEME_STORAGE_KEY}";
    const stored = localStorage.getItem(key);
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored === "light" || stored === "dark"
      ? stored
      : (systemPrefersDark ? "dark" : "light");
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
  } catch (_) {}
})();
`;
