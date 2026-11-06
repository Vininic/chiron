// ── Source ──────────────────────────────────────────────────────────
// "tool" split out from "stack" 2026-07-29: a language/framework earns a full
// básico→avançado curriculum (the completeness contract in lib/content/
// contract.ts enforces ≥12 chapters spanning all three levels), but nobody
// learns Docker or Figma that way — a tool apostila is workflow-shaped
// instead (≥8 chapters, a pitfalls chapter, ties to a real repo). Same
// `ChironLib`/`Chapter` shape either way; the contract checked differs.
export type SourceKind = "repo" | "stack" | "tool" | "lab";
/** Provenance is deliberately stored with a source: a curated book must not
 * look identical to a learner's AI draft or a repository ingestion. */
export type ContentOrigin = "built_in" | "ai_generated" | "github_ingested" | "legacy_seed";

export interface StudySource {
  id: string;
  kind: SourceKind;
  name: string;
  repoUrl?: string;
  language?: string;
  addedAt: string;
  ingestedAt?: string;
  contentOrigin?: ContentOrigin;
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

// ── Content blocks ──────────────────────────────────────────────────
// Replaces v1's flat `bodyMd: string` (2026-07-29 review — a plain markdown
// string can't carry margin citations, can't be measured against the
// completeness contract in lib/content/contract.ts, and can't distinguish
// "this is the architectural tradeoff" from "this is just another paragraph").
// Every section is a list of these instead.

export interface CodeSide {
  lang: string;
  code: string;
  caption?: string;
}

export interface AlgoStep {
  title: string;
  md: string;
  code?: string;
}

export type Block =
  | { kind: "prose"; md: string }
  | { kind: "code"; lang: string; code: string; caption?: string; highlight?: number[] }
  | { kind: "porque"; md: string }        // architectural criterion / tradeoff — the tutor's core move
  | { kind: "quebraria"; md: string }     // what breaks this in production
  | { kind: "compare"; left: CodeSide; right: CodeSide; verdictMd: string }
  | { kind: "algo"; steps: AlgoStep[] }
  | { kind: "diagram"; svg: string; caption: string }
  | { kind: "cite"; file: string; symbol?: string; lines?: [number, number]; url?: string }
  | { kind: "labref"; labId: string; layerId: string }   // bridge to a lab layer (§9.3)
  | { kind: "exref"; exerciseId: string };

export type BlockKind = Block["kind"];

// ── Chapter ─────────────────────────────────────────────────────────
// Groups sections into the básico → intermediário → avançado ladder a stack
// apostila needs (§3.4-A) and gives a repo apostila's page/system sections a
// home. Introduced in v2 — v1 libraries had no chapter concept at all, so
// migration synthesizes one holding everything (see migrate.ts).
export type ChapterLevel = "basico" | "intermediario" | "avancado";

export interface Chapter {
  id: string;
  sourceId: string;
  title: string;
  level: ChapterLevel;
  order: number;
  sectionIds: string[];
}

// ── Apostila ────────────────────────────────────────────────────────
export interface ApostilaSection {
  id: string;
  sourceId: string;
  chapterId: string;
  nodeId: string;
  title: string;
  blocks: Block[];
  order: number;
  readAt?: string;
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

// ── Review log ──────────────────────────────────────────────────────
// One entry per SM-2 grading — the Card itself only carries cumulative state
// (ease/reps/lapses/dueDate), so without this there is no way to answer
// "how did reviews go this week" after the fact. Added for the dashboard's
// retention chart (F4); grade duplicates SM2Grade's shape as a plain number
// union to avoid types.ts importing from srs.ts for one literal type.
export interface ReviewLogEntry {
  date: string;
  grade: 0 | 1 | 2 | 3 | 4 | 5;
  cardId: string;
}

// ── Labs ───────────────────────────────────────────────────────────
// The curated lab definition itself lives in lib/labs/catalog.ts.  The index
// only stores the learner's durable progress, so a new version of a lab can
// change its visual simulator without making saved study data unreadable.
export interface LabLayerProgress {
  labId: string;
  layerId: string;
  predictedCorrect: boolean;
  explanation?: string;
  completedAt: string;
}

// ── Documents ───────────────────────────────────────────────────────
// `version` here is a mutation counter, bumped by every service.ts write —
// it is NOT a document-schema version, even though it looks like one and was
// being read as one by migrate.ts until 2026-07-29 (confirmed live: seed data
// reaches `version: 5` after five ordinary `addSection` calls, so a
// `version < 2` schema gate was already false before the user ever opened the
// app). `schemaVersion` is the real, separate migration marker — it only
// changes when migrate.ts rewrites the document's shape, never on ordinary
// writes, so old data missing it entirely (schemaVersion undefined → treated
// as 0) is exactly how a pre-migration document is meant to look.
export interface ChironIndex {
  version: number;
  schemaVersion: number;
  sources: StudySource[];
  nodes: MapNode[];
  cards: Card[];
  attempts: Attempt[];
  sessions: StudySession[];
  reviewLog: ReviewLogEntry[];
  labProgress: LabLayerProgress[];
  score: ScoreState;
}

export interface ChironLib {
  version: number;
  schemaVersion: number;
  sourceId: string;
  chapters: Chapter[];
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
