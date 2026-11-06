export type VercelLevel = "basico" | "intermediario" | "avancado";
export type VercelLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type VercelChapter = readonly [title: string, level: VercelLevel, primer: string, lessons: readonly VercelLesson[]];

/** Vercel curriculum; platform claims require an isolated account/project and real deployment gates. */
export const VERCEL_CURRICULUM: readonly VercelChapter[] = [
  ["Modelo de projeto e deployment", "basico", "Vercel transforma source, configuração e identidade em deployments imutáveis; projeto, domínio e ambiente são referências mutáveis sobre artifacts.", [
    ["Projects, teams e ownership", "projeto e team definem fronteira de acesso, billing e lifecycle e precisam owner e inventário", "team/project IDs, roles, transfer, limits e audit", "projeto pessoal órfão hospedou aplicação crítica sem substituto"],
    ["Deployments e aliases", "deployment imutável e alias mutável precisam digests e promoção explícita", "deployment URL, production alias, promote, rollback e provenance", "alias produtivo apontou build não revisado após redeploy manual"],
    ["Git integration e source", "branch, commit e repository precisam permanecer ligados ao artifact realmente construído", "Git provider, production branch, preview, ignored builds e source metadata", "pipeline aprovou um commit e integração publicou outro"],
    ["Project settings e drift", "settings de framework, root, build e output são parte versionada da release", "framework preset, root directory, build command, output directory e project.json", "mudança na UI alterou build sem aparecer no pull request"],
  ]],
  ["Builds reproduzíveis", "basico", "Build confiável fixa runtime, dependencies, cache e comandos e distingue erro de source, plataforma e ambiente.", [
    ["Runtime e package manager", "versões de Node e package manager precisam lock e compatibilidade explícitos", "engines, Corepack, lockfile, install command e runtime", "upgrade implícito de Node mudou resolução e quebrou produção"],
    ["Build, output e artifacts", "comando e saída precisam contrato verificável sem depender de arquivos locais ocultos", "build command, output directory, Build Output API e checksums", "preview verde omitiu assets gerados apenas na máquina do autor"],
    ["Cache e invalidation", "cache acelera apenas quando chave e invalidação preservam correção", "build cache, framework cache, remote cache e redeploy without cache", "cache antigo publicou schema e bundle incompatíveis"],
    ["Monorepos e affected projects", "root, workspaces e filtros precisam mapear mudança a todos os projetos afetados", "root directory, workspace graph, install/build filters e ignored build step", "biblioteca compartilhada mudou e aplicação não foi reconstruída"],
  ]],
  ["Environments e configuração", "basico", "Development, Preview e Production possuem valores e acesso distintos; configuração precisa schema, ownership e promoção.", [
    ["Environment variables e scopes", "variável pertence a projeto, ambiente e branch e não pode cair em fallback inseguro", "Development/Preview/Production scopes, branch overrides e pull", "preview usou database produtivo por variável ausente"],
    ["Secrets e exposição no client", "qualquer valor incluído no bundle público deixa de ser segredo", "framework public prefixes, build-time substitution, server runtime e scanners", "token privado recebeu prefixo público e apareceu no JavaScript"],
    ["System variables e metadata", "metadados automáticos ajudam provenance, mas não substituem validação do destino", "VERCEL_ENV, URL, GIT_COMMIT_SHA e deployment IDs", "aplicação confiou em hostname controlado para decidir autorização"],
    ["Config drift e promoção", "valores públicos podem promover por manifest; secrets reinjetam por referência e leitura posterior", "env import/export, project settings API, encrypted stores e reconciliation", "rollback do código manteve configuração incompatível"],
  ]],
  ["Preview deployments e colaboração", "intermediario", "Preview é ambiente efêmero compartilhável, não produção informal; acesso, dados e lifecycle precisam limites.", [
    ["Branch e pull request previews", "cada revisão deve apontar preview do mesmo commit e invalidar aprovação ao mudar", "Git checks, deployment metadata, comments e commit status", "reviewer aprovou preview anterior depois de force push"],
    ["Preview access e proteção", "URL obscura não é controle de acesso; previews internos exigem proteção verificável", "Deployment Protection, Vercel Authentication, passwords e bypass", "preview indexado expôs feature e dados internos"],
    ["Dados, fixtures e isolamento", "preview usa tenant, database e integrações sintéticas isoladas por deployment", "branch databases, preview env, namespaces, seed e teardown", "dois previews compartilharam fila e apagaram fixtures"],
    ["Lifecycle e cleanup seguro", "previews, domains, databases e secrets temporários expiram juntos e preservam evidence", "deployment retention, hooks, cleanup jobs e ownership tags", "branch removida deixou banco e domínio cobrados por meses"],
  ]],
  ["Domains, DNS e TLS seguros", "intermediario", "Domínio e certificado são plano de controle crítico; mudanças exigem ownership, validação e rollback.", [
    ["Domains e aliases de projeto", "domínio customizado deve pertencer ao projeto e ambiente corretos sem takeover", "domain add/verify, aliases, redirects e ownership TXT", "domínio removido ficou vulnerável a reassociação por terceiro"],
    ["DNS e delegação controlada", "records, apex, CNAME e nameservers precisam fonte de verdade e TTL planejado", "Vercel DNS, external DNS, A/AAAA/CNAME/TXT e propagation", "migração alterou nameserver antes de copiar records de email"],
    ["TLS e certificados gerenciados", "emissão e renovação dependem de DNS e cadeia válidos e devem alertar antes de expirar", "managed certificates, ACME, CAA, SNI e renewal", "CAA bloqueou renovação e incidente só apareceu na expiração"],
    ["Redirects, rewrites e canonical", "roteamento de domínio precisa preservar método, query, cache e origem segura", "redirects, rewrites, headers, trailing slash e canonical host", "rewrite aberto virou proxy SSRF para origem controlada"],
  ]],
  ["Functions e runtime distribuído", "intermediario", "Functions executam em regiões e runtimes com limites; estado, rede e timeout precisam desenho distribuído.", [
    ["Serverless e Fluid compute", "concorrência, reuse e scale alteram lifecycle e não permitem estado local autoritativo", "function instances, concurrency, cold starts, Fluid compute e scaling", "cache em memória misturou tenant entre invocações"],
    ["Edge e Node runtimes", "APIs, libraries, regiões e limites diferem e a escolha precisa capability matrix", "Edge Runtime, Node.js runtime, Web APIs e compatibility", "package nativo funcionou localmente e falhou no Edge"],
    ["Timeouts, streaming e payload", "duração, body, response e streaming têm limites que precisam falha e backpressure explícitas", "max duration, request/response size, streaming e cancellation", "função encerrou após commit e cliente repetiu efeito"],
    ["Regions e data locality", "compute deve estar perto do dado e respeitar residência sem assumir consistência global", "preferred regions, region failover, database placement e latency", "failover escreveu em região sem regra de residência"],
  ]],
  ["Entrega web, cache e imagens", "intermediario", "CDN e otimizações mudam bytes e freshness; cache precisa chave, invalidação e privacidade.", [
    ["Static, SSR e revalidation", "estratégia de render define freshness, custo e falha e precisa ser observável", "static generation, SSR, ISR, revalidate e on-demand invalidation", "página mostrou preço antigo depois de atualização crítica"],
    ["Cache-Control e CDN segura", "cache público e privado devem variar pelas dimensões corretas sem armazenar resposta personalizada", "s-maxage, stale-while-revalidate, Vary e CDN cache", "resposta autenticada foi servida a outro usuário"],
    ["Image Optimization segura", "transformação remota requer allowlist, limites e fallback para evitar SSRF e custo", "remotePatterns, formats, sizes, loader e cache", "host de imagem amplo permitiu proxy para endpoint interno"],
    ["Headers, compression e assets", "security headers, content type e immutable assets precisam corresponder ao artifact", "headers config, compression, MIME, hashed assets e range requests", "asset sem hash ficou cacheado após rollback"],
  ]],
  ["Dados, storage e integrações", "avancado", "Storage gerenciado e terceiros têm consistência, regiões, credenciais e custo próprios e não herdam garantias da função.", [
    ["Postgres e connection management", "serverless exige pooling, limites e migrations coordenadas", "managed Postgres integrations, poolers, connection limits e transactions", "escala de functions esgotou conexões e derrubou database"],
    ["KV, Blob e object storage", "key/value e objetos precisam namespace, TTL, integrity e access control", "KV integrations, Blob, signed URLs, cache e lifecycle", "URL pública permanente expôs upload privado"],
    ["Queues, webhooks e async", "entrega assíncrona é repetível e exige idempotência, assinatura e observer", "webhooks, queues, cron, retries e dead letters", "timeout após commit gerou duas notificações"],
    ["Integrations e marketplace", "integração de terceiro adiciona permissões, billing e supply chain", "integration installs, OAuth grants, environment injection e uninstall", "integração abandonada manteve acesso ao projeto"],
  ]],
  ["Segurança e proteção", "avancado", "Segurança combina identidade, rede, supply chain e resposta; configuração de dashboard não substitui testes negativos.", [
    ["RBAC, SSO e workloads", "humanos e automação precisam menor privilégio, identidade separada e offboarding", "team roles, SSO, access groups, tokens e service identities", "token pessoal admin permaneceu no CI após desligamento"],
    ["Firewall, WAF e DDoS", "regras protegem tráfego sem bloquear health ou confiar em IP como identidade", "Firewall, WAF rules, rate limits, bot controls e logs", "regra permissiva de emergência nunca foi revertida"],
    ["Supply chain e provenance", "source, dependencies, builders e deployment precisam cadeia verificável", "Git protections, lockfiles, build attestations, checksums e scanners", "package comprometido leu secrets durante build"],
    ["Incidentes, revoke e audit", "contenção revoga tokens, pausa deploys e preserva evidence antes do restore", "audit logs, deployment locks, token revoke, rollback e evidence", "rollback reativou variável comprometida"],
  ]],
  ["Observabilidade, SLO e custo", "avancado", "Logs, traces, analytics e spend precisam sinais acionáveis e privacy, não apenas dashboards bonitos.", [
    ["Runtime e build logs", "logs distinguem build, edge, function e platform e nunca carregam segredo", "build logs, runtime logs, drains, retention e redaction", "console registrou Authorization em todas as invocações"],
    ["Analytics e tracing seguro", "métricas e traces precisam sampling, cardinalidade e correlação controlados", "Web Analytics, Speed Insights, OpenTelemetry e trace propagation", "URL com email virou dimensão de analytics"],
    ["SLO, alerts e synthetic", "alerta deve ligar sintoma, região, release e owner com journey seguro", "checks, integrations, error rates, latency e burn rate", "alerta de 5xx não identificou deployment regressivo"],
    ["Usage, quotas e budgets", "bandwidth, invocations, duration e image transforms precisam forecast e guardrails", "usage dashboard, spend management, limits e anomaly alerts", "loop de preview consumiu quota mensal em horas"],
  ]],
  ["CI/CD, promoção e rollback", "avancado", "Entrega segura promove artifact por digest, separa build de release e reconcilia Git, Vercel e dependentes.", [
    ["CLI e identidade de CI", "CLI usa workload mínimo, project linkage por ID e output redigido", "vercel pull/build/deploy, tokens, org/project IDs e prebuilt", "job publicou no team errado por link local stale"],
    ["Build once e promote", "o artifact testado deve ser o promovido sem rebuild invisível", "prebuilt deployments, deployment IDs, aliases e promote", "produção recompilou dependency nova depois dos testes"],
    ["Checks, approvals e gates", "deployment só promove após contrato, security, performance e approval ligados ao commit", "Git checks, deployment checks, protected environments e policies", "approval permaneceu válida após novo deployment"],
    ["Rollback e recovery coordenado", "rollback restaura code, config, domains e migrations de forma compatível", "instant rollback, aliases, env versions, feature flags e roll forward", "alias voltou, mas schema novo tornou release antiga inválida"],
  ]],
  ["Projeto Quíron na Vercel", "avancado", "A banca integra build, preview, domínio, functions, última vaga, observabilidade e incidente com prova honesta.", [
    ["Baseline do projeto Quíron", "repo, settings, env e artifacts precisam clone limpo e manifest reproduzível", "project manifest, framework config, lockfile, env schema e deployment", "root directory errado publicou página vazia com status verde"],
    ["Última vaga em Functions", "concorrência serverless exige banco autoritativo, idempotência e observer independente", "parallel requests, barriers, transactions, retries e effect cardinality", "duas regiões venderam a mesma última vaga"],
    ["Release, domínio e canary", "deployment por digest promove alias e domínio só depois de canary e gates", "preview, protected deployment, promote, DNS/TLS e synthetic checks", "canary testou URL diferente daquela promovida"],
    ["Banca, incidente e restore Vercel", "token vazado, config drift e função duplicadora precisam contenção e restore reconciliado", "revoke, audit, deployment lock, env restore, rollback e evidence", "código voltou, mas integration e secret antigos permaneceram ativos"],
  ]],
];
