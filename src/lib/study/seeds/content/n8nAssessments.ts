import type { ContentSource } from "./types";
import { N8N_CURRICULUM } from "./n8nCurriculum";
type Review = [question: string, answer: string, failure: string];
const REVIEWS: Review[] = [
  [
    "O que uma conexão no canvas garante sobre execução?",
    "Ela declara um trajeto; dados, configuração e resultado observado determinam se ele executa e produz o efeito esperado.",
    "Uma referência de node inexistente deixa o grafo inválido, e um ramo não percorrido não tem efeito comprovado."
  ],
  [
    "Por que testar draft não prova a revisão produtiva?",
    "Draft e versão publicada podem divergir; associe teste, digest e execução produtiva à mesma revisão.",
    "Promover alteração sem evidência completa ou continuar testando uma revisão diferente invalida a conclusão de release."
  ],
  [
    "Qual é o envelope explícito de dados de um item?",
    "Um item é objeto com json e, quando necessário, binary; metadata e bytes têm contratos próprios.",
    "Tratar coleção como objeto único ou chamar texto Base64 de arquivo completo perde identidade ou integridade."
  ],
  [
    "Como referenciar dados após reordenação?",
    "Use identidade de domínio e contexto apropriado, verificando ausência ou ambiguidade em vez de escolher uma posição casual.",
    "Uma expressão ligada ao primeiro item pode selecionar outro cliente depois de filtro, reorder ou expansão."
  ],
  [
    "Por que projetar campos antes do próximo node?",
    "Uma allowlist conserva apenas o contrato necessário e reduz propagação de secrets, validando valores de domínio.",
    "Copiar entrada integral ou aceitar quantidade decimal pode vazar segredo e invalidar o efeito esperado."
  ],
  [
    "O que muda entre transformar item e agregar coleção?",
    "Transformação mantém contrato por item; agregação examina conjunto e orçamento, com forma de saída deliberada.",
    "Retornar forma incompatível ou somar quantidade inválida produz saída plausível com significado incorreto."
  ],
  [
    "Quando a origem precisa de pairedItem explícito?",
    "Ao criar outputs novos ou alterar cardinalidade, a origem deve ser preservada conforme contexto e inputs usados.",
    "Reindexar outputs filtrados como se fossem inputs liga resultado à pessoa errada."
  ],
  [
    "Por que Merge por posição pode errar?",
    "Ramos podem filtrar e reordenar; join por chave validada associa entidades, rejeitando duplicatas e ausência conforme contrato.",
    "Dois arrays de mesmo tamanho podem conter ordem diferente e produzir uma combinação de tenants."
  ],
  [
    "Por que Schedule precisa timezone e janela de negócio?",
    "Um instante corresponde a datas locais diferentes; identidade da janela limita reprocessamento do mesmo trabalho.",
    "Usar timezone implícita ou deduplicar apenas por executionId repete ou omite uma janela."
  ],
  [
    "O que distingue webhook de teste e produtivo?",
    "O caminho e o lifecycle são distintos; o produtivo depende da revisão publicada e configuração de entrada.",
    "Um endpoint testado no editor não prova publicação, roteamento nem autorização produtiva."
  ],
  [
    "Por que assinar os bytes crus?",
    "A assinatura autentica a representação recebida; reserializar JSON pode alterar os bytes e invalidar HMAC legítimo.",
    "Comparar strings sem validar tamanho ou confiar em tenant do payload deixa fronteiras de acesso incorretas."
  ],
  [
    "Como tratar replay com mesma chave e outro payload?",
    "Vincule chave ao escopo e fingerprint; retorne decisão anterior somente para comando equivalente, recusando conflito.",
    "Responder aceito como confirmado ou repetir efeito depois de timeout gera conclusão falsa ou duplicação."
  ],
  [
    "O que validar além de receber HTTP 200?",
    "Verifique forma, domínio e identidade da resposta; status isolado não demonstra o efeito ou payload esperado.",
    "Interpolação de query ou uso de credential errada altera destino ou semântica apesar de conexão bem-sucedida."
  ],
  [
    "Como evitar paginação sem fim?",
    "Valide cursor, condições de término e orçamento, detectando ciclo e página ausente com estado explícito.",
    "Cursor repetido e retries sem budget podem consumir quota indefinidamente."
  ],
  [
    "Quando consultar antes de retry?",
    "Quando o efeito externo é desconhecido e pode ter ocorrido, consulte por identidade antes de decidir repetição.",
    "Timeout não prova ausência de efeito; retry indiscriminado pode duplicar uma reserva."
  ],
  [
    "O que prova integridade de um binary?",
    "Comparação de bytes ou hash sobre conteúdo conhecido, com tamanho e metadata coerentes no escopo ensaiado.",
    "Um nome de arquivo ou metadata correta não demonstra acesso aos bytes após transferência ou retomada."
  ],
  [
    "Por que valores devem ser parâmetros da query?",
    "Separe estrutura e dados usando binding suportado pelo node e driver, além de conferir cardinalidade do resultado.",
    "Concatenar entrada no SQL ou usar o primeiro resultado de uma query ambígua muda autoridade da decisão."
  ],
  [
    "Por que IF de disponibilidade não garante última vaga?",
    "Leitura e confirmação separadas permitem disputa; a autoridade deve preservar capacidade por operação consistente.",
    "Dois clientes com chaves distintas podem confirmar a única vaga mesmo com deduplicação perfeita."
  ],
  [
    "Qual janela exige deduplicação no consumidor de outbox?",
    "Efeito ou publicação podem ocorrer antes do registro de conclusão; replay da mesma identidade deve conservar efeito definido.",
    "Marcar entregue antes de publicar perde evento; publicar novamente sem dedup repete efeito."
  ],
  [
    "Qual é o escopo de cache e estado auxiliar?",
    "Use tenant, identidade e validade explícitos; cache e tabela auxiliar não substituem autoridade transacional da reserva.",
    "Uma chave sem tenant mistura dados, e TTL expirado pode manter disponibilidade antiga como verdade."
  ],
  [
    "O que conferir em batching além de tamanho?",
    "Cobertura sem perda ou duplicação, ordem quando exigida, condição de término e checkpoint depois do efeito reconhecido.",
    "Batch vazio, tamanho zero ou checkpoint adiantado pode criar loop infinito ou omitir trabalho."
  ],
  [
    "Como definir contrato de sub-workflow?",
    "Declare envelope, identidade, saída, falha e permissões do chamador, observando vínculo entre tentativas.",
    "Um filho com saída inesperada ou capacidade ampla pode romper autorização sem erro de parser."
  ],
  [
    "Como uma aprovação permanece ligada à proposta?",
    "Vincule identidade ou digest dos argumentos, principal e prazo; alteração exige nova decisão conforme contrato.",
    "Callback repetido, expirado ou sobre argumentos alterados não deve liberar efeito novo."
  ],
  [
    "Por que separar classes de erro?",
    "Invalidade pede recusa, limitação transitória pode pedir retry e efeito desconhecido pede investigação e consulta.",
    "Error workflow que repete tudo pode amplificar carga, vazar payload e duplicar comandos."
  ],
  [
    "Para que serve fixture com ordem invertida?",
    "Ela distingue referência por identidade de dependência acidental da posição, sem expor dados reais.",
    "Pinning de um único caminho feliz pode ocultar falhas de linking e não comprova produção."
  ],
  [
    "O que um mutante acrescenta ao teste?",
    "Demonstra que o oracle detecta a falha específica introduzida, como troca de tenant ou ausência de dedup.",
    "Um teste que aceita implementação boa e mutante igual não sustenta a garantia pretendida."
  ],
  [
    "Como distinguir wire de efeito?",
    "Wire descreve request recebido; ledger do destino confirma resultado. Ambos precisam identidade e origem da evidência.",
    "Transcript inventado não é HTTP observado, e status da execução não substitui confirmação externa."
  ],
  [
    "Quais campos ligam evidência ao exemplo?",
    "Revisão, runtime, digest do texto executado, oracle e resultado, além do escopo e gates pendentes.",
    "Alterar snippet depois do teste sem renovar evidência rompe o vínculo entre claim e execução."
  ],
  [
    "Como validar RBAC para publicação?",
    "Use principals com papéis diferentes e observe ação autorizada e negada na plataforma, incluindo dependências compartilhadas.",
    "Uma matriz local de roles não comprova enforcement real nem acesso correto à credential."
  ],
  [
    "Qual diferença existe entre rotação de credential e chave?",
    "Credential muda acesso no provedor; a chave protege persistência. Cada rotação exige compatibilidade e plano de recuperação próprios.",
    "Trocar chave mestra sem procedimento compatível pode tornar credentials ilegíveis e inviabilizar restore."
  ],
  [
    "Por que fixar versão e origem de nodes?",
    "Nodes executam código com capacidades; review, versão e lifecycle precisam integrar o inventário de dependências.",
    "Instalar latest de origem desconhecida ou permitir filesystem amplo no runner expande risco sem evidência."
  ],
  [
    "Por que allowlist de URL não prova proteção SSRF completa?",
    "Rede, redirects e resolução precisam enforcement e ensaio próprios; parser local cobre apenas sua regra de fixture.",
    "Host parecido, credential em URL ou destino indireto podem escapar de controles superficiais."
  ],
  [
    "Como comparar Cloud e self-hosted?",
    "Mapeie requisitos, capacidades efetivas, responsabilidades e esforço recorrente, verificando edição e destinos por ambiente.",
    "Escolher apenas custo de máquina e esquecer banco, backup e acesso cria operação sem dono."
  ],
  [
    "Qual janela de falha permanece com workers?",
    "Worker pode produzir efeito e morrer antes do ack; identidade e reconciliação continuam necessárias no destino.",
    "Mais workers não eliminam repetição e podem ampliar saturação de uma dependência compartilhada."
  ],
  [
    "Por que concorrência difere de quota?",
    "Cada execução pode emitir múltiplas chamadas; quota exige orçamento por dependência e coordenação entre executores.",
    "Contadores por processo multiplicam taxa global e uma fila ilimitada esconde incapacidade de admissão."
  ],
  [
    "Como construir SLO para resultado de negócio?",
    "Defina população admitida, prazo, resultados legítimos e desconhecidos, com fonte que observa efeito e lacunas de coleta.",
    "Contar somente execuções verdes omite pedidos perdidos e confunde recusa válida com falha."
  ],
  [
    "O que um export não demonstra sozinho?",
    "Ele conserva uma definição dentro de seu escopo; compatibilidade de nodes, credentials, estado e importação precisam evidência.",
    "Parser aprovado não prova round trip, publicação ou recuperação do serviço."
  ],
  [
    "O que isola ambientes além de Git?",
    "Destinos, principals, credentials, triggers e dados devem ter mapeamento explícito e verificável por ambiente.",
    "Staging com credential produtiva ou Schedule duplicado pode emitir efeitos reais após promoção aprovada."
  ],
  [
    "Por que rollback não desfaz efeitos?",
    "Retornar definição altera comportamento futuro; estado e efeitos passados exigem consulta, compensação ou reconciliação.",
    "Versão antiga incompatível com estado novo pode repetir trabalho ou falhar depois do retorno."
  ],
  [
    "Como demonstrar restore e RPO/RTO?",
    "Restaure conjunto necessário em isolamento, valide operação e ledger e meça perda e tempo com critérios definidos.",
    "Backup sem chave ou binary e simples retorno de imagem após migração não prova recuperação completa."
  ],
  [
    "Por que schema de IA não garante verdade?",
    "Forma correta pode citar identidade inexistente; valide domínio, fontes e autorização independentemente da geração.",
    "Confiança alta e JSON válido não autorizam efeito nem demonstram qualidade do modelo."
  ],
  [
    "Como autorizar uma tool de efeito?",
    "Use capacidade estreita e policy externa ao prompt, vinculando aprovação a argumentos, principal e prazo.",
    "Texto de uma ferramenta de leitura não concede permissão para escrita nem para alteração após aprovação."
  ],
  [
    "Por que filtrar tenant antes de ranking RAG?",
    "Relevância não concede acesso; apenas fontes autorizadas podem entrar no contexto e memória precisa chave de escopo.",
    "Fallback que remove filtro ou sessão sem tenant pode vazar documentos e histórico."
  ],
  [
    "Qual métrica impede score agregado enganoso?",
    "Avalie classes e falhas críticas com dataset e rubrica identificados, além de budget e fallback compatível com autorização.",
    "Acerto geral alto pode esconder tool indevida; fixtures locais não medem geração ou faturamento real."
  ],
  [
    "Qual identidade atravessa o workflow de reserva?",
    "CommandId estável no escopo autorizado liga entrada, decisão, consulta e evento; executionId identifica tentativa.",
    "Tenant escolhido pelo payload e chave nova em cada retry rompem autorização e deduplicação."
  ],
  [
    "Como provar última vaga, replay e evento?",
    "Observe uma confirmação, uma recusa, capacidade zero e ledger por comando e evento, com concorrência e falhas ensaiadas.",
    "Modelo serial não demonstra transação, outbox durável ou entrega pelo broker real."
  ],
  [
    "O que faz uma release ser observável?",
    "Vincule digest, revisão publicada, trace, resposta e ledger, com owners, consulta e critérios de interromper ou prosseguir.",
    "Pacote local verde sem caminho publicado nem correlação não prova operação produtiva."
  ],
  [
    "Quando a banca deve declarar recuperação incompleta?",
    "Quando componente ou gate obrigatório está Failed ou Pending, preserve limite e próxima ação com owner.",
    "Repetir comando de efeito conhecido ou chamar ausência de binary de restore completo fabrica uma garantia."
  ]
];
const SCENARIOS: [string,string][][] = [
  [
    [
      "Uma equipe conectou Input a Reserve e chama o grafo de concluído, embora o teste só tenha percorrido o ramo Reject. O draft mudou depois do review e a versão publicada é anterior. Explique quais evidências autorizariam anunciar a revisão produtiva e como separar grafo, teste e efeito.",
      "Verificar referências e ramos; identificar digest do draft testado e revisão publicada; executar entrada conhecida pelo caminho produtivo e consultar ledger. Conexão e teste de Reject não comprovam Reserve. Manter publicação e efeito Pending sem plataforma."
    ],
    [
      "O workflow recebe dois items e um arquivo Base64, copia entrada integral para logs e trata o array como um único objeto. O reviewer aprovou porque o parser aceitou JSON. Identifique riscos de forma, metadata e exposição e proponha oracles distintos para cada propriedade.",
      "Exigir envelope por item, conferir bytes/hash e metadata, projetar campos permitidos. Parser não valida domínio nem privacidade. Fixtures com dois items, byte zero, segredo sintético e campo ausente devem revelar as falhas."
    ],
    [
      "Uma expressão escolhe o primeiro cliente antes de um filtro e, depois, usa o primeiro output para emitir uma mensagem. Trace duas entradas em ordem invertida e uma entrada removida. Mostre como identidade e origem impedem associação incorreta e qual falha o teste deve detectar.",
      "Usar IDs de domínio e linking apropriado; fixture invertida mantém destinatário correto e filtro preserva origem. Oracle compara identidade do input autorizado com output, rejeitando escolha por índice e referência ausente."
    ]
  ],
  [
    [
      "Um Code node agrega quantidades e devolve apenas um número, enquanto o próximo node espera items com json e identidade. Discuta quando agregar é apropriado, qual contrato de saída deve ser escolhido e como limitar quantidade inválida e budget da coleção.",
      "Escolher agregação deliberada com envelope explícito e identidade do agregado; validar inteiros não negativos e total permitido. Testar vazio, múltiplos items, quantidade fracionária e excesso. Função local não prova helpers n8n."
    ],
    [
      "Dois ramos filtram clientes de forma diferente, mas Merge combina posição zero de cada array. Eles têm o mesmo tamanho e o teste feliz passou. Identifique o risco com IDs concretos, proponha join por chave e explique política para duplicatas e ausência.",
      "A ordem não prova correspondência; join usa ID validado, rejeita duplicatas e trata ausência conforme contrato. Reordenar ramo, remover cliente e duplicar chave devem falhar no oracle de associação e tenant."
    ],
    [
      "Uma entrada produz três tags e outra produz uma. Trace os quatro outputs, incluindo origem e campos projetados. Depois remova a primeira entrada por filtro e explique por que reindexar outputs como inputs rompe a referência e qual fixture demonstra a regressão.",
      "Expansão mantém pairedItem do input que gerou cada output; filtro não recria origem por posição. Projeção conserva ID/tag, retira secret. Oracle verifica mapa de origem antes e depois de filtro, sem afirmar motor executado."
    ]
  ],
  [
    [
      "Um job diário roda às 01:30 UTC, mas a equipe interpreta janela como dia de São Paulo e repete o trabalho manualmente. Explique escolha de timezone, identidade da janela e política de replay, distinguindo execução técnica de lote de negócio.",
      "Fixar timezone e calcular janela de domínio; deduplicar job+janela, permitindo janelas distintas. Instante fixo evidencia datas diferentes. Ensaio Schedule real verifica clock e execução; modelo não prova timer."
    ],
    [
      "Um webhook de teste aceita GET com texto, e o consumidor produtivo envia POST JSON com tenant arbitrário no corpo. O teste no editor é usado como prova de autenticação e publicação. Identifique os gates ausentes e proponha fixtures negativas.",
      "Validar método/media, schema/domínio e tenant do principal confiável. Confirmar caminho produtivo publicado e roteamento. Testar GET, mídia errada, tenant divergente e assinatura alterada; endpoint de teste não comprova enforcement."
    ],
    [
      "Um pedido é aceito com 202, o destino confirma a reserva e a resposta final se perde. O cliente repete a mesma chave com quantidade diferente. Trace estados, consulta e conflito de payload e diga o que pode ser comunicado sem inventar conclusão.",
      "202 só admite conforme contrato; timeout mantém desconhecido até consulta por commandId. Fingerprint da chave recusa payload diferente. Replay equivalente retorna decisão anterior e não consome novamente; ledger confirma efeito."
    ]
  ],
  [
    [
      "Uma integração monta query concatenando texto de busca com ampersand e só verifica status 200. Discuta construção da URL, credential de escopo correto e contrato de resposta, com exemplos de conteúdo que muda semântica quando não é codificado.",
      "Usar URLSearchParams para manter texto como valor; validar credential/destino em plataforma e schema/domínio da resposta. Testar ampersand, resposta sem items e status inesperado. Codificação local não prova wire ou acesso."
    ],
    [
      "A API devolve cursor anterior e o workflow pagina sem orçamento, repetindo calls após 429. O gráfico termina apenas quando recebe página vazia. Identifique loop e amplificação de carga, propondo condição de término, detecção e limites verificáveis.",
      "Guardar cursors visitados, validar página e limitar requests e prazo incluindo retries. Ciclo deve falhar explicitamente. Budget por dependência evita loop ilimitado; medir chamadas reais exige sandbox HTTP."
    ],
    [
      "Um download retorna bytes com zero e 255; a transformação converte para texto e envia de novo, enquanto timeout deixa upload incerto. Trace integridade, limite de arquivo e decisão de retry, separando metadata, conteúdo e efeito externo.",
      "Preservar bytes/encoding, comparar hash após round trip, validar tamanho/media. Timeout requer consulta conforme contrato antes de retry. Fixture byte zero/255 detecta conversão textual; upload real e streaming seguem gate próprio."
    ]
  ],
  [
    [
      "A consulta de reserva concatena identidade enviada pelo cliente e usa a primeira linha encontrada. Explique parâmetros e cardinalidade, incluindo zero e duas linhas, e diga qual autoridade precisa preservar a atualização concorrente da capacidade.",
      "Separar estrutura e parâmetros no node/driver; validar resultado único conforme domínio. Zero e múltiplos têm decisões explícitas. Autoridade transacional do destino confirma reserva; objeto local de query não executa SQL."
    ],
    [
      "Dois workflows leem uma vaga e usam IF para confirmar, com chaves diferentes. O reviewer argumenta que deduplicação resolve concorrência. Identifique o interleaving que viola capacidade e defina um oracle que reprova a implementação insegura.",
      "Ambos leem um antes de atualizar e confirmam duas; dedup só resolve repetição do mesmo comando. Operação consistente no destino deve garantir confirmado<=capacidade e saldo>=0, testada por clientes concorrentes reais."
    ],
    [
      "A decisão de reserva está gravada, mas o publicador marca evento entregue antes de enviá-lo e cai. Um cache sem tenant fornece disponibilidade antiga ao replay. Trace perda, consulta à autoridade e correções para outbox, consumidor e chave de cache.",
      "Marcar antes perde evento; intenção e decisão precisam persistência coerente, publicador confirma após envio e consumidor dedup. Cache inclui tenant/TTL e não autoriza reserva. Consulta ao ledger reconcilia comando; fixtures não provam durabilidade."
    ]
  ],
  [
    [
      "Um batch de três itens processa sete entradas; o checkpoint é gravado antes do efeito para evitar repetição. Discuta cobertura e janela de falha, propondo checkpoint e idempotência que evitem perda, com casos vazio, um e sete itens.",
      "Batches 3/3/1 cobrem sete; vazio sem loop e tamanho positivo. Checkpoint adiantado omite efeito após crash. Gravar depois do efeito reconhecido e dedup permite replay; ensaio real interrompe janela."
    ],
    [
      "Um sub-workflow recebe entrada integral e pode chamar qualquer destino, devolvendo string quando o pai espera objeto de confirmação. Identifique riscos de contrato e autorização e proponha testes de envelope, saída e capacidade do chamador.",
      "Contrato estreito de input/output, identidade e erro; projetar campos e restringir tool/destino por principal. Saída inesperada e tool não autorizada devem ser recusadas. Função local verifica regra, motor e acesso precisam ensaio."
    ],
    [
      "Uma execução espera aprovação de quantidade um até determinado horário; depois do prazo chega callback aprovando quantidade dois e o handler repete a ação. Trace validade, digest e estados de retomada, incluindo replay de callback e resultado desconhecido.",
      "Prazo controla pending/expired; digest vincula quantidade um, alteração recusa. Callback repetido não emite novo comando e estado concluído não retorna a pending. Resultado incerto consulta destino; Wait/canal nativo não foram exercitados."
    ]
  ],
  [
    [
      "A equipe usa uma única fixture pinada com cliente na primeira posição e chama a suíte de regressão completa. Explique como escolher casos de reorder, ausência, conflito e dados redigidos e que propriedades cada oracle deve verificar.",
      "Dataset cobre cardinalidade e identidade, com ordem invertida, filtro, duplicata e secret sintético. Oracles comparam domínio/efeito e redaction. Pinning ajuda desenvolvimento e não representa produção nem coverage universal."
    ],
    [
      "O teste confere apenas que output existe; uma implementação que troca tenant e outra que duplica efeito também passam. Identifique por que a evidência é fraca e construa mutantes e expectativas que tornem as duas falhas detectáveis.",
      "Comparar tenant autorizado e contar efeito por commandId; implementação correta passa, mutantes devem falhar nesses oracles. Detectar mutante demonstra sensibilidade específica, sem garantir ausência de todas as falhas."
    ],
    [
      "O relatório anexa transcript inventado de POST e status verde, mas não inclui ledger ou digest do snippet. Trace o pacote necessário para ligar texto executado, wire e efeito e delimite o que pode ser verificado sem HTTP real.",
      "Digest do texto, runtime, revisão e resultados ligam execução local. Wire real exige request observado; ledger confirma efeito. Transcript é fixture, não envio. Declarar integração e destino Pending, evitando falsa prova operacional."
    ]
  ],
  [
    [
      "Um reader consegue ver project e a equipe conclui que pode publicar o workflow. Uma credential de outro project foi referenciada no export. Explique matriz de papéis, sharing e dependências, com principals distintos para verificar ações permitidas e negadas.",
      "Visibilidade não concede publish nem credential; conferir matriz efetiva e ownership. Ensaiar reader negado e publisher permitido na plataforma, incluindo referência de outro project. Policy local não prova RBAC real."
    ],
    [
      "A rotação substitui N8N_ENCRYPTION_KEY sem preservar o valor antigo, instala node latest e deixa runner com filesystem aberto. Identifique riscos distintos de legibilidade, supply chain e capacidade, descrevendo plano compatível e gates operacionais.",
      "Não trocar chave mestra como rotina de credential; procedimento documentado e backup/chave compatíveis. Fixar origem/versão e reduzir capacidades do runner. Testar leitura, recuperação e enforcement; manifesto não executa isolamento."
    ],
    [
      "Uma URL permitida redireciona para rede privada e o workflow registra payload com email e token em histórico acessível. Trace controles de destino, redaction, retenção e audit, distinguindo parser local de proteção SSRF e acesso reais.",
      "Validar destino incluindo redirects/DNS no enforcement disponível e rede; projetar dados, restringir history e revisar retenção. Testes reais precisam destinos isolados e principals. Allowlist simples não cobre topologia nem prova privacidade."
    ]
  ],
  [
    [
      "O time escolheu self-hosted pelo preço de uma máquina, embora precise API privada, backup e operação por outra pessoa. Explique a matriz de requisitos, responsabilidades e destinos de sandbox, com decisão revisável e critérios de mudança.",
      "Mapear capacidades efetivas, edição, rede, banco, chave e owner; comparar esforço recorrente. Separar destinos e principals por ambiente. Manifestos fictícios apoiam decisão, sem atestar oferta ou implantação."
    ],
    [
      "Um worker envia reserva e morre antes do ack; a equipe aumenta workers e usa contador de quota em cada processo. Identifique duplicação e excesso de taxa e defina dedup, reconciliação e coordenação de orçamento.",
      "Efeito antes do ack exige identidade e consulta/dedup; mais workers não corrige janela. Budget compartilhado inclui chamadas/retries. Ensaiar crash e carga em serviços reais; fila sequencial não prova coordenação."
    ],
    [
      "Dashboard soma somente execuções concluídas, enquanto fila cresce e clientes expiram. Trace população, idade da fila, resultado desconhecido e resposta de backpressure. Diga quais eventos e consultas permitem medir impacto sem copiar segredo ou dado pessoal.",
      "Denominador inclui admitidos, prazo e estados conhecidos/unknown; medir idade e taxa. Admissão limitada comunica recusa temporária. Eventos mínimos ligam comando/tentativa/resultado e coleta tem lacunas explícitas; paging exige teste real."
    ]
  ],
  [
    [
      "Um export JSON passa parser e é enviado ao ambiente seguinte como backup completo. Discuta inventário, revisão por digest e importação, incluindo credential, node version e binary, e quais conclusões são legítimas antes de existir motor alvo.",
      "Export conserva definição no escopo; inventariar dependências e estado. Parser/grafo local não prova import ou restore. Digest vincula artefato revisto, motor e operação controlada são gates Pending."
    ],
    [
      "Source control promove um workflow para staging com credential produtiva e Schedule ativo em dois ambientes. Identifique por que review Git não garantiu isolamento e proponha mapeamento explícito, bloqueio de entrada e reconciliação dos efeitos já emitidos.",
      "Separar destinos/principals/triggers; mapeamento sem substituição ampla. Desativar duplicidade, consultar ledger e reconciliar efeitos. Promoção exige revisão, validação e publicação distintas, com ensaio da integração nativa."
    ],
    [
      "A versão nova emite evento com campo adicional e migra armazenamento; a equipe retorna imagem antiga e restaura só workflow. Trace rollback de definição, compatibilidade de estado, backup completo e medição de recuperação com operação conhecida.",
      "Retorno de imagem não desfaz migração nem efeitos. Restaurar conjunto compatível com banco/chave/binary/config e consultar ledger externo. Isolar triggers e medir RPO/RTO até capacidade acordada; modelo não é restore real."
    ]
  ],
  [
    [
      "O modelo devolve JSON válido com recurso inventado e confiança alta. Explique schema, domínio, fontes e limite de contexto e escolha uma decisão que preserve autorização sem tratar prompt ou confiança como evidência de verdade.",
      "Validar enum/tipos e identidade em conjunto autorizado; fonte e contexto são necessários. Falta/ambiguidade pede review, efeito bloqueado. Modelo/provedor precisam avaliação real, parser local só confirma sua regra."
    ],
    [
      "Uma tool de leitura retorna instrução para cancelar reservas, e uma aprovação de quantidade um é usada para executar quantidade dois. Identifique fronteiras de autorização, capacidades estreitas e vínculo de proposta, com testes negativos para ambos os casos.",
      "Conteúdo da tool é dado, não autorização. Policy externa restringe efeito por papel; digest/principal/prazo vinculam aprovação. Alteração recusa e callback dedup; agent/canal nativo precisam ensaio."
    ],
    [
      "Dois tenants compartilham memória atendimento; retrieval escolhe documento estrangeiro com score maior. Trace filtro anterior ao ranking, chave de sessão e avaliação por classe, incluindo fallback por budget que preserve acesso e ausência de efeito.",
      "Filtrar tenant autorizado antes de ranking; chave tenant+sessão e versão/validade. Dataset inclui vazamento/ausência e métrica crítica impede release. Fallback sem efeito e sem retirar filtro; geração/custo real Pending."
    ]
  ],
  [
    [
      "O integrador gera commandId novo em retry e responde confirmado assim que admite entrada, usando tenant do payload. Explique o contrato correto de autorização, identidade e estados, com consulta após timeout e expectativas de release revisável.",
      "Principal confiável determina tenant; commandId estável com fingerprint; aceito difere de confirmado. Timeout consulta ledger e mantém unknown. Pacote liga revisão/gates/owners, sem chamar modelos de publicação real."
    ],
    [
      "A última vaga foi confirmada duas vezes por comandos distintos e um evento foi duplicado após crash. O relatório chama a execução serial local de prova de banco e broker. Identifique invariáveis, autoridades e escopos de evidência que precisam ser corrigidos.",
      "Capacidade exige decisão consistente no destino e clientes concorrentes; comandos e eventos têm identidades próprias. Dedup consumidor cobre replay, não disputa. Corrigir claims: modelo local verificado, banco/outbox/broker Pending."
    ],
    [
      "Backup anterior omite conclusão de reserva que consta no ledger externo e perdeu arquivo binary; o trace usa outro commandId. Trace investigação, reconciliação, retomada e banca final, indicando gates Failed ou Pending e critérios para declarar recuperação incompleta.",
      "Correlacionar fontes, consultar efeito conhecido e impedir replay cego. Binary faltante impede restore completo; trace divergente falha. Retomada isolada, operação conhecida e medição exigem ambiente real; relatório nomeia limite e owner."
    ]
  ]
];
const titles = N8N_CURRICULUM.flatMap(chapter=>chapter.sections);
if(REVIEWS.length!==48||SCENARIOS.length!==12||SCENARIOS.some(rows=>rows.length!==3)) throw new Error("N8N: assessments incompletos");
export const N8N_REVIEW: Record<string,Review> = Object.fromEntries(titles.map((title,index)=>[title,REVIEWS[index]]));
export const N8N_CARDS: ContentSource["cards"] = N8N_CURRICULUM.flatMap(chapter=>chapter.sections.map(title=>({nodeTitle:chapter.title,frontMd:N8N_REVIEW[title][0],backMd:N8N_REVIEW[title][1]})));
export const N8N_EXERCISES: ContentSource["exercises"] = N8N_CURRICULUM.flatMap((chapter,index)=>SCENARIOS[index].map(([promptMd,answerKeyMd],position)=>({nodeTitle:chapter.title,type:([2,3,5] as const)[position],level:chapter.level==="basico"?"beginner" as const:chapter.level==="intermediario"?"intermediate" as const:"advanced" as const,promptMd,answerKeyMd,points:3})));

