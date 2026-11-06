import type { ContentCard, ContentExercise } from "./types";

const card = (nodeTitle: string, frontMd: string, backMd: string): ContentCard => ({ nodeTitle, frontMd, backMd });

const runtime = "Runtime, processo e ciclo de vida";
const modules = "Módulos, pacotes e resolução";
const files = "Arquivos, paths e configuração";
const http = "HTTP, roteamento e contratos";
const loop = "Assincronia e event loop";
const streams = "Streams e backpressure";
const events = "Eventos, filas e trabalho em background";
const persistence = "Persistência e transações";
const security = "Autenticação, segurança e entradas hostis";
const workers = "Workers, processos e concorrência";
const observability = "Observabilidade, performance e memória";
const testing = "Testes, entrega e operação";
const project = "Projeto integrador: serviço de reservas";

const exerciseEvidence: Record<string, string> = {
  [runtime]: "Entregue uma execução reproduzível e relacione cada observação ao lifecycle do processo.",
  [modules]: "Execute o artefato sem bundler e registre qual loader resolveu cada entrypoint publicado.",
  [files]: "Use diretório temporário isolado, injete falhas reais e demonstre cleanup idempotente ao final.",
  [http]: "Exercite sockets reais em porta aleatória e documente status, headers, aborto e recursos fechados.",
  [loop]: "Repita o experimento sob concorrência controlada e compare ordem, latência de cauda e progresso.",
  [streams]: "Varie os limites de chunk e consumidor, medindo pressão, memória e encerramento em erro.",
  [events]: "Inclua lifecycle completo, falha de observador e uma asserção que detecte efeito duplicado.",
  [persistence]: "Rode contra storage real com duas conexões sincronizadas e preserve evidência após cada conflito.",
  [security]: "Inclua casos adversos codificados de formas diferentes e prove que nenhum sink recebe autoridade indevida.",
  [workers]: "Meça fila e recursos do supervisor, provoque morte abrupta e confirme ausência de trabalho órfão.",
  [observability]: "Apresente métricas antes e depois, correlacione um caso lento e mantenha segredos fora dos artefatos.",
  [testing]: "Execute isolado e em paralelo, capture a falha esperada e prove que nenhum handle permanece aberto.",
  [project]: "Demonstre invariantes no estado persistido, correlação nos eventos e recuperação após reinício do processo.",
};

const ex = (nodeTitle: string, type: 1 | 2 | 3, level: ContentExercise["level"], points: number, promptMd: string, answerKeyMd: string, choices?: string[]): ContentExercise => ({
  nodeTitle,
  type,
  level,
  points,
  promptMd: `${promptMd} ${exerciseEvidence[nodeTitle]}`,
  answerKeyMd,
  choices,
});

export const NODEJS_EXERCISES: ContentExercise[] = [
  ex(runtime, 1, "beginner", 10, "Classifique V8, process, Buffer, filesystem e sockets entre linguagem, host e sistema operacional. Explique onde três operações distintas executam e qual evento comprova conclusão sem usar a frase genérica ‘Node é assíncrono’.", "Espera-se separar ECMAScript/V8, APIs Node, libuv/kernel e identificar thread JavaScript, pool ou mecanismo do SO, além do callback/Promise/evento de conclusão.", ["Separar motor, host e SO", "Chamar tudo de V8", "Assumir uma thread por Promise", "Tratar agendamento como conclusão"]),
  ex(runtime, 2, "intermediate", 20, "Implemente parser puro para env e argv com porta, URL de banco, boolean explícito e limites. Inicie processo filho com configurações válidas e inválidas, verificando stderr, segredo redigido e código de saída.", "A solução lê uma vez, distingue ausência/vazio, valida faixa/protocolo, devolve objeto imutável e falha antes de abrir recursos sem imprimir credenciais."),
  ex(runtime, 3, "advanced", 30, "Projete shutdown idempotente para HTTP, worker, banco e telemetry. Envie SIGTERM durante operação lenta, retire readiness, aplique deadline inferior ao grace externo e explique como consistência sobrevive a SIGKILL.", "Deve parar admissão, drenar em ordem, fechar dependências inversamente, limpar timers, definir exitCode e depender de transação/idempotência para morte abrupta."),

  ex(modules, 1, "beginner", 10, "Explique a diferença entre import.meta.url e process.cwd() usando um asset do pacote e um arquivo indicado pelo usuário. Mostre por que extensão e campo type importam ao executar o dist sem bundler.", "Asset parte da URL do módulo; entrada relativa pode partir do cwd por contrato. O loader nativo interpreta formato/extensão do artefato, não as conveniências do editor."),
  ex(modules, 2, "intermediate", 20, "Crie adapter para dependência CommonJS consumida por ESM e teste a forma real do namespace. Demonstre o risco de pacote dual carregar dois singletons e proponha uma implementação compartilhada ou fachada estável.", "Espera-se conter default/named interop, validar capacidade, testar import e require e evitar estado global duplicado entre condições."),
  ex(modules, 3, "advanced", 30, "Empacote biblioteca com exports raiz e subpath testing, declarations e assets. Instale o tarball em consumer isolado ESM, bloqueie deep import e identifique dependências fantasmas escondidas pelo hoisting do monorepo.", "O tarball deve conter somente arquivos prometidos, resolver implementation/types, declarar runtime deps e funcionar fora de paths/workspace."),

  ex(files, 1, "beginner", 10, "Implemente resolução de arquivo dentro de raiz autorizada e teste espaço, Unicode, traversal e caminho absoluto. Diferencie contenção lexical de risco por symlink e diga quando o nome original do upload pode ser preservado.", "Deve resolver/relative/isAbsolute, rejeitar escape e gerar nome de storage; symlink pede diretório confiável, realpath/flags/handles conforme ameaça."),
  ex(files, 2, "intermediate", 20, "Compare readFile síncrono, promise e stream para configuração pequena e arquivo grande sob servidor concorrente. Meça atraso de timer, memória e descritores e escolha uma API com limite explícito.", "Espera-se sync apenas em bootstrap/CLI, promise para pequeno, stream/backpressure para grande, classificação por error.code e cleanup de handles."),
  ex(files, 3, "advanced", 30, "Construa escrita de JSON por temporário exclusivo e rename no mesmo diretório. Injete falha entre etapas, execute dois writers e documente a diferença entre visibilidade atômica, isolamento e durabilidade com fsync.", "Leitor vê versão antiga/nova íntegra; cleanup é explícito. Concorrência ainda requer versão/lock e durabilidade requer sync de arquivo/diretório conforme plataforma."),

  ex(http, 1, "beginner", 10, "Implemente rota health que distingue 404 e 405, analisa req.url com base interna e valida query page. Cubra trailing slash, método errado, query repetida e encoding inválido.", "A solução separa pathname/method/query, usa Allow para 405, não confia em host público nem decodifica duas vezes."),
  ex(http, 2, "intermediate", 20, "Leia corpo HTTP em chunks impondo limite antes de Buffer.concat, valide media type e transforme JSON unknown em comando allowlisted. Teste content-length falso, chunked, aborto e payload acima do teto.", "Deve contar bytes reais, parar cedo, tratar close/error, distinguir sintaxe/schema e nunca logar body bruto."),
  ex(http, 3, "advanced", 30, "Configure headers, request e keep-alive timeouts alinhados ao proxy e propague deadline por AbortSignal. Simule resposta perdida após mutação e desenhe idempotência, depois execute SIGTERM com requests em voo.", "Timeout local não é rollback; espera-se chave estável/reconciliação, cancelamento real, readiness/drain e fechamento dentro do grace."),

  ex(loop, 1, "beginner", 10, "Registre sync, queueMicrotask, process.nextTick, timer, immediate e I/O e explique quais ordens são garantidas e quais são corrida. Mostre starvation recursiva e uma forma deliberada de ceder ao loop.", "Deve reconhecer execução síncrona/microtasks/nextTick e evitar depender de timer versus I/O; setImmediate em lotes melhora fairness."),
  ex(loop, 2, "intermediate", 20, "Implemente mapLimit que preserva ordem, limita concorrência e propaga erro. Compare com forEach async e Promise.all sobre coleção grande, medindo in-flight, fila e comportamento quando uma tarefa falha.", "Espera-se pool fixo, ownership de Promises e política clara para abortar/continuar; nenhuma tarefa pode ficar órfã."),
  ex(loop, 3, "advanced", 30, "Diagnostique p99 alto com CPU moderada: meça event-loop delay, pool wait e trabalho CPU. Compare algoritmo melhor, yield em lotes e Worker pool, incluindo queue wait, RSS e cancelamento.", "A correção parte de evidência; yield só dá fairness, worker isola CPU e ambos precisam limites. Deve preservar testes de comportamento."),

  ex(streams, 1, "beginner", 10, "Escreva parser de linhas que funcione quando caracteres e delimitadores atravessam chunks. Explique end, finish, close e por que um chunk não representa registro nem confirmação durável.", "Deve manter buffer parcial/decoder, limitar linha e associar cada evento ao lado readable/writable sem confundir finish com persistência externa."),
  ex(streams, 2, "intermediate", 20, "Crie Writable lenta e compare produtor que respeita write false/drain com produtor que ignora. Meça writableLength e memória em cem pipelines e justifique highWaterMark escolhido.", "A versão correta pausa no drain ou usa pipeline; highWaterMark é limiar multiplicado pela concorrência, não limite absoluto."),
  ex(streams, 3, "advanced", 30, "Monte pipeline source→validação→hash→arquivo temporário com AbortSignal. Injete erro em cada etapa e consumidor lento, garantindo destruição, cleanup e publicação por rename somente após sucesso.", "Espera-se pipeline promise, propagação causal, backpressure, temporário removido em falha e destino final apenas depois de conclusão íntegra."),

  ex(events, 1, "beginner", 10, "Demonstre que EventEmitter chama listeners sincronamente, incluindo ordem, throw e listener async. Decida quando um fato interno cabe no emitter e quando um comando precisa função com resultado.", "Emit é síncrono; Promise retornada não é aguardada. Comando requer contrato de resposta, e integração durável não pode depender do emitter em memória."),
  ex(events, 2, "intermediate", 20, "Implemente inscrição que retorna unsubscribe idempotente e teste cem ciclos start/close sem aumentar listenerCount. Inclua erro durante cleanup e evite capturar request/body inteiro na closure.", "A mesma identidade é removida, cada owner limpa apenas seus listeners e falhas de cleanup não impedem os demais."),
  ex(events, 3, "advanced", 30, "Projete consumer at-least-once com envelope versionado, inbox transacional, retry classificado e dead-letter operável. Mate após efeito e antes do ack e prove que redelivery não duplica resultado.", "Efeito e message id são atômicos, ack vem depois, poison não repete infinito e redrive preserva identidade/observabilidade."),

  ex(persistence, 1, "beginner", 10, "Calcule pool por réplica para um banco com limite e reserva operacional. Depois sature pool pequeno e meça acquisition wait separado da query, garantindo liberação em finally sob sucesso e erro.", "Deve considerar total de pods/workers, teto de fila/timeout, cliente adquirido tarde e liberado sempre."),
  ex(persistence, 2, "intermediate", 20, "Implemente UnitOfWork para debitar estoque, registrar command idempotente e anexar outbox numa conexão. Explique por que transação não pertence a cada repository nem deve aguardar API externa.", "Boundary acompanha invariant do caso de uso; repositories compartilham tx, rede fica fora e outbox participa do commit."),
  ex(persistence, 3, "advanced", 30, "Force duas transações a ler a mesma versão e disputar update. Compare optimistic version, lock e serializable, trate deadlock/retry integral e escreva migration expand-contract compatível com rollback.", "Um writer vence e outro recebe conflito/retry limitado; primitive vive no banco, constraints reforçam e versões velha/nova coexistem."),

  ex(security, 1, "beginner", 10, "Modele autenticação e autorização para pedido multi-tenant. Teste token válido de outro tenant, owner, suporte e role do body, explicando por que identidade autenticada não concede acesso ao id escolhido.", "Actor/tenant vêm da credencial confiável; policy usa actor+ação+recurso e ignora autoridade enviada no body."),
  ex(security, 2, "intermediate", 20, "Audite rota que monta SQL, path, URL e comando shell com entrada. Substitua por parâmetros, contenção, allowlist SSRF e spawn sem shell, cobrindo redirects e argumentos iniciados por hífen.", "Cada sink usa grammar segura própria, com limites/autorização; não existe sanitize genérico."),
  ex(security, 3, "advanced", 30, "Projete lifecycle de senha, token e chave de criptografia: KDF, random, envelope versionado, rotação/revogação e logs allowlisted. Injete canário secreto em body, cause e report e prove ausência nos sinks.", "Espera-se primitive mantida, salt/nonce corretos, duas chaves na janela, controle de dumps e redaction por construção."),

  ex(workers, 1, "beginner", 10, "Compare cálculo no loop, yield e Worker para tamanhos crescentes. Explique startup, clone, isolate e por que Worker não acelera I/O nem fornece sandbox para código hostil.", "Worker isola CPU em outro isolate, com overhead/fila/memória; yield apenas cede e segurança exige processo/container restrito."),
  ex(workers, 2, "intermediate", 20, "Transfira ArrayBuffer e demonstre detach, depois implemente contador SharedArrayBuffer com Atomics. Documente ownership, range exato de Buffer, protocolo e shutdown de worker esperando.", "Transfer muda owner sem copiar; shared requer Atomics/estados. Não transferir slab vizinho nem busy-wait no loop."),
  ex(workers, 3, "advanced", 30, "Construa supervisor de child_process com executable conhecido, env mínimo, stdout/stderr drenados, limite, timeout e término da árvore conforme plataforma. Teste argumento com shell metacharacters e filho que excede saída.", "Deve usar spawn shell false/args, aguardar close, limitar pipes, grace/kill e tratar output como unknown."),

  ex(observability, 1, "beginner", 10, "Crie log estruturado correlacionado por AsyncLocalStorage para duas requisições concorrentes. Inclua error cause e canário de segredo, registrando apenas uma vez na boundary sem misturar ids.", "Campos estáveis/allowlisted, contexto isolado, causa preservada e nenhum body/token; sink possui limite/flush."),
  ex(observability, 2, "intermediate", 20, "Instrumente request total, pool wait, query e outbox age com counter, gauge e histogram. Injete um por cento lento e compare média, p95 e p99 sem usar ids ou URL bruta como labels.", "Espera-se route template/status/result finitos, duration monotônica e cauda capaz de revelar fila ocultada pela média."),
  ex(observability, 3, "advanced", 30, "Reproduza crescimento de RSS com heap estável e investigue Buffer, cache e listeners usando métricas e snapshots comparáveis. Corrija ownership/limites e valide sem apenas aumentar heap ou forçar GC.", "Deve separar heap/external/rss, encontrar caminho de retenção, limitar cache/remover listener e repetir workload equivalente."),

  ex(testing, 1, "beginner", 10, "Escreva testes node:test paralelizáveis para config e filesystem usando clock/ids injetados, porta zero e diretório temporário. Rode em ordem variável e prove cleanup sem recorrer a forceExit.", "Cada caso possui recurso e teardown; não muta cwd/env global; assertions async são aguardadas e handles fecham."),
  ex(testing, 2, "intermediate", 20, "Teste servidor HTTP pela rede local com body chunked, aborto e status. Crie repository contract compartilhado entre fake e banco e explique quais garantias de isolamento o fake não pode provar.", "Listener real cobre protocolo; contract preserva porta; banco real cobre constraints/transação/concorrência e todos fecham no teardown."),
  ex(testing, 3, "advanced", 30, "Desenhe rollout canário expand-contract em containers: readiness/drain, schema antigo/novo, feature flag com owner e rollback após dados novos. Execute imagem nonroot/read-only e valide TERM durante request.", "A sequência preserva coexistência, SLI decide canary, flag expira e artifact anterior consegue ler forma escrita; container respeita lifecycle."),

  ex(project, 1, "beginner", 10, "Implemente parser e domínio da reserva com SKU, quantidade e resultados discriminados. Cubra payloads adversos, tenant confiável e tabela de estoque, explicando por que Node single-thread ainda permite corrida entre awaits.", "Parser parte de unknown; actor/tenant não vêm do body; regra pura não substitui update atômico entre transações/réplicas."),
  ex(project, 2, "intermediate", 20, "Implemente reserva com update condicional, command key+hash e outbox no mesmo commit. Simule resposta perdida, key repetida com payload igual/diferente e crash após publish antes de mark.", "Uma key igual devolve resposta original, hash diferente conflita, estoque não fica negativo e redelivery é deduplicado."),
  ex(project, 3, "advanced", 30, "Entregue o cenário completo no Lab Ágora com duas reservas, banco/broker lentos, fila limitada, telemetry e SIGTERM. Injete falhas em cada etapa e demonstre recuperação mantendo invariants e SLOs declarados.", "A entrega deve provar um vencedor, retry sem duplicação, outbox/inbox, rejeição antes de overload, correlação segura e drain dentro do grace."),
];

export const NODEJS_CARDS: ContentCard[] = [
  card(runtime, "O que V8 não fornece sozinho?", "APIs do host, bindings/libuv e recursos do sistema como fs, sockets, processo e sinais."),
  card(runtime, "Por que ler process.env uma vez?", "Para validar uma fotografia coerente e entregar configuração imutável, sem políticas divergentes por módulo."),
  card(runtime, "process.exitCode versus process.exit()?", "exitCode deixa o loop drenar; exit interrompe e pode truncar saída e cleanup."),
  card(runtime, "O que fazer com uncaughtException?", "Registrar com segurança, iniciar shutdown limitado e não continuar atendendo em estado desconhecido."),
  card(modules, "Asset do pacote parte de onde?", "De import.meta.url; cwd pertence ao invocador e pode mudar."),
  card(modules, "Qual risco do pacote dual?", "Import e require podem carregar duas instâncias de estado/classes."),
  card(modules, "O que exports protege?", "A fachada pública e a liberdade de reorganizar internals sem deep imports."),
  card(modules, "Por que evitar efeito no topo?", "Import passa a abrir recurso sem owner e torna ordem, testes e shutdown implícitos."),
  card(files, "Como conter path numa raiz?", "Resolva ambos, use relative e rejeite absoluto ou segmentos que escapem; considere symlinks."),
  card(files, "Quando fs síncrono é aceitável?", "Bootstrap/CLI curta antes de concorrência, não no caminho de request."),
  card(files, "Rename atômico garante durabilidade?", "Não; visibilidade atômica, isolamento entre writers e fsync são garantias distintas."),
  card(files, "Que semântica atribuir a fs.watch?", "Sinal de possível mudança que dispara reconciliação, não log fiel de operações."),
  card(http, "Por que request é stream?", "Corpo chega em chunks, pode exceder limite ou abortar; precisa ownership e pressão."),
  card(http, "404 versus 405?", "404 não conhece rota; 405 conhece rota, mas método é proibido e deve informar Allow."),
  card(http, "Quando limitar body?", "Durante leitura e decompression, antes de concatenar/alocar tudo."),
  card(http, "Timeout equivale a rollback?", "Não; efeito remoto pode ter confirmado e exige idempotência/reconciliação."),
  card(loop, "O risco de nextTick recursivo?", "Starvation: I/O e timers não recebem turno."),
  card(loop, "Promise.all cancela perdedores?", "Não; operações continuam salvo cancelamento cooperativo."),
  card(loop, "Relógio para duração?", "Monotônico, como performance.now; Date é calendário e pode saltar."),
  card(loop, "Yield versus Worker?", "Yield melhora fairness no mesmo core; Worker isola CPU em outro isolate."),
  card(streams, "Chunk é registro?", "Não; framing do protocolo pode atravessar ou reunir chunks."),
  card(streams, "O que write false significa?", "O produtor deve aguardar drain; não é falha nem convite para continuar."),
  card(streams, "Por que pipeline?", "Possui a cadeia, propaga erro e destrói componentes coordenadamente."),
  card(streams, "O que adapter Web/Node não resolve?", "Framing, schema, limites, cancelamento semântico e garantia de entrega."),
  card(events, "EventEmitter é assíncrono?", "Não; emit chama listeners sincronamente e ignora Promises retornadas."),
  card(events, "Como evitar leak de listener?", "Owner simétrico: start registra função estável e close/off remove."),
  card(events, "Ack deve ocorrer quando?", "Depois do efeito confirmado; antes perde trabalho, depois admite redelivery idempotente."),
  card(events, "O que worker supervisor conhece?", "Capacidade, fila, tarefas em voo, retry, signal e drain."),
  card(persistence, "Pool cria capacidade?", "Não; limita/reutiliza conexões e mantém espera que precisa teto e métrica."),
  card(persistence, "Quem define transação?", "O caso de uso cuja invariante cruza operações, usando uma UnitOfWork."),
  card(persistence, "Como optimistic locking detecta conflito?", "Update inclui versão esperada e zero rows sinaliza concorrência."),
  card(persistence, "Por que mapear row explicitamente?", "Banco é fronteira com legado/nulls; driver types não validam dados existentes."),
  card(security, "Autenticação prova autorização?", "Não; policy combina actor, ação, recurso, tenant e estado."),
  card(security, "Existe sanitização universal?", "Não; SQL, shell, path, URL e HTML exigem primitives/contextos próprios."),
  card(security, "Senha deve usar qual classe de primitive?", "KDF adaptativa com salt, não hash rápido."),
  card(security, "O que limita SSRF melhor?", "Allowlist/egress control com validação de DNS/IP e cada redirect."),
  card(workers, "Worker é sandbox?", "Não; compartilha processo e privilégios e pode afetar via OOM/falha nativa."),
  card(workers, "O que transferList faz?", "Muda ownership de ArrayBuffer e o detach no remetente."),
  card(workers, "Por que drenar stderr?", "Pipe cheio pode bloquear o filho."),
  card(workers, "Estado em heap é compartilhado entre réplicas?", "Não; verdade global exige storage/protocolo distribuído."),
  card(observability, "Onde fica requestId?", "Logs/traces e contexto assíncrono, nunca label de métrica."),
  card(observability, "Por que p99 além da média?", "A média dilui a pequena parcela lenta que define experiência de cauda."),
  card(observability, "O que flame graph mostra?", "Onde CPU foi amostrada, não automaticamente a causa de negócio."),
  card(observability, "Heap estável elimina leak?", "Não; Buffer/external e recursos nativos podem elevar RSS."),
  card(testing, "Por que porta zero?", "Evita colisão e permite testes paralelos com ownership do listener."),
  card(testing, "O que contract fake+real previne?", "Que a simplificação do fake seja confundida com semântica do adapter real."),
  card(testing, "Readiness versus liveness?", "Readiness aceita tráfego; liveness indica se reinício é necessário."),
  card(testing, "Qual ordem do expand-contract?", "Expandir, leitores compatíveis, migrar/observar e só então contrair."),
  card(project, "Onde impedir estoque negativo?", "Numa operação/constraint atômica do storage compartilhado."),
  card(project, "O que vincula Idempotency-Key ao comando?", "Hash canônico e escopo; mesma key com payload diferente é conflito."),
  card(project, "Por que outbox?", "Estado e intenção de publicar entram no mesmo commit e sobrevivem ao crash."),
  card(project, "O que o Lab Ágora prova?", "Concorrência, replay, backpressure e shutdown mantendo invariants observáveis."),
];
