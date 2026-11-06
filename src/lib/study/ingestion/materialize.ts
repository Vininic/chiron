/** Turns approved ingestion drafts into real domain documents. Pure — no
 *  network, no AI — which is exactly why it's the half of the pipeline that
 *  gets a real test suite (materialize.test.ts); run.ts's network/AI calls
 *  can't be unit tested the same way.
 *
 *  The map pass emits node *titles*, not ids (the model has no id to give),
 *  so sections/exercises/cards all reference their node by title too — this
 *  file's whole job is resolving those titles against the ids that
 *  `addNode` actually assigns, and dropping (not crashing on) anything that
 *  fails to resolve, same defensive pattern seeds/index.ts already uses. */
import { addNode, addSection, addExercise, addCard, updateNode } from "../service";
import { makeId } from "../types";
import type { ChironIndex, ChironLib, ExerciseType } from "../types";
import { mdToBlocks } from "@/lib/content/blocks";
import { getApprovedDrafts, type DraftDocument, type DraftNode, type DraftSection, type DraftExercise, type DraftCard } from "./drafts";

export interface MaterializeCounts {
  nodes: number;
  sections: number;
  exercises: number;
  cards: number;
}

export interface MaterializeResult {
  index: ChironIndex;
  lib: ChironLib;
  counts: MaterializeCounts;
}

const VALID_EXERCISE_TYPES: ExerciseType[] = [1, 2, 3, 4, 5, 6];

/** The AI returns a plain number for exercise type — clamp anything outside
 *  the real 1–6 union to 1 (Read & predict, the safest default) rather than
 *  writing an invalid value into the domain or throwing away the exercise. */
function clampExerciseType(n: number): ExerciseType {
  return (VALID_EXERCISE_TYPES as number[]).includes(n) ? (n as ExerciseType) : 1;
}

export function materializeDrafts(
  doc: DraftDocument,
  sourceId: string,
  index: ChironIndex,
  lib: ChironLib,
  chapterTitle = "Rascunho da IA",
): MaterializeResult {
  const approved = getApprovedDrafts(doc);

  let currentIndex = index;
  let currentLib = lib;

  // Seed the title→id map with whatever this source already has, so a
  // section/exercise/card drafted this run can reference a node that was
  // added in an earlier ingestion (or came from seed data) without needing
  // that node to be re-drafted.
  const nodeIdByTitle = new Map<string, string>(
    currentIndex.nodes.filter((n) => n.sourceId === sourceId).map((n) => [n.title, n.id]),
  );

  const nodeDrafts = approved.filter((d): d is DraftNode => d.kind === "node");
  let nodesAdded = 0;
  for (const draft of nodeDrafts) {
    const node = draft.data;
    if (nodeIdByTitle.has(node.title)) continue; // don't duplicate an existing node title
    const { index: next, id } = addNode(currentIndex, { sourceId, title: node.title, kind: node.kind, requires: [] });
    currentIndex = next;
    nodeIdByTitle.set(node.title, id);
    nodesAdded++;
  }

  // Second pass: resolve parentTitle/requires (title strings from the AI)
  // into real ids now that every title added this run has one.
  for (const draft of nodeDrafts) {
    const node = draft.data;
    const id = nodeIdByTitle.get(node.title);
    if (!id) continue;
    const parentId = node.parentTitle ? nodeIdByTitle.get(node.parentTitle) : undefined;
    const requires = node.requires.map((t) => nodeIdByTitle.get(t)).filter((v): v is string => !!v);
    if (parentId !== undefined || requires.length > 0) {
      currentIndex = updateNode(currentIndex, id, { ...(parentId !== undefined ? { parentId } : {}), requires });
    }
  }

  // Sections land in one synthetic chapter for this run — the AI has no
  // notion of básico/intermediário/avançado (that's a curriculum decision,
  // not something derivable from source files), same reasoning as the v1→v2
  // migration and the seed bridge in seeds/index.ts. The user re-sorts these
  // into real chapters as part of reviewing the draft.
  const chapterId = makeId();
  const sectionIds: string[] = [];
  const sectionDrafts = approved.filter((d): d is DraftSection => d.kind === "section");
  for (const draft of sectionDrafts) {
    const section = draft.data;
    const nodeId = nodeIdByTitle.get(section.nodeTitle);
    if (!nodeId) continue;
    const { lib: next, id } = addSection(currentLib, {
      sourceId, chapterId, nodeId, title: section.title,
      blocks: mdToBlocks(section.bodyMd), order: section.order,
    });
    currentLib = next;
    sectionIds.push(id);
  }
  if (sectionIds.length > 0) {
    currentLib = {
      ...currentLib,
      chapters: [
        ...currentLib.chapters,
        { id: chapterId, sourceId, title: chapterTitle, level: "basico", order: currentLib.chapters.length + 1, sectionIds },
      ],
    };
  }

  let exercisesAdded = 0;
  const exerciseDrafts = approved.filter((d): d is DraftExercise => d.kind === "exercise");
  for (const draft of exerciseDrafts) {
    const exercise = draft.data;
    const nodeId = nodeIdByTitle.get(exercise.nodeTitle);
    if (!nodeId) continue;
    const { lib: next } = addExercise(currentLib, {
      sourceId, nodeId, type: clampExerciseType(exercise.type), level: exercise.level,
      promptMd: exercise.promptMd, choices: exercise.choices, answerKeyMd: exercise.answerKeyMd,
      points: exercise.points,
    });
    currentLib = next;
    exercisesAdded++;
  }

  let cardsAdded = 0;
  const cardDrafts = approved.filter((d): d is DraftCard => d.kind === "card");
  for (const draft of cardDrafts) {
    const card = draft.data;
    const nodeId = nodeIdByTitle.get(card.nodeTitle);
    if (!nodeId) continue;
    const { index: next } = addCard(currentIndex, { sourceId, nodeId, frontMd: card.frontMd, backMd: card.backMd });
    currentIndex = next;
    cardsAdded++;
  }

  return {
    index: currentIndex,
    lib: currentLib,
    counts: { nodes: nodesAdded, sections: sectionIds.length, exercises: exercisesAdded, cards: cardsAdded },
  };
}
