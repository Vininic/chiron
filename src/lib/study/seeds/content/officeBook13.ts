// Pacote Office, reescrita autoral (PLANO.md §R.2) — capítulo 13, integrador.
// Uma pasta de trabalho (e o documento e a apresentação que saem dela) cresce de seção em seção.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Projeto integrador: o controle de estoque e reservas da Ágora";

export const OFFICE_BOOK_13: ContentChapter = {
  title: NODE,
  level: "avancado",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "O cadastro: duas Tabelas e regras de entrada",
      order: 0,
      blocks: [
        prose([
          "O projeto deste capítulo junta o livro inteiro numa tarefa de verdade: o controle de estoque e de reservas da **Ágora**, a loja que aparece em outros pontos do Chiron. A Ágora vende azeite, mel e figos secos; cada produto tem um estoque, e os clientes reservam unidades antes de pagar. Quem cuida do estoque precisa saber, a qualquer momento, quanto de cada produto está livre, e precisa ser avisado quando algo dá errado. Uma única pasta de trabalho do Excel cuida disso; um documento do Word e um slide do PowerPoint, gerados a partir dela, levam o resultado a quem decide. As quatro seções constroem o conjunto em ordem, cada uma sobre a anterior.",
          "",
          "A primeira decisão é a **separação dos dados**, a mesma do capítulo 12. O estoque e as reservas são coisas diferentes, e cada uma ganha a sua **Tabela do Excel**, com um nome. `Estoque` tem uma linha por produto, com o nome, a quantidade em estoque e a quantidade **bloqueada** pelo sistema de reservas, que é o número que o sistema acredita ter reservado. `Reservas` tem uma linha por reserva, com o número, o produto, a quantidade e o responsável. Essas duas tabelas são a *fonte da verdade*: tudo o que vem depois é calculado a partir delas, e nada é digitado duas vezes. Nenhum total, nenhuma célula mesclada, nenhuma linha em branco entre os registros: é o formato de lista que os capítulos 3 e 12 pediram.",
          "",
          "A segunda decisão é a **validação na entrada**. O capítulo 3 mostrou que a validação de dados barra a digitação de valores fora da regra, e o cadastro usa duas. O campo `Produto` das reservas é uma **lista** com os três produtos, o que impede que alguém digite \"Azeite\" ou \"azeite de creta\", variações que quebrariam a soma por produto. O campo `Quantidade` aceita apenas **números inteiros maiores ou iguais a 1**, o que impede reservar meia unidade ou uma quantidade negativa. São regras baratas e valem a pena: a maior parte dos erros de dados em planilhas de uso interno nasce de uma digitação sem regra.",
          "",
          "A validação tem limites, e o projeto precisa deles em mente. Ela confere cada entrada **isoladamente**, contra a regra fixa: a quantidade é inteira, o produto está na lista. Ela não sabe se, naquele momento, há estoque para a reserva. Dá para escrever uma regra que consulta o estoque disponível (uma validação personalizada com uma fórmula), e isso melhora o controle, mas continua sendo uma conferência feita **no instante da digitação, sobre o que aquela cópia da planilha mostra**. O que acontece quando duas pessoas fazem a mesma coisa ao mesmo tempo é o tema da segunda seção, e é o problema que o laboratório da Ágora, ligado ao fim do capítulo, examina.",
          "",
          "O laboratório descreve o contrato que se espera do sistema: **\"reservar decrementa disponibilidade dentro da mesma transição que adiciona o item ao carrinho\"**. Em outras palavras, verificar se há estoque e registrar a reserva são uma operação só, indivisível. Dele saem duas **invariantes**, afirmações que devem valer em todo instante: o estoque disponível nunca é negativo, e o estoque e os carrinhos contam a mesma coisa (o que o sistema bloqueou é exatamente o que os carrinhos reservaram). A planilha não tem como *garantir* essas invariantes, mas pode *conferi-las* a cada mudança, e é essa conferência que o painel da próxima seção implementa.",
          "",
          "O exemplo cria as duas planilhas, transforma-as em Tabelas e aplica as regras de entrada. Os resultados mostram que as reservas cadastradas obedecem às regras.",
        ]),
        code("csv", [
          "Produto;Estoque;Bloqueado",
          "Azeite de Creta;3;3",
          "Mel de tomilho;10;4",
          "Figos secos;4;2",
        ], "Estoque!A1: três produtos, a quantidade em estoque e a quantidade que o sistema bloqueou"),
        code("csv", [
          "Reserva;Produto;Quantidade;Responsável",
          "R1;Azeite de Creta;2;Ana",
          "R2;Mel de tomilho;4;Bia",
          "R3;Azeite de Creta;1;Caio",
          "R4;Figos secos;2;Ana",
        ], "Reservas!A1: quatro reservas feitas até agora"),
        code("excel", [
          "Tabela: Estoque = Estoque!A1:C4",
          "Tabela: Reservas = Reservas!A1:D5",
          "Validação: Reservas!B2:B5 = lista Azeite de Creta;Mel de tomilho;Figos secos",
          "Validação: Reservas!C2:C5 = inteiro maior ou igual a 1",
        ], "As duas listas viram Tabelas; o produto é uma lista e a quantidade, um inteiro a partir de 1"),
        code("text", [
          "validar:Reservas!C2 = VERDADEIRO",
          "validar:Reservas!B3 = VERDADEIRO",
        ], "Resultado: as reservas cadastradas obedecem às regras"),
        prose([
          "As quatro reservas atendem às duas regras. As duas Tabelas, `Estoque` e `Reservas`, passam a ser a única fonte dos números: qualquer cálculo adiante se refere a elas por nome (`Estoque[Produto]`, `Reservas[Quantidade]`), e uma reserva nova, digitada logo abaixo da última, é absorvida pela Tabela e herda as regras de entrada.",
          "",
          "Os números do cadastro são consistentes: o Azeite tem 3 unidades, com 3 reservadas (2 de Ana e 1 de Caio); o Mel tem 10, com 4 reservadas; os Figos têm 4, com 2 reservadas. A coluna `Bloqueado` do estoque bate com a soma das reservas de cada produto, o que será conferido por fórmula na seção seguinte.",
        ]),
        porque([
          "Separe os dados em Tabelas nomeadas, uma por assunto, e nunca digite um número duas vezes. Use validação de dados (lista e inteiro a partir de 1) para impedir entradas inválidas, sabendo que ela confere cada entrada isolada, e não o estado do sistema.",
        ]),
        quebraria([
          "O controle é feito numa só planilha com o produto digitado à mão a cada reserva: \"Azeite\", \"azeite de creta\", \"Azeite de Creta \". Cada variação é uma linha de produto diferente para a `SOMASES`, o estoque disponível parece sobrar, e dois clientes recebem a confirmação da mesma última garrafa.",
        ]),
      ],
    },
    {
      title: "O painel: disponível, situação e as invariantes do laboratório",
      order: 1,
      blocks: [
        prose([
          "O painel é o resumo que alguém lê para decidir: por produto, quanto há, quanto está reservado, quanto resta e em que situação o produto está. Ele é todo **calculado**, nada é digitado, e usa as matrizes dinâmicas do capítulo 6. `=Estoque[Produto]` devolve a lista de produtos da Tabela, e as colunas seguintes se apoiam nela com o operador `#`: o estoque (`=Estoque[Estoque]`), o reservado (`=SOMASES(Reservas[Quantidade];Reservas[Produto];A2#)`), o disponível (`=B2#-C2#`) e a situação, com um `SE` que cobre os três estados (`ESTOQUE NEGATIVO`, `esgotado`, `disponível`). Se um produto novo entra na Tabela de estoque, ele aparece no painel sem nenhuma edição de fórmula.",
          "",
          "Ao lado, duas fórmulas conferem as **invariantes** do laboratório. A primeira, \"estoque disponível nunca é negativo\", é `=MÍNIMO(D2#)>=0`: verdadeira enquanto o menor disponível for zero ou mais. A segunda, \"estoque e reservas contam a mesma coisa\", é `=SOMA(Estoque[Bloqueado])=SOMA(Reservas[Quantidade])`: verdadeira quando o que o sistema bloqueou é exatamente a soma das reservas. As duas devolvem `VERDADEIRO` ou `FALSO`, e é essa a utilidade de um painel de conferência: ele não pede que alguém compare números, apenas mostra se a regra vale.",
          "",
          "No estado inicial, o painel está limpo: o Azeite está esgotado (3 de 3), o Mel e os Figos estão disponíveis, e as duas invariantes são verdadeiras. Para ver o painel funcionar sob pressão, o exemplo reproduz o problema que o laboratório descreve. Os Figos têm 4 unidades e 2 reservadas; **duas pessoas**, Dani e Edu, olham o painel ao mesmo tempo, veem 2 disponíveis, e cada uma reserva 2 unidades. Cada reserva, sozinha, estava certa no instante em que foi feita; juntas, elas somam 6 reservadas para um estoque de 4. Pior: o sistema que bloqueia o estoque leu o número 2 duas vezes, somou 2 a cada leitura e gravou 4 duas vezes, e o resultado final, 4, não registra a segunda reserva. É a falha que o laboratório chama de **checar antes, reservar depois**: a verificação e a gravação são separadas, e outro processo passa pelo intervalo entre elas.",
          "",
          "O painel mostra o dano. Os Figos passam a ter 6 reservados e um disponível de **menos 2**, com a situação `ESTOQUE NEGATIVO`. A primeira invariante fica `FALSO`. A segunda também: o estoque bloqueado soma 11 (3 + 4 + 4) e as reservas somam 13. O sistema vendeu duas unidades que não existem, e o bloqueio registrado não corresponde aos carrinhos.",
          "",
          "Por que a validação de dados não evitou isso? Porque cada entrada foi conferida contra o que a planilha mostrava no momento, e naquele momento a entrada estava correta. Duas pessoas editando cópias diferentes, ou a mesma planilha em momentos muito próximos, passam por conferências que, **somadas**, violam a regra. Nenhuma regra de validação enxerga o que a *outra* pessoa está prestes a gravar. Uma regra por fórmula, que consulta o disponível, só ajudaria se a consulta e a gravação fossem uma operação única e se ninguém mais pudesse gravar entre elas, exatamente a garantia que uma planilha compartilhada não dá.",
          "",
          "O que a planilha *pode* fazer é **detectar** e **alertar**, com rapidez, e é para isso que o painel serve. A *prevenção* pertence ao sistema onde a reserva realmente acontece: um banco de dados com uma operação atômica (verificar e decrementar na mesma transação) ou uma fila que serializa os pedidos. O laboratório da Ágora, no fim do capítulo, deixa ativar a falha e ver as invariantes se quebrarem passo a passo.",
          "",
          "O exemplo monta o painel, confere o estado inicial, registra as duas reservas simultâneas e mostra o estado depois delas.",
        ]),
        code("excel", [
          "Painel!A1: Produto",
          "Painel!B1: Estoque",
          "Painel!C1: Reservado",
          "Painel!D1: Disponível",
          "Painel!E1: Situação",
          "Painel!A2: =Estoque[Produto]",
          "Painel!B2: =Estoque[Estoque]",
          "Painel!C2: =SOMASES(Reservas[Quantidade];Reservas[Produto];A2#)",
          "Painel!D2: =B2#-C2#",
          "Painel!E2: =SE(D2#<0;\"ESTOQUE NEGATIVO\";SE(D2#=0;\"esgotado\";\"disponível\"))",
          "Painel!G1: Estoque disponível nunca é negativo",
          "Painel!H1: =MÍNIMO(D2#)>=0",
          "Painel!G2: Reservas e estoque contam o mesmo",
          "Painel!H2: =SOMA(Estoque[Bloqueado])=SOMA(Reservas[Quantidade])",
        ], "O painel: quatro colunas calculadas e as duas invariantes"),
        code("text", [
          "Painel!A1:E4 = Produto | Estoque | Reservado | Disponível | Situação / Azeite de Creta | 3 | 3 | 0 | esgotado / Mel de tomilho | 10 | 4 | 6 | disponível / Figos secos | 4 | 2 | 2 | disponível",
          "Painel!H1:H2 = VERDADEIRO / VERDADEIRO",
        ], "Resultado: o estado inicial, consistente"),
        code("excel", [
          "Reservas!A6: R5",
          "Reservas!B6: Figos secos",
          "Reservas!C6: 2",
          "Reservas!D6: Dani",
          "Reservas!A7: R6",
          "Reservas!B7: Figos secos",
          "Reservas!C7: 2",
          "Reservas!D7: Edu",
          "Estoque!C4: 4",
        ], "Duas pessoas reservam 2 unidades de Figos ao mesmo tempo; o bloqueio do sistema registra só uma delas"),
        code("text", [
          "Painel!A1:E4 = Produto | Estoque | Reservado | Disponível | Situação / Azeite de Creta | 3 | 3 | 0 | esgotado / Mel de tomilho | 10 | 4 | 6 | disponível / Figos secos | 4 | 6 | -2 | ESTOQUE NEGATIVO",
          "Painel!H1:H2 = FALSO / FALSO",
        ], "Resultado: duas reservas válidas, isoladas, quebram as duas invariantes"),
        prose([
          "No estado inicial, o painel lista os três produtos com seus números, e as duas invariantes dão `VERDADEIRO`. Depois das reservas de Dani e de Edu, os Figos aparecem com 6 reservados e disponível **−2**, com a situação em maiúsculas para chamar atenção. Nenhuma das duas reservas foi recusada pela validação: cada uma, no instante em que foi feita, cabia no estoque que o painel mostrava.",
          "",
          "Ambas as invariantes viraram `FALSO`. A primeira diz que o disponível ficou negativo; a segunda, que o bloqueio registrado pelo sistema (11) não coincide com o que os carrinhos pedem (13). É o retrato numérico da falha: uma unidade vendida que não existia e uma reserva que o sistema esqueceu de contar.",
        ]),
        porque([
          "O painel é todo calculado (matrizes dinâmicas sobre as Tabelas) e confere as invariantes com `VERDADEIRO`/`FALSO`. A planilha detecta violações, mas não as impede: verificar e reservar precisam ser uma operação única no sistema onde a reserva acontece, e a validação confere cada entrada isoladamente.",
        ]),
        quebraria([
          "A equipe confia na validação de dados para \"nunca vender mais do que existe\". Numa sexta-feira de promoção, dois atendentes reservam a última caixa de mel dentro do mesmo minuto; cada reserva passou na regra. O cliente que chega depois recebe o aviso de que o produto acabou, e dois clientes já tinham a confirmação.",
        ]),
      ],
    },
    {
      title: "O relatório e a apresentação: mala direta no Word e um slide",
      order: 2,
      blocks: [
        prose([
          "Depois do painel, a informação precisa chegar a quem decide, em formas diferentes: a equipe de estoque quer um documento por produto para anexar ao processo de conferência, e a diretoria quer uma frase e uma imagem em um slide. As duas saídas partem da **mesma fonte**, a planilha, sem que ninguém copie números: o Word lê o painel por mala direta, e a apresentação resume a conclusão. Se o estoque mudar, o documento é gerado de novo, e o slide se ajusta em um ponto só, o título.",
          "",
          "O documento usa a **mala direta** do capítulo 10, com o painel como fonte de dados. A pasta de trabalho é salva (a mala direta lê o arquivo gravado, e não a planilha aberta na tela), e o documento principal tem um título e uma frase com campos de mesclagem para o produto, o estoque, o reservado, o disponível e a situação. Cada linha do painel gera uma página: três produtos, três páginas. A fonte de dados é a planilha `Painel`, escolhida pelo nome, e os cabeçalhos da primeira linha viram os nomes dos campos. Aqui os números são inteiros e a situação é texto, de modo que os problemas de formato do capítulo 10 (data em ordem americana, resíduo de ponto flutuante) não aparecem; um painel com valores em reais pediria uma coluna de texto formatado.",
          "",
          "O ponto de atenção é a **sincronia**: a mala direta é uma fotografia do arquivo salvo no momento em que foi executada. Se as reservas mudam depois, o documento gerado continua com os números antigos até que a mesclagem seja repetida, e os campos do Word não buscam os dados por conta própria. Quem recebe o relatório precisa saber **de quando** ele é: vale a pena incluir no texto a data e a hora da geração (como texto, e não como o campo `DATE`, do capítulo 10), para que o relatório seja um registro e não uma afirmação sobre o presente.",
          "",
          "O **slide** segue o capítulo 11. Ele usa o layout `Título e Conteúdo`, com os dois espaços reservados preenchidos: o título diz a **conclusão** (\"Figos secos ficou com estoque negativo\") e o conteúdo traz o fato de apoio, em uma frase. Como o título é um espaço reservado, ele aparece na estrutura de tópicos e é o que um leitor de tela anuncia. As notas do apresentador guardam o roteiro: mostrar o painel e explicar a corrida entre a checagem e a reserva. Num slide para a diretoria, as notas não devem sair do arquivo na versão enviada, como o capítulo 11 mostrou, e o painel do Excel em tela cheia é muitas vezes uma ilustração melhor do que um gráfico.",
          "",
          "Uma decisão de conteúdo cabe aqui. O slide **não deve culpar pessoas**: a frase \"Dani e Edu reservaram além do estoque\" é falsa no essencial, porque cada um agiu corretamente com a informação que tinha. O problema é de desenho do sistema, e o título e a nota devem dizer isso. A mesma cautela vale para o relatório do Word: o texto descreve a situação (o produto, o disponível, o estado), e as causas são tema de outro documento.",
          "",
          "O exemplo salva a planilha, gera o documento por mala direta e monta o slide.",
        ]),
        code("excel", [
          "Salvar como: agora.xlsx",
        ], "A pasta de trabalho é salva, porque a mala direta lê o arquivo"),
        code("word", [
          "[Título 1] Conferência de estoque",
          "[Normal] {Produto}: estoque {Estoque}, reservado {Reservado}, disponível {Disponível} ({Situação}).",
          "Mala direta: dados = agora.xlsx, planilha Painel",
        ], "O documento principal, com os campos de mesclagem, e a fonte de dados"),
        code("text", [
          "doc:mesclado = Conferência de estoque / Azeite de Creta: estoque 3, reservado 3, disponível 0 (esgotado). / Conferência de estoque / Mel de tomilho: estoque 10, reservado 4, disponível 6 (disponível). / Conferência de estoque / Figos secos: estoque 4, reservado 6, disponível -2 (ESTOQUE NEGATIVO).",
        ], "Resultado: uma página por produto, com os números do painel"),
        code("powerpoint", [
          "Slide [Título e Conteúdo]: Figos secos ficou com estoque negativo | Duas reservas simultâneas passaram do estoque",
          "Notas: slide 1 = Mostrar o painel e explicar a corrida entre a checagem e a reserva.",
        ], "Um slide: a conclusão no título, o fato de apoio no conteúdo e o roteiro nas notas"),
        code("text", [
          "slides:titulos = 1: Figos secos ficou com estoque negativo",
          "slides:notas = 1: Mostrar o painel e explicar a corrida entre a checagem e a reserva.",
        ], "Resultado: o título que o PowerPoint reconhece e as notas"),
        prose([
          "A mala direta produziu um bloco para cada produto do painel, na ordem das linhas: o Azeite esgotado, o Mel disponível e os Figos com disponível −2 e a situação em maiúsculas. Os números são os do painel no momento em que a planilha foi salva; se uma reserva for acrescentada depois, o documento precisa ser gerado de novo.",
          "",
          "O slide tem a conclusão como título, reconhecida como título pelo PowerPoint, e as notas do apresentador com o roteiro. É uma entrega de dois minutos: o Word documenta, o PowerPoint resume, e ambos dependem da planilha, que continua a ser a única fonte.",
        ]),
        porque([
          "Uma fonte, várias saídas: o Word lê o painel por mala direta (do arquivo salvo, é uma fotografia) e o slide resume a conclusão em um título claro. Registre a data da geração como texto, e descreva a situação sem culpar pessoas.",
        ]),
        quebraria([
          "O relatório do Word é gerado numa segunda-feira e anexado ao processo; na terça, as reservas mudam e ninguém o gera de novo. Na auditoria, o documento mostra um disponível positivo para um produto que já estava negativo, e a equipe é questionada sobre o que sabia e quando.",
        ]),
      ],
    },
    {
      title: "Fechar o ciclo: conferência final e a ponte com o laboratório",
      order: 3,
      blocks: [
        prose([
          "Antes de enviar a pasta de trabalho, o documento e a apresentação, passa-se pela **lista de conferência** do capítulo 12. Em vez de repeti-la como regra, esta seção a aplica ao projeto e mostra o que cada item verifica. O cálculo está automático e não há referências circulares: o painel é todo composto de fórmulas que dependem das Tabelas, e nada depende de si mesmo. Não há vínculos externos, porque as duas Tabelas e o painel moram no mesmo arquivo; um arquivo separado para o cadastro exigiria um vínculo, e com ele o caminho exposto e a dependência de que o capítulo 12 falou. Não há nomes definidos com erro, e a lista de nomes está vazia. As matrizes dinâmicas deixam no pacote uma parte `xl/metadata.xml`, a marca de que o arquivo exige uma versão recente do Excel, e quem recebe precisa ter uma.",
          "",
          "O último passo é o **Inspecionar Documento**, do capítulo 1: ele remove as propriedades pessoais, o nome do autor e de quem salvou por último, e o caminho absoluto gravado no arquivo. Aplicado à pasta de trabalho, o campo do criador fica vazio. O arquivo final deve ser uma **cópia**; o original, com o histórico de quem o criou, continua na pasta do projeto. Para o Word, o equivalente é aceitar ou rejeitar as alterações e atualizar os campos; para o PowerPoint, retirar as notas e os slides ocultos da versão que sai da equipe. E, para quem recebe só para ler, o PDF resolve os três de uma vez.",
          "",
          "A conferência aparece numericamente no pacote final. As duas Tabelas aparecem como partes `xl/tables/table1.xml` e `table2.xml`, o que confirma que os dados estão estruturados; não há nenhuma parte de vínculos externos; o painel, com três linhas de resultado, está em uma planilha própria. O que o arquivo guarda, e o que não guarda, é o que o capítulo 1 ensinou a ler.",
          "",
          "O projeto também mostra o valor do livro como um todo. O **cadastro** em Tabelas (capítulo 3) é a base. As **fórmulas de decisão e de critérios** (capítulo 4), as **buscas** (capítulo 5) e as **matrizes dinâmicas** (capítulo 6) montam o painel sem repetir nenhum número. A **validação** (capítulo 3) cuida da entrada. A **conferência das invariantes** é uma aplicação direta do capítulo 4, e os tipos e a precisão do capítulo 2 explicam por que as quantidades são inteiros e a comparação de somas é exata. O **Power Query** (capítulo 7) assumiria o papel de importar o cadastro de um sistema, e a **tabela dinâmica e o gráfico** (capítulo 8) seriam a alternativa de exploração. O **Word** (capítulos 9 e 10) e o **PowerPoint** (capítulo 11) levam o resultado adiante, e as **armadilhas** (capítulo 12) orientam a conferência final.",
          "",
          "O que o projeto *não* resolve é o problema de fundo, e dizê-lo é parte da entrega. A planilha mostra que as invariantes foram violadas; não impede que isso aconteça. Para impedir, a reserva precisa ser uma operação **atômica**, onde \"há estoque?\" e \"reserve\" são o mesmo passo e ninguém passa entre eles. É o que a camada do laboratório da Ágora trata, com o código mínimo que expressa a regra (`if (stock - reserved < 1) return state;` seguido da reserva, numa só transição) e a mutação que a quebra, \"checar antes, reservar depois\". A ponte abaixo leva a ela: com a falha ativada, as duas invariantes que o painel conferiu aparecem quebradas no laboratório, e com a regra restaurada, elas voltam a valer.",
          "",
          "O exemplo faz a limpeza final, salva a cópia que sai da equipe e confere o que ela contém. Em seguida, vem a ponte para o laboratório.",
        ]),
        code("excel", [
          "Inspecionar documento: remover tudo",
          "Salvar como: agora-final.xlsx",
        ], "Remove as informações pessoais e salva a cópia que sai da equipe"),
        code("text", [
          "partes:agora-final.xlsx contém: xl/tables/table1.xml",
          "partes:agora-final.xlsx contém: xl/tables/table2.xml",
          "partes:agora-final.xlsx contém: xl/metadata.xml",
          "partes:agora-final.xlsx não contém: xl/externalLinks",
          "parte:agora-final.xlsx!docProps/core.xml contém: <dc:creator></dc:creator>",
          "circular:Painel = (nenhuma)",
          "nomes:todos = ",
        ], "Resultado: duas Tabelas, nenhum vínculo externo, nenhuma circularidade, nenhum nome com erro e o criador removido"),
        {
          kind: "labref",
          labId: "agora",
          layerId: "reserva-estoque-concorrencia",
        },
        prose([
          "O arquivo final tem as duas Tabelas como partes próprias, o arquivo de metadados das matrizes dinâmicas e nenhum vínculo externo. A verificação de circularidade, feita na planilha do painel, não encontrou nada, a lista de nomes está vazia, e o criador do documento foi esvaziado pelo Inspecionar Documento. É a prova de que a entrega passou pelas verificações do capítulo anterior.",
          "",
          "A camada do laboratório conta a outra metade da história. Lá, a falha \"checar antes, reservar depois\" é uma alavanca que se liga e desliga, e as invariantes que o painel conferiu por fórmula (estoque disponível nunca negativo; reservas e carrinhos que contam a mesma coisa) são as que aparecem quebradas quando a janela entre a checagem e a reserva fica aberta. A planilha e o laboratório mostram o mesmo problema por dois ângulos, e a lição é a mesma: o que precisa valer sempre deve ser garantido pela estrutura, e não pela atenção de quem digita.",
        ]),
        porque([
          "Aplique a lista de conferência: cálculo automático, sem circularidade, sem vínculos, nomes limpos, Inspecionar Documento e uma cópia para envio. A planilha detecta violações das invariantes; prevenir exige uma operação atômica no sistema onde a reserva acontece.",
        ]),
        quebraria([
          "O controle da Ágora é entregue à diretoria como uma pasta de trabalho com o painel verde e a validação de dados em todas as colunas. Em dezembro, o painel mostra `VERDADEIRO` nas duas invariantes porque ninguém o abriu durante a corrida de Natal; quando alguém abre, os Figos estão com -14 unidades e quatorze clientes aguardam um produto que nunca existiu.",
        ]),
      ],
    },
  ],
};

export const OFFICE_BOOK_13_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "advanced",
    promptMd: "No controle da Ágora, a validação de dados da coluna Quantidade só aceita inteiros a partir de 1. Duas pessoas reservam, ao mesmo tempo, 2 unidades de um produto que tem 2 disponíveis, e o painel passa a mostrar disponível −2. Por que a validação de dados não evitou o problema?",
    choices: [
      "Ela confere cada entrada isoladamente, contra uma regra fixa, e não o estado que a outra pessoa está gravando ao mesmo tempo",
      "A validação de dados só funciona em planilhas que não usam Tabelas",
      "Dois usuários não podem editar a mesma planilha, então o erro foi de digitação",
      "O Excel ignora a validação quando o valor é digitado em uma Tabela",
    ],
    answerKeyMd: "Ela confere cada entrada isoladamente, contra uma regra fixa, e não o estado que a outra pessoa está gravando ao mesmo tempo",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "advanced",
    promptMd: "Explique as duas invariantes do laboratório da Ágora (estoque disponível nunca é negativo; reservas e carrinhos contam a mesma coisa), mostre como conferi-las em fórmulas do Excel sobre as Tabelas Estoque (Produto, Estoque, Bloqueado) e Reservas (Reserva, Produto, Quantidade, Responsável) e diga o que a planilha pode e o que não pode fazer a respeito da falha \"checar antes, reservar depois\".",
    answerKeyMd: "Invariante 1: em qualquer instante, estoque − reservado ≥ 0 para todo produto; se for violada, o sistema vendeu uma unidade que não existe. Invariante 2: o que o sistema bloqueou é exatamente o que os carrinhos reservaram; se não bater, o estoque bloqueia itens que nenhum carrinho possui (ou o contrário). Conferência: disponível por produto em um painel calculado (Reservado = SOMASES(Reservas[Quantidade];Reservas[Produto];produto), Disponível = Estoque − Reservado); invariante 1: =MÍNIMO(Disponível)>=0; invariante 2: =SOMA(Estoque[Bloqueado])=SOMA(Reservas[Quantidade]) (VERDADEIRO/FALSO). A planilha pode detectar e alertar rapidamente (situação ESTOQUE NEGATIVO, invariantes FALSO). Não pode impedir a falha: a validação de dados confere cada digitação isoladamente, contra o que aquela cópia mostra, e duas conferências corretas podem, somadas, violar a regra. A prevenção exige que verificar e reservar sejam uma operação atômica no sistema de registro (transação, bloqueio ou fila).",
    rubricMd: "Enuncia as duas invariantes; escreve fórmulas de conferência com SOMASES e SOMA; separa detectar de prevenir; menciona operação atômica.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "Liste, em ordem, as verificações finais que você faria antes de enviar à diretoria o conjunto formado pela pasta de trabalho do controle (com Tabelas, painel de matrizes dinâmicas e um relatório do Word gerado por mala direta) e por um slide do PowerPoint, dizendo o que cada verificação previne. Inclua o que fazer com o relatório do Word e com o slide.",
    answerKeyMd: "Excel: cálculo em modo automático e sem referências circulares (previne totais desatualizados e zeros silenciosos); Dados > Atualizar Tudo e Tabelas com as linhas novas (previne painel com dados antigos); Editar Vínculos e Gerenciador de Nomes sem vínculos externos desnecessários nem nomes com erro (previne dependência e vazamento de caminho); estrutura sem células mescladas nem totais no meio (previne contagens erradas); Inspecionar Documento e salvar uma cópia (remove autor e caminho); lembrar que as matrizes dinâmicas exigem versão recente do Excel. Word: gerar o relatório de novo a partir do arquivo salvo e com os números atuais (a mala direta é uma fotografia), aceitar/remover alterações e comentários, atualizar campos (Ctrl+A, F9), registrar a data de geração como texto. PowerPoint: título do slide como espaço reservado que diga a conclusão, retirar notas e slides ocultos da versão que sai, conferir ordem de leitura e texto alternativo. Entrega: PDF quando o destinatário só precisa ler.",
    points: 20,
  },
];

export const OFFICE_BOOK_13_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Quais as duas invariantes da camada reserva-estoque-concorrencia?", backMd: "Estoque disponível nunca é negativo; reservas e carrinhos contam a mesma coisa (o que o estoque bloqueia é o que os carrinhos reservaram)." },
  { nodeTitle: NODE, frontMd: "Como conferir as invariantes no Excel?", backMd: "Painel calculado: Disponível = Estoque − SOMASES(reservas); =MÍNIMO(Disponível)>=0 e =SOMA(Estoque[Bloqueado])=SOMA(Reservas[Quantidade])." },
  { nodeTitle: NODE, frontMd: "Por que a validação de dados não impede \"checar antes, reservar depois\"?", backMd: "Confere cada entrada isoladamente contra o que a cópia mostra; duas conferências corretas podem, somadas, violar a regra. Prevenir exige operação atômica no sistema." },
  { nodeTitle: NODE, frontMd: "A mala direta do Word acompanha a planilha?", backMd: "Não: é uma fotografia do arquivo salvo no momento da mesclagem. Gere de novo quando os dados mudam e registre a data como texto." },
  { nodeTitle: NODE, frontMd: "O que fazer antes de enviar o conjunto Excel + Word + PowerPoint?", backMd: "Cálculo automático, sem circularidade nem vínculos, Atualizar Tudo, campos atualizados, alterações e notas resolvidas, Inspecionar Documento, cópia/PDF." },
];
