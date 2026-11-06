/** Pares de T-SQL por seção. O mapa permanece incompleto até que cada exemplo
 * tenha baseline e contraprova próprios; a fonte não é integrada antes disso. */
export const SQLSERVER_SQL: Record<string, readonly [string, string]> = {
  "Instância, edição e versão": [
    `SELECT
  CAST(SERVERPROPERTY('ProductVersion') AS nvarchar(30)) AS product_version,
  CAST(SERVERPROPERTY('ProductLevel') AS nvarchar(30)) AS product_level,
  CAST(SERVERPROPERTY('Edition') AS nvarchar(128)) AS edition,
  CAST(SERVERPROPERTY('EngineEdition') AS int) AS engine_edition,
  CAST(SERVERPROPERTY('IsHadrEnabled') AS int) AS hadr_enabled;`,
    `DECLARE @major int = TRY_CONVERT(int, SERVERPROPERTY('ProductMajorVersion'));
IF @major < 17
  THROW 51000, 'Este ensaio requer SQL Server 2025 (17.x).', 1;
SELECT DB_NAME() AS current_database, compatibility_level
FROM sys.databases WHERE name = DB_NAME();`,
  ],
  "Databases, schemas e nomes": [
    `DROP TABLE IF EXISTS dbo.chiron_namespace_probe;
CREATE TABLE dbo.chiron_namespace_probe(id int NOT NULL PRIMARY KEY);
SELECT DB_NAME() AS database_name, SCHEMA_NAME(schema_id) AS schema_name, name
FROM sys.tables WHERE object_id = OBJECT_ID(N'dbo.chiron_namespace_probe');
DROP TABLE dbo.chiron_namespace_probe;`,
    `DECLARE @unqualified int = OBJECT_ID(N'chiron_namespace_probe');
DECLARE @qualified int = OBJECT_ID(N'dbo.chiron_namespace_probe');
SELECT @unqualified AS resolved_by_default_schema,
       @qualified AS explicitly_qualified;
-- Em migrations, recuse NULL ou divergência em vez de criar no database corrente por acidente.`,
  ],
  "Conexões, SET options e pooling": [
    `SELECT @@SPID AS session_id, DB_NAME() AS database_name,
       SESSIONPROPERTY('ANSI_NULLS') AS ansi_nulls,
       SESSIONPROPERTY('ARITHABORT') AS arithabort,
       SESSIONPROPERTY('TRANSACTION_ISOLATION_LEVEL') AS isolation_level,
       @@TRANCOUNT AS transaction_count, XACT_STATE() AS transaction_state;`,
    `SET LANGUAGE us_english;
SET DATEFORMAT ymd;
DECLARE @d date = CONVERT(date, N'2026-09-10', 23);
SELECT @@SPID AS session_id, @@LANGUAGE AS language_name, @d AS parsed_date;
-- O checkout do pool deve aplicar e verificar este baseline antes do request.`,
  ],
  "Erros, TRY/CATCH e XACT_STATE": [
    `DROP TABLE IF EXISTS dbo.chiron_error_probe;
CREATE TABLE dbo.chiron_error_probe(id int NOT NULL PRIMARY KEY);
BEGIN TRY
  BEGIN TRAN;
  INSERT dbo.chiron_error_probe VALUES (1), (1);
  COMMIT;
END TRY
BEGIN CATCH
  IF XACT_STATE() <> 0 ROLLBACK;
  SELECT ERROR_NUMBER() AS error_number, ERROR_MESSAGE() AS error_message,
         XACT_STATE() AS state_after_rollback;
END CATCH;
DROP TABLE dbo.chiron_error_probe;`,
    `BEGIN TRY
  THROW 51001, 'falha causal preservada', 1;
END TRY
BEGIN CATCH
  SELECT ERROR_NUMBER() AS error_number, ERROR_SEVERITY() AS severity,
         ERROR_STATE() AS error_state, ERROR_LINE() AS error_line;
END CATCH;`,
  ],
  "Inteiros, DECIMAL e dinheiro": [
    `DROP TABLE IF EXISTS dbo.chiron_amount;
CREATE TABLE dbo.chiron_amount(
  id int NOT NULL PRIMARY KEY,
  amount_brl decimal(19,4) NOT NULL,
  CONSTRAINT CK_chiron_amount_nonnegative CHECK (amount_brl >= 0)
);
INSERT dbo.chiron_amount VALUES (1, 10.1250), (2, 0.1000);
SELECT SUM(amount_brl) AS exact_total, SQL_VARIANT_PROPERTY(SUM(amount_brl), 'Precision') AS result_precision
FROM dbo.chiron_amount;
DROP TABLE dbo.chiron_amount;`,
    `DECLARE @approx float = 0.1 + 0.2;
DECLARE @exact decimal(19,4) = CAST(0.1 AS decimal(19,4)) + CAST(0.2 AS decimal(19,4));
SELECT @approx AS approximate_result, @exact AS exact_result,
       IIF(@approx = 0.3, 1, 0) AS unsafe_equality;
SELECT ROUND(CAST(10.125 AS decimal(10,3)), 2) AS explicit_rounding;`,
  ],
  "Unicode, collations e UTF-8": [
    `DROP TABLE IF EXISTS dbo.chiron_unicode;
CREATE TABLE dbo.chiron_unicode(
  id int NOT NULL PRIMARY KEY,
  label nvarchar(80) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL
);
INSERT dbo.chiron_unicode VALUES (1, N'João 🚀');
SELECT label, LEN(label) AS characters, DATALENGTH(label) AS bytes, COLLATIONPROPERTY(CAST(DATABASEPROPERTYEX(DB_NAME(), 'Collation') AS nvarchar(128)), 'CodePage') AS db_codepage
FROM dbo.chiron_unicode;
DROP TABLE dbo.chiron_unicode;`,
    `SELECT
  IIF(N'João' COLLATE Latin1_General_100_CI_AI = N'joao', 1, 0) AS equal_ai_ci,
  IIF(N'João' COLLATE Latin1_General_100_BIN2 = N'joao', 1, 0) AS equal_bin2;
-- O corpus de domínio, não o nome da collation, decide qual equivalência é correta.`,
  ],
  "date, datetime2 e datetimeoffset": [
    `DECLARE @instant datetimeoffset(3) = '2026-09-09T14:30:00.000-03:00';
SELECT @instant AS original,
       SWITCHOFFSET(@instant, '+00:00') AS same_instant_utc,
       CONVERT(datetime2(3), @instant) AS wall_clock_without_offset,
       SYSUTCDATETIME() AS observed_utc;`,
    `SET DATEFORMAT dmy;
DECLARE @typed date = DATEFROMPARTS(2026, 9, 10);
SELECT @typed AS unambiguous,
       TRY_CONVERT(date, N'09/10/2026') AS session_dependent,
       TRY_CONVERT(date, N'2026-09-10', 23) AS style_23;
SET DATEFORMAT mdy;`,
  ],
  "IDENTITY, sequence e uniqueidentifier": [
    `DROP TABLE IF EXISTS dbo.chiron_identity;
CREATE TABLE dbo.chiron_identity(id bigint IDENTITY(1,1) NOT NULL PRIMARY KEY, payload nvarchar(40) NOT NULL);
INSERT dbo.chiron_identity(payload) OUTPUT inserted.id, inserted.payload VALUES (N'primeiro'), (N'segundo');
SELECT IDENT_CURRENT(N'dbo.chiron_identity') AS allocated_high_watermark;
DROP TABLE dbo.chiron_identity;`,
    `DROP TABLE IF EXISTS dbo.chiron_guid; DROP SEQUENCE IF EXISTS dbo.chiron_order_seq;
CREATE SEQUENCE dbo.chiron_order_seq AS bigint START WITH 1000 INCREMENT BY 1 CACHE 20;
CREATE TABLE dbo.chiron_guid(id uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID());
INSERT dbo.chiron_guid DEFAULT VALUES;
SELECT NEXT VALUE FOR dbo.chiron_order_seq AS reserved_id, id AS sequential_guid FROM dbo.chiron_guid;
SELECT current_value, cache_size FROM sys.sequences WHERE object_id = OBJECT_ID(N'dbo.chiron_order_seq');
DROP TABLE dbo.chiron_guid; DROP SEQUENCE dbo.chiron_order_seq;`,
  ],
  "PK, UNIQUE, CHECK e FK": [
    `DROP TABLE IF EXISTS dbo.chiron_line; DROP TABLE IF EXISTS dbo.chiron_order;
CREATE TABLE dbo.chiron_order(id int NOT NULL CONSTRAINT PK_chiron_order PRIMARY KEY, status varchar(12) NOT NULL CONSTRAINT CK_chiron_order_status CHECK(status IN ('open','paid')));
CREATE TABLE dbo.chiron_line(order_id int NOT NULL, line_no int NOT NULL, sku varchar(30) NOT NULL,
 CONSTRAINT PK_chiron_line PRIMARY KEY(order_id,line_no), CONSTRAINT UQ_chiron_line_sku UNIQUE(order_id,sku),
 CONSTRAINT FK_chiron_line_order FOREIGN KEY(order_id) REFERENCES dbo.chiron_order(id));
INSERT dbo.chiron_order VALUES(1,'open'); INSERT dbo.chiron_line VALUES(1,1,'A');
SELECT fk.name, fk.is_disabled, fk.is_not_trusted FROM sys.foreign_keys fk WHERE fk.parent_object_id=OBJECT_ID(N'dbo.chiron_line');
DROP TABLE dbo.chiron_line; DROP TABLE dbo.chiron_order;`,
    `DROP TABLE IF EXISTS dbo.chiron_check;
CREATE TABLE dbo.chiron_check(id int PRIMARY KEY, amount decimal(9,2) NULL, CONSTRAINT CK_chiron_positive CHECK(amount > 0));
INSERT dbo.chiron_check VALUES(1,NULL);
SELECT id, amount, IIF(amount IS NULL,'UNKNOWN aceito pelo CHECK','valor') AS three_valued_logic FROM dbo.chiron_check;
DROP TABLE dbo.chiron_check;`,
  ],
  "Defaults, computed columns e índices": [
    `DROP TABLE IF EXISTS dbo.chiron_computed;
CREATE TABLE dbo.chiron_computed(qty int NOT NULL, unit_price decimal(12,2) NOT NULL,
 total AS CONVERT(decimal(19,2),qty*unit_price) PERSISTED,
 created_at datetime2(3) NOT NULL CONSTRAINT DF_chiron_created DEFAULT SYSUTCDATETIME());
CREATE INDEX IX_chiron_computed_total ON dbo.chiron_computed(total);
INSERT dbo.chiron_computed(qty,unit_price) VALUES(2,10.25);
SELECT qty,unit_price,total,created_at FROM dbo.chiron_computed;
DROP TABLE dbo.chiron_computed;`,
    `SELECT c.name, c.is_computed, cc.is_persisted, dc.name AS default_name
FROM sys.columns c
LEFT JOIN sys.computed_columns cc ON cc.object_id=c.object_id AND cc.column_id=c.column_id
LEFT JOIN sys.default_constraints dc ON dc.parent_object_id=c.object_id AND dc.parent_column_id=c.column_id
WHERE c.object_id=OBJECT_ID(N'dbo.chiron_computed');`,
  ],
  "ALTER TABLE e schema locks": [
    `DROP TABLE IF EXISTS dbo.chiron_alter;
CREATE TABLE dbo.chiron_alter(id bigint NOT NULL PRIMARY KEY, payload varchar(30) NULL);
ALTER TABLE dbo.chiron_alter ADD created_at datetime2(3) NULL;
SELECT c.name,c.is_nullable FROM sys.columns c WHERE c.object_id=OBJECT_ID(N'dbo.chiron_alter');
DROP TABLE dbo.chiron_alter;`,
    `SELECT request_session_id, resource_type, request_mode, request_status
FROM sys.dm_tran_locks
WHERE resource_associated_entity_id IN (OBJECT_ID(N'dbo.chiron_alter'), 0)
  AND request_session_id=@@SPID;
-- A contraprova operacional mantém uma transação leitora em outra sessão e aplica LOCK_TIMEOUT curto ao ALTER.`,
  ],
  "Expand-contract e backfill": [
    `DROP TABLE IF EXISTS dbo.chiron_expand;
CREATE TABLE dbo.chiron_expand(id bigint NOT NULL PRIMARY KEY, old_status varchar(12) NOT NULL);
INSERT dbo.chiron_expand VALUES(1,'open'),(2,'paid');
ALTER TABLE dbo.chiron_expand ADD status_v2 varchar(20) NULL;
UPDATE TOP (1000) dbo.chiron_expand SET status_v2=old_status WHERE status_v2 IS NULL;
SELECT COUNT_BIG(*) AS remaining FROM dbo.chiron_expand WHERE status_v2 IS NULL;
DROP TABLE dbo.chiron_expand;`,
    `DROP TABLE IF EXISTS dbo.chiron_expand;
CREATE TABLE dbo.chiron_expand(id bigint PRIMARY KEY,old_status varchar(12) NOT NULL,status_v2 varchar(20) NULL);
INSERT dbo.chiron_expand(id,old_status) VALUES(1,'open'),(2,'paid');
DECLARE @batch int=1000, @changed int=1;
WHILE @changed>0
BEGIN
  UPDATE TOP (@batch) dbo.chiron_expand WITH (UPDLOCK,READPAST)
    SET status_v2=old_status WHERE status_v2 IS NULL;
  SET @changed=@@ROWCOUNT;
  CHECKPOINT;
END;
SELECT COUNT_BIG(*) AS remaining FROM dbo.chiron_expand WHERE status_v2 IS NULL;
DROP TABLE dbo.chiron_expand;
-- Só depois de zero divergências e writers compatíveis: NOT NULL, troca de leitura e contração.`,
  ],
  "INSERT, OUTPUT e identidade": [
    `DROP TABLE IF EXISTS dbo.chiron_insert;
CREATE TABLE dbo.chiron_insert(id bigint IDENTITY PRIMARY KEY, request_key uniqueidentifier NOT NULL UNIQUE, payload nvarchar(40) NOT NULL);
DECLARE @r uniqueidentifier=NEWID();
INSERT dbo.chiron_insert(request_key,payload) OUTPUT inserted.id,inserted.request_key VALUES(@r,N'ok');
SELECT id,request_key,payload FROM dbo.chiron_insert WHERE request_key=@r;
DROP TABLE dbo.chiron_insert;`,
    `DROP TABLE IF EXISTS dbo.chiron_insert;
CREATE TABLE dbo.chiron_insert(id int IDENTITY PRIMARY KEY,payload varchar(10));
INSERT dbo.chiron_insert(payload) VALUES('a'),('b');
SELECT SCOPE_IDENTITY() AS only_last_identity, IDENT_CURRENT(N'dbo.chiron_insert') AS table_high_watermark;
DROP TABLE dbo.chiron_insert;`,
  ],
  "UPDATE, DELETE e concorrência otimista": [
    `DROP TABLE IF EXISTS dbo.chiron_versioned;
CREATE TABLE dbo.chiron_versioned(id int PRIMARY KEY,status varchar(12) NOT NULL,rv rowversion);
INSERT dbo.chiron_versioned(id,status) VALUES(1,'open');
DECLARE @rv binary(8)=(SELECT rv FROM dbo.chiron_versioned WHERE id=1);
UPDATE dbo.chiron_versioned SET status='paid' OUTPUT inserted.id,inserted.status,inserted.rv WHERE id=1 AND rv=@rv;
IF @@ROWCOUNT=0 THROW 51010,'Conflito otimista',1;
DROP TABLE dbo.chiron_versioned;`,
    `DROP TABLE IF EXISTS dbo.chiron_delete;
CREATE TABLE dbo.chiron_delete(id int PRIMARY KEY,status varchar(12)); INSERT dbo.chiron_delete VALUES(1,'open'),(2,'paid');
DELETE dbo.chiron_delete OUTPUT deleted.id,deleted.status WHERE status='open';
SELECT COUNT(*) AS survivors FROM dbo.chiron_delete;
DROP TABLE dbo.chiron_delete;`,
  ],
  "MERGE, upsert e alternativas": [
    `DROP TABLE IF EXISTS dbo.chiron_upsert;
CREATE TABLE dbo.chiron_upsert(k int PRIMARY KEY,v int NOT NULL);
BEGIN TRAN;
UPDATE dbo.chiron_upsert WITH(UPDLOCK,SERIALIZABLE) SET v=20 WHERE k=1;
IF @@ROWCOUNT=0 INSERT dbo.chiron_upsert(k,v) VALUES(1,20);
COMMIT;
SELECT k,v FROM dbo.chiron_upsert;
DROP TABLE dbo.chiron_upsert;`,
    `DROP TABLE IF EXISTS dbo.chiron_merge;
CREATE TABLE dbo.chiron_merge(k int PRIMARY KEY,v int NOT NULL); INSERT dbo.chiron_merge VALUES(1,10);
MERGE dbo.chiron_merge AS t USING(VALUES(1,20),(2,30)) AS s(k,v) ON t.k=s.k
WHEN MATCHED THEN UPDATE SET v=s.v WHEN NOT MATCHED THEN INSERT(k,v) VALUES(s.k,s.v)
OUTPUT $action,inserted.k,deleted.v,inserted.v;
DROP TABLE dbo.chiron_merge;`,
  ],
  "Stored procedures e parâmetros": [
    `CREATE OR ALTER PROCEDURE dbo.chiron_get_order @id int AS
BEGIN SET NOCOUNT ON; SELECT @id AS id, DB_NAME() AS database_name; END;
EXEC dbo.chiron_get_order @id=42;
DROP PROCEDURE dbo.chiron_get_order;`,
    `DECLARE @column sysname=N'name';
IF @column NOT IN(N'name',N'object_id') THROW 51011,'Ordenação não permitida',1;
DECLARE @sql nvarchar(max)=N'SELECT TOP (@n) name,object_id FROM sys.objects ORDER BY '+QUOTENAME(@column)+N';';
EXEC sys.sp_executesql @sql,N'@n int',@n=3;`,
  ],
  "JOIN, APPLY e cardinalidade": [
    `DROP TABLE IF EXISTS dbo.chiron_item; DROP TABLE IF EXISTS dbo.chiron_customer;
CREATE TABLE dbo.chiron_customer(id int PRIMARY KEY,name varchar(30)); CREATE TABLE dbo.chiron_item(customer_id int,amount int);
INSERT dbo.chiron_customer VALUES(1,'Ana'),(2,'Bia'); INSERT dbo.chiron_item VALUES(1,10),(1,20);
SELECT c.id,c.name,SUM(i.amount) AS total FROM dbo.chiron_customer c LEFT JOIN dbo.chiron_item i ON i.customer_id=c.id GROUP BY c.id,c.name;
DROP TABLE dbo.chiron_item; DROP TABLE dbo.chiron_customer;`,
    `SELECT o.object_id,o.name,x.index_count
FROM sys.objects o
CROSS APPLY(SELECT COUNT(*) AS index_count FROM sys.indexes i WHERE i.object_id=o.object_id) x
WHERE o.type='U' AND x.index_count>0;`,
  ],
  "GROUP BY, HAVING e GROUPING SETS": [
    `WITH sales(region,product,amount) AS (SELECT * FROM(VALUES('S','A',10),('S','B',20),('N','A',5))v(region,product,amount))
SELECT region,product,SUM(amount) total,GROUPING_ID(region,product) grouping_level
FROM sales GROUP BY GROUPING SETS((region,product),(region),());`,
    `WITH sales(customer_id,amount) AS (SELECT * FROM(VALUES(1,10),(1,20),(2,5))v(customer_id,amount))
SELECT customer_id,SUM(amount) total FROM sales GROUP BY customer_id HAVING SUM(amount)>=20;`,
  ],
  "Window functions e frames": [
    `WITH e(account_id,seq,amount) AS (SELECT * FROM(VALUES(1,1,10),(1,2,5),(1,2,7))v(account_id,seq,amount))
SELECT account_id,seq,amount,SUM(amount) OVER(PARTITION BY account_id ORDER BY seq ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) running_total
FROM e ORDER BY account_id,seq,amount;`,
    `WITH e(k,ts,v) AS (SELECT * FROM(VALUES(1,1,10),(1,2,20),(1,3,30))x(k,ts,v))
SELECT k,ts,v,LAG(v) OVER(PARTITION BY k ORDER BY ts) previous_v,
 AVG(CONVERT(decimal(10,2),v)) OVER(PARTITION BY k ORDER BY ts ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) moving_avg FROM e;`,
  ],
  "CTEs, recursão e set operators": [
    `WITH tree AS(SELECT 1 id,CAST('/1/' AS varchar(100)) path,0 depth UNION ALL SELECT id+1,CAST(CONCAT(path,id+1,'/') AS varchar(100)),depth+1 FROM tree WHERE id<5)
SELECT id,path,depth FROM tree OPTION(MAXRECURSION 10);`,
    `WITH a(v) AS(SELECT * FROM(VALUES(1),(2),(2))x(v)),b(v) AS(SELECT * FROM(VALUES(2),(3))x(v))
SELECT v FROM a UNION SELECT v FROM b;
WITH a(v) AS(SELECT * FROM(VALUES(1),(2),(2))x(v)),b(v) AS(SELECT * FROM(VALUES(2),(3))x(v))
SELECT v FROM a EXCEPT SELECT v FROM b;`,
  ],
  "Clustered e nonclustered indexes": [
    `DROP TABLE IF EXISTS dbo.chiron_index;
CREATE TABLE dbo.chiron_index(id bigint NOT NULL,tenant_id int NOT NULL,status varchar(12),payload varchar(100),CONSTRAINT PK_chiron_index PRIMARY KEY CLUSTERED(tenant_id,id));
CREATE INDEX IX_chiron_index_status ON dbo.chiron_index(tenant_id,status) INCLUDE(payload);
SELECT i.name,i.type_desc,i.is_unique FROM sys.indexes i WHERE i.object_id=OBJECT_ID(N'dbo.chiron_index');
DROP TABLE dbo.chiron_index;`,
    `SELECT i.name,ius.user_seeks,ius.user_scans,ius.user_updates
FROM sys.indexes i LEFT JOIN sys.dm_db_index_usage_stats ius ON ius.database_id=DB_ID() AND ius.object_id=i.object_id AND ius.index_id=i.index_id
WHERE i.object_id=OBJECT_ID(N'dbo.chiron_index');`,
  ],
  "Planos estimados e reais": [
    `SET SHOWPLAN_XML ON;
GO
SELECT name FROM sys.objects WHERE object_id=OBJECT_ID(N'dbo.nonexistent');
GO
SET SHOWPLAN_XML OFF;`,
    `SET STATISTICS IO ON; SET STATISTICS TIME ON;
SELECT TOP(20) o.name,i.name index_name FROM sys.objects o LEFT JOIN sys.indexes i ON i.object_id=o.object_id ORDER BY o.object_id,i.index_id;
SET STATISTICS IO OFF; SET STATISTICS TIME OFF;`,
  ],
  "Estatísticas, skew e cardinality estimator": [
    `DROP TABLE IF EXISTS dbo.chiron_skew; CREATE TABLE dbo.chiron_skew(id int IDENTITY PRIMARY KEY,status char(1));
INSERT dbo.chiron_skew(status) SELECT TOP(1000) 'A' FROM sys.all_objects;
INSERT dbo.chiron_skew(status) VALUES('Z'); CREATE INDEX IX_chiron_skew_status ON dbo.chiron_skew(status);
UPDATE STATISTICS dbo.chiron_skew IX_chiron_skew_status WITH FULLSCAN;
DBCC SHOW_STATISTICS('dbo.chiron_skew','IX_chiron_skew_status') WITH HISTOGRAM;
DROP TABLE dbo.chiron_skew;`,
    `SELECT s.name,sp.last_updated,sp.rows,sp.rows_sampled,sp.modification_counter
FROM sys.stats s CROSS APPLY sys.dm_db_stats_properties(s.object_id,s.stats_id) sp
WHERE s.object_id=OBJECT_ID(N'dbo.chiron_skew');`,
  ],
  "Parameter sniffing, PSP e OPPO": [
    `CREATE OR ALTER PROCEDURE dbo.chiron_by_status @status char(1) AS SELECT object_id,name FROM sys.objects WHERE type=@status;
EXEC dbo.chiron_by_status @status='U'; EXEC dbo.chiron_by_status @status='V';
SELECT qs.execution_count,qs.min_logical_reads,qs.max_logical_reads FROM sys.dm_exec_query_stats qs CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle)t WHERE t.text LIKE '%chiron_by_status%';
DROP PROCEDURE dbo.chiron_by_status;`,
    `DECLARE @type char(2)=NULL;
SELECT object_id,name FROM sys.objects WHERE (@type IS NULL OR type=@type)
OPTION(USE HINT('DISABLE_OPTIONAL_PARAMETER_OPTIMIZATION'));
SELECT compatibility_level FROM sys.databases WHERE name=DB_NAME();`,
  ],
  "Autocommit, IMPLICIT_TRANSACTIONS e XACT_ABORT": [
    `SET XACT_ABORT ON; BEGIN TRY BEGIN TRAN; SELECT @@TRANCOUNT trancount,XACT_STATE() xstate; COMMIT; END TRY BEGIN CATCH IF XACT_STATE()<>0 ROLLBACK; THROW; END CATCH;`,
    `SET IMPLICIT_TRANSACTIONS ON; SELECT @@OPTIONS options_before; SELECT 1 AS probe; IF @@TRANCOUNT>0 ROLLBACK; SET IMPLICIT_TRANSACTIONS OFF; SELECT @@TRANCOUNT trancount_after;`,
  ],
  "Isolation levels e row versioning": [
    `SELECT name,is_read_committed_snapshot_on,snapshot_isolation_state_desc FROM sys.databases WHERE database_id=DB_ID(); SET TRANSACTION ISOLATION LEVEL SNAPSHOT; SELECT SESSIONPROPERTY('TRANSACTION_ISOLATION_LEVEL') isolation_level;`,
    `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; BEGIN TRAN; SELECT COUNT(*) object_count FROM sys.objects WHERE object_id BETWEEN 1 AND 100000; SELECT request_mode,resource_type FROM sys.dm_tran_locks WHERE request_session_id=@@SPID; ROLLBACK;`,
  ],
  "Key, range, schema e escalation locks": [
    `BEGIN TRAN; SELECT TOP(1) object_id FROM sys.objects WITH(UPDLOCK,HOLDLOCK) ORDER BY object_id; SELECT resource_type,request_mode,request_status FROM sys.dm_tran_locks WHERE request_session_id=@@SPID; ROLLBACK;`,
    `SELECT request_session_id,resource_type,request_mode,request_status,resource_description FROM sys.dm_tran_locks WHERE request_status IN('WAIT','GRANT') ORDER BY request_session_id;`,
  ],
  "Deadlocks, timeouts e retry": [
    `SET LOCK_TIMEOUT 1000; BEGIN TRY BEGIN TRAN; SELECT TOP(1) object_id FROM sys.objects WITH(UPDLOCK); COMMIT; END TRY BEGIN CATCH IF XACT_STATE()<>0 ROLLBACK; SELECT ERROR_NUMBER() error_number,ERROR_MESSAGE() error_message; END CATCH; SET LOCK_TIMEOUT -1;`,
    `DECLARE @attempt int=0,@max int=3; WHILE @attempt<@max BEGIN BEGIN TRY SET @attempt+=1; SELECT @attempt attempt; BREAK; END TRY BEGIN CATCH IF ERROR_NUMBER()<>1205 OR @attempt=@max THROW; WAITFOR DELAY '00:00:00.050'; END CATCH END;`,
  ],
  "JSON textual e paths": [
    `DECLARE @doc nvarchar(max)=N'{"order":{"id":7,"items":[{"sku":"A","qty":2}]}}'; SELECT JSON_VALUE(@doc,'$.order.id') order_id,j.sku,j.qty FROM OPENJSON(@doc,'$.order.items') WITH(sku varchar(20) '$.sku',qty int '$.qty') j;`,
    `DECLARE @doc nvarchar(max)=N'{"status":"open"}'; SELECT ISJSON(@doc) valid_json,JSON_MODIFY(@doc,'$.status','paid') changed,JSON_QUERY(N'[1,2,3]') array_value;`,
  ],
  "Temporal tables e histórico": [
    `DROP TABLE IF EXISTS dbo.chiron_temporal; CREATE TABLE dbo.chiron_temporal(id int PRIMARY KEY,status varchar(12),valid_from datetime2 GENERATED ALWAYS AS ROW START,valid_to datetime2 GENERATED ALWAYS AS ROW END,PERIOD FOR SYSTEM_TIME(valid_from,valid_to)) WITH(SYSTEM_VERSIONING=ON(HISTORY_TABLE=dbo.chiron_temporal_history)); INSERT dbo.chiron_temporal(id,status) VALUES(1,'open'); UPDATE dbo.chiron_temporal SET status='paid' WHERE id=1; SELECT * FROM dbo.chiron_temporal FOR SYSTEM_TIME ALL WHERE id=1; ALTER TABLE dbo.chiron_temporal SET(SYSTEM_VERSIONING=OFF); DROP TABLE dbo.chiron_temporal; DROP TABLE dbo.chiron_temporal_history;`,
    `SELECT t.temporal_type_desc,h.name history_table FROM sys.tables t LEFT JOIN sys.tables h ON h.object_id=t.history_table_id WHERE t.object_id=OBJECT_ID(N'dbo.chiron_temporal');`,
  ],
  "Columnstore e batch mode": [
    `DROP TABLE IF EXISTS dbo.chiron_columnstore; CREATE TABLE dbo.chiron_columnstore(id bigint,category int,amount decimal(12,2)); CREATE CLUSTERED COLUMNSTORE INDEX CCI_chiron ON dbo.chiron_columnstore; SELECT i.name,i.type_desc FROM sys.indexes i WHERE i.object_id=OBJECT_ID(N'dbo.chiron_columnstore'); DROP TABLE dbo.chiron_columnstore;`,
    `SELECT OBJECT_NAME(rg.object_id) AS table_name,rg.state_desc,rg.total_rows,rg.deleted_rows,rg.size_in_bytes FROM sys.dm_db_column_store_row_group_physical_stats AS rg;`,
  ],
  "VECTOR e busca no SQL Server 2025": [
    `SELECT CAST(SERVERPROPERTY('ProductMajorVersion') AS int) major_version; SELECT name,system_type_id,max_length FROM sys.types WHERE name='vector';`,
    `DECLARE @a vector(3)='[1,0,0]',@b vector(3)='[0.8,0.2,0]'; SELECT VECTOR_DISTANCE('cosine',@a,@b) cosine_distance,VECTOR_NORM(@a,'norm2') norm_a;`,
  ],
  "Logins, users e contained databases": [
    `SELECT sp.name login_name,sp.type_desc,sp.is_disabled,dp.name database_user,dp.authentication_type_desc FROM sys.server_principals sp LEFT JOIN sys.database_principals dp ON dp.sid=sp.sid WHERE sp.type IN('S','U','G');`,
    `SELECT USER_NAME() database_user,SUSER_SNAME() login_name,ORIGINAL_LOGIN() original_login,DB_NAME() database_name,SCHEMA_NAME() default_schema;`,
  ],
  "Roles, ownership chains e EXECUTE AS": [
    `SELECT r.name role_name,m.name member_name FROM sys.database_role_members drm JOIN sys.database_principals r ON r.principal_id=drm.role_principal_id JOIN sys.database_principals m ON m.principal_id=drm.member_principal_id ORDER BY r.name,m.name;`,
    `CREATE USER chiron_probe WITHOUT LOGIN; EXECUTE AS USER='chiron_probe'; SELECT USER_NAME() effective_user,HAS_PERMS_BY_NAME(DB_NAME(),'DATABASE','SELECT') can_select_database; REVERT; DROP USER chiron_probe; SELECT USER_NAME() restored_user;`,
  ],
  "TLS, TDE, Always Encrypted e secrets": [
    `SELECT session_id,encrypt_option,auth_scheme,net_transport,protocol_type FROM sys.dm_exec_connections WHERE session_id=@@SPID;`,
    `SELECT d.name,dek.encryption_state,dek.percent_complete,dek.key_algorithm,dek.key_length FROM sys.databases d LEFT JOIN sys.dm_database_encryption_keys dek ON dek.database_id=d.database_id ORDER BY d.name;`,
  ],
  "Injection, RLS, masking e audit": [
    `DECLARE @name nvarchar(100)=N'%sys%'; EXEC sys.sp_executesql N'SELECT TOP(5) name FROM sys.objects WHERE name LIKE @p ORDER BY name',N'@p nvarchar(100)',@p=@name;`,
    `SELECT p.name policy_name,p.is_enabled,pr.predicate_type_desc,OBJECT_SCHEMA_NAME(pr.target_object_id) target_schema,OBJECT_NAME(pr.target_object_id) target_object FROM sys.security_policies p JOIN sys.security_predicates pr ON pr.object_id=p.object_id;`,
  ],
  "Query Store e regressão de plano": [
    `SELECT actual_state_desc,desired_state_desc,readonly_reason,current_storage_size_mb,max_storage_size_mb,query_capture_mode_desc FROM sys.database_query_store_options;`,
    `SELECT TOP (10) q.query_id,p.plan_id,rs.count_executions,rs.avg_duration,rs.avg_logical_io_reads,p.is_forced_plan FROM sys.query_store_query AS q JOIN sys.query_store_plan AS p ON p.query_id=q.query_id JOIN sys.query_store_runtime_stats AS rs ON rs.plan_id=p.plan_id ORDER BY rs.avg_duration DESC;`,
  ],
  "DMVs, Extended Events e waits": [
    `SELECT TOP (20) wait_type,waiting_tasks_count,wait_time_ms,signal_wait_time_ms FROM sys.dm_os_wait_stats WHERE wait_type NOT LIKE 'SLEEP%' ORDER BY wait_time_ms DESC;`,
    `SELECT s.name session_name,s.startup_state,CAST(st.target_data AS xml) target_data FROM sys.server_event_sessions s LEFT JOIN sys.dm_xe_session_targets st ON st.event_session_address=(SELECT address FROM sys.dm_xe_sessions WHERE name=s.name) ORDER BY s.name;`,
  ],
  "Tempdb, memory grants e spills": [
    `SELECT SUM(user_object_reserved_page_count)*8/1024.0 user_objects_mb,SUM(internal_object_reserved_page_count)*8/1024.0 internal_objects_mb,SUM(version_store_reserved_page_count)*8/1024.0 version_store_mb FROM tempdb.sys.dm_db_file_space_usage;`,
    `SELECT session_id,requested_memory_kb,granted_memory_kb,required_memory_kb,used_memory_kb,wait_time_ms FROM sys.dm_exec_query_memory_grants ORDER BY requested_memory_kb DESC;`,
  ],
  "Resource Governor e limites de edição": [
    `SELECT CAST(SERVERPROPERTY('Edition') AS nvarchar(128)) edition,CAST(SERVERPROPERTY('EngineEdition') AS int) engine_edition; SELECT is_enabled,classifier_function_id,max_outstanding_io_per_volume FROM sys.resource_governor_configuration;`,
    `SELECT g.name group_name,g.request_max_memory_grant_percent,g.max_dop,p.name pool_name,p.max_cpu_percent,p.max_memory_percent FROM sys.resource_governor_workload_groups g JOIN sys.resource_governor_resource_pools p ON p.pool_id=g.pool_id;`,
  ],
  "Full, differential e log backup": [
    `SELECT name,recovery_model_desc,log_reuse_wait_desc FROM sys.databases WHERE database_id=DB_ID(); SELECT TOP(20) type,backup_start_date,backup_finish_date,is_copy_only,first_lsn,last_lsn,database_backup_lsn FROM msdb.dbo.backupset WHERE database_name=DB_NAME() ORDER BY backup_finish_date DESC;`,
    `SELECT database_name,type,first_lsn,last_lsn,checkpoint_lsn,database_backup_lsn,is_copy_only FROM msdb.dbo.backupset WHERE database_name=DB_NAME() ORDER BY backup_finish_date;`,
  ],
  "Restore, DBCC CHECKDB e integridade": [
    `DECLARE @db sysname=DB_NAME(); DBCC CHECKDB(@db) WITH PHYSICAL_ONLY,NO_INFOMSGS;`,
    `SELECT TOP (20) destination_database_name,restore_date,restore_type,recovery,backup_set_id FROM msdb.dbo.restorehistory ORDER BY restore_date DESC;`,
  ],
  "Always On, log shipping e fencing": [
    `SELECT CAST(SERVERPROPERTY('IsHadrEnabled') AS int) AS hadr_enabled,CAST(SERVERPROPERTY('IsClustered') AS int) AS is_clustered; SELECT replica_server_name,availability_mode_desc,failover_mode_desc FROM sys.availability_replicas;`,
    `SELECT database_id,synchronization_state_desc,synchronization_health_desc,is_primary_replica,log_send_queue_size,redo_queue_size FROM sys.dm_hadr_database_replica_states;`,
  ],
  "Upgrade, compatibility level e SQL Server 2025": [
    `SELECT @@VERSION version_text,CAST(SERVERPROPERTY('ProductMajorVersion') AS int) major_version,DB_NAME() database_name,compatibility_level FROM sys.databases WHERE database_id=DB_ID();`,
    `SELECT actual_state_desc,query_capture_mode_desc FROM sys.database_query_store_options; SELECT name,value,value_for_secondary FROM sys.database_scoped_configurations WHERE name IN('LEGACY_CARDINALITY_ESTIMATION','PARAMETER_SENSITIVE_PLAN_OPTIMIZATION','OPTIONAL_PARAMETER_OPTIMIZATION');`,
  ],
  "Ledger, temporal e outbox": [
    `DROP TABLE IF EXISTS dbo.chiron_outbox; CREATE TABLE dbo.chiron_outbox(event_id uniqueidentifier PRIMARY KEY,aggregate_id bigint NOT NULL,event_type varchar(50) NOT NULL,payload nvarchar(max) NOT NULL CHECK(ISJSON(payload)=1),created_at datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME(),published_at datetime2(3) NULL); INSERT dbo.chiron_outbox(event_id,aggregate_id,event_type,payload) VALUES(NEWID(),1,'OrderOpened',N'{"orderId":1}'); SELECT * FROM dbo.chiron_outbox; DROP TABLE dbo.chiron_outbox;`,
    `SELECT name,ledger_type_desc,temporal_type_desc,history_table_id FROM sys.tables WHERE ledger_type<>0 OR temporal_type<>0;`,
  ],
  "Harness de concorrência e planos": [
    `SELECT @@SPID session_id,DB_NAME() database_name,SESSIONPROPERTY('TRANSACTION_ISOLATION_LEVEL') isolation_level,@@TRANCOUNT trancount; SELECT actual_state_desc FROM sys.database_query_store_options;`,
    `SELECT r.session_id,r.status,r.wait_type,r.blocking_session_id,r.logical_reads,r.cpu_time,r.total_elapsed_time FROM sys.dm_exec_requests r WHERE r.session_id<>@@SPID;`,
  ],
  "Rehearsal de restore e failover": [
    `SELECT TOP (20) bs.database_name,bs.type,bs.first_lsn,bs.last_lsn,bs.checkpoint_lsn,bmf.physical_device_name FROM msdb.dbo.backupset AS bs JOIN msdb.dbo.backupmediafamily AS bmf ON bmf.media_set_id=bs.media_set_id ORDER BY bs.backup_finish_date DESC;`,
    `SELECT DB_NAME() database_name,SUSER_SNAME() login_name,USER_NAME() database_user,CAST(SERVERPROPERTY('IsHadrEnabled') AS int) hadr_enabled; DBCC CHECKCONSTRAINTS WITH ALL_CONSTRAINTS;`,
  ],
  "Banca e extensão segura": [
    `SELECT CAST(SERVERPROPERTY('ProductVersion') AS nvarchar(30)) build,CAST(SERVERPROPERTY('Edition') AS nvarchar(128)) edition,DB_NAME() database_name,compatibility_level FROM sys.databases WHERE database_id=DB_ID();`,
    `SELECT (SELECT COUNT(*) FROM sys.tables) tables_count,(SELECT COUNT(*) FROM sys.foreign_keys WHERE is_disabled=1 OR is_not_trusted=1) untrusted_constraints,(SELECT COUNT(*) FROM sys.indexes WHERE is_disabled=1) disabled_indexes,@@TRANCOUNT open_transaction;`,
  ],
};
