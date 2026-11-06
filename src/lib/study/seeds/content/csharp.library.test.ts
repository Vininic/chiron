import { spawn } from "node:child_process";
import { expect, it } from "vitest";
import { CSHARP_CURRICULUM } from "./csharpCurriculum";
import { CSHARP_EXAMPLES } from "./csharpExamples";

const verifyLibrary = process.env.CHIRON_VERIFY_CSHARP_LIBRARY === "1" ? it : it.skip;

verifyLibrary("C# bibliotecas — oito programas de API, reflection, interop e ownership compilam e executam", async () => {
  const snippets = CSHARP_CURRICULUM[10][3].flatMap(([title]) => CSHARP_EXAMPLES[title]);
  const child = spawn("node", ["scripts/check-csharp-security.mjs"], {
    cwd: process.cwd(), stdio: ["pipe", "pipe", "pipe"],
  });
  let stdout = "", stderr = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
  child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
  child.stdin.end(JSON.stringify({ snippets, allowUnsafeBlocks: true }));
  const code = await new Promise<number | null>((resolve, reject) => {
    child.on("error", reject); child.on("close", resolve);
  });
  expect(code, stderr || stdout).toBe(0);
}, 180_000);
