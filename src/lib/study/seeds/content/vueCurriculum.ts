export type VueLevel = "basico" | "intermediario" | "avancado";
export type VueLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type VueChapter = readonly [title: string, level: VueLevel, primer: string, lessons: readonly VueLesson[]];

/** Baseline editorial planejado: Vue 3, Composition API e TypeScript; versões e runners reais serão fixados nos gates. */
export const VUE_CURRICULUM: readonly VueChapter[] = [
  ["Runtime Vue e SFC", "basico", "Vue começa por módulos, compiler e lifecycle verificáveis, não por snippets mágicos.", [
    ["Versões, createApp e mounts", "runtime, compiler, plugins e container montado precisam identidade e ownership explícitos", "createApp, App, app.use, mount, unmount e feature flags", "duas apps montaram listeners e estado no mesmo container"],
    ["Single-File Components", "template, script e style do SFC formam um módulo compilado com fronteiras observáveis", "script setup, lang ts, scoped styles, compiler-sfc e source maps", "macro foi tratada como função runtime e build divergiu"],
    ["Templates, directives e expressions", "template declara renderização limitada sem transformar entrada em código", "v-bind, v-on, v-if, v-for, keys e compiler escapes", "HTML hostil entrou por v-html e executou no browser"],
    ["Lifecycle e cleanup", "cada efeito adquirido por um componente é liberado no lifecycle correto", "onMounted, onUnmounted, effect scopes, listeners e AbortController", "navegação acumulou timer e request tardio sobrescreveu tela"],
  ]],
  ["Reatividade e estado local", "basico", "Reatividade é um grafo de dependências; identidade, leitura e escrita definem atualização.", [
    ["ref, reactive e identidade", "proxy e ref preservam contratos diferentes e destructuring pode perder tracking", "ref, reactive, toRef, toRefs, shallowRef e markRaw", "campo desestruturado deixou a UI congelada"],
    ["computed e estado derivado", "estado derivado é calculado, cacheado e sem efeito lateral", "computed getters, writable computed e dependency tracking", "watch copiou total para segundo estado e ficou divergente"],
    ["watch, watchEffect e flush", "efeitos declaram fonte, timing, cancellation e cleanup", "watch, watchEffect, flush pre/post/sync e onCleanup", "resposta antiga venceu busca mais nova"],
    ["Scheduler, nextTick e DOM", "atualização em lote separa mudança de estado de DOM já reconciliado", "job queue, batching, nextTick e template refs", "teste leu DOM antes do flush e virou intermitente"],
  ]],
  ["Componentes e contratos", "basico", "Componentes colaboram por contratos tipados e fluxo explícito, não por mutação implícita.", [
    ["Props, defaults e validação", "props são entrada readonly com ausência, default e validação coerentes", "defineProps, withDefaults, runtime validators e Boolean casting", "filho mutou objeto prop e alterou pai sem evento"],
    ["Emits e v-model", "eventos e modelos declaram payload, ownership e direção da mudança", "defineEmits, defineModel, modifiers e multiple models", "evento stringly enviou payload incompatível"],
    ["Slots e composição visual", "slot é callback de renderização com escopo e fallback definidos", "default/named/scoped slots, slot props e fragments", "slot assumiu estado interno e quebrou encapsulamento"],
    ["Provide, inject e boundaries", "injeção atravessa árvore apenas por chave e contrato controlados", "InjectionKey, provide/inject, readonly e app-level provides", "string key colidiu e expôs serviço mutável global"],
  ]],
  ["Formulários e interação", "intermediario", "Entrada do usuário requer parsing, intenção, acessibilidade e estados assíncronos coerentes.", [
    ["Inputs, v-model e parsing", "valor textual vira tipo de domínio por parser explícito e validado", "v-model modifiers, computed adapters, IME e controlled inputs", "number vazio virou zero e criou reserva indevida"],
    ["Validação e errors", "erros distinguem campo, formulário, servidor e conflito sem apagar edição", "touched/dirty, schemas, async validation e error summary", "resposta tardia removeu erro de valor novo"],
    ["Acessibilidade e foco", "teclado, nome acessível, foco e anúncio fazem parte do contrato", "semantic HTML, labels, aria-live, focus trap e restoration", "modal fechou sem devolver foco e prendeu teclado"],
    ["Submit, optimistic UI e replay", "submit impede duplicata visual sem mentir sobre outcome incerto", "pending state, idempotency key, rollback e reconciliation", "duplo clique gerou duas chaves e duas reservas"],
  ]],
  ["Composables e arquitetura", "intermediario", "Composables encapsulam política reativa e recursos, sem virar estado global acidental.", [
    ["Composables e ownership", "composable declara entradas, retornos, lifecycle e possibilidade de múltiplas instâncias", "useX functions, refs readonly, effectScope e cleanup", "composable de módulo compartilhou estado entre usuários"],
    ["Ports, services e adapters", "UI coordena portas tipadas e domínio não depende de Vue", "TypeScript interfaces, dependency injection, commands e outcomes", "componente importou fetch global e ficou intestável"],
    ["Estado de servidor e cache", "dados remotos preservam stale, loading, error, cancellation e identidade de consulta", "query keys, dedupe, invalidation, optimistic updates e AbortSignal", "cache por ID vazou resposta de outro tenant"],
    ["Pinia e estado compartilhado", "store possui domínio e ciclo claros, sem duplicar servidor ou esconder efeitos", "defineStore, setup stores, actions, getters, plugins e reset", "store persistida guardou token e estado de usuário anterior"],
  ]],
  ["Roteamento e navegação", "intermediario", "URL é estado público tipado; navegação, autorização e carregamento precisam convergir.", [
    ["Routes, params e query", "route record e parser transformam URL em estado válido e canônico", "Vue Router, typed params, query codecs, aliases e redirects", "query inválida virou objeto parcial privilegiado"],
    ["Guards e autorização", "guard melhora navegação, mas servidor continua autoridade e redirects são fechados", "beforeEach, per-route guards, meta e return navigation", "guard cliente foi tratado como controle de acesso"],
    ["Lazy routes e chunks", "code splitting mantém fallback, erro, prefetch e compatibilidade de release", "dynamic imports, Suspense, error boundaries e chunk recovery", "deploy removeu chunk antigo durante sessão ativa"],
    ["Scroll, foco e transições", "navegação restaura posição e foco sem esconder conteúdo ou quebrar reduced motion", "scrollBehavior, afterEach, Transition e prefers-reduced-motion", "transição manteve página invisível após cancelamento"],
  ]],
  ["HTTP, realtime e offline", "intermediario", "A fronteira de rede precisa schema, cancellation, autenticação e outcomes honestos.", [
    ["HTTP client e contratos", "cliente fecha base URL, métodos, headers, schema e categorias de erro", "fetch adapters, AbortSignal, codecs e typed outcomes", "200 com corpo incompatível corrompeu store"],
    ["Auth, cookies e CSRF", "browser envia credenciais conforme origem e mutations provam intenção", "secure cookies, SameSite, CSRF, bearer memory e refresh coordination", "token persistido foi exfiltrado por script injetado"],
    ["SSE, WebSocket e ordering", "eventos realtime têm identidade, ordem, reconnect e resync", "EventSource, WebSocket, sequence, heartbeat e backoff", "reconnect reaplicou evento e duplicou contador"],
    ["Service worker e offline", "cache offline diferencia artifact, dados públicos e mutations pendentes", "Cache API, update lifecycle, background sync e conflict UI", "service worker antigo serviu schema incompatível"],
  ]],
  ["Testes e qualidade Vue", "avancado", "A suíte mede comportamento por camadas e mata mutantes, não implementações internas.", [
    ["Unit e component tests", "testes pequenos observam contrato do composable e DOM acessível do componente", "Vitest, Vue Test Utils, fixtures, fake timers e user events", "teste chamou método interno e ignorou evento quebrado"],
    ["Router, store e integration", "integração monta plugins reais isolados e controla rede na fronteira", "createTestingPinia, memory history, MSW e contract fixtures", "store singleton vazou estado entre testes"],
    ["Browser e visual", "browser real verifica foco, cookies, CSP, layout e navegação", "Playwright, accessibility tree, screenshots e trace", "jsdom aprovou modal impossível de usar por teclado"],
    ["Static, mutation e property", "tipos, lint, mutantes e geradores atacam estados que exemplos felizes não cobrem", "vue-tsc, ESLint, mutation testing, fast-check e corpus", "remoção de filtro tenant sobreviveu à suíte"],
  ]],
  ["Segurança Vue", "avancado", "O frontend reduz exposição e sinks, mas não substitui autorização e validação do servidor.", [
    ["XSS, HTML e URLs", "texto, HTML rico, atributos e URLs exigem políticas diferentes", "escaping, sanitization, Trusted Types, URL allowlists e CSP", "v-html renderizou SVG ativo vindo da API"],
    ["Supply chain e build", "plugins, packages e scripts de build executam com privilégio e precisam provenance", "lockfile, registries, lifecycle scripts, audit, SBOM e signing", "pacote typosquat leu token do CI"],
    ["Secrets e configuração pública", "bundle e source map são públicos e nunca contêm segredo", "import.meta.env, runtime config, source maps e scanners", "chave privada foi embutida como variável VITE"],
    ["DoS, abuse e incidentes", "UI limita trabalho local e coopera com quotas sem transformar bloqueio visual em segurança", "debounce, budgets, worker, backpressure, rate outcomes e kill switches", "lista hostil travou main thread e retry ampliou outage"],
  ]],
  ["Performance e observabilidade", "avancado", "Otimização passa somente com orçamento, perfil e correção preservada.", [
    ["Renderização e virtual DOM", "keys, estabilidade e granularidade reduzem trabalho sem alterar identidade", "patch algorithm, v-memo, stable props e list keys", "índice como key trocou estado entre linhas"],
    ["Bundles e carregamento", "budget considera JS, CSS, fontes, imagens, chunks e cache por rota", "tree shaking, code splitting, preload, compression e bundle analysis", "barrel import incluiu editor inteiro no shell"],
    ["Web Vitals e profiling", "métricas de campo e profiles reproduzíveis orientam o gargalo real", "LCP, INP, CLS, Performance API e Vue Devtools profiler", "microbenchmark melhorou função fora do caminho crítico"],
    ["Logs, traces e privacy", "telemetria correlaciona navegação e request com cardinalidade e redação", "error boundaries, trace context, sampling, source maps e PII policy", "payload e token foram enviados ao error tracker"],
  ]],
  ["Entrega e recuperação Vue", "avancado", "Build, deploy e recuperação mantêm compatibilidade entre HTML, chunks, API e estado persistido.", [
    ["Build, lock e provenance Vue", "artifact reproduz source, lock, toolchain e assets sem secrets", "Vite build, lockfile, Node version, SBOM, digest e signing", "build resolveu latest e produziu chunk diferente"],
    ["Deploy, CDN e rollback", "HTML e assets imutáveis permitem rollout e rollback sem chunk perdido", "hashed assets, cache-control, atomic publish, canary e retention", "CDN removeu asset ainda referenciado por aba aberta"],
    ["Migrations de estado cliente", "storage, cache e mensagens toleram versões antigas e novas", "schema version, migrations, feature flags e compatibility windows", "release nova não conseguiu ler fila offline antiga"],
    ["Falhas, recovery e runbooks", "chunk/API/realtime/storage failures têm fallback testado e evidência", "error boundaries, reload policy, reconciliation, rollback e incident drills", "loop de reload impediu usuário de recuperar trabalho"],
  ]],
  ["Projeto Quíron em Vue", "avancado", "A banca integra UI acessível, contratos, última vaga, segurança, carga e deploy.", [
    ["Arquitetura Vue do Quíron", "componentes, composables, store e adapters preservam uma fonte de verdade", "SFCs, commands, Pinia/query cache, router e HTTP ports", "estado duplicado mostrou vaga depois de esgotada"],
    ["Última vaga e replay Vue", "duplo submit e respostas fora de ordem preservam key, identity e outcome", "idempotency key, pending/unknown, cancellation e reconciliation", "retry criou chave nova e duplicou reserva"],
    ["Segurança, testes e carga Vue", "corpus hostil e carga de interação preservam tenant, acessibilidade e budgets", "browser, mutation/property/fuzz, long tasks e network faults", "otimização removeu validação e vazou tenant"],
    ["Banca, deploy e recovery Vue", "publicação prova artifact, mixed clients, CDN, offline upgrade e rollback", "evidence matrix, canary, chunk retention, storage migration e drills", "teste unitário foi confundido com browser e CDN verificados"],
  ]],
];
