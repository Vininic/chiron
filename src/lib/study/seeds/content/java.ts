import type { ContentSource } from "./types";
import { JAVA_CARDS, JAVA_EXERCISES } from "./javaAssessments";
import { JAVA_CURRICULUM } from "./javaCurriculum";
import { javaChapter } from "./javaSupport";

const chapters = JAVA_CURRICULUM.map(javaChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });

export const JAVA_CONTENT: ContentSource = {
  name: "Java",
  kind: "stack",
  language: "Java",
  chapters,
  exercises: JAVA_EXERCISES,
  cards: JAVA_CARDS,
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-09-12",
  },
};
