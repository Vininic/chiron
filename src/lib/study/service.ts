// Pure domain service for Chiron — all functions are immutable, returning new documents.

import type {
  ChironIndex, ChironLib, StudySource, MapNode, Chapter, ApostilaSection,
  Exercise, Card, Attempt, StudySession, SessionBlock,
  Mastery, NodeKind, ExerciseType, ExerciseLevel, SessionBlockKind, LabLayerProgress,
} from "./types";
import { makeId, today } from "./types";
import { addPoints } from "./scoring";
import { computeSM2, type SM2Grade } from "./srs";

// ── Sources ─────────────────────────────────────────────────────────

export function addSource(index: ChironIndex, source: Omit<StudySource, "id" | "addedAt" | "version">): { index: ChironIndex; id: string } {
  const id = makeId();
  const newSource: StudySource = { ...source, id, addedAt: new Date().toISOString(), version: 1 };
  return { index: { ...index, sources: [...index.sources, newSource], version: index.version + 1 }, id };
}

export function updateSource(index: ChironIndex, id: string, updates: Partial<StudySource>): ChironIndex {
  return {
    ...index,
    sources: index.sources.map((s) => (s.id === id ? { ...s, ...updates, version: s.version + 1 } : s)),
    version: index.version + 1,
  };
}

export function removeSource(index: ChironIndex, id: string): ChironIndex {
  return {
    ...index,
    sources: index.sources.filter((s) => s.id !== id),
    nodes: index.nodes.filter((n) => n.sourceId !== id),
    cards: index.cards.filter((c) => c.sourceId !== id),
    version: index.version + 1,
  };
}

// ── Map Nodes ───────────────────────────────────────────────────────

export function addNode(index: ChironIndex, node: Omit<MapNode, "id" | "mastery" | "lastReviewedAt">): { index: ChironIndex; id: string } {
  const id = makeId();
  const newNode: MapNode = { ...node, id, mastery: 0, lastReviewedAt: undefined };
  return { index: { ...index, nodes: [...index.nodes, newNode], version: index.version + 1 }, id };
}

export function updateNodeMastery(index: ChironIndex, nodeId: string, mastery: Mastery): ChironIndex {
  return {
    ...index,
    nodes: index.nodes.map((n) => (n.id === nodeId ? { ...n, mastery, lastReviewedAt: new Date().toISOString() } : n)),
    version: index.version + 1,
  };
}

export function updateNode(index: ChironIndex, nodeId: string, updates: Partial<MapNode>): ChironIndex {
  return {
    ...index,
    nodes: index.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)),
    version: index.version + 1,
  };
}

export function getNodesForSource(index: ChironIndex, sourceId: string): MapNode[] {
  return index.nodes.filter((n) => n.sourceId === sourceId);
}

// ── Chapters ────────────────────────────────────────────────────────
// Added 2026-07-29 alongside the F2 content-authoring format
// (seeds/content/types.ts) — Chapter existed as a type since F1's block
// model landed, but nothing could create one except migrate.ts and
// seeds/index.ts building the object literal directly. Real content
// authoring needs the same add/update primitives every other domain type has.

export function addChapter(lib: ChironLib, chapter: Omit<Chapter, "id">): { lib: ChironLib; id: string } {
  const id = makeId();
  const newChapter: Chapter = { ...chapter, id };
  return { lib: { ...lib, chapters: [...lib.chapters, newChapter], version: lib.version + 1 }, id };
}

export function updateChapter(lib: ChironLib, id: string, updates: Partial<Chapter>): ChironLib {
  return { ...lib, chapters: lib.chapters.map((c) => (c.id === id ? { ...c, ...updates } : c)), version: lib.version + 1 };
}

export function removeChapter(lib: ChironLib, id: string): ChironLib {
  return { ...lib, chapters: lib.chapters.filter((c) => c.id !== id), version: lib.version + 1 };
}

// ── Apostila ────────────────────────────────────────────────────────

export function addSection(lib: ChironLib, section: Omit<ApostilaSection, "id">): { lib: ChironLib; id: string } {
  const id = makeId();
  const newSection: ApostilaSection = { ...section, id };
  return { lib: { ...lib, sections: [...lib.sections, newSection], version: lib.version + 1 }, id };
}

export function updateSection(lib: ChironLib, id: string, updates: Partial<ApostilaSection>): ChironLib {
  return { ...lib, sections: lib.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)), version: lib.version + 1 };
}

export function removeSection(lib: ChironLib, id: string): ChironLib {
  return { ...lib, sections: lib.sections.filter((s) => s.id !== id), version: lib.version + 1 };
}

// ── Exercises ───────────────────────────────────────────────────────

export function addExercise(lib: ChironLib, exercise: Omit<Exercise, "id">): { lib: ChironLib; id: string } {
  const id = makeId();
  const newExercise: Exercise = { ...exercise, id };
  return { lib: { ...lib, exercises: [...lib.exercises, newExercise], version: lib.version + 1 }, id };
}

export function updateExercise(lib: ChironLib, id: string, updates: Partial<Exercise>): ChironLib {
  return { ...lib, exercises: lib.exercises.map((e) => (e.id === id ? { ...e, ...updates } : e)), version: lib.version + 1 };
}

export function getExercisesForNode(lib: ChironLib, nodeId: string): Exercise[] {
  return lib.exercises.filter((e) => e.nodeId === nodeId);
}

// ── SRS Cards ───────────────────────────────────────────────────────

export function addCard(index: ChironIndex, card: Omit<Card, "id" | "ease" | "intervalDays" | "dueDate" | "lapses" | "reps">): { index: ChironIndex; id: string } {
  const id = makeId();
  const newCard: Card = {
    ...card, id,
    ease: 2.5, intervalDays: 0, dueDate: today(), lapses: 0, reps: 0,
  };
  return { index: { ...index, cards: [...index.cards, newCard], version: index.version + 1 }, id };
}

export function reviewCard(index: ChironIndex, cardId: string, grade: SM2Grade): ChironIndex {
  const card = index.cards.find((c) => c.id === cardId);
  if (!card) return index;
  const result = computeSM2(card.ease, card.intervalDays, card.reps, card.lapses, grade);
  return {
    ...index,
    cards: index.cards.map((c) => (c.id === cardId ? { ...c, ...result } : c)),
    reviewLog: [...index.reviewLog, { date: today(), grade, cardId }],
    version: index.version + 1,
  };
}

export function getCardsDue(index: ChironIndex, todayStr?: string): Card[] {
  const t = todayStr ?? today();
  return index.cards.filter((c) => c.dueDate <= t);
}

// ── Attempts ────────────────────────────────────────────────────────

export function recordAttempt(index: ChironIndex, attempt: Omit<Attempt, "id" | "at">): { index: ChironIndex; id: string } {
  const id = makeId();
  const newAttempt: Attempt = { ...attempt, id, at: new Date().toISOString() };
  const updatedIndex = { ...index, attempts: [...index.attempts, newAttempt], version: index.version + 1 };
  const updatedScore = addPoints(updatedIndex.score, attempt.scoreAwarded);
  return { index: { ...updatedIndex, score: updatedScore }, id };
}

export function recordLabLayer(index: ChironIndex, progress: LabLayerProgress): ChironIndex {
  const rest = index.labProgress.filter((item) => !(item.labId === progress.labId && item.layerId === progress.layerId));
  return { ...index, labProgress: [...rest, progress], version: index.version + 1 };
}

// ── Sessions ────────────────────────────────────────────────────────

export function createSession(index: ChironIndex, budgetMin: number, blocks: SessionBlock[]): { index: ChironIndex; session: StudySession } {
  const session: StudySession = {
    id: makeId(),
    date: today(),
    budgetMin,
    blocks,
    startedAt: new Date().toISOString(),
  };
  return { index: { ...index, sessions: [...index.sessions, session], version: index.version + 1 }, session };
}

export function completeBlock(session: StudySession, blockRef: string): StudySession {
  return {
    ...session,
    blocks: session.blocks.map((b) => (b.refId === blockRef ? { ...b, done: true } : b)),
  };
}

export function completeSession(index: ChironIndex, sessionId: string): ChironIndex {
  return {
    ...index,
    sessions: index.sessions.map((s) => (s.id === sessionId ? { ...s, completedAt: new Date().toISOString() } : s)),
    version: index.version + 1,
  };
}

// ── Serialization ───────────────────────────────────────────────────

export function serializeIndex(index: ChironIndex): string {
  return JSON.stringify(index);
}

export function serializeLib(lib: ChironLib): string {
  return JSON.stringify(lib);
}
