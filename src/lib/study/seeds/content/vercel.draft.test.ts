import { expect, it } from "vitest";
import { VERCEL_AUTHORED_PROSE } from "./vercelAuthoredProse";
import { VERCEL_CURRICULUM } from "./vercelCurriculum";
import { VERCEL_EXAMPLES } from "./vercelExamples";

const wordCount = (parts: string[]) => parts.join(" ").trim().split(/\s+/u).filter(Boolean).length;

it("Vercel draft — capítulos completos têm seções autorais ≥600 palavras e dois exemplos", () => {
  const ordered = VERCEL_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title));
  const authored = Object.keys(VERCEL_AUTHORED_PROSE);
  expect(authored).toEqual(ordered.slice(0, authored.length));
  expect(authored.length % 4).toBe(0);
  expect(Object.keys(VERCEL_EXAMPLES)).toEqual(authored);
  expect(authored.map((title) => ({ title, words: wordCount(VERCEL_AUTHORED_PROSE[title]) })).filter(({ words }) => words < 600)).toEqual([]);
  expect(Object.values(VERCEL_EXAMPLES).every((examples) => examples.length === 2 && examples.every((example) => example.code.length > 120))).toBe(true);
});

it("Vercel draft — mantém estrutura editorial, exemplos e parágrafos autorais sem duplicação", () => {
  const sections = Object.entries(VERCEL_AUTHORED_PROSE);
  const paragraphs = sections.flatMap(([, parts]) => parts);
  const normalizedParagraphs = paragraphs.map((part) => part.toLocaleLowerCase("pt-BR").replace(/[^\p{L}\p{N}]+/gu, " ").trim());
  const examples = Object.values(VERCEL_EXAMPLES).flat();

  expect(sections.every(([, parts]) => parts.length >= 8)).toBe(true);
  expect(sections.every(([title, parts]) => parts[0].startsWith(`## ${title}\n`))).toBe(true);
  expect(sections.every(([, parts]) => parts.slice(1).every((part) => part.startsWith("### ") && part.includes("\n")))).toBe(true);
  expect(new Set(normalizedParagraphs).size).toBe(normalizedParagraphs.length);
  expect(new Set(examples.map(({ purpose }) => purpose)).size).toBe(examples.length);
  expect(new Set(examples.map(({ code }) => code)).size).toBe(examples.length);
  expect(paragraphs.some((part) => /(?:^|\s)TODO\s*:|\[TODO\]|lorem ipsum|conteúdo pendente/iu.test(part))).toBe(false);
});
