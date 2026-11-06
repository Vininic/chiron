import type { ContentSource } from "./types";
import { CURSOR_CURRICULUM } from "./cursorCurriculum";
type Review=[question:string,answer:string,failure:string];
export const CURSOR_REVIEW: Record<string,Review> = {
  "Workspace e inventário inicial": [
    "Por que src-old/app.ts não pertence ao escopo src?",
    "A pertença exige igualdade com src ou prefixo src/; um prefixo de letras não delimita diretórios.",
    "Uma seleção por prefixo incompleto inclui arquivos de um pacote alheio e amplia silenciosamente o patch."
  ],
  "Pedido observável e limites de mudança": [
    "O que uma lista de arquivos permitidos verifica no contrato da tarefa?",
    "Ela verifica o alcance declarado do patch; critérios de comportamento e preservação exigem provas adicionais.",
    "Uma mudança comercial não pedida pode entrar junto de uma correção visual e escapar da revisão por intenção."
  ],
  "Assistência inline e edição delimitada": [
    "Qual é a fronteira direita de um intervalo semiaberto de edição?",
    "O índice end já pertence ao texto preservado; a substituição remove os índices start até end menos um.",
    "Um erro de uma posição apaga pontuação ou um caractere vizinho que não fazia parte da seleção."
  ],
  "Plano, agente e evidência de execução": [
    "Por que uma aprovação em r1 não valida automaticamente r2?",
    "A prova pertence ao código e parâmetros executados; uma alteração posterior rompe essa associação até nova verificação pertinente.",
    "O agente anuncia conclusão usando um teste anterior à mudança que introduziu a regressão."
  ],
  "Referências explícitas e contexto mínimo": [
    "Qual condição impede anexar um dump relevante ao contexto?",
    "A classificação e a autorização de transmissão continuam necessárias; utilidade para diagnóstico não elimina restrição de dados.",
    "O contexto inclui dados reais desnecessários e amplia a exposição para resolver um defeito reproduzível com fixture."
  ],
  "Busca lexical e recuperação semântica": [
    "O que um ranking lexical local comprova sobre a causa de um bug?",
    "Comprova apenas a aplicação do critério textual declarado; relação causal exige examinar o fluxo e reproduzir o defeito.",
    "O agente escolhe um documento aparentemente próximo e altera uma função que não participa do fluxo defeituoso."
  ],
  "Indexação, validade e arquivos omitidos": [
    "Por que existência de arquivo não basta para confiar em uma referência catalogada?",
    "A referência deve corresponder ao conteúdo atual e ao alcance permitido; existência não prova versão nem elegibilidade.",
    "Uma resposta usa assinatura antiga e produz patch incompatível com o arquivo ativo."
  ],
  "Orçamento de contexto e continuidade": [
    "Qual informação deve sobreviver a um resumo de continuidade?",
    "Objetivo, contrato, restrições, revisão e provas pertinentes precisam permanecer distinguíveis de hipóteses e histórico.",
    "A retomada ignora um limite comercial confirmado e repete uma solução já rejeitada."
  ],
  "Regras de projeto e frontmatter MDC": [
    "Por que alwaysApply=false não pode ser interpretado como chave presente?",
    "Presença e valor são propriedades distintas; aplicação global exige o valor booleano true no objeto interpretado.",
    "Uma orientação específica de pagamento invade tarefas sem relação e induz mudanças indevidas."
  ],
  "Escopo de regras e conflitos de orientação": [
    "Como demonstrar que o alcance de uma orientação não invade um diretório semelhante?",
    "Inclua um caminho de fronteira que compartilha o prefixo textual e exija que ele permaneça fora da correspondência.",
    "Uma regra de interface é aplicada em código legado e o agente muda convenções sem necessidade."
  ],
  "AGENTS.md e instruções próximas do código": [
    "Por que instruções de um diretório irmão não entram na hierarquia do alvo?",
    "A aplicabilidade local depende de ancestralidade do caminho, não de vocabulário semelhante no nome do diretório.",
    "Uma convenção de um serviço legado substitui o contrato ativo de pagamentos."
  ],
  "Documentação externa e procedência": [
    "Quais dimensões tornam uma referência aplicável a uma configuração atual?",
    "Procedência, versão, data e escopo da afirmação precisam corresponder à decisão; autoridade da fonte não apaga incompatibilidade de versão.",
    "O patch introduz um parâmetro removido porque o agente usou um guia oficial antigo."
  ],
  "Critérios de aceitação antes do patch": [
    "Por que algum teste aprovado não fecha um contrato de aceitação?",
    "As obrigações são cumulativas; o fechamento exige cada critério pertinente, com resultado observado e conjunto não vazio.",
    "A entrega corrige a apresentação mas ainda permite quantidade inválida no serviço."
  ],
  "Diferença textual e revisão de intenção": [
    "Qual precondição falta a uma substituição textual com duas âncoras iguais?",
    "Falta identidade inequívoca do alvo; contexto ou versão-base precisam distinguir a ocorrência antes da aplicação.",
    "O patch altera a função de teste em vez da função ativa ou muda apenas um de dois locais sem justificativa."
  ],
  "Edição em vários arquivos e consumidores": [
    "Por que um consumidor transitivo entra na análise de uma mudança de interface?",
    "A incompatibilidade pode propagar pelo contrato intermediário; a ausência de chamada direta não elimina dependência comportamental.",
    "O serviço compila isoladamente mas a rota continua usando a representação anterior."
  ],
  "Refatoração com invariantes observáveis": [
    "Qual invariante demonstra preservação ao agrupar linhas de um pedido?",
    "Para cada produto, a quantidade agrupada deve igualar a soma das contribuições válidas desse ID.",
    "Uma refatoração compacta perde itens repetidos e altera o total cobrado ou reservado."
  ],
  "Comandos, diretório e argumentos": [
    "Por que um caminho com espaço precisa permanecer um argumento único?",
    "A fronteira entre argumentos pertence à interface de processo; dividir o valor muda o alvo interpretado pela ferramenta.",
    "O agente roda uma seleção diferente e anuncia aprovação de testes que não cobrem o arquivo pedido."
  ],
  "Aprovação de efeitos e escopo autorizado": [
    "Quais componentes limitam uma autorização de efeito?",
    "Operação, alvo, ambiente e condições concedidas precisam corresponder ao pedido efetivo; o verbo isolado não delimita a capacidade.",
    "Uma aprovação de ensaio é reutilizada para modificar dados de produção."
  ],
  "Sandbox, rede e caminhos protegidos": [
    "Uma verificação textual de prefixo comprova isolamento do processo?",
    "Não; ela comprova apenas seu predicado sobre strings. Resolução real, links, permissões e enforcement precisam de ensaios nativos.",
    "Um controle aparente permite acesso a uma pasta vizinha e expõe arquivos fora do workspace."
  ],
  "Ignore, segredos e conteúdo não confiável": [
    "Por que .cursorignore não deve ser tratado como isolamento universal de segredo?",
    "Seu alcance não cobre toda ferramenta e todo acesso; proteção exige classificar dados e verificar mecanismos reais nas superfícies pertinentes.",
    "Um log aparentemente ignorado é lido por terminal e enviado inteiro para uma ferramenta externa."
  ],
  "Regressão mínima que reproduz o defeito": [
    "Por que o caso de igualdade é uma boa regressão para a última unidade?",
    "Ele distingue diretamente comparação inclusiva de comparação estrita; um estoque maior não contradiz esse mutant.",
    "O sistema mostra estoque disponível mas recusa o pedido que consumiria exatamente o restante."
  ],
  "Oracles, mutantes e testes que contradizem": [
    "Como evitar um oracle circular num teste de arredondamento?",
    "Declare a política e derive manualmente o literal esperado; não obtenha a expectativa chamando a implementação que está sendo avaliada.",
    "Uma bateria inteira concorda com a mesma regra errada e não percebe a diferença de um centavo."
  ],
  "Typecheck, build e execução separadas": [
    "Qual é o estado de um build exigido que não foi executado?",
    "Pending; nem aprovação de tipos nem testes locais substituem a observação do artefato correspondente.",
    "A entrega anuncia todos os gates aprovados mesmo sem produzir o bundle final."
  ],
  "Falhas, logs e redução do problema": [
    "Como relatar casos que não executaram por falha de preparação?",
    "Declare a preparação falha e os casos não executados separadamente; eles não entram como provas aprovadas.",
    "Um relatório transforma indisponibilidade de ambiente em percentual artificial de sucesso."
  ],
  "Alterações preexistentes e autoria": [
    "O que fazer quando a base mudou durante a tarefa?",
    "Releia a contribuição atual e componha a correção sobre ela; não sobrescreva o arquivo com a fotografia antiga.",
    "O agente desfaz um trabalho alheio ao aplicar sua própria versão completa do arquivo."
  ],
  "Checkpoint e histórico versionado": [
    "Qual propriedade precisa ser conferida ao restaurar um checkpoint?",
    "A restauração deve recuperar o efeito pretendido e preservar contribuições fora de seu alcance; o nome checkpoint não estabelece essa propriedade.",
    "Desfazer um erro do agente elimina uma mudança humana legítima no mesmo workspace."
  ],
  "Branches, worktrees e base de revisão": [
    "Por que a revisão precisa identificar uma base compartilhada?",
    "A base delimita quais alterações pertencem à linha de trabalho; escolher só o último pai pode ocultar parte da entrega.",
    "O review ignora mudanças anteriores da feature e aprova apenas o último commit."
  ],
  "Pull request, revisão humana e entrega": [
    "Como um relatório de PR deve ligar provas e limitações?",
    "Cada afirmação precisa do método correspondente, e obrigações não exercitadas permanecem explicitamente pendentes na revisão final.",
    "Uma entrega aprovada em teste local entra em produção sem a migração exigida pelo contrato."
  ],
  "MCP, ferramentas e capacidade concedida": [
    "Por que acesso a um sistema não implica autorização para todos os seus efeitos?",
    "Capacidade inclui operação e alvo; conectar a fonte ou compartilhar seu nome não concede escrita ou publicação.",
    "O agente usa uma ferramenta de escrita para uma investigação que deveria permanecer leitura."
  ],
  "Schemas, argumentos e validação de retorno": [
    "Qual é a diferença entre validação estrutural e autorização comercial?",
    "A primeira verifica o domínio declarado dos dados; a segunda depende de identidade, recurso e estado, mesmo quando os dados têm forma válida.",
    "Uma chamada reserva fração de um item indivisível ou passa um ID bem formado de outro tenant."
  ],
  "Hooks e observação de eventos": [
    "Por que identidade de ação é necessária para interpretar hooks e logs?",
    "Eventos podem ser reentregues; sem identidade, contagem de mensagens pode ser confundida com contagem de efeitos.",
    "O relatório atribui três alterações a um fluxo que concluiu duas ações e recebeu um evento duplicado."
  ],
  "CLI, execução automatizada e contratos": [
    "Por que uma automação não deve decidir sucesso pela narrativa do agente?",
    "A narrativa pode citar histórico ou intenção; o consumidor precisa do estado e código definidos no contrato de resultado observado.",
    "Um script publica uma alteração porque encontrou uma palavra positiva num resultado de tarefa falha."
  ],
  "Ambiente remoto e reprodução local": [
    "Por que uma aprovação remota precisa informar o ambiente?",
    "O resultado depende de revisão e condições de execução; runtime, resolução de dependências e configuração podem alterar comportamento.",
    "Um patch aprovado remotamente falha localmente porque outro conjunto de dependências foi resolvido."
  ],
  "Concorrência, divisão e conflitos de integração": [
    "Uma divisão com arquivos distintos garante independência semântica?",
    "Não; contratos e consumidores podem atravessar arquivos. Ownership reduz colisão textual, mas integração precisa verificar relações entre as partes.",
    "Dois agentes mudam formatos compatíveis isoladamente e incompatíveis quando combinados."
  ],
  "Cancelamento, retomada e efeitos repetidos": [
    "O que deve ser observado antes de repetir uma ação cancelada?",
    "Estado e identidade do efeito real precisam ser reconciliados; cancelamento da espera não prova ausência ou reversão da ação.",
    "A retomada duplica uma gravação ou cobrança que já havia sido concluída sem resposta ao cliente."
  ],
  "Artefatos, evidência e gate de publicação": [
    "O que um digest comprova e o que ele não comprova?",
    "Ele associa bytes a uma referência pelo algoritmo escolhido; não comprova qualidade, autorização, origem assinada ou comportamento correto.",
    "Um artefato alterado depois da verificação é publicado usando evidência da versão anterior."
  ],
  "Fluxo de dados e classificação do contexto": [
    "Como tratar um dado cuja classificação ainda é desconhecida?",
    "Resolva a classificação e a autorização antes de transmiti-lo; a ausência de rótulo não equivale a público.",
    "Um dump não classificado é anexado automaticamente e expõe dados que não eram necessários ao diagnóstico."
  ],
  "Configuração, políticas e governança": [
    "Regras textuais do agente substituem controle organizacional independente?",
    "Não; elas orientam comportamento, enquanto enforcement e alcance de política precisam ser verificados no mecanismo correspondente.",
    "Uma preferência local amplia execução ou transmissão além da condição organizacional declarada."
  ],
  "Modelos, avaliação e incerteza": [
    "Por que uma métrica de modelo precisa declarar o denominador?",
    "A razão só é interpretável quando se sabe quais tarefas foram realmente avaliadas e quais continuam sem observação.",
    "Um percentual aparentemente preciso esconde que casos de autorização ou integração não foram exercitados."
  ],
  "Orçamento, latência e limite de tentativas": [
    "O que fazer quando o limite de tentativas é atingido sem concluir a prova?",
    "Registre o estado e a causa restante; limite de recurso não transforma uma verificação incompleta em aprovação.",
    "Um loop consome recursos além do teto ou reduz assertions para encerrar com aparência de sucesso."
  ],
  "Observabilidade de ações e resultados": [
    "Qual associação permite transformar uma observação de ferramenta em evidência de tarefa?",
    "Identidade de ação, revisão e resultado precisam ser correlacionados ao critério pertinente; progresso isolado não estabelece conclusão.",
    "O relatório fecha um gate que ainda possui processo em andamento ou resultado desconhecido."
  ],
  "Dependências, ambiente e supply chain": [
    "Presença de uma dependência comprova reprodução do ambiente?",
    "Não; versão, resolução e condições de execução precisam corresponder, e origem e efeitos de instalação exigem provas adicionais.",
    "A verificação passa com uma API diferente da versão que será usada pelo projeto."
  ],
  "Acessibilidade e revisão da interface": [
    "O que um teste estrutural de nome de botão deixa sem prova?",
    "A árvore acessível real, navegação por teclado, foco e experiência assistiva precisam de ensaios próprios; o predicado cobre somente os dados declarados.",
    "Uma ação gerada pelo agente fica sem nome útil para quem navega com tecnologia assistiva."
  ],
  "Incidente, reversão e passagem de contexto": [
    "Por que uma reversão precisa de precondição sobre o estado atual?",
    "O recurso pode ter mudado após o diagnóstico; aplicar uma recuperação antiga sem comparação pode eliminar uma correção posterior.",
    "Uma resposta a incidente restaura um estado antigo sobre a versão já corrigida por outra pessoa."
  ],
  "Contrato da última vaga e plano de edição": [
    "Por que uma fixture serial não prova proteção contra disputa concorrente?",
    "Ela fixa uma ordem em memória; processos concorrentes e atomicidade do backend exigem ensaio real na fronteira de modificação.",
    "O agente apresenta dois testes sequenciais como prova de que duas transações simultâneas não confirmam a mesma vaga."
  ],
  "Reserva, idempotência e autorização": [
    "Idempotência por ID isolado substitui autorização por tenant?",
    "Não; a identidade do replay precisa respeitar o contexto autorizado e o recurso, e payload conflitante exige contrato próprio.",
    "Uma consulta retorna ou reutiliza a reserva de outro tenant por colisão de ID."
  ],
  "Integração, revisão e evidências do laboratório": [
    "O que associa uma prova do Lab à entrega final?",
    "Implementação, revisão, parâmetros, método e resultado observado precisam corresponder; uma referência curricular ou log antigo não estabelece essa associação.",
    "O relatório fecha proteção concorrente usando uma execução anterior à mudança que quebrou sua atomicidade."
  ],
  "Handoff, limites nativos e fechamento": [
    "Como fechar uma apostila sem transformar procedimentos nativos pendentes em provas?",
    "Ateste somente os exemplos efetivamente executados e registre separadamente método, alcance e gates nativos ainda não observados.",
    "O leitor interpreta exemplos locais como garantia de que o editor, servidor ou backend real foi validado."
  ]
};
const SCENARIOS: [string,string][][] = [
  [
    [
      "No trabalho de Ambiente, tarefa e responsabilidade, a lista contém src/app.ts, src-old/app.ts e docs/guia.md; a raiz de edição permitida é src. O agente propõe trocar o limite de diretório por startsWith sem a barra. Determine a saída correta, identifique a regra violada e explique como a condição um caminho com prefixo textual parecido precisa continuar fora afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente src/app.ts entra na lista de edição. Regra: A pertença exige igualdade com src ou prefixo src/; um prefixo de letras não delimita diretórios. Correção: selecionar o diretório exato ou seus descendentes delimitados por barra. Recuperação: reler o inventário e reaplicar somente a alteração cujo proprietário e caminho foram identificados. Ensaio nativo: abrir a raiz correta no Cursor e conferir os arquivos e consumidores realmente apresentados. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Ambiente, tarefa e responsabilidade, o patch declara app.ts, app.test.ts e billing.ts, mas o pedido permite somente os dois primeiros. O agente propõe filtrar os caminhos permitidos em vez dos caminhos proibidos. Determine a saída correta, identifique a regra violada e explique como a condição ler billing.ts para entender o consumidor não equivale a editar esse arquivo afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "billing.ts aparece como mudança fora do escopo. Regra: Ela verifica o alcance declarado do patch; critérios de comportamento e preservação exigem provas adicionais. Correção: subtrair os caminhos permitidos do conjunto de arquivos modificados. Recuperação: retirar somente a edição fora do contrato preservando mudanças preexistentes no mesmo arquivo. Ensaio nativo: comparar a lista de alterações reais do Cursor com o pedido e o diff do repositório. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Ambiente, tarefa e responsabilidade, abcDEFghi recebe X no intervalo start=3 e end=6. O agente propõe iniciar o sufixo em end+1. Determine a saída correta, identifique a regra violada e explique como a condição end é exclusivo e não deve avançar uma posição adicional afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o texto final é abcXghi com o g inicial do sufixo preservado. Regra: O índice end já pertence ao texto preservado; a substituição remove os índices start até end menos um. Correção: concatenar prefixo anterior a start, substituição e sufixo iniciado em end. Recuperação: comparar a edição com a versão-base e restaurar apenas o caractere removido fora da seleção. Ensaio nativo: selecionar o trecho no Cursor, revisar o diff e executar seus consumidores reais. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Contexto e navegação do código, service.ts e service.test.ts são relevantes e públicos; prod-dump.json é relevante e restrito. O agente propõe considerar apenas relevância e omitir a classificação. Determine a saída correta, identifique a regra violada e explique como a condição um arquivo útil para o diagnóstico ainda pode ter conteúdo proibido para envio afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "service.ts e service.test.ts formam o contexto elegível. Regra: A classificação e a autorização de transmissão continuam necessárias; utilidade para diagnóstico não elimina restrição de dados. Correção: aceitar somente registros relevantes e sem classificação sensível. Recuperação: retirar o dump, revisar a exposição e reproduzir o defeito com dados sintéticos aprovados. Ensaio nativo: conferir no Cursor as referências incluídas e o conteúdo efetivo autorizado para a sessão. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Contexto e navegação do código, os termos estoque e autorizar aparecem em doc-a; somente estoque aparece em doc-b; doc-c não contém nenhum. O agente propõe ordenar a pontuação em ordem crescente. Determine a saída correta, identifique a regra violada e explique como a condição um documento bem ranqueado continua exigindo leitura e rastreamento de execução afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a ordem é doc-a, doc-b, doc-c. Regra: Comprova apenas a aplicação do critério textual declarado; relação causal exige examinar o fluxo e reproduzir o defeito. Correção: contar termos distintos e ordenar por pontuação decrescente, com ID como desempate. Recuperação: retomar a investigação a partir do símbolo executado e registrar os caminhos que sustentam a hipótese. Ensaio nativo: executar buscas no Cursor instalado e abrir as referências concretas retornadas. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Contexto e navegação do código, service.ts coincide com digest s1; old.ts tem digest diferente; hidden.ts coincide mas está omitido. O agente propõe ignorar a divergência de digest e selecionar arquivos apenas por não estarem omitidos. Determine a saída correta, identifique a regra violada e explique como a condição igualdade de conteúdo não revoga uma exclusão explícita afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente service.ts é registro atual elegível. Regra: A referência deve corresponder ao conteúdo atual e ao alcance permitido; existência não prova versão nem elegibilidade. Correção: aceitar coincidência de digest e elegibilidade de acesso declarada. Recuperação: corrigir raiz ou política pertinente e repetir a consulta sobre a versão conhecida sem reintroduzir arquivos sensíveis. Ensaio nativo: observar a descoberta do arquivo sintético e sua revisão no mecanismo de busca do Cursor instalado. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Instruções persistentes e documentação, a regra declarada possui alwaysApply=false e descrição sobre serviços de pagamento. O agente propõe testar somente a presença de alwaysApply. Determine a saída correta, identifique a regra violada e explique como a condição a chave presente com valor false não deve ser tratada como true afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a regra não é classificada como sempre aplicável. Regra: Presença e valor são propriedades distintas; aplicação global exige o valor booleano true no objeto interpretado. Correção: avaliar igualdade estrita do valor booleano com true. Recuperação: corrigir o metadado específico e reavaliar a tarefa em vez de tornar todas as regras globais. Ensaio nativo: criar uma regra sintética MDC no Cursor e verificar reconhecimento e inclusão conforme sua configuração. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Instruções persistentes e documentação, ui utiliza prefixo src/ui/ e legacy utiliza src/legacy/; o alvo é src/ui-old/button.tsx. O agente propõe remover a barra final antes de comparar prefixos. Determine a saída correta, identifique a regra violada e explique como a condição ui-old compartilha letras com ui mas possui responsabilidade e diretório diferentes afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "nenhuma dessas duas regras locais corresponde ao alvo. Regra: Inclua um caminho de fronteira que compartilha o prefixo textual e exija que ele permaneça fora da correspondência. Correção: comparar o caminho com o prefixo delimitado declarado. Recuperação: corrigir o alcance e revisar edições feitas sob a orientação incorreta. Ensaio nativo: avaliar padrões reais e regras anexadas à sessão Cursor para arquivos dos dois diretórios. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Instruções persistentes e documentação, o alvo services/payments/pay.ts possui orientações na raiz, em services/ e uma orientação alheia em services-old/. O agente propõe aceitar qualquer instrução cujo diretório começa com services. Determine a saída correta, identifique a regra violada e explique como a condição um diretório irmão semelhante não é ancestral do arquivo afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a ordem de leitura contém raiz e services, sem services-old. Regra: A aplicabilidade local depende de ancestralidade do caminho, não de vocabulário semelhante no nome do diretório. Correção: selecionar prefixos ancestrais delimitados e ordenar por profundidade. Recuperação: reconstruir a hierarquia pertinente e revisar as decisões tomadas com orientação de pasta irmã. Ensaio nativo: inspecionar as instruções reconhecidas no Cursor ao trabalhar no arquivo alvo e na raiz correta. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Especificação e alteração controlada, unidade=true, quantidade=false e estoque=true compõem os três critérios de aceitação. O agente propõe aceitar quando algum resultado é true. Determine a saída correta, identifique a regra violada e explique como a condição um conjunto vazio não pode ser aprovado por verdade vacuosa afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o gate de aceitação retorna false porque quantidade não passou. Regra: As obrigações são cumulativas; o fechamento exige cada critério pertinente, com resultado observado e conjunto não vazio. Correção: exigir uma lista não vazia e todos os resultados iguais a true. Recuperação: corrigir o critério falho e repetir a regressão afetada antes de fechar o pedido. Ensaio nativo: reproduzir cada critério na revisão real produzida pelo Cursor e observar os consumidores pertinentes. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Especificação e alteração controlada, o texto contém duas ocorrências de total=0 e a proposta substitui total=0 por total=1. O agente propõe usar replace e aceitar a primeira ocorrência. Determine a saída correta, identifique a regra violada e explique como a condição duas ocorrências iguais não identificam qual função o usuário quis alterar afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o resultado é null porque a proposta é ambígua. Regra: Falta identidade inequívoca do alvo; contexto ou versão-base precisam distinguir a ocorrência antes da aplicação. Correção: aplicar somente quando a âncora antiga possui uma ocorrência única. Recuperação: relocalizar o alvo pelo símbolo e reaplicar uma proposta inequívoca na base atual. Ensaio nativo: revisar o hunk e a base realmente apresentados pelo Cursor antes de aceitar a edição. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Especificação e alteração controlada, users depende de pricing, route depende de users e unrelated não depende de nenhum deles. O agente propõe incluir apenas consumidores diretos de pricing. Determine a saída correta, identifique a regra violada e explique como a condição um consumidor indireto precisa ser considerado mesmo sem chamada textual ao produtor inicial afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "pricing, route e users formam o conjunto afetado ordenado. Regra: A incompatibilidade pode propagar pelo contrato intermediário; a ausência de chamada direta não elimina dependência comportamental. Correção: propagar a mudança de pricing por consumidores diretos e transitivos até estabilizar. Recuperação: atualizar ou adaptar o consumidor incompatível e repetir o fluxo de entrada ao efeito. Ensaio nativo: rastrear consumidores reais no Cursor e executar as verificações que cruzam essas interfaces. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Terminal e fronteiras de confiança, o alvo é tests/cart total.test.ts no diretório workspace/app e o runner declarado é vitest. O agente propõe dividir o caminho por espaços ao montar argv. Determine a saída correta, identifique a regra violada e explique como a condição espaços fazem parte do valor do caminho e não criam um segundo alvo afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "os argumentos são exec, vitest, run e tests/cart total.test.ts. Regra: A fronteira entre argumentos pertence à interface de processo; dividir o valor muda o alvo interpretado pela ferramenta. Correção: construir argv mantendo o caminho inteiro como um único elemento. Recuperação: corrigir a montagem dos argumentos e repetir a verificação pertinente sem alterar seu threshold. Ensaio nativo: executar o comando aprovado no terminal Cursor e conferir diretório, parâmetros e testes selecionados. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Terminal e fronteiras de confiança, a concessão permite write em staging sobre migrations/001.sql; o pedido aponta o mesmo arquivo em production. O agente propõe validar apenas o verbo write. Determine a saída correta, identifique a regra violada e explique como a condição mesmo caminho e mesmo verbo não tornam staging e production equivalentes afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o pedido de produção retorna false. Regra: Operação, alvo, ambiente e condições concedidas precisam corresponder ao pedido efetivo; o verbo isolado não delimita a capacidade. Correção: comparar operação, ambiente e recurso com a concessão específica. Recuperação: interromper o efeito fora do escopo e preparar uma proposta específica para o recurso correto. Ensaio nativo: verificar parâmetros e aprovação da chamada real na configuração de execução Cursor pertinente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Terminal e fronteiras de confiança, o caminho solicitado é workspace-old/secrets.txt e a única raiz textual permitida é workspace/. O agente propõe usar startsWith de workspace sem barra delimitadora. Determine a saída correta, identifique a regra violada e explique como a condição a igualdade de prefixo de letras não estabelece pertença à raiz protegida afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o caminho semelhante é recusado. Regra: Não; ela comprova apenas seu predicado sobre strings. Resolução real, links, permissões e enforcement precisam de ensaios nativos. Correção: recusar componentes de navegação e exigir prefixo de raiz delimitado. Recuperação: corrigir a política pertinente e revalidar cada fronteira afetada antes de ampliar execução automática. Ensaio nativo: ensaiar acessos sintéticos no modo de sandbox Cursor efetivamente configurado sem usar segredos reais. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Testes e diagnóstico orientado a evidência, estoque=3 e quantidade=3 representam a reserva de todas as unidades disponíveis. O agente propõe usar quantidade menor que estoque em vez de menor ou igual. Determine a saída correta, identifique a regra violada e explique como a condição igualdade entre quantidade e estoque precisa pertencer ao domínio aceito afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a reserva retorna saldo 0 em vez de ser recusada. Regra: Ele distingue diretamente comparação inclusiva de comparação estrita; um estoque maior não contradiz esse mutant. Correção: aceitar quantidade até o limite inclusivo e calcular o saldo restante. Recuperação: corrigir a condição inclusiva e preservar o caso de igualdade na regressão. Ensaio nativo: reproduzir a entrada pelo caminho real de reserva alterado pelo Cursor e verificar a resposta e o saldo. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Testes e diagnóstico orientado a evidência, preço inteiro de 101 centavos recebe desconto de 10 por cento arredondado para baixo antes da subtração. O agente propõe arredondar para baixo o saldo proporcional em vez do desconto. Determine a saída correta, identifique a regra violada e explique como a condição a fração de 0,1 no desconto diferencia onde o arredondamento ocorre afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o saldo é 91 centavos. Regra: Declare a política e derive manualmente o literal esperado; não obtenha a expectativa chamando a implementação que está sendo avaliada. Correção: calcular floor de preço vezes percentual dividido por cem e subtrair esse desconto. Recuperação: corrigir o ponto de arredondamento e conferir casos fracionários pertinentes ao contrato. Ensaio nativo: verificar a política real do domínio e executar o teste no consumidor efetivo da alteração Cursor. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Testes e diagnóstico orientado a evidência, os gates exigidos são typecheck, unit e build; há sucesso apenas para os dois primeiros. O agente propõe listar somente gates explicitamente failed. Determine a saída correta, identifique a regra violada e explique como a condição ausência de resultado não equivale a ausência de falha afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "build permanece como gate pendente. Regra: Pending; nem aprovação de tipos nem testes locais substituem a observação do artefato correspondente. Correção: listar cada gate cujo registro não é passed. Recuperação: executar o gate ausente ou registrar o impedimento específico sem reclassificá-lo como aprovação. Ensaio nativo: rodar typecheck, build e testes aplicáveis na revisão real e inspecionar os artefatos produzidos. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Git, checkpoints e colaboração, baseline contém antigo, current contém contribuição-alheia e proposed contém correção-agente. O agente propõe aceitar proposed sem comparar a base atual. Determine a saída correta, identifique a regra violada e explique como a condição um arquivo lido no início pode mudar antes da aplicação afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o resultado é conflict e mantém contribuição-alheia. Regra: Releia a contribuição atual e componha a correção sobre ela; não sobrescreva o arquivo com a fotografia antiga. Correção: aplicar a proposta somente se a base atual ainda igualar a fotografia inicial. Recuperação: recuperar a contribuição preservada e compor somente o trecho autorizado na base atual. Ensaio nativo: comparar base, conteúdo atual e diff real no workspace Cursor compartilhado. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Git, checkpoints e colaboração, agent.ts passou de A para B e user.ts passou de U para contribuição-humana; owned contém apenas agent.ts. O agente propõe substituir now pelo snapshot before completo. Determine a saída correta, identifique a regra violada e explique como a condição uma restauração inteira pode apagar alterações posteriores fora da tarefa afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "agent.ts retorna a A e user.ts permanece contribuição-humana. Regra: A restauração deve recuperar o efeito pretendido e preservar contribuições fora de seu alcance; o nome checkpoint não estabelece essa propriedade. Correção: restaurar somente os campos cuja autoria está declarada em owned. Recuperação: recuperar a contribuição humana e limitar a reversão aos trechos identificados da tarefa. Ensaio nativo: examinar a restauração efetiva de checkpoint e o diff Git na sessão Cursor pertinente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Git, checkpoints e colaboração, feature2 descende de feature e a; main2 descende de main e a. O agente propõe retornar o pai de head sem percorrer a outra linha. Determine a saída correta, identifique a regra violada e explique como a condição o pai imediato de head pode existir somente na branch da tarefa afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o ancestral comum é a. Regra: A base delimita quais alterações pertencem à linha de trabalho; escolher só o último pai pode ocultar parte da entrega. Correção: percorrer ancestrais de head e localizar o primeiro ancestral compartilhado com base. Recuperação: recalcular o diff a partir da base pertinente e repetir a revisão dos arquivos antes omitidos. Ensaio nativo: conferir branch, checkout e merge base reais ao revisar alterações produzidas no Cursor. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Ferramentas externas e extensibilidade, readIssue exige issues:read, writeIssue exige issues:write e publish exige release:write; o pedido exige issues:read. O agente propõe comparar só o prefixo do recurso antes de dois pontos. Determine a saída correta, identifique a regra violada e explique como a condição compartilhar o recurso issues não torna leitura e escrita equivalentes afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "readIssue é a única ferramenta elegível. Regra: Capacidade inclui operação e alvo; conectar a fonte ou compartilhar seu nome não concede escrita ou publicação. Correção: selecionar somente ferramenta cuja capability é igual à necessária. Recuperação: reduzir a capacidade à operação necessária e revisar efeitos indevidos antes de retomar a tarefa. Ensaio nativo: conectar um servidor MCP apropriado no Cursor e observar identidade, schema e autorização de chamadas sintéticas. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Ferramentas externas e extensibilidade, item é vaga-1 e qty é 2.5, embora o contrato declare quantidade inteira positiva. O agente propõe validar tipo number e positividade sem exigir inteiro. Determine a saída correta, identifique a regra violada e explique como a condição um número positivo ainda pode violar indivisibilidade afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a entrada fracionária retorna false. Regra: A primeira verifica o domínio declarado dos dados; a segunda depende de identidade, recurso e estado, mesmo quando os dados têm forma válida. Correção: exigir Number.isInteger para qty, positividade e ID textual não vazio. Recuperação: corrigir a fronteira de validação e repetir o caso inválido antes de permitir o efeito. Ensaio nativo: validar argumentos e retornos contra o schema real do servidor MCP e a chamada observada no Cursor. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Ferramentas externas e extensibilidade, os eventos concluídos têm IDs a, a e b, sendo o segundo a uma reentrega idêntica. O agente propõe contar linhas sem deduplicar actionId. Determine a saída correta, identifique a regra violada e explique como a condição reentrega de log não demonstra que um segundo efeito ocorreu afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o número de ações observadas é 2. Regra: Eventos podem ser reentregues; sem identidade, contagem de mensagens pode ser confundida com contagem de efeitos. Correção: contar identidades distintas de ações concluídas. Recuperação: corrigir a interpretação de identidade e reprocessar eventos preservando o histórico original. Ensaio nativo: configurar um hook sintético no Cursor e observar invocação, campos e consequência no fluxo pertinente. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Agentes remotos e trabalho prolongado, origem e destino usam revisão r7 e Node24, mas seus lockfiles possuem identificadores L1 e L2. O agente propõe verificar apenas revisão. Determine a saída correta, identifique a regra violada e explique como a condição mesma revisão do código não implica mesma resolução de dependências afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "lockfile aparece como divergência conhecida. Regra: O resultado depende de revisão e condições de execução; runtime, resolução de dependências e configuração podem alterar comportamento. Correção: comparar revisão, runtime e lockfile e listar dimensões divergentes. Recuperação: alinhar a dimensão divergente autorizada e repetir o gate afetado com a diferença registrada. Ensaio nativo: comparar manifestos e execução real entre ambiente Cloud Agent Cursor e ambiente de consumo pertinente. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Agentes remotos e trabalho prolongado, A declara service.ts e schema.ts; B declara schema.ts e ui.ts. O agente propõe comparar apenas os primeiros caminhos das listas. Determine a saída correta, identifique a regra violada e explique como a condição a posição do nome dentro de cada lista não muda a identidade compartilhada afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "schema.ts é a sobreposição que exige coordenação. Regra: Não; contratos e consumidores podem atravessar arquivos. Ownership reduz colisão textual, mas integração precisa verificar relações entre as partes. Correção: calcular a interseção de todos os caminhos declarados. Recuperação: recompor os patches sobre contrato comum e resolver a sobreposição preservando contribuições. Ensaio nativo: observar checkouts, bases e patches reais de tarefas Cursor e executar o gate de integração entre suas interfaces. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Agentes remotos e trabalho prolongado, saldo=7, applied contém a e o pedido repete débito de 3 com ID a. O agente propõe subtrair o valor sem consultar a identidade. Determine a saída correta, identifique a regra violada e explique como a condição perda da resposta não permite concluir que o débito não aconteceu afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o replay mantém saldo 7 e applied com a. Regra: Estado e identidade do efeito real precisam ser reconciliados; cancelamento da espera não prova ausência ou reversão da ação. Correção: consultar o ID aplicado antes de modificar o saldo. Recuperação: reconciliar a identidade e devolver o resultado existente ou executar apenas o efeito ainda ausente. Ensaio nativo: cancelar e consultar uma operação sintética apropriada no fluxo Cursor e no recurso efetivamente chamado. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Privacidade, qualidade e custos, doc-a é público, doc-b interno-autorizado, doc-c restrito e doc-d desconhecido. O agente propõe aceitar desconhecido junto das categorias permitidas. Determine a saída correta, identifique a regra violada e explique como a condição classificação desconhecida não pode ser convertida em permissão implícita afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "doc-a e doc-b entram na lista de contexto. Regra: Resolva a classificação e a autorização antes de transmiti-lo; a ausência de rótulo não equivale a público. Correção: selecionar somente categorias explicitamente permitidas. Recuperação: retirar o material não autorizado e avaliar seu destino real segundo o procedimento pertinente de exposição. Ensaio nativo: mapear e observar o contexto e as transmissões reais do fluxo Cursor conforme políticas da conta e do projeto. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Privacidade, qualidade e custos, o teto organizacional é 3 tentativas e a preferência do projeto é 5. O agente propõe usar o maior teto. Determine a saída correta, identifique a regra violada e explique como a condição uma preferência subordinada não aumenta a capacidade acima do teto confirmado afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o limite efetivo é 3. Regra: Não; elas orientam comportamento, enquanto enforcement e alcance de política precisam ser verificados no mecanismo correspondente. Correção: compor os dois tetos pelo menor valor. Recuperação: corrigir a configuração pertinente e repetir a ação sintética que demonstra o limite. Ensaio nativo: conferir políticas e configuração efetivamente aplicadas à conta, projeto e sessão Cursor usados. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Privacidade, qualidade e custos, há duas tarefas passed, uma failed e uma pending. O agente propõe dividir aprovações pelo total incluindo pending. Determine a saída correta, identifique a regra violada e explique como a condição uma tarefa não observada não pode ser tratada como acerto ou falha medida afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "a avaliação retorna ratio=2/3, evaluated=3 e pending=1. Regra: A razão só é interpretável quando se sabe quais tarefas foram realmente avaliadas e quais continuam sem observação. Correção: calcular razão de passed entre passed e failed e contar pending separadamente. Recuperação: corrigir a métrica e avaliar os casos faltantes quando houver superfície e autorização pertinentes. Ensaio nativo: avaliar saídas reais de modelos usados no Cursor contra casos e critérios independentes do projeto. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Armadilhas de operação e acessibilidade, o histórico tem start(a), finish(a) e start(b). O agente propõe listar todas as ações iniciadas como concluídas. Determine a saída correta, identifique a regra violada e explique como a condição início não comprova fim e ausência de fim não comprova reversão de efeito afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "somente a aparece como concluída. Regra: Identidade de ação, revisão e resultado precisam ser correlacionados ao critério pertinente; progresso isolado não estabelece conclusão. Correção: selecionar ações iniciadas que também possuem conclusão da mesma identidade. Recuperação: consultar o estado da ação incompleta e corrigir o relatório sem atribuir sucesso presumido. Ensaio nativo: correlacionar ações e resultados realmente expostos pela sessão Cursor e ferramentas usadas. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Armadilhas de operação e acessibilidade, o lockfile espera parser-demo 1.0 e o inventário declara parser-demo 1.1. O agente propõe aceitar qualquer versão quando o nome existe. Determine a saída correta, identifique a regra violada e explique como a condição pacote existente com nome correto ainda pode conter outra versão afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "parser-demo aparece na lista de divergências. Regra: Não; versão, resolução e condições de execução precisam corresponder, e origem e efeitos de instalação exigem provas adicionais. Correção: comparar a versão instalada exata com a versão travada. Recuperação: alinhar a resolução pertinente quando autorizado e repetir o gate sem instalar infraestrutura substituta. Ensaio nativo: conferir gerenciador, lockfile, inventário e scripts reais do ambiente de execução utilizado com Cursor. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Armadilhas de operação e acessibilidade, save é button com nome Salvar e delete é button com nome vazio. O agente propõe usar ID como fallback para aceitar um nome ausente. Determine a saída correta, identifique a regra violada e explique como a condição ID interno não é automaticamente nome acessível apresentado à pessoa afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "delete aparece como violação estrutural. Regra: A árvore acessível real, navegação por teclado, foco e experiência assistiva precisam de ensaios próprios; o predicado cobre somente os dados declarados. Correção: listar controles button cujo nome textual está vazio após trim. Recuperação: corrigir o nome e as relações do controle e repetir o percurso da tarefa. Ensaio nativo: testar o fluxo real da interface alterada pelo Cursor com teclado e inspeção acessível pertinente. A fixture local não atesta essa superfície."
    ]
  ],
  [
    [
      "No trabalho de Projeto Quíron com Cursor, estoque=1 e os pedidos p1 e p2 solicitam uma vaga cada, nessa ordem serial. O agente propõe avaliar cada pedido contra o estoque inicial sem descontar a aceitação anterior. Determine a saída correta, identifique a regra violada e explique como a condição ler sempre o estoque inicial permite duas aceitações incompatíveis com disponibilidade unitária afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "p1 é accepted, p2 é rejected e o saldo final é 0. Regra: Ela fixa uma ordem em memória; processos concorrentes e atomicidade do backend exigem ensaio real na fronteira de modificação. Correção: atualizar o saldo depois de cada pedido aceito antes de avaliar o seguinte. Recuperação: corrigir a fronteira de reserva e repetir os casos serial e concorrente com seus métodos separados. Ensaio nativo: exercitar a camada reserva-estoque-concorrencia do Lab Ágora e o backend pertinente com disputa real autorizada. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Projeto Quíron com Cursor, os tenants t1 e t2 possuem reserva ID k com payloads diferentes; o contexto solicita t2 e k. O agente propõe consultar somente ID e ignorar tenant. Determine a saída correta, identifique a regra violada e explique como a condição um ID igual em outro tenant não pertence ao contexto autorizado afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "o payload devolvido é reserva-t2. Regra: Não; a identidade do replay precisa respeitar o contexto autorizado e o recurso, e payload conflitante exige contrato próprio. Correção: selecionar o registro pela combinação de tenant e ID. Recuperação: corrigir a chave contextual e revisar leituras e efeitos derivados da seleção indevida. Ensaio nativo: verificar identidade autenticada, consulta, restrição de chave e replay no backend real usado pelo Lab e pela edição Cursor. A fixture local não atesta essa superfície."
    ],
    [
      "No trabalho de Projeto Quíron com Cursor, a revisão final é r4; unit, typecheck e build passaram em r4, mas concurrency passou somente em r3. O agente propõe aceitar aprovação do gate em qualquer revisão. Determine a saída correta, identifique a regra violada e explique como a condição uma prova válida para a implementação anterior não acompanha automaticamente uma mudança na fronteira de reserva afeta a decisão. Descreva uma contraprova e o ensaio nativo que ainda seria necessário, preservando o alcance da autorização.",
      "concurrency permanece na lista de provas faltantes de r4. Regra: Implementação, revisão, parâmetros, método e resultado observado precisam corresponder; uma referência curricular ou log antigo não estabelece essa associação. Correção: listar gates sem aprovação correspondente à revisão final. Recuperação: repetir a prova afetada na revisão atual e manter a limitação explícita até o resultado observado. Ensaio nativo: executar a camada pertinente do Lab sobre a revisão final e confrontar seus resultados com testes e artefatos reais. A fixture local não atesta essa superfície."
    ]
  ]
];
export const CURSOR_CARDS: ContentSource["cards"] = CURSOR_CURRICULUM.flatMap(chapter=>chapter.sections.map(title=>({nodeTitle:chapter.title,frontMd:CURSOR_REVIEW[title][0],backMd:CURSOR_REVIEW[title][1]})));
export const CURSOR_EXERCISES: ContentSource["exercises"] = CURSOR_CURRICULUM.flatMap((chapter,index)=>SCENARIOS[index].map(([promptMd,answerKeyMd],position)=>({nodeTitle:chapter.title,type:([2,3,5] as const)[position],level:chapter.level==="basico"?"beginner" as const:chapter.level==="intermediario"?"intermediate" as const:"advanced" as const,promptMd,answerKeyMd,points:3})));
