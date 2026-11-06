import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource } from "@/lib/content/contract";
import { checkEditorialSource } from "@/lib/content/editorial";
import { readingBarViolations } from "@/lib/content/readingBar";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { POSTGRESQL_CONTENT } from "./postgresql";

const { index, lib } = applyContentSource(freshIndex(), POSTGRESQL_CONTENT);

describe.each(POSTGRESQL_CONTENT.chapters.map((c) => [c.title, c] as const))("PostgreSQL — %s", (_t, chapter) => {
  it("cada seção tem ao menos 600 palavras de prosa", () => {
    const thin = chapter.sections.map((s) => [s.title, proseWordCount(s.blocks)] as const).filter(([, w]) => w < 600);
    expect(thin).toEqual([]);
  });

  it("passa o contrato do capítulo", () => {
    expect(checkChapter(lib.chapters.find((c) => c.title === chapter.title)!, lib, index)).toEqual([]);
  });

  it("todo SQL roda num PostgreSQL real", () => {
    const snippets = chapter.sections.flatMap((s) => s.blocks).filter((b) => b.kind === "code" && b.lang === "sql").map((b) => (b as { code: string }).code);
    const run = spawnSync("node", ["scripts/run-pg-snippets.mjs"], { input: JSON.stringify({ snippets }), encoding: "utf8", timeout: 120_000 });
    expect(run.status, run.stderr || run.stdout).toBe(0);
  }, 130_000);
});

describe("PostgreSQL — apostila completa", () => {
  it("passa o contrato da fonte, a auditoria editorial e a régua de leitura", () => {
    expect(checkSource(index.sources[0], lib, index)).toEqual([]);
    expect(checkEditorialSource(POSTGRESQL_CONTENT)).toEqual([]);
    expect(readingBarViolations(POSTGRESQL_CONTENT)).toEqual([]);
  });

  it("termina num integrador ligado a uma camada real do Lab Ágora", () => {
    expect(lib.sections.some((s) => s.blocks.some((b) => b.kind === "labref" && b.labId === "agora" && b.layerId === "reserva-estoque-concorrencia"))).toBe(true);
  });
});
