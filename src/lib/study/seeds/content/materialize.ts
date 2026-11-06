/** Turns a `ContentSource` (types.ts — Chapter/Block-native authoring) into
 *  real `ChironIndex`/`ChironLib` documents, using the same service.ts
 *  primitives the rest of the app writes through. Unlike
 *  `ingestion/materialize.ts` (which resolves AI-drafted title references and
 *  synthesizes one catch-all chapter), this one trusts the author's chapter
 *  structure directly — hand-authored content already knows its own level
 *  and grouping, there's nothing to infer. */
import { addSource, addNode, updateNode, addChapter, updateChapter, addSection, addExercise, addCard } from "@/lib/study/service";
import { freshLib } from "@/lib/study/migrate";
import type { ChironIndex, ChironLib } from "@/lib/study/types";
import type { ContentSource } from "./types";

export function applyContentSource(index: ChironIndex, source: ContentSource): { index: ChironIndex; lib: ChironLib } {
  const { index: withSource, id: sourceId } = addSource(index, {
    kind: source.kind, name: source.name, language: source.language, contentOrigin: source.origin ?? "built_in",
  });
  let currentIndex = withSource;
  let currentLib = freshLib(sourceId);

  // One node per chapter (see the doc comment on ContentChapter for why
  // that's the right granularity for a stack apostila).
  const nodeIdByTitle = new Map<string, string>();
  const nodeTitlesInOrder: string[] = [];
  for (const chapter of source.chapters) {
    if (nodeIdByTitle.has(chapter.nodeTitle)) continue;
    const { index: next, id } = addNode(currentIndex, {
      sourceId, title: chapter.nodeTitle, kind: chapter.nodeKind, requires: [],
    });
    currentIndex = next;
    nodeIdByTitle.set(chapter.nodeTitle, id);
    nodeTitlesInOrder.push(chapter.nodeTitle);
  }

  // A hand-authored stack apostila's chapters are read in order — chapter N
  // assumes chapter N-1's concepts, exactly like this book's own chapters
  // say "capítulo 1 já estabeleceu…" to each other throughout python.ts.
  // Wiring that same sequence into `requires` is what gives the map (F5) a
  // real DAG to lay out and lock/unlock, instead of every node sitting
  // unconnected in one flat layer because nothing anywhere sets `requires`.
  for (let i = 1; i < nodeTitlesInOrder.length; i++) {
    const nodeId = nodeIdByTitle.get(nodeTitlesInOrder[i])!;
    const prevNodeId = nodeIdByTitle.get(nodeTitlesInOrder[i - 1])!;
    currentIndex = updateNode(currentIndex, nodeId, { requires: [prevNodeId] });
  }

  source.chapters.forEach((chapter, chapterIdx) => {
    const nodeId = nodeIdByTitle.get(chapter.nodeTitle);
    if (!nodeId) return;

    const { lib: withChapter, id: chapterId } = addChapter(currentLib, {
      sourceId, title: chapter.title, level: chapter.level, order: chapterIdx + 1, sectionIds: [],
    });
    currentLib = withChapter;

    const sectionIds: string[] = [];
    for (const section of chapter.sections) {
      const { lib: next, id } = addSection(currentLib, {
        sourceId, chapterId, nodeId, title: section.title, blocks: section.blocks, order: section.order,
      });
      currentLib = next;
      sectionIds.push(id);
    }
    currentLib = updateChapter(currentLib, chapterId, { sectionIds });
  });

  for (const ex of source.exercises) {
    const nodeId = nodeIdByTitle.get(ex.nodeTitle);
    if (!nodeId) continue;
    const { lib: next } = addExercise(currentLib, {
      sourceId, nodeId, type: ex.type, level: ex.level,
      promptMd: ex.promptMd, choices: ex.choices, answerKeyMd: ex.answerKeyMd, rubricMd: ex.rubricMd, points: ex.points,
    });
    currentLib = next;
  }

  for (const card of source.cards) {
    const nodeId = nodeIdByTitle.get(card.nodeTitle);
    if (!nodeId) continue;
    const { index: next } = addCard(currentIndex, {
      sourceId, nodeId, frontMd: card.frontMd, backMd: card.backMd,
    });
    currentIndex = next;
  }

  return { index: currentIndex, lib: currentLib };
}
