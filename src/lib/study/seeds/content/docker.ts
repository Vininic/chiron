import type { ContentSource } from "./types";
import { DOCKER_CARDS, DOCKER_EXERCISES } from "./dockerAssessments";
import { DOCKER_CURRICULUM } from "./dockerCurriculum";
import { dockerChapter } from "./dockerSupport";

const chapters = DOCKER_CURRICULUM.map(dockerChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });

/** Draft completo: engine, BuildKit, Compose, registry, scanners e plataforma ainda não foram executados neste host. */
export const DOCKER_CONTENT: ContentSource = {
  name: "Docker",
  kind: "stack",
  language: "Dockerfile / Shell",
  chapters,
  exercises: DOCKER_EXERCISES,
  cards: DOCKER_CARDS,
};
