import type { ContentCard, ContentExercise } from "./types";
import { POSTMAN_CURRICULUM } from "./postmanCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;

export const POSTMAN_EXERCISES: ContentExercise[] = POSTMAN_CURRICULUM.flatMap(([chapter, , primer, lessons]) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `Em artifacts e sandboxes descartáveis, construa um ensaio de “${title}” que demonstre: ${thesis}. Aplique ${mechanism}, injete um mutante que reproduza “${incident}” e entregue collection/environment por digest, comando reproduzível, wire, assertions, estado e efeitos observados, cleanup e classificação Approved/Pending. Contexto: ${primer}`,
    answerKeyMd: `A resposta localiza ${mechanism} no artifact e no executor pertinente, mata o mutante “${incident}”, preserva secrets e prova ${thesis}. Exija versões/digests, principal/tenant, exit code, reports, observer e cleanup. Parser, mock, screenshot ou status isolado não aprovam Sandbox, Newman, cloud, autorização, concorrência ou efeito sem o runtime correspondente.`,
  })),
);

export const POSTMAN_CARDS: ContentCard[] = POSTMAN_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual invariante e qual evidência reprovam “${incident}”?`,
    backMd: `${thesis}. Observe ${mechanism} no artifact, wire, runner, cloud ou estado pertinente; o mutante precisa falhar no oracle correto, com versões e digests, sem ampliar a alegação além do executor realmente usado.`,
  })),
);
