// OpenCode, reescrita autoral (PLANO.md §R.2) — capítulo 3.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Instruções: o que o agente lê antes de cada pedido";

export const OPENCODE_BOOK_03: ContentChapter = {
  title: NODE,
  level: "basico",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Ver o que o OpenCode envia ao modelo",
      order: 0,
      blocks: [
        prose([
          "Escrever instruções para um agente é escrever para um leitor que não se vê. Você redige um arquivo de regras, abre uma sessão e espera que o modelo as tenha lido; se ele responde de um jeito que as contraria, a dúvida é se o arquivo chegou até ele ou se chegou e foi ignorado. São problemas diferentes, de soluções diferentes, e sem olhar o que de fato foi enviado não há como separá-los. Este capítulo parte de uma ideia simples: o OpenCode conversa com o modelo por requisições de rede, e uma requisição pode ser lida. Se o modelo for substituído por um servidor nosso, que não responde nada de útil e apenas guarda cada pedido que recebe, passamos a enxergar exatamente o que o programa monta: o texto de sistema, a mensagem do usuário e a lista de ferramentas que o modelo pode usar.",
          "",
          "Esse servidor é o **modelo falso**, um arquivo de vinte e poucas linhas. Ele escuta numa porta local, imita o protocolo de chat que a maioria dos provedores adota (o chamado compatível com a OpenAI), grava cada pedido no arquivo `pedidos.jsonl` e responde sempre \"Entendido.\". Como a resposta é fixa, o resultado de uma execução é previsível, e como o pedido fica gravado, tudo o que o OpenCode enviou pode ser examinado depois, sem chave de provedor, sem custo e sem rede. Ele vai ser a base de quase todos os capítulos seguintes: sempre que o livro afirmar que o OpenCode \"entrega ao modelo\" uma regra, uma ferramenta ou um comando, o que se vê é uma linha de `pedidos.jsonl`.",
          "",
          "Para o OpenCode falar com ele, o modelo falso precisa existir na configuração como um provedor. O bloco `provider` define o nome `eco`, o pacote `@ai-sdk/openai-compatible`, o adaptador que sabe falar o protocolo, o endereço do servidor em `baseURL` e uma lista de modelos, com um só: `falso`. O campo `model` escolhe `eco/falso` como padrão, no formato `provedor/modelo` do capítulo 1. Daí em diante, `opencode run Ola` já não procura nenhum serviço na internet.",
        ]),
        code("js", [
          "// Uso: node modelo-falso.mjs --port 4701",
          "import { createServer } from \"node:http\";",
          "import { appendFileSync } from \"node:fs\";",
          "",
          "const porta = Number(process.argv[process.argv.indexOf(\"--port\") + 1]);",
          "const pedaco = (delta, fim) =>",
          "  \"data: \" + JSON.stringify({ id: \"1\", object: \"chat.completion.chunk\", created: 1, model: \"falso\", choices: [{ index: 0, delta, finish_reason: fim }] }) + \"\\n\\n\";",
          "",
          "createServer((req, res) => {",
          "  let corpo = \"\";",
          "  req.on(\"data\", (c) => (corpo += c));",
          "  req.on(\"end\", () => {",
          "    if (!req.url.endsWith(\"/chat/completions\")) { res.writeHead(404); res.end(); return; }",
          "    appendFileSync(\"pedidos.jsonl\", corpo + \"\\n\");",
          "    res.writeHead(200, { \"content-type\": \"text/event-stream\" });",
          "    res.write(pedaco({ role: \"assistant\", content: \"Entendido.\" }, null));",
          "    res.write(pedaco({}, \"stop\"));",
          "    res.end(\"data: [DONE]\\n\\n\");",
          "  });",
          "}).listen(porta, \"127.0.0.1\");",
        ], "modelo-falso.mjs: um servidor que guarda cada pedido e responde sempre a mesma coisa"),
        code("json", [
          "{",
          "  \"$schema\": \"https://opencode.ai/config.json\",",
          "  \"model\": \"eco/falso\",",
          "  \"provider\": {",
          "    \"eco\": {",
          "      \"npm\": \"@ai-sdk/openai-compatible\",",
          "      \"name\": \"Eco\",",
          "      \"options\": { \"baseURL\": \"http://127.0.0.1:4701/v1\" },",
          "      \"models\": { \"falso\": { \"name\": \"Falso\" } }",
          "    }",
          "  }",
          "}",
        ], "opencode.json: o modelo falso registrado como provedor"),
        code("js", [
          "// Uso: node ver-pedido.mjs [padrão] [número]",
          "// Mostra o modelo e as ferramentas oferecidas e, das mensagens do pedido e das",
          "// descrições das ferramentas, as linhas que casam com o padrão. O pedido é o",
          "// último, a menos que se dê outro número.",
          "import { readFileSync } from \"node:fs\";",
          "",
          "const padrao = new RegExp(process.argv[2] ?? \"^$\");",
          "const pedidos = readFileSync(new URL(\"pedidos.jsonl\", import.meta.url), \"utf8\")",
          "  .trim().split(\"\\n\").map((linha) => JSON.parse(linha))",
          "  .filter((pedido) => !String(pedido.messages[0].content).startsWith(\"You are a title generator\"));",
          "const pedido = pedidos.at(Number(process.argv[3] ?? -1));",
          "const ferramentas = pedido.tools ?? [];",
          "",
          "console.log(\"pedidos:\", pedidos.length, \"| modelo:\", pedido.model, \"| ferramentas:\", ferramentas.map((f) => f.function.name).join(\",\"));",
          "for (const mensagem of pedido.messages) {",
          "  const texto = typeof mensagem.content === \"string\" ? mensagem.content : mensagem.content.map((parte) => parte.text ?? JSON.stringify(parte)).join(\"\\n\");",
          "  console.log(\"[\" + mensagem.role + \"] \" + texto.length + \" caracteres\");",
          "  for (const linha of texto.split(\"\\n\")) if (padrao.test(linha)) console.log(\"  \" + linha);",
          "}",
          "for (const ferramenta of ferramentas) {",
          "  for (const linha of String(ferramenta.function.description).split(\"\\n\")) {",
          "    if (padrao.test(linha)) console.log(\"  (\" + ferramenta.function.name + \") \" + linha);",
          "  }",
          "}",
        ], "ver-pedido.mjs: mostra as ferramentas e as linhas de cada mensagem que casam com um padrão"),
        prose([
          "O segundo script lê o `pedidos.jsonl` e resume o último pedido. Ele ignora os pedidos que começam com \"You are a title generator\": o OpenCode faz também uma chamada extra, para dar um título à sessão, e esse pedido, que não é o do usuário, atrapalharia a leitura. Primeiro vêm o modelo que recebeu o pedido e os nomes das ferramentas oferecidas. Depois, para cada mensagem, o script imprime o papel (`system`, `user`), o tamanho do texto e as linhas que casam com o padrão dado na linha de comando; as descrições das ferramentas passam pelo mesmo filtro. Sem padrão, só os tamanhos aparecem, o que já ensina algo.",
        ]),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ node ver-pedido.mjs \"^You are opencode\"",
        ], "Terminal: o servidor sobe em segundo plano, uma mensagem é enviada e o pedido é lido"),
        code("text", [
          "Entendido.",
          "> build · falso",
          "pedidos: 1 | modelo: falso | ferramentas: bash,edit,glob,grep,read,skill,task,todowrite,webfetch,write",
          "[system] … caracteres",
          "  You are opencode, an interactive CLI tool…",
          "[user] 3 caracteres",
        ], "Saída: a resposta fixa e o resumo do pedido"),
        prose([
          "A saída tem três informações. A primeira é a linha `> build · falso`, que mostra o **agente** (`build`, o padrão do capítulo 1) e o **modelo** (`falso`) que atenderam o pedido. A segunda é a lista de **ferramentas**: dez nomes, as capacidades que o modelo recebe junto com a mensagem. `read`, `glob` e `grep` leem e procuram; `edit` e `write` alteram arquivos; `bash` roda comandos; `webfetch` busca páginas; `todowrite` mantém uma lista de tarefas; `task` chama subagentes; `skill` carrega habilidades. O modelo só consegue fazer o que está nessa lista, e é por ela que o capítulo 9 explica como acrescentar ferramentas e o capítulo 5 como limitá-las.",
          "",
          "A terceira informação é a do tamanho: a mensagem `system` tem quase dez mil caracteres, e a do usuário, três, as da palavra `Ola`. A diferença deixa uma lição de economia: o texto que o OpenCode monta antes de você dizer qualquer coisa é cerca de três mil vezes maior que a sua mensagem, e cada instrução adicional que você escreve se soma a esses dez mil caracteres em **todos** os pedidos da sessão, não uma vez só. Ela voltará nas seções seguintes. A linha de sistema começa por `You are opencode`, a apresentação que o programa dá ao modelo; o que vem a seguir, e que o `ver-pedido` filtrou, é o prompt interno do OpenCode, ao qual as suas instruções são acrescentadas.",
        ]),
        porque([
          "O OpenCode fala com o modelo por requisições, e uma requisição pode ser gravada. Com um modelo falso que guarda o pedido, vê-se o texto de sistema, a mensagem do usuário e as ferramentas oferecidas, sem chave de provedor e sem custo.",
        ]),
        quebraria([
          "Alguém escreve um arquivo de regras, vê o modelo ignorá-las e passa a reescrevê-las com mais ênfase, em maiúsculas. O arquivo nunca estava no pedido, por um nome errado, e nenhuma ênfase resolveria. Ler o pedido teria mostrado o problema na primeira tentativa.",
        ]),
      ],
    },
    {
      title: "AGENTS.md: as regras do projeto, de cima para baixo",
      order: 1,
      blocks: [
        prose([
          "O arquivo `AGENTS.md` é o lugar combinado para dizer ao agente como trabalhar num projeto: que comandos rodam os testes, que convenções de código valem, o que nunca se deve tocar. O nome é uma convenção compartilhada por várias ferramentas de agente, e isso importa: o mesmo arquivo serve a quem usa o OpenCode e a quem usa outra ferramenta, e a equipe mantém um único documento de regras. O OpenCode não apenas o lê: ele o procura em mais de um lugar e junta tudo o que encontra, e a ordem em que junta é parte do contrato.",
          "",
          "A primeira fonte é o **`AGENTS.md` global**, na pasta de configuração do usuário (a pasta `config` que `opencode debug paths` mostrou no capítulo 1). É o lugar das suas preferências pessoais, que valem em qualquer projeto: o idioma das respostas, o estilo de commit, o que você nunca quer que o agente faça. A segunda fonte são os `AGENTS.md` do **projeto**: o OpenCode parte da pasta onde o comando roda e sobe pelas pastas pai, coletando o arquivo de cada uma, até chegar à raiz do repositório. Um `AGENTS.md` numa subpasta, portanto, só entra no pedido quando o trabalho acontece dentro dela, e o da raiz entra sempre.",
          "",
          "O exemplo cria os três: um global, um na raiz e um em `src`. Cada arquivo tem uma linha que começa com `REGRA-`, só para a saída poder ser lida com facilidade. Como a ordem dos blocos no texto de sistema decide qual regra aparece mais perto do fim do prompt, e o fim é o que os modelos tendem a pesar mais, vale conferi-la em vez de supô-la. O comando roda duas vezes: da raiz do projeto e de dentro de `src`. O script lê o pedido mais recente, de modo que cada leitura mostra o que a execução anterior enviou.",
        ]),
        code("markdown", [
          "REGRA-GLOBAL minhas preferências valem em qualquer projeto.",
        ], "Global AGENTS.md: as preferências pessoais, na pasta de configuração do usuário"),
        code("markdown", [
          "# Regras do projeto",
          "REGRA-RAIZ responda em português.",
        ], "AGENTS.md: as regras do projeto, na raiz"),
        code("markdown", [
          "REGRA-SRC dentro de src, use tabs.",
        ], "src/AGENTS.md: as regras de uma subpasta"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ node ver-pedido.mjs \"^Instructions from:|^REGRA\"",
        ], "Terminal (modelo falso): trabalhando na raiz do projeto"),
        code("text", [
          "[system] … caracteres",
          "  Instructions from: <tmp>\\config\\opencode\\AGENTS.md",
          "  REGRA-GLOBAL minhas preferências valem em qualquer projeto.",
          "  Instructions from: <projeto>\\AGENTS.md",
          "  REGRA-RAIZ responda em português.",
          "[user] 3 caracteres",
        ], "Saída: o global primeiro, depois o da raiz; o de src ficou de fora"),
        prose([
          "Cada bloco vem com uma linha `Instructions from:` que diz de onde o texto veio. Isso torna o prompt autoexplicativo para o modelo, que sabe que a regra de `src` é de `src`, e torna a verificação possível para você: o caminho impresso é o arquivo que o OpenCode realmente leu, o que afasta a dúvida clássica de \"será que ele pegou a cópia certa?\". A ordem é a da generalidade: do mais geral (global) ao mais específico. Na raiz, o `AGENTS.md` de `src` não aparece, porque a pasta de trabalho não passa por ele.",
        ]),
        code("bash", [
          "$ cd src",
          "$ opencode run Ola",
          "$ node ../ver-pedido.mjs \"^Instructions from:|^REGRA\"",
        ], "Terminal (modelo falso): o mesmo comando, de dentro de src"),
        code("text", [
          "  Instructions from: <tmp>\\config\\opencode\\AGENTS.md",
          "  Instructions from: <projeto>\\src\\AGENTS.md",
          "  REGRA-SRC dentro de src, use tabs.",
          "  Instructions from: <projeto>\\AGENTS.md",
          "  REGRA-RAIZ responda em português.",
        ], "Saída: de dentro de src, o arquivo mais próximo vem antes do da raiz"),
        prose([
          "Dentro de `src`, o `AGENTS.md` da subpasta entra, e entra **antes** do da raiz: depois do global, vem o arquivo mais próximo do trabalho, e só então o mais distante. A consequência prática é que uma regra local não precisa repetir a regra geral, e uma regra geral não precisa conhecer as exceções locais. Quando as duas se contradizem, os dois textos estão no prompt, e o modelo decide com base em um sinal fraco, a posição, o que não é uma garantia: se uma subpasta realmente precisa de comportamento oposto ao da raiz, escreva-o dizendo explicitamente que vale no lugar da regra geral. Instruções não têm sobreposição por campo, como a configuração do capítulo 2; têm apenas concatenação.",
          "",
          "Na prática, a regra de ouro é pôr cada instrução no nível mais alto em que ela continua verdadeira. O comando que roda os testes do projeto inteiro vai na raiz; a convenção da pasta de componentes vai na pasta de componentes; a preferência de idioma, que acompanha a pessoa e não o código, vai no arquivo global. Uma instrução no nível errado custa de dois jeitos: alta demais, polui o pedido de quem trabalha em outra área e dilui as regras que importam para ela; baixa demais, deixa de chegar a quem precisava dela. Revisar os `AGENTS.md` de um repositório perguntando, de cada frase, \"em que pasta isto deixa de ser verdade?\" costuma resolver quase todos os casos, e a leitura do pedido a partir de duas pastas diferentes confirma o resultado.",
        ]),
        porque([
          "O OpenCode junta o `AGENTS.md` global e os do projeto, subindo da pasta de trabalho até a raiz, e imprime de onde veio cada bloco. A ordem vai do geral ao específico; arquivos de subpastas só entram quando o trabalho acontece nelas.",
        ]),
        quebraria([
          "Uma equipe escreve a regra \"os testes ficam em test/\" no `AGENTS.md` de uma subpasta. Quem abre o OpenCode na raiz nunca a vê no pedido, e o agente cria testes em lugares aleatórios. Ler o pedido a partir da raiz teria mostrado que a regra, onde estava, só valia para quem trabalha dentro da subpasta.",
        ]),
      ],
    },
    {
      title: "O campo instructions, o CLAUDE.md e os arquivos que não existem",
      order: 2,
      blocks: [
        prose([
          "O `AGENTS.md` cobre o caso comum, mas nem todo conjunto de regras mora nele. Um guia de estilo pode viver em `docs/estilo.md`, lido por pessoas e mantido por outra equipe; as regras de segurança de uma empresa podem estar num arquivo sob outro nome, compartilhado entre repositórios. Para trazê-los ao pedido sem copiá-los, a configuração tem o campo **`instructions`**, uma lista de caminhos. Cada item é um arquivo ou um padrão com curingas (`docs/**/*.md` pega todos os arquivos `.md` de `docs` e de suas subpastas), e o conteúdo de cada arquivo encontrado é acrescentado ao texto de sistema com a mesma linha `Instructions from:` que os `AGENTS.md` ganham.",
          "",
          "Duas regras de comportamento valem conhecer, e as duas pedem que se leia a saída em vez de confiar na memória. A primeira é que um caminho que não existe **não é erro**. O OpenCode ignora a entrada em silêncio, e a configuração carrega normalmente. Isso é cômodo quando a lista é compartilhada entre máquinas que nem todas têm todos os arquivos, mas é uma armadilha para quem digita o caminho errado: o arquivo de regras nunca entra no pedido, e nenhuma mensagem avisa. A única defesa é o hábito do capítulo 2: depois de mexer em `instructions`, ler o pedido com o modelo falso, que mostra exatamente o que entrou.",
          "",
          "A segunda regra diz respeito ao `CLAUDE.md`. Muitos projetos já têm esse arquivo, escrito para outra ferramenta de agente, e o OpenCode o aproveita como alternativa: quando **não há** `AGENTS.md`, o `CLAUDE.md` do projeto é lido no lugar dele. Havendo os dois, só o `AGENTS.md` vale, e o `CLAUDE.md` fica de fora. Esse comportamento ajuda quem migra de ferramenta, e atrapalha quem mantém os dois arquivos sem perceber, porque as edições feitas no que não vale não produzem efeito algum. O exemplo desta seção usa um projeto sem `AGENTS.md`, com um `CLAUDE.md` na raiz e uma lista `instructions` com um arquivo inexistente e um padrão com curinga.",
        ]),
        code("markdown", [
          "REGRA-CLAUDE reaproveitado de outra ferramenta.",
        ], "CLAUDE.md: um arquivo de regras escrito para outra ferramenta"),
        code("json", [
          "{",
          "  \"instructions\": [\"nao-existe.md\", \"docs/**/*.md\"]",
          "}",
        ], "opencode.json: um arquivo que não existe e um padrão com curinga"),
        code("markdown", [
          "REGRA-TOPO o guia de estilo geral.",
        ], "docs/estilo.md: um guia de estilo mantido fora do AGENTS.md"),
        code("markdown", [
          "REGRA-FUNDO as convenções de nomes.",
        ], "docs/api/nomes.md: um arquivo numa subpasta de docs"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Quero conferir",
          "$ node ver-pedido.mjs \"^Instructions from:|^REGRA\"",
        ], "Terminal (modelo falso): sem AGENTS.md, com instructions"),
        code("text", [
          "[system] … caracteres",
          "  Instructions from: <projeto>\\CLAUDE.md",
          "  REGRA-CLAUDE reaproveitado de outra ferramenta.",
          "  Instructions from: <projeto>\\docs\\estilo.md",
          "  REGRA-TOPO o guia de estilo geral.",
          "  Instructions from: <projeto>\\docs\\api\\nomes.md",
          "  REGRA-FUNDO as convenções de nomes.",
        ], "Saída: o CLAUDE.md no lugar do AGENTS.md e os arquivos do curinga"),
        prose([
          "A saída mostra tudo o que se disse. O `CLAUDE.md` entrou porque não há `AGENTS.md`; os dois arquivos de `docs` entraram pelo curinga, na ordem em que o sistema de arquivos os lista; e o `nao-existe.md` não deixou rastro, nem erro, nem linha. Os arquivos de `instructions` vêm depois dos de regras do projeto, de modo que o que a configuração acrescenta fica no fim do prompt.",
          "",
          "Um uso importante do campo está em lembrar que ele segue as regras de camadas do capítulo 2. A lista `instructions` é **somada** entre as camadas, sem repetir entradas: o arquivo global pode listar o guia de segurança da empresa, e cada projeto acrescenta o seu, sem que um apague o outro. É a diferença em relação ao `disabled_providers`, que a camada mais forte substitui. Por isso o campo é o lugar certo para regras de organização, as que precisam chegar a todos os repositórios sem depender de que cada um se lembre de copiá-las.",
          "",
          "Resta saber quando usar `instructions` e quando escrever no `AGENTS.md`. O `AGENTS.md` serve ao que é do projeto e que quem abre o repositório deve encontrar na raiz, com o nome que as ferramentas conhecem. O `instructions` serve a arquivos que já existem por outro motivo: o guia de contribuição, o guia de estilo, as decisões de arquitetura. O ganho é não duplicar, porque a documentação e o pedido ao modelo saem da mesma fonte, e corrigir um corrige o outro. O custo é o peso: um arquivo trazido por `instructions` entra em todo pedido como se estivesse escrito no `AGENTS.md`, e um guia de contribuição de dez páginas, incluído por comodidade, troca clareza por tokens. Antes de incluir um documento inteiro, vale perguntar se o agente precisa de todo ele ou de um resumo de uma página.",
        ]),
        porque([
          "`instructions` traz arquivos e padrões com curinga para o texto de sistema; caminho inexistente é ignorado em silêncio; o `CLAUDE.md` só vale quando não há `AGENTS.md`; e as listas das camadas de configuração se somam.",
        ]),
        quebraria([
          "Alguém troca `docs/estilo.md` por `docs/guia-de-estilo.md` e esquece de atualizar a lista. O caminho antigo deixa de existir, o OpenCode ignora a entrada sem avisar, e durante semanas o agente trabalha sem o guia, enquanto todos supõem que ele o lê.",
        ]),
      ],
    },
    {
      title: "Instrução é conselho, não barreira",
      order: 3,
      blocks: [
        prose([
          "Há um equívoco comum no uso de agentes: tratar o arquivo de regras como se fosse um mecanismo de controle. Escreve-se \"nunca apague arquivos\", \"não rode comandos de rede\", e a pessoa dorme tranquila. Mas o que o `AGENTS.md` faz é pôr um texto no pedido; o que o modelo fará com ele é decisão do modelo. Modelos seguem instruções na imensa maioria das vezes, e falham em algumas, por ambiguidade, por conflito com o que o usuário pediu na mesma sessão ou por simples esquecimento quando o contexto cresce. Uma regra de instrução é um conselho muito bom. A barreira, o que impede de verdade uma ação, mora na configuração de permissões, assunto do capítulo 5.",
          "",
          "O pedido mostra essa diferença sem ambiguidade. O exemplo escreve um `AGENTS.md` que proíbe o uso da ferramenta `bash` e lê o pedido: a regra está no texto de sistema, e a ferramenta `bash` continua na lista oferecida ao modelo, ao lado das outras nove. O OpenCode entregou o conselho e entregou também o instrumento que o conselho proíbe. Se o modelo decidir usá-lo, nada no `AGENTS.md` o impedirá; o que o impediria é uma regra `deny` para `bash`, que o capítulo 5 ensina a escrever.",
          "",
          "A ressalva vale também no sentido oposto, e é a metade menos lembrada. Como cada instrução é enviada em todo pedido, uma regra inútil não é inofensiva: ela custa tokens a cada mensagem e dilui as regras que importam. Um `AGENTS.md` de duzentas linhas, onde metade repete o que o modelo já faz, gasta contexto e esconde a única linha que deveria ser seguida à risca. Os bons arquivos de regras são curtos e dizem apenas o que o agente erraria sem ajuda: o comando exato para rodar os testes, a pasta onde ficam os arquivos gerados que ninguém deve editar, a convenção de nomes que o código existente não deixa óbvia. Frases genéricas, como \"escreva código limpo\" ou \"siga as boas práticas\", não ensinam nada ao modelo e ocupam o lugar das que ensinam; uma instrução útil é específica o bastante para que alguém possa checar, em segundos, se ela foi obedecida ou não.",
        ]),
        code("markdown", [
          "REGRA-PROIBIDO nunca use a ferramenta bash neste projeto.",
        ], "AGENTS.md: uma regra que proíbe uma ferramenta"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ node ver-pedido.mjs \"^REGRA\"",
        ], "Terminal (modelo falso): a regra e a ferramenta no mesmo pedido"),
        code("text", [
          "pedidos: 1 | modelo: falso | ferramentas: bash,edit,glob,grep,read,skill,task,todowrite,webfetch,write",
          "  REGRA-PROIBIDO nunca use a ferramenta bash neste projeto.",
        ], "Saída: a regra chegou ao modelo, e a ferramenta continua disponível"),
        prose([
          "O OpenCode ainda ajuda a escrever o arquivo. Entre os comandos que ele traz embutidos há o `init`, descrito como \"guided AGENTS.md setup\": ao ser executado numa sessão, manda o agente examinar o repositório (manifestos, scripts de teste, configuração de integração contínua) e propor um `AGENTS.md` compacto. O texto do comando pede explicitamente que cada linha responda a uma pergunta: \"um agente erraria isto sem ajuda?\". Se a resposta é não, a linha não entra. É uma boa régua para revisar qualquer arquivo de regras, escrito à mão ou gerado. O servidor do OpenCode lista os comandos disponíveis, e o `init` está entre eles.",
          "",
          "Tratar as instruções como código é o fecho natural. Um arquivo de regras que muda a qualquer momento, sem revisão, deriva sem que ninguém perceba, e o modo de evitar isso é o mesmo de qualquer arquivo importante: ele mora no repositório, passa por revisão e tem um teste. O teste é pequeno com o modelo falso: subir o servidor, enviar uma mensagem e procurar no pedido a linha `Instructions from:` de cada arquivo que deveria estar ali. Se alguém renomear o guia de estilo e esquecer a lista, o teste falha na integração contínua, na mesma hora, e não semanas depois, quando o código já saiu fora do padrão. E um roteiro de revisão em três perguntas serve ao arquivo todo: a linha está no pedido? O modelo a seguiria sem ela? Se a violação seria grave, ela deveria ser uma permissão?",
        ]),
        code("bash", [
          "$ opencode serve --port 4630 &",
          "$ curl -s http://127.0.0.1:4630/command",
        ], "Terminal: os comandos que o servidor oferece"),
        code("text", [
          "\"name\": \"init\",",
          "\"description\": \"guided AGENTS.md setup\",",
        ], "Saída: o comando init, que ajuda a escrever o AGENTS.md"),
        porque([
          "A instrução entra no pedido como texto; o modelo decide o que fazer com ela. Quem impede uma ação é a permissão. Cada linha de regra é enviada em todo pedido, e por isso o arquivo deve ser curto e dizer só o que o agente erraria sozinho.",
        ]),
        quebraria([
          "Uma equipe escreve \"nunca apague arquivos\" no `AGENTS.md` e trata o assunto como resolvido. Numa sessão longa, o contexto cresce, a regra perde peso, e o agente remove uma pasta de build que parecia lixo. Uma regra `deny` para o comando de remoção teria impedido a ação, em vez de pedir ao modelo que se lembrasse.",
        ]),
      ],
    },
  ],
};

export const OPENCODE_BOOK_03_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "beginner",
    promptMd: "Um repositório tem `AGENTS.md` na raiz e outro em `packages/api/`. Alguém abre o OpenCode na raiz e pede uma alteração em `packages/api/rotas.ts`. Quais dos dois arquivos de regras entram no pedido enviado ao modelo?",
    choices: [
      "Só o da raiz, porque o OpenCode foi aberto na raiz e o de packages/api fica fora do caminho de trabalho",
      "Os dois, porque o OpenCode lê todos os AGENTS.md do repositório",
      "Só o de packages/api, porque é o mais próximo do arquivo alterado",
      "Nenhum dos dois, porque as regras só valem com o campo instructions",
    ],
    answerKeyMd: "Só o da raiz, porque o OpenCode foi aberto na raiz e o de packages/api fica fora do caminho de trabalho",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "beginner",
    promptMd: "O `opencode.json` de um projeto lista `\"instructions\": [\"docs/guia.md\"]`, mas a equipe renomeou o arquivo para `docs/guia-de-estilo.md` e nenhuma mensagem de erro apareceu. Explique por que não houve erro e como descobrir que o guia deixou de chegar ao agente.",
    answerKeyMd: "Um caminho inexistente em `instructions` é ignorado em silêncio: a configuração carrega normalmente, só que sem o conteúdo do arquivo. Para descobrir, é preciso olhar o que foi enviado ao modelo: com um modelo falso que grava os pedidos (ou outra forma de ler o texto de sistema), procurar a linha `Instructions from:` do guia; se ela não está no pedido, a entrada não casou com nenhum arquivo. A correção é atualizar o caminho na lista e repetir a leitura.",
    rubricMd: "Afirma que caminho inexistente é ignorado sem erro; propõe verificar o pedido enviado, e não a configuração; indica como localizar a linha Instructions from.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "intermediate",
    promptMd: "Uma empresa quer que o agente nunca rode `git push`, e o time de plataforma sugere escrever a regra \"não faça git push\" no `AGENTS.md` global de todos. Avalie a proposta: o que a regra garante, o que não garante e o que seria preciso complementar, citando o que o pedido ao modelo mostra sobre as ferramentas.",
    answerKeyMd: "A regra entra no texto de sistema de todo pedido e, na maioria das vezes, o modelo a seguirá; mas ela não impede nada: o pedido continua oferecendo a ferramenta `bash`, e o modelo pode usar `git push` por ambiguidade, por pedido do usuário na mesma sessão ou por esquecimento em contextos longos. Para garantir, é preciso uma permissão: uma regra `deny` para o padrão `git push*` na configuração de `bash`, de preferência na configuração global do usuário ou na da empresa, porque as permissões é que bloqueiam a execução. A regra no AGENTS.md ainda vale como complemento, porque explica ao modelo o motivo e evita tentativas, mas não como controle. Também convém manter o arquivo curto, porque cada linha é enviada em todo pedido.",
    points: 20,
  },
];

export const OPENCODE_BOOK_03_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Como ver o que o OpenCode envia ao modelo?", backMd: "Registrando um provedor local (modelo falso) que grava cada pedido num arquivo. No pedido aparecem o texto de sistema, a mensagem do usuário e as ferramentas oferecidas." },
  { nodeTitle: NODE, frontMd: "De onde o OpenCode lê regras e em que ordem?", backMd: "`AGENTS.md` global, `AGENTS.md` do projeto (da pasta de trabalho subindo até a raiz, o mais próximo antes) e depois os arquivos de `instructions`. Cada bloco traz `Instructions from:` com o caminho." },
  { nodeTitle: NODE, frontMd: "Quando o CLAUDE.md é usado?", backMd: "Só quando não há AGENTS.md. Havendo os dois, vale apenas o AGENTS.md." },
  { nodeTitle: NODE, frontMd: "O que acontece com um caminho inexistente em `instructions`?", backMd: "É ignorado em silêncio: sem erro e sem linha no pedido. Confira o pedido depois de editar a lista." },
  { nodeTitle: NODE, frontMd: "Uma regra no AGENTS.md impede o agente de usar uma ferramenta?", backMd: "Não. A regra é texto no pedido e a ferramenta continua oferecida. Quem bloqueia é a permissão `deny`." },
];
