# Oracle Cloud — Rede e conectividade — rascunho não materializado

## VCN, subnets e route tables

VCN é o plano de endereçamento e roteamento privado do workload, não uma abstração que torna qualquer comunicação segura. CIDR, subnets, route tables, gateways, DNS e destino efetivo definem se um pacote chega ao serviço esperado. A baseline declara espaço sem sobreposição, região, compartimento, subnets públicas/privadas, finalidade, owner e rotas permitidas. A mutação coloca database em subnet pública ou aponta rota privada ao internet gateway; policy e corpus precisam reprovar. Diagrama sem estado efetivo não é evidência de conectividade nem de isolamento.

### Endereçamento e segmentação

CIDR é planejado para crescimento, peering, VPN, DR e serviços gerenciados. A baseline reserva blocos por ambiente e evita sobreposição com redes corporativas. A mutação cria VCN de preview com faixa igual à produção e conexão híbrida falha ou roteia errado. Subnet representa uma fronteira de rota e exposição, não somente agrupamento de VMs. Workloads de borda, aplicação, dados, administração e endpoints privados possuem objetivos explícitos. IPv4, IPv6 e DNS são inventariados quando usados. Renumerar rede é mudança de migração, não correção instantânea.

### Route tables e destino

Cada subnet associa tabela de rotas com destino CIDR/service e target gateway/appliance. A baseline mantém regra mínima, comentário/owner e teste de caminho permitido/proibido. A mutação adiciona rota 0.0.0.0/0 para gateway público em subnet de dados e policy bloqueia. Ordem e especificidade são entendidas antes de alteração. Rotas para peering, service gateway, NAT e DR são separadas. Target indisponível gera falha conhecida, não fallback externo invisível. Mudança é observada por flow logs e probes.

### Público, privado e administração

Subnet pública não é requisito para instance ter saída; NAT e service gateway podem manter workload privado. A baseline expõe somente listener de borda necessário e usa Bastion, VPN ou console auditado para administração. A mutação atribui public IP a worker por conveniência e inventory alerta. Admin não atravessa o mesmo caminho do usuário final sem controle. Hosts de salto têm patching, MFA, sessão gravada quando aplicável e expiry. Metadata service não é exposta ao client. Segurança por IP obscuro não substitui NSG/IAM.

### DNS e resolução

Private DNS, resolver, zones e forwarding determinam nomes internos e podem vazar queries ou resolver destino errado. A baseline declara zonas, suffixes, owners, TTL, forwarding e split-horizon. A mutação resolve database privado para IP público e contract falha. DNS não é autorização; name controlado por usuário não escolhe egress privilegiado. Cache/propagation entram em incidentes e migrations. DNS logs são redigidos quando nomes revelam dados. Certificados e TLS validam hostname no destino apropriado.

### Mudança e recuperação

Alterar CIDR, subnet ou rota exige impact analysis de instances, load balancers, databases, containers, VPN e security rules. A baseline executa plan, canary de tráfego, monitor e rollback. A mutação remove rota ativa antes de criar sucessora e downtime é observado. Rollback restaura estado conhecido, mas não elimina sessions ou DNS cache automaticamente. Backup de configuração tem digest. IaC lock evita applies concorrentes. Change ticket registra owner, janela e condição de abort.

### Evidência e aceite

A banca testa CIDR sobreposto, rota pública indevida, caminho privado, DNS errado, acesso administrativo e rollback de rota. Aceite exige segmentação, destino correto, zero exposição não autorizada e recovery observável. Lint/IaC provam configuração; OCI e probes reais provam data plane. Sem tenancy, essas claims ficam Pending. Evidence bundle contém CIDRs, route snapshots, diagramas, DNS matrix, flow summaries, change plan e cleanup.

O corpus deve incluir tráfego iniciado em cada subnet relevante e confirmar tanto a ausência de caminho quanto a resposta de aplicação quando a rede permite. Isso evita aceitar uma rota correta no papel que termina em gateway, DNS ou listener divergente. Durante mudança, os probes preservam a versão de configuração e o instante de observação, porque cache e propagation podem explicar estado transitório sem convertê-lo em aceite final.

### Decisão operacional de VCN, subnets e route tables

A decisão sobre VCN, subnets e route tables começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de VCN, subnets e route tables precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de VCN, subnets e route tables combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Security lists, NSGs e microsegmentação

Security lists e network security groups filtram tráfego, mas somente se associados ao recurso/subnet corretos e combinados com rota, listener, identidade e aplicação. Security list ampla na subnet pode ampliar todo o blast radius; NSG permite política por workload. A baseline escolhe camada, direction, protocol, port, source/destination, owner e expiry e testa allow/deny. A mutação abre 0.0.0.0/0 para porta de database e scanner/corpus falha. Firewall não corrige autorização ausente dentro da aplicação.

### Camadas e associação

Security list atua em subnet; NSG é associado a VNIC ou recurso suportado. A baseline evita regra duplicada/conflictante e registra associação efetiva. A mutação escreve NSG correto mas esquece de anexar à instance, e state verification bloqueia. Load balancer, OKE nodes, databases e endpoints podem ter caminhos próprios. Regras default são revisadas. Delete de NSG verifica dependências antes de remover. Tags podem apoiar seleção, mas attachment observado é prova definitiva.

### Ingress mínimo

Ingress permite apenas origem, porta e protocolo necessários. A baseline separa internet, load balancer, bastion, worker e database, usando NSG de origem em vez de IP amplo quando possível. A mutação libera SSH global para suporte e negative test aponta. Health checks recebem origem/porta específica e não abrem aplicação inteira. TLS termina onde definido; porta aberta não garante certificado válido. IPv6 recebe regras equivalentes. Mudança temporária tem expiry e recertificação.

### Egress e dependências

Egress define destinos de package registry, API, database, logs e providers; permitir todo tráfego facilita exfiltração e SSRF. A baseline usa service gateway, private endpoints ou allowlist conforme capacidade. A mutação deixa Function seguir redirect com Authorization para host externo e egress test falha. DNS e proxy são parte da policy. Bloqueio de egress precisa considerar update, backup e incident response. Falha de allowlist gera erro observável, não retry infinito. Metrics medem denies e destinos novos.

### Microsegmentação e tenants

Workloads de tenants diferentes não compartilham acesso por estarem na mesma VCN. A baseline combina NSG, identidade, schema e authorization para impedir lateral movement. A mutação coloca admin API e public API no mesmo group amplo e port scan sintético encontra superfície. Network label não é tenant identity. Service mesh ou Kubernetes policy complementam, não substituem NSG de infraestrutura. Secrets não atravessam por header só porque origem é interna. Lateral movement é cenário de incident drill.

### Logs e tuning

Flow logs, firewall events e app logs distinguem deny esperado, falha de rota e tentativa maliciosa. A baseline mantém labels bounded e não grava payload/secret. A mutação adiciona regra e quebra health check; canary detecta antes de produção. Tuning começa em observação quando risco permite e mede falso positivo. Ausência de log pode ser pipeline quebrado. Retenção, acesso e região seguem data policy. Export para SIEM usa identity mínima. Regra emergencial expira e é revisada.

### Evidência e aceite

A banca testa attachment ausente, ingress amplo, IPv6, health check, egress por redirect, tenant lateral e regra vencida. Aceite exige allow apenas previsto, deny observável e nenhum bypass por subnet ou associação errada. Config parser prova intenção; OCI/flow probes provam enforcement. Sem sandbox, findings remotos ficam Pending. Evidence bundle contém regras, associations, test matrix, flow summaries, alertas, approvals e cleanup.

Além das portas comuns, o corpus exercita protocolos, ranges e caminhos de resposta para identificar regra aparentemente restrita que ainda permite tráfego indevido. Toda alteração é comparada a uma baseline anterior, com auditoria de quem aprovou e por qual incidente. Deny inesperado é analisado como risco de disponibilidade, nunca resolvido abrindo toda a subnet sem teste de regressão.

### Decisão operacional de Security lists, NSGs e microsegmentação

A decisão sobre Security lists, NSGs e microsegmentação começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Security lists, NSGs e microsegmentação precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Security lists, NSGs e microsegmentação combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## Gateways e DNS

Internet Gateway, NAT Gateway, Service Gateway, Dynamic Routing Gateway e DNS resolver materializam caminhos de entrada e saída. Cada um precisa finalidade, rotas, logs, custos e boundary de confiança. A baseline impede que subnet privada ganhe entrada pública por target errado e que serviço Oracle seja acessado pela internet quando endpoint privado existe. A mutação troca NAT por Internet Gateway e package update continua, mascarando exposição; policy/probe precisa ver a diferença. Gateway não é substituto de TLS, auth ou egress control.

### Internet e NAT

Internet Gateway atende recursos explicitamente públicos; NAT oferece saída iniciada por privados sem aceitar conexão de entrada. A baseline associa cada rota ao gateway apropriado e testa inbound negativo. A mutação coloca worker em subnet privada mas routeia NAT para destino errado ou adiciona public IP, e inventory falha. NAT pode ter limites/custos observados. Source IP compartilhado não é identidade. Serviços externos usam TLS e timeouts. Outbound permissivo não autoriza qualquer destination.

### Service Gateway e endpoints privados

Service Gateway permite acesso privado a serviços Oracle suportados sem atravessar internet. A baseline prefere caminho privado para Object Storage/serviços aplicáveis e restringe policy do serviço ao compartment/bucket necessário. A mutação usa gateway mas bucket policy é global e acesso cruzado continua; authorization test falha. Endpoint privado não elimina DNS ou TLS validation. Route, NSG e policy são verificados juntos. Falha de service gateway recebe diagnóstico específico. Custo/egress são comparados.

### DRG, VPN e FastConnect

DRG conecta VCN, VPN, FastConnect e redes remotas com route distribution controlada. A baseline define prefixes permitidos, BGP ownership, encryption, redundancy e failover. A mutação anuncia rota ampla da rede corporativa e encaminha tráfego inesperado; prefix filter bloqueia. VPN não torna origem automaticamente confiável. FastConnect exige desenho de redundância e monitor. Overlap CIDR é resolvido antes de attach. Mudança de route distribution passa por canary e audit.

### Resolver e zonas

Resolver encaminha queries entre VCN, on-premises e zonas privadas. A baseline estabelece forwarding rules, inbound/outbound endpoints, allowed suffixes e logging. A mutação encaminha toda query privada a resolver externo e privacy policy falha. Split-horizon evita que nome interno aponte para endpoint público. TTL e cache são medidos durante migration. Resolver availability é dependência de aplicação. DNS poisoning é mitigado por controle de zones, TLS e validação de destino, não somente por esconder nomes.

### Custo e abuso

Gateways podem amplificar egress, NAT connections e DNS queries. A baseline mede bytes, connections, error rate e destinations por environment, com budgets e alerts. A mutação cria URL/host único por request e cardinalidade/custo dispara. Retry usa jitter e máximo. DDoS de entrada é tratado na borda, não empurrado ao NAT. Logs de query são sampled conforme privacidade. Preview tem quotas/TTL. Incidente financeiro pode restringir feature não crítica por runbook.

### Evidência e aceite

A banca testa inbound em subnet privada, acesso a serviço por caminho público, prefix route ampla, DNS forwarding indevido, outage de gateway e egress storm. Aceite exige rotas privadas quando projetadas, prefixes mínimos, resolução segura e custos observáveis. Arquivos locais provam modelo; OCI/VPN/DNS reais provam caminhos. Sem sandbox, claims ficam Pending. Evidence bundle contém routes, resolver rules, probes, BGP summaries redigidos, metrics, runbook e cleanup.

O relatório correlaciona bytes, conexões e consultas com release e mudança de configuração, permitindo distinguir bug da aplicação de transformação de rota ou de custo. Quando uma dependência não suporta endpoint privado, a exceção recebe destination explícito, TLS, owner, prazo e teste de revoke; não se converte em egress global por padrão.

### Decisão operacional de Gateways e DNS

A decisão sobre Gateways e DNS começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Gateways e DNS precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Gateways e DNS combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## VPN, FastConnect e desenho híbrido

Conectividade híbrida une tenancy a rede corporativa e introduz rotas, identidade, DNS, criptografia, disponibilidade e operação compartilhada. VPN e FastConnect não são links mágicos; erro de prefixo ou failover pode expor ou interromper dezenas de serviços. A baseline declara sites, CIDRs, ownership, circuitos, BGP, encryption, DNS, throughput, RTO e teste de corte. A mutação aceita rota default da rede remota e tráfego OCI deixa de seguir controles previstos; route filter deve bloquear.

### Arquitetura e redundância

Desenho saudável identifica ao menos dois caminhos independentes quando o requisito exige, mas não chama dois túneis no mesmo failure domain de alta disponibilidade. A baseline mapeia provider, CPE, DRG, circuitos, localidades e dependências. A mutação derruba um equipamento e ambos os túneis caem; drill revela concentração. FastConnect e VPN backup possuem preferência e critérios de failover explícitos. Capacidade considera replicação, restore e pico. Diagramas são reconciliados com estado de BGP.

### BGP e filtros

BGP anuncia somente prefixes necessários e recebe somente prefixes aprovados. A baseline filtra default, summary excessivo e rota sobreposta, monitora mudanças e preserva configuração por digest. A mutação anuncia 0.0.0.0/0 ou subnet de outro tenant e route policy falha. Métrica inclui session state, prefixes, flap e path selection. BGP não autentica aplicação; tráfego continua sob NSG/IAM. Mudança de ASN e key é controlada. Failback evita oscilação e loops.

### Criptografia e confiança

IPSec protege VPN em trânsito, mas certificados, PSKs, algoritmos e rotação precisam lifecycle. A baseline guarda material em secret manager, limita acesso e testa expiração/rekey. A mutação escreve PSK em ticket ou config e canary acusa. FastConnect pode exigir criptografia adicional conforme requisito. TLS de aplicação continua necessário. Clock skew e MTU afetam handshake e throughput. Logs não carregam chaves. Revoke de CPE/credential é parte do incidente.

### DNS e identidade híbrida

Aplicações precisam resolver destino correto sem vazar zonas internas. A baseline define forwarding, suffix, ownership, TLS hostname e resolução durante failover. A mutação resolve serviço OCI interno para IP externo e connection policy falha. Rede corporativa não recebe privilégios de usuário por ser privada; workload autentica com identidade própria. Proxy e inspection points são inventariados. Split DNS é testado por origem. Cache de resolver pode atrasar recovery.

### Operação e incidentes

Runbook distingue perda de circuito, BGP down, prefix errado, DNS, MTU, firewall e aplicação. A baseline usa probes dos dois lados, traces redigidos e thresholds de failover. A mutação produz flap e failover alterna sem hysteresis, degradando transações; test identifica. Incident comunica owner de ambos os domínios. Alterações exigem janela, rollback e audit. Drill mede RTO/RPO e dados em trânsito. Support access é temporário e registrado.

### Evidência e aceite

A banca testa corte de link, prefix indevido, rota default, rekey, DNS divergente, MTU e failback. Aceite exige redundancy comprovada, filtros corretos, criptografia gerenciada, resolução segura e recuperação medida. Simulador prova lógica; OCI/CPE/carrier reais provam data plane. Sem sandbox, esses claims são Pending. Evidence bundle contém topology, configs redigidas, BGP/flow reports, drill timeline, RTO/RPO, actions e cleanup.

Após cada drill, a equipe compara o caminho realmente selecionado com o caminho desenhado, mede recuperação de aplicações e confirma que regras de segurança continuaram aplicadas durante o fallback. Uma sessão BGP verde não aprova tráfego útil nem consistência de dados. As discrepâncias viram ações com owner e prazo, preservadas até repetição bem-sucedida do exercício.

### Decisão operacional de VPN, FastConnect e desenho híbrido

A decisão sobre VPN, FastConnect e desenho híbrido começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de VPN, FastConnect e desenho híbrido precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de VPN, FastConnect e desenho híbrido combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
