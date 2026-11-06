export type MariaDBLevel = "basico" | "intermediario" | "avancado";

export type MariaDBLessonSpec = readonly [
  title: string,
  thesis: string,
  mechanism: string,
  incident: string,
];

export type MariaDBChapterSpec = readonly [
  title: string,
  level: MariaDBLevel,
  primer: string,
  lessons: readonly MariaDBLessonSpec[],
];

/**
 * MariaDB is deliberately taught as its own server, not as a MySQL alias.
 * The outline targets Community Server 11.8 LTS and calls out compatibility
 * boundaries wherever shared protocol or syntax can hide divergent behavior.
 */
export const MARIADB_CURRICULUM: readonly MariaDBChapterSpec[] = [
  ["Servidor, protocolo e compatibilidade", "basico", "A origem comum não torna MariaDB e MySQL intercambiáveis: versão, capacidades e configuração efetiva precedem qualquer decisão de compatibilidade.", [
    ["MariaDB não é MySQL renomeado", "compatibilidade deve ser provada por versão, feature e workload", "o fork preserva muito do protocolo histórico, mas diverge em tipos, optimizer, replication e administração", "uma migração trocou apenas o driver e descobriu DDL incompatível no corte"],
    ["Handshake, capabilities e drivers", "cliente negocia protocolo e extensões, não apenas porta 3306", "capability flags MariaDB incluem progress reporting, metadata cache e extended metadata", "um proxy anunciou capacidade errada e o driver interpretou metadata incorretamente"],
    ["Sessões, variáveis e SQL_MODE", "pool reutiliza database, timezone, charset, role e sql_mode da sessão", "variáveis globais fornecem defaults; sessão pode divergir e contaminar o próximo request", "uma conexão devolvida ao pool manteve modo permissivo e aceitou dado inválido"],
    ["Erros, warnings e diagnóstico", "aplicação classifica código/SQLSTATE e preserva warnings relevantes", "diagnostics area e SHOW WARNINGS pertencem ao statement e à sessão corrente", "um import tratou truncamento como sucesso porque só verificava exceção"],
  ]],
  ["Tipos, texto, tempo e JSON", "basico", "Tipos representam unidade, comparação e evolução; compatibilidade aparente de nome não garante o mesmo armazenamento ou coerção.", [
    ["Inteiros, DECIMAL e sequences", "dinheiro usa precisão explícita e geração de identidade precisa de semântica declarada", "AUTO_INCREMENT e objetos SEQUENCE oferecem ciclos e concorrência diferentes", "retry confundiu id gerado com confirmação da operação"],
    ["Charsets, collations e Unicode", "charset representa bytes e collation define igualdade e ordem", "coercibility combina expressões e utf8mb4 possui famílias de collation versionadas", "índice único passou a colidir valores após conversão de collation"],
    ["TIMESTAMP, DATETIME e timezone", "instante, calendário civil e duração são contratos distintos", "conversão de sessão afeta TIMESTAMP enquanto DATETIME preserva campos civis", "job de virada de mês deslocou reservas por timezone herdado"],
    ["JSON como alias e validação", "em MariaDB JSON é alias de LONGTEXT com validação, não o formato binário do MySQL", "JSON_VALID e funções de path operam sobre texto preservando diferenças de comparação e replicação", "migração física tentou abrir páginas JSON produzidas pelo MySQL"],
  ]],
  ["Schema, constraints e evolução", "basico", "DDL é contrato concorrente e precisa preservar identidade, integridade e clientes durante mudança.", [
    ["PK, UNIQUE, CHECK e FK", "constraints nomeadas protegem invariantes para todo escritor", "engine, collation e nulidade determinam enforcement e comparação", "aplicação validou unicidade, mas duas sessões inseriram juntas"],
    ["Generated columns e índices", "expressões determinísticas promovem atributos derivados a contratos pesquisáveis", "VIRTUAL e PERSISTENT/STORED trocam computação, espaço e compatibilidade", "cast divergente fez a consulta ignorar o índice derivado"],
    ["ALTER ONLINE, INPLACE e locks", "algoritmo anunciado não elimina metadata lock nem custo de rebuild", "LOCK e ALGORITHM dependem de operação, engine e versão", "ALTER aguardou transação idle e enfileirou o tráfego"],
    ["Expand-contract e backfill", "schema, dados e versões da aplicação convivem durante rollout", "expansão, dual-read/write, backfill idempotente e contração formam protocolo", "coluna foi renomeada antes de todos os workers atualizarem"],
  ]],
  ["DML, concorrência e interfaces SQL", "basico", "Modificar dados exige cardinalidade prevista, identidade idempotente e leitura do estado realmente persistido.", [
    ["INSERT, AUTO_INCREMENT e RETURNING", "geração de chave não prova commit e retorno precisa refletir defaults/triggers", "INSERT...RETURNING existe em superfícies MariaDB específicas e drivers variam no suporte", "cliente repetiu insert após perder a resposta do commit"],
    ["UPSERT e REPLACE", "duplicata deve resolver uma chave de negócio sem apagar lifecycle por acidente", "ON DUPLICATE KEY UPDATE modifica a linha; REPLACE pode apagar e reinserir", "REPLACE disparou cascata e perdeu referências"],
    ["UPDATE, DELETE e LIMIT", "mutação segura fixa escopo, autorização, ordem e contagem", "ORDER BY/LIMIT em DML possui semântica MariaDB e não substitui predicado determinístico", "cleanup sem ordem apagou conjunto diferente a cada execução"],
    ["JOIN, subqueries e EXISTS", "joins alteram multiplicidade e semi-joins respondem existência sem duplicar", "optimizer pode transformar subqueries, materializar ou escolher estratégias de semi-join", "relatório somou pagamentos após join multiplicativo"],
  ]],
  ["SQL analítico e temporal", "intermediario", "Relatórios confiáveis declaram grão, ordem total, frame e dimensão temporal antes de calcular.", [
    ["GROUP BY, HAVING e modos", "agregação muda o grão e modo SQL controla projeções ambíguas", "ONLY_FULL_GROUP_BY e dependência funcional evitam valores arbitrários", "produção agrupou por rótulo e fundiu entidades homônimas"],
    ["Window functions e frames", "janela mantém linhas e requer partição, ordem e frame explícitos", "ROW_NUMBER, LAG e SUM OVER processam peers segundo a ordenação", "ranking paginado repetiu usuários empatados"],
    ["CTEs e recursão", "recursão precisa caso-base, progresso, término e política de ciclo", "WITH RECURSIVE itera working sets sob limite configurável", "ciclo de categoria cresceu até o limite da sessão"],
    ["System-versioned e bitemporal", "histórico do sistema e validade do negócio são eixos diferentes", "FOR SYSTEM_TIME, PERIOD e versionamento armazenam versões consultáveis", "dump sem opção de histórico restaurou apenas o estado atual"],
  ]],
  ["Índices, estatísticas e optimizer", "intermediario", "Plano é hipótese de custo sustentada por distribuição real; índice troca escrita e espaço por um caminho específico.", [
    ["B-tree composto e cobertura", "ordem das colunas segue igualdade, faixa, ordenação e projeção", "prefixo esquerdo e chave primária nos secundários determinam acesso e tamanho", "índice invertido não serviu à paginação por tenant"],
    ["EXPLAIN e ANALYZE", "estimativa e execução observada precisam ser comparadas sem alterar o contrato", "FORMAT=JSON e ANALYZE expõem plano, loops e linhas conforme versão", "equipe culpou plano quando a latência era lock"],
    ["Estatísticas e histogramas", "skew e correlação quebram médias de cardinalidade", "ANALYZE TABLE, estatísticas persistentes e histogramas informam custos", "valor raro recebeu plano desenhado para valor dominante"],
    ["Optimizer switches e trace", "switch ou hint é intervenção versionada, não correção universal", "optimizer_switch e trace revelam estratégias consideradas e rejeitadas", "flag global corrigiu uma query e regrediu dezenas"],
  ]],
  ["Storage engines", "intermediario", "A arquitetura pluggable permite escolher engine por tabela, mas transação, backup, locks e replicação deixam de ser uniformes.", [
    ["InnoDB como engine geral", "OLTP exige ACID, row locking, redo, undo e buffer pool observáveis", "InnoDB é a escolha geral e engine padrão em instalações atuais", "tabela crítica foi criada com engine herdada sem transações"],
    ["Aria e tabelas internas", "Aria é crash-safe no nível suportado, mas não equivale a transações InnoDB", "Aria atende tabelas internas/on-disk temporárias e workloads de leitura", "equipe assumiu rollback completo numa tabela Aria"],
    ["ColumnStore e analytics", "armazenamento colunar muda ingestão, distribuição e plano para análise", "ColumnStore executa workload analítico e não é substituição transparente de OLTP", "migração de tabela quente degradou updates pequenos"],
    ["MyRocks, Spider e engines especiais", "engine especializada exige workload, disponibilidade e operação comprovados", "MyRocks otimiza write amplification; Spider federa/sharda com novas falhas", "engine escolhida por benchmark feliz não suportava o restore exigido"],
  ]],
  ["InnoDB, transações e locks", "intermediario", "Atomicidade local, snapshot e locks precisam proteger a invariável sob duas sessões e retries.", [
    ["Autocommit, savepoints e DDL", "fronteira transacional pertence ao caso de uso e erro não autoriza commit no cleanup", "autocommit e commits implícitos interagem com savepoints e DDL", "transferência parcial foi confirmada pelo bloco finally"],
    ["MVCC e isolation levels", "snapshot escolhido precisa corresponder às anomalias toleradas", "undo mantém versões e isolation define visibilidade e locking reads", "duas decisões válidas no snapshot violaram regra conjunta"],
    ["Record, gap e metadata locks", "índice escolhido determina footprint físico de lock", "InnoDB protege registros/faixas enquanto DDL coordena metadata", "consulta sem índice bloqueou inserts de outros tenants"],
    ["Deadlock, timeout e retry", "deadlock aborta a unidade e retry precisa reexecutá-la idempotentemente", "grafo de espera escolhe vítima; timeout é classe distinta", "handler repetiu só o último statement e perdeu o débito"],
  ]],
  ["Segurança e auditoria", "avancado", "Identidade, TLS, privilégio mínimo e SQL parametrizado precisam ser provados por persona e negações.", [
    ["Contas, hosts e plugins", "conta é usuário@host com plugin e ciclo de vida próprios", "matching escolhe identidade específica e autenticação negocia capacidade do cliente", "serviço caiu numa conta wildcard privilegiada"],
    ["Roles, grants e definers", "runtime, migration e operação usam capacidades separadas", "roles/default roles, DEFINER e SQL SECURITY compõem privilégio efetivo", "view restaurada dependia do usuário pessoal ausente"],
    ["TLS, secrets e rotação", "transporte valida servidor e credenciais rotacionam sem log ou downtime", "requisitos globais/por conta e pools determinam adoção real", "cliente aceitou downgrade e enviou senha sem TLS"],
    ["Injection, audit plugin e redaction", "parâmetros protegem valores; allowlist protege identificadores; auditoria não vaza PII", "prepared statements, plugins de audit e privilégio mínimo formam camadas", "ORDER BY do request virou SQL executável"],
  ]],
  ["Replicação, Galera e roteamento", "avancado", "Alta disponibilidade exige consistência declarada, fencing e topologia observável; cluster não apaga conflitos.", [
    ["Binary log e GTID MariaDB", "posição e domain/server/sequence identificam histórico de replicação", "GTID MariaDB difere do formato MySQL e alimenta channels/appliers", "ferramenta tratou GTID dos produtos como intercambiável"],
    ["Replica lag e read-after-write", "leitura após commit precisa de token, source ou tolerância explícita", "I/O e SQL threads recebem/aplicam binlog assincronamente", "cliente repetiu pedido ausente na réplica atrasada"],
    ["Galera, quorum e flow control", "cluster virtually synchronous ainda exige quorum, certification e controle de fluxo", "wsrep replica write sets e pode abortar conflitos antes do commit", "nó sem quorum aceitou caminho operacional incorreto"],
    ["MaxScale, failover e fencing", "proxy roteia somente com estado/topologia confiáveis", "monitors, services e routers movem conexões entre backend roles", "primary antigo continuou aceitando writes e criou split brain"],
  ]],
  ["Backup, PITR e upgrade 11.8", "avancado", "Durabilidade é restore mensurado e upgrade é protocolo compatível com dados, ferramentas e retorno possível.", [
    ["mariadb-dump e objetos", "backup lógico precisa incluir schema, dados, routines, events, triggers e histórico temporal", "opções controlam snapshot, definers e system-versioned history", "restore omitiu events e versões históricas"],
    ["mariadb-backup e incrementais", "backup físico precisa ser preparado antes de iniciar o servidor", "full/incremental copiam arquivos e redo; prepare aplica cadeia em ordem", "equipe tentou subir cópia crua e InnoDB recusou"],
    ["Binlog e point-in-time recovery", "baseline e cadeia contínua precisam alcançar o instante validado", "mariadb-binlog reaplica eventos por posição/tempo sob fronteira transacional", "retenção expirou antes do restore terminar"],
    ["Upgrade para 11.8 LTS", "release LTS não elimina checker, ensaio, backup e plano de retorno", "mariadb-upgrade e mudanças de system-versioned timestamps podem ampliar duração", "upgrade encontrou bilhões de versões históricas no corte"],
  ]],
  ["Projeto Quíron: gate MariaDB", "avancado", "O projeto integra temporalidade, engines, concorrência, Galera, backup e segurança num sistema modificável e recuperável.", [
    ["Arquitetura do ledger temporal", "modelo separa estado atual, histórico, ledger, outbox e identidade idempotente", "InnoDB protege OLTP e system-versioning preserva consultas históricas controladas", "primeira versão confundiu auditoria temporal com fonte financeira"],
    ["Harness de concorrência e plano", "mutantes precisam violar invariantes ou budgets de modo discriminante", "duas sessões, skew e EXPLAIN/ANALYZE ligam correctness a custo", "benchmark feliz ocultou oversell"],
    ["Rehearsal Galera e recuperação", "quorum, SST/IST, flow control, backup e PITR são ensaiados em staging", "runbook preserva GTID, fencing e checks pós-restore", "nó reconstruído entrou com estado incompleto"],
    ["Banca e extensão segura", "cada mudança futura aponta schema, engine, testes, métricas e rollback", "gate reúne 96 exemplos, 48 seções, avaliações, mutantes e evidência operacional", "feature passou unit tests, mas quebrou restore e role de runtime"],
  ]],
];
