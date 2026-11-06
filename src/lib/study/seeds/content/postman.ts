import type { ContentSource } from "./types";
import { POSTMAN_CARDS, POSTMAN_EXERCISES } from "./postmanAssessments";
import { POSTMAN_CURRICULUM } from "./postmanCurriculum";
import { postmanChapter } from "./postmanSupport";

const chapters = POSTMAN_CURRICULUM.map(postmanChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });

/** Draft completo: Newman, Postman CLI, Desktop/cloud, IdP, monitors e observers externos continuam Pending. */
export const POSTMAN_CONTENT: ContentSource = {
  name: "Postman",
  kind: "stack",
  language: "Collection Format / JavaScript / JSON",
  chapters,
  exercises: POSTMAN_EXERCISES,
  cards: POSTMAN_CARDS,
};
