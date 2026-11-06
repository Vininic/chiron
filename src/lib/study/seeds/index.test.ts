import { beforeAll, describe, it, expect } from "vitest";
import { runSeed } from "./index";

describe("seed", () => {
  let seeded: ReturnType<typeof runSeed>;

  beforeAll(() => {
    seeded = runSeed();
  }, 30_000);

  it("runs without error and produces content", () => {
    const { index, libs } = seeded;
    expect(index.sources.length).toBeGreaterThan(0);
    expect(index.nodes.length).toBeGreaterThan(0);
    expect(index.cards.length).toBeGreaterThan(0);
    expect(Object.keys(libs).length).toBe(index.sources.length);
  });

  it("each source has corresponding lib", () => {
    const { index, libs } = seeded;
    for (const src of index.sources) {
      expect(libs[src.id]).toBeDefined();
      expect(libs[src.id].sourceId).toBe(src.id);
    }
  });

  it("publishes Ubuntu / Linux once, after Oracle Cloud, as a complete source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="Ubuntu / Linux");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([12,48,36,48]);
    expect(index.sources.findIndex(source=>source.name==="Ubuntu / Linux")).toBeGreaterThan(index.sources.findIndex(source=>source.name==="Oracle Cloud"));
  });

  it("publishes N8N once, immediately after Ubuntu / Linux, as a complete source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="N8N");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([12,48,36,48]);
    expect(book.sections.flatMap(section=>section.blocks).filter(block=>block.kind==="code")).toHaveLength(96);
    expect(index.sources.findIndex(source=>source.name==="N8N")).toBe(index.sources.findIndex(source=>source.name==="Ubuntu / Linux")+1);
  });

  it("publishes Figma once, immediately after N8N, as a complete tool source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="Figma");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    expect(matches[0].kind).toBe("tool");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([12,48,36,48]);
    expect(book.sections.flatMap(section=>section.blocks).filter(block=>block.kind==="code")).toHaveLength(96);
    expect(index.sources.findIndex(source=>source.name==="Figma")).toBe(index.sources.findIndex(source=>source.name==="N8N")+1);
  });

  it("publishes Pacote Office once, immediately after Figma, as a complete tool source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="Pacote Office");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    expect(matches[0].kind).toBe("tool");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([13,52,39,65]);
    expect(book.sections.flatMap(section=>section.blocks).filter(block=>block.kind==="code")).toHaveLength(295);
    expect(index.sources.findIndex(source=>source.name==="Pacote Office")).toBe(index.sources.findIndex(source=>source.name==="Figma")+1);
  });

  it("publishes Integração de IA (LLM) once, immediately after Pacote Office, as a complete tool source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="Integração de IA (LLM)");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    expect(matches[0].kind).toBe("tool");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([12,48,36,48]);
    expect(book.sections.flatMap(section=>section.blocks).filter(block=>block.kind==="code")).toHaveLength(96);
    expect(index.sources.findIndex(source=>source.name==="Integração de IA (LLM)")).toBe(index.sources.findIndex(source=>source.name==="Pacote Office")+1);
  });

  it("publishes Cursor once, immediately after LLM, as a complete tool source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="Cursor");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    expect(matches[0].kind).toBe("tool");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([12,48,36,48]);
    expect(book.sections.flatMap(section=>section.blocks).filter(block=>block.kind==="code")).toHaveLength(96);
    expect(index.sources.findIndex(source=>source.name==="Cursor")).toBe(index.sources.findIndex(source=>source.name==="Integração de IA (LLM)")+1);
  });

  it("publishes Claude Code once, immediately after Cursor, as a complete tool source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="Claude Code");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    expect(matches[0].kind).toBe("tool");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([12,48,36,48]);
    expect(book.sections.flatMap(section=>section.blocks).filter(block=>block.kind==="code")).toHaveLength(96);
    expect(index.sources.findIndex(source=>source.name==="Claude Code")).toBe(index.sources.findIndex(source=>source.name==="Cursor")+1);
  });

  it("publishes GitHub Copilot once, immediately after Claude Code, as a complete tool source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="GitHub Copilot");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    expect(matches[0].kind).toBe("tool");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([12,48,36,48]);
    expect(book.sections.flatMap(section=>section.blocks).filter(block=>block.kind==="code")).toHaveLength(96);
    expect(index.sources.findIndex(source=>source.name==="GitHub Copilot")).toBe(index.sources.findIndex(source=>source.name==="Claude Code")+1);
  });

  it("publishes OpenCode once, immediately after GitHub Copilot, as a complete tool source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="OpenCode");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    expect(matches[0].kind).toBe("tool");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([12,48,36,60]);
    expect(book.sections.flatMap(section=>section.blocks).filter(block=>block.kind==="code")).toHaveLength(308);
    expect(index.sources.findIndex(source=>source.name==="OpenCode")).toBe(index.sources.findIndex(source=>source.name==="GitHub Copilot")+1);
  });

  it("publishes Lovable once, immediately after OpenCode, as a complete tool source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="Lovable");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    expect(matches[0].kind).toBe("tool");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([12,48,36,48]);
    expect(book.sections.flatMap(section=>section.blocks).filter(block=>block.kind==="code")).toHaveLength(96);
    expect(index.sources.findIndex(source=>source.name==="Lovable")).toBe(index.sources.findIndex(source=>source.name==="OpenCode")+1);
  });

  it("publishes Google AI Studio once, immediately after Lovable, as a complete tool source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="Google AI Studio");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    expect(matches[0].kind).toBe("tool");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([12,48,36,48]);
    expect(book.sections.flatMap(section=>section.blocks).filter(block=>block.kind==="code")).toHaveLength(96);
    expect(index.sources.findIndex(source=>source.name==="Google AI Studio")).toBe(index.sources.findIndex(source=>source.name==="Lovable")+1);
  });

  it("publishes jQuery once, immediately after Google AI Studio, as a complete stack source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="jQuery");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    expect(matches[0].kind).toBe("stack");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([13,52,39,55]);
    expect(book.sections.flatMap(section=>section.blocks).filter(block=>block.kind==="code")).toHaveLength(250);
    expect(index.sources.findIndex(source=>source.name==="jQuery")).toBe(index.sources.findIndex(source=>source.name==="Google AI Studio")+1);
  });

  it("publishes Chiron once, immediately after jQuery, as a complete repo source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="Chiron");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    expect(matches[0].kind).toBe("repo");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([12,48,36,48]);
    expect(book.sections.flatMap(section=>section.blocks).filter(block=>block.kind==="code")).toHaveLength(96);
    expect(index.sources.findIndex(source=>source.name==="Chiron")).toBe(index.sources.findIndex(source=>source.name==="jQuery")+1);
  });

  it("publishes Olympus once, immediately after Chiron, as a complete repo source", () => {
    const { index, libs } = seeded;
    const matches=index.sources.filter(source=>source.name==="Olympus");
    expect(matches).toHaveLength(1);
    expect(matches[0].contentOrigin).toBe("built_in");
    expect(matches[0].kind).toBe("repo");
    const book=libs[matches[0].id];
    expect([book.chapters.length,book.sections.length,book.exercises.length,index.cards.filter(card=>card.sourceId===matches[0].id).length]).toEqual([12,48,36,48]);
    expect(book.sections.flatMap(section=>section.blocks).filter(block=>block.kind==="code")).toHaveLength(96);
    expect(index.sources.findIndex(source=>source.name==="Olympus")).toBe(index.sources.findIndex(source=>source.name==="Chiron")+1);
    expect(index.sources.filter(source=>["Chronos","Kairos","Pluto","Hermes"].includes(source.name))).toEqual([]);
  });

  it("every card has a valid nodeId", () => {
    const { index } = seeded;
    const nodeIds = new Set(index.nodes.map((n) => n.id));
    for (const card of index.cards) {
      expect(nodeIds.has(card.nodeId)).toBe(true);
    }
  });

  it("every section has a valid nodeId", () => {
    const { index, libs } = seeded;
    const nodeIds = new Set(index.nodes.map((n) => n.id));
    for (const lib of Object.values(libs)) {
      for (const sec of lib.sections) {
        expect(nodeIds.has(sec.nodeId)).toBe(true);
      }
    }
  });

  it("every exercise has a valid nodeId", () => {
    const { index, libs } = seeded;
    const nodeIds = new Set(index.nodes.map((n) => n.id));
    for (const lib of Object.values(libs)) {
      for (const ex of lib.exercises) {
        expect(nodeIds.has(ex.nodeId)).toBe(true);
      }
    }
  });
});
