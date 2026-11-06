import type { ContentCard, ContentExercise } from "./types";
import { SUPABASE_CURRICULUM } from "./supabaseCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;

export const SUPABASE_EXERCISES: ContentExercise[] = SUPABASE_CURRICULUM.flatMap(([chapter, , primer, lessons]) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `Em um projeto Supabase isolado, construa uma fixture para “${title}” que prove: ${thesis}. Execute um baseline baseado em ${mechanism} e um mutante que reproduza “${incident}”. Declare principal, role, JWT/claims, projeto e ambiente; capture resposta do cliente, SQLSTATE, policy, catálogo, log ou evento que discrimine os caminhos; reconcilie estado em Postgres, Auth, Storage ou Realtime conforme o caso. Inclua cleanup idempotente, timeout, risco de segredo, limites do plano, rollback e a fronteira entre o que a stack local prova e o que exige preview/staging gerenciado. Contexto: ${primer}`,
    answerKeyMd: `A resposta deve demonstrar “${thesis}” e explicar o mecanismo (${mechanism}) sem depender de filtro ou segredo no navegador. O mutante precisa falhar especificamente pelo incidente “${incident}”. Evidência mínima: versão/configuração relevante, identidade efetiva, pré/pós-condições, resultado consultável, negação adversarial e cleanup. Recursos gerenciados, Realtime distribuído, email, backups/PITR e quotas devem distinguir contrato local de rehearsal cloud.`,
  })),
);

export const SUPABASE_CARDS: ContentCard[] = SUPABASE_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual fronteira de confiança deve sobreviver e qual contraprova evita segurança aparente?`,
    backMd: `${thesis}. Prove que ${mechanism}; use como mutante o incidente: ${incident}.`,
  })),
);
