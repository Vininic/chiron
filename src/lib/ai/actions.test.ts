import { describe, expect, it } from "vitest";
import { applyAction, parseActions } from "./actions";
import { freshIndex, freshLib } from "@/lib/study/migrate";
import { addNode, addSource } from "@/lib/study/service";

describe("Aetheris actions", () => {
  it("strips an actions block from prose and keeps known actions", () => {
    const result = parseActions('Explicação.\n```actions\n[{"type":"plan_session","note":"25 min"},{"type":"invented"}]\n```');
    expect(result.prose).toBe("Explicação.");
    expect(result.actions).toEqual([{ type: "plan_session", note: "25 min" }]);
  });
  it("applies cards through the study service", () => {
    const source = addSource(freshIndex(), { kind: "stack", name: "Python" });
    const node = addNode(source.index, { sourceId: source.id, title: "Funções", kind: "concept", requires: [] });
    const result = applyAction(node.index, { [source.id]: freshLib(source.id) }, { type: "create_cards", sourceId: source.id, nodeId: node.id, cards: [{ frontMd: "Q", backMd: "A" }] });
    expect(result.index.cards).toHaveLength(1);
    expect(result.index.cards[0].frontMd).toBe("Q");
  });
});
