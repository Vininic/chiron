import type { ContentSource } from "./types";
import { LOVABLE_CURRICULUM } from "./lovableCurriculum";
import { LOVABLE_AUTHORED_PROSE } from "./lovableAuthoredProse";
import { LOVABLE_EXAMPLES } from "./lovableExamples";
import { LOVABLE_CARDS, LOVABLE_EXERCISES, LOVABLE_REVIEW } from "./lovableAssessments";

/** Corpus integral de contratos, transformações, políticas e modelos locais; captions declaram escopo.
 * Attestation cobre esses exemplos, nunca aplicativo Lovable, enforcement ou serviço externo não ensaiado. */
export const LOVABLE_CONTENT: ContentSource = {
  name: "Lovable", kind: "tool", language: "Lovable / JavaScript",
  chapters: LOVABLE_CURRICULUM.map(chapter => ({
    title: chapter.title, level: chapter.level, nodeTitle: chapter.title, nodeKind: "concept",
    sections: chapter.sections.map((title, order) => {
      const text = LOVABLE_AUTHORED_PROSE[title];
      const examples = LOVABLE_EXAMPLES[title];
      const review = LOVABLE_REVIEW[title];
      if (!text || !examples || !review) throw new Error(`LOVABLE: seção incompleta: ${title}`);
      return { title, order, blocks: [
        { kind: "prose" as const, md: text },
        ...examples.map(example => ({ kind: "code" as const, lang: example.lang, code: example.code, caption: `[${example.scope}] ${example.purpose}` })),
        { kind: "porque" as const, md: review[1] },
        { kind: "quebraria" as const, md: review[2] },
      ] };
    }),
  })),
  exercises: LOVABLE_EXERCISES, cards: LOVABLE_CARDS,
  editorial: { proseReviewed: true, assessmentsReviewed: true, examplesVerified: true, reviewedAt: "2026-10-05" },
};
LOVABLE_CONTENT.chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });
