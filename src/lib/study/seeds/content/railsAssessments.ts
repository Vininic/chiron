import type { ContentCard, ContentExercise } from "./types";
import { RAILS_CURRICULUM } from "./railsCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;
const EVIDENCE = [
  "Registre Ruby/Rails/Bundler/adapters, boot/eager-load/reload, artifact e ausência de side effects no load.",
  "Exercite routes, params, HTTP mapping, cookies e CSRF pela stack, com cross-tenant e readback.",
  "Use catálogo, migrations, constraints, callbacks e duas sessões para separar UX de integridade durável.",
  "Registre SQL/binds/plans/query counts, keyset mutations, cache collisions e memória sob cardinalidade.",
  "Mate bypasses de authentication, tenant scope, injection, SSRF, upload, secrets, TLS e supply chain.",
  "Execute backend de jobs, retries, outbox, claim/fence, provider sandbox, Mailer/Cable e kill points.",
  "Use browser para XSS/CSP, Turbo, Stimulus/assets, locale/timezone, keyboard/focus e accessibility.",
  "Valide JSON/OpenAPI, deadlines/TLS, apply-drop, webhook raw signature/inbox e quotas distribuídas.",
  "Combine unit/contracts, request/system, duas sessões, property/mutation/fuzz e full state/effect oracle.",
  "Meça telemetry, cache store, Puma/pools/signals, memory/overload/load com correctness e recovery.",
  "Construa artefato imutável, execute mixed fleet/canary/rollback e restore pausado com IDs preservados.",
  "Apresente matriz reproduzível de arquitetura, last-seat/replay, segurança/carga e deploy/restore.",
] as const;

export const RAILS_EXERCISES: ContentExercise[] = RAILS_CURRICULUM.flatMap(([chapter, , primer, lessons], chapterIndex) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter, type: TYPES[index], level: LEVELS[index], points: (index + 1) * 10,
    promptMd: `Na aplicação Rails do Quíron, construa uma experiência para “${title}” que teste: ${thesis}. Implemente ${mechanism} no baseline e um mutante que reproduza “${incident}”. ${EVIDENCE[chapterIndex]} Entregue código, fixture, comando, output, estado, efeito e cleanup. Se Rails, banco, browser, queue, TLS ou provider não estiver disponível, mantenha o gate Pending em vez de atribuí-lo a fake. Contexto: ${primer}`,
    answerKeyMd: `A resposta demonstra ${thesis}, localiza ${mechanism} e faz “${incident}” divergir em HTTP, tenant, transaction, state, effect, secrecy, performance ou recovery. Evidência específica: ${EVIDENCE[chapterIndex]} O relatório identifica Ruby/Rails/gems, adapters, schema/config, artifact/source hash e separa modelo local de integração real. Não aceite só status, ausência de exception ou DOM: faça readback e preserve tenant, key e eventId.`,
  })),
);

export const RAILS_CARDS: ContentCard[] = RAILS_CURRICULUM.flatMap(([chapter, , , lessons]) => lessons.map(([title, thesis, mechanism, incident]) => ({
  nodeTitle: chapter,
  frontMd: `Em “${title}”, qual contrato Rails precisa sobreviver e que evidência reprova “${incident}”?`,
  backMd: `${thesis}. Inspecione ${mechanism}; o mutante só é refutado no gate correspondente por HTTP, tenant, transaction, state, effect, secrecy, performance ou recovery, com artifact e limites declarados.`,
})));
