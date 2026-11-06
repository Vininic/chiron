import { describe, expect, it } from "vitest";
import { assembleSourceDraft, chapterPrompt, curriculumPrompt, parseChapterDraft, parseCurriculumDraft } from "./authoring";
import { CONTENT_BATCHES, batchForSource } from "./rollout";
import { WEB_CORE_BLUEPRINTS } from "./webCore";

describe("content rollout", () => {
  it("groups the initial web batch by a shared learning ladder", () => expect(CONTENT_BATCHES[1].sources).toEqual(["JavaScript", "TypeScript", "Node.js", "React", "Next.js"]));
  it("maps every planned source to one batch", () => expect(batchForSource("Supabase")?.id).toBe("data-platform"));
});
describe("curriculum authoring", () => {
  it("demands measurable sections instead of summaries", () => expect(curriculumPrompt({ name: "React", kind: "stack", chapterCount: 12 })).toContain("600 palavras"));
  it("keeps malformed proposals outside the published path", () => expect(parseCurriculumDraft("{}")).toEqual({ error: "A proposta não tem o formato ContentSource." }));
  it("breaks the five web books into independently checkable chapters", () => {
    expect(WEB_CORE_BLUEPRINTS).toHaveLength(5);
    expect(WEB_CORE_BLUEPRINTS.every((source) => source.chapters.length === 12)).toBe(true);
    expect(chapterPrompt(WEB_CORE_BLUEPRINTS[0], WEB_CORE_BLUEPRINTS[0].chapters[0])).toContain("quatro seções");
  });
  it("rejects an incomplete chapter response before it can join a source", () => expect(parseChapterDraft("{}")).toEqual({ error: "O rascunho do capítulo não tem capítulo, exercícios e cards." }));
  it("keeps an assembled partial book in draft status", () => {
    const draft = assembleSourceDraft("JavaScript", "JavaScript", []);
    expect(draft.status).toBe("draft");
    expect(draft.violations.length).toBeGreaterThan(0);
  });
});
