import { describe, expect, it } from "vitest";
import {
  computeSessionStats,
  missedExercises,
  scoreMultipleChoice,
  scoreRubricFraction,
  scoreSelfGrade,
  selectExercises,
  type PracticeResult,
} from "./practice";
import type { Exercise } from "./types";

function makeExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: overrides.id ?? Math.random().toString(36).slice(2),
    sourceId: "src-1",
    nodeId: "node-1",
    type: 1,
    level: "beginner",
    promptMd: "prompt",
    answerKeyMd: "B",
    points: 10,
    ...overrides,
  };
}

describe("selectExercises", () => {
  const exercises = [
    makeExercise({ id: "a", sourceId: "s1", nodeId: "n1", level: "beginner" }),
    makeExercise({ id: "b", sourceId: "s1", nodeId: "n2", level: "advanced" }),
    makeExercise({ id: "c", sourceId: "s2", nodeId: "n1", level: "beginner" }),
  ];

  it("filters by sourceId, nodeId, and level", () => {
    expect(selectExercises(exercises, { sourceId: "s1", count: 10 }).map((e) => e.id).sort()).toEqual(["a", "b"]);
    expect(selectExercises(exercises, { nodeId: "n1", count: 10 }).map((e) => e.id).sort()).toEqual(["a", "c"]);
    expect(selectExercises(exercises, { level: "advanced", count: 10 }).map((e) => e.id)).toEqual(["b"]);
  });

  it("caps at count", () => {
    expect(selectExercises(exercises, { count: 1 })).toHaveLength(1);
  });

  it("never returns more than the filtered pool, even if count is larger", () => {
    expect(selectExercises(exercises, { sourceId: "s2", count: 50 })).toHaveLength(1);
  });
});

describe("scoreMultipleChoice", () => {
  it("awards full points on exact match", () => {
    const ex = makeExercise({ answerKeyMd: "B", points: 10 });
    expect(scoreMultipleChoice(ex, "B")).toBe(10);
  });
  it("awards zero on mismatch", () => {
    const ex = makeExercise({ answerKeyMd: "B", points: 10 });
    expect(scoreMultipleChoice(ex, "A")).toBe(0);
  });
});

describe("scoreSelfGrade", () => {
  const ex = makeExercise({ points: 10 });
  it("correct = full points", () => expect(scoreSelfGrade(ex, "correct")).toBe(10));
  it("partial = half points", () => expect(scoreSelfGrade(ex, "partial")).toBe(5));
  it("incorrect = zero", () => expect(scoreSelfGrade(ex, "incorrect")).toBe(0));
});

describe("scoreRubricFraction", () => {
  const ex = makeExercise({ points: 10 });
  it("scales points by fraction", () => expect(scoreRubricFraction(ex, 0.7)).toBe(7));
  it("clamps above 1", () => expect(scoreRubricFraction(ex, 1.5)).toBe(10));
  it("clamps below 0", () => expect(scoreRubricFraction(ex, -0.5)).toBe(0));
});

describe("computeSessionStats", () => {
  it("computes overall accuracy and per-type accuracy", () => {
    const results: PracticeResult[] = [
      { exercise: makeExercise({ type: 1, nodeId: "n1", points: 10 }), scoreAwarded: 10 },
      { exercise: makeExercise({ type: 1, nodeId: "n1", points: 10 }), scoreAwarded: 0 },
      { exercise: makeExercise({ type: 3, nodeId: "n2", points: 10 }), scoreAwarded: 5 },
    ];
    const stats = computeSessionStats(results);
    expect(stats.totalPoints).toBe(15);
    expect(stats.maxPoints).toBe(30);
    expect(stats.accuracy).toBeCloseTo(0.5);
    expect(stats.accuracyByType[1]).toBeCloseTo(0.5);
    expect(stats.accuracyByType[3]).toBeCloseTo(0.5);
  });

  it("identifies the weakest node by score ratio", () => {
    const results: PracticeResult[] = [
      { exercise: makeExercise({ nodeId: "strong", points: 10 }), scoreAwarded: 10 },
      { exercise: makeExercise({ nodeId: "weak", points: 10 }), scoreAwarded: 0 },
    ];
    expect(computeSessionStats(results).weakestNodeId).toBe("weak");
  });

  it("returns null weakest node and zero accuracy for an empty session", () => {
    const stats = computeSessionStats([]);
    expect(stats.weakestNodeId).toBeNull();
    expect(stats.accuracy).toBe(0);
  });
});

describe("missedExercises", () => {
  it("returns exercises scored below half credit", () => {
    const missed = makeExercise({ id: "missed", points: 10 });
    const passed = makeExercise({ id: "passed", points: 10 });
    const results: PracticeResult[] = [
      { exercise: missed, scoreAwarded: 3 },
      { exercise: passed, scoreAwarded: 8 },
    ];
    expect(missedExercises(results).map((e) => e.id)).toEqual(["missed"]);
  });
});
