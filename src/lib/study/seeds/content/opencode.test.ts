// Every example runs with the installed `opencode` (1.18.x), in a temporary
// project and an isolated home: the output blocks must match what the program
// prints, and "modelo falso" sections talk to a local server that records what
// OpenCode sends to the model. See scripts/run-opencode-snippets.mjs.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { defineBookGates, snippetsBySection } from "./bookGates";
import { OPENCODE_CONTENT } from "./opencode";

defineBookGates(OPENCODE_CONTENT, { runner: "scripts/run-opencode-snippets.mjs", snippetsOf: snippetsBySection });

// The scripts the book builds are the ones the runner supplies to later sections.
describe("OpenCode — scripts do livro e cópias canônicas", () => {
  const codigoDe = (legenda: string) =>
    OPENCODE_CONTENT.chapters.flatMap((c) => c.sections).flatMap((s) => s.blocks)
      .flatMap((b) => (b.kind === "code" && (b.caption ?? "").startsWith(legenda) ? [b.code] : []));
  const arquivo = (nome: string) => readFileSync(resolve("scripts/opencode", nome), "utf8").replace(/\r?\n$/, "");

  it.each([
    ["ver-pedido.mjs:", "ver-pedido.mjs"],
    ["modelo-falso.mjs: a versão que segue um roteiro", "modelo-falso.mjs"],
    ["mcp-calc.mjs:", "mcp-calc.mjs"],
  ])("o bloco %s é igual ao arquivo %s", (legenda, nome) => {
    const blocos = codigoDe(legenda);
    expect(blocos).toHaveLength(1);
    expect(blocos[0]).toBe(arquivo(nome));
  });
});
