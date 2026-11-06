// The reading bar of PLANO.md §R.2, as far as a machine can hold it: prose a
// learner reads must not narrate how the book was verified. The 2026-10-23
// audit found whole catalogs where every section carried "contraprova",
// "ensaio nativo", "Ficha de banca", "o mutante…" — vocabulary of the
// authoring harness that leaked into the text. This check cannot tell good
// teaching from bad; it only refuses the specific leak, so the Python
// reference (zero hits) stays the floor and rewritten books cannot regress.
import type { ContentSource } from "@/lib/study/seeds/content/types";
import type { Violation } from "./contract";

const LEAKS: [label: string, pattern: RegExp][] = [
  ["contraprova", /contraprova/i],
  ["ensaio nativo", /ensaio nativo/i],
  // A test oracle is a real concept taught in testing chapters; the leak is
  // the book describing the oracle of its own examples.
  ["oráculo (do exemplo)", /\bor[áa]culos? (literal|literais|independentes?|do exemplo|desta seção)\b/i],
  ["ficha de banca", /ficha de banca/i],
  ["estudo dirigido", /estudo dirigido/i],
  ["caso de trabalho e previsão", /caso de trabalho e previs/i],
  ["mutante", /\bmutantes?\b/i],
  // "fixture" alone is legitimate (pytest fixtures); the leak is the text
  // describing its own test harness.
  ["a fixture (do exemplo)", /\b(a|esta|essa) fixture (usa|recebe|possui|correta|positiva|cria|mostra|exige)\b/i],
  ["não atesta", /n[ãa]o atesta/i],
  // Rewritten books (2026-10-23) drifted into reporting their own checks at
  // the start of post-example paragraphs; the learner needs what happens when
  // the example runs, not that the author ran it.
  ["o projeto foi executado", /\b(foi|foram) (servid[oa]s? e construíd|executad[oa]s? (no|pelo|como tal)|verificad[oa]s? (junt|pelo|contra|cada))/i],
  ["verificador do livro", /\b(verificador|runner) (deste livro|que verifica)|exemplos deste livro s[ãa]o verificados/i],
  ["num teste com a ferramenta", /\bnum teste (com o|no mesmo)\b|\bno mesmo teste\b/i],
];

export function readingBarViolations(source: ContentSource): Violation[] {
  const violations: Violation[] = [];
  for (const chapter of source.chapters) {
    for (const section of chapter.sections) {
      const prose = section.blocks.filter((b) => b.kind === "prose" || b.kind === "porque" || b.kind === "quebraria")
        .map((b) => ("md" in b ? b.md : "")).join("\n");
      const hits = LEAKS.filter(([, pattern]) => pattern.test(prose)).map(([label]) => label);
      if (hits.length) {
        violations.push({ rule: "reading.verificationLeak", message: `"${source.name}" › "${section.title}": ${hits.join(", ")}` });
      }
    }
  }
  return violations;
}
