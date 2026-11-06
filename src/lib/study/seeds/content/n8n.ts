import type { ContentSource } from "./types";
import { N8N_CURRICULUM } from "./n8nCurriculum";
import { N8N_AUTHORED_PROSE } from "./n8nAuthoredProse";
import { N8N_EXAMPLES } from "./n8nExamples";
import { N8N_CARDS, N8N_EXERCISES, N8N_REVIEW } from "./n8nAssessments";

/** Corpus local integral de regras JavaScript e modelos; captions distinguem modelos, operações e parsers.
 * Attestation cobre esses exemplos, nunca motor n8n, enforcement ou serviço externo não ensaiado. */
export const N8N_CONTENT: ContentSource = {
  name: "N8N", kind: "stack", language: "n8n / JavaScript",
  chapters: N8N_CURRICULUM.map(chapter => ({
    title: chapter.title, level: chapter.level, nodeTitle: chapter.title, nodeKind: "concept",
    sections: chapter.sections.map((title, order) => {
      const text = N8N_AUTHORED_PROSE[title];
      const examples = N8N_EXAMPLES[title];
      const review = N8N_REVIEW[title];
      if (!text || !examples || !review) throw new Error(`N8N: seção incompleta: ${title}`);
      return { title, order, blocks: [
        { kind: "prose" as const, md: text },
        ...examples.map(example => ({ kind: "code" as const, lang: example.lang, code: example.code, caption: `[${example.scope}] ${example.purpose}` })),
        { kind: "porque" as const, md: review[1] },
        { kind: "quebraria" as const, md: review[2] },
      ] };
    }),
  })),
  exercises: N8N_EXERCISES, cards: N8N_CARDS,
  editorial: { proseReviewed: true, assessmentsReviewed: true, examplesVerified: true, reviewedAt: "2026-10-01" },
};
N8N_CONTENT.chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });
