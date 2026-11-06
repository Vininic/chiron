import type { ContentSource } from "./types";
import { GITHUB_COPILOT_CURRICULUM } from "./githubCopilotCurriculum";
type Review=[question:string,answer:string,failure:string];
export const GITHUB_COPILOT_REVIEW: Record<string,Review> = {
  "Sugestão, Chat e agente como operações diferentes": [
    "Que evidência diferencia texto sugerido de teste executado?",
    "Uma chamada de execução com argumentos, ambiente, revisão e retorno observado sustenta a prova; a sugestão contém somente uma proposta.",
    "O relato final promove uma linha de Chat a teste aprovado."
  ],
  "Conta, extensão e matriz de suporte": [
    "Por que verificar recurso e modo além do nome do IDE?",
    "Disponibilidade e políticas variam por combinação; uma função habilitada não transfere suporte a outra experiência.",
    "Um tutorial usa uma capacidade que a superfície do leitor não oferece."
  ],
  "Workspace e revisão da evidência": [
    "Quando uma execução anterior deixa de validar o artefato atual?",
    "Quando muda a unidade de código ou condição pertinente ao gate; a prova permanece histórica e precisa ser associada à base realmente exercitada.",
    "Uma edição posterior é apresentada com o resultado aprovado de bytes anteriores."
  ],
  "Pedido com comportamento e restrições": [
    "Como tornar verificável uma restrição de preservação no pedido?",
    "Declare o estado ou efeito que deve permanecer e inclua uma observação negativa que detecte sua violação.",
    "A rejeição retorna o status esperado mas já debitou estoque."
  ],
  "Cursor, prefixo e sufixo da sugestão": [
    "O que revisar além do trecho inline sugerido?",
    "Revise o prefixo, o sufixo e a unidade completa resultante; o contexto ao redor pode conter condições e consumidores que a inserção precisa preservar.",
    "Aceitar o trecho remove a condição de estoque existente."
  ],
  "Aceitação parcial e contexto de edição": [
    "O que torna coerente a aceitação parcial de uma sugestão?",
    "A unidade aceita mantém suas dependências necessárias e seus efeitos dentro do escopo; fragmentos visuais não equivalem automaticamente a unidades semânticas.",
    "Uma consulta remota é introduzida junto da validação local sem necessidade."
  ],
  "Next edit suggestions e consumidores": [
    "Por que uma sugestão de próxima edição não fecha um rename?",
    "Ela sugere uma continuidade, enquanto cobertura exige investigar referências tipadas, usos dinâmicos e nomes que representam dados ou história.",
    "O rename altera uma menção histórica e deixa uma chamada dinâmica sem revisão."
  ],
  "Referências de código público e procedência": [
    "O que uma referência de código público acrescenta à revisão?",
    "Ela oferece um caminho de investigação de procedência e licença; não certifica originalidade universal nem decide sozinha a incorporação.",
    "A normalização descarta um conflito de licença que precisava de revisão."
  ],
  "Perguntas com casos e unidades explícitas": [
    "Como detectar uma resposta numérica correta na unidade errada?",
    "Declare a unidade de entrada e saída e use um caso cujo valor esperado diferencie a conversão ausente ou repetida.",
    "Um timeout válido sintaticamente expira mil vezes antes do previsto."
  ],
  "Seleção de arquivos e orçamento de contexto": [
    "Qual critério define contexto suficiente para uma investigação?",
    "Material pertinente ao contrato e aos consumidores, com alcance de uso autorizado e referências recuperáveis; volume por si só não estabelece suficiência.",
    "Um segredo é incluído no contexto por ser pequeno e próximo da rota."
  ],
  "Explicação confrontada com fluxo de chamadas": [
    "Como validar uma explicação de autorização no fluxo de chamadas?",
    "Siga o caminho de entrada ao efeito e confronte a precedência com um caso negativo que observe o estado preservado.",
    "A explicação afirma proteção apesar de a escrita anteceder a validação."
  ],
  "Histórico relevante e hipótese revogada": [
    "Como conservar contexto quando uma hipótese foi desmentida?",
    "Registre a revogação e sua evidência, preserve decisões ainda válidas e atualize planos dependentes da premissa antiga.",
    "O agente implementa invalidação de cache para um defeito de payload já identificado."
  ],
  "copilot-instructions.md e contrato do repositório": [
    "Como manter instruções de repositório executáveis?",
    "Confronte os comandos e invariantes com o estado atual do projeto e registre lacunas sem inventar ferramentas ou declarar gates inexistentes como aprovados.",
    "O agente simula um gate removido para cumprir uma instrução desatualizada."
  ],
  "applyTo e suporte por superfície": [
    "Que duas verificações tornam pertinente uma instrução por caminho?",
    "Confira o padrão sobre os arquivos e o suporte da experiência usada; correspondência textual local não prova carregamento nativo.",
    "Uma regra de UI é aplicada a uikit por comparação de prefixo imprecisa."
  ],
  "Prompt reutilizável e parâmetros da tarefa": [
    "O que separar num prompt reutilizável?",
    "Separe procedimento estável, parâmetros atuais e critérios de saída; campos preenchidos precisam de conteúdo coerente com a tarefa.",
    "Uma revisão roda sem a regra que permitiria reconhecer o defeito."
  ],
  "Skill, recursos e avaliação de procedimento": [
    "Como avaliar uma skill além de verificar sua existência?",
    "Associe versão e casos discriminantes às falhas relevantes, observe a execução real e separe cobertura declarada de qualidade demonstrada.",
    "O roteiro parece bem avaliado mas nunca foi confrontado com atualização perdida."
  ],
  "Plano com dependências e critérios de término": [
    "O que torna um plano verificável durante a edição?",
    "Dependências, produtos observáveis e critérios de término permitem confrontar cada etapa com o estado real do trabalho.",
    "O agente atualiza consumidores com uma interface que ainda não foi definida."
  ],
  "Mudança entre arquivos e base do patch": [
    "Como evitar que um patch assistido sobrescreva uma edição recente?",
    "Confira a base atual e concilie mudanças pela intenção antes de aplicar; identidade de caminho não garante identidade do conteúdo.",
    "A edição do agente substitui trabalho alheio feito depois da leitura inicial."
  ],
  "Ferramenta, shell e efeito autorizado": [
    "Por que separar argumento de texto de shell?",
    "A estrutura preserva a identidade do dado; no shell textual, quoting e metacaracteres dependem do dialeto usado.",
    "O comando executa uma seleção diferente porque o caminho foi dividido."
  ],
  "Recuperação de edição e trabalho alheio": [
    "Como escolher a unidade de recuperação de uma edição assistida?",
    "Identifique base, ownership e dependências e desfaça o efeito pertinente preservando trabalho independente.",
    "Restaurar o arquivo inteiro apaga a edição recente do usuário."
  ],
  "Teste independente da resposta gerada": [
    "O que impede um teste gerado de apenas repetir o erro da implementação?",
    "Um oracle independente e uma fixture discriminante permitem discordância útil; expectativa calculada pela função avaliada é circular.",
    "A suite aprova contagem de linhas como se fosse soma de quantidades."
  ],
  "Casos de fronteira e propriedade de domínio": [
    "Como escolher uma fronteira numérica pertinente ao contrato?",
    "Identifique precisão, unidade e representação exigidas e selecione um valor que diferencie a validação correta de uma alternativa plausível.",
    "Uma reserva aceita quantidade cuja contagem exata não é garantida pelo Number."
  ],
  "Refatoração que preserva consumidores": [
    "O que observar numa refatoração além do retorno?",
    "Observe efeitos, mutação, ordem e consumidores que participam do contrato; equivalência precisa cobrir essas dimensões pertinentes.",
    "A nova função muda silenciosamente a lista compartilhada com outro consumidor."
  ],
  "Seleção de gates e revisão final": [
    "O que permite fechar os gates de uma mudança assistida?",
    "Resultados observados dos métodos pertinentes, associados à revisão final e com limitações independentes explicitadas.",
    "Um build pendente e um typecheck antigo são apresentados como validação final."
  ],
  "Servidor MCP e identidade da ferramenta": [
    "Que identidade precisa acompanhar uma ferramenta MCP?",
    "Servidor, ferramenta e contexto de capacidade pertinente distinguem operações com nomes iguais e fontes diferentes.",
    "A busca consulta pedidos quando o pedido era pesquisar documentação pública."
  ],
  "Capacidade mínima e autorização de operação": [
    "Quais dimensões devem participar da autorização de uma ferramenta?",
    "Identidade, objeto e operação pertinentes ao efeito precisam ser conferidos; acesso a uma dimensão não transfere autoridade às demais.",
    "Uma consulta autorizada é usada para justificar exclusão de pedido."
  ],
  "Retorno remoto como dado não confiável": [
    "O que validar num retorno de ferramenta além do formato?",
    "Confira relações de identidade e domínio exigidas pela consulta e trate instruções embutidas como dados sem autoridade adicional.",
    "Dados de outro tenant informam a decisão de reserva atual."
  ],
  "Idempotência e resultado remoto incerto": [
    "Por que timeout não autoriza retry sem conferir idempotência?",
    "O efeito pode ter ocorrido antes da perda de resposta; a repetição precisa preservar identidade e payload conforme o contrato remoto.",
    "O agente duplica a reserva ou aceita um replay de payload conflitante."
  ],
  "Tarefa delegada e repositório escolhido": [
    "O que precisa ficar explícito numa delegação ao agente cloud?",
    "Repositório, base, contrato e produto revisável definem o alcance; dependências externas continuam separadas da mudança efetivamente produzida.",
    "A conclusão declara interface atualizada apesar de a sessão ter trabalhado somente no backend."
  ],
  "Ambiente efêmero e setup reprodutível": [
    "Que evidência sustenta um setup reprodutível do agente cloud?",
    "Logs de passos efetivos associados à base e às dependências pertinentes, com cache compatível; configuração presente não prova execução.",
    "A sessão reutiliza um cache de outro lockfile e atribui o erro ao patch."
  ],
  "Branch, logs e pull request revisável": [
    "O que torna uma entrega cloud concretamente revisável?",
    "Diff com base e head identificados, logs e gates associados à mudança final, e descrição que corresponda ao comportamento entregue.",
    "O PR novo reutiliza um resultado de teste anterior ao patch."
  ],
  "Firewall e dependências do ambiente": [
    "Por que uma allowlist textual não prova isolamento de rede?",
    "Identificação do alvo e enforcement são dimensões distintas, e o controle possui alcance e exceções que precisam ser conferidos na superfície real.",
    "Um host malicioso passa pela comparação de substring."
  ],
  "Comentário localizado e defeito reproduzível": [
    "Que informações tornam um comentário de review investigável?",
    "Localização pertinente, gatilho e consequência permitem confrontar o achado com o contrato; esses campos ainda precisam de reprodução.",
    "Uma nota vaga é tratada como defeito comprovado e gera mudança desnecessária."
  ],
  "Revisão da base e instruções pertinentes": [
    "Por que associar instruções à base da revisão?",
    "Configuração e código podem mudar; a conclusão precisa refletir o contexto realmente utilizado e o suporte da superfície.",
    "Uma regra adicionada depois é atribuída à revisão anterior."
  ],
  "Cobertura de diff e arquivos excluídos": [
    "Como relatar uma revisão quando parte do diff ficou fora?",
    "Identifique a lacuna e o método permitido que a cobre ou limite a conclusão; ausência de análise não é ausência de defeito.",
    "O resumo declara autorização revisada apesar de policy não ter sido analisado."
  ],
  "Checks, aprovação e autoridade de merge": [
    "Qual diferença preservar entre assessment de review e aprovação exigida?",
    "A análise informa qualidade percebida; sua validade como aprovação depende da política efetiva e da revisão pertinente.",
    "O fluxo integra um PR com base numa avaliação que não conta para o controle exigido."
  ],
  "CLI e limites da invocação no terminal": [
    "Que fronteira conferir antes de usar a CLI sobre um caminho?",
    "Confira o alvo resolvido e o alcance da sessão, incluindo o dialeto e as permissões pertinentes; texto relativo não estabelece contenção.",
    "Uma operação fora da raiz é tratada como edição local autorizada."
  ],
  "Agente personalizado e conjunto de ferramentas": [
    "Como avaliar a especialização de um agente personalizado?",
    "Confronte definição, capacidades e casos discriminantes com a tarefa e observe chamadas reais; nome e prompt não demonstram isolamento.",
    "Um agente de revisão recebe deploy por estar disponível na sessão."
  ],
  "Hooks e contrato de evento observado": [
    "Por que o evento faz parte do contrato de um hook?",
    "Ele determina momento, entrada e significado da resposta; observar um efeito depois não equivale a preveni-lo antes.",
    "O log posterior é relatado como controle que impediu uma chamada já executada."
  ],
  "Automação, timeout e replay controlado": [
    "Como retomar automação quando uma etapa tem resultado incerto?",
    "Distinga falha e desconhecido, consulte o efeito por método pertinente e preserve identidade antes de repetir.",
    "A retomada envia uma segunda notificação porque interpretou silêncio como falha."
  ],
  "Exclusão de conteúdo e limites por modo": [
    "Por que associar exclusão de conteúdo ao modo da sessão?",
    "O suporte e o alcance do controle variam; uma marcação configurada não prova aplicação em toda experiência.",
    "Um arquivo sensível é usado em agent sob a suposição de exclusão universal."
  ],
  "Segredos e contexto mínimo necessário": [
    "Como minimizar um log usado como contexto assistido?",
    "Projete campos necessários de estrutura conhecida e revise valores e texto livre; uma remoção por nome não certifica ausência universal de informação sensível.",
    "O diagnóstico transmite email sem necessidade para investigar o erro."
  ],
  "Prompt injection e origem da autoridade": [
    "O que impede conteúdo de ferramenta de ampliar a tarefa?",
    "A decisão conserva origem e alcance da autorização; texto analisado continua dado mesmo quando parece uma ordem.",
    "Uma instrução num README desencadeia publicação e transmissão fora do pedido."
  ],
  "Métricas de qualidade e custo observado": [
    "Que custo considerar ao avaliar uma mudança assistida?",
    "Declare a população e inclua componentes pertinentes à entrega validada, como revisão e retrabalho, separando-os de latência e faturamento do serviço.",
    "A comparação anuncia ganho porque ignora o tempo de corrigir a proposta."
  ],
  "Reserva por tenant e contrato do endpoint": [
    "Qual fronteira deve proteger a reserva por tenant?",
    "A identidade autenticada e o recurso precisam ser confrontados antes do efeito, com rejeição observada sem escrita.",
    "Um usuário reserva estoque de outro tenant com quantidade válida."
  ],
  "Replay com payload canônico declarado": [
    "Quando uma representação pode ser chamada de canônica neste projeto?",
    "Quando seu domínio, campos e ordem foram explicitados e avaliados; isso não estabelece canonicalização universal de JSON nem idempotência durável.",
    "Um retry equivalente recebe outra identidade por causa de trace ou ordem de propriedades."
  ],
  "Interleaving e prova de estoque": [
    "Por que estoque final não negativo não basta para provar a reserva?",
    "A conservação precisa relacionar movimentos e confirmações; atualização perdida pode deixar zero enquanto confirma mais unidades que o disponível.",
    "Duas reservas confirmam a última unidade e o teste de não negatividade passa."
  ],
  "Handoff, limites e ensaio do Lab Ágora": [
    "O que um handoff precisa conservar para continuar a prova correta?",
    "Identidade do artefato, métodos observados, resultados e limites por superfície permitem retomar a fronteira pendente sem repetir ou inventar evidência.",
    "O relato promove corpus JavaScript a execução de CLI e backend concorrente."
  ]
};
const SCENARIOS: [string,string][][] = [
  [
    [
      "No trabalho de Superfícies, sessão e resultado esperado, há suggestion, read e execute; somente execute tem exitCode zero. O agente propõe selecionar todo registro cujo texto contém test. Determine a saída correta, identifique a regra violada e explique como a condição um comando escrito na sugestão ainda não é execução afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "apenas o identificador test-run é selecionado. Regra: Uma chamada de execução com argumentos, ambiente, revisão e retorno observado sustenta a prova; a sugestão contém somente uma proposta. Correção: selecionar ações execute cujo status observado é zero. Recuperação: executar o gate autorizado ou corrigir o relato para proposta ainda não exercitada. Ensaio nativo: conferir o terminal ou log da ação Copilot na superfície utilizada. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Superfícies, sessão e resultado esperado, a matriz tem Chat/ask disponível e Chat/agent indisponível no IDE q. O agente propõe aceitar qualquer linha habilitada do mesmo IDE. Determine a saída correta, identifique a regra violada e explique como a condição suporte a Chat não implica suporte ao modo escolhido afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a consulta de agent retorna false. Regra: Disponibilidade e políticas variam por combinação; uma função habilitada não transfere suporte a outra experiência. Correção: consultar IDE, recurso e modo simultaneamente. Recuperação: usar procedimento compatível e registrar a dimensão indisponível. Ensaio nativo: conferir matriz oficial e configuração Copilot efetiva sem expor credenciais. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Superfícies, sessão e resultado esperado, resultado e arquivo final compartilham r4 mas têm digests A e B. O agente propõe comparar somente revision. Determine a saída correta, identifique a regra violada e explique como a condição trabalho não commitado muda bytes sem mudar HEAD afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a evidência não corresponde ao arquivo final. Regra: Quando muda a unidade de código ou condição pertinente ao gate; a prova permanece histórica e precisa ser associada à base realmente exercitada. Correção: exigir igualdade de revisão e digest para reutilizar o gate. Recuperação: reexecutar os gates afetados sobre a base final. Ensaio nativo: confrontar diff, revisão e identidade dos arquivos da execução Copilot. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Completar código com revisão humana, prefixo inicia return, inserção contém tenantOk e sufixo contém && stockOk. O agente propõe montar somente prefixo e inserção. Determine a saída correta, identifique a regra violada e explique como a condição texto posterior contém uma condição que precisa sobreviver afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o texto contém return tenantOk && stockOk;. Regra: Revise o prefixo, o sufixo e a unidade completa resultante; o contexto ao redor pode conter condições e consumidores que a inserção precisa preservar. Correção: compor os três trechos na posição declarada. Recuperação: restaurar o entorno a partir da base e validar a expressão completa. Ensaio nativo: inspecionar a inserção e seu diff no IDE Copilot usado. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Completar código com revisão humana, validate e helper pertencem à validação local; enrich faz chamada remota no mesmo grupo. O agente propõe aceitar todos os fragmentos do grupo quantity. Determine a saída correta, identifique a regra violada e explique como a condição uma proposta pode misturar efeitos de alcances diferentes afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "validate e helper são os fragmentos aceitos. Regra: A unidade aceita mantém suas dependências necessárias e seus efeitos dentro do escopo; fragmentos visuais não equivalem automaticamente a unidades semânticas. Correção: selecionar grupo quantity somente quando remote é false. Recuperação: remover o efeito adicional e conferir que a unidade local permanece completa. Ensaio nativo: revisar seleção e dependências no diff real de Copilot. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Completar código com revisão humana, duas chamadas apontam reserve; uma menção histórica e reserveReport não são consumidores do símbolo. O agente propõe selecionar qualquer texto contendo reserve. Determine a saída correta, identifique a regra violada e explique como a condição ocorrência da palavra não estabelece identidade de símbolo afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "os consumidores são api e worker. Regra: Ela sugere uma continuidade, enquanto cobertura exige investigar referências tipadas, usos dinâmicos e nomes que representam dados ou história. Correção: selecionar referência de categoria call e symbol reserve. Recuperação: classificar referências e testar as fronteiras que o índice não cobre. Ensaio nativo: confrontar sugestões com navegação e busca de consumidores reais. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Chat, contexto e investigação, prazo declarado de 2,5 segundos. O agente propõe devolver segundos sem conversão. Determine a saída correta, identifique a regra violada e explique como a condição a API consumidora usa unidade diferente da especificação afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o resultado é 2500. Regra: Declare a unidade de entrada e saída e use um caso cujo valor esperado diferencie a conversão ausente ou repetida. Correção: converter segundos para milissegundos multiplicando por mil. Recuperação: corrigir a conversão na fronteira e repetir a prova temporal adequada. Ensaio nativo: conferir a assinatura da API e medir o comportamento do temporizador pertinente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Chat, contexto e investigação, route e auth são relevantes; secret é sensível e image é irrelevante; orçamento 10. O agente propõe selecionar todos os arquivos que cabem sem conferir relevância ou sensibilidade. Determine a saída correta, identifique a regra violada e explique como a condição arquivo pequeno ainda pode conter informação que não deve ser transmitida afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "route e auth ocupam nove unidades. Regra: Material pertinente ao contrato e aos consumidores, com alcance de uso autorizado e referências recuperáveis; volume por si só não estabelece suficiência. Correção: selecionar relevantes não sensíveis em ordem sem exceder orçamento. Recuperação: retirar material sensível e recompor a seleção com evidência pertinente. Ensaio nativo: conferir anexos e referências efetivamente usados por Copilot Chat. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Chat, contexto e investigação, a sequência é parse, writeStock, validateTenant, respond. O agente propõe aprovar se validateTenant aparece em qualquer posição. Determine a saída correta, identifique a regra violada e explique como a condição presença da verificação não garante precedência ao efeito afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a ordem requerida retorna false. Regra: Siga o caminho de entrada ao efeito e confronte a precedência com um caso negativo que observe o estado preservado. Correção: exigir validação presente antes da escrita presente. Recuperação: mover ou corrigir o controle pertinente e revisar todos os caminhos afetados. Ensaio nativo: rastrear o endpoint e observar efeito em uma rejeição real. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Instruções, prompts e skills, instruções exigem test, typecheck e test:integration; manifesto tem os dois primeiros. O agente propõe aprovar todas as exigências quando existe test. Determine a saída correta, identifique a regra violada e explique como a condição texto de instrução pode envelhecer independentemente do código afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "test:integration é a referência quebrada. Regra: Confronte os comandos e invariantes com o estado atual do projeto e registre lacunas sem inventar ferramentas ou declarar gates inexistentes como aprovados. Correção: listar scripts exigidos ausentes no manifesto. Recuperação: corrigir a referência e preservar a intenção do gate com método disponível. Ensaio nativo: conferir instruções usadas pela superfície Copilot e executar os scripts reais pertinentes. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Instruções, prompts e skills, prefixo declarado src/ui/ e três caminhos ui, uikit e api. O agente propõe remover a barra final antes da seleção. Determine a saída correta, identifique a regra violada e explique como a condição prefixo textual sem barra confunde pastas vizinhas afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente src/ui/cart.ts corresponde. Regra: Confira o padrão sobre os arquivos e o suporte da experiência usada; correspondência textual local não prova carregamento nativo. Correção: selecionar caminhos que começam pelo prefixo completo. Recuperação: corrigir o padrão pertinente e repetir o caso de pasta vizinha. Ensaio nativo: conferir applyTo real e suporte na superfície Copilot escolhida. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Instruções, prompts e skills, module vale inventory e invariant é uma string de espaços. O agente propõe conferir apenas Object.hasOwn. Determine a saída correta, identifique a regra violada e explique como a condição propriedade presente não significa parâmetro útil afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "invariant permanece ausente semanticamente. Regra: Separe procedimento estável, parâmetros atuais e critérios de saída; campos preenchidos precisam de conteúdo coerente com a tarefa. Correção: listar parâmetros sem texto válido. Recuperação: fornecer a decisão ausente e avaliar a saída contra o contrato. Ensaio nativo: conferir formato e valores do prompt na experiência Copilot utilizada. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Planejar e editar no IDE, consumer antecede schema, embora dependa dele; regression vem por último. O agente propõe validar somente a presença dos nomes. Determine a saída correta, identifique a regra violada e explique como a condição presença de todas as etapas não estabelece ordem executável afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a ordem é inválida. Regra: Dependências, produtos observáveis e critérios de término permitem confrontar cada etapa com o estado real do trabalho. Correção: exigir que cada dependência esteja no conjunto de etapas já vistas. Recuperação: reordenar etapas pertinentes e conferir a interface antes dos consumidores. Ensaio nativo: confrontar plano Copilot e diff com dependências reais do projeto. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Planejar e editar no IDE, digest esperado de version=1 e conteúdo atual version=2. O agente propõe aplicar a troca sem verificar digest. Determine a saída correta, identifique a regra violada e explique como a condição mesmo caminho pode conter bytes diferentes da base analisada afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o resultado é stale. Regra: Confira a base atual e concilie mudanças pela intenção antes de aplicar; identidade de caminho não garante identidade do conteúdo. Correção: comparar SHA-256 do conteúdo atual com a base declarada antes de aplicar. Recuperação: reconstruir o patch sobre o estado corrente preservando as duas intenções. Ensaio nativo: revisar base e diff dos arquivos reais antes de aplicar a proposta Copilot. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Planejar e editar no IDE, o arquivo de teste é tests/tenant reserve.test.ts. O agente propõe dividir o caminho em espaços. Determine a saída correta, identifique a regra violada e explique como a condição espaços no nome não delimitam argumentos quando o valor é estruturado afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "argv tem exec, vitest, run e o caminho inteiro. Regra: A estrutura preserva a identidade do dado; no shell textual, quoting e metacaracteres dependem do dialeto usado. Correção: preservar o caminho como um único elemento de argv. Recuperação: corrigir quoting ou usar argv estruturado e repetir o gate pertinente. Ensaio nativo: conferir shell e argumentos do terminal usado por Copilot. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Testes e refatoração assistidos, linhas de reserva têm quantidades 2 e 3. O agente propõe retornar o número de linhas. Determine a saída correta, identifique a regra violada e explique como a condição quantidades unitárias esconderiam a diferença entre soma e contagem afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o total é cinco. Regra: Um oracle independente e uma fixture discriminante permitem discordância útil; expectativa calculada pela função avaliada é circular. Correção: somar qty com acumulador inicial zero. Recuperação: definir expectativa pelo contrato e repetir um caso que diferencie as implementações. Ensaio nativo: revisar oracles e execução dos testes gerados por Copilot. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Testes e refatoração assistidos, qty é o inteiro 9007199254740992. O agente propõe usar Number.isInteger sem faixa segura. Determine a saída correta, identifique a regra violada e explique como a condição inteiro não equivale a inteiro representável com precisão segura afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a quantidade é inválida. Regra: Identifique precisão, unidade e representação exigidas e selecione um valor que diferencie a validação correta de uma alternativa plausível. Correção: exigir inteiro seguro positivo. Recuperação: corrigir a representação ou a regra e repetir o caso negativo. Ensaio nativo: testar validação e ausência de escrita no endpoint com a fronteira numérica. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Testes e refatoração assistidos, lista original b,a deve permanecer enquanto retorno fica a,b. O agente propõe ordenar o array original. Determine a saída correta, identifique a regra violada e explique como a condição retorno correto pode esconder mutação da entrada afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "sorted é a,b e input permanece b,a. Regra: Observe efeitos, mutação, ordem e consumidores que participam do contrato; equivalência precisa cobrir essas dimensões pertinentes. Correção: ordenar uma cópia e observar também a entrada. Recuperação: preservar a invariância declarada e repetir a observação de efeito. Ensaio nativo: confrontar a refatoração Copilot com contratos e referências reais da entrada. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de MCP e capacidades externas, orders/search aparece antes de docs/search; pedido exige docs/search. O agente propõe selecionar somente pelo nome tool. Determine a saída correta, identifique a regra violada e explique como a condição nomes de ferramenta podem coincidir entre servidores afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a origem selecionada é docs. Regra: Servidor, ferramenta e contexto de capacidade pertinente distinguem operações com nomes iguais e fontes diferentes. Correção: selecionar por server e tool simultaneamente. Recuperação: corrigir a identidade e revisar a origem do retorno. Ensaio nativo: conferir descoberta e chamada MCP reais na superfície Copilot utilizada. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de MCP e capacidades externas, capacidade read no tenant a e tentativa delete no tenant a. O agente propõe conferir somente tenant. Determine a saída correta, identifique a regra violada e explique como a condição identidade correta do tenant não autoriza qualquer operação afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "delete não é autorizado. Regra: Identidade, objeto e operação pertinentes ao efeito precisam ser conferidos; acesso a uma dimensão não transfere autoridade às demais. Correção: exigir capacidade com tenant e operação idênticos à tentativa. Recuperação: restringir a chamada à operação autorizada e preservar a fronteira do efeito. Ensaio nativo: verificar escopos e rejeição efetiva na integração MCP e backend pertinentes. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de MCP e capacidades externas, consulta order o7 tenant a; resposta ok com o7 tenant b. O agente propõe ignorar tenant na resposta. Determine a saída correta, identifique a regra violada e explique como a condição estrutura válida pode conter relação de domínio errada afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o retorno é inadequado à consulta. Regra: Confira relações de identidade e domínio exigidas pela consulta e trate instruções embutidas como dados sem autoridade adicional. Correção: conferir identidade de pedido e tenant além de status. Recuperação: rejeitar a resposta divergente e investigar origem ou escopo sem ampliar acesso. Ensaio nativo: conferir retorno MCP real e sua relação com a requisição autorizada. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Agente cloud e trabalho em branch, route e schema pertencem api; form pertence web; tarefa escolheu api. O agente propõe incluir todo arquivo relacionado a reserve. Determine a saída correta, identifique a regra violada e explique como a condição contexto sobre outro repo não equivale a alteração nele afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "route e schema compõem o alcance. Regra: Repositório, base, contrato e produto revisável definem o alcance; dependências externas continuam separadas da mudança efetivamente produzida. Correção: selecionar artefatos do repositório declarado. Recuperação: limitar a conclusão e registrar a integração externa que falta provar. Ensaio nativo: conferir repo e base da sessão Copilot cloud e seus artefatos. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Agente cloud e trabalho em branch, sistema win32, Node24 e digest de lockfile L8. O agente propõe omitir digest do lockfile. Determine a saída correta, identifique a regra violada e explique como a condição dependências podem mudar sem mudar a versão do runtime afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a chave é win32-node24-L8. Regra: Logs de passos efetivos associados à base e às dependências pertinentes, com cache compatível; configuração presente não prova execução. Correção: compor chave de cache com as três dimensões. Recuperação: corrigir a associação do cache e reconstruir condições necessárias. Ensaio nativo: conferir workflow de setup e logs reais do ambiente Copilot cloud. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Agente cloud e trabalho em branch, base main, head h2 e teste associado h1. O agente propõe aceitar qualquer testHead não vazio. Determine a saída correta, identifique a regra violada e explique como a condição um gate antigo não valida a alteração mais recente afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a lacuna é test-head. Regra: Diff com base e head identificados, logs e gates associados à mudança final, e descrição que corresponda ao comportamento entregue. Correção: conferir base prevista e teste na revisão head. Recuperação: executar a prova afetada no head final e corrigir a descrição. Ensaio nativo: conferir diff, commits e checks do PR produzido por Copilot cloud. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Code review e decisão de integração, tenant-key tem linha, gatilho e impacto; style-note tem somente linha. O agente propõe selecionar qualquer achado com linha positiva. Determine a saída correta, identifique a regra violada e explique como a condição localização presente não torna uma recomendação genérica reproduzível afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente tenant-key permanece. Regra: Localização pertinente, gatilho e consequência permitem confrontar o achado com o contrato; esses campos ainda precisam de reprodução. Correção: selecionar achados com localização e dados necessários à reprodução. Recuperação: completar ou refutar o caso com observação concreta antes de aplicar a sugestão. Ensaio nativo: reproduzir o achado de Copilot review sobre o código pertinente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Code review e decisão de integração, arquivo src/api/reserve.ts em b1; há regra tenant b1, tenant-new b2 e contrast UI b1. O agente propõe ignorar a identidade da revisão. Determine a saída correta, identifique a regra violada e explique como a condição instrução atual pode diferir da versão usada pela revisão afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente tenant é aplicável ao manifesto. Regra: Configuração e código podem mudar; a conclusão precisa refletir o contexto realmente utilizado e o suporte da superfície. Correção: selecionar prefixo de caminho e revisão pertinentes. Recuperação: corrigir a associação ou repetir a revisão sobre a configuração adequada. Ensaio nativo: conferir base e instruções efetivamente pertinentes ao Copilot code review. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Code review e decisão de integração, diff relevante route, policy e test; review analisou route e test; policy foi excluído. O agente propõe tratar arquivos excluídos como analisados. Determine a saída correta, identifique a regra violada e explique como a condição exclusão não equivale a revisão sem achados afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "policy é a lacuna de cobertura. Regra: Identifique a lacuna e o método permitido que a cobre ou limite a conclusão; ausência de análise não é ausência de defeito. Correção: listar relevantes sem análise observada. Recuperação: usar revisão permitida na fronteira ausente e conservar a origem da prova. Ensaio nativo: conferir cobertura e exclusões do Copilot review contra o diff real. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de CLI, agentes personalizados e automação, raiz repo/app e caminho bruto repo/app/../docs. O agente propõe conferir apenas startsWith no texto bruto. Determine a saída correta, identifique a regra violada e explique como a condição componentes de navegação podem sair da pasta mesmo com prefixo bruto correto afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o alvo não pertence à raiz repo/app. Regra: Confira o alvo resolvido e o alcance da sessão, incluindo o dialeto e as permissões pertinentes; texto relativo não estabelece contenção. Correção: normalizar segmentos POSIX e conferir contenção por fronteira de pasta. Recuperação: corrigir base ou alvo e conferir contenção pelo sistema antes do efeito. Ensaio nativo: observar resolução de caminho e permissões da sessão Copilot CLI real. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de CLI, agentes personalizados e automação, perfil solicita read/search; sessão oferece read/search/deploy. O agente propõe usar todo o conjunto disponível. Determine a saída correta, identifique a regra violada e explique como a condição disponibilidade adicional não transforma ferramenta em necessidade do papel afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o conjunto é read e search. Regra: Confronte definição, capacidades e casos discriminantes com a tarefa e observe chamadas reais; nome e prompt não demonstram isolamento. Correção: usar a interseção do solicitado com o disponível. Recuperação: limitar capacidades pertinentes e repetir avaliação de efeito desnecessário. Ensaio nativo: conferir definição e chamadas do agente personalizado Copilot na superfície usada. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de CLI, agentes personalizados e automação, envelope didático postToolUse contém permissionDecision deny. O agente propõe usar permissionDecision sem conferir evento. Determine a saída correta, identifique a regra violada e explique como a condição texto deny num evento posterior não bloqueia retroativamente o efeito afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a projeção retorna null. Regra: Ele determina momento, entrada e significado da resposta; observar um efeito depois não equivale a preveni-lo antes. Correção: aceitar decisão anterior somente no evento preToolUse. Recuperação: usar evento e protocolo adequados e observar a decisão efetiva. Ensaio nativo: conferir schema e execução do hook Copilot real no evento pertinente. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Armadilhas, governança e avaliação, arquivo excluded true e modo agent fora do conjunto supported. O agente propõe retornar excluded somente pela marca do arquivo. Determine a saída correta, identifique a regra violada e explique como a condição configuração presente pode não ser aplicada na experiência usada afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o estado é unsupported. Regra: O suporte e o alcance do controle variam; uma marcação configurada não prova aplicação em toda experiência. Correção: classificar exclusão somente quando o modo tem suporte declarado. Recuperação: corrigir a afirmação e usar somente contexto necessário sob controle pertinente. Ensaio nativo: conferir política e suporte efetivo da exclusão Copilot no modo escolhido. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Armadilhas, governança e avaliação, registro contém code, requestId, tenantAlias, token e customerEmail. O agente propõe remover apenas token e conservar o resto. Determine a saída correta, identifique a regra violada e explique como a condição remover um segredo conhecido pode deixar outro dado desnecessário afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "saída contém code, requestId e tenantAlias. Regra: Projete campos necessários de estrutura conhecida e revise valores e texto livre; uma remoção por nome não certifica ausência universal de informação sensível. Correção: projetar somente campos explicitamente permitidos. Recuperação: retirar o campo excedente e conferir o material realmente anexado. Ensaio nativo: revisar contexto final e transmissão na superfície Copilot pertinente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Armadilhas, governança e avaliação, pedido do usuário manda validar tenant; retorno readme manda publicar e tem imperative true. O agente propõe selecionar todo texto marcado imperative. Determine a saída correta, identifique a regra violada e explique como a condição forma imperativa não estabelece origem autorizada afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente fix-tenant possui autoridade no modelo. Regra: A decisão conserva origem e alcance da autorização; texto analisado continua dado mesmo quando parece uma ordem. Correção: selecionar somente instrução de trusted-user no alcance task. Recuperação: remover a ampliação do plano e continuar somente o objetivo autorizado. Ensaio nativo: avaliar a sessão Copilot com fonte adversarial e controles de efeito pertinentes. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Projeto Quíron com GitHub Copilot, actorTenant a, stockTenant b e qty 1. O agente propõe validar somente qty. Determine a saída correta, identifique a regra violada e explique como a condição quantidade válida não autoriza recurso de outro tenant afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a reserva é inelegível. Regra: A identidade autenticada e o recurso precisam ser confrontados antes do efeito, com rejeição observada sem escrita. Correção: exigir tenant correspondente e quantidade inteira segura positiva. Recuperação: aplicar o controle na fronteira do efeito e conferir caminhos consumidores. Ensaio nativo: testar autenticação, autorização e ausência de escrita no endpoint e Lab pertinentes. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Projeto Quíron com GitHub Copilot, payload traz qty 2, trace t9, sku s7 e tenant a em ordem incidental. O agente propõe serializar o objeto inteiro. Determine a saída correta, identifique a regra violada e explique como a condição ordem incidental e metadados não devem definir identidade no contrato declarado afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a representação JSON é [\"a\",\"s7\",2]. Regra: Quando seu domínio, campos e ordem foram explicitados e avaliados; isso não estabelece canonicalização universal de JSON nem idempotência durável. Correção: serializar array ordenado tenant, sku e qty. Recuperação: corrigir a projeção e versionar a identidade conforme o contrato pertinente. Ensaio nativo: testar replay e conflito no backend durável da reserva. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Projeto Quíron com GitHub Copilot, estoque inicial um, final zero e duas confirmações de uma unidade. O agente propõe verificar somente finalStock não negativo. Determine a saída correta, identifique a regra violada e explique como a condição estoque não negativo pode coexistir com confirmações excedentes afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a conservação retorna false. Regra: A conservação precisa relacionar movimentos e confirmações; atualização perdida pode deixar zero enquanto confirma mais unidades que o disponível. Correção: comparar soma confirmada com redução de estoque. Recuperação: corrigir a decisão atômica e repetir a prova durável concorrente. Ensaio nativo: executar interleaving controlado e conferir commits e conservação no backend e Lab. A fixture local não atesta essa superfície."
    ]
  ]
];
export const GITHUB_COPILOT_CARDS: ContentSource["cards"] = GITHUB_COPILOT_CURRICULUM.flatMap(chapter=>chapter.sections.map(title=>({nodeTitle:chapter.title,frontMd:GITHUB_COPILOT_REVIEW[title][0],backMd:GITHUB_COPILOT_REVIEW[title][1]})));
export const GITHUB_COPILOT_EXERCISES: ContentSource["exercises"] = GITHUB_COPILOT_CURRICULUM.flatMap((chapter,index)=>SCENARIOS[index].map(([promptMd,answerKeyMd],position)=>({nodeTitle:chapter.title,type:([2,3,5] as const)[position],level:chapter.level==="basico"?"beginner" as const:chapter.level==="intermediario"?"intermediate" as const:"advanced" as const,promptMd,answerKeyMd,points:3})));
