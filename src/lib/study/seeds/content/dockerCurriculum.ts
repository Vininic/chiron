export type DockerLevel = "basico" | "intermediario" | "avancado";
export type DockerLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type DockerChapter = readonly [title: string, level: DockerLevel, primer: string, lessons: readonly DockerLesson[]];

/** Baseline editorial: Dockerfile/Compose atuais; engine, BuildKit, registry e host serão fixados pelos gates. */
export const DOCKER_CURRICULUM: readonly DockerChapter[] = [
  ["Modelo de containers", "basico", "Imagem é conteúdo imutável; container é processo isolado com estado e limites fornecidos pelo host.", [
    ["Imagens, manifests e layers", "imagem referencia config e layers content-addressed, possivelmente por manifest multi-plataforma", "OCI image/index, digest, layer, config, overlay e history", "tag foi tratada como bytes imutáveis e duas máquinas executaram imagens diferentes"],
    ["Containers, processos e isolamento", "container é processo do host com namespaces, cgroups e filesystem composto, não uma VM completa", "PID 1, namespaces, cgroups, capabilities, rootfs e runtime", "processo root no container alcançou recurso do host por isolamento excessivo"],
    ["Cliente, daemon, contexts e APIs", "cliente opera um endpoint privilegiado e context/TLS/permissions definem qual host será alterado", "Docker CLI, daemon API, socket, contexts, SSH/TLS e rootless", "script limpou containers no daemon de produção por context implícito"],
    ["Lifecycle, sinais e cleanup", "create/start/stop/kill/remove têm estados e sinais distintos e cleanup precisa ownership explícito", "container lifecycle, exit codes, SIGTERM/SIGKILL, stop timeout e labels", "PID 1 ignorou TERM e job perdeu dados no kill"],
  ]],
  ["Dockerfile e builds", "basico", "Dockerfile é programa de build por stages; contexto, ordem e mounts determinam conteúdo, cache e sigilo.", [
    ["Contexto, .dockerignore e COPY", "somente contexto permitido entra no build e COPY seleciona paths com ownership/modos deliberados", "build context, .dockerignore, COPY, ADD, --chown, --chmod e symlinks", "segredo e gigabytes de cache foram enviados ao builder"],
    ["RUN, layers e cache", "cada instrução transforma snapshot e cache key deve refletir inputs, rede e package metadata", "RUN, shell/exec form, layer cleanup, cache invalidation e reproducibility", "apt index stale foi reutilizado e pacote não reproduziu"],
    ["Multi-stage, targets e artifacts", "stages separam toolchain de runtime e somente artifacts verificados atravessam a fronteira", "FROM AS, COPY --from, target, debug/test/runtime e distroless", "imagem final carregou compiler, source e credenciais do build"],
    ["BuildKit, mounts e secrets", "cache, bind, tmpfs, ssh e secret mounts fornecem inputs sem persistir em layers quando usados corretamente", "syntax directive, RUN --mount, cache sharing, secret/ssh e network", "token passado por ARG permaneceu no history e cache exportado"],
  ]],
  ["Identidade e supply chain de imagens", "basico", "Tag é ponteiro; digest, provenance e policy ligam bytes, builder e source confiáveis.", [
    ["Tags, digests e multi-platform", "deploy fixa digest/manifest e plataforma compatível em vez de depender de tag mutável", "image reference, repo digest, manifest list/index, architecture e pull policy", "latest mudou entre nodes e produziu mixed release"],
    ["Bases, pinning e atualização", "base image é dependência com digest, lifecycle e atualização deliberada", "FROM digest, distro variants, package locks, rebuild cadence e compatibility", "base antiga manteve CVE e pin nunca foi renovado"],
    ["SBOM, provenance e assinatura", "inventário e attestation precisam ser verificados por policy sobre o digest final", "SBOM SPDX/CycloneDX, OCI artifacts, provenance, signing e verification", "assinatura válida de identity errada liberou imagem alterada"],
    ["Registries, auth e imutabilidade", "registry namespace, permissions, retention e immutability impedem overwrite e dependency confusion", "login helpers, scopes, push/pull, garbage collection, replication e tag policy", "push repetido substituiu versão já implantada"],
  ]],
  ["Configuração e execução", "intermediario", "Runtime contract explicita comando, configuração, identidade, saúde e encerramento sem embutir ambiente.", [
    ["ENTRYPOINT, CMD e argumentos", "exec form preserva argumentos/sinais e separa executable de defaults sobrescrevíveis", "ENTRYPOINT, CMD, shell/exec, override e PID 1", "wrapper shell engoliu sinal e concatenou input em comando"],
    ["Environment, config e secrets", "config pública e segredo entram por canais distintos, validados no startup e nunca na imagem/log", "ENV, --env-file, configs, secrets, tmpfs e precedence", "senha ficou em ENV/history e apareceu no inspect"],
    ["Usuários, capabilities e filesystem", "processo roda sem root/capabilities desnecessárias e rootfs pode ser read-only com paths graváveis explícitos", "USER, UID/GID, cap-drop/add, no-new-privileges, seccomp e read-only", "volume/socket devolveu privilégio do host apesar de USER não root"],
    ["Healthchecks, restart e readiness", "liveness/readiness/startup e restart policies observam condições diferentes e evitam loops", "HEALTHCHECK, interval/timeout/retries/start-period, restart e dependency health", "health superficial reiniciou serviço saudável enquanto dependência falhava"],
  ]],
  ["Persistência e dados", "intermediario", "Container é descartável; dados duráveis possuem volume, ownership, backup, migration e restore testados.", [
    ["Writable layer, volumes e binds", "writable layer é efêmera; named volume e bind mount têm lifecycle/trust distintos", "overlay copy-up, volume, bind, tmpfs, mount syntax e propagation", "database gravou na layer e desapareceu ao recriar"],
    ["Permissões, UID/GID e plataformas", "ownership numérico, user namespaces e host OS determinam acesso e portabilidade", "UID/GID, chown, umask, rootless mapping, SELinux labels e Windows paths", "container funcionou como root mas falhou em produção non-root"],
    ["Backups, migrations e restores", "backup consistente inclui dados e metadata e só existe quando restore drill cumpre RPO/RTO", "volume snapshot, application dump, quiesce, checksum, encryption e restore", "tar de volume ativo capturou estado inconsistente"],
    ["Bancos em containers", "containerizar banco não remove requisitos de durability, isolation, upgrades e operação", "fsync, storage driver, signals, init scripts, replication e version upgrades", "banco de produção usou volume local descartável e update automático"],
  ]],
  ["Rede e comunicação", "intermediario", "Network namespace, DNS e published ports compõem alcance; aplicação ainda precisa timeout, TLS e autenticação.", [
    ["Bridges, DNS e ports", "containers em user-defined network usam DNS por nome; publishing expõe host address/port deliberadamente", "bridge, veth, embedded DNS, EXPOSE, -p, bind address e IPv4/IPv6", "porta administrativa foi publicada em todas as interfaces"],
    ["Ingress, proxies e TLS", "proxy termina ou encaminha TLS/HTTP sob trust e headers explicitamente configurados", "reverse proxy, Host, X-Forwarded-*, trusted proxies, certificates e websocket", "aplicação confiou em X-Forwarded-For enviado pelo cliente"],
    ["Service discovery e aliases", "nome de serviço resolve instâncias mutáveis e cliente lida com reconexão, não fixa IP", "network aliases, DNS TTL, container replacement, localhost e host gateway", "consumer salvou IP do container e quebrou após recreate"],
    ["Egress, timeouts e falhas", "saída de rede é capability controlada e chamadas têm deadline, retry idempotente e backpressure", "egress policy, proxy, DNS failure, connect/read timeout e circuit breaking", "retry sem idempotência duplicou efeito externo"],
  ]],
  ["Docker Compose", "intermediario", "Compose descreve aplicação multi-container local/operacional com projects, dependencies e configuração reproduzível.", [
    ["Compose Specification e projects", "modelo final resulta de files, interpolation, profiles e project name e deve ser inspecionado", "compose.yaml, services, networks, volumes, configs, project e config", "dois projetos compartilharam nome/volume e misturaram dados"],
    ["Dependencies, health e startup", "depends_on ordena criação conforme condições suportadas, mas aplicação precisa retry/readiness", "depends_on, service_healthy, healthcheck, restart e one-shot migrations", "API iniciou após container do banco, antes de o banco aceitar conexões"],
    ["Interpolation, env e secrets", "substituição do modelo, environment do container e secrets têm escopos/prece­dência diferentes", ".env, env_file, environment, interpolation operators, secrets e config", "variável ausente virou vazio e stack apontou para produção"],
    ["Overrides, profiles e desenvolvimento", "dev/test/prod usam merges explícitos sem transformar override local em configuração de produção", "multiple files, merge rules, profiles, watch, bind mounts e develop", "override de debug publicou porta e root filesystem em produção"],
  ]],
  ["Testes e produtividade", "intermediario", "Containers tornam dependencies reproduzíveis somente quando readiness, isolamento e cleanup são provados.", [
    ["Testes efêmeros de integração", "cada execução cria rede/volume/containers isolados, espera readiness e limpa mesmo após falha", "unique project, compose up/down, exit-code-from, wait, labels e traps", "suites paralelas compartilharam banco e produziram falso verde"],
    ["Testcontainers e fixtures reais", "test framework controla engine real por digest e fornece endpoint dinâmico sem chamar fake de integração", "Testcontainers, lifecycle, reuse, wait strategies, ports e logs", "teste usou imagem flutuante e versão mudou no CI"],
    ["Inspect, logs, exec e debug", "diagnóstico observa config/state/process/network/mount/log antes de mutar container", "inspect, ps, logs, stats, top, events, exec e debug sidecar", "exec manual corrigiu instância e escondeu drift não reproduzível"],
    ["Recursos e performance", "CPU, memória, PIDs, I/O e filesystem limits são parte do teste e da capacidade", "--memory, --cpus, pids-limit, OOM, stats, ulimits e load", "sem limite um container derrubou o host e o health ficou verde"],
  ]],
  ["Segurança de containers", "avancado", "Segurança combina supply chain, daemon boundary, runtime least privilege e resposta a vulnerabilidade/segredo.", [
    ["Build e supply-chain adversarial", "contexto, base, package, action e builder são inputs não confiáveis fixados e verificados", "hermetic build, network controls, digest, SBOM, provenance e policy", "Dockerfile baixou script mutável e executou como root"],
    ["Isolamento, rootless e sandbox", "namespaces/cgroups não são boundary absoluta e workloads hostis exigem rootless/sandbox/VM conforme risco", "rootless, userns-remap, seccomp, AppArmor/SELinux, gVisor/Kata e socket", "montar docker.sock concedeu controle total do daemon/host"],
    ["Scanning, policy e patching", "findings de OS/app/image/config são triados por alcance e imagem é reconstruída, não remendada em execução", "vulnerability scan, Dockerfile lint, admission policy, severity e rebuild", "scanner verde ignorou autorização removida e base EOL"],
    ["Segredos, incidentes e forensics", "segredo em layer é revogado e image retirada; investigação preserva digest/config/events sem executar payload", "history/save, registry/audit, credential rotation, quarantine e evidence hashes", "deletar tag deixou layers públicas e token válido"],
  ]],
  ["Produção e entrega", "avancado", "Imagem é unidade de entrega; scheduler, probes, limits e rollout pertencem à plataforma alvo e ao artifact exato.", [
    ["Docker versus orquestração", "Docker executa containers; scheduling, desired replicas e failover exigem Compose/Swarm/Kubernetes/plataforma com contratos próprios", "Engine, Compose, Swarm, Kubernetes, services/tasks/pods e control plane", "Compose de laptop foi tratado como HA de produção"],
    ["Limits, probes e graceful shutdown", "requests/limits, readiness/liveness e termination grace preservam capacidade durante falha/deploy", "resource reservations, OOM, probes, preStop, SIGTERM e drain", "scheduler enviou tráfego durante startup e matou request no rollout"],
    ["Logs, metrics e traces", "stdout/stderr, runtime metrics e application telemetry têm correlação, redaction e retention", "logging drivers, rotation, events, cAdvisor/OpenTelemetry e container labels", "json logs encheram disco e incluíram segredo"],
    ["Deploy, canary e rollback", "deploy promove digest aprovado, observa canary e reverte artifact/config/schema compatíveis", "pull by digest, rolling/blue-green/canary, health, migration e rollback", "rollback por tag trouxe bytes diferentes e schema incompatível"],
  ]],
  ["Operação e recuperação", "avancado", "Operar Docker exige capacidade de disco/daemon, limpeza segura, backups e resposta que preserve evidência.", [
    ["Disk, prune e retention", "images, layers, volumes, containers, logs e build cache têm owners/retention antes de qualquer prune", "system df, image/container/volume/buildx prune, labels, dry-run inventory e GC", "prune removeu volume órfão que era único backup"],
    ["Daemon, builders e upgrades", "daemon/runtime/BuildKit/storage driver são infraestrutura versionada com drain, upgrade e rollback", "daemon.json, live restore, builders, storage driver, API version e compatibility", "upgrade no-place corrompeu cache e reiniciou banco sem drain"],
    ["Backup, restore e disaster recovery", "restore inclui imagens/digests, registry, volumes/dumps, config/secrets e plataforma, testado em host vazio", "registry mirror/export, volume dump, manifest, encryption, RPO/RTO e drill", "docker save foi chamado de backup embora dados e secrets faltassem"],
    ["Incidentes e cadeia de custódia Docker", "contenção isola host/daemon/image e coleta evidence antes de cleanup/rebuild confiável", "events, inspect, logs, image digest/save, host forensics, revocation e timeline", "restart e prune destruíram processo/filesystem que explicavam intrusão"],
  ]],
  ["Projeto Quíron com Docker", "avancado", "A banca integra build, runtime, dados, rede, segurança, release e restore da aplicação Quíron.", [
    ["Baseline containerizado do Quíron", "repo produz imagens mínimas/reproduzíveis e Compose local isolado sem segredo ou dependência oculta", "Dockerfiles multi-stage, ignore, compose, health, non-root, networks e volumes", "clone limpo não iniciou porque dependia de bind/config local"],
    ["Última vaga em stack real", "API e banco em containers exercitam duas sessões, constraint, outbox e crash/replay no engine fixado", "Compose/Testcontainers, barriers, health, volume, network failure e provider adapter", "stack verde serializou o teste e não detectou overbooking"],
    ["Release por digest e rollback", "CI constrói uma vez, atesta/escaneia, publica digest e promove o mesmo artifact com migration compatível", "BuildKit, SBOM/provenance, registry, digest deploy, canary e rollback", "produção recompilou a tag e recebeu imagem diferente"],
    ["Banca, incidente e restore Docker", "host perdido, secret/layer vazado e image comprometida são contidos e restaurados dentro do RPO/RTO", "evidence, rotation, registry/volume backup, new host, verification e reconciliation", "containers voltaram, mas volume/outbox/rules e provenance não"],
  ]],
];
