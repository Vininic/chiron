import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource, checkToolSource } from "@/lib/content/contract";
import { checkEditorialSource, editorialMetrics } from "@/lib/content/editorial";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { SUPABASE_AUTHORED_PROSE } from "./supabaseAuthoredProse";
import { SUPABASE_CONTENT } from "./supabase";
import { SUPABASE_EXAMPLES } from "./supabaseExamples";

it("Supabase — auditoria consolidada de densidade", () => {
  const low = SUPABASE_CONTENT.chapters.flatMap((chapter) => chapter.sections)
    .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
    .filter(({ words }) => words < 600);
  if (low.length) throw new Error(JSON.stringify(low));
});

describe.each(SUPABASE_CONTENT.chapters.map((chapter) => [chapter.title, chapter] as const))("Supabase — capítulo: %s", (_name, chapter) => {
  it("possui quatro seções densas", () => {
    expect(chapter.sections).toHaveLength(4);
    expect(chapter.sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter(({ words }) => words < 600)).toEqual([]);
  });
});

it("Supabase — mantém conteúdo autoral e dois exemplos por seção", () => {
  const titles = SUPABASE_CONTENT.chapters.flatMap((chapter) => chapter.sections.map((section) => section.title));
  expect(Object.keys(SUPABASE_AUTHORED_PROSE).sort()).toEqual([...titles].sort());
  expect(Object.keys(SUPABASE_EXAMPLES).sort()).toEqual([...titles].sort());
  expect(new Set(titles).size).toBe(48);
  expect(SUPABASE_CONTENT.chapters.flatMap((chapter) => chapter.sections).flatMap((section) => section.blocks).filter((block) => block.kind === "code")).toHaveLength(96);
});

it("Supabase — valida a sintaxe dos 96 exemplos TypeScript na ferramenta real", () => {
  const snippets = SUPABASE_CONTENT.chapters.flatMap((chapter) => chapter.sections).flatMap((section) =>
    section.blocks.filter((block): block is Extract<(typeof section.blocks)[number], { kind: "code" }> => block.kind === "code")
      .map(({ code }) => ({ title: section.title, code })),
  );
  const result = spawnSync("node", ["scripts/check-supabase-snippets.cjs"], {
    cwd: process.cwd(), input: JSON.stringify({ snippets }), encoding: "utf8", timeout: 60_000,
  });
  expect(result.status, result.error?.message || result.stderr || result.stdout).toBe(0);
});

it("Supabase — materializa e passa contratos e auditoria editorial", () => {
  const { index, lib } = applyContentSource(freshIndex(), SUPABASE_CONTENT);
  expect([lib.chapters.length, lib.sections.length, lib.exercises.length, index.cards.length]).toEqual([12, 48, 36, 48]);
  for (const chapter of lib.chapters) expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
  expect(checkToolSource(index.sources[0], lib)).toEqual([]);
  expect(checkSource(index.sources[0], lib, index)).toEqual([]);
  expect(checkEditorialSource(SUPABASE_CONTENT)).toEqual([]);
  expect(editorialMetrics(SUPABASE_CONTENT).maximumSectionSimilarity).toBeLessThan(0.42);
  expect(lib.sections.some((section) => section.blocks.some((block) => block.kind === "labref" && block.labId === "agora" && block.layerId === "supabase-rls-storage-realtime-recovery-gate"))).toBe(true);
}, 30_000);
