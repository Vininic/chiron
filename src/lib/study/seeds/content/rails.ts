import type { ContentSource } from "./types";
import { RAILS_CARDS, RAILS_EXERCISES } from "./railsAssessments";
import { RAILS_CURRICULUM } from "./railsCurriculum";
import { railsChapter } from "./railsSupport";

const chapters = RAILS_CURRICULUM.map(railsChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });
/** Draft completo; sem editorial até runtime Rails e gates externos essenciais. */
export const RAILS_CONTENT: ContentSource = { name: "Ruby on Rails", kind: "stack", language: "Ruby", chapters,
  exercises: RAILS_EXERCISES, cards: RAILS_CARDS };
