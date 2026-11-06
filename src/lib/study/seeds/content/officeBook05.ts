// Pacote Office, reescrita autoral (PLANO.md §R.2) — capítulo 5.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Excel: buscar dados em outras tabelas e por que a busca falha";

const salas = (rotulo: string) => [
  `Código;Sala;Capacidade;${rotulo}`,
  "103;Tebas;40;60",
  "101;Atenas;30;45",
  "104;Olímpia;50;80",
  "102;Delfos;20;30",
  "105;Atenas;35;50",
];

export const OFFICE_BOOK_05: ContentChapter = {
  title: NODE,
  level: "intermediario",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "PROCV e PROCH: como funcionam e onde quebram",
      order: 0,
      blocks: [
        prose([
          "Boa parte do trabalho em planilhas é trazer um dado de uma tabela para outra: o nome da sala a partir do código, o preço a partir do produto, o desconto a partir da faixa. A função histórica para isso é a **`PROCV`** (*procura vertical*), e entender como ela funciona, e onde ela falha, importa mesmo para quem usa funções mais novas, porque há décadas de planilhas que a usam e ela continua a ser a primeira que se aprende.",
          "",
          "A sintaxe é `PROCV(valor_procurado; tabela; índice_da_coluna; [intervalo_de_pesquisa])`. O Excel procura o valor na **primeira coluna da tabela**, de cima para baixo, e quando o encontra devolve o conteúdo da mesma linha na coluna cujo número é dado pelo terceiro argumento, contado a partir da primeira coluna da tabela. Com os códigos em A2:A6 e os nomes em B2:B6, `=PROCV(102;A2:D6;2;FALSO)` procura 102 na primeira coluna e devolve o conteúdo da segunda, `Delfos`. Três regras decorrem da definição. A busca é **sempre na primeira coluna**: não existe \"procurar à esquerda\". A busca devolve a **primeira ocorrência**: se há duas linhas com `Atenas`, só a primeira é vista. E a comparação de texto **não diferencia maiúsculas**: `\"atenas\"` encontra `Atenas`.",
          "",
          "O quarto argumento é onde nascem os erros. Com **`FALSO`**, a busca é *exata*: encontra o valor idêntico ou devolve `#N/D`. Com **`VERDADEIRO`**, que também é o **padrão quando o argumento é omitido**, a busca é *aproximada*: o Excel assume que a primeira coluna está **em ordem crescente** e devolve a linha do maior valor que não ultrapassa o procurado. Essa é a lógica certa para faixas, como a de descontos por quantidade, e a errada para qualquer busca por chave. Numa lista de códigos fora de ordem, `=PROCV(102;A2:D6;2)` e `=PROCV(101;A2:D6;2)`, sem o `FALSO`, devolvem `#N/D` mesmo com os códigos presentes, porque a busca binária salta para o meio da lista e conclui errado. Pior: em outras listas, a mesma fórmula devolve uma linha *vizinha* e **nenhum erro**, e o resultado errado passa por certo. A regra prática é simples: toda busca por chave leva `FALSO` no quarto argumento.",
          "",
          "O terceiro argumento, o **índice da coluna**, é um número digitado dentro da fórmula, e é a fonte da fragilidade mais citada da função. A fórmula `=PROCV(102;A2:C3;2;FALSO)` quer a segunda coluna; se alguém **insere uma coluna** entre as duas, o Excel ajusta o intervalo (que passa a ser `A2:D3`), mas não o índice, que continua 2 e agora aponta para a coluna recém-inserida, em branco. O resultado é `0`, sem aviso, ou o nome em vez do código, dependendo da posição. Um índice 3, que antes devolvia a capacidade, passa a devolver o nome. Planilhas com dezenas de `PROCV` e colunas inseridas ao longo dos anos acumulam esse tipo de erro silencioso. A cura é usar uma função que referencia a coluna de retorno diretamente, como as das próximas seções, ou calcular o índice com `CORRESP`.",
          "",
          "A **`PROCH`** (*procura horizontal*) é a mesma função girada: procura na primeira *linha* e devolve de uma linha abaixo. Serve para tabelas com os cabeçalhos nas colunas, como uma linha de meses e outra de metas, e tem os mesmos argumentos, os mesmos problemas e a mesma regra do `FALSO`.",
          "",
          "Um último cuidado com a tabela do segundo argumento: quando a fórmula é copiada para baixo, o intervalo precisa ficar parado, com referências absolutas, como no capítulo anterior. `=PROCV(A2;Salas!$A$2:$D$6;2;FALSO)` é a forma segura; sem os cifrões, o intervalo anda uma linha a cada cópia e a última busca acaba procurando numa tabela cortada. Se a tabela de busca for uma Tabela do Excel, a referência estruturada `Salas[#Dados]` resolve o problema, já que acompanha o crescimento.",
          "",
          "O exemplo usa um cadastro de salas com os códigos fora de ordem, e duas linhas chamadas Atenas.",
        ]),
        code("csv", salas("Preço"), "Salas!A1: o cadastro, com os códigos fora de ordem e uma sala repetida"),
        code("excel", [
          "G1: =PROCV(102;A2:D6;2;FALSO)",
          "G2: =PROCV(102;A2:D6;2)",
          "G3: =PROCV(101;A2:D6;2)",
          "G4: =PROCV(105;A2:D6;2;FALSO)",
          "G5: =PROCV(999;A2:D6;2;FALSO)",
          "G6: =PROCV(\"Atenas\";B2:D6;2;FALSO)",
          "G7: =PROCV(\"atenas\";B2:D6;2;FALSO)",
        ], "Busca exata, busca aproximada sem querer, valor ausente, repetição e maiúsculas"),
        code("text", [
          "G1:G7 = Delfos / #N/D / #N/D / Atenas / #N/D / 30 / 30",
        ], "Resultado: o quarto argumento faz a diferença; a primeira Atenas é a única vista"),
        code("csv", [
          "Código;Sala;Capacidade",
          "101;Atenas;30",
          "102;Delfos;20",
        ], "Cadastro!A1: um cadastro menor, para inserir uma coluna"),
        code("excel", [
          "F1: =PROCV(102;A2:C3;2;FALSO)",
          "F2: =PROCV(102;A2:C3;3;FALSO)",
          "Inserir: coluna B",
        ], "Duas buscas e uma coluna nova inserida entre o código e o nome"),
        code("text", [
          "formula:G1 = =PROCV(102;A2:D3;2;FALSO)",
          "G1 = 0",
          "G2 = Delfos",
        ], "Resultado: o intervalo cresceu, o índice não; a busca devolve a coluna errada"),
        code("csv", [
          "Mês;jan;fev;mar",
          "Meta;100;120;90",
        ], "Metas!A1: uma tabela com os meses nas colunas"),
        code("excel", [
          "F1: =PROCH(\"fev\";A1:D2;2;FALSO)",
        ], "PROCH: procura na primeira linha"),
        code("text", [
          "F1 = 120",
        ], "Resultado: a meta de fevereiro"),
        prose([
          "A busca exata devolveu `Delfos` e `Atenas`; sem o quarto argumento, o código 102 e o 101, que existem, deram `#N/D`; o código 999, que não existe, também. A busca pelo nome devolveu a capacidade da *primeira* Atenas, 30, e a segunda, de 35 pessoas, nunca apareceu. Com `\"atenas\"` em minúsculas o resultado foi o mesmo.",
          "",
          "Depois da inserção da coluna, a fórmula que buscava o nome ficou com o intervalo `A2:D3` e o índice 2, que agora é a coluna nova em branco: a busca devolveu 0. A que usava o índice 3 passou a devolver o nome, `Delfos`, em vez da capacidade. Nenhuma das duas mostrou erro. A `PROCH` achou a meta de fevereiro na linha de baixo.",
        ]),
        porque([
          "`PROCV` procura na primeira coluna e devolve a primeira ocorrência; toda busca por chave leva `FALSO` no quarto argumento (o padrão é a busca aproximada, que exige ordem). O índice de coluna é um número fixo e quebra quando se insere uma coluna. Use `$` no intervalo ao copiar.",
        ]),
        quebraria([
          "Uma planilha de preços usa `=PROCV(A2;Produtos!A:F;4)` em milhares de linhas, sem o `FALSO`. Como a lista está quase ordenada, a maioria das buscas acerta; algumas devolvem o preço do produto vizinho, sem erro. Os pedidos saem com preços trocados em 2% das linhas durante um ano.",
        ]),
      ],
    },
    {
      title: "PROCX e CORRESPX: a busca moderna",
      order: 1,
      blocks: [
        prose([
          "A **`PROCX`** (*XLOOKUP*) foi criada para eliminar as fragilidades da `PROCV` e está disponível no Microsoft 365 e nas versões recentes do Excel. Em vez de uma tabela e um número de coluna, ela recebe dois intervalos: onde procurar e de onde devolver. `=PROCX(102;A2:A6;B2:B6)` procura o 102 na coluna de códigos e devolve o item correspondente da coluna de nomes. As duas colunas são referências de verdade: se alguém inserir uma coluna entre elas, o Excel ajusta os dois intervalos, e a fórmula continua certa. É o fim do índice que aponta para a coluna errada.",
          "",
          "A sintaxe completa é `PROCX(valor; onde_procurar; de_onde_devolver; [se_não_encontrado]; [modo_de_correspondência]; [modo_de_pesquisa])`, e cada argumento opcional resolve um problema que a `PROCV` deixava para fórmulas auxiliares. O quarto argumento, **se não encontrado**, dispensa o `SENÃODISP`: `=PROCX(999;A2:A6;B2:B6;\"sem sala\")` devolve a mensagem quando o código não existe. Sem ele, o `#N/D` continua aparecendo, o que é desejável quando a ausência deve ser vista.",
          "",
          "O **modo de correspondência** controla como o valor é comparado: 0 (o padrão) é a correspondência exata; −1 aceita o próximo item *menor*; 1 aceita o próximo *maior*; e 2 aceita **curingas**, como em `\"Aten*\"`. A busca é exata por padrão, sem ser preciso dizê-lo, o inverso do padrão arriscado da `PROCV`. O **modo de pesquisa** controla a direção: 1 (padrão) vai do primeiro ao último, −1 do último ao primeiro. Isso resolve o problema das repetições: onde a `PROCV` só enxerga a primeira Atenas, `=PROCX(\"Atenas\";B2:B6;A2:A6;;;-1)` procura de baixo para cima e devolve o código da última, 105. A busca de baixo para cima é também o jeito de pegar o registro *mais recente* quando uma lista é cronológica. Existem ainda modos de busca binária (2 e −2) para listas ordenadas muito grandes, que vale ignorar até que o desempenho seja um problema real.",
          "",
          "Duas diferenças ampliam o alcance. A primeira: a `PROCX` pode **devolver várias colunas de uma vez**. Se o terceiro argumento é um intervalo de mais de uma coluna, `=PROCX(102;A2:A6;B2:D6)`, o resultado se espalha (*spill*) pelas células à direita: nome, capacidade e preço da sala 102, em uma só fórmula, sem repetir a busca três vezes. A segunda: ela procura em **qualquer direção**. A coluna de busca pode estar à direita da de retorno, e `=PROCX(\"Delfos\";B2:B6;A2:A6)` devolve o código a partir do nome, o que a `PROCV` não faz.",
          "",
          "A função irmã, **`CORRESPX`** (*XMATCH*), devolve a *posição* do valor, e não o conteúdo: `=CORRESPX(102;A2:A6)` devolve 4, o código está na quarta linha do intervalo. Ela aceita os mesmos modos de correspondência e pesquisa e é a peça para montar buscas com `ÍNDICE`, tema da próxima seção.",
          "",
          "A `PROCX` não é um substituto universal. Só existe nas versões novas: uma planilha com `PROCX` enviada para quem usa o Excel 2016 chega com `#NOME?`, como o capítulo 1 mostrou, e o arquivo guarda a função com o prefixo `_xlfn.`. Para planilhas que circulam entre pessoas com versões diferentes, `ÍNDICE` com `CORRESP` é a opção de compatibilidade total. Para o trabalho interno em versões recentes, `PROCX` é a escolha: mais curta, mais legível e sem as armadilhas do índice.",
          "",
          "O exemplo aplica a `PROCX` ao mesmo cadastro de salas, passando pelos argumentos opcionais.",
        ]),
        code("csv", salas("Tarifa"), "Salas!A1: o mesmo cadastro"),
        code("excel", [
          "G1: =PROCX(102;A2:A6;B2:B6)",
          "G2: =PROCX(999;A2:A6;B2:B6;\"sem sala\")",
          "G3: =PROCX(\"Atenas\";B2:B6;A2:A6)",
          "G4: =PROCX(\"Atenas\";B2:B6;A2:A6;;;-1)",
          "G5: =PROCX(\"Aten*\";B2:B6;A2:A6;;2)",
          "G6: =PROCX(\"Delfos\";B2:B6;A2:A6)",
          "G7: =PROCX(35;C2:C6;B2:B6;;1)",
          "G8: =PROCX(25;C2:C6;B2:B6;\"nenhuma\";-1)",
          "G9: =CORRESPX(102;A2:A6)",
        ], "Valor ausente, repetição, curinga, busca à esquerda e correspondência aproximada"),
        code("text", [
          "G1:G9 = Delfos / sem sala / 101 / 105 / 101 / 102 / Atenas / Delfos / 4",
        ], "Resultado: na ordem das fórmulas"),
        code("excel", [
          "I1: =PROCX(102;A2:A6;B2:D6)",
        ], "Devolve três colunas de uma vez"),
        code("text", [
          "I1# = Delfos | 20 | 30",
        ], "Resultado: o resultado se espalha pelas células à direita"),
        prose([
          "O código 102 devolveu `Delfos` sem o `FALSO` da `PROCV`, e o 999 devolveu a mensagem escolhida. A primeira Atenas é a sala 101; pesquisando de baixo para cima, a última é a 105; o curinga `Aten*` casou com a primeira. A busca por \"Delfos\" na coluna de nomes devolveu o código, à esquerda, o que a `PROCV` não faz.",
          "",
          "O modo 1 de correspondência, procurando capacidade 35, encontrou a própria sala de 35 pessoas, `Atenas`. Procurando 25 com o modo −1 (o próximo menor), devolveu `Delfos`, de capacidade 20, a maior entre as menores que 25. A `CORRESPX` informou que o código 102 está na quarta posição. E a busca com três colunas de retorno se espalhou em `I1`, `J1` e `K1`: `Delfos`, 20 e 30.",
        ]),
        porque([
          "`PROCX` recebe a coluna de busca e a de retorno como intervalos: aguenta inserção de colunas, procura à esquerda, aceita `se_não_encontrado`, curingas, busca de baixo para cima e devolve várias colunas. É exata por padrão. Só existe nas versões recentes; para compatibilidade, use `ÍNDICE` com `CORRESP`.",
        ]),
        quebraria([
          "Uma planilha de contratos usa `PROCX` e é enviada à filial, que usa o Excel 2016. Todas as buscas viram `#NOME?`, e o gerente da filial, achando que o arquivo veio corrompido, volta a lançar contratos em papel até a TI atualizar as máquinas.",
        ]),
      ],
    },
    {
      title: "ÍNDICE, CORRESP e as faixas: a busca que funciona em qualquer versão",
      order: 2,
      blocks: [
        prose([
          "Antes da `PROCX`, quem precisava de uma busca flexível combinava duas funções, e essa combinação continua valendo: funciona em todas as versões do Excel e em outros programas de planilha, e ensina como a busca realmente acontece. **`CORRESP(valor; intervalo; tipo)`** devolve a *posição* do valor no intervalo; **`ÍNDICE(intervalo; linha; [coluna])`** devolve o conteúdo da posição indicada. Juntas, `=ÍNDICE(B2:B6;CORRESP(102;A2:A6;0))` fazem o que a `PROCX` faz em uma chamada: o `CORRESP` acha que o código 102 está na quarta linha, e o `ÍNDICE` devolve o quarto item da coluna de nomes.",
          "",
          "O terceiro argumento do `CORRESP`, o **tipo**, é a mesma armadilha do quarto argumento da `PROCV`. Com **0**, a busca é exata, e é o que se quer para chaves. Com **1** (o padrão se for omitido), assume uma lista em ordem crescente e devolve a posição do maior valor que não ultrapassa o procurado. Com **−1**, assume ordem decrescente. Usar o tipo 1 numa lista fora de ordem é o mesmo problema: `=CORRESP(102;A2:A6;1)` devolve `#N/D` na lista de códigos desordenados, e há listas em que devolve uma posição errada, sem erro. Toda busca por chave leva 0.",
          "",
          "A combinação resolve as duas limitações da `PROCV`. Como o `ÍNDICE` recebe a coluna de retorno como intervalo, a inserção de colunas não a quebra; e como o `CORRESP` recebe a coluna de busca separada, ela pode estar à direita: `=ÍNDICE(A2:A6;CORRESP(\"Delfos\";B2:B6;0))` busca o código a partir do nome. O `ÍNDICE` também aceita linha *e* coluna, o que permite buscas em duas direções, como o cruzamento de uma sala com um mês. `=ÍNDICE(A2:D6;3;2)` devolve o item da terceira linha e da segunda coluna da tabela, `Olímpia`. E se o número da coluna vem de outro `CORRESP` sobre os cabeçalhos, a busca dispensa números digitados: `ÍNDICE(tabela; CORRESP(sala; salas; 0); CORRESP(mês; meses; 0))`.",
          "",
          "A busca **aproximada** tem lugar legítimo: as **faixas**. Uma tabela de descontos por quantidade, em que 0 a 9 pessoas não têm desconto, 10 a 19 têm 5%, 20 a 29 têm 10% e 30 ou mais têm 15%, é guardada pelo *início* de cada faixa, em ordem crescente: 0, 10, 20, 30. Para 25 pessoas, a busca aproximada devolve a linha do maior início que não passa de 25, o 20, e portanto o desconto de 10%. É a situação em que `PROCV` sem `FALSO`, `CORRESP` com tipo 1 e `PROCX` com modo −1 são o que se quer. Dois cuidados: a tabela *precisa* estar em ordem crescente, e o menor início precisa ser menor ou igual a qualquer valor possível. Um valor abaixo da primeira faixa (como −1, em uma tabela que começa em 0) devolve `#N/D`, e isso é um sinal útil: dado fora do que se previu.",
          "",
          "Com os quatro recursos, a escolha prática se resume assim. Para buscas por chave em versões recentes, `PROCX`. Para planilhas que circulam entre versões, ou que precisam abrir em outros programas, `ÍNDICE` com `CORRESP` de tipo 0. Para faixas, a busca aproximada com a tabela ordenada. E `PROCV` fica para manter o que existe. Em todos os casos, a regra de ouro é a mesma: a busca exata é uma decisão explícita, e a aproximada também.",
          "",
          "O exemplo usa o cadastro de salas e uma tabela de faixas de desconto.",
        ]),
        code("csv", salas("Diária"), "Salas!A1: o cadastro de salas"),
        code("excel", [
          "G1: =ÍNDICE(B2:B6;CORRESP(102;A2:A6;0))",
          "G2: =ÍNDICE(A2:A6;CORRESP(\"Delfos\";B2:B6;0))",
          "G3: =CORRESP(102;A2:A6;0)",
          "G4: =CORRESP(102;A2:A6;1)",
          "G5: =ÍNDICE(A2:D6;3;2)",
        ], "ÍNDICE com CORRESP, busca à esquerda e posição"),
        code("text", [
          "G1:G5 = Delfos / 102 / 4 / #N/D / Olímpia",
        ], "Resultado: o tipo 1 do CORRESP falha em lista desordenada"),
        code("csv", [
          "Pessoas;Desconto",
          "0;0%",
          "10;5%",
          "20;10%",
          "30;15%",
        ], "Faixas!A1: o início de cada faixa, em ordem crescente"),
        code("excel", [
          "D1: =PROCV(25;A2:B5;2)",
          "D2: =PROCV(10;A2:B5;2)",
          "D3: =PROCV(-1;A2:B5;2)",
          "D4: =PROCV(99;A2:B5;2)",
          "D5: =PROCX(25;A2:A5;B2:B5;;-1)",
          "D6: =CORRESP(25;A2:A5;1)",
          "D7: =ÍNDICE(B2:B5;CORRESP(25;A2:A5;1))",
          "D8: =PROCV(25;A2:B5;2;FALSO)",
          "Formato: D1:D2 = 0%",
          "Formato: D4:D5 = 0%",
          "Formato: D7 = 0%",
        ], "A busca aproximada onde ela é a certa"),
        code("text", [
          "D1:D8 = 10% / 5% / #N/D / 15% / 10% / 3 / 10% / #N/D",
        ], "Resultado: 25 pessoas caem na faixa que começa em 20; −1 está abaixo da primeira faixa"),
        prose([
          "O par `ÍNDICE`/`CORRESP` achou `Delfos`, e do outro lado achou o código do `Delfos`. O `CORRESP` de tipo 0 devolveu a posição 4; o de tipo 1, na lista desordenada, devolveu `#N/D`. O `ÍNDICE` com linha 3 e coluna 2 devolveu `Olímpia`.",
          "",
          "Nas faixas, 25 pessoas levaram 10%, o desconto da faixa de 20, em qualquer das formas (`PROCV` aproximado, `PROCX` com −1, `CORRESP` tipo 1 com `ÍNDICE`); o 10 caiu exatamente no início da faixa de 5%; −1, abaixo do menor início, deu `#N/D`; 99 ficou na última faixa, 15%. A busca exata com 25 não encontra nenhum início igual, e `#N/D` mostra que não era a busca certa para faixas.",
        ]),
        porque([
          "`ÍNDICE(retorno; CORRESP(valor; busca; 0))` funciona em qualquer versão, aguenta inserção de colunas e busca à esquerda; o tipo 0 do `CORRESP` é a busca exata. Faixas pedem busca aproximada em tabela ordenada pelo início de cada faixa, e um `#N/D` abaixo da primeira faixa é um alerta útil.",
        ]),
        quebraria([
          "Uma tabela de faixas de comissão é mantida em ordem de digitação: 10%, 5%, 15%, 8%. A busca aproximada devolve o percentual de uma faixa vizinha para cerca de um terço dos vendedores, sem erro. A diretoria só descobre quando o RH compara o total pago com o orçamento.",
        ]),
      ],
    },
    {
      title: "Quando a busca falha: chaves sujas, tipos diferentes e espaços invisíveis",
      order: 3,
      blocks: [
        prose([
          "A reclamação mais comum sobre buscas é \"o valor está na tabela e o Excel diz que não achou\". Quase sempre a causa não está na fórmula, mas na *chave*: o valor procurado e o valor da tabela se parecem na tela e são diferentes para o Excel. Três causas respondem pela maior parte dos casos, e todas têm diagnóstico simples.",
          "",
          "A primeira é o **tipo**: um é número e o outro é texto. O código `101` como número e o `'101` como texto aparecem iguais, mas a busca os trata como valores distintos, e `PROCX('101'; códigos; nomes)` devolve `#N/D` mesmo com o 101 na tabela. A origem usual é a importação de dados (códigos que vêm como texto de sistemas externos) ou o zero à esquerda: o código `0102` como texto nunca será igual ao número `102`. O diagnóstico é a função `TIPO`, ou o alinhamento da célula: números ficam à direita, textos à esquerda. A cura é converter um dos lados, com `VALOR(texto)` para virar número, `--texto` (a negação dupla) como atalho, ou `TEXTO(número;\"0000\")` para virar texto com o zero. Dentro da fórmula de busca, `PROCX(VALOR(B5);...)` resolve sem alterar os dados originais.",
          "",
          "A segunda causa são os **espaços**. Um código digitado, colado ou importado como `\"103 \"`, com um espaço no fim, é um texto diferente de `\"103\"`. A função `NÚM.CARACT(célula)` conta os caracteres e revela a diferença (4 onde deveria haver 3), e **`ARRUMAR`** (*TRIM*) remove os espaços do início e do fim e reduz os espaços repetidos no meio a um só. `=PROCX(VALOR(ARRUMAR(B4)); …)` busca a chave limpa.",
          "",
          "A terceira causa é o **espaço inseparável**, e é a que mais frustra. Dados copiados de páginas da web, de PDF e de alguns sistemas trazem o caractere de código 160 em vez do espaço comum, que parece idêntico na tela. O `ARRUMAR` **não o remove**: `NÚM.CARACT(ARRUMAR(E2))` continua dando 4 onde se esperava 3, e `VALOR(E2)` falha com `#VALOR!`. O diagnóstico é `CÓDIGO(DIREITA(E2;1))`, que devolve 160 em vez de 32, o código do espaço normal. A cura é substituir o caractere explicitamente: `SUBSTITUIR(E2; CARACT(160); \"\")`. A função `TIRAR` (*CLEAN*) remove caracteres de controle como quebras de linha, mas também não resolve o 160. Quem importa dados da web com frequência faz bem em criar uma coluna de limpeza padronizada, `=ARRUMAR(SUBSTITUIR(texto;CARACT(160);\" \"))`, e buscar sobre ela.",
          "",
          "Há uma pegadinha adicional nas funções de contagem: `CONT.SE` **converte** o texto que parece número, ao contrário das buscas. `CONT.SE(B2:B6;102)` conta como 102 tanto os números quanto o texto `\"0102\"`, e `CONT.SE(códigos; B3)`, com `B3` igual ao texto `'101`, devolve 1 mesmo que a `PROCX` não o encontre. Isso torna a contagem um mau teste de existência antes da busca: ela diz \"existe\" onde a busca dirá \"não achei\". Para testar se a chave existe da mesma forma que a busca, a verificação deve usar a mesma função, ou a mesma conversão, que a busca usa.",
          "",
          "O método de diagnóstico, então, é sistemático. Primeiro, `TIPO` nos dois lados. Segundo, `NÚM.CARACT` nos dois lados, para achar espaços. Terceiro, `CÓDIGO` do último caractere, se os comprimentos não explicam. Quarto, olhar as duplicatas, que a busca ignora depois da primeira (ou da última, com `PROCX` de baixo para cima). A limpeza deve acontecer o mais perto possível da origem dos dados, uma vez, em vez de em cada busca.",
          "",
          "O exemplo usa a tabela de salas e uma lista de reservas cujos códigos chegaram sujos de quatro maneiras diferentes.",
        ]),
        code("csv", [
          "Código;Sala",
          "101;Atenas",
          "102;Delfos",
          "103;Tebas",
        ], "Salas!A1: o cadastro, com os códigos como números"),
        code("csv", [
          "Reserva;Código",
          "R1;102",
          "R2;'101",
          "R3;'103 ",
          "R4;'0102",
          "R5;102",
        ], "Reservas!A1: códigos como número (R1, R5), como texto (R2), com espaço no fim (R3) e com zero à esquerda (R4)"),
        code("excel", [
          "C2: =PROCX(B2;Salas!A2:A4;Salas!B2:B4;\"?\")",
          "C3: =PROCX(B3;Salas!A2:A4;Salas!B2:B4;\"?\")",
          "C4: =PROCX(B4;Salas!A2:A4;Salas!B2:B4;\"?\")",
          "C5: =PROCX(B5;Salas!A2:A4;Salas!B2:B4;\"?\")",
          "D2: =TIPO(B2)&TIPO(B3)",
          "D3: =NÚM.CARACT(B4)",
          "D4: =NÚM.CARACT(ARRUMAR(B4))",
          "D5: =PROCX(VALOR(ARRUMAR(B4));Salas!A2:A4;Salas!B2:B4;\"?\")",
          "D6: =PROCX(VALOR(B5);Salas!A2:A4;Salas!B2:B4;\"?\")",
          "D7: =CONT.SE(B2:B6;102)",
          "D8: =CONT.SE(Salas!A2:A4;B3)",
          "D9: =PROCX(--B3;Salas!A2:A4;Salas!B2:B4;\"?\")",
        ], "A busca direta em cada tipo de chave, o diagnóstico e as correções"),
        code("text", [
          "C2:C5 = Delfos / ? / ? / ?",
          "D2 = 12",
          "D3:D4 = 4 / 3",
          "D5:D6 = Tebas / Delfos",
          "D7:D8 = 3 / 1",
          "D9 = Atenas",
        ], "Resultado: só a primeira busca achou; as correções recuperaram as outras"),
        code("excel", [
          "E2: =\"103\"&CARACT(160)",
          "E3: =NÚM.CARACT(ARRUMAR(E2))",
          "E4: =NÚM.CARACT(SUBSTITUIR(E2;CARACT(160);\"\"))",
          "E5: =PROCX(VALOR(SUBSTITUIR(E2;CARACT(160);\"\"));Salas!A2:A4;Salas!B2:B4;\"?\")",
          "E6: =VALOR(E2)",
          "E7: =CÓDIGO(DIREITA(E2;1))",
          "E8: =NÚM.CARACT(TIRAR(E2))",
        ], "O espaço inseparável: ARRUMAR e TIRAR não o removem; SUBSTITUIR sim"),
        code("text", [
          "E3:E8 = 4 / 3 / Tebas / #VALOR! / 160 / 4",
        ], "Resultado: o caractere 160 sobrevive ao ARRUMAR e ao TIRAR"),
        prose([
          "Das quatro reservas, só a R1, com o código numérico, encontrou a sala. A R2, com o 101 em texto, a R3, com o espaço no fim, e a R4, com o zero à esquerda, devolveram a mensagem `?`. O diagnóstico confirmou cada caso: `TIPO` 1 e 2 para número e texto, 4 caracteres no código da R3 e 3 depois do `ARRUMAR`. As conversões recuperaram `Tebas` e `Delfos`, e a negação dupla resolveu a R2 com `Atenas`.",
          "",
          "A contagem desmentiu as buscas: três códigos entram na conta do 102, o número duas vezes e o texto `0102`, e o texto `'101` foi contado como existente. O espaço inseparável resistiu ao `ARRUMAR` (quatro caracteres) e ao `TIRAR`; o `CÓDIGO` do último caractere revelou o 160, e o `SUBSTITUIR` o eliminou, recuperando a busca.",
        ]),
        porque([
          "Quando a busca falha com a chave à vista, compare `TIPO` e `NÚM.CARACT` dos dois lados. Converta com `VALOR`/`--`, limpe com `ARRUMAR` e, para o espaço inseparável da web (código 160), com `SUBSTITUIR(texto;CARACT(160);\"\")`. `CONT.SE` converte texto em número e não serve de teste de existência para a busca.",
        ]),
        quebraria([
          "Um importador traz os CNPJ de fornecedores de uma página da web, com o espaço inseparável no fim. A conciliação diz que 300 dos 1.200 pagamentos são \"de fornecedores não cadastrados\". A equipe financeira digita os cadastros de novo e cria 300 duplicatas, bloqueadas depois pelo sistema bancário.",
        ]),
      ],
    },
  ],
};

export const OFFICE_BOOK_05_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "intermediate",
    promptMd: "Uma tabela de produtos tem os códigos fora de ordem. Um colega escreveu `=PROCV(A2;Produtos!$A$2:$D$500;3)`, sem o quarto argumento, e em algumas linhas o preço vem de outro produto, sem nenhum erro. Qual é a causa?",
    choices: [
      "Sem o quarto argumento, a busca é aproximada e supõe a primeira coluna em ordem crescente, devolvendo a linha de um vizinho",
      "O índice de coluna 3 está errado e deveria ser 4",
      "A PROCV só funciona se a tabela estiver em outra planilha",
      "O intervalo precisava de referências relativas, sem os cifrões",
    ],
    answerKeyMd: "Sem o quarto argumento, a busca é aproximada e supõe a primeira coluna em ordem crescente, devolvendo a linha de um vizinho",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "intermediate",
    promptMd: "Uma planilha tem `=PROCV(B2;Salas!A:D;2;FALSO)` em 300 linhas. Depois que alguém inseriu a coluna \"Bloco\" entre o código e o nome na aba Salas, todas as linhas passaram a mostrar o bloco em vez do nome. Explique o que aconteceu com o intervalo e com o índice, e reescreva a fórmula de duas formas que não sofram do problema.",
    answerKeyMd: "O Excel ajustou o intervalo (A:D passou a A:E) mas não o índice 2, que é um número fixo: com a coluna nova na posição 2, a busca devolve o Bloco. Reescritas: (1) =PROCX(B2;Salas!A:A;Salas!B:B) — a coluna de retorno é uma referência e acompanha a inserção; (2) =ÍNDICE(Salas!B:B;CORRESP(B2;Salas!A:A;0)) — mesma robustez, e funciona em versões sem PROCX. Ambos, ao contrário da PROCV, referenciam a coluna de retorno diretamente (ou a calculam), em vez de depender de um número de posição.",
    rubricMd: "Explica que o intervalo é ajustado e o índice não; propõe PROCX e ÍNDICE/CORRESP com justificativa de referência direta.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "Os códigos de produto de uma importação chegam como texto e alguns terminam com o espaço inseparável (caractere 160) que veio de uma página da web. A tabela de produtos tem os códigos como números. Escreva uma fórmula em C2 que busque o nome do produto (tabela em Produtos!A2:A500 e Produtos!B2:B500) a partir do código textual em B2, tratando o espaço inseparável, o espaço comum e a diferença de tipo, e devolvendo \"não cadastrado\" quando não houver. Explique o papel de cada função.",
    answerKeyMd: "```\n=PROCX(VALOR(ARRUMAR(SUBSTITUIR(B2;CARACT(160);\" \")));Produtos!A2:A500;Produtos!B2:B500;\"não cadastrado\")\n```\n\nSUBSTITUIR troca o espaço inseparável (160) por espaço comum, porque ARRUMAR não o reconhece; ARRUMAR remove os espaços do início e do fim; VALOR converte o texto limpo em número, para casar com os códigos numéricos da tabela; PROCX faz a busca exata e devolve o quarto argumento quando o código não existe, o que dispensa SENÃODISP e mantém visíveis outros erros.",
    points: 20,
  },
];

export const OFFICE_BOOK_05_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Qual o padrão do quarto argumento da PROCV, e por que é perigoso?", backMd: "VERDADEIRO (busca aproximada), que exige ordem crescente: em listas desordenadas devolve #N/D ou o vizinho. Busca por chave leva FALSO." },
  { nodeTitle: NODE, frontMd: "Por que inserir uma coluna quebra a PROCV?", backMd: "O Excel ajusta o intervalo, mas o índice de coluna é um número fixo e passa a apontar para a coluna errada." },
  { nodeTitle: NODE, frontMd: "O que a PROCX tem que a PROCV não tem?", backMd: "Retorno como intervalo (aguenta inserção), busca à esquerda, se_não_encontrado, curingas, busca de baixo para cima e várias colunas. Exata por padrão." },
  { nodeTitle: NODE, frontMd: "ÍNDICE + CORRESP: como combinar?", backMd: "=ÍNDICE(retorno; CORRESP(valor; busca; 0)). O tipo 0 é a busca exata; funciona em qualquer versão." },
  { nodeTitle: NODE, frontMd: "A busca falha com a chave à vista: o que checar?", backMd: "TIPO (número × texto), NÚM.CARACT (espaços), CÓDIGO do último caractere (160 = espaço inseparável, que só SUBSTITUIR(...;CARACT(160);\"\") remove)." },
];
