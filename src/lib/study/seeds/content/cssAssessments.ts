import type { ContentCard, ContentExercise } from "./types";

const exercise = (
  nodeTitle: string,
  type: 1 | 2 | 3,
  level: ContentExercise["level"],
  points: number,
  promptMd: string,
  answerKeyMd: string,
): ContentExercise => ({
  nodeTitle,
  type,
  level,
  points,
  promptMd: `${promptMd} Entregue hipótese, evidência observável, decisão justificada e pelo menos um caso adverso reproduzível; uma captura visual isolada não demonstra que o algoritmo foi compreendido.`,
  answerKeyMd,
});

const card = (nodeTitle: string, frontMd: string, backMd: string): ContentCard => ({ nodeTitle, frontMd, backMd });

const cascade = "Cascata, herança e valores";
const selectors = "Seletores, especificidade e escopo";
const box = "Box model e sizing";
const flow = "Fluxo, position e stacking";
const flex = "Flexbox em profundidade";
const grid = "Grid em profundidade";
const responsive = "Responsividade e container queries";
const typeTheme = "Tipografia, cores e temas";
const motion = "Transforms, transitions e animation";
const architecture = "Arquitetura, tokens e componentes";
const debugging = "Debugging, performance e compatibilidade";
const project = "Projeto integrador: sistema visual responsivo";

export const CSS_EXERCISES: ContentExercise[] = [
  exercise(cascade, 1, "beginner", 10, "Receba quatro declarações concorrentes para color vindas do user agent, de uma regra sem layer, de components e de utilities, com uma delas important. Construa o cascade trace completo e explique o vencedor antes e depois de inverter a ordem declarada das layers.", "A resposta ordena origem e importância, contexto, layer, especificidade, escopo e ordem; distingue regras normais de important e não reduz a cascata à regra carregada por último."),
  exercise(cascade, 2, "intermediate", 20, "Implemente reset, base, componentes e utilitários com @layer, além de temas claro e escuro por custom properties semânticas. Remova um token, introduza um ciclo e compare inherit, initial, unset, revert e revert-layer em texto, controles e um widget incorporado.", "A solução declara a ordem uma vez, preserva defaults úteis, fornece fallback válido, demonstra invalid-at-computed-value-time e impede que o componente force importância para vencer o tema."),
  exercise(cascade, 3, "advanced", 30, "Diagnostique um incidente no qual a cor de um botão muda conforme a ordem dos chunks e um widget precisa recuperar estilos da plataforma. Produza caso mínimo, trace de matched/computed rules, correção por contrato de layers e regressão sob import parcial.", "Espera-se causa na precedência real, ordem estável de layers, uso criterioso de revert ou revert-layer e testes com bundle completo, parcial, tema e user stylesheet."),

  exercise(selectors, 1, "beginner", 10, "Calcule a especificidade de seletores que usam :where, :is, :not e :has, inclusive uma lista de :is que contém id. Preveja o vencedor contra classes de componente e confirme no painel de regras sem adicionar outro seletor mais forte.", "A resposta usa vetores corretos, reconhece especificidade zero de :where, maior argumento de :is/:not/:has e usa ordem apenas quando a precedência empata."),
  exercise(selectors, 2, "intermediate", 20, "Refatore uma cadeia dependente de divs aninhadas para uma API baseada em classe, atributo de estado e :focus-visible. Acrescente enhancement com :has e fronteira de @scope, então altere o markup interno e prove que o estilo essencial permanece.", "A solução seleciona por significado estável, limita alcance, mantém foco e estado nativos, oferece baseline sem :has e não deixa um id escondido elevar toda a regra."),
  exercise(selectors, 3, "advanced", 30, "Audite uma guerra de especificidade entre CSS legado, componente novo e conteúdo de CMS. Mapeie alcance e dependências, reduza seletores com :where ou layers e crie mutantes de nesting, atributo ausente e suporte parcial a @scope.", "A correção reduz acoplamento ao DOM, documenta o contrato de estado, preserva conteúdo não confiável dentro da fronteira e prova os vencedores no cascade trace."),

  exercise(box, 1, "beginner", 10, "Calcule a largura externa de um painel em content-box e border-box com width, padding e border, incluindo scrollbar. Depois explique por que width:100% estoura o container e qual elemento deve possuir a área interna.", "A resposta separa content, padding, border e margin, considera scrollbar/plataforma e corrige pelo sizing global e ownership de padding, não por largura mágica."),
  exercise(box, 2, "intermediate", 20, "Monte uma linha flexível com título, URL longa, imagem substituída e sidebar clampada. Demonstre min-content, max-content, fit-content e o minimum auto; corrija o overflow usando min-inline-size e quebra de token apenas no item adequado.", "A solução mede contribuições intrínsecas, preserva a imagem, aplica min-inline-size:0 ao filho flexível e testa idiomas, URLs, zoom e containers menores que o mínimo desejado."),
  exercise(box, 3, "advanced", 30, "Investigue um shell mobile que usa 100vh, dialog com altura fixa e ancestral overflow hidden. Reproduza barras dinâmicas, teclado virtual, safe area, foco cortado e sticky quebrado, depois proponha constraints e política de overflow.", "Espera-se fallback de viewport seguido de dvh, min/max-block-size, scroll no dono correto, foco visível, safe-area e explicação de hidden versus clip versus auto."),

  exercise(flow, 1, "beginner", 10, "Parta de uma pilha cujas margens colapsam e de uma mídia com float não contido. Desenhe o normal flow, identifique o BFC e compare flow-root com border, padding e flex column com gap.", "A resposta explica quando margens colapsam, por que flow-root contém o float e escolhe gap para espaçamento de layout sem remendos dependentes do primeiro filho."),
  exercise(flow, 2, "intermediate", 20, "Implemente badge absoluto, título sticky e barra de ação inferior usando insets lógicos. Teste conteúdo duplicado, escrita RTL, zoom, scroll container aninhado e um ancestral transformado que muda o containing block.", "A solução mantém texto principal no fluxo, revela os containing blocks, reserva espaço, identifica o scrollport de sticky e não deixa ação ou foco encobertos."),
  exercise(flow, 3, "advanced", 30, "Depure um popover com z-index 999999 que permanece atrás de um header. Liste todos os stacking contexts, ordem de pintura e triggers, compare isolation com top layer de dialog/popover e escreva uma regressão mínima.", "A correção atua no ancestral/contexto correto, reduz a escala a layers semânticos, considera transform/opacity/contain e usa top layer quando a semântica da interface pede."),

  exercise(flex, 1, "beginner", 10, "Para três itens com bases 100, 200 e 300 pixels, grow iguais, shrink distintos e container variável, calcule positive e negative free space. Mostre quando min-content congela um item e obriga nova redistribuição.", "A resposta distingue flex base de tamanho final, distribui grow proporcionalmente, usa scaled shrink factor e reaplica constraints ao congelar itens."),
  exercise(flex, 2, "intermediate", 20, "Construa toolbar com busca elástica, ações fixas, baseline e quebra em duas linhas. Compare flex:1, flex:auto e basis explícita; use auto margin conscientemente e teste labels longos, zoom e largura mínima.", "A implementação declara grow/shrink/basis por requisito, usa min-inline-size adequado, não confunde align-content com uma linha e mantém ações operáveis quando ocorre wrap."),
  exercise(flex, 3, "advanced", 30, "Audite cards que usam order para parecer corretos e flex-wrap para simular colunas alinhadas. Registre ordem DOM, teclado e leitura, migre somente o necessário para Grid e crie matriz de conteúdo curto, longo e localizado.", "A solução restaura ordem semântica, reserva Flex para um eixo/grupos independentes, usa Grid quando o alinhamento atravessa linhas e prova navegação coerente."),

  exercise(grid, 1, "beginner", 10, "Compare duas colunas 1fr 1fr com minmax(0,1fr) diante de uma URL longa. Ative o overlay, identifique tracks explícitos e implícitos e explique por que fr distribui espaço restante depois das contribuições mínimas.", "A resposta não trata fr como percentual; mostra minimum auto, corrige o track e evita uma coluna implícita acidental criada por placement fora da grade."),
  exercise(grid, 2, "intermediate", 20, "Implemente shell com linhas nomeadas ou areas e coleção usando auto-fit/minmax. Troque para uma coluna sem alterar a ordem do DOM, compare auto-fit com auto-fill e teste container menor que o mínimo do card.", "O mapa de areas é válido em cada breakpoint, min(100%, limite) evita overflow, a ordem de foco permanece lógica e tracks vazios são explicados."),
  exercise(grid, 3, "advanced", 30, "Alinhe título, corpo e ações de cards com subgrid, incluindo fallback sem altura fixa. Injete texto traduzido, item ausente e spans diferentes; meça tracks usados e prove que o fallback preserva legibilidade.", "Espera-se grid pai coerente, span planejado, subgrid no eixo correto, @supports estreito e fallback auto/1fr/auto sem cortar conteúdo."),

  exercise(responsive, 1, "beginner", 10, "Projete uma página fluid first com max-inline-size, clamp e wrap. Descubra breakpoints pelo ponto em que conteúdo deixa de caber, não por nomes de dispositivos, e registre comportamento em split-screen e zoom de 200%.", "A solução começa no menor espaço, limita comprimento de linha, não cria scroll horizontal e documenta a falha de conteúdo que justifica cada media query."),
  exercise(responsive, 2, "intermediate", 20, "Crie o mesmo card dentro de main larga, sidebar e modal usando container-type e @container. Compare o resultado com uma media query de viewport e preserve um baseline funcional quando container queries não forem aplicadas.", "O componente responde ao espaço que recebe, escolhe nome/eixo de container corretos, não consulta o próprio tamanho de modo circular e mantém conteúdo linear como fallback."),
  exercise(responsive, 3, "advanced", 30, "Monte matriz de width, height, orientation, hover, pointer, contrast, forced colors, reduced motion e reduced data. Remova combinações redundantes e prove que preferências alteram apresentação sem esconder tarefa ou informação.", "A resposta separa capacidade de preferência, evita inferir dispositivo, testa mudanças em runtime e garante equivalência funcional em teclado, touch, impressão e cores forçadas."),

  exercise(typeTheme, 1, "beginner", 10, "Defina escala tipográfica com rem, line-height sem unidade e comprimentos de linha limitados. Carregue texto em português, alemão e árabe, aumente fonte a 200% e explique as diferenças entre métricas da fonte e caixa CSS.", "A solução mantém ritmo e reflow, usa unidades relativas, não corta glifos, trata writing direction e escolhe medidas pela legibilidade em vez de altura fixa."),
  exercise(typeTheme, 2, "intermediate", 20, "Configure webfont com formatos, preload somente quando comprovado, font-display e fallback metricamente compatível. Capture waterfall, layout shift e troca de fonte em rede lenta e cache quente.", "Espera-se subset/face coerentes, crossorigin correto quando necessário, size-adjust ou overrides justificados e medição de CLS/bytes, não preferência estética isolada."),
  exercise(typeTheme, 3, "advanced", 30, "Modele tokens semânticos para superfície, texto, ação e perigo em temas claro, escuro e forced colors. Calcule contraste nos estados normal, hover, foco e disabled e teste uma user stylesheet que remove backgrounds.", "A paleta mantém significado sem depender só de cor, color-scheme alinha controles nativos, currentColor/borders sobrevivem a overrides e os tokens não codificam componente ou pigmento indevidamente."),

  exercise(motion, 1, "beginner", 10, "Dada uma sequência de transform functions, escreva as matrizes ou coordenadas intermediárias e preveja o resultado ao inverter translate, rotate e scale. Identifique transform-origin e o novo stacking context.", "A resposta respeita a ordem não comutativa, distingue layout de pintura e considera containing block/stacking context criado por transform."),
  exercise(motion, 2, "intermediate", 20, "Implemente transição de card e abertura de painel sem animar auto ou provocar layout por frame. Compare transform/opacity com top/height no Performance e defina comportamento para interrupção e prefers-reduced-motion.", "A solução mede style/layout/paint/composite, mantém estado final acessível, reduz ou remove movimento não essencial e evita opacity zero com foco ainda ativo."),
  exercise(motion, 3, "advanced", 30, "Crie animação com keyframes, fill-mode e múltiplas iterações; pause no meio, troque a preferência do sistema e dispare operação assíncrona concorrente. Verifique eventos, estado persistente e orçamento de layers.", "Espera-se lifecycle determinístico, ausência de dependência exclusiva em animationend, promoção comedida, cleanup e equivalência da tarefa quando animações são canceladas."),

  exercise(architecture, 1, "beginner", 10, "Separe tokens primitivos e semânticos para cor, espaço, tipo, radius e elevação. Mapeie quais consumidores podem sobrescrever cada token e demonstre por que --red-500 espalhado não representa intenção de produto.", "A resposta cria contrato semântico estável, escopos e fallbacks, evita alias circular e registra decisão/migração sem transformar toda declaração em custom property."),
  exercise(architecture, 2, "intermediate", 20, "Modele Button com variantes, tamanhos, disabled, loading e ícone por classes ou data attributes. Organize tokens, reset, base, components e utilities em layers e teste import parcial e composição externa.", "A API tem estados finitos, selectors baixos, ordem de layer declarada no entry point e comportamento previsível quando apenas tokens/base ou componente são consumidos."),
  exercise(architecture, 3, "advanced", 30, "Planeje migração de CSS global para componentes sem duplicar regras ou quebrar páginas antigas. Use inventário de dependências, métricas de cobertura, depreciação e remoção; injete widget externo e duas versões simultâneas.", "A estratégia possui fases reversíveis, ownership, telemetria, compatibilidade de contrato e gate que prova ausência de vazamento, dead CSS e escalada de especificidade."),

  exercise(debugging, 1, "beginner", 10, "Receba um elemento aparentemente sem estilo. Use somente passos verificáveis para distinguir selector que não casa, declaração inválida, regra sobrescrita, propriedade herdada e valor usado alterado pelo containing block.", "A resposta reduz o caso, verifica matched rules, cascade trace, computed e box/layout overlays nessa ordem, sem tentar valores aleatórios até a tela parecer correta."),
  exercise(debugging, 2, "intermediate", 20, "Perfis uma interação que invalida estilo e força layout em uma lista grande. Compare hard reload e navegação client-side, identifique read-after-write e reduza escopo, DOM ou trabalho mantendo o mesmo comportamento.", "A solução usa trace com baseline, separa style/layout/paint/composite, evita micro-otimizar selectors sem evidência e mede memória/nodes persistentes."),
  exercise(debugging, 3, "advanced", 30, "Projete fallback com @supports para uma feature moderna e matriz de browsers baseada em suporte real. Adicione visual regression para viewport, tema, locale, zoom e estado; injete falha em cada caminho.", "O baseline executa a tarefa, enhancement é isolado, screenshots e asserts funcionais cobrem ambos os ramos, tolerâncias são documentadas e versão/browser constam no artefato."),

  exercise(project, 1, "beginner", 10, "Entregue a base do sistema Dédalo com ordem de layers, tokens, reset, tipografia, foco e shell no fluxo normal. Demonstre conteúdo completo com CSS parcial, impressão e uma user stylesheet que remove cores de fundo.", "A base declara precedência uma vez, preserva defaults e landmarks, mantém contraste/foco e não depende de component layer para tornar o documento legível."),
  exercise(project, 2, "intermediate", 20, "Implemente shell, cards, formulário e estados usando Grid, Flex e container queries conforme o eixo. Teste o mesmo card em três containers, texto longo, RTL, 200% de zoom, dark e reduced motion.", "A solução escolhe algoritmos por constraints, usa propriedades lógicas/minmax, conserva ordem DOM e fornece estados distinguíveis sem overflow ou motion obrigatório."),
  exercise(project, 3, "advanced", 30, "Execute o Lab Dédalo css-cascade-layout-debug injetando bugs de especificidade, min-width e stacking context. Produza traces antes/depois, budget CSS, matriz visual, fallback, canário e rollback ligados ao commit de entrega.", "A banca reproduz cada causa, associa correção ao algoritmo, valida cascade/layout/acessibilidade/performance e registra warnings conhecidos sem rebaixar nenhum gate crítico."),
];

export const CSS_CARDS: ContentCard[] = [
  card(cascade, "Qual é a ordem completa de desempate da cascata?", "Origem e importância, contexto, layer, especificidade, proximidade de escopo e ordem de aparição."),
  card(cascade, "O que muda para declarações important dentro de layers?", "A precedência das layers se inverte, protegendo declarações importantes das camadas estabelecidas primeiro."),
  card(cascade, "Quando unset se comporta como inherit?", "Quando a propriedade é herdada; nas não herdadas, unset produz o valor initial."),
  card(cascade, "O que um fallback de var() não corrige?", "Um token presente e sintaticamente válido porém semanticamente inadequado; fallback atua na ausência ou invalidade."),
  card(selectors, "Qual especificidade :where() acrescenta?", "Zero, independentemente dos seletores escritos em seus argumentos."),
  card(selectors, "Por que um id dentro de :is() é perigoso?", "Porque o maior argumento determina a especificidade e pode elevar todos os matches daquela lista."),
  card(selectors, "Quando :has() deve ser progressive enhancement?", "Quando o estado relacional melhora a apresentação, mas a tarefa essencial continua disponível sem suporte."),
  card(selectors, "Qual custo de seletor importa primeiro em aplicações comuns?", "Alcance, legibilidade e acoplamento ao markup; matching raramente é o primeiro gargalo."),
  card(box, "O que border-box inclui na dimensão declarada?", "Conteúdo, padding e border; margin continua fora da caixa dimensionada."),
  card(box, "Por que um flex item pode recusar encolher?", "Seu minimum auto deriva da contribuição min-content; use min-inline-size:0 quando o requisito permite."),
  card(box, "Hidden e clip criam o mesmo tipo de overflow?", "Não. hidden pode permitir scroll programático e cria scroll container; clip apenas recorta."),
  card(box, "Qual viewport unit acompanha a viewport dinâmica?", "dvh/dvw; mantenha fallback quando necessário e teste barras móveis e teclado virtual."),
  card(flow, "O que um BFC resolve em relação a floats?", "Ele contém a contribuição do float e isola interações específicas de fluxo e margens."),
  card(flow, "De quem absolute obtém o containing block?", "Do ancestral que estabelece a referência aplicável, frequentemente um positioned ancestor, não necessariamente o pai imediato."),
  card(flow, "Por que sticky deixa de aderir no lugar esperado?", "Um ancestral com overflow pode redefinir seu scrollport, além de sticky exigir um inset no eixo."),
  card(flow, "Por que z-index enorme ainda pode perder?", "Z-index só compara participantes dentro do mesmo stacking context; o contexto ancestral inteiro pode estar atrás."),
  card(flex, "O que flex: 1 geralmente define como basis?", "Base zero, fazendo itens dividir espaço disponível sem preservar a largura de conteúdo como base."),
  card(flex, "Como o shrink distribui espaço negativo?", "Pelo fator de shrink multiplicado pela flex base, respeitando mínimos/máximos e congelamento."),
  card(flex, "Quando align-content tem efeito?", "Quando existem múltiplas linhas flex e sobra espaço no eixo transversal do container."),
  card(flex, "Order altera a sequência de teclado?", "Não. Ele muda apresentação/pintura, enquanto DOM, leitura e foco conservam a ordem original."),
  card(grid, "Por que 1fr pode exceder o container?", "Porque o mínimo automático do track ainda recebe contribuição min-content; fr divide apenas o espaço restante."),
  card(grid, "Auto-fit e auto-fill diferem como?", "Auto-fit colapsa tracks vazios; auto-fill preserva a grade de tracks vazios reservados."),
  card(grid, "Qual risco de grid-auto-flow: dense?", "Ele pode mudar a ordem visual dos itens em relação ao DOM e confundir navegação/leitura."),
  card(grid, "O que subgrid compartilha com o grid pai?", "As linhas/tracks do eixo escolhido, permitindo alinhamento real entre conteúdos de itens irmãos."),
  card(responsive, "De onde deve nascer um breakpoint?", "Do ponto mensurável em que o conteúdo ou a tarefa deixa de caber ou permanecer legível."),
  card(responsive, "Por que container query favorece componentes portáveis?", "Porque responde ao espaço alocado ao componente, não à largura total da viewport."),
  card(responsive, "Hover identifica um tipo de dispositivo?", "Não. É apenas uma capacidade; dispositivos híbridos e mudanças de entrada invalidam essa inferência."),
  card(responsive, "O que reduced motion deve preservar?", "Estado, compreensão e conclusão da tarefa, removendo ou reduzindo movimento não essencial."),
  card(typeTheme, "Por que line-height sem unidade é robusto?", "O fator acompanha o tamanho de fonte efetivo e herda sem congelar uma medida absoluta inadequada."),
  card(typeTheme, "Para que serve font-display?", "Para definir a política de exibição/troca enquanto a webfont carrega; não elimina incompatibilidade métrica."),
  card(typeTheme, "Token semântico descreve o quê?", "O papel no sistema, como texto de perigo ou superfície elevada, e não um pigmento específico."),
  card(typeTheme, "O que forced colors pode substituir?", "Cores autorais e fundos; borders, texto, currentColor e semântica não cromática precisam sustentar a tarefa."),
  card(motion, "Transforms são comutativos?", "Não. Alterar a ordem de translate, rotate e scale geralmente muda o resultado geométrico."),
  card(motion, "Quais propriedades costumam compor sem layout?", "Transform e opacity, embora o perfil real ainda deva confirmar paint, memória e promoção de layers."),
  card(motion, "Por que animationend não pode ser a única conclusão?", "Preferência, cancelamento, remoção do nó ou duração zero podem impedir o evento esperado."),
  card(motion, "Opacity zero remove um controle da interação?", "Não. Ele pode continuar focável/clicável; estado visual e interativo precisam ser coordenados."),
  card(architecture, "Qual diferença entre token primitivo e semântico?", "O primitivo nomeia escala/valor; o semântico expressa intenção e pode mapear para diferentes primitivos por tema."),
  card(architecture, "Onde declarar a ordem de @layer?", "No entry point estável, antes das regras, para que ordem de chunks não redefina a precedência."),
  card(architecture, "O que compõe uma API CSS de componente?", "Parts, variantes, estados, tokens sobrescrevíveis, fronteiras e comportamento de fallback documentados."),
  card(architecture, "Como remover CSS legado com segurança?", "Com inventário, ownership, métricas de uso/cobertura, depreciação, regressão e fase reversível de migração."),
  card(debugging, "Qual é o primeiro artefato de uma depuração CSS?", "Um caso mínimo que conserva o sintoma e permite inspecionar regras, valores e constraints sem ruído."),
  card(debugging, "O que forced synchronous layout indica?", "Leitura de geometria após uma escrita que invalida layout, obrigando o browser a calcular imediatamente."),
  card(debugging, "Como @supports deve ser usado?", "Para envolver enhancement específico sobre um baseline funcional, testando explicitamente os dois caminhos."),
  card(debugging, "O que uma matriz visual deve cruzar?", "Viewport/container, estado, tema, preferência, locale, zoom e browser relevantes para a tarefa."),
  card(project, "Qual é a ordem de layers do Dédalo?", "Tokens, reset, base, components e utilities, declarada previamente como contrato de precedência."),
  card(project, "Que três bugs o Lab CSS injeta?", "Escalada de especificidade, minimum auto/min-width e stacking context que aprisiona z-index."),
  card(project, "Quando o sistema visual está acessível sem backgrounds?", "Quando texto, borders, foco, ícones e estados ainda comunicam estrutura e permitem concluir a tarefa."),
  card(project, "O que torna a entrega auditável?", "Traces, testes, matriz, budgets, versões, canário e rollback vinculados ao mesmo commit e às causas demonstradas."),
];
