import type { ContentSource } from "./types";
import { C_CARDS, C_EXERCISES } from "./cAssessments";
import { C_CURRICULUM } from "./cCurriculum";
import { cChapter } from "./cSupport";

const chapters = C_CURRICULUM.map(cChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });

/** Draft completo; sem editorial até compile/runtime C17 e gates externos essenciais. */
export const C_CONTENT: ContentSource = {
  name: "C",
  kind: "stack",
  language: "C",
  chapters,
  exercises: C_EXERCISES,
  cards: C_CARDS,
};
