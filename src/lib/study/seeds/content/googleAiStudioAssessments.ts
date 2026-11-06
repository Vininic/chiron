import type { ContentSource } from "./types";
import { GOOGLE_AI_STUDIO_CURRICULUM } from "./googleAiStudioCurriculum";
type Review=[question:string,answer:string,failure:string];
export const GOOGLE_AI_STUDIO_REVIEW: Record<string,Review> = {
  "Playground, Build e produto da experiência": [
    "Como distinguir experimento de prompt de aplicação operacional?",
    "Identifique produto esperado e método de prova; resposta, arquivos, preview e efeito persistido sustentam conclusões distintas conforme o contrato.",
    "Uma demonstração anuncia reserva concluída sem recibo persistido."
  ],
  "Projeto, chave e identidade da execução": [
    "Que identidade precisa acompanhar uma chamada de experimento?",
    "Projeto pertinente, modelo, configuração e base do consumidor delimitam a observação; conserve identificadores úteis sem registrar a credencial.",
    "Um resultado de homologação é anunciado como execução de produção."
  ],
  "Critério de resposta e conjunto de casos": [
    "O que um critério de resposta precisa separar?",
    "Formato, fidelidade ao dado e condição de domínio devem ter expectativas independentes e casos discriminantes, incluindo ambiguidade e informação insuficiente.",
    "O assistente inventa item porque a avaliação não contém essa condição."
  ],
  "Exportação Get code e configuração preservada": [
    "O que conferir depois de usar Get code?",
    "Compare configurações, API, SDK e consumidor e execute o contrato final; trecho exportado e compilação não provam resposta equivalente ou efeito autorizado.",
    "O consumidor perde o contrato estruturado usado no Playground."
  ],
  "System instruction e dado do usuário": [
    "Qual limite existe numa system instruction?",
    "Ela orienta comportamento e composição do prompt, mas não substitui autorização do efeito; origem dos dados e política do backend devem permanecer separadas.",
    "O pedido do usuário é promovido a instrução privilegiada."
  ],
  "Few-shot e rótulo fora do exemplo": [
    "Como evitar uma avaliação favorecida pelos exemplos do prompt?",
    "Separe demonstração e avaliação por identidade e conteúdo pertinente e mantenha rótulos fora da entrada de teste; ausência de IDs repetidos não esgota independência.",
    "A métrica conta uma resposta já demonstrada como generalização."
  ],
  "Histórico com ordem e papéis conservados": [
    "O que precisa ser preservado ao continuar uma conversa?",
    "Ordem, papéis, relações e partes exigidas pelo método da API devem permanecer; continuidade de histórico não implica herança de toda configuração do turno.",
    "A correção de quantidade aparece antes da proposta a que se refere."
  ],
  "Parâmetros do ensaio e comparação justa": [
    "Como atribuir uma diferença de resultado a uma mudança de prompt?",
    "Controle e registre condições pertinentes ou declare mudança conjunta; parâmetros baixos não garantem determinismo e campos iguais não esgotam comparabilidade.",
    "Uma melhora é atribuída ao prompt apesar de outra temperatura."
  ],
  "Capacidade do modelo e tarefa elegível": [
    "Como selecionar modelo sem depender de um nome familiar?",
    "Relacione tarefa, capacidades, limites e caminho de API com documentação atual e ensaio discriminante; elegibilidade não equivale a qualidade do resultado.",
    "O consumidor usa um caminho sem a entrada de imagem necessária."
  ],
  "Reserva de saída e janela de contexto": [
    "O que incluir num planejamento de contexto?",
    "Considere requisição completa, reserva de saída e limites específicos do caminho; contagem nativa e observação de término complementam o orçamento local.",
    "O planejamento ocupa o espaço que deveria preservar para a resposta."
  ],
  "Contagem de tokens e estimativa de texto": [
    "Quando uma estimativa de tokens pode ser usada como contagem?",
    "Ela permanece estimativa; decisão de limite exige método nativo sobre a requisição final e campos de uso pertinentes, com unidade e caminho identificados.",
    "O consumidor relata 50 como contagem apesar de medidas que totalizam 65."
  ],
  "Cache de contexto e validade da base": [
    "Por que cache válido no tempo ainda pode ser inadequado?",
    "Revisão, escopo e conteúdo precisam corresponder ao contrato atual; disponibilidade ou hit não garantem verdade comercial nem autorização.",
    "Um catálogo antigo é usado como saldo atual da reserva."
  ],
  "JSON válido e semântica ainda inválida": [
    "Que validação continua necessária depois de structured output?",
    "Parsing e forma não substituem significado, relação com a fonte e autorização do efeito; o consumidor deve validar domínio e estados do retorno antes de escrever.",
    "Uma quantidade negativa é aceita porque a resposta é JSON válido."
  ],
  "Enum, campo ausente e valor desconhecido": [
    "Como representar informação insuficiente numa saída estruturada?",
    "Defina estados, presença e null com significado explícito e trate cada um no consumidor; não invente quantidade nem promova proposta incompleta a execução.",
    "O consumidor confunde desconhecido com campo ausente e fabrica um default."
  ],
  "Relação entre item, quantidade e fonte": [
    "Que relação falta numa validação apenas de formato?",
    "Identidade, escopo e valores da fonte precisam corresponder à proposta e à operação; estrutura correta ou saldo isolado não autoriza o recurso.",
    "A reserva de A usa saldo disponível de B como prova."
  ],
  "Fragmento de saída e documento completo": [
    "Quando uma saída transmitida por partes pode virar proposta válida?",
    "Após montagem e término pertinentes, valide parsing, forma e domínio; fragmento ou reparo heurístico não demonstra conclusão nem autoriza efeito.",
    "Um fragmento incompleto dispara uma reserva."
  ],
  "MIME, bytes e representação base64": [
    "O que base64 comprova sobre uma entrada multimodal?",
    "A codificação representa bytes quando interpretada corretamente; não comprova MIME, autenticidade, conteúdo válido ou leitura pelo modelo.",
    "O consumidor envia os caracteres da codificação em vez dos bytes previstos."
  ],
  "Arquivo pronto e referência ainda processando": [
    "Qual condição falta depois de receber uma referência de upload?",
    "Prontidão, validade e escopo do recurso devem ser observados pelo método atual; URI existente não prova processamento nem qualidade da análise.",
    "O consumidor usa um arquivo que ainda está sendo processado."
  ],
  "Trecho de áudio e unidade temporal": [
    "Que informação deve acompanhar um trecho de áudio analisado?",
    "Fonte, intervalo, unidade e condições de seleção precisam ser explícitos; conversão correta não atesta transcrição, falante ou percepção do modelo.",
    "A correção de voz é associada a um intervalo errado."
  ],
  "Quadros de vídeo e cobertura do intervalo": [
    "Por que quadros observados não sustentam qualquer conclusão sobre um vídeo?",
    "Seleção e cobertura temporal limitam a observação; eventos entre quadros e processamento do modelo exigem prova com referência independente e método identificado.",
    "O relatório inclui um quadro fora do trecho solicitado."
  ],
  "Declaração de função e argumento validado": [
    "Quem executa e autoriza uma função proposta pelo modelo?",
    "O consumidor valida nome e argumentos e aplica autorização antes do efeito; declaração e proposta do modelo não substituem o contrato da aplicação.",
    "Uma proposta aciona execução de reserva fora do dispatcher permitido."
  ],
  "Identidade de chamada e retorno correspondente": [
    "Como relacionar retornos de ferramentas paralelas?",
    "Use identidade e partes do protocolo e valide correspondência e ausência; posição ou plausibilidade do texto não sustentam a relação com o recurso.",
    "O saldo de B é atribuído ao item A."
  ],
  "Chamadas paralelas e efeitos dependentes": [
    "Quando chamadas podem ser executadas em paralelo?",
    "Somente quando relações e efeitos permitem independência; autorização e resultados condicionantes precisam anteceder ações dependentes, e concorrência durável exige prova própria.",
    "A reserva começa antes de concluir autorização."
  ],
  "Assinaturas opacas e continuidade do turno": [
    "Como tratar uma assinatura opaca no histórico?",
    "Preserve partes pelo método documentado e não interprete ou fabrique assinatura; conservação local não valida autenticidade nem compatibilidade de uma API real.",
    "O consumidor perde a parte exigida para continuar o turno."
  ],
  "Fonte citada e suporte da afirmação": [
    "O que revisar numa resposta com grounding?",
    "Afirmação, trecho, fonte, atualidade e escopo precisam se relacionar; link ou confiança não provam suporte universal nem autorizam efeito comercial.",
    "Uma citação de catálogo é usada para justificar saldo que a fonte não informa."
  ],
  "URL Context e endereço permitido": [
    "Como conferir a identidade de uma referência URL?",
    "Faça parsing e aplique política de protocolo e host pertinentes, além de revisar redirects, acesso e conteúdo; prefixo textual e URL permitida não conferem autoridade.",
    "Um domínio parecido entra como catálogo autorizado."
  ],
  "File Search e identidade do documento": [
    "O que relevância de um trecho recuperado não comprova?",
    "Relevância não garante identidade, atualidade ou acesso; documento, revisão, escopo e conteúdo precisam de conferência pelo método de recuperação e domínio.",
    "Uma ficha antiga sustenta a proposta atual de reserva."
  ],
  "Code execution e efeito fora do cálculo": [
    "Qual limite existe numa prova de code execution?",
    "Ela cobre código, dados e resultado observados naquele runtime; cálculo correto não certifica fonte comercial nem execução de reserva ou efeito externo.",
    "O total é subestimado porque a quantidade foi ignorada."
  ],
  "Bloqueio de prompt e ausência de candidato": [
    "Como tratar um retorno sem candidato utilizável?",
    "Interprete metadados pelo caminho de API e diferencie bloqueio, erro e vazio; não fabrique proposta ou reduza controles para produzir aparência de sucesso.",
    "O consumidor apresenta bloqueio como resposta vazia normal."
  ],
  "Finish reason e resposta não concluída": [
    "Por que conferir motivo de término além do texto?",
    "Saída presente pode ser parcial ou bloqueada; mapeie status do protocolo e valide contrato somente após conclusão pertinente, conservando estados desconhecidos.",
    "Uma proposta truncada é aceita como final."
  ],
  "Dados mínimos e projeção do log": [
    "Como registrar uma falha sem copiar todo o experimento?",
    "Defina campos e origem por propósito e revise logs automáticos e política remota; projeção local minimiza dados, mas não atesta retenção ou anonimização universal.",
    "A chave e o prompt privado entram no relatório de erro."
  ],
  "Prompt injection e autorização do ator": [
    "Qual controle precisa sobreviver a uma proposta induzida por texto externo?",
    "Autorização do ator, recurso e operação deve anteceder o efeito no backend, independentemente da resposta do modelo ou da organização do prompt.",
    "Uma proposta de reserva atravessa tenants porque a ação era conhecida."
  ],
  "API e versão do envelope observado": [
    "O que conferir antes de interpretar uma resposta por SDK?",
    "Família de API, versão do SDK e contrato do envelope precisam corresponder ao adaptador; campo ausente não deve virar resposta vazia sem interpretação do estado.",
    "Um retorno de Interactions é interpretado pelo decoder de GenerateContent."
  ],
  "Stream por partes e UTF-8 dividido": [
    "Por que fragmentos de transporte não devem ser tratados como textos independentes?",
    "Bytes podem dividir caracteres e eventos; use decodificação e enquadramento pertinentes e confira conclusão antes de interpretar conteúdo ou executar efeito.",
    "Um nome com acento é corrompido pelo consumidor do stream."
  ],
  "Rate limit e janela de retry": [
    "O que uma política de retry precisa conservar?",
    "Motivo, unidade, janela do protocolo, teto de tentativas e condição de efeito devem orientar recuperação; espera local não prova quota ou sucesso futuro.",
    "O consumidor repete antes da janela pertinente do serviço."
  ],
  "Live API e sessão com geração distinta": [
    "Como evitar que um evento antigo atualize uma experiência Live?",
    "Conserve identidade e estado do protocolo e aplique eventos somente à sessão e intenção pertinentes; texto recebido não prova continuidade ou cancelamento de efeito.",
    "A intenção anterior reaparece depois da reconexão."
  ],
  "Runtime server e segredo fora do client": [
    "Qual fronteira protege a chave numa aplicação Build?",
    "Valor privilegiado deve permanecer no runtime server e fora de artefatos e respostas client; revisão do consumidor e autorização do endpoint continuam necessárias.",
    "Uma chave é incorporada ao client apesar do nome esperado."
  ],
  "Firebase e recurso ligado à identidade": [
    "O que falta além de adicionar login e banco ao app?",
    "Regras e código de acesso precisam relacionar identidade, recurso e operação e ser testados diretamente; provisionamento e UI não demonstram autorização comercial.",
    "Um usuário autenticado lê o recurso de outro proprietário."
  ],
  "GitHub, ZIP e base realmente sincronizada": [
    "O que conferir depois de sincronizar ou exportar uma aplicação?",
    "Base, branch, revisão consumida e dependências do destino precisam ser observadas; código disponível e teste local não atestam outra superfície automaticamente.",
    "A correção r8 é anunciada a partir de app que executa r7."
  ],
  "Publicação Cloud Run e estado do destino": [
    "O que falta entre iniciar deploy e confirmar entrega?",
    "Artefato, configuração, readiness e jornada no destino precisam de observação e alcance autorizado; estado de preview ou revisão isolada não prova operação pública.",
    "O serviço é anunciado pronto enquanto ainda está starting."
  ],
  "Dataset e divisão sem vazamento": [
    "Como uma divisão de dataset pode vazar sem repetir IDs?",
    "Paráfrases e grupos relacionados podem atravessar os conjuntos; revise identidade e conteúdo pelo objetivo e preserve avaliação não usada para ajuste.",
    "A métrica mede variantes de uma família já utilizada no ajuste."
  ],
  "Métrica por grupo e erro escondido na média": [
    "Por que relatar taxa por grupo além da média?",
    "Condições importantes podem falhar apesar de média favorável; conserve critérios, contagens e estados de saída e analise cada grupo pertinente ao produto.",
    "A avaliação esconde que nenhum caso ambíguo foi tratado corretamente."
  ],
  "Resultado unknown e reconciliação de efeito": [
    "Como recuperar uma chamada interrompida que pode ter escrito?",
    "Conserve identidade e estado unknown, consulte resultado confirmado e aplique idempotência antes de repetir; cancelamento de espera não reverte efeito remoto.",
    "Uma reserva já confirmada é duplicada após timeout."
  ],
  "Mudança de modelo e regressão do contrato": [
    "Que evidência precisa acompanhar uma troca de modelo?",
    "Protocolo, capacidades e dataset pertinente devem ser reavaliados na configuração alvo; aprovação de outro modelo não sustenta contrato final automaticamente.",
    "A migração é aprovada com um teste que só rodou no modelo antigo."
  ],
  "Proposta de reserva e decisão autorizada": [
    "Qual papel do modelo na reserva integradora?",
    "Ele pode propor e explicar, enquanto o serviço valida identidade, domínio e estado antes do efeito; proposta pronta não equivale a decisão autorizada.",
    "Uma proposta do modelo confirma reserva em outro tenant."
  ],
  "Intenção repetida com conteúdo divergente": [
    "Como tratar repetição de identidade com conteúdo diferente?",
    "Defina conflito por projeção de domínio e conserve resultado e escopo; fingerprint local não substitui autorização, persistência ou coordenação com o efeito.",
    "O recibo de duas unidades é reutilizado para a intenção de uma."
  ],
  "Quantidade confirmada e estoque preservado": [
    "Que prova sustenta conservação de estoque no integrador?",
    "Resposta, recibos e estado confirmado devem respeitar o domínio, incluindo insuficiência e disputa real; transição serial define regra, mas não atesta atomicidade durável.",
    "A reserva confirma duas unidades e deixa saldo negativo."
  ],
  "Handoff de evidência e Lab Ágora": [
    "O que um handoff verificável conserva?",
    "Artefato, base, método, resultado e limite devem permitir retomada; cada afirmação fica no alcance observado e gates ausentes ou de outra revisão permanecem distintos.",
    "Um gate antigo é promovido a aprovação do trabalho final."
  ]
};
const SCENARIOS: [string,string][][] = [
  [
    [
      "No trabalho de Google AI Studio e contrato do experimento, contrato exige source preview persistedReceipt e só há source preview. O agente propõe aprovar a aplicação quando existe preview. Determine a saída correta, identifique a regra violada e explique como a condição preview pronta não comprova efeito persistido afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "persistedReceipt é a lacuna. Regra: Identifique produto esperado e método de prova; resposta, arquivos, preview e efeito persistido sustentam conclusões distintas conforme o contrato. Correção: listar artefatos de aplicação ainda ausentes. Recuperação: completar o backend ou limitar a mensagem ao alcance demonstrativo. Ensaio nativo: abrir Playground ou Build pertinente e verificar o produto e efeito. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Google AI Studio e contrato do experimento, mesmo modelId m-eval em projectId p-test e p-live. O agente propõe comparar só modelId. Determine a saída correta, identifique a regra violada e explique como a condição modelo igual não identifica a conta ou projeto usados afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "projectId é a diferença conhecida. Regra: Projeto pertinente, modelo, configuração e base do consumidor delimitam a observação; conserve identificadores úteis sem registrar a credencial. Correção: comparar projeto e modelo da execução. Recuperação: alinhar a condição ou limitar o relato ao ambiente observado. Ensaio nativo: conferir projeto e autenticação da chamada sem revelar a chave. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Google AI Studio e contrato do experimento, dataset cobre knownItem missingQty e falta unknownItem. O agente propõe aceitar qualquer dataset com pelo menos dois casos. Determine a saída correta, identifique a regra violada e explique como a condição dois casos fáceis não representam a condição de item inexistente afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "unknownItem é a lacuna. Regra: Formato, fidelidade ao dado e condição de domínio devem ter expectativas independentes e casos discriminantes, incluindo ambiguidade e informação insuficiente. Correção: identificar condições obrigatórias não representadas. Recuperação: acrescentar caso discriminante e revisar rótulos e métricas. Ensaio nativo: executar dataset revisado com modelo e configuração identificados. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Instruções, exemplos e conversa, orientação propor sem executar e pedido reservar A. O agente propõe colocar pedido também como system. Determine a saída correta, identifique a regra violada e explique como a condição dado atual não deve ganhar autoridade de orientação recorrente afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "os papéis são system e user. Regra: Ela orienta comportamento e composição do prompt, mas não substitui autorização do efeito; origem dos dados e política do backend devem permanecer separadas. Correção: conservar orientação em system e pedido em user no envelope didático. Recuperação: separar origem e proteger o serviço antes da escrita. Ensaio nativo: conferir composição nativa e testar proposta e autorização separadamente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Instruções, exemplos e conversa, fewShotIds e1 e2 e evaluationIds e2 e3. O agente propõe declarar ausência de vazamento quando há few-shot. Determine a saída correta, identifique a regra violada e explique como a condição caso demonstrado não mede generalização independente afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "e2 é o vazamento. Regra: Separe demonstração e avaliação por identidade e conteúdo pertinente e mantenha rótulos fora da entrada de teste; ausência de IDs repetidos não esgota independência. Correção: listar IDs compartilhados entre demonstração e avaliação. Recuperação: refazer a divisão e revisar paráfrases e grupos relacionados. Ensaio nativo: executar avaliação sem exemplos ou rótulos vazados. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Instruções, exemplos e conversa, turnos com sequence três um dois e papéis user user model. O agente propõe ordenar alfabeticamente pelo papel. Determine a saída correta, identifique a regra violada e explique como a condição agrupamento por papel altera a sequência de decisões afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "pedido, proposta e correção aparecem nessa ordem. Regra: Ordem, papéis, relações e partes exigidas pelo método da API devem permanecer; continuidade de histórico não implica herança de toda configuração do turno. Correção: ordenar por sequence e conservar role e text. Recuperação: reconstruir sequência e relações e repetir o caso. Ensaio nativo: continuar conversa pelo método documentado e conferir configuração atual. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Modelos, tokens e orçamento, tarefa exige imageInput structuredOutput e só há structuredOutput. O agente propõe aceitar qualquer conjunto não vazio de capacidades. Determine a saída correta, identifique a regra violada e explique como a condição uma capacidade disponível não cobre toda a tarefa multimodal afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "imageInput é a lacuna. Regra: Relacione tarefa, capacidades, limites e caminho de API com documentação atual e ensaio discriminante; elegibilidade não equivale a qualidade do resultado. Correção: listar capacidades requeridas ausentes. Recuperação: selecionar caminho compatível ou explicitar redução de escopo. Ensaio nativo: conferir catálogo atual e executar entrada multimodal pertinente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Modelos, tokens e orçamento, window 1000 input 600 outputReserve 200 margin 50. O agente propõe omitir outputReserve do cálculo. Determine a saída correta, identifique a regra violada e explique como a condição entrada que cabe sozinha pode não conservar saída planejada afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "restam 150 unidades do orçamento. Regra: Considere requisição completa, reserva de saída e limites específicos do caminho; contagem nativa e observação de término complementam o orçamento local. Correção: subtrair entrada reserva de saída e margem. Recuperação: reduzir contexto pertinente ou ajustar saída pelo contrato de capacidade. Ensaio nativo: contar requisição final e observar uso e término no modelo escolhido. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Modelos, tokens e orçamento, contagens instruction 10 history 40 input 15 e chars 200. O agente propõe usar chars dividido por quatro como contagem. Determine a saída correta, identifique a regra violada e explique como a condição chars dividido por quatro é estimativa de outro método afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o total fornecido é 65 tokens. Regra: Ela permanece estimativa; decisão de limite exige método nativo sobre a requisição final e campos de uso pertinentes, com unidade e caminho identificados. Correção: somar contagens observadas declaradas sem heurística de caracteres. Recuperação: corrigir a unidade e recalcular orçamento com medidas pertinentes. Ensaio nativo: usar contagem nativa e conferir usage da requisição final. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Saída estruturada e contrato de domínio, texto JSON com itemId A e qty -1. O agente propõe marcar todo JSON parseável como valid. Determine a saída correta, identifique a regra violada e explique como a condição JSON legível ainda pode violar o domínio afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "parsed true e valid false. Regra: Parsing e forma não substituem significado, relação com a fonte e autorização do efeito; o consumidor deve validar domínio e estados do retorno antes de escrever. Correção: parsear e validar quantidade inteira positiva. Recuperação: validar domínio e manter escrita ausente no caso inválido. Ensaio nativo: configurar schema e testar resposta e rejeição no consumidor. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Saída estruturada e contrato de domínio, objeto contém qty null. O agente propõe usar truthiness para decidir missing. Determine a saída correta, identifique a regra violada e explique como a condição null não é ausência de campo nem zero fornecido afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o estado é unknown. Regra: Defina estados, presença e null com significado explícito e trate cada um no consumidor; não invente quantidade nem promova proposta incompleta a execução. Correção: distinguir propriedade ausente de valor null declarado. Recuperação: corrigir estados e pedir esclarecimento pelo contrato. Ensaio nativo: testar schema e consumidor com ausência null zero e valor válido. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Saída estruturada e contrato de domínio, proposta item A qty 2 e fonte item B stock 10. O agente propõe comparar somente qty com stock. Determine a saída correta, identifique a regra violada e explique como a condição saldo de B não sustenta reserva de A afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a proposta não é autorizada pela fonte recebida. Regra: Identidade, escopo e valores da fonte precisam corresponder à proposta e à operação; estrutura correta ou saldo isolado não autoriza o recurso. Correção: exigir identidade do item e saldo suficiente. Recuperação: buscar item correto e revalidar antes da escrita. Ensaio nativo: consultar fonte autorizada e verificar relação e estado da reserva. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Entradas multimodais e arquivos, base64 AQID. O agente propõe decodificar a string como utf8. Determine a saída correta, identifique a regra violada e explique como a condição texto base64 e bytes UTF-8 do texto são representações distintas afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "os bytes são 1 2 3. Regra: A codificação representa bytes quando interpretada corretamente; não comprova MIME, autenticidade, conteúdo válido ou leitura pelo modelo. Correção: decodificar base64 para os bytes originais. Recuperação: corrigir codificação e MIME pelo método da API escolhida. Ensaio nativo: enviar arquivo sintético válido e conferir representação e retorno. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Entradas multimodais e arquivos, arquivo tem uri synthetic-file e state PROCESSING. O agente propõe aceitar qualquer uri não vazia. Determine a saída correta, identifique a regra violada e explique como a condição referência existente não comprova processamento concluído afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o arquivo ainda não é elegível. Regra: Prontidão, validade e escopo do recurso devem ser observados pelo método atual; URI existente não prova processamento nem qualidade da análise. Correção: exigir estado ACTIVE para uso no contrato. Recuperação: aguardar ou tratar falha conforme estado e prazo pertinentes. Ensaio nativo: enviar arquivo de teste e acompanhar estado pela Files API. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Entradas multimodais e arquivos, startMs 1500 e endMs 3000. O agente propõe devolver milissegundos como segundos. Determine a saída correta, identifique a regra violada e explique como a condição mesmos números em unidade diferente selecionam outro trecho afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o intervalo é 1.5 a 3 segundos. Regra: Fonte, intervalo, unidade e condições de seleção precisam ser explícitos; conversão correta não atesta transcrição, falante ou percepção do modelo. Correção: converter milissegundos para segundos. Recuperação: corrigir unidade e repetir somente o trecho pertinente. Ensaio nativo: analisar áudio de teste com intervalo documentado e conferir saída. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Function calling e execução de ferramentas, nome executeReservation e qty 2, mas contrato permite proposeReservation. O agente propõe verificar qty sem conferir o nome. Determine a saída correta, identifique a regra violada e explique como a condição argumento válido não autoriza uma função de efeito diferente afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a chamada não é aceita pelo dispatcher declarado. Regra: O consumidor valida nome e argumentos e aplica autorização antes do efeito; declaração e proposta do modelo não substituem o contrato da aplicação. Correção: exigir função permitida e quantidade inteira positiva. Recuperação: restringir nome argumentos e efeito antes da execução. Ensaio nativo: testar function calling e dispatcher com chamada não permitida. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Function calling e execução de ferramentas, calls cA cB e retornos cB stock9 seguido de cA stock1. O agente propõe associar retorno pelo índice da lista. Determine a saída correta, identifique a regra violada e explique como a condição ordem de chegada não define identidade do resultado afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "A recebe um e B recebe nove. Regra: Use identidade e partes do protocolo e valide correspondência e ausência; posição ou plausibilidade do texto não sustentam a relação com o recurso. Correção: associar retorno pelo ID da chamada. Recuperação: preservar IDs e tratar retorno ausente sem fabricar resultado. Ensaio nativo: executar chamadas independentes e conferir associação no próximo turno. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Function calling e execução de ferramentas, price sem dependência e reserve depende de auth, done vazio. O agente propõe considerar todas as tarefas prontas. Determine a saída correta, identifique a regra violada e explique como a condição reserve não deve preceder auth afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente price está pronta. Regra: Somente quando relações e efeitos permitem independência; autorização e resultados condicionantes precisam anteceder ações dependentes, e concorrência durável exige prova própria. Correção: selecionar só tarefas cujas dependências foram concluídas. Recuperação: conservar dependências e impedir efeito sem condição concluída. Ensaio nativo: testar orquestração com dependência falha e efeitos observados. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Grounding, busca e execução de código, c-stock possui referência com supports false. O agente propõe aceitar qualquer referência do claim. Determine a saída correta, identifique a regra violada e explique como a condição link presente não demonstra relação com a afirmação afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "c-stock continua sem suporte. Regra: Afirmação, trecho, fonte, atualidade e escopo precisam se relacionar; link ou confiança não provam suporte universal nem autorizam efeito comercial. Correção: exigir evidência explicitamente marcada como suporte do claim. Recuperação: corrigir afirmação ou explicitar insuficiência de suporte. Ensaio nativo: executar grounding e revisar afirmações e trechos com referência independente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Grounding, busca e execução de código, https://catalog.example.attacker.example/items. O agente propõe aceitar startsWith https://catalog.example. Determine a saída correta, identifique a regra violada e explique como a condição prefixo visual pode pertencer a outro host afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a referência é rejeitada pela política local. Regra: Faça parsing e aplique política de protocolo e host pertinentes, além de revisar redirects, acesso e conteúdo; prefixo textual e URL permitida não conferem autoridade. Correção: exigir https e hostname exatamente catalog.example. Recuperação: rejeitar host indevido e revisar conteúdo e acesso efetivos. Ensaio nativo: testar URL Context e política de referências no consumidor. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Grounding, busca e execução de código, tenant requerido t1 revisão r6; documentos d5 r5 e d6 r6. O agente propõe filtrar apenas tenant. Determine a saída correta, identifique a regra violada e explique como a condição documento do tenant certo pode estar desatualizado afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente d6 é pertinente. Regra: Relevância não garante identidade, atualidade ou acesso; documento, revisão, escopo e conteúdo precisam de conferência pelo método de recuperação e domínio. Correção: selecionar documento por tenant e revisão. Recuperação: corrigir recorte e conferir atualização e acesso da fonte. Ensaio nativo: testar File Search com identidades revisões e conteúdo sintéticos. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Safety, privacidade e confiança, envelope didático blocked true e candidates vazio. O agente propõe classificar toda lista vazia como empty. Determine a saída correta, identifique a regra violada e explique como a condição ausência de candidato pode ter motivo distinto de vazio legítimo afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o estado é blocked. Regra: Interprete metadados pelo caminho de API e diferencie bloqueio, erro e vazio; não fabrique proposta ou reduza controles para produzir aparência de sucesso. Correção: classificar bloqueio antes de vazio. Recuperação: tratar condição e conservar proposta ausente sem defaults comerciais. Ensaio nativo: observar bloqueio e mapear envelope documentado no adaptador. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Safety, privacidade e confiança, finishReason LIMIT com texto proposta parcial. O agente propõe usar presença de texto como complete. Determine a saída correta, identifique a regra violada e explique como a condição texto presente pode ter terminado antes da condição final afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o estado é incomplete. Regra: Saída presente pode ser parcial ou bloqueada; mapeie status do protocolo e valide contrato somente após conclusão pertinente, conservando estados desconhecidos. Correção: exigir término STOP para complete no modelo didático. Recuperação: ajustar orçamento ou retomar sem confirmar efeito ausente. Ensaio nativo: testar limite e interpretar status documentado no consumidor. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Safety, privacidade e confiança, registro com requestId modelId errorCode apiKey privatePrompt. O agente propõe devolver todo o registro. Determine a saída correta, identifique a regra violada e explique como a condição spread copia conteúdo privado que a investigação não precisa afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "apiKey e privatePrompt ficam ausentes. Regra: Defina campos e origem por propósito e revise logs automáticos e política remota; projeção local minimiza dados, mas não atesta retenção ou anonimização universal. Correção: projetar somente metadados permitidos. Recuperação: restringir campos e tratar exposição pelo método pertinente. Ensaio nativo: examinar logs e controles de armazenamento do caminho usado. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de SDK, transporte e experiência em tempo real, requisição interactions r1 e decoder disponível generateContent r1. O agente propõe selecionar apenas por schemaRevision. Determine a saída correta, identifique a regra violada e explique como a condição mesma revisão local não torna APIs equivalentes afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o decoder está unavailable. Regra: Família de API, versão do SDK e contrato do envelope precisam corresponder ao adaptador; campo ausente não deve virar resposta vazia sem interpretação do estado. Correção: selecionar decoder por família e revisão declaradas. Recuperação: corrigir a fronteira de adaptação e repetir o caso final. Ensaio nativo: executar retorno documentado com SDK e adaptador compatíveis. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de SDK, transporte e experiência em tempo real, buffers [83,195] e [163,111] dividem o caractere ã. O agente propõe decodificar cada buffer e só depois juntar textos. Determine a saída correta, identifique a regra violada e explique como a condição fronteira de fragmento pode cortar um caractere multibyte afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o texto íntegro é São. Regra: Bytes podem dividir caracteres e eventos; use decodificação e enquadramento pertinentes e confira conclusão antes de interpretar conteúdo ou executar efeito. Correção: concatenar bytes antes da decodificação UTF-8 do conjunto finito. Recuperação: corrigir decodificação e enquadramento e repetir o fluxo. Ensaio nativo: testar transporte e decoder com caracteres divididos em fronteiras. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de SDK, transporte e experiência em tempo real, backoffMs 2000 retryAfterMs 5000 maxWaitMs 10000. O agente propõe usar somente backoffMs. Determine a saída correta, identifique a regra violada e explique como a condição backoff local menor não substitui janela recebida afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a espera planejada é 5000 ms. Regra: Motivo, unidade, janela do protocolo, teto de tentativas e condição de efeito devem orientar recuperação; espera local não prova quota ou sucesso futuro. Correção: respeitar maior janela pertinente dentro do teto declarado. Recuperação: respeitar janela ou comunicar impossibilidade dentro do teto. Ensaio nativo: testar erro de limite e política de retry com protocolo atual. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Build, backend e entrega da aplicação, GEMINI_API_KEY marcada secret com target client. O agente propõe aceitar como secure só pelo nome GEMINI_API_KEY. Determine a saída correta, identifique a regra violada e explique como a condição nome de variável server não protege valor no bundle afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o estado é exposed. Regra: Valor privilegiado deve permanecer no runtime server e fora de artefatos e respostas client; revisão do consumidor e autorização do endpoint continuam necessárias. Correção: classificar segredo destinado ao client como exposto. Recuperação: remover inclusão pública e tratar credencial atingida pelo método autorizado. Ensaio nativo: revisar Build e exportação e executar chamada pelo backend pertinente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Build, backend e entrega da aplicação, authenticated true com actorId u1 e ownerId u2. O agente propõe autorizar apenas pela autenticação. Determine a saída correta, identifique a regra violada e explique como a condição login válido não concede acesso a todos os objetos afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a leitura é rejeitada. Regra: Regras e código de acesso precisam relacionar identidade, recurso e operação e ser testados diretamente; provisionamento e UI não demonstram autorização comercial. Correção: exigir autenticação e propriedade do recurso. Recuperação: proteger relação de acesso no mecanismo efetivo. Ensaio nativo: testar Firebase e backend com duas contas e chamadas diretas. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Build, backend e entrega da aplicação, exportedRevision r8 e runningRevision r7. O agente propõe aceitar qualquer exportação existente. Determine a saída correta, identifique a regra violada e explique como a condição artefato disponível não prova consumo pelo destino afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a igualdade é false. Regra: Base, branch, revisão consumida e dependências do destino precisam ser observadas; código disponível e teste local não atestam outra superfície automaticamente. Correção: comparar revisão exportada com a executada. Recuperação: alinhar artefato e preservar conflitos antes de repetir gates. Ensaio nativo: conferir sync exportação e revisão efetiva do destino. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Avaliação, armadilhas e recuperação, train a1 grupo g-reserve e test a2 grupo g-reserve. O agente propõe comparar somente IDs de caso. Determine a saída correta, identifique a regra violada e explique como a condição IDs de casos diferentes podem representar a mesma família afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "g-reserve é o grupo vazado. Regra: Paráfrases e grupos relacionados podem atravessar os conjuntos; revise identidade e conteúdo pelo objetivo e preserve avaliação não usada para ajuste. Correção: detectar sobreposição de grupos entre ajuste e avaliação. Recuperação: refazer divisão e repetir protocolo sem contaminar referência. Ensaio nativo: executar avaliação revisada com grupos e rótulos independentes. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Avaliação, armadilhas e recuperação, easy nove acertos de dez e ambiguous zero de dois. O agente propõe atribuir média total a todos os grupos. Determine a saída correta, identifique a regra violada e explique como a condição média agregada não representa o grupo ambíguo afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "easy 0.9 e ambiguous zero. Regra: Condições importantes podem falhar apesar de média favorável; conserve critérios, contagens e estados de saída e analise cada grupo pertinente ao produto. Correção: calcular taxa separada para cada grupo. Recuperação: corrigir a condição falha e repetir protocolo pertinente. Ensaio nativo: avaliar outputs reais por grupo e critério revisados. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Avaliação, armadilhas e recuperação, estado unknown após interrupção de uma chamada de reserva. O agente propõe retornar retry para tudo que não for confirmed. Determine a saída correta, identifique a regra violada e explique como a condição ausência de retorno não comprova ausência de escrita afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a próxima ação é reconcile. Regra: Conserve identidade e estado unknown, consulte resultado confirmado e aplique idempotência antes de repetir; cancelamento de espera não reverte efeito remoto. Correção: reconciliar antes de decidir repetição. Recuperação: reconciliar efeito e repetir somente pelo contrato pertinente. Ensaio nativo: testar interrupção e consulta de resultado por identidade de operação. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Projeto Quíron com Google AI Studio, proposta ready com ator t1 e item de t2. O agente propõe aceitar qualquer proposta ready. Determine a saída correta, identifique a regra violada e explique como a condição status ready não autoriza atravessar tenants afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a decisão é reject. Regra: Ele pode propor e explicar, enquanto o serviço valida identidade, domínio e estado antes do efeito; proposta pronta não equivale a decisão autorizada. Correção: aceitar proposta só com identidade de tenant correspondente. Recuperação: rejeitar antes da escrita e corrigir recurso ou intenção pertinente. Ensaio nativo: executar jornada e acesso cruzado no Lab com dois atores. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Projeto Quíron com Google AI Studio, mesmo intentId i9 para item A qty2 e qty1 em t1. O agente propõe comparar só intentId. Determine a saída correta, identifique a regra violada e explique como a condição mesma identidade não garante mesma intenção comercial afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o conteúdo não é equivalente. Regra: Defina conflito por projeção de domínio e conserve resultado e escopo; fingerprint local não substitui autorização, persistência ou coordenação com o efeito. Correção: comparar fingerprints da projeção tenant itemId qty. Recuperação: preservar resultado anterior e resolver nova intenção pelo contrato. Ensaio nativo: testar replay conflito e persistência no Lab Ágora. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Projeto Quíron com Google AI Studio, stock um e qty dois. O agente propõe subtrair sempre e confirmar. Determine a saída correta, identifique a regra violada e explique como a condição quantidade acima do saldo não deve produzir débito nem recibo confirmado afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "result rejected e stock um. Regra: Resposta, recibos e estado confirmado devem respeitar o domínio, incluindo insuficiência e disputa real; transição serial define regra, mas não atesta atomicidade durável. Correção: rejeitar insuficiência conservando estoque. Recuperação: preservar saldo na rejeição e revalidar intenção pelo estado atual. Ensaio nativo: executar casos e disputa de reserva no Lab Ágora. A fixture local não atesta essa superfície."
    ]
  ]
];
export const GOOGLE_AI_STUDIO_CARDS: ContentSource["cards"] = GOOGLE_AI_STUDIO_CURRICULUM.flatMap(chapter=>chapter.sections.map(title=>({nodeTitle:chapter.title,frontMd:GOOGLE_AI_STUDIO_REVIEW[title][0],backMd:GOOGLE_AI_STUDIO_REVIEW[title][1]})));
export const GOOGLE_AI_STUDIO_EXERCISES: ContentSource["exercises"] = GOOGLE_AI_STUDIO_CURRICULUM.flatMap((chapter,index)=>SCENARIOS[index].map(([promptMd,answerKeyMd],position)=>({nodeTitle:chapter.title,type:([2,3,5] as const)[position],level:chapter.level==="basico"?"beginner" as const:chapter.level==="intermediario"?"intermediate" as const:"advanced" as const,promptMd,answerKeyMd,points:3})));
