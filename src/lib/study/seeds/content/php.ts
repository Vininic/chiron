import type { ContentSource } from "./types";
import { PHP_CARDS, PHP_EXERCISES } from "./phpAssessments";
import { PHP_CURRICULUM } from "./phpCurriculum";
import { phpChapter } from "./phpSupport";

const chapters = PHP_CURRICULUM.map(phpChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });

/** Draft completo; sem editorial até runtime PHP e gates externos essenciais. */
export const PHP_CONTENT: ContentSource = {
  name: "PHP",
  kind: "stack",
  language: "PHP",
  chapters,
  exercises: PHP_EXERCISES,
  cards: PHP_CARDS,
};
