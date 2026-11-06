# Oracle Cloud — IaC, CI/CD e mudanças — rascunho não materializado

## Terraform e Resource Manager

Terraform e Resource Manager transformam infraestrutura em artefatos versionados, mas state, provider, plan e apply são dados de controle sensíveis. IaC não é seguro apenas porque está no Git: um provider com credencial ampla ou state exposto pode alterar a tenancy inteira. A baseline fixa versões, backend/lock, identity, tenancy/region/compartment esperados, modules, inputs, plan digest, approval e drift policy. A mutação aplica plan aprovado em outro compartment e preflight bloqueia. Apply terminado não prova que data plane corresponde ao desenho.

### State e locking

State mapeia recursos a IDs e pode conter endpoints, metadata e valores sensíveis. A baseline protege backend por encryption, IAM mínimo, versioning, lock e retention, evitando state local compartilhado. A mutação roda dois applies concorrentes e um sobrescreve mudança; lock/receipt falha. Import de recurso existente passa por inventário e approval. Delete do state não deleta recurso e não é recovery. Backup de state tem restore drill. Access audit é obrigatório. Outputs secretos são evitados/redigidos.

### Modules e providers

Module encapsula padrões de VCN, IAM, compute e storage; provider define API/semântica. A baseline pina versão/digest, revisa source, inputs e outputs e testa módulo em sandbox. A mutação usa module remoto mutable e resolve bytes diferentes; provenance gate acusa. Module não concede privilégio por si; workload identity é separada. Variables possuem schema e referências de secret. Defaults perigosos são recusados. Registry/lock de provider são supply chain. Change de provider reinicia testes de plan.

### Plan, policy e approval

Plan mostra intenção antes de effect, mas pode ficar stale se estado mudar. A baseline liga plan a commit, provider version, environment, timestamp e resource targets; policy-as-code avalia create/update/delete. A mutação altera route/NSG depois do plan e apply recomputa ou bloqueia. Approval expira ao mudar plan. Destruição exige proteção adicional. Policy testa allow/deny e não depende de comentário. Break-glass tem audit. Preview plan nunca recebe Production secret.

### Drift e reconciliação

Console, incident response e serviços gerenciados podem criar drift. A baseline compara desired/observed em agenda, classifica mudança deliberada ou risco e evita auto-remover recurso crítico sem review. A mutação abre rule pública no console e diff encontra. State refresh não é remediação. Drift de policy, tag, key, route e identity tem owner. Reconciliation gera ticket e evidence. Recursos órfãos entram no inventário/custo. Audit correlaciona mudança.

### Rollback e recovery

Rollback de IaC pode destruir recurso novo ou restaurar configuração insegura. A baseline planeja forward fix, reversão controlada e backup de dados antes de mudanças irreversíveis. A mutação remove subnet com database dependente e plan policy bloqueia. Apply parcial é investigado por estado/API, não repetido cegamente. Restore de state não restaura dados. Runbook inclui locks, principal e destino. Artifact de plan é retido. Teste de recovery usa sandbox.

### Evidência e aceite

A banca testa state exposto, apply concorrente, module mutable, plan stale, console drift e destroy. Aceite exige state protegido, artefato pinado, policy, approval fresca, drift observado e recovery seguro. Linters/plan locais provam estrutura; OCI Resource Manager real prova effect. Sem sandbox, claims ficam Pending. Evidence bundle contém locks, versions, plans, policy reports, diffs, audit e cleanup.

### Decisão operacional de Terraform e Resource Manager

A decisão sobre Terraform e Resource Manager começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Terraform e Resource Manager precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Terraform e Resource Manager combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## DevOps pipelines e artifacts

Pipeline cria, testa, publica e promove artifacts; se rebuild em Production ou token amplo mudar bytes/destino, a aprovação perde sentido. A baseline separa build, test, artifact registry, deploy e promote, com identity mínima, source SHA, lockfile, artifact digest, config digest, approvals e observers. A mutação testa artifact A e promove B; chain-of-custody falha. Pipeline verde não prova que Function, cluster ou database effect funciona na superfície remota.

### Identidade e destinos

Pipeline usa dynamic group/service principal limitado a compartment/environment e não credencial humana. A baseline compara OCIDs esperados antes de deploy e não libera secrets a builds de fork. A mutação aponta variável para tenancy errada e destination gate bloqueia. Jobs possuem permissions explícitas, logs redigidos e expiry. Deploy de preview não promove Production. Identity rotate/revoke é testada. Runner é boundary hostil. Output possui release ID sem token.

### Build once e registry

Build gera image/package por digest, SBOM e attestation; testes executam o mesmo bytes que deploy. A baseline bloqueia tags mutáveis e registra materiais/toolchain. A mutação recompila com dependency nova durante promote e digest mismatch falha. Artifact registry tem retention para rollback, ACL e audit. Config de runtime é separada do artifact, mas tem digest/reference. Upload parcial não é candidato pronto. Candidate URL/namespace é imutável. Cache não mistura trust levels.

### Gates e approvals

Checks cobrem type, contracts, scan, canary, performance, policy e migration conforme change. A baseline liga resultados a source/artifact/config/environment e invalida approval por redeploy ou tempo. A mutação aprova SHA A e deploya SHA B; gate acusa. Override tem reason, principal, expiry e post-review. Flake não vira success. Resultado Unknown bloqueia. Dados sintéticos/provedores fake protegem preview. Relatório aponta expected/actual sem segredo. Branch, environment e policy se complementam.

### Promotion e observação

Promote move artifact testado para target sem build novo, faz canary, mede release/região/effects e aborta por threshold. A baseline usa rollout gradual e compara baseline. A mutação agrega métricas e oculta regressão; dimensions mantêm sinal. Alias/routing, database schema, config e queues participam. Post-promotion synthetic confirma caminho externo. Cache propagation é observada. Rollback seleciona artifact compatível. Manual deploy segue gates. Approval final referencia evidence.

### Falhas e recuperação

Falha de upload/deploy/promotion pode deixar state desconhecido. A baseline consulta APIs/observers antes de retry, preserva candidate e limpa temporários com segurança. A mutação perde conexão após deploy e retry altera alias errado; idempotency/state check evita. Pipeline pause contém incidente. Credential comprometida é revogada antes de recovery. Artifacts suspeitos são quarantined. Runbook possui owner. Audit junta job, principal e resource. Cleanup não remove evidence.

### Evidência e aceite

A banca troca destino, artifact, config e approval; injeta secret, flake, candidate regressivo e upload interrompido. Aceite exige identidade mínima, digest contínuo, gates relevantes, promoção observada e rollback. Scripts locais provam chain; OCI DevOps/registry reais provam enforcement. Sem sandbox, claims ficam Pending. Evidence bundle contém runs, digests, approvals, canary, metrics, audit e cleanup.

### Decisão operacional de DevOps pipelines e artifacts

A decisão sobre DevOps pipelines e artifacts começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de DevOps pipelines e artifacts precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de DevOps pipelines e artifacts combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Change management e policy as code

Mudança segura combina intenção revisada, impacto, janela, teste, approval, observação, rollback e audit. Policy as code evita depender de memória humana, mas regra mal escrita pode bloquear recovery ou permitir exceção ampla. A baseline classifica mudança por risco, associa owner, resources, dados, SLO, plan, gates e comunicação. A mutação usa change pequena para abrir NSG público e classifier/policy falha. Ticket não substitui estado efetivo.

### Classificação e risco

Change declara source, environment, recursos, dependências, impacto em dados/rede/identity/custo e reversibilidade. A baseline aumenta gates conforme blast radius e obriga drill para risco alto. A mutação altera policy root como se fosse tag e approval insuficiente é recusada. Emergency possui caminho próprio, prazo e post-review. Múltiplas mudanças correlacionadas são agrupadas. Unknown dependency é risco explícito. Janela inclui propagation e monitoramento. Owner de negócio participa quando journey muda.

### Policies versionadas

Policy as code valida região, tags, IAM, NSG, encryption, public exposure, images, budgets e retention conforme catálogo. A baseline possui tests positivos/negativos e versões pinadas. A mutação muda expressão e policy deixa passar bucket público; mutation test falha. Regras têm exceção estruturada, owner/expiry e não comentários ignorados. Policy roda no plan e, quando possível, no admission/runtime. Drift da UI é reconciliado. Deny de recovery é ensaiado antes de incidente.

### Approval e segregação

Approver tem escopo adequado e approval referencia plan/artifact/config/version, expira quando input muda. A baseline separa autor, approver e operador nos riscos críticos. A mutação reutiliza approval antiga e gate acusa. Break-glass registra motivo, scope e monitor. Merge protection não autoriza apply sozinho. Change advisory não remove evidence técnica. Audit mostra decisão e action. Suporte externo recebe acesso curto e limitado. Conflito de interesse é tratado.

### Execução e observação

Runbook executa prechecks, apply/canary, probes, metrics e abort. A baseline registra timestamps/IDs e não considera comando com exit 0 como sucesso sem observer. A mutação cria recurso mas policy de data plane falha; contract detecta. Rollout gradual preserva rollback. Alertas de change têm owner. Config/secret changes são reconciliadas. DNS/cache têm janelas próprias. Comunicação não divulga valores ou detalhes exploráveis. Failure abre incidente, não bypass automático.

### Aprendizado e compliance

Depois da mudança, equipe compara resultado, custo, SLO e incidentes ao plano. A baseline cria action quando estimate diverge ou gatilho falha. A mutação fecha ticket sem probe e review reprova. Evidência segue retenção/classificação. Auditoria pode reproduzir plan, approval e estado sem acesso a secret. Métricas incluem lead time, change failure, rollback e exceptions. Otimização não reduz controle sem análise. Política é revisada após novas ameaças/serviços.

### Evidência e aceite

A banca testa classifier errado, policy bypass, approval stale, emergency sem expiry, data-plane failure e rollback. Aceite exige risco correto, policy efetiva, segregação, observação e aprendizado verificável. Documentos locais provam processo; OCI APIs provam enforcement. Sem sandbox, claims ficam Pending. Evidence bundle contém change record, plans, policies, approvals, probes, metrics, post-review e cleanup.

### Decisão operacional de Change management e policy as code

A decisão sobre Change management e policy as code começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Change management e policy as code precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Change management e policy as code combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Rollback coordenado

Rollback em cloud precisa reconciliar infraestrutura, artifact, configuração, rede, dados, DNS, cache, identidades e efeitos assíncronos. Mover traffic ou aplicar state antigo isoladamente pode ressuscitar key comprometida, remover asset necessário ou quebrar schema. A baseline mantém catálogo de releases/IaC plans recuperáveis, matriz de compatibilidade, owner, RTO/RPO, passos e critérios de abort. A mutação volta compute mas deixa worker novo faturando duas vezes; observer deve falhar.

### Seleção e contenção

Incidente coleta release, config, policy, schema, região, audit e impacto antes de escolher candidate. A baseline seleciona artifact/plan atestado e bloqueia deploy novo durante investigação. A mutação escolhe último verde sem checar advisory e provenance gate falha. Contenção pode retirar route, pausar queue, revogar identity e restringir egress. Action é auditada/expirável. Decision record separa facts/unknowns. Artefato antigo tem retention. Manual console change é reconciliada.

### Compatibilidade de dados

Expand-contract permite code old/new durante janela; migration irreversível requer forward fix ou restore isolado. A baseline testa matriz de schema/config/client e mede writes pendentes. A mutação aponta release antiga a coluna removida e canary falha. Backup restore tem owner/RPO/RTO e verifica grants. Outbox/provider effects são reconciliados por receipts. Queues aceitam versões de evento durante transição. Rollback não apaga evidence nem transactions para parecer limpo.

### Rede, DNS e cache

Routes, NSGs, LB, WAF, domains, DNS, TLS, CDN e service workers podem ter propagation diferente. A baseline define sequência, TTL, purge seletivo, asset retention e probes regionais. A mutação volta alias mas HTML cacheado referencia chunk removido; crawler falha. DNS não é alterado sem causa. Certificate e canonical continuam corretos. Origin protection permanece. Rollback observes old/new durante janela. Cache não serve resposta privada do candidate.

### Configuração e identidade

Secret references, flags, dynamic groups, policies e vault keys podem tornar release antigo inseguro. A baseline compara manifest before/after e nunca reativa credential comprometida só para restaurar serviço. A mutação restaura env file antigo e canary de secret bloqueia. Workload identity e integration grants são revogados/reconciliados. Config change possui schema/compatibility. Preview ensaia candidate de recovery com dados seguros. Audit confirma cada action. Drift report fecha após convergence.

### Verificação e pós-recovery

Canary de recovery exercita journey, security negatives, effects, SLO, cache e custo por release/região. A baseline abre tráfego gradualmente e aborta por threshold. A mutação encerra pelo dashboard verde e ignora última vaga; checklist reprova. Monitor reforçado dura janela definida. Comunicação registra state. Postmortem gera ações com owner/data e drill subsequente. Cleanup remove temporários só após approval. Unknown dependency mantém incidente aberto.

### Evidência e aceite

A banca simula artifact ruim, migration incompatível, key comprometida, asset ausente, DNS/cache stale e worker duplicador. Aceite exige seleção por provenance, compatibilidade, secrets seguros, convergence e effects reconciliados. Fakes provam modelo; OCI/data/provider reais provam operação. Sem sandbox, claims ficam Pending. Evidence bundle contém decision log, matrix, probes, restore/alias receipts, observers, monitor, postmortem e cleanup.

### Decisão operacional de Rollback coordenado

A decisão sobre Rollback coordenado começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Rollback coordenado precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Rollback coordenado combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
