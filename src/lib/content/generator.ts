// In-app apostila generation (PLANO.md §R.4). The shape follows one measured
// constraint: the shared ai-proxy caps every reply at 2048 tokens. A ~600-word
// section with two code blocks fits in one reply; a whole chapter never does.
// So the AI drafts a table of contents first (small JSON the person edits and
// approves), then one call per section, then one call per chapter for its
// exercises and cards. Nothing here touches live data: the result is a
// ContentSource that only becomes a source when the person publishes it, and
// only if the same contract the built-in books pass agrees.
import type { ChatMessage } from "@/lib/ai/providers";
import type { Block, ChapterLevel, ExerciseLevel, ExerciseType } from "@/lib/study/types";
import type { ContentCard, ContentExercise, ContentSource } from "@/lib/study/seeds/content/types";
import { proseWordCount } from "./blocks";
import { validateCurriculumDraft } from "./authoring";
import {
  MIN_CHAPTERS_PER_STACK, MIN_CHAPTERS_PER_TOOL, MIN_PROSE_WORDS_PER_SECTION, MIN_SECTIONS_PER_CHAPTER,
  type Violation,
} from "./contract";
import type { Lab } from "@/lib/labs/types";

export type GenKind = "stack" | "tool";

export interface GenSectionPlan { title: string; goal: string }
export interface GenChapterPlan { title: string; level: ChapterLevel; sections: GenSectionPlan[] }
export interface GenOutline {
  name: string;
  kind: GenKind;
  language?: string;
  chapters: GenChapterPlan[];
  /** Stack books close with an integrator chapter tied to a lab layer. */
  lab?: { labId: string; layerId: string };
}

export interface GenCode { lang: string; code: string; caption: string }
export interface GenSection { prose: string; code: GenCode[]; porque: string; quebraria: string }

export type StepStatus = "pending" | "done" | "failed";
export interface SectionState { status: StepStatus; result?: GenSection; error?: string; words?: number }
export interface AssessmentState { status: StepStatus; exercises?: ContentExercise[]; cards?: ContentCard[]; error?: string }

export interface GenerationDraft {
  id: string;
  topic: string;
  kind: GenKind;
  notes: string;
  createdAt: string;
  updatedAt: string;
  outline: GenOutline | null;
  /** Keyed `chapterIndex:sectionIndex`. */
  sections: Record<string, SectionState>;
  /** Keyed by chapter index. */
  assessments: Record<string, AssessmentState>;
  publishedSourceId?: string;
}

export const sectionKey = (chapter: number, section: number) => `${chapter}:${section}`;
export const chapterFloor = (kind: GenKind) => (kind === "stack" ? MIN_CHAPTERS_PER_STACK : MIN_CHAPTERS_PER_TOOL);

export function newDraft(topic: string, kind: GenKind, notes = ""): GenerationDraft {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), topic: topic.trim(), kind, notes: notes.trim(), createdAt: now, updatedAt: now, outline: null, sections: {}, assessments: {} };
}

const SYSTEM = "Você é um professor sênior escrevendo uma apostila técnica em português do Brasil. Explica mecanismos reais, com exemplos concretos do próprio assunto, sem enrolação, sem frases genéricas e sem inventar APIs.";

function stripFence(raw: string): string {
  return raw.trim().replace(/^```[a-z]*\s*/i, "").replace(/```\s*$/, "").trim();
}

// ── 1. Sumário ──────────────────────────────────────────────────────

export function outlineMessages(draft: GenerationDraft, labs: Lab[]): ChatMessage[] {
  const floor = chapterFloor(draft.kind);
  const shape = draft.kind === "stack"
    ? `no mínimo ${floor} capítulos em escada: começa em "basico", passa por "intermediario" e termina em "avancado"; o último capítulo é um projeto integrador`
    : `no mínimo ${floor} capítulos orientados a fluxo de trabalho real; um capítulo precisa ter "Armadilhas" no título e ensinar a diagnosticar os erros comuns`;
  const labList = labs.flatMap((lab) => lab.layers.map((layer) => `${lab.id}/${layer.id} (${lab.name}: ${layer.title} — ${layer.concept})`)).join("; ");
  return [
    { role: "system", content: `${SYSTEM} Responda somente JSON válido, sem cercas de código.` },
    {
      role: "user",
      content:
        `Proponha o sumário de uma apostila sobre "${draft.topic}". Estrutura: ${shape}. ` +
        `Cada capítulo tem ${MIN_SECTIONS_PER_CHAPTER} a 6 seções; cada seção tem um título específico e um objetivo de uma frase dizendo o que o leitor vai entender. ` +
        `A quantidade de capítulos e de seções segue o assunto, não um molde.` +
        (draft.notes ? ` Orientação do aluno: ${draft.notes}.` : "") +
        (draft.kind === "stack" ? ` Escolha a camada de laboratório mais próxima do projeto integrador entre: ${labList}.` : "") +
        ` Formato: {"name":"","language":"","chapters":[{"title":"","level":"basico|intermediario|avancado","sections":[{"title":"","goal":""}]}]${draft.kind === "stack" ? ',"lab":"labId/layerId"' : ""}}`,
    },
  ];
}

const LEVELS: ChapterLevel[] = ["basico", "intermediario", "avancado"];

export function parseOutline(raw: string, draft: GenerationDraft, labs: Lab[]): GenOutline | { error: string } {
  let data: { name?: unknown; language?: unknown; chapters?: unknown; lab?: unknown };
  try { data = JSON.parse(stripFence(raw)); } catch { return { error: "A IA não devolveu um sumário em JSON válido." }; }
  if (!Array.isArray(data.chapters) || data.chapters.length === 0) return { error: "O sumário veio sem capítulos." };
  const chapters: GenChapterPlan[] = [];
  for (const item of data.chapters as Record<string, unknown>[]) {
    const sections = Array.isArray(item?.sections) ? (item.sections as Record<string, unknown>[]) : [];
    const title = String(item?.title ?? "").trim();
    if (!title) continue;
    chapters.push({
      title,
      level: LEVELS.includes(item.level as ChapterLevel) ? (item.level as ChapterLevel) : "intermediario",
      sections: sections.map((s) => ({ title: String(s?.title ?? "").trim(), goal: String(s?.goal ?? "").trim() })).filter((s) => s.title),
    });
  }
  const outline: GenOutline = {
    name: String(data.name ?? draft.topic).trim() || draft.topic,
    kind: draft.kind,
    language: data.language ? String(data.language) : undefined,
    chapters,
  };
  if (draft.kind === "stack") {
    const [labId, layerId] = String(data.lab ?? "").split("/");
    const valid = labs.find((lab) => lab.id === labId)?.layers.some((layer) => layer.id === layerId);
    outline.lab = valid ? { labId, layerId } : labs[0] ? { labId: labs[0].id, layerId: labs[0].layers[0].id } : undefined;
  }
  return outline;
}

/** What still keeps an outline from producing a publishable book — checked
 *  before spending dozens of calls on sections that could never pass. */
export function outlineIssues(outline: GenOutline): string[] {
  const issues: string[] = [];
  const floor = chapterFloor(outline.kind);
  if (outline.chapters.length < floor) issues.push(`Tem ${outline.chapters.length} capítulo(s); o mínimo para ${outline.kind === "stack" ? "linguagem/framework" : "ferramenta"} é ${floor}.`);
  outline.chapters.forEach((chapter, i) => {
    if (chapter.sections.length < MIN_SECTIONS_PER_CHAPTER) issues.push(`Capítulo ${i + 1} ("${chapter.title}") tem ${chapter.sections.length} seção(ões); mínimo ${MIN_SECTIONS_PER_CHAPTER}.`);
  });
  if (outline.kind === "stack") {
    for (const level of LEVELS) if (!outline.chapters.some((c) => c.level === level)) issues.push(`Nenhum capítulo de nível "${level}".`);
    if (!outline.lab) issues.push("O capítulo integrador precisa de uma camada de laboratório.");
  } else if (!outline.chapters.some((c) => /armadilha|pitfall/i.test(c.title))) {
    issues.push('Falta um capítulo com "Armadilhas" no título.');
  }
  return issues;
}

// ── 2. Seções ───────────────────────────────────────────────────────
// Plain markers instead of JSON: a small model escaping code inside JSON
// strings fails often, and a reply cut by the token cap still yields every
// part that arrived — the missing ones are requested separately.

const MARK = { prose: "### PROSA", code: "### CÓDIGO", porque: "### PORQUÊ", quebraria: "### O QUE QUEBRA" };

function neighbors(outline: GenOutline, ci: number, si: number): string {
  const chapter = outline.chapters[ci];
  const prev = chapter.sections[si - 1]?.title ?? outline.chapters[ci - 1]?.title;
  const next = chapter.sections[si + 1]?.title ?? outline.chapters[ci + 1]?.title;
  return `${prev ? `A parte anterior é "${prev}" (não repita). ` : ""}${next ? `A próxima é "${next}" (não adiante).` : ""}`;
}

export function sectionMessages(outline: GenOutline, ci: number, si: number): ChatMessage[] {
  const chapter = outline.chapters[ci];
  const section = chapter.sections[si];
  const toc = outline.chapters.map((c, i) => `${i + 1}. ${c.title}`).join(" | ");
  return [
    { role: "system", content: SYSTEM },
    {
      role: "user",
      content:
        `Apostila "${outline.name}". Sumário: ${toc}.\n` +
        `Escreva a seção "${section.title}" do capítulo ${ci + 1} ("${chapter.title}", nível ${chapter.level}). Objetivo: ${section.goal || section.title}. ${neighbors(outline, ci, si)}\n` +
        `Responda exatamente nestas partes, nesta ordem, com os cabeçalhos literais:\n` +
        `${MARK.prose}\n(650 a 800 palavras de explicação: o mecanismo de verdade, um exemplo concreto do próprio assunto, o porquê de cada passo; markdown permitido, sem títulos de nível 1)\n` +
        `${MARK.code} <linguagem> | <legenda curta>\n(primeiro exemplo real e executável, dentro de um bloco de código)\n` +
        `${MARK.code} <linguagem> | <legenda curta>\n(segundo exemplo, diferente do primeiro)\n` +
        `${MARK.porque}\n(o critério ou tradeoff de design por trás disso, 2 a 4 frases)\n` +
        `${MARK.quebraria}\n(o que falha em produção quando se entende isso errado, 2 a 4 frases)`,
    },
  ];
}

export interface ParsedSection { section: GenSection; missing: ("prose" | "code" | "porque" | "quebraria")[] }

export function parseSection(raw: string): ParsedSection {
  const parts = raw.replace(/\r/g, "").split(/^(?=### )/m);
  let prose = "", porque = "", quebraria = "";
  const code: GenCode[] = [];
  for (const part of parts) {
    const [head, ...rest] = part.split("\n");
    const body = rest.join("\n").trim();
    const h = head.trim().toUpperCase();
    if (h.startsWith("### PROSA")) prose = body;
    else if (h.startsWith("### CÓDIGO") || h.startsWith("### CODIGO")) {
      const [lang, caption] = head.replace(/^###\s*C[ÓO]DIGO\s*/i, "").split("|").map((s) => s.trim());
      const fenced = body.match(/```[\w+-]*\n([\s\S]*?)```/);
      const source = (fenced ? fenced[1] : body.replace(/```[\w+-]*/g, "")).trimEnd();
      if (source.trim()) code.push({ lang: (lang || "text").toLowerCase(), code: source, caption: caption || "Exemplo" });
    } else if (h.startsWith("### PORQU")) porque = body;
    else if (h.startsWith("### O QUE QUEBRA")) quebraria = body;
  }
  const missing: ParsedSection["missing"] = [];
  if (!prose) missing.push("prose");
  if (code.length < 2) missing.push("code");
  if (!porque) missing.push("porque");
  if (!quebraria) missing.push("quebraria");
  return { section: { prose, code, porque, quebraria }, missing };
}

export function sectionWords(section: GenSection): number {
  return proseWordCount([{ kind: "prose", md: section.prose }]);
}

/** Asks only for what a cut-off or sloppy reply left out. */
export function repairMessages(outline: GenOutline, ci: number, si: number, parsed: ParsedSection): ChatMessage[] {
  const section = outline.chapters[ci].sections[si];
  const want = [
    parsed.missing.includes("code") ? `${2 - parsed.section.code.length} bloco(s) "${MARK.code} <linguagem> | <legenda>" com exemplo real` : "",
    parsed.missing.includes("porque") ? `"${MARK.porque}" (2 a 4 frases)` : "",
    parsed.missing.includes("quebraria") ? `"${MARK.quebraria}" (2 a 4 frases)` : "",
  ].filter(Boolean).join(", ");
  return [
    { role: "system", content: SYSTEM },
    { role: "user", content: `Apostila "${outline.name}", seção "${section.title}". A explicação já está escrita. Escreva apenas: ${want}. Use os cabeçalhos literais.` },
  ];
}

export function expansionMessages(outline: GenOutline, ci: number, si: number, current: GenSection, needed: number): ChatMessage[] {
  const section = outline.chapters[ci].sections[si];
  return [
    { role: "system", content: SYSTEM },
    {
      role: "user",
      content:
        `Apostila "${outline.name}", seção "${section.title}". O texto atual está abaixo. Escreva uma continuação de ${needed + 120} a ${needed + 250} palavras que aprofunde o que falta — um caso concreto, um detalhe do mecanismo ou um erro comum explicado — sem repetir o que já está dito e sem resumo final. Responda só com o texto da continuação.\n\n---\n${current.prose}`,
    },
  ];
}

// ── 3. Exercícios e cards por capítulo ──────────────────────────────

const TYPES: ExerciseType[] = [1, 2, 3, 4, 5];
const EX_LEVEL: Record<ChapterLevel, ExerciseLevel> = { basico: "beginner", intermediario: "intermediate", avancado: "advanced" };

export function assessmentMessages(outline: GenOutline, ci: number): ChatMessage[] {
  const chapter = outline.chapters[ci];
  return [
    { role: "system", content: `${SYSTEM} Responda somente JSON válido, sem cercas de código.` },
    {
      role: "user",
      content:
        `Apostila "${outline.name}", capítulo "${chapter.title}" (seções: ${chapter.sections.map((s) => s.title).join("; ")}). ` +
        `Crie 3 exercícios e 4 flashcards sobre o capítulo. Exercícios: um tipo 1 (múltipla escolha com 4 alternativas; answer é o texto exato da correta), um tipo 2 (por que este design — resposta livre, com rubric listando 2 a 3 critérios) e um tipo 3 (ache o risco num trecho de código). Enunciados concretos, com código quando fizer sentido. ` +
        `Formato: {"exercises":[{"type":1,"prompt":"","choices":["","","",""],"answer":"","rubric":""}],"cards":[{"front":"","back":""}]}`,
    },
  ];
}

export function parseAssessment(raw: string, chapter: GenChapterPlan): { exercises: ContentExercise[]; cards: ContentCard[] } | { error: string } {
  let data: { exercises?: unknown; cards?: unknown };
  try { data = JSON.parse(stripFence(raw)); } catch { return { error: "A IA não devolveu exercícios em JSON válido." }; }
  const exercises: ContentExercise[] = [];
  for (const item of (Array.isArray(data.exercises) ? data.exercises : []) as Record<string, unknown>[]) {
    const type = Number(item?.type) as ExerciseType;
    const prompt = String(item?.prompt ?? "").trim();
    const answer = String(item?.answer ?? "").trim();
    if (!TYPES.includes(type) || !prompt || !answer) continue;
    const choices = Array.isArray(item.choices) ? item.choices.map(String).filter(Boolean) : undefined;
    // A multiple-choice item whose key is not one of its choices can never be
    // graded right — drop it rather than ship an unwinnable question.
    if (type === 1 && (!choices || choices.length < 2 || !choices.includes(answer))) continue;
    exercises.push({
      nodeTitle: chapter.title, type, level: EX_LEVEL[chapter.level], promptMd: prompt,
      choices: type === 1 ? choices : undefined, answerKeyMd: answer,
      rubricMd: item.rubric ? String(item.rubric) : undefined, points: type === 1 ? 10 : 20,
    });
  }
  const cards: ContentCard[] = ((Array.isArray(data.cards) ? data.cards : []) as Record<string, unknown>[])
    .map((c) => ({ nodeTitle: chapter.title, frontMd: String(c?.front ?? "").trim(), backMd: String(c?.back ?? "").trim() }))
    .filter((c) => c.frontMd && c.backMd);
  if (exercises.length < 3 || new Set(exercises.map((e) => e.type)).size < 2 || cards.length < 4) {
    return { error: `Veio incompleto: ${exercises.length} exercício(s) válidos, ${cards.length} card(s).` };
  }
  return { exercises, cards };
}

// ── 4. Montagem e contrato ──────────────────────────────────────────

export function toContentSource(draft: GenerationDraft): ContentSource | null {
  const outline = draft.outline;
  if (!outline) return null;
  const lastChapter = outline.chapters.length - 1;
  return {
    name: outline.name,
    kind: outline.kind,
    language: outline.language,
    origin: "ai_generated",
    chapters: outline.chapters.map((chapter, ci) => ({
      title: chapter.title,
      level: chapter.level,
      nodeTitle: chapter.title,
      nodeKind: "concept",
      sections: chapter.sections.flatMap((plan, si) => {
        const result = draft.sections[sectionKey(ci, si)]?.result;
        if (!result) return [];
        const blocks: Block[] = [
          { kind: "prose", md: result.prose },
          ...result.code.map((c): Block => ({ kind: "code", lang: c.lang, code: c.code, caption: c.caption })),
          { kind: "porque", md: result.porque },
          { kind: "quebraria", md: result.quebraria },
        ];
        if (outline.lab && ci === lastChapter && si === chapter.sections.length - 1) {
          blocks.push({ kind: "labref", labId: outline.lab.labId, layerId: outline.lab.layerId });
        }
        return [{ title: plan.title, order: si, blocks }];
      }),
    })),
    exercises: Object.entries(draft.assessments).flatMap(([, a]) => a.exercises ?? []),
    cards: Object.entries(draft.assessments).flatMap(([, a]) => a.cards ?? []),
  };
}

export function draftViolations(draft: GenerationDraft): Violation[] {
  const source = toContentSource(draft);
  if (!source) return [{ rule: "draft.outline", message: "Ainda não há sumário aprovado." }];
  return validateCurriculumDraft(source).violations;
}

export interface DraftProgress { sectionsDone: number; sectionsTotal: number; chaptersAssessed: number; chaptersTotal: number }

export function draftProgress(draft: GenerationDraft): DraftProgress {
  const chapters = draft.outline?.chapters ?? [];
  const keys = chapters.flatMap((c, ci) => c.sections.map((_, si) => sectionKey(ci, si)));
  return {
    sectionsDone: keys.filter((k) => draft.sections[k]?.status === "done").length,
    sectionsTotal: keys.length,
    chaptersAssessed: chapters.filter((_, ci) => draft.assessments[String(ci)]?.status === "done").length,
    chaptersTotal: chapters.length,
  };
}

// ── 5. Execução ─────────────────────────────────────────────────────

export type Chat = (messages: ChatMessage[], signal?: AbortSignal) => Promise<string>;

// 546 is Supabase's edge-function resource limit: the function was killed
// while the model was still answering — same as a timeout, worth retrying.
const TRANSIENT = /\b(429|500|502|503|504|546)\b|high demand|overloaded|rate limit|unavailable|reachable|failed to fetch|network/i;

/** The hosted free model answers 503 "high demand" in bursts (seen on the
 *  first live run, 2026-10-23). Transient errors wait and retry; anything
 *  else — a bad key, a refused prompt — fails at once. */
export function withRetry(chat: Chat, delaysMs: number[] = [4000, 12000, 30000], sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))): Chat {
  return async (messages, signal) => {
    for (let attempt = 0; ; attempt++) {
      try {
        return await chat(messages, signal);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (signal?.aborted || attempt >= delaysMs.length || !TRANSIENT.test(message)) throw error;
        await sleep(delaysMs[attempt]);
      }
    }
  };
}

/** Writes one section: draft → fill missing parts → expand until the floor,
 *  at most twice each. Returns the best result even below the floor, marked
 *  with its word count, so the person decides whether to regenerate it. */
export async function writeSection(chat: Chat, outline: GenOutline, ci: number, si: number, signal?: AbortSignal): Promise<SectionState> {
  try {
    const parsed = parseSection(await chat(sectionMessages(outline, ci, si), signal));
    if (!parsed.section.prose) return { status: "failed", error: "A resposta veio sem explicação." };
    let section = parsed.section;
    if (parsed.missing.length) {
      const repaired = parseSection(await chat(repairMessages(outline, ci, si, parsed), signal));
      section = {
        ...section,
        code: [...section.code, ...repaired.section.code].slice(0, 2),
        porque: section.porque || repaired.section.porque,
        quebraria: section.quebraria || repaired.section.quebraria,
      };
    }
    for (let round = 0; round < 2 && sectionWords(section) < MIN_PROSE_WORDS_PER_SECTION; round++) {
      const addition = stripFence(await chat(expansionMessages(outline, ci, si, section, MIN_PROSE_WORDS_PER_SECTION - sectionWords(section)), signal));
      if (addition) section = { ...section, prose: `${section.prose}\n\n${addition}` };
    }
    const words = sectionWords(section);
    const incomplete = section.code.length < 2 || !section.porque || !section.quebraria;
    return incomplete
      ? { status: "failed", result: section, words, error: "Faltaram exemplos ou blocos porquê/o que quebra." }
      : { status: "done", result: section, words };
  } catch (error) {
    if (signal?.aborted) throw error;
    return { status: "failed", error: error instanceof Error ? error.message : "Falha na chamada de IA." };
  }
}

export async function writeAssessment(chat: Chat, outline: GenOutline, ci: number, signal?: AbortSignal): Promise<AssessmentState> {
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const parsed = parseAssessment(await chat(assessmentMessages(outline, ci), signal), outline.chapters[ci]);
      if (!("error" in parsed)) return { status: "done", ...parsed };
      if (attempt === 1) return { status: "failed", error: parsed.error };
    }
  } catch (error) {
    if (signal?.aborted) throw error;
    return { status: "failed", error: error instanceof Error ? error.message : "Falha na chamada de IA." };
  }
  return { status: "failed", error: "Falha na geração." };
}

/** Continues wherever the draft stopped: every pending or failed section,
 *  then every chapter's assessment. Calls `onUpdate` after each step so the
 *  caller can persist and render — closing the tab loses at most one call. */
export async function continueDraft(chat: Chat, draft: GenerationDraft, onUpdate: (draft: GenerationDraft) => void, signal?: AbortSignal): Promise<GenerationDraft> {
  const outline = draft.outline;
  if (!outline) return draft;
  let current = draft;
  const commit = (patch: Partial<GenerationDraft>) => {
    current = { ...current, ...patch, updatedAt: new Date().toISOString() };
    onUpdate(current);
  };
  for (let ci = 0; ci < outline.chapters.length; ci++) {
    for (let si = 0; si < outline.chapters[ci].sections.length; si++) {
      const key = sectionKey(ci, si);
      if (current.sections[key]?.status === "done") continue;
      if (signal?.aborted) return current;
      commit({ sections: { ...current.sections, [key]: await writeSection(chat, outline, ci, si, signal) } });
    }
  }
  for (let ci = 0; ci < outline.chapters.length; ci++) {
    if (current.assessments[String(ci)]?.status === "done") continue;
    if (signal?.aborted) return current;
    commit({ assessments: { ...current.assessments, [String(ci)]: await writeAssessment(chat, outline, ci, signal) } });
  }
  return current;
}
