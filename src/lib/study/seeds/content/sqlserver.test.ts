import { execFile } from "node:child_process";
import { describe, expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource } from "@/lib/content/contract";
import { checkEditorialSource, editorialMetrics } from "@/lib/content/editorial";
import { freshIndex } from "@/lib/study/migrate";
import { SQLSERVER_AUTHORED_PROSE } from "./sqlserverAuthoredProse";
import { SQLSERVER_CONTENT } from "./sqlserver";
import { SQLSERVER_SQL } from "./sqlserverSql";
import { applyContentSource } from "./materialize";

it("SQL Server — auditoria consolidada de densidade", () => {
  const low = SQLSERVER_CONTENT.chapters.flatMap((chapter) => chapter.sections)
    .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
    .filter(({ words }) => words < 600);
  if (low.length) throw new Error(JSON.stringify(low));
});

describe.each(SQLSERVER_CONTENT.chapters.map((chapter) => [chapter.title, chapter] as const))("SQL Server — capítulo: %s", (_name, chapter) => {
  it("possui quatro seções densas", () => {
    expect(chapter.sections).toHaveLength(4);
    expect(chapter.sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter(({ words }) => words < 600)).toEqual([]);
  });
});

it("SQL Server — mantém conteúdo autoral e dois exemplos por seção", () => {
  const titles = SQLSERVER_CONTENT.chapters.flatMap((chapter) => chapter.sections.map((section) => section.title));
  expect(Object.keys(SQLSERVER_AUTHORED_PROSE).sort()).toEqual([...titles].sort());
  expect(Object.keys(SQLSERVER_SQL).sort()).toEqual([...titles].sort());
  expect(new Set(titles).size).toBe(48);
  expect(SQLSERVER_CONTENT.chapters.flatMap((c) => c.sections).flatMap((s) => s.blocks).filter((b) => b.kind === "code")).toHaveLength(96);
});

it.skipIf(!process.env.CHIRON_SQLSERVER_CONNECTION_STRING)("SQL Server — executa 96 exemplos no SQL Server 2025 real", async () => {
  const snippets = SQLSERVER_CONTENT.chapters.flatMap((chapter) => chapter.sections).flatMap((section) =>
    section.blocks.filter((block): block is Extract<(typeof section.blocks)[number], { kind: "code" }> => block.kind === "code")
      .map(({ code }) => ({ title: section.title, code })),
  );
  const child = execFile("pwsh", ["-NoProfile", "-File", "scripts/check-sqlserver-snippets.ps1", "-ConnectionString", process.env.CHIRON_SQLSERVER_CONNECTION_STRING!], {
    cwd: process.cwd(), timeout: 180_000, maxBuffer: 2_000_000,
  });
  let stderr = "";
  child.stderr?.on("data", (chunk) => { stderr += String(chunk); });
  child.stdin?.end(JSON.stringify({ snippets }));
  const code = await new Promise<number | null>((resolve) => child.on("close", resolve));
  expect(code, stderr).toBe(0);
}, 190_000);

it("SQL Server — materializa e passa contratos e auditoria editorial", () => {
  const { index, lib } = applyContentSource(freshIndex(), SQLSERVER_CONTENT);
  expect([lib.chapters.length, lib.sections.length, lib.exercises.length, index.cards.length]).toEqual([12, 48, 36, 48]);
  for (const chapter of lib.chapters) expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
  expect(checkSource(index.sources[0], lib, index)).toEqual([]);
  expect(checkEditorialSource(SQLSERVER_CONTENT)).toEqual([]);
  expect(editorialMetrics(SQLSERVER_CONTENT).maximumSectionSimilarity).toBeLessThan(0.42);
}, 30_000);
