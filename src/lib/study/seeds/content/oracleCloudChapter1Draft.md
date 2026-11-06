# Oracle Cloud — Tenancy, regiões e governança — rascunho não materializado

## Tenancy, compartments e ownership

Uma tenancy Oracle Cloud é a fronteira administrativa raiz: nela vivem identidade, billing, limites, recursos, audit e políticas. Compartments não são apenas pastas; eles delimitam autorização, ownership, custo, lifecycle e blast radius. A baseline começa por um mapa de tenancy, compartments, serviços permitidos, owners humanos e técnicos, criticidade, dados classificados e fonte de verdade. Nome amigável não substitui OCID, que identifica o recurso de forma imutável. A mutação cria workload crítico em compartment pessoal e o inventário deve sinalizar ausência de backup de owner, policy e budget.

### Hierarquia e escopo

Compartment pode conter subcompartments e políticas herdadas, mas cada nível precisa de propósito e regras claras. A baseline separa produção, não-produção, segurança compartilhada, rede e experimentação de acordo com risco, não por preferência de time. A mutação concede acesso na raiz para resolver falha local; policy review bloqueia porque o blast radius cresce. Recursos que atravessam compartments, como rede ou observabilidade, têm relações documentadas. Move de recurso não é correção trivial: pode alterar IAM, billing, logs e dependências. Toda exceção tem owner, prazo e reconciliação.

### Ownership e inventário

Todo recurso possui owner operacional, owner de negócio, classificação, ambiente, custo e data de revisão. A baseline usa tags controladas e reconcilia inventário com APIs quando autorizadas. A mutação remove tag de uma instance e o finding permanece aberto até correção, não apenas até o dashboard parar de alertar. Owner não é e-mail informal: deve sobreviver a mudança de equipe. Recursos sem owner recebem processo de quarentena/remoção seguro. Artefatos, backups, domínios, chaves e integrações entram no inventário, pois são dependências de recuperação.

### Fronteiras de dados

Compartment não torna dados privados automaticamente. A baseline mapeia classificação a database, bucket, log, backup, região e consumidor permitido. A mutação coloca export com PII em Object Storage compartilhado e policy de bucket/IAM precisa negar o acesso cruzado. Metadados, nomes de objetos e tags também podem ser sensíveis. Retenção, delete, legal hold e restore são definidos antes do armazenamento. Preview usa dados sintéticos ou minimizados. Auditoria registra acesso sem copiar corpos ou secrets para novos destinos.

### Lifecycle de recursos

Criação, mudança, suspensão, delete e restore possuem responsável, approval e evidence. A baseline distingue recurso efêmero de produção e não usa TTL como substituto de inventário. A mutação deixa load balancer e IP público depois de projeto encerrado; janitor sinaliza custo/superfície. Delete de volume ou bucket exige checar dependências, backup e retention. Recurso abandonado pode conter credencial ou dados. Tags de expiracão ajudam automação, mas job de cleanup tem dry-run, allowlist e logs de decisão.

### Política e delegação

Governance estabelece quem pode criar compartment, conceder policy, mover recurso e alterar billing. A baseline aplica menor privilégio e separa administração de uso cotidiano. A mutação entrega permissão de manage all-resources a pipeline que só precisa publicar artifact; matrix de capabilities reprova. Policies são versionadas em IaC ou exportadas e revisadas. Dynamic groups e service identities têm mesma exigência de owner/expiry. Ação break-glass tem justificativa, sessão auditada e remoção confirmada.

### Observabilidade e auditoria

Inventário, Audit, budgets e Cloud Guard complementam-se: um registra ação, outro detecta postura, outro atribui custo. A baseline correlaciona OCID, compartment, principal e change request. A mutação cria recurso por console fora de IaC e drift report produz evidence acionável. Ausência de evento é Unknown, não prova de que nada ocorreu. Retenção e acesso aos logs seguem classificação. Consultas operacionais usam identificadores e janelas, não busca indiscriminada por valores. Export de incidente preserva digest e cadeia de custódia.

### Evidência e aceite

A banca cria mapa desejado, injeta resource sem tags, owner órfão, policy raiz, bucket cruzado e delete prematuro em sandbox. Aceite exige compartment correto, ownership rastreável, acesso mínimo, dados classificados, lifecycle seguro e findings com owner. Arquivos locais provam manifest e regras; APIs e audit reais provam enforcement. Sem tenancy autorizada, permissões, billing e ações remotas ficam Pending. Evidence bundle contém hierarchy, OCIDs redigidos, policy snapshot, tag report, audit queries, cleanup plan e resultados negativos.

### Decisão operacional de Tenancy, compartments e ownership

A decisão sobre Tenancy, compartments e ownership começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Tenancy, compartments e ownership precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Tenancy, compartments e ownership combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Regiões, availability domains e fault domains

Região, availability domain e fault domain definem latência, residência, capacidade e modo de falha. Espalhar recursos sem protocolo pode aumentar custo e inconsistência; manter tudo junto pode concentrar risco. A baseline declara região primária, regiões permitidas, requisito legal, placement de dados, dependências e objetivo de recuperação. A mutação move compute para região próxima do usuário sem mover database e p95 piora; decisão precisa jornada inteira, não ping isolado. Disponibilidade anunciada não é evidência de failover realizado.

### Região e residência

Região é escolha de processamento, armazenamento, backup, observabilidade e suporte, não somente de VM. A baseline associa classes de dados às regiões permitidas e impede deploy fora da lista. A mutação envia trace ou backup para região proibida e policy/report falha. Geolocalização de cliente não decide base legal. Provedores externos e egress entram no mapa. Mudança regional exige approval, migration, testes e plano de retorno. Dados derivados herdam classificação quando permitem reidentificação.

### Availability domains

Availability domains isolam parte de infraestrutura dentro de uma região, mas não substituem backup, replicação ou software tolerante a falhas. A baseline posiciona components conforme capacidade e requisito: database/compute/load balancer podem ter escolhas distintas. A mutação supõe que duas instâncias no mesmo domínio formam HA e failure simulation acusa. Domínio indisponível é cenário, não apenas campo de configuração. Quotas e shapes variam; capacity é conferida antes da promoção. Identidade e configuration precisam acompanhar replacement.

### Fault domains

Fault domains reduzem impacto de falha de hardware, energia ou manutenção dentro de um availability domain. A baseline distribui instâncias independentes e registra anti-affinity. A mutação coloca réplicas em fault domain idêntico e placement gate falha. Serviço gerenciado pode abstrair placement, mas suas garantias são confirmadas na documentação e na arquitetura, não inventadas. Autoheal precisa substituir instance mantendo tags, NSGs, volumes e observabilidade. Carga stateful exige replication/backup além da distribuição física.

### Latência e dados

Jornada mede cliente, edge, load balancer, compute, database, object storage e provider. A baseline usa traces e synthetic de regiões autorizadas com payload seguro. A mutação aproxima API do usuário mas mantém writer distante e transaction deadline estoura. Read replica pode reduzir leitura, porém read-after-write crítico consulta fonte apropriada. Cache possui freshness e invalidação. Egress inter-regional tem custo e compliance. Latência média não esconde cauda, cold start ou congestionamento.

### Failover e fencing

Failover precisa de trigger, health, target, authority e fencing para impedir writer antigo de continuar. A baseline declara active-passive ou active-active conforme protocolo e executa drill. A mutação gera partition e duas regiões escrevem; observer da última vaga falha. DNS, connection pools, queues e secrets participam da transição. RTO/RPO são medidos e guardam premissas. Failback reconcilia dados e não ocorre automaticamente só porque a região voltou. Ação manual possui audit e expiry.

### Capacity e quotas

Capacidade de shape, service limit e quota pode impedir recuperação no pior momento. A baseline reserva ou valida headroom por região e testa placement de candidate. A mutação tenta criar réplicas somente durante incidente e recebe capacity error; game day reporta risco. Autoscaling não cria capacidade física infinita. Previsão considera picos, rebuild, backups e egress. Pedido de aumento de limite tem owner e lead time. Recursos de DR são monitorados para não expirar silenciosamente.

### Evidência e aceite

A banca testa placement errado, região proibida, database distante, domínio/fault domain indisponível, partition, failover e capacidade exaurida. Aceite exige topologia declarada, residência respeitada, journey dentro do SLO, um writer e RTO/RPO medidos. Simuladores locais validam decisões; tenancy e dependências reais validam placement e failover. Sem sandbox, esses claims permanecem Pending. Evidence bundle contém topology, manifests, traces redigidos, drill timeline, capacity report, observer e cleanup.

### Decisão operacional de Regiões, availability domains e fault domains

A decisão sobre Regiões, availability domains e fault domains começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Regiões, availability domains e fault domains precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Regiões, availability domains e fault domains combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Tags, cost tracking e policies organizacionais

Tags conectam recurso a owner, ambiente, custo, dados e lifecycle; não são decoração para relatório. Uma tag livre pode receber valor inconsistente e quebrar orçamento ou automação. A baseline define namespace, chaves, valores permitidos, aplicação obrigatória, herança, exceções e enforcement. A mutação cria instance sem cost-center e pipeline ou policy deve negar ou abrir finding imediatamente. Cost tracking não mede somente spend: revela recursos órfãos, crescimento anormal e impacto de incidentes.

### Taxonomia e validação

Namespace separa tags de plataforma, finanças, segurança e produto. A baseline usa valores enumerados para ambiente, owner e classificação, evitando e-mail ou URL como tag. A mutação usa grafia diferente de Production e aggregation deixa de atribuir custo; validator falha. Chaves de negócio podem exigir ID estável, não nome mutável. Tag default é complemento, não desculpa para omitir contexto. Mudança de taxonomia possui migration, dual-read e relatório de cobertura. Tags sensíveis não carregam secrets ou PII.

### Custos e budgets

Cost tracking tags alimentam budgets, forecasts e chargeback com intervalo de atraso documentado. A baseline associa unidade de cobrança a serviço, compartment, owner e environment. A mutação cria preview em loop e forecast alerta taxa anormal antes de esgotar orçamento. Budget não é quota técnica; ambos têm guardrails distintos. Credit, imposto e arredondamento ficam separados de consumo. Relatório mostra unknown spend. Alert routing não depende de pessoa única. Anomalia é investigada com recurso e release, não só total mensal.

### Policies organizacionais

Policies limitam regiões, shapes, public IPs, serviços e criação por compartment conforme necessidade. A baseline trata policy as code ou export versionado, com testes positivos/negativos e owner. A mutação libera shape cara para exceção temporária e não remove; reconciliation acusa expiry vencido. Regra não substitui IAM de recursos existentes. Policy de deny pode afetar recovery, então drill inclui caminho de emergência. Conflicting policies são analisadas antes de deploy. Console change gera drift.

### Quotas e guardrails

Quota organiza consumo dentro de compartment e service limits organizam tenancy/região. A baseline define headroom e comportamento ao aproximar limite. A mutação cria autoscaling sem limite e esgota capacidade/budget; policy e alert interrompem expansão. Preview recebe TTL e quotas menores. Guardrail não pode excluir produção crítica sem runbook. Override tem owner, motivo, duração e métrica. Uso observado é reconciliado com manifest e billing, já que dashboards podem atrasar.

### Ownership e recertificação

Donos recertificam tags, budgets e exceptions periodicamente. A baseline lista recurso sem tag, cost-center inativo, ambiente inesperado e policy bypass como findings. A mutação transfere equipe mas mantém owner antigo; workflow atualiza antes de desligamento. Janitor age somente em seleção aprovada e dry-run. Recursos com legal hold não são removidos. Evidence de recertificação liga principal, escopo, decisão e data. Métrica de cobertura não substitui revisão de valores semânticos.

### Incidentes financeiros

Ataque, loop, leak de egress ou integração mal configurada pode virar incidente de custo. A baseline possui orçamento de burst, alertas de taxa, circuit breakers e capacidade de desabilitar feature não crítica. A mutação cria chaves/cache únicos e custo cresce sem aumento de usuários; cardinalidade gate detecta. Contenção preserva dados e evidência. Bloquear indiscriminadamente pode derrubar recuperação, portanto ações são graduais. Pós-incidente atualiza forecasts e guardrails. Billing export é dado de auditoria controlado.

### Evidência e aceite

A banca injeta tags inválidas, recurso órfão, policy drift, preview storm, quota próxima e custo desconhecido. Aceite exige taxonomia consistente, atribuição suficiente, alerta antecipado, override expirável e cleanup seguro. Validador local prova schema; billing/policies reais provam enforcement e atraso. Sem tenancy, claims remotas ficam Pending. Evidence bundle contém catálogo de tags, cobertura, forecast, regras, notification receipts, exceptions, timeline e cleanup.

O reporte de custo preserva a data de coleta e a janela de consolidação, pois ausência temporária de cobrança não é custo zero. Revisões de budget conferem também recursos sem uso aparente, reservas mantidas para recuperação e compromissos de longo prazo.

### Decisão operacional de Tags, cost tracking e policies organizacionais

A decisão sobre Tags, cost tracking e policies organizacionais começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Tags, cost tracking e policies organizacionais precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Tags, cost tracking e policies organizacionais combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Landing zone e baseline do Quíron

Landing zone Quíron reúne tenancy, compartments, IAM, rede, logs, tags, budgets e IaC em uma baseline que permite criar workloads repetíveis sem abrir privilégios por conveniência. Ela não é uma coleção de cliques: cada recurso tem manifest, owner, dependências e teste negativo. A mutação aplica configuração parcial no console e deixa subnet pública com route ampla; reconciliation deve encontrar drift antes de workload entrar. Sem tenancy sandbox, o material local descreve e valida intenção, mas não afirma criação remota.

### Manifest e source of truth

Manifest separa ambientes, regiões, compartments, CIDRs, tags, policies, budgets, identities e providers por versões/digests. A baseline roda plan/read-only diff antes de apply e exige review de mudança destrutiva. A mutação usa ID de tenancy errado e preflight bloqueia. Valores secretos são referências, não plaintext. State de IaC tem backend, lock, encryption e acesso mínimo. Import de recurso existente passa por inventory e approval. Source of truth não é screenshot de console.

### Rede base e segmentação

VCN define CIDR sem sobreposição planejada, subnets públicas/privadas, route tables, NSGs, gateways e DNS. A baseline nega acesso público por default e usa Bastion ou caminhos auditáveis para administração. A mutação cria route para internet em subnet de database e policy/teste falha. Egress é allowlisted quando possível. Endpoints privados de serviços reduzem exposição. Peering e VPN são modelados como dependências explícitas. Diagrama não substitui regras efetivas.

### Logging e segurança inicial

Audit, logs de rede e alarmes são habilitados com destino, retenção, redaction e access control definidos. A baseline injeta canary sintético e confirma que não aparece em destino indevido. A mutação cria recurso sem log group e gate bloqueia. Cloud Guard e scanners possuem owner e workflow de finding; alerta sem rota de resposta não aprova. KMS/keys seguem rotation e backup. Security zones podem impor postura, mas exceções documentam impacto em recovery. Observabilidade começa antes do primeiro app.

### Pipeline e mudanças

IaC pipeline usa workload identity, plan artifact, policy checks, approval e apply ligado ao commit/digest. A baseline diferencia plan de effect e consulta estado após outcome desconhecido. A mutação aplica plan aprovado em outra região e destination check falha. Build once também vale para infraestrutura: o bundle revisado é o bundle aplicado. Drift não é corrigido automaticamente quando removeria recurso sem avaliação. Rollback de rede e IAM considera sessões, dependências e dados. Audit preserva receipts.

### Workload Quíron

Quíron recebe compartments e tags corretos, rede privada, identity mínima, database autoritativo e rotas externas apenas via fronteira planejada. A baseline mantém tenant sintético, última vaga, outbox e observer para provar efeito. A mutação usa secret de Production em preview e schema/policy bloqueia. Deploy candidate passa contracts, security e canary. Custo e capacity budgets acompanham cada camada. Integrações são allowlisted. Restore depende de backup/drill e não de crença em snapshots.

### Banca e recuperação

Game day introduz policy drift, key vazada, rota excessiva, quota baixa e falha de região, exigindo contenção e restore coordenados. A baseline trava apply, revoga identity, restringe egress, preserva audit e reconcilia recursos. A mutação restaura código sem corrigir policy e banca falha. Recovery verifica rede, acesso, dados, effects e custo. Ações posteriores recebem owner/data. Comunicação separa fatos/hipóteses. Cleanup remove sandbox depois de evidence e janela de monitoramento.

### Evidência e aceite

A banca analisa manifest, plan, policy, diagramas, tags, synthetic journey e incident timeline. Aceite exige source of truth, segmentação, identidade mínima, logs, budgets, rollback e invariante de última vaga. Lint/IaC parser local provam estrutura; OCI real prova criação, policy, VCN e audit. Sem sandbox, aspectos remotos são Pending. Evidence bundle contém digests, plans, diffs, topology, findings, probes, receipts, recovery report e cleanup.

### Decisão operacional de Landing zone e baseline do Quíron

A decisão sobre Landing zone e baseline do Quíron começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Landing zone e baseline do Quíron precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Landing zone e baseline do Quíron combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
