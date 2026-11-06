import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { checkChapter, checkSource, checkStackSource } from "@/lib/content/contract";
import { proseWordCount } from "@/lib/content/blocks";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { NODEJS_CONTENT } from "./nodejs";

function expectNodeSnippetsToRun(snippets: readonly { code: string }[]): void {
  const result = spawnSync(process.execPath, ["scripts/check-nodejs-snippets.cjs"], {
    cwd: process.cwd(),
    input: JSON.stringify({ prefix: "nodejs-book", snippets: snippets.map((snippet) => snippet.code) }),
    encoding: "utf8",
    timeout: 120_000,
  });
  expect(result.status, result.error?.message || result.stderr || result.stdout).toBe(0);
}

describe("Node.js — apostila completa", () => {
  it("materializa 13 capítulos e passa o contrato integral", () => {
    const { index, lib } = applyContentSource(freshIndex(), NODEJS_CONTENT);
    expect(lib.chapters).toHaveLength(13);
    expect(lib.sections).toHaveLength(52);
    expect(lib.exercises).toHaveLength(39);
    expect(lib.exercises
      .map((exercise) => ({ prompt: exercise.promptMd, words: exercise.promptMd.trim().split(/\s+/).length }))
      .filter((exercise) => exercise.words < 30)).toEqual([]);
    expect(index.cards).toHaveLength(52);
    expect(lib.sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter((section) => section.words < 600)).toEqual([]);
    for (const chapter of lib.chapters) expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
    expect(checkStackSource(index.sources[0], lib)).toEqual([]);
    expect(checkSource(index.sources[0], lib, index)).toEqual([]);
  });

  it("executa os 104 exemplos completos em processos Node isolados", () => {
    const snippets = NODEJS_CONTENT.chapters
      .flatMap((chapter) => chapter.sections)
      .flatMap((section) => section.blocks)
      .filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(104);
    expectNodeSnippetsToRun(snippets);
  }, 120_000);
});
