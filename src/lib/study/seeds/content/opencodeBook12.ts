// OpenCode, reescrita autoral (PLANO.md §R.2) — capítulo 12 (integrador).
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Projeto integrador: um agente de confiança para a reserva de estoque da Ágora";

export const OPENCODE_BOOK_12: ContentChapter = {
  title: NODE,
  level: "avancado",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "O problema: a reserva que checa antes e reserva depois",
      order: 0,
      blocks: [
        prose([
          "Este capítulo reúne o livro num projeto só. A Ágora, a loja que serve de fio condutor aos exemplos de outros livros, tem um módulo de estoque com um defeito clássico: quando duas pessoas tentam reservar a última unidade de um produto ao mesmo tempo, as duas conseguem. A causa está em uma ordem de operações. O código **checa** se há unidade disponível, espera um instante, e só então **reserva**; na janela entre uma coisa e outra, a segunda chamada também encontra a unidade livre. O laboratório da Ágora chama isso de \"checar antes, reservar depois\", e a camada de concorrência dele descreve o contrato correto: reservar decrementa a disponibilidade dentro da mesma transição que a checa. Duas invariantes resumem o que não pode quebrar: o estoque disponível nunca é negativo, e as reservas contam a mesma coisa que os carrinhos.",
          "",
          "O trabalho do capítulo é montar o ambiente em que um agente do OpenCode corrija esse defeito **sem poder fazer mais do que isso**. Cada seção usa uma parte do que os capítulos anteriores ensinaram: as instruções e o agente, a política de permissões em lista de permissão, o modelo falso para testar a política, o roteiro de uma correção completa e o registro do que aconteceu. O projeto é um só ao longo das quatro seções: os arquivos criados numa seção continuam existindo nas seguintes. O módulo é pequeno, com uma função que cria a loja e um método de reserva assíncrono, e o teste é a expressão exata da invariante: com uma unidade em estoque, duas reservas simultâneas só podem ter sucesso uma vez, e a disponibilidade nunca pode terminar negativa.",
          "",
          "O código tem uma pausa explícita entre a checagem e a reserva, uma espera de um ciclo do laço de eventos, para tornar visível a janela que, em um sistema real, seria uma consulta ao banco de dados ou uma chamada de rede. Em JavaScript não há dois fluxos executando ao mesmo tempo; basta que haja uma pausa assíncrona entre as duas operações para que outro fluxo se intercale, e é o que o teste provoca ao disparar as duas reservas com `Promise.all`. O defeito, portanto, não é um acidente do exemplo: é a forma que o problema tem em qualquer linguagem com pontos de espera.",
          "",
          "Convém dizer por que o teste controla a janela em vez de depender de sorte. Um defeito de concorrência de verdade aparece raramente: precisa de duas requisições chegando quase juntas, e costuma ser descoberto em produção, no pior dia do ano, quando o estoque de uma promoção acaba. Um teste que dependa de o defeito aparecer de vez em quando é um teste que passa na máquina de quem o escreveu e falha na integração, sem que ninguém saiba o porquê. Com a pausa colocada de propósito entre a checagem e a reserva, o intercalamento passa a ser determinístico: a segunda chamada sempre entra na janela, o teste sempre falha com o código errado e sempre passa com o certo. Tornar o defeito reprodutível é metade da correção, e é também o que permite pedir a um agente que o conserte, porque o agente precisa de um critério que responda sempre da mesma maneira.",
        ]),
        code("json", [
          "{ \"type\": \"module\" }",
        ], "package.json: o projeto usa módulos ES"),
        code("js", [
          "export function criarLoja(disponivel) {",
          "  const estado = { disponivel, reservas: 0 };",
          "  return {",
          "    estado,",
          "    async reservar() {",
          "      if (estado.disponivel - estado.reservas < 1) return false;",
          "      await new Promise((resolver) => setImmediate(resolver));",
          "      estado.reservas += 1;",
          "      return true;",
          "    },",
          "  };",
          "}",
        ], "src/estoque.js: a reserva que checa, espera e só então reserva"),
        code("js", [
          "import test from \"node:test\";",
          "import assert from \"node:assert/strict\";",
          "import { criarLoja } from \"../src/estoque.js\";",
          "",
          "test(\"a última unidade não pode ser reservada duas vezes\", async () => {",
          "  const loja = criarLoja(1);",
          "  const resultados = await Promise.all([loja.reservar(), loja.reservar()]);",
          "  assert.equal(resultados.filter(Boolean).length, 1);",
          "  assert.ok(loja.estado.disponivel - loja.estado.reservas >= 0);",
          "});",
        ], "test/estoque.test.js: o teste que expressa as invariantes"),
        code("bash", [
          "$ node --test",
        ], "Terminal (falha de propósito): o teste acusa o defeito"),
        code("text", [
          "✖ a última unidade não pode ser reservada duas vezes",
          "ℹ fail 1",
          "2 !== 1",
        ], "Saída: as duas reservas tiveram sucesso"),
        prose([
          "A saída mostra o defeito em termos de números: o teste esperava uma reserva bem-sucedida e encontrou duas, o que deixaria a disponibilidade em menos um. Esse é o ponto de partida, e vale notar o que o teste faz de útil para o resto do capítulo. Ele não depende do agente: é um **árbitro** externo, escrito por quem conhece o contrato, que diz se a correção funcionou. Um agente que corrige código sem um teste desses está pedindo ao leitor que acredite; com ele, a confiança é verificável. Quando o capítulo diz que o agente \"corrigiu\", o que quer dizer é que o teste, que ele não escreveu e não pode alterar, passou.",
        ]),
        porque([
          "O defeito de concorrência é a janela entre checar e reservar; o teste o expressa como duas reservas simultâneas da última unidade. O teste é o árbitro externo que torna a correção do agente verificável, e as invariantes do laboratório são o que ele afirma.",
        ]),
        quebraria([
          "Pede-se a um agente que \"corrija o bug da reserva\" num projeto sem teste. Ele altera o código de modo plausível, o programa continua rodando, e ninguém sabe se a janela foi fechada. Uma semana depois, a corrida de Natal responde.",
        ]),
      ],
    },
    {
      title: "As regras de convivência: instruções, agente e permissões",
      order: 1,
      blocks: [
        prose([
          "Com o problema definido, a segunda seção monta o ambiente em que o agente trabalha. São quatro peças, cada uma de um capítulo do livro. O `AGENTS.md` (capítulo 3) carrega a regra que importa, uma frase que o modelo lê em todo pedido: a disponibilidade nunca fica negativa. O agente `corretor` (capítulo 4) tem um prompt curto e específico, que o limita à pasta `src`. A política de permissões (capítulo 5) é escrita como **lista de permissão**, a forma que o capítulo 11 mostrou ser a sólida: `bash` fica negado para tudo, exceto `node --test*`; `edit` fica negado, exceto sob `src`; e a leitura de `.env` é negada com `deny`, e não com `ask`, porque a pergunta se resolve sozinha numa automação e uma pessoa distraída a aprova numa sessão.",
          "",
          "A política só vale depois de testada, e o teste é o do capítulo 5: um roteiro do modelo falso com as tentativas que o agente **não** deve conseguir. O exemplo faz três. O modelo tenta rodar um comando por dentro de um shell (`sh -c`), o truque da armadilha 2, tenta sobrescrever o arquivo de teste, que está fora de `src`, e tenta ler o `.env`. As três devem ser recusadas, e como são recusas por regra, e não perguntas, a conversa continua depois de cada uma. O arquivo de teste e o `.env` existem no projeto, e a recusa é, portanto, uma decisão da política, e não consequência de um arquivo inexistente.",
        ]),
        code("markdown", [
          "REGRA-ESTOQUE a disponibilidade nunca fica negativa, e reservar decrementa na mesma transição que checa.",
        ], "AGENTS.md: a regra de domínio que o modelo lê em todo pedido"),
        code("text", [
          "CHAVE_DO_BANCO=segredo-de-producao",
        ], ".env: um arquivo de segredos que o agente nunca deve ler"),
        code("markdown", [
          "---",
          "description: Corrige defeitos de concorrência no módulo de estoque",
          "mode: primary",
          "---",
          "Você corrige defeitos no código da pasta src. Mude o mínimo necessário e confira o resultado rodando os testes.",
        ], ".opencode/agent/corretor.md: um agente com escopo estreito"),
        code("json", [
          "{",
          "  \"permission\": {",
          "    \"bash\": { \"*\": \"deny\", \"node --test*\": \"allow\" },",
          "    \"edit\": { \"*\": \"deny\", \"**/src/**\": \"allow\" },",
          "    \"read\": { \"*.env\": \"deny\" }",
          "  }",
          "}",
        ], "opencode.json: lista de permissão para comandos e edição, e deny para segredos"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"sh -c \\\"echo x\\\"\", \"description\": \"Tenta um shell por dentro\" } },",
          "  { \"ferramenta\": \"write\", \"argumentos\": { \"filePath\": \"test/estoque.test.js\", \"content\": \"// apagado\" } },",
          "  { \"ferramenta\": \"read\", \"argumentos\": { \"filePath\": \".env\" } },",
          "  \"Terminei.\"",
          "]",
        ], "roteiro.json: três tentativas que a política deve recusar"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run --agent corretor Teste a politica",
          "$ node ver-pedido.mjs \"^REGRA|Instructions from\"",
        ], "Terminal (modelo falso): as tentativas, a recusa de cada uma e as instruções no pedido"),
        code("text", [
          "> corretor · falso",
          "✗ sh -c \"echo x\" failed",
          "✗ Write test/estoque.test.js failed",
          "✗ Read .env failed",
          "Instructions from: <projeto>\\AGENTS.md",
          "REGRA-ESTOQUE a disponibilidade nunca fica negativa, e reservar decrementa na mesma transição que checa.",
        ], "Saída: as três recusas por regra, e a regra de domínio presente no pedido"),
        prose([
          "A saída confirma duas coisas. A primeira é que cada tentativa foi barrada pela política e a conversa seguiu: o `sh -c` não está na lista, o arquivo de teste está fora de `src`, o `.env` tem um `deny` próprio. A segunda é um detalhe do capítulo 4 que aparece aqui com valor prático: o `corretor` tem um prompt próprio, que substitui o prompt padrão do OpenCode, e mesmo assim o `AGENTS.md` do projeto chega ao pedido. As instruções do projeto valem para todos os agentes; o prompt do agente define o papel, e a regra de domínio continua a ser lida por qualquer um deles.",
          "",
          "A política mora em dois lugares com funções diferentes. O `opencode.json` da raiz vale para todos os agentes do projeto e é a base conservadora: ninguém roda comandos além do teste, ninguém edita fora de `src`, ninguém lê segredos. O arquivo do agente `corretor` poderia abrir exceções para o seu papel, mas aqui não precisa, e é uma boa notícia: um agente que funciona com a política de base não tem aberturas escondidas num arquivo que ninguém revisa. Quando um segundo agente for criado, por exemplo um revisor que só lê, a mesma base se aplica a ele, e a revisão de código dos arquivos de agente tem uma pergunta simples a fazer: este arquivo abre alguma coisa que a base fechou?",
          "",
          "O ambiente também cabe no controle de versão, e conviria que coubesse. O `AGENTS.md`, a pasta `.opencode/` e o `opencode.json` são arquivos de texto, revisados como código, e o roteiro de tentativas proibidas pode ser guardado como um teste de política, rodado na integração contínua a cada mudança nesses arquivos. É a diferença entre uma política que existe na cabeça de quem a escreveu e uma que se prova a cada mudança. O custo é de poucos minutos na primeira vez, e a política deixa de depender da lembrança de alguém para continuar valendo.",
          "",
          "O desenho tem uma virtude que vale nomear: cada camada responde a uma pergunta diferente e nenhuma é carregada com o trabalho da outra. O `AGENTS.md` **orienta**, a permissão **impede**, o agente **delimita** o papel e o teste **verifica**. Nenhuma frase do arquivo de instruções precisa dizer \"não apague o teste\", porque a política já não deixa; e a política não precisa saber de concorrência, porque a regra de domínio e o teste cuidam disso.",
        ]),
        porque([
          "Instruções orientam, permissões impedem, o agente delimita e o teste verifica. A política em lista de permissão (`deny` geral e liberações específicas) foi testada com um roteiro de tentativas proibidas, e o `AGENTS.md` chega ao pedido de qualquer agente.",
        ]),
        quebraria([
          "A equipe confia no `AGENTS.md` para proteger o arquivo de teste, com a frase \"não altere os testes\". Numa sessão longa, o agente \"ajusta\" o teste para que passe. Com a política, a escrita fora de `src` é recusada pelo programa, e o teste continua sendo um árbitro.",
        ]),
      ],
    },
    {
      title: "O agente corrige, e o teste decide",
      order: 2,
      blocks: [
        prose([
          "Com o ambiente pronto, a terceira seção executa a tarefa: o agente lê o módulo, escreve a correção e roda os testes. O roteiro do modelo falso faz o que um modelo de verdade deveria fazer, e a correção que ele escreve é a do contrato do laboratório: **reservar na mesma transição em que se checa**, antes de qualquer pausa. A linha que incrementa as reservas sobe para logo depois da checagem, e a espera passa a vir depois. Quando a segunda reserva chega, encontra a unidade já reservada e recebe `false`. A pausa continua lá, para que o teste mostre que a correção resiste à janela e não a elimina.",
          "",
          "Cada passo do roteiro passa pela política. A leitura de `src/estoque.js` é permitida. A escrita do mesmo arquivo cai na regra `**/src/**`, que libera, e é aceita. O comando `node --test` casa com a única liberação de `bash` e é executado. O modelo falso é, por construção, perfeito: o que o exemplo prova não é que um modelo de verdade acertará, e sim que **o ambiente deixa o caminho certo aberto**. Uma política que bloqueasse a correção seria tão ruim quanto uma que a permitisse junto com tudo o mais; a mesma política que recusou as tentativas da seção anterior aceita, aqui, o trabalho legítimo.",
        ]),
        code("json", [
          "[",
          "  { \"ferramenta\": \"read\", \"argumentos\": { \"filePath\": \"src/estoque.js\" } },",
          "  { \"ferramenta\": \"write\", \"argumentos\": { \"filePath\": \"src/estoque.js\", \"content\": \"export function criarLoja(disponivel) {\\n  const estado = { disponivel, reservas: 0 };\\n  return {\\n    estado,\\n    async reservar() {\\n      if (estado.disponivel - estado.reservas < 1) return false;\\n      estado.reservas += 1;\\n      await new Promise((resolver) => setImmediate(resolver));\\n      return true;\\n    },\\n  };\\n}\\n\" } },",
          "  { \"ferramenta\": \"bash\", \"argumentos\": { \"command\": \"node --test\", \"description\": \"Roda os testes\" } },",
          "  \"Corrigido: a reserva agora acontece junto com a checagem.\"",
          "]",
        ], "roteiro.json: ler, escrever a correção em src e rodar os testes"),
        code("bash", [
          "$ opencode run --agent corretor Corrija a reserva",
        ], "Terminal (modelo falso): a correção, passo a passo"),
        code("text", [
          "→ Read src/estoque.js",
          "← Write src/estoque.js",
          "Wrote file successfully.",
          "$ node --test",
          "✔ a última unidade não pode ser reservada duas vezes",
          "ℹ pass 1",
          "ℹ fail 0",
        ], "Saída: o agente leu, escreveu e o teste passou"),
        prose([
          "O desfecho está na saída do `node --test` que o próprio agente rodou: uma reserva bem-sucedida, nenhuma falha. Mas o agente rodar o teste e dizer que passou é o tipo de afirmação que o livro ensinou a não aceitar sozinha. A conferência independente é um comando a mais, rodado por quem vai aceitar a mudança, fora do agente. Se o teste passa também ali, a mudança está validada por um processo que o agente não controla.",
        ]),
        code("bash", [
          "$ node --test test/estoque.test.js",
        ], "Terminal: a conferência, fora do agente"),
        code("text", [
          "✔ a última unidade não pode ser reservada duas vezes",
          "ℹ pass 1",
          "ℹ fail 0",
        ], "Saída: o teste passa também quando rodado por quem aceita a mudança"),
        prose([
          "O resultado tem o formato que se quer de uma colaboração com um agente: a mudança é pequena, localizada na pasta que a política liberou, e o critério de aceitação é externo e executável. Revisar o diff continua sendo parte do processo, porque um teste verde não diz que a mudança é a melhor, mas a revisão agora pode se concentrar em julgar a correção, em vez de se perguntar se ela funciona.",
          "",
          "Convém entender por que essa correção fecha a janela, porque a mesma ideia reaparece em contextos maiores. No JavaScript, entre duas instruções síncronas nada se intercala: o laço de eventos só troca de fluxo nos pontos de espera. Ao mover o incremento para logo depois da checagem, as duas operações passam a formar um bloco sem pausa, e a segunda chamada, ao ser executada, enxerga a reserva da primeira. Em um sistema com banco de dados, o laço de eventos não protege mais ninguém, porque as requisições chegam a processos diferentes, e a mesma ideia precisa ser uma operação atômica do banco: um `UPDATE` condicional que só decrementa se ainda houver disponibilidade, uma restrição que impeça o estado inválido ou uma transação com bloqueio. A forma do contrato é a mesma, checar e reservar de uma vez, e o que muda é quem garante a atomicidade.",
          "",
          "Isso responde a uma pergunta sobre o papel do agente. O agente do exemplo faz a correção que o teste local cobre, e é a hora de uma revisão humana, ou de um segundo agente de revisão, perguntar se ela cobre o sistema de verdade. O OpenCode traz, entre os comandos embutidos do capítulo 6, o `review`, que roda como subtarefa e examina as mudanças ainda não commitadas; é a natureza do trabalho de um revisor, em uma sessão separada, com um agente que só lê. A divisão de papéis, um agente que escreve dentro de uma pasta e outro que só examina, é o desenho de equipe que o livro foi montando, e cada papel tem a sua política.",
        ]),
        porque([
          "O agente lê, escreve em `src` e roda `node --test`: o ambiente deixa aberto o caminho legítimo e fecha os outros. A correção move a reserva para a mesma transição da checagem, e o teste que o agente não pode alterar decide; a conferência independente confirma.",
        ]),
        quebraria([
          "O agente relata \"testes passando\" e a equipe aceita a mudança sem rodar nada. O relato vinha de um teste que o agente havia reescrito. A política que nega a escrita fora de `src` e a conferência independente teriam impedido as duas coisas.",
        ]),
      ],
    },
    {
      title: "O registro, a auditoria e a ponte com o laboratório",
      order: 3,
      blocks: [
        prose([
          "A última seção olha para trás, para o que a sessão deixou. O banco de sessões do capítulo 10 guarda cada chamada de ferramenta como uma parte de mensagem, com o nome da ferramenta e o estado final: `completed` para as que rodaram e `error` para as que a política recusou. Uma consulta com as funções JSON do SQLite extrai essas duas informações de todas as partes do tipo ferramenta e produz uma trilha de auditoria sem nenhum plugin e sem depender de `--pure`. Ela mostra, de uma vez, o que o agente tentou e o que a política decidiu: o `write` em `src` e o `bash` do teste completos, e as três tentativas proibidas da seção anterior com erro.",
        ]),
        code("bash", [
          "$ opencode db \"select json_extract(data, '$.tool') as ferramenta, json_extract(data, '$.state.status') as estado from part where json_extract(data, '$.type') = 'tool'\" --format json",
        ], "Terminal: cada chamada de ferramenta e o seu desfecho, pelo banco de sessões"),
        code("text", [
          "\"ferramenta\": \"bash\"",
          "\"ferramenta\": \"write\"",
          "\"ferramenta\": \"read\"",
          "\"estado\": \"completed\"",
          "\"estado\": \"error\"",
        ], "Saída (ordem livre): as ferramentas usadas e os dois desfechos"),
        prose([
          "Essa consulta fecha o ciclo de confiança do capítulo. Antes da execução, a política dizia o que **poderia** acontecer; durante, o teste dizia se o resultado era correto; depois, o banco diz o que **aconteceu**. As três respostas vêm de fontes diferentes, e é a concordância entre elas que sustenta a confiança: se o banco mostrasse uma escrita fora de `src`, a política teria falhado; se o teste falhasse depois de uma correção, o agente teria errado; se uma tentativa proibida aparecesse com `completed`, uma regra estaria mal escrita. Auditar é procurar uma dessas discordâncias. A frequência da consulta depende do risco: a cada execução, em uma automação que mexe em produção; semanalmente, em um projeto de rotina. O resultado da consulta pode virar um relatório curto, com a contagem de chamadas por ferramenta e a lista de recusas, e a lista de recusas é a parte mais instrutiva: cada recusa é uma tentativa que a política impediu, e uma recusa nova, que antes não aparecia, é um sinal de que o agente passou a tentar algo diferente do usual.",
          "",
          "A ponte com o laboratório da Ágora está nesta mesma ideia. Lá, a falha \"checar antes, reservar depois\" é uma alavanca que se liga e desliga, e as duas invariantes que o teste afirmou, o estoque disponível nunca negativo e as reservas conciliadas com os carrinhos, são as que o painel mostra quebrando quando a alavanca está ligada. O que o livro acrescenta à lição do laboratório é o lado do **processo**: um defeito de concorrência se descobre com um teste que expressa a invariante, se corrige movendo a reserva para a mesma transição da checagem, e a correção por um agente só merece confiança dentro de um ambiente em que o agente não pode mudar o teste, não pode ler segredos e não pode fazer o que não foi liberado.",
        ]),
        {
          kind: "labref",
          labId: "agora",
          layerId: "reserva-estoque-concorrencia",
        },
        prose([
          "Vale terminar por um balanço do caminho. O capítulo 1 mostrou que o OpenCode é um servidor com muitos clientes e que o projeto é o repositório Git; o 2, que a configuração é uma soma de camadas, validada e sem segredos no arquivo; o 3, que instruções orientam e que o pedido ao modelo pode ser lido; o 4, que agentes são perfis com instruções, modelo e ferramentas; o 5, que só a permissão impede, que a última regra vence e que uma pergunta sem resposta encerra a rodada; o 6, 7, 8 e 9, que comandos, habilidades, servidores e ferramentas próprias ampliam o que o agente sabe e faz, cada um com o seu preço; o 10, que a sessão é um registro consultável e o servidor, uma API que se protege; e o 11, que o escrito não é o que acontece. A ferramenta que atravessa todos eles é o modelo falso: a decisão de olhar o pedido, e não de adivinhar, é o que transforma um agente em algo que se pode verificar.",
        ]),
        porque([
          "O banco de sessões registra cada chamada de ferramenta com o desfecho. Política, teste e registro respondem a perguntas diferentes (o que poderia, o que está certo, o que aconteceu), e a confiança vem de as três concordarem. Corrija a concorrência movendo a reserva para a mesma transição da checagem.",
        ]),
        quebraria([
          "O agente é entregue à equipe com uma política e um teste, mas ninguém olha o registro. Meses depois, uma escrita fora de `src` aparece num relatório de segurança, porque uma regra foi afrouxada por uma mudança de configuração. A consulta ao banco, rodada periodicamente, teria mostrado a discordância na semana em que surgiu.",
        ]),
      ],
    },
  ],
};

export const OPENCODE_BOOK_12_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "advanced",
    promptMd: "No módulo de estoque, a função checa `disponivel - reservas < 1`, espera um ciclo e só então faz `reservas += 1`. Qual alteração fecha a janela de concorrência?",
    choices: [
      "Incrementar `reservas` logo depois da checagem, antes de qualquer espera",
      "Aumentar o tempo de espera entre a checagem e a reserva",
      "Checar duas vezes, antes e depois da espera, e reservar só se as duas passarem",
      "Trocar `setImmediate` por `setTimeout` para ordenar as chamadas",
    ],
    answerKeyMd: "Incrementar `reservas` logo depois da checagem, antes de qualquer espera",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "advanced",
    promptMd: "A política do projeto tem `bash: { \"*\": \"deny\", \"node --test*\": \"allow\" }`, `edit: { \"*\": \"deny\", \"**/src/**\": \"allow\" }` e `read: { \"*.env\": \"deny\" }`. Explique por que cada parte é desenhada assim, em vez de `\"rm *\": \"deny\"` com tudo o mais liberado, e por que a leitura de `.env` usa `deny` e não `ask`.",
    answerKeyMd: "É uma lista de permissão: `\"*\": \"deny\"` primeiro e liberações específicas depois (a última regra que casa vence), o que mantém barrado tudo o que ninguém previu, como `sh -c` ou um script gravado pelo próprio agente; uma lista de bloqueio como `\"rm *\": \"deny\"` deixa passar qualquer caminho que não comece por rm. `edit` liberado só sob `**/src/**` (o padrão com `**/` porque a comparação é com o caminho absoluto) impede que o agente altere o teste, que é o árbitro externo da correção. A leitura de `.env` usa `deny` porque `ask` numa automação é recusado com encerramento da rodada, e numa sessão interativa pode ser aprovado por engano ou pressa; `deny` informa o modelo e não pode ser aprovado por distração.",
    rubricMd: "Explica lista de permissão versus lista de bloqueio; justifica o padrão **/src/** e a proteção do teste como árbitro; contrasta deny e ask para segredos.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "Descreva o plano de verificação, em três momentos (antes, durante e depois), que dá confiança numa correção feita por um agente neste projeto, citando que ferramenta do livro responde a cada pergunta e que discordância entre as respostas indicaria um problema.",
    answerKeyMd: "Antes: a política (lista de permissão em `opencode.json` e no agente) responde ao que o agente poderia fazer; é testada com um roteiro do modelo falso de tentativas proibidas (`sh -c`, escrita fora de `src`, leitura de `.env`), conferindo as recusas, e o `AGENTS.md` é conferido no pedido. Durante: o teste (`node --test`), que o agente não pode alterar, responde se a correção está certa, e uma conferência independente, rodada por quem aceita a mudança, confirma o relato do agente. Depois: o banco de sessões (`opencode db` com `json_extract` sobre a tabela `part`) responde ao que de fato aconteceu: quais ferramentas foram chamadas e com que desfecho (`completed` ou `error`). Discordâncias que sinalizam problema: uma escrita fora de `src` com `completed` (regra mal escrita ou afrouxada), um teste que falha depois de uma correção declarada (agente errou) ou um comando proibido que aparece como executado (política fraca). A auditoria periódica procura essas discordâncias.",
    points: 20,
  },
];

export const OPENCODE_BOOK_12_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Qual é o defeito de \"checar antes, reservar depois\"?", backMd: "Entre a checagem da disponibilidade e a reserva há uma pausa em que outro fluxo também checa e passa. A correção reserva na mesma transição da checagem, antes de qualquer espera." },
  { nodeTitle: NODE, frontMd: "Por que o teste é o árbitro da correção do agente?", backMd: "Porque expressa as invariantes (estoque nunca negativo, uma só reserva da última unidade) e o agente não pode alterá-lo: a política nega a escrita fora de `src`." },
  { nodeTitle: NODE, frontMd: "Como é a política do projeto integrador?", backMd: "`bash`: deny geral e allow para `node --test*`; `edit`: deny geral e allow para `**/src/**`; `read` de `*.env`: deny. Lista de permissão, na ordem em que a última regra que casa vence." },
  { nodeTitle: NODE, frontMd: "Como auditar o que o agente fez?", backMd: "Consultando o banco de sessões: `opencode db` com `json_extract` sobre `part` lista cada chamada de ferramenta e o estado (completed ou error)." },
  { nodeTitle: NODE, frontMd: "De onde vem a confiança no agente?", backMd: "Da concordância entre política (o que poderia), teste (o que está certo) e registro (o que aconteceu). Uma discordância entre elas indica regra mal escrita, erro do agente ou política fraca." },
];
