export type PhpLevel = "basico" | "intermediario" | "avancado";
export type PhpLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type PhpChapter = readonly [title: string, level: PhpLevel, primer: string, lessons: readonly PhpLesson[]];

/** Baseline editorial planejado: PHP moderno; versão/SAPI/extensões reais serão fixadas no gate de execução. */
export const PHP_CURRICULUM: readonly PhpChapter[] = [
  ["Runtime, tipos e fluxo", "basico", "PHP é dinâmico e request-oriented, mas coerção, valores e runtime precisam contratos explícitos.", [
    ["Versão, SAPI e configuração", "resultado depende da versão, SAPI, php.ini, extensões e flags efetivas", "PHP_VERSION, PHP_SAPI, ini_get, extensions e error_reporting", "CLI passou enquanto FPM usou configuração diferente"],
    ["Tipos escalares e strict_types", "coerção ocorre na fronteira do arquivo e não substitui validação de input", "declare strict_types, int, float, string, bool e unions", "string numérica ambígua virou quantidade válida"],
    ["Arrays, strings e Unicode", "array PHP mistura mapa/lista e string é sequência de bytes", "array_is_list, keys, mbstring, normalization e ownership copy-on-write", "chave numérica mudou de tipo e texto foi cortado por byte"],
    ["Controle, match e funções", "fluxo fechado e assinatura explícita impedem estados futuros virarem sucesso", "match, exceptions, named arguments, closures e first-class callables", "default confirmou outcome desconhecido"],
  ]],
  ["Objetos e contratos", "basico", "Objetos preservam invariantes quando construção, visibilidade e identidade são deliberadas.", [
    ["Classes, readonly e invariantes", "objeto publicado nasce válido e não expõe mutação arbitrária", "constructor promotion, readonly, visibility e named constructors", "entidade parcialmente válida escapou"],
    ["Enums, value objects e igualdade", "vocabulários e valores de domínio têm representação canônica", "backed enums, DateTimeImmutable, Money e equals", "status textual desconhecido caiu em confirmed"],
    ["Interfaces, traits e composição", "reuso mantém contrato sem estado global ou conflito invisível", "interfaces, traits, composition, final e delegation", "trait sobrescreveu método de autorização"],
    ["Atributos, reflection e dinamismo", "metadata e reflection só operam sobre classes e ações allowlisted", "attributes, Reflection, closures e registries", "classe vinda do request foi instanciada"],
  ]],
  ["Erros, recursos e arquivos", "basico", "Erros e resources possuem categorias, ownership e cleanup explícitos.", [
    ["Exceptions, Error e handlers", "falha de domínio, infraestrutura e bug não são capturados como a mesma coisa", "Throwable, custom exceptions, handlers e finally", "catch amplo converteu commit desconhecido em validation"],
    ["Streams e filesystem", "stream, path e file handle precisam limites, containment e fechamento", "fopen, stream contexts, realpath, temp files e locks", "path traversal leu segredo do host"],
    ["JSON, serialize e schemas", "dados externos usam formato limitado e schema, nunca object unserialize permissivo", "json_decode flags, JsonSerializable, depth e allowed_classes", "unserialize acionou gadget"],
    ["Datas, números e locale", "instantes, fusos, decimais e locale não podem mudar silenciosamente", "DateTimeImmutable, DateTimeZone, intl e decimal/minor units", "timezone do servidor alterou expiração"],
  ]],
  ["HTTP e aplicações web", "intermediario", "A fronteira HTTP valida bytes, identidade e intenção antes do domínio.", [
    ["Request, headers e body", "superglobals e streams são input não confiável e limitado", "filter_input, php://input, content negotiation e command DTO", "body grande foi parseado antes do limite"],
    ["Response, cookies e sessão", "status, headers, cookies e sessão formam contrato de segurança", "headers, setcookie options, session fixation e output buffering", "session ID sobreviveu ao login"],
    ["Routing, middleware e PSR", "pipeline transfere valores próprios sem esconder autorização", "PSR-7, PSR-15, immutable messages e middleware ordering", "middleware reteve request em job tardio"],
    ["Templates, escaping e CSRF", "output encoding é contextual e mutation por browser exige prova de intenção", "htmlspecialchars, template engines, CSP e CSRF token", "escape ausente publicou script e POST cross-site"],
  ]],
  ["Banco e persistência", "intermediario", "PDO/ORM não eliminam SQL, constraints, transactions ou concorrência.", [
    ["PDO, binds e SQL seguro", "valores usam binds e estrutura dinâmica usa mapping fechado", "PDO prepared statements, fetch modes e identifier allowlists", "order interpolado abriu injection"],
    ["Transactions e isolation", "unidade local é curta e retry preserva identidade", "beginTransaction, commit, rollback, isolation e deadlock retry", "HTTP remoto manteve lock aberto"],
    ["Modelagem, migrations e constraints", "schema sustenta invariantes concorrentes e deploy misto", "foreign keys, unique/check, indexes e expand-contract", "validação de unicidade vendeu duas vezes"],
    ["Repositories, mapping e ORM", "persistência traduz rows e erros sem vazar Active Record para toda arquitetura", "repositories, hydrators, identity map limitado e error mapping", "row parcial virou entidade válida"],
  ]],
  ["Dependências e pacotes", "intermediario", "Autoload, container e Composer tornam o grafo reproduzível e revisável.", [
    ["Namespaces e Composer autoload", "classes seguem PSR-4 e não executam efeitos ao carregar", "namespaces, autoload, classmap e authoritative mode", "autoload abriu conexão e falhou no preload"],
    ["Composer lock e supply chain", "dependências, plataforma e provenance são fixadas no artefato", "composer.json/lock, platform config, audit e install", "deploy executou composer update"],
    ["Container e dependency injection", "composition root seleciona adapters sem service locator oculto", "constructor injection, factories, scopes e production graph", "produção caiu em repository de memória"],
    ["Bibliotecas e compatibilidade", "API pública, SemVer e extensões nativas recebem matriz de consumidor", "package boundaries, deprecations, polyfills e extension requirements", "minor update quebrou assinatura pública"],
  ]],
  ["Concorrência e trabalho assíncrono", "intermediario", "Processos, workers e fibers não substituem coordenação durável.", [
    ["Process model, FPM e state", "estado por request/process não é coordenação entre réplicas", "FPM workers, opcache, globals, preload e lifecycle", "static cache vazou tenant entre requests"],
    ["Queues, retries e idempotência", "entrega at-least-once conserva key e classifica estágio", "job payloads, backoff, dead letter e stable IDs", "retry pós-efeito cobrou outra vez"],
    ["Outbox, claims e fencing", "estado e obrigação nascem juntos e workers claimam atomicamente", "transactional outbox, skip locked, leases e reconciliation", "dois workers enviaram o mesmo evento"],
    ["Fibers, event loops e async", "suspensão mantém deadline, context e ownership sem segurar resources", "Fiber, event loop libraries, nonblocking I/O e cancellation", "fiber aguardou HTTP dentro de transaction"],
  ]],
  ["Testes e qualidade", "avancado", "A suíte prova valores, fronteiras, infraestrutura e efeitos com alcance declarado.", [
    ["PHPUnit e unit contracts", "oráculos pequenos cobrem invariantes e adapters compartilham contratos", "PHPUnit, data providers, test doubles e contract suites", "mock aprovou transaction impossível"],
    ["Integration, HTTP e banco", "stack e banco reais validam middleware, SQL e state readback", "integration tests, disposable DB, HTTP client e fixtures", "teste unitário foi chamado de integração"],
    ["Static analysis e mutation", "tipos refinados e mutantes expõem paths que coverage não prova", "PHPStan/Psalm, generics annotations e mutation testing", "tenant predicate removido sobreviveu"],
    ["Property, fuzz e security corpus", "geradores e corpus ampliam casos mantendo oracle bounded", "property testing, parser fuzz, seeds e malicious corpus", "payload profundo travou o worker"],
  ]],
  ["Segurança de aplicações PHP", "avancado", "A flexibilidade do runtime exige boundaries menores, allowlists e least privilege.", [
    ["Authentication e autorização tenant", "identidade e tenant atravessam query, cache, job e provider", "password_hash/verify, sessions/tokens, policies e scoped repositories", "find global vazou registro"],
    ["Injection, upload e SSRF", "cada sink recebe bind/parser/allowlist e resource limit", "PDO binds, proc_open argv, upload validation e egress policy", "URL do usuário alcançou metadata"],
    ["Secrets, TLS e headers", "segredos rotacionam fora do código e transporte/headers são gates reais", "environment/secret manager, openssl/cURL verification, CSP e cookies", "CURLOPT_SSL_VERIFYPEER foi desligado"],
    ["DoS, limits e incident response", "bytes, CPU, memória, processos e queues são recursos autorizados", "ini limits, server limits, regex timeout strategy, quotas e runbooks", "regex/upload exauriu FPM"],
  ]],
  ["Operação e desempenho", "avancado", "OPcache, FPM, observabilidade e capacidade precisam combinar com dependências.", [
    ["OPcache, JIT e preload", "otimização respeita artifact, reload e side effects", "opcache settings, preload, JIT e immutable deploy", "workers executaram código de versões diferentes"],
    ["FPM, pools e servidores", "workers, queues e timeouts alinham com banco/provider e memória", "pm modes, max_children, request timeout e graceful reload", "children excederam conexões do banco"],
    ["Logs, metrics e traces", "telemetria é bounded, correlacionada e redigida", "PSR-3, OpenTelemetry, metrics e audit events", "token virou label e log"],
    ["Profiling, carga e memória", "performance só passa junto com state/effect oracle e RSS bounded", "profilers, benchmarks, load/soak e leak analysis", "resposta rápida perdeu commit"],
  ]],
  ["Entrega e recuperação", "avancado", "Artefato, deploy, sinais e restore completam o contrato.", [
    ["Build, container e provenance", "vendor otimizado e config de runtime formam artefato imutável verificável", "composer install, autoload optimize, container, SBOM e digest", "imagem incluiu credencial de Composer"],
    ["Deploy, migrations e rollback", "frota mista usa expand-contract, canary e rollback compatível", "release phase, opcache reset, flags e old/new tests", "coluna foi removida com workers antigos"],
    ["Shutdown, workers e recovery", "admission fecha, owners drenam e crashes preservam obrigações", "FPM/server signals, queue drain, kill points e reconciliation", "worker morreu após efeito antes do ack"],
    ["Backup, restore e incidentes PHP", "restore pausado reconcilia identidades antes de liberar delivery", "RPO/RTO, manifests, stable IDs, runbook e postmortem", "restore reenviou efeitos com IDs novos"],
  ]],
  ["Projeto Quíron em PHP", "avancado", "A banca integra runtime, HTTP, banco, workers, segurança e recuperação.", [
    ["Arquitetura PHP do Quíron", "boundary e service explícitos mantêm tenant, transaction e effect separados", "PSR pipeline, command DTO, repository, transaction service e outbox", "controller confirmou antes do commit"],
    ["Última vaga e replay PHP", "update condicional, fingerprint e event ID convergem concorrência", "two-session PDO gate, unique intent, fenced worker e reconciliation", "duas réplicas venderam a vaga"],
    ["Segurança, testes e carga PHP", "input hostil e overload preservam isolamento e obrigações", "negative auth, static/mutation/fuzz, load readback e fault injection", "FPM saturado perdeu outbox"],
    ["Banca, deploy e restore PHP", "publicação exige engine/SAPI/extensions, artifact, DB, TLS, kill e restore", "evidence matrix, staging, canary, crash e restore drill", "lint foi confundido com execução"],
  ]],
];
