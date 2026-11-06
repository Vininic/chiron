import { describe, expect, it } from "vitest";
import ts from "typescript";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource } from "@/lib/content/contract";
import { editorialMetrics } from "@/lib/content/editorial";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { VUE_AUTHORED_PROSE } from "./vueAuthoredProse";
import { VUE_CONTENT } from "./vue";
import { VUE_EXAMPLES } from "./vueExamples";

it("Vue.js draft — 48 seções autorais com dois exemplos e piso de densidade", () => {
  const sections = VUE_CONTENT.chapters.flatMap((chapter) => chapter.sections);
  const titles = sections.map((section) => section.title);
  expect(VUE_CONTENT.chapters).toHaveLength(12);
  expect(sections).toHaveLength(48);
  expect(new Set(titles).size).toBe(48);
  expect(Object.keys(VUE_AUTHORED_PROSE).sort()).toEqual([...titles].sort());
  expect(Object.keys(VUE_EXAMPLES).sort()).toEqual([...titles].sort());
  expect(sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code")).toHaveLength(96);
  expect(sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter(({ words }) => words < 600)).toEqual([]);
});

describe.each(VUE_CONTENT.chapters.map((chapter) => [chapter.title, chapter] as const))("Vue.js draft — capítulo %s", (_name, chapter) => {
  it("contém quatro seções densas", () => {
    expect(chapter.sections).toHaveLength(4);
    expect(chapter.sections.every((section) => proseWordCount(section.blocks) >= 600)).toBe(true);
  });
});

it("Vue.js draft — exemplos TypeScript e scripts de SFC têm sintaxe válida", () => {
  const diagnostics: string[] = [];
  for (const [title, examples] of Object.entries(VUE_EXAMPLES)) for (const [index, example] of examples.entries()) {
    const source = example.lang === "vue" ? example.code.match(/<script setup[^>]*lang="ts"[^>]*>([\s\S]*?)<\/script>/u)?.[1] : example.code;
    if (!source) { diagnostics.push(`${title}#${index + 1}: script setup TypeScript ausente`); continue; }
    const result = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }, reportDiagnostics: true, fileName: `${title}-${index + 1}.ts` });
    for (const diagnostic of result.diagnostics ?? []) if (diagnostic.category === ts.DiagnosticCategory.Error) diagnostics.push(`${title}#${index + 1}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`);
  }
  expect(diagnostics).toEqual([]);
});

it("Vue.js draft — materializa contratos e métricas sem atestar execução", () => {
  const { index, lib } = applyContentSource(freshIndex(), VUE_CONTENT);
  expect([lib.chapters.length, lib.sections.length, lib.exercises.length, index.cards.length]).toEqual([12, 48, 36, 48]);
  for (const chapter of lib.chapters) expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
  expect(checkSource(index.sources[0], lib, index)).toEqual([]);
  const metrics = editorialMetrics(VUE_CONTENT);
  expect(metrics.maximumSectionSimilarity).toBeLessThan(0.42);
  expect(metrics.maximumCardSimilarity).toBeLessThan(0.78);
  expect(metrics.detailedExerciseRatio).toBeGreaterThanOrEqual(0.65);
  expect(metrics.duplicatedCodeBlocks).toBe(0);
  expect(VUE_CONTENT.editorial).toBeUndefined();
}, 30_000);
