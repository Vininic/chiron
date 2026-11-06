import type { ContentSource } from "./types";
import { GOOGLE_AI_STUDIO_CURRICULUM } from "./googleAiStudioCurriculum";
import { GOOGLE_AI_STUDIO_AUTHORED_PROSE } from "./googleAiStudioAuthoredProse";
import { GOOGLE_AI_STUDIO_EXAMPLES } from "./googleAiStudioExamples";
import { GOOGLE_AI_STUDIO_CARDS, GOOGLE_AI_STUDIO_EXERCISES, GOOGLE_AI_STUDIO_REVIEW } from "./googleAiStudioAssessments";

/** Corpus integral de contratos, transformações, políticas e modelos locais; captions declaram escopo.
 * Attestation cobre esses exemplos, nunca aplicativo GoogleAiStudio, enforcement ou serviço externo não ensaiado. */
export const GOOGLE_AI_STUDIO_CONTENT: ContentSource = {
  name: "Google AI Studio", kind: "tool", language: "Google AI Studio / JavaScript",
  chapters: GOOGLE_AI_STUDIO_CURRICULUM.map(chapter => ({
    title: chapter.title, level: chapter.level, nodeTitle: chapter.title, nodeKind: "concept",
    sections: chapter.sections.map((title, order) => {
      const text = GOOGLE_AI_STUDIO_AUTHORED_PROSE[title];
      const examples = GOOGLE_AI_STUDIO_EXAMPLES[title];
      const review = GOOGLE_AI_STUDIO_REVIEW[title];
      if (!text || !examples || !review) throw new Error(`GOOGLE_AI_STUDIO: seção incompleta: ${title}`);
      return { title, order, blocks: [
        { kind: "prose" as const, md: text },
        ...examples.map(example => ({ kind: "code" as const, lang: example.lang, code: example.code, caption: `[${example.scope}] ${example.purpose}` })),
        { kind: "porque" as const, md: review[1] },
        { kind: "quebraria" as const, md: review[2] },
      ] };
    }),
  })),
  exercises: GOOGLE_AI_STUDIO_EXERCISES, cards: GOOGLE_AI_STUDIO_CARDS,
  editorial: { proseReviewed: true, assessmentsReviewed: true, examplesVerified: true, reviewedAt: "2026-10-05" },
};
GOOGLE_AI_STUDIO_CONTENT.chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });
