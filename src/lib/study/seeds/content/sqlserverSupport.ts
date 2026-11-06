import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { SQLSERVER_AUTHORED_PROSE } from "./sqlserverAuthoredProse";
import { SQLSERVER_DEPTH_ADDITIONS } from "./sqlserverDepthAdditions";
import { SQLSERVER_FINAL_DEPTH } from "./sqlserverFinalDepth";
import { SQLSERVER_CURRICULUM, type SqlServerChapterSpec, type SqlServerLessonSpec, type SqlServerLevel } from "./sqlserverCurriculum";
import { SQLSERVER_SQL } from "./sqlserverSql";

export interface SqlServerLesson {
  title: string;
  thesis: string;
  mechanism: string;
  incident: string;
  sqlA: string;
  sqlB: string;
  authoredProse: string[];
}

const LEVEL: Record<SqlServerLevel, ContentChapter["level"]> = {
  basico: "basico",
  intermediario: "intermediario",
  avancado: "avancado",
};

function materializeLesson(spec: SqlServerLessonSpec): SqlServerLesson {
  const [title, thesis, mechanism, incident] = spec;
  const authoredProse = SQLSERVER_AUTHORED_PROSE[title];
  const sql = SQLSERVER_SQL[title];
  if (!authoredProse) throw new Error(`A seção SQL Server “${title}” não possui prosa autoral revisada.`);
  if (!sql) throw new Error(`A seção SQL Server “${title}” não possui os dois exemplos verificados.`);
  return {
    title,
    thesis,
    mechanism,
    incident,
    sqlA: sql[0],
    sqlB: sql[1],
    authoredProse: [...authoredProse, ...(SQLSERVER_DEPTH_ADDITIONS[title] ?? []), ...(SQLSERVER_FINAL_DEPTH[title] ?? [])],
  };
}

export function sqlServerSection(lesson: SqlServerLesson, order: number): ContentSection {
  return {
    title: lesson.title,
    order,
    blocks: [
      prose(lesson.authoredProse),
      code("sql", lesson.sqlA.split("\n"), `Baseline executável de ${lesson.title} no SQL Server 2025.`),
      code("sql", lesson.sqlB.split("\n"), `Contraprova observável de ${lesson.title} no SQL Server 2025.`),
      porque([`${lesson.thesis}. No SQL Server, ${lesson.mechanism}; por isso a decisão deve permanecer ligada à edição, ao compatibility level e à evidência da execução.`]),
      quebraria([`${lesson.incident}. O mutante precisa reproduzir esse desvio e provar diagnóstico, estado final e cleanup, não apenas retornar uma mensagem de erro.`]),
    ],
  };
}

export function sqlServerChapter(spec: SqlServerChapterSpec): ContentChapter {
  const [title, level, _primer, lessons] = spec;
  return {
    title,
    level: LEVEL[level],
    nodeTitle: title,
    nodeKind: "concept",
    sections: lessons.map((lesson, index) => sqlServerSection(materializeLesson(lesson), index)),
  };
}

export const SQLSERVER_LESSONS: SqlServerLesson[] = SQLSERVER_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(materializeLesson));
