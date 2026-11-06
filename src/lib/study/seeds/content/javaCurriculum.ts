export type JavaLevel = "basico" | "intermediario" | "avancado";
export type JavaLessonSpec = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type JavaChapterSpec = readonly [title: string, level: JavaLevel, primer: string, lessons: readonly JavaLessonSpec[]];

/** Currículo Java moderno: linguagem, bibliotecas, JVM e entrega operacional. */
export const JAVA_CURRICULUM: readonly JavaChapterSpec[] = [
  ["Toolchain, fonte e execução", "basico", "Do fonte ao processo, cada artefato e opção de runtime precisa ser observável.", [
    ["JDK, JRE, versões e vendors", "compilar e executar são capacidades distintas e versionadas", "java, javac, release train, LTS e runtime image definem compatibilidade", "bytecode compilado numa versão nova foi implantado numa JVM antiga"],
    ["Fonte, classe, main e argumentos", "o entrypoint é um contrato de processo, entrada e saída", "compilation units, classes, main, args e exit codes estruturam o programa", "erro foi impresso mas o processo terminou com código zero"],
    ["Packages, classpath e module path", "nome lógico e localização de classes precisam concordar", "packages, imports, classpath, module path e class loaders resolvem tipos", "duas versões da mesma classe produziram comportamento dependente da ordem"],
    ["JShell, javac, jar e diagnóstico", "ferramentas mínimas devem reproduzir compilação e empacotamento sem IDE", "JShell explora, javac compila e jar preserva manifest e classes", "a aplicação funcionava só pelo classpath implícito da IDE"],
  ]],
  ["Tipos, valores e fluxo de controle", "basico", "Java separa valores primitivos, referências e conversões com regras estáticas e runtime.", [
    ["Primitivos, overflow e precisão", "representação numérica determina domínio e falhas", "tipos integrais, floating point, BigDecimal e operações exatas expressam limites", "dinheiro em double e overflow silencioso alteraram cobrança"],
    ["Referências, null e identidade", "igualdade de identidade não substitui igualdade de valor", "references, null, equals, hashCode e Optional têm papéis diferentes", "String comparada com == passou em teste por interning e falhou em produção"],
    ["Strings, Unicode e text blocks", "texto é Unicode codificado e possui custo/normalização", "String imutável, code points, Charset, formatter e text blocks preservam intenção", "corte por char separou surrogate pair e corrompeu identificador"],
    ["Controle, switch e escopo", "fluxo explícito deve cobrir estados e efeitos", "if, loops, switch expressions, yield e pattern matching modelam decisões", "default genérico ocultou novo estado de domínio"],
  ]],
  ["Objetos, contratos e modelagem", "basico", "Tipos devem tornar invariantes e evolução visíveis, não apenas agrupar campos.", [
    ["Classes, encapsulamento e invariantes", "objeto válido protege transições em toda entrada", "constructors, factories, access modifiers e defensive copies fecham estado", "setter público permitiu saldo negativo"],
    ["Records e value objects", "dados imutáveis transparentes reduzem cerimônia sem eliminar validação", "records, canonical constructors e value semantics definem carriers", "record guardou lista mutável e mudou hash depois de entrar no mapa"],
    ["Interfaces, herança e composição", "polimorfismo deve expressar capacidade substituível", "interfaces, abstract classes, default methods e composition delimitam contratos", "subclasse violou pré-condição e quebrou consumidor"],
    ["Sealed types e patterns", "hierarquias fechadas permitem decisões exaustivas e evolutivas", "sealed, permits, records e pattern switch representam soma de tipos", "nova variante atravessou serializer mas não regra de negócio"],
  ]],
  ["Generics e Collections", "intermediario", "Tipos parametrizados e estruturas de dados carregam garantias, custos e contratos de igualdade.", [
    ["Generics, invariância e wildcards", "variância precisa seguir quem produz e quem consome", "type parameters, bounds, PECS e capture protegem operações", "cast raw inseriu tipo errado e falhou longe da origem"],
    ["Erasure, reificação e arrays", "informação genérica não está igualmente disponível no runtime", "type erasure, bridge methods, Class tokens e arrays reificados explicam limites", "checagem instanceof presumiu argumento genérico inexistente"],
    ["List, Set, Map e igualdade", "estrutura correta depende de ordem, unicidade, lookup e mutabilidade", "collection interfaces, implementations, equals e hashCode sustentam invariantes", "chave mutável tornou entrada inalcançável no HashMap"],
    ["Imutabilidade, cópias e concorrência", "unmodifiable view não é necessariamente snapshot imutável", "copyOf, wrappers, persistent style e ownership controlam aliasing", "lista interna vazou por getter e foi alterada sem validação"],
  ]],
  ["Exceções, recursos e APIs", "intermediario", "Falhas precisam preservar causa, classificação e cleanup sem esconder estado ambíguo.", [
    ["Checked, unchecked e fronteiras", "categoria de erro deve orientar recuperação possível", "exception hierarchy, throws e tradução por boundary formam contrato", "catch Exception converteu bug em lista vazia"],
    ["Causa, contexto e suppressed", "diagnóstico útil preserva a falha original sem vazar segredo", "cause chaining, messages e suppressed exceptions explicam a sequência", "erro de close apagou a falha de persistência"],
    ["Try-with-resources e ownership", "quem adquire recurso define quando e como ele fecha", "AutoCloseable e ordem reversa garantem cleanup estruturado", "stream retornado após fechar conexão falhou durante consumo"],
    ["Design de API e validação", "contratos públicos precisam de pré-condições, tipos e evolução compatível", "factories, builders, overloads e validation delimitam entrada", "overload com null tornou chamada ambígua após evolução"],
  ]],
  ["Lambdas, Streams e dados", "intermediario", "Pipelines declarativos precisam conservar cardinalidade, ordem, efeitos e custo.", [
    ["Lambdas e interfaces funcionais", "função capturada deve ter contrato e efeitos conhecidos", "functional interfaces, method references e effectively final compõem comportamento", "lambda capturou objeto mutável compartilhado"],
    ["Streams, lazy evaluation e terminal", "pipeline só executa no terminal e pode consumir fonte uma vez", "intermediate/terminal operations, encounter order e short circuit definem execução", "peek foi usado como efeito e desapareceu sem terminal"],
    ["Collectors e agregação", "collector combina identidade, acumulação e merge sob invariantes", "grouping, mapping, reducing e custom collectors controlam shape", "toMap sem merge falhou em chave duplicada"],
    ["Parallel streams e side effects", "paralelismo só ajuda trabalho divisível e sem estado compartilhado", "spliterators, fork-join, associatividade e common pool definem custo", "lista não thread-safe perdeu elementos em parallel stream"],
  ]],
  ["I/O, arquivos e serialização", "intermediario", "Bytes, texto, paths e formatos cruzam fronteiras de segurança e durabilidade.", [
    ["Bytes, chars e charsets", "decodificação deve ser explícita e validada", "InputStream, Reader, CharsetDecoder e buffering convertem dados", "default charset mudou entre hosts e corrompeu arquivo"],
    ["Paths, Files e atomicidade", "path é entrada hostil e filesystem tem semântica própria", "Path normalization, Files, atomic move e permissions protegem escrita", "zip slip gravou fora do diretório autorizado"],
    ["NIO, buffers e channels", "buffer possui posição, limite e ownership", "ByteBuffer, flip/compact, channels e selectors estruturam I/O", "esquecer flip enviou zero bytes"],
    ["Formatos, JSON e serialização segura", "formato persistido é contrato versionado e não deve executar tipos arbitrários", "schemas, adapters e serialization filters limitam entrada", "desserialização nativa aceitou gadget não confiável"],
  ]],
  ["Concorrência e memória", "intermediario", "Corretude concorrente depende de lifecycle, happens-before e contenção, não de timing.", [
    ["Threads, executors e lifecycle", "tarefa precisa de owner, limite e encerramento", "Thread, ExecutorService, Future e shutdown coordenam trabalho", "pool não encerrado manteve processo vivo"],
    ["Happens-before, locks e atomics", "visibilidade e atomicidade são garantias distintas", "synchronized, volatile, Lock e atomic classes estabelecem ordem", "volatile increment perdeu atualizações"],
    ["CompletableFuture e cancelamento", "composição assíncrona precisa propagar falha, executor e deadline", "stages, exception handling, timeouts e cancellation formam pipeline", "join bloqueou common pool e mascarou causa"],
    ["Virtual threads e contenção", "virtual threads ampliam concorrência bloqueante, não CPU nem dependências", "Thread.ofVirtual, semaphores e pinning diagnostics controlam admissão", "milhões de requests saturaram pool JDBC de cinquenta conexões"],
  ]],
  ["JVM, memória e performance", "avancado", "A JVM otimiza e coleta com dados observáveis; folklore não substitui medição.", [
    ["Bytecode, loading e linking", "classes têm identidade por nome e class loader", "verification, loading, linking, initialization e delegation definem lifecycle", "plugin fez cast entre classes iguais carregadas por loaders diferentes"],
    ["Heap, stacks e referências", "alcance, não utilidade, governa coleta", "heap, thread stacks, metaspace e reference types explicam retenção", "cache estático reteve class loader após redeploy"],
    ["GC, pausas e alocação", "collector e heap devem atender throughput e latency medidos", "GC logs, generations, allocation rate e live set orientam tuning", "heap maior apenas adiou OOM causado por retenção"],
    ["JIT, benchmarks e profiling", "otimização adaptativa invalida microbenchmark ingênuo", "warmup, JMH, JFR e async profiling distinguem custo", "nanoTime loop mediu código eliminado pelo JIT"],
  ]],
  ["Módulos, build, testes e segurança", "avancado", "Entrega reprodutível combina dependências, encapsulamento, testes e supply chain.", [
    ["JPMS e encapsulamento forte", "módulos declaram leitura e exposição em vez de classpath global", "module-info, requires, exports, opens e services fecham fronteiras", "reflection funcionou no classpath e falhou no module path"],
    ["Maven, Gradle e dependências", "build deve resolver artefatos reproduzíveis e auditáveis", "coordinates, scopes/configurations, locks e toolchains fixam grafo", "dependência transitiva mudou sem revisão"],
    ["JUnit, testes e determinismo", "teste confiável controla tempo, I/O, concorrência e estado", "JUnit lifecycle, parameterized tests, fakes e timeouts constroem evidência", "teste passava isolado e falhava por locale compartilhado"],
    ["Segurança e supply chain", "entrada, reflexão, processos e dependências possuem capacidades explícitas", "validation, TLS, serialization filters, SBOM e least privilege reduzem superfície", "ProcessBuilder incorporou comando do usuário em shell"],
  ]],
  ["Rede, persistência e observabilidade", "avancado", "Serviços Java precisam tratar HTTP, banco e telemetria como fronteiras falíveis.", [
    ["HTTP Client, deadlines e retries", "request remoto exige deadline, idempotência e limite de corpo", "java.net.http, BodyHandlers, cancellation e backoff controlam chamadas", "retry após timeout duplicou operação"],
    ["JDBC, transações e pools", "conexão e transação possuem ownership e estado que não pode vazar", "DataSource, prepared statements, isolation e try-with-resources governam acesso", "conexão voltou ao pool com autoCommit false"],
    ["Logs, métricas e tracing", "correlação precisa explicar uma jornada sem registrar segredo", "structured logging, JFR, JMX e OpenTelemetry conectam sinais", "user id como label explodiu cardinalidade"],
    ["Configuração, shutdown e deploy", "processo deve validar configuração e encerrar trabalho dentro do prazo", "env, properties, signals, shutdown hooks e health checks coordenam lifecycle", "readiness ficou verde antes de migration obrigatória"],
  ]],
  ["Projeto Quíron: serviço Java", "avancado", "O projeto final integra domínio, concorrência, persistência, observação e recuperação.", [
    ["Domínio, portas e adapters", "núcleo de reservas deve permanecer testável sem framework", "records, sealed commands, ports e adapters isolam efeitos", "entidade passou a depender de JSON e JDBC"],
    ["API, transação e idempotência", "cada comando produz uma decisão durável única", "HTTP boundary, validation, JDBC transaction e request key coordenam estado", "timeout depois do commit criou reserva duplicada"],
    ["Concorrência, filas e backpressure", "virtual thread não remove limites de banco e provedor", "bounded admission, leases, fencing e retry preservam recursos", "executor ilimitado derrubou o pool"],
    ["Banca, profiling e recovery", "cada requisito precisa de teste, métrica, mutante e rollback", "javac/java, JUnit, JFR, restore drill e release manifest fecham o gate", "serviço passou testes felizes mas vazou recurso e não restaurava"],
  ]],
];
