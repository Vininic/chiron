# Oracle Cloud — Bancos e consistência — rascunho não materializado

## Autonomous Database e conexão

Autonomous Database reduz operação de infraestrutura, mas não elimina modelo de dados, identidade, pooling, transações, backup ou controle de acesso. Uma connection string funcional pode apontar a ambiente errado, esgotar sessões ou vazar wallet. A baseline declara tenancy/compartment, endpoint privado, database, roles, schema, secret reference, pool, timeout, regiões e owner. A mutação entrega wallet de Production a preview e schema/policy bloqueia. Serviço gerenciado não transforma dados em públicos nem torna aplicação automaticamente altamente disponível.

### Endpoints e rede

Private endpoint, VCN, NSG, DNS e TLS definem por onde client alcança database. A baseline prefere caminho privado quando disponível, testa origem permitida/proibida e não usa IP como autorização única. A mutação abre endpoint público para depurar e security corpus falha. Wallet/certificate valida hostname e rotação. Connection do bastion é excepcional, auditada e temporária. DNS split-horizon é documentado. Outage de resolver/network é classificado separadamente de auth ou SQL. Egress do app é mínimo.

### Credenciais e roles

Admin, aplicação, migration, leitura e observabilidade usam principals/roles diferentes. A baseline restringe schema, verbos e objetos, guarda secret em vault e roda rotação sem interromper pool. A mutação usa conta ADMIN no runtime e capability review reprova. Credential não aparece em wallet copiada, logs ou artifact. Role de migration não roda no startup da aplicação. User de observabilidade não lê PII sem necessidade. Revoke é testado por nova conexão e sessions existentes são consideradas no incidente.

### Pooling e limites

Serverless ou autoscaling pode abrir mais clients que o banco suporta. A baseline calcula orçamento de sessions por instance/pool, define acquire timeout, max lifetime e fila bounded. A mutação cria conexão por request e burst causa saturation; métricas e load test apontam. Pool não compartilha tenant/session state sem reset. Prepared statement e transaction semantics são compatíveis com driver. Deadline downstream é menor que deadline da request. Aumentar connection limit não resolve query lenta ou lock. Idle leak é observado.

### Backup, patch e disponibilidade

Autonomous possui mecanismos gerenciados, mas requisito de RPO/RTO, retenção, restauração, região e owner ainda é do produto. A baseline executa restore/teste lógico em ambiente isolado e valida schema/rows/ACL. A mutação confia em backup automático sem drill e acceptance falha. Maintenance window, patching e failover entram no SLO. Read replica não confirma write crítico com lag desconhecido. Chave e wallet de restore são verificadas. Billing de storage/backup é atribuído.

### SQL, dados e privacidade

Query parametrizada, schema validation, masking e classificação protegem dados além do serviço. A baseline testa injection, tenant predicate, export e log redaction. A mutação remove filtro de tenant e corpus cross-account acusa. Database audit tem access/retenção definidos. Dados sintéticos são usados em preview. SQL plan/performance é medido, mas não justifica cachear resposta privada. Object storage export é novo boundary. Backup herda PII e não é aberto para suporte por padrão.

### Evidência e aceite

A banca testa endpoint errado, role ADMIN, pool exaurido, wallet vazada, cross-tenant, restore e revoke. Aceite exige rede privada quando desenhada, role mínima, sessions bounded, dados isolados e recovery verificado. Drivers/parsers locais provam configuração; OCI DB real prova endpoint, roles e backup. Sem sandbox, claims ficam Pending. Evidence bundle contém manifests redigidos, pool metrics, queries fingerprint, audit, drill timeline e cleanup.

### Decisão operacional de Autonomous Database e conexão

A decisão sobre Autonomous Database e conexão começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Autonomous Database e conexão precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Autonomous Database e conexão combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Oracle Database service e operações

Oracle Database service exige escolhas explícitas de edition, compute, storage, HA, Data Guard, patching, backups e operação. Managed não significa sem responsabilidade: schema migration, grants, capacidade, observability e recovery precisam de owner. A baseline descreve topology, primary/standby, regiões, endpoints, roles, backup, RPO/RTO, patch cadence e runbook. A mutação assume standby disponível sem testar redo/app failover e drill falha. Instância running não prova consistência nem capacidade para recuperar.

### Topologia e HA

Primary aceita writes autoritativos; standby, replica ou RAC têm papéis/semânticas específicas. A baseline declara qual falha é tolerada e quais writes podem ocorrer onde. A mutação manda escrita a replica ou assume active-active sem fencing e última vaga duplica. Load balancer/connection string recebe failover planejado. Health de database inclui redo, lag e role, não apenas porta aberta. Anti-affinity e região são verificadas. HA não elimina necessidade de backup contra corrupção lógica.

### Data Guard e failover

Data Guard replica redo e pode suportar switchover/failover conforme configuração, mas promotion deve impedir primary antigo de voltar a escrever. A baseline define trigger, approver, fencing, client reconnect, RTO/RPO e failback. A mutação cria partition e ambos os lados aceitam writes; observer falha. Role transition é auditada. Connection pools drenam e reabrem. DNS/secret/monitor acompanham novo primary. Drill mede recuperação da aplicação, não somente status de banco.

### Patching e upgrades

Patch de engine, OS, listener e driver pode mudar plano, protocolo ou availability. A baseline usa janela, precheck, backup, canary, compatibilidade e rollback/forward path. A mutação altera versão e migration/driver quebra; contract gate detecta. Rolling patch preserva capacidade e connections. Emergency patch tem aprovação e evidence. Inventário mostra versões de primary/standby. Finding de CVE tem owner/SLA. Patch não é concluído até health, backup e observabilidade confirmarem.

### Backups e recuperação

Backup físico, lógico, archive redo e retention atendem cenários diferentes. A baseline mapeia corrupção, delete, region loss e erro de migration a mecanismo e exercício de restore. A mutação restaura somente control file ou schema sem grants e aplicação falha; acceptance reprova. Restore acontece isolado primeiro, verifica checksums, schema, ACL, dados e application journey. RPO/RTO são medidos. Backup encryption/key é parte do teste. Cleanup não remove evidence de drill.

### Capacity e performance

CPU, memory, I/O, connections, locks, redo e storage têm budgets. A baseline mede p95 de query/transaction, concurrent sessions e lag por release. A mutação escala Functions sem ajustar pool e database vira gargalo; capacity gate falha. Index/migration tem estratégia online compatível. Plan regression é detectada por corpus, não só média. Alertas distinguem workload legítimo de abuso. Custo de standby/backup entra no forecast. Limit desconhecido não vira headroom assumido.

### Evidência e aceite

A banca testa write em replica, failover partitionado, patch incompatível, restore incompleto, pool burst e lag. Aceite exige source de truth clara, fencing, dados recuperáveis, capacidade e drill medido. SQL/fakes locais provam modelo; OCI DB/Data Guard real prova operações. Sem sandbox, claims ficam Pending. Evidence bundle contém topology, roles, metrics, backup/restore reports, failover timeline, observers e cleanup.

### Decisão operacional de Oracle Database service e operações

A decisão sobre Oracle Database service e operações começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Oracle Database service e operações precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Oracle Database service e operações combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Transactions, última vaga e idempotência

Última vaga demonstra que cloud, Functions e retries não produzem exatamente uma vez por si só. A decisão precisa de transação no banco autoritativo, constraint ou lock adequado, key de idempotência e outbox para efeitos externos. A baseline define estoque um, principal, tenant, request key, deadline, transaction, event e observer de row/event/provider. A mutação envia duas requisições paralelas e ambas reservam; oracle exige uma reserva e um efeito. Cache, sessão ou lock em memória nunca são autoridade.

### Modelo e invariante

Tabela/modelo contém disponibilidade, reservation, idempotency record e outbox com constraints expressando regra. A baseline define se mesma key com payload diferente é rejeitada e se retry retorna decisão original. A mutação usa UUID novo em timeout e cria intenção duplicada; contract classifica falha. Saldo negativo é proibido. Tenant entra em chave e predicate. Read model pode ser stale, mas write consulta fonte. Audit registra decisão e correlação, sem body sensível.

### Interleavings e isolamento

Teste de concorrência usa barrier para controlar leitura, lock e commit, não apenas requests sequenciais. A baseline escolhe serializable, row lock, conditional update ou unique constraint conforme engine e mede retry. A mutação faz read-then-write fora da transação e observer vê dois vencedores. Isolation level tem custo/semântica conhecidos. Deadlock e serialization failure recebem retry limitado com key preservada. Pool/region não alteram garantia do banco. Timeout do client não cancela commit automaticamente.

### Idempotência e outcome desconhecido

Após commit, response pode se perder. A baseline persiste decisão com key na mesma transação e consulta state antes de repetir. A mutação retorna 504 e retry cria outra row; cardinalidade falha. Key possui TTL/retention compatível com retry/business risk. Payload fingerprint impede key reutilizada para operação diferente. Status HTTP não prova que não houve commit. Reconciliation resolve outcomes unknown. Cliente não deve escolher key previsível de outro tenant. Logs não expõem key completa quando sensível.

### Outbox e provider

Outbox é gravada atomicamente com reservation; worker entrega evento por ID, dedupe e receipt. A baseline injeta crash entre commit e envio, delivery duplicado e timeout do provider. A mutação chama provider dentro da transação e retries duplicam efeito; observer acusa. Ack acontece após estado durável. DLQ guarda motivo redigido e replay tem approval. Provider fake reproduz status desconhecido, não apenas 200. Egress e segredo do provider são controlados. Métricas comparam row/event/receipt.

### Região, failover e recovery

Failover não pode permitir writer antigo ou dupla entrega. A baseline usa primary/fencing/epoch e reconcilia events após transição. A mutação promove réplica sem fencing e duas regiões reservam; test falha. Backup/restore preserva idempotency/outbox ou tem estratégia de replay segura. RPO/RTO incluem efeitos externos. Incident pode pausar consumer, não apagar evidence. Restore compara source of truth e provider receipts. Connection/client redirect recebe deadline e retry policy.

### Segurança e operação

Authorization precede decisão e banco reforça limites quando apropriado. A baseline testa principal errado, tenant errado, replay e secret leak. A mutação usa header de região como identity e cross-tenant gate falha. Rate limit evita abuso sem impedir retry legítimo. Alertas cobrem contention, duplicate, lag, timeout e saldo negativo. Runbook define compensação sem apagar history. Dados de teste são sintéticos. Evidence é retida por incidente e minimizada para privacidade.

### Evidência e aceite

A banca testa duas requisições concorrentes, retry pós-commit, worker crash, duplicate event, failover e restore. Aceite exige uma reserva/outbox/effect, saldo não negativo, auth correta e recovery reconciliada. Fake local prova algoritmo; banco/fila/provider reais provam limites. Sem sandbox, claims ficam Pending. Evidence bundle inclui timelines, queries, constraints, receipts, metrics, drill e cleanup.

### Decisão operacional de Transactions, última vaga e idempotência

A decisão sobre Transactions, última vaga e idempotência começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Transactions, última vaga e idempotência precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Transactions, última vaga e idempotência combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Migration, restore e residência

Migration muda estrutura e significado de dados; restore recupera estado; residência limita onde ambos podem existir. Tratar migration como parte do deploy ou restore como botão de emergência causa incompatibilidade e perda de evidência. A baseline define schema version, expand-contract, owner, tooling, backup, regions, retention, RPO/RTO, approval e rollback/forward plan. A mutação remove coluna antes de todas as releases antigas saírem e rollback quebra. Banco gerenciado não elimina compatibilidade de aplicação.

### Expand, migrate e contract

Mudança aditiva cria coluna/tabela/índice compatível, writers passam a preencher, readers toleram ambos, backfill é observável e remoção só ocorre após janela. A baseline versiona migration e bloqueia DDL no startup. A mutação renomeia campo em uma etapa e candidate antigo falha. Backfill tem batch, throttle, checkpoint, idempotência e budget. Índice grande usa estratégia online suportada. Schema version aparece em health/diagnóstico. Rollback de código é ensaiado contra schema atual.

### Restore e validação

Restore é executado em ambiente isolado, com chaves, roles, rede e dados classificados, antes de qualquer overwrite. A baseline valida checksums, contagens, constraints, grants, application contract e efeitos pendentes. A mutação restaura bytes mas perde grants/ACL e app não inicia; acceptance falha. RPO mede instante recuperado; RTO inclui provision, restore, validation e tráfego seguro. Restore de subset não é banco completo. Evidence guarda report/digest e cleanup de sandbox.

### Residência e replication

Primary, backups, replicas, logs, exports e support access precisam obedecer regiões permitidas. A baseline mapeia classe de dados a destinos e testa policy de criação/replicação. A mutação manda backup para região não aprovada e rule/report bloqueia. DR não justifica residência por default; decisão legal/técnica é explícita. Metadata pode também revelar dados. Cross-region egress/custos são medidos. Replication lag afeta freshness. Delete requests alcançam derivados e backups segundo policy.

### Cutover e clientes

Migration/cutover coordena serviços, jobs, analytics, cache e clients. A baseline usa feature flag/schema compatibility, canary e monitor para não trocar todos simultaneamente. A mutação ativa writer novo antes de reader compatível e erro aparece. DNS/connection endpoint switch é separado de schema. Queues contêm eventos antigos e consumidores aceitam versões durante janela. Rollback escolhe forward fix se data foi transformada irreversivelmente. Communication define freeze e abort threshold.

### Segurança e auditoria

Migration runner tem identidade própria, mínima e com prazo; aplicação não recebe DDL amplo. A baseline registra quem aplicou, source SHA, migration digest, tempo e resultado. A mutação usa admin pessoal e audit/processo falha. Scripts não imprimem connection strings ou rows. Backup exports são criptografados e access-controlled. Incident hold preserva logs/artefatos. Drift entre schema desejado/observado é detectado. Approval cita impact e recovery path.

### Evidência e aceite

A banca testa migration quebradora, backfill interrompido, rollback antigo, restore sem grants, região proibida e consumer de evento antigo. Aceite exige compatibilidade, restore validado, residência, audit e plano de recovery. Linters/fakes provam sequência; OCI database real prova restore/replication. Sem sandbox, claims ficam Pending. Evidence bundle contém migrations, manifests, reports, topology, approvals, timelines, observer e cleanup.

### Decisão operacional de Migration, restore e residência

A decisão sobre Migration, restore e residência começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Migration, restore e residência precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Migration, restore e residência combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
