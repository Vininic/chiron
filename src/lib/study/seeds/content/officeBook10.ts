// Pacote Office, reescrita autoral (PLANO.md §R.2) — capítulo 10.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Word: campos, mala direta, revisão e acessibilidade";

export const OFFICE_BOOK_10: ContentChapter = {
  title: NODE,
  level: "avancado",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "Campos e marcadores: texto que o Word calcula",
      order: 0,
      blocks: [
        prose([
          "O sumário, o número de página e a numeração das legendas, vistos no capítulo anterior, são exemplos de um mecanismo mais geral do Word: o **campo**. Um campo é uma instrução, escrita entre chaves, que o Word executa para produzir um texto. O **código** do campo diz o que fazer (`PAGE`, `SEQ Tabela`, `TOC`); o **resultado** é o texto que aparece no documento. Normalmente só o resultado é visível; `Alt+F9` alterna entre ver os resultados e ver os códigos de todos os campos, e o código de um campo isolado se vê com o botão direito e *Alternar Códigos de Campo*. O resultado é recalculado quando o campo é **atualizado**: selecionando-o e pressionando `F9`, ou selecionando o documento inteiro e `F9` para atualizar todos.",
          "",
          "A maior parte dos campos não se escreve à mão: entram pelos comandos do Word. Há, porém, uma família que vale conhecer. Os de **numeração** (`PAGE`, `NUMPAGES`, `SEQ`) contam páginas e itens. Os de **sumário e índice** (`TOC`, `INDEX`) montam listas. Os de **referência** (`REF`, `PAGEREF`) repetem em outro lugar um texto do documento. Os de **data e hora** (`DATE`, `TIME`, `CREATEDATE`, `SAVEDATE`) trazem datas. Os de **lógica e cálculo** (`IF`, `=`, `QUOTE`) decidem e calculam: um campo `= 12 * 3` mostra 36, um `IF 1 = 1 \"sim\" \"não\"` mostra \"sim\", um `QUOTE \"texto fixo\"` repete o texto entre aspas. Os de **mala direta** (`MERGEFIELD`) são o assunto da próxima seção. Em um documento de contrato, uma cláusula que muda conforme uma condição, ou uma soma que acompanha uma tabela, é trabalho para campos.",
          "",
          "A família de datas tem uma armadilha séria. O campo `DATE` mostra **a data de hoje**, e se atualiza ao abrir e ao imprimir o documento. Um contrato com a data inserida por *Inserir > Data e Hora*, com a opção *Atualizar automaticamente* marcada, mostra a data em que alguém o abriu, e não a data em que foi assinado. O erro costuma ser descoberto muito depois, com o contrato impresso e arquivado com uma data que não é a de ninguém. As alternativas corretas dependem do que se quer: `CREATEDATE` mostra a data de criação do arquivo; `SAVEDATE`, a do último salvamento; e, para um documento que registra um fato (uma ata, um contrato), a melhor escolha é digitar a data como texto comum. A atualização automática é para documentos que querem mesmo a data de hoje, como uma carta-modelo.",
          "",
          "O **marcador** (*Inserir > Marcador*) dá um nome a um trecho do documento, e o campo `REF` repete o conteúdo desse trecho em outro lugar. É a base das *referências cruzadas* (*Inserir > Referência Cruzada*), que apontam para títulos, legendas, páginas e itens numerados e se atualizam quando eles mudam. Uma referência cruzada correta resolve o problema de textos como \"conforme a cláusula 5.3 na página 12\", que ficam errados na primeira edição; com campos, o número da cláusula e o da página acompanham o documento.",
          "",
          "O marcador tem um comportamento que pega desprevenidos: ele **abrange o texto que marcou**, e se esse texto é substituído por inteiro, o marcador desaparece. Selecionar o parágrafo marcado, digitar por cima e ver tudo certo na tela apaga o marcador; o campo `REF` que apontava para ele passa a mostrar **\"Erro! Fonte de referência não encontrada.\"** na próxima atualização. Alterar apenas uma parte do texto (trocar \"540\" por \"600\", por exemplo) preserva o marcador, e o campo mostra o novo texto. Quando um parágrafo marcado precisa ser reescrito, o caminho seguro é editar dentro dele, e conferir os campos depois de revisões grandes.",
          "",
          "Duas regras práticas para trabalhar com campos. A primeira é **atualizar tudo antes de finalizar**: `Ctrl+A` seguido de `F9`, depois de conferir a janela de revisão, o sumário e as referências. A segunda é saber que campos podem ser **travados** (`Ctrl+F11`) para que não mudem, e destravados (`Ctrl+Shift+F11`), e **desvinculados** (`Ctrl+Shift+F9`), o que transforma o resultado em texto comum: o modo certo de \"congelar\" um valor antes de enviar o documento para fora.",
          "",
          "O primeiro exemplo escreve um parágrafo com um marcador, insere campos de cálculo, de texto e de decisão, mais uma referência ao marcador, e troca parte do texto marcado. O segundo reescreve um parágrafo marcado por inteiro.",
        ]),
        code("word", [
          "[Normal] Preço combinado: R$ 540,00",
          "[Normal] Prazo de 30 dias.",
          "Marcador: preco = parágrafo 1",
          "Campo: = 12 * 3",
          "Campo: QUOTE \"texto fixo\"",
          "Campo: IF 1 = 1 \"sim\" \"não\"",
          "Referência: preco",
        ], "Um marcador e quatro campos: um cálculo, um texto, uma decisão e uma referência"),
        code("text", [
          "doc:campos = = 12 * 3 => 36 / QUOTE \"texto fixo\" => texto fixo / IF 1 = 1 \"sim\" \"não\" => sim / REF preco => Preço combinado: R$ 540,00",
          "doc:marcadores = preco = Preço combinado: R$ 540,00",
        ], "Resultado: o código e o resultado de cada campo, e o marcador"),
        code("word", [
          "Trocar: 540 -> 600",
          "Atualizar: campos",
        ], "Só uma parte do texto marcado é trocada"),
        code("text", [
          "doc:campos = = 12 * 3 => 36 / QUOTE \"texto fixo\" => texto fixo / IF 1 = 1 \"sim\" \"não\" => sim / REF preco => Preço combinado: R$ 600,00",
          "doc:marcadores = preco = Preço combinado: R$ 600,00",
        ], "Resultado: o marcador sobreviveu, e a referência mostra o texto novo"),
        code("word", [
          "Novo: documento",
          "[Normal] Prazo de entrega: 30 dias.",
          "Marcador: prazo = parágrafo 1",
          "Referência: prazo",
          "Substituir: parágrafo 1 = Prazo de entrega: 15 dias.",
          "Atualizar: campos",
        ], "Um documento novo, em que o parágrafo marcado é reescrito por inteiro"),
        code("text", [
          "doc:marcadores = ",
          "doc:campos = REF prazo => Erro! Fonte de referência não encontrada.",
        ], "Resultado: o marcador desapareceu, e a referência quebrou"),
        prose([
          "Os quatro campos do primeiro documento mostraram seus resultados: 36, o texto fixo, \"sim\" e o conteúdo do parágrafo marcado, repetido pelo `REF`. O código e o resultado são coisas distintas: o que o leitor vê é a coluna da direita. Ao trocar só o \"540\" por \"600\", o marcador continuou existindo, e a referência mostrou o parágrafo atualizado.",
          "",
          "No segundo documento, o parágrafo marcado foi reescrito por inteiro. A lista de marcadores ficou vazia, e a referência, ao ser atualizada, mostrou a mensagem de erro no lugar do prazo. Nada disso é visível enquanto se edita: o texto novo está na tela, correto, e o erro só aparece quando os campos são atualizados, em geral na véspera da entrega.",
        ]),
        porque([
          "Campo = código + resultado; `Alt+F9` mostra os códigos e `F9` atualiza. Não use `DATE` para registrar uma data (ele mostra a de hoje). Marcador some se o texto marcado for substituído por inteiro e o `REF` vira erro; edite dentro dele e atualize tudo (`Ctrl+A`, `F9`) antes de finalizar.",
        ]),
        quebraria([
          "Um contrato-modelo traz a data de assinatura num campo `DATE`. Três anos depois, em uma disputa, o contrato é aberto e impresso como prova: a data que aparece é a do dia da impressão, e a outra parte contesta a autenticidade do documento.",
        ]),
      ],
    },
    {
      title: "Mala direta: um documento para muitos destinatários",
      order: 1,
      blocks: [
        prose([
          "A mala direta resolve a tarefa de escrever a mesma carta para centenas de pessoas, cada uma com os seus dados: o Word combina um **documento principal**, com o texto e os pontos onde entram os dados, e uma **fonte de dados**, que tem uma linha por destinatário. O resultado é uma carta para cada linha, com os campos substituídos. Serve para cartas, convites, etiquetas, certificados e e-mails personalizados, e é o assunto de *Correspondências > Iniciar Mala Direta*.",
          "",
          "A fonte de dados mais prática é uma **planilha do Excel**: a primeira linha traz os nomes das colunas (`Nome`, `Sala`, `Data`, `Valor`), e cada linha seguinte, um destinatário. Os nomes das colunas viram os **campos de mesclagem**, inseridos no documento principal por *Inserir Campo de Mesclagem* e exibidos entre aspas angulares: «Nome». O código por baixo é um campo `MERGEFIELD Nome`. Depois de montado o texto, *Visualizar Resultados* mostra a carta de cada destinatário, e *Concluir e Mesclar > Editar Documentos Individuais* gera um documento novo, com uma carta por linha da planilha, para revisar e imprimir.",
          "",
          "O problema de quem usa a mala direta pela primeira vez é que o Word **não lê a planilha como o Excel a mostra**. Ele lê pela camada de dados, que entrega o valor *bruto* de cada célula, sem o formato. Três consequências aparecem em toda mala direta feita com Excel. A primeira é a **data**: a célula que o Excel mostra como `01/02/2026` chega ao Word como `2/1/2026`, na ordem americana de mês e dia, o que um leitor brasileiro lê como 2 de janeiro. A segunda é o **número**: o valor que o Excel mostra como `R$ 1.234,50`, com o formato de moeda, chega como `1234,5`, e um valor como 45,9 pode chegar com o resíduo do ponto flutuante, `45,899999999999999`. A terceira, menos visível, são os **zeros à esquerda e os textos numéricos**, como CEPs e códigos, que dependem de como a coluna foi detectada.",
          "",
          "Há duas defesas. A primeira é aplicar **formatos ao campo**: um campo `MERGEFIELD Data \\@ \"dd/MM/yyyy\"` formata a data na ordem brasileira, e `MERGEFIELD Valor \\# \"#.##0,00\"` formata o número com separadores. As chaves `\\@` e `\\#` valem para data e número. O formato numérico tem um defeito: o `#` reserva espaço, e um valor menor deixa espaços à esquerda, como em `  45,90`. A segunda defesa é mais robusta: **preparar na planilha uma coluna de texto já formatado**, com `=TEXTO(D2;\"R$ #.##0,00\")`, e usar essa coluna na mala direta. O texto chega como foi escrito, sem depender de formato, de configuração regional ou de ponto flutuante.",
          "",
          "Os nomes das colunas importam. Eles viram nomes de campo, e um nome com espaço ou acento pode exigir aspas no código do campo (`MERGEFIELD \"Valor em reais\"`); nomes simples e sem espaços, como `ValorTexto`, evitam problemas. Células vazias na coluna produzem espaços vazios no documento, e é para isso que existem as **regras** (*Regras > Se...Então...Senão*), capazes de, por exemplo, incluir uma frase só quando um campo está preenchido. Antes de mesclar, convém **conferir a visualização de vários registros**, em especial o primeiro, o último e os que têm dados incomuns (nomes longos, campos vazios).",
          "",
          "Duas observações sobre o envio. A mala direta é **estática**: o documento mesclado é uma cópia, que não acompanha a planilha. Se a planilha mudar depois, é preciso mesclar de novo. E a mesclagem por e-mail (*Concluir e Mesclar > Enviar Mensagens de E-mail*) usa o Outlook e envia uma mensagem por linha; um erro na fonte de dados vira centenas de mensagens erradas, que não se desfazem. Por isso, testa-se com uma planilha de poucas linhas, para endereços próprios, antes do envio real.",
          "",
          "O exemplo cria a planilha de destinatários, com uma coluna extra de texto formatado, escreve duas linhas no documento principal (uma com os campos brutos e outra com os formatados) e mostra o resultado da mesclagem.",
        ]),
        code("csv", [
          "Nome;Sala;Data;Valor",
          "Ana;Atenas;01/02/2026;1234,5",
          "Bia;Delfos;15/03/2026;45,9",
        ], "Planilha1!A1: dois destinatários, com data e valor"),
        code("excel", [
          "E1: ValorTexto",
          "E2: =TEXTO(D2;\"R$ #.##0,00\")",
          "E3: =TEXTO(D3;\"R$ #.##0,00\")",
          "Salvar como: destinatarios.xlsx",
        ], "Uma coluna com o valor já formatado como texto, e a planilha salva"),
        code("word", [
          "[Normal] Bruto: {Nome}; {Sala}; {Data}; {Valor}",
          "[Normal] Formatado: {Nome}; {Data@dd/MM/yyyy}; {ValorTexto}",
          "Mala direta: dados = destinatarios.xlsx",
        ], "O documento principal: uma linha com os campos como vêm e outra com os campos formatados"),
        code("text", [
          "doc:mesclado = Bruto: Ana; Atenas; 2/1/2026; 1234,5 / Formatado: Ana; 01/02/2026; R$ 1.234,50 / Bruto: Bia; Delfos; 3/15/2026; 45,899999999999999 / Formatado: Bia; 15/03/2026; R$ 45,90",
        ], "Resultado: uma carta por destinatário, com os dois formatos lado a lado"),
        prose([
          "Nas linhas \"Bruto\", a data de Ana (1º de fevereiro) chegou como `2/1/2026`, e a de Bia (15 de março) como `3/15/2026`, na ordem americana; o valor de Ana chegou como `1234,5`, sem moeda, e o de Bia como `45,899999999999999`, com o resíduo do ponto flutuante. É assim que o Word recebe o que o Excel mostra de forma bonita.",
          "",
          "Nas linhas \"Formatado\", o campo de data com o formato `dd/MM/yyyy` produziu `01/02/2026` e `15/03/2026`, e a coluna de texto formatado trouxe `R$ 1.234,50` e `R$ 45,90` exatamente como estavam na planilha. São duas cartas por destinatário porque o documento principal tem dois parágrafos; numa mala direta real há um modelo só, e uma carta por linha da planilha.",
        ]),
        porque([
          "Na mala direta com Excel, o Word recebe valores brutos: datas em ordem americana, números sem formato e com resíduo de ponto flutuante. Aplique formato ao campo (`\\@ \"dd/MM/yyyy\"`) ou, melhor, prepare colunas de texto formatado com `TEXTO` na planilha. Teste com poucas linhas antes de enviar por e-mail.",
        ]),
        quebraria([
          "Um convite é enviado a 800 clientes com a data da reunião vinda direto da planilha. Os convites chegam dizendo \"3/10/2026\" para uma reunião marcada em 3 de outubro, e a metade dos destinatários lê 10 de março. A sala está vazia na data certa e cheia de gente confusa na errada.",
        ]),
      ],
    },
    {
      title: "Revisão: controle de alterações e comentários",
      order: 2,
      blocks: [
        prose([
          "Quando mais de uma pessoa trabalha em um documento, o **controle de alterações** (*Revisão > Controlar Alterações*, `Ctrl+Shift+E`) registra cada mudança em vez de aplicá-la em silêncio. Com ele ligado, o texto apagado fica marcado como **exclusão** (em geral riscado), o texto novo é uma **inserção** (sublinhado), e cada alteração leva o nome do autor e a data. O autor do documento passa então a revisar: ele **aceita** cada mudança, que passa a ser texto definitivo, ou a **rejeita**, que a descarta e restaura o original. A ferramenta transforma a edição colaborativa de um processo de \"qual é a versão certa\" em uma discussão item a item.",
          "",
          "Os **comentários** (*Revisão > Novo Comentário*) cumprem outro papel: guardar conversas sobre o texto sem alterá-lo. São balões ligados a um trecho, com resposta e a opção de marcar como resolvido. A regra de ouro de uma revisão limpa é usar a **alteração** quando se propõe uma mudança no texto e o **comentário** quando se pergunta, justifica ou aponta um problema que o texto não resolve. Um comentário diz \"confirme este prazo com o financeiro\"; a alteração troca \"30 dias\" por \"15 dias\".",
          "",
          "O Word oferece formas de ver o documento em diferentes estados, e confundi-las é a origem de acidentes. *Todas as Marcas* mostra o texto com as alterações e os comentários. *Marcas Simples* mostra o texto final com uma barra na margem onde há mudança. *Sem Marcas* mostra o resultado como ficaria se tudo fosse aceito, **sem que nada tenha sido aceito**: as alterações continuam no arquivo. *Original* mostra o texto antes das mudanças. Quem revisa em *Sem Marcas* e envia o arquivo acreditando que ele está \"limpo\" envia um documento com todas as alterações, e os comentários, dentro.",
          "",
          "É aqui que a revisão encontra a privacidade, que o capítulo 1 introduziu. As alterações pendentes fazem parte do conteúdo do arquivo, e **o texto excluído continua lá**: quem abre o documento vê, ativando as marcas, o preço que foi trocado, a frase cortada, a observação interna. Um programa que lê o texto do documento recebe o texto antigo e o novo **juntos**, na ordem em que aparecem. O exemplo mostra isso: uma frase em que \"540\" foi trocado por \"600\" lê-se, para um programa, como \"540600\". O Inspecionar Documento (*Arquivo > Informações > Verificar Problemas*) lista revisões, comentários e versões e permite removê-los, mas a forma correta de \"limpar\" é **aceitar ou rejeitar tudo** de forma consciente, antes de enviar.",
          "",
          "A ferramenta tem limites de precisão. O Word registra a alteração no nível de **trecho**: trocar uma palavra gera uma exclusão e uma inserção, e a edição cuidadosa (trocar só o que muda) produz uma revisão legível, enquanto reescrever o parágrafo inteiro produz um par exclusão/inserção do tamanho do parágrafo, difícil de revisar. O mesmo vale para mudanças de formatação, que são registradas à parte e podem poluir o painel. O botão *Comparar* (*Revisão > Comparar*) gera as marcas entre duas versões de um documento que foram editadas sem controle de alterações, e é o recurso para quando alguém esqueceu de ligar o controle.",
          "",
          "O exemplo liga o controle em um parágrafo, troca dois trechos, acrescenta um comentário e depois mostra o documento aceitando as alterações e rejeitando-as.",
        ]),
        code("word", [
          "[Normal] A reserva de Atenas custa R$ 540,00 e vence em 30 dias.",
          "[Normal] O pagamento é feito por transferência.",
          "Revisões: ligar",
          "Trocar: 540 -> 600",
          "Trocar: 30 dias -> 15 dias",
          "Comentário: parágrafo 2 = Confirmar com o financeiro.",
        ], "O controle de alterações ligado, duas trocas e um comentário"),
        code("text", [
          "doc:revisoes = exclusão: 540 / inserção: 600 / exclusão: 30 dias / inserção: 15 dias",
          "doc:comentarios = O pagamento é feito por transferência. => Confirmar com o financeiro.",
          "doc:paragrafos = Normal: A reserva de Atenas custa R$ 540600,00 e vence em 30 dias15 dias. / Normal: O pagamento é feito por transferência.",
        ], "Resultado: quatro marcas e um comentário; o texto lido por um programa traz o excluído e o inserido juntos"),
        code("word", [
          "Aceitar: todas",
        ], "Todas as alterações aceitas"),
        code("text", [
          "doc:revisoes = ",
          "doc:paragrafos = Normal: A reserva de Atenas custa R$ 600,00 e vence em 15 dias. / Normal: O pagamento é feito por transferência.",
          "doc:comentarios = O pagamento é feito por transferência. => Confirmar com o financeiro.",
        ], "Resultado: o texto final, sem marcas, e o comentário ainda ali"),
        code("word", [
          "Novo: documento",
          "[Normal] A visita ao salão de Delfos está marcada para a manhã de sexta-feira.",
          "Revisões: ligar",
          "Trocar: manhã -> tarde",
          "Rejeitar: todas",
        ], "Outro documento, com uma alteração proposta e rejeitada"),
        code("text", [
          "doc:revisoes = ",
          "doc:paragrafos = Normal: A visita ao salão de Delfos está marcada para a manhã de sexta-feira.",
        ], "Resultado: rejeitar restaura o original"),
        prose([
          "Com o controle ligado, as duas trocas viraram quatro marcas, uma exclusão e uma inserção para cada. O comentário ficou preso ao segundo parágrafo. A leitura do texto por um programa mostra o efeito já descrito: `R$ 540600,00` e `30 dias15 dias`, o antigo e o novo colados, porque a exclusão continua no arquivo até ser aceita. Quem lê a tela com as marcas vê o texto riscado; quem lê o conteúdo por código recebe os dois.",
          "",
          "Ao aceitar tudo, o documento ficou com os valores novos, 600 e 15 dias, e sem nenhuma marca. O comentário continua lá: aceitar as alterações não apaga os comentários, que precisam ser excluídos ou resolvidos à parte. No último exemplo, a troca de \"manhã\" por \"tarde\" foi rejeitada e o texto voltou ao que era.",
        ]),
        porque([
          "Alteração propõe uma mudança; comentário pergunta ou justifica. \"Sem Marcas\" só esconde: o texto excluído e os comentários seguem no arquivo até serem aceitos, rejeitados ou removidos. Antes de enviar a terceiros, aceite ou rejeite tudo e use o Inspecionar Documento.",
        ]),
        quebraria([
          "Uma proposta comercial é enviada ao cliente com as alterações pendentes, escondidas pelo modo \"Sem Marcas\". O cliente ativa as marcas e lê o preço original, a margem que a equipe discutiu e o comentário \"podemos baixar mais 10% se insistirem\".",
        ]),
      ],
    },
    {
      title: "Acessibilidade: estrutura, texto alternativo, tabelas e idioma",
      order: 3,
      blocks: [
        prose([
          "Um documento acessível é aquele que pode ser usado por todos os leitores, inclusive pessoas que usam **leitores de tela** (programas que leem o conteúdo em voz alta ou em braile), pessoas com baixa visão, que ampliam o texto ou mudam as cores, e pessoas que navegam só pelo teclado. A acessibilidade não é um acréscimo no fim: quase tudo o que ela pede coincide com o que os capítulos anteriores recomendaram, e por isso um documento bem estruturado já é, em grande parte, um documento acessível. Em muitos contextos, como o serviço público e a educação, ela também é uma exigência legal.",
          "",
          "O primeiro pilar é a **estrutura**. Um leitor de tela percorre um documento pelos títulos, pulando de seção em seção, do mesmo modo que um leitor visual passa os olhos pelas partes em destaque. Para isso, os títulos precisam ser **estilos de título** (`Título 1`, `Título 2`), em níveis hierárquicos, e não texto formatado em negrito e tamanho grande: para o leitor de tela, o segundo é um parágrafo comum, e o documento não tem estrutura. As listas devem usar os estilos de lista e não hífens digitados, e o espaçamento deve vir do estilo e não de parágrafos vazios, que são lidos como \"em branco\".",
          "",
          "O segundo pilar é o **texto alternativo** das imagens e dos gráficos. Uma imagem é invisível para um leitor de tela, a menos que tenha uma descrição, e é a descrição que será lida. O texto deve dizer o que a imagem **comunica**, no contexto: \"Gráfico de colunas com o valor reservado por sala: Tebas lidera\" é útil; \"Imagem 1\" ou \"gráfico\" não são. Imagens puramente decorativas devem ser marcadas como tal (a opção *Marcar como decorativa*, no painel de texto alternativo), para que o leitor de tela as ignore em vez de ler o nome do arquivo. Em *Formatar Imagem > Texto Alternativo* está o campo, e uma imagem sem ele é uma das falhas mais comuns apontadas pelo verificador.",
          "",
          "O terceiro são as **tabelas**. Um leitor de tela lê uma tabela célula a célula e, quando a primeira linha está marcada como **cabeçalho**, anuncia o título da coluna junto com o valor de cada célula. Sem a marcação, ouve-se uma sequência de números sem contexto. Por isso, as tabelas de dados devem ter a opção *Linha de Cabeçalho* ligada, e a primeira linha deve conter os nomes das colunas. Tabelas usadas só para diagramar a página, sem dados, e células mescladas ou divididas dificultam a leitura e a navegação, e devem ser evitadas.",
          "",
          "O quarto pilar reúne **idioma, título e links**. O **idioma do texto** (neste livro, português do Brasil) faz o leitor de tela escolher a pronúncia certa: um texto em português lido com a voz inglesa é incompreensível. O **título do documento**, nas propriedades, é o que o leitor de tela e o navegador anunciam ao abrir o arquivo; sem ele, ouve-se o nome do arquivo. Os **textos dos links** devem fazer sentido sozinhos: \"clique aqui\" não diz nada para quem navega por uma lista de links, enquanto \"relatório de reservas de 2026\" diz. E a **cor** não pode ser o único meio de transmitir uma informação, e o texto precisa de contraste suficiente com o fundo (a recomendação internacional é uma razão de pelo menos 4,5 para 1 no texto comum).",
          "",
          "O Word traz o **Verificador de Acessibilidade** (*Revisão > Verificar Acessibilidade*), que lista erros (como imagens sem texto alternativo e tabelas sem cabeçalho), avisos e dicas. Ele ajuda, mas não substitui o julgamento: não avalia se o texto alternativo é bom, se a ordem de leitura faz sentido ou se um texto é compreensível. Ao exportar para PDF, a opção de incluir *marcas de estrutura do documento para acessibilidade* preserva os títulos, as tabelas e o texto alternativo no arquivo gerado; um PDF gerado por impressão virtual, sem isso, é uma imagem de página, e o leitor de tela não consegue lê-lo.",
          "",
          "O exemplo monta um documento com um título, uma imagem com texto alternativo, uma imagem sem, uma tabela com cabeçalho, o idioma e o título do documento, e lê cada uma dessas propriedades.",
        ]),
        code("word", [
          "[Título 1] Relatório de reservas",
          "Imagem: texto alternativo = Gráfico de colunas com o valor reservado por sala",
          "Imagem: sem texto alternativo",
          "Tabela: 2 linhas x 2 colunas com cabeçalho repetido",
          "Idioma: português",
          "Título do documento: Relatório de reservas do trimestre",
        ], "Um documento com duas imagens, uma tabela, o idioma e o título definidos"),
        code("text", [
          "doc:alternativos = Gráfico de colunas com o valor reservado por sala / (sem texto alternativo)",
          "doc:cabecalho-repetido:1 = sim",
          "doc:idioma = 1046",
          "doc:titulo = Relatório de reservas do trimestre",
        ], "Resultado: o texto alternativo de cada imagem, o cabeçalho da tabela, o idioma (1046 é português do Brasil) e o título"),
        prose([
          "A primeira imagem tem uma descrição que diz o que o gráfico comunica; a segunda, sem texto alternativo, é uma falha que o verificador apontaria e que um leitor de tela passaria em silêncio ou leria pelo nome do arquivo. A primeira linha da tabela está marcada como cabeçalho. O identificador de idioma `1046` é o do português do Brasil, e é o que o leitor de tela usa para escolher a voz e a pronúncia. O título do documento está nas propriedades.",
          "",
          "Cada uma dessas propriedades é um ajuste de poucos segundos quando feito durante a criação, e um trabalho de revisão quando é esquecido: o relatório de 60 páginas com 40 imagens sem descrição leva uma tarde para ser corrigido, e a maioria das descrições escritas no fim é pior do que as escritas na hora.",
        ]),
        porque([
          "Acessibilidade é, em grande parte, estrutura: estilos de título, listas de verdade, tabelas com cabeçalho. Acrescente texto alternativo que diga o que a imagem comunica, defina idioma e título do documento, escreva links que façam sentido sozinhos e rode o Verificador de Acessibilidade (sem tomá-lo como garantia).",
        ]),
        quebraria([
          "Uma prefeitura publica um edital em PDF gerado por impressão, sem estrutura. Um candidato que usa leitor de tela não consegue ler o documento: o PDF é uma imagem de página. A prefeitura é notificada pelo Ministério Público e refaz o processo de inscrição, com prazos prorrogados e custo de publicação duplicado.",
        ]),
      ],
    },
  ],
};

export const OFFICE_BOOK_10_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "intermediate",
    promptMd: "Numa mala direta feita com uma planilha do Excel, a data 01/02/2026 aparece nas cartas como 2/1/2026 e um valor mostrado como R$ 45,90 na planilha aparece como 45,899999999999999. Qual é a melhor correção para o valor?",
    choices: [
      "Criar na planilha uma coluna de texto com TEXTO(valor;\"R$ #.##0,00\") e usá-la na mala direta",
      "Reformatar a coluna do valor no Excel como Moeda",
      "Trocar a vírgula por ponto nos valores da planilha",
      "Salvar a planilha como CSV e importá-la de novo",
    ],
    answerKeyMd: "Criar na planilha uma coluna de texto com TEXTO(valor;\"R$ #.##0,00\") e usá-la na mala direta",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "advanced",
    promptMd: "Um revisor recebe um contrato com o controle de alterações ligado, muda o modo de exibição para \"Sem Marcas\" para ler com conforto e, achando o texto limpo, envia o arquivo ao cliente. Explique o que o cliente pode ver, por que um programa que lê o texto do arquivo recebe \"540600\" em vez de \"600\" e que passos o revisor deveria ter dado antes de enviar.",
    answerKeyMd: "\"Sem Marcas\" só altera a exibição: as revisões pendentes (exclusões, inserções) e os comentários continuam no arquivo. O cliente, ao ativar as marcas (Todas as Marcas), vê o texto excluído e os comentários internos. Para um programa que lê o texto do documento, a exclusão ainda faz parte do conteúdo até ser aceita: o texto antigo e o novo aparecem juntos, na ordem, como \"540600\" (540 excluído + 600 inserido). Antes de enviar, o revisor deveria aceitar ou rejeitar todas as alterações de forma consciente (Revisão > Aceitar/Rejeitar), resolver ou excluir os comentários, e rodar o Inspecionar Documento para verificar revisões, comentários e propriedades pessoais; manter uma cópia com as marcas.",
    rubricMd: "Explica que Sem Marcas só esconde; descreve o que o cliente vê; explica a leitura por programa; lista aceitar/rejeitar, comentários e Inspecionar Documento.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "Liste as verificações e os ajustes que tornam acessível um relatório em Word que contém títulos, três gráficos colados como imagem e uma tabela de dados com cabeçalho, dizendo em cada caso como fazer e o que o leitor de tela fará de diferente.",
    answerKeyMd: "Títulos: usar os estilos Título 1/2/3 em níveis hierárquicos (não negrito + tamanho grande), para que o leitor de tela navegue pela estrutura e o sumário funcione. Gráficos: texto alternativo em cada imagem (Formatar Imagem > Texto Alternativo) dizendo o que o gráfico comunica (por exemplo \"Colunas com o valor por sala; Tebas lidera\"); imagens decorativas marcadas como tal; sem isso o leitor de tela ignora a imagem ou lê o nome do arquivo. Tabela: ligar \"Linha de Cabeçalho\" (e repetir em cada página) e evitar células mescladas; o leitor anuncia o título da coluna com cada valor. Idioma português (Brasil) no texto e título nas propriedades do documento, para pronúncia e identificação corretas. Links com texto descritivo. Contraste e cor: não depender só da cor. Conferir com Revisão > Verificar Acessibilidade e, ao exportar PDF, manter as marcas de estrutura para acessibilidade.",
    points: 20,
  },
];

export const OFFICE_BOOK_10_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "O que é um campo do Word? Como ver o código e atualizar?", backMd: "Instrução cujo resultado o Word calcula (PAGE, SEQ, TOC, REF...). Alt+F9 alterna códigos; F9 atualiza; Ctrl+A e F9 atualiza tudo." },
  { nodeTitle: NODE, frontMd: "Por que o campo DATE é perigoso em contratos?", backMd: "Mostra a data de hoje e atualiza ao abrir/imprimir. Para registrar um fato, digite a data (ou use CREATEDATE/SAVEDATE)." },
  { nodeTitle: NODE, frontMd: "O que o Word recebe do Excel numa mala direta?", backMd: "Valores brutos: data em ordem americana (2/1/2026), números sem formato e com resíduo (45,899999999999999). Use \\@ / \\# no campo ou uma coluna TEXTO() na planilha." },
  { nodeTitle: NODE, frontMd: "\"Sem Marcas\" aceita as alterações?", backMd: "Não, só esconde: exclusões, inserções e comentários seguem no arquivo. Aceite/rejeite tudo e use o Inspecionar Documento antes de enviar." },
  { nodeTitle: NODE, frontMd: "Principais ajustes de acessibilidade no Word", backMd: "Estilos de título, texto alternativo nas imagens, linha de cabeçalho nas tabelas, idioma e título do documento, links descritivos, Verificador de Acessibilidade." },
];
