# Oracle Cloud — Custos, quotas e operação — rascunho não materializado

## Billing, budgets e forecasts

Billing traduz recursos e uso em custo, mas atraso de consolidação, tags ausentes e consumo compartilhado podem esconder risco. A baseline mapeia serviço, compartment, environment, owner, cost-center, unidade, budget, forecast e ação para cada classe de workload. A mutação cria loop de previews e consome quota mensal em horas; alertas de taxa e guardrails precisam atuar antes da fatura. Orçamento financeiro não é limite técnico e não substitui capacidade ou segurança.

### Atribuição e inventário

Tags controladas, compartments e relatórios permitem atribuir compute, storage, egress, database, LB e logs. A baseline separa gasto conhecido, compartilhado e unknown, sem inventar rateio silencioso. A mutação remove cost-center de recurso e reconciliation abre finding. Owner recebe alerta e plano de correção. Billing export tem acesso/retention controlados. Recursos órfãos, backups e IPs entram no inventário. Previews têm lifecycle/TTL. Dados de custo não carregam secrets/PII.

### Forecast e anomalia

Forecast usa baseline, tendência, releases, picos, DR e cenário de falha, com assumptions/version. A baseline compara observado e previsto por janela/serviço. A mutação ignora campanha ou cache-bust e capacity review detecta. Anomaly usa taxa e sazonalidade, não só total mensal. Alertas graduais têm owner/routing/teste. Billing delay é declarado. Economia estimada é separada de realizada. Mudança de preço/shape invalida modelo. Unknown spend é risco explícito.

### Budgets e guardrails

Budget tem thresholds, ações e overrides expirados. A baseline pode bloquear novos previews, transforms abusivos ou jobs não críticos sem desligar produção arbitrariamente. A mutação dispara alerta só em 100% e policy falha. Guardrails incluem TTL, size, retry, cache cardinality, max nodes e egress. Exceção tem motivo/owner/duração. Ação automática preserva evidence e permite rollback. Budget não libera serviço de atender SLO. Notification receipt confirma entrega.

### Evidência e aceite

A banca testa tag ausente, preview storm, cache bust, billing atrasado e alerta sem owner. Aceite exige atribuição, forecast versionado, alerta antecipado, guardrail e cleanup seguro. Dados locais provam cálculo; OCI Billing real prova consumo. Sem tenancy, claims ficam Pending. Evidence bundle contém inventory, export redigido, forecast, budgets, receipts, timeline e cleanup.

### Fechamento financeiro e decisões

No fechamento, a equipe reconcilia invoice, export de uso, contadores independentes e inventário de recursos pelo mesmo período. Créditos, impostos, arredondamentos e compromissos ficam em linhas distintas para não serem interpretados como mudança de consumo técnico. A baseline verifica se owner recebeu alerta, se uma ação de contenção foi executada e se ela preservou SLO, dados e capacidade de recuperação. A mutação declara economia apenas diminuindo a janela de retenção abaixo do requisito; revisão de compliance e restore impedem. Recursos de DR, backups e monitors podem parecer ociosos, mas são comparados ao risco que cobrem. Forecast novo não apaga previsão antiga: explica diferença, atualização de premissa e aprendizado para planejamento posterior.

O relatório traz também custo incremental de uma transação, upload, chamada de Function e byte de egress sob carga controlada. Essa medida não serve para cobrar o usuário diretamente sem decisão de produto, mas revela onde uma alteração de arquitetura aumenta despesa de modo não linear. Quando uma integração terceirizada adiciona tarifa, a baseline registra seu owner, limite e caminho de desligamento. Durante incidente, orçamento de contenção é separado da operação normal para impedir que uma conta aparentemente estável esconda o custo da recuperação.

### Decisão operacional de Billing, budgets e forecasts

A decisão sobre Billing, budgets e forecasts começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Billing, budgets e forecasts precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Billing, budgets e forecasts combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Quotas, limits e capacity planning

Quotas organizam consumo por compartment; service limits e capacidade regional limitam o que pode existir. Ambos definem se autoscaling, DR e incident response funcionarão no pior momento. A baseline inventaria limite, uso, headroom, região, owner, lead time, alert e fallback. A mutação tenta criar réplicas durante falha e recebe capacity error; game day revela risco. Documentação não substitui limite observado na tenancy.

### Headroom e reservas

Headroom é calculado para picos, maintenance, failover, restore e rollout, não média diária. A baseline mede shape, IPs, volumes, nodes, connections, throughput e quotas dependentes. A mutação reserva compute mas esquece IP/subnet e scale falha. Recursos de DR são testados e monitorados. Pedido de aumento tem aprovação/lead time. Capacity regional pode variar. Fallback não viola residência ou custo sem decisão. Dashboard atrasado gera margem adicional.

### Escala segura

Autoscaling tem min/max, trigger, cooldown, dependency budget e circuit. A baseline impede que queue/CPU causem expansão que derruba database ou fatura. A mutação amplia Functions sem pool e saturation aparece; controller alerta. Scale-in respeita drain/effects. Preview usa limites menores. Quota hit tem erro observável e retry bounded. Override expira. SLO e custo são observados juntos. Capacity plan é revisado por release relevante.

### Evidência e aceite

A banca testa limite baixo, IP exaurido, região sem shape, burst e recovery sem headroom. Aceite exige limites inventariados, capacidade verificável, escala bounded e fallback seguro. Simulação prova modelo; OCI real prova quota/capacity. Sem sandbox, claims ficam Pending. Evidence bundle contém limits, usage, forecasts, drills, alerts, decisions e cleanup.

### Capacidade como contrato de release

Todo release que muda cardinalidade, tamanho de payload, throughput, imagem ou integração reavalia seus limites dependentes. A baseline não aceita canary verde se a expansão total ainda falharia por IP, connection pool, storage, pods ou quota de API. A mutação dobra réplicas e obtém sucesso apenas porque o ambiente de teste tem tráfego baixo; o capacity plan usa cenário de pico e failover. Quando não existe capacidade reservada, o plano registra ordem de degradação, comunicação e o serviço que fica indisponível primeiro. Essa honestidade permite decidir produto e orçamento antes de um incidente, em vez de descobrir a limitação durante recuperação.

O plano declara ainda quais recursos compartilham limite de tenancy ou região, para que um teste de um time não consuma a margem necessária a outro. Mudança de quota é tratada como alteração de segurança e custo: registra quem pediu, por quê, valor anterior, valor novo e condição de redução posterior. Alarmes observam tendência, não apenas valor absoluto, porque uma subida rápida dentro de uma margem ainda pode consumir toda capacidade antes de a equipe agir.

### Decisão operacional de Quotas, limits e capacity planning

A decisão sobre Quotas, limits e capacity planning começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Quotas, limits e capacity planning precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Quotas, limits e capacity planning combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
+

### Métrica e limite para Quotas, limits e capacity planning

Esta etapa define um indicador operacional, um limiar de ação e a evidência que demonstra recuperação. A medição é correlacionada ao owner, ao compartment e ao release, evitando tratar custo, capacidade ou operação como número isolado. Um teste usa dado sintético fora do limite e confirma que o alerta chega ao responsável sem expor segredo. Ajustes de limite exigem revisão, justificativa e data de reavaliação; silêncio de dashboard não é evidência de saúde.


## Disaster recovery e game days

DR combina dados, compute, rede, identidade, DNS, providers e pessoas; backup isolado não garante recuperação. A baseline define cenários, topology, RPO/RTO, owner, comunicação, data class, failover/failback e evidence. A mutação derruba região e restaura app sem outbox/keys, deixando efeitos inconsistentes; banca deve falhar. Game day prova procedimentos sob condições controladas, não disponibilidade comercial.

### Cenários e topologia

Cada cenário cobre region loss, database corruption, identity compromise, network failure, artifact loss e provider outage. A baseline identifica source of truth, replica, backup, dependencies e boundary de dados. A mutação chama active-active sem fencing e duas regiões escrevem; observer acusa. RPO/RTO têm premissas. Diagramas são reconciliados. DR resources têm tags/budgets. Change de topology reinicia drill. Custo de standby é decisão de produto.

### Drill e recovery

Drill cria ambiente isolado, injeta falha, executa runbook, mede detection/restore/validation e preserva logs. A baseline restaura dados, grants, secrets, routes e jobs antes de tráfego. A mutação restaura bytes sem permissões e application journey falha. Failover/failback têm fencing e reconciliation. Dados sintéticos protegem clientes. Abort threshold impede dano. Comunicação registra fatos. Cleanup só após approval/hold. Ação atrasada vira finding.

### Evidência e aceite

A banca testa região, corrupção, key vazada, DNS, provider e dupla entrega. Aceite exige RPO/RTO medidos, dados/effects reconciliados, acesso seguro e ações verificadas. Tabletop prova decisão; OCI/data/provider sandbox prova operação. Sem sandbox, claims ficam Pending. Evidence bundle contém scenario, topology, timeline, receipts, observer, postmortem e cleanup.

### Comunicação e aprovação de retorno

Antes de encerrar o drill ou incidente, o comandante confirma quem autorizou retorno de tráfego, quais sinais foram observados e por quanto tempo. A baseline compara estado recuperado com estado desejado de rede, identidade, dados, artefato, backlog e custos. A mutação restaura a aplicação mas deixa DNS apontando para origem antiga; probe externo impede aceite. Comunicação para usuários e liderança declara impacto, período e medidas confirmadas sem divulgar detalhes de ataque. Ações que dependem de fornecedor ficam abertas com owner e prazo. A repetição do game day verifica essas ações, pois disaster recovery real inclui impedir a mesma falha de regressar.

O cenário testa inclusive perda de equipe ou de credencial de operador: outro membro deve conseguir localizar runbook, estado, backups e approvals sem depender de memória individual. Isso transforma documentação em parte mensurável do RTO. Se o retorno exigir aceitar risco residual, a decisão descreve o limite, a mitigação temporária e o evento que obrigará nova avaliação; risco não é escondido em um comentário de encerramento.

### Decisão operacional de Disaster recovery e game days

A decisão sobre Disaster recovery e game days começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Disaster recovery e game days precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Disaster recovery e game days combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
+

### Métrica e limite para Disaster recovery e game days

Esta etapa define um indicador operacional, um limiar de ação e a evidência que demonstra recuperação. A medição é correlacionada ao owner, ao compartment e ao release, evitando tratar custo, capacidade ou operação como número isolado. Um teste usa dado sintético fora do limite e confirma que o alerta chega ao responsável sem expor segredo. Ajustes de limite exigem revisão, justificativa e data de reavaliação; silêncio de dashboard não é evidência de saúde.


## Runbooks, support e operação diária

Operação diária mantém inventário, patch, alertas, acessos, backups, custos e mudanças antes do incidente. Runbook acionável identifica sinal, impacto, passos seguros, ownership, escalonamento, evidência e condição de encerramento. A baseline versiona runbooks e exerce ações críticas. A mutação aponta para comando destrutivo sem precheck e review bloqueia. Suporte não deve receber segredo ou privilégio permanente para compensar documentação fraca.

### Catálogo e ownership

Serviço possui owner técnico/negócio, dependências, SLO, runbook, dashboards, acesso e RTO/RPO. A baseline detecta recurso sem catálogo e ação sem backup de owner. A mutação transfere time e alertas continuam para ex-funcionário; recertificação acusa. On-call tem acesso mínimo e caminho de break-glass. Documentação separa fato operacional de referência. Links são testados. Mudança atualiza catálogo. Support vendor tem escopo/TTL/audit.

### Execução e melhoria

Runbook usa precheck, command versionado, observer, rollback e cleanup. A baseline roda game day e mede time to acknowledge/mitigate. A mutação fecha incidente por status verde sem reconciliation e checklist falha. Postmortem cria ações verificáveis. Repetição reduz trabalho manual sem eliminar review. Logs são redigidos. Métrica mede drift, alert quality, backup drill, exceptions e costs. Documentação expirada é finding. Treinamento usa sandbox.

### Evidência e aceite

A banca testa owner ausente, runbook quebrado, acesso excessivo, alert não roteado e incidente sem cleanup. Aceite exige operação rastreável, ações seguras, escalonamento, evidence e melhoria. Arquivos locais provam processo; OCI/support reais provam acesso e alertas. Sem sandbox, claims ficam Pending. Evidence bundle contém catálogo, runbooks, drills, access review, alerts, postmortem e cleanup.

### Qualidade operacional contínua

Runbook é revisado quando alertas, versões de ferramenta, dependências ou owners mudam. A baseline mede links quebrados, comandos sem precheck, permissões não usadas, alertas sem acknowledgement e tarefas manuais recorrentes. A mutação remove um passo de validação para reduzir tempo e game day encontra efeito não reconciliado. Treinamento reproduz a jornada em sandbox com dados sintéticos, incluindo falha e rollback, para que conhecimento não fique concentrado em uma pessoa. Evidência de exercício é curta, redigida e vinculada ao catálogo. Automação só substitui passo manual depois de mostrar que sua identidade, limites, logs e modo de falha foram revisados.

O catálogo distingue operação rotineira de mudança de emergência e de incidente, evitando que uma permissão concedida para um caso seja mantida no outro. Revisões de acesso confirmam que quem está de plantão consegue executar ações previstas, mas não possui administração irrestrita da tenancy. Métricas de operação são usadas para priorizar correções estruturais, como reduzir alertas ruidosos ou automatizar reconciliação segura, e não para punir quem reporta falhas cedo.

### Decisão operacional de Runbooks, support e operação diária

A decisão sobre Runbooks, support e operação diária começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Runbooks, support e operação diária precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Runbooks, support e operação diária combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
+

### Métrica e limite para Runbooks, support e operação diária

Esta etapa define um indicador operacional, um limiar de ação e a evidência que demonstra recuperação. A medição é correlacionada ao owner, ao compartment e ao release, evitando tratar custo, capacidade ou operação como número isolado. Um teste usa dado sintético fora do limite e confirma que o alerta chega ao responsável sem expor segredo. Ajustes de limite exigem revisão, justificativa e data de reavaliação; silêncio de dashboard não é evidência de saúde.

