import { execFile } from "node:child_process";
import { describe, expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource } from "@/lib/content/contract";
import { checkEditorialSource, editorialMetrics } from "@/lib/content/editorial";
import { freshIndex } from "@/lib/study/migrate";
import { MARIADB_AUTHORED_PROSE } from "./mariadbAuthoredProse";
import { MARIADB_CONTENT } from "./mariadb";
import { applyContentSource } from "./materialize";

describe.each(MARIADB_CONTENT.chapters.map((chapter) => [chapter.title, chapter] as const))("MariaDB — capítulo: %s", (_name, chapter) => {
  it("possui quatro seções densas", () => {
    expect(chapter.sections).toHaveLength(4);
    expect(chapter.sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter(({ words }) => words < 600)).toEqual([]);
  });
});

it("MariaDB — mantém uma entrada autoral por seção, sem fallback genérico", () => {
  const titles = MARIADB_CONTENT.chapters.flatMap((chapter) => chapter.sections.map((section) => section.title));
  expect(Object.keys(MARIADB_AUTHORED_PROSE).sort()).toEqual([...titles].sort());
  expect(new Set(titles).size).toBe(48);
});

it("MariaDB — executa 96 exemplos no MariaDB Community 11.8.9 real", async () => {
  const snippets = MARIADB_CONTENT.chapters.flatMap((chapter) => chapter.sections).flatMap((section) =>
    section.blocks
      .filter((block): block is Extract<(typeof section.blocks)[number], { kind: "code" }> => block.kind === "code")
      .map(({ code }) => ({ title: section.title, code })),
  );
  expect(snippets).toHaveLength(96);
  const child = execFile("node", ["scripts/check-mariadb-snippets.mjs"], { cwd: process.cwd(), timeout: 130_000, maxBuffer: 2_000_000 });
  let stderr = "";
  child.stderr?.on("data", (chunk) => { stderr += String(chunk); });
  child.stdin?.end(JSON.stringify({ snippets }));
  const code = await new Promise<number | null>((resolve) => child.on("close", resolve));
  expect(code, stderr).toBe(0);
}, 140_000);

it("MariaDB — materializa, passa contratos e auditoria editorial", () => {
  const { index, lib } = applyContentSource(freshIndex(), MARIADB_CONTENT);
  expect([lib.chapters.length, lib.sections.length, lib.exercises.length, index.cards.length]).toEqual([12, 48, 36, 48]);
  for (const chapter of lib.chapters) expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
  expect(checkSource(index.sources[0], lib, index)).toEqual([]);
  expect(checkEditorialSource(MARIADB_CONTENT)).toEqual([]);
  expect(editorialMetrics(MARIADB_CONTENT).maximumSectionSimilarity).toBeLessThan(0.42);
}, 30_000);
