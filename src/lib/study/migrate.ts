// Versioned migration for ChironIndex and ChironLib documents.
// Gated on `schemaVersion`, NOT `version` — `version` is a mutation counter
// bumped by every service.ts write (see the doc comment on ChironIndex/
// ChironLib in types.ts). Reading `version` for schema gating was the
// original design here and was live-confirmed broken 2026-07-29: seed data
// already sits at `version: 5` after a handful of ordinary writes, so a
// `version < 2` gate silently never fires. `schemaVersion` only ever changes
// inside this file.

import type { ChironIndex, ChironLib, Chapter, ApostilaSection, Exercise } from "./types";
import { makeId } from "./types";
import { mdToBlocks } from "@/lib/content/blocks";

const INDEX_SCHEMA_VERSION = 3;
const LIB_SCHEMA_VERSION = 2;

export function migrateIndex(raw: unknown): ChironIndex {
  if (!raw || typeof raw !== "object") return freshIndex();

  const data = raw as Record<string, unknown>;

  // The gate here is "does this look like a real index at all" (garbage/
  // corrupt → start fresh), not "is schemaVersion already stamped" — treating
  // an *absent* stamp as "invalid, discard everything" would wipe every real
  // user's sources/nodes/cards the first time this function ever ran on
  // their data.
  if (!Array.isArray(data.sources)) return freshIndex();

  // v1 → v2: `reviewLog` added (F4 dashboard retention chart) — old data
  // simply never had review events logged, so it defaults empty rather than
  // losing anything real.
  return {
    ...(raw as ChironIndex),
    reviewLog: Array.isArray(data.reviewLog) ? (data.reviewLog as ChironIndex["reviewLog"]) : [],
    // v2 → v3: guided Lab-layer progress. Missing progress is an honest
    // "not started", never a reason to discard a person's study document.
    labProgress: Array.isArray(data.labProgress) ? (data.labProgress as ChironIndex["labProgress"]) : [],
    schemaVersion: INDEX_SCHEMA_VERSION,
  };
}

// ── v1 → v2: bodyMd (string) + citations → blocks[]; sections gain a chapter ──
// v1 libraries have no chapter concept at all — this doesn't try to guess a
// real básico/intermediário/avançado split from a flat section list (that
// would be a content decision, not a migration), it synthesizes one holding
// everything in its original order, so nothing that already existed is
// silently dropped.

interface CitationV1 {
  file: string;
  symbol: string;
}

interface ApostilaSectionV1 {
  id: string;
  sourceId: string;
  nodeId: string;
  title: string;
  bodyMd: string;
  citations: CitationV1[];
  order: number;
}

interface ChironLibV1 {
  version?: number;
  sourceId: string;
  sections?: ApostilaSectionV1[];
  exercises?: Exercise[];
}

function migrateLibV1toV2(raw: ChironLibV1, sourceId: string): ChironLib {
  const rawSections = raw.sections ?? [];
  const chapterId = makeId();

  const sections: ApostilaSection[] = [...rawSections]
    .sort((a, b) => a.order - b.order)
    .map((s) => ({
      id: s.id,
      sourceId: s.sourceId,
      chapterId,
      nodeId: s.nodeId,
      title: s.title,
      blocks: mdToBlocks(s.bodyMd, s.citations),
      order: s.order,
    }));

  const chapter: Chapter = {
    id: chapterId,
    sourceId,
    title: "Conteúdo migrado",
    level: "basico",
    order: 1,
    sectionIds: sections.map((s) => s.id),
  };

  return {
    version: raw.version ?? 1,
    schemaVersion: LIB_SCHEMA_VERSION,
    sourceId,
    chapters: sections.length > 0 ? [chapter] : [],
    sections,
    exercises: raw.exercises ?? [],
  };
}

export function migrateLib(raw: unknown, sourceId: string): ChironLib {
  if (!raw || typeof raw !== "object") return freshLib(sourceId);

  const data = raw as Record<string, unknown>;
  const schemaVersion = typeof data.schemaVersion === "number" ? data.schemaVersion : 0;

  if (schemaVersion < LIB_SCHEMA_VERSION) return migrateLibV1toV2(raw as ChironLibV1, sourceId);

  return raw as ChironLib;
}

export function freshIndex(): ChironIndex {
  return {
    version: 1,
    schemaVersion: INDEX_SCHEMA_VERSION,
    sources: [],
    nodes: [],
    cards: [],
    attempts: [],
    sessions: [],
    reviewLog: [],
    labProgress: [],
    score: { total: 0, streak: 0, lastStudyDate: null },
  };
}

export function freshLib(sourceId: string): ChironLib {
  return {
    version: 1,
    schemaVersion: LIB_SCHEMA_VERSION,
    sourceId,
    chapters: [],
    sections: [],
    exercises: [],
  };
}
