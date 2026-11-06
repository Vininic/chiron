import type { ContentSource } from "./types";
import { FLASK_CARDS, FLASK_EXERCISES } from "./flaskAssessments";
import { FLASK_CURRICULUM } from "./flaskCurriculum";
import { flaskChapter } from "./flaskSupport";

const chapters = FLASK_CURRICULUM.map(flaskChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });

/** Draft completo; sem editorial até runtime Flask e gates externos essenciais. */
export const FLASK_CONTENT: ContentSource = {
  name: "Flask",
  kind: "stack",
  language: "Python",
  chapters,
  exercises: FLASK_EXERCISES,
  cards: FLASK_CARDS,
};
