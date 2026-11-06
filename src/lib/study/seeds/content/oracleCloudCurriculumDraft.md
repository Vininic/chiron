# Oracle Cloud — currículo de trabalho não materializado

Este rascunho organiza uma futura apostila completa de Oracle Cloud. Não é importado pelo seed e não declara validação de console, tenancy, billing ou recursos remotos.

## 1. Tenancy, regiões e governança

1. Tenancy, compartments e ownership — fronteiras administrativas, lifecycle e inventário.
2. Regiões, availability domains e fault domains — residência, capacidade e failure domains.
3. Tags, cost tracking e policies organizacionais — atribuição e prevenção de recursos órfãos.
4. Landing zone e baseline do Quíron — manifest, guardrails e source of truth.

## 2. IAM e identidade

1. Users, groups e least privilege — concessão mínima e recertificação.
2. Policies e dynamic groups — linguagem de policy, scopes e workload identity.
3. Federation, MFA e break-glass — SSO, sessão e recuperação controlada.
4. API keys, auth tokens e revoke — ciclo de credencial e auditoria.

## 3. Rede e conectividade

1. VCN, subnets e route tables — endereço, segmentação e destino explícito.
2. Security lists, NSGs e microsegmentação — ingress/egress e mutantes de exposição.
3. Gateways e DNS — internet, NAT, service gateway, private DNS e resolução.
4. VPN, FastConnect e desenho híbrido — rotas, BGP, criptografia e failure.

## 4. Compute e imagens

1. Shapes, capacity e placement — CPU, memória, quotas e seleção de domínio.
2. Images, cloud-init e bootstrap seguro — provenance, metadata e repetibilidade.
3. Instance pools, autoscaling e health — escala, drain e capacity budget.
4. Patching, bastion e acesso operacional — manutenção, console e menor privilégio.

## 5. Storage e dados

1. Block volumes e backups — performance, attachment, snapshot e restore.
2. Object Storage e lifecycle — namespaces, buckets, versioning, encryption e retention.
3. File Storage e compartilhamento — export, identidade, throughput e backup.
4. Data transfer e integridade — checksum, replication, egress e recovery.

## 6. Bancos e consistência

1. Autonomous Database e conexão — wallets, pooling, roles e secrets.
2. Oracle Database service e operações — HA, patches, backup e Data Guard.
3. Transactions, última vaga e idempotência — constraints, outbox e observer.
4. Migration, restore e residência — compatibilidade, RPO/RTO e reconciliação.

## 7. Containers e serverless

1. Container Registry e supply chain — repositories, digests, scanning e retention.
2. OKE clusters e nodes — control plane, node pools, upgrades e quotas.
3. Kubernetes network e workload identity — CNI, policies, secrets e egress.
4. Functions e eventos — timeout, concurrency, retries, observability e effects.

## 8. Load balancing, edge e entrega

1. Load balancers e health checks — listeners, backends, drain e TLS.
2. API Gateway e autenticação — routes, throttling, JWT e contract.
3. WAF, DDoS e bot controls — regras, false positives e incident response.
4. CDN, cache e domains — cache key, origin protection, certificates e rollback.

## 9. Observabilidade e segurança

1. Logging, audit e retention — streams, redaction, cadeia de custódia e acesso.
2. Metrics, alarms e SLO — SLIs, burn rate, notifications e synthetic.
3. Cloud Guard, Vulnerability Scanning e Security Zones — detections e remediation.
4. Incident, revoke e recovery — containment, evidence, rotation e restore.

## 10. IaC, CI/CD e mudanças

1. Terraform e Resource Manager — state, plans, drift, modules e approvals.
2. DevOps pipelines e artifacts — identity, provenance, build once e promotion.
3. Change management e policy as code — reviews, environments, exceptions e audit.
4. Rollback coordenado — compute, data, network, DNS, secrets e effects.

## 11. Custos, quotas e operação

1. Billing, budgets e forecasts — tags, alerts, anomaly e attribution.
2. Quotas, limits e capacity planning — regional capacity, service limits e headroom.
3. Disaster recovery e game days — topology, RTO/RPO, drills e communication.
4. Runbooks, support e operação diária — ownership, escalation, cleanup e reviews.

## 12. Projeto Quíron na Oracle Cloud

1. Baseline Quíron e landing zone — compartments, IAM, VCN, manifests e budgets.
2. Reserva concorrente e dados autoritativos — Functions/O​​KE, database, outbox e observer.
3. Release segura e jornada externa — registry, pipeline, load balancer, WAF, DNS e canary.
4. Banca de incidente e restore — leaked key, drift, failover, reconciliation e evidence.
