# Oracle Cloud — Compute e imagens — rascunho não materializado

## Shapes, capacity e placement

Compute shape define CPU, memória, rede, storage local e limites; placement decide região, availability domain, fault domain e capacidade disponível. Escolher pelo menor preço ou maior número de OCPUs sem carga, recovery e quota produz incidente atrasado. A baseline declara workload, SLO, perfil de CPU/memória, arquitetura, imagem, região, headroom e owner. A mutação promove shape incompatível com arquitetura da imagem e boot ou dependency falha. Console mostrando instance running não prova que ela atende performance, segurança ou disponibilidade.

### Perfis e limites

Shape flexível permite configurar OCPUs/memória dentro de faixa, mas a aplicação precisa ser medida para p95, GC, threads e connection pools. A baseline usa carga representativa, cold/warm e budget de custo. A mutação reduz memória e crasha sob pico; observer registra OOM, restart e efeito. CPU alta não corrige latência de banco ou lock. Bare metal, VM e GPU possuem lifecycle/isolamento diferentes. Quota e service limit são verificados antes de rollouts. Dimensionamento deve deixar margem para failover e manutenção.

### Arquitetura e compatibilidade

Arm e x86 podem ter preço/desempenho e binários distintos. A baseline fixa architecture em image manifest, dependencies nativas e pipeline, testando import, startup e workload real. A mutação publica container x86 em node Arm e scheduler/image pull falha. Multi-arch artifact tem digest por plataforma e provenance. Kernel, driver e extension são avaliados. Emulation de desenvolvimento não aprova produção. Upgrade de shape/architecture possui canary, rollback e comparação de output, não somente benchmark sintético.

### Placement e anti-affinity

Instâncias independentes são distribuídas por fault/availability domains conforme requisito; réplicas no mesmo domínio não formam HA. A baseline declara anti-affinity e valida placement observado. A mutação cria autoscaling que escolhe sempre o mesmo fault domain e game day revela concentração. Serviços stateful precisam replicação/backup além de compute. Region de dados define placement de writer. Replacement preserva tags, NSGs, volumes, identity e logs. Autoheal não é aprovação se cria recurso com configuração parcial.

### Capacity e recuperação

Capacidade pode faltar justamente em incidente regional ou scaling rápido. A baseline mede headroom, reserva estratégias compatíveis e testa criação de candidate antes do evento. A mutação depende de shape escassa e failover não consegue iniciar; report transforma em risco explícito. Autoscaling tem mínimo, máximo, cooldown, métrica e budget. Quota raise possui lead time/owner. Recursos parados ainda podem consumir compromissos. Capacity planning considera backups, batch e maintenance, não só tráfego médio.

### Custos e observabilidade

Métricas incluem CPU, memória, disco, network, queue depth, startup, error e custo por unidade de trabalho. A baseline correlaciona com shape, image digest, release e região. A mutação cresce pool para mascarar leak de memory e custo/availability gates falham. Alertas não usam apenas CPU média. Labels de instance têm cardinalidade controlada. Billing atrasa; application counters complementam. Rightsizing só é aprovado se correctness, latency e recovery não pioram. Preview tem TTL e shapes menores com exceção documentada.

### Evidência e aceite

A banca testa shape insuficiente, architecture mismatch, placement concentrado, quota baixa, cold start e autoscaling abusivo. Aceite exige perfil medido, placement correto, capacity para recovery e custo dentro de budget. Benchmarks locais provam parte; OCI real prova disponibilidade e métricas. Sem tenancy, claims ficam Pending. Evidence bundle contém manifest, benchmark, topology, capacity report, metrics, mutation results e cleanup.

O benchmark é repetido após alteração de runtime, imagem ou library nativa, pois a mesma shape pode apresentar perfil diferente. Resultados trazem carga, duração, dataset sintético, região e versão do artifact, evitando conclusões a partir de uma amostra isolada de console.

### Decisão operacional de Shapes, capacity e placement

A decisão sobre Shapes, capacity e placement começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Shapes, capacity e placement precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Shapes, capacity e placement combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Images, cloud-init e bootstrap seguro

Image determina sistema, patches, agentes, chaves e superfície inicial de uma instance. Cloud-init e bootstrap executam código privilegiado cedo, frequentemente com acesso a metadata, rede e secrets; por isso não são scripts auxiliares sem governança. A baseline usa imagem de origem identificada, digest/version, hardening, SBOM, scan, owner e processo de atualização. A mutação baixa script por URL mutável no boot e supply-chain gate falha. Uma instance que responde SSH não prova que configurou o serviço correto.

### Provenance e hardening

Imagem oficial, custom image ou marketplace image tem publisher, versão, região, data e critérios de aprovação. A baseline registra digest/OCID, baseline de patch, pacotes, users, serviços, firewall e agentes. A mutação usa latest implícito e rebuild muda bytes; reproducibility report acusa. Hardening remove contas/serviços desnecessários, aplica atualização e configura logs sem quebrar operação. Scanner de CVE tem triage, não simples contagem. Image não inclui secrets de ambiente. Golden image passa por teste e expiry.

### Cloud-init determinístico

User-data é versionado, pequeno, idempotente e dividido em bootstrap, configuração e aplicação. A baseline valida schema, assinatura/digest, logs redigidos e exit status. A mutação repete boot e cria usuário, volume ou efeito duplicado; idempotency test falha. Download de artifact usa URL/digest fixo e TLS; script não executa pipe de rede para shell. Falha de bootstrap impede entrada em pool. Timeout e retry são limitados. Metadata não vira input irrestrito de código.

### Metadata e identidade

Instance metadata oferece informações e, em alguns serviços, credenciais/identidade; acesso indevido pode escalar privilégio. A baseline limita listeners, valida origens e não encaminha requests do cliente ao metadata endpoint. A mutação explora SSRF em app e recebe metadata; security test precisa bloquear. Cloud-init usa workload identity mínima, não key de admin. IMDS headers/versões seguem configuração suportada. Logs não despejam metadata completa. Network policy e aplicação trabalham juntas.

### Segredos e configuração

Bootstrap recebe referências curtas a secret manager ou identity, busca somente o necessário e evita gravar values em disco, command line ou logs. A baseline classifica variável e atualiza consumer por rotação controlada. A mutação coloca token no user-data e scanner encontra em instance template/image. Config pública é versionada; privada é injetada no runtime. Backup de volume não deve conter segredo acidentalmente. Support usa diagnose redigido. Erro de secret gera falha clara, não fallback inseguro.

### Patching e replacement

Patching pode ocorrer in-place ou via image replacement; ambos exigem janela, compatibility, canary e rollback. A baseline prefere rollout imutável para mudanças de base quando apropriado, draina connections e verifica health/effects antes de remover antigo. A mutação aplica kernel patch e reinicia todas as réplicas simultaneamente; availability gate falha. CVE urgente tem fluxo de emergência com audit. Image antiga recebe retention suficiente para rollback, mas não perpetua vulnerabilidade conhecida. Drift de instance é medido.

### Evidência e aceite

A banca testa image mutável, script repetido, bootstrap interrompido, SSRF de metadata, secret em log e patch simultâneo. Aceite exige provenance, boot idempotente, identidade mínima, zero secret e rollout seguro. Linters/scans provam artifact; OCI boot e metadata reais provam runtime. Sem sandbox, claims ficam Pending. Evidence bundle contém image manifest, SBOM, scripts, scan, boot reports, probes, rollout timeline e cleanup.

A prova inclui ainda o comportamento de uma instance substituída a partir da mesma imagem: ela deve registrar configuração esperada, obter somente a identidade declarada e falhar de modo seguro quando dependência ou secret estiver indisponível. Esse caso encontra bootstrap dependente de estado local residual.

### Decisão operacional de Images, cloud-init e bootstrap seguro

A decisão sobre Images, cloud-init e bootstrap seguro começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Images, cloud-init e bootstrap seguro precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Images, cloud-init e bootstrap seguro combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Instance pools, autoscaling e health

Instance pool fornece grupo de VMs com configuração comum; autoscaling ajusta cardinalidade segundo métrica. O mecanismo só é seguro se health, drain, state, capacity, custo e limites downstream forem desenhados antes. A baseline declara template digest, mínimo/máximo, métricas, cooldown, placement, readiness, termination e owner. A mutação escala com CPU mas database já está saturado; pool amplia a falha. Número de instâncias não é SLO, e health HTTP simples não prova readiness ou efeito correto.

### Template e rollout

Pool template referencia image, shape, subnets, NSGs, volumes, tags, cloud-init e identity por versões. A baseline compara instance observada ao template e bloqueia drift. A mutação atualiza pool com user-data diferente de candidate testado; digest gate falha. Rollout usa surge/unavailable limits, canary e pause. Instance velha é drenada antes de delete. Template não contém secret values. Mudança de rede/identity recebe test negativo. Recreate automático não esconde boot failures repetidas.

### Health e readiness

Health check distingue processo vivo, dependências prontas e capacidade de receber tráfego. A baseline define endpoint, timeout, interval, threshold, auth e resposta sem PII. A mutação marca healthy antes de migration/config carregar e load balancer envia requests que falham. Liveness não reinicia por dependency temporária; readiness pode tirar tráfego. Check protegido contra abuso. Startup duration entra em autoscaling. Health failure preserva logs e instance para diagnóstico conforme policy, não apaga tudo imediatamente.

### Métricas e scaling

Escala usa sinal correlacionado a demanda e gargalo, como queue age, requests em voo ou latency, não só CPU média. A baseline fixa target, janela, cooldown, step, min/max e budget. A mutação gera burst curto e cooldown insuficiente oscila; test mede flapping. Scale out respeita database connections, egress e quotas; scale in respeita drain, jobs e cache. Métrica ausente é Unknown, não zero. Alarmes acompanham desired versus actual. Override tem expiry.

### Drain e state

Antes de retirar instance, pool remove do load balancer, espera requests, cancela trabalho de forma cooperativa e transfere estado permitido. A baseline usa deadline e observer de effects. A mutação termina Function/job após commit mas antes de response e retry duplica ação; idempotency/outbox controla. Sessão não fica só em memória. Upload/stream recebe estratégia. Shutdown hook não é garantia absoluta, portanto estado crítico já está durável. Draining falho abre incident/rollback.

### Capacity e custos

Autoscaling não cria shape se região não possui capacidade. A baseline testa headroom, budget e fallback planejado. A mutação aumenta máximo sem quota e recebe erro no pico; alert aponta antes. Preview/pools temporários expiram. Instâncias idle podem ser necessárias para SLO, e essa decisão é documentada. Custo por request é comparado durante changes. Loop de health/scaling recebe circuit. Billing e métricas de pool são reconciliadas. Janitor não remove instância em drain ativo.

### Evidência e aceite

A banca injeta template drift, readiness falsa, burst, flapping, database saturation, termination e quota baixa. Aceite exige template correto, tráfego apenas a ready instances, escala bounded, effects únicos e recovery. Simulação local prova algoritmo; OCI pool/LB provam comportamento. Sem sandbox, claims ficam Pending. Evidence bundle contém template, health corpus, metrics, timeline, capacity/cost report, observers e cleanup.

Após o teste, a equipe compara desired capacity, instances criadas, tráfego efetivo e custos para garantir que um alarme ou autoscaler não tenha deixado recursos órfãos. A decisão de scale-in é exercitada sob request lento e job pendente, preservando receipt de drain e qualquer efeito recuperado.

### Decisão operacional de Instance pools, autoscaling e health

A decisão sobre Instance pools, autoscaling e health começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Instance pools, autoscaling e health precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Instance pools, autoscaling e health combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Patching, bastion e acesso operacional

Operação de compute precisa de acesso suficiente para diagnosticar e recuperar, mas acesso amplo e permanente transforma todo host em ponto de comprometimento. Patching, Bastion, console connections, SSH, session recording e break-glass pertencem ao mesmo desenho de identidade, rede e auditoria. A baseline define owner, principal, origem, duração, comandos permitidos, patch cadence, rollback e evidence. A mutação abre SSH público para responder incidente e policy deve bloquear. Automação de patch sem janela ou health pode derrubar serviço saudável.

### Bastion e sessões

Bastion oferece acesso temporário a recursos privados com identity e sessão controladas. A baseline limita target, subnet, user, TTL e source, exige MFA/federação e registra uso. A mutação reutiliza sessão ou target fora do compartment e authorization test falha. Bastion não substitui patching nem application logs. SSH keys são efêmeras quando suportado e não vivem em image. Session output é tratado como dado sensível. Break-glass recebe fluxo distinto e pós-review.

### Console e recuperação

Serial console ajuda quando rede/SSH falha, mas pode expor boot logs, user-data e secretos acidentais. A baseline restringe acesso, registra audit, usa procedimentos redigidos e revoga após incidente. A mutação habilita console a grupo amplo e recertificação acusa. Ação de console pode alterar estado fora de IaC e precisa ser reconciliada. Backup e snapshot precedem correção destrutiva. Recovery não copia dados sem classificação. Ferramenta de suporte não usa credencial pessoal persistente.

### Estratégia de patch

Patches de OS, kernel, agentes, runtimes e bibliotecas possuem cadência, criticidade, teste, canary e rollback. A baseline mantém inventário de versões, CVEs, janela e compliance. A mutação reinicia todas as instâncias simultaneamente e SLO falha. Rolling replacement prefere imagem testada, mas patch in-place pode ser necessário; ambos têm health gates. CVE crítico pode usar emergency path auditado. Exceção tem compensação e expiry. Atualização de agente de monitoramento também é mudança de supply chain.

### Orquestração e compatibilidade

Patch coordena load balancer drain, pool rollout, database connection, jobs e aplicações stateful. A baseline testa old/new protocol e schema antes da remoção. A mutação aplica TLS library nova e cliente interno quebra; contract canary detecta. Reboot duration e capacity entram no plano. Rollback não revive pacote vulnerável sem decisão explícita. Configuration management verifica state após reboot. Workload de última vaga continua sob concorrência durante canary. Logs preservam resultado por node sem segredos.

### Vulnerabilidades e findings

Scanner identifica versão/finding; triage avalia exploitability, exposição, compensação, owner e SLA. A baseline não fecha finding só porque pacote foi atualizado no template se instances antigas continuam. A mutação silencia scanner sem corrigir runtime e reconciliation aponta drift. WAF/NSG reduzem risco, mas não substituem patch. Finding de image, host, container e dependency é correlacionado. Evidence inclui versão antes/depois e teste funcional. False positive é documentado e revisado.

### Incidente e acesso de fornecedor

Fornecedor ou suporte pode precisar acesso extraordinário; a baseline usa caso, owner, escopo, NDA/policy, sessão limitada e audit. A mutação compartilha key de administrador por chat e secret process falha. Incidente preserva logs e snapshots antes de changes. Contenção pode isolar host sem apagar disco. Aftercare rotaciona keys e revisa Bastion grants. Comunicação separa fatos e ações. Custos de access/patch emergencial entram no postmortem.

### Evidência e aceite

A banca testa SSH público, sessão vencida, console amplo, patch em todas réplicas, incompatibilidade, scanner silenciado e suporte sem revoke. Aceite exige acesso mínimo temporário, patch seguro, findings rastreáveis e recovery observada. Scripts locais provam runbook; OCI/Bastion/host reais provam sessões e patch. Sem sandbox, claims ficam Pending. Evidence bundle contém inventory, patch plan, sessions redigidas, scan/triage, canary, audit e cleanup.

O período pós-patch inclui leitura de erros, latência e violações de SLO, pois uma atualização pode manter health superficial e degradar a jornada. Findings fecham somente após verificar template, instances existentes e artifacts de recovery; nenhuma exceção de manutenção é mantida sem nova aprovação e data de expiração.

### Decisão operacional de Patching, bastion e acesso operacional

A decisão sobre Patching, bastion e acesso operacional começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Patching, bastion e acesso operacional precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Patching, bastion e acesso operacional combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
