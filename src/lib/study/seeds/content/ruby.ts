import type { ContentSource } from "./types";
import { RUBY_CARDS, RUBY_EXERCISES } from "./rubyAssessments";
import { RUBY_CURRICULUM } from "./rubyCurriculum";
import { rubyChapter } from "./rubySupport";

const chapters = RUBY_CURRICULUM.map(rubyChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });

/** Draft completo; sem editorial até execução Ruby e gates externos essenciais. */
export const RUBY_CONTENT: ContentSource = {
  name: "Ruby",
  kind: "stack",
  language: "Ruby",
  chapters,
  exercises: RUBY_EXERCISES,
  cards: RUBY_CARDS,
};
