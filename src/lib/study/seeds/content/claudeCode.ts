import type { ContentSource } from "./types";
import { CLAUDE_CODE_CURRICULUM } from "./claudeCodeCurriculum";
import { CLAUDE_CODE_AUTHORED_PROSE } from "./claudeCodeAuthoredProse";
import { CLAUDE_CODE_EXAMPLES } from "./claudeCodeExamples";
import { CLAUDE_CODE_CARDS, CLAUDE_CODE_EXERCISES, CLAUDE_CODE_REVIEW } from "./claudeCodeAssessments";

/** Corpus integral de contratos, transformações, políticas e modelos locais; captions declaram escopo.
 * Attestation cobre esses exemplos, nunca aplicativo Claude Code, enforcement ou serviço externo não ensaiado. */
export const CLAUDE_CODE_CONTENT: ContentSource = {
  name: "Claude Code", kind: "tool", language: "Claude Code / JavaScript",
  chapters: CLAUDE_CODE_CURRICULUM.map(chapter => ({
    title: chapter.title, level: chapter.level, nodeTitle: chapter.title, nodeKind: "concept",
    sections: chapter.sections.map((title, order) => {
      const text = CLAUDE_CODE_AUTHORED_PROSE[title];
      const examples = CLAUDE_CODE_EXAMPLES[title];
      const review = CLAUDE_CODE_REVIEW[title];
      if (!text || !examples || !review) throw new Error(`CLAUDE_CODE: seção incompleta: ${title}`);
      return { title, order, blocks: [
        { kind: "prose" as const, md: text },
        ...examples.map(example => ({ kind: "code" as const, lang: example.lang, code: example.code, caption: `[${example.scope}] ${example.purpose}` })),
        { kind: "porque" as const, md: review[1] },
        { kind: "quebraria" as const, md: review[2] },
      ] };
    }),
  })),
  exercises: CLAUDE_CODE_EXERCISES, cards: CLAUDE_CODE_CARDS,
  editorial: { proseReviewed: true, assessmentsReviewed: true, examplesVerified: true, reviewedAt: "2026-10-03" },
};
CLAUDE_CODE_CONTENT.chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });
