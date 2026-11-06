import { expect, it } from "vitest";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource } from "@/lib/content/contract";
import { checkEditorialSource, editorialMetrics } from "@/lib/content/editorial";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { GITHUB_COPILOT_CONTENT } from "./githubCopilot";
import { GITHUB_COPILOT_AUTHORED_PROSE } from "./githubCopilotAuthoredProse";
import { GITHUB_COPILOT_EXAMPLES } from "./githubCopilotExamples";
import { GITHUB_COPILOT_REVIEW } from "./githubCopilotAssessments";

it("GitHub Copilot: fonte inteira 12/48/96/36/48, chaves exatas e piso vigente", () => {
  const sections = GITHUB_COPILOT_CONTENT.chapters.flatMap(chapter => chapter.sections);
  const titles = sections.map(section => section.title).sort();
  expect(GITHUB_COPILOT_CONTENT.chapters).toHaveLength(12);
  expect(sections).toHaveLength(48);
  expect(new Set(titles).size).toBe(48);
  for (const record of [GITHUB_COPILOT_AUTHORED_PROSE, GITHUB_COPILOT_EXAMPLES, GITHUB_COPILOT_REVIEW]) expect(Object.keys(record).sort()).toEqual(titles);
  expect(sections.flatMap(section => section.blocks).filter(block => block.kind === "code")).toHaveLength(96);
  expect(sections.map(section => ({ title: section.title, words: proseWordCount(section.blocks) })).filter(section => section.words < 600)).toEqual([]);
  expect(GITHUB_COPILOT_CONTENT.exercises).toHaveLength(36);
  expect(GITHUB_COPILOT_CONTENT.cards).toHaveLength(48);
  expect(GITHUB_COPILOT_CONTENT.chapters.every(chapter=>chapter.sections.length===4)).toBe(true);
  expect(new Set(GITHUB_COPILOT_CONTENT.chapters.map(chapter=>chapter.level)).size).toBe(3);
});

it("GitHub Copilot: contratos materializados e auditoria editorial integral", () => {
  const { index, lib } = applyContentSource(freshIndex(), GITHUB_COPILOT_CONTENT);
  expect([lib.chapters.length, lib.sections.length, lib.exercises.length, index.cards.length]).toEqual([12,48,36,48]);
  for (const chapter of lib.chapters) expect(checkChapter(chapter,lib,index),chapter.title).toEqual([]);
  expect(checkSource(index.sources[0],lib,index)).toEqual([]);
  const metrics = editorialMetrics(GITHUB_COPILOT_CONTENT);
  console.info("GITHUB_COPILOT editorial", JSON.stringify(metrics), "minimum words", Math.min(...lib.sections.map(section => proseWordCount(section.blocks))));
  expect(metrics.maximumSectionSimilarity).toBeLessThan(.42);
  expect(metrics.maximumCardSimilarity).toBeLessThan(.78);
  expect(metrics.detailedExerciseRatio).toBeGreaterThanOrEqual(.65);
  expect(metrics.duplicatedCodeBlocks).toBe(0);
  expect(checkEditorialSource(GITHUB_COPILOT_CONTENT)).toEqual([]);
  if (process.env.CHIRON_WRITE_GITHUB_COPILOT_EVIDENCE === "1") {
    const sections=lib.sections.map(section=>({title:section.title,words:proseWordCount(section.blocks)}));
    writeFileSync(resolve("scripts/githubCopilot-editorial-evidence.json"),JSON.stringify({generatedAt:new Date().toISOString(),counts:{chapters:lib.chapters.length,sections:lib.sections.length,examples:96,exercises:lib.exercises.length,cards:index.cards.length},metrics,sections,minimumWords:Math.min(...sections.map(section=>section.words)),totalProseWords:sections.reduce((sum,section)=>sum+section.words,0),chapterViolations:lib.chapters.flatMap(chapter=>checkChapter(chapter,lib,index)),sourceViolations:checkSource(index.sources[0],lib,index),editorialViolations:checkEditorialSource(GITHUB_COPILOT_CONTENT)},null,2)+"\n");
  }
}, 30000);
