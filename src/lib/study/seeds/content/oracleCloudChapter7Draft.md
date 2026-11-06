# Oracle Cloud — Containers e serverless — rascunho não materializado

## Container Registry e supply chain

Container Registry armazena imagens que podem executar com privilégio de workload; tag humana é mutável, digest identifica bytes. A baseline separa repositories por ambiente/risco, fixa artifact digest, source, builder, SBOM, scan, retention, owner e policy de pull/push. A mutação atualiza tag latest depois do teste e cluster baixa bytes diferentes; gate de digest falha. Registry privado não elimina risco de credential ampla, image comprometida ou camada contendo secret.

### Repositórios e permissões

Repository pertence a compartment e tem writers, readers, automações e lifecycle mínimos. A baseline separa build de runtime e evita token humano em CI/cluster. A mutação permite push a qualquer branch ou pull de Production por preview; IAM matrix reprova. Imagem publicável é decisão explícita, com review de conteúdo. Delete/verificação de retention considera rollback. Namespace/repo name não carrega dados sensíveis. Audit correlaciona principal, digest e action. Mirror externo é supply-chain adicional.

### Tags, digests e promotion

Tag como candidate ou release referencia digest imutável; deploy registra ambos e verifica igualdade antes de promover. A baseline não aceita pull por latest em Production. A mutação troca tag mantendo nome e canary compara provenance. Promotion copia/associa artifact aprovado sem rebuild. Digest de manifest multi-arch é preservado. Rollback escolhe digest conhecido e compatível, não última tag verde. Cache do node é considerado em observação. Evidence retém source SHA, lockfile e builder metadata.

### Build e dependências

Dockerfile, base image, packages, scripts e builder pertencem à cadeia. A baseline pina base por digest, usa lockfile, minimiza layers e executa sem secrets persistentes. A mutação altera base ou postinstall e secret canary/scan detecta. Build context exclui .env, keys e outputs locais. Multi-stage reduz runtime surface mas não é controle completo. Network e registry allowlist são definidas. Builder identity tem menor privilégio. Build logs são redigidos. Reproducibility compara artifact quando viável.

### SBOM, scan e admission

SBOM liga componentes ao digest; scanner encontra vulnerabilidades/config/secrets e triage decide SLA/compensação. A baseline bloqueia severity aplicável e não fecha finding só porque não aparece em dashboard antigo. A mutação inclui package vulnerável ou secret em layer e gate acusa. Admission no OKE verifica digest, signature/attestation quando disponível, registry e policy. Scan não prova runtime behavior. Base image atualizada exige rebuild/teste. Findings de dependência transitiva têm owner. False positive é documentado.

### Retention e incidentes

Retention preserva artifacts de rollback e remove builds efêmeros após janela; delete prematuro pode impedir recovery. A baseline marca release, candidate e evidence, revisa repos órfãos e custo. A mutação limpa digest ainda referenciado por deployment e rollback test falha. Credential vazada é revogada, imagens suspeitas são quarantined e deployments são localizados por digest. Registry audit é exportado. Cleanup não apaga proof de incidente. Replicação regional respeita residência e custo.

### Evidência e aceite

A banca troca tag, adultera base, injeta secret/layer, usa principal errado, remove digest de rollback e simula finding. Aceite exige bytes identificados, pull mínimo, supply chain rastreável, scan tratado e recovery possível. Parsers/scans locais provam artifact; OCI registry/OKE reais provam IAM/admission. Sem sandbox, claims ficam Pending. Evidence bundle contém digest map, SBOM, scans, policy, audit, promotion report e cleanup.

### Decisão operacional de Container Registry e supply chain

A decisão sobre Container Registry e supply chain começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Container Registry e supply chain precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Container Registry e supply chain combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## OKE clusters e nodes

Oracle Kubernetes Engine adiciona control plane, node pools, CNI, admission, upgrades, quotas e identidade a aplicações containerizadas. Cluster criado não é workload seguro: namespaces, nodes, images, network, secrets, observabilidade e operação precisam contracts. A baseline declara versão, endpoint público/privado, compartments, node pools, shapes, autoscaling, add-ons, upgrade window, owners e SLO. A mutação cria node pool sem capacidade para recovery e incident drill falha. Kubernetes abstrai VMs, não elimina limites regionais.

### Control plane e acesso

Endpoint de API é privado ou protegido conforme risco, com IAM/Kubernetes RBAC separados e audit. A baseline restringe quem administra cluster, aplica MFA/federação e não distribui kubeconfig estático em CI. A mutação expõe API publicamente com grupo amplo e security corpus falha. Control plane version é pinada e upgrade avaliado. Logs/audit têm destino e retenção. Emergency access usa break-glass. Network ACL e RBAC complementam-se. Console status não substitui API reachability segura.

### Node pools e shapes

Node pool define image, shape, subnet, NSG, labels, taints, min/max e update strategy. A baseline separa workloads por risco e verifica architecture/digest compatibility. A mutação agenda workload crítico em pool spot/preemptible sem tolerância e availability gate acusa. Autoscaling de node respeita quota, IPs, pods e database capacity. Replacement draina pods e volumes. Node bootstrap possui provenance. Drift de image/add-ons é detectado. Capacity test acontece antes do deploy.

### Scheduling e isolamento

Requests/limits, affinity, anti-affinity, taints/tolerations e priority definem quem executa onde. A baseline impede vizinho ruidoso e réplica concentrada, testa eviction e resource pressure. A mutação omite memory limit e node OOM derruba outros pods; observer falha. Namespace não é fronteira completa de segurança. Pod security/admission e runtime policies complementam. Stateful workload tem volume/backup design. Scheduler success não prova readiness. HPA/VPA não substituem capacity planning.

### Upgrades e manutenção

Control plane, node image, Kubernetes version, CNI e add-ons mudam em ritmos diferentes. A baseline mantém matriz de compatibilidade, canary pool, surge/drain, rollback e janela. A mutação atualiza todos nodes e API incompatível interrompe serviço; gate detecta. Deprecated APIs são encontradas antes. PodDisruptionBudget protege disponibilidade, mas não corrige app sem múltiplas réplicas. Upgrade preserva observabilidade e policies. Emergency CVE path tem audit. Backup de manifests não é backup de dados.

### Observação e recuperação

Métricas incluem nodes ready, pod restarts, scheduling latency, resource pressure, API errors e custos. A baseline correlaciona cluster/pool/release e testa loss de node/pool. A mutação perde node com outbox worker e efeito não pode duplicar; idempotency observer confirma. Restore reconstrói cluster/policy/image e dados a partir de IaC/backups. Etcd/control plane é gerenciado, mas application configuration ainda precisa recovery. Incident bloqueia deployments. Cleanup remove namespace/resources sintéticos.

### Evidência e aceite

A banca testa API ampla, node sem headroom, architecture mismatch, OOM, upgrade incompatível, loss de pool e restore. Aceite exige control plane protegido, workload isolado, capacity, rollout e recovery. Manifests locais provam desenho; OKE real prova scheduler/upgrade. Sem sandbox, claims ficam Pending. Evidence bundle contém cluster spec, node plans, policies, metrics, game-day timeline, observer e cleanup.

### Decisão operacional de OKE clusters e nodes

A decisão sobre OKE clusters e nodes começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de OKE clusters e nodes precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de OKE clusters e nodes combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Kubernetes network e workload identity

Kubernetes adiciona namespace, service account, pod, CNI, ingress e network policy sobre VCN/NSG/IAM. Erro comum é assumir que namespace ou service account basta para isolar tráfego e acesso Oracle. A baseline liga workload a identity mínima, namespace, labels, network policy, egress, secrets e audit. A mutação permite pod de preview acessar bucket Production por dynamic group ampla; matrix deve bloquear. CNI route e policy de aplicação são parte da prova.

### Service accounts e IAM

Service account identifica workload Kubernetes, mas integração com OCI IAM precisa mapping explícito e policy mínima. A baseline separa account de deploy, runtime, job e observability, evitando token default. A mutação monta token privilegiado em todos pods e admission/policy falha. Rotação/revoke considera tokens já emitidos. Pod não usa key humana. Namespace/name labels não são confiados sem admission. Audit associa principal OCI e pod/release sem registrar secret. Break-glass não vira account permanente.

### Network policies e NSGs

NetworkPolicy controla tráfego de pods quando CNI/enforcement suporta; NSG controla VNIC/recurso na camada OCI. A baseline aplica ambos conforme boundary e testa ingress/egress positivo/negativo. A mutação cria policy mas CNI não a enforce e port probe encontra caminho; claim é corrigida. DNS, kube-system, metrics e image pull são dependências explicitadas. Egress externo passa por gateway/allowlist. Policy default-deny tem rollout cuidadoso. HostNetwork é exceção auditada.

### Secrets e configuração

Kubernetes Secret é mecanismo de distribuição, não vault automático. A baseline usa integração segura/referências, RBAC mínimo, encryption, rotação e evita secret em ConfigMap, manifest ou log. A mutação expõe value via describe/debug e canary acusa. Pod recebe somente secret necessário. Init container não copia para volume compartilhado sem proteção. Backup de etcd/manifests é classificado. Secret update tem consumer/restart behavior observado. Preview não recebe Production value.

### Ingress e service mesh

Ingress/load balancer expõe rotas; service mesh pode oferecer mTLS/telemetry, mas aumenta controle operacional. A baseline define TLS termination, host/path, auth, rate limits, identity e observabilidade. A mutação cria ingress sem WAF/headers ou service público para admin e corpus falha. Internal service não é seguro apenas por ClusterIP se pod comprometido pode alcançá-lo. Mesh policy é testada por certificate/identity, não slogan. Canary e rollback preservam route. Logs redigem headers.

### Multi-tenancy e containers

Tenant lógico é reforçado em application/database e, quando necessário, namespace/node isolation; rede por si só não decide tenant. A baseline testa cross-tenant request, storage, queue e cache. A mutação usa namespace como único predicate e observer encontra leak. ResourceQuota/LimitRange impedem noisy neighbor, mas não authorization. Pod security impede capabilities perigosas. Runtime image provenance reduz compromise. Support access é limitado. Incident containment pode isolar namespace sem destruir evidence.

### Evidência e aceite

A banca testa default token, dynamic group ampla, policy não enforced, egress redirect, secret canary, ingress admin e leak tenant. Aceite exige identity mínima, caminhos previstos, secret protegido, auth em camadas e observação. Manifest/linter prova intenção; OKE/CNI/OCI reais provam enforcement. Sem sandbox, claims ficam Pending. Evidence bundle contém mappings, policies, probes, audit, secret scan, findings e cleanup.

### Decisão operacional de Kubernetes network e workload identity

A decisão sobre Kubernetes network e workload identity começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Kubernetes network e workload identity precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Kubernetes network e workload identity combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Functions e eventos

OCI Functions e eventos executam trabalho sob timeout, concorrência, retries e integrações; serverless não remove efeitos duplicados, segredo, rede ou observability. A baseline define function image/digest, identity, memory, timeout, concurrency, trigger, idempotency, DLQ, owner e SLO. A mutação recebe evento duas vezes depois de timeout e chama provider duas vezes; outbox/dedupe observer precisa falhar. Response de trigger não prova processamento concluído.

### Runtime e configuração

Function usa imagem/artifact versionado, environment schema, secret references e subnet/NSG quando aplicável. A baseline limita memory/duration, valida input e não usa state global como autoridade. A mutação depende de cache local para última vaga e concorrência expõe erro. Cold start, initialization e dependencies são medidos. Runtime identity é dynamic group mínima. Logs redigem event/body. Deploy candidate é testado por digest. Rollback escolhe imagem aprovada.

### Triggers e envelopes

Events, API Gateway, queue, object notification ou cron possuem envelopes, assinatura, version, source e retry semantics próprios. A baseline valida schema/origin, registra event ID/correlation e rejeita desconhecido de forma observável. A mutação altera source ou reenvia mensagem e function não deve aceitar/duplicar. Trigger ordering não é presumida. Event payload minimiza PII. Cron tem timezone, overlap e catch-up deliberados. Endpoint público possui auth/rate limit. Dead letter preserva motivo redigido.

### Idempotência e efeitos

Function persiste decisão/idempotency com efeito de negócio antes de acknowledgement. A baseline usa transaction/outbox ou store autoritativo e consulta outcome após timeout. A mutação gera nova key no retry e provider receipt duplica. Ack vem depois de estado durável. Effect externalizado tem event ID, dedupe e reconciliation. Concurrency limit não é garantia de exactly-once. Queue visibility/retry estão no contrato. Observer compara row, event e provider. Cleanup não apaga receipts.

### Timeout e cancelamento

Deadline de request é propagada a database/provider, mas cancelamento não desfaz commit já feito. A baseline diferencia timeout de client, platform, dependency e execution termination. A mutação continua side effect após abort e logs/observer detectam. Payload/body têm limites e parsing seguro. Streaming não expõe segredo antes de auth. Retry é classificado por método/outcome. Memory/CPU budget previne overload. Unknown é estado explícito. Metrics medem duration/cold/error.

### Operação e recovery

Alarmes cobrem errors, throttles, concurrency, lag, DLQ e effects; runbook inclui pause trigger, revoke identity, retry/replay e restore. A baseline ensaia worker crash, provider outage, poison event e region failure. A mutação limpa DLQ para normalizar dashboard e evidence gate falha. Replay requer approval e atual identity. Function version/alias routing é auditado. Cost de invocations/egress entra no budget. Incident preserva logs e event samples redigidos.

### Evidência e aceite

A banca testa event duplicado, assinatura inválida, timeout pós-commit, poison, concurrency, secret exposure e replay. Aceite exige input validado, um efeito, timeout classificado, DLQ recuperável e observability. Fakes locais provam state machine; OCI Functions/events/provider reais provam delivery/limits. Sem sandbox, claims ficam Pending. Evidence bundle contém specs, digests, timelines, observer, metrics, DLQ receipts e cleanup.

### Decisão operacional de Functions e eventos

A decisão sobre Functions e eventos começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Functions e eventos precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Functions e eventos combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
