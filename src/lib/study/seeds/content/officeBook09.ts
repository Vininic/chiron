// Pacote Office, reescrita autoral (PLANO.md §R.2) — capítulo 9.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Word: estilos, sumário, página e tabelas em documentos longos";

export const OFFICE_BOOK_09: ContentChapter = {
  title: NODE,
  level: "intermediario",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Estilos: formatar pelo significado, não pela aparência",
      order: 0,
      blocks: [
        prose([
          "A maneira mais comum de usar o Word, e a que mais trabalho dá, é formatar à mão: selecionar o título, aumentar a fonte, deixar em negrito, mudar a cor; repetir em cada título do documento; e descobrir, no fim, que três ficaram diferentes dos outros. A maneira de evitar esse trabalho é o **estilo**: um conjunto de formatações com nome (fonte, tamanho, espaçamento, recuo, cor) que se aplica a um parágrafo ou a um trecho de texto numa única operação. O estilo `Título 1` não diz \"20 pontos, negrito, azul\": diz \"este parágrafo é um título de primeiro nível\", e o aspecto sai da definição do estilo.",
          "",
          "Essa diferença, entre o **significado** e a **aparência**, é o centro do uso profissional do Word, e traz três consequências. A primeira é a **consistência**: todos os parágrafos com `Título 2` têm a mesma formatação, porque a formatação mora no estilo e não neles. A segunda é a **mudança em bloco**: para trocar o tamanho dos subtítulos de um relatório de 80 páginas, altera-se o estilo `Título 2` uma vez, e todos os subtítulos mudam. A terceira é a **estrutura**: o Word só sabe que um parágrafo é um título se ele tem o estilo de título. O sumário automático, o painel de navegação, a leitura em voz alta e a acessibilidade dependem disso. Um título que é só um texto grande e em negrito, para o Word, é um parágrafo comum.",
          "",
          "Os estilos mais importantes já vêm no documento novo. `Normal` é o estilo do texto corrido; `Título 1`, `Título 2` e `Título 3` são os níveis de títulos; `Título` e `Subtítulo` servem à capa; `Citação`, `Lista com Marcadores` e `Legenda` completam o conjunto básico. Cada um se aplica com um clique na galeria da guia *Página Inicial*, ou com o atalho `Ctrl+Alt+1`, `Ctrl+Alt+2` para os títulos. O painel *Estilos* (`Alt+Ctrl+Shift+S`) lista todos e mostra qual está em uso.",
          "",
          "Os estilos se organizam em **hierarquia**. Cada um é baseado em outro: `Título 2` herda de `Normal` a fonte e o espaçamento, e muda o que lhe é próprio. Alterar a fonte do `Normal` altera, por herança, a fonte de todos os que não a definiram por conta própria, e é assim que se troca o tipo de letra de um documento inteiro numa operação. Para modificar um estilo, o caminho é clicar com o botão direito sobre ele na galeria e escolher *Modificar*, e o ajuste vale para todo o documento.",
          "",
          "O inimigo do estilo é a **formatação direta**, aplicada manualmente sobre um parágrafo: selecionar e mudar o tamanho para 14 pontos. A formatação direta fica gravada no parágrafo e **tem prioridade sobre o estilo**. Se depois o estilo é modificado, o parágrafo com formatação direta *não acompanha* a mudança: continua com os 14 pontos, enquanto os outros mudam. É a origem do documento em que \"um título ficou diferente e ninguém sabe por quê\". O remédio é o comando *Limpar toda a formatação* (`Ctrl+Espaço` limpa a formatação de caracteres), que devolve o parágrafo ao que o estilo define. Quando uma exceção é realmente necessária, o certo é criar outro estilo (por exemplo `Título 2 destacado`) em vez de formatar à mão.",
          "",
          "Outro ponto é o que o nome diz sobre a função. Estilos de título devem ser usados **só para títulos**: aplicar `Título 3` a um parágrafo de texto só porque a aparência agrada polui o sumário e o painel de navegação com frases que não são títulos. Do mesmo modo, deixar espaço entre parágrafos com a tecla Enter (parágrafos vazios) é formatação disfarçada: o espaçamento é uma propriedade do estilo (*espaço antes* e *depois*), e os parágrafos vazios aparecem como itens vazios na leitura em voz alta e atrapalham a diagramação quando o texto muda.",
          "",
          "O exemplo cria um relatório com um título e dois subtítulos, altera o estilo dos subtítulos e mostra o efeito, incluindo o parágrafo que recebeu formatação direta.",
        ]),
        code("word", [
          "[Título 1] Relatório de reservas do trimestre",
          "[Normal] Este relatório resume as reservas feitas entre fevereiro e abril.",
          "[Título 2] Atenas",
          "[Normal] Atenas teve três reservas confirmadas.",
          "[Título 2] Delfos",
          "[Normal] Delfos teve uma reserva pendente.",
        ], "Um título, dois subtítulos e o texto de cada parte"),
        code("text", [
          "doc:tamanhos = Título 1=20 / Normal=11 / Título 2=16 / Normal=11 / Título 2=16 / Normal=11",
        ], "Resultado: o tamanho da fonte de cada parágrafo, vindo do estilo"),
        code("word", [
          "Estilo: Título 2 = tamanho 18; negrito sim",
        ], "O estilo Título 2 é modificado uma única vez"),
        code("text", [
          "doc:tamanhos = Título 1=20 / Normal=11 / Título 2=18 / Normal=11 / Título 2=18 / Normal=11",
        ], "Resultado: os dois subtítulos mudaram juntos"),
        code("word", [
          "Formatar: parágrafo 3 = tamanho 14",
          "Estilo: Título 2 = tamanho 12",
        ], "Um subtítulo recebe formatação direta; depois o estilo muda de novo"),
        code("text", [
          "doc:tamanhos = Título 1=20 / Normal=11 / Título 2=14 / Normal=11 / Título 2=12 / Normal=11",
        ], "Resultado: o parágrafo com formatação direta não acompanhou o estilo"),
        prose([
          "Com os estilos aplicados, o relatório saiu com o título em 20 pontos, os subtítulos em 16 e o texto em 11, tudo definido pelos estilos. Ao modificar o `Título 2` para 18 pontos e negrito, os dois subtítulos mudaram juntos, numa única operação. Em seguida, um deles recebeu 14 pontos à mão. Quando o estilo foi alterado outra vez, para 12 pontos, só o subtítulo sem formatação direta acompanhou: o de Atenas ficou em 14, o de Delfos foi para 12. É o documento em que \"um título ficou diferente\".",
          "",
          "O `Normal` continuou em 11 pontos em todo o texto, e o título, em 20, porque ninguém tocou nos seus estilos. A leitura dos tamanhos por estilo é uma forma rápida de auditar um documento herdado: um parágrafo cujo tamanho não bate com o do seu estilo carrega formatação direta.",
        ]),
        porque([
          "Formate pelo significado: aplique `Título 1`, `Título 2` e `Normal` e mude a aparência modificando o estilo, uma vez. A formatação direta prevalece sobre o estilo e não acompanha as mudanças; use `Limpar toda a formatação` e crie um estilo novo para as exceções.",
        ]),
        quebraria([
          "Um manual de 60 páginas tem os títulos em negrito de 16 pontos, formatados à mão. A direção pede a troca da fonte e da cor da identidade visual: a equipe passa um dia refazendo cada título, três ficam esquecidos, e o manual é impresso com a identidade antiga em três pontos do texto.",
        ]),
      ],
    },
    {
      title: "Sumário e navegação: títulos que o Word entende",
      order: 1,
      blocks: [
        prose([
          "Quem escreve um documento longo precisa de duas coisas que o Word entrega de graça, desde que os estilos de título sejam usados: o **sumário** automático e o **painel de navegação**. O sumário (*Referências > Sumário*) lista os títulos do documento, com os números de página, em um bloco que se constrói sozinho. O painel de navegação (*Exibir > Painel de Navegação*, ou `Ctrl+F`) mostra a estrutura dos títulos ao lado do texto e permite saltar a qualquer parte com um clique, reorganizar seções arrastando títulos e descobrir se algum nível foi pulado.",
          "",
          "O sumário é um **campo**, e a distinção importa. Um campo é uma instrução que o Word executa para produzir um texto: o sumário executa \"liste os parágrafos com os estilos Título 1 a Título 3 e os seus números de página\". O resultado aparece como texto normal, mas é recalculado quando o campo é atualizado. A consequência prática, que surpreende quem começa, é que **o sumário não se atualiza sozinho** enquanto se escreve. Se um capítulo é acrescentado, ou se o texto muda e empurra os títulos para outra página, o sumário continua mostrando a versão anterior até que alguém clique nele e escolha *Atualizar Tabela* (ou selecione tudo e pressione `F9`). O Word oferece atualizar \"somente os números de página\" ou \"a tabela inteira\"; se títulos foram incluídos, renomeados ou removidos, a segunda é a correta. O Word atualiza os campos automaticamente ao imprimir, desde que a opção esteja ligada, mas não ao salvar ou enviar o arquivo.",
          "",
          "A atualização é o último passo de qualquer documento que circula: um sumário desatualizado, com números de página errados ou com um capítulo que nem existe mais, é um erro visível e comum, e indica descuido. A rotina de fechamento de um relatório inclui selecionar tudo, pressionar `F9` e conferir o sumário.",
          "",
          "O sumário aceita configuração. A caixa *Sumário Personalizado* define quantos níveis aparecem (de 1 a 9, em geral 2 ou 3) e se os números de página ficam alinhados à direita, com ou sem pontilhado; entradas feitas de hiperlinks permitem clicar para saltar à seção, algo útil quando o documento é lido na tela ou em PDF. Também se pode incluir no sumário um estilo próprio, como `Título do Anexo`, ou deixar um título de fora usando um estilo parecido com o `Título 1` mas sem nível de estrutura. Os níveis vêm do estilo: o que define se um parágrafo é de nível 1 ou 2 é o *nível de tópico* do estilo, e por isso nada impede que um estilo personalizado apareça no sumário.",
          "",
          "A estrutura de títulos também faz parte da qualidade do documento. Os níveis devem ser **hierárquicos**: um `Título 2` só dentro de um `Título 1`, sem saltar de 1 para 3. Cada título deve ter conteúdo, e um título seguido imediatamente por outro título do mesmo nível sugere um capítulo vazio. Esses mesmos níveis são os que leitores de tela usam para navegar, o que ressurge no capítulo seguinte, na parte de acessibilidade. Um documento bem estruturado se lê pelo sumário e pelo painel de navegação sem precisar de ajuda.",
          "",
          "O exemplo monta um relatório de três páginas, com quebras de página, insere o sumário no início e depois acrescenta uma nova seção. A primeira leitura do sumário mostra o estado antes da atualização, e a segunda, depois dela.",
        ]),
        code("word", [
          "[Título 1] Visão geral",
          "[Normal] Resumo das reservas do ano nas três regionais.",
          "Quebra: página",
          "[Título 1] Atenas",
          "[Título 2] Reservas",
          "[Normal] Reservas confirmadas e pendentes de Atenas.",
          "Quebra: página",
          "[Título 1] Delfos",
          "[Normal] Reservas confirmadas e pendentes de Delfos.",
          "Sumário: no início, níveis 1-2",
        ], "Três páginas, títulos em dois níveis e um sumário no início"),
        code("text", [
          "doc:paginas = 3",
          "doc:sumario = Visão geral ... 1 / Atenas ... 2 / Reservas ... 2 / Delfos ... 3",
        ], "Resultado: o sumário e o número de páginas"),
        code("word", [
          "[Título 1] Tebas",
          "[Título 2] Reservas de Tebas",
        ], "Uma seção nova, acrescentada ao fim do documento"),
        code("text", [
          "doc:sumario = Visão geral ... 1 / Atenas ... 2 / Reservas ... 2 / Delfos ... 3",
        ], "Resultado: o sumário ainda é o antigo"),
        code("word", [
          "Atualizar: campos",
        ], "Selecionar tudo e pressionar F9"),
        code("text", [
          "doc:sumario = Visão geral ... 1 / Atenas ... 2 / Reservas ... 2 / Delfos ... 3 / Tebas ... 3 / Reservas de Tebas ... 3",
        ], "Resultado: depois de atualizar, o sumário inclui Tebas"),
        prose([
          "O primeiro sumário listou os quatro títulos do documento com as páginas em que aparecem: a visão geral na primeira, Atenas e Reservas na segunda e Delfos na terceira. Os pontilhados que o Word desenha entre o título e o número de página estão representados por reticências nos resultados.",
          "",
          "Ao acrescentar a seção de Tebas, com seu subtítulo, o sumário **não mudou**: continuou com os quatro itens da primeira versão, apesar de o documento já ter seis títulos. Só depois de *Atualizar campos* o sumário passou a incluir Tebas e o subtítulo, ambos na terceira página. O texto do sumário é um retrato do momento em que foi atualizado, e a rotina de conferir antes de enviar existe por isso.",
        ]),
        porque([
          "Use `Título 1`, `Título 2` e `Título 3` e o Word monta o sumário e o painel de navegação. O sumário é um campo e não se atualiza sozinho: `Ctrl+A` e `F9` antes de enviar (tabela inteira, se houve mudança de títulos). Mantenha os níveis hierárquicos.",
        ]),
        quebraria([
          "Um edital de 40 páginas é enviado a 200 fornecedores com o sumário da versão anterior: três cláusulas foram incluídas, e os números de página de metade das seções estão errados. Os fornecedores apresentam consultas sobre \"o item 5.3 da página 18\", que na versão real está na página 21, e o prazo de propostas é reaberto.",
        ]),
      ],
    },
    {
      title: "Página, margens, cabeçalhos e rodapés",
      order: 2,
      blocks: [
        prose([
          "O texto de um documento longo vive dentro de uma página, e as propriedades da página (tamanho, margens, cabeçalho, rodapé, numeração) são tão importantes para o resultado final quanto os estilos. Elas ficam na guia *Layout*. Um documento novo, no Word em português, vem configurado para o papel **A4**, com 21 por 29,7 centímetros, e as margens padrão do Word: 2,5 cm em cima e embaixo e 3 cm nas laterais. São números que valem a pena conhecer, porque as normas de trabalhos acadêmicos e os modelos de empresas costumam pedir outros (por exemplo, 3 cm na margem esquerda para encadernar e 2 cm na direita), e a mudança é feita uma vez, para o documento todo.",
          "",
          "O **cabeçalho** e o **rodapé** são áreas repetidas no alto e no pé de cada página, e são o lugar do nome do documento, da data, da classificação de confidencialidade e do número da página. Eles são editados com um duplo clique na área, ou em *Inserir > Cabeçalho*. O conteúdo de uma página não precisa ser reescrito: o que se digita ali aparece em todas. O número de página não é um número digitado: é um **campo**, `PAGE`, que o Word substitui pelo número real em cada página. O campo `NUMPAGES` traz o total de páginas, e a combinação \"Página 1 de 3\" se monta com os dois. Digitar \"1\" no rodapé produziria a mesma numeração em todas as páginas, e esse é um erro frequente.",
          "",
          "O documento pode ser dividido em **seções** (*Layout > Quebras > Próxima Página*), cada uma com suas próprias configurações de página. É o que permite que a capa não tenha numeração e o corpo do documento comece em 1, que um anexo fique na orientação paisagem, ou que cada capítulo tenha um cabeçalho com o seu título. A pegadinha de quem começa a usar seções é o botão **Vincular ao anterior**: por padrão, o cabeçalho de uma seção é igual ao da anterior, e alterar o texto na segunda altera também a primeira. Para um cabeçalho independente, desliga-se o vínculo antes de editar. Uma quebra de seção não é uma quebra de página: ela carrega formatação, e apagá-la faz a seção anterior herdar a formatação da seguinte.",
          "",
          "A numeração tem um segundo detalhe: o número da página pode seguir a contagem física ou reiniciar. Em um documento com capa e sumário, é comum numerar a capa como zero, o sumário em algarismos romanos e o corpo a partir de 1. A opção *Formato do Número de Página* permite o formato (1, i, A) e o reinício por seção. A primeira página pode ainda ter um cabeçalho diferente (*Primeira Página Diferente*), útil para ocultar o timbre depois da capa.",
          "",
          "Os campos do cabeçalho e do rodapé são atualizados pelo Word ao paginar. Aparecem corretos na tela e na impressão, mas arquivos gerados ou lidos por programas, sem o Word paginando, podem trazer o resultado em cache de outro momento (\"Página 1 de 1\" num documento de três páginas), até que os campos sejam atualizados. Não há problema para quem abre no Word, que refaz a paginação; é um cuidado para quem processa documentos por código.",
          "",
          "O exemplo cria um documento de três páginas, confere as dimensões e as margens padrão, altera as margens, e põe um cabeçalho e um rodapé com o número da página e o total.",
        ]),
        code("word", [
          "[Normal] Esta é a primeira página do relatório trimestral.",
          "Quebra: página",
          "[Normal] Esta é a segunda página, com os totais por sala.",
          "Quebra: página",
          "[Normal] Esta é a terceira página, com as conclusões.",
        ], "Três páginas, ainda com a página padrão"),
        code("text", [
          "doc:pagina = 21 cm x 29,7 cm",
          "doc:margens = superior 2,5 cm; inferior 2,5 cm; esquerda 3 cm; direita 3 cm",
          "doc:paginas = 3",
        ], "Resultado: A4 e as margens de um documento novo"),
        code("word", [
          "Margens: superior 2 cm; inferior 2 cm; esquerda 3 cm; direita 2 cm",
          "Cabeçalho: Ágora — relatório trimestral",
          "Rodapé: Página {PAGE} de {NUMPAGES}",
          "Atualizar: campos",
        ], "Margens para encadernação, cabeçalho e rodapé com campos"),
        code("text", [
          "doc:margens = superior 2 cm; inferior 2 cm; esquerda 3 cm; direita 2 cm",
          "doc:cabecalho = Ágora — relatório trimestral",
          "doc:rodape = Página 1 de 3",
        ], "Resultado: as novas margens e o texto das áreas repetidas"),
        prose([
          "Um documento novo saiu como A4 de 21 por 29,7 centímetros, com 2,5 centímetros em cima e embaixo e 3 nas laterais. Depois da alteração, o corpo do texto passou a ter uma margem esquerda de 3 centímetros para a encadernação e 2 nas outras três bordas. O cabeçalho mostra o título em todas as páginas.",
          "",
          "O rodapé mostra \"Página 1 de 3\" na primeira página: o `PAGE` é o número da página em que se está, e o `NUMPAGES`, o total, três, que o Word conta pelas duas quebras de página. Na segunda página o mesmo rodapé mostraria \"Página 2 de 3\", sem nenhuma edição, porque o número é um campo.",
        ]),
        porque([
          "O documento novo é A4 com margens de 2,5 cm (3 cm nas laterais); ajuste em *Layout*. Cabeçalho e rodapé repetem em todas as páginas: o número vem do campo `PAGE` e o total do `NUMPAGES`, nunca digitado. Em seções, atenção ao *Vincular ao anterior*.",
        ]),
        quebraria([
          "Alguém digita o número de cada página no rodapé, à mão, em um relatório de 40 páginas. Um capítulo é acrescentado no meio, os números ficam repetidos e fora de ordem, e o sumário aponta páginas que não correspondem às do rodapé.",
        ]),
      ],
    },
    {
      title: "Tabelas e legendas",
      order: 3,
      blocks: [
        prose([
          "Tabelas aparecem em quase todo relatório, e o Word as trata como um objeto próprio: uma grade de linhas e colunas, cada célula com o seu texto, com estilo, bordas e comportamentos que se configuram a partir da guia *Design da Tabela*. Elas servem para **dados organizados em linhas e colunas**, como as reservas por sala. Não servem para **diagramar a página**: usar uma tabela invisível para colocar duas colunas de texto lado a lado, ou alinhar uma imagem com uma legenda, é um hábito antigo que complica a edição, atrapalha a leitura em voz alta e quebra quando o texto muda. Para colunas de texto, existe o recurso de colunas de página; para posicionar imagens, as opções de quebra automática de texto.",
          "",
          "A criação é simples (*Inserir > Tabela*, escolhendo o número de linhas e colunas), e o que distingue uma tabela bem feita de uma improvisada são alguns detalhes. O primeiro é a **linha de cabeçalho**: a primeira linha deve conter os nomes das colunas, e a opção *Repetir como Linha de Cabeçalho no Início de Cada Página* faz com que, quando a tabela atravessa várias páginas, o cabeçalho reapareça no topo de cada uma. Sem isso, a segunda página mostra números soltos, sem dizer a que coluna pertencem. Essa marcação é também a que informa a tecnologias assistivas qual é a linha de títulos, tema do capítulo seguinte.",
          "",
          "O segundo é o **estilo da tabela**, escolhido na galeria da guia *Design da Tabela*, que define bordas, sombreamento das linhas e o destaque da primeira linha e da primeira coluna. Escolher um estilo e ajustar em vez de formatar célula a célula, pelo mesmo motivo dos estilos de parágrafo, mantém o conjunto consistente e fácil de mudar. O terceiro são as **larguras**: a opção de ajustar automaticamente ao conteúdo ou à janela, em vez de arrastar as bordas, evita tabelas que estouram a margem quando uma célula ganha um texto longo.",
          "",
          "A **legenda** identifica a tabela e permite referenciá-la. Inserida por *Referências > Inserir Legenda*, ela produz um parágrafo com o estilo `Legenda` e um texto como \"Tabela 1: Valor reservado por sala\". O \"1\" não é digitado: é um campo `SEQ`, que numera as tabelas do documento na ordem em que aparecem. Se uma tabela é acrescentada antes das outras, os números se ajustam na próxima atualização dos campos. A legenda de tabelas costuma ficar **acima** da tabela, e a de figuras, **abaixo**. Numerar à mão (\"Tabela 3\") é o erro habitual, e quebra quando o documento é reorganizado.",
          "",
          "O benefício maior vem depois: com legendas feitas pelo recurso, o Word pode gerar uma **lista de tabelas** (*Referências > Inserir Índice de Ilustrações*) e as **referências cruzadas**, textos como \"veja a Tabela 2\" que apontam para a tabela real e se atualizam com a numeração. É o equivalente, para tabelas e figuras, do que o sumário é para os títulos. Uma referência cruzada digitada à mão (\"conforme a tabela da página 12\") fica errada na primeira edição que muda o layout.",
          "",
          "O texto de cada célula é um parágrafo comum, com os mesmos estilos. Por padrão, o texto de uma tabela usa o estilo `Normal`, e há uma boa razão para criar um estilo específico (por exemplo `Texto de Tabela`), com fonte menor e espaçamento reduzido, aplicado a todas as tabelas: o ajuste fica em um lugar. Números costumam ficar alinhados à direita, para que as unidades e as casas decimais se alinhem; o texto, à esquerda.",
          "",
          "O exemplo cria uma tabela com cabeçalho repetido, preenche as células e acrescenta a legenda numerada.",
        ]),
        code("word", [
          "[Normal] Valores reservados no primeiro trimestre:",
          "Tabela: 3 linhas x 2 colunas com cabeçalho repetido",
          "Célula: 1,1 = Sala",
          "Célula: 1,2 = Valor",
          "Célula: 2,1 = Atenas",
          "Célula: 2,2 = 540",
          "Célula: 3,1 = Delfos",
          "Célula: 3,2 = 240",
          "Legenda: Tabela = Valor reservado por sala",
        ], "Uma tabela de três linhas e duas colunas, com legenda acima"),
        code("text", [
          "doc:tabela:1 = Sala | Valor / Atenas | 540 / Delfos | 240",
          "doc:cabecalho-repetido:1 = sim",
          "doc:legendas = Tabela 1: Valor reservado por sala",
          "doc:campos = SEQ Tabela \\* ARABIC => 1",
        ], "Resultado: o conteúdo, o cabeçalho repetido, a legenda e o campo que a numera"),
        prose([
          "A tabela ficou com o cabeçalho na primeira linha, marcado para repetir no início de cada página, e as duas salas nas linhas seguintes. A legenda foi inserida acima, no estilo `Legenda`, com o texto \"Tabela 1: Valor reservado por sala\". O número é o resultado do campo `SEQ Tabela`, que o Word calcula contando as tabelas do documento: uma segunda tabela receberia o número 2, e uma inserida antes passaria a ser a 1, empurrando as demais, sem retoques.",
          "",
          "O parágrafo de abertura, a legenda e as células usam o estilo `Normal` ou `Legenda`: o Word não distingue o texto de uma tabela de outro texto, e a formatação de cada parte vem dos estilos.",
        ]),
        porque([
          "Use tabelas para dados, não para diagramação; marque a primeira linha como cabeçalho repetido; use um estilo de tabela. A legenda numera por campo (`SEQ`) e permite lista de tabelas e referências cruzadas; nunca numere à mão.",
        ]),
        quebraria([
          "Um relatório numera as tabelas à mão: \"Tabela 1\", \"Tabela 2\"... Na revisão, uma tabela nova entra na seção 2. As três seguintes ficam fora de ordem, as referências no texto (\"conforme a Tabela 4\") apontam para os dados errados, e os números só são corrigidos depois que a diretoria perguntou por que a Tabela 4 mostrava a regional errada.",
        ]),
      ],
    },
  ],
};

export const OFFICE_BOOK_09_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "beginner",
    promptMd: "Em um relatório de 30 páginas, todos os subtítulos usam o estilo Título 2. A equipe modifica o estilo para 16 pontos, mas um dos subtítulos continua com 14. Qual é a causa mais provável?",
    choices: [
      "Esse parágrafo recebeu formatação direta de tamanho, que prevalece sobre o estilo",
      "O Word atualiza os estilos apenas na impressão",
      "O estilo não foi salvo no documento",
      "Subtítulos nunca acompanham mudanças de estilo",
    ],
    answerKeyMd: "Esse parágrafo recebeu formatação direta de tamanho, que prevalece sobre o estilo",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "intermediate",
    promptMd: "Um colega enviou um relatório por e-mail. O sumário lista as seções 1 a 5, mas o documento tem 7 seções e os números de página de várias entradas estão errados. Explique por que o sumário ficou assim, como corrigi-lo e que hábito evita que o problema chegue ao destinatário.",
    answerKeyMd: "O sumário é um campo: o Word guarda o resultado da última atualização e não o recalcula sozinho enquanto se edita. As seções 6 e 7 foram acrescentadas depois, e a paginação mudou, mas o campo não foi atualizado. Correção: clicar no sumário e escolher Atualizar Tabela > Atualizar tabela inteira (ou Ctrl+A e F9, que atualiza todos os campos). A tabela inteira é necessária porque títulos foram incluídos; só os números de página não bastaria. Hábito: antes de salvar a versão final (ou de exportar para PDF), selecionar tudo, F9 e conferir o sumário e as referências; ligar a atualização de campos antes de imprimir não protege o envio por e-mail.",
    rubricMd: "Identifica o sumário como campo que não se atualiza sozinho; propõe atualizar a tabela inteira (F9); descreve a conferência antes do envio.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "intermediate",
    promptMd: "Descreva como montar o rodapé \"Página 4 de 12\" de um relatório de modo que o número acompanhe a página e o total se ajuste quando o documento mudar, e como numerar as tabelas \"Tabela 1\", \"Tabela 2\" automaticamente com um texto descritivo. Diga que recursos do Word usar e o que não fazer.",
    answerKeyMd: "Rodapé: abrir o rodapé (duplo clique na área) e inserir os campos, não números digitados: o texto \"Página \", o campo PAGE (Inserir > Número de Página, ou Inserir > Partes Rápidas > Campo), o texto \" de \" e o campo NUMPAGES. Os campos mostram o número real em cada página e o total do documento. Tabelas: selecionar a tabela e usar Referências > Inserir Legenda, com o rótulo \"Tabela\" e o texto descritivo; o Word cria um parágrafo de estilo Legenda com o campo SEQ que numera. Não digitar \"Tabela 1\" nem \"1\" à mão, porque a numeração quebra quando o documento muda; para referenciar a tabela no texto, usar Referências > Referência Cruzada. Atualizar os campos (Ctrl+A, F9) antes de finalizar.",
    points: 20,
  },
];

export const OFFICE_BOOK_09_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Por que usar estilos em vez de formatar à mão?", backMd: "O estilo diz o significado (Título 2) e guarda a aparência num lugar só: muda em bloco, mantém a consistência e alimenta sumário e navegação." },
  { nodeTitle: NODE, frontMd: "O que acontece com um parágrafo que tem formatação direta quando o estilo muda?", backMd: "Não acompanha: a formatação direta prevalece sobre o estilo. Limpar a formatação devolve o parágrafo ao estilo." },
  { nodeTitle: NODE, frontMd: "O sumário se atualiza sozinho?", backMd: "Não: é um campo. Ctrl+A e F9 (tabela inteira, se houve mudança de títulos) antes de enviar." },
  { nodeTitle: NODE, frontMd: "Padrões de página do Word em português", backMd: "A4 (21 × 29,7 cm), margens 2,5 cm em cima e embaixo e 3 cm nas laterais. Número de página = campo PAGE; total = NUMPAGES." },
  { nodeTitle: NODE, frontMd: "Como numerar tabelas e referenciá-las?", backMd: "Referências > Inserir Legenda (campo SEQ) e Referência Cruzada; legenda de tabela acima. Nunca numerar à mão." },
];
