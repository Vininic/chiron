export type FlaskLevel = "basico" | "intermediario" | "avancado";
export type FlaskLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type FlaskChapter = readonly [title: string, level: FlaskLevel, primer: string, lessons: readonly FlaskLesson[]];

/** Baseline editorial planejado: Flask moderno; Python/Flask/WSGI/ASGI/adapters reais serão fixados nos gates. */
export const FLASK_CURRICULUM: readonly FlaskChapter[] = [
  ["Runtime, factory e contextos", "basico", "Flask é pequeno na API, não no lifecycle: factory, configuração e contextos precisam ownership explícito.", [
    ["Versões, ambiente e application factory", "resultado depende de Python, Flask, Werkzeug, extensões e factory realmente carregada", "create_app, import metadata, instance path e startup probes", "módulo global criou aplicação antes da configuração de produção"],
    ["Configuração, instance folder e secrets", "config externa é tipada, validada e separa valor público de segredo", "config classes, from_mapping, instance_relative_config e secret providers", "fallback de desenvolvimento ativou secret conhecido em produção"],
    ["Application e request contexts", "proxies locais só existem no contexto e não atravessam thread, task ou job", "current_app, g, request, session, app_context e teardown", "objeto request foi capturado por trabalho tardio"],
    ["CLI, dev server e reloader", "servidor/reloader de desenvolvimento não define semântica nem segurança de produção", "flask CLI, dotenv, debug, reloader e commands com app context", "reloader executou bootstrap e job duas vezes"],
  ]],
  ["Routing e fronteira HTTP", "basico", "Rotas traduzem bytes não confiáveis em comandos pequenos antes de tocar domínio.", [
    ["Routes, methods e converters", "tabela de rotas, métodos e converters é fechada e não despacha callable vindo do request", "route, url_map, converters, url_for e strict slashes", "path dinâmico escolheu função administrativa"],
    ["Request, JSON, forms e uploads", "headers, query, body, forms e files recebem limites e schemas distintos", "request.stream, get_json, form, files, MAX_CONTENT_LENGTH e DTOs", "JSON profundo e upload foram lidos antes do limite"],
    ["Responses, errors e negociação", "status, headers e corpo preservam outcome sem vazar exception", "Response, jsonify, error handlers, MIME, Accept e streaming", "handler amplo converteu commit desconhecido em validation"],
    ["Blueprints, hooks e middleware", "modularidade e hooks mantêm ordem, escopo e cleanup observáveis", "Blueprint, before_request, after_request, teardown e WSGI middleware", "hook global autorizou depois de acessar recurso"],
  ]],
  ["Templates, browser e sessão", "basico", "Jinja, cookies e browser exigem encoding contextual, intenção e políticas finais verificadas.", [
    ["Jinja, autoescape e contextos", "autoescape cobre HTML por padrão, mas safe, URL, JS e rich text exigem contratos próprios", "Jinja environments, Markup, filters, macros e sandbox limits", "filtro marcou conteúdo hostil como seguro"],
    ["Sessions, cookies e CSRF", "sessão assinada não é secreta e mutation autenticada exige prova de intenção", "secure cookie session, rotation/version, SameSite e CSRF tokens", "cookie legível guardou dado sensível e POST cross-site alterou estado"],
    ["CSP, static e assets", "headers e assets finais são parte do artifact e do proxy, não decoração da view", "CSP nonce/hash, send_static_file, manifests, cache e SRI", "CSP wildcard acomodou bundle com script injetado"],
    ["Forms, redirects e flash", "form parsing, redirect e mensagens não permitem mass assignment, open redirect ou vazamento", "WTForms/manual schemas, PRG, url_for, flash e validation errors", "next URL externa capturou sessão do usuário"],
  ]],
  ["Arquitetura e domínio", "intermediario", "Flask permanece na borda; domínio, serviços e adapters conservam contratos próprios.", [
    ["Commands, services e ports", "view cria command e application service coordena portas sem depender de globals Flask", "dataclasses/Pydantic opcional, protocols, services e explicit outcomes", "service leu request global durante retry"],
    ["Extensões e composition root", "extensões são inicializadas na factory e adapters de produção não possuem fallback oculto", "init_app, factories, constructor injection e scopes", "falha de banco selecionou repository em memória"],
    ["Erros, outcomes e transactions", "domínio, infraestrutura e bug mantêm categorias e fronteiras de commit", "custom exceptions, Result/outcome, transaction runner e error mapping", "catch Exception retornou 409 após falha de programação"],
    ["Autenticação, policies e tenant", "identidade e tenant autorizados atravessam query, cache, job e provider", "Flask-Login/tokens, decorators mínimos, policies e scoped repositories", "get global por ID vazou objeto homônimo"],
  ]],
  ["SQLAlchemy e persistência", "intermediario", "ORM não remove transactions, schema, SQL ou concorrência; cada adapter precisa provar seu comportamento no banco alvo.", [
    ["Session, unit of work e mapping", "SQLAlchemy Session tem scope e transaction explícitos e não cruza requests/jobs", "sessionmaker/scoped_session, begin, rollback, expire e mappers", "Session global reteve objeto de outro tenant"],
    ["Models, constraints e Alembic", "schema sustenta invariantes e migrations suportam frota mista", "metadata, FK/unique/check/index, Alembic e expand-contract", "validação Python de unicidade vendeu duas vezes"],
    ["Queries, loading e paginação", "query preserva tenant, cardinalidade e plano sem N+1 ou offset instável", "select, joins, eager loading, keyset e explain", "lazy loading serializou centenas de queries"],
    ["Última vaga e isolamento", "update condicional e identidade estável convergem duas sessões reais", "conditional update, isolation, retries, unique intent e outbox", "select-then-update em duas réplicas vendeu a última vaga duas vezes"],
  ]],
  ["APIs e integrações", "intermediario", "Contratos externos precisam schema, deadlines, identidade e alcance de efeito explícitos.", [
    ["JSON, schemas e OpenAPI", "wire contract diferencia ausência, null, tipos, versões e errors", "Marshmallow/Pydantic/manual schema, OpenAPI e contract tests", "campo desconhecido virou atributo privilegiado"],
    ["HTTP clients, deadlines e TLS", "chamadas externas usam destino fechado, deadline total, TLS e outcome ambíguo", "httpx/requests, adapters, timeouts, retries e stable keys", "timeout pós-efeito foi repetido como falha segura"],
    ["Webhooks, assinaturas e inbox", "bytes crus, timestamp e deduplicação precedem parsing e efeito", "HMAC, constant-time compare, replay window, inbox e schema version", "assinatura foi verificada sobre JSON reserializado"],
    ["Streams, downloads e arquivos", "streaming mantém ownership, limites e headers sem prender context além da resposta", "stream_with_context, generators, send_file e conditional responses", "generator leu Session fechada e path controlado pelo usuário"],
  ]],
  ["Jobs, filas e async", "intermediario", "Trabalho fora do request preserva app context, identidade e obrigação durável sem transportar proxies.", [
    ["Celery, RQ e contexto de task", "task recebe IDs/schema e abre seu próprio app/DB scope", "task factories, app_context, payload versioning e worker lifecycle", "task serializou request e Session da view"],
    ["Retries, idempotência e DLQ", "at-least-once conserva key/fingerprint e classifica transient, permanent e Unknown", "retry policies, backoff/jitter, stable IDs e dead letter", "retry gerou nova key depois do provider aceitar"],
    ["Outbox, claims e fencing", "obrigação nasce com estado e dispatcher concorrente usa claim/fence/reconciliation", "transactional outbox, skip locked/CAS, leases, receipts e anti-entropy", "worker vencido marcou sent depois de perder lease"],
    ["Async views, ASGI e cancellation", "async só sobrepõe I/O compatível e mantém context/deadline/cleanup", "async def views, ensure_sync, ASGI adapters, task groups e cancellation", "função async chamou ORM síncrono dentro da transaction"],
  ]],
  ["Testes e qualidade Flask", "avancado", "A suíte declara quais layers são reais e usa oráculos de estado e efeito.", [
    ["Pytest, unit e contracts", "fixtures pequenas provam domínio e adapters compartilham contract suites", "pytest fixtures/parametrize, fakes, monkeypatch limitado e contracts", "mock confirmou save sem transaction possível"],
    ["Client, integration e browser", "test client não substitui servidor/proxy/browser e cada harness declara alcance", "Flask test client, live server, disposable DB e Playwright", "teste direto da view ignorou middleware e cookies"],
    ["Typing, lint e mutation", "tipos e regras arquiteturais reduzem estados enquanto mutantes medem força dos oráculos", "mypy/pyright, Ruff, protocols, import rules e mutation testing", "tenant filter removido sobreviveu à suíte"],
    ["Property, fuzz e security corpus", "geradores e corpus atingem bytes, schemas, sinks e recursos com seed/shrink", "Hypothesis, parser fuzz, malicious corpus e resource budgets", "JSON profundo travou todos os workers"],
  ]],
  ["Segurança Flask", "avancado", "Defaults úteis não substituem threat model, allowlists, least privilege e prova pelo sink real.", [
    ["Auth, sessão e autorização", "login, sessão/token e policy tenant mantêm revogação e isolamento sistêmico", "password hashing, Flask-Login/tokens, CSRF e scoped policies", "remember cookie sobreviveu à revogação"],
    ["Injection, upload e SSRF", "SQL/template/command/path/URL e upload recebem controles específicos e budgets", "binds, Jinja contexts, argv, safe paths, file decoders e egress", "URL redirecionou para metadata e SVG executou script"],
    ["Secrets, TLS e headers", "segredos rotacionam fora do artifact e TLS/proxy/CSP/cookies são verificados no resultado final", "secret providers, ProxyFix limitado, HTTPS clients e security headers", "ProxyFix confiou em qualquer origem e gerou reset hostil"],
    ["DoS, quotas e incidentes", "bytes, CPU, workers, pools, filas e tenants possuem admission e runbooks", "server/body limits, parser depth, rate limits, backpressure e incident response", "requests baratos saturaram pool e retries mantiveram outage"],
  ]],
  ["Operação e desempenho Flask", "avancado", "Servidor WSGI/ASGI, workers, telemetria e caches precisam combinar com recursos e semântica.", [
    ["Gunicorn, uWSGI e workers", "worker model, threads, timeouts e preload respeitam lifecycle e capacidade", "Gunicorn/uWSGI configs, worker classes, signals e graceful reload", "preload abriu conexão antes do fork"],
    ["Logs, metrics e traces", "telemetria é estruturada, correlacionada, bounded e redigida até jobs/providers", "logging, OpenTelemetry, Prometheus e audit events", "token virou label e trace fechou antes do commit"],
    ["Caching, sessions e state", "cache é derivado, contextual e invalidado; sessão/lock não vira coordenação distribuída", "cache keys, Redis, session stores, stampede e revocation", "cache por ID vazou tenant e stale autorizou mutation"],
    ["Profiling, carga e memória", "performance passa somente com state/effect oracle, fairness e RSS bounded", "profilers, load/soak, query counts e leak analysis", "p50 melhorou porque outbox deixou de ser gravada"],
  ]],
  ["Entrega e recuperação Flask", "avancado", "Artifact, migration, shutdown e restore fecham o contrato operacional.", [
    ["Build, lock e provenance", "Python/wheels/lock/base formam artifact imutável verificável e sem secrets", "pyproject/lock, hashes, wheels, SBOM, container e digest", "imagem resolveu dependência no startup e incluiu token"],
    ["Deploy, migrations e rollback", "canary e expand-contract suportam workers old/new e rollback compatível", "release phase, Alembic, flags, health e mixed-fleet tests", "coluna foi removida com worker antigo ativo"],
    ["Shutdown, workers e recovery", "drain interrompe admission/claims e kill points preservam identities e obrigações", "signals, worker hooks, leases, supervisor e reconciliation", "worker morreu após efeito e retry criou novo ID"],
    ["Backup, restore e incidentes", "restore isolado preserva IDs e reconcilia provider antes de liberar egress", "RPO/RTO, manifests, epoch fencing, drills e postmortem", "restore reenviou efeito já realizado"],
  ]],
  ["Projeto Quíron em Flask", "avancado", "A banca integra factory, HTTP, SQLAlchemy, workers, segurança e recuperação.", [
    ["Arquitetura Flask do Quíron", "factory e boundaries mantêm context Flask fora do domínio e transaction fora do provider", "blueprints, commands/services, scoped repositories e outbox", "view confirmou reserva antes do commit"],
    ["Última vaga e replay Flask", "duas sessões, unique fingerprint e event ID estável convergem concorrência e retry", "SQLAlchemy conditional update, idempotency intent, fenced worker e reconciliation", "duas réplicas venderam a vaga e duplicaram evento"],
    ["Segurança, testes e carga Flask", "corpus hostil e overload preservam tenant, obligations e redaction", "negative auth, browser, static/mutation/fuzz, load readback e fault injection", "worker saturado perdeu outbox e logou token"],
    ["Banca, deploy e restore Flask", "publicação exige artifact, stack real, kill points, mixed fleet e restore sem duplicate effect", "evidence matrix, canary, rollback, crash e restore drill", "test client foi confundido com produção verificada"],
  ]],
];
