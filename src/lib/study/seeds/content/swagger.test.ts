import { describe, expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource } from "@/lib/content/contract";
import { editorialMetrics } from "@/lib/content/editorial";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { SWAGGER_AUTHORED_PROSE } from "./swaggerAuthoredProse";
import { SWAGGER_CONTENT } from "./swagger";
import { SWAGGER_EXAMPLES } from "./swaggerExamples";

it("Swagger draft — 56 seções autorais com dois exemplos e piso de densidade", () => {
  const sections = SWAGGER_CONTENT.chapters.flatMap((chapter) => chapter.sections);
  const titles = sections.map((section) => section.title);
  expect(SWAGGER_CONTENT.chapters).toHaveLength(14);
  expect(sections).toHaveLength(56);
  expect(new Set(titles).size).toBe(56);
  expect(Object.keys(SWAGGER_AUTHORED_PROSE).sort()).toEqual([...titles].sort());
  expect(Object.keys(SWAGGER_EXAMPLES).sort()).toEqual([...titles].sort());
  expect(sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code")).toHaveLength(112);
  expect(sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter(({ words }) => words < 600)).toEqual([]);
});

describe.each(SWAGGER_CONTENT.chapters.map((chapter) => [chapter.title, chapter] as const))("Swagger draft — capítulo %s", (_name, chapter) => {
  it("contém quatro seções densas", () => {
    expect(chapter.sections).toHaveLength(4);
    expect(chapter.sections.every((section) => proseWordCount(section.blocks) >= 600)).toBe(true);
  });
});

it("Swagger draft — materializa contratos e métricas sem atestar execução ausente", () => {
  const { index, lib } = applyContentSource(freshIndex(), SWAGGER_CONTENT);
  expect([lib.chapters.length, lib.sections.length, lib.exercises.length, index.cards.length]).toEqual([14, 56, 42, 56]);
  for (const chapter of lib.chapters) expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
  expect(checkSource(index.sources[0], lib, index)).toEqual([]);
  const metrics = editorialMetrics(SWAGGER_CONTENT);
  expect(metrics.maximumSectionSimilarity).toBeLessThan(0.42);
  expect(metrics.maximumCardSimilarity).toBeLessThan(0.78);
  expect(metrics.detailedExerciseRatio).toBeGreaterThanOrEqual(0.65);
  expect(metrics.duplicatedCodeBlocks).toBe(0);
  expect(SWAGGER_CONTENT.editorial).toBeUndefined();
}, 30_000);
