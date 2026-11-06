// OpenCode, reescrita autoral (PLANO.md §R.2) — capítulo 9.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Ferramentas próprias e plugins: estendendo o OpenCode por dentro";

export const OPENCODE_BOOK_09: ContentChapter = {
  title: NODE,
  level: "avancado",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Uma ferramenta escrita no próprio projeto",
      order: 0,
      blocks: [
        prose([
          "O capítulo anterior ligou ferramentas de fora, de programas que falam um protocolo. Há um caminho mais curto quando a capacidade que falta é pequena e específica do projeto: escrever a ferramenta como um arquivo TypeScript dentro de `.opencode/tool/`. Nada de processo à parte, nada de JSON-RPC: o OpenCode carrega o arquivo, registra a ferramenta e a oferece ao modelo ao lado das nativas. O nome da ferramenta é o nome do arquivo, sem a extensão, de modo que `dobrar.ts` vira a ferramenta `dobrar`. É o lugar certo para coisas como consultar o banco de testes do projeto, ler um arquivo de configuração em um formato próprio ou rodar uma verificação que só faz sentido naquele repositório.",
          "",
          "O arquivo exporta, por padrão, o resultado de uma função auxiliar do pacote `@opencode-ai/plugin`, a `tool`. Ela recebe um objeto com três partes. A `description` é o texto que o modelo lê para decidir quando usar a ferramenta, e vale tudo o que o capítulo 7 disse sobre a descrição das habilidades: é um gatilho, e deve dizer quando usar. Os `args` declaram os argumentos, com um esquema, que o `tool.schema` oferece, e cada argumento pode trazer uma descrição própria, que o modelo também lê. E a função `execute` recebe os argumentos já montados e devolve o resultado, um texto que será a mensagem de ferramenta da conversa. O pacote de apoio é instalado pelo OpenCode quando o projeto precisa dele, o que exige rede e explica por que a primeira execução de um projeto novo é mais lenta.",
          "",
          "O exemplo cria a ferramenta mais simples possível, `dobrar`, que recebe um número e devolve o dobro. O que importa é o caminho completo: o arquivo vira ferramenta, a ferramenta chega à lista que o modelo recebe, com a descrição escrita no arquivo, e a chamada é executada pelo código do projeto. O roteiro do modelo falso chama `dobrar` com o argumento 21.",
        ]),
        code("ts", [
          "import { tool } from \"@opencode-ai/plugin\";",
          "",
          "export default tool({",
          "  description: \"Dobra um número inteiro\",",
          "  args: { n: tool.schema.number().describe(\"o número a dobrar\") },",
          "  async execute(args) {",
          "    return \"Dobro: \" + args.n * 2;",
          "  },",
          "});",
        ], ".opencode/tool/dobrar.ts: uma ferramenta de quinze linhas"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"dobrar\", \"argumentos\": { \"n\": 21 } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: o modelo chama a ferramenta do projeto"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ node ver-pedido.mjs \"Dobra|Dobro\" 1",
        ], "Terminal (modelo falso): a ferramenta na lista, a chamada e o resultado"),
        code("text", [
          "⚙ dobrar {\"n\":21}",
          "pedidos: 2 | modelo: falso | ferramentas: bash,dobrar,edit,glob,grep,read,skill,task,todowrite,webfetch,write",
          "Dobro: 42",
          "(dobrar) Dobra um número inteiro",
        ], "Saída: dobrar entre as ferramentas, o resultado de volta e a descrição do arquivo"),
        prose([
          "A saída tem as três pontas da cadeia. A lista de ferramentas ganhou `dobrar` na posição alfabética. A mensagem de ferramenta do segundo pedido traz \"Dobro: 42\", o que o `execute` devolveu. E a descrição que o modelo recebeu é a do arquivo, palavra por palavra. Quem escreve ferramentas próprias herda, portanto, as responsabilidades de quem escreve ferramentas de servidor, só que sem o protocolo: nomes, descrições e resultados são seus, e todos eles viram texto no pedido.",
          "",
          "A escolha entre esta forma e um servidor MCP segue a régua do capítulo anterior, agora no sentido inverso. Uma ferramenta de projeto é a opção certa quando só aquele projeto a usa, quando é pequena e quando o seu código se beneficia de viver ao lado do resto, versionado, revisado e testado junto. O servidor é a opção certa quando o mesmo código serve a vários projetos ou a vários clientes. Uma ferramenta de projeto que começa a ser copiada para um segundo repositório é o sinal de que virou um servidor.",
          "",
          "Alguns cuidados de projeto valem desde a primeira ferramenta. O nome do arquivo é a interface com o modelo, e deve dizer o que a ferramenta faz, em palavras que o modelo possa associar ao pedido do usuário: `consultar-pedido` ajuda mais do que `util`. A descrição deve ser uma frase de gatilho, como a das habilidades, e mencionar o que a ferramenta **não** faz quando houver risco de confusão com uma nativa. O resultado deve ser curto e já interpretado: um texto de uma ou duas linhas, e não um despejo de dados, porque tudo o que a ferramenta devolve fica no contexto da sessão. E o código dentro do `execute` roda com as permissões do usuário, sem nenhuma proteção do OpenCode: ele pode ler arquivos, abrir conexões e alterar o disco, e deve ser revisado como qualquer outro código do projeto, ainda que a política de permissões do capítulo 5 só alcance as chamadas que o modelo faz, e não o que a ferramenta faz por dentro.",
        ]),
        porque([
          "Um arquivo `.ts` em `.opencode/tool/` exporta `tool({ description, args, execute })` e vira a ferramenta de mesmo nome. A descrição e os argumentos vão ao modelo, e o `execute` devolve o texto do resultado. É o caminho curto para capacidades pequenas e específicas de um projeto.",
        ]),
        quebraria([
          "Uma equipe cria um servidor MCP completo, com protocolo e processo à parte, para expor uma única função de quinze linhas a um único repositório. Uma ferramenta em `.opencode/tool/` teria resolvido, sem nada para manter além do arquivo.",
        ]),
      ],
    },
    {
      title: "Argumentos, permissões e o que a ferramenta não valida",
      order: 1,
      blocks: [
        prose([
          "A ferramenta própria entra no OpenCode por inteiro, e por isso herda tudo o que o livro disse sobre ferramentas. A pasta aceita o plural, `.opencode/tools/`, com o mesmo efeito; o nome da ferramenta continua sendo o do arquivo. A política de permissões do capítulo 5 a alcança pelo nome: um `\"triplicar\": \"deny\"` retira a ferramenta do pedido, um `\"ask\"` a mantém e recusa na execução sem interlocutor, e o curinga trata grupos. Um agente do capítulo 4 pode ter a sua regra. Nada, em suma, é especial no fato de a ferramenta ter sido escrita pelo projeto.",
          "",
          "Há uma coisa a que o autor deve prestar atenção, porque o esquema dos argumentos engana. O `args` descreve ao modelo o que a ferramenta espera, e é por ele que o modelo monta a chamada, mas o `execute` recebe o que o modelo mandou, e o modelo, como já se viu, erra. No exemplo desta seção, o roteiro do modelo falso chama a ferramenta com `\"vinte\"` no lugar de um número. A chamada não é rejeitada: o código roda, multiplica um texto por dois e devolve `NaN`. O resultado volta ao modelo como se fosse uma resposta normal. Confiar no esquema como se ele fosse uma barreira é o equívoco. A validação que importa é a que o `execute` faz, com uma verificação explícita do tipo e uma mensagem de erro que o modelo consiga ler e corrigir.",
        ]),
        code("ts", [
          "import { tool } from \"@opencode-ai/plugin\";",
          "",
          "export default tool({",
          "  description: \"Triplica um número inteiro\",",
          "  args: { n: tool.schema.number().describe(\"o número a triplicar\") },",
          "  async execute(args) {",
          "    return \"Triplo: \" + args.n * 3;",
          "  },",
          "});",
        ], ".opencode/tools/triplicar.ts: a mesma estrutura, na pasta no plural"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"triplicar\", \"argumentos\": { \"n\": \"vinte\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: o modelo manda um texto onde o esquema pede um número"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Quero triplicar",
          "$ node ver-pedido.mjs \"Triplo\" 1",
        ], "Terminal (modelo falso): a ferramenta recebe o que o modelo mandou"),
        code("text", [
          "⚙ triplicar {\"n\":\"vinte\"}",
          "Triplo: NaN",
        ], "Saída: o esquema não impediu a chamada, e o resultado saiu errado"),
        prose([
          "A correção é pequena e vale como hábito: o `execute` confere o argumento antes de usá-lo e, se não servir, devolve um texto que diz o que estava errado e o que se espera, algo como \"n deve ser um número; recebi um texto\". O modelo lê a mensagem, ajusta e chama de novo. Uma ferramenta que devolve `NaN` ou `undefined` ensina ao modelo o contrário: que a operação deu certo.",
          "",
          "Isso vale para todo tipo de entrada, e não só para números. Um caminho de arquivo precisa ser conferido contra a pasta do projeto antes de ser aberto, porque o modelo pode mandar `../../outra-pasta/arquivo` e a ferramenta, que executa com as permissões do usuário, não passa pela pergunta de `external_directory` que a ferramenta `read` nativa teria passado. Uma consulta a um banco de dados nunca deve montar o texto da consulta concatenando o argumento recebido, pelo mesmo motivo de qualquer outro código: o argumento vem de um modelo, que repete o que leu, e o que ele leu pode ter vindo de um arquivo escrito por outra pessoa. A ferramenta própria é, no fundo, um ponto de entrada de dados não confiáveis no código do projeto, e é tratada assim.",
          "",
          "Convém ainda decidir quanto de liberdade a ferramenta dá. Uma ferramenta com muitos argumentos opcionais exige que o modelo escolha entre combinações, e as combinações raras tendem a ser mal usadas; duas ferramentas pequenas, cada uma com um propósito, costumam funcionar melhor que uma grande com modos. O mesmo vale para o nome dos argumentos: nomes que dizem o que são (`arquivo`, `limite`) e descrições de uma frase em cada um diminuem os erros mais do que qualquer validação posterior. Vale, por último, testar a ferramenta com o modelo falso do mesmo jeito que os comandos do capítulo 6: um roteiro com a chamada típica, outro com a chamada errada, e a leitura do que o modelo recebe em cada caso.",
          "",
          "O exemplo seguinte mostra a política em ação: com `\"triplicar\": \"deny\"` na configuração, a ferramenta some do pedido, como qualquer outra negada por inteiro. A ferramenta continua existindo no projeto, pronta para um agente que a libere com `allow` no seu próprio arquivo, o desenho do capítulo 5 que dá a cada agente a sua lista.",
        ]),
        code("json", [
          "{",
          "  \"permission\": { \"triplicar\": \"deny\" }",
          "}",
        ], "opencode.json: a ferramenta do projeto negada por inteiro"),
        code("bash", [
          "$ opencode run Quero triplicar de novo",
          "$ node ver-pedido.mjs XX",
        ], "Terminal (modelo falso): a lista de ferramentas depois da regra"),
        code("text", [
          "ferramentas: bash,edit,glob,grep,read,skill,task,todowrite,webfetch,write",
        ], "Saída: triplicar saiu da lista"),
        porque([
          "A ferramenta do projeto se comporta como qualquer outra diante das permissões. O esquema dos argumentos orienta o modelo, mas não impede uma chamada com tipo errado: valide dentro do `execute` e devolva uma mensagem que o modelo consiga corrigir.",
        ]),
        quebraria([
          "Uma ferramenta que recebe um caminho de arquivo e o lê sem conferir nada devolve, quando o modelo manda um caminho errado, uma exceção opaca, e o modelo repete a chamada com o mesmo erro. Validar o argumento e responder \"o arquivo não existe; os existentes são…\" resolve na segunda tentativa.",
        ]),
      ],
    },
    {
      title: "Plugins: ganchos que rodam antes e depois de cada ferramenta",
      order: 2,
      blocks: [
        prose([
          "Uma ferramenta acrescenta uma capacidade; um **plugin** muda o comportamento do que já existe. É um módulo JavaScript que o OpenCode carrega no próprio processo e que registra **ganchos** (*hooks*): funções chamadas em momentos definidos do funcionamento do programa. O gancho `tool.execute.before` roda antes de qualquer ferramenta, nativa ou não, e recebe o nome da ferramenta e os argumentos; se lançar uma exceção, a ferramenta não é executada, e a mensagem da exceção vira o resultado que o modelo lê. O gancho `tool.execute.after` roda depois, com o resultado. Há outros, que tratam de eventos da sessão, de mensagens e de permissões.",
          "",
          "O arquivo mora em `.opencode/plugin/` e exporta uma função assíncrona, que o OpenCode chama uma vez ao carregar e que recebe um objeto de contexto (o projeto, a pasta de trabalho, um cliente do servidor). A função devolve um objeto cujas chaves são os nomes dos ganchos. O plugin do exemplo faz uma coisa só: antes de cada chamada da ferramenta `bash`, olha o comando e, se ele contiver a palavra `segredo`, lança uma exceção. É um filtro feito de código, com a flexibilidade que as regras `deny` do capítulo 5 não têm, porque ele pode inspecionar o comando como quiser, e não só comparar com um padrão.",
        ]),
        code("js", [
          "export const Guarda = async () => {",
          "  return {",
          "    \"tool.execute.before\": async (entrada, saida) => {",
          "      if (entrada.tool === \"bash\" && String(saida.args.command).includes(\"segredo\")) {",
          "        throw new Error(\"PLUGIN-BLOQUEIO: comando com segredo\");",
          "      }",
          "    },",
          "  };",
          "};",
        ], ".opencode/plugin/guarda.js: um plugin que recusa comandos com a palavra segredo"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"echo segredo\", \"description\": \"Mostra uma palavra\" } },",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"echo livre\", \"description\": \"Mostra outra palavra\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: um comando que o plugin recusa e outro que deixa passar"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ opencode debug info",
        ], "Terminal (modelo falso): a recusa, a passagem e a lista de plugins carregados"),
        code("text", [
          "✗ echo segredo failed",
          "Error: PLUGIN-BLOQUEIO: comando com segredo",
          "$ echo livre",
          "livre",
          "plugins:",
          "<projeto>/.opencode/plugin/guarda.js",
        ], "Saída: o plugin bloqueou o primeiro comando; o segundo passou"),
        prose([
          "A saída tem os dois resultados que o roteiro previa, e uma pista de como o gancho se relaciona com a política: a recusa pelo plugin é entregue ao modelo como erro da ferramenta, com a mensagem do autor, e a conversa **continua**, ao contrário do que acontece com uma pergunta de permissão recusada, que encerra a rodada. O modelo leu \"PLUGIN-BLOQUEIO: comando com segredo\", e o roteiro passou ao comando seguinte. O `debug info`, na última parte, lista o plugin pelo caminho, que é a forma de conferir o que está carregado.",
          "",
          "Os mesmos ganchos servem a usos que a política não cobre: acrescentar uma verificação que depende do estado do repositório (recusar `git commit` se os testes falharem), reescrever argumentos antes da execução, avisar uma pessoa quando uma ferramenta sensível for chamada. A contrapartida é de segurança e é a seção seguinte.",
          "",
          "Os ganchos recebem dois objetos, e a diferença entre eles é a chave do uso. A **entrada** diz o que está acontecendo: o nome da ferramenta e a sessão. A **saída** é o objeto que o OpenCode está prestes a usar, e mudá-lo muda o que acontece. No `tool.execute.before`, os argumentos ficam na saída, e um plugin que os reescreve altera a chamada antes de ela ser executada, o que permite, por exemplo, forçar um parâmetro de segurança em todo comando. No `tool.execute.after`, o resultado da ferramenta fica na saída, e um plugin pode editá-lo antes de o modelo lê-lo, seja para remover um segredo que a ferramenta devolveu sem querer, seja para truncar um resultado grande. A liberdade é grande, e por isso a revisão de um plugin merece o cuidado que se tem com um código que mexe em tudo o que o agente faz.",
          "",
          "Um plugin escrito para recusar precisa de uma mensagem que sirva ao modelo, não só a quem programou. A exceção do exemplo diz **o motivo** (\"comando com segredo\") e começa com uma marca fácil de reconhecer, e o modelo, ao ler, entende que o comando foi barrado por regra e escolhe outro caminho. Uma mensagem como \"erro\" faz o modelo tentar de novo do mesmo jeito. Quando a recusa vem de uma política da equipe, a mensagem pode até dizer o que fazer no lugar, como pedir ao usuário que rode o comando por conta própria, e isso transforma uma barreira em um desvio guiado.",
        ]),
        porque([
          "Um plugin em `.opencode/plugin/` registra ganchos como `tool.execute.before` e `tool.execute.after`. Uma exceção no `before` impede a ferramenta e vira o erro que o modelo lê, sem encerrar a conversa. `opencode debug info` lista os plugins carregados.",
        ]),
        quebraria([
          "Uma regra de segurança é escrita com um padrão de `bash`, mas a condição real depende do conteúdo do comando, que o padrão não alcança. A equipe aceita a regra incompleta. Um plugin de vinte linhas teria feito a verificação que o padrão não faz.",
        ]),
      ],
    },
    {
      title: "Auditoria com plugin e a pergunta de quando usar o quê",
      order: 3,
      blocks: [
        prose([
          "O segundo uso clássico de um plugin é o registro. O gancho `tool.execute.after` recebe o nome da ferramenta e o resultado, e um plugin que escreve essas informações em um arquivo produz, sem nenhuma outra mudança no projeto, uma trilha de auditoria de tudo o que o agente fez: quais ferramentas, com que resultado, em que ordem. Para equipes que precisam responder, depois, \"o que o agente fez naquela sessão?\", é uma resposta de quinze linhas. O exemplo grava uma linha por chamada em `auditoria.log`, com o nome da ferramenta e o começo do resultado, e roda uma execução em seguida lendo o arquivo.",
        ]),
        code("js", [
          "import { appendFileSync } from \"node:fs\";",
          "",
          "export const Auditoria = async ({ directory }) => {",
          "  return {",
          "    \"tool.execute.after\": async (entrada, saida) => {",
          "      appendFileSync(directory + \"/auditoria.log\", entrada.tool + \" -> \" + JSON.stringify(saida.output).slice(0, 40) + \"\\n\");",
          "    },",
          "  };",
          "};",
        ], ".opencode/plugin/auditoria.js: uma linha de registro por chamada de ferramenta"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"echo um\", \"description\": \"Mostra um\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: uma chamada de bash"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ node -e \"console.log(require('fs').readFileSync('auditoria.log', 'utf8'))\"",
        ], "Terminal (modelo falso): a execução e o registro que ela deixou"),
        code("text", [
          "$ echo um",
          "bash -> \"um\\n\"",
        ], "Saída: a chamada e a linha do registro"),
        prose([
          "A segunda metade do exemplo mostra o limite que importa. A opção `--pure`, que o capítulo 1 descreveu como \"rodar sem plugins externos\", é exatamente isso: com ela, o plugin não é carregado, a chamada acontece e **nada é registrado**. O arquivo de auditoria continua com a linha da execução anterior, e a nova não aparece. Qualquer pessoa que rode o OpenCode pode passar `--pure`, ou apagar a pasta `plugin`, ou usar outra máquina. Um plugin é, portanto, uma ferramenta de **cooperação**, boa para uma equipe que quer uma trilha e um filtro e concorda com eles; não é uma barreira contra quem quer contorná-lo. A barreira, onde ela é necessária, está no ambiente em que o agente roda: contas, credenciais e permissões do sistema operacional, e não no próprio agente.",
        ]),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"echo dois\", \"description\": \"Mostra dois\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: outra chamada de bash"),
        code("bash", [
          "$ opencode run --pure Quero pular o plugin",
          "$ node -e \"console.log(require('fs').readFileSync('auditoria.log', 'utf8'))\"",
        ], "Terminal (modelo falso): a mesma chamada, com --pure"),
        code("text", [
          "$ echo dois",
          "bash -> \"um\\n\"",
        ], "Saída: a chamada aconteceu e o registro continua só com a primeira linha"),
        prose([
          "Os dois ganchos também **reescrevem**, e vale ver uma vez. Um plugin pode trocar os argumentos de uma ferramenta antes da execução e o resultado antes de o modelo lê-lo. O exemplo seguinte faz as duas coisas com a ferramenta `bash`: o modelo pede `echo original`, o plugin troca o comando por `echo reescrito`, e depois acrescenta uma marca ao resultado. O que o modelo recebe é o resultado já reescrito, e ele não tem como saber que houve a troca. É o mecanismo que serve, por exemplo, para retirar um segredo da saída de um comando antes que ele chegue ao modelo, e é por isso que um plugin merece a mesma leitura atenta de qualquer outro código.",
        ]),
        code("js", [
          "export const Redige = async () => ({",
          "  \"tool.execute.before\": async (entrada, saida) => {",
          "    if (entrada.tool === \"bash\") saida.args.command = \"echo reescrito\";",
          "  },",
          "  \"tool.execute.after\": async (entrada, saida) => {",
          "    if (entrada.tool === \"bash\") saida.output = \"REDIGIDO: \" + saida.output;",
          "  },",
          "});",
        ], ".opencode/plugin/redige.js: um plugin que troca o comando e marca o resultado"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"echo original\", \"description\": \"Mostra uma palavra\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: o modelo pede um comando que o plugin vai trocar"),
        code("bash", [
          "$ opencode run Quero ver a troca",
          "$ node ver-pedido.mjs \"REDIGIDO|original\"",
        ], "Terminal (modelo falso): o que foi executado e o que o modelo leu"),
        code("text", [
          "$ echo reescrito",
          "REDIGIDO: reescrito",
          "[tool] 20 caracteres",
          "  REDIGIDO: reescrito",
        ], "Saída: o comando executado e o resultado lido pelo modelo são os reescritos"),
        prose([
          "A tabela de escolhas do capítulo se resume em perguntas. Quer dar ao modelo uma **capacidade** nova, pequena e do projeto? Ferramenta em `.opencode/tool/`. Uma capacidade compartilhada, de outro programa ou de outro cliente? Servidor MCP. Quer **impedir** uma ação por nome, padrão ou agente? Permissão, que o próprio OpenCode aplica e que remove a ferramenta do pedido. Quer impedir ou registrar com uma condição que o padrão não expressa? Plugin, sabendo que é cooperação. Quer **orientar** o modelo, sem garantia? Instrução, habilidade ou comando. Cada camada responde a uma pergunta diferente, e a maior parte dos problemas de configuração vem de usar uma para fazer o trabalho da outra.",
          "",
          "Um aviso final sobre a origem dos plugins. Um plugin roda **dentro do processo do OpenCode**, com as permissões do seu usuário, sem nenhuma proteção adicional; ele pode ler qualquer arquivo, abrir conexões e alterar o que as outras camadas decidem. O campo `plugin` da configuração aceita também nomes de pacotes de um registro público, e o comando `opencode plugin` instala um e atualiza a configuração. Instalar um plugin de terceiros é instalar um programa, com tudo o que o capítulo 8 disse de servidores MCP, e a mesma disciplina vale: origem conhecida, versão fixada, código lido.",
          "",
          "A trilha de auditoria do exemplo é simples de propósito, e as versões de produção pedem decisões. O arquivo de registro pode conter segredos, porque o resultado de uma ferramenta pode ter lido um `.env` ou uma saída com tokens: um plugin de auditoria precisa filtrar o que grava, ou o registro vira o arquivo mais sensível do projeto. Ele cresce sem limite, e precisa de rotação ou de um destino externo. E ele registra o que o agente **fez**, não o que **pensou**: para reconstruir uma sessão, as ferramentas `opencode export` e `opencode session list`, tema do próximo capítulo, guardam a conversa inteira, e o plugin complementa com o que a conversa não mostra, como a hora e a pasta de cada chamada.",
        ]),
        porque([
          "O gancho `tool.execute.after` permite um registro de tudo o que o agente fez. Plugins se contornam com `--pure` ou com outro ambiente: servem à cooperação, não à barreira. Capacidade, compartilhamento, proibição, condição e orientação têm ferramentas diferentes, e cada uma responde a uma pergunta.",
        ]),
        quebraria([
          "Uma equipe protege o repositório de produção com um plugin que recusa comandos perigosos. Alguém, sem má intenção, roda o agente com `--pure` para ganhar velocidade, e o plugin não carrega. A proteção que dependia do plugin não existia mais, e nada avisou. A defesa real teria de estar em credenciais que o ambiente não oferece.",
        ]),
      ],
    },
  ],
};

export const OPENCODE_BOOK_09_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "intermediate",
    promptMd: "Você cria `.opencode/tool/checar-sql.ts` com `export default tool({...})`. Com que nome o modelo recebe essa ferramenta no pedido?",
    choices: [
      "checar-sql, o nome do arquivo sem a extensão",
      "tool_checar-sql, com o prefixo de ferramentas de projeto",
      "checar_sql, com o hífen trocado por sublinhado",
      "Qualquer nome que o autor escolher dentro do arquivo",
    ],
    answerKeyMd: "checar-sql, o nome do arquivo sem a extensão",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "intermediate",
    promptMd: "A ferramenta `dobrar` declara `args: { n: tool.schema.number() }`, mas o modelo a chama com `n: \"vinte\"` e o resultado volta como `Dobro: NaN`. Explique por que o esquema não impediu a chamada e como corrigir a ferramenta.",
    answerKeyMd: "O esquema dos argumentos serve para informar o modelo sobre o que a ferramenta espera, e é com ele que o modelo monta a chamada; ele não funciona como barreira de execução, e o `execute` recebe o que o modelo mandou. Aqui o código multiplicou um texto por dois e devolveu NaN, que voltou ao modelo como resultado normal. A correção é validar dentro do `execute`: conferir o tipo do argumento e, se estiver errado, devolver um texto claro (\"n deve ser um número; recebi um texto\") para que o modelo leia a mensagem, corrija e chame de novo, em vez de aceitar um NaN como se fosse resposta.",
    rubricMd: "Diz que o esquema orienta o modelo mas não bloqueia a execução; explica a origem do NaN; propõe validação explícita com mensagem legível dentro do execute.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "Uma equipe propõe usar um plugin com `tool.execute.before` para impedir que o agente execute `git push` e considera a questão resolvida. Avalie a proposta: o que o plugin garante, como pode ser contornado, o que o OpenCode oferece de mais forte para essa regra e o que, ainda assim, deveria ficar no ambiente.",
    answerKeyMd: "O plugin garante a recusa enquanto está carregado e o comando passa pela ferramenta `bash`: a exceção lançada vira o erro que o modelo lê e a execução não acontece. Mas é uma cooperação: `--pure` roda o OpenCode sem plugins, a pasta pode ser removida ou outra máquina pode ser usada, e ele não vê um `git push` escondido em um script ou em outro caminho (por exemplo, dentro de um script que o próprio agente grava e executa). O mais forte que o OpenCode oferece é a permissão: `bash: { \"git push*\": \"deny\" }` colocada depois das regras gerais (a última que casa vence) na configuração, aplicada pelo programa a cada chamada e tratando a negação como recusa que volta ao modelo; mesmo assim, não alcança um push feito por um script. A proteção definitiva está no ambiente: credenciais sem permissão de escrita no remoto, proteção de branch no servidor Git, execução em conta sem as chaves de produção.",
    points: 20,
  },
];

export const OPENCODE_BOOK_09_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Como criar uma ferramenta própria?", backMd: "Um arquivo `.ts` em `.opencode/tool/` (ou `tools/`) com `export default tool({ description, args, execute })`. O nome do arquivo é o nome da ferramenta." },
  { nodeTitle: NODE, frontMd: "O esquema `args` valida os argumentos?", backMd: "Não como barreira: informa o modelo, mas o `execute` recebe o que ele mandou (um texto onde se pedia número rodou e deu NaN). Valide dentro do `execute`." },
  { nodeTitle: NODE, frontMd: "O que é um plugin e onde fica?", backMd: "Um módulo JS em `.opencode/plugin/` que exporta uma função assíncrona devolvendo ganchos, como `tool.execute.before` e `tool.execute.after`. Uma exceção no before impede a ferramenta e vira erro lido pelo modelo." },
  { nodeTitle: NODE, frontMd: "Um plugin pode ser contornado?", backMd: "Sim: `opencode run --pure` roda sem plugins. Plugins servem à cooperação (filtro, registro), não são barreira contra quem quer contorná-los." },
  { nodeTitle: NODE, frontMd: "Que camada usar para cada pergunta?", backMd: "Capacidade pequena do projeto: ferramenta. Compartilhada: servidor MCP. Impedir por nome ou padrão: permissão. Condição especial ou registro: plugin. Orientar sem garantia: instrução, habilidade ou comando." },
];
