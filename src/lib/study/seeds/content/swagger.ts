import type { ContentSource } from "./types";
import { SWAGGER_CARDS, SWAGGER_EXERCISES } from "./swaggerAssessments";
import { SWAGGER_CURRICULUM } from "./swaggerCurriculum";
import { swaggerChapter } from "./swaggerSupport";

const chapters = SWAGGER_CURRICULUM.map(swaggerChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });

/** Draft completo: exemplos ainda aguardam parser/validator/linter OpenAPI e sandboxes de gateway, registry e runtime. */
export const SWAGGER_CONTENT: ContentSource = {
  name: "Swagger",
  kind: "stack",
  language: "OpenAPI / YAML / JSON",
  chapters,
  exercises: SWAGGER_EXERCISES,
  cards: SWAGGER_CARDS,
};
