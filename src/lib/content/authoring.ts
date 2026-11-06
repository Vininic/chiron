import type { ContentCard, ContentChapter, ContentExercise, ContentSource } from "@/lib/study/seeds/content/types";
import { applyContentSource } from "@/lib/study/seeds/content/materialize";
import { checkSource, type Violation } from "./contract";
import { freshIndex } from "@/lib/study/migrate";
import type { ChapterBlueprint, SourceBlueprint } from "./webCore";

export interface CurriculumRequest { name: string; kind: "stack" | "tool"; language?: string; chapterCount: number; labId?: string; }
export interface CurriculumDraft { source: ContentSource; violations: Violation[]; status: "draft" | "ready"; }

export function curriculumPrompt(request: CurriculumRequest): string {
  const shape = request.kind === "stack" ? "12 a 14 capítulos, cobrindo básico, intermediário e avançado; quatro seções por capítulo" : "8 ou mais capítulos orientados a fluxo de trabalho, incluindo armadilhas e ligação a um repositório real";
  return `Escreva uma apostila completa de ${request.name}. Estrutura obrigatória: ${shape}. Cada seção precisa de no mínimo 600 palavras de prosa própria, dois blocos de código executáveis, um bloco porque e um bloco quebraria. Cada capítulo precisa de três exercícios em dois tipos e quatro cards SRS. Responda SOMENTE JSON compatível com ContentSource. Não resuma nem use placeholders. ${request.labId ? `O capítulo integrador deve conter um bloco labref para ${request.labId}.` : ""}`;
}

export function chapterPrompt(source: SourceBlueprint, chapter: ChapterBlueprint): string {
  return `Escreva o capítulo “${chapter.title}” da apostila ${source.name}. Conceitos obrigatórios: ${chapter.concepts.join(", ")}. Nível: ${chapter.level}. Entregue quatro seções, cada uma com no mínimo 600 palavras de prosa própria, dois exemplos executáveis, um bloco “porque” e um “quebraria”; inclua três exercícios de pelo menos dois tipos e quatro cards. Responda apenas JSON no formato de ContentChapter + exercícios + cards ligados ao título do capítulo.${chapter.labId ? ` A seção integradora deve incluir labref ${chapter.labId}.` : ""}`;
}

/** A draft is accepted only after the same materializer+contract used by live content agrees. */
export function validateCurriculumDraft(source: ContentSource): CurriculumDraft {
  const materialized = applyContentSource(freshIndex(), source);
  const studySource = materialized.index.sources[0];
  const violations = checkSource(studySource, materialized.lib, materialized.index);
  return { source, violations, status: violations.length ? "draft" : "ready" };
}

export function parseCurriculumDraft(raw: string): CurriculumDraft | { error: string } {
  try {
    const source = { ...(JSON.parse(raw) as ContentSource), origin: "ai_generated" as const };
    if (!source || typeof source.name !== "string" || !Array.isArray(source.chapters) || !Array.isArray(source.exercises) || !Array.isArray(source.cards)) return { error: "A proposta não tem o formato ContentSource." };
    return validateCurriculumDraft(source);
  } catch { return { error: "A IA não devolveu JSON válido para a apostila." }; }
}

export interface ChapterDraftPayload { chapter: ContentChapter; exercises: ContentExercise[]; cards: ContentCard[]; }

export function parseChapterDraft(raw: string): ChapterDraftPayload | { error: string } {
  try {
    const payload = JSON.parse(raw) as Partial<ChapterDraftPayload>;
    if (!payload.chapter || !Array.isArray(payload.exercises) || !Array.isArray(payload.cards) || !Array.isArray(payload.chapter.sections)) return { error: "O rascunho do capítulo não tem capítulo, exercícios e cards." };
    return payload as ChapterDraftPayload;
  } catch { return { error: "A IA não devolveu JSON válido para o capítulo." }; }
}

export function assembleSourceDraft(name: string, language: string, chapters: ChapterDraftPayload[]): CurriculumDraft {
  const source: ContentSource = {
    name, kind: "stack", language, origin: "ai_generated",
    chapters: chapters.map((item) => item.chapter),
    exercises: chapters.flatMap((item) => item.exercises),
    cards: chapters.flatMap((item) => item.cards),
  };
  return validateCurriculumDraft(source);
}
