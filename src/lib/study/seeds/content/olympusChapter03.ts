import type { ContentChapter } from "./types";
export const OLYMPUS_CHAPTER_3: ContentChapter = {
  "title": "Sincronização como protocolo observável",
  "level": "intermediario",
  "nodeTitle": "Sincronização como protocolo observável",
  "nodeKind": "concept",
  "sections": [
    {
      "title": "Pull, espelho e reidratação sem reload",
      "order": 0,
      "blocks": [
        {
          "kind": "prose",
          "md": "Sincronização de leitura possui pelo menos três objetos observáveis: a linha remota, o espelho local e o estado que a interface usa. Mudar apenas um deles não atualiza necessariamente os outros. No Kairos, pullBoard consulta user_data para o usuário atual e a chave kairos-board. Quando recebe valor, serializa o documento e compara com o armazenamento local do quadro. Se a representação difere, grava o espelho. Depois atualiza o snapshot de comparação e devolve um booleano. Esse retorno informa uma diferença local observada, sem montar qualquer componente por conta própria.\n\nO hook useBoardSync transforma esse resultado em uma notificação para a aplicação. Depois do pull inicial, um changed verdadeiro leva ao disparo de BOARD_PULLED_EVENT. O store que observa esse evento pode reidratar o domínio sem recarregar toda a página. A separação conserva contexto de navegação e evita usar reload como mecanismo de consistência. Contudo, depende de que emissor, nome do evento e receptor continuem alinhados. Corrigir o armazenamento sem notificar o consumidor deixa a UI antiga; disparar o evento antes da gravação pode fazer o consumidor ler justamente o snapshot que deveria substituir.\n\nA leitura do hub tem outro contrato. pullDesk percorre as chaves derivadas de SUITE_APPS e grava envelopes locais com value e version. Os parsers recebem o valor interno por meio de readSiblingRow. Esse leitor não é o store do irmão e não compartilha sua origem. O hub mantém projeções próprias, atualizadas por polling e realtime. A arquitetura pode usar a mesma tabela como fundamento sem copiar a mesma semântica de sincronização em todos os consumidores. Entender essa diferença evita procurar uma escrita de domínio no fluxo que deliberadamente apenas o observa.\n\nOs exemplos fazem duas inspeções nativas: confirmam o ponto em que pullBoard atualiza seu snapshot e verificam que deskSync não contém uma chamada upsert. São fatos do código lido, não uma execução de consulta Supabase. Não há servidor simulado nem promessa de que os espelhos estejam atualizados num navegador real. O diagrama desse sistema deve mostrar serviço, gravação do espelho, evento e reidratação como passos distintos. Uma verificação de ponta a ponta precisaria observar o evento e a tela depois de alterar uma linha autorizada, incluindo o caso em que a leitura falha.\n\nTambém existe uma decisão de conflito no login. O provider de preferências do Olympus prefere o documento remoto quando ele existe e usa o estado local quando não há resultado. Ele migra o objeto remoto antes de entregá-lo ao estado. Essa política não é um merge campo a campo. Uma alteração local feita enquanto o pull está em andamento pode disputar com a resposta que chega depois. Cancelamento, identificação da sessão e revisão de mudanças pendentes precisam ser analisados no consumidor concreto; a palavra reidratação não resolve essas condições automaticamente.\n\nUma leitura pode falhar por falta de cliente, ausência de sessão, erro remoto ou inexistência de documento. Agrupar todos esses resultados num retorno nulo ou falso simplifica consumidores, mas reduz diagnóstico. No pullDesk, erros de uma chave são ignorados enquanto outras continuam. O resultado agregado pode indicar mudança parcial, sem provar que todos os painéis receberam dados novos. O usuário não deveria interpretar silêncio como confirmação de frescor global. Documentar essa limitação ajuda a escolher futuras mensagens e telemetria, sem alterar os fluxos durante a escrita da apostila.\n\nAo estender um domínio, mantenha o envelope e o evento compatíveis ou faça uma migração explícita dos leitores. Teste diferença real, igualdade, ausência, payload antigo e resposta tardia. Separe o teste do parser da verificação de rede e da reidratação React. Cada método observa uma fronteira e deve conservar seu nome. Esse desenho torna possível rastrear uma informação desde sua linha de origem até um painel, reconhecendo em qual passo ela pode se perder, permanecer antiga ou ser interpretada de forma diferente do documento que o irmão realmente escreveu."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../kairos/src/lib/sync/boardSync.ts\").includes(\"snapshot = localStorage.getItem(BOARD_STORAGE_KEY)\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus/src/lib/sync/deskSync.ts\").includes(\".upsert(\"));\nconst expected = false;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Pull, armazenamento do espelho e evento de reidratação são operações separadas; o booleano de leitura não atualiza a tela sozinho."
        },
        {
          "kind": "quebraria",
          "md": "Gravar a cópia local sem notificar o store deixa a UI antiga mesmo quando a consulta remota retornou dados novos."
        },
        {
          "kind": "cite",
          "file": "../kairos/src/lib/sync/boardSync.ts",
          "symbol": "pullBoard",
          "lines": [
            30,
            30
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Pull e reidratação\"><title>Pull e reidratação</title><desc>Consultar, gravar e reidratar são etapas; ausência e erro podem ter retornos parecidos.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Linha remota</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Espelho local</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Evento pulled</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Store atualizado</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Pull e reidratação: Consultar, gravar e reidratar são etapas; ausência e erro podem ter retornos parecidos. Fonte: ../kairos/src/lib/sync/boardSync.ts"
        },
        {
          "kind": "cite",
          "file": "../kairos/src/lib/sync/boardSync.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        }
      ]
    },
    {
      "title": "Push com debounce e escrita pendente",
      "order": 1,
      "blocks": [
        {
          "kind": "prose",
          "md": "Debounce limita a frequência de escrita quando o usuário produz uma sequência de mudanças rápidas. Em flushChanges, o Kairos lê o JSON local do quadro e compara com snapshot. Se for igual, retorna. Se mudou, atualiza snapshot, cancela o timer anterior e agenda pushBoard para um segundo depois. O algoritmo agrega edições próximas numa tentativa posterior. Essa organização reduz gravações, mas precisa ser descrita com precisão: agendar uma requisição não significa que o servidor recebeu ou confirmou o documento, e um snapshot de comparação não equivale a um recibo de persistência.\n\nA ordem das instruções revela uma limitação relevante. snapshot recebe raw antes de a requisição ocorrer. pushBoard obtém cliente e sessão, lê o armazenamento novamente, tenta interpretar JSON, cria uma versão de escrita e faz upsert. O código observado aguarda a chamada, mas não usa um retorno de confirmação para atualizar o snapshot ou manter uma fila persistente de falhas. Se a tentativa não salvar o documento, a próxima comparação pode considerar o mesmo JSON já observado e não agendar nova escrita. O livro registra o risco, sem apresentar o debounce como garantia de entrega eventual.\n\nOs exemplos publicados inspecionam o valor literal do atraso e a posição relativa da atualização de snapshot. Ambos leem o arquivo real no Node. Isso demonstra fatos da implementação e sustenta a explicação do algoritmo. Não injeta um timer falso, não executa uma consulta e não comprova que um evento foi perdido. Para observar a falha completa seria necessário provocar uma escrita recusada no ambiente apropriado e acompanhar o estado pendente. A distinção entre risco fundamentado no fluxo e efeito reproduzido deve acompanhar qualquer conclusão de auditoria.\n\nO nome flush também exige cuidado. No hook, visibilitychange e beforeunload chamam flushChanges. Essa função ainda agenda um timer; não faz uma entrega síncrona imediata. Um navegador prestes a encerrar a página não oferece a mesma janela de execução de uma aba ativa. Portanto, a presença de listeners não basta para prometer que toda edição final chega à nuvem. Um ensaio honesto observa o documento remoto depois de fechar ou ocultar a página e distingue gravação local durável, timer pendente, requisição iniciada e confirmação recebida.\n\nO provider de preferências utiliza outro caminho de debounce. Ele marca o estado como dirty após a transformação local e agenda pushPrefs quando a sessão é cloud. Seu fluxo deve ser lido separadamente, incluindo o que faz com sucesso, falha e mudanças adicionais enquanto a requisição está em curso. Copiar um atraso de mil milissegundos não copia uma política de reenvio. O protocolo precisa representar o que continua pendente e a qual versão do documento corresponde uma confirmação; caso contrário, uma resposta antiga pode ser tratada como prova de que a edição mais nova já foi salva.\n\nUma extensão responsável começa definindo o significado de salvo na interface. Pode significar que a transformação ocorreu em memória, que o armazenamento local aceitou o JSON ou que o backend confirmou a revisão específica. Esses estados não devem compartilhar uma mensagem ambígua. Para implementar retry, decida quais erros são transitórios, qual documento será reenviado e como uma mudança posterior substitui ou convive com a anterior. Não basta repetir a mesma chamada indiscriminadamente, pois o domínio pode ter operações não idempotentes e o usuário pode trocar de conta antes da próxima tentativa.\n\nOs testes de protocolo precisam de um caminho real de confirmação quando a afirmação final é sobre o serviço. Fixtures locais são úteis para o serviço de transformação e para seleção de payload, mas não substituem observar a requisição e seu efeito. Esta fonte não instala infraestrutura para simular essa aprovação. Ela permite localizar o ponto de melhoria, formular uma contraprova e separar a garantia atual da desejada. Assim, o debounce é ensinado como controle de frequência dentro de um protocolo maior, com limites claros de durabilidade, concorrência e entrega."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../kairos/src/lib/sync/boardSync.ts\").match(/pushBoard[^\\n]+, ([0-9]+)[)]/)[1]);\nconst expected = \"1000\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../kairos/src/lib/sync/boardSync.ts\").indexOf(\"snapshot = raw;\") < source(\"../kairos/src/lib/sync/boardSync.ts\").indexOf(\"pushTimer = setTimeout\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Debounce agrega edições, mas snapshot observado antes do ack não é comprovante de gravação remota."
        },
        {
          "kind": "quebraria",
          "md": "Uma falha após avançar snapshot pode deixar o mesmo JSON sem nova tentativa; listener de unload que agenda timer não garante entrega."
        },
        {
          "kind": "cite",
          "file": "../kairos/src/lib/sync/boardSync.ts",
          "symbol": "flushChanges",
          "lines": [
            71,
            71
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Push e eco\"><title>Push e eco</title><desc>snapshot avança antes do ack; guarda de eco não faz merge concorrente.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">JSON alterado</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Debounce</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Upsert + version</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Filtro de eco</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Push e eco: snapshot avança antes do ack; guarda de eco não faz merge concorrente. Fonte: ../kairos/src/lib/sync/boardSync.ts"
        },
        {
          "kind": "cite",
          "file": "../kairos/src/lib/sync/boardSync.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        }
      ]
    },
    {
      "title": "Realtime e guarda contra o próprio eco",
      "order": 2,
      "blocks": [
        {
          "kind": "prose",
          "md": "Uma aplicação que escreve uma linha e também assina suas mudanças pode receber de volta a notificação da própria escrita. Se tratar toda notificação como alteração estrangeira, executa leituras e mensagens desnecessárias; em implementações menos cuidadosas, ainda pode iniciar ciclos de escrita. O Kairos mantém ownVersions como conjunto de marcadores produzidos localmente. Antes do upsert, acrescenta a versão criada por Date.now(). Quando chega um evento, o callback confere a chave do domínio e verifica se o marcador pertence ao conjunto. Versões próprias são ignoradas nesse caminho.\n\nO filtro por usuário na inscrição e o filtro por key no callback têm responsabilidades diferentes. A inscrição limita o conjunto de eventos solicitado ao canal, enquanto a key separa o quadro dos demais documentos do mesmo proprietário. Uma linha do Chronos não deve disparar a reidratação do Kairos apenas porque pertence à mesma conta. Os exemplos confirmam a presença das duas guardas no arquivo local. São inspeções de fonte com expectativa literal, não uma conexão realtime, e não comprovam que as políticas remotas de publicação ou autenticação estão configuradas corretamente.\n\nO marcador de escrita não é uma identidade causal perfeita. Dois dispositivos podem gerar o mesmo número, relógios podem divergir e o conjunto local não descreve a relação entre revisões concorrentes. No código observado, a guarda serve para reconhecer ecos conhecidos daquele processo. Ela não transforma o upsert num compare-and-swap nem produz merge de tarefas. Se duas máquinas editam o documento inteiro, a persistência precisa de uma política de conflito própria. Ignorar a própria notificação evita ruído, mas não garante que a última intenção do usuário sobreviva à disputa.\n\nA duração do conjunto também merece atenção. ownVersions está no escopo do módulo, e a implementação mostrada não remove cada marcador ao reconhecer o eco. Essa escolha pode aumentar o conjunto ao longo de uma sessão prolongada. O custo e o risco concreto dependem do uso e não foram medidos por estes programas. Uma mudança futura pode definir retenção ou identificadores mais claros, desde que preserve a distinção entre escrita própria e estrangeira. Limpar tudo cedo demais, por outro lado, faria ecos atrasados parecerem novas mudanças de outro dispositivo.\n\nO hub possui uma assimetria deliberada: deskSync apenas lê as linhas dos irmãos. Por isso não precisa da mesma guarda de versões próprias para essas linhas. Ele assina mudanças das chaves do catálogo e reexecuta pullDesk, além do polling periódico. A existência da coluna version no envelope local não significa que todos os leitores implementem ordenação ou rejeição de regressão por esse número. A lógica efetiva é o que o código compara. O comentário de intenção precisa ser confrontado com as condições executadas antes de prometer uma política de frescor.\n\nA reidratação por evento também pode produzir mensagens duplicadas se polling e realtime detectarem a mesma atualização em momentos diferentes. Comparar a representação local reduz parte desse trabalho, mas a correção depende da atomicidade das leituras e das respostas que chegam fora de ordem. Um teste de parser não observa esse entrelaçamento. Para investigar, registre identificador do documento, sessão e revisão de forma que não exponha dados sensíveis, e acompanhe a sequência completa. Evite concluir que uma assinatura bem-sucedida demonstra todos os efeitos posteriores de interpretação e renderização.\n\nAo estender a sincronização, desenhe a sequência de uma escrita local, seu ack, seu eco e uma escrita estrangeira concorrente. Identifique quais eventos são ignorados, quais disparam leitura e como respostas antigas são tratadas. Depois acrescente troca de usuário e desmontagem do componente. Esse exercício expõe garantias ausentes sem inventar um servidor ou declarar equivalência entre modelos locais e o serviço. A guarda de eco é uma peça útil e concreta do protocolo; ensiná-la com seus limites permite reutilizar a ideia sem copiar uma promessa maior do que a implementação realmente sustenta."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../kairos/src/lib/sync/boardSync.ts\").includes(\"ownVersions.has(row.version)\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../kairos/src/lib/sync/boardSync.ts\").includes(\"row?.key !== DOMAIN_KEY\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "A guarda reconhece marcadores produzidos no processo; filtrar eco é diferente de resolver concorrência entre documentos."
        },
        {
          "kind": "quebraria",
          "md": "Tratar ownVersions como algoritmo de merge permite sobrescrever edições estrangeiras mesmo sem nenhuma notificação repetida."
        },
        {
          "kind": "cite",
          "file": "../kairos/src/lib/sync/boardSync.ts",
          "symbol": "subscribeForeignChanges",
          "lines": [
            79,
            79
          ]
        }
      ]
    },
    {
      "title": "Falha, logout e disputa entre dispositivos",
      "order": 3,
      "blocks": [
        {
          "kind": "prose",
          "md": "Falhas de sincronização ficam mais difíceis quando uma resposta atravessa uma mudança de contexto. O usuário pode editar localmente, iniciar login, trocar de conta ou fechar a página enquanto há uma consulta pendente. A regra de qual documento vence precisa considerar esses momentos, não apenas o caminho feliz de uma única aba. Em PrefsProvider, o Olympus inicia a partir do espelho local e, numa sessão cloud, chama pullPrefs. Quando existe um documento remoto, migra esse valor e o entrega ao reducer; quando não existe, conserva a leitura local disponível naquele momento.\n\nEssa política privilegia a cópia remota no login, mas não é um merge de campos. O estado de UPDATE marca dirty, enquanto SET_PREFS substitui o documento e limpa essa marca. A resposta de um pull pode chegar depois de uma edição feita durante a espera. Para entender o resultado, é necessário seguir o efeito, o reducer e as dependências da sessão. A intenção de sincronizar preferências não impede automaticamente que uma resposta tardia substitua uma escolha recente. A apostila descreve a condição e não apresenta uma recuperação concorrente que o código não implementa.\n\nOs exemplos desta seção executam o migrador real com duas entradas sintéticas. Uma página inicial desconhecida volta para home; um modo de aparência desconhecido pode atravessar o spread e permanecer invalid. Essa combinação mostra a diferença entre uma normalização pontual e validação profunda. Ela não envolve logout, rede ou duas máquinas. O propósito é demonstrar que a forma recebida precisa ser tratada conscientemente antes de virar estado, e que o tipo de retorno não permite inferir uma garantia uniforme para todos os campos do documento.\n\nO hook de sincronização do Kairos possui uma variável cancelled para evitar parte dos efeitos posteriores à desmontagem. Depois do pull inicial, ele verifica esse sinal antes de instalar intervalos e emitir eventos. Essa verificação não desfaz uma gravação local que já ocorreu dentro de pullBoard. Também é preciso examinar callbacks de leitura acionados por realtime, timers pendentes e recursos criados depois de uma espera. Cancelar uma continuação de UI e cancelar a operação de rede são contratos distintos. O nome da variável não comprova que toda atividade anterior foi interrompida.\n\nLogout acrescenta a fronteira de identidade. Encerrar uma sessão remota não significa necessariamente apagar o documento guest, o espelho do hub ou todos os estados de domínio em memória. O comportamento desejado depende do produto, mas deve impedir que a próxima identidade seja tratada como proprietária dos dados da anterior. Uma revisão de protocolo precisa localizar quando o escritor obtém o userId e a qual documento local associa essa identidade. Não basta demonstrar que um botão chama signOut se uma tentativa agendada ainda pode ler outro estado depois da mudança de sessão.\n\nA disputa entre dispositivos também não se resolve pelo uso de Date.now(). O marcador pode ajudar a reconhecer escritas, mas uma atualização integral ainda pode substituir campos alterados remotamente. Para evoluir o protocolo, escolha explicitamente entre rejeição de revisão antiga, merge por entidades, operações idempotentes ou outra política apropriada ao domínio. A decisão deve conservar migração e recuperação. Um ledger financeiro, uma preferência visual e uma fila de entrega não têm o mesmo custo de perda; copiar o mesmo tratamento de conflito para todos pode esconder riscos muito diferentes.\n\nUm ensaio real precisa observar erros de permissão, transporte indisponível, sessão expirada, resposta tardia e alterações concorrentes com resultados distinguíveis. Ele deve preservar o documento original e permitir conferir o que ficou local e remoto. Estes programas não realizam esse ensaio e não usam serviços falsos como substituto. O capítulo fornece o mapa para formulá-lo e deixa os limites do código explícitos. Essa honestidade permite ampliar a implementação depois sem reclassificar um teste local de migração como uma aprovação de isolamento, durabilidade e resolução de conflitos entre usuários e dispositivos."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (prefs.migrate({startPage:\"unknown\"}).startPage);\nconst expected = \"home\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (prefs.migrate({appearance:{mode:\"invalid\"}}).appearance.mode);\nconst expected = \"invalid\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Estado remoto preferido no login é uma política de substituição; não equivale a merge nem cancela automaticamente respostas tardias."
        },
        {
          "kind": "quebraria",
          "md": "Uma resposta de pull que chega após UPDATE pode substituir uma escolha local recente e limpar dirty sem representar sua gravação."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/store.tsx",
          "symbol": "PrefsProvider",
          "lines": [
            68,
            68
          ]
        },
        {
          "kind": "prose",
          "md": "### migrate — ../olympus/src/lib/prefs/types.ts\n\nAssinatura observada: `export function migrate(raw: unknown): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Estado remoto preferido no login é uma política de substituição; não equivale a merge nem cancela automaticamente respostas tardias. Contraprova ou limite a preservar: Uma resposta de pull que chega após UPDATE pode substituir uma escolha local recente e limpar dirty sem representar sua gravação.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
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
    }
  ]
};
