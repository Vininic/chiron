import { describe, it, expect } from "vitest";
import { computePointsForExercise, computeMasteryWeight, updateStreak, addPoints } from "./scoring";
import type { ScoreState, Mastery } from "./types";

describe("scoring", () => {
  it("computes points with level multipliers", () => {
    expect(computePointsForExercise("beginner", 10)).toBe(10);
    expect(computePointsForExercise("intermediate", 10)).toBe(20);
    expect(computePointsForExercise("advanced", 10)).toBe(30);
  });

  it("computes mastery weight as ratio", () => {
    const nodes: Array<{ mastery: Mastery }> = [
      { mastery: 4 }, { mastery: 3 }, { mastery: 2 }, { mastery: 0 },
    ];
    const weight = computeMasteryWeight(nodes);
    expect(weight).toBeCloseTo(9 / 16);
  });

  it("returns 0 for empty nodes", () => {
    expect(computeMasteryWeight([])).toBe(0);
  });

  it("updates streak on consecutive days", () => {
    const score: ScoreState = { total: 100, streak: 5, lastStudyDate: "2026-07-11" };
    const updated = updateStreak(score, "2026-07-12");
    expect(updated.streak).toBe(6);
    expect(updated.lastStudyDate).toBe("2026-07-12");
  });

  it("resets streak when day is skipped", () => {
    const score: ScoreState = { total: 100, streak: 5, lastStudyDate: "2026-07-10" };
    const updated = updateStreak(score, "2026-07-12");
    expect(updated.streak).toBe(1);
  });

  it("maintains streak on same day", () => {
    const score: ScoreState = { total: 100, streak: 5, lastStudyDate: "2026-07-12" };
    const updated = updateStreak(score, "2026-07-12");
    expect(updated.streak).toBe(5);
  });

  it("starts streak at 1 for first study", () => {
    const score: ScoreState = { total: 0, streak: 0, lastStudyDate: null };
    const updated = updateStreak(score, "2026-07-12");
    expect(updated.streak).toBe(1);
  });

  it("addPoints updates total and streak", () => {
    const score: ScoreState = { total: 100, streak: 3, lastStudyDate: "2026-07-11" };
    const updated = addPoints(score, 50, "2026-07-12");
    expect(updated.total).toBe(150);
    expect(updated.streak).toBe(4);
  });
});
