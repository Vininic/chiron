import type { ContentSource } from "./types";
import { SPRING_BOOT_EXERCISES, SPRING_BOOT_CARDS } from "./springbootAssessments";
import { SPRING_BOOT_CURRICULUM } from "./springbootCurriculum";
import { springBootChapter } from "./springbootSupport";

const chapters = SPRING_BOOT_CURRICULUM.map(springBootChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });

/** Fonte redigida, ainda não publicada: exemplos Spring/SQL exigem gate semântico real. */
export const SPRING_BOOT_CONTENT: ContentSource = {
  name: "Spring Boot",
  kind: "stack",
  language: "Java",
  chapters,
  exercises: SPRING_BOOT_EXERCISES,
  cards: SPRING_BOOT_CARDS,
};
