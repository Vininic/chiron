import type { ContentSource } from "./types";
import { CPP_CARDS, CPP_EXERCISES } from "./cppAssessments";
import { CPP_CURRICULUM } from "./cppCurriculum";
import { cppChapter } from "./cppSupport";

const chapters = CPP_CURRICULUM.map(cppChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });

/** Draft completo; sem editorial até compile/runtime C++20 e gates externos essenciais. */
export const CPP_CONTENT: ContentSource = {
  name: "C++",
  kind: "stack",
  language: "C++",
  chapters,
  exercises: CPP_EXERCISES,
  cards: CPP_CARDS,
};
