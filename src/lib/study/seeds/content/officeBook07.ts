// Pacote Office, reescrita autoral (PLANO.md §R.2) — capítulo 7.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Excel: importar, limpar e combinar dados com o Power Query";

// Consultas em M: o texto vai em modelo de string para que a barra invertida
// dos caminhos (C:\Dados\arquivo.csv) fique como o leitor a digita.
const linhas = (texto: string) => texto.split("\n");

export const OFFICE_BOOK_07: ContentChapter = {
  title: NODE,
  level: "avancado",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "O Power Query: uma receita que se repete a cada atualização",
      order: 0,
      blocks: [
        prose([
          "Quase todo relatório começa com dados que não estão prontos: um CSV exportado de um sistema, uma planilha de outra área, várias abas que precisam ser reunidas. A resposta tradicional é a limpeza manual: abrir o arquivo, apagar colunas, corrigir os tipos, copiar e colar. O trabalho funciona uma vez; no mês seguinte, com um arquivo novo no mesmo formato, é preciso repetir tudo, e cada repetição é uma chance de esquecer um passo. O **Power Query** (*Dados > Obter Dados*) resolve esse problema com uma ideia simples: em vez de *fazer* a limpeza, o usuário *descreve* a limpeza, e o Excel a refaz sozinho sempre que os dados mudam.",
          "",
          "O Power Query é um ambiente de **ETL** (*extrair, transformar, carregar*) embutido no Excel. A *extração* lê uma fonte: um arquivo de texto ou CSV, outra pasta de trabalho, uma pasta inteira de arquivos, uma tabela da própria planilha, um banco de dados, uma página da web. A *transformação* aplica uma sequência de passos: filtrar linhas, mudar tipos, remover colunas, combinar fontes. O *carregamento* entrega o resultado numa tabela da planilha, no modelo de dados ou como uma simples conexão. A sequência de passos é a **consulta**, e fica guardada na pasta de trabalho. *Dados > Atualizar Tudo* executa de novo todos os passos sobre a versão atual da fonte.",
          "",
          "Cada passo que o usuário dá no **Editor do Power Query** (aberto por *Transformar Dados*) aparece na lista de **Etapas Aplicadas**, à direita, e cada etapa é uma linha de código na linguagem **M**. A consulta inteira é uma expressão `let ... in ...`: no `let`, cada etapa tem um nome e usa o resultado da anterior; no `in`, indica-se qual etapa é o resultado final. Quem nunca escreveu M lê com facilidade, porque as etapas têm nomes que dizem o que fazem (`Tipos`, `Agrupado`) e cada função começa por `Table.` ou `List.` ou `Text.`, seguida do que faz. O editor escreve o M sozinho enquanto se clica, e é possível abri-lo e ajustá-lo à mão em *Editor Avançado*, o que este capítulo faz, porque o código é a forma mais direta de mostrar o que cada passo faz.",
          "",
          "Uma consulta é uma receita e não uma cópia dos dados, e isso muda o modo de trabalhar. **Nunca se edita o resultado carregado**: a tabela de saída é recriada a cada atualização, e qualquer correção digitada nela se perde. A correção entra na consulta (como um passo novo) ou na fonte. Em compensação, a receita é auditável: as etapas mostram o que foi feito, na ordem, e uma etapa pode ser desativada, movida ou removida sem apagar as demais. Quando alguém herda o arquivo, não precisa adivinhar como os números chegaram até ali.",
          "",
          "A primeira consulta do capítulo parte da própria planilha. A fonte é uma Tabela do Excel, que o M encontra por nome com `Excel.CurrentWorkbook()`. A consulta converte os tipos das colunas e agrupa as reservas por sala, somando os valores e contando as linhas, e o resultado é carregado numa tabela de uma planilha de resumo. Depois, um valor da Tabela é alterado e a consulta é atualizada: o resumo mostra o valor novo, sem nenhuma edição no resumo.",
          "",
          "Duas informações práticas sobre o carregamento. A tabela que o Power Query cria tem um nome próprio (do tipo `Tabela_DadosExternos_1`) e não deve ser editada à mão. E o resultado só reflete a fonte **depois da atualização**: abrir o arquivo não atualiza as consultas, a menos que a opção *Atualizar dados ao abrir o arquivo* esteja ligada nas propriedades da conexão. Um relatório entregue com os dados de ontem, por esquecimento, é o erro mais comum de quem começa a usar a ferramenta.",
        ]),
        code("csv", [
          "Sala;Pessoas;Valor",
          "Atenas;12;540",
          "Delfos;8;240",
          "Tebas;25;750",
          "Atenas;5;225",
        ], "Reservas!A1: quatro reservas"),
        code("excel", [
          "Tabela: Reservas = A1:C5",
        ], "A lista vira uma Tabela, que o Power Query encontra pelo nome"),
        code("m", linhas(`let
    Origem = Excel.CurrentWorkbook(){[Name="Reservas"]}[Content],
    Tipos = Table.TransformColumnTypes(Origem, {{"Pessoas", Int64.Type}, {"Valor", Int64.Type}}),
    Agrupado = Table.Group(Tipos, {"Sala"}, {{"Total", each List.Sum([Valor]), Int64.Type}, {"Quantidade", each Table.RowCount(_), Int64.Type}})
in
    Agrupado`), "Consulta Resumo → Resumo!A1: o total e a quantidade de reservas por sala"),
        code("text", [
          "Resumo!A1:C4 = Sala | Total | Quantidade / Atenas | 765 | 2 / Delfos | 240 | 1 / Tebas | 750 | 1",
        ], "Resultado: o resumo carregado na planilha"),
        code("excel", [
          "Reservas!C2: 1000",
          "Atualizar: tudo",
        ], "Um valor da Tabela muda e as consultas são atualizadas"),
        code("text", [
          "Resumo!A1:C4 = Sala | Total | Quantidade / Atenas | 1225 | 2 / Delfos | 240 | 1 / Tebas | 750 | 1",
        ], "Resultado: o resumo acompanhou a fonte"),
        prose([
          "A primeira linha do `let` pegou a Tabela `Reservas` pelo nome; a segunda converteu `Pessoas` e `Valor` em números inteiros; a terceira agrupou por sala. O resultado é a tabela de três colunas que o Excel carregou em `Resumo`: Atenas, com duas reservas, soma 765. Depois da alteração do valor na primeira linha da Tabela e do *Atualizar Tudo*, a soma de Atenas passou a 1.225 sem que nada fosse feito na planilha de resumo.",
          "",
          "A mesma receita serviria, sem mudança, para uma Tabela com mil linhas ou para o arquivo do mês seguinte: o que muda é a fonte, e a consulta continua valendo enquanto os nomes das colunas forem os mesmos.",
        ]),
        porque([
          "O Power Query guarda uma receita (etapas em M) e não os dados limpos: *Atualizar Tudo* a refaz sobre a fonte atual. Nunca edite a tabela de saída; corrija na consulta ou na fonte. Lembre que a atualização é um ato e que os nomes de colunas fazem parte do contrato com a fonte.",
        ]),
        quebraria([
          "Um analista corrige à mão alguns valores na tabela carregada pelo Power Query, \"só desta vez\". No dia seguinte, o relatório é atualizado, as correções desaparecem e os números voltam aos que o sistema de origem tinha, sem que o autor tenha sido avisado.",
        ]),
      ],
    },
    {
      title: "Importar um CSV sem estragar números e datas: delimitador, codificação e cultura",
      order: 1,
      blocks: [
        prose([
          "O CSV é o formato de troca mais comum, e importá-lo corretamente é a tarefa em que o Power Query mais ajuda. O capítulo 1 mostrou o que o CSV carrega e o que perde: é só texto, e quem o lê decide o que cada coluna significa. A importação precisa, portanto, de três decisões que o arquivo não informa: o **delimitador** (vírgula, ponto e vírgula, tabulação), a **codificação** (como os acentos foram gravados) e a **cultura** (como números e datas foram escritos). Acertar as duas primeiras evita colunas coladas e letras trocadas por símbolos. Acertar a terceira é o que impede os erros que não aparecem.",
          "",
          "Em M, a leitura é `Csv.Document(File.Contents(caminho), [Delimiter = \";\", Encoding = 65001])`, em que `65001` é a codificação UTF-8 (e `1252`, o ANSI do Windows). O resultado ainda não tem cabeçalhos: todas as colunas se chamam `Column1`, `Column2` e a primeira linha é um registro como outro qualquer. `Table.PromoteHeaders` eleva essa linha a cabeçalho. Nesse ponto, todas as colunas são **texto**, e é o passo seguinte, a conversão de tipos, que decide se `1.234,50` vira o número 1234,5 ou um erro.",
          "",
          "A conversão é feita por `Table.TransformColumnTypes(tabela; {{\"coluna\"; tipo}; ...}; cultura)`, e o último argumento, a **cultura**, é o ponto central. Sem ele, o Power Query usa a configuração regional do computador de quem atualiza a consulta, o que parece conveniente e esconde um risco: o mesmo arquivo, aberto em um computador com outra configuração, produz outros números. Escrever a cultura na consulta (`\"pt-BR\"`, `\"en-US\"`) torna o resultado independente de onde ela é atualizada. A regra é conhecer a cultura *do arquivo*, e não a do computador, e dizê-la.",
          "",
          "Os efeitos de errar a cultura são piores do que um erro visível. Com os dados do exemplo abaixo, escritos no padrão brasileiro (`1.234,50`, `45,90`, `01/02/2026`), a conversão com a cultura `en-US` produz: o valor `1.234,50`, que não é número nessa cultura, vira **erro** (a célula chega vazia à planilha); `45,90`, em que a vírgula é separador de milhares, vira **4590**, sem nenhum aviso; `750,00` vira **75000**; a data `15/03/2026`, sem mês 15, vira erro, e `01/02/2026` vira **2 de janeiro**. Um número com a ordem de grandeza errada e uma data com os dois primeiros campos trocados passam por válidos num relatório, e só alguém que conheça os valores esperados percebe.",
          "",
          "O inverso vale para arquivos de sistemas estrangeiros: um CSV americano (`1,234.50`, `01/02/2026` como 2 de fevereiro) convertido com `pt-BR` dá resultados igualmente enganosos. No editor, o comando equivalente está em *Tipo de Dados > Usando Localidade*, que abre uma janela com o tipo e a cultura. Vale usá-lo sempre que a fonte não for do mesmo país do usuário, e também nas fontes locais, para o caso de o relatório ser atualizado em outra máquina.",
          "",
          "Há ainda os cuidados com os cabeçalhos e com as colunas que o sistema de origem acrescenta. Se a consulta nomeia colunas (`\"Pessoas\"`, `\"Valor\"`), uma mudança de nome na fonte quebra a atualização com um erro de coluna não encontrada. É um erro útil: avisa que o contrato com a fonte mudou, em vez de continuar a produzir números sobre dados que mudaram de sentido.",
          "",
          "O exemplo cria o arquivo `reservas.csv`, no padrão brasileiro, e o importa três vezes: com a cultura `pt-BR`, com `en-US` e sem cultura.",
        ]),
        code("text", [
          "Sala;Pessoas;Data;Valor",
          "Atenas;12;01/02/2026;1.234,50",
          "Delfos;8;15/03/2026;45,90",
          "Tebas;25;10/04/2026;750,00",
        ], "Arquivo reservas.csv: um CSV no padrão brasileiro, com ponto e vírgula"),
        code("m", linhas(`let
    Origem = Csv.Document(File.Contents("C:\\Dados\\reservas.csv"), [Delimiter = ";", Encoding = 65001]),
    Cabecalhos = Table.PromoteHeaders(Origem, [PromoteAllScalars = true]),
    Tipos = Table.TransformColumnTypes(Cabecalhos, {{"Pessoas", Int64.Type}, {"Data", type date}, {"Valor", type number}}, "pt-BR")
in
    Tipos`), "Consulta Brasil → Saida!A1: com a cultura do arquivo"),
        code("m", linhas(`let
    Origem = Csv.Document(File.Contents("C:\\Dados\\reservas.csv"), [Delimiter = ";", Encoding = 65001]),
    Cabecalhos = Table.PromoteHeaders(Origem, [PromoteAllScalars = true]),
    Tipos = Table.TransformColumnTypes(Cabecalhos, {{"Pessoas", Int64.Type}, {"Data", type date}, {"Valor", type number}}, "en-US")
in
    Tipos`), "Consulta Americana → Saida!G1: a mesma consulta, com a cultura errada"),
        code("m", linhas(`let
    Origem = Csv.Document(File.Contents("C:\\Dados\\reservas.csv"), [Delimiter = ";", Encoding = 65001]),
    Cabecalhos = Table.PromoteHeaders(Origem, [PromoteAllScalars = true]),
    Tipos = Table.TransformColumnTypes(Cabecalhos, {{"Pessoas", Int64.Type}, {"Data", type date}, {"Valor", type number}})
in
    Tipos`), "Consulta Local → Saida!M1: sem dizer a cultura"),
        code("text", [
          "Saida!A1:D4 = Sala | Pessoas | Data | Valor / Atenas | 12 | 01/02/2026 | 1234,5 / Delfos | 8 | 15/03/2026 | 45,9 / Tebas | 25 | 10/04/2026 | 750",
          "Saida!G1:J4 = Sala | Pessoas | Data | Valor / Atenas | 12 | 02/01/2026 |  / Delfos | 8 |  | 4590 / Tebas | 25 | 04/10/2026 | 75000",
          "Saida!M1:P4 = Sala | Pessoas | Data | Valor / Atenas | 12 | 01/02/2026 | 1234,5 / Delfos | 8 | 15/03/2026 | 45,9 / Tebas | 25 | 10/04/2026 | 750",
        ], "Resultado: três importações do mesmo arquivo"),
        prose([
          "Com a cultura do arquivo, `pt-BR`, a primeira importação trouxe `1234,5`, `45,9` e `750`, e as datas como foram escritas. Com `en-US`, a segunda trouxe **células vazias** onde havia erro (o valor de Atenas e a data de Delfos), **4590** no lugar de 45,90 e **75000** no lugar de 750, e as datas de 1º de fevereiro e de 10 de abril viraram 2 de janeiro e 4 de outubro. Dos doze campos, seis estão errados e nenhum avisa.",
          "",
          "A terceira importação, sem cultura, coincidiu com a primeira, porque o computador está configurado para o Brasil. É exatamente o resultado que engana: a consulta \"funciona\" em quem a escreveu e produz o resultado da segunda em quem a atualizar em um computador configurado para outro país.",
        ]),
        porque([
          "Em CSV, diga o delimitador, a codificação (65001 para UTF-8) e, principalmente, a cultura dos números e das datas (`\"pt-BR\"`) em `Table.TransformColumnTypes`. A cultura errada devolve números fora de escala e datas com mês e dia trocados, sem erro visível; sem cultura, o resultado depende do computador que atualiza.",
        ]),
        quebraria([
          "Uma consulta sem cultura funciona no computador do analista, no Brasil. A matriz, nos Estados Unidos, atualiza o mesmo arquivo: os valores de venda aparecem cem vezes maiores e as datas de março viram erro. O consolidado global do trimestre é apresentado ao conselho com receita inflada em 9.900%.",
        ]),
      ],
    },
    {
      title: "Limpar: aparar espaços, remover repetidos e vazios, preencher",
      order: 2,
      blocks: [
        prose([
          "Os dados que chegam de fora trazem os defeitos que o capítulo 5 mostrou, em outro cenário: espaços sobrando que fazem \"Atenas\" e \"Atenas \" serem categorias diferentes, linhas repetidas, valores em branco, campos sem preenchimento. A limpeza manual dessas falhas é um dos trabalhos mais repetitivos de quem prepara relatórios, e é o que o Power Query faz melhor, porque cada correção vira um passo que se repete a cada atualização, sem que o usuário precise lembrar dele.",
          "",
          "Quatro funções de M cobrem a maior parte da limpeza. **`Table.TransformColumns`** aplica uma função a uma coluna inteira; com `Text.Trim`, remove os espaços do início e do fim de cada texto. Uma diferença importante em relação ao `ARRUMAR` do Excel: o `Text.Trim` do Power Query remove também o **espaço inseparável** (caractere 160), o que o `ARRUMAR` não faz. Dados de páginas da web, que traziam o problema do capítulo 5, ficam limpos por um único passo. **`Table.SelectRows(tabela; each condição)`** mantém só as linhas que atendem à condição; `each [Valor] <> null` descarta as linhas sem valor. **`Table.Distinct`** remove as linhas totalmente iguais. **`Table.ReplaceValue`** troca um valor por outro em colunas escolhidas.",
          "",
          "A ordem dos passos importa, e erros de ordem produzem resultados difíceis de perceber. Aparar os espaços **antes** de remover as repetições faz com que `\"Atenas \"` e `\"Atenas\"`, depois de limpas, se tornem a mesma linha e sejam reduzidas a uma. Converter os tipos **antes** de filtrar por valor permite comparar números com números. Remover as linhas sem valor **depois** de converter, porque a conversão é que transforma o texto vazio em `null`. Se a ordem é a inversa, a linha de valor vazio escapa do filtro como um texto vazio, e a repetição que só existia pelos espaços permanece.",
          "",
          "O vazio tem duas faces no Power Query. Um campo sem valor num CSV chega como **texto vazio** (`\"\"`), e não como `null`; só depois de convertido para número o campo vira `null`. Por isso, `Table.ReplaceValue(tabela; null; \"(sem responsável)\"; ...)` não substitui nada na coluna de texto, e o que funciona é trocar o texto vazio, `\"\"`. É um detalhe que custa uma tarde a quem não o conhece: a substituição \"não faz nada\" porque procura um valor que não existe.",
          "",
          "Duas decisões de método. A primeira é **limpar o mínimo necessário**: cada passo de limpeza é uma suposição sobre os dados, e suposições erradas apagam informação. Remover as linhas sem valor pode ser correto num relatório de vendas e errado num controle de pendências, em que a linha sem valor é justamente o que interessa. A segunda é **guardar a fonte intacta** e fazer toda a limpeza na consulta: assim a mesma fonte pode alimentar relatórios com regras diferentes, e a limpeza pode ser revisada sem reimportar nada.",
          "",
          "O exemplo traz um arquivo de vendas sujo de cinco maneiras: espaço no começo, espaço no fim, espaço inseparável, linha repetida e campos vazios. Quatro consultas mostram a diferença entre importar o arquivo como veio, apará-lo, e fazer a limpeza completa.",
        ]),
        code("text", [
          "Sala;Responsável;Valor",
          "Atenas ;Ana;100,00",
          " Delfos;Bia;200,00",
          "Atenas;Ana;100,00",
          "Tebas;;300,00",
          "Tebas;Caio;",
          "Atenas\u00a0;Ana;50,00",
        ], "Arquivo vendas.csv: espaços sobrando, uma linha repetida, campos vazios; a última linha termina em espaço inseparável"),
        code("m", linhas(`let
    Origem = Csv.Document(File.Contents("C:\\Dados\\vendas.csv"), [Delimiter = ";", Encoding = 65001]),
    Cabecalhos = Table.PromoteHeaders(Origem, [PromoteAllScalars = true]),
    Tipos = Table.TransformColumnTypes(Cabecalhos, {{"Valor", type number}}, "pt-BR"),
    Agrupado = Table.Group(Tipos, {"Sala"}, {{"Total", each List.Sum([Valor]), type number}})
in
    Agrupado`), "Consulta Bruto → Saida!K1: o total por sala, sem limpar"),
        code("m", linhas(`let
    Origem = Csv.Document(File.Contents("C:\\Dados\\vendas.csv"), [Delimiter = ";", Encoding = 65001]),
    Cabecalhos = Table.PromoteHeaders(Origem, [PromoteAllScalars = true]),
    Tipos = Table.TransformColumnTypes(Cabecalhos, {{"Valor", type number}}, "pt-BR"),
    Aparado = Table.TransformColumns(Tipos, {{"Sala", Text.Trim, type text}}),
    Agrupado = Table.Group(Aparado, {"Sala"}, {{"Total", each List.Sum([Valor]), type number}})
in
    Agrupado`), "Consulta Aparado → Saida!G1: o mesmo total, com Text.Trim na sala"),
        code("m", linhas(`let
    Origem = Csv.Document(File.Contents("C:\\Dados\\vendas.csv"), [Delimiter = ";", Encoding = 65001]),
    Cabecalhos = Table.PromoteHeaders(Origem, [PromoteAllScalars = true]),
    Aparado = Table.TransformColumns(Cabecalhos, {{"Sala", Text.Trim, type text}}),
    Tipos = Table.TransformColumnTypes(Aparado, {{"Valor", type number}}, "pt-BR"),
    SemVazios = Table.SelectRows(Tipos, each [Valor] <> null),
    SemRepetidos = Table.Distinct(SemVazios),
    Preenchido = Table.ReplaceValue(SemRepetidos, "", "(sem responsável)", Replacer.ReplaceValue, {"Responsável"})
in
    Preenchido`), "Consulta Limpo → Saida!A1: a limpeza completa"),
        code("excel", [
          "Saida!N1: =CONT.VALORES(K2:K10)",
          "Saida!N2: =CONT.VALORES(G2:G10)",
        ], "Quantas salas cada total enxerga"),
        code("text", [
          "Saida!N1:N2 = 5 / 3",
          "Saida!G1:H4 = Sala | Total / Atenas | 250 / Delfos | 200 / Tebas | 300",
          "Saida!A1:C5 = Sala | Responsável | Valor / Atenas | Ana | 100 / Delfos | Bia | 200 / Tebas | (sem responsável) | 300 / Atenas | Ana | 50",
        ], "Resultado: cinco \"salas\" sem aparar, três com Text.Trim, e a tabela limpa"),
        prose([
          "Sem aparar, o agrupamento enxergou **cinco** salas: a Atenas com espaço no fim, a Atenas sem espaço, a Atenas com espaço inseparável, a Delfos com espaço no começo e a Tebas. Com `Text.Trim`, ficaram três, e o total de Atenas reuniu os 250 que estavam espalhados em três linhas. O espaço inseparável, que o `ARRUMAR` do Excel deixaria passar, foi removido junto com os demais.",
          "",
          "Na limpeza completa, a linha repetida de Atenas com Ana e 100 foi reduzida a uma. A linha de Tebas com Caio, sem valor, foi descartada; a de Tebas sem responsável teve o campo vazio trocado por `(sem responsável)`. A segunda linha de Atenas, com valor 50, permaneceu: não era repetida, só parecia.",
        ]),
        porque([
          "No Power Query, apare (`Text.Trim`, que também tira o espaço inseparável), converta os tipos, descarte as linhas sem valor e remova as repetidas, nessa ordem. Campo vazio de CSV é texto vazio, não `null`: troque `\"\"`. Limpe só o necessário e mantenha a fonte intacta.",
        ]),
        quebraria([
          "Uma consulta remove repetidos antes de aparar os espaços. Os pedidos \"Atenas\" e \"Atenas \" não são iguais para o `Table.Distinct`, a linha duplicada permanece, e o total da sala sai com o pedido contado duas vezes. A diferença só aparece na conciliação com a contabilidade.",
        ]),
      ],
    },
    {
      title: "Combinar fontes: acrescentar, mesclar, desdinamizar e atualizar",
      order: 3,
      blocks: [
        prose([
          "Raramente os dados de um relatório estão num arquivo só. As reservas do mês chegam em um arquivo por filial, o cadastro de salas está em outro, e a planilha de metas tem os meses em colunas. O Power Query tem três operações para combinar e reformatar essas fontes, e conhecê-las evita as soluções artesanais de copiar e colar que quebram a cada mês: **acrescentar**, **mesclar** e **desdinamizar**.",
          "",
          "**Acrescentar** (*Acrescentar Consultas*, `Table.Combine`) empilha tabelas de mesma estrutura, uma sob a outra: as reservas da filial 1 e as da filial 2 viram uma lista só. O cuidado é com os nomes das colunas, que devem coincidir; uma coluna que existe numa tabela e não na outra aparece no resultado com `null` nas linhas da que não a tem. Quando os arquivos mensais ficam numa mesma pasta, a fonte *De Pasta* acrescenta todos de uma vez, e um arquivo novo é incluído sem alterar a consulta.",
          "",
          "**Mesclar** (*Mesclar Consultas*, `Table.NestedJoin`) é o equivalente da busca, em volume: relaciona duas tabelas por uma chave e traz colunas de uma para a outra. É o que a `PROCX` faz em uma célula, feito para a tabela inteira, de uma vez. O tipo de junção decide quem fica: `JoinKind.LeftOuter` mantém todas as linhas da tabela da esquerda, trazendo `null` onde a chave não existe na outra; `JoinKind.Inner` mantém só as linhas com correspondência nos dois lados. A escolha tem conteúdo: uma reserva de uma sala que não está no cadastro é um erro que a junção interna esconde (a linha desaparece) e que a externa expõe (a linha fica, com a sala em branco). Para auditoria, a externa é a mais honesta. A junção devolve a tabela da direita como uma coluna aninhada, que o passo `Table.ExpandTableColumn` abre nas colunas desejadas. Como na `PROCV`, as chaves precisam ter o **mesmo tipo**: um código numérico de um lado e textual do outro não casa, e a consulta produz uma junção vazia, sem erro.",
          "",
          "**Desdinamizar** (*Desdinamizar Colunas*, `Table.UnpivotOtherColumns`) transforma colunas em linhas. Uma tabela de metas com um mês por coluna (`jan`, `fev`, `mar`) é boa de ler e ruim de calcular, filtrar e resumir; desdinamizada, vira uma lista com colunas Sala, Mês e Valor, que se agrupa, se filtra e se alimenta numa tabela dinâmica sem fórmulas especiais. É a operação mais valiosa para quem recebe dados \"formatados para o olho\" e precisa de dados \"formatados para o cálculo\". As células vazias da tabela larga viram linhas com `null` no valor, que as funções de soma ignoram, mas que convém conhecer.",
          "",
          "Os três exemplos mostram também o ganho do conjunto: depois que as consultas estão prontas, **atualizar** custa um clique. Se um arquivo de entrada ganha linhas, o botão *Atualizar Tudo* refaz todas as consultas, na ordem de dependência, e o relatório inteiro se atualiza. Duas consultas podem usar outra como ponto de partida (uma referência a `Reservas`, por exemplo), o que evita ler o mesmo arquivo várias vezes e mantém a limpeza em um lugar só. O limite é a manutenção: consultas encadeadas demais formam um grafo difícil de entender, e convém nomeá-las com clareza e documentar de onde vêm.",
          "",
          "O exemplo reúne dois arquivos de reservas, mescla com o cadastro de salas, de dois modos, e desdinamiza uma tabela de metas. Em seguida, o arquivo de metas ganha uma sala nova e as consultas são atualizadas.",
        ]),
        code("text", [
          "Código;Sala",
          "101;Atenas",
          "102;Delfos",
          "103;Tebas",
        ], "Arquivo salas.csv: o cadastro de salas"),
        code("text", [
          "Reserva;Código;Pessoas",
          "R1;102;8",
          "R2;101;12",
        ], "Arquivo r1.csv: as reservas da filial 1"),
        code("text", [
          "Reserva;Código;Pessoas",
          "R3;103;25",
          "R4;999;4",
        ], "Arquivo r2.csv: as reservas da filial 2, com um código que não está no cadastro"),
        code("m", linhas(`let
    Ler = (arquivo) => Table.PromoteHeaders(Csv.Document(File.Contents("C:\\Dados\\" & arquivo), [Delimiter = ";", Encoding = 65001]), [PromoteAllScalars = true]),
    Juntas = Table.Combine({Ler("r1.csv"), Ler("r2.csv")}),
    Tipos = Table.TransformColumnTypes(Juntas, {{"Pessoas", Int64.Type}, {"Código", Int64.Type}}, "pt-BR")
in
    Tipos`), "Consulta Todas → Saida!A1: as duas filiais empilhadas"),
        code("m", linhas(`let
    Ler = (arquivo) => Table.PromoteHeaders(Csv.Document(File.Contents("C:\\Dados\\" & arquivo), [Delimiter = ";", Encoding = 65001]), [PromoteAllScalars = true]),
    Reservas = Table.TransformColumnTypes(Table.Combine({Ler("r1.csv"), Ler("r2.csv")}), {{"Código", Int64.Type}, {"Pessoas", Int64.Type}}, "pt-BR"),
    Salas = Table.TransformColumnTypes(Ler("salas.csv"), {{"Código", Int64.Type}}, "pt-BR"),
    Juntou = Table.NestedJoin(Reservas, {"Código"}, Salas, {"Código"}, "SalaTabela", JoinKind.LeftOuter),
    Expandido = Table.ExpandTableColumn(Juntou, "SalaTabela", {"Sala"})
in
    Expandido`), "Consulta Completas → Saida!G1: mescla com o cadastro, mantendo todas as reservas"),
        code("m", linhas(`let
    Ler = (arquivo) => Table.PromoteHeaders(Csv.Document(File.Contents("C:\\Dados\\" & arquivo), [Delimiter = ";", Encoding = 65001]), [PromoteAllScalars = true]),
    Reservas = Table.TransformColumnTypes(Table.Combine({Ler("r1.csv"), Ler("r2.csv")}), {{"Código", Int64.Type}, {"Pessoas", Int64.Type}}, "pt-BR"),
    Salas = Table.TransformColumnTypes(Ler("salas.csv"), {{"Código", Int64.Type}}, "pt-BR"),
    Juntou = Table.NestedJoin(Reservas, {"Código"}, Salas, {"Código"}, "SalaTabela", JoinKind.Inner),
    Expandido = Table.ExpandTableColumn(Juntou, "SalaTabela", {"Sala"})
in
    Expandido`), "Consulta ComSala → Saida!M1: a mesma mescla, só com as reservas que têm sala"),
        code("text", [
          "Saida!A1:C5 = Reserva | Código | Pessoas / R1 | 102 | 8 / R2 | 101 | 12 / R3 | 103 | 25 / R4 | 999 | 4",
          "Saida!G1:J5 = Reserva | Código | Pessoas | Sala / R1 | 102 | 8 | Delfos / R2 | 101 | 12 | Atenas / R3 | 103 | 25 | Tebas / R4 | 999 | 4 | ",
          "Saida!M1:P4 = Reserva | Código | Pessoas | Sala / R1 | 102 | 8 | Delfos / R2 | 101 | 12 | Atenas / R3 | 103 | 25 | Tebas",
        ], "Resultado: acrescentar, mesclar (externa) e mesclar (interna)"),
        code("text", [
          "Sala;jan;fev;mar",
          "Atenas;10;20;30",
          "Delfos;5;;15",
        ], "Arquivo metas.csv: uma tabela larga, com os meses nas colunas"),
        code("m", linhas(`let
    Origem = Csv.Document(File.Contents("C:\\Dados\\metas.csv"), [Delimiter = ";", Encoding = 65001]),
    Cabecalhos = Table.PromoteHeaders(Origem, [PromoteAllScalars = true]),
    Longo = Table.UnpivotOtherColumns(Cabecalhos, {"Sala"}, "Mês", "Valor"),
    Tipos = Table.TransformColumnTypes(Longo, {{"Valor", Int64.Type}}, "pt-BR")
in
    Tipos`), "Consulta Longo → Saida!S1: uma linha por sala e mês"),
        code("m", linhas(`let
    Origem = Csv.Document(File.Contents("C:\\Dados\\metas.csv"), [Delimiter = ";", Encoding = 65001]),
    Cabecalhos = Table.PromoteHeaders(Origem, [PromoteAllScalars = true]),
    Longo = Table.UnpivotOtherColumns(Cabecalhos, {"Sala"}, "Mês", "Valor"),
    Tipos = Table.TransformColumnTypes(Longo, {{"Valor", Int64.Type}}, "pt-BR"),
    Agrupado = Table.Group(Tipos, {"Sala"}, {{"Total", each List.Sum([Valor]), type number}})
in
    Agrupado`), "Consulta TotaisMetas → Saida!W1: o total anual por sala"),
        code("text", [
          "Saida!S1:U7 = Sala | Mês | Valor / Atenas | jan | 10 / Atenas | fev | 20 / Atenas | mar | 30 / Delfos | jan | 5 / Delfos | fev |  / Delfos | mar | 15",
          "Saida!W1:X3 = Sala | Total / Atenas | 60 / Delfos | 20",
        ], "Resultado: a tabela larga em formato longo, e os totais"),
        code("text", [
          "Sala;jan;fev;mar",
          "Atenas;10;20;30",
          "Delfos;5;;15",
          "Tebas;1;2;3",
        ], "Arquivo metas.csv: o mesmo arquivo, agora com uma sala a mais"),
        code("excel", [
          "Atualizar: tudo",
        ], "Atualizar Tudo"),
        code("text", [
          "Saida!W1:X4 = Sala | Total / Atenas | 60 / Delfos | 20 / Tebas | 6",
        ], "Resultado: o total anual incluiu a sala nova, sem tocar na consulta"),
        prose([
          "Os dois arquivos das filiais viraram uma lista de quatro reservas. A mescla externa trouxe o nome da sala de três delas e deixou a quarta, `R4`, com o campo em branco: o código 999 não existe no cadastro, e a linha *continua visível* para que alguém investigue. A mescla interna, com os mesmos dados, mostrou só três linhas, e o problema do código 999 sumiu da vista.",
          "",
          "A tabela de metas desdinamizada ganhou seis linhas, uma por sala e mês, com a célula vazia de Delfos em fevereiro como `null`. O total por sala somou 60 para Atenas e 20 para Delfos, ignorando a ausência. Quando o arquivo recebeu uma terceira sala, o *Atualizar Tudo* a incluiu no total sem que a consulta fosse editada.",
        ]),
        porque([
          "Acrescentar empilha tabelas de mesma estrutura; mesclar relaciona por uma chave (externa para expor o que não casa, interna para só o que casa); desdinamizar transforma colunas em linhas para facilitar o cálculo. As chaves devem ter o mesmo tipo, e o Atualizar Tudo reexecuta tudo sobre as fontes novas.",
        ]),
        quebraria([
          "Uma conciliação usa mescla interna entre os pagamentos e o cadastro de fornecedores. Os pagamentos a fornecedores não cadastrados desaparecem do relatório em vez de aparecerem como pendência. O desvio só é detectado meses depois, pela auditoria externa.",
        ]),
      ],
    },
  ],
};

export const OFFICE_BOOK_07_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "intermediate",
    promptMd: "Um colega corrige à mão três valores na tabela que o Power Query carregou numa planilha e salva o arquivo. Na manhã seguinte, o relatório é atualizado com *Atualizar Tudo*. O que acontece com as correções?",
    choices: [
      "Desaparecem: a tabela de saída é recriada pela consulta a partir da fonte",
      "Permanecem, porque o Power Query preserva edições manuais",
      "Viram erros de conflito que o Excel mostra para o colega resolver",
      "Passam a fazer parte da fonte, que é atualizada junto",
    ],
    answerKeyMd: "Desaparecem: a tabela de saída é recriada pela consulta a partir da fonte",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "advanced",
    promptMd: "Uma consulta importa o `vendas.csv` de um sistema brasileiro (ponto e vírgula, vírgula decimal, datas dd/mm/aaaa) sem informar a cultura em `Table.TransformColumnTypes`. Ela funciona no computador do analista, no Brasil. A matriz, nos Estados Unidos, atualiza o mesmo arquivo e obtém valores cem vezes maiores e erros em algumas datas. Explique a causa, descreva três sintomas concretos que a cultura errada produz e como corrigir a consulta.",
    answerKeyMd: "Sem o último argumento, Table.TransformColumnTypes usa a configuração regional do computador que atualiza a consulta: no Brasil, a vírgula é decimal e as datas são dia/mês; nos Estados Unidos, a vírgula é separador de milhares e o ponto é o decimal, e as datas são mês/dia. Sintomas: 45,90 vira 4590 (a vírgula é lida como milhar) e 750,00 vira 75000; 1.234,50 vira erro (célula vazia); uma data como 15/03/2026 vira erro (não existe o mês 15), enquanto 01/02/2026 vira 2 de janeiro, sem erro. Correção: informar a cultura do arquivo como terceiro argumento, Table.TransformColumnTypes(..., \"pt-BR\"), (ou usar Tipo de Dados > Usando Localidade no editor), para que o resultado não dependa do computador.",
    rubricMd: "Identifica a configuração regional do computador como causa; descreve ao menos três sintomas coerentes (milhar, erro, data trocada); corrige com a cultura explícita.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "Escreva em M uma consulta que leia `C:\\Dados\\pedidos.csv` (ponto e vírgula, UTF-8, colunas Cliente, Produto e Valor, valores no padrão brasileiro), apare os espaços de Cliente e Produto, converta Valor para número com a cultura certa, descarte as linhas sem Valor e remova as linhas repetidas, devolvendo a tabela limpa.",
    answerKeyMd: "```\nlet\n    Origem = Csv.Document(File.Contents(\"C:\\Dados\\pedidos.csv\"), [Delimiter = \";\", Encoding = 65001]),\n    Cabecalhos = Table.PromoteHeaders(Origem, [PromoteAllScalars = true]),\n    Aparado = Table.TransformColumns(Cabecalhos, {{\"Cliente\", Text.Trim, type text}, {\"Produto\", Text.Trim, type text}}),\n    Tipos = Table.TransformColumnTypes(Aparado, {{\"Valor\", type number}}, \"pt-BR\"),\n    SemVazios = Table.SelectRows(Tipos, each [Valor] <> null),\n    SemRepetidos = Table.Distinct(SemVazios)\nin\n    SemRepetidos\n```\n\nA ordem importa: aparar antes de Distinct, para que \"Ana \" e \"Ana\" sejam iguais; converter o tipo (com a cultura pt-BR) antes de filtrar, porque é a conversão que transforma o campo vazio em null.",
    points: 20,
  },
];

export const OFFICE_BOOK_07_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "O que é uma consulta do Power Query?", backMd: "Uma receita de etapas em M (let ... in ...) guardada na pasta de trabalho; Atualizar Tudo a reexecuta sobre a fonte atual. A tabela de saída não deve ser editada." },
  { nodeTitle: NODE, frontMd: "Por que informar a cultura em Table.TransformColumnTypes?", backMd: "Sem ela vale a configuração do computador que atualiza. Cultura errada: 45,90 vira 4590, datas com mês e dia trocados ou erro, sem aviso." },
  { nodeTitle: NODE, frontMd: "Text.Trim do Power Query × ARRUMAR do Excel", backMd: "Text.Trim também remove o espaço inseparável (160); ARRUMAR não. Campo vazio de CSV é texto vazio (\"\"), só vira null depois de convertido." },
  { nodeTitle: NODE, frontMd: "Mesclar: externa × interna", backMd: "LeftOuter mantém todas as linhas da esquerda (expõe o que não casa, com null); Inner mantém só o que casa e esconde o resto. Chaves precisam ter o mesmo tipo." },
  { nodeTitle: NODE, frontMd: "Para que serve desdinamizar?", backMd: "Table.UnpivotOtherColumns transforma colunas (meses) em linhas (Sala, Mês, Valor), formato próprio para agrupar, filtrar e resumir." },
];
