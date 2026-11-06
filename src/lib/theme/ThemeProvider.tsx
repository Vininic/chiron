import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Suite-wide theme provider.
 *
 * Three modes — light, dark, and **system**, which follows the device and keeps
 * following it (a `matchMedia` listener, not a one-shot read at boot). `theme`
 * is always the resolved light/dark actually on screen, so every existing
 * caller keeps working unchanged; `mode` is what the user picked.
 *
 * Storage key stays `suite.theme` — shared across the suite by convention.
 * "system" is a value older builds simply do not recognise; they fall back to
 * light, which is the suite default anyway.
 */

export type Theme = "light" | "dark";
export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "suite.theme";

interface ThemeContextValue {
  /** The resolved theme actually rendered. */
  theme: Theme;
  /** What the user chose — may be "system". */
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  /** Back-compat: sets an explicit light/dark mode. */
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function prefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}

function readStored(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "light"; // Chronos default — measured parchment
}

function applyToDom(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStored());
  const [systemDark, setSystemDark] = useState<boolean>(() => prefersDark());

  // "system" is only honest if it keeps listening after first paint.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const theme: Theme = mode === "system" ? (systemDark ? "dark" : "light") : mode;

  useEffect(() => { applyToDom(theme); }, [theme]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    try { window.localStorage.setItem(STORAGE_KEY, m); } catch { /* noop */ }
  }, []);

  const setTheme = useCallback((t: Theme) => setMode(t), [setMode]);

  const toggleTheme = useCallback(() => {
    setModeState((cur) => {
      const resolved: Theme = cur === "system" ? (prefersDark() ? "dark" : "light") : cur;
      const next: Theme = resolved === "dark" ? "light" : "dark";
      try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* noop */ }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, mode, setMode, setTheme, toggleTheme }),
    [theme, mode, setMode, setTheme, toggleTheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
