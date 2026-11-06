# Oracle Cloud — IAM e identidade — rascunho não materializado

## Users, groups e least privilege

Identidade em Oracle Cloud define quem pode ver, alterar ou destruir recursos dentro da tenancy. User não recebe acesso diretamente por conveniência quando group e policy podem expressar a função; group sem revisão vira privilégio acumulado. A baseline inventaria principals humanos, groups, compartments, roles, owners, data de expiração e justificativa. A mutação adiciona desenvolvedor a group administrativo para depurar uma instance e review precisa bloquear. Login bem-sucedido demonstra autenticação, não necessidade, escopo mínimo ou offboarding.

### Modelo de concessão

Group representa função estável e policy concede verbo, resource type, compartment e condição suficientes. A baseline separa leitura, operação, administração de identidade e billing; Production exige conjunto mais estreito que sandbox. A mutação concede manage all-resources porque uma ação falhou e capability matrix demonstra blast radius. Membership não é atalho para suporte temporário. Acesso excepcional usa group curto, ticket, expiry e audit. Nomes descrevem propósito e não pessoas. Uma policy clara permite revisão independente do console.

### Joiner, mover e leaver

Provisionamento confirma gestor, group alvo, compartment e prazo. Mudança remove grupos anteriores antes de ampliar função nova. Offboarding revoga sessões, API keys, auth tokens, SSH keys, federation links e ownership transferível. A mutação desabilita user mas key continua utilizada por automation; probe negativo falha. Recursos criados pelo usuário, budgets e alarmes entram em transição. Prazo de revoke é medido. Não se depende de lista manual de e-mails. Audit e inventário oferecem evidência da decisão.

### Separação de deveres

Autor de mudança, approver, operador de deploy e auditor podem ser identidades diferentes conforme risco. A baseline impede uma conta de elevar a própria permissão e aprovar exceção crítica. A mutação usa admin compartilhado no CI e policy/processo denuncia ausência de rastreabilidade. Break-glass é isolado, com MFA, dual control quando aplicável, expiry e pós-revisão. Separação não deve criar bloqueio sem caminho de incidente; runbook define quem autoriza ação urgente. Ações críticas geram audit pesquisável.

### Escopo e condições

Policies podem ser específicas por compartment, resource, network source ou conditions suportadas. A baseline prefere escopo pequeno e testa operação necessária, operação proibida e negação por destino errado. A mutação permite administrar todos os buckets quando workload só precisa ler um namespace; corpus negativo falha. Condição de IP não substitui identidade nem validação de request. Tags podem apoiar controle quando a semântica é confiável, mas mutável sem governança é risco. Cada dependency recebe direito explícito.

### Revisão e detecção

Recertificação compara estado desejado e estado observado de users, groups e policies. A baseline detecta membership antigo, owner inexistente, group sem propósito e grant não usado. A mutação cria user por console fora do fluxo e reconciliation abre finding. Métrica de quantidade de usuários não prova privilégio correto. Relatório minimiza PII e protege export. Finding tem owner, severidade, due date e compensação. Revogação é confirmada por tentativa negativa, não apenas remoção visual na UI.

### Evidência e aceite

A banca testa grant mínimo, ação proibida, mover, leaver com key ativa, self-escalation e break-glass vencido. Aceite exige grupos rastreáveis, policy mínima, revoke dentro do SLO e audit de decisões. Manifest/IaC prova desenho; tenancy real prova enforcement. Sem sandbox, acessos OCI ficam Pending. Evidence bundle contém matriz redigida, snapshots, tickets, probes negativos, audit export e cleanup.

O corpus ainda alterna usuários com funções próximas para detectar herança acidental e verifica que uma remoção não deixa sessões, grupos aninhados ou permissões derivadas acessíveis. O resultado registra o request ID e a política esperada, tornando uma negação investigável em vez de parecer falha aleatória de plataforma.

### Decisão operacional de Users, groups e least privilege

A decisão sobre Users, groups e least privilege começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Users, groups e least privilege precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Users, groups e least privilege combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Policies e dynamic groups

Policies Oracle Cloud são linguagem de autorização sobre verbos, recursos, compartments e condições; dynamic groups concedem identidade a workloads com base em regras de matching. Ambos podem reduzir uso de keys longas, mas uma expressão ampla transforma toda instance em principal privilegiado. A baseline versiona policy e matching rule, associa owner, teste positivo/negativo, environment e expiry. A mutação inclui qualquer resource em dynamic group por regra larga e uma instance de preview acessa dado Production; gate precisa impedir.

### Linguagem e verbos

Inspect, read, use e manage possuem impactos distintos. A baseline escolhe o menor verbo que sustenta a operação e revisa cada resource family. A mutação usa manage para ler métrica e matrix acusa capabilities excedentes. Policy é escrita com compartment explícito sempre que possível. Herança e statements múltiplos são analisados juntos; uma negação esperada pode ser anulada por grant amplo em outro nível. Comentário/documento explica intenção, porém a regra efetiva é o texto aplicado e sua avaliação pela plataforma.

### Dynamic group matching

Matching pode restringir por compartment, instance OCID, resource type ou tags conforme suporte. A baseline evita predicado global, testa resource pertencente e não pertencente e mantém regras curtas. A mutação usa all-resources em tenancy e qualquer instance passa a obter credencial de workload; test design falha. Mudança de tag usada em matching é evento de segurança. Workload identity tem owner e lifecycle como user humano. Runtime confirma audience/region quando aplicável. Group não recebe permissão sem policy específica.

### Workload e segredo

Instance, Function, OKE workload ou pipeline acessa recursos com principal próprio e policy mínima, não com key de operador embutida. A baseline separa build, deploy, runtime e observability. A mutação expõe private key em image ou environment e scanner/canary acusa. Token obtido por workload é curto quando o serviço suporta e não é repassado a clientes. Egress de credential é restringido. Logs nunca imprimem headers de assinatura. Fallback para credencial humana é proibido e testado.

### Propagação e read-after-write

IAM pode apresentar propagation; alteração de policy não é tratada como instantânea sem prova. A baseline registra tempo, resultado da API e probes repetidos, com janela e owner. A mutação cria policy e imediatamente executa operação crítica assumindo sucesso; workflow classifica Unknown e aguarda ou aborta. Revoke possui prioridade operacional e confirmação negativa. Retry não mascara acesso inesperado. Cache de SDK/metadata é conhecido. Incident runbook considera sessões e tokens já emitidos.

### Testes de permissão

Corpus contém action permitida, ação negada, destination errada, resource de outro compartment e principal sem matching. A baseline usa sandbox com dados sintéticos e captura status, request ID, audit e efeito. A mutação altera uma palavra na policy e o oracle revela grant excessivo ou indisponibilidade. Mock de IAM valida cliente, não enforcement da plataforma. Testes não usam credencial admin para provar workload. Cleanup revoga recursos temporários depois de guardar evidence. Policy flake vira investigação, não bypass.

### Governança e drift

Policy as code passa review, lint e plan; console change aparece em diff e recebe owner. A baseline impede statements sem descrição ou exceções sem prazo. A mutação remove condição de compartment para resolver incidente e reconciliation alerta. Dynamic groups sem resource ativo ainda são revisados, pois podem capturar recurso futuro. Export de policy é preservado por digest. Integrações e marketplace entram no mesmo inventário. Auditoria mede quem mudou, quando, de onde e qual statement foi efetivo.

### Evidência e aceite

A banca cria principal correto/incorreto, expressão ampla, tag alterada, policy com verbo excessivo, propagation e revoke. Aceite exige only intended actions, zero acesso cruzado, workload sem key humana e drift detectado. Parser local prova sintaxe/modelo; OCI real prova evaluation e audit. Sem tenancy, claims ficam Pending. Evidence bundle contém statements, matching rules, matrix, probes, request IDs redigidos, timeline e cleanup.

### Decisão operacional de Policies e dynamic groups

A decisão sobre Policies e dynamic groups começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Policies e dynamic groups precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Policies e dynamic groups combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Federation, MFA e break-glass

Federação desloca identidade para IdP corporativo, mas não elimina responsabilidade pela relação entre subject, group, session e policy OCI. MFA reduz risco de credencial roubada; break-glass preserva capacidade de recuperação quando IdP, rede ou administração normal falham. A baseline documenta issuer, audience, mapping, groups, sessão, MFA, contas locais permitidas e drills. A mutação mantém login local amplo como bypass permanente e policy/processo precisa detectar. Disponibilidade de SSO não equivale a disponibilidade de controle de acesso.

### Mapeamento e confiança

Federação valida issuer, assinatura, audience, horário e subject único. A baseline mapeia grupos corporativos a groups OCI com allowlist, não por atributo livre como e-mail. A mutação altera claim de grupo e recebe privilégio administrativo; teste negativo falha. Mudança de domínio ou tenant IdP passa por review. Metadata de IdP tem cache e rotação de chave planejados. Subject não é reutilizado sem processo. Logs de auth redigem tokens e atributos sensíveis. Conta local de recuperação tem escopo mínimo.

### MFA e sessão

MFA é exigida para humanos privilegiados e recovery usa fatores protegidos. A baseline define session lifetime, reautenticação para ação crítica, logout e revogação. A mutação remove user do IdP mas sessão OCI segue operando além do SLO; observer acusa. Device posture e IP podem enriquecer sinal, não decidir autorização sozinhos. Cookie/session não é compartilhado. Lost device workflow verifica identidade e gera audit. Código de recuperação não fica em repositório, ticket ou chat.

### Break-glass

Break-glass é conta ou fluxo isolado para indisponibilidade real, não alternativa confortável ao SSO. A baseline restringe group, exige MFA forte, owner duplo, vault de acesso, prazo e alerta imediato. A mutação usa break-glass em atividade diária e recertificação aponta. Uso abre incidente leve e pós-revisão: qual bloqueio normal falhou, quais ações ocorreram e se a conta precisa ser rotacionada. Credencial é testada em drill controlado; conta nunca testada pode falhar quando necessária.

### JIT e acesso temporário

Just-in-time cria grant por ticket, role, scope e expiração. A baseline confirma remoção e evita grupo permanente para suporte. A mutação concede acesso de Production sem deadline e compliance gate falha. Approval de owner de dados acompanha acesso sensível. Sessão existente e tokens derivados entram na revogação. JIT não substitui logging ou least privilege. Exceção de emergência é associada a incidente. Métrica mede grants expirados e uso fora de janela.

### Indisponibilidade e recovery

IdP indisponível, erro de mapping ou lockout requer runbook que preserva segurança. A baseline define quem ativa break-glass, como verificar service health e como voltar ao fluxo federado. A mutação desabilita MFA globalmente para recuperar usuário e policy bloqueia. DNS, certificate e clock são dependências da federação. Recovery revoga sessões temporárias, reconcilia groups e preserva audit. Comunicação evita dados de autenticação. Teste de DR de identidade tem ambiente isolado.

### Auditoria e privacidade

Eventos de login, MFA, federation, break-glass e JIT são retidos com acesso controlado. A baseline usa subject pseudônimo quando relatório não exige PII e correlaciona com ações OCI. A mutação envia assertion de SSO inteira ao log e canary/privacy scan falha. Audit não prova que ação teve sucesso sem estado/probe. Retenção segue contrato e lei aplicável. Export de incidente recebe hash/digest e chain of custody. Support vê dados mínimos.

### Evidência e aceite

A banca testa login federado, group incorreto, MFA ausente, disable no IdP, JIT vencido, outage e break-glass. Aceite exige mapping mínimo, MFA enforce, sessão/revoke no SLO, uso emergencial auditado e recovery seguro. Config local prova intenção; IdP/OCI reais provam fluxo. Sem sandbox, claims permanecem Pending. Evidence bundle contém mapping, policies, auth timelines redigidas, drill report, audit e cleanup.

O drill mede também a reversão: depois do IdP recuperar, grants temporários e sessões de break-glass devem desaparecer, mappings devem convergir e o acesso cotidiano precisa voltar a operar sem manter bypass. Qualquer diferença entre grupo corporativo e group OCI permanece finding até explicação e correção.

### Decisão operacional de Federation, MFA e break-glass

A decisão sobre Federation, MFA e break-glass começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Federation, MFA e break-glass precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Federation, MFA e break-glass combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## API keys, auth tokens e revoke

API keys, auth tokens, customer secret keys e SSH keys são credenciais com usos e riscos distintos. Elas não devem virar mecanismo universal de workload identity, nem ser tratadas como texto de configuração comum. A baseline inventaria tipo, principal, finalidade, escopo, criação, rotação, armazenamento, expiração, consumers e procedimento de revoke. A mutação deixa key de operador em repositório e secret canary precisa bloquear. Remover o arquivo não revoga a credencial já copiada.

### Escolha de credencial

Workload usa dynamic group e principal nativo quando possível; API signing key é reservada ao caso necessário; auth token tem escopo e lifecycle conhecidos. A baseline recusa usar chave de pessoa em CI ou servidor. A mutação reutiliza token de download para administração e policy de identity/pipeline falha. SSH key é vinculada a usuário e host autorizado, não a bucket de secrets genérico. Cada tipo possui owner e revisão. Credencial de fornecedor externo recebe inventário separado e egress controlado.

### Geração e armazenamento

Key é gerada em endpoint/host controlado, protegida por secret manager ou vault compatível e nunca exibida em log. A baseline registra fingerprint, ID, data e consumer, sem private material. A mutação coloca key em image, build output, shell history ou PR e scanners procuram canary. Permissões de arquivo são restritas e arquivos temporários removidos. Backup de key não é cópia em planilha. Recovery de credencial segue escrow controlado. Acesso ao vault é auditado e mínimo.

### Rotação sem indisponibilidade

Rotação cria nova credencial, atualiza consumers controladamente, observa uso, revoga antiga e confirma rejeição. A baseline define overlap curto e owner. A mutação remove key antiga antes de atualizar worker e outage revela sequência errada; outra mantém ambas para sempre e recertificação falha. Config references possuem versões. Cache de client e connection pools são considerados. Rollback não reativa key comprometida. Rotação após incidente pode exigir invalidar sessões e tokens derivados.

### Revoke e investigação

Suspeita de vazamento exige revoke antes de análise longa quando impacto justificar. A baseline identifica principal, consumers, scope e last use, desabilita key, testa negativa e preserva audit. A mutação remove chave da UI, mas request assinada continua aceita; observer mantém incidente aberto. Revoke de uma credencial não fecha exposição em logs, artifact ou integração. Regeneração tem nova fingerprint. Comunicação não compartilha material. Evidência inclui horário e resultados, não segredo.

### Limits, signing e replay

Request signing possui clock, canonical request, region/service e replay characteristics. A baseline fixa clock sync, restringe endpoints e testa assinatura inválida, expirado, região errada e método alterado. A mutação assina host diferente ou aceita clock excessivo; security corpus falha. Proxy não deve registrar Authorization. Retry preserva semantics e não amplia operação. Auth token não é enviado a destino após redirect. SDK version e canonicalization são pinados quando relevantes.

### Auditoria e recertificação

Inventário compara credentials declaradas com estado observado, destacando sem owner, sem uso, antigas ou com scope excessivo. A baseline envia finding para owner e define prazo. A mutação cria key por console e drift report a encontra. Métrica de rotação não esconde credential esquecida. Audit correlaciona key fingerprint, principal e ação. Access reviews incluem vault policies e pipelines. Delete de usuário verifica keys derivadas. Relatórios minimizam dados operacionais.

### Evidência e aceite

A banca injeta key em source, image e log, roda rotação, revoke, replay, região errada e usuário removido. Aceite exige storage seguro, zero canary, rotação sem downtime, negativa após revoke e audit completo. Static scans provam artefatos; OCI reais provam aceitação/revoke. Sem tenancy, claims ficam Pending. Evidence bundle contém inventory redigido, fingerprints, rotation timeline, probes, audit, incident report e cleanup.

A validação confere todos os consumers declarados e procura chamadas tardias da chave antiga durante a janela posterior à rotação. Isso distingue revoke realmente propagado de simples ausência de tráfego na primeira amostra, e deixa explícito quando o serviço remoto ainda não foi exercitado.

### Decisão operacional de API keys, auth tokens e revoke

A decisão sobre API keys, auth tokens e revoke começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de API keys, auth tokens e revoke precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de API keys, auth tokens e revoke combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
