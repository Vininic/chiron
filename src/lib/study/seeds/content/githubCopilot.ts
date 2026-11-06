import type { ContentSource } from "./types";
import { GITHUB_COPILOT_CURRICULUM } from "./githubCopilotCurriculum";
import { GITHUB_COPILOT_AUTHORED_PROSE } from "./githubCopilotAuthoredProse";
import { GITHUB_COPILOT_EXAMPLES } from "./githubCopilotExamples";
import { GITHUB_COPILOT_CARDS, GITHUB_COPILOT_EXERCISES, GITHUB_COPILOT_REVIEW } from "./githubCopilotAssessments";

/** Corpus integral de contratos, transformações, políticas e modelos locais; captions declaram escopo.
 * Attestation cobre esses exemplos, nunca aplicativo GitHub Copilot, enforcement ou serviço externo não ensaiado. */
export const GITHUB_COPILOT_CONTENT: ContentSource = {
  name: "GitHub Copilot", kind: "tool", language: "GitHub Copilot / JavaScript",
  chapters: GITHUB_COPILOT_CURRICULUM.map(chapter => ({
    title: chapter.title, level: chapter.level, nodeTitle: chapter.title, nodeKind: "concept",
    sections: chapter.sections.map((title, order) => {
      const text = GITHUB_COPILOT_AUTHORED_PROSE[title];
      const examples = GITHUB_COPILOT_EXAMPLES[title];
      const review = GITHUB_COPILOT_REVIEW[title];
      if (!text || !examples || !review) throw new Error(`GITHUB_COPILOT: seção incompleta: ${title}`);
      return { title, order, blocks: [
        { kind: "prose" as const, md: text },
        ...examples.map(example => ({ kind: "code" as const, lang: example.lang, code: example.code, caption: `[${example.scope}] ${example.purpose}` })),
        { kind: "porque" as const, md: review[1] },
        { kind: "quebraria" as const, md: review[2] },
      ] };
    }),
  })),
  exercises: GITHUB_COPILOT_EXERCISES, cards: GITHUB_COPILOT_CARDS,
  editorial: { proseReviewed: true, assessmentsReviewed: true, examplesVerified: true, reviewedAt: "2026-10-05" },
};
GITHUB_COPILOT_CONTENT.chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });
