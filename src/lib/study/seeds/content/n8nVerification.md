# N8N — verificação integral da fonte

Revisão: 2026-10-01. Fonte curada: `n8n.ts`, integrada em `runSeed()` imediatamente depois de Ubuntu / Linux somente após completar e executar o corpus. O batch `operations-product` permanece em andamento. Esta solicitação conclui somente N8N.

## Conteúdo e contratos

12 capítulos e 48 seções autorais, em três níveis; 35.011 palavras de prosa, mínimo 707 por seção, acima do piso vigente de 600. Cada seção tem dois códigos, `porque` e `quebraria`. Há 36 exercícios específicos dos tipos 2/3/5, 48 flashcards e referência ao Lab Ágora / `reserva-estoque-concorrencia`.

`n8nCurriculum.ts` define o currículo. `n8nProse01.ts` a `12.ts` contêm autoria por seção, reunida em `n8nAuthoredProse.ts`. `n8nExamples.ts` guarda o texto final dos exemplos. `n8nAssessments.ts` guarda perguntas/respostas/falhas e cenários próprios. Não há compositor de prosa genérica ou appendix usado para atingir densidade.

O teste materializa a fonte e exige cardinalidades, chaves exatas, piso, três níveis, contratos por capítulo/fonte e auditoria editorial. Máxima similaridade de seções: 1,231527% (<42%); cards: 5,405405% (<78%); exercícios detalhados: 100% (≥65%); códigos duplicados: zero. Zero violações. Nenhum threshold foi reduzido ou alterado.

## Execução e alcance da evidência

96/96 snippets JavaScript foram executados no Node v24.13.0, Windows x64, em contexto VM novo por snippet. São 45 `local-rule`, 17 `local-transform` e 34 `model`. Captions declaram o escopo. Todos possuem assertions sobre fixtures; casos negativos e mutantes verificam propriedades específicas, incluindo tenant, cardinalidade, origem, conflito de payload e duplicação. HMAC, SHA-256, Buffer, URL e Intl são mecanismos Node reais sobre dados sintéticos. Modelos de fila, outbox, reserva e restore operam sequencialmente em memória.

O harness executa exatamente `example.code`, com timeout, `node:assert/strict`, `node:crypto`, Buffer, URL e Intl. Não injeta `$input`, `$json`, helpers n8n ou serviços falsamente apresentados como reais. A VM organiza execução de código autoral confiável; não é sandbox de segurança para código adversarial. Não há acesso de rede ou escrita nos snippets. Nenhum runtime n8n, node comunitário, serviço ou pacote foi instalado para criar aparência de validação.

`scripts/n8n-evidence.json` registra ID, SHA-256 do texto executado, escopo, resultado, duração e runtime. `scripts/n8n-editorial-evidence.json` registra métricas, contagem de cada seção e violações. O teste de seed exige exatamente uma fonte `built_in`, imediatamente após Ubuntu/Linux, com 12/48/96/36/48. A attestation `examplesVerified` cobre os exemplos nos escopos declarados; não certifica execução no motor n8n.

Reprodução em PowerShell:

```powershell
$env:CHIRON_WRITE_N8N_EVIDENCE = '1'
pnpm exec vitest run src/lib/study/seeds/content/n8n.test.ts src/lib/study/seeds/content/n8n.examples.test.ts src/lib/study/seeds/index.test.ts src/lib/content/editorial.test.ts --maxWorkers=2 --reporter=dot
pnpm typecheck
pnpm build
pnpm exec vitest run --maxWorkers=2 --reporter=dot
```

Corpus/contratos: 98/98. Gates focados com integração/editorial: 108/108. Typecheck e build/PWA aprovados. Suíte global: 93 arquivos/956 testes aprovados, 5 arquivos/19 testes skipped preexistentes, 148,71 s. Nenhum skip N8N foi introduzido. Build final: principal 6.085,09 kB e precache 29 entradas/54.879,30 KiB, sem alteração de configuração ou limites. Resultado em PLANO.md/HANDOFF.md e `scripts/n8n-global-test-run.log`. Permanecem warnings conhecidos de tamanho de chunks e import estático/dinâmico de Supabase, sem alteração do build para ocultá-los.

## Gates operacionais

| Superfície | Estado e evidência necessária |
|---|---|
| Motor, editor, import/export e helpers nativos | Pending: runtime ausente; importar definição real, verificar versão/edição e executar fixtures no motor |
| Publicação, Schedule, Webhook, Wait e aprovação | Pending: revisão publicada, caminho produtivo isolado, callback, prazo e resultado observados |
| HTTP, credentials e providers de IA | Pending: requests reais em sandbox, escopo autorizado, efeito no ledger, modelo/config/dataset avaliados |
| Banco, última vaga, outbox e broker | Pending: transação, clientes concorrentes, crash em janela definida e replay durável observados |
| Projects/RBAC, SSRF, runners e supply chain | Pending: principals permitidos/negados, redirects/DNS, configuração efetiva e isolamento reais |
| Queue mode, workers, quotas, carga, logs e paging | Pending: topologia disponível, orçamento coordenado, métricas e entrega de alerta observados |
| Backup, restore, upgrades, RPO/RTO | Pending: componentes reais restaurados em isolamento, reconciliação e operação conhecida com medição |

Uma fixture de transcript não é um request enviado. Um grafo simplificado não é schema oficial de import. Um Set de papéis não é RBAC aplicado. Restore de JSON não restaura n8n. Os capítulos e exemplos preservam essas fronteiras explicitamente. Não declarar esses gates Verified sem ensaio autorizado na superfície correspondente.

## Referências primárias verificadas

A documentação foi consultada em 2026-10-01. O índice [llms.txt](https://docs.n8n.io/llms.txt) foi usado para localizar caminhos atuais; alguns caminhos antigos e tentativas `.md` não retornaram conteúdo e foram substituídos por páginas oficiais disponíveis. Não há afirmação de instalação ou patch atual neste workspace. A disponibilidade de recursos deve ser confirmada na edição, plano e versão da instância alvo.

- [Estrutura de dados](https://docs.n8n.io/build/work-with-data/understand-n8ns-data-structure), [item linking no Code](https://docs.n8n.io/build/work-with-data/reference-data/link-data-items/preserving-linking-in-the-code-node) e [Code node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code) apoiam a distinção entre contrato explícito e contexto nativo não exercitado.
- [Save e publish](https://docs.n8n.io/build/understand-workflows/save-and-publish-workflows) apoia a distinção entre draft e versão publicada; [Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook), [HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest), [sub-workflow](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executeworkflow) e [Wait](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.wait) orientam os gates nativos.
- [Data tables](https://docs.n8n.io/build/work-with-data/data-tables), [queue mode](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/enable-queue-mode) e [concorrência](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/control-concurrency) apoiam revisão de storage e escopo de limites.
- [Rotação de encryption keys](https://docs.n8n.io/deploy/host-n8n/configure-n8n/security/rotate-encryption-keys) distingue chave mestra e chaves de dados; [SSRF](https://docs.n8n.io/deploy/host-n8n/configure-n8n/security/enable-ssrf-protection), [runners](https://docs.n8n.io/deploy/host-n8n/configure-n8n/set-up-task-runners) e [hardening](https://docs.n8n.io/deploy/host-n8n/configure-n8n/security/harden-task-runners) orientam ensaios de enforcement.
- [Source control](https://docs.n8n.io/administer/use-source-control-and-environments/understand-source-control), [backup/restore](https://docs.n8n.io/deploy/host-n8n/keep-n8n-running/backup-and-restore), [breaking changes 2.0](https://docs.n8n.io/changelog/v20-breaking-changes) e [release notes](https://docs.n8n.io/changelog/release-notes) orientam compatibilidade e recuperação.
- [Contexto em IA](https://docs.n8n.io/build/integrate-ai/understand-ai-components/retrieve-relevant-context) e [avaliação](https://docs.n8n.io/build/integrate-ai/test-and-improve-ai-workflows) orientam os componentes que exigem avaliação real. Scoring local e policies não substituem chamada ou avaliação de provedor.
