import type { ContentChapter } from "./types";
export const OLYMPUS_CHAPTER_2: ContentChapter = {
  "title": "Documentos no backend compartilhado",
  "level": "basico",
  "nodeTitle": "Documentos no backend compartilhado",
  "nodeKind": "concept",
  "sections": [
    {
      "title": "O par user_id e key como endereço de domínio",
      "order": 0,
      "blocks": [
        {
          "kind": "prose",
          "md": "O backend compartilhado começa com um endereço composto, não com um nome de aplicativo isolado. Na migração 0001_init.sql, user_data utiliza user_id e key como chave primária. O primeiro campo identifica o proprietário e o segundo identifica um documento desse proprietário. Dois usuários podem ter a mesma key sem compartilhar o conteúdo. Dois domínios do mesmo usuário precisam de chaves diferentes para evitar colisão. Essa estrutura permite que cada aplicativo evolua seu documento sem criar uma tabela nova para toda preferência ou entidade de interface.\n\nA política SQL associa a linha ao usuário autenticado por auth.uid() = user_id, tanto na visibilidade quanto na verificação de escrita declarada naquela migração. Essa é uma fonte concreta do contrato desejado. Um arquivo SQL presente no checkout, entretanto, não demonstra que a migração está aplicada e que a política ativa no serviço continua igual. A diferença precisa permanecer visível durante uma auditoria. O código cliente pode acrescentar filtros por proprietário e chave, mas esses filtros não substituem uma política remota contra uma requisição deliberadamente diferente.\n\nO registro do hub traduz domínio em chave: schedule para Chronos, kairos-board para Kairos, pluto-ledger para Pluto, hermes-outbox para Hermes e chiron-index para Chiron. O documento comum de preferências usa suite-prefs. Os exemplos executam o registro real e o módulo de preferências para observar esses nomes literais. Não consultam user_data. Um teste desses detecta deriva no catálogo e ajuda a localizar o leitor, mas não prova que o escritor usa o mesmo nome ou que existe uma linha correspondente na conta atual.\n\nEssa última condição é especialmente importante no estado observado. O store do Chiron escreve um agregado em chiron-data, enquanto o registro do Olympus continua apontando chiron-index. A arquitetura planejada descreve índice separado de bibliotecas, mas a implementação local de persistência não segue integralmente essa divisão. Assim, cadastrar Chiron no hub não demonstra que seu painel recebe o acervo atual. A apostila registra a divergência em vez de inventar uma linha ou modificar o aplicativo durante a documentação. Resolver o contrato exige decidir formato, migração e leitores afetados.\n\nO endereço composto também organiza diagnóstico. Se o painel está vazio, compare a key do escritor, a key do sincronizador e o formato consumido pelo parser. Em seguida, verifique a identidade utilizada na sessão remota e a existência da linha permitida. Um nome de usuário igual na interface não comprova que o mesmo user_id foi usado nas duas origens. Uma busca sem contexto pode misturar ausência de documento, erro de autorização e falha de transporte. Cada causa pede uma observação própria e uma mensagem que não apresente todos esses resultados como dados vazios.\n\nAo introduzir um documento novo, escolha um namespace estável e registre seu proprietário. Defina quem pode escrevê-lo e quem apenas produz projeções de leitura. Se outra aplicação precisa solicitar uma mudança, prefira um contrato explícito de ponte ou ação, em vez de um escritor adicional que desconhece as invariantes do domínio. A conveniência de uma tabela comum não elimina separação de responsabilidade. Ela torna o endereçamento uniforme, deixando a semântica do conteúdo nas mãos de cada domínio e de seus serviços de transformação.\n\nUma verificação de integração deve começar com duas identidades e documentos distinguíveis, para que uma leitura cruzada inesperada seja observável. Depois deve testar chave inexistente, documento antigo, erro do serviço e escrita concorrente. Esta fonte não realiza essas operações externas e não afirma que o catálogo garante isolamento. O que fica verificável localmente é o endereço declarado, a forma da migração e os consumidores do contrato. Essa base permite planejar o ensaio real sem confundir o mapa do backend com o backend efetivamente configurado e em funcionamento."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.SUITE_APPS.map(a=>a.dataKey));\nconst expected = [\"schedule\",\"kairos-board\",\"pluto-ledger\",\"hermes-outbox\",\"chiron-index\"];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (prefs.USER_DATA_KEY);\nconst expected = \"suite-prefs\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "A chave composta separa proprietário e domínio; catálogo local e política SQL são partes distintas do contrato."
        },
        {
          "kind": "quebraria",
          "md": "Registrar chiron-index sem confrontar o escritor chiron-data pode deixar o painel vazio apesar de o usuário ter acervo salvo."
        },
        {
          "kind": "cite",
          "file": "../chronos-audit/supabase/migrations/0001_init.sql",
          "symbol": "public.user_data",
          "lines": [
            7,
            7
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Endereço dos documentos\"><title>Endereço dos documentos</title><desc>SQL local descreve a política desejada; aplicação e RLS remoto não são certificados por inspeção.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">user_id + key</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Política declarada</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Documento JSONB</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Leitor proprietário</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Endereço dos documentos: SQL local descreve a política desejada; aplicação e RLS remoto não são certificados por inspeção. Fonte: ../chronos-audit/supabase/migrations/0001_init.sql"
        },
        {
          "kind": "cite",
          "file": "../chronos-audit/supabase/migrations/0001_init.sql",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        }
      ]
    },
    {
      "title": "JSONB, tamanho e separação de bibliotecas",
      "order": 1,
      "blocks": [
        {
          "kind": "prose",
          "md": "Guardar um documento JSONB por domínio reduz o acoplamento entre a estrutura interna dos aplicativos. O quadro do Kairos pode evoluir projetos e tarefas sem obrigar o ledger financeiro a adotar as mesmas entidades. O valor persistido continua sendo um documento que exige versão, política de recuperação e leitores compatíveis. A tabela oferece um recipiente comum, não um esquema universal para todo o produto. Uma chave compartilhada não torna estruturas arbitrárias intercambiáveis nem transforma consultas a campos internos em operações automaticamente seguras e eficientes.\n\nA arquitetura sugere manter cada documento abaixo de aproximadamente um megabyte. Esse número aparece como orientação de desenho para os dados pessoais esperados, não como um limite rígido demonstrado por estes exemplos. Uma biblioteca de estudo pode crescer por textos, código e figuras, enquanto o índice de estudo conserva relações, cards e progresso. O planejamento propõe dividir chiron-index e chiron-lib:<sourceId> para separar esses ritmos de crescimento. A implementação atual do store precisa ser confrontada antes de afirmar que essa divisão já governa suas gravações remotas.\n\nNo caso observado, o Chiron armazena um agregado chiron-data com índice e bibliotecas. Esse fato tem consequências para o hub e para o custo de sincronização. Um leitor que espera o índice diretamente em value não encontra necessariamente as coleções onde procura. Uma alteração pequena no progresso pode carregar um documento muito maior se todas as bibliotecas seguirem juntas. A apostila não corrige essa arquitetura por conta própria, mas torna o desvio identificável. O próximo trabalho funcional precisaria definir uma transição que conserve bibliotecas e vínculos, sem perder progresso existente.\n\nOs exemplos desta seção estabelecem fatos menores e reproduzíveis. emptyPrefs retorna a versão dois do documento de preferências, e uma inspeção local confirma a orientação de tamanho na arquitetura. Não medem um documento real do usuário, não fazem upload e não certificam o tamanho máximo aceito pelo serviço. A escolha de oráculos literais evita calcular o esperado pela mesma função testada. A legenda delimita o resultado: uma chamada de domínio em memória e uma leitura de fonte não equivalem a um ensaio de armazenamento remoto ou de desempenho de sincronização.\n\nPara estimar crescimento, identifique primeiro o que varia por evento e o que é conteúdo relativamente estável. Cards e tentativas podem aumentar diariamente; textos curados mudam em outro ciclo. Misturar ambos num único payload significa reescrever conteúdo estável para registrar um evento pequeno. Separar demais, por outro lado, cria mais endereços, carregamentos e relações que precisam de recuperação coordenada. O bom ponto de divisão nasce do uso observado, com medições e limites explícitos, e não da ideia abstrata de que mais tabelas ou mais arquivos sempre produzem uma arquitetura melhor.\n\nA recuperação também muda quando existem vários documentos. O índice pode apontar para uma biblioteca ausente, ou uma biblioteca pode sobreviver sem sua fonte no índice. Um carregador precisa reconhecer esse estado e decidir se tenta recarregar, apresenta indisponibilidade ou oferece reparo. Apagar o índice não comprova remoção de todas as bibliotecas remotas. Importar um backup parcial não deve ser apresentado como restauração integral. Essas relações precisam de identidade estável, tratamento de versões e uma política de erros que não silencie perdas como se fossem apenas um primeiro uso vazio.\n\nAo estender a persistência, registre o formato antes e depois, as chaves tocadas e a ordem de migração. Use documentos sintéticos representativos para testar vínculo, ausência e compatibilidade local. Para concluir que uma migração remota funciona, execute-a no ambiente autorizado com cópia recuperável e confira os efeitos. Esta apostila ensina a decompor esse ensaio sem instalar banco ou serviço para simular uma aprovação. A evidência local permanece útil justamente porque não é ampliada para cobrir tamanho, disponibilidade, integridade ou concorrência que o programa publicado não observou."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (prefs.emptyPrefs().meta.version);\nconst expected = 2;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus-plan/SUITE-ARCHITECTURE.md\").includes(\"~1 MB\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "O recipiente JSONB favorece evolução independente, mas tamanho, vínculos e migração permanecem contratos do aplicativo."
        },
        {
          "kind": "quebraria",
          "md": "Dividir chaves sem migração coordenada pode deixar índice e bibliotecas apontando para documentos ausentes."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/SUITE-ARCHITECTURE.md",
          "symbol": "Size guard",
          "lines": [
            37,
            37
          ]
        },
        {
          "kind": "prose",
          "md": "### emptyPrefs — ../olympus/src/lib/prefs/types.ts\n\nAssinatura observada: `export function emptyPrefs(): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: O recipiente JSONB favorece evolução independente, mas tamanho, vínculos e migração permanecem contratos do aplicativo. Contraprova ou limite a preservar: Dividir chaves sem migração coordenada pode deixar índice e bibliotecas apontando para documentos ausentes.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/types.ts",
          "symbol": "emptyPrefs",
          "lines": [
            97,
            97
          ]
        }
      ]
    },
    {
      "title": "Versão de escrita e versão de schema",
      "order": 2,
      "blocks": [
        {
          "kind": "prose",
          "md": "A palavra versão aparece em mais de uma fronteira da família. Uma versão de escrita ajuda a reconhecer uma atualização de documento ou seu eco em realtime. Uma versão de schema informa qual forma o conteúdo usa e quais migrações precisa receber. Esses significados não podem ser trocados apenas porque ambos são números. Em suite-prefs, meta.version identifica o formato de preferências. No caminho remoto, pushPrefs usa Date.now() como marcador de escrita da linha. O relógio não passa a descrever o schema só porque está armazenado numa coluna chamada version. Há ainda um drift de tipo: a migração SQL inicial declara version como integer, enquanto escritores usam Date.now() e o plano descreve int8. O tipo aplicado no serviço não foi consultado; a presença desses arquivos não demonstra compatibilidade remota e exige conferência antes de anunciar a escrita como aprovada.\n\nO migrador de preferências reconstrói o resultado na versão vigente, hoje dois no módulo observado. Isso vale inclusive para um objeto recebido com outro número em meta.version. A rotina não trata um número alto como prova de compatibilidade futura nem implementa despacho completo de todas as versões possíveis. Ela aplica sua política tolerante sobre os campos reconhecidos. Essa escolha merece ser ensinada como comportamento concreto do código, com vantagens e limites. Conservar um número externo sem compreender sua forma poderia fazer os consumidores aceitarem um documento que nunca foi traduzido para seu contrato.\n\nO caso de tema antigo permite observar a transformação. Se a entrada possui theme dark e ainda não possui appearance, o migrador usa dark no novo modo. A base completa as outras opções de aparência. O valor plano continua existindo para leitores antigos. O primeiro exemplo executa esse caminho com expectativa literal. O segundo fornece uma meta.version muito alta e observa que o resultado continua na versão dois. Nenhum dos testes grava a linha remota; ambos tratam o migrador real como uma transformação local sobre uma entrada sintética conhecida.\n\nUm timestamp de escrita também tem limites. Date.now() depende do relógio do dispositivo, pode se repetir em chamadas muito próximas e não expressa uma relação causal completa entre edições concorrentes. Usá-lo numa coleção de versões próprias ajuda a ignorar notificações de uma escrita local, mas não implementa merge nem garante que duas máquinas não sobrescrevam o trabalho uma da outra. A estratégia concreta precisa ser lida no sincronizador. Não atribua ao campo de versão propriedades de transação, comparação atômica ou resolução de conflitos que não aparecem no fluxo de gravação observado.\n\nA distinção ganha importância na recuperação. Um documento pode ter muitas escritas e continuar num schema antigo. Outro pode ser recém-criado já no schema atual. Migrar pelo número de edições falharia no primeiro caso; escolher o schema pelo instante de upload falharia em ambos. O leitor deve procurar o marcador que pertence ao formato e a rotina que realmente o interpreta. No Chiron, a separação entre version e schemaVersion foi uma correção histórica importante, documentada no plano, justamente porque um contador de mutações não informa sozinho a forma persistida.\n\nAo acrescentar um campo, decida se o formato exige mudança de schema ou se um default compatível basta. Registre como documentos antigos serão interpretados, que informação precisa ser preservada e quais valores devem ser recusados. Se o domínio possui múltiplos documentos relacionados, não presuma que seus schemas avançam juntos. Uma biblioteca pode evoluir independentemente do índice. Os testes devem incluir objetos mínimos, campos opcionais ausentes, dados atuais e entradas inesperadas. Mais importante que aumentar um número é demonstrar que os consumidores recebem uma forma coerente depois da transformação.\n\nUma boa explicação de migração deixa claro o que não está validado. O uso de spread em campos aninhados permite que certos valores inesperados sobrevivam. O tipo do retorno não elimina esse risco em runtime. Antes de propor endurecimento, investigue compatibilidade e mensagens de erro para não converter tolerância antiga em perda silenciosa. A apostila mantém a implementação observada e seus limites, sem alterar o serviço durante a autoria. Assim, os exemplos ensinam tanto a política vigente quanto a pergunta que uma extensão precisa responder antes de chamar uma restauração de segura e completa."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (prefs.migrate({theme:\"dark\"}).appearance.mode);\nconst expected = \"dark\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (prefs.migrate({meta:{version:999},theme:\"light\"}).meta.version);\nconst expected = 2;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Schema descreve forma persistida; timestamp de escrita identifica um evento do protocolo e não substitui migração."
        },
        {
          "kind": "quebraria",
          "md": "Usar o contador de gravações como schema deixa documentos antigos muito editados escaparem da transformação necessária."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/types.ts",
          "symbol": "migrate",
          "lines": [
            113,
            113
          ]
        },
        {
          "kind": "prose",
          "md": "### migrate — ../olympus/src/lib/prefs/types.ts\n\nAssinatura observada: `export function migrate(raw: unknown): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Schema descreve forma persistida; timestamp de escrita identifica um evento do protocolo e não substitui migração. Contraprova ou limite a preservar: Usar o contador de gravações como schema deixa documentos antigos muito editados escaparem da transformação necessária.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
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
      "title": "Segredos locais e limites da sincronização",
      "order": 3,
      "blocks": [
        {
          "kind": "prose",
          "md": "A separação entre preferências compartilhadas e configuração sensível começa pelo objeto que atravessa a fronteira. suite-prefs contém aparência, nome, idioma, painéis e outras escolhas de produto. AiSettings contém provider, apiKey, model, baseUrl e autonomia, guardados no namespace local do Olympus. A arquitetura exige que chaves pessoais de provedores não sejam sincronizadas como parte do documento comum. Essa regra depende de quais objetos os escritores realmente serializam. Um comentário sobre privacidade não impede um backup genérico ou um novo agregador de incluir o segredo por engano.\n\nO módulo de configurações de IA usa olympus.ai-settings.v1. loadAiSettings combina defaults com o JSON local e saveAiSettings serializa o objeto recebido. A existência desse namespace permite distinguir preferências de conta das opções de um navegador. Contudo, armazenamento local não significa armazenamento inacessível a qualquer código da mesma origem. Também não prova que exportadores, logs ou anexos respeitam a separação. Uma revisão precisa seguir o dado até cada fronteira de saída e conferir o que é enviado, sem imprimir valores reais ou usar uma credencial pessoal para demonstrar um contrato documental.\n\nO primeiro exemplo observa as chaves de emptyPrefs e exige a lista esperada de campos. Isso demonstra que a função inicial não acrescenta apiKey ao objeto de preferências. O segundo verifica a regra correspondente no README. São ensaios nativos de estrutura e de fonte, não uma auditoria completa de exfiltração. Uma pessoa pode ampliar outro serializador de forma incorreta sem alterar emptyPrefs. O valor pedagógico do caso está em localizar a fronteira inicial e em explicitar que os consumidores e escritores ainda precisam de uma análise própria.\n\nOs provedores também possuem necessidades diferentes. Hosted utiliza o proxy comum com segredo no servidor; os caminhos BYO usam uma chave da pessoa conforme o adaptador; Ollama depende de um endereço e de um processo acessível. O predicado isConfigured do módulo usa presença de chave para algumas variantes e dispensa esse campo para outras. Ele responde uma pergunta de configuração mínima, sem executar rede. Uma URL salva não comprova disponibilidade, autorização ou compatibilidade do endpoint. A interface deve evitar apresentar esse predicado como um teste de conexão bem-sucedido.\n\nUma alteração no painel de configurações precisa alcançar o mesmo namespace lido pelo assistente. A história do repositório registra um defeito em que a tela escrevia chaves diferentes das que o consumidor observava. O usuário mudava o provider e a geração continuava usando outra configuração. Essa falha não se resolve com um rótulo melhor: exige alinhar escrita e leitura e observar o caminho efetivo. O checklist de backend e layout documenta a correção histórica, enquanto a inspeção do código atual permite verificar se a relação continua coerente no checkout em uso.\n\nAo projetar exportação, defina o escopo por formato. Um backup de domínio pode incluir dados pessoais legítimos; um relatório de suporte deve omitir credenciais; uma exportação de preferências de aparência não precisa conhecer chaves de IA. Não confunda a ausência de apiKey num tipo com garantia de remoção em todo JSON, pois spreads e objetos externos podem acrescentar propriedades. Use fixtures com marcadores sintéticos para observar fronteiras, sem carregar segredos reais. A autorização para documentar o sistema não é uma solicitação de acesso ou de transmissão de credenciais do ambiente.\n\nA extensão dessa camada termina quando cada consumidor lê o namespace previsto e cada saída possui uma política explícita. Trocar de provider deve preservar ou limpar campos conforme uma decisão consciente, e a mensagem de erro deve distinguir configuração ausente de requisição recusada. O livro descreve esses testes e executa apenas os exemplos locais declarados. Não instala um servidor de IA nem simula um proxy para obter uma aprovação aparente. Manter essa honestidade protege a utilidade da documentação: o leitor sabe o que o programa observou e o que ainda depende de um serviço autorizado."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (Object.keys(prefs.emptyPrefs()).sort());\nconst expected = [\"appearance\",\"avatar\",\"extensions\",\"meta\",\"notifications\",\"panels\",\"speech\",\"startPage\"];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus-plan/README.md\").includes(\"Keys never leave the device\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "A proteção depende do objeto serializado e de seus consumidores; separar namespaces ajuda, mas não comprova toda saída de dados."
        },
        {
          "kind": "quebraria",
          "md": "Um exportador genérico pode levar apiKey junto com preferências se copiar objetos locais sem política explícita."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/ai/settings.ts",
          "symbol": "AiSettings",
          "lines": [
            8,
            8
          ]
        },
        {
          "kind": "prose",
          "md": "### emptyPrefs — ../olympus/src/lib/prefs/types.ts\n\nAssinatura observada: `export function emptyPrefs(): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: A proteção depende do objeto serializado e de seus consumidores; separar namespaces ajuda, mas não comprova toda saída de dados. Contraprova ou limite a preservar: Um exportador genérico pode levar apiKey junto com preferências se copiar objetos locais sem política explícita.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/types.ts",
          "symbol": "emptyPrefs",
          "lines": [
            97,
            97
          ]
        }
      ]
    }
  ]
};
