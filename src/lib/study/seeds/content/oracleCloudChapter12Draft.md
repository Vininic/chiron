# Oracle Cloud — Projeto Quíron — rascunho não materializado

## Baseline Quíron e landing zone

Baseline Quíron transforma tenancy, compartments, IAM, VCN, tags, budgets, logs e IaC em contrato reproduzível. Ela liga cada recurso a source, owner, ambiente, região, dado e lifecycle, evitando que console ou máquina local se tornem fonte oculta. A baseline declara clone limpo, versões de tools/providers, manifests, plans e outputs redigidos. A mutação altera root/compartment/route fora do source e reconciliation deve detectar. Sem tenancy sandbox, os testes locais validam estrutura e oracles, não criação real.

### Manifest e ambiente

Manifest fixa OCIDs esperados, CIDRs, compartments, policies, tags, shapes, endpoints, budgets, route inventory e owners. Schema separa Preview/Production e valores públicos/referências secretas. A baseline recusa região ou tenancy divergente. A mutação conecta preview a database de Production e preflight bloqueia. IaC state é protegido. Source SHA, provider lock e plan digest entram no evidence. Change de console aparece como drift. Build não inclui wallet/key. Approval expira com novo plan.

### Rede e identidade

Quíron usa subnets/NSGs mínimos, endpoints privados, workload identities separadas e egress allowlisted. A baseline testa origem permitida/proibida e não usa IP/hostname como authorization. A mutação abre database, bucket ou metadata endpoint por rota ampla e corpus falha. Bastion é temporário/auditado. Dynamic group de runtime não concede deploy/admin. DNS/TLS/certificates são versionados por política. WAF/LB/Gateway compõem borda. Logs redigem. Ownership de cada boundary é explícito.

### Artefato e jornada

Pipeline produz artifact digest, SBOM, config reference e candidate; contract percorre página/API/headers/auth sintética/última vaga/cleanup. A baseline testa URL candidata, não alias flutuante. A mutação promove bytes/config diferentes e chain gate falha. Observers conferem database row, outbox e provider fake. Canary mede release/região/freshness. Cache não guarda resposta privada. Cost/quotas possuem budget. Rollback tem matriz de schema/config/assets. O estado Pending é preservado onde OCI real não executou.

### Evidência e aceite

A banca altera manifest, policy, tag, artifact, config e route; injeta canary e disputa de estoque. Aceite exige source coerente, isolamento, artifact rastreável, uma reserva/effect e evidence redigida. Linters/fakes locais provam desenho; OCI real prova apply/edge/data plane. Sem sandbox, claims ficam Pending. Evidence bundle contém plans, digests, matrices, observers, reports, approval e cleanup.

### Critério de evolução

O baseline é revisado sempre que uma nova camada entra na arquitetura, pois recurso não inventariado não herda automaticamente tags, logs, budget ou policy. A baseline compara o catálogo a recursos observados e exige que o novo componente tenha owner, dados, identidade, rede, dependências e teste de recuperação antes de receber tráfego. A mutação adiciona integração de observabilidade e envia metadados a região não autorizada; classificação e egress gate falham. Assim, a apostila trata landing zone como produto contínuo, não projeto terminado na primeira criação.

### Reconciliação de drift

Reconciliação não deve reparar silenciosamente uma divergência. O job coleta inventário, identifica a versão desejada e abre uma diferença classificada: segura para corrigir automaticamente, dependente de aprovação ou incidente. Para cada mudança há antes/depois, executor, janela e probe negativo. Uma regra de rede que perdeu uma porta pode ser restaurada somente quando o plano provar que não ampliará exposição; uma policy removida de propósito exige decisão humana. O contrato é que toda correção deixa trilha e que a baseline continua capaz de explicar por que o estado voltou a ser aceito.

### Dependências externas

O desenho inclui serviços fora de OCI — DNS, e-mail, pagamento, monitoramento e repositório — no mesmo catálogo de risco. Cada dependência informa owner, credencial, limite, região, fallback e procedimento de revogação. A mutação troca um endpoint de webhook sem registrar a origem e o teste de egress descobre a comunicação antes da promoção. Isso evita a falsa sensação de que infraestrutura como código controla tudo: ela controla o que declara, enquanto inventário e observação revelam o restante.

### Revisão independente

Uma revisão de mudança compara source, plan, inventário e evidência por alguém que não executou o apply. O revisor tenta localizar um recurso por tag, encontrar sua policy e reproduzir o probe associado. Se não conseguir, o componente não está pronto para operar, mesmo que o console esteja verde. Essa separação torna erros de pressuposto visíveis e reduz o risco de aprovação baseada em familiaridade com a própria implementação.

## Reserva concorrente e dados autoritativos

Reserva concorrente usa banco autoritativo, transação, constraint, idempotency record e outbox; Function/O​​KE/LB são executores, não árbitros de estoque. A baseline cria item com uma vaga, tenant sintético, barrier de requests, fault injection e observer independente. A mutação faz duas execuções lerem disponibilidade e ambas inserirem reserva; acceptance exige uma row, um event e um effect. Timeout de HTTP não diz se commit ocorreu.

### Transação e key

Principal autorizado envia key por intenção; serviço valida tenant/payload, inicia transação curta e grava decision/idempotency/outbox atomically. A baseline escolhe lock, conditional update ou constraint e testa interleavings. A mutação muda key no retry e cria duplicata; contract falha. Saldo negativo é proibido. Timeout pós-commit consulta record. Connection pool tem limite. Read replica não decide disponibilidade final. Audit registra correlation, não segredo. Status/error é classificado por outcome conhecido.

### Worker e provider

Worker entrega outbox por event ID, assinatura/dedupe/receipt e DLQ. A baseline injeta crash, redelivery e provider timeout; reconciliation compara reservation, event e receipt. A mutação chama provider dentro da transação e repete cobrança; observer acusa. Ack ocorre após state durável. Replay requer approval e identidade atual. Egress/secret são restritos. Lag e duplicate viram métricas. Restore preserva ou reconcilia outbox. Cleanup não apaga evidence.

### Região e incidentes

Primary/fencing impedem dois writers durante failover; region metadata só é diagnóstico. A baseline testa partition, retry, revoke e restore, preservando RPO/RTO. A mutação usa lock em memória regional e falha. Contenção pode pausar consumer, mas não apagar eventos. Canary de recovery repete disputa. Dados sintéticos evitam impacto real. Logs redigem tenant. Communication separa facts. Backup drill valida grants/schema/effects. Cost de retries é bounded.

### Evidência e aceite

A banca executa concorrência, timeout, crash, duplicate, failover e restore. Aceite exige uma decisão/efeito, saldo correto, auth, fencing e recovery. Fake local prova algoritmo; OCI DB/Functions/Queue/Provider reais provam limites. Sem sandbox, claims ficam Pending. Evidence bundle inclui timeline, constraints, receipts, metrics, drill e cleanup.

### Orçamento de falha

O ensaio registra quanto tempo cada fase pode consumir antes de quebrar a jornada: validação, acquire de conexão, transação, publicação da outbox, entrega do provider e resposta ao cliente. A baseline usa esse orçamento para evitar que um retry de camada inferior esgote o deadline superior. A mutação deixa cada dependency usar o mesmo timeout da Function e uma interrupção prolonga trabalho inútil; telemetry mostra a diferença. Esse detalhamento também permite escolher conscientemente quando retornar estado pendente em vez de declarar falha definitiva.

### Modelo de consistência

Antes de implementar, a equipe escreve quais leituras podem ser atrasadas e qual decisão requer estado primário. Catálogo pode vir de cache; confirmação de reserva não. O cliente recebe um identificador estável e consulta o resultado quando a comunicação termina em estado desconhecido. A mutação usa réplica atrasada para decidir a última vaga e o teste de corrida demonstra oversell. Nomear o limite de consistência impede que “eventual” seja usado como desculpa para uma decisão irreversível sem fencing.

### Reconciliação periódica

Além do worker, um reconciliador com privilégio mínimo compara reservas confirmadas, outbox, provider receipts e compensações pendentes. Ele é idempotente, possui janela limitada e não reenvia efeitos sem regra explícita. A mutação apaga um ACK após o provider aceitar a chamada; o reconciliador identifica a divergência, registra evidência e coloca o caso em revisão em vez de cobrar outra vez. Métrica de idade e backlog revela quando esse mecanismo de segurança virou fila operacional.

### Privacidade operacional

Correlation IDs conectam request, transação e evento, mas não precisam carregar e-mail, token ou payload inteiro. A baseline define campos permitidos, retenção e acesso para logs, traces e backups de incidente. A mutação inclui segredo de integração no erro de retry e o scanner de redaction bloqueia o artefato. Desenhar observabilidade junto com concorrência permite investigar uma decisão sem transformar o sistema de suporte em nova fonte de vazamento.

## Release segura e jornada externa

Release Quíron promove artifact testado por digest, protege candidate, valida domínio/TLS/LB/WAF/API/cache e observa jornada externa antes/depois do alias. Preview não substitui candidate; DNS/edge não substitui contract de dados. A baseline separa build, test, deploy, canary, promote e rollback, com principal mínimo e approval vinculada. A mutação testa deployment A e muda alias para B; identity gate falha. URL externa só é aprovada depois de convergence.

### Candidate e canary

Candidate imutável possui SHA, artifact/config digest, protected URL e tenant sintético. Canary valida TLS, headers, auth negative, página, API, reserva fake, observer e cleanup por região. A mutação retorna 200 stale ou duplica effect e oracle falha. Thresholds de correctness precedem latency/cost. Retry limitado não esconde falha. Approval expira ao redeploy. Logs/wire são redigidos. Low volume usa synthetic. Unknown bloqueia promote.

### Domínio e recovery

Alias/domain move segue candidate, com DNS ownership, certificate, canonical, redirects, cache/asset retention e probes multi-region. A baseline mede propagation e aceita old/new somente na janela definida. A mutação remove asset de release antiga e rollback gera 404; crawler falha. Origin permanece protegido. WAF/rate limits continuam. Revoke de secret não é desfeito no rollback. Schema/flags/outbox são reconciliados. Monitor reforçado confirma recovery.

### Evidência e aceite

A banca troca digest, quebra TLS/redirect, induz cache stale, regressão regional, asset ausente e rollback. Aceite exige candidate igual ao promovido, domínio seguro, journey correta, effects únicos e convergence. Fixtures provam oracles; OCI DNS/LB/WAF real prova edge. Sem sandbox, claims ficam Pending. Evidence bundle contém candidate/alias timeline, probes, DNS/TLS, metrics, approval e cleanup.

### Compatibilidade de clientes

Release externa também preserva clientes que ainda usam versão anterior de API, cache ou aplicativo instalado. A baseline testa redirects, métodos não idempotentes, headers, media types e versões de schema relevantes durante a janela de rollout. A mutação troca resposta de erro por HTML de fallback e client contract falha apesar de o navegador parecer saudável. Quando a compatibilidade não for possível, a comunicação, o versionamento e a data de desligamento entram no plano antes da promoção.

### Configuração verificável

Configuração faz parte do release, mas nunca deve ser inferida por variável solta no runner. O candidate recebe referências versionadas a secrets e flags, e o relatório registra apenas nomes, versões e digest redigido. A baseline executa uma matriz que mostra o comportamento com flag desligada, ligada e ausente. A mutação promove o mesmo artifact com conexão de Preview e a checagem de compartment, endpoint e audience interrompe a jornada. Assim, rollback de bytes não mascara rollback incompleto de configuração.

### Janela de promoção

Promover é uma decisão com critérios, não um botão de concluir pipeline. A janela define quem está de plantão, quais alarmes suspendem avanço, quantas requisições sintéticas são necessárias e como pausar sem perder evidência. A equipe mede erro, correção, fila, custo e sinais de segurança por cohort antes de aumentar tráfego. A mutação remove a pausa entre canary e total e uma regressão regional passa despercebida. Critérios explícitos tornam o rollout repetível sob pressão.

### Comunicação de mudança

Status page, suporte e consumidores recebem fatos verificáveis: versão, impacto, janela, alternativa e ponto de retorno. Eles não recebem segredo, especulação ou promessa baseada em deploy ainda não observado. Um runbook liga cada mensagem a um sinal técnico e prevê atualização quando o estado muda. A mutação declara sucesso antes da convergência de DNS; clientes seguem endpoint antigo e a inconsistência é detectada. Comunicação é parte do contrato externo, não comentário posterior.

### Decisão operacional de Release segura e jornada externa

A decisão sobre Release segura e jornada externa começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Release segura e jornada externa precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Release segura e jornada externa combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Banca de incidente e restore

A banca final combina key vazada, policy/config drift, Function duplicadora, perda de região e recuperação. Ela exige conter, revogar, preservar, restaurar e aprender sem transformar console ou dashboard em prova suficiente. A baseline define commander, security, deploy, data owner, observer e comunicador, com identities separadas. A mutação faz rollback do código mas mantém integration/key antiga; gate mantém incidente aberto. Cada passo possui receipt e negative probe.

### Contenção e evidence

Sinais de Audit, Cloud Guard, SLO e canary abrem incidente com escopo/fatos/unknowns. A baseline trava pipeline, restringe egress/route, revoga credentials, preserva logs/manifests/images/snapshots e registra ACL/digest. A mutação remove token só da UI e request continua; negative probe falha. Hold impede cleanup. Dados sensíveis são minimizados. Contenção não substitui rotação. Action de emergência expira/audita. Comunicação informa impacto conhecido.

### Restore e pós-incidente

Recovery seleciona artifact/plan atestado, config segura, dados compatíveis e effect reconciliation; canary libera tráfego gradualmente. A mutação restaura schema mas perde grants/outbox e journey falha. DNS/cache/assets/worker são verificados. Monitor observa janela definida. Postmortem converte lacuna em policy/test/runbook/drill com owner/data; texto sem verificação não fecha ação. Break-glass é rotacionado. Custo e vendor obligations entram. Cleanup após hold/approval.

### Evidência e aceite

A banca aprova apenas se key antiga falha, drift convergiu, uma reserva/effect existe, artifact é provado, edge convergiu e ações têm owner. Tabletop prova decisão; OCI/data/provider reais provam operação. Tudo não exercitado permanece Pending. Evidence bundle contém cenário, roles, timeline, probes, digests, observer, restore report, postmortem e cleanup.

### Encerramento verificável

Encerrar a banca exige que um revisor independente consiga seguir os IDs de deployment, policy, event, receipt e audit até cada decisão, sem receber segredo bruto. A baseline inclui essa revisão como etapa de aceite para descobrir comandos manuais, dependências não documentadas e divergências entre narrativa e estado. A mutação fornece somente screenshots de console e nenhum digest; evidência é insuficiente. O resultado orienta a próxima rodada de automação, mas não converte uma lacuna em aprovação por repetição de documento.

### Linha do tempo comum

Durante incidente, cada papel usa uma linha do tempo única com horário, fonte, decisão, executor e confiança. Alertas automáticos entram como sinais, não como causa confirmada; suposições recebem marcação visível. A mutação mistura horário local, timestamp de trace e captura manual sem fuso, e o revisor não consegue ordenar contenção e efeito. Uma cronologia consistente reduz retrabalho, protege a comunicação e permite medir se o runbook encurtou a recuperação na rodada seguinte.

### Exercício sem surpresa

Game day é anunciado como cenário, mas não revela a resposta esperada. Participantes praticam acessar evidence, pedir aprovação, revogar uma identidade de teste, restaurar dados sintéticos e provar a jornada externa. Um observador registra atalhos, credenciais compartilhadas e etapas que dependeram de conhecimento oral. A mutação remove o principal de break-glass do inventário e o ensaio mostra que a recuperação não é executável. Aprendizado vira issue priorizada, com dono e data, não uma lista vaga de lições.

### Critério de reabertura

Uma ação só fecha quando há probe que mostra o comportamento novo e probe negativo que mostra o caminho antigo bloqueado. Se o monitor fica silencioso, se a key antiga ainda autentica ou se a reserva não foi novamente disputada, o item continua aberto. Essa regra impede que a urgência de encerrar ticket substitua a prova de recuperação. O relatório final distingue o que foi exercitado localmente, o que depende de tenancy real e o que será repetido na próxima janela autorizada.

### Decisão operacional de Banca de incidente e restore

A decisão sobre Banca de incidente e restore começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Banca de incidente e restore precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Banca de incidente e restore combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
