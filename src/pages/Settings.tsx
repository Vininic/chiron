import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useT } from "@/lib/i18n/I18nProvider";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/utils";

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="chiron-card p-6">
      <div className="text-[11px] uppercase tracking-[0.22em] text-secondary">{eyebrow}</div>
      <h2 className="font-display mt-1 text-2xl text-primary">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

const AI_STORAGE = {
  provider: "chiron.ai.provider",
  apiKey: "chiron.ai.apiKey",
  model: "chiron.ai.model",
} as const;

interface AISettings {
  provider: string;
  apiKey: string;
  model: string;
}

function loadAI(): AISettings {
  try {
    return {
      provider: localStorage.getItem(AI_STORAGE.provider) || "gemini-hosted",
      apiKey: localStorage.getItem(AI_STORAGE.apiKey) || "",
      model: localStorage.getItem(AI_STORAGE.model) || "",
    };
  } catch {
    return { provider: "gemini-hosted", apiKey: "", model: "" };
  }
}

function saveAI(s: AISettings) {
  try {
    localStorage.setItem(AI_STORAGE.provider, s.provider);
    localStorage.setItem(AI_STORAGE.apiKey, s.apiKey);
    localStorage.setItem(AI_STORAGE.model, s.model);
  } catch { /* noop */ }
}

const PROVIDERS = [
  { value: "gemini-hosted", label: "Gemini (cloud proxy)" },
  { value: "openrouter-hosted", label: "OpenRouter (cloud proxy)" },
  { value: "gemini", label: "Gemini (direct API key)" },
  { value: "openai", label: "OpenAI (direct API key)" },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const t = useT();
  const L = t.chiron.settings;
  const [ai, setAI] = useState<AISettings>(loadAI);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    saveAI(ai);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <header>
        <div className="text-[11px] uppercase tracking-[0.22em] text-secondary">{L.eyebrow}</div>
        <h1 className="font-display mt-1.5 text-4xl text-primary">{L.title}</h1>
      </header>

      <Section eyebrow={L.appearanceEyebrow} title={L.appearanceTitle}>
        <div className="flex gap-2">
          {([
            { value: "light", label: L.parchment, icon: Sun },
            { value: "dark", label: L.scriptorium, icon: Moon },
          ] as const).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              aria-pressed={theme === value}
              className={cn(
                "flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors",
                theme === value ? "border-secondary/60 bg-secondary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </Section>

      <Section eyebrow="IA" title="Configuração de IA">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Provedor</label>
            <select
              value={ai.provider}
              onChange={(e) => setAI((p) => ({ ...p, provider: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {PROVIDERS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          {ai.provider !== "gemini-hosted" && ai.provider !== "openrouter-hosted" && (
            <div>
              <label className="text-xs text-muted-foreground">API Key</label>
              <input
                type="password"
                value={ai.apiKey}
                onChange={(e) => setAI((p) => ({ ...p, apiKey: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                placeholder="sk-..."
              />
            </div>
          )}
          <div>
            <label className="text-xs text-muted-foreground">Modelo (opcional)</label>
            <input
              type="text"
              value={ai.model}
              onChange={(e) => setAI((p) => ({ ...p, model: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              placeholder="gemini-3.1-flash-lite"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90"
          >
            {saved ? "Salvo!" : "Salvar"}
          </button>
        </div>
      </Section>
    </div>
  );
}
