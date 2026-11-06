// OpenCode, reescrita autoral (PLANO.md §R.2) — capítulo 10.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Sessões, servidor e automação";

export const OPENCODE_BOOK_10: ContentChapter = {
  title: NODE,
  level: "avancado",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Sessões: onde a conversa fica e como consultá-la",
      order: 0,
      blocks: [
        prose([
          "Tudo o que o agente faz acontece dentro de uma **sessão**: uma conversa com um agente, num projeto, com um histórico de mensagens e partes. As sessões não vivem na memória do programa. Cada uma é gravada no banco de dados que o capítulo 1 localizou com `opencode db path`, e é por isso que a conversa sobrevive ao fim do comando, que `--continue` a retoma e que o histórico de um projeto pode ser consultado depois. O banco é um arquivo SQLite, e o OpenCode oferece um comando para consultá-lo sem nenhuma outra ferramenta: `opencode db` com uma consulta SQL, e `--format json` para uma saída que programas leiam.",
          "",
          "O banco tem vinte tabelas, entre elas as que importam para entender uma sessão: `session` (uma linha por conversa), `message` (as mensagens trocadas), `part` (os pedaços de cada mensagem: texto, chamadas de ferramenta, resultados), `project` (os projetos que o `debug scrap` listava), `permission` e `todo`. O exemplo faz duas coisas. Cria uma sessão com título, usando `--title`, para que ela seja fácil de achar, e consulta o catálogo do SQLite para listar as tabelas. Depois conta as sessões e as mensagens, o que dá a medida de uma conversa: uma sessão, duas mensagens (a do usuário e a resposta do agente).",
        ]),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run --title primeira Ola",
          "$ opencode db \"select name from sqlite_master where type = 'table' order by name\" --format json",
          "$ opencode db \"select count(*) as sessoes from session\" --format json",
          "$ opencode db \"select count(*) as mensagens from message\" --format json",
        ], "Terminal (modelo falso): uma sessão com título e as consultas que a descrevem"),
        code("text", [
          "\"name\": \"message\"",
          "\"name\": \"part\"",
          "\"name\": \"permission\"",
          "\"name\": \"project\"",
          "\"name\": \"session\"",
          "\"name\": \"todo\"",
          "\"sessoes\": 1",
          "\"mensagens\": 2",
        ], "Saída: algumas das tabelas do banco, uma sessão e duas mensagens"),
        prose([
          "A segunda parte do exemplo retoma a sessão com `--continue`. O OpenCode abre a última sessão do projeto, em vez de criar uma nova, e acrescenta a nova troca de mensagens. A prova está nas contagens: o número de sessões continua em um, e o de mensagens passa de dois para quatro. A conversa tem memória, e é essa memória, o histórico inteiro, que o OpenCode envia ao modelo a cada pedido, o que explica por que sessões longas custam cada vez mais: o que foi dito continua sendo enviado. Uma sessão nova, ao contrário, parte do zero, e é a ferramenta certa para uma tarefa diferente.",
        ]),
        code("bash", [
          "$ opencode run --continue Mais uma",
          "$ opencode db \"select count(*) as sessoes from session\" --format json",
          "$ opencode db \"select count(*) as mensagens from message\" --format json",
        ], "Terminal (modelo falso): a mesma sessão, retomada"),
        code("text", [
          "\"sessoes\": 1",
          "\"mensagens\": 4",
        ], "Saída: nenhuma sessão nova e duas mensagens a mais"),
        prose([
          "Duas variações completam a família. `--session` retoma uma sessão específica, pelo identificador, e é o que se usa quando há várias conversas no mesmo projeto. `--fork` retoma a conversa **copiando-a**: o histórico até ali vira uma sessão nova, e o que se disser depois não altera a original. É a ferramenta para explorar uma alternativa sem perder o ponto de partida, e o equivalente, nas conversas, do ramo de um repositório. Para achar o identificador, `opencode session list` mostra uma tabela com o código, o título e a hora da última atualização; `opencode stats` resume o uso (sessões, mensagens, custo e tokens) e, como o modelo falso não cobra, mostra custo zero.",
          "",
          "Três cuidados acompanham a existência desse banco. O primeiro é o da confidencialidade: ele guarda **tudo** o que passou pela sessão, os prompts, as respostas, o conteúdo dos arquivos que o agente leu e a saída dos comandos que rodou. Um `.env` lido por engano, uma chave exibida na saída de um comando, um trecho de código proprietário: nada disso some quando a conversa termina. O arquivo do banco merece o tratamento de um arquivo de segredos, fora de repositórios, fora de pastas sincronizadas com serviços públicos e fora dos anexos de relatos de problema. O segundo é o do volume: o histórico cresce, sessões antigas continuam ocupando espaço, e uma política de retenção, mesmo que seja apagar com `opencode session delete` as conversas de mais de um mês, mantém o banco pequeno e a superfície de risco menor. O terceiro é o da escrita: `opencode db` abre o banco com os mesmos poderes do programa, e uma consulta que altera dados altera o histórico de verdade. Para consultar, prefira `select`; para qualquer alteração, copie o arquivo antes.",
          "",
          "Convém também pensar nas consultas como um instrumento de análise, e não só de curiosidade. Contar as mensagens por sessão mostra quais conversas ficaram longas e caras. Agrupar as partes por tipo mostra quanto do histórico é texto e quanto é resultado de ferramenta, o que ajuda a decidir se uma ferramenta devolve respostas grandes demais. Cruzar sessões com o diretório mostra quais projetos concentram o uso. Nenhuma dessas perguntas exige um modelo, e todas cabem numa linha de SQL.",
        ]),
        code("bash", [
          "$ opencode session list",
          "$ opencode stats",
        ], "Terminal: as sessões do projeto e o resumo de uso"),
        code("text", [
          "Session ID",
          "primeira",
          "OVERVIEW",
          "Sessions",
          "Messages",
          "Total Cost",
        ], "Saída: a tabela de sessões e o quadro de uso"),
        porque([
          "As sessões ficam num banco SQLite. `opencode db \"consulta\" --format json` o consulta; `--continue` e `--session` retomam uma conversa, `--fork` a copia, e `session list` e `stats` resumem. O histórico inteiro segue em cada pedido, e por isso sessões longas custam mais.",
        ]),
        quebraria([
          "Uma pessoa mantém uma única sessão aberta por semanas, usando `--continue` para tudo. Cada pergunta nova carrega o histórico inteiro, o custo cresce e o modelo passa a se confundir com decisões antigas. Uma sessão por tarefa teria custado menos e respondido melhor.",
        ]),
      ],
    },
    {
      title: "Servidor e cliente: serve, attach e a API HTTP",
      order: 1,
      blocks: [
        prose([
          "O capítulo 1 anunciou que o OpenCode é um servidor com vários clientes, e esta seção põe a ideia em uso. `opencode serve` inicia só o servidor, sem interface, numa porta que se escolhe com `--port`, e qualquer outro processo conversa com ele. O cliente mais próximo é o próprio `opencode run --attach <endereço>`, que em vez de iniciar um servidor por conta própria usa o que já está de pé. A vantagem é a economia de partida: o servidor carrega a configuração, conecta os servidores MCP e abre o banco uma vez, e cada `run` seguinte é só uma mensagem. Para scripts que enviam dezenas de mensagens, a diferença é grande. E o histórico é compartilhado: uma sessão criada por um cliente aparece para os outros.",
          "",
          "O exemplo sobe o servidor do modelo falso na porta 4701, o servidor do OpenCode na 4640, envia uma mensagem por `--attach` e consulta a lista de sessões por HTTP com o `curl`. A resposta é um JSON com as sessões do projeto, e a que acabou de ser criada está lá com o título que o `--title` deu. O ponto de consulta `/global/health` responde se o servidor está de pé e qual é a versão, o que o torna o teste de saúde natural de um script que depende dele.",
          "",
          "Essa separação entre servidor e cliente abre arranjos que a interface de texto sozinha não permite. O mais comum é o do **servidor remoto**: o OpenCode roda numa máquina potente, perto do código e dos dados, e a pessoa trabalha de um computador leve, conectando-se com `opencode attach <endereço>`, que abre a mesma interface de texto, só que ligada ao servidor distante. A opção `--dir` existe para esse caso, e o texto de ajuda a descreve como o diretório em que o comando roda, ou o caminho no servidor remoto quando se usa `--attach`: o caminho é o da máquina do servidor, não o do cliente. Outro arranjo é o dos **editores**, que se ligam ao servidor pelo protocolo que o comando `opencode acp` implementa, e o da interface no navegador, `opencode web`. Os três usam a mesma sessão e o mesmo histórico.",
          "",
          "Alguns pontos da API merecem ser conhecidos. O fluxo de eventos em `/event` entrega, por Server-Sent Events, tudo o que acontece no servidor em tempo real, o que basta para construir um painel de acompanhamento. A lista de permissões pendentes em `/permission` e a rota de resposta a cada uma permitem que um programa **decida** os pedidos de permissão, no lugar de uma pessoa, e isso desloca a pergunta de segurança: quem implementa a decisão passa a ser o autor desse programa, e a lógica dele deve ser revisada como uma política. Por fim, as rotas de sessão permitem criar conversas, enviar mensagens, abortar uma execução, desfazer alterações e compartilhar, o que dá a um script o mesmo controle que a pessoa tem, com a mesma necessidade de cuidado.",
        ]),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode serve --port 4640 &",
          "$ opencode run --attach http://127.0.0.1:4640 --title via-servidor Ola",
          "$ curl -s http://127.0.0.1:4640/global/health",
          "$ curl -s http://127.0.0.1:4640/session",
        ], "Terminal (modelo falso): o servidor, um cliente por attach e duas consultas HTTP"),
        code("text", [
          "> build · falso",
          "{\"healthy\":true,\"version\":\"1.18.5\"}[{\"id\":…\"title\":\"via-servidor\"…",
        ], "Saída: o teste de saúde e a sessão criada pelo cliente, vista pelo servidor"),
        prose([
          "A API completa está descrita em `/doc`, um documento OpenAPI que o servidor serve e que qualquer cliente HTTP lê. Ele lista os pontos de consulta: sessões e mensagens, comandos, agentes, habilidades, servidores MCP, permissões pendentes e um fluxo de eventos em `/event`. Tudo o que a interface de texto faz, ela faz por essa API, o que significa que qualquer coisa que a interface faça, um script também pode: criar uma sessão, enviar uma mensagem, responder a uma pergunta de permissão. É esse último caso que torna o servidor a base das integrações de verdade, como um painel que mostra as sessões em andamento ou um bot que aprova pedidos de permissão.",
        ]),
        code("bash", [
          "$ curl -s http://127.0.0.1:4640/doc",
        ], "Terminal: o documento que descreve a API"),
        code("text", [
          "\"openapi\": \"3.1.0\",",
          "\"/event\": {",
          "\"/permission\": {",
          "\"/session\": {",
        ], "Saída: o OpenAPI e alguns dos caminhos que ele descreve"),
        porque([
          "`opencode serve` inicia só o servidor e `run --attach` o usa, poupando a partida a cada mensagem. A API HTTP, descrita em `/doc`, é a mesma que a interface de texto usa: sessões, mensagens, permissões e eventos.",
        ]),
        quebraria([
          "Um script de integração contínua chama `opencode run` quarenta vezes seguidas, e cada chamada reinicia o servidor, relê a configuração e reconecta os servidores MCP. Um `opencode serve` iniciado uma vez e quarenta `run --attach` teriam feito o mesmo trabalho em uma fração do tempo.",
        ]),
      ],
    },
    {
      title: "Proteger o servidor: loopback, senha e CORS",
      order: 2,
      blocks: [
        prose([
          "Um servidor que aceita mensagens e executa ferramentas é um alvo, e a configuração padrão do OpenCode escolhe o lado seguro de um jeito simples: escuta só no **loopback**, o endereço `127.0.0.1`, que só é alcançável por programas da própria máquina. A opção `--hostname` muda isso, e `--mdns` anuncia o servidor na rede local; qualquer um dos dois deixa de ser seguro por padrão quando a máquina está numa rede com outras pessoas. Mesmo no loopback, um servidor sem senha aceita pedidos de **qualquer** programa que rode na máquina, inclusive um script malicioso instalado por outra coisa, e é por isso que a senha existe.",
          "",
          "A senha é definida pela variável de ambiente `OPENCODE_SERVER_PASSWORD`; o nome de usuário é `opencode`, a menos que `OPENCODE_SERVER_USERNAME` diga outro. É autenticação básica de HTTP, o que significa que o `curl` a envia com `-u`. O exemplo sobe um servidor com senha e faz duas chamadas à mesma rota: sem credenciais, que recebe `401` (não autorizado), e com elas, que recebe `200`. O capítulo 1 mostrou as opções `--username` e `--password` de `run`: são elas que um `run --attach` usa para falar com um servidor protegido. Nos exemplos, `NUL` é o destino descartável do Windows; no Linux e no macOS, escreva `/dev/null`.",
        ]),
        code("bash", [
          "$ OPENCODE_SERVER_PASSWORD=segredo opencode serve --port 4641 &",
          "$ curl -s -o NUL -w \"%{http_code} \" http://127.0.0.1:4641/session",
          "$ curl -s -o NUL -w \"%{http_code} \" -u opencode:segredo http://127.0.0.1:4641/session",
        ], "Terminal: o mesmo caminho, sem credenciais e com credenciais"),
        code("text", [
          "401 200",
        ], "Saída: sem senha, 401; com a senha certa, 200"),
        prose([
          "O resultado vale a leitura. Sem a senha, o servidor nem chega a olhar o pedido: devolve o código de não autorizado, e as sessões, o histórico e as ferramentas ficam fora do alcance. Com a senha, o comportamento é o normal. Em uso, a senha deve vir de um cofre ou de uma variável de ambiente do processo, nunca de um arquivo versionado nem da linha de comando de um programa que outras pessoas da máquina possam listar; as regras de segredos do capítulo 2 valem aqui.",
          "",
          "Há um segundo aspecto, o das páginas da web. O navegador deixa um site qualquer enviar pedidos a `127.0.0.1`, e um servidor sem senha é alcançável por uma página aberta numa aba. O OpenCode limita a origem desses pedidos com a política de CORS, e `--cors` acrescenta origens permitidas, para quem constrói uma interface web própria. Cada origem acrescentada é uma página que passa a poder falar com o servidor, e a lista deve ser curta e conhecida. A regra de ouro é a mesma de qualquer serviço: o que não precisa estar acessível não deve estar, e o que precisa deve exigir autenticação.",
          "",
          "Um aviso sobre o que a senha **não** faz. A autenticação básica de HTTP envia o usuário e a senha em texto, codificados mas não cifrados, a cada pedido. No loopback isso não importa, porque o tráfego não sai da máquina. Numa rede, sem TLS, qualquer pessoa no caminho lê a senha e passa a controlar o agente. A consequência é prática: um servidor acessado de outra máquina deve ficar atrás de um túnel cifrado (como o de SSH) ou de um proxy reverso com TLS, e a porta do OpenCode continua fechada para a rede. A senha, então, é a segunda camada, que protege dos outros programas da própria máquina e de quem alcançar o túnel por engano, e não a primeira.",
          "",
          "Os cuidados com a senha são os de qualquer segredo. Ela não deve aparecer na linha de comando de um programa, onde a lista de processos a mostra para os outros usuários da máquina; o ambiente do processo é um lugar melhor, e um arquivo lido por `{file:}`, quando o assunto é configuração, melhor ainda. Deve ser longa e aleatória, porque ninguém a digita. E deve ser trocada quando uma pessoa sai do projeto ou quando houver suspeita de vazamento, o que, para um servidor de vida curta iniciado por um script, significa simplesmente gerar uma senha nova a cada execução.",
        ]),
        porque([
          "O servidor escuta só em `127.0.0.1` por padrão; `--hostname` e `--mdns` o abrem para a rede. `OPENCODE_SERVER_PASSWORD` liga a autenticação básica (usuário `opencode`), e sem ela qualquer programa da máquina é aceito. `--cors` acrescenta origens de páginas web permitidas.",
        ]),
        quebraria([
          "Alguém sobe o servidor com `--hostname 0.0.0.0` para acessá-lo do celular, em uma rede de cafeteria, sem senha. Qualquer pessoa na rede pode criar sessões e mandar o agente executar comandos na máquina. A senha e, melhor, uma conexão por túnel teriam fechado a porta.",
        ]),
      ],
    },
    {
      title: "Automação: eventos em JSON, consultas e limpeza",
      order: 3,
      blocks: [
        prose([
          "Para quem automatiza, o `opencode run` tem uma forma de saída pensada para programas: `--format json`. Em vez do texto formatado, o comando imprime uma linha de JSON por **evento** do que aconteceu: o início de um passo, cada parte de texto, cada chamada de ferramenta, o fim do passo. O formato é o de um fluxo de eventos, uma linha por evento, e se lê linha a linha, sem precisar esperar o fim. O exemplo escreve um pequeno leitor de eventos, que imprime o tipo de cada um e, quando há texto, o texto, e liga a saída do `run` à entrada dele por um pipe do shell.",
        ]),
        code("js", [
          "import { createInterface } from \"node:readline\";",
          "",
          "createInterface({ input: process.stdin }).on(\"line\", (linha) => {",
          "  const evento = JSON.parse(linha);",
          "  console.log(\"evento:\", evento.type, evento.part?.text ?? \"\");",
          "});",
        ], "eventos.mjs: lê o fluxo de eventos e imprime o tipo de cada um"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run --format json Ola | node eventos.mjs",
        ], "Terminal (modelo falso): a saída do run entregue a outro programa"),
        code("text", [
          "evento: step_start",
          "evento: text Entendido.",
          "evento: step_finish",
        ], "Saída: três eventos, na ordem em que aconteceram"),
        prose([
          "A estrutura é a base de qualquer integração. Um painel pode acompanhar o progresso de um agente lendo os eventos; um script de integração contínua pode extrair o texto final e publicá-lo como comentário de revisão; um registro pode guardar os eventos de ferramenta para auditoria, com a vantagem, sobre o plugin do capítulo 9, de que não depende de plugin nenhum nem pode ser desligado por `--pure`. O que não é possível é deduzir o sucesso da tarefa: o evento de fim de passo diz que o modelo terminou, não que acertou, e conferir o resultado (testes, diff, revisão) continua sendo trabalho do script.",
          "",
          "As consultas SQL da primeira seção completam a caixa de ferramentas. Perguntas como \"quantas sessões esta semana\", \"qual sessão tem mais mensagens\" ou \"que ferramentas foram mais chamadas\" são consultas ao banco, com a vantagem de rodarem sem nenhum modelo e de poderem ser agendadas. O custo e o uso de tokens estão guardados por mensagem, e `opencode stats` os soma; a consulta direta permite cortes que o resumo não faz, como o gasto por agente ou por dia.",
          "",
          "A exportação de uma sessão é feita por `opencode export`, que escreve o JSON da conversa. Sem um identificador, o comando abre uma seleção interativa, e por isso não se presta a scripts; com o identificador, que a tabela de `session list` ou uma consulta ao banco fornecem, ele é um comando comum. A opção `--sanitize` ofusca o conteúdo sensível da conversa e dos arquivos, e é o cuidado mínimo antes de enviar uma exportação para outra pessoa, porque uma sessão contém tudo o que foi lido e escrito, inclusive o que não devia ter sido. `opencode import` faz o caminho contrário, a partir de um arquivo JSON ou de um endereço de compartilhamento.",
          "",
          "Reunidas, as peças formam o roteiro de uma execução de agente em integração contínua, e vale enumerar as decisões que o roteiro exige. O **modelo** é fixado por `-m` ou pela configuração, para que a execução de hoje seja comparável à de ontem. As **permissões** são escritas por extenso, com `allow` para o que a tarefa precisa e `deny` para o que nunca pode acontecer, como o capítulo 5 mostrou, porque `ask` vira recusa e encerra a rodada. A **saída** vai em `--format json` para um arquivo do job, que serve de registro. O **servidor MCP**, se houver, é conferido com `opencode mcp ls` antes da tarefa, para que uma integração falha não passe despercebida. O **tempo** é limitado por quem chama, com o mecanismo de limite do próprio sistema de integração, porque um agente preso em um laço custa dinheiro até alguém o interromper. E o **resultado** é sempre conferido por algo que não seja o próprio agente: testes, análise estática ou uma revisão humana.",
          "",
          "Ao final, o histórico da execução fica no banco da máquina que a rodou, e a pergunta de onde ele vai parar tem de ter resposta. Em máquinas efêmeras, o banco desaparece com a máquina, o que é seguro e limita a auditoria ao arquivo de eventos que o job guardou. Em máquinas permanentes, o banco acumula, e a política de retenção do começo do capítulo passa a ser uma tarefa agendada. O que não se deve fazer é deixar o histórico em um lugar compartilhado sem ter decidido isso.",
        ]),
        code("bash", [
          "$ opencode export --help",
        ], "Terminal: as opções da exportação"),
        code("text", [
          "--sanitize redact sensitive transcript and file data",
        ], "Saída: a opção que ofusca o conteúdo sensível"),
        porque([
          "`run --format json` imprime um evento por linha (início de passo, texto, ferramenta, fim de passo), que um programa lê pelo pipe. O banco responde perguntas de uso por SQL; `export` sem id é interativo, e `--sanitize` ofusca o que for sensível antes de compartilhar.",
        ]),
        quebraria([
          "Uma equipe exporta uma sessão de depuração e a envia a um fornecedor para pedir ajuda. A sessão tinha o conteúdo de um `.env` lido sem querer, e o fornecedor passa a ter as chaves. `--sanitize` não é garantia total, mas a revisão da exportação antes de enviar é o hábito que teria evitado o vazamento.",
        ]),
      ],
    },
  ],
};

export const OPENCODE_BOOK_10_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "intermediate",
    promptMd: "Uma sessão tem duas mensagens. Você roda `opencode run --continue Mais uma` e depois consulta o banco com `select count(*) from session` e `select count(*) from message`. Que valores esperar?",
    choices: [
      "Uma sessão e quatro mensagens, porque --continue retoma a última sessão do projeto",
      "Duas sessões e quatro mensagens, porque cada run cria uma sessão nova",
      "Uma sessão e duas mensagens, porque as mensagens novas ficam fora do banco",
      "Duas sessões e duas mensagens, porque --continue copia a sessão sem mensagens",
    ],
    answerKeyMd: "Uma sessão e quatro mensagens, porque --continue retoma a última sessão do projeto",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "intermediate",
    promptMd: "Um script chama `opencode run` quarenta vezes seguidas e leva minutos a mais do que o esperado. Explique o que acontece a cada chamada e como o servidor e o `--attach` melhoram o tempo, indicando um cuidado de segurança ao subir o servidor.",
    answerKeyMd: "Cada `opencode run` sem `--attach` inicia o seu próprio servidor: carrega a configuração, conecta os servidores MCP configurados, abre o banco e só então envia a mensagem, repetindo esse custo quarenta vezes. Com `opencode serve --port N` iniciado uma vez e `opencode run --attach http://127.0.0.1:N` em cada chamada, a partida é paga uma vez e cada execução é só uma mensagem; o histórico é compartilhado no mesmo banco. O cuidado: o servidor aceita mensagens e executa ferramentas, então deve ficar no loopback padrão (127.0.0.1), com `OPENCODE_SERVER_PASSWORD` definida (os clientes usam `--username`/`--password` ou as variáveis), e não deve ser exposto com `--hostname 0.0.0.0` ou `--mdns` sem autenticação.",
    rubricMd: "Descreve o custo de partida repetido; propõe serve + attach; menciona loopback padrão e senha; alerta para hostname/mdns sem autenticação.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "Uma equipe quer registrar, para auditoria, todas as chamadas de ferramenta que os agentes fazem em integração contínua, sem depender de um plugin que `--pure` desligaria. Descreva duas abordagens possíveis com o que este capítulo mostrou, o que cada uma registra e suas limitações.",
    answerKeyMd: "Primeira abordagem: rodar os agentes com `opencode run --format json` e guardar o fluxo de eventos (um JSON por linha) num arquivo do job, filtrando os eventos de ferramenta; não depende de plugin e não pode ser desligado por `--pure`, mas registra só o que o cliente que a executa viu, e depende de o job usar sempre essa forma. Segunda abordagem: consultar o banco de sessões depois da execução com `opencode db \"select ...\" --format json` (tabelas `session`, `message` e `part` guardam as chamadas de ferramenta e os resultados), com a vantagem de poder cruzar por sessão, agente e dia; a limitação é que o banco fica na máquina que rodou, é preciso preservá-lo (ou exportá-lo com `--sanitize` para revisão) e o histórico pode ser apagado por quem controla a máquina. Em ambos os casos, o registro prova o que o agente fez, não que foi correto, e deve passar por filtragem de segredos antes de ser guardado.",
    points: 20,
  },
];

export const OPENCODE_BOOK_10_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Onde ficam as sessões e como consultá-las?", backMd: "Num banco SQLite (`opencode db path`). `opencode db \"select …\" --format json` consulta; as tabelas incluem session, message e part. `session list` e `stats` resumem." },
  { nodeTitle: NODE, frontMd: "O que fazem --continue, --session e --fork?", backMd: "`--continue` retoma a última sessão do projeto, `--session` uma específica pelo id, e `--fork` copia a conversa para uma sessão nova antes de continuar." },
  { nodeTitle: NODE, frontMd: "Para que servem `opencode serve` e `run --attach`?", backMd: "`serve` inicia só o servidor (API HTTP descrita em `/doc`); `run --attach` envia mensagens a ele sem pagar a partida a cada chamada. `/global/health` é o teste de saúde." },
  { nodeTitle: NODE, frontMd: "Como proteger o servidor?", backMd: "Mantê-lo no loopback (padrão 127.0.0.1), definir `OPENCODE_SERVER_PASSWORD` (autenticação básica, usuário `opencode`) e limitar `--cors`. `--hostname` e `--mdns` abrem para a rede." },
  { nodeTitle: NODE, frontMd: "Como um programa lê o que o `run` fez?", backMd: "Com `--format json`: um evento JSON por linha (step_start, text, tool, step_finish). O fim de passo não diz que a tarefa deu certo." },
];
