// ── Source ──────────────────────────────────────────────────────────
export interface StudySource {
  id: string;
  kind: "repo" | "stack";
  name: string;
  repoUrl?: string;
  language?: string;
  addedAt: string;
  ingestedAt?: string;
  version: number;
}

// ── Map node ────────────────────────────────────────────────────────
export type NodeKind = "concept" | "module" | "function";
export type Mastery = 0 | 1 | 2 | 3 | 4;

export interface MapNode {
  id: string;
  sourceId: string;
  title: string;
  kind: NodeKind;
  parentId?: string;
  requires: string[];
  mastery: Mastery;
  lastReviewedAt?: string;
}

// ── Apostila ────────────────────────────────────────────────────────
export interface Citation {
  file: string;
  symbol: string;
}

export interface ApostilaSection {
  id: string;
  sourceId: string;
  nodeId: string;
  title: string;
  bodyMd: string;
  citations: Citation[];
  order: number;
}

// ── Exercise ────────────────────────────────────────────────────────
export type ExerciseType = 1 | 2 | 3 | 4 | 5 | 6;
export type ExerciseLevel = "beginner" | "intermediate" | "advanced";

export interface Exercise {
  id: string;
  sourceId: string;
  nodeId: string;
  type: ExerciseType;
  level: ExerciseLevel;
  promptMd: string;
  choices?: string[];
  answerKeyMd: string;
  rubricMd?: string;
  points: number;
}

// ── SRS Card (SM-2) ────────────────────────────────────────────────
export interface Card {
  id: string;
  sourceId: string;
  nodeId: string;
  frontMd: string;
  backMd: string;
  ease: number;
  intervalDays: number;
  dueDate: string;
  lapses: number;
  reps: number;
}

// ── Attempt ─────────────────────────────────────────────────────────
export interface Attempt {
  id: string;
  exerciseId: string;
  at: string;
  answer: string;
  scoreAwarded: number;
  feedbackMd?: string;
}

// ── Session ─────────────────────────────────────────────────────────
export type SessionBlockKind = "review" | "read" | "exercise";

export interface SessionBlock {
  kind: SessionBlockKind;
  refId: string;
  estMin: number;
  done: boolean;
}

export interface StudySession {
  id: string;
  date: string;
  budgetMin: number;
  blocks: SessionBlock[];
  startedAt?: string;
  completedAt?: string;
}

// ── Scoring ─────────────────────────────────────────────────────────
export interface ScoreState {
  total: number;
  streak: number;
  lastStudyDate: string | null;
}

// ── Documents ───────────────────────────────────────────────────────
export interface ChironIndex {
  version: number;
  sources: StudySource[];
  nodes: MapNode[];
  cards: Card[];
  attempts: Attempt[];
  sessions: StudySession[];
  score: ScoreState;
}

export interface ChironLib {
  version: number;
  sourceId: string;
  sections: ApostilaSection[];
  exercises: Exercise[];
}

// ── Constants ───────────────────────────────────────────────────────
export const MASTERY_LABELS: Record<Mastery, string> = {
  0: "Unseen",
  1: "Learning",
  2: "Review",
  3: "Mastered",
  4: "Deep",
};

export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  1: "Read & predict",
  2: "Why this design",
  3: "Spot the risk",
  4: "Refactor critique",
  5: "Trace the flow",
  6: "Flash recall",
};

export const EXERCISE_LEVEL_LABELS: Record<ExerciseLevel, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

export const SESSION_BUDGETS = [25, 60, 90] as const;

export function makeId(): string {
  return crypto.randomUUID();
}

export function today(): string {
  return new Date().toISOString().split("T")[0];
}
