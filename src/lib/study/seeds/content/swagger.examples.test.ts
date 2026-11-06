import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { SWAGGER_EXAMPLES } from "./swaggerExamples";

const examples = Object.entries(SWAGGER_EXAMPLES).flatMap(([title, values]) =>
  values.map((value, index) => ({ title, index: index + 1, ...value })),
);
const gitBash = "C:\\Program Files\\Git\\bin\\bash.exe";
const bashExecutable = process.platform === "win32" && existsSync(gitBash) ? gitBash : "bash";

describe("Swagger examples — gates locais honestos", () => {
  it("analisa todos os exemplos TypeScript com o parser TypeScript real", () => {
    const snippets = examples.filter((example) => example.lang === "typescript");
    expect(snippets.length).toBeGreaterThan(0);
    const failures = snippets.flatMap((snippet) => {
      const result = ts.transpileModule(snippet.code, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, strict: true },
        fileName: `swagger-${snippet.title}-${snippet.index}.ts`,
        reportDiagnostics: true,
      });
      return (result.diagnostics ?? [])
        .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)
        .map((diagnostic) => `${snippet.title} #${snippet.index}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
    });
    expect(failures).toEqual([]);
  });

  it("analisa todos os exemplos JSON com JSON.parse real", () => {
    const snippets = examples.filter((example) => example.lang === "json");
    expect(snippets.length).toBeGreaterThan(0);
    const failures = snippets.flatMap((snippet) => {
      try {
        JSON.parse(snippet.code);
        return [];
      } catch (error) {
        return [`${snippet.title} #${snippet.index}: ${(error as Error).message}`];
      }
    });
    expect(failures).toEqual([]);
  });

  it("analisa todos os exemplos Bash com bash -n real", () => {
    const snippets = examples.filter((example) => example.lang === "bash");
    expect(snippets.length).toBeGreaterThan(0);
    const combined = snippets.map((snippet) => `\n# --- ${snippet.title} #${snippet.index}\n${snippet.code}\n`).join("\n");
    const batch = spawnSync(bashExecutable, ["-n"], { input: combined, encoding: "utf8", timeout: 30_000 });
    const failures = batch.status === 0
      ? []
      : snippets.flatMap((snippet) => {
          const result = spawnSync(bashExecutable, ["-n"], { input: snippet.code, encoding: "utf8", timeout: 30_000 });
          return result.status === 0
            ? []
            : [`${snippet.title} #${snippet.index}: ${result.error?.message ?? result.stderr.trim() ?? `exit ${result.status}`}`];
        });
    expect(failures).toEqual([]);
  }, 30_000);

  it("mantém YAML explicitamente fora do gate enquanto não existe parser OpenAPI no workspace", () => {
    const languages = new Set(examples.map((example) => example.lang));
    expect([...languages].sort()).toEqual(["bash", "json", "typescript", "yaml"]);
    expect(examples.filter((example) => example.lang === "yaml").length).toBeGreaterThan(0);
  });
});
