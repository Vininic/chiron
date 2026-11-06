import { spawn } from "node:child_process";
import { expect, it } from "vitest";
import { CSHARP_CURRICULUM } from "./csharpCurriculum";
import { CSHARP_EXAMPLES } from "./csharpExamples";

const verifyRuntime = process.env.CHIRON_VERIFY_CSHARP_RUNTIME === "1" ? it : it.skip;

verifyRuntime("C# runtime — oito programas de GC, publish, health e rollback executam no .NET 8", async () => {
  const snippets = CSHARP_CURRICULUM[9][3].flatMap(([title]) => CSHARP_EXAMPLES[title]);
  const child = spawn("node", ["scripts/check-csharp-security.mjs"], {
    cwd: process.cwd(), stdio: ["pipe", "pipe", "pipe"],
  });
  let stdout = "", stderr = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
  child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
  child.stdin.end(JSON.stringify({ snippets, publishIndex: 3 }));
  const code = await new Promise<number | null>((resolve, reject) => {
    child.on("error", reject); child.on("close", resolve);
  });
  expect(code, stderr || stdout).toBe(0);
}, 180_000);
