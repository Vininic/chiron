// Shared publication gates for rewritten books (PLANO.md §R.2), imported only
// by test files. Every chapter must reach the prose floor and pass its
// contract; the whole source must pass the source contract, the editorial
// audit and the reading bar; and the examples must run on the real tool,
// through a runner script that reads { snippets } from stdin.
import { spawn } from "node:child_process";
import { describe, expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource } from "@/lib/content/contract";
import { checkEditorialSource } from "@/lib/content/editorial";
import { readingBarViolations } from "@/lib/content/readingBar";
import { freshIndex } from "@/lib/study/migrate";
import { LABS } from "@/lib/labs/catalog";
import { applyContentSource } from "./materialize";
import type { ContentChapter, ContentSource } from "./types";

export interface BookGateOptions {
  /** Runner under scripts/ that executes the snippets of one chapter. */
  runner: string;
  /** Turns a chapter into the runner's snippet payload. */
  snippetsOf: (chapter: ContentChapter) => unknown[];
  /** Only gate chapters (while a book is still being written). */
  partial?: boolean;
}

export function defineBookGates(content: ContentSource, options: BookGateOptions) {
  const { index, lib } = applyContentSource(freshIndex(), content);

  describe.each(content.chapters.map((c) => [c.title, c] as const))(`${content.name} — %s`, (_t, chapter) => {
    it("cada seção tem ao menos 600 palavras de prosa", () => {
      const thin = chapter.sections.map((s) => [s.title, proseWordCount(s.blocks)] as const).filter(([, w]) => w < 600);
      expect(thin).toEqual([]);
    });

    it("passa o contrato do capítulo", () => {
      expect(checkChapter(lib.chapters.find((c) => c.title === chapter.title)!, lib, index)).toEqual([]);
    });

    it("não narra a verificação", () => {
      expect(readingBarViolations({ ...content, chapters: [chapter] })).toEqual([]);
    });

    it("os exemplos rodam na ferramenta real", async () => {
      const run = await runNode(options.runner, JSON.stringify({ snippets: options.snippetsOf(chapter) }), 400_000);
      expect(run.status, run.stderr || run.stdout).toBe(0);
    }, 410_000);
  });

  if (options.partial) return;

  describe(`${content.name} — fonte completa`, () => {
    it("passa o contrato da fonte e a auditoria editorial", () => {
      expect(checkSource(index.sources[0], lib, index)).toEqual([]);
      expect(checkEditorialSource(content)).toEqual([]);
    });

    it("toda ponte para laboratório aponta para uma camada que existe", () => {
      const layers = new Set(LABS.flatMap((lab) => lab.layers.map((layer) => `${lab.id}/${layer.id}`)));
      const refs = content.chapters.flatMap((c) => c.sections).flatMap((s) => s.blocks)
        .flatMap((b) => (b.kind === "labref" ? [`${b.labId}/${b.layerId}`] : []));
      expect(refs.filter((r) => !layers.has(r))).toEqual([]);
    });
  });
}

/** Snippet payload for runners that build one project per section
 *  (scripts/run-vite-snippets.mjs): { lang, code, section }. */
export function snippetsBySection(chapter: ContentChapter) {
  // the integrator chapter (the one bridging to a lab) builds one project
  // across its sections: later sections see the files of earlier ones
  const accumulate = chapter.sections.some((s) => s.blocks.some((b) => b.kind === "labref"));
  return chapter.sections.flatMap((section, index) =>
    section.blocks.flatMap((b) => (b.kind === "code" ? [{ lang: b.lang, code: b.code, caption: b.caption, section: index, accumulate }] : [])));
}

/** Snippet payload for runners that take { lang, code, context }, where
 *  context is the CSS of the same section (Tailwind themes, for instance). */
export function snippetsWithSectionCss(chapter: ContentChapter) {
  return chapter.sections.flatMap((section) => {
    const code = section.blocks.filter((b): b is Extract<typeof b, { kind: "code" }> => b.kind === "code");
    // v3 examples (migration chapters) are checked against v3, never as v4 context
    const context = code.filter((b) => b.lang === "css" && !/^\s*\/\*\s*Tailwind v3\b/.test(b.code)).map((b) => b.code).join("\n");
    return code.map((b) => ({ lang: b.lang, code: b.code, context }));
  });
}

// Assíncrono para não travar o event loop do worker: com spawnSync, uma
// execução longa estoura a RPC do Vitest ("Timeout calling onTaskUpdate").
function runNode(script: string, input: string, timeout: number): Promise<{ status: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn("node", [script], { timeout });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (d: string) => (stdout += d));
    child.stderr.setEncoding("utf8").on("data", (d: string) => (stderr += d));
    child.on("close", (status) => resolve({ status, stdout, stderr }));
    child.stdin.end(input);
  });
}
