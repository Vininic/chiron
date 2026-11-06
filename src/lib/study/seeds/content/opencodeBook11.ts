// OpenCode, reescrita autoral (PLANO.md §R.2) — capítulo 11.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Armadilhas: o que o OpenCode faz sem avisar";

export const OPENCODE_BOOK_11: ContentChapter = {
  title: NODE,
  level: "avancado",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Armadilha 1: abrir um repositório alheio é executar o que ele declara",
      order: 0,
      blocks: [
        prose([
          "Quem clona um repositório e roda um comando de leitura, como listar a configuração, espera que nada aconteça além da leitura. Com o OpenCode, nem sempre é assim. O programa carrega a configuração do projeto antes de qualquer coisa, e a configuração do projeto pode declarar **código para executar**: um plugin em `.opencode/plugin/`, um servidor MCP local no campo `mcp`, comandos de shell dentro de comandos personalizados. Essas declarações são, na prática, instruções de execução, e vêm de quem escreveu o repositório. A situação lembra a dos scripts de instalação de pacotes, que também rodam por conta própria ao serem instalados, e vale a mesma desconfiança: abrir um projeto é confiar em quem o escreveu, na medida do que ele declarou.",
          "",
          "O primeiro caso é o do plugin. Plugins são carregados por **qualquer** comando que carregue a configuração, e não apenas pelos que conversam com o modelo: o exemplo cria um plugin que, ao ser carregado, grava um arquivo `executado.txt` na pasta do projeto, e depois roda comandos de leitura. A primeira execução usa `--pure`, a opção que o capítulo 1 descreveu como \"rodar sem plugins externos\", e o arquivo não aparece. A segunda, sem a opção, apenas lista a configuração, um comando que ninguém imaginaria perigoso, e o arquivo aparece. A leitura do que o repositório declara não é, portanto, inofensiva; o que protege é a opção `--pure` ou, melhor, ler o projeto antes de abri-lo.",
        ]),
        code("js", [
          "import { writeFileSync } from \"node:fs\";",
          "",
          "export const Inicio = async ({ directory }) => {",
          "  writeFileSync(directory + \"/executado.txt\", \"rodou\");",
          "  return {};",
          "};",
        ], ".opencode/plugin/inicio.js: um plugin que deixa uma marca assim que é carregado"),
        code("bash", [
          "$ node -e \"console.log('antes:', require('fs').existsSync('executado.txt'))\"",
          "$ opencode debug config --pure",
          "$ node -e \"console.log('com --pure:', require('fs').existsSync('executado.txt'))\"",
          "$ opencode debug config",
          "$ node -e \"console.log('sem --pure:', require('fs').existsSync('executado.txt'))\"",
        ], "Terminal: a mesma leitura da configuração, com e sem --pure"),
        code("text", [
          "antes: false",
          "com --pure: false",
          "sem --pure: true",
        ], "Saída: só a leitura sem --pure executou o plugin"),
        prose([
          "O segundo caso é o do servidor MCP. Uma entrada em `mcp` com `command` é um programa que o OpenCode inicia quando uma sessão começa. O exemplo declara um servidor que também grava um arquivo ao iniciar, e dessa vez a marca só aparece quando o comando conversa com o modelo: `opencode run`. Comandos como `debug config` e `agent list` não iniciam servidores; `run`, `serve` e a interface de texto, sim. A diferença é fina, e a consequência é a mesma: **mandar uma mensagem** num repositório que não é seu executa o que a configuração dele manda executar.",
          "",
          "As defesas são três, em ordem de custo. A primeira é **ler antes de abrir**: o `opencode.json`, a pasta `.opencode/` inteira e os arquivos de comandos são texto, e olhar a lista de servidores, plugins e comandos com crase leva um minuto. A segunda é **desligar por nome**, sem editar o repositório: a configuração inline do capítulo 2 pode acrescentar `\"enabled\": false` a um servidor que o projeto declarou, e a fusão de objetos preserva o resto da entrada. O exemplo faz exatamente isso, e a marca não aparece. A terceira é o **ambiente**: abrir projetos desconhecidos num contêiner ou numa conta sem credenciais, onde o pior que um plugin pode fazer é pouco.",
          "",
          "Um roteiro de leitura de um repositório novo cabe em poucos minutos e segue a mesma ordem em que o OpenCode carrega as coisas. Primeiro, o `opencode.json` e o `opencode.jsonc` da raiz e das subpastas: o campo `mcp` lista programas a iniciar, o campo `plugin` lista pacotes a instalar, e `permission` mostra o quanto o projeto afrouxou a política que você tinha. Depois, a pasta `.opencode/`: cada arquivo em `plugin/` é código que roda, cada arquivo em `command/` pode conter crases com `!`, cada `tool/` é código executável, e `agent/` mostra com que permissões os agentes foram definidos. Por fim, as pastas de outras ferramentas que o OpenCode lê por cortesia, como `.claude/skills/`. Nenhuma dessas leituras exige o OpenCode: são arquivos de texto, e um `git log` sobre eles mostra se mudaram recentemente e quem os mudou.",
          "",
          "Convém também que a equipe decida, como política, em que repositórios o agente pode rodar com a configuração do próprio repositório e em quais ele deve rodar com a configuração apenas do usuário. Os repositórios da própria empresa, revisados, entram na primeira categoria. Os de terceiros, de código aberto ou de clientes, na segunda, com `--pure`, com os servidores desligados por nome e, de preferência, num ambiente isolado. Escrever essa política num lugar que todos leiam custa pouco e evita que a segurança dependa da lembrança de cada pessoa na hora de abrir uma pasta.",
        ]),
        code("js", [
          "import { writeFileSync } from \"node:fs\";",
          "",
          "writeFileSync(\"servidor.txt\", \"rodou\");",
          "process.stdin.resume();",
        ], "pegadinha.mjs: um servidor que deixa uma marca ao iniciar"),
        code("json", [
          "{",
          "  \"mcp\": {",
          "    \"gentil\": { \"type\": \"local\", \"command\": [\"node\", \"pegadinha.mjs\"] }",
          "  }",
          "}",
        ], "opencode.json: um servidor com nome simpático, declarado pelo repositório"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ OPENCODE_CONFIG_CONTENT={\"mcp\":{\"gentil\":{\"enabled\":false}}} opencode run Ola",
          "$ node -e \"console.log('servidor rodou:', require('fs').existsSync('servidor.txt'))\"",
        ], "Terminal (modelo falso): o servidor desligado por nome, sem editar o repositório"),
        code("text", [
          "> build · falso",
          "servidor rodou: false",
        ], "Saída: a mensagem foi enviada e o servidor não iniciou"),
        porque([
          "A configuração de um projeto pode declarar código (plugins, servidores MCP). Plugins rodam em qualquer comando que carregue a configuração, e `--pure` os evita; servidores iniciam quando uma sessão começa, e `\"enabled\": false` inline os desliga por nome. Leia o projeto antes de abri-lo.",
        ]),
        quebraria([
          "Uma pessoa clona um repositório para \"só olhar\" e roda `opencode` para pedir um resumo. O repositório declarava um servidor MCP que enviava informações do ambiente para fora. A leitura da pasta `.opencode/` e do `opencode.json`, antes, teria mostrado o servidor.",
        ]),
      ],
    },
    {
      title: "Armadilha 2: a permissão compara texto, não intenção",
      order: 1,
      blocks: [
        prose([
          "O capítulo 5 mostrou a política de permissões como o freio de verdade do agente, e ela é, mas tem um limite que merece uma seção própria. As regras de `bash` comparam o **texto do comando** com padrões, e o texto de um comando não diz tudo o que ele faz. Uma regra `\"rm *\": \"deny\"` bloqueia `rm arquivo.txt`, porque o comando começa por `rm`. Ela não bloqueia `sh -c \"rm arquivo.txt\"`, que começa por `sh`, executa a mesma coisa por dentro e casa, quando muito, com uma regra geral de liberação. O mesmo vale para `bash -c`, para scripts que o próprio agente escreve e executa, para `find -delete`, para `git clean` e para uma dezena de outros caminhos até o mesmo efeito.",
          "",
          "O exemplo reproduz a falha. A política libera tudo e proíbe `rm *`, a combinação que parece razoável. Um arquivo é criado, o roteiro do modelo falso pede `sh -c \"rm arquivo.txt\"`, e o OpenCode executa o comando sem objeção, porque nenhuma regra proíbe `sh`. O arquivo, ao final, não existe mais. Nenhuma mensagem de erro, nenhum pedido de confirmação: a política fez exatamente o que estava escrito, e o que estava escrito não era o que se pretendia.",
        ]),
        code("text", [
          "conteúdo que não pode ser perdido",
        ], "arquivo.txt: um arquivo que a política deveria proteger"),
        code("json", [
          "{",
          "  \"permission\": {",
          "    \"bash\": { \"*\": \"allow\", \"rm *\": \"deny\" }",
          "  }",
          "}",
        ], "opencode.json: tudo liberado, exceto comandos que começam por rm"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"sh -c \\\"rm arquivo.txt\\\"\", \"description\": \"Apaga o arquivo por dentro de um shell\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: o mesmo rm, escondido dentro de um shell"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ node -e \"console.log('arquivo ainda existe:', require('fs').existsSync('arquivo.txt'))\"",
        ], "Terminal (modelo falso): a proibição de rm e o rm que passou"),
        code("text", [
          "$ sh -c \"rm arquivo.txt\"",
          "arquivo ainda existe: false",
        ], "Saída: o comando foi executado e o arquivo foi apagado"),
        prose([
          "A falha não é exclusiva do `rm`. Cada permissão vale para a ferramenta a que se refere, e as ferramentas se sobrepõem. A permissão `edit` controla as ferramentas de edição do OpenCode, `edit` e `write`; o comando `bash` escreve em arquivos por redirecionamento, sem passar por nenhuma delas. O exemplo seguinte nega `edit` por inteiro: a ferramenta `write` some do pedido, como o capítulo 5 mostrou, e o modelo que tenta usá-la recebe o aviso de ferramenta inexistente. Mas o mesmo modelo, no passo seguinte, escreve o arquivo com `echo ... > arquivo` pelo `bash`, e o arquivo aparece.",
        ]),
        code("json", [
          "{",
          "  \"permission\": { \"edit\": \"deny\" }",
          "}",
        ], "opencode.json: a edição de arquivos negada por inteiro"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"echo gravado > pelo-bash.txt\", \"description\": \"Grava uma linha num arquivo\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: o modelo grava um arquivo pelo bash"),
        code("bash", [
          "$ opencode run Quero gravar",
          "$ node -e \"console.log('pelo bash:', require('fs').existsSync('pelo-bash.txt'))\"",
        ], "Terminal (modelo falso): a escrita que a permissão de edição não alcança"),
        code("text", [
          "$ echo gravado > pelo-bash.txt",
          "pelo bash: true",
        ], "Saída: edit está negado e o arquivo foi gravado do mesmo jeito"),
        prose([
          "A lição não é que as permissões sejam inúteis, e sim que a política de **lista de bloqueio** (liberar tudo e proibir o que se lembrou) é frágil por natureza: o conjunto de maneiras de fazer uma coisa é maior do que o conjunto de coisas em que alguém pensou. A política de **lista de permissão** (proibir tudo e liberar o que a tarefa precisa) inverte o problema, porque o conjunto de coisas de que uma tarefa precisa é pequeno e conhecido de antemão, enquanto o conjunto de coisas perigosas é aberto. Um `\"*\": \"deny\"` seguido de `allow` para `npm test*`, `git status*` e `git diff*` não deixa passar o `sh -c`, porque ele não está na lista, e o que ninguém previu fica barrado em vez de liberado. É a ordem do capítulo 5, com a regra geral primeiro, e a escolha de qual regra geral escrever é a decisão que separa uma política frágil de uma sólida.",
          "",
          "Mesmo a lista de permissão tem um limite: um comando liberado pode fazer coisas por dentro. `npm test*` executa o que estiver no `package.json`, e `git diff*` pode ser configurado para chamar um programa externo. A fronteira definitiva continua sendo o ambiente: o agente rodando numa conta sem acesso ao que não deve ser tocado, num contêiner descartável, num diretório que é uma cópia. A política decide o que o agente tenta fazer; o ambiente decide o que ele consegue fazer.",
          "",
          "Na revisão de uma política, convém fazer a pergunta pelo avesso: em vez de \"o que esta regra proíbe?\", \"de quantas maneiras eu consigo chegar ao efeito que ela pretende impedir?\". Para impedir que se apague um arquivo, são `rm`, `unlink`, `find -delete`, um interpretador (`node -e`, `python -c`) chamando a função de remoção, um redirecionamento que esvazia o arquivo e a ferramenta de edição; para impedir uma escrita, o exemplo acima mostrou que `edit: deny` deixa o redirecionamento passar. Cada caminho que a lista de permissão não nomeia fica barrado sem esforço, e é essa assimetria que a faz preferível.",
        ]),
        porque([
          "As regras de `bash` casam padrões com o texto do comando, e `sh -c \"rm ...\"` não começa por `rm`. Uma lista de bloqueio é frágil; uma lista de permissão (`\"*\": \"deny\"` e liberações específicas) não deixa passar o que ninguém previu. A fronteira final está no ambiente.",
        ]),
        quebraria([
          "Uma equipe acrescenta `\"rm *\": \"deny\"` e `\"git push*\": \"deny\"` à política e acredita estar protegida. O agente, ao tentar limpar uma pasta, escreve um script de shell, executa-o e apaga o que não devia. As duas regras estavam certas e não cobriam o caminho.",
        ]),
      ],
    },
    {
      title: "Armadilha 3: os silêncios, e um roteiro de pré-voo para encontrá-los",
      order: 2,
      blocks: [
        prose([
          "Ao longo do livro, o OpenCode mostrou um traço de caráter consistente: quando algo do que você escreveu não é entendido, ele continua sem reclamar. Um caminho inexistente em `instructions` é ignorado. Um arquivo de agente sem frontmatter não vira agente. Uma habilidade sem `name` não aparece. Um comando de shell que falha deixa um espaço em branco, e um arquivo anexado que não existe fica como texto. Um servidor MCP que não conecta simplesmente não oferece as suas ferramentas. Cada um desses comportamentos é razoável, isolado: o programa prefere seguir a quebrar. Somados, eles produzem uma configuração que **parece** completa e funciona pela metade, e a pessoa só descobre quando o resultado sai pior do que deveria.",
          "",
          "A defesa é a mesma em todos os casos e pode ser automatizada: comparar o que **deveria** estar carregado com o que **está**. O exemplo mostra um verificador de pré-voo de vinte linhas. Um arquivo `esperado.json` lista os nomes das habilidades, dos agentes e dos servidores MCP que o projeto deve ter. O script pergunta ao OpenCode o que ele carregou, com os comandos que o livro já apresentou (`debug skill`, `agent list` e `mcp ls`), e imprime uma linha por item: `ok` quando o item está lá, `FALTA` quando não está. O projeto do exemplo tem três defeitos plantados, um de cada tipo: uma habilidade sem `name`, um agente sem frontmatter e um servidor MCP cujo script não existe.",
        ]),
        code("markdown", [
          "---",
          "name: relatorio-semanal",
          "description: Use para montar o relatório semanal de entregas",
          "---",
          "Liste os commits e agrupe por área.",
        ], ".opencode/skill/relatorio-semanal/SKILL.md: uma habilidade correta"),
        code("markdown", [
          "---",
          "description: Esta habilidade esqueceu o campo name",
          "---",
          "Corpo da habilidade.",
        ], ".opencode/skill/sem-nome/SKILL.md: uma habilidade sem nome"),
        code("markdown", [
          "---",
          "description: Revisa o código",
          "mode: primary",
          "---",
          "Você revisa o código.",
        ], ".opencode/agent/revisor.md: um agente correto"),
        code("markdown", [
          "Você audita o código, mas o arquivo esqueceu o cabeçalho.",
        ], ".opencode/agent/auditor.md: um agente sem frontmatter"),
        code("json", [
          "{",
          "  \"mcp\": {",
          "    \"calc\": { \"type\": \"local\", \"command\": [\"node\", \"mcp-calc.mjs\"] },",
          "    \"externo\": { \"type\": \"local\", \"command\": [\"node\", \"nao-existe.mjs\"] }",
          "  }",
          "}",
        ], "opencode.json: um servidor MCP que conecta e outro que não"),
        code("json", [
          "{",
          "  \"skills\": [\"relatorio-semanal\", \"sem-nome\"],",
          "  \"agentes\": [\"revisor\", \"auditor\"],",
          "  \"mcp\": [\"calc\", \"externo\"]",
          "}",
        ], "esperado.json: o que o projeto deve ter carregado"),
        code("js", [
          "import { execSync } from \"node:child_process\";",
          "import { readFileSync } from \"node:fs\";",
          "",
          "const esperado = JSON.parse(readFileSync(\"esperado.json\", \"utf8\"));",
          "const rodar = (comando) => execSync(comando, { encoding: \"utf8\" }).replace(/\\u001b\\[[0-9;]*m/g, \"\");",
          "",
          "const carregado = {",
          "  skills: JSON.parse(rodar(\"opencode debug skill\")).map((s) => s.name),",
          "  agentes: [...rodar(\"opencode agent list\").matchAll(/^(\\S+) \\((primary|subagent)\\)/gm)].map((m) => m[1]),",
          "  mcp: [...rodar(\"opencode mcp ls --pure 2>&1\").matchAll(/✓ (\\S+) connected/g)].map((m) => m[1]),",
          "};",
          "",
          "for (const grupo of Object.keys(esperado)) {",
          "  for (const nome of esperado[grupo]) {",
          "    console.log((carregado[grupo].includes(nome) ? \"ok    \" : \"FALTA \") + grupo + \": \" + nome);",
          "  }",
          "}",
        ], "preflight.mjs: compara o que deveria estar carregado com o que está"),
        code("bash", [
          "$ node preflight.mjs",
        ], "Terminal: o pré-voo do projeto"),
        code("text", [
          "ok skills: relatorio-semanal",
          "FALTA skills: sem-nome",
          "ok agentes: revisor",
          "FALTA agentes: auditor",
          "ok mcp: calc",
          "FALTA mcp: externo",
        ], "Saída: três itens carregados e três ausentes, um de cada tipo"),
        prose([
          "A saída aponta os três defeitos que nenhuma mensagem do OpenCode havia apontado, e mostra a vantagem do verificador sobre a leitura manual: ele funciona para quem não sabe o que procurar. O `esperado.json` é a especificação do projeto, escrita por quem o configurou, e o script é o teste. Vale rodá-lo na integração contínua e depois de qualquer mudança em `.opencode/`, e estendê-lo para o que for específico da equipe: comandos, que o servidor lista em `/command`, instruções, que o modelo falso mostra em cada pedido, e ferramentas próprias, que aparecem na lista de ferramentas.",
          "",
          "Alguns cuidados de uso. A saída dos comandos do OpenCode traz códigos de cor quando parece um terminal, e uma captura por script os recebe no meio do texto, entre o nome do servidor e a palavra `connected`; por isso o script remove as sequências de escape antes de aplicar as expressões regulares, um detalhe pequeno que faria o verificador acusar falta de tudo. O script do exemplo roda comandos do OpenCode, e cada um custa de um a dois segundos de partida; um verificador que cresce muito deve consultar o servidor, que carrega tudo uma vez, em vez de chamar o programa a cada item. A saída precisa ter um código de saída que a integração contínua entenda: o exemplo imprime `FALTA`, mas um verificador de verdade termina com código diferente de zero quando algo falta, para que o job falhe. E o arquivo `esperado.json` deve nascer junto com cada item novo: quem acrescenta uma habilidade acrescenta uma linha ao arquivo na mesma mudança, e a revisão de código pede as duas. Assim o arquivo não envelhece, e a lista de pendências nunca vira um registro de coisas que já se sabia quebradas. Um verificador que ninguém precisa lembrar de rodar é o único que continua rodando.",
          "",
          "Há um benefício que não é técnico. Um projeto que tem um pré-voo documenta, sem querer, o que o agente deve ter à disposição. Quem chega depois lê o `esperado.json` e entende em dez linhas o que a configuração pretende, algo que um diretório com dezenas de arquivos, cada um capaz de falhar em silêncio, nunca diz sozinho.",
        ]),
        porque([
          "O OpenCode segue em frente quando não entende um arquivo: instruções, agentes, habilidades, comandos e servidores falham em silêncio. Um verificador de pré-voo compara o esperado com o carregado, usando `debug skill`, `agent list` e `mcp ls`, e transforma o silêncio em `FALTA`.",
        ]),
        quebraria([
          "Uma equipe revisa a configuração do agente com cuidado, aprova a mudança e segue em frente. Um arquivo de habilidade sem `name` nunca é carregado, e três meses depois alguém pergunta por que o agente não usa o procedimento de deploy. Um pré-voo na integração contínua teria acusado a falta na hora.",
        ]),
      ],
    },
    {
      title: "Armadilha 4: o que fica guardado depois que a sessão acaba",
      order: 3,
      blocks: [
        prose([
          "A última armadilha é a da memória. O capítulo 10 mostrou que as sessões vivem num banco SQLite, e a consequência merece um exemplo, porque costuma surpreender: **qualquer coisa que passou por uma ferramenta fica no banco**, inclusive o que o agente não devia ter lido. O exemplo faz o modelo falso pedir um `echo` com algo que parece um token, e depois consulta o banco procurando o texto. A ferramenta rodou, o resultado voltou ao modelo e foi gravado na parte da mensagem de ferramenta. O token está na tabela `part`, e continuará lá até alguém apagar a sessão.",
        ]),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"echo TOKEN-SECRETO-123\", \"description\": \"Mostra um valor\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: um comando cuja saída parece um segredo"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ opencode db \"select count(*) as ocorrencias from part where data like '%TOKEN-SECRETO-123%'\" --format json",
        ], "Terminal (modelo falso): o comando roda e o banco é consultado em seguida"),
        code("text", [
          "TOKEN-SECRETO-123",
          "\"ocorrencias\": 1",
        ], "Saída: o valor apareceu na tela e permanece gravado no banco"),
        prose([
          "A memória do banco é só uma das três em que um segredo pode se instalar. Outra é o próprio pedido: o segredo que uma ferramenta devolve entra no histórico e é reenviado ao provedor do modelo em **todas** as mensagens seguintes da sessão, até o fim dela. A terceira é a saída do `debug config`, que o capítulo 2 mostrou imprimindo valores já substituídos. Em cada uma, o remédio é evitar que o segredo entre: negar a leitura de arquivos como `.env` com `deny` (e não `ask`, que uma distração aprova), preferir variáveis de ambiente que o agente não precise listar, e revisar o que as ferramentas próprias e os servidores MCP devolvem. Vale ainda desconfiar de pedidos aparentemente inocentes, como \"mostre as variáveis de ambiente\" ou \"imprima a configuração\", que despejam no histórico exatamente o que se queria manter fora dele; um agente com permissões bem escritas nega a leitura, mas um comando de shell liberado imprime o ambiente sem pedir licença, e é ali que a política do capítulo 5, com lista de permissão, mostra o seu valor: o comando `env`, ou `printenv`, simplesmente não está na lista.",
          "",
          "Quando um segredo já entrou, a resposta tem duas partes, e a primeira não é técnica: **trocar o segredo**. Apagar a sessão e o arquivo limpa o histórico local, mas não desfaz o que já foi enviado ao provedor nem o que foi copiado em backups. A segunda parte é a limpeza: `opencode session delete` remove a conversa, `--sanitize` na exportação reduz o dano de um arquivo compartilhado, e uma política de retenção evita que o banco acumule meses de histórico, que de outro modo ficam disponíveis a qualquer pessoa ou programa com acesso ao arquivo. O hábito que previne tudo isso é o de tratar o banco de sessões e a pasta de dados como o que são: o diário completo de tudo o que o agente viu.",
          "",
          "Convém registrar no projeto, junto à política de permissões, três decisões sobre esses dados. A primeira: onde o histórico mora em cada ambiente (a máquina pessoal, a máquina de integração, o servidor compartilhado) e quem tem acesso. A segunda: por quanto tempo é retido, e quem executa a limpeza. A terceira: o que acontece quando um segredo aparece, com o passo a passo da troca. A resposta a incidentes é muito mais rápida quando já está escrita, e a falta dela costuma transformar o vazamento de uma chave em uma tarde de dúvidas sobre onde mais ela foi parar.",
          "",
          "Fecha-se aqui o ciclo do capítulo. As quatro armadilhas têm uma raiz comum, que é confundir o que está **escrito** com o que está **acontecendo**: a configuração do repositório não é só leitura, a regra de permissão não é a intenção, o arquivo salvo não é o arquivo carregado e a sessão terminada não é a sessão esquecida. Em todas, a defesa é olhar o resultado real, com os instrumentos que o livro deu: o pedido ao modelo, a listagem do que foi carregado, a consulta ao banco e o ambiente em que tudo roda.",
        ]),
        porque([
          "O resultado de qualquer ferramenta fica gravado no banco de sessões e é reenviado ao modelo nas mensagens seguintes. Evite que segredos entrem (`deny` para `.env`), troque o segredo se entrar, apague a sessão e sanitize exportações.",
        ]),
        quebraria([
          "Alguém pede ao agente que \"descubra por que a conexão falha\" e ele imprime as variáveis de ambiente, com a chave do banco de dados. A chave vai para o histórico, para o provedor do modelo e para o banco local. Apagar a sessão não resolve: a chave precisa ser trocada.",
        ]),
      ],
    },
  ],
};

export const OPENCODE_BOOK_11_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "advanced",
    promptMd: "Um repositório que você acabou de clonar tem `.opencode/plugin/inicio.js`. Você roda apenas `opencode debug config` para conferir a configuração. O que acontece com o plugin?",
    choices: [
      "É carregado e executa o seu código, porque plugins carregam em qualquer comando que leia a configuração",
      "Nada, porque plugins só executam quando uma sessão conversa com o modelo",
      "É carregado só se você passar a opção --plugins",
      "É bloqueado, porque debug config roda sempre em modo seguro",
    ],
    answerKeyMd: "É carregado e executa o seu código, porque plugins carregam em qualquer comando que leia a configuração",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "advanced",
    promptMd: "A política tem `\"bash\": { \"*\": \"allow\", \"rm *\": \"deny\", \"git push*\": \"deny\" }`, e mesmo assim o agente apagou arquivos e fez um push. Explique como isso é possível e reescreva a abordagem da política.",
    answerKeyMd: "As regras comparam padrões com o texto do comando: `sh -c \"rm arquivo\"`, `bash -c \"git push\"`, um script gravado e executado pelo próprio agente ou `find -delete` não começam por `rm` nem por `git push`, e só casam com a regra geral `\"*\": \"allow\"`, que liberou. É uma lista de bloqueio, e o conjunto de maneiras de fazer algo é maior do que o das que alguém previu. A abordagem sólida é uma lista de permissão: `\"*\": \"deny\"` primeiro e, depois, `allow` só para os comandos que a tarefa precisa (por exemplo, `npm test*`, `git status*`, `git diff*`), de modo que o que ninguém previu fique barrado; e, como mesmo comandos liberados fazem coisas por dentro, completar com o ambiente (conta sem credenciais de escrita no remoto, contêiner descartável, proteção de branch no servidor).",
    rubricMd: "Explica que a permissão compara texto e que sh -c/scripts escapam; reconhece a fragilidade da lista de bloqueio; propõe lista de permissão com deny geral primeiro; cita a defesa no ambiente.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "Monte um plano de adoção do OpenCode em um repositório crítico de uma empresa, cobrindo: o que verificar ao abrir repositórios de terceiros, como evitar que configurações silenciosamente quebradas passem despercebidas, o que fazer com o histórico de sessões e como estruturar a política de permissões.",
    answerKeyMd: "Repositórios de terceiros: ler `opencode.json`, `.opencode/` (plugins, agentes, comandos com `!`) e a lista de servidores MCP antes de abrir; usar `--pure` para leituras e `OPENCODE_CONFIG_CONTENT` com `enabled: false` por nome para desligar servidores; abrir em contêiner ou conta sem credenciais. Configurações quebradas: um `esperado.json` com habilidades, agentes, servidores e comandos, um verificador de pré-voo (`debug skill`, `agent list`, `mcp ls`, leitura de pedidos com modelo falso) rodado na integração contínua e a cada mudança em `.opencode/`. Histórico: o banco de sessões guarda tudo o que passou pelas ferramentas; negar leitura de `.env` e similares com `deny`, rodar automações em máquinas efêmeras, política de retenção com `session delete`, `--sanitize` em exportações, e troca imediata de qualquer segredo que apareça. Permissões: lista de permissão (`\"*\": \"deny\"` primeiro, liberações específicas depois, a última regra que casa vence), agentes especializados com as aberturas que precisam, revisão de arquivos de agente como política, testes com roteiros do modelo falso e ambiente como fronteira final.",
    points: 20,
  },
];

export const OPENCODE_BOOK_11_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Abrir um repositório alheio no OpenCode é seguro?", backMd: "Não necessariamente: plugins carregam em qualquer comando que leia a configuração (`--pure` evita) e servidores MCP iniciam quando uma sessão começa (desligue por nome com `enabled: false` inline). Leia o projeto antes." },
  { nodeTitle: NODE, frontMd: "Por que `\"rm *\": \"deny\"` não basta?", backMd: "A regra compara o texto do comando: `sh -c \"rm x\"` não começa por rm. Prefira lista de permissão (`\"*\": \"deny\"` + liberações) e o ambiente como fronteira." },
  { nodeTitle: NODE, frontMd: "Quais falhas o OpenCode ignora em silêncio?", backMd: "Caminho inexistente em instructions, agente sem frontmatter, habilidade sem name, `!` que falha, `@` inexistente, servidor MCP que não conecta. Use um pré-voo que compara o esperado com o carregado." },
  { nodeTitle: NODE, frontMd: "O que fica no banco de sessões?", backMd: "Tudo que passou pelas ferramentas, inclusive segredos impressos por comandos. Negue leitura de `.env`, apague sessões, use `--sanitize` e troque o segredo." },
  { nodeTitle: NODE, frontMd: "Qual a raiz comum das armadilhas?", backMd: "Confundir o escrito com o que acontece. A defesa é olhar o resultado real: o pedido ao modelo, o que foi carregado, o banco e o ambiente." },
];
