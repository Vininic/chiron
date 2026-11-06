// Pacote Office, reescrita autoral (PLANO.md §R.2) — capítulo 11.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "PowerPoint: slide mestre, layouts e apresentações acessíveis";

export const OFFICE_BOOK_11: ContentChapter = {
  title: NODE,
  level: "avancado",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "O slide mestre e os layouts: onde mora a aparência",
      order: 0,
      blocks: [
        prose([
          "Uma apresentação do PowerPoint parece uma sequência de slides independentes, cada um com sua fonte, suas cores e suas posições. Por dentro, é uma **hierarquia de três níveis**, e entendê-la é a diferença entre montar apresentações em minutos e refazer cada slide à mão. No alto está o **slide mestre**, que define o aspecto geral: o fundo, as fontes do tema, o estilo do título e do texto, a posição do número de slide. Abaixo dele, os **layouts** são os tipos de página (slide de título, título e conteúdo, comparação...), cada um com os seus **espaços reservados** nas posições certas. Embaixo estão os **slides**, que escolhem um layout e preenchem os espaços reservados com texto, imagens e gráficos.",
          "",
          "A regra de herança é a mesma dos estilos do Word: o que não é dito no nível de baixo vem do nível de cima. O título de um slide de conteúdo tem o tamanho que o layout define, e o layout herda do mestre o que não define por conta própria. O mestre é editado em *Exibir > Slide Mestre*, onde aparecem o mestre e os layouts do modelo. Mudar a fonte do tema ou o estilo do título ali muda, de uma vez, todos os slides que herdam essas definições. É assim que se aplica uma identidade visual a uma apresentação de 80 slides em segundos.",
          "",
          "O modelo padrão traz **onze layouts**, e conhecê-los acelera a montagem. `Slide de Título` abre a apresentação, com um título grande e um subtítulo. `Título e Conteúdo` é o mais usado, com um título e uma área de conteúdo que aceita texto em tópicos, tabela, gráfico ou imagem. `Cabeçalho da Seção` marca as divisões. `Duas Partes de Conteúdo` e `Comparação` colocam duas áreas lado a lado. `Somente Título` deixa o resto livre para um gráfico ou uma imagem grande. `Em Branco` não tem nada. Os demais combinam conteúdo, imagem e legenda, ou usam texto vertical. O formato padrão de um slide novo é 16:9, com 33,87 por 19,05 centímetros (13,33 por 7,5 polegadas).",
          "",
          "A escolha do layout é a decisão mais importante de cada slide, porque ela define os espaços reservados em que o conteúdo se encaixa. Trocar o layout depois (*Página Inicial > Layout*) reorganiza o conteúdo nos novos espaços. E o comando *Redefinir* devolve cada espaço reservado à posição e à formatação do layout, útil quando um slide foi arrastado e redimensionado ao acaso e perdeu a coerência com os demais.",
          "",
          "A herança tem as mesmas exceções que nos estilos. Um layout pode definir um valor próprio que não vem do mestre: o título do `Slide de Título` tem 60 pontos, porque o seu layout assim define, e uma mudança no estilo de título do mestre **não o altera**; já os títulos dos layouts comuns, como `Título e Conteúdo`, herdam do mestre e mudam junto. E a **formatação direta** sobre um slide, como mudar o tamanho do título para 20 pontos selecionando o texto, tem prioridade sobre as duas camadas acima e não acompanha mudanças posteriores no mestre: uma mudança a 30 pontos chega a todos os títulos herdados, menos ao que foi formatado à mão.",
          "",
          "O efeito prático é o mesmo do Word: **mude a aparência no mestre ou no layout, não nos slides**. Se todos os títulos de uma apresentação precisam ficar menores, o ajuste vai para o estilo de título no mestre, e nenhum slide precisa ser tocado. Se um layout específico precisa de outra aparência, cria-se um novo layout (*Slide Mestre > Inserir Layout*) em vez de ajustar slide por slide. O custo da formatação direta aparece depois, quando a identidade visual da empresa muda e metade dos slides, formatados à mão, não acompanha.",
          "",
          "O exemplo monta uma apresentação com quatro slides, em layouts diferentes, mostra os layouts disponíveis e o tamanho do slide, e muda o estilo do título no mestre, antes e depois de um dos títulos receber formatação direta.",
        ]),
        code("powerpoint", [
          "Slide [Slide de Título]: Reservas do trimestre | Ágora",
          "Slide [Título e Conteúdo]: Atenas lidera o trimestre | 765 reais em duas reservas",
          "Slide [Título e Conteúdo]: Delfos vem em segundo | 540 reais em duas reservas",
          "Slide [Em Branco]:",
        ], "Quatro slides, em três layouts diferentes"),
        code("text", [
          "slides:layouts = Slide de Título / Título e Conteúdo / Cabeçalho da Seção / Duas Partes de Conteúdo / Comparação / Somente Título / Em Branco / Conteúdo com Legenda / Imagem com Legenda / Título e Texto Vertical / Texto e Título Vertical",
          "slides:tamanho = 33,87 cm x 19,05 cm",
          "slides:tamanhos = 1: 60 / 2: 44 / 3: 44 / 4: -",
        ], "Resultado: os onze layouts, o tamanho do slide e o tamanho do título de cada slide"),
        code("powerpoint", [
          "Mestre: título = tamanho 36",
        ], "O estilo de título do slide mestre passa a 36 pontos"),
        code("text", [
          "slides:tamanhos = 1: 60 / 2: 36 / 3: 36 / 4: -",
        ], "Resultado: os títulos herdados mudaram; o do slide de título, definido pelo layout, não"),
        code("powerpoint", [
          "Formatar slide: 2: título = tamanho 20",
          "Mestre: título = tamanho 30",
        ], "O título do slide 2 recebe formatação direta; depois o mestre muda de novo"),
        code("text", [
          "slides:tamanhos = 1: 60 / 2: 20 / 3: 30 / 4: -",
        ], "Resultado: o slide 2 não acompanhou o mestre"),
        prose([
          "Os quatro slides saíram com os títulos nos tamanhos que seus layouts definem: 60 pontos no slide de título e 44 nos de conteúdo; o slide em branco não tem título e por isso aparece com um traço. Ao mudar o estilo de título do mestre para 36 pontos, os dois slides de conteúdo mudaram juntos; o primeiro continuou com 60, porque o seu layout tem um tamanho próprio.",
          "",
          "Na segunda mudança, o título do slide 2 já tinha sido formatado à mão, para 20 pontos. Quando o mestre foi para 30, o slide 3 o acompanhou, e o slide 2 permaneceu em 20. É o título que \"ficou diferente\" em apresentações montadas às pressas, e que só se descobre quando o modelo muda.",
        ]),
        porque([
          "Slide mestre → layouts → slides: a aparência vem de cima. Altere o mestre ou o layout, não os slides; um layout pode ter valor próprio, e a formatação direta não acompanha mudanças. Escolha o layout certo para cada slide e use *Redefinir* para voltar ao que ele define.",
        ]),
        quebraria([
          "Uma empresa muda a fonte e as cores da identidade visual. A apresentação institucional, de 90 slides, tem títulos formatados à mão em cada um. A atualização do modelo corrige o que veio dos layouts e deixa uns quarenta títulos na fonte antiga, que aparecem num evento para investidores, ao lado de slides já atualizados.",
        ]),
      ],
    },
    {
      title: "Estrutura do slide: espaços reservados, títulos e caixas de texto",
      order: 1,
      blocks: [
        prose([
          "O que separa um slide bem construído de um improvisado é, muitas vezes, invisível na tela. Dois slides podem parecer idênticos, e um ter a estrutura que o PowerPoint entende e o outro, só caixas soltas sobre um fundo. A estrutura aparece na hora de navegar, exportar, ler em voz alta e reorganizar, e o ponto central é a diferença entre **espaço reservado** e **caixa de texto**.",
          "",
          "O espaço reservado (*placeholder*) é uma área que o **layout** define: o título, o corpo, um rodapé, o número do slide. Ele tem um papel conhecido pelo programa: o PowerPoint sabe qual é o título do slide, qual é o conteúdo, e o que cada parte significa. Já a caixa de texto (*Inserir > Caixa de Texto*) é um objeto livre, sem papel. Um texto digitado em uma caixa pode ter o mesmo aspecto de um título, mas, para o programa, é só um retângulo com letras.",
          "",
          "A diferença tem consequências concretas. O **título do slide** é o que aparece na lista de slides do painel de navegação, na **Estrutura de Tópicos** (*Exibir > Estrutura de Tópicos*), nos índices gerados pelo *Zoom de Seção* e é o que um leitor de tela anuncia ao entrar no slide. Um slide sem título, ou com o título numa caixa de texto, fica anônimo em todos esses lugares: a Estrutura de Tópicos mostra um item vazio, e o leitor de tela diz apenas \"slide 4\". O **conteúdo** em espaços reservados também aparece na Estrutura de Tópicos, o que permite reler e reorganizar a apresentação como um texto; o que está em caixas livres não aparece ali.",
          "",
          "O layout `Em Branco`, que não tem nenhum espaço reservado, é o culpado habitual dos slides anônimos. Ele tem usos legítimos (uma imagem em tela cheia, por exemplo), mas para um slide com mensagem ele troca a estrutura pela liberdade. A alternativa é `Somente Título`, que dá ao slide um título de verdade e deixa o resto livre. Se o título não deve aparecer na tela, em um slide de imagem, pode-se mantê-lo e escondê-lo fora da área visível: o leitor de tela e a Estrutura de Tópicos o veem, e a plateia, não.",
          "",
          "Outras regras de estrutura. Cada slide deve ter um título **único**: dois slides chamados \"Resultados\" são indistinguíveis na navegação. O título deve **dizer a conclusão** (\"Atenas lidera o trimestre\") mais do que o tema (\"Resultados\"), o que ajuda tanto quem ouve quanto quem lê a Estrutura de Tópicos como um resumo da apresentação. O corpo deve ter poucas palavras: um slide é um apoio à fala, e um parágrafo longo em um espaço reservado ou numa caixa não será lido pela plateia enquanto o apresentador fala. Listas devem ser listas de tópicos de verdade (marcadores do próprio PowerPoint), e não linhas separadas por hífens digitados.",
          "",
          "O exemplo monta três slides: um com título e conteúdo em espaços reservados, um em branco com uma caixa de texto, e um com título apenas. Os resultados mostram o título que o PowerPoint reconhece em cada um e como os objetos do slide em branco são classificados.",
        ]),
        code("powerpoint", [
          "Slide [Título e Conteúdo]: Resumo por sala | Atenas 765, Delfos 540, Tebas 750",
          "Slide [Em Branco]:",
          "Slide [Somente Título]: Próximos passos",
          "Caixa de texto: slide 2 = Quatro regras para as próximas reservas",
        ], "Um slide estruturado, um em branco com uma caixa de texto e um só com título"),
        code("text", [
          "slides:titulos = 1: Resumo por sala / 2: (sem título) / 3: Próximos passos",
          "slides:ordem:1 = 1=espaço reservado / 2=espaço reservado",
          "slides:ordem:2 = 1=caixa",
        ], "Resultado: o título que o PowerPoint reconhece e os objetos de cada slide"),
        prose([
          "O primeiro slide tem os dois espaços reservados, o título e o conteúdo; o terceiro, só o título. O segundo, em branco, tem uma caixa de texto que **parece** o título de um slide (\"Quatro regras para as próximas reservas\"), mas o PowerPoint não o reconhece como tal: na lista de títulos ele aparece como \"(sem título)\". Em uma apresentação de dez slides construída assim, a Estrutura de Tópicos e o leitor de tela mostrariam metade dos slides sem nome.",
          "",
          "A correção é trocar o layout do slide 2 para `Somente Título` e passar o texto da caixa para o espaço reservado do título, o que dá ao slide o mesmo aspecto e a estrutura que lhe faltava.",
        ]),
        porque([
          "Use espaços reservados para títulos e conteúdo: só eles aparecem na Estrutura de Tópicos e no que o leitor de tela anuncia. Evite o layout `Em Branco` para slides com mensagem; dê a cada slide um título único que diga a conclusão.",
        ]),
        quebraria([
          "Uma apresentação de 30 slides é montada sempre em `Em Branco`, com caixas de texto. Para publicá-la, o departamento de comunicação exporta a lista de títulos para o sumário do evento e obtém trinta linhas vazias; a acessibilidade da apresentação é reprovada na auditoria, e o prazo de publicação perdido.",
        ]),
      ],
    },
    {
      title: "Acessibilidade: ordem de leitura, texto alternativo e legibilidade",
      order: 2,
      blocks: [
        prose([
          "A apresentação é o documento em que a acessibilidade mais se perde, porque um slide é pensado para o olho: posição, tamanho, cor, imagem. Quem usa um leitor de tela, porém, recebe uma **sequência de objetos lidos um após o outro**, e a qualidade dessa sequência depende de decisões que não aparecem no slide. Quatro delas dominam: a ordem de leitura, o texto alternativo, o contraste e a dependência de animações.",
          "",
          "A **ordem de leitura** de um slide é a ordem dos objetos no **Painel de Seleção** (*Página Inicial > Organizar > Painel de Seleção*), lida **de baixo para cima**: o último da lista é o primeiro a ser lido. Em um slide construído com espaços reservados e objetos acrescentados na ordem natural, a leitura costuma sair coerente; mas basta mover uma caixa de texto para a frente ou colar um elemento por último para a ordem mudar: o rodapé é lido antes do título, ou o gráfico antes da frase que o apresenta. A conferência é simples e vale a pena: abrir o painel e ler a lista como se fosse o roteiro do slide. O ajuste se faz arrastando os itens ou com os botões de ordem.",
          "",
          "O **texto alternativo** vale para imagens, gráficos, formas com significado e ícones. Como no Word, ele deve dizer o que o elemento **comunica**, em uma ou duas frases: \"Gráfico de colunas com o valor por sala; Tebas lidera\". Para elementos puramente decorativos (uma linha, um fundo), a opção *Marcar como decorativo* os retira da leitura. A falta de texto alternativo é o erro mais frequente em apresentações, e um slide com um gráfico importante e sem descrição entrega à pessoa que usa leitor de tela um silêncio no lugar da informação central. Vale também **não colocar informação só na imagem**: um gráfico com os valores principais citados também no texto do slide, ou nas notas, serve a todos.",
          "",
          "A **legibilidade** reúne o contraste, o tamanho e a quantidade de texto. O texto precisa de contraste suficiente com o fundo (a razão de 4,5 para 1 é o mínimo para o texto comum, e 3 para 1 para o texto grande); um cinza claro sobre branco, comum em modelos elegantes, falha. A **cor** não pode ser o único modo de comunicar: uma legenda do tipo \"as barras vermelhas são as canceladas\" exclui quem não distingue o vermelho do verde. O **tamanho** é a medida que o auditório impõe: o texto de uma apresentação para uma sala deve ser legível do fundo, e as diretrizes costumam indicar um mínimo em torno de 24 pontos para o corpo. E os slides lotados de texto, que se resolveriam em dois slides, não são acessíveis para ninguém.",
          "",
          "As **animações e transições** pedem moderação por razões de acessibilidade: movimento excessivo incomoda pessoas sensíveis a ele, e elementos que só aparecem depois de uma animação podem não estar disponíveis para quem navega com leitor de tela. Em geral, o que for essencial deve estar no slide estático. O PowerPoint, como o Word, tem o **Verificador de Acessibilidade** (*Revisão > Verificar Acessibilidade*), que aponta imagens sem texto alternativo, slides sem título, ordem de leitura duvidosa e contraste baixo; é o ponto de partida da revisão, não o fim dela.",
          "",
          "O exemplo cria um slide com duas imagens (só a primeira tem texto alternativo), uma fonte em caixa de texto e notas do apresentador, e lê a descrição das imagens e a ordem dos objetos.",
        ]),
        code("powerpoint", [
          "Slide [Título e Conteúdo]: Valor por sala | Tebas lidera",
          "Imagem: slide 1, texto alternativo = Gráfico de colunas com o valor por sala",
          "Imagem: slide 1",
          "Caixa de texto: slide 1 = Fonte: sistema de reservas",
        ], "Um slide com título, conteúdo, duas imagens e uma fonte"),
        code("text", [
          "slides:alternativos = 1: Gráfico de colunas com o valor por sala / 1: (sem texto alternativo)",
          "slides:ordem:1 = 1=espaço reservado / 2=espaço reservado / 3=imagem / 4=imagem / 5=caixa",
        ], "Resultado: o texto alternativo de cada imagem e a ordem dos objetos (de trás para a frente)"),
        prose([
          "A primeira imagem tem uma descrição que diz o que o gráfico mostra; a segunda é uma falha que o Verificador de Acessibilidade apontaria. A ordem dos objetos, de trás para a frente, é: o título, o conteúdo, as duas imagens e a caixa com a fonte. Como a leitura vai de baixo para cima na lista do Painel de Seleção, ela começa pelo título e percorre os objetos na ordem em que foram criados; a fonte, acrescentada por último, é a última a ser lida.",
          "",
          "Se a caixa de texto com a fonte tivesse sido criada primeiro, ela seria lida antes do título, e o ouvinte receberia \"Fonte: sistema de reservas\" sem saber de quê. Nada disso aparece na tela, e é por isso que a ordem de leitura se confere no painel e não olhando para o slide.",
        ]),
        porque([
          "Confira a ordem de leitura no Painel de Seleção (lida de baixo para cima), dê texto alternativo às imagens e aos gráficos (ou marque como decorativos), garanta contraste, não use cor como único sinal e limite animações. Rode o Verificador de Acessibilidade e leia o roteiro do slide como um ouvinte.",
        ]),
        quebraria([
          "Um gráfico central é colado no slide sem texto alternativo, e os valores só estão desenhados nas colunas. Um conselheiro com baixa visão, que acompanha a reunião por um leitor de tela, ouve \"imagem\" no lugar do resultado do trimestre, e pede para ouvir as conclusões da boca do apresentador, quando a reunião já passou da pauta.",
        ]),
      ],
    },
    {
      title: "O que viaja com a apresentação: notas, slides ocultos e metadados",
      order: 3,
      blocks: [
        prose([
          "Uma apresentação compartilhada raramente é só o que se vê na tela. O arquivo `.pptx` guarda também as **notas do apresentador**, os **slides ocultos**, as imagens originais, os dados dos gráficos incorporados e os metadados do autor. Esse material é útil para quem apresenta e comprometedor para quem recebe o arquivo errado: a lista do que está dentro do arquivo é a lista do que pode vazar.",
          "",
          "As **notas** (*Exibir > Notas*, o painel abaixo do slide) servem de roteiro: o que dizer, números de apoio, perguntas prováveis. Elas ficam gravadas no arquivo, em uma parte própria de cada slide, e são impressas nas \"páginas de notas\" e exportadas com a apresentação se ninguém as retirar. Numa apresentação para a diretoria, as notas dizem \"não mencionar a negociação em Tebas\"; enviada por e-mail como `.pptx`, a observação vai junto, e qualquer destinatário a lê abrindo o painel. O arquivo mostra isso: a apresentação sem notas não tem a parte de notas, e a que tem notas traz uma parte `notesSlide` para cada slide anotado e um `notesMaster` com o modelo das páginas.",
          "",
          "Um **slide oculto** (*Apresentação de Slides > Ocultar Slide*) não aparece na apresentação, mas existe no arquivo, na lista de slides e na impressão, se não se desligar. É o recurso para o material de apoio, os números extras para perguntas, as versões descartadas. Como as notas, ele é visível para quem abre o arquivo. No XML, o slide oculto leva o atributo `show=\"0\"`, o que explica por que alguns programas de conversão o incluem ou ignoram sem aviso. Se o conteúdo oculto é sensível, o caminho é **apagá-lo** do arquivo que sai da organização, e não escondê-lo.",
          "",
          "As **imagens** ficam no arquivo em seu tamanho original, mesmo que apareçam reduzidas e recortadas. Uma foto de 12 megabytes recortada para mostrar só um rosto continua com a foto inteira dentro do pacote, em `ppt/media`; o comando *Compactar Imagens* descarta as áreas recortadas e reduz a resolução, tornando o arquivo menor e removendo o que não aparecia. O mesmo vale para **gráficos incorporados**, que carregam uma cópia dos dados da planilha, inclusive colunas e linhas que não aparecem no gráfico. A colagem de um gráfico do Excel como imagem evita isso, ao custo de perder a edição.",
          "",
          "Os **metadados**, como no capítulo 1, incluem o autor, quem salvou por último e as datas, e o Inspecionar Documento (*Arquivo > Informações > Verificar Problemas*) lista o que será removido: comentários, propriedades do documento, conteúdo invisível, **notas do apresentador** e slides ocultos. É o passo que falta em muitos envios, e vale como rotina: salvar uma cópia, inspecionar, remover e só então enviar. Para a entrega final a quem só precisa ver, a melhor forma costuma ser **exportar em PDF** (*Arquivo > Exportar*), com a opção de não incluir as notas, e com as marcas de estrutura para acessibilidade que preservam títulos e textos alternativos.",
          "",
          "Um último cuidado diz respeito aos **links e arquivos externos**. Vídeos e planilhas vinculados (e não incorporados) permanecem no computador de origem, e a apresentação aberta em outra máquina mostra um aviso ou um quadro vazio. A rotina de quem apresenta fora do próprio computador é testar a apresentação no equipamento do local e levar os arquivos de apoio junto.",
          "",
          "O exemplo cria uma apresentação de três slides com notas e um slide oculto, salva o arquivo e examina o que o pacote guarda, comparando com uma versão sem notas.",
        ]),
        code("powerpoint", [
          "Slide [Slide de Título]: Plano de reservas | Segundo semestre",
          "Slide [Título e Conteúdo]: Metas por sala | Atenas 800, Delfos 600, Tebas 750",
          "Slide [Título e Conteúdo]: Reserva técnica | Não divulgar fora da diretoria",
          "Notas: slide 2 = Se perguntarem, a meta de Tebas já foi aprovada.",
          "Ocultar: slide 3",
          "Salvar como: plano.pptx",
        ], "Três slides, uma nota no segundo e o terceiro oculto"),
        code("text", [
          "partes:plano.pptx contém: ppt/notesSlides/notesSlide1.xml",
          "partes:plano.pptx contém: ppt/notesMasters/notesMaster1.xml",
          "parte:plano.pptx!ppt/slides/slide3.xml contém: show=\"0\"",
          "parte:plano.pptx!ppt/slides/slide2.xml não contém: show=\"0\"",
          "parte:plano.pptx!docProps/core.xml contém: <dc:creator>",
          "slides:notas contém: Se perguntarem, a meta de Tebas já foi aprovada.",
        ], "Resultado: as notas, o slide oculto e o autor estão dentro do arquivo"),
        code("powerpoint", [
          "Novo: apresentação",
          "Slide [Slide de Título]: Plano de reservas | Versão para clientes",
          "Slide [Título e Conteúdo]: Metas por sala | Atenas 800, Delfos 600, Tebas 750",
          "Salvar como: clientes.pptx",
        ], "Outra apresentação: a versão sem notas e sem slides ocultos"),
        code("text", [
          "partes:clientes.pptx não contém: ppt/notesSlides",
          "parte:clientes.pptx!ppt/slides/slide2.xml não contém: show=\"0\"",
        ], "Resultado: a versão para clientes não tem parte de notas"),
        prose([
          "O arquivo do plano tem uma parte de notas para o segundo slide, e o texto da nota é recuperável por qualquer programa que leia o pacote: a frase sobre a meta de Tebas está lá. O terceiro slide, oculto, leva o atributo `show=\"0\"` e continua no arquivo com o seu conteúdo, incluindo o aviso \"Não divulgar fora da diretoria\", que a plateia nunca veria na apresentação. O nome do autor está nas propriedades do documento.",
          "",
          "A versão para clientes foi construída do zero, sem notas e sem slides ocultos, e o pacote não tem nenhuma parte de notas. É a diferença entre **esconder** e **não ter**: a cópia limpa se faz removendo, ou criando uma versão separada, e não pedindo ao PowerPoint que esconda o que não deve sair.",
        ]),
        porque([
          "O `.pptx` leva as notas, os slides ocultos, as imagens originais, os dados dos gráficos incorporados e os metadados. Antes de enviar a terceiros, prepare uma cópia sem esse material, use o Inspecionar Documento ou exporte em PDF sem notas, com marcas de acessibilidade.",
        ]),
        quebraria([
          "A diretoria envia aos investidores a apresentação do semestre em `.pptx`. O slide oculto com o cenário pessimista e a nota \"se perguntarem, não confirmar a renegociação\" seguem no arquivo; um analista os abre em minutos e a informação chega à imprensa na manhã seguinte.",
        ]),
      ],
    },
  ],
};

export const OFFICE_BOOK_11_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "intermediate",
    promptMd: "Em uma apresentação, todos os slides de conteúdo herdam o estilo de título do slide mestre. A equipe altera o tamanho do título no mestre para 36 pontos, mas o título do slide de abertura, que usa o layout Slide de Título, continua em 60 pontos. Qual é a explicação?",
    choices: [
      "O layout Slide de Título define um tamanho próprio de título, que prevalece sobre o do mestre",
      "O PowerPoint não aplica mudanças do mestre ao primeiro slide",
      "Esse slide recebeu um erro de atualização do tema",
      "O slide de abertura é sempre protegido contra alterações",
    ],
    answerKeyMd: "O layout Slide de Título define um tamanho próprio de título, que prevalece sobre o do mestre",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "advanced",
    promptMd: "Uma apresentação de 25 slides tem os títulos digitados em caixas de texto, sobre slides em branco. A equipe quer publicá-la de forma acessível e gerar um sumário com os títulos. Explique por que os títulos não aparecem na Estrutura de Tópicos nem são lidos como títulos, como corrigir sem refazer a apresentação e que outras duas verificações de acessibilidade são necessárias.",
    answerKeyMd: "Caixas de texto são objetos livres sem papel de título: o PowerPoint só reconhece como título o espaço reservado de título definido pelo layout. Por isso a Estrutura de Tópicos mostra itens vazios, e o leitor de tela anuncia apenas o número do slide. Correção: trocar o layout de cada slide de Em Branco para Somente Título (ou Título e Conteúdo), mover o texto da caixa para o espaço reservado do título e apagar a caixa; títulos únicos e que digam a conclusão. Outras verificações: texto alternativo em imagens e gráficos (ou marcá-los como decorativos) e ordem de leitura no Painel de Seleção (lida de baixo para cima); também contraste mínimo de 4,5:1, cor não ser o único sinal, e rodar o Verificador de Acessibilidade.",
    rubricMd: "Explica espaço reservado × caixa; propõe trocar o layout e mover o texto; cita texto alternativo e ordem de leitura.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "Você precisa enviar a apresentação do planejamento a um cliente. Ela tem notas do apresentador com observações internas, dois slides ocultos com cenários alternativos, um gráfico do Excel incorporado e o seu nome como autor. Descreva, em passos, como preparar a versão para o cliente, e indique o formato de entrega que você escolheria e por quê.",
    answerKeyMd: "Trabalhar sobre uma cópia (Salvar Como) e manter o original. Apagar as notas (ou limpar o painel de notas) e excluir os slides ocultos, em vez de apenas escondê-los. Substituir o gráfico incorporado por uma imagem (colar especial) ou garantir que a planilha incorporada não contém dados além do que o gráfico mostra. Rodar Arquivo > Informações > Verificar Problemas > Inspecionar Documento e remover comentários, propriedades do documento e informações pessoais (autor), conferindo antes o que será removido. Compactar as imagens para descartar as áreas recortadas. Formato de entrega: PDF (Arquivo > Exportar), com a opção de não incluir as notas e com as marcas de estrutura para acessibilidade, porque o PDF não carrega slides ocultos, notas nem dados incorporados e preserva títulos e textos alternativos; o .pptx só se o cliente precisar editar, e então depois de todos os passos anteriores.",
    points: 20,
  },
];

export const OFFICE_BOOK_11_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Qual a hierarquia do PowerPoint?", backMd: "Slide mestre → layouts → slides. A aparência vem de cima; mude o mestre ou o layout, não os slides. Um layout pode ter valor próprio." },
  { nodeTitle: NODE, frontMd: "Espaço reservado × caixa de texto", backMd: "Só o espaço reservado de título é o título do slide (Estrutura de Tópicos, navegação, leitor de tela). Evite Em Branco para slides com mensagem." },
  { nodeTitle: NODE, frontMd: "Em que ordem o leitor de tela lê os objetos de um slide?", backMd: "A do Painel de Seleção, de baixo para cima (do fundo para a frente). Confira antes de publicar." },
  { nodeTitle: NODE, frontMd: "O que vai dentro do .pptx além do que se vê?", backMd: "Notas do apresentador, slides ocultos (show=0), imagens originais, dados dos gráficos incorporados e metadados do autor." },
  { nodeTitle: NODE, frontMd: "Como entregar uma apresentação a terceiros?", backMd: "Cópia limpa (apagar notas e ocultos), Inspecionar Documento e, em geral, PDF sem notas e com marcas de acessibilidade." },
];
