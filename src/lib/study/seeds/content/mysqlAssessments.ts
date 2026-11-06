import type { ContentCard, ContentExercise } from "./types";
import { MYSQL_CHAPTERS } from "./mysqlCurriculum";

export const MYSQL_EXERCISES: ContentExercise[] = MYSQL_CHAPTERS.flatMap((chapter) => chapter.lessons.slice(0, 3).map((lesson, index) => ({
  nodeTitle: chapter.title, type: (index + 1) as 1 | 2 | 3, level: (["beginner", "intermediate", "advanced"] as const)[index], points: (index + 1) * 10,
  promptMd: `Construa uma fixture MySQL 8.4 para “${lesson.title}”. Declare a invariante, execute baseline e mutante sob configurações explícitas, capture resultado, warnings ou plano e explique a primeira divergência. Inclua cleanup, risco operacional e critério objetivo de rollback para que outro revisor repita o ensaio sem contexto oral.`,
  answerKeyMd: `${lesson.concept} A resposta deve demonstrar ${lesson.mechanism.toLowerCase()} e detectar o mutante associado ao incidente: ${lesson.incident}`,
})));

export const MYSQL_CARDS: ContentCard[] = MYSQL_CHAPTERS.flatMap((chapter) => chapter.lessons.map((lesson) => ({
  nodeTitle: chapter.title, frontMd: `Qual contrato governa “${lesson.title}”?`, backMd: `${lesson.concept} Evidência mínima: ${lesson.evidence}`,
})));
