import type { ContentSource } from "./types";
import { LOVABLE_CURRICULUM } from "./lovableCurriculum";
type Review=[question:string,answer:string,failure:string];
export const LOVABLE_REVIEW: Record<string,Review> = {
  "Brief com usuário, tarefa e resultado": [
    "Como um brief distingue tela pronta de tarefa concluída?",
    "Declare usuário, jornada, restrições e observações do resultado, incluindo o estado que deve permanecer protegido no caso negativo.",
    "O operador recebe confirmação apesar de um saldo incorreto."
  ],
  "Projeto, workspace e versão observada": [
    "Que identidade acompanha uma observação feita na preview?",
    "Projeto, revisão e superfície delimitam o que foi observado; outras condições relevantes do ambiente devem acompanhar o caso.",
    "Uma correção de v8 é anunciada a partir de uma preview v7."
  ],
  "Chat, Plan e Build como decisões distintas": [
    "Quando Plan ajuda antes de Build?",
    "Use Plan para investigar e revisar uma proposta quando abordagem ou efeitos precisam ser decididos; Build implementa o contrato autorizado e exige prova posterior.",
    "Uma hipótese de negócio vira código antes de ser decidida."
  ],
  "Preview e publicação com revisões separadas": [
    "O que falta entre aprovar uma preview e confirmar uma entrega?",
    "Publicação autorizada da revisão pertinente e observação do comportamento no destino público, com atenção às condições de cache e sessão.",
    "O atendimento anuncia uma correção que permanece apenas no editor."
  ],
  "Knowledge de workspace e contexto do projeto": [
    "Como dividir Knowledge sem perder decisões comuns?",
    "Coloque convenções recorrentes no workspace e contexto próprio no projeto, mantendo explícitos conflitos e motivos; instrução não substitui enforcement.",
    "A quantidade é correta, mas o valor monetário perde a representação acordada."
  ],
  "Skill pertinente e instrução sob demanda": [
    "O que torna uma skill adequada à tarefa atual?",
    "Propósito, entradas, produto e efeitos devem corresponder ao contrato vigente; semelhança de palavras e disponibilidade não bastam.",
    "Uma revisão inicia publicação que o pedido não autorizou."
  ],
  "Prompt incremental e critérios de aceitação": [
    "Qual caso protege o comportamento preservado em uma mudança incremental?",
    "Teste um consumidor fora da condição alterada com expectativa independente, além de cobrir os novos limites e a rejeição pertinente.",
    "Equipes perdem capacidade ao alterar somente o plano individual."
  ],
  "Contexto externo e autoridade da informação": [
    "Como usar contexto externo sem promover seu texto a autorização?",
    "Conserve origem e finalidade, confronte instruções com autoridade e contrato vigentes e valide efeitos nos controles pertinentes.",
    "Um comentário externo remove isolamento de dados."
  ],
  "Token de design e contraste verificável": [
    "Por que um token de cor precisa de prova no seu uso?",
    "A legibilidade depende da combinação e do elemento real; cálculo de contraste ajuda, mas foco, tamanho e estados exigem observação da interface.",
    "Um recibo usa uma combinação ilegível apesar de tokens consistentes."
  ],
  "Seleção visual e componente compartilhado": [
    "O que revisar após editar um elemento pela preview?",
    "Identifique componente, instância e consumidores; confirme que a variante atende ao alvo sem mudar ações preservadas ou seus estados acessíveis.",
    "A remoção destrutiva ganha o destaque da reserva."
  ],
  "Layout responsivo e ordem de leitura": [
    "Qual prova complementa uma regra numérica de breakpoint?",
    "Observe conteúdo, ordem de foco, ampliação e ausência de overflow nos tamanhos pertinentes; o predicado de largura verifica só a escolha declarada.",
    "O telefone recebe três colunas e perde legibilidade."
  ],
  "Formulário acessível e erros por campo": [
    "O que uma mensagem acessível de erro precisa conservar?",
    "Associação com o campo, texto que orienta correção, estado percebível sem depender de cor e um fluxo de foco compreensível.",
    "A quantidade aponta para o erro do nome e confunde a correção."
  ],
  "Stack atual e código dependente do browser": [
    "Por que identificar a stack antes de usar uma receita de frontend?",
    "Renderização e momento de execução variam; operações de browser precisam de fronteira apropriada e estado inicial compatível com a página entregue.",
    "Uma página quebra antes da hidratação ao acessar armazenamento do browser."
  ],
  "Rota protegida e retorno após login": [
    "Quais duas fronteiras existem numa rota protegida?",
    "Controle de navegação e autorização do recurso são distintos; retorno deve ser validado e dados precisam ser protegidos no serviço ou política pertinente.",
    "O login redireciona o usuário para um domínio que não pertence à aplicação."
  ],
  "Estado de recurso e resposta atrasada": [
    "Como impedir que uma resposta antiga reverta o filtro atual?",
    "Conserve identidade da consulta e aplique a resposta somente ao estado correspondente, mantendo loading, vazio e erro distintos.",
    "O filtro mostra arquivados enquanto a lista volta a exibir ativos."
  ],
  "Filtro, paginação e identidade da consulta": [
    "O que deve participar da identidade de uma consulta?",
    "Inclua dimensões que mudam a resposta e sua autorização, e revise invalidação e reset de página; cache não substitui proteção da fonte.",
    "A segunda página reutiliza itens da primeira."
  ],
  "Entidade de domínio e migração aditiva": [
    "Por que uma migração aditiva precisa preservar dados conhecidos?",
    "O novo campo deve ter significado e transição definida; acrescentar default não autoriza substituir fatos existentes nem garante compatibilidade dos consumidores.",
    "Reservas confirmadas voltam a pending durante a evolução do modelo."
  ],
  "Identidade autenticada e isolamento de tenant": [
    "Qual identidade deve sustentar autorização de tenant?",
    "A relação verificada do ator autenticado com o recurso e a operação; payload e UI não constituem autoridade para atravessar tenants.",
    "Um usuário de t1 grava uma reserva no tenant t2."
  ],
  "RLS e operação autorizada por linha": [
    "Por que uma atualização exige examinar os valores propostos?",
    "Autorização da linha atual não permite transferi-la a outro tenant; a política precisa proteger a transição e a operação efetivamente executada.",
    "Uma linha autorizada é transferida a um tenant indevido."
  ],
  "Paginação estável e minimização de resposta": [
    "O que torna uma resposta de lista revisável?",
    "Ordem declarada com desempate, paginação coerente e projeção mínima por propósito, além de autorização da fonte e tratamento de mudanças concorrentes.",
    "A lista oscila entre páginas e expõe notas internas."
  ],
  "Sessão expirada e ação de recuperação": [
    "Como recuperar uma sessão expirada durante a reserva?",
    "Identifique expiração, preserve intenção pertinente e reautentique; confirme o estado da operação antes de repetir uma escrita e diferencie falta de permissão.",
    "A aplicação trata uma sessão no limite como válida e anuncia sucesso indevido."
  ],
  "Bucket privado e referência de objeto": [
    "Que prova falta além do rótulo de bucket privado?",
    "Autorização do objeto e comportamento das URLs emitidas devem ser testados com identidades pertinentes; organização de caminho e UI não asseguram privacidade.",
    "Um comprovante de t2 pode ser lido por t1."
  ],
  "Validação de upload e limite conhecido": [
    "Por que validação de upload no browser é insuficiente?",
    "Metadados e chamadas são controláveis; o serviço precisa validar limite e conteúdo pelo método adequado e tratar resultado, acesso e limpeza de objetos.",
    "Um arquivo acima do limite é aceito porque seu mime parece correto."
  ],
  "Secret de backend e variável pública": [
    "Como decidir onde uma configuração pode ser usada?",
    "Avalie sensibilidade, destino e consumidor; valores de browser são públicos e credenciais privilegiadas precisam de mecanismo server e revisão de artefatos e logs.",
    "Uma chave de pagamento é incorporada ao bundle client."
  ],
  "Entrada validada antes do efeito externo": [
    "O que deve acontecer antes de uma chamada externa de cobrança?",
    "Parsing, validação runtime, autorização do recurso e cálculo por fonte confiável devem anteceder o efeito; depois é necessário observar resultado e repetição.",
    "Uma entrada fora do contrato alcança a cobrança externa."
  ],
  "Connector de workspace e conta do usuário": [
    "Que identidade precisa acompanhar um connector?",
    "Proprietário, escopo, finalidade e caminho de execução devem corresponder ao efeito; conta de workspace e conta de cada usuário não são intercambiáveis.",
    "Uma ação pessoal usa a conta compartilhada da equipe."
  ],
  "Assinatura de webhook e corpo original": [
    "Por que preservar o corpo original de um webhook?",
    "A assinatura pode depender dos bytes recebidos; use o método oficial, valide autenticidade e replay e depois confronte o evento com a relação de domínio.",
    "Um evento legítimo é rejeitado ou uma verificação é feita sobre representação diferente da exigida."
  ],
  "Idempotência e evento já processado": [
    "O que falta entre deduplicação em memória e idempotência operacional?",
    "Persistência, coordenação com o efeito e testes de concorrência, reinício e falhas precisam assegurar a política; um predicado serial não prova exactly-once.",
    "Uma notificação repetida duplica o crédito."
  ],
  "Frontend test e expectativa independente": [
    "O que evita uma assertion que apenas repete a implementação?",
    "Uma expectativa independente baseada no contrato e uma fixture discriminante detectam o defeito; teste do consumidor e execução observada completam a prova pertinente.",
    "O resumo apresenta reserva pending como confirmada."
  ],
  "Browser testing e observação do fluxo": [
    "O que transforma interação no browser em prova de uma jornada?",
    "Observações de resultado por etapa, associadas à revisão, identidade e ambiente, precisam cobrir o fluxo; clique, screenshot ou console limpo isolados não bastam.",
    "O fluxo é aprovado sem observar o recibo final."
  ],
  "Scan de segurança e cobertura declarada": [
    "Como interpretar um scan sem achados?",
    "Ele informa resultado nas classes cobertas e na revisão executada; regras de domínio e métodos não exercitados continuam exigindo prova específica.",
    "Uma falha de acesso cruzado é ignorada porque o painel de scan está verde."
  ],
  "Logs úteis sem credencial nem conteúdo privado": [
    "Como tornar um log útil e minimizado?",
    "Defina campos por propósito e origem, preserve correlação e códigos de condição e revise exceções; projeção local não atesta todos os caminhos ou retenção.",
    "O token e o comprovante são copiados para o log de erro."
  ],
  "Sincronização e identidade da branch ativa": [
    "O que conferir antes de usar Git sync como evidência de uma correção?",
    "Vínculo de projeto, branch ativa, revisão consumida e status de sync delimitam o artefato; conexão existente e commit em outra branch não bastam.",
    "A preview é aprovada usando um commit que está fora da branch ativa."
  ],
  "Histórico de código e estado dos dados": [
    "Por que voltar uma versão não encerra a recuperação?",
    "Código, schema, dados e efeitos externos têm alcances distintos; confirme compatibilidade e trate cada efeito pelo mecanismo e política pertinentes.",
    "O relato anuncia estoque recuperado apenas porque o código voltou a v8."
  ],
  "Draft, remix e dependências não copiadas": [
    "O que revisar ao copiar ou explorar um projeto?",
    "Inventarie código, dados, secrets e conexões e confira o alcance do mecanismo; aparência no destino não comprova dependências nem efeitos operacionais.",
    "Um remix anuncia pagamento pronto sem credencial configurada."
  ],
  "Revisão com conflito e base preservada": [
    "Como preservar uma edição alheia que mudou a base?",
    "Confira a revisão ou digest pertinente, releia mudanças e refaça a proposta sobre a base atual; comparação de bytes detecta diferença, mas não resolve semântica nem corrida.",
    "O patch apaga a mensagem corrigida por um colaborador."
  ],
  "Release com revisão e gates pertinentes": [
    "Que condições tornam um gate pertinente ao release?",
    "Método, resultado e base devem cobrir o comportamento da revisão final; pending e prova de outra revisão não viram aprovação por associação.",
    "O release utiliza uma política de tenant nunca testada na revisão final."
  ],
  "Domínio customizado e estado DNS observado": [
    "O que falta além de adicionar um domínio no editor?",
    "Registros pertinentes, resolução observada e HTTPS devem ser conferidos no hostname e momento indicados; configuração e propagação são evidências distintas.",
    "Um domínio é anunciado pronto enquanto HTTPS ainda falha."
  ],
  "SEO, metadados e conteúdo entregue": [
    "Como validar metadados sem expor conteúdo privado?",
    "Escolha fonte pública e canonical pertinente e examine a resposta real da URL e da stack; projeção local não atesta crawler, indexação ou ranking.",
    "Uma nota interna aparece na descrição pública do catálogo."
  ],
  "Uso, custo e limite por operação": [
    "Que dimensão precisa entrar num orçamento de operação?",
    "Quantidade, unidade, repetição e consumo observado devem acompanhar a estimativa; valores atuais e enforcement precisam de confirmação na plataforma e no provedor.",
    "A estimativa ignora duas das três chamadas do relatório."
  ],
  "Protótipo visual e função realmente disponível": [
    "Como apresentar uma capacidade ainda demonstrativa?",
    "Identifique dados e efeitos sintéticos e limite a mensagem ao comportamento observado; promoção operacional exige prova do backend e da jornada pertinente.",
    "O usuário recebe confirmação de pagamento sem cobrança verificada."
  ],
  "Resultado desconhecido e retry controlado": [
    "Por que timeout não deve virar retry automático de escrita?",
    "O efeito pode ter ocorrido; conserve identidade da operação, reconcilie resultado e aplique a política de idempotência antes de repetir.",
    "Uma reserva confirmada no serviço é duplicada após timeout do client."
  ],
  "Migração de stack e biblioteca incompatível": [
    "O que revisar além de build após migrar a stack?",
    "Fases de execução, dependências, páginas diretas, rotas protegidas e integrações precisam de provas pertinentes; instalação e build não cobrem todos os caminhos.",
    "O painel quebra no servidor por uma dependência que parecia instalada corretamente."
  ],
  "Rollback de versão e compatibilidade de schema": [
    "Qual condição precisa ser verificada antes de rollback?",
    "Código candidato, schema, dados e efeitos precisam permanecer compatíveis; presença de campos é apenas parte da prova e restauração não autoriza apagar fatos atuais.",
    "A versão antiga volta e quebra ao ler legacyCode ausente."
  ],
  "Reserva com intenção e identidade do ator": [
    "Como ligar intenção de UI e operação de reserva?",
    "Defina identidade com escopo do ator verificado e conteúdo pertinente, conserve estado observado e teste repetição e conflito no backend durável.",
    "Duas intenções de tenants distintos colidem na mesma referência."
  ],
  "Total monetário e quantidade inteira": [
    "Como manter coerência entre resumo e cobrança?",
    "Use representação monetária definida, quantidade validada e preço de fonte autorizada; recompute no serviço e confira valor confirmado sem confiar no total do client.",
    "O resumo ou cobrança arredonda 597 para 600 centavos."
  ],
  "Conservação de estoque em atualização condicional": [
    "O que falta entre predicado de estoque e conservação concorrente?",
    "A condição precisa ser aplicada atomicamente pelo mecanismo durável e testada com disputa real; transição serial define regra, mas não prova lock ou transação.",
    "Uma operação com versão obsoleta debita o último item."
  ],
  "Entrega completa e fronteira da evidência": [
    "O que um handoff precisa conservar para uma entrega verificável?",
    "Artefatos, revisão, método, resultados e limites devem permitir retomada; cada afirmação fica no alcance da execução observada e gates ausentes permanecem explícitos.",
    "O handoff anuncia browser e Cloud aprovados a partir de exemplos locais."
  ]
};
const SCENARIOS: [string,string][][] = [
  [
    [
      "No trabalho de Produto, projeto e primeiro contrato Lovable, brief exige recibo e saldo; teste observa apenas recibo. O agente propõe aceitar recibo como cobertura de todo o brief. Determine a saída correta, identifique a regra violada e explique como a condição confirmação visual pode existir sem alteração correta de estoque afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a lacuna é saldo. Regra: Declare usuário, jornada, restrições e observações do resultado, incluindo o estado que deve permanecer protegido no caso negativo. Correção: listar requisitos ainda sem observação. Recuperação: completar a observação do saldo e revisar a escrita. Ensaio nativo: construir e testar a jornada de reserva no projeto Lovable autorizado. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Produto, projeto e primeiro contrato Lovable, projeto q coincide; revisão observada v7 difere de v8. O agente propõe comparar somente o projeto. Determine a saída correta, identifique a regra violada e explique como a condição nome de projeto igual não fixa a versão executada afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "revision aparece como diferença. Regra: Projeto, revisão e superfície delimitam o que foi observado; outras condições relevantes do ambiente devem acompanhar o caso. Correção: comparar projeto e revisão de forma separada. Recuperação: abrir a versão correta e reproduzir o caso. Ensaio nativo: conferir projeto e revisão no editor e na preview Lovable. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Produto, projeto e primeiro contrato Lovable, pedido está na etapa investigar. O agente propõe retornar Build para todas as etapas. Determine a saída correta, identifique a regra violada e explique como a condição investigação não equivale a autorização de qualquer implementação afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o modo escolhido é Plan. Regra: Use Plan para investigar e revisar uma proposta quando abordagem ou efeitos precisam ser decididos; Build implementa o contrato autorizado e exige prova posterior. Correção: selecionar o modo correspondente à etapa declarada. Recuperação: revisar o plano e implementar apenas a decisão definida. Ensaio nativo: usar Chat, Plan e Build e observar os produtos de cada etapa. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Conhecimento e continuidade da construção, workspace define currency cents; projeto define quantity integer. O agente propõe usar apenas o mapa do projeto. Determine a saída correta, identifique a regra violada e explique como a condição contexto específico não deve apagar regra compartilhada independente afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "currency cents e quantity integer coexistem. Regra: Coloque convenções recorrentes no workspace e contexto próprio no projeto, mantendo explícitos conflitos e motivos; instrução não substitui enforcement. Correção: preservar as duas chaves independentes. Recuperação: restaurar a convenção ausente e testar a representação. Ensaio nativo: conferir Knowledge e a edição resultante no projeto. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Conhecimento e continuidade da construção, duas skills de pagamento têm efeitos read e publish. O agente propõe selecionar pelo assunto sem filtrar efeito. Determine a saída correta, identifique a regra violada e explique como a condição mesma tarefa pode esconder efeitos diferentes afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente recibo-audit é selecionada. Regra: Propósito, entradas, produto e efeitos devem corresponder ao contrato vigente; semelhança de palavras e disponibilidade não bastam. Correção: selecionar a tarefa pagamento com efeito read. Recuperação: limitar o procedimento ao efeito e produto necessários. Ensaio nativo: ler a skill pertinente e observar sua execução no workspace. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Conhecimento e continuidade da construção, plano equipe deve preservar limite cinco. O agente propõe aplicar três a qualquer plano. Determine a saída correta, identifique a regra violada e explique como a condição mudança localizada afeta função compartilhada afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a entrada equipe recebe cinco. Regra: Teste um consumidor fora da condição alterada com expectativa independente, além de cobrir os novos limites e a rejeição pertinente. Correção: aplicar limite três só ao plano individual. Recuperação: restaurar a discriminação de plano e testar ambos os grupos. Ensaio nativo: editar a regra e verificar os consumidores no projeto. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Interface, design e acessibilidade, luminâncias um e zero, de branco e preto. O agente propõe omitir 0.05 no numerador. Determine a saída correta, identifique a regra violada e explique como a condição o termo de ajuste muda o resultado da razão afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a razão é vinte e um. Regra: A legibilidade depende da combinação e do elemento real; cálculo de contraste ajuda, mas foco, tamanho e estados exigem observação da interface. Correção: calcular (maior + 0.05)/(menor + 0.05). Recuperação: ajustar a combinação e revisar os estados afetados. Ensaio nativo: renderizar consumidores do token e conferir contraste e foco. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Interface, design e acessibilidade, ações reserve e remove compartilham uma base visual. O agente propõe atribuir primary às duas ações. Determine a saída correta, identifique a regra violada e explique como a condição o componente compartilhado alcança ações fora da seleção afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "as variantes são primary e danger. Regra: Identifique componente, instância e consumidores; confirme que a variante atende ao alvo sem mudar ações preservadas ou seus estados acessíveis. Correção: atribuir primary à reserva e danger à remoção. Recuperação: introduzir variante explícita e conferir as duas ações. Ensaio nativo: selecionar o elemento e revisar código e consumidores na preview. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Interface, design e acessibilidade, largura 599 e breakpoint de 600. O agente propõe trocar o limiar para 500. Determine a saída correta, identifique a regra violada e explique como a condição o pixel imediatamente anterior ao limite distingue as políticas afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o resultado é uma coluna. Regra: Observe conteúdo, ordem de foco, ampliação e ausência de overflow nos tamanhos pertinentes; o predicado de largura verifica só a escolha declarada. Correção: usar uma coluna abaixo de 600 e três a partir de 600. Recuperação: corrigir limiar e fluxo de leitura e repetir os tamanhos relevantes. Ensaio nativo: testar preview responsiva e navegação por teclado. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Código gerado, rotas e estado, execução sem browser e sem preferência armazenada. O agente propõe ler a preferência sem distinguir o ambiente. Determine a saída correta, identifique a regra violada e explique como a condição ausência de window exige um estado inicial definido afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o resultado é compact. Regra: Renderização e momento de execução variam; operações de browser precisam de fronteira apropriada e estado inicial compatível com a página entregue. Correção: usar compact como valor inicial no servidor. Recuperação: separar leitura de browser e fallback inicial e verificar a rota. Ensaio nativo: inspecionar a stack e carregar diretamente a rota renderizada. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Código gerado, rotas e estado, returnTo contém https://outside.example. O agente propõe devolver qualquer destino informado. Determine a saída correta, identifique a regra violada e explique como a condição parâmetro de retorno não deve autorizar domínio externo afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o destino é /reservas. Regra: Controle de navegação e autorização do recurso são distintos; retorno deve ser validado e dados precisam ser protegidos no serviço ou política pertinente. Correção: aceitar caminho interno simples e usar /reservas para URL externa. Recuperação: validar o destino resolvido e reforçar autorização do recurso. Ensaio nativo: testar login, retorno interno e consulta sem permissão. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Código gerado, rotas e estado, estado corrente r2 com arquivados e resposta atrasada r1 com ativos. O agente propõe substituir itens por toda resposta recebida. Determine a saída correta, identifique a regra violada e explique como a condição ordem de chegada difere da ordem de intenção do usuário afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a lista permanece arquivados. Regra: Conserve identidade da consulta e aplique a resposta somente ao estado correspondente, mantendo loading, vazio e erro distintos. Correção: aceitar resposta só quando sua identidade coincide com a atual. Recuperação: ligar resposta à chave vigente e testar a troca rápida. Ensaio nativo: reproduzir respostas fora de ordem na interface e conferir estado. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Cloud, modelagem e autorização dos dados, registro a sem status e registro b confirmed. O agente propõe sobrescrever todos os estados com pending. Determine a saída correta, identifique a regra violada e explique como a condição default não deve apagar um estado já conhecido afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "os estados ficam pending e confirmed. Regra: O novo campo deve ter significado e transição definida; acrescentar default não autoriza substituir fatos existentes nem garante compatibilidade dos consumidores. Correção: adicionar pending apenas quando status estiver ausente. Recuperação: preservar valores existentes e verificar o preenchimento pertinente. Ensaio nativo: revisar migration, dependências e dados em Cloud autorizado. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Cloud, modelagem e autorização dos dados, ator t1 tenta recurso t2 enviando payloadTenant t2. O agente propõe comparar payloadTenant com resourceTenant. Determine a saída correta, identifique a regra violada e explique como a condição payload pode ser controlado pelo cliente afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a operação não é autorizada. Regra: A relação verificada do ator autenticado com o recurso e a operação; payload e UI não constituem autoridade para atravessar tenants. Correção: comparar tenant autenticado com tenant do recurso. Recuperação: autorizar pelo ator verificado antes da escrita. Ensaio nativo: testar acesso cruzado com duas identidades e medir o estado. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Cloud, modelagem e autorização dos dados, ator t1 atualiza linha t1 propondo tenant t2. O agente propõe verificar somente beforeTenant. Determine a saída correta, identifique a regra violada e explique como a condição linha legível não autoriza qualquer novo valor afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a transição é rejeitada. Regra: Autorização da linha atual não permite transferi-la a outro tenant; a política precisa proteger a transição e a operação efetivamente executada. Correção: exigir tenant do ator tanto antes quanto depois. Recuperação: proteger valores propostos e revisar chamadas privilegiadas. Ensaio nativo: executar atualização cruzada e legítima sob políticas reais. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Autenticação, arquivos e secrets, expiresAt 100 e now 100. O agente propõe expirar somente quando expiresAt é menor que now. Determine a saída correta, identifique a regra violada e explique como a condição o instante de igualdade também encerra validade no contrato afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o estado é expired. Regra: Identifique expiração, preserve intenção pertinente e reautentique; confirme o estado da operação antes de repetir uma escrita e diferencie falta de permissão. Correção: considerar expirada a sessão no limite inclusivo. Recuperação: corrigir limite e retomar a intenção após conferir o efeito. Ensaio nativo: testar expiração durante a jornada e observar resposta e estado. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Autenticação, arquivos e secrets, bucket private, objeto t2 e ator t1. O agente propõe aceitar todo objeto em bucket private. Determine a saída correta, identifique a regra violada e explique como a condição private não concede acesso a qualquer usuário autenticado afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a leitura não é permitida. Regra: Autorização do objeto e comportamento das URLs emitidas devem ser testados com identidades pertinentes; organização de caminho e UI não asseguram privacidade. Correção: exigir bucket privado e tenant correspondente ao ator. Recuperação: corrigir a política do objeto e avaliar referências já distribuídas. Ensaio nativo: testar leitura direta e URLs de storage com duas identidades. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Autenticação, arquivos e secrets, arquivo application/pdf com 1001 bytes e limite 1000. O agente propõe verificar somente o tipo. Determine a saída correta, identifique a regra violada e explique como a condição mime permitido não elimina limite de tamanho afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o arquivo é rejeitado. Regra: Metadados e chamadas são controláveis; o serviço precisa validar limite e conteúdo pelo método adequado e tratar resultado, acesso e limpeza de objetos. Correção: exigir tipo permitido e tamanho menor ou igual ao limite. Recuperação: validar no serviço e observar objetos criados ou órfãos. Ensaio nativo: testar upload direto, conteúdo e limites no backend pertinente. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Edge Functions e integrações, qty é a string 3, não número JSON. O agente propõe converter qty com Number antes de validar. Determine a saída correta, identifique a regra violada e explique como a condição tipagem estática não valida JSON em runtime afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a entrada é inválida. Regra: Parsing, validação runtime, autorização do recurso e cálculo por fonte confiável devem anteceder o efeito; depois é necessário observar resultado e repetição. Correção: exigir número inteiro positivo sem coerção. Recuperação: validar e autorizar antes da chamada e revisar o estado. Ensaio nativo: chamar a Edge Function com payloads inválidos e medir efeitos. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Edge Functions e integrações, propósito personalCalendar. O agente propõe selecionar workspace para todos os propósitos. Determine a saída correta, identifique a regra violada e explique como a condição conexão compartilhada não representa cada conta pessoal afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o proprietário necessário é user. Regra: Proprietário, escopo, finalidade e caminho de execução devem corresponder ao efeito; conta de workspace e conta de cada usuário não são intercambiáveis. Correção: selecionar conexão do usuário para calendário pessoal. Recuperação: vincular a conta adequada e testar revogação e ausência de acesso. Ensaio nativo: conferir connector e consentimento da identidade pertinente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Edge Functions e integrações, corpo literal { \"status\": \"paid\" } e chave sintética demo-key. O agente propõe reconstruir JSON compacto antes de assinar. Determine a saída correta, identifique a regra violada e explique como a condição parse e stringify alteram bytes relevantes à assinatura afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o digest coincide com o oracle do corpo literal. Regra: A assinatura pode depender dos bytes recebidos; use o método oficial, valide autenticidade e replay e depois confronte o evento com a relação de domínio. Correção: calcular HMAC sobre os bytes do corpo original. Recuperação: preservar corpo original e validar relação e timestamp pertinentes. Ensaio nativo: testar assinatura e replay com protocolo oficial e eventos autorizados. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Testes, segurança e investigação, reservas c1 confirmed, p2 pending e c3 confirmed. O agente propõe incluir pending como confirmado. Determine a saída correta, identifique a regra violada e explique como a condição registro pending diferencia seleção válida de filtro permissivo afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o resultado é c1 e c3. Regra: Uma expectativa independente baseada no contrato e uma fixture discriminante detectam o defeito; teste do consumidor e execução observada completam a prova pertinente. Correção: selecionar somente IDs de reservas confirmed. Recuperação: usar oracle independente e cobrir estado excluído. Ensaio nativo: escrever e executar frontend test do consumidor no projeto. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Testes, segurança e investigação, prova registra submit e response, mas não receipt. O agente propõe considerar submit suficiente para aprovar a jornada. Determine a saída correta, identifique a regra violada e explique como a condição clique não demonstra recibo persistido afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "receipt permanece como lacuna. Regra: Observações de resultado por etapa, associadas à revisão, identidade e ambiente, precisam cobrir o fluxo; clique, screenshot ou console limpo isolados não bastam. Correção: identificar observações obrigatórias ausentes. Recuperação: completar a observação final e investigar a fronteira ausente. Ensaio nativo: executar jornada no browser e conferir resultados e persistência. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Testes, segurança e investigação, requisitos dependency secret crossTenant; scan cobre dependency secret e tem zero achados. O agente propõe declarar cobertura integral quando findings é zero. Determine a saída correta, identifique a regra violada e explique como a condição zero achados não expande a cobertura da ferramenta afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "crossTenant continua sem prova por esse scan. Regra: Ele informa resultado nas classes cobertas e na revisão executada; regras de domínio e métodos não exercitados continuam exigindo prova específica. Correção: listar requisitos fora da cobertura declarada. Recuperação: limitar a conclusão à cobertura e testar o requisito ausente. Ensaio nativo: executar scan e ensaio de autorização cruzada separadamente. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Git, histórico e trabalho colaborativo, branch ativa main; commits m1 main e f2 feature-reserve. O agente propõe incluir commits de todas as branches. Determine a saída correta, identifique a regra violada e explique como a condição commit em outra branch não valida a preview atual afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente m1 pertence ao recorte. Regra: Vínculo de projeto, branch ativa, revisão consumida e status de sync delimitam o artefato; conexão existente e commit em outra branch não bastam. Correção: selecionar commits da branch ativa. Recuperação: alinhar a base autorizada e verificar o artefato consumido. Ensaio nativo: conferir vínculo, branch e revisão sincronizada em Lovable e Git. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Git, histórico e trabalho colaborativo, código v9 volta a v8 e estoque confirmado é sete. O agente propõe restaurar também stock para dez sem prova de backup. Determine a saída correta, identifique a regra violada e explique como a condição snapshot de código não cobre automaticamente dados confirmados afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "codeRevision v8 e stock sete. Regra: Código, schema, dados e efeitos externos têm alcances distintos; confirme compatibilidade e trate cada efeito pelo mecanismo e política pertinentes. Correção: restaurar revisão do código preservando estoque. Recuperação: verificar compatibilidade e aplicar recuperação de domínio pertinente. Ensaio nativo: restaurar versão autorizada e observar dados e efeitos separadamente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Git, histórico e trabalho colaborativo, destino possui code; pagamento também exige paymentSecret. O agente propõe considerar code suficiente para toda capacidade. Determine a saída correta, identifique a regra violada e explique como a condição interface copiada pode depender de secret ausente afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "catálogo ready e pagamento pending. Regra: Inventarie código, dados, secrets e conexões e confira o alcance do mecanismo; aparência no destino não comprova dependências nem efeitos operacionais. Correção: classificar prontidão por todas as dependências. Recuperação: configurar apenas dependências autorizadas e repetir a jornada. Ensaio nativo: conferir dependências no draft ou remix e testar o destino. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Publicação, domínio e operação, release r4 com tenant passed de r3. O agente propõe verificar status sem revisão. Determine a saída correta, identifique a regra violada e explique como a condição status aprovado em outra revisão não cobre a final afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "tenant é a lacuna. Regra: Método, resultado e base devem cobrir o comportamento da revisão final; pending e prova de outra revisão não viram aprovação por associação. Correção: exigir passed na revisão r4 para cada gate. Recuperação: reexecutar a prova obsoleta e revisar o artefato final. Ensaio nativo: executar gates pertinentes e conferir a revisão publicada. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Publicação, domínio e operação, target observado coincide, mas tlsReady é false. O agente propõe aprovar apenas pela igualdade de target. Determine a saída correta, identifique a regra violada e explique como a condição DNS correto não prova certificado disponível afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o estado é pending. Regra: Registros pertinentes, resolução observada e HTTPS devem ser conferidos no hostname e momento indicados; configuração e propagação são evidências distintas. Correção: exigir target correto e TLS pronto. Recuperação: corrigir a condição identificada sem apagar registros alheios. Ensaio nativo: conferir DNS e HTTPS do domínio autorizado. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Publicação, domínio e operação, página tem título e descrição públicos e nota interna. O agente propõe usar privateNote como description. Determine a saída correta, identifique a regra violada e explique como a condição nota interna não pertence à apresentação pública afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "description usa publicDescription e canonical público. Regra: Escolha fonte pública e canonical pertinente e examine a resposta real da URL e da stack; projeção local não atesta crawler, indexação ou ranking. Correção: usar apenas campos públicos nos metadados. Recuperação: corrigir a fonte e conferir a resposta do destino pertinente. Ensaio nativo: examinar HTML e metadados da página pública e protegida. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Armadilhas de produto e recuperação, mode live, mas backendVerified false. O agente propõe considerar mode live suficiente. Determine a saída correta, identifique a regra violada e explique como a condição rótulo live não comprova efeito real afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a capacidade permanece demonstration. Regra: Identifique dados e efeitos sintéticos e limite a mensagem ao comportamento observado; promoção operacional exige prova do backend e da jornada pertinente. Correção: exigir modo live e prova do backend para operational. Recuperação: corrigir mensagem e completar o backend antes da promoção. Ensaio nativo: executar a ação e observar chamada, resposta e efeito. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Armadilhas de produto e recuperação, estado de chamada unknown após timeout. O agente propõe retornar retry para qualquer estado não succeeded. Determine a saída correta, identifique a regra violada e explique como a condição ausência de resposta não demonstra ausência de efeito afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a próxima ação é reconcile. Regra: O efeito pode ter ocorrido; conserve identidade da operação, reconcilie resultado e aplique a política de idempotência antes de repetir. Correção: reconciliar antes de decidir repetição. Recuperação: consultar resultado confirmado e repetir só pelo contrato pertinente. Ensaio nativo: testar interrupção e reconciliação por operationId. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Armadilhas de produto e recuperação, target server com chart-old importTimeBrowser e util-safe. O agente propõe considerar installable suficiente para compatibilidade. Determine a saída correta, identifique a regra violada e explique como a condição pacote instalável ainda pode quebrar execução server afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "chart-old é a condição conhecida incompatível. Regra: Fases de execução, dependências, páginas diretas, rotas protegidas e integrações precisam de provas pertinentes; instalação e build não cobrem todos os caminhos. Correção: listar dependências que exigem browser no import. Recuperação: corrigir a fronteira da dependência e repetir as rotas afetadas. Ensaio nativo: testar páginas e integrações após a migração autorizada. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Projeto Quíron com Lovable e Lab Ágora, atores t1 e t2 compartilham intentId i7. O agente propõe comparar somente intentId. Determine a saída correta, identifique a regra violada e explique como a condição intenção isolada não define escopo comercial afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "as identidades são diferentes. Regra: Defina identidade com escopo do ator verificado e conteúdo pertinente, conserve estado observado e teste repetição e conflito no backend durável. Correção: comparar identidades compostas por tenant e intentId. Recuperação: corrigir escopo e reconciliar registros com evidência. Ensaio nativo: exercitar identidade e repetição no fluxo do Lab Ágora. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Projeto Quíron com Lovable e Lab Ágora, unitCents 199 e qty 3. O agente propõe arredondar preço em unidades e voltar a centavos. Determine a saída correta, identifique a regra violada e explique como a condição arredondar a unidade antes de multiplicar altera o total afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o total é 597 centavos. Regra: Use representação monetária definida, quantidade validada e preço de fonte autorizada; recompute no serviço e confira valor confirmado sem confiar no total do client. Correção: multiplicar centavos inteiros pela quantidade válida. Recuperação: corrigir representação e reconciliar valores pelo domínio. Ensaio nativo: comparar resumo e valor confirmado no fluxo do Lab. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Projeto Quíron com Lovable e Lab Ágora, stock um qty um, currentVersion dois e expectedVersion um. O agente propõe conferir apenas quantidade e debitar. Determine a saída correta, identifique a regra violada e explique como a condição saldo suficiente não torna uma base obsoleta válida afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "resultado conflict e stock um. Regra: A condição precisa ser aplicada atomicamente pelo mecanismo durável e testada com disputa real; transição serial define regra, mas não prova lock ou transação. Correção: rejeitar versão obsoleta preservando saldo. Recuperação: reler estado e repetir somente pelo contrato de intenção e versão. Ensaio nativo: executar disputa de reserva e observar saldo e confirmações no Lab. A fixture local não atesta essa superfície."
    ]
  ]
];
export const LOVABLE_CARDS: ContentSource["cards"] = LOVABLE_CURRICULUM.flatMap(chapter=>chapter.sections.map(title=>({nodeTitle:chapter.title,frontMd:LOVABLE_REVIEW[title][0],backMd:LOVABLE_REVIEW[title][1]})));
export const LOVABLE_EXERCISES: ContentSource["exercises"] = LOVABLE_CURRICULUM.flatMap((chapter,index)=>SCENARIOS[index].map(([promptMd,answerKeyMd],position)=>({nodeTitle:chapter.title,type:([2,3,5] as const)[position],level:chapter.level==="basico"?"beginner" as const:chapter.level==="intermediario"?"intermediate" as const:"advanced" as const,promptMd,answerKeyMd,points:3})));
