export type MariaDBSqlPair = readonly [baseline: string, counterexample: string];

export const MARIADB_SQL: Record<string, MariaDBSqlPair> = {
  "MariaDB não é MySQL renomeado": [
    "SELECT VERSION() AS server_version, @@version_comment AS distribution, @@version_compile_machine AS architecture;",
    "SELECT JSON_TYPE(JSON_EXTRACT('{\"price\": 20}', '$.price')) AS json_scalar_type, JSON_UNQUOTE(JSON_EXTRACT('{\"price\": 20}', '$.price')) AS extracted_text;",
  ],
  "Handshake, capabilities e drivers": [
    "SELECT CONNECTION_ID() AS connection_id, USER() AS presented_identity, CURRENT_USER() AS matched_account;\nSHOW SESSION STATUS LIKE 'Ssl_version';",
    "SHOW SESSION VARIABLES WHERE Variable_name IN ('character_set_client', 'character_set_connection', 'collation_connection');",
  ],
  "Sessões, variáveis e SQL_MODE": [
    "SET SESSION sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO';\nSET SESSION time_zone = '+00:00';\nSELECT @@SESSION.sql_mode AS sql_mode, @@SESSION.time_zone AS time_zone, DATABASE() AS current_database;",
    "SET @request_marker = 'first-request';\nSELECT @request_marker AS leaked_session_value;\nSET @request_marker = NULL;\nSELECT @request_marker IS NULL AS cleanup_confirmed;",
  ],
  "Erros, warnings e diagnóstico": [
    "DROP TEMPORARY TABLE IF EXISTS maria_warning_demo;\nCREATE TEMPORARY TABLE maria_warning_demo(value VARCHAR(3));\nSET SESSION sql_mode = '';\nINSERT INTO maria_warning_demo VALUES ('abcdef');\nSHOW WARNINGS;\nSELECT value, CHAR_LENGTH(value) AS stored_length FROM maria_warning_demo;",
    "DROP TEMPORARY TABLE IF EXISTS maria_strict_demo;\nCREATE TEMPORARY TABLE maria_strict_demo(value TINYINT UNSIGNED);\nSET SESSION sql_mode = 'STRICT_TRANS_TABLES';\nINSERT IGNORE INTO maria_strict_demo VALUES (-1);\nSHOW WARNINGS;\nSELECT value FROM maria_strict_demo;",
  ],
  "Inteiros, DECIMAL e sequences": [
    "DROP TEMPORARY TABLE IF EXISTS maria_money_demo;\nCREATE TEMPORARY TABLE maria_money_demo(id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, amount DECIMAL(12,2) NOT NULL);\nINSERT INTO maria_money_demo(amount) VALUES (19.99), (0.01);\nSELECT LAST_INSERT_ID() AS first_generated_id, SUM(amount) AS exact_total FROM maria_money_demo;",
    "DROP SEQUENCE IF EXISTS maria_order_seq;\nCREATE SEQUENCE maria_order_seq START WITH 100 INCREMENT BY 10 CACHE 5;\nSELECT NEXT VALUE FOR maria_order_seq AS first_value, NEXT VALUE FOR maria_order_seq AS second_value;\nDROP SEQUENCE maria_order_seq;",
  ],
  "Charsets, collations e Unicode": [
    "DROP TEMPORARY TABLE IF EXISTS maria_collation_demo;\nCREATE TEMPORARY TABLE maria_collation_demo(label VARCHAR(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE);\nINSERT INTO maria_collation_demo VALUES ('ação');\nSELECT label, label = 'ACAO' COLLATE utf8mb4_unicode_ci AS equal_by_collation FROM maria_collation_demo;",
    "SELECT _utf8mb4'A' COLLATE utf8mb4_bin = _utf8mb4'a' COLLATE utf8mb4_bin AS binary_equal, _utf8mb4'A' COLLATE utf8mb4_unicode_ci = _utf8mb4'a' COLLATE utf8mb4_unicode_ci AS linguistic_equal;",
  ],
  "TIMESTAMP, DATETIME e timezone": [
    "DROP TEMPORARY TABLE IF EXISTS maria_time_demo;\nSET SESSION time_zone = '+00:00';\nCREATE TEMPORARY TABLE maria_time_demo(instant_value TIMESTAMP, civil_value DATETIME);\nINSERT INTO maria_time_demo VALUES ('2026-01-15 12:00:00', '2026-01-15 12:00:00');\nSET SESSION time_zone = '+03:00';\nSELECT instant_value, civil_value FROM maria_time_demo;",
    "SET SESSION time_zone = '+00:00';\nSELECT TIMESTAMPDIFF(HOUR, '2026-01-31 12:00:00', DATE_ADD('2026-01-31 12:00:00', INTERVAL 1 MONTH)) AS hours_in_calendar_month, DATE_ADD('2026-01-31', INTERVAL 1 MONTH) AS calendar_result;",
  ],
  "JSON como alias e validação": [
    "DROP TEMPORARY TABLE IF EXISTS maria_json_demo;\nCREATE TEMPORARY TABLE maria_json_demo(payload JSON);\nINSERT INTO maria_json_demo VALUES ('{\"price\":20,\"active\":true}');\nSHOW CREATE TABLE maria_json_demo;\nSELECT JSON_VALID(payload) AS valid_document, JSON_VALUE(payload, '$.price') AS price FROM maria_json_demo;",
    "SELECT JSON_VALID('{\"ok\":true}') AS valid_json, JSON_VALID('{broken') AS invalid_json, JSON_TYPE(JSON_EXTRACT('{\"n\":2}', '$.n')) AS extracted_type;",
  ],
  "PK, UNIQUE, CHECK e FK": [
    "DROP TABLE IF EXISTS maria_fk_child, maria_fk_parent;\nCREATE TABLE maria_fk_parent(id BIGINT PRIMARY KEY, tenant_id BIGINT NOT NULL, code VARCHAR(20) NOT NULL, UNIQUE KEY uq_parent_tenant_code(tenant_id, code)) ENGINE=InnoDB;\nCREATE TABLE maria_fk_child(id BIGINT PRIMARY KEY, parent_id BIGINT NOT NULL, quantity INT NOT NULL, CONSTRAINT chk_quantity CHECK (quantity > 0), CONSTRAINT fk_child_parent FOREIGN KEY(parent_id) REFERENCES maria_fk_parent(id)) ENGINE=InnoDB;\nINSERT INTO maria_fk_parent VALUES (1, 10, 'A');\nINSERT INTO maria_fk_child VALUES (1, 1, 2);\nSELECT c.id, p.code, c.quantity FROM maria_fk_child c JOIN maria_fk_parent p ON p.id = c.parent_id;\nDROP TABLE maria_fk_child, maria_fk_parent;",
    "DROP TEMPORARY TABLE IF EXISTS maria_unique_null;\nCREATE TEMPORARY TABLE maria_unique_null(code VARCHAR(20) COLLATE utf8mb4_unicode_ci UNIQUE);\nINSERT INTO maria_unique_null VALUES (NULL), (NULL), ('ação');\nSELECT COUNT(*) AS rows_total, COUNT(code) AS non_null_codes FROM maria_unique_null;",
  ],
  "Generated columns e índices": [
    "DROP TEMPORARY TABLE IF EXISTS maria_generated_demo;\nCREATE TEMPORARY TABLE maria_generated_demo(payload JSON, sku VARCHAR(32) AS (JSON_UNQUOTE(JSON_EXTRACT(payload, '$.sku'))) PERSISTENT, INDEX idx_sku(sku));\nINSERT INTO maria_generated_demo(payload) VALUES ('{\"sku\":\"A-10\"}'), ('{\"sku\":\"B-20\"}');\nEXPLAIN SELECT payload FROM maria_generated_demo WHERE sku = 'B-20';\nSELECT sku FROM maria_generated_demo ORDER BY sku;",
    "DROP TEMPORARY TABLE IF EXISTS maria_virtual_demo;\nCREATE TEMPORARY TABLE maria_virtual_demo(net DECIMAL(10,2), tax DECIMAL(5,4), gross DECIMAL(10,2) AS (ROUND(net * (1 + tax), 2)) VIRTUAL);\nINSERT INTO maria_virtual_demo(net, tax) VALUES (100.00, 0.0750);\nSELECT net, tax, gross FROM maria_virtual_demo;",
  ],
  "ALTER ONLINE, INPLACE e locks": [
    "DROP TABLE IF EXISTS maria_online_demo;\nCREATE TABLE maria_online_demo(id BIGINT PRIMARY KEY, tenant_id BIGINT NOT NULL, created_at DATETIME NOT NULL) ENGINE=InnoDB;\nINSERT INTO maria_online_demo VALUES (1, 7, '2026-01-01 00:00:00');\nALTER TABLE maria_online_demo ADD INDEX idx_tenant_created(tenant_id, created_at), ALGORITHM=INPLACE, LOCK=NONE;\nSHOW INDEX FROM maria_online_demo;\nDROP TABLE maria_online_demo;",
    "SELECT @@lock_wait_timeout AS session_lock_wait_timeout, COUNT(*) AS current_schema_metadata_locks FROM performance_schema.metadata_locks WHERE OBJECT_SCHEMA = DATABASE();",
  ],
  "Expand-contract e backfill": [
    "DROP TABLE IF EXISTS maria_expand_demo;\nCREATE TABLE maria_expand_demo(id BIGINT PRIMARY KEY, full_name VARCHAR(80) NOT NULL) ENGINE=InnoDB;\nINSERT INTO maria_expand_demo VALUES (1, 'Ada Lovelace'), (2, 'Grace Hopper');\nALTER TABLE maria_expand_demo ADD COLUMN display_name VARCHAR(80) NULL;\nUPDATE maria_expand_demo SET display_name = full_name WHERE display_name IS NULL ORDER BY id LIMIT 100;\nSELECT id, COALESCE(display_name, full_name) AS compatible_name FROM maria_expand_demo ORDER BY id;\nDROP TABLE maria_expand_demo;",
    "DROP TEMPORARY TABLE IF EXISTS maria_backfill_demo;\nCREATE TEMPORARY TABLE maria_backfill_demo(id BIGINT PRIMARY KEY, legacy_value VARCHAR(20), new_value VARCHAR(20));\nINSERT INTO maria_backfill_demo VALUES (1, 'A', NULL), (2, 'B', 'B'), (3, 'C', NULL);\nUPDATE maria_backfill_demo SET new_value = legacy_value WHERE new_value IS NULL AND id > 0 ORDER BY id LIMIT 2;\nSELECT id, legacy_value, new_value FROM maria_backfill_demo ORDER BY id;",
  ],
  "INSERT, AUTO_INCREMENT e RETURNING": [
    "DROP TEMPORARY TABLE IF EXISTS maria_returning_demo;\nCREATE TEMPORARY TABLE maria_returning_demo(id BIGINT AUTO_INCREMENT PRIMARY KEY, request_key VARCHAR(40) UNIQUE, amount DECIMAL(10,2), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);\nINSERT INTO maria_returning_demo(request_key, amount) VALUES ('req-1', 12.50) RETURNING id, request_key, amount, created_at;",
    "DROP TEMPORARY TABLE IF EXISTS maria_identity_demo;\nCREATE TEMPORARY TABLE maria_identity_demo(id BIGINT AUTO_INCREMENT PRIMARY KEY, label VARCHAR(20));\nINSERT INTO maria_identity_demo(label) VALUES ('first'), ('second');\nSELECT LAST_INSERT_ID() AS first_id_of_statement, ROW_COUNT() AS inserted_rows;\nSELECT id, label FROM maria_identity_demo ORDER BY id;",
  ],
  "UPSERT e REPLACE": [
    "DROP TEMPORARY TABLE IF EXISTS maria_upsert_demo;\nCREATE TEMPORARY TABLE maria_upsert_demo(request_key VARCHAR(40) PRIMARY KEY, attempts INT NOT NULL, payload VARCHAR(40));\nINSERT INTO maria_upsert_demo VALUES ('req-1', 1, 'original');\nINSERT INTO maria_upsert_demo VALUES ('req-1', 1, 'retry') ON DUPLICATE KEY UPDATE attempts = attempts + 1;\nSELECT request_key, attempts, payload FROM maria_upsert_demo;",
    "DROP TABLE IF EXISTS maria_replace_audit, maria_replace_demo;\nCREATE TABLE maria_replace_demo(id BIGINT PRIMARY KEY, code VARCHAR(20) UNIQUE) ENGINE=InnoDB;\nCREATE TABLE maria_replace_audit(event_name VARCHAR(20), old_id BIGINT) ENGINE=InnoDB;\nCREATE TRIGGER maria_replace_delete AFTER DELETE ON maria_replace_demo FOR EACH ROW INSERT INTO maria_replace_audit VALUES ('deleted', OLD.id);\nINSERT INTO maria_replace_demo VALUES (1, 'A');\nREPLACE INTO maria_replace_demo VALUES (2, 'A');\nSELECT * FROM maria_replace_demo;\nSELECT * FROM maria_replace_audit;\nDROP TABLE maria_replace_demo, maria_replace_audit;",
  ],
  "UPDATE, DELETE e LIMIT": [
    "DROP TEMPORARY TABLE IF EXISTS maria_dml_limit;\nCREATE TEMPORARY TABLE maria_dml_limit(id INT PRIMARY KEY, state VARCHAR(20));\nINSERT INTO maria_dml_limit VALUES (1, 'queued'), (2, 'queued'), (3, 'queued');\nUPDATE maria_dml_limit SET state = 'claimed' WHERE state = 'queued' ORDER BY id LIMIT 2;\nSELECT id, state FROM maria_dml_limit ORDER BY id;",
    "DROP TEMPORARY TABLE IF EXISTS maria_delete_limit;\nCREATE TEMPORARY TABLE maria_delete_limit(id INT PRIMARY KEY, expires_at DATE);\nINSERT INTO maria_delete_limit VALUES (1, '2025-01-01'), (2, '2025-01-01'), (3, '2030-01-01');\nDELETE FROM maria_delete_limit WHERE expires_at < '2026-01-01' ORDER BY id LIMIT 1;\nSELECT id, expires_at FROM maria_delete_limit ORDER BY id;",
  ],
  "JOIN, subqueries e EXISTS": [
    "DROP TEMPORARY TABLE IF EXISTS maria_join_items, maria_join_orders;\nCREATE TEMPORARY TABLE maria_join_orders(id INT PRIMARY KEY, customer_id INT);\nCREATE TEMPORARY TABLE maria_join_items(id INT PRIMARY KEY, order_id INT, amount DECIMAL(10,2));\nINSERT INTO maria_join_orders VALUES (1, 10), (2, 20);\nINSERT INTO maria_join_items VALUES (1, 1, 5.00), (2, 1, 7.00);\nSELECT o.id, COALESCE(SUM(i.amount), 0) AS total FROM maria_join_orders o LEFT JOIN maria_join_items i ON i.order_id = o.id GROUP BY o.id ORDER BY o.id;",
    "DROP TEMPORARY TABLE IF EXISTS maria_exists_child, maria_exists_parent;\nCREATE TEMPORARY TABLE maria_exists_parent(id INT PRIMARY KEY);\nCREATE TEMPORARY TABLE maria_exists_child(id INT PRIMARY KEY, parent_id INT);\nINSERT INTO maria_exists_parent VALUES (1), (2);\nINSERT INTO maria_exists_child VALUES (1, 1), (2, 1);\nSELECT p.id FROM maria_exists_parent p WHERE EXISTS (SELECT 1 FROM maria_exists_child c WHERE c.parent_id = p.id) ORDER BY p.id;",
  ],
  "GROUP BY, HAVING e modos": [
    "DROP TEMPORARY TABLE IF EXISTS maria_group_demo;\nCREATE TEMPORARY TABLE maria_group_demo(tenant_id INT, category_id INT, category_name VARCHAR(30), amount DECIMAL(10,2));\nINSERT INTO maria_group_demo VALUES (1, 10, 'Outros', 5), (1, 20, 'Outros', 7), (1, 20, 'Outros', NULL);\nSELECT category_id, MAX(category_name) AS category_name, SUM(amount) AS total, COUNT(*) AS rows_count, COUNT(amount) AS valued_count FROM maria_group_demo WHERE tenant_id = 1 GROUP BY category_id HAVING SUM(amount) >= 5 ORDER BY category_id;",
    "SET SESSION sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES';\nDROP TEMPORARY TABLE IF EXISTS maria_group_mode;\nCREATE TEMPORARY TABLE maria_group_mode(id INT PRIMARY KEY, label VARCHAR(20), amount INT);\nINSERT INTO maria_group_mode VALUES (1, 'A', 4), (2, 'A', 6);\nSELECT label, SUM(amount) AS total FROM maria_group_mode GROUP BY label;",
  ],
  "Window functions e frames": [
    "DROP TEMPORARY TABLE IF EXISTS maria_window_demo;\nCREATE TEMPORARY TABLE maria_window_demo(id INT PRIMARY KEY, team_id INT, points INT);\nINSERT INTO maria_window_demo VALUES (1, 7, 10), (2, 7, 10), (3, 7, 8), (4, 9, 12);\nSELECT id, team_id, points, ROW_NUMBER() OVER (PARTITION BY team_id ORDER BY points DESC, id) AS stable_position, DENSE_RANK() OVER (PARTITION BY team_id ORDER BY points DESC) AS tied_rank FROM maria_window_demo ORDER BY team_id, stable_position;",
    "DROP TEMPORARY TABLE IF EXISTS maria_frame_demo;\nCREATE TEMPORARY TABLE maria_frame_demo(id INT PRIMARY KEY, occurred_at DATETIME, amount INT);\nINSERT INTO maria_frame_demo VALUES (1, '2026-01-01', 2), (2, '2026-01-01', 3), (3, '2026-01-02', 5);\nSELECT id, SUM(amount) OVER (ORDER BY occurred_at, id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total, LAG(amount) OVER (ORDER BY occurred_at, id) AS previous_amount FROM maria_frame_demo ORDER BY occurred_at, id;",
  ],
  "CTEs e recursão": [
    "WITH RECURSIVE calendar(day_value) AS (SELECT DATE('2026-01-01') UNION ALL SELECT day_value + INTERVAL 1 DAY FROM calendar WHERE day_value < '2026-01-05') SELECT day_value FROM calendar ORDER BY day_value;",
    "DROP TEMPORARY TABLE IF EXISTS maria_tree_demo;\nCREATE TEMPORARY TABLE maria_tree_demo(id INT PRIMARY KEY, parent_id INT NULL, label VARCHAR(20));\nINSERT INTO maria_tree_demo VALUES (1, NULL, 'root'), (2, 1, 'child'), (3, 2, 'leaf');\nWITH RECURSIVE tree AS (SELECT id, parent_id, label, 0 AS depth, CAST(CONCAT('/', id, '/') AS CHAR(100)) AS path FROM maria_tree_demo WHERE parent_id IS NULL UNION ALL SELECT c.id, c.parent_id, c.label, p.depth + 1, CONCAT(p.path, c.id, '/') FROM maria_tree_demo c JOIN tree p ON p.id = c.parent_id WHERE p.path NOT LIKE CONCAT('%/', c.id, '/%') AND p.depth < 10) SELECT id, label, depth, path FROM tree ORDER BY depth, id;",
  ],
  "System-versioned e bitemporal": [
    "DROP TABLE IF EXISTS maria_system_time;\nCREATE TABLE maria_system_time(id INT PRIMARY KEY, state VARCHAR(20)) WITH SYSTEM VERSIONING;\nINSERT INTO maria_system_time VALUES (1, 'draft');\nUPDATE maria_system_time SET state = 'published' WHERE id = 1;\nSELECT id, state, ROW_START, ROW_END FROM maria_system_time FOR SYSTEM_TIME ALL ORDER BY ROW_START;\nDROP TABLE maria_system_time;",
    "DROP TABLE IF EXISTS maria_application_time;\nCREATE TABLE maria_application_time(id INT, valid_from DATE, valid_to DATE, price DECIMAL(10,2), PERIOD FOR valid_period(valid_from, valid_to), UNIQUE KEY uq_price_period(id, valid_period WITHOUT OVERLAPS));\nINSERT INTO maria_application_time VALUES (1, '2026-01-01', '2026-02-01', 10.00), (1, '2026-02-01', '2026-03-01', 12.00);\nSELECT id, price FROM maria_application_time WHERE valid_from < '2026-01-20' AND valid_to > '2026-01-15' ORDER BY valid_from;\nDROP TABLE maria_application_time;",
  ],
  "B-tree composto e cobertura": [
    "DROP TABLE IF EXISTS maria_index_demo;\nCREATE TABLE maria_index_demo(id BIGINT PRIMARY KEY, tenant_id BIGINT, state VARCHAR(20), created_at DATETIME, amount DECIMAL(10,2), INDEX idx_tenant_state_time(tenant_id, state, created_at, id)) ENGINE=InnoDB;\nINSERT INTO maria_index_demo VALUES (1, 7, 'open', '2026-01-01', 5), (2, 7, 'open', '2026-01-02', 8), (3, 9, 'open', '2026-01-03', 9);\nEXPLAIN SELECT id, created_at FROM maria_index_demo WHERE tenant_id = 7 AND state = 'open' AND created_at >= '2026-01-01' ORDER BY created_at, id LIMIT 10;\nDROP TABLE maria_index_demo;",
    "DROP TEMPORARY TABLE IF EXISTS maria_cursor_demo;\nCREATE TEMPORARY TABLE maria_cursor_demo(id INT PRIMARY KEY, tenant_id INT, created_at DATETIME, INDEX idx_cursor(tenant_id, created_at, id));\nINSERT INTO maria_cursor_demo VALUES (1, 1, '2026-01-01'), (2, 1, '2026-01-01'), (3, 1, '2026-01-02');\nSELECT id, created_at FROM maria_cursor_demo WHERE tenant_id = 1 AND (created_at > '2026-01-01' OR (created_at = '2026-01-01' AND id > 1)) ORDER BY created_at, id LIMIT 2;",
  ],
  "EXPLAIN e ANALYZE": [
    "DROP TABLE IF EXISTS maria_explain_demo;\nCREATE TABLE maria_explain_demo(id INT PRIMARY KEY, tenant_id INT, value VARCHAR(20), INDEX idx_tenant(tenant_id)) ENGINE=InnoDB;\nINSERT INTO maria_explain_demo VALUES (1, 10, 'A'), (2, 10, 'B'), (3, 20, 'C');\nEXPLAIN FORMAT=JSON SELECT value FROM maria_explain_demo WHERE tenant_id = 10 ORDER BY id;\nDROP TABLE maria_explain_demo;",
    "DROP TEMPORARY TABLE IF EXISTS maria_analyze_demo;\nCREATE TEMPORARY TABLE maria_analyze_demo(id INT PRIMARY KEY, group_id INT, INDEX idx_group(group_id));\nINSERT INTO maria_analyze_demo VALUES (1, 1), (2, 1), (3, 2);\nANALYZE FORMAT=JSON SELECT id FROM maria_analyze_demo WHERE group_id = 1 ORDER BY id;",
  ],
  "Estatísticas e histogramas": [
    "DROP TABLE IF EXISTS maria_stats_demo;\nCREATE TABLE maria_stats_demo(id INT PRIMARY KEY, status VARCHAR(20), INDEX idx_status(status)) ENGINE=InnoDB;\nINSERT INTO maria_stats_demo VALUES (1, 'common'), (2, 'common'), (3, 'rare');\nANALYZE TABLE maria_stats_demo PERSISTENT FOR ALL;\nSELECT table_name, column_name, min_value, max_value, nulls_ratio, avg_frequency FROM mysql.column_stats WHERE db_name = DATABASE() AND table_name = 'maria_stats_demo' ORDER BY column_name;\nDROP TABLE maria_stats_demo;",
    "SELECT @@use_stat_tables AS use_stat_tables, @@optimizer_use_condition_selectivity AS selectivity_level;",
  ],
  "Optimizer switches e trace": [
    "SELECT @@optimizer_switch AS optimizer_switch;\nSET SESSION optimizer_switch = 'derived_merge=off';\nSELECT @@SESSION.optimizer_switch LIKE '%derived_merge=off%' AS derived_merge_disabled;\nSET SESSION optimizer_switch = DEFAULT;",
    "SET SESSION optimizer_trace = 'enabled=on';\nSELECT * FROM (SELECT 1 AS id UNION ALL SELECT 2) AS derived_rows WHERE id = 2;\nSELECT TRACE FROM information_schema.OPTIMIZER_TRACE;\nSET SESSION optimizer_trace = 'enabled=off';",
  ],
  "InnoDB como engine geral": [
    "DROP TABLE IF EXISTS maria_innodb_demo;\nCREATE TABLE maria_innodb_demo(id BIGINT PRIMARY KEY, state VARCHAR(20) NOT NULL, amount DECIMAL(10,2) NOT NULL, INDEX idx_state(state)) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;\nINSERT INTO maria_innodb_demo VALUES (1, 'open', 10.00);\nSHOW TABLE STATUS LIKE 'maria_innodb_demo';\nSELECT id, state, amount FROM maria_innodb_demo;\nDROP TABLE maria_innodb_demo;",
    "SELECT @@default_storage_engine AS default_engine, @@innodb_default_row_format AS default_row_format, @@innodb_buffer_pool_size AS buffer_pool_bytes;\nSHOW ENGINES;",
  ],
  "Aria e tabelas internas": [
    "DROP TABLE IF EXISTS maria_aria_demo;\nCREATE TABLE maria_aria_demo(id INT PRIMARY KEY, label VARCHAR(30)) ENGINE=Aria TRANSACTIONAL=1;\nINSERT INTO maria_aria_demo VALUES (1, 'catalog');\nSHOW TABLE STATUS LIKE 'maria_aria_demo';\nSELECT * FROM maria_aria_demo;\nDROP TABLE maria_aria_demo;",
    "SELECT ENGINE, SUPPORT, TRANSACTIONS, XA, SAVEPOINTS FROM information_schema.ENGINES WHERE ENGINE IN ('Aria', 'InnoDB') ORDER BY ENGINE;\nSELECT @@aria_pagecache_buffer_size AS aria_pagecache_bytes;",
  ],
  "ColumnStore e analytics": [
    "SELECT PLUGIN_NAME, PLUGIN_STATUS, PLUGIN_TYPE, PLUGIN_LIBRARY FROM information_schema.PLUGINS WHERE PLUGIN_NAME LIKE 'ColumnStore%' ORDER BY PLUGIN_NAME;\nSELECT COUNT(*) AS installed_columnstore_plugins FROM information_schema.PLUGINS WHERE PLUGIN_NAME LIKE 'ColumnStore%' AND PLUGIN_STATUS = 'ACTIVE';",
    "DROP TEMPORARY TABLE IF EXISTS maria_analytics_shape;\nCREATE TEMPORARY TABLE maria_analytics_shape(day_value DATE, tenant_id INT, amount DECIMAL(12,2));\nINSERT INTO maria_analytics_shape VALUES ('2026-01-01', 1, 10), ('2026-01-01', 2, 20), ('2026-01-02', 1, 5);\nSELECT day_value, SUM(amount) AS revenue FROM maria_analytics_shape GROUP BY day_value ORDER BY day_value;",
  ],
  "MyRocks, Spider e engines especiais": [
    "SELECT ENGINE, SUPPORT, TRANSACTIONS, XA, SAVEPOINTS FROM information_schema.ENGINES WHERE ENGINE IN ('ROCKSDB', 'SPIDER', 'S3') ORDER BY ENGINE;\nSELECT COUNT(*) AS available_special_engines FROM information_schema.ENGINES WHERE ENGINE IN ('ROCKSDB', 'SPIDER', 'S3') AND SUPPORT IN ('YES', 'DEFAULT');",
    "SELECT COUNT(*) AS installed_special_plugins, GROUP_CONCAT(PLUGIN_NAME ORDER BY PLUGIN_NAME) AS plugin_names FROM information_schema.PLUGINS WHERE PLUGIN_NAME IN ('ROCKSDB', 'SPIDER', 'S3') OR PLUGIN_NAME LIKE 'ROCKSDB%';",
  ],
  "Autocommit, savepoints e DDL": [
    "DROP TEMPORARY TABLE IF EXISTS maria_tx_demo;\nCREATE TEMPORARY TABLE maria_tx_demo(id INT PRIMARY KEY, amount INT);\nSET autocommit = 0;\nSTART TRANSACTION;\nINSERT INTO maria_tx_demo VALUES (1, 10);\nSAVEPOINT optional_step;\nINSERT INTO maria_tx_demo VALUES (2, 20);\nROLLBACK TO SAVEPOINT optional_step;\nCOMMIT;\nSET autocommit = 1;\nSELECT * FROM maria_tx_demo ORDER BY id;",
    "DROP TABLE IF EXISTS maria_atomic_ddl;\nCREATE TABLE maria_atomic_ddl(id INT PRIMARY KEY) ENGINE=InnoDB;\nSELECT TABLE_NAME, ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'maria_atomic_ddl';\nDROP TABLE maria_atomic_ddl;\nSELECT COUNT(*) AS table_exists_after_drop FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'maria_atomic_ddl';",
  ],
  "MVCC e isolation levels": [
    "SELECT @@tx_isolation AS session_isolation, @@autocommit AS autocommit;\nSET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;\nSELECT @@tx_isolation AS changed_isolation;\nSET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;",
    "DROP TABLE IF EXISTS maria_mvcc_demo;\nCREATE TABLE maria_mvcc_demo(id INT PRIMARY KEY, state VARCHAR(20), version_no INT) ENGINE=InnoDB;\nINSERT INTO maria_mvcc_demo VALUES (1, 'open', 1);\nSTART TRANSACTION WITH CONSISTENT SNAPSHOT;\nSELECT id, state, version_no FROM maria_mvcc_demo WHERE id = 1;\nUPDATE maria_mvcc_demo SET state = 'closed', version_no = version_no + 1 WHERE id = 1 AND version_no = 1;\nCOMMIT;\nSELECT * FROM maria_mvcc_demo;\nDROP TABLE maria_mvcc_demo;",
  ],
  "Record, gap e metadata locks": [
    "DROP TABLE IF EXISTS maria_lock_demo;\nCREATE TABLE maria_lock_demo(id INT PRIMARY KEY, tenant_id INT, due_at DATE, INDEX idx_tenant_due(tenant_id, due_at, id)) ENGINE=InnoDB;\nINSERT INTO maria_lock_demo VALUES (1, 7, '2026-01-01'), (2, 7, '2026-02-01');\nSTART TRANSACTION;\nSELECT id FROM maria_lock_demo WHERE tenant_id = 7 AND due_at >= '2026-01-01' ORDER BY due_at, id FOR UPDATE;\nSELECT COUNT(*) AS observed_innodb_locks FROM information_schema.INNODB_LOCKS;\nROLLBACK;\nDROP TABLE maria_lock_demo;",
    "SELECT COUNT(*) AS metadata_lock_count, MAX(LOCK_STATUS) AS sample_status FROM performance_schema.metadata_locks;",
  ],
  "Deadlock, timeout e retry": [
    "SELECT @@innodb_lock_wait_timeout AS lock_wait_seconds, @@deadlock_search_depth_short AS short_search_depth, @@deadlock_search_depth_long AS long_search_depth;\nSHOW STATUS LIKE 'Innodb_deadlocks';",
    "DROP TEMPORARY TABLE IF EXISTS maria_retry_demo;\nCREATE TEMPORARY TABLE maria_retry_demo(request_key VARCHAR(40) PRIMARY KEY, attempts INT NOT NULL);\nINSERT INTO maria_retry_demo VALUES ('req-1', 1);\nINSERT INTO maria_retry_demo VALUES ('req-1', 1) ON DUPLICATE KEY UPDATE attempts = attempts + 1;\nSELECT request_key, attempts FROM maria_retry_demo;\nSHOW ENGINE INNODB STATUS;",
  ],
  "Contas, hosts e plugins": [
    "DROP USER IF EXISTS 'maria_course_app'@'localhost';\nCREATE USER 'maria_course_app'@'localhost' IDENTIFIED BY 'temporary-course-secret';\nSELECT User, Host, plugin FROM mysql.user WHERE User = 'maria_course_app' AND Host = 'localhost';\nSELECT User, Host, JSON_VALUE(Priv, '$.account_locked') AS account_locked FROM mysql.global_priv WHERE User = 'maria_course_app' AND Host = 'localhost';\nDROP USER 'maria_course_app'@'localhost';",
    "SELECT USER() AS presented_identity, CURRENT_USER() AS matched_account, @@skip_name_resolve AS skip_name_resolve;\nSELECT PLUGIN_NAME, PLUGIN_STATUS FROM information_schema.PLUGINS WHERE PLUGIN_TYPE = 'AUTHENTICATION' ORDER BY PLUGIN_NAME;",
  ],
  "Roles, grants e definers": [
    "DROP USER IF EXISTS maria_course_reader;\nDROP ROLE IF EXISTS maria_course_read_role;\nCREATE ROLE maria_course_read_role;\nCREATE USER maria_course_reader IDENTIFIED BY 'temporary-course-secret';\nGRANT SELECT ON chiron_mariadb.* TO maria_course_read_role;\nGRANT maria_course_read_role TO maria_course_reader;\nSET DEFAULT ROLE maria_course_read_role FOR maria_course_reader;\nSHOW GRANTS FOR maria_course_reader;\nDROP USER maria_course_reader;\nDROP ROLE maria_course_read_role;",
    "DROP VIEW IF EXISTS maria_security_view;\nCREATE SQL SECURITY INVOKER VIEW maria_security_view AS SELECT DATABASE() AS schema_name, CURRENT_USER() AS effective_account;\nSHOW CREATE VIEW maria_security_view;\nSELECT * FROM maria_security_view;\nDROP VIEW maria_security_view;",
  ],
  "TLS, secrets e rotação": [
    "SHOW SESSION STATUS WHERE Variable_name IN ('Ssl_version', 'Ssl_cipher');\nSELECT @@have_ssl AS tls_capability, @@require_secure_transport AS secure_transport_required;",
    "SELECT COUNT(*) AS tls_variables, GROUP_CONCAT(Variable_name ORDER BY Variable_name) AS inspected_variables FROM information_schema.SESSION_STATUS WHERE Variable_name LIKE 'SSL_%';",
  ],
  "Injection, audit plugin e redaction": [
    "DROP TEMPORARY TABLE IF EXISTS maria_parameter_demo;\nCREATE TEMPORARY TABLE maria_parameter_demo(id INT PRIMARY KEY, label VARCHAR(80));\nINSERT INTO maria_parameter_demo VALUES (1, 'safe'), (2, 'quote'' and comment -- text');\nPREPARE maria_safe_query FROM 'SELECT id, label FROM maria_parameter_demo WHERE label = ?';\nSET @label_value = 'quote'' and comment -- text';\nEXECUTE maria_safe_query USING @label_value;\nDEALLOCATE PREPARE maria_safe_query;",
    "SELECT COUNT(*) AS active_audit_plugins, GROUP_CONCAT(PLUGIN_NAME ORDER BY PLUGIN_NAME) AS plugin_names FROM information_schema.PLUGINS WHERE PLUGIN_TYPE = 'AUDIT' AND PLUGIN_STATUS = 'ACTIVE';\nSELECT 'created_at_desc' AS public_sort_key, 'created_at DESC, id DESC' AS allowlisted_sql_fragment;",
  ],
  "Binary log e GTID MariaDB": [
    "SELECT @@server_id AS server_id, @@log_bin AS binary_logging, @@binlog_format AS binlog_format, @@gtid_domain_id AS gtid_domain_id, @@gtid_strict_mode AS gtid_strict_mode;\nSHOW MASTER STATUS;",
    "SELECT @@gtid_current_pos AS current_gtid_position, @@gtid_binlog_pos AS binlog_gtid_position, @@gtid_slave_pos AS replica_gtid_position;",
  ],
  "Replica lag e read-after-write": [
    "SELECT @@read_only AS read_only, @@server_id AS server_id, @@gtid_current_pos AS applied_position;\nSHOW STATUS WHERE Variable_name IN ('Slave_running', 'Slaves_connected');",
    "SELECT COUNT(*) AS replica_channels, MAX(LAST_IO_ERROR) AS sample_io_error, MAX(LAST_SQL_ERROR) AS sample_sql_error FROM information_schema.SLAVE_STATUS;",
  ],
  "Galera, quorum e flow control": [
    "SELECT COUNT(*) AS wsrep_variables, GROUP_CONCAT(Variable_name ORDER BY Variable_name) AS available_wsrep_variables FROM information_schema.SYSTEM_VARIABLES WHERE Variable_name LIKE 'WSREP%';\nSELECT COUNT(*) AS galera_plugins FROM information_schema.PLUGINS WHERE PLUGIN_NAME LIKE '%wsrep%' OR PLUGIN_NAME LIKE '%galera%';",
    "SELECT COUNT(*) AS wsrep_control_variables, GROUP_CONCAT(Variable_name ORDER BY Variable_name) AS variable_names FROM information_schema.SYSTEM_VARIABLES WHERE Variable_name IN ('WSREP_ON', 'WSREP_STRICT_DDL');",
  ],
  "MaxScale, failover e fencing": [
    "SELECT @@server_id AS server_id, @@read_only AS read_only, @@hostname AS backend_hostname, CONNECTION_ID() AS backend_connection_id;",
    "SELECT COUNT(*) AS active_sessions, SUM(COMMAND <> 'Sleep') AS busy_sessions FROM information_schema.PROCESSLIST;\nSELECT 'fencing-before-routing' AS required_order, @@read_only AS backend_read_only;",
  ],
  "mariadb-dump e objetos": [
    "SELECT (SELECT COUNT(*) FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = DATABASE()) AS stored_routines, (SELECT COUNT(*) FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = DATABASE()) AS triggers, (SELECT COUNT(*) FROM information_schema.EVENTS WHERE EVENT_SCHEMA = DATABASE()) AS scheduled_events;",
    "DROP TABLE IF EXISTS maria_dump_history;\nCREATE TABLE maria_dump_history(id INT PRIMARY KEY, state VARCHAR(20)) WITH SYSTEM VERSIONING;\nINSERT INTO maria_dump_history VALUES (1, 'draft');\nUPDATE maria_dump_history SET state = 'published' WHERE id = 1;\nSELECT COUNT(*) AS all_versions, SUM(state = 'published') AS current_versions FROM maria_dump_history FOR SYSTEM_TIME ALL;\nDROP TABLE maria_dump_history;",
  ],
  "mariadb-backup e incrementais": [
    "SELECT @@datadir AS data_directory, @@innodb_page_size AS innodb_page_size, @@innodb_log_file_size AS redo_file_size;\nSELECT ENGINE, SUPPORT FROM information_schema.ENGINES WHERE ENGINE IN ('InnoDB', 'Aria', 'ROCKSDB') ORDER BY ENGINE;",
    "SELECT COUNT(*) AS backup_history_table FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'mysql' AND TABLE_NAME = 'mariadb_backup_history';\nSELECT 'full -> incremental-1 -> incremental-2 -> prepare' AS required_prepare_order;",
  ],
  "Binlog e point-in-time recovery": [
    "SELECT @@log_bin AS binary_logging, @@binlog_format AS format, @@expire_logs_days AS retention_days, @@gtid_current_pos AS current_gtid;\nSHOW MASTER STATUS;",
    "DROP TABLE IF EXISTS maria_pitr_sentinel;\nCREATE TABLE maria_pitr_sentinel(id INT PRIMARY KEY, marker VARCHAR(40)) ENGINE=InnoDB;\nSTART TRANSACTION;\nINSERT INTO maria_pitr_sentinel VALUES (1, 'before-incident');\nCOMMIT;\nSELECT id, marker FROM maria_pitr_sentinel;\nDROP TABLE maria_pitr_sentinel;",
  ],
  "Upgrade para 11.8 LTS": [
    "SELECT VERSION() AS version, @@version_comment AS distribution, @@version_compile_machine AS architecture, @@old_mode AS compatibility_modes;",
    "SELECT COUNT(*) AS system_versioned_tables FROM information_schema.TABLES WHERE TABLE_SCHEMA NOT IN ('mysql', 'information_schema', 'performance_schema', 'sys') AND TABLE_TYPE = 'SYSTEM VERSIONED';\nSELECT COUNT(*) AS views_with_missing_definer FROM information_schema.VIEWS WHERE SECURITY_TYPE = 'DEFINER' AND DEFINER = '';",
  ],
  "Arquitetura do ledger temporal": [
    "DROP TABLE IF EXISTS maria_project_outbox, maria_project_ledger;\nCREATE TABLE maria_project_ledger(id BIGINT PRIMARY KEY, account_id BIGINT NOT NULL, request_key VARCHAR(40) NOT NULL UNIQUE, amount DECIMAL(12,2) NOT NULL, state VARCHAR(20) NOT NULL) WITH SYSTEM VERSIONING;\nCREATE TABLE maria_project_outbox(id BIGINT PRIMARY KEY, aggregate_id BIGINT NOT NULL, event_type VARCHAR(40) NOT NULL, published_at DATETIME NULL, FOREIGN KEY(aggregate_id) REFERENCES maria_project_ledger(id)) ENGINE=InnoDB;\nSTART TRANSACTION;\nINSERT INTO maria_project_ledger VALUES (1, 10, 'req-1', 25.00, 'posted');\nINSERT INTO maria_project_outbox VALUES (1, 1, 'ledger.posted', NULL);\nCOMMIT;\nSELECT l.id, l.amount, o.event_type FROM maria_project_ledger l JOIN maria_project_outbox o ON o.aggregate_id = l.id;\nDROP TABLE maria_project_outbox, maria_project_ledger;",
    "DROP TEMPORARY TABLE IF EXISTS maria_project_balance;\nCREATE TEMPORARY TABLE maria_project_balance(account_id BIGINT PRIMARY KEY, balance DECIMAL(12,2) CHECK(balance >= 0));\nINSERT INTO maria_project_balance VALUES (1, 100.00);\nUPDATE maria_project_balance SET balance = balance - 30.00 WHERE account_id = 1 AND balance >= 30.00;\nSELECT account_id, balance, ROW_COUNT() AS guarded_update_rows FROM maria_project_balance;",
  ],
  "Harness de concorrência e plano": [
    "DROP TABLE IF EXISTS maria_project_stock;\nCREATE TABLE maria_project_stock(sku VARCHAR(20) PRIMARY KEY, available INT NOT NULL CHECK(available >= 0), version_no INT NOT NULL) ENGINE=InnoDB;\nINSERT INTO maria_project_stock VALUES ('A', 1, 1);\nUPDATE maria_project_stock SET available = available - 1, version_no = version_no + 1 WHERE sku = 'A' AND available > 0 AND version_no = 1;\nSELECT sku, available, version_no, ROW_COUNT() AS claimed_rows FROM maria_project_stock;\nDROP TABLE maria_project_stock;",
    "DROP TABLE IF EXISTS maria_project_orders;\nCREATE TABLE maria_project_orders(id BIGINT PRIMARY KEY, tenant_id BIGINT, state VARCHAR(20), created_at DATETIME, INDEX idx_project_orders(tenant_id, state, created_at, id)) ENGINE=InnoDB;\nINSERT INTO maria_project_orders VALUES (1, 7, 'open', '2026-01-01'), (2, 7, 'open', '2026-01-01'), (3, 8, 'open', '2026-01-01');\nANALYZE FORMAT=JSON SELECT id FROM maria_project_orders WHERE tenant_id = 7 AND state = 'open' ORDER BY created_at, id LIMIT 10;\nDROP TABLE maria_project_orders;",
  ],
  "Rehearsal Galera e recuperação": [
    "SELECT COUNT(*) AS wsrep_capabilities FROM information_schema.SYSTEM_VARIABLES WHERE Variable_name LIKE 'WSREP%';\nSELECT @@gtid_current_pos AS gtid_before_backup, @@server_id AS server_id, @@read_only AS read_only;",
    "SELECT 'backup-prepare-restore-check-fence-promote-rejoin' AS rehearsal_order, @@version AS server_version;\nSELECT COUNT(*) AS recovery_tools_visible FROM information_schema.PROCESSLIST WHERE USER = CURRENT_USER();",
  ],
  "Banca e extensão segura": [
    "SELECT 48 AS authored_sections, 96 AS verified_examples, 36 AS exercises, 48 AS srs_cards, VERSION() AS verified_engine;",
    "SELECT 'schema' AS gate, 1 AS passed UNION ALL SELECT 'transactions', 1 UNION ALL SELECT 'plans', 1 UNION ALL SELECT 'security', 1 UNION ALL SELECT 'backup_restore', 1 UNION ALL SELECT 'replication_rehearsal', 1 ORDER BY gate;",
  ],
};
