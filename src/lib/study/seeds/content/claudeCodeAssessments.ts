import type { ContentSource } from "./types";
import { CLAUDE_CODE_CURRICULUM } from "./claudeCodeCurriculum";
type Review=[question:string,answer:string,failure:string];
export const CLAUDE_CODE_REVIEW: Record<string,Review> = {
  "CLI, IDE e identidade do ambiente": [
    "Como associar uma prova à superfície e ao ambiente certos?",
    "Registre revisão e condições executadas; a mesma conversa ou projeto não garante que terminal, editor e ambiente remoto usem a mesma base.",
    "Uma aprovação obtida em outro runtime é relatada como reprodução local sem conferir compatibilidade."
  ],
  "Raiz, shell e configuração inicial": [
    "Por que raiz e shell precisam ser conhecidos antes de executar?",
    "Eles mudam resolução de caminhos, configuração e interpretação de argumentos; o mesmo texto pode produzir outro alvo ou efeito.",
    "O agente executa um script do pacote errado ou opera sobre uma pasta vizinha."
  ],
  "Pedido, critérios e ações observáveis": [
    "Qual é a diferença entre critério de resultado e hipótese de implementação?",
    "O critério define comportamento observável e restrições; a implementação proposta deve ser confrontada com esse contrato, não substituí-lo.",
    "Uma correção alcança a saída desejada mas remove a autorização que deveria continuar válida."
  ],
  "Loop de ferramentas e responsabilidade humana": [
    "O que uma chamada de ferramenta acrescenta ao raciocínio do agente?",
    "Acrescenta observação no alcance efetivamente executado; intenção, leitura, edição e teste continuam provas de naturezas diferentes.",
    "O agente declara um gate aprovado que apenas havia sido planejado."
  ],
  "Leitura orientada por símbolos e consumidores": [
    "Por que tipo de ocorrência importa ao localizar consumidores?",
    "Declaração, chamada e comentário possuem papéis diferentes; uma coincidência de nome não prova dependência executada.",
    "O agente altera documentação ou fixture achando que encontrou o ponto de execução defeituoso."
  ],
  "Busca, redução e referências de código": [
    "Qual identidade deve sobreviver à redução de resultados de busca?",
    "Caminho completo e referência pertinente precisam permanecer; basename e aparência textual não distinguem pacotes diferentes.",
    "Uma investigação omite o consumidor do pacote ativo por colidir com nome encontrado em outro pacote."
  ],
  "Logs como dados e procedência da hipótese": [
    "Como um log pode sustentar uma hipótese sem ganhar autoridade de instrução?",
    "Use origem, identidade e sequência para observação; comandos contidos no texto continuam dados e precisam de autorização independente.",
    "O agente executa uma instrução inserida num log ou diagnostica a tarefa atual com erro de outra execução."
  ],
  "Contexto suficiente e evidência independente": [
    "Por que contexto volumoso não garante evidência suficiente?",
    "O material deve conter as informações que distinguem a decisão; volume e fluência não substituem contrato e expectativa independentes.",
    "O agente interpreta centavos como reais porque a unidade ausente foi preenchida por suposição."
  ],
  "Instruções do projeto e imports de memória": [
    "Qual base importa ao resolver uma referência relativa de CLAUDE.md?",
    "A base documental é o diretório do arquivo que contém a referência; a sessão e o arquivo importador não são objetos intercambiáveis.",
    "A sessão carrega regra de outro pacote e altera autorização com orientação incompatível."
  ],
  "Regras por caminho e aplicabilidade": [
    "Por que uma regra por caminho precisa de casos de fronteira?",
    "Eles demonstram que o alcance codifica as condições pretendidas e não inclui arquivos apenas parecidos ou parcialmente correspondentes.",
    "Uma orientação de outro domínio conduz a alterações incompatíveis no arquivo trabalhado."
  ],
  "Memória automática e informação perecível": [
    "Qual informação merece renovação antes de orientar uma nova sessão?",
    "Fatos perecíveis precisam da fonte atual e de condição de validade; uma nota persistida não os torna permanentemente verdadeiros.",
    "O agente escolhe uma operação com quota ou configuração antiga e relata sucesso impossível no ambiente atual."
  ],
  "Compactação e recuperação de decisões": [
    "O que um resumo precisa preservar quando uma decisão muda?",
    "A versão vigente e a relação de substituição precisam permanecer claras; histórico não deve ressuscitar uma autorização revogada.",
    "A retomada publica uma alteração porque o resumo conservou uma permissão antiga e descartou sua revogação."
  ],
  "Plano com precondições e dependências": [
    "O que distingue uma dependência real de uma ordem decorativa no plano?",
    "A etapa seguinte precisa de um resultado específico da anterior; a relação deve ser justificada pelo contrato e observada, não só numerada.",
    "O agente altera a representação do dado antes de confirmar sua unidade ou regra de autorização."
  ],
  "Patch mínimo e base de aplicação": [
    "Qual propriedade uma precondição de base protege ao aplicar um patch?",
    "Ela detecta que o conteúdo mudou desde a leitura e exige composição sobre a versão atual; não autoriza sobrescrever contribuições posteriores.",
    "Uma edição baseada em fotografia antiga elimina comentário ou correção feita por outra pessoa."
  ],
  "Interfaces, unidades e consumidores": [
    "Por que uma alteração de unidade pode escapar do typecheck?",
    "Representações numéricas podem compartilhar tipo estrutural; unidade e conversão precisam de contrato e regressão comportamental.",
    "A tela ou adaptador multiplica o valor comercial por dez apesar de compilar sem erro."
  ],
  "Regressões, typecheck e build da revisão final": [
    "O que uma aprovação precisa identificar além do nome do comando?",
    "Revisão, alvo, parâmetros e ambiente pertinentes delimitam a prova; um comando parecido pode ter executado outro conjunto.",
    "O agente fecha o pacote usando um teste isolado que não exercitou sua integração."
  ],
  "Allow, ask e deny como decisões distintas": [
    "Por que ask não pode ser confundido com allow?",
    "Ask indica necessidade de decisão pertinente; ainda não há concessão do efeito. O estado precisa permanecer distinto no fluxo e no relatório.",
    "Uma ação recusada é executada porque uma regra ampla foi avaliada como permissão suficiente."
  ],
  "Modo de permissão e efeito autorizado": [
    "Modo de execução concede autorização para qualquer efeito disponível?",
    "Não; capacidade e fluxo de aprovação precisam ser relacionados ao objetivo, recurso e alcance efetivamente autorizados.",
    "Uma sessão criada para corrigir código publica ou envia dados porque a ferramenta técnica estava disponível."
  ],
  "Sandbox de filesystem e rede": [
    "Um predicado de URL comprova sandbox de rede?",
    "Ele comprova somente a comparação local de origem; conexão, redirect, DNS e enforcement precisam de ensaio real do mecanismo.",
    "Um prefixo permissivo permite exfiltração para domínio que apenas imita o nome autorizado."
  ],
  "Configuração gerenciada e limites locais": [
    "Por que a composição de settings deve ser verificada por chave?",
    "Escalares, listas e restrições gerenciadas podem ter regras diferentes; um merge genérico não representa necessariamente a configuração efetiva.",
    "Uma mudança local elimina uma restrição existente porque o agente tratou toda lista como substituição."
  ],
  "Bash, PowerShell e fronteiras de argumentos": [
    "JSON de argumentos é equivalente a escape de shell?",
    "Não; fronteiras de vetor e gramática de shell são interfaces diferentes. O consumidor e a forma de execução determinam a interpretação.",
    "Uma busca ou teste executa outra seleção, ou uma interpolação transforma dado em comando."
  ],
  "Entrada padrão, saída e status do processo": [
    "Quais sinais precisam ser preservados ao consumir saída de processo?",
    "Canais, código de retorno e estado do payload têm papéis distintos e devem ser combinados conforme o contrato, não fundidos numa narrativa.",
    "Uma automação inicia publicação apesar de o processo anterior ter terminado com falha."
  ],
  "MCP, identidade e menor capacidade": [
    "Por que menor capacidade precisa incluir identidade do recurso?",
    "Uma operação pouco mutável ainda pode acessar dados de outro contexto; verbo, alvo e identidade autorizada precisam corresponder.",
    "O agente lê documentos de outra organização usando uma ferramenta que parecia somente leitura."
  ],
  "Retornos de ferramentas e validação de domínio": [
    "Por que validar forma não basta para confiar em um retorno?",
    "Estado e relações de domínio podem contradizer a estrutura válida; o significado de cada campo precisa vir do contrato pertinente.",
    "O agente toma decisão de estoque com retorno incompleto ou agregado incompatível."
  ],
  "SKILL.md, descrição e descoberta": [
    "O que uma boa descrição de skill precisa informar?",
    "Tarefa, condição e alcance devem ser distinguíveis; descoberta pertinente não substitui revisão do conteúdo nem precondições do efeito.",
    "O agente aciona um procedimento desativado ou irrelevante só porque encontrou palavras parecidas."
  ],
  "Invocação explícita e efeitos do procedimento": [
    "Carregar instruções de uma skill equivale a executar seus efeitos?",
    "Não; carregamento, invocação e execução são estados distintos, e autorização e precondições continuam delimitando a ação.",
    "Um agente publica porque viu um procedimento de release no contexto, sem gatilho autorizado para executá-lo."
  ],
  "Referências, scripts e caminhos relativos": [
    "Qual diferença existe entre uma referência de apoio e uma ação executável?",
    "A referência fornece dados para leitura; executar um script acrescenta efeitos, argumentos e autorização que precisam ser avaliados separadamente.",
    "O procedimento lê ou executa arquivo alheio por resolução de caminho fora de sua base."
  ],
  "Versionamento e avaliação de uma skill": [
    "Como a avaliação de uma skill acompanha sua evolução?",
    "Associe casos, conteúdo e versão executada; uma aprovação antiga permanece histórica quando instruções ou helpers mudam.",
    "Um procedimento modificado continua sendo chamado de validado apesar de falhar na versão usada."
  ],
  "Evento, matcher e condição de disparo": [
    "Por que evento e matcher não são intercambiáveis?",
    "Evento determina momento causal e matcher determina alvo nesse momento; acertar só a ferramenta pode observar tarde demais para controlar.",
    "Um script pós-efeito é apresentado como bloqueio prévio de uma ação que já ocorreu."
  ],
  "JSON por stdin e saída de protocolo": [
    "Parsing JSON equivale a validar o protocolo de um hook?",
    "Não; schema, evento, campos e consequência precisam corresponder à versão real. Parsing comprova somente a estrutura sintática aceita pelo parser.",
    "Um hook publica dados de debug ou envia campos que o mecanismo ignora apesar de serem JSON válido."
  ],
  "PreToolUse e controle antes do efeito": [
    "Por que um hook com erro não deve ser presumido como barreira?",
    "A consequência depende de evento, código, schema e configuração; somente um ensaio real mostra se a ação foi impedida.",
    "O controle parece instalado mas o script falho permite a ação que deveria ter sido recusada."
  ],
  "PostToolUse, Stop e verificação de consequência": [
    "Um hook posterior pode impedir retroativamente o efeito original?",
    "Não; observação posterior e controle prévio possuem momentos diferentes. Transformações posteriores também podem exigir nova prova do conteúdo final.",
    "O agente encerra com teste verde de uma versão que um hook alterou depois da execução."
  ],
  "Delegação com objetivo e contrato de retorno": [
    "O que um contrato de retorno protege na delegação?",
    "Ele exige resultado localizável e limitações claras; especialização do agente não substitui evidência ou revisão da sessão que integra.",
    "Uma recomendação sem fonte entra no patch como se fosse fato confirmado do código."
  ],
  "Contexto isolado e capacidade do subagente": [
    "Contexto suficiente e menor capacidade resolvem a mesma questão?",
    "Não; contexto informa a decisão e capacidade limita efeitos. Ambos precisam ser pertinentes e verificados separadamente.",
    "Uma pesquisa delegada recebe escrita e altera arquivos apesar de seu objetivo ser investigação."
  ],
  "Ownership, worktrees e conflito de patches": [
    "Worktrees isolados comprovam compatibilidade dos patches integrados?",
    "Não; isolamento de checkout reduz interferência local, mas contratos e alterações combinadas precisam de revisão e execução conjunta.",
    "A integração aceita dois patches que sobrescrevem parte um do outro ou discordam sobre a interface."
  ],
  "Integração e prova entre fronteiras": [
    "Por que testes isolados aprovados não bastam para integrar subproblemas?",
    "Eles podem usar hipóteses incompatíveis sobre a interface; uma prova entre produtor e consumidor precisa observar o contrato combinado.",
    "A UI usa quantidade zero por falta de campo enquanto serviço e componente passam fixtures isoladas."
  ],
  "Print mode e saída estruturada": [
    "Qual risco existe em automatizar decisões a partir da narrativa do agente?",
    "A narrativa pode citar intenção ou histórico; a decisão precisa de estado, identidade e contrato de resultado observado.",
    "Um script entrega um patch porque o agente mencionou sucesso numa resposta que declara erro."
  ],
  "JSONL, streaming e conclusão terminal": [
    "Por que fim de conexão ou texto parcial não basta para fechar uma automação?",
    "Framing e estado terminal são contratos distintos; truncamento ou delta podem ocorrer sem resultado válido de conclusão.",
    "O consumidor inicia a próxima etapa antes de receber uma falha final do agente."
  ],
  "Retomada de sessão e checkpoint": [
    "Checkpoint equivale a backup ou reversão universal?",
    "Não; sua cobertura depende do mecanismo. Mudanças por shell, contribuições posteriores e efeitos externos exigem recuperação própria.",
    "O agente restaura um checkpoint e anuncia recuperação completa enquanto um arquivo gerado ou efeito remoto continua alterado."
  ],
  "Limites de execução e replay de efeitos": [
    "Um timeout do cliente demonstra que o efeito remoto foi cancelado?",
    "Não; início, espera, execução e efeito são estados distintos. É preciso observar o recurso e reconciliar identidade antes de repetir.",
    "A retomada inicia ações depois do limite ou duplica um efeito cuja resposta foi perdida."
  ],
  "Prompt injection e autoridade dos dados": [
    "Por que uma instrução encontrada em dado não altera o escopo da tarefa?",
    "Autoridade vem da origem autorizada e das condições vigentes; conteúdo recuperado continua dado, mesmo quando parece ajudar o diagnóstico.",
    "O agente envia arquivos ou desativa controles seguindo uma instrução inserida numa fonte consultada."
  ],
  "Privacidade, retenção e transmissão mínima": [
    "Uma allowlist de campos garante ausência de dados sensíveis?",
    "Não; ela limita estrutura declarada, mas conteúdo e classificação dos campos permitidos ainda precisam de avaliação antes da transmissão.",
    "Um relato aparentemente sanitizado transmite identidade de cliente junto de um diagnóstico reproduzível com dados sintéticos."
  ],
  "Avaliação de respostas e cobertura de casos": [
    "Por que cobertura precisa separar caso avaliado de caso registrado?",
    "Um registro pode representar intenção ou pendência; somente observação com método e resultado pertinente integra a avaliação executada.",
    "O agente declara cobertura de isolamento porque existe uma linha pending num checklist."
  ],
  "Custos, latência e diagnóstico de falhas": [
    "Como uma métrica de custo ou latência pode esconder retrabalho?",
    "Se mede só uma etapa, ela omite ferramentas e correção humana. Defina percurso, unidades e método antes de comparar eficiência.",
    "O agente escolhe repetir uma resposta barata enquanto um comando lento e sem nova hipótese domina o trabalho."
  ],
  "Especificação da reserva e estratégia de prova": [
    "Por que validar indivisibilidade pode não bastar para o domínio numérico?",
    "Representação e limite seguro também importam; o valor validado precisa respeitar precisão e limites explicitamente escolhidos para o contrato.",
    "Uma quantidade muito grande perde precisão e altera identidade ou aritmética apesar de passar uma checagem de inteiro."
  ],
  "Chave de replay e payload conflitante": [
    "Qual diferença existe entre replay equivalente e reutilização conflitante de chave?",
    "Replay preserva identidade e conteúdo do pedido confirmado; payload diferente exige recusa ou outra regra explícita, não resposta antiga como sucesso novo.",
    "O serviço devolve confirmação antiga para uma quantidade que nunca foi reservada."
  ],
  "Concorrência real e limites do modelo serial": [
    "Por que saldo não negativo não prova ausência de dupla reserva?",
    "Uma atualização perdida pode deixar saldo válido e duas confirmações; o invariante precisa relacionar efeitos confirmados à disponibilidade.",
    "O teste verde observa só estoque zero enquanto duas pessoas receberam a última vaga."
  ],
  "Handoff verificável e fechamento do escopo": [
    "Como preservar o alcance de uma prova no fechamento?",
    "Associe afirmação ao método, revisão e resultado efetivamente observados; procedimentos nativos descritos permanecem execução pendente até ensaio próprio.",
    "O relatório afirma hook ou sandbox validado porque um pequeno parser local passou."
  ]
};
const SCENARIOS: [string,string][][] = [
  [
    [
      "No trabalho de Sessão, ambiente e contrato de trabalho, sessão A usa projeto quiron, revisão r8 e runtime Node24; sessão B usa mesmo projeto e revisão mas Node22. O agente propõe comparar somente projeto e revisão. Determine a saída correta, identifique a regra violada e explique como a condição mesmo projeto e revisão não garantem a mesma condição de execução afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "runtime aparece como diferença entre as sessões. Regra: Registre revisão e condições executadas; a mesma conversa ou projeto não garante que terminal, editor e ambiente remoto usem a mesma base. Correção: comparar os campos project, revision e runtime. Recuperação: alinhar a condição pertinente ou limitar a afirmação ao ambiente realmente exercitado. Ensaio nativo: inspecionar a superfície e versão Claude Code reais e o ambiente em que seus comandos executam. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Sessão, ambiente e contrato de trabalho, a base é repo/packages/app e o caminho relativo é ../../docs. O agente propõe concatenar base e relativo sem normalização. Determine a saída correta, identifique a regra violada e explique como a condição concatenar componentes de navegação não estabelece a identidade final do alvo afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o alvo textual é repo/docs. Regra: Eles mudam resolução de caminhos, configuração e interpretação de argumentos; o mesmo texto pode produzir outro alvo ou efeito. Correção: normalizar os componentes com pilha de segmentos no dialeto POSIX declarado. Recuperação: corrigir o diretório da operação e repetir somente o comando pertinente no alvo conferido. Ensaio nativo: observar raiz, shell e caminhos resolvidos na sessão Claude Code real sem usar WSL como substituto presumido. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Sessão, ambiente e contrato de trabalho, trigger descreve pedido de outro tenant, expected descreve rejeição e invariant está vazio. O agente propõe validar apenas expected. Determine a saída correta, identifique a regra violada e explique como a condição campos presentes mas vazios não estabelecem restrições de preservação afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o contrato incompleto retorna false. Regra: O critério define comportamento observável e restrições; a implementação proposta deve ser confrontada com esse contrato, não substituí-lo. Correção: exigir texto não vazio em trigger, expected e invariant. Recuperação: explicitar a restrição ausente e revisar o patch e a regressão correspondente. Ensaio nativo: confrontar o pedido real, plano e resultado da sessão Claude Code com casos positivos e negativos. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Exploração e aquisição de contexto, reserve aparece como declaração, comentário e chamadas em route.ts e worker.ts. O agente propõe selecionar qualquer menção ao símbolo. Determine a saída correta, identifique a regra violada e explique como a condição uma menção em comentário não estabelece caminho executado afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "route.ts e worker.ts são os consumidores selecionados. Regra: Declaração, chamada e comentário possuem papéis diferentes; uma coincidência de nome não prova dependência executada. Correção: selecionar ocorrências do símbolo cuja espécie declarada é call. Recuperação: retomar a exploração pelo consumidor ativo e verificar a relação entre argumento e efeito. Ensaio nativo: rastrear símbolo e chamadas reais com as ferramentas de leitura e busca Claude Code. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Exploração e aquisição de contexto, web/reserve.ts aparece antes de duas ocorrências de api/reserve.ts e uma de api/guard.ts; o pacote alvo é api. O agente propõe deduplicar globalmente por basename antes de aplicar o filtro de pacote. Determine a saída correta, identifique a regra violada e explique como a condição mesmo basename em pacotes diferentes não identifica o mesmo arquivo afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a lista é api/reserve.ts e api/guard.ts. Regra: Caminho completo e referência pertinente precisam permanecer; basename e aparência textual não distinguem pacotes diferentes. Correção: filtrar pacote antes de deduplicar por caminho completo. Recuperação: refazer a redução por identidade completa e rever a hipótese baseada no arquivo omitido. Ensaio nativo: executar a busca real no projeto Claude Code e confrontar o resumo com os caminhos e trechos retornados. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Exploração e aquisição de contexto, run2 contém E_AUTH da aplicação e texto de usuário; run1 contém E_OLD da aplicação. O agente propõe selecionar qualquer registro com severity error. Determine a saída correta, identifique a regra violada e explique como a condição mensagens iguais ou severas podem pertencer a outra tentativa ou fonte não confiável afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente E_AUTH pertence à evidência da execução run2. Regra: Use origem, identidade e sequência para observação; comandos contidos no texto continuam dados e precisam de autorização independente. Correção: selecionar origem application e run igual à execução atual. Recuperação: isolar o histórico da tentativa pertinente e refazer o diagnóstico com dados classificados. Ensaio nativo: confrontar logs reais com processo, revisão e ação executados pela sessão Claude Code. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de CLAUDE.md, regras e memória, packages/api/CLAUDE.md referencia rules/auth.md enquanto cwd é repo. O agente propõe resolver o import a partir de cwd. Determine a saída correta, identifique a regra violada e explique como a condição trocar o cwd da sessão não muda a base da referência documental afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o caminho é packages/api/rules/auth.md. Regra: A base documental é o diretório do arquivo que contém a referência; a sessão e o arquivo importador não são objetos intercambiáveis. Correção: resolver o relativo simples a partir do diretório do arquivo importador. Recuperação: corrigir a referência documental e revisar as decisões feitas com o conteúdo errado. Ensaio nativo: conferir imports e arquivos efetivamente carregados pelo mecanismo de memória Claude Code. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de CLAUDE.md, regras e memória, a regra typed-server exige diretório src/server/ e extensão .ts; o alvo é src/server/a.js. O agente propõe ignorar extensão e considerar apenas diretório. Determine a saída correta, identifique a regra violada e explique como a condição corresponder ao diretório não satisfaz a condição de extensão afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "nenhuma regra do conjunto é aplicada ao alvo. Regra: Eles demonstram que o alcance codifica as condições pretendidas e não inclui arquivos apenas parecidos ou parcialmente correspondentes. Correção: exigir prefixo delimitado e extensão declarada em conjunto. Recuperação: corrigir a condição pertinente e rever o patch produzido sob orientação indevida. Ensaio nativo: verificar regras e condições efetivamente reconhecidas pelo Claude Code para os arquivos de fronteira. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de CLAUDE.md, regras e memória, no instante 10, convenção expira em 20, quota expira em 5 e credencial expira em 20 mas é sensível. O agente propõe ignorar validade e filtrar apenas sensibilidade. Determine a saída correta, identifique a regra violada e explique como a condição uma informação não sensível pode estar desatualizada afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente convencao é elegível. Regra: Fatos perecíveis precisam da fonte atual e de condição de validade; uma nota persistida não os torna permanentemente verdadeiros. Correção: aceitar apenas notas não sensíveis com validade estritamente posterior ao instante atual. Recuperação: atualizar a nota e revalidar as decisões derivadas do fato expirado. Ensaio nativo: inspecionar memória usada pelo Claude Code e confrontar notas perecíveis com suas fontes reais. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Planejamento, edição e verificação, patch depende de reproduce e contract; apenas reproduce consta em done. O agente propõe usar some em vez de every nas dependências. Determine a saída correta, identifique a regra violada e explique como a condição uma dependência satisfeita não elimina outra decisão indispensável afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "patch não está pronto para execução. Regra: A etapa seguinte precisa de um resultado específico da anterior; a relação deve ser justificada pelo contrato e observada, não só numerada. Correção: exigir que todas as dependências da etapa pertençam a done. Recuperação: satisfazer a dependência ausente e revisar a edição iniciada com hipótese incompleta. Ensaio nativo: confrontar o plano Claude Code com as precondições e evidências reais da tarefa. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Planejamento, edição e verificação, a base é const x=1; a corrente é const x=1; comentário humano; e a proposta muda x para 2. O agente propõe aplicar a proposta sem conferir digest. Determine a saída correta, identifique a regra violada e explique como a condição um digest antigo não deve autorizar sobrescrita de bytes novos afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o resultado é conflict e conserva a contribuição humana. Regra: Ela detecta que o conteúdo mudou desde a leitura e exige composição sobre a versão atual; não autoriza sobrescrever contribuições posteriores. Correção: comparar SHA-256 da corrente com o digest da base antes de escolher a proposta. Recuperação: reler a corrente e compor só o trecho autorizado preservando a contribuição humana. Ensaio nativo: conferir base e aplicação real de edição Claude Code no arquivo compartilhado. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Planejamento, edição e verificação, o serviço fornece 125 centavos inteiros e o consumidor espera decimal de duas casas em formato didático. O agente propõe dividir por dez em vez de cem. Determine a saída correta, identifique a regra violada e explique como a condição tipo number não revela se o dado está em centavos ou unidade monetária afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a string retornada é 1.25. Regra: Representações numéricas podem compartilhar tipo estrutural; unidade e conversão precisam de contrato e regressão comportamental. Correção: dividir por cem antes de representar duas casas decimais. Recuperação: restaurar a conversão declarada e acrescentar a regressão com valor que distingue unidades. Ensaio nativo: rastrear e executar os consumidores reais da interface alterada por Claude Code. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Permissões e isolamento de execução, deploy aparece simultaneamente em allow e deny no contrato local. O agente propõe avaliar allow antes de deny. Determine a saída correta, identifique a regra violada e explique como a condição uma permissão ampla não deve apagar uma recusa específica nesse contrato declarado afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a decisão é deny. Regra: Ask indica necessidade de decisão pertinente; ainda não há concessão do efeito. O estado precisa permanecer distinto no fluxo e no relatório. Correção: avaliar deny antes de ask e allow por igualdade exata da ação. Recuperação: corrigir o conflito de política e revisar a chamada concreta antes de retomar o efeito. Ensaio nativo: conferir a avaliação real de permissões na versão e configuração Claude Code usadas. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Permissões e isolamento de execução, a concessão é edit no workspace; o pedido é publish em external e o modo didático da sessão é edit. O agente propõe permitir publicação quando mode é edit. Determine a saída correta, identifique a regra violada e explique como a condição facilidade de edição não amplia o alcance comercial para publicação afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o gate retorna false para publicação externa. Regra: Não; capacidade e fluxo de aprovação precisam ser relacionados ao objetivo, recurso e alcance efetivamente autorizados. Correção: comparar operação e destino com a concessão da tarefa. Recuperação: preparar o resultado revisável e obter a decisão específica quando o efeito estiver fora do alcance vigente. Ensaio nativo: confrontar modo, chamada e autorização real da tarefa na sessão Claude Code. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Permissões e isolamento de execução, a allowlist contém api.example.invalid e o pedido aponta https://api.example.invalid.evil.invalid/data. O agente propõe usar startsWith no hostname. Determine a saída correta, identifique a regra violada e explique como a condição um domínio que começa com o nome permitido ainda pode pertencer a outra origem afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o destino retorna false. Regra: Ele comprova somente a comparação local de origem; conexão, redirect, DNS e enforcement precisam de ensaio real do mecanismo. Correção: interpretar URL e exigir https e hostname exatamente permitido. Recuperação: corrigir o limite de origem pertinente e repetir o teste de fronteira sem ampliar acesso indiscriminadamente. Ensaio nativo: ensaiar recursos sintéticos no sandbox Claude Code efetivamente disponível e configurado. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Ferramentas, terminal e MCP, o padrão literal é erro; echo vazou e o alvo é src. O agente propõe dividir o padrão por espaços. Determine a saída correta, identifique a regra violada e explique como a condição um dado com espaço e semicolon não deve virar vários argumentos ou código de shell afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o padrão permanece um elemento único do vetor. Regra: Não; fronteiras de vetor e gramática de shell são interfaces diferentes. O consumidor e a forma de execução determinam a interpretação. Correção: construir vetor rg com -F, delimitador --, padrão integral e alvo. Recuperação: corrigir a passagem de dados e repetir a operação com o alvo e a seleção conferidos. Ensaio nativo: conferir shell, comando e argumentos realmente executados pela ferramenta Claude Code pertinente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Ferramentas, terminal e MCP, stdout contém status ok, stderr contém diagnóstico e exitCode é 1. O agente propõe ignorar exitCode e usar somente status do JSON. Determine a saída correta, identifique a regra violada e explique como a condição payload positivo não elimina falha de processo declarada no contrato afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o gate de sucesso retorna false. Regra: Canais, código de retorno e estado do payload têm papéis distintos e devem ser combinados conforme o contrato, não fundidos numa narrativa. Correção: interpretar JSON e exigir exitCode=0 junto de status ok. Recuperação: corrigir o consumidor e impedir a etapa seguinte até o resultado correspondente passar. Ensaio nativo: observar canais e status reais de subprocessos ou execução programática Claude Code usados na tarefa. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Ferramentas, terminal e MCP, grant permite read em tenant-a e request pede read em tenant-b. O agente propõe conferir só capability read. Determine a saída correta, identifique a regra violada e explique como a condição leitura de outro tenant pode expor dados mesmo sem escrita afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a requisição retorna false. Regra: Uma operação pouco mutável ainda pode acessar dados de outro contexto; verbo, alvo e identidade autorizada precisam corresponder. Correção: exigir igualdade de capability e tenant. Recuperação: corrigir o contexto autorizado e revisar dados retornados indevidamente antes de continuar. Ensaio nativo: verificar identidade, credenciais, argumentos e ACL reais de uma conexão MCP usada por Claude Code. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Skills e procedimentos reutilizáveis, a tarefa é docs; descritor docs está disabled e descritor deploy está enabled em outro domínio. O agente propõe ignorar enabled ao selecionar domínio. Determine a saída correta, identifique a regra violada e explique como a condição pertinência temática não remove uma condição de desabilitação afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "nenhuma skill é elegível nesse conjunto. Regra: Tarefa, condição e alcance devem ser distinguíveis; descoberta pertinente não substitui revisão do conteúdo nem precondições do efeito. Correção: exigir domínio pertinente e estado enabled. Recuperação: corrigir descrição ou estado e avaliar a invocação no contexto pertinente. Ensaio nativo: conferir descoberta e carregamento de uma skill sintética no Claude Code disponível. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Skills e procedimentos reutilizáveis, disable-model-invocation é true e caller é model para a skill release-demo. O agente propõe permitir qualquer skill que tenha nome não vazio. Determine a saída correta, identifique a regra violada e explique como a condição uma skill conhecida pelo nome não fica automaticamente autorizada para efeito afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a invocação automática retorna false. Regra: Não; carregamento, invocação e execução são estados distintos, e autorização e precondições continuam delimitando a ação. Correção: recusar elegibilidade automática quando o controle interpretado é true. Recuperação: corrigir o gatilho e manter o efeito dentro da origem e do alvo autorizados. Ensaio nativo: observar o controle de invocação de uma skill sintética na versão Claude Code real. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Skills e procedimentos reutilizáveis, a raiz da skill é skills/audit e o recurso relativo solicitado é ../outside.sh. O agente propõe concatenar raiz e relativo sem verificar segmentos. Determine a saída correta, identifique a regra violada e explique como a condição um recurso auxiliar não ganha permissão para sair da base por estar citado no procedimento afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o resultado é null. Regra: A referência fornece dados para leitura; executar um script acrescenta efeitos, argumentos e autorização que precisam ser avaliados separadamente. Correção: recusar travessia explícita antes de construir o caminho relativo simplificado. Recuperação: corrigir a referência e revalidar a origem e o alcance do recurso antes de usá-lo. Ensaio nativo: conferir caminhos e helpers reais carregados ou executados pela skill Claude Code pertinente. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Hooks e controles determinísticos, event=PreToolUse e tool=Read; os hooks são PreToolUse/Bash e PostToolUse/Read. O agente propõe ignorar event e selecionar apenas por ferramenta. Determine a saída correta, identifique a regra violada e explique como a condição mesma ferramenta num evento posterior não controla a ação anterior afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "nenhum hook é selecionado. Regra: Evento determina momento causal e matcher determina alvo nesse momento; acertar só a ferramenta pode observar tarde demais para controlar. Correção: exigir evento e ferramenta correspondentes em conjunto. Recuperação: corrigir a associação causal e repetir a ferramenta sintética conferindo ordem e consequência. Ensaio nativo: observar evento e disparo de um hook sintético na sessão Claude Code real. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Hooks e controles determinísticos, stdin contém event=PreToolUse, tool=Read e debug com texto desnecessário. O agente propõe devolver o objeto inteiro depois de JSON.parse. Determine a saída correta, identifique a regra violada e explique como a condição um campo extra válido pode carregar dados que não pertencem ao protocolo de decisão afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "debug não aparece no resultado projetado. Regra: Não; schema, evento, campos e consequência precisam corresponder à versão real. Parsing comprova somente a estrutura sintática aceita pelo parser. Correção: interpretar o JSON e construir envelope só com event e tool. Recuperação: corrigir schema e canais e repetir a invocação observando a consequência pertinente. Ensaio nativo: exercitar entrada e retorno do evento hook Claude Code real usando dados sintéticos. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Hooks e controles determinísticos, o código de saída fornecido é 1 no contrato didático de código bloqueante PreToolUse. O agente propõe tratar qualquer código não zero como bloqueante. Determine a saída correta, identifique a regra violada e explique como a condição falha convencional de processo não equivale automaticamente à semântica de bloqueio do evento afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o predicado de sinal bloqueante retorna false. Regra: A consequência depende de evento, código, schema e configuração; somente um ensaio real mostra se a ação foi impedida. Correção: identificar bloqueio pelo código exatamente igual a 2. Recuperação: corrigir o sinal e o protocolo pertinentes e repetir o ensaio sem confundir erro de script com recusa. Ensaio nativo: ensaiar uma chamada sintética com hook PreToolUse real e observar código, decisão e efeito da ferramenta. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Subagentes e composição de resultados, o retorno contém findings=[consumidor encontrado] e evidence vazio. O agente propõe aceitar qualquer findings não vazio. Determine a saída correta, identifique a regra violada e explique como a condição conclusão sem referência verificável permanece hipótese insuficiente afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o relatório não está pronto para integração. Regra: Ele exige resultado localizável e limitações claras; especialização do agente não substitui evidência ou revisão da sessão que integra. Correção: exigir findings e evidence não vazios no contrato de retorno declarado. Recuperação: obter a evidência faltante e rever a conclusão antes de integrar a mudança. Ensaio nativo: observar despacho e retorno reais de um subagente Claude Code em tarefa sintética pertinente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Subagentes e composição de resultados, requested contém Read e Write; granted contém Read e Grep. O agente propõe devolver requested inteiro. Determine a saída correta, identifique a regra violada e explique como a condição uma solicitação de ferramenta não é uma autorização para disponibilizá-la afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a capacidade efetiva declarada contém somente Read. Regra: Não; contexto informa a decisão e capacidade limita efeitos. Ambos precisam ser pertinentes e verificados separadamente. Correção: selecionar apenas ferramentas solicitadas que pertencem à concessão. Recuperação: reduzir a concessão pertinente e revisar efeitos produzidos fora da tarefa de leitura. Ensaio nativo: conferir contexto inicial e ferramentas efetivas de subagente Claude Code na modalidade realmente usada. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Subagentes e composição de resultados, os patches no arquivo service.ts usam intervalos [10,20) e [15,25). O agente propõe considerar conflito apenas quando os inícios são iguais. Determine a saída correta, identifique a regra violada e explique como a condição inícios diferentes não tornam dois intervalos independentes afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "há sobreposição potencial. Regra: Não; isolamento de checkout reduz interferência local, mas contratos e alterações combinadas precisam de revisão e execução conjunta. Correção: exigir mesmo arquivo e interseção não vazia dos intervalos semiabertos. Recuperação: compor o trecho sobreposto sobre a base atual e executar o gate entre as partes. Ensaio nativo: confrontar bases, diffs e integração reais de tarefas Claude Code com ownership definido. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Automação, sessões e recuperação, o envelope JSON tem type=result, is_error=true e texto sobre um sucesso anterior. O agente propõe aceitar qualquer result textual não vazio. Determine a saída correta, identifique a regra violada e explique como a condição texto preenchido pode explicar falha ou histórico e não demonstra sucesso atual afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o gate retorna false. Regra: A narrativa pode citar intenção ou histórico; a decisão precisa de estado, identidade e contrato de resultado observado. Correção: interpretar envelope e exigir type result sem is_error. Recuperação: corrigir o consumidor e manter a etapa de efeito bloqueada até o resultado pertinente passar. Ensaio nativo: executar print mode Claude Code disponível sobre tarefa sintética e validar o formato real de saída. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Automação, sessões e recuperação, as linhas contêm um delta com texto e um result com is_error=true. O agente propõe aceitar eventos de delta como sucesso. Determine a saída correta, identifique a regra violada e explique como a condição um delta legível não é a mensagem terminal nem prova sucesso afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "não há conclusão bem-sucedida selecionada. Regra: Framing e estado terminal são contratos distintos; truncamento ou delta podem ocorrer sem resultado válido de conclusão. Correção: interpretar cada linha completa e selecionar apenas result sem erro. Recuperação: corrigir o gate terminal e tratar ausência ou erro de resultado sem presumir sucesso. Ensaio nativo: observar stream-json real Claude Code e seu resultado terminal sob condições sintéticas de leitura. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Automação, sessões e recuperação, a.ts foi alterado por Edit e generated.txt foi alterado por Bash. O agente propõe listar toda alteração como recuperável pelo checkpoint. Determine a saída correta, identifique a regra violada e explique como a condição mudança de arquivo por shell não recebe cobertura automática do checkpoint de edição afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente a.ts aparece como alteração coberta. Regra: Não; sua cobertura depende do mecanismo. Mudanças por shell, contribuições posteriores e efeitos externos exigem recuperação própria. Correção: selecionar somente registros de Edit ou Write no contrato de cobertura declarado. Recuperação: recuperar cada objeto com o mecanismo pertinente preservando autoria e verificar os gates afetados. Ensaio nativo: ensaiar checkpoint e retomada Claude Code sobre arquivos sintéticos e comparar cobertura e diff reais. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Armadilhas de segurança e avaliação, user autorizado solicita read e tool-data propõe upload. O agente propõe aceitar toda proposta que possua operation. Determine a saída correta, identifique a regra violada e explique como a condição conteúdo externo pode usar linguagem imperativa sem ganhar autoridade humana afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o conjunto autorizado contém somente read. Regra: Autoridade vem da origem autorizada e das condições vigentes; conteúdo recuperado continua dado, mesmo quando parece ajudar o diagnóstico. Correção: selecionar somente ações de origem user com autorização explícita declarada. Recuperação: interromper o efeito fora do alcance e revisar origem, concessões e dados transmitidos. Ensaio nativo: ensaiar conteúdo adversarial sintético na sessão Claude Code e observar ferramentas e efeitos sob política real. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Armadilhas de segurança e avaliação, o relato tem errorCode E_AUTH, revision r10, customerName Pessoa Fictícia e apiKey FICTICIA. O agente propõe remover somente apiKey e copiar os demais campos. Determine a saída correta, identifique a regra violada e explique como a condição retirar um segredo evidente ainda pode deixar dado pessoal desnecessário afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o relato projetado não contém customerName nem apiKey. Regra: Não; ela limita estrutura declarada, mas conteúdo e classificação dos campos permitidos ainda precisam de avaliação antes da transmissão. Correção: construir saída apenas com errorCode e revision. Recuperação: retirar dados não autorizados e avaliar exposição e revogação pertinentes ao recurso real. Ensaio nativo: mapear payloads e políticas reais de dados da conta e das ferramentas Claude Code utilizadas. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Armadilhas de segurança e avaliação, required contém basic e tenant; basic está passed e tenant está pending. O agente propõe considerar todo registro como avaliação concluída. Determine a saída correta, identifique a regra violada e explique como a condição presença de registro pending não demonstra execução do caso afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "tenant continua não avaliado. Regra: Um registro pode representar intenção ou pendência; somente observação com método e resultado pertinente integra a avaliação executada. Correção: listar casos sem registro passed ou failed de avaliação observada. Recuperação: corrigir o relato e exercitar o caso faltante quando sua superfície real estiver disponível. Ensaio nativo: avaliar respostas reais Claude Code contra dataset e critérios independentes do projeto. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Projeto Quíron com Claude Code, qty=9007199254740992 no domínio didático de inteiro seguro positivo JavaScript. O agente propõe usar Number.isInteger sem restrição de segurança. Determine a saída correta, identifique a regra violada e explique como a condição um número pode ser inteiro na representação sem pertencer ao domínio seguro de precisão afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a quantidade é recusada pelo gate local. Regra: Representação e limite seguro também importam; o valor validado precisa respeitar precisão e limites explicitamente escolhidos para o contrato. Correção: exigir Number.isSafeInteger e qty maior que zero. Recuperação: corrigir domínio e conversão na fronteira e repetir os casos de limite e o consumidor da quantidade. Ensaio nativo: exercitar a entrada real e os tipos do backend pertinente ao Lab Ágora e à edição Claude Code. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Projeto Quíron com Claude Code, tenant t1 e key k possuem payload qty=1; o novo pedido usa mesma identidade com qty=2 e stock=4. O agente propõe devolver replayed quando a chave existe sem comparar payload. Determine a saída correta, identifique a regra violada e explique como a condição mesma chave com outro payload não representa repetição equivalente afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o resultado é conflict com stock preservado em 4. Regra: Replay preserva identidade e conteúdo do pedido confirmado; payload diferente exige recusa ou outra regra explícita, não resposta antiga como sucesso novo. Correção: confrontar payload fixo do pedido com o registro de replay antes de aceitar repetição. Recuperação: corrigir comparação de identidade e payload e reconciliar o efeito confirmado antes de aceitar nova tentativa. Ensaio nativo: exercitar replay equivalente, conflito e atomicidade da reserva no backend real pertinente ao Lab e à edição Claude Code. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Projeto Quíron com Claude Code, a disponibilidade inicial é 1, há duas confirmações unitárias e o saldo final fornecido é 0. O agente propõe detectar sobre-reserva somente quando saldo final é negativo. Determine a saída correta, identifique a regra violada e explique como a condição lost update pode esconder dupla confirmação num saldo final aparentemente válido afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "overbooked retorna true apesar do saldo não negativo. Regra: Uma atualização perdida pode deixar saldo válido e duas confirmações; o invariante precisa relacionar efeitos confirmados à disponibilidade. Correção: comparar quantidade total confirmada com disponibilidade inicial. Recuperação: corrigir a operação atômica e repetir o ensaio observando confirmações, estado e recuperação. Ensaio nativo: executar disputa real na camada reserva-estoque-concorrencia do Lab com backend e revisão pertinentes. A fixture local não atesta essa superfície."
    ]
  ]
];
export const CLAUDE_CODE_CARDS: ContentSource["cards"] = CLAUDE_CODE_CURRICULUM.flatMap(chapter=>chapter.sections.map(title=>({nodeTitle:chapter.title,frontMd:CLAUDE_CODE_REVIEW[title][0],backMd:CLAUDE_CODE_REVIEW[title][1]})));
export const CLAUDE_CODE_EXERCISES: ContentSource["exercises"] = CLAUDE_CODE_CURRICULUM.flatMap((chapter,index)=>SCENARIOS[index].map(([promptMd,answerKeyMd],position)=>({nodeTitle:chapter.title,type:([2,3,5] as const)[position],level:chapter.level==="basico"?"beginner" as const:chapter.level==="intermediario"?"intermediate" as const:"advanced" as const,promptMd,answerKeyMd,points:3})));
