# Claude Code — verificação do corpus local

Fonte integral 12/48/96/36/48, revisada em 2026-10-03 e integrada após Cursor somente depois de aprovar corpus, contratos e auditoria. **34.758 palavras de prosa**, mínimo individual **692**, piso vigente 600 preservado. Três níveis, porque/quebraria e referência ao Lab Ágora / reserva-estoque-concorrencia. Currículo: sessão, exploração, CLAUDE.md/memória, planejamento/edição, permissões/sandbox, terminal/MCP, skills, hooks, subagentes, automação/checkpoint, armadilhas de segurança/avaliação e projeto Quíron.

## Método e alcance

**96 snippets JavaScript autônomos**, dois por seção: fixture positiva e mutant específico que deve contrariar o oracle. O segundo snippet também confere a implementação correta e exige recusa por `assert.AssertionError`. Resultado esperado é literal independente, ou valor manual do contrato declarado; não é obtido chamando a função avaliada.

Execução real em **Node v24.13.0, Windows x64**. VM nova por snippet autoral confiável, timeout vigente 2 s, require limitado a assert/crypto, com Buffer/URL/Intl disponíveis. **VM não é sandbox para código adversarial.** Nenhum helper ou objeto fictício de Claude Code foi injetado.

Escopos: **62 local-rule, 22 local-transform, 12 model**. Predicados, projeção, parsing JSON, seleção, aritmética, URL e SHA-256 usam mecanismos locais reais. Transições, projeção de decisões, consequência pós-transformação, cobertura de recuperação, replay e análise de overbooking são modelos seriais com dados fornecidos. Não constituem execução de agente, concorrência ou persistência.

Dialetos de caminhos, seleções de regras e schemas são explicitamente restritos. JSON de envelope didático não é schema universal do produto; seleção de nomes de ferramenta não é enforcement; números de prazo/tempo não são medição real; filtro de campos não detecta PII universalmente; payload serializado na ordem fixa não é canonicalização universal; lista de coverage não executa checkpoint. O caso de hash calcula SHA-256 real, mas não garante qualidade, assinatura de origem, autorização ou gravação atômica.

## Contratos, editorial e revisão semântica

Corpus/contratos **98/98 passed**. Auditoria sem violações: similaridade máxima de seções **37,415882%** (<42%), cards **3,921569%** (<78%), exercícios detalhados **100%** (mínimo 65%), snippets duplicados **zero**. Cada capítulo tem quatro seções, três exercícios de tipos 2/3/5 e quatro cards. Nenhum threshold, piso, assertion ou timeout foi reduzido.

Revisão de semântica confrontou texto, literal de entrada, previsão, implementação e mutant. Fronteiras incluem: runtime divergente; resolução relativa ao importador; comentário versus chamada; log de outra execução; unidade ausente; revogação posterior; precondição de base por hash; gate em target diferente; decisão deny/ask/allow declarada; origem de URL semelhante; saída JSON positiva com código de processo falho; tenant incorreto; invocação automática desabilitada; evento posterior usado como controle prévio; código de hook não equivalente a bloqueio; delta versus resultado terminal; alteração Bash fora da cobertura de checkpoint; quantidade fora de inteiro seguro; chave com payload conflitante; lost update com saldo zero e duas confirmações.

Uma descrição de composição de listas foi corrigida antes da execução final para coincidir exatamente com a fixture (user nega secrets; project nega prod). O corpus completo foi executado sobre os textos finais após essa revisão. A estrutura mecânica de materialização/testes segue o padrão anterior; registros, prosa, previsões, exemplos e avaliações são específicos de Claude Code, sem importar prosa Cursor/Office/LLM.

## Evidência e reprodução

- `scripts/claudeCode-evidence.json`: ID, digest SHA-256 de código final, escopo, resultado, duração, ambiente e gates operacionais pendentes.
- `scripts/claudeCode-editorial-evidence.json`: contagens, palavras por seção, métricas e violações.
- `scripts/claude-code-focused-run.log`: contratos e 96 exemplos aprovados.
- `scripts/claude-code-typecheck-run.log`, `scripts/claude-code-build-run.log`, `scripts/claude-code-local-suite-run.log`: gates finais de integração.
- `scripts/claude-code-lessons-01.mjs` a `12.mjs`: registros de autoria específicos; `scripts/build-claude-code-content.mjs` materializa a fonte.

```powershell
$env:CHIRON_WRITE_CLAUDE_CODE_EVIDENCE='1'
pnpm exec vitest run src/lib/study/seeds/content/claudeCode.test.ts src/lib/study/seeds/content/claudeCode.examples.test.ts --maxWorkers=1 --reporter=dot
pnpm run typecheck
pnpm run build
pnpm exec vitest run --maxWorkers=1 --reporter=dot --exclude src/lib/study/seeds/content/ubuntuLinux.examples.test.ts
```

Typecheck aprovado. Build/PWA aprovado: principal **6.085,63 kB**, book-claude-code **350,57 kB** (gzip 71,75), precache **39 entradas / 86.879,66 KiB**. O chunk Claude Code está no precache e o teto vigente de **6 MiB por arquivo** foi preservado. Warnings históricos de chunks grandes e importação Supabase estática/dinâmica permanecem explícitos. Build é geração local de artefato, não publicação externa.

Regressão local final aprovada: **102 arquivos / 1355 testes passed**, 5 arquivos / 19 testes skipped preexistentes, 230.87 s, maxWorkers=1. Exclusão explícita somente de ubuntuLinux.examples.test.ts: seus 96 casos WSL não foram executados, não são contabilizados como aprovações ou novos skips. Nenhum teste, assertion, timeout ou threshold foi reduzido para contornar a indisponibilidade. A suíte global completa não é chamada de verde. Todos os 96 digests finais de Claude Code foram reconferidos contra a execução aprovada.

## Superfícies nativas/remotas pendentes

Não foram executados CLI/IDE/app/web Claude Code, login/conta/provider/modelo, exploração e carregamento nativos de CLAUDE.md/imports/regras/auto memory, compactação real, habilidades invocadas, subagentes, hooks instalados, permissões efetivas, sandbox/filesystem/rede, checkpoint/rewind, print/stream-json reais, MCP/protocolo/credenciais, cancelamento remoto, política de retenção/exclusão, custo medido, acessibilidade, publicação ou rollback operacional. A consulta read-only de disponibilidade de `claude` no PATH não encontrou um comando; isso não é uma inspeção de todas as possíveis instalações do computador. Nenhum runtime, SDK, provider, servidor, VM ou infraestrutura foi instalado para simular as provas.

O Lab é referência curricular: não houve backend concorrente real, transação, durable replay, crash/restore, notificação/cobrança ou execução da camada nesta fonte. O modelo que mostra saldo zero com duas confirmações é análise de uma observação fornecida, não execução de interleaving concorrente. Todos esses gates permanecem **Pending como execução**, ainda que o método esteja explicado.

WSL/Ubuntu continua gate independente indisponível conforme os registros anteriores. Nenhuma distribuição reiniciada e nenhuma tarefa alheia encerrada. A regressão local exclui somente seu arquivo; seus 96 casos não foram exercitados nem creditados como aprovação/novos skips. Windows/Node não recebe nome de Ubuntu. A suíte global completa não é declarada verde.

## Referências oficiais consultadas

Consultadas em 2026-10-03; afirmações sobre mecanismos do produto se limitam ao alcance documental pertinente. Não fixamos versão instalada, catálogo de modelos, tarifas, quotas, prazo universal de retenção, precedência universal por merge genérico ou proteção total por prompt.

- [Overview](https://code.claude.com/docs/en/overview): superfícies e loop de ferramentas.
- [Memory](https://code.claude.com/docs/en/memory): CLAUDE.md, imports relativos ao arquivo importador, regras e memória.
- [Settings](https://code.claude.com/docs/en/settings): escopos e composição por chave; listas e escalares não tratados por um merge universal.
- [Permissions](https://code.claude.com/docs/en/permissions) e [permission modes](https://code.claude.com/docs/en/permission-modes): controles da chamada e modos.
- [Sandboxing](https://code.claude.com/docs/en/sandboxing): isolamento e alcance por superfície; predicado URL local não o valida.
- [Skills](https://code.claude.com/docs/en/skills): instruções reutilizáveis e controle de invocação.
- [Subagents](https://code.claude.com/docs/en/sub-agents): contexto, capacidade e modalidades de herança; não generalizamos isolamento para todo fork.
- [Hooks](https://code.claude.com/docs/en/hooks): entradas/saídas e consequência por evento. A diferença entre PreToolUse, PostToolUse e Stop, códigos e decisões não foi reduzida a uma regra universal de erro bloqueante.
- [MCP](https://code.claude.com/docs/en/mcp): ferramentas externas e fronteiras de identidade.
- [Checkpointing](https://code.claude.com/docs/en/checkpointing): cobertura de edição; mudanças por Bash não tratadas como recuperação automática.
- [Programmatic usage](https://code.claude.com/docs/en/headless): print, saída JSON/JSONL e resultado terminal; envelopes dos exercícios têm domínio declarado.
- [Security](https://code.claude.com/docs/en/security), [Data usage](https://code.claude.com/docs/en/data-usage), [Best practices](https://code.claude.com/docs/en/best-practices): autoridade dos dados, políticas e fluxo de verificação.

Políticas de elegibilidade, TTL, capacidades e deadlines das fixtures são contratos didáticos explícitos, não controles internos prometidos de Claude Code.
