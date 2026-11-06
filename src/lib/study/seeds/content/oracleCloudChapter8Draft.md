# Oracle Cloud — Load balancing, edge e entrega — rascunho não materializado

## Load balancers e health checks

Load balancer é fronteira de tráfego, TLS, disponibilidade e observabilidade entre clientes e backends. Listener funcionando não prova que backend pronto, seguro ou distribuído; health superficial pode enviar tráfego para instance incapaz de concluir operações. A baseline define tipo, subnets, NSGs, listeners, certificados, backend sets, health checks, drain, algoritmos, logs, owner e SLO. A mutação registra backend healthy antes de migration/config e entrega falhas a usuários; readiness contract deve bloquear.

### Listeners e TLS

Listener define protocolo, porta, hostname, certificate, cipher e redirecionamento. A baseline termina TLS em boundary planejado, valida SNI/cadeia/hostname e força HTTP-to-HTTPS quando apropriado. A mutação anexa certificado de domínio errado ou permite TLS fraco e wire probe falha. Private listener não recebe internet gateway por acidente. Headers forwarded são confiados somente de proxy conhecido. Listener não expõe admin/debug sem auth. Renewal tem alerta e ownership. Secret de certificate segue key policy.

### Backend sets e readiness

Backend set contém targets, porta, política e health. A baseline exige readiness que verifica configuração/dependency essencial sem expor PII ou causar efeito. A mutação responde 200 enquanto database está indisponível e LB manda tráfego; journey gate falha. Health timeout, interval e thresholds são medidos. Liveness não causa restart por outage externa breve. Backend removido draina requests e jobs. Regra de balanceamento considera sessão apenas quando necessário. Endpoint health não é substituto de auth/contract.

### Drain e deploy

Deploy remove backend do tráfego, espera requests em voo, define deadline e só então termina instance/pod. A baseline observa responses, connections, queues e effect cardinality. A mutação encerra worker depois de commit e retry duplica provider call; idempotency/outbox detecta. Long polling/streaming tem política. Scale-in usa mesma sequência. Candidate recebe canary antes de entrar em pool completo. Rollback readiciona backend compatível. LB config e application release possuem digests correlacionados.

### Alta disponibilidade e falhas

Load balancer pode ser altamente disponível, mas backends, DNS, certificate e dados também precisam de desenho. A baseline distribui réplicas e testa perda de target/subnet quando aplicável. A mutação concentra todos backends em fault domain e failure drill falha. Health failure gera alert com backend/release/região sem IP/secret excessivo. Failover não envia tráfego a versão não aprovada. Connection persistence e cache são avaliados. Capacity inclui pico durante drain. Incident runbook inclui bypass seguro somente se planejado.

### Segurança e observação

NSG limita origem/destino, WAF pode ficar na borda e logs registram request summary, status, latency e target class. A baseline redige headers/cookies/query sensível e limita acesso aos logs. A mutação confia em X-Forwarded-For de cliente como identidade e rate/auth tests falham. Access log não substitui audit de mudança. Métricas distinguem 4xx, 5xx, timeout, no healthy backend e TLS error. Alarmes têm runbook. Custo de bandwidth/LCU é acompanhado.

### Evidência e aceite

A banca testa certificado errado, readiness falsa, drain sob carga, backend concentrado, header spoof e outage. Aceite exige TLS correto, tráfego apenas a ready backend, effects únicos, HA coerente e logs seguros. Config parser prova intenção; OCI LB e browser/probes reais provam edge. Sem sandbox, claims ficam Pending. Evidence bundle contém listener/backend manifests, probes, drain timeline, metrics, audit e cleanup.

### Decisão operacional de Load balancers e health checks

A decisão sobre Load balancers e health checks começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de Load balancers e health checks precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de Load balancers e health checks combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## API Gateway e autenticação

API Gateway centraliza routes, autenticação, rate limit, validação e integração, mas não substitui autorização no backend nem torna policy automaticamente correta. Uma rota exposta por erro pode contornar WAF ou chamar Function com identity excessiva. A baseline declara hosts, methods, paths, upstreams, schemas, auth issuer/audience, quotas, CORS, logs e owner. A mutação cria wildcard route acima de admin e endpoint sensível fica público; route matrix precisa falhar.

### Routes e upstreams

Cada route define método, path, request/response mapping, backend e timeout. A baseline evita proxy genérico para URL controlada pelo cliente e valida destination allowlist. A mutação usa path parameter para escolher upstream e SSRF corpus acusa. Rewrite preserva query/headers apenas necessários. Error mapping não converte falha do backend em sucesso. Versioning é explícito. Route priority e catch-all recebem testes. Deploy de gateway é ligado a config digest e rollback.

### JWT e identidade

Gateway valida signature, issuer, audience, expiry e algoritmo, mas claims só são usadas conforme schema/authorization do serviço. A baseline rejeita token ausente, expirado, audience errada, key desconhecida e alg inadequado. A mutação aceita token de outro client/tenant e contract falha. JWKS cache/rotação possuem janela e fallback seguro. Token não é gravado em log. Gateway repassa subject mínimo ou token quando necessário, sem confiar em headers fornecidos pelo usuário. Backend revalida ações críticas.

### Rate limits e quotas

Rate limit usa chave confiável como principal/tenant/client e custo por rota, com burst, janela, Retry-After e comportamento em store failure. A baseline evita usar IP como única identidade autenticada. A mutação envia X-Forwarded-For arbitrário e bypassa limite; corpus falha. Endpoint caro tem custo maior. Limite não revela existência de usuário. Retry legítimo cabe no orçamento sem amplificar. Métricas mostram allow/deny/unknown com labels bounded. Override expira.

### CORS e browser

CORS é política de navegador para resource/origin/method/header, não autorização de servidor. A baseline permite origins conhecidas, não combina wildcard com credentials e varia Origin quando response muda. A mutação reflete Origin arbitrário e preflight security test falha. API machine-to-machine não depende de CORS. Error responses preservam policy deliberada. Authorization header não é liberado por convenience. Logs de preflight não contêm tokens. SPA preview usa origin isolada.

### Resiliência e observação

Gateway timeout, circuit breaker, retry e cache são decididos por route e effect semantics. A baseline não retrya POST não idempotente sem key/outcome. A mutação timeouta após backend commit e gateway repete; observer encontra duplicata. Health de upstream é monitorado, mas fallback não troca tenant/dado. Logs correlacionam request, route, release e backend without PII. SLO mede resposta correta, não 2xx apenas. Incident pode desabilitar route com approval. Cost de requests/egress é budgeted.

### Evidência e aceite

A banca testa wildcard route, JWT inválido, audience errada, rate bypass, CORS credential, SSRF rewrite e timeout pós-commit. Aceite exige rotas mínimas, auth válida, limite robusto, backend autorizado e effects corretos. Local parser/JWT fixtures provam lógica; OCI Gateway real prova enforcement. Sem sandbox, claims ficam Pending. Evidence bundle contém route spec, token cases redigidos, wire probes, metrics, audit, rollback e cleanup.

### Decisão operacional de API Gateway e autenticação

A decisão sobre API Gateway e autenticação começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de API Gateway e autenticação precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de API Gateway e autenticação combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## WAF, DDoS e bot controls

WAF e proteções de borda reduzem tráfego malicioso e custo, mas não substituem auth, validação, patch ou arquitetura de capacidade. Regra ampla pode bloquear cliente legítimo; exceção permissiva pode abrir todo origin. A baseline inventaria hosts/routes, threat model, policy, action, priority, owner, expiry, test corpus, false-positive budget e rollback. A mutação coloca allow-all temporário durante incidente e não remove; reconciliation deve alertar. Console ativo não prova enforcement em todos caminhos.

### Regras e prioridade

Rules são avaliadas em ordem/combinação e cobrem método, URI, header, body e rate conforme serviço. A baseline inicia em observação quando risco permite, mede eventos e promove para block com corpus positivo/negativo. A mutação muda prioridade e bypassa SQLi rule; test falha. Regras são versionadas/exportadas e explicam intenção. Encoding, case, path normalization e proxy headers entram no corpus. Exceção tem TTL. Change atômica evita janela aberta. Propagação é medida.

### Rate e bots

Bot control diferencia crawler permitido, automation própria, assistive client e abuso sem confiar em User-Agent sozinho. A baseline define key, response e fallback para API/webhook. A mutação aplica challenge em callback machine-to-machine e delivery falha; canary acusa. DDoS volumétrico pode ser tratado pela plataforma, mas origin ainda precisa body/concurrency/cache budgets. Rate limit por IP tem limites sob NAT. Challenge respeita acessibilidade. Bypass token tem escopo/TTL/audit. robots.txt não é segurança.

### Origin protection

WAF é inútil se origin pode ser acessado diretamente por IP, domain alternativo ou route interna. A baseline limita NSG, host validation, gateway/LB origins e testa bypass. A mutação chama backend público fora da borda e recebe resposta; architecture gate falha. Origin não confia em header de WAF sem caminho autenticado. Certificado/TLS mantêm hostname. Internal health não vira route pública. DNS e CDN aliases são inventariados. Incident pode restringir origin antes de tuning de regra.

### Observabilidade e privacidade

Eventos registram rule ID, action, route template, release e região com retention/acesso definidos. A baseline evita body, token, query completa ou IP além da necessidade. A mutação grava Authorization em WAF export e canary falha. Dashboard de hits não substitui teste de application outcome. Tuning compara blocked, allowed, support e origin load. Ausência de logs é alerta de pipeline. Export para SIEM usa identity mínima. Finding possui owner/due date.

### Resposta a ataque

Runbook classifica volume, application-layer, credential stuffing, bot, cache-bust e false positive. A baseline prepara contatos, thresholds, regras temporárias, comunicação, budget e rollback. A mutação bloqueia health/checkout e o monitor detecta. Contenção graduada preserva rotas críticas e dados. Feature kill switch é auditado. Atacante não recebe detalhes diagnósticos. Pós-incidente remove exceções, reconcilia custo e atualiza corpus. Evidence preserva amostra redigida e timeline.

### Evidência e aceite

A banca testa payload codificado, route bypass, bot legítimo, webhook, cache-bust, rule expirada e origin direto. Aceite exige corpus malicioso bloqueado, legítimo funcional, origin protegido, observação e recovery. Geradores locais provam cases; OCI WAF/edge reais provam enforcement. Sem sandbox, claims ficam Pending. Evidence bundle contém policy, cases, events redigidos, false-positive report, load/cost timeline, runbook e cleanup.

### Decisão operacional de WAF, DDoS e bot controls

A decisão sobre WAF, DDoS e bot controls começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de WAF, DDoS e bot controls precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de WAF, DDoS e bot controls combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.

## CDN, cache e domains

CDN e domains alteram bytes, freshness, routing e confiança externa. Cache rápido com chave errada vaza resposta personalizada; domain migrado sem ownership/TLS pode causar takeover ou outage. A baseline classifica routes/assets, cache directives, variants, origins, domains, DNS, certificates, owners, SLO e rollback. A mutação cacheia account com resposta pública e outro usuário recebe dados; cross-user corpus precisa falhar. URL estável não é domínio corretamente controlado.

### Cache semantics

Browser, CDN e application caches têm regras separadas. A baseline define public/private, max-age, shared TTL, stale behavior, Vary e invalidation por route. A mutação inclui Cookie/Authorization incorretamente ou omite locale e cache test acusa leak/conteúdo errado. HTML e manifests têm freshness distinta de assets content-addressed. Error cache é deliberado. Age/cache status alimenta diagnóstico. Header local prova intenção, mas edge real prova armazenamento. Cache key não contém segredo.

### Invalidation e rollout

Deploy novo pode coexistir com cache velho durante propagation. A baseline usa artifact hashes, invalidation seletiva, retention e monitor cold/warm/rollback. A mutação remove chunk antigo e HTML cacheado referencia 404; crawler falha. Purge global é exceção auditada. Revalidation é idempotente e não aceita path arbitrário. Rollback verifica assets/config/schema. Service worker é camada própria. Timeline registra release, generatedAt e region. Unknown propagation não vira sucesso.

### Domains, DNS e TLS

Domain attach valida ownership e project/compartment corretos; DNS records, delegation, TTL, CAA e certificate precisam source of truth. A baseline testa hostname, chain, renewal, canonical redirects e takeover after removal. A mutação muda nameserver antes de copiar email records e change plan falha. Certificate private key não é exposta. TLS version/cipher seguem policy. DNS propagation é observada de resolvers definidos. Domain transfer/revoke tem audit. Redirect não é open proxy.

### Origins e segurança

Origin access é restrito à CDN/LB esperada, hosts são allowlisted e forwarded headers são tratados como confiança de proxy. A baseline testa Host injection, redirect, cache poisoning e SSRF. A mutação usa X-Forwarded-Host para gerar link/canonical malicioso e security test falha. CORS não protege cache server-side. CDN logging redige query/token. WAF e rate limit complementam cache. Private content usa signed/authenticated path, não obscuridade. Egress do origin é limitado.

### Performance e custo

Hit ratio, origin load, bytes, stale age, image variants e egress entram em budgets por route/release. A baseline não aumenta TTL de preço além do SLO para economizar. A mutação gera query única e derrota cache; cardinalidade alert dispara. Compression e image optimization têm formatos/limites. Synthetic mede usuário, região e cache state. Billing export é reconciliado. Fallback de origin não serve dados errados. Cost optimization preserva correctness e recovery.

### Evidência e aceite

A banca testa dois usuários, locale/query, stale origin, deploy/rollback, asset 404, DNS/TLS, Host injection e cache-bust. Aceite exige isolamento, freshness, domains corretos, origin protegido e custo observável. Headers/fixtures provam policy; CDN/DNS/OCI reais provam edge. Sem sandbox, claims ficam Pending. Evidence bundle contém cache matrix, digests, DNS/TLS probes, wire summaries, metrics, audit e cleanup.

### Decisão operacional de CDN, cache e domains

A decisão sobre CDN, cache e domains começa por declarar o que é conhecido, qual é a fonte de verdade e qual efeito não pode ser repetido. O desenho registra owner, identidade, entrada, saída, limite de tempo e evidência antes de automatizar o caminho feliz. Um teste altera deliberadamente um pré-requisito e confere se o sistema interrompe com erro classificável, sem ampliar permissão ou esconder o estado. Essa disciplina transforma uma configuração aparentemente simples em contrato operável: revisão consegue explicar a escolha, executar a verificação e distinguir comportamento local de uma alegação que ainda depende de tenancy Oracle Cloud real.

### Falha controlada e recuperação

A recuperação de CDN, cache e domains precisa caber no orçamento de falha da jornada. O runbook define alarme, responsável, ação reversível, probe de confirmação e condição de escalonamento; retries possuem limite, jitter e idempotency, em vez de repetir uma mutação desconhecida. Um cenário de teste simula timeout depois do efeito e exige consulta por identificador estável antes de nova tentativa. Logs correlacionam request, recurso e decisão sem registrar segredo. Quando uma etapa externa não pode ser exercitada sem conta isolada, o relatório a marca Pending, preservando o plano e impedindo que documentação seja confundida com evidência de data plane.

### Revisão e aceite

O aceite de CDN, cache e domains combina uma prova positiva e uma negativa. A positiva percorre o caminho autorizado com fixtures sintéticas e salva o digest do manifesto, o resultado observado e o cleanup; a negativa usa origem, principal ou configuração errada e demonstra bloqueio. Um revisor independente deve conseguir repetir a leitura sem depender do console pessoal do autor. Divergência de tag, compartment, rota, policy, versão ou receipt abre triagem, não ajuste silencioso. Assim, a apostila enfatiza que operação madura é capacidade de explicar, limitar e recuperar decisões sob mudança, não apenas obter uma tela verde.
