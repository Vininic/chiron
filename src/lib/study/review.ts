// The 4-button review UI's mapping onto SM-2's real 0-5 grade scale — kept
// entirely outside srs.ts on purpose (per PLANO.md §8.2: "mapear para o
// motor existente sem tocar em srs.ts"). The 0-5 scale is SM-2's own
// internal vocabulary; Again/Hard/Good/Easy is Anki's now-standard UI
// convention for the same four meaningfully distinct outcomes, so the
// mapping below follows that same convention rather than inventing a new one.
import { computeSM2, type SM2Grade } from "./srs";
import type { Card } from "./types";

export type ReviewButton = "again" | "hard" | "good" | "easy";

export const REVIEW_BUTTONS: ReviewButton[] = ["again", "hard", "good", "easy"];

const BUTTON_GRADE: Record<ReviewButton, SM2Grade> = {
  again: 0, // complete blackout — resets the interval, exactly like a real lapse
  hard: 3,  // correct, but with serious difficulty
  good: 4,  // correct, after some hesitation
  easy: 5,  // perfect, immediate recall
};

export const REVIEW_BUTTON_LABEL: Record<ReviewButton, string> = {
  again: "De novo",
  hard: "Difícil",
  good: "Bom",
  easy: "Fácil",
};

export function gradeForButton(button: ReviewButton): SM2Grade {
  return BUTTON_GRADE[button];
}

/** What grading `button` would do to `card`'s interval, computed with the
 *  same pure `computeSM2` the real grading call uses — never a guess, so
 *  "Bom → 6d" on the button is exactly what pressing it produces. */
export function predictIntervalDays(card: Pick<Card, "ease" | "intervalDays" | "reps" | "lapses">, button: ReviewButton, todayStr?: string): number {
  return computeSM2(card.ease, card.intervalDays, card.reps, card.lapses, gradeForButton(button), todayStr).intervalDays;
}

/** Formats a predicted interval the way the review buttons show it — days
 *  below a week, otherwise a rounded month/year, matching how spaced-
 *  repetition tools conventionally compress long intervals for a button
 *  label (nobody needs to read "127d" precisely on a button). */
export function formatInterval(days: number): string {
  if (days < 1) return "<1d";
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}m`;
  return `${(days / 365).toFixed(1)}a`;
}

/** Fraction of a review session's grades that were SM-2 "passing" (>=3) —
 *  the session summary's retention figure. Grade 0-2 counts as a lapse even
 *  though it's still "graded", matching SM-2's own quality threshold. */
export function computeRetention(grades: SM2Grade[]): number {
  if (grades.length === 0) return 0;
  return grades.filter((g) => g >= 3).length / grades.length;
}
