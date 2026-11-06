/** Dois exemplos específicos por seção; ausência bloqueia materialização. */
export const SUPABASE_EXAMPLES: Record<string, readonly [string, string]> = {
  "Projeto, região e componentes": [
    `import { createClient } from '@supabase/supabase-js';
const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!);
const { data, error } = await client.from('health_probe').select('id').limit(1);
if (error) throw new Error(\`Data API indisponível: \${error.code}\`);
console.log({ rows: data.length });`,
    `const checks = await Promise.allSettled([checkDataApi(), checkAuth(), checkStorage(), checkRealtime()]);
const report = checks.map((result, index) => ({ component: ['data','auth','storage','realtime'][index], status: result.status }));
if (report.some((item) => item.status === 'rejected')) throw new Error(JSON.stringify(report));`,
  ],
  "URL, publishable key e clientes": [
    `import { createClient } from '@supabase/supabase-js';
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
const { data: { user } } = await supabase.auth.getUser();
const { data, error } = await supabase.from('profiles').select('id').eq('id', user?.id ?? '').maybeSingle();
if (error) throw error;`,
    `if ('SUPABASE_SERVICE_ROLE_KEY' in import.meta.env) throw new Error('Credencial privilegiada não pode entrar no bundle');
const forbidden = ['service_role', 'secret'];
for (const marker of forbidden) if (JSON.stringify(import.meta.env).includes(marker)) throw new Error('Env inseguro');`,
  ],
  "PostgREST, schemas e contratos": [
    `type Database = { public: { Tables: { tasks: { Row: { id: string; title: string; version: number } } } } };
const { data, error } = await supabase.from('tasks').select('id,title,version').order('id').limit(20);
if (error) throw new Error(\`\${error.code}: \${error.message}\`);
data satisfies Database['public']['Tables']['tasks']['Row'][];`,
    `const { data, error } = await supabase.rpc('task_summary', { p_tenant_id: tenantId });
if (error?.code === 'PGRST202') throw new Error('Schema cache/assinatura RPC divergente');
if (error) throw error;
assertSummaryShape(data);`,
  ],
  "Ambientes, configuração e secrets": [
    `const expectedRef = process.env.EXPECTED_SUPABASE_PROJECT_REF!;
const actualRef = new URL(process.env.SUPABASE_URL!).hostname.split('.')[0];
if (actualRef !== expectedRef) throw new Error(\`Projeto inesperado: \${actualRef}\`);
if (process.env.NODE_ENV !== 'production') await assertDisposableDatabase();`,
    `const forbiddenHosts = [/prod/i, /production/i];
if (process.env.CI && forbiddenHosts.some((pattern) => pattern.test(process.env.SUPABASE_URL ?? ''))) {
  throw new Error('Fixture de preview recusou endpoint de produção');
}
await applySeed({ destructive: false, namespace: process.env.PREVIEW_ID! });`,
  ],
  "Tabelas, tipos e constraints": [
    `const ddl = \`create table public.tasks(id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), title text not null check(length(title) between 1 and 200), created_at timestamptz not null default now())\`;
await migrationSql(ddl);
await expectConstraint('tasks_title_check', () => insertTask({ title: '' }));`,
    `const { error } = await supabase.from('tasks').insert({ owner_id: crypto.randomUUID(), title: 'órfã' });
if (error?.code !== '23503') throw new Error(\`Esperava FK 23503, recebeu \${error?.code}\`);
const { count } = await supabase.from('tasks').select('*', { count: 'exact', head: true });
if (count !== 0) throw new Error('Estado parcial');`,
  ],
  "Queries, filtros e paginação": [
    `const page = await supabase.from('tasks').select('id,title,created_at', { count: 'exact' })
  .eq('status', 'open').order('created_at', { ascending: false }).order('id', { ascending: false }).range(0, 19);
if (page.error) throw page.error;
if ((page.data?.length ?? 0) > 20) throw new Error('Limite violado');`,
    `const cursor = { created_at: '2026-09-11T10:00:00Z', id: '00000000-0000-0000-0000-000000000123' };
const { data, error } = await supabase.from('tasks').select('id,created_at')
  .or(\`created_at.lt.\${cursor.created_at},and(created_at.eq.\${cursor.created_at},id.lt.\${cursor.id})\`)
  .order('created_at', { ascending: false }).order('id', { ascending: false }).limit(20);
if (error) throw error;`,
  ],
  "Insert, update, upsert e retorno": [
    `const { data, error } = await supabase.from('commands').insert({ request_key: requestKey, payload }).select('id,request_key,status').single();
if (error?.code === '23505') return await loadByRequestKey(requestKey);
if (error) throw error;
return data;`,
    `const { data, error } = await supabase.from('tasks').update({ status: 'done', version: version + 1 })
  .eq('id', id).eq('version', version).select('id,version').maybeSingle();
if (error) throw error;
if (!data) throw new Error('Conflito otimista');`,
  ],
  "RPC, transações e funções": [
    `const { data, error } = await supabase.rpc('reserve_inventory', { p_sku: sku, p_qty: qty, p_request_key: requestKey });
if (error) throw new Error(\`\${error.code}: \${error.message}\`);
if (!data?.reservation_id) throw new Error('Contrato RPC inválido');`,
    `const sql = \`create function public.reserve_inventory(p_sku text,p_qty int,p_request_key uuid) returns uuid language plpgsql security invoker as $$ declare v_id uuid; begin update inventory set available=available-p_qty where sku=p_sku and available>=p_qty; if not found then raise exception using errcode='P0001'; end if; insert into reservations(request_key,sku,qty) values(p_request_key,p_sku,p_qty) returning id into v_id; return v_id; end $$\`;
await migrationSql(sql);`,
  ],
  "Signup, confirmação e identidades": [
    `const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: callbackUrl } });
if (error) throw error;
if (data.user && !data.session) showPendingConfirmation();`,
    `const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user?.email_confirmed_at) throw new Error('Identidade ainda não confirmada');
await ensureProfile(user.id);`,
  ],
  "Access token, refresh e sessão": [
    `const { data: { session }, error } = await supabase.auth.getSession();
if (error) throw error;
if (session && session.expires_at! * 1000 < Date.now() + 60_000) await supabase.auth.refreshSession();`,
    `const { data: listener } = supabase.auth.onAuthStateChange((event, session) => queueMicrotask(() => syncSession(event, session)));
try { await runAuthenticatedUi(); } finally { listener.subscription.unsubscribe(); }`,
  ],
  "PKCE, SSR e cookies": [
    `const server = createServerClient(url, key, { cookies: { getAll: () => request.cookies.getAll(), setAll: (items) => items.forEach((c) => response.cookies.set(c.name, c.value, c.options)) } });
const { data: { user } } = await server.auth.getUser();
if (!user) return redirect('/login');`,
    `const code = new URL(request.url).searchParams.get('code');
if (!code) return new Response('Código ausente', { status: 400 });
const { error } = await server.auth.exchangeCodeForSession(code);
if (error) return new Response('Fluxo PKCE inválido', { status: 401 });`,
  ],
  "MFA, recovery e lifecycle": [
    `const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
if (error) throw error;
if (data.currentLevel !== 'aal2') throw new Error('Operação exige MFA verificado');`,
    `const { data, error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
if (error) throw error;
await performSensitiveChange({ sessionId: data.id });`,
  ],
  "Habilitar RLS e default deny": [
    `await migrationSql(\`alter table public.tasks enable row level security;
create policy tasks_select_own on public.tasks for select to authenticated using (owner_id = (select auth.uid()));\`);`,
    `const attacker = createClient(url, publishableKey, { global: { headers: { Authorization: \`Bearer \${otherUserToken}\` } } });
const { data, error } = await attacker.from('tasks').select('id').eq('id', victimTaskId);
if (error || data.length !== 0) throw new Error('Default deny/isolamento falhou');`,
  ],
  "USING, WITH CHECK e ownership": [
    `await migrationSql(\`create policy tasks_update_own on public.tasks for update to authenticated
using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));\`);`,
    `const { data, error } = await supabase.from('tasks').update({ owner_id: otherUserId }).eq('id', ownTaskId).select('id');
if (!error || data?.length) throw new Error('Transferência de ownership deveria ser negada');`,
  ],
  "auth.uid, claims e tenants": [
    `await migrationSql(\`create policy tenant_members on public.documents for select to authenticated using (
exists(select 1 from public.memberships m where m.tenant_id=documents.tenant_id and m.user_id=(select auth.uid())));\`);`,
    `const claims = await verifiedClaims(request);
if (claims.user_metadata?.role === 'admin') throw new Error('user_metadata editável não concede papel');
const membership = await loadMembership(claims.sub, tenantId);`,
  ],
  "Policies, índices e testes adversariais": [
    `await migrationSql(\`create index memberships_user_tenant_idx on public.memberships(user_id,tenant_id);
create index documents_tenant_id_idx on public.documents(tenant_id,id);\`);
await assertPolicyPlanUsesIndex('documents_select', authenticatedClaims);`,
    `for (const actor of [anonymous, owner, stranger, support]) {
  const result = await actor.client.from('documents').select('id,tenant_id').eq('id', fixture.id);
  assertVisibilityMatrix(actor.name, result);
}`,
  ],
  "Buckets, paths e ownership": [
    `const objectKey = \`\${tenantId}/\${user.id}/\${crypto.randomUUID()}.bin\`;
const { error } = await supabase.storage.from('private-files').upload(objectKey, bytes, { upsert: false });
if (error) throw error;
await assertCannotDownload(strangerClient, 'private-files', objectKey);`,
    `const policy = \`create policy "tenant members insert" on storage.objects for insert to authenticated with check (bucket_id='private-files' and (storage.foldername(name))[1] in (select tenant_id::text from public.memberships where user_id=(select auth.uid()) and status='active'))\`;
await migrationSql(policy);
await assertStorageMatrix({ bucket: 'private-files', owner, stranger, formerMember });`,
  ],
  "Upload, MIME, tamanho e integridade": [
    `const intent = await createUploadIntent({ purpose: 'avatar', declaredBytes: file.size, requestKey });
if (file.size > intent.maxBytes) throw new Error('Arquivo excede limite');
const { error } = await supabase.storage.from(intent.bucket).upload(intent.key, file, { contentType: 'application/octet-stream', upsert: false });
if (error) throw error;
await enqueueInspection(intent.id);`,
    `const observed = await inspectStoredObject(job.bucket, job.key, { max: 20_000 });
if (observed.bytes > job.maxBytes || !ALLOWED_SIGNATURES.has(observed.detectedType)) {
  await rejectAndQuarantine(job.id, observed.sha256);
} else {
  await activateUpload(job.id, { sha256: observed.sha256, bytes: observed.bytes, scannerVersion: observed.scannerVersion });
}`,
  ],
  "URLs públicas e assinadas": [
    `const grant = await requireActiveDownloadGrant({ userId: user.id, objectId });
const { data, error } = await admin.storage.from(grant.bucket).createSignedUrl(grant.key, 120, { download: grant.safeFilename });
if (error) throw error;
return Response.json({ url: redactFromLogs(data.signedUrl), expiresIn: 120 }, { headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });`,
    `const leaked = capturedLogs.filter((entry) => new RegExp('token=|/sign/', 'i').test(entry.message));
if (leaked.length) throw new Error('URL assinada apareceu em log');
clock.advance({ seconds: 121 });
await expectHttpStatus(previousSignedUrl, 400);
await expectDenied(() => issueUrlFor(stranger, objectId));`,
  ],
  "Lifecycle, órfãos e consistência": [
    `const job = await claimUploadJob({ workerId, leaseMs: 30_000 });
if (job) {
  const object = await ensureObjectAndInspect(job);
  await activateIfCurrentVersion({ uploadId: job.uploadId, version: job.version, sha256: object.sha256 });
  await acknowledgeJob(job.id, workerId);
}`,
    `const report = await reconcileStorage({ bucket: 'private-files', olderThan: clock.minus('1 hour'), dryRun: true });
if (report.activeMissing.length) await alertDataLoss(report.activeMissing);
for (const orphan of report.unreferencedObjects) await quarantineExactKey(orphan.bucket, orphan.key);
await assertNoActiveReferenceWasDeleted(report);`,
  ],
  "Channels, tópicos e lifecycle": [
    `const channel = supabase.channel(\`tenant:\${tenantId}:tasks\`, { config: { private: true } });
const ready = deferred<void>();
channel.on('broadcast', { event: 'changed' }, ({ payload }) => applyVersionedSignal(payload));
channel.subscribe((status) => status === 'SUBSCRIBED' ? ready.resolve() : observeStatus(status));
try { await ready.promise; await reconcileFromDatabase(); } finally { await supabase.removeChannel(channel); }`,
    `for (let cycle = 0; cycle < 100; cycle++) { const dispose = mountRealtimePanel(); await dispose(); }
if (supabase.getChannels().length !== 0) throw new Error('Channel vazou após cleanup');
await simulateOfflineCommitAndReconnect();
expectProjection(await readUi()).toEqual(await readDatabase());`,
  ],
  "Broadcast e autorização": [
    `const envelope = SignalSchema.parse({ event: 'task.changed', aggregateId: task.id, version: task.version, messageId: crypto.randomUUID() });
const result = await channel.send({ type: 'broadcast', event: envelope.event, payload: envelope });
if (result !== 'ok') await enqueueSignalRetry(envelope.messageId);`,
    `for (const actor of [member, stranger, formerMember]) {
  const probe = await attemptPrivateBroadcast(actor, \`room:\${roomId}\`, { event: 'cursor', aggregateId: roomId, version: 1 });
  assertBroadcastMatrix(actor.name, probe);
}
await assertConvergesWhenMessagesAreDroppedDuplicatedAndReordered();`,
  ],
  "Presence e reconciliação": [
    `const users = new Map<string, Set<string>>();
channel.on('presence', { event: 'sync' }, () => {
  users.clear();
  for (const metas of Object.values(channel.presenceState())) for (const meta of metas) addConnection(users, PresenceMeta.parse(meta));
  renderOnlineUsers(users);
});
await channel.track({ deviceId, status: 'viewing', schemaVersion: 1 });`,
    `const sequences = [twoTabsThenOneLeaves(), reconnectBeforeOldLeave(), leaveBeforeSync(), forgedUserMetadata()];
for (const events of sequences) {
  const projection = replayPresence(events);
  assertProjectionMatchesReferences(projection);
  if (projection.trustedRoles.size) throw new Error('Presence concedeu autorização');
}`,
  ],
  "Postgres Changes e escala": [
    `const changes = supabase.channel(\`tenant:\${tenantId}:db\`).on('postgres_changes', {
  event: '*', schema: 'public', table: 'tasks', filter: \`tenant_id=eq.\${tenantId}\`
}, (event) => applyOrRefetchByVersion(event));
await subscribeOrThrow(changes);
await loadSnapshotAndMergeBufferedChanges();`,
    `const benchmark = await runRealtimeFanoutGate({ rows: 100_000, tenants: 100, subscribers: 500, changesPerSecond: 50 });
if (benchmark.p95LagMs > 1_000 || benchmark.crossTenantDeliveries !== 0) throw new Error('Gate Realtime reprovado');
await simulateGapDuringSnapshot();
expectProjection(await readUi()).toEqual(await readDatabase());`,
  ],
  "Deno runtime, request e resposta": [
    `Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
  if (request.method !== 'POST') return json({ code: 'method_not_allowed', requestId }, 405);
  const command = CommandSchema.parse(await readJsonWithinLimit(request, 32_768));
  return await withDeadline(8_000, (signal) => executeCommand(command, { requestId, signal }));
});`,
    `const response = await invokeFunction({ body: malformedJsonOverLimit, timeoutMs: 9_000 });
if (response.status !== 413) throw new Error('Limite de body não aplicado');
await fakeProvider.acceptThenDropConnection(requestKey);
await invokeFunctionTwice({ requestKey });
await assertSingleDurableEffect(requestKey);`,
  ],
  "JWT, CORS e autorização": [
    `const bearer = requireBearer(request.headers.get('authorization'));
const userClient = createClient(SUPABASE_URL, PUBLISHABLE_KEY, { global: { headers: { Authorization: \`Bearer \${bearer}\` } } });
const { data: { user }, error } = await userClient.auth.getUser();
if (error || !user) return json({ code: 'unauthenticated' }, 401);
const result = await userClient.rpc('approve_invoice', { p_invoice_id: command.invoiceId });`,
    `for (const probe of [expiredToken, tokenFromOtherProject, memberToken, formerMemberToken]) {
  const result = await invokeAs(probe, { invoiceId: foreignInvoiceId, origin: 'https://app.example.com.attacker.test' });
  assertAuthorizationMatrix(probe.name, result);
}
assertNoJwtInLogs(capturedLogs);`,
  ],
  "Secrets e service role": [
    `const admin = createScopedAdminGateway({ url: requireEnv('SUPABASE_URL'), secret: requireEnv('SUPABASE_SECRET_KEY') });
const actor = await authenticateAndAuthorize(request, 'inbox:create');
await admin.insertVerifiedInbox({ tenantId: actor.tenantId, providerEventId, payloadHash });
// O gateway não expõe from(), storage ou auth.admin ao handler.`,
    `await rotateSecret({ deployNewVersion: true, verifyFingerprint: true, revokeOldVersion: true });
for (const artifact of [browserBundle, capturedLogs, traceExport, errorResponses]) {
  if ( containsSecretMarker(artifact)) throw new Error('Secret vazou');
}
await assertOldCredentialRejected();`,
  ],
  "Webhooks, idempotência e retries": [
    `const raw = new Uint8Array(await request.arrayBuffer());
verifyWebhook({ raw, signature: request.headers.get('provider-signature'), now: clock.now() });
const event = ProviderEventSchema.parse(JSON.parse(new TextDecoder().decode(raw)));
const inserted = await insertInboxOnce({ provider: 'payments', eventId: event.id, payloadHash: sha256(raw), event });
return json({ accepted: inserted || 'duplicate' }, 202);`,
    `await Promise.all(Array.from({ length: 10 }, () => deliverSameSignedEvent(event)));
await worker.crashAfterRemoteCommitBeforeAcknowledgement(event.id);
await worker.retry(event.id);
if (await countLogicalEffects(event.aggregateId) !== 1) throw new Error('Idempotência falhou');
await assertOutOfOrderEventsConverge();`,
  ],
  "Supabase CLI e stack local": [
    `const status = await runSupabaseCli(['status', '--output', 'json']);
assertLocalEndpoints(status);
assertNotProductionProject(status, approvedLocalProjectRefs);
await runSupabaseCli(['db', 'reset']);
await runLocalServiceSmoke({ auth: true, rls: true, storage: true, realtime: true, functions: true });`,
    `const first = await bootResetSmokeAndInventory();
await runSupabaseCli(['stop']);
const second = await bootResetSmokeAndInventory();
expect(second.schemaDigest).toBe(first.schemaDigest);
expect(second.requiredServices.sort()).toEqual(first.requiredServices.sort());`,
  ],
  "Migrations, diff e reset": [
    `const local = await readLocalMigrationHistory();
const remote = await runSupabaseCli(['migration', 'list', '--linked']);
assertHistoriesAgree(local, remote);
await runSupabaseCli(['db', 'push', '--linked']);
await assertCatalogAndBehaviorMatchApprovedState();`,
    `await testUpgradePath({ from: previousRelease, to: currentRelease, fixture: realisticExistingData });
await interruptMigrationAt('backfill-checkpoint-3');
await resumeMigration();
await assertNoDuplicateBackfillEffects();
await runAdversarialRlsCorpus();`,
  ],
  "Seeds, fixtures e dados seguros": [
    `await runSupabaseCli(['db', 'reset']);
const actors = await createSyntheticActors(['owner', 'stranger', 'former-member', 'support']);
const fixture = await createTenantIsolationFixture(actors, { deterministicSeed: 42 });
await assertNoRealEmailTokenOrProductionIdentifier(fixture);
await runPolicyMatrix(fixture);`,
    `const profile = { tenants: 100, rows: 100_000, skew: 0.8, tiedTimestamps: true };
await generateSyntheticVolumeSetBased(profile);
const plan = await explainAsAuthenticatedMember(representativeQuery);
if (plan.rowsRead > planBudget.rowsRead) throw new Error('Fixture revelou regressão de plano');`,
  ],
  "Deploy, branching e promotion": [
    `const target = await resolveAndVerifyDeploymentTarget({ expectedProjectRef, allowedEnvironment: 'preview' });
await applyPendingMigrations(target);
await deployEdgeFunctions(target, { commitSha });
await provisionPreviewDependencies(target);
await runCloudSmoke(target);
await recordReleaseManifest({ target, commitSha, migrations, functions, frontend });`,
    `for (const failurePoint of ['after-expand', 'before-function', 'after-function', 'before-contract']) {
  const result = await simulatePromotionFailure(failurePoint);
  assertNoIncompatibleTrafficState(result);
  await recoverByDocumentedForwardFixOrRollback(result);
}
await assertOldAndNewClientsCoexistDuringWindow();`,
  ],
  "Logs, traces e correlação": [
    `const requestId = normalizeOrCreateRequestId(request.headers.get('x-request-id'));
logger.info('storage.upload.accepted', { requestId, service: 'edge-function', operation: 'upload-intent', result: 'accepted' });
await enqueueJob({ requestId, uploadId });
return json({ requestId, uploadId }, 202);`,
    `for (const secret of secretMarkers) await exerciseAllErrorPaths({ secret });
assertNoMarkers([capturedLogs, traceExport, metricsSnapshot, errorBodies], secretMarkers);
if (metricsSnapshot.series.some((s) => s.labels.userId || s.labels.objectKey)) throw new Error('Cardinalidade insegura');`,
  ],
  "Índices, planos e pooler": [
    `const plan = await explainAs(actorToken, () => supabase.from('documents').select('id,title').eq('tenant_id', tenantId).order('created_at').order('id').limit(50));
if (plan.rowsRead > 500 || !plan.indexes.includes('documents_tenant_created_id_idx')) throw new Error('Budget de plano excedido');`,
    `for (const mode of ['transaction', 'session'] as const) {
  const result = await runPoolCompatibilityCorpus({ mode, clients: 40, alternatingTenants: true });
  assertNoSessionStateLeak(result);
  assertPreparedStatementBehaviorMatchesConfiguration(result);
}`,
  ],
  "Quotas, rate limits e backpressure": [
    `const admission = await limiter.reserve({ tenantId, operation: 'export', requestKey, cost: estimatedRows });
if (!admission.accepted) return json({ code: 'capacity_exhausted', retryAfter: admission.retryAfter }, 429, { 'Retry-After': String(admission.retryAfter) });
await queue.enqueue({ requestKey, tenantId, leaseAfter: admission.leaseAfter });`,
    `await dependency.failFor('30 seconds');
const result = await runClients({ count: 1_000, retry: { exponential: true, jitter: 'full', respectRetryAfter: true } });
if (result.peakRequestsPerSecond > capacity || result.lostAcceptedJobs > 0) throw new Error('Backpressure falhou');
await assertFairnessAcrossTenants(result);`,
  ],
  "Backups, PITR e responsabilidades": [
    `const drill = await restoreIntoIsolatedProject({ pointInTime, outboundNetwork: 'deny', callbacks: 'disabled' });
await validateRestoredCatalog(drill);
await reconcileStorageMetadataAndObjects(drill, { dryRun: true });
await reconcileProviderEffects(drill, { replay: false });
recordMeasuredRpoRto(drill);`,
    `for (const gate of ['rls', 'grants', 'auth', 'storage', 'secrets', 'functions', 'outbox', 'privacy-tombstones']) {
  const evidence = await runRestoreGate(gate);
  if (!evidence.passed) throw new Error(\`Restore bloqueado em \${gate}\`);
}
await enableTrafficOnlyAfterFencingOldWorkers();`,
  ],
  "Tipos gerados e evolução": [
    `type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
const input = CreateTaskCommand.parse(await request.json());
const row: TaskInsert = { tenant_id: actor.tenantId, owner_id: actor.userId, title: input.title };
const { data, error } = await supabase.from('tasks').insert(row).select('id,title,status').single();`,
    `await generateDatabaseTypes({ projectRef, output: generatedTypesPath });
if (await gitDiffExists(generatedTypesPath)) throw new Error('Tipos gerados estão desatualizados');
await runOldClientAgainstExpandedSchema();
await validateRpcResponsesAtRuntime();`,
  ],
  "SSR frameworks e cache": [
    `const client = createServerClient(url, publishableKey, requestCookieAdapter(request, response));
const { data: { user }, error } = await client.auth.getUser();
if (error || !user) return redirect('/login');
const dashboard = await loadPrivateDashboard(client, { cache: 'no-store' });`,
    `const [htmlA, htmlB] = await Promise.all([requestThroughRealCache(sessionA, '/dashboard'), requestThroughRealCache(sessionB, '/dashboard')]);
assertContainsOnlyTenant(htmlA, tenantA);
assertContainsOnlyTenant(htmlB, tenantB);
await inspectBrowserBundleForServerSecrets();`,
  ],
  "Queues, cron e trabalhos": [
    `const job = await claimJobAtomically({ workerId, leaseMs: 30_000 });
if (job) {
  const effect = await executeIdempotently(job, { key: job.requestKey });
  await confirmWithFencingToken(job.id, job.fencingToken, effect);
}`,
    `await workerA.pauseAfterLeaseExpires(jobId);
await workerB.claimAndComplete(jobId);
await workerA.resume();
if (await countConfirmedEffects(jobId) !== 1) throw new Error('Fencing falhou');
await assertCronAcrossDstAndOverlappingRuns();`,
  ],
  "Extensões e dependências": [
    `const capability = await queryExtensionCapability('pg_trgm');
if (!capability.available || !satisfies(capability.version, requiredVersion)) throw new Error('Extensão incompatível');
await migrationSql('create extension if not exists pg_trgm with schema extensions');
await assertExtensionGrantsAreMinimal('pg_trgm');`,
    `await runExtensionCorpus({ role: 'authenticated', expectedCapability: 'search:own-tenant' });
await simulateExtensionUnavailable();
await assertDocumentedFallbackOrFailClosed();
await restoreDrillWithExtensionVersions();`,
  ],
  "API keys e rotação": [
    `const config = ProjectConfig.parse(loadPublicConfig());
assertAllowedProjectTuple({ url: config.supabaseUrl, publishableKey: config.supabasePublishableKey, environment });
await runAnonymousDefaultDenyCorpus(createClient(config.supabaseUrl, config.supabasePublishableKey));
await assertNoPrivilegedKeyInBrowserArtifacts();`,
    `await distributeNewKeyToInventoriedConsumers(rotation);
await waitForVerifiedNewKeyUsage(rotation, { minimumCoverage: 1 });
await revokeOldKey(rotation.oldKeyId);
await assertOldBuildFailsClosedAndNewBuildWorks();`,
  ],
  "JWT signing keys e claims": [
    `const { payload, protectedHeader } = await jwtVerify(token, await cachedJwks(), { issuer: expectedIssuer, audience: expectedAudience, algorithms: ['ES256'] });
const claims = AccessClaims.parse(payload);
if (!protectedHeader.kid || claims.sub !== expectedUserId) throw new Error('Token fora do contrato');`,
    `await rotateSigningKeyUnderLoad();
await assertAccepted(oldTokenDuringOverlap);
await assertAccepted(newToken);
clock.advanceBeyondMaximumOldTokenLifetime();
await assertRejected(oldTokenAfterRetirement);
assertJwksFetchesWithinBudget();`,
  ],
  "Privacidade, retenção e exclusão": [
    `const deletion = await requestDeletion({ userId: actor.id, reauthenticatedAt: clock.now(), requestKey });
await deletionWorker.runToCompletion(deletion.id);
const report = await buildDeletionReport(deletion.id);
assertOnlyDeclaredRetention(report);
await assertNoPublicOrPrivateObjectAccessible(actor.id);`,
    `const restored = await restoreSnapshotTakenBeforeDeletion();
await reapplyPrivacyTombstones(restored);
await reconcileStorageDerivatives(restored);
await assertUserNotResurrected(restored, deletedUserId);
await assertExportContainsOnlyRequestingSubject();`,
  ],
  "Incident response e break-glass": [
    `const incident = await declareIncident({ kind: 'privileged-key-exposure', severity: 'critical' });
await preserveEvidence(incident);
await revokeCapability(incident.compromisedKeyId);
await disableAffectedEntrypoints(incident);
await deployAndVerifyRemediation(incident);`,
    `const access = await obtainBreakGlass({ incidentId, justification, approver, ttlMinutes: 30, mfa: true });
try { await runAllowlistedContainment(access); } finally { await revokeAndAuditBreakGlass(access); }
if (await canUse(access)) throw new Error('Break-glass não expirou');
await addIncidentMutantToRegressionCorpus(incidentId);`,
  ],
  "Modelo multi-tenant e policies": [
    `const actors = await seedTenantMatrix(['anonymous', 'member', 'editor', 'owner', 'foreign-member', 'former-member', 'support']);
for (const actor of actors) for (const operation of ['select', 'insert', 'update', 'delete'] as const) {
  await assertTenantPolicyDecision(actor, operation, fixtureDocuments);
}
await assertCatalogHasRlsPoliciesAndExpectedGrants();`,
    `for (const mutant of ['disable-rls', 'remove-tenant-check', 'omit-with-check', 'definer-view', 'drop-policy-index']) {
  const evidence = await runIsolatedPolicyMutant(mutant);
  if (evidence.passed) throw new Error(\`Mutante sobreviveu: \${mutant}\`);
}
await assertPolicyPlansWithinBudget();`,
  ],
  "Upload e processamento assíncrono": [
    `const intent = await createUploadIntent({ actor, projectId, requestKey, declaredBytes: file.size, purpose: 'document' });
await uploadToExactStagingKey(intent, file);
await enqueueInspectionFromOutbox(intent.id);
const active = await waitForUploadState(intent.id, 'active');
assertHashAndScannerEvidence(active);`,
    `await interleaveWorkers({ first: 'slow-old-version', second: 'fast-new-version', expireFirstLease: true });
await assertOnlyNewestUploadActive(resourceId);
await injectOrphanAndMissingBlobFixtures();
const plan = await reconcileStorage({ dryRun: true });
await assertReconciliationPlanSafe(plan);`,
  ],
  "Realtime e consistência offline": [
    `const channel = await subscribeAndBufferPrivateSignals(\`tenant:\${tenantId}:project:\${projectId}\`);
const snapshot = await fetchVersionedSnapshot(projectId);
await mergeBufferedSignalsAbove(channel.buffer, snapshot.cursor);
await channel.onSignal((signal) => applyOrRefetch(signal));`,
    `await editWhileOffline({ commandId: requestKey, baseVersion: 7 });
await revokeMembershipBeforeReconnect(userId, tenantId);
const sync = await reconnectAndSync();
if (sync.appliedCommands !== 0 || sync.crossTenantRows !== 0) throw new Error('Sync offline ignorou autorização');
await assertProjectionEqualsDatabase();`,
  ],
  "Banca, restore e extensão segura": [
    `const evidence = await runSupabaseBookGate({ reset: true, chapters: 12, sections: 48, examples: 96, exercises: 36, cards: 48 });
await requireAll([evidence.density, evidence.contract, evidence.editorial, evidence.types, evidence.snippets, evidence.localIntegration]);
await recordImmutableGateManifest(evidence);`,
    `const drill = await runIsolatedRestoreDrill({ includeStorageDivergence: true, includePrivacyDeletion: true, includeAmbiguousProviderCommit: true });
await assertMeasuredRpoRto(drill);
await assertNoTenantLeakOrResurrectedDeletion(drill);
await runFullSuiteTypecheckAndBuild();`,
  ],
};
