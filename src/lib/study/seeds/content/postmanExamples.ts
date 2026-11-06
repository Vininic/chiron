export type PostmanExample = { lang: "json" | "javascript" | "bash"; purpose: string; code: string };

export const POSTMAN_EXAMPLES: Record<string, PostmanExample[]> = {
  "Collections, folders e requests": [
    { lang: "json", purpose: "Define uma collection mínima, identificável e portátil com request, script e example sintético ligados à reserva.", code: `{
  "info": {
    "_postman_id": "4eb57431-5fb8-4f65-96b8-6f15a8b82001",
    "name": "Quíron Reservations",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [{
    "name": "Reservations",
    "item": [{
      "name": "Reserve seat — created",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Idempotency-Key", "value": "{{idempotencyKey}}" }],
        "body": { "mode": "raw", "raw": "{\\\"showId\\\":\\\"show_fixture\\\",\\\"quantity\\\":1}", "options": { "raw": { "language": "json" } } },
        "url": { "raw": "{{baseUrl}}/reservations", "host": ["{{baseUrl}}"], "path": ["reservations"] },
        "description": "Sandbox-only request; a 201 is accepted only with the independent effect observer."
      },
      "response": [{ "name": "Created", "originalRequest": {}, "status": "Created", "code": 201, "header": [{ "key": "Content-Type", "value": "application/json" }], "body": "{\\\"reservationId\\\":\\\"res_fixture\\\",\\\"status\\\":\\\"confirmed\\\"}" }]
    }]
  }]
}` },
    { lang: "javascript", purpose: "Inventaria requests normalizadas e reprova método/URL duplicados ou itens sem identidade operacional.", code: `const collection = pm.collectionVariables.get("collectionModel");
if (!collection || !Array.isArray(collection.item)) throw new Error("collectionModel fixture is missing");
const routes = [];
function visit(items, folder = []) {
  for (const item of items) {
    if (Array.isArray(item.item)) visit(item.item, [...folder, item.name]);
    else {
      if (!item.request?.method || !item.request?.url?.raw) throw new Error("request shape missing");
      const normalized = item.request.url.raw.replace(/\\{\\{[^}]+\\}\\}/g, "{variable}").replace(/\\\/$/, "");
      routes.push({ key: item.request.method.toUpperCase() + " " + normalized, name: [...folder, item.name].join(" / ") });
    }
  }
}
visit(collection.item);
const duplicated = routes.filter((route, index) => routes.findIndex((candidate) => candidate.key === route.key) !== index);
pm.test("method and resolved route identities are unique", () => pm.expect(duplicated, JSON.stringify(duplicated)).to.eql([]));` },
  ],
  "Variáveis e escopos": [
    { lang: "json", purpose: "Declara environment compartilhável sem secret e com sentinelas que falham antes de atingir destino incorreto.", code: `{
  "id": "611be7c5-0fa4-4dbe-b712-414c2bd7c001",
  "name": "quiron-sandbox",
  "values": [
    { "key": "baseUrl", "value": "https://sandbox-api.example.invalid", "type": "default", "enabled": true },
    { "key": "identityIssuer", "value": "https://identity.example.invalid/", "type": "default", "enabled": true },
    { "key": "audience", "value": "quiron-api", "type": "default", "enabled": true },
    { "key": "tenantFixture", "value": "tenant-fixture", "type": "default", "enabled": true },
    { "key": "accessToken", "value": "INJECT_AT_RUNTIME_AND_NEVER_EXPORT", "type": "secret", "enabled": true }
  ],
  "_postman_variable_scope": "environment",
  "_postman_exported_using": "reviewed-exporter-pin"
}` },
    { lang: "javascript", purpose: "Resolve e valida configuração crítica, impedindo placeholder, origem não allowlisted e tipos string ambíguos.", code: `const required = ["baseUrl", "identityIssuer", "audience", "tenantFixture"];
for (const key of required) {
  const value = pm.variables.get(key);
  if (typeof value !== "string" || value.trim() === "" || value.includes("{{")) throw new Error("missing or unresolved variable: " + key);
}
const baseUrl = new URL(pm.variables.get("baseUrl"));
const allowedOrigins = new Set(["https://sandbox-api.example.invalid"]);
if (!allowedOrigins.has(baseUrl.origin) || baseUrl.pathname !== "/") throw new Error("baseUrl outside the sandbox allowlist");
const rawMutationEnabled = pm.variables.get("mutationEnabled");
const mutationEnabled = rawMutationEnabled === "true" ? true : rawMutationEnabled === "false" ? false : null;
if (mutationEnabled === null) throw new Error("mutationEnabled must be the string true or false");
pm.variables.set("resolvedEnvironment", "sandbox");
pm.test("configuration remains sandbox-scoped", () => pm.expect(baseUrl.hostname).to.equal("sandbox-api.example.invalid"));` },
  ],
  "Environments, Vault e segredos": [
    { lang: "javascript", purpose: "Usa segredo injetado sem copiá-lo para scopes persistentes e instala sentinela de redaction verificável.", code: `const token = pm.variables.get("accessToken");
if (typeof token !== "string" || token.length < 20 || token === "INJECT_AT_RUNTIME_AND_NEVER_EXPORT") throw new Error("runtime credential unavailable");
if (pm.collectionVariables.has("accessToken") || pm.globals.has("accessToken")) throw new Error("credential persisted in a shared scope");
const origin = new URL(pm.variables.get("baseUrl")).origin;
if (origin !== "https://sandbox-api.example.invalid") throw new Error("credential destination rejected");
pm.request.headers.upsert({ key: "Authorization", value: "Bearer " + token });
pm.variables.set("credentialCanaryId", "canary-postman-credential-001");
pm.test("authorization exists only on the allowlisted request", () => {
  pm.expect(pm.request.headers.get("Authorization")).to.match(/^Bearer /);
  pm.expect(pm.request.url.toString()).to.match(/^https:\\/\\/sandbox-api\\.example\\.invalid\\//);
});` },
    { lang: "bash", purpose: "Escaneia collection, environment e reporters e falha se segredo, private key ou host interno chegou ao artifact.", code: `set -euo pipefail
for file in artifacts/quiron.postman_collection.json artifacts/quiron.postman_environment.json reports/newman.json reports/newman.xml; do test -f "$file"; done
if rg -n -i 'bearer[[:space:]]+[A-Za-z0-9._-]{16,}|BEGIN (RSA |EC )?PRIVATE KEY|client[_-]?secret|password["[:space:]]*:' artifacts reports; then
  echo 'secret-like value reached an exported artifact' >&2; exit 1
fi
! rg -n 'canary-postman-credential-001|internal\.corp|169\.254\.169\.254' artifacts reports
jq -e '.values | all(.key != "accessToken" or (.value == "" or .value == "INJECT_AT_RUNTIME_AND_NEVER_EXPORT"))' artifacts/quiron.postman_environment.json >/dev/null
sha256sum artifacts/*.json reports/* > evidence/redacted-artifacts.sha256` },
  ],
  "Import, export e versionamento": [
    { lang: "json", purpose: "Relaciona source OpenAPI, collection, environment e runtime por digest sem confundir versões da API e do artifact.", code: `{
  "releaseId": "quiron-postman-1.0.0",
  "source": { "kind": "openapi", "version": "3.2.1", "digest": "sha256:OPENAPI_BUNDLE" },
  "collection": { "format": "2.1.0", "path": "artifacts/quiron.postman_collection.json", "digest": "sha256:COLLECTION" },
  "environment": { "path": "artifacts/quiron.postman_environment.json", "digest": "sha256:ENVIRONMENT_WITHOUT_SECRETS" },
  "data": { "path": "fixtures/reservations.json", "digest": "sha256:DATA" },
  "toolchain": { "converter": "PINNED_CONVERTER", "newman": "PINNED_NEWMAN", "node": "20" },
  "authority": "openapi-design-first",
  "cloud": { "workspaceId": "WORKSPACE_ID", "collectionId": "COLLECTION_ID", "syncStatus": "pending-authorized-gate" },
  "promotion": { "rebuild": false, "requireSameDigests": true }
}` },
    { lang: "bash", purpose: "Valida e normaliza duas conversões limpas, compara semanticamente e rejeita perda de scripts ou secrets importados.", code: `set -euo pipefail
for dir in conversion-a conversion-b; do
  rm -rf "$dir"; mkdir "$dir"
  ./tools/openapi-to-postman --input contracts/quiron-openapi.json --output "$dir/collection.json" --config generation/postman.json --offline
  ./tools/postman-collection-validate --collection "$dir/collection.json" --schema 2.1.0 --output "$dir/validation.json"
  ./tools/postman-normalize --collection "$dir/collection.json" --output "$dir/canonical.json"
done
cmp conversion-a/canonical.json conversion-b/canonical.json
./tools/postman-semantic-diff --before artifacts/quiron.postman_collection.json --after conversion-a/collection.json --require-script-preservation --output conversion-diff.json
jq -e '.secrets == 0 and .duplicateRequests == 0 and .lostCriticalScripts == 0 and .unresolvedVariables == 0' conversion-diff.json >/dev/null
! rg -n -i 'authorization.*bearer|cookie.*session|internal\.corp' conversion-a conversion-b
sha256sum conversion-a/canonical.json conversion-diff.json > evidence/conversion.sha256` },
  ],
  "URLs, path e query": [
    { lang: "json", purpose: "Representa path e query repetida como componentes explícitos, mantendo origem sandbox fora dos dados iterados.", code: `{
  "name": "List reservations with repeated status",
  "request": {
    "method": "GET",
    "header": [{ "key": "Accept", "value": "application/json" }],
    "url": {
      "raw": "{{baseUrl}}/shows/:showId/reservations?status=pending&status=confirmed&page=1",
      "host": ["{{baseUrl}}"],
      "path": ["shows", ":showId", "reservations"],
      "variable": [{ "key": "showId", "value": "show_fixture_a%2Fb", "description": "A single encoded path segment fixture" }],
      "query": [
        { "key": "status", "value": "pending" },
        { "key": "status", "value": "confirmed" },
        { "key": "page", "value": "1" },
        { "key": "debug", "value": "true", "disabled": true }
      ]
    }
  }
}` },
    { lang: "javascript", purpose: "Bloqueia host inesperado e compara pares de query efetivos sem colapsar duplicatas ou disabled params.", code: `const resolved = new URL(pm.request.url.toString());
if (resolved.origin !== "https://sandbox-api.example.invalid") throw new Error("request destination is not the approved sandbox");
if (resolved.username || resolved.password || resolved.hash) throw new Error("userinfo and fragments are forbidden");
const expected = [["status", "pending"], ["status", "confirmed"], ["page", "1"]];
const actual = Array.from(resolved.searchParams.entries());
pm.test("query preserves repeated keys and order", () => pm.expect(actual).to.eql(expected));
pm.test("disabled debug query is absent", () => pm.expect(resolved.searchParams.has("debug")).to.equal(false));
const pathSegments = resolved.pathname.split("/").filter(Boolean);
pm.test("the encoded identifier remains one route segment", () => pm.expect(pathSegments).to.have.length(3));
pm.variables.set("wireUrlHashInput", resolved.pathname + "?" + resolved.searchParams.toString());` },
  ],
  "Headers, cookies e negociação": [
    { lang: "javascript", purpose: "Valida response negotiated, Location e Retry-After sem persistir headers sensíveis em scopes compartilhados.", code: `pm.test("response has the documented media type", () => {
  const contentType = pm.response.headers.get("Content-Type") || "";
  pm.expect(contentType.toLowerCase()).to.match(/^application\\/(json|problem\\+json)(?:;|$)/);
});
const location = pm.response.headers.get("Location");
if (location) {
  const target = new URL(location, pm.variables.get("baseUrl"));
  if (target.origin !== "https://sandbox-api.example.invalid") throw new Error("cross-origin Location rejected");
  pm.variables.set("reservationLocation", target.pathname);
}
const retryAfter = pm.response.headers.get("Retry-After");
if (retryAfter && !/^\\d{1,3}$/.test(retryAfter)) throw new Error("Retry-After outside the supported seconds form");
for (const forbidden of ["Authorization", "Cookie", "Set-Cookie"]) pm.test(forbidden + " is not echoed", () => pm.expect(pm.response.headers.has(forbidden)).to.equal(false));` },
    { lang: "bash", purpose: "Executa Newman com jar temporário e prova que autenticação residual não mascara o caso sem credencial.", code: `set -euo pipefail
run_dir="$(mktemp -d)"; trap 'rm -rf "$run_dir"' EXIT
cp artifacts/quiron.postman_environment.json "$run_dir/environment.json"
printf '{"cookie":[]}' > "$run_dir/cookie-jar.json"
newman run artifacts/quiron.postman_collection.json -e "$run_dir/environment.json" --folder 'Headers and cookies' --cookie-jar "$run_dir/cookie-jar.json" --reporters cli,json --reporter-json-export "$run_dir/report.json" --bail
jq -e '.run.failures | length == 0' "$run_dir/report.json" >/dev/null
./tools/postman-case --collection artifacts/quiron.postman_collection.json --case unauthenticated-with-empty-jar --cookie-jar "$run_dir/cookie-jar.json" --output "$run_dir/unauthenticated.json"
jq -e '.status == 401 and .databaseWrites == 0 and .outboxEvents == 0' "$run_dir/unauthenticated.json" >/dev/null
! rg -n -i 'authorization|set-cookie|bearer ' "$run_dir/report.json"` },
  ],
  "Bodies, forms e arquivos": [
    { lang: "json", purpose: "Declara JSON e multipart com fixtures portáveis, deixando o boundary sob responsabilidade do runtime.", code: `{
  "item": [
    {
      "name": "Create reservation JSON",
      "request": { "method": "POST", "header": [{ "key": "Content-Type", "value": "application/json" }], "body": { "mode": "raw", "raw": "{\\\"showId\\\":\\\"show_fixture\\\",\\\"quantity\\\":1}", "options": { "raw": { "language": "json" } } }, "url": "{{baseUrl}}/reservations" }
    },
    {
      "name": "Attach synthetic evidence multipart",
      "request": { "method": "POST", "header": [], "body": { "mode": "formdata", "formdata": [
        { "key": "metadata", "value": "{\\\"kind\\\":\\\"fixture\\\"}", "contentType": "application/json", "type": "text" },
        { "key": "evidence", "src": "fixtures/evidence.txt", "contentType": "text/plain", "type": "file" }
      ] }, "url": "{{baseUrl}}/reservations/{{reservationId}}/evidence" }
    }
  ]
}` },
    { lang: "bash", purpose: "Verifica fixtures, executa modes e observa que oversized ou missing file não produz estado nem artifact.", code: `set -euo pipefail
test -f fixtures/evidence.txt; test "$(wc -c < fixtures/evidence.txt)" -le 4096
sha256sum -c fixtures/manifest.sha256
newman run artifacts/quiron.postman_collection.json -e runtime/sandbox.environment.json --folder 'Bodies forms and files' --working-dir "$PWD" --reporters json --reporter-json-export reports/bodies.json --bail
jq -e '.run.failures | length == 0' reports/bodies.json >/dev/null
./tools/postman-case --case oversized-multipart --fixture fixtures/oversized.bin --expect-status 413 --output reports/oversized.json
./tools/postman-case --case missing-file --fixture fixtures/does-not-exist.bin --expect-client-failure --output reports/missing.json
jq -e '.databaseWrites == 0 and .storageObjects == 0 and .outboxEvents == 0' reports/oversized.json >/dev/null
jq -e '.requestSent == false' reports/missing.json >/dev/null
! rg -n 'C:\\Users|/home/[^/]+|multipart/form-data; boundary=' artifacts/quiron.postman_collection.json` },
  ],
  "Auth, proxy e certificados": [
    { lang: "json", purpose: "Configura auth herdada por bearer sentinela e mantém certificados e proxy fora da collection exportável.", code: `{
  "info": { "name": "Quíron auth fixture", "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
  "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{accessToken}}", "type": "string" }] },
  "variable": [
    { "key": "baseUrl", "value": "https://sandbox-api.example.invalid" },
    { "key": "accessToken", "value": "INJECT_AT_RUNTIME_AND_NEVER_EXPORT", "type": "string" }
  ],
  "item": [
    { "name": "Authenticated reservation", "request": { "auth": { "type": "inherit" }, "method": "GET", "url": "{{baseUrl}}/reservations/res_fixture" } },
    { "name": "Public liveness", "request": { "auth": { "type": "noauth" }, "method": "GET", "url": "{{baseUrl}}/health/live" } }
  ],
  "description": "Client certificates, private keys and proxy credentials are injected into the executor, never exported here."
}` },
    { lang: "javascript", purpose: "Impede credential forwarding para origem errada e afirma a taxonomia segura de falhas de autenticação.", code: `const requestUrl = new URL(pm.request.url.toString());
const authenticatedOperations = new Set(["Authenticated reservation", "Create reservation"]);
if (authenticatedOperations.has(pm.info.requestName)) {
  if (requestUrl.origin !== "https://sandbox-api.example.invalid") throw new Error("credential destination rejected");
  const authorization = pm.request.headers.get("Authorization");
  if (!authorization || !/^Bearer [^\\s]+$/.test(authorization)) throw new Error("one bearer credential is required");
}
pm.test("authentication outcome is documented", () => pm.expect([200, 201, 401, 403, 404]).to.include(pm.response.code));
if (pm.response.code >= 400) {
  const problem = pm.response.json();
  pm.test("auth failure remains a safe Problem", () => {
    pm.expect(problem.status).to.equal(pm.response.code);
    pm.expect(problem).to.not.have.any.keys("stack", "sql", "token");
  });
}` },
  ],
  "Ordem de execução e contexto": [
    { lang: "javascript", purpose: "Registra ordem de fases em variável local e bloqueia execução fora do contexto esperado.", code: `const event = pm.info.eventName;
const request = pm.info.requestName;
const allowedEvents = new Set(["prerequest", "test"]);
if (!allowedEvents.has(event)) throw new Error("unsupported sandbox event: " + event);
const trace = JSON.parse(pm.variables.get("executionTrace") || "[]");
trace.push({ event, request, iteration: pm.info.iteration, level: pm.variables.get("scriptLevel") || "request" });
if (trace.length > 12) throw new Error("execution trace exceeded the bounded workflow");
pm.variables.set("executionTrace", JSON.stringify(trace));
if (event === "prerequest") {
  const target = new URL(pm.request.url.toString());
  if (target.origin !== "https://sandbox-api.example.invalid") throw new Error("destination guard failed before send");
}` },
    { lang: "javascript", purpose: "Compara snapshot final de request e detecta header duplicado ou mutation invisível entre níveis.", code: `const sensitiveSingletons = ["authorization", "content-type", "idempotency-key"];
const names = pm.request.headers.all().filter((header) => !header.disabled).map((header) => header.key.toLowerCase());
for (const name of sensitiveSingletons) {
  const count = names.filter((candidate) => candidate === name).length;
  if (count > 1) throw new Error("duplicate singleton header: " + name);
}
const snapshot = { method: pm.request.method, origin: new URL(pm.request.url.toString()).origin, headerNames: [...new Set(names)].sort() };
pm.variables.set("finalRequestSnapshot", JSON.stringify(snapshot));
pm.test("request remained inside the declared boundary", () => {
  pm.expect(snapshot.method).to.match(/^(GET|POST|PUT|PATCH|DELETE)$/);
  pm.expect(snapshot.origin).to.equal("https://sandbox-api.example.invalid");
});` },
  ],
  "Pre-request e dados dinâmicos": [
    { lang: "javascript", purpose: "Constrói payload tipado e idempotency key estável por run sem interpolação insegura de JSON.", code: `const runId = pm.variables.get("runId") || pm.variables.replaceIn("{{$guid}}");
pm.variables.set("runId", runId);
const existingKey = pm.variables.get("idempotencyKey");
const idempotencyKey = existingKey || "postman-" + runId;
pm.variables.set("idempotencyKey", idempotencyKey);
const quantity = Number(pm.iterationData.get("quantity") ?? 1);
if (!Number.isInteger(quantity) || quantity < 1 || quantity > 8) throw new Error("quantity outside fixture bounds");
const payload = { showId: String(pm.iterationData.get("showId") || "show_fixture"), quantity, fixtureRunId: runId };
pm.request.body.update(JSON.stringify(payload));
pm.request.headers.upsert({ key: "Content-Type", value: "application/json" });
pm.request.headers.upsert({ key: "Idempotency-Key", value: idempotencyKey });` },
    { lang: "javascript", purpose: "Canonicaliza componentes de assinatura e valida vetor conhecido antes de usar segredo no host allowlisted.", code: `const target = new URL(pm.request.url.toString());
if (target.origin !== "https://sandbox-api.example.invalid") throw new Error("signature target rejected");
const timestamp = pm.variables.get("fixtureTimestamp") || new Date().toISOString();
const body = pm.request.body?.raw || "";
const canonical = [pm.request.method.toUpperCase(), target.pathname, target.searchParams.toString(), timestamp, body].join("\\n");
const secret = pm.variables.get("signingSecret");
if (!secret || secret === "INJECT_AT_RUNTIME") throw new Error("signing secret unavailable");
const signature = CryptoJS.HmacSHA256(canonical, secret).toString(CryptoJS.enc.Hex);
if (!/^[a-f0-9]{64}$/.test(signature)) throw new Error("unexpected signature encoding");
pm.request.headers.upsert({ key: "X-Quiron-Timestamp", value: timestamp });
pm.request.headers.upsert({ key: "X-Quiron-Signature", value: signature });` },
  ],
  "Tests, assertions e diagnostics": [
    { lang: "javascript", purpose: "Valida status, media type, Problem ou reserva e correlação sem despejar body em diagnostics.", code: `const expectedStatus = Number(pm.iterationData.get("expectedStatus") ?? 201);
pm.test("returns the scenario outcome", () => pm.expect(pm.response.code).to.equal(expectedStatus));
const mediaType = (pm.response.headers.get("Content-Type") || "").split(";", 1)[0].toLowerCase();
pm.test("returns a documented JSON media type", () => pm.expect(["application/json", "application/problem+json"]).to.include(mediaType));
const body = pm.response.json();
if (expectedStatus >= 400) {
  pm.test("returns a bounded safe Problem", () => { pm.expect(body.status).to.equal(expectedStatus); pm.expect(body.code).to.be.a("string"); pm.expect(body).to.not.have.any.keys("stack", "sql", "token"); });
} else {
  pm.test("returns the committed reservation shape", () => { pm.expect(body.reservationId).to.match(/^res_[A-Za-z0-9_]+$/); pm.expect(body.status).to.equal("confirmed"); });
}
pm.test("includes correlation", () => pm.expect(pm.response.headers.get("X-Correlation-Id")).to.be.a("string").and.not.empty);` },
    { lang: "javascript", purpose: "Correlaciona retry e efeito observado, rejeitando response igual acompanhada de duplicação.", code: `const evidence = pm.response.json();
pm.test("observer accepted the idempotency scenario", () => {
  pm.expect(evidence.idempotencyKeyHash).to.equal(pm.variables.get("idempotencyKeyHash"));
  pm.expect(evidence.reservations).to.equal(1);
  pm.expect(evidence.outboxEvents).to.equal(1);
  pm.expect(evidence.providerEffects).to.equal(1);
  pm.expect(evidence.forbiddenWrites).to.equal(0);
});
const firstReservation = pm.variables.get("firstReservationId");
if (firstReservation) pm.test("retry returns the original outcome", () => pm.expect(evidence.reservationId).to.equal(firstReservation));
else pm.variables.set("firstReservationId", evidence.reservationId);
pm.test("observer response carries no sensitive fields", () => pm.expect(evidence).to.not.have.any.keys("token", "authorization", "payload", "sql"));` },
  ],
  "Async, packages e segurança": [
    { lang: "javascript", purpose: "Executa chamada auxiliar allowlisted e valida erro, status e shape antes de manter token apenas localmente.", code: `const issuer = new URL(pm.variables.get("tokenEndpoint"));
if (issuer.origin !== "https://identity.example.invalid") throw new Error("token endpoint rejected");
pm.sendRequest({ url: issuer.toString(), method: "POST", header: { "Content-Type": "application/x-www-form-urlencoded" }, body: { mode: "urlencoded", urlencoded: [{ key: "grant_type", value: "client_credentials" }, { key: "scope", value: "reservations:write" }] } }, (error, response) => {
  pm.test("token helper completed", () => pm.expect(error).to.equal(null));
  if (error) return;
  pm.test("token endpoint returned JSON", () => { pm.expect(response.code).to.equal(200); pm.expect(response.headers.get("Content-Type")).to.match(/^application\\/json/); });
  const body = response.json();
  if (typeof body.access_token !== "string" || body.access_token.length < 20 || body.expires_in > 3600) throw new Error("invalid token response");
  pm.variables.set("accessToken", body.access_token);
});` },
    { lang: "bash", purpose: "Escaneia destinations e constructs perigosos antes de executar scripts em runtime pinado.", code: `set -euo pipefail
./tools/postman-script-inventory --collection artifacts/quiron.postman_collection.json --output reports/script-inventory.json
jq -e '.scripts > 0 and (.destinations | all(. == "https://identity.example.invalid" or . == "https://sandbox-api.example.invalid"))' reports/script-inventory.json >/dev/null
if rg -n 'eval\(|new Function|pm\.globals\.toObject' artifacts/quiron.postman_collection.json; then exit 1; fi
newman run artifacts/quiron.postman_collection.json -e runtime/sandbox.environment.json --folder 'Sandbox security' --reporters json --reporter-json-export reports/sandbox-security.json --bail
jq -e '.run.failures | length == 0 and (.run.executions | length > 0)' reports/sandbox-security.json >/dev/null
! rg -n 'canary-postman-secret|Bearer [A-Za-z0-9._-]{16,}' reports/sandbox-security.json` },
  ],
  "Collection Runner e iterations": [
    { lang: "json", purpose: "Fornece casos iterativos tipados e namespaced sem permitir que data sobrescreva host ou credencial.", code: `[
  { "caseId": "minimum-created", "runId": "run_fixture_a", "showId": "show_available", "quantity": 1, "expectedStatus": 201, "expectedCode": null },
  { "caseId": "maximum-created", "runId": "run_fixture_a", "showId": "show_available", "quantity": 8, "expectedStatus": 201, "expectedCode": null },
  { "caseId": "sold-out", "runId": "run_fixture_a", "showId": "show_sold_out", "quantity": 1, "expectedStatus": 409, "expectedCode": "sold_out" },
  { "caseId": "invalid-zero", "runId": "run_fixture_a", "showId": "show_available", "quantity": 0, "expectedStatus": 400, "expectedCode": "validation_failed" }
]` },
    { lang: "javascript", purpose: "Valida cada linha e remove outputs locais para impedir que a próxima iteração reutilize state antigo.", code: `const allowedKeys = new Set(["caseId", "runId", "showId", "quantity", "expectedStatus", "expectedCode"]);
const data = pm.iterationData.toObject();
for (const key of Object.keys(data)) if (!allowedKeys.has(key)) throw new Error("unexpected iteration key: " + key);
for (const key of ["baseUrl", "accessToken", "tenantId"]) if (Object.prototype.hasOwnProperty.call(data, key)) throw new Error("critical scope shadowed by data: " + key);
if (!/^[a-z0-9_-]{3,64}$/.test(String(data.caseId))) throw new Error("invalid caseId");
if (!Number.isInteger(Number(data.expectedStatus))) throw new Error("expectedStatus must be numeric");
for (const output of ["reservationId", "reservationLocation", "firstReservationId"]) pm.variables.unset(output);
pm.variables.set("fixtureOwner", String(data.runId) + ":" + String(data.caseId));` },
  ],
  "Newman CLI": [
    { lang: "bash", purpose: "Executa inputs por digest com exit code, counts e reporters redigidos em diretório temporário.", code: `set -euo pipefail
run_dir="$(mktemp -d)"; trap 'rm -rf "$run_dir"' EXIT
sha256sum -c release/postman-inputs.sha256
cp artifacts/quiron.postman_environment.json "$run_dir/environment.json"
set +e
newman run artifacts/quiron.postman_collection.json -e "$run_dir/environment.json" -d fixtures/reservations.json --working-dir "$PWD" --timeout-request 5000 --timeout-script 3000 --bail failure --reporters cli,json,junit --reporter-json-export "$run_dir/result.json" --reporter-junit-export "$run_dir/result.xml"
status=$?; set -e
cp "$run_dir/result.json" reports/newman.json; cp "$run_dir/result.xml" reports/newman.xml
test "$status" = 0
jq -e '.run.stats.iterations.total == 4 and .run.stats.requests.total > 0 and .run.stats.tests.total > 0 and (.run.failures | length == 0)' reports/newman.json >/dev/null
! rg -n -i 'bearer |access_token|set-cookie|canary-postman-secret' reports/newman.*` },
    { lang: "json", purpose: "Registra toolchain, inputs, limites e counts esperados para tornar o run auditável e repetível.", code: `{
  "runId": "quiron-newman-fixture-001",
  "toolchain": { "node": "20.x", "newman": "PINNED_BY_LOCKFILE", "lockDigest": "sha256:LOCK" },
  "inputs": { "collection": "sha256:COLLECTION", "environment": "sha256:ENVIRONMENT", "data": "sha256:DATA" },
  "selection": { "folder": null, "iterations": 4 },
  "limits": { "requestTimeoutMs": 5000, "scriptTimeoutMs": 3000, "totalTimeoutMs": 60000 },
  "network": { "allowedOrigins": ["https://sandbox-api.example.invalid", "https://identity.example.invalid"], "tlsVerification": true },
  "expected": { "minimumRequests": 4, "minimumTests": 16, "failures": 0, "residualFixtures": 0 },
  "reporters": ["json", "junit"],
  "redactionPolicy": "postman-evidence-v1"
}` },
  ],
  "Postman CLI e cloud": [
    { lang: "json", purpose: "Fixa IDs e digests cloud esperados sem armazenar a credencial de automação na collection.", code: `{
  "workspaceId": "workspace_fixture_id",
  "apiId": "api_fixture_id",
  "collectionId": "collection_fixture_id",
  "environmentId": "environment_fixture_id",
  "expected": { "collectionDigest": "sha256:COLLECTION", "definitionDigest": "sha256:OPENAPI", "rulesetVersion": "quiron-governance-1.4.0" },
  "identity": { "kind": "ci-workload", "secretSource": "runtime-secret-manager", "requiredScopes": ["collections:read", "api:lint"] },
  "operations": { "download": true, "lint": true, "run": true, "push": false },
  "environment": "sandbox",
  "cleanup": { "deletePreview": true, "revokeRunToken": true }
}` },
    { lang: "bash", purpose: "Baixa por ID, verifica digest e executa lint/run sem push ou chave pessoal persistente.", code: `set -euo pipefail
test -n "\${POSTMAN_API_KEY:?workload key must be injected at runtime}"
postman login --with-api-key "$POSTMAN_API_KEY"
postman collection export collection_fixture_id --output cloud-collection.json
test "$(sha256sum cloud-collection.json | cut -d' ' -f1)" = "$EXPECTED_COLLECTION_DIGEST"
postman api lint api_fixture_id --fail-severity error --output reports/cloud-lint.json
postman collection run collection_fixture_id --environment-id environment_fixture_id --reporters json --reporter-json-export reports/cloud-run.json
jq -e '.errors == 0' reports/cloud-lint.json >/dev/null
jq -e '.run.failures | length == 0' reports/cloud-run.json >/dev/null
! rg -n "$POSTMAN_API_KEY|Bearer [A-Za-z0-9._-]{16,}" reports cloud-collection.json
postman logout` },
  ],
  "Determinismo, paralelismo e cleanup": [
    { lang: "bash", purpose: "Lança dois Newman isolados, preserva ambos os status e verifica invariantes e cleanup após o join.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
for worker in a b; do mkdir "$root/$worker"; jq --arg run "parallel-$worker-$$" '.values += [{"key":"runId","value":$run,"enabled":true}]' artifacts/quiron.postman_environment.json > "$root/$worker/environment.json"; done
newman run artifacts/quiron.postman_collection.json -e "$root/a/environment.json" --folder 'Last seat' --reporters json --reporter-json-export "$root/a/report.json" & pid_a=$!
newman run artifacts/quiron.postman_collection.json -e "$root/b/environment.json" --folder 'Last seat' --reporters json --reporter-json-export "$root/b/report.json" & pid_b=$!
status=0; wait "$pid_a" || status=1; wait "$pid_b" || status=1; test "$status" = 0
./fixtures/query-parallel-evidence --runs "parallel-a-$$,parallel-b-$$" > "$root/evidence.json"
jq -e '.confirmedQuantity == 1 and .reservations == 1 and .outboxEvents == 1 and .crossRunDeletes == 0' "$root/evidence.json" >/dev/null
./fixtures/cleanup-runs --runs "parallel-a-$$,parallel-b-$$" --require-owner --max-items 20` },
    { lang: "javascript", purpose: "Gera ownership bounded por run e impede teardown quando ambiente, formato ou limite não coincidem.", code: `const runId = pm.variables.get("runId");
if (typeof runId !== "string" || !/^parallel-[ab]-[0-9]+$/.test(runId)) throw new Error("unsafe or missing run ownership");
if (new URL(pm.variables.get("baseUrl")).origin !== "https://sandbox-api.example.invalid") throw new Error("cleanup outside sandbox refused");
const resources = JSON.parse(pm.variables.get("ownedResourceIds") || "[]");
if (!Array.isArray(resources) || resources.length > 20 || resources.some((id) => typeof id !== "string" || !id.startsWith("res_fixture_"))) throw new Error("cleanup inventory rejected");
pm.variables.set("cleanupPlan", JSON.stringify({ runId, resources: [...new Set(resources)], maximumDeletes: 20 }));
pm.test("cleanup remains ownership-scoped", () => { pm.expect(runId).to.match(/^parallel-/); pm.expect(resources.length).to.be.at.most(20); });` },
  ],
  "Response, headers e tempo": [
    { lang: "javascript", purpose: "Valida outcome, media type, headers contratuais e budget smoke sem confundir velocidade com correção.", code: `const expectedStatus = Number(pm.iterationData.get("expectedStatus"));
pm.test("returns the exact scenario status", () => pm.expect(pm.response.code).to.equal(expectedStatus));
const contentType = (pm.response.headers.get("Content-Type") || "").toLowerCase();
if (expectedStatus !== 204 && expectedStatus !== 304) pm.test("returns a JSON contract media type", () => pm.expect(contentType).to.match(/^application\\/(json|problem\\+json)(?:;|$)/));
if (expectedStatus === 201) {
  const location = pm.response.headers.get("Location");
  pm.test("returns same-origin Location", () => { pm.expect(location).to.be.a("string"); pm.expect(new URL(location, pm.variables.get("baseUrl")).origin).to.equal("https://sandbox-api.example.invalid"); });
}
pm.test("returns a bounded correlation identifier", () => pm.expect(pm.response.headers.get("X-Correlation-Id")).to.match(/^[A-Za-z0-9._:-]{8,64}$/));
pm.test("smoke request completes before the hang guard", () => pm.expect(pm.response.responseTime).to.be.below(5000));` },
    { lang: "javascript", purpose: "Trata Problem sem vazar body e valida Retry-After e ausência de headers de debug.", code: `if (pm.response.code >= 400) {
  const media = (pm.response.headers.get("Content-Type") || "").split(";", 1)[0].toLowerCase();
  pm.test("failure uses Problem media type", () => pm.expect(media).to.equal("application/problem+json"));
  const problem = pm.response.json();
  pm.test("Problem is safe and correlated", () => { pm.expect(problem.status).to.equal(pm.response.code); pm.expect(problem.code).to.match(/^[a-z][a-z0-9_]{2,63}$/); pm.expect(problem).to.not.have.any.keys("stack", "sql", "token", "payload"); });
}
const retryAfter = pm.response.headers.get("Retry-After");
if (retryAfter) pm.test("Retry-After is bounded seconds", () => pm.expect(Number(retryAfter)).to.be.within(1, 300));
for (const name of ["X-Debug", "X-Sql", "X-Stack"]) pm.test(name + " is absent", () => pm.expect(pm.response.headers.has(name)).to.equal(false));` },
  ],
  "JSON Schema e OpenAPI": [
    { lang: "json", purpose: "Materializa schema de response ligado ao bundle, com fechamento e constraints explícitos para o runtime suportado.", code: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://schemas.example.invalid/quiron/reservation-response-1.0.0.json",
  "type": "object",
  "additionalProperties": false,
  "required": ["reservationId", "status", "quantity", "createdAt"],
  "properties": {
    "reservationId": { "type": "string", "pattern": "^res_[A-Za-z0-9_]{8,64}$" },
    "status": { "type": "string", "enum": ["pending", "confirmed", "rejected", "cancelled"] },
    "quantity": { "type": "integer", "minimum": 1, "maximum": 8 },
    "createdAt": { "type": "string", "format": "date-time" }
  },
  "x-source": { "openapiDigest": "sha256:OPENAPI", "pointer": "/components/schemas/Reservation", "extractedBy": "PINNED_TOOL" }
}` },
    { lang: "javascript", purpose: "Executa schema extraído e invariantes que o shape sozinho não prova, com digest previamente reconciliado.", code: `const schema = JSON.parse(pm.collectionVariables.get("reservationResponseSchema"));
if (schema["x-source"]?.openapiDigest !== pm.collectionVariables.get("openapiDigest")) throw new Error("schema and contract digests diverged");
pm.test("response matches the extracted reservation schema", () => pm.response.to.have.jsonSchema(schema));
const body = pm.response.json();
pm.test("Location identifies the response reservation", () => {
  const location = new URL(pm.response.headers.get("Location"), pm.variables.get("baseUrl"));
  pm.expect(location.pathname.endsWith("/" + encodeURIComponent(body.reservationId))).to.equal(true);
});
pm.test("confirmed reservation preserves requested quantity", () => {
  if (body.status === "confirmed") pm.expect(body.quantity).to.equal(Number(pm.iterationData.get("quantity")));
});` },
  ],
  "Casos negativos e mutation": [
    { lang: "json", purpose: "Define catálogo de mutantes isolados com status, código e invariantes de zero efeito.", code: `[
  { "caseId": "missing-quantity", "mutation": { "remove": "/quantity" }, "expectedStatus": 400, "expectedCode": "validation_failed", "expectedEffects": 0 },
  { "caseId": "quantity-zero", "mutation": { "replace": { "path": "/quantity", "value": 0 } }, "expectedStatus": 400, "expectedCode": "validation_failed", "expectedEffects": 0 },
  { "caseId": "unknown-field", "mutation": { "add": { "path": "/role", "value": "admin" } }, "expectedStatus": 400, "expectedCode": "validation_failed", "expectedEffects": 0 },
  { "caseId": "wrong-audience", "credential": "wrong-audience", "expectedStatus": 401, "expectedCode": "invalid_token", "expectedEffects": 0 },
  { "caseId": "wrong-tenant", "credential": "tenant-b", "resource": "tenant-a", "expectedStatus": 404, "expectedCode": "not_found", "expectedEffects": 0 }
]` },
    { lang: "javascript", purpose: "Valida que o mutante chegou ao boundary e que a negação não produziu efeito de negócio.", code: `const expectedStatus = Number(pm.iterationData.get("expectedStatus"));
const expectedCode = String(pm.iterationData.get("expectedCode"));
pm.test("mutant is rejected by the expected boundary", () => { pm.expect(pm.response.code).to.equal(expectedStatus); pm.expect(pm.response.json().code).to.equal(expectedCode); });
const sentDigest = pm.variables.get("mutatedRequestDigest");
if (!sentDigest || sentDigest === pm.variables.get("baselineRequestDigest")) throw new Error("negative case did not mutate the wire fixture");
const evidence = pm.response.json().testEvidence;
pm.test("negative case produces no business effect", () => {
  pm.expect(evidence.requestDigest).to.equal(sentDigest);
  pm.expect(evidence.databaseWrites).to.equal(0);
  pm.expect(evidence.outboxEvents).to.equal(0);
  pm.expect(evidence.providerEffects).to.equal(0);
});` },
  ],
  "Estado, efeitos e idempotência": [
    { lang: "javascript", purpose: "Guarda o primeiro outcome localmente e exige que retry com mesma chave devolva o mesmo recurso.", code: `const body = pm.response.json();
const key = pm.variables.get("idempotencyKey");
if (!key) throw new Error("idempotency key is missing from the scenario");
const first = pm.variables.get("firstReservationId");
if (!first) {
  if (pm.response.code !== 201 || typeof body.reservationId !== "string") throw new Error("first attempt did not create the expected reservation");
  pm.variables.set("firstReservationId", body.reservationId);
} else {
  pm.test("retry returns the original reservation", () => pm.expect(body.reservationId).to.equal(first));
}
pm.test("outcome is a committed or replayed success", () => pm.expect([200, 201]).to.include(pm.response.code));
pm.variables.set("idempotencyKeyHash", CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex));` },
    { lang: "javascript", purpose: "Valida observer independente após quiescência e impede que responses iguais escondam efeitos duplicados.", code: `const evidence = pm.response.json();
pm.test("observer reports one durable reservation and event", () => {
  pm.expect(evidence.idempotencyKeyHash).to.equal(pm.variables.get("idempotencyKeyHash"));
  pm.expect(evidence.reservations).to.equal(1);
  pm.expect(evidence.confirmedQuantity).to.equal(1);
  pm.expect(evidence.outboxEvents).to.equal(1);
  pm.expect(evidence.providerEffects).to.equal(1);
  pm.expect(evidence.crossTenantRows).to.equal(0);
});
pm.test("observer reached terminal quiescence", () => { pm.expect(evidence.pendingJobs).to.equal(0); pm.expect(evidence.observedAt).to.be.a("string"); });
pm.variables.set("ownedResourceIds", JSON.stringify([evidence.reservationId]));` },
  ],
  "Examples como fixtures": [
    { lang: "json", purpose: "Salva response sintética de conflito com media type e Problem coerentes para docs, mock e validação.", code: `{
  "name": "sold-out",
  "originalRequest": {
    "method": "POST",
    "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Idempotency-Key", "value": "example-sold-out-001" }],
    "body": { "mode": "raw", "raw": "{\\\"showId\\\":\\\"show_sold_out\\\",\\\"quantity\\\":1}" },
    "url": "https://sandbox-api.example.invalid/reservations"
  },
  "status": "Conflict",
  "code": 409,
  "header": [{ "key": "Content-Type", "value": "application/problem+json" }, { "key": "X-Correlation-Id", "value": "corr_example_001" }],
  "body": "{\\\"type\\\":\\\"https://errors.example.invalid/sold-out\\\",\\\"title\\\":\\\"Sold out\\\",\\\"status\\\":409,\\\"code\\\":\\\"sold_out\\\",\\\"correlationId\\\":\\\"corr_example_001\\\"}",
  "_fixture": { "sourceContractDigest": "sha256:OPENAPI", "effect": { "databaseWrites": 0, "outboxEvents": 0 } }
}` },
    { lang: "bash", purpose: "Extrai, escaneia e valida cada example contra o bundle, falhando em segredo, PII ou status divergente.", code: `set -euo pipefail
./tools/postman-examples-extract --collection artifacts/quiron.postman_collection.json --output-dir build/examples --inventory build/examples.json
./tools/postman-examples-validate --inventory build/examples.json --openapi artifacts/quiron-openapi.json --strict --output reports/examples-validation.json
jq -e '.examples > 0 and .invalid == 0 and .ambiguousNames == 0 and .missingCriticalOutcomes == 0' reports/examples-validation.json >/dev/null
if rg -n -i 'bearer [A-Za-z0-9._-]{16,}|BEGIN (RSA |EC )?PRIVATE KEY|@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|internal\.corp' build/examples; then exit 1; fi
jq -e '.items | all(.status == .bodyStatus or .bodyStatus == null)' build/examples.json >/dev/null
sha256sum artifacts/quiron-openapi.json artifacts/quiron.postman_collection.json build/examples.json > evidence/examples.sha256` },
  ],
  "Mock matching": [
    { lang: "json", purpose: "Declara matriz determinística de seleção por método, path e nome de response sem usar credencial como discriminator.", code: `[
  { "caseId": "created", "method": "POST", "path": "/reservations", "headers": { "x-mock-response-name": "created-minimum", "content-type": "application/json" }, "expectedStatus": 201, "expectedExample": "created-minimum" },
  { "caseId": "sold-out", "method": "POST", "path": "/reservations", "headers": { "x-mock-response-name": "sold-out", "content-type": "application/json" }, "expectedStatus": 409, "expectedExample": "sold-out" },
  { "caseId": "invalid", "method": "POST", "path": "/reservations", "headers": { "x-mock-response-name": "validation-failed", "content-type": "application/json" }, "expectedStatus": 400, "expectedExample": "validation-failed" },
  { "caseId": "unknown-selector", "method": "POST", "path": "/reservations", "headers": { "x-mock-response-name": "does-not-exist" }, "expectedStatus": 404, "expectedExample": null }
]` },
    { lang: "javascript", purpose: "Confirma status e marcador do example escolhido e impede seletor de mock em requests para a API real.", code: `const target = new URL(pm.request.url.toString());
const selector = pm.request.headers.get("x-mock-response-name");
if (target.hostname === "sandbox-api.example.invalid" && selector) throw new Error("mock selector must never reach the real sandbox API");
const expectedStatus = Number(pm.iterationData.get("expectedStatus"));
pm.test("mock matching returns the expected status", () => pm.expect(pm.response.code).to.equal(expectedStatus));
const expectedExample = pm.iterationData.get("expectedExample");
if (expectedExample) pm.test("mock reports the selected fixture", () => pm.expect(pm.response.headers.get("X-Mock-Response-Name")).to.equal(expectedExample));
pm.test("mock response remains synthetic", () => pm.expect(pm.response.headers.get("X-Quiron-Environment")).to.equal("mock"));` },
  ],
  "Estado e comportamento dinâmico": [
    { lang: "json", purpose: "Explicita capability matrix para impedir que um resultado de mock seja contado como prova de estado ou autorização.", code: `{
  "executors": {
    "postman-mock": { "shape": true, "savedOutcomes": true, "state": false, "concurrency": false, "idempotency": false, "cryptographicAuth": false, "faultAfterCommit": false },
    "quiron-fake": { "shape": true, "savedOutcomes": true, "state": true, "concurrency": true, "idempotency": true, "cryptographicAuth": false, "faultAfterCommit": true },
    "quiron-sandbox": { "shape": true, "savedOutcomes": true, "state": true, "concurrency": true, "idempotency": true, "cryptographicAuth": true, "faultAfterCommit": true }
  },
  "rules": [
    { "claim": "response schema", "minimumExecutor": "postman-mock" },
    { "claim": "exactly-once effect", "minimumExecutor": "quiron-fake" },
    { "claim": "tenant isolation", "minimumExecutor": "quiron-sandbox" }
  ]
}` },
    { lang: "bash", purpose: "Executa o mesmo cenário em mock, fake e sandbox e exige classificação distinta da evidência.", code: `set -euo pipefail
for executor in postman-mock quiron-fake quiron-sandbox; do ./tools/postman-scenario-run --executor "$executor" --scenario fixtures/repeated-reservation.json --output "reports/$executor.json"; done
jq -e '.responses | length == 2 and all(.responses[]; .status == 201)' reports/postman-mock.json >/dev/null
jq -e '.businessEffects == 1 and .idempotencyRecords == 1' reports/quiron-fake.json >/dev/null
jq -e '.businessEffects == 1 and .outboxEvents == 1 and .providerEffects == 1 and .crossTenantRows == 0' reports/quiron-sandbox.json >/dev/null
./tools/evidence-classify --capabilities fixtures/executor-capabilities.json --reports reports/postman-mock.json,reports/quiron-fake.json,reports/quiron-sandbox.json --output reports/evidence-matrix.json
jq -e '.claims[] | select(.name == "tenant isolation") | .approvedBy == "quiron-sandbox"' reports/evidence-matrix.json >/dev/null` },
  ],
  "Privacidade, acesso e custo": [
    { lang: "json", purpose: "Define policy operacional de mock privado com owner, retenção, quota e lifecycle explícitos.", code: `{
  "mockId": "mock_fixture_quiron",
  "workspaceId": "workspace_fixture_private",
  "visibility": "private",
  "owner": "team-ticketing-platform",
  "collectionDigest": "sha256:COLLECTION",
  "dataClassification": "synthetic",
  "access": { "anonymous": false, "credentialSource": "runtime-secret-manager", "allowedConsumers": ["ci-contract-tests", "partner-onboarding-sandbox"] },
  "limits": { "requestsPerMinute": 60, "monthlyBudget": 10000, "maximumResponseBytes": 65536 },
  "logs": { "bodyRetention": "disabled", "metadataRetentionDays": 7, "redactHeaders": ["authorization", "cookie", "x-api-key"] },
  "lifecycle": { "expiresAt": "2026-10-24T00:00:00Z", "deletePreviewOnPipelineEnd": true },
  "egress": "deny"
}` },
    { lang: "bash", purpose: "Audita visibilidade e logs, injeta canary e confirma remoção do preview sem fallback público.", code: `set -euo pipefail
canary='postman-mock-secret-canary-20260924'
./tools/postman-mock-policy --manifest mocks/quiron-private.json --require-private --require-owner --output reports/mock-policy.json
jq -e '.violations == 0' reports/mock-policy.json >/dev/null
curl -sS -o reports/anonymous.json -w '%{http_code}' "$MOCK_URL/reservations" > reports/anonymous.status
test "$(cat reports/anonymous.status)" = 401
curl -fsS -H "X-Api-Key: $MOCK_API_KEY" -H "X-Canary: $canary" "$MOCK_URL/reservations" -o reports/authorized.json
./tools/postman-mock-audit --mock-id mock_fixture_quiron --since fixture-start --output reports/mock-audit.json
! rg -n "$canary|$MOCK_API_KEY|authorization|cookie" reports/mock-audit.json reports/authorized.json
./tools/postman-mock-delete --mock-id mock_fixture_quiron --require-owner team-ticketing-platform
./tools/postman-mock-get --mock-id mock_fixture_quiron --expect-missing` },
  ],
  "Chaining e setNextRequest": [
    { lang: "javascript", purpose: "Executa uma máquina de estados limitada, valida cada transição e encerra explicitamente sem aceitar alvo vindo da resposta.", code: `const model = {
  START: { ok: "Create reservation", invalid: "Teardown" },
  CREATED: { ok: "Read reservation", conflict: "Reconcile reservation" },
  OBSERVED: { ok: "Teardown" },
  FAILED: { ok: "Teardown" },
  DONE: {}
};
const current = pm.variables.get("workflowState") || "START";
const outcome = pm.response.code >= 200 && pm.response.code < 300 ? "ok" : pm.response.code === 409 ? "conflict" : "invalid";
const steps = Number(pm.variables.get("workflowSteps") || 0) + 1;
if (!Number.isInteger(steps) || steps > 8) throw new Error("workflow step limit exceeded");
const next = model[current]?.[outcome];
if (!next) throw new Error(\`invalid transition \${current}:\${outcome}\`);
pm.variables.set("workflowSteps", String(steps));
pm.variables.set("workflowState", next === "Teardown" ? "DONE" : outcome === "ok" ? "CREATED" : "FAILED");
pm.execution.setNextRequest(next);` },
    { lang: "json", purpose: "Mantém o grafo de execução revisável e independente da ordem visual da collection.", code: `{
  "workflow": "reservation-happy-and-conflict",
  "version": 3,
  "entry": "Preflight",
  "terminal": "Teardown",
  "maximumSteps": 8,
  "uniqueTargets": true,
  "states": {
    "Preflight": { "ok": "Create reservation", "failure": "Teardown" },
    "Create reservation": { "created": "Read reservation", "conflict": "Reconcile reservation", "failure": "Teardown" },
    "Read reservation": { "observed": "Teardown", "failure": "Teardown" },
    "Reconcile reservation": { "sameEffect": "Teardown", "failure": "Teardown" },
    "Teardown": {}
  }
}` },
  ],
  "Retry, polling e backoff": [
    { lang: "javascript", purpose: "Decide polling e retry por orçamento e deadline, reutilizando a chave idempotente e recusando espera infinita.", code: `const attempt = Number(pm.variables.get("pollAttempt") || 0) + 1;
const deadline = Number(pm.variables.get("pollDeadlineEpochMs"));
const idempotencyKey = pm.variables.get("idempotencyKey");
if (!idempotencyKey || !/^idem_[A-Za-z0-9_-]{16,64}$/.test(idempotencyKey)) throw new Error("missing stable idempotency key");
if (!Number.isFinite(deadline) || Date.now() >= deadline || attempt > 6) {
  pm.variables.set("pollOutcome", "exhausted");
  pm.execution.setNextRequest("Reconcile reservation");
} else {
  const body = pm.response.json();
  const allowed = new Set(["pending", "running", "confirmed", "rejected"]);
  if (!allowed.has(body.state)) throw new Error("unknown job state");
  pm.variables.set("pollAttempt", String(attempt));
  if (body.state === "pending" || body.state === "running") pm.execution.setNextRequest("Poll reservation job");
  else pm.execution.setNextRequest("Observe reservation effect");
}` },
    { lang: "bash", purpose: "Injeta timeout depois do commit e exige uma única linha, evento e efeito externo apesar da repetição da entrega.", code: `set -euo pipefail
run_id="retry-after-commit-fixture"
idem_key="idem_retry_after_commit_0001"
./tools/fault-injector arm --run-id "$run_id" --point after-database-commit --mode drop-response
./tools/postman-run --folder "Retry after commit" --env fixtures/sandbox.json --var "runId=$run_id" --var "idempotencyKey=$idem_key" --report reports/retry.json
jq -e '.attempts == 2 and .finalStatus == 201 and .sameIdempotencyKey == true' reports/retry.json >/dev/null
./tools/effect-observer --run-id "$run_id" --output reports/retry-effects.json
jq -e '.businessRows == 1 and .outboxEvents == 1 and .providerEffects == 1' reports/retry-effects.json >/dev/null` },
  ],
  "Tokens e dados entre etapas": [
    { lang: "javascript", purpose: "Extrai Location e ID somente após validar resposta, mesma origem e concordância, eliminando qualquer valor antigo.", code: `pm.variables.unset("reservationId");
pm.variables.unset("reservationLocation");
pm.test("creation response is valid", () => pm.expect(pm.response.code).to.equal(201));
if (!/^application\\/json(?:;|$)/i.test(pm.response.headers.get("Content-Type") || "")) throw new Error("unexpected media type");
const body = pm.response.json();
if (!body || !/^res_[A-Za-z0-9_-]{8,64}$/.test(body.id || "")) throw new Error("invalid reservation id");
const location = new URL(pm.response.headers.get("Location") || "", pm.environment.get("baseUrl"));
const base = new URL(pm.environment.get("baseUrl"));
if (location.origin !== base.origin) throw new Error("cross-origin Location rejected");
if (decodeURIComponent(location.pathname.split("/").pop()) !== body.id) throw new Error("Location/body conflict");
pm.variables.set("reservationId", body.id);
pm.variables.set("reservationLocation", location.pathname);` },
    { lang: "javascript", purpose: "Impede persistência e vazamento de tokens, valida metadados mínimos e agenda limpeza local ao final.", code: `const payload = pm.response.json();
const forbidden = ["access_token", "refresh_token", "client_secret"];
for (const name of forbidden) {
  if (pm.environment.has(name) || pm.collectionVariables.has(name)) throw new Error(\`secret persisted in shared scope: \${name}\`);
}
if (typeof payload.access_token !== "string" || payload.access_token.length < 24) throw new Error("invalid access token");
if (payload.token_type !== "Bearer" || !Number.isInteger(payload.expires_in) || payload.expires_in <= 0 || payload.expires_in > 3600) throw new Error("invalid token metadata");
pm.variables.set("accessToken", payload.access_token);
pm.test("token is confined to local scope", () => {
  pm.expect(pm.environment.get("access_token")).to.equal(undefined);
  pm.expect(pm.collectionVariables.get("access_token")).to.equal(undefined);
});` },
  ],
  "Setup, teardown e recovery": [
    { lang: "bash", purpose: "Garante captura de evidência e teardown em trap, preservando separadamente a falha principal e a falha de limpeza.", code: `set -euo pipefail
run_id="quiron-$(date -u +%Y%m%dT%H%M%SZ)-$$"
evidence_dir="evidence/$run_id"
mkdir -p "$evidence_dir"
runner_status=0
cleanup_status=0
cleanup() {
  ./tools/postman-evidence --run-id "$run_id" --output "$evidence_dir" || true
  ./tools/fixture-cleanup --run-id "$run_id" --environment sandbox --maximum-delete 12 --require-owner team-ticketing || cleanup_status=$?
  jq -n --arg runId "$run_id" --argjson runner "$runner_status" --argjson cleanup "$cleanup_status" '{runId:$runId,runnerStatus:$runner,cleanupStatus:$cleanup}' > "$evidence_dir/final-status.json"
}
trap cleanup EXIT INT TERM
./tools/fixture-setup --run-id "$run_id" --environment sandbox --output "$evidence_dir/setup.json"
./tools/postman-run --folder "Reservation journey" --var "runId=$run_id" --report "$evidence_dir/run.json" || runner_status=$?
exit "$runner_status"` },
    { lang: "json", purpose: "Limita o plano de recovery aos recursos pertencentes à execução e registra política de TTL, lote e evidência.", code: `{
  "runId": "quiron-20260924T223500Z-1420",
  "environment": "sandbox",
  "owner": "team-ticketing",
  "activeLease": false,
  "createdAt": "2026-09-24T22:35:00Z",
  "expiresAt": "2026-09-25T00:35:00Z",
  "maximumDelete": 12,
  "resources": [
    { "kind": "reservation", "id": "res_fixture_a1b2c3d4", "ownerTag": "quiron-20260924T223500Z-1420" },
    { "kind": "event", "id": "evt_fixture_a1b2c3d4", "ownerTag": "quiron-20260924T223500Z-1420" }
  ],
  "guards": { "requireSandboxMarker": true, "requireExactOwnerTag": true, "allowWildcard": false, "dryRunFirst": true },
  "evidence": { "captureBeforeDelete": true, "manifestDigest": "sha256:MANIFEST", "redactSecrets": true }
}` },
  ],

  "Workspaces, forks e pull changes": [
    { lang: "json", purpose: "Registra ancestry, digests, ownership e expiração do fork para impedir merge de cópia ambígua.", code: `{
  "workspaceId": "ws_quiron_sandbox",
  "collectionId": "col_quiron_api",
  "fork": { "id": "fork_retry_policy", "upstreamId": "col_quiron_api", "baseDigest": "sha256:BASE", "headDigest": "sha256:HEAD", "owner": "team-api-quality", "expiresAt": "2026-10-25T00:00:00Z" },
  "pullChange": { "risk": "high", "changedCapabilities": ["pre-request-script", "authorization"], "requiredReviewers": 2, "approvedHeadDigest": "sha256:HEAD" },
  "guards": { "uniqueNames": true, "secretScan": true, "invalidateApprovalOnHeadChange": true }
}` },
    { lang: "bash", purpose: "Compara export base, fork e upstream atualizado e bloqueia segredo, alvo inseguro ou aprovação de digest antigo.", code: `set -euo pipefail
./tools/postman-export-normalize base.json --output build/base.json
./tools/postman-export-normalize fork.json --output build/fork.json
./tools/postman-export-normalize upstream.json --output build/upstream.json
./tools/postman-semantic-merge --base build/base.json --head build/fork.json --upstream build/upstream.json --output build/candidate.json --report reports/pull-change.json
jq -e '.conflicts == 0 and .headDigest == .approvedHeadDigest and .criticalChangesReviewed == true' reports/pull-change.json >/dev/null
! rg -n -i 'bearer [A-Za-z0-9._-]{16,}|api[_-]?key.*[=:].{16,}|internal\.corp' build/candidate.json` },
  ],
  "API Builder e specifications": [
    { lang: "json", purpose: "Liga fonte, versão API, collection derivada e overlay por digests verificáveis.", code: `{
  "sourceOfTruth": { "kind": "git", "repository": "quiron-api", "commit": "0123456789abcdef", "path": "openapi/quiron.json", "digest": "sha256:SPEC" },
  "postmanApi": { "id": "api_quiron", "versionId": "api_version_v2", "schemaId": "schema_openapi_v2" },
  "derivedCollection": { "id": "col_quiron_v2", "digest": "sha256:COLLECTION", "generator": "postman-cli-pinned", "overlayDigest": "sha256:OVERLAY" },
  "relations": [{ "kind": "contract-test", "artifactId": "col_quiron_v2", "apiVersionId": "api_version_v2" }],
  "policy": { "allowUiWrite": false, "requireReadAfterWrite": true, "blockUnresolvedDrift": true }
}` },
    { lang: "bash", purpose: "Gera, aplica overlay, mede compatibilidade e confirma que a collection corresponde à mesma revisão.", code: `set -euo pipefail
./tools/openapi-validate openapi/quiron.json --strict --report reports/openapi.json
./tools/postman-generate --openapi openapi/quiron.json --generator-version pinned --output build/generated.json
./tools/postman-overlay apply --collection build/generated.json --overlay postman/operational-overlay.json --output build/candidate.json
./tools/api-semantic-diff --base artifacts/released-openapi.json --head openapi/quiron.json --output reports/compatibility.json
jq -e '.breaking == 0 and .unclassified == 0' reports/compatibility.json >/dev/null
./tools/postman-traceability --openapi openapi/quiron.json --collection build/candidate.json --require-operation-id --require-negative-critical --output reports/traceability.json
jq -e '.missingOperations == 0 and .ambiguousRelations == 0' reports/traceability.json >/dev/null` },
  ],
  "Roles, review e ownership": [
    { lang: "json", purpose: "Declara capacidades mínimas, owners e separação entre autoria, revisão, publicação e execução.", code: `{
  "resources": [{ "id": "col_quiron_api", "owner": "team-api-quality", "backupOwner": "team-ticketing-platform", "classification": "internal" }],
  "bindings": [
    { "subject": "group:developers", "role": "contributor", "allow": ["read", "fork", "propose"], "deny": ["publish", "manage-members", "read-secrets"] },
    { "subject": "group:maintainers", "role": "reviewer", "allow": ["read", "review"], "deny": ["self-approve-critical"] },
    { "subject": "workload:ci-sandbox", "role": "runner", "allow": ["read-approved", "run-sandbox"], "deny": ["edit", "publish", "manage-members"] }
  ],
  "breakGlass": { "enabled": true, "maximumMinutes": 30, "requireAudit": true, "requireRetrospective": true }
}` },
    { lang: "javascript", purpose: "Avalia testes positivos e negativos de capability sem registrar credenciais ou payloads.", code: `const matrix = pm.iterationData.get("capabilityCases");
if (!Array.isArray(matrix) || matrix.length === 0) throw new Error("capability cases missing");
const actualStatus = pm.response.code;
const current = matrix.find((entry) => entry.caseId === pm.variables.get("caseId"));
if (!current || ![200, 201, 204, 401, 403].includes(current.expectedStatus)) throw new Error("invalid capability case");
pm.test("effective permission matches policy", () => pm.expect(actualStatus).to.equal(current.expectedStatus));
if (current.expectedStatus === 401 || current.expectedStatus === 403) {
  pm.test("denied action has no effect", () => pm.expect(pm.response.headers.get("X-Effect-Count")).to.equal("0"));
}` },
  ],
  "Governance e change detection": [
    { lang: "json", purpose: "Versiona ruleset, severidades e exceção estreita com owner, compensação e expiração.", code: `{
  "rulesetVersion": "3.4.0",
  "rulesetDigest": "sha256:RULESET",
  "rules": [
    { "id": "security-required", "severity": "error", "scope": "all-operations" },
    { "id": "server-allowlist", "severity": "error", "allowedOrigins": ["https://sandbox-api.example.invalid"] },
    { "id": "problem-details", "severity": "warning", "scope": "4xx-5xx" }
  ],
  "exceptions": [{ "ruleId": "problem-details", "resource": "GET /legacy-status", "owner": "team-legacy", "approver": "api-governance", "compensation": "adapter contract test", "expiresAt": "2026-10-10T00:00:00Z" }],
  "failOpen": false
}` },
    { lang: "bash", purpose: "Executa governance e diff em camadas, recusa exceção vencida e confirma o digest após sincronização.", code: `set -euo pipefail
./tools/api-governance --rules rules/postman-governance.json --openapi openapi/quiron.json --collection artifacts/quiron.postman_collection.json --environment artifacts/sandbox.postman_environment.json --output reports/governance.json
jq -e '.errors == 0 and .expiredExceptions == 0 and .engineFailures == 0' reports/governance.json >/dev/null
./tools/api-change-detect --base manifests/released.json --head manifests/candidate.json --layers spec,collection,environment,relations --output reports/change.json
jq -e '.unclassified == 0 and .criticalUnreviewed == 0 and .secretFindings == 0' reports/change.json >/dev/null
./tools/postman-cloud-reconcile --desired manifests/candidate.json --read-only --output reports/cloud-drift.json
jq -e '.unexpectedDrift == 0 and .observedDigest == .desiredDigest' reports/cloud-drift.json >/dev/null` },
  ],
  "Monitor runtime e regiões": [
    { lang: "json", purpose: "Fixa runtime, regiões, agenda, digests e orçamento do experimento sintético.", code: `{
  "monitorId": "mon_quiron_availability",
  "collection": { "id": "col_quiron_api", "digest": "sha256:COLLECTION" },
  "environment": { "id": "env_quiron_synthetic", "redactedDigest": "sha256:ENVIRONMENT" },
  "runtime": { "name": "postman-cloud", "version": "pinned-supported" },
  "regions": ["us-east-authorized", "eu-west-authorized"],
  "schedule": { "frequencyMinutes": 10, "maximumRunSeconds": 90, "preventOverlap": true },
  "budget": { "requestsPerRun": 8, "maximumMonthlyRequests": 70000 },
  "owner": "team-ticketing-sre",
  "claims": ["public-reachability", "reservation-read-journey"]
}` },
    { lang: "javascript", purpose: "Classifica região e timing sem confundir reachability, contrato e regra de negócio.", code: `const allowedRegions = new Set(["us-east-authorized", "eu-west-authorized"]);
const region = pm.variables.get("monitorRegion");
if (!allowedRegions.has(region)) throw new Error("unapproved monitor region");
pm.test("response contract is reachable", () => {
  pm.expect(pm.response.code).to.be.oneOf([200, 401, 403, 429, 503]);
  pm.expect(pm.response.responseTime).to.be.below(5000);
});
const classification = pm.response.code === 429 ? "synthetic-quota" : pm.response.code >= 500 ? "product-or-dependency" : pm.response.code >= 400 ? "auth-or-policy" : "success";
pm.variables.set("safeClassification", classification);` },
  ],
  "Environment e secrets em monitors": [
    { lang: "json", purpose: "Define somente configuração pública e referências de segredo, sem valores compartilhados.", code: `{
  "environmentId": "env_quiron_synthetic",
  "variables": {
    "baseUrl": { "type": "public", "value": "https://sandbox-api.example.invalid", "allowedOrigins": ["https://sandbox-api.example.invalid"] },
    "syntheticTenant": { "type": "public", "value": "tenant_synthetic_quiron" },
    "clientCredential": { "type": "secret-reference", "reference": "vault://postman/quiron-monitor-client", "value": null }
  },
  "rejectUnknownVariables": true,
  "forbidCurrentValueDependency": true,
  "rotationOwner": "team-ticketing-sre"
}` },
    { lang: "javascript", purpose: "Falha antes do envio quando destino ou identidade sintética não correspondem ao manifest.", code: `const baseUrl = pm.environment.get("baseUrl");
const tenant = pm.environment.get("syntheticTenant");
const token = pm.variables.get("accessToken");
if (baseUrl !== "https://sandbox-api.example.invalid") throw new Error("unsafe monitor origin");
if (tenant !== "tenant_synthetic_quiron") throw new Error("non-synthetic tenant rejected");
if (typeof token !== "string" || token.length < 24) throw new Error("missing runtime secret");
for (const name of ["accessToken", "clientSecret", "refreshToken"]) {
  if (pm.environment.has(name) || pm.collectionVariables.has(name)) throw new Error("secret persisted in shared scope");
}` },
  ],
  "Alertas, logs e métricas": [
    { lang: "json", purpose: "Modela evento redigido, fingerprint estável, rota e retenção sem corpo de request.", code: `{
  "eventVersion": 2,
  "monitorId": "mon_quiron_availability",
  "runId": "run_fixture_20260925_001",
  "classification": "contract-failure",
  "severity": "high",
  "region": "us-east-authorized",
  "operation": "GET /reservations/{id}",
  "artifactDigest": "sha256:COLLECTION",
  "fingerprint": "mon_quiron_availability|contract-failure|read-reservation|us-east-authorized",
  "routing": { "owner": "team-ticketing-sre", "runbook": "runbooks/postman-monitor.md", "dedupMinutes": 15 },
  "redaction": { "requestBody": "omitted", "authorization": "omitted", "retentionDays": 14 }
}` },
    { lang: "bash", purpose: "Injeta canary e valida deduplicação, rota, recovery e ausência de segredo nos artifacts.", code: `set -euo pipefail
canary="monitor-secret-canary-20260925"
./tools/monitor-alert-simulate --fixtures fixtures/monitor-failures.json --secret-canary "$canary" --output reports/alerts.json
jq -e '.events > 1 and .incidents == 1 and .duplicateNotifications == 0 and .recoveryNotifications == 1' reports/alerts.json >/dev/null
jq -e '.routes | all(.owner != null and .runbook != null)' reports/alerts.json >/dev/null
if rg -n "$canary|authorization|cookie|requestBody" reports/alerts.json; then exit 1; fi
./tools/monitor-slo-reconcile --runs fixtures/monitor-runs.json --alerts reports/alerts.json --output reports/monitor-slo.json
jq -e '.unclassified == 0 and .invalidSyntheticRuns >= 0 and .denominatorReconciled == true' reports/monitor-slo.json >/dev/null` },
  ],
  "Synthetic design seguro": [
    { lang: "json", purpose: "Classifica operações, limita efeitos e exige identidade, cleanup e observer independentes.", code: `{
  "journey": "quiron-safe-synthetic-reservation",
  "tenant": "tenant_synthetic_quiron",
  "principal": "workload_quiron_monitor",
  "allowedOrigin": "https://sandbox-api.example.invalid",
  "operations": [
    { "name": "read-capacity", "class": "read-only", "maximumEffects": 0 },
    { "name": "create-fixture-reservation", "class": "reversible", "idempotencyRequired": true, "maximumEffects": 1 },
    { "name": "delete-owned-fixture", "class": "cleanup", "requireOwnerTag": true, "maximumDelete": 1 }
  ],
  "forbidden": ["payment", "email", "sms", "production-inventory"],
  "killSwitch": true,
  "observer": ["business-row", "outbox", "provider-fake"],
  "maximumRunSeconds": 90
}` },
    { lang: "bash", purpose: "Exercita timeout após commit, overlap e cleanup e exige um efeito sintético e nenhum resíduo.", code: `set -euo pipefail
run_id="synthetic-safe-fixture-001"
./tools/synthetic-preflight --origin https://sandbox-api.example.invalid --tenant tenant_synthetic_quiron --require-kill-switch --output reports/preflight.json
jq -e '.safe == true and .principalSynthetic == true' reports/preflight.json >/dev/null
./tools/fault-injector arm --run-id "$run_id" --point after-database-commit --mode drop-response
./tools/postman-run --folder "Safe synthetic reservation" --var "runId=$run_id" --parallel 2 --report reports/synthetic.json
./tools/effect-observer --run-id "$run_id" --output reports/synthetic-effects.json
jq -e '.businessRows == 1 and .outboxEvents == 1 and .realProviderEffects == 0 and .crossTenantRows == 0' reports/synthetic-effects.json >/dev/null
./tools/fixture-cleanup --run-id "$run_id" --environment sandbox --maximum-delete 1 --require-owner team-ticketing-sre
./tools/effect-observer --run-id "$run_id" --expect-residual 0` },
  ],
  "Vault, secret scanning e rotação": [
    { lang: "json", purpose: "Inventaria referências e consumidores sem valores secretos.", code: `{ "secrets": [{ "reference": "vault://postman/quiron-monitor-client", "kind": "oauth-client-secret", "owner": "team-security", "consumers": ["monitor:quiron", "workload:ci"], "value": null }], "policy": { "forbidExportedValues": true, "requireOldCredentialDenied": true } }` },
    { lang: "bash", purpose: "Escaneia artifacts, testa plano de rotação e bloqueia credencial antiga.", code: `set -euo pipefail
./tools/secret-scan --paths artifacts,reports,backups --include-history --output reports/secrets.json
jq -e '.confirmed == 0 and .scannerErrors == 0 and .expiredSuppressions == 0' reports/secrets.json >/dev/null
./tools/secret-rotate --reference vault://postman/quiron-monitor-client --dry-run --output reports/rotation.json
jq -e '.consumersReconciled and .newCredentialCanary and .oldCredentialDenied' reports/rotation.json >/dev/null` },
  ],
  "OAuth, tokens e sessões": [
    { lang: "json", purpose: "Fixa issuer, audience, PKCE, scopes e lifecycle mínimo.", code: `{ "issuer": "https://identity.sandbox.example.invalid", "authorizationEndpoint": "/oauth2/authorize", "tokenEndpoint": "/oauth2/token", "clientType": "public", "grant": "authorization_code", "pkce": "S256", "redirectUris": ["https://oauth.pstmn.io/v1/callback"], "audience": "quiron-sandbox-api", "scopes": ["reservations:read"], "persistTokens": false }` },
    { lang: "javascript", purpose: "Confirma negações de audience, expiry e scope sem persistir token.", code: `const expected = Number(pm.iterationData.get("expectedStatus"));
pm.test("OAuth case has expected result", () => pm.expect(pm.response.code).to.equal(expected));
for (const name of ["accessToken", "refreshToken", "clientSecret"]) {
  if (pm.environment.has(name) || pm.collectionVariables.has(name)) throw new Error("token persisted in shared scope");
}
if (expected === 401 || expected === 403) pm.test("denial has zero effect", () => pm.expect(pm.response.headers.get("X-Effect-Count")).to.equal("0"));` },
  ],
  "Scripts, packages e exfiltração": [
    { lang: "json", purpose: "Declara packages pinados e capabilities sensíveis de cada script.", code: `{ "scripts": [{ "id": "collection-pre-request", "digest": "sha256:SCRIPT", "capabilities": ["read:local-variable", "write:request-header"], "networkAllowlist": [] }], "packages": [{ "name": "approved-helper", "version": "2.1.4", "digest": "sha256:PACKAGE", "license": "MIT" }], "forbidden": ["floating-version", "dynamic-host", "environment-dump", "eval"] }` },
    { lang: "bash", purpose: "Analisa scripts e SBOM e falha diante de egress ou secret read não autorizado.", code: `set -euo pipefail
./tools/postman-script-audit --collection artifacts/quiron.postman_collection.json --policy rules/sandbox.json --output reports/scripts.json
jq -e '.unowned == 0 and .dynamicEgress == 0 and .secretReadsUnapproved == 0 and .evalUses == 0' reports/scripts.json >/dev/null
./tools/postman-package-verify --sbom artifacts/postman-sbom.json --require-digests --deny-floating --output reports/packages.json
jq -e '.invalid == 0 and .unreviewedUpdates == 0' reports/packages.json >/dev/null` },
  ],
  "Redaction, backup e incidentes": [
    { lang: "json", purpose: "Define conteúdo permitido, retenção e restore seguro com integrações desligadas.", code: `{ "artifact": "postman-incident-bundle", "allow": ["manifest", "digests", "timings", "assertionNames", "safeCorrelation"], "omit": ["authorization", "cookie", "requestBody", "responseBody", "environmentValues"], "retentionDays": 30, "restore": { "isolated": true, "injectCurrentSecrets": true, "enableMonitors": false, "enableWebhooks": false, "requireScan": true } }` },
    { lang: "bash", purpose: "Varre bundle, valida restore isolado e impede reintrodução de digest ou token revogados.", code: `set -euo pipefail
./tools/evidence-redact --input raw-evidence --policy rules/redaction.json --output build/incident-bundle
./tools/secret-scan --paths build/incident-bundle --output reports/bundle-scan.json
jq -e '.confirmed == 0 and .piiFindings == 0' reports/bundle-scan.json >/dev/null
./tools/postman-restore-check --backup backups/postman-redacted.json --isolated --disable-integrations --deny-revoked manifests/revoked.json --output reports/restore.json
jq -e '.safe and .monitorsEnabled == false and .webhooksEnabled == false and .revokedArtifacts == 0' reports/restore.json >/dev/null` },
  ],
  "Newman em pipelines": [
    { lang: "json", purpose: "Fixa toolchain, entradas, opções e reports por digest.", code: `{ "runtime": { "node": "pinned", "newman": "pinned", "lockDigest": "sha256:LOCK" }, "inputs": { "collection": "sha256:COLLECTION", "environment": "sha256:ENV", "data": "sha256:DATA" }, "options": { "bail": true, "timeoutRequestMs": 5000, "requireTests": true }, "reports": ["junit", "json"], "forbidSuppressExitCode": true }` },
    { lang: "javascript", purpose: "Reconcilia stats e impede pipeline verde sem testes ou com falha oculta.", code: `const summary = JSON.parse(pm.variables.get("newmanSummaryFixture"));
if (!summary || summary.processExitCode !== 0) throw new Error("runner process failed");
if (!Number.isInteger(summary.tests) || summary.tests <= 0) throw new Error("zero tests executed");
if (summary.failures !== 0 || summary.reportComplete !== true) throw new Error("failures or incomplete report");
if (summary.collectionDigest !== "sha256:COLLECTION") throw new Error("wrong collection executed");` },
  ],
  "Postman CLI e sincronização": [
    { lang: "json", purpose: "Declara source of truth, IDs, preconditions e leitura posterior.", code: `{ "sourceOfTruth": "git", "workspaceId": "ws_quiron_sandbox", "collectionId": "col_quiron_api", "approvedDigest": "sha256:COLLECTION", "baseRevision": "rev_42", "identity": "workload:postman-sync", "allowPersonalKey": false, "requirePrecondition": true, "requireReadAfterWrite": true }` },
    { lang: "javascript", purpose: "Recusa seleção por nome, revisão divergente e artifact distinto do aprovado.", code: `const desired = JSON.parse(pm.variables.get("syncManifestFixture"));
const observed = pm.response.json();
if (!desired.collectionId || desired.selection === "name") throw new Error("immutable collection ID required");
if (observed.baseRevision !== desired.baseRevision) throw new Error("concurrent cloud update");
if (observed.digest !== desired.approvedDigest) throw new Error("cloud drift detected");
pm.test("read after write matches approved artifact", () => pm.expect(observed.digest).to.equal("sha256:COLLECTION"));` },
  ],
  "Integrações e webhooks": [
    { lang: "json", purpose: "Define envelope mínimo, assinatura, replay e retenção.", code: `{ "eventVersion": 2, "deliveryId": "delivery_fixture_001", "eventType": "collection.release.approved", "artifactId": "col_quiron_api", "artifactDigest": "sha256:COLLECTION", "occurredAt": "2026-09-26T00:00:00Z", "signature": { "algorithm": "hmac-sha256", "timestampToleranceSeconds": 300 }, "privacy": { "includeBodies": false, "retentionDays": 14 } }` },
    { lang: "javascript", purpose: "Valida resultado idempotente de delivery repetido e ausência de payload sensível.", code: `const result = pm.response.json();
pm.test("duplicate delivery creates one effect", () => {
  pm.expect(result.deliveries).to.equal(2);
  pm.expect(result.accepted).to.equal(1);
  pm.expect(result.effects).to.equal(1);
});
for (const forbidden of ["authorization", "cookie", "requestBody", "environmentValues"]) {
  if (Object.prototype.hasOwnProperty.call(result, forbidden)) throw new Error("sensitive webhook field");
}` },
  ],
  "Artifact, release e rollback": [
    { lang: "json", purpose: "Manifesta bundle imutável e liga aprovação ao digest.", code: `{ "release": "postman-quiron-1.0.0", "sourceCommit": "0123456789abcdef", "manifestDigest": "sha256:MANIFEST", "artifacts": [{ "path": "quiron.postman_collection.json", "digest": "sha256:COLLECTION" }, { "path": "sandbox.postman_environment.json", "digest": "sha256:ENV" }, { "path": "openapi.json", "digest": "sha256:OPENAPI" }], "approval": { "approvedManifestDigest": "sha256:MANIFEST", "reviewers": 2 }, "secretsIncluded": false }` },
    { lang: "javascript", purpose: "Confirma binding da aprovação, leitura posterior e rollback sem artifact revogado.", code: `const release = JSON.parse(pm.variables.get("releaseManifestFixture"));
const result = pm.response.json();
if (release.manifestDigest !== release.approval.approvedManifestDigest) throw new Error("approval digest mismatch");
if (release.secretsIncluded !== false) throw new Error("secret in release bundle");
if (result.observedDigest !== release.manifestDigest || result.readAfterWrite !== true) throw new Error("promotion not reconciled");
if (result.revokedArtifacts > 0 || result.revokedSecretsRestored > 0) throw new Error("unsafe rollback");` },
  ],
  "Baseline da collection Quíron": [
    { lang: "json", purpose: "Liga todos os artifacts da baseline a digests e claims explícitas.", code: `{ "sourceCommit": "0123456789abcdef", "specDigest": "sha256:OPENAPI", "collectionDigest": "sha256:COLLECTION", "overlayDigest": "sha256:OVERLAY", "environmentDigest": "sha256:ENV", "dataDigest": "sha256:DATA", "requiredFolders": ["Preflight", "Auth", "Reservations", "Negative", "Observer", "Teardown"], "secretsIncluded": false }` },
    { lang: "javascript", purpose: "Valida preflight e recusa qualquer destino fora do sandbox Quíron.", code: `const base = new URL(pm.environment.get("baseUrl"));
if (base.origin !== "https://sandbox-api.example.invalid") throw new Error("unsafe Quiron origin");
if (pm.environment.get("tenant") !== "tenant_synthetic_quiron") throw new Error("unsafe tenant");
if (pm.variables.get("collectionDigest") !== "sha256:COLLECTION") throw new Error("collection drift");
for (const name of ["accessToken", "clientSecret"]) if (pm.environment.has(name) || pm.collectionVariables.has(name)) throw new Error("persisted secret");` },
  ],
  "Última vaga no runner": [
    { lang: "json", purpose: "Define barrier, workers, outcomes e cardinalidade independente para a última vaga.", code: `{ "runId": "last-seat-fixture-001", "capacity": 1, "barrier": { "expectedArrivals": 2, "maximumWaitMs": 5000 }, "workers": [{ "id": "buyer-a", "idempotencyKey": "idem_last_seat_a_001" }, { "id": "buyer-b", "idempotencyKey": "idem_last_seat_b_001" }], "expected": { "created": 1, "conflict": 1, "businessRows": 1, "outboxEvents": 1, "providerEffects": 1 } }` },
    { lang: "javascript", purpose: "Reconcilia arrivals, outcomes e efeitos sem aceitar execução sequencial como concorrência.", code: `const result = pm.response.json();
if (result.barrierArrivals !== 2 || result.overlapObserved !== true) throw new Error("concurrency was not established");
pm.test("one winner and one loser", () => { pm.expect(result.created).to.equal(1); pm.expect(result.conflict).to.equal(1); });
pm.test("one effect", () => { pm.expect(result.businessRows).to.equal(1); pm.expect(result.outboxEvents).to.equal(1); pm.expect(result.providerEffects).to.equal(1); });` },
  ],
  "Pipeline, monitor e release": [
    { lang: "json", purpose: "Mantém um digest da candidata até collection, mock, docs e monitor.", code: `{ "release": "postman-quiron-1.0.0", "manifestDigest": "sha256:MANIFEST", "sourceCommit": "0123456789abcdef", "gates": ["parse", "secret-scan", "governance", "contracts", "negative-effects"], "targets": { "collectionId": "col_quiron_api", "mockId": "mock_quiron_private", "monitorId": "mon_quiron_canary" }, "requireReadAfterWrite": true, "allowLatest": false }` },
    { lang: "javascript", purpose: "Confirma que todas as superfícies observadas apontam o manifest aprovado.", code: `const expected = "sha256:MANIFEST";
const observed = pm.response.json();
for (const surface of ["collection", "documentation", "mock", "monitor"]) {
  if (observed[surface]?.manifestDigest !== expected) throw new Error("release drift on " + surface);
}
if (observed.mock.visibility !== "private" || observed.monitor.syntheticTenant !== true) throw new Error("unsafe release surface");
pm.test("release is reconciled", () => pm.expect(observed.readAfterWrite).to.equal(true));` },
  ],
  "Banca, incidente e restore Postman": [
    { lang: "json", purpose: "Define injeções inertes, safety rails, rubrica e evidências obrigatórias.", code: `{ "exerciseId": "postman-incident-board-001", "sandboxOnly": true, "killSwitch": true, "injections": ["token-canary-in-history", "fork-script-drift", "cloud-digest-drift", "disabled-lookalike-monitor"], "criticalFailures": ["production-touch", "secret-in-report", "evidence-deletion", "revoked-secret-restore", "state-claim-without-observer"], "requiredEvidence": ["timeline", "inventory", "revocation-receipt", "restore-manifest", "observer", "cleanup"] }` },
    { lang: "javascript", purpose: "Audita o resultado final da banca e mantém claims sem gate como Pending.", code: `const board = pm.response.json();
if (board.criticalFailures !== 0 || board.missingEvidence !== 0) throw new Error("board failed");
if (board.realWorldEffects !== 0 || board.residualFixtures !== 0) throw new Error("unsafe exercise outcome");
if (!Array.isArray(board.claims) || board.claims.some((claim) => !["approved", "pending"].includes(claim.status))) throw new Error("dishonest claim status");
pm.test("incident restore is safe", () => pm.expect(board.revokedSecretsRestored).to.equal(0));` },
  ],
};
