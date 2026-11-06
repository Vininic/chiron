import { expect, it } from "vitest";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource } from "@/lib/content/contract";
import { checkEditorialSource, editorialMetrics } from "@/lib/content/editorial";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { CHIRON_CONTENT } from "./chiron";
import { CHIRON_AUTHORED_PROSE } from "./chironAuthoredProse";
import { CHIRON_EXAMPLES } from "./chironExamples";
import { CHIRON_REVIEW } from "./chironAssessments";

it("Chiron: fonte inteira 12/48/96/36/48, chaves exatas e piso vigente", () => {
  const sections = CHIRON_CONTENT.chapters.flatMap(chapter => chapter.sections);
  const titles = sections.map(section => section.title).sort();
  expect(CHIRON_CONTENT.chapters).toHaveLength(12);
  expect(sections).toHaveLength(48);
  expect(new Set(titles).size).toBe(48);
  for (const record of [CHIRON_AUTHORED_PROSE, CHIRON_EXAMPLES, CHIRON_REVIEW]) expect(Object.keys(record).sort()).toEqual(titles);
  expect(sections.flatMap(section => section.blocks).filter(block => block.kind === "code")).toHaveLength(96);
  expect(sections.map(section => ({ title: section.title, words: proseWordCount(section.blocks) })).filter(section => section.words < 600)).toEqual([]);
  expect(CHIRON_CONTENT.exercises).toHaveLength(36);
  expect(CHIRON_CONTENT.cards).toHaveLength(48);
  expect(CHIRON_CONTENT.chapters.every(chapter=>chapter.sections.length===4)).toBe(true);
  expect(new Set(CHIRON_CONTENT.chapters.map(chapter=>chapter.level)).size).toBe(3);
});

it("Chiron: contratos locais e métricas; aprovação editorial e cobertura integral de repo", () => {
  const { index, lib } = applyContentSource(freshIndex(), CHIRON_CONTENT);
  expect([lib.chapters.length, lib.sections.length, lib.exercises.length, index.cards.length]).toEqual([12,48,36,48]);
  for (const chapter of lib.chapters) expect(checkChapter(chapter,lib,index),chapter.title).toEqual([]);
  expect(checkSource(index.sources[0],lib,index)).toEqual([]);
  const metrics = editorialMetrics(CHIRON_CONTENT);
  console.info("CHIRON editorial", JSON.stringify(metrics), "minimum words", Math.min(...lib.sections.map(section => proseWordCount(section.blocks))));
  expect(metrics.maximumSectionSimilarity).toBeLessThan(.42);
  expect(metrics.maximumCardSimilarity).toBeLessThan(.78);
  expect(metrics.detailedExerciseRatio).toBeGreaterThanOrEqual(.65);
  expect(metrics.duplicatedCodeBlocks).toBe(0);
  expect(CHIRON_CONTENT.editorial).toMatchObject({proseReviewed:true,assessmentsReviewed:true,examplesVerified:true});
  expect(checkEditorialSource(CHIRON_CONTENT)).toEqual([]);
  if (process.env.CHIRON_WRITE_CHIRON_EVIDENCE === "1") {
    const sections=lib.sections.map(section=>({title:section.title,words:proseWordCount(section.blocks)}));
    writeFileSync(resolve("scripts/chiron-editorial-evidence.json"),JSON.stringify({generatedAt:new Date().toISOString(),counts:{chapters:lib.chapters.length,sections:lib.sections.length,examples:96,exercises:lib.exercises.length,cards:index.cards.length},metrics,sections,minimumWords:Math.min(...sections.map(section=>section.words)),totalProseWords:sections.reduce((sum,section)=>sum+section.words,0),chapterViolations:lib.chapters.flatMap(chapter=>checkChapter(chapter,lib,index)),sourceViolations:checkSource(index.sources[0],lib,index),editorialViolations:checkEditorialSource(CHIRON_CONTENT)},null,2)+"\n");
  }
}, 30000);
