import { describe, expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource } from "@/lib/content/contract";
import { checkEditorialSource, editorialMetrics } from "@/lib/content/editorial";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { JAVA_AUTHORED_PROSE } from "./javaAuthoredProse";
import { JAVA_CONTENT } from "./java";
import { JAVA_EXAMPLES } from "./javaExamples";

it("Java — auditoria consolidada de densidade", () => {
  const low = JAVA_CONTENT.chapters.flatMap((chapter) => chapter.sections)
    .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
    .filter(({ words }) => words < 600);
  if (low.length) throw new Error(JSON.stringify(low));
});

describe.each(JAVA_CONTENT.chapters.map((chapter) => [chapter.title, chapter] as const))("Java — capítulo: %s", (_name, chapter) => {
  it("possui quatro seções densas", () => {
    expect(chapter.sections).toHaveLength(4);
    expect(chapter.sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter(({ words }) => words < 600)).toEqual([]);
  });
});

it("Java — mantém 48 seções autorais e dois exemplos por seção", () => {
  const titles = JAVA_CONTENT.chapters.flatMap((chapter) => chapter.sections.map((section) => section.title));
  expect(Object.keys(JAVA_AUTHORED_PROSE).sort()).toEqual([...titles].sort());
  expect(Object.keys(JAVA_EXAMPLES).sort()).toEqual([...titles].sort());
  expect(new Set(titles).size).toBe(48);
  expect(JAVA_CONTENT.chapters.flatMap((chapter) => chapter.sections).flatMap((section) => section.blocks).filter((block) => block.kind === "code")).toHaveLength(96);
});

it("Java — materializa e passa contratos e auditoria editorial", () => {
  const { index, lib } = applyContentSource(freshIndex(), JAVA_CONTENT);
  expect([lib.chapters.length, lib.sections.length, lib.exercises.length, index.cards.length]).toEqual([12, 48, 36, 48]);
  for (const chapter of lib.chapters) expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
  expect(checkSource(index.sources[0], lib, index)).toEqual([]);
  expect(checkEditorialSource(JAVA_CONTENT)).toEqual([]);
  expect(editorialMetrics(JAVA_CONTENT).maximumSectionSimilarity).toBeLessThan(0.42);
}, 30_000);
