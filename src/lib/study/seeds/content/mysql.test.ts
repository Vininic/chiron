import { execFile } from "node:child_process";
import { describe, expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource } from "@/lib/content/contract";
import { checkEditorialSource, editorialMetrics } from "@/lib/content/editorial";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { MYSQL_CONTENT } from "./mysql";

describe.each(MYSQL_CONTENT.chapters.map((chapter) => [chapter.title, chapter] as const))("MySQL — capítulo: %s", (_name, chapter) => {
  it("possui quatro seções densas", () => {
    expect(chapter.sections).toHaveLength(4);
    expect(chapter.sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter(({ words }) => words < 600)).toEqual([]);
  });
});

it("MySQL — executa 96 exemplos no MySQL Community 8.4.11", async () => {
  const snippets = MYSQL_CONTENT.chapters.flatMap((chapter) => chapter.sections).flatMap((section) => section.blocks).filter((block): block is Extract<(typeof MYSQL_CONTENT.chapters)[number]["sections"][number]["blocks"][number], { kind: "code" }> => block.kind === "code").map(({ lang, code }) => ({ lang, code }));
  expect(snippets).toHaveLength(96);
  const child = execFile("node", ["scripts/check-mysql-snippets.mjs"], { cwd: process.cwd(), timeout: 300_000, maxBuffer: 2_000_000 });
  let stderr = "";
  child.stderr?.on("data", (chunk) => { stderr += String(chunk); });
  child.stdin?.end(JSON.stringify({ snippets }));
  const code = await new Promise<number | null>((resolve) => child.on("close", resolve));
  expect(code, stderr).toBe(0);
}, 310_000);

it("MySQL — materializa, passa contratos e auditoria editorial", () => {
  const { index, lib } = applyContentSource(freshIndex(), MYSQL_CONTENT);
  expect([lib.chapters.length, lib.sections.length, lib.exercises.length, index.cards.length]).toEqual([12, 48, 36, 48]);
  for (const chapter of lib.chapters) expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
  expect(checkSource(index.sources[0], lib, index)).toEqual([]);
  expect(checkEditorialSource(MYSQL_CONTENT)).toEqual([]);
  expect(editorialMetrics(MYSQL_CONTENT).maximumSectionSimilarity).toBeLessThan(0.42);
}, 20_000);
