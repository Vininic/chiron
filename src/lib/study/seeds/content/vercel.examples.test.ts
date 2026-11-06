import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import vm from "node:vm";
import { expect, it } from "vitest";
import { VERCEL_EXAMPLES } from "./vercelExamples";

const examples = Object.values(VERCEL_EXAMPLES).flat();

it("Vercel examples — JSON.parse real", () => {
  for (const example of examples.filter(({ lang }) => lang === "json")) expect(() => JSON.parse(example.code)).not.toThrow();
});

it("Vercel examples — parser JavaScript real", () => {
  for (const example of examples.filter(({ lang }) => lang === "javascript")) expect(() => new vm.Script(example.code)).not.toThrow();
});

it("Vercel examples — bash -n real", () => {
  const bash = "C:\\Program Files\\Git\\bin\\bash.exe";
  if (!existsSync(bash)) throw new Error("Git Bash não encontrado");
  const dir = mkdtempSync(join(tmpdir(), "chiron-vercel-"));
  try {
    const scripts = examples.filter(({ lang }) => lang === "bash");
    scripts.forEach((example, index) => writeFileSync(join(dir, `${index}.sh`), example.code));
    for (let index = 0; index < scripts.length; index += 1) execFileSync(bash, ["-n", join(dir, `${index}.sh`)]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
