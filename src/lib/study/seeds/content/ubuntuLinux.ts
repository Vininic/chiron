import type { ContentSource } from "./types";
import { UBUNTU_LINUX_CURRICULUM } from "./ubuntuLinuxCurriculum";
import { UBUNTU_LINUX_AUTHORED_PROSE } from "./ubuntuLinuxAuthoredProse";
import { UBUNTU_LINUX_EXAMPLES } from "./ubuntuLinuxExamples";
import { UBUNTU_LINUX_CARDS, UBUNTU_LINUX_EXERCISES, UBUNTU_LINUX_REVIEW } from "./ubuntuLinuxAssessments";

/** Corpus local integral executado no WSL; captions distinguem modelos, operações e parsers.
 * Attestation cobre esses exemplos, nunca boot, enforcement ou serviço externo não ensaiado. */
export const UBUNTU_LINUX_CONTENT: ContentSource = {
  name: "Ubuntu / Linux", kind: "stack", language: "Linux / Bash / Python",
  chapters: UBUNTU_LINUX_CURRICULUM.map(chapter => ({
    title: chapter.title, level: chapter.level, nodeTitle: chapter.title, nodeKind: "concept",
    sections: chapter.sections.map((title, order) => {
      const text = UBUNTU_LINUX_AUTHORED_PROSE[title];
      const examples = UBUNTU_LINUX_EXAMPLES[title];
      const review = UBUNTU_LINUX_REVIEW[title];
      if (!text || !examples || !review) throw new Error(`Ubuntu / Linux: seção incompleta: ${title}`);
      return { title, order, blocks: [
        { kind: "prose" as const, md: text },
        ...examples.map(example => ({ kind: "code" as const, lang: example.lang, code: example.code, caption: `[${example.scope}] ${example.purpose}` })),
        { kind: "porque" as const, md: review[1] },
        { kind: "quebraria" as const, md: review[2] },
      ] };
    }),
  })),
  exercises: UBUNTU_LINUX_EXERCISES, cards: UBUNTU_LINUX_CARDS,
  editorial: { proseReviewed: true, assessmentsReviewed: true, examplesVerified: true, reviewedAt: "2026-10-01" },
};
UBUNTU_LINUX_CONTENT.chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });
