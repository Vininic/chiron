import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { freshIndex } from "@/lib/study/migrate";
import { checkChapter, checkSource, checkStackSource } from "@/lib/content/contract";
import { proseWordCount } from "@/lib/content/blocks";
import { applyContentSource } from "./materialize";
import { TYPESCRIPT_CONTENT } from "./typescript";
import { TYPESCRIPT_INFERENCE_CHAPTER } from "./typescriptInferenceChapter";
import { TYPESCRIPT_FUNCTIONS_CHAPTER } from "./typescriptFunctionsChapter";
import { TYPESCRIPT_GENERICS_CHAPTER } from "./typescriptGenericsChapter";
import { TYPESCRIPT_DERIVED_TYPES_CHAPTER } from "./typescriptDerivedTypesChapter";
import { TYPESCRIPT_MODULES_CHAPTER } from "./typescriptModulesChapter";
import { TYPESCRIPT_CLASSES_CHAPTER } from "./typescriptClassesChapter";
import { TYPESCRIPT_ASYNC_CHAPTER } from "./typescriptAsyncChapter";
import { TYPESCRIPT_SCHEMAS_CHAPTER } from "./typescriptSchemasChapter";
import { TYPESCRIPT_TESTING_CHAPTER } from "./typescriptTestingChapter";
import { TYPESCRIPT_PERFORMANCE_CHAPTER } from "./typescriptPerformanceChapter";
import { TYPESCRIPT_PROJECT_CHAPTER } from "./typescriptProjectChapter";
import { TYPESCRIPT_STRICT_SECTION } from "./typescriptStrictSection";

function expectSnippetsToCompile(snippets: readonly { code: string }[], prefix: string): void {
  const result = spawnSync(process.execPath, ["scripts/check-typescript-snippets.cjs"], {
    cwd: process.cwd(),
    input: JSON.stringify({ prefix, snippets: snippets.map((snippet) => snippet.code) }),
    encoding: "utf8",
  });
  expect(result.status, result.stderr || result.stdout).toBe(0);
}

describe("TypeScript — inferência, literais e satisfies reescrito", () => {
  it("possui quatro seções autorais densas e exemplos verificados", () => {
    const { index, lib } = applyContentSource(freshIndex(), TYPESCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === TYPESCRIPT_INFERENCE_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    expect(sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter((section) => section.words < 600)).toEqual([]);
    expect(checkChapter(chapter, lib, index)).toEqual([]);

    const snippets = TYPESCRIPT_INFERENCE_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    expectSnippetsToCompile(snippets, "typescript-inference");
  });
});

describe("TypeScript — funções, overloads e callbacks reescrito", () => {
  it("possui quatro seções autorais, avaliações próprias e exemplos semanticamente compilados", () => {
    const { index, lib } = applyContentSource(freshIndex(), TYPESCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === TYPESCRIPT_FUNCTIONS_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    expect(sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter((section) => section.words < 600)).toEqual([]);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);

    const snippets = TYPESCRIPT_FUNCTIONS_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    expectSnippetsToCompile(snippets, "typescript-functions");
  });
});

describe("TypeScript — generics, restrições e inferência reescrito", () => {
  it("preserva relações em quatro seções densas, avaliações próprias e exemplos compilados", () => {
    const { index, lib } = applyContentSource(freshIndex(), TYPESCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === TYPESCRIPT_GENERICS_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
    const snippets = TYPESCRIPT_GENERICS_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    expectSnippetsToCompile(snippets, "typescript-generics");
  });
});

describe("TypeScript — mapped, conditional e template literals reescrito", () => {
  it("deriva contratos em quatro seções densas, avaliações próprias e exemplos compilados", () => {
    const { index, lib } = applyContentSource(freshIndex(), TYPESCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === TYPESCRIPT_DERIVED_TYPES_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
    const snippets = TYPESCRIPT_DERIVED_TYPES_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    expectSnippetsToCompile(snippets, "typescript-derived-types");
  });
});

describe("TypeScript — módulos, declarations e resolução reescrito", () => {
  it("trata módulos como contratos em quatro seções densas, avaliações próprias e exemplos compilados", () => {
    const { index, lib } = applyContentSource(freshIndex(), TYPESCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === TYPESCRIPT_MODULES_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    expect(sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter((section) => section.words < 600)).toEqual([]);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
    const snippets = TYPESCRIPT_MODULES_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    expectSnippetsToCompile(snippets, "typescript-modules");
  });
});

describe("TypeScript — classes, decorators e composição reescrito", () => {
  it("modela lifecycle em quatro seções densas, avaliações próprias e exemplos compilados", () => {
    const { index, lib } = applyContentSource(freshIndex(), TYPESCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === TYPESCRIPT_CLASSES_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    expect(sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter((section) => section.words < 600)).toEqual([]);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
    const snippets = TYPESCRIPT_CLASSES_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    expectSnippetsToCompile(snippets, "typescript-classes");
  });
});

describe("TypeScript — erros, Result, async e cancelamento reescrito", () => {
  it("explicita falhas em quatro seções densas, avaliações próprias e exemplos compilados", () => {
    const { index, lib } = applyContentSource(freshIndex(), TYPESCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === TYPESCRIPT_ASYNC_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    expect(sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter((section) => section.words < 600)).toEqual([]);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
    const snippets = TYPESCRIPT_ASYNC_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    expectSnippetsToCompile(snippets, "typescript-async");
  });
});

describe("TypeScript — schemas, serialização e APIs reescrito", () => {
  it("valida fronteiras em quatro seções densas, avaliações próprias e exemplos compilados", () => {
    const { index, lib } = applyContentSource(freshIndex(), TYPESCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === TYPESCRIPT_SCHEMAS_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    expect(sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter((section) => section.words < 600)).toEqual([]);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
    const snippets = TYPESCRIPT_SCHEMAS_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    expectSnippetsToCompile(snippets, "typescript-schemas");
  });
});

for (const [chapter, prefix] of [
  [TYPESCRIPT_TESTING_CHAPTER, "typescript-testing"],
  [TYPESCRIPT_PERFORMANCE_CHAPTER, "typescript-performance"],
  [TYPESCRIPT_PROJECT_CHAPTER, "typescript-project"],
] as const) {
  describe(`TypeScript — ${chapter.title} reescrito`, () => {
    it("possui quatro seções autorais densas, avaliações próprias e exemplos compilados", () => {
      const { index, lib } = applyContentSource(freshIndex(), TYPESCRIPT_CONTENT);
      const materialized = lib.chapters.find((candidate) => candidate.title === chapter.title)!;
      const sections = lib.sections.filter((section) => section.chapterId === materialized.id);
      expect(sections).toHaveLength(4);
      expect(sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter((section) => section.words < 600)).toEqual([]);
      expect(checkChapter(materialized, lib, index)).toEqual([]);
      const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
      expect(exercises).toHaveLength(3);
      expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
      const snippets = chapter.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
      expect(snippets).toHaveLength(8);
      expectSnippetsToCompile(snippets, prefix);
    });
  });
}

describe("TypeScript — configuração estrita reescrita", () => {
  it("é autoral, densa e mantém exemplos semanticamente válidos", () => {
    expect(proseWordCount(TYPESCRIPT_STRICT_SECTION.blocks)).toBeGreaterThanOrEqual(600);
    const snippets = TYPESCRIPT_STRICT_SECTION.blocks.filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(2);
    expectSnippetsToCompile(snippets, "typescript-strict");
  });
});

describe("TypeScript — apostila completa", () => {
  it("materializa 12 capítulos e passa o contrato integral", () => {
    const { index, lib } = applyContentSource(freshIndex(), TYPESCRIPT_CONTENT);
    expect(lib.chapters).toHaveLength(12);
    expect(lib.sections).toHaveLength(48);
    expect(lib.exercises).toHaveLength(36);
    expect(index.cards).toHaveLength(48);
    for (const section of lib.sections) {
      expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    }
    for (const chapter of lib.chapters) {
      expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
    }
    expect(checkStackSource(index.sources[0], lib)).toEqual([]);
    expect(checkSource(index.sources[0], lib, index)).toEqual([]);
  });
});
