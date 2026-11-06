import { beforeAll, describe, it, expect } from "vitest";
import {
  checkSection, checkChapter, checkStackSource, checkRepoSource, checkToolSource, checkSource,
} from "./contract";
import { freshIndex, freshLib } from "@/lib/study/migrate";
import type {
  ApostilaSection, Chapter, ChironIndex, ChironLib, Exercise, Card, StudySource, Block,
} from "@/lib/study/types";

function section(overrides: Partial<ApostilaSection> = {}): ApostilaSection {
  return {
    id: "sec1", sourceId: "src1", chapterId: "ch1", nodeId: "node1",
    title: "Uma seção", blocks: [], order: 1,
    ...overrides,
  };
}

const LONG_PROSE: Block = { kind: "prose", md: Array(600).fill("palavra").join(" ") };
const PASSING_BLOCKS: Block[] = [
  LONG_PROSE,
  { kind: "code", lang: "ts", code: "const a = 1;" },
  { kind: "code", lang: "ts", code: "const b = 2;" },
  { kind: "porque", md: "Porque sim." },
  { kind: "quebraria", md: "Quebra se X." },
];

describe("checkSection", () => {
  it("passes a section meeting every bar", () => {
    expect(checkSection(section({ blocks: PASSING_BLOCKS }))).toHaveLength(0);
  });

  it("flags short prose", () => {
    const violations = checkSection(section({ blocks: [{ kind: "prose", md: "curto" }] }));
    expect(violations.some((v) => v.rule === "section.proseWords")).toBe(true);
  });

  it("flags missing code blocks", () => {
    const violations = checkSection(section({ blocks: [LONG_PROSE] }));
    expect(violations.some((v) => v.rule === "section.codeBlocks")).toBe(true);
  });

  it("flags missing porque block", () => {
    const blocks = PASSING_BLOCKS.filter((b) => b.kind !== "porque");
    const violations = checkSection(section({ blocks }));
    expect(violations.some((v) => v.rule === "section.porque")).toBe(true);
  });

  it("flags missing quebraria block", () => {
    const blocks = PASSING_BLOCKS.filter((b) => b.kind !== "quebraria");
    const violations = checkSection(section({ blocks }));
    expect(violations.some((v) => v.rule === "section.quebraria")).toBe(true);
  });

  it("does not count code content as prose words", () => {
    const blocks: Block[] = [
      { kind: "prose", md: "poucas palavras aqui" },
      { kind: "code", lang: "ts", code: Array(2000).fill("x").join(" ") },
    ];
    const violations = checkSection(section({ blocks }));
    expect(violations.some((v) => v.rule === "section.proseWords")).toBe(true);
  });
});

function chapterFixture(sectionIds: string[], overrides: Partial<Chapter> = {}): Chapter {
  return { id: "ch1", sourceId: "src1", title: "Capítulo 1", level: "basico", order: 1, sectionIds, ...overrides };
}

function libWith(sections: ApostilaSection[], exercises: Exercise[] = [], chapters: Chapter[] = []): ChironLib {
  return { ...freshLib("src1"), sections, exercises, chapters };
}

function indexWith(cards: Card[]): ChironIndex {
  return { ...freshIndex(), cards };
}

function makeCard(nodeId: string, id: string): Card {
  return { id, sourceId: "src1", nodeId, frontMd: "f", backMd: "b", ease: 2.5, intervalDays: 0, dueDate: "2026-01-01", lapses: 0, reps: 0 };
}

function makeExercise(nodeId: string, id: string, type: Exercise["type"]): Exercise {
  return { id, sourceId: "src1", nodeId, type, level: "beginner", promptMd: "p", answerKeyMd: "a", points: 10 };
}

describe("checkChapter", () => {
  const FOUR_SECTIONS = Array.from({ length: 4 }, (_, i) =>
    section({ id: `s${i}`, nodeId: "node1", blocks: PASSING_BLOCKS, order: i + 1 }));

  it("passes a chapter with enough sections, exercises and cards", () => {
    const chapter = chapterFixture(FOUR_SECTIONS.map((s) => s.id));
    const exercises = [makeExercise("node1", "e1", 1), makeExercise("node1", "e2", 2), makeExercise("node1", "e3", 3)];
    const cards = [makeCard("node1", "c1"), makeCard("node1", "c2"), makeCard("node1", "c3"), makeCard("node1", "c4")];
    const lib = libWith(FOUR_SECTIONS, exercises, [chapter]);
    const index = indexWith(cards);
    expect(checkChapter(chapter, lib, index)).toHaveLength(0);
  });

  it("flags too few sections", () => {
    const chapter = chapterFixture(FOUR_SECTIONS.slice(0, 2).map((s) => s.id));
    const lib = libWith(FOUR_SECTIONS.slice(0, 2), [], [chapter]);
    const violations = checkChapter(chapter, lib, indexWith([]));
    expect(violations.some((v) => v.rule === "chapter.sections")).toBe(true);
  });

  it("flags too few exercise types even with enough exercises", () => {
    const chapter = chapterFixture(FOUR_SECTIONS.map((s) => s.id));
    const exercises = [makeExercise("node1", "e1", 1), makeExercise("node1", "e2", 1), makeExercise("node1", "e3", 1)];
    const lib = libWith(FOUR_SECTIONS, exercises, [chapter]);
    const violations = checkChapter(chapter, lib, indexWith([]));
    expect(violations.some((v) => v.rule === "chapter.exerciseTypes")).toBe(true);
  });

  it("flags too few SRS cards", () => {
    const chapter = chapterFixture(FOUR_SECTIONS.map((s) => s.id));
    const exercises = [makeExercise("node1", "e1", 1), makeExercise("node1", "e2", 2), makeExercise("node1", "e3", 3)];
    const lib = libWith(FOUR_SECTIONS, exercises, [chapter]);
    const violations = checkChapter(chapter, lib, indexWith([makeCard("node1", "c1")]));
    expect(violations.some((v) => v.rule === "chapter.cards")).toBe(true);
  });
});

function stackSource(overrides: Partial<StudySource> = {}): StudySource {
  return { id: "src1", kind: "stack", name: "Python", addedAt: "2026-01-01", version: 1, ...overrides };
}

function repoSource(overrides: Partial<StudySource> = {}): StudySource {
  return { id: "src1", kind: "repo", name: "Chronos", addedAt: "2026-01-01", version: 1, ...overrides };
}

function toolSource(overrides: Partial<StudySource> = {}): StudySource {
  return { id: "src1", kind: "tool", name: "Docker", addedAt: "2026-01-01", version: 1, ...overrides };
}

describe("checkStackSource", () => {
  it("passes 12 chapters spanning all levels with an integrator", () => {
    const levels = ["basico", "intermediario", "avancado"] as const;
    const chapters: Chapter[] = Array.from({ length: 12 }, (_, i) => ({
      id: `ch${i}`, sourceId: "src1", title: `Cap ${i}`, level: levels[i % 3], order: i + 1, sectionIds: [`s${i}`],
    }));
    const integratorSection = section({ id: "s0", blocks: [{ kind: "labref", labId: "lab1", layerId: "layer1" }] });
    const sections = [integratorSection, ...chapters.slice(1).map((c) => section({ id: c.sectionIds[0] }))];
    const lib = libWith(sections, [], chapters);
    expect(checkStackSource(stackSource(), lib)).toHaveLength(0);
  });

  it("flags too few chapters", () => {
    const lib = libWith([], [], [chapterFixture(["s0"])]);
    const violations = checkStackSource(stackSource(), lib);
    expect(violations.some((v) => v.rule === "stack.chapterCount")).toBe(true);
  });

  it("flags missing level coverage", () => {
    const chapters: Chapter[] = Array.from({ length: 12 }, (_, i) => ({
      id: `ch${i}`, sourceId: "src1", title: `Cap ${i}`, level: "basico", order: i + 1, sectionIds: [],
    }));
    const violations = checkStackSource(stackSource(), libWith([], [], chapters));
    expect(violations.filter((v) => v.rule === "stack.levelCoverage")).toHaveLength(2); // missing intermediario + avancado
  });

  it("flags a missing integrator chapter", () => {
    const chapters: Chapter[] = Array.from({ length: 12 }, (_, i) => ({
      id: `ch${i}`, sourceId: "src1", title: `Cap ${i}`, level: (["basico", "intermediario", "avancado"] as const)[i % 3], order: i + 1, sectionIds: [],
    }));
    const violations = checkStackSource(stackSource(), libWith([], [], chapters));
    expect(violations.some((v) => v.rule === "stack.integratorChapter")).toBe(true);
  });
});

describe("checkRepoSource", () => {
  it("passes with citations, a diagram and an extend section", () => {
    const sections = [
      section({ id: "s1", blocks: [{ kind: "cite", file: "src/a.ts" }] }),
      section({ id: "s2", blocks: [{ kind: "cite", file: "src/b.ts" }, { kind: "diagram", svg: "<svg/>", caption: "x" }] }),
      section({ id: "s3", title: "Como estender", blocks: [{ kind: "cite", file: "src/c.ts" }] }),
    ];
    expect(checkRepoSource(repoSource(), libWith(sections))).toHaveLength(0);
  });

  it("flags sections with no citations", () => {
    const sections = [section({ id: "s1", blocks: [{ kind: "diagram", svg: "<svg/>", caption: "x" }] })];
    const violations = checkRepoSource(repoSource(), libWith(sections));
    expect(violations.some((v) => v.rule === "repo.citations")).toBe(true);
    expect(violations.some((v) => v.rule === "repo.diagram")).toBe(false);
    expect(violations.some((v) => v.rule === "repo.extendSection")).toBe(true);
  });

  it("flags a repo with zero sections", () => {
    const violations = checkRepoSource(repoSource(), libWith([]));
    expect(violations).toEqual([{ rule: "repo.hasSections", message: expect.any(String) }]);
  });
});

describe("checkToolSource", () => {
  it("passes 8 chapters including a pitfalls chapter", () => {
    const chapters: Chapter[] = Array.from({ length: 7 }, (_, i) => ({
      id: `ch${i}`, sourceId: "src1", title: `Fluxo ${i}`, level: "basico", order: i + 1, sectionIds: [],
    }));
    chapters.push({ id: "ch7", sourceId: "src1", title: "Armadilhas comuns", level: "basico", order: 8, sectionIds: [] });
    expect(checkToolSource(toolSource(), libWith([], [], chapters))).toHaveLength(0);
  });

  it("flags too few chapters and a missing pitfalls chapter", () => {
    const violations = checkToolSource(toolSource(), libWith([], [], [chapterFixture([])]));
    expect(violations.some((v) => v.rule === "tool.chapterCount")).toBe(true);
    expect(violations.some((v) => v.rule === "tool.pitfallsChapter")).toBe(true);
  });
});

describe("checkSource dispatch", () => {
  it("routes stack sources to the stack contract", () => {
    const violations = checkSource(stackSource(), libWith([]), indexWith([]));
    expect(violations.some((v) => v.rule.startsWith("stack."))).toBe(true);
    expect(violations.some((v) => v.rule.startsWith("repo."))).toBe(false);
  });

  it("routes tool sources to the tool contract", () => {
    const violations = checkSource(toolSource(), libWith([]), indexWith([]));
    expect(violations.some((v) => v.rule.startsWith("tool."))).toBe(true);
  });

  it("routes repo sources to the repo contract", () => {
    const violations = checkSource(repoSource(), libWith([]), indexWith([]));
    expect(violations.some((v) => v.rule.startsWith("repo."))).toBe(true);
  });
});

// ── Real integration check ─────────────────────────────────────────
// F2's reviewed books are part of runSeed. This protects the actual
// product seed rather than only the isolated authoring fixture.
describe("seeded content vs. the real contract", () => {
  let seeded: Awaited<ReturnType<(typeof import("@/lib/study/seeds"))["runSeed"]>>;

  beforeAll(async () => {
    const { runSeed } = await import("@/lib/study/seeds");
    seeded = runSeed();
  }, 30_000);

  it.each(["Python", "JavaScript", "TypeScript", "Node.js", "React", "Next.js", "HTML", "CSS", "Tailwind CSS", "Vite", "Vitest", "PostgreSQL", "MySQL", "MariaDB", "Microsoft SQL Server", "Supabase"])("%s's seeded apostila meets the completeness contract", (sourceName) => {
    const { index, libs } = seeded;
    const source = index.sources.find((candidate) => candidate.name === sourceName);
    if (!source) throw new Error(`${sourceName} seed source not found`);
    const violations = checkSource(source, libs[source.id], index);
    expect(violations).toHaveLength(0);
  });
});
