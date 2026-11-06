import { spawn } from "node:child_process";
import { expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { prose } from "./types";
import { JAVA_AUTHORED_PROSE } from "./javaAuthoredProse";
import { JAVA_CURRICULUM } from "./javaCurriculum";
import { JAVA_EXAMPLES } from "./javaExamples";

it("Java draft — toda seção já autorizada possui 600 palavras próprias", () => {
  const low = Object.entries(JAVA_AUTHORED_PROSE)
    .map(([title, lines]) => ({ title, words: proseWordCount([prose(lines)]) }))
    .filter(({ words }) => words < 600);
  if (low.length) throw new Error(JSON.stringify(low));
});

it("Java draft — prosa e exemplos avançam sem chaves órfãs", () => {
  const planned = new Set(JAVA_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title)));
  expect(Object.keys(JAVA_AUTHORED_PROSE).filter((title) => !planned.has(title))).toEqual([]);
  expect(Object.keys(JAVA_EXAMPLES).filter((title) => !JAVA_AUTHORED_PROSE[title])).toEqual([]);
  expect(Object.keys(JAVA_AUTHORED_PROSE).filter((title) => !JAVA_EXAMPLES[title])).toEqual([]);
});

async function checkJavaSnippets(snippets: { title: string; code: string }[]) {
  const child = spawn("node", ["scripts/check-java-snippets.mjs"], { cwd: process.cwd(), stdio: ["pipe", "pipe", "pipe"] });
  let stdout = "", stderr = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
  child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
  child.stdin.end(JSON.stringify({ snippets, expectedCount: snippets.length }));
  const code = await new Promise<number | null>((resolve, reject) => { child.on("error", reject); child.on("close", resolve); });
  expect(code, stderr || stdout).toBe(0);
}

// Real JDK verification runs as a dedicated gate. Running 96 javac/java pairs
// alongside the full Vitest suite can saturate worker RPC on Windows even
// when every assertion passes; the separate gate remains mandatory for release.
for (const [chapter, , , lessons] of JAVA_CURRICULUM) {
  it.skipIf(process.env.CHIRON_VERIFY_JAVA_SNIPPETS !== "1")(`Java draft — ${chapter}: compila e executa os exemplos no JDK real`, async () => {
    const snippets = lessons.flatMap(([title]) => (JAVA_EXAMPLES[title] ?? []).map((code) => ({ title, code })));
    expect(snippets.length).toBeGreaterThan(0);
    await checkJavaSnippets(snippets);
  }, 60_000);
}
