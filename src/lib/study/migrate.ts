// Versioned migration for ChironIndex and ChironLib documents.
// Handles version 0 (garbage) upward.

import type { ChironIndex, ChironLib, StudySource, MapNode, Card, Attempt, StudySession, ScoreState, ApostilaSection, Exercise } from "./types";
import { makeId, today } from "./types";

export function migrateIndex(raw: unknown): ChironIndex {
  if (!raw || typeof raw !== "object") return freshIndex();

  const data = raw as Record<string, unknown>;
  const version = typeof data.version === "number" ? data.version : 0;

  let doc = version >= 1 ? (raw as ChironIndex) : freshIndex();

  if (version < 1) {
    doc = freshIndex();
  }

  return doc;
}

export function migrateLib(raw: unknown, sourceId: string): ChironLib {
  if (!raw || typeof raw !== "object") return freshLib(sourceId);

  const data = raw as Record<string, unknown>;
  const version = typeof data.version === "number" ? data.version : 0;

  if (version < 1) return freshLib(sourceId);

  return raw as ChironLib;
}

export function freshIndex(): ChironIndex {
  return {
    version: 1,
    sources: [],
    nodes: [],
    cards: [],
    attempts: [],
    sessions: [],
    score: { total: 0, streak: 0, lastStudyDate: null },
  };
}

export function freshLib(sourceId: string): ChironLib {
  return {
    version: 1,
    sourceId,
    sections: [],
    exercises: [],
  };
}
