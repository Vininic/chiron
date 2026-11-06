import type { ContentCard, ContentExercise } from "./types";
import { PHP_CURRICULUM } from "./phpCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;
const EVIDENCE = [
  "Registre PHP/SAPI/php.ini/extensões e execute parsers, tipos, Unicode e fluxo fechado com casos de fronteira.",
  "Exercite invariantes, enums/value objects, composition e registries fechados sem reflection dirigida por input.",
  "Prove categorias de Throwable, ownership de streams/files, JSON seguro e datas/decimais independentes de locale.",
  "Atravesse a stack HTTP: bytes, headers, sessions/cookies, PSR middleware, escaping, CSRF e CSP no browser quando aplicável.",
  "Use PDO e engine alvo para binds, duas sessões, catálogo/constraints/migrations, mapping e isolamento por tenant.",
  "Registre Composer lock/platform/audit, autoload/preload, production graph/scopes e matriz de compatibilidade consumidora.",
  "Execute o mesmo processo com tenants sequenciais, fila/retry, outbox claim/fence, kill points e event loop real quando alegado.",
  "Combine PHPUnit/contracts, stack HTTP/banco, static/mutation e property/fuzz com seed, shrink e state/effect oracle.",
  "Mate bypasses de auth/tenant, injection, upload, SSRF, secret/TLS/headers e limites de DoS sem depender de scanner genérico.",
  "Meça OPcache/FPM/proxy, telemetry cardinality/redaction, profiling/load/soak e preserve correção sob overload.",
  "Construa artifact imutável com provenance, execute mixed fleet/migrations/rollback, drain/kill e restore sem egress.",
  "Apresente a banca Quíron completa: arquitetura, última vaga/replay, segurança/carga e deploy/crash/restore com IDs estáveis.",
] as const;

export const PHP_EXERCISES: ContentExercise[] = PHP_CURRICULUM.flatMap(([chapter, , primer, lessons], chapterIndex) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `Na implementação PHP do Quíron, construa um cenário para “${title}” que teste: ${thesis}. Implemente ${mechanism} no baseline e um mutante que reproduza “${incident}”. ${EVIDENCE[chapterIndex]} Entregue source, fixture, comando, output, estado, efeito e cleanup. Se PHP, Composer, banco, proxy/browser, broker, provider ou ambiente de carga/restore não estiver disponível, mantenha o gate Pending em vez de atribuí-lo a fake. Contexto: ${primer}`,
    answerKeyMd: `A resposta demonstra ${thesis}, localiza ${mechanism} e faz “${incident}” divergir em HTTP, tenant, transaction, estado, efeito, sigilo, recursos ou recuperação. Evidência específica: ${EVIDENCE[chapterIndex]} O relatório identifica PHP/SAPI/extensões, packages/adapters, schema/config, artifact/source hash e separa teste local de integração real. Não aceite só status, ausência de exception ou coverage: faça readback e preserve tenant, idempotency key, reservation ID e event ID.`,
  })),
);

export const PHP_CARDS: ContentCard[] = PHP_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual contrato PHP precisa sobreviver e que evidência reprova “${incident}”?`,
    backMd: `${thesis}. Inspecione ${mechanism}; o mutante só é refutado pelo gate correspondente com HTTP, tenant, transaction, estado, efeito, sigilo, recursos ou recovery, registrando PHP/SAPI/extensões, artifact e limites do executor.`,
  })),
);
