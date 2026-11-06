export type CLevel = "basico" | "intermediario" | "avancado";
export type CLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type CChapter = readonly [title: string, level: CLevel, primer: string, lessons: readonly CLesson[]];

/** Baseline portátil C17. C23 (ISO/IEC 9899:2024) é evolução declarada separadamente. */
export const C_CURRICULUM: readonly CChapter[] = [
  ["Toolchain, tradução e programa mínimo", "basico", "O primeiro contrato é saber que código, flags e biblioteca foram usados para produzir o binário.", [
    ["Padrão, compilador e flags", "C17 é baseline portátil; C23 não é sinônimo de suporte integral de qualquer compilador", "-std=c17, -Wall -Wextra -Wpedantic, build limpo e versão do toolchain", "exemplo C23 foi copiado para compilador C17 e release falhou após passar no editor"],
    ["Pré-processador, compilação e ligação", "macro, translation unit e linker operam em fases com erros diferentes", "-E, -c, object files, extern e símbolos", "função definida em header foi ligada duas vezes e causou multiple definition"],
    ["main, argumentos e códigos de saída", "processo comunica sucesso/falha por código e stderr, não só por texto", "argc/argv, EXIT_SUCCESS/FAILURE e validação de entrada", "job respondeu zero ao falhar e orquestrador marcou migração como concluída"],
    ["Tipos básicos e limites", "tamanho e signedness dependem de implementação; domínio precisa faixas explícitas", "limits.h, stdint.h, sizeof e conversões verificadas", "contador int transbordou e inventário ficou negativo"],
  ]],
  ["Controle, funções e contratos", "basico", "Fluxo local deve expor estados inválidos e preservar valores na borda.", [
    ["Expressões, precedência e efeitos", "ordem de avaliação não é licença para mutar o mesmo objeto duas vezes", "sequencing, operadores, short-circuit e -Wsequence-point", "expressão compacta teve comportamento indefinido e mudou com otimização"],
    ["if, switch e loops", "cada estado do protocolo precisa saída explícita e terminação garantida", "switch exhaustive por convenção, for/while e invariantes de loop", "novo status caiu em default de sucesso e confirmou cobrança desconhecida"],
    ["Funções, parâmetros e retorno", "assinatura não expressa ownership sozinha; documente tamanho e erro", "prototypes, const, size_t, status return e out parameters", "função retornou ponteiro para buffer local e resposta usou memória inválida"],
    ["Enums, typedef e representação", "enum pode receber valor fora da lista e typedef não valida domínio", "enum guards, typedef, tagged union e layout", "status 99 vindo da rede foi tratado como confirmado"],
  ]],
  ["Ponteiros, arrays e strings", "basico", "Ponteiro só é seguro com objeto vivo, comprimento e proveniência conhecidos.", [
    ["Ponteiros e lifetime", "endereço não transfere ownership nem prolonga vida do objeto", "stack, static storage, NULL e const pointers", "callback guardou endereço de variável local após retorno"],
    ["Arrays, decaimento e limites", "array em parâmetro decai para ponteiro e perde comprimento", "sizeof, size_t, bounds e slices explícitos", "memcpy recebeu tamanho do ponteiro e truncou payload"],
    ["Strings, NUL e UTF-8", "string C é sequência de bytes terminada por NUL, não texto Unicode validado", "strlen, memchr, encoding e tamanho de buffer", "nome de tenant com NUL embutido passou validação e alterou lookup"],
    ["const, aliasing e restrict", "aliasing e qualificadores influenciam otimização/contrato, não segurança automática", "const correctness, effective type e restrict preconditions", "duas views aliasadas violaram restrict e resultado mudou em -O2"],
  ]],
  ["Memória dinâmica e ownership", "intermediario", "Alocar é adquirir recurso e define quem pode liberar ou reter dados.", [
    ["malloc, calloc e free", "tamanho, overflow e falha de alocação devem ser tratados antes do uso", "SIZE_MAX checks, malloc/calloc/free e NULL", "multiplicação de count por sizeof transbordou e heap buffer ficou pequeno"],
    ["realloc e crescimento", "realloc pode mover bloco ou falhar sem liberar original; use temporário", "realloc transactional pattern, capacity doubling e overflow", "atribuir realloc direto perdeu ponteiro antigo em falha"],
    ["Ownership, borrow e cleanup", "cada recurso tem dono e caminho de cleanup mesmo com erro", "goto cleanup, invariants, borrowed versus owned e sanitizers", "função liberou buffer emprestado e caller fez double free"],
    ["Structs, layout e cópia", "cópia rasa duplica ponteiros, não dados; padding não é wire format", "struct, flexible array member, alignment e deep copy", "duas reservas compartilharam string heap e uma liberou a outra"],
  ]],
  ["I/O, arquivos e parsing", "intermediario", "Entrada e saída parcial são normais; bytes e efeitos precisam limite e retry correto.", [
    ["stdio e erros", "fread/fwrite podem processar menos bytes; feof difere de erro", "FILE*, ferror, errno e loops de leitura/escrita", "arquivo de backup foi truncado após fwrite parcial e job retornou sucesso"],
    ["Caminhos, atomicidade e temporários", "path do cliente não é destino seguro e rename tem limites de durabilidade", "mkstemp, fopen modes, rename, fsync e containment", "upload com ../ sobrescreveu configuração fora da raiz"],
    ["Parsing numérico e protocolos", "atoi não detecta erro; strto* precisa validar range e consumo total", "strtol, errno, endptr e framing de mensagens", "quantity '3x' foi aceita como 3 e request alterou estoque"],
    ["Serialização e formatos versionados", "layout de struct e endianness não são contrato de rede ou disco", "byte order, lengths, payloadVersion e checksum", "backup escrito com fwrite(struct) não abriu em outra arquitetura"],
  ]],
  ["Módulos, build e testes", "intermediario", "Interface C só é estável quando declaração, definição, ABI e testes concordam.", [
    ["Headers, guards e linkage", "header declara contrato e não deve produzir símbolos duplicados", "include guards, static/extern, translation units e visibility", "variável global definida no header quebrou link de dois módulos"],
    ["Make, dependências e reprodutibilidade", "build incremental depende de headers/flags e não só de .c", "Makefile, -MMD -MP, clean build e sanitizers", "mudança em header não recompilou objeto e binário misturou ABI"],
    ["Testes unitários e property testing", "casos de borda e mutantes validam contrato melhor que happy path", "assert harness, fixtures, fuzz seeds e oráculos", "teste só comparou return code e não detectou escrita fora do buffer"],
    ["Sanitizers e análise estática", "ASan/UBSan encontram classes de erro, mas ausência de alerta não prova segurança", "-fsanitize, warnings, static analyzer e reproducer", "build Release -O2 revelou UB que teste Debug não viu"],
  ]],
  ["Biblioteca padrão, números e algoritmos", "intermediario", "APIs padrão têm precondições de tipo, ordem, locale e erro que precisam ser testadas.", [
    ["qsort, bsearch e comparadores", "comparador deve impor ordem consistente sem subtração que transborda", "qsort, bsearch, comparator contract e stable-order requirements", "comparador return a-b transbordou e busca binária perdeu item"],
    ["Tempo, relógios e locale", "horário civil, duração monotônica e locale não são a mesma medida", "time.h, timespec, strftime e setlocale", "timeout usou relógio de parede e NTP prorrogou lease vencido"],
    ["Ponto flutuante e arredondamento", "float/double são aproximações e não devem definir centavos ou igualdade de dinheiro", "float.h, math.h, isfinite, rounding e escala inteira", "total em double divergiu do valor cobrado em centavos"],
    ["Aleatoriedade, sementes e chaves", "rand não é fonte criptográfica nem identificador de idempotência durável", "rand/srand limitations, OS CSPRNG adapter e stable event IDs", "reinício repetiu seed e gerou chaves de cobrança colidentes"],
  ]],
  ["Concorrência e modelo de memória", "avancado", "Threads compartilham memória, mas processos e máquinas exigem outro protocolo.", [
    ["Threads C11 e sincronização", "acesso concorrente não sincronizado ao mesmo objeto pode ser data race/UB", "thrd_t, mtx_t, cnd_t e join", "dois workers alteraram contador sem lock e perderam reserva"],
    ["Atomics e memory order", "atomicidade de contador não protege invariantes de múltiplos campos", "stdatomic.h, compare_exchange e acquire/release", "flag relaxed publicou ponteiro antes de objeto estar inicializado"],
    ["Filas bounded e backpressure", "fila em memória precisa capacidade, política de bloqueio e shutdown", "ring buffer, condition variables, cancellation e drain", "fila unbounded consumiu heap e perdeu eventos no restart"],
    ["Race testing e escopo distribuído", "barreira local testa interleaving, mas lock local não protege duas réplicas", "barrier, fault injection, DB unique/update conditional", "duas instâncias confirmaram última vaga apesar de mutex em cada processo"],
  ]],
  ["Rede, APIs e segurança", "avancado", "Bytes de rede são hostis, parciais e temporalmente ambíguos.", [
    ["Sockets e framing", "read/write parciais e EOF exigem framing e limites explícitos", "POSIX sockets, recv/send loops e length-prefix", "payload sem limite ocupou memória e bloqueou parser"],
    ["HTTP, TLS e idempotência", "timeout de POST não prova ausência de efeito remoto", "client timeout, stable key, TLS validation e reconciliation", "retry com key nova duplicou cobrança"],
    ["Validação, overflow e format strings", "input hostil pode alterar tamanho, formato e endereço usado pelo processo", "snprintf, checked arithmetic, path and format validation", "printf(user_input) expôs memória e corrompeu stack"],
    ["Segredos, logs e privilégio", "processo nativo não deve expor token em logs/core dump", "redaction, least privilege, core dump policy e secure config", "erro de conexão imprimiu Authorization e senha"],
  ]],
  ["Performance, observabilidade e portabilidade", "avancado", "Otimização só vale quando preserva invariantes em todos os alvos prometidos.", [
    ["Profiling, cache e alocação", "medição identifica gargalo; microbenchmark não representa p95 de serviço", "perf/profiler, allocation counters e cache locality", "troca para ponteiros evitou cópia mas introduziu use-after-free"],
    ["Undefined behavior e otimização", "UB permite ao compilador otimizar sob premissas que código violou", "strict aliasing, signed overflow, lifetime e -O2", "teste -O0 passou e Release produziu resultado diferente"],
    ["ABI, endianness e largura", "int/pointer/long e byte order variam por plataforma", "stdint.h, alignof, htonl, static_assert e serialization", "backup de struct escrito em x64 não abriu em ARM"],
    ["Métricas, tracing e diagnósticos", "telemetria deve ligar request, outbox e efeito sem PII/cardinalidade extrema", "structured logging, counters, trace IDs e failure injection", "HTTP 201 ficou verde enquanto worker atrasava horas"],
  ]],
  ["Persistência e integração nativa", "avancado", "C não transforma escrita local em transação distribuída.", [
    ["SQLite ou driver SQL em C", "statement parametrizado, transação e row count são boundary de correção", "sqlite3_prepare/bind/step, transaction e constraints", "SQL concatenado com tenant permitiu leitura cruzada"],
    ["Transações, constraints e outbox", "key/fingerprint/reserva/evento precisam comitar juntos", "unique index, conditional UPDATE e outbox claim", "falha após reserva deixou evento ausente e replay duplicou"],
    ["Bibliotecas C e FFI", "ABI e ownership devem ser explícitos entre linguagens", "opaque pointers, versioned structs, callback lifetime e dlopen", "callback usou ponteiro já liberado pelo caller"],
    ["Deploy, crash e recuperação", "fsync/backup/restore e lease determinam recuperação após kill", "WAL, backup, signal handling e restart drills", "backup preservou reserva mas perdeu request key/outbox"],
  ]],
  ["Projeto Quíron: núcleo C", "avancado", "A banca requer memória segura, última vaga correta, replay e recuperação após crash.", [
    ["API C de reserva e ownership", "interface expõe tamanho, lifetime, status e erro sem ponteiro pendurado", "opaque context, result enum e buffer contracts", "caller liberou reserva enquanto worker ainda usava ponteiro"],
    ["Capacidade, key e outbox", "unique key/fingerprint e conditional UPDATE protegem concorrência no banco", "transaction, durable outbox, stable eventId e fencing", "mutex local passou teste mas duas réplicas confirmaram última vaga"],
    ["Segurança, fuzz e carga", "parser hostil e corrida precisam oráculos de bytes/estado", "fuzz, sanitizers, bounded queue e tenant isolation", "input com comprimento extremo causou overflow e vazamento"],
    ["Banca, deploy e restore", "build/release e backup precisam reproduzir estado e efeito com mesmas keys", "C17 toolchain gate, staging DB, fault injection e restore drill", "backup não tinha idempotency key e replay cobrou duas vezes"],
  ]],
];
