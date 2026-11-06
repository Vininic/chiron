export type SqlServerLevel = "basico" | "intermediario" | "avancado";

export type SqlServerLessonSpec = readonly [
  title: string,
  thesis: string,
  mechanism: string,
  incident: string,
];

export type SqlServerChapterSpec = readonly [
  title: string,
  level: SqlServerLevel,
  primer: string,
  lessons: readonly SqlServerLessonSpec[],
];

/** Currículo autoral para SQL Server 2025 (17.x), sem tratar T-SQL como SQL genérico. */
export const SQLSERVER_CURRICULUM: readonly SqlServerChapterSpec[] = [
  ["Instância, databases e sessões", "basico", "O contrato começa pela instância, pelo database corrente e pelo estado efetivo da sessão.", [
    ["Instância, edição e versão", "edição, build e compatibilidade determinam a superfície disponível", "SERVERPROPERTY, @@VERSION e catálogo distinguem engine, edição e patch", "um deploy usou recurso Enterprise numa edição Express sem capability gate"],
    ["Databases, schemas e nomes", "database e schema são namespaces distintos e a qualificação precisa ser deliberada", "nomes multipartes resolvem servidor, database, schema e objeto sob contexto e permissões", "uma migration criou dbo.orders no database administrativo"],
    ["Conexões, SET options e pooling", "conexões reutilizadas carregam estado que altera semântica e planos", "SET options, database, idioma, isolation e transaction state pertencem à sessão", "um request herdou DATEFORMAT e converteu data com outra ordem"],
    ["Erros, TRY/CATCH e XACT_STATE", "tratamento de falha precisa saber se a transação ainda é confirmável", "TRY/CATCH, THROW, ERROR_* e XACT_STATE classificam e preservam causalidade", "um CATCH executou COMMIT numa transação condenada"],
  ]],
  ["Tipos, texto, tempo e identidade", "basico", "Tipos modelam unidade, comparação, precisão e evolução entre T-SQL e o driver.", [
    ["Inteiros, DECIMAL e dinheiro", "valores exatos usam faixa, precisão, escala e arredondamento explícitos", "DECIMAL preserva base decimal enquanto money e float carregam fronteiras próprias", "um total financeiro foi calculado em float e não reconciliou"],
    ["Unicode, collations e UTF-8", "representação e regra de comparação são contratos separados", "nvarchar, varchar UTF-8 e collations definem bytes, igualdade, ordem e índice", "troca de collation criou colisões numa chave única"],
    ["date, datetime2 e datetimeoffset", "instante, calendário civil e offset não são o mesmo conceito", "datetime2 preserva campos/precisão e datetimeoffset registra offset sem ser timezone IANA", "um job converteu duas vezes um instante vindo do driver"],
    ["IDENTITY, sequence e uniqueidentifier", "geração de chave não prova commit nem idempotência", "IDENTITY, SEQUENCE, NEWID e NEWSEQUENTIALID têm concorrência, lacunas e locality distintas", "retry após commit ambíguo criou duas linhas com ids válidos"],
  ]],
  ["Schema, constraints e evolução", "basico", "O schema é uma API concorrente que precisa proteger todos os escritores e versões.", [
    ["PK, UNIQUE, CHECK e FK", "constraints nomeadas materializam invariantes atômicas", "nulidade, collation, índices e ações referenciais definem enforcement", "duas sessões venceram uma validação de unicidade feita só na aplicação"],
    ["Defaults, computed columns e índices", "derivações pesquisáveis precisam de determinismo e tipo alinhado", "computed columns PERSISTED e índices promovem expressões estáveis ao schema", "um cast textual ordenou valores numéricos de forma lexical"],
    ["ALTER TABLE e schema locks", "DDL online ainda coordena metadata e consome recursos", "Sch-S e Sch-M, rebuild e opções ONLINE/RESUMABLE dependem de operação e edição", "um ALTER aguardou sessão antiga e enfileirou o serviço"],
    ["Expand-contract e backfill", "versões antigas e novas da aplicação convivem durante a mudança", "expansão, dual-read/write, lotes idempotentes e contração formam uma máquina de estados", "uma coluna foi removida antes do último worker migrar"],
  ]],
  ["DML, procedures e contratos de API", "basico", "Escritas seguras preservam cardinalidade, autorização, idempotência e estado final.", [
    ["INSERT, OUTPUT e identidade", "retorno deve pertencer ao statement e não confundir id gerado com commit", "OUTPUT inserted captura múltiplas linhas, defaults e chaves dentro da unidade", "a API usou SCOPE_IDENTITY fora da conexão correta"],
    ["UPDATE, DELETE e concorrência otimista", "o predicado deve carregar escopo, autorização e versão esperada", "rowversion e affected rows tornam conflito observável sem read-modify-write", "um update de documento sobrescreveu alteração concorrente"],
    ["MERGE, upsert e alternativas", "upsert precisa de identidade e concorrência provadas, não apenas sintaxe compacta", "unique constraint, transação e padrões UPDATE/INSERT evitam pressupostos perigosos de MERGE", "duas sessões produziram efeito incorreto numa lógica MERGE não testada"],
    ["Stored procedures e parâmetros", "procedure é fronteira versionada de capacidade, transação e resultado", "parâmetros tipados, return codes, result sets e THROW compõem a API T-SQL", "mudança de result set quebrou um consumidor sem versionamento"],
  ]],
  ["Consultas e SQL analítico", "intermediario", "Consultas confiáveis declaram grão, ordem total, nulos e fase de cálculo.", [
    ["JOIN, APPLY e cardinalidade", "joins alteram multiplicidade e APPLY expressa dependência lateral", "CROSS/OUTER APPLY e pré-agregação preservam o grão quando usados deliberadamente", "um join entre itens e pagamentos multiplicou receita"],
    ["GROUP BY, HAVING e GROUPING SETS", "agregação muda o grão e totais múltiplos precisam de marcador", "GROUPING SETS, ROLLUP e GROUPING_ID distinguem subtotal de NULL real", "um relatório somou subtotal novamente como detalhe"],
    ["Window functions e frames", "partição, ordem e frame precisam ser explícitos", "ROW_NUMBER, LAG e SUM OVER tratam peers segundo ordem total e ROWS/RANGE", "um saldo acumulado saltou eventos empatados"],
    ["CTEs, recursão e set operators", "recursão exige caso-base, progresso, ciclo e limite", "WITH recursiva, MAXRECURSION e UNION/EXCEPT/INTERSECT expressam algoritmos de conjunto", "um ciclo hierárquico consumiu o limite sem apontar a aresta"],
  ]],
  ["Índices, estatísticas e planos", "intermediario", "Plano é hipótese de custo baseada em dados, parâmetros e configuração.", [
    ["Clustered e nonclustered indexes", "chave clustered organiza a linha e aparece nos índices secundários", "ordem, INCLUDE, filtros e largura trocam leitura por escrita e espaço", "uma PK GUID aleatória fragmentou todos os caminhos"],
    ["Planos estimados e reais", "estimativa e execução observada respondem perguntas diferentes", "execution plans, actual rows, loops, reads e waits ligam hipótese ao trabalho", "a equipe culpou scan quando a latência era bloqueio"],
    ["Estatísticas, skew e cardinality estimator", "médias e amostras falham sob valores raros e correlação", "auto stats, histogramas, CE model e atualização informam custos", "um valor raro recebeu plano desenhado para o valor dominante"],
    ["Parameter sniffing, PSP e OPPO", "um único texto parametrizado pode precisar de mais de um plano", "parameter sensitive plan optimization e optional parameter plan optimization criam variantes sob critérios do engine", "um plano compilado para tenant pequeno saturou o tenant grande"],
  ]],
  ["Transações, locking e version store", "intermediario", "Atomicidade e isolamento são provados por interleavings de duas sessões.", [
    ["Autocommit, IMPLICIT_TRANSACTIONS e XACT_ABORT", "fronteira transacional precisa ser explícita e restaurável no pool", "BEGIN/COMMIT/ROLLBACK, XACT_ABORT e @@TRANCOUNT controlam a unidade", "uma conexão voltou ao pool com transação aberta"],
    ["Isolation levels e row versioning", "snapshot e locking protegem anomalias diferentes", "READ COMMITTED SNAPSHOT, SNAPSHOT e isolation por locks usam tempdb/version store", "duas decisões válidas em snapshots violaram regra conjunta"],
    ["Key, range, schema e escalation locks", "plano e índice determinam o footprint físico de contenção", "lock modes, key-range, Sch-S/Sch-M e escalation coordenam concorrência", "scan de um tenant bloqueou linhas de outros tenants"],
    ["Deadlocks, timeouts e retry", "deadlock repete a transação inteira e commit ambíguo exige reconciliação", "deadlock graph, error 1205, lock timeout e idempotency key separam classes", "o handler repetiu apenas o último statement após ser vítima"],
  ]],
  ["JSON, temporal, columnstore e vetores", "intermediario", "Recursos especializados precisam de modelo, índice e edição/versão comprovados.", [
    ["JSON textual e paths", "JSON é texto validado/consultado e paths quentes merecem contrato próprio", "ISJSON, JSON_VALUE, JSON_QUERY, OPENJSON e computed columns compõem validação e acesso", "uma mudança de shape tornou o índice derivado nulo"],
    ["Temporal tables e histórico", "system-versioned history registra tempo do sistema, não evento de domínio", "PERIOD FOR SYSTEM_TIME, history table e AS OF preservam versões consultáveis", "uma limpeza apagou histórico exigido por auditoria"],
    ["Columnstore e batch mode", "analytics colunar não substitui OLTP linha a linha", "clustered/nonclustered columnstore, rowgroups e batch mode trocam ingestão por scans", "updates pequenos fragmentaram rowgroups e degradaram relatório"],
    ["VECTOR e busca no SQL Server 2025", "vetor exige dimensionalidade, precisão, métrica e estágio de feature explícitos", "VECTOR, funções de distância e índices em preview têm capability gates distintos", "um protótipo promoveu índice vetorial preview como SLA de produção"],
  ]],
  ["Segurança, criptografia e auditoria", "avancado", "Login, user, role e chave de proteção formam fronteiras diferentes.", [
    ["Logins, users e contained databases", "identidade de servidor e principal de database não são sinônimos", "login, user mapping, contained user e default schema determinam resolução e acesso", "um restore deixou usuários órfãos e a aplicação caiu"],
    ["Roles, ownership chains e EXECUTE AS", "privilégio efetivo depende de ownership e contexto, não só GRANT visível", "database roles, module signing, EXECUTE AS e ownership chaining delegam capacidades", "uma procedure dinâmica atravessou a cadeia e exigiu privilégio excessivo"],
    ["TLS, TDE, Always Encrypted e secrets", "trânsito, repouso e proteção contra o servidor são ameaças distintas", "TLS, TDE e Always Encrypted protegem camadas diferentes com gestão de chaves", "backup TDE foi restaurado sem o certificado necessário"],
    ["Injection, RLS, masking e audit", "parâmetros, política de linhas e auditoria são camadas complementares", "sp_executesql, RLS predicates, dynamic data masking e SQL Audit têm limites próprios", "ORDER BY concatenado virou SQL executável apesar do filtro parametrizado"],
  ]],
  ["Query Store, observabilidade e governança", "avancado", "Telemetria deve ligar digest, plano, wait, release e decisão de negócio.", [
    ["Query Store e regressão de plano", "histórico de queries e planos permite comparar e intervir com prazo", "Query Store captura runtime/wait stats e pode forçar plano sob governança", "um plano forçado permaneceu após a causa desaparecer e bloqueou melhoria"],
    ["DMVs, Extended Events e waits", "cada fonte de observação possui escopo, retenção e custo", "sys.dm_exec_*, wait stats e Extended Events correlacionam requests, locks e errors", "uma sessão de eventos capturou payload sensível e encheu o disco"],
    ["Tempdb, memory grants e spills", "recursos compartilhados precisam de budget por workload", "tempdb files, version store, memory grants e spill warnings revelam pressão", "uma query de relatório consumiu tempdb e derrubou OLTP"],
    ["Resource Governor e limites de edição", "governança limita concorrência e recursos somente onde a edição suporta", "workload groups, classifiers e caps isolam classes com capability gate", "um runbook prometeu Resource Governor numa edição sem suporte equivalente"],
  ]],
  ["Backup, HA e evolução para 2025", "avancado", "Durabilidade é restore medido; disponibilidade exige uma única história e fencing.", [
    ["Full, differential e log backup", "a cadeia começa em baseline consistente e inclui todos os logs necessários", "recovery model, LSNs, copy-only e tail-log definem PITR", "um job truncou a cadeia e só falhou durante o desastre"],
    ["Restore, DBCC CHECKDB e integridade", "arquivo de backup só vale depois de restore e validação", "RESTORE VERIFYONLY, restore em sequência, CHECKDB e queries canônicas cobrem camadas", "VERIFYONLY passou num artefato que não cabia no storage de DR"],
    ["Always On, log shipping e fencing", "HA escolhe consistência, RPO/RTO e autoridade de promoção", "availability groups, synchronous/asynchronous commit e log shipping têm topologias distintas", "o primary antigo continuou aceitando writes após failover"],
    ["Upgrade, compatibility level e SQL Server 2025", "binário e compatibility level são alavancas separadas e reversibilidade tem limite", "Query Store, CE, breaking changes e rehearsal controlam a evolução para 17.x", "o upgrade mudou plano sem que o compatibility level fosse auditado"],
  ]],
  ["Projeto Quíron: gate SQL Server", "avancado", "O projeto reúne T-SQL, concorrência, planos, segurança, observabilidade e recuperação.", [
    ["Ledger, temporal e outbox", "fatos imutáveis, projeções e histórico técnico possuem fontes de verdade distintas", "constraints, transação, temporal e outbox preservam causalidade e entrega idempotente", "a primeira versão publicou evento antes do commit"],
    ["Harness de concorrência e planos", "baseline e mutantes precisam discriminar correção e custo", "duas sessões, skew, actual plan e Query Store ligam invariantes a regressões", "um teste sem barreira nunca reproduziu o oversell"],
    ["Rehearsal de restore e failover", "backup, PITR, promotion e fencing formam um único runbook executável", "LSNs, tail-log, CHECKDB e smoke da aplicação provam recuperação", "um nó promovido tinha dados mas não os logins/chaves necessários"],
    ["Banca e extensão segura", "cada mudança futura aponta schema, teste, plano, privilégio, métrica e rollback", "o gate reúne 96 exemplos, 48 seções, avaliações e evidência operacional", "uma feature passou unit tests e quebrou restore e role de runtime"],
  ]],
];
