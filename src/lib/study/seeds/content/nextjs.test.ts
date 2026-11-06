import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { checkChapter, checkSource, checkStackSource } from "@/lib/content/contract";
import { proseWordCount } from "@/lib/content/blocks";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { NEXTJS_CONTENT } from "./nextjs";
import { NEXTJS_ROUTING_CHAPTER } from "./nextjsRoutingChapter";
import { NEXTJS_COMPONENTS_CHAPTER } from "./nextjsComponentsChapter";
import { NEXTJS_CACHE_CHAPTER } from "./nextjsCacheChapter";
import { NEXTJS_ACTIONS_CHAPTER } from "./nextjsActionsChapter";
import { NEXTJS_STREAMING_CHAPTER } from "./nextjsStreamingChapter";
import { NEXTJS_ERRORS_CHAPTER } from "./nextjsErrorsChapter";
import { NEXTJS_AUTH_CHAPTER } from "./nextjsAuthChapter";
import { NEXTJS_HANDLERS_CHAPTER } from "./nextjsHandlersChapter";
import { NEXTJS_METADATA_CHAPTER } from "./nextjsMetadataChapter";
import { NEXTJS_PERFORMANCE_CHAPTER } from "./nextjsPerformanceChapter";
import { NEXTJS_TESTING_CHAPTER } from "./nextjsTestingChapter";
import { NEXTJS_PROJECT_CHAPTER } from "./nextjsProjectChapter";

const CURATED_NEXTJS_CHAPTERS = [
  NEXTJS_ROUTING_CHAPTER,
  NEXTJS_COMPONENTS_CHAPTER,
  NEXTJS_CACHE_CHAPTER,
  NEXTJS_ACTIONS_CHAPTER,
  NEXTJS_STREAMING_CHAPTER,
  NEXTJS_ERRORS_CHAPTER,
  NEXTJS_AUTH_CHAPTER,
  NEXTJS_HANDLERS_CHAPTER,
  NEXTJS_METADATA_CHAPTER,
  NEXTJS_PERFORMANCE_CHAPTER,
  NEXTJS_TESTING_CHAPTER,
  NEXTJS_PROJECT_CHAPTER,
] as const;

function expectNextSnippetsToCompile(chapters: readonly { sections: readonly { blocks: readonly unknown[] }[] }[]): void {
  const snippets = chapters.flatMap((chapter) => chapter.sections).flatMap((section) => section.blocks)
    .filter((block): block is { kind: "code"; code: string } => typeof block === "object" && block !== null && "kind" in block && block.kind === "code");
  const result = spawnSync(process.execPath, ["scripts/check-nextjs-snippets.cjs"], {
    cwd: process.cwd(), input: JSON.stringify({ prefix: "nextjs-curated", snippets: snippets.map((item) => item.code) }), encoding: "utf8", timeout: 120_000,
  });
  expect(result.status, result.error?.message || result.stderr || result.stdout).toBe(0);
}

describe.each([
  ["rotas", NEXTJS_ROUTING_CHAPTER],
  ["componentes", NEXTJS_COMPONENTS_CHAPTER],
  ["cache", NEXTJS_CACHE_CHAPTER],
  ["actions", NEXTJS_ACTIONS_CHAPTER],
  ["streaming", NEXTJS_STREAMING_CHAPTER],
  ["erros", NEXTJS_ERRORS_CHAPTER],
  ["auth", NEXTJS_AUTH_CHAPTER],
  ["handlers", NEXTJS_HANDLERS_CHAPTER],
  ["metadata", NEXTJS_METADATA_CHAPTER],
  ["performance", NEXTJS_PERFORMANCE_CHAPTER],
  ["testes", NEXTJS_TESTING_CHAPTER],
  ["projeto", NEXTJS_PROJECT_CHAPTER],
])("Next.js — capítulo reescrito: %s", (_name, chapter) => {
  it("possui quatro seções autorais densas", () => {
    expect(chapter.sections).toHaveLength(4);
    expect(chapter.sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter((section) => section.words < 600)).toEqual([]);
  });
});

it("Next.js — exemplos reescritos compilam isoladamente sob strict", () => {
  expectNextSnippetsToCompile(CURATED_NEXTJS_CHAPTERS);
}, 120_000);

describe("Next.js — apostila completa", () => {
  it("materializa 12 capítulos e passa o contrato integral", () => {
    const { index, lib } = applyContentSource(freshIndex(), NEXTJS_CONTENT);
    expect(lib.chapters).toHaveLength(12);
    expect(lib.sections).toHaveLength(48);
    expect(lib.exercises).toHaveLength(36);
    expect(index.cards).toHaveLength(48);
    for (const section of lib.sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    for (const chapter of lib.chapters) expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
    expect(checkStackSource(index.sources[0], lib)).toEqual([]);
    expect(checkSource(index.sources[0], lib, index)).toEqual([]);
  });
});
