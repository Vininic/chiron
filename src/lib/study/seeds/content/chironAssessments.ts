import type { ContentSource } from "./types";
export const CHIRON_REVIEW: Record<string,[string,string,string]> = {
  "Índice global, documentos e fronteira da sessão": [
    "Por que freshIndex separa versão do documento e schemaVersion?",
    "version acompanha alterações do documento; schemaVersion identifica a forma persistida. O índice inicial usa versão um e schema três, sem criar atividade, fontes ou conceitos.",
    "Usar version como número de schema pode impedir migrações de um documento que já recebeu muitas edições."
  ],
  "Biblioteca de uma fonte e identidade do conteúdo": [
    "Qual relação freshLib mantém com uma fonte?",
    "sourceId vincula a biblioteca a uma fonte. A estrutura inicial possui capítulos, seções e exercícios vazios com schema dois; cards e atividade pertencem ao índice.",
    "Guardar cards na biblioteca criaria uma segunda origem de verdade incompatível com os consumidores do índice."
  ],
  "Migração do índice sem descartar estudo existente": [
    "migrateIndex valida integralmente um índice antigo?",
    "Não. A migração reconhece sources como array, preenche coleções históricas e atualiza o schema, preservando outros campos por spread. Isso não valida cada entidade.",
    "Um cast após a migração pode esconder nós ou scores inválidos que a rotina nunca verificou."
  ],
  "Conteúdo legado, capítulos sintetizados e limites da migração": [
    "Como migrateLib conserva uma seção legada?",
    "A transformação anterior ao schema dois mantém a identidade da seção, converte Markdown em blocos e sintetiza um capítulo quando existem seções.",
    "Descartar ids durante a conversão rompe vínculos existentes com conteúdo e progresso."
  ],
  "Criar fonte, identidade e publicação editorial": [
    "Criar uma fonte publica automaticamente uma apostila completa?",
    "addSource acrescenta metadados e identidade ao índice. Capítulos e blocos precisam ser materializados e auditados separadamente antes da publicação editorial.",
    "Confundir uma entrada de fonte com conteúdo pronto pode expor uma biblioteca vazia como material completo."
  ],
  "Remover fonte e reconhecer o alcance da cascata": [
    "Qual é o alcance real de removeSource?",
    "O helper filtra fontes, nós e cards. Tentativas, sessões, reviewLog, labProgress e bibliotecas externas ao argumento não são apagados por essa chamada.",
    "Prometer uma cascata completa deixaria histórico e bibliotecas órfãs sem uma política de recuperação."
  ],
  "Criar conceito no mapa sem fabricar domínio": [
    "addNode cria domínio por inferência?",
    "Não. O nó começa com mastery zero e conserva as dependências recebidas. Criar um conceito não demonstra aprendizagem nem valida a ausência de ciclos.",
    "Marcar domínio ao criar um nó faria o mapa confundir cadastro com evidência de estudo."
  ],
  "Atualização seletiva, ausência e limites de patch": [
    "O que ocorre ao atualizar um nó inexistente?",
    "updateNode mapeia a coleção e não cria um alvo ausente, mas ainda devolve índice com versão incrementada. O patch é amplo e não constitui allowlist runtime.",
    "Tratar qualquer incremento de versão como prova de alteração do nó esconderia uma referência inválida."
  ],
  "Markdown legado e blocos semânticos": [
    "mdToBlocks é um parser completo de Markdown?",
    "Não. Ele separa cercas de código reconhecidas e prosa, podendo acrescentar uma citação. Não converte automaticamente toda semântica de CommonMark em blocos nativos.",
    "Depender da ponte para gerar porque ou labref pode publicar seções sem os blocos exigidos."
  ],
  "Densidade de explicação e contagem auditável": [
    "O que proseWordCount exclui da densidade?",
    "Somente blocos prose entram na contagem por espaços. Código e outros blocos não aumentam o piso; a contagem não julga a qualidade das palavras.",
    "Acrescentar código para compensar explicação curta não satisfaz o contrato de densidade."
  ],
  "Cardinalidade de blocos e contrato de exemplos": [
    "Contar blocos code demonstra que os exemplos são diferentes?",
    "countBlocksOfKind mede cardinalidade por kind. Duplicação, correção e execução exigem outras verificações editoriais e evidência de executor.",
    "Dois blocos idênticos podem satisfazer a contagem e ainda falhar na auditoria de duplicação."
  ],
  "Presença semântica, referências e publicação integral": [
    "A presença de cite comprova que o símbolo existe?",
    "hasBlockOfKind consulta a presença do kind solicitado. A referência precisa ser conferida contra arquivo e símbolo reais, pois presença estrutural não prova verdade.",
    "Uma citação inventada passaria no teste de presença e enganaria a leitura do repositório."
  ],
  "Grau de lembrança e contrato do motor SM-2": [
    "Qual limiar separa lapso de resposta aceita no motor?",
    "gradeMinQuality fornece a qualidade; valores abaixo de três seguem o ramo de lapso. O grau três já representa resposta aceita.",
    "Classificar três como lapso mudaria intervalos e retenção em desacordo com o contrato vigente."
  ],
  "Intervalo, facilidade e transição de revisão": [
    "Qual facilidade computeSM2 usa no intervalo maduro?",
    "O intervalo anterior é multiplicado pela facilidade anterior e arredondado. A facilidade atualizada faz parte do novo estado e não substitui retroativamente esse fator.",
    "Usar a facilidade atualizada para a mesma multiplicação altera a agenda e faz a previsão divergir do motor documentado."
  ],
  "Vencimento inclusivo e representação da data": [
    "Um card que vence hoje já está pendente?",
    "isCardDue usa comparação inclusiva entre strings de dia canônicas. dueDate igual a hoje retorna verdadeiro; a função não interpreta formatos arbitrários.",
    "Trocar menor ou igual por menor adia indevidamente a revisão marcada para hoje."
  ],
  "Contagem de revisão e conjunto de cards": [
    "cardsDue deduplica referências de card?",
    "Não. A função conta cada entrada cujo vencimento é menor ou igual ao dia. A integridade e a unicidade da coleção pertencem ao documento.",
    "Duplicatas no índice podem inflar a fila mesmo que a condição de vencimento esteja correta."
  ],
  "Botões de revisão e significado da lembrança": [
    "Por que Difícil não significa lapso na UI?",
    "gradeForButton mapeia hard para três, resposta aceita com dificuldade. Again mapeia para zero e representa lapso, preservando a fronteira do motor.",
    "Mapear hard para zero reinicia repetições quando a pessoa de fato lembrou a resposta."
  ],
  "Prever um intervalo usando o mesmo motor": [
    "Prever intervalo registra uma revisão?",
    "predictIntervalDays delega ao mesmo computeSM2 e projeta intervalDays. A função pura não altera o card nem acrescenta reviewLog.",
    "Gravar durante a renderização dos quatro botões produziria revisões sem uma escolha confirmada."
  ],
  "Apresentação compacta de dias, meses e anos": [
    "O rótulo 2m pode ser usado para persistir a agenda?",
    "formatInterval comprime sessenta dias em dois meses aproximados. O texto perde precisão; a gravação deve usar o estado numérico e a data calculada.",
    "Reconstruir dueDate a partir de uma unidade arredondada pode deslocar o vencimento real."
  ],
  "Retenção observada e alcance da medida": [
    "O que 0.75 mede em computeRetention?",
    "Três de quatro graus fornecidos atingiram pelo menos três. A fração descreve essa amostra, sem deduplicar cards nem provar aprendizagem duradoura.",
    "Apresentar zero com lista vazia como esquecimento total confunde ausência de observações com falha de lembrança."
  ],
  "Seleção de exercícios, filtros e acaso": [
    "Em que ordem a prática filtra, sorteia e limita?",
    "selectExercises aplica filtros, embaralha uma cópia e corta a quantidade. Um único candidato elegível permite um oracle determinístico apesar do sorteio.",
    "Cortar antes de filtrar pode excluir candidatos válidos que estavam depois do limite inicial."
  ],
  "Correção exata e resposta estruturada": [
    "Por que igualdade estrita serve a alternativas controladas?",
    "scoreMultipleChoice compara a resposta ao gabarito e concede o máximo ou zero. Isso pressupõe uma representação estruturada, sem interpretação de texto livre.",
    "Usar a mesma comparação para uma explicação correta com outras palavras produziria um falso erro automático."
  ],
  "Autoavaliação explícita e arredondamento": [
    "Quanto vale parcial em uma questão de três pontos?",
    "scoreSelfGrade multiplica por meio e arredonda: dois pontos. A escolha vem do estudante apoiado pelo gabarito, sem correção automática de prosa.",
    "Exibir um e meio enquanto se grava dois gera divergência entre resumo e histórico."
  ],
  "Fração de rubrica e validação da resposta do tutor": [
    "Clamp de fração valida uma resposta de tutor desconhecida?",
    "scoreRubricFraction limita entradas numéricas finitas e arredonda pontos. NaN não é corrigido pelo clamp; o parser e o fluxo devem tratar formato e falha.",
    "Converter uma resposta malformada sem distinguir o fallback pode apresentar falha do avaliador como erro do estudante."
  ],
  "Pontos do exercício e multiplicador de nível": [
    "Qual recompensa o helper de nível dá a três pontos avançados?",
    "computePointsForExercise aplica fator três a advanced e devolve nove. Isso é política de recompensa, separada da avaliação e da soma no índice.",
    "Aplicar o multiplicador antes da gravação e novamente no resumo duplica o fator sem nova evidência."
  ],
  "Domínio agregado e denominador dos conceitos": [
    "Qual o domínio normalizado de níveis quatro e zero?",
    "computeMasteryWeight soma quatro e divide por dois nós vezes quatro, resultando em meio. Todos os nós recebidos possuem o mesmo peso.",
    "Dividir apenas pela quantidade devolve dois, fora da escala normalizada esperada."
  ],
  "Sequência diária, data explícita e repetição de chamadas": [
    "Duas atividades no mesmo dia aumentam streak duas vezes?",
    "updateStreak devolve o score sem incrementar quando lastStudyDate já é hoje. Continuidade com ontem incrementa; ausência de continuidade reinicia em um.",
    "Incrementar em toda chamada transforma quantidade de ações em uma falsa sequência de dias."
  ],
  "Acumular pontos sem perder a sequência diária": [
    "addPoints é idempotente para uma tentativa repetida?",
    "Não. Ele atualiza a sequência diária e sempre soma os pontos recebidos. Evitar dupla contagem de dia não impede dupla concessão de crédito.",
    "Uma repetição de evento pode inflar total mesmo com streak correto."
  ],
  "Conceitos a retomar e vínculo com a fonte": [
    "O que torna um nó candidato à retomada no dashboard?",
    "computeWeakestNodes considera mastery menor que quatro, ordena crescente e limita. A regra não estima esquecimento por tempo nem consulta erros de tentativa.",
    "Apresentar a lista como previsão de esquecimento atribui ao cálculo dados que ele não usa."
  ],
  "Distribuição de domínio e integridade da escala": [
    "Por que comparar o array inteiro da distribuição?",
    "computeMasteryDistribution associa posições zero a quatro aos níveis. A soma pode estar correta mesmo quando bins estão trocados e a legenda comunica outro estado.",
    "Validar somente o total não detecta um gráfico que inverte ausência de estudo e domínio completo."
  ],
  "Orçamento de sessão e heurística de divisão": [
    "Como vinte minutos e fila grande viram oito, sete e cinco?",
    "planSessionBlocks limita revisão a quarenta por cento, reserva trinta e cinco para leitura e usa o restante em exercícios. São estimativas de plano.",
    "Tratar estMin como tempo cronometrado inventa observação que o planejador não coleta."
  ],
  "Vencimentos futuros e recorte do calendário": [
    "A série futura inclui atrasos na primeira barra?",
    "computeUpcomingDue conta igualdade exata de dueDate para cada dia. Cards anteriores a hoje não são somados automaticamente à primeira posição.",
    "Usar menor ou igual em cada barra transforma chegadas diárias em contagens cumulativas."
  ],
  "Identidade de uma célula e estruturas de busca": [
    "Por que a busca usa uma chave textual da célula?",
    "cellKey representa x e y com separador, permitindo igualdade por coordenadas em Set e Map. Objetos distintos não compartilham identidade por referência.",
    "Usar objetos recém-criados como chaves pode visitar a mesma coordenada várias vezes."
  ],
  "Vizinhança ortogonal e fronteiras do tabuleiro": [
    "neighbors considera paredes?",
    "Não. A função gera adjacência ortogonal dentro dos limites. bfs consulta paredes e descobertas depois, mantendo geometria e estado de busca separados.",
    "Adicionar diagonais só na vizinhança faz o verificador Manhattan rejeitar caminhos produzidos pela busca."
  ],
  "Busca em largura, pais e caminho mínimo": [
    "Por que marcar o pai ao enfileirar em bfs?",
    "O mapa de pais também marca descoberta, impedindo enfileiramento repetido. A fila preserva camadas de distância em um grafo sem pesos.",
    "Trocar a fila por pilha pode conservar validade e perder a garantia de caminho mínimo."
  ],
  "Verificar um caminho e reconhecer o que falta": [
    "pathIsValid comprova que a meta foi alcançada?",
    "Não. Ele verifica limites, paredes, ausência de repetição e adjacência. Não recebe endpoints e aceita lista vazia pela semântica de every.",
    "Confundir validade local com solução completa permite aceitar um caminho que não chega à meta."
  ],
  "Contrato de autoria de uma camada de Lab": [
    "O que validateLab comprova sobre uma mutação?",
    "A mutação precisa apontar para alguma invariante existente na camada. A regra verifica relações de dados, sem executar a causalidade anunciada pelo cenário.",
    "Declarar breaks correto não prova isolamento ou idempotência de um backend real."
  ],
  "Seleção de mutações e ordem de autoria": [
    "Qual ordem activeMutations conserva?",
    "A ordem de layer.mutations, pois selected vira Set e o catálogo é filtrado. Repetir um id selecionado não duplica uma entrada única do catálogo.",
    "Mapear diretamente a seleção pode duplicar mutações e introduzir valores ausentes para ids desconhecidos."
  ],
  "Invariante declarada e evidência de uma quebra": [
    "O booleano de invariante quebrada é uma observação do estado?",
    "invariantIsBroken consulta breaks nas mutações recebidas. O booleano é uma relação declarada; um verificador independente deve ler o resultado do mecanismo.",
    "Usar o mesmo metadado para prever e comprovar a quebra cria uma validação circular."
  ],
  "Progresso de camadas e significado de conclusão": [
    "Por que concluir a mesma camada duas vezes não dá cem por cento?",
    "labCompletion deduplica os ids concluídos e percorre as camadas do catálogo. Uma de duas camadas continua valendo cinquenta por cento.",
    "Contar o comprimento bruto de ids repetidos infla o progresso sem explorar outra camada."
  ],
  "Propostas do tutor e limite do parser de ações": [
    "parseActions valida todos os campos de uma variante conhecida?",
    "Não. Ele interpreta a primeira cerca JSON e filtra pelo type permitido. Campos obrigatórios ainda precisam de validação runtime antes dos consumidores.",
    "Um create_cards sem cards pode passar pelo filtro e falhar ao descrever a proposta."
  ],
  "Descrever uma proposta antes de aplicá-la": [
    "Resolver nome de nó autoriza uma proposta?",
    "describeAction apenas produz um resumo humano com título ou fallback. Validade, detalhes, aceitação e efeito pertencem a outras etapas do fluxo.",
    "Uma frase plausível pode apontar para alvo ausente e não comprova que a alteração foi aceita."
  ],
  "Protocolo textual de propostas do Aetheris": [
    "Uma instrução no prompt garante JSON válido?",
    "actionPrompt orienta o protocolo e enumera variantes. O aplicativo ainda precisa interpretar e validar a resposta gerada, além de revisar a intenção humana.",
    "Depender apenas do prompt permite que dados incompletos cheguem a funções que presumem uma união válida."
  ],
  "Aplicar uma proposta e distinguir efeitos de notas": [
    "applyAction executa ingest_source diretamente?",
    "Não. Esse ramo devolve documentos inalterados e uma nota de fluxo. A ingestão real e sua aprovação possuem um pipeline separado de rascunhos.",
    "Afirmar que uma nota prova acesso ao GitHub ou publicação confunde proposta com execução."
  ],
  "Tentativa, crédito e responsabilidade da gravação": [
    "recordAttempt aplica o multiplicador de nível internamente?",
    "Não. O serviço acrescenta a tentativa e soma scoreAwarded recebido. A avaliação e qualquer política de ponderação precisam estar decididas pelo consumidor.",
    "Repetir a mesma chamada cria outra tentativa e outro crédito, pois não há chave de idempotência de evento."
  ],
  "Refazer uma camada e preservar o histórico pertinente": [
    "Qual identidade recordLabLayer usa para substituir progresso?",
    "O par labId e layerId. O registro recente substitui o anterior do mesmo par; outras camadas e outros Labs precisam permanecer.",
    "Filtrar apenas por Lab apaga progresso de todas as suas camadas ao refazer uma só."
  ],
  "Criar uma sessão a partir de blocos explícitos": [
    "createSession escolhe conteúdo ou resolve planned?",
    "Não. A função registra orçamento e blocos recebidos com identidade e datas. Planejamento e resolução de referências pertencem ao fluxo que a chama.",
    "Blocos com a mesma referência genérica podem ser concluídos juntos se o consumidor não definir identidade adequada."
  ],
  "Como estender o Chiron com contratos e persistência": [
    "Serializar o índice garante persistência e compatibilidade?",
    "serializeIndex somente chama JSON.stringify. O store grava, a migração adapta documentos antigos e os contratos verificam estrutura; nenhuma etapa substitui as demais.",
    "Tratar JSON produzido como garantia de durabilidade oculta falhas de armazenamento e campos novos sem migração."
  ]
};
export const CHIRON_CARDS: ContentSource["cards"] = [
  {
    "nodeTitle": "Documentos e evolução de schema",
    "frontMd": "Por que freshIndex separa versão do documento e schemaVersion?",
    "backMd": "version acompanha alterações do documento; schemaVersion identifica a forma persistida. O índice inicial usa versão um e schema três, sem criar atividade, fontes ou conceitos."
  },
  {
    "nodeTitle": "Documentos e evolução de schema",
    "frontMd": "Qual relação freshLib mantém com uma fonte?",
    "backMd": "sourceId vincula a biblioteca a uma fonte. A estrutura inicial possui capítulos, seções e exercícios vazios com schema dois; cards e atividade pertencem ao índice."
  },
  {
    "nodeTitle": "Documentos e evolução de schema",
    "frontMd": "migrateIndex valida integralmente um índice antigo?",
    "backMd": "Não. A migração reconhece sources como array, preenche coleções históricas e atualiza o schema, preservando outros campos por spread. Isso não valida cada entidade."
  },
  {
    "nodeTitle": "Documentos e evolução de schema",
    "frontMd": "Como migrateLib conserva uma seção legada?",
    "backMd": "A transformação anterior ao schema dois mantém a identidade da seção, converte Markdown em blocos e sintetiza um capítulo quando existem seções."
  },
  {
    "nodeTitle": "Serviço de fontes e mapa",
    "frontMd": "Criar uma fonte publica automaticamente uma apostila completa?",
    "backMd": "addSource acrescenta metadados e identidade ao índice. Capítulos e blocos precisam ser materializados e auditados separadamente antes da publicação editorial."
  },
  {
    "nodeTitle": "Serviço de fontes e mapa",
    "frontMd": "Qual é o alcance real de removeSource?",
    "backMd": "O helper filtra fontes, nós e cards. Tentativas, sessões, reviewLog, labProgress e bibliotecas externas ao argumento não são apagados por essa chamada."
  },
  {
    "nodeTitle": "Serviço de fontes e mapa",
    "frontMd": "addNode cria domínio por inferência?",
    "backMd": "Não. O nó começa com mastery zero e conserva as dependências recebidas. Criar um conceito não demonstra aprendizagem nem valida a ausência de ciclos."
  },
  {
    "nodeTitle": "Serviço de fontes e mapa",
    "frontMd": "O que ocorre ao atualizar um nó inexistente?",
    "backMd": "updateNode mapeia a coleção e não cria um alvo ausente, mas ainda devolve índice com versão incrementada. O patch é amplo e não constitui allowlist runtime."
  },
  {
    "nodeTitle": "Conteúdo e materialização",
    "frontMd": "mdToBlocks é um parser completo de Markdown?",
    "backMd": "Não. Ele separa cercas de código reconhecidas e prosa, podendo acrescentar uma citação. Não converte automaticamente toda semântica de CommonMark em blocos nativos."
  },
  {
    "nodeTitle": "Conteúdo e materialização",
    "frontMd": "O que proseWordCount exclui da densidade?",
    "backMd": "Somente blocos prose entram na contagem por espaços. Código e outros blocos não aumentam o piso; a contagem não julga a qualidade das palavras."
  },
  {
    "nodeTitle": "Conteúdo e materialização",
    "frontMd": "Contar blocos code demonstra que os exemplos são diferentes?",
    "backMd": "countBlocksOfKind mede cardinalidade por kind. Duplicação, correção e execução exigem outras verificações editoriais e evidência de executor."
  },
  {
    "nodeTitle": "Conteúdo e materialização",
    "frontMd": "A presença de cite comprova que o símbolo existe?",
    "backMd": "hasBlockOfKind consulta a presença do kind solicitado. A referência precisa ser conferida contra arquivo e símbolo reais, pois presença estrutural não prova verdade."
  },
  {
    "nodeTitle": "Motor de repetição espaçada",
    "frontMd": "Qual limiar separa lapso de resposta aceita no motor?",
    "backMd": "gradeMinQuality fornece a qualidade; valores abaixo de três seguem o ramo de lapso. O grau três já representa resposta aceita."
  },
  {
    "nodeTitle": "Motor de repetição espaçada",
    "frontMd": "Qual facilidade computeSM2 usa no intervalo maduro?",
    "backMd": "O intervalo anterior é multiplicado pela facilidade anterior e arredondado. A facilidade atualizada faz parte do novo estado e não substitui retroativamente esse fator."
  },
  {
    "nodeTitle": "Motor de repetição espaçada",
    "frontMd": "Um card que vence hoje já está pendente?",
    "backMd": "isCardDue usa comparação inclusiva entre strings de dia canônicas. dueDate igual a hoje retorna verdadeiro; a função não interpreta formatos arbitrários."
  },
  {
    "nodeTitle": "Motor de repetição espaçada",
    "frontMd": "cardsDue deduplica referências de card?",
    "backMd": "Não. A função conta cada entrada cujo vencimento é menor ou igual ao dia. A integridade e a unicidade da coleção pertencem ao documento."
  },
  {
    "nodeTitle": "Interface de revisão",
    "frontMd": "Por que Difícil não significa lapso na UI?",
    "backMd": "gradeForButton mapeia hard para três, resposta aceita com dificuldade. Again mapeia para zero e representa lapso, preservando a fronteira do motor."
  },
  {
    "nodeTitle": "Interface de revisão",
    "frontMd": "Prever intervalo registra uma revisão?",
    "backMd": "predictIntervalDays delega ao mesmo computeSM2 e projeta intervalDays. A função pura não altera o card nem acrescenta reviewLog."
  },
  {
    "nodeTitle": "Interface de revisão",
    "frontMd": "O rótulo 2m pode ser usado para persistir a agenda?",
    "backMd": "formatInterval comprime sessenta dias em dois meses aproximados. O texto perde precisão; a gravação deve usar o estado numérico e a data calculada."
  },
  {
    "nodeTitle": "Interface de revisão",
    "frontMd": "O que 0.75 mede em computeRetention?",
    "backMd": "Três de quatro graus fornecidos atingiram pelo menos três. A fração descreve essa amostra, sem deduplicar cards nem provar aprendizagem duradoura."
  },
  {
    "nodeTitle": "Prática e limites da avaliação",
    "frontMd": "Em que ordem a prática filtra, sorteia e limita?",
    "backMd": "selectExercises aplica filtros, embaralha uma cópia e corta a quantidade. Um único candidato elegível permite um oracle determinístico apesar do sorteio."
  },
  {
    "nodeTitle": "Prática e limites da avaliação",
    "frontMd": "Por que igualdade estrita serve a alternativas controladas?",
    "backMd": "scoreMultipleChoice compara a resposta ao gabarito e concede o máximo ou zero. Isso pressupõe uma representação estruturada, sem interpretação de texto livre."
  },
  {
    "nodeTitle": "Prática e limites da avaliação",
    "frontMd": "Quanto vale parcial em uma questão de três pontos?",
    "backMd": "scoreSelfGrade multiplica por meio e arredonda: dois pontos. A escolha vem do estudante apoiado pelo gabarito, sem correção automática de prosa."
  },
  {
    "nodeTitle": "Prática e limites da avaliação",
    "frontMd": "Clamp de fração valida uma resposta de tutor desconhecida?",
    "backMd": "scoreRubricFraction limita entradas numéricas finitas e arredonda pontos. NaN não é corrigido pelo clamp; o parser e o fluxo devem tratar formato e falha."
  },
  {
    "nodeTitle": "Pontuação e sequência de estudo",
    "frontMd": "Qual recompensa o helper de nível dá a três pontos avançados?",
    "backMd": "computePointsForExercise aplica fator três a advanced e devolve nove. Isso é política de recompensa, separada da avaliação e da soma no índice."
  },
  {
    "nodeTitle": "Pontuação e sequência de estudo",
    "frontMd": "Qual o domínio normalizado de níveis quatro e zero?",
    "backMd": "computeMasteryWeight soma quatro e divide por dois nós vezes quatro, resultando em meio. Todos os nós recebidos possuem o mesmo peso."
  },
  {
    "nodeTitle": "Pontuação e sequência de estudo",
    "frontMd": "Duas atividades no mesmo dia aumentam streak duas vezes?",
    "backMd": "updateStreak devolve o score sem incrementar quando lastStudyDate já é hoje. Continuidade com ontem incrementa; ausência de continuidade reinicia em um."
  },
  {
    "nodeTitle": "Pontuação e sequência de estudo",
    "frontMd": "addPoints é idempotente para uma tentativa repetida?",
    "backMd": "Não. Ele atualiza a sequência diária e sempre soma os pontos recebidos. Evitar dupla contagem de dia não impede dupla concessão de crédito."
  },
  {
    "nodeTitle": "Dashboard e plano de sessão",
    "frontMd": "O que torna um nó candidato à retomada no dashboard?",
    "backMd": "computeWeakestNodes considera mastery menor que quatro, ordena crescente e limita. A regra não estima esquecimento por tempo nem consulta erros de tentativa."
  },
  {
    "nodeTitle": "Dashboard e plano de sessão",
    "frontMd": "Por que comparar o array inteiro da distribuição?",
    "backMd": "computeMasteryDistribution associa posições zero a quatro aos níveis. A soma pode estar correta mesmo quando bins estão trocados e a legenda comunica outro estado."
  },
  {
    "nodeTitle": "Dashboard e plano de sessão",
    "frontMd": "Como vinte minutos e fila grande viram oito, sete e cinco?",
    "backMd": "planSessionBlocks limita revisão a quarenta por cento, reserva trinta e cinco para leitura e usa o restante em exercícios. São estimativas de plano."
  },
  {
    "nodeTitle": "Dashboard e plano de sessão",
    "frontMd": "A série futura inclui atrasos na primeira barra?",
    "backMd": "computeUpcomingDue conta igualdade exata de dueDate para cada dia. Cards anteriores a hoje não são somados automaticamente à primeira posição."
  },
  {
    "nodeTitle": "Grade, busca e caminho",
    "frontMd": "Por que a busca usa uma chave textual da célula?",
    "backMd": "cellKey representa x e y com separador, permitindo igualdade por coordenadas em Set e Map. Objetos distintos não compartilham identidade por referência."
  },
  {
    "nodeTitle": "Grade, busca e caminho",
    "frontMd": "neighbors considera paredes?",
    "backMd": "Não. A função gera adjacência ortogonal dentro dos limites. bfs consulta paredes e descobertas depois, mantendo geometria e estado de busca separados."
  },
  {
    "nodeTitle": "Grade, busca e caminho",
    "frontMd": "Por que marcar o pai ao enfileirar em bfs?",
    "backMd": "O mapa de pais também marca descoberta, impedindo enfileiramento repetido. A fila preserva camadas de distância em um grafo sem pesos."
  },
  {
    "nodeTitle": "Grade, busca e caminho",
    "frontMd": "pathIsValid comprova que a meta foi alcançada?",
    "backMd": "Não. Ele verifica limites, paredes, ausência de repetição e adjacência. Não recebe endpoints e aceita lista vazia pela semântica de every."
  },
  {
    "nodeTitle": "Labs, mutações e invariantes",
    "frontMd": "O que validateLab comprova sobre uma mutação?",
    "backMd": "A mutação precisa apontar para alguma invariante existente na camada. A regra verifica relações de dados, sem executar a causalidade anunciada pelo cenário."
  },
  {
    "nodeTitle": "Labs, mutações e invariantes",
    "frontMd": "Qual ordem activeMutations conserva?",
    "backMd": "A ordem de layer.mutations, pois selected vira Set e o catálogo é filtrado. Repetir um id selecionado não duplica uma entrada única do catálogo."
  },
  {
    "nodeTitle": "Labs, mutações e invariantes",
    "frontMd": "O booleano de invariante quebrada é uma observação do estado?",
    "backMd": "invariantIsBroken consulta breaks nas mutações recebidas. O booleano é uma relação declarada; um verificador independente deve ler o resultado do mecanismo."
  },
  {
    "nodeTitle": "Labs, mutações e invariantes",
    "frontMd": "Por que concluir a mesma camada duas vezes não dá cem por cento?",
    "backMd": "labCompletion deduplica os ids concluídos e percorre as camadas do catálogo. Uma de duas camadas continua valendo cinquenta por cento."
  },
  {
    "nodeTitle": "Tutor, ações e revisão humana",
    "frontMd": "parseActions valida todos os campos de uma variante conhecida?",
    "backMd": "Não. Ele interpreta a primeira cerca JSON e filtra pelo type permitido. Campos obrigatórios ainda precisam de validação runtime antes dos consumidores."
  },
  {
    "nodeTitle": "Tutor, ações e revisão humana",
    "frontMd": "Resolver nome de nó autoriza uma proposta?",
    "backMd": "describeAction apenas produz um resumo humano com título ou fallback. Validade, detalhes, aceitação e efeito pertencem a outras etapas do fluxo."
  },
  {
    "nodeTitle": "Tutor, ações e revisão humana",
    "frontMd": "Uma instrução no prompt garante JSON válido?",
    "backMd": "actionPrompt orienta o protocolo e enumera variantes. O aplicativo ainda precisa interpretar e validar a resposta gerada, além de revisar a intenção humana."
  },
  {
    "nodeTitle": "Tutor, ações e revisão humana",
    "frontMd": "applyAction executa ingest_source diretamente?",
    "backMd": "Não. Esse ramo devolve documentos inalterados e uma nota de fluxo. A ingestão real e sua aprovação possuem um pipeline separado de rascunhos."
  },
  {
    "nodeTitle": "Persistência e como estender o Chiron",
    "frontMd": "recordAttempt aplica o multiplicador de nível internamente?",
    "backMd": "Não. O serviço acrescenta a tentativa e soma scoreAwarded recebido. A avaliação e qualquer política de ponderação precisam estar decididas pelo consumidor."
  },
  {
    "nodeTitle": "Persistência e como estender o Chiron",
    "frontMd": "Qual identidade recordLabLayer usa para substituir progresso?",
    "backMd": "O par labId e layerId. O registro recente substitui o anterior do mesmo par; outras camadas e outros Labs precisam permanecer."
  },
  {
    "nodeTitle": "Persistência e como estender o Chiron",
    "frontMd": "createSession escolhe conteúdo ou resolve planned?",
    "backMd": "Não. A função registra orçamento e blocos recebidos com identidade e datas. Planejamento e resolução de referências pertencem ao fluxo que a chama."
  },
  {
    "nodeTitle": "Persistência e como estender o Chiron",
    "frontMd": "Serializar o índice garante persistência e compatibilidade?",
    "backMd": "serializeIndex somente chama JSON.stringify. O store grava, a migração adapta documentos antigos e os contratos verificam estrutura; nenhuma etapa substitui as demais."
  }
];
export const CHIRON_EXERCISES: ContentSource["exercises"] = [
  {
    "nodeTitle": "Documentos e evolução de schema",
    "type": 2,
    "level": "beginner",
    "points": 3,
    "promptMd": "Em src/lib/study/migrate.ts, investigue freshIndex com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Por que freshIndex separa versão do documento e schemaVersion? Depois avalie esta mudança proposta: Usar version como número de schema pode impedir migrações de um documento que já recebeu muitas edições. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as migrate from \"@/lib/study/migrate\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (migrate.freshIndex().schemaVersion);\n```",
    "answerKeyMd": "Saída observada esperada: 3. version acompanha alterações do documento; schemaVersion identifica a forma persistida. O índice inicial usa versão um e schema três, sem criar atividade, fontes ou conceitos. A mudança deve ser rejeitada ou acompanhada de outro contrato: Usar version como número de schema pode impedir migrações de um documento que já recebeu muitas edições. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Documentos e evolução de schema",
    "type": 3,
    "level": "beginner",
    "points": 3,
    "promptMd": "Em src/lib/study/migrate.ts, investigue freshLib com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Qual relação freshLib mantém com uma fonte? Depois avalie esta mudança proposta: Guardar cards na biblioteca criaria uma segunda origem de verdade incompatível com os consumidores do índice. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as migrate from \"@/lib/study/migrate\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (migrate.freshLib(\"s\").sourceId);\n```",
    "answerKeyMd": "Saída observada esperada: \"s\". sourceId vincula a biblioteca a uma fonte. A estrutura inicial possui capítulos, seções e exercícios vazios com schema dois; cards e atividade pertencem ao índice. A mudança deve ser rejeitada ou acompanhada de outro contrato: Guardar cards na biblioteca criaria uma segunda origem de verdade incompatível com os consumidores do índice. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Documentos e evolução de schema",
    "type": 5,
    "level": "beginner",
    "points": 3,
    "promptMd": "Em src/lib/study/migrate.ts, investigue migrateIndex com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: migrateIndex valida integralmente um índice antigo? Depois avalie esta mudança proposta: Um cast após a migração pode esconder nós ou scores inválidos que a rotina nunca verificou. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as migrate from \"@/lib/study/migrate\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (migrate.migrateIndex({sources:[],version:99}).schemaVersion);\n```",
    "answerKeyMd": "Saída observada esperada: 3. Não. A migração reconhece sources como array, preenche coleções históricas e atualiza o schema, preservando outros campos por spread. Isso não valida cada entidade. A mudança deve ser rejeitada ou acompanhada de outro contrato: Um cast após a migração pode esconder nós ou scores inválidos que a rotina nunca verificou. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Serviço de fontes e mapa",
    "type": 2,
    "level": "beginner",
    "points": 3,
    "promptMd": "Em src/lib/study/service.ts, investigue addSource com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Criar uma fonte publica automaticamente uma apostila completa? Depois avalie esta mudança proposta: Confundir uma entrada de fonte com conteúdo pronto pode expor uma biblioteca vazia como material completo. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.addSource(migrate.freshIndex(),{name:\"S\",kind:\"repo\"}).index.sources.length);\n```",
    "answerKeyMd": "Saída observada esperada: 1. addSource acrescenta metadados e identidade ao índice. Capítulos e blocos precisam ser materializados e auditados separadamente antes da publicação editorial. A mudança deve ser rejeitada ou acompanhada de outro contrato: Confundir uma entrada de fonte com conteúdo pronto pode expor uma biblioteca vazia como material completo. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Serviço de fontes e mapa",
    "type": 3,
    "level": "beginner",
    "points": 3,
    "promptMd": "Em src/lib/study/service.ts, investigue removeSource com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Qual é o alcance real de removeSource? Depois avalie esta mudança proposta: Prometer uma cascata completa deixaria histórico e bibliotecas órfãs sem uma política de recuperação. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.removeSource({...migrate.freshIndex(),sources:[{id:\"s\"},{id:\"t\"}],nodes:[{sourceId:\"s\"},{sourceId:\"t\"}],cards:[{sourceId:\"s\"}]},\"s\").nodes.map(n=>n.sourceId));\n```",
    "answerKeyMd": "Saída observada esperada: [\"t\"]. O helper filtra fontes, nós e cards. Tentativas, sessões, reviewLog, labProgress e bibliotecas externas ao argumento não são apagados por essa chamada. A mudança deve ser rejeitada ou acompanhada de outro contrato: Prometer uma cascata completa deixaria histórico e bibliotecas órfãs sem uma política de recuperação. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Serviço de fontes e mapa",
    "type": 5,
    "level": "beginner",
    "points": 3,
    "promptMd": "Em src/lib/study/service.ts, investigue addNode com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: addNode cria domínio por inferência? Depois avalie esta mudança proposta: Marcar domínio ao criar um nó faria o mapa confundir cadastro com evidência de estudo. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.addNode(migrate.freshIndex(),{sourceId:\"s\",title:\"N\",kind:\"concept\",requires:[]}).index.nodes[0].mastery);\n```",
    "answerKeyMd": "Saída observada esperada: 0. Não. O nó começa com mastery zero e conserva as dependências recebidas. Criar um conceito não demonstra aprendizagem nem valida a ausência de ciclos. A mudança deve ser rejeitada ou acompanhada de outro contrato: Marcar domínio ao criar um nó faria o mapa confundir cadastro com evidência de estudo. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Conteúdo e materialização",
    "type": 2,
    "level": "beginner",
    "points": 3,
    "promptMd": "Em src/lib/content/blocks.ts, investigue mdToBlocks com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: mdToBlocks é um parser completo de Markdown? Depois avalie esta mudança proposta: Depender da ponte para gerar porque ou labref pode publicar seções sem os blocos exigidos. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as blocks from \"@/lib/content/blocks\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (blocks.mdToBlocks(\"antes\\n```js\\nx=1\\n```\\ndepois\").map(b=>b.kind));\n```",
    "answerKeyMd": "Saída observada esperada: [\"prose\",\"code\",\"prose\"]. Não. Ele separa cercas de código reconhecidas e prosa, podendo acrescentar uma citação. Não converte automaticamente toda semântica de CommonMark em blocos nativos. A mudança deve ser rejeitada ou acompanhada de outro contrato: Depender da ponte para gerar porque ou labref pode publicar seções sem os blocos exigidos. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Conteúdo e materialização",
    "type": 3,
    "level": "beginner",
    "points": 3,
    "promptMd": "Em src/lib/content/blocks.ts, investigue proseWordCount com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: O que proseWordCount exclui da densidade? Depois avalie esta mudança proposta: Acrescentar código para compensar explicação curta não satisfaz o contrato de densidade. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as blocks from \"@/lib/content/blocks\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (blocks.proseWordCount([{kind:\"prose\",md:\"um dois\"},{kind:\"code\",lang:\"js\",code:\"muitas palavras extras\"}]));\n```",
    "answerKeyMd": "Saída observada esperada: 2. Somente blocos prose entram na contagem por espaços. Código e outros blocos não aumentam o piso; a contagem não julga a qualidade das palavras. A mudança deve ser rejeitada ou acompanhada de outro contrato: Acrescentar código para compensar explicação curta não satisfaz o contrato de densidade. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Conteúdo e materialização",
    "type": 5,
    "level": "beginner",
    "points": 3,
    "promptMd": "Em src/lib/content/blocks.ts, investigue countBlocksOfKind com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Contar blocos code demonstra que os exemplos são diferentes? Depois avalie esta mudança proposta: Dois blocos idênticos podem satisfazer a contagem e ainda falhar na auditoria de duplicação. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as blocks from \"@/lib/content/blocks\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (blocks.countBlocksOfKind([{kind:\"prose\"},{kind:\"code\"},{kind:\"code\"}],\"code\"));\n```",
    "answerKeyMd": "Saída observada esperada: 2. countBlocksOfKind mede cardinalidade por kind. Duplicação, correção e execução exigem outras verificações editoriais e evidência de executor. A mudança deve ser rejeitada ou acompanhada de outro contrato: Dois blocos idênticos podem satisfazer a contagem e ainda falhar na auditoria de duplicação. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Motor de repetição espaçada",
    "type": 2,
    "level": "beginner",
    "points": 3,
    "promptMd": "Em src/lib/study/srs.ts, investigue gradeMinQuality com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Qual limiar separa lapso de resposta aceita no motor? Depois avalie esta mudança proposta: Classificar três como lapso mudaria intervalos e retenção em desacordo com o contrato vigente. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as srs from \"@/lib/study/srs\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (srs.gradeMinQuality(3));\n```",
    "answerKeyMd": "Saída observada esperada: 3. gradeMinQuality fornece a qualidade; valores abaixo de três seguem o ramo de lapso. O grau três já representa resposta aceita. A mudança deve ser rejeitada ou acompanhada de outro contrato: Classificar três como lapso mudaria intervalos e retenção em desacordo com o contrato vigente. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Motor de repetição espaçada",
    "type": 3,
    "level": "beginner",
    "points": 3,
    "promptMd": "Em src/lib/study/srs.ts, investigue computeSM2 com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Qual facilidade computeSM2 usa no intervalo maduro? Depois avalie esta mudança proposta: Usar a facilidade atualizada para a mesma multiplicação altera a agenda e faz a previsão divergir do motor documentado. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as srs from \"@/lib/study/srs\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (srs.computeSM2(2.5,6,2,0,4,\"2026-10-08\").intervalDays);\n```",
    "answerKeyMd": "Saída observada esperada: 15. O intervalo anterior é multiplicado pela facilidade anterior e arredondado. A facilidade atualizada faz parte do novo estado e não substitui retroativamente esse fator. A mudança deve ser rejeitada ou acompanhada de outro contrato: Usar a facilidade atualizada para a mesma multiplicação altera a agenda e faz a previsão divergir do motor documentado. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Motor de repetição espaçada",
    "type": 5,
    "level": "beginner",
    "points": 3,
    "promptMd": "Em src/lib/study/srs.ts, investigue isCardDue com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Um card que vence hoje já está pendente? Depois avalie esta mudança proposta: Trocar menor ou igual por menor adia indevidamente a revisão marcada para hoje. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as srs from \"@/lib/study/srs\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (srs.isCardDue({dueDate:\"2026-10-08\"},\"2026-10-08\"));\n```",
    "answerKeyMd": "Saída observada esperada: true. isCardDue usa comparação inclusiva entre strings de dia canônicas. dueDate igual a hoje retorna verdadeiro; a função não interpreta formatos arbitrários. A mudança deve ser rejeitada ou acompanhada de outro contrato: Trocar menor ou igual por menor adia indevidamente a revisão marcada para hoje. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Interface de revisão",
    "type": 2,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Em src/lib/study/review.ts, investigue gradeForButton com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Por que Difícil não significa lapso na UI? Depois avalie esta mudança proposta: Mapear hard para zero reinicia repetições quando a pessoa de fato lembrou a resposta. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as review from \"@/lib/study/review\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (review.gradeForButton(\"hard\"));\n```",
    "answerKeyMd": "Saída observada esperada: 3. gradeForButton mapeia hard para três, resposta aceita com dificuldade. Again mapeia para zero e representa lapso, preservando a fronteira do motor. A mudança deve ser rejeitada ou acompanhada de outro contrato: Mapear hard para zero reinicia repetições quando a pessoa de fato lembrou a resposta. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Interface de revisão",
    "type": 3,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Em src/lib/study/review.ts, investigue predictIntervalDays com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Prever intervalo registra uma revisão? Depois avalie esta mudança proposta: Gravar durante a renderização dos quatro botões produziria revisões sem uma escolha confirmada. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as review from \"@/lib/study/review\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (review.predictIntervalDays({ease:2.5,intervalDays:6,reps:2,lapses:0},\"good\",\"2026-10-08\"));\n```",
    "answerKeyMd": "Saída observada esperada: 15. predictIntervalDays delega ao mesmo computeSM2 e projeta intervalDays. A função pura não altera o card nem acrescenta reviewLog. A mudança deve ser rejeitada ou acompanhada de outro contrato: Gravar durante a renderização dos quatro botões produziria revisões sem uma escolha confirmada. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Interface de revisão",
    "type": 5,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Em src/lib/study/review.ts, investigue formatInterval com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: O rótulo 2m pode ser usado para persistir a agenda? Depois avalie esta mudança proposta: Reconstruir dueDate a partir de uma unidade arredondada pode deslocar o vencimento real. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as review from \"@/lib/study/review\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (review.formatInterval(60));\n```",
    "answerKeyMd": "Saída observada esperada: \"2m\". formatInterval comprime sessenta dias em dois meses aproximados. O texto perde precisão; a gravação deve usar o estado numérico e a data calculada. A mudança deve ser rejeitada ou acompanhada de outro contrato: Reconstruir dueDate a partir de uma unidade arredondada pode deslocar o vencimento real. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Prática e limites da avaliação",
    "type": 2,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Em src/lib/study/practice.ts, investigue selectExercises com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Em que ordem a prática filtra, sorteia e limita? Depois avalie esta mudança proposta: Cortar antes de filtrar pode excluir candidatos válidos que estavam depois do limite inicial. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as practice from \"@/lib/study/practice\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (practice.selectExercises([{id:\"a\",sourceId:\"s\"},{id:\"b\",sourceId:\"t\"}],{sourceId:\"s\",count:3}).map(e=>e.id));\n```",
    "answerKeyMd": "Saída observada esperada: [\"a\"]. selectExercises aplica filtros, embaralha uma cópia e corta a quantidade. Um único candidato elegível permite um oracle determinístico apesar do sorteio. A mudança deve ser rejeitada ou acompanhada de outro contrato: Cortar antes de filtrar pode excluir candidatos válidos que estavam depois do limite inicial. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Prática e limites da avaliação",
    "type": 3,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Em src/lib/study/practice.ts, investigue scoreMultipleChoice com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Por que igualdade estrita serve a alternativas controladas? Depois avalie esta mudança proposta: Usar a mesma comparação para uma explicação correta com outras palavras produziria um falso erro automático. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as practice from \"@/lib/study/practice\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (practice.scoreMultipleChoice({answerKeyMd:\"B\",points:4},\"B\"));\n```",
    "answerKeyMd": "Saída observada esperada: 4. scoreMultipleChoice compara a resposta ao gabarito e concede o máximo ou zero. Isso pressupõe uma representação estruturada, sem interpretação de texto livre. A mudança deve ser rejeitada ou acompanhada de outro contrato: Usar a mesma comparação para uma explicação correta com outras palavras produziria um falso erro automático. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Prática e limites da avaliação",
    "type": 5,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Em src/lib/study/practice.ts, investigue scoreSelfGrade com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Quanto vale parcial em uma questão de três pontos? Depois avalie esta mudança proposta: Exibir um e meio enquanto se grava dois gera divergência entre resumo e histórico. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as practice from \"@/lib/study/practice\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (practice.scoreSelfGrade({points:3},\"partial\"));\n```",
    "answerKeyMd": "Saída observada esperada: 2. scoreSelfGrade multiplica por meio e arredonda: dois pontos. A escolha vem do estudante apoiado pelo gabarito, sem correção automática de prosa. A mudança deve ser rejeitada ou acompanhada de outro contrato: Exibir um e meio enquanto se grava dois gera divergência entre resumo e histórico. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Pontuação e sequência de estudo",
    "type": 2,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Em src/lib/study/scoring.ts, investigue computePointsForExercise com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Qual recompensa o helper de nível dá a três pontos avançados? Depois avalie esta mudança proposta: Aplicar o multiplicador antes da gravação e novamente no resumo duplica o fator sem nova evidência. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as scoring from \"@/lib/study/scoring\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (scoring.computePointsForExercise(\"advanced\",3));\n```",
    "answerKeyMd": "Saída observada esperada: 9. computePointsForExercise aplica fator três a advanced e devolve nove. Isso é política de recompensa, separada da avaliação e da soma no índice. A mudança deve ser rejeitada ou acompanhada de outro contrato: Aplicar o multiplicador antes da gravação e novamente no resumo duplica o fator sem nova evidência. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Pontuação e sequência de estudo",
    "type": 3,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Em src/lib/study/scoring.ts, investigue computeMasteryWeight com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Qual o domínio normalizado de níveis quatro e zero? Depois avalie esta mudança proposta: Dividir apenas pela quantidade devolve dois, fora da escala normalizada esperada. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as scoring from \"@/lib/study/scoring\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (scoring.computeMasteryWeight([{mastery:4},{mastery:0}]));\n```",
    "answerKeyMd": "Saída observada esperada: 0.5. computeMasteryWeight soma quatro e divide por dois nós vezes quatro, resultando em meio. Todos os nós recebidos possuem o mesmo peso. A mudança deve ser rejeitada ou acompanhada de outro contrato: Dividir apenas pela quantidade devolve dois, fora da escala normalizada esperada. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Pontuação e sequência de estudo",
    "type": 5,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Em src/lib/study/scoring.ts, investigue updateStreak com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Duas atividades no mesmo dia aumentam streak duas vezes? Depois avalie esta mudança proposta: Incrementar em toda chamada transforma quantidade de ações em uma falsa sequência de dias. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as scoring from \"@/lib/study/scoring\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (scoring.updateStreak({total:0,streak:3,lastStudyDate:\"2026-10-07\"},\"2026-10-08\").streak);\n```",
    "answerKeyMd": "Saída observada esperada: 4. updateStreak devolve o score sem incrementar quando lastStudyDate já é hoje. Continuidade com ontem incrementa; ausência de continuidade reinicia em um. A mudança deve ser rejeitada ou acompanhada de outro contrato: Incrementar em toda chamada transforma quantidade de ações em uma falsa sequência de dias. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Dashboard e plano de sessão",
    "type": 2,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Em src/lib/study/dashboard.ts, investigue computeWeakestNodes com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: O que torna um nó candidato à retomada no dashboard? Depois avalie esta mudança proposta: Apresentar a lista como previsão de esquecimento atribui ao cálculo dados que ele não usa. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as migrate from \"@/lib/study/migrate\";\nimport * as dashboard from \"@/lib/study/dashboard\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (dashboard.computeWeakestNodes({...migrate.freshIndex(),nodes:[{id:\"a\",sourceId:\"s\",mastery:4},{id:\"b\",sourceId:\"s\",mastery:1}]}).map(x=>x.node.id));\n```",
    "answerKeyMd": "Saída observada esperada: [\"b\"]. computeWeakestNodes considera mastery menor que quatro, ordena crescente e limita. A regra não estima esquecimento por tempo nem consulta erros de tentativa. A mudança deve ser rejeitada ou acompanhada de outro contrato: Apresentar a lista como previsão de esquecimento atribui ao cálculo dados que ele não usa. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Dashboard e plano de sessão",
    "type": 3,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Em src/lib/study/dashboard.ts, investigue computeMasteryDistribution com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Por que comparar o array inteiro da distribuição? Depois avalie esta mudança proposta: Validar somente o total não detecta um gráfico que inverte ausência de estudo e domínio completo. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as migrate from \"@/lib/study/migrate\";\nimport * as dashboard from \"@/lib/study/dashboard\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (dashboard.computeMasteryDistribution({...migrate.freshIndex(),nodes:[{mastery:0},{mastery:4},{mastery:4}]}));\n```",
    "answerKeyMd": "Saída observada esperada: [1,0,0,0,2]. computeMasteryDistribution associa posições zero a quatro aos níveis. A soma pode estar correta mesmo quando bins estão trocados e a legenda comunica outro estado. A mudança deve ser rejeitada ou acompanhada de outro contrato: Validar somente o total não detecta um gráfico que inverte ausência de estudo e domínio completo. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Dashboard e plano de sessão",
    "type": 5,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Em src/lib/study/dashboard.ts, investigue planSessionBlocks com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Como vinte minutos e fila grande viram oito, sete e cinco? Depois avalie esta mudança proposta: Tratar estMin como tempo cronometrado inventa observação que o planejador não coleta. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as dashboard from \"@/lib/study/dashboard\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (dashboard.planSessionBlocks(20,20).map(b=>b.estMin));\n```",
    "answerKeyMd": "Saída observada esperada: [8,7,5]. planSessionBlocks limita revisão a quarenta por cento, reserva trinta e cinco para leitura e usa o restante em exercícios. São estimativas de plano. A mudança deve ser rejeitada ou acompanhada de outro contrato: Tratar estMin como tempo cronometrado inventa observação que o planejador não coleta. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Grade, busca e caminho",
    "type": 2,
    "level": "advanced",
    "points": 3,
    "promptMd": "Em src/lib/labs/grid.ts, investigue cellKey com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Por que a busca usa uma chave textual da célula? Depois avalie esta mudança proposta: Usar objetos recém-criados como chaves pode visitar a mesma coordenada várias vezes. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as grid from \"@/lib/labs/grid\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (grid.cellKey({x:1,y:2}));\n```",
    "answerKeyMd": "Saída observada esperada: \"1,2\". cellKey representa x e y com separador, permitindo igualdade por coordenadas em Set e Map. Objetos distintos não compartilham identidade por referência. A mudança deve ser rejeitada ou acompanhada de outro contrato: Usar objetos recém-criados como chaves pode visitar a mesma coordenada várias vezes. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Grade, busca e caminho",
    "type": 3,
    "level": "advanced",
    "points": 3,
    "promptMd": "Em src/lib/labs/grid.ts, investigue neighbors com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: neighbors considera paredes? Depois avalie esta mudança proposta: Adicionar diagonais só na vizinhança faz o verificador Manhattan rejeitar caminhos produzidos pela busca. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as grid from \"@/lib/labs/grid\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (grid.neighbors({x:0,y:0},2,2));\n```",
    "answerKeyMd": "Saída observada esperada: [{\"x\":1,\"y\":0},{\"x\":0,\"y\":1}]. Não. A função gera adjacência ortogonal dentro dos limites. bfs consulta paredes e descobertas depois, mantendo geometria e estado de busca separados. A mudança deve ser rejeitada ou acompanhada de outro contrato: Adicionar diagonais só na vizinhança faz o verificador Manhattan rejeitar caminhos produzidos pela busca. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Grade, busca e caminho",
    "type": 5,
    "level": "advanced",
    "points": 3,
    "promptMd": "Em src/lib/labs/grid.ts, investigue bfs com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Por que marcar o pai ao enfileirar em bfs? Depois avalie esta mudança proposta: Trocar a fila por pilha pode conservar validade e perder a garantia de caminho mínimo. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as grid from \"@/lib/labs/grid\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (grid.bfs({x:0,y:0},{x:1,y:0},2,1).path);\n```",
    "answerKeyMd": "Saída observada esperada: [{\"x\":0,\"y\":0},{\"x\":1,\"y\":0}]. O mapa de pais também marca descoberta, impedindo enfileiramento repetido. A fila preserva camadas de distância em um grafo sem pesos. A mudança deve ser rejeitada ou acompanhada de outro contrato: Trocar a fila por pilha pode conservar validade e perder a garantia de caminho mínimo. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Labs, mutações e invariantes",
    "type": 2,
    "level": "advanced",
    "points": 3,
    "promptMd": "Em src/lib/labs/engine.ts, investigue validateLab com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: O que validateLab comprova sobre uma mutação? Depois avalie esta mudança proposta: Declarar breaks correto não prova isolamento ou idempotência de um backend real. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as engine from \"@/lib/labs/engine\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (engine.validateLab({layers:[]}).map(x=>x.path));\n```",
    "answerKeyMd": "Saída observada esperada: [\"layers\"]. A mutação precisa apontar para alguma invariante existente na camada. A regra verifica relações de dados, sem executar a causalidade anunciada pelo cenário. A mudança deve ser rejeitada ou acompanhada de outro contrato: Declarar breaks correto não prova isolamento ou idempotência de um backend real. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Labs, mutações e invariantes",
    "type": 3,
    "level": "advanced",
    "points": 3,
    "promptMd": "Em src/lib/labs/engine.ts, investigue activeMutations com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Qual ordem activeMutations conserva? Depois avalie esta mudança proposta: Mapear diretamente a seleção pode duplicar mutações e introduzir valores ausentes para ids desconhecidos. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as engine from \"@/lib/labs/engine\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (engine.activeMutations({mutations:[{id:\"a\"},{id:\"b\"}]},[\"b\",\"b\"]).map(x=>x.id));\n```",
    "answerKeyMd": "Saída observada esperada: [\"b\"]. A ordem de layer.mutations, pois selected vira Set e o catálogo é filtrado. Repetir um id selecionado não duplica uma entrada única do catálogo. A mudança deve ser rejeitada ou acompanhada de outro contrato: Mapear diretamente a seleção pode duplicar mutações e introduzir valores ausentes para ids desconhecidos. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Labs, mutações e invariantes",
    "type": 5,
    "level": "advanced",
    "points": 3,
    "promptMd": "Em src/lib/labs/engine.ts, investigue invariantIsBroken com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: O booleano de invariante quebrada é uma observação do estado? Depois avalie esta mudança proposta: Usar o mesmo metadado para prever e comprovar a quebra cria uma validação circular. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as engine from \"@/lib/labs/engine\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (engine.invariantIsBroken(\"stock\",[{breaks:[\"stock\"]}]));\n```",
    "answerKeyMd": "Saída observada esperada: true. invariantIsBroken consulta breaks nas mutações recebidas. O booleano é uma relação declarada; um verificador independente deve ler o resultado do mecanismo. A mudança deve ser rejeitada ou acompanhada de outro contrato: Usar o mesmo metadado para prever e comprovar a quebra cria uma validação circular. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Tutor, ações e revisão humana",
    "type": 2,
    "level": "advanced",
    "points": 3,
    "promptMd": "Em src/lib/ai/actions.ts, investigue parseActions com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: parseActions valida todos os campos de uma variante conhecida? Depois avalie esta mudança proposta: Um create_cards sem cards pode passar pelo filtro e falhar ao descrever a proposta. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as actions from \"@/lib/ai/actions\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (actions.parseActions(\"Prosa\\n```actions\\n[{\\\"type\\\":\\\"unknown\\\"}]\\n```\").actions.length);\n```",
    "answerKeyMd": "Saída observada esperada: 0. Não. Ele interpreta a primeira cerca JSON e filtra pelo type permitido. Campos obrigatórios ainda precisam de validação runtime antes dos consumidores. A mudança deve ser rejeitada ou acompanhada de outro contrato: Um create_cards sem cards pode passar pelo filtro e falhar ao descrever a proposta. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Tutor, ações e revisão humana",
    "type": 3,
    "level": "advanced",
    "points": 3,
    "promptMd": "Em src/lib/ai/actions.ts, investigue describeAction com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Resolver nome de nó autoriza uma proposta? Depois avalie esta mudança proposta: Uma frase plausível pode apontar para alvo ausente e não comprova que a alteração foi aceita. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as migrate from \"@/lib/study/migrate\";\nimport * as actions from \"@/lib/ai/actions\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (actions.describeAction(migrate.freshIndex(),{type:\"plan_session\",budgetMin:20,blocks:[]}));\n```",
    "answerKeyMd": "Saída observada esperada: \"Propor uma sessão de estudo\". describeAction apenas produz um resumo humano com título ou fallback. Validade, detalhes, aceitação e efeito pertencem a outras etapas do fluxo. A mudança deve ser rejeitada ou acompanhada de outro contrato: Uma frase plausível pode apontar para alvo ausente e não comprova que a alteração foi aceita. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Tutor, ações e revisão humana",
    "type": 5,
    "level": "advanced",
    "points": 3,
    "promptMd": "Em src/lib/ai/actions.ts, investigue actionPrompt com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Uma instrução no prompt garante JSON válido? Depois avalie esta mudança proposta: Depender apenas do prompt permite que dados incompletos cheguem a funções que presumem uma união válida. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as actions from \"@/lib/ai/actions\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (actions.actionPrompt().includes(\"generate_lab\"));\n```",
    "answerKeyMd": "Saída observada esperada: true. actionPrompt orienta o protocolo e enumera variantes. O aplicativo ainda precisa interpretar e validar a resposta gerada, além de revisar a intenção humana. A mudança deve ser rejeitada ou acompanhada de outro contrato: Depender apenas do prompt permite que dados incompletos cheguem a funções que presumem uma união válida. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Persistência e como estender o Chiron",
    "type": 2,
    "level": "advanced",
    "points": 3,
    "promptMd": "Em src/lib/study/service.ts, investigue recordAttempt com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: recordAttempt aplica o multiplicador de nível internamente? Depois avalie esta mudança proposta: Repetir a mesma chamada cria outra tentativa e outro crédito, pois não há chave de idempotência de evento. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.recordAttempt(migrate.freshIndex(),{exerciseId:\"e\",nodeId:\"n\",answerMd:\"A\",scoreAwarded:3}).index.score.total);\n```",
    "answerKeyMd": "Saída observada esperada: 3. Não. O serviço acrescenta a tentativa e soma scoreAwarded recebido. A avaliação e qualquer política de ponderação precisam estar decididas pelo consumidor. A mudança deve ser rejeitada ou acompanhada de outro contrato: Repetir a mesma chamada cria outra tentativa e outro crédito, pois não há chave de idempotência de evento. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Persistência e como estender o Chiron",
    "type": 3,
    "level": "advanced",
    "points": 3,
    "promptMd": "Em src/lib/study/service.ts, investigue recordLabLayer com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: Qual identidade recordLabLayer usa para substituir progresso? Depois avalie esta mudança proposta: Filtrar apenas por Lab apaga progresso de todas as suas camadas ao refazer uma só. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.recordLabLayer({...migrate.freshIndex(),labProgress:[{labId:\"a\",layerId:\"l\",predictedCorrect:false}]},{labId:\"a\",layerId:\"l\",predictedCorrect:true}).labProgress.length);\n```",
    "answerKeyMd": "Saída observada esperada: 1. O par labId e layerId. O registro recente substitui o anterior do mesmo par; outras camadas e outros Labs precisam permanecer. A mudança deve ser rejeitada ou acompanhada de outro contrato: Filtrar apenas por Lab apaga progresso de todas as suas camadas ao refazer uma só. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  },
  {
    "nodeTitle": "Persistência e como estender o Chiron",
    "type": 5,
    "level": "advanced",
    "points": 3,
    "promptMd": "Em src/lib/study/service.ts, investigue createSession com a fixture abaixo. Escreva sua previsão antes de executar, justifique a regra e responda: createSession escolhe conteúdo ou resolve planned? Depois avalie esta mudança proposta: Blocos com a mesma referência genérica podem ser concluídos juntos se o consumidor não definir identidade adequada. Indique uma contraprova que distingue o comportamento vigente da alteração e delimite o que este programa não verifica.\n\n```javascript\nimport * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.createSession(migrate.freshIndex(),25,[]).session.budgetMin);\n```",
    "answerKeyMd": "Saída observada esperada: 25. Não. A função registra orçamento e blocos recebidos com identidade e datas. Planejamento e resolução de referências pertencem ao fluxo que a chama. A mudança deve ser rejeitada ou acompanhada de outro contrato: Blocos com a mesma referência genérica podem ser concluídos juntos se o consumidor não definir identidade adequada. Reproduza a fixture com a função do arquivo citado e confira o valor literal antes de ampliar o caso. A evidência é uma chamada de domínio com entradas sintéticas, sem renderização, armazenamento ou serviço remoto."
  }
];
