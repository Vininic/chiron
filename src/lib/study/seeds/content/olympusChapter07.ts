import type { ContentChapter } from "./types";
export const OLYMPUS_CHAPTER_7: ContentChapter = {
  "title": "Idioma, extensões e documentos",
  "level": "intermediario",
  "nodeTitle": "Idioma, extensões e documentos",
  "nodeKind": "concept",
  "sections": [
    {
      "title": "Dicionários e formatação sem alterar o domínio",
      "order": 0,
      "blocks": [
        {
          "kind": "prose",
          "md": "Idioma de interface muda rótulos e apresentação, mas não deve alterar silenciosamente os identificadores e formatos que sustentam o domínio. O provider de i18n do Olympus lê suite.locale, verifica a lista de locales suportados, escolhe um dicionário e atualiza o atributo lang do documento. O namespace igual ao de outros irmãos continua sendo local à origem. Uma preferência guardada no hub não aparece automaticamente no navegador de outro domínio. A adoção remota de suite-prefs é uma cadeia adicional e precisa ser observada separadamente do estado que esse provider administra.\n\nOs dicionários de domínio e do hub possuem formas distintas. useT devolve o vocabulário que já existia na base, enquanto useHub seleciona textos das superfícies reconstruídas. Essa separação evita obrigar a nova interface a encaixar toda string no formato do protótipo antigo. Contudo, dois mapas coerentes em TypeScript não comprovam tradução completa ou semanticamente correta. Literais podem continuar fora dos dicionários, parâmetros podem ser usados de maneira errada e pluralizações podem não representar o valor mostrado. A revisão precisa seguir o texto até os consumidores, sem confundir shape compartilhado com qualidade linguística.\n\nO serviço puro de preferências aceita locale como string. Ele não aplica a mesma lista de valores suportados que readStoredLocale utiliza no provider. Os exemplos deixam essa diferença observável: setLocale conserva uma string não registrada, e migrate conserva pt-BR num campo recebido. Não há inconsistência no teste; as funções respondem perguntas diferentes. O documento de preferência guarda um valor, enquanto a interface precisa resolvê-lo para um dicionário disponível. Uma extensão que conecte diretamente ambos deve definir normalização e fallback, em vez de depender de um cast para inventar uma opção inexistente.\n\nAs datas mostram a diferença entre apresentação e significado. Um dia canônico como 2026-10-19 não deve ser reescrito como texto localizado dentro do documento que os algoritmos comparam. A interface pode formatar esse dia para leitura, mas precisa preservar seu sentido temporal. Os parsers do hub usam today baseado em ISO UTC em alguns pontos e relógio local em outros. Traduzir o rótulo Hoje não corrige essa mistura. Idioma, zona temporal e calendário são decisões diferentes, que devem aparecer no contrato quando o domínio depende de vencimentos, rotinas ou fechamento mensal.\n\nO prompt do Oráculo também inclui idioma de UI. refreshContext resolve a preferência local e fornece uma label de linguagem ao system prompt. A instrução ajuda a evitar respostas numa língua inesperada, mas não muda os dados serializados nem certifica a obediência do modelo. Identificadores, headings de protocolos e status canônicos podem permanecer em inglês mesmo numa tela em português. O round-trip Markdown do Kairos, por exemplo, usa vocabulário canônico para que exportação e importação concordem. Traduzir esses tokens sem revisar o parser quebraria um contrato de dados, não apenas uma frase da interface.\n\nAo acrescentar um locale, procure a união de tipos, labels BCP 47, listas aceitas, dicionários, formatadores, seletores e instruções do assistente. Inclua uma preferência desconhecida para verificar o fallback e um documento antigo para observar a migração. A revisão visual precisa conferir texto longo, quebra de linha e nomes acessíveis, porque uma tradução válida pode não caber num controle. Esses ensaios não são realizados pelos dois programas publicados, que ficam no serviço de preferências e no migrador. A limitação deve permanecer explícita mesmo quando o compilador aprova os objetos retornados.\n\nA extensão está completa quando o leitor consegue separar dado canônico, preferência persistida e texto apresentado. A ausência de uma tradução não deve alterar id de entidade, valor financeiro ou regra de agendamento. Uma preferência inválida precisa de resposta previsível na UI e de uma política consciente no documento. Esta seção conserva o comportamento real das funções e aponta os consumidores necessários, sem alterar o idioma de outros aplicativos durante a autoria. Assim, a gramática comum continua útil sem transformar i18n numa migração implícita do domínio ou numa promessa de sincronização entre origens."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.setLocale(prefs.emptyPrefs(),\"xx-unregistered\").locale);\nconst expected = \"xx-unregistered\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (prefs.migrate({locale:\"pt-BR\"}).locale);\nconst expected = \"pt-BR\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "O serviço guarda uma string, enquanto o provider resolve apenas locales suportados; apresentação não deve reescrever dados canônicos."
        },
        {
          "kind": "quebraria",
          "md": "Traduzir headings canônicos de um protocolo sem atualizar o parser pode quebrar round-trip mesmo com a UI visualmente correta."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/i18n/I18nProvider.tsx",
          "symbol": "I18nProvider",
          "lines": [
            25,
            25
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Idioma e dados canônicos\"><title>Idioma e dados canônicos</title><desc>String em prefs não cria um dicionário; tradução não reescreve ids e datas canônicas.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Locale salvo</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Lista suportada</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Dicionário</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Texto e lang</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Idioma e dados canônicos: String em prefs não cria um dicionário; tradução não reescreve ids e datas canônicas. Fonte: ../olympus/src/lib/i18n/I18nProvider.tsx"
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/i18n/I18nProvider.tsx",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### emptyPrefs — ../olympus/src/lib/prefs/types.ts\n\nAssinatura observada: `export function emptyPrefs(): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: O serviço guarda uma string, enquanto o provider resolve apenas locales suportados; apresentação não deve reescrever dados canônicos. Contraprova ou limite a preservar: Traduzir headings canônicos de um protocolo sem atualizar o parser pode quebrar round-trip mesmo com a UI visualmente correta.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
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
          "md": "### setLocale — ../olympus/src/lib/prefs/service.ts\n\nAssinatura observada: `export function setLocale(prefs: SuitePrefs, locale: string): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: O serviço guarda uma string, enquanto o provider resolve apenas locales suportados; apresentação não deve reescrever dados canônicos. Contraprova ou limite a preservar: Traduzir headings canônicos de um protocolo sem atualizar o parser pode quebrar round-trip mesmo com a UI visualmente correta.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/service.ts",
          "symbol": "setLocale",
          "lines": [
            13,
            13
          ]
        },
        {
          "kind": "prose",
          "md": "### migrate — ../olympus/src/lib/prefs/types.ts\n\nAssinatura observada: `export function migrate(raw: unknown): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: O serviço guarda uma string, enquanto o provider resolve apenas locales suportados; apresentação não deve reescrever dados canônicos. Contraprova ou limite a preservar: Traduzir headings canônicos de um protocolo sem atualizar o parser pode quebrar round-trip mesmo com a UI visualmente correta.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/types.ts",
          "symbol": "migrate",
          "lines": [
            113,
            113
          ]
        }
      ]
    },
    {
      "title": "Registro de capacidades e habilitação",
      "order": 1,
      "blocks": [
        {
          "kind": "prose",
          "md": "Um registro de capacidades permite que o hub pergunte quem oferece um recurso em vez de espalhar nomes fixos por toda a interface. A extensão declara identidade, tipo, descrição, cor, endereço, capacidades, status, origem e se é built-in. Os irmãos são convertidos em manifests a partir de SUITE_APPS; recursos do próprio hub aparecem em outra lista. Essa composição representa um vocabulário comum para painel, documentos, contexto de conversa e notificações. Ela não significa que exista um mercado de extensões externas ou um mecanismo geral de instalação de código não confiável.\n\nallExtensions reúne manifests dos aplicativos e capacidades internas. isEnabled consulta uma escolha explícita em prefs.extensions.enabled e usa true quando não há entrada. enabledExtensions filtra o catálogo por essa regra; providersOf então seleciona quem oferece a capacidade solicitada. O algoritmo é simples, mas a precedência importa: ausência de preferência significa usar o default habilitado, enquanto false precisa ser respeitado como escolha deliberada. Um teste baseado apenas em truthiness confundiria false e ausência e poderia reativar um recurso que a pessoa desabilitou.\n\nOs exemplos executam setExtensionEnabled do serviço real. Um grava oracle false no documento inicial. O outro acrescenta desktop-panels true preservando oracle false. Esses resultados comprovam a composição da configuração com expectativas literais, sem carregar uma extensão ou executar código de terceiros. Eles não demonstram que cada consumidor da aplicação respeita essa preferência. Para isso é necessário acompanhar onde enabledExtensions e providersOf são usados e onde algum componente ainda percorre SUITE_APPS diretamente. Um catálogo expressivo pode coexistir com superfícies que continuam hardcoded ou não aderiram ao filtro.\n\nEssa diferença entre ponte existente e adoção integral deve permanecer explícita. Os comentários descrevem a ambição de perguntar por capacidades em todas as superfícies. O índice documental e outras áreas ainda possuem caminhos específicos por aplicativo. Não é correto inferir que desabilitar um manifest bloqueia todo acesso aos seus dados só porque o tipo permite representar a escolha. Habilitação de UI também não é autorização de backend. Um recurso invisível pode continuar acessível por rota, e uma key remota continua exigindo sua própria política de acesso independentemente do toggle de apresentação.\n\nBuilt-in possui outra semântica: pode ser desabilitado conforme a interface, mas não removido como um pacote instalado. Status live ou available é uma declaração do catálogo, não uma checagem de saúde. URL nula pode ser coerente para uma função interna. Uma mudança futura precisa decidir o que pode ser configurado, removido e executado, especialmente se o domínio passar a aceitar manifests externos. Validar shape não torna seguro carregar código arbitrário. A arquitetura observada registra metadados conhecidos do produto, e a apostila não amplia isso para um sistema de plugins que não foi implementado.\n\nAo acrescentar uma capacidade, localize quem a descobre, como ela entra na UI e qual contrato fornece seus dados. Um novo valor na união Capability não produz automaticamente um componente nem uma política de permissão. Registre também o comportamento quando nenhum provedor está habilitado e quando uma preferência antiga menciona um id removido. A migração pode conservar escolhas sem consumidor, mas a interface deve saber apresentá-las ou ignorá-las conscientemente. Esses casos ajudam a impedir que o registro vire apenas outra tabela de nomes divergente das superfícies que pretendia organizar.\n\nA validação completa combina serviço de preferência, seleção de manifests e uso real da capacidade. Os programas publicados cobrem a primeira parte; a leitura do código descreve as demais fronteiras sem fingir execução de instalação ou isolamento de terceiros. Essa precisão permite evoluir o hub com um ponto claro de descoberta, sem atribuir a ele autoridade que continua no domínio proprietário. O leitor consegue distinguir um recurso registrado, uma escolha habilitada, uma superfície que consome essa escolha e um serviço que efetivamente funciona, em vez de chamar todas essas condições de extensão disponível."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.setExtensionEnabled(prefs.emptyPrefs(),\"oracle\",false).extensions.enabled);\nconst expected = {\"oracle\":false};\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.setExtensionEnabled({meta:{version:2},extensions:{enabled:{oracle:false}}},\"desktop-panels\",true).extensions.enabled);\nconst expected = {\"oracle\":false,\"desktop-panels\":true};\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Ausência usa o default habilitado e false é uma escolha explícita; salvar preferência não comprova adoção de todos os consumidores."
        },
        {
          "kind": "quebraria",
          "md": "Filtrar por truthiness em vez de distinguir undefined pode reativar uma extensão explicitamente desabilitada."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/extensions/registry.ts",
          "symbol": "providersOf",
          "lines": [
            110,
            110
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Descoberta de capacidades\"><title>Descoberta de capacidades</title><desc>Habilitação não é autorização; percursos hardcoded podem não aderir ao filtro.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Catálogo</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Escolha explícita</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Filtrar capacidade</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Consumidor aderente</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Descoberta de capacidades: Habilitação não é autorização; percursos hardcoded podem não aderir ao filtro. Fonte: ../olympus/src/lib/extensions/registry.ts"
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/extensions/registry.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### emptyPrefs — ../olympus/src/lib/prefs/types.ts\n\nAssinatura observada: `export function emptyPrefs(): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Ausência usa o default habilitado e false é uma escolha explícita; salvar preferência não comprova adoção de todos os consumidores. Contraprova ou limite a preservar: Filtrar por truthiness em vez de distinguir undefined pode reativar uma extensão explicitamente desabilitada.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
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
          "md": "### setExtensionEnabled — ../olympus/src/lib/prefs/service.ts\n\nAssinatura observada: `export function setExtensionEnabled(prefs: SuitePrefs, id: string, enabled: boolean): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Ausência usa o default habilitado e false é uma escolha explícita; salvar preferência não comprova adoção de todos os consumidores. Contraprova ou limite a preservar: Filtrar por truthiness em vez de distinguir undefined pode reativar uma extensão explicitamente desabilitada.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/service.ts",
          "symbol": "setExtensionEnabled",
          "lines": [
            69,
            69
          ]
        }
      ]
    },
    {
      "title": "O índice documental e os deep links",
      "order": 2,
      "blocks": [
        {
          "kind": "prose",
          "md": "O índice documental muda a pergunta de qual aplicativo abrir para qual objeto de trabalho continuar. No Olympus, SuiteDoc possui id, app, kind, título, detalhe, data, href e cor. Um projeto do Kairos, uma fonte do Chiron, uma carteira ou meta do Pluto e um cronograma podem aparecer na mesma coleção. O objetivo é reunir descoberta e recência, sem absorver o domínio inteiro de cada irmão. A propriedade do documento continua no aplicativo que o cria e interpreta; o hub oferece uma projeção e um caminho de navegação para esse proprietário.\n\nbuildDocIndex reúne funções específicas de cada domínio. Elas leem os espelhos do hub, chamam os parsers ou extratores e produzem documentos com identidade qualificada por aplicativo. O prefixo evita colisão quando dois irmãos usam o mesmo id local. O título e o detalhe não são campos universais: um projeto apresenta quantidade de tarefas abertas, enquanto uma fonte apresenta cards. Essa tradução deve conservar significado, não apenas gerar uma string que caiba no cartão. Um dado ausente ou um formato antigo pode produzir zero ou lista vazia sem demonstrar que o usuário não possui trabalho naquele domínio.\n\nOs exemplos executam dois extratores reais com fixtures pequenas. kairosProjects conta uma tarefa do projeto e identifica uma aberta; chironDocs associa cards à fonte correspondente. As expectativas literais mostram como o detalhe do documento nasce de relações por id. Eles não leem espelhos reais nem abrem uma rota. O teste de extração fica separado da integração documental completa, o que permite localizar erros de contagem sem usar um navegador falso ou afirmar que um link funciona apenas porque a string foi construída corretamente no objeto retornado.\n\nRecência também possui regras específicas. sortByRecency copia o array, ordena documentos datados em ordem decrescente e deixa os sem data no fim, usando título para empates sem data. Os extratores escolhem qual timestamp representa a atividade: podem considerar uma tarefa atualizada, uma contribuição ou um campo do documento. Essas escolhas afetam o que aparece como recente. Um novo parser não deve inventar a data atual para tudo, pois isso faria objetos antigos ocuparem sempre o topo. Ausência honesta de timestamp é mais útil que uma recência fictícia produzida para preencher a interface.\n\nO deep link precisa ser confrontado com o roteador do proprietário. No código observado, a lista de Chiron constrói um endereço /library com parâmetro source, enquanto o aplicativo em trabalho possui navegação própria de apostila. Uma URL sintaticamente válida pode não selecionar o documento pretendido ou sequer corresponder à rota atual. A apostila registra essa possível deriva e não navega nem modifica outros aplicativos para escondê-la. O contrato de integração precisa declarar caminho, parâmetros, identidade e comportamento de fallback, especialmente quando o destino exige uma sessão independente naquela origem.\n\nBusca e filtro trabalham sobre a projeção, não sobre todo o documento remoto. filterDocs normaliza a query e compara título e meta, além de filtrar por aplicativo. Isso não é busca integral dentro de capítulos, transações ou mensagens. Uma caixa de pesquisa com aparência global pode levar a uma expectativa maior que o algoritmo oferece. O texto da UI deve refletir o alcance real. Uma extensão para busca de conteúdo precisaria revisar carregamento, tamanho, privacidade e indexação, em vez de apenas acrescentar mais uma condição ao filtro de títulos sem considerar o volume de dados.\n\nAo estender o índice, defina a identidade estável, o tipo documental, a data significativa e o destino confirmado no irmão. Teste objetos sem data, ids repetidos entre aplicativos, documento arquivado e consulta sem resultado. Depois observe o deep link no ambiente adequado quando a afirmação final for de navegação funcional. Os programas publicados cobrem relações locais de extração, e a análise aponta as fronteiras ainda dependentes de integração. Assim, o índice pode crescer mantendo a ideia de documentos como unidade de trabalho, sem prometer edição universal, busca completa ou navegação verificada que o código e os exemplos não sustentam."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst kairos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/kairos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (kairos.kairosProjects({projects:[{id:\"p\",name:\"Projeto\"}],tasks:[{projectId:\"p\",status:\"todo\"}]}).map(p=>[p.id,p.count,p.open]));\nconst expected = [[\"p\",1,1]];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst chiron = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chiron.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chiron.chironDocs({sources:[{id:\"s\",name:\"Livro\"}],cards:[{sourceId:\"s\"},{sourceId:\"x\"}]}).map(s=>[s.title,s.cards]));\nconst expected = [[\"Livro\",1]];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "O índice reúne projeções documentais qualificadas por aplicativo; extrair metadados e navegar ao destino são contratos distintos."
        },
        {
          "kind": "quebraria",
          "md": "Um href bem formado para uma rota antiga pode impedir abrir a fonte correta mesmo quando título e contagem estão certos."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/docs/index.ts",
          "symbol": "buildDocIndex",
          "lines": [
            130,
            130
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Documentos unificados\"><title>Documentos unificados</title><desc>Metadados são projeções; href precisa coincidir com roteador do proprietário.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Espelhos</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Extratores</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">SuiteDoc</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Deep link</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Documentos unificados: Metadados são projeções; href precisa coincidir com roteador do proprietário. Fonte: ../olympus/src/lib/docs/index.ts"
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/docs/index.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### kairosProjects — ../olympus/src/lib/panels/kairos.ts\n\nAssinatura observada: `export function kairosProjects(raw: Record<string, unknown> | null)`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: O índice reúne projeções documentais qualificadas por aplicativo; extrair metadados e navegar ao destino são contratos distintos. Contraprova ou limite a preservar: Um href bem formado para uma rota antiga pode impedir abrir a fonte correta mesmo quando título e contagem estão certos.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/kairos.ts",
          "symbol": "kairosProjects",
          "lines": [
            69,
            69
          ]
        },
        {
          "kind": "prose",
          "md": "### chironDocs — ../olympus/src/lib/panels/chiron.ts\n\nAssinatura observada: `export function chironDocs(raw: Record<string, unknown> | null)`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: O índice reúne projeções documentais qualificadas por aplicativo; extrair metadados e navegar ao destino são contratos distintos. Contraprova ou limite a preservar: Um href bem formado para uma rota antiga pode impedir abrir a fonte correta mesmo quando título e contagem estão certos.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/chiron.ts",
          "symbol": "chironDocs",
          "lines": [
            54,
            54
          ]
        }
      ]
    },
    {
      "title": "Preferências locais da máquina e janelas destacadas",
      "order": 3,
      "blocks": [
        {
          "kind": "prose",
          "md": "Nem toda preferência deve acompanhar a conta. Um painel sempre acima das demais janelas pode ser útil num computador e inconveniente ou impossível num telefone. O módulo desktop/prefs separa essa escolha de suite-prefs e usa olympus.desktop.v1. defaultDesktopPrefs começa com alwaysOnTop false. Essa decisão conserva controle local sobre o comportamento da máquina e evita que uma escolha de janela feita num contexto apareça automaticamente em outro dispositivo que não pode ou não deve honrá-la. A separação é uma decisão de produto, não apenas outro nome de chave.\n\nOs exemplos chamam o default real e a leitura no ambiente Node sem armazenamento de navegador disponível. Ambos retornam false para alwaysOnTop, sendo que o segundo alcança a recuperação de readDesktopPrefs quando a fronteira local não existe. Não há um localStorage simulado nem uma janela criada. A prova é limitada ao retorno do módulo naquele ambiente e ao default declarado. Ela não demonstra persistência entre reinícios do desktop, aplicação do pinning pelo sistema operacional ou reação de uma janela existente quando o usuário altera a opção depois de abri-la.\n\nO destaque de painéis possui dois caminhos. No navegador, detachPanel usa window.open para uma rota da mesma origem, com dimensões associadas ao painel. No shell desktop, delega a abertura de um widget pelo adaptador específico, passando tamanho e preferência de pinning. Esses caminhos não oferecem as mesmas capacidades. Uma janela de navegador não ganha controle universal de sempre no topo por usar uma rota sem chrome. O scaffold Tauri e a existência de uma chamada tipada também não provam que o binário foi compilado e executado naquele sistema; o backlog registra essa limitação histórica.\n\nA mesma origem permite compartilhar alguns espelhos e preferências entre a janela principal e a destacada, mas os documentos possuem estados de UI separados. ThemeProvider observa storage para acompanhar certas mudanças. O espelho dos dados dos irmãos precisa de uma política própria de atualização no painel separado. Não basta abrir a URL e supor que todo evento emitido na janela principal chega à outra. Eventos DOM locais e eventos de armazenamento possuem comportamentos diferentes. A implementação precisa escolher como o consumidor descobre mudanças e o que faz quando o host ou a sessão deixa de existir.\n\nO mapa openWindows permite reutilizar referências de janelas no caminho web, mas fechamento, bloqueio de popup e foco continuam sendo condições reais de uso. O retorno de uma função que iniciou uma promessa de abertura no shell não equivale necessariamente a confirmação de uma janela visível. A interface deve poder informar falha de suporte ou bloqueio quando a operação não acontece. Esses estados não são observados pelos dois exemplos de preferências. A seção os identifica para que uma extensão não use o valor true de uma tentativa como certificado de integração com o desktop.\n\nAo acrescentar uma preferência de máquina, pergunte se ela descreve o usuário ou o dispositivo. Tema pode ter uma política compartilhada; geometria, pinning e capacidade do shell frequentemente exigem contexto local. Decida versão, leitura tolerante e efeito sobre janelas já abertas. Uma migração que transporte tudo para a nuvem pode reintroduzir exatamente o acoplamento que o módulo evitava. O dado também precisa ser validado conforme seus consumidores: spreads de JSON não tornam um valor arbitrário adequado a uma API de janela nativa só porque o tipo esperado é booleano.\n\nA validação completa requer o ambiente que oferece a capacidade. Browser, PWA instalado e shell nativo devem ser relatados separadamente, com observação de abertura, foco, fechamento e persistência. Não é necessário instalar o toolchain desktop apenas para a apostila parecer aprovada. Esta fonte executa os exemplos locais declarados e conserva os limites do scaffold e da plataforma. Isso permite entender o destaque de painéis como uma cadeia de preferências, suporte e efeito observável, em vez de confundir uma rota válida ou um default correto com uma experiência desktop integralmente verificada."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst desktop = await import(pathToFileURL(resolve(\"../olympus/src/lib/desktop/prefs.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (desktop.defaultDesktopPrefs().alwaysOnTop);\nconst expected = false;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst desktop = await import(pathToFileURL(resolve(\"../olympus/src/lib/desktop/prefs.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (desktop.readDesktopPrefs().alwaysOnTop);\nconst expected = false;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Pinning descreve a máquina, não a conta; separar desktop prefs evita propagar uma opção inadequada para outro dispositivo."
        },
        {
          "kind": "quebraria",
          "md": "Prometer always-on-top no navegador apenas porque existe window.open confunde capacidades diferentes de web e shell nativo."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/desktop/prefs.ts",
          "symbol": "defaultDesktopPrefs",
          "lines": [
            16,
            16
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Janela destacada\"><title>Janela destacada</title><desc>Tentativa de abertura não certifica janela visível; pinning depende da capacidade do shell.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">PanelId</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Browser ou shell</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Abrir rota</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Preferências locais</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Janela destacada: Tentativa de abertura não certifica janela visível; pinning depende da capacidade do shell. Fonte: ../olympus/src/lib/desktop/detach.ts"
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/desktop/detach.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### defaultDesktopPrefs — ../olympus/src/lib/desktop/prefs.ts\n\nAssinatura observada: `export function defaultDesktopPrefs(): DesktopPrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Pinning descreve a máquina, não a conta; separar desktop prefs evita propagar uma opção inadequada para outro dispositivo. Contraprova ou limite a preservar: Prometer always-on-top no navegador apenas porque existe window.open confunde capacidades diferentes de web e shell nativo.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/desktop/prefs.ts",
          "symbol": "defaultDesktopPrefs",
          "lines": [
            16,
            16
          ]
        },
        {
          "kind": "prose",
          "md": "### readDesktopPrefs — ../olympus/src/lib/desktop/prefs.ts\n\nAssinatura observada: `export function readDesktopPrefs(): DesktopPrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Pinning descreve a máquina, não a conta; separar desktop prefs evita propagar uma opção inadequada para outro dispositivo. Contraprova ou limite a preservar: Prometer always-on-top no navegador apenas porque existe window.open confunde capacidades diferentes de web e shell nativo.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/desktop/prefs.ts",
          "symbol": "readDesktopPrefs",
          "lines": [
            22,
            22
          ]
        }
      ]
    }
  ]
};
