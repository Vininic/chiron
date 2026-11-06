export type SupabaseLevel = "basico" | "intermediario" | "avancado";
export type SupabaseLessonSpec = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type SupabaseChapterSpec = readonly [title: string, level: SupabaseLevel, primer: string, lessons: readonly SupabaseLessonSpec[]];

/** Currículo autoral alinhado à plataforma Supabase atual, sem reduzir o produto a um SDK. */
export const SUPABASE_CURRICULUM: readonly SupabaseChapterSpec[] = [
  ["Projeto, arquitetura e confiança", "basico", "Supabase integra serviços distintos sobre Postgres e cada fronteira conserva seu próprio contrato.", [
    ["Projeto, região e componentes", "projeto é uma unidade operacional com database e serviços acoplados", "região, Postgres, API, Auth, Storage, Realtime e Functions têm ciclos e limites", "a aplicação tratou status do dashboard como saúde de todas as dependências"],
    ["URL, publishable key e clientes", "chave pública identifica o projeto mas não autoriza além das políticas", "cliente envia key e sessão enquanto RLS decide acesso", "uma service role foi empacotada no navegador"],
    ["PostgREST, schemas e contratos", "a Data API projeta schema Postgres e cacheia metadata", "tabelas, views, functions, grants e tipos formam a API", "DDL mudou uma função e clientes receberam shape antigo durante reload"],
    ["Ambientes, configuração e secrets", "local, preview, staging e produção não compartilham autoridade nem segredo", "config.toml, variáveis e secret stores materializam perfis", "um preview apontou para produção e executou seed destrutivo"],
  ]],
  ["Postgres, modelagem e Data API", "basico", "A conveniência da API não elimina modelagem, constraints e transações do PostgreSQL.", [
    ["Tabelas, tipos e constraints", "invariantes pertencem ao schema e protegem todos os clientes", "PK, FK, UNIQUE, CHECK, defaults e tipos sustentam PostgREST", "validação existia só no formulário e import criou estado impossível"],
    ["Queries, filtros e paginação", "query builder traduz uma gramática HTTP com limites próprios", "select, filtros, order, range e count geram SQL via PostgREST", "paginação sem ordem total repetiu linhas durante inserções"],
    ["Insert, update, upsert e retorno", "mutação precisa de predicado, identidade e retorno explícitos", "returning/select, onConflict e constraints determinam efeito", "upsert sem unique correta sobrescreveu tenant alheio"],
    ["RPC, transações e funções", "unidade multi-etapas deve executar atomicamente no banco", "Postgres functions expostas como RPC recebem parâmetros e contexto JWT", "cliente encadeou três requests e publicou evento após rollback parcial"],
  ]],
  ["Auth, sessões e identidade", "basico", "Auth emite identidades; autorização continua nas políticas e no servidor.", [
    ["Signup, confirmação e identidades", "cadastro não implica perfil autorizado nem email confiável sem confirmação", "auth.users, identities e triggers/hooks conectam identidade ao domínio", "trigger de perfil falhou e bloqueou todo signup"],
    ["Access token, refresh e sessão", "sessão combina JWT curto e refresh token rotativo", "claims, session_id, refresh e storage do cliente governam continuidade", "duas abas disputaram refresh e apagaram sessão válida"],
    ["PKCE, SSR e cookies", "fluxo e armazenamento dependem do tipo de cliente", "PKCE, code exchange, cookies e clients server/browser preservam sessão", "token foi lido de cookie sem validar usuário no servidor"],
    ["MFA, recovery e lifecycle", "recuperação e fatores fortes são transições de alto risco", "AAL, enrollment, challenge, password recovery e revogação exigem reautenticação", "mudança sensível aceitou sessão AAL1 após MFA configurado"],
  ]],
  ["RLS e autorização no banco", "intermediario", "RLS é a fronteira central porque navegador e key pública são não confiáveis.", [
    ["Habilitar RLS e default deny", "tabela exposta sem policy não pode depender de filtro do cliente", "ENABLE ROW LEVEL SECURITY e policies por role/operação aplicam default deny", "nova tabela pública foi criada sem RLS e vazou dados"],
    ["USING, WITH CHECK e ownership", "visibilidade e estado gravável são perguntas diferentes", "USING filtra linhas existentes e WITH CHECK valida versões novas", "usuário não lia outra linha mas transferiu ownership no update"],
    ["auth.uid, claims e tenants", "claims só autorizam quando emitidas e interpretadas sob contrato", "auth.uid(), auth.jwt() e membership relacional definem escopo", "metadata editável pelo usuário virou papel administrativo"],
    ["Policies, índices e testes adversariais", "segurança precisa continuar rápida e cobrir todo caminho", "funções security definer controladas, índices e matriz de principals sustentam policies", "policy correta fez scan global e derrubou a API"],
  ]],
  ["Storage e arquivos não confiáveis", "intermediario", "Objeto, metadata e autorização precisam permanecer coerentes.", [
    ["Buckets, paths e ownership", "nome do objeto não é autorização por si", "storage.objects, bucket_id, owner_id e RLS governam acesso", "cliente escolheu path de outro usuário e substituiu avatar"],
    ["Upload, MIME, tamanho e integridade", "arquivo é entrada hostil e precisa de limites e verificação", "upload options, metadata, checksum e scanner formam pipeline", "MIME declarado como imagem carregava conteúdo ativo"],
    ["URLs públicas e assinadas", "publicidade, expiração e cache são decisões diferentes", "public URL, signed URL e transformação possuem ameaças próprias", "URL assinada vazou em log e permaneceu válida além da tarefa"],
    ["Lifecycle, órfãos e consistência", "database e objeto não compartilham transação distribuída", "staging, estados, retries e reconciliação removem órfãos", "linha confirmou e upload falhou deixando perfil quebrado"],
  ]],
  ["Realtime: Broadcast, Presence e mudanças", "intermediario", "Tempo real entrega sinais; a fonte durável e a reconciliação continuam essenciais.", [
    ["Channels, tópicos e lifecycle", "assinatura possui estados, autenticação e cleanup", "channel join, status, heartbeat e removeChannel controlam conexão", "componentes remontaram e multiplicaram subscriptions"],
    ["Broadcast e autorização", "Broadcast é evento efêmero protegido por políticas de canal", "private channels e RLS em realtime.messages autorizam send/receive", "topic previsível permitiu escuta entre salas"],
    ["Presence e reconciliação", "presença é estado efêmero por conexão, não verdade de negócio", "track, sync, join e leave convergem via CRDT", "evento join foi contado como usuário único e duplicou online"],
    ["Postgres Changes e escala", "CDC simples possui custo e limitações diferentes de Broadcast", "publication, replication slot, filtros e RLS alimentam mudanças", "cada usuário assinou tabela inteira e saturou autorização"],
  ]],
  ["Edge Functions e fronteiras server-side", "intermediario", "Functions protegem secrets e coordenam integrações sem substituir o database.", [
    ["Deno runtime, request e resposta", "função é handler HTTP com deadline e limites", "Deno.serve, Request, Response e Web APIs estruturam execução", "handler deixou promise pendente e excedeu tempo"],
    ["JWT, CORS e autorização", "chegar à função não concede capacidade", "Authorization header, getUser/claims e CORS validam origem e usuário", "função confiou em user id enviado no body"],
    ["Secrets e service role", "credencial privilegiada só existe no servidor e com escopo mínimo", "function secrets e client server-side separam papéis", "service role genérica permitiu apagar qualquer tenant"],
    ["Webhooks, idempotência e retries", "integração externa é at-least-once e pode ter commit ambíguo", "assinatura, event id, inbox/outbox e retry reconciliam", "webhook repetido cobrou duas vezes"],
  ]],
  ["CLI, local development e migrations", "intermediario", "Schema e configuração evoluem como código, não por memória do dashboard.", [
    ["Supabase CLI e stack local", "ambiente local é aproximação versionada e descartável", "init, start, status e stop coordenam containers e config", "local usou versões diferentes do projeto remoto"],
    ["Migrations, diff e reset", "histórico Git e tabela remota precisam concordar", "migration new, db diff, db reset e schema_migrations controlam ordem", "edição direta remota criou drift e db push falhou"],
    ["Seeds, fixtures e dados seguros", "seed reproduz casos sem copiar produção", "seed.sql, dados determinísticos e identities de teste sustentam gates", "dump de produção foi commitado como fixture"],
    ["Deploy, branching e promotion", "preview valida schema sem presumir dados ou objetos de Storage", "db push, GitHub integration e branches aplicam migrations", "branch passou sem bucket/configuração exigida pela aplicação"],
  ]],
  ["Observabilidade, performance, limites e armadilhas", "avancado", "A plataforma deve ser operada por sinais de cada componente e orçamento do plano.", [
    ["Logs, traces e correlação", "Auth, API, database, Realtime e Functions precisam de uma causalidade", "request ids, logs e OpenTelemetry conectam serviços", "payload sensível virou label e custo explodiu"],
    ["Índices, planos e pooler", "latência da Data API continua sendo latência SQL e conexão", "pg_stat, EXPLAIN, índices e transaction/session pool modes explicam custo", "prepared statement quebrou sob modo incompatível do pooler"],
    ["Quotas, rate limits e backpressure", "limites são parte do contrato e precisam degradar explicitamente", "plan quotas, Auth limits, Realtime limits e filas controlam admissão", "retry sem jitter multiplicou 429 e indisponibilidade"],
    ["Backups, PITR e responsabilidades", "serviço gerenciado não elimina restore e dependências externas", "backups, PITR, restore drills e exportações definem RPO/RTO", "database voltou mas objetos de Storage e secrets não"],
  ]],
  ["Integrações, tipos e arquitetura", "avancado", "Clientes e serviços precisam compartilhar contratos gerados e fronteiras claras.", [
    ["Tipos gerados e evolução", "TypeScript reflete schema mas não substitui runtime e migration", "gen types, Database generic e overrides conectam Postgres ao cliente", "tipo antigo compilou cache e campo removido falhou em produção"],
    ["SSR frameworks e cache", "dados por usuário não podem atravessar cache compartilhado", "clients por request, cookies e cache directives preservam isolamento", "HTML de usuário A foi servido ao usuário B"],
    ["Queues, cron e trabalhos", "tarefas assíncronas exigem lease, idempotência e observação", "pg_cron, queues e workers coordenam execução", "cron sobrepôs rodadas e processou lote duas vezes"],
    ["Extensões e dependências", "extensão altera superfície, privilégio, upgrade e portabilidade", "pg_available_extensions, schemas e migrations fixam capacidade", "preview dependia de extensão ausente na produção"],
  ]],
  ["Segurança, privacidade e governança", "avancado", "A plataforma combina dados, identidades, arquivos e eventos sob uma única revisão de ameaça.", [
    ["API keys e rotação", "publishable/secret keys possuem exposição e ciclo diferentes", "nova key architecture, rotação e inventário de consumidores reduzem blast radius", "anon/service_role legadas foram tratadas como equivalentes"],
    ["JWT signing keys e claims", "assinatura, distribuição e rotação precisam sobreviver a caches", "JWKS, key rotation e verificação assimétrica governam tokens", "serviço continuou aceitando chave retirada indefinidamente"],
    ["Privacidade, retenção e exclusão", "apagar usuário exige mapear todas as cópias e obrigações", "Auth, tabelas, Storage, logs, backups e eventos têm lifecycles", "delete removeu auth.users mas preservou arquivo público"],
    ["Incident response e break-glass", "credencial privilegiada e containment precisam ser ensaiados", "revogação, rotação, audit logs e runbooks coordenam resposta", "service key vazou e ninguém sabia quais funções a usavam"],
  ]],
  ["Projeto Quíron: gate Supabase", "avancado", "O projeto integra identity, RLS, Data API, Storage, Realtime, Functions e recuperação.", [
    ["Modelo multi-tenant e policies", "tenant, membership e ownership formam a raiz de autorização", "constraints, RLS e matriz adversarial provam isolamento", "uma view security definer contornou policy"],
    ["Upload e processamento assíncrono", "arquivo só fica ativo após pipeline idempotente e seguro", "staging, Storage RLS, Function, queue e status reconciliam", "retry publicou dois objetos e uma linha"],
    ["Realtime e consistência offline", "evento acelera interface mas refetch/reconciliação confirma verdade", "Broadcast autorizado, cursor e versionamento evitam perda", "reconnect perdeu evento e deixou estado permanente obsoleto"],
    ["Banca, restore e extensão segura", "cada mudança aponta policy, migration, teste, métrica e rollback", "gates locais/cloud, restore drill e threat model fecham a apostila", "feature passou UI tests mas vazou tenant e não restaurava"],
  ]],
];
