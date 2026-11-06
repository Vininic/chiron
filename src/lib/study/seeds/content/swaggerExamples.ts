export type SwaggerExample = { lang: "yaml" | "json" | "bash" | "typescript"; purpose: string; code: string };

export const SWAGGER_EXAMPLES: Record<string, SwaggerExample[]> = {
  "Swagger, OpenAPI e fronteiras": [
    { lang: "yaml", purpose: "Declara uma operação mínima com idempotência e outcomes sem confundir security scheme com enforcement.", code: `openapi: 3.2.1
info: { title: Quíron Reservations API, version: 1.0.0 }
paths:
  /reservations:
    post:
      operationId: reserveSeat
      security: [{ bearerAuth: [] }]
      parameters:
        - { name: Idempotency-Key, in: header, required: true, schema: { type: string, minLength: 16 } }
      responses:
        "201": { description: Reservation created }
        "409": { description: Seat unavailable or key conflict }
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }` },
    { lang: "bash", purpose: "Compara operações declaradas a uma fixture de rotas e falha para documentação órfã ou rota invisível.", code: `set -euo pipefail
jq -r '.paths | to_entries[] as $p | $p.value | keys[] | select(test("^(get|put|post|delete|patch|head|options|trace)$")) | "\(.) \($p.key)"' openapi.json | sort > declared.txt
jq -r '.routes[] | "\(.method | ascii_downcase) \(.path)"' runtime-routes.json | sort > implemented.txt
diff -u declared.txt implemented.txt
jq -e '.securityEnforced == true and .tenantIsolationTested == true' runtime-evidence.json >/dev/null` },
  ],
  "Documento raiz, versões e dialetos": [
    { lang: "yaml", purpose: "Usa OAS 3.2 com identidade canônica, dialect explícito e versão da API distinta da versão normativa.", code: `openapi: 3.2.1
$self: https://contracts.example.invalid/chiron/openapi.yaml
jsonSchemaDialect: https://spec.openapis.org/oas/3.2/dialect/2025-09-17
info:
  title: Quíron API
  version: 2026.09.0
  contact: { name: Platform API, url: https://example.invalid/api-ownership }
paths: {}
components:
  schemas:
    ReservationId:
      type: string
      pattern: "^res_[A-Za-z0-9]{20}$"` },
    { lang: "json", purpose: "Expressa null em JSON Schema moderno e fecha propriedades avaliadas sem usar nullable legado.", code: `{
  "openapi": "3.1.1",
  "info": { "title": "Quíron Compatibility Fixture", "version": "1.1.0" },
  "paths": {},
  "components": {
    "schemas": {
      "Outcome": {
        "type": "object",
        "required": ["status", "reservationId"],
        "properties": {
          "status": { "const": "confirmed" },
          "reservationId": { "type": ["string", "null"] }
        },
        "unevaluatedProperties": false
      }
    }
  }
}` },
  ],
  "YAML, JSON e resolução": [
    { lang: "yaml", purpose: "Mantém escalares ambíguos como strings e usa referência semântica em vez de anchor contratual.", code: `openapi: "3.2.1"
info:
  title: "Quíron YAML Fixture"
  version: "2026.09"
paths:
  /flags/{value}:
    parameters:
      - name: value
        in: path
        required: true
        schema: { $ref: "#/components/schemas/LiteralFlag" }
components:
  schemas:
    LiteralFlag:
      type: string
      enum: ["on", "off", "yes", "no", "null", "01"]` },
    { lang: "bash", purpose: "Bundle offline deve ser determinístico e recusar duplicate keys, fetch remoto e segredo sintético.", code: `set -euo pipefail
tool='redocly@VERSAO_FIXADA'
npx --offline "$tool" bundle openapi.yaml --output bundle-a.yaml
npx --offline "$tool" bundle openapi.yaml --output bundle-b.yaml
cmp bundle-a.yaml bundle-b.yaml
sha256sum bundle-a.yaml > bundle-a.yaml.sha256
! rg -n 'https?://(169\.254\.169\.254|127\.0\.0\.1)|canary-secret' bundle-a.yaml
if npx --offline "$tool" bundle fixtures/duplicate-keys.yaml --output rejected.yaml; then exit 1; fi` },
  ],
  "Design-first, code-first e fonte de verdade": [
    { lang: "typescript", purpose: "Compara operações do bundle a um inventário de router sem declarar que essa checagem prova comportamento.", code: `type Operation = { method: string; path: string; operationId: string };
const declared: Operation[] = JSON.parse(process.env.DECLARED_OPERATIONS ?? "[]");
const implemented: Operation[] = JSON.parse(process.env.RUNTIME_OPERATIONS ?? "[]");
const key = ({ method, path }: Operation) => method.toLowerCase() + " " + path;
const spec = new Map(declared.map((operation) => [key(operation), operation.operationId]));
const runtime = new Set(implemented.map(key));
const missing = [...spec.keys()].filter((operation) => !runtime.has(operation));
const undocumented = [...runtime].filter((operation) => !spec.has(operation));
if (missing.length || undocumented.length) throw new Error(JSON.stringify({ missing, undocumented }));` },
    { lang: "bash", purpose: "Prova geração limpa e promove somente o bundle cujo digest aparece no manifest do serviço.", code: `set -euo pipefail
rm -rf generated-next; mkdir generated-next
./tools/generate-client --spec dist/openapi.bundle.json --output generated-next --config generator.lock.json
diff -ru generated generated-next
spec_digest="$(sha256sum dist/openapi.bundle.json | cut -d' ' -f1)"
service_digest="$(jq -r .openapiSha256 release-manifest.json)"
test "$spec_digest" = "$service_digest"
./tools/contract-smoke --spec dist/openapi.bundle.json --base-url "$CANDIDATE_BASE_URL" --redact` },
  ],
  "Paths, templates e operationId": [
    { lang: "yaml", purpose: "Define paths não ambíguos, parâmetro obrigatório e operationIds estáveis para reserva e leitura.", code: `openapi: 3.2.1
info: { title: Quíron Paths Fixture, version: 1.0.0 }
paths:
  /reservations:
    post:
      operationId: reserveSeat
      responses: { "201": { description: Created }, "409": { description: Conflict } }
  /reservations/{reservationId}:
    parameters:
      - name: reservationId
        in: path
        required: true
        schema: { type: string, pattern: "^res_[A-Za-z0-9]{20}$" }
    get:
      operationId: getReservation
      responses: { "200": { description: Found }, "404": { description: Not found } }` },
    { lang: "typescript", purpose: "Normaliza templates do inventário e rejeita duplicatas e operationIds repetidos antes da geração.", code: `type Route = { method: string; path: string; operationId: string };
const routes: Route[] = JSON.parse(process.env.ROUTES_JSON ?? "[]");
const normalized = (path: string) => path.replace(/\\{[^}]+\\}/g, "{}").replace(/\\\/$/, "") || "/";
const routeKeys = routes.map((route) => route.method.toLowerCase() + " " + normalized(route.path));
const operationIds = routes.map((route) => route.operationId);
const duplicates = (items: string[]) => items.filter((item, index) => items.indexOf(item) !== index);
if (duplicates(routeKeys).length || duplicates(operationIds).length) {
  throw new Error(JSON.stringify({ duplicateRoutes: duplicates(routeKeys), duplicateOperationIds: duplicates(operationIds) }));
}` },
  ],
  "Métodos seguros e idempotentes": [
    { lang: "yaml", purpose: "Documenta POST idempotente, conflito de fingerprint e resultado assíncrono reconciliável.", code: `openapi: 3.2.1
info: { title: Quíron Idempotency Fixture, version: 1.0.0 }
paths:
  /reservations:
    post:
      operationId: reserveSeat
      parameters:
        - name: Idempotency-Key
          in: header
          required: true
          schema: { type: string, minLength: 16, maxLength: 128, pattern: "^[A-Za-z0-9._:-]+$" }
      responses:
        "201": { description: Created; replay returns the same reservation identity }
        "202": { description: Accepted; reconcile through the status URL }
        "409": { description: Seat unavailable or key reused with different input }` },
    { lang: "bash", purpose: "Repete a mesma chave após reset de resposta e exige uma reserva e um evento no estado autoritativo.", code: `set -euo pipefail
key="contract-idempotency-$RANDOM-$$"
./fault-proxy arm --mode commit-then-reset --request-key "$key"
curl -sS --max-time 3 -X POST "$BASE_URL/reservations" -H "Authorization: Bearer $FIXTURE_TOKEN" -H "Idempotency-Key: $key" -H 'Content-Type: application/json' -d '{"showId":"show_fixture","quantity":1}' || true
curl -fsS -X POST "$BASE_URL/reservations" -H "Authorization: Bearer $FIXTURE_TOKEN" -H "Idempotency-Key: $key" -H 'Content-Type: application/json' -d '{"showId":"show_fixture","quantity":1}' > replay.json
jq -e '.status == "confirmed" and .reservationId' replay.json >/dev/null
./fixtures/query-evidence --key "$key" | jq -e '.reservations == 1 and .outboxEvents == 1' >/dev/null` },
  ],
  "Status codes e outcomes": [
    { lang: "yaml", purpose: "Modela outcomes de reserva e Problem Details distintos sem encapsular erro em 200.", code: `openapi: 3.2.1
info: { title: Quíron Outcomes Fixture, version: 1.0.0 }
paths:
  /reservations:
    post:
      operationId: reserveSeat
      responses:
        "201": { description: Reservation committed, headers: { Location: { schema: { type: string, format: uri-reference } } } }
        "202": { description: Outcome unknown; poll Location, headers: { Location: { schema: { type: string, format: uri-reference } } } }
        "400": { $ref: "#/components/responses/Problem" }
        "401": { $ref: "#/components/responses/Problem" }
        "409": { $ref: "#/components/responses/Problem" }
        "5XX": { $ref: "#/components/responses/Problem" }
components:
  responses:
    Problem:
      description: Safe machine-readable error
      content: { application/problem+json: { schema: { $ref: "#/components/schemas/Problem" } } }
  schemas:
    Problem:
      type: object
      required: [type, title, status, code]
      properties: { type: { type: string, format: uri-reference }, title: { type: string }, status: { type: integer }, code: { type: string } }` },
    { lang: "bash", purpose: "Provoca os outcomes essenciais, valida status e content type e consulta a evidência do efeito.", code: `set -euo pipefail
for fixture in created:201 sold-out:409 invalid:400 unauthenticated:401 unknown:202; do
  name="\${fixture%%:*}"; expected="\${fixture##*:}"
  curl -sS -D "$name.headers" -o "$name.json" -w '%{http_code}' -X POST "$BASE_URL/fixtures/$name" > "$name.status"
  test "$(cat "$name.status")" = "$expected"
  grep -iE '^content-type: (application/json|application/problem\+json)' "$name.headers" >/dev/null
done
jq -e '.code and .status == 409 and (has("stack") | not)' sold-out.json >/dev/null
./fixtures/query-evidence --scenario created | jq -e '.reservations == 1 and .outboxEvents == 1' >/dev/null` },
  ],
  "Headers e negociação": [
    { lang: "yaml", purpose: "Declara negociação, Location, ETag, If-Match e Retry-After com schemas explícitos.", code: `openapi: 3.2.1
info: { title: Quíron Headers Fixture, version: 1.0.0 }
paths:
  /reservations/{id}:
    get:
      operationId: getReservation
      parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
      responses:
        "200":
          description: Current representation
          headers: { ETag: { required: true, schema: { type: string } }, Vary: { schema: { type: string } } }
          content: { application/json: { schema: { type: object } }, application/problem+json: { schema: { type: object } } }
    patch:
      operationId: updateReservation
      parameters:
        - { name: id, in: path, required: true, schema: { type: string } }
        - { name: If-Match, in: header, required: true, schema: { type: string } }
      responses: { "200": { description: Updated }, "412": { description: Stale validator }, "429": { description: Rate limited, headers: { Retry-After: { schema: { type: string } } } } }` },
    { lang: "bash", purpose: "Exercita negociação e corrida de ETag, rejeitando media type e precondition obsoletos.", code: `set -euo pipefail
curl -fsS -D current.headers -H 'Accept: application/json' "$BASE_URL/reservations/res_fixture" > current.json
etag="$(awk 'BEGIN{IGNORECASE=1} /^etag:/{gsub("\r",""); print $2}' current.headers)"; test -n "$etag"
test "$(curl -sS -o /dev/null -w '%{http_code}' -H 'Accept: application/xml' "$BASE_URL/reservations/res_fixture")" = 406
curl -fsS -X PATCH -H "If-Match: $etag" -H 'Content-Type: application/merge-patch+json' -d '{"note":"first"}' "$BASE_URL/reservations/res_fixture" >/dev/null
test "$(curl -sS -o stale.json -w '%{http_code}' -X PATCH -H "If-Match: $etag" -H 'Content-Type: application/merge-patch+json' -d '{"note":"stale"}' "$BASE_URL/reservations/res_fixture")" = 412
jq -e '.code == "stale_precondition"' stale.json >/dev/null` },
  ],
  "Path, query, header e cookie": [
    { lang: "yaml", purpose: "Distingue parâmetros por localização e impede que tenant do request seja tratado como identidade autenticada.", code: `openapi: 3.2.1
info: { title: Quíron Parameters Fixture, version: 1.0.0 }
paths:
  /reservations/{reservationId}:
    get:
      operationId: getReservation
      parameters:
        - { name: reservationId, in: path, required: true, schema: { type: string, pattern: "^res_[A-Za-z0-9]{20}$" } }
        - { name: include, in: query, schema: { type: array, maxItems: 3, items: { type: string, enum: [show, audit] } } }
        - { name: X-Request-Id, in: header, schema: { type: string, maxLength: 64 } }
        - { name: locale, in: cookie, schema: { type: string, enum: [pt-BR, en-US] } }
      responses: { "200": { description: Found }, "404": { description: Missing or hidden } }` },
    { lang: "bash", purpose: "Envia matriz de path, query e headers adversariais e exige falha fechada sem efeito cross-tenant.", code: `set -euo pipefail
for target in '/reservations/%2Fadmin' '/reservations/res_short' '/reservations/res_ABCDEFGHIJKLMNOPQRST?limit=999999' '/reservations/res_ABCDEFGHIJKLMNOPQRST?limit=1&limit=2'; do
  status="$(curl -sS -o response.json -w '%{http_code}' -H 'Authorization: Bearer fixture-tenant-a' -H $'X-Request-Id: safe\r\nInjected: yes' "$BASE_URL$target" || true)"
  test "$status" -ge 400
done
./fixtures/query-evidence --tenant tenant-b | jq -e '.reads == 0 and .writes == 0' >/dev/null` },
  ],
  "style, explode e allowReserved": [
    { lang: "yaml", purpose: "Explicita wire formats de arrays e objeto fechado para evitar defaults divergentes entre SDK e servidor.", code: `openapi: 3.2.1
info: { title: Quíron Serialization Fixture, version: 1.0.0 }
paths:
  /reservations:
    get:
      operationId: listReservations
      parameters:
        - name: status
          in: query
          style: form
          explode: true
          schema: { type: array, maxItems: 4, uniqueItems: true, items: { type: string, enum: [pending, confirmed, cancelled] } }
        - name: filter
          in: query
          style: deepObject
          explode: true
          allowReserved: false
          schema: { type: object, additionalProperties: false, properties: { showId: { type: string }, after: { type: string, format: date-time } } }
      responses: { "200": { description: Filtered list } }` },
    { lang: "typescript", purpose: "Compara a query emitida à representação canônica prevista, incluindo Unicode e caracteres reservados.", code: `const query = new URLSearchParams();
for (const status of ["pending", "confirmed"]) query.append("status", status);
query.set("filter[showId]", "show café/2026");
query.set("filter[after]", "2026-09-20T12:00:00Z");
const actual = query.toString();
const expected = "status=pending&status=confirmed&filter%5BshowId%5D=show+caf%C3%A9%2F2026&filter%5Bafter%5D=2026-09-20T12%3A00%3A00Z";
if (actual !== expected) throw new Error(JSON.stringify({ expected, actual }));
const parsed = [...new URLSearchParams(actual).entries()];
if (parsed.length !== 4 || parsed[2][1] !== "show café/2026") throw new Error("round-trip divergente");` },
  ],
  "Coerção, limites e Unicode": [
    { lang: "yaml", purpose: "Fecha formas lexicais e limites de boolean, inteiro, cursor e texto sem depender de coerção permissiva.", code: `openapi: 3.2.1
info: { title: Quíron Coercion Fixture, version: 1.0.0 }
paths:
  /reservations:
    get:
      operationId: listReservations
      parameters:
        - { name: includeCancelled, in: query, schema: { type: boolean } }
        - { name: limit, in: query, schema: { type: integer, minimum: 1, maximum: 100, default: 20 } }
        - { name: cursor, in: query, schema: { type: string, minLength: 16, maxLength: 512, pattern: "^[A-Za-z0-9_-]+$" } }
        - { name: search, in: query, schema: { type: string, maxLength: 80 } }
      responses: { "200": { description: Page }, "400": { description: Parameter rejected } }` },
    { lang: "typescript", purpose: "Implementa parser lexical fechado e rejeita truthiness, truncamento e integer fora do teto.", code: `function parseBoolean(raw: string): boolean {
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new Error("invalid_boolean");
}
function parseLimit(raw: string): number {
  if (!/^(?:[1-9]|[1-9][0-9]|100)$/.test(raw)) throw new Error("invalid_limit");
  return Number(raw);
}
for (const invalid of ["False", "0", "yes", " true "]) try { parseBoolean(invalid); throw new Error("accepted"); } catch (error) { if ((error as Error).message === "accepted") throw error; }
for (const invalid of ["0", "01", "1.5", "101", "1e2"]) try { parseLimit(invalid); throw new Error("accepted"); } catch (error) { if ((error as Error).message === "accepted") throw error; }
if (!parseBoolean("true") || parseLimit("100") !== 100) throw new Error("valid input rejected");` },
  ],
  "Parâmetros reutilizáveis": [
    { lang: "yaml", purpose: "Reutiliza idempotência e paginação por referência sem perder localização, limites ou requiredness.", code: `openapi: 3.2.1
info: { title: Quíron Reusable Parameters, version: 1.0.0 }
paths:
  /reservations:
    get:
      operationId: listReservations
      parameters: [{ $ref: "#/components/parameters/PageLimit" }]
      responses: { "200": { description: Page } }
    post:
      operationId: reserveSeat
      parameters: [{ $ref: "#/components/parameters/IdempotencyKey" }]
      responses: { "201": { description: Created } }
components:
  parameters:
    PageLimit: { name: limit, in: query, schema: { type: integer, minimum: 1, maximum: 100, default: 20 } }
    IdempotencyKey: { name: Idempotency-Key, in: header, required: true, schema: { type: string, minLength: 16, maxLength: 128 } }` },
    { lang: "bash", purpose: "Constrói grafo de uso no bundle resolvido e rejeita duplicate name/in e idempotência divergente.", code: `set -euo pipefail
jq -r '.paths | to_entries[] as $path | $path.value | to_entries[] | select(.key|test("^(get|post|put|patch|delete)$")) | .key as $method | .value.parameters[]? | [$method,$path.key,.name,.in,(.required//false),(.schema.minLength//""),(.schema.maxLength//"")] | @tsv' resolved-openapi.json > parameter-usage.tsv
duplicates="$(cut -f1-4 parameter-usage.tsv | sort | uniq -d)"; test -z "$duplicates"
awk -F '\t' '$3=="Idempotency-Key" { if ($4!="header" || $5!="true" || $6!="16" || $7!="128") exit 1; count++ } END { exit count==0 }' parameter-usage.tsv` },
  ],
  "RequestBody e JSON": [
    { lang: "yaml", purpose: "Fecha o DTO de reserva, diferencia corpo obrigatório de propriedades e não aceita campos de autoridade.", code: `openapi: 3.2.1
info: { title: Quíron JSON Body Fixture, version: 1.0.0 }
paths:
  /reservations:
    post:
      operationId: reserveSeat
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: "#/components/schemas/CreateReservation" }
      responses: { "201": { description: Created }, "400": { description: Malformed or invalid body }, "415": { description: Unsupported media type } }
components:
  schemas:
    CreateReservation:
      type: object
      additionalProperties: false
      required: [showId, quantity]
      properties: { showId: { type: string, pattern: "^show_[A-Za-z0-9]+$" }, quantity: { type: integer, minimum: 1, maximum: 8 }, note: { type: [string, "null"], maxLength: 200 } }` },
    { lang: "bash", purpose: "Envia presença, null, unknown, duplicate, profundidade e tipo incorreto e exige zero efeitos.", code: `set -euo pipefail
printf '%s\n' '' 'null' '{}' '{"showId":"show_a"}' '{"showId":"show_a","quantity":1,"tenantId":"other"}' '{"showId":"show_a","quantity":1,"quantity":2}' '{"showId":"show_a","quantity":"1"}' > invalid-bodies.ndjson
while IFS= read -r body; do status="$(curl -sS -o problem.json -w '%{http_code}' -X POST "$BASE_URL/reservations" -H 'Content-Type: application/json' --data-binary "$body")"; test "$status" -ge 400; jq -e 'has("stack") | not' problem.json >/dev/null 2>&1 || test ! -s problem.json; done < invalid-bodies.ndjson
./fixtures/query-evidence --scenario invalid-json | jq -e '.reservations == 0 and .outboxEvents == 0' >/dev/null` },
  ],
  "Form URL encoded": [
    { lang: "yaml", purpose: "Modela formulário OAuth-like com fields fechados, limites e encoding explícito sem exemplos secretos.", code: `openapi: 3.2.1
info: { title: Quíron Form Fixture, version: 1.0.0 }
paths:
  /oauth/token:
    post:
      operationId: exchangeAuthorizationCode
      requestBody:
        required: true
        content:
          application/x-www-form-urlencoded:
            schema:
              type: object
              additionalProperties: false
              required: [grant_type, code, redirect_uri, client_id, code_verifier]
              properties: { grant_type: { const: authorization_code }, code: { type: string, minLength: 16 }, redirect_uri: { type: string, format: uri }, client_id: { type: string }, code_verifier: { type: string, minLength: 43, maxLength: 128 } }
      responses: { "200": { description: Token issued }, "400": { description: Invalid grant or encoding }, "415": { description: Unsupported media type } }` },
    { lang: "bash", purpose: "Preserva bytes e rejeita duplicate, escape malformado e segredo refletido em logs ou resposta.", code: `set -euo pipefail
valid='grant_type=authorization_code&code=fixture_code_123456&redirect_uri=https%3A%2F%2Fclient.example.invalid%2Fcb&client_id=public-fixture&code_verifier=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
curl -fsS -X POST "$BASE_URL/oauth/token" -H 'Content-Type: application/x-www-form-urlencoded' --data-binary "$valid" > token.json
for invalid in "$valid&code=duplicate" 'grant_type=authorization_code&code=%ZZ' 'grant_type=authorization_code&client_secret=fixture-secret'; do test "$(curl -sS -o problem.json -w '%{http_code}' -X POST "$BASE_URL/oauth/token" -H 'Content-Type: application/x-www-form-urlencoded' --data-binary "$invalid")" -ge 400; done
! grep -R -F 'fixture-secret' token.json problem.json server-redacted.log` },
  ],
  "Multipart e upload": [
    { lang: "yaml", purpose: "Declara metadata JSON e arquivo binário como partes distintas, com requiredness e limites documentados.", code: `openapi: 3.2.1
info: { title: Quíron Upload Fixture, version: 1.0.0 }
paths:
  /reservation-attachments:
    post:
      operationId: uploadReservationAttachment
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              additionalProperties: false
              required: [metadata, file]
              properties: { metadata: { $ref: "#/components/schemas/AttachmentMetadata" }, file: { type: string, format: binary } }
            encoding: { metadata: { contentType: application/json }, file: { contentType: "image/png, application/pdf" } }
      responses: { "202": { description: Accepted for scanning }, "400": { description: Malformed multipart }, "413": { description: Too large }, "415": { description: Unsupported content } }
components:
  schemas:
    AttachmentMetadata: { type: object, additionalProperties: false, required: [reservationId], properties: { reservationId: { type: string }, purpose: { type: string, maxLength: 80 } } }` },
    { lang: "bash", purpose: "Envia fixture com filename hostil, verifica staging server-side e cancela upload sem órfão.", code: `set -euo pipefail
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT; printf 'synthetic png fixture' > "$tmp/file.png"
curl -fsS -X POST "$BASE_URL/reservation-attachments" -H "Authorization: Bearer $FIXTURE_TOKEN" -F 'metadata={"reservationId":"res_fixture","purpose":"evidence"};type=application/json' -F "file=@$tmp/file.png;type=image/png;filename=../../escape.png" > accepted.json
jq -e '.status == "pending_scan" and (.objectKey | startswith("tenant-fixture/")) and (.objectKey | contains("..") | not)' accepted.json >/dev/null
curl -sS --limit-rate 1 --max-time 1 -X POST "$BASE_URL/reservation-attachments" -F "file=@$tmp/file.png" || true
./fixtures/query-evidence --scenario aborted-upload | jq -e '.orphanObjects == 0 and .crossTenantReads == 0' >/dev/null` },
  ],
  "Downloads e streaming": [
    { lang: "yaml", purpose: "Documenta download binário, condicionais e ranges sem tentar representar bytes como JSON.", code: `openapi: 3.2.1
info: { title: Quíron Download Fixture, version: 1.0.0 }
paths:
  /reservation-attachments/{attachmentId}:
    get:
      operationId: downloadReservationAttachment
      parameters:
        - { name: attachmentId, in: path, required: true, schema: { type: string } }
        - { name: If-None-Match, in: header, schema: { type: string } }
        - { name: Range, in: header, schema: { type: string, pattern: "^bytes=[0-9]*-[0-9]*$" } }
      responses:
        "200": { description: Complete bytes, headers: { ETag: { schema: { type: string } }, Content-Disposition: { schema: { type: string } } }, content: { application/octet-stream: { schema: { type: string, format: binary } } } }
        "206": { description: Partial bytes, headers: { Content-Range: { schema: { type: string } } }, content: { application/octet-stream: { schema: { type: string, format: binary } } } }
        "304": { description: Not modified }
        "416": { description: Invalid range }` },
    { lang: "bash", purpose: "Valida bytes, checksum, ETag, range e isolamento sem encaminhar autorização a redirect externo.", code: `set -euo pipefail
curl -fsS -D full.headers -H "Authorization: Bearer $FIXTURE_TOKEN" "$BASE_URL/reservation-attachments/att_fixture" -o full.bin
etag="$(awk 'BEGIN{IGNORECASE=1} /^etag:/{gsub("\r","");print $2}' full.headers)"; test -n "$etag"; sha256sum -c fixtures/att_fixture.sha256
test "$(curl -sS -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $FIXTURE_TOKEN" -H "If-None-Match: $etag" "$BASE_URL/reservation-attachments/att_fixture")" = 304
curl -fsS -D range.headers -H "Authorization: Bearer $FIXTURE_TOKEN" -H 'Range: bytes=0-15' "$BASE_URL/reservation-attachments/att_fixture" -o range.bin
test "$(wc -c < range.bin)" -eq 16; grep -i '^content-range: bytes 0-15/' range.headers >/dev/null
test "$(curl -sS -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $OTHER_TENANT_TOKEN" "$BASE_URL/reservation-attachments/att_fixture")" = 404` },
  ],
  "Tipos, required e null": [
    { lang: "yaml", purpose: "Diferencia propriedade obrigatória, valor anulável e campos read/write nas direções corretas.", code: `openapi: 3.2.1
info: { title: Quíron Presence Fixture, version: 1.0.0 }
paths: {}
components:
  schemas:
    ReservationRequest:
      type: object
      additionalProperties: false
      required: [showId, quantity, note]
      properties: { showId: { type: string }, quantity: { type: integer, minimum: 1 }, note: { type: [string, "null"], maxLength: 200 }, status: { type: string, readOnly: true } }
    ReservationResponse:
      type: object
      additionalProperties: false
      required: [reservationId, status, note]
      properties: { reservationId: { type: string, readOnly: true }, status: { type: string, enum: [confirmed, rejected], readOnly: true }, note: { type: [string, "null"] }, internalToken: { type: string, writeOnly: true } }` },
    { lang: "json", purpose: "Fornece corpus que separa ausência de null, vazio, zero e false para um validator contextual.", code: `{
  "cases": [
    { "name": "valid-null", "direction": "request", "instance": { "showId": "show_a", "quantity": 1, "note": null }, "valid": true },
    { "name": "missing-note", "direction": "request", "instance": { "showId": "show_a", "quantity": 1 }, "valid": false },
    { "name": "empty-note", "direction": "request", "instance": { "showId": "show_a", "quantity": 1, "note": "" }, "valid": true },
    { "name": "zero-quantity", "direction": "request", "instance": { "showId": "show_a", "quantity": 0, "note": null }, "valid": false },
    { "name": "read-only-in-request", "direction": "request", "instance": { "showId": "show_a", "quantity": 1, "note": null, "status": "confirmed" }, "valid": false }
  ]
}` },
  ],
  "Composição": [
    { lang: "yaml", purpose: "Modela tagged union disjunta e fechamento após composição no dialect moderno.", code: `openapi: 3.2.1
info: { title: Quíron Composition Fixture, version: 1.0.0 }
paths: {}
components:
  schemas:
    Delivery:
      oneOf:
        - $ref: "#/components/schemas/EmailDelivery"
        - $ref: "#/components/schemas/WebhookDelivery"
      discriminator: { propertyName: kind, mapping: { email: "#/components/schemas/EmailDelivery", webhook: "#/components/schemas/WebhookDelivery" } }
    EmailDelivery: { type: object, required: [kind, address], properties: { kind: { const: email }, address: { type: string, format: email } }, unevaluatedProperties: false }
    WebhookDelivery: { type: object, required: [kind, endpoint], properties: { kind: { const: webhook }, endpoint: { type: string, format: uri } }, unevaluatedProperties: false }` },
    { lang: "json", purpose: "Testa exatamente um branch, zero branches e mutante sobreposto sem depender de escolha do generator.", code: `{
  "cases": [
    { "name": "email", "instance": { "kind": "email", "address": "fixture@example.invalid" }, "matches": 1 },
    { "name": "webhook", "instance": { "kind": "webhook", "endpoint": "https://hooks.example.invalid/test" }, "matches": 1 },
    { "name": "unknown", "instance": { "kind": "sms", "number": "+550000000000" }, "matches": 0 },
    { "name": "missing-tag", "instance": { "address": "fixture@example.invalid" }, "matches": 0 },
    { "name": "mixed", "instance": { "kind": "email", "address": "fixture@example.invalid", "endpoint": "https://hooks.example.invalid/test" }, "matches": 0 }
  ],
  "mutant": "remove const from both branches; email then matches more than one schema"
}` },
  ],
  "Polimorfismo e discriminator": [
    { lang: "yaml", purpose: "Usa mapping explícito para manter tags de wire independentes dos nomes internos dos schemas.", code: `openapi: 3.2.1
info: { title: Quíron Polymorphism Fixture, version: 1.0.0 }
paths: {}
components:
  schemas:
    ReservationEvent:
      oneOf: [{ $ref: "#/components/schemas/ReservationConfirmed" }, { $ref: "#/components/schemas/ReservationRejected" }]
      discriminator: { propertyName: eventType, mapping: { reservation.confirmed.v1: "#/components/schemas/ReservationConfirmed", reservation.rejected.v1: "#/components/schemas/ReservationRejected" } }
    ReservationConfirmed: { type: object, required: [eventType, reservationId], properties: { eventType: { const: reservation.confirmed.v1 }, reservationId: { type: string } }, unevaluatedProperties: false }
    ReservationRejected: { type: object, required: [eventType, reason], properties: { eventType: { const: reservation.rejected.v1 }, reason: { type: string, enum: [sold_out, conflict] } }, unevaluatedProperties: false }` },
    { lang: "typescript", purpose: "Decodifica union conhecida com fallback explícito e nunca instancia classe a partir de tag não confiável.", code: `type Known = { eventType: "reservation.confirmed.v1"; reservationId: string } | { eventType: "reservation.rejected.v1"; reason: "sold_out" | "conflict" };
type Decoded = { kind: "known"; value: Known } | { kind: "unknown"; eventType: string };
function decode(value: unknown): Decoded {
  if (!value || typeof value !== "object") throw new Error("invalid_event");
  const record = value as Record<string, unknown>;
  if (record.eventType === "reservation.confirmed.v1" && typeof record.reservationId === "string") return { kind: "known", value: record as Known };
  if (record.eventType === "reservation.rejected.v1" && (record.reason === "sold_out" || record.reason === "conflict")) return { kind: "known", value: record as Known };
  return { kind: "unknown", eventType: typeof record.eventType === "string" ? record.eventType : "missing" };
}
if (decode({ eventType: "future.v2" }).kind !== "unknown") throw new Error("future variant was not isolated");` },
  ],
  "Restrições e formatos": [
    { lang: "yaml", purpose: "Aplica limites operacionais e formatos com tipos transportáveis, mantendo dinheiro e IDs fora de float inseguro.", code: `openapi: 3.2.1
info: { title: Quíron Constraints Fixture, version: 1.0.0 }
paths: {}
components:
  schemas:
    ReservationFilter:
      type: object
      additionalProperties: false
      maxProperties: 6
      properties:
        quantity: { type: integer, minimum: 1, maximum: 8 }
        priceMinor: { type: integer, minimum: 0, maximum: 9007199254740991 }
        requestId: { type: string, pattern: "^[A-Za-z0-9._:-]{16,64}$" }
        createdAfter: { type: string, format: date-time }
        callback: { type: string, format: uri, maxLength: 2048 }
        statuses: { type: array, minItems: 1, maxItems: 4, uniqueItems: true, items: { type: string, enum: [pending, confirmed, rejected, cancelled] } }` },
    { lang: "typescript", purpose: "Valida lexicalmente data, URI e limites críticos sem tratar format como autorização ou SSRF defense.", code: `const requestId = /^[A-Za-z0-9._:-]{16,64}$/;
function validate(input: { quantity: number; requestId: string; createdAfter: string; callback: string }): void {
  if (!Number.isSafeInteger(input.quantity) || input.quantity < 1 || input.quantity > 8) throw new Error("quantity");
  if (!requestId.test(input.requestId)) throw new Error("requestId");
  const timestamp = Date.parse(input.createdAfter); if (!Number.isFinite(timestamp) || !/[zZ]|[+-][0-9]{2}:[0-9]{2}$/.test(input.createdAfter)) throw new Error("date-time");
  const url = new URL(input.callback); if (url.protocol !== "https:" || url.username || url.password) throw new Error("callback");
  if (["localhost", "127.0.0.1", "::1", "169.254.169.254"].includes(url.hostname)) throw new Error("callback_policy");
}
validate({ quantity: 1, requestId: "request-fixture-01", createdAfter: "2026-09-20T12:00:00Z", callback: "https://hooks.example.invalid/events" });` },
  ],
  "$ref e identidade de URI": [
    { lang: "yaml", purpose: "Define identidade canônica e referências relativas e escapadas que devem resolver independentemente do cwd.", code: `openapi: 3.2.1
$self: https://contracts.example.invalid/chiron/openapi.yaml
info: { title: Quíron Reference Fixture, version: 1.0.0 }
paths:
  /reservations/{id}: { $ref: "./paths/reservations.yaml#/$defs/~1reservations~1%7Bid%7D" }
components:
  schemas:
    Reservation: { $ref: "https://schemas.example.invalid/chiron/reservations/1.0.0#/Reservation" }
    EscapedName: { $ref: "#/components/schemas/a~1b~0c" }
    a/b~c: { type: string, minLength: 1 }` },
    { lang: "bash", purpose: "Resolve somente por lock offline, compara cwd diferentes e bloqueia metadata, redirect e bytes divergentes.", code: `set -euo pipefail
./tools/openapi-resolve --entry contracts/openapi.yaml --lock contracts/refs.lock.json --offline --output bundle-a.json
(cd fixtures/other-cwd && ../../tools/openapi-resolve --entry ../../contracts/openapi.yaml --lock ../../contracts/refs.lock.json --offline --output ../../bundle-b.json)
cmp bundle-a.json bundle-b.json
jq -e '.materials | all(.digest | startswith("sha256:"))' contracts/refs.lock.json >/dev/null
if ./tools/openapi-resolve --entry fixtures/metadata-ref.yaml --lock contracts/refs.lock.json --offline --output rejected.json; then exit 1; fi
sha256sum bundle-a.json > bundle-a.json.sha256` },
  ],
  "Ciclos e grafos": [
    { lang: "yaml", purpose: "Modela árvore recursiva legítima preservando referência e limite operacional documentado.", code: `openapi: 3.2.1
info: { title: Quíron Recursive Fixture, version: 1.0.0 }
paths: {}
components:
  schemas:
    Category:
      type: object
      additionalProperties: false
      required: [id, children]
      properties:
        id: { type: string, pattern: "^cat_[A-Za-z0-9]+$" }
        children:
          type: array
          maxItems: 50
          items: { $ref: "#/components/schemas/Category" }
      description: Runtime validation additionally limits the tree to 16 levels and 500 total nodes.` },
    { lang: "typescript", purpose: "Percorre grafo de refs com estados visiting/visited e rejeita excesso sem expandir recursão.", code: `type Graph = Record<string, string[]>;
function stronglyConnected(graph: Graph, maximumEdges = 5000): string[][] {
  let edges = 0, index = 0; const stack: string[] = [], onStack = new Set<string>(), indexes = new Map<string, number>(), low = new Map<string, number>(), groups: string[][] = [];
  const visit = (node: string) => { indexes.set(node, index); low.set(node, index++); stack.push(node); onStack.add(node); for (const next of graph[node] ?? []) { if (++edges > maximumEdges) throw new Error("graph_limit"); if (!indexes.has(next)) { visit(next); low.set(node, Math.min(low.get(node)!, low.get(next)!)); } else if (onStack.has(next)) low.set(node, Math.min(low.get(node)!, indexes.get(next)!)); } if (low.get(node) === indexes.get(node)) { const group: string[] = []; let current: string; do { current = stack.pop()!; onStack.delete(current); group.push(current); } while (current !== node); groups.push(group); } };
  for (const node of Object.keys(graph)) if (!indexes.has(node)) visit(node); return groups;
}
const groups = stronglyConnected({ Category: ["Category"], Reservation: ["Problem"], Problem: [] }); if (!groups.some((group) => group.length === 1 && group[0] === "Category")) throw new Error("recursive node missing");` },
  ],
  "Split, bundle e dereference": [
    { lang: "yaml", purpose: "Mantém entrypoint modular com refs versionadas e sem paths absolutos ou dependência de ambiente.", code: `openapi: 3.2.1
$self: https://contracts.example.invalid/chiron/1.0/openapi.yaml
info: { title: Quíron Modular API, version: 1.0.0 }
servers: [{ url: https://sandbox-api.example.invalid }]
paths:
  /reservations: { $ref: "./paths/reservations.yaml" }
  /reservations/{reservationId}: { $ref: "./paths/reservation-by-id.yaml" }
components:
  securitySchemes: { bearerAuth: { $ref: "./components/security.yaml#/bearerAuth" } }
  schemas:
    Reservation: { $ref: "./components/reservations.yaml#/Reservation" }
    Problem: { $ref: "./components/problems.yaml#/Problem" }` },
    { lang: "bash", purpose: "Gera bundle duas vezes em diretórios limpos, valida identidade e rejeita path absoluto ou endpoint admin público.", code: `set -euo pipefail
for dir in build-a build-b; do rm -rf "$dir"; mkdir "$dir"; cp -R contracts/. "$dir/source"; (cd "$dir" && ../tools/openapi-bundle --entry source/openapi.yaml --offline --output bundle.json); done
cmp build-a/bundle.json build-b/bundle.json
! rg -n '([A-Za-z]:\\|/home/|/Users/|/admin|metadata\.internal)' build-a/bundle.json
jq -e '.openapi == "3.2.1" and .paths["/reservations"] and .components.schemas.Reservation' build-a/bundle.json >/dev/null
sha256sum build-a/bundle.json > build-a/bundle.json.sha256` },
  ],
  "Vendoring e dependências": [
    { lang: "json", purpose: "Trava URI, versão, digest, licença e origem de cada schema externo usado no release.", code: `{
  "lockVersion": 1,
  "materials": [
    {
      "uri": "https://schemas.example.invalid/common/problem/2.1.0/schema.json",
      "resolved": "vendor/common-problem-2.1.0.schema.json",
      "digest": "sha256:SUBSTITUA_PELO_DIGEST",
      "license": "Apache-2.0",
      "publisher": "platform-api",
      "source": "https://source.example.invalid/platform/common-schemas/releases/2.1.0"
    }
  ]
}` },
    { lang: "bash", purpose: "Verifica lock e licença, constrói sem rede e rejeita bytes trocados ou package homônimo fora da origem.", code: `set -euo pipefail
material='vendor/common-problem-2.1.0.schema.json'
expected="$(jq -r '.materials[] | select(.resolved=="'"$material"'") | .digest' contracts/refs.lock.json | sed 's/^sha256://')"
test "$(sha256sum "$material" | cut -d' ' -f1)" = "$expected"
jq -e '.materials | all(.license != null and .publisher == "platform-api" and (.uri | startswith("https://schemas.example.invalid/")))' contracts/refs.lock.json >/dev/null
OPENAPI_NETWORK=deny ./tools/openapi-bundle --entry contracts/openapi.yaml --lock contracts/refs.lock.json --output release-bundle.json
if OPENAPI_REGISTRY=https://public.example.invalid ./tools/openapi-update common-problem --dry-run; then exit 1; fi` },
  ],
  "Response Object e headers": [
    { lang: "yaml", purpose: "Declara response completo com media type, Location, ETag e link por operationId.", code: `openapi: 3.2.1
info: { title: Quíron Responses Fixture, version: 1.0.0 }
paths:
  /reservations:
    post:
      operationId: reserveSeat
      responses:
        "201":
          description: Reservation committed
          headers: { Location: { required: true, schema: { type: string, format: uri-reference } }, ETag: { required: true, schema: { type: string } } }
          content: { application/json: { schema: { $ref: "#/components/schemas/Reservation" } } }
          links: { reservationStatus: { operationId: getReservation, parameters: { reservationId: "$response.body#/reservationId" } } }
        "409": { $ref: "#/components/responses/Problem" }
components:
  schemas: { Reservation: { type: object, required: [reservationId, status], properties: { reservationId: { type: string }, status: { const: confirmed } } } }
  responses: { Problem: { description: Conflict, content: { application/problem+json: { schema: { type: object } } } } }` },
    { lang: "bash", purpose: "Valida response e link observados e confirma que 201 corresponde ao efeito durável.", code: `set -euo pipefail
curl -fsS -D response.headers -X POST "$BASE_URL/reservations" -H "Authorization: Bearer $FIXTURE_TOKEN" -H "Idempotency-Key: response-$RANDOM-$$" -H 'Content-Type: application/json' -d '{"showId":"show_fixture","quantity":1}' > response.json
location="$(awk 'BEGIN{IGNORECASE=1} /^location:/{gsub("\r","");print $2}' response.headers)"; etag="$(awk 'BEGIN{IGNORECASE=1} /^etag:/{gsub("\r","");print $2}' response.headers)"
test -n "$location"; test -n "$etag"; reservation="$(jq -r .reservationId response.json)"
curl -fsS -H "Authorization: Bearer $FIXTURE_TOKEN" "$location" | jq -e --arg id "$reservation" '.reservationId == $id and .status == "confirmed"' >/dev/null
./fixtures/query-evidence --reservation "$reservation" | jq -e '.reservations == 1 and .outboxEvents == 1' >/dev/null` },
  ],
  "Problem Details e taxonomia": [
    { lang: "yaml", purpose: "Define Problem seguro e violações limitadas com códigos estáveis sem stack ou valor rejeitado.", code: `openapi: 3.2.1
info: { title: Quíron Problem Fixture, version: 1.0.0 }
paths: {}
components:
  schemas:
    Problem:
      type: object
      additionalProperties: false
      required: [type, title, status, code, correlationId]
      properties:
        type: { type: string, format: uri-reference }
        title: { type: string, maxLength: 120 }
        status: { type: integer, minimum: 400, maximum: 599 }
        detail: { type: string, maxLength: 500 }
        code: { type: string, pattern: "^[a-z][a-z0-9_]{2,63}$" }
        correlationId: { type: string, maxLength: 64 }
        violations: { type: array, maxItems: 20, items: { type: object, additionalProperties: false, required: [path, code], properties: { path: { type: string }, code: { type: string } } } }` },
    { lang: "bash", purpose: "Provoca taxonomia de erros e procura vazamento, mismatch de status e efeitos inválidos.", code: `set -euo pipefail
for scenario in malformed:400 unauthenticated:401 forbidden:404 conflict:409 stale:412 rate:429 unexpected:500; do name="\${scenario%%:*}"; expected="\${scenario##*:}"; actual="$(curl -sS -o "$name.json" -w '%{http_code}' "$BASE_URL/fixtures/problems/$name")"; test "$actual" = "$expected"; jq -e --argjson status "$expected" '.status == $status and (.code|type=="string") and (has("stack")|not) and (has("sql")|not)' "$name.json" >/dev/null; done
! rg -i 'authorization|password|token|select .* from|exception at' *.json
./fixtures/query-evidence --scenario invalid-problems | jq -e '.writes == 0 and .outboxEvents == 0' >/dev/null` },
  ],
  "Callbacks": [
    { lang: "yaml", purpose: "Descreve callback assinado derivado de destination verificado com responses de retry explícitas.", code: `openapi: 3.2.1
info: { title: Quíron Callback Fixture, version: 1.0.0 }
paths:
  /exports:
    post:
      operationId: createExport
      requestBody: { required: true, content: { application/json: { schema: { type: object, required: [callbackUrl], properties: { callbackUrl: { type: string, format: uri } } } } } }
      responses: { "202": { description: Export accepted } }
      callbacks:
        exportReady:
          "{$request.body#/callbackUrl}":
            post:
              operationId: receiveExportReady
              parameters: [{ name: X-Quiron-Signature, in: header, required: true, schema: { type: string } }, { name: X-Quiron-Event-Id, in: header, required: true, schema: { type: string } }]
              requestBody: { required: true, content: { application/json: { schema: { type: object, required: [exportId, status], properties: { exportId: { type: string }, status: { const: ready } } } } } }
              responses: { "204": { description: Accepted }, "429": { description: Retry later }, "5XX": { description: Transient failure } }` },
    { lang: "bash", purpose: "Injeta redirect, private IP, timeout e replay e exige destino permitido e um efeito consumidor.", code: `set -euo pipefail
for url in 'http://169.254.169.254/latest/meta-data/' 'http://127.0.0.1/admin' 'https://hooks.example.invalid/redirect-private'; do test "$(curl -sS -o problem.json -w '%{http_code}' -X POST "$BASE_URL/exports" -H 'Content-Type: application/json' -d "{\"callbackUrl\":\"$url\"}")" -ge 400; done
./fixtures/register-callback --url https://verified-hooks.example.invalid/export --tenant tenant-fixture > destination.json
./fixtures/deliver-callback --destination "$(jq -r .id destination.json)" --fault timeout-after-effect --event event_fixture --attempts 3
./fixtures/query-callback-evidence --event event_fixture | jq -e '.consumerEffects == 1 and .attempts >= 2 and .privateNetworkRequests == 0' >/dev/null` },
  ],
  "Webhooks": [
    { lang: "yaml", purpose: "Define webhook versionado com assinatura, evento estável e responses que orientam delivery.", code: `openapi: 3.2.1
info: { title: Quíron Webhook Fixture, version: 1.0.0 }
paths: {}
webhooks:
  reservationEvent:
    post:
      operationId: receiveReservationEvent
      parameters:
        - { name: X-Quiron-Event-Id, in: header, required: true, schema: { type: string } }
        - { name: X-Quiron-Timestamp, in: header, required: true, schema: { type: string } }
        - { name: X-Quiron-Signature, in: header, required: true, schema: { type: string } }
      requestBody:
        required: true
        content: { application/json: { schema: { type: object, additionalProperties: false, required: [eventId, eventType, occurredAt, data], properties: { eventId: { type: string }, eventType: { const: reservation.confirmed.v1 }, occurredAt: { type: string, format: date-time }, data: { type: object } } } } }
      responses: { "204": { description: Recorded idempotently }, "400": { description: Invalid event }, "401": { description: Invalid signature }, "410": { description: Subscription gone }, "429": { description: Retry later }, "5XX": { description: Transient failure } }` },
    { lang: "bash", purpose: "Entrega o mesmo eventId antes e depois de kill/timeout e comprova inbox e efeito únicos.", code: `set -euo pipefail
event=evt_fixture_001; ./fixtures/webhook-consumer start --verify-signature --inbox-db fixture.db
./fixtures/webhook-provider enqueue --event-id "$event" --type reservation.confirmed.v1 --fixture reservation.json
./fixtures/webhook-consumer arm --kill after-effect-before-ack
./fixtures/webhook-provider deliver --event-id "$event" --max-attempts 4 --backoff-ms 20 || true
./fixtures/webhook-consumer start --verify-signature --inbox-db fixture.db
./fixtures/webhook-provider resume --event-id "$event"
./fixtures/query-webhook-evidence --event-id "$event" | jq -e '.deliveries >= 2 and .inboxRows == 1 and .businessEffects == 1' >/dev/null
./fixtures/webhook-consumer replay --event-id "$event" | jq -e '.accepted == false and .reason == "duplicate"' >/dev/null` },
  ],
  "API keys, Basic e Bearer": [
    { lang: "yaml", purpose: "Declara mecanismos distintos e usa alternativas explícitas sem sugerir que API key substitui identidade de usuário.", code: `openapi: 3.2.1
info: { title: Quíron Authentication Fixture, version: 1.0.0 }
components:
  securitySchemes:
    partnerKey:
      type: apiKey
      in: header
      name: X-Partner-Key
      description: Chave de integração rotacionável; nunca identifica o usuário final.
    bearerAccess:
      type: http
      scheme: bearer
      bearerFormat: JWT
    legacyBasic:
      type: http
      scheme: basic
      description: Restrito ao endpoint de migração e protegido por TLS e rate limit dedicado.
security: [{ bearerAccess: [] }]
paths:
  /partner/catalog:
    get:
      security: [{ partnerKey: [] }, { bearerAccess: [] }]
      responses: { "200": { description: Catalog visible to either trusted credential } }
  /legacy/import:
    post:
      security: [{ legacyBasic: [] }]
      responses: { "202": { description: Import accepted }, "401": { description: Missing or invalid credentials } }` },
    { lang: "bash", purpose: "Exercita credenciais ausentes, malformadas, expiradas e revogadas, sem registrar segredo nem aceitar efeito proibido.", code: `set -euo pipefail
probe () { name="$1"; token="$2"; expected="$3"; code="$(curl -sS -o "$name.json" -w '%{http_code}' -H "Authorization: Bearer $token" "$BASE_URL/reservations")"; test "$code" = "$expected"; }
probe absent '' 401
probe malformed 'not-a-token' 401
probe expired "$EXPIRED_TOKEN" 401
probe revoked "$REVOKED_TOKEN" 401
probe wrong_audience "$WRONG_AUDIENCE_TOKEN" 401
probe valid "$FIXTURE_TOKEN" 200
! rg -n "$FIXTURE_TOKEN|$EXPIRED_TOKEN|$REVOKED_TOKEN" logs/ responses/ || { echo 'credential leaked'; exit 1; }
./fixtures/query-auth-evidence --since fixture-start | jq -e '.forbiddenWrites == 0 and .rawCredentialsLogged == 0' >/dev/null` },
  ],
  "OAuth 2.0 e OIDC": [
    { lang: "yaml", purpose: "Documenta authorization code com PKCE, client credentials e descoberta OIDC com scopes de negócio estáveis.", code: `openapi: 3.2.1
info: { title: Quíron OAuth Fixture, version: 1.0.0 }
components:
  securitySchemes:
    interactiveOAuth:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://identity.example.invalid/oauth2/authorize
          tokenUrl: https://identity.example.invalid/oauth2/token
          refreshUrl: https://identity.example.invalid/oauth2/token
          scopes:
            reservations:read: Read reservations visible to the subject
            reservations:write: Create or cancel reservations
    serviceOAuth:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://identity.example.invalid/oauth2/token
          scopes: { catalog:read: Read the partner catalog }
    workforceOidc:
      type: openIdConnect
      openIdConnectUrl: https://identity.example.invalid/.well-known/openid-configuration
paths:
  /reservations:
    get:
      security: [{ interactiveOAuth: ["reservations:read"] }]
      responses: { "200": { description: Subject-scoped reservations } }` },
    { lang: "typescript", purpose: "Separa validação criptográfica de claims e prova rejeição de issuer, audience, tempo, nonce e escopo incorretos.", code: `type Claims = { iss: string; aud: string | string[]; exp: number; nbf?: number; scope?: string; nonce?: string };
function authorize(claims: Claims, now: number, requiredScope: string, expectedNonce?: string): void {
  if (claims.iss !== "https://identity.example.invalid/") throw new Error("issuer");
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes("quiron-api")) throw new Error("audience");
  if (claims.exp <= now || (claims.nbf !== undefined && claims.nbf > now + 30)) throw new Error("time");
  if (!new Set((claims.scope ?? "").split(/ +/)).has(requiredScope)) throw new Error("scope");
  if (expectedNonce !== undefined && claims.nonce !== expectedNonce) throw new Error("nonce");
}
const now = 1_800_000_000;
authorize({ iss: "https://identity.example.invalid/", aud: ["quiron-api"], exp: now + 300, scope: "reservations:read reservations:write", nonce: "fixture-nonce" }, now, "reservations:write", "fixture-nonce");
for (const claim of [{ iss: "https://attacker.invalid/", aud: "quiron-api", exp: now + 1, scope: "reservations:write" }, { iss: "https://identity.example.invalid/", aud: "other", exp: now + 1, scope: "reservations:write" }]) { try { authorize(claim, now, "reservations:write"); throw new Error("accepted_invalid_claims"); } catch (error) { if ((error as Error).message === "accepted_invalid_claims") throw error; } }` },
  ],
  "Security requirements": [
    { lang: "yaml", purpose: "Torna visíveis herança, OR entre alternativas, AND dentro da alternativa e liberação pública deliberada.", code: `openapi: 3.2.1
info: { title: Quíron Security Requirements Fixture, version: 1.0.0 }
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
    partnerKey: { type: apiKey, in: header, name: X-Partner-Key }
    requestSignature: { type: apiKey, in: header, name: X-Request-Signature }
security: [{ bearerAuth: [] }]
paths:
  /health:
    get:
      security: []
      responses: { "200": { description: Deliberately public liveness only } }
  /reservations:
    get:
      security: [{ bearerAuth: [] }, { partnerKey: [], requestSignature: [] }]
      responses: { "200": { description: Bearer OR partner key AND signature } }
  /admin/reconciliation:
    post:
      security: [{ bearerAuth: ["admin:reconcile"] }]
      responses: { "202": { description: Authorized reconciliation accepted }, "403": { description: Authenticated without required authority } }` },
    { lang: "typescript", purpose: "Avalia a tabela verdade OR/AND e falha fechado quando um esquema é desconhecido ou não foi resolvido.", code: `type Requirement = Record<string, string[]>;
type Credential = { valid: boolean; scopes: Set<string> };
function satisfies(requirements: Requirement[] | undefined, credentials: Record<string, Credential>): boolean {
  if (requirements === undefined) throw new Error("security inheritance must be resolved first");
  if (requirements.length === 0) return true;
  return requirements.some((alternative) => {
    const entries = Object.entries(alternative);
    if (entries.length === 0) return true;
    return entries.every(([scheme, scopes]) => {
      const credential = credentials[scheme];
      return credential?.valid === true && scopes.every((scope) => credential.scopes.has(scope));
    });
  });
}
const bearer = { bearerAuth: { valid: true, scopes: new Set(["reservations:read"]) } };
if (!satisfies([{ bearerAuth: ["reservations:read"] }, { partnerKey: [], requestSignature: [] }], bearer)) throw new Error("valid bearer rejected");
if (satisfies([{ partnerKey: [], requestSignature: [] }], { partnerKey: { valid: true, scopes: new Set() } })) throw new Error("AND weakened to OR");
if (!satisfies([], {})) throw new Error("explicit public operation rejected");` },
  ],
  "Autorização, tenancy e dados": [
    { lang: "yaml", purpose: "Documenta escopo e respostas sem prometer que o contrato substitui política de objeto, tenant ou banco.", code: `openapi: 3.2.1
info: { title: Quíron Authorization Fixture, version: 1.0.0 }
components:
  securitySchemes:
    oauth: { type: oauth2, flows: { clientCredentials: { tokenUrl: https://identity.example.invalid/oauth2/token, scopes: { "reservations:read": Read permitted reservations } } } }
  schemas:
    Problem: { type: object, required: [status, code], properties: { status: { type: integer }, code: { type: string } } }
  responses:
    Problem: { description: Policy-safe error, content: { application/problem+json: { schema: { $ref: "#/components/schemas/Problem" } } } }
paths:
  /reservations/{reservationId}:
    get:
      security: [{ oauth: ["reservations:read"] }]
      parameters: [{ name: reservationId, in: path, required: true, schema: { type: string } }]
      responses:
        "200": { description: Reservation visible under subject and tenant policy }
        "401": { $ref: "#/components/responses/Problem" }
        "403": { $ref: "#/components/responses/Problem" }
        "404": { $ref: "#/components/responses/Problem" }
        "409": { $ref: "#/components/responses/Problem" }` },
    { lang: "bash", purpose: "Cruza dois tenants, referência direta e cache aquecido para provar ausência de leitura e efeitos entre fronteiras.", code: `set -euo pipefail
id_a="$(./fixtures/create-reservation --tenant tenant-a --owner alice | jq -r .reservationId)"
token_a="$(./fixtures/token --tenant tenant-a --subject alice --scope reservations:read)"
token_b="$(./fixtures/token --tenant tenant-b --subject bob --scope reservations:read)"
test "$(curl -sS -o own.json -w '%{http_code}' -H "Authorization: Bearer $token_a" "$BASE_URL/reservations/$id_a")" = 200
for attempt in 1 2; do code="$(curl -sS -o foreign-$attempt.json -w '%{http_code}' -H "Authorization: Bearer $token_b" "$BASE_URL/reservations/$id_a")"; test "$code" = 404; done
! rg -n 'tenant-a|alice|seat|payment' foreign-*.json
./fixtures/direct-repository-read --tenant tenant-b --reservation "$id_a" | jq -e '.rows == 0' >/dev/null
./fixtures/query-authz-evidence --reservation "$id_a" --requester tenant-b | jq -e '.rowsDisclosed == 0 and .writes == 0 and .outboxEvents == 0 and .cacheLeaks == 0' >/dev/null` },
  ],
  "Examples e fixtures": [
    { lang: "yaml", purpose: "Mantém exemplos nomeados de sucesso e conflito junto ao media type e com dados totalmente sintéticos.", code: `openapi: 3.2.1
info: { title: Quíron Examples Fixture, version: 1.0.0 }
paths:
  /reservations:
    post:
      operationId: reserveSeat
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: "#/components/schemas/ReservationRequest" }
            examples:
              minimumQuantity:
                summary: Smallest accepted reservation
                value: { showId: show_fixture_01, quantity: 1 }
      responses:
        "409":
          description: No seat can be committed
          content:
            application/problem+json:
              examples:
                soldOut: { value: { type: "https://errors.example.invalid/sold-out", title: Sold out, status: 409, code: sold_out } }
components:
  schemas:
    ReservationRequest: { type: object, additionalProperties: false, required: [showId, quantity], properties: { showId: { type: string }, quantity: { type: integer, minimum: 1, maximum: 8 } } }` },
    { lang: "typescript", purpose: "Extrai fixtures determinísticas, valida invariantes semânticos e rejeita segredo ou domínio não reservado antes da publicação.", code: `type Fixture = { operationId: string; status: number; value: Record<string, unknown> };
const forbidden = /(bearer\\s+[a-z0-9._-]+|BEGIN (?:RSA |EC )?PRIVATE KEY|@[a-z0-9.-]+\\.[a-z]{2,})/i;
function inspect(fixture: Fixture): void {
  const bytes = JSON.stringify(fixture.value);
  if (forbidden.test(bytes)) throw new Error("secret_or_pii");
  if (/https?:\\/\\//.test(bytes) && !bytes.includes(".invalid")) throw new Error("non_reserved_host");
  if (fixture.status >= 400 && fixture.value.status !== fixture.status) throw new Error("problem_status_mismatch");
  if (fixture.operationId === "reserveSeat" && fixture.status === 201 && typeof fixture.value.reservationId !== "string") throw new Error("missing_reservation_id");
}
inspect({ operationId: "reserveSeat", status: 409, value: { type: "https://errors.example.invalid/sold-out", status: 409, code: "sold_out" } });` },
  ],
  "Descriptions e Markdown": [
    { lang: "yaml", purpose: "Escreve semântica operacional portátil, deprecation e retry sem depender de HTML ativo.", code: `openapi: 3.2.1
info:
  title: Quíron Descriptions Fixture
  version: 1.0.0
  description: |
    API de reservas para a sandbox Quíron. Consulte o [guia versionado](https://docs.example.invalid/quiron/1.0/guide).
paths:
  /reservations/{reservationId}:
    get:
      summary: Read one visible reservation
      description: |
        Retorna somente recurso visível ao principal e ao tenant autenticados.

        A resposta \`404\` também representa recurso existente, porém não visível. Não faça retry automático de \`404\`.
      deprecated: true
      parameters: [{ name: reservationId, in: path, required: true, description: Identificador opaco; não concede acesso., schema: { type: string } }]
      responses:
        "200": { description: Representation visible under the current policy. }
        "404": { description: Missing or intentionally undisclosed. }
      externalDocs: { description: Migration to reservation queries, url: https://docs.example.invalid/quiron/1.0/migrate-reservation-read }` },
    { lang: "typescript", purpose: "Bloqueia HTML e esquemas de URL ativos e confirma que links permanecem em hosts documentais permitidos.", code: `const descriptions = [
  "Use [migration](https://docs.example.invalid/quiron/1.0/migrate). Retry only after \`Retry-After\`.",
  "A resposta 404 também cobre recurso não visível ao principal.",
];
function lintMarkdown(markdown: string): string[] {
  const errors: string[] = [];
  if (/<\\/?[a-z][^>]*>/i.test(markdown)) errors.push("raw_html");
  if (/\\]\\((?:javascript|data):/i.test(markdown)) errors.push("active_url");
  for (const match of markdown.matchAll(/https?:\\/\\/([^/)]+)/g)) if (match[1] !== "docs.example.invalid") errors.push("external_host");
  if (/TODO|lorem ipsum|tente novamente\\.?$/i.test(markdown)) errors.push("placeholder_or_ambiguous_retry");
  return errors;
}
for (const description of descriptions) { const errors = lintMarkdown(description); if (errors.length) throw new Error(errors.join(",")); }
if (!lintMarkdown("[click](javascript:alert(1))").includes("active_url")) throw new Error("mutant survived");` },
  ],
  "Swagger UI e try-it-out": [
    { lang: "typescript", purpose: "Configura UI somente para sandbox, sem persistir autorização ou consultar validator externo.", code: `type Environment = "sandbox" | "production";
function swaggerUiConfig(environment: Environment) {
  const sandbox = environment === "sandbox";
  return {
    url: "/artifacts/quiron-openapi.sha256-pinned.json",
    validatorUrl: null,
    persistAuthorization: false,
    supportedSubmitMethods: sandbox ? ["get", "post", "put", "delete"] : [],
    requestInterceptor(request: { url: string; headers: Record<string, string> }) {
      const target = new URL(request.url);
      if (target.origin !== "https://sandbox-api.example.invalid") throw new Error("destination_not_allowed");
      request.headers["X-Documentation-Client"] = "quiron-portal";
      return request;
    },
  };
}
const production = swaggerUiConfig("production");
if (production.supportedSubmitMethods.length !== 0 || production.persistAuthorization) throw new Error("unsafe production UI");` },
    { lang: "bash", purpose: "Inspeciona headers, config e bundle efetivos e falha se produção puder executar ou persistir credencial.", code: `set -euo pipefail
curl -fsS -D ui.headers "$DOCS_URL/" -o ui.html
curl -fsS "$DOCS_URL/config.json" -o config.json
curl -fsS "$DOCS_URL/artifacts/quiron-openapi.json" -o openapi.json
jq -e '.validatorUrl == null and .persistAuthorization == false and (.supportedSubmitMethods | length == 0)' config.json >/dev/null
rg -i '^content-security-policy:.*default-src' ui.headers >/dev/null
rg -i '^x-content-type-options:.*nosniff' ui.headers >/dev/null
! rg -i 'clientSecret|authorization:|api[_-]?key' ui.html config.json openapi.json
test "$(jq -r .info.version openapi.json)" = "1.0.0"
sha256sum -c artifacts/quiron-openapi.json.sha256` },
  ],
  "Portais e descoberta": [
    { lang: "json", purpose: "Publica metadados de catálogo versionados com owner, lifecycle, classificação e digest canônico.", code: `{
  "catalogVersion": 1,
  "apis": [
    {
      "id": "quiron-reservations",
      "name": "Quíron Reservations API",
      "domain": "ticketing",
      "audience": ["partner"],
      "lifecycle": "stable",
      "apiVersion": "1.0",
      "documentVersion": "1.0.0",
      "owner": "team-ticketing-platform",
      "dataClassification": "confidential",
      "artifact": "registry.example.invalid/apis/quiron-reservations@sha256:SUBSTITUA_PELO_DIGEST",
      "support": "https://support.example.invalid/catalog/quiron-reservations",
      "changelog": "https://docs.example.invalid/quiron/1.0/changelog"
    }
  ]
}` },
    { lang: "bash", purpose: "Compara busca por perfis, deep link e download por digest para impedir descoberta privada e latest mutável.", code: `set -euo pipefail
curl -fsS "$PORTAL_URL/api/search?q=reservation" -o anonymous.json
curl -fsS -H "Authorization: Bearer $PARTNER_TOKEN" "$PORTAL_URL/api/search?q=reservation" -o partner.json
jq -e 'all(.results[]; .visibility == "public")' anonymous.json >/dev/null
jq -e '.results[] | select(.id == "quiron-reservations") | .lifecycle == "stable" and (.artifact | contains("@sha256:"))' partner.json >/dev/null
artifact="$(jq -r '.results[] | select(.id == "quiron-reservations") | .artifact' partner.json)"
digest="\${artifact##*@sha256:}"
curl -fsS -H "Authorization: Bearer $PARTNER_TOKEN" "$PORTAL_URL/api/artifacts/$digest" -o downloaded.json
test "$(sha256sum downloaded.json | cut -d' ' -f1)" = "$digest"
! rg -i 'private-admin|internal-only' anonymous.json` },
  ],
  "Parsing e validação estrutural": [
    { lang: "json", purpose: "Representa manifest reproduzível do gate estrutural, incluindo dialeto, artifact, limites e ferramentas fixadas.", code: `{
  "entrypoint": "contracts/openapi.yaml",
  "canonicalArtifact": "build/quiron-openapi.bundle.json",
  "openapiTarget": "3.2.1",
  "defaultDialect": "https://spec.openapis.org/oas/3.2/dialect/base",
  "network": "deny",
  "limits": { "maximumBytes": 4194304, "maximumDepth": 80, "maximumAliases": 20, "maximumReferences": 5000, "timeoutMs": 30000 },
  "tools": {
    "yamlParser": { "name": "project-parser", "version": "PINNED_BY_LOCKFILE" },
    "openapiValidator": { "name": "project-validator", "version": "PINNED_BY_LOCKFILE" }
  },
  "expected": { "duplicateKeys": "error", "unknownDialect": "error", "remoteReferences": "locked-only" }
}` },
    { lang: "bash", purpose: "Executa parsing, resolução e validação em dois diretórios e prova rejeição de refs e YAML hostis.", code: `set -euo pipefail
for work in build-a build-b; do
  rm -rf "$work"; mkdir "$work"
  ./tools/openapi-validate --entry contracts/openapi.yaml --offline --strict-yaml --output "$work/bundle.json" --diagnostics "$work/diagnostics.json"
done
cmp build-a/bundle.json build-b/bundle.json
test "$(jq -r .openapi build-a/bundle.json)" = "3.2.1"
for bad in duplicate-key unknown-dialect missing-ref alias-bomb private-uri; do
  if ./tools/openapi-validate --entry "fixtures/invalid/$bad.yaml" --offline --strict-yaml --output rejected.json; then echo "accepted $bad"; exit 1; fi
done
! rg -n 'C:\\Users|/home/|authorization:' build-a/diagnostics.json` },
  ],
  "Style guides e Spectral": [
    { lang: "yaml", purpose: "Define ruleset organizacional com regras críticas e function customizada versionada, sem extensão remota flutuante.", code: `extends:
  - ["./rulesets/openapi-core-1.4.0.yaml", recommended]
formats: [oas3_1]
functionsDir: ./functions
functions: [securityTruthTable]
rules:
  operation-operationId-unique: error
  operation-tags: error
  oas3-api-servers: error
  no-api-keys-in-query: error
  no-eval-in-markdown: error
  quiron-security-truth-table:
    description: Every operation has an approved resolved authentication alternative.
    severity: error
    given: "$.paths[*][get,post,put,patch,delete]"
    then:
      function: securityTruthTable
  quiron-problem-response:
    description: Error responses use the safe reusable Problem representation.
    severity: error
    given: "$.paths[*][*].responses[?(@property >= '400')]"
    then: { field: content.application/problem+json, function: truthy }` },
    { lang: "bash", purpose: "Prova cada regra com corpus mutante e impede waiver amplo, expirado ou sem owner.", code: `set -euo pipefail
./tools/ruleset-verify --ruleset rulesets/quiron.yaml --corpus fixtures/lint-corpus --require-mutant-per-critical-rule --report lint-corpus.json
jq -e '.criticalRules > 0 and .survivingMutants == 0 and .unexpectedDiagnostics == 0' lint-corpus.json >/dev/null
./tools/waiver-validate --file contracts/lint-waivers.json --today 2026-09-20 --require-owner --forbid-wildcards
./tools/spectral lint --ruleset rulesets/quiron.yaml --format json contracts/openapi.bundle.json > lint-result.json
jq -e '[.[] | select(.severity == 0)] | length == 0' lint-result.json >/dev/null
if ./tools/waiver-validate --file fixtures/invalid/wildcard-waiver.json --today 2026-09-20; then exit 1; fi
sha256sum rulesets/quiron.yaml lint-result.json > lint-evidence.sha256` },
  ],
  "Contract tests de requests e responses": [
    { lang: "typescript", purpose: "Expressa um cenário contratual que valida boundary e efeito independente, não apenas o status HTTP.", code: `type Evidence = { status: number; contentType: string; body: unknown; rows: number; outboxEvents: number };
type Scenario = { operationId: string; request: { method: string; path: string; headers: Record<string, string>; body: unknown }; assert(evidence: Evidence): void };
const reserveSeat: Scenario = {
  operationId: "reserveSeat",
  request: { method: "POST", path: "/reservations", headers: { "content-type": "application/json", "idempotency-key": "fixture-contract-001" }, body: { showId: "show_fixture", quantity: 1 } },
  assert(evidence) {
    if (evidence.status !== 201) throw new Error("unexpected status");
    if (evidence.contentType !== "application/json") throw new Error("unexpected content type");
    if (evidence.rows !== 1 || evidence.outboxEvents !== 1) throw new Error("effect mismatch");
  },
};
if (reserveSeat.operationId !== "reserveSeat" || reserveSeat.request.method !== "POST") throw new Error("invalid scenario");` },
    { lang: "bash", purpose: "Executa sucesso, rejeição e retry observando response, banco e outbox com a mesma chave idempotente.", code: `set -euo pipefail
key=contract-fixture-001
curl -fsS -D first.headers -X POST "$BASE_URL/reservations" -H "Authorization: Bearer $FIXTURE_TOKEN" -H "Idempotency-Key: $key" -H 'Content-Type: application/json' -d '{"showId":"show_fixture","quantity":1}' > first.json
curl -fsS -D retry.headers -X POST "$BASE_URL/reservations" -H "Authorization: Bearer $FIXTURE_TOKEN" -H "Idempotency-Key: $key" -H 'Content-Type: application/json' -d '{"showId":"show_fixture","quantity":1}' > retry.json
cmp first.json retry.json
test "$(curl -sS -o invalid.json -w '%{http_code}' -X POST "$BASE_URL/reservations" -H "Authorization: Bearer $FIXTURE_TOKEN" -H 'Content-Type: application/json' -d '{"showId":"show_fixture","quantity":0,"extra":true}')" = 400
./fixtures/query-evidence --idempotency-key "$key" | jq -e '.rows == 1 and .outboxEvents == 1 and .providerEffects == 1' >/dev/null
./fixtures/query-evidence --scenario invalid | jq -e '.writes == 0 and .outboxEvents == 0' >/dev/null` },
  ],
  "Fuzzing e property-based": [
    { lang: "typescript", purpose: "Gera fronteiras determinísticas e valida propriedades de quantidade, tenant e idempotência com seed registrável.", code: `type ReservationInput = { showId: string; quantity: number; note?: string };
function* boundaryCases(): Generator<ReservationInput> {
  for (const quantity of [1, 2, 7, 8]) {
    for (const note of [undefined, "", "é", "e\u0301", "x".repeat(120)]) yield { showId: "show_fixture", quantity, note };
  }
}
function assertInput(value: ReservationInput): void {
  if (!/^show_[a-z0-9_]+$/.test(value.showId)) throw new Error("showId");
  if (!Number.isInteger(value.quantity) || value.quantity < 1 || value.quantity > 8) throw new Error("quantity");
  if (value.note !== undefined && [...value.note].length > 120) throw new Error("note");
}
let generated = 0;
for (const value of boundaryCases()) { assertInput(value); generated += 1; }
if (generated !== 20) throw new Error("boundary corpus changed without review");
for (const invalid of [0, 9, 1.5, Number.NaN]) { try { assertInput({ showId: "show_fixture", quantity: invalid }); throw new Error("mutant survived"); } catch (error) { if ((error as Error).message === "mutant survived") throw error; } }` },
    { lang: "bash", purpose: "Roda campanha limitada e reproduzível, salva mínimos e afirma ausência de crashes, 5xx e efeitos proibidos.", code: `set -euo pipefail
seed=180020260920; mkdir -p fuzz-results
./tools/openapi-fuzz --contract contracts/openapi.bundle.json --base-url "$BASE_URL" --token "$FUZZ_TOKEN" --seed "$seed" --cases 2000 --max-depth 8 --timeout-ms 1000 --output fuzz-results/run.json
jq -e '.seed == 180020260920 and .crashes == 0 and .hangs == 0 and .unexpected5xx == 0 and .invalidAccepted == 0' fuzz-results/run.json >/dev/null
./fixtures/query-fuzz-evidence --run "$seed" | jq -e '.crossTenantReads == 0 and .forbiddenWrites == 0 and .duplicateEffects == 0' >/dev/null
if jq -e '.failures | length > 0' fuzz-results/run.json >/dev/null; then ./tools/openapi-fuzz-reproduce --contract contracts/openapi.bundle.json --case fuzz-results/minimum.json --base-url "$BASE_URL"; exit 1; fi
sha256sum contracts/openapi.bundle.json fuzz-results/run.json > fuzz-results/evidence.sha256` },
  ],
  "Breaking changes": [
    { lang: "json", purpose: "Registra uma mudança incompatível com perspectiva, witness, consumers e plano de coexistência verificável.", code: `{
  "changeId": "quiron-reservation-quantity-narrowing",
  "beforeDigest": "sha256:BEFORE",
  "afterDigest": "sha256:AFTER",
  "classification": "breaking",
  "perspective": "request-consumer-to-provider",
  "pointer": "/components/schemas/ReservationRequest/properties/quantity/maximum",
  "before": 8,
  "after": 4,
  "witness": { "showId": "show_fixture", "quantity": 8 },
  "affectedConsumers": ["partner-checkout-v1"],
  "migration": { "coexistUntil": "2027-03-31", "successor": "split-reservation-workflow", "rollbackArtifact": "sha256:BEFORE" },
  "approvals": ["api-owner", "consumer-owner"]
}` },
    { lang: "bash", purpose: "Executa semantic diff, valida witness antigo e roda consumer anterior contra canary antes de permitir promoção.", code: `set -euo pipefail
./tools/openapi-diff --before artifacts/v1.json --after artifacts/v2.json --rules rules/compatibility.yaml --json > compatibility.json
jq -e '.changes[] | select(.pointer | contains("quantity/maximum")) | .severity == "breaking" and .perspective == "request"' compatibility.json >/dev/null
./tools/schema-validate --schema artifacts/v1.json#/components/schemas/ReservationRequest --instance fixtures/quantity-eight.json
if ./tools/schema-validate --schema artifacts/v2.json#/components/schemas/ReservationRequest --instance fixtures/quantity-eight.json; then exit 1; fi
./consumers/partner-checkout-v1/smoke --base-url "$CANARY_V1_URL" --contract-digest sha256:BEFORE
./consumers/partner-checkout-v1/smoke --base-url "$COEXISTENCE_URL" --expect-version v1
jq -e '.unapprovedBreaking == 0' compatibility.json >/dev/null` },
  ],
  "Mudanças aditivas perigosas": [
    { lang: "typescript", purpose: "Implementa fallback explícito para enum futuro sem confirmar sucesso nem perder o valor bruto observado.", code: `type KnownStatus = "pending" | "confirmed" | "rejected";
type DecodedStatus = { kind: "known"; value: KnownStatus } | { kind: "unknown"; raw: string };
function decodeStatus(value: unknown): DecodedStatus {
  if (value === "pending" || value === "confirmed" || value === "rejected") return { kind: "known", value };
  if (typeof value === "string" && value.length <= 64) return { kind: "unknown", raw: value };
  throw new Error("invalid_status_shape");
}
function mayIssueTicket(status: DecodedStatus): boolean {
  return status.kind === "known" && status.value === "confirmed";
}
const future = decodeStatus("awaiting_manual_review");
if (future.kind !== "unknown" || mayIssueTicket(future)) throw new Error("unsafe future enum handling");
if (!mayIssueTicket(decodeStatus("confirmed"))) throw new Error("known value regressed");` },
    { lang: "bash", purpose: "Injeta campo, enum, subtype e status futuros em SDK antigo e exige fallback seguro e limitado.", code: `set -euo pipefail
for fixture in response-new-field response-new-enum response-new-subtype response-new-status; do
  ./consumers/sdk-v1-fixture decode "fixtures/evolution/$fixture.json" --result "results/$fixture.json"
  jq -e '.crashed == false and .privilegedEffect == false and .memoryBytes < 16777216' "results/$fixture.json" >/dev/null
done
jq -e '.classification == "unknown" and .rawStatus == "awaiting_manual_review"' results/response-new-enum.json >/dev/null
jq -e '.classification == "unknown_outcome" and .httpStatus == 299' results/response-new-status.json >/dev/null
./tools/openapi-diff --before artifacts/v1.json --after artifacts/additive.json --consumer-risk > additive-risk.json
jq -e '.changes | any(.kind == "enum-value-added" and .consumerRisk == "review")' additive-risk.json >/dev/null` },
  ],
  "Versionamento e deprecation": [
    { lang: "yaml", purpose: "Mantém v1 deprecada com sucessor e outcomes explícitos enquanto v2 coexiste como versão estável.", code: `openapi: 3.2.1
info: { title: Quíron Reservations API v1, version: 1.9.0 }
servers: [{ url: https://api.example.invalid/v1 }]
paths:
  /reservations/{reservationId}:
    get:
      operationId: getReservationV1
      deprecated: true
      description: Deprecated; migrate to v2 before 2027-03-31 using the linked guide.
      externalDocs: { description: v1 to v2 migration, url: https://docs.example.invalid/quiron/migrations/v1-v2 }
      parameters: [{ name: reservationId, in: path, required: true, schema: { type: string } }]
      responses:
        "200":
          description: Legacy representation; runtime also emits Deprecation, Sunset and Link headers.
          headers:
            Deprecation: { required: true, schema: { type: string } }
            Sunset: { required: true, schema: { type: string } }
            Link: { required: true, schema: { type: string } }
        "410": { description: Version retired after the governed sunset window. }` },
    { lang: "bash", purpose: "Verifica coexistência, sinais de deprecation, isolamento de cache e rollback antes do sunset.", code: `set -euo pipefail
for version in v1 v2; do curl -fsS -D "$version.headers" -H "Authorization: Bearer $FIXTURE_TOKEN" "$BASE_URL/$version/reservations/res_fixture" -o "$version.json"; done
rg -i '^deprecation:' v1.headers >/dev/null
rg -i '^sunset:.*2027' v1.headers >/dev/null
rg -i '^link:.*rel="successor-version"' v1.headers >/dev/null
! rg -i '^deprecation:' v2.headers
test "$(jq -r .apiVersion v1.json)" = "v1"; test "$(jq -r .apiVersion v2.json)" = "v2"
./fixtures/cache-evidence --resource res_fixture | jq -e '.v1Key != .v2Key and .crossVersionHits == 0' >/dev/null
./tools/lifecycle-check --record lifecycle/quiron-reservations.json --require-telemetry --require-successor --as-of 2026-09-20
./tools/gateway-rollback --dry-run --to-digest sha256:V1_STABLE` },
  ],
  "Consumer-driven contracts": [
    { lang: "json", purpose: "Define interação de consumidor com provider state declarativo e matchers estreitos para resposta e efeito.", code: `{
  "consumer": { "name": "partner-checkout", "version": "1.8.2" },
  "provider": { "name": "quiron-reservations" },
  "interaction": {
    "description": "read a confirmed reservation visible to the partner tenant",
    "providerState": { "name": "confirmed reservation exists", "parameters": { "tenant": "tenant-fixture", "reservationId": "res_fixture" } },
    "request": { "method": "GET", "path": "/reservations/res_fixture", "headers": { "Accept": "application/json" } },
    "response": {
      "status": 200,
      "headers": { "Content-Type": "application/json" },
      "body": { "reservationId": "res_fixture", "status": "confirmed", "quantity": 1 },
      "matchingRules": { "$.reservationId": { "match": "regex", "regex": "^res_[A-Za-z0-9_]+$" }, "$.quantity": { "match": "integer", "minimum": 1 } }
    },
    "effects": { "databaseWrites": 0, "providerCalls": 0 }
  }
}` },
    { lang: "bash", purpose: "Valida pacto contra OpenAPI, verifica provider real e consulta matriz assinada de implantação.", code: `set -euo pipefail
./tools/contract-validate --pact pacts/partner-checkout-1.8.2.json --openapi artifacts/quiron-openapi.json --strict
./tools/provider-verify --provider quiron-reservations --base-url "$PROVIDER_URL" --pact pacts/partner-checkout-1.8.2.json --states fixtures/provider-states.json --observer fixtures/effect-observer --output provider-result.json
jq -e '.interactions.failed == 0 and .effects.failed == 0 and .openapiViolations == 0' provider-result.json >/dev/null
./tools/pact-publish --file pacts/partner-checkout-1.8.2.json --provenance provenance.json --tag production
./tools/can-i-deploy --provider quiron-reservations --version "$PROVIDER_BUILD" --environment production --output matrix.json
jq -e '.allowed == true and (.verifiedConsumers | index("partner-checkout@1.8.2")) != null' matrix.json >/dev/null
sha256sum pacts/partner-checkout-1.8.2.json provider-result.json matrix.json > cdc-evidence.sha256` },
  ],
  "Clientes gerados": [
    { lang: "json", purpose: "Fixa todos os inputs do SDK e defaults seguros sem credencial ou endpoint produtivo embutidos.", code: `{
  "contract": "artifacts/quiron-openapi.json",
  "contractDigest": "sha256:CONTRACT",
  "generator": { "name": "openapi-generator-cli", "version": "PINNED_BY_LOCKFILE", "digest": "sha256:GENERATOR" },
  "target": { "language": "typescript", "runtime": "node20", "packageName": "@example/quiron-reservations", "packageVersion": "1.0.0" },
  "options": { "supportsES6": true, "useSingleRequestParameter": true, "enumUnknownDefaultCase": true, "withoutRuntimeChecks": false },
  "defaults": { "baseUrl": "https://sandbox-api.example.invalid", "persistAuthorization": false, "retryUnsafeMethods": false },
  "templates": { "source": "official", "digest": "sha256:TEMPLATES" }
}` },
    { lang: "bash", purpose: "Gera duas vezes, compila, empacota e executa smoke de wire e efeitos contra sandbox controlada.", code: `set -euo pipefail
for dir in sdk-a sdk-b; do rm -rf "$dir"; ./tools/generate-sdk --manifest generation/ts-client.json --output "$dir" --offline; done
diff -ru sdk-a sdk-b
(cd sdk-a && npm ci --ignore-scripts && npm run typecheck && npm test && npm pack --json > pack.json)
! rg -i 'bearer [a-z0-9._-]+|clientsecret|api[_-]?key\s*[:=]' sdk-a
./tools/sdk-smoke --package sdk-a --base-url "$SDK_SANDBOX_URL" --token-provider fixtures/token-provider --capture sdk-wire.json --scenarios fixtures/sdk-scenarios.json
jq -e '.serializationFailures == 0 and .unexpectedRetries == 0 and .crossOriginCredentialLeaks == 0' sdk-wire.json >/dev/null
./fixtures/query-sdk-evidence | jq -e '.duplicateEffects == 0 and .forbiddenWrites == 0' >/dev/null` },
  ],
  "Server stubs e interfaces": [
    { lang: "typescript", purpose: "Separa adapter HTTP gerado de serviço manual e faz implementação ausente falhar fechada.", code: `type Principal = { subject: string; tenantId: string; scopes: Set<string> };
type ReserveCommand = { showId: string; quantity: number; idempotencyKey: string };
type ReserveOutcome = { kind: "created"; reservationId: string } | { kind: "sold_out" } | { kind: "forbidden" };
interface ReservationService { reserve(principal: Principal, command: ReserveCommand): Promise<ReserveOutcome>; }
class MissingReservationService implements ReservationService {
  async reserve(): Promise<ReserveOutcome> { throw Object.assign(new Error("not_implemented"), { status: 501 }); }
}
async function postReservation(service: ReservationService, principal: Principal, input: ReserveCommand) {
  const outcome = await service.reserve(principal, input);
  if (outcome.kind === "created") return { status: 201, headers: { Location: \`/reservations/\${outcome.reservationId}\` }, body: outcome };
  if (outcome.kind === "sold_out") return { status: 409, body: { status: 409, code: "sold_out" } };
  return { status: 404, body: { status: 404, code: "not_found" } };
}
void postReservation(new MissingReservationService(), { subject: "fixture", tenantId: "tenant-a", scopes: new Set(["reservations:write"]) }, { showId: "show_fixture", quantity: 1, idempotencyKey: "fixture" }).catch((error) => { if (error.status !== 501) throw error; });` },
    { lang: "bash", purpose: "Compara inventory do stub com OpenAPI e mata placeholders, bypass de auth e responses fora do contrato.", code: `set -euo pipefail
./tools/generate-server --manifest generation/server.json --output generated-server --offline
(cd generated-server && ./gradlew --offline compileJava test)
./tools/route-inventory --server generated-server --output routes.json
./tools/openapi-operations --contract artifacts/quiron-openapi.json --output operations.json
jq -S '.operations | sort_by(.method,.path)' routes.json > routes.sorted.json
jq -S '.operations | sort_by(.method,.path)' operations.json > operations.sorted.json
cmp routes.sorted.json operations.sorted.json
./tools/stub-blackbox --base-url "$STUB_URL" --contract artifacts/quiron-openapi.json --principals fixtures/principals.json --observer fixtures/effect-observer --output stub-result.json
jq -e '.placeholder200 == 0 and .authBypasses == 0 and .responseViolations == 0 and .forbiddenEffects == 0' stub-result.json >/dev/null` },
  ],
  "Templates e customizações": [
    { lang: "json", purpose: "Registra delta mínimo contra upstream, extensões governadas e corpus obrigatório da customização.", code: `{
  "templatePackage": "quiron-typescript-client-template",
  "version": "2.3.0",
  "upstream": { "generator": "openapi-generator", "version": "PINNED_BY_LOCKFILE", "templateDigest": "sha256:UPSTREAM" },
  "customDigest": "sha256:CUSTOM",
  "modified": [
    { "path": "api.mustache", "reason": "inject a typed token provider instead of a stored token", "owner": "sdk-platform" },
    { "path": "runtime.mustache", "reason": "redact authorization and enforce cross-origin redirect policy", "owner": "security-platform" }
  ],
  "extensions": { "x-quiron-retry-class": { "locations": ["operation"], "values": ["never", "idempotent", "idempotency-key"] } },
  "requiredCorpus": ["reserved-names", "nullable", "one-of", "unicode", "comment-injection", "path-traversal", "auth-redaction"]
}` },
    { lang: "bash", purpose: "Gera corpus hostil, verifica escrita confinada e compara customização com template upstream fixado.", code: `set -euo pipefail
./tools/template-diff --manifest templates/quiron-ts.json --require-upstream-digest --output template-diff.json
jq -e '.untrackedFiles == 0 and .modifiedFiles == 2' template-diff.json >/dev/null
before="$(./tools/tree-digest --exclude generated .)"
./tools/template-corpus --manifest templates/quiron-ts.json --fixtures fixtures/template-corpus --output generated --offline --results template-results.json
after="$(./tools/tree-digest --exclude generated .)"; test "$before" = "$after"
jq -e '.compileFailures == 0 and .writesOutsideOutput == 0 and .credentialLeaks == 0 and .survivingMutants == 0' template-results.json >/dev/null
! rg -n 'evil\.\.\/|\*\/.*export|Authorization: Bearer' generated
./tools/template-upgrade-check --manifest templates/quiron-ts.json --candidate-upstream fixtures/upstream-next --output upgrade.json` },
  ],
  "Regeneração e drift": [
    { lang: "json", purpose: "Relaciona inputs e arquivos gerados por digest para que drift seja diagnosticável e reproduzível.", code: `{
  "generationId": "quiron-typescript-client-1.0.0",
  "inputs": {
    "contract": "sha256:CONTRACT",
    "generator": "sha256:GENERATOR",
    "templates": "sha256:TEMPLATES",
    "config": "sha256:CONFIG",
    "toolchain": "node@20/npm@10"
  },
  "environment": { "locale": "C", "timezone": "UTC", "lineEndings": "lf", "network": "deny" },
  "outputs": [
    { "path": "src/apis/ReservationsApi.ts", "digest": "sha256:API" },
    { "path": "src/models/Reservation.ts", "digest": "sha256:MODEL" },
    { "path": "package.json", "digest": "sha256:PACKAGE" }
  ],
  "provenance": "provenance/quiron-typescript-client-1.0.0.json"
}` },
    { lang: "bash", purpose: "Regenera em paths distintos, detecta edição e órfão e compara pacote promovido com provenance.", code: `set -euo pipefail
for dir in regen-a regen-b; do rm -rf "$dir"; LC_ALL=C TZ=UTC ./tools/generate-sdk --manifest generation/ts-client.json --output "$dir" --offline; done
diff -ru regen-a regen-b
./tools/generated-manifest --directory regen-a --output regen-a.manifest.json
./tools/generated-manifest --directory regen-b --output regen-b.manifest.json
cmp regen-a.manifest.json regen-b.manifest.json
cp -R regen-a drift-fixture; printf '\n// manual drift\n' >> drift-fixture/src/apis/ReservationsApi.ts
if ./tools/drift-check --expected regen-a.manifest.json --directory drift-fixture; then exit 1; fi
(cd regen-a && npm ci --ignore-scripts && npm run typecheck && npm test && npm pack)
./tools/provenance-verify --artifact regen-a/*.tgz --statement provenance/quiron-typescript-client-1.0.0.json --expected-contract sha256:CONTRACT` },
  ],
  "Pipeline, artifact e registry": [
    { lang: "yaml", purpose: "Modela promoção do mesmo artifact por digest com gates, assinatura e provenance antes do registry estável.", code: `release:
  name: quiron-reservations-openapi
  sourceCommit: COMMIT_SHA
  artifact: build/quiron-openapi.bundle.json
  mediaType: application/vnd.oai.openapi+json;version=3.2
  stages:
    - { name: resolve-and-validate, network: deny }
    - { name: lint-and-diff, requires: [resolve-and-validate] }
    - { name: contract-and-security-tests, requires: [lint-and-diff] }
    - { name: generate-and-compile, requires: [contract-and-security-tests] }
    - { name: sign-and-publish, requires: [generate-and-compile] }
  registry:
    repository: registry.example.invalid/apis/quiron-reservations
    immutable: true
    channels: [beta, stable]
  provenance:
    predicateType: https://slsa.dev/provenance/v1
    identityPolicy: ci/identity-policy.json
  promotion:
    rebuild: false
    requireSameDigest: true
    approvals: [api-owner, platform-owner]` },
    { lang: "bash", purpose: "Constrói uma vez, assina, publica e promove o mesmo digest, então baixa e verifica por identidade.", code: `set -euo pipefail
./tools/openapi-release build --entry contracts/openapi.yaml --offline --output release
digest="$(sha256sum release/quiron-openapi.json | cut -d' ' -f1)"
./tools/release-gates --artifact release/quiron-openapi.json --manifest release/manifest.json --output release/gates.json
jq -e '.failed == 0 and .pending == 0' release/gates.json >/dev/null
./tools/artifact-sign --artifact release/quiron-openapi.json --identity-token-file "$CI_IDENTITY_TOKEN_FILE" --provenance release/provenance.json
ref="registry.example.invalid/apis/quiron-reservations@sha256:$digest"
./tools/registry-push --ref "$ref" --file release/quiron-openapi.json --signature release/signature.bundle --immutable
./tools/registry-promote --ref "$ref" --channel stable --approval release/approval.json --no-rebuild
./tools/registry-pull --ref "$ref" --output downloaded.json
test "$(sha256sum downloaded.json | cut -d' ' -f1)" = "$digest"
./tools/artifact-verify --artifact downloaded.json --signature release/signature.bundle --policy ci/identity-policy.json` },
  ],
  "Gateways, policy e ownership": [
    { lang: "json", purpose: "Representa plano de gateway revisável com ownership e mudança crítica de segurança visível.", code: `{
  "contractDigest": "sha256:CONTRACT",
  "environment": "sandbox",
  "changes": [
    { "kind": "route-add", "method": "POST", "path": "/reservations", "operationId": "reserveSeat", "owner": "team-ticketing-platform", "risk": "medium" },
    { "kind": "auth-policy", "operationId": "reserveSeat", "before": null, "after": { "issuer": "https://identity.example.invalid/", "audience": "quiron-api", "scopes": ["reservations:write"] }, "owner": "identity-platform", "risk": "critical" },
    { "kind": "rate-limit", "operationId": "reserveSeat", "key": "verified-principal-and-tenant", "requestsPerMinute": 60, "owner": "api-platform", "risk": "medium" }
  ],
  "cors": { "origins": ["https://sandbox-docs.example.invalid"], "credentials": false, "methods": ["POST"] },
  "approvalsRequired": ["team-ticketing-platform", "identity-platform", "api-platform"],
  "rollbackSnapshot": "gateway-snapshots/quiron-before-CONTRACT.json"
}` },
    { lang: "bash", purpose: "Gera, avalia, aplica e reconcilia plano de gateway antes de testar spoof, CORS, auth e rollback.", code: `set -euo pipefail
./tools/gateway-plan --contract artifacts/quiron-openapi.json --desired gateway/desired.json --environment sandbox --output gateway-plan.json
./tools/policy-evaluate --bundle policies/gateway.tar.gz --input gateway-plan.json --output policy-result.json
jq -e '.deny | length == 0' policy-result.json >/dev/null
./tools/gateway-apply --plan gateway-plan.json --approval gateway/approval.json --canary 10 --output apply-result.json
./tools/gateway-export --environment sandbox --output effective.json
./tools/gateway-reconcile --desired gateway/desired.json --effective effective.json --contract-digest sha256:CONTRACT
./fixtures/gateway-security-matrix --base-url "$GATEWAY_URL" --cases fixtures/gateway-cases.json --output traffic-result.json
jq -e '.authBypasses == 0 and .identityHeaderSpoofs == 0 and .corsLeaks == 0 and .unsafeRetries == 0' traffic-result.json >/dev/null
./tools/gateway-rollback --snapshot gateway-snapshots/quiron-before-CONTRACT.json --dry-run` },
  ],
  "Observabilidade e métricas": [
    { lang: "typescript", purpose: "Cria atributos bounded por operationId e redige dados antes de enviar logs, metrics ou traces.", code: `type RequestContext = { operationId: string; routeTemplate: string; contractDigest: string; status: number; authorization?: string; reservationId?: string };
const allowedOperations = new Set(["reserveSeat", "getReservation", "cancelReservation"]);
function telemetry(context: RequestContext) {
  const operation = allowedOperations.has(context.operationId) ? context.operationId : "unmatched";
  return {
    metricLabels: { operation, route: context.routeTemplate, statusClass: \`\${Math.floor(context.status / 100)}xx\`, contract: context.contractDigest.slice(0, 19) },
    log: { operation, route: context.routeTemplate, status: context.status, contractDigest: context.contractDigest },
    trace: { "http.route": context.routeTemplate, "api.operation.id": operation, "api.contract.digest": context.contractDigest },
  };
}
const result = telemetry({ operationId: "reserveSeat", routeTemplate: "/reservations", contractDigest: "sha256:fixture", status: 201, authorization: "Bearer SHOULD_NOT_APPEAR", reservationId: "res_unique" });
const serialized = JSON.stringify(result);
if (serialized.includes("SHOULD_NOT_APPEAR") || serialized.includes("res_unique")) throw new Error("sensitive telemetry");` },
    { lang: "bash", purpose: "Gera alta cardinalidade e segredo sentinela, valida sinais de contrato e prova que ambos ficam contidos.", code: `set -euo pipefail
canary='chiron-secret-must-never-appear-20260920'
for i in $(seq 1 2000); do curl -sS -o /dev/null -H "Authorization: Bearer $canary" "$BASE_URL/reservations/res-$i" || true; done
./fixtures/emit-contract-violation --operation reserveSeat --status 299 --contract-digest sha256:fixture
./tools/telemetry-query --since fixture-start --output telemetry.json
jq -e '.metrics.labelCardinality.httpRoute <= 8 and .metrics.labelCardinality.operationId <= 16' telemetry.json >/dev/null
jq -e '.contractViolations | any(.operationId == "reserveSeat" and .status == 299)' telemetry.json >/dev/null
if ./tools/telemetry-search --literal "$canary" --since fixture-start | jq -e '.matches > 0' >/dev/null; then exit 1; fi
./tools/alert-test --rule alerts/openapi-contract-violation.yaml --fixture fixtures/violation-series.json --expect-firing` },
  ],
  "Incidentes e rollback de contrato": [
    { lang: "json", purpose: "Define ledger de recuperação com artifact conhecido, superfícies, invariantes e objetivos mensuráveis.", code: `{
  "incidentId": "INC-FIXTURE-OPENAPI-001",
  "compromisedDigest": "sha256:COMPROMISED",
  "knownGood": { "digest": "sha256:KNOWN_GOOD", "signatureBundle": "registry/signatures/KNOWN_GOOD.bundle", "provenance": "registry/provenance/KNOWN_GOOD.json" },
  "surfaces": ["registry-stable", "portal", "cdn", "gateway", "sdk-registry", "ci-cache"],
  "containment": ["denylist compromised digest", "freeze promotions", "purge mutable aliases", "notify affected consumers"],
  "recoveryInvariants": {
    "registryDigest": "sha256:KNOWN_GOOD",
    "gatewayContractDigest": "sha256:KNOWN_GOOD",
    "portalDownloadDigest": "sha256:KNOWN_GOOD",
    "compromisedDownloadBlocked": true,
    "contractSmokeGreen": true
  },
  "objectives": { "rtoMinutes": 30, "rpoArtifacts": 0 }
}` },
    { lang: "bash", purpose: "Revoga bundle comprometido, restaura artifact verificado e reconcilia todas as superfícies antes de resolver.", code: `set -euo pipefail
bad=sha256:COMPROMISED; good=sha256:KNOWN_GOOD
./tools/registry-deny --digest "$bad" --incident INC-FIXTURE-OPENAPI-001
./tools/promotion-freeze --product quiron-reservations --incident INC-FIXTURE-OPENAPI-001
./tools/artifact-verify --ref "registry.example.invalid/apis/quiron-reservations@$good" --policy security/release-identity.json
./tools/registry-promote --ref "registry.example.invalid/apis/quiron-reservations@$good" --channel stable --incident INC-FIXTURE-OPENAPI-001 --no-rebuild
./tools/gateway-restore --contract-digest "$good" --snapshot gateway-snapshots/KNOWN_GOOD.json
./tools/cache-purge --product quiron-reservations --digests "$bad,$good" --all-regions
./tools/reconcile-openapi-surfaces --incident INC-FIXTURE-OPENAPI-001 --expected "$good" --surfaces registry,portal,cdn,gateway,sdk-registry,ci-cache --output reconciliation.json
jq -e '.allConverged == true and .compromisedDownloadBlocked == true and .contractSmokeGreen == true' reconciliation.json >/dev/null
./tools/promotion-unfreeze --product quiron-reservations --require-reconciliation reconciliation.json` },
  ],
  "Baseline OpenAPI do Quíron": [
    { lang: "yaml", purpose: "Define a operação central com segurança, idempotência, outcomes e schemas reutilizáveis sem fingir implementação.", code: `openapi: 3.2.1
$self: https://contracts.example.invalid/quiron/1.0/openapi.yaml
info: { title: Quíron Reservations API, version: 1.0.0 }
servers: [{ url: https://sandbox-api.example.invalid }]
security: [{ oauth: ["reservations:write"] }]
paths:
  /reservations:
    post:
      operationId: reserveSeat
      parameters: [{ $ref: "#/components/parameters/IdempotencyKey" }]
      requestBody: { required: true, content: { application/json: { schema: { $ref: "#/components/schemas/ReservationRequest" } } } }
      responses:
        "201": { description: Committed exactly once, headers: { Location: { required: true, schema: { type: string, format: uri-reference } } }, content: { application/json: { schema: { $ref: "#/components/schemas/Reservation" } } } }
        "409": { $ref: "#/components/responses/Problem" }
components:
  securitySchemes: { oauth: { type: oauth2, flows: { clientCredentials: { tokenUrl: https://identity.example.invalid/oauth2/token, scopes: { "reservations:write": Create reservations } } } } }
  parameters: { IdempotencyKey: { name: Idempotency-Key, in: header, required: true, schema: { type: string, minLength: 16, maxLength: 128 } } }
  schemas:
    ReservationRequest: { type: object, additionalProperties: false, required: [showId, quantity], properties: { showId: { type: string }, quantity: { type: integer, minimum: 1, maximum: 8 } } }
    Reservation: { type: object, additionalProperties: false, required: [reservationId, status, quantity], properties: { reservationId: { type: string }, status: { const: confirmed }, quantity: { type: integer } } }
  responses: { Problem: { description: Safe domain error, content: { application/problem+json: { schema: { type: object, required: [status, code], properties: { status: { type: integer }, code: { type: string } } } } } } }` },
    { lang: "bash", purpose: "Constrói bundle offline, valida exemplos e prova que mutantes essenciais da baseline são rejeitados.", code: `set -euo pipefail
./tools/openapi-bundle --entry contracts/openapi.yaml --lock contracts/refs.lock.json --offline --output build/quiron-openapi.json
./tools/openapi-validate --entry build/quiron-openapi.json --version 3.2.1 --strict --output build/validation.json
./tools/spectral lint --ruleset rulesets/quiron.yaml --format json build/quiron-openapi.json > build/lint.json
./tools/openapi-examples --contract build/quiron-openapi.json --validate-all --output build/examples.json
jq -e '.errors == 0' build/validation.json >/dev/null
jq -e '[.[] | select(.severity == 0)] | length == 0' build/lint.json >/dev/null
jq -e '.invalid == 0 and .validated > 0' build/examples.json >/dev/null
for mutant in missing-idempotency anonymous-reservation missing-conflict unsafe-problem broken-ref; do if ./tools/openapi-release-gate --contract "fixtures/mutants/$mutant.yaml" --offline; then exit 1; fi; done
sha256sum build/quiron-openapi.json > build/quiron-openapi.json.sha256` },
  ],
  "Última vaga por contrato": [
    { lang: "typescript", purpose: "Coordena duas chamadas realmente simultâneas por barreira e verifica responses e observer independente.", code: `type Result = { status: number; body: { reservationId?: string; code?: string }; correlationId: string };
type Observer = { confirmedQuantity: number; reservations: number; outboxEvents: number; providerEffects: number };
async function lastSeat(baseUrl: string, tokens: [string, string], observe: () => Promise<Observer>): Promise<void> {
  let release!: () => void; const barrier = new Promise<void>((resolve) => { release = resolve; });
  const call = async (index: number): Promise<Result> => { await barrier; const response = await fetch(\`\${baseUrl}/reservations\`, { method: "POST", headers: { authorization: \`Bearer \${tokens[index]}\`, "content-type": "application/json", "idempotency-key": \`last-seat-fixture-\${index}\` }, body: JSON.stringify({ showId: "show_last_seat", quantity: 1 }) }); return { status: response.status, body: await response.json(), correlationId: response.headers.get("x-correlation-id") ?? "missing" }; };
  const pending = [call(0), call(1)]; release(); const results = await Promise.all(pending);
  if (results.filter((r) => r.status === 201).length !== 1 || results.filter((r) => r.status === 409).length !== 1) throw new Error("wire invariant");
  const state = await observe(); if (state.confirmedQuantity !== 1 || state.reservations !== 1 || state.outboxEvents !== 1 || state.providerEffects !== 1) throw new Error("effect invariant");
}` },
    { lang: "bash", purpose: "Injeta timeout pós-commit e repete com a mesma chave para comprovar outcome e efeito únicos.", code: `set -euo pipefail
key=last-seat-timeout-fixture-001
./fixtures/reset-show --show show_timeout --capacity 1
./fixtures/fault-arm --operation reserveSeat --point after-commit-before-response --once
curl -sS -o first.json -w '%{http_code}' -X POST "$BASE_URL/reservations" -H "Authorization: Bearer $FIXTURE_TOKEN" -H "Idempotency-Key: $key" -H 'Content-Type: application/json' -d '{"showId":"show_timeout","quantity":1}' > first.status || true
curl -fsS -D retry.headers -X POST "$BASE_URL/reservations" -H "Authorization: Bearer $FIXTURE_TOKEN" -H "Idempotency-Key: $key" -H 'Content-Type: application/json' -d '{"showId":"show_timeout","quantity":1}' > retry.json
test "$(jq -r .status retry.json)" = confirmed
test "$(curl -sS -o mismatch.json -w '%{http_code}' -X POST "$BASE_URL/reservations" -H "Authorization: Bearer $FIXTURE_TOKEN" -H "Idempotency-Key: $key" -H 'Content-Type: application/json' -d '{"showId":"show_timeout","quantity":2}')" = 409
./fixtures/query-evidence --idempotency-key "$key" | jq -e '.reservations == 1 and .outboxEvents == 1 and .providerEffects == 1' >/dev/null` },
  ],
  "SDK, compatibilidade e release": [
    { lang: "json", purpose: "Fixa matriz de consumers, artifacts e gates necessária para promover SDK e contrato em conjunto.", code: `{
  "release": "quiron-reservations-1.1.0",
  "contract": { "digest": "sha256:CONTRACT_1_1", "registry": "registry.example.invalid/apis/quiron-reservations" },
  "sdk": { "package": "@example/quiron-reservations", "version": "1.1.0", "digest": "sha256:SDK_1_1", "generator": "sha256:GENERATOR", "templates": "sha256:TEMPLATES" },
  "consumers": [
    { "name": "partner-checkout", "version": "1.8.2", "sdk": "1.0.4", "required": true },
    { "name": "staff-console", "version": "2.1.0", "sdk": "1.1.0", "required": true }
  ],
  "gates": ["semantic-diff", "clean-generation", "compile", "wire-smoke", "consumer-v1", "consumer-v2", "canary", "signature", "provenance"],
  "promotion": { "sourceChannel": "beta", "targetChannel": "stable", "rebuild": false, "requireSameDigests": true },
  "rollback": { "contractDigest": "sha256:CONTRACT_1_0", "sdkVersion": "1.0.4", "gatewaySnapshot": "sha256:GATEWAY_1_0" }
}` },
    { lang: "bash", purpose: "Gera e testa SDK, executa consumers antigo e novo e promove sem rebuild apenas quando a matriz está verde.", code: `set -euo pipefail
./tools/openapi-diff --before artifacts/1.0.json --after artifacts/1.1.json --consumer-risk --output release/diff.json
./tools/generate-sdk --manifest generation/release-1.1.json --output release/sdk --offline
(cd release/sdk && npm ci --ignore-scripts && npm run typecheck && npm test && npm pack)
./consumers/partner-checkout/smoke --version 1.8.2 --sdk 1.0.4 --base-url "$CANARY_URL" --output release/consumer-v1.json
./consumers/staff-console/smoke --version 2.1.0 --sdk release/sdk --base-url "$CANARY_URL" --output release/consumer-v2.json
jq -e '.failed == 0 and .unknownOutcomes == 0' release/consumer-v1.json release/consumer-v2.json >/dev/null
./tools/release-sign --contract artifacts/1.1.json --package release/sdk/*.tgz --provenance release/provenance.json
./tools/release-promote --manifest release/matrix.json --from beta --to stable --no-rebuild
./tools/release-smoke --manifest release/matrix.json --environment production --require-matching-digests` },
  ],
  "Banca, incidente e restore OpenAPI": [
    { lang: "yaml", purpose: "Declara exercício final com faults, limites de segurança, objetivos e invariantes de reconciliação completos.", code: `exercise:
  id: quiron-openapi-restore-board
  environment: isolated-sandbox
  baselineDigest: sha256:KNOWN_GOOD
  faultCatalog:
    - runtime-response-drift
    - gateway-security-broadening
    - compromised-registry-bundle
    - stale-portal-cdn
    - tampered-sdk-package
    - worker-kill-after-provider-effect
  safety:
    externalEgress: deny
    principals: fixture-only
    destinations: local-fakes
    preserveEvidence: true
  objectives: { rtoMinutes: 30, rpoBusinessEffects: 0 }
  requiredInvariants:
    - all-surfaces-report-known-good-digest
    - compromised-digest-is-denied
    - gateway-policy-matches-approved-plan
    - portal-download-signature-verifies
    - old-and-new-consumers-pass
    - last-seat-confirmed-quantity-is-one
    - outbox-and-provider-effect-are-exactly-once
    - cross-tenant-disclosure-is-zero
  evidence: [timeline, hashes, signatures, provenance, gateway-diff, telemetry, contract-tests, observer-state, reconciliation]` },
    { lang: "bash", purpose: "Executa restore completo e só encerra quando artifacts, gateway, portal, consumers e negócio convergem.", code: `set -euo pipefail
incident=INC-BOARD-FIXTURE; target=sha256:KNOWN_GOOD
./board/inject --catalog board/exercise.yaml --seed 20260920 --output board/ground-truth.sealed
./runbooks/openapi-contain --incident "$incident" --freeze-promotions --deny-compromised --preserve-evidence
./runbooks/openapi-restore --incident "$incident" --target "$target" --verify-signature --verify-provenance --no-rebuild
./tools/reconcile-openapi-surfaces --expected "$target" --surfaces registry,portal,cdn,gateway,service,sdk-registry,ci-cache --output board/reconciliation.json
./tools/contract-suite --contract "registry.example.invalid/apis/quiron-reservations@$target" --base-url "$RESTORED_URL" --principals fixtures/principals.json --observer fixtures/effect-observer --output board/contracts.json
./consumers/all-supported-smoke --release-ledger release/ledger.json --base-url "$RESTORED_URL" --output board/consumers.json
./fixtures/query-last-seat-evidence --exercise "$incident" > board/business.json
jq -e '.allConverged and .compromisedBlocked' board/reconciliation.json >/dev/null
jq -e '.failed == 0 and .forbiddenEffects == 0' board/contracts.json >/dev/null
jq -e '.failed == 0' board/consumers.json >/dev/null
jq -e '.confirmedQuantity == 1 and .outboxEvents == 1 and .providerEffects == 1 and .crossTenantRows == 0' board/business.json >/dev/null
./board/close --incident "$incident" --require-evidence board --require-objectives` },
  ],
};
