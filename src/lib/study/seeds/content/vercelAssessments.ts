import type { ContentCard, ContentExercise } from "./types";
import { VERCEL_CURRICULUM } from "./vercelCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;

export const VERCEL_EXERCISES: ContentExercise[] = VERCEL_CURRICULUM.flatMap(([chapter, , primer, lessons]) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter, type: TYPES[index], level: LEVELS[index], points: (index + 1) * 10,
    promptMd: `Em sandbox isolado, construa um ensaio de “${title}” que demonstre: ${thesis}. Aplique ${mechanism}, injete o mutante “${incident}” e entregue manifest/digest, comandos, wire, estado, efeitos, observação, cleanup e classificação Approved/Pending. Contexto: ${primer}`,
    answerKeyMd: `A resposta localiza ${mechanism} no artifact e no executor pertinente, mata o mutante “${incident}”, preserva secrets e prova ${thesis}. Exija versões/digests, principal, environment, report, observer e cleanup. Parser, mock, status, dashboard ou URL isolados não aprovam Vercel, DNS, CDN, identidade, concorrência ou efeito sem a superfície correspondente.`,
  })),
);

export const VERCEL_CARDS: ContentCard[] = VERCEL_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual invariante e qual evidência reprovam “${incident}”? `,
    backMd: `${thesis}. Observe ${mechanism} no manifest, deployment, wire, state, audit ou observer pertinente; o mutante precisa falhar com digests e sem ampliar a alegação além do executor usado.`,
  })),
);
