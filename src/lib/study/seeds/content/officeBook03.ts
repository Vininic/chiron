// Pacote Office, reescrita autoral (PLANO.md §R.2) — capítulo 3.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Excel: referências, tabelas, nomes e dados organizados";

export const OFFICE_BOOK_03: ContentChapter = {
  title: NODE,
  level: "intermediario",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Referências relativas, absolutas e mistas",
      order: 0,
      blocks: [
        prose([
          "Uma fórmula do Excel não guarda \"a célula B2\". Guarda uma posição *em relação à célula onde a fórmula está*: \"duas colunas à esquerda e uma linha acima\", por exemplo. É por isso que copiar uma fórmula funciona: quando `=B2*C2`, escrita em D2, é copiada para D3, o Excel preserva a relação (as duas colunas à esquerda e a mesma linha) e escreve `=B3*C3`. Essa é a **referência relativa**, o comportamento padrão, e é o que torna possível preencher uma coluna inteira arrastando a alça de uma fórmula.",
          "",
          "A relação nem sempre é a desejada. Uma taxa digitada em uma célula (digamos, F1) e usada em toda uma coluna precisa ficar *parada* quando a fórmula é copiada. Para isso existe a **referência absoluta**, em que o cifrão fixa a coluna, a linha, ou as duas: `$F$1` não muda, aonde quer que a fórmula seja copiada. Há ainda as **referências mistas**: `$F1` fixa só a coluna e deixa a linha mudar, `F$1` fixa só a linha. No teclado, a tecla **F4**, com o cursor sobre a referência dentro da fórmula, alterna as quatro formas (`F1`, `$F$1`, `F$1`, `$F1`).",
          "",
          "O erro clássico é esquecer o cifrão. Com a taxa em F1 e `=D2*F1` escrita em E2, a cópia para E3 vira `=D3*F2`, e para E4, `=D4*F3`. Como F2 e F3 estão vazias, o Excel as trata como zero: a primeira linha dá o valor certo e todas as outras, zero. O defeito é traiçoeiro por isso: o primeiro resultado, o único que quem escreve a fórmula costuma conferir, está correto. A correção é `=D2*$F$1`, que se mantém igual em todas as linhas.",
          "",
          "As referências mistas resolvem as tabelas de duas entradas. Numa tabuada, com os multiplicadores em B1:D1 e os multiplicandos em A2:A4, uma única fórmula em B2 preenche toda a grade: `=$A2*B$1`. A coluna A fica presa (cada linha usa o seu próprio multiplicando) e a linha 1 fica presa (cada coluna usa o seu próprio multiplicador). Copiada para a direita e para baixo, a fórmula percorre as nove células sem ser reescrita. O mesmo desenho aparece em tabelas de preços por faixa, em cronogramas com semanas nas colunas e em matrizes de custos.",
          "",
          "Duas observações sobre o que é copiado. Primeiro, o **recortar e colar** (`Ctrl+X`, `Ctrl+V`) se comporta de outra forma: move a célula e mantém as referências *como estavam*, apontando para os mesmos endereços de antes, sem ajustar nada. Quem recorta uma fórmula de E2 para G2 vê `=D2*F1` continuar igual, enquanto a cópia teria virado `=F2*H1`. Segundo, referências para outras planilhas têm o nome antes do ponto de exclamação: `Planilha2!B2`, e `'Reservas de 2026'!B2` com aspas simples quando o nome tem espaços.",
          "",
          "O que acontece quando a célula referenciada deixa de existir? Excluir uma linha ou coluna inteira que uma fórmula usa dispara `#REF!`, o erro de referência inválida. A fórmula é *reescrita* com o texto `#REF!` no lugar da referência, e não há como recuperá-la sem desfazer a exclusão. Se, em vez disso, a fórmula usa um *intervalo* e uma das linhas dele é excluída, o Excel encolhe o intervalo: `=SOMA(C2:C4)` vira `=SOMA(C2:C3)`, sem erro e sem aviso. Esse segundo caso é o mais perigoso, porque o total continua parecendo certo.",
          "",
          "Os exemplos usam a tabela de reservas do capítulo anterior, com uma taxa de serviço em F1. O primeiro mostra o erro do cifrão esquecido e a correção; o segundo, a tabuada com referências mistas; o terceiro, a exclusão de uma linha.",
        ]),
        code("csv", [
          "Sala;Pessoas;Tarifa",
          "Atenas;12;45",
          "Delfos;8;30",
          "Tebas;5;60",
        ], "Reservas!A1: três salas, a quantidade de pessoas e o preço por pessoa"),
        code("excel", [
          "F1: 0,1",
          "D2: =B2*C2",
          "Copiar: D2 -> D3:D4",
          "E2: =D2*F1",
          "Copiar: E2 -> E3:E4",
          "G2: =D2*$F$1",
          "Copiar: G2 -> G3:G4",
        ], "A taxa em F1; E sem cifrão, G com referência absoluta"),
        code("text", [
          "formula:D3 = =B3*C3",
          "formula:E3 = =D3*F2",
          "formula:E4 = =D4*F3",
          "formula:G3 = =D3*$F$1",
          "D2:D4 = 540 / 240 / 300",
          "E2:E4 = 54 / 0 / 0",
          "G2:G4 = 54 / 24 / 30",
        ], "Resultado: a fórmula sem cifrão deriva; a absoluta fica parada"),
        code("csv", [
          ";1;2;3",
          "1",
          "2",
          "3",
        ], "Tabuada!A1: multiplicadores na linha 1 e multiplicandos na coluna A"),
        code("excel", [
          "B2: =$A2*B$1",
          "Copiar: B2 -> B2:D4",
        ], "Uma só fórmula, com referências mistas, preenche a grade"),
        code("text", [
          "B2:D4 = 1 | 2 | 3 / 2 | 4 | 6 / 3 | 6 | 9",
          "formula:D4 = =$A4*D$1",
          "formula:C3 = =$A3*C$1",
        ], "Resultado: a coluna A e a linha 1 ficam presas"),
        code("csv", [
          "Sala;Pessoas;Diária",
          "Atenas;12;45",
          "Delfos;8;30",
          "Tebas;5;60",
        ], "Contas!A1: a mesma tabela, para a exclusão de uma linha"),
        code("excel", [
          "E1: =C3",
          "E2: =SOMA(C2:C4)",
          "Excluir: linha 3",
        ], "Uma fórmula que aponta para a linha 3 e outra que soma um intervalo"),
        code("text", [
          "formula:E1 = =#REF!",
          "E1 = #REF!",
          "formula:E2 = =SOMA(C2:C3)",
          "E2 = 105",
        ], "Resultado: a referência direta quebra; o intervalo encolhe sem aviso"),
        prose([
          "A coluna E, sem o cifrão, mostrou o defeito descrito: `54` na primeira linha, que está certa, e zero nas outras duas, porque as fórmulas passaram a ler F2 e F3, que estão vazias. A coluna G, com `$F$1`, deu 54, 24 e 30, a taxa de 10% sobre cada total. Na tabuada, uma só fórmula virou nove, e cada célula leu o multiplicando da sua linha e o multiplicador da sua coluna.",
          "",
          "Na exclusão, `E1` virou `=#REF!` e passou a mostrar o erro, enquanto `E2`, que somava `C2:C4`, passou a somar `C2:C3` e mostrou 105, a soma de 45 e 60: a linha de Delfos sumiu do total e ninguém foi avisado.",
        ]),
        porque([
          "Referência relativa acompanha a fórmula quando ela é copiada; `$` a prende. Use `$F$1` para constantes, `$A2` e `B$1` para tabelas de duas entradas, e confira a última linha de uma coluna copiada, não só a primeira. Excluir células que fórmulas usam gera `#REF!` ou encolhe intervalos em silêncio.",
        ]),
        quebraria([
          "Uma planilha de comissões usa a alíquota de F1 em `=D2*F1`, copiada por 400 linhas. A primeira linha, a única conferida, está certa; as outras 399 multiplicam por células vazias e mostram zero. Os vendedores recebem a comissão de um único pedido no mês.",
        ]),
      ],
    },
    {
      title: "Tabelas do Excel: nomes, expansão e referências estruturadas",
      order: 1,
      blocks: [
        prose([
          "Um intervalo de células é apenas isso: células vizinhas com dados. O Excel não sabe que A1:C4 é uma lista de reservas, que a linha 1 é o cabeçalho, nem que a lista vai crescer. Tudo o que depende desse conhecimento (ajustar uma soma quando entra uma linha nova, atualizar um gráfico, preencher uma fórmula em todas as linhas) precisa ser refeito à mão, e o descuido é fonte de relatórios com a última linha de fora. A solução é transformar o intervalo em uma **Tabela do Excel** (*Inserir > Tabela*, ou `Ctrl+T`), um objeto com nome, cabeçalhos e comportamento próprio.",
          "",
          "Uma tabela traz quatro vantagens práticas. A primeira é a **expansão automática**: digitar na linha imediatamente abaixo da tabela incorpora essa linha a ela, com a formatação, as fórmulas e a validação das linhas anteriores. A segunda são as **colunas calculadas**: ao escrever uma fórmula em uma célula de uma coluna, o Excel a preenche na coluna inteira, e as linhas futuras já nascem com ela. A terceira é a **referência estruturada**, que dá aos dados nomes que se leem como frases. A quarta é a integração: gráficos, tabelas dinâmicas e validações que se baseiam em uma tabela acompanham o seu crescimento sem ajuste.",
          "",
          "A referência estruturada tem uma sintaxe própria. `Reservas[Total]` é a coluna Total da tabela Reservas, sem os cabeçalhos; `=SOMA(Reservas[Total])` é a soma dessa coluna, qualquer que seja o número de linhas. Dentro da tabela, `[@Pessoas]` é o valor da coluna Pessoas *na linha da própria fórmula*, e `=[@Pessoas]*[@Preço]` é a multiplicação que antes seria `=B2*C2`. Os qualificadores especiais, em português, são `[#Dados]` (as linhas de dados), `[#Cabeçalhos]` (a linha de títulos), `[#Totais]` (a linha de totais, quando ativada) e `[#Tudo]` (tudo isso junto). Em `LINS(Reservas[#Dados])`, o resultado é a quantidade de linhas de dados, e em `COLS(Reservas[#Tudo])`, a quantidade de colunas.",
          "",
          "O nome da tabela vale para a pasta de trabalho inteira, deve começar por letra ou sublinhado, não pode ter espaços e não pode repetir o nome de outra tabela ou de um nome definido. Por padrão, o Excel dá nomes como `Tabela1`; vale trocar logo por um nome que diga o que a tabela guarda, em *Design da Tabela > Nome da Tabela*. O resultado é uma fórmula legível, `=SOMA(Reservas[Total])`, no lugar de `=SOMA(Planilha1!$D$2:$D$400)`.",
          "",
          "Há restrições que surpreendem. Uma tabela não aceita **fórmulas de matriz dinâmica com derramamento** dentro dela: uma fórmula como `=SEQUÊNCIA(2)` em uma célula da tabela devolve `#DESPEJAR!`, o erro que o Excel em português dá quando o resultado não tem onde se espalhar. Tabelas não podem ter células mescladas, e os cabeçalhos precisam ser textos únicos. E a expansão automática só ocorre quando a linha nova é *contígua* à tabela: dados digitados duas linhas abaixo, deixando uma em branco, ficam de fora.",
          "",
          "Um cuidado na criação: o Excel adivinha se a primeira linha é cabeçalho. Em listas cujo cabeçalho tem a mesma aparência dos dados (por exemplo, se todas as colunas forem de texto), a suposição pode falhar e o Excel criar `Coluna1`, `Coluna2` e empurrar o cabeçalho real para uma linha de dados. Conferir a opção *A tabela tem cabeçalhos* na caixa de diálogo evita o problema.",
          "",
          "O primeiro exemplo cria a tabela, escreve a coluna calculada, soma por referência estruturada e depois adiciona uma linha. O segundo mostra a restrição à matriz dinâmica.",
        ]),
        code("csv", [
          "Sala;Pessoas;Preço",
          "Atenas;12;45",
          "Delfos;8;30",
          "Tebas;5;60",
        ], "Reservas!A1: a lista, ainda como intervalo comum"),
        code("excel", [
          "Tabela: Reservas = A1:C4",
          "D1: Total",
          "D2: =[@Pessoas]*[@Preço]",
          "F1: =SOMA(Reservas[Total])",
          "F3: =LINS(Reservas[#Dados])",
          "F4: =COLS(Reservas[#Tudo])",
        ], "Uma tabela, uma coluna calculada e fórmulas com referências estruturadas"),
        code("text", [
          "D2:D4 = 540 / 240 / 300",
          "formula:D3 = =[@Pessoas]*[@Preço]",
          "F1 = 1080",
          "F3 = 3",
          "F4 = 4",
        ], "Resultado: a fórmula escrita em D2 foi para toda a coluna"),
        code("excel", [
          "A5: Fortaleza",
          "B5: 20",
          "C5: 10",
        ], "Uma linha nova, digitada logo abaixo da tabela"),
        code("text", [
          "A5:D5 = Fortaleza | 20 | 10 | 200",
          "formula:D5 = =[@Pessoas]*[@Preço]",
          "F1 = 1280",
          "formula:F1 = =SOMA(Reservas[Total])",
          "F3 = 4",
        ], "Resultado: a tabela incorporou a linha, calculou o total e atualizou a soma"),
        code("csv", [
          "Sala;Lugares",
          "Atenas;12",
          "Delfos;8",
        ], "Faixas!A1: outra lista, para a restrição às matrizes dinâmicas"),
        code("excel", [
          "Tabela: Faixas = A1:B3",
          "E2: =SEQUÊNCIA(3)",
          "C1: Faixa",
          "C2: =SEQUÊNCIA(2)",
        ], "SEQUÊNCIA fora da tabela (E) e na coluna ao lado dela, que a tabela absorve (C)"),
        code("text", [
          "E2:E4 = 1 / 2 / 3",
          "C2:C3 = #DESPEJAR! / #DESPEJAR!",
        ], "Resultado: a matriz se espalha fora da tabela e falha dentro dela"),
        prose([
          "A fórmula escrita uma só vez em D2 foi parar nas três linhas: a coluna calculada fez o trabalho. A soma por referência estruturada deu 1.080 e `LINS(Reservas[#Dados])` contou três linhas, enquanto `COLS(Reservas[#Tudo])` contou quatro colunas, porque o cabeçalho e a coluna Total entram no `[#Tudo]`.",
          "",
          "A linha digitada em A5:C5 foi absorvida pela tabela, ganhou a fórmula na coluna Total (200) e a soma subiu para 1.280, sem nenhuma edição na fórmula de F1. Na segunda tabela, `SEQUÊNCIA(3)` fora da tabela se espalhou por três células, e `SEQUÊNCIA(2)` na coluna C, que a tabela incorporou ao ganhar o cabeçalho `Faixa`, devolveu o erro nas duas linhas.",
        ]),
        porque([
          "Transforme listas em Tabelas e nomeie-as. Colunas calculadas, expansão automática e referências estruturadas (`Reservas[Total]`, `[@Pessoas]`) eliminam as somas \"que esqueceram a última linha\". Dentro de uma tabela não cabem matrizes dinâmicas, e a linha nova precisa ser contígua.",
        ]),
        quebraria([
          "O relatório mensal soma `=SOMA(D2:D400)` sobre uma lista que chega a 412 linhas em dezembro. A soma ignora as 12 últimas, o faturamento do ano fica subavaliado e a diferença só aparece na auditoria. Com uma Tabela e `=SOMA(Reservas[Total])`, o defeito não existiria.",
        ]),
      ],
    },
    {
      title: "Nomes definidos: dar nome a uma célula, a um valor ou a uma fórmula",
      order: 2,
      blocks: [
        prose([
          "Uma fórmula como `=C2*(1+$F$1)` obriga quem a lê a olhar para a célula F1 e adivinhar o que ela guarda. Um **nome definido** troca o endereço por um rótulo: com a célula F1 chamada `IVA`, a mesma fórmula vira `=C2*(1+IVA)` e se lê sozinha. Nomes servem para três coisas: dar significado a *constantes* (a alíquota, o prazo, o limite de crédito), nomear *células ou intervalos* usados em muitos lugares e guardar *fórmulas* reutilizáveis.",
          "",
          "Um nome é criado em *Fórmulas > Definir Nome*, ou selecionando a célula e digitando o nome na caixa à esquerda da barra de fórmulas, e é gerenciado no **Gerenciador de Nomes** (`Ctrl+F3`), que lista todos, com o que cada um referencia e o escopo. Por padrão, o escopo é a **pasta de trabalho inteira**: o nome vale em qualquer planilha. É possível definir um nome com escopo de **uma planilha**, útil quando cada planilha tem a sua própria taxa. Como os nomes de pasta de trabalho são compartilhados, convém tratá-los com o mesmo cuidado que variáveis globais em um programa.",
          "",
          "As regras de um nome são restritas, e o Excel as aplica na hora de definir. Deve começar por letra, sublinhado ou barra invertida; pode conter letras (inclusive acentuadas, como em `Preço`), números, sublinhados e pontos; **não pode ter espaços**, por isso a convenção é `Total_Geral`; e **não pode parecer um endereço de célula**. Essa última regra pega os desavisados: `A1`, `XFD1`, `R1C1` e também `IVA2026` são recusados, porque `IVA2026` seria a coluna `IVA`, linha 2026, um endereço válido (as colunas vão até `XFD`). `Taxa_2026` é aceito, assim como `XFE1`, que está depois da última coluna. As letras isoladas `R` e `C` também são recusadas, por causa do estilo de referência L1C1. Os nomes não diferenciam maiúsculas: `taxa` e `TAXA` são o mesmo nome, e o Excel reescreve a fórmula com a grafia do nome definido.",
          "",
          "Um nome pode referenciar muito mais do que uma célula. Pode conter uma **constante**: definir `IVA` como `=0,18` dispensa a célula auxiliar, ao custo de a taxa ficar escondida no Gerenciador de Nomes, onde quem edita a planilha raramente olha. Pode conter uma **fórmula**, como o nome `Ultima_Linha` definido por uma expressão que acha a última linha de uma lista. E pode referenciar um intervalo, que nomes como `Preços` tornam fáceis de usar em funções: `=MÉDIA(Preços)`.",
          "",
          "A escolha entre célula nomeada e constante nomeada é de transparência. Uma taxa em uma célula visível, com o nome `IVA`, pode ser vista, comentada e alterada por quem usa a planilha. Uma constante só no Gerenciador de Nomes fica oculta, o que serve para valores que *não devem mudar* (como o número de dias de uma semana) e é um risco para valores que mudam (como a alíquota). Para a maior parte dos casos, vale preferir a célula visível.",
          "",
          "Nomes têm um custo, que é o de se acumularem. Planilhas copiadas de modelos antigos carregam dezenas de nomes que apontam para células que já não existem (`#REF!`) ou para outras pastas de trabalho, e continuam aparecendo no Gerenciador de Nomes. Eles não fazem mal por si, mas confundem quem herda o arquivo e aumentam o tamanho dele; a limpeza periódica do Gerenciador de Nomes (o filtro \"Nomes com erros\" ajuda) faz parte da manutenção de qualquer planilha.",
          "",
          "O exemplo define uma constante, uma célula e um intervalo com nomes, usa-os em fórmulas e lista o que a pasta de trabalho guarda.",
        ]),
        code("csv", [
          "Sala;Pessoas;Preço",
          "Atenas;12;45",
        ], "Reservas!A1: uma reserva"),
        code("excel", [
          "Nome: IVA = =0,18",
          "Nome: Sala_Atenas = A2",
          "Nome: Preços = C2",
          "D2: =C2*(1+IVA)",
          "D3: =Sala_Atenas&\"!\"",
          "D4: =MÉDIA(Preços)",
        ], "Uma constante, uma célula e um intervalo com nome"),
        code("text", [
          "D2 = 53,1",
          "D3 = Atenas!",
          "D4 = 45",
          "nomes:todos = IVA = =0,18 / Preços = =Reservas!$C$2 / Sala_Atenas = =Reservas!$A$2",
        ], "Resultado: os nomes em uso e o que o Gerenciador de Nomes lista"),
        prose([
          "A fórmula com `IVA` calculou 45 vezes 1,18, ou 53,10, sem nenhuma referência de célula. `Sala_Atenas` devolveu o texto da célula A2 e `Preços` entrou na função como um intervalo. O Gerenciador de Nomes mostra os três nomes, com a constante guardada como `=0,18` e as referências como endereços absolutos da planilha Reservas.",
          "",
          "Nada na planilha indica ao leitor que existe um `IVA`: a alíquota só aparece na lista de nomes. Quem a quiser alterar precisa saber onde procurar, que é o custo da constante nomeada.",
        ]),
        porque([
          "Dê nomes a constantes e a células-chave: `=C2*(1+IVA)` lê-se sozinha. Nomes não têm espaços, não imitam endereços (`IVA2026` é recusado) e valem na pasta de trabalho inteira; prefira a célula visível à constante escondida para valores que mudam, e limpe nomes quebrados.",
        ]),
        quebraria([
          "Um modelo financeiro herdado define `Meta` como uma constante `=1500000` dentro do Gerenciador de Nomes. A diretoria muda a meta para 1,8 milhão e atualiza a célula que parecia a meta, na primeira planilha. O nome continua valendo 1,5 milhão, e os relatórios que o usam mostram, por um trimestre, o cumprimento de uma meta que já não existia.",
        ]),
      ],
    },
    {
      title: "Organizar os dados: validação, classificação e filtro",
      order: 3,
      blocks: [
        prose([
          "Uma planilha é tão confiável quanto os dados que recebe. A **validação de dados** (*Dados > Validação de Dados*) define o que cada célula aceita: um número inteiro entre 1 e 20, uma data dentro do ano, um item de uma lista, um texto de até dez caracteres. Quando alguém digita um valor fora da regra, o Excel exibe uma mensagem e recusa a entrada. O recurso é uma das melhores defesas contra erros de digitação em planilhas compartilhadas, e custa pouco: uma coluna de status com a lista `Aberto;Em andamento;Concluído` elimina variações como \"Concluido\" e \"concluído \" que quebram filtros e contagens.",
          "",
          "Há um limite que precisa ficar claro: a validação **só protege a digitação**. Valores colados de outra planilha, importados de um arquivo ou já presentes antes de a regra existir *não são verificados*, e o Excel não reclama deles. O recurso para encontrar o que passou despercebido é o **Circular Dados Inválidos**, no mesmo menu, que desenha um círculo ao redor das células que violam a regra. É tarefa de revisão, e não de entrada. Para dados importados em volume, convém aplicar a regra e circular os inválidos antes de confiar na coluna.",
          "",
          "As regras mais usadas são as de **lista** (os itens podem estar na própria regra, separados por ponto e vírgula, ou em um intervalo da planilha, o que permite manter a lista em um lugar só), as de **número inteiro** e **decimal** com limites, as de **data** e **hora** dentro de um período, a de **comprimento do texto** e a **personalizada**, que aceita uma fórmula que devolve `VERDADEIRO` ou `FALSO`, como `=CONT.SE($A$2:$A$100;A2)=1` para impedir repetições. A mensagem de erro e a mensagem de entrada, opcionais, explicam a regra a quem digita e valem o tempo de escrever.",
          "",
          "A **classificação** (*Dados > Classificar*) ordena as linhas por uma ou mais colunas, em ordem crescente ou decrescente. O ponto crítico é *selecionar a tabela inteira*: classificar só uma coluna embaralha os dados, deixando os valores desta e as outras colunas em ordens diferentes. A classificação reordena o conteúdo das células, de modo que fórmulas que usam referências relativas à própria linha continuam certas, mas fórmulas que apontam para outras linhas por endereço podem mudar de sentido. Numa Tabela do Excel, as linhas sempre andam juntas, e a classificação não tem esse risco.",
          "",
          "O **filtro** (*Dados > Filtro*) esconde as linhas que não atendem aos critérios, sem apagá-las. As linhas continuam existindo, e é aí que moram as armadilhas. A `SOMA` de uma coluna inclui as linhas *escondidas*, de modo que o total na barra de status, que considera só as visíveis, e a fórmula `=SOMA(B2:B6)` discordam. A função **`SUBTOTAL`** resolve: com o código 109 (soma, ignorando as linhas ocultas pelo filtro), `=SUBTOTAL(109;B2:B6)` soma só o que está visível, e o código 103 conta apenas as linhas visíveis. Copiar e colar de um intervalo filtrado copia só as linhas visíveis, o que costuma ser o desejado, e excluir as linhas visíveis de um filtro exclui só essas.",
          "",
          "Para usar os três recursos com segurança, uma regra simples: os dados devem formar um bloco retangular, com um cabeçalho de uma linha, sem linhas ou colunas totalmente vazias no meio e sem células mescladas. Com isso, o Excel detecta sozinho o intervalo certo, e as ferramentas funcionam sem seleção manual. O exemplo aplica regras a uma lista de reservas com valores inválidos, classifica a lista e a filtra.",
        ]),
        code("csv", [
          "Sala;Pessoas;Data",
          "Atenas;12;01/02/2026",
          "Delfos;8;15/03/2026",
          "Tebas;25;10/04/2026",
          "Ágora;-3;05/05/2026",
          "Atenas;5;31/12/2027",
        ], "Validação!A1: reservas, algumas fora do que se esperava"),
        code("excel", [
          "Validação: B2:B6 = inteiro entre 1 e 20",
          "Validação: A2:A6 = lista Atenas;Delfos;Tebas",
          "Validação: C2:C6 = data entre 01/01/2026 e 31/12/2026",
        ], "Três regras: pessoas, sala e data"),
        code("text", [
          "validar:B2 = VERDADEIRO",
          "validar:B4 = FALSO",
          "validar:B5 = FALSO",
          "validar:A2 = VERDADEIRO",
          "validar:A5 = FALSO",
          "validar:C2 = VERDADEIRO",
          "validar:C6 = FALSO",
        ], "Resultado: o que cada célula faz diante da regra (valores que já estavam ali não são barrados)"),
        code("csv", [
          "Sala;Pessoas;Data",
          "Atenas;12;01/02/2026",
          "Delfos;8;15/03/2026",
          "Tebas;25;10/04/2026",
          "Ágora;3;05/05/2026",
          "Atenas;5;31/12/2027",
        ], "Lista!A1: as mesmas reservas, com os valores corrigidos"),
        code("excel", [
          "Classificar: A1:C6 por 2 decrescente",
        ], "Classificação pelas pessoas, do maior para o menor"),
        code("text", [
          "A1:C6 = Sala | Pessoas | Data / Tebas | 25 | 10/04/2026 / Atenas | 12 | 01/02/2026 / Delfos | 8 | 15/03/2026 / Atenas | 5 | 31/12/2027 / Ágora | 3 | 05/05/2026",
        ], "Resultado: a lista inteira foi reordenada, linha a linha"),
        code("excel", [
          "Classificar: A1:C6 por 1",
          "Filtrar: A1:C6 coluna 1 = Atenas",
          "E1: =SUBTOTAL(109;B2:B6)",
          "E2: =SOMA(B2:B6)",
        ], "Ordem por sala, filtro por Atenas, e dois totais"),
        code("text", [
          "visiveis:A1:C6 = Sala | Pessoas | Data / Atenas | 12 | 01/02/2026 / Atenas | 5 | 31/12/2027",
          "E1 = 17",
          "E2 = 53",
        ], "Resultado: duas linhas visíveis; SUBTOTAL soma o visível e SOMA, tudo"),
        prose([
          "A regra de números inteiros entre 1 e 20 aprovou os 12 de Atenas e reprovou os 25 de Tebas e o −3 de Ágora; a lista de salas aprovou as três salas conhecidas e reprovou Ágora; e a regra de datas reprovou o 31/12/2027. Essas células já estavam preenchidas, e a regra as apontou sem barrá-las: é a marca de que a validação protege a entrada futura e, para os dados existentes, só os identifica.",
          "",
          "A classificação levou Tebas, com 25 pessoas, ao topo, e manteve cada linha inteira, com sala, pessoas e data juntas. Depois do filtro por Atenas, duas linhas ficaram visíveis. `SUBTOTAL(109;…)` somou 12 e 5, ou 17; a `SOMA` comum continuou somando as cinco linhas, 53, inclusive as escondidas.",
        ]),
        porque([
          "Validação barra a digitação, mas não o que já está lá ou foi colado: confira com Circular Dados Inválidos. Classifique sempre o bloco inteiro (ou uma Tabela). Com filtro ligado, use `SUBTOTAL(109;…)` para somar o visível, porque `SOMA` inclui as linhas escondidas.",
        ]),
        quebraria([
          "Alguém seleciona a coluna \"Valor\" e a classifica em ordem crescente, sem as colunas vizinhas. Os valores se reordenam; os nomes dos clientes, não. A lista passa a mostrar cada cliente com o valor de outro, e o erro só é percebido quando um cliente contesta a cobrança.",
        ]),
      ],
    },
  ],
};

export const OFFICE_BOOK_03_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "beginner",
    promptMd: "Em E2, a fórmula `=D2*F1` multiplica o total pela taxa de F1. Ela é copiada para E3 e E4. Qual é a fórmula resultante em E4, e o que isso provoca?",
    choices: [
      "=D4*F3: a taxa passa a apontar para F3, que está vazia, e o resultado é zero",
      "=D4*F1: o Excel mantém a taxa onde estava, porque é uma constante",
      "=D2*F1: a fórmula não muda quando é copiada",
      "=D4*$F$1: o Excel acrescenta os cifrões automaticamente",
    ],
    answerKeyMd: "=D4*F3: a taxa passa a apontar para F3, que está vazia, e o resultado é zero",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "intermediate",
    promptMd: "Um relatório usa `=SOMA(D2:D400)` para totalizar uma lista de reservas que cresce todo mês. Em dezembro a lista tem 412 linhas e o total está errado, sem nenhum erro visível. Explique a causa e proponha duas mudanças que impeçam que o problema volte, indicando como a fórmula ficaria.",
    answerKeyMd: "O intervalo fixo D2:D400 não alcança as linhas 401 a 413; a soma ignora as últimas 12 reservas sem sinalizar nada. Correção 1: transformar a lista em uma Tabela do Excel (Ctrl+T), nomeá-la (por exemplo Reservas) e somar por referência estruturada, =SOMA(Reservas[Total]), que acompanha o crescimento automático. Correção 2: usar uma coluna inteira, =SOMA(D:D), se não houver outros valores na coluna (não é a melhor escolha, porque inclui qualquer total ou nota que entre na coluna), ou um nome definido dinâmico. A primeira é preferível, porque também estende gráficos, fórmulas e formatação.",
    rubricMd: "Identifica o intervalo fixo como causa; propõe Tabela com referência estruturada; reconhece a alternativa de coluna inteira com seus riscos.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "intermediate",
    promptMd: "Uma lista de reservas (colunas Sala, Pessoas e Data, com cabeçalho na linha 1 e dados até a linha 50) está filtrada para mostrar só a sala Atenas. Escreva as duas fórmulas que mostram, respectivamente, a soma das pessoas visíveis e a quantidade de linhas visíveis, e explique por que `=SOMA(B2:B50)` não serve para o primeiro caso.",
    answerKeyMd: "Soma visível: =SUBTOTAL(109;B2:B50). Quantidade de linhas visíveis: =SUBTOTAL(103;A2:A50) (103 conta as células não vazias visíveis; use a coluna Sala, que é preenchida em todas as linhas). =SOMA(B2:B50) não serve porque inclui as linhas escondidas pelo filtro: filtrar esconde as linhas, não as exclui, e a SOMA comum as continua somando. SUBTOTAL com 109 e 103 ignora as linhas escondidas por filtro.",
    points: 20,
  },
];

export const OFFICE_BOOK_03_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "O que $F$1, F$1 e $F1 fixam? Qual tecla alterna as formas?", backMd: "$F$1 fixa coluna e linha; F$1 só a linha; $F1 só a coluna. F4 alterna as formas." },
  { nodeTitle: NODE, frontMd: "Quais as vantagens de uma Tabela do Excel?", backMd: "Expansão automática, colunas calculadas, referências estruturadas (Reservas[Total], [@Pessoas]) e integração com gráficos e tabelas dinâmicas." },
  { nodeTitle: NODE, frontMd: "Por que IVA2026 não pode ser nome definido?", backMd: "Parece um endereço de célula (coluna IVA, linha 2026). Nomes também não têm espaços e não podem ser A1, R ou C." },
  { nodeTitle: NODE, frontMd: "A validação de dados barra valores colados?", backMd: "Não: só a digitação. Use Circular Dados Inválidos para achar o que já estava lá ou foi colado." },
  { nodeTitle: NODE, frontMd: "Como somar só as linhas visíveis de um filtro?", backMd: "=SUBTOTAL(109;intervalo); 103 conta as linhas visíveis. SOMA inclui as escondidas." },
];
