// Tailwind CSS v4, reescrita autoral (PLANO.md §R.2) — capítulo 2.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Espaçamento, tipografia, cor e superfície";

export const TAILWIND_BOOK_02: ContentChapter = {
  title: NODE,
  level: "basico",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Espaçamento: preenchimento, margem e gap",
      order: 0,
      blocks: [
        prose([
          "Quase toda decisão de layout é uma decisão de espaço: quanto ar dentro de um elemento, quanta distância entre ele e os vizinhos. O Tailwind dá três ferramentas para isso, e escolher a certa em cada caso é o que separa um layout que se mantém de pé de um que desmorona na primeira mudança.",
          "",
          "**Preenchimento** (`p-*`, *padding*) é o espaço dentro do elemento, entre a borda e o conteúdo. Ele faz parte do elemento: aumenta a área clicável de um botão, recebe a cor de fundo, conta para o tamanho total (com o `box-sizing: border-box` que o Preflight aplica a tudo). **Margem** (`m-*`) é o espaço fora do elemento, empurrando os vizinhos. E **gap** (`gap-*`) é o espaço que um contêiner flex ou grid coloca **entre** seus filhos, definido no pai.",
          "",
          "A distinção prática mais importante é entre margem e gap. Margens são uma decisão de cada filho sobre o próprio entorno; gap é uma decisão do pai sobre o espaçamento do grupo. Quando você monta uma lista de cards com `mb-4` em cada card, o último card também ganha margem embaixo (que precisa ser removida com `last:mb-0`), e cada card precisa \"saber\" que está numa lista. Com `flex flex-col gap-4` no contêiner, o espaçamento aparece só entre os cards, nunca nas pontas, e os cards não precisam saber nada sobre onde estão — podem ser reaproveitados em qualquer outro lugar. Por isso a regra moderna é: **espaço entre irmãos, use gap no pai**; margem fica para ajustes pontuais de um elemento em relação ao contexto.",
          "",
          "Existem também os utilitários `space-x-*` e `space-y-*`, que aplicam margem a todos os filhos menos um e foram a solução antes de `gap` funcionar em flexbox em todos os navegadores. Eles ainda existem, mas têm armadilhas: dependem da ordem dos filhos no DOM, quebram com filhos ocultos e não funcionam bem quando os itens quebram de linha. Num contêiner flex ou grid, `gap` é sempre a melhor escolha.",
          "",
          "Toda essa família usa a mesma escala, derivada de `--spacing` (0,25rem por padrão): `p-1` é 0,25rem, `p-4` é 1rem, `p-8` é 2rem. Usar sempre a mesma escala para preenchimento, margem, gap, largura e altura é o que dá ritmo visual a uma interface — os espaços se relacionam entre si porque são múltiplos da mesma unidade. Uma consequência útil: mudar `--spacing` no tema torna a interface inteira mais compacta ou mais arejada de uma vez, mantendo as proporções.",
          "",
          "Duas classes economizam linhas em casos comuns. `size-*` define largura e altura iguais numa classe só — `size-10` para um avatar quadrado ou um ícone. E `mx-auto` centraliza horizontalmente um bloco com largura definida, a forma clássica de centralizar o conteúdo de uma página (`mx-auto max-w-3xl`). Margens negativas (`-mt-4`) permitem sobrepor elementos de propósito, como um avatar que sobe sobre a borda de um card, e devem ser usadas com essa intenção explícita, não para compensar espaços errados em outro lugar.",
        ]),
        code("html", [
          "<!-- espaço entre irmãos definido pelo pai: nenhum card precisa saber onde está -->",
          "<ul class=\"flex flex-col gap-4\">",
          "  <li class=\"rounded-lg border border-gray-200 p-4\">Pedido #1041</li>",
          "  <li class=\"rounded-lg border border-gray-200 p-4\">Pedido #1042</li>",
          "  <li class=\"rounded-lg border border-gray-200 p-4\">Pedido #1043</li>",
          "</ul>",
        ], "gap no contêiner: espaço só entre os itens, nunca nas pontas"),
        code("html", [
          "<div class=\"mx-auto max-w-sm rounded-2xl bg-white p-6 pt-0 shadow-md\">",
          "  <img src=\"/ana.jpg\" alt=\"Ana Lima\" class=\"-mt-8 size-16 rounded-full ring-4 ring-white\" />",
          "  <h3 class=\"mt-3 text-lg font-semibold\">Ana Lima</h3>",
          "  <p class=\"mt-1 text-sm text-gray-600\">Engenharia de dados</p>",
          "</div>",
        ], "size-* para o avatar, margem negativa deliberada para sobrepor a borda do card"),
        prose([
          "No primeiro exemplo, remova o `gap-4` e coloque `mb-4` em cada `<li>`: a lista fica igual na tela, mas o último item ganha um espaço sobrando embaixo, que vai somar com o espaço do elemento seguinte da página. A versão com `gap` não tem esse problema, e trocar a lista para horizontal é trocar `flex-col` por `flex-row`, sem tocar em nenhum item.",
          "",
          "No segundo, o `-mt-8` puxa o avatar para cima, metade para fora do card, e o `ring-4 ring-white` desenha um anel branco em volta, que dá a impressão de recorte. O `pt-0` no card evita que o preenchimento superior empurre o avatar de volta para baixo. É um efeito comum em páginas de perfil, construído só com a escala de espaçamento.",
        ]),
        porque([
          "Separar preenchimento (dentro), margem (fora) e gap (entre irmãos, decidido pelo pai) dá a cada decisão de espaço um dono claro. Componentes que não carregam margem própria podem ser reaproveitados em qualquer contexto, e uma escala única faz todos os espaços conversarem entre si.",
        ]),
        quebraria([
          "Um componente `Card` é criado com `mb-6` embutido, porque na primeira tela ele aparecia numa lista. Na segunda tela, ele é usado dentro de um grid com `gap-6`, e os espaços dobram na vertical mas não na horizontal. Cada tela nova ganha um `mb-0` ou `-mb-6` para compensar, e o componente passa a carregar uma decisão de layout que pertencia ao pai.",
        ]),
      ],
    },
    {
      title: "Tipografia: tamanho, altura de linha e o texto que cabe",
      order: 1,
      blocks: [
        prose([
          "Texto é a maior parte de quase toda interface, e a tipografia é onde pequenas escolhas mais aparecem. O Tailwind organiza o assunto em poucas famílias de utilitários: tamanho (`text-*`), peso (`font-*`), altura de linha (`leading-*`), espaçamento entre letras (`tracking-*`), família (`font-sans`, `font-serif`, `font-mono`) e comportamento de quebra.",
          "",
          "A escala de tamanhos vai de `text-xs` a `text-9xl`, e cada passo já vem **pareado com uma altura de linha** adequada: `text-sm` define tamanho de 0,875rem e altura de linha proporcional, `text-4xl` define um tamanho grande com altura de linha mais justa. Isso importa porque texto grande com altura de linha generosa fica espaçado demais, e texto pequeno com altura justa fica difícil de ler. Quando o pareamento padrão não serve, a v4 aceita a forma combinada `text-tamanho/altura`: `text-base/7` é texto base com altura de linha no passo 7 (1,75rem) — útil em parágrafos longos, que se beneficiam de mais respiro.",
          "",
          "O peso vai de `font-thin` a `font-black`, mas uma interface bem resolvida costuma usar três ou quatro pesos no máximo: normal para corpo, médio para rótulos e botões, semibold ou bold para títulos. Títulos grandes também ficam melhores com o espaçamento entre letras levemente reduzido (`tracking-tight`), porque o espaçamento padrão, pensado para texto pequeno, parece frouxo em tamanhos grandes. Rótulos em caixa alta (`uppercase`) fazem o contrário e pedem `tracking-wide`.",
          "",
          "A medida da linha — quantos caracteres cabem antes de quebrar — é um dos fatores que mais afetam a legibilidade de textos longos, e o ideal fica em torno de 60 a 75 caracteres. Num layout de largura total, um parágrafo numa tela grande pode passar de 150 caracteres por linha, e o olho se perde ao voltar para o início da próxima. A solução é limitar a largura do bloco de texto: `max-w-prose` (cerca de 65 caracteres) ou um `max-w-2xl` aplicado ao contêiner do artigo.",
          "",
          "Para o que acontece quando o texto não cabe, há três ferramentas. `truncate` corta numa linha com reticências — para nomes em listas e células de tabela. `line-clamp-3` limita a três linhas com reticências na última — para resumos em cards. E as utilidades de equilíbrio da quebra: `text-balance` distribui as palavras de um título de várias linhas para que as linhas tenham tamanhos parecidos (evitando uma palavra sozinha na última), e `text-pretty` evita palavras órfãs no fim de parágrafos. As duas são implementadas pelo próprio navegador (`text-wrap: balance` e `pretty`).",
          "",
          "Um detalhe que o capítulo de layout retoma: `truncate` só funciona se o elemento tiver uma largura limitada. Dentro de um item flex, o filho, por padrão, não encolhe abaixo do tamanho do próprio conteúdo, e o texto empurra o layout em vez de ser cortado. A combinação `min-w-0` no item flex com `truncate` no texto é uma das mais usadas em interfaces reais, e o segundo exemplo a mostra numa linha de lista.",
        ]),
        code("html", [
          "<article class=\"mx-auto max-w-prose\">",
          "  <p class=\"text-xs font-medium tracking-wide text-sky-700 uppercase\">Engenharia</p>",
          "  <h1 class=\"mt-2 text-4xl font-bold tracking-tight text-balance text-gray-900\">",
          "    Como reduzimos o tempo de build de doze minutos para quarenta segundos",
          "  </h1>",
          "  <p class=\"mt-6 text-base/7 text-pretty text-gray-700\">",
          "    O primeiro passo foi medir. Sem saber onde o tempo ia, toda otimização era palpite…",
          "  </p>",
          "</article>",
        ], "Rótulo em caixa alta com tracking largo, título equilibrado, parágrafo com medida limitada"),
        code("html", [
          "<li class=\"flex items-center gap-3 py-3\">",
          "  <img src=\"/avatar.png\" alt=\"\" class=\"size-10 shrink-0 rounded-full\" />",
          "  <div class=\"min-w-0 flex-1\">",
          "    <p class=\"truncate text-sm font-medium text-gray-900\">Fernanda Albuquerque de Oliveira Campos</p>",
          "    <p class=\"line-clamp-2 text-sm text-gray-500\">Enviou o relatório trimestral com os ajustes de previsão e o anexo revisado.</p>",
          "  </div>",
          "  <time class=\"shrink-0 text-xs text-gray-400\">14:32</time>",
          "</li>",
        ], "min-w-0 no item flexível para que truncate e line-clamp funcionem"),
        prose([
          "No primeiro exemplo, `text-balance` no título faz as duas linhas terem tamanhos parecidos em qualquer largura de tela, em vez de uma linha cheia e uma palavra solta. Tire a classe e redimensione a janela para ver a diferença. O `max-w-prose` no `<article>` limita a medida de todo o texto de uma vez.",
          "",
          "No segundo, tire o `min-w-0` da `<div>` do meio: o nome longo deixa de ser cortado e empurra o horário para fora da linha. É o comportamento padrão do flexbox (`min-width: auto` nos itens), e a causa de boa parte dos \"meu truncate não funciona\" em fóruns. O `shrink-0` no avatar e no horário impede que eles encolham quando o espaço aperta.",
          "",
          "Para testar de verdade, não confie em textos de exemplo curtos. Coloque no protótipo o nome mais longo que o sistema aceita, um e-mail sem espaços e um título de três linhas, e veja o que acontece em 320px de largura. É assim que os problemas de quebra aparecem antes de chegar aos dados reais.",
        ]),
        porque([
          "Pares de tamanho e altura de linha, uma escala de pesos curta e utilitários de quebra fazem a tipografia ser consistente por padrão. Limitar a medida da linha e controlar o excesso de texto são decisões de legibilidade que cabem na própria marcação, perto do conteúdo que afetam.",
        ]),
        quebraria([
          "Uma tabela de clientes usa `truncate` nos nomes, mas a célula é um item flex sem `min-w-0`. Em produção, um cliente cadastrado com nome e sobrenome de 80 caracteres empurra todas as colunas para fora da tela, e a tabela passa a ter rolagem horizontal em todos os dispositivos. O erro só aparece quando um dado real longo entra no sistema.",
        ]),
      ],
    },
    {
      title: "Cor: a paleta, a opacidade e o contraste",
      order: 2,
      blocks: [
        prose([
          "A paleta padrão do Tailwind tem 22 famílias de cor — tons de cinza (`slate`, `gray`, `zinc`, `neutral`, `stone`) e cores (`red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`) —, cada uma com onze tons, de `50` (quase branco) a `950` (quase preto). Toda cor é usada com um prefixo de propriedade: `bg-` para fundo, `text-` para texto, `border-` para borda, `ring-`, `outline-`, `fill-`, `stroke-`, `shadow-`, `decoration-`, `accent-`, `caret-`.",
          "",
          "Na v4, as cores da paleta são definidas no espaço de cor **OKLCH**, em vez de RGB ou HSL. Isso tem duas consequências práticas. A primeira é perceptual: em OKLCH, a componente de luminosidade corresponde à claridade que o olho percebe, então o tom `500` de duas famílias diferentes tem claridade parecida, e trocar `sky` por `violet` mantém o contraste do design. A segunda é de alcance: telas modernas exibem cores além do sRGB (o espaço P3), e a paleta da v4 aproveita isso, com cores mais vivas nesses dispositivos e conversão automática nos outros.",
          "",
          "Opacidade é aplicada com uma barra: `bg-black/50` é preto a 50%, `text-sky-700/80` é o azul a 80%. Ela substitui os utilitários `bg-opacity-*` e `text-opacity-*` da v2 e v3, que **não existem mais na v4**. A barra também aceita valores arbitrários (`bg-sky-500/[0.15]`) e variáveis. O uso mais comum é derivar fundos suaves de uma cor de destaque — um badge com `bg-emerald-500/10 text-emerald-700` — sem acrescentar cores ao tema.",
          "",
          "Duas cores especiais resolvem casos frequentes. `currentColor` (nos utilitários, `-current`: `fill-current`, `border-current`) usa a cor do texto do elemento, o que faz ícones SVG seguirem a cor do texto ao redor automaticamente — um ícone dentro de um link azul fica azul, e muda junto no `hover`. E `transparent` serve para bordas e fundos que só aparecem em algum estado, sem mudar o tamanho do elemento quando aparecem.",
          "",
          "Escolher cores bonitas é a parte fácil; escolher cores **legíveis** é a parte que importa. O padrão de acessibilidade WCAG pede contraste mínimo de 4,5:1 entre texto normal e fundo (3:1 para texto grande). Como regra de bolso com a paleta do Tailwind: texto `gray-500` sobre branco fica perto do limite e não deve ser usado para informação importante; `gray-600` e `gray-700` são seguros para texto secundário; texto branco sobre cores de destaque costuma funcionar a partir do tom `600`. Ferramentas como o inspetor de cores dos navegadores mostram a razão de contraste de qualquer elemento, e vale conferi-la nas combinações principais do projeto.",
          "",
          "O próximo nível, que o capítulo de tema aprofunda, é parar de usar a paleta diretamente nos componentes e criar **cores semânticas**: em vez de `bg-sky-600` em cada botão principal, uma cor `bg-primaria` definida no tema. A paleta continua sendo a matéria-prima; os nomes semânticos dizem a função. Isso é o que permite trocar a cor da marca, ou criar um modo escuro, mudando um lugar só.",
        ]),
        code("html", [
          "<div class=\"flex flex-wrap gap-2\">",
          "  <span class=\"rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700\">Pago</span>",
          "  <span class=\"rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700\">Pendente</span>",
          "  <span class=\"rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-700\">Recusado</span>",
          "</div>",
        ], "Fundos suaves derivados da cor com /10 e texto no tom 700, legível sobre eles"),
        code("html", [
          "<a href=\"/relatorio.pdf\" class=\"inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-900\">",
          "  <svg viewBox=\"0 0 20 20\" class=\"size-4 fill-current\" aria-hidden=\"true\">",
          "    <path d=\"M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M4 15h12\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" />",
          "  </svg>",
          "  Baixar relatório",
          "</a>",
        ], "fill-current e stroke=\"currentColor\": o ícone acompanha a cor do link, inclusive no hover"),
        prose([
          "No primeiro exemplo, os três badges seguem a mesma fórmula — fundo da cor a 10%, texto no tom 700 — e por isso parecem uma família, mesmo com cores diferentes. A fórmula também garante contraste: o fundo quase branco e o texto escuro passam com folga do limite de 4,5:1.",
          "",
          "No segundo, o SVG não tem cor fixa nenhuma. Ao passar o mouse, o link muda para `sky-900`, e o ícone muda junto, porque tanto o `fill-current` quanto o `stroke=\"currentColor\"` leem a cor do texto. Ícones com cor fixa no próprio SVG são uma das fontes mais comuns de inconsistência visual em estados de hover e em modo escuro.",
          "",
          "Uma conferência rápida: abra as ferramentas do navegador, selecione o texto de um badge e veja a razão de contraste que o seletor de cor mostra. Repita com o texto secundário mais claro da página. Se algum valor ficar abaixo de 4,5, escureça um tom antes de seguir.",
        ]),
        porque([
          "Uma paleta definida em OKLCH mantém claridades comparáveis entre famílias, o que torna trocas de cor previsíveis. Opacidade como modificador da própria cor evita multiplicar tokens, e `currentColor` faz ícones herdarem a cor do contexto. O contraste, porém, continua sendo responsabilidade de quem escolhe as combinações.",
        ]),
        quebraria([
          "Um design usa `text-gray-400` para os valores numa tabela financeira porque \"fica mais elegante\". Em monitores com brilho baixo e para pessoas com visão reduzida, os números ficam praticamente ilegíveis, e o contraste de 2,9:1 reprova na auditoria de acessibilidade exigida pelo cliente, uma semana antes do lançamento.",
        ]),
      ],
    },
    {
      title: "Superfície: bordas, raios, sombras e anéis",
      order: 3,
      blocks: [
        prose([
          "Depois de espaço, texto e cor, o que define a aparência de um elemento é sua superfície: onde ele termina (bordas), a forma dos cantos (raio), a profundidade (sombra) e os contornos de destaque (anéis e *outline*). A v4 mudou alguns padrões dessa família, e vale conhecê-los tanto para escrever código novo quanto para entender por que um projeto migrado da v3 ficou diferente.",
          "",
          "**Bordas** são definidas por largura (`border`, `border-2`, `border-t`) e cor (`border-gray-200`). Na v4, a cor padrão de uma borda sem cor explícita passou a ser `currentColor` — a cor do texto — em vez do cinza claro da v3. Na prática, isso significa que `border` sozinho desenha uma borda da cor do texto, normalmente escura demais; quase sempre você quer especificar a cor junto (`border border-gray-200`). Para linhas entre itens de uma lista, `divide-y` aplica borda entre os filhos, sem borda nas pontas, com a cor definida por `divide-gray-200`.",
          "",
          "**Raios** vão de `rounded-xs` a `rounded-4xl`, mais `rounded-full` para círculos e pílulas, com variantes por canto (`rounded-t-lg`, `rounded-br-xl`). A v4 renomeou os passos menores para abrir espaço na escala: o que era `rounded-sm` virou `rounded-xs`, e o que era `rounded` virou `rounded-sm`. A mesma renomeação aconteceu com sombras e desfoques. Um projeto migrado sem ajustar esses nomes fica com cantos e sombras sutilmente diferentes — exatamente o tipo de mudança que a ferramenta de migração do capítulo 13 corrige automaticamente.",
          "",
          "**Sombras** vão de `shadow-2xs` a `shadow-2xl`, e a v4 acrescentou sombras internas (`inset-shadow-*`) e a possibilidade de colorir sombras (`shadow-sky-500/20`), útil para dar brilho a botões coloridos. A regra de design é usar sombra para indicar elevação real — um menu que flutua sobre o conteúdo, um modal — e não como decoração em todo card, o que achata a hierarquia: quando tudo flutua, nada se destaca.",
          "",
          "**Anéis** (`ring-*`) desenham um contorno com `box-shadow`, que não ocupa espaço e não mexe no layout. Na v4, o anel padrão (`ring`) tem 1px e usa `currentColor`; na v3 tinha 3px e era azul. Para destaques de foco, porém, o recomendado hoje é o **outline** (`outline-*`, `outline-offset-*`), que segue o formato arredondado do elemento, aparece no modo de alto contraste do Windows (anéis feitos com sombra somem nele) e foi pensado exatamente para indicar foco. A v4 também renomeou `outline-none` para `outline-hidden`, porque o nome antigo enganava: ele não remove o contorno, deixa-o transparente para que continue visível no modo de alto contraste.",
          "",
          "O segundo exemplo junta essa família num campo de formulário: borda neutra, raio médio, uma sombra interna discreta que dá a sensação de profundidade, e um contorno de foco visível que aparece só para quem navega por teclado (`focus-visible`), com deslocamento para não colar na borda.",
        ]),
        code("html", [
          "<ul class=\"divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white\">",
          "  <li class=\"p-4\">Notificações por e-mail</li>",
          "  <li class=\"p-4\">Notificações por push</li>",
          "  <li class=\"p-4\">Resumo semanal</li>",
          "</ul>",
          "",
          "<button class=\"mt-6 rounded-lg bg-violet-600 px-4 py-2 text-white shadow-lg shadow-violet-600/30\">",
          "  Assinar",
          "</button>",
        ], "divide-y entre itens, borda com cor explícita e uma sombra colorida pela própria cor do botão"),
        code("html", [
          "<label class=\"block\">",
          "  <span class=\"text-sm font-medium text-gray-700\">E-mail</span>",
          "  <input type=\"email\"",
          "         class=\"mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 inset-shadow-xs",
          "                outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
          "                focus-visible:outline-violet-600\" />",
          "</label>",
        ], "Campo de formulário: borda neutra, sombra interna e contorno de foco só para teclado"),
        prose([
          "No primeiro exemplo, `divide-y` desenha duas linhas — entre o primeiro e o segundo item, e entre o segundo e o terceiro —, e a borda externa do contêiner fecha a caixa. A sombra do botão, `shadow-violet-600/30`, usa a cor do próprio botão a 30%, o que dá um brilho em vez da sombra cinza neutra, que pareceria suja sob uma cor viva.",
          "",
          "No segundo, o `outline-hidden` remove o contorno padrão do navegador ao clicar com o mouse, e o `focus-visible:` traz um contorno violeta só quando o foco chega por teclado. Navegue pela página com Tab para vê-lo. Remover o contorno de foco sem substituí-lo por outro é um dos erros de acessibilidade mais comuns da web, e o capítulo 11 volta a ele.",
          "",
          "Repare também que nenhum dos dois exemplos usa sombra em tudo. A lista é uma superfície plana, separada do fundo só pela borda; a sombra fica reservada ao botão, o único elemento que pede atenção. Essa economia é o que faz a sombra continuar significando alguma coisa quando um menu ou um modal precisar flutuar de verdade.",
        ]),
        porque([
          "Bordas, raios, sombras e contornos definem forma e profundidade com escalas próprias, e as mudanças da v4 — borda com currentColor, anel de 1px, nomes de raio e sombra deslocados, `outline-hidden` — alinham os padrões com o CSS moderno e com acessibilidade. Conhecê-las evita surpresas ao migrar e ajuda a escolher a ferramenta certa para cada efeito.",
        ]),
        quebraria([
          "Um projeto migra para a v4 e todos os campos de formulário com `border` sem cor ganham bordas pretas, porque a cor padrão passou a ser a do texto. Ao mesmo tempo, os anéis de foco `ring` ficam com 1px e quase invisíveis. Ninguém percebe em telas grandes; a equipe de suporte recebe reclamações de que \"o formulário ficou pesado e não dá para saber onde se está digitando\".",
        ]),
      ],
    },
  ],
};

export const TAILWIND_BOOK_02_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "beginner",
    promptMd: "O nome longo deste item não é cortado com reticências e empurra o horário para fora da linha:\n\n```html\n<li class=\"flex gap-3\">\n  <div class=\"flex-1\"><p class=\"truncate\">Fernanda Albuquerque de Oliveira Campos</p></div>\n  <time class=\"shrink-0\">14:32</time>\n</li>\n```\n\nO que falta?",
    choices: [
      "`min-w-0` na div flexível, para que ela possa encolher abaixo do tamanho do conteúdo",
      "`overflow-x-scroll` no li",
      "`whitespace-normal` no parágrafo",
      "Trocar `truncate` por `line-clamp-1` no time",
    ],
    answerKeyMd: "`min-w-0` na div flexível, para que ela possa encolher abaixo do tamanho do conteúdo",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "beginner",
    promptMd: "Um componente `Card` foi escrito com `mb-6` embutido para funcionar numa lista. Explique por que espaço entre irmãos deve ficar no contêiner (com `gap`) e não em cada componente, e o que acontece quando esse `Card` é reaproveitado num grid.",
    answerKeyMd: "Gap é decisão do pai sobre o espaçamento do grupo; margem embutida faz o componente carregar uma decisão de layout de um contexto específico. Com mb-6 o último item ganha espaço sobrando e, num grid com gap-6, o espaçamento vertical dobra (gap + margem) enquanto o horizontal não, exigindo compensações (mb-0, margens negativas). Componentes sem margem própria são reaproveitáveis em qualquer contexto, e o pai decide com gap.",
    rubricMd: "Diz que gap pertence ao contêiner e margem embutida acopla o componente ao contexto; descreve o efeito no grid (espaço dobrado/inconsistente) ou o último item; conclui que componentes reaproveitáveis não carregam margem externa.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "beginner",
    promptMd: "Ache os problemas desta marcação escrita para a v3 e copiada num projeto v4:\n\n```html\n<input class=\"border rounded shadow-sm focus:outline-none focus:ring\">\n<span class=\"bg-green-500 bg-opacity-10 text-green-700\">Pago</span>\n```",
    answerKeyMd: "Na v4: `border` sem cor usa currentColor (borda escura) — especifique `border-gray-300`; `rounded` e `shadow-sm` mudaram de passo (equivalem a `rounded-sm`/`shadow-xs` da v4); `outline-none` foi renomeado para `outline-hidden`; `ring` passou a ter 1px e currentColor (foco quase invisível) — prefira `focus-visible:outline-2 focus-visible:outline-offset-2` com cor; `bg-opacity-10` não existe mais — use `bg-green-500/10`.",
    points: 20,
  },
];

export const TAILWIND_BOOK_02_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Margem ou gap para espaço entre itens de uma lista?", backMd: "gap no contêiner flex/grid: espaço só entre os itens, decidido pelo pai, e os itens continuam reaproveitáveis em outros contextos." },
  { nodeTitle: NODE, frontMd: "Por que `truncate` não funciona dentro de um item flex?", backMd: "Itens flex têm min-width: auto e não encolhem abaixo do conteúdo. Acrescente `min-w-0` ao item." },
  { nodeTitle: NODE, frontMd: "Como aplicar opacidade a uma cor na v4?", backMd: "Com barra: `bg-sky-600/10`, `text-black/70`. Os utilitários bg-opacity-* e text-opacity-* não existem mais." },
  { nodeTitle: NODE, frontMd: "Qual a cor padrão de `border` e `ring` na v4?", backMd: "currentColor (a cor do texto). `ring` tem 1px. Especifique sempre a cor (`border-gray-200`) e prefira outline para foco." },
];
