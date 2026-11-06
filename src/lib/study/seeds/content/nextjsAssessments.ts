import type { ContentCard, ContentExercise } from "./types";

const ex = (nodeTitle: string, type: 1 | 2 | 3, level: ContentExercise["level"], points: number, promptMd: string, answerKeyMd: string): ContentExercise => ({
  nodeTitle, type, level, points,
  promptMd: `${promptMd} Registre as invariantes, a evidência observável e pelo menos um caso adverso que faria uma implementação superficial falhar.`,
  answerKeyMd,
});
const card = (nodeTitle: string, frontMd: string, backMd: string): ContentCard => ({ nodeTitle, frontMd, backMd });

const routing = "App Router, segmentos e navegação";
const components = "Server e Client Components";
const cache = "Dados, Cache Components e revalidation";
const actions = "Formulários e Server Actions";
const streaming = "Streaming, loading e composição assíncrona";
const errors = "Erros, not-found e recuperação";
const auth = "Autenticação e autorização";
const handlers = "Route Handlers, APIs e webhooks";
const metadata = "Metadata, imagens e SEO técnico";
const performance = "Performance e observabilidade";
const testing = "Testes, deploy e operação";
const project = "Projeto integrador: aplicação Next.js";

export const NEXTJS_EXERCISES: ContentExercise[] = [
  ex(routing, 1, "beginner", 10, "Desenhe a árvore App Router de catálogo, curso por slug e modal interceptado. Explique a URL direta, o fechamento do modal pelo histórico e onde `params` assíncronos são aguardados e validados.", "A árvore usa segmentos/grupos sem alterar URL, rota paralela/interceptada com fallback, page direta funcional, params awaited e slug convertido em input de domínio seguro."),
  ex(routing, 2, "intermediate", 20, "Implemente filtros por busca, nível e cursor nos search params. Preserve parâmetros compatíveis, remova valores vazios, reinicie paginação e prove com back/forward que URL reproduz exatamente a tela.", "Há parser canônico com limites/allowlist, atualização via URLSearchParams/replace ou Link, cursor resetado quando filtro muda e testes de navegação/restauração."),
  ex(routing, 3, "advanced", 30, "Audite uma árvore com layouts persistentes, template, prefetch e estado copiado de props. Corrija identidade stale entre entidades e demonstre navegação fria, quente, interrompida e URL direta sem mutation em GET.", "A solução posiciona state por lifecycle, usa key/segmento deliberado, mantém shell estável, prefetch seguro, cancela trabalho velho e prova equivalência entre navegação cliente e reload."),

  ex(components, 1, "beginner", 10, "Classifique página, lista, botão favorito, parser Markdown e acesso ao banco entre Server e Client Components. Justifique cada fronteira pelo uso de estado, eventos, APIs de browser, segredo e custo de bundle.", "Server é padrão para dados/conteúdo; apenas interação/browser recebe use client; DAL é server-only; DTO serializável mínimo cruza a fronteira e conteúdo server pode compor por slots."),
  ex(components, 2, "intermediate", 20, "Refatore um layout inteiro marcado `use client` para uma ilha interativa. Inspecione o grafo antes/depois, elimine entidade crua nas props e teste hydration, foco e comportamento com JavaScript lento.", "Boundary desce ao controle, imports pesados/segredos ficam server, props são allowlisted, primeiro render é compatível e evidência de bundle/interaction comprova o ganho."),
  ex(components, 3, "advanced", 30, "Crie sentinelas `server-only` e `client-only`, incluindo um barrel que reexporta ambientes incompatíveis. Faça builds que devem falhar e explique por que essas sentinelas não substituem autorização nem garantem runtime Edge.", "Testes detectam imports diretos/transitivos; DAL/segredo nunca entram no cliente; browser API não roda no servidor; policy continua no caso de uso e compatibilidade runtime é validada separadamente."),

  ex(cache, 1, "beginner", 10, "Compare deduplicação na render, React cache e Cache Components usando page e metadata que leem o mesmo curso. Meça origem em duas chamadas, nova request, cache cold, hit e após expiração.", "A resposta separa escopos, mantém parser/autorização, demonstra dedupe por render versus persistência e não promete frescor sem lifetime/tag explícitos."),
  ex(cache, 2, "intermediate", 20, "Implemente leitura pública com `use cache`, `cacheLife` e chave por slug/locale. Teste argumentos equivalentes, mudança de locale, deploy, dado privado e cardinalidade, justificando quando manter a leitura dinâmica.", "Key inclui todos os inputs, resultado é DTO público serializável, request APIs não são capturadas, lifetime segue tolerância e dado pessoal permanece fora do cache compartilhado."),
  ex(cache, 3, "advanced", 30, "Projete publicação e progresso usando `cacheTag`, `updateTag` e `revalidateTag`. Force falha depois do commit, invalidação perdida e edições concorrentes; prove read-your-writes sem confundir tags com controle de versão.", "Commit precede sinal, progresso usa escopo/consistência forte, público pode usar SWR, comando é idempotente, reconciliador refaz invalidação e conflito é resolvido por versão."),

  ex(actions, 1, "beginner", 10, "Trate uma Server Action como endpoint: valide FormData desconhecido, obtenha actor no servidor, autorize recurso e modele resultado serializável. Chame-a diretamente sem renderizar o botão e tente campos forjados.", "A action não confia em hidden/type, usa schema/allowlist, sessão por request, policy na DAL, erro esperado tipado e nenhuma entidade/segredo no retorno."),
  ex(actions, 2, "intermediate", 20, "Construa um formulário com `useActionState`, pending localizado, resumo de erros e progressive enhancement. Teste submissões rápidas, hydration lenta, preservação de valores, foco e resposta antiga fora de ordem.", "State é union, form funciona nativamente, pending bloqueia conflito, mensagens são associadas/acessíveis, attempt atual vence e reset ocorre apenas após sucesso confirmado."),
  ex(actions, 3, "advanced", 30, "Implemente optimistic UI com expected version e idempotency key. Em duas abas, produza conflito e timeout após commit; reconcilie sem duplicar efeito nem apagar mudança confirmada por outra sessão.", "Projeção tem command id, servidor verifica actor/versão, chave inclui payload/escopo, retry retorna mesmo resultado, conflict recarrega autoridade e rollback é determinístico."),

  ex(streaming, 1, "beginner", 10, "Crie `loading.tsx` para dashboard preservando shell, geometria, foco e anúncio. Compare reload, navegação prefetch cold/warm e resposta rápida, explicando quando um skeleton prejudica mais que ajuda.", "Fallback é específico, acessível e estável; chrome não desmonta; não há flicker/CLS excessivo; métricas distinguem feedback, shell e conteúdo principal."),
  ex(streaming, 2, "intermediate", 20, "Desenhe o DAG de curso, sessão, progresso e recomendações. Inicie fontes independentes, posicione Suspense/error boundaries e injete falhas/latências invertidas sem permitir que widget opcional derrube a aula.", "Promises começam cedo, dependências legítimas são sequenciais, boundaries seguem reveal/recovery, N+1 é agrupado e spans comprovam a ordem real."),
  ex(streaming, 3, "advanced", 30, "Entregue Web Stream por Node ou Edge através do proxy real. Meça chunks, backpressure e cancelamento; compare trabalho pós-resposta descartável com outbox para efeito crítico após queda do processo.", "Runtime é compatível com dependências/região, cliente recebe incrementalmente, abort libera recursos, headers precedem corpo e efeito durável é persistido antes da confirmação."),

  ex(errors, 1, "beginner", 10, "Posicione `error.tsx` para shell e recomendações e modele erros esperados como union. Force falha em cada domínio, acione reset e confirme que stack, SQL e dados pessoais nunca aparecem.", "Boundary local preserva tarefa, ancestral cobre shell, resultados esperados não viram exception, digest é seguro e reset repete somente operação idempotente/recuperável."),
  ex(errors, 2, "intermediate", 20, "Construa matriz de slug inválido, recurso inexistente, draft privado, recurso removido e banco indisponível. Defina 404/403/5xx, metadata, cache e logs para page, action e handler.", "Ausência autorizada/política de não revelação é distinta de indisponibilidade; status e UI concordam, 5xx não é cacheado como 404 e canonical não vaza recurso."),
  ex(errors, 3, "advanced", 30, "Injete 429, 503 e timeout incerto numa mutation. Projete retry budget, idempotência, circuit breaker, status público e tracing redigido, demonstrando que recuperação não duplica comando nem amplifica incidente.", "A classificação distingue not-started/committed/unknown, respeita Retry-After, consulta estado em resultado incerto, degrada feature isolada e mantém cause apenas em telemetria segura."),

  ex(auth, 1, "beginner", 10, "Implemente sessão server-side com cookie seguro e actor mínimo. Teste ausência, adulteração, expiração, rotação, logout e duas renovações concorrentes sem enviar token ou PII ao Client Component.", "Cookie tem flags/escopo, token é verificado e revogável, actor vem da request, rotação evita fixation/reuse e DTO/logs não contêm credencial."),
  ex(auth, 2, "intermediate", 20, "Crie matriz actor×ação×recurso para dois tenants, draft e arquivado. Reutilize a policy em page, Action, Handler e export; altere role entre render e clique e procure IDOR/cache leakage.", "Consulta inclui tenant/visibilidade, mutation reautoriza, UI não é controle, lists/counts/exports são filtrados e cache não reutiliza representação entre atores."),
  ex(auth, 3, "advanced", 30, "Escreva `proxy.ts` fino para redirect otimista e teste matcher, assets, callback, cookie falsificado, Host encaminhado e open redirect. Demonstre que chamada direta ao caso de uso continua segura.", "Proxy não consulta banco, sanitiza returnTo e exclui rotas corretas; sessão/DAL fazem verificação autoritativa; topologia/latência/loops são testados em produção."),

  ex(handlers, 1, "beginner", 10, "Implemente GET paginado e POST de criação com Request/Response, validação de unknown, DTO e status/headers HTTP. Teste método incorreto, JSON inválido e prefetch sem efeitos colaterais.", "Métodos mantêm semântica, limites e content type; criação retorna 201/Location, erros não usam 200 falso, entidade é allowlisted e GET é seguro."),
  ex(handlers, 2, "intermediate", 20, "Compare Node e Edge para uma rota que lê banco regional e gera stream. Faça inventário de imports, benchmark cold/warm, conexões, egress, cancelamento e compatibilidade antes de escolher runtime.", "A escolha considera localização do dado, driver/APIs, pool, streaming e SLO; Edge não é selecionado apenas por proximidade nominal do usuário."),
  ex(handlers, 3, "advanced", 30, "Implemente webhook assinado sobre bytes crus com timestamp, rotação e inbox persistente. Envie duplicatas concorrentes, fora de ordem e crash pós-commit antes do 2xx.", "HMAC é verificado antes do parse e em tempo constante, replay é limitado, unique constraint garante um efeito, versionamento trata ordem e retry/dead-letter são observáveis."),

  ex(metadata, 1, "beginner", 10, "Crie metadata root e dinâmica para curso, com template, metadataBase, canonical, robots e card social. Teste público, privado, ausente, locale e Host malicioso sem consulta duplicada.", "Origem vem de config, dados públicos alimentam metadata/page deduplicados, privado não vaza, ausência/noindex é coerente e alternates/canonical são válidos."),
  ex(metadata, 2, "intermediate", 20, "Gere sitemap e robots para cursos publicados em múltiplos idiomas. Renomeie slug, preserve lastModified real, normalize filtros e faça crawler verificar status, canonical, hreflang e ausência de drafts.", "Sitemap é finito/absoluto, datas não são agora arbitrário, redirects e reciprocidade funcionam, facetas têm política e robots não substitui autenticação."),
  ex(metadata, 3, "advanced", 30, "Audite imagens, fonts e scripts em mobile lento: `sizes`, LCP, CLS, remote patterns, weights, CSP, consentimento e JSON-LD hostil. Defina budgets e falhas de terceiros.", "Geometria/candidates são corretos, origens restritas, scripts localizados/estratégia mínima, fonts limitadas, JSON-LD escapado e tarefa principal funciona sem fornecedor."),

  ex(performance, 1, "beginner", 10, "Siga o grafo de uma fronteira `use client` e estabeleça baseline de bundle, payload RSC, long tasks e INP. Refatore provider/imports/props e aceite somente ganho medido no dispositivo alvo.", "Ilha fica mínima, DTO reduz payload, módulos server não cruzam, lazy é medido no clique e budget por rota comprova melhoria sem mismatch."),
  ex(performance, 2, "intermediate", 20, "Elimine waterfall entre curso, progresso e recomendações sem sobrecarregar banco. Compare awaits, Promise.all, batch, cache por render e chamada HTTP interna, usando spans e load test.", "DAG explícito inicia independentes, remove `/api` interno, agrupa N+1, limita concorrência e mantém failure domains separados com melhora de p95 sob carga."),
  ex(performance, 3, "advanced", 30, "Projete tracing e SLO multi-region para publicação e read-your-writes. Inclua cache age, replica lag, release, runtime e região, depois execute failover sem vazar PII ou labels de alta cardinalidade.", "Trace propaga causalidade, atributos são normalizados, política escolhe primário/stale/read-only, idempotência suporta failover e correctness bloqueia rollout mesmo com baixa latência."),

  ex(testing, 1, "beginner", 10, "Distribua testes de policy, parser, Client Component, Server Component e cache entre unidade, integração e E2E. Justifique o harness mais baixo fiel e elimine mocks/snapshots que não protegem contrato.", "Lógica pura é unitária, storage/protocolo integra, browser cobre RSC/hydration; queries são acessíveis, clock/rede determinísticos e cada teste nomeia o risco."),
  ex(testing, 2, "intermediate", 20, "Teste uma Action e um Handler com banco migrado: dois tenants, JSON/cookie/Origin hostis, constraint concorrente, rollback, outbox e revalidation observável após commit.", "Requests/adapters e banco são reais, auth não tem bypass, transação é atômica, duplicata é idempotente, cache prova comportamento e dados são isolados por worker."),
  ex(testing, 3, "advanced", 30, "Desenhe pipeline de deploy com build reproduzível, migration expand-contract, duas versões simultâneas, E2E/a11y/cache, canary e rollback/roll-forward. Defina critérios e tratamento de flakes.", "Artefato é promovido, schema é compatível, suites usam build produção, canary observa SLO/negócio, rollback considera dados/assets e flake tem causa/owner, não retry infinito."),

  ex(project, 1, "beginner", 10, "Entregue o mapa de rotas do Dédalo e uma caminhada catálogo→login→aula→concluir. Para cada rota, declare consumidor, runtime, acesso, cache, DTO, boundary e comportamento por URL direta.", "Arquitetura conecta App Router a casos de uso/DAL, mantém Server padrão, Proxy fino, DTOs mínimos e walking skeleton cobre estados loading/error/not-found."),
  ex(project, 2, "intermediate", 20, "Implemente catálogo cacheado e progresso privado versionado. Teste publicação, filtros canônicos, duas identidades, abas concorrentes, optimistic conflict e falha de invalidação após commit.", "Tags/lifetimes públicos e read-your-writes privado são separados, commands são idempotentes, versão reconcilia, cache isola atores e reconciliador recupera sinal perdido."),
  ex(project, 3, "advanced", 30, "Apresente o Lab Dédalo com grafo App Router/cache, streaming e observabilidade. Execute threat model, budgets, E2E/a11y, migration canário e rollback, ligando cada decisão a evidência reproduzível.", "Entrega referencia `app-router-cache-graph`, passa gates completos, demonstra failure domains/SLO/segurança e registra ADRs, limites e artefatos associados ao commit."),
];

export const NEXTJS_CARDS: ContentCard[] = [
  card(routing, "O que um route group altera na URL?", "Nada; ele organiza a árvore e layouts sem adicionar o nome do grupo ao path público."),
  card(routing, "Por que params e searchParams são validados?", "Porque são entradas externas assíncronas; tipos TypeScript não garantem valor, tamanho ou allowlist em runtime."),
  card(routing, "Quando usar Link versus router?", "Link para navegação declarativa; router quando navegar é consequência imperativa de um comando."),
  card(routing, "Onde filtros compartilháveis devem viver?", "Na URL canônica, para reload, back/forward, links, cache e SSR reproduzirem o estado."),
  card(components, "O que `use client` marca?", "Uma fronteira de grafo: o módulo e dependências transitivas tornam-se candidatos ao bundle cliente."),
  card(components, "Server Component pode ter children cliente?", "Sim; composição e slots permitem misturar regiões sem promover toda a árvore ao cliente."),
  card(components, "O que pode cruzar Server→Client?", "Props serializáveis e mínimas; não entidades, segredos, conexões ou funções comuns."),
  card(components, "O que server-only garante?", "Falha precoce de import no cliente; não substitui autorização nem prova compatibilidade Edge."),
  card(cache, "Dedupe define frescor?", "Não. Evita trabalho repetido num escopo; lifetime/invalidation definem quando representação fica velha."),
  card(cache, "O que participa da cache key?", "Todo input/fechamento serializável que altera o resultado; tags apenas agrupam invalidação."),
  card(cache, "updateTag versus revalidateTag?", "updateTag atende read-your-writes em Server Action; revalidateTag com perfil pode servir stale enquanto atualiza."),
  card(cache, "Cookie cabe em `use cache` compartilhado?", "Não como request API capturada; dados pessoais exigem boundary dinâmica ou estratégia privada explícita."),
  card(actions, "Server Action é apenas função local?", "Não. É endpoint POST alcançável e precisa validação, autenticação, autorização e idempotência."),
  card(actions, "useActionState autoriza uma mutation?", "Não. Coordena resultado/pending; o estado anterior veio do cliente e não é autoridade."),
  card(actions, "Redirect deve ficar em catch genérico?", "Não. É controle de fluxo do framework e ocorre após efeito confirmado, fora do catch que o engoliria."),
  card(actions, "Quando evitar optimistic UI?", "Quando não há idempotência/versão ou rollback seguro, especialmente em efeitos graves/irreversíveis."),
  card(streaming, "loading.tsx cobre qual unidade?", "O segmento e descendentes durante navegação, preservando layouts ancestrais persistentes."),
  card(streaming, "Suspense remove waterfall?", "Não sozinho; Promises independentes precisam começar cedo e o DAG deve ser redesenhado."),
  card(streaming, "Partial rendering preserva todo state?", "Somente layouts/ilhas cuja identidade permanece; page/segmento e keys definem resets."),
  card(streaming, "after torna efeito durável?", "Não. Serve trabalho pós-resposta permitido; efeitos críticos exigem commit/outbox durável."),
  card(errors, "Error Boundary trata validação?", "Não como regra. Erros esperados usam resultados tipados; boundary recebe falhas excepcionais de render."),
  card(errors, "Quando 404 pode mascarar 403?", "Quando política de recurso privado evita enumeração, aplicada consistentemente na DAL e entradas."),
  card(errors, "Timeout prova que mutation não ocorreu?", "Não. O resultado pode ser incerto; consulte idempotência/estado antes de repetir."),
  card(errors, "O que entra em um log de erro?", "Campos allowlisted como código, route pattern, release e trace; nunca body, cookie, token ou URL bruta."),
  card(auth, "Presença do cookie prova login?", "Não. Token/sessão precisa verificação, expiração, audience/issuer e revogação."),
  card(auth, "Onde autorizar o recurso?", "Na boundary de dados/caso de uso, incluindo actor, ação, tenant e estado na consulta/policy."),
  card(auth, "Proxy substitui DAL autorizada?", "Não. Ele faz checks otimistas/roteamento; chamadas diretas continuam protegidas na rota/action/DAL."),
  card(auth, "CORS impede CSRF?", "Não. CORS controla leitura pelo browser; cookies automáticos exigem SameSite/Origin/token conforme ameaça."),
  card(handlers, "Route Handler deve conter domínio?", "Não. Ele valida/traduz HTTP e delega a caso de uso reutilizável."),
  card(handlers, "Edge sempre reduz latência?", "Não; banco/dependências distantes, compatibilidade e consistência podem torná-lo mais lento."),
  card(handlers, "Por que webhook usa body cru?", "A assinatura cobre os bytes exatos; parse/re-serialização pode alterar a representação verificada."),
  card(handlers, "CORS, auth e cache respondem à mesma pergunta?", "Não: quem executa, qual browser lê e quem reutiliza são políticas distintas."),
  card(metadata, "Robots.txt protege dado privado?", "Não. Orienta crawlers cooperativos; confidencialidade exige autenticação/autorização."),
  card(metadata, "lastModified deve ser agora?", "Não. Deve refletir mudança real do conteúdo para não desperdiçar crawl budget."),
  card(metadata, "O que `sizes` informa ao browser?", "A largura de render esperada nos breakpoints, permitindo escolher o candidato responsivo adequado."),
  card(metadata, "Estratégia de Script elimina custo?", "Não. Apenas agenda; parse, execução, privacidade e falha do terceiro continuam no orçamento."),
  card(performance, "Bundle menor garante INP melhor?", "Não. Trabalho/long tasks no momento da interação precisam ser medidos no dispositivo alvo."),
  card(performance, "Server Component deve chamar `/api` interno?", "Geralmente não; importe DAL/caso de uso e evite hop HTTP, mantendo handler para externos."),
  card(performance, "Qual label causa cardinalidade ruim?", "Slug, user id, URL completa ou mensagem arbitrária; prefira route pattern e enums."),
  card(performance, "Resposta stale pode ser correta?", "Sim, somente quando o fluxo declara tolerância; read-your-writes/segurança podem exigir fonte nova."),
  card(testing, "Qual teste prova constraint?", "Integração com banco/schema real, inclusive concorrência; mock de ORM não prova atomicidade."),
  card(testing, "Por que E2E usa build produção?", "Dev altera cache, timing e instrumentação; a jornada precisa reproduzir protocolo/deploy real."),
  card(testing, "Retry resolve teste flaky?", "Não. Ajuda diagnóstico limitado; corrida ou isolamento têm causa, owner e correção."),
  card(testing, "Rollback de código desfaz migration?", "Não. Dados exigem compatibilidade, backup/restore ensaiado ou roll-forward/compensação."),
  card(project, "Quais regimes de cache existem no Dédalo?", "Catálogo público tolera stale; progresso privado exige isolamento e read-your-writes."),
  card(project, "O que liga optimistic ao servidor?", "Command id, actor, expected version, idempotência e reconciliação com resultado autoritativo."),
  card(project, "Cada Suspense deve corresponder a quê?", "Uma unidade de reveal/failure/recovery significativa para a tarefa do usuário."),
  card(project, "O que conclui o Lab Dédalo?", "Evidências reproduzíveis de grafo, contrato, isolamento, performance, acessibilidade, operação e rollback."),
];
