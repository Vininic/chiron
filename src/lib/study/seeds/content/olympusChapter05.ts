import type { ContentChapter } from "./types";
export const OLYMPUS_CHAPTER_5: ContentChapter = {
  "title": "Aetheris, proposta e efeito",
  "level": "intermediario",
  "nodeTitle": "Aetheris, proposta e efeito",
  "nodeKind": "concept",
  "sections": [
    {
      "title": "Sessões de conversa e contexto de domínio",
      "order": 0,
      "blocks": [
        {
          "kind": "prose",
          "md": "Uma sessão de conversa é um documento próprio, diferente da sessão de autenticação. No Olympus, ChatSession guarda id, título, mensagens e data de criação. O namespace olympus.chat-sessions.v1 mantém esse histórico no navegador. A conta responde quem pode acessar dados remotos; a conversa responde qual sequência de perguntas está ativa na interface. Confundir esses papéis cria expectativas erradas sobre sincronização, exclusão e troca de conta. Ter o mesmo login em outro aplicativo não significa que a conversa local será lida automaticamente naquele outro domínio.\n\nnewSession produz uma identidade e deixa o título vazio até a primeira pergunta. deriveTitle remove espaços nas extremidades, reduz sequências de whitespace a um espaço e limita o resultado a quarenta e dois caracteres antes da reticência. Os exemplos executam essa função real com entradas sintéticas. Um confirma a normalização de espaços e quebra de linha; outro observa o comprimento do resultado truncado. Nenhum caso cria mensagens no localStorage ou envia contexto à IA. A transformação pequena torna a regra do título verificável sem inventar uma sessão remota para justificar seu comportamento.\n\nA persistência tem limites próprios. loadSessions aceita um array externo e conserva até vinte sessões, sem validar profundamente cada elemento. saveSessions corta a lista e mantém apenas as quarenta mensagens finais de cada sessão antes de serializar. Se houver erro de armazenamento, o código ignora a falha para continuar em memória. Assim, a interface pode manter uma conversa que não sobrevive ao reload. O limite salvo também não é necessariamente o limite que a tela atual mantém em memória. Uma investigação precisa observar o documento serializado, não apenas contar os balões visíveis.\n\nO contexto de domínio nasce de outra cadeia. refreshContext constrói o system prompt a partir dos painéis projetados no hub, nomeando itens de cronograma, tarefas, orçamento, fila e estudo. O objetivo é permitir respostas específicas, em vez de números soltos sem identidade. Entretanto, a frase do prompt que afirma ver todos os dados deve ser interpretada à luz das projeções reais: parsers aplicam filtros, limites e defaults, e os espelhos podem estar antigos ou ausentes. O modelo não recebe magicamente o documento completo de cada irmão só porque o prompt descreve essa ambição.\n\nA página Chat memoiza o contexto com dependências ligadas à conversa ativa e à contagem de mensagens. Isso não comprova atualização imediata de cada mudança remota de domínio. O orçamento visual de tokens também é uma estimativa da interface, não um contador oficial do provedor. Uma mudança no texto serializado pode aumentar a entrada sem alterar a quantidade de mensagens. Ao modificar essa camada, acompanhe o caminho desde o espelho até o prompt e depois até o payload do adaptador, distinguindo o que foi preparado do que efetivamente foi enviado.\n\nSeparar conversas também evita contaminação de intenção entre assuntos. Uma pergunta sobre orçamento não deveria herdar uma instrução operacional de outra sessão apenas porque ambas pertencem à mesma pessoa. O array de histórico precisa usar a sessão capturada no envio, principalmente se a pessoa troca de conversa durante uma requisição. Resposta tardia, cancelamento e anexos pendentes podem se associar ao documento errado se a implementação consultar apenas a seleção atual. Esse risco depende dos handlers concretos e deve ser testado na tela quando a afirmação final é sobre interação, não sobre deriveTitle.\n\nPara estender o histórico, defina migração, retenção, identidade e escopo de exportação antes de acrescentar campos. Uma conversa pode conter dados pessoais copiados de vários domínios; sua política de limpeza precisa ser explícita. A documentação conserva o caráter local observado e não promete sincronização de sessões que não existe nesse módulo. Os exemplos mostram duas regras de apresentação, enquanto a análise aponta quais consumidores requerem verificação adicional. Essa divisão permite evoluir o assistente sem confundir um título bem formado com contexto atualizado, persistência confirmada ou isolamento correto entre contas e conversas."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst chat = await import(pathToFileURL(resolve(\"../olympus/src/lib/ai/chatSessions.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chat.deriveTitle(\"  Uma\\n  pergunta  \"));\nconst expected = \"Uma pergunta\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst chat = await import(pathToFileURL(resolve(\"../olympus/src/lib/ai/chatSessions.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chat.deriveTitle(\"a\".repeat(43)).length);\nconst expected = 43;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Conversa, autenticação e contexto de domínio têm identidades e persistências distintas; deriveTitle só prepara um rótulo local."
        },
        {
          "kind": "quebraria",
          "md": "Aplicar uma resposta à sessão selecionada depois do envio, em vez da sessão capturada, pode misturar conversas quando a pessoa troca de aba."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/ai/chatSessions.ts",
          "symbol": "deriveTitle",
          "lines": [
            31,
            31
          ]
        },
        {
          "kind": "prose",
          "md": "### deriveTitle — ../olympus/src/lib/ai/chatSessions.ts\n\nAssinatura observada: `export function deriveTitle(firstMessage: string): string`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Conversa, autenticação e contexto de domínio têm identidades e persistências distintas; deriveTitle só prepara um rótulo local. Contraprova ou limite a preservar: Aplicar uma resposta à sessão selecionada depois do envio, em vez da sessão capturada, pode misturar conversas quando a pessoa troca de aba.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/ai/chatSessions.ts",
          "symbol": "deriveTitle",
          "lines": [
            31,
            31
          ]
        }
      ]
    },
    {
      "title": "Vocabulário de ações e confirmação",
      "order": 1,
      "blocks": [
        {
          "kind": "prose",
          "md": "Aetheris é um nome comum para assistentes que possuem autoridades diferentes conforme o aplicativo. Alguns irmãos permitem propostas de criação ou alteração de entidades; o Oráculo do Olympus observado permanece somente de leitura. Seu módulo actions define AetherisAction como never e parseActions retorna a resposta original como prose, acompanhada de um array vazio. Essa implementação pequena é um contrato importante. Uma linguagem visual parecida e um bloco chamado actions no texto não acrescentam permissão nem transformam o hub num escritor universal dos documentos que ele consegue consultar.\n\nOs exemplos desta seção chamam parseActions com cercas sintéticas. Uma contém um objeto com tipo delete; a outra contém um array vazio. O resultado exige ausência de ações e preservação do texto. São execuções do módulo real, sem um modelo ou um parser substituto. A prova não é de que o assistente remoto obedece sempre ao prompt de leitura. A prova é que esse ponto local não converte a cerca em operações de domínio. O consumidor da resposta precisa manter essa fronteira ao renderizar links, propostas e mensagens posteriores.\n\nEm aplicativos que possuem ações, reconhecer JSON não encerra o trabalho. Primeiro é preciso localizar a representação permitida; depois validar campos, tipos, limites e alvos; só então aplicar uma transformação pelo serviço adequado. Uma lista de discriminantes conhecidos não valida cada payload. Um id sintaticamente correto pode referenciar outra fonte ou uma entidade removida. O próprio contexto fornecido ao modelo pode estar antigo. A confirmação humana ajuda a revisar intenção, mas não substitui checagens do domínio e autorização do serviço que persistirá a alteração.\n\nA autonomia também precisa ter significado operacional. Suggest pode exigir aceitar uma proposta, enquanto auto pode permitir certas operações dentro de uma política previamente definida. Esses rótulos não devem ampliar silenciosamente a autoridade de anexos ou de mensagens produzidas por outro agente. Quando uma ação pede ingestão, envio ou outra operação externa, o fluxo precisa preservar escopo e informação suficiente para a pessoa decidir. A interface deve apresentar a entidade real e o efeito previsto, em vez de um texto genérico que esconde uma lista de mudanças atrás de um botão de aprovação.\n\nO plano compartilhado descreve chips coloridos a partir das entidades referenciadas, reutilizando a linguagem visual do domínio. Essa apresentação ajuda a ligar proposta e objeto, mas cor não prova validade. Uma proposta sobre tarefa inexistente deve ser recusada ou explicada; pintá-la com a cor de um projeto não cria a tarefa. A implementação do Chiron possui caminhos que apenas produzem notas ou prompts para fluxos futuros. Documentar essas variantes como se todas mutassem o acervo faria a pessoa acreditar que uma operação ocorreu quando só foi preparada uma sugestão textual.\n\nAo introduzir ações no hub, a decisão arquitetural seria maior que mudar never para uma união de strings. Seria necessário escolher quais domínios podem ser escritos, quais serviços compartilham invariantes, como validar revisão de origem e como lidar com conflito. Um painel de leitura não possui automaticamente todas as entidades e políticas do aplicativo proprietário. A fronteira de integração deve permanecer explícita para não criar um segundo escritor incompleto. A apostila descreve essa possibilidade de extensão sem implementá-la nem insinuar que o Oráculo atual já possui esse poder.\n\nO teste final de um vocabulário deve distinguir proposta recusada, proposta inválida, transformação aceita e persistência confirmada. Cada estado precisa de evidência e de uma mensagem coerente. Os dois programas publicados verificam apenas o contrato local de leitura do Oráculo, que é suficiente para corrigir uma expectativa documental importante. Não fazem exclusão, não enviam dados e não chamam backend. Essa precisão permite ensinar o padrão de ações da família junto com sua exceção concreta, preparando uma mudança futura sem apresentar como entregue uma capacidade que o código deliberadamente não oferece."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst oracle = await import(pathToFileURL(resolve(\"../olympus/src/lib/ai/actions.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (oracle.parseActions(\"```actions\\n[{\\\"type\\\":\\\"delete\\\"}]\\n```\").actions);\nconst expected = [];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst oracle = await import(pathToFileURL(resolve(\"../olympus/src/lib/ai/actions.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (oracle.parseActions(\"```actions\\n[]\\n```\").prose);\nconst expected = \"```actions\\n[]\\n```\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "O Oráculo atual não interpreta cercas como ações; a autoridade dos assistentes varia por domínio e não pela aparência comum."
        },
        {
          "kind": "quebraria",
          "md": "Trocar never por tipos de ação sem validação e serviços proprietários cria um escritor de domínio incompleto no hub."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/ai/actions.ts",
          "symbol": "parseActions",
          "lines": [
            3,
            3
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Conversa e autoridade\"><title>Conversa e autoridade</title><desc>Oráculo não aplica actions; cercas não dão autoridade a conteúdo externo.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Texto/anexos</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Contexto</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Resposta de leitura</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Navegar ao irmão</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Conversa e autoridade: Oráculo não aplica actions; cercas não dão autoridade a conteúdo externo. Fonte: ../olympus/src/lib/ai/actions.ts"
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/ai/actions.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### parseActions — ../olympus/src/lib/ai/actions.ts\n\nAssinatura observada: `export function parseActions(_reply: string): { prose: string; actions: never[] }`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: O Oráculo atual não interpreta cercas como ações; a autoridade dos assistentes varia por domínio e não pela aparência comum. Contraprova ou limite a preservar: Trocar never por tipos de ação sem validação e serviços proprietários cria um escritor de domínio incompleto no hub.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/ai/actions.ts",
          "symbol": "parseActions",
          "lines": [
            3,
            3
          ]
        }
      ]
    },
    {
      "title": "Histórico, snapshots e desfazer",
      "order": 2,
      "blocks": [
        {
          "kind": "prose",
          "md": "A palavra histórico pode representar mensagens, eventos de domínio ou snapshots de estado. Essas estruturas respondem perguntas diferentes. Mensagens registram o que foi dito. Um evento descreve uma mudança. Um snapshot conserva uma versão inteira que pode ser restaurada. No hub observado, actionHistory possui apenas loadHistory que retorna um array novo vazio, porque o Oráculo não aplica ações. A aba History da página apresenta conversas nomeadas, não um ledger de mutações de todos os irmãos. Confundir esses objetos criaria uma promessa de auditoria e recuperação que a interface não implementa.\n\nOs exemplos executam o stub real do Olympus. O primeiro observa o array vazio. O segundo altera o array retornado e chama a função novamente, exigindo que o novo resultado continue vazio. Isso demonstra que não há persistência por esse caminho, sem usar um storage substituto. Também não comprova que toda a aplicação é imutável ou que não guarda conversas; apenas delimita a função de histórico de ações. A precisão é útil porque uma aba com o mesmo nome pode levar o leitor a atribuir ao hub o comportamento de outro aplicativo da família.\n\nNo Chiron, o módulo de histórico possui um contrato diferente. logHistory recebe ações, descrições, índice anterior e bibliotecas anteriores; acrescenta identificador e timestamp; persiste até trinta entradas; e marca undone separadamente. Esses snapshots permitem ao consumidor restaurar o estado anterior de uma proposta aplicada. Contudo, restaurar um documento inteiro não é um merge inverso por entidade. Se a pessoa fez outras edições depois da proposta, a restauração pode substituir também essas mudanças posteriores. O botão de desfazer precisa ser entendido a partir do objeto restaurado, não de sua aparência familiar.\n\nA retenção também limita a recuperação. O limite de trinta entradas se aplica à gravação observada e não cria armazenamento infinito. A serialização pode falhar por espaço, e o módulo ignora a falha para continuar funcionando. Um snapshot que existe apenas em memória pode desaparecer ao recarregar a página. Guardar bibliotecas completas aumenta o custo de cada registro e exige avaliar o tamanho real antes de prometer retenção durável. Os exemplos desta seção não medem esse custo e não demonstram restauração em disco ou entre dispositivos.\n\nUma implementação de undo precisa definir seu alvo. Reverter a última proposta é diferente de restaurar a última sessão ou desfazer uma transação financeira confirmada externamente. Efeitos externos podem exigir compensação, não a simples cópia de um JSON antigo. Mesmo num domínio local, identidade e revisão precisam ser consideradas quando outro dispositivo mudou o documento. Um snapshot anterior sem contexto causal pode reintroduzir dados removidos ou apagar dados legítimos. A família reutiliza ideias de interface, mas cada serviço precisa declarar quais mudanças realmente pode reverter.\n\nAo estender o histórico, separe registro, apresentação e aplicação da restauração. Um campo undone pode mudar o estado visual da entrada sem provar que o índice foi restaurado; uma restauração pode ocorrer e falhar ao gravar o histórico atualizado. O fluxo de UI deve tratar essas etapas e informar qual resultado foi observado. Testes locais conseguem verificar transformações sobre snapshots sintéticos. A afirmação de que um efeito remoto foi desfeito exige observação do serviço correspondente, preservando autorização e integridade de eventos que já tenham saído do aplicativo.\n\nA documentação útil apresenta essas diferenças junto do código que as sustenta. O stub do Oráculo não é um defeito a ser preenchido silenciosamente durante a autoria; é parte da decisão de leitura. O histórico do Chiron não é uma transação universal. Saber localizar ambos permite modificar a área correta e formular contraprovas: editar após a proposta, restaurar, recarregar e conferir quais dados sobreviveram. Esta apostila mantém os programas no escopo nativo declarado e ensina a distinguir memória, persistência, auditoria e reversão antes de usar a palavra desfazer como uma garantia de recuperação completa."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst history = await import(pathToFileURL(resolve(\"../olympus/src/lib/ai/actionHistory.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (history.loadHistory());\nconst expected = [];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst history = await import(pathToFileURL(resolve(\"../olympus/src/lib/ai/actionHistory.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = ((()=>{const h=history.loadHistory();h.push(\"local\");return history.loadHistory().length})());\nconst expected = 0;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Snapshots restauram documentos inteiros; a aba de conversas e o stub de ações do Oráculo não constituem um ledger de mutações."
        },
        {
          "kind": "quebraria",
          "md": "Restaurar snapshot anterior pode apagar edições posteriores sem relação com a proposta que motivou o desfazer."
        },
        {
          "kind": "cite",
          "file": "src/lib/ai/actionHistory.ts",
          "symbol": "logHistory",
          "lines": [
            7,
            7
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Snapshot e desfazer\"><title>Snapshot e desfazer</title><desc>Snapshot inteiro pode apagar edição posterior; stub do Oráculo não registra ações.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Estado anterior</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Aplicar proposta</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Guardar snapshot</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Restaurar documento</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Snapshot e desfazer: Snapshot inteiro pode apagar edição posterior; stub do Oráculo não registra ações. Fonte: src/lib/ai/actionHistory.ts"
        },
        {
          "kind": "cite",
          "file": "src/lib/ai/actionHistory.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### loadHistory — ../olympus/src/lib/ai/actionHistory.ts\n\nAssinatura observada: `export function loadHistory(): never[]`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Snapshots restauram documentos inteiros; a aba de conversas e o stub de ações do Oráculo não constituem um ledger de mutações. Contraprova ou limite a preservar: Restaurar snapshot anterior pode apagar edições posteriores sem relação com a proposta que motivou o desfazer.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/ai/actionHistory.ts",
          "symbol": "loadHistory",
          "lines": [
            2,
            2
          ]
        }
      ]
    },
    {
      "title": "Digest, origem e fronteira do Oráculo",
      "order": 3,
      "blocks": [
        {
          "kind": "prose",
          "md": "Digest é um resumo para orientar uma decisão, mas sua origem precisa estar explícita. Um resumo determinístico deriva campos e regras do documento. Um resumo produzido por IA passa por uma geração e por interpretação de resposta. Ambos podem ser úteis, porém não possuem a mesma evidência, atualização ou modo de falha. O plano compartilhado registra uma correção histórica: a descrição de digest puramente heurístico não valia para todos os irmãos. O leitor deve observar a implementação concreta, em vez de inferir o motor pelo nome da aba ou pela presença do ícone do assistente.\n\nNo Olympus, DigestCards monta cartões a partir de buildPanels. Ele procura o bloco atual do Chronos, contagens do Kairos, saldo e pressão de orçamento do Pluto, fila do Hermes e revisão do Chiron. A composição mostrada não faz uma chamada de IA para redigir esses cartões. O conteúdo é uma projeção local de campos dos painéis. Isso o torna previsível, mas também herda filtros, limites e frescor dos parsers. Um resumo curto pode apresentar um total limitado por uma projeção; sua aparência de visão geral não o transforma num inventário completo do documento proprietário.\n\nOs exemplos executam dois parsers reais com fixtures sintéticas. Um observa streak quatro na projeção de revisão; o outro observa saldo líquido zero num conjunto vazio de transações. Eles demonstram os valores concretos que uma composição estrutural pode consumir. Não renderizam DigestCards, não demonstram renovação de dados e não geram texto com um modelo. A separação permite usar testes pequenos como prova de uma regra de projeção, sem chamar essa regra de análise inteligente ou de consulta bem-sucedida a todos os aplicativos da conta.\n\nO Chiron possui uma cadeia diferente em insight.ts. heuristicDigest cria avisos sobre nós fracos, cards vencidos e dependências bloqueadas, marcando origem Estrutural. aiDigest prepara um subconjunto de dados, pede uma cerca digest e filtra itens com título, corpo e severidade reconhecidos, marcando origem IA quando a interpretação é aceita. Exceções retornam null. O consumidor pode decidir usar heurística quando a geração não produz resultado. A presença dessa função não comprova que o serviço remoto respondeu nesta sessão; origem e timestamp precisam corresponder ao caminho efetivamente executado.\n\nAtualização é outra propriedade independente. DigestCards memoiza os painéis com uma lista vazia de dependências na montagem observada. Isso não constitui assinatura automática de toda mudança de domínio. Sair e entrar na aba pode remontar componentes conforme a estrutura da página, mas esse comportamento não deve ser confundido com uma política explícita de refresh contínuo. Um cartão com um número correto no primeiro instante pode envelhecer. A documentação precisa indicar de onde veio o valor e qual evento provoca novo cálculo antes de apresentar a superfície como uma visão sempre atual do sistema.\n\nO prompt do Oráculo pede síntese entre domínios e recomenda citar itens presentes, sem inventar objetos. Ele também declara leitura sem alteração. Essas instruções orientam o modelo, mas não corrigem um painel com chave divergente ou payload incompatível. Se o espelho de Chiron procura chiron-index enquanto o escritor usa chiron-data, o contexto pode anunciar ausência mesmo havendo dados no outro formato. Um resumo convincente não é evidência suficiente para ignorar a cadeia de origem. Ao investigar um erro, acompanhe chave, envelope, parser, resumo e prompt, nessa ordem de dependência.\n\nPara estender o digest, defina quais sinais importam e quem possui suas regras. Acrescente origem, momento de geração, tratamento de erro e um modo de reprodução. Um fallback deve ser apresentado como fallback, sem manter um selo de IA sobre texto estrutural. Uma resposta de IA deve ser validada antes de entrar no componente e jamais receber autoridade de escrita por ser um resumo. Esta apostila conserva essas fronteiras e executa apenas os programas declarados, permitindo avaliar utilidade e limites sem transformar uma projeção local em prova de inferência, frescor ou integridade de todos os dados da família."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst chiron = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chiron.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chiron.parseReview({cards:[],score:{streak:4,total:120}}).streak);\nconst expected = 4;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst pluto = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/pluto.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (pluto.parseBalance({transactions:[]}).netCents);\nconst expected = 0;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Digest estrutural e digest por IA têm origem e falhas diferentes; o hub observado compõe cartões a partir de projeções locais."
        },
        {
          "kind": "quebraria",
          "md": "Manter selo de IA depois de usar fallback estrutural atribui uma origem que não corresponde ao caminho efetivamente executado."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/pages/Chat.tsx",
          "symbol": "DigestCards",
          "lines": [
            63,
            63
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Origem do digest\"><title>Origem do digest</title><desc>Estrutural e IA são origens distintas; hub DigestCards é projeção, não inferência.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Sinais do domínio</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Geração IA</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Validar ou fallback</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Origem explícita</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Origem do digest: Estrutural e IA são origens distintas; hub DigestCards é projeção, não inferência. Fonte: src/lib/ai/insight.ts"
        },
        {
          "kind": "cite",
          "file": "src/lib/ai/insight.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### parseReview — ../olympus/src/lib/panels/chiron.ts\n\nAssinatura observada: `export function parseReview(raw: Record<string, unknown> | null): ReviewPanel | null`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Digest estrutural e digest por IA têm origem e falhas diferentes; o hub observado compõe cartões a partir de projeções locais. Contraprova ou limite a preservar: Manter selo de IA depois de usar fallback estrutural atribui uma origem que não corresponde ao caminho efetivamente executado.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/chiron.ts",
          "symbol": "parseReview",
          "lines": [
            7,
            7
          ]
        },
        {
          "kind": "prose",
          "md": "### parseBalance — ../olympus/src/lib/panels/pluto.ts\n\nAssinatura observada: `export function parseBalance(raw: Record<string, unknown> | null, recentLimit = 6): BalancePanel | null`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Digest estrutural e digest por IA têm origem e falhas diferentes; o hub observado compõe cartões a partir de projeções locais. Contraprova ou limite a preservar: Manter selo de IA depois de usar fallback estrutural atribui uma origem que não corresponde ao caminho efetivamente executado.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/pluto.ts",
          "symbol": "parseBalance",
          "lines": [
            15,
            15
          ]
        }
      ]
    }
  ]
};
