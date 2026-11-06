import { describe, expect, it } from "vitest";
import ts from "typescript";
import { freshIndex } from "@/lib/study/migrate";
import { checkChapter, checkSource, checkStackSource } from "@/lib/content/contract";
import { proseWordCount } from "@/lib/content/blocks";
import { applyContentSource } from "./materialize";
import { JAVASCRIPT_CHAPTER_1_NODE_TITLE, JAVASCRIPT_CHAPTER_2_NODE_TITLE, JAVASCRIPT_CHAPTER_3_NODE_TITLE, JAVASCRIPT_CHAPTER_4_NODE_TITLE, JAVASCRIPT_CONTENT } from "./javascript";
import { JAVASCRIPT_ERRORS_CHAPTER } from "./javascriptErrorsChapter";
import { JAVASCRIPT_EVENT_LOOP_CHAPTER } from "./javascriptEventLoopChapter";
import { JAVASCRIPT_DOM_CHAPTER } from "./javascriptDomChapter";
import { JAVASCRIPT_DOMAIN_CHAPTER } from "./javascriptDomainChapter";
import { JAVASCRIPT_ITERATION_CHAPTER } from "./javascriptIterationChapter";
import { JAVASCRIPT_PERFORMANCE_CHAPTER } from "./javascriptPerformanceChapter";
import { JAVASCRIPT_TESTING_CHAPTER } from "./javascriptTestingChapter";
import { JAVASCRIPT_PROJECT_CHAPTER } from "./javascriptProjectChapter";

describe("JavaScript — capítulo 1 curado", () => {
  it("passa a mesma barra editorial mensurável por seção e capítulo da referência Python", () => {
    const { index, lib } = applyContentSource(freshIndex(), JAVASCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === JAVASCRIPT_CHAPTER_1_NODE_TITLE)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
  });
});

describe("JavaScript — capítulo 4 curado", () => {
  it("passa a mesma barra editorial mensurável por seção e capítulo da referência Python", () => {
    const { index, lib } = applyContentSource(freshIndex(), JAVASCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === JAVASCRIPT_CHAPTER_4_NODE_TITLE)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
  });
});

describe("JavaScript — capítulo 3 curado", () => {
  it("passa a mesma barra editorial mensurável por seção e capítulo da referência Python", () => {
    const { index, lib } = applyContentSource(freshIndex(), JAVASCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === JAVASCRIPT_CHAPTER_3_NODE_TITLE)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
  });
});

describe("JavaScript — capítulo 2 curado", () => {
  it("passa a mesma barra editorial mensurável por seção e capítulo da referência Python", () => {
    const { index, lib } = applyContentSource(freshIndex(), JAVASCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === JAVASCRIPT_CHAPTER_2_NODE_TITLE)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
  });
});

describe("JavaScript — capítulo 5 reescrito", () => {
  it("tem prosa própria suficiente e avaliações específicas", () => {
    const { index, lib } = applyContentSource(freshIndex(), JAVASCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === JAVASCRIPT_ERRORS_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);

    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
  });

  it("mantém todos os oito exemplos sintaticamente válidos", () => {
    const snippets = JAVASCRIPT_ERRORS_CHAPTER.sections.flatMap((section) => section.blocks)
      .filter((block): block is Extract<(typeof JAVASCRIPT_ERRORS_CHAPTER.sections)[number]["blocks"][number], { kind: "code" }> => block.kind === "code");
    expect(snippets).toHaveLength(8);
    for (const [index, snippet] of snippets.entries()) {
      const result = ts.transpileModule(snippet.code, {
        fileName: `javascript-errors-${index + 1}.js`,
        reportDiagnostics: true,
        compilerOptions: { allowJs: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
      });
      const syntaxErrors = (result.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
      expect(syntaxErrors, `snippet ${index + 1}: ${syntaxErrors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, " ")).join("; ")}`).toEqual([]);
    }
  });
});

describe("JavaScript — capítulo 6 reescrito", () => {
  it("tem quatro seções densas e avaliações situacionais", () => {
    const { index, lib } = applyContentSource(freshIndex(), JAVASCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === JAVASCRIPT_EVENT_LOOP_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
  });

  it("mantém seus oito exemplos sintaticamente válidos", () => {
    const snippets = JAVASCRIPT_EVENT_LOOP_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    for (const [index, snippet] of snippets.entries()) {
      const result = ts.transpileModule(snippet.code, { fileName: `javascript-event-loop-${index + 1}.js`, reportDiagnostics: true, compilerOptions: { allowJs: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
      const errors = (result.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
      expect(errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, " "))).toEqual([]);
    }
  });
});

describe("JavaScript — capítulo 7 reescrito", () => {
  it("tem quatro seções densas e avaliações específicas de DOM", () => {
    const { index, lib } = applyContentSource(freshIndex(), JAVASCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === JAVASCRIPT_DOM_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
  });

  it("mantém seus oito exemplos sintaticamente válidos", () => {
    const snippets = JAVASCRIPT_DOM_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    for (const [index, snippet] of snippets.entries()) {
      const result = ts.transpileModule(snippet.code, { fileName: `javascript-dom-${index + 1}.js`, reportDiagnostics: true, compilerOptions: { allowJs: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
      const errors = (result.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
      expect(errors, errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, " ")).join("; ")).toEqual([]);
    }
  });
});

describe("JavaScript — capítulo 8 reescrito", () => {
  it("tem quatro seções densas e avaliações de modelagem", () => {
    const { index, lib } = applyContentSource(freshIndex(), JAVASCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === JAVASCRIPT_DOMAIN_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
  });

  it("mantém seus oito exemplos sintaticamente válidos", () => {
    const snippets = JAVASCRIPT_DOMAIN_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    for (const [index, snippet] of snippets.entries()) {
      const result = ts.transpileModule(snippet.code, { fileName: `javascript-domain-${index + 1}.js`, reportDiagnostics: true, compilerOptions: { allowJs: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
      const errors = (result.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
      expect(errors, errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, " ")).join("; ")).toEqual([]);
    }
  });
});

describe("JavaScript — capítulo 9 reescrito", () => {
  it("tem quatro seções densas e avaliações sobre demanda e pressão", () => {
    const { index, lib } = applyContentSource(freshIndex(), JAVASCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === JAVASCRIPT_ITERATION_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
  });

  it("mantém seus oito exemplos sintaticamente válidos", () => {
    const snippets = JAVASCRIPT_ITERATION_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    for (const [index, snippet] of snippets.entries()) {
      const source = ts.createSourceFile(`javascript-iteration-${index + 1}.js`, snippet.code, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
      const errors = (source as ts.SourceFile & { parseDiagnostics: readonly ts.Diagnostic[] }).parseDiagnostics.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
      expect(errors, errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, " ")).join("; ")).toEqual([]);
    }
  });
});

describe("JavaScript — capítulo 10 reescrito", () => {
  it("tem quatro seções densas e avaliações baseadas em medição", () => {
    const { index, lib } = applyContentSource(freshIndex(), JAVASCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === JAVASCRIPT_PERFORMANCE_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
  });

  it("mantém seus oito exemplos sintaticamente válidos", () => {
    const snippets = JAVASCRIPT_PERFORMANCE_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    for (const [index, snippet] of snippets.entries()) {
      const source = ts.createSourceFile(`javascript-performance-${index + 1}.js`, snippet.code, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
      const errors = (source as ts.SourceFile & { parseDiagnostics: readonly ts.Diagnostic[] }).parseDiagnostics.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
      expect(errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, " "))).toEqual([]);
    }
  });
});

describe("JavaScript — capítulo 11 reescrito", () => {
  it("tem seções densas e avaliações determinísticas", () => {
    const { index, lib } = applyContentSource(freshIndex(), JAVASCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === JAVASCRIPT_TESTING_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
  });

  it("mantém seus oito exemplos sintaticamente válidos", () => {
    const snippets = JAVASCRIPT_TESTING_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    for (const [index, snippet] of snippets.entries()) {
      const source = ts.createSourceFile(`javascript-testing-${index + 1}.js`, snippet.code, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
      const errors = (source as ts.SourceFile & { parseDiagnostics: readonly ts.Diagnostic[] }).parseDiagnostics.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
      expect(errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, " "))).toEqual([]);
    }
  });
});

describe("JavaScript — capítulo 12 reescrito", () => {
  it("fecha o projeto com seções densas, laboratório e avaliações situacionais", () => {
    const { index, lib } = applyContentSource(freshIndex(), JAVASCRIPT_CONTENT);
    const chapter = lib.chapters.find((candidate) => candidate.title === JAVASCRIPT_PROJECT_CHAPTER.title)!;
    const sections = lib.sections.filter((section) => section.chapterId === chapter.id);
    expect(sections).toHaveLength(4);
    for (const section of sections) expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    expect(checkChapter(chapter, lib, index)).toEqual([]);
    expect(JAVASCRIPT_PROJECT_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "labref")).toHaveLength(1);
    const exercises = lib.exercises.filter((exercise) => exercise.nodeId === sections[0].nodeId);
    expect(exercises).toHaveLength(3);
    expect(exercises.every((exercise) => exercise.promptMd.trim().split(/\s+/).length >= 30)).toBe(true);
  });

  it("mantém seus oito exemplos sintaticamente válidos", () => {
    const snippets = JAVASCRIPT_PROJECT_CHAPTER.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "code");
    expect(snippets).toHaveLength(8);
    for (const [index, snippet] of snippets.entries()) {
      const source = ts.createSourceFile(`javascript-project-${index + 1}.js`, snippet.code, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
      const errors = (source as ts.SourceFile & { parseDiagnostics: readonly ts.Diagnostic[] }).parseDiagnostics.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
      expect(errors, errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, " ")).join("; ")).toEqual([]);
    }
  });
});

describe("JavaScript — livro completo", () => {
  it("passa o contrato de stack depois dos doze capítulos", () => {
    const { index, lib } = applyContentSource(freshIndex(), JAVASCRIPT_CONTENT);
    expect(lib.chapters).toHaveLength(12);
    for (const chapter of lib.chapters) {
      expect(checkChapter(chapter, lib, index), chapter.title).toEqual([]);
    }
    expect(checkStackSource(index.sources[0], lib)).toEqual([]);
    expect(checkSource(index.sources[0], lib, index)).toEqual([]);
  });
});
