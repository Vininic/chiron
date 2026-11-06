import { describe, it, expect } from "vitest";
import { materializeDrafts } from "./materialize";
import {
  freshDrafts, addDraftFromNode, addDraftFromSection, addDraftFromExercise, addDraftFromCard, approveDraft,
} from "./drafts";
import { freshIndex, freshLib } from "../migrate";
import { addNode } from "../service";
import type { DraftDocument } from "./drafts";

const SOURCE_ID = "src1";

function approveAll(doc: DraftDocument): DraftDocument {
  return doc.drafts.reduce((d, draft) => approveDraft(d, draft.id), doc);
}

describe("materializeDrafts", () => {
  it("materializes nodes, sections, exercises and cards from approved drafts", () => {
    let doc = freshDrafts(SOURCE_ID);
    doc = addDraftFromNode(doc, SOURCE_ID, { title: "Fundamentos", kind: "concept", requires: [] });
    doc = addDraftFromNode(doc, SOURCE_ID, { title: "Avançado", kind: "concept", parentTitle: "Fundamentos", requires: ["Fundamentos"] });
    doc = addDraftFromSection(doc, SOURCE_ID, { title: "Intro", nodeTitle: "Fundamentos", bodyMd: "texto ```ts\nconst a = 1;\n```", order: 1 });
    doc = addDraftFromExercise(doc, SOURCE_ID, { type: 1, level: "beginner", promptMd: "p", answerKeyMd: "a", points: 10, nodeTitle: "Fundamentos" });
    doc = addDraftFromCard(doc, SOURCE_ID, { frontMd: "f", backMd: "b", nodeTitle: "Fundamentos" });
    doc = approveAll(doc);

    const result = materializeDrafts(doc, SOURCE_ID, freshIndex(), freshLib(SOURCE_ID), "Rascunho");

    expect(result.counts).toEqual({ nodes: 2, sections: 1, exercises: 1, cards: 1 });
    expect(result.index.nodes).toHaveLength(2);
    expect(result.lib.sections).toHaveLength(1);
    expect(result.lib.exercises).toHaveLength(1);
    expect(result.index.cards).toHaveLength(1);

    const fundamentos = result.index.nodes.find((n) => n.title === "Fundamentos")!;
    const avancado = result.index.nodes.find((n) => n.title === "Avançado")!;
    expect(avancado.parentId).toBe(fundamentos.id);
    expect(avancado.requires).toEqual([fundamentos.id]);

    const section = result.lib.sections[0];
    expect(section.nodeId).toBe(fundamentos.id);
    expect(section.chapterId).toBeTruthy();
    expect(section.blocks.some((b) => b.kind === "code")).toBe(true);

    expect(result.lib.chapters).toHaveLength(1);
    expect(result.lib.chapters[0].title).toBe("Rascunho");
    expect(result.lib.chapters[0].sectionIds).toEqual([section.id]);

    expect(result.lib.exercises[0].nodeId).toBe(fundamentos.id);
    expect(result.index.cards[0].nodeId).toBe(fundamentos.id);
  });

  it("ignores unapproved (pending/rejected) drafts", () => {
    let doc = freshDrafts(SOURCE_ID);
    doc = addDraftFromNode(doc, SOURCE_ID, { title: "N1", kind: "concept", requires: [] });
    // never approved

    const result = materializeDrafts(doc, SOURCE_ID, freshIndex(), freshLib(SOURCE_ID));
    expect(result.counts.nodes).toBe(0);
  });

  it("drops sections/exercises/cards whose nodeTitle doesn't resolve, without throwing", () => {
    let doc = freshDrafts(SOURCE_ID);
    doc = addDraftFromSection(doc, SOURCE_ID, { title: "Orphan", nodeTitle: "Nonexistent", bodyMd: "x", order: 1 });
    doc = addDraftFromExercise(doc, SOURCE_ID, { type: 1, level: "beginner", promptMd: "p", answerKeyMd: "a", points: 10, nodeTitle: "Nonexistent" });
    doc = addDraftFromCard(doc, SOURCE_ID, { frontMd: "f", backMd: "b", nodeTitle: "Nonexistent" });
    doc = approveAll(doc);

    expect(() => materializeDrafts(doc, SOURCE_ID, freshIndex(), freshLib(SOURCE_ID))).not.toThrow();
    const result = materializeDrafts(doc, SOURCE_ID, freshIndex(), freshLib(SOURCE_ID));
    expect(result.counts).toEqual({ nodes: 0, sections: 0, exercises: 0, cards: 0 });
  });

  it("clamps an out-of-range exercise type instead of writing an invalid value", () => {
    let doc = freshDrafts(SOURCE_ID);
    doc = addDraftFromNode(doc, SOURCE_ID, { title: "N1", kind: "concept", requires: [] });
    doc = addDraftFromExercise(doc, SOURCE_ID, { type: 99, level: "beginner", promptMd: "p", answerKeyMd: "a", points: 10, nodeTitle: "N1" });
    doc = approveAll(doc);

    const result = materializeDrafts(doc, SOURCE_ID, freshIndex(), freshLib(SOURCE_ID));
    expect(result.lib.exercises[0].type).toBe(1);
  });

  it("resolves nodeTitle against nodes that already existed for the source before this run", () => {
    const { index: withExisting, id: existingId } = addNode(freshIndex(), { sourceId: SOURCE_ID, title: "Existing", kind: "concept", requires: [] });
    let doc = freshDrafts(SOURCE_ID);
    doc = addDraftFromSection(doc, SOURCE_ID, { title: "New section", nodeTitle: "Existing", bodyMd: "x", order: 1 });
    doc = approveAll(doc);

    const result = materializeDrafts(doc, SOURCE_ID, withExisting, freshLib(SOURCE_ID));
    expect(result.counts.sections).toBe(1);
    expect(result.lib.sections[0].nodeId).toBe(existingId);
  });

  it("does not duplicate a node whose title already exists for the source", () => {
    const { index: withExisting } = addNode(freshIndex(), { sourceId: SOURCE_ID, title: "Existing", kind: "concept", requires: [] });
    let doc = freshDrafts(SOURCE_ID);
    doc = addDraftFromNode(doc, SOURCE_ID, { title: "Existing", kind: "concept", requires: [] });
    doc = approveAll(doc);

    const result = materializeDrafts(doc, SOURCE_ID, withExisting, freshLib(SOURCE_ID));
    expect(result.counts.nodes).toBe(0);
    expect(result.index.nodes.filter((n) => n.title === "Existing")).toHaveLength(1);
  });
});
