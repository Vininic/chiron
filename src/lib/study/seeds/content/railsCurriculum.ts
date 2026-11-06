export type RailsLevel = "basico" | "intermediario" | "avancado";
export type RailsLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type RailsChapter = readonly [title: string, level: RailsLevel, primer: string, lessons: readonly RailsLesson[]];

/** Baseline editorial planejado: Rails moderno; versão, Ruby e adapters reais serão fixados no gate de execução. */
export const RAILS_CURRICULUM: readonly RailsChapter[] = [
  ["Aplicação, boot e convenções", "basico", "Rails acelera decisões repetíveis, mas boot, configuração e ownership continuam contratos operacionais.", [
    ["Versões e criação da aplicação", "aplicação reproduzível fixa Ruby, Rails, gems, banco e opções do gerador", "Gemfile.lock, rails new, binstubs e app:update", "máquina local resolveu gems diferentes do artefato"],
    ["Boot, initializers e ambientes", "configuração precisa existir antes do componente que a consome e não vazar entre ambientes", "config/application, environments, initializers e credentials", "initializer abriu conexão antes do segredo estar disponível"],
    ["Autoloading e reload com Zeitwerk", "constantes, caminhos e callbacks precisam sobreviver ao reload sem duplicar estado", "Zeitwerk, naming, eager_load, to_prepare e once paths", "reload registrou subscriber duas vezes"],
    ["Ciclo Rack e ownership da requisição", "middleware e controller transferem dados próprios sem reter request além do ciclo", "Rack env, middleware stack, executor e CurrentAttributes", "job capturou request mutável e tenant antigo"],
  ]],
  ["Rotas, controllers e HTTP", "basico", "A borda HTTP deve ser estreita, explícita e separada da regra de domínio.", [
    ["Rotas REST, constraints e URLs", "roteamento limita forma e namespace sem substituir autorização", "resources, member/collection, constraints, mounts e url helpers", "constraint de rota foi tratada como controle de acesso"],
    ["Params, strong parameters e comandos", "parâmetros permitidos não podem escolher identidade nem campos privilegiados", "Parameters#expect/permit, schemas, coercion e command objects", "mass assignment alterou tenant e papel"],
    ["Responses, rendering e erros", "outcomes fechados mapeiam para status e representação estáveis", "render, head, responders, rescue_from e problem details", "exceção ambígua virou 200 com corpo vazio"],
    ["Cookies, sessões e CSRF", "estado de browser exige integridade, confidencialidade adequada e defesa de intenção", "signed/encrypted cookies, session store, SameSite e authenticity token", "endpoint autenticado por cookie aceitou POST cross-site"],
  ]],
  ["Active Record e modelo", "basico", "ORM reduz mecânica, não elimina contratos de schema, transação e concorrência.", [
    ["Migrations e schema", "mudança de schema é artefato ordenado, reversível quando possível e compatível com frota mista", "migrations, schema.rb/structure.sql, constraints e safety", "deploy antigo encontrou coluna removida"],
    ["Validações, callbacks e invariantes", "validação de modelo melhora feedback, enquanto o banco preserva invariantes concorrentes", "validates, custom validators, callbacks e DB constraints", "duas requisições venceram validação de unicidade"],
    ["Associações e lifecycle", "associação explicita ownership, dependência e cardinalidade sem esconder deletes perigosos", "belongs_to, has_many, inverse_of, dependent e touch", "dependent destroy bloqueou worker e apagou histórico"],
    ["Transações, locks e concorrência", "unidade durável inclui predicado atômico e efeitos locais, não HTTP remoto", "transaction, lock!, with_lock, isolation e after_commit", "lock de processo vendeu a última vaga em duas réplicas"],
  ]],
  ["Consultas e desempenho de dados", "intermediario", "Relations são programas SQL lazy cuja forma, escopo e custo precisam evidência.", [
    ["Relations, scopes e SQL seguro", "composição preserva bind, tenant e semântica de NULL", "where, joins, merge, Arel limitado e sanitize APIs", "interpolação abriu injection e removeu tenant"],
    ["N+1, eager loading e projeções", "carregamento deve corresponder ao grafo realmente usado sem multiplicar linhas", "includes, preload, eager_load, strict_loading e select", "serialização disparou consulta por item"],
    ["Paginação, batches e cursores", "processamento grande usa ordem total, janela limitada e retomada estável", "find_each, in_batches, keyset cursor e limits", "offset repetiu e pulou linhas sob escrita"],
    ["Índices, cache e contadores", "otimização nasce do plano e invalidação, não de memória intuitiva", "EXPLAIN, indexes, counter_cache, cache_key_with_version e race_condition_ttl", "cache global devolveu registro de outro tenant"],
  ]],
  ["Identidade e segurança", "intermediario", "Defaults seguros ajudam, mas autorização e isolamento precisam atravessar cada adapter.", [
    ["Authentication e lifecycle de sessão", "credencial estabelece identidade verificável, rotacionável e revogável", "has_secure_password, session reset, signed tokens e timeout", "session fixation preservou identidade do atacante"],
    ["Authorization e multi-tenancy", "tenant deriva da identidade e participa de toda query, cache, job e callback", "policy, scoped repository, CurrentAttributes cleanup e negative tests", "find global vazou recurso antes da policy"],
    ["Injection, uploads e SSRF", "cada sink recebe parser, allowlist e limite próprios", "SQL binds, Active Storage validation, URI policy e safe YAML", "preview buscou URL interna fornecida pelo usuário"],
    ["Secrets, headers e supply chain", "segredos e dependências têm provenance, rotação e exposição mínima", "credentials, secret_key_base, CSP, permissions policy e Bundler audit", "segredo apareceu em log e imagem de build"],
  ]],
  ["Jobs, mensagens e efeitos", "intermediario", "Execução assíncrona é entrega repetível, não continuação mágica da request.", [
    ["Active Job e adapters", "semântica depende do backend real, serialização e política de fila", "perform_later, GlobalID, queue_as, Solid Queue/adapter e priorities", "objeto mudou entre enqueue e perform"],
    ["Retries, idempotência e descartes", "retry conserva identidade e só repete operação classificada", "retry_on, discard_on, executions, backoff e idempotency key", "timeout após efeito cobrou outra vez"],
    ["Commit, outbox e entrega", "job ou mensagem não pode escapar antes do commit que lhe dá significado", "after_commit, transactional enqueue, outbox e claim lease", "worker leu row que a transação depois reverteu"],
    ["Mailer, Cable e notificações", "canal, destinatário e payload seguem autorização e lifecycle explícitos", "Action Mailer, deliver_later, Action Cable, streams e signed IDs", "broadcast de tenant foi enviado a stream global"],
  ]],
  ["Views, Hotwire e experiência", "intermediario", "HTML server-driven continua exigindo contratos de escaping, estado e acessibilidade.", [
    ["Templates, helpers e XSS", "conteúdo não confiável permanece escapado no contexto correto", "ERB, tag helpers, sanitize, safe_join e content security", "html_safe publicou comentário atacante"],
    ["Turbo Drive, Frames e Streams", "navegação incremental preserva URL, foco, histórico e autorização", "Turbo visits, frames, streams, broadcasts e morph", "stream atualizou recurso que o assinante não podia ler"],
    ["Stimulus e assets", "JavaScript progressivo tem targets/actions e bundle reproduzível", "Stimulus controllers, importmap/jsbundling, Props via data e CSP", "controller conectou duas vezes após morph"],
    ["I18n, tempo e acessibilidade", "locale e timezone não alteram valores duráveis nem escondem semântica", "I18n keys, Time.zone, localized formats e ARIA/focus", "data local foi persistida como instante errado"],
  ]],
  ["APIs e integrações", "avancado", "Integração confiável separa contrato, transporte, efeito e reconciliação.", [
    ["JSON APIs e versionamento", "representação pública é allowlisted, versionada e independente do layout do modelo", "serializers, Jbuilder/JSON, ETag, content negotiation e schemas", "to_json expôs colunas internas"],
    ["Clientes HTTP e deadlines", "cada chamada externa possui deadline, TLS, pool, retry e outcome classificados", "Net::HTTP/adapters, open/read timeout, SSL e circuit breaker", "retry cego repetiu POST aplicado"],
    ["Webhooks e callbacks", "callback autentica bytes originais, deduplica evento e resolve tenant por vínculo confiável", "HMAC, timestamp, raw body, event store e replay defense", "JSON reserializado invalidou assinatura"],
    ["Rate limits e quotas", "admissão protege capacidade global e justiça por identidade", "Rack::Attack/framework limiter, cache store, weighted costs e backpressure", "limite por IP foi burlado por header"],
  ]],
  ["Testes e prova de correção", "avancado", "A pirâmide Rails precisa oráculos de estado e efeito, não apenas status verde.", [
    ["Model, service e contract tests", "teste pequeno fixa invariantes e contratos compartilhados dos adapters", "ActiveSupport::TestCase/RSpec, shared examples, time helpers e fakes", "fake aceitou transação impossível no banco"],
    ["Request e system tests", "borda real valida routing, middleware, auth, rendering e comportamento do browser", "integration tests, Capybara, system drivers e accessibility", "controller spec pulou CSRF e middleware"],
    ["Banco e concorrência determinística", "última vaga e replay exigem conexões independentes e barriers", "connection_pool, threads/processes, constraints e readback", "teste transacional escondeu commits entre sessões"],
    ["Property, mutation e fuzz", "geradores e mutantes ampliam casos sem diminuir o oráculo", "property libraries, mutation testing, parser fuzz e corpus", "coverage alta sobreviveu sem tenant predicate"],
  ]],
  ["Operação e desempenho", "avancado", "Processo saudável coordena workers, pools, caches, sinais e observabilidade.", [
    ["Instrumentation, logs e traces", "telemetria correlaciona operação sem carregar segredo nem cardinalidade hostil", "ActiveSupport::Notifications, tagged logging, metrics e OpenTelemetry", "tenant virou label ilimitada"],
    ["Caching e invalidação", "cache é cópia dispensável com namespace, versão e política de stampede", "fragment/low-level cache, Russian doll, version keys e locks", "deploy leu objeto serializado incompatível"],
    ["Puma, processos, threads e pools", "concorrência do servidor respeita GVL, pool de banco e limites externos", "workers, threads, preload, hooks e connection pool", "threads excederam conexões e bloquearam saúde"],
    ["Memória, DoS e overload", "limites entram antes de parse, alocação e leases escassos", "request limits, regexp timeout, bounded queues, profiling e load shedding", "payload aninhado exauriu heap"],
  ]],
  ["Entrega e recuperação", "avancado", "Build, migration, shutdown e restore pertencem ao contrato da aplicação.", [
    ["Bundler, assets e imagem", "artefato imutável contém lock, assets, metadata e entrypoint verificáveis", "bundle deployment, bootsnap, assets precompile, Docker e SBOM", "imagem recompilada em produção mudou dependência"],
    ["Deploy, migrations e frota mista", "mudança compatível atravessa versões antigas e novas antes da contração", "expand/contract, release phase, canary, feature flags e checks", "migration bloqueou tabela durante rollout"],
    ["Shutdown, rollback e signals", "processo fecha admissão, drena owners e preserva jobs e efeitos ambíguos", "Puma/Active Job lifecycle, TERM, timeout, readiness e rollback", "pod morreu depois do efeito e antes do ack"],
    ["Backup, restore e incidentes", "backup só é aprovado depois de restore isolado e reconciliação", "RPO/RTO, paused delivery, stable IDs, runbook e postmortem", "restore reenviou efeitos já aplicados"],
  ]],
  ["Projeto Quíron em Rails", "avancado", "A banca integra MVC, banco, jobs, segurança, operação e recuperação.", [
    ["Arquitetura Rails do Quíron", "controller fino coordena comando, domínio e ports sem callback mágico", "routes, command, transaction service, repository e outbox", "controller confirmou antes do commit"],
    ["Última vaga e replay Rails", "constraint, tenant fingerprint e event ID estável convergem concorrência", "conditional update, unique index, two-session test e reconciliation", "duas réplicas venderam o mesmo assento"],
    ["Segurança, teste e carga Rails", "inputs hostis e overload preservam isolamento e efeitos", "negative auth, fuzz, mutation, load readback e fault injection", "resposta rápida escondeu obrigação perdida"],
    ["Banca, deploy e restore Rails", "publicação exige app empacotada, banco, job adapter, TLS e restore reais", "evidence matrix, staging, kill points, canary e restore drill", "system test local foi chamado de prova de produção"],
  ]],
];
