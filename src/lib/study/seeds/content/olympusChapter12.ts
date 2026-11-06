import type { ContentChapter } from "./types";
export const OLYMPUS_CHAPTER_12: ContentChapter = {
  "title": "Chiron e Olympus: aprender e integrar",
  "level": "avancado",
  "nodeTitle": "Chiron e Olympus: aprender e integrar",
  "nodeKind": "concept",
  "sections": [
    {
      "title": "Chiron: índice, biblioteca e revisão por fonte",
      "order": 0,
      "blocks": [
        {
          "kind": "prose",
          "md": "Chiron separa o mapa global de estudo do corpo das bibliotecas. O índice contém fontes, nós, cards, tentativas e outros sinais de progresso; bibliotecas reúnem capítulos, seções e exercícios de uma fonte. Essa separação conceitual permite que revisão e navegação trabalhem com relações por identidade, sem carregar toda narrativa para decidir qual card vence hoje. O hub não precisa reproduzir a apostila inteira para oferecer uma visão útil de revisão. Ele projeta cards por fonte e mostra os grupos que podem orientar a próxima sessão no aplicativo proprietário.\n\nparseReview lê cards, sources e score do documento recebido. Para cada card, associa sourceId, conta total e incrementa due quando dueDate existe e não é posterior ao dia do helper. Depois resolve nomes das fontes, conserva grupos não vazios, ordena por quantidade devidos e total e limita a seis grupos. O resultado inclui streak, pontos e studiedToday. O renderer recebe uma visão pequena e coerente com o painel, mas esse recorte não possui todos os campos do agendamento SM-2 nem os registros necessários para validar uma revisão efetivamente concluída.\n\nOs exemplos executam essa função real. Uma fonte com dois cards, um antigo e outro distante, produz grupo com um devido e dois no total. Um array vazio produz dueTotal zero. Os oráculos são literais, com datas extremas para evitar dependência desnecessária do dia exato. Os programas não atualizam card, não registram reviewLog e não executam UI. Um vencimento na fixture demonstra a comparação aplicada pelo parser, sem comprovar que a pessoa revisou o conteúdo ou que o serviço de persistência guardou uma nova programação depois da resposta.\n\nO recorte também afeta o total mostrado. dueTotal é somado a partir dos grupos já cortados, não de todas as fontes originais. Se mais de seis fontes possuem cards devidos, o número pode representar apenas o conjunto selecionado para a visão. Isso difere de outros parsers que calculam totais antes de cortar a lista. A documentação precisa apontar essa semântica, e a UI deve evitar chamar o valor de total global sem qualificação. Uma ordenação correta e um contador plausível não significam que todas as fontes do índice foram incluídas no resumo.\n\nA integração remota possui uma diferença ainda mais fundamental. O registro do Olympus procura chiron-index, enquanto o store atual do Chiron escreve um agregado em chiron-data. O parser espera cards e sources diretamente no objeto que recebe, não necessariamente dentro de um envelope com index e libs. Assim, os testes com fixture compatível não demonstram que o hub lê a conta real do Chiron. A apostila registra o drift de chave e forma e não inventa dados para escondê-lo. Uma mudança funcional precisa de política de migração e consumidores revisados dos dois lados.\n\nAo estender a projeção, mantenha a diferença entre vencimento, desempenho e domínio. Um card devido informa uma necessidade de agendamento; pontos e streak descrevem outros registros; nenhum deles prova entendimento por si só. Uma fonte sem cards pode existir legitimamente e não aparecer nessa lista de grupos. Um sourceId desconhecido recebe título de fallback, sem criar uma fonte real no domínio. Use esses estados para formular fixtures de ausência, referência órfã e limite de grupos, em vez de normalizar tudo como se o documento proprietário já tivesse sido integralmente validado.\n\nA verificação completa exige o índice real, sua versão, o caminho de sincronização e o comportamento da página de revisão. Os programas publicados cobrem somente o parser local e deixam essas fronteiras explícitas. Essa leitura permite modificar a visão de revisão com conhecimento, preservando a autoridade do Chiron sobre agendamento e histórico. O leitor consegue distinguir biblioteca, índice, projeção e conta remota, evitando transformar um resumo de grupos em prova de aprendizado, total global ou integração plenamente funcional que os exemplos sintéticos e o código de leitura não têm como demonstrar sozinhos."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst chiron = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chiron.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chiron.parseReview({sources:[{id:\"s\",name:\"Livro\"}],cards:[{sourceId:\"s\",dueDate:\"2000-01-01\"},{sourceId:\"s\",dueDate:\"9999-01-01\"}]}).groups.map(g=>[g.title,g.due,g.total]));\nconst expected = [[\"Livro\",1,2]];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst chiron = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chiron.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chiron.parseReview({cards:[]}).dueTotal);\nconst expected = 0;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "O hub projeta revisão por fonte; dueTotal usa grupos já limitados e não certifica todo o índice ou a integração remota."
        },
        {
          "kind": "quebraria",
          "md": "Com mais de seis fontes, apresentar dueTotal como total global pode ocultar cards de grupos que ficaram fora do recorte."
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
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Chiron revisão\"><title>Chiron revisão</title><desc>dueTotal soma grupos já cortados; key e envelope reais têm drift.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Cards + fontes</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Agrupar vencimento</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Ordenar e cortar</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Resumo para revisar</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Chiron revisão: dueTotal soma grupos já cortados; key e envelope reais têm drift. Fonte: ../olympus/src/lib/panels/chiron.ts"
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/chiron.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### parseReview — ../olympus/src/lib/panels/chiron.ts\n\nAssinatura observada: `export function parseReview(raw: Record<string, unknown> | null): ReviewPanel | null`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: O hub projeta revisão por fonte; dueTotal usa grupos já limitados e não certifica todo o índice ou a integração remota. Contraprova ou limite a preservar: Com mais de seis fontes, apresentar dueTotal como total global pode ocultar cards de grupos que ficaram fora do recorte.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/chiron.ts",
          "symbol": "parseReview",
          "lines": [
            7,
            7
          ]
        }
      ]
    },
    {
      "title": "Chiron: curadoria, exemplos e aprendizado real",
      "order": 1,
      "blocks": [
        {
          "kind": "prose",
          "md": "O propósito do Chiron é ensinar compreensão de código, não produzir trechos para colar. A especificação registra essa orientação como centro do produto. Uma apostila precisa explicar mecanismo, motivo, falha e extensão, e seus exemplos devem ter evidência proporcional ao que afirmam. A presença de capítulos e cards não comprova que a pessoa aprendeu, assim como uma execução de fixture não comprova todo um aplicativo. Essa distinção conecta o domínio de estudo ao restante da família: os sinais precisam de origem e significado, não apenas de uma aparência de progresso.\n\nO corpus curado usa estruturas de capítulos, seções e blocos, com exemplos, perguntas, porque e quebraria. Contratos mecânicos verificam cardinalidade, densidade e certas relações; a auditoria editorial observa repetição e detalhamento; exemplos executáveis fornecem resultados locais. Para uma fonte de repositório, a cobertura também precisa ser confrontada com arquivos, exports e sistemas. Um teste que conta doze capítulos não descobre automaticamente um componente sem explicação. A conclusão da fonte Chiron exigiu esse inventário adicional, mostrando por que cumprir o formato e documentar o sistema são trabalhos relacionados, mas diferentes.\n\nOs exemplos desta seção executam projeções reais do hub. chironDocs associa uma fonte a zero cards e conserva o título; parseReview produz Sem fonte quando o card não encontra metadados reconhecidos. Esses resultados demonstram leitura tolerante e fallback de apresentação. Não aprovam uma apostila incompleta nem criam uma fonte persistida para resolver a referência órfã. O fato de a UI conseguir mostrar um rótulo não significa que o contrato editorial foi satisfeito. Essa separação é útil para não usar mecanismos de recuperação visual como justificativa para publicar conteúdo que ainda não concluiu sua própria barra.\n\nA progressão de estudo também distingue comportamento registrado e entendimento. readAt pode indicar que uma seção foi marcada como lida; uma tentativa registra uma resposta; um card possui uma programação futura; mastery é um sinal calculado ou alterado por caminhos específicos. Nenhum campo isolado é leitura de mente. Um tutor deve pedir justificativa e contraprova, ligando a tarefa ao código real. Preencher todos os indicadores com valores altos para uma demonstração não prova aprendizado e precisa ser identificado como dado sintético quando esse é o caso, como ocorre com atividade semeada de dashboard.\n\nA integração de uma fonte completa possui uma fronteira editorial deliberada. O builder pode produzir módulos de dados antes da aprovação, mas runSeed só deve receber conteúdo integral com os gates pertinentes. Escrever mais palavras para cruzar o piso sem ensinar mecanismos não atende ao propósito. Da mesma forma, instalar infraestrutura que apenas simula um framework ou serviço não torna o exemplo nativo. A legenda precisa indicar se o programa chama domínio real, transforma uma regra local, inspeciona fonte ou representa um modelo. O oráculo não deve ser calculado pela mesma implementação que está sendo testada.\n\nAo estender a curadoria, escolha primeiro a pergunta que o leitor deverá conseguir responder e modificar. Depois escreva uma explicação própria e um exemplo que distinga o comportamento vigente de uma alteração plausível. Acrescente exercícios e cards ligados àquele mecanismo, com respostas específicas e limites observados. A referência ao laboratório pode integrar a aprendizagem, mas metadados de invariantes não comprovam uma execução concorrente de backend. Uma apostila sobre reserva de estoque precisa dizer se seu caso é serial em memória ou se observou disputa real entre identidades e persistência adequada.\n\nA validação completa combina conteúdo, código e evidência, conservando pendências onde não houve ensaio. Esta fonte guarda-chuva documenta a particularidade do Chiron sem reabrir suas demais apostilas ou alterar o motor de estudo. O leitor pode usar os contratos como instrumentos de revisão, sem tratá-los como substitutos de autoria e compreensão. Os programas publicados permanecem no parser declarado, enquanto o texto aponta como a qualidade editorial e a aprendizagem exigem trabalho adicional. Assim, o sistema de estudo mantém sua identidade de tutor e evita transformar contadores, defaults ou selos de execução em promessa de conhecimento adquirido."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst chiron = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chiron.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chiron.chironDocs({sources:[{id:\"s\",title:\"Apostila\"}],cards:[]}).map(d=>[d.title,d.cards]));\nconst expected = [[\"Apostila\",0]];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst chiron = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chiron.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chiron.parseReview({cards:[{dueDate:\"2000-01-01\"}]}).groups[0].title);\nconst expected = \"Sem fonte\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Formato, cobertura, execução e aprendizado são dimensões distintas; um fallback visual não aprova uma fonte editorialmente incompleta."
        },
        {
          "kind": "quebraria",
          "md": "Usar Sem fonte para esconder uma referência órfã pode fazer a UI parecer saudável enquanto o contrato de identidade continua quebrado."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/CHIRON.md",
          "symbol": "code comprehension",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### chironDocs — ../olympus/src/lib/panels/chiron.ts\n\nAssinatura observada: `export function chironDocs(raw: Record<string, unknown> | null)`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Formato, cobertura, execução e aprendizado são dimensões distintas; um fallback visual não aprova uma fonte editorialmente incompleta. Contraprova ou limite a preservar: Usar Sem fonte para esconder uma referência órfã pode fazer a UI parecer saudável enquanto o contrato de identidade continua quebrado.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/chiron.ts",
          "symbol": "chironDocs",
          "lines": [
            54,
            54
          ]
        },
        {
          "kind": "prose",
          "md": "### parseReview — ../olympus/src/lib/panels/chiron.ts\n\nAssinatura observada: `export function parseReview(raw: Record<string, unknown> | null): ReviewPanel | null`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Formato, cobertura, execução e aprendizado são dimensões distintas; um fallback visual não aprova uma fonte editorialmente incompleta. Contraprova ou limite a preservar: Usar Sem fonte para esconder uma referência órfã pode fazer a UI parecer saudável enquanto o contrato de identidade continua quebrado.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/chiron.ts",
          "symbol": "parseReview",
          "lines": [
            7,
            7
          ]
        }
      ]
    },
    {
      "title": "Olympus: painéis de leitura e contrato de integração",
      "order": 2,
      "blocks": [
        {
          "kind": "prose",
          "md": "O reposicionamento v2 do Olympus troca o portal de links por um lugar de trabalho com peças centrais dos irmãos. Isso não exige reimplementar cada aplicativo inteiro. O hub recebe projeções, oferece navegação documental e destaca painéis em janelas. Cada integração precisa declarar o que lê, o que pode escrever e qual domínio conserva autoridade. A decisão de ser uma aplicação-mãe não elimina essas fronteiras. Sem elas, o hub pode virar um segundo conjunto de serviços incompletos, com regras divergentes e dados que parecem iguais apenas na superfície.\n\nSUITE_APPS fornece a ligação entre app, key, espelho e panelId. appByPanel retorna a entrada correspondente ou null quando não encontra; appById lança erro para um identificador desconhecido. Os exemplos executam os dois caminhos de busca por painel relevantes aqui: chiron-review retorna o irmão Chiron e um id ausente retorna null. O oráculo literal distingue um vínculo conhecido de uma ausência. Isso não abre o painel, não verifica a key remota e não transforma um manifesto em integração pronta. O contrato do catálogo é apenas a primeira parte da cadeia até a superfície de trabalho.\n\nA projeção de cada irmão possui perguntas próprias. Chronos mostra blocos e estado temporal; Kairos organiza atenção por prazo e status; Pluto apresenta fluxo e pressão; Hermes prioriza falhas de fila; Chiron agrupa revisão por fonte. A forma PanelBody permite ao renderer escolher apresentação por kind. O contexto do Oráculo serializa esses view models, compartilhando suas limitações. Um erro de filtro ou de chave se propaga para painel e prompt. Por isso, uma resposta convincente do assistente não deve ser usada para confirmar que todos os documentos originais foram carregados e compreendidos corretamente.\n\nO estado de leitura do hub também limita ações rápidas. Um pedido de escrita precisa dos serviços e invariantes do proprietário, além de identidade e revisão válidas. No código observado, o Oráculo não propõe JSON aplicável e o desk sync não escreve linhas dos irmãos. A documentação v2 pode apresentar ambições de integração mais amplas, mas essas rotas de leitura não certificam edição universal. A ausência dessa distinção faria a pessoa esperar que marcar algo num painel alterasse o domínio quando a implementação atual talvez apenas navegue, mostre uma projeção ou não ofereça aquela operação.\n\nO destaque de janela preserva o painel como unidade. O id precisa existir no catálogo, a rota precisa resolver sem a moldura normal e os providers precisam entregar preferências e espelhos adequados. Browser e shell nativo possuem efeitos diferentes. Um retorno de tentativa de abertura não equivale a uma janela pronta e atualizada. Da mesma maneira, uma PWA instalada não remove a separação entre origens dos irmãos. O hub pode ser a porta de trabalho da família enquanto cada aplicativo continua proprietário de sua sessão local, suas entidades e seus caminhos de mutação.\n\nAo estender uma integração, descreva o envelope remoto esperado e confronte o escritor real. O caso de chiron-index versus chiron-data demonstra que a lista de capacidades pode parecer completa enquanto falta compatibilidade de dados. Deep links também precisam ser verificados no roteador atual, e defaults não devem esconder indisponibilidade como vazio legítimo. Um contrato útil informa nome, versão, origem, campos consumidos, recorte e falha. Essa descrição permite atualizar apenas a projeção afetada quando um irmão evolui, sem assumir que todo payload pode ser aceito por meio de cast.\n\nA prova integral de integração exige observar dados reais autorizados e a jornada que o hub promete, incluindo recarregar, abrir documento, destacar painel e reconhecer falha. Os programas publicados nesta seção cobrem somente a busca nativa no registro. A apostila deixa os demais efeitos como não ensaiados, sem instalar ambientes que imitem o serviço para produzir aprovação. O leitor entende o hub como uma composição de contratos concretos e modificáveis, conservando sua utilidade de trabalho sem transformar catálogo, comentário ou status live em uma garantia de integração completa que não foi efetivamente observada."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.appByPanel(\"chiron-review\").id);\nconst expected = \"chiron\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.appByPanel(\"missing\"));\nconst expected = null;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "O hub compõe projeções e contratos; um panelId registrado não comprova leitura remota, rota ou escrita de domínio."
        },
        {
          "kind": "quebraria",
          "md": "Defaults que escondem uma key incompatível podem apresentar painel vazio como se o usuário realmente não tivesse dados."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/OLYMPUS-V2.md",
          "symbol": "Peça central destacável",
          "lines": [
            31,
            31
          ]
        },
        {
          "kind": "prose",
          "md": "### appByPanel — ../olympus/src/lib/suite/registry.ts\n\nAssinatura observada: `export function appByPanel(panelId: PanelId): SuiteApp | null`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: O hub compõe projeções e contratos; um panelId registrado não comprova leitura remota, rota ou escrita de domínio. Contraprova ou limite a preservar: Defaults que escondem uma key incompatível podem apresentar painel vazio como se o usuário realmente não tivesse dados.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/suite/registry.ts",
          "symbol": "appByPanel",
          "lines": [
            129,
            129
          ]
        }
      ]
    },
    {
      "title": "Como estender a suíte sem duplicar a autoridade",
      "order": 3,
      "blocks": [
        {
          "kind": "prose",
          "md": "A extensão da família deve preservar a pergunta de quem é dono de cada decisão. Uma capacidade compartilhada pode ser reutilizada sem que o hub passe a editar todo documento. Uma preferência pode ser transportada sem obrigar todos os aplicativos a adotar imediatamente o mesmo formato. Um painel pode mostrar o próximo trabalho sem incorporar o solver proprietário. Essa separação é o fio que liga autenticação, KV, sincronização, IA, shell e particularidades dos irmãos. O objetivo é tornar a integração compreensível e modificável, não fazer toda superfície parecer equivalente por meio de nomes e tipos copiados.\n\nOs exemplos finais executam operações reais de preferência de painel. Aplicar togglePanel duas vezes ao mesmo id devolve hidden ao estado vazio. movePanel conserva a ordem explícita fornecida. Esses oráculos tornam duas regras locais verificáveis, mas não demonstram drag-and-drop ou renderização nessa ordem. O backlog registra a ausência histórica de UI para reordenar apesar de o campo existir. A distinção reforça uma lição recorrente: um serviço capaz de representar uma escolha não significa que a jornada correspondente foi construída, testada e entregue no produto.\n\nAntes de escrever uma extensão, desenhe seu fluxo em termos de dados e efeitos. Um leitor precisa de formato e frescor; um escritor precisa também de invariantes, autorização e política de concorrência. Uma ponte necessita identidade de solicitação e recibo; uma resposta de IA precisa de validação e decisão de autonomia. Se a operação só existe como plano, o código da documentação deve dizer isso. Acrescentar um objeto que sempre retorna sucesso ou um estado synthetic sem legenda não conclui o contrato. A prova deve observar o efeito que o produto realmente pretende oferecer.\n\nAs decisões de copiar componentes e manter repositórios independentes possuem custo e benefício. O backlog exclui a extração de um pacote comum daquele escopo. Isso permite entregas separadas, mas exige revisão de drift e propagação consciente das melhorias. Criar uma biblioteca compartilhada seria uma mudança arquitetural que afeta build, versões e fluxo de trabalho. Não é uma refatoração a inserir escondida durante a autoria de uma apostila. O leitor deve reconhecer o limite entre explicar uma alternativa e executar uma alteração que depende de outro acordo de produto.\n\nO repositório planejador também precisa de cobertura documental honesta. README orienta leitura; SUITE-ARCHITECTURE define a receita; SUITE-SHELL governa a moldura; OLYMPUS-V2 substitui posicionamento; OLYMPUS preserva história e restrições; ROADMAP e BACKLOG possuem marcos distintos; CHECKLIST registra auditoria; DESIGN-REFERENCES traduz referências; as especificações PLUTO, HERMES e CHIRON descrevem domínios; HANDOFF conserva uma retomada histórica. Ler os treze como um estado simultâneo elimina informação temporal e cria certezas falsas. A apostila deve mostrar precedência, papel e limitações de cada fonte, em vez de selecionar apenas caixas favoráveis.\n\nAo concluir trabalho funcional, atualize os registros pertinentes com o método e o resultado realmente observados. Build local, função executada, inspeção de fonte e uso remoto são evidências diferentes. Uma pendência de ambiente pode permanecer pendência sem invalidar uma explicação local correta; ela também não pode ser promovida a aprovação por conveniência. Preservar alterações alheias e evitar publicação parcial mantém o corpus confiável durante sessões longas. A integração editorial de uma fonte inteira só acontece quando seus próprios gates estão concluídos, sem reduzir piso, similaridade ou exigência de exemplos para caber numa rodada.\n\nA extensão está pronta quando uma pessoa consegue localizar o contrato, entender a decisão, reproduzir a prova e identificar o que falta para uma afirmação maior. Esta fonte executa programas nativos sobre módulos reais e inspeções locais, sem certificar DOM, serviços remotos ou entrega externa que não observou. Ela conserva os desvios de chave, rota e sincronização como fatos a revisar, não como problemas silenciosamente corrigidos em outros projetos. Assim, Olympus pode funcionar como uma apostila guarda-chuva: ensina o comum, explica particularidades e preserva a autoridade de cada domínio, permitindo avançar com conhecimento em vez de duplicar comportamentos apenas porque a interface parece semelhante."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.togglePanel(service.togglePanel(prefs.emptyPrefs(),\"kairos-now\"),\"kairos-now\").panels.hidden);\nconst expected = [];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.movePanel(prefs.emptyPrefs(),[\"chiron-review\",\"kairos-now\"]).panels.order);\nconst expected = [\"chiron-review\",\"kairos-now\"];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "A extensão deve declarar leitor, escritor e efeito; representar uma preferência não comprova que a UI ou a integração correspondente existe."
        },
        {
          "kind": "quebraria",
          "md": "Criar um escritor universal no hub sem invariantes dos proprietários duplica autoridade e permite documentos que nenhum irmão sabe reconciliar."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/BACKLOG.md",
          "symbol": "Explicitly not doing",
          "lines": [
            77,
            77
          ]
        },
        {
          "kind": "prose",
          "md": "### emptyPrefs — ../olympus/src/lib/prefs/types.ts\n\nAssinatura observada: `export function emptyPrefs(): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: A extensão deve declarar leitor, escritor e efeito; representar uma preferência não comprova que a UI ou a integração correspondente existe. Contraprova ou limite a preservar: Criar um escritor universal no hub sem invariantes dos proprietários duplica autoridade e permite documentos que nenhum irmão sabe reconciliar.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/types.ts",
          "symbol": "emptyPrefs",
          "lines": [
            97,
            97
          ]
        },
        {
          "kind": "prose",
          "md": "### togglePanel — ../olympus/src/lib/prefs/service.ts\n\nAssinatura observada: `export function togglePanel(prefs: SuitePrefs, id: PanelId): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: A extensão deve declarar leitor, escritor e efeito; representar uma preferência não comprova que a UI ou a integração correspondente existe. Contraprova ou limite a preservar: Criar um escritor universal no hub sem invariantes dos proprietários duplica autoridade e permite documentos que nenhum irmão sabe reconciliar.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/service.ts",
          "symbol": "togglePanel",
          "lines": [
            42,
            42
          ]
        },
        {
          "kind": "prose",
          "md": "### movePanel — ../olympus/src/lib/prefs/service.ts\n\nAssinatura observada: `export function movePanel(prefs: SuitePrefs, order: PanelId[]): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: A extensão deve declarar leitor, escritor e efeito; representar uma preferência não comprova que a UI ou a integração correspondente existe. Contraprova ou limite a preservar: Criar um escritor universal no hub sem invariantes dos proprietários duplica autoridade e permite documentos que nenhum irmão sabe reconciliar.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/service.ts",
          "symbol": "movePanel",
          "lines": [
            48,
            48
          ]
        },
        {
          "kind": "labref",
          "labId": "agora",
          "layerId": "reserva-estoque-concorrencia"
        }
      ]
    }
  ]
};
