// Pure session-composition and scoring logic for the Practice runner (F7 §8.1).
// Kept out of the React layer so the scoring rules — which differ per
// exercise type, since only type 1 has machine-checkable `choices` — are
// testable without mounting anything.
import type { Exercise, ExerciseType } from "./types";

export interface PracticeSessionOptions {
  sourceId?: string;
  nodeId?: string;
  level?: Exercise["level"];
  count: number;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Picks up to `opts.count` exercises matching the filters, in random order —
 *  a practice session shouldn't always drill the same first N exercises in
 *  seed order. */
export function selectExercises(exercises: Exercise[], opts: PracticeSessionOptions): Exercise[] {
  let pool = exercises;
  if (opts.sourceId) pool = pool.filter((e) => e.sourceId === opts.sourceId);
  if (opts.nodeId) pool = pool.filter((e) => e.nodeId === opts.nodeId);
  if (opts.level) pool = pool.filter((e) => e.level === opts.level);
  return shuffle(pool).slice(0, opts.count);
}

/** Type 1 is the only exercise type with a real, structured correct answer
 *  (`choices` + `answerKeyMd` naming the correct one) — so it's the only
 *  type that can be graded by exact match rather than self- or AI-grading. */
export function scoreMultipleChoice(exercise: Exercise, answer: string): number {
  return answer === exercise.answerKeyMd ? exercise.points : 0;
}

/** Types 3/4/5/6 have only prose `promptMd`/`answerKeyMd` in the real seed
 *  data (confirmed in python.ts — no `choices`, no structured targets), so
 *  the learner reads the real answer key and honestly reports how they did,
 *  same as a physical flashcard's "did I get it right" — not a fabricated
 *  auto-grade pretending to check free text it can't parse. */
export type SelfGrade = "correct" | "partial" | "incorrect";

const SELF_GRADE_FRACTION: Record<SelfGrade, number> = { correct: 1, partial: 0.5, incorrect: 0 };

export function scoreSelfGrade(exercise: Exercise, grade: SelfGrade): number {
  return Math.round(exercise.points * SELF_GRADE_FRACTION[grade]);
}

/** Type 2 ("why this design") is graded by Aetheris against `rubricMd` via
 *  streamChat, which returns a 0-1 fraction of rubric criteria met — this
 *  just converts that fraction into the exercise's point scale, kept here so
 *  the rounding rule lives next to the other scoring functions instead of
 *  duplicated at the AI call site. */
export function scoreRubricFraction(exercise: Exercise, fraction: number): number {
  return Math.round(exercise.points * Math.max(0, Math.min(1, fraction)));
}

export interface PracticeResult {
  exercise: Exercise;
  scoreAwarded: number;
}

export interface SessionStats {
  totalPoints: number;
  maxPoints: number;
  accuracy: number;
  accuracyByType: Partial<Record<ExerciseType, number>>;
  weakestNodeId: string | null;
}

/** Aggregates a finished session's results for the result screen: overall
 *  accuracy, accuracy broken down by exercise type, and the single weakest
 *  node (lowest score ratio) to point the "review this section" CTA at. */
export function computeSessionStats(results: PracticeResult[]): SessionStats {
  const totalPoints = results.reduce((sum, r) => sum + r.scoreAwarded, 0);
  const maxPoints = results.reduce((sum, r) => sum + r.exercise.points, 0);
  const accuracy = maxPoints > 0 ? totalPoints / maxPoints : 0;

  const byType = new Map<ExerciseType, { got: number; max: number }>();
  const byNode = new Map<string, { got: number; max: number }>();
  for (const r of results) {
    const t = byType.get(r.exercise.type) ?? { got: 0, max: 0 };
    t.got += r.scoreAwarded;
    t.max += r.exercise.points;
    byType.set(r.exercise.type, t);

    const n = byNode.get(r.exercise.nodeId) ?? { got: 0, max: 0 };
    n.got += r.scoreAwarded;
    n.max += r.exercise.points;
    byNode.set(r.exercise.nodeId, n);
  }

  const accuracyByType: Partial<Record<ExerciseType, number>> = {};
  for (const [type, { got, max }] of byType) accuracyByType[type] = max > 0 ? got / max : 0;

  let weakestNodeId: string | null = null;
  let weakestRatio = Infinity;
  for (const [nodeId, { got, max }] of byNode) {
    if (max === 0) continue;
    const ratio = got / max;
    if (ratio < weakestRatio) {
      weakestRatio = ratio;
      weakestNodeId = nodeId;
    }
  }

  return { totalPoints, maxPoints, accuracy, accuracyByType, weakestNodeId };
}

/** Exercises scored under half credit — source material for "generate cards
 *  from errors" (turns each into a front/back flashcard via addCard). */
export function missedExercises(results: PracticeResult[]): Exercise[] {
  return results.filter((r) => r.scoreAwarded < r.exercise.points / 2).map((r) => r.exercise);
}
