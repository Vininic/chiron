export type DockerExample = { lang: "bash" | "dockerfile" | "json"; code: string; purpose: string };
export const DOCKER_EXAMPLES: Record<string, [DockerExample, DockerExample]> = {
  "Imagens, manifests e layers": [
    { lang: "bash", purpose: "Resolve tag em repo digest e inspeciona plataforma, config e layers sem confundir image ID.", code: `set -euo pipefail
ref='registry.example/acme/chiron:1.2.0'
docker pull "$ref"
docker image inspect "$ref" --format '{{json .RepoDigests}} {{.Os}}/{{.Architecture}} {{.Id}}'
docker buildx imagetools inspect "$ref" --raw > manifest.json
jq -e '.schemaVersion == 2' manifest.json >/dev/null` },
    { lang: "dockerfile", purpose: "Mantém segredo fora das layers usando mount efêmero e separa artifact do stage de build.", code: `# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim@sha256:SUBSTITUA_PELO_DIGEST AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine@sha256:SUBSTITUA_PELO_DIGEST
COPY --from=build /src/dist /usr/share/nginx/html
USER 101
LABEL org.opencontainers.image.source="https://example.invalid/acme/chiron"` },
  ],
  "Containers, processos e isolamento": [
    { lang: "bash", purpose: "Executa processo non-root com rootfs read-only, capabilities removidas e tmpfs explícito.", code: `set -euo pipefail
docker run --rm --name chiron-isolation \
  --user 10001:10001 --cap-drop ALL --security-opt no-new-privileges \
  --read-only --tmpfs /tmp:rw,noexec,nosuid,size=16m \
  --memory 128m --cpus 0.5 --pids-limit 64 \
  alpine@sha256:SUBSTITUA_PELO_DIGEST \
  sh -eu -c 'test "$(id -u)" = 10001; touch /tmp/ok; ! touch /blocked'` },
    { lang: "bash", purpose: "Inspeciona namespaces e limites sem montar socket, devices ou modos host/privileged.", code: `set -euo pipefail
id="$(docker run -d --read-only --cap-drop ALL --pids-limit 32 alpine@sha256:SUBSTITUA_PELO_DIGEST sleep 30)"
trap 'docker rm -f "$id" >/dev/null 2>&1 || true' EXIT
docker inspect "$id" --format '{{json .HostConfig.SecurityOpt}} {{.HostConfig.Privileged}} {{.HostConfig.PidsLimit}}'
pid="$(docker inspect "$id" --format '{{.State.Pid}}')"
test "$pid" -gt 0
docker top "$id"` },
  ],
  "Cliente, daemon, contexts e APIs": [
    { lang: "bash", purpose: "Recusa mutação se context e label do daemon não correspondem ao ambiente esperado.", code: `set -euo pipefail
expected_context='chiron-staging'
test "$(docker context show)" = "$expected_context"
docker --context "$expected_context" version --format '{{json .Server}}' > server.json
docker --context "$expected_context" info --format '{{json .Labels}}' > labels.json
jq -e 'index("environment=staging") != null' labels.json >/dev/null
docker --context "$expected_context" ps --filter label=owner=chiron` },
    { lang: "bash", purpose: "Reconcilia create após resposta ambígua usando nome, labels e image digest antes de repetir.", code: `set -euo pipefail
name='chiron-job-op-42'; image='registry.example/acme/job@sha256:SUBSTITUA_PELO_DIGEST'
existing="$(docker ps -aq --filter "name=^/$name$")"
if test -n "$existing"; then
  test "$(docker inspect "$existing" --format '{{index .Config.Labels "operation"}}')" = op-42
  test "$(docker inspect "$existing" --format '{{.Config.Image}}')" = "$image"
else
  docker create --name "$name" --label owner=chiron --label operation=op-42 "$image"
fi` },
  ],
  "Lifecycle, sinais e cleanup": [
    { lang: "dockerfile", purpose: "Usa exec-form e wrapper com exec para que a aplicação seja PID 1 e receba TERM.", code: `FROM node:22-bookworm-slim@sha256:SUBSTITUA_PELO_DIGEST
WORKDIR /app
COPY --chown=10001:10001 server.js entrypoint.sh ./
RUN chmod 0555 entrypoint.sh && chmod 0444 server.js
USER 10001:10001
STOPSIGNAL SIGTERM
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "/app/server.js"]
# entrypoint.sh termina com: exec "$@"` },
    { lang: "bash", purpose: "Mede encerramento por TERM e remove somente o container identificado por label da execução.", code: `set -euo pipefail
run_id='fixture-42'; name="chiron-$run_id"
id="$(docker run -d --name "$name" --label owner=chiron --label "run=$run_id" chiron/app@sha256:SUBSTITUA_PELO_DIGEST)"
cleanup() { docker rm -f "$id" >/dev/null 2>&1 || true; }
trap cleanup EXIT
started="$(date +%s)"; docker stop --time 20 "$id" >/dev/null; ended="$(date +%s)"
test "$((ended-started))" -le 20
test "$(docker inspect "$id" --format '{{.State.ExitCode}}')" -eq 0
test "$(docker inspect "$id" --format '{{index .Config.Labels "run"}}')" = "$run_id"` },
  ],
  "Contexto, .dockerignore e COPY": [
    { lang: "dockerfile", purpose: "Copia manifests antes do source, fixa ownership/modos e mantém contexto sensível fora do build.", code: `# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim@sha256:SUBSTITUA_PELO_DIGEST AS build
WORKDIR /src
COPY --chown=10001:10001 --chmod=0444 package.json package-lock.json ./
RUN npm ci
COPY --chown=10001:10001 . ./
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine@sha256:SUBSTITUA_PELO_DIGEST
COPY --from=build --chown=101:101 /src/dist/ /usr/share/nginx/html/
USER 101` },
    { lang: "bash", purpose: "Audita contexto permitido e falha se segredo, Git metadata, cache ou output estiver incluído.", code: `set -euo pipefail
context="$(mktemp -d)"; trap 'rm -rf "$context"' EXIT
printf '%s\n' '.git' '.env*' 'node_modules' 'dist' '*.pem' >"$context/.dockerignore"
printf '{}\n' >"$context/package.json"; printf 'source\n' >"$context/app.js"; printf 'fixture-only\n' >"$context/.env"
tar -C "$context" --exclude-from="$context/.dockerignore" -cf "$context.tar" .
tar -tf "$context.tar" >"$context.list"
grep -F './app.js' "$context.list" >/dev/null
if grep -E '(^|/)\.env|(^|/)\.git/|node_modules|dist/|\.pem$' "$context.list"; then exit 1; fi` },
  ],
  "RUN, layers e cache": [
    { lang: "dockerfile", purpose: "Mantém update/install/cleanup na mesma layer e compila sem rede após dependências fixadas.", code: `# syntax=docker/dockerfile:1
FROM debian:bookworm-slim@sha256:SUBSTITUA_PELO_DIGEST AS deps
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates=20230311+deb12u1 make=4.3-4.1 && \
    test -x /usr/bin/make

FROM deps AS build
WORKDIR /src
COPY . .
RUN --network=none make artifact` },
    { lang: "bash", purpose: "Compara builds frios independentes por digest de artifact e registra cache em progresso plain.", code: `set -euo pipefail
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
docker buildx build --no-cache --progress=plain --target export --output "type=local,dest=$tmp/a" . >"$tmp/a.log" 2>&1
docker buildx build --no-cache --progress=plain --target export --output "type=local,dest=$tmp/b" . >"$tmp/b.log" 2>&1
first="$(sha256sum "$tmp/a/chiron.tar" | cut -d' ' -f1)"
second="$(sha256sum "$tmp/b/chiron.tar" | cut -d' ' -f1)"
test "$first" = "$second"
if grep -Ei '(token|password|secret)=' "$tmp/a.log" "$tmp/b.log"; then exit 1; fi` },
  ],
  "Multi-stage, targets e artifacts": [
    { lang: "dockerfile", purpose: "Separa deps, teste, build, debug e runtime e copia somente artifact verificado.", code: `# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim@sha256:SUBSTITUA_PELO_DIGEST AS deps
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS test
COPY . .
RUN npm test

FROM test AS build
RUN npm run build && sha256sum dist/app.js > dist/SHA256SUMS

FROM build AS debug
CMD ["node", "--inspect=0.0.0.0:9229", "src/server.js"]

FROM gcr.io/distroless/nodejs22-debian12@sha256:SUBSTITUA_PELO_DIGEST AS runtime
WORKDIR /app
COPY --from=build --chown=65532:65532 /src/dist/ ./
USER 65532:65532
CMD ["app.js"]` },
    { lang: "bash", purpose: "Constrói targets deliberados e recusa runtime que contenha source, compiler, shell ou usuário root.", code: `set -euo pipefail
docker buildx build --target test --progress=plain .
docker buildx build --target runtime --load -t chiron/runtime:fixture .
test "$(docker image inspect chiron/runtime:fixture --format '{{.Config.User}}')" != ''
test "$(docker image inspect chiron/runtime:fixture --format '{{.Config.User}}')" != '0'
docker run --rm --entrypoint /nodejs/bin/node chiron/runtime:fixture -e "require('fs').accessSync('/app/app.js')"
docker run --rm --entrypoint /nodejs/bin/node chiron/runtime:fixture -e "const f=require('fs'); if(f.existsSync('/src')||f.existsSync('/bin/sh'))process.exit(1)"` },
  ],
  "BuildKit, mounts e secrets": [
    { lang: "dockerfile", purpose: "Usa mounts required para registry e SSH sem persistir credenciais e compila com rede desabilitada.", code: `# syntax=docker/dockerfile:1.12
FROM node:22-bookworm-slim@sha256:SUBSTITUA_PELO_DIGEST AS build
WORKDIR /src
RUN mkdir -p -m 0700 /root/.ssh && ssh-keyscan -t ed25519 git.example.invalid > /root/.ssh/known_hosts
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc,required=true \
    --mount=type=ssh,required=true \
    --mount=type=cache,id=chiron-npm,target=/root/.npm,sharing=locked \
    npm ci
COPY . .
RUN --network=none npm run build` },
    { lang: "bash", purpose: "Cria builder isolado, passa secrets fora de ARG e exporta cache separado do artifact final.", code: `set -euo pipefail
builder="chiron-$RANDOM"; tmp="$(mktemp -d)"
cleanup() { docker buildx rm "$builder" >/dev/null 2>&1 || true; rm -rf "$tmp"; }
trap cleanup EXIT
docker buildx create --name "$builder" --driver docker-container --use --bootstrap
printf '//registry.example.invalid/:_authToken=fixture-not-real\n' >"$tmp/npmrc"; chmod 0600 "$tmp/npmrc"
docker buildx build --builder "$builder" --secret "id=npmrc,src=$tmp/npmrc" \
  --cache-from type=registry,ref=registry.example/acme/chiron:buildcache \
  --cache-to type=registry,ref=registry.example/acme/chiron:buildcache,mode=max \
  --provenance=mode=max --sbom=true --output "type=oci,dest=$tmp/chiron.tar" .
if tar -xf "$tmp/chiron.tar" -O 2>/dev/null | grep -F 'fixture-not-real'; then exit 1; fi` },
  ],
  "Tags, digests e multi-platform": [
    { lang: "bash", purpose: "Constrói manifests por plataforma, publica index e registra digests antes da promoção.", code: `set -euo pipefail
ref='registry.example/acme/chiron:1.2.0'
docker buildx build --platform linux/amd64,linux/arm64 --provenance=mode=max --sbom=true --push -t "$ref" .
docker buildx imagetools inspect "$ref" --raw > index.json
jq -e '.manifests | length == 2' index.json >/dev/null
jq -e '[.manifests[].platform.architecture] | sort == ["amd64","arm64"]' index.json >/dev/null
docker buildx imagetools inspect "$ref" --format '{{json .Manifest}}' > resolved.json` },
    { lang: "bash", purpose: "Resolve channel em digest e demonstra que execução fixada não acompanha movimento posterior da tag.", code: `set -euo pipefail
channel='registry.example/acme/chiron:stable'
docker pull "$channel"
pinned="$(docker image inspect "$channel" --format '{{index .RepoDigests 0}}')"
case "$pinned" in *@sha256:*) ;; *) exit 1;; esac
docker run --rm "$pinned" --version > before.txt
# Após uma promoção autorizada da tag stable, o subject fixado permanece o mesmo.
docker pull "$channel"
docker run --rm "$pinned" --version > after.txt
cmp before.txt after.txt` },
  ],
  "Bases, pinning e atualização": [
    { lang: "dockerfile", purpose: "Fixa base legível por versão e digest, preservando usuário non-root e runtime mínimo.", code: `# syntax=docker/dockerfile:1
ARG NODE_BASE=node:22-bookworm-slim@sha256:SUBSTITUA_PELO_DIGEST
FROM \${NODE_BASE} AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs22-debian12@sha256:SUBSTITUA_PELO_DIGEST
WORKDIR /app
COPY --from=build --chown=65532:65532 /src/dist/ ./
USER 65532:65532
CMD ["server.js"]` },
    { lang: "bash", purpose: "Compara base antiga e candidata por digest, packages, SBOM e contrato antes de atualizar o pin.", code: `set -euo pipefail
old='registry.example/acme/chiron-base@sha256:DIGEST_ANTIGO'
candidate='registry.example/acme/chiron-base@sha256:DIGEST_CANDIDATO'
test "$old" != "$candidate"
docker pull "$candidate"
docker image inspect "$candidate" --format '{{.Os}}/{{.Architecture}} {{.Config.User}}' > candidate.config
docker scout sbom "$candidate" --format spdx --output candidate.spdx.json
jq -e '.packages | length > 0' candidate.spdx.json >/dev/null
docker buildx build --build-arg "NODE_BASE=$candidate" --target test --progress=plain .
docker buildx build --build-arg "NODE_BASE=$candidate" --target runtime --load -t chiron:candidate .
docker run --rm chiron:candidate --self-test` },
  ],
  "SBOM, provenance e assinatura": [
    { lang: "bash", purpose: "Publica imagem com SBOM/provenance e verifica subject por política de identidade e repositório.", code: `set -euo pipefail
ref='registry.example/acme/chiron:1.2.0'
docker buildx build --push --sbom=true --provenance=mode=max -t "$ref" .
digest="$(docker buildx imagetools inspect "$ref" --format '{{.Manifest.Digest}}')"
case "$digest" in sha256:*) ;; *) exit 1;; esac
cosign sign --yes "$ref@$digest"
cosign verify "$ref@$digest" \
  --certificate-identity-regexp '^https://github.com/acme/chiron/.github/workflows/release.yml@refs/tags/' \
  --certificate-oidc-issuer 'https://token.actions.githubusercontent.com' > verification.json
jq -e 'length > 0' verification.json >/dev/null` },
    { lang: "bash", purpose: "Obtém SBOM do digest final e recusa attestation cujo subject não corresponde ao manifest.", code: `set -euo pipefail
subject='registry.example/acme/chiron@sha256:SUBSTITUA_PELO_DIGEST'
docker scout sbom "$subject" --format spdx --output sbom.spdx.json
jq -e '.packages | length > 0' sbom.spdx.json >/dev/null
cosign verify-attestation "$subject" --type slsaprovenance \
  --certificate-identity-regexp '^https://github.com/acme/chiron/.github/workflows/release.yml@refs/tags/' \
  --certificate-oidc-issuer 'https://token.actions.githubusercontent.com' > provenance.jsonl
jq -e '.payload != null' provenance.jsonl >/dev/null
test "$(printf '%s' "$subject" | sed 's/.*@//')" = 'sha256:SUBSTITUA_PELO_DIGEST'` },
  ],
  "Registries, auth e imutabilidade": [
    { lang: "bash", purpose: "Usa config efêmera e token por stdin, publica versão única e reconcilia o digest remoto.", code: `set -euo pipefail
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT; export DOCKER_CONFIG="$tmp/docker"
mkdir -m 0700 "$DOCKER_CONFIG"
printf '%s' "$REGISTRY_TOKEN" | docker login registry.example --username chiron-ci --password-stdin
ref='registry.example/acme/chiron:1.2.0'; docker push "$ref"
local_digest="$(docker image inspect "$ref" --format '{{index .RepoDigests 0}}' | sed 's/.*@//')"
remote_digest="$(docker buildx imagetools inspect "$ref" --format '{{.Manifest.Digest}}')"
test "$local_digest" = "$remote_digest"
docker logout registry.example >/dev/null` },
    { lang: "bash", purpose: "Promove somente o mesmo digest para um channel tag e bloqueia overwrite divergente da versão.", code: `set -euo pipefail
version='registry.example/acme/chiron:1.2.0'; channel='registry.example/acme/chiron:stable'
expected="$(docker buildx imagetools inspect "$version" --format '{{.Manifest.Digest}}')"
current="$(docker buildx imagetools inspect "$channel" --format '{{.Manifest.Digest}}' 2>/dev/null || true)"
if test -n "$current" && test "$current" != "$expected"; then
  printf 'channel points to another digest; promotion requires approval\n' >&2; exit 1
fi
docker buildx imagetools create --tag "$channel" "$version@$expected"
test "$(docker buildx imagetools inspect "$channel" --format '{{.Manifest.Digest}}')" = "$expected"` },
  ],
  "ENTRYPOINT, CMD e argumentos": [
    { lang: "dockerfile", purpose: "Define executable e defaults em exec form, wrapper com exec e signal explícito.", code: `FROM node:22-bookworm-slim@sha256:SUBSTITUA_PELO_DIGEST
WORKDIR /app
COPY --chown=10001:10001 --chmod=0555 entrypoint.sh ./
COPY --chown=10001:10001 --chmod=0444 server.js ./
USER 10001:10001
STOPSIGNAL SIGTERM
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "/app/server.js", "--port", "8080"]
# entrypoint.sh:
# #!/bin/sh
# set -eu
# exec "$@"` },
    { lang: "bash", purpose: "Prova defaults, override de CMD e preservação de argumentos adversariais como argv separado.", code: `set -euo pipefail
image='chiron/argv@sha256:SUBSTITUA_PELO_DIGEST'
docker image inspect "$image" --format '{{json .Config.Entrypoint}} {{json .Config.Cmd}}' > config.txt
grep -F '["/app/entrypoint.sh"]' config.txt >/dev/null
docker run --rm "$image" node /app/print-argv.js '--leading-dash' 'space value' '$(not-executed)' > argv.json
jq -e '.[0] == "--leading-dash" and .[1] == "space value" and .[2] == "$(not-executed)"' argv.json >/dev/null` },
  ],
  "Environment, config e secrets": [
    { lang: "bash", purpose: "Passa config pública e secret por arquivo read-only, valida permissões e evita ENV sensível.", code: `set -euo pipefail
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
printf '{"logLevel":"info","publicBaseUrl":"https://example.invalid"}\n' >"$tmp/config.json"
printf 'fixture-not-real\n' >"$tmp/provider-token"; chmod 0400 "$tmp/provider-token"
docker run --rm --read-only --user 10001:10001 \
  --mount "type=bind,src=$tmp/config.json,dst=/run/config.json,readonly" \
  --mount "type=bind,src=$tmp/provider-token,dst=/run/secrets/provider-token,readonly" \
  -e CHIRON_CONFIG=/run/config.json \
  chiron/app@sha256:SUBSTITUA_PELO_DIGEST --validate-config
docker image inspect chiron/app@sha256:SUBSTITUA_PELO_DIGEST --format '{{json .Config.Env}}' | grep -v 'fixture-not-real' >/dev/null` },
    { lang: "bash", purpose: "Renderiza Compose final e rejeita placeholder vazio, segredo em environment ou endpoint de produção no perfil dev.", code: `set -euo pipefail
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
CHIRON_API_URL='http://api:8080' CHIRON_LOG_LEVEL='debug' docker compose -f compose.yaml -f compose.dev.yaml config --format json >"$tmp/model.json"
jq -e '.services.web.environment.CHIRON_API_URL == "http://api:8080"' "$tmp/model.json" >/dev/null
jq -e '.services.web.environment.CHIRON_LOG_LEVEL == "debug"' "$tmp/model.json" >/dev/null
if jq -r '.. | strings' "$tmp/model.json" | grep -E '(^$|CHANGEME|PASSWORD=|TOKEN=|prod\.example)'; then exit 1; fi` },
  ],
  "Usuários, capabilities e filesystem": [
    { lang: "bash", purpose: "Executa serviço funcional com UID dedicado, caps zeradas, no-new-privileges e rootfs read-only.", code: `set -euo pipefail
id="$(docker run -d --name chiron-locked \
  --user 10001:10001 --cap-drop ALL --security-opt no-new-privileges \
  --read-only --tmpfs /tmp:rw,noexec,nosuid,size=16m \
  chiron/app@sha256:SUBSTITUA_PELO_DIGEST)"
trap 'docker rm -f "$id" >/dev/null 2>&1 || true' EXIT
test "$(docker exec "$id" id -u)" = 10001
docker exec "$id" sh -c 'touch /tmp/ok; ! touch /app/blocked'
test "$(docker inspect "$id" --format '{{.HostConfig.Privileged}}')" = false
test "$(docker inspect "$id" --format '{{json .HostConfig.CapDrop}}')" = '["ALL"]'` },
    { lang: "bash", purpose: "Audita mounts e recusa socket, host root, privileged e namespaces compartilhados.", code: `set -euo pipefail
id="$1"; docker inspect "$id" > inspect.json
jq -e '.[0].HostConfig.Privileged == false' inspect.json >/dev/null
jq -e '.[0].HostConfig.PidMode == "" and .[0].HostConfig.NetworkMode != "host"' inspect.json >/dev/null
jq -e 'all(.[0].Mounts[]?; (.Source != "/var/run/docker.sock") and (.Source != "/") and (.RW == false or .Type == "volume"))' inspect.json >/dev/null
jq -e '.[0].Config.User != "" and .[0].Config.User != "0" and .[0].Config.User != "root"' inspect.json >/dev/null` },
  ],
  "Healthchecks, restart e readiness": [
    { lang: "dockerfile", purpose: "Usa probe interno sem shell/curl e parâmetros explícitos de startup, timeout e retries.", code: `FROM gcr.io/distroless/nodejs22-debian12@sha256:SUBSTITUA_PELO_DIGEST
WORKDIR /app
COPY --chown=65532:65532 dist/ ./
USER 65532:65532
HEALTHCHECK --interval=10s --timeout=2s --start-period=20s --retries=3 \
  CMD ["/nodejs/bin/node", "/app/healthcheck.js", "--mode=liveness"]
STOPSIGNAL SIGTERM
ENTRYPOINT ["/nodejs/bin/node"]
CMD ["/app/server.js"]` },
    { lang: "bash", purpose: "Observa transições de health, injeta falha e valida TERM/exit sem atribuir restart a unhealthy.", code: `set -euo pipefail
id="$(docker run -d --name chiron-health --restart on-failure:3 chiron/app@sha256:SUBSTITUA_PELO_DIGEST)"
trap 'docker rm -f "$id" >/dev/null 2>&1 || true' EXIT
for _ in $(seq 1 30); do status="$(docker inspect "$id" --format '{{.State.Health.Status}}')"; test "$status" = healthy && break; sleep 1; done
test "$status" = healthy
docker exec "$id" /app/admin-fixture fail-liveness
for _ in $(seq 1 10); do status="$(docker inspect "$id" --format '{{.State.Health.Status}}')"; test "$status" = unhealthy && break; sleep 1; done
test "$status" = unhealthy
test "$(docker inspect "$id" --format '{{.RestartCount}}')" -eq 0
docker stop --time 20 "$id" >/dev/null; test "$(docker inspect "$id" --format '{{.State.ExitCode}}')" -eq 0` },
  ],
  "Writable layer, volumes e binds": [
    { lang: "bash", purpose: "Demonstra, por evidência observável, o que desaparece com o container e o que sobrevive em volume e tmpfs.", code: `set -euo pipefail
image='alpine@sha256:SUBSTITUA_PELO_DIGEST'
docker volume create chiron-data >/dev/null
id="$(docker run -d --name chiron-storage --tmpfs /run:rw,nosuid,nodev,size=8m \
  --mount type=volume,src=chiron-data,dst=/var/lib/chiron "$image" sleep 300)"
docker exec "$id" sh -c 'printf layer >/layer.txt; printf volume >/var/lib/chiron/value; printf tmpfs >/run/value'
docker rm -f "$id" >/dev/null
id2="$(docker run -d --name chiron-storage-2 --mount type=volume,src=chiron-data,dst=/var/lib/chiron "$image" sleep 300)"
trap 'docker rm -f "$id2" >/dev/null 2>&1 || true; docker volume rm chiron-data >/dev/null 2>&1 || true' EXIT
test "$(docker exec "$id2" cat /var/lib/chiron/value)" = volume
! docker exec "$id2" test -e /layer.txt
! docker exec "$id2" test -e /run/value` },
    { lang: "bash", purpose: "Audita o contrato de mounts por inspect e recusa bind gravável ou propagação ampla não documentada.", code: `set -euo pipefail
container="$1"
docker inspect "$container" --format '{{json .Mounts}}' > mounts.json
jq -e 'length > 0' mounts.json >/dev/null
jq -e 'all(.[]; if .Destination == "/var/lib/chiron" then .Type == "volume" and .RW == true else true end)' mounts.json >/dev/null
jq -e 'all(.[]; if .Type == "bind" then (.RW == false and (.Propagation == "rprivate" or .Propagation == "")) else true end)' mounts.json >/dev/null
docker diff "$container" > diff.txt
if grep -E '^A /(run/secrets|var/lib/chiron)|^C /(etc|usr)' diff.txt; then
  echo 'mutação fora do contrato de persistência' >&2; exit 1
fi` },
  ],
  "Permissões, UID/GID e plataformas": [
    { lang: "dockerfile", purpose: "Cria identidade numérica estável e prepara somente os diretórios que o processo precisa escrever.", code: `FROM node:22-bookworm-slim@sha256:SUBSTITUA_PELO_DIGEST AS runtime
RUN groupadd --gid 10001 chiron \
 && useradd --uid 10001 --gid 10001 --no-create-home --shell /usr/sbin/nologin chiron \
 && install -d -o 10001 -g 10001 -m 0750 /var/lib/chiron /var/log/chiron
WORKDIR /app
COPY --chown=10001:10001 --chmod=0444 dist/ ./dist/
USER 10001:10001
VOLUME ["/var/lib/chiron"]
ENTRYPOINT ["node", "/app/dist/server.js"]` },
    { lang: "bash", purpose: "Valida escrita no volume sob UID explícito, rootfs read-only e arquitetura declarada sem mascarar divergência do host.", code: `set -euo pipefail
image='chiron/app@sha256:SUBSTITUA_PELO_DIGEST'
docker volume create chiron-permissions >/dev/null
trap 'docker volume rm chiron-permissions >/dev/null 2>&1 || true' EXIT
docker run --rm --user 10001:10001 --read-only --tmpfs /tmp:rw,noexec,nosuid \
  --mount type=volume,src=chiron-permissions,dst=/var/lib/chiron \
  "$image" sh -c 'test "$(id -u):$(id -g)" = 10001:10001; printf ok >/var/lib/chiron/probe; ! touch /app/blocked'
docker run --rm --user 10001:10001 --read-only \
  --mount type=volume,src=chiron-permissions,dst=/var/lib/chiron,readonly \
  "$image" sh -c 'test "$(cat /var/lib/chiron/probe)" = ok'
docker image inspect "$image" --format '{{.Architecture}}/{{.Os}}' | grep -E '^(amd64|arm64)/linux$' >/dev/null` },
  ],
  "Backups, migrations e restores": [
    { lang: "bash", purpose: "Congela a aplicação, produz arquivo determinístico do volume e registra checksum e metadados da origem.", code: `set -euo pipefail
helper='alpine@sha256:SUBSTITUA_PELO_DIGEST'
backup_dir="$(pwd)/backups"; mkdir -p "$backup_dir"
docker stop --time 30 chiron-api >/dev/null
trap 'docker start chiron-api >/dev/null 2>&1 || true' EXIT
docker run --rm --mount type=volume,src=chiron-data,dst=/source,readonly \
  --mount "type=bind,src=$backup_dir,dst=/backup" "$helper" \
  sh -ceu 'cd /source; tar --sort=name --mtime=@0 --owner=0 --group=0 -czf /backup/chiron-data.tgz .'
sha256sum "$backup_dir/chiron-data.tgz" > "$backup_dir/chiron-data.tgz.sha256"
docker volume inspect chiron-data > "$backup_dir/volume-inspect.json"
(cd "$backup_dir" && sha256sum -c chiron-data.tgz.sha256)
docker start chiron-api >/dev/null; trap - EXIT` },
    { lang: "bash", purpose: "Restaura em volume novo, executa validações sem tocar na origem e promove apenas após comparar invariantes.", code: `set -euo pipefail
helper='alpine@sha256:SUBSTITUA_PELO_DIGEST'; backup_dir="$(pwd)/backups"
(cd "$backup_dir" && sha256sum -c chiron-data.tgz.sha256)
docker volume create chiron-data-restore >/dev/null
trap 'docker volume rm chiron-data-restore >/dev/null 2>&1 || true' EXIT
docker run --rm --mount type=volume,src=chiron-data-restore,dst=/target \
  --mount "type=bind,src=$backup_dir,dst=/backup,readonly" "$helper" \
  sh -ceu 'test -z "$(ls -A /target)"; tar -xzf /backup/chiron-data.tgz -C /target; test -f /target/manifest.json'
docker run --rm --mount type=volume,src=chiron-data-restore,dst=/data,readonly "$helper" \
  sh -ceu 'test -s /data/manifest.json; find /data -xdev -type f -print0 | sort -z | xargs -0 sha256sum' > restored-files.sha256
test -s restored-files.sha256` },
  ],
  "Bancos em containers": [
    { lang: "bash", purpose: "Sobe PostgreSQL pinado com volume e healthcheck, valida durabilidade e encerra de modo gracioso.", code: `set -euo pipefail
image='postgres:17-bookworm@sha256:SUBSTITUA_PELO_DIGEST'
docker volume create chiron-pgdata >/dev/null
id="$(docker run -d --name chiron-postgres --mount type=volume,src=chiron-pgdata,dst=/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD_FILE=/run/secrets/db_password \
  --mount type=bind,src="$(pwd)/fixtures/db_password",dst=/run/secrets/db_password,readonly \
  --health-cmd='pg_isready -U postgres' --health-interval=2s --health-retries=20 "$image")"
trap 'docker rm -f "$id" >/dev/null 2>&1 || true; docker volume rm chiron-pgdata >/dev/null 2>&1 || true' EXIT
for _ in $(seq 1 30); do state="$(docker inspect "$id" --format '{{.State.Health.Status}}')"; test "$state" = healthy && break; sleep 1; done
test "$state" = healthy
docker exec "$id" psql -U postgres -v ON_ERROR_STOP=1 -c 'CREATE TABLE evidence(id bigint primary key, note text not null); INSERT INTO evidence VALUES (1, ''persisted'');'
docker stop --time 60 "$id" >/dev/null` },
    { lang: "bash", purpose: "Executa dump lógico verificável e restore ensaiado em instância isolada antes de considerar o artefato recuperável.", code: `set -euo pipefail
mkdir -p backups
docker exec chiron-postgres pg_dump -U postgres --format=custom --no-owner --no-acl postgres > backups/postgres.dump
test -s backups/postgres.dump; sha256sum backups/postgres.dump > backups/postgres.dump.sha256
docker exec -i chiron-postgres-restore pg_restore -U postgres --clean --if-exists --no-owner --no-acl --dbname=postgres < backups/postgres.dump
source_count="$(docker exec chiron-postgres psql -U postgres -Atqc 'select count(*) from evidence')"
restore_count="$(docker exec chiron-postgres-restore psql -U postgres -Atqc 'select count(*) from evidence')"
test "$source_count" = "$restore_count"
docker exec chiron-postgres-restore psql -U postgres -Atqc 'select note from evidence where id=1' | grep -Fx persisted >/dev/null
(cd backups && sha256sum -c postgres.dump.sha256)` },
  ],
  "Bridges, DNS e ports": [
    { lang: "bash", purpose: "Cria duas redes e prova a matriz de alcance sem publicar API ou banco no host.", code: `set -euo pipefail
image='alpine@sha256:SUBSTITUA_PELO_DIGEST'
docker network create chiron-edge >/dev/null; docker network create chiron-data >/dev/null
trap 'docker rm -f web api db >/dev/null 2>&1 || true; docker network rm chiron-edge chiron-data >/dev/null 2>&1 || true' EXIT
docker run -d --name db --network chiron-data "$image" sh -c 'while true; do nc -l -p 5432 -e echo db; done' >/dev/null
docker run -d --name api --network chiron-data "$image" sh -c 'while true; do nc -l -p 8080 -e echo api; done' >/dev/null
docker network connect chiron-edge api
docker run -d --name web --network chiron-edge "$image" sleep 300 >/dev/null
docker exec web sh -c 'wget -qO- http://api:8080 | grep -Fx api'
! docker exec web sh -c 'nc -w1 db 5432'
! docker port api 8080 | grep .` },
    { lang: "bash", purpose: "Publica em loopback com porta efêmera, consulta o mapeamento real e rejeita bind global.", code: `set -euo pipefail
image='nginx@sha256:SUBSTITUA_PELO_DIGEST'
id="$(docker run -d --name chiron-loopback -p 127.0.0.1::80 "$image")"
trap 'docker rm -f "$id" >/dev/null 2>&1 || true' EXIT
mapping="$(docker port "$id" 80/tcp)"; printf '%s\n' "$mapping" | grep -E '^127\.0\.0\.1:[0-9]+$' >/dev/null
port="\${mapping##*:}"
curl --fail --silent --show-error --max-time 3 "http://127.0.0.1:$port/" >/dev/null
docker inspect "$id" --format '{{json .HostConfig.PortBindings}}' > ports.json
jq -e '.["80/tcp"][0].HostIp == "127.0.0.1" and (.["80/tcp"][0].HostPort | length > 0)' ports.json >/dev/null` },
  ],
  "Ingress, proxies e TLS": [
    { lang: "bash", purpose: "Valida cadeia, hostname, protocolo e rotação de certificado descartável sem aceitar TLS inseguro.", code: `set -euo pipefail
ca=fixtures/tls/ca.pem; host=chiron.local; port="\${1:?porta do proxy}"
openssl s_client -connect "127.0.0.1:$port" -servername "$host" -CAfile "$ca" -verify_return_error </dev/null > handshake.txt 2>&1
grep -F 'Verify return code: 0 (ok)' handshake.txt >/dev/null
curl --fail --silent --show-error --cacert "$ca" --resolve "$host:$port:127.0.0.1" \
  "https://$host:$port/health" | jq -e '.status == "ok"' >/dev/null
expiry="$(openssl s_client -connect "127.0.0.1:$port" -servername "$host" </dev/null 2>/dev/null | openssl x509 -noout -enddate)"
test -n "$expiry"
if rg -n -- '-k|--insecure' compose*.y*ml config/; then echo 'TLS bypass encontrado' >&2; exit 1; fi` },
    { lang: "bash", purpose: "Envia headers forjados e confirma que o proxy os substitui, mantendo upstream privado e request ID.", code: `set -euo pipefail
base="\${1:?URL HTTPS do proxy}"
curl --fail --silent --show-error --cacert fixtures/tls/ca.pem \
  -H 'X-Forwarded-For: 203.0.113.99' -H 'X-Forwarded-Proto: http' -H 'Host: chiron.local' \
  "$base/debug/request-fixture" > observed.json
jq -e '.scheme == "https"' observed.json >/dev/null
jq -e '.clientIp != "203.0.113.99"' observed.json >/dev/null
jq -e '.requestId | type == "string" and length >= 16' observed.json >/dev/null
proxy_id="$(docker compose ps -q proxy)"; api_id="$(docker compose ps -q api)"
test -z "$(docker port "$api_id")"
docker inspect "$proxy_id" --format '{{json .NetworkSettings.Networks}}' | jq -e 'has("chiron_edge")' >/dev/null` },
  ],
  "Service discovery e aliases": [
    { lang: "bash", purpose: "Recria o serviço, comprova mudança de IP e verifica que o consumidor reconecta pelo nome lógico.", code: `set -euo pipefail
project="chiron-discovery-\${RANDOM}"
trap 'docker compose -p "$project" down -v --remove-orphans >/dev/null 2>&1 || true' EXIT
docker compose -p "$project" up -d --wait api consumer
old_id="$(docker compose -p "$project" ps -q api)"
old_ip="$(docker inspect "$old_id" --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}')"
docker compose -p "$project" up -d --force-recreate --no-deps api
new_id="$(docker compose -p "$project" ps -q api)"
new_ip="$(docker inspect "$new_id" --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}')"
test "$old_id" != "$new_id"; test "$old_ip" != "$new_ip"
docker compose -p "$project" exec -T consumer sh -c 'for i in 1 2 3 4 5; do wget -qO- http://api:8080/health && exit; sleep 1; done; exit 1'` },
    { lang: "bash", purpose: "Sobe projetos homônimos em paralelo e demonstra isolamento de nomes, redes e aliases.", code: `set -euo pipefail
for project in chiron-a chiron-b; do docker compose -p "$project" up -d --wait api probe; done
trap 'docker compose -p chiron-a down -v >/dev/null 2>&1 || true; docker compose -p chiron-b down -v >/dev/null 2>&1 || true' EXIT
a_net="$(docker inspect "$(docker compose -p chiron-a ps -q api)" --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}')"
b_net="$(docker inspect "$(docker compose -p chiron-b ps -q api)" --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}')"
test "$a_net" != "$b_net"
docker compose -p chiron-a exec -T probe getent hosts api > a-hosts.txt
docker compose -p chiron-b exec -T probe getent hosts api > b-hosts.txt
test -s a-hosts.txt; test -s b-hosts.txt
test "$(awk '{print $1}' a-hosts.txt)" != "$(awk '{print $1}' b-hosts.txt)"` },
  ],
  "Egress, timeouts e falhas": [
    { lang: "bash", purpose: "Testa allowlist de saída e nega metadata, rede privada e redirect adversarial a partir do namespace da aplicação.", code: `set -euo pipefail
app="$(docker compose ps -q api)"
docker exec "$app" /app/egress-probe --url https://allowed.example.invalid/fixture --timeout 3s > allowed.json
jq -e '.status == 200 and .policy == "allow"' allowed.json >/dev/null
for target in 'http://169.254.169.254/latest/meta-data/' 'http://127.0.0.1:2375/' 'http://10.0.0.1/admin'; do
  if docker exec "$app" /app/egress-probe --url "$target" --timeout 2s > denied.json 2>&1; then
    echo "egress indevido: $target" >&2; exit 1
  fi
  grep -E 'policy_denied|destination_not_allowed' denied.json >/dev/null
done
docker logs "$app" 2>&1 | grep -vE 'Authorization:|access_token=|Cookie:' > redacted-egress.log` },
    { lang: "bash", purpose: "Injeta resposta lenta e commit ambíguo, verificando deadline finito e efeito único por idempotency key.", code: `set -euo pipefail
key="docker-egress-$(date +%s)-$$"
start="$(date +%s)"
set +e
docker compose exec -T api /app/reserve-fixture --endpoint http://fault:8080/commit-then-delay \
  --idempotency-key "$key" --connect-timeout 1s --deadline 4s --max-attempts 2 > attempt.json
status=$?; set -e
elapsed=$(( $(date +%s) - start )); test "$elapsed" -le 10
test "$status" -ne 0
docker compose exec -T api /app/reconcile-fixture --idempotency-key "$key" > result.json
jq -e '.state == "committed" and .effects == 1' result.json >/dev/null
docker compose exec -T fault /fixture/assert-requests --key "$key" --maximum 2` },
  ],
  "Compose Specification e projects": [
    { lang: "bash", purpose: "Renderiza o modelo e aplica invariantes de identidade, imagens, portas, mounts e privilégios antes de subir.", code: `set -euo pipefail
project="chiron-ci-$RANDOM"
CHIRON_IMAGE='registry.example.invalid/chiron/app@sha256:SUBSTITUA_PELO_DIGEST' \
  docker compose -p "$project" -f compose.yaml config --format json > model.json
jq -e '.name == "'"$project"'"' model.json >/dev/null
jq -e 'all(.services[]; (.image | contains("@sha256:")) or has("build"))' model.json >/dev/null
jq -e 'all(.services[]; (.privileged // false) == false)' model.json >/dev/null
jq -e 'all(.services[]; all(.volumes[]?; .source != "/" and .source != "/var/run/docker.sock"))' model.json >/dev/null
jq -e 'all(.services[]; all(.ports[]?; (.host_ip // "127.0.0.1") == "127.0.0.1"))' model.json >/dev/null` },
    { lang: "bash", purpose: "Prova isolamento entre projects e persistência controlada do volume durante recreate, removendo só a fixture descartável.", code: `set -euo pipefail
for p in chiron-one chiron-two; do docker compose -p "$p" up -d --wait db api; done
trap 'for p in chiron-one chiron-two; do docker compose -p "$p" down -v --remove-orphans >/dev/null 2>&1 || true; done' EXIT
one_db="$(docker compose -p chiron-one ps -q db)"; two_db="$(docker compose -p chiron-two ps -q db)"
test "$one_db" != "$two_db"
one_volume="$(docker inspect "$one_db" --format '{{range .Mounts}}{{if eq .Destination "/var/lib/postgresql/data"}}{{.Name}}{{end}}{{end}}')"
docker compose -p chiron-one exec -T db sh -c 'printf marker >/var/lib/postgresql/data/project-marker'
docker compose -p chiron-one up -d --force-recreate --no-deps db
docker compose -p chiron-one exec -T db grep -Fx marker /var/lib/postgresql/data/project-marker
test "$one_volume" = "$(docker inspect "$(docker compose -p chiron-one ps -q db)" --format '{{range .Mounts}}{{if eq .Destination "/var/lib/postgresql/data"}}{{.Name}}{{end}}{{end}}')"` },
  ],
  "Dependencies, health e startup": [
    { lang: "bash", purpose: "Obtém timeline de banco, migration e API e exige migration única antes da readiness.", code: `set -euo pipefail
project="chiron-startup-$RANDOM"; export COMPOSE_PROJECT_NAME="$project"
trap 'docker compose down -v --remove-orphans >/dev/null 2>&1 || true' EXIT
docker compose up -d --wait db
docker compose up --exit-code-from migrate migrate
test "$(docker compose ps -a --format json migrate | jq -r 'if type=="array" then .[0].ExitCode else .ExitCode end')" = 0
docker compose up -d --wait api worker proxy
docker compose ps --format json > states.json
jq -e 'if type=="array" then all(.[]; .State == "running") else .State == "running" end' states.json >/dev/null
docker compose exec -T db psql -U postgres -Atqc "select count(*) from schema_migrations where version='latest'" | grep -Fx 1 >/dev/null` },
    { lang: "bash", purpose: "Reinicia dependência sob tráfego e confirma reconexão, drain e ausência de efeitos duplicados.", code: `set -euo pipefail
key="startup-reconnect-$$-$RANDOM"
docker compose exec -T client /fixture/load --url http://api:8080/reservations \
  --requests 40 --concurrency 4 --idempotency-key-prefix "$key" --output /results.json & load_pid=$!
sleep 1; docker compose restart --timeout 20 db
wait "$load_pid"
docker compose exec -T client jq -e 'all(.[]; .status == 201 or .status == 200)' /results.json >/dev/null
docker compose exec -T db psql -U postgres -v ON_ERROR_STOP=1 -Atqc \
  "select count(*) = count(distinct idempotency_key) from reservations where idempotency_key like '$key%'" | grep -Fx t >/dev/null
test "$(docker inspect "$(docker compose ps -q api)" --format '{{.RestartCount}}')" -le 3` },
  ],
  "Interpolation, env e secrets": [
    { lang: "bash", purpose: "Exercita precedence e caracteres adversariais, exigindo erro quando variável crítica está ausente.", code: `set -euo pipefail
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
printf 'CHIRON_LOG_LEVEL=from-file\nCHIRON_PUBLIC_URL=https://file.invalid\n' > "$tmp/test.env"
CHIRON_LOG_LEVEL='from-shell' docker compose --env-file "$tmp/test.env" config --format json > "$tmp/model.json"
jq -e '.services.api.environment.CHIRON_LOG_LEVEL == "from-shell"' "$tmp/model.json" >/dev/null
jq -e '.services.api.environment.CHIRON_PUBLIC_URL == "https://file.invalid"' "$tmp/model.json" >/dev/null
if env -u CHIRON_IMAGE docker compose --env-file /dev/null config >"$tmp/missing.out" 2>"$tmp/missing.err"; then
  echo 'CHIRON_IMAGE deveria ser obrigatória' >&2; exit 1
fi
grep -F 'CHIRON_IMAGE' "$tmp/missing.err" >/dev/null` },
    { lang: "bash", purpose: "Monta segredo sintético para usuário não root e prova ausência do valor em inspect, image e logs.", code: `set -euo pipefail
fixture='not-a-real-secret-7f4a'; tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
printf '%s\n' "$fixture" > "$tmp/provider_token"; chmod 0400 "$tmp/provider_token"
CHIRON_SECRET_FILE="$tmp/provider_token" docker compose -f compose.yaml -f compose.test.yaml up -d --wait api
id="$(docker compose ps -q api)"
test "$(docker exec "$id" id -u)" != 0
docker exec "$id" /app/secret-fixture --assert-file /run/secrets/provider_token --expected-sha256 "$(printf %s "$fixture" | sha256sum | cut -d' ' -f1)"
! docker inspect "$id" | grep -F "$fixture"
! docker image inspect "$(docker inspect "$id" --format '{{.Image}}')" | grep -F "$fixture"
! docker logs "$id" 2>&1 | grep -F "$fixture"` },
  ],
  "Overrides, profiles e desenvolvimento": [
    { lang: "bash", purpose: "Compara combinações renderizadas e bloqueia debug, socket, bind de source e porta global no modelo de produção.", code: `set -euo pipefail
docker compose -f compose.yaml -f compose.dev.yaml --profile debug config --format json > dev.json
docker compose -f compose.yaml -f compose.prod.yaml config --format json > prod.json
jq -e '.services | has("debugger")' dev.json >/dev/null
jq -e '.services | has("debugger") | not' prod.json >/dev/null
jq -e 'all(.services[]; (.privileged // false) == false)' prod.json >/dev/null
jq -e 'all(.services[]; all(.volumes[]?; .source != "/var/run/docker.sock" and (.type != "bind" or (.read_only // false))))' prod.json >/dev/null
jq -e 'all(.services[]; all(.ports[]?; (.host_ip // "0.0.0.0") != "0.0.0.0"))' prod.json >/dev/null
jq -r '.. | strings' prod.json | grep -Ev 'CHANGEME|SUBSTITUA|fixture|debug' >/dev/null` },
    { lang: "bash", purpose: "Sobe desenvolvimento com profile explícito, verifica hot reload e confirma release sem mounts de source.", code: `set -euo pipefail
project="chiron-dev-$RANDOM"; export COMPOSE_PROJECT_NAME="$project"
trap 'docker compose -f compose.yaml -f compose.dev.yaml --profile debug down -v --remove-orphans >/dev/null 2>&1 || true' EXIT
docker compose -f compose.yaml -f compose.dev.yaml --profile debug up -d --wait api debugger
api="$(docker compose -f compose.yaml -f compose.dev.yaml ps -q api)"
docker inspect "$api" --format '{{json .Mounts}}' | jq -e 'any(.[]; .Type == "bind" and .Destination == "/workspace" and .RW == false)' >/dev/null
docker compose -f compose.yaml -f compose.prod.yaml config --format json > release.json
jq -e 'all(.services.api.volumes[]?; .Destination != "/workspace" and .target != "/workspace")' release.json >/dev/null
docker compose -f compose.yaml -f compose.prod.yaml run --rm --no-deps api /app/smoke --self-contained
debug_bind="$(docker port "$(docker compose -f compose.yaml -f compose.dev.yaml ps -q debugger)" 9229/tcp)"
printf '%s\n' "$debug_bind" | grep -E '^127\.0\.0\.1:' >/dev/null` },
  ],
  "Testes efêmeros de integração": [
    { lang: "bash", purpose: "Executa duas stacks descartáveis em paralelo com portas dinâmicas e prova isolamento dos dados.", code: `set -euo pipefail
run_stack() { p="$1"; docker compose -p "$p" -f compose.test.yaml up -d --wait db api; port="$(docker compose -p "$p" port api 8080 | sed 's/.*://')"; curl -fsS -X POST "http://127.0.0.1:$port/fixtures" -H 'content-type: application/json' -d "{\"owner\":\"$p\"}" >/dev/null; }
run_stack chiron-test-a & a=$!; run_stack chiron-test-b & b=$!; wait "$a"; wait "$b"
trap 'for p in chiron-test-a chiron-test-b; do docker compose -p "$p" -f compose.test.yaml logs --no-color > "$p.log" 2>&1 || true; docker compose -p "$p" -f compose.test.yaml down -v --remove-orphans >/dev/null 2>&1 || true; done' EXIT
for p in chiron-test-a chiron-test-b; do port="$(docker compose -p "$p" port api 8080 | sed 's/.*://')"; curl -fsS "http://127.0.0.1:$port/fixtures" > "$p.json"; jq -e --arg p "$p" 'length == 1 and .[0].owner == $p' "$p.json" >/dev/null; done` },
    { lang: "bash", purpose: "Sincroniza duas reservas no banco real e exige um vencedor, uma rejeição e estoque não negativo.", code: `set -euo pipefail
project="chiron-race-$RANDOM"; trap 'docker compose -p "$project" -f compose.test.yaml down -v >/dev/null 2>&1 || true' EXIT
docker compose -p "$project" -f compose.test.yaml up -d --wait db api
port="$(docker compose -p "$project" -f compose.test.yaml port api 8080 | sed 's/.*://')"
curl -fsS -X POST "http://127.0.0.1:$port/fixtures/last-seat" >/dev/null
for n in 1 2; do (curl -sS -o "r$n.json" -w '%{http_code}' -X POST "http://127.0.0.1:$port/reservations" -H "Idempotency-Key: race-$n" -d '{"seat":"LAST"}' > "r$n.code") & done; wait
test "$(sort r1.code r2.code | tr '\n' ' ')" = '201 409 '
docker compose -p "$project" exec -T db psql -U postgres -Atqc 'select remaining, reservations, outbox_events from race_evidence' | grep -Fx '0|1|1' >/dev/null` },
  ],
  "Testcontainers e fixtures reais": [
    { lang: "bash", purpose: "Representa o contrato de uma fixture programática com digest, wait por query, porta dinâmica e cleanup por ID.", code: `set -euo pipefail
image='postgres:17-bookworm@sha256:SUBSTITUA_PELO_DIGEST'; name="tc-pg-$RANDOM-$$"
id="$(docker run -d --name "$name" -P -e POSTGRES_PASSWORD=fixture-only --label chiron.test.run="$name" "$image")"
trap 'docker logs "$id" > "$name.log" 2>&1 || true; docker rm -fv "$id" >/dev/null 2>&1 || true' EXIT
for n in $(seq 1 40); do docker exec "$id" pg_isready -U postgres >/dev/null 2>&1 && break; sleep 0.25; done
docker exec "$id" psql -U postgres -v ON_ERROR_STOP=1 -Atqc 'select current_setting('"'"'server_version_num'"'"')' > version.txt
host_port="$(docker port "$id" 5432/tcp | sed 's/.*://')"; test "$host_port" -gt 0
docker inspect "$id" --format '{{.Image}} {{index .Config.Labels "chiron.test.run"}}' | grep -F "$name" >/dev/null` },
    { lang: "bash", purpose: "Mata o processo de teste, identifica órfão somente pela label/idade e preserva uma execução viva.", code: `set -euo pipefail
image='alpine@sha256:SUBSTITUA_PELO_DIGEST'; old="fixture-old-$RANDOM"; live="fixture-live-$RANDOM"
old_id="$(docker run -d --label chiron.test.owner=suite --label chiron.test.expires=2000-01-01T00:00:00Z --name "$old" "$image" sleep 300)"
live_id="$(docker run -d --label chiron.test.owner=suite --label chiron.test.expires=2999-01-01T00:00:00Z --name "$live" "$image" sleep 300)"
trap 'docker rm -f "$old_id" "$live_id" >/dev/null 2>&1 || true' EXIT
docker ps -aq --filter label=chiron.test.owner=suite | while read -r id; do expires="$(docker inspect "$id" --format '{{index .Config.Labels "chiron.test.expires"}}')"; if [[ "$expires" < "$(date -u +%FT%TZ)" ]]; then docker rm -f "$id" >/dev/null; fi; done
! docker inspect "$old_id" >/dev/null 2>&1
test "$(docker inspect "$live_id" --format '{{.State.Running}}')" = true` },
  ],
  "Inspect, logs, exec e debug": [
    { lang: "bash", purpose: "Coleta bundle mínimo e redigido de estado, mounts, rede, eventos e logs antes de qualquer mutação.", code: `set -euo pipefail
id="\${1:?container id}"; out="diagnostic-$(date -u +%Y%m%dT%H%M%SZ)"; mkdir -m 0700 "$out"
docker inspect "$id" | jq '.[0] | {Id,Created,Path,Args,State,Image,Name,Config:{User:.Config.User,Labels:.Config.Labels,Healthcheck:.Config.Healthcheck},HostConfig:{ReadonlyRootfs:.HostConfig.ReadonlyRootfs,Privileged:.HostConfig.Privileged,CapDrop:.HostConfig.CapDrop,Memory:.HostConfig.Memory,NanoCpus:.HostConfig.NanoCpus},Mounts,NetworkSettings:{Ports:.NetworkSettings.Ports,Networks:.NetworkSettings.Networks}}' > "$out/inspect.json"
docker logs --timestamps --tail 2000 "$id" 2>&1 | sed -E 's/(token|password|authorization)=[^ ]+/\\1=[REDACTED]/Ig' > "$out/logs.txt"
created="$(docker inspect "$id" --format '{{.Created}}')"; docker events --since "$created" --until "$(date -u +%FT%TZ)" --filter "container=$id" > "$out/events.txt"
docker diff "$id" > "$out/diff.txt"; docker stats --no-stream --format '{{json .}}' "$id" > "$out/stats.json"
! rg -i 'bearer [a-z0-9]|password=[^[]|token=[^[]' "$out"` },
    { lang: "bash", purpose: "Usa imagem de diagnóstico pinada em namespace de rede compartilhado sem socket, privileged ou escrita na aplicação.", code: `set -euo pipefail
target="\${1:?container id}"; debug='nicolaka/netshoot@sha256:SUBSTITUA_PELO_DIGEST'
docker run --rm --network "container:$target" --read-only --cap-drop ALL --security-opt no-new-privileges \
  --tmpfs /tmp:rw,noexec,nosuid,size=8m "$debug" sh -ceu '
    getent hosts api > /tmp/dns.txt
    curl --fail --silent --show-error --max-time 3 http://api:8080/health > /tmp/health.json
    jq -e '\'' .status == "ok" '\'' /tmp/health.json
  '
inspect="$(docker inspect "$target")"
! printf '%s' "$inspect" | jq -e '.[0].Mounts[]? | select(.Source == "/var/run/docker.sock")' >/dev/null
test "$(printf '%s' "$inspect" | jq -r '.[0].HostConfig.Privileged')" = false` },
  ],
  "Recursos e performance": [
    { lang: "bash", purpose: "Aplica limites de CPU, memória e PIDs e confirma OOM/telemetria em uma fixture descartável.", code: `set -euo pipefail
image='alpine@sha256:SUBSTITUA_PELO_DIGEST'
id="$(docker run -d --name chiron-limits --cpus 0.50 --memory 128m --memory-swap 128m --pids-limit 64 --read-only --tmpfs /tmp:size=16m "$image" sleep 300)"
trap 'docker rm -f "$id" >/dev/null 2>&1 || true' EXIT
docker inspect "$id" --format '{{json .HostConfig}}' > limits.json
jq -e '.NanoCpus == 500000000 and .Memory == 134217728 and .MemorySwap == 134217728 and .PidsLimit == 64' limits.json >/dev/null
docker stats --no-stream --format '{{json .}}' "$id" > stats.json; jq -e '.CPUPerc and .MemUsage and .PIDs' stats.json >/dev/null
set +e; docker exec "$id" sh -c 'i=0; while :; do eval "x$i=$(head -c 1048576 /dev/zero | base64)"; i=$((i+1)); done'; set -e
test "$(docker inspect "$id" --format '{{.State.OOMKilled}}')" = true` },
    { lang: "bash", purpose: "Executa carga com método explícito, captura percentis e rejeita resultado quando gerador ou invariantes saturam.", code: `set -euo pipefail
project="chiron-perf-$RANDOM"; trap 'docker compose -p "$project" -f compose.perf.yaml down -v >/dev/null 2>&1 || true' EXIT
docker compose -p "$project" -f compose.perf.yaml up -d --wait api db
port="$(docker compose -p "$project" -f compose.perf.yaml port api 8080 | sed 's/.*://')"
docker run --rm --network host grafana/k6@sha256:SUBSTITUA_PELO_DIGEST run \
  -e BASE_URL="http://127.0.0.1:$port" --summary-export /tmp/summary.json /scripts/reservations.js
docker stats --no-stream --format '{{json .}}' $(docker compose -p "$project" ps -q) > resource-snapshot.json
docker compose -p "$project" exec -T db psql -U postgres -Atqc 'select min(remaining) >= 0 and count(*) = count(distinct idempotency_key) from inventory left join reservations on true' | grep -Fx t >/dev/null
docker compose -p "$project" logs --no-color --since 10m > perf-services.log` },
  ],
  "Build e supply-chain adversarial": [
    { lang: "bash", purpose: "Constrói com segredo sintético via mount e prova ausência em layers, config, history e cache exportado.", code: `set -euo pipefail
secret='canary-build-secret-4e90'; tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
printf '%s' "$secret" > "$tmp/token"
docker buildx build --builder chiron-secure --secret "id=provider_token,src=$tmp/token" \
  --provenance=mode=max --sbom=true --output "type=oci,dest=$tmp/image.tar" . > "$tmp/build.log" 2>&1
! grep -R -a -F "$secret" "$tmp/image.tar" "$tmp/build.log"
tar -xf "$tmp/image.tar" -C "$tmp/oci"
! grep -R -a -F "$secret" "$tmp/oci"
oras discover --format json --oci-layout "$tmp/oci" | jq -e '.manifests | length >= 2' >/dev/null
sha256sum "$tmp/image.tar" > "$tmp/image.tar.sha256"` },
    { lang: "bash", purpose: "Tenta envenenar cache de fork e exige que build confiável read-only preserve o digest esperado.", code: `set -euo pipefail
trusted='registry.example.invalid/chiron/cache:trusted'; fork='registry.example.invalid/chiron/cache:fork'
docker buildx build --builder chiron-untrusted --cache-to "type=registry,ref=$fork,mode=max" \
  --build-arg DEPENDENCY_SHA256=INCORRETO --output type=cacheonly fixtures/cache-poison || true
docker buildx build --builder chiron-secure --cache-from "type=registry,ref=$trusted" \
  --metadata-file trusted-metadata.json --output type=oci,dest=trusted.tar .
jq -e '."containerimage.digest" | startswith("sha256:")' trusted-metadata.json >/dev/null
expected="$(cat fixtures/expected-image-digest)"; actual="$(jq -r '."containerimage.digest"' trusted-metadata.json)"
test "$actual" = "$expected"
! docker buildx imagetools inspect "$fork" --format '{{json .Manifest}}' | grep -F "$actual"` },
  ],
  "Isolamento, rootless e sandbox": [
    { lang: "bash", purpose: "Valida daemon rootless, identidade mapeada e nega escrita, raw socket, mount e excesso de PIDs.", code: `set -euo pipefail
docker --context chiron-rootless info --format '{{json .SecurityOptions}}' > security.json
jq -e 'any(.[]; contains("rootless"))' security.json >/dev/null
id="$(docker --context chiron-rootless run -d --name isolation-fixture --user 10001:10001 --read-only \
  --cap-drop ALL --security-opt no-new-privileges --pids-limit 32 --tmpfs /tmp:rw,noexec,nosuid,size=8m \
  alpine@sha256:SUBSTITUA_PELO_DIGEST sleep 300)"
trap 'docker --context chiron-rootless rm -f "$id" >/dev/null 2>&1 || true' EXIT
test "$(docker --context chiron-rootless exec "$id" id -u)" = 10001
! docker --context chiron-rootless exec "$id" touch /blocked
! docker --context chiron-rootless exec "$id" sh -c 'mount -t tmpfs tmpfs /mnt'
! docker --context chiron-rootless exec "$id" sh -c 'i=0; while [ $i -lt 64 ]; do sleep 60 & i=$((i+1)); done; wait'` },
    { lang: "bash", purpose: "Exige runtime sandbox explícito e bloqueia fallback enquanto confirma funcionalidade mínima e controles.", code: `set -euo pipefail
runtime='runsc'; image='chiron/app@sha256:SUBSTITUA_PELO_DIGEST'
docker info --format '{{json .Runtimes}}' | jq -e --arg r "$runtime" 'has($r)' >/dev/null
id="$(docker run -d --runtime "$runtime" --name chiron-sandbox --user 10001:10001 --read-only --cap-drop ALL --security-opt no-new-privileges "$image")"
trap 'docker rm -f "$id" >/dev/null 2>&1 || true' EXIT
test "$(docker inspect "$id" --format '{{.HostConfig.Runtime}}')" = "$runtime"
docker exec "$id" /app/smoke --self-contained
! docker exec "$id" sh -c 'test -S /var/run/docker.sock'
! docker exec "$id" sh -c 'touch /app/escape'
docker inspect "$id" --format '{{json .HostConfig.SecurityOpt}}' | jq -e 'index("no-new-privileges") != null' >/dev/null` },
  ],
  "Scanning, policy e patching": [
    { lang: "bash", purpose: "Gera SBOM e scans por digest, registra versões e aplica política sem esconder achados críticos.", code: `set -euo pipefail
subject='registry.example.invalid/chiron/app@sha256:SUBSTITUA_PELO_DIGEST'
syft "$subject" -o cyclonedx-json=sbom.json
grype "sbom:sbom.json" -o json > vulnerabilities.json
trivy image --format json --scanners vuln,secret,misconfig "$subject" > trivy.json
cosign verify-attestation --type slsaprovenance --certificate-identity-regexp '^https://github.com/acme/chiron/' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com "$subject" > provenance.json
jq -n --arg subject "$subject" --arg syft "$(syft version -o json | jq -c .)" --arg grype "$(grype version -o json | jq -c .)" '{subject:$subject,syft:$syft,grype:$grype}' > scan-metadata.json
conftest test --policy policy/image --data vulnerabilities.json --data trivy.json --data provenance.json sbom.json` },
    { lang: "bash", purpose: "Reconstrói a partir de base corrigida e exige novo digest, redução do finding e aprovação do mesmo subject.", code: `set -euo pipefail
old="$(cat evidence/old-subject-digest)"
docker buildx build --pull --no-cache --provenance=mode=max --sbom=true --metadata-file patched.json --push \
  -t registry.example.invalid/chiron/app:patch-candidate .
new="$(jq -r '."containerimage.digest"' patched.json)"; test "$new" != "$old"
subject="registry.example.invalid/chiron/app@$new"
grype "$subject" -o json > patched-vulnerabilities.json
jq -e '[.matches[] | select(.vulnerability.id == "CVE-FIXTURE-0001")] | length == 0' patched-vulnerabilities.json >/dev/null
cosign verify-attestation --type spdxjson "$subject" > patched-sbom-attestation.json
conftest test --policy policy/image --data patched-vulnerabilities.json --data patched-sbom-attestation.json patched.json
printf '%s\n' "$subject" > evidence/approved-patched-subject` },
  ],
  "Segredos, incidentes e forensics": [
    { lang: "bash", purpose: "Captura evidência mínima com hashes antes de isolar, sem exportar environment ou conteúdo secreto.", code: `set -euo pipefail
id="\${1:?container comprometido}"; case_id="INC-$(date -u +%Y%m%dT%H%M%SZ)"; out="evidence/$case_id"; install -d -m 0700 "$out"
docker inspect "$id" | jq '.[0] | {Id,Created,Image,Name,State,Config:{User:.Config.User,Labels:.Config.Labels},HostConfig:{Privileged:.HostConfig.Privileged,ReadonlyRootfs:.HostConfig.ReadonlyRootfs},Mounts,NetworkSettings:{Networks:.NetworkSettings.Networks,Ports:.NetworkSettings.Ports}}' > "$out/inspect-redacted.json"
docker logs --timestamps --tail 5000 "$id" 2>&1 | sed -E 's/(Bearer |token=|password=)[^ ]+/\\1[REDACTED]/Ig' > "$out/logs-redacted.txt"
docker events --since "$(docker inspect "$id" --format '{{.Created}}')" --until "$(date -u +%FT%TZ)" --filter "container=$id" > "$out/events.txt"
docker image inspect "$(docker inspect "$id" --format '{{.Image}}')" | jq '.[0] | {Id,RepoDigests,Created,Architecture,Os}' > "$out/image.json"
(cd "$out" && sha256sum *.json *.txt > SHA256SUMS)
docker network disconnect --force bridge "$id" 2>/dev/null || true` },
    { lang: "bash", purpose: "Prova revogação do canário, nega digest comprometido e valida substituto reconstruído sem o valor.", code: `set -euo pipefail
old='registry.example.invalid/chiron/app@sha256:DIGEST_COMPROMETIDO'; new='registry.example.invalid/chiron/app@sha256:DIGEST_LIMPO'
canary='canary-incident-token-fixture'
curl -fsS -X POST https://identity.example.invalid/revoke -H "Authorization: Bearer $INCIDENT_OPERATOR_TOKEN" -d "token_id=$canary" >/dev/null
test "$(curl -sS -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $canary" https://api.example.invalid/whoami)" = 401
cosign verify "$new" --certificate-identity-regexp '^https://github.com/acme/chiron/' --certificate-oidc-issuer https://token.actions.githubusercontent.com >/dev/null
docker pull "$new" >/dev/null; docker image save "$new" -o clean-image.tar
! grep -a -F "$canary" clean-image.tar
conftest test --policy policy/deploy --data fixtures/denied-subjects.json <(printf '{"subject":"%s"}\n' "$old")
printf '%s\n' "$new" > evidence/replacement-subject` },
  ],
  "Docker versus orquestração": [
    { lang: "bash", purpose: "Produz inventário single-host e falha o gate quando requisitos de HA não têm controlador ou storage correspondente.", code: `set -euo pipefail
docker info --format '{{json .}}' > engine.json
docker ps --format '{{json .}}' > containers.ndjson
docker network ls --format '{{json .}}' > networks.ndjson
docker volume ls --format '{{json .}}' > volumes.ndjson
jq -n --slurpfile engine engine.json --rawfile containers containers.ndjson --rawfile networks networks.ndjson --rawfile volumes volumes.ndjson \
  '{engine:$engine[0],containers:$containers,networks:$networks,volumes:$volumes,requirements:{availability:"multi-zone",rpoMinutes:5,rtoMinutes:15}}' > architecture-evidence.json
if jq -e '.requirements.availability == "multi-zone" and (.engine.Swarm.LocalNodeState // "inactive") == "inactive"' architecture-evidence.json >/dev/null; then
  echo 'single-host Docker não prova requisito multi-zone' >&2; exit 1
fi` },
    { lang: "bash", purpose: "Testa failure domain do host descartável e mede que restart local não satisfaz recuperação em outro nó.", code: `set -euo pipefail
context="\${1:?contexto de host descartável}"; service=chiron-ha-fixture
docker --context "$context" run -d --name "$service" --restart always chiron/app@sha256:SUBSTITUA_PELO_DIGEST >/dev/null
before="$(docker --context "$context" inspect "$service" --format '{{.Id}} {{.State.Running}}')"
docker --context "$context" stop --time 10 "$service" >/dev/null
docker --context "$context" start "$service" >/dev/null
after="$(docker --context "$context" inspect "$service" --format '{{.Id}} {{.State.Running}}')"
test "\${before%% *}" = "\${after%% *}"
printf '{"finding":"restart-local-only","containerId":"%s","recoveredOnOtherNode":false}\n' "\${after%% *}" > failure-domain.json
jq -e '.recoveredOnOtherNode == false' failure-domain.json >/dev/null` },
  ],
  "Limits, probes e graceful shutdown": [
    { lang: "bash", purpose: "Aplica carga durante TERM e confirma drain, saída zero e ausência de requests aceitas após readiness falsa.", code: `set -euo pipefail
id="$(docker run -d --name chiron-drain -p 127.0.0.1::8080 --cpus 1 --memory 256m --pids-limit 128 --stop-timeout 30 chiron/app@sha256:SUBSTITUA_PELO_DIGEST)"
trap 'docker rm -f "$id" >/dev/null 2>&1 || true' EXIT
port="$(docker port "$id" 8080/tcp | sed 's/.*://')"
for n in $(seq 1 30); do curl -fsS "http://127.0.0.1:$port/ready" >/dev/null && break; sleep 1; done
/fixtures/load --url "http://127.0.0.1:$port/work" --requests 20 --concurrency 4 --output results.json & load=$!
sleep 1; docker stop --time 30 "$id" >/dev/null; wait "$load"
test "$(docker inspect "$id" --format '{{.State.ExitCode}}')" = 0
jq -e 'all(.[]; .outcome == "completed" or .outcome == "rejected_before_commit")' results.json >/dev/null
docker logs "$id" 2>&1 | grep -F 'shutdown_drained' >/dev/null` },
    { lang: "bash", purpose: "Mata worker entre commit e ack e verifica lease/reprocessamento com efeito único.", code: `set -euo pipefail
project="chiron-worker-$RANDOM"; trap 'docker compose -p "$project" -f compose.failure.yaml down -v >/dev/null 2>&1 || true' EXIT
docker compose -p "$project" -f compose.failure.yaml up -d --wait db queue worker
docker compose -p "$project" exec -T queue /fixture/enqueue --id job-1 --payload synthetic
docker compose -p "$project" exec -T worker /fixture/pause-after-commit job-1
worker="$(docker compose -p "$project" ps -q worker)"; docker kill "$worker" >/dev/null
docker compose -p "$project" up -d --force-recreate --no-deps worker
docker compose -p "$project" exec -T queue /fixture/wait-complete --id job-1 --timeout 30
docker compose -p "$project" exec -T db psql -U postgres -Atqc "select effects, outbox_events from job_evidence where job_id='job-1'" | grep -Fx '1|1' >/dev/null` },
  ],
  "Logs, metrics e traces": [
    { lang: "bash", purpose: "Correlaciona uma request sintética em log, trace e métrica pelo release digest sem vazar canário.", code: `set -euo pipefail
request_id="obs-$RANDOM-$$"; canary='secret-observability-canary'
curl -fsS -H "X-Request-Id: $request_id" -H "Authorization: Bearer $canary" http://127.0.0.1:8080/fixture/error >/dev/null || true
curl -fsS "http://127.0.0.1:9090/api/v1/query?query=http_requests_total" > metric.json
curl -fsS "http://127.0.0.1:3100/loki/api/v1/query_range?query=%7Bservice%3D%22chiron%22%7D%20%7C%3D%20%22$request_id%22" > logs.json
curl -fsS "http://127.0.0.1:16686/api/traces?service=chiron&tags=%7B%22request.id%22%3A%22$request_id%22%7D" > traces.json
jq -e '.data.result | length > 0' metric.json >/dev/null
jq -e '.data.result | length > 0' logs.json >/dev/null
jq -e '.data | length > 0' traces.json >/dev/null
! grep -R -F "$canary" metric.json logs.json traces.json
rg -F '@sha256:' logs.json traces.json >/dev/null` },
    { lang: "bash", purpose: "Interrompe collector e comprova buffer limitado, queda observável e aplicação responsiva.", code: `set -euo pipefail
collector="$(docker compose ps -q collector)"; api="$(docker compose ps -q api)"
docker pause "$collector"
trap 'docker unpause "$collector" >/dev/null 2>&1 || true' EXIT
for n in $(seq 1 500); do curl -fsS -H "X-Request-Id: outage-$n" http://127.0.0.1:8080/health >/dev/null; done
curl -fsS --max-time 2 http://127.0.0.1:8080/health >/dev/null
buffer_bytes="$(docker exec "$api" du -sb /var/lib/telemetry-buffer | awk '{print $1}')"; test "$buffer_bytes" -le 16777216
docker logs "$api" --since 5m 2>&1 | grep -E 'telemetry_(dropped|buffered)' >/dev/null
docker unpause "$collector"; trap - EXIT
for n in $(seq 1 30); do pending="$(docker exec "$api" find /var/lib/telemetry-buffer -type f | wc -l)"; test "$pending" -eq 0 && break; sleep 1; done
test "$pending" -eq 0` },
  ],
  "Deploy, canary e rollback": [
    { lang: "bash", purpose: "Verifica provenance e assinatura do digest e promove exatamente o mesmo subject para o canal canário.", code: `set -euo pipefail
subject='registry.example.invalid/chiron/app@sha256:SUBSTITUA_PELO_DIGEST'; canary='registry.example.invalid/chiron/app:canary'
cosign verify "$subject" --certificate-identity-regexp '^https://github.com/acme/chiron/' --certificate-oidc-issuer https://token.actions.githubusercontent.com > signature.json
cosign verify-attestation "$subject" --type slsaprovenance --certificate-identity-regexp '^https://github.com/acme/chiron/' --certificate-oidc-issuer https://token.actions.githubusercontent.com > provenance.json
expected="\${subject##*@}"; actual="$(docker buildx imagetools inspect "$subject" --format '{{.Manifest.Digest}}')"; test "$actual" = "$expected"
docker buildx imagetools create --tag "$canary" "$subject"
test "$(docker buildx imagetools inspect "$canary" --format '{{.Manifest.Digest}}')" = "$expected"
jq -n --arg subject "$subject" --arg digest "$expected" --arg channel "$canary" '{subject:$subject,digest:$digest,channel:$channel}' > release-manifest.json` },
    { lang: "bash", purpose: "Abort automaticamente o canário regressivo e reconcilia rollback ao digest anterior, preservando evidência.", code: `set -euo pipefail
release_id="rel-$RANDOM-$$"; previous="$(./platform current --service chiron --output digest)"; candidate="$(jq -r .digest release-manifest.json)"
./platform deploy --service chiron --release "$release_id" --digest "$candidate" --canary-percent 5 --wait=false
./platform analyze --release "$release_id" --window 10m --max-error-rate 0.02 --max-p95-ms 400 > analysis.json || failed=1
if test "\${failed:-0}" = 1; then
  ./platform abort --release "$release_id"
  ./platform deploy --service chiron --release "$release_id-rollback" --digest "$previous" --wait=true
fi
observed="$(./platform current --service chiron --output digest)"
if test "\${failed:-0}" = 1; then test "$observed" = "$previous"; else test "$observed" = "$candidate"; fi
jq -n --arg release "$release_id" --arg previous "$previous" --arg candidate "$candidate" --arg observed "$observed" --slurpfile analysis analysis.json '{release:$release,previous:$previous,candidate:$candidate,observed:$observed,analysis:$analysis}' > deploy-evidence.json` },
  ],
  "Disk, prune e retention": [
    { lang: "bash", purpose: "Planeja limpeza por labels e remove somente containers efêmeros parados e não protegidos.", code: `set -euo pipefail; docker system df -v > before.txt; docker ps -aq --filter label=chiron.lifecycle=ephemeral --filter label=chiron.owner=ci > candidates.ids; while read -r id; do test "$(docker inspect "$id" --format '{{.State.Running}}')" = false || continue; test "$(docker inspect "$id" --format '{{index .Config.Labels "chiron.protected"}}')" != true || continue; docker rm "$id"; done < candidates.ids; docker system df -v > after.txt` },
    { lang: "bash", purpose: "Prova double-check concorrente e preserva recurso ativado depois do inventário inicial.", code: `set -euo pipefail; id="$(docker create --label chiron.lifecycle=ephemeral alpine@sha256:SUBSTITUA_PELO_DIGEST sleep 300)"; trap 'docker rm -f "$id" >/dev/null 2>&1 || true' EXIT; printf '%s\n' "$id" > candidate.ids; docker start "$id" >/dev/null; while read -r candidate; do state="$(docker inspect "$candidate" --format '{{.State.Running}}')"; test "$state" = false && docker rm "$candidate"; done < candidate.ids; test "$(docker inspect "$id" --format '{{.State.Running}}')" = true` },
  ],
  "Daemon, builders e upgrades": [
    { lang: "bash", purpose: "Captura versões e executa smoke de runtime, isolamento e sinais no host canário.", code: `set -euo pipefail; context="\${1:?contexto canário}"; docker --context "$context" version --format '{{json .}}' > version.json; docker --context "$context" info --format '{{json .}}' > info.json; id="$(docker --context "$context" run -d --read-only --cap-drop ALL --tmpfs /tmp alpine@sha256:SUBSTITUA_PELO_DIGEST sleep 300)"; trap 'docker --context "$context" rm -f "$id" >/dev/null 2>&1 || true' EXIT; test "$(docker --context "$context" inspect "$id" --format '{{.State.Running}}')" = true; docker --context "$context" stop --time 10 "$id" >/dev/null` },
    { lang: "bash", purpose: "Recria builder canário e exige multi-platform, provenance, SBOM e ausência do segredo sintético.", code: `set -euo pipefail; builder=chiron-upgrade-canary; docker buildx create --name "$builder" --driver docker-container --use; trap 'docker buildx rm "$builder" >/dev/null 2>&1 || true' EXIT; docker buildx inspect --bootstrap > builder.txt; printf fixture > token.fixture; docker buildx build --builder "$builder" --platform linux/amd64,linux/arm64 --secret id=token,src=token.fixture --provenance=mode=max --sbom=true --output type=oci,dest=result.tar .; test -s result.tar; ! grep -a -F fixture result.tar` },
  ],
  "Backup, restore e disaster recovery": [
    { lang: "bash", purpose: "Restaura banco e volume em destinos novos com efeitos externos desligados e valida invariantes.", code: `set -euo pipefail; (cd backups && sha256sum -c SHA256SUMS); docker volume create chiron-dr-restore >/dev/null; docker run --rm --mount type=volume,src=chiron-dr-restore,dst=/data --mount type=bind,src="$(pwd)/backups",dst=/backup,readonly alpine@sha256:SUBSTITUA_PELO_DIGEST tar -xzf /backup/data.tgz -C /data; DR_EXTERNAL_EFFECTS=disabled docker compose -p chiron-dr -f compose.dr.yaml up -d --wait db; docker compose -p chiron-dr exec -T db pg_restore -U postgres --clean --if-exists -d postgres < backups/postgres.dump` },
    { lang: "bash", purpose: "Importa release e referrers em registry limpo e verifica assinatura e digest restaurados.", code: `set -euo pipefail; digest="$(cat backups/release.digest)"; subject="registry-dr.example.invalid/chiron/app@$digest"; oras cp --recursive oci-layout:backups/release-oci "$subject"; test "$(docker buildx imagetools inspect "$subject" --format '{{.Manifest.Digest}}')" = "$digest"; cosign verify "$subject" --certificate-identity-regexp '^https://github.com/acme/chiron/' --certificate-oidc-issuer https://token.actions.githubusercontent.com >/dev/null; oras discover --format json "$subject" | jq -e '.manifests | length >= 2' >/dev/null` },
  ],
  "Incidentes e cadeia de custódia Docker": [
    { lang: "bash", purpose: "Coleta artifacts originais com hashes e manifesto de custódia antes de analisar cópias.", code: `set -euo pipefail; id="\${1:?container}"; case_id="INC-$RANDOM-$(date -u +%Y%m%dT%H%M%SZ)"; root="evidence/$case_id"; install -d -m 0700 "$root/original" "$root/analysis"; docker inspect "$id" > "$root/original/inspect.json"; docker logs --timestamps "$id" > "$root/original/logs.txt" 2>&1; docker image save "$(docker inspect "$id" --format '{{.Image}}')" -o "$root/original/image.tar"; (cd "$root/original" && sha256sum * > SHA256SUMS); jq -n --arg case "$case_id" --arg source "$id" '{caseId:$case,source:$source}' > "$root/manifest.json"` },
    { lang: "bash", purpose: "Bloqueia digest comprometido, revoga o canário e implanta replacement assinado.", code: `set -euo pipefail; old="$(cat evidence/compromised.digest)"; replacement="$(cat evidence/replacement.digest)"; ./registry-policy deny --digest "$old" --reason incident --case "$CASE_ID"; ./identity-fixture revoke --token-id canary-incident; ! ./identity-fixture validate --token-id canary-incident; subject="registry.example.invalid/chiron/app@$replacement"; cosign verify "$subject" --certificate-identity-regexp '^https://github.com/acme/chiron/' --certificate-oidc-issuer https://token.actions.githubusercontent.com >/dev/null; ./platform deploy --service chiron --digest "$replacement" --release "$CASE_ID-recovery" --wait=true` },
  ],
  "Baseline containerizado do Quíron": [
    { lang: "bash", purpose: "Renderiza e sobe dois projetos do Quíron, validando isolamento e ausência de privilégio.", code: `set -euo pipefail; for p in chiron-bank-a chiron-bank-b; do CHIRON_IMAGE='registry.example.invalid/chiron/app@sha256:SUBSTITUA_PELO_DIGEST' docker compose -p "$p" -f compose.bank.yaml config --format json > "$p.json"; jq -e 'all(.services[]; (.privileged // false)==false)' "$p.json" >/dev/null; docker compose -p "$p" -f compose.bank.yaml up -d --wait; done; trap 'for p in chiron-bank-a chiron-bank-b; do docker compose -p "$p" -f compose.bank.yaml down -v >/dev/null 2>&1 || true; done' EXIT; test "$(docker compose -p chiron-bank-a ps -q api)" != "$(docker compose -p chiron-bank-b ps -q api)"` },
    { lang: "bash", purpose: "Audita non-root, rootfs read-only, caps zeradas, mounts e banco sem porta publicada.", code: `set -euo pipefail; id="$(docker compose -p chiron-bank-a ps -q api)"; docker inspect "$id" > inspect.json; jq -e '.[0].Config.User != "" and .[0].Config.User != "0" and .[0].HostConfig.ReadonlyRootfs == true' inspect.json >/dev/null; jq -e '.[0].HostConfig.Privileged == false and .[0].HostConfig.CapDrop == ["ALL"]' inspect.json >/dev/null; jq -e 'all(.[0].Mounts[]?; .Source != "/var/run/docker.sock" and .Source != "/")' inspect.json >/dev/null; test -z "$(docker port "$(docker compose -p chiron-bank-a ps -q db)")"` },
  ],
  "Última vaga em stack real": [
    { lang: "bash", purpose: "Dispara duas reservas sincronizadas e exige um vencedor, um conflito e invariantes no banco.", code: `set -euo pipefail; ./fixtures/barrier-server --participants 2 --listen 127.0.0.1:9191 & barrier=$!; trap 'kill "$barrier" >/dev/null 2>&1 || true' EXIT; for n in 1 2; do (./fixtures/reserve-client --barrier http://127.0.0.1:9191 --url http://127.0.0.1:8080/reservations --key "last-seat-$n" > "result-$n.json") & done; wait; jq -s -e '[.[].status] | sort == [201,409]' result-1.json result-2.json >/dev/null; docker compose exec -T db psql -U postgres -Atqc 'select remaining,reservations,outbox_events from race_evidence' | grep -Fx '0|1|1'` },
    { lang: "bash", purpose: "Corta a resposta após commit e reconcilia retry com a mesma chave sem segundo efeito.", code: `set -euo pipefail; key="ambiguous-$RANDOM-$$"; ./fault-proxy arm --mode commit-then-reset --request-key "$key"; curl -sS --max-time 3 -X POST http://127.0.0.1:8080/reservations -H "Idempotency-Key: $key" -d '{"seat":"fixture"}' || true; curl -fsS -X POST http://127.0.0.1:8080/reservations -H "Idempotency-Key: $key" -d '{"seat":"fixture"}' > result.json; jq -e '.status == "confirmed"' result.json >/dev/null; docker compose exec -T db psql -U postgres -Atqc "select count(*),count(distinct idempotency_key) from reservations where idempotency_key='$key'" | grep -Fx '1|1'` },
  ],
  "Release por digest e rollback": [
    { lang: "bash", purpose: "Valida o manifest e comprova que promoção e destino preservam exatamente o digest aprovado.", code: `set -euo pipefail; jq -e '.source.commit and (.images.api.digest | startswith("sha256:")) and .evidence.tests and .evidence.policy' release.json >/dev/null; digest="$(jq -r .images.api.digest release.json)"; source="registry-ci.example.invalid/chiron/app@$digest"; dest="registry.example.invalid/chiron/app@$digest"; oras cp --recursive "$source" "$dest"; test "$(docker buildx imagetools inspect "$dest" --format '{{.Manifest.Digest}}')" = "$digest"; cosign verify "$dest" --certificate-identity-regexp '^https://github.com/acme/chiron/' --certificate-oidc-issuer https://token.actions.githubusercontent.com >/dev/null` },
    { lang: "bash", purpose: "Executa canário e reverte ao digest anterior quando a análise pré-declarada falha.", code: `set -euo pipefail; candidate="$(jq -r .images.api.digest release.json)"; previous="$(./platform current --service chiron --output digest)"; id="release-$RANDOM"; ./platform deploy --service chiron --digest "$candidate" --release "$id" --canary-percent 5 --wait=false; if ! ./platform analyze --release "$id" --window 10m --policy policy/canary.json; then ./platform abort --release "$id"; ./platform deploy --service chiron --digest "$previous" --release "$id-rollback" --wait=true; fi; observed="$(./platform current --service chiron --output digest)"; test "$observed" = "$candidate" || test "$observed" = "$previous"` },
  ],
  "Banca, incidente e restore Docker": [
    { lang: "bash", purpose: "Orquestra todas as fases da banca e exige status aprovado com checksums dos artifacts.", code: `set -euo pipefail; run="bank-$RANDOM-$(date -u +%Y%m%dT%H%M%SZ)"; mkdir -p "evidence/$run"; ./bank/build-policy --run "$run" --output "evidence/$run/build.json"; ./bank/runtime-race --run "$run" --output "evidence/$run/runtime.json"; ./bank/canary-rollback --run "$run" --output "evidence/$run/release.json"; ./bank/incident --run "$run" --output "evidence/$run/incident.json"; jq -s -e 'all(.[]; .status == "passed")' evidence/$run/*.json >/dev/null; (cd "evidence/$run" && sha256sum *.json > SHA256SUMS)` },
    { lang: "bash", purpose: "Destrói somente a fixture, restaura em destino limpo e valida RPO, RTO e invariantes finais.", code: `set -euo pipefail; start="$(date +%s)"; docker compose -p chiron-bank -f compose.bank.yaml down -v; ./bank/restore --backup backups/latest.manifest.json --project chiron-restore --external-effects disabled --output restore.json; elapsed=$(( $(date +%s)-start )); jq --argjson seconds "$elapsed" '. + {rtoSeconds:$seconds}' restore.json > final.json; jq -e '.checksumsValid and .inventoryNonNegative and .reservationEffectsUnique and .oldTokenRevoked and .rpoSeconds <= 300 and .rtoSeconds <= 900' final.json >/dev/null; docker compose -p chiron-restore -f compose.bank.yaml down -v` },
  ],
};
