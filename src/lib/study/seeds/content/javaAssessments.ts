import type { ContentCard, ContentExercise } from "./types";
import { JAVA_CURRICULUM } from "./javaCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;

export const JAVA_EXERCISES: ContentExercise[] = JAVA_CURRICULUM.flatMap(([chapter, , primer, lessons]) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `Em um diretório descartável e sem IDE, implemente um experimento Java para “${title}” que prove: ${thesis}. Compile e execute um baseline baseado em ${mechanism} e um mutante que reproduza “${incident}”. Registre versões de java/javac, opções, stdout, stderr, exit code e estado final; para concorrência controle barreiras e deadline, para I/O use recursos temporários e cleanup exato, e para JVM capture JFR/GC/class-loading ou plano equivalente quando pertinente. Explique a fronteira entre garantia da JLS/JVM, comportamento de biblioteca e característica da implementação. Contexto: ${primer}`,
    answerKeyMd: `A resposta deve demonstrar “${thesis}” por compilação e execução reproduzíveis, explicar ${mechanism} e fazer o mutante falhar especificamente pelo incidente “${incident}”. Evidência mínima: fonte autocontido, versão/release alvo, comando exato, oracle sobre saída/estado, causa preservada, timeout e cleanup. Preview, GC, JIT, scheduler, filesystem, rede e banco devem ser rotulados como dependentes de implementação/ambiente quando a especificação não garante o resultado observado.`,
  })),
);

export const JAVA_CARDS: ContentCard[] = JAVA_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual contrato Java precisa sobreviver e qual mutante discrimina uma explicação apenas aparente?`,
    backMd: `${thesis}. Prove com ${mechanism}; use como contraprova o incidente: ${incident}.`,
  })),
);
