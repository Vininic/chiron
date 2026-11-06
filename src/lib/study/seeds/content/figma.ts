import type { ContentSource } from "./types";
import { FIGMA_CURRICULUM } from "./figmaCurriculum";
import { FIGMA_AUTHORED_PROSE } from "./figmaAuthoredProse";
import { FIGMA_EXAMPLES } from "./figmaExamples";
import { FIGMA_CARDS, FIGMA_EXERCISES, FIGMA_REVIEW } from "./figmaAssessments";

/** Corpus integral de contratos, transformações, geometria e modelos locais; captions declaram escopo.
 * Attestation cobre esses exemplos, nunca editor Figma, enforcement ou serviço externo não ensaiado. */
export const FIGMA_CONTENT: ContentSource = {
  name: "Figma", kind: "tool", language: "Figma Design / JavaScript",
  chapters: FIGMA_CURRICULUM.map(chapter => ({
    title: chapter.title, level: chapter.level, nodeTitle: chapter.title, nodeKind: "concept",
    sections: chapter.sections.map((title, order) => {
      const text = FIGMA_AUTHORED_PROSE[title];
      const examples = FIGMA_EXAMPLES[title];
      const review = FIGMA_REVIEW[title];
      if (!text || !examples || !review) throw new Error(`FIGMA: seção incompleta: ${title}`);
      return { title, order, blocks: [
        { kind: "prose" as const, md: text },
        ...examples.map(example => ({ kind: "code" as const, lang: example.lang, code: example.code, caption: `[${example.scope}] ${example.purpose}` })),
        { kind: "porque" as const, md: review[1] },
        { kind: "quebraria" as const, md: review[2] },
      ] };
    }),
  })),
  exercises: FIGMA_EXERCISES, cards: FIGMA_CARDS,
  editorial: { proseReviewed: true, assessmentsReviewed: true, examplesVerified: true, reviewedAt: "2026-10-01" },
};
FIGMA_CONTENT.chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });
