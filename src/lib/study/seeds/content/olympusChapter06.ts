import type { ContentChapter } from "./types";
export const OLYMPUS_CHAPTER_6: ContentChapter = {
  "title": "A gramática visual da família",
  "level": "basico",
  "nodeTitle": "A gramática visual da família",
  "nodeKind": "concept",
  "sections": [
    {
      "title": "Tokens, tinta e acento por aplicativo",
      "order": 0,
      "blocks": [
        {
          "kind": "prose",
          "md": "A identidade compartilhada da suíte combina uma gramática de superfícies com a identidade própria de cada domínio. O plano descreve papel ou parchment, tipografia, bordas e sombras comuns, enquanto tinta e acento distinguem os aplicativos. O hub aparece como uma moldura mais neutra que recebe a cor dos irmãos. Essa organização ajuda o usuário a reconhecer contexto sem reaprender cada controle. Porém, uma intenção de design não é uma garantia de contraste ou de consistência em todos os arquivos copiados. Ela precisa ser confrontada com tokens, componentes e estados reais.\n\nO registro do Olympus separa color, ink e accent. Esses campos não são sinônimos. Uma cor usada para distinguir um painel pode ser mais legível que a tinta profunda da marca; o acento metálico pode ter outra finalidade. No caso observado, a entrada do Kairos usa uma tonalidade rosada em color e uma tinta violeta escura em ink. A documentação histórica que resume o domínio como violeta não basta para escolher qualquer hexadecimal numa superfície pequena. A fonte que governa aquela propriedade e seu consumidor concreto precisam permanecer identificáveis durante a revisão.\n\nalpha centraliza a fórmula dos chips: wash acrescenta 16 e border acrescenta 33 ao hexadecimal recebido, enquanto solid devolve o valor original. Os dois exemplos executam a função real sobre uma cor conhecida e exigem os resultados literais. Eles verificam concatenação e convenção de sufixo, sem renderizar o chip nem medir contraste. O programa não demonstra que o texto fica legível sobre toda superfície. Essa diferença importa porque a facilidade de produzir uma cor translúcida pode esconder o trabalho de avaliar o resultado nas combinações de tema, estado e componente que o usuário verá.\n\nA função também não valida o formato do argumento. Receber uma string chamada hex não transforma uma palavra arbitrária numa cor hexadecimal válida. O contrato tipado aceita string e a implementação concatena sufixos. Quando dados externos passam por essa fronteira, o consumidor deve saber se utiliza apenas valores do registro ou se precisa de validação adicional. A mesma convenção copiada em vários lugares pode divergir com o tempo. Centralizar o helper reduz repetição, mas não corrige automaticamente chamadas feitas com valores inadequados nem arquivos que ainda usam uma versão antiga da fórmula.\n\nDESIGN-REFERENCES.md explica como referências visuais foram traduzidas em linguagem própria, em vez de instalar uma biblioteca inteira para reproduzir um efeito. O documento associa padrões de composer, gráficos e navegação a locais concretos do produto. Ele não torna uma dependência externa obrigatória nem certifica a implementação pelo nome da referência. Uma revisão deve procurar o comportamento que motivou a escolha: texto que cresce, ação visível, dados comparáveis e hierarquia de superfícies. Copiar apenas a aparência de um exemplo pode remover justamente a função que o tornava útil.\n\nAo estender um componente, determine quais tokens representam semântica de domínio e quais representam estado de interação. Vermelho destrutivo não deve ser trocado pela cor de identidade só porque ambos parecem próximos. Foco, seleção, erro e sucesso precisam conservar significado entre aplicativos. Um cartão de irmão deve usar a identidade desse irmão quando essa é a regra do produto, e não o acento do host por conveniência. O checklist histórico registra deriva desse tipo em landings; o erro de cor era também um erro de identificação do proprietário da informação.\n\nO teste de uma mudança visual inclui situações que o helper nativo não observa: contraste, modo escuro, foco de teclado, tamanhos pequenos e movimento. Não é necessário instalar infraestrutura para fingir que esses estados foram validados. É melhor declarar que os exemplos verificam a transformação da cor e indicar quais superfícies exigem inspeção real. Essa honestidade permite reutilizar a gramática da família sem transformar um conjunto de tokens em certificado de acessibilidade, e ajuda a modificar componentes com compreensão das decisões que cada cor e cada superfície expressam."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.alpha(\"#3B6FA0\"));\nconst expected = \"#3B6FA016\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.alpha(\"#3B6FA0\",\"border\"));\nconst expected = \"#3B6FA033\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "color, ink e accent possuem papéis diferentes; alpha implementa uma convenção de concatenação, não uma avaliação visual."
        },
        {
          "kind": "quebraria",
          "md": "Usar o acento do host para todos os irmãos torna difícil identificar a origem de um painel e viola a propriedade semântica da cor."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/SUITE-ARCHITECTURE.md",
          "symbol": "Design system",
          "lines": [
            223,
            223
          ]
        },
        {
          "kind": "prose",
          "md": "### alpha — ../olympus/src/lib/suite/registry.ts\n\nAssinatura observada: `export function alpha(hex: string, level: \"wash\" | \"border\" | \"solid\" = \"wash\"): string`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: color, ink e accent possuem papéis diferentes; alpha implementa uma convenção de concatenação, não uma avaliação visual. Contraprova ou limite a preservar: Usar o acento do host para todos os irmãos torna difícil identificar a origem de um painel e viola a propriedade semântica da cor.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/suite/registry.ts",
          "symbol": "alpha",
          "lines": [
            140,
            140
          ]
        }
      ]
    },
    {
      "title": "Sidebar, topbar e propriedade dos controles",
      "order": 1,
      "blocks": [
        {
          "kind": "prose",
          "md": "A moldura compartilhada distribui decisões de navegação para reduzir a quantidade de lugares onde o usuário procura a mesma operação. SUITE-SHELL.md define uma sidebar com navegação principal, grupos auxiliares, System e identidade na base. A topbar mantém orientação da rota e controles globais de apresentação. Configurações e Sobre possuem superfícies dedicadas. O valor dessa regra está na propriedade da ação: um usuário não precisa investigar dois botões equivalentes para descobrir qual deles altera a configuração correta. A repetição visual de um controle pode indicar uma divisão de responsabilidade mal resolvida.\n\nO documento registra um defeito histórico do Olympus: havia uma engrenagem de configurações na topbar e outra na sidebar. Remover a duplicação foi uma decisão de navegação, não apenas uma limpeza de ícones. O shell também organiza a prioridade entre Home e Chat, que são destinos principais, e Files ou Apps, que dão suporte ao trabalho. AppLayout materializa grupos de navegação e o bloco de conta. O código continua sendo a fonte para descobrir se uma ação abre diálogo, troca de rota ou dispara outro fluxo, especialmente depois de alterações posteriores ao documento.\n\nA implementação local de Topbar aceita onOpenPalette e pode apresentar um botão de busca quando esse callback existe. Isso amplia a lista estrita de três itens do contrato histórico. O comentário do componente ainda descreve uma moldura mínima. Uma auditoria deve registrar essa diferença sem concluir automaticamente que todo controle extra é um bug: o botão de paleta pode ter sido uma decisão posterior, mas sua posição e a existência de alternativas precisam ser avaliadas. O importante é não descrever o arquivo atual como se contivesse somente o desenho antigo, nem atualizar uma regra normativa por inferência silenciosa.\n\nOs exemplos desta seção continuam exercitando alpha em dois limites úteis para a moldura. Solid preserva o hexadecimal; uma palavra arbitrária recebe o sufixo sem validação. Eles ajudam a entender como a apresentação de chips pode consumir os mesmos helpers do registro, mas não testam a organização da navegação. A regra de propriedade dos controles vem da leitura do shell e dos componentes citados. Essa separação evita usar um resultado nativo de string como prova de que desktop, drawer mobile e atalhos apresentam as mesmas ações na prática.\n\nUma sidebar recolhida precisa manter orientação por ícone, nome acessível ou outra alternativa apropriada. O documento pede que a estrutura do drawer mobile espelhe grupos e ordem do desktop. Isso não significa que ambos os caminhos ficam corretos automaticamente quando um array muda. Componentes podem renderizar grupos separadamente, esconder rótulos ou esquecer um diálogo em um breakpoint. Um teste funcional de navegação deve observar cada destino e seu estado ativo, enquanto um teste de acessibilidade verifica foco, nome e alcance por teclado. O livro não declara esses ensaios executados por inspeção do JSX.\n\nAo acrescentar um destino, decida se ele é trabalho principal, apoio, preferência ou identidade. Essa classificação orienta rota, diálogo, posição e comportamento em janela destacada. Uma operação usada somente numa página provavelmente pertence àquela página, não à moldura de todas as rotas. O host também precisa reconhecer superfícies de altura total, como Chat, para evitar scroll e padding duplicados. Copiar o layout sem suas condições cria áreas cortadas ou duas barras de rolagem. A arquitetura de shell inclui essas relações de tamanho e navegação, além de cor e espaçamento.\n\nA extensão está pronta quando cada ação possui um local compreensível, os caminhos equivalentes têm propósito explícito e os diferentes tamanhos de tela conservam a capacidade de encontrar e executar o trabalho. O código pode sustentar essa análise, mas não substitui a interação real. Esta apostila aponta as cópias, as regras e a deriva observada sem redesenhar o produto durante a autoria. O leitor ganha um método para modificar a moldura com conhecimento, distinguindo convenção documentada, implementação presente e verificação efetiva de navegação e acessibilidade."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.alpha(\"#112233\",\"solid\"));\nconst expected = \"#112233\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.alpha(\"red\"));\nconst expected = \"red16\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "A moldura distribui a propriedade das ações; o botão opcional de paleta no código é uma diferença a registrar frente ao contrato histórico."
        },
        {
          "kind": "quebraria",
          "md": "Duplicar configurações em topbar e sidebar cria dois pontos equivalentes que podem divergir em estado ou comportamento."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/SUITE-SHELL.md",
          "symbol": "The contract",
          "lines": [
            4,
            4
          ]
        },
        {
          "kind": "prose",
          "md": "### alpha — ../olympus/src/lib/suite/registry.ts\n\nAssinatura observada: `export function alpha(hex: string, level: \"wash\" | \"border\" | \"solid\" = \"wash\"): string`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: A moldura distribui a propriedade das ações; o botão opcional de paleta no código é uma diferença a registrar frente ao contrato histórico. Contraprova ou limite a preservar: Duplicar configurações em topbar e sidebar cria dois pontos equivalentes que podem divergir em estado ou comportamento.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/suite/registry.ts",
          "symbol": "alpha",
          "lines": [
            140,
            140
          ]
        }
      ]
    },
    {
      "title": "Perfil, preferências e compatibilidade de tema",
      "order": 2,
      "blocks": [
        {
          "kind": "prose",
          "md": "Perfil e preferências parecem próximos na interface, mas não são um único armazenamento. O provider de autenticação mantém uma identidade de sessão; suite-prefs guarda escolhas de produto e alguns dados de apresentação; ThemeProvider conserva espelhos locais que determinam o que aparece no DOM. Alterar um nome ou tema numa dessas camadas não atualiza as outras por magia. A revisão precisa acompanhar qual handler transforma qual objeto e quem observa esse resultado. Essa distinção explica por que o backlog separa implementar o documento compartilhado de conseguir adoção efetiva nos cinco irmãos.\n\nsetAppearance, no serviço puro de preferências, combina os defaults, a aparência atual e o patch recebido. Depois trata a compatibilidade com theme, o campo plano legado. Quando o modo é light ou dark, espelha esse valor no campo antigo. Quando o modo é system, conserva o último theme explícito porque o formato legado não possui uma representação equivalente. O primeiro exemplo publica esse caso com theme dark e mode system. O segundo observa a atualização para light. Os resultados são literais e executam a função real, sem simular provider React ou armazenamento do navegador.\n\nEssa política conserva informação para consumidores antigos, mas não prova que eles a leem. A chave suite.theme do localStorage continua delimitada por origem. Seu nome igual em vários aplicativos não cria compartilhamento entre domínios. O documento suite-prefs remoto pode transportar escolhas para outra origem, desde que cada aplicativo implemente leitura e aplicação coerentes. O backlog registra adoção unilateral como uma pendência daquele marco. A apostila não altera cinco repositórios para transformar a intenção em verdade, nem anuncia que selecionar tema no hub já sincroniza a aparência de toda a família.\n\nThemeProvider do Olympus diferencia mode, skin e density. Ele resolve system pela preferência do sistema, acompanha mudanças de media query e aplica classe dark, atributos de dados e colorScheme à raiz. Também observa eventos storage para certas mudanças entre janelas da mesma origem. Essa estrutura é necessária porque um painel destacado possui outro documento, mesmo quando compartilha o armazenamento do hub. O teste puro de setAppearance não executa nenhuma dessas etapas. Ele comprova a decisão de compatibilidade, deixando resolução de sistema, sincronização de janelas e aplicação visual como fronteiras próprias.\n\nA identidade visual do perfil também possui defaults e preparação. Avatar pode ser monograma, glifo ou imagem, com campos que descrevem o modo escolhido. Um objeto com kind image não demonstra que a imagem foi redimensionada nem que cabe no documento. O tipo descreve a intenção; o caminho de seleção e processamento precisa assegurar as restrições reais. Da mesma forma, setDisplayName recebe uma string e não executa automaticamente uma atualização no serviço de autenticação. Uma tela que combina esses campos deve manter claro o que está apenas local, em preferências ou nos metadados de conta.\n\nAo estender o formato, escolha como leitores antigos devem se comportar. Remover theme imediatamente quebraria compatibilidade; manter dois campos sem regra criaria duas fontes de verdade. Uma migração deve declarar precedência e atualização em cada caminho. Inclua documentos sem appearance, documentos com mode system e documentos com campos inesperados. No nível visual, confira primeira pintura, troca de preferência do sistema e abertura de uma janela destacada. Esses métodos observam propriedades diferentes e não devem ser reunidos sob um único selo de teste de tema porque o serviço puro retornou o objeto esperado.\n\nA conclusão útil é uma cadeia rastreável: ação do usuário, transformação de preferências, persistência prevista, aplicação pelo provider e consumo pelos irmãos que aderiram ao contrato. Onde a cadeia ainda não existe, a documentação precisa indicar a lacuna. Os exemplos publicados tornam verificável a compatibilidade entre modo novo e campo legado, sem certificar sincronização remota ou renderização. Essa delimitação permite alterar aparência e perfil com conhecimento das dependências e evita que uma escolha aparentemente simples na interface apague informação antiga ou prometa propagação para consumidores que continuam independentes."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.setAppearance({meta:{version:2},theme:\"dark\"},{mode:\"system\"}).theme);\nconst expected = \"dark\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.setAppearance(prefs.emptyPrefs(),{mode:\"light\"}).theme);\nconst expected = \"light\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "System não tem equivalente no campo plano legado; conservar a última escolha explícita mantém uma política de compatibilidade."
        },
        {
          "kind": "quebraria",
          "md": "Manter theme e appearance.mode sem precedência definida produz duas fontes de verdade e comportamento diferente entre leitores antigos e novos."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/service.ts",
          "symbol": "setAppearance",
          "lines": [
            21,
            21
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Aparência compatível\"><title>Aparência compatível</title><desc>System conserva última escolha explícita; adoção pelos irmãos não é automática.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Patch de prefs</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Defaults + atual</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Modo novo</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Campo theme legado</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Aparência compatível: System conserva última escolha explícita; adoção pelos irmãos não é automática. Fonte: ../olympus/src/lib/prefs/service.ts"
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/service.ts",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### setAppearance — ../olympus/src/lib/prefs/service.ts\n\nAssinatura observada: `export function setAppearance(prefs: SuitePrefs, patch: Partial<AppearancePrefs>): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: System não tem equivalente no campo plano legado; conservar a última escolha explícita mantém uma política de compatibilidade. Contraprova ou limite a preservar: Manter theme e appearance.mode sem precedência definida produz duas fontes de verdade e comportamento diferente entre leitores antigos e novos.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/service.ts",
          "symbol": "setAppearance",
          "lines": [
            21,
            21
          ]
        },
        {
          "kind": "prose",
          "md": "### emptyPrefs — ../olympus/src/lib/prefs/types.ts\n\nAssinatura observada: `export function emptyPrefs(): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: System não tem equivalente no campo plano legado; conservar a última escolha explícita mantém uma política de compatibilidade. Contraprova ou limite a preservar: Manter theme e appearance.mode sem precedência definida produz duas fontes de verdade e comportamento diferente entre leitores antigos e novos.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
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
      "title": "Movimento, mobile e acessibilidade observável",
      "order": 3,
      "blocks": [
        {
          "kind": "prose",
          "md": "Preferências de movimento e layout responsivo são contratos de comportamento, não apenas campos presentes num objeto. O usuário pode pedir menos animação, usar teclado, ampliar texto ou navegar numa tela estreita. Para que essa escolha tenha efeito, componentes, CSS e bibliotecas gráficas precisam observá-la nos caminhos que realmente executam. Um toggle reduceMotion salvo não demonstra que o canvas interrompeu sua animação. Uma classe hidden abaixo de lg pode evitar aperto visual e ao mesmo tempo remover uma função sem alternativa. A auditoria precisa acompanhar capacidade, não apenas aparência do arquivo.\n\nO plano de shell registra a ausência de fallback mobile para o painel lateral do assistente como uma lacuna compartilhada, e não como um padrão a copiar. Essa distinção é central para uma documentação honesta. Quando um componente usa hidden num breakpoint, a ação que ele contém pode desaparecer. O fluxo principal pode continuar, mas acesso a digest, histórico ou visão geral fica diferente. Uma apostila que chama isso de responsividade completa ensinaria uma limitação como se fosse critério de qualidade. O comportamento atual deve ser descrito sem apagar a melhoria desejada ou declará-la implementada por conveniência.\n\nOs exemplos executam transformações pequenas de preferências. Um grava reduceMotion true no objeto produzido por setAppearance. Outro atualiza hidden preservando a ordem existente em setPanels. Esses resultados mostram como o serviço combina patches e conservam oráculos literais. Não montam a interface, não observam media query e não fazem navegação por teclado. A utilidade está em separar o dado da preferência do efeito. Uma alteração correta no objeto é um pré-requisito possível, mas continua dependendo de consumidores que apliquem a opção ao movimento e à visibilidade apresentados.\n\nTambém existe diferença entre preferência manual e preferência do sistema. Um componente pode observar uma media query e ignorar o toggle do produto, enquanto outro faz o contrário. Uma revisão deve procurar os dois caminhos e definir sua precedência, inclusive na primeira pintura e em mudanças posteriores. O mesmo raciocínio vale para tema system, que só é honesto quando continua acompanhando o sistema em vez de ler uma vez no início. O código de ThemeProvider mostra um listener de preferência de cor; isso não comprova o mesmo tratamento em cada recurso de movimento do aplicativo.\n\nAcessibilidade envolve mais superfícies. Um botão sem texto visível precisa de nome; um diálogo deve devolver foco de forma compreensível; uma indicação de erro não deve depender apenas de cor; uma área com scroll interno precisa continuar alcançável. Usar uma primitive conhecida ajuda a compor esses comportamentos, mas wrappers e props podem quebrá-los. O plano e os exemplos não certificam leitores de tela, contraste ou toda navegação. Para concluir uma verificação dessas, é necessário um método apropriado, com observação dos estados reais, em vez de contar atributos no JSX como se fossem o resultado final.\n\nNo hub, painéis destacáveis introduzem outro contexto de foco e tamanho. O conteúdo aparece sem a moldura principal e pode ter dimensões menores. Um controle que depende da sidebar para orientar a pessoa perde essa referência na janela separada. Fechar a janela, reencontrar o painel e sincronizar preferências são partes do fluxo de uso. Uma boa extensão identifica quais funções devem permanecer acessíveis nesse contexto e quais são deliberadamente deixadas no aplicativo proprietário. O contrato de leitura reduz escopo, mas não elimina a responsabilidade pela interação que o hub realmente oferece.\n\nAo modificar a área, prepare cenários concretos: teclado sem mouse, texto ampliado, largura estreita, modo escuro, movimento reduzido e janela destacada. Registre o que foi observado e o que ficou pendente. Não instale uma infraestrutura apenas para anunciar que um recurso foi validado nem use fixtures locais como prova de experiência completa. Esta seção executa apenas os programas declarados e conserva as lacunas do shell como lacunas. Assim, o leitor pode evoluir a interface sem transformar a presença de uma preferência, uma classe responsiva ou uma primitive em garantia de acessibilidade que ninguém efetivamente verificou."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.setAppearance(prefs.emptyPrefs(),{reduceMotion:true}).appearance.reduceMotion);\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.setPanels({meta:{version:2},panels:{order:[\"kairos-now\"],hidden:[]}},{hidden:[\"chiron-review\"]}).panels);\nconst expected = {\"order\":[\"kairos-now\"],\"hidden\":[\"chiron-review\"]};\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "A preferência é um dado; movimento, visibilidade e acesso precisam de consumidores e observação próprios."
        },
        {
          "kind": "quebraria",
          "md": "Ocultar o trilho do assistente em mobile sem alternativa remove funções e não constitui fallback responsivo completo."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/SUITE-SHELL.md",
          "symbol": "Assistant page",
          "lines": [
            5,
            5
          ]
        },
        {
          "kind": "prose",
          "md": "### emptyPrefs — ../olympus/src/lib/prefs/types.ts\n\nAssinatura observada: `export function emptyPrefs(): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: A preferência é um dado; movimento, visibilidade e acesso precisam de consumidores e observação próprios. Contraprova ou limite a preservar: Ocultar o trilho do assistente em mobile sem alternativa remove funções e não constitui fallback responsivo completo.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
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
          "md": "### setAppearance — ../olympus/src/lib/prefs/service.ts\n\nAssinatura observada: `export function setAppearance(prefs: SuitePrefs, patch: Partial<AppearancePrefs>): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: A preferência é um dado; movimento, visibilidade e acesso precisam de consumidores e observação próprios. Contraprova ou limite a preservar: Ocultar o trilho do assistente em mobile sem alternativa remove funções e não constitui fallback responsivo completo.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/service.ts",
          "symbol": "setAppearance",
          "lines": [
            21,
            21
          ]
        },
        {
          "kind": "prose",
          "md": "### setPanels — ../olympus/src/lib/prefs/service.ts\n\nAssinatura observada: `export function setPanels(prefs: SuitePrefs, patch: Partial<PanelPrefs>): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: A preferência é um dado; movimento, visibilidade e acesso precisam de consumidores e observação próprios. Contraprova ou limite a preservar: Ocultar o trilho do assistente em mobile sem alternativa remove funções e não constitui fallback responsivo completo.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/service.ts",
          "symbol": "setPanels",
          "lines": [
            38,
            38
          ]
        }
      ]
    }
  ]
};
