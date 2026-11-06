// OpenCode, reescrita autoral (PLANO.md §R.2) — capítulo 5.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Permissões: o que o agente pode fazer de verdade";

export const OPENCODE_BOOK_05: ContentChapter = {
  title: NODE,
  level: "intermediario",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Allow, ask e deny: o que o OpenCode faz com cada resposta",
      order: 0,
      blocks: [
        prose([
          "As instruções do capítulo 3 aconselham; as permissões decidem. Quando o modelo pede para usar uma ferramenta, o OpenCode consulta a política de permissões antes de executar qualquer coisa, e a política responde com uma entre três ações. **`allow`** executa sem perguntar. **`deny`** recusa e informa o modelo de que a ação é proibida por uma regra. **`ask`** pede uma decisão a quem está do outro lado: na interface de texto, aparece uma pergunta na tela, e a pessoa aprova ou nega. É a mesma política em qualquer lugar do programa, e a configuração que a descreve é o campo `permission`, que o capítulo 2 já mostrou sendo fundido entre as camadas.",
          "",
          "O que o livro ainda não tinha podido mostrar é o que acontece com cada ação, porque as ferramentas só são chamadas pelo modelo, e um modelo de verdade é imprevisível. O modelo falso do capítulo anterior resolve isso: com um `roteiro.json`, ele chama as ferramentas que o exemplo escolher, na ordem em que o exemplo escolher, e o OpenCode as trata como trataria as de um modelo real. O primeiro exemplo configura a ferramenta `bash` com três regras e dá ao modelo três comandos para tentar: um que a regra permite, um que ela proíbe e um que cai na regra de pergunta.",
          "",
          "O padrão `echo *` casa com qualquer comando que comece por `echo` e seja seguido de argumentos; `rm *` faz o mesmo com `rm`; e `*` casa com tudo. Os padrões usam o curinga `*` e comparam o comando inteiro, sem interpretar o shell: uma regra para `rm *` não vê `rm` escondido dentro de `bash -c \"rm x\"` ou de um script. Esse limite importa, e o capítulo 11 volta a ele como uma das armadilhas.",
        ]),
        code("json", [
          "{",
          "  \"permission\": {",
          "    \"bash\": { \"*\": \"ask\", \"echo *\": \"allow\", \"rm *\": \"deny\" }",
          "  }",
          "}",
        ], "opencode.json: bash pergunta por padrão, libera echo e proíbe rm"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"echo oi\", \"description\": \"Mostra uma mensagem\" } },",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"rm arquivo.txt\", \"description\": \"Apaga um arquivo\" } },",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"hostname\", \"description\": \"Mostra o nome da máquina\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: o modelo tenta três comandos e depois conclui"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ node ver-pedido.mjs \"prevents\"",
        ], "Terminal (modelo falso): três comandos, três respostas da política"),
        code("text", [
          "$ echo oi",
          "oi",
          "✗ rm arquivo.txt failed",
          "Error: The user has specified a rule which prevents you from using this specific tool call.…",
          "! permission requested: bash (hostname); auto-rejecting",
          "✗ hostname failed",
          "Error: The user rejected permission to use this specific tool call.",
          "pedidos: 3 | modelo: falso | ferramentas: bash,edit,glob,grep,read,skill,task,todowrite,webfetch,write",
          "[tool] … caracteres",
          "  The user has specified a rule which prevents you from using this specific tool call.…",
        ], "Saída: executado, recusado por regra e recusado por falta de quem responda"),
        prose([
          "A saída tem três atos, um por comando. O `echo oi` casou com a regra de liberação, rodou e imprimiu `oi`. O `rm arquivo.txt` casou com a regra de recusa: o OpenCode não executou nada, marcou a ferramenta como falha e devolveu ao modelo uma mensagem que cita a regra e lista as regras relevantes, de modo que o modelo sabe por que foi barrado e pode escolher outro caminho. E o `hostname` caiu na pergunta, com um desfecho que surpreende quem só usou a interface de texto: como o `opencode run` não tem ninguém para responder, o OpenCode escreveu `permission requested: bash (hostname); auto-rejecting` e **recusou**. Uma pergunta sem interlocutor vira recusa do usuário.",
          "",
          "A última parte da saída, vinda do `ver-pedido`, revela a diferença mais importante entre as duas negativas. O roteiro tinha quatro passos (três comandos e uma frase final), mas o modelo falso recebeu apenas **três** pedidos, e a frase final \"Terminei.\" nunca apareceu na tela. A recusa por regra volta ao modelo como resultado da ferramenta, e a conversa continua: o modelo leu a mensagem do `rm` e fez o pedido seguinte. A recusa do usuário, ao contrário, **encerra a rodada**: depois do `auto-rejecting`, o OpenCode não consulta mais o modelo. É a mesma lógica da interface de texto, onde negar uma permissão interrompe o agente até que a pessoa diga o que fazer. Por isso vale a pena ter regras `deny` explícitas para o que nunca deve acontecer: elas informam o modelo e deixam a conversa seguir, enquanto uma pergunta sem resposta derruba a tarefa inteira no meio.",
          "",
          "Esse comportamento do `ask` dentro do `run` é uma decisão de projeto que orienta o uso. Numa automação, tudo o que precisa ser permitido tem de estar escrito como `allow`, e tudo o que não pode acontecer, como `deny`; o que sobrar como `ask` será recusado. A alternativa, aprovar tudo o que não for negado, existe e tem nome: é a opção `--auto` do capítulo 1, que a última seção deste capítulo testa. Entre as duas, a primeira é a segura: fazer a lista do que se permite, em vez da lista do que se proíbe. Ela tem um custo que o exemplo deixa à vista: cada comando esquecido na lista interrompe a tarefa, o que obriga a escrever a lista com cuidado e a revisá-la quando o fluxo de trabalho mudar.",
        ]),
        porque([
          "A política responde allow, deny ou ask a cada chamada de ferramenta. Deny devolve ao modelo a regra que barrou; ask, num `run` sem ninguém para responder, vira recusa. Em automação, escreva o que se permite e o que se proíbe, e não conte com perguntas.",
        ]),
        quebraria([
          "Uma automação que roda `opencode run` toda noite deixa a ferramenta `bash` em `ask`. Na primeira pergunta sem resposta, a rodada termina sem relatório, e quem olha o resultado conclui que o agente travou. O problema era só a política sem nenhum `allow` para o comando de teste.",
        ]),
      ],
    },
    {
      title: "A ordem das regras: a última que casa vence",
      order: 1,
      blocks: [
        prose([
          "Quando um comando casa com mais de uma regra, o OpenCode precisa escolher uma, e a escolha segue uma regra simples e traiçoeira: **a última regra que casa é a que vale**. As regras são avaliadas na ordem em que aparecem, e cada uma que casa sobrepõe as anteriores. Isso contraria a leitura rápida, em que a regra \"mais específica\" venceria por ser específica: o OpenCode não mede especificidade nenhuma, só posição. Por isso a ordem é uma parte do significado da política: duas configurações com as mesmas regras em ordens diferentes se comportam de modos opostos. O desenho natural, e o recomendado, é escrever primeiro as regras gerais e depois as exceções, como em qualquer lista de especificidade crescente: `\"*\": \"ask\"` no começo, depois as liberações específicas, depois as proibições mais específicas ainda.",
          "",
          "O erro clássico é o inverso. Quem escreve `\"echo *\": \"deny\"` primeiro e `\"*\": \"allow\"` depois acredita ter proibido o `echo`, mas a regra do fim, que casa com tudo, vence a do começo. O exemplo mostra o erro em ação com o roteiro de um único comando, `echo um`. A configuração parece proibi-lo, e ele roda. Em seguida a mesma política é escrita na ordem certa, e o resultado se inverte.",
        ]),
        code("json", [
          "{",
          "  \"permission\": {",
          "    \"bash\": { \"echo *\": \"deny\", \"*\": \"allow\" }",
          "  }",
          "}",
        ], "opencode.json: a proibição vem antes da regra geral"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"echo um\", \"description\": \"Mostra um número\" } },",
          "  \"Pronto.\"",
          "]",
        ], "roteiro.json: um único comando"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Primeira tentativa",
        ], "Terminal (modelo falso): a regra geral, que vem depois, vence"),
        code("text", [
          "$ echo um",
          "um",
        ], "Saída: o echo rodou, apesar da proibição escrita antes"),
        code("json", [
          "{",
          "  \"permission\": {",
          "    \"bash\": { \"*\": \"allow\", \"echo *\": \"deny\" }",
          "  }",
          "}",
        ], "opencode.json: a regra geral vem antes da proibição"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"echo dois\", \"description\": \"Mostra outro número\" } },",
          "  \"Pronto.\"",
          "]",
        ], "roteiro.json: outro comando echo"),
        code("bash", [
          "$ opencode run Segunda tentativa",
        ], "Terminal (modelo falso): a proibição, que vem depois, vence"),
        code("text", [
          "✗ echo dois failed",
          "Error: The user has specified a rule which prevents you from using this specific tool call.…",
        ], "Saída: na ordem certa, o echo é recusado"),
        prose([
          "A ordem das chaves de um objeto JSON parece um detalhe de formatação, e aqui é o que decide o resultado: o OpenCode preserva a ordem em que as regras foram escritas. Isso se estende à fusão entre camadas do capítulo 2. Na configuração resolvida, as regras do arquivo global vêm primeiro e as do projeto depois, e por isso um projeto consegue sobrepor a política do usuário: suas regras são avaliadas por último e vencem as que casarem com o mesmo comando. A política global do usuário funciona, portanto, como um conjunto de padrões que cada projeto é livre de refinar, e não como uma proteção que o projeto não consiga alterar.",
          "",
          "Duas práticas evitam surpresas. A primeira é escrever as regras sempre do mais geral ao mais específico, com a regra `\"*\"` primeiro, e ler de baixo para cima na hora de revisar: a regra de baixo que casa é a que vale. A segunda é testar. Como o `modelo falso` permite escrever o roteiro de comandos que se quer testar, uma política de permissões pode ter um teste automatizado: para cada comando que não deve rodar, um roteiro, uma execução e uma verificação de que a saída mostra a recusa. Uma política de segurança que ninguém testou funciona na cabeça de quem a escreveu.",
          "",
          "Uma terceira prática diz respeito à leitura. Como o formato aceita comentários (capítulo 2), cada regra pode trazer uma linha que explica por que existe: quem pediu, que incidente a motivou, quando pode sair. Uma regra sem justificativa vira, em seis meses, uma regra que ninguém ousa remover e que ninguém sabe se ainda é necessária. Convém também agrupar as regras por finalidade, com as liberações de leitura juntas, as de escrita juntas e as proibições no fim. Há um motivo técnico para as proibições ficarem por último dentro de uma mesma ferramenta: como a última regra que casa vence, uma proibição escrita depois de todas as liberações não pode ser desfeita por nenhuma delas. O que ela não consegue é resistir às camadas posteriores, como a última seção deste capítulo mostra: um agente que declara `allow` para a mesma ferramenta fala depois do arquivo geral e vence. Revisar uma política de permissões se parece, portanto, com revisar código: pede exemplos que devem passar, exemplos que devem falhar e a pergunta sobre quem escreve depois, e não apenas a leitura do arquivo de cima para baixo com a esperança de que cada linha esteja certa.",
        ]),
        porque([
          "Nas regras de permissão a última que casa vence, e a ordem escrita é preservada. Escreva do geral ao específico, lembre que o projeto vem depois do global e teste a política com comandos de roteiro.",
        ]),
        quebraria([
          "Uma pessoa acrescenta `\"rm *\": \"deny\"` no começo de um objeto que já tinha `\"*\": \"allow\"` no fim. O `rm` continua liberado, porque a regra geral vem depois. Ela vê a proibição no arquivo, conclui que está protegida e descobre o contrário no dia em que o agente apaga uma pasta.",
        ]),
      ],
    },
    {
      title: "Arquivos, pastas de fora e segredos",
      order: 2,
      blocks: [
        prose([
          "As ferramentas de arquivo têm a sua parte da política. A permissão `edit` cobre as ferramentas que alteram arquivos (`edit` e `write`); a permissão `read` cobre a leitura; e há uma terceira, `external_directory`, que cobre qualquer acesso a uma pasta fora do projeto. As três têm padrões razoáveis para o agente `build`: ler e editar dentro do projeto é permitido, e o que sai do trivial pede decisão. Dois padrões de arquivo ganham tratamento especial: a leitura de `.env`, `*.env` e `*.env.*` é `ask`, porque esses arquivos costumam guardar segredos, e `*.env.example` é liberada, porque guarda apenas exemplos.",
          "",
          "O exemplo percorre os três comportamentos em duas rodadas. Na primeira, o modelo escreve um arquivo novo dentro do projeto e depois tenta ler um `.env`: a escrita roda, e o texto escrito pode ser conferido depois com o próprio `node`; a leitura cai em pergunta e, como o `run` não tem a quem perguntar, é recusada, e a rodada termina. Na segunda, o modelo tenta ler um arquivo da pasta acima do projeto, criado pelo exemplo com um nome relativo, `../fora.txt`, que é exatamente o que um modelo pediria. As duas são rodadas separadas de propósito: como a recusa de uma pergunta encerra a rodada, um segundo pedido delicado no mesmo roteiro nunca chegaria a acontecer.",
        ]),
        code("text", [
          "dado de uma pasta de fora",
        ], "../fora.txt: um arquivo na pasta acima do projeto"),
        code("text", [
          "SEGREDO=1234",
        ], ".env: um arquivo de segredos na raiz do projeto"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"write\", \"argumentos\": { \"filePath\": \"novo.txt\", \"content\": \"texto novo\" } },",
          "  { \"ferramenta\": \"read\", \"argumentos\": { \"filePath\": \".env\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: uma escrita no projeto e a leitura de um .env"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ node -e \"console.log(require('fs').readFileSync('novo.txt', 'utf8'))\"",
        ], "Terminal (modelo falso): o que roda, o que pergunta e o que ficou no disco"),
        code("text", [
          "← Write novo.txt",
          "Wrote file successfully.",
          "! permission requested: read (…\\.env); auto-rejecting",
          "✗ Read .env failed",
          "Error: The user rejected permission to use this specific tool call.",
          "texto novo",
        ], "Saída: a escrita aconteceu e a leitura do .env foi recusada"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"read\", \"argumentos\": { \"filePath\": \"../fora.txt\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: a leitura de um arquivo da pasta acima do projeto"),
        code("bash", [
          "$ opencode run Quero ler",
        ], "Terminal (modelo falso): uma leitura fora do projeto"),
        code("text", [
          "! permission requested: external_directory (…); auto-rejecting",
          "✗ Read … failed",
          "Error: The user rejected permission to use this specific tool call.",
        ], "Saída: a pasta de fora pede permissão própria e a rodada termina"),
        prose([
          "A escrita aconteceu e deixou o texto no disco, o que confirma que `edit` é liberada por padrão no `build`. A leitura do `.env` gerou um pedido de leitura, e a da pasta de cima gerou um pedido de `external_directory`, e o OpenCode recusou os dois. Nenhum dos conteúdos chegou ao modelo, e esse é o ponto do mecanismo: o segredo não é lido por descuido, e o agente enxerga o projeto, não o computador. Numa sessão interativa, os dois pedidos apareceriam como perguntas na tela. Aqui há uma lição de segurança que as perguntas escondem: uma pergunta pode ser aprovada por engano, por pressa ou por hábito, e uma regra `deny` não pode. Para o que nunca deve ser lido, como as chaves de produção, a configuração deve negar, não perguntar.",
          "",
          "A mesma política aceita `ask` também para escrita. Quem prefere supervisionar cada alteração configura `\"edit\": \"ask\"`, e a ferramenta continua oferecida ao modelo, ao contrário do que acontece com `deny`. A diferença é visível no pedido: com `ask`, a lista de ferramentas é a completa, e a recusa só vem na hora de executar. Já `\"edit\": \"deny\"` retira `edit` e `write` do pedido, como o agente `revisor` do capítulo 4 mostrou. A escolha é de quem precisa, em cada projeto: `ask` quando alguém acompanha a sessão, `deny` quando ninguém deve alterar nada.",
        ]),
        code("json", [
          "{",
          "  \"permission\": { \"edit\": \"ask\" }",
          "}",
        ], "opencode.json: toda edição passa a pedir confirmação"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"write\", \"argumentos\": { \"filePath\": \"relatorio.txt\", \"content\": \"rascunho\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: uma tentativa de escrever um arquivo"),
        code("bash", [
          "$ opencode run Quero escrever",
          "$ node ver-pedido.mjs XX",
        ], "Terminal (modelo falso): com ask, a ferramenta continua oferecida e a execução é recusada"),
        code("text", [
          "! permission requested: edit (…\\relatorio.txt); auto-rejecting",
          "✗ Write relatorio.txt failed",
          "pedidos: … | modelo: falso | ferramentas: bash,edit,glob,grep,read,skill,task,todowrite,webfetch,write",
        ], "Saída: a recusa veio na execução, e a lista de ferramentas continua completa"),
        prose([
          "Até aqui as regras trataram todos os arquivos do mesmo modo, e o caso comum pede o contrário: um agente de documentação que pode escrever em `docs/` e em nenhum outro lugar. A permissão `edit` aceita, como `bash`, um objeto de padrões, e os padrões de arquivo seguem a mesma regra de ordem: `\"*\": \"deny\"` primeiro, depois as aberturas. O que muda é a armadilha dos caminhos. O OpenCode compara o padrão com o caminho **absoluto** do arquivo, e um padrão como `docs/*.md` nunca casa com `/projeto/docs/guia.md`, porque o começo não é igual. O padrão que funciona é o que admite qualquer começo: `**/docs/*.md`. O exemplo escreve em `docs/` e em `src/` com a regra errada, e depois com a certa.",
        ]),
        code("json", [
          "{",
          "  \"permission\": { \"edit\": { \"*\": \"deny\", \"docs/*.md\": \"allow\" } }",
          "}",
        ], "opencode.json: um padrão relativo, que parece certo e não casa"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"write\", \"argumentos\": { \"filePath\": \"docs/guia.md\", \"content\": \"# Guia\" } },",
          "  { \"ferramenta\": \"write\", \"argumentos\": { \"filePath\": \"src/app.ts\", \"content\": \"const a = 1;\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: uma escrita em docs e outra em src"),
        code("bash", [
          "$ opencode run Quero documentar",
        ], "Terminal (modelo falso): com o padrão relativo, nenhuma das duas escritas passa"),
        code("text", [
          "✗ Write docs/guia.md failed",
          "Error: The user has specified a rule which prevents you from using this specific tool call.…",
          "✗ Write src/app.ts failed",
        ], "Saída: o padrão relativo não abriu nem docs"),
        code("json", [
          "{",
          "  \"permission\": { \"edit\": { \"*\": \"deny\", \"**/docs/*.md\": \"allow\" } }",
          "}",
        ], "opencode.json: o padrão que admite qualquer começo de caminho"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"write\", \"argumentos\": { \"filePath\": \"docs/guia.md\", \"content\": \"# Guia revisto\" } },",
          "  { \"ferramenta\": \"write\", \"argumentos\": { \"filePath\": \"src/app.ts\", \"content\": \"const b = 2;\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: as mesmas duas escritas, com conteúdo novo"),
        code("bash", [
          "$ opencode run Quero documentar de novo",
        ], "Terminal (modelo falso): com o padrão certo, docs passa e src continua barrado"),
        code("text", [
          "← Write docs/guia.md",
          "Wrote file successfully.",
          "✗ Write src/app.ts failed",
        ], "Saída: a escrita em docs passou e a de src foi recusada"),
        prose([
          "A lição do exemplo é uma regra de revisão, mais do que de sintaxe: nenhuma política de caminhos deve ser aceita sem o teste que a mostra funcionando nos dois sentidos, o arquivo que deve passar e o que deve ser barrado. O padrão errado falha em silêncio, no sentido seguro, porque barra tudo, e por isso é fácil de perceber; o perigo é o padrão errado no sentido oposto, um `allow` largo demais que libera mais do que se pretendia. Os dois se detectam do mesmo jeito, com um roteiro de duas escritas.",
        ]),
        porque([
          "`edit`, `read` e `external_directory` cobrem os arquivos; `.env` pergunta por padrão e pastas de fora também. `ask` mantém a ferramenta no pedido e recusa na execução sem interlocutor; `deny` por inteiro retira a ferramenta. Padrões de caminho são comparados com o caminho absoluto: use `**/docs/*.md`, não `docs/*.md`.",
        ]),
        quebraria([
          "Uma equipe libera `external_directory` com `allow` para o agente ler um repositório vizinho e esquece de restringir o padrão. O agente passa a poder ler qualquer pasta do computador, inclusive a de chaves de acesso. Um padrão que nomeie só o repositório vizinho dá o acesso necessário e nenhum a mais.",
        ]),
      ],
    },
    {
      title: "Permissões por agente, ferramenta removida e --auto",
      order: 3,
      blocks: [
        prose([
          "A política da configuração geral vale para todos os agentes, e cada agente pode ter a sua, no campo `permission` do arquivo ou do bloco JSON. As regras do agente são acrescentadas **depois** das da configuração, e como a última regra que casa vence, o agente consegue tanto restringir como liberar o que a política geral decidiu. É a mecânica que permite desenhar uma equipe de agentes: uma política conservadora na configuração geral, para todos, e agentes especializados que abrem exatamente o que precisam. O exemplo mostra os dois lados com a ferramenta `bash`. A configuração geral a nega por completo; o agente `build`, que a herda, deixa de recebê-la, e se o modelo tentar chamá-la, o OpenCode responde que a ferramenta não existe e lista as que existem. O agente `ops`, que declara `bash: allow` no próprio arquivo, a recupera.",
        ]),
        code("json", [
          "{",
          "  \"permission\": { \"bash\": \"deny\" }",
          "}",
        ], "opencode.json: nenhum agente roda comandos, a menos que declare o contrário"),
        code("markdown", [
          "---",
          "description: Executa operações de manutenção",
          "mode: primary",
          "permission:",
          "  bash: allow",
          "---",
          "Você executa operações de manutenção. REGRA-OPS use sempre comandos curtos.",
        ], ".opencode/agent/ops.md: um agente que reabre o bash para si"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"echo ops\", \"description\": \"Mostra o nome do agente\" } },",
          "  \"Feito.\"",
          "]",
        ], "roteiro.json: o modelo tenta rodar um comando"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ node ver-pedido.mjs XX 0",
        ], "Terminal (modelo falso): o agente padrão tenta usar um bash que não lhe foi dado"),
        code("text", [
          "> build · falso",
          "Invalid Tool",
          "Model tried to call unavailable tool 'bash'.",
          "pedidos: 2 | modelo: falso | ferramentas: edit,glob,grep,read,skill,task,todowrite,webfetch,write",
        ], "Saída: sem bash na lista, a chamada do modelo é rejeitada como ferramenta inexistente"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"echo ops-de-novo\", \"description\": \"Mostra de novo\" } },",
          "  \"Feito.\"",
          "]",
        ], "roteiro.json: o mesmo pedido, agora ao agente que tem bash"),
        code("bash", [
          "$ opencode run --agent ops Ola",
          "$ node ver-pedido.mjs XX 2",
        ], "Terminal (modelo falso): o agente ops recupera a ferramenta"),
        code("text", [
          "> ops · falso",
          "$ echo ops-de-novo",
          "ops-de-novo",
          "pedidos: 4 | modelo: falso | ferramentas: bash,edit,glob,grep,read,skill,task,todowrite,webfetch,write",
        ], "Saída: a regra do agente, avaliada por último, reabriu o bash"),
        prose([
          "A segunda metade do exemplo prova a precedência. O agente `ops` herdou o `deny` da configuração geral, mas a sua própria regra vem depois, e o `allow` venceu: a ferramenta voltou ao pedido e o comando rodou. O desenho serve à segurança no sentido certo (a política conservadora é o ponto de partida de todos), mas exige o cuidado oposto na revisão: a política efetiva de um agente é a soma da geral com a própria, e quem lê só o arquivo geral não vê as aberturas. A leitura correta é `opencode debug agent` de cada agente, com atenção às regras do fim da lista.",
          "",
          "A opção `--auto` do capítulo 1 pode agora ser testada com precisão. Ela aprova o que estaria em `ask` e preserva o que está em `deny`. O exemplo final usa a política do começo do capítulo, com `ask` para tudo e `deny` para `rm`, e dois comandos: um qualquer e um `rm`. Com `--auto`, o primeiro roda sem ninguém aprovar, e o segundo continua barrado. A opção, portanto, não desliga a política; ela transforma as perguntas em respostas afirmativas. O que a torna perigosa é o que sobra: um comando que ninguém previu, que não casou com nenhuma regra de recusa, será executado. A defesa é a lista de `deny` ser abrangente o bastante para o pior caso, e a outra metade da defesa é o ambiente: rodar o agente num repositório limpo, numa máquina sem credenciais valiosas, onde o pior caso é só uma pasta apagada.",
          "",
          "Resta o roteiro de auditoria que decorre de tudo isso. Para saber o que cada agente de um projeto pode fazer, a pergunta não se responde lendo um arquivo: é preciso examinar cada agente, porque a política efetiva é a soma da configuração geral, das regras do agente e do que as camadas de configuração do capítulo 2 acrescentaram. O `opencode debug agent <nome>` imprime a lista completa de regras na ordem em que são avaliadas, e as últimas são as que decidem. Para um primeiro olhar, mais rápido, basta o pedido ao modelo falso: se uma ferramenta não aparece na lista, está negada por inteiro para aquele agente; se aparece, o agente pode, ao menos, tentar. Conferir os dois, para cada agente, antes de ligar uma automação, leva minutos e torna a política uma coisa que se sabe, e não que se supõe. O resultado da auditoria também deve ser guardado, num arquivo de decisões do projeto ou no próprio `AGENTS.md`, porque a pergunta \"quem pode rodar comandos aqui?\" volta sempre que alguém cria um agente novo, e a resposta anterior poupa o trabalho de refazer a investigação a cada vez. Se o resultado mudar, a diferença entre as duas auditorias é justamente o que merece ser lido com atenção.",
        ]),
        code("json", [
          "{",
          "  \"permission\": {",
          "    \"bash\": { \"*\": \"ask\", \"rm *\": \"deny\" }",
          "  }",
          "}",
        ], "opencode.json: a política do começo do capítulo, sem a regra do echo"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"echo auto\", \"description\": \"Mostra uma palavra\" } },",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"rm arquivo.txt\", \"description\": \"Apaga o arquivo\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: um comando qualquer e um rm"),
        code("bash", [
          "$ opencode run --auto Ola",
        ], "Terminal (modelo falso): com --auto, o ask vira sim e o deny continua sendo não"),
        code("text", [
          "$ echo auto",
          "auto",
          "✗ rm arquivo.txt failed",
          "Error: The user has specified a rule which prevents you from using this specific tool call.…",
        ], "Saída: o primeiro rodou sem aprovação e o segundo foi barrado"),
        porque([
          "As regras de um agente vêm depois das da configuração geral e, por serem as últimas, podem restringir ou liberar. Ferramentas negadas por inteiro somem do pedido, e o modelo que as chama recebe um aviso de ferramenta inexistente. `--auto` aprova o `ask` e respeita o `deny`.",
        ]),
        quebraria([
          "Um time desenha uma política conservadora no arquivo geral e acredita que todos os agentes a seguem. Um agente de manutenção criado depois, com `bash: allow` no próprio arquivo, reabre o que o geral fechou, e ninguém nota, porque o arquivo que todos revisam continua igual.",
        ]),
      ],
    },
  ],
};

export const OPENCODE_BOOK_05_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "intermediate",
    promptMd: "A configuração tem `\"bash\": { \"*\": \"allow\", \"git push*\": \"deny\", \"git *\": \"allow\" }`. O modelo tenta rodar `git push origin main`. O que o OpenCode faz?",
    choices: [
      "Executa o comando, porque a última regra que casa, `git *`, libera",
      "Recusa o comando, porque `git push*` é a regra mais específica",
      "Pergunta ao usuário, porque duas regras casam com o comando",
      "Recusa, porque `deny` sempre vence um `allow`",
    ],
    answerKeyMd: "Executa o comando, porque a última regra que casa, `git *`, libera",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "intermediate",
    promptMd: "Uma tarefa agendada roda `opencode run \"atualize as dependências\"` com `permission.bash` igual a `\"ask\"`. No relatório, o agente diz que não conseguiu rodar nenhum comando. Explique o que aconteceu e como corrigir sem usar `--auto`.",
    answerKeyMd: "Em `opencode run` não há ninguém para responder às perguntas, então toda permissão `ask` é recusada automaticamente com a mensagem `permission requested: ... auto-rejecting`, e o modelo recebe que o usuário rejeitou o pedido. Para corrigir sem `--auto`, a configuração precisa listar exatamente o que a tarefa deve poder fazer, em regras `allow` específicas (por exemplo, `npm install*`, `npm outdated*` e `npm test*`), manter `deny` para o que nunca deve ocorrer (`rm *`, `git push*`) e deixar o resto em `ask`, que continuará sendo recusado. Assim a automação fica restrita à lista de permissões, e não a tudo o que não foi proibido.",
    rubricMd: "Explica que ask vira recusa no run; propõe regras allow específicas e deny explícitos; evita --auto e justifica pela lista de permissões.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "A configuração geral de uma empresa nega `bash` por completo, e um projeto tem um agente `ops` com `bash: allow` em seu arquivo. Uma auditoria quer saber quais agentes do projeto conseguem rodar comandos. Descreva como obter a resposta correta, por que ler apenas o arquivo geral engana e que risco o desenho representa.",
    answerKeyMd: "As regras de cada agente são acrescentadas depois das da configuração geral, e como a última regra que casa vence, um agente pode reabrir o que o geral fechou. Ler só o arquivo geral mostra a política de partida, não a efetiva. A resposta correta vem de inspecionar cada agente com `opencode debug agent <nome>` (olhando as regras do fim da lista para `bash`), ou de abrir um pedido com o modelo falso para cada agente e conferir se `bash` está na lista de ferramentas; o agente `ops` aparecerá com `bash`, os demais não. O risco é a abertura passar despercebida em revisão, porque o arquivo que todos leem continua igual; a mitigação é revisar os arquivos de agente como se fossem política, restringir a abertura com padrões específicos (`bash: { \"*\": \"deny\", \"npm test*\": \"allow\" }`) e testar a política de cada agente com roteiros.",
    points: 20,
  },
];

export const OPENCODE_BOOK_05_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "O que o OpenCode faz com allow, deny e ask?", backMd: "`allow` executa; `deny` recusa e informa a regra ao modelo; `ask` pergunta. Em `opencode run`, sem ninguém para responder, `ask` vira recusa automática." },
  { nodeTitle: NODE, frontMd: "Qual regra vale quando várias casam com o comando?", backMd: "A última que casa, na ordem em que foram escritas. Escreva do geral ao específico; projeto e agente vêm depois da configuração geral." },
  { nodeTitle: NODE, frontMd: "Como se evita que o agente leia segredos e pastas de fora?", backMd: "`.env`, `*.env` e `*.env.*` perguntam por padrão (`*.env.example` é liberado) e `external_directory` pergunta para qualquer pasta fora do projeto. Sem interlocutor, viram recusa." },
  { nodeTitle: NODE, frontMd: "Qual a diferença entre `ask` e `deny` para uma ferramenta inteira?", backMd: "`ask` mantém a ferramenta no pedido e recusa na execução; `deny` por inteiro retira a ferramenta do pedido, e uma chamada vira \"ferramenta inexistente\"." },
  { nodeTitle: NODE, frontMd: "O que `--auto` faz com as regras?", backMd: "Aprova o que seria `ask` e respeita o que é `deny`. O que ninguém previu (nem allow nem deny) é executado." },
];
