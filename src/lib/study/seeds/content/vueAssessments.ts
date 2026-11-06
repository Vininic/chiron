import type { ContentCard, ContentExercise } from "./types";
import { VUE_CURRICULUM } from "./vueCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;
const EVIDENCE = [
  "Registre Vue/compiler/Vite/TypeScript/browser, compile e monte SFC, observe lifecycle e cleanup sem efeitos no import.",
  "Prove tracking, identity, computed purity, watcher cancellation/flush e DOM após scheduler real.",
  "Exercite props/emits/v-model/slots/injection com contratos tipados, runtime, isolamento e fluxo unidirecional.",
  "Atravesse parsing, validação concorrente, teclado/foco/live regions e submit idempotente com outcomes honestos.",
  "Prove composable scopes, ports/adapters, query cache tenant e Pinia por app/request sem singleton oculto.",
  "Execute router params/query/guards/chunks/scroll/foco em history/browser e mixed-release quando alegado.",
  "Use HTTP schema/deadlines, cookie/CSRF, realtime ordering/resync e service worker/offline com IDs estáveis.",
  "Combine Vitest/component, router/store/network integration, browser/visual/a11y, vue-tsc/mutation/property/fuzz.",
  "Mate XSS/URL, supply-chain/secret, storage e DoS/retry/resource bypasses com corpus e state/effect oracle.",
  "Meça render/virtualization, bundles/CDN, Web Vitals/profiles e telemetry privacy sem sacrificar correção.",
  "Construa artifact imutável, publique atomically, teste clients/store antigos e recovery/runbooks sem loops.",
  "Apresente Quíron completo: arquitetura, última vaga/replay, security/load e banca deploy/restore no mesmo digest.",
] as const;

export const VUE_EXERCISES: ContentExercise[] = VUE_CURRICULUM.flatMap(([chapter, , primer, lessons], chapterIndex) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `Na implementação Vue.js do Quíron, construa um cenário para “${title}” que teste: ${thesis}. Implemente ${mechanism} no baseline e um mutante que reproduza “${incident}”. ${EVIDENCE[chapterIndex]} Entregue source, fixture, comando, output, DOM/acessibilidade, estado, efeito e cleanup. Se Vue/compiler, browser, API, CDN, service worker, provider ou ambiente de carga/recovery não estiver disponível, mantenha o gate Pending em vez de atribuí-lo a fake. Contexto: ${primer}`,
    answerKeyMd: `A resposta demonstra ${thesis}, localiza ${mechanism} e faz “${incident}” divergir em DOM, acessibilidade, tenant, estado, efeito, sigilo, recursos ou recuperação. Evidência específica: ${EVIDENCE[chapterIndex]} Identifique versões, packages/adapters, config/schema, source/artifact digest e separe teste puro de runtime/browser real. Não aceite só snapshot, ausência de exception, coverage ou Lighthouse: faça readback e preserve operation, reservation e event IDs.`,
  })),
);

export const VUE_CARDS: ContentCard[] = VUE_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual contrato Vue.js precisa sobreviver e que evidência reprova “${incident}”?`,
    backMd: `${thesis}. Inspecione ${mechanism}; o mutante só é refutado pelo gate correspondente com DOM, acessibilidade, tenant, estado, efeito, sigilo, recursos ou recovery, registrando Vue/compiler/browser, artifact e limites do executor.`,
  })),
);
