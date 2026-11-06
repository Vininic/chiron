import type { ContentChapter } from "./types";
export const OLYMPUS_CHAPTER_8: ContentChapter = {
  "title": "Entrega, offline e operação",
  "level": "avancado",
  "nodeTitle": "Entrega, offline e operação",
  "nodeKind": "concept",
  "sections": [
    {
      "title": "PWA, chunks e estado de atualização",
      "order": 0,
      "blocks": [
        {
          "kind": "prose",
          "md": "Um aplicativo local-first precisa distinguir dados locais, código cacheado e versão da página em execução. A PWA cuida de parte da distribuição do código, mas não transforma qualquer dado remoto em conteúdo disponível offline. No Olympus, vite.config.ts configura VitePWA com registro autoUpdate, manifest e identidade do aplicativo. O bundle é organizado em chunks, incluindo bibliotecas visuais. Essa configuração descreve a intenção de build e atualização; o comportamento efetivo depende do service worker emitido, dos arquivos precacheados e do ciclo de vida de cada cliente já aberto.\n\nOs dois exemplos desta seção inspecionam a configuração local e uma limitação registrada no backlog. Confirmam autoUpdate e a observação histórica de ícones baseados em um único SVG. Não compilam o aplicativo irmão, não instalam uma PWA e não testam atualização entre duas versões publicadas. O estado dos ícones no build atual precisa ser confrontado com o manifest e com as plataformas de instalação relevantes. A inspeção evita omitir a decisão, mas não deve receber uma legenda de prova de instalação ou de suporte universal a todos os tamanhos e modos de ícone.\n\nAutoUpdate também não elimina a pergunta sobre documentos já abertos. O service worker pode obter novos recursos enquanto uma aba continua executando código anterior. Uma mudança de schema ou de nomes de eventos precisa considerar essa coexistência. O fato de a aplicação funcionar após um reload limpo não demonstra que uma sessão longa atravessa a atualização sem perder trabalho. Uma revisão de entrega deve observar quando o código novo passa a controlar o cliente, se há mensagem ao usuário e como o estado persistido continua legível para leitores antigos e novos durante a transição.\n\nChunks favorecem separação de dependências e podem reduzir trabalho inicial, mas seu nome não garante carregamento tardio. Um import estático no seed ou numa entrada pode tornar o recurso parte da jornada inicial mesmo quando está em outro arquivo. O tamanho de um chunk também precisa ser comparado com o limite de precache configurado naquele aplicativo, sem copiar o teto de outro projeto. No Chiron, por exemplo, o corpus de livros possui um limite explícito e evidência de arquivos no service worker. Essa prova local não se transfere automaticamente ao build do Olympus apenas porque ambos usam Vite.\n\nOffline exige considerar o que os painéis realmente consomem. O código pode estar cacheado e os espelhos dos irmãos ainda estarem vazios. Uma sessão guest não enxerga o localStorage de outro domínio. Portanto, instalar o hub não permite consultar magicamente dados locais dos cinco aplicativos sem uma ponte ou cópia autorizada. O estado vazio deve explicar essa fronteira, em vez de parecer uma falha de carregamento infinita. O plano original prometia um desk de demonstração, enquanto o backlog descreve um hub guest vazio naquele marco; a documentação conserva a diferença entre intenção e implementação.\n\nAo alterar o precache, avalie entrada, recursos estáticos, chunks reais e política de retenção. Aumentar o teto para ocultar um arquivo excessivo não resolve custo de download, memória ou crescimento do índice. Apagar assets antigos indiscriminadamente também pode prejudicar clientes que ainda executam uma versão anterior. Uma estratégia de build deve ser revista conforme o host e o mecanismo de limpeza, sem transformar a autoria de conteúdo numa remoção de artefatos alheios. A prova útil identifica exatamente quais arquivos foram emitidos e quais o service worker atual referencia.\n\nA verificação completa combina build aplicável, inspeção do manifest e do service worker, e ensaio de instalação ou atualização quando essa é a afirmação desejada. Estes programas só executam a leitura de fonte declarada. A apostila não instala infraestrutura nem publica outra versão para fabricar evidência. Essa separação torna o capítulo útil para modificar offline com conhecimento: o leitor sabe onde termina a configuração local, onde começa o artefato emitido e quais estados do cliente real ainda precisam ser observados antes de chamar a entrega de PWA integralmente aprovada."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus/vite.config.ts\").includes(\"autoUpdate\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus-plan/BACKLOG.md\").includes(\"single SVG with no raster sizes\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Código precacheado, dados espelhados e versão do cliente são estados distintos; autoUpdate não elimina migração ou teste de atualização."
        },
        {
          "kind": "quebraria",
          "md": "Um hub instalado pode abrir offline e continuar sem dados dos irmãos, porque seus espelhos não foram carregados nessa origem."
        },
        {
          "kind": "cite",
          "file": "../olympus/vite.config.ts",
          "symbol": "VitePWA",
          "lines": [
            3,
            3
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Entrega PWA\"><title>Entrega PWA</title><desc>Configuração, artefato e cliente são evidências distintas; cache de código não é sync de dados.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Fonte/config</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Build</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Precache</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Cliente em execução</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Entrega PWA: Configuração, artefato e cliente são evidências distintas; cache de código não é sync de dados. Fonte: ../olympus/vite.config.ts"
        },
        {
          "kind": "cite",
          "file": "../olympus/vite.config.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        }
      ]
    },
    {
      "title": "SPA, origem e configuração de deploy",
      "order": 1,
      "blocks": [
        {
          "kind": "prose",
          "md": "Rotas de uma SPA existem em dois níveis. O navegador pode navegar internamente para uma página sem pedir um HTML novo ao servidor, enquanto um acesso direto à mesma URL exige que o host entregue a entrada correta. vercel.json do Olympus declara um rewrite de qualquer caminho para index.html. A regra dá suporte ao roteador cliente, mas não cria os componentes de rota nem garante que parâmetros antigos continuem reconhecidos. Um deep link pode alcançar o HTML certo e ainda selecionar um destino inexistente dentro da aplicação.\n\nO primeiro exemplo interpreta o JSON real e exige a regra observada. O segundo inspeciona a especificação v2 para localizar a decisão de window.open no destaque de painéis. São leituras locais, sem navegação ou deploy. Não comprovam DNS, headers aplicados, versão de produção ou suporte de popup em um navegador. Essa delimitação é necessária porque um arquivo de configuração correto no checkout pode coexistir com projeto não vinculado, variável ausente ou release antigo no host. O ensaio de entrega precisa identificar qual ambiente recebeu qual artefato, não apenas qual configuração está no disco.\n\nOrigem influencia tanto sessão quanto dados. Publicar o hub em outro domínio muda o armazenamento disponível ao cliente, ainda que os arquivos sejam iguais. Uma sessão local antiga não acompanha automaticamente essa troca. O backend compartilhado pode permitir recuperar dados de conta quando o cliente e a identidade estão configurados, mas guest permanece na origem anterior sem um fluxo de exportação ou migração. Alterar domínio, base path ou ambiente de preview deve considerar essa consequência. Um redirecionamento de navegação não transfere o localStorage que sustentava a experiência local-first do usuário.\n\nA arquitetura também recomenda configurações de CSP e outros cuidados por meio de referências a projetos irmãos. O vercel.json observado do hub precisa ser lido pelo conteúdo real; uma frase dizendo para copiar headers não comprova que eles foram copiados. Nem um header presente em arquivo comprova que o host em produção o aplica. A documentação não deve ampliar o alcance de uma inspeção de rewrite para uma auditoria de política de conteúdo. Cada afirmação precisa de seu objeto e método, especialmente quando recursos de IA, fontes remotas ou janelas destacadas dependem dessas políticas.\n\nPainéis separados acrescentam requisitos de rota. /panel/:id precisa resolver sem a moldura principal e reconhecer o identificador do catálogo. Reutilizar a mesma origem permite compartilhar certos espelhos, mas a janela nova ainda precisa inicializar providers e descobrir mudanças. No shell nativo, o mesmo caminho pode ser aberto por outra API. O contrato de deploy deve garantir que a entrada é servida para ambos os percursos suportados. O fato de window.open aceitar uma string não demonstra que a janela recebeu a versão certa da aplicação nem que o estado dentro dela ficou utilizável.\n\nAo estender a entrega, registre variáveis necessárias sem copiar valores de segredo para documentação ou logs. Diferencie configuração pública do cliente, segredo do servidor e identidade de conta. O proxy depende de sua própria implantação e allowlist de origem; o host da SPA depende de roteamento e recursos estáticos. Misturar essas etapas numa única ação chamada publicar esconde qual delas falhou. Uma página que abre corretamente pode continuar sem geração hosted ou sem sincronização, e uma função publicada pode responder a um cliente que ainda usa um protocolo antigo.\n\nA conclusão operacional exige observar a aplicação no ambiente autorizado, com deep link direto, reload, recursos estáticos e caminho de erro. Esta autoria não faz esse deploy nem altera domínios de outros projetos. Ela oferece o mapa para verificar a entrega sem confundir configuração local, build emitido e serviço publicado. Os programas permanecem no escopo nativo de inspeção de fonte, enquanto as limitações remotas são relatadas como tal. Esse método permite modificar a SPA e suas rotas com conhecimento das fronteiras, preservando dados locais e expectativas de navegação em vez de anunciar uma publicação apenas porque o JSON possui a regra esperada."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (JSON.parse(source(\"../olympus/vercel.json\")).rewrites.map(r=>[r.source,r.destination]));\nconst expected = [[\"/(.*)\",\"/index.html\"]];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus-plan/OLYMPUS-V2.md\").includes(\"window.open\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Rewrite entrega a entrada da SPA; o roteador e a identidade da origem ainda determinam o destino e os dados disponíveis."
        },
        {
          "kind": "quebraria",
          "md": "Mudar domínio sem política de migração deixa dados guest na origem antiga mesmo quando a nova página abre corretamente."
        },
        {
          "kind": "cite",
          "file": "../olympus/vercel.json",
          "symbol": "rewrites",
          "lines": [
            3,
            3
          ]
        }
      ]
    },
    {
      "title": "Checklist de irmão novo e revisão de drift",
      "order": 2,
      "blocks": [
        {
          "kind": "prose",
          "md": "O checklist de um irmão novo serve para transformar convenções compartilhadas em perguntas verificáveis. Ele precisa cobrir identidade, dados, sessão, sincronização, IA, navegação, apresentação e entrega. A arquitetura fornece uma receita; o shell indica propriedade dos controles; o checklist histórico registra defeitos encontrados quando as cópias divergiram. O objetivo não é marcar presença de arquivos com nomes conhecidos, mas confirmar que escrita e leitura usam o mesmo contrato e que o resultado aparece na jornada pretendida. Uma cópia pode compilar e ainda guardar configuração no namespace que nenhum consumidor observa.\n\nO registro de backend e layout descreve justamente esse tipo de falha na configuração de IA do Chiron em uma etapa anterior. A tela salvava uma escolha em chaves diferentes das lidas pelo assistente. Também documenta divergências de cores, status e superfícies de configuração. Esses exemplos mostram por que uma revisão entre aplicativos deve comparar comportamento e consumidores, não apenas nomes de componentes. Um comentário dizendo que o módulo ainda não existe pode permanecer depois de o código ter sido incorporado; usar o comentário como verdade impede encontrar o caminho funcional que já está presente.\n\nOs programas desta seção inspecionam duas regras locais: a presença da orientação de núcleo puro no README e a proibição histórica de duplicar controles equivalentes no shell. Não provam que todos os irmãos seguem as regras. Eles tornam a origem normativa rastreável, enquanto a revisão de drift precisa olhar cada implementação pertinente. Uma lista de arquivos pode ajudar a não esquecer um consumidor, mas não substitui ler sua responsabilidade. O exemplo não usa uma instalação nova nem cria projetos irmãos para simular adesão ao padrão; observa as fontes existentes e limita sua conclusão.\n\nDrift pode ser intencional. O Oráculo é de leitura, enquanto outros assistentes propõem mudanças. O hub possui preferências estruturadas de aparência e janelas destacadas que um irmão pode não oferecer. Um checklist útil registra a exceção e sua razão, em vez de obrigar todos os aplicativos a possuir a mesma união de ações ou o mesmo número de páginas. O contrato comum deve ficar suficientemente claro para evitar defeitos repetidos, mas não apagar invariantes de domínio. A família compartilha linguagem e infraestrutura, não uma identidade funcional indistinta.\n\nA ausência de um pacote compartilhado também é uma decisão importante do backlog. As cópias continuam independentes, e extrair uma biblioteca mudaria o fluxo de desenvolvimento e entrega dos repositórios. Essa mudança não deve ser inserida silenciosamente durante a documentação como se fosse uma correção trivial. O caminho atual exige inventário de cópias, revisão direcionada e testes apropriados quando uma melhoria comum é propagada. Uma alteração no shell de um aplicativo não conclui automaticamente a tarefa nos demais, mesmo quando a interface final parece idêntica em uma captura de tela.\n\nAo adicionar um irmão, defina sua key remota, namespace local, formato inicial, migrador, projeção para o hub e vocabulário de IA. Verifique que o guest continua utilizável e que conta compartilhada não é tratada como armazenamento compartilhado entre origens. Registre a capacidade real do aplicativo no catálogo e confira o deep link no roteador proprietário. Só depois trate publicação, allowlist de origem e ensaio com dados reais como etapas específicas. A ordem evita corrigir uma tela vazia por meio de defaults artificiais que escondem uma incompatibilidade de key ou formato.\n\nUma revisão de drift está pronta quando cada diferença relevante tem classificação: acordo seguido, exceção consciente, defeito observado ou pendência de validação. Os documentos históricos devem conservar seu marco, enquanto o registro atual explica a evidência nova. Esta apostila aplica esse método às fontes locais sem reabrir todos os produtos nem alterar sua implementação. O leitor consegue usar o checklist para trabalhar com conhecimento, reconhecendo que compilar, testar funções puras e ler configuração são provas úteis, mas diferentes de confirmar uso entre contas, publicação ou paridade de interface em todos os contextos suportados."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus-plan/README.md\").includes(\"Pure domain core\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus-plan/SUITE-SHELL.md\").includes(\"Never put a control here that also exists in the sidebar\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Checklist verifica relações entre consumidores, não só presença de arquivos; exceções de domínio podem ser intencionais."
        },
        {
          "kind": "quebraria",
          "md": "Copiar um painel de configuração sem alinhar o namespace do leitor permite salvar uma opção que não muda o comportamento real."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/CHECKLIST-BACKEND-LAYOUT.md",
          "symbol": "Backend",
          "lines": [
            1,
            1
          ]
        }
      ]
    },
    {
      "title": "Como estender o comum com prova limitada",
      "order": 3,
      "blocks": [
        {
          "kind": "prose",
          "md": "Estender o comum exige preservar uma fronteira que várias aplicações consomem em ritmos diferentes. Um novo campo de preferência, uma capacidade de extensão ou um formato de notificação pode parecer pequeno no serviço puro, mas atravessa migração, armazenamento, sincronização, UI e documentação. O primeiro passo é nomear o contrato alterado e seus leitores. Depois é preciso decidir compatibilidade, defaults e erro. Essa disciplina evita que um teste verde de objeto seja apresentado como prova de uma funcionalidade distribuída que ainda depende de consumidores não modificados ou de um serviço não verificado.\n\nOs exemplos desta seção executam duas transformações reais. setNotifications atualiza quietHours.enabled preservando horários padrão. setSpeech altera rate e conserva os outros defaults de fala. As expectativas literais mostram como patches parciais são combinados no serviço. Não pedem permissão de notificação, não falam texto e não chamam APIs de desktop. Essa limitação é parte do ensinamento: o documento pode representar uma escolha sem que a plataforma ofereça capacidade, o usuário conceda permissão ou o componente aplique o efeito. O nome da preferência não equivale ao recurso funcionando.\n\nUma mudança compatível começa pelo dado. Se os leitores antigos ignoram um campo opcional, um default pode bastar; se o significado de um campo muda, talvez seja necessária uma migração e uma política de coexistência. O serviço deve manter as relações que já eram válidas. Em notificações, por exemplo, atualizar um aplicativo não deveria apagar a escolha dos outros. Em quiet hours, mudar enabled não deveria descartar from e to sem uma decisão explícita. Os casos locais podem demonstrar essas preservações, usando entradas sintéticas e comparações independentes sem substituir a implementação testada.\n\nDepois vem o consumidor. Uma UI que exibe a nova opção precisa ler o mesmo campo que a transformação escreve. O efeito deve distinguir valor salvo, capacidade disponível e permissão concedida. Uma função pode retornar false ou um erro enquanto a escolha continua habilitada no documento, e isso não precisa ser uma contradição: são estados diferentes. A interface deve explicá-los. Para certificar notificação ou fala real, é necessário observar o ambiente correspondente. Acrescentar um objeto com métodos que apenas retornam sucesso produziria uma simulação, não uma evidência do recurso da plataforma.\n\nA sincronização amplia a revisão. Uma preferência de conta pode viajar em suite-prefs; uma escolha da máquina pode continuar local. O payload deve conservar segredos fora da fronteira compartilhada. Um consumidor antigo pode receber um campo novo e ignorá-lo, enquanto um consumidor novo pode normalizar um documento antigo. Testes de migração e leitura precisam cobrir essa assimetria. A origem diferente entre aplicativos continua impedindo compartilhamento automático de localStorage. O contrato remoto só realiza a intenção quando seus leitores e escritores efetivamente o adotam com identidade e formato coerentes.\n\nA prova limitada deve ser relatada sem diminuir sua utilidade ou ampliar seu alcance. Uma execução nativa demonstra exatamente a transformação chamada. Uma inspeção de fonte demonstra a presença de uma condição no checkout. Um build demonstra que aquele artefato foi emitido pelo toolchain aplicado. Nenhum desses métodos sozinho demonstra autorização remota, uso real de uma notificação ou disponibilidade de um modelo. Registrar o método junto da conclusão permite combinar evidências depois, em vez de repetir toda a implementação ou usar a ausência de ambiente como motivo para inventar uma aprovação.\n\nAo concluir a extensão, atualize a origem normativa e o registro de andamento quando o escopo realmente terminou. Preserve pendências que exigem outro ambiente e mantenha uma reprodução simples dos programas publicados. Esta apostila reutiliza apenas a mecânica de autoria, com explicações próprias, e não instala infraestrutura para cobrir recursos que os exemplos não observam. O leitor recebe uma cadeia de decisões modificável: dado, serviço, consumidor, transporte e efeito. Essa cadeia permite ampliar o comum com conhecimento e manter as diferenças de domínio, sem transformar um contrato compartilhado em uma promessa indistinta de paridade ou de funcionamento integral em todas as plataformas."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.setNotifications(prefs.emptyPrefs(),{quietHours:{enabled:true}}).notifications.quietHours);\nconst expected = {\"enabled\":true,\"from\":\"22:00\",\"to\":\"07:00\"};\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.setSpeech(prefs.emptyPrefs(),{rate:2}).speech);\nconst expected = {\"voiceURI\":\"\",\"rate\":2,\"pitch\":1,\"autoSpeak\":false};\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Patches demonstram preservação do documento; capacidade e permissão da plataforma continuam sendo contratos de execução separados."
        },
        {
          "kind": "quebraria",
          "md": "Uma preferência habilitada pode coexistir com permissão recusada; mostrar sucesso sem observar o efeito confunde configuração e operação."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/SUITE-ARCHITECTURE.md",
          "symbol": "New sibling checklist",
          "lines": [
            287,
            287
          ]
        },
        {
          "kind": "prose",
          "md": "### emptyPrefs — ../olympus/src/lib/prefs/types.ts\n\nAssinatura observada: `export function emptyPrefs(): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Patches demonstram preservação do documento; capacidade e permissão da plataforma continuam sendo contratos de execução separados. Contraprova ou limite a preservar: Uma preferência habilitada pode coexistir com permissão recusada; mostrar sucesso sem observar o efeito confunde configuração e operação.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
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
          "md": "### setNotifications — ../olympus/src/lib/prefs/service.ts\n\nAssinatura observada: `export function setNotifications(prefs: SuitePrefs, patch: Partial<NotificationPrefs>): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Patches demonstram preservação do documento; capacidade e permissão da plataforma continuam sendo contratos de execução separados. Contraprova ou limite a preservar: Uma preferência habilitada pode coexistir com permissão recusada; mostrar sucesso sem observar o efeito confunde configuração e operação.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/service.ts",
          "symbol": "setNotifications",
          "lines": [
            52,
            52
          ]
        },
        {
          "kind": "prose",
          "md": "### setSpeech — ../olympus/src/lib/prefs/service.ts\n\nAssinatura observada: `export function setSpeech(prefs: SuitePrefs, patch: Partial<SpeechPrefs>): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Patches demonstram preservação do documento; capacidade e permissão da plataforma continuam sendo contratos de execução separados. Contraprova ou limite a preservar: Uma preferência habilitada pode coexistir com permissão recusada; mostrar sucesso sem observar o efeito confunde configuração e operação.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/service.ts",
          "symbol": "setSpeech",
          "lines": [
            65,
            65
          ]
        }
      ]
    }
  ]
};
