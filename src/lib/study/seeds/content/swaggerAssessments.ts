import type { ContentCard, ContentExercise } from "./types";
import { SWAGGER_CURRICULUM } from "./swaggerCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;
const EVIDENCE = [
  "Entregue source e bundle com versões/dialetos, resolução determinística e uma reconciliação design-first/code-first que exponha drift real.",
  "Capture método, path, headers, media type, status, body, efeito e retry; prove idempotência e estado desconhecido sem reduzir HTTP a CRUD nominal.",
  "Mostre bytes de wire para cada localização/style/explode, limites, Unicode, duplicate keys e um parser mutante que seja rejeitado.",
  "Exercite JSON, form, multipart, upload e streaming com tamanho, ownership, content negotiation e memória bounded no boundary real.",
  "Fixe o dialeto, valide composição/polimorfismo/constraints e produza witness para ambiguidade, null/ausência e format não implementado.",
  "Resolva o grafo offline em dois diretórios, preserve identidade/recursão e prove lock/digest/licença de toda referência externa.",
  "Valide responses, headers e Problem, então injete SSRF, replay, retry e kill points em callback/webhook com efeitos observados.",
  "Gere a tabela verdade de security, use principals reais e demonstre issuer/audience/scope, OR/AND, tenant e zero efeitos proibidos.",
  "Extraia examples, renderize Markdown/UI/portal, teste XSS, links, CORS/OAuth/storage e prove que artifact, ambiente e lifecycle são visíveis.",
  "Execute parser/validator/linter/contract/property gates separadamente e mate um mutante por regra, preservando seed e diagnóstico reproduzível.",
  "Compare bundles por direção, gere witness e rode consumers antigos contra mudanças breaking e aditivas, deprecation, sunset e pactos.",
  "Gere SDK/stub em árvores limpas, compile, capture wire, inspecione package e prove template/drift/retry/auth/cancellation com toolchain fixada.",
  "Promova o mesmo digest por registry/gateway/portal, valide provenance/policies/telemetry e execute rollback com todas as superfícies reconciliadas.",
  "Apresente o Quíron completo: bundle, última vaga concorrente, SDK/consumers/release e incidente com restore, RTO/RPO e cadeia de evidência.",
] as const;

export const SWAGGER_EXERCISES: ContentExercise[] = SWAGGER_CURRICULUM.flatMap(([chapter, , primer, lessons], chapterIndex) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `Em artifacts e sandboxes descartáveis, construa um ensaio para “${title}” que demonstre: ${thesis}. Aplique ${mechanism} no baseline e um mutante que reproduza “${incident}”. ${EVIDENCE[chapterIndex]} Entregue versões e digests, comando reproduzível, estado antes/depois, efeitos, diagnósticos, cleanup e a fronteira honesta entre executado e Pending. Contexto: ${primer}`,
    answerKeyMd: `A resposta prova ${thesis}, localiza ${mechanism} no source, bundle, wire, runtime ou operação e faz “${incident}” falhar no oracle correto. Evidência obrigatória: ${EVIDENCE[chapterIndex]} Identifique Specification/dialeto, parser/validator/linter/generator/runtime e seus digests, principal/tenant, artifact publicado e efeito observado. Não aceite Swagger UI verde, YAML válido, mock, status isolado, diff aditivo ou assinatura sem provenance como prova mais ampla.`,
  })),
);

export const SWAGGER_CARDS: ContentCard[] = SWAGGER_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual contrato precisa permanecer verdadeiro e qual evidência reprova “${incident}”?`,
    backMd: `${thesis}. Observe ${mechanism} no artifact resolvido e no boundary pertinente; o mutante precisa falhar por parse, validação, wire, policy, compatibilidade, efeito, promoção ou restore, sempre registrando versões/digests e sem ampliar a alegação além do executor real.`,
  })),
);
