import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BookOpen, Database, Github, Palette, Settings2, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth";
import { useI18n, useShell, type Locale } from "@/lib/i18n/I18nProvider";
import { LOCALE_LABELS } from "@/lib/i18n/dictionaries";
import { useTheme, type ThemeMode } from "@/lib/theme/ThemeProvider";
import { readReduceMotion, setReduceMotion } from "@/lib/ui/motion";
import {
  DEFAULT_MODELS, PROVIDER_LABELS, loadAiSettings, saveAiSettings,
  type AiProvider, type AiSettings,
} from "@/lib/ai/settings";
import { streamChat } from "@/lib/ai/providers";
import {
  loadStudyPreferences, saveStudyPreferences, type StudyPreferences,
} from "@/lib/study/preferences";
import { cn } from "@/lib/utils";

/* ── Per-app configuration ─────────────────────────────────────────────────
   The only part of this file that differs between siblings. Everything below
   is the shared shell (olympus-plan/SUITE-SHELL.md §2.3) and should be kept
   identical app to app so a fix in one is a fix in all. */
const APP = {
  name: "Chiron",
  cardClass: "chiron-card",
  /** The user_data row this app owns. */
  domainKey: "chiron-index",
  /** localStorage keys the export/clear actions cover. AI settings are
      deliberately absent: the key never leaves the device, and an export file
      is exactly how it would. */
  localKeys: ["chiron.study-preferences.v1", "chiron.chat-sessions.v1", "chiron.ai-history.v1"],
  version: "1.0.0",
};

type SectionId = "general" | "appearance" | "intelligence" | "study" | "data" | "account";

const SECTION_ICONS: Record<SectionId, typeof Settings2> = {
  general: Settings2,
  appearance: Palette,
  intelligence: Sparkles,
  study: BookOpen,
  data: Database,
  account: User,
};

/* ── Layout primitives ─────────────────────────────────────────────────── */

function Row({ label, description, children, stacked }: {
  label: string; description?: string; children?: ReactNode; stacked?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 border-b border-border/60 py-3.5 last:border-0",
        stacked ? "flex-col" : "items-center justify-between",
      )}
    >
      <div className="min-w-0">
        <div className="text-sm text-primary">{label}</div>
        {description && <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{description}</div>}
      </div>
      {children !== undefined && <div className={cn("shrink-0", stacked && "w-full")}>{children}</div>}
    </div>
  );
}

function Group({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mb-6">
      {title && <p className="mb-1.5 text-[10px] uppercase tracking-[0.22em] text-secondary">{title}</p>}
      <div className="flex flex-col">{children}</div>
    </section>
  );
}

function Segmented<T extends string>({ value, options, onChange }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg border border-border bg-surface-veil/50 p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs transition-colors",
            value === option.value ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-primary",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/* ── Sections ──────────────────────────────────────────────────────────── */

function GeneralSection() {
  const s = useShell().settings;
  const { locale, setLocale } = useI18n();
  const [reduced, setReduced] = useState(readReduceMotion);

  return (
    <Group>
      <Row label={s.general.language}>
        <Segmented<Locale>
          value={locale}
          onChange={setLocale}
          options={[
            { value: "pt", label: LOCALE_LABELS.pt.long },
            { value: "en", label: LOCALE_LABELS.en.long },
          ]}
        />
      </Row>
      <Row label={s.general.reduceMotion} description={s.general.reduceMotionDesc}>
        <Switch
          checked={reduced}
          onCheckedChange={(v) => { setReduceMotion(v); setReduced(v); }}
        />
      </Row>
    </Group>
  );
}

function AppearanceSection() {
  const s = useShell().settings;
  const { mode, setMode } = useTheme();

  return (
    <Group>
      <Row label={s.appearance.mode} description={s.appearance.modeDesc}>
        <Segmented<ThemeMode>
          value={mode}
          onChange={setMode}
          options={[
            { value: "light", label: s.appearance.light },
            { value: "dark", label: s.appearance.dark },
            { value: "system", label: s.appearance.system },
          ]}
        />
      </Row>
      <Row label={s.appearance.preview} stacked>
        <div className={cn(APP.cardClass, "mt-2 p-3")}>
          <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-secondary">{APP.name}</p>
          <p className="font-display text-lg text-primary">{s.appearance.previewTitle}</p>
          <p className="mt-1 text-xs text-muted-foreground">{s.appearance.previewBody}</p>
        </div>
      </Row>
    </Group>
  );
}

function IntelligenceSection() {
  const s = useShell().settings;
  const [ai, setAi] = useState<AiSettings>(loadAiSettings);
  const [test, setTest] = useState<"idle" | "running" | "ok" | "fail">("idle");

  function patch(next: Partial<AiSettings>) {
    setAi((prev) => {
      const merged = { ...prev, ...next };
      saveAiSettings(merged);
      return merged;
    });
    setTest("idle");
  }

  async function runTest() {
    setTest("running");
    try {
      await streamChat(ai, [{ role: "user", content: "ping" }], () => {});
      setTest("ok");
    } catch {
      setTest("fail");
    }
  }

  const hosted = ai.provider === "gemini-hosted" || ai.provider === "openrouter-hosted";

  return (
    <Group>
      <Row label={s.intelligence.provider}>
        <Select value={ai.provider} onValueChange={(v) => patch({ provider: v as AiProvider, model: "" })}>
          <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.keys(PROVIDER_LABELS) as AiProvider[]).map((provider) => (
              <SelectItem key={provider} value={provider}>{PROVIDER_LABELS[provider]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Row>

      <Row label={s.intelligence.model}>
        <Input
          value={ai.model}
          onChange={(e) => patch({ model: e.target.value })}
          placeholder={DEFAULT_MODELS[ai.provider]}
          disabled={hosted}
          className="w-[220px]"
        />
      </Row>

      {hosted ? (
        <Row label={s.intelligence.hostedNote} />
      ) : ai.provider === "ollama" ? (
        <Row label={s.intelligence.ollamaUrl}>
          <Input
            value={ai.baseUrl}
            onChange={(e) => patch({ baseUrl: e.target.value })}
            placeholder="http://localhost:11434"
            className="w-[220px]"
          />
        </Row>
      ) : (
        <Row label={s.intelligence.apiKey} description={s.intelligence.keysNote}>
          <Input
            type="password"
            value={ai.apiKey}
            onChange={(e) => patch({ apiKey: e.target.value })}
            placeholder={s.intelligence.apiKeyPlaceholder}
            className="w-[220px]"
          />
        </Row>
      )}

      <Row label={s.intelligence.autonomy}>
        <Segmented<AiSettings["autonomy"]>
          value={ai.autonomy}
          onChange={(v) => patch({ autonomy: v })}
          options={[
            { value: "review", label: s.intelligence.autonomySuggest },
            { value: "auto", label: s.intelligence.autonomyAuto },
          ]}
        />
      </Row>

      <Row
        label={s.intelligence.test}
        description={
          test === "ok" ? s.intelligence.testOk : test === "fail" ? s.intelligence.testFail : undefined
        }
      >
        <Button size="sm" variant="outline" onClick={runTest} disabled={test === "running"}>
          {test === "running" ? s.intelligence.testing : s.intelligence.test}
        </Button>
      </Row>
    </Group>
  );
}

/** Chiron's own section. The generic shell has no place for a study pace or a
 *  GitHub token, and dropping them when the Settings page became a dialog
 *  would have deleted working features — so they moved here intact. */
function StudySection() {
  const s = useShell().settings;
  const [study, setStudy] = useState<StudyPreferences>(loadStudyPreferences);

  function patch(next: Partial<StudyPreferences>) {
    setStudy((current) => {
      const merged = { ...current, ...next };
      saveStudyPreferences(merged);
      return merged;
    });
  }

  return (
    <>
      <Group title={s.study.pace}>
        <Row label={s.study.dailyBudget}>
          <Select
            value={String(study.dailyBudget)}
            onValueChange={(v) => patch({ dailyBudget: Number(v) as StudyPreferences["dailyBudget"] })}
          >
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25 min</SelectItem>
              <SelectItem value="60">60 min</SelectItem>
              <SelectItem value="90">90 min</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row label={s.study.newCards}>
          <Input
            type="number"
            min={1}
            max={100}
            value={study.newCardsPerDay}
            onChange={(e) => patch({ newCardsPerDay: Number(e.target.value) || 1 })}
            className="w-[140px]"
          />
        </Row>
        <Row label={s.study.graceDays} description={s.study.graceDaysDesc}>
          <Input
            type="number"
            min={0}
            max={7}
            value={study.graceDays}
            onChange={(e) => patch({ graceDays: Number(e.target.value) || 0 })}
            className="w-[140px]"
          />
        </Row>
      </Group>

      <Group title="GitHub">
        <Row label={s.study.githubToken} description={s.study.githubTokenDesc} stacked>
          <div className="mt-2 flex items-center gap-2">
            <Github className="h-4 w-4 shrink-0 text-secondary" />
            <Input
              type="password"
              value={study.githubToken}
              onChange={(e) => patch({ githubToken: e.target.value })}
              placeholder="github_pat_…"
            />
          </div>
        </Row>
      </Group>
    </>
  );
}

function DataSection() {
  const s = useShell().settings;
  const [cleared, setCleared] = useState(false);

  const present = useMemo(
    () => APP.localKeys.some((key) => !!localStorage.getItem(key)),
    [cleared],
  );

  function exportAll() {
    const payload: Record<string, unknown> = { app: APP.name, exportedAt: new Date().toISOString() };
    for (const key of APP.localKeys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try { payload[key] = JSON.parse(raw); } catch { payload[key] = raw; }
      }
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${APP.name.toLowerCase()}-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearLocal() {
    if (!window.confirm(s.data.clearConfirm)) return;
    for (const key of APP.localKeys) localStorage.removeItem(key);
    setCleared(true);
  }

  return (
    <Group>
      <Row label={s.data.rows} description={s.data.rowsDesc}>
        <span className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">{APP.domainKey}</span>
          <span className={present ? "text-emerald-600" : "text-muted-foreground"}>
            {present ? s.data.present : s.data.absent}
          </span>
        </span>
      </Row>
      <Row label={s.data.export} description={s.data.exportDesc}>
        <Button size="sm" variant="outline" onClick={exportAll}>{s.data.export}</Button>
      </Row>
      <Row label={s.data.clear} description={cleared ? s.data.cleared : s.data.clearDesc}>
        <Button size="sm" variant="destructive" onClick={clearLocal}>{s.data.clear}</Button>
      </Row>
      <p className="pt-3 text-[11px] text-muted-foreground">{s.data.keysNote}</p>
    </Group>
  );
}

function AccountSection() {
  const s = useShell().settings;
  const { session, updateName } = useAuth();
  const [name, setName] = useState(session?.name ?? "");
  const [saved, setSaved] = useState(false);

  async function save() {
    await updateName(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <Group>
      <Row label={s.account.name} description={s.account.nameDesc}>
        <div className="flex items-center gap-2">
          <Input
            value={name}
            onChange={(e) => { setName(e.target.value); setSaved(false); }}
            placeholder={s.account.namePlaceholder}
            className="w-[190px]"
          />
          <Button size="sm" onClick={save}>{saved ? s.account.saved : s.account.save}</Button>
        </div>
      </Row>
      <Row label={s.account.email}>
        <span className="text-xs text-muted-foreground">{session?.email ?? "—"}</span>
      </Row>
      <Row label={s.account.sessionType}>
        <span className="text-xs text-muted-foreground">
          {session?.email ? s.account.cloud : s.account.local}
        </span>
      </Row>
    </Group>
  );
}

/* ── Shell ─────────────────────────────────────────────────────────────── */

export function SettingsDialog({
  open, onOpenChange, initialSection = "general",
}: { open: boolean; onOpenChange: (open: boolean) => void; initialSection?: SectionId }) {
  const s = useShell().settings;
  const [section, setSection] = useState<SectionId>(initialSection);

  useEffect(() => { if (open) setSection(initialSection); }, [open, initialSection]);

  const sections = Object.keys(s.sections) as SectionId[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[86vh] w-[min(880px,94vw)] max-w-none gap-0 overflow-hidden p-0 sm:rounded-xl">
        <DialogTitle className="border-b border-border px-5 py-3.5 font-display text-base text-primary">
          {s.title}
        </DialogTitle>

        <div className="flex min-h-0 flex-col sm:h-[540px] sm:flex-row">
          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-border p-2 sm:w-52 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:border-b-0 sm:border-r">
            {sections.map((id) => {
              const Icon = SECTION_ICONS[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSection(id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors",
                    section === id
                      ? "bg-surface-veil text-primary"
                      : "text-muted-foreground hover:bg-surface-veil/60 hover:text-primary",
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{s.sections[id]}</span>
                </button>
              );
            })}
          </nav>

          <ScrollArea className="min-h-0 flex-1">
            <div className="px-5 py-4">
              {section === "general" && <GeneralSection />}
              {section === "appearance" && <AppearanceSection />}
              {section === "intelligence" && <IntelligenceSection />}
              {section === "study" && <StudySection />}
              {section === "data" && <DataSection />}
              {section === "account" && <AccountSection />}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
