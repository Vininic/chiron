// OpenCode, reescrita autoral (PLANO.md §R.2) — capítulo 6.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Comandos personalizados: prompts com nome e argumentos";

export const OPENCODE_BOOK_06: ContentChapter = {
  title: NODE,
  level: "intermediario",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "O que é um comando e quais já vêm no OpenCode",
      order: 0,
      blocks: [
        prose([
          "Quem usa um agente todo dia acaba digitando as mesmas frases: \"revise as mudanças não commitadas\", \"explique este erro\", \"escreva os testes deste arquivo seguindo o padrão do projeto\". Um **comando** do OpenCode é uma dessas frases com nome. Em vez de redigir o pedido de novo, a pessoa chama o comando, e o OpenCode troca o nome pelo texto completo, com os argumentos que ela der. A vantagem não é só a economia de digitação. Um comando é um prompt revisado, guardado no repositório e igual para toda a equipe, e isso desloca o trabalho de acertar a formulação para quem o escreve uma vez, em vez de todos reinventarem uma versão pior a cada uso.",
          "",
          "Os comandos podem vir de quatro lugares: do próprio OpenCode, de arquivos markdown na pasta `.opencode/command/`, do campo `command` do `opencode.json` e, curiosamente, das **habilidades** do capítulo 7, que o servidor também lista como comandos. Para ver tudo o que está disponível num projeto, o servidor tem um ponto de consulta, `/command`, que o `curl` alcança. É o mesmo servidor do `opencode serve` do capítulo 1, e a consulta dispensa qualquer chave ou modelo: o servidor responde com a lista de comandos que carregou, cada um com o nome, a descrição, a origem (`source`), o modelo ou o agente que o comando impõe, se roda como subtarefa e os argumentos que espera.",
          "",
          "Dois comandos já vêm prontos. O `init`, que o capítulo 3 apresentou, guia a criação do `AGENTS.md`. O `review` revisa mudanças: sem argumentos olha o que não foi commitado, e aceita um commit, uma branch ou um PR como alvo. A saída da consulta mostra um traço do `review` que ainda não apareceu no livro: `\"subtask\": true`. Um comando marcado como subtarefa não roda na sessão corrente; o OpenCode abre uma sessão filha, como a ferramenta `task` do capítulo 4, entrega a ela o texto do comando e devolve só o resultado. É a escolha certa para tarefas que leem muito e concluem pouco, como uma revisão, porque o histórico da sessão principal não é poluído por dezenas de leituras de arquivo. A última seção do capítulo mostra o efeito no pedido.",
        ]),
        code("bash", [
          "$ opencode serve --port 4631 &",
          "$ curl -s http://127.0.0.1:4631/command",
        ], "Terminal: o servidor lista os comandos que carregou"),
        code("text", [
          "\"name\": \"init\",",
          "\"description\": \"guided AGENTS.md setup\",",
          "\"source\": \"command\",",
          "\"name\": \"review\",",
          "\"description\": \"review changes [commit|branch|pr], defaults to uncommitted\",",
          "\"subtask\": true,",
          "\"$ARGUMENTS\"",
          "\"source\": \"skill\",",
        ], "Saída: dois comandos embutidos e, no fim, uma habilidade que também vira comando"),
        prose([
          "Três campos da resposta merecem leitura. O primeiro é `source`: `command` para os comandos propriamente ditos e `skill` para as habilidades, o que mostra que, para o OpenCode, uma habilidade é um comando cujo texto é um documento de instruções; as habilidades têm a sua própria seção no capítulo 7. O segundo é `template`, o texto que vai ao modelo, que a consulta imprime inteiro e que é bem mais longo do que a descrição sugere. Ler o `template` de um comando embutido é uma boa fonte de ideias para escrever os seus, porque mostra como o OpenCode estrutura um pedido complexo: papel, passos, critérios, formato da resposta.",
          "",
          "O terceiro é `hints`: a lista dos marcadores que o texto usa. Todo comando que menciona `$ARGUMENTS` leva esse marcador na lista, e a interface de texto usa a lista para mostrar ao usuário quais argumentos o comando espera. Um comando sem marcadores tem a lista vazia, e a consequência prática, que a última seção deste capítulo detalha, é que os argumentos digitados depois do nome não desaparecem: são anexados ao final do texto.",
          "",
          "A consulta serve ainda de inventário. Num projeto herdado, perguntar ao servidor quais comandos existem é mais rápido do que procurar nas pastas, e pega os que vêm de lugares que a pessoa não pensaria em olhar, como a configuração do usuário. O resultado mistura o que é do OpenCode, o que é seu e o que é do projeto, e é o ponto de partida para decidir o que vale reaproveitar antes de escrever mais um.",
        ]),
        porque([
          "Um comando é um prompt com nome, guardado no repositório. Vem de embutidos, de arquivos em `.opencode/command/`, do campo `command` da configuração e das habilidades. O servidor lista todos em `/command`, com origem, modelo, agente, se é subtarefa e os marcadores de argumento.",
        ]),
        quebraria([
          "Cada pessoa da equipe tem a sua versão do pedido de revisão, num bloco de notas, e as revisões saem diferentes conforme quem pediu. Um comando versionado no repositório faria todas partirem do mesmo texto, e a melhoria feita por uma pessoa chegaria a todas.",
        ]),
      ],
    },
    {
      title: "Um comando em markdown: argumentos, saída de comandos e arquivos",
      order: 1,
      blocks: [
        prose([
          "O jeito mais direto de criar um comando é um arquivo markdown em `.opencode/command/`: o nome do arquivo é o nome do comando, o corpo é o texto que vai ao modelo, e um frontmatter opcional configura o resto. O corpo aceita três tipos de substituição, todos feitos antes do pedido sair do OpenCode. Os **argumentos** entram por marcadores: `$ARGUMENTS` é tudo o que a pessoa digitou depois do nome do comando, e `$1`, `$2` e seguintes são as palavras separadas. A **saída de um comando de shell** entra com uma crase dupla precedida de ponto de exclamação: o texto `!`git branch --show-current`` é trocado pelo que o comando imprime, o que permite ao prompt carregar informação viva, como a branch atual, o último commit ou o resultado de um teste. E um **arquivo** entra com `@caminho`: o OpenCode lê o arquivo e o anexa ao pedido.",
          "",
          "O comando `revisar` do exemplo usa os três. Ele recebe dois argumentos, o arquivo a revisar e o foco da revisão, mostra a branch corrente e anexa um arquivo de notas. O frontmatter escolhe o agente `plan`, de modo que a revisão não altere nada. Para o resultado ser previsível, o exemplo cria o repositório com `git init -b principal`, o que fixa o nome da branch, e usa palavras sem acento nos argumentos, porque o terminal do Windows nem sempre as entrega como foram digitadas.",
        ]),
        code("markdown", [
          "---",
          "description: Revisa um arquivo com um foco",
          "agent: plan",
          "---",
          "Revise o arquivo $1 com foco em $2. Argumentos completos: $ARGUMENTS",
          "Branch atual: !`git branch --show-current`",
          "Notas da equipe: @notas.txt",
        ], ".opencode/command/revisar.md: dois argumentos, a branch atual e um arquivo de notas"),
        code("text", [
          "NOTAS-DA-EQUIPE nunca revisar sem rodar os testes.",
        ], "notas.txt: o arquivo que o comando anexa"),
        code("bash", [
          "$ git init -b principal",
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run --command revisar src/app.ts desempenho",
          "$ node ver-pedido.mjs \"^Revise|^Branch|NOTAS|^Notas\"",
        ], "Terminal (modelo falso): o comando chamado com dois argumentos"),
        code("text", [
          "> plan · falso",
          "  Revise o arquivo src/app.ts com foco em desempenho. Argumentos completos: src/app.ts desempenho",
          "  Branch atual: principal",
          "  Notas da equipe: @notas.txt",
          "  NOTAS-DA-EQUIPE nunca revisar sem rodar os testes.",
        ], "Saída: o texto que chegou ao modelo, com tudo substituído"),
        prose([
          "A saída mostra o que o modelo recebeu, e cada substituição é visível. `$1` virou `src/app.ts` e `$2`, `desempenho`; `$ARGUMENTS` virou os dois juntos. A crase com ponto de exclamação foi trocada por `principal`, o resultado do `git`. E o `@notas.txt` permaneceu escrito no texto, mas o conteúdo do arquivo chegou ao modelo ao lado, como uma parte à parte da mensagem, depois de uma anotação de que a ferramenta de leitura tinha sido usada. O agente `plan` do frontmatter aparece na primeira linha, `> plan · falso`.",
          "",
          "Algumas decisões de projeto aparecem no comportamento. A saída do comando de shell é calculada **no computador de quem chama**, no diretório do projeto, antes do pedido sair: o modelo vê o resultado, não o comando, e por isso a informação serve até em agentes que não têm a ferramenta `bash`. O mesmo acontece com o arquivo anexado: sua leitura não passa pela política de permissões da ferramenta `read` que o capítulo 5 descreveu, porque quem escolheu o arquivo foi o autor do comando, não o modelo. A consequência é um cuidado de revisão: um comando que traz `!` ou `@` executa e lê coisas na máquina de quem o chama, e um comando vindo de um repositório alheio merece a mesma leitura que um script alheio.",
          "",
          "Para a equipe, isso funciona como uma pequena linguagem de modelos. O texto fixo carrega o método; os argumentos carregam a variação; a saída dos comandos e os arquivos carregam o contexto que o autor sabe ser sempre necessário. Um bom comando é aquele cujo prompt cabe numa página, tem os marcadores no lugar certo e foi testado com argumentos de verdade: o jeito de testar, como no resto do livro, é ler o pedido que o modelo recebe.",
          "",
          "Há também uma questão de higiene que o markdown facilita: como o comando é um arquivo, ele passa pelo mesmo fluxo de revisão do código. Quem altera o texto de um comando de revisão abre uma mudança, outra pessoa a lê, e o histórico do repositório responde depois à pergunta de quando e por que o prompt mudou, algo que uma frase digitada de memória nunca permite. Convém que o nome do arquivo diga o que o comando faz (`revisar`, `changelog`, `testes`), que a `description` caiba numa linha, porque é ela que aparece nas listas, e que o texto traga o papel, os passos e o formato esperado da resposta, nessa ordem.",
        ]),
        porque([
          "Um `.md` em `.opencode/command/` vira o comando de mesmo nome. `$1`, `$2` e `$ARGUMENTS` trazem os argumentos, a crase com `!` traz a saída de um comando de shell, `@caminho` anexa um arquivo, e o frontmatter pode fixar o agente e o modelo.",
        ]),
        quebraria([
          "Uma pessoa copia de um repositório desconhecido um comando que contém `!`curl ... | sh``. Ao chamá-lo, o shell executa o que está entre as crases antes de o modelo saber de qualquer coisa. Ler o texto do comando, como se lê um script, teria mostrado o risco.",
        ]),
      ],
    },
    {
      title: "Comandos na configuração: modelo próprio e subtarefa",
      order: 2,
      blocks: [
        prose([
          "O campo `command` do `opencode.json` descreve os mesmos comandos sem arquivos separados: cada chave é o nome, e o valor traz `template` (o texto), `description` e, se for o caso, `agent`, `model` e `subtask`. É a forma indicada para comandos curtos, de uma ou duas linhas, que não justificam um arquivo, e para quem prefere manter toda a configuração num lugar só. Para os longos, o markdown é melhor, porque um prompt de trinta linhas dentro de uma string JSON é ilegível. As duas formas valem ao mesmo tempo, e quando o mesmo nome aparece nas duas, vale a regra das camadas do capítulo 2.",
          "",
          "Dois campos mudam o comportamento de um comando de modo que o texto sozinho não consegue. O `model` fixa o modelo daquele comando, no formato `provedor/modelo`: um comando de resumo, que lê muito e escreve pouco, pode ir para um modelo barato, enquanto o resto do projeto usa um mais capaz. O exemplo declara `resumir` com o segundo modelo falso do capítulo 4 e confirma pelo pedido que a escolha chegou ao provedor. O `agent` faz o mesmo para o agente, como o frontmatter do `revisar` fez com o `plan`.",
        ]),
        code("json", [
          "{",
          "  \"provider\": { \"eco\": { \"models\": { \"falso-2\": { \"name\": \"Falso 2\" } } } },",
          "  \"command\": {",
          "    \"resumir\": {",
          "      \"description\": \"Resume um texto em uma frase\",",
          "      \"template\": \"Resuma em uma frase: $ARGUMENTS\",",
          "      \"model\": \"eco/falso-2\"",
          "    }",
          "  }",
          "}",
        ], "opencode.json: um comando curto, com modelo próprio"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run --command resumir um texto qualquer",
          "$ node ver-pedido.mjs \"^Resuma\"",
        ], "Terminal (modelo falso): o comando de resumo e o modelo que o atendeu"),
        code("text", [
          "> build · falso-2",
          "pedidos: 1 | modelo: falso-2 | ferramentas: bash,edit,glob,grep,read,skill,task,todowrite,webfetch,write",
          "  Resuma em uma frase: um texto qualquer",
        ], "Saída: o comando trocou o modelo só para a sua execução"),
        prose([
          "A escolha do segundo campo, `subtask`, é de mais consequência. Com `\"subtask\": true`, o OpenCode não executa o comando na sessão corrente: abre uma sessão filha, com o agente do comando, e entrega a ela o texto. O que volta para a sessão principal é só o resultado final, num formato parecido com o da ferramenta `task` do capítulo 4. O exemplo cria o comando `delegar` em markdown, com `subtask: true` e o agente `general`, e a saída tem duas pistas de que a delegação aconteceu: a linha `• Como subtarefa General Agent` que o `run` imprime e a lista de ferramentas do primeiro pedido, que não inclui `task` nem `todowrite`, porque a sessão filha é de um subagente.",
        ]),
        code("markdown", [
          "---",
          "description: Como subtarefa",
          "agent: general",
          "subtask: true",
          "---",
          "Faça a tarefa: $ARGUMENTS",
        ], ".opencode/command/delegar.md: um comando que roda numa sessão filha"),
        code("bash", [
          "$ opencode run --command delegar escrever notas",
          "$ node ver-pedido.mjs \"^Fa.a a tarefa\" 1",
        ], "Terminal (modelo falso): a tarefa vai para o subagente general"),
        code("text", [
          "• Como subtarefa General Agent",
          "✓ Como subtarefa General Agent",
          "pedidos: 3 | modelo: falso | ferramentas: bash,edit,glob,grep,read,skill,webfetch,write",
        ], "Saída: a delegação aconteceu e o subagente não tem a ferramenta task"),
        prose([
          "Os dois campos se combinam. Um comando de revisão que roda numa sessão filha, com um agente que só lê e um modelo barato, é uma receita de custo e de segurança: a sessão principal não vê as leituras, o agente não consegue alterar nada e o modelo caro só é pago para decidir o que fazer com o relatório. Cada peça dessa receita está no que o livro já mostrou, e o comando é o lugar onde a receita fica escrita, com nome, para ser reaproveitada.",
          "",
          "Vale pensar no catálogo de comandos de um projeto como se pensa nas funções de uma biblioteca: poucas, com nomes que dizem o que fazem e com responsabilidade única. Um comando para escrever a mensagem de commit a partir do diff, outro para gerar as notas de uma versão, outro para propor testes para um arquivo, outro para explicar um erro. Cada um com o seu agente e o seu modelo, escolhidos pelo trabalho que faz, e não por hábito. O erro comum é o oposto: um comando enorme, que tenta cobrir tudo, com um texto de duzentas linhas que ninguém sabe se ainda funciona. Comandos pequenos são mais fáceis de testar com o pedido, mais fáceis de revisar e mais fáceis de aposentar quando o fluxo de trabalho muda.",
          "",
          "Convém também decidir **onde** cada comando mora. O que é específico do projeto fica em `.opencode/command/`, versionado com o código. O que é da sua rotina pessoal, e não deve ir para o repositório dos outros, fica na pasta de configuração do usuário, que o capítulo 1 apontou. A mesma regra de camadas do capítulo 2 vale: se o mesmo nome existir nos dois lugares, a camada mais próxima do projeto fala por último. Duas pessoas que usam o mesmo comando com o mesmo nome podem, portanto, estar rodando textos diferentes sem perceber, e a consulta ao servidor, na pasta do projeto, mostra qual dos dois está valendo.",
        ]),
        porque([
          "O campo `command` da configuração descreve comandos curtos; `model` e `agent` fixam quem os executa, e `subtask: true` os roda numa sessão filha, devolvendo só o resultado. A combinação dá custo e segurança controlados por um nome.",
        ]),
        quebraria([
          "Uma equipe usa o comando de revisão na sessão principal e, em poucos minutos, o contexto está cheio de arquivos lidos. Marcá-lo como subtarefa teria mantido a sessão limpa, e o relatório teria chegado como uma única mensagem.",
        ]),
      ],
    },
    {
      title: "Armadilhas: argumentos que somem, comandos que falham em silêncio",
      order: 3,
      blocks: [
        prose([
          "Os comandos têm quatro armadilhas, todas de comportamento silencioso, e é por isso que a leitura do pedido continua sendo o instrumento de conferência. A primeira é a do comando **sem `$ARGUMENTS`**. Quem escreve um comando de texto fixo e o chama com argumentos pode supor que eles se perderam; na verdade, o OpenCode os acrescenta ao final do texto, numa linha à parte. É um comportamento generoso, porque nada se perde, e arriscado, porque o modelo recebe um texto que o autor do comando não escreveu. Se o comando tem uma frase fixa e a pessoa digita argumentos, o modelo vai ler a frase e depois um texto solto, e tentará adivinhar a relação entre os dois.",
          "",
          "A segunda armadilha é a do comando de shell que **falha**. O exemplo usa um `node` que termina com código 3: o pedido sai com o texto vazio no lugar da crase, sem erro nem aviso. A terceira, a do **arquivo que não existe**: o `@nao-existe.txt` continua escrito, como estava, e nenhum conteúdo é anexado. Nos dois casos a execução não é interrompida, e o modelo recebe um pedido incompleto sem saber que faltou algo. Quem depende da informação deve conferir o pedido, e quem escreve comandos para outras pessoas deve preferir informação que não possa faltar.",
        ]),
        code("markdown", [
          "---",
          "description: Texto fixo, sem marcadores",
          "---",
          "Liste os arquivos alterados desta semana.",
        ], ".opencode/command/semana.md: um comando sem $ARGUMENTS"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run --command semana somente de src",
          "$ node ver-pedido.mjs \"^Liste|^somente\"",
        ], "Terminal (modelo falso): argumentos digitados num comando que não os usa"),
        code("text", [
          "  Liste os arquivos alterados desta semana.",
          "  somente de src",
        ], "Saída: os argumentos foram anexados numa linha à parte"),
        code("markdown", [
          "---",
          "description: Dependências frágeis",
          "---",
          "Resultado do teste: !`node -e \"process.exit(3)\"`",
          "Arquivo de apoio: @nao-existe.txt",
        ], ".opencode/command/frageis.md: um comando de shell que falha e um arquivo que não existe"),
        code("bash", [
          "$ opencode run --command frageis",
          "$ node ver-pedido.mjs \"^Resultado|^Arquivo\"",
        ], "Terminal (modelo falso): nenhum dos dois problemas interrompe a execução"),
        code("text", [
          "  Resultado do teste: ",
          "  Arquivo de apoio: @nao-existe.txt",
        ], "Saída: o resultado ficou em branco e o arquivo continuou como texto"),
        prose([
          "A quarta armadilha é a mais incômoda, porque nem mensagem útil ela dá. Chamar um comando que **não existe** termina com um erro genérico, \"Unexpected server error\", e uma referência para os logs, sem dizer que o nome estava errado. O mesmo erro opaco aparece em outras falhas do `run`, e a causa só se descobre olhando a lista de comandos do servidor. O hábito de conferir o nome com a consulta `/command` antes de culpar o servidor poupa tempo; e, em automações, vale validar o nome contra a lista antes de chamar.",
          "",
          "Escrever o comando de modo defensivo reduz o efeito das armadilhas. Para os comandos de shell, o truque é fazer a própria crase carregar o plano B: em vez de `!`git diff principal``, algo como `!`git diff principal 2>&1 || echo \"não foi possível obter o diff\"``, de modo que, se o comando falhar, o modelo receba uma frase explicando a falta, e não um espaço em branco. O modelo, sabendo que o diff não veio, pode pedir ao usuário, e não declarar que não há nada a revisar. Para os arquivos, a regra é preferir `@` para arquivos que existem em todo clone do repositório, como o `README`, e deixar os arquivos opcionais fora do comando.",
          "",
          "O segundo hábito é o teste do comando. Com o modelo falso, um comando é testável como qualquer função: chama-se com argumentos conhecidos, lê-se o pedido e verifica-se que as linhas esperadas estão lá. Num repositório, esse teste cabe num script de integração contínua de dez linhas: sobe o servidor falso, roda cada comando com argumentos de exemplo e procura no pedido uma marca que só aparece se as substituições funcionaram, como o nome da branch. É um teste barato, que não gasta chamadas de modelo, e que pega justamente os defeitos silenciosos desta seção: o diff vazio, o arquivo que sumiu, o argumento que mudou de posição.",
          "",
          "O terceiro é o cuidado com o que o texto contém. Um comando é código que outras pessoas executam em suas máquinas, e a revisão de um comando novo deve incluir uma leitura atenta das crases e dos arquivos que ele anexa, do mesmo modo como se lê um script de instalação. Os argumentos, por sua vez, entram no texto sem nenhum tratamento: um argumento com instruções escritas por alguém mal-intencionado é um pedido que o modelo lerá como parte do comando. Em automações que repassam texto de terceiros como argumento, a defesa é a mesma do capítulo 5, as permissões, porque nada no texto impede o modelo de seguir o que lê.",
        ]),
        code("bash", [
          "$ opencode run --command naoexiste oi",
        ], "Terminal (falha de propósito): um comando que não está na lista"),
        code("text", [
          "\"name\": \"UnknownError\",",
          "\"message\": \"Unexpected server error. Check server logs for details.\",",
        ], "Saída: o erro não diz que o nome do comando está errado"),
        porque([
          "Argumentos digitados num comando sem `$ARGUMENTS` são anexados; um `!` que falha deixa o lugar em branco; um `@` inexistente continua como texto; e um nome de comando errado dá um erro genérico. Nada disso interrompe a execução, e só o pedido ao modelo mostra o resultado.",
        ]),
        quebraria([
          "Um comando de revisão depende de `!`git diff main``, e a branch principal se chama `master` no repositório. O `git` falha, o lugar fica em branco, e o modelo revisa um pedido sem diff, respondendo que não há nada a revisar. O relatório vazio parece uma boa notícia.",
        ]),
      ],
    },
  ],
};

export const OPENCODE_BOOK_06_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "intermediate",
    promptMd: "O comando `explicar` tem o corpo \"Explique este erro em duas frases.\" e nenhum marcador. A pessoa chama `opencode run --command explicar TypeError: x is undefined`. O que o modelo recebe?",
    choices: [
      "A frase do comando e, em uma linha à parte, o texto digitado como argumento",
      "Só a frase do comando, porque os argumentos sem marcador são descartados",
      "Só o texto digitado, porque ele substitui o corpo do comando",
      "Nada: o OpenCode recusa o comando por falta de $ARGUMENTS",
    ],
    answerKeyMd: "A frase do comando e, em uma linha à parte, o texto digitado como argumento",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "intermediate",
    promptMd: "Um comando de revisão usa `!`git diff origin/principal`` e a equipe percebe que, às vezes, o modelo responde que não há mudanças a revisar mesmo havendo. Explique a causa provável no comportamento do OpenCode e como confirmar.",
    answerKeyMd: "O comando de shell é executado no computador de quem chama, antes do pedido sair; se ele falha (por exemplo, `origin/principal` não existe naquele clone ou a branch tem outro nome), o OpenCode deixa o lugar em branco, sem erro nem aviso, e o modelo recebe um pedido sem diff. Para confirmar, basta ler o pedido que o modelo recebe, usando o modelo falso e o leitor de pedidos, e conferir se a linha do diff veio vazia; a correção é usar uma referência que exista em todos os clones ou tratar a falha dentro do próprio comando de shell.",
    rubricMd: "Identifica que a saída do shell é calculada localmente e falha em silêncio; propõe conferir o pedido enviado ao modelo; sugere uma referência robusta.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "A equipe quer um comando `/revisar` que leia o diff atual, rode num modelo barato, não possa alterar arquivos e não encha o contexto da sessão principal. Descreva como configurar o comando, que campos usar e como confirmar cada propriedade antes de distribuí-lo.",
    answerKeyMd: "Um arquivo `.opencode/command/revisar.md` com frontmatter `agent` apontando para um agente de leitura (por exemplo, um subagente `revisor` com `permission: { edit: deny, bash: deny }`), `model` do provedor barato e `subtask: true`, e corpo com a instrução de revisão e `!`git diff`` para trazer o diff. Para confirmar: (1) `/command` do servidor lista o comando com `subtask`, `agent` e `model`; (2) com o modelo falso, o pedido da sessão filha mostra o modelo barato e a lista de ferramentas sem `edit`, `write` e `bash`; (3) o pedido contém o diff (se vier vazio, o comando de shell falhou); (4) na sessão principal só aparece a mensagem de ferramenta com o resultado. Também convém ler o comando como se lê um script, porque `!` executa na máquina de quem o chama.",
    points: 20,
  },
];

export const OPENCODE_BOOK_06_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Onde os comandos do OpenCode podem ser definidos?", backMd: "Embutidos (`init`, `review`), arquivos `.md` em `.opencode/command/`, o campo `command` do `opencode.json` e as habilidades (listadas com `source: skill`). `/command` do servidor lista todos." },
  { nodeTitle: NODE, frontMd: "Que substituições o corpo de um comando aceita?", backMd: "`$ARGUMENTS`, `$1`, `$2`… para argumentos; crase com `!` para a saída de um comando de shell; `@arquivo` para anexar um arquivo." },
  { nodeTitle: NODE, frontMd: "O que `subtask: true` faz?", backMd: "Roda o comando numa sessão filha, com o agente do comando (sem `task` nem `todowrite`), e devolve só o resultado à sessão principal." },
  { nodeTitle: NODE, frontMd: "O que acontece com argumentos num comando sem `$ARGUMENTS`?", backMd: "São anexados ao final do texto, numa linha à parte. Nada é descartado." },
  { nodeTitle: NODE, frontMd: "Como um comando falha em silêncio?", backMd: "Um `!` que falha deixa o lugar em branco, um `@` inexistente permanece como texto e um nome de comando errado dá \"Unexpected server error\". Só o pedido ao modelo mostra o resultado." },
];
