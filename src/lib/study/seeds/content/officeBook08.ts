// Pacote Office, reescrita autoral (PLANO.md §R.2) — capítulo 8.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Excel: tabelas dinâmicas e gráficos";

const reservas = (rotuloData: string) => [
  `Sala;Status;${rotuloData};Pessoas;Valor`,
  "Atenas;Confirmada;01/02/2026;12;540",
  "Delfos;Pendente;15/03/2026;8;240",
  "Tebas;Confirmada;10/04/2026;25;750",
  "Atenas;Cancelada;20/04/2026;5;225",
  "Delfos;Confirmada;02/05/2026;10;300",
  "Atenas;Confirmada;03/05/2026;7;315",
];

export const OFFICE_BOOK_08: ContentChapter = {
  title: NODE,
  level: "avancado",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Tabelas dinâmicas: arrastar campos para resumir",
      order: 0,
      blocks: [
        prose([
          "Os capítulos anteriores resumiram dados com fórmulas: `SOMASES`, `ÚNICO`, `EMPILHARH`. A **tabela dinâmica** (*Inserir > Tabela Dinâmica*) chega ao mesmo lugar por outro caminho: em vez de escrever uma fórmula, o usuário **arrasta campos** para quatro áreas, e o Excel monta o resumo. É a ferramenta mais usada para responder perguntas como \"quanto foi reservado por sala e por status\", e a melhor para *explorar* os dados, porque rearranjar o resumo é só arrastar de novo, sem reescrever nada.",
          "",
          "O modelo mental tem quatro áreas. **Linhas** recebe os campos cujos valores viram os títulos das linhas. **Colunas** faz o mesmo na horizontal. **Valores** recebe os campos que serão calculados, com uma função de resumo (soma, contagem, média, máximo, mínimo). **Filtros** recebe os campos que restringem o conjunto inteiro antes do resumo. Colocar `Sala` em Linhas e `Valor` em Valores produz o total por sala; acrescentar `Status` em Colunas cruza as duas dimensões, com uma célula para cada combinação de sala e status, e linhas e colunas de **Total Geral**. O programa dá nome às medidas pela função e pelo campo (`Soma de Valor`) e aos títulos genéricos como `Rótulos de Linha` e `Rótulos de Coluna`, que podem ser renomeados.",
          "",
          "A origem dos dados é o ponto de partida do cuidado. A dinâmica funciona bem quando os dados são um **bloco retangular, com cabeçalhos de uma linha, sem linhas vazias e sem células mescladas**, exatamente o que uma Tabela do Excel garante. Com a origem apontando para a Tabela (`Reservas`), e não para um intervalo fixo (`A1:E7`), as linhas novas entram na dinâmica na próxima atualização. Com um intervalo fixo, é preciso lembrar de aumentar a origem, e a última linha costuma ficar de fora, no mesmo defeito da soma que ignorava as últimas linhas.",
          "",
          "O ponto que mais confunde quem começa: **a tabela dinâmica não se atualiza sozinha**. Ela guarda um *cache* dos dados, uma cópia feita no momento em que foi criada ou atualizada pela última vez, e mostra o resumo desse cache. Se um valor da origem muda, a dinâmica continua mostrando o valor antigo até que alguém use *Dados > Atualizar Tudo* (ou o botão direito sobre a tabela, *Atualizar*). Em um relatório entregue a outra pessoa, a dinâmica desatualizada é o erro mais difícil de flagrar, porque tudo parece coerente: os totais fecham entre si. A opção *Atualizar ao abrir o arquivo*, nas opções da tabela dinâmica, é a salvaguarda para relatórios que circulam.",
          "",
          "O contraste com as fórmulas do capítulo 6 vale ser dito. A dinâmica é **interativa** (reorganiza-se arrastando, filtra-se por segmentação de dados, abre-se o detalhe de uma célula com duplo clique) e dispensa conhecer funções. As fórmulas de matriz são **automáticas** (recalculam sozinhas) e permitem layouts livres, que a dinâmica não permite. Na prática, a escolha costuma ser esta: dinâmica para análise e relatórios que uma pessoa vai explorar; fórmulas para painéis fixos que precisam estar sempre atualizados e com formato próprio.",
          "",
          "Dois detalhes de comportamento. Os campos de texto em Valores viram **contagem**, e os numéricos, **soma**, que é o que o programa sugere por padrão; se a coluna numérica tem alguma célula de texto ou em branco, a sugestão passa a ser contagem, e o relatório mostra a contagem das linhas onde se esperava o total em reais. E o resumo ocupa um bloco que cresce com os dados, de modo que não se deve colocar nada logo abaixo ou ao lado dele: ao atualizar, o Excel pergunta se pode sobrescrever as células ocupadas e, sem elas livres, a atualização falha.",
          "",
          "O exemplo cria a Tabela de reservas e duas tabelas dinâmicas sobre ela, o total por sala e o cruzamento por sala e status. Em seguida, altera um valor da origem e mostra o que a dinâmica exibe antes e depois de atualizar.",
        ]),
        code("csv", reservas("Dia"), "Reservas!A1: seis reservas, com status, dia, pessoas e valor"),
        code("excel", [
          "Tabela: Reservas = A1:E7",
        ], "A lista vira uma Tabela, a origem da tabela dinâmica"),
        code("dinamica", [
          "Origem: Reservas",
          "Linhas: Sala",
          "Valores: Soma de Valor",
        ], "Tabela dinâmica PorSala → Resumo!A3: o total por sala"),
        code("dinamica", [
          "Origem: Reservas",
          "Linhas: Sala",
          "Colunas: Status",
          "Valores: Soma de Valor",
        ], "Tabela dinâmica Cruzada → Resumo!E3: sala nas linhas e status nas colunas"),
        code("text", [
          "Resumo!A3:B7 = Rótulos de Linha | Soma de Valor / Atenas | 1080 / Delfos | 540 / Tebas | 750 / Total Geral | 2370",
          "Resumo!E4:I8 = Rótulos de Linha | Cancelada | Confirmada | Pendente | Total Geral / Atenas | 225 | 855 |  | 1080 / Delfos |  | 300 | 240 | 540 / Tebas |  | 750 |  | 750 / Total Geral | 225 | 1905 | 240 | 2370",
        ], "Resultado: os dois resumos"),
        code("excel", [
          "Reservas!E2: 1000",
        ], "O valor da primeira reserva de Atenas passa de 540 para 1000"),
        code("text", [
          "Resumo!A4:B4 = Atenas | 1080",
          "Resumo!B7 = 2370",
        ], "Resultado: a dinâmica ainda mostra o cache antigo"),
        code("excel", [
          "Atualizar: as tabelas dinâmicas",
        ], "Dados > Atualizar Tudo, que também atualiza as tabelas dinâmicas"),
        code("text", [
          "Resumo!A4:B4 = Atenas | 1540",
          "Resumo!B7 = 2830",
        ], "Resultado: depois de atualizar, a soma acompanha a origem"),
        prose([
          "A primeira dinâmica reuniu as seis reservas em três linhas: Atenas, com 1.080; Delfos, com 540; e Tebas, com 750; o total geral é 2.370. No cruzamento, as colunas separam os status: Atenas tem 225 canceladas e 855 confirmadas e nenhuma pendente (a célula vazia diz que a combinação não existe nos dados, e não que o valor é zero). Delfos tem 300 confirmadas e 240 pendentes, e o total de cada linha e coluna fecha em 2.370.",
          "",
          "Depois de a primeira reserva passar a valer 1.000, as duas dinâmicas continuaram mostrando 1.080 para Atenas e 2.370 no total, porque o cache não mudou. Só o *Atualizar Tudo* os levou a 1.540 e 2.830, o que mostra que a última modificação feita na origem só aparece quando o relatório é atualizado.",
        ]),
        porque([
          "Linhas, Colunas, Valores e Filtros são as quatro áreas da dinâmica. Use uma Tabela como origem e lembre que a dinâmica guarda um cache: ela só reflete a origem depois de *Atualizar Tudo*. Não coloque nada ao lado ou abaixo do resumo; ele cresce com os dados.",
        ]),
        quebraria([
          "Um relatório mensal circula com a dinâmica criada em janeiro. Em fevereiro, o analista cola os dados novos na origem e envia o arquivo sem atualizar. A diretoria lê os totais de janeiro como se fossem de fevereiro, e as metas do mês parecem cumpridas por três semanas.",
        ]),
      ],
    },
    {
      title: "Agrupar datas, mostrar percentuais e filtrar a dinâmica",
      order: 1,
      blocks: [
        prose([
          "Uma dinâmica que apenas soma por categoria já economiza trabalho; as três ferramentas desta seção a tornam capaz de responder à maioria das perguntas de gestão sem uma fórmula. A primeira é o **agrupamento de datas**. Um campo de data posto em Linhas produz uma linha por dia distinto, o que raramente é útil: o relatório de 2026 teria quase 365 linhas. O comando *Agrupar* (botão direito sobre uma data) permite agrupar por **meses**, **trimestres** e **anos**, e produz o resumo que se esperava: uma linha por mês, com o ano acima. Os níveis de agrupamento são hierárquicos: marcar meses e anos mostra os anos como linhas externas e os meses, dentro delas. Agrupar só por meses, sem anos, mistura os meses de anos diferentes: o `jan` de 2025 e o de 2026 viram a mesma linha, um erro silencioso em dados de mais de um ano.",
          "",
          "O agrupamento depende de a coluna de origem ter **datas de verdade**: uma coluna em que algumas células são datas e outras são texto (como `31/02/2026`, do capítulo 2) ou estão em branco impede o agrupamento, e o Excel avisa com a mensagem \"não é possível agrupar essa seleção\". A correção é limpar a coluna na origem, o que reforça o argumento do capítulo 2 sobre a digitação: uma data inválida num campo de data estraga o relatório inteiro.",
          "",
          "A segunda ferramenta é o **valor mostrado como**. Em vez do total em reais, a mesma medida pode aparecer como **percentual do total geral**, do total da linha, do total da coluna, como diferença em relação a um item, ou como total acumulado. Para \"quanto cada sala representa do faturamento\", o percentual do total geral resolve sem uma coluna auxiliar: a soma de cada sala dividida pelo total. A configuração está em *Configurações do Campo de Valor > Mostrar Valores Como*. O número exibido muda, e o dado por trás continua o mesmo, o que reaparece na seção de gráficos como uma das armadilhas de interpretação.",
          "",
          "A terceira são os **filtros**. O campo colocado em Filtros fica em uma lista suspensa acima do resumo, e a seleção restringe todos os números abaixo. Com `Status` como filtro e a seleção \"(Tudo)\", o resumo mostra tudo; escolhendo `Confirmada`, o resumo se refaz só com as reservas confirmadas. Uma segmentação de dados (*Inserir > Segmentação de Dados*) faz o papel do filtro com botões de clique, mais fácil de usar em painéis e capaz de controlar várias dinâmicas ao mesmo tempo. Filtros mudam os números mostrados *sem* mudar a origem, e esse é o ponto que exige atenção em relatórios: quem vê um total com o filtro ligado precisa saber que ele está filtrado. Uma dinâmica entregue com `Status = Confirmada` selecionado, sem que isso apareça no título, apresenta como \"total de reservas\" o total das confirmadas.",
          "",
          "Duas ou mais medidas podem ocupar a área de Valores ao mesmo tempo: o total em reais e a contagem de reservas, lado a lado. O Excel as dispõe em colunas, na ordem em que foram acrescentadas, e as funções são escolhidas por campo: soma para o valor, contagem para as reservas, média para as pessoas. Aqui vale a regra de nomes: cada medida precisa de um título diferente do campo de origem, por isso o Excel produz `Soma de Valor` e não aceita `Valor`.",
          "",
          "O exemplo agrupa as datas por meses e anos, mostra a participação de cada sala no total e usa um filtro com duas medidas.",
        ]),
        code("csv", reservas("Data"), "Reservas!A1: as mesmas seis reservas, agora com o campo Data"),
        code("excel", [
          "Tabela: Reservas = A1:E7",
          "Formato: C2:C7 = dd/mm/aaaa",
        ], "A Tabela de origem, com a coluna Data no formato de data"),
        code("dinamica", [
          "Origem: Reservas",
          "Linhas: Data",
          "Valores: Soma de Valor",
          "Agrupar: Data por meses e anos",
        ], "Tabela dinâmica PorMes → Resumo!A3: as datas agrupadas por mês e ano"),
        code("dinamica", [
          "Origem: Reservas",
          "Linhas: Sala",
          "Valores: Soma de Valor como % do total",
        ], "Tabela dinâmica Participacao → Resumo!E3: cada sala como percentual do total"),
        code("dinamica", [
          "Origem: Reservas",
          "Linhas: Sala",
          "Filtros: Status",
          "Valores: Soma de Valor; Contagem de Pessoas",
        ], "Tabela dinâmica Filtrada → Resumo!H3: duas medidas e um filtro por status"),
        code("text", [
          "Resumo!A3:B9 = Rótulos de Linha | Soma de Valor / 2026 | 2370 / fev | 540 / mar | 240 / abr | 975 / mai | 615 / Total Geral | 2370",
          "Resumo!E3:F7 = Rótulos de Linha | % do total de Valor / Atenas | 45,6% / Delfos | 22,8% / Tebas | 31,6% / Total Geral | 100,0%",
          "Resumo!H1:I1 = Status | (Tudo)",
          "Resumo!H3:J7 = Rótulos de Linha | Soma de Valor | Contagem de Pessoas / Atenas | 1080 | 3 / Delfos | 540 | 2 / Tebas | 750 | 1 / Total Geral | 2370 | 6",
        ], "Resultado: os três resumos"),
        prose([
          "O agrupamento transformou seis datas em quatro meses, sob a linha do ano de 2026, que soma 2.370: fevereiro 540, março 240, abril 975 (a soma de duas reservas, 750 e 225) e maio 615. A participação mostrou Atenas com 45,6%, Delfos com 22,8% e Tebas com 31,6%, que fecham em 100,0%. O terceiro resumo, com o filtro no estado \"(Tudo)\", mostrou duas medidas por sala, o total em reais e a quantidade de reservas.",
          "",
          "O filtro, que está em H1:I1, aparece acima do resumo, e é ali que se escolhe `Confirmada` ou `Cancelada`. Se o resumo for impresso com um filtro ligado, a seleção aparece na impressão, mas fora do título; por isso, convém colocá-la também no título do relatório.",
        ]),
        porque([
          "Agrupe datas por meses *e anos* (só meses mistura anos diferentes); isso exige datas válidas na origem. \"Mostrar valores como\" troca o número exibido, não o dado. Filtros e segmentações mudam o que o resumo mostra: indique-os no título do relatório.",
        ]),
        quebraria([
          "Uma dinâmica agrupa as vendas por mês, apenas por mês, e o relatório cobre três anos. As vendas de dezembro de 2024, 2025 e 2026 aparecem somadas numa única linha \"dez\", e o gráfico mostra um pico de fim de ano três vezes maior que o real.",
        ]),
      ],
    },
    {
      title: "Gráficos: escolher o tipo certo e ler o eixo",
      order: 2,
      blocks: [
        prose([
          "Um gráfico é uma resposta a uma pergunta, e a escolha do tipo decide se a resposta aparece. A regra mais confiável, vinda da prática de visualização de dados, é partir da pergunta. Para **comparar categorias** (quanto cada sala faturou), usam-se **colunas** ou **barras**, com as barras horizontais preferidas quando os nomes das categorias são longos. Para mostrar **evolução no tempo**, **linhas**. Para a **composição** de um total, a pizza ou a rosca funcionam só com poucas fatias (até quatro ou cinco) e com uma fatia dominante; acima disso, as barras são mais legíveis, porque o olho compara comprimentos muito melhor do que ângulos. Para a relação entre duas medidas, a **dispersão**. Gráficos em 3D, sombras e efeitos distorcem as proporções e não acrescentam informação, e a recomendação é evitá-los.",
          "",
          "A criação é simples: selecionar o intervalo com os cabeçalhos e usar *Inserir > Gráficos Recomendados*, ou escolher o tipo diretamente. O programa assume que a primeira coluna são os nomes das categorias e que as demais, com cabeçalho, são séries. O **título** padrão é o nome da série, e vale trocá-lo por uma frase que diga o que o gráfico mostra, \"Valor reservado por sala\", mais útil que \"Valor\". A **legenda** só faz sentido com mais de uma série; com uma só, ocupa espaço e repete o título.",
          "",
          "A leitura do gráfico passa pelo **eixo vertical**, e é aí que mora a armadilha mais conhecida. O Excel escolhe a escala automaticamente, e para colunas com valores muito próximos (980, 1.000 e 1.010) ele **não começa em zero**: o eixo vai de 965 a 1.015, e uma diferença de 3% entre a menor e a maior coluna é desenhada como se a maior fosse várias vezes maior. Gráficos de coluna e de barra codificam o valor pelo **comprimento**, e um comprimento só é proporcional ao valor se a base for zero. O eixo truncado é a forma mais comum de gráfico enganoso, intencional ou não. Com valores muito diferentes (100, 900 e 950), o Excel começa em zero sozinho, e o problema desaparece, o que torna o comportamento imprevisível: o mesmo gráfico muda de escala quando os dados mudam.",
          "",
          "A defesa é **fixar o mínimo do eixo em zero** em todo gráfico de colunas ou de barras (*Formatar Eixo > Limites > Mínimo*). Para linhas, que codificam o valor pela *posição*, um eixo que não começa em zero é aceitável e muitas vezes necessário, desde que o eixo esteja claramente rotulado. A fixação tem uma consequência: o eixo deixa de ser automático, e se os valores crescerem muito além do máximo, o Excel continua ajustando o máximo (que segue automático) mas o mínimo permanece onde foi posto. O que é fixado manualmente precisa ser revisto quando os dados mudam de ordem de grandeza.",
          "",
          "Outras armadilhas de leitura: um gráfico de pizza cujas fatias não somam o todo (apenas as categorias \"mais importantes\"); duas séries em escalas muito diferentes no mesmo eixo, em que a menor desaparece; eixos secundários que sugerem correlação inexistente; e rótulos de dados que repetem a informação do eixo, poluindo o gráfico. Em relatórios de gestão, a prática que mais evita equívocos é um título que afirme a conclusão (\"Tebas lidera o faturamento\") e um eixo que seja honesto.",
          "",
          "O exemplo cria três gráficos a partir da mesma pequena tabela: um de colunas com o eixo automático, um de colunas com o mínimo fixado em zero e um de pizza com legenda.",
        ]),
        code("csv", [
          "Sala;Valor",
          "Atenas;980",
          "Delfos;1000",
          "Tebas;1010",
        ], "Graficos!A1: três salas com valores próximos"),
        code("grafico", [
          "Dados: Graficos!A1:B4",
          "Tipo: colunas agrupadas",
        ], "Gráfico 1: colunas, tudo automático"),
        code("grafico", [
          "Dados: Graficos!A1:B4",
          "Tipo: colunas agrupadas",
          "Título: Valor por sala",
          "Eixo vertical: mínimo 0",
        ], "Gráfico 2: colunas, com título próprio e o eixo começando em zero"),
        code("grafico", [
          "Dados: Graficos!A1:B4",
          "Tipo: pizza",
          "Legenda: sim",
        ], "Gráfico 3: pizza com legenda"),
        code("text", [
          "grafico:1.tipo = colunas agrupadas",
          "grafico:1.titulo = Valor",
          "grafico:1.series = 1",
          "grafico:1.nomes = Valor",
          "grafico:1.categorias = Atenas; Delfos; Tebas",
          "grafico:1.valores:1 = 980; 1000; 1010",
          "grafico:1.minimo = 965",
          "grafico:1.minimo-automatico = sim",
          "grafico:1.maximo = 1015",
          "grafico:2.titulo = Valor por sala",
          "grafico:2.minimo = 0",
          "grafico:2.minimo-automatico = não",
          "grafico:3.tipo = pizza",
          "grafico:3.legenda = sim",
        ], "Resultado: as propriedades dos três gráficos"),
        prose([
          "O primeiro gráfico saiu com uma série, os três valores e o título \"Valor\", herdado do cabeçalho. O eixo vertical, automático, vai de **965 a 1.015**: as colunas de 980, 1.000 e 1.010 são desenhadas como se a última fosse muitas vezes maior que a primeira, quando a diferença real é de 3%. No segundo, o título foi trocado por uma frase e o mínimo fixado em zero, o que passa a mostrar colunas de alturas quase iguais, como os dados são. O terceiro é uma pizza com legenda, onde três fatias de tamanho semelhante pouco informam.",
          "",
          "O mesmo gráfico, com os valores 100, 900 e 950, teria um eixo que começa em zero sozinho: o comportamento automático depende dos dados, e por isso a fixação manual é a proteção mais confiável.",
        ]),
        porque([
          "Escolha o tipo pela pergunta: colunas/barras para comparar, linhas para tempo, pizza só com poucas fatias. Em colunas e barras, fixe o mínimo do eixo em zero; o automático pode começar em 965 e exagerar 3% como se fosse muito. Dê ao gráfico um título que diga o que ele mostra.",
        ]),
        quebraria([
          "Um gráfico de colunas das vendas de três filiais (R$ 980 mil, R$ 1,00 milhão e R$ 1,01 milhão) é apresentado ao conselho com o eixo começando em R$ 965 mil. A terceira filial parece cinco vezes maior que a primeira, e a diretoria remaneja a verba do ano para uma filial que vendia 3% a mais.",
        ]),
      ],
    },
    {
      title: "Gráficos vivos: fonte em Tabela e a atualização",
      order: 3,
      blocks: [
        prose([
          "Um gráfico é uma visão dos dados, não uma cópia. O que ele mostra depende de **qual intervalo** foi dado como origem, e esse intervalo, uma vez definido, é fixo. Se a origem é um intervalo comum, como `A1:B3`, o gráfico mostra essas três linhas para sempre: os dados que forem acrescentados abaixo não entram, e o gráfico fica desatualizado em silêncio. É o mesmo problema da soma `=SOMA(D2:D400)`, e a solução é a mesma: apontar para uma **Tabela do Excel**.",
          "",
          "Quando a origem do gráfico é uma Tabela, o intervalo do gráfico acompanha o crescimento dela: ao digitar uma linha logo abaixo, a tabela se estende, e o gráfico ganha uma coluna ou um ponto novo. Não há atualização a fazer. Com isso, a cadeia completa de um relatório vivo fica de pé: a Tabela recebe os dados; as fórmulas de matriz ou a tabela dinâmica fazem o resumo; e o gráfico mostra o resultado. Cada elo se atualiza, e o analista só digita as linhas novas.",
          "",
          "Há uma segunda via, mais direta: o **gráfico dinâmico**, criado a partir de uma tabela dinâmica (*Análise de Tabela Dinâmica > Gráfico Dinâmico*). Ele reflete a estrutura da dinâmica, e as mudanças na dinâmica (filtros, agrupamentos, campos novos) se refletem no gráfico, que ganha botões de filtro. É poderoso para exploração, mas herda as limitações da tabela dinâmica: precisa de *Atualizar*, e o formato é menos flexível do que o de um gráfico comum.",
          "",
          "A atualização dos números não é o único ponto. A **formatação** também precisa acompanhar. Um gráfico ajustado à mão (cores por barra, rótulos em posições escolhidas) pode perder o ajuste quando os dados mudam; as cores definidas pelo tema do documento e as regras aplicadas à série (e não a pontos individuais) sobrevivem melhor. Um bom hábito é definir o tipo, os títulos e o eixo uma vez, no gráfico modelo, e usar *Salvar como Modelo* quando o mesmo visual é usado em vários relatórios.",
          "",
          "O gráfico também pode ser **colado em outros programas**: no Word ou no PowerPoint, as opções de colagem escolhem se ele fica *vinculado* à planilha (atualiza quando a planilha muda), *incorporado* (carrega uma cópia da planilha inteira) ou vira uma imagem. A vinculação é a que mantém o relatório atualizado, e também a que quebra quando o arquivo de origem é movido ou renomeado; a incorporação deixa o arquivo pesado e leva todos os dados da planilha, inclusive os que não deveriam sair. A imagem não se atualiza nem se edita, mas é a mais segura para o que será enviado a terceiros. A escolha tem de ser consciente, e o capítulo 12 volta ao assunto com as armadilhas de arquivos compartilhados.",
          "",
          "O exemplo cria duas listas parecidas: a primeira é uma Tabela, e a segunda, um intervalo comum. Cada uma tem um gráfico. Depois, uma linha nova é digitada abaixo de cada uma, e as categorias dos dois gráficos são lidas.",
        ]),
        code("csv", [
          "Sala;Valor",
          "Atenas;540",
          "Delfos;240",
        ], "Tabelas!A1: duas salas, que viram uma Tabela"),
        code("csv", [
          "Sala;Receita",
          "Atenas;540",
          "Delfos;240",
        ], "Fixos!A1: as mesmas duas salas, em um intervalo comum"),
        code("excel", [
          "Tabela: Vendas = Tabelas!A1:B3",
        ], "Só a primeira lista é transformada em Tabela"),
        code("grafico", [
          "Dados: Tabelas!A1:B3",
          "Tipo: colunas agrupadas",
          "Título: Valor por sala (Tabela)",
        ], "Gráfico 1: com a Tabela como origem"),
        code("grafico", [
          "Dados: Fixos!A1:B3",
          "Tipo: colunas agrupadas",
          "Título: Receita por sala (intervalo)",
        ], "Gráfico 2: com um intervalo comum como origem"),
        code("text", [
          "grafico:1.categorias = Atenas; Delfos",
          "grafico:2.categorias = Atenas; Delfos",
        ], "Resultado: os dois gráficos mostram as mesmas duas salas"),
        code("excel", [
          "Tabelas!A4: Tebas",
          "Tabelas!B4: 750",
          "Fixos!A4: Tebas",
          "Fixos!B4: 750",
        ], "Uma terceira sala, digitada logo abaixo de cada lista"),
        code("text", [
          "grafico:1.categorias = Atenas; Delfos; Tebas",
          "grafico:1.valores:1 = 540; 240; 750",
          "grafico:2.categorias = Atenas; Delfos",
          "grafico:2.valores:1 = 540; 240",
        ], "Resultado: o gráfico da Tabela cresceu; o do intervalo comum ficou como estava"),
        prose([
          "Os dois gráficos começaram idênticos, com Atenas e Delfos. Depois de Tebas ser digitada abaixo de cada lista, o primeiro ganhou a terceira categoria, com o valor 750, porque a Tabela se estendeu e levou o gráfico junto. O segundo continuou com duas categorias: a linha de Tebas está na planilha e fora do gráfico, que mostra uma imagem desatualizada sem sinal nenhum de que falta alguma coisa.",
          "",
          "A diferença é invisível na tela, onde os dois gráficos têm a mesma aparência, e só se percebe conferindo os dados ou observando que uma sala existe na lista e não no gráfico. É um defeito frequente em relatórios mensais mantidos a mão.",
        ]),
        porque([
          "Um gráfico mostra o intervalo que lhe foi dado, e esse intervalo é fixo. Aponte-o para uma Tabela e ele cresce com as linhas novas; com um intervalo comum, fica desatualizado em silêncio. Cole gráficos em outros arquivos sabendo a diferença entre vincular, incorporar e colar como imagem.",
        ]),
        quebraria([
          "O relatório trimestral usa gráficos sobre intervalos fixos de 12 linhas. No quarto trimestre, a lista passa de 12 para 14 linhas; os dois últimos meses ficam fora de todos os gráficos, e a apresentação anual ao conselho mostra um dezembro que não existe.",
        ]),
      ],
    },
  ],
};

export const OFFICE_BOOK_08_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "intermediate",
    promptMd: "Uma tabela dinâmica criada em janeiro, sobre uma Tabela do Excel, circula no relatório de fevereiro. O analista colou os dados de fevereiro na Tabela, e os totais da dinâmica continuam os de janeiro. Qual é a causa mais provável?",
    choices: [
      "A tabela dinâmica guarda um cache dos dados e não foi atualizada (Atualizar Tudo)",
      "A Tabela do Excel não aceita novas linhas coladas",
      "A tabela dinâmica só calcula valores de um mês por vez",
      "O Excel recalcula a dinâmica apenas ao fechar o arquivo",
    ],
    answerKeyMd: "A tabela dinâmica guarda um cache dos dados e não foi atualizada (Atualizar Tudo)",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "advanced",
    promptMd: "Um gráfico de colunas compara o faturamento de três filiais com valores de R$ 980 mil, R$ 1,00 milhão e R$ 1,01 milhão. No gráfico, a terceira filial parece muito maior que a primeira. Explique a causa, por que o problema pode desaparecer sozinho quando os dados mudam e como proteger o gráfico.",
    answerKeyMd: "O Excel escolhe a escala do eixo automaticamente e, para valores muito próximos, não começa em zero: o eixo pode ir de 965 a 1.015. Colunas codificam o valor pelo comprimento, que só é proporcional se a base for zero, então uma diferença de 3% é desenhada como se fosse várias vezes. Se os valores passarem a ter ordens de grandeza diferentes (100, 900, 950), o mínimo automático passa a ser zero, e o gráfico muda de aparência sem que ninguém o altere: o comportamento é imprevisível. A proteção é fixar o mínimo do eixo vertical em zero (Formatar Eixo > Limites > Mínimo = 0) em todo gráfico de colunas ou de barras, e dar um título que diga a conclusão.",
    rubricMd: "Explica o eixo automático não começar em zero; relaciona comprimento a proporcionalidade; menciona imprevisibilidade e a fixação do mínimo em zero.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "Descreva como montar, sem escrever fórmulas, um resumo do faturamento por mês e por sala de uma Tabela chamada Reservas (colunas Sala, Data e Valor) que se atualize quando o arquivo for aberto. Indique a origem, as áreas dos campos, o agrupamento necessário e a opção que garante a atualização.",
    answerKeyMd: "Inserir > Tabela Dinâmica, com Origem = Reservas (o nome da Tabela, para que as linhas novas entrem). Áreas: Data em Linhas, Sala em Colunas, Valor em Valores (Soma de Valor). Agrupar o campo Data (botão direito > Agrupar) por Meses e Anos, para ter uma linha por mês dentro do ano (só meses misturaria anos diferentes); isso exige datas válidas na coluna. Para atualizar ao abrir o arquivo: Análise de Tabela Dinâmica > Opções > Dados > \"Atualizar dados ao abrir o arquivo\". Além disso, nada deve ser colocado ao lado ou abaixo do resumo, porque ele cresce com os dados.",
    points: 20,
  },
];

export const OFFICE_BOOK_08_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Quais as quatro áreas da tabela dinâmica?", backMd: "Linhas, Colunas, Valores (com a função de resumo) e Filtros. Use uma Tabela como origem." },
  { nodeTitle: NODE, frontMd: "A tabela dinâmica se atualiza sozinha?", backMd: "Não: guarda um cache. Só reflete a origem após Atualizar Tudo (ou \"Atualizar ao abrir o arquivo\")." },
  { nodeTitle: NODE, frontMd: "Como agrupar datas sem misturar anos?", backMd: "Agrupar por Meses e Anos (só meses junta o jan de anos diferentes). Exige datas válidas na origem." },
  { nodeTitle: NODE, frontMd: "Por que fixar o mínimo do eixo em zero em colunas?", backMd: "Colunas codificam o valor pelo comprimento. O eixo automático pode começar em 965 e fazer 3% de diferença parecer enorme." },
  { nodeTitle: NODE, frontMd: "Gráfico sobre Tabela × sobre intervalo comum", backMd: "A Tabela se estende com as linhas novas e leva o gráfico; um intervalo comum fica fixo e o gráfico desatualiza em silêncio." },
];
