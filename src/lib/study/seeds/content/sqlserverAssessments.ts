import type { ContentCard, ContentExercise } from "./types";
import { SQLSERVER_CURRICULUM } from "./sqlserverCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;

export const SQLSERVER_EXERCISES: ContentExercise[] = SQLSERVER_CURRICULUM.flatMap(([chapter, , primer, lessons]) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `No Microsoft SQL Server 2025, construa uma fixture para “${title}” que prove a regra: ${thesis}. Declare a invariante, execute um baseline apoiado em ${mechanism} e um mutante que reproduza “${incident}”. Registre edição, build, compatibility level, database e SET options relevantes; capture resultado, erro estruturado, catálogo, plano, wait ou lock que discrimine os caminhos. Reconcilie o estado final, faça cleanup idempotente e explicite timeout, privilégio, risco operacional, rollback e aquilo que exige staging com duas sessões ou topologia real. Contexto: ${primer}`,
    answerKeyMd: `A resposta deve demonstrar “${thesis}” no SQL Server alvo e explicar o mecanismo (${mechanism}). O mutante precisa falhar especificamente pelo incidente “${incident}”, não por erro incidental. Evidência mínima: @@VERSION/SERVERPROPERTY, pré e pós-condições, saída consultável, estado transacional e cleanup. Recursos de HA, criptografia, backup e governança exigem distinguir prova local de rehearsal operacional e capability gate por edição.`,
  })),
);

export const SQLSERVER_CARDS: ContentCard[] = SQLSERVER_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual contrato deve sobreviver e qual evidência evita uma conclusão aparente?`,
    backMd: `${thesis}. No SQL Server alvo, prove que ${mechanism}; mantenha como contraprova o incidente: ${incident}.`,
  })),
);
