import { REPO_SEEDS, SKILL_SEEDS } from "./data";
import type { SeedSource } from "./data";
import { addSource, addNode, addSection, addCard, addExercise } from "../service";
import type { ChironIndex, ChironLib } from "../types";
import { freshLib } from "../migrate";

export interface SeedResult {
  index: ChironIndex;
  libs: Record<string, ChironLib>;
}

function applySeed(index: ChironIndex, seed: SeedSource): { index: ChironIndex; libs: Record<string, ChironLib> } {
  const { index: withSource, id: sourceId } = addSource(index, {
    kind: seed.kind,
    name: seed.name,
    repoUrl: seed.repoUrl,
    language: seed.language,
  });
  let currentIndex = withSource;
  let currentLib = freshLib(sourceId);

  // Track node titles → IDs for section/exercise/card mapping
  const nodeMap = new Map<string, string>();

  for (const n of seed.nodes) {
    const { index: next, id } = addNode(currentIndex, {
      sourceId,
      title: n.title,
      kind: n.kind,
      requires: [],
    });
    currentIndex = next;
    nodeMap.set(n.title, id);
  }

  for (const s of seed.sections) {
    const nodeId = nodeMap.get(s.nodeTitle);
    if (!nodeId) continue;
    const { lib: next } = addSection(currentLib, {
      sourceId,
      nodeId,
      title: s.title,
      bodyMd: s.bodyMd,
      citations: [],
      order: s.order,
    });
    currentLib = next;
  }

  for (const e of seed.exercises) {
    const nodeId = nodeMap.get(e.nodeTitle);
    if (!nodeId) continue;
    const { lib: next } = addExercise(currentLib, {
      sourceId,
      nodeId,
      type: e.type as any,
      level: e.level,
      promptMd: e.promptMd,
      choices: e.choices,
      answerKeyMd: e.answerKeyMd,
      points: e.points,
    });
    currentLib = next;
  }

  for (const c of seed.cards) {
    const nodeId = nodeMap.get(c.nodeTitle);
    if (!nodeId) continue;
    const { index: next } = addCard(currentIndex, {
      sourceId,
      nodeId,
      frontMd: c.frontMd,
      backMd: c.backMd,
    });
    currentIndex = next;
  }

  return { index: currentIndex, libs: { [sourceId]: currentLib } };
}

export function runSeed(): SeedResult {
  let index: ChironIndex = {
    version: 1,
    sources: [],
    nodes: [],
    cards: [],
    attempts: [],
    sessions: [],
    score: { total: 0, streak: 0, lastStudyDate: null },
  };
  const libs: Record<string, ChironLib> = {};

  for (const seed of [...REPO_SEEDS, ...SKILL_SEEDS]) {
    const result = applySeed(index, seed);
    index = result.index;
    Object.assign(libs, result.libs);
  }

  return { index, libs };
}
