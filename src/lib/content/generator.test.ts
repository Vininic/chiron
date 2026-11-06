import { describe, expect, it } from "vitest";
import {
  continueDraft, draftProgress, draftViolations, newDraft, outlineIssues, parseAssessment, parseOutline, parseSection,
  sectionWords, withRetry, writeSection, type Chat, type GenOutline,
} from "./generator";
import { LABS } from "@/lib/labs/catalog";
import type { ChatMessage } from "@/lib/ai/providers";

const words = (n: number, word = "mecanismo") => Array.from({ length: n }, (_, i) => `${word}${i % 7}`).join(" ");

function sectionReply(proseWords: number, opts: { code?: number; tail?: boolean } = {}) {
  const code = Array.from({ length: opts.code ?? 2 }, (_, i) => `### CÓDIGO python | exemplo ${i + 1}\n\`\`\`python\nprint(${i})\n\`\`\``).join("\n");
  const tail = opts.tail === false ? "" : "\n### PORQUÊ\nPorque o tradeoff existe.\n### O QUE QUEBRA\nQuebra em produção assim.";
  return `### PROSA\n${words(proseWords)}\n${code}${tail}`;
}

function toolOutline(chapters = 8): GenOutline {
  return {
    name: "Regex", kind: "tool",
    chapters: Array.from({ length: chapters }, (_, i) => ({
      title: i === chapters - 1 ? "Armadilhas e diagnóstico" : `Capítulo ${i + 1}`,
      level: "intermediario",
      sections: Array.from({ length: 4 }, (_, j) => ({ title: `Seção ${i + 1}.${j + 1}`, goal: "entender" })),
    })),
  };
}

const assessmentReply = JSON.stringify({
  exercises: [
    { type: 1, prompt: "Qual casa?", choices: ["a", "b", "c", "d"], answer: "b" },
    { type: 2, prompt: "Por que lazy?", answer: "Porque evita backtracking.", rubric: "cita backtracking" },
    { type: 3, prompt: "Ache o risco: `(a+)+`", answer: "Backtracking catastrófico." },
  ],
  cards: [1, 2, 3, 4].map((i) => ({ front: `F${i}`, back: `B${i}` })),
});

/** Answers by recognizing which prompt it got — no network. */
function fakeChat(sectionWordsFirst = 700): Chat & { calls: string[] } {
  const calls: string[] = [];
  const chat = (async (messages: ChatMessage[]) => {
    const text = messages[messages.length - 1].content;
    if (text.includes("Crie 3 exercícios")) { calls.push("assessment"); return assessmentReply; }
    if (text.includes("Escreva uma continuação")) { calls.push("expand"); return words(300, "detalhe"); }
    if (text.includes("Escreva apenas")) { calls.push("repair"); return sectionReply(0, {}).replace("### PROSA\n\n", ""); }
    calls.push("section"); return sectionReply(sectionWordsFirst);
  }) as Chat & { calls: string[] };
  chat.calls = calls;
  return chat;
}

describe("outline", () => {
  it("parses the AI's JSON and keeps a valid lab choice for stacks", () => {
    const draft = newDraft("Rust", "stack");
    const raw = "```json\n" + JSON.stringify({ name: "Rust", chapters: [{ title: "Ownership", level: "basico", sections: [{ title: "Move", goal: "x" }] }], lab: "ophis/tick-fila" }) + "\n```";
    const outline = parseOutline(raw, draft, LABS);
    expect("error" in outline).toBe(false);
    if ("error" in outline) return;
    expect(outline.lab).toEqual({ labId: "ophis", layerId: "tick-fila" });
    expect(outline.chapters[0].sections[0].title).toBe("Move");
  });

  it("replaces an invented lab with a real one instead of linking nowhere", () => {
    const outline = parseOutline(JSON.stringify({ chapters: [{ title: "A", level: "basico", sections: [] }], lab: "nada/x" }), newDraft("Go", "stack"), LABS);
    if ("error" in outline) throw new Error(outline.error);
    expect(LABS.some((lab) => lab.id === outline.lab?.labId)).toBe(true);
  });

  it("reports what keeps an outline from ever becoming publishable", () => {
    const short = toolOutline(3);
    short.chapters[0].title = "Sem riscos";
    short.chapters[2].title = "Também não";
    const issues = outlineIssues(short);
    expect(issues.some((i) => i.includes("mínimo"))).toBe(true);
    expect(issues.some((i) => i.includes("Armadilhas"))).toBe(true);
    expect(outlineIssues(toolOutline())).toEqual([]);
  });
});

describe("section parsing", () => {
  it("reads every marked part", () => {
    const parsed = parseSection(sectionReply(650));
    expect(parsed.missing).toEqual([]);
    expect(parsed.section.code).toHaveLength(2);
    expect(parsed.section.code[0]).toMatchObject({ lang: "python", caption: "exemplo 1", code: "print(0)" });
    expect(sectionWords(parsed.section)).toBe(650);
  });

  it("keeps what arrived when the reply was cut off", () => {
    const parsed = parseSection(sectionReply(650, { code: 1, tail: false }));
    expect(parsed.section.prose).not.toBe("");
    expect(parsed.missing).toEqual(["code", "porque", "quebraria"]);
  });
});

describe("writeSection", () => {
  it("expands a section that came back under the 600-word floor", async () => {
    const chat = fakeChat(420);
    const state = await writeSection(chat, toolOutline(), 0, 0);
    expect(state.status).toBe("done");
    expect(state.words).toBeGreaterThanOrEqual(600);
    expect(chat.calls).toEqual(["section", "expand"]);
  });

  it("fills missing parts with a targeted repair call", async () => {
    const chat = (async (messages: ChatMessage[]) => {
      const text = messages[messages.length - 1].content;
      return text.includes("Escreva apenas") ? sectionReply(0).replace(/### PROSA\n[^\n]*\n/, "") : sectionReply(700, { code: 0, tail: false });
    }) as Chat;
    const state = await writeSection(chat, toolOutline(), 0, 0);
    expect(state.status).toBe("done");
    expect(state.result?.code).toHaveLength(2);
  });

  it("records a failure instead of throwing", async () => {
    const state = await writeSection(async () => { throw new Error("429"); }, toolOutline(), 0, 0);
    expect(state).toMatchObject({ status: "failed", error: "429" });
  });
});

describe("withRetry", () => {
  it("retries transient errors and gives up on permanent ones", async () => {
    let calls = 0;
    const flaky = withRetry(async () => { calls++; if (calls < 3) throw new Error("Gemini error 503: high demand"); return "ok"; }, [0, 0, 0], async () => {});
    expect(await flaky([])).toBe("ok");
    expect(calls).toBe(3);

    let badCalls = 0;
    const bad = withRetry(async () => { badCalls++; throw new Error("401 invalid key"); }, [0, 0], async () => {});
    await expect(bad([])).rejects.toThrow("401");
    expect(badCalls).toBe(1);
  });
});

describe("assessments", () => {
  it("drops a multiple-choice item whose answer is not one of its choices", () => {
    const chapter = toolOutline().chapters[0];
    const bad = JSON.parse(assessmentReply);
    bad.exercises[0].answer = "z";
    expect("error" in parseAssessment(JSON.stringify(bad), chapter)).toBe(true);
    const good = parseAssessment(assessmentReply, chapter);
    if ("error" in good) throw new Error(good.error);
    expect(good.exercises.map((e) => e.type)).toEqual([1, 2, 3]);
    expect(good.exercises[1].rubricMd).toBe("cita backtracking");
  });
});

describe("continueDraft", () => {
  it("writes every section and chapter, and the result passes the contract", async () => {
    const draft = { ...newDraft("Regex", "tool"), outline: toolOutline() };
    const updates: number[] = [];
    const done = await continueDraft(fakeChat(), draft, (d) => updates.push(draftProgress(d).sectionsDone));
    const progress = draftProgress(done);
    expect(progress).toEqual({ sectionsDone: 32, sectionsTotal: 32, chaptersAssessed: 8, chaptersTotal: 8 });
    expect(updates.length).toBe(40);
    expect(draftViolations(done)).toEqual([]);
  });

  it("resumes without redoing finished sections", async () => {
    const draft = { ...newDraft("Regex", "tool"), outline: toolOutline() };
    const first = fakeChat();
    const controller = new AbortController();
    let steps = 0;
    const partial = await continueDraft(first, draft, () => { if (++steps === 5) controller.abort(); }, controller.signal);
    expect(draftProgress(partial).sectionsDone).toBe(5);
    const second = fakeChat();
    await continueDraft(second, partial, () => {});
    expect(second.calls.filter((c) => c === "section")).toHaveLength(27);
  });
});
