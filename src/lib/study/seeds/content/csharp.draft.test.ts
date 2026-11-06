import { spawn } from "node:child_process";
import { expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { prose } from "./types";
import { CSHARP_AUTHORED_PROSE } from "./csharpAuthoredProse";
import { CSHARP_CURRICULUM } from "./csharpCurriculum";
import { CSHARP_EXAMPLES } from "./csharpExamples";

it("C# draft — currículo de 12 capítulos/48 seções únicas e piso nas seções escritas", () => {
  const titles = CSHARP_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title));
  expect(CSHARP_CURRICULUM).toHaveLength(12);
  expect(titles).toHaveLength(48);
  expect(new Set(titles).size).toBe(48);
  expect(Object.keys(CSHARP_AUTHORED_PROSE).filter((title) => !titles.includes(title))).toEqual([]);
  expect(Object.keys(CSHARP_EXAMPLES).sort()).toEqual(Object.keys(CSHARP_AUTHORED_PROSE).sort());
  const low = Object.entries(CSHARP_AUTHORED_PROSE)
    .map(([title, lines]) => ({ title, words: proseWordCount([prose(lines)]) }))
    .filter(({ words }) => words < 600);
  expect(low).toEqual([]);
});

const verifyCSharp = process.env.CHIRON_VERIFY_CSHARP_SNIPPETS === "1" ? it : it.skip;

verifyCSharp("C# draft — os 55 programas dos sete primeiros capítulos compilam e executam no .NET 8 real", async () => {
  const snippets = CSHARP_CURRICULUM.slice(0, 7).flatMap(([, , , lessons]) => lessons.flatMap(([title]) => CSHARP_EXAMPLES[title]));
  const child = spawn("node", ["scripts/check-csharp-snippets.mjs"], { cwd: process.cwd(), stdio: ["pipe", "pipe", "pipe"] });
  let stdout = "", stderr = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
  child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
  child.stdin.end(JSON.stringify({ snippets }));
  const code = await new Promise<number | null>((resolve, reject) => { child.on("error", reject); child.on("close", resolve); });
  expect(code, stderr || stdout).toBe(0);
}, 120_000);
