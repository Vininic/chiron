import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { MARIADB_CURRICULUM, type MariaDBChapterSpec, type MariaDBLessonSpec, type MariaDBLevel } from "./mariadbCurriculum";
import { MARIADB_AUTHORED_PROSE } from "./mariadbAuthoredProse";
import { MARIADB_SQL } from "./mariadbSql";

export interface MariaDBLesson {
  title: string;
  thesis: string;
  mechanism: string;
  incident: string;
  sqlA: string;
  sqlB: string;
  authoredProse: string[];
}

const LEVEL: Record<MariaDBLevel, ContentChapter["level"]> = {
  basico: "basico",
  intermediario: "intermediario",
  avancado: "avancado",
};

function materializeLesson(spec: MariaDBLessonSpec): MariaDBLesson {
  const [title, thesis, mechanism, incident] = spec;
  const authoredProse = MARIADB_AUTHORED_PROSE[title];
  const sql = MARIADB_SQL[title];
  if (!authoredProse) throw new Error(`A seção MariaDB “${title}” não possui prosa autoral revisada.`);
  if (!sql) throw new Error(`A seção MariaDB “${title}” não possui os dois exemplos verificados.`);
  return { title, thesis, mechanism, incident, sqlA: sql[0], sqlB: sql[1], authoredProse };
}

export function mariadbSection(lesson: MariaDBLesson, order: number): ContentSection {
  return {
    title: lesson.title,
    order,
    blocks: [
      prose(lesson.authoredProse),
      code("sql", lesson.sqlA.split("\n"), `Baseline executável de ${lesson.title} no MariaDB 11.8.`),
      code("sql", lesson.sqlB.split("\n"), `Contraprova observável de ${lesson.title} no MariaDB 11.8.`),
      porque([`${lesson.thesis}. No MariaDB, ${lesson.mechanism}; por isso a decisão precisa permanecer ligada à versão, ao engine e à evidência do caso.`]),
      quebraria([`${lesson.incident}. O mutante da seção deve reproduzir esse desvio e provar estado final, diagnóstico e cleanup, não apenas retornar uma exceção.`]),
    ],
  };
}

export function mariadbChapter(spec: MariaDBChapterSpec): ContentChapter {
  const [title, level, _primer, lessons] = spec;
  return {
    title,
    level: LEVEL[level],
    nodeTitle: title,
    nodeKind: "concept",
    sections: lessons.map((lesson, index) => mariadbSection(materializeLesson(lesson), index)),
  };
}

/** Named audit surface: exactly the lessons materialized by the curriculum. */
export const MARIADB_LESSONS: MariaDBLesson[] = MARIADB_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(materializeLesson));
