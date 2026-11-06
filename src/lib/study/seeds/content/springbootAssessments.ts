import type { ContentCard, ContentExercise } from "./types";
import { SPRING_BOOT_CURRICULUM } from "./springbootCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;

export const SPRING_BOOT_EXERCISES: ContentExercise[] = SPRING_BOOT_CURRICULUM.flatMap(([chapter, , primer, lessons]) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `No serviço de reservas Quíron, implemente um experimento para “${title}” que demonstre ${thesis}. Use ${mechanism} como mecanismo candidato e produza um mutante que reproduza o incidente “${incident}”. Entregue configuração e código mínimos, request/fixture e oracle sobre resposta, estado durável ou beans reais; indique quais testes rodam em JUnit puro, @WebMvcTest, @SpringBootTest, PostgreSQL descartável ou provedor fake. Não trate syntax parsing como execução Spring. Para chamadas remotas, preserve chave de idempotência e diferencie timeout antes/depois do efeito; para concorrência, use duas conexões/instâncias e barreira. Contexto do capítulo: ${primer}`,
    answerKeyMd: `A solução deve explicar por que ${thesis}, mostrar como ${mechanism} participa e fazer o mutante “${incident}” falhar por um oracle específico. Evidência mínima: versão Boot/Java, imports/dependências, estado inicial, ação, resposta, estado final e cleanup. Se exigir broker, banco, container, proxy ou cloud que não foram executados, declarar gate externo pendente e fornecer procedimento reproduzível, nunca simular garantia. Separar contrato de framework, semântica SQL/provedor e política do domínio Quíron.`,
  })),
);

export const SPRING_BOOT_CARDS: ContentCard[] = SPRING_BOOT_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Ao revisar “${title}”, qual invariante deve sobreviver a falha e qual evidência distingue o caminho correto?`,
    backMd: `${thesis}. Observe ${mechanism} e use o contraexemplo “${incident}” como mutante; registre efeito real, limite do teste e procedimento de recuperação.`,
  })),
);
