# Oracle Cloud — Observabilidade e segurança — rascunho não materializado

## Logging, audit e retention

Logs e Audit respondem quem mudou qual recurso, qual workload falhou e como a resposta foi tomada, sem se tornarem novo repositório de secrets ou dados pessoais. OCI Audit registra control-plane; application, network e serviço geram streams distintos. A baseline define fontes, schema, log groups, destino, retenção, redaction, região, acesso, owner e SLO de entrega. A mutação escreve Authorization no console de Function e canary deve bloquear. Dashboard visível não prova que evento foi entregue, preservado ou correlacionado ao release correto.

### Fontes e correlação

Build, deploy, Audit, VCN flow, LB, WAF, Function, database e aplicação possuem semânticas próprias. A baseline inclui timestamp, severity, event, principal pseudônimo, OCID/release, route template e outcome onde apropriado. A mutação mistura erro de builder com erro runtime e incident escolhe artefato errado; schema gate acusa. Correlation ID é propagado a queues/providers sem confiar em valor externo para auth. Labels são bounded. Request URL é normalizada. Missing telemetry é estado Unknown, não ausência de falha.

### Redaction e acesso

Allowlist de campos reduz risco de headers, cookies, bodies, DSNs, wallets e tokens em log. A baseline injeta canary em build/runtime e procura em streams, exports, caches e tickets. A mutação serializa erro com environment inteiro e scanner falha. Log access usa group/identity mínima e audit próprio. Support recebe janela/release, não busca ilimitada por PII. Retenção atende operação, contrato e incidente. Export é criptografado, com digest e chain of custody. Hash de segredo não é log padrão.

### Delivery e retenção

Log group, connector, Object Storage/SIEM e alerta possuem backlog, retry, quota e falha conhecidos. A baseline mede lag, drops, duplicatas e destino indisponível por canary. A mutação retorna sucesso de collector sem persistir e reconciliation falha. Falha de sink não derruba transação crítica nem cresce buffer sem limite. Retenção expira conforme policy e hold preserva incidente. Delete de log não elimina cópia exportada sem mapear destino. Região do sink respeita classificação.

### Audit e change control

Audit mostra chamada de controle, principal, alvo e hora, mas não substitui confirmação de efeito no data plane. A baseline liga cada apply/deploy/policy change a ticket, source digest e estado observado. A mutação altera NSG no console e drift report correlaciona audit com diff. Ação manual emergencial tem owner/expiry. Query de audit é versionada em runbook. Logs de auth/secret são minimizados. Imutabilidade/retention seguem risco. Investigador não modifica original.

### Operação e incidentes

Runbook começa por release, principal, OCID e janela, classifica falha e preserva evidence antes de cleanup. A baseline testa perda de stream, evento duplicado, secret canary e acesso indevido ao log. A mutação apaga resource/log para resolver incidente e hold bloqueia. Alertas por ausência de log complementam alertas de erro. Pós-incidente revisa redaction, SLO e access. Custos de ingestão/retention têm budget. Comunicação usa resumo redigido. Cleanup tem approval.

### Evidência e aceite

A banca injeta erro de build/runtime, change manual, canary, sink outage, acesso amplo e hold. Aceite exige correlação, zero secret, delivery dentro de SLO, audit útil e retenção correta. Parsers locais provam schema; OCI Logging/Audit reais provam streams. Sem sandbox, claims ficam Pending. Evidence bundle contém schema, samples redigidas, canary report, lag metrics, audit queries, hold e cleanup.

### Decisão operacional de Logging, audit e retention

A decisão sobre Logging, audit e retention começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Logging, audit e retention precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Logging, audit e retention combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Metrics, alarms e SLO

Métrica só é útil quando mede jornada/efeito correto, possui denominador, janela, owner e ação. Alarmar CPU alta sem saber se cliente falhou cria ruído; contar 200 sem validar body/effect cria falso verde. A baseline define SLI, SLO, error budget, source, labels, threshold, burn rate, routing, synthetic e runbook por serviço. A mutação responde 200 com preço stale ou reserva duplicada e indicador precisa contar falha. Dashboard sem dados é Unknown.

### SLIs e objetivos

Availability mede resposta semanticamente correta dentro de deadline; latency mede distribuição por rota/região/release; freshness e effect cardinality podem ser SLIs separadas. A baseline documenta numerator, denominator, exclusões e query versionada. A mutação exclui erros de uma rota para melhorar número e audit/teste falha. Meta deriva risco, não aspiração. Low volume usa synthetic com cuidado. Dependências externas têm sinal separado. Mudança de SLO passa por review. Resultado inclui sample size e unknowns.

### Alarmes e burn rate

Burn-rate multiwindow detecta gasto rápido/lento de budget sem page por ruído breve. A baseline combina janelas, severidade, owner, dedupe, escalation e runbook. A mutação alerta só depois de esgotar budget mensal e simulation falha. Alert de sintoma é prioritário; alert de causa ajuda triage. Silence possui razão/expiry. Routing é testado por receipt, não assumido pelo dashboard. Alertas de custo/quota e segurança têm ações diferentes. Override é auditado.

### Synthetic e canary

Synthetic percorre DNS/TLS, LB, API, auth sintética, última vaga fake e cleanup com tenant/identity mínima. A baseline usa regiões/schedules declarados, keys idempotentes e dados descartáveis. A mutação toca cliente real ou deixa reserva e safety gate bloqueia. Candidate canary inclui release digest e compara baseline. Retry limitado não mascara primeira falha. Monitor de recovery confirma rollback. Synthetic secrets têm rotação. External provider recebe fake/sandbox. Observação do probe e da aplicação é correlacionada.

### Métricas e cardinalidade

Labels como OCID, user ID, URL completa ou request ID explodem custo e prejudicam query. A baseline usa serviço, route template, região, release e outcome bounded. A mutação inclui email em dimensão e privacy/cardinality test falha. Histograms e percentis são escolhidos conforme SLO. Sampling preserva errors/outliers. Metrics pipeline tem quota/lag. Counter reset e duplicata são entendidos. Export para terceiros segue destino permitido. Dashboard não recebe secrets.

### Game day e melhoria

Alarme é exercitado com injeção de 5xx, latency, stale, duplicate effect, region outage e telemetry loss. A baseline mede detection, acknowledgement, mitigation e recovery, comparando SLO. A mutação muda threshold depois do incidente e audit bloqueia. Runbook aponta queries e ações seguras. Finding gera owner/data. False positive é ajustado sem remover sinal crítico. Relatório separa hipótese de evidência. Custo de monitors entra no budget. Retenção permite revisão.

### Evidência e aceite

A banca recalcula SLO de eventos, injeta burn, falha routing, synthetic inseguro, cardinalidade e telemetry missing. Aceite exige cálculo correto, alert acionável, jornada segura, labels bounded e recovery observada. Testes locais provam matemática; OCI Monitoring/Notifications reais provam delivery. Sem sandbox, claims ficam Pending. Evidence bundle contém specs, queries, simulations, receipts, synthetic timeline, runbook e cleanup.

### Decisão operacional de Metrics, alarms e SLO

A decisão sobre Metrics, alarms e SLO começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Metrics, alarms e SLO precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Metrics, alarms e SLO combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Cloud Guard, Vulnerability Scanning e Security Zones

Cloud Guard, Vulnerability Scanning e Security Zones ajudam a detectar/configurar postura, mas finding não se corrige sozinho e zone não substitui arquitetura/identidade. A baseline declara targets, detectors, responder recipes, severidade, owner, SLA, exceções, scan coverage e validação de remediação. A mutação silencia finding de bucket público sem alterar policy e reconciliation deve manter risco aberto. Ferramenta gerenciada possui permissões, regiões, custos e blind spots que precisam ser explícitos.

### Targets e cobertura

Target determina compartments/resources observados; cobertura parcial pode criar falsa segurança. A baseline inventaria recursos esperados e compara com targets, scanners e zones. A mutação cria compartment novo fora do target e coverage report acusa. Novo serviço passa por assessment antes de Production. Scanner de host/container/code tem fontes distintas. Findings são ligados a asset/owner/release. Ausência de finding não prova ausência de vulnerabilidade. Coverage SLO e alertas acompanham gaps.

### Detectors e responder recipes

Detector identifica configuração/atividade; responder pode alertar, bloquear ou remediar. A baseline começa com modo observação para ação potencialmente destrutiva e valida casos positivos/negativos. A mutação ativa auto-remediation que remove route crítica e availability canary falha. Recipe é versionada, scoped e possui rollback. Responder identity é mínima e auditada. False positive tem prazo/compensação. Finding severity é contextualizada por exposição/dado. Evento de remediação é confirmado no estado efetivo.

### Vulnerability scanning

Scan encontra CVEs e portas/config conforme alvo e versão; triage considera exploitability, internet exposure, compensação e SLA. A baseline fixa cadence, image/host coverage, artifact digest e owner. A mutação atualiza template mas instances antigas continuam vulneráveis; drift check falha. Scanner não vê segredo em log ou lógica de auth sem outra ferramenta. Patch tem canary/rollback. Exceção é documentada. Resultados redigem detalhes exploráveis. Remediação verifica runtime, não só scan green.

### Security Zones e policies

Security Zone impõe guardrails sobre recursos/compartments, por exemplo impedir exposição pública conforme recipe. A baseline testa cria/atualiza/delete e recovery para que policy não bloqueie restore sem plano. A mutação move workload sensível para compartment fora da zone para contornar regra e governance detecta. Zone não substitui IAM/NSG/object policy. Exceção exige approval/tempo. IaC plan antecipa deny. Mudança de recipe tem impact analysis. Audit preserva intent e resultado.

### Triage e incident response

Finding recebe owner, severidade, prazo, impacto, evidência, ação e verificação. A baseline não fecha por comentário; scanner/estado/probe confirmam. A mutação fecha finding mas credential ainda funciona e negative test falha. Critical pode disparar containment: revoke, lock deploy, restrict egress ou isolar instance. Ação respeita disponibilidade e dados. Incident hold preserva logs/artifacts. Comunicação evita detalhes de exploração. Métrica mede idade, reabertura e cobertura.

### Evidência e aceite

A banca testa target ausente, finding suprimido, responder destrutivo, instance antiga, zone bypass e revoke incompleto. Aceite exige cobertura conhecida, finding rastreável, remediação verificada e exceção expirada. Config/local scan prova desenho; OCI services provam detection/enforcement. Sem sandbox, claims ficam Pending. Evidence bundle contém targets, recipes, scan/triage, state probes, audit, incident timeline e cleanup.

### Decisão operacional de Cloud Guard, Vulnerability Scanning e Security Zones

A decisão sobre Cloud Guard, Vulnerability Scanning e Security Zones começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Cloud Guard, Vulnerability Scanning e Security Zones precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Cloud Guard, Vulnerability Scanning e Security Zones combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Incident, revoke e recovery

Incidente OCI pode envolver identity, rede, compute, database, registry, bucket, pipeline e custos ao mesmo tempo. Resposta precisa conter sem apagar a evidência que permite entender efeitos e recuperar de artifact/configuração confiáveis. A baseline define severidade, commander, papéis, contatos, ações, cadeia de custódia, runbooks e critérios de retorno. A mutação revoga token mas rollback restaura secret antigo; reconciliation deve bloquear fechamento. Velocidade não autoriza resultados presumidos.

### Detecção e escopo

Sinais de Audit, Cloud Guard, logs, SLO e canary são correlacionados por principal, OCID, release e região. A baseline separa fato, hipótese, alcance e unknown. A mutação classifica acesso após offboarding como falso positivo e probe mantém incidente aberto. Escopo inclui credenciais derivadas, caches, integrations, snapshots e exports. Severity muda com impacto/evidência. Timeline usa clock consistente. Owner de dados participa quando PII está envolvida. Comunicação possui audiência/cadência.

### Contenção e revoke

Contenção pode travar pipeline, retirar route, isolar NSG, pausar consumer, revogar key/token, bloquear policy ou restringir egress. A baseline escolhe ação reversível e verifica caminho legítimo mínimo. A mutação abre 0.0.0.0/0 para recuperar operação e policy impede. Revoke precede rotação quando credencial comprometida ainda aceita requests. Cada action recebe receipt e probe negativo. Sessões/tokens emitidos são considerados. Contenção de app não revoga database credential automaticamente.

### Preservação de evidence

Logs, Audit, manifests, images, snapshots e config relevantes são exportados/retidos com digest, horário, origem e ACL. A baseline aplica incident hold antes de cleanup. A mutação deleta instance/volume e perde prova; process gate falha. Audit mostra ação, mas state/probe mostra efeito. Dados sensíveis são minimizados e acessados por necessidade. Cadeia de custódia registra transferências. Tool de coleta é versionada. Evidence não é reescrita por reporte posterior.

### Recovery e restore

Recovery usa source, image, IaC, policy e secrets novos/atestado; alias/route retorna somente após canary, contracts e effects reconciliation. A baseline verifica database schema/data, queues/outbox, integrations, domains e cache. A mutação restaura código mas worker antigo continua duplicando cobrança; observer falha. Rollback pode ser forward fix quando migration não é reversível. Backup drill suporta RPO/RTO. Config drift fecha após observado. Monitor reforçado mantém janela.

### Pós-incidente

Postmortem identifica condições técnicas, não culpa, e cria ações com owner, prazo e verificação. A baseline reexecuta drill para fechar ação. A mutação altera documento sem teste e oracle reprova. SLO mede detection/revoke/recovery. Policies, runbooks, scans e treinamento evoluem. Custos, fornecedores e obrigações são avaliados. Comunicação final preserva fatos/unknowns. Artefatos seguem retention. Break-glass usado é rotacionado/revistado.

### Evidência e aceite

A banca simula key vazada, bucket exposto, policy drift, Function duplicadora e restore inseguro. Aceite exige revoke efetivo, evidence preservada, artifact/config confiáveis, effects reconciliados e ações verificadas. Tabletop prova decisão; OCI/data/provider sandbox prova operação. Sem sandbox, claims ficam Pending. Evidence bundle contém timeline, scope, receipts, probes, digests, recovery report, monitor window, postmortem e cleanup.

### Decisão operacional de Incident, revoke e recovery

A decisão sobre Incident, revoke e recovery começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Incident, revoke e recovery precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Incident, revoke e recovery combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
