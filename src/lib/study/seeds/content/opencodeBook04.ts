// OpenCode, reescrita autoral (PLANO.md §R.2) — capítulo 4.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Agentes: quem trabalha, com que instruções e com que ferramentas";

export const OPENCODE_BOOK_04: ContentChapter = {
  title: NODE,
  level: "basico",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Os agentes embutidos: build, plan e os de apoio",
      order: 0,
      blocks: [
        prose([
          "Um **agente**, no OpenCode, é um perfil de trabalho: um conjunto de instruções próprias, um modelo, uma lista de ferramentas e uma política de permissões, com um nome e uma descrição. A sessão que você abre sempre pertence a um agente; trocar de agente é trocar de perfil sem trocar de projeto. A ideia resolve um problema que o capítulo anterior deixou aberto, o de que uma única lista de instruções serve mal a tarefas diferentes. Pedir a revisão de um código e pedir a escrita de uma funcionalidade são trabalhos que querem permissões diferentes, e às vezes modelos diferentes, e um agente para cada um evita que as regras de um contaminem o outro.",
          "",
          "O OpenCode vem com alguns agentes prontos, e `opencode agent list` os mostra. Cada linha traz o nome e o **modo**: `primary` (primário) para os que podem ser escolhidos para conduzir uma sessão e `subagent` (subagente) para os que só são chamados por outros agentes, por meio da ferramenta `task`, assunto da última seção do capítulo. Os dois que o dia a dia usa são `build` e `plan`, ambos primários. O `build` é o padrão, com todas as ferramentas liberadas dentro das permissões da configuração, e é o agente que escreve código. O `plan` é o agente de análise: examina, propõe e não altera. Os subagentes `general` e `explore` ficam à disposição para tarefas delegadas, o primeiro para trabalhos de várias etapas e o segundo para buscas rápidas no código.",
          "",
          "A lista mostra também três nomes que não são para escolher: `compaction`, `summary` e `title`. São agentes internos, que o OpenCode usa por conta própria para compactar uma sessão longa, resumi-la e dar-lhe um título; o servidor os marca como ocultos. O `title`, em particular, é o responsável pelo pedido extra que o `ver-pedido` ignora desde o capítulo 3. Saber que eles existem evita estranhamento ao ver um modelo recebendo pedidos que o usuário nunca fez.",
        ]),
        code("bash", [
          "$ opencode agent list",
        ], "Terminal: os agentes que o OpenCode traz"),
        code("text", [
          "build (primary)",
          "explore (subagent)",
          "general (subagent)",
          "plan (primary)",
        ], "Saída: dois agentes primários e dois subagentes entre os que se escolhem"),
        prose([
          "A diferença entre `build` e `plan` merece olhar de perto, porque ela não está onde se imagina. Seria natural supor que o `plan` recebe uma lista de ferramentas menor, sem `edit` nem `write`. O pedido ao modelo mostra outra coisa: as dez ferramentas continuam oferecidas nos dois casos. O `plan` é diferente em duas camadas. Na das permissões, as edições estão negadas, o que o capítulo 5 detalha. E no texto da mensagem: o OpenCode acrescenta à mensagem do usuário um lembrete em formato `system-reminder`, que declara o modo de planejamento ativo e proíbe qualquer alteração. O exemplo pede a mesma mensagem aos dois agentes e compara o tamanho da mensagem do usuário que chegou ao modelo.",
        ]),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run --agent plan Ola",
          "$ node ver-pedido.mjs \"Plan mode ACTIVE\"",
        ], "Terminal (modelo falso): a mensagem Ola enviada ao agente plan"),
        code("text", [
          "> plan · falso",
          "pedidos: 1 | modelo: falso | ferramentas: bash,edit,glob,grep,read,skill,task,todowrite,webfetch,write",
          "[user] 1488 caracteres",
          "  CRITICAL: Plan mode ACTIVE - you are in READ-ONLY phase. STRICTLY FORBIDDEN:",
        ], "Saída: a mensagem do usuário ganhou um lembrete de modo de planejamento"),
        code("bash", [
          "$ opencode run --agent build Ola",
          "$ node ver-pedido.mjs \"Plan mode ACTIVE\"",
        ], "Terminal (modelo falso): a mesma mensagem enviada ao agente build"),
        code("text", [
          "> build · falso",
          "pedidos: 2 | modelo: falso | ferramentas: bash,edit,glob,grep,read,skill,task,todowrite,webfetch,write",
          "[user] 3 caracteres",
        ], "Saída: a mensagem chegou como foi escrita"),
        prose([
          "A mensagem `Ola` tem três caracteres no `build` e chegou com quase mil e quinhentos no `plan`. A diferença é o lembrete, e o fato de ele estar no texto do usuário e não só nas permissões tem uma razão prática: quem lê a conversa depois vê, na própria mensagem, em que modo o agente trabalhava. A consequência para quem escreve agentes é que o texto é um dos dois mecanismos de controle que existem, e que ele, sozinho, não impede nada, como o capítulo 3 mostrou. O `plan` só é confiável porque também tem as permissões que o `build` não tem.",
          "",
          "Essa mesma lista de ferramentas idêntica nos dois agentes antecipa o que as seções seguintes exploram. Quando um agente declara que **nega** uma ferramenta por inteiro (sem exceções de padrão), o OpenCode a retira da lista enviada ao modelo, e o modelo nem fica sabendo que ela existe. Quando a negação tem exceções, a ferramenta continua na lista, e a permissão decide na hora da execução. É por isso que o `plan`, que pode escrever o próprio plano num arquivo de planejamento, mantém `edit` e `write` oferecidos.",
        ]),
        porque([
          "Agente é um perfil: instruções, modelo, ferramentas e permissões, com nome e modo. O `build` escreve, o `plan` analisa, `general` e `explore` são subagentes, e `compaction`, `summary` e `title` são internos. O `plan` difere pelo lembrete no texto e pelas permissões, não pela lista de ferramentas.",
        ]),
        quebraria([
          "Alguém troca para o agente `plan` achando que as ferramentas de escrita foram removidas e sai do computador deixando uma tarefa longa. Se a configuração de permissões do projeto tiver liberado a edição por padrão, o `plan` herda a liberação, e o texto do lembrete é o único freio. Conferir as permissões do `plan` com `opencode debug agent plan` antes de confiar nele é o hábito certo.",
        ]),
      ],
    },
    {
      title: "Criar um agente com um arquivo markdown",
      order: 1,
      blocks: [
        prose([
          "A maneira mais simples de criar um agente é escrever um arquivo `.md` na pasta `.opencode/agent/` do projeto. O nome do arquivo, sem a extensão, é o nome do agente; o corpo do arquivo é o **prompt**, o texto que descreve o papel do agente; e um bloco de **frontmatter** no topo, entre duas linhas de `---`, guarda o resto da configuração: `description`, que explica quando usar o agente e que aparece nas listas; `mode`, que escolhe entre `primary`, `subagent` e `all`; `model`, quando o agente usa um modelo próprio; e `permission`, a política de permissões dele. A pasta `.opencode/agents/` no plural funciona do mesmo modo, e um arquivo em `agent/` dentro da pasta de configuração do usuário cria um agente que vale em todos os projetos.",
          "",
          "O exemplo cria o agente `revisor`, que deve apontar problemas sem corrigir nada, e por isso nega as permissões `edit` e `bash`. A primeira verificação é feita por `opencode debug agent revisor`, que imprime o agente como o OpenCode o entendeu: o modo, o prompt, se é um agente nativo (`false`, porque veio de um arquivo) e a descrição. A saída inclui também a lista completa de regras de permissão, longa demais para o livro; as linhas que interessam estão em destaque.",
        ]),
        code("markdown", [
          "---",
          "description: Revisa código sem alterar nada",
          "mode: primary",
          "permission:",
          "  edit: deny",
          "  bash: deny",
          "---",
          "Você é o revisor. REGRA-REVISOR aponte problemas, nunca corrija.",
        ], ".opencode/agent/revisor.md: um agente de revisão que não pode editar nem rodar comandos"),
        code("bash", [
          "$ opencode debug agent revisor",
        ], "Terminal: o agente como o OpenCode o entendeu"),
        code("text", [
          "\"name\": \"revisor\",",
          "\"mode\": \"primary\",",
          "\"native\": false,",
          "\"prompt\": \"Você é o revisor. REGRA-REVISOR aponte problemas, nunca corrija.\",",
          "\"description\": \"Revisa código sem alterar nada\",",
        ], "Saída: o nome, o modo e o prompt vieram do arquivo"),
        prose([
          "O resultado mais importante aparece quando o agente é usado. O texto do arquivo **substitui** o prompt padrão do OpenCode: o pedido do agente `revisor` tem pouco mais de mil caracteres, contra quase dez mil do `build`, porque os parágrafos sobre como usar as ferramentas, o estilo de resposta e a segurança deixaram de ser enviados. Fica o prompt do agente e o pequeno bloco com o modelo e o ambiente, que o OpenCode acrescenta sempre. Isso dá liberdade e responsabilidade: um agente escrito à mão começa do zero, e se o seu prompt não disser como trabalhar, o modelo depende só do que sabe por conta própria. Os agentes bem escritos costumam ser curtos e específicos, justamente por isso.",
          "",
          "A outra consequência é a lista de ferramentas. Como o `revisor` nega `edit` e `bash` por inteiro, sem exceções, as ferramentas `bash`, `edit` e também `write` deixam de ser oferecidas ao modelo. Ele não é só aconselhado a não editar: não tem o instrumento. É a camada de proteção que o texto do capítulo anterior não oferecia, e a razão de preferir uma permissão a uma frase.",
        ]),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run --agent revisor Ola",
          "$ node ver-pedido.mjs \"REGRA-REVISOR\"",
        ], "Terminal (modelo falso): o pedido do agente revisor"),
        code("text", [
          "> revisor · falso",
          "pedidos: 1 | modelo: falso | ferramentas: glob,grep,read,skill,task,todowrite,webfetch",
          "[system] … caracteres",
          "  Você é o revisor. REGRA-REVISOR aponte problemas, nunca corrija.",
          "[user] 3 caracteres",
        ], "Saída: bash, edit e write sumiram da lista, e o prompt padrão sumiu do texto"),
        prose([
          "Dois cuidados completam a seção. O primeiro é que um arquivo sem frontmatter não vira agente: o OpenCode o ignora, sem erro, e o agente simplesmente não aparece na lista; quem cria um arquivo só com o prompt e não vê o agente deve conferir `opencode agent list` e acrescentar ao menos a `description`. O segundo é que um valor inválido no frontmatter é recusado com a mensagem de erro do capítulo 2, citando o arquivo do agente: o exemplo escreve `mode: talvez` e o comando falha com o nome do arquivo e os valores aceitos. Essa mensagem, aliás, vale para todos os comandos, não só para o que lista agentes, e por isso um agente quebrado derruba o OpenCode inteiro naquele projeto até ser corrigido.",
          "",
          "Resta o terceiro valor de `mode`, `all`, que faz o agente valer nos dois papéis: aparece entre os que se escolhem para conduzir uma sessão e entre os que outro agente pode chamar. Serve a agentes pequenos e bem delimitados, como um que formata mensagens de commit, que fazem sentido tanto quando o usuário os invoca quanto quando o agente principal os delega. Para o resto, a regra é escolher o modo pelo papel: primário para o que conversa com o usuário, subagente para o que presta serviço a outro agente.",
        ]),
        code("markdown", [
          "---",
          "mode: talvez",
          "---",
          "Você é um agente de teste.",
        ], ".opencode/agent/teste.md: um modo que o OpenCode não conhece"),
        code("bash", [
          "$ opencode mcp list",
        ], "Terminal (falha de propósito): qualquer comando recusa o arquivo inválido"),
        code("text", [
          "Error: Configuration is invalid at <projeto>\\.opencode\\agent\\teste.md",
          "Expected \"subagent\" | \"primary\" | \"all\", got \"talvez\" mode",
        ], "Saída: a mensagem cita o arquivo do agente e os modos aceitos"),
        porque([
          "Um arquivo em `.opencode/agent/` vira um agente: nome do arquivo, frontmatter com `description`, `mode`, `model` e `permission`, e o corpo como prompt, que substitui o prompt padrão. Ferramentas negadas por inteiro somem da lista enviada ao modelo.",
        ]),
        quebraria([
          "Uma pessoa escreve um agente \"revisor\" só com instruções, sem frontmatter, e não o vê na lista. O arquivo foi ignorado sem aviso, e ela passa uma tarde reescrevendo o texto em vez de acrescentar as três linhas de cabeçalho.",
        ]),
      ],
    },
    {
      title: "Agentes na configuração JSON e um modelo para cada agente",
      order: 2,
      blocks: [
        prose([
          "Os mesmos agentes podem ser declarados no `opencode.json`, no campo `agent`, que é um objeto de nome de agente para configuração. Os campos são os do frontmatter, e o prompt vai no campo `prompt`, onde as substituições do capítulo 2 funcionam: `{file:./prompts/escritor.txt}` traz o texto de um arquivo, o que mantém prompts longos fora do JSON e permite editá-los como texto. A escolha entre markdown e JSON é de conveniência: o markdown é melhor para agentes com prompts longos, que se leem como documentos; o JSON, para configurações curtas ou para quem prefere um arquivo só.",
          "",
          "O campo que mais pesa na configuração de um agente é o **modelo**. Cada agente pode usar o seu, no formato `provedor/modelo` do capítulo 1, e o que não declara nenhum usa o `model` da configuração geral. É a base de uma estratégia comum: um modelo mais caro e capaz nos agentes que escrevem código, um mais barato nos que apenas buscam e resumem. O exemplo mostra isso com o modelo falso, que ganha um segundo modelo, `falso-2`. Repare que o arquivo de projeto repete o provedor `eco` com um só campo novo, e o OpenCode funde o objeto com o da configuração do usuário, onde o `falso` já estava: os dois modelos passam a existir, como a regra de fusão do capítulo 2 prevê.",
          "",
          "O pedido mostra o modelo que atendeu, tanto na linha que o `run` imprime (`> escritor · falso-2`) como no campo `modelo` da linha de resumo, que vem do próprio corpo da requisição. É a prova de que a escolha chegou ao provedor. Um agente com modelo próprio é a forma mais direta de controlar custo, porque o modelo é o fator que mais pesa na conta.",
        ]),
        code("text", [
          "Você escreve com clareza. REGRA-ESCRITOR use frases curtas.",
        ], "prompts/escritor.txt: o prompt do agente, fora do JSON"),
        code("json", [
          "{",
          "  \"provider\": { \"eco\": { \"models\": { \"falso-2\": { \"name\": \"Falso 2\" } } } },",
          "  \"agent\": {",
          "    \"escritor\": {",
          "      \"description\": \"Escreve textos claros\",",
          "      \"mode\": \"primary\",",
          "      \"model\": \"eco/falso-2\",",
          "      \"prompt\": \"{file:./prompts/escritor.txt}\"",
          "    }",
          "  }",
          "}",
        ], "opencode.json: um agente com prompt de arquivo e modelo próprio"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run --agent escritor Ola",
          "$ node ver-pedido.mjs \"REGRA-ESCRITOR\"",
        ], "Terminal (modelo falso): o agente escritor usa o segundo modelo"),
        code("text", [
          "> escritor · falso-2",
          "pedidos: 1 | modelo: falso-2 | ferramentas: bash,edit,glob,grep,read,skill,task,todowrite,webfetch,write",
          "  Você escreve com clareza. REGRA-ESCRITOR use frases curtas.",
        ], "Saída: o modelo de cada agente chegou ao provedor"),
        prose([
          "Quando o mesmo agente é descrito nos dois lugares, o OpenCode junta as duas descrições campo a campo, e as camadas do capítulo 2 decidem quem vence: o arquivo da pasta `.opencode` fica acima do `opencode.json` da raiz. O exemplo declara o agente `analista` no JSON, com um modelo, e no markdown, com outra descrição. O agente final tem a descrição do markdown e o modelo do JSON. Nenhum dos dois apagou o outro, e é por isso que dividir a configuração de um agente em dois lugares funciona, e confunde quem não conhece a regra: ao procurar de onde vem cada campo, o `debug agent` mostra o resultado, e as camadas explicam por quê.",
          "",
          "A escolha do modelo por agente é onde a economia se decide. Um agente que lê dezenas de arquivos para responder a uma pergunta consome muito mais tokens de entrada do que um que escreve uma função; pôr o primeiro num modelo barato e o segundo num modelo capaz reduz a conta sem reduzir a qualidade onde ela importa. O contrário, um modelo caro em todos os agentes, é o padrão de quem não olhou a conta; e um modelo barato em todos, o de quem não olhou o resultado. Há ainda o `small_model` da configuração, que o OpenCode usa para tarefas auxiliares como o título da sessão: ele é independente do `model` e pode apontar para o modelo mais barato do provedor sem afetar o trabalho principal. A regra prática é começar com um modelo só, observar o que cada agente consome e só então separar, porque cada modelo a mais é uma coisa a mais para manter e para explicar a quem herdar a configuração.",
          "",
          "Ao conferir uma configuração herdada, vale ler três coisas em `opencode debug agent`: o modelo de cada agente, o prompt e as permissões. Os três podem vir de arquivos diferentes, e é comum que um deles esteja onde ninguém espera.",
        ]),
        code("markdown", [
          "---",
          "description: Analisa dados, versão da pasta .opencode",
          "mode: primary",
          "---",
          "Você analisa números.",
        ], ".opencode/agent/analista.md: o agente descrito em markdown"),
        code("json", [
          "{",
          "  \"agent\": {",
          "    \"analista\": { \"description\": \"Versão do JSON\", \"model\": \"eco/falso-2\" }",
          "  }",
          "}",
        ], "opencode.json: o mesmo agente, descrito de outro jeito"),
        code("bash", [
          "$ opencode debug agent analista",
        ], "Terminal: os dois arquivos somados"),
        code("text", [
          "\"mode\": \"primary\",",
          "\"modelID\": \"falso-2\"",
          "\"prompt\": \"Você analisa números.\",",
          "\"description\": \"Analisa dados, versão da pasta .opencode\",",
        ], "Saída: a descrição é do markdown, o modelo é do JSON"),
        porque([
          "O campo `agent` do `opencode.json` aceita os mesmos campos do frontmatter, e `{file:...}` traz prompts de arquivo. Cada agente pode ter o seu modelo, no formato `provedor/modelo`; a mesma descrição em markdown e JSON é somada campo a campo, e a pasta `.opencode` vence.",
        ]),
        quebraria([
          "Uma equipe descreve o agente `revisor` no JSON, com o modelo barato, e alguém cria um markdown de mesmo nome com `model` de um modelo caro, sem saber do JSON. O markdown vence e a conta cresce sem que o arquivo de configuração principal, que todos revisam, mude uma linha.",
        ]),
      ],
    },
    {
      title: "Subagentes: delegar um trabalho com a ferramenta task",
      order: 3,
      blocks: [
        prose([
          "Um **subagente** é um agente que só trabalha quando outro o chama. A chamada é feita pela ferramenta `task`, que o agente principal recebe junto com as demais, e o que a diferencia de qualquer outra ferramenta é que, em vez de rodar um comando, ela abre uma **sessão filha**, entrega a ela uma tarefa em texto e devolve ao agente principal apenas a resposta final. O contexto do subagente é novo: ele não vê a conversa do agente principal, só o texto da tarefa. É um mecanismo de isolamento, com duas consequências boas, que são o contexto principal não ser poluído por dezenas de leituras de arquivo e a possibilidade de o subagente usar outro modelo e outras permissões, e uma consequência que exige cuidado, que é a tarefa precisar conter tudo o que o subagente precisa saber, porque não há mais nada.",
          "",
          "O agente principal escolhe a quem delegar lendo a descrição da própria ferramenta `task`, que o OpenCode monta com a lista dos subagentes existentes e suas `description`. Por isso a `description` de um subagente é a sua propaganda: um agente descrito como \"Pesquisa no código e não altera nada\" é escolhido para pesquisar, e um descrito como \"Agente útil\" não é escolhido para nada em particular. Para testar o fluxo inteiro sem um modelo de verdade, o modelo falso ganha uma segunda capacidade: se existir um arquivo `roteiro.json`, ele responde, a cada pedido, com o passo seguinte do roteiro, que pode ser um texto ou uma chamada de ferramenta. Os pedidos de título não consomem passos, e reescrever o `roteiro.json` faz a sequência recomeçar do primeiro passo.",
        ]),
        code("js", [
          "// Uso: node modelo-falso.mjs --port 4701",
          "// Um servidor que imita a API de chat compatível com a da OpenAI: guarda cada pedido em",
          "// pedidos.jsonl e responde com o próximo passo de roteiro.json (texto ou chamada de ferramenta).",
          "// Reescrever o roteiro faz a sequência recomeçar.",
          "import { createServer } from \"node:http\";",
          "import { appendFileSync, existsSync, readFileSync, statSync } from \"node:fs\";",
          "",
          "const porta = Number(process.argv[process.argv.indexOf(\"--port\") + 1]);",
          "const pedaco = (delta, fim) =>",
          "  \"data: \" + JSON.stringify({ id: \"1\", object: \"chat.completion.chunk\", created: 1, model: \"falso\", choices: [{ index: 0, delta, finish_reason: fim }] }) + \"\\n\\n\";",
          "let chamada = 0;",
          "let versao = 0;",
          "",
          "createServer((req, res) => {",
          "  let corpo = \"\";",
          "  req.on(\"data\", (c) => (corpo += c));",
          "  req.on(\"end\", () => {",
          "    if (!req.url.endsWith(\"/chat/completions\")) { res.writeHead(404); res.end(); return; }",
          "    appendFileSync(\"pedidos.jsonl\", corpo + \"\\n\");",
          "    const pedido = JSON.parse(corpo);",
          "    const titulo = String(pedido.messages[0]?.content).startsWith(\"You are a title generator\");",
          "    const roteiro = existsSync(\"roteiro.json\") ? JSON.parse(readFileSync(\"roteiro.json\", \"utf8\")) : [];",
          "    if (existsSync(\"roteiro.json\") && statSync(\"roteiro.json\").mtimeMs !== versao) { versao = statSync(\"roteiro.json\").mtimeMs; chamada = 0; }",
          "    const passo = titulo ? \"Titulo\" : roteiro[chamada++] ?? \"Entendido.\";",
          "    res.writeHead(200, { \"content-type\": \"text/event-stream\" });",
          "    if (typeof passo === \"string\") {",
          "      res.write(pedaco({ role: \"assistant\", content: passo }, null));",
          "      res.write(pedaco({}, \"stop\"));",
          "    } else {",
          "      const chamadaDeFerramenta = { index: 0, id: \"chamada_\" + chamada, type: \"function\", function: { name: passo.ferramenta, arguments: JSON.stringify(passo.argumentos) } };",
          "      res.write(pedaco({ role: \"assistant\", tool_calls: [chamadaDeFerramenta] }, null));",
          "      res.write(pedaco({}, \"tool_calls\"));",
          "    }",
          "    res.end(\"data: [DONE]\\n\\n\");",
          "  });",
          "}).listen(porta, \"127.0.0.1\");",
        ], "modelo-falso.mjs: a versão que segue um roteiro de respostas e chamadas de ferramenta"),
        code("json", [
          "{",
          "  \"agent\": {",
          "    \"pesquisador\": {",
          "      \"description\": \"Pesquisa no código e não altera nada\",",
          "      \"mode\": \"subagent\",",
          "      \"prompt\": \"Você pesquisa. REGRA-PESQ só leia.\",",
          "      \"permission\": { \"edit\": \"deny\", \"bash\": \"deny\" }",
          "    }",
          "  }",
          "}",
        ], "opencode.json: um subagente que só lê"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"task\", \"argumentos\": { \"description\": \"Procurar\", \"prompt\": \"Procure a função somar\", \"subagent_type\": \"pesquisador\" } },",
          "  \"Achei em src/soma.ts.\",",
          "  \"Pronto, a função está em src/soma.ts.\"",
          "]",
        ], "roteiro.json: o modelo chama o subagente, recebe a resposta e conclui"),
        prose([
          "O roteiro descreve o que um modelo real faria: no primeiro pedido, chama a ferramenta `task` pedindo ao `pesquisador` que procure uma função; o subagente recebe o texto e responde \"Achei em src/soma.ts.\"; e o agente principal, de volta, escreve a conclusão. São três pedidos ao modelo, e o `ver-pedido` aceita o número do pedido como segundo argumento, a partir do zero. O primeiro é o do agente principal; o segundo, o do subagente; o terceiro, o do agente principal outra vez, agora com o resultado da tarefa.",
        ]),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ node ver-pedido.mjs \"pesquisador\" 0",
          "$ node ver-pedido.mjs \"REGRA-PESQ\" 1",
          "$ node ver-pedido.mjs \"Achei\" 2",
        ], "Terminal (modelo falso): os três pedidos de uma delegação"),
        code("text", [
          "> build · falso",
          "pedidos: 3 | modelo: falso | ferramentas: bash,edit,glob,grep,read,skill,task,todowrite,webfetch,write",
          "  (task) - pesquisador: Pesquisa no código e não altera nada",
          "pedidos: 3 | modelo: falso | ferramentas: glob,grep,read,skill,webfetch",
          "  Você pesquisa. REGRA-PESQ só leia.",
          "[user] 22 caracteres",
          "[tool] 119 caracteres",
          "  Achei em src/soma.ts.",
        ], "Saída: o principal vê o subagente, o subagente vê pouco, e o resultado volta como mensagem de ferramenta"),
        code("bash", [
          "$ opencode run --agent pesquisador Ola",
        ], "Terminal (modelo falso): pedir um subagente como agente da sessão"),
        code("text", [
          "agent \"pesquisador\" is a subagent, not a primary agent. Falling back to default agent",
          "> build · falso",
        ], "Saída: o OpenCode avisa e usa o agente padrão"),
        prose([
          "A saída conta a história em três atos. No primeiro, o agente `build` recebe a ferramenta `task`, cuja descrição lista o `pesquisador` com a frase de propaganda. No segundo, o pedido do subagente tem um prompt próprio, uma mensagem de usuário de vinte e dois caracteres (exatamente o texto da tarefa, \"Procure a função somar\") e apenas cinco ferramentas: ficaram de fora `bash`, `edit` e `write`, negadas pela configuração do subagente, e também `task` e `todowrite`, que os subagentes não recebem. No terceiro, a resposta do subagente volta ao principal dentro de uma mensagem de ferramenta, envolta em marcas `<task_result>`, e é só isso que o principal sabe do trabalho.",
          "",
          "Dois detalhes do uso. Um subagente não pode conduzir uma sessão: pedir `--agent pesquisador` ao `run` não o usa, e o OpenCode avisa que o agente é um subagente e volta ao padrão. E a sessão filha começa sempre do zero, a menos que a chamada de `task` informe o `task_id` de uma sessão anterior, caso em que ela é retomada com o histórico que tinha. A descrição da própria ferramenta resume o que se deve saber: a resposta do subagente não é visível ao usuário, o agente principal precisa resumi-la, e o texto da tarefa deve ser detalhado, porque o subagente só tem ele. Em consequência, o bom uso de subagentes pede disciplina de escrita: a tarefa é um pequeno documento, com o objetivo, o lugar onde procurar e o formato esperado da resposta, e não uma frase solta. Quem delega bem recebe respostas úteis; quem delega mal recebe respostas plausíveis e erradas, que são mais difíceis de notar.",
        ]),
        porque([
          "A ferramenta `task` abre uma sessão filha com contexto novo e devolve só a resposta final. O principal escolhe o subagente pela `description`, o subagente tem prompt, modelo e permissões próprios, e a tarefa precisa conter tudo o que ele deve saber.",
        ]),
        quebraria([
          "Um agente principal delega \"corrija o bug de que falamos\" a um subagente. O subagente não viu a conversa, não sabe qual bug e devolve uma resposta genérica; o principal a repassa ao usuário sem notar. A tarefa tinha de nomear o arquivo, o sintoma e o resultado esperado.",
        ]),
      ],
    },
  ],
};

export const OPENCODE_BOOK_04_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "beginner",
    promptMd: "Você cria `.opencode/agent/auditor.md` com o corpo \"Audite o código.\" e nenhum cabeçalho de frontmatter. Depois roda `opencode agent list`. O que acontece com o agente `auditor`?",
    choices: [
      "Não aparece na lista: sem frontmatter o arquivo é ignorado, sem erro",
      "Aparece como subagente, porque é o modo padrão",
      "Aparece como primário, com o corpo do arquivo como descrição",
      "O comando falha com um erro de configuração inválida",
    ],
    answerKeyMd: "Não aparece na lista: sem frontmatter o arquivo é ignorado, sem erro",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "beginner",
    promptMd: "Um agente `revisor` tem `permission: { edit: deny, bash: deny }`. Ao ler o pedido enviado ao modelo, a equipe nota que as ferramentas `edit`, `bash` e `write` não aparecem na lista de ferramentas. Explique por que isso acontece e em que isso difere de escrever \"não edite arquivos\" no prompt do agente.",
    answerKeyMd: "Quando uma ferramenta é negada por inteiro, sem exceções por padrão, o OpenCode a retira da lista de ferramentas enviada ao modelo: o modelo nem sabe que ela existe e não tem como chamá-la. Uma frase no prompt só pede ao modelo que não use a ferramenta, que continua oferecida; se ele a usar por engano, por ambiguidade ou por esquecimento em um contexto longo, nada o impede. A permissão `deny` remove o instrumento e, se a ferramenta ainda fosse chamada, a execução seria bloqueada; a frase no prompt, no máximo, ajuda a explicar o motivo.",
    rubricMd: "Explica que a negação total retira a ferramenta da lista; contrasta com a frase do prompt, que é conselho; menciona que o modelo não consegue chamá-la.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "intermediate",
    promptMd: "Uma equipe quer um agente principal que implementa tarefas com um modelo capaz e um subagente barato que só procura arquivos e resume trechos de código. Descreva como configurar os dois, o que o subagente precisa ter na `description` e na tarefa que recebe, e por que o principal não deve confiar na resposta sem conferir.",
    answerKeyMd: "O principal fica como `build` (ou um agente primário próprio) com o modelo capaz em `model`; o subagente é declarado em `.opencode/agent/buscador.md` ou no campo `agent` com `mode: subagent`, `model` do provedor mais barato e `permission` que nega `edit` e `bash`, o que também remove essas ferramentas do pedido dele. A `description` precisa dizer quando usá-lo (por exemplo, \"Procura arquivos e resume trechos, sem alterar nada\"), porque o principal escolhe o subagente por ela. A tarefa enviada por `task` deve conter tudo: o que procurar, onde, o formato da resposta, porque a sessão filha começa sem a conversa. A resposta volta numa mensagem de ferramenta e é um resumo feito por um modelo mais fraco: o principal deve conferir os trechos citados antes de agir, ou pedir ao subagente os caminhos e linhas exatos.",
    points: 20,
  },
];

export const OPENCODE_BOOK_04_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Quais são os agentes embutidos que se escolhem?", backMd: "`build` e `plan` (primários) e `general` e `explore` (subagentes). `compaction`, `summary` e `title` são internos." },
  { nodeTitle: NODE, frontMd: "Como criar um agente por arquivo?", backMd: "Um `.md` em `.opencode/agent/` (ou `agents/`, ou `agent/` na pasta do usuário): nome do arquivo = nome do agente, frontmatter com description, mode, model e permission, corpo = prompt. Sem frontmatter, o arquivo é ignorado." },
  { nodeTitle: NODE, frontMd: "O que acontece com o prompt padrão quando um agente tem prompt próprio?", backMd: "É substituído. O pedido fica com o prompt do agente mais o bloco de modelo e ambiente." },
  { nodeTitle: NODE, frontMd: "Uma ferramenta negada por inteiro aparece no pedido?", backMd: "Não. O OpenCode a retira da lista enviada ao modelo. Se a negação tem exceções por padrão, a ferramenta continua na lista." },
  { nodeTitle: NODE, frontMd: "O que o subagente vê quando é chamado por `task`?", backMd: "Só o texto da tarefa, com o prompt e as ferramentas dele. A resposta volta ao principal numa mensagem de ferramenta; a sessão filha começa do zero, a menos que se passe o `task_id`." },
];
