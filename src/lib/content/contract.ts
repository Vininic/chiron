/** The completeness contract — turns "dá pra aprender só com isso?" into a
 *  mechanical check instead of an opinion (2026-07-29 review). Every function
 *  here is pure: given the domain documents, return the list of things a
 *  seeded/generated source is missing. An empty array means it passes.
 *
 *  Honesty about scope: some of the plan's bars aren't checkable from these
 *  documents alone. "Every file in the repo has coverage" and "every
 *  exported function has a subsection" would need the actual repo file tree
 *  to compare against, which isn't part of `ChironLib` — that comparison
 *  belongs to the ingestion pipeline (`lib/study/ingestion/`), not this pure
 *  contract. What's checked here are the parts that *are* fully determined
 *  by the stored documents: word counts, block-kind presence, chapter/level
 *  coverage, citation presence. Passing this contract is necessary, not
 *  sufficient, for meeting the full bar in PLANO.md §3.2. */
import type {
  Chapter, ChapterLevel, ChironIndex, ChironLib, ApostilaSection, StudySource,
} from "@/lib/study/types";
import { countBlocksOfKind, hasBlockOfKind, proseWordCount } from "./blocks";

export interface Violation {
  rule: string;
  message: string;
}

export const MIN_SECTIONS_PER_CHAPTER = 4;
export const MIN_PROSE_WORDS_PER_SECTION = 600;
export const MIN_CODE_BLOCKS_PER_SECTION = 2;
export const MIN_EXERCISES_PER_CHAPTER = 3;
export const MIN_EXERCISE_TYPES_PER_CHAPTER = 2;
export const MIN_CARDS_PER_CHAPTER = 4;

export const MIN_CHAPTERS_PER_STACK = 12;
const STACK_LEVELS: ChapterLevel[] = ["basico", "intermediario", "avancado"];

export const MIN_CHAPTERS_PER_TOOL = 8;

// ── Section ─────────────────────────────────────────────────────────

export function checkSection(section: ApostilaSection): Violation[] {
  const violations: Violation[] = [];
  const words = proseWordCount(section.blocks);
  if (words < MIN_PROSE_WORDS_PER_SECTION) {
    violations.push({
      rule: "section.proseWords",
      message: `"${section.title}" tem ${words} palavras de prosa, mínimo ${MIN_PROSE_WORDS_PER_SECTION}`,
    });
  }
  const codeBlocks = countBlocksOfKind(section.blocks, "code");
  if (codeBlocks < MIN_CODE_BLOCKS_PER_SECTION) {
    violations.push({
      rule: "section.codeBlocks",
      message: `"${section.title}" tem ${codeBlocks} bloco(s) de código, mínimo ${MIN_CODE_BLOCKS_PER_SECTION}`,
    });
  }
  if (!hasBlockOfKind(section.blocks, "porque")) {
    violations.push({ rule: "section.porque", message: `"${section.title}" não tem bloco "porque" (critério arquitetural)` });
  }
  if (!hasBlockOfKind(section.blocks, "quebraria")) {
    violations.push({ rule: "section.quebraria", message: `"${section.title}" não tem bloco "quebraria" (o que falha em produção)` });
  }
  return violations;
}

// ── Chapter ─────────────────────────────────────────────────────────

export function checkChapter(chapter: Chapter, lib: ChironLib, index: ChironIndex): Violation[] {
  const violations: Violation[] = [];
  const sections = lib.sections.filter((s) => chapter.sectionIds.includes(s.id));

  if (sections.length < MIN_SECTIONS_PER_CHAPTER) {
    violations.push({
      rule: "chapter.sections",
      message: `capítulo "${chapter.title}" tem ${sections.length} seção(ões), mínimo ${MIN_SECTIONS_PER_CHAPTER}`,
    });
  }
  for (const section of sections) violations.push(...checkSection(section));

  const nodeIds = new Set(sections.map((s) => s.nodeId));
  const exercises = lib.exercises.filter((e) => nodeIds.has(e.nodeId));
  if (exercises.length < MIN_EXERCISES_PER_CHAPTER) {
    violations.push({
      rule: "chapter.exercises",
      message: `capítulo "${chapter.title}" tem ${exercises.length} exercício(s), mínimo ${MIN_EXERCISES_PER_CHAPTER}`,
    });
  }
  const distinctTypes = new Set(exercises.map((e) => e.type)).size;
  if (distinctTypes < MIN_EXERCISE_TYPES_PER_CHAPTER) {
    violations.push({
      rule: "chapter.exerciseTypes",
      message: `capítulo "${chapter.title}" cobre ${distinctTypes} tipo(s) de exercício, mínimo ${MIN_EXERCISE_TYPES_PER_CHAPTER}`,
    });
  }
  const cards = index.cards.filter((c) => nodeIds.has(c.nodeId));
  if (cards.length < MIN_CARDS_PER_CHAPTER) {
    violations.push({
      rule: "chapter.cards",
      message: `capítulo "${chapter.title}" tem ${cards.length} card(s) SRS, mínimo ${MIN_CARDS_PER_CHAPTER}`,
    });
  }
  return violations;
}

export function checkAllChapters(source: StudySource, lib: ChironLib, index: ChironIndex): Violation[] {
  return lib.chapters
    .filter((c) => c.sourceId === source.id)
    .flatMap((c) => checkChapter(c, lib, index));
}

// ── Source-level: stack (language/framework) ───────────────────────

export function checkStackSource(source: StudySource, lib: ChironLib): Violation[] {
  const violations: Violation[] = [];
  const chapters = lib.chapters.filter((c) => c.sourceId === source.id);

  if (chapters.length < MIN_CHAPTERS_PER_STACK) {
    violations.push({
      rule: "stack.chapterCount",
      message: `"${source.name}" tem ${chapters.length} capítulo(s), mínimo ${MIN_CHAPTERS_PER_STACK}`,
    });
  }

  const levelsPresent = new Set(chapters.map((c) => c.level));
  for (const level of STACK_LEVELS) {
    if (!levelsPresent.has(level)) {
      violations.push({ rule: "stack.levelCoverage", message: `"${source.name}" não tem nenhum capítulo de nível "${level}"` });
    }
  }

  const hasIntegrator = chapters.some((c) => {
    const sections = lib.sections.filter((s) => c.sectionIds.includes(s.id));
    return sections.some((s) => hasBlockOfKind(s.blocks, "labref"));
  });
  if (!hasIntegrator) {
    violations.push({ rule: "stack.integratorChapter", message: `"${source.name}" não tem um capítulo integrador ligado a um Lab (bloco "labref")` });
  }

  return violations;
}

// ── Source-level: repo ──────────────────────────────────────────────

export function checkRepoSource(source: StudySource, lib: ChironLib): Violation[] {
  const violations: Violation[] = [];
  const sections = lib.sections.filter((s) => s.sourceId === source.id);

  if (sections.length === 0) {
    return [{ rule: "repo.hasSections", message: `"${source.name}" não tem nenhuma seção` }];
  }

  const uncited = sections.filter((s) => !hasBlockOfKind(s.blocks, "cite"));
  if (uncited.length > 0) {
    violations.push({
      rule: "repo.citations",
      message: `"${source.name}": ${uncited.length} seção(ões) sem nenhuma citação de arquivo/símbolo real`,
    });
  }

  if (!sections.some((s) => hasBlockOfKind(s.blocks, "diagram"))) {
    violations.push({ rule: "repo.diagram", message: `"${source.name}" não tem nenhum diagrama` });
  }

  if (!sections.some((s) => /como estender|how to extend/i.test(s.title))) {
    violations.push({ rule: "repo.extendSection", message: `"${source.name}" não tem seção "Como estender"` });
  }

  return violations;
}

// ── Source-level: tool ──────────────────────────────────────────────

export function checkToolSource(source: StudySource, lib: ChironLib): Violation[] {
  const violations: Violation[] = [];
  const chapters = lib.chapters.filter((c) => c.sourceId === source.id);

  if (chapters.length < MIN_CHAPTERS_PER_TOOL) {
    violations.push({
      rule: "tool.chapterCount",
      message: `"${source.name}" tem ${chapters.length} capítulo(s), mínimo ${MIN_CHAPTERS_PER_TOOL}`,
    });
  }
  if (!chapters.some((c) => /armadilha|pitfall/i.test(c.title))) {
    violations.push({ rule: "tool.pitfallsChapter", message: `"${source.name}" não tem capítulo de armadilhas comuns` });
  }

  return violations;
}

// ── Dispatch ────────────────────────────────────────────────────────

function checkSourceContent(source: StudySource, lib: ChironLib): Violation[] {
  if (source.kind === "stack") return checkStackSource(source, lib);
  if (source.kind === "tool") return checkToolSource(source, lib);
  return checkRepoSource(source, lib);
}

/** The full contract for one source: its own chapters/sections, plus the
 *  kind-specific structural checks (stack ladder vs. repo coverage vs. tool
 *  workflow depth). */
export function checkSource(source: StudySource, lib: ChironLib, index: ChironIndex): Violation[] {
  return [...checkAllChapters(source, lib, index), ...checkSourceContent(source, lib)];
}
