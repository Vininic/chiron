import { describe, it, expect } from "vitest";
import { applyContentSource } from "./materialize";
import { PYTHON_CONTENT } from "./python";
import { freshIndex } from "@/lib/study/migrate";
import { checkChapter, checkStackSource } from "@/lib/content/contract";
import { proseWordCount } from "@/lib/content/blocks";

describe("Python chapters — real content vs. the real contract", () => {
  it("materializes into real domain documents", () => {
    const { index, lib } = applyContentSource(freshIndex(), PYTHON_CONTENT);
    expect(index.sources).toHaveLength(1);
    expect(index.sources[0].name).toBe("Python");
    expect(lib.chapters).toHaveLength(13);
    expect(lib.sections).toHaveLength(52);
    expect(lib.exercises).toHaveLength(39);
    expect(index.cards).toHaveLength(52);
  });

  it("every section clears 600 prose words on its own (not padded by code)", () => {
    const { lib } = applyContentSource(freshIndex(), PYTHON_CONTENT);
    for (const section of lib.sections) {
      expect(proseWordCount(section.blocks), section.title).toBeGreaterThanOrEqual(600);
    }
  });

  it("every chapter passes checkChapter with zero violations — this is the real bar, not a fixture", () => {
    const { index, lib } = applyContentSource(freshIndex(), PYTHON_CONTENT);
    for (const chapter of lib.chapters) {
      const violations = checkChapter(chapter, lib, index);
      expect(violations, chapter.title).toEqual([]);
    }
  });

  it("checkStackSource now reports the Python stack as complete — the real bar this whole effort aimed at", () => {
    const { index, lib } = applyContentSource(freshIndex(), PYTHON_CONTENT);
    const violations = checkStackSource(index.sources[0], lib);
    // 13 chapters clears MIN_CHAPTERS_PER_STACK (12); basico/intermediario/avancado
    // are all represented (chapter 11 was the first "avancado"); chapter 13's
    // final section carries a real "labref" block pointing at the Ágora lab's
    // concurrency layer, satisfying stack.integratorChapter. This is the honest
    // mechanical confirmation of the quality bar from PLANO.md's original
    // review: "alguém consegue aprender Python do básico ao avançado só com
    // nosso sistema?" — for the Python stack specifically, checkStackSource now
    // says yes. It does NOT mean F2 is done: ~39 other stacks and all repo
    // apostilas (§3.4-B) are still untouched.
    expect(violations).toEqual([]);
  });
});
