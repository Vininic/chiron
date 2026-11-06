export type VercelExample = { lang: "json" | "javascript" | "bash"; purpose: string; code: string };

export const VERCEL_EXAMPLES: Record<string, VercelExample[]> = {
  "Projects, teams e ownership": [
    { lang: "json", purpose: "Declara identidade, ownership, source e limites do projeto sem armazenar secrets.", code: `{
  "teamId": "team_quiron_sandbox",
  "projectId": "prj_quiron_web",
  "name": "quiron-web",
  "owners": { "primary": "team-platform", "backup": "team-ticketing" },
  "source": { "provider": "github", "repositoryId": "repo_quiron", "productionBranch": "main" },
  "access": { "ciIdentity": "workload:vercel-deploy", "allowPersonalTokens": false },
  "budget": { "monthlyLimitUsd": 100, "alertAtPercent": [50, 80, 100] },
  "lifecycle": { "reviewEveryDays": 90, "orphaned": false }
}` },
    { lang: "bash", purpose: "Confere team e project por IDs e bloqueia publicação quando ownership ou linkage divergem.", code: `set -euo pipefail
./tools/vercel-project-observe --team-id team_quiron_sandbox --project-id prj_quiron_web --redact-secrets --output reports/project.json
jq -e '.teamId == "team_quiron_sandbox" and .projectId == "prj_quiron_web" and .owners.primary != null and .personalProject == false' reports/project.json >/dev/null
./tools/vercel-project-diff --desired manifests/vercel-project.json --observed reports/project.json --output reports/project-drift.json
jq -e '.criticalDrift == 0 and .orphanedResources == 0 and .unknownSecretValuesRedacted == true' reports/project-drift.json >/dev/null` },
  ],
  "Deployments e aliases": [
    { lang: "json", purpose: "Liga deployment imutável, commit, manifest e aliases com alvo anterior para rollback.", code: `{
  "deploymentId": "dpl_quiron_candidate_001",
  "projectId": "prj_quiron_web",
  "teamId": "team_quiron_sandbox",
  "sourceCommit": "0123456789abcdef",
  "manifestDigest": "sha256:MANIFEST",
  "target": "production",
  "status": "READY",
  "aliases": ["quiron.example.invalid"],
  "promotion": { "expectedPreviousDeploymentId": "dpl_quiron_previous", "requireReadAfterWrite": true }
}` },
    { lang: "javascript", purpose: "Recusa promoção de deployment diferente do aprovado e confirma alias por leitura posterior.", code: `const expected = JSON.parse(pm.variables.get("approvedDeploymentFixture"));
const observed = pm.response.json();
if (observed.deploymentId !== expected.deploymentId) throw new Error("wrong deployment promoted");
if (observed.manifestDigest !== expected.manifestDigest || observed.sourceCommit !== expected.sourceCommit) throw new Error("provenance mismatch");
if (observed.previousDeploymentId !== expected.promotion.expectedPreviousDeploymentId) throw new Error("concurrent alias update");
pm.test("alias resolves to approved deployment", () => pm.expect(observed.readAfterWriteDeploymentId).to.equal(expected.deploymentId));` },
  ],
  "Git integration e source": [
    { lang: "json", purpose: "Fixa installation, repository, commit e regras de preview sem credencial pessoal.", code: `{
  "installationId": "git_install_quiron",
  "repositoryId": "repo_quiron",
  "projectId": "prj_quiron_web",
  "productionBranch": "main",
  "approvedCommit": "0123456789abcdef",
  "permissions": ["contents:read", "checks:write"],
  "forkPolicy": { "provideProductionSecrets": false, "requireMaintainerApproval": true },
  "preview": { "requireHeadShaMatch": true, "invalidateApprovalOnPush": true }
}` },
    { lang: "bash", purpose: "Reconcilia o SHA do pull request com o deployment e rejeita check obsoleto.", code: `set -euo pipefail
./tools/vercel-deployment-metadata --deployment-id dpl_quiron_candidate_001 --output reports/deployment-source.json
jq -e '.repositoryId == "repo_quiron" and .commitSha == "0123456789abcdef" and .target == "preview"' reports/deployment-source.json >/dev/null
./tools/git-check-observe --repository-id repo_quiron --commit 0123456789abcdef --name vercel-preview --output reports/git-check.json
jq -e '.status == "success" and .deploymentId == "dpl_quiron_candidate_001" and .headShaCurrent == true' reports/git-check.json >/dev/null` },
  ],
  "Project settings e drift": [
    { lang: "json", purpose: "Versiona framework, root, toolchain, commands e output como configuração revisável.", code: `{
  "projectId": "prj_quiron_web",
  "framework": "vite",
  "rootDirectory": ".",
  "nodeVersion": "22.x",
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "settingsVersion": 3,
  "secretValuesIncluded": false,
  "requirePrecondition": true
}` },
    { lang: "bash", purpose: "Compara settings observados ao manifest e bloqueia drift ou campos desconhecidos.", code: `set -euo pipefail
./tools/vercel-settings-observe --project-id prj_quiron_web --redact-secrets --output reports/settings.json
./tools/vercel-settings-validate --desired manifests/vercel-settings.json --observed reports/settings.json --strict --output reports/settings-diff.json
jq -e '.criticalDrift == 0 and .unknownFields == 0 and .secretValuesPresent == false' reports/settings-diff.json >/dev/null
jq -e '.framework == "vite" and .rootDirectory == "." and .buildCommand == "pnpm build" and .outputDirectory == "dist"' reports/settings.json >/dev/null` },
  ],
  "Runtime e package manager": [
    { lang: "json", purpose: "Fixa Node, package manager, lockfile, registry e política de instalação.", code: `{ "node": "22.x", "packageManager": "pnpm@10.12.1", "lockfile": { "path": "pnpm-lock.yaml", "digest": "sha256:LOCK", "frozen": true }, "registry": { "origin": "https://registry.npmjs.org", "allowPublish": false }, "forbidMultipleLockfiles": true, "captureSbom": true }` },
    { lang: "bash", purpose: "Verifica toolchain e instalação frozen sem aceitar alteração do lockfile.", code: `set -euo pipefail
corepack pnpm --version > reports/pnpm-version.txt
node --version > reports/node-version.txt
before="$(sha256sum pnpm-lock.yaml)"
corepack pnpm install --frozen-lockfile
after="$(sha256sum pnpm-lock.yaml)"
test "$before" = "$after"
./tools/dependency-policy --lock pnpm-lock.yaml --deny-floating --deny-unapproved-registries --output reports/dependencies.json
jq -e '.violations == 0' reports/dependencies.json >/dev/null` },
  ],
  "Build, output e artifacts": [
    { lang: "json", purpose: "Declara entradas, comando, output e requisitos do artifact.", code: `{ "sourceCommit": "0123456789abcdef", "settingsDigest": "sha256:SETTINGS", "environmentDigest": "sha256:ENV_REDACTED", "command": "pnpm build", "outputDirectory": "dist", "requiredEntries": ["index.html", "assets"], "forbid": [".env", "*.pem", "unreviewed-source-map"], "requireInventory": true }` },
    { lang: "bash", purpose: "Constrói em clone limpo, inventaria output e falha em segredo ou arquivo ausente.", code: `set -euo pipefail
pnpm build
test -s dist/index.html
./tools/artifact-inventory --root dist --hash sha256 --output reports/output.json
jq -e '.files > 0 and .pathEscapes == 0 and .missingRequired == 0' reports/output.json >/dev/null
if rg -n -i 'BEGIN (RSA |EC )?PRIVATE KEY|client_secret|bearer [A-Za-z0-9._-]{16,}' dist; then exit 1; fi
sha256sum reports/output.json > reports/output.sha256` },
  ],
  "Cache e invalidation": [
    { lang: "json", purpose: "Define camadas, componentes da chave e isolamento de confiança.", code: `{ "layers": [{ "name": "package-store", "keyInputs": ["lockDigest", "packageManager", "platform"] }, { "name": "build", "keyInputs": ["sourceDigest", "settingsDigest", "publicEnvDigest", "toolchainDigest"] }], "trust": { "externalForkCanWrite": false, "crossProjectSharing": false }, "requireColdWarmEquivalence": true }` },
    { lang: "javascript", purpose: "Confirma sensitivity das keys e equivalência dos inventories cold e warm.", code: `const report = pm.response.json();
const required = ["source", "lock", "settings", "publicEnvironment", "toolchain"];
for (const input of required) {
  if (report.sensitivity?.[input] !== "miss-or-proven-invariant") throw new Error("incomplete cache key: " + input);
}
if (report.coldInventoryDigest !== report.warmInventoryDigest) throw new Error("cold/warm artifact divergence");
if (report.externalForkWrites !== 0 || report.secretFindings !== 0) throw new Error("unsafe cache");` },
  ],
  "Monorepos e affected projects": [
    { lang: "json", purpose: "Representa graph, roots e regras de impacto com fallback conservador.", code: `{ "repositoryRoot": ".", "projects": [{ "id": "quiron-web", "root": "apps/web", "dependsOn": ["ui", "domain"] }], "packages": [{ "id": "ui", "root": "packages/ui" }, { "id": "domain", "root": "packages/domain" }], "globalInputs": ["pnpm-lock.yaml", "pnpm-workspace.yaml", "tsconfig.base.json"], "onUnknown": "build" }` },
    { lang: "bash", purpose: "Calcula affected entre commits e testa que mudança transitiva reconstrói o consumer.", code: `set -euo pipefail
./tools/monorepo-affected --base "$BASE_SHA" --head "$HEAD_SHA" --graph manifests/workspaces.json --output reports/affected.json
jq -e '.unknown == false and (.projects | index("quiron-web")) != null' reports/affected.json >/dev/null
./tools/ignored-build-contract --cases fixtures/affected-cases.json --script scripts/vercel-ignore-build.sh --output reports/ignore-contract.json
jq -e '.falseNegatives == 0 and .errorsFailConservative == true' reports/ignore-contract.json >/dev/null` },
  ],
  "Environment variables e scopes": [
    { lang: "json", purpose: "Define schema, targets e branch overrides sem valores secretos.", code: `{ "projectId": "prj_quiron_web", "variables": [{ "name": "PUBLIC_API_ORIGIN", "type": "url", "classification": "public", "targets": ["preview", "production"], "allowedOrigins": ["https://sandbox-api.example.invalid"] }, { "name": "DATABASE_CREDENTIAL", "type": "secret-reference", "classification": "secret", "targets": ["production"], "reference": "vault://vercel/quiron-db" }], "rejectUnknown": true, "forbidProductionFallback": true }` },
    { lang: "javascript", purpose: "Valida configuração efetiva e falha antes de qualquer destino inseguro.", code: `const cfg = JSON.parse(pm.variables.get("vercelEnvironmentFixture"));
if (!["preview", "production"].includes(cfg.target)) throw new Error("unknown target");
if (cfg.apiOrigin !== "https://sandbox-api.example.invalid") throw new Error("unsafe API origin");
if (cfg.target === "preview" && cfg.secretScope === "production") throw new Error("production secret in preview");
if (cfg.unknownVariables.length > 0 || cfg.missingRequired.length > 0) throw new Error("invalid effective configuration");` },
  ],
  "Secrets e exposição no client": [
    { lang: "json", purpose: "Classifica consumers e proíbe secret em qualquer artifact público.", code: `{ "variables": [{ "name": "PUBLIC_RELEASE_ID", "classification": "public", "consumers": ["client", "server"] }, { "name": "PAYMENT_PROVIDER_TOKEN", "classification": "secret", "consumers": ["server-runtime"], "forbid": ["client-bundle", "source-map", "build-log", "response", "analytics"] }], "scanEncodings": ["plain", "base64"], "revokeOnFinding": true }` },
    { lang: "bash", purpose: "Varre bundle, source maps e logs por canary antes da promoção.", code: `set -euo pipefail
canary="vercel-secret-canary-20260929"
./tools/client-secret-scan --paths dist,reports/build --canary "$canary" --decode-base64 --output reports/client-secret-scan.json
jq -e '.findings == 0 and .scannerErrors == 0 and .sourceMapsInspected == true' reports/client-secret-scan.json >/dev/null
if rg -n "$canary|PAYMENT_PROVIDER_TOKEN|authorization" dist reports/build; then exit 1; fi` },
  ],
  "System variables e metadata": [
    { lang: "json", purpose: "Allowlista metadata segura e impede uso como autoridade de autenticação.", code: `{ "allow": ["deploymentId", "projectId", "environment", "gitCommitSha", "region"], "public": ["deploymentId", "environment"], "forbidPublic": ["repositoryUrl", "authorEmail", "teamToken"], "authorizationSource": "verified-principal", "urlPolicy": { "allowedOrigins": ["https://quiron.example.invalid"], "trustForwardedHost": false } }` },
    { lang: "javascript", purpose: "Cruza metadata do runtime com o manifest e rejeita URL ou target conflitante.", code: `const manifest = JSON.parse(pm.variables.get("releaseManifestFixture"));
const metadata = pm.response.json();
if (metadata.deploymentId !== manifest.deploymentId || metadata.gitCommitSha !== manifest.sourceCommit) throw new Error("release provenance mismatch");
if (!["preview", "production"].includes(metadata.environment)) throw new Error("unknown environment");
const origin = new URL(metadata.canonicalUrl).origin;
if (origin !== "https://quiron.example.invalid") throw new Error("unapproved canonical origin");
if (metadata.authorizationDecision != null) throw new Error("system metadata used for authorization");` },
  ],
  "Config drift e promoção": [
    { lang: "json", purpose: "Manifesta desired state, severidade e ordem segura de promoção.", code: `{ "projectId": "prj_quiron_web", "target": "production", "desiredDigest": "sha256:CONFIG", "publicValues": [{ "name": "PUBLIC_API_ORIGIN", "value": "https://sandbox-api.example.invalid" }], "secretReferences": [{ "name": "DATABASE_CREDENTIAL", "referenceVersion": "v7" }], "promotionOrder": ["validate", "write-references", "build", "gates", "promote-alias", "read-after-write"], "blockOn": ["critical", "unknown"] }` },
    { lang: "bash", purpose: "Compara estado redigido e exige convergência antes e depois da promoção.", code: `set -euo pipefail
./tools/vercel-config-observe --project-id prj_quiron_web --target production --redact-values --output reports/config-observed.json
./tools/vercel-config-diff --desired manifests/vercel-config.json --observed reports/config-observed.json --output reports/config-drift.json
jq -e '.critical == 0 and .unknown == 0 and .secretValuesExposed == 0' reports/config-drift.json >/dev/null
./tools/vercel-config-plan --desired manifests/vercel-config.json --require-preconditions --output reports/config-plan.json
jq -e '.safeOrder == true and .approvalDigest == .desiredDigest' reports/config-plan.json >/dev/null` },
  ],
  "Branch e pull request previews": [
    { lang: "json", purpose: "Liga preview ao head SHA, deployment e gates requeridos.", code: `{ "pullRequestId": "pr_fixture_42", "headSha": "0123456789abcdef", "projectId": "prj_quiron_web", "deploymentId": "dpl_preview_42", "immutableUrl": "https://dpl-preview-42.example.invalid", "requiredChecks": ["build", "contracts", "security", "accessibility"], "invalidateApprovalOnHeadChange": true, "productionSecrets": false }` },
    { lang: "javascript", purpose: "Recusa check stale ou preview de outro commit antes da aprovação.", code: `const review = JSON.parse(pm.variables.get("previewReviewFixture"));
const observed = pm.response.json();
if (observed.headSha !== review.headSha || observed.deploymentId !== review.deploymentId) throw new Error("stale preview");
if (observed.projectId !== review.projectId || observed.target !== "preview") throw new Error("wrong preview target");
for (const check of review.requiredChecks) if (observed.checks?.[check] !== "success") throw new Error("required check missing: " + check);
if (observed.productionSecretsInjected) throw new Error("production secret in preview");` },
  ],
  "Preview access e proteção": [
    { lang: "json", purpose: "Define audiência, proteção, bypass e cobertura de rotas.", code: `{ "deploymentId": "dpl_preview_42", "audience": "internal-reviewers", "protection": "vercel-authentication", "allowedGroups": ["team:reviewers"], "bypass": { "reference": "vault://vercel/preview-runner", "ttlMinutes": 30 }, "requiredCoverage": ["/", "/assets/app.js", "/api/health", "/images/sample"], "public": false }` },
    { lang: "bash", purpose: "Testa anonymous denial, acesso autorizado e revogação do bypass em todas as superfícies.", code: `set -euo pipefail
./tools/deployment-protection-test --manifest manifests/preview-protection.json --anonymous --expect-denied --output reports/anonymous.json
./tools/deployment-protection-test --manifest manifests/preview-protection.json --identity reviewer-fixture --expect-allowed --output reports/reviewer.json
./tools/deployment-protection-test --manifest manifests/preview-protection.json --bypass-reference vault://vercel/preview-runner --revoke-after --output reports/bypass.json
jq -e '.allRoutesCovered and .revokedTokenDenied and .secretFindings == 0' reports/bypass.json >/dev/null` },
  ],
  "Dados, fixtures e isolamento": [
    { lang: "json", purpose: "Inventaria recursos sintéticos e guardas de destino por deployment.", code: `{ "deploymentId": "dpl_preview_42", "tenant": "tenant_preview_42", "environment": "preview", "resources": [{ "provider": "postgres-sandbox", "id": "db_branch_preview_42", "ownerTag": "dpl_preview_42" }, { "provider": "blob-sandbox", "id": "bucket_preview_42", "ownerTag": "dpl_preview_42" }], "forbiddenProviders": ["payment-live", "email-live"], "maximumResources": 8 }` },
    { lang: "javascript", purpose: "Confirma isolamento e zero efeitos fora do namespace do preview.", code: `const isolation = pm.response.json();
if (isolation.environment !== "preview" || isolation.syntheticTenant !== true) throw new Error("unsafe preview data");
if (isolation.crossPreviewRows !== 0 || isolation.productionRows !== 0) throw new Error("data isolation failure");
if (isolation.realProviderEffects !== 0) throw new Error("live provider effect");
if (isolation.resources.some((item) => item.ownerTag !== isolation.deploymentId)) throw new Error("foreign resource");
pm.test("preview effects are owned", () => pm.expect(isolation.residualAfterCleanup).to.equal(0));` },
  ],
  "Lifecycle e cleanup seguro": [
    { lang: "json", purpose: "Modela state, inventory, TTL e guardas de cleanup idempotente.", code: `{ "previewId": "preview_pr_42_generation_3", "state": "Closing", "generation": 3, "owner": "team-platform", "expiresAt": "2026-09-30T00:00:00Z", "maximumDelete": 8, "resources": [{ "kind": "deployment", "id": "dpl_preview_42", "ownerTag": "preview_pr_42_generation_3" }, { "kind": "database-branch", "id": "db_branch_preview_42", "ownerTag": "preview_pr_42_generation_3" }], "requireDryRun": true, "forbidWildcard": true }` },
    { lang: "bash", purpose: "Planeja cleanup, bloqueia recurso estrangeiro e confirma residual zero.", code: `set -euo pipefail
./tools/preview-cleanup-plan --inventory evidence/preview-inventory.json --environment preview --require-owner --maximum-delete 8 --dry-run --output reports/cleanup-plan.json
jq -e '.foreignResources == 0 and .wildcards == 0 and .safe == true' reports/cleanup-plan.json >/dev/null
./tools/preview-cleanup-apply --plan reports/cleanup-plan.json --preserve-evidence --output reports/cleanup.json
jq -e '.deleted <= 8 and .residual == 0 and .evidencePreserved == true' reports/cleanup.json >/dev/null` },
  ],
  "Domains e aliases de projeto": [
    { lang: "json", purpose: "Liga domain, project, target, ownership e rollback.", code: `{ "domain": "quiron.example.invalid", "teamId": "team_quiron_sandbox", "projectId": "prj_quiron_web", "environment": "production", "canonical": true, "owner": "team-platform", "verification": { "required": true, "status": "verified" }, "promotion": { "deploymentId": "dpl_candidate", "previousDeploymentId": "dpl_previous", "requireReadAfterWrite": true } }` },
    { lang: "javascript", purpose: "Confirma domain no projeto e deployment aprovados sem dangling target.", code: `const desired = JSON.parse(pm.variables.get("domainManifestFixture"));
const observed = pm.response.json();
if (observed.projectId !== desired.projectId || observed.teamId !== desired.teamId) throw new Error("domain attached to wrong project");
if (observed.deploymentId !== desired.promotion.deploymentId) throw new Error("alias drift");
if (!observed.verified || observed.dangling) throw new Error("unsafe domain ownership");
pm.test("canonical domain is reconciled", () => pm.expect(observed.readAfterWrite).to.equal(true));` },
  ],
  "DNS e delegação controlada": [
    { lang: "json", purpose: "Preserva records web, email, CAA e delegação durante migração.", code: `{ "zone": "example.invalid", "sourceOfTruth": "dns/zone.json", "nameservers": ["ns1.sandbox.invalid", "ns2.sandbox.invalid"], "records": [{ "name": "@", "type": "A", "value": "192.0.2.10", "ttl": 300 }, { "name": "@", "type": "MX", "value": "10 mail.example.invalid", "ttl": 3600 }, { "name": "@", "type": "CAA", "value": "0 issue letsencrypt.org", "ttl": 3600 }], "requireCompleteMigration": true }` },
    { lang: "bash", purpose: "Valida inventory, authoritative answers e preservação de records não web.", code: `set -euo pipefail
./tools/dns-zone-validate --desired dns/zone.json --observed reports/dns-observed.json --require-types A,MX,TXT,CAA --output reports/dns-diff.json
jq -e '.missing == 0 and .conflicts == 0 and .dangling == 0' reports/dns-diff.json >/dev/null
./tools/dns-authoritative-check --zone example.invalid --nameservers ns1.sandbox.invalid,ns2.sandbox.invalid --output reports/dns-authority.json
jq -e '.delegationMatches and .allAuthoritativeAgree' reports/dns-authority.json >/dev/null` },
  ],
  "TLS e certificados gerenciados": [
    { lang: "json", purpose: "Define cobertura, issuer, CAA e alertas de renewal sem private key.", code: `{ "domains": ["quiron.example.invalid", "www.quiron.example.invalid"], "issuerPolicy": ["letsencrypt.org"], "minimumTls": "1.2", "renewalAlertDays": [30, 14, 7], "requireHostnameCoverage": true, "requireCompleteChain": true, "privateKeyExport": false }` },
    { lang: "bash", purpose: "Inspeciona handshake, hostname, chain, CAA e validade em domain sandbox.", code: `set -euo pipefail
./tools/tls-inspect --host quiron.example.invalid --sni quiron.example.invalid --output reports/tls.json
jq -e '.hostnameValid and .chainComplete and .daysRemaining > 30 and .minimumVersion >= "1.2"' reports/tls.json >/dev/null
./tools/caa-check --domain quiron.example.invalid --expected-issuer letsencrypt.org --output reports/caa.json
jq -e '.allowed and .conflicts == 0' reports/caa.json >/dev/null` },
  ],
  "Redirects, rewrites e canonical": [
    { lang: "json", purpose: "Versiona redirects e rewrites com destinos allowlisted e semantics explícitas.", code: `{ "canonicalOrigin": "https://quiron.example.invalid", "rules": [{ "id": "www-to-apex", "kind": "redirect", "source": "https://www.quiron.example.invalid/:path*", "destination": "https://quiron.example.invalid/:path*", "status": 308 }, { "id": "api-local", "kind": "rewrite", "source": "/api/:path*", "destination": "/functions/api/:path*" }], "externalRewriteAllowlist": [], "maximumRedirects": 2 }` },
    { lang: "javascript", purpose: "Valida status, canonical, método e ausência de proxy externo ou loop.", code: `const matrix = pm.response.json();
if (matrix.redirectLoops !== 0 || matrix.externalProxyTargets !== 0) throw new Error("unsafe routing");
if (matrix.maximumObservedRedirects > 2) throw new Error("redirect chain too long");
for (const item of matrix.cases) {
  if (item.methodPreserved !== item.expectedMethodPreserved) throw new Error("method semantics changed");
  if (new URL(item.finalUrl).origin !== "https://quiron.example.invalid") throw new Error("non-canonical origin");
}
pm.test("all route cases passed", () => pm.expect(matrix.failures).to.equal(0));` },
  ],
  "Serverless e Fluid compute": [
    { lang: "json", purpose: "Define concorrência, idempotência, pool e invariantes de efeito.", code: `{ "runtime": "nodejs", "compute": "fluid", "maximumConcurrency": 20, "connectionPoolMaximum": 10, "idempotencyRequired": true, "forbidMutableTenantGlobals": true, "observer": ["business-row", "outbox", "provider-fake"] }` },
    { lang: "javascript", purpose: "Reprova vazamento entre tenants e efeitos duplicados sob reuse e burst.", code: `const r=pm.response.json(); if(r.crossTenantLeaks!==0) throw new Error("tenant leak"); if(r.businessRows!==1||r.outboxEvents!==1||r.providerEffects!==1) throw new Error("effect cardinality"); if(r.poolPeak>r.poolMaximum) throw new Error("pool exceeded");` },
  ],
  "Edge e Node runtimes": [
    { lang: "json", purpose: "Registra capabilities exigidas e observadas para Edge e Node.", code: `{ "route": "/api/reservations", "required": ["web-crypto", "streaming", "abort"], "edge": { "nodeBuiltins": false, "nativeModules": false }, "node": { "tcp": true, "nativeModules": true }, "requireRuntimeSmoke": true }` },
    { lang: "javascript", purpose: "Compara capabilities sem fallback invisível entre runtimes.", code: `const m=pm.response.json(); for(const c of m.required){if(!m.observed.includes(c)) throw new Error("missing capability: "+c);} if(m.hiddenFallback||m.secretFindings>0) throw new Error("unsafe runtime fallback"); pm.test("runtime matches manifest",()=>pm.expect(m.runtime).to.equal(m.expectedRuntime));` },
  ],
  "Timeouts, streaming e payload": [
    { lang: "json", purpose: "Fixa budgets, limites e política de timeout após commit.", code: `{ "maximumDurationMs": 10000, "dependencyTimeoutMs": 3000, "maximumRequestBytes": 1048576, "maximumResponseBytes": 2097152, "streaming": { "requireBackpressure": true, "abortPropagation": true }, "unknownOutcome": "reconcile-before-retry" }` },
    { lang: "javascript", purpose: "Exige memory bounded, abort e um único efeito depois de timeout.", code: `const r=pm.response.json(); if(r.peakBytes>r.memoryBudget||!r.abortPropagated) throw new Error("stream budget"); if(r.timeoutAfterCommit&&r.effects!==1) throw new Error("duplicate effect"); if(r.oversizedAccepted) throw new Error("payload limit bypass");` },
  ],
  "Regions e data locality": [
    { lang: "json", purpose: "Declara placement, residência, authority e fencing de failover.", code: `{ "preferredRegions": ["gru1"], "dataAuthority": "postgres-gru1", "allowedDataRegions": ["BR"], "writes": "single-authority", "failover": { "requireFencingEpoch": true, "maximumRtoSeconds": 300, "maximumRpoSeconds": 0 } }` },
    { lang: "javascript", purpose: "Confirma região permitida, fencing e cardinalidade na disputa.", code: `const r=pm.response.json(); if(!r.allowedRegions.includes(r.computeRegion)) throw new Error("region policy"); if(r.concurrentLeaders!==1||r.staleWriterAccepted) throw new Error("fencing failed"); if(r.businessRows!==1||r.providerEffects!==1) throw new Error("regional duplicate");` },
  ],
  "Static, SSR e revalidation": [
    { lang: "json", purpose: "Versiona estratégia, freshness, personalização e fallback de cada route.", code: "{ \"routes\": [{ \"path\": \"/catalog\", \"strategy\": \"static\", \"maximumStalenessSeconds\": 3600 }, { \"path\": \"/prices\", \"strategy\": \"revalidate\", \"maximumStalenessSeconds\": 60, \"invalidationTag\": \"prices\" }, { \"path\": \"/account\", \"strategy\": \"ssr\", \"personalized\": true, \"sharedCache\": false }], \"refreshFailure\": \"serve-stale-only-within-slo\", \"requireDeploymentDigest\": true }" },
    { lang: "javascript", purpose: "Reprova staleness, vazamento entre usuários e regeneração concorrente.", code: "const r=pm.response.json(); if(r.maximumObservedStalenessSeconds>r.allowedStalenessSeconds) throw new Error(\"freshness SLO\"); if(r.crossUserLeaks!==0||r.personalizedSharedCacheEntries!==0) throw new Error(\"private response cached\"); if(r.concurrentRegenerations>1||r.duplicateInvalidations>0) throw new Error(\"revalidation race\"); pm.test(\"release provenance\",()=>pm.expect(r.deploymentDigest).to.match(/^[a-f0-9]{40,64}$/));" },
  ],
  "Cache-Control e CDN segura": [
    { lang: "json", purpose: "Define políticas distintas para HTML, assets e respostas privadas.", code: "{ \"policies\": [{ \"match\": \"/assets/*\", \"cacheControl\": \"public, max-age=31536000, immutable\", \"contentAddressed\": true }, { \"match\": \"/catalog\", \"cacheControl\": \"public, max-age=0, s-maxage=60, stale-while-revalidate=30\", \"vary\": [\"Accept-Encoding\"] }, { \"match\": \"/account/*\", \"cacheControl\": \"private, no-store\", \"vary\": [\"Cookie\"] }], \"forbidSharedCacheWithSetCookie\": true }" },
    { lang: "bash", purpose: "Compara cache cold, warm e privado sem presumir hit por status HTTP.", code: "set -euo pipefail\nbase=\"${BASE_URL:?BASE_URL required}\"\ncurl -fsS -D reports/catalog-cold.headers -o reports/catalog-cold.body \"$base/catalog\"\ncurl -fsS -D reports/catalog-warm.headers -o reports/catalog-warm.body \"$base/catalog\"\ncurl -fsS -D reports/account.headers -o /dev/null -H 'Cookie: session=synthetic-user-a' \"$base/account\"\ngrep -Eiq '^cache-control:.*s-maxage=60' reports/catalog-warm.headers\ngrep -Eiq '^cache-control:.*(private|no-store)' reports/account.headers\ncmp reports/catalog-cold.body reports/catalog-warm.body" },
  ],
  "Image Optimization segura": [
    { lang: "json", purpose: "Restringe origens, formatos, dimensões e custo do transformador de imagens.", code: "{ \"remoteSources\": [{ \"protocol\": \"https\", \"hostname\": \"media.example.invalid\", \"pathname\": \"/public/**\" }], \"formats\": [\"image/avif\", \"image/webp\"], \"allowedWidths\": [320, 640, 960, 1280], \"maximumSourceBytes\": 10485760, \"maximumDecodedPixels\": 40000000, \"forbidPrivateNetworks\": true, \"stripMetadata\": [\"gps\"], \"svgPolicy\": \"deny-remote\" }" },
    { lang: "javascript", purpose: "Valida isolamento, negociação, cardinalidade e limites do pipeline de imagem.", code: "const r=pm.response.json(); if(r.ssrfAccepted||r.privateSourceAnonymousAccess) throw new Error(\"image boundary bypass\"); if(!r.acceptedFormats.includes(r.responseContentType)) throw new Error(\"format negotiation\"); if(r.generatedVariantCount>r.variantBudget) throw new Error(\"variant explosion\"); if(r.layoutShift>r.maximumLayoutShift||r.decodedPixels>r.maximumDecodedPixels) throw new Error(\"image budget\");" },
  ],
  "Headers, compression e assets": [
    { lang: "json", purpose: "Mantém matriz de security headers, CORS, compressão e retenção de assets.", code: "{ \"html\": { \"contentSecurityPolicy\": \"default-src 'self'; frame-ancestors 'none'; object-src 'none'\", \"referrerPolicy\": \"strict-origin-when-cross-origin\", \"permissionsPolicy\": \"camera=(), microphone=()\", \"cacheControl\": \"public, max-age=0, s-maxage=60\" }, \"assets\": { \"contentAddressed\": true, \"cacheControl\": \"public, max-age=31536000, immutable\", \"rollbackRetentionDays\": 30 }, \"compression\": [\"br\", \"gzip\"], \"corsCredentialOrigins\": [\"https://app.example.invalid\"] }" },
    { lang: "bash", purpose: "Audita headers, Brotli negociado, MIME e presença dos assets do manifest.", code: "set -euo pipefail\nbase=\"${BASE_URL:?BASE_URL required}\"\ncurl -fsS --compressed -H 'Accept-Encoding: br, gzip' -D reports/home.headers -o reports/home.html \"$base/\"\ngrep -Eiq '^content-security-policy:.*frame-ancestors' reports/home.headers\ngrep -Eiq '^vary:.*accept-encoding' reports/home.headers\njq -r '.assets[] | [.path,.sha256,.contentType] | @tsv' reports/asset-manifest.json |\nwhile IFS=$'\\t' read -r path digest content_type; do\n  curl -fsS -D reports/asset.headers -o reports/asset.bin \"$base$path\"\n  grep -Fiq \"content-type: $content_type\" reports/asset.headers\n  printf '%s  %s\\n' \"$digest\" reports/asset.bin | sha256sum -c -\ndone" },
  ],
  "Postgres e connection management": [
    { lang: "json", purpose: "Fixa orçamento de conexões, pooler, transações e política de migrations.", code: "{ \"primaryRegion\": \"gru1\", \"maximumDatabaseConnections\": 100, \"reservedOperationalConnections\": 20, \"functionPoolMaximum\": 5, \"poolerMode\": \"transaction\", \"acquireTimeoutMs\": 500, \"transaction\": { \"idempotencyRecord\": true, \"outbox\": true }, \"migrations\": { \"strategy\": \"expand-migrate-contract\", \"runOnStartup\": false } }" },
    { lang: "javascript", purpose: "Reprova exaustão, vazamento de sessão e duplicata após timeout de commit.", code: "const r=pm.response.json(); if(r.peakConnections>r.connectionBudget||r.acquireQueueUnbounded) throw new Error(\"connection budget\"); if(r.crossTenantSessionLeaks!==0) throw new Error(\"session leak\"); if(r.timeoutAfterCommit&&(r.businessRows!==1||r.outboxEvents!==1)) throw new Error(\"duplicate transaction\"); if(!r.oldAndNewSchemaCompatible) throw new Error(\"unsafe migration\");" },
  ],
  "KV, Blob e object storage": [
    { lang: "json", purpose: "Define namespaces, TTL, uploads assinados, integridade e lifecycle.", code: "{ \"namespace\": \"{environment}:{tenant}:{kind}:{id}\", \"maximumValueBytes\": 262144, \"defaultTtlSeconds\": 3600, \"uploads\": { \"signedUrlTtlSeconds\": 300, \"maximumBytes\": 10485760, \"requireChecksum\": true, \"allowedMime\": [\"image/png\", \"image/jpeg\"] }, \"privateObjects\": { \"publicUrl\": false, \"downloadAuthorization\": true }, \"lifecycle\": { \"pendingUploadHours\": 24, \"deletedRetentionDays\": 30 } }" },
    { lang: "javascript", purpose: "Confirma isolamento, CAS, checksum, revoke e cleanup de derivados.", code: "const r=pm.response.json(); if(r.crossTenantReads!==0||r.anonymousPrivateDownloads!==0) throw new Error(\"storage isolation\"); if(r.concurrentCasWinners!==1||r.badChecksumAccepted) throw new Error(\"integrity\"); if(r.revokedUrlStillWorks||r.orphanedDerivatives>0) throw new Error(\"lifecycle cleanup\"); if(r.generatedKeys>r.keyCardinalityBudget) throw new Error(\"cost abuse\");" },
  ],
  "Queues, webhooks e async": [
    { lang: "json", purpose: "Versiona envelope, assinatura, retry, dedupe e dead-letter recovery.", code: "{ \"event\": { \"required\": [\"id\", \"type\", \"version\", \"occurredAt\", \"tenant\", \"correlationId\"], \"maximumBytes\": 65536 }, \"signature\": { \"algorithm\": \"hmac-sha256\", \"maximumSkewSeconds\": 300 }, \"retry\": { \"maximumAttempts\": 8, \"backoff\": \"exponential-jitter\" }, \"dedupeRetentionHours\": 72, \"deadLetter\": { \"enabled\": true, \"manualReplayApproval\": true } }" },
    { lang: "javascript", purpose: "Valida assinatura, idempotência, ordem e cardinalidade do efeito assíncrono.", code: "const r=pm.response.json(); if(r.invalidSignaturesAccepted||r.expiredReplaysAccepted) throw new Error(\"webhook authentication\"); if(r.businessRows!==1||r.providerEffects!==1) throw new Error(\"duplicate async effect\"); if(r.outOfOrderStateTransitions>0||r.deadLettersWithoutReason>0) throw new Error(\"queue recovery\"); if(r.oldestMessageAgeSeconds>r.lagSloSeconds) throw new Error(\"queue lag\");" },
  ],
  "Integrations e marketplace": [
    { lang: "json", purpose: "Inventaria fornecedor, scopes, dados, side effects, custo e offboarding.", code: "{ \"vendor\": \"synthetic-observer\", \"owner\": \"platform\", \"environments\": [\"preview\"], \"scopes\": [\"deployment:read\"], \"forbiddenScopes\": [\"project:admin\", \"secrets:read\"], \"dataClasses\": [\"deployment-metadata\"], \"sideEffects\": [\"webhook\"], \"monthlyBudgetUsd\": 50, \"tokenRotationDays\": 30, \"offboarding\": [\"disable\", \"export\", \"revoke\", \"remove-webhook\", \"delete-data\", \"verify-no-calls\"] }" },
    { lang: "bash", purpose: "Compara inventário antes e depois do uninstall e exige revoke verificável.", code: "set -euo pipefail\njq -e '.forbiddenGranted == 0 and .clientExposedSecrets == 0 and .unknownResources == 0' reports/integration-install.json >/dev/null\njq -e '.tokensActive == 0 and .webhooksRemaining == 0 and .variablesRemaining == 0 and .resourcesRemaining == 0 and .billingActive == false' reports/integration-uninstall.json >/dev/null\njq -e '.deletionReceipt != null and .callsAfterRevoke == 0 and .auditComplete == true' reports/integration-offboarding.json >/dev/null" },
  ],
  "RBAC, SSO e workloads": [
    { lang: "json", purpose: "Declara papéis, groups, service identities, expiry e separação de ambientes.", code: "{ \"team\": \"platform\", \"roles\": [{ \"subject\": \"group:developers\", \"projects\": [\"quiron\"], \"role\": \"developer\", \"environments\": [\"development\", \"preview\"] }, { \"subject\": \"service:release\", \"projects\": [\"quiron\"], \"role\": \"deployer\", \"environments\": [\"production\"], \"expiresAt\": \"2026-12-31T00:00:00Z\" }], \"requireSso\": true, \"requireMfa\": true, \"forbidPersonalTokensInCi\": true }" },
    { lang: "javascript", purpose: "Reprova privilégio excessivo, segredo em fork e token válido após offboarding.", code: "const r=pm.response.json(); if(r.unknownOwners>0||r.excessiveGrants>0) throw new Error(\"rbac drift\"); if(r.forkReceivedProductionSecrets||r.personalAdminTokensInCi>0) throw new Error(\"workload identity\"); if(r.offboardedSessionsActive>0||r.offboardedTokensActive>0) throw new Error(\"revoke SLO\"); pm.test(\"SSO enforced\",()=>pm.expect(r.ssoBypasses).to.equal(0));" },
  ],
  "Firewall, WAF e DDoS": [
    { lang: "json", purpose: "Versiona regras, rate limits, exceções temporárias e corpus obrigatório.", code: "{ \"rules\": [{ \"id\": \"block-admin-injection\", \"scope\": [\"/admin/**\"], \"action\": \"deny\", \"priority\": 10, \"owner\": \"security\" }, { \"id\": \"api-rate\", \"scope\": [\"/api/**\"], \"action\": \"rate-limit\", \"key\": \"authenticated-subject\", \"burst\": 20, \"sustainedPerMinute\": 60 }], \"emergencyRuleMaximumHours\": 4, \"requireOriginBypassTest\": true, \"requireLegitimateCorpus\": true }" },
    { lang: "javascript", purpose: "Compara corpus malicioso e legítimo, origem e expiry das exceções.", code: "const r=pm.response.json(); if(r.maliciousAllowed>0||r.originBypassSucceeded) throw new Error(\"firewall bypass\"); if(r.legitimateBlocked>0||r.webhookChallenges>0) throw new Error(\"false positive\"); if(r.expiredEmergencyRules>0||r.unboundedRateLimitKeys>0) throw new Error(\"unsafe rule lifecycle\"); if(r.originPeakRequests>r.originBudget) throw new Error(\"DDoS amplification\");" },
  ],
  "Supply chain e provenance": [
    { lang: "json", purpose: "Liga source, toolchain, lockfile, SBOM, artifact e deployment por digest.", code: "{ \"source\": { \"commit\": \"0123456789abcdef0123456789abcdef01234567\", \"tree\": \"89abcdef0123456789abcdef0123456789abcdef\" }, \"toolchain\": { \"node\": \"22.20.0\", \"packageManager\": \"npm@11.6.0\" }, \"lockfileSha256\": \"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\", \"artifactSha256\": \"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\", \"requireSbom\": true, \"promoteWithoutRebuild\": true }" },
    { lang: "bash", purpose: "Verifica digests, SBOM, secret canary e identidade do artifact promovido.", code: "set -euo pipefail\njq -e '.sourceApproved and .lockfileFrozen and .builderPinned and .attestationVerified' reports/provenance.json >/dev/null\njq -e '.components > 0 and .artifactDigest == input_filename' --arg input_filename \"$(jq -r '.artifactSha256' reports/provenance.json)\" reports/sbom-summary.json >/dev/null\njq -e '.clientFindings == 0 and .logFindings == 0 and .sourceMapFindings == 0' reports/secret-canary.json >/dev/null\ntest \"$(jq -r '.candidateArtifact' reports/promotion.json)\" = \"$(jq -r '.promotedArtifact' reports/promotion.json)\"" },
  ],
  "Incidentes, revoke e audit": [
    { lang: "json", purpose: "Ordena contenção, revoke, preservação, rebuild e recovery com owners.", code: "{ \"severity\": \"SEV-1\", \"commander\": \"incident-commander\", \"actions\": [\"lock-deployments\", \"remove-compromised-alias\", \"revoke-token\", \"rotate-dependent-secrets\", \"export-audit\", \"rebuild-from-trusted-source\", \"run-security-canary\", \"restore-traffic\"], \"forbidCompromisedConfigRollback\": true, \"requireNegativeRevokeProbe\": true, \"evidenceRetentionDays\": 365 }" },
    { lang: "javascript", purpose: "Impede fechar incidente sem revoke, cadeia de evidência e recovery confiável.", code: "const r=pm.response.json(); if(r.compromisedTokensActive>0||r.oldSecretsReactivated>0) throw new Error(\"containment incomplete\"); if(!r.auditExportDigest||r.evidenceDeletedEarly) throw new Error(\"evidence chain\"); if(!r.rebuildAttested||r.securityCanaryFailures>0) throw new Error(\"unsafe recovery\"); if(r.monitoringWindowOpen||r.unownedActions>0) throw new Error(\"incident not ready to close\");" },
  ],
  "Runtime e build logs": [
    { lang: "json", purpose: "Define schema, redaction, retenção e SLO de entrega por stream.", code: "{ \"streams\": [\"build\", \"function\", \"edge\", \"platform\"], \"requiredFields\": [\"timestamp\", \"level\", \"event\", \"requestId\", \"deploymentId\", \"routeTemplate\", \"outcome\"], \"forbiddenFields\": [\"authorization\", \"cookie\", \"requestBody\", \"environment\"], \"retentionDays\": 30, \"maximumDeliveryLagSeconds\": 60, \"maximumDroppedEventsPercent\": 0.1 }" },
    { lang: "javascript", purpose: "Reprova canaries, cardinalidade, perda do drain e correlação incompleta.", code: "const r=pm.response.json(); if(r.secretCanaryFindings>0||r.piiFindings>0) throw new Error(\"unsafe logs\"); if(r.unboundedLabels>0||r.unknownSchemaFields>0) throw new Error(\"log schema\"); if(r.deliveryLagSeconds>r.maximumDeliveryLagSeconds||r.droppedPercent>r.maximumDroppedPercent) throw new Error(\"drain SLO\"); if(r.uncorrelatedErrors>0) throw new Error(\"missing release correlation\");" },
  ],
  "Analytics e tracing seguro": [
    { lang: "json", purpose: "Allowlista eventos, atributos de spans, sampling e destinos de telemetry.", code: "{ \"analytics\": { \"events\": [\"page_view\", \"checkout_completed\"], \"allowedProperties\": [\"routeTemplate\", \"release\", \"deviceClass\"], \"forbiddenProperties\": [\"email\", \"query\", \"fullUrl\"] }, \"tracing\": { \"allowedAttributes\": [\"http.route\", \"http.request.method\", \"deployment.id\"], \"maximumBaggageBytes\": 1024, \"errorSampleRate\": 1, \"baselineSampleRate\": 0.05 }, \"retentionDays\": 30 }" },
    { lang: "javascript", purpose: "Verifica consentimento, cardinalidade, propagação e overhead de instrumentação.", code: "const r=pm.response.json(); if(r.preConsentRequests>0||r.revokedRequests>0) throw new Error(\"consent violation\"); if(r.piiAttributes>0||r.cardinality>r.cardinalityBudget) throw new Error(\"telemetry privacy\"); if(r.missingCriticalSpans>0||r.secretBaggageAccepted) throw new Error(\"trace propagation\"); if(r.instrumentationP95OverheadMs>r.overheadBudgetMs) throw new Error(\"telemetry overhead\");" },
  ],
  "SLO, alerts e synthetic": [
    { lang: "json", purpose: "Versiona SLI, target, burn alerts, synthetic journey e ownership.", code: "{ \"slo\": { \"name\": \"reservation-correctness\", \"windowDays\": 30, \"target\": 0.999, \"good\": \"correct-response-with-one-effect-within-1500ms\", \"total\": \"eligible-reservation-attempts\" }, \"alerts\": [{ \"shortWindowMinutes\": 5, \"longWindowMinutes\": 60, \"burnRate\": 14.4, \"severity\": \"page\" }], \"synthetic\": { \"tenant\": \"synthetic\", \"regions\": [\"gru1\"], \"requireCleanup\": true }, \"owner\": \"checkout\" }" },
    { lang: "javascript", purpose: "Recalcula SLO e exige routing, canary abort, efeitos e cleanup seguros.", code: "const r=pm.response.json(); const computed=r.good/r.total; if(Math.abs(computed-r.dashboardValue)>0.000001) throw new Error(\"SLO mismatch\"); if(r.alertsExpected!==r.alertsDelivered||r.unownedAlerts>0) throw new Error(\"alert routing\"); if(r.duplicateSyntheticEffects>0||r.syntheticLeaks>0) throw new Error(\"unsafe synthetic\"); if(r.regressiveCanaryPromoted) throw new Error(\"canary policy\");" },
  ],
  "Usage, quotas e budgets": [
    { lang: "json", purpose: "Mantém forecast, headroom, budgets e guardrails por unidade de uso.", code: "{ \"units\": [\"bandwidthBytes\", \"invocations\", \"durationMs\", \"buildMinutes\", \"imageTransforms\", \"storageBytes\"], \"forecastHorizonDays\": 90, \"minimumHeadroomPercent\": 30, \"budgetAlertsPercent\": [50, 75, 90], \"guardrails\": { \"maximumPreviewLifetimeHours\": 72, \"maximumImageWidths\": 8, \"maximumRetries\": 3, \"boundedCacheKeys\": true }, \"preserveProductionCapacity\": true }" },
    { lang: "javascript", purpose: "Detecta consumo anormal, quota baixa, projeto órfão e falsa economia.", code: "const r=pm.response.json(); if(r.unownedProjects>0||r.unknownSpend>r.unknownSpendBudget) throw new Error(\"cost attribution\"); if(r.headroomPercent<r.minimumHeadroomPercent||r.forecastOverBudget) throw new Error(\"capacity budget\"); if(r.previewStormNotContained||r.cacheCardinality>r.cacheKeyBudget) throw new Error(\"missing guardrail\"); if(r.claimedSavings&&!r.normalizedSavingsConfirmed) throw new Error(\"unverified optimization\");" },
  ],
  "CLI e identidade de CI": [
    { lang: "json", purpose: "Fixa identidade, destino, versão do CLI e condições seguras do pipeline.", code: "{ \"cliVersion\": \"vercel@pinned\", \"teamId\": \"team_synthetic\", \"projectId\": \"prj_quiron\", \"environments\": [\"preview\", \"production\"], \"identity\": { \"kind\": \"oidc\", \"audience\": \"vercel-deploy\", \"maximumLifetimeSeconds\": 900 }, \"forbidPersonalTokens\": true, \"forbidForkSecrets\": true, \"requireDestinationMatch\": true }" },
    { lang: "bash", purpose: "Interrompe o pipeline quando contexto, token ou artifact não satisfazem o manifest.", code: "set -euo pipefail\njq -e '.teamId == \"team_synthetic\" and .projectId == \"prj_quiron\" and .identity.kind == \"oidc\"' reports/ci-context.json >/dev/null\njq -e '.forkSecretsExposed == false and .personalTokens == 0 and .secretCanaryFindings == 0' reports/ci-security.json >/dev/null\njq -e '.destinationMatchesManifest and .cliVersionPinned and .expiredTokenRejected' reports/ci-preflight.json >/dev/null" },
  ],
  "Build once e promote": [
    { lang: "json", purpose: "Relaciona source, config, artifact, candidate e alias em uma cadeia imutável.", code: "{ \"sourceSha\": \"0123456789abcdef0123456789abcdef01234567\", \"lockfileSha256\": \"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\", \"configDigest\": \"cfg-synthetic\", \"artifactSha256\": \"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\", \"candidateDeployment\": \"dpl_candidate\", \"promoteWithoutRebuild\": true, \"requireMultiregionConvergence\": true }" },
    { lang: "javascript", purpose: "Reprova rebuild, digest divergente, canary no alias e propagation além do SLO.", code: "const r=pm.response.json(); if(r.rebuiltDuringPromotion||r.candidateArtifact!==r.promotedArtifact) throw new Error(\"artifact changed\"); if(r.canaryTarget!==r.candidateDeployment) throw new Error(\"canary identity\"); if(r.cacheConvergenceSeconds>r.cacheConvergenceSloSeconds) throw new Error(\"cache propagation\"); if(r.configDigest!==r.promotedConfigDigest) throw new Error(\"config drift\");" },
  ],
  "Checks, approvals e gates": [
    { lang: "json", purpose: "Define checks obrigatórios, approval vinculada e override com expiração.", code: "{ \"requiredChecks\": [\"typecheck\", \"contracts\", \"secret-canary\", \"provenance\", \"performance\", \"auth-negative\"], \"approval\": { \"bind\": [\"sourceSha\", \"artifactSha256\", \"configDigest\"], \"maximumAgeMinutes\": 60, \"separationOfDuties\": true }, \"overrides\": { \"requireReason\": true, \"maximumMinutes\": 30, \"requirePostReview\": true }, \"forbidProductionFixtures\": true }" },
    { lang: "javascript", purpose: "Confirma que o gate corresponde ao change e que bypasses não permanecem ativos.", code: "const r=pm.response.json(); if(r.missingRequiredChecks.length||r.checkArtifactMismatch) throw new Error(\"incomplete gates\"); if(r.staleApprovalAccepted||r.selfApprovedCriticalException) throw new Error(\"approval bypass\"); if(r.productionDataInPreview||r.policyDrift>0) throw new Error(\"unsafe environment\"); if(r.activeOverridesWithoutExpiry>0) throw new Error(\"override audit\");" },
  ],
  "Rollback e recovery coordenado": [
    { lang: "json", purpose: "Versiona a matriz de compatibilidade e a sequência de rollback/reconciliação.", code: "{ \"rollback\": { \"candidate\": \"dpl_last_known_good\", \"requireProvenance\": true, \"compatibility\": [\"code-schema\", \"code-config\", \"assets-html\", \"worker-events\"], \"steps\": [\"contain\", \"revoke\", \"select\", \"move-alias\", \"probe\", \"reconcile-effects\", \"monitor\"], \"forbidRevivingCompromisedSecrets\": true, \"minimumMonitoringMinutes\": 30 } }" },
    { lang: "bash", purpose: "Exige restore compatível, converge alias/cache e efeitos reconciliados antes do encerramento.", code: "set -euo pipefail\njq -e '.artifactAttested and .schemaCompatible and .configCompatible and .oldSecretsReactivated == false' reports/rollback-selection.json >/dev/null\njq -e '.aliasDigest == .expectedDigest and .asset404s == 0 and .cacheConverged == true' reports/rollback-probes.json >/dev/null\njq -e '.duplicateProviderEffects == 0 and .unreconciledOutbox == 0 and .monitoringWindowComplete == true' reports/rollback-recovery.json >/dev/null" },
  ],
  "Baseline do projeto Quíron": [
    { lang: "json", purpose: "Materializa manifest reprodutível de source, build, config, routes e owners.", code: "{ \"project\": \"quiron\", \"rootDirectory\": \".\", \"runtime\": \"nodejs\", \"packageManager\": \"npm@11.6.0\", \"lockfileRequired\": true, \"environments\": [\"preview\", \"production\"], \"routeContracts\": [\"catalog\", \"account\", \"reservation\"], \"owners\": { \"platform\": \"platform-team\", \"checkout\": \"checkout-team\" }, \"requireCleanCheckout\": true }" },
    { lang: "bash", purpose: "Audita checkout limpo, schema, artifact e grafo afetado antes do candidate.", code: "set -euo pipefail\ngit diff --exit-code\nnpm ci\nnpm run typecheck\njq -e '.unknownEnvironmentFields == 0 and .previewUsesProduction == false' reports/quiron-config.json >/dev/null\njq -e '.assetsMissing == 0 and .secretCanaryFindings == 0 and .affectedProjectsBuilt == true' reports/quiron-artifact.json >/dev/null" },
  ],
  "Última vaga em Functions": [
    { lang: "json", purpose: "Define invariante de reserva, idempotência, outbox e observer independente.", code: "{ \"inventory\": { \"item\": \"course-advanced\", \"initialStock\": 1 }, \"request\": { \"tenant\": \"synthetic\", \"idempotencyKey\": \"reserve-001\" }, \"transaction\": { \"requireAtomicDecision\": true, \"requireOutbox\": true }, \"observer\": [\"reservation-row\", \"outbox-event\", \"provider-receipt\"], \"retry\": { \"preserveKey\": true, \"maximumAttempts\": 3 } }" },
    { lang: "javascript", purpose: "Exige uma reserva e um efeito mesmo com concorrência, timeout e redelivery.", code: "const r=pm.response.json(); if(r.reservations!==1||r.outboxEvents!==1||r.providerEffects!==1) throw new Error(\"last-seat invariant\"); if(r.finalStock<0||r.crossTenantIdempotencyAccepted) throw new Error(\"state isolation\"); if(r.timeoutAfterCommit&&r.retryCreatedNewDecision) throw new Error(\"unknown outcome retry\"); if(r.unreconciledEvents>0) throw new Error(\"outbox recovery\");" },
  ],
  "Release, domínio e canary": [
    { lang: "json", purpose: "Vincula candidate, checks, alias, domínio, TLS e probes de convergência.", code: "{ \"candidate\": { \"deploymentId\": \"dpl_candidate\", \"artifactDigest\": \"sha256:synthetic\", \"protected\": true }, \"promotion\": { \"requireCandidateIdentity\": true, \"alias\": \"app.example.invalid\", \"canaryRegions\": [\"gru1\", \"iad1\"], \"rollbackThreshold\": \"security-or-correctness-failure\" }, \"domain\": { \"requireTls\": true, \"requireCanonical\": true, \"maximumConvergenceSeconds\": 300 } }" },
    { lang: "bash", purpose: "Reprova candidate divergente, TLS/canonical incorreto, cache stale e rollback incompleto.", code: "set -euo pipefail\njq -e '.canaryDeployment == .candidateDeployment and .promotedArtifact == .candidateArtifact' reports/canary.json >/dev/null\njq -e '.tlsValid and .canonicalValid and .redirectLoops == 0' reports/domain-probes.json >/dev/null\njq -e '.cacheConverged and .regionalRegressions == 0 and .asset404s == 0' reports/promotion-monitor.json >/dev/null\njq -e '.rollbackTested and .oldSecretsReactivated == false' reports/recovery.json >/dev/null" },
  ],
  "Banca, incidente e restore Vercel": [
    { lang: "json", purpose: "Orquestra cenário de incidente, papéis, revoke, restore e critérios de fechamento.", code: "{ \"scenario\": [\"leaked-token\", \"config-drift\", \"duplicate-function-effect\"], \"roles\": [\"commander\", \"security\", \"deploy\", \"data-owner\", \"observer\"], \"containment\": [\"lock-deploys\", \"revoke-token\", \"restrict-egress\"], \"recovery\": [\"attested-artifact\", \"config-reconcile\", \"effect-reconcile\", \"canary\"], \"closeWhen\": [\"oldTokenRejected\", \"oneEffect\", \"domainConverged\", \"actionsOwned\"] }" },
    { lang: "javascript", purpose: "Impede encerrar banca com token ativo, drift, efeitos duplicados ou evidência ausente.", code: "const r=pm.response.json(); if(r.oldTokenAccepted||r.activeCompromisedIntegrations>0) throw new Error(\"revoke incomplete\"); if(r.configDrift>0||r.restoredCompromisedSecrets>0) throw new Error(\"unsafe restore\"); if(r.reservations!==1||r.providerEffects!==1) throw new Error(\"effect reconciliation\"); if(!r.auditDigest||r.unownedActions>0||!r.monitoringWindowComplete) throw new Error(\"incident evidence\");" },
  ],
};
