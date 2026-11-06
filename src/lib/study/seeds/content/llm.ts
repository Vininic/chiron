import type { ContentSource } from "./types";
import { LLM_CURRICULUM } from "./llmCurriculum";
import { LLM_AUTHORED_PROSE } from "./llmAuthoredProse";
import { LLM_EXAMPLES } from "./llmExamples";
import { LLM_CARDS, LLM_EXERCISES, LLM_REVIEW } from "./llmAssessments";

/** Corpus integral de contratos, transformações, geometria e modelos locais; captions declaram escopo.
 * Attestation cobre esses exemplos, nunca provedor LLM, enforcement ou serviço externo não ensaiado. */
export const LLM_CONTENT: ContentSource = {
  name: "Integração de IA (LLM)", kind: "tool", language: "LLM / JavaScript",
  chapters: LLM_CURRICULUM.map(chapter => ({
    title: chapter.title, level: chapter.level, nodeTitle: chapter.title, nodeKind: "concept",
    sections: chapter.sections.map((title, order) => {
      const text = LLM_AUTHORED_PROSE[title];
      const examples = LLM_EXAMPLES[title];
      const review = LLM_REVIEW[title];
      if (!text || !examples || !review) throw new Error(`LLM: seção incompleta: ${title}`);
      return { title, order, blocks: [
        { kind: "prose" as const, md: text },
        ...examples.map(example => ({ kind: "code" as const, lang: example.lang, code: example.code, caption: `[${example.scope}] ${example.purpose}` })),
        { kind: "porque" as const, md: review[1] },
        { kind: "quebraria" as const, md: review[2] },
      ] };
    }),
  })),
  exercises: LLM_EXERCISES, cards: LLM_CARDS,
  editorial: { proseReviewed: true, assessmentsReviewed: true, examplesVerified: true, reviewedAt: "2026-10-03" },
};
LLM_CONTENT.chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });
