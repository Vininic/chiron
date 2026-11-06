export type CppLevel = "basico" | "intermediario" | "avancado";
export type CppLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type CppChapter = readonly [title: string, level: CppLevel, primer: string, lessons: readonly CppLesson[]];

/** Baseline executável planejado: C++20 portátil; C++23 atual e C++26 em evolução ficam explicitamente separados. */
export const CPP_CURRICULUM: readonly CppChapter[] = [
  ["Toolchain, tipos e valores", "basico", "C++ começa pelo contrato entre norma, compilador, biblioteca, build e alvo.", [
    ["C++20, C++23 e matriz de compiladores", "uma edição publicada não implica suporte uniforme do toolchain", "-std=c++20, feature-test macros, warnings e clean build", "exemplo C++23 entrou em target C++20 e artefato antigo foi testado após falha"],
    ["Inicialização, auto e conversões", "inicialização deve preservar faixa e evitar narrowing silencioso", "brace initialization, explicit, auto e checked conversions", "quantity unsigned recebeu -1 e virou valor enorme"],
    ["Valores, referências e const", "referência não estende todo lifetime nem expressa ownership", "value semantics, const&, && e lifetime extension", "callback reteve string_view de request destruído"],
    ["Enums, variant e estados", "estado externo desconhecido precisa falhar fechado e payload deve combinar com tag", "enum class, std::variant, visit e versionamento", "status futuro caiu em default de confirmado"],
  ]],
  ["RAII, objetos e ownership", "basico", "Recursos pertencem a objetos cujo lifetime e destruição são verificáveis.", [
    ["Classes, invariantes e construtores", "objeto publicado deve nascer válido ou não nascer", "constructors, explicit, deleted operations e invariant checks", "construtor deixou objeto parcialmente utilizável após erro"],
    ["RAII e destrutores", "aquisição e liberação seguem lifetime mesmo sob exceção", "scope guards, destructors, noexcept e reverse cleanup", "retorno precoce vazou statement e conexão"],
    ["unique_ptr, shared_ptr e weak_ptr", "smart pointer só ajuda quando ownership escolhido corresponde ao grafo", "unique ownership, make_unique, cycles e weak observer", "ciclo shared_ptr manteve tenant e segredo indefinidamente"],
    ["Rule of zero, move e cópia", "tipo owner deve copiar profundamente, mover ou proibir cópia", "rule of zero/five, move state e strong guarantee", "cópia rasa duplicou owner e causou double delete"],
  ]],
  ["Containers, strings e ranges", "basico", "Container seguro ainda invalida iteradores e views conforme mutação/lifetime.", [
    ["vector, span e invalidação", "reallocação invalida referências e ponteiros para elementos", "std::vector, reserve, span e indices", "ponteiro para item foi usado após push_back mover storage"],
    ["string, string_view e UTF-8", "string_view é borrow de bytes e não possui lifetime/Unicode", "std::string, string_view, encoding e boundary validation", "worker guardou view do body temporário"],
    ["map, unordered_map e hashing", "hash/equality/tenant scope precisam concordar", "custom key, hash, equality, load factor e stable IDs", "hash omitiu tenant e replay retornou reserva alheia"],
    ["ranges e algoritmos", "pipeline lazy não prolonga origem nem elimina custo/efeito", "views, algorithms, projections e materialization", "view escapou de vector local e dereference virou UB"],
  ]],
  ["Erros, contratos e templates", "intermediario", "Erros e genericidade precisam manter invariantes e diagnósticos legíveis.", [
    ["Exceções e guarantees", "erro não pode deixar estado parcial nem atravessar boundary incompatível", "basic/strong/no-throw guarantee, catch e nesting", "capacidade caiu antes de exceção impedir outbox"],
    ["expected, optional e status", "ausência, erro e estado pendente não são o mesmo valor", "std::optional, expected-adapter, enum error e propagation", "timeout remoto virou optional vazio e retry duplicou"],
    ["Templates, concepts e constraints", "template deve falhar por requisito explícito, não por instantiation profunda", "requires, concepts, static_assert e value categories", "serializer aceitou tipo com ponteiro e persistiu endereço"],
    ["Lambdas, captures e callbacks", "captura precisa lifetime e sincronização compatíveis com execução", "value/reference capture, mutable, stop token e ownership", "lambda assíncrona capturou this após destruição"],
  ]],
  ["Concorrência e async", "intermediario", "Threads locais, tasks e processos distribuídos protegem escopos diferentes.", [
    ["jthread, stop_token e lifecycle", "thread deve terminar antes de destruir estado compartilhado", "std::jthread, cooperative stop, join e RAII", "thread detached usou contexto já destruído"],
    ["Mutex, condition_variable e locks", "predicado e invariantes compostas vivem sob mesma disciplina", "lock_guard, unique_lock, scoped_lock e predicate wait", "check fora do lock confirmou última vaga duas vezes"],
    ["Atomics e modelo de memória", "atomicidade local não cria transação nem lifetime seguro", "atomic, CAS, acquire/release e memory reclamation", "flag relaxed publicou objeto incompleto"],
    ["Futures, coroutines e backpressure", "async não cria capacidade nem durabilidade automaticamente", "future/promise, coroutine lifetime, bounded executor e cancellation", "fila de coroutine unbounded esgotou heap"],
  ]],
  ["I/O, serialização e rede", "intermediario", "Bytes parciais, versões e efeitos ambíguos definem as bordas.", [
    ["Filesystem e escrita recuperável", "rename e RAII não equivalem a durabilidade universal", "filesystem paths, temp, sync adapters e manifest", "snapshot novo apareceu mas não sobreviveu a crash"],
    ["Streams, parsing e locale", "parsing deve consumir input inteiro e preservar out em falha", "from_chars, iostream state, locale e bounded buffers", "3x foi aceito como quantidade 3"],
    ["Formatos e schemas versionados", "layout de objeto não é wire format", "JSON/binary envelope, endian, version, length e checksum", "serialização raw de classe falhou em outra ABI"],
    ["HTTP, TLS e retries", "timeout de POST não prova ausência de efeito", "client adapter, TLS validation, stable key e reconciliation", "retry com key nova duplicou cobrança"],
  ]],
  ["Build, módulos e bibliotecas", "intermediario", "Fonte, módulos, ABI e dependências precisam produzir artefato rastreável.", [
    ["Headers, ODR e linkage", "One Definition Rule e inline/templates exigem definições coerentes", "include guards, inline, translation units e symbols", "macro divergente criou definições ODR incompatíveis"],
    ["CMake, presets e dependências", "build reproduzível registra toolchain, flags e artefatos gerados", "targets, usage requirements, presets, lock/hash e clean CI", "include path local oculto fez release usar lib errada"],
    ["Módulos e fronteiras", "module interface muda dependências, não elimina ABI/lifetime", "module interface/implementation, import e build graph", "BMI de compiler diferente foi reutilizada"],
    ["Bibliotecas, ABI e FFI C", "boundary precisa tipos/lifetimes/allocator/version estáveis", "opaque C API, visibility, noexcept boundary e destroy", "exceção cruzou C ABI e terminou processo"],
  ]],
  ["Testes, análise e performance", "avancado", "Correção vem antes do perfil e cada ferramenta prova uma fronteira limitada.", [
    ["Unit, property e mutation testing", "oráculo observa estado/efeito, não só ausência de exception", "fixtures, generators, mutantes e deterministic seeds", "mock sempre sucesso ocultou outbox ausente"],
    ["Sanitizers e static analysis", "ASan/UBSan/TSan/analyzer complementam, não certificam", "instrumented targets, warnings, suppressions e source hash", "Release revelou dangling view ignorada no Debug"],
    ["Profiling, allocation e cache", "otimização requer gargalo medido e invariantes preservadas", "profiler, alloc counters, benchmarks e locality", "zero-copy reteve buffer de outro tenant"],
    ["Undefined behavior e portability", "programa UB não ganha valor esperado por rodar num compiler", "lifetime, aliasing, overflow, optimizer e target matrix", "signed overflow fez guarda desaparecer em -O2"],
  ]],
  ["Persistência e domínio", "avancado", "Modelo rico só é correto quando constraints e transações sustentam seus invariantes.", [
    ["Value objects e aggregate", "tipos de domínio evitam estados inválidos e trocas de unidade", "strong types, factories, aggregate boundary e invariants", "tenantId foi passado como reservationId"],
    ["SQL parametrizado e RAII", "statement/transaction têm lifetime e erros observáveis", "driver wrapper, bind, rows affected e rollback", "ponteiro de coluna foi usado após statement morrer"],
    ["Concorrência, constraints e isolation", "última vaga exige operação/constraint no banco", "conditional update, unique key, transactions e two sessions", "mutex por processo falhou entre réplicas"],
    ["Outbox e idempotência", "commit local e efeito remoto exigem entrega repetível por eventId", "transactional outbox, claim/fencing e provider dedupe", "ack antes do POST perdeu evento"],
  ]],
  ["Arquitetura e observabilidade", "avancado", "Camadas existem para explicitar políticas e adaptadores, não esconder efeitos.", [
    ["Ports, adapters e dependency injection", "interfaces testáveis não transformam fake em integração", "constructor injection, ownership e real adapter gates", "fake SQL verde foi anunciado como lock testado"],
    ["Logging, metrics e tracing", "telemetria correlaciona sem segredo/cardinalidade extrema", "structured fields, eventId, latency e outbox age", "HTTP 201 ficou verde enquanto worker parou"],
    ["Config, secrets e privilege", "produção falha fechada sem secret/TLS/grant correto", "validated config, redaction, least privilege e rotation", "fallback insecure vazou Authorization"],
    ["Health, overload e degradation", "readiness/backpressure precisam refletir capacidade de persistir", "health model, quotas, bounded queues e runbook", "health constante amplificou fila cheia"],
  ]],
  ["Deploy, supply chain e recovery", "avancado", "Artefato só está pronto quando crash e restore preservam identidade e efeitos.", [
    ["Packaging e runtime dependencies", "binário e bibliotecas carregadas devem corresponder ao build atestado", "install rules, RPATH/DLL search, manifest e SBOM", "deploy carregou DLL incompatível do PATH"],
    ["Shutdown, signals e cancellation", "graceful stop não substitui recuperação após kill", "stop_source, signal adapter, drain, join e leases", "callback usou contexto depois do shutdown"],
    ["Migrations, rollout e compatibility", "old/new binaries e payloads precisam conviver durante rollout", "expand-migrate-contract, feature flags e versioned events", "worker antigo confirmou status novo por default"],
    ["Backup, restore e incident response", "backup é aceito somente após restauração e reconciliação", "manifest, RPO/RTO, restore drill e same eventId", "restore sem keys duplicou cobrança"],
  ]],
  ["Projeto Quíron: serviço C++", "avancado", "A banca integra lifetime, concorrência, transação, rede e recuperação sem extrapolar evidências.", [
    ["API e modelo de domínio", "interface impede estado inválido e torna ownership/cancelamento observáveis", "strong request types, expected/status, RAII context e adapters", "view temporária escapou para worker"],
    ["Última vaga e replay", "key/fingerprint/update condicional/outbox formam unidade", "two-session DB gate, eventId, fencing e reconciliation", "duas réplicas confirmaram uma vaga"],
    ["Segurança, fuzz e carga", "input hostil e saturação não podem violar tenant/memória/efeito", "sanitizers, fuzz corpus, bounded executor e load readback", "payload extremo derrubou processo e vazou token"],
    ["Banca, deploy e restore", "publicação exige matriz de compiler, banco, TLS, crash e artefato", "C++20 gate, staging, fault injection, restore e evidence manifest", "parser/densidade foram confundidos com execução real"],
  ]],
];
