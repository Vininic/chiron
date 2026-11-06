// OpenCode, reescrita autoral (PLANO.md §R.2) — capítulo 1.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "O OpenCode por fora: comandos, modos de uso e onde ficam as coisas";

export const OPENCODE_BOOK_01: ContentChapter = {
  title: NODE,
  level: "basico",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Um agente de código dentro do terminal",
      order: 0,
      blocks: [
        prose([
          "O OpenCode é um agente de programação que trabalha no terminal. Você descreve uma tarefa em linguagem natural, ele lê os arquivos do projeto, propõe alterações, roda comandos e devolve o resultado, e quem decide quanta liberdade ele tem é você, por meio de configuração e permissões, assunto dos capítulos seguintes. Este primeiro capítulo trata do que vem antes de qualquer conversa: o programa como ferramenta de linha de comando, o que cada subcomando faz, onde ele guarda o que aprende e como descobre em que projeto está. Quem entende essa parte consegue investigar o comportamento do OpenCode sem gastar uma única chamada de modelo, e é assim que o livro inteiro funciona: os comandos usados aqui só olham a configuração, a pasta do projeto e os arquivos locais, de modo que cada saída mostrada pode ser reproduzida em uma máquina sem chave de nenhum provedor.",
          "",
          "A ideia que organiza o programa é a separação entre **servidor** e **clientes**. Existe um servidor HTTP, que guarda as sessões, lê a configuração e fala com os modelos, e existem várias maneiras de se ligar a ele: a interface de texto, que abre quando você digita apenas `opencode`; o modo de mensagem avulsa, `opencode run`; a interface no navegador, `opencode web`; e o servidor sem tela, `opencode serve`, ao qual outros clientes se conectam com `opencode attach`. Para quem só conversa com o agente, a divisão é invisível. Ela passa a importar na hora de automatizar, porque um script pode levantar um servidor uma única vez e mandar dezenas de mensagens a ele, sem repetir a inicialização a cada uma, e porque um editor de código pode se ligar ao mesmo servidor que a sua interface de texto usa. O capítulo 10 volta a isso com um servidor de verdade.",
          "",
          "O primeiro exemplo faz duas perguntas simples: qual é a versão e que comandos existem. A versão é a primeira informação de qualquer relato de problema, e o OpenCode muda depressa: nomes de opções e formatos de arquivo descritos em tutoriais antigos às vezes já não existem, e só a versão permite saber de qual momento do programa se está falando. Todos os exemplos deste livro foram escritos contra a versão que a primeira saída mostra; quando um deles não reproduzir no seu computador, compare as versões antes de procurar outro culpado.",
        ]),
        code("bash", [
          "$ opencode --version",
        ], "Terminal: a versão instalada"),
        code("text", [
          "1.18.5",
        ], "Saída: o número da versão"),
        code("bash", [
          "$ opencode --help",
        ], "Terminal: os comandos do programa"),
        code("text", [
          "opencode completion          generate shell completion script",
          "opencode mcp                 manage MCP (Model Context Protocol) servers",
          "opencode [project]           start opencode tui",
          "opencode attach <url>        attach to a running opencode server",
          "opencode run [message..]     run opencode with a message",
          "opencode debug               debugging and troubleshooting tools",
          "opencode providers           manage AI providers and credentials",
          "opencode serve               starts a headless opencode server",
          "opencode web                 start opencode server and open web interface",
          "opencode models [provider]   list all available models",
          "opencode session             manage sessions",
          "opencode db                  database tools",
        ], "Saída: algumas linhas da lista de comandos"),
        prose([
          "A lista tem mais de vinte entradas, mas elas se agrupam em poucos papéis. `opencode [project]` é o comando padrão: `opencode` sozinho, ou `opencode caminho/da/pasta`, abre a interface de texto no projeto indicado. `run`, `serve`, `web`, `attach` e `acp` são as formas de uso que não são a interface de texto: mensagem avulsa, servidor sem tela, interface no navegador, cliente de um servidor que já está de pé e servidor para editores que falam o protocolo ACP. `agent`, `mcp`, `providers`, `plugin` e `models` gerenciam o que o agente tem à disposição: agentes, servidores MCP, credenciais de provedores, plugins e a lista de modelos. `session`, `export`, `import`, `stats` e `db` mexem no histórico guardado. `github` e `pr` ligam o agente a repositórios do GitHub, e `upgrade` e `uninstall` cuidam do próprio programa.",
          "",
          "O comando `debug` merece atenção desde já. Seus subcomandos mostram o que o OpenCode **entendeu**, não o que você escreveu: a configuração depois de todas as camadas serem somadas, o agente com cada uma de suas permissões, os caminhos de dados, os projetos que ele conhece. Como nada disso chama um modelo, `debug` é o instrumento de medida do livro, e ao longo dos capítulos ele responde perguntas que a documentação responderia apenas em tese, como saber qual arquivo de configuração venceu ou que regra de permissão está valendo para uma ferramenta. Vale o hábito de, diante de um comportamento estranho, perguntar primeiro ao `debug` e só depois ao agente.",
          "",
          "Uma convenção aparece em vários comandos e opções: o modelo é sempre nomeado como `provedor/modelo`. `openai/gpt-5` é o modelo `gpt-5` do provedor `openai`; um modelo servido por outro provedor teria outro prefixo. A mesma forma serve para a opção `-m`, para o campo `model` da configuração e para a lista que `opencode models` imprime. O mesmo vale para as credenciais: `opencode providers` (que também responde ao apelido `auth`) é o lugar de cadastrar, listar e remover as chaves de cada provedor, e é por ali que se confere, no fim do capítulo, que uma instalação nova começa sem nenhuma.",
        ]),
        porque([
          "O OpenCode é um servidor com vários clientes: a interface de texto, a mensagem avulsa, a interface web e quem se liga por `attach`. A lista de comandos mostra os papéis, `debug` revela o que o programa entendeu sem gastar chamadas de modelo, e `provedor/modelo` é o formato único para nomear um modelo em qualquer lugar.",
        ]),
        quebraria([
          "Quem aprende o OpenCode só pela interface de texto tende a achar que cada tarefa exige abrir uma sessão interativa e a não perceber que `run`, `serve` e `attach` existem. Uma tarefa repetitiva, como pedir uma revisão a cada commit, vira trabalho manual quando poderia ser um script de uma linha.",
        ]),
      ],
    },
    {
      title: "opencode run e as opções que mudam o comportamento",
      order: 1,
      blocks: [
        prose([
          "A interface de texto serve à conversa, mas a mensagem avulsa serve ao trabalho que se repete. `opencode run \"revise este diff\"` abre uma sessão, envia a mensagem, imprime a resposta enquanto ela chega e termina. Não há interface para operar, o que o torna adequado a scripts, a ganchos de Git e a tarefas agendadas, e o resultado pode ser lido por outro programa se você pedir. Cada opção de `run` existe porque uma dessas situações a exigiu, e as ver todas de uma vez evita descobri-las pela experiência ruim.",
          "",
          "O primeiro grupo de opções decide **qual conversa**. `--continue` (ou `-c`) retoma a última sessão do projeto, e `--session` (`-s`) retoma uma sessão específica pelo identificador. `--fork` cria uma cópia da sessão antes de continuar, de modo que o histórico original fica intacto, e só vale junto com uma das duas anteriores. `--title` dá um nome à sessão em vez de usar o começo do prompt, o que ajuda quando `opencode session list` vai mostrar dezenas de linhas parecidas. Sem nenhuma delas, cada chamada de `run` abre uma sessão nova, com a memória vazia: uma automação que dependa de contexto precisa dizer explicitamente que quer continuar.",
          "",
          "O segundo grupo decide **quem responde**. `--model` (`-m`) escolhe o modelo no formato `provedor/modelo`, `--agent` escolhe o agente, e `--variant` ajusta o esforço de raciocínio para os modelos que oferecem esse controle, com valores que dependem do provedor. `--thinking` mostra os blocos de raciocínio na saída, que ficam ocultos por padrão. `--command` roda um comando personalizado em vez de uma mensagem livre, e a mensagem passa a ser o argumento dele; os comandos personalizados são o assunto do capítulo 6. `--file` (`-f`) anexa um ou mais arquivos à mensagem, útil para entregar um log ou um diff sem colá-lo no texto.",
          "",
          "O terceiro grupo decide **onde e como**. `--dir` define a pasta de trabalho, ou o caminho no servidor remoto quando se usa `--attach`. `--attach` aponta para um servidor que já roda, em vez de levantar um novo, e `--username` e `--password` fornecem a autenticação básica quando esse servidor a exige; sem elas, o programa consulta as variáveis `OPENCODE_SERVER_USERNAME` e `OPENCODE_SERVER_PASSWORD`. `--port` fixa a porta do servidor local, que por padrão é sorteada. `--format` escolhe entre `default`, texto formatado para leitura humana, e `json`, uma sequência de eventos brutos que um programa consegue processar linha a linha. `--share` compartilha a sessão, e deve ser tratado como publicação do conteúdo da conversa, não como detalhe.",
        ]),
        code("bash", [
          "$ opencode run --help",
        ], "Terminal: a ajuda do comando run"),
        code("text", [
          "-c, --continue     continue the last session",
          "-s, --session      session id to continue",
          "--fork         fork the session before continuing (requires --continue or --session)",
          "-m, --model        model to use in the format of provider/model",
          "--agent        agent to use",
          "--format       format: default (formatted) or json (raw JSON events)",
          "-f, --file         file(s) to attach to message",
          "--attach       attach to a running opencode server (e.g., http://localhost:4096)",
          "--dir          directory to run in, path on remote server if attaching",
          "--auto         auto-approve permissions that are not explicitly denied (dangerous!)",
        ], "Saída: as opções de run que o capítulo comenta"),
        prose([
          "Uma opção merece o seu próprio parágrafo, porque o texto de ajuda já a rotula como perigosa: `--auto`. Quando uma ferramenta tem a permissão `ask`, o agente para e pede a sua aprovação; com `--auto`, toda permissão que não seja explicitamente negada é aprovada sem perguntar. Em uma sessão sem ninguém olhando, como um script ou uma tarefa agendada, essa é a única forma de o agente não ficar esperando uma resposta para sempre, e é também a forma de ele apagar arquivos, rodar comandos de rede e reescrever o histórico do Git sem que alguém note. A palavra-chave do texto de ajuda é **explicitamente negada**: o que você escreveu como `deny` continua valendo; o que ficou como `ask` ou nem foi mencionado passa a valer como permitido. A defesa, portanto, está na configuração, não na opção: antes de usar `--auto`, a lista de `deny` precisa cobrir tudo o que não pode acontecer. O capítulo 5 monta essa lista, e o capítulo 11 volta ao assunto como uma das armadilhas.",
          "",
          "Duas observações práticas fecham a seção. A primeira é que `run` e o comando sem argumentos compartilham as opções de escolha de conversa e de modelo, mas a interface de texto tem opções próprias, como `--prompt`, que fornece o texto inicial, e `--mini`, que inicia a interface interativa mínima. A segunda é que a ordem dos argumentos importa menos do que parece: tudo o que não é opção é a mensagem, e várias palavras sem aspas viram uma mensagem só, mas aspas protegem o texto de o shell interpretar caracteres como `$` e `!`, e por isso são o hábito mais seguro para qualquer prompt que não seja uma palavra.",
        ]),
        porque([
          "`run` transforma o agente em um comando de script. As opções se dividem em escolher a conversa, escolher quem responde e escolher onde e como rodar; `--auto` aprova tudo o que não estiver explicitamente negado, e por isso a lista de `deny` é a verdadeira defesa de uma automação.",
        ]),
        quebraria([
          "Uma tarefa agendada chama `opencode run --auto \"limpe os arquivos temporários\"` em uma pasta onde a configuração não proíbe nada. Como nada está negado, tudo é aprovado, e o agente, ao interpretar \"temporários\" de forma ampla, apaga também a pasta de resultados que ninguém tinha copiado.",
        ]),
      ],
    },
    {
      title: "Onde ficam configuração, dados, credenciais e histórico",
      order: 2,
      blocks: [
        prose([
          "Um programa que guarda sessões, credenciais e caches espalha arquivos pelo computador, e saber onde eles ficam é o que permite fazer backup, limpar espaço, mover o trabalho para outra máquina ou investigar um comportamento que parece vir do nada. O OpenCode separa o que guarda em cinco pastas, cada uma com um papel, e o comando `opencode debug paths` as imprime. Em Linux e macOS elas seguem a convenção das variáveis `XDG_*`: `XDG_CONFIG_HOME` para configuração, `XDG_DATA_HOME` para dados, `XDG_CACHE_HOME` para caches e `XDG_STATE_HOME` para estado. Mudar uma dessas variáveis muda o lugar correspondente, e é exatamente o que os exemplos deste livro fazem para rodar em uma pasta isolada: cada saída é produzida com configuração, dados e caches vazios, de modo que nada do computador de quem escreveu aparece nelas.",
          "",
          "Por isso, nas saídas, duas abreviações substituem caminhos reais: `<tmp>` é a pasta temporária e isolada onde o exemplo rodou, e `<casa>` é a pasta pessoal do usuário de teste. No seu computador, as linhas terão os caminhos da sua conta, e a estrutura é a mesma: um diretório `opencode` dentro de cada uma das pastas base. O que muda é o separador, barra invertida no Windows e barra comum nos outros sistemas, e o ponto de partida de cada pasta, que depende do sistema e das variáveis de ambiente.",
        ]),
        code("bash", [
          "$ opencode debug paths",
        ], "Terminal: as pastas globais do OpenCode"),
        code("text", [
          "home       <casa>",
          "data       <tmp>\\data\\opencode",
          "bin        <tmp>\\cache\\opencode\\bin",
          "log        <tmp>\\data\\opencode\\log",
          "config     <tmp>\\config\\opencode",
          "state      <tmp>\\state\\opencode",
        ], "Saída: onde o OpenCode guarda cada coisa"),
        prose([
          "Cada pasta tem uma função. **`config`** é a configuração global do usuário, a camada mais baixa, que vale em todos os projetos e é onde ficam o `opencode.json` pessoal, o `AGENTS.md` pessoal e agentes, comandos e habilidades que você quer sempre à mão. **`data`** é o que o programa produz e precisa lembrar: o banco de sessões, o arquivo de credenciais e os logs. **`bin`**, dentro do cache, guarda executáveis de apoio que o OpenCode baixa por conta própria. **`log`**, dentro de `data`, é onde procurar quando algo falha sem mensagem clara, e **`state`** guarda o estado que o programa mantém entre execuções. A pasta de cache existe para ser descartável, porque o que se perde nela é baixado de novo; já `data` guarda as sessões e as credenciais, e apagá-la não tem volta.",
          "",
          "Os dois arquivos mais sensíveis dessa estrutura podem ser localizados por comandos próprios, sem adivinhar caminhos. O histórico de sessões é um único banco de dados, e `opencode db path` imprime onde ele está. As credenciais cadastradas ficam em um arquivo de autenticação, e `opencode providers list` informa o caminho dele na primeira linha, seguida da lista de provedores com chave. Em uma instalação nova, nenhuma chave existe, e a saída diz exatamente isso. Esses dois arquivos pertencem à mesma categoria de um arquivo de senhas: ficam fora de repositórios, não se anexam a relatos de problema, e um backup precisa tratá-los com o mesmo cuidado que se teria com qualquer segredo.",
        ]),
        code("bash", [
          "$ opencode db path",
          "$ opencode providers list",
        ], "Terminal: o banco de sessões e o arquivo de credenciais"),
        code("text", [
          "<tmp>\\data\\opencode\\opencode.db",
          "Credentials <tmp>\\data\\opencode\\auth.json",
          "0 credentials",
        ], "Saída: os dois arquivos que merecem cuidado"),
        prose([
          "O último comando do grupo, `opencode debug info`, resume o ambiente em poucas linhas: a versão, o sistema operacional e os plugins carregados. É o texto que se anexa a um relato de problema, no lugar de tentar descrever a instalação de memória. Em uma instalação sem plugins, a lista é a palavra `none`; o capítulo 9 mostra como ela passa a ter nomes. Vale lembrar, ao ler qualquer saída de `debug`, que ela descreve o computador de quem a rodou: antes de colar em um fórum público, revise o que há ali, porque caminhos de pastas costumam conter o nome do usuário e de projetos internos.",
          "",
          "Uma consequência prática de tudo isso é a possibilidade de **isolar** o OpenCode. Como as quatro pastas obedecem às variáveis `XDG_*`, apontá-las para uma pasta vazia dá ao programa uma instalação virgem, sem credenciais, sem sessões e sem configuração pessoal. É a técnica para reproduzir um problema sem a influência da sua configuração, para testar um `opencode.json` de equipe como um colega o veria e para rodar demonstrações sem expor chaves. O trabalho de isolamento tem um limite que o capítulo 11 detalha: a pasta `home` do usuário ainda é consultada em alguns pontos, como arquivos de habilidades pessoais, e por isso um isolamento completo também troca a variável que define a pasta pessoal.",
        ]),
        code("bash", [
          "$ opencode debug info",
        ], "Terminal: o resumo do ambiente"),
        code("text", [
          "opencode version: 1.18.5",
          "plugins:",
          "none",
        ], "Saída: versão e plugins"),
        porque([
          "As pastas `config`, `data`, `cache` e `state` seguem as variáveis `XDG_*` e têm funções distintas: configuração do usuário, sessões e credenciais, arquivos baixados e estado de tela. `debug paths`, `db path` e `providers list` dizem onde cada coisa está; o cache pode ser descartado, `data` não.",
        ]),
        quebraria([
          "Alguém libera espaço apagando a pasta `opencode` inteira dentro dos dados, sem olhar o que há ali. Some junto o banco com semanas de sessões e o arquivo de credenciais, e a pessoa descobre só ao abrir o programa e ver o histórico vazio e todos os provedores sem chave.",
        ]),
      ],
    },
    {
      title: "Como o OpenCode decide qual é o projeto",
      order: 3,
      blocks: [
        prose([
          "Quase tudo o que o OpenCode faz acontece dentro de um **projeto**: as ferramentas de arquivo valem para a pasta do projeto, as permissões são avaliadas em relação a ela, a configuração é procurada a partir dela, e as sessões ficam agrupadas por ela. Descobrir qual é a pasta do projeto é, portanto, o primeiro passo de qualquer execução, e a regra é simples: o OpenCode olha a pasta onde foi chamado e sobe pelos pais procurando um repositório Git. Se encontra um, aquela é a raiz do projeto, a **worktree**; se chega ao topo sem encontrar nenhum, o trabalho cai em um projeto genérico de nome `global`, cuja raiz é a raiz do sistema de arquivos. Os dois casos funcionam, mas se comportam de maneira diferente, e a diferença aparece nas permissões que o capítulo 5 explica.",
          "",
          "O comando `opencode debug scrap` lista os projetos que o programa conhece e é a maneira de ver essa decisão. Há um detalhe de ordem que explica uma saída aparentemente errada: um projeto só passa a constar da lista depois que alguma execução do OpenCode o carregou. Criar um repositório com `git init` não altera nada por si só, e `debug scrap` logo a seguir continua mostrando a lista antiga, porque ainda nenhum comando abriu o novo projeto. Basta rodar qualquer comando que leia a configuração, como `opencode debug config`, para que o projeto seja registrado e apareça na listagem.",
          "",
          "A configuração segue um caminho próprio, e é útil não confundir os dois. Ao carregar a configuração do projeto, o OpenCode procura arquivos `opencode.json` ou `opencode.jsonc` na pasta atual e em todas as pastas acima dela, e soma os que encontra, de modo que um arquivo mais próximo da pasta atual vale mais que um mais distante. O exemplo usa dois: um na raiz do projeto, que escolhe o modelo principal, e outro em `src/modulo`, que escolhe um modelo menor. Rodando de dentro de `src/modulo`, a configuração resolvida contém os dois campos, o da raiz e o do subdiretório, e isso acontece mesmo sem Git, porque a subida pelas pastas não depende de repositório.",
        ]),
        code("json", [
          "{",
          "  \"$schema\": \"https://opencode.ai/config.json\",",
          "  \"model\": \"openai/gpt-5\"",
          "}",
        ], "opencode.json: o modelo principal, na raiz do projeto"),
        code("json", [
          "{",
          "  \"small_model\": \"openai/gpt-5-mini\"",
          "}",
        ], "src/modulo/opencode.json: um modelo menor, só neste módulo"),
        code("bash", [
          "$ cd src/modulo",
          "$ opencode debug config",
          "$ opencode debug scrap",
        ], "Terminal: de dentro do subdiretório, sem repositório Git"),
        code("text", [
          "\"model\": \"openai/gpt-5\",",
          "\"small_model\": \"openai/gpt-5-mini\",",
          "…",
          "\"id\": \"global\",",
          "\"worktree\": \"/\",",
        ], "Saída: as duas configurações somadas e o projeto genérico"),
        prose([
          "Sem repositório, o projeto se chama `global` e sua raiz é `/`: tudo o que estiver abaixo do diretório raiz do sistema conta como \"dentro do projeto\". Isso significa que a fronteira que o OpenCode usa para decidir o que é interno e o que é externo deixa de ser a sua pasta de trabalho e passa a ser o disco inteiro, uma diferença que não se vê a olho nu e muda o alcance do agente. Trabalhar sempre dentro de um repositório Git, mesmo que seja um recém-criado com `git init`, faz da pasta do repositório a fronteira entre o que é interno e o que é externo, e é a primeira medida de segurança do livro.",
          "",
          "O segundo bloco do exemplo cria o repositório na raiz do projeto, volta ao subdiretório e pede a configuração de novo. A lista continua com uma única entrada, ainda de identificador `global`, mas agora com a pasta do repositório como raiz e a marca `\"vcs\": \"git\"`: um repositório sem nenhum commit não tem uma identidade própria para o OpenCode usar, e o identificador antigo é aproveitado. O registro vale para qualquer subpasta do repositório, de modo que abrir o OpenCode em `src/modulo` ou na raiz leva ao mesmo projeto, às mesmas sessões e às mesmas permissões.",
          "",
          "A identidade definitiva chega com o primeiro commit. O identificador de um projeto em Git é o hash do commit inicial do repositório, o mesmo que `git rev-parse HEAD` imprime em um repositório de um único commit. Isso é útil por um motivo prático: dois clones do mesmo repositório, em pastas ou computadores diferentes, compartilham o identificador, e o OpenCode consegue tratá-los como o mesmo projeto. O contrário também vale, e é a razão de recomendar um commit inicial antes de qualquer sessão séria: sem ele, o projeto carrega o identificador genérico, e a sessão guardada com ele não acompanha o repositório quando o histórico passa a existir.",
        ]),
        code("bash", [
          "$ cd ../..",
          "$ git init",
          "$ cd src/modulo",
          "$ opencode debug config",
          "$ opencode debug scrap",
        ], "Terminal: o repositório é criado e o projeto muda de raiz"),
        code("text", [
          "Initialized empty Git repository in <projeto>/.git/",
          "…",
          "\"id\": \"global\",",
          "\"worktree\": \"<projeto>\",",
          "\"vcs\": \"git\",",
        ], "Saída: a mesma entrada, agora com a raiz no repositório"),
        porque([
          "O projeto é o repositório Git que contém a pasta atual; sem repositório, vale o projeto `global`, com raiz `/`. O identificador definitivo é o hash do primeiro commit. A configuração é somada subindo pelas pastas, e um projeto só aparece em `debug scrap` depois de carregado por algum comando.",
        ]),
        quebraria([
          "Uma pessoa extrai um zip de código em uma pasta nova e abre o OpenCode ali, sem `git init`. O projeto é o `global`, com raiz `/`, e o agente trata como \"interno\" qualquer arquivo do disco, inclusive pastas pessoais, até o dia em que uma tarefa mexe em algo fora da pasta que ela imaginava ser o limite.",
        ]),
      ],
    },
  ],
};

export const OPENCODE_BOOK_01_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "beginner",
    promptMd: "Um script de manutenção precisa pedir ao OpenCode um resumo do último commit toda sexta-feira, sem ninguém operando a interface e sem repetir o conteúdo da conversa anterior. Qual comando atende melhor a esse uso?",
    choices: [
      "opencode run \"resuma o último commit\"",
      "opencode attach \"resuma o último commit\"",
      "opencode \"resuma o último commit\"",
      "opencode serve \"resuma o último commit\"",
    ],
    answerKeyMd: "opencode run \"resuma o último commit\"",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "beginner",
    promptMd: "Você extraiu um projeto de um arquivo zip, abriu o OpenCode na pasta e o `opencode debug scrap` mostrou `\"id\": \"global\"` com `\"worktree\": \"/\"`. Explique o que isso significa para o alcance do agente e o que você faria antes de continuar a trabalhar.",
    answerKeyMd: "Sem repositório Git, o OpenCode não achou uma raiz de projeto e usou o projeto genérico `global`, cuja raiz é `/`: para ele, tudo o que está no disco conta como interno ao projeto, e os limites de permissão sobre diretórios externos deixam de proteger. Antes de continuar, rode `git init` na pasta do projeto (e, de preferência, faça um commit inicial), rode de novo um comando que carregue o projeto, como `opencode debug config`, e confira com `opencode debug scrap` que o projeto novo tem como `worktree` a pasta do repositório e `\"vcs\": \"git\"`.",
    rubricMd: "Explica que a ausência de repositório leva ao projeto global com raiz `/`; relaciona isso ao alcance e às permissões sobre diretórios externos; propõe git init e a conferência por debug scrap depois de carregar o projeto.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "intermediate",
    promptMd: "Uma equipe quer rodar `opencode run` à noite em um servidor de integração, sem ninguém para aprovar pedidos de permissão, e alguém sugeriu `--auto`. Descreva o que `--auto` aprova, o que continua bloqueado e que preparação a configuração do projeto exige antes de ligar essa opção.",
    answerKeyMd: "`--auto` aprova toda permissão que não esteja explicitamente negada: o que está como `ask`, ou que nem foi mencionado, passa a valer como permitido; o que está como `deny` continua bloqueado. Por isso a defesa é a lista de `deny` do projeto: antes de ligar a opção, ela precisa cobrir comandos destrutivos (remoção de arquivos, `git push --force`, acesso a rede que não seja necessário), leitura de segredos como `.env` e escrita fora da pasta do projeto. A execução deve acontecer em um repositório Git (para que o projeto não seja o `global`), com um agente que só tenha as ferramentas necessárias, e a revisão do resultado deve ser feita por quem não é o próprio agente.",
    points: 20,
  },
];

export const OPENCODE_BOOK_01_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Que comando usar para o OpenCode responder uma única mensagem e terminar?", backMd: "`opencode run \"mensagem\"`. Sem `--continue` ou `--session`, abre uma sessão nova a cada chamada." },
  { nodeTitle: NODE, frontMd: "Como o OpenCode nomeia um modelo?", backMd: "Sempre `provedor/modelo`, como em `openai/gpt-5`, na opção `-m`, no campo `model` da configuração e em `opencode models`." },
  { nodeTitle: NODE, frontMd: "O que `--auto` aprova?", backMd: "Toda permissão que não está explicitamente negada. O que é `deny` continua bloqueado; `ask` e o que não foi mencionado passam a valer como permitidos." },
  { nodeTitle: NODE, frontMd: "Como descobrir onde ficam configuração, dados e credenciais?", backMd: "`opencode debug paths` lista as pastas, `opencode db path` o banco de sessões e `opencode providers list` o arquivo de credenciais." },
  { nodeTitle: NODE, frontMd: "Qual é o projeto quando a pasta não está num repositório Git?", backMd: "O projeto genérico `global`, com raiz `/`. Em um repositório, o projeto é a pasta do repositório, com `\"vcs\": \"git\"`." },
];
