import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";

export interface MySQLLesson {
  title: string;
  concept: string;
  mechanism: string;
  boundary: string;
  workflow: string;
  incident: string;
  evidence: string;
  operation: string;
  evolution: string;
  sqlA: string;
  sqlB: string;
  authoredProse?: string[];
}

export interface MySQLChapterSpec {
  title: string;
  level: ContentChapter["level"];
  primer: string;
  lessons: MySQLLesson[];
}

function lessonProse(lesson: MySQLLesson): string[] {
  if (!lesson.authoredProse) {
    throw new Error(`A seção MySQL “${lesson.title}” não possui prosa autoral revisada.`);
  }
  return lesson.authoredProse;
}

export function mysqlSection(lesson: MySQLLesson, order: number): ContentSection {
  return {
    title: lesson.title,
    order,
    blocks: [
      prose(lessonProse(lesson)),
      code("sql", lesson.sqlA.split("\n"), `Baseline executável de ${lesson.title}.`),
      code("sql", lesson.sqlB.split("\n"), `Variação observável de ${lesson.title}.`),
      porque([`${lesson.concept} A escolha é defensável quando contrato, estado do servidor e evidência permanecem ligados.`]),
      quebraria([`${lesson.incident} Sem fixture adversa, a mesma falha pode reaparecer sob outro volume, sessão ou plano.`]),
    ],
  };
}

export const mysqlChapter = (spec: MySQLChapterSpec): ContentChapter => ({
  title: spec.title,
  level: spec.level,
  nodeTitle: spec.title,
  nodeKind: "concept",
  sections: spec.lessons.map((lesson, index) => mysqlSection(lesson, index)),
});
