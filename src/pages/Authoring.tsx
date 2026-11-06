import { useCallback, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, CircleAlert, Loader2, Pause, Play, Plus, RotateCcw, Sparkles, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import OriginBadge from "@/components/OriginBadge";
import { useChiron } from "@/lib/study/store";
import { streamChat } from "@/lib/ai/providers";
import { loadAiSettings, modelOf, PROVIDER_LABELS } from "@/lib/ai/settings";
import { LABS } from "@/lib/labs/catalog";
import { applyContentSource } from "@/lib/study/seeds/content/materialize";
import { MIN_PROSE_WORDS_PER_SECTION, MIN_SECTIONS_PER_CHAPTER } from "@/lib/content/contract";
import {
  chapterFloor, continueDraft, draftProgress, draftViolations, newDraft, outlineIssues, outlineMessages, parseOutline,
  sectionKey, toContentSource, withRetry, writeSection, type Chat, type GenerationDraft, type GenKind, type GenOutline,
} from "@/lib/content/generator";
import { deleteDraft, loadDrafts, saveDraft } from "@/lib/content/generatorDrafts";
import type { ChapterLevel } from "@/lib/study/types";
import { cn } from "@/lib/utils";

const LEVEL_LABEL: Record<ChapterLevel, string> = { basico: "Básico", intermediario: "Intermediário", avancado: "Avançado" };

/** In-app book generation (PLANO.md §R.4): topic → table of contents the
 *  person edits and approves → one AI call per section → exercises and cards
 *  per chapter → the same contract the built-in books pass → publish. */
export default function Authoring() {
  const navigate = useNavigate();
  const { index, replaceIndex, replaceLib } = useChiron();
  const [drafts, setDrafts] = useState<GenerationDraft[]>(loadDrafts);
  const [activeId, setActiveId] = useState<string | null>(() => loadDrafts()[0]?.id ?? null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const settings = useMemo(loadAiSettings, []);
  const chat: Chat = useMemo(() => withRetry((messages, signal) => streamChat(settings, messages, () => {}, signal)), [settings]);
  const active = drafts.find((d) => d.id === activeId) ?? null;

  const persist = useCallback((draft: GenerationDraft) => {
    const { drafts: next, error: saveError } = saveDraft(draft);
    setDrafts(next);
    if (saveError) setError(`O rascunho não pôde ser salvo neste navegador: ${saveError}`);
  }, []);

  async function generateOutline(draft: GenerationDraft) {
    setBusy("Escrevendo o sumário…");
    setError(null);
    try {
      const parsed = parseOutline(await chat(outlineMessages(draft, LABS)), draft, LABS);
      if ("error" in parsed) setError(parsed.error);
      else persist({ ...draft, outline: parsed, updatedAt: new Date().toISOString() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha na chamada de IA.");
    } finally {
      setBusy(null);
    }
  }

  async function write(draft: GenerationDraft) {
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy("Escrevendo…");
    setError(null);
    try {
      await continueDraft(chat, draft, persist, controller.signal);
    } catch (err) {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Falha na geração.");
    } finally {
      abortRef.current = null;
      setBusy(null);
    }
  }

  async function regenerate(draft: GenerationDraft, ci: number, si: number) {
    if (!draft.outline) return;
    setBusy(`Reescrevendo a seção ${ci + 1}.${si + 1}…`);
    setError(null);
    try {
      const state = await writeSection(chat, draft.outline, ci, si);
      persist({ ...draft, sections: { ...draft.sections, [sectionKey(ci, si)]: state }, updatedAt: new Date().toISOString() });
    } finally {
      setBusy(null);
    }
  }

  function publish(draft: GenerationDraft) {
    const source = toContentSource(draft);
    if (!source || draftViolations(draft).length) return;
    const applied = applyContentSource(index, source);
    replaceIndex(applied.index);
    replaceLib(applied.lib.sourceId, applied.lib);
    persist({ ...draft, publishedSourceId: applied.lib.sourceId, updatedAt: new Date().toISOString() });
    navigate(`/apostila?source=${applied.lib.sourceId}`);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="space-y-3">
        <Link to="/apostila" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Apostilas
        </Link>
        <Button variant="outline" className="w-full justify-start" onClick={() => setActiveId(null)} disabled={!!busy}>
          <Plus className="mr-2 h-4 w-4" /> Nova apostila
        </Button>
        <div className="space-y-1">
          {drafts.map((draft) => {
            const p = draftProgress(draft);
            return (
              <div key={draft.id} className={cn("group flex items-center gap-2 rounded-lg px-2 py-2 text-sm", draft.id === activeId ? "bg-secondary/10" : "hover:bg-accent")}>
                <button type="button" disabled={!!busy} onClick={() => setActiveId(draft.id)} className="min-w-0 flex-1 text-left">
                  <div className="truncate font-medium text-card-foreground">{draft.outline?.name ?? draft.topic}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {draft.publishedSourceId ? "Publicada" : draft.outline ? `${p.sectionsDone}/${p.sectionsTotal} seções` : "Sumário pendente"}
                  </div>
                </button>
                <button
                  type="button"
                  aria-label="Apagar rascunho"
                  disabled={!!busy}
                  onClick={() => { setDrafts(deleteDraft(draft.id)); if (activeId === draft.id) setActiveId(null); }}
                  className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
        <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
          IA: {PROVIDER_LABELS[settings.provider]} · {modelOf(settings)}. Rascunhos ficam neste navegador até a publicação.
        </p>
      </aside>

      <main className="min-w-0 space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> <span className="flex-1">{error}</span>
            <button type="button" aria-label="Fechar" onClick={() => setError(null)}><X className="h-4 w-4" /></button>
          </div>
        )}
        {busy && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> {busy}
            {abortRef.current && (
              <Button size="sm" variant="ghost" onClick={() => abortRef.current?.abort()}>
                <Pause className="mr-1.5 h-3.5 w-3.5" /> Pausar
              </Button>
            )}
          </div>
        )}

        {!active && <TopicForm disabled={!!busy} onCreate={(draft) => { persist(draft); setActiveId(draft.id); void generateOutline(draft); }} />}
        {active && !active.outline && (
          <Panel title={active.topic}>
            <p className="text-sm text-muted-foreground">O sumário ainda não foi gerado.</p>
            <Button className="mt-3" disabled={!!busy} onClick={() => generateOutline(active)}><Sparkles className="mr-2 h-4 w-4" /> Gerar sumário</Button>
          </Panel>
        )}
        {active?.outline && draftProgress(active).sectionsDone === 0 && !busy && Object.keys(active.sections).length === 0 && (
          <OutlineEditor
            draft={active}
            onChange={(outline) => persist({ ...active, outline, updatedAt: new Date().toISOString() })}
            onRegenerate={() => generateOutline(active)}
            onApprove={() => write(active)}
          />
        )}
        {active?.outline && (Object.keys(active.sections).length > 0 || busy) && (
          <WritingView draft={active} busy={!!busy} onContinue={() => write(active)} onRegenerate={(ci, si) => regenerate(active, ci, si)} onPublish={() => publish(active)} />
        )}
      </main>
    </div>
  );
}

function Panel({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h1 className="font-display text-2xl text-primary">{title}</h1>
        {aside}
      </div>
      {children}
    </section>
  );
}

function TopicForm({ disabled, onCreate }: { disabled: boolean; onCreate: (draft: GenerationDraft) => void }) {
  const [topic, setTopic] = useState("");
  const [kind, setKind] = useState<GenKind>("tool");
  const [notes, setNotes] = useState("");
  return (
    <Panel title="Nova apostila com IA" aside={<OriginBadge origin="ai_generated" />}>
      <div className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Assunto</span>
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex.: Expressões regulares, Rust, Kubernetes" />
        </label>
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Tipo</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {([["stack", "Linguagem ou framework", `básico → avançado, ${chapterFloor("stack")}+ capítulos, projeto ligado a um laboratório`], ["tool", "Ferramenta ou fluxo", `${chapterFloor("tool")}+ capítulos de uso real, com um de armadilhas`]] as const).map(([value, label, hint]) => (
              <button
                key={value}
                type="button"
                onClick={() => setKind(value)}
                className={cn("rounded-lg border p-3 text-left text-sm transition-colors", kind === value ? "border-secondary bg-secondary/5" : "border-border hover:bg-accent")}
              >
                <div className="font-medium text-card-foreground">{label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
              </button>
            ))}
          </div>
        </div>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Orientação (opcional)</span>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex.: foco em uso no back-end, já sei o básico" className="min-h-20" />
        </label>
        <p className="text-xs leading-relaxed text-muted-foreground">
          A IA propõe o sumário; você ajusta e aprova. Depois ela escreve uma seção por vez (cada seção com pelo menos {MIN_PROSE_WORDS_PER_SECTION} palavras, dois exemplos, porquê e o que quebra) e os exercícios de cada capítulo. A apostila só é publicada se passar no mesmo contrato das apostilas do sistema.
        </p>
        <Button disabled={disabled || topic.trim().length < 2} onClick={() => onCreate(newDraft(topic, kind, notes))}>
          <Sparkles className="mr-2 h-4 w-4" /> Gerar sumário
        </Button>
      </div>
    </Panel>
  );
}

function OutlineEditor({ draft, onChange, onRegenerate, onApprove }: { draft: GenerationDraft; onChange: (o: GenOutline) => void; onRegenerate: () => void; onApprove: () => void }) {
  const outline = draft.outline!;
  const issues = outlineIssues(outline);
  const sections = outline.chapters.reduce((n, c) => n + c.sections.length, 0);
  const setChapter = (ci: number, patch: Partial<GenOutline["chapters"][number]>) =>
    onChange({ ...outline, chapters: outline.chapters.map((c, i) => (i === ci ? { ...c, ...patch } : c)) });

  return (
    <Panel
      title="Revise o sumário"
      aside={<Button variant="outline" size="sm" onClick={onRegenerate}><RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Gerar outro</Button>}
    >
      <label className="mb-4 block space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Título da apostila</span>
        <Input value={outline.name} onChange={(e) => onChange({ ...outline, name: e.target.value })} />
      </label>

      {outline.kind === "stack" && (
        <label className="mb-4 block space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Laboratório do projeto integrador</span>
          <select
            value={outline.lab ? `${outline.lab.labId}/${outline.lab.layerId}` : ""}
            onChange={(e) => { const [labId, layerId] = e.target.value.split("/"); onChange({ ...outline, lab: { labId, layerId } }); }}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {LABS.flatMap((lab) => lab.layers.map((layer) => (
              <option key={`${lab.id}/${layer.id}`} value={`${lab.id}/${layer.id}`}>{lab.name} — {layer.title}</option>
            )))}
          </select>
        </label>
      )}

      <ol className="space-y-3">
        {outline.chapters.map((chapter, ci) => (
          <li key={ci} className="rounded-lg border border-border p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">{ci + 1}.</span>
              <Input value={chapter.title} onChange={(e) => setChapter(ci, { title: e.target.value })} className="h-8 min-w-0 flex-1" />
              <select value={chapter.level} onChange={(e) => setChapter(ci, { level: e.target.value as ChapterLevel })} className="h-8 rounded-md border border-border bg-background px-2 text-xs">
                {(Object.keys(LEVEL_LABEL) as ChapterLevel[]).map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}
              </select>
              <button type="button" aria-label="Remover capítulo" onClick={() => onChange({ ...outline, chapters: outline.chapters.filter((_, i) => i !== ci) })} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <ul className="mt-2 space-y-1.5 pl-5">
              {chapter.sections.map((section, si) => (
                <li key={si} className="flex items-center gap-2">
                  <span className="w-8 shrink-0 text-[11px] text-muted-foreground">{ci + 1}.{si + 1}</span>
                  <Input value={section.title} onChange={(e) => setChapter(ci, { sections: chapter.sections.map((s, j) => (j === si ? { ...s, title: e.target.value } : s)) })} className="h-7 text-xs" />
                  <button type="button" aria-label="Remover seção" onClick={() => setChapter(ci, { sections: chapter.sections.filter((_, j) => j !== si) })} className="text-muted-foreground hover:text-destructive">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => setChapter(ci, { sections: [...chapter.sections, { title: "Nova seção", goal: "" }] })} className="text-xs text-secondary hover:underline">
                  + seção
                </button>
              </li>
            </ul>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => onChange({ ...outline, chapters: [...outline.chapters, { title: "Novo capítulo", level: "intermediario", sections: Array.from({ length: MIN_SECTIONS_PER_CHAPTER }, (_, i) => ({ title: `Seção ${i + 1}`, goal: "" })) }] })}
        className="mt-3 text-sm text-secondary hover:underline"
      >
        + capítulo
      </button>

      {issues.length > 0 && (
        <ul className="mt-4 space-y-1 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          {issues.map((issue) => <li key={issue}>{issue}</li>)}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button disabled={issues.length > 0} onClick={onApprove}><Check className="mr-2 h-4 w-4" /> Aprovar e escrever</Button>
        <span className="text-xs text-muted-foreground">{outline.chapters.length} capítulos · {sections} seções · ~{sections + outline.chapters.length} chamadas de IA</span>
      </div>
    </Panel>
  );
}

function WritingView({ draft, busy, onContinue, onRegenerate, onPublish }: { draft: GenerationDraft; busy: boolean; onContinue: () => void; onRegenerate: (ci: number, si: number) => void; onPublish: () => void }) {
  const outline = draft.outline!;
  const progress = draftProgress(draft);
  const finished = progress.sectionsDone === progress.sectionsTotal && progress.chaptersAssessed === progress.chaptersTotal;
  const violations = finished ? draftViolations(draft) : [];
  const pct = Math.round(((progress.sectionsDone + progress.chaptersAssessed) / Math.max(1, progress.sectionsTotal + progress.chaptersTotal)) * 100);

  return (
    <Panel title={outline.name} aside={<OriginBadge origin="ai_generated" />}>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{progress.sectionsDone}/{progress.sectionsTotal} seções · {progress.chaptersAssessed}/{progress.chaptersTotal} capítulos com exercícios</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-border"><div className="h-full bg-secondary transition-[width]" style={{ width: `${pct}%` }} /></div>
      </div>

      <ol className="mt-5 space-y-3">
        {outline.chapters.map((chapter, ci) => {
          const assessment = draft.assessments[String(ci)];
          return (
            <li key={ci}>
              <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                {ci + 1}. {chapter.title}
                <span className="text-[10px] font-normal uppercase tracking-wide text-muted-foreground">{LEVEL_LABEL[chapter.level]}</span>
                {assessment?.status === "done" && <span className="text-[11px] font-normal text-secondary">exercícios e cards prontos</span>}
                {assessment?.status === "failed" && <span className="text-[11px] font-normal text-destructive">exercícios: {assessment.error}</span>}
              </div>
              <ul className="mt-1.5 space-y-1 pl-5">
                {chapter.sections.map((section, si) => {
                  const state = draft.sections[sectionKey(ci, si)];
                  return (
                    <li key={si} className="flex items-center gap-2 text-xs">
                      <span className={cn("h-2 w-2 shrink-0 rounded-full", state?.status === "done" ? "bg-secondary" : state?.status === "failed" ? "bg-destructive" : "bg-border")} />
                      <span className="min-w-0 flex-1 truncate text-card-foreground">{section.title}</span>
                      {state?.words !== undefined && <span className={cn("tabular-nums", state.words < MIN_PROSE_WORDS_PER_SECTION ? "text-destructive" : "text-muted-foreground")}>{state.words} palavras</span>}
                      {state?.status === "failed" && <span className="max-w-[40%] truncate text-destructive" title={state.error}>{state.error}</span>}
                      {state && !busy && (
                        <button type="button" onClick={() => onRegenerate(ci, si)} className="text-muted-foreground hover:text-secondary" aria-label="Reescrever seção">
                          <RotateCcw className="h-3 w-3" />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!finished && !busy && <Button onClick={onContinue}><Play className="mr-2 h-4 w-4" /> Continuar</Button>}
        {finished && !draft.publishedSourceId && (
          <Button disabled={violations.length > 0} onClick={onPublish}><Check className="mr-2 h-4 w-4" /> Publicar apostila</Button>
        )}
        {draft.publishedSourceId && <Link to={`/apostila?source=${draft.publishedSourceId}`} className="text-sm text-secondary hover:underline">Abrir apostila publicada</Link>}
      </div>
      {violations.length > 0 && (
        <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          <div className="mb-1 font-medium">Ainda não passa no contrato ({violations.length}):</div>
          <ul className="list-disc space-y-0.5 pl-4">{violations.slice(0, 12).map((v, i) => <li key={i}>{v.message}</li>)}</ul>
          <p className="mt-2 text-muted-foreground">Reescreva as seções marcadas e publique depois.</p>
        </div>
      )}
    </Panel>
  );
}
