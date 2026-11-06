import type { ContentCard, ContentExercise } from "./types";

const ex = (nodeTitle: string, type: 1 | 2 | 3, level: ContentExercise["level"], points: number, promptMd: string, answerKeyMd: string): ContentExercise => ({ nodeTitle, type, level, points, promptMd, answerKeyMd });
const card = (nodeTitle: string, frontMd: string, backMd: string): ContentCard => ({ nodeTitle, frontMd, backMd });

const rendering = "Renderização declarativa e identidade";
const state = "Props, estado e eventos";
const forms = "Listas, formulários e composição";
const effects = "Effects e sincronização externa";
const reducers = "Reducers e estado complexo";
const context = "Contexto e fronteiras de estado";
const hooks = "Hooks reutilizáveis e APIs de componentes";
const concurrency = "Concorrência, Suspense e carregamento";
const performance = "Performance de render e memória";
const accessibility = "Acessibilidade e design de interação";
const testing = "Testes e arquitetura de aplicações";
const project = "Projeto integrador: Serpe de Estado";

export const REACT_EXERCISES: ContentExercise[] = [
  ex(rendering, 1, "beginner", 10, "Explique, com uma árvore que alterna dois perfis na mesma posição, quando React preserva a instância e quando uma key força nova identidade. Inclua o destino do state local, refs e cleanup durante cada troca.", "A resposta relaciona tipo, posição e key à identidade; descreve preservação ou desmontagem, limpeza de effects/refs e usa key deliberadamente para reset por entidade."),
  ex(rendering, 2, "intermediate", 20, "Implemente uma lista editável identificada por id. Insira e reordene itens enquanto um campo mantém foco e rascunho; escreva um teste que falharia com key por índice e explique a reconciliação observada.", "A solução usa id estável, mantém draft na entidade correta e o teste edita, insere no início/reordena e confirma foco/valor sem depender da posição."),
  ex(rendering, 3, "advanced", 30, "Audite um componente que lê relógio, incrementa contador global e cria definição de filho dentro do render. Reescreva-o como cálculo puro e demonstre sob Strict Mode que não há desmontagem ou telemetria duplicada.", "Relógio entra como dado ou efeito apropriado, telemetria ocorre em boundary pós-commit, o componente filho tem identidade estável e o teste comprova setup/cleanup simétrico."),

  ex(state, 1, "beginner", 10, "Compare três chamadas `setCount(count + 1)` com três updaters funcionais no mesmo handler. Preveja o resultado, justifique usando snapshots e batching e identifique qual forma expressa dependência do valor anterior.", "O snapshot torna as três expressões diretas equivalentes; os updaters são aplicados em sequência e somam três. Batching não torna o state mutável dentro do handler."),
  ex(state, 2, "intermediate", 20, "Modele as props de um botão que pode ser link, ação comum ou ação destrutiva sem permitir combinações impossíveis. Implemente as variantes com semântica nativa, nomes acessíveis e callbacks que expressem intenção.", "Espera-se union discriminada, anchor com href para navegação, button para ação, confirmação/política fora de flags conflitantes e nenhuma div clicável."),
  ex(state, 3, "advanced", 30, "Construa uma busca em que o input controlado permaneça urgente e a lista cara possa ceder. Compare transition, deferred value e debounce, escolhendo onde cada técnica atua e testando uma sequência rápida de consultas.", "O valor do input atualiza imediatamente; render derivado pode usar transition/deferred, rede usa cache/debounce quando necessário e a intenção final vence respostas/renders anteriores."),

  ex(forms, 1, "beginner", 10, "Receba uma coleção por props, ordene-a sem mutação e mantenha seleção por identidade. Demonstre, removendo e reordenando itens, por que guardar o índice selecionado ou chamar `sort` diretamente quebra o contrato.", "A solução copia antes de ordenar, usa id como key e selectedId, deriva o item atual e trata remoção sem transferir seleção ou alterar a prop original."),
  ex(forms, 2, "intermediate", 20, "Implemente um formulário de cadastro com labels, validação no momento adequado, resumo de erros, associação por `aria-describedby`, estado de submissão e preservação dos valores após uma resposta inválida do servidor.", "A implementação diferencia erro de campo/formulário, mantém inputs, evita submissão duplicada, foca resumo ou primeiro inválido e usa servidor como autoridade final."),
  ex(forms, 3, "advanced", 30, "Projete uma primitive de diálogo composta com slots de título, conteúdo e ações. Especifique portal, foco inicial, contenção, Escape, restauração e controlled/uncontrolled sem depender de `cloneElement` ou ordem secreta de children.", "O contrato fixa semântica/foco, usa context guardado ou props explícitas, mantém modo de controle estável, compõe conteúdo e testa teclado, unmount e retorno do foco."),

  ex(effects, 1, "beginner", 10, "Classifique quatro casos — total derivado, compra após clique, título do documento e conexão de chat — entre render, handler e effect. Para cada um, explique a autoridade e quando cleanup é necessário.", "Derivação fica no render, compra no handler, document/conexão sincronizam externals em effects; conexão restaura/fecha e dependências refletem valores reativos."),
  ex(effects, 2, "intermediate", 20, "Implemente carregamento por `userId` que sobreviva a respostas fora de ordem, erro, aborto e desmontagem. Resolva duas Promises em ordem inversa e prove que o perfil antigo nunca substitui o atual.", "Usa AbortController ou attempt identity, reseta estado por id, ignora AbortError, valida dados e o teste controla ambas as respostas e unmount."),
  ex(effects, 3, "advanced", 30, "Integre uma store externa mutável com React concorrente usando snapshot e assinatura. Inclua snapshot de servidor, estabilidade referencial, troca durante render e cem ciclos de montagem para provar consistência e cleanup.", "A solução usa useSyncExternalStore, retorna snapshot cacheável, unsubscribe idempotente e getServerSnapshot coerente; testes detectam tearing, loop e listener retido."),

  ex(reducers, 1, "beginner", 10, "Transforme vários booleans de carregamento, sucesso e erro numa union de estados válidos. Escreva reducer total para iniciar, resolver, falhar e tentar novamente, explicando quais combinações impossíveis foram removidas.", "A union discrimina idle/loading/success/error, eventos carregam dados necessários, switch é exaustivo e nenhum estado contém simultaneamente sucesso e erro."),
  ex(reducers, 2, "intermediate", 20, "Modele um editor com draft, baseline, dirty e conflitos de versão. Implemente comandos que preservem invariantes e teste salvar, resetar, receber atualização remota e resolver conflito sem effects sincronizadores.", "Baseline/draft têm ownership explícito, dirty é derivado, versão participa do evento e conflitos são estados/resultados intencionais; testes percorrem transições puras."),
  ex(reducers, 3, "advanced", 30, "Crie histórico undo/redo para operações de domínio sem copiar recursos externos. Defina limite de memória, agrupamento de digitação, invalidação do futuro e propriedade que replay de operações preserva invariantes.", "Espera-se present/past/future ou comandos inversíveis, novo evento após undo remove future, limite é aplicado e property tests não serializam refs, Promises ou DOM."),

  ex(context, 1, "beginner", 10, "Implemente um contexto de tema com hook consumidor que falha cedo fora do provider. Explique por que default fictício esconderia configuração ausente e como manter escolha `system`, `light` e `dark` distinta.", "Context usa undefined como ausência, guard lança erro claro, provider possui autoridade e o modo system é resolvido sem apagar a preferência armazenada."),
  ex(context, 2, "intermediate", 20, "Divida um provider que mistura sessão, tema, notificações e comandos frequentes. Use perfil de renders para propor fronteiras por ownership/frequência e prove que atualizar notificação não redesenha consumidor de tema.", "A solução separa contexts ou usa store seletiva, estabiliza apenas valores relevantes e apresenta perfil/teste que mostra redução sem perder atualização correta."),
  ex(context, 3, "advanced", 30, "Projete injeção de capabilities para relógio, analytics e cliente de reservas com implementações de produção e teste. Delimite o que entra em context, como SSR recebe instâncias por request e como evitar singleton entre tenants.", "Interfaces são pequenas, provider compõe por árvore/request, domínio não importa React, testes injetam fakes e nenhuma instância mutável global atravessa usuários."),

  ex(hooks, 1, "beginner", 10, "Extraia um custom hook de status online usando uma fonte externa. Monte duas instâncias e explique por que compartilham a autoridade do navegador, mas não uma instância invisível de state do hook.", "O hook usa assinatura/snapshot apropriados, cada chamada participa do React separadamente, ambas refletem a fonte comum e todos os listeners são removidos."),
  ex(hooks, 2, "intermediate", 20, "Desenhe a API de um hook assíncrono com estados discriminados e comandos `retry` e `reset`. Documente identidade dos callbacks, cancelamento, resposta fora de ordem, SSR e o que múltiplas chamadas compartilham.", "O retorno é estreito, não expõe setter, modela lifecycle, possui deps honestas e política de cache/isolamento explícita com testes adversos."),
  ex(hooks, 3, "advanced", 30, "Implemente uma primitive headless de disclosure controlada e não controlada. Componha handlers, ids, refs e atributos ARIA sem sobrescrever props do consumidor e teste teclado, SSR e mudança indevida de modo.", "Modo permanece fixo, controlado emite intenção, uncontrolled possui state, ids hidratam, handlers/refs são compostos e a semântica não depende do estilo."),

  ex(concurrency, 1, "beginner", 10, "Explique por que render concorrente pode repetir ou abandonar trabalho sem exibir meia árvore. Identifique três mutações durante render que vazariam e mova cada uma para uma fronteira compatível com commit.", "A resposta separa render/commit, mantém cálculo puro e coloca subscription, telemetria e DOM em effects/handlers com cleanup; não pressupõe uma thread por render."),
  ex(concurrency, 2, "intermediate", 20, "Divida uma página de perfil e recomendações em boundaries de Suspense e erro. Justifique reveal, skeleton, preservação durante revalidação e retry, evitando waterfall e fallback que desmonta o shell.", "Boundaries seguem grupos perceptivos/recuperação, loaders iniciam recursos em paralelo, transição preserva conteúdo stale e Error Boundary invalida/reinicia recurso correto."),
  ex(concurrency, 3, "advanced", 30, "Audite uma rota com SSR, streaming e Client Components. Elimine mismatch por horário e viewport, reduza a boundary cliente, valide serialização e demonstre hidratação sob JavaScript e rede lentos.", "Primeiro render é determinístico, browser entra após commit, segredos ficam no servidor, props são serializáveis, islands são mínimas e E2E mede shell, segmento e interação."),

  ex(performance, 1, "beginner", 10, "Receba a afirmação ‘a lista renderiza demais’ e escreva um plano de medição que separe commit React, JavaScript, layout, rede e memória. Defina cenário, baseline e critério para aceitar ou reverter otimização.", "Usa build de produção/dados/dispositivo realistas, React Profiler e Performance/heap; hipótese e métrica precedem memo e a comparação controla o mesmo workload."),
  ex(performance, 2, "intermediate", 20, "Otimize uma lista cujo filho caro recebe objeto e callback novos. Redesenhe props, aplique `memo`, `useMemo` ou `useCallback` somente onde medido e teste que mudanças legítimas nunca usam closure antiga.", "Props tornam-se primitives/referências estáveis, deps são completas, updater pode reduzir captura e perfil comprova ganho maior que comparação/cache."),
  ex(performance, 3, "advanced", 30, "Projete uma tabela virtualizada com altura variável, paginação por cursor e navegação por teclado. Cubra medição, overscan, foco em item reciclado, inserção acima da viewport, impressão e alternativa acessível.", "Usa biblioteca/adapter, ids estáveis, ResizeObserver com cleanup, anchor/focus explícitos, requests deduplicadas e saída baseada no dataset para impressão/acessibilidade."),

  ex(accessibility, 1, "beginner", 10, "Audite um card clicável com ícone, link interno e heading visual. Reescreva usando elementos nativos, ordem DOM, nome acessível e foco visível; percorra a interação apenas por teclado.", "A ação e navegação não ficam aninhadas ambiguamente, button/link têm semântica nativa, heading segue hierarquia, ícone decorativo é oculto e foco é perceptível."),
  ex(accessibility, 2, "intermediate", 20, "Implemente submissão assíncrona com loading, erro de campo, resumo e sucesso. Defina quando usar status, alert e foco; teste leitor/teclado sem anunciar cada tecla ou apagar os valores.", "Regiões são estáveis e com prioridade adequada, campos associam mensagens, foco segue erro acionável, tentativas fora de ordem não anunciam estado antigo."),
  ex(accessibility, 3, "advanced", 30, "Entregue um dialog acessível que respeite reduced motion e temas. Teste foco inicial, contenção, Escape, disparador removido, scroll lock, saída animada, zoom e forced colors em browsers reais.", "A primitive madura coordena inert/portal/stack/cleanup, define fallback de foco, não depende de animação, usa tokens contrastantes e preserva função em todas as preferências."),

  ex(testing, 1, "beginner", 10, "Escreva um teste de formulário consultando por papel e nome, preenchendo como usuário e aguardando status final. Explique por que classes, state interno, sleep e snapshot da página enfraqueceriam a prova.", "O teste usa queries semânticas, user-event e espera observável; não conhece hooks/markup acidental e afirma loading, resultado ou recuperação relevante."),
  ex(testing, 2, "intermediate", 20, "Use MSW para testar sucesso, payload inválido, 503, aborto e duas respostas fora de ordem. Faça request não tratada falhar e mantenha parser/client reais, com handlers e cache isolados entre casos.", "Servidor reseta handlers, nenhuma rede escapa, unknown passa pelo parser, query client é novo e DOM confirma que a intenção atual vence e erro recupera."),
  ex(testing, 3, "advanced", 30, "Desenhe pipeline CI baseado em risco para uma feature de pagamento React. Inclua types, testes, acessibilidade, visual, E2E, budgets, preview, rollout, observabilidade e política concreta para flakes e exceções.", "Gates rápidos precedem caros, artefatos diagnosticam, dados/segredos são isolados, baseline visual é revisado, flake tem owner/prazo e canary/rollback fecham o ciclo."),

  ex(project, 1, "beginner", 10, "Implemente o reducer inicial da Serpe de Estado e liste invariantes de coordenadas, direção, movimento, alimento e fase. Execute uma sequência fixa e prove que o mesmo estado e eventos geram replay idêntico.", "Domínio é puro, arrays não são mutados, reversão/colisão/cauda têm regra definida, random entra como seed/valor e testes verificam unicidade e limites."),
  ex(project, 2, "intermediate", 20, "Conecte timer, teclado, botões touch e visibility ao reducer. Teste Strict Mode, pausa por razões concorrentes, mudança de velocidade, input focado, unmount e reduced motion sem usar esperas reais.", "Effects possuem setup/cleanup, dispatch não captura state antigo, clock fake avança deterministically, teclas reconhecidas só são interceptadas no contexto e pausa preserva ownership."),
  ex(project, 3, "advanced", 30, "Entregue o Lab Ophis completo com replay versionado, parser hostil, playback cancelável, grade acessível e perfil de produção. Ataque payload enorme, versão futura, storage cheio, troca de replay e score forjado.", "A entrega limita/valida unknown, recalcula score, cancela timers, preserva status/foco, passa invariantes/E2E/a11y/performance e referencia a camada `invariants` do laboratório."),
];

export const REACT_CARDS: ContentCard[] = [
  card(rendering, "O que define identidade de uma instância React?", "Tipo, posição entre irmãos e key; mudar essa correspondência pode preservar ou resetar state."),
  card(rendering, "Render e commit são a mesma fase?", "Não. Render calcula uma árvore e pode ser repetido/abandonado; commit torna mudanças, refs e effects observáveis."),
  card(rendering, "Por que key por índice é perigosa?", "Inserção/reordenação faz state e foco acompanharem a posição, não a entidade."),
  card(rendering, "O que Strict Mode revela?", "Impureza, setup sem cleanup e código que pressupõe uma única execução."),
  card(state, "Quando usar updater funcional?", "Quando o próximo state depende do anterior, inclusive várias atualizações no mesmo lote."),
  card(state, "Props devem expressar o quê?", "Conceitos e variantes válidas; callbacks expressam intenção na fronteira de ownership."),
  card(state, "Transition serve como debounce?", "Não. Ela altera prioridade de render; debounce controla frequência temporal."),
  card(state, "Por que setter não muda o snapshot atual?", "Ele agenda outro render; o handler continua fechado sobre os valores desta renderização."),
  card(forms, "Como guardar seleção de uma coleção?", "Guarde o id e derive a entidade atual; não guarde índice ou cópia sincronizada."),
  card(forms, "Controlled versus uncontrolled?", "Controlled usa value/onChange como autoridade React; uncontrolled mantém valor no DOM e expõe default/ref/FormData."),
  card(forms, "Erro de formulário deve preservar o quê?", "Valores, associação ao campo, contexto de foco e uma ação clara de correção/retry."),
  card(forms, "Quando composição supera flags?", "Quando a variação é estrutural e slots/children expressam conteúdo sem combinações booleanas impossíveis."),
  card(effects, "Qual é a função de um effect?", "Sincronizar a árvore commitada com um sistema externo e desfazer essa sincronização no cleanup."),
  card(effects, "Dependências são escolha de otimização?", "Não. Elas descrevem todos os valores reativos lidos pelo effect; omissão cria closure stale."),
  card(effects, "Abortar fetch desfaz mutation remota?", "Não; o servidor pode ter confirmado. Mutations precisam idempotência e reconciliação."),
  card(effects, "Por que useSyncExternalStore?", "Para snapshot e assinatura consistentes, inclusive sob concorrência e hidratação."),
  card(reducers, "O que um reducer deve garantir?", "Pureza, totalidade e preservação das invariantes para cada evento aceito."),
  card(reducers, "Como eliminar booleans contraditórios?", "Use union discriminada ou máquina de estados que represente somente combinações válidas."),
  card(reducers, "Novo evento após undo faz o quê?", "Invalida o futuro de redo, salvo modelo de branching explicitamente adotado."),
  card(reducers, "O que não pertence ao reducer?", "Timers, rede, random não injetado, DOM, storage e outras operações externas."),
  card(context, "Context substitui toda passagem de props?", "Não. Ele serve a uma autoridade/capability transversal; props mantêm dependências locais explícitas."),
  card(context, "Por que default undefined com guard?", "Para falhar cedo quando provider obrigatório está ausente, em vez de operar com valor fictício."),
  card(context, "Como reduzir renders de context?", "Separe por ownership/frequência, estabilize value quando medido ou use store seletiva."),
  card(context, "SSR pode usar singleton mutável por usuário?", "Não. Instâncias dependentes de sessão/tenant devem ter escopo por request/árvore."),
  card(hooks, "Custom hook compartilha state automaticamente?", "Não. Cada chamada possui instância; compartilhamento só ocorre via autoridade externa comum."),
  card(hooks, "Quando estabilidade referencial vira contrato?", "Quando documentada/observável por consumidores, e então precisa deps corretas e testes."),
  card(hooks, "Ref deve guardar valor exibido?", "Não; mudar ref não agenda render. State é a autoridade para markup."),
  card(hooks, "O que uma API headless precisa preservar?", "Semântica, teclado, ids, refs, eventos e ownership controlado/uncontrolled, além da liberdade visual."),
  card(concurrency, "Concorrência significa múltiplas threads de componente?", "Não. O renderer pode priorizar, pausar e abandonar trabalho antes de um commit consistente."),
  card(concurrency, "Suspense captura erro?", "Não. Suspense coordena espera; Error Boundary coordena falha e recuperação."),
  card(concurrency, "O que startTransition controla?", "A prioridade de setters executados no escopo apropriado, não cancelamento de rede ou transação remota."),
  card(concurrency, "O que hidratação exige?", "Que servidor e primeiro render cliente produzam markup compatível antes de efeitos dependentes do browser."),
  card(performance, "Rerender implica mutação do DOM?", "Não. React pode recalcular e reconciliar sem alterar o host; meça commits e duração."),
  card(performance, "useMemo garante armazenamento?", "Não. É cache de otimização descartável; corretude não pode depender de sua permanência."),
  card(performance, "Qual identidade usar em lista virtual?", "O id do domínio; nodes e posições podem ser reciclados."),
  card(performance, "Code splitting sempre melhora?", "Não. Microchunks podem criar requests, waterfalls, duplicação e falhas de versão; meça o caminho crítico."),
  card(accessibility, "Por que HTML nativo antes de ARIA?", "Ele já implementa papel, foco, teclado, estado e interoperabilidade, reduzindo promessas incompletas."),
  card(accessibility, "aria-modal torna o fundo inerte?", "Não. Modalidade também exige contenção de foco, inert/interação, scroll e restauração."),
  card(accessibility, "Status versus alert?", "Status anuncia de modo polite; alert interrompe de forma assertiva e deve ser reservado a urgência real."),
  card(accessibility, "Reduced motion remove funcionalidade?", "Não. Remove/substitui movimento não essencial mantendo estado, feedback e operação."),
  card(testing, "Por que consultar por role e nome?", "Porque protege o contrato observável/acessível e evita acoplamento à estrutura ou classe interna."),
  card(testing, "O que MSW preserva no teste?", "Client, request, parsing e handling reais, falsificando a fronteira HTTP em vez de cada hook."),
  card(testing, "O que pertence a uma feature?", "UI, regras, adapters e testes que mudam juntos, com uma interface pública pequena."),
  card(testing, "Violação zero no axe prova acessibilidade?", "Não. Teclado, foco, leitura, conteúdo e fluxo ainda exigem testes e revisão humana."),
  card(project, "Qual é a autoridade das regras da Serpe?", "O reducer/domínio puro; React apenas projeta estado e sincroniza recursos externos."),
  card(project, "Como evitar dois clocks após Strict Mode?", "Effect retorna cleanup do timer exato e cria recurso apenas enquanto a fase está ativa."),
  card(project, "Por que não anunciar cada tick?", "Geraria uma live region ruidosa; anuncie fase, placar e eventos relevantes com cadência."),
  card(project, "O que torna replay confiável?", "Versão, validação, limites, seed/eventos determinísticos e score recalculado pelo domínio."),
];
