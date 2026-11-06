// Pacote Office, reescrita autoral (PLANO.md §R.2) — capítulo 1.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Anatomia dos arquivos Office: pacotes, formatos e metadados";

export const OFFICE_BOOK_01: ContentChapter = {
  title: NODE,
  level: "basico",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Um arquivo Office é um pacote ZIP de partes",
      order: 0,
      blocks: [
        prose([
          "Um arquivo do Office parece uma coisa só: o relatório, a planilha, a apresentação. Por dentro, desde o Office 2007, os formatos `.docx`, `.xlsx` e `.pptx` são **pacotes**: arquivos ZIP que reúnem várias **partes**, quase todas em XML, organizadas segundo o padrão Open XML (ECMA-376, adotado também como ISO/IEC 29500). A extensão é só um rótulo. O que torna o arquivo um ZIP são os primeiros bytes do conteúdo, as letras `PK`. Renomear `reservas.xlsx` para `reservas.zip` e abri-lo no Explorador de Arquivos mostra as partes, e qualquer biblioteca que leia ZIP, em Node, Python, Java ou C#, consegue listá-las sem ter o Office instalado.",
          "",
          "Saber disso muda a maneira de lidar com os arquivos. Um documento que o Word se recusa a abrir por estar corrompido costuma ter a maior parte das partes intactas, e o texto de `word/document.xml` ainda pode ser recuperado à mão. Um relatório gerado por um sistema da empresa não precisa de um Word rodando no servidor: um programa que escreva as partes certas dentro de um ZIP produz um `.docx` válido. E a diferença entre `.xlsx` e `.xlsm` deixa de ser misteriosa: macros ficam em outra parte, e o formato sem a letra `m` não as guarda.",
          "",
          "Duas partes existem em todo pacote, seja qual for o programa. A primeira é **`[Content_Types].xml`**, que diz o tipo de cada parte: é ali que o pacote declara que `/xl/worksheets/sheet1.xml` é uma planilha, e que `/word/styles.xml` guarda estilos. A segunda é **`_rels/.rels`**, a porta de entrada das *relações*: arquivos XML que ligam uma parte a outra por um identificador. A relação raiz aponta para o documento principal, e cada parte principal tem a sua própria lista de relações em uma pasta `_rels` vizinha, como `xl/_rels/workbook.xml.rels`. Imagens, planilhas incorporadas e links ficam fora do XML principal e entram por essas relações.",
          "",
          "Além delas, todo pacote traz `docProps/core.xml` e `docProps/app.xml`: as propriedades do documento, como autor, datas e o programa que o salvou. Elas voltam na última seção do capítulo, porque levam informações que o autor raramente lembra de ter gravado.",
          "",
          "O resto muda conforme o programa. Uma pasta `xl/` guarda o que é da planilha: `xl/workbook.xml` lista as planilhas do arquivo, cada uma em `xl/worksheets/sheetN.xml`; os textos digitados ficam em `xl/sharedStrings.xml`, uma lista em que cada texto aparece uma vez; `xl/styles.xml` guarda os formatos de número, fontes e bordas; `xl/calcChain.xml` registra a ordem em que as fórmulas devem ser recalculadas. Em um documento do Word, o corpo está em `word/document.xml`, os estilos em `word/styles.xml`, as configurações em `word/settings.xml`. Em uma apresentação, cada slide é uma parte em `ppt/slides/`, e o aspecto vem dos **layouts** em `ppt/slideLayouts/` e do **slide mestre** em `ppt/slideMasters/` — o assunto do capítulo de PowerPoint.",
          "",
          "Os exemplos deste livro usam uma notação simples para os resultados. Um bloco `csv` com legenda `Reservas!A1:` traz as células de uma planilha chamada Reservas, a partir da célula A1, separadas por ponto e vírgula e digitadas como uma pessoa as digita no Excel em português. Um bloco `excel` traz uma fórmula ou um valor por linha, no formato `célula: conteúdo`. Um bloco `word` traz um parágrafo por linha, com o estilo entre colchetes. Um bloco `powerpoint` traz um slide por linha, com o layout entre colchetes e os textos dos espaços reservados separados por barras verticais. Nos blocos de resultado, `E2 = 20` é o que a célula E2 mostra; `partes:arquivo` é a lista de partes do ZIP, em ordem alfabética; `parte:arquivo!caminho` é o conteúdo de uma parte; e `contém:` e `não contém:` testam se um trecho aparece ali. Ao seguir o livro, basta digitar o que está nos blocos e usar *Arquivo > Salvar como*; o descompactador faz o resto.",
          "",
          "O primeiro exemplo salva uma planilha pequena de salas e uma soma, um relatório de uma linha de título e uma de texto, e uma apresentação de um slide. Para cada arquivo, o bloco de resultado lista as partes do pacote.",
        ]),
        code("csv", [
          "Sala;Pessoas",
          "Atenas;12",
          "Delfos;8",
        ], "Reservas!A1: duas salas e a quantidade de pessoas"),
        code("excel", [
          "B4: =SOMA(B2:B3)",
          "Salvar como: reservas.xlsx",
        ], "Uma soma, e a planilha salva como Pasta de Trabalho do Excel"),
        code("text", [
          "B4 = 20",
          "partes:reservas.xlsx = [Content_Types].xml | _rels/.rels | docProps/app.xml | docProps/core.xml | xl/_rels/workbook.xml.rels | xl/calcChain.xml | xl/sharedStrings.xml | xl/styles.xml | xl/theme/theme1.xml | xl/workbook.xml | xl/worksheets/sheet1.xml",
          "parte:reservas.xlsx![Content_Types].xml contém: /xl/worksheets/sheet1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml",
          "parte:reservas.xlsx!_rels/.rels contém: Target=\"xl/workbook.xml\"",
        ], "Resultado: as partes do .xlsx"),
        code("word", [
          "[Título 1] Relatório de salas",
          "[Normal] Atenas reservada às 09:00.",
          "Salvar como: relatorio.docx",
        ], "Um título e um parágrafo, salvos como Documento do Word"),
        code("text", [
          "doc:paragrafos = Título 1: Relatório de salas / Normal: Atenas reservada às 09:00.",
          "partes:relatorio.docx = [Content_Types].xml | _rels/.rels | docProps/app.xml | docProps/core.xml | word/_rels/document.xml.rels | word/document.xml | word/fontTable.xml | word/settings.xml | word/styles.xml | word/theme/theme1.xml | word/webSettings.xml",
          "parte:relatorio.docx!word/document.xml contém: <w:t>Atenas reservada às 09:00.</w:t>",
        ], "Resultado: as partes do .docx"),
        code("powerpoint", [
          "Slide [Slide de Título]: Ágora | Relatório mensal",
          "Salvar como: apresentacao.pptx",
        ], "Um slide de título, salvo como Apresentação do PowerPoint"),
        code("text", [
          "slides:todos = 1 [Slide de Título] Ágora; Relatório mensal",
          "partes:apresentacao.pptx contém: ppt/slides/slide1.xml",
          "partes:apresentacao.pptx contém: ppt/slideMasters/slideMaster1.xml",
          "partes:apresentacao.pptx contém: ppt/slideLayouts/slideLayout11.xml",
          "partes:apresentacao.pptx não contém: ppt/slideLayouts/slideLayout12.xml",
          "partes:apresentacao.pptx contém: docProps/thumbnail.jpeg",
        ], "Resultado: as partes do .pptx"),
        prose([
          "A planilha tem onze partes: as duas obrigatórias, as duas de propriedades, as relações da pasta de trabalho, a lista de textos, os estilos, o tema visual, a lista das planilhas e a planilha em si. `xl/calcChain.xml` só existe porque há uma fórmula; sem a soma em B4, ela não apareceria. O `[Content_Types].xml` declara que a parte `sheet1.xml` é uma planilha, e a relação raiz de `_rels/.rels` aponta para `xl/workbook.xml`. O documento do Word também tem onze partes, com os estilos, as configurações, a tabela de fontes e o tema; o texto digitado aparece dentro de uma tag `<w:t>` no corpo do documento.",
          "",
          "A apresentação, com um único slide, traz uma parte de slide, um slide mestre e **onze layouts**, os de um modelo em branco: o slide de título que o exemplo usou é o primeiro deles. Também traz `docProps/thumbnail.jpeg`, a miniatura que o Explorador de Arquivos exibe como prévia. Os layouts não dependem de quantos slides existem: o pacote carrega o catálogo inteiro do modelo, e é por isso que uma apresentação de uma página pesa mais que um documento com a mesma quantidade de texto.",
        ]),
        porque([
          "`.docx`, `.xlsx` e `.pptx` são ZIPs com partes em XML. `[Content_Types].xml` e `_rels/.rels` existem em todos; o resto depende do programa. Saber a estrutura ajuda a recuperar arquivos, a gerar documentos sem o Office e a entender por que um formato guarda o que guarda.",
        ]),
        quebraria([
          "Um aluno recebe de um colega um `relatorio.docx` que o Word diz estar corrompido e desiste, refazendo o texto de memória. Quem sabe que o arquivo é um ZIP o renomearia para `.zip`, abriria `word/document.xml` e copiaria o texto, que costuma estar intacto, em minutos.",
        ]),
      ],
    },
    {
      title: "Dentro de uma planilha: texto, números, datas e fórmulas no XML",
      order: 1,
      blocks: [
        prose([
          "A parte mais reveladora de uma pasta de trabalho é `xl/worksheets/sheet1.xml`, e a razão é que ela mostra o que o Excel realmente guarda em cada célula. A tela exibe texto formatado; o arquivo guarda **três coisas separadas**: o *valor*, a *fórmula* (se houver) e um *índice de estilo* que diz como o valor deve ser exibido. Entender essa separação explica comportamentos que costumam parecer caprichos do programa.",
          "",
          "Cada célula é um elemento `<c>` com a posição no atributo `r`. Um **número** guarda o valor em `<v>`: a célula B2 com 12 vira `<c r=\"B2\"><v>12</v></c>`. Um **texto** não guarda o conteúdo na célula: o atributo `t=\"s\"` indica que o `<v>` é o número de uma entrada em `xl/sharedStrings.xml`, a lista em que cada texto aparece uma vez. Se mil linhas dizem \"Atenas\", o arquivo guarda o texto uma vez e mil referências. Essa é uma das razões por que um `.xlsx` com muito texto repetido fica compacto.",
          "",
          "Uma **data** não é um tipo à parte: é um número, com um estilo que manda exibi-lo como data. A célula com 01/02/2026 guarda `46054`, a quantidade de dias desde o início do calendário do Excel, e o atributo `s=\"1\"` aponta para um estilo cujo formato de número é o de data. A mesma célula com o estilo apagado mostraria `46054`. É por isso que somar ou subtrair datas funciona como aritmética comum, que um intervalo de dias é uma subtração, e que uma data digitada em formato que o Excel não reconhece é guardada como *texto* e não participa de nenhum cálculo. O mesmo vale para moeda e percentual: `R$ 1.234,50` é o número 1234.5 com um estilo cujo formato de número tem o símbolo.",
          "",
          "O formato de número em si fica em `xl/styles.xml`, em um código de formatação. Um detalhe que surpreende: o código é gravado em inglês, com ponto como separador de decimais e vírgula como separador de milhares (`#,##0.00`), mesmo que o Excel que salvou o arquivo mostre `1.234,50`. O arquivo não depende do idioma de quem o criou; a conversão para a vírgula e o ponto locais acontece na hora de exibir.",
          "",
          "A **fórmula** segue a mesma regra. Uma célula com `=SOMA(B2:B3)` guarda `<f>SUM(B2:B3)</f>`: o nome da função em inglês, e o resultado calculado em `<v>`. Quem abre o arquivo em um Excel em inglês vê `SUM`, e em um Excel em português vê `SOMA`, sem que o arquivo mude. O valor guardado ao lado da fórmula é o *resultado em cache*: programas que leem o arquivo sem calcular, como bibliotecas que importam planilhas para análise de dados, lêem esse `<v>`. Se um programa escreveu a fórmula e não gravou o resultado, a célula chega vazia a quem lê sem o Excel.",
          "",
          "As funções mais novas ganham um prefixo. `PROCX`, lançada com o Microsoft 365, é gravada como `_xlfn.XLOOKUP`. O prefixo `_xlfn.` avisa que a função não existe nas versões antigas; um Excel que não a conhece mostra `#NOME?` e o nome com o prefixo no lugar do resultado. Por isso, uma planilha moderna enviada a alguém que usa uma versão antiga pode chegar com erros em células que funcionam no computador de quem a criou.",
          "",
          "O exemplo digita uma tabela de reservas com uma data e um valor em reais, acrescenta uma soma, uma busca e uma conversão da data em texto numérico, e salva o arquivo. Os blocos de resultado mostram, de um lado, o que as células exibem e, do outro, o que o XML guarda.",
        ]),
        code("csv", [
          "Sala;Pessoas;Data;Valor",
          "Atenas;12;01/02/2026;R$ 1.234,50",
          "Delfos;8;15/03/2026;45,9",
        ], "Reservas!A1: textos, números, uma data e valores em reais"),
        code("excel", [
          "F1: =SOMA(B2:B3)",
          "F2: =PROCX(\"Delfos\";A2:A3;B2:B3)",
          "F3: =TEXTO(C2;\"0\")",
          "Salvar como: reservas.xlsx",
        ], "Uma soma, uma busca e a data vista como número"),
        code("text", [
          "C2 = 01/02/2026",
          "D2 = R$ 1.234,50",
          "D3 = 45,9",
          "F1 = 20",
          "F2 = 8",
          "F3 = 46054",
        ], "Resultado: o que as células exibem"),
        code("text", [
          "parte:reservas.xlsx!xl/worksheets/sheet1.xml contém: <c r=\"A2\" t=\"s\"><v>4</v></c>",
          "parte:reservas.xlsx!xl/sharedStrings.xml contém: <si><t>Atenas</t></si>",
          "parte:reservas.xlsx!xl/worksheets/sheet1.xml contém: <c r=\"B2\"><v>12</v></c>",
          "parte:reservas.xlsx!xl/worksheets/sheet1.xml contém: <c r=\"C2\" s=\"1\"><v>46054</v></c>",
          "parte:reservas.xlsx!xl/worksheets/sheet1.xml contém: <c r=\"D2\" s=\"2\"><v>1234.5</v></c>",
          "parte:reservas.xlsx!xl/worksheets/sheet1.xml contém: <c r=\"D3\"><v>45.9</v></c>",
          "parte:reservas.xlsx!xl/worksheets/sheet1.xml contém: <f>SUM(B2:B3)</f><v>20</v>",
          "parte:reservas.xlsx!xl/worksheets/sheet1.xml contém: <f>_xlfn.XLOOKUP(\"Delfos\",A2:A3,B2:B3)</f><v>8</v>",
          "parte:reservas.xlsx!xl/styles.xml contém: <xf numFmtId=\"14\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\" applyNumberFormat=\"1\"/>",
          "parte:reservas.xlsx!xl/styles.xml contém: formatCode=\"&quot;R$&quot;\\ #,##0.00;[Red]\\-&quot;R$&quot;\\ #,##0.00\"",
        ], "Resultado: o que o arquivo guarda"),
        prose([
          "Os números 12 e 1234,5 estão como números, em `<v>`, sem aspas. A data é `46054`, com `s=\"1\"`, e o valor em reais é `1234.5`, com o ponto decimal do XML, com `s=\"2\"`. O `45,9` digitado sem o símbolo não ganhou estilo: é um número comum, exibido com vírgula pela configuração regional. Os nomes de sala estão em `sharedStrings.xml`, e a célula A2 aponta para a quinta entrada da lista, a de índice 4. O índice conta a partir de zero, e as entradas anteriores são os cabeçalhos `Sala`, `Pessoas`, `Data` e `Valor`.",
          "",
          "As duas fórmulas aparecem com os nomes em inglês, `SUM` e `XLOOKUP`, e esta última com o prefixo `_xlfn.`; o resultado em cache vem logo depois. A conversão `TEXTO(C2;\"0\")` devolveu `46054`, o número guardado, o que mostra que a data só se parece com uma data por causa do estilo. No `styles.xml`, o estilo `1` usa o formato de número `14`, o formato de data curta que o Excel traz de fábrica, e o estilo `2` usa um formato personalizado, com o `R$` e o vermelho para negativos, escrito em inglês.",
        ]),
        porque([
          "Uma célula guarda valor, fórmula e estilo separadamente: data é número com formato de data, texto vai para `sharedStrings.xml`, e fórmulas ficam em inglês com o resultado em cache. Funções novas levam o prefixo `_xlfn.` e aparecem como `#NOME?` em versões que não as conhecem.",
        ]),
        quebraria([
          "Uma empresa envia a uma filial, que usa um Excel de 2016, a planilha de preços com `PROCX`. As células de busca chegam com `#NOME?`, e a filial passa semanas lançando preços de uma lista impressa, achando que o arquivo veio quebrado.",
        ]),
      ],
    },
    {
      title: "Formatos de salvamento: o que .xlsx, .xls e .csv guardam e perdem",
      order: 2,
      blocks: [
        prose([
          "A caixa *Salvar como* do Excel oferece mais de vinte formatos, e a escolha define o que sobrevive no arquivo. Para o dia a dia bastam quatro: **`.xlsx`**, o formato padrão, que guarda tudo menos macros; **`.xlsm`**, o mesmo com macros; **`.xls`**, o formato binário de 1997 a 2003, mantido por compatibilidade; e **`.csv`**, texto puro. A diferença entre eles não é detalhe técnico: decide quantas linhas cabem, se as fórmulas sobrevivem e como os acentos chegam ao outro lado.",
          "",
          "O **`.xls`** tem limites do tamanho de uma época em que a memória era cara: 65.536 linhas e 256 colunas por planilha, contra os 1.048.576 de linhas e 16.384 colunas do `.xlsx`. Os limites aparecem quando um arquivo é aberto: uma planilha salva como `.xls` e reaberta passa a funcionar em *modo de compatibilidade*, com o limite antigo. Dados que não cabem são cortados na hora de salvar, e o Excel avisa antes, por meio do verificador de compatibilidade, quando algo se perderia. Funções e recursos recentes, como as matrizes dinâmicas, também não existem no formato antigo. Hoje, o único motivo para salvar em `.xls` é entregar o arquivo a um sistema legado que exija o formato.",
          "",
          "O **`.csv`** (de *comma separated values*) é outro tipo de arquivo. Não é um pacote: é um texto simples, com uma linha para cada linha da planilha e as células separadas por um caractere. Isso o torna o formato de troca de dados mais universal que existe: qualquer sistema lê. E faz dele o formato que mais perde informação. O CSV guarda **apenas a primeira planilha**, **o texto como a célula o exibe** (o valor `1234,5` formatado em reais sai como `R$ 1.234,50`), **nenhuma fórmula** (só o resultado), nenhum estilo, nenhuma cor. Tipos de dados também se perdem: o arquivo é só texto, e quem o abrir decide o que cada coluna significa.",
          "",
          "Dois detalhes do CSV dependem da configuração regional do computador e causam erros de importação entre países. O primeiro é o **separador**: o Excel usa o *separador de listas* do sistema, e como no Brasil a vírgula é o separador decimal, o separador de listas é o ponto e vírgula. Um CSV salvo no Brasil usa `;`, e um CSV de um computador americano usa `,`. Abrir um no ambiente do outro junta tudo em uma só coluna, ou parte números decimais ao meio. O segundo é a **codificação**: o formato \"CSV (separado por vírgulas)\" grava em ANSI, a página de código do Windows, e o formato \"CSV UTF-8\" grava em UTF-8 com uma marca no começo do arquivo, o *BOM*. Um programa que espera UTF-8 e recebe ANSI exibe `Ã` e `Â` no lugar das letras acentuadas; um que recebe o BOM sem esperar pode ler três caracteres estranhos no começo do primeiro cabeçalho.",
          "",
          "A viagem de ida e volta pelo CSV também transforma dados. Um código como `0012` só é preservado se a célula for de texto, o que se faz digitando um apóstrofo antes (`'0012`). O CSV guarda `0012`, mas o Excel, ao abrir o arquivo, vê um número e o converte para `12`: o zero à esquerda se perde na leitura, e não na gravação. O mesmo ocorre com datas, que são reinterpretadas conforme o formato regional, e com números longos, como CPF e telefone, que aparecem em notação científica ou perdem dígitos.",
          "",
          "O exemplo salva uma tabela de reservas com um código de texto em dois CSVs, o padrão e o UTF-8, e em seguida reabre o primeiro. Antes, salva uma planilha como `.xls` e a reabre para ler os limites.",
        ]),
        code("csv", [
          "Código;Sala;Pessoas;Data;Valor",
          "'0012;Ágora;12;01/02/2026;R$ 1.234,50",
          "'0105;Delfos;8;15/03/2026;45,9",
        ], "Reservas!A1: códigos de texto com zero à esquerda e acentos"),
        code("excel", [
          "Salvar como: reservas.csv",
          "Salvar como: reservas-utf8.csv [UTF-8]",
        ], "Dois CSVs: o padrão (ANSI) e o UTF-8"),
        code("text", [
          "texto:reservas.csv = [ANSI]Código;Sala;Pessoas;Data;Valor / 0012;Ágora;12;01/02/2026;R$ 1.234,50 / 0105;Delfos;8;15/03/2026;45,9",
          "texto:reservas-utf8.csv = [BOM]Código;Sala;Pessoas;Data;Valor / 0012;Ágora;12;01/02/2026;R$ 1.234,50 / 0105;Delfos;8;15/03/2026;45,9",
        ], "Resultado: o texto de cada arquivo (as marcas entre colchetes indicam a codificação)"),
        code("excel", [
          "Abrir: reservas.csv",
        ], "O CSV aberto de novo no Excel"),
        code("text", [
          "A1:C3 = Código | Sala | Pessoas / 12 | Ágora | 12 / 105 | Delfos | 8",
          "D2 = 01/02/2026",
          "E2 = R$ 1.234,50",
        ], "Resultado: o que voltou"),
        code("csv", [
          "Sala;Pessoas",
          "Atenas;12",
        ], "Limites!A1: uma planilha qualquer"),
        code("excel", [
          "D1: =LINS(A:A)",
          "E1: =COLS(1:1)",
          "Salvar como: limites.xlsx",
        ], "As dimensões de uma planilha .xlsx"),
        code("text", [
          "D1 = 1048576",
          "E1 = 16384",
        ], "Resultado: limites do .xlsx"),
        code("excel", [
          "Salvar como: limites.xls",
          "Abrir: limites.xls",
          "D1: =LINS(A:A)",
          "E1: =COLS(1:1)",
        ], "O mesmo arquivo salvo como .xls e aberto de novo"),
        code("text", [
          "D1 = 65536",
          "E1 = 256",
        ], "Resultado: limites do .xls"),
        prose([
          "O CSV padrão foi gravado em ANSI, e o UTF-8 trouxe a marca do BOM; o conteúdo das duas versões é o mesmo, com `Ágora` e `Código` acentuados. Em ambos, o código aparece como `0012`, com o zero, e o valor em reais como `R$ 1.234,50`, o texto que a célula exibia, com a vírgula e o ponto brasileiros. Os campos estão separados por `;`.",
          "",
          "Ao reabrir o CSV, a coluna de códigos voltou como `12` e `105`: os zeros foram perdidos na leitura. As datas e os valores em reais foram reconhecidos de novo, porque o Excel que os leu usa as mesmas convenções regionais de quem os gravou — a mesma conversa em um computador com outra configuração daria resultados diferentes. Por fim, os limites: o `.xlsx` tem 1.048.576 linhas e 16.384 colunas, e o `.xls` reaberto, 65.536 e 256.",
        ]),
        porque([
          "Use `.xlsx` para trabalhar, `.csv` só para trocar dados simples e `.xls` apenas quando um sistema exigir. CSV perde fórmulas, formatos e tipos; o separador (`;` no Brasil) e a codificação (UTF-8 com BOM, para acentos) dependem do ambiente, e códigos com zeros à esquerda precisam ser tratados como texto na leitura.",
        ]),
        quebraria([
          "Uma loja exporta o catálogo para CSV e o reimporta no sistema de estoque. Os códigos de barras iniciados em zero voltam sem o zero e passam a bater com outros produtos; ninguém percebe até o inventário mostrar que o café custa o preço de uma caixa de chá.",
        ]),
      ],
    },
    {
      title: "Nomes localizados e metadados que viajam com o arquivo",
      order: 3,
      blocks: [
        prose([
          "O que o Office mostra na tela muda com o idioma da instalação; o que ele grava no arquivo, quase nunca. Esse princípio já apareceu nas fórmulas em inglês e nos formatos de número, e vale também para os **estilos** do Word e os **layouts** do PowerPoint, que têm nomes em português na interface e identificadores estáveis no arquivo. Conhecê-lo evita surpresas ao trocar um documento entre computadores com idiomas diferentes e ao automatizar tarefas.",
          "",
          "No Word, cada estilo tem um *nome* e um *identificador*. O estilo que o usuário brasileiro vê como \"Título 1\" é gravado em `word/styles.xml` com o nome interno `heading 1`, o nome de fábrica em inglês, e um identificador derivado do nome local, sem acentos e sem espaços: `Ttulo1`. O parágrafo do documento aponta para o identificador, em `<w:pStyle w:val=\"Ttulo1\"/>`. Abrir o mesmo arquivo em um Word em inglês exibe \"Heading 1\", porque o programa reconhece o nome interno e usa o nome local do seu idioma; o estilo continua o mesmo, com os mesmos recursos de sumário e navegação. O identificador sem a letra \"í\" é uma curiosidade que só incomoda programas que leem o XML e procuram \"Heading1\", sem saber que o arquivo veio de um Word em português.",
          "",
          "No PowerPoint, os slides não guardam a aparência: guardam o texto e uma **referência ao layout**. O título do slide de título é um *espaço reservado* do tipo `ctrTitle`, e o subtítulo, do tipo `subTitle`. O slide diz \"aqui vai o título\", e o layout, herdado do slide mestre, decide fonte, tamanho e posição. É a razão pela qual mudar o slide mestre muda todos os slides de uma vez, e por que um slide em que o título foi digitado numa caixa de texto qualquer, e não no espaço reservado, não acompanha as mudanças e some do painel de estrutura.",
          "",
          "A segunda metade do capítulo trata do que o arquivo guarda sobre **quem o criou**, e que costuma passar despercebido. `docProps/core.xml` traz o *autor*, o *último a salvar* e as datas de criação e modificação. `docProps/app.xml` traz o programa e a versão. No Excel, `xl/workbook.xml` pode trazer o **caminho absoluto** da pasta onde o arquivo foi salvo pela última vez, como `C:\\Users\\nome\\Documents\\Clientes\\Contrato 2026`, que revela o nome da conta do Windows, a estrutura de pastas e, às vezes, o nome de um cliente. Documentos do Word podem conservar ainda revisões, comentários e versões anteriores de trechos, que não aparecem na tela depois de aceitos, mas continuam no pacote.",
          "",
          "O recurso para limpar tudo isso é o **Inspecionar Documento**, em *Arquivo > Informações > Verificar Problemas*. Ele lista o que foi encontrado, de propriedades pessoais a comentários, e oferece remover cada categoria. É um passo que vale a pena antes de enviar um arquivo a quem está fora da organização, como um cliente, um fornecedor ou um concurso. Remover as informações deixa os campos vazios, e a ação não pode ser desfeita depois do salvamento: convém guardar uma cópia com o original.",
          "",
          "O exemplo cria um documento do Word com títulos em dois níveis e um título de capa, salva uma planilha e uma apresentação, e confere o que cada arquivo guarda. Depois repete o processo com a inspeção do documento, para mostrar o que desaparece.",
        ]),
        code("word", [
          "[Título] Relatório mensal",
          "[Título 1] Reservas",
          "[Título 2] Atenas",
          "[Normal] Reservada às 09:00.",
          "Salvar como: mensal.docx",
        ], "Um documento com capa e dois níveis de título"),
        code("text", [
          "doc:paragrafos = Título: Relatório mensal / Título 1: Reservas / Título 2: Atenas / Normal: Reservada às 09:00.",
          "parte:mensal.docx!word/document.xml contém: <w:pStyle w:val=\"Ttulo\"/>",
          "parte:mensal.docx!word/document.xml contém: <w:pStyle w:val=\"Ttulo1\"/>",
          "parte:mensal.docx!word/document.xml contém: <w:pStyle w:val=\"Ttulo2\"/>",
          "parte:mensal.docx!word/styles.xml contém: w:styleId=\"Ttulo1\"",
          "parte:mensal.docx!word/styles.xml contém: <w:name w:val=\"heading 1\"/>",
          "parte:mensal.docx!word/styles.xml contém: <w:name w:val=\"Title\"/>",
        ], "Resultado: estilos por identificador"),
        code("powerpoint", [
          "Slide [Slide de Título]: Ágora | Relatório mensal",
          "Salvar como: mensal.pptx",
        ], "Um slide de título"),
        code("text", [
          "parte:mensal.pptx!ppt/slides/slide1.xml contém: <p:ph type=\"ctrTitle\"/>",
          "parte:mensal.pptx!ppt/slides/slide1.xml contém: <p:ph type=\"subTitle\" idx=\"1\"/>",
          "parte:mensal.pptx!ppt/slides/slide1.xml contém: <a:t>Ágora</a:t>",
          "parte:mensal.pptx!ppt/slides/slide1.xml não contém: <a:latin",
        ], "Resultado: o slide guarda texto e espaços reservados, não a fonte"),
        code("csv", [
          "Sala;Pessoas",
          "Atenas;12",
          "Tebas;5",
        ], "Reservas!A1: uma planilha pequena"),
        code("excel", [
          "Salvar como: com-metadados.xlsx",
          "Inspecionar documento: remover tudo",
          "Salvar como: sem-metadados.xlsx",
        ], "Salva a planilha, usa o Inspecionar Documento e salva de novo"),
        code("text", [
          "parte:com-metadados.xlsx!docProps/core.xml contém: <dc:creator>",
          "parte:com-metadados.xlsx!docProps/core.xml contém: <cp:lastModifiedBy>",
          "parte:com-metadados.xlsx!xl/workbook.xml contém: <x15ac:absPath url=",
          "parte:com-metadados.xlsx!docProps/app.xml contém: <Application>Microsoft Excel</Application>",
          "parte:sem-metadados.xlsx!docProps/core.xml contém: <dc:creator></dc:creator>",
          "parte:sem-metadados.xlsx!docProps/core.xml contém: <cp:lastModifiedBy></cp:lastModifiedBy>",
          "parte:sem-metadados.xlsx!xl/workbook.xml não contém: absPath",
        ], "Resultado: antes e depois da inspeção"),
        prose([
          "No Word, os três parágrafos de título apontam para `Ttulo`, `Ttulo1` e `Ttulo2`, e `styles.xml` define o `Ttulo1` com o nome de fábrica `heading 1` e o estilo de capa com o nome `Title`. A leitura pelo programa, em português, mostrou os nomes locais. O slide guarda os dois espaços reservados e os textos — nenhuma tag de fonte, nada de `<a:latin>` — e o layout herdado define a aparência.",
          "",
          "A primeira planilha traz o criador, o último a salvar, o caminho absoluto da pasta e o nome do programa. Depois do Inspecionar Documento, o criador e o último a salvar ficaram vazios e o caminho absoluto saiu do `workbook.xml`. O programa continua registrado em `app.xml`, porque o nome do software não é uma informação pessoal. Cada um desses campos aparece no arquivo sem que o autor tenha digitado algo.",
        ]),
        porque([
          "O arquivo guarda nomes e identificadores independentes do idioma (`Ttulo1` com o nome interno `heading 1`, fórmulas em inglês) e, junto, metadados: autor, último a salvar, datas, caminho absoluto. Use o Inspecionar Documento antes de enviar um arquivo a quem está fora da organização, e guarde uma cópia do original.",
        ]),
        quebraria([
          "Uma consultoria envia a proposta comercial em Word a um cliente. No pacote, vão o nome do funcionário que a editou por último, o caminho da pasta do cliente concorrente de onde o modelo foi copiado e comentários de revisão com a margem de negociação. O cliente descobre tudo ao descompactar o arquivo.",
        ]),
      ],
    },
  ],
};

export const OFFICE_BOOK_01_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "beginner",
    promptMd: "Uma colega diz que o `relatorio.docx` que recebeu não abre no Word, mas que o texto precisa ser recuperado hoje. Sabendo como um arquivo do Office é construído, qual é a primeira tentativa mais promissora?",
    choices: [
      "Renomear o arquivo para .zip, abrir word/document.xml e copiar o texto",
      "Salvar o arquivo como .csv para preservar o texto",
      "Abrir o arquivo no Excel, que lê qualquer formato do Office",
      "Reinstalar o Office e tentar abrir o arquivo outra vez",
    ],
    answerKeyMd: "Renomear o arquivo para .zip, abrir word/document.xml e copiar o texto",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "beginner",
    promptMd: "Uma planilha tem uma coluna de datas de reserva. Alguém digitou 31/02/2026 em uma célula, e a soma de dias entre as datas dessa coluna ignora essa linha, sem erro. Usando o que o arquivo guarda para datas, explique o que aconteceu com essa célula e por que as outras funcionam como número.",
    answerKeyMd: "Uma data válida é um número (dias desde o início do calendário do Excel) com um estilo de data; 15/03/2026 é guardado como 46096 com formato de data, por isso permite aritmética. 31/02/2026 não existe, então o Excel não consegue convertê-la: o texto é guardado como texto (em sharedStrings, t=\"s\") e as funções de soma e diferença ignoram ou rejeitam texto. A célula parece uma data, mas é texto; alinhada à esquerda por padrão, e sem efeito nos cálculos.",
    rubricMd: "Explica data como número + estilo; reconhece que uma data inexistente vira texto; relaciona com cálculo que ignora a célula.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "intermediate",
    promptMd: "Um sistema legado só aceita planilhas em CSV. A tabela do Excel tem as colunas Código (texto, como `0012`), Cliente (com acentos) e Valor (R$ 1.234,50). Descreva como salvar o arquivo para que acentos e códigos cheguem ao sistema, e como o Excel precisa tratar o CSV quando alguém o reabrir para conferir.",
    answerKeyMd: "Salvar como \"CSV UTF-8 (delimitado por vírgulas)\", que grava UTF-8 com BOM e preserva os acentos (o CSV padrão grava em ANSI). No Brasil o separador será ponto e vírgula; o sistema precisa esperar ';' e vírgula decimal, ou o valor deve ser exportado em formato neutro. O código 0012 é gravado com o zero no arquivo, mas ao reabrir no Excel ele vira o número 12: para conferir sem perder zeros, importar com Dados > De Texto/CSV definindo a coluna Código como Texto (ou digitar o apóstrofo antes do código). O Valor será gravado como texto formatado (R$ 1.234,50), não como número puro.",
    points: 20,
  },
];

export const OFFICE_BOOK_01_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "O que é um arquivo .docx, .xlsx ou .pptx?", backMd: "Um pacote ZIP de partes em XML (Open XML). [Content_Types].xml e _rels/.rels existem em todos; o resto depende do programa." },
  { nodeTitle: NODE, frontMd: "Como o Excel guarda uma data?", backMd: "Como número (46054 = 01/02/2026) com um estilo de formato de data. Data inexistente vira texto." },
  { nodeTitle: NODE, frontMd: "Em que idioma ficam as fórmulas no arquivo?", backMd: "Em inglês (SOMA vira SUM); funções novas levam o prefixo _xlfn. (PROCX vira _xlfn.XLOOKUP)." },
  { nodeTitle: NODE, frontMd: "O que o CSV perde?", backMd: "Fórmulas, formatos, tipos e planilhas além da primeira; guarda o texto como exibido. Separador (; no Brasil) e codificação (ANSI × UTF-8 com BOM) dependem do ambiente." },
  { nodeTitle: NODE, frontMd: "Como remover autor e caminho antes de enviar um arquivo?", backMd: "Arquivo > Informações > Verificar Problemas > Inspecionar Documento; guarde uma cópia do original antes." },
];
