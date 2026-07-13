import { describe, it, expect } from "vitest";
import { freshIndex, freshLib } from "./migrate";
import {
  addSource, updateSource, removeSource,
  addNode, updateNodeMastery, getNodesForSource,
  addSection, updateSection, removeSection,
  addExercise, getExercisesForNode,
  addCard, reviewCard, getCardsDue,
  recordAttempt,
  createSession, completeBlock, completeSession,
} from "./service";

describe("Chiron service", () => {
  const EMPTY = freshLib("s1");

  describe("sources", () => {
    it("adds a source", () => {
      const { index, id } = addSource(freshIndex(), { kind: "repo", name: "chronos", repoUrl: "https://github.com/test", language: "TypeScript" });
      expect(index.sources).toHaveLength(1);
      expect(index.sources[0].name).toBe("chronos");
      expect(id).toBeTruthy();
    });

    it("updates a source", () => {
      const { index, id } = addSource(freshIndex(), { kind: "repo", name: "chronos", language: "TS" });
      const updated = updateSource(index, id, { language: "TypeScript" });
      expect(updated.sources[0].language).toBe("TypeScript");
      expect(updated.sources[0].version).toBe(2);
    });

    it("removes source and associated nodes/cards", () => {
      const base = freshIndex();
      const { index: withSrc, id: srcId } = addSource(base, { kind: "stack", name: "React" });
      const { index: withNode } = addNode(withSrc, { sourceId: srcId, title: "useState", kind: "concept", requires: [] });
      const { index: withCard } = addCard(withNode, { sourceId: srcId, nodeId: withNode.nodes[withNode.nodes.length - 1].id, frontMd: "What is state?", backMd: "..." });
      const removed = removeSource(withCard, srcId);
      expect(removed.sources).toHaveLength(0);
      expect(removed.nodes).toHaveLength(0);
      expect(removed.cards).toHaveLength(0);
    });
  });

  describe("nodes", () => {
    it("adds a node with default mastery 0", () => {
      const base = freshIndex();
      const { index: withSrc, id: srcId } = addSource(base, { kind: "repo", name: "test" });
      const { index, id } = addNode(withSrc, { sourceId: srcId, title: "useEffect", kind: "concept", requires: [] });
      expect(index.nodes).toHaveLength(1);
      expect(index.nodes[0].mastery).toBe(0);
    });

    it("updates node mastery", () => {
      const base = freshIndex();
      const { index: withSrc, id: srcId } = addSource(base, { kind: "repo", name: "test" });
      const { index: withNode, id: nodeId } = addNode(withSrc, { sourceId: srcId, title: "React", kind: "concept", requires: [] });
      const updated = updateNodeMastery(withNode, nodeId, 3);
      expect(updated.nodes[0].mastery).toBe(3);
      expect(updated.nodes[0].lastReviewedAt).toBeTruthy();
    });

    it("filters nodes by source", () => {
      const base = freshIndex();
      const { index: withSrc, id: srcId } = addSource(base, { kind: "repo", name: "a" });
      const { index: withSrc2, id: srcId2 } = addSource(withSrc, { kind: "repo", name: "b" });
      const i1 = addNode(withSrc2, { sourceId: srcId, title: "N1", kind: "concept", requires: [] }).index;
      const i2 = addNode(i1, { sourceId: srcId2, title: "N2", kind: "concept", requires: [] }).index;
      expect(getNodesForSource(i2, srcId)).toHaveLength(1);
      expect(getNodesForSource(i2, srcId2)).toHaveLength(1);
    });
  });

  describe("apostila sections", () => {
    it("adds a section", () => {
      const { lib, id } = addSection(EMPTY, { sourceId: "s1", nodeId: "n1", title: "Intro", bodyMd: "Hello", citations: [], order: 1 });
      expect(lib.sections).toHaveLength(1);
      expect(lib.sections[0].title).toBe("Intro");
      expect(id).toBeTruthy();
    });

    it("updates a section", () => {
      const { lib, id } = addSection(EMPTY, { sourceId: "s1", nodeId: "n1", title: "Old", bodyMd: "...", citations: [], order: 1 });
      const updated = updateSection(lib, id, { title: "New" });
      expect(updated.sections[0].title).toBe("New");
    });

    it("removes a section", () => {
      const { lib, id } = addSection(EMPTY, { sourceId: "s1", nodeId: "n1", title: "Del", bodyMd: "", citations: [], order: 1 });
      const removed = removeSection(lib, id);
      expect(removed.sections).toHaveLength(0);
    });
  });

  describe("exercises", () => {
    it("adds an exercise", () => {
      const { lib, id } = addExercise(EMPTY, { sourceId: "s1", nodeId: "n1", type: 1, level: "beginner", promptMd: "What?", answerKeyMd: "X", points: 10 });
      expect(lib.exercises).toHaveLength(1);
      expect(lib.exercises[0].type).toBe(1);
    });

    it("filters by node", () => {
      const a1 = addExercise(EMPTY, { sourceId: "s1", nodeId: "n1", type: 1, level: "beginner", promptMd: "Q1", answerKeyMd: "A", points: 10 });
      const a2 = addExercise(a1.lib, { sourceId: "s1", nodeId: "n2", type: 2, level: "intermediate", promptMd: "Q2", answerKeyMd: "A", points: 10 });
      expect(getExercisesForNode(a2.lib, "n1")).toHaveLength(1);
      expect(getExercisesForNode(a2.lib, "n2")).toHaveLength(1);
    });
  });

  describe("cards", () => {
    it("adds a card with default SM-2 values", () => {
      const base = freshIndex();
      const { index, id } = addCard(base, { sourceId: "s1", nodeId: "n1", frontMd: "Front?", backMd: "Back!" });
      expect(index.cards).toHaveLength(1);
      expect(index.cards[0].ease).toBe(2.5);
      expect(index.cards[0].reps).toBe(0);
    });

    it("reviews a card with SM-2", () => {
      const base = freshIndex();
      const { index: withCard, id: cardId } = addCard(base, { sourceId: "s1", nodeId: "n1", frontMd: "Q", backMd: "A" });
      const reviewed = reviewCard(withCard, cardId, 4);
      const card = reviewed.cards[0];
      expect(card.reps).toBe(1);
      expect(card.intervalDays).toBe(1);
    });

    it("resets card on failed review", () => {
      const base = freshIndex();
      const { index: withCard, id: cardId } = addCard(base, { sourceId: "s1", nodeId: "n1", frontMd: "Q", backMd: "A" });
      const reviewed = reviewCard(withCard, cardId, 1);
      expect(reviewed.cards[0].lapses).toBe(1);
      expect(reviewed.cards[0].intervalDays).toBe(1);
    });

    it("filters due cards", () => {
      const base = freshIndex();
      const { index: withCard } = addCard(base, { sourceId: "s1", nodeId: "n1", frontMd: "Due", backMd: "A" });
      const due = getCardsDue(withCard, "2126-07-12");
      expect(due).toHaveLength(1);
    });
  });

  describe("attempts", () => {
    it("records an attempt and adds points", () => {
      const base = freshIndex();
      const { index, id } = recordAttempt(base, { exerciseId: "e1", answer: "my answer", scoreAwarded: 10 });
      expect(index.attempts).toHaveLength(1);
      expect(index.score.total).toBe(10);
    });
  });

  describe("sessions", () => {
    it("creates a session", () => {
      const base = freshIndex();
      const { index, session } = createSession(base, 25, [{ kind: "review", refId: "c1", estMin: 10, done: false }]);
      expect(session.budgetMin).toBe(25);
      expect(index.sessions).toHaveLength(1);
    });

    it("completes a block", () => {
      const blocks = [{ kind: "review" as const, refId: "c1", estMin: 10, done: false }];
      const base = freshIndex();
      const { index: withSession, session } = createSession(base, 25, blocks);
      const completed = completeBlock(session, "c1");
      expect(completed.blocks[0].done).toBe(true);
    });

    it("completes a session", () => {
      const base = freshIndex();
      const { index: withSession, session } = createSession(base, 25, []);
      const completed = completeSession(withSession, session.id);
      expect(completed.sessions[0].completedAt).toBeTruthy();
    });
  });
});
