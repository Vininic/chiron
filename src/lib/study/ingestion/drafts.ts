import { makeId } from "../types";
import type { GeneratedNode, GeneratedSection, GeneratedExercise, GeneratedCard } from "./passes";

export type DraftKind = "node" | "section" | "exercise" | "card";

export interface Draft<T = unknown> {
  id: string;
  kind: DraftKind;
  sourceId: string;
  status: "pending" | "approved" | "rejected";
  data: T;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DraftDocument {
  sourceId: string;
  drafts: Draft[];
}

export type DraftNode = Draft<GeneratedNode>;
export type DraftSection = Draft<GeneratedSection>;
export type DraftExercise = Draft<GeneratedExercise>;
export type DraftCard = Draft<GeneratedCard>;

export function freshDrafts(sourceId: string): DraftDocument {
  return { sourceId, drafts: [] };
}

export function addDraftFromNode(
  doc: DraftDocument,
  sourceId: string,
  node: GeneratedNode,
): DraftDocument {
  return {
    ...doc,
    drafts: [
      ...doc.drafts,
      {
        id: makeId(),
        kind: "node",
        sourceId,
        status: "pending",
        data: node,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };
}

export function addDraftFromSection(
  doc: DraftDocument,
  sourceId: string,
  section: GeneratedSection,
): DraftDocument {
  return {
    ...doc,
    drafts: [
      ...doc.drafts,
      {
        id: makeId(),
        kind: "section",
        sourceId,
        status: "pending",
        data: section,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };
}

export function addDraftFromExercise(
  doc: DraftDocument,
  sourceId: string,
  exercise: GeneratedExercise,
): DraftDocument {
  return {
    ...doc,
    drafts: [
      ...doc.drafts,
      {
        id: makeId(),
        kind: "exercise",
        sourceId,
        status: "pending",
        data: exercise,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };
}

export function addDraftFromCard(
  doc: DraftDocument,
  sourceId: string,
  card: GeneratedCard,
): DraftDocument {
  return {
    ...doc,
    drafts: [
      ...doc.drafts,
      {
        id: makeId(),
        kind: "card",
        sourceId,
        status: "pending",
        data: card,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };
}

export function approveDraft(doc: DraftDocument, draftId: string): DraftDocument {
  return {
    ...doc,
    drafts: doc.drafts.map((d) =>
      d.id === draftId ? { ...d, status: "approved" as const, updatedAt: new Date().toISOString() } : d,
    ),
  };
}

export function rejectDraft(doc: DraftDocument, draftId: string, feedback?: string): DraftDocument {
  return {
    ...doc,
    drafts: doc.drafts.map((d) =>
      d.id === draftId
        ? { ...d, status: "rejected" as const, feedback, updatedAt: new Date().toISOString() }
        : d,
    ),
  };
}

export function removeDraft(doc: DraftDocument, draftId: string): DraftDocument {
  return { ...doc, drafts: doc.drafts.filter((d) => d.id !== draftId) };
}

export function approveAllDrafts(doc: DraftDocument): DraftDocument {
  return {
    ...doc,
    drafts: doc.drafts.map((d) =>
      d.status === "pending" ? { ...d, status: "approved" as const, updatedAt: new Date().toISOString() } : d,
    ),
  };
}

export function getPendingDrafts(doc: DraftDocument): Draft[] {
  return doc.drafts.filter((d) => d.status === "pending");
}

export function getApprovedDrafts(doc: DraftDocument): Draft[] {
  return doc.drafts.filter((d) => d.status === "approved");
}
