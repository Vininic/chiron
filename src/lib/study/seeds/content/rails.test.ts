import { describe, expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource } from "@/lib/content/contract";
import { editorialMetrics } from "@/lib/content/editorial";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { RAILS_AUTHORED_PROSE } from "./railsAuthoredProse";
import { RAILS_CONTENT } from "./rails";
import { RAILS_EXAMPLES } from "./railsExamples";

it("Rails draft — 48 seções autorais com dois exemplos e piso de densidade", () => {
  const sections = RAILS_CONTENT.chapters.flatMap((chapter) => chapter.sections); const titles = sections.map((section) => section.title);
  expect(RAILS_CONTENT.chapters).toHaveLength(12); expect(sections).toHaveLength(48); expect(new Set(titles).size).toBe(48);
  expect(Object.keys(RAILS_AUTHORED_PROSE).sort()).toEqual([...titles].sort()); expect(Object.keys(RAILS_EXAMPLES).sort()).toEqual([...titles].sort());
  expect(sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code")).toHaveLength(96);
  expect(sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter(({ words }) => words < 600)).toEqual([]);
});
describe.each(RAILS_CONTENT.chapters.map((chapter) => [chapter.title, chapter] as const))("Rails draft — capítulo %s", (_name, chapter) => {
  it("contém quatro seções densas", () => { expect(chapter.sections).toHaveLength(4); expect(chapter.sections.every((section) => proseWordCount(section.blocks) >= 600)).toBe(true); });
});
it("Rails draft — materializa contratos e métricas sem atestar execução", () => {
  const { index, lib } = applyContentSource(freshIndex(), RAILS_CONTENT);
  expect([lib.chapters.length, lib.sections.length, lib.exercises.length, index.cards.length]).toEqual([12, 48, 36, 48]);
  for (const chapter of lib.chapters) expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
  expect(checkSource(index.sources[0], lib, index)).toEqual([]);
  const metrics = editorialMetrics(RAILS_CONTENT);
  expect(metrics.maximumSectionSimilarity).toBeLessThan(0.42); expect(metrics.maximumCardSimilarity).toBeLessThan(0.78);
  expect(metrics.detailedExerciseRatio).toBeGreaterThanOrEqual(0.65); expect(metrics.duplicatedCodeBlocks).toBe(0);
  expect(RAILS_CONTENT.editorial).toBeUndefined();
}, 30_000);
