// Pacote Office, reescrita autoral (PLANO.md §R.2) — capítulo 12.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Armadilhas comuns do Pacote Office";

export const OFFICE_BOOK_12: ContentChapter = {
  title: NODE,
  level: "avancado",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Armadilhas de cálculo: modo manual, referência circular e referência por texto",
      order: 0,
      blocks: [
        prose([
          "As armadilhas mais caras do Excel são as que **não mostram erro**. Um `#DIV/0!` chama atenção; um número desatualizado, não. Três delas aparecem em quase toda empresa que usa planilhas por tempo suficiente, e todas têm a mesma natureza: o programa faz exatamente o que lhe foi configurado, e a configuração não é a que a pessoa imagina.",
          "",
          "A primeira é o **modo de cálculo manual**. Por padrão, o Excel recalcula todas as fórmulas sempre que um valor muda (*Fórmulas > Opções de Cálculo > Automático*). No modo manual, ele deixa as fórmulas como estão até que se pressione `F9`. O modo existe por uma razão legítima: planilhas muito grandes, com milhares de fórmulas pesadas, podem levar segundos para recalcular a cada digitação, e desligar o recálculo automático acelera o trabalho. O problema é que o modo **pertence à sessão do Excel e não à planilha**: ele é gravado no arquivo, e o primeiro arquivo aberto na sessão define o modo de todos os que forem abertos depois. Quem abre uma planilha gravada em manual passa a trabalhar em manual em todas as outras abertas junto, sem aviso, e vê totais que não acompanham as células. A pista visível é pequena: a barra de status mostra \"Calcular\" quando há fórmulas por recalcular.",
          "",
          "A segunda é a **referência circular**: uma fórmula que depende do próprio resultado, direta (`=D1+1` escrita em `D1`) ou indireta (A depende de B, e B depende de A). O Excel não consegue calcular uma fórmula que depende de si mesma e mostra um aviso na primeira vez, mas o aviso é fácil de dispensar, e o resultado vira 0 ou o último valor calculado, sem erro. A barra de status passa a indicar \"Referências Circulares\" e o endereço de uma célula, e *Fórmulas > Verificação de Erros > Referências Circulares* lista os endereços. O ponto delicado é que alguns modelos financeiros usam referências circulares de propósito (juros calculados sobre o saldo médio, por exemplo), com o *cálculo iterativo* ligado nas opções do Excel; nesse caso, o aviso desaparece, e uma referência circular criada por engano passa a ser aceita em silêncio. Esse modo também deve ser consciente: ligado por hábito, esconde erros.",
          "",
          "A terceira é a **referência por texto**. A função `INDIRETO` recebe um *texto* e o trata como endereço: `=INDIRETO(\"B\"&2)` monta o texto \"B2\" e devolve o conteúdo dessa célula. É a ferramenta para endereços montados por fórmula, como \"a célula da aba cujo nome está em A1\". O problema é que o Excel só ajusta referências que *reconhece como referências*, e um texto não é uma. Quando uma linha é inserida acima, `=B2` vira `=B3`, acompanhando o dado que se moveu; `=INDIRETO(\"B\"&2)` continua apontando para o endereço B2, que agora é a célula que ocupou o lugar, e que pode ser o cabeçalho, uma linha em branco ou outro dado. Não há erro, só um valor errado. As funções `DESLOC` e `INDIRETO` são ainda **voláteis**: recalculam a cada alteração em qualquer parte da planilha, o que, em volume, torna o arquivo lento. A regra é usar `ÍNDICE`, `PROCX` e referências diretas, que o Excel acompanha, e reservar `INDIRETO` para o que realmente exige um endereço montado, documentando o uso.",
          "",
          "O padrão das três armadilhas é que o Excel segue ordens e a ordem errada não gera mensagem. O hábito que as previne é **conferir o estado antes de confiar nos números**: o modo de cálculo na barra de status, a ausência de referências circulares, e a revisão das fórmulas por texto depois de inserir linhas ou colunas. Um relatório entregue com a conferência de dois minutos evita as reuniões em que alguém pergunta por que a soma não fecha.",
          "",
          "O exemplo percorre as três: o modo manual deixando um total para trás, a referência circular e o `INDIRETO` ao lado de uma referência direta, depois da inserção de uma linha.",
        ]),
        code("csv", [
          "Item;Valor",
          "Café;10",
          "Pão;20",
        ], "Contas!A1: dois itens e os valores"),
        code("excel", [
          "B4: =SOMA(B2:B3)",
          "Cálculo: manual",
          "B2: 100",
        ], "Uma soma e, em seguida, o modo manual e uma mudança de valor"),
        code("text", [
          "B4 = 30",
        ], "Resultado: o total ficou para trás (deveria ser 120)"),
        code("excel", [
          "Cálculo: calcular",
        ], "F9: recalcular"),
        code("text", [
          "B4 = 120",
        ], "Resultado: depois do recálculo, o total acompanha"),
        code("excel", [
          "Cálculo: automático",
          "D1: =D1+1",
        ], "De volta ao modo automático, e uma fórmula que depende de si mesma"),
        code("text", [
          "D1 = 0",
          "circular:Contas = D1",
        ], "Resultado: a fórmula devolve 0, sem erro, e a célula circular é indicada"),
        code("excel", [
          "D1: 5",
          "F1: =B2",
          "F2: =INDIRETO(\"B\"&2)",
          "Inserir: linha 1",
        ], "Uma referência direta e uma por texto, e uma linha inserida no alto"),
        code("text", [
          "formula:F2 = =B3",
          "formula:F3 = =INDIRETO(\"B\"&2)",
          "F2:F3 = 100 / Valor",
        ], "Resultado: a direta acompanhou o dado (100); a por texto aponta para o cabeçalho"),
        prose([
          "No modo manual, depois de trocar o valor do café de 10 para 100, o total continuou em 30; só o `F9` o levou a 120. Nada na célula indicava a defasagem: o 30 é um número plausível. A fórmula circular não gerou nenhum erro: devolveu 0, e a única pista é a célula indicada na barra de status e no menu de verificação de erros.",
          "",
          "Com a inserção da linha, a referência direta virou `=B3` e continuou apontando para o café, que agora vale 100. A referência por texto continuou `B2`, que passou a ser a linha do cabeçalho, e devolveu `Valor`. Em uma planilha real, o `INDIRETO` apontaria para o dado de outro item, plausível e errado.",
        ]),
        porque([
          "Confira o modo de cálculo (barra de status: \"Calcular\"), as referências circulares e o uso de `INDIRETO`/`DESLOC`. O modo manual contamina as outras pastas abertas; a circular devolve 0 sem erro; `INDIRETO` não acompanha inserções. Prefira `ÍNDICE`, `PROCX` e referências diretas.",
        ]),
        quebraria([
          "Uma controladoria abre um modelo gravado em cálculo manual e, na mesma sessão, a planilha de fechamento do mês. As duas passam a trabalhar em manual; o fechamento é atualizado por uma pessoa que não aperta `F9`, e o balancete vai para a diretoria com o total da véspera.",
        ]),
      ],
    },
    {
      title: "Armadilhas de estrutura: células mescladas, totais no meio e dados feitos para o olho",
      order: 1,
      blocks: [
        prose([
          "Uma planilha pode ter um aspecto excelente e ser inutilizável como base de dados. A diferença está em para quem ela foi construída: para o **olho** (formatação para impressão, títulos centralizados, subtotais em destaque) ou para o **cálculo** (uma linha por registro, uma coluna por atributo, sem mistura). Planilhas feitas para o olho são as que dão mais trabalho a quem precisa depois somar, filtrar, resumir e importar, e as armadilhas dessa família são três.",
          "",
          "A primeira são as **células mescladas**. *Mesclar e Centralizar* junta várias células em uma e é tentador para títulos e para repetir um nome ao longo de várias linhas. Só que a célula mesclada guarda o valor **na célula do canto superior esquerdo**; as demais ficam vazias. Quando duas linhas de Atenas são mescladas numa só célula, a segunda linha deixa de ter o texto \"Atenas\" e, para qualquer função, passa a pertencer a ninguém. Uma contagem por sala que dava 2 passa a dar 1, e uma soma por sala que dava 765 passa a dar 540, sem erro nenhum. Além disso, as células mescladas impedem a classificação e o filtro por colunas que as contêm, causam erros ao criar tabelas dinâmicas e Tabelas do Excel, e atrapalham a navegação por teclado e por leitores de tela. A alternativa é *Centralizar na Seleção* (em *Formatar Células > Alinhamento*), que dá o mesmo efeito visual sem juntar as células, e, para os valores repetidos, preencher cada linha com o valor.",
          "",
          "A segunda são os **totais e subtotais no meio dos dados**. Uma lista de reservas com uma linha \"Subtotal Atenas\" depois das reservas de Atenas e um \"Total geral\" no fim é bonita no papel e perigosa na coluna. Qualquer `SOMA` da coluna inteira soma os valores, os subtotais e o total geral, contando cada real duas ou três vezes. No exemplo abaixo, a soma da coluna dá 2.775 quando o total real é 1.005. Também se tornam incorretos os filtros, as tabelas dinâmicas e qualquer cálculo sobre a lista. A regra é separar: os **dados** em uma lista pura, sem totais; os **resumos** em outro lugar, calculados por fórmula (`SOMASES`, `ÚNICO`) ou por tabela dinâmica. Uma Tabela do Excel com a linha de totais da própria tabela (*Design da Tabela > Linha de Totais*) é a exceção correta, porque a linha fica fora da área de dados.",
          "",
          "A terceira é o **dado feito para o olho**: cabeçalhos em duas linhas (\"Reservas\" sobre \"Atenas | Delfos\"), meses em colunas, linhas em branco para \"respirar\", blocos de dados lado a lado na mesma planilha, notas de rodapé nas células. Cada uma dessas escolhas é razoável para quem lê, e cada uma impede que o Excel entenda a estrutura: a tabela dinâmica falha porque a linha de cabeçalho está em branco ou duplicada, o `Ctrl+T` seleciona só metade da lista por causa da linha vazia, o Power Query não sabe qual linha é o cabeçalho. A solução é manter os dados em um **formato de lista**: uma linha de cabeçalhos, um registro por linha, nenhuma linha ou coluna totalmente vazia no meio, e uma coluna para cada atributo, com o mês como um valor e não como o nome de uma coluna. Para a apresentação, uma segunda planilha, ligada à primeira por fórmulas, cuida da formatação.",
          "",
          "O tema, em essência, é a separação entre **dados** e **apresentação**, a mesma ideia dos estilos do Word e do slide mestre do PowerPoint, aplicada às planilhas. A pessoa que monta a planilha pensa em como ela vai parecer; a que a herda precisa que ela seja uma tabela. Uma regra prática: se a lista pode ser entregue a um programa sem explicação (\"a primeira linha é o cabeçalho, e cada linha seguinte é um registro\"), ela está pronta para o cálculo.",
          "",
          "O primeiro exemplo mescla as duas células de Atenas e compara os resultados antes e depois. O segundo mostra a soma de uma coluna com subtotais misturados.",
        ]),
        code("csv", [
          "Sala;Valor",
          "Atenas;540",
          "Atenas;225",
          "Delfos;240",
        ], "Reservas!A1: três reservas, duas delas de Atenas"),
        code("excel", [
          "D1: =CONT.SE(A2:A4;\"Atenas\")",
          "D2: =SOMASE(A2:A4;\"Atenas\";B2:B4)",
        ], "Quantas reservas e quanto valem em Atenas"),
        code("text", [
          "D1:D2 = 2 / 765",
        ], "Resultado: antes de mesclar"),
        code("excel", [
          "Mesclar: A2:A3",
        ], "As duas células de Atenas são mescladas numa só"),
        code("text", [
          "A2:A3 = Atenas / ",
          "D1:D2 = 1 / 540",
        ], "Resultado: a segunda linha de Atenas ficou sem sala; a contagem e a soma encolheram"),
        code("csv", [
          "Sala;Valor",
          "Atenas;540",
          "Atenas;225",
          "Subtotal Atenas;765",
          "Delfos;240",
          "Total geral;1005",
        ], "Totais!A1: uma lista com subtotal e total geral misturados aos dados"),
        code("excel", [
          "D1: =SOMA(B2:B6)",
          "D2: =SOMA(B2:B3)+B5",
        ], "A soma da coluna inteira e a soma só dos dados"),
        code("text", [
          "D1:D2 = 2775 / 1005",
        ], "Resultado: a coluna inteira conta o mesmo dinheiro até três vezes"),
        prose([
          "Antes de mesclar, a contagem de reservas de Atenas era 2 e a soma, 765. Depois de mesclar as duas células de sala, a segunda linha ficou sem o texto: o `A3` está vazio. As mesmas fórmulas, sem terem sido tocadas, passaram a dar 1 e 540: a reserva de 225 sumiu do total de Atenas e não pertence a nenhuma sala. Visualmente, a planilha continua a mostrar \"Atenas\" centralizado em duas linhas, e quem confere pelo olho não percebe nada.",
          "",
          "Na lista com subtotais, a soma da coluna inteira deu 2.775, mais que o dobro do total real, 1.005: as reservas de Atenas contaram duas vezes (nas linhas e no subtotal), e o total geral contou tudo de novo. Somar só os dados exige escolher as linhas à mão, que é justamente o que a estrutura errada obriga a fazer.",
        ]),
        porque([
          "Mantenha os dados em formato de lista: uma linha de cabeçalho, um registro por linha, sem células mescladas, linhas vazias nem totais no meio. Mesclar deixa células vazias que as funções não enxergam; totais misturados contam o mesmo valor várias vezes. Resumos ficam em outro lugar, por fórmula ou tabela dinâmica.",
        ]),
        quebraria([
          "O comercial controla pedidos numa planilha com os nomes dos vendedores mesclados sobre as suas linhas e um subtotal depois de cada bloco. Em dezembro, a comissão é calculada por uma `SOMASE` por vendedor: só a primeira linha de cada bloco tem o nome, e as outras 80% dos pedidos não pertencem a ninguém. Os vendedores recebem a comissão de um quinto de suas vendas.",
        ]),
      ],
    },
    {
      title: "Armadilhas de segurança: proteger a planilha não é criptografar o arquivo",
      order: 2,
      blocks: [
        prose([
          "O Office oferece vários recursos com \"senha\" e \"proteção\" no nome, e o erro mais frequente é supor que todos protegem do mesmo modo. Há dois mecanismos muito diferentes, e a diferença entre eles é a diferença entre uma etiqueta de \"não mexa\" e um cofre. Quem os confunde entrega informações a quem não devia, convencido de que estavam protegidas.",
          "",
          "A **proteção de planilha** (*Revisão > Proteger Planilha*, e a proteção de estrutura da pasta de trabalho) impede que alguém **edite** certas células pelo Excel: os campos com fórmulas ficam bloqueados, os de entrada ficam livres. É um recurso de **integridade**, e funciona bem para o que se propõe: evitar que alguém apague uma fórmula por engano. Mas ela **não esconde nem cifra nada**. O arquivo continua sendo um pacote ZIP com os dados em XML legível, e a proteção é só uma marca: uma etiqueta `<sheetProtection>` no XML da planilha, com um resumo (*hash*) da senha. Qualquer programa que leia o pacote vê todo o conteúdo, inclusive as fórmulas e as células \"ocultas\", e quem sabe o que procurar remove a etiqueta. Há programas gratuitos que fazem isso em segundos. Uma planilha protegida com a lista de salários de toda a empresa continua exibindo a lista a quem a abrir como ZIP, ou a quem a abrir no Excel e usar as ferramentas de leitura. O mesmo vale para as senhas de **abrir para somente leitura** e para as colunas ocultas: ocultar não é proteger.",
          "",
          "A **criptografia do arquivo** (*Arquivo > Informações > Proteger Pasta de Trabalho > Criptografar com Senha*) é outra coisa. O arquivo inteiro é cifrado com a senha, em um algoritmo moderno, e **não é mais um pacote ZIP**: sem a senha, não há como ler nada, nem o nome das planilhas. É um recurso de **confidencialidade**: quem não tem a senha não vê os dados, e é o certo para o que não deve ser lido. Duas ressalvas. A primeira: a senha não pode ser recuperada, nem pelo fabricante; se for esquecida, os dados se perdem. A segunda: a segurança é a da senha. Uma senha curta ou previsível (\"1234\", o nome da empresa) cede a tentativas automatizadas, e a senha enviada no mesmo e-mail do arquivo não protege de ninguém.",
          "",
          "O exemplo mostra a diferença nos arquivos. A mesma planilha é protegida e salva; os dados continuam legíveis no XML. Outra é criptografada, e deixa de ser um pacote.",
          "",
          "Algumas outras observações de segurança que valem para todo o Office. Os **macros** (VBA) são programas dentro do arquivo, guardados nos formatos `.xlsm`, `.docm` e `.pptm`; um arquivo recebido de fonte desconhecida pedindo para \"Habilitar Conteúdo\" deve ser tratado como um programa desconhecido, e a regra é não habilitar. Os arquivos baixados da internet ou recebidos por e-mail abrem em **Modo de Exibição Protegido**, sem executar macros nem atualizar vínculos; o botão \"Habilitar Edição\" deve ser usado só depois de se confiar na origem. E os **vínculos externos** (a próxima seção) fazem a planilha buscar dados em outros arquivos, o que o Excel avisa ao abrir.",
        ]),
        code("csv", [
          "Sala;Valor",
          "Atenas;540",
        ], "Folha1!A1: uma planilha com um dado"),
        code("excel", [
          "Proteger: planilha com senha",
          "Salvar como: protegida.xlsx",
        ], "A planilha é protegida com senha e salva"),
        code("text", [
          "parte:protegida.xlsx!xl/worksheets/sheet1.xml contém: <sheetProtection",
          "parte:protegida.xlsx!xl/worksheets/sheet1.xml contém: <c r=\"B2\"><v>540</v></c>",
          "parte:protegida.xlsx!xl/sharedStrings.xml contém: <si><t>Atenas</t></si>",
        ], "Resultado: a proteção é uma marca no XML; os dados continuam legíveis"),
        code("csv", [
          "Sala;Valor",
          "Tebas;750",
        ], "Folha2!A1: outra planilha, para criptografar"),
        code("excel", [
          "Salvar como: criptografada.xlsx [com senha]",
        ], "Criptografar com senha"),
        code("text", [
          "partes:criptografada.xlsx = não é um pacote ZIP (arquivo criptografado)",
        ], "Resultado: o arquivo criptografado deixou de ser um pacote ZIP"),
        prose([
          "A planilha protegida tem a marca `<sheetProtection`, e os dados, o `540` e o texto \"Atenas\", estão no XML em texto claro: quem abre o arquivo como ZIP lê tudo, e a senha, que só protege a edição pelo Excel, não impede isso. O arquivo criptografado é outra coisa: sua estrutura interna não é mais a de um pacote do Office, e nenhum programa consegue ler as partes sem a senha.",
          "",
          "A escolha entre os dois depende do objetivo. Para **evitar erros** de quem usa a planilha, proteja as células de fórmulas. Para **impedir a leitura**, criptografe o arquivo (e guarde a senha em um gerenciador). Para **os dois**, aplique os dois recursos, com consciência de que cada um faz uma coisa.",
        ]),
        porque([
          "Proteger planilha evita edições, mas não esconde nem cifra: os dados seguem legíveis no XML. Para confidencialidade, use *Criptografar com Senha* (o arquivo deixa de ser ZIP), com senha forte guardada fora do e-mail. Nunca habilite macros de origem desconhecida.",
        ]),
        quebraria([
          "O RH envia a folha de pagamento em uma planilha com as colunas de salário \"ocultas e protegidas com senha\". Um dos destinatários abre o arquivo como ZIP, vê o XML em texto claro e descobre os salários de toda a diretoria em dois minutos. A empresa responde a uma reclamação por vazamento de dados pessoais.",
        ]),
      ],
    },
    {
      title: "Vínculos, versões e a conferência antes de enviar",
      order: 3,
      blocks: [
        prose([
          "Uma fórmula do Excel pode buscar um dado em **outro arquivo**: `='C:\\Dados\\[origem.xlsx]Planilha1'!B2`. É um **vínculo externo**, e permite dividir o trabalho em arquivos separados (um cadastro central, relatórios que leem dele). Em contrapartida, cria uma dependência que ninguém vê: o relatório só funciona enquanto o arquivo de origem estiver no lugar indicado, e o Excel mostra, ao abrir, a pergunta \"Atualizar vínculos?\". Se a resposta é não, os números ficam como estavam na última gravação; se é sim, e a origem foi movida, renomeada ou apagada, os valores viram erro ou ficam desatualizados em silêncio.",
          "",
          "O arquivo guarda o vínculo de uma forma que expõe mais do que se imagina. A fórmula é gravada com um número entre colchetes, `[1]Planilha1!B2`, e uma parte própria do pacote, `xl/externalLinks/externalLink1.xml`, guarda os valores em cache do arquivo de origem e o **caminho** dele, com as pastas e o nome do usuário de quem o criou. Um relatório enviado a um cliente revela, sem que ninguém perceba, o nome do arquivo de origem e a estrutura de pastas da empresa. *Dados > Editar Vínculos para Arquivos* (no menu de *Consultas e Conexões*) lista todos os vínculos da pasta de trabalho, com o estado de cada um, e permite atualizá-los, trocar a origem ou **quebrá-los**, o que transforma as fórmulas em valores fixos. A quebra de vínculos é o passo normal antes de enviar um relatório a quem não tem acesso aos arquivos de origem.",
          "",
          "Os vínculos aparecem também onde menos se espera: em **nomes definidos** que apontam para outros arquivos, em gráficos, em formatos condicionais e em validações de dados que herdam de modelos antigos. Uma planilha copiada de um modelo de anos atrás costuma ter vínculos para pastas que não existem mais, e o aviso \"Esta pasta de trabalho contém vínculos para uma ou mais fontes externas que podem não ser seguras\" aparece sem que ninguém saiba de onde vêm. O Editar Vínculos e o Gerenciador de Nomes (com o filtro de nomes com erros) são os dois lugares onde procurá-los.",
          "",
          "O tema das **versões** pede disciplina mais que ferramenta. A prática de cópias com nomes como `relatorio_v2_final_REVISADO_agora_vai.xlsx` produz arquivos que ninguém sabe qual vale, e dois colegas editando cópias diferentes geram trabalho duplicado a conciliar. O armazenamento em nuvem (OneDrive, SharePoint) mantém um **histórico de versões** do mesmo arquivo e permite a **coautoria**, várias pessoas editando ao mesmo tempo, o que substitui o hábito de enviar anexos por e-mail. O princípio é que haja **um arquivo** de referência, com um local conhecido, e que os anexos sejam substituídos por links para ele. Na coautoria, a regra da integração que o livro retoma adiante vale em dobro: a validação de dados e as fórmulas conferem o que cada pessoa digita, mas duas pessoas podem digitar ao mesmo tempo valores que, cada um por si, estavam corretos e juntos violam uma regra.",
          "",
          "O fecho do capítulo é uma **lista de conferência** para qualquer documento do Office que sai da sua mão. Para o **Excel**: modo de cálculo automático e sem referências circulares; nenhum vínculo externo desnecessário (Editar Vínculos); nomes sem erros; nenhuma planilha oculta que não deveria sair; fórmulas que somam os intervalos certos; tabelas e dinâmicas atualizadas. Para o **Word**: estilos de título aplicados, campos atualizados (`Ctrl+A`, `F9`), alterações e comentários aceitos ou removidos. Para o **PowerPoint**: títulos em todos os slides, notas e slides ocultos revistos, texto alternativo nas imagens. Para **todos**: o Inspecionar Documento para as propriedades pessoais e o formato certo de entrega (PDF, quando o destinatário só precisa ver). O custo é de alguns minutos, e é o que separa uma entrega confiável de um incidente.",
          "",
          "O exemplo cria um arquivo de origem, depois um relatório que lê um valor dele por vínculo, e examina o que o relatório guarda sobre a origem.",
        ]),
        code("csv", [
          "Local;Valor",
          "Atenas;540",
          "Delfos;240",
        ], "Planilha1!A1: o arquivo de origem, com dois valores"),
        code("excel", [
          "Salvar como: origem.xlsx",
          "Nova: pasta de trabalho",
          "A1: ='C:\\Dados\\[origem.xlsx]Planilha1'!B2",
          "Salvar como: relatorio.xlsx",
        ], "Um relatório novo lê o valor de B2 do arquivo de origem"),
        code("text", [
          "A1 = 540",
          "partes:relatorio.xlsx contém: xl/externalLinks/externalLink1.xml",
          "parte:relatorio.xlsx!xl/externalLinks/externalLink1.xml contém: <externalBook",
          "parte:relatorio.xlsx!xl/externalLinks/_rels/externalLink1.xml.rels contém: origem.xlsx",
          "parte:relatorio.xlsx!xl/worksheets/sheet1.xml contém: <f>[1]Planilha1!B2</f>",
        ], "Resultado: o vínculo vira uma parte do pacote, com o caminho do arquivo de origem"),
        prose([
          "O relatório mostra 540, lido do outro arquivo. O que ele guarda é mais do que o valor: uma parte `externalLink1.xml` com o cache dos dados da origem, e a relação que guarda o caminho do arquivo `origem.xlsx`. A fórmula é gravada como `[1]Planilha1!B2`, onde o `[1]` é o número do vínculo.",
          "",
          "Quem recebe o relatório e o abre vê o aviso sobre os vínculos, e quem o abre como pacote lê o caminho completo da origem. A cura é quebrar o vínculo antes de enviar, o que converte a fórmula no valor 540 e remove a parte do pacote.",
        ]),
        porque([
          "Vínculos externos dependem do arquivo de origem e expõem o caminho dele no pacote; liste-os em *Editar Vínculos* e quebre-os antes de enviar. Mantenha um arquivo de referência (nuvem, histórico de versões) em vez de cópias com nomes de versão, e faça a conferência final de cada programa antes da entrega.",
        ]),
        quebraria([
          "Um relatório de fornecedores é enviado a um parceiro com um vínculo para `C:\\Users\\mariana\\Documents\\Negociações 2026\\Custos reais.xlsx`. O parceiro abre o arquivo, vê o caminho da pasta e o nome do arquivo de custos, e passa a pedir essa planilha nas rodadas seguintes de negociação.",
        ]),
      ],
    },
  ],
};

export const OFFICE_BOOK_12_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "intermediate",
    promptMd: "Uma planilha mostra um total de R$ 30, mas a soma manual dos itens dá R$ 120, e nenhuma fórmula exibe erro. A barra de status do Excel mostra a palavra \"Calcular\". Qual é a causa mais provável?",
    choices: [
      "O Excel está em cálculo manual e as fórmulas não foram recalculadas desde a última mudança",
      "Há uma referência circular que o Excel bloqueou",
      "A planilha está protegida e não permite o recálculo",
      "Alguma célula contém texto no lugar de número",
    ],
    answerKeyMd: "O Excel está em cálculo manual e as fórmulas não foram recalculadas desde a última mudança",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "advanced",
    promptMd: "O RH precisa enviar a um auditor externo uma planilha com os salários, e propõe \"ocultar a coluna e proteger a planilha com senha\". Explique por que isso não garante a confidencialidade, o que um destinatário mal-intencionado consegue fazer e o que deveria ser feito para proteger o conteúdo e para impedir edições.",
    answerKeyMd: "Ocultar colunas e proteger a planilha são recursos de integridade/apresentação: impedem edição pelo Excel, não leitura. O arquivo continua sendo um pacote ZIP com o XML em texto claro; a proteção é uma marca (<sheetProtection> com o hash da senha) e as células ocultas continuam nas partes do pacote. Um destinatário pode abrir o arquivo como ZIP (ou com ferramentas) e ler os salários, ou remover a marca de proteção. Para confidencialidade, usar Arquivo > Informações > Proteger Pasta de Trabalho > Criptografar com Senha (o arquivo inteiro é cifrado e deixa de ser ZIP), com senha forte enviada por outro canal; se o auditor só precisa de parte dos dados, enviar uma cópia só com o necessário. Para impedir edições, aplicar também a proteção de planilha (ou enviar em PDF).",
    rubricMd: "Distingue integridade de confidencialidade; explica o XML legível; propõe criptografia de arquivo com senha forte e canal separado; sugere cópia reduzida ou PDF.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "Monte uma lista de conferência de seis itens que um analista deve rodar numa pasta de trabalho do Excel antes de enviá-la a terceiros, indicando para cada item como verificar no próprio Excel e o risco que ele previne.",
    answerKeyMd: "1) Modo de cálculo: Fórmulas > Opções de Cálculo = Automático (barra de status sem \"Calcular\"); previne totais desatualizados. 2) Referências circulares: Fórmulas > Verificação de Erros > Referências Circulares (e barra de status); previne resultados 0 silenciosos. 3) Vínculos externos: Dados > Editar Vínculos (e Gerenciador de Nomes para nomes com erro); quebrar os desnecessários, o que evita dependência e vazamento de caminhos. 4) Estrutura dos dados: sem células mescladas, totais misturados ou linhas em branco no meio; previne contagens e somas erradas. 5) Tabelas, dinâmicas e consultas atualizadas: Dados > Atualizar Tudo; previne relatório com dados antigos. 6) Inspecionar Documento (Arquivo > Informações > Verificar Problemas): remove propriedades pessoais, comentários e planilhas ocultas indevidas; e, se necessário, criptografar com senha ou exportar em PDF.",
    points: 20,
  },
];

export const OFFICE_BOOK_12_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Como perceber o cálculo manual?", backMd: "Barra de status com \"Calcular\" e totais que não acompanham; o modo vale para todas as pastas abertas na sessão. Fórmulas > Opções de Cálculo > Automático (F9 recalcula)." },
  { nodeTitle: NODE, frontMd: "Por que INDIRETO é uma armadilha?", backMd: "Trata texto como endereço e não acompanha inserções de linhas/colunas (devolve outra célula sem erro); também é volátil. Prefira ÍNDICE/PROCX e referências diretas." },
  { nodeTitle: NODE, frontMd: "O que as células mescladas fazem com as funções?", backMd: "O valor fica só na célula superior esquerda; as outras ficam vazias: CONT.SE/SOMASE perdem linhas sem erro. Também travam classificação, filtro e tabelas." },
  { nodeTitle: NODE, frontMd: "Proteger planilha × criptografar arquivo", backMd: "Proteger planilha só impede edição (marca no XML; dados legíveis). Criptografar com senha cifra o arquivo (deixa de ser ZIP) — confidencialidade." },
  { nodeTitle: NODE, frontMd: "O que um vínculo externo deixa no arquivo?", backMd: "Fórmula [1]Planilha1!B2, parte xl/externalLinks com cache e o caminho do arquivo de origem. Liste em Editar Vínculos e quebre antes de enviar." },
];
