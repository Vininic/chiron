// Tailwind CSS v4, reescrita autoral (PLANO.md §R.2) — capítulo 12.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "O build: fontes, plugins e integrações";

export const TAILWIND_BOOK_12: ContentChapter = {
  title: NODE,
  level: "avancado",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Como o Tailwind encontra as classes",
      order: 0,
      blocks: [
        prose([
          "Ao longo do livro, uma regra apareceu várias vezes: classes precisam estar escritas por extenso no código. Este capítulo explica o mecanismo por trás dela, porque entendê-lo resolve quase todos os mistérios de \"a classe está no HTML mas não tem efeito\" e permite controlar o build em projetos que fogem do padrão.",
          "",
          "O Tailwind não interpreta o seu código. Ele não sabe o que é um componente React, um template Blade ou uma string em Python. O que ele faz é **ler os arquivos do projeto como texto puro** e separar o conteúdo em fragmentos que poderiam ser nomes de classe — sequências de caracteres sem espaços nem aspas, com as regras de colchetes e parênteses dos valores arbitrários. Para cada fragmento, ele pergunta ao motor: isto é um utilitário válido? Se for, a regra correspondente entra no CSS final. Se não for — a maioria dos fragmentos, como nomes de variáveis, palavras de texto, pedaços de código —, é simplesmente ignorado.",
          "",
          "Duas consequências decorrem disso. A primeira é a que já conhecemos: uma classe montada em tempo de execução (`` `bg-${cor}-600` ``) nunca aparece inteira no texto do arquivo, então nunca é encontrada. O detector vê `bg-`, `cor` e `-600`, nenhum dos quais é uma classe. A segunda é menos óbvia: **falsos positivos são inofensivos**. Se um texto num arquivo contém a palavra \"block\" ou \"flex\", a classe correspondente entra no CSS mesmo sem ser usada como classe. Isso custa alguns bytes e nada mais — e é o preço de um detector simples, rápido e que funciona com qualquer linguagem.",
          "",
          "Na v4, essa varredura é **automática**. Não existe mais a lista `content` da configuração da v3, em que era preciso enumerar os caminhos dos arquivos. O Tailwind parte da pasta do projeto e varre tudo, com algumas exclusões sensatas: arquivos e pastas listados no `.gitignore` (o que já exclui `node_modules`, pastas de build e arquivos gerados na maioria dos projetos), arquivos binários (imagens, vídeos, fontes), arquivos CSS e arquivos de bloqueio de dependências. Para a grande maioria dos projetos, isso significa zero configuração: você cria um componente novo numa pasta nova, e as classes dele aparecem no CSS sem nenhum ajuste.",
          "",
          "O ponto de partida da varredura é a pasta de trabalho em que a ferramenta de build roda — normalmente a raiz do projeto. Em projetos com estrutura incomum, ele pode ser ajustado na própria importação: `@import \"tailwindcss\" source(\"../src\");` faz a varredura começar em `src`, relativo ao arquivo CSS. Isso é útil em monorepos, quando o CSS de um app mora numa pasta e o build roda a partir da raiz do repositório: sem o ajuste, o Tailwind varreria todos os pacotes do monorepo, gerando CSS para classes de outros apps.",
          "",
          "A exclusão pelo `.gitignore` tem um efeito colateral que vale guardar. Se um arquivo que contém classes for gerado durante o build e estiver no `.gitignore` — HTML pré-renderizado, componentes gerados por uma ferramenta —, ele será ignorado, e as classes que só existem nele não terão CSS. A próxima seção mostra como incluir explicitamente fontes que a detecção automática deixaria de fora.",
          "",
          "Também é útil saber o que acontece em desenvolvimento. Com o servidor do Vite ou o modo de observação da CLI, o Tailwind reage a cada arquivo salvo: varre só o que mudou, acrescenta as classes novas e atualiza o CSS em milissegundos. Classes removidas do código continuam no CSS de desenvolvimento até o próximo build completo, o que não afeta o resultado de produção.",
        ]),
        code("css", [
          "/* apps/painel/src/app.css, num monorepo com vários apps */",
          "@import \"tailwindcss\" source(\"../\");",
        ], "A varredura começa na pasta do app, não na raiz do monorepo"),
        code("html", [
          "<!-- detectadas: escritas por extenso no arquivo -->",
          "<div class=\"flex items-center gap-2 rounded-lg bg-emerald-100 px-2 text-emerald-800\">Pago</div>",
          "",
          "<!-- também detectada: o texto contém \"hidden\" e vira classe, inofensivamente -->",
          "<p class=\"text-sm text-slate-600\">O campo fica hidden até a reserva ser confirmada.</p>",
        ], "Tudo o que parece classe e existe no motor entra no CSS, inclusive palavras soltas de texto"),
        prose([
          "No monorepo, o `source(\"../\")` faz a varredura começar em `apps/painel`, a pasta acima do CSS. Classes usadas só em `apps/financeiro` não entram no CSS do painel. Sem o ajuste, com o build rodando a partir da raiz, o CSS do painel incluiria as classes de todos os apps — nada quebraria, mas o arquivo ficaria maior a cada app acrescentado.",
          "",
          "No segundo exemplo, a palavra \"hidden\" no meio do texto do parágrafo também é encontrada pelo detector, e a regra `.hidden { display: none }` entra no CSS final, mesmo que nenhum elemento a use como classe. Não há efeito visual nenhum: a regra existe, mas só se aplica a elementos que tenham a classe. Esse é o tipo de falso positivo que o modelo de detecção aceita em troca de funcionar com qualquer linguagem e qualquer sistema de templates.",
        ]),
        porque([
          "Ler os arquivos como texto e perguntar ao motor fragmento por fragmento torna a detecção independente de linguagem e framework, e explica por que classes precisam aparecer por extenso. A varredura automática com exclusões pelo `.gitignore` dispensa configuração na maioria dos projetos, e `source()` ajusta o ponto de partida quando a estrutura foge do comum.",
        ]),
        quebraria([
          "Um site estático gera páginas HTML a partir de Markdown numa pasta `dist/`, listada no `.gitignore`. Os componentes de destaque usados só nos artigos — escritos em Markdown com classes — aparecem sem estilo em produção, porque o único lugar em que as classes existiam por extenso era o HTML gerado, que a varredura ignora.",
        ]),
      ],
    },
    {
      title: "Controlando as fontes com @source",
      order: 1,
      blocks: [
        prose([
          "A detecção automática cobre a maioria dos casos, mas não todos. Os três ajustes mais comuns são: incluir uma pasta que a varredura ignoraria, excluir uma pasta que ela varreria sem necessidade, e desligar a detecção automática para listar as fontes explicitamente. Os três são feitos com a diretiva `@source`, no CSS principal.",
          "",
          "**Incluir** é necessário principalmente para bibliotecas de componentes instaladas como dependência. Uma biblioteca interna da empresa, publicada como pacote e escrita com Tailwind, traz seus componentes dentro de `node_modules` — que está no `.gitignore` e, portanto, fora da varredura. As classes dos botões da biblioteca nunca aparecem no CSS do app, e os componentes aparecem sem estilo. `@source \"../node_modules/@empresa/ui\";` acrescenta a pasta à varredura. O caminho é relativo ao arquivo CSS. O mesmo vale para arquivos gerados que estejam no `.gitignore`: `@source \"../dist/artigos\";` resolve o caso da seção anterior.",
          "",
          "**Excluir** com `@source not` serve para pastas que a varredura incluiria sem necessidade: código legado que não usa mais Tailwind, uma pasta de protótipos, documentação com muitos exemplos de classes que não devem entrar no CSS de produção, fixtures de teste. `@source not \"./legado\";` tira a pasta da varredura. Isso reduz o tamanho do CSS final e, em projetos grandes, acelera o build.",
          "",
          "**Desligar a detecção automática** é feito na importação, com `source(none)`: `@import \"tailwindcss\" source(none);`. A partir daí, nada é varrido até que diretivas `@source` digam o que varrer. Essa forma faz sentido quando o projeto tem uma estrutura em que a detecção automática erra mais do que acerta — um repositório enorme com vários sistemas, em que só uma pasta pequena usa Tailwind —, ou quando se quer controle total e explícito do que entra no CSS, à moda da lista `content` da v3.",
          "",
          "Os caminhos de `@source` aceitam padrões com curingas (`@source \"../templates/**/*.blade.php\";`), mas na maioria dos casos uma pasta basta: o Tailwind varre todos os arquivos dentro dela, respeitando as mesmas exclusões de binários e CSS. Prefira pastas a padrões elaborados; padrões tendem a deixar de fora a extensão nova que alguém acrescentou ao projeto um ano depois.",
          "",
          "Em monorepos, a combinação mais comum é `source()` apontando para o próprio app e um `@source` para cada pacote interno de componentes que o app usa. Assim, o CSS de cada app contém exatamente as classes do app mais as dos componentes compartilhados que ele importa, e nada dos outros apps.",
          "",
          "Um cuidado: `@source` não faz o Tailwind entender nada novo, só ler mais arquivos. Se a biblioteca incluída monta classes por interpolação, as classes continuam invisíveis, não importa quantas pastas sejam acrescentadas. E incluir pastas grandes demais — `node_modules` inteiro, por exemplo — torna o build lento e o CSS cheio de falsos positivos vindos do código de terceiros.",
          "",
          "Para conferir o que a varredura está lendo, a forma mais direta é procurar no CSS gerado uma classe que só existe no arquivo em questão: se ela não aparece, o arquivo está fora das fontes.",
        ]),
        code("css", [
          "/* apps/painel/src/app.css */",
          "@import \"tailwindcss\" source(\"../\");",
          "",
          "@source \"../../../packages/ui/src\";          /* componentes compartilhados do monorepo */",
          "@source \"../node_modules/@empresa/graficos\";  /* biblioteca interna publicada como pacote */",
          "@source \"../dist/artigos\";                   /* HTML gerado, listado no .gitignore */",
          "@source not \"./legado\";                      /* telas antigas que não usam Tailwind */",
        ], "Ponto de partida do app, pacotes incluídos, HTML gerado incluído e uma pasta legada excluída"),
        code("css", [
          "/* um repositório grande em que só a pasta do portal usa Tailwind */",
          "@import \"tailwindcss\" source(none);",
          "",
          "@source \"../portal/templates\";",
          "@source \"../portal/static/js\";",
        ], "Detecção automática desligada: só as fontes listadas são varridas"),
        prose([
          "No primeiro bloco, o CSS do painel parte da pasta do app, acrescenta os componentes compartilhados do monorepo e a biblioteca de gráficos instalada em `node_modules`, inclui o HTML gerado que o `.gitignore` esconderia, e exclui as telas legadas. Cada linha resolve um dos casos desta seção.",
          "",
          "As quatro formas são fáceis de observar com a CLI do Tailwind num projeto mínimo: uma classe que existe só num arquivo listado no `.gitignore` fica fora do CSS; uma pasta acrescentada com `@source` passou a contribuir; uma pasta com `@source not` deixou de contribuir mesmo estando dentro do projeto; e com `source(none)` só as classes das pastas listadas apareceram. Repetir esse teste no próprio projeto — procurar no CSS gerado uma classe que só existe em determinado arquivo — é a forma mais rápida de diagnosticar um componente sem estilo.",
        ]),
        porque([
          "`@source` acrescenta ao build o que a detecção automática não vê (pacotes, arquivos gerados), `@source not` retira o que não precisa estar lá, e `source(none)` troca a detecção por uma lista explícita. Os três ajustes ficam no CSS principal, ao lado do tema, e resolvem a maioria dos casos de componentes sem estilo vindos de outras pastas.",
        ]),
        quebraria([
          "Uma empresa publica sua biblioteca de componentes como pacote npm. O primeiro app que a adota aparece com todos os botões e campos sem estilo: as classes estão nos arquivos da biblioteca, dentro de `node_modules`, fora da varredura. A equipe da biblioteca passa a distribuir um CSS pré-compilado, que duplica o Preflight e o tema e conflita com o CSS do app, quando uma linha de `@source` teria resolvido.",
        ]),
      ],
    },
    {
      title: "Gerar o que não está no código: @source inline",
      order: 2,
      blocks: [
        prose([
          "Há classes que nunca aparecem em nenhum arquivo do projeto, porque vêm de fora dele: o conteúdo de um CMS, em que editores escolhem a cor de um destaque entre algumas opções; uma configuração salva no banco de dados com as classes de cada tipo de etiqueta; um sistema de templates que monta páginas a partir de dados. Para essas classes, nenhuma varredura de arquivos funciona. A v4 resolve com `@source inline()`, que declara diretamente, no CSS, classes que devem ser geradas.",
          "",
          "A forma simples é uma lista separada por espaços: `@source inline(\"bg-emerald-100 text-emerald-800\");` garante que as duas classes existam no CSS final, usadas ou não no código. É o equivalente da opção `safelist` da v3, com a diferença de morar no CSS.",
          "",
          "Listas grandes ficam ilegíveis rápido, e por isso `@source inline()` aceita **expansão de chaves**, como no terminal. `bg-{emerald,amber,rose}-100` gera as três classes; `bg-{emerald,amber,rose}-{100,800}` gera as seis combinações. Variantes também podem ser expandidas, e uma opção vazia representa \"sem variante\": `{hover:,}bg-sky-{500,600}` gera `bg-sky-500`, `bg-sky-600`, `hover:bg-sky-500` e `hover:bg-sky-600`. Intervalos numéricos com passo são aceitos: `{100..900..100}` expande para 100, 200, até 900. Com isso, a paleta inteira de fundos de três famílias, com hover, cabe numa linha.",
          "",
          "O inverso também existe: `@source not inline()` impede que classes específicas sejam geradas, mesmo que apareçam no código. O uso típico é bloquear falsos positivos indesejados — uma palavra comum num conteúdo que coincide com uma classe — ou garantir que classes proibidas pelo design system não entrem no CSS, mesmo que alguém as escreva.",
          "",
          "O cuidado com `@source inline()` é o tamanho. Cada classe declarada entra no CSS final, usada ou não, e a expansão de chaves facilita gerar centenas de classes com uma linha. `{hover:,focus:,}{bg,text,border}-{red,orange,amber,yellow,lime,green,emerald,teal,cyan,sky,blue,indigo,violet,purple,fuchsia,pink,rose}-{50..950..50}` gera milhares de regras. Declare só o conjunto que o conteúdo externo realmente pode usar — e, idealmente, restrinja esse conjunto no próprio CMS, oferecendo aos editores uma lista fechada de opções em vez de um campo livre.",
          "",
          "Para dar uma ideia de escala: um CSS com o Preflight, as variáveis de tema usadas e algumas dezenas de utilitários fica em torno de 4,5 KB minificado e 1,6 KB comprimido, medido com a CLI do Tailwind 4.3 num projeto mínimo. Projetos reais grandes costumam ficar entre 10 e 30 KB comprimidos. Uma linha de `@source inline()` descuidada pode, sozinha, dobrar esse número.",
          "",
          "Uma alternativa a considerar antes de recorrer a `inline()` é a técnica do capítulo de variáveis: se o conteúdo externo traz uma **cor** (e não uma classe), uma classe estática que lê uma variável CSS (`bg-(--cor-destaque)/10`) cobre qualquer cor sem gerar classes extras. `@source inline()` é para quando o conteúdo externo traz nomes de classe prontos, que não podem ser mudados.",
        ]),
        code("css", [
          "@import \"tailwindcss\";",
          "",
          "/* destaques que os editores do CMS podem escolher */",
          "@source inline(\"{hover:,}bg-{emerald,amber,rose}-{100,200}\");",
          "@source inline(\"text-{emerald,amber,rose}-800 border-{emerald,amber,rose}-300\");",
          "",
          "/* a palavra aparece nos textos de ajuda e não deve virar regra */",
          "@source not inline(\"container\");",
        ], "Doze classes de fundo com e sem hover, seis de texto e borda, e um falso positivo bloqueado"),
        code("html", [
          "<!-- HTML vindo do CMS, nunca presente nos arquivos do projeto -->",
          "<aside class=\"rounded-lg border border-amber-300 bg-amber-100 p-4 text-amber-800 hover:bg-amber-200\">",
          "  As salas do terceiro andar estarão em manutenção na sexta-feira.",
          "</aside>",
        ], "As classes existem no CSS porque @source inline as declarou"),
        prose([
          "A primeira linha de `@source inline()` expande para doze classes: três famílias, dois tons, com e sem `hover:`. A segunda acrescenta texto e borda das três famílias. O aviso vindo do CMS usa uma combinação dessas classes e aparece estilizado, embora nenhum arquivo do projeto contenha `bg-amber-100`. No CSS gerado, `hover:bg-emerald-200` aparece ao lado das versões sem variante.",
          "",
          "O `@source not inline(\"container\")` resolve um caso real de falso positivo: a palavra \"container\" aparece em textos de ajuda do projeto, e sem o bloqueio a classe `container`, com suas cinco media queries, entraria no CSS sem que nenhum elemento a usasse.",
          "",
          "Os dois comportamentos são fáceis de observar com a CLI: um arquivo com a frase \"Use o container de ajuda\" basta para a regra `.container` aparecer no CSS gerado, e com `@source not inline(\"container\")` ela some. Do mesmo jeito, a expansão `bg-sky-{100..900..200}` gera exatamente os tons 100, 300, 500, 700 e 900, pulando os intermediários. Gerar o CSS e procurar a classe leva um minuto e vale mais que qualquer suposição sobre o que entra no CSS de produção.",
        ]),
        porque([
          "`@source inline()` gera classes que vêm de fora do código, com expansão de chaves para variantes, famílias e intervalos, e `@source not inline()` bloqueia as indesejadas. Declarar só o conjunto que o conteúdo externo pode usar mantém o CSS pequeno; quando o dado externo é uma cor, variáveis CSS dispensam a lista inteira.",
        ]),
        quebraria([
          "Para \"não ter mais problemas com o CMS\", alguém declara `@source inline(\"{hover:,focus:,}{bg,text,border}-{red,orange,amber,yellow,lime,green,emerald,teal,cyan,sky,blue,indigo,violet,purple,fuchsia,pink,rose,slate,gray}-{50..950..50}\")`. O CSS de produção passa de 18 KB para mais de 400 KB comprimidos, e a pontuação de desempenho do site no celular despenca.",
        ]),
      ],
    },
    {
      title: "Plugins, integrações e convivência com outro CSS",
      order: 3,
      blocks: [
        prose([
          "O último assunto do build é como estender o Tailwind com plugins e como encaixá-lo nas ferramentas do projeto — inclusive em projetos que já têm outro CSS e não podem ter conflitos.",
          "",
          "**Plugins** são carregados no CSS com a diretiva `@plugin`. Os oficiais mais usados são `@tailwindcss/typography`, que acrescenta as classes `prose` para estilizar blocos de texto vindos de CMS e Markdown (citado nos capítulos de estados e de componentes), e `@tailwindcss/forms`, que dá aos controles de formulário uma base neutra e fácil de estilizar. `@plugin \"@tailwindcss/typography\";` basta para ter `prose`, `prose-slate`, `lg:prose-lg` e as demais variações disponíveis.",
          "",
          "Plugins **próprios** são arquivos JavaScript que usam a função `plugin` do pacote `tailwindcss/plugin` e recebem uma API com funções como `addUtilities` (utilitários estáticos), `matchUtilities` (utilitários com valores, como `destaque-amber-200`), `addVariant` (variantes) e `theme` (leitura dos valores do tema). Na v4, boa parte do que exigia um plugin pode ser feita em CSS, com `@utility` e `@custom-variant`, e essa deve ser a primeira opção. Plugins em JavaScript continuam úteis quando a geração depende de lógica — percorrer o tema e produzir um utilitário para cada cor com uma transformação, por exemplo — ou quando um plugin existente da comunidade resolve o problema. Eles são carregados com `@plugin \"./plugins/destaque.js\";`, caminho relativo ao CSS.",
          "",
          "Projetos migrados da v3 podem continuar usando o arquivo de configuração JavaScript com a diretiva `@config \"./tailwind.config.js\";`. Ela carrega o tema, os plugins e as demais opções do arquivo antigo, o que permite migrar aos poucos. Algumas opções da v3 não são suportadas por esse caminho, como `corePlugins` e `safelist` (substituída por `@source inline()`), e o objetivo de longo prazo deve ser mover a configuração para o CSS.",
          "",
          "Quanto às **integrações**, a v4 oferece três formas de rodar. O plugin do Vite (`@tailwindcss/vite`) é a mais rápida e a recomendada para projetos com Vite, incluindo React, Vue, Svelte e frameworks construídos sobre ele; ele entra no `vite.config.ts` e não exige mais nada. O plugin do PostCSS (`@tailwindcss/postcss`) serve para ferramentas que usam PostCSS, como o Next.js. E a CLI (`@tailwindcss/cli`) gera o CSS a partir da linha de comando, para projetos sem ferramenta de build: `npx @tailwindcss/cli -i src/app.css -o dist/app.css --watch` em desenvolvimento, `--minify` para produção. Nas três, o CSS sai com prefixos de fabricante e aninhamento resolvidos, porque a v4 integra o processamento que antes exigia `autoprefixer` e `postcss-nesting` à parte.",
          "",
          "**Convivência com outro CSS** é o último caso. Um sistema legado com Bootstrap, uma página que embute um widget com CSS próprio, uma migração gradual: em todos, as classes do Tailwind podem colidir com classes existentes (`.container`, `.hidden`, `.flex`). A opção `prefix` da importação resolve: `@import \"tailwindcss\" prefix(tw);` faz todos os utilitários exigirem o prefixo, escrito como uma variante no início da classe — `tw:flex`, `tw:hover:bg-sky-700`. Classes sem prefixo deixam de ser geradas, e as variáveis do tema também ganham o prefixo (`--tw-color-sky-700`), para não colidir com variáveis do outro CSS. Com `prefix(tw)`, `tw:flex` gera CSS e `flex` não gera nada.",
          "",
          "E as camadas de cascata ajudam na mesma direção: como todo o CSS do Tailwind fica dentro de `@layer`, CSS legado escrito fora de camadas vence os utilitários automaticamente, o que pode ser exatamente o desejado durante uma migração — ou exatamente o problema, como o capítulo de componentes mostrou. A próxima etapa, migrar um projeto inteiro da v3 para a v4, é o assunto do capítulo seguinte.",
        ]),
        code("js", [
          "// plugins/destaque.js",
          "const plugin = require(\"tailwindcss/plugin\");",
          "",
          "// destaque-{cor}: uma faixa de marca-texto embaixo do texto, para toda cor do tema",
          "module.exports = plugin(function ({ matchUtilities, theme }) {",
          "  matchUtilities(",
          "    { destaque: (valor) => ({ \"box-shadow\": `inset 0 -0.4em 0 ${valor}` }) },",
          "    { values: theme(\"colors\"), type: \"color\" },",
          "  );",
          "});",
        ], "Um plugin próprio com matchUtilities, que gera um utilitário para cada cor do tema"),
        code("css", [
          "@import \"tailwindcss\";",
          "",
          "@plugin \"@tailwindcss/typography\";",
          "@plugin \"./plugins/destaque.js\";",
        ], "Plugin oficial e plugin próprio carregados no CSS"),
        code("html", [
          "<article class=\"prose prose-slate lg:prose-lg\">",
          "  <h2>Regras de uso das salas</h2>",
          "  <p>Reservas podem ser feitas com até <span class=\"destaque-amber-200\">30 dias de antecedência</span>.</p>",
          "</article>",
        ], "Classes do plugin oficial e do plugin próprio, funcionando com variantes"),
        code("ts", [
          "// apps/painel/vite.config.ts",
          "import { defineConfig } from \"vite\";",
          "import react from \"@vitejs/plugin-react\";",
          "import tailwindcss from \"@tailwindcss/vite\";",
          "",
          "export default defineConfig({",
          "  root: __dirname,",
          "  plugins: [react(), tailwindcss()],",
          "  server: { host: true }, // abre na rede local, para conferir no celular",
          "});",
        ], "A integração com o Vite num app do monorepo: o plugin do Tailwind e nada mais de CSS"),
        code("css", [
          "/* página legada com Bootstrap: o Tailwind entra prefixado */",
          "@import \"tailwindcss\" prefix(tw);",
        ], "Com prefix(tw), só classes como tw:flex são geradas"),
        prose([
          "O plugin próprio e o oficial foram carregados e executados de verdade na verificação deste capítulo: `prose`, `prose-slate` e `lg:prose-lg` vêm do `@tailwindcss/typography`, e `destaque-amber-200` vem do `matchUtilities`, que percorreu todas as cores do tema. Uma classe como `destaque-naoexiste` não gera nada, porque não há cor com esse nome. Repare que o plugin próprio poderia ser escrito como `@utility destaque-*` com `--value(--color-*)`, no CSS; ele está em JavaScript aqui para mostrar a API, que é o caminho quando a lógica não cabe em CSS.",
          "",
          "O `vite.config.ts` do app do monorepo mostra como é pequena a integração: o plugin do Tailwind ao lado do plugin do React, com `root` fixado na pasta do app — o que, junto do `source(\"../\")` da primeira seção, mantém a varredura dentro dele — e `server.host` para abrir o servidor na rede local e conferir a interface num celular, como o capítulo de responsividade recomendou. O CSS principal com `@import \"tailwindcss\"` é importado pelo código da aplicação (`import \"./app.css\"` no ponto de entrada), e o resto acontece sozinho.",
        ]),
        porque([
          "`@plugin` carrega plugins oficiais e próprios no CSS, `@config` mantém configurações da v3 durante a migração, e as integrações com Vite, PostCSS e CLI cobrem qualquer ferramenta de build. `prefix()` e as camadas de cascata permitem que o Tailwind conviva com CSS existente sem colisões.",
        ]),
        quebraria([
          "Uma equipe adiciona Tailwind a uma página que já usa Bootstrap, sem prefixo. A classe `.container` do Tailwind, com larguras máximas diferentes, passa a competir com a do Bootstrap, e `.hidden` muda de comportamento. Páginas que funcionavam há anos ficam com o conteúdo desalinhado, e o rollback leva o dia inteiro.",
        ]),
      ],
    },
  ],
};

export const TAILWIND_BOOK_12_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "advanced",
    promptMd: "Os componentes de uma biblioteca interna, instalada como pacote e escrita com Tailwind, aparecem sem estilo no app:\n\n```css\n/* src/app.css */\n@import \"tailwindcss\";\n```\n\nO que falta?",
    choices: [
      "`@source \"../node_modules/@empresa/ui\";`, porque node_modules está no .gitignore e fica fora da varredura automática",
      "`@plugin \"@empresa/ui\";`",
      "`@import \"@empresa/ui/tailwind.css\" source(none);`",
      "Nada: a v4 varre node_modules automaticamente",
    ],
    answerKeyMd: "`@source \"../node_modules/@empresa/ui\";`, porque node_modules está no .gitignore e fica fora da varredura automática",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "advanced",
    promptMd: "Explique como o Tailwind decide quais classes gerar, por que isso exige classes escritas por extenso e por que falsos positivos não são um problema. Diga também o que fica de fora da varredura automática da v4.",
    answerKeyMd: "Ele lê os arquivos do projeto como texto, separa fragmentos que poderiam ser classes e pergunta ao motor se cada um é um utilitário válido; os válidos entram no CSS. Uma classe montada em tempo de execução nunca aparece inteira no texto, então não é encontrada. Falsos positivos (uma palavra como 'hidden' num texto) só acrescentam uma regra que não se aplica a nenhum elemento, custando bytes, não comportamento. Ficam de fora: arquivos e pastas do .gitignore (node_modules, builds, arquivos gerados), binários, arquivos CSS e lockfiles; o ponto de partida é a pasta de trabalho, ajustável com source().",
    rubricMd: "Descreve a leitura como texto e a consulta ao motor; liga isso à exigência de classes por extenso; explica a inocuidade dos falsos positivos; lista ao menos .gitignore e binários/CSS como exclusões.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "O CMS permite que editores escolham destaques nas cores emerald, amber e rose, com fundo nos tons 100 e 200 (e hover no 200) e texto no tom 800. Escreva as diretivas que garantem essas classes no CSS sem listar cada uma:\n\n```css\n@import \"tailwindcss\";\n/* suas diretivas */\n```",
    answerKeyMd: "```css\n@import \"tailwindcss\";\n\n@source inline(\"bg-{emerald,amber,rose}-{100,200} hover:bg-{emerald,amber,rose}-200\");\n@source inline(\"text-{emerald,amber,rose}-800\");\n```\n\nA expansão de chaves gera as combinações; uma alternativa é `{hover:,}bg-{emerald,amber,rose}-{100,200}`, que gera também `hover:bg-*-100`. Declarar só o que o CMS oferece mantém o CSS pequeno.",
    points: 20,
  },
];

export const TAILWIND_BOOK_12_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "O que a varredura automática da v4 ignora?", backMd: "Arquivos do .gitignore (node_modules, builds, gerados), binários, arquivos CSS e lockfiles." },
  { nodeTitle: NODE, frontMd: "Como incluir e excluir pastas da varredura?", backMd: "`@source \"../node_modules/@empresa/ui\";` inclui; `@source not \"./legado\";` exclui; `source(none)` na importação desliga a detecção." },
  { nodeTitle: NODE, frontMd: "Qual o substituto da `safelist` da v3?", backMd: "`@source inline(\"{hover:,}bg-{red,green}-{100,500}\")`, com expansão de chaves; `@source not inline()` bloqueia classes." },
  { nodeTitle: NODE, frontMd: "Como fazer o Tailwind conviver com o Bootstrap sem colisões?", backMd: "`@import \"tailwindcss\" prefix(tw);`: só classes como `tw:flex` são geradas, e as variáveis ganham o prefixo (--tw-*)." },
];
