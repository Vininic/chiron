import type { ContentSource } from "./types";
import { CURSOR_CURRICULUM } from "./cursorCurriculum";
import { CURSOR_AUTHORED_PROSE } from "./cursorAuthoredProse";
import { CURSOR_EXAMPLES } from "./cursorExamples";
import { CURSOR_CARDS, CURSOR_EXERCISES, CURSOR_REVIEW } from "./cursorAssessments";

/** Corpus integral de contratos, transformações, políticas e modelos locais; captions declaram escopo.
 * Attestation cobre esses exemplos, nunca aplicativo Cursor, enforcement ou serviço externo não ensaiado. */
export const CURSOR_CONTENT: ContentSource = {
  name: "Cursor", kind: "tool", language: "Cursor / JavaScript",
  chapters: CURSOR_CURRICULUM.map(chapter => ({
    title: chapter.title, level: chapter.level, nodeTitle: chapter.title, nodeKind: "concept",
    sections: chapter.sections.map((title, order) => {
      const text = CURSOR_AUTHORED_PROSE[title];
      const examples = CURSOR_EXAMPLES[title];
      const review = CURSOR_REVIEW[title];
      if (!text || !examples || !review) throw new Error(`CURSOR: seção incompleta: ${title}`);
      return { title, order, blocks: [
        { kind: "prose" as const, md: text },
        ...examples.map(example => ({ kind: "code" as const, lang: example.lang, code: example.code, caption: `[${example.scope}] ${example.purpose}` })),
        { kind: "porque" as const, md: review[1] },
        { kind: "quebraria" as const, md: review[2] },
      ] };
    }),
  })),
  exercises: CURSOR_EXERCISES, cards: CURSOR_CARDS,
  editorial: { proseReviewed: true, assessmentsReviewed: true, examplesVerified: true, reviewedAt: "2026-10-03" },
};
CURSOR_CONTENT.chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });
