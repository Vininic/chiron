export type SpringBootLevel = "basico" | "intermediario" | "avancado";
export type SpringBootLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type SpringBootChapter = readonly [title: string, level: SpringBootLevel, primer: string, lessons: readonly SpringBootLesson[]];

/** Spring Boot 4.x sobre Java 21+: do contexto e HTTP ao serviço recuperável. */
export const SPRING_BOOT_CURRICULUM: readonly SpringBootChapter[] = [
  ["Bootstrapping e contrato de runtime", "basico", "A conveniência do starter precisa ser explicável no classpath e no contexto efetivo.", [
    ["Starter, BOM e compatibilidade", "starter agrega dependências, BOM coordena versões e runtime é decisão explícita", "dependency management, plugin de build e requisitos do Boot 4 delimitam artefato", "upgrade parcial combinou Spring Framework incompatível com Boot"],
    ["SpringApplication e ciclo de startup", "processo só está pronto quando contexto e dependências críticas estão válidos", "SpringApplication, ApplicationContext, runners e exit codes formam lifecycle", "readiness ficou verde enquanto migration ainda falhava"],
    ["Component scan e organização de packages", "escopo de descoberta determina que beans existem", "@SpringBootApplication, @ComponentScan e imports compõem grafo", "service fora do package raiz sumiu apenas no deploy"],
    ["Auto-configuration e conditions", "configuração automática é condicionada e pode recuar diante de beans próprios", "ConditionEvaluationReport, classpath, properties e @Conditional orientam diagnóstico", "bean customizado desativou configuração esperada silenciosamente"],
  ]],
  ["IoC, beans e fronteiras", "basico", "O container gerencia construção e lifecycle; domínio continua independente dele.", [
    ["Injeção por construtor e dependências", "dependências obrigatórias devem estar explícitas na construção", "@Component, @Service, @Bean e constructor injection definem grafo", "injeção de campo permitiu objeto incompleto em teste"],
    ["Escopos e lifecycle de beans", "singleton não significa thread-safe e request scope tem duração própria", "singleton, prototype, request, @PostConstruct e @PreDestroy controlam estado", "estado mutável de request vazou entre usuários num singleton"],
    ["Profiles, properties e binding", "configuração tipada deve falhar cedo quando inválida", "@ConfigurationProperties, validation e ordem de PropertySources modelam ambiente", "default de desenvolvimento apontou produção para banco errado"],
    ["Portas, adapters e configuração explícita", "framework monta adapters sem penetrar regra de negócio", "@Configuration, @Bean e interfaces do núcleo separam capacidades", "entidade importou repository Spring e tornou regra impossível de testar sem contexto"],
  ]],
  ["HTTP MVC e contratos", "basico", "Uma rota é fronteira de validação, autorização, tempo e efeito.", [
    ["Controllers, rotas e representação", "método, path, status e media type compõem contrato público", "@RestController, @RequestMapping e ResponseEntity mapeiam decisões", "controller retornou 200 para criação recusada e cliente fez retry errado"],
    ["Binding, validação e erros", "DTO hostil precisa de limites e mensagem estável", "@RequestBody, Bean Validation e @ControllerAdvice normalizam erros", "payload gigante foi alocado antes de qualquer validação"],
    ["Filtros, interceptors e contexto", "correlação e autenticação devem atravessar request sem contaminar próxima", "Filter, HandlerInterceptor e argument resolution têm pontos diferentes", "ThreadLocal de tenant vazou em executor compartilhado"],
    ["Uploads, downloads e streaming", "corpo de request/response tem ownership e teto de memória", "MultipartFile, Resource, streaming response e headers regulam bytes", "download carregou arquivo inteiro e derrubou heap"],
  ]],
  ["Persistência e transações", "intermediario", "Anotações não removem atomicidade, concorrência nem resultado ambíguo.", [
    ["DataSource, JdbcClient e SQL", "SQL parametrizado e connection pool são contratos observáveis", "DataSource, JdbcClient/JdbcTemplate e Hikari governam acesso", "conexão ficou presa enquanto método chamava provedor remoto"],
    ["Spring Data JPA e entidades", "repositório e ORM não substituem modelagem de agregados e query", "repositories, entity mapping, lazy loading e dirty checking têm custo", "N+1 requests multiplicaram queries sob lista de reservas"],
    ["@Transactional, proxies e rollback", "transação declarativa depende de interceptação, boundary e política de falha", "proxy, propagation, rollback rules e self-invocation explicam comportamento", "chamada interna ignorou @Transactional e gravou metade do comando"],
    ["Migrations, isolamento e idempotência", "schema e código evoluem juntos; concorrência exige constraint durável", "Flyway/Liquibase, unique key e isolamento protegem replay", "duas instâncias rodaram DDL incompatível durante rollout"],
  ]],
  ["Segurança e identidade", "intermediario", "Autenticação, autorização e proteção de fronteira são decisões diferentes.", [
    ["SecurityFilterChain e regras HTTP", "ordem das regras e default deny determinam superfície exposta", "Spring Security filters, matchers e SecurityFilterChain compõem política", "nova rota ficou pública por matcher amplo"],
    ["Sessão, JWT e CSRF", "credencial e mecanismo de sessão definem ameaça e mitigação", "session cookies, bearer token e proteção CSRF têm contextos próprios", "desligar CSRF sem analisar cookie abriu operação mutável"],
    ["Autorização de tenant e método", "identidade autenticada não autoriza todo recurso", "method security, ownership checks e predicates no banco restringem escopo", "tenant do JSON substituiu tenant da credencial"],
    ["CORS, headers e segredo", "fronteira do browser e segredo de runtime não são a mesma coisa", "CORS config, response headers e externalized secrets protegem superfície", "origem wildcard combinada com credenciais expôs dados"],
  ]],
  ["Mensageria e integração externa", "intermediario", "Operações remotas não participam automaticamente da transação local.", [
    ["HTTP clients e timeout", "budget total, limite de corpo e classificação de erro governam chamada", "RestClient/WebClient, client connectors e timeout configuram fronteira", "timeout depois do commit remoto virou retry com chave nova"],
    ["Eventos de aplicação e outbox", "evento em memória não é mensagem durável", "ApplicationEventPublisher e transactional outbox têm durabilidade distinta", "evento enviado antes do commit anunciou reserva inexistente"],
    ["Jobs, scheduling e ownership", "task agendada precisa de lease, idempotência e shutdown", "@Scheduled, TaskExecutor e locks distribuídos definem execução", "duas réplicas executaram cobrança agendada duas vezes"],
    ["Resiliência, retry e circuit breaker", "repetição depende de semântica de efeito e orçamento", "retry/backoff/circuit breaker/bulkhead controlam pressão", "retry automático repetiu POST não idempotente"],
  ]],
  ["Testes e arquitetura verificável", "intermediario", "Cada camada tem um oracle apropriado e custo de execução explícito.", [
    ["JUnit, testes de domínio e fakes", "núcleo não deve precisar de ApplicationContext para provar regra", "JUnit, Clock injetado e fake de porta isolam decisões", "mock verificou chamada mas não detectou reserva duplicada"],
    ["Slices MVC, JSON e segurança", "test slice valida boundary sem iniciar toda aplicação", "@WebMvcTest, MockMvc e security test exercitam status e autorização", "controller retornou corpo correto mas sem header de cache/segurança"],
    ["@SpringBootTest e contexto real", "wiring e auto-configuration exigem teste de contexto representativo", "SpringBootTest, test properties e context caching controlam integração", "teste passou com profile dev e falhou com config de deploy"],
    ["Banco real, fixtures e contratos", "fake não prova SQL, migration, isolation ou pool", "Testcontainers ou banco externo de teste e migration fecham gate", "H2 aceitou SQL diferente do banco de produção"],
  ]],
  ["Actuator e observabilidade", "avancado", "Telemetria precisa apoiar resposta a incidente sem criar superfície nova.", [
    ["Health, readiness e liveness", "cada probe deve representar uma decisão operacional diferente", "Actuator health groups, readiness e liveness ligam estado a tráfego", "liveness dependente de banco reiniciou todas as réplicas"],
    ["Métricas Micrometer e cardinalidade", "labels sem limite e buckets errados tornam métrica cara ou enganosa", "MeterRegistry, timers e tags descrevem pressão", "user id como tag criou milhões de séries"],
    ["Tracing, logs e redaction", "contexto distribuído precisa sobreviver async sem transportar segredo", "observation, trace context e MDC compõem jornada", "token apareceu no span exportado"],
    ["Diagnóstico de contexto e JVM", "conditions, beans, JFR e pool wait ajudam explicar comportamento real", "Actuator endpoints, condition report e profiler triangulam causa", "GC foi culpado por latência causada por fila JDBC"],
  ]],
  ["Performance e concorrência", "avancado", "Mais threads não aumentam a capacidade do banco ou provedor.", [
    ["Servlet threads e virtual threads", "modelo de thread muda custo de espera, não orçamento downstream", "Tomcat executor, virtual threads e blocking calls definem ocupação", "ativar virtual threads criou backlog de conexões"],
    ["Pool, cache e backpressure", "filas e caches precisam de tamanho, política e métrica", "Hikari metrics, cache bounds e admission limit controlam pressão", "cache sem TTL reteve payload e elevou live set"],
    ["Queries, N+1 e profiling", "otimização deve partir de plano e trace reais", "query count, indexes, JFR e load testing localizam gargalo", "benchmark de método ignorou lock e pool wait"],
    ["Tuning e orçamento de memória", "heap, GC, threads, buffers e container competem por memória", "JVM flags, actuator metrics e RSS embasam tuning", "Xmx igual ao limite do container causou OOM kill"],
  ]],
  ["Build, configuração e deploy", "avancado", "O artefato e seu ambiente precisam ser reproduzíveis e recuperáveis.", [
    ["Executable jar, layers e imagem", "empacotamento precisa conter dependências e startup reproduzível", "Boot plugin, layered jars e buildpacks constroem artefato", "JAR da IDE funcionou mas imagem não tinha recurso"],
    ["Profiles e config de produção", "profile não é autorização para defaults inseguros", "ConfigData, properties, validation e secrets definem ambiente", "fallback abriu app com credencial de teste"],
    ["Migrations e rollout compatível", "réplicas antigas e novas coexistem durante deploy", "expand-migrate-contract, probes e canary governam transição", "renomear coluna no mesmo release derrubou metade do tráfego"],
    ["Shutdown, drain e rollback", "processo deve sair sem perder trabalho durável", "graceful shutdown, readiness e outbox recovery fecham ciclo", "SIGTERM fechou pool antes de publicar outbox"],
  ]],
  ["Segurança operacional e extensões", "avancado", "A superfície de framework, dependências e runtime deve ser auditável.", [
    ["Auto-config customizada e starters", "extensão só deve ativar sob condições verificadas", "AutoConfiguration imports, @Conditional e context runner testam composição", "starter acidental criou bean em app sem capacidade necessária"],
    ["Supply chain, SBOM e patching", "BOM alinha versões, mas não prova integridade ou ausência de CVE", "dependency graph, SBOM e image provenance guiam atualização", "transitiva vulnerável entrou sem revisão"],
    ["Native image e AOT", "ahead-of-time muda reflection, recursos e diagnóstico", "AOT processing, runtime hints e native test cobrem caminho", "serializer reflexivo funcionou na JVM e falhou na imagem nativa"],
    ["Incidentes, limites e recovery", "runbook precisa demonstrar falha, rollback e restauração", "fault injection, restore drill e telemetry fecham operação", "backup existia mas não restaurava chave de idempotência"],
  ]],
  ["Projeto Quíron: API Spring Boot", "avancado", "O projeto final integra domínio Java, HTTP, transação e operação recuperável.", [
    ["Módulos e contratos do serviço", "domínio de reserva preserva invariantes fora do framework", "ports/adapters, DTO e config beans isolam fronteiras", "controller concentrou SQL e regra de capacidade"],
    ["Reserva transacional e idempotência", "request key, fingerprint, reserva e outbox comitam juntos", "@Transactional no boundary e unique constraints protegem replay", "chamada interna ao método anotado não abriu transação"],
    ["Segurança, carga e observabilidade", "tenant, limites e sinais devem permanecer corretos sob pico", "SecurityFilterChain, bounded admission e Actuator evidenciam pressão", "tenant ruidoso saturou pool e outro cliente perdeu SLA"],
    ["Banca, deploy e restore", "cada requisito tem oracle, mutante e procedimento de recuperação", "test slices, DB real, JFR, canary e restore drill fecham release", "happy path passou mas outbox desapareceu no restore"],
  ]],
];
