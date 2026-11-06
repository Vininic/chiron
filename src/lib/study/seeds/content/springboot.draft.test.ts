import { spawn } from "node:child_process";
import { expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { prose } from "./types";
import { SPRING_BOOT_AUTHORED_PROSE } from "./springbootAuthoredProse";
import { SPRING_BOOT_CURRICULUM } from "./springbootCurriculum";
import { SPRING_BOOT_EXAMPLES } from "./springbootExamples";

it("Spring Boot draft — toda seção redigida tem no mínimo 600 palavras próprias", () => {
  const low = Object.entries(SPRING_BOOT_AUTHORED_PROSE)
    .map(([title, lines]) => ({ title, words: proseWordCount([prose(lines)]) }))
    .filter(({ words }) => words < 600);
  if (low.length) throw new Error(JSON.stringify(low));
});

it("Spring Boot draft — texto e dois exemplos avançam juntos, sem chaves órfãs", () => {
  const titles = new Set(SPRING_BOOT_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title)));
  expect(Object.keys(SPRING_BOOT_AUTHORED_PROSE).filter((title) => !titles.has(title))).toEqual([]);
  expect(Object.keys(SPRING_BOOT_EXAMPLES).sort()).toEqual(Object.keys(SPRING_BOOT_AUTHORED_PROSE).sort());
  expect(Object.values(SPRING_BOOT_EXAMPLES).every((examples) => examples.length === 2 && examples.every((example) => example.code.trim() && example.purpose.trim()))).toBe(true);
});

it("Spring Boot draft — o JDK analisa a sintaxe Java 21 dos exemplos já redigidos", async () => {
  const snippets = Object.values(SPRING_BOOT_EXAMPLES).flat();
  const child = spawn("node", ["scripts/check-springboot-syntax.mjs"], { cwd: process.cwd(), stdio: ["pipe", "pipe", "pipe"] });
  let stdout = "", stderr = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
  child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
  child.stdin.end(JSON.stringify({ snippets }));
  const code = await new Promise<number | null>((resolve, reject) => { child.on("error", reject); child.on("close", resolve); });
  expect(code, stderr || stdout).toBe(0);
}, 60_000);

it("Spring Boot draft — PostgreSQL real valida schema, última vaga e claim/fencing do projeto", async () => {
  const child = spawn("node", ["scripts/check-springboot-sql.mjs"], { cwd: process.cwd(), stdio: ["pipe", "pipe", "pipe"] });
  let stdout = "", stderr = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
  child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
  child.stdin.end(JSON.stringify({
    schema: SPRING_BOOT_EXAMPLES["Módulos e contratos do serviço"][0].code,
    outboxClaim: SPRING_BOOT_EXAMPLES["Eventos de aplicação e outbox"][1].code,
    transaction: SPRING_BOOT_EXAMPLES["Reserva transacional e idempotência"][0].code,
  }));
  const code = await new Promise<number | null>((resolve, reject) => { child.on("error", reject); child.on("close", resolve); });
  expect(code, stderr || stdout).toBe(0);
}, 60_000);

it("Spring Boot draft — XML dos POMs e fragmentos é bem formado", async () => {
  const snippets = Object.values(SPRING_BOOT_EXAMPLES).flat().filter((snippet) => snippet.lang === "xml");
  const command = "$ErrorActionPreference='Stop'; $items=ConvertFrom-Json ([Console]::In.ReadToEnd()); foreach($item in $items){ $doc=New-Object System.Xml.XmlDocument; $doc.LoadXml([string]$item.code) }";
  const child = spawn("powershell", ["-NoProfile", "-NonInteractive", "-Command", command], { cwd: process.cwd(), stdio: ["pipe", "pipe", "pipe"] });
  let stdout = "", stderr = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
  child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
  child.stdin.end(JSON.stringify(snippets));
  const code = await new Promise<number | null>((resolve, reject) => { child.on("error", reject); child.on("close", resolve); });
  expect(code, stderr || stdout).toBe(0);
}, 30_000);
