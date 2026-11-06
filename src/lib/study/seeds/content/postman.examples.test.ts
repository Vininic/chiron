import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { POSTMAN_EXAMPLES } from "./postmanExamples";

const examples = Object.entries(POSTMAN_EXAMPLES).flatMap(([title, values]) =>
  values.map((value, index) => ({ title, index: index + 1, ...value })),
);
const gitBash = "C:\\Program Files\\Git\\bin\\bash.exe";
const bashExecutable = process.platform === "win32" && existsSync(gitBash) ? gitBash : "bash";

describe("Postman examples — gates locais honestos", () => {
  it("analisa artifacts JSON com JSON.parse real", () => {
    const failures = examples.filter(({ lang }) => lang === "json").flatMap((example) => {
      try { JSON.parse(example.code); return []; }
      catch (error) { return [`${example.title} #${example.index}: ${(error as Error).message}`]; }
    });
    expect(failures).toEqual([]);
  });

  it("analisa scripts Sandbox como JavaScript real", () => {
    const failures = examples.filter(({ lang }) => lang === "javascript").flatMap((example) => {
      try { new vm.Script(example.code, { filename: `${example.title}-${example.index}.js` }); return []; }
      catch (error) { return [`${example.title} #${example.index}: ${(error as Error).message}`]; }
    });
    expect(failures).toEqual([]);
  });

  it("analisa scripts Bash com bash -n real", () => {
    const scripts = examples.filter(({ lang }) => lang === "bash");
    const combined = scripts.map((example) => `\n# --- ${example.title} #${example.index}\n${example.code}\n`).join("\n");
    const result = spawnSync(bashExecutable, ["-n"], { input: combined, encoding: "utf8", timeout: 30_000 });
    expect(result.status, result.error?.message ?? result.stderr).toBe(0);
  }, 30_000);
});
