// Tailwind CSS v4, reescrita autoral (PLANO.md §R.2) — capítulo 1.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "O modelo utility-first e o motor da v4";

export const TAILWIND_BOOK_01: ContentChapter = {
  title: NODE,
  level: "basico",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Por que classes utilitárias, e o que elas não são",
      order: 0,
      blocks: [
        prose([
          "A primeira reação de quem vê Tailwind pela primeira vez costuma ser de estranhamento: um botão com `class=\"rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700\"` parece a volta do atributo `style` dos anos 2000, só que com nomes mais curtos. Vale levar essa objeção a sério antes de aprender a ferramenta, porque entender por que ela não procede é entender o modelo inteiro.",
          "",
          "O problema que o Tailwind ataca é o do CSS que só cresce. Num projeto com folhas de estilo escritas à mão, cada componente novo ganha classes novas (`.card-header`, `.card-header--compact`, `.pricing-card-header`), e cada regra nova é escrita com medo: alterar `.card-header` pode quebrar alguma tela que você nem sabe que a usa. Ninguém apaga CSS antigo, porque ninguém tem certeza de que ele está morto. O arquivo cresce a cada funcionalidade, e a especificidade dos seletores vira uma disputa — `!important` aqui, um seletor mais longo ali — até que mudar a cor de um título exija entender meia dúzia de regras que competem por ele.",
          "",
          "Classes utilitárias invertem a direção. Em vez de criar um nome novo para cada combinação de estilos, você compõe a combinação diretamente no HTML a partir de um vocabulário fixo e pequeno: `px-4` sempre significa o mesmo preenchimento horizontal, `text-white` sempre a mesma cor. O CSS deixa de crescer com o número de componentes; ele cresce com o número de utilitários distintos que o projeto usa, que se estabiliza rápido. Apagar um componente apaga o estilo dele junto, porque o estilo estava nele. E mudar o estilo de um elemento é mudar o próprio elemento, sem efeito colateral em nenhum outro lugar.",
          "",
          "A diferença em relação a `style=\"...\"` é decisiva, e tem três partes. Primeiro, utilitários são **restringidos por uma escala**: você não escolhe um preenchimento qualquer em pixels, escolhe um passo da escala de espaçamento do projeto (`px-3`, `px-4`, `px-6`), e a consistência visual vem de graça. Segundo, utilitários alcançam o que `style` não alcança: estados (`hover:`, `focus-visible:`), tamanhos de tela (`md:`), modo escuro (`dark:`), pseudo-elementos — tudo isso é impossível num atributo `style`. Terceiro, utilitários geram CSS de verdade, com seletores de classe de baixa especificidade, que podem ser cacheados e combinados; não há disputa de especificidade porque cada classe faz uma coisa só.",
          "",
          "O que o Tailwind **não** é: não é uma biblioteca de componentes. Ele não traz botões, modais ou cards prontos; traz o vocabulário para construí-los. Também não substitui saber CSS. Quem não entende o que `flex`, `min-w-0` ou `overflow-hidden` fazem não vai conseguir depurar um layout com eles — os utilitários são nomes curtos para propriedades CSS, e a documentação de cada um mostra a declaração exata que ele gera. Este livro parte do princípio de que você conhece o básico de CSS (cascata, box model, flex e grid ao menos de vista) e mostra como o Tailwind organiza esse conhecimento.",
          "",
          "A objeção restante é a de legibilidade: listas longas de classes. Ela é real e tem duas respostas que os próximos capítulos aprofundam. A primeira é que o componente é a unidade de reuso, não a classe: o botão é escrito uma vez num componente `Botao` (em React, Vue ou num template), e a lista longa vive num lugar só. A segunda é que o vocabulário se torna fluente rápido — depois de algumas semanas, `flex items-center gap-2` é lido como uma frase, e a lista diz exatamente o que o elemento faz, sem precisar abrir outro arquivo.",
        ]),
        code("html", [
          "<!-- o mesmo botão, descrito pelos estilos que aplica -->",
          "<button class=\"rounded-lg bg-sky-600 px-4 py-2 font-medium text-white shadow-sm",
          "               hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2",
          "               focus-visible:outline-sky-600 disabled:opacity-50\">",
          "  Salvar alterações",
          "</button>",
        ], "Estados, foco e desabilitado na própria marcação — nada disso cabe num atributo style"),
        code("html", [
          "<article class=\"rounded-xl border border-gray-200 bg-white p-6\">",
          "  <h2 class=\"text-lg font-semibold text-gray-900\">Plano anual</h2>",
          "  <p class=\"mt-2 text-sm text-gray-600\">Dois meses grátis em relação ao mensal.</p>",
          "  <p class=\"mt-4 text-3xl font-bold tracking-tight text-gray-900\">R$ 990</p>",
          "</article>",
        ], "Um card inteiro sem nenhuma classe inventada: só passos de escalas compartilhadas"),
        prose([
          "No primeiro exemplo, leia as classes como uma descrição: cantos arredondados, fundo azul, preenchimento, peso de fonte, texto branco, sombra; ao passar o mouse, um azul mais escuro; com foco por teclado, um contorno deslocado; desabilitado, metade da opacidade. Cada parte dessa frase é uma decisão de design que, em CSS escrito à mão, estaria espalhada por quatro regras com seletores diferentes.",
          "",
          "No segundo, repare que nenhum valor foi inventado. `p-6`, `mt-2`, `mt-4` são passos da mesma escala de espaçamento; `text-gray-600` e `text-gray-900` são tons da mesma paleta. Um segundo card escrito por outra pessoa da equipe vai usar os mesmos passos quase por inércia, e as telas ficam consistentes sem um documento de estilo que alguém precise lembrar de consultar.",
        ]),
        porque([
          "O Tailwind troca nomes de componentes no CSS por um vocabulário fixo de utilitários restringidos por escalas. Com isso, o CSS para de crescer junto com o produto, não há disputa de especificidade e cada mudança é local ao elemento. O custo é a marcação mais verbosa, que se resolve tornando o componente — não a classe — a unidade de reuso.",
        ]),
        quebraria([
          "Uma equipe adota Tailwind mas continua tratando a classe como unidade de reuso: cria `.btn-primary`, `.btn-primary-large`, `.btn-primary-large-outline` com `@apply` para cada variação. Em seis meses, tem de novo um arquivo de CSS crescente, com nomes que ninguém lembra e variações quase iguais — os problemas que queria evitar, agora com uma camada a mais de indireção.",
        ]),
      ],
    },
    {
      title: "Como a v4 gera o CSS: candidatos, camadas e nenhum arquivo de configuração",
      order: 1,
      blocks: [
        prose([
          "O Tailwind não entrega um arquivo CSS gigante com todos os utilitários possíveis. Ele **gera, sob demanda, só o CSS das classes que o seu projeto usa**. Entender como ele descobre essas classes explica a regra mais importante do uso diário — e a causa do erro mais comum de quem começa.",
          "",
          "O processo tem três etapas. Na primeira, o Tailwind **varre os arquivos do projeto** — HTML, JSX, TSX, Vue, Svelte, templates do servidor — procurando sequências de texto que possam ser classes. Ele não entende JavaScript nem HTML: trata cada arquivo como texto e extrai os tokens que *parecem* classes, chamados **candidatos**. Na segunda etapa, cada candidato é comparado com o vocabulário de utilitários: `bg-sky-600` é reconhecido e vira uma regra; `bg-sky-60O` (com a letra O) não corresponde a nada e é ignorado em silêncio. Na terceira, as regras geradas são escritas no CSS final, em ordem determinística.",
          "",
          "A consequência direta da primeira etapa é a regra de ouro: **classes precisam aparecer inteiras no código-fonte**. Se você monta o nome da classe em tempo de execução — `` `bg-${cor}-600` `` —, o Tailwind nunca vê `bg-red-600` nem `bg-green-600` no texto, e essas classes não existem no CSS gerado. O componente funciona com as cores que, por acaso, aparecem escritas por extenso em outro lugar do projeto, e falha com as outras. A forma correta é mapear os valores para classes completas: um objeto `{ erro: \"bg-red-600\", sucesso: \"bg-green-600\" }` contém os dois nomes inteiros, que o varredor encontra.",
          "",
          "Na versão 4, essa varredura é **automática**. A v3 exigia um `tailwind.config.js` com a lista `content` dizendo quais arquivos ler; a v4 detecta sozinha os arquivos do projeto, ignorando o que está no `.gitignore` (como `node_modules` e pastas de build) e arquivos binários. Quando é preciso incluir algo de fora — uma biblioteca de componentes instalada em `node_modules` que usa classes Tailwind, por exemplo —, a diretiva `@source` no CSS acrescenta o caminho. O capítulo sobre o build volta a isso.",
          "",
          "A configuração também mudou de lugar: a v4 é **configurada em CSS**. O ponto de entrada é uma folha de estilo com `@import \"tailwindcss\";`, e é nela que você personaliza o tema com `@theme`, cria utilitários com `@utility` e variantes com `@custom-variant`. Não existe mais `tailwind.config.js` obrigatório (ele ainda pode ser carregado com `@config` em projetos que migram da v3). O primeiro exemplo mostra o arquivo de entrada mínimo de um projeto real.",
          "",
          "O CSS gerado é organizado em **camadas de cascata** (*cascade layers*, `@layer`), um recurso nativo do CSS moderno: `theme` (as variáveis do tema), `base` (o reset, chamado *Preflight*), `components` e `utilities`. Camadas resolvem uma dor antiga: uma regra numa camada posterior vence uma regra numa camada anterior, **independentemente da especificidade dos seletores**. Por isso um utilitário de uma classe só sempre vence o estilo de base de um elemento, e CSS próprio colocado na camada `components` pode ser sobrescrito por utilitários sem nenhum `!important`. O segundo exemplo mostra CSS próprio convivendo com os utilitários dentro dessa estrutura.",
          "",
          "Um detalhe de compatibilidade que vale saber desde já: a v4 usa recursos recentes do CSS (camadas, `@property`, `color-mix()`, cores em `oklch`) e por isso exige navegadores relativamente novos — Safari 16.4, Chrome 111 e Firefox 128 ou posteriores. Para projetos que precisam atender navegadores mais antigos, a v3 continua sendo a escolha, e o capítulo de migração discute essa decisão.",
        ]),
        code("css", [
          "/* src/index.css — o ponto de entrada de um projeto com Tailwind v4 */",
          "@import \"tailwindcss\";",
          "",
          "@theme {",
          "  --color-marca-600: oklch(0.55 0.18 250);",
          "  --font-display: \"Fraunces\", ui-serif, serif;",
          "}",
        ], "Configuração em CSS: importar o Tailwind e estender o tema no mesmo arquivo"),
        code("css", [
          "@import \"tailwindcss\";",
          "",
          "@layer components {",
          "  /* estilo de conteúdo vindo de um CMS, que não tem como receber classes */",
          "  .conteudo-artigo h2 { @apply mt-8 text-xl font-semibold; }",
          "  .conteudo-artigo p  { @apply mt-4 leading-relaxed; }",
          "}",
          "",
          "/* um utilitário aplicado no HTML (por exemplo, mt-12) vence a regra acima,",
          "   porque a camada utilities vem depois da camada components */",
        ], "CSS próprio na camada components: utilitários continuam vencendo, sem !important"),
        prose([
          "No primeiro exemplo, as duas variáveis do `@theme` não são só valores guardados: elas **criam utilitários**. A partir desse arquivo, `bg-marca-600`, `text-marca-600` e `font-display` passam a existir, e também ficam disponíveis como variáveis CSS comuns (`var(--color-marca-600)`) para qualquer CSS próprio. O capítulo de tema explica essa ligação entre variável e utilitário em detalhe.",
          "",
          "No segundo, o caso de uso é o clássico em que utilitários não alcançam: HTML que você não controla, como o corpo de um artigo vindo de um CMS em markdown. As regras usam `@apply` para reaproveitar a escala do projeto, e ficam na camada `components`. Se um elemento específico precisar de outra margem, um utilitário no próprio elemento vence, porque a camada de utilitários é posterior — a especificidade de `.conteudo-artigo h2` não importa entre camadas diferentes.",
        ]),
        porque([
          "Gerar CSS só para as classes encontradas no código mantém o arquivo final pequeno qualquer que seja o tamanho do vocabulário, e configurar em CSS aproxima o tema da linguagem em que ele é usado. Camadas de cascata eliminam a disputa de especificidade entre base, componentes e utilitários. A contrapartida é a regra de ouro: o varredor só vê classes escritas por extenso.",
        ]),
        quebraria([
          "Um componente de alerta monta a cor com `` className={`bg-${tipo}-100 text-${tipo}-800`} ``. Em desenvolvimento, os alertas de erro aparecem certos, porque `bg-red-100` está escrito em outro arquivo do projeto; os de aviso aparecem sem cor nenhuma. Alguém \"conserta\" escrevendo `bg-yellow-100` num comentário — o que funciona até o dia em que o comentário é apagado numa limpeza.",
        ]),
      ],
    },
    {
      title: "Instalar no projeto: o plugin do Vite e o caminho do PostCSS",
      order: 2,
      blocks: [
        prose([
          "A forma recomendada de usar Tailwind v4 num projeto com Vite — o caso de React, Vue, Svelte e boa parte dos projetos novos, incluindo os apps da suíte Olympus — é o plugin oficial `@tailwindcss/vite`. Ele se integra ao pipeline do Vite em vez de rodar como uma etapa separada, e é a forma mais rápida de gerar o CSS: o motor da v4, escrito em Rust, reconstrói apenas o necessário a cada alteração de arquivo, em milissegundos.",
          "",
          "A instalação tem três passos, e o primeiro exemplo mostra todos. Instalar os pacotes `tailwindcss` e `@tailwindcss/vite`. Registrar o plugin no `vite.config.ts`, ao lado do plugin do framework. E criar o arquivo CSS de entrada com `@import \"tailwindcss\";`, importado uma vez pelo ponto de entrada da aplicação (o `main.tsx`, por exemplo). Não há arquivo de configuração do Tailwind para criar, nem lista de arquivos para varrer.",
          "",
          "Para projetos que não usam Vite — Next.js, aplicações com webpack, ou ferramentas que já têm um pipeline de PostCSS —, existe o pacote `@tailwindcss/postcss`, registrado como plugin no `postcss.config.mjs`. O resultado é o mesmo; muda só o ponto de integração. Um detalhe que costuma confundir quem vem da v3: com o plugin novo, não é mais necessário instalar `autoprefixer` nem `postcss-import`, porque a v4 já cuida dos prefixos de navegador e da resolução de `@import`. E existe ainda uma CLI (`@tailwindcss/cli`) para projetos sem ferramenta de build alguma, que lê o CSS de entrada e escreve o resultado num arquivo.",
          "",
          "Duas extensões de editor tornam o trabalho muito mais agradável e evitam erros. A extensão oficial **Tailwind CSS IntelliSense** (para VS Code e editores compatíveis) completa nomes de classes, mostra a declaração CSS de cada utilitário ao passar o mouse e sublinha classes conflitantes ou inexistentes — exatamente o erro silencioso da seção anterior, agora visível enquanto você digita. E o plugin **prettier-plugin-tailwindcss** ordena as classes de cada elemento numa ordem canônica (layout primeiro, depois espaçamento, tipografia, cores, estados), o que torna diferenças de código mais legíveis e acaba com discussões sobre ordem em revisões.",
          "",
          "Um ponto importante sobre o CSS de base, o **Preflight**: ao importar `tailwindcss`, você recebe um reset que remove margens padrão de títulos e parágrafos, faz imagens se comportarem como bloco, zera estilos de listas e botões e aplica `box-sizing: border-box` a tudo. Isso dá um ponto de partida consistente entre navegadores, mas surpreende na primeira vez: um `<h1>` sem classes aparece do mesmo tamanho que o texto comum, e uma lista `<ul>` aparece sem marcadores. É intencional — os estilos vêm das classes —, e é o motivo de o conteúdo de um CMS precisar de regras próprias, como a seção anterior mostrou, ou do plugin oficial de tipografia (`@tailwindcss/typography`, com a classe `prose`).",
          "",
          "O segundo exemplo é a forma de conferir que a instalação funcionou, sem depender de olhar a tela: um componente com algumas classes e o teste mais simples possível — se `bg-sky-600` produz um fundo azul, o plugin está gerando CSS; se o elemento aparece sem estilo nenhum, o CSS de entrada não foi importado ou o plugin não foi registrado. A extensão de editor, nesse momento, também mostra a declaração gerada de cada classe ao passar o mouse.",
        ]),
        code("bash", [
          "# 1. pacotes",
          "npm install tailwindcss @tailwindcss/vite",
          "",
          "# 2. vite.config.ts: registrar o plugin (exemplo seguinte)",
          "# 3. src/index.css com @import \"tailwindcss\"; importado em src/main.tsx",
          "",
          "# ferramentas de editor e formatação",
          "npm install -D prettier prettier-plugin-tailwindcss",
        ], "Instalar o Tailwind v4 num projeto Vite"),
        code("ts", [
          "// vite.config.ts",
          "import { defineConfig } from \"vite\";",
          "import react from \"@vitejs/plugin-react\";",
          "import tailwindcss from \"@tailwindcss/vite\";",
          "",
          "export default defineConfig({",
          "  plugins: [react(), tailwindcss()],",
          "});",
        ], "O plugin do Tailwind ao lado do plugin do framework, sem arquivo de configuração próprio"),
        code("html", [
          "<!-- teste de fumaça da instalação: com o plugin ativo, a caixa aparece azul e centralizada -->",
          "<div class=\"grid min-h-screen place-items-center bg-gray-50\">",
          "  <p class=\"rounded-lg bg-sky-600 px-4 py-2 text-white\">Tailwind funcionando</p>",
          "</div>",
        ], "Um teste visual mínimo: se esta caixa não ficar azul, o CSS não foi gerado"),
        prose([
          "No segundo exemplo, repare no que não existe: nenhuma opção passada a `tailwindcss()`, nenhum caminho de arquivos. Toda a configuração do Tailwind vive no CSS de entrada. Em projetos que migraram da v3, o mesmo arquivo pode conter `@config \"./tailwind.config.js\";` para continuar usando a configuração antiga enquanto a migração não termina.",
          "",
          "No terceiro, `grid min-h-screen place-items-center` centraliza o conteúdo na tela inteira — três classes para um problema que gerou incontáveis perguntas em fóruns de CSS. Se o texto aparece no canto superior esquerdo, sem fundo, nenhuma classe foi gerada; se aparece centralizado mas sem a caixa azul, o problema é outro (provavelmente uma folha de estilo antiga sobrescrevendo), e o inspetor do navegador mostra qual regra venceu.",
        ]),
        porque([
          "Integrar o Tailwind como plugin do bundler, em vez de etapa separada, deixa o motor reconstruir só o que mudou e elimina configuração duplicada. A configuração ir para o CSS significa um arquivo a menos e o tema escrito na linguagem em que será usado. As extensões de editor fecham a lacuna do varredor silencioso, mostrando na hora a classe que não existe.",
        ]),
        quebraria([
          "Um projeto migra para a v4 instalando `@tailwindcss/vite`, mas mantém o `postcss.config.js` antigo com o plugin `tailwindcss` da v3. As duas versões processam o mesmo CSS, metade das classes novas não é gerada e o Preflight aparece duplicado. A tela fica parcialmente estilizada, e a equipe perde uma tarde até perceber que há dois motores rodando.",
        ]),
      ],
    },
    {
      title: "Ler e escrever classes: anatomia de um utilitário",
      order: 3,
      blocks: [
        prose([
          "Todo utilitário segue a mesma gramática, e conhecê-la faz o vocabulário parecer pequeno em vez de infinito. A forma geral é `variante:utilitário-valor`. O **utilitário** diz qual propriedade CSS é afetada (`bg` para cor de fundo, `p` para preenchimento, `text` para cor ou tamanho de texto, `rounded` para raio da borda). O **valor** escolhe um passo de uma escala do tema (`bg-sky-600`, `p-4`, `rounded-lg`). E as **variantes**, opcionais e encadeáveis, dizem *quando* o utilitário se aplica (`hover:`, `md:`, `dark:`, `disabled:`).",
          "",
          "Muitos utilitários têm famílias com direção. `p-4` aplica preenchimento nos quatro lados; `px-4` nos lados esquerdo e direito; `py-4` em cima e embaixo; `pt-4`, `pr-4`, `pb-4` e `pl-4` em um lado só. Existem também `ps-4` e `pe-4` (início e fim), que respeitam a direção do texto — em árabe ou hebraico, escritos da direita para a esquerda, o \"início\" é a direita. O mesmo padrão vale para margens (`m`, `mx`, `mt`...), bordas (`border-t`, `border-x`) e posicionamento (`top-0`, `inset-x-0`).",
          "",
          "Os valores vêm de **escalas**, e a v4 trouxe uma mudança importante para a principal delas, a de espaçamento: em vez de uma lista fixa de passos, existe uma unidade base, `--spacing` (0,25rem, ou 4 px, por padrão), e qualquer número multiplica essa unidade. `p-4` é 4 × 0,25rem = 1rem; `p-17` é 4,25rem, mesmo que ninguém tenha definido o passo 17. Isso acaba com o \"esse valor não existe na escala\" para espaçamentos, sem abrir mão da consistência — tudo continua sendo múltiplo da mesma unidade. O mesmo vale para colunas de grid (`grid-cols-15` funciona sem configuração).",
          "",
          "Algumas modificações cabem em qualquer utilitário. Um sinal de menos na frente torna o valor negativo (`-mt-4`, `-translate-x-1/2`). Uma barra depois de uma cor define a opacidade: `bg-sky-600/50` é o mesmo azul com 50% de opacidade, e `text-black/70` é preto a 70%. Na v4, um ponto de exclamação **no fim** marca a declaração como importante (`bg-red-500!`) — na v3 ele vinha no início — e deve ser exceção rara, para sobrescrever estilos de terceiros que você não controla.",
          "",
          "Quando um valor realmente não existe em escala nenhuma, há duas válvulas de escape. **Valores arbitrários**, entre colchetes, aceitam qualquer valor CSS: `top-[117px]`, `bg-[#1da1f2]`, `grid-cols-[200px_1fr]` (o sublinhado vira espaço). E a forma com parênteses usa uma variável CSS diretamente: `bg-(--cor-do-cliente)` é o mesmo que `background-color: var(--cor-do-cliente)`. As duas existem para os casos genuinamente únicos — a posição exata de um elemento numa ilustração, a cor da marca de um parceiro — e um capítulo inteiro discute quando usá-las e quando elas indicam que o tema precisa de um token novo.",
          "",
          "O segundo exemplo junta tudo numa linha só e vale ser lido como exercício: cada classe pode ser decomposta em variante, utilitário e valor, e cada uma corresponde a uma declaração CSS. Se alguma não fizer sentido, a extensão IntelliSense mostra o CSS gerado ao passar o mouse — o hábito mais rápido para aprender o vocabulário é exatamente esse, olhar a declaração por trás de cada nome.",
        ]),
        code("html", [
          "<div class=\"mx-auto max-w-2xl px-4 py-8 sm:px-6\">",
          "  <div class=\"-mt-2 rounded-2xl bg-sky-600/10 p-17 text-sky-900\">",
          "    <p class=\"text-sm/6 font-medium\">p-17 não está em nenhuma lista: é 17 × --spacing.</p>",
          "  </div>",
          "</div>",
        ], "Direções, negativos, opacidade com barra e a escala de espaçamento contínua da v4"),
        code("html", [
          "<a href=\"/planos\"",
          "   class=\"inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-sm",
          "          text-gray-700 hover:border-sky-500 hover:text-sky-700",
          "          md:px-4 md:text-base dark:border-gray-700 dark:text-gray-200\">",
          "  Ver planos",
          "  <span aria-hidden=\"true\" class=\"translate-y-px\">→</span>",
          "</a>",
        ], "Uma linha para decompor: variante, utilitário e valor em cada classe"),
        prose([
          "No primeiro exemplo, `text-sm/6` é uma forma combinada da v4: tamanho de fonte pequeno e altura de linha no passo 6 da escala (1,5rem), numa classe só. `bg-sky-600/10` é o azul da marca a 10% de opacidade — a forma usual de criar fundos suaves a partir de uma cor de destaque, sem definir uma cor nova.",
          "",
          "No segundo, tente ler em voz alta: em linha e flexível, itens centralizados, espaço de 2 entre eles, totalmente arredondado, borda cinza, preenchimento 3 por 1, texto pequeno e cinza; ao passar o mouse, borda e texto azuis; a partir da tela média, mais preenchimento e texto maior; no modo escuro, borda e texto em tons escuros. A seta tem `aria-hidden` para que leitores de tela não a anunciem, um cuidado de acessibilidade que o capítulo sobre o assunto aprofunda.",
        ]),
        porque([
          "Uma gramática regular — variante, utilitário, valor — faz um vocabulário de milhares de classes ser aprendido como algumas dezenas de regras. A escala de espaçamento contínua da v4 mantém a consistência (tudo é múltiplo da mesma unidade) sem obrigar a configurar cada passo, e as válvulas de escape existem para o raro valor que não cabe em escala nenhuma.",
        ]),
        quebraria([
          "Um projeto começa a usar valores arbitrários para \"acertar\" o design pixel a pixel: `mt-[13px]`, `mt-[14px]`, `p-[7px]`, cores `bg-[#2a7]` diferentes em cada tela. Um ano depois, há quarenta tons de verde e trinta espaçamentos distintos, nenhum deles no tema, e uma mudança de identidade visual exige caçar valores literais em centenas de arquivos — o problema que a escala existia para evitar.",
        ]),
      ],
    },
  ],
};

export const TAILWIND_BOOK_01_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "beginner",
    promptMd: "Este componente mostra corretamente os alertas de erro, mas os de aviso aparecem sem cor nenhuma:\n\n```tsx\nfunction Alerta({ tipo, children }: { tipo: \"red\" | \"yellow\"; children: React.ReactNode }) {\n  return <div className={`bg-${tipo}-100 p-4`}>{children}</div>;\n}\n```\n\nQual é a causa?",
    choices: [
      "O Tailwind só gera classes escritas por extenso no código-fonte; `bg-yellow-100` nunca aparece inteira",
      "A cor amarela não existe na paleta padrão da v4",
      "Template strings não podem ser usadas em className",
      "É preciso declarar as cores numa lista content no tailwind.config.js",
    ],
    answerKeyMd: "O Tailwind só gera classes escritas por extenso no código-fonte; `bg-yellow-100` nunca aparece inteira",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "beginner",
    promptMd: "Um colega diz que `class=\"px-4 py-2 bg-sky-600 text-white hover:bg-sky-700\"` é \"só um atributo style com outro nome\". Explique as diferenças concretas entre utilitários Tailwind e estilos inline, e por que essa diferença importa num projeto grande.",
    answerKeyMd: "Utilitários usam escalas do tema (consistência; não se escolhe qualquer valor), alcançam estados, tamanhos de tela, modo escuro e pseudo-elementos (hover:, md:, dark: — impossíveis em style), e geram CSS real com seletores de classe de baixa especificidade, organizados em camadas. Num projeto grande, isso mantém o CSS estável (não cresce com o número de componentes), evita disputas de especificidade e mantém as mudanças locais ao elemento.",
    rubricMd: "Cita escala/consistência; cita variantes (estados/responsivo/dark) que style não alcança; cita CSS gerado/especificidade/camadas; liga a CSS que não cresce em projeto grande.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "beginner",
    promptMd: "Ache o risco nesta configuração de um projeto que acabou de migrar para a v4:\n\n```js\n// postcss.config.js\nexport default { plugins: { tailwindcss: {}, autoprefixer: {} } };\n```\n\n```ts\n// vite.config.ts\nplugins: [react(), tailwindcss()] // de @tailwindcss/vite\n```",
    answerKeyMd: "Há dois motores Tailwind processando o mesmo CSS: o plugin PostCSS da v3 (`tailwindcss` no postcss.config) e o plugin Vite da v4. Classes novas podem não ser geradas, o Preflight pode duplicar e o resultado fica inconsistente. Remova o postcss.config antigo (a v4 também dispensa autoprefixer) e mantenha só `@tailwindcss/vite`, ou use `@tailwindcss/postcss` sem o plugin Vite.",
    points: 20,
  },
];

export const TAILWIND_BOOK_01_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Por que `` `bg-${cor}-600` `` não funciona no Tailwind?", backMd: "O Tailwind gera CSS só para classes encontradas inteiras no código-fonte. Mapeie os valores para nomes completos (ex.: um objeto com `bg-red-600` e `bg-green-600`)." },
  { nodeTitle: NODE, frontMd: "Onde fica a configuração do Tailwind v4?", backMd: "No CSS de entrada: `@import \"tailwindcss\";` seguido de `@theme`, `@utility`, `@custom-variant` e `@source`. Não há tailwind.config.js obrigatório." },
  { nodeTitle: NODE, frontMd: "Por que utilitários vencem estilos de componentes sem `!important`?", backMd: "O CSS é organizado em camadas de cascata (theme, base, components, utilities); uma camada posterior vence a anterior independentemente da especificidade." },
  { nodeTitle: NODE, frontMd: "O que significa `p-17` na v4?", backMd: "17 × `--spacing` (0,25rem por padrão) = 4,25rem. A escala de espaçamento é contínua: qualquer número é múltiplo da unidade base." },
];
