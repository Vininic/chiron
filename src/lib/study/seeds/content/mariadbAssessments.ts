import type { ContentCard, ContentExercise } from "./types";
import { MARIADB_CURRICULUM } from "./mariadbCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;

export const MARIADB_EXERCISES: ContentExercise[] = MARIADB_CURRICULUM.flatMap(([chapter, , primer, lessons]) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `No MariaDB Community 11.8, construa uma fixture para “${title}” que torne observável esta regra: ${thesis}. Execute um baseline baseado em ${mechanism} e um mutante que reproduza “${incident}”. Fixe versão, engine, sql_mode e estado de sessão pertinentes; capture resultado, warning/SQLSTATE, catálogo, plano ou lock que discrimine os dois caminhos; declare a invariante antes do SQL e reconcilie o estado final. Inclua cleanup idempotente, limite de tempo, risco operacional, ponto de rollback e a fronteira entre o que o servidor standalone prova e o que exige staging distribuído. Contexto do capítulo: ${primer}`,
    answerKeyMd: `A resposta deve provar “${thesis}” no servidor real e explicar por que ${mechanism}. O mutante precisa falhar especificamente pelo incidente “${incident}”, sem aceitar exceção não relacionada. Evidência mínima: versão MariaDB, pré/pós-condições, saída consultável, estado final reconciliado e cleanup. Para Galera, MaxScale, ColumnStore, replication, backup ou failover, distinguir metadata/sintaxe local do rehearsal operacional e não simular capacidade ausente.`,
  })),
);

export const MARIADB_CARDS: ContentCard[] = MARIADB_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual contrato precisa sobreviver e qual evidência evita confundi-lo com compatibilidade aparente?`,
    backMd: `${thesis}. Prove no MariaDB alvo que ${mechanism}; mantenha como contraprova o incidente: ${incident}.`,
  })),
);
