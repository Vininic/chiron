import { describe, expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource } from "@/lib/content/contract";
import { editorialMetrics } from "@/lib/content/editorial";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { SPRING_BOOT_AUTHORED_PROSE } from "./springbootAuthoredProse";
import { SPRING_BOOT_CONTENT } from "./springboot";
import { SPRING_BOOT_EXAMPLES } from "./springbootExamples";

it("Spring Boot — 48 seções autorais com dois exemplos específicos por seção", () => {
  const sections = SPRING_BOOT_CONTENT.chapters.flatMap((chapter) => chapter.sections);
  const titles = sections.map((section) => section.title);
  expect(SPRING_BOOT_CONTENT.chapters).toHaveLength(12);
  expect(sections).toHaveLength(48);
  expect(new Set(titles).size).toBe(48);
  expect(Object.keys(SPRING_BOOT_AUTHORED_PROSE).sort()).toEqual([...titles].sort());
  expect(Object.keys(SPRING_BOOT_EXAMPLES).sort()).toEqual([...titles].sort());
  expect(sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code")).toHaveLength(96);
  expect(sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter(({ words }) => words < 600)).toEqual([]);
});

describe.each(SPRING_BOOT_CONTENT.chapters.map((chapter) => [chapter.title, chapter] as const))("Spring Boot — capítulo %s", (_name, chapter) => {
  it("contém quatro seções densas", () => {
    expect(chapter.sections).toHaveLength(4);
    expect(chapter.sections.every((section) => proseWordCount(section.blocks) >= 600)).toBe(true);
  });
});

it("Spring Boot — materializa contratos e métricas editoriais sem atestar execução não feita", () => {
  const { index, lib } = applyContentSource(freshIndex(), SPRING_BOOT_CONTENT);
  expect([lib.chapters.length, lib.sections.length, lib.exercises.length, index.cards.length]).toEqual([12, 48, 36, 48]);
  for (const chapter of lib.chapters) expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
  expect(checkSource(index.sources[0], lib, index)).toEqual([]);
  const metrics = editorialMetrics(SPRING_BOOT_CONTENT);
  expect(metrics.maximumSectionSimilarity).toBeLessThan(0.42);
  expect(metrics.maximumCardSimilarity).toBeLessThan(0.78);
  expect(metrics.detailedExerciseRatio).toBeGreaterThanOrEqual(0.65);
  expect(metrics.duplicatedCodeBlocks).toBe(0);
  expect(SPRING_BOOT_CONTENT.editorial).toBeUndefined();
}, 30_000);
