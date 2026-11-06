import type { ContentChapter } from "./types";
export const OLYMPUS_CHAPTER_11: ContentChapter = {
  "title": "Pluto e Hermes: dinheiro e entrega",
  "level": "avancado",
  "nodeTitle": "Pluto e Hermes: dinheiro e entrega",
  "nodeKind": "concept",
  "sections": [
    {
      "title": "Pluto: centavos, saldo e pressão de orçamento",
      "order": 0,
      "blocks": [
        {
          "kind": "prose",
          "md": "Pluto representa valores monetários em centavos no modelo de domínio, evitando tratar a apresentação com duas casas como a unidade de cálculo. O hub recebe um ledger e produz uma visão do mês com receita, despesa, líquido, orçamento e lançamentos recentes. Essa projeção ajuda a responder onde existe pressão de gasto, mas não substitui o serviço financeiro proprietário nem consulta uma conta bancária. O saldo calculado pelo parser é uma medida sobre os dados fornecidos. Sua exatidão depende de entrada, classificação, datas e contrato do domínio, não apenas da formatação em moeda na tela.\n\nparseBalance exige transactions como array e usa o mês local corrente para selecionar lançamentos cujo date começa com aquele prefixo. Soma income e expense separadamente e calcula netCents pela diferença. Transferências não entram nessas duas somas. O helper num aceita números finitos, mas não exige inteiros; portanto, a intenção de centavos inteiros do domínio não é validada integralmente por esse parser. A projeção é tolerante e não deve ser chamada de validador financeiro completo. Dados fracionários ou classificados incorretamente podem atravessar sua leitura sem erro explícito.\n\nOs exemplos executam a implementação real com fixtures sintéticas. A data do helper compõe uma entrada de receita de mil e duzentos centavos e despesa de quatrocentos, exigindo líquido oitocentos. Outra entrada vazia observa a moeda padrão BRL. São regras de projeção, não recomendações financeiras nem conciliação de valores de uma pessoa. O caso com data corrente também conserva o limite temporal do sistema: perto de uma virada entre UTC e mês local, a política precisa ser analisada com cenários próprios antes de afirmar cobertura de calendário e de fechamento mensal.\n\nA pressão de orçamento vem de outra relação. Cada budget identifica categoria e limite em monthCents; o parser soma despesas do mês naquela categoria e calcula ratio quando o limite é positivo. Ordena por razão decrescente e conserva até quatro linhas. Um orçamento acima de cem por cento aparece antes, mas uma categoria sem limite positivo recebe ratio zero conforme a implementação observada. Essa escolha evita uma divisão inválida, sem resolver o significado de um gasto sem orçamento. A UI precisa saber explicar esse estado em vez de apresentar zero como ausência de despesa ou de risco.\n\nOs lançamentos recentes usam a coleção inteira, ordenada por data e cortada por recentLimit, não apenas os do mês selecionado para os totais. Isso permite mostrar atividade anterior junto do resumo atual, mas também exige cuidado na leitura. O usuário não deve somar as linhas recentes e esperar igualdade automática com receita e despesa mensal. Além disso, o tipo desconhecido cai no fallback expense da projeção. Essa tolerância precisa ser confrontada quando o domínio acrescenta uma variante nova, para não reclassificar silenciosamente um evento que o parser antigo ainda não conhece.\n\nAo estender o painel, mantenha separadas as perguntas de saldo de carteira, fluxo mensal, orçamento e progresso de meta. Cada uma usa conjuntos e relações diferentes. Uma transferência pode afetar carteiras sem representar receita nova; uma contribuição pode medir uma meta sem ser uma nova entrada de renda. O serviço do Pluto possui as invariantes e operações proprietárias. A apostila não redesenha esse domínio nem usa o número do hub para orientar decisões pessoais. Ela ensina a seguir a origem do cálculo e a reconhecer quando um resumo perdeu informação necessária para a pergunta que se deseja responder.\n\nUma validação adequada inclui centavos, transferências, categorias ausentes, limite zero, datas fora do mês e tipo desconhecido, com expectativas independentes. Para afirmar conciliação real, seria necessário um processo autorizado que observe os dados e fontes correspondentes; estes programas não o fazem. A evidência publicada fica na execução nativa dos parsers. Esse limite permite modificar o resumo com conhecimento e evita que um cartão de saldo, mesmo visualmente convincente, seja confundido com confirmação de patrimônio, conciliação bancária ou avaliação financeira que a projeção local nunca teve autoridade nem dados suficientes para oferecer."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst panel = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/types.ts\")).href);\nconst pluto = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/pluto.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = ((()=>{const date=panel.today();const b=pluto.parseBalance({transactions:[{type:\"income\",amountCents:1200,date},{type:\"expense\",amountCents:400,date}]});return [b.incomeCents,b.expenseCents,b.netCents]})());\nconst expected = [1200,400,800];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst pluto = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/pluto.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (pluto.parseBalance({transactions:[]}).currency);\nconst expected = \"BRL\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Fluxo mensal, carteira, orçamento e meta possuem conjuntos diferentes; o parser projeta dados fornecidos e não realiza conciliação."
        },
        {
          "kind": "quebraria",
          "md": "Somar apenas os lançamentos recentes e exigir igualdade com o total mensal ignora que as duas coleções usam filtros diferentes."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/pluto.ts",
          "symbol": "parseBalance",
          "lines": [
            15,
            15
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Pluto no hub\"><title>Pluto no hub</title><desc>Projeção não concilia saldo externo e não valida integralidade de centavos.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Ledger</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Mês/categoria</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Somas em centavos</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">BalancePanel</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Pluto no hub: Projeção não concilia saldo externo e não valida integralidade de centavos. Fonte: ../olympus/src/lib/panels/pluto.ts"
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/pluto.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### today — ../olympus/src/lib/panels/types.ts\n\nAssinatura observada: `export function today(): string`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Fluxo mensal, carteira, orçamento e meta possuem conjuntos diferentes; o parser projeta dados fornecidos e não realiza conciliação. Contraprova ou limite a preservar: Somar apenas os lançamentos recentes e exigir igualdade com o total mensal ignora que as duas coleções usam filtros diferentes.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/types.ts",
          "symbol": "today",
          "lines": [
            41,
            41
          ]
        },
        {
          "kind": "prose",
          "md": "### parseBalance — ../olympus/src/lib/panels/pluto.ts\n\nAssinatura observada: `export function parseBalance(raw: Record<string, unknown> | null, recentLimit = 6): BalancePanel | null`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Fluxo mensal, carteira, orçamento e meta possuem conjuntos diferentes; o parser projeta dados fornecidos e não realiza conciliação. Contraprova ou limite a preservar: Somar apenas os lançamentos recentes e exigir igualdade com o total mensal ignora que as duas coleções usam filtros diferentes.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
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
    },
    {
      "title": "Pluto: carteira, meta e índice documental",
      "order": 1,
      "blocks": [
        {
          "kind": "prose",
          "md": "Carteiras e metas são documentos úteis para retomar o trabalho financeiro, mas não representam a mesma entidade. Uma carteira reúne lançamentos associados ao seu id; uma meta compara contribuições com um alvo. plutoDocs transforma essas duas coleções em entradas para o índice do hub, com kind, título, detalhe e data. O objetivo é ajudar a encontrar o objeto no aplicativo proprietário. O detalhe curto não deve ser lido como um balanço completo nem como prova de que a meta está reconciliada com uma instituição externa ou com todas as regras do ledger.\n\nPara carteiras, o extrator percorre wallets e conta transactions cujo walletId coincide. Produz um texto de quantidade de lançamentos e usa updatedAt ou createdAt da carteira. A contagem não é saldo. Uma carteira com muitos lançamentos pode ter valor líquido pequeno, e uma transferência pode tocar relações que não se resumem ao walletId de origem. A projeção documental escolhe um detalhe simples, adequado à descoberta, sem repetir o cálculo proprietário de walletBalance. Confundir esse detalhe com uma medida financeira maior seria um erro de interpretação do consumidor, mesmo quando o código funciona exatamente como escrito.\n\nO primeiro exemplo usa uma carteira e um lançamento associado, exigindo kind wallet e o detalhe literal de um lançamento. O segundo cria uma meta de mil centavos com contribuição de duzentos e cinquenta, exigindo vinte e cinco por cento da meta. Ambos executam o extrator real com entradas sintéticas. Não alteram o ledger, não criam uma contribuição persistida e não movimentam dinheiro. A evidência mostra associação e proporção locais, sem afirmar que o percentual corresponde a fundos disponíveis ou que a contribuição já foi reconhecida por um serviço externo.\n\nPara metas, o parser remove entradas com archivedAt, soma contribuições pelo goalId e arredonda o percentual quando targetCents é positivo. Sem alvo positivo, apresenta sem alvo. A função não aplica necessariamente um teto de cem por cento, o que pode ser coerente para indicar que o objetivo foi excedido. A cor e outros campos proprietários não entram em todo detalhe documental. O consumidor precisa conservar a identidade do objeto e evitar inventar progresso quando dados estão ausentes. Uma meta arquivada não aparece nessa projeção, mas suas contribuições podem continuar existindo no domínio e em outros relatórios.\n\nA data escolhida não incorpora automaticamente a última contribuição ou transação. plutoDocs recorre aos timestamps da carteira ou meta. Se o proprietário não atualiza esses campos quando há atividade relacionada, a recência documental pode parecer antiga apesar de existir um lançamento novo. Essa é uma diferença em relação à projeção de projetos do Kairos, que procura timestamps nas tarefas. Não existe uma política universal de recência só porque as entradas compartilham SuiteDoc. Cada adaptador precisa explicar o que sua data representa e quais consumidores dependem dessa escolha para ordenar trabalho recente.\n\nAo estender o índice, avalie se uma nova unidade pertence à descoberta documental ou ao resumo analítico. Exibir orçamentos como documentos pode ser útil se houver um destino e uma identidade estável; gerar um cartão para toda linha de transação pode inflar a lista e dificultar retomar o trabalho. O deep link precisa corresponder ao roteador do Pluto e à entidade selecionada. Abrir apenas /wallets ou /goals pode levar a uma coleção, sem selecionar o objeto específico. A documentação deve ensinar esse alcance em vez de prometer que cada href restaura exatamente o contexto anterior.\n\nA validação completa separa contagem, cálculo de proporção, filtro de arquivo, recência e navegação. Os programas publicados cobrem dois desses cálculos locais e mantêm seu escopo explícito. A apostila não usa dados financeiros pessoais nem faz recomendações de alocação. O leitor recebe um mapa para modificar a projeção com conhecimento, preservando propriedade do ledger e sem transformar um detalhe de cartão em saldo certificado, aporte efetivado ou prova de que toda informação necessária para uma decisão financeira foi sincronizada e verificada entre os aplicativos da família."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst pluto = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/pluto.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (pluto.plutoDocs({wallets:[{id:\"w\",name:\"Carteira\"}],transactions:[{walletId:\"w\"}]}).map(d=>[d.kind,d.meta]));\nconst expected = [[\"wallet\",\"1 lançamentos\"]];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst pluto = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/pluto.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (pluto.plutoDocs({goals:[{id:\"g\",targetCents:1000}],contributions:[{goalId:\"g\",amountCents:250}]}).map(d=>d.meta));\nconst expected = [\"25% da meta\"];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "O detalhe documental identifica trabalho; contagem de lançamentos não é saldo e percentual de meta não comprova disponibilidade de fundos."
        },
        {
          "kind": "quebraria",
          "md": "Usar apenas timestamps da meta pode deixá-la antiga na lista de recentes quando uma contribuição nova não atualiza o objeto proprietário."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/pluto.ts",
          "symbol": "plutoDocs",
          "lines": [
            85,
            85
          ]
        },
        {
          "kind": "prose",
          "md": "### plutoDocs — ../olympus/src/lib/panels/pluto.ts\n\nAssinatura observada: `export function plutoDocs(raw: Record<string, unknown> | null)`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: O detalhe documental identifica trabalho; contagem de lançamentos não é saldo e percentual de meta não comprova disponibilidade de fundos. Contraprova ou limite a preservar: Usar apenas timestamps da meta pode deixá-la antiga na lista de recentes quando uma contribuição nova não atualiza o objeto proprietário.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/pluto.ts",
          "symbol": "plutoDocs",
          "lines": [
            85,
            85
          ]
        }
      ]
    },
    {
      "title": "Hermes: estado da outbox e ordenação por falha",
      "order": 2,
      "blocks": [
        {
          "kind": "prose",
          "md": "Hermes organiza a fronteira entre intenção de comunicar e entrega a um canal externo. Seu documento de outbox contém mensagens com status e metadados de tentativa. O hub projeta essa fila para destacar primeiro o que merece atenção: falhas, depois pendências, depois envios registrados. Essa ordenação é a particularidade operacional do painel. Ela não envia mensagens e não substitui o consumer ou o provedor de email, Telegram ou WhatsApp. Um item com status sent no JSON é uma declaração do documento recebido, não um recibo de entrega conferido independentemente pelo parser.\n\nparseOutbox exige messages como array e normaliza cada item para id, assunto, canal, origem, status, data e erro. Um status diferente de sent ou failed cai em pending. Depois ordena pela classe e, dentro dela, pela data em ordem decrescente, conservando até limit itens. O algoritmo produz uma visão pequena sem exigir que o componente conheça todos os formatos antigos de mensagem. Essa tolerância também significa que uma variante nova pode virar pendente silenciosamente, o que precisa ser confrontado quando o domínio do Hermes evolui seu vocabulário.\n\nOs exemplos executam a função real. Uma fixture com pending, failed e sent exige a ordem dos ids como falha, pendência e envio. Outro caso fornece status desconhecido e observa pending um. Esses resultados verificam duas regras locais com oráculos literais, sem servidor substituto. Não mandam email nem comprovam que um erro de canal ocorreu. Uma mudança de status no dado sintético é apenas entrada para o parser. O método é adequado para ensinar a ordenação, desde que sua legenda não a apresente como uma execução de entrega multicanal ou um teste de credenciais remotas.\n\nOs totais de pending e failed usam a coleção inteira, enquanto a lista é cortada. sentToday depende de sentAt começando com o dia retornado por today. Portanto, a contagem pode incluir itens que não aparecem no recorte atual e herda a política temporal do helper. Datas de criação e envio também têm papéis diferentes: a projeção escolhe sentAt ou createdAt para mostrar e ordenar, mas a análise de latência exigiria ambos. Um painel de atenção não é automaticamente um relatório de tempo de entrega, tentativas, duplicação ou confirmação de leitura pelo destinatário.\n\nAssunto e erro são dados externos de apresentação. O parser oferece fallbacks para mensagens sem subject ou com campos incompletos, terminando em um título genérico. Isso mantém a UI utilizável, mas não valida o payload de cada template. Uma mensagem monthly-report pode exigir campos muito diferentes de custom ou deadline-reminder. O consumer responsável pelo canal precisa interpretar o conteúdo e relatar erro; o painel apenas mostra o que recebeu. Copiar sua normalização para construir uma mensagem nova poderia perder justamente os campos que a entrega exige e que a projeção não conserva.\n\nAo estender a fila, decida se o novo estado é transitório, terminal ou uma informação de apresentação. Acrescentar sending, retry ou delivered sem revisar parsers antigos pode fazê-los tratar o item como pending. Defina a semântica de reenvio e onde está o recibo do provedor. Uma linha sent pode significar aceitação da API, sem comprovar entrega na caixa de entrada ou leitura humana. A linguagem da UI deve acompanhar a garantia real, evitando que uma cor verde transforme um evento técnico limitado em promessa de comunicação concluída de ponta a ponta.\n\nA validação adequada separa o serviço puro da outbox, o transporte do consumer, a resposta do provedor e o painel de leitura. Os programas publicados cobrem a projeção local e não instalam n8n nem simulam um serviço de entrega para obter aprovação. Essa delimitação permite modificar a ordenação e os fallbacks com conhecimento do que cada campo representa. O leitor entende por que falhas vêm primeiro, por que totais diferem do recorte visível e por que uma fila bem renderizada ainda precisa de evidência operacional própria antes de ser apresentada como um sistema de entrega confiável."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst hermes = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/hermes.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (hermes.parseOutbox({messages:[{id:\"p\",status:\"pending\"},{id:\"f\",status:\"failed\"},{id:\"s\",status:\"sent\"}]}).messages.map(m=>m.id));\nconst expected = [\"f\",\"p\",\"s\"];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst hermes = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/hermes.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (hermes.parseOutbox({messages:[{status:\"unknown\"}]}).pending);\nconst expected = 1;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "A projeção ordena atenção e normaliza status; não executa o transporte nem verifica o recibo do canal."
        },
        {
          "kind": "quebraria",
          "md": "Adicionar um estado novo no Hermes sem revisar o parser pode fazê-lo aparecer como pending no hub por causa do fallback."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/hermes.ts",
          "symbol": "parseOutbox",
          "lines": [
            14,
            14
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Hermes e entrega\"><title>Hermes e entrega</title><desc>Painel não envia; sent não equivale a leitura do destinatário.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Outbox</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Normalizar estado</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Falhas primeiro</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Recorte do painel</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Hermes e entrega: Painel não envia; sent não equivale a leitura do destinatário. Fonte: ../olympus/src/lib/panels/hermes.ts"
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/hermes.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### parseOutbox — ../olympus/src/lib/panels/hermes.ts\n\nAssinatura observada: `export function parseOutbox(raw: Record<string, unknown> | null, limit = 8): OutboxPanel | null`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: A projeção ordena atenção e normaliza status; não executa o transporte nem verifica o recibo do canal. Contraprova ou limite a preservar: Adicionar um estado novo no Hermes sem revisar o parser pode fazê-lo aparecer como pending no hub por causa do fallback.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/hermes.ts",
          "symbol": "parseOutbox",
          "lines": [
            14,
            14
          ]
        }
      ]
    },
    {
      "title": "Hermes: flow, tentativa e confirmação de entrega",
      "order": 3,
      "blocks": [
        {
          "kind": "prose",
          "md": "Um diagrama de flow descreve uma automação; não demonstra que ela roda continuamente em produção. A decisão ratificada no plano do Hermes separa o papel de n8n do caminho operacional de entrega. Flows locais servem ao desenho, demonstração e portfólio, com JSON versionado. A entrega de produção é planejada e implementada por um caminho de cron e Edge Function no backend existente. Essa distinção evita depender de um processo local sempre ligado e, sobretudo, evita apresentar uma visualização bonita como prova de que um destinatário recebeu uma mensagem.\n\nO repositório Hermes contém catálogos e arquivos de flow para heartbeat, outbox-consumer e monthly-report. O backend do Chronos possui uma função outbox-consumer que lê mensagens pendentes, chama APIs de canal e marca resultados. Esses artefatos são fontes de responsabilidades diferentes. Um editor pode mostrar nós e execuções demonstrativas sem possuir um caminho que atualiza todos os run summaries remotos. O checklist histórico registra justamente limitações dessa relação. A documentação deve conservar a diferença entre catálogo, execução local, tentativa de serviço e resumo apresentado, sem preencher lacunas com estados sintéticos não identificados.\n\nOs exemplos desta seção observam um total de falhas com limit um no parser real e a presença de pg_cron no plano. A primeira chamada exige duas falhas embora a lista visível seja menor. A segunda é uma inspeção de fonte que localiza a decisão de operação. Nenhuma delas dispara um cron ou realiza entrega. A legenda distingue as duas provas. Instalar um engine ou criar uma API que sempre responde sucesso não certificaria o caminho de produção descrito; apenas acrescentaria um ambiente diferente que não resolve a falta de observação do serviço real.\n\nA função de consumer observada seleciona mensagens pending com limite de tentativas, incrementa attempts ao marcar resultado e preenche sentAt quando declara sent. O significado dessa marca precisa ser ligado à resposta do provedor. Uma API pode aceitar um envio sem garantir que a pessoa o leu. Uma falha pode acontecer antes ou depois de um efeito externo, tornando o reenvio delicado. O estado do documento e um código HTTP são evidências úteis, mas não equivalem a entrega exatamente uma vez. Idempotência, claim concorrente e recibos precisam de mecanismos e ensaios próprios.\n\nO caminho de leitura e escrita do documento também exige análise de concorrência. Um consumidor que lê uma outbox inteira e grava uma versão modificada pode disputar com um produtor que acrescenta outra mensagem. Sem uma política adequada, uma atualização pode apagar a outra. O simples uso de cron não resolve essa disputa e pode criar execuções sobrepostas se uma rodada demora mais que o intervalo. A apostila não afirma uma transação que não observou nem modifica o backend durante a autoria. Ela aponta onde produtor, consumer e persistência devem ser examinados juntos antes de ampliar garantias operacionais.\n\nAo acrescentar um canal, separe configuração de cliente, segredo do servidor, preparação de template e adaptação de resposta. O navegador normalmente não sabe se um segredo do servidor está configurado apenas porque o canal existe no catálogo. Uma UI honesta pode dizer que precisa testar, em vez de afirmar indisponibilidade ou sucesso sem um endpoint que observe esse estado. Não publique credenciais em exemplos nem use uma conta real fora do escopo autorizado. Fixtures locais ajudam a validar transformação do payload, mas não devem receber o nome de envio nativo do canal que nunca foi chamado.\n\nA extensão está pronta quando é possível rastrear uma mensagem desde a intenção até o efeito que o sistema realmente consegue confirmar. Registre o que sent significa, como retry se comporta, quais dados entram no histórico e como erros aparecem na interface. Para concluir que a entrega funciona, observe um destinatário autorizado e o serviço pertinente. Esta apostila executa apenas os programas declarados e conserva a operação remota como não ensaiada. O leitor entende o papel de cada artefato e pode modificar a automação sem confundir JSON de flow, cron configurado, tentativa registrada e confirmação efetiva de comunicação."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst hermes = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/hermes.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (hermes.parseOutbox({messages:[{status:\"failed\"},{status:\"failed\"},{status:\"pending\"}]},1).failed);\nconst expected = 2;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus-plan/HERMES.md\").includes(\"pg_cron\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Flow de demonstração e consumer de produção possuem papéis diferentes; sent precisa de semântica ligada ao recibo efetivamente observado."
        },
        {
          "kind": "quebraria",
          "md": "Reenviar depois de uma falha ambígua pode duplicar um efeito externo se o provedor já aceitou a mensagem antes da atualização de status."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/HERMES.md",
          "symbol": "split model",
          "lines": [
            15,
            15
          ]
        },
        {
          "kind": "prose",
          "md": "### parseOutbox — ../olympus/src/lib/panels/hermes.ts\n\nAssinatura observada: `export function parseOutbox(raw: Record<string, unknown> | null, limit = 8): OutboxPanel | null`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Flow de demonstração e consumer de produção possuem papéis diferentes; sent precisa de semântica ligada ao recibo efetivamente observado. Contraprova ou limite a preservar: Reenviar depois de uma falha ambígua pode duplicar um efeito externo se o provedor já aceitou a mensagem antes da atualização de status.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/hermes.ts",
          "symbol": "parseOutbox",
          "lines": [
            14,
            14
          ]
        }
      ]
    }
  ]
};
