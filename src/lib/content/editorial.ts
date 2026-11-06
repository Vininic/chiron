import type { Block } from "@/lib/study/types";
import type { ContentSource } from "@/lib/study/seeds/content/types";
import type { Violation } from "./contract";

function words(value: string): string[] {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/`[^`]*`/g, " code ")
    .match(/[a-z0-9_]+/g) ?? [];
}

function grams(value: string, size: number): Set<string> {
  const tokens = words(value);
  const result = new Set<string>();
  for (let index = 0; index <= tokens.length - size; index++) {
    result.add(tokens.slice(index, index + size).join(" "));
  }
  return result;
}

function dice(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  for (const value of left) if (right.has(value)) shared += 1;
  return (2 * shared) / (left.size + right.size);
}

function proseOf(blocks: Block[]): string {
  return blocks.filter((block): block is Extract<Block, { kind: "prose" }> => block.kind === "prose").map((block) => block.md).join("\n\n");
}

function codeOf(blocks: Block[]): string[] {
  return blocks.filter((block): block is Extract<Block, { kind: "code" }> => block.kind === "code").map((block) => `${block.lang}\n${block.code}`.replace(/\s+/g, " ").trim());
}

export interface EditorialMetrics {
  maximumSectionSimilarity: number;
  highlySimilarSectionPairs: number;
  detailedExerciseRatio: number;
  maximumCardSimilarity: number;
  duplicatedCodeBlocks: number;
}

export function editorialMetrics(source: ContentSource): EditorialMetrics {
  const sections = source.chapters.flatMap((chapter) => chapter.sections.map((section) => ({ chapter: chapter.title, title: section.title, text: proseOf(section.blocks) })));
  // Sets are immutable during comparison: tokenize each input once per audit,
  // while preserving every pair, threshold and fresh audit of mutable sources.
  const sectionGrams = sections.map((section) => grams(section.text, 5));
  let maximumSectionSimilarity = 0;
  let highlySimilarSectionPairs = 0;
  for (let left = 0; left < sections.length; left++) {
    for (let right = left + 1; right < sections.length; right++) {
      const similarity = dice(sectionGrams[left], sectionGrams[right]);
      maximumSectionSimilarity = Math.max(maximumSectionSimilarity, similarity);
      // A chapter may legitimately reuse terminology, but not the prose that
      // is supposed to teach four different sections. Count every pair so a
      // renderer cannot evade the gate by scoping its template per chapter.
      if (similarity >= 0.42) highlySimilarSectionPairs += 1;
    }
  }

  const maximumPairSimilarity = (values: string[], size: number): number => {
    const valueGrams = values.map((value) => grams(value, size));
    let maximum = 0;
    for (let left = 0; left < values.length; left++) {
      for (let right = left + 1; right < values.length; right++) maximum = Math.max(maximum, dice(valueGrams[left], valueGrams[right]));
    }
    return maximum;
  };

  const allCode = source.chapters.flatMap((chapter) => chapter.sections.flatMap((section) => codeOf(section.blocks)));
  const counts = new Map<string, number>();
  for (const snippet of allCode) counts.set(snippet, (counts.get(snippet) ?? 0) + 1);
  const duplicatedCodeBlocks = [...counts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);

  return {
    maximumSectionSimilarity,
    highlySimilarSectionPairs,
    detailedExerciseRatio: source.exercises.length === 0 ? 0 : source.exercises.filter((exercise) => {
      const promptWords = words(exercise.promptMd).length;
      return exercise.promptMd.includes("```") || promptWords >= 30;
    }).length / source.exercises.length,
    maximumCardSimilarity: maximumPairSimilarity(source.cards.map((card) => `${card.frontMd}\n${card.backMd}`), 4),
    duplicatedCodeBlocks,
  };
}

export function checkEditorialSource(source: ContentSource): Violation[] {
  const violations: Violation[] = [];
  const metrics = editorialMetrics(source);
  if (!source.editorial) {
    violations.push({ rule: "editorial.attestation", message: `"${source.name}" não tem revisão editorial e verificação de exemplos atestadas` });
  }
  if (metrics.highlySimilarSectionPairs > 0) {
    violations.push({ rule: "editorial.proseSimilarity", message: `"${source.name}" tem ${metrics.highlySimilarSectionPairs} par(es) de seções com prosa repetitiva (similaridade máxima ${(metrics.maximumSectionSimilarity * 100).toFixed(1)}%, limite <42%)` });
  }
  if (metrics.detailedExerciseRatio < 0.65) {
    violations.push({ rule: "editorial.exerciseSpecificity", message: `"${source.name}" tem apenas ${(metrics.detailedExerciseRatio * 100).toFixed(1)}% de exercícios com cenário detalhado ou código concreto, mínimo 65%` });
  }
  if (metrics.maximumCardSimilarity >= 0.78) {
    violations.push({ rule: "editorial.cardSimilarity", message: `"${source.name}" repete cards por template (similaridade máxima ${(metrics.maximumCardSimilarity * 100).toFixed(1)}%, limite <78%)` });
  }
  if (metrics.duplicatedCodeBlocks > 0) {
    violations.push({ rule: "editorial.duplicateCode", message: `"${source.name}" reutiliza ${metrics.duplicatedCodeBlocks} bloco(s) de código idêntico(s) entre seções` });
  }
  return violations;
}

export function assertEditorialSource(source: ContentSource): void {
  const violations = checkEditorialSource(source);
  if (violations.length > 0) throw new Error(violations.map((violation) => `${violation.rule}: ${violation.message}`).join("\n"));
}
