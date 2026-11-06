export type CSharpLevel = "basico" | "intermediario" | "avancado";
export type CSharpLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type CSharpChapter = readonly [title: string, level: CSharpLevel, primer: string, lessons: readonly CSharpLesson[]];

/** Baseline compilável no SDK .NET 8/C# 12 local; .NET 10/C# 14 é evolução explicitamente separada. */
export const CSHARP_CURRICULUM: readonly CSharpChapter[] = [
  ["Toolchain, projeto e semântica inicial", "basico", "Compilar e executar fora da IDE distingue linguagem, SDK e runtime.", [
    ["SDK, target framework e build", "SDK compila; runtime executa; TFM e versão de linguagem são contratos distintos", "csproj, global.json, dotnet build/run/publish e warnings as errors", "build local usou SDK mais novo que agente e publicou API indisponível"],
    ["Tipos, literais e conversões", "conversão não pode perder precisão ou domínio silenciosamente", "numeric types, checked/unchecked, decimal e parsing com cultura", "preço em double acumulou erro e conversão truncou centavos"],
    ["Controle de fluxo e pattern matching", "decisão exaustiva torna estado inválido visível", "switch expression, property patterns e guards modelam transições", "novo estado caiu no default de sucesso"],
    ["Métodos, parâmetros e localidade", "assinatura e ownership de argumento devem ser explícitos", "overloads, named/optional, ref/out/in e local functions", "ref alterou estado de chamador apesar de API parecer pura"],
  ]],
  ["Null, valores e modelagem", "basico", "O sistema de tipos ajuda quando invariantes são expressas no modelo.", [
    ["Nullable reference types", "nullable annotations são análise estática e exigem validação de borda", "? em referência, flow analysis, ! e guard clauses", "null-forgiving ocultou payload ausente e lançou em produção"],
    ["Records e igualdade", "igualdade de valor é útil, mas mutabilidade interna pode quebrá-la", "record class/struct, init, with e equality members", "record guardou List mutável e chave de cache mudou após inserção"],
    ["Struct, enum e discriminantes", "tipo de valor tem cópia; enum inválido pode entrar de fora", "readonly struct, record struct, enum validation e estados tipados", "cast inteiro aceitou status 99 como confirmado"],
    ["Generics e constraints", "genérico deve preservar tipo sem casts frágeis", "where constraints, variance e APIs de collections", "covariância presumida em lista mutável causou falha de runtime"],
  ]],
  ["Objetos, interfaces e ciclo de vida", "basico", "Objetos encapsulam invariantes; container não substitui construção correta.", [
    ["Classes, propriedades e encapsulamento", "construtor e métodos protegem estados possíveis", "access modifiers, required/init, private setters e validação", "setter público permitiu reserva confirmada sem pagamento"],
    ["Interfaces, composição e DI", "dependências explícitas tornam regra testável sem host", "interfaces, constructor injection, Microsoft.Extensions.DependencyInjection", "service locator ocultou dependência e teste usou adapter real"],
    ["Lifetimes scoped, singleton e transient", "lifetime define ownership, não segurança de thread", "DI scopes, IDisposable e captive dependency validation", "singleton reteve DbContext scoped de outro request"],
    ["Events, delegates e closures", "callback não é fila durável e captura tem lifetime", "delegate, event, lambda capture e unsubscribe", "handler de singleton reteve request inteiro e vazou memória"],
  ]],
  ["Coleções, LINQ e dados", "intermediario", "Consulta em memória e consulta remota têm semânticas e custos diferentes.", [
    ["List, Dictionary, HashSet e comparers", "chaves precisam igualdade e normalização estáveis", "IEqualityComparer, dictionary lookup e immutable collections", "tenant ignorado no comparer deduplicou clientes diferentes"],
    ["IEnumerable, lazy evaluation e materialização", "enumerar pode executar novamente e repetir efeito", "yield, deferred execution, ToList e múltipla enumeração", "query de cobrança foi reexecutada em log e enviou pedido duas vezes"],
    ["LINQ operators e grão", "Where, Select, GroupBy e Join mudam cardinalidade observável", "LINQ to Objects, grouping e ordenação estável", "join multiplicou reservas e relatório cobrou valor dobrado"],
    ["Span, Memory e buffers", "views de memória não são ownership nem podem escapar de escopo", "Span<T>, ReadOnlySpan<T>, Memory<T> e ArrayPool<T>", "buffer pooled voltou ao pool antes de callback terminar"],
  ]],
  ["Erros, recursos e arquivos", "intermediario", "Falha e cancelamento precisam preservar causa e liberar recursos.", [
    ["Exceptions e filtros", "exception mantém stack/cause; resultado esperado tem tipo próprio", "try/catch/finally, throw, filters e custom exceptions", "throw ex apagou stack da falha original"],
    ["IDisposable e await using", "recurso possui dono e deve fechar em todo caminho", "using, IAsyncDisposable e lifetime de stream/conexão", "stream foi retornado após using e download falhou no meio"],
    ["File, Path e streaming", "path hostil e corpo grande exigem validação e fluxo limitado", "FileStream, Path.GetFullPath, async copy e temp files", "upload com .. sobrescreveu arquivo fora da raiz"],
    ["JSON e contratos versionados", "DTO público não deve serializar segredo nem entidade inteira", "System.Text.Json, options, converters e required fields", "renomear propriedade quebrou cliente antigo sem teste"],
  ]],
  ["Async, concorrência e cancelamento", "intermediario", "Task representa trabalho; não garante exclusividade ou entrega.", [
    ["Task, async e await", "async não transforma CPU-bound em não bloqueante e exception permanece observável", "Task<T>, await, ConfigureAwait e Task.WhenAll", "fire-and-forget perdeu exception e cobrou depois da resposta"],
    ["CancellationToken e deadlines", "cancelamento é cooperativo e não desfaz efeito remoto", "linked tokens, timeout, ThrowIfCancellationRequested", "timeout local gerou retry com chave nova após cobrança remota"],
    ["Locks, Interlocked e channels", "concorrência exige boundary e capacidade da fila", "lock, SemaphoreSlim, Interlocked e Channel<T> bounded", "fila unbounded consumiu heap sob pico"],
    ["Parallelism e race testing", "mais tasks não criam conexões nem eliminam interleaving", "Parallel.ForEachAsync, barriers e testes concorrentes", "duas chamadas passaram check-then-insert e confirmaram última vaga"],
  ]],
  ["HTTP e ASP.NET Core", "intermediario", "Endpoint é contrato de método, identidade, tempo e efeito.", [
    ["Host, middleware e configuração", "ordem de middleware e config determinam o request efetivo", "WebApplication, pipeline, options binding e environments", "UseAuthorization antes de UseAuthentication negou acesso legítimo"],
    ["Minimal APIs, controllers e validação", "binding hostil não pode alcançar regra sem validação", "MapPost, Results/ProblemDetails, DTO e filters", "controller aceitou tenant do JSON e cruzou fronteira"],
    ["HttpClientFactory e integrações", "client precisa lifetime, deadline e key estável", "IHttpClientFactory, typed clients, handlers e resilience", "new HttpClient por request exauriu sockets e retry duplicou POST"],
    ["Uploads, downloads e limites", "request/response streaming precisa teto de bytes e cleanup", "IFormFile, Stream, range/headers e rate limit", "download materializou arquivo de 2 GB no heap"],
  ]],
  ["Persistência e transações", "avancado", "ORM não substitui constraints, isolamento e plano de consulta.", [
    ["ADO.NET e SQL parametrizado", "comando SQL deve delimitar conexão, transação e parâmetros", "DbConnection, DbCommand, parameters e pooling", "concatenar tenant em SQL permitiu injeção e vazamento"],
    ["EF Core, tracking e LINQ traduzido", "LINQ remoto executa no banco e tracking tem custo/semântica", "DbContext, AsNoTracking, projection e generated SQL", "N+1 em lista de reservas saturou banco"],
    ["Transactions, concurrency tokens e retry", "transação local não inclui provedor HTTP; retry depende de efeito", "BeginTransaction, SaveChanges, rowversion/concurrency token", "retry da transação gerou duas cobranças remotas"],
    ["Migrations, constraints e idempotência", "schema evolui junto com binário e chave composta protege replay", "EF migrations, unique indexes e expand-migrate-contract", "rollout removeu coluna usada por pod antigo"],
  ]],
  ["Segurança, testes e observabilidade", "avancado", "Política precisa ser exercitada com identidades e dados reais de teste.", [
    ["Authentication, authorization e tenant", "token válido não autoriza qualquer recurso", "auth handlers, policies, claims e predicate no banco", "tenant do header substituiu claim e leu reserva alheia"],
    ["CSRF, CORS e secrets", "browser, cookie e bearer têm ameaças diferentes", "CORS policy, antiforgery, secret stores e redaction", "CORS wildcard com credenciais e token no log expôs dados"],
    ["xUnit, fakes e WebApplicationFactory", "regra, HTTP e wiring pedem oráculos distintos", "xUnit, fake ports, TestServer e integração com banco", "mock confirmou SaveChanges sem detectar reserva duplicada"],
    ["Logging, metrics e tracing", "telemetria precisa ligar request, outbox e provedor sem PII", "ILogger, OpenTelemetry, Activity e Meter", "request key como tag criou milhões de séries"],
  ]],
  ["Runtime, deploy e recuperação", "avancado", "Build, imagem e shutdown devem ser reproduzíveis e recuperáveis.", [
    ["GC, alocação e profiling", "heap, buffers e container competem por memória", "GC modes, dotnet-counters, dotnet-trace e allocation profiling", "buffer em pool reteve payload e RSS estourou limite"],
    ["Publish, trimming e Native AOT", "otimização de build altera reflection e recursos", "dotnet publish, trimming warnings, AOT e serialization metadata", "serializer reflexivo passou JIT e falhou em AOT"],
    ["Health checks, shutdown e drain", "liveness local e readiness útil controlam tráfego sem cascata", "HealthChecks, IHostedService e SIGTERM/grace period", "liveness dependente de banco reiniciou todas réplicas"],
    ["Supply chain, config e rollback", "artefato e schema devem permitir versão anterior coexistir", "SBOM, pinned SDK, image digest e canary", "rollback de imagem falhou após migration destrutiva"],
  ]],
  ["Bibliotecas, interoperabilidade e design", "avancado", "APIs públicas devem sobreviver a versão, ambiente e implementação.", [
    ["Assemblies, packages e versionamento", "dependência transitiva e API pública têm contrato de compatibilidade", "NuGet, assemblies, semantic versioning e source generators", "package alterou comportamento por update transitivo"],
    ["Reflection, attributes e generators", "metadados em runtime têm custo e restrições AOT", "reflection, attributes, analyzers/source generators", "assembly scan não encontrou handler em publish trimmed"],
    ["Interop, unsafe e ownership", "código nativo exige lifetime/pinning/encoding explícitos", "P/Invoke, SafeHandle, Span e unsafe", "callback nativo usou buffer já liberado"],
    ["API design e compatibilidade", "contrato de biblioteca inclui nullability, exception e cancellation", "public interfaces, analyzers e versioning tests", "método mudou exception para null e consumidor perdeu falha"],
  ]],
  ["Projeto Quíron: API C#", "avancado", "A banca exige correção após corrida, timeout remoto, deploy e restore.", [
    ["Módulos e contrato de reserva", "núcleo C# modela capacidade e identidade sem ASP.NET/EF", "ports/adapters, DTO e DI isolam fronteiras", "endpoint concentrou SQL e regra de capacidade"],
    ["Idempotência, transação e outbox", "key, fingerprint, reserva e evento comitam juntos", "constraint, transação EF/ADO.NET e worker com lease", "falha pós-commit gerou replay com chave nova"],
    ["Segurança, carga e observabilidade", "tenant, limites e sinais permanecem corretos sob pico", "policies, bounded Channel e OpenTelemetry", "cliente ruidoso saturou pool e outro perdeu SLA"],
    ["Banca, deploy e restore", "cada requisito tem oracle, mutante e procedimento de recuperação", "WebApplicationFactory, banco real, canary e restore drill", "backup tinha reserva mas não request key/outbox"],
  ]],
];
