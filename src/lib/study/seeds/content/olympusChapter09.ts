import type { ContentChapter } from "./types";
export const OLYMPUS_CHAPTER_9: ContentChapter = {
  "title": "Chronos: o tempo possui geometria",
  "level": "avancado",
  "nodeTitle": "Chronos: o tempo possui geometria",
  "nodeKind": "concept",
  "sections": [
    {
      "title": "Dayplanner e projeção de blocos do dia",
      "order": 0,
      "blocks": [
        {
          "kind": "prose",
          "md": "Chronos trata o tempo como espaço de composição: blocos possuem início, fim, relação com rotina e compromissos. O hub não incorpora todo esse motor. parseDayplanner lê uma projeção do documento schedule e produz os blocos que seu painel pretende apresentar hoje. Essa diferença de autoridade organiza a particularidade do irmão. O aplicativo proprietário decide planejamento e invariantes; Olympus oferece leitura de itens e orientação para a próxima ação. Uma lista ordenada no hub não equivale ao algoritmo de colisão, sono ou composição semanal do Chronos.\n\nO parser começa recusando ausência de documento. Depois calcula o dia por today, o dia da semana pelo relógio local e os minutos atuais também no relógio local. Filtra commitments por data, rotina semanal ou faixa de datas conforme isToday e acrescenta entradas de routine daquele weekday. Para cada bloco, tenta interpretar start e end como horário. Valores que não passam pelo conversor são descartados. O resultado recebe id, título, horário, flag done, cor e classificação temporal. O renderer pode então mostrar itens sem repetir esse conjunto de regras de interpretação.\n\nOs exemplos executam essa implementação real. Uma fixture usa a data que o helper do módulo considera hoje e exige id, título e horários preservados. O outro caso exige null quando não existe documento. O oráculo não depende da classificação atual do relógio, pois os campos comparados foram escolhidos para permanecer estáveis durante a execução. Isso verifica uma projeção concreta sem simular o serviço remoto. Não demonstra que schedule da conta real possui a mesma forma nem que o painel abre e atualiza sua linha do tempo num navegador.\n\nOrdenação e validação merecem leitura cuidadosa. O parser ordena os horários pela string start, após verificar que podem ser convertidos. O conversor aceita uma ou duas casas para hora; portanto, strings não padronizadas podem ter ordem lexicográfica diferente da ordem cronológica. A rotina também não exige que end seja posterior a start ao construir o bloco. Esses limites não são corrigidos silenciosamente nesta autoria. Eles mostram por que uma projeção defensiva pode ser tolerante sem preservar todas as invariantes que o serviço proprietário aplicaria ao construir seu documento.\n\nO título possui fallback por campos conhecidos, terminando em Bloco quando nenhum texto reconhecido está disponível. Identificadores sintéticos ajudam a renderizar dados incompletos, mas não viram identidades persistidas no Chronos. Se o hub oferece um deep link ou ação futura, precisa saber qual referência corresponde a uma entidade real. Um id gerado pela posição na lista pode mudar quando a ordem muda. A apostila conserva essa distinção para evitar que um recurso de apresentação seja usado como chave de escrita ou como prova de uma associação estável entre os aplicativos.\n\nO contexto de IA do hub consome essa mesma projeção. Ao serializar blocos e marcar o atual, consegue responder perguntas específicas sobre o que aparece no painel. Mas filtros e limitações continuam presentes. Um compromisso omitido por formato incompatível não é conhecido pelo modelo apenas porque o prompt diz ver todos os dados. A correção do resumo começa no contrato de leitura. Quando uma resposta parece errada, confira documento, key, forma do horário e critérios de seleção antes de atribuir o resultado a um problema genérico de inteligência do modelo.\n\nPara estender a projeção, escolha o subconjunto que realmente ajuda o usuário e preserve a autoridade do serviço do Chronos. Acrescente fixtures para datas, rotina, horários incompletos e campos antigos, com expectativas literais sobre os valores necessários. A validação de colisão ou remarcação exige os algoritmos proprietários e seus ensaios, não esta função de leitura. A seção permite entender a cadeia concreta do painel sem afirmar equivalência funcional. Esse limite torna possível evoluir o hub de modo útil, mantendo claro o que ele projeta, o que descarta e quais regras continuam pertencendo ao domínio temporal do irmão."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst panel = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/types.ts\")).href);\nconst chronos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chronos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chronos.parseDayplanner({commitments:[{id:\"a\",date:panel.today(),start:\"09:00\",end:\"10:00\",title:\"Ler\"}]}).blocks.map(b=>[b.id,b.title,b.start,b.end]));\nconst expected = [[\"a\",\"Ler\",\"09:00\",\"10:00\"]];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst chronos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chronos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chronos.parseDayplanner(null));\nconst expected = null;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "O painel projeta itens do dia e não reimplementa o motor de composição e colisão do Chronos."
        },
        {
          "kind": "quebraria",
          "md": "Usar um id sintético baseado na posição como referência de escrita pode apontar para outro bloco quando a lista muda."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/chronos.ts",
          "symbol": "parseDayplanner",
          "lines": [
            27,
            27
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Chronos no hub\"><title>Chronos no hub</title><desc>Projeção não executa colisão; hoje UTC e relógio local exigem política temporal.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Schedule</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Filtrar hoje</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Horários e estados</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">DayplannerPanel</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Chronos no hub: Projeção não executa colisão; hoje UTC e relógio local exigem política temporal. Fonte: ../olympus/src/lib/panels/chronos.ts"
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/chronos.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### today — ../olympus/src/lib/panels/types.ts\n\nAssinatura observada: `export function today(): string`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: O painel projeta itens do dia e não reimplementa o motor de composição e colisão do Chronos. Contraprova ou limite a preservar: Usar um id sintético baseado na posição como referência de escrita pode apontar para outro bloco quando a lista muda.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
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
          "md": "### parseDayplanner — ../olympus/src/lib/panels/chronos.ts\n\nAssinatura observada: `export function parseDayplanner(raw: Record<string, unknown> | null): DayplannerPanel | null`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: O painel projeta itens do dia e não reimplementa o motor de composição e colisão do Chronos. Contraprova ou limite a preservar: Usar um id sintético baseado na posição como referência de escrita pode apontar para outro bloco quando a lista muda.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/chronos.ts",
          "symbol": "parseDayplanner",
          "lines": [
            27,
            27
          ]
        }
      ]
    },
    {
      "title": "Instante UTC, calendário local e horários",
      "order": 1,
      "blocks": [
        {
          "kind": "prose",
          "md": "Um instante, um dia de calendário e um horário de rotina são valores diferentes. O instante identifica um ponto na linha temporal. O dia depende de uma convenção de calendário e zona. Um horário como 09:30 pode representar uma posição no dia local sem conter data ou offset. Misturar esses valores numa projeção de cronograma pode selecionar blocos de um dia e classificá-los com o relógio de outro. A particularidade temporal do Chronos torna essa fronteira visível, e o hub precisa respeitá-la mesmo quando apresenta apenas uma parte do sistema.\n\ntoday, no módulo de tipos dos painéis, usa new Date().toISOString().split para obter um dia UTC. minutesNow usa getHours e getMinutes locais. parseDayplanner também consulta getDay local para selecionar a rotina. Perto da mudança de dia, essas referências podem discordar sobre qual é hoje. O backlog reconhece timezone como lacuna. A presença de um helper chamado today não resolve a política; ela apenas centraliza uma escolha concreta. Uma correção futura precisa definir zona e formato de entrada antes de substituir chamadas isoladas, para não mover o erro para outro consumidor.\n\nOs exemplos executam dois helpers reais com expectativas independentes. toMinutes rejeita 24:00 porque o domínio do conversor vai até hora vinte e três e minuto cinquenta e nove. minutesNow recebe uma Date construída com hora local explícita de dez e quinze e devolve seiscentos e quinze minutos. O caso evita depender do relógio corrente ou de um offset específico. Esses programas demonstram limites e aritmética local, sem testar mudança de fuso, horário de verão, viagens ou o formato completo de um documento de agenda criado em outro ambiente.\n\nO parser de horário aceita uma ou duas casas na hora e duas nos minutos, além de aparar espaços nas extremidades. Esse contrato é menor que uma biblioteca geral de datas. Ele não interpreta AM/PM, segundos ou uma hora final especial de vinte e quatro como fronteira de dia. Se o formato proprietário aceita valores diferentes, o adaptador precisa traduzi-los conscientemente. Um cast para string não implementa essa tradução. Da mesma forma, ordenar strings que não foram normalizadas para HH:MM pode produzir uma ordem de apresentação que não corresponde aos minutos calculados pelo próprio helper.\n\nRotinas que atravessam meia-noite e janelas de sono exigem outra representação. O código do Chronos possui funções de migração e seleção de sleepSchedule e helpers para segmentos semanais. Essas rotinas pertencem ao domínio proprietário. O painel simplificado não deve ser tratado como uma implementação equivalente apenas porque ambos trabalham com start e end. Um intervalo com fim numericamente menor que início pode ter significado legítimo no serviço, mas não ser suportado pela projeção atual. A documentação precisa indicar a fronteira antes de alguém reutilizar o conversor para validar todo o calendário.\n\nAo estender a política temporal, defina exemplos de borda que tornem a divergência observável. Use um instante perto de meia-noite, uma zona diferente e uma rotina com weekday conhecido. Compare o dia selecionado, os blocos incluídos e a classificação past/current/upcoming. A expectativa deve vir da política escolhida, não de chamar o mesmo helper para calcular o esperado. Um teste que constrói fixture e oráculo com a mesma função errada pode passar enquanto conserva a mistura entre UTC e local. O objetivo é separar significado de conveniência de implementação.\n\nA verificação completa de calendário requer os cenários que a aplicação promete suportar. Esta apostila não altera timezone dos aplicativos nem afirma que os dois casos cobrem todas essas situações. Ela fornece os pontos de código e o raciocínio para formular uma mudança coerente. O leitor pode distinguir horário válido no helper, instante corrente e dia escolhido pela projeção, entendendo por que uma UI traduzida ou um timestamp ISO não resolve sozinha a semântica temporal. Esse conhecimento permite modificar o painel sem apresentar uma aritmética local simples como prova de correção de todo o agendamento da família."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst panel = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (panel.toMinutes(\"24:00\"));\nconst expected = null;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst panel = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (panel.minutesNow(new Date(2026,0,1,10,15)));\nconst expected = 615;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "today usa UTC e os helpers de hora e weekday usam calendário local; nomes semelhantes não garantem uma política temporal única."
        },
        {
          "kind": "quebraria",
          "md": "Perto da meia-noite, selecionar data UTC e rotina local pode misturar referências de dias diferentes."
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
          "md": "### toMinutes — ../olympus/src/lib/panels/types.ts\n\nAssinatura observada: `export function toMinutes(hhmm: string): number | null`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: today usa UTC e os helpers de hora e weekday usam calendário local; nomes semelhantes não garantem uma política temporal única. Contraprova ou limite a preservar: Perto da meia-noite, selecionar data UTC e rotina local pode misturar referências de dias diferentes.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/types.ts",
          "symbol": "toMinutes",
          "lines": [
            144,
            144
          ]
        },
        {
          "kind": "prose",
          "md": "### minutesNow — ../olympus/src/lib/panels/types.ts\n\nAssinatura observada: `export function minutesNow(d = new Date()): number`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: today usa UTC e os helpers de hora e weekday usam calendário local; nomes semelhantes não garantem uma política temporal única. Contraprova ou limite a preservar: Perto da meia-noite, selecionar data UTC e rotina local pode misturar referências de dias diferentes.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/types.ts",
          "symbol": "minutesNow",
          "lines": [
            140,
            140
          ]
        }
      ]
    },
    {
      "title": "Rotina, compromissos e foco restante",
      "order": 2,
      "blocks": [
        {
          "kind": "prose",
          "md": "Uma rotina descreve repetição e um compromisso descreve uma ocorrência ou faixa que ocupa o calendário. O painel do Chronos no hub combina ambos para construir a leitura do dia. Essa composição não é o mesmo que reservar espaço no motor proprietário. O parser filtra os compromissos e a rotina, concatena as duas coleções e produz blocos de apresentação. Entender essa escolha ajuda a explicar tanto o que aparece quanto duplicações ou ausências possíveis, sem atribuir ao hub um mecanismo de consolidação que não está presente na função observada.\n\nisToday aceita um compromisso cuja date coincide com today. Também aceita uma entrada semanal com day igual ao weekday quando não há date e uma faixa que começa antes do dia e não terminou. Depois da seleção, o parser ainda exige start e end que pareçam horários reconhecidos. Um mesmo campo chamado start usado como data de faixa pode não passar por essa etapa de horário. Essa tensão de formatos mostra a importância de confrontar o documento real do Chronos, em vez de assumir que todos os formatos descritos pelos comentários chegam com os mesmos campos esperados na projeção.\n\nOs exemplos observam dois limites concretos. Uma fixture com horários vinte e cinco e vinte e seis produz zero blocos, porque o conversor os rejeita. Outra fornece uma rotina do weekday corrente marcada done e exige doneCount um. São chamadas reais com campos sintéticos e oráculos literais. O teste de conclusão observa uma flag declarada, não atividade realizada pela pessoa. Ele também não executa a rotina semanal do aplicativo proprietário ou confirma que a coleção real recebida pelo hub foi sincronizada corretamente. Essa delimitação impede transformar um contador em prova de produtividade ou de integridade do calendário.\n\nA classificação temporal compara os minutos atuais com início e fim. O bloco fica past quando o relógio já alcançou o fim, current quando alcançou o início e upcoming no outro caso. currentId e nextId escolhem o primeiro bloco encontrado na lista ordenada que satisfaz cada estado. Se há sobreposição, essa seleção não resolve o conflito; apenas aponta um dos itens conforme a ordem. Se as strings de horário não são padronizadas, a ordenação por texto pode influenciar a escolha. O painel não deve ser usado como validador de ausência de colisão do domínio.\n\nremainingFocusHours possui uma semântica ainda mais específica. A função calcula quanto resta entre o relógio atual e o fim da jornada, respeitando o início como limite inferior e arredondando uma casa. Ela não subtrai todos os compromissos, sono e indisponibilidades do calendário. Portanto, o rótulo de foco restante representa uma estimativa da faixa de jornada, não horas livres comprovadas para aceitar uma nova tarefa. Um assistente que usa esse número para dizer que existe espaço para um compromisso precisa conservar essa limitação e não tratá-lo como retorno de um solver.\n\nO domínio proprietário contém outras medidas, como ledger de composição, progresso de metas e janelas de sono. buildLedger calcula indicadores a partir de rotina e categorias, enquanto sleepSchedule possui migração e seleção próprias. Esses recursos demonstram que a agenda é mais rica que o view model do hub. A apostila guarda as remissivas sem repetir a implementação inteira de cada algoritmo. Para alterar a política de disponibilidade, deve-se trabalhar no serviço responsável e depois revisar a projeção. Mudar apenas o texto de um número no painel não cria a garantia temporal que o texto sugere.\n\nAo estender a leitura, decida se quer mostrar jornada restante, tempo não ocupado ou espaço elegível para uma tarefa com restrições. São perguntas diferentes e exigem dados diferentes. Acrescente fixtures com sobreposição, rotina e compromisso duplicados, horários inválidos e jornada já encerrada. Verifique o domínio real quando a afirmação for de disponibilidade ou remarcação. Os dois exemplos locais continuam úteis para os limites declarados, mas não substituem esse ensaio. O leitor aprende a localizar a origem de cada número e a modificar o painel sem transformar uma projeção tolerante em uma promessa de que o calendário completo foi resolvido corretamente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst panel = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/types.ts\")).href);\nconst chronos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chronos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chronos.parseDayplanner({commitments:[{date:panel.today(),start:\"25:00\",end:\"26:00\"}]}).blocks.length);\nconst expected = 0;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst chronos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chronos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chronos.parseDayplanner({routine:[{day:new Date().getDay(),start:\"08:00\",end:\"09:00\",done:true}]}).doneCount);\nconst expected = 1;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Foco restante no painel deriva da faixa de jornada; não é um cálculo completo de tempo livre após todas as restrições."
        },
        {
          "kind": "quebraria",
          "md": "Oferecer uma nova tarefa com base apenas em remainingFocusHours pode ignorar compromissos que ocupam o mesmo intervalo."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/chronos.ts",
          "symbol": "parseDayplanner",
          "lines": [
            27,
            27
          ]
        },
        {
          "kind": "prose",
          "md": "### today — ../olympus/src/lib/panels/types.ts\n\nAssinatura observada: `export function today(): string`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Foco restante no painel deriva da faixa de jornada; não é um cálculo completo de tempo livre após todas as restrições. Contraprova ou limite a preservar: Oferecer uma nova tarefa com base apenas em remainingFocusHours pode ignorar compromissos que ocupam o mesmo intervalo.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
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
          "md": "### parseDayplanner — ../olympus/src/lib/panels/chronos.ts\n\nAssinatura observada: `export function parseDayplanner(raw: Record<string, unknown> | null): DayplannerPanel | null`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Foco restante no painel deriva da faixa de jornada; não é um cálculo completo de tempo livre após todas as restrições. Contraprova ou limite a preservar: Oferecer uma nova tarefa com base apenas em remainingFocusHours pode ignorar compromissos que ocupam o mesmo intervalo.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/panels/chronos.ts",
          "symbol": "parseDayplanner",
          "lines": [
            27,
            27
          ]
        }
      ]
    },
    {
      "title": "Ponte de agendamento e recibo de retorno",
      "order": 3,
      "blocks": [
        {
          "kind": "prose",
          "md": "A ponte Kairos→Chronos preserva a propriedade dos domínios por meio de uma solicitação. O Kairos não escreve diretamente o cronograma do Chronos. Ele acrescenta um pedido numa linha user_data com a chave kairos-bridge. O Chronos lê pedidos pendentes, interpreta a intenção e cria um compromisso por seus próprios caminhos. Depois pode marcar a solicitação como scheduled e associar commitmentId. Essa arquitetura separa a intenção de agendar do compromisso efetivamente criado, permitindo que cada aplicativo continue responsável pelas invariantes de seu documento.\n\nBridgeRequest inclui id, taskId, nome do projeto, título, notas, prazo, prioridade, duração sugerida, data de criação e status. O prazo de uma tarefa não é automaticamente um horário reservado. A duração sugerida também não comprova disponibilidade no calendário. O consumidor precisa escolher e validar o compromisso no domínio temporal. A distinção evita que o envio seja apresentado como agendamento concluído. Uma mensagem de sucesso no produtor pode significar apenas que a solicitação entrou na inbox, enquanto o trabalho de aceitação e a associação de retorno ainda estão pendentes no Chronos.\n\nOs exemplos desta seção executam a leitura do registro para recuperar a key do quadro e inspecionam a arquitetura para localizar kairos-bridge. Eles ajudam a distinguir documento de origem e documento de ponte. Não chamam sendToChronos, não criam uma requisição remota e não marcam scheduled. O escopo é local e explícito. Uma prova de integração completa precisaria observar o pedido gravado, a leitura pela identidade correta, o compromisso criado e o recibo correspondente, incluindo o caso em que uma etapa falha depois da anterior ter produzido efeito.\n\nsendToChronos consulta a linha existente, recusa uma tarefa que já possui pedido pending, conserva um subconjunto de pendências e acrescenta a nova solicitação com duração inicial de sessenta minutos. Essa checagem evita parte da repetição no fluxo serial observado. Ela não oferece idempotência concorrente garantida: dois clientes podem ler o mesmo estado antes de gravar. O upsert do documento inteiro também pode disputar com uma marcação realizada pelo consumidor. A palavra ponte não implica fila transacional nem resolução de conflito; o contrato precisa ser avaliado no método de leitura e escrita efetivamente implementado.\n\nNo lado Chronos, fetchPendingRequests devolve lista vazia sem cliente, sessão, dado ou leitura útil. Isso simplifica a UI, mas pode tornar ausência e falha difíceis de distinguir. patchRequest lê o documento, aplica um patch ao id e grava o resultado. markScheduled e dismissRequest são wrappers de estados. O caminho observado não faz uma transação atômica entre criar compromisso no schedule e atualizar a linha de ponte. Um recibo ausente pode significar que o compromisso existe mas a marcação falhou; repetir a operação sem uma política pode criar uma segunda ocorrência.\n\nAo estender o protocolo, defina identidade da solicitação, idempotência, rejeição e significado do recibo. Um pedido dismissed não deve ser interpretado como tarefa concluída. Um commitmentId é uma referência ao resultado, não uma cópia de toda a entidade. Mudanças posteriores na tarefa e no compromisso precisam de uma política: propagar, manter independência ou solicitar nova decisão. A arquitetura atual oferece uma direção útil de propriedade, mas o comportamento de reconciliação não pode ser inventado pela documentação. Cada ampliação exige revisão de produtor, consumidor e mensagens apresentadas nos dois aplicativos.\n\nUm teste real da ponte usa uma conta autorizada, uma tarefa identificável e observação nas duas origens. Inclua envio repetido, rejeição, falha de recibo e alterações concorrentes se quiser afirmar essas garantias. Os programas publicados não executam esse ensaio e não instalam um backend para simular sucesso. Eles tornam rastreável o contrato local e permitem formular os casos que faltam. O leitor pode então modificar a integração com conhecimento, preservando a diferença entre solicitar, aceitar, materializar e confirmar, sem anunciar um agendamento apenas porque a tarefa chegou a uma inbox."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.appById(\"kairos\").dataKey);\nconst expected = \"kairos-board\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus-plan/SUITE-ARCHITECTURE.md\").includes(\"kairos-bridge\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "A solicitação conserva autoridade do Chronos sobre o calendário; pedido persistido e compromisso criado são etapas distintas."
        },
        {
          "kind": "quebraria",
          "md": "Falhar ao gravar o recibo depois de criar o compromisso pode levar uma repetição sem idempotência a criar outra ocorrência."
        },
        {
          "kind": "cite",
          "file": "../chronos-audit/src/lib/bridge/kairosBridge.ts",
          "symbol": "markScheduled",
          "lines": [
            75,
            75
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Ponte Kairos para Chronos\"><title>Ponte Kairos para Chronos</title><desc>Criar compromisso e marcar pedido não formam uma transação demonstrada.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Tarefa</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Pedido pending</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Compromisso</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Recibo scheduled</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Ponte Kairos para Chronos: Criar compromisso e marcar pedido não formam uma transação demonstrada. Fonte: ../chronos-audit/src/lib/bridge/kairosBridge.ts"
        },
        {
          "kind": "cite",
          "file": "../chronos-audit/src/lib/bridge/kairosBridge.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### appById — ../olympus/src/lib/suite/registry.ts\n\nAssinatura observada: `export function appById(id: SuiteAppId): SuiteApp`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: A solicitação conserva autoridade do Chronos sobre o calendário; pedido persistido e compromisso criado são etapas distintas. Contraprova ou limite a preservar: Falhar ao gravar o recibo depois de criar o compromisso pode levar uma repetição sem idempotência a criar outra ocorrência.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/suite/registry.ts",
          "symbol": "appById",
          "lines": [
            123,
            123
          ]
        }
      ]
    }
  ]
};
