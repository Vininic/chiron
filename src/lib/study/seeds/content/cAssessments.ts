import type { ContentCard, ContentExercise } from "./types";
import { C_CURRICULUM } from "./cCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;

const CHAPTER_EVIDENCE = [
  "Registre compilador, versão, dialeto C17, flags, target e hash do binário; diferencie preprocessing, objeto, link e execução.",
  "Exercite efeitos, short-circuit, enum desconhecido, out intacto e retorno; não atribua resultado esperado a comportamento indefinido.",
  "Use slices sem NUL, canários, lifetime e aliasing; rode Debug/Release e sanitizer quando o toolchain real existir.",
  "Injete falha em cada aquisição/realloc, conte liberações e destrua origem/destino em ordens diferentes, sem cópia rasa de ownership.",
  "Compare bytes, EOF/erro, flush/readback e paths hostis; se fsync/rename forem requisito, execute adapter do sistema em staging.",
  "Compile headers em translation units separadas, provoque rebuild por header/flag e faça cada mutante falhar com oráculo de estado.",
  "Teste extremos de comparador, clock/locale, NaN e bytes de entropia; não use rand como CSPRNG nem double como centavos.",
  "Controle interleaving com barreira, reavalie condition predicate e prove limite/shutdown; banco de duas sessões continua gate distinto.",
  "Fragmente frames, simule send parcial/timeout pós-efeito, certificado inválido e logs com sentinel, sempre com key estável.",
  "Compare Debug/Release, ABI/endianness e telemetria sob falha; não transforme profiler ou ausência de alerta em prova de correção.",
  "Execute driver/banco real com parâmetros, row count, constraints, rollback/outbox; compile consumidor FFI e faça restore em ambiente isolado.",
  "Use matriz de última vaga, replay, tenant cruzado, crash points, fuzz/carga e restore; cada claim deve apontar para seu gate real.",
] as const;

export const C_EXERCISES: ContentExercise[] = C_CURRICULUM.flatMap(([chapter, , primer, lessons], chapterIndex) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `No núcleo C do Quíron, construa uma experiência para “${title}” que teste: ${thesis}. Implemente ${mechanism} no baseline e um mutante que reproduza “${incident}”. ${CHAPTER_EVIDENCE[chapterIndex]} Entregue fonte/fixture, estado inicial, comando, resultado esperado, saída e cleanup. Se compiler, banco, TLS, provedor ou storage não estiver disponível, registre o gate pendente em vez de afirmar que um fake o provou. Contexto: ${primer}`,
    answerKeyMd: `A resposta correta demonstra ${thesis}, localiza ${mechanism} e faz o mutante “${incident}” divergir em bytes, memória, status, estado durável, efeito, sigilo ou recuperação. Evidência específica: ${CHAPTER_EVIDENCE[chapterIndex]} O relatório inclui dialeto/compilador/flags/target e separa revisão, compile, runtime e integração. Não aceite apenas “não crashou”, parser textual ou retorno zero; preserve key/eventId em timeout e readback após falha.`,
  })),
);

export const C_CARDS: ContentCard[] = C_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual invariante C precisa sobreviver e que observação reprova o incidente “${incident}”?`,
    backMd: `${thesis}. Inspecione ${mechanism}; o mutante só é refutado por evidência de bytes/memória/estado/efeito no gate correspondente, com limitações declaradas.`,
  })),
);
