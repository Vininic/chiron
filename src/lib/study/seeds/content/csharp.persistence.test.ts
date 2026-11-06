import { spawn } from "node:child_process";
import { expect, it } from "vitest";
import { CSHARP_CURRICULUM } from "./csharpCurriculum";
import { CSHARP_EXAMPLES } from "./csharpExamples";

const verifyPersistence = process.env.CHIRON_VERIFY_CSHARP_PERSISTENCE === "1" ? it : it.skip;

verifyPersistence("C# persistência — oito programas ADO.NET/EF Core executam com SQLite relacional real", async () => {
  const snippets = CSHARP_CURRICULUM[7][3].flatMap(([title]) => CSHARP_EXAMPLES[title]);
  const child = spawn("node", ["scripts/check-csharp-persistence.mjs"], {
    cwd: process.cwd(), stdio: ["pipe", "pipe", "pipe"],
  });
  let stdout = "", stderr = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
  child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
  child.stdin.end(JSON.stringify({ snippets }));
  const code = await new Promise<number | null>((resolve, reject) => {
    child.on("error", reject); child.on("close", resolve);
  });
  expect(code, stderr || stdout).toBe(0);
}, 180_000);
