import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { checkChapter, checkSource, checkStackSource } from "@/lib/content/contract";
import { proseWordCount } from "@/lib/content/blocks";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { HTML_CONTENT } from "./html";
import { HTML_PARSER_CHAPTER } from "./htmlParserChapter";
import { HTML_SEMANTICS_CHAPTER } from "./htmlSemanticsChapter";
import { HTML_LINKS_CHAPTER } from "./htmlLinksChapter";
import { HTML_MEDIA_CHAPTER } from "./htmlMediaChapter";
import { HTML_FORMS_CHAPTER } from "./htmlFormsChapter";
import { HTML_VALIDATION_CHAPTER } from "./htmlValidationChapter";
import { HTML_TABLES_CHAPTER } from "./htmlTablesChapter";
import { HTML_METADATA_CHAPTER } from "./htmlMetadataChapter";
import { HTML_ACCESSIBILITY_CHAPTER } from "./htmlAccessibilityChapter";
import { HTML_SECURITY_CHAPTER } from "./htmlSecurityChapter";
import { HTML_TESTING_CHAPTER } from "./htmlTestingChapter";
import { HTML_PROJECT_CHAPTER } from "./htmlProjectChapter";

const HTML_CHAPTERS = [
  HTML_PARSER_CHAPTER, HTML_SEMANTICS_CHAPTER, HTML_LINKS_CHAPTER, HTML_MEDIA_CHAPTER,
  HTML_FORMS_CHAPTER, HTML_VALIDATION_CHAPTER, HTML_TABLES_CHAPTER, HTML_METADATA_CHAPTER,
  HTML_ACCESSIBILITY_CHAPTER, HTML_SECURITY_CHAPTER, HTML_TESTING_CHAPTER, HTML_PROJECT_CHAPTER,
];

function expectHtmlSnippetsToParse(chapters: readonly { sections: readonly { blocks: readonly unknown[] }[] }[]): void {
  const snippets = chapters.flatMap((chapter) => chapter.sections).flatMap((section) => section.blocks)
    .filter((block): block is { kind: "code"; code: string } => typeof block === "object" && block !== null && "kind" in block && block.kind === "code");
  const result = spawnSync("python", ["scripts/check-html-snippets.py"], {
    cwd: process.cwd(), input: JSON.stringify({ snippets: snippets.map((item) => item.code) }), encoding: "utf8", timeout: 120_000,
  });
  expect(result.status, result.error?.message || result.stderr || result.stdout).toBe(0);
}

describe.each([
  ["parser", HTML_PARSER_CHAPTER],
  ["semântica", HTML_SEMANTICS_CHAPTER],
  ["links", HTML_LINKS_CHAPTER],
  ["mídia", HTML_MEDIA_CHAPTER],
  ["forms", HTML_FORMS_CHAPTER],
  ["validação", HTML_VALIDATION_CHAPTER],
  ["tabelas", HTML_TABLES_CHAPTER],
  ["metadata", HTML_METADATA_CHAPTER],
  ["acessibilidade", HTML_ACCESSIBILITY_CHAPTER],
  ["segurança", HTML_SECURITY_CHAPTER],
  ["testes", HTML_TESTING_CHAPTER],
  ["projeto", HTML_PROJECT_CHAPTER],
])("HTML — capítulo reescrito: %s", (_name, chapter) => {
  it("possui quatro seções autorais densas", () => {
    expect(chapter.sections).toHaveLength(4);
    const thinSections = chapter.sections.map((section) => ({ title: section.title, words: proseWordCount(section.blocks) })).filter((section) => section.words < 600);
    expect(thinSections, JSON.stringify(thinSections)).toEqual([]);
  });
});

it("HTML — exemplos reescritos são parseáveis e preservam relações estruturais", () => {
  expectHtmlSnippetsToParse(HTML_CHAPTERS);
});

describe("HTML — apostila completa", () => {
  it("materializa 12 capítulos e passa o contrato integral", () => {
    const { index, lib } = applyContentSource(freshIndex(), HTML_CONTENT);
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
