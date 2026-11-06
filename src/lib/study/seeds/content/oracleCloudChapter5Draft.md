# Oracle Cloud — Storage e dados — rascunho não materializado

## Block volumes e backups

Block Volume oferece armazenamento persistente para compute, com performance, attachment, encryption, backup e restore próprios. Volume não é cópia de segurança apenas por sobreviver ao reboot; uma exclusão, corrupção lógica ou region failure exige estratégia separada. A baseline classifica dado, define size, performance, attachment mode, encryption key, backup cadence, retention, RPO/RTO e owner. A mutação anexa volume de produção à instance de diagnóstico e altera filesystem; policy/runbook deve impedir. Instance healthy não prova volume consistente ou restaurável.

### Attachment e acesso

Volume pode ser anexado por protocolo e modo compatíveis com OS/aplicação; múltiplos writers sem filesystem/protocolo adequado causam corrupção. A baseline declara reader/writer, mount options, encryption, device mapping e procedimento de detach. A mutação monta volume em duas VMs como leitura/escrita e integrity test falha. Automação espera attach/detach observável antes de mudar. Instance replacement preserva referência correta. Dados temporários não recebem volume crítico por default. Access OS complementa IAM e não é substituído por nome de device.

### Performance e capacidade

IOPS, throughput, latency e tamanho influenciam database, logs e backups. A baseline mede carga representativa e mantém headroom, evitando escolher tier por custo isolado. A mutação reduz performance e p95 de transaction excede deadline; benchmark/observer acusa. Burst e limites do serviço são conhecidos. Métrica de disco cheio, queue e erros de I/O alerta antes de corrupção. Expandir volume exige filesystem/application procedure. Snapshot durante carga possui semântica documentada. Custo é atribuído a owner/environment.

### Encryption e chaves

Volumes usam encryption em repouso e podem depender de chaves gerenciadas; access à key é boundary de disponibilidade e segurança. A baseline inventaria key, rotation, policies, backup e recovery. A mutação revoga key durante restore e runbook classifica bloqueio, não perda silenciosa. Key não é exportada em ticket. Rotação é ensaiada com volume de teste. Cross-region copy respeita residência. Snapshot não torna dados menos sensíveis. Audit correlaciona chave, volume e principal sem registrar material secreto.

### Backups e restore

Backup possui schedule, retention, criptografia, região, owner, verificação e custo. A baseline executa restore drill em compartment isolado, monta volume e valida checksum/application semantics antes de declarar sucesso. A mutação restaura snapshot de data errada ou sem key e recovery test falha. RPO mede ponto recuperável, RTO mede jornada completa, não clique de restore. Backup de volume não inclui state de serviços externos. Delete/retention protege contra remoção acidental e ransomware conforme policy.

### Lifecycle e incidentes

Create, resize, clone, backup, detach e delete passam por inventário e change control. A baseline procura volumes órfãos, snapshots sem owner e backups expirados. A mutação termina instance e deixa volume com PII/custo; janitor abre finding, não deleta sem retention review. Incident preserva volume para forense sob access mínimo. Restore não sobrepõe original sem approval. Cleanup de sandbox confirma dependencies. Billing export e tags ajudam localizar riscos.

### Evidência e aceite

A banca testa double attach, I/O saturado, key revogada, backup atrasado, restore incompleto e volume órfão. Aceite exige acesso correto, performance adequada, encryption, RPO/RTO medidos e lifecycle seguro. Scripts/fixtures provam checksums; OCI Volume real prova attachment e restore. Sem sandbox, claims ficam Pending. Evidence bundle contém manifest, metrics, snapshots redigidos, drill timeline, audit, cost report e cleanup.

### Decisão operacional de Block volumes e backups

A decisão sobre Block volumes e backups começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Block volumes e backups precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Block volumes e backups combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Object Storage e lifecycle

Object Storage armazena bytes e metadata em buckets com namespace, policies, versioning, encryption, retention e lifecycle. URL de objeto não determina autorização e bucket privado não torna fluxo inteiro seguro se signed URL, logs ou replication vazam. A baseline define compartment, bucket, data class, writer/reader, prefix, versioning, checksum, retention, região e owner. A mutação torna upload privado público por policy ampla; corpus anônimo precisa falhar. Object store não substitui banco transacional nem garante processamento idempotente.

### Buckets, namespaces e policies

Bucket separa domínios de risco e lifecycle; prefix organiza objetos, mas policy precisa considerar recurso e principal, não confiar somente em string controlada pelo client. A baseline restringe read/write/delete/list ao mínimo e testa outro tenant/prefix. A mutação dá manage objects a worker que só faz put em prefix de upload; matrix acusa. Namespace e bucket names não carregam PII. Compartimento reforça boundary, mas integração cross-compartment é explícita. Mudança de policy possui plan, test e audit.

### Upload e integridade

Upload direto usa URL ou request assinado com method, object key, tamanho, MIME, checksum e TTL limitados. A baseline cria key no servidor a partir de principal confiável e finaliza após validar object. A mutação troca key, content type ou checksum e deve falhar. Multipart tem state, timeout e cleanup. Filename é metadata sanitizada, não path. ETag possui semântica dependente e não substitui checksum forte quando necessário. Upload incompleto não é listado como disponível.

### Versioning e lifecycle

Versioning permite recuperar overwrite/delete, mas aumenta retenção/custo e não substitui backup/drill. A baseline configura lifecycle por classe, versão, idade, legal hold e owner. A mutação expira versão ainda referenciada ou mantém objeto após delete solicitado; reconciliation detecta. Transição para tier frio considera latency de recovery. Delete marker e retention lock têm semantics claras. Lifecycle rules são testadas em bucket sandbox. Janitor não remove evidence sob incident hold. Replicação segue região/classificação.

### Encryption e acesso privado

Encryption default e customer-managed key podem atender requisitos, mas access a key, URL assinada e logs decidem fronteira real. A baseline testa acesso anônimo, outro principal, URL vencida, revoke e key indisponível. A mutação grava URL assinada em analytics/referrer e privacy scan falha. Download privado reautoriza a cada emissão. CORS de bucket é mínimo. Conteúdo controlado pelo usuário, como HTML/SVG, não é servido ativo no domínio principal. Virus scanning/processamento possuem state e provenance.

### Custos e abuso

Storage, requests, egress, replication, versions e lifecycle têm unidade de custo. A baseline limita tamanho, frequência e listagem, mede hot prefixes e alerta anomalia. A mutação gera objeto único por request e custo cresce sem uso legítimo; cardinalidade gate acusa. Retry não cria múltiplos objetos sem idempotency. Range download possui limites. Billing atraso é registrado. Cleanup preserva backups exigidos. Custo por tenant não usa label de alta cardinalidade sem agregação.

### Evidência e aceite

A banca testa bucket cross-tenant, upload replay, checksum errado, URL vencida, version restore, lifecycle agressivo e storm de objetos. Aceite exige zero acesso indevido, integridade, retention correta, custos bounded e recovery testado. Parsers/fakes provam fluxo; OCI Bucket real prova ACL/lifecycle. Sem sandbox, claims ficam Pending. Evidence bundle contém policies, inventory, checksums, wire redigido, lifecycle report, billing sample e cleanup.

### Decisão operacional de Object Storage e lifecycle

A decisão sobre Object Storage e lifecycle começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Object Storage e lifecycle precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Object Storage e lifecycle combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## File Storage e compartilhamento

File Storage fornece filesystem compartilhado e pode simplificar workloads que precisam de paths comuns, mas introduz NFS, export options, identity, locks, throughput e backup próprios. Não é escolha automática para dados transacionais ou cache sem desenho de concorrência. A baseline declara mount target privado, export, CIDRs/NSGs, UID/GID, encryption, throughput, backup, owner e aplicações permitidas. A mutação exporta filesystem para subnet ampla e host não autorizado monta; security test falha.

### Mount targets e export options

Mount target vive em subnet e recebe regras de rede; export option controla CIDR, acesso e squash. A baseline limita origem a NSGs/CIDRs necessários e testa mount permitido/proibido. A mutação usa 0.0.0.0/0 por conveniência e policy bloqueia. DNS privado resolve target correto. Export não confere identidade de aplicação sozinho; host compromise continua risco. Delete de mount target verifica clients. Mudança de option passa por canary, pois pode interromper workloads ativos.

### POSIX, permissões e tenants

UID/GID, ownership, ACLs e root squash determinam acesso dentro do filesystem. A baseline alinha identidades de hosts/containers, evita UID ambíguo e testa leitura/escrita cruzada entre tenants. A mutação executa container como root e escreve área de outro workload; corpus falha. Permissão de filesystem não substitui authorization da aplicação para dados lógicos. Secrets não são compartilhados em volume por default. Audit de acesso pode ser limitado; logs de aplicação complementam. Backup preserva mode/ownership.

### Concorrência e locking

NFS permite múltiplos clients, mas aplicação precisa saber sobre locks, cache, atomic rename e failure. A baseline define operação permitida e evita usar arquivo compartilhado como lock distribuído sem protocolo. A mutação faz duas Functions atualizar contador em arquivo e perde incrementos; observer acusa. State crítico usa database/queue apropriados. Upload compartilhado usa nomes únicos e finalização atômica. Node crash/reconnect é ensaiado. Cache client pode atrasar visibilidade. Throughput/capacity são monitorados.

### Backup e DR

Backup de filesystem tem frequência, retenção, encryption, região e restore drill. A baseline restaura em mount target isolado e valida estrutura, permissões e aplicação antes de tocar origem. A mutação restaura bytes sem ownership e runtime falha; acceptance reprova. Replication/DR considera RPO/RTO e custo. Delete/retention exige review de exports e legal hold. Snapshot não é prova de restore. Dados de cliente não são usados em teste sem autorização. Evidence preserva digest/inventário.

### Performance e operação

Throughput, metadata operations, small files, clients e network influenciam experiência. A baseline mede perfil real, inclui burst e limites de mount, e evita transformar File Storage em fila de trabalho. A mutação adiciona milhares de arquivos pequenos e latency degrada; budget alerta. Autoscaling de clients respeita capacidade. Patching de host mantém mounts/retries seguros. Incident pode isolar client sem excluir share. Cost/usage é atribuído. Janitor limpa sandbox por prefix/export confirmado.

### Evidência e aceite

A banca testa mount não autorizado, UID cruzado, lock frágil, client crash, restore sem ACL e metadata storm. Aceite exige export mínimo, isolamento, sem perda de estado crítico, DR verificável e custo controlado. Fixtures locais provam POSIX; OCI File Storage prova mount/export. Sem sandbox, claims ficam Pending. Evidence bundle contém export policies, mount matrix, performance, restore drill, observers, audit e cleanup.

### Decisão operacional de File Storage e compartilhamento

A decisão sobre File Storage e compartilhamento começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de File Storage e compartilhamento precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de File Storage e compartilhamento combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Data transfer e integridade

Mover dados entre datacenter, regiões, buckets, volumes, databases e consumidores requer mais que copiar bytes: origem, destino, autorização, checksum, criptografia, idempotência, observação e cleanup determinam se a transferência é segura. A baseline classifica dados, define lote, owner, caminho, bandwidth, janela, RPO, verification e rollback. A mutação interrompe cópia no meio e marca dataset completo; checksum/manifest devem impedir consumo. Ferramenta de transferência não substitui política de acesso nem consentimento.

### Planejamento e inventário

Transfer começa com lista de objetos/tabelas/volumes, versão, tamanho, classificação, origem/destino e dependências. A baseline calcula throughput e tempo, reserva capacidade e testa lote pequeno sintético. A mutação omite partição crítica e reconciliação encontra contagem/digest divergente. Dados em trânsito e temporários recebem mesma classificação. Janela coordena writes, replication ou dual-write conforme consistência necessária. Owner de origem e destino aprova. Nenhum bucket compartilhado vira staging sem lifecycle.

### Integridade e checksums

Checksum forte, manifest e contagem validam bytes; validação semântica confirma schema, encoding, ACL e aplicação. A baseline calcula hash na origem/destino e registra algoritmo, versão e horário. A mutação altera objeto mantendo tamanho e hash gate falha. Multipart e compressão possuem checks próprios. ETag não é assumida universal. Transfer idempotente evita duplicar registros. Retentativa consulta estado e reenvia somente parte necessária. Relatório separa failed, unknown e verified.

### Criptografia e autorização

Canal usa TLS/IPSec e destino usa encryption; chaves, policies e principals são restritos. A baseline testa principal errado, região proibida, redirect e credential vencida. A mutação envia export para URL pública ou inclui secret no comando/log e scanner bloqueia. Signed URL possui TTL/escopo. Bastion ou appliance de transferência tem identity mínima. Dados temporários são removidos depois de verify e retenção. Audit correlaciona lote e request IDs sem corpos. Network e IAM são ambos necessários.

### Cutover e consistência

Transfer online pode usar snapshot, CDC, dual-write ou pausa controlada. A baseline define source of truth, ordering, lag, conflict e critério de cutover. A mutação aceita write no source após snapshot sem replicá-lo e destination fica stale; observer acusa. Última vaga e efeitos externos exigem transação/outbox, não export eventual. Rollback preserva origem até acceptance. DNS/endpoint swap é separado de cópia. Comunicação informa freeze e estado. Cutover tem abort threshold.

### Recovery e cleanup

Falha de transferência preserva origem, aborta consumer de dataset parcial e coleta evidence. A baseline possui restart seguro, quarantine, delete controlado e restore drill. A mutação limpa staging antes de verificar manifest e diagnóstico perde dados; runbook falha. Cleanup revoga URLs/keys temporárias e verifica billing. Legal hold impede delete. Reconciliation posterior compara totals e acessos. Incident identifica alcance de dados expostos. Recursos temporários têm tags/TTL sem depender apenas disso.

### Evidência e aceite

A banca testa lote ausente, checksum divergente, timeout, principal errado, write durante cutover, destino proibido e cleanup precoce. Aceite exige conjunto íntegro, acesso mínimo, consistência declarada, rollback e staging limpo. Scripts locais provam manifests; OCI/data stores reais provam throughput e policies. Sem sandbox, claims ficam Pending. Evidence bundle contém inventory, digests, transfer reports, approvals, timelines, audit, recovery e cleanup.

### Decisão operacional de Data transfer e integridade

A decisão sobre Data transfer e integridade começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Data transfer e integridade precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Data transfer e integridade combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
