import type { ContentCard, ContentExercise } from "./types";
import { FLASK_CURRICULUM } from "./flaskCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;
const EVIDENCE = [
  "Registre Python/Flask/Werkzeug, factory, contexts, CLI/server e configuração sem efeitos no import.",
  "Atravesse routing e HTTP com bytes, schemas, limites, error mapping, blueprints, hooks e middleware reais.",
  "Verifique Jinja, sessão/cookies, CSRF, CSP, assets, forms e redirects no browser quando a alegação depender dele.",
  "Prove commands/services/ports, composition root, outcomes/transactions e policy tenant sem globals Flask.",
  "Use SQLAlchemy e engine alvo para Session, constraints/Alembic, queries e duas transações concorrentes.",
  "Execute schemas/OpenAPI, cliente HTTP com deadlines, webhook assinado e streaming/arquivos com ownership.",
  "Exercite worker real, retries, DLQ, outbox claim/fence, Unknown, reconciliation, async e cancellation.",
  "Combine pytest/contracts, stack HTTP/banco/browser, typing/static/mutation e property/fuzz com seed e shrink.",
  "Mate bypasses de auth/tenant, injection/upload/SSRF, secrets/TLS/headers e DoS com state/effect oracle.",
  "Meça servidor/workers, telemetria, cache/state, profiling/load/soak e preserve correção sob overload.",
  "Construa artifact imutável, rode mixed fleet/migrations/rollback, drain/kill e restore isolado com IDs estáveis.",
  "Apresente a banca Quíron: arquitetura, última vaga/replay, segurança/carga e deploy/crash/restore no mesmo digest.",
] as const;

export const FLASK_EXERCISES: ContentExercise[] = FLASK_CURRICULUM.flatMap(([chapter, , primer, lessons], chapterIndex) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `Na implementação Flask do Quíron, construa um cenário para “${title}” que teste: ${thesis}. Implemente ${mechanism} no baseline e um mutante que reproduza “${incident}”. ${EVIDENCE[chapterIndex]} Entregue source, fixture, comando, output, estado, efeito e cleanup. Se Python, Flask, servidor, banco, browser, broker, provider ou ambiente de carga/restore não estiver disponível, mantenha o gate Pending em vez de atribuí-lo a fake. Contexto: ${primer}`,
    answerKeyMd: `A resposta demonstra ${thesis}, localiza ${mechanism} e faz “${incident}” divergir em HTTP, tenant, transaction, estado, efeito, sigilo, recursos ou recuperação. Evidência: ${EVIDENCE[chapterIndex]} Identifique versões, packages/adapters, schema/config, artifact/source hash e separe unidade de integração real. Não aceite só status, ausência de exception ou coverage: faça readback e preserve idempotency key, reservation ID e event ID.`,
  })),
);

export const FLASK_CARDS: ContentCard[] = FLASK_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual contrato Flask precisa sobreviver e que evidência reprova “${incident}”?`,
    backMd: `${thesis}. Inspecione ${mechanism}; o mutante só é refutado pelo gate correspondente com HTTP, tenant, transaction, estado, efeito, sigilo, recursos ou recovery, registrando Python/Flask, servidor, artifact e limites do executor.`,
  })),
);
