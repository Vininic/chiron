import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { checkChapter, checkSource, checkStackSource } from "@/lib/content/contract";
import { proseWordCount } from "@/lib/content/blocks";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { CSS_CONTENT } from "./css";

describe.each(CSS_CONTENT.chapters.map((chapter) => [chapter.title, chapter] as const))("CSS — capítulo reescrito: %s", (_name, chapter) => {
  it("possui quatro seções autorais densas", () => {
    expect(chapter.sections).toHaveLength(4);
    const thinSections = chapter.sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter((section) => section.words < 600);
    expect(thinSections, JSON.stringify(thinSections)).toEqual([]);
  });
});

it("CSS — os 96 exemplos são parseáveis pelo PostCSS", () => {
  const snippets = CSS_CONTENT.chapters.flatMap((chapter) => chapter.sections).flatMap((section) => section.blocks)
    .filter((block): block is Extract<(typeof CSS_CONTENT.chapters)[number]["sections"][number]["blocks"][number], { kind: "code" }> => block.kind === "code");
  expect(snippets).toHaveLength(96);
  const result = spawnSync("node", ["scripts/check-css-snippets.cjs"], {
    cwd: process.cwd(), input: JSON.stringify({ snippets: snippets.map((item) => item.code) }), encoding: "utf8", timeout: 120_000,
  });
  expect(result.status, result.error?.message || result.stderr || result.stdout).toBe(0);
});

describe("CSS — apostila completa", () => {
  it("materializa 12 capítulos e passa o contrato integral", () => {
    const { index, lib } = applyContentSource(freshIndex(), CSS_CONTENT);
    expect(lib.chapters).toHaveLength(12);
    expect(lib.sections).toHaveLength(48);
    expect(lib.exercises).toHaveLength(36);
    expect(index.cards).toHaveLength(48);
    const thinSections = lib.sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter((section) => section.words < 600);
    expect(thinSections, JSON.stringify(thinSections)).toEqual([]);
    for (const chapter of lib.chapters) expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
    expect(checkStackSource(index.sources[0], lib)).toEqual([]);
    expect(checkSource(index.sources[0], lib, index)).toEqual([]);
    expect(lib.sections.some((section) => section.blocks.some((block) => block.kind === "labref" && block.labId === "dedalo" && block.layerId === "css-cascade-layout-debug"))).toBe(true);
  });
});
