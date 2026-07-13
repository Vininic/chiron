import { describe, it, expect } from "vitest";
import { computeSM2, isCardDue, cardsDue, gradeLabel } from "./srs";

describe("SM-2 algorithm", () => {
  it("resets interval on grade < 3", () => {
    const result = computeSM2(2.5, 10, 5, 0, 0, "2026-07-12");
    expect(result.intervalDays).toBe(1);
    expect(result.lapses).toBe(1);
    expect(result.reps).toBe(0);
  });

  it("sets interval to 1 on first correct", () => {
    const result = computeSM2(2.5, 0, 0, 0, 4, "2026-07-12");
    expect(result.intervalDays).toBe(1);
    expect(result.reps).toBe(1);
  });

  it("sets interval to 6 on second correct", () => {
    const r1 = computeSM2(2.5, 1, 1, 0, 4, "2026-07-13");
    expect(r1.intervalDays).toBe(6);
    expect(r1.reps).toBe(2);
  });

  it("multiplies by ease on subsequent corrects", () => {
    const result = computeSM2(2.5, 6, 2, 0, 4, "2026-07-19");
    expect(result.intervalDays).toBe(15);
    expect(result.reps).toBe(3);
  });

  it("never drops ease below 1.3", () => {
    const result = computeSM2(1.2, 1, 1, 0, 0, "2026-07-12");
    expect(result.ease).toBeGreaterThanOrEqual(1.3);
  });

  it("increases ease on perfect grade", () => {
    const result = computeSM2(2.5, 1, 1, 0, 5, "2026-07-12");
    expect(result.ease).toBeGreaterThan(2.5);
  });

  it("decreases ease on poor correct", () => {
    const result = computeSM2(2.5, 1, 1, 0, 3, "2026-07-12");
    expect(result.ease).toBeLessThan(2.5);
  });

  it("increments lapses on each failure", () => {
    const r1 = computeSM2(2.5, 10, 5, 2, 1, "2026-07-12");
    expect(r1.lapses).toBe(3);
    const r2 = computeSM2(2.5, 10, 5, 3, 2, "2026-07-12");
    expect(r2.lapses).toBe(4);
  });

  it("sets dueDate correctly", () => {
    const result = computeSM2(2.5, 0, 0, 0, 5, "2026-07-12");
    expect(result.dueDate).toBe("2026-07-13");
  });

  it("detects due cards correctly", () => {
    expect(isCardDue({ dueDate: "2026-07-10" }, "2026-07-12")).toBe(true);
    expect(isCardDue({ dueDate: "2026-07-12" }, "2026-07-12")).toBe(true);
    expect(isCardDue({ dueDate: "2026-07-13" }, "2026-07-12")).toBe(false);
  });

  it("counts due cards", () => {
    const cards = [
      { dueDate: "2026-07-10" },
      { dueDate: "2026-07-12" },
      { dueDate: "2026-07-15" },
    ];
    expect(cardsDue(cards, "2026-07-12")).toBe(2);
  });

  it("provides readable grade labels", () => {
    expect(gradeLabel(0)).toContain("blackout");
    expect(gradeLabel(5)).toContain("Perfect");
  });
});
