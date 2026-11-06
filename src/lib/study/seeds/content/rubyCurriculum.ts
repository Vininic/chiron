export type RubyLevel = "basico" | "intermediario" | "avancado";
export type RubyLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type RubyChapter = readonly [title: string, level: RubyLevel, primer: string, lessons: readonly RubyLesson[]];

/** Baseline editorial planejado: Ruby 3.3+; versão/toolchain reais serão fixados no gate de execução. */
export const RUBY_CURRICULUM: readonly RubyChapter[] = [
  ["Objetos, valores e fluxo", "basico", "Ruby é dinâmico, mas contratos de valor, verdade e erro continuam explícitos.", [
    ["Versão, execução e warnings", "resultado depende do interpreter, gems e flags realmente usados", "ruby version, frozen strings, warnings e Bundler", "script foi validado em runtime diferente do deploy"],
    ["Números, símbolos e strings", "representação precisa preservar unidade, encoding e mutabilidade", "Integer, BigDecimal, Symbol, String e freeze", "Float perdeu centavos e chave mutável sumiu do Hash"],
    ["Nil, truthiness e navegação", "ausência não pode virar sucesso por truthiness ou safe navigation", "nil, false, &., fetch e outcomes", "timeout virou nil e retry duplicou efeito"],
    ["Controle, pattern matching e estados", "estado futuro deve falhar fechado e payload combinar com variante", "case, guards, pattern matching e deconstruction", "else confirmou status desconhecido"],
  ]],
  ["Métodos, objetos e contratos", "basico", "Mensagens e visibilidade sustentam invariantes sem esconder efeitos.", [
    ["Métodos, argumentos e keywords", "assinatura deve distinguir opções, defaults e dados obrigatórios", "keyword arguments, forwarding e validation", "default inseguro autorizou tenant ausente"],
    ["Classes, initialize e invariantes", "objeto publicado nasce válido ou não nasce", "initialize, readers, private writers e factories", "instance parcialmente válida escapou após erro"],
    ["Herança, modules e composição", "reuso não deve quebrar substituição nem espalhar estado global", "include, prepend, delegation e composition", "mixin alterou ordem de callback silenciosamente"],
    ["Igualdade, hash e identidade", "eql?, hash e chaves tenant-scoped precisam concordar", "==, eql?, hash, immutable keys e IDs", "cache cruzou tenants por chave incompleta"],
  ]],
  ["Coleções, enumeração e texto", "basico", "Coleções expressivas ainda possuem custo, mutação e lifetime lógico.", [
    ["Array, Hash e Set", "mutação durante iteração e defaults compartilhados corrompem estado", "fetch, default proc, dup/freeze e Set", "Hash default reutilizou o mesmo Array entre tenants"],
    ["Enumerable e lazy", "pipeline lazy não remove custo nem prolonga recursos", "each, map, filter_map, Enumerator::Lazy", "enumerator reteve conexão após transaction"],
    ["Encoding, Unicode e regex", "String é sequência codificada e regex hostil pode exaurir CPU", "Encoding, normalization, anchors e timeout", "regex catastrófica derrubou worker"],
    ["Serialização e schemas", "Marshal/object layout não é protocolo confiável entre versões", "JSON, canonicalization, version e limits", "desserialização insegura executou classe inesperada"],
  ]],
  ["Erros e metaprogramação", "intermediario", "Exceções e dinamismo precisam fronteiras menores que a linguagem permite.", [
    ["Exceptions, ensure e retry", "cleanup e retry precisam etapa, budget e identidade estável", "begin/rescue/ensure, custom errors e backoff", "retry refez POST com key nova"],
    ["Resultados explícitos e nil", "erro, ausência e pendência não são nil intercambiável", "result objects, dry-style outcomes e case", "rescue nil apagou falha de commit"],
    ["Blocks, Proc e closures", "closure retida precisa ownership lógico e contexto correto", "yield, block_given?, lambda arity e binding", "job capturou request mutável reutilizado"],
    ["Metaprogramação com limites", "define_method e method_missing não devem ocultar API e autorização", "reflection, public_send, respond_to_missing?", "send executou método administrativo vindo do input"],
  ]],
  ["Concorrência e trabalho assíncrono", "intermediario", "GVL não substitui sincronização de invariantes nem coordenação distribuída.", [
    ["Threads, Mutex e ConditionVariable", "check-and-act e waits seguem uma disciplina", "Thread, Mutex#synchronize, predicates e shutdown", "duas threads confirmaram a última vaga"],
    ["Queue, pools e backpressure", "fila precisa limite, quota e lifecycle", "SizedQueue, worker pool, admission e drain", "Queue ilimitada esgotou memória"],
    ["Fibers, scheduler e async I/O", "suspensão preserva contexto, deadline e recursos", "Fiber, scheduler, nonblocking adapters", "fiber segurou transaction durante HTTP"],
    ["Ractors e isolamento", "shareability não cria transação ou protocolo", "Ractor, immutable messages e boundaries", "cópia de estado divergiu do banco"],
  ]],
  ["Arquivos, rede e dependências", "intermediario", "I/O parcial e dependências mutáveis tornam efeitos ambíguos.", [
    ["Filesystem e escrita recuperável", "rename não prova durability e path precisa contenção", "Tempfile, fsync, rename e manifests", "config ficou truncada após crash"],
    ["HTTP, TLS e idempotência", "timeout não prova ausência de efeito", "client adapter, certificate verify, stable keys", "retry duplicou cobrança"],
    ["Gems, Bundler e supply chain", "versão resolvida e artefato carregado precisam provenance", "Gemfile.lock, groups, checksums e audit", "deploy puxou gem diferente"],
    ["CLI, ENV e signals", "entrada/config/signal não podem interromper invariantes", "OptionParser, validated ENV, traps e graceful stop", "trap executou cleanup não seguro"],
  ]],
  ["Testes e desempenho", "intermediario", "Ferramentas testam fronteiras limitadas; oráculos observam efeitos.", [
    ["Minitest, RSpec e oráculos", "teste verifica estado e efeito, não só não lançar", "fixtures, doubles, shared contracts", "mock sucesso ocultou outbox ausente"],
    ["Property, mutation e fuzz", "casos gerados e mutantes auditam o oráculo", "generators, seeds, mutants e corpus", "gerador nunca produziu overflow"],
    ["Profiling e alocação", "otimização parte de perfil e preserva contrato", "stackprof, memory profiling, benchmarks", "zero-copy reteve buffer alheio"],
    ["Portabilidade e implementação", "MRI, JRuby e TruffleRuby têm capacidades diferentes", "engine matrix, native gems e feature gates", "native extension quebrou em outra ABI"],
  ]],
  ["Persistência e domínio", "avancado", "Regras de domínio precisam constraints e transações reais.", [
    ["Value objects e aggregates", "tipos/objetos ricos impedem estados e unidades inválidas", "factories, immutability e domain events", "tenantId foi usado como reservationId"],
    ["SQL parametrizado e transactions", "bind, cardinalidade e rollback são observáveis", "driver/ORM adapter, prepared statements e row count", "concatenação permitiu injection"],
    ["Isolation e última vaga", "mutex Ruby não coordena processos", "conditional update, unique constraints e two sessions", "duas réplicas venderam uma vaga"],
    ["Outbox, jobs e replay", "commit local e efeito remoto convergem por identidade estável", "transactional outbox, claim, fencing e dedupe", "ack antecipado perdeu evento"],
  ]],
  ["Serviços e observabilidade", "avancado", "Arquitetura torna políticas e falhas inspecionáveis.", [
    ["Ports, adapters e injeção", "test double não substitui adapter real", "constructor injection, contracts e composition root", "fake verde foi anunciado como banco testado"],
    ["Logs, métricas e traces", "correlação não pode vazar segredo nem explodir cardinalidade", "structured events, bounded labels e context", "token apareceu no log"],
    ["Config, secrets e privilege", "produção falha fechada com configuração inválida", "typed config, redaction, rotation e least privilege", "fallback desativou TLS"],
    ["Health, overload e degradation", "readiness reflete capacidade durável", "bounded queues, quotas, circuit e runbook", "health constante aceitou carga sem banco"],
  ]],
  ["Deploy e evolução", "avancado", "Artefatos e schemas coexistem durante mudanças e falhas.", [
    ["Packaging e containers", "bundle e runtime carregados correspondem ao gate", "bundle deployment, images, manifests e SBOM", "imagem omitiu native library"],
    ["Migrations e rolling deploy", "old/new convivem por expand-migrate-contract", "schema versions, backfill e flags", "coluna foi removida com worker antigo"],
    ["Shutdown, crash e recovery", "graceful não substitui kill/restart", "drain, leases, signals e fault points", "job volátil sumiu no deploy"],
    ["Backup, restore e incidentes", "backup só é aprovado após restauração e reconciliação", "restore drill, RPO/RTO e same IDs", "restore refez efeitos com keys novas"],
  ]],
  ["Segurança de aplicações Ruby", "avancado", "Dinamismo amplia a necessidade de allowlists e limites.", [
    ["Injection e deserialização", "eval/send/YAML/Marshal hostis não recebem input", "safe_load, allowlists, binding e parameters", "YAML instanciou objeto perigoso"],
    ["Autorização multi-tenant", "escopo deriva da identidade em toda query/cache/job", "policy, tenant filters e negative tests", "job buscou registro sem tenant"],
    ["DoS, regex e limites", "tempo, memória e recursão são recursos autorizados", "timeouts, size/depth, regexp timeout e quotas", "regex/payload monopolizou processo"],
    ["Auditoria e resposta", "ações privilegiadas e incidentes mantêm evidência redigida", "audit events, break-glass, rotation e postmortem", "operador apagou pending para silenciar alerta"],
  ]],
  ["Projeto Quíron em Ruby", "avancado", "A banca integra linguagem, banco, rede, operação e recuperação.", [
    ["API e domínio Ruby", "interface impede estado inválido e tenant spoofing", "Rack-style boundary, value objects e outcomes", "body escolheu tenant alheio"],
    ["Última vaga e replay", "constraint, fingerprint e outbox formam unidade", "two-session gate, stable eventId e reconciliation", "replay divergente virou sucesso"],
    ["Segurança, testes e carga", "input hostil e overload preservam tenant e efeitos", "fuzz, mutation, concurrency e load readback", "fila cresceu até OOM"],
    ["Banca, deploy e restore", "publicação exige runtime, gems, DB, TLS, crash e restore", "evidence matrix, staging e fault injection", "densidade foi confundida com execução"],
  ]],
];
