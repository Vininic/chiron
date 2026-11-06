import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, DICTIONARIES, LOCALE_LABELS, SUPPORTED_LOCALES, type Dictionary, type Locale } from "./dictionaries";
import { SHELL_DICTIONARIES, type ShellDictionary } from "./shell";

export type { Locale };

const STORAGE_KEY = "suite.locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dict: Dictionary;
  bcp47: string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && (SUPPORTED_LOCALES as readonly string[]).includes(stored)) return stored as Locale;
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale());

  useEffect(() => {
    document.documentElement.lang = LOCALE_LABELS[locale].bcp47;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { window.localStorage.setItem(STORAGE_KEY, l); } catch { /* noop */ }
  }, []);

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    setLocale,
    dict: DICTIONARIES[locale],
    bcp47: LOCALE_LABELS[locale].bcp47,
  }), [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export function useT(): Dictionary {
  return useI18n().dict;
}

export function useDateFormat() {
  const { bcp47 } = useI18n();
  return useMemo(() => ({
    long: (d: Date) =>
      new Intl.DateTimeFormat(bcp47, { weekday: "long", month: "long", day: "numeric" }).format(d),
    short: (iso: string) => {
      const d = new Date(iso + "T00:00:00");
      return new Intl.DateTimeFormat(bcp47, { month: "short", day: "numeric" }).format(d);
    },
    medium: (iso: string) => {
      const d = new Date(iso + "T00:00:00");
      return new Intl.DateTimeFormat(bcp47, { dateStyle: "medium" }).format(d);
    },
  }), [bcp47]);
}

/** The shared suite-shell vocabulary (settings dialog and the chrome around
 *  it). Separate from `useT` so the shell strings stay copyable app to app —
 *  see olympus-plan/SUITE-SHELL.md. */
export function useShell(): ShellDictionary {
  return SHELL_DICTIONARIES[useI18n().locale];
}
