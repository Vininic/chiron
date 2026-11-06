import type { ContentSource } from "./types";
import { LLM_CURRICULUM } from "./llmCurriculum";
type Review=[question:string,answer:string,failure:string];
export const LLM_REVIEW: Record<string,Review> = {
  "Tarefas e critérios de sucesso": [
    "Por que fluência não basta como critério?",
    "A tarefa exige correção, cobertura e limites específicos; texto convincente pode violar fatos ou autoridade.",
    "Uma explicação elegante pode inventar resultado de exercício ou ação concluída."
  ],
  "Geração probabilística e incerteza": [
    "Temperatura baixa garante resposta correta?",
    "Não; variação e correção são propriedades distintas e o comportamento depende do modelo e tarefa.",
    "Uma resposta repetível pode estar consistentemente errada."
  ],
  "Modelo, provedor e capacidades": [
    "Adaptadores de provedores podem ser intercambiados sem contrato?",
    "Não; formatos, capacidades, erros, estados e permissões precisam mapeamento explícito.",
    "Converter tudo em texto pode apagar tool calls, recusas e resultados incompletos."
  ],
  "Tokens, contexto e orçamento": [
    "Contar caracteres fornece tokens exatos?",
    "Não; tokenizer e conteúdo determinam a segmentação. Estimativas precisam limite e validação próprios.",
    "Orçamento pode estourar mesmo quando uma contagem de palavras parece pequena."
  ],
  "Instruções, dados e confiança": [
    "Delimitar dados garante proteção contra injection?",
    "Não; organização ajuda contexto, mas autorização de efeitos e validação externa continuam necessárias.",
    "Dados externos podem tentar alterar o objetivo sem ter autoridade para isso."
  ],
  "Contexto relevante e delimitação": [
    "Mais contexto sempre melhora a resposta?",
    "Não; relevância, validade, conflito e orçamento importam. Texto extra pode adicionar ruído ou exposição.",
    "Recorte pode remover uma exceção e inverter a regra ensinada."
  ],
  "Exemplos e versões de prompt": [
    "Exemplos do prompt podem servir como única prova de qualidade?",
    "Não; são material de instrução. Avaliação precisa casos e condições que testem generalização pertinente.",
    "Vazamento entre desenvolvimento e avaliação pode inflar a medida."
  ],
  "Saída estruturada e validação": [
    "Schema válido prova afirmação correta?",
    "Não; schema controla estrutura. Verdade, domínio e autorização exigem validações adicionais.",
    "Um objeto perfeitamente tipado ainda pode inventar uma reserva confirmada."
  ],
  "Pedidos, identidade e configuração": [
    "Um objeto de request local prova compatibilidade da API?",
    "Não; apenas representa contrato interno. Aceitação do payload e autenticação exigem chamada real ao endpoint.",
    "Configuração livre pode enviar dados para destino indevido."
  ],
  "Streaming e enquadramento": [
    "Chunk de rede equivale a evento completo?",
    "Não; transporte pode fragmentar linhas, bytes e eventos. É necessário buffering e enquadramento correto.",
    "Parser por chunk pode perder caracteres ou aceitar JSON parcial."
  ],
  "Erros, timeout e cancelamento": [
    "Abortar cliente garante desfazer efeito remoto?",
    "Não; interrupção de espera e rollback são mecanismos distintos. Resultado pode exigir reconciliação.",
    "Um retry com comando novo pode repetir um efeito já aplicado."
  ],
  "Retry, rate limits e orçamento": [
    "Backoff resolve todo erro HTTP?",
    "Não; validação e autenticação exigem correção. Retry precisa classificação, limite e semântica de efeito.",
    "Um loop de retry pode aumentar custo sem corrigir a causa."
  ],
  "Documentos, chunks e procedência": [
    "Chunk pode perder significado ao ser recortado?",
    "Sim; condições, exceções e relações dependem do contexto. Procedência e segmentação precisam preservar a interpretação.",
    "Uma frase isolada pode ensinar regra oposta à fonte completa."
  ],
  "Embeddings e similaridade": [
    "Cosseno alto comprova que o documento é verdadeiro?",
    "Não; é uma medida geométrica de vetores compatíveis. Verdade e relevância precisam avaliação e fontes.",
    "Vetores incompatíveis podem gerar número sem significado semântico."
  ],
  "Ranking, filtros e isolamento": [
    "Score de ranking concede permissão de leitura?",
    "Não; relevância e autorização são critérios independentes. Acesso precisa filtragem e revalidação pertinentes.",
    "Esconder a citação não desfaz exposição de conteúdo enviado ao modelo."
  ],
  "RAG, citações e abstenção": [
    "Citação existente garante suporte à afirmação?",
    "Não; é necessário conferir se o trecho realmente sustenta o claim e se a revisão é pertinente.",
    "Um link verdadeiro pode acompanhar uma conclusão inventada."
  ],
  "Histórico e projeção de conversa": [
    "Conversa antiga é autoridade de estado atual?",
    "Não; domínio exige fonte vigente. Histórico registra comunicação e observações de seus momentos.",
    "Um saldo mencionado antes pode estar desatualizado agora."
  ],
  "Resumo, perda e continuidade": [
    "Resumo pode virar fonte canônica sem vínculo?",
    "Não; é uma derivação que pode perder significado. Precisa origem e invariantes pertinentes.",
    "Uma condição omitida pode mudar o comportamento do fluxo retomado."
  ],
  "Memória, consentimento e retenção": [
    "Uma mensagem autoriza memória permanente automaticamente?",
    "Não; retenção precisa finalidade e autorização pertinentes, com validade e controle de acesso.",
    "Reuso indevido pode expor dados de outra pessoa."
  ],
  "Cache, validade e invalidação": [
    "Pergunta igual garante resposta cacheável igual?",
    "Não; dados, revisão, usuário, política, modelo e prompt podem mudar o resultado e sua autorização.",
    "Cache sem escopo pode reutilizar informação privada em outra conversa."
  ],
  "Tool calling e dispatch": [
    "Tool call equivale a ação autorizada?",
    "Não; é proposta de chamada. Aplicação valida catálogo, domínio, identidade e permissão antes do efeito.",
    "Nome gerado pode apontar para função fora do escopo."
  ],
  "Schema, domínio e autorização": [
    "ID existente prova autorização de uso?",
    "Não; existência, validade de domínio e permissão de ação são verificações distintas.",
    "Argumentos tipados podem modificar recurso de outro usuário."
  ],
  "Plano, aprovação e pré-condições": [
    "Aprovação do plano autoriza payload diferente?",
    "Não; autorização precisa corresponder a escopo e conteúdo revisados e às condições atuais.",
    "Uma alteração depois do review pode ampliar efeito sem decisão humana pertinente."
  ],
  "Idempotência e resultado desconhecido": [
    "Ledger em memória comprova idempotência operacional?",
    "Não; demonstra regra serial. Persistência, concorrência e fronteiras de falha exigem ensaio real.",
    "Restart ou retry com identidade nova pode repetir efeito."
  ],
  "Estados, transições e término": [
    "Por que declarar estados terminais?",
    "Para encerrar atividade quando há resultado e evitar loops ou efeitos posteriores fora do contrato.",
    "Um fluxo pode continuar gastando ou agir depois de já estar concluído."
  ],
  "Delegação, escopo e isolamento": [
    "Mensagem de outro agente concede autorização humana?",
    "Não; resultados e pedidos de agentes precisam permanecer dentro do escopo autorizado pela pessoa.",
    "Delegação pode ampliar efeitos e criar conflitos sem revisão."
  ],
  "Humano no fluxo e retomada": [
    "Tempo de espera pode substituir aprovação?",
    "Não; decisão necessária exige resposta explícita. Expiração precisa política própria, não consentimento presumido.",
    "Um workflow pode aplicar efeito sem decisão enviada."
  ],
  "Limites, loops e compensação": [
    "Compensação equivale a rollback universal?",
    "Não; é ação de domínio com seus próprios efeitos, permissões e possibilidade de falha.",
    "Restaurar memória não apaga mensagem já enviada."
  ],
  "Texto, imagem e representação": [
    "Extensão prova o formato dos bytes?",
    "Não; representação exige validação pertinente. Conteúdo e qualidade visual são verificações adicionais.",
    "Um rótulo correto pode acompanhar arquivo inválido ou informação excessiva."
  ],
  "Áudio, transcrição e tempo": [
    "Transcrição é equivalente perfeita ao áudio?",
    "Não; pode perder informação e conter erros. Origem, tempo e incerteza precisam preservação.",
    "Uma negação omitida pode inverter a decisão registrada."
  ],
  "Arquivos, extração e qualidade": [
    "Parser sem exceção prova extração fiel?",
    "Não; ordem, relações, omissões e conteúdo visual precisam comparação com a fonte.",
    "Um valor correto pode ficar associado ao cabeçalho errado."
  ],
  "Conteúdo gerado e revisão": [
    "Geração concluída equivale a publicação autorizada?",
    "Não; geração, revisão e efeito de publicação têm contratos e decisões próprios.",
    "Uma saída convincente pode conter referência inexistente."
  ],
  "Prompt injection e fronteiras": [
    "Uma página pode conceder permissão de ferramenta?",
    "Não; conteúdo da página é dado. Autorização precisa autoridade externa e escopo pertinente.",
    "Pedido convincente em fonte externa pode tentar ampliar acesso."
  ],
  "Privilégio mínimo e recursos": [
    "Nome de ferramenta descreve todo seu impacto?",
    "Não; é preciso conhecer recursos, ações e dependências que ela pode alcançar.",
    "Uma operação aparentemente pequena pode carregar privilégios amplos."
  ],
  "Segredos, dados pessoais e logs": [
    "Máscara visual prova remoção do dado armazenado?",
    "Não; o valor pode continuar em objeto, log, cache ou arquivo. Minimização exige método pertinente.",
    "Um trace útil pode virar canal de exposição de segredo."
  ],
  "Conteúdo inseguro e triagem": [
    "Classificação de risco autoriza ferramenta?",
    "Não; triagem de conteúdo e autorização de recurso e ação possuem responsabilidades distintas.",
    "Texto educado pode pedir efeito proibido."
  ],
  "Dataset, amostragem e splits": [
    "Divisão aleatória sempre impede vazamento?",
    "Não; duplicatas e itens da mesma origem podem atravessar splits. Identidade e agrupamento precisam política.",
    "Medida pode refletir memorização do ajuste e não desempenho pertinente."
  ],
  "Oracles, rubricas e mutantes": [
    "Mutante sintaticamente quebrado testa toda qualidade do oracle?",
    "Não; contraprova precisa erro relevante de conteúdo ou efeito que o critério deveria detectar.",
    "Semelhança textual pode aceitar significado oposto."
  ],
  "Métricas, fatias e incerteza": [
    "Média alta elimina necessidade de fatias?",
    "Não; subgrupos e falhas críticas podem exigir critérios separados e análise de evidência.",
    "Um ganho geral pode coexistir com regressão grave em acesso negado."
  ],
  "Mudança de modelo e regressão": [
    "Modelo mais novo garante melhoria em toda tarefa?",
    "Não; migração exige avaliação por tarefa, capacidade, custo e falhas pertinentes.",
    "Uma atualização pode melhorar média e piorar efeito crítico."
  ],
  "Custo, latência e limites": [
    "Tempo de cálculo local é latência do modelo?",
    "Não; transporte, geração e demais etapas precisam medição real com fronteiras explícitas.",
    "Uma estimativa parcial pode esconder custo de retries."
  ],
  "Traces, correlação e diagnósticos": [
    "Trace substitui estado de domínio?",
    "Não; diagnóstico e autoridade de efeito são responsabilidades distintas. Trace precisa vínculo com evidência pertinente.",
    "Um log de chamada não prova que o efeito foi persistido."
  ],
  "Disponibilidade e fallback": [
    "Fallback disponível é necessariamente adequado?",
    "Não; capacidade, dados, qualidade e semântica de efeito precisam compatibilidade e evidência.",
    "Uma resposta de alternativa pode quebrar a tarefa original."
  ],
  "Release, rollback e monitoramento": [
    "Rollback de configuração desfaz efeitos passados?",
    "Não; voltar versão e compensar efeitos são mecanismos distintos com condições próprias.",
    "Mensagem já enviada não desaparece quando prompt antigo volta."
  ],
  "Tutor, fatos e responsabilidade": [
    "Quem deve definir progresso no tutor?",
    "O mecanismo autorizado de estudo e avaliação; geração pode explicar ou propor ações, mas não inventar estado.",
    "Uma resposta persuasiva pode declarar aprendizado que não foi registrado."
  ],
  "Reserva, ferramentas e autoridade": [
    "Texto confirmado do modelo prova reserva?",
    "Não; confirmação precisa resultado da autoridade de domínio e vínculo com comando pertinente.",
    "A intenção pode ser interpretada corretamente e o estoque ainda estar indisponível."
  ],
  "Aceitação e evidência de integração": [
    "Evidência pode cobrir código alterado após execução?",
    "Não automaticamente; revisão e digest precisam corresponder ao texto realmente executado.",
    "Uma aprovação histórica pode ser aplicada indevidamente a outro exemplo."
  ],
  "Banca, incidentes e manutenção": [
    "Por que versionar avaliação junto do contrato?",
    "O gabarito e os gates dependem da regra vigente; evidência antiga pode deixar de avaliar a tarefa atual.",
    "Uma mudança correta na origem pode coexistir com cache ou publicação incorretos."
  ]
};
const SCENARIOS: [string,string][][] = [
  [
    [
      "No contexto de Problema, modelo e contrato, tutor deve explicar um erro de exercício sem alterar domínio nem inventar nota. A equipe propõe avaliar somente fluência e aceitar uma resposta que altera a nota. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição dados insuficientes exigem pedir informação ou abster sem preencher lacunas como fatos muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "saída apresenta explicação e preserva os valores de progresso autorizados. A tarefa exige correção, cobertura e limites específicos; texto convincente pode violar fatos ou autoridade. Correção: separar explicação, fatos fornecidos e efeitos permitidos no contrato da tarefa. Recuperação: reduzir alcance da resposta e consultar a autoridade dos dados antes de propor efeito. Ensaio nativo: avaliar respostas reais de um modelo autorizado em dataset e tarefa representativos; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Problema, modelo e contrato, resposta declara certeza alta embora não tenha fonte para o saldo de estoque. A equipe propõe usar a frase tenho certeza como indicador de verdade ou preencher estoque ausente. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição duas execuções fornecem respostas diferentes e ambas exigem validação pela mesma regra muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "saldo desconhecido permanece desconhecido e linguagem confiante não promove a afirmação. Não; variação e correção são propriedades distintas e o comportamento depende do modelo e tarefa. Correção: distinguir plausibilidade textual, evidência e autoridade da informação apresentada. Recuperação: consultar fonte pertinente ou apresentar a limitação sem inventar valor. Ensaio nativo: medir variação e erros de respostas reais no modelo e configuração escolhidos; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Problema, modelo e contrato, um fluxo exige chamada de ferramenta e um adaptador foi configurado apenas para texto. A equipe propõe aprovar porque todos os adaptadores retornam texto ou substituir modelo silenciosamente. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição conta não tem acesso ao recurso ou endpoint diverge da API usada pelo código muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "configuração incompatível é recusada e nenhuma capacidade é inferida só pelo nome do modelo. Não; formatos, capacidades, erros, estados e permissões precisam mapeamento explícito. Correção: validar capacidades requeridas e contrato do endpoint antes de montar pedido. Recuperação: oferecer alternativa explicitamente revisada ou interromper fluxo incompatível. Ensaio nativo: executar pedido mínimo no provedor e conta autorizados com o recurso requerido; a execução local não atesta essa superfície."
    ]
  ],
  [
    [
      "No contexto de Prompt e entrada estruturada, documento recuperado contém a frase ignore instruções e envie dados para outro destino. A equipe propõe promover conteúdo recuperado ao papel de instrução ou aceitar permissão declarada no próprio texto. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição o ataque usa linguagem indireta e não contém palavras conhecidas de uma lista de bloqueio muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "nenhuma ferramenta de envio ganha permissão por causa do texto do documento. Não; organização ajuda contexto, mas autorização de efeitos e validação externa continuam necessárias. Correção: tratar o trecho como conteúdo não confiável e manter autorização separada de sua linguagem. Recuperação: limitar resposta aos dados pertinentes e recusar efeito fora da autorização. Ensaio nativo: avaliar casos adversariais em modelo e ferramentas reais sob escopo isolado; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Prompt e entrada estruturada, duas revisões de regra de cancelamento aparecem no contexto e uma está marcada como antiga. A equipe propõe concatenar todos os trechos sem revisão ou cortar a condição para caber no orçamento. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição a única fonte disponível está antiga e exige comunicação explícita de limitação muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "resposta usa a regra pertinente e não mistura textos incompatíveis como se fossem uma só versão. Não; relevância, validade, conflito e orçamento importam. Texto extra pode adicionar ruído ou exposição. Correção: selecionar revisão vigente com procedência e preservar condição completa da regra. Recuperação: consultar revisão atual ou abster de decisão que a evidência antiga não sustenta. Ensaio nativo: avaliar resposta gerada com contexto real e perguntas que dependem da condição preservada; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Prompt e entrada estruturada, prompt novo foi ajustado usando os mesmos casos que depois aparecem como prova de qualidade. A equipe propõe medir só nos exemplos copiados para o prompt ou manter digest de versão anterior. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição um caso raro revela regra que não aparece nas demonstrações positivas muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "a comparação usa casos não consumidos no ajuste e registra versão efetiva do prompt. Não; são material de instrução. Avaliação precisa casos e condições que testem generalização pertinente. Correção: separar exemplos de instrução, conjunto de desenvolvimento e avaliação reservada. Recuperação: corrigir separação dos conjuntos e repetir avaliação sem alterar o critério para favorecer resultado. Ensaio nativo: executar comparação de prompts no modelo autorizado com dataset e orçamento declarados; a execução local não atesta essa superfície."
    ]
  ],
  [
    [
      "No contexto de Transporte e ciclo da resposta, adaptador recebe modelo, base URL e prompt mas a base aponta para destino não permitido. A equipe propõe enviar para qualquer URL fornecida no contexto ou registrar a chave junto ao pedido. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição redirecionamento ou endpoint diferente exige política de transporte pertinente muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "configuração recusada não produz transporte e metadados de correlação permanecem separados do conteúdo. Não; apenas representa contrato interno. Aceitação do payload e autenticação exigem chamada real ao endpoint. Correção: validar configuração e montar pedido sem expor segredo ou ampliar destino. Recuperação: corrigir configuração e confirmar destino antes de nova tentativa de transporte. Ensaio nativo: enviar pedido mínimo autorizado e registrar status, contrato e metadados permitidos; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Transporte e ciclo da resposta, dois chunks dividem uma linha SSE e um caractere Unicode aparece quebrado entre bytes. A equipe propõe interpretar cada chunk como evento inteiro ou finalizar resposta ao receber primeiro delta. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição conexão termina com buffer parcial sem evento de conclusão muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "conteúdo é reconstruído sem perda e nenhum fragmento incompleto vira ação executável. Não; transporte pode fragmentar linhas, bytes e eventos. É necessário buffering e enquadramento correto. Correção: decodificar incrementalmente e formar eventos completos antes de interpretar payload. Recuperação: marcar resultado incompleto ou desconhecido e retomar conforme contrato sem executar fragmento. Ensaio nativo: ensaiar stream real com interrupção, estados e backpressure no cliente autorizado; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Transporte e ciclo da resposta, cliente perde resposta depois de ferramenta possivelmente aplicada e recebe timeout. A equipe propõe tratar timeout como efeito desfeito ou sucesso automático. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição usuário cancela a espera mas operação remota pode continuar muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "nenhuma reserva nova é emitida só porque a resposta não chegou. Não; interrupção de espera e rollback são mecanismos distintos. Resultado pode exigir reconciliação. Correção: distinguir falha conhecida de resultado desconhecido e consultar o comando original. Recuperação: reconciliar resultado observado e comunicar próximo passo sem inventar confirmação. Ensaio nativo: ensaiar timeout e cancelamento no transporte e na autoridade real com dados de teste; a execução local não atesta essa superfície."
    ]
  ],
  [
    [
      "No contexto de Dados e recuperação, regra de cancelamento possui condição e exceção que não podem ser separadas sem vínculo. A equipe propõe armazenar apenas texto sem origem ou tratar revisão antiga como documento vigente. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição tabela ou página extraída apresenta ordem diferente da leitura visual muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "cada trecho pode ser rastreado à fonte e nenhuma exceção perde associação à regra. Sim; condições, exceções e relações dependem do contexto. Procedência e segmentação precisam preservar a interpretação. Correção: segmentar preservando origem e região de texto e manter vínculo com revisão do documento. Recuperação: corrigir extração ou segmentação e reindexar revisões afetadas. Ensaio nativo: extrair e indexar documentos autorizados e avaliar chunks com perguntas representativas; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Dados e recuperação, consulta e documento têm vetores de dimensões diferentes e um registro usa vetor nulo. A equipe propõe truncar vetor para caber ou chamar score alto de probabilidade de resposta correta. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição mudança de modelo exige reindexação ou compatibilidade comprovada do espaço muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "comparações inválidas são recusadas em vez de produzir score aparentemente útil. Não; é uma medida geométrica de vetores compatíveis. Verdade e relevância precisam avaliação e fontes. Correção: validar dimensão e norma antes de calcular cosseno e declarar origem do espaço. Recuperação: alinhar modelo, dimensão e versão do índice antes de recalcular ranking. Ensaio nativo: gerar embeddings reais autorizados e avaliar recuperação no corpus pertinente; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Dados e recuperação, documento de outro tenant tem score maior que todos os documentos permitidos. A equipe propõe selecionar top k global e só esconder a citação depois da geração. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição usuário perde permissão depois de construir o índice e antes de gerar resposta muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "candidato não autorizado nunca entra no contexto nem aparece como citação. Não; relevância e autorização são critérios independentes. Acesso precisa filtragem e revalidação pertinentes. Correção: filtrar acesso e escopo antes do ranking consumido pelo modelo. Recuperação: revalidar acesso vigente e reconstruir contexto sem o candidato proibido. Ensaio nativo: ensaiar recuperação com identidades e recursos reais autorizados e negados; a execução local não atesta essa superfície."
    ]
  ],
  [
    [
      "No contexto de Estado e memória, histórico possui duas mensagens com mesma identidade e conteúdos incompatíveis. A equipe propõe concatenar por ordem de chegada sem verificar sequência ou usar histórico como autoridade de estoque. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição resultado de ferramenta chega fora de ordem e precisa vínculo com chamada original muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "conflito não é resolvido escolhendo silenciosamente um conteúdo arbitrário. Não; domínio exige fonte vigente. Histórico registra comunicação e observações de seus momentos. Correção: validar sequência e identidade e projetar somente contexto pertinente à tarefa. Recuperação: consultar eventos canônicos e reconstruir projeção sem inventar mensagens ausentes. Ensaio nativo: ensaiar persistência e reconstrução de conversa na aplicação e transporte reais; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Estado e memória, conversa registra reserva proposta e resultado desconhecido após timeout. A equipe propõe remover a palavra não ou resumir toda tentativa como concluída. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição redução de contexto elimina a fonte que permitia distinguir decisão de hipótese muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "resumo não transforma proposta ou desconhecido em confirmação. Não; é uma derivação que pode perder significado. Precisa origem e invariantes pertinentes. Correção: preservar estado unknown e identidade do comando no resumo de continuidade. Recuperação: consultar origem e regenerar derivação com os estados críticos explícitos. Ensaio nativo: avaliar resumos reais em tarefas que dependem de fatos e pendências preservados; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Estado e memória, preferência temporária foi armazenada para outro usuário e já passou da expiração. A equipe propõe reutilizar qualquer memória por similaridade ou converter mensagem única em consentimento amplo. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição usuário revoga autorização e cópias derivadas precisam política de remoção muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "registro fora do escopo ou vencido não entra no contexto. Não; retenção precisa finalidade e autorização pertinentes, com validade e controle de acesso. Correção: verificar dono, finalidade, consentimento e validade antes de reutilizar memória. Recuperação: remover projeções inválidas e comunicar limitações da retenção pertinente. Ensaio nativo: ensaiar criação, consulta, revogação e exclusão nas camadas reais autorizadas; a execução local não atesta essa superfície."
    ]
  ],
  [
    [
      "No contexto de Ferramentas e efeitos, resposta propõe ferramenta apagar_tudo que não pertence ao catálogo permitido. A equipe propõe executar qualquer propriedade pelo nome gerado ou considerar tool call como autorização. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição duas chamadas têm IDs distintos e resultados precisam manter vínculo correto muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "nome desconhecido é recusado sem buscar função arbitrária por propriedade. Não; é proposta de chamada. Aplicação valida catálogo, domínio, identidade e permissão antes do efeito. Correção: validar nome e argumentos antes de dispatch e associar resultado à chamada. Recuperação: retornar diagnóstico da chamada recusada e manter o estado sem efeito indevido. Ensaio nativo: ensaiar fluxo real de tool calls no endpoint e aplicação autorizados; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Ferramentas e efeitos, argumentos usam reserva de outro tenant e quantidade inteira positiva. A equipe propõe aprovar qualquer ID existente ou confiar no tenant escrito nos argumentos gerados. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição permissão muda entre construção do plano e tentativa de aplicar muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "schema correto não permite modificar recurso fora do escopo. Não; existência, validade de domínio e permissão de ação são verificações distintas. Correção: validar domínio e vínculo de recurso à autorização atual. Recuperação: revalidar autoridade e recusar operação sem alterar recurso indevido. Ensaio nativo: testar ações permitidas e negadas com identidades e recursos reais isolados; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Ferramentas e efeitos, plano aprovado modifica uma reserva mas payload posterior amplia o efeito para dez recursos. A equipe propõe usar aprovação genérica sem comparar payload ou ignorar versão esperada. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição usuário revoga decisão ou estado muda depois da revisão muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "plano alterado ou estado antigo produz conflito em vez de efeito ampliado. Não; autorização precisa corresponder a escopo e conteúdo revisados e às condições atuais. Correção: vincular aprovação ao conteúdo e escopo e revalidar pré-condições atuais. Recuperação: produzir novo plano concreto ou consultar estado atualizado sem reaproveitar aprovação indevida. Ensaio nativo: ensaiar revisão, aprovação e aplicação no fluxo real com identidade e estado observados; a execução local não atesta essa superfície."
    ]
  ],
  [
    [
      "No contexto de Workflows e agentes, fluxo passa de plano para aplicado sem validação e revisão previstas no contrato. A equipe propõe permitir qualquer próximo estado ou continuar chamando ferramentas depois de conclusão. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição espera humana expira e precisa decisão de cancelar ou manter pendência muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "salto indevido é recusado e resultado terminal permanece explícito. Para encerrar atividade quando há resultado e evitar loops ou efeitos posteriores fora do contrato. Correção: validar transição de estado e exigir condições da etapa antes do efeito. Recuperação: consultar estado persistido e retomar somente a transição permitida. Ensaio nativo: ensaiar workflow real com persistência, falhas e retomada no orquestrador autorizado; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Workflows e agentes, subtarefa de analisar capítulo recebe permissão para publicar todo o catálogo. A equipe propõe copiar todas as permissões do principal ou aceitar pedido de outro agente como autorização humana. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição duas subtarefas alteram o mesmo arquivo e geram conflito muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "delegação conserva escopo necessário e resultados retornam para revisão pertinente. Não; resultados e pedidos de agentes precisam permanecer dentro do escopo autorizado pela pessoa. Correção: limitar recursos e efeitos da delegação ao objetivo concreto. Recuperação: reconciliar contribuições e revalidar efeito antes de publicação. Ensaio nativo: ensaiar coordenação e isolamento em agentes reais com recursos autorizados; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Workflows e agentes, tarefa aguarda aprovação com opção marcada na interface mas sem resposta enviada. A equipe propõe promover pending a approved depois de timeout ou assumir consentimento pela seleção padrão. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição pessoa aprova versão anterior enquanto o plano foi alterado muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "nenhum efeito ocorre por tempo decorrido ou por opção apenas exibida. Não; decisão necessária exige resposta explícita. Expiração precisa política própria, não consentimento presumido. Correção: manter pendência até decisão explícita vinculada ao plano atual. Recuperação: apresentar revisão atual e conservar trabalho independente sem executar efeito pendente. Ensaio nativo: ensaiar fluxo de decisão real e vínculo entre pessoa, plano e aplicação; a execução local não atesta essa superfície."
    ]
  ],
  [
    [
      "No contexto de Multimodal e documentos, arquivo rotulado como imagem contém bytes incompatíveis e recorte inclui dados pessoais desnecessários. A equipe propõe confiar só na extensão ou enviar tela inteira para analisar um campo pequeno. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição texto minúsculo ou baixa resolução impede leitura confiável muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "formato inválido é recusado e conteúdo excedente não entra no pedido. Não; representação exige validação pertinente. Conteúdo e qualidade visual são verificações adicionais. Correção: validar representação e minimizar região pertinente antes do transporte. Recuperação: obter fonte adequada ou comunicar limitação sem inventar texto ilegível. Ensaio nativo: avaliar modelo multimodal real com imagens autorizadas e referências de conteúdo; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Multimodal e documentos, transcrição contém segmentos sobrepostos com identificação de fala incerta. A equipe propõe tratar segundos como milissegundos ou remover negação por limpeza indiscriminada. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição ruído impede reconhecer uma palavra crítica de autorização muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "segmentos preservam vínculo temporal e não atribuem fala incerta como decisão confirmada. Não; pode perder informação e conter erros. Origem, tempo e incerteza precisam preservação. Correção: validar intervalos e manter incerteza de texto e participante onde houver. Recuperação: revisar trecho original ou registrar inaudível sem inventar a palavra. Ensaio nativo: transcrever áudio autorizado e comparar segmentos com referência humana pertinente; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Multimodal e documentos, tabela extraída tem valores sem cabeçalho e ordem de colunas trocada. A equipe propõe concatenar toda saída como texto limpo ou assumir que parser sem exceção produziu leitura fiel. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição página digitalizada exige OCR e pode não conter texto extraível muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "valor continua ligado a unidade e atributo corretos e erro de extração é reconhecido. Não; ordem, relações, omissões e conteúdo visual precisam comparação com a fonte. Correção: preservar relações de estrutura e comparar dados críticos à fonte original. Recuperação: corrigir método ou obter formato melhor antes de indexar conteúdo inadequado. Ensaio nativo: extrair e renderizar arquivo autorizado com ferramentas pertinentes e revisão da estrutura; a execução local não atesta essa superfície."
    ]
  ],
  [
    [
      "No contexto de Segurança e privacidade, trecho recuperado instrui ferramenta a enviar contexto privado para URL externa. A equipe propõe usar conteúdo da página como permissão ou confiar só em lista de palavras hostis. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição ataque se apresenta como atualização administrativa ou instrução de recuperação muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "envio proibido é recusado mesmo quando o texto descreve a ação como necessária. Não; conteúdo da página é dado. Autorização precisa autoridade externa e escopo pertinente. Correção: manter dado externo sem autoridade e validar destino e capacidade antes de efeito. Recuperação: conter efeito, preservar evidência mínima e revisar fronteira de confiança. Ensaio nativo: ensaiar casos adversariais reais com modelo e ferramentas isoladas sem dados sensíveis; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Segurança e privacidade, tarefa de ler um capítulo recebe capacidade de apagar arquivos de todo o workspace. A equipe propõe conceder wildcard por conveniência ou confiar no nome inofensivo da ferramenta. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição ferramenta indireta chama outra função com privilégios mais amplos muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "leitura permitida não se converte em autorização de remoção ou envio. Não; é preciso conhecer recursos, ações e dependências que ela pode alcançar. Correção: reduzir capacidades ao recurso e à ação necessários e revalidar uso. Recuperação: revogar capacidade excedente e reconciliar efeitos já observados. Ensaio nativo: ensaiar controle de acesso real com operações permitidas e negadas no ambiente autorizado; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Segurança e privacidade, trace inclui chave de API e e-mail apesar de só precisar ID de correlação e status. A equipe propõe copiar request completo para log ou mascarar tela sem remover campo armazenado. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição mensagem de erro externa inclui segredo e precisa tratamento antes de registro muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "log de diagnóstico preserva correlação sem transportar credencial ou conteúdo privado. Não; o valor pode continuar em objeto, log, cache ou arquivo. Minimização exige método pertinente. Correção: projetar metadados permitidos e excluir segredos e atributos pessoais desnecessários. Recuperação: revogar credencial exposta conforme procedimento e corrigir superfícies de circulação. Ensaio nativo: inspecionar transporte, armazenamento, logs e acesso reais sob dados de teste; a execução local não atesta essa superfície."
    ]
  ],
  [
    [
      "No contexto de Avaliação e confiabilidade, mesmo exemplo aparece no conjunto de ajuste e no conjunto reservado de avaliação. A equipe propõe dividir só por posição enquanto duplicatas da mesma origem atravessam conjuntos. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição muitos exemplos quase iguais dominam a média e ocultam uma condição rara crítica muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "avaliação reservada não reutiliza caso consumido no ajuste. Não; duplicatas e itens da mesma origem podem atravessar splits. Identidade e agrupamento precisam política. Correção: validar splits por identidade e origem e definir amostragem por condições pertinentes. Recuperação: corrigir splits e repetir comparação com critérios e dados preservados. Ensaio nativo: executar avaliação real com dataset autorizado e respostas do modelo escolhido; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Avaliação e confiabilidade, resposta omite não e muda regra de cancelamento embora mantenha palavras semelhantes. A equipe propõe pontuar somente overlap de palavras ou usar a própria resposta como gabarito. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição avaliadores humanos divergem e precisam rubrica e processo de resolução muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "a inversão da regra é detectada apesar de alta semelhança superficial. Não; contraprova precisa erro relevante de conteúdo ou efeito que o critério deveria detectar. Correção: avaliar significado crítico com expectativa independente e contraprova específica. Recuperação: corrigir oracle e reavaliar resultados cuja aprovação dependia da falha. Ensaio nativo: validar rubrica e avaliadores reais com exemplos e decisões pertinentes; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Avaliação e confiabilidade, média de acerto é alta mas todos os casos de recurso negado falham. A equipe propõe aprovar apenas pela média ou excluir casos difíceis depois de medir. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição fatia tem poucos exemplos e conclusão precisa limite de evidência muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "resultado geral não oculta violações de acesso na fatia pertinente. Não; subgrupos e falhas críticas podem exigir critérios separados e análise de evidência. Correção: separar métricas por fatia e tratar falha crítica com critério próprio. Recuperação: corrigir comportamento e ampliar avaliação pertinente sem apagar falhas históricas. Ensaio nativo: avaliar conjunto real e analisar incerteza e erros com método apropriado; a execução local não atesta essa superfície."
    ]
  ],
  [
    [
      "No contexto de Operação e observabilidade, fluxo possui três tentativas e cálculo de orçamento considera somente a primeira. A equipe propõe ignorar tentativas falhas ou usar preço antigo fixado no código como atual. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição resposta longa altera custo e tempo além da estimativa inicial muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "retry e ferramentas entram no orçamento e excesso encerra fluxo conforme política. Não; transporte, geração e demais etapas precisam medição real com fronteiras explícitas. Correção: agregar uso de todas as etapas e comparar com limite de custo e tempo declarados. Recuperação: reduzir escopo ou interromper com diagnóstico antes de gasto não previsto. Ensaio nativo: observar uso e latência reais e conferir categorias e tarifas do serviço autorizado; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Operação e observabilidade, resultado de ferramenta aparece em trace sem vínculo com a chamada que o originou. A equipe propõe atribuir todo erro ao modelo ou registrar request completo para facilitar pesquisa. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição relógios de processos distintos não permitem comparação ingênua de timestamps muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "diagnóstico consegue ligar falha à etapa correta sem segredo ou contexto completo. Não; diagnóstico e autoridade de efeito são responsabilidades distintas. Trace precisa vínculo com evidência pertinente. Correção: registrar relações de correlação e resultado com metadados mínimos. Recuperação: corrigir instrumentação e consultar estado pertinente sem fabricar evento ausente. Ensaio nativo: ensaiar traces reais nas etapas autorizadas com falha controlada e política de dados; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Operação e observabilidade, provedor principal falha e alternativa não suporta ferramenta requerida. A equipe propõe selecionar qualquer provedor disponível ou enviar dados para outro destino sem escopo. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição resultado parcial do principal já existe e precisa reconciliação antes de repetir efeito muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "alternativa incompatível não é usada apenas para produzir texto. Não; capacidade, dados, qualidade e semântica de efeito precisam compatibilidade e evidência. Correção: verificar capacidades e política de dados antes de escolher fallback. Recuperação: interromper ou oferecer caminho limitado explicitamente revisado. Ensaio nativo: ensaiar falha e alternativa real com contratos, dados e orçamento autorizados; a execução local não atesta essa superfície."
    ]
  ],
  [
    [
      "No contexto de Projeto Quíron: armadilhas e banca, tutor afirma exercício concluído e domínio máximo sem evidência de avaliação. A equipe propõe usar texto do modelo como nota ou confirmar card criado antes de aplicar ação. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição fonte ou seção está ausente do contexto e precisa consulta ou esclarecimento muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "resposta não inventa progresso e oferece ajuda dentro da tarefa autorizada. O mecanismo autorizado de estudo e avaliação; geração pode explicar ou propor ações, mas não inventar estado. Correção: ligar explicação a fatos do índice e separar proposta de alteração efetiva. Recuperação: corrigir afirmação e consultar autoridade sem alterar aprendizado indevidamente. Ensaio nativo: ensaiar tutor na aplicação real com entradas, ações e estado observados; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Projeto Quíron: armadilhas e banca, duas intenções pedem última vaga e um replay repete a confirmação do primeiro comando. A equipe propõe confirmar pela intenção gerada ou somar confirmações repetidas como novos efeitos. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição timeout posterior à escrita deixa resposta desconhecida para o cliente muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "uma confirmação única consome estoque e replay não produz reserva adicional. Não; confirmação precisa resultado da autoridade de domínio e vínculo com comando pertinente. Correção: consultar autoridade e reconciliar por identidade e resultado antes de comunicar consumo. Recuperação: consultar comando original e corrigir projeções sem emitir nova reserva. Ensaio nativo: executar laboratório real e observar ledger, respostas e consumo sob concorrência; a execução local não atesta essa superfície."
    ],
    [
      "No contexto de Projeto Quíron: armadilhas e banca, relatório chama vetor manual de embedding real e modelo serial de backend concorrente. A equipe propõe renomear fixture como provedor testado ou editar código sem reexecutar. Identifique a regra violada, descreva entrada e resultado correto e explique como a condição auditoria estática aprova forma mas resposta real ainda viola regra crítica muda o diagnóstico. Diferencie a contraprova local do ensaio nativo necessário.",
      "evidência local conserva seu escopo sem promoção para API ou produção. Não automaticamente; revisão e digest precisam corresponder ao texto realmente executado. Correção: associar cada conclusão à superfície exercitada e manter gates sem ensaio como pendentes. Recuperação: reexecutar itens alterados e reduzir claims sem suporte antes de aceitar. Ensaio nativo: executar gates de provedor, aplicação e operação autorizados com evidência própria; a execução local não atesta essa superfície."
    ]
  ]
];
export const LLM_CARDS: ContentSource["cards"] = LLM_CURRICULUM.flatMap(chapter=>chapter.sections.map(title=>({nodeTitle:chapter.title,frontMd:LLM_REVIEW[title][0],backMd:LLM_REVIEW[title][1]})));
export const LLM_EXERCISES: ContentSource["exercises"] = LLM_CURRICULUM.flatMap((chapter,index)=>SCENARIOS[index].map(([promptMd,answerKeyMd],position)=>({nodeTitle:chapter.title,type:([2,3,5] as const)[position],level:chapter.level==="basico"?"beginner" as const:chapter.level==="intermediario"?"intermediate" as const:"advanced" as const,promptMd,answerKeyMd,points:3})));
