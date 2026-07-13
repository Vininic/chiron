// SM-2 spaced repetition algorithm — pure, heavily tested.
//
// Reference: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
// The algorithm computes the next interval and ease factor after a review.

export type SM2Grade = 0 | 1 | 2 | 3 | 4 | 5;

export interface SM2Result {
  ease: number;
  intervalDays: number;
  dueDate: string;
  lapses: number;
  reps: number;
}

const GRADES: Record<SM2Grade, { label: string; minQuality: number }> = {
  0: { label: "Complete blackout", minQuality: 0 },
  1: { label: "Incorrect — remembered after seeing answer", minQuality: 1 },
  2: { label: "Incorrect — but the answer seemed easy to recall", minQuality: 2 },
  3: { label: "Correct — with serious difficulty", minQuality: 3 },
  4: { label: "Correct — after hesitation", minQuality: 4 },
  5: { label: "Perfect — immediate recall", minQuality: 5 },
};

export function gradeLabel(grade: SM2Grade): string {
  return GRADES[grade]?.label ?? "Unknown";
}

export function gradeMinQuality(grade: SM2Grade): number {
  return GRADES[grade]?.minQuality ?? 0;
}

export function computeSM2(
  currentEase: number,
  currentInterval: number,
  currentReps: number,
  currentLapses: number,
  grade: SM2Grade,
  todayStr?: string,
): SM2Result {
  const today = todayStr ?? new Date().toISOString().split("T")[0];
  const q = gradeMinQuality(grade);

  let newEase = currentEase;
  let newInterval = currentInterval;
  let newReps = currentReps;
  let newLapses = currentLapses;

  if (q < 3) {
    // Incorrect response — reset interval, increment lapses
    newReps = 0;
    newInterval = 1;
    newLapses += 1;
  } else {
    // Correct response
    if (newReps === 0) {
      newInterval = 1;
    } else if (newReps === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(currentInterval * currentEase);
    }
    newReps += 1;
  }

  // Update ease factor
  newEase = Math.max(1.3, currentEase + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  const due = new Date(today);
  due.setDate(due.getDate() + newInterval);
  const dueDate = due.toISOString().split("T")[0];

  return { ease: Math.round(newEase * 100) / 100, intervalDays: newInterval, dueDate, lapses: newLapses, reps: newReps };
}

export function isCardDue(card: { dueDate: string }, todayStr?: string): boolean {
  const today = todayStr ?? new Date().toISOString().split("T")[0];
  return card.dueDate <= today;
}

export function cardsDue(cards: Array<{ dueDate: string }>, todayStr?: string): number {
  const today = todayStr ?? new Date().toISOString().split("T")[0];
  return cards.filter((c) => c.dueDate <= today).length;
}
