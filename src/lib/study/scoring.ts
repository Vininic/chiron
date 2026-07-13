// Scoring math and streak tracking — pure, tested.

import type { ScoreState, Mastery } from "./types";

export function computePointsForExercise(level: "beginner" | "intermediate" | "advanced", scoreAwarded: number): number {
  const multiplier = level === "beginner" ? 1 : level === "intermediate" ? 2 : 3;
  return scoreAwarded * multiplier;
}

export function computeMasteryWeight(nodes: Array<{ mastery: Mastery }>): number {
  if (nodes.length === 0) return 0;
  const sum = nodes.reduce((acc, n) => acc + n.mastery, 0);
  return sum / (nodes.length * 4);
}

export function updateStreak(score: ScoreState, todayStr?: string): ScoreState {
  const today = todayStr ?? new Date().toISOString().split("T")[0];

  if (score.lastStudyDate === today) return score;

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const newStreak = score.lastStudyDate === yesterdayStr ? score.streak + 1 : 1;

  return { ...score, streak: newStreak, lastStudyDate: today };
}

export function addPoints(score: ScoreState, points: number, todayStr?: string): ScoreState {
  const withStreak = updateStreak(score, todayStr);
  return { ...withStreak, total: withStreak.total + points };
}
