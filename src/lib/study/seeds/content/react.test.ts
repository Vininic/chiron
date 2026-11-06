import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { checkChapter, checkSource, checkStackSource } from "@/lib/content/contract";
import { proseWordCount } from "@/lib/content/blocks";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { REACT_CONTENT } from "./react";
import { REACT_RENDERING_CHAPTER } from "./reactRenderingChapter";
import { REACT_STATE_CHAPTER } from "./reactStateChapter";
import { REACT_FORMS_CHAPTER } from "./reactFormsChapter";
import { REACT_EFFECTS_CHAPTER } from "./reactEffectsChapter";
import { REACT_REDUCERS_CHAPTER } from "./reactReducersChapter";
import { REACT_CONTEXT_CHAPTER } from "./reactContextChapter";
import { REACT_HOOKS_CHAPTER } from "./reactHooksChapter";
import { REACT_CONCURRENCY_CHAPTER } from "./reactConcurrencyChapter";
import { REACT_PERFORMANCE_CHAPTER } from "./reactPerformanceChapter";
import { REACT_ACCESSIBILITY_CHAPTER } from "./reactAccessibilityChapter";
import { REACT_TESTING_CHAPTER } from "./reactTestingChapter";
import { REACT_PROJECT_CHAPTER } from "./reactProjectChapter";

function expectReactSnippetsToCompile(chapters: readonly { sections: readonly { blocks: readonly unknown[] }[] }[], prefix: string): void {
  const snippets = chapters
    .flatMap((chapter) => chapter.sections)
    .flatMap((section) => section.blocks)
    .filter((block): block is { kind: "code"; code: string } => typeof block === "object" && block !== null && "kind" in block && block.kind === "code");
  const result = spawnSync(process.execPath, ["scripts/check-react-snippets.cjs"], {
    cwd: process.cwd(),
    input: JSON.stringify({ prefix, snippets: snippets.map((snippet) => snippet.code) }),
    encoding: "utf8",
    timeout: 120_000,
  });
  expect(result.status, result.error?.message || result.stderr || result.stdout).toBe(0);
}

describe("React — renderização declarativa e identidade reescrito", () => {
  it("possui quatro seções autorais densas", () => {
    expect(REACT_RENDERING_CHAPTER.sections).toHaveLength(4);
    expect(REACT_RENDERING_CHAPTER.sections
      .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
      .filter((section) => section.words < 600)).toEqual([]);
  });
});

describe("React — props, estado e eventos reescrito", () => {
  it("possui quatro seções autorais densas", () => {
    expect(REACT_STATE_CHAPTER.sections).toHaveLength(4);
    expect(REACT_STATE_CHAPTER.sections
      .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
      .filter((section) => section.words < 600)).toEqual([]);
  });
});

describe("React — exemplos dos capítulos reescritos", () => {
  it("compila os exemplos TSX isoladamente sob strict", () => {
    expectReactSnippetsToCompile([REACT_RENDERING_CHAPTER, REACT_STATE_CHAPTER, REACT_FORMS_CHAPTER, REACT_EFFECTS_CHAPTER, REACT_REDUCERS_CHAPTER, REACT_CONTEXT_CHAPTER, REACT_HOOKS_CHAPTER, REACT_CONCURRENCY_CHAPTER, REACT_PERFORMANCE_CHAPTER, REACT_ACCESSIBILITY_CHAPTER, REACT_TESTING_CHAPTER, REACT_PROJECT_CHAPTER], "react-curated");
  }, 120_000);
});

describe("React — concorrência, Suspense e carregamento reescrito", () => {
  it("possui quatro seções autorais densas", () => {
    expect(REACT_CONCURRENCY_CHAPTER.sections).toHaveLength(4);
    expect(REACT_CONCURRENCY_CHAPTER.sections
      .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
      .filter((section) => section.words < 600)).toEqual([]);
  });
});

describe("React — performance de render e memória reescrito", () => {
  it("possui quatro seções autorais densas", () => {
    expect(REACT_PERFORMANCE_CHAPTER.sections).toHaveLength(4);
    expect(REACT_PERFORMANCE_CHAPTER.sections
      .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
      .filter((section) => section.words < 600)).toEqual([]);
  });
});

describe("React — acessibilidade e design de interação reescrito", () => {
  it("possui quatro seções autorais densas", () => {
    expect(REACT_ACCESSIBILITY_CHAPTER.sections).toHaveLength(4);
    expect(REACT_ACCESSIBILITY_CHAPTER.sections
      .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
      .filter((section) => section.words < 600)).toEqual([]);
  });
});

describe("React — testes e arquitetura de aplicações reescrito", () => {
  it("possui quatro seções autorais densas", () => {
    expect(REACT_TESTING_CHAPTER.sections).toHaveLength(4);
    expect(REACT_TESTING_CHAPTER.sections
      .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
      .filter((section) => section.words < 600)).toEqual([]);
  });
});

describe("React — projeto integrador reescrito", () => {
  it("possui quatro seções autorais densas e referência ao laboratório", () => {
    expect(REACT_PROJECT_CHAPTER.sections).toHaveLength(4);
    expect(REACT_PROJECT_CHAPTER.sections
      .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
      .filter((section) => section.words < 600)).toEqual([]);
    expect(REACT_PROJECT_CHAPTER.sections.at(-1)?.blocks).toContainEqual({ kind: "labref", labId: "ophis", layerId: "invariants" });
  });
});

describe("React — hooks reutilizáveis e APIs reescrito", () => {
  it("possui quatro seções autorais densas", () => {
    expect(REACT_HOOKS_CHAPTER.sections).toHaveLength(4);
    expect(REACT_HOOKS_CHAPTER.sections
      .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
      .filter((section) => section.words < 600)).toEqual([]);
  });
});

describe("React — contexto e fronteiras de estado reescrito", () => {
  it("possui quatro seções autorais densas", () => {
    expect(REACT_CONTEXT_CHAPTER.sections).toHaveLength(4);
    expect(REACT_CONTEXT_CHAPTER.sections
      .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
      .filter((section) => section.words < 600)).toEqual([]);
  });
});

describe("React — reducers e estado complexo reescrito", () => {
  it("possui quatro seções autorais densas", () => {
    expect(REACT_REDUCERS_CHAPTER.sections).toHaveLength(4);
    expect(REACT_REDUCERS_CHAPTER.sections
      .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
      .filter((section) => section.words < 600)).toEqual([]);
  });
});

describe("React — effects e sincronização externa reescrito", () => {
  it("possui quatro seções autorais densas", () => {
    expect(REACT_EFFECTS_CHAPTER.sections).toHaveLength(4);
    expect(REACT_EFFECTS_CHAPTER.sections
      .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
      .filter((section) => section.words < 600)).toEqual([]);
  });
});

describe("React — listas, formulários e composição reescrito", () => {
  it("possui quatro seções autorais densas", () => {
    expect(REACT_FORMS_CHAPTER.sections).toHaveLength(4);
    expect(REACT_FORMS_CHAPTER.sections
      .map((section) => ({ title: section.title, words: proseWordCount(section.blocks) }))
      .filter((section) => section.words < 600)).toEqual([]);
  });
});

describe("React — apostila completa", () => {
  it("materializa 12 capítulos e passa o contrato integral", () => {
    const { index, lib } = applyContentSource(freshIndex(), REACT_CONTENT);
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
