import type { ContentChapter } from "./types";
export const OLYMPUS_CHAPTER_10: ContentChapter = {
  "title": "Kairos: oportunidade, ordem e projeto",
  "level": "avancado",
  "nodeTitle": "Kairos: oportunidade, ordem e projeto",
  "nodeKind": "concept",
  "sections": [
    {
      "title": "Tarefa ativa, vencimento e prioridade",
      "order": 0,
      "blocks": [
        {
          "kind": "prose",
          "md": "Uma tarefa do Kairos possui ciclo de vida, prioridade e prazo; ela não é uma janela de tempo reservada. Essa distinção aparece no próprio tipo do domínio e explica por que o painel Agora utiliza uma ordem de atenção diferente da linha temporal do Chronos. parseNow lê tasks e projects, remove tarefas arquivadas e concluídas e projeta campos úteis para decidir o próximo movimento. O hub não oferece o quadro inteiro em miniatura: seleciona tarefas atrasadas, para hoje ou em andamento, porque esses estados respondem a uma pergunta mais imediata que simplesmente listar todo o backlog.\n\nO algoritmo define classes antes de ordenar por prioridade. Atrasadas vêm primeiro, depois as que vencem hoje, depois doing. Dentro da mesma classe, urgent antecede high, medium, low e none; por fim, a data decide parte dos empates. Assim, uma tarefa em andamento de alta prioridade não ultrapassa necessariamente uma atrasada de prioridade baixa. A política é uma escolha de produto legível no código, não uma noção universal de importância. Mudar a ordem exige explicitar que tipo de atenção o painel pretende orientar e conservar coerência com o rótulo apresentado ao usuário.\n\nOs exemplos executam a seleção real. Uma tarefa com prazo distante e status todo fica fora da lista relevante, enquanto uma tarefa antiga aparece. No outro caso, uma concluída e uma arquivada com datas antigas não aumentam overdue. As expectativas são literais sobre ids e contagem, sem usar a mesma função para construir o resultado esperado. As datas extremas evitam depender do dia específico de execução. Esses casos não testam fuso, virada de dia ou toda a ordem de prioridades; demonstram a seleção e a exclusão declaradas pelas fixtures.\n\nOs totais e a lista possuem fronteiras diferentes. overdue, dueToday e doing são calculados sobre o conjunto mapeado de tarefas ativas, enquanto a lista relevante pode ser cortada por limit. Um cartão que mostra oito itens pode representar mais tarefas na contagem. Esse contraste é útil quando a UI deixa claro o alcance. Se o leitor somar apenas as linhas visíveis e esperar igualdade com todo total, pode diagnosticar um defeito inexistente. Por outro lado, os parsers podem ter outras contagens feitas em coleções diferentes; cada campo precisa ser ligado ao conjunto que o produz.\n\nA interpretação de prazo depende de string e do helper today em ISO UTC. Não há validação completa de calendário no parser. Um formato de data incompatível pode participar de comparações lexicográficas inesperadas. Também há fallbacks para título, nome de projeto e prioridade desconhecida. Eles tornam a leitura tolerante, mas não validam cada entidade como o serviço proprietário faria. Um payload com tasks ausente retorna null em determinada condição, enquanto um array vazio produz um painel vazio válido. Essa diferença permite separar ausência de estrutura e ausência de trabalho, embora não identifique todas as causas remotas.\n\nAo estender o painel, mantenha a distinção entre urgência de prazo e prioridade declarada. Inclua fixtures que diferenciem as duas regras, tarefas sem prazo, status desconhecido e limite menor que o conjunto relevante. Decida também o que fazer com projetos arquivados, pois o filtro de tarefa não deve ser confundido com uma revisão de toda política de projeto. Uma mudança no serviço do Kairos pode exigir uma nova projeção, especialmente quando renomeia status ou campos. A existência de tipos copiados no hub não força os dois repositórios a evoluírem no mesmo instante.\n\nA prova completa de uso exige observar o quadro real, seu espelho e a superfície do hub. Os programas desta seção executam apenas o parser e não alteram tarefas ou chamam o backend. Essa delimitação mantém a particularidade do Kairos clara: o proprietário administra o ciclo de vida, enquanto o hub organiza uma visão de atenção. O leitor pode modificar a ordem ou os filtros com conhecimento de suas consequências, sem transformar uma lista conveniente em agendamento automático, validação integral do documento ou confirmação de que uma tarefa foi executada pela pessoa."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst kairos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/kairos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (kairos.parseNow({tasks:[{id:\"future\",dueDate:\"9999-01-01\",status:\"todo\"},{id:\"old\",dueDate:\"2000-01-01\",status:\"todo\"}]}).tasks.map(t=>t.id));\nconst expected = [\"old\"];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst kairos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/kairos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (kairos.parseNow({tasks:[{id:\"done\",dueDate:\"2000-01-01\",status:\"done\"},{id:\"arch\",dueDate:\"2000-01-01\",archivedAt:\"2001\"}]}).overdue);\nconst expected = 0;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "A classe temporal precede a prioridade; a lista visível e os totais podem usar limites diferentes."
        },
        {
          "kind": "quebraria",
          "md": "Somar apenas os itens cortados por limit e comparar com todos os atrasos pode produzir um diagnóstico incorreto de divergência."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/kairos.ts",
          "symbol": "parseNow",
          "lines": [
            11,
            11
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Kairos Agora\"><title>Kairos Agora</title><desc>Totais e lista podem usar limites diferentes; tarefa não é janela de agenda.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Tarefas ativas</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Classe temporal</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Prioridade</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Recorte de atenção</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Kairos Agora: Totais e lista podem usar limites diferentes; tarefa não é janela de agenda. Fonte: ../olympus/src/lib/panels/kairos.ts"
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/kairos.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### parseNow — ../olympus/src/lib/panels/kairos.ts\n\nAssinatura observada: `export function parseNow(raw: Record<string, unknown> | null, limit = 8): NowPanel | null`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: A classe temporal precede a prioridade; a lista visível e os totais podem usar limites diferentes. Contraprova ou limite a preservar: Somar apenas os itens cortados por limit e comparar com todos os atrasos pode produzir um diagnóstico incorreto de divergência.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/kairos.ts",
          "symbol": "parseNow",
          "lines": [
            11,
            11
          ]
        }
      ]
    },
    {
      "title": "O projeto como documento do quadro",
      "order": 1,
      "blocks": [
        {
          "kind": "prose",
          "md": "No Kairos, projeto é a unidade que reúne tarefas e labels e oferece um contexto estável para abrir o trabalho. No índice do hub, essa unidade vira um documento em vez de apenas mais uma entrada de aplicativo. kairosProjects lê projects, encontra tarefas pelo projectId e produz id, título, cor, contagem, quantidade aberta, data e estado de arquivo. A projeção permite mostrar um cartão informativo com remissiva ao quadro proprietário. Ela não copia toda a estrutura do projeto nem transfere ao Olympus a autoridade de mover suas tarefas.\n\nA relação por id é central. Uma tarefa com título parecido não pertence ao projeto se seu projectId aponta para outro lugar. O extrator filtra também archivedAt das tarefas antes de calcular count e open. Concluídas continuam na contagem total quando não estão arquivadas, mas não na quantidade aberta. Essa escolha diferencia volume de trabalho registrado e volume ainda ativo. O exemplo publica um projeto com uma tarefa done e outra arquivada, exigindo count um e open zero. O resultado torna a política concreta sem criar dados no quadro real.\n\nO outro exemplo chama kairosProjects com null e exige uma lista vazia. Esse retorno é uma recuperação simples para ausência de documento. Ele não prova que o usuário não possui projetos na conta, porque o dado pode ter falhado antes de chegar ao parser. No índice completo, um erro de sincronização ou uma key incompatível pode terminar na mesma lista vazia. A interface e a documentação precisam conservar a possibilidade de indisponibilidade, em vez de apresentar todo vazio como um primeiro uso. Um teste puro de entrada nula não demonstra a causa remota da ausência.\n\nA data de atualização deriva primeiro das tarefas do projeto. Para cada uma, a função escolhe updatedAt, completedAt ou createdAt, remove valores vazios, ordena e toma o último; sem data útil, recorre a campos do projeto. Essa é uma política de recência, não uma leitura de eventos em ordem causal. Ela depende de strings comparáveis e de timestamps consistentes. Uma edição com relógio incorreto pode elevar um documento indevidamente. A projeção não resolve essas discrepâncias, e o índice ordenado não deve ser apresentado como um histórico confiável de cada operação realizada no domínio.\n\nO campo archived do projeto é produzido pelo extrator, e o consumidor documental decide excluir projetos arquivados da lista exibida. Essa separação ajuda a reutilizar a projeção em outras superfícies, mas exige que cada consumidor aplique a regra apropriada. Não presuma que um projeto arquivado desaparece de todo painel apenas porque Files o filtra. O painel Agora tem outra seleção, orientada a tarefas. A relação entre arquivo de projeto e visibilidade de tarefas precisa ser confrontada com o domínio real quando a política muda, em vez de ser inferida por similaridade de nomes.\n\nAo estender os metadados, escolha o que o usuário precisa decidir ao ver o cartão. Incluir todo o projeto no índice pode aumentar carga e acoplamento sem melhorar descoberta. Um detalhe curto deve conservar significado e evitar inventar percentuais que o domínio não oferece. A URL precisa selecionar o projeto correto no roteador do Kairos, inclusive quando a sessão naquela origem ainda não existe. Encode do identificador ajuda na construção da string, mas não comprova que a página de destino reconhece o parâmetro ou que a pessoa possui acesso ao documento.\n\nA validação apropriada separa extração, ordenação, filtro e navegação. Os programas publicados cobrem relações locais de tarefas e ausência de entrada; não certificam o fluxo completo de abrir um projeto na conta real. Essa precisão mantém a ideia de documentos como objetos de trabalho sem confundi-la com cópia integral do domínio. O leitor aprende a modificar contagens e datas com conhecimento de suas fontes, preservando ids, estado de arquivo e responsabilidade do aplicativo proprietário, em vez de tratar um cartão de projeto como prova de que todo o quadro foi carregado e reconciliado."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst kairos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/kairos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (kairos.kairosProjects({projects:[{id:\"p\",name:\"P\"}],tasks:[{projectId:\"p\",status:\"done\"},{projectId:\"p\",status:\"todo\",archivedAt:\"yes\"}]}).map(p=>[p.count,p.open]));\nconst expected = [[1,0]];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst kairos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/kairos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (kairos.kairosProjects(null));\nconst expected = [];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Projeto é uma unidade documental; count inclui concluídas não arquivadas e open exclui done, conservando significados distintos."
        },
        {
          "kind": "quebraria",
          "md": "Associar tarefas por título em vez de projectId pode misturar trabalho de projetos diferentes que usam nomes parecidos."
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
          "md": "### kairosProjects — ../olympus/src/lib/panels/kairos.ts\n\nAssinatura observada: `export function kairosProjects(raw: Record<string, unknown> | null)`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Projeto é uma unidade documental; count inclui concluídas não arquivadas e open exclui done, conservando significados distintos. Contraprova ou limite a preservar: Associar tarefas por título em vez de projectId pode misturar trabalho de projetos diferentes que usam nomes parecidos.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/kairos.ts",
          "symbol": "kairosProjects",
          "lines": [
            69,
            69
          ]
        }
      ]
    },
    {
      "title": "Conclusão, arquivo e a visão Agora",
      "order": 2,
      "blocks": [
        {
          "kind": "prose",
          "md": "Concluir e arquivar uma tarefa não são a mesma operação. O Kairos mantém status para o ciclo de trabalho e archivedAt para retirar itens da visão ativa sem necessariamente apagá-los. Uma tarefa pode estar done e continuar disponível no quadro ou no histórico; arquivá-la muda sua participação em consultas de trabalho corrente. O serviço proprietário possui operações distintas para mover, atualizar, arquivar e restaurar. A visão Agora do hub precisa respeitar essa diferença para não contar itens concluídos como atrasos nem interpretar ausência na lista como exclusão definitiva do documento.\n\nmoveTask ajusta posição e status, preservando ou criando completedAt ao entrar em done e limpando esse marcador ao sair. archiveTask marca archivedAt e updatedAt, enquanto unarchiveTask volta a posicionar o item numa coluna. Esses campos permitem que consumidores façam perguntas diferentes: o que está ativo, o que foi concluído hoje e o que foi guardado fora do fluxo corrente. O parser do hub lê essas informações, mas não executa o serviço de mudança. Uma representação menor não deve ser usada para substituir a operação proprietária sem considerar ordem de coluna, timestamps e demais invariantes do quadro.\n\nOs exemplos chamam parseNow. Uma tarefa doing sem prazo entra na lista relevante; um array vazio produz doing zero. São dois resultados locais que demonstram a presença de uma classe de atenção independente de vencimento e o estado vazio válido. Não movem uma tarefa, não atualizam completedAt e não certificam a integração do botão de conclusão. O tipo doing no parser é um critério de projeção, não evidência de que a pessoa está efetivamente trabalhando naquele item. Essa distinção conserva o sentido dos campos sem atribuir atividade real a um estado declarado.\n\nAs contagens também merecem confronto. O conjunto live exclui archivedAt e status done antes de calcular atrasadas, para hoje e em andamento. doneToday, porém, é calculado a partir da coleção tasks e de completedAt começando com o dia. Portanto, uma tarefa arquivada depois de concluída pode continuar representada na contagem de conclusões daquele dia. Isso não precisa ser um defeito; é uma decisão sobre o conjunto observado. A UI deve tornar os totais compreensíveis, e a documentação precisa informar a origem em vez de presumir que todos os indicadores usam exatamente o mesmo filtro.\n\nA ordenação por projeto e coluna no proprietário não é a ordem de atenção do hub. O serviço pode conservar posições manuais, enquanto parseNow prioriza atraso, prazo e doing. Se o usuário arrasta uma tarefa e o painel não a move para a mesma posição, isso pode ser uma consequência esperada das duas perguntas. Um painel de Agora não promete espelhar o board literalmente. Antes de alterar a projeção para imitar o quadro, escolha qual experiência pretende oferecer e quais regras de atenção seriam perdidas ao adotar uma ordem manual indiscriminada.\n\nAo estender conclusão, defina a relação entre status, timestamps, checklist e arquivo. Uma importação pode atualizar status por um caminho diferente do drag, e esses caminhos precisam manter coerência se o produto pretende contar conclusões. Um patch amplo que muda status sem atualizar o marcador temporal pode produzir uma tarefa done que não aparece em doneToday. A solução pertence ao serviço e aos consumidores pertinentes, não a um contador artificial no hub. O livro não corrige esse comportamento durante a autoria; aponta o que uma revisão deve confrontar antes de ampliar a garantia.\n\nO ensaio completo exige observar a tarefa antes e depois da operação proprietária, sincronizar a revisão correta e conferir cada projeção afetada. Os programas publicados ficam no parser real com fixtures sintéticas, sem servidor ou UI simulados. Esse escopo permite compreender os estados e formular contraprovas sem chamar uma contagem de conclusão de prova de execução humana. O leitor ganha uma distinção operacional entre mudar ciclo de vida, arquivar, excluir e projetar atenção, podendo modificar o quadro e o hub com conhecimento das responsabilidades que cada caminho precisa preservar."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst kairos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/kairos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (kairos.parseNow({tasks:[{id:\"doing\",status:\"doing\"}]}).tasks.map(t=>t.id));\nconst expected = [\"doing\"];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst kairos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/kairos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (kairos.parseNow({tasks:[]}).doing);\nconst expected = 0;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Status e archivedAt representam dimensões distintas; o painel usa filtros e ordenação próprios, diferentes da ordem manual do board."
        },
        {
          "kind": "quebraria",
          "md": "Atualizar status para done sem tratar completedAt pode deixar a tarefa fora de doneToday mesmo quando aparece concluída."
        },
        {
          "kind": "cite",
          "file": "../kairos/src/lib/board/service.ts",
          "symbol": "moveTask",
          "lines": [
            195,
            195
          ]
        },
        {
          "kind": "prose",
          "md": "### parseNow — ../olympus/src/lib/panels/kairos.ts\n\nAssinatura observada: `export function parseNow(raw: Record<string, unknown> | null, limit = 8): NowPanel | null`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Status e archivedAt representam dimensões distintas; o painel usa filtros e ordenação próprios, diferentes da ordem manual do board. Contraprova ou limite a preservar: Atualizar status para done sem tratar completedAt pode deixar a tarefa fora de doneToday mesmo quando aparece concluída.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/kairos.ts",
          "symbol": "parseNow",
          "lines": [
            11,
            11
          ]
        }
      ]
    },
    {
      "title": "Round-trip Markdown e fronteira da ponte",
      "order": 3,
      "blocks": [
        {
          "kind": "prose",
          "md": "O round-trip Markdown permite levar um projeto para um editor de texto ou agente e importar alterações depois. Essa capacidade não é apenas exportação visual. O formato precisa conservar vocabulário que o parser reconhece e uma política de associação entre o texto e as entidades existentes. No Kairos, exportProjectMarkdown usa headings de status em inglês e listas de tarefas, prioridades, datas e labels. A decisão de manter esses tokens canônicos independe do idioma da UI. Traduzir a interface não deve tornar o documento impossível de reimportar por um parser que espera os mesmos headings.\n\nimportMarkdown separa blocos de projeto, exige pelo menos um heading reconhecível e aplica cada bloco ao board. Dentro do bloco, encontra ou cria projeto pelo nome e acompanha a coluna de status. Tarefas reconhecidas são associadas por título no projeto, sem archivedAt, ou criadas quando não há correspondência. Labels são encontradas ou acrescentadas conforme o texto. Itens de checklist podem ser atualizados pelo texto e pelo último task id processado. Essa política conserva parte da identidade, mas não equivale a um diff universal com ids explícitos de todas as entidades.\n\nOs exemplos desta seção fazem inspeção nativa da fonte. Eles confirmam a presença da justificativa de vocabulário canônico e da política documentada de associação por título. Não chamam importMarkdown nem demonstram equivalência completa entre exportação e importação de um projeto real. Essa limitação é deliberada: o módulo possui dependências de domínio e o programa publicado aqui observa apenas as afirmações locais que fundamentam a explicação. Nenhum serviço é substituído por uma versão falsa para produzir sucesso. A validação de round-trip exige executar o parser e conferir os campos prometidos por seu contrato.\n\nAssociação por título possui limites previsíveis. Renomear uma tarefa no texto pode criar outra em vez de identificar uma alteração da antiga. Dois títulos iguais podem ser ambíguos. No código observado, projeto é comparado sem diferença de maiúsculas, enquanto a busca de tarefa utiliza igualdade de título no conjunto ativo. Importar texto também não significa apagar toda entidade que deixou de aparecer. A política é de merge dos itens reconhecidos, com atualizações de campos específicos. O leitor deve entender esses detalhes antes de usar a exportação como um formato de edição sem perdas ou como um backup integral.\n\nO parser reconhece metadados por padrões. Datas entre crases, prioridade conhecida e tags são removidas do texto para formar o título e os campos. Um token que parece dado ao usuário pode ser interpretado como metadado pelo importador. Uma extensão precisa definir escaping ou convenções quando títulos e labels usam esses caracteres. Adicionar campos ao export sem ensinar o import pode fazer o ciclo perder informação. O teste útil compara documentos com casos de borda e declara quais propriedades devem sobreviver, em vez de esperar igualdade total sem considerar timestamps, ids novos e campos deliberadamente ausentes do formato.\n\nA ponte de agendamento permanece separada desse round-trip. Um documento Markdown pode alterar a tarefa no Kairos, mas não reprograma automaticamente um compromisso já criado no Chronos. A solicitação de ponte possui estado e recibo próprios. Mudar prazo no texto não deve ser apresentado como remarcação confirmada no calendário. Essa separação conserva a autoridade temporal do irmão e evita efeitos externos implícitos durante uma importação de conteúdo. Se o produto quiser propagar alterações, precisará de um protocolo explícito com identificação, confirmação e política de conflito, não apenas de mais um campo no arquivo exportado.\n\nAo estender o formato, escreva exemplos pequenos de exportação e importação com renomeação, títulos duplicados, labels, checklist, tarefa arquivada e heading desconhecido. Verifique o erro de arquivo sem projeto reconhecível para não anunciar uma importação vazia como sucesso. Esta apostila executa apenas as inspeções declaradas e aponta o domínio que deve ser ensaiado para ampliar a prova. O leitor consegue modificar o formato com conhecimento de sua gramática e de seus limites, preservando a diferença entre editar uma representação textual, reconciliar entidades e solicitar uma mudança em outro sistema da família."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../kairos/src/lib/board/markdown.ts\").includes(\"one canonical vocabulary\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../kairos/src/lib/board/markdown.ts\").includes(\"matched by project/task title\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "O formato canônico possui gramática e associação por título; ele não é um diff universal nem uma operação de agendamento."
        },
        {
          "kind": "quebraria",
          "md": "Renomear no texto uma tarefa associada por título pode criar uma entidade nova em vez de preservar a identidade anterior."
        },
        {
          "kind": "cite",
          "file": "../kairos/src/lib/board/markdown.ts",
          "symbol": "importMarkdown",
          "lines": [
            162,
            162
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Round-trip do quadro\"><title>Round-trip do quadro</title><desc>Associação por título não é diff universal; alterar prazo não remarca compromisso no Chronos.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Exportar canônico</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Editar Markdown</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Reconhecer títulos</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Merge pelo serviço</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Round-trip do quadro: Associação por título não é diff universal; alterar prazo não remarca compromisso no Chronos. Fonte: ../kairos/src/lib/board/markdown.ts"
        },
        {
          "kind": "cite",
          "file": "../kairos/src/lib/board/markdown.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        }
      ]
    }
  ]
};
