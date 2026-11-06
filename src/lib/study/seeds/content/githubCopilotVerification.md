# GitHub Copilot — verificação integral do corpus

Fonte 12/48/96/36/48, revisada em 2026-10-05 e integrada após Claude Code somente depois de contratos, exemplos e auditoria aprovados. **31.443 palavras de prosa**, mínimo individual **623**, piso 600 preservado. Três níveis, porque/quebraria em todas as seções e referência Lab Ágora / reserva-estoque-concorrencia. Currículo: superfícies e contrato, sugestões inline, Chat/contexto, instruções/prompts/skills, edição no IDE, testes/refatoração, MCP, agente cloud, code review, CLI/agentes/hooks/automação, governança e projeto Quíron.

## Prova executada

**96/96 exemplos JavaScript reais**, Node v24.13.0, Windows x64. VM nova por snippet autoral confiável, timeout vigente 2 s; require limitado a assert/crypto, Buffer/URL/Intl disponíveis. **VM não é sandbox adversarial.** Nenhum helper, SDK ou runtime fictício Copilot foi injetado. Escopos: **50 local-rule, 28 local-transform, 18 model**. Cada seção contém uma fixture positiva com oracle literal independente e uma contraprova cujo mutant específico diverge do oracle e é recusado por assert.AssertionError. Não usar falha incidental de sintaxe como prova.

Contratos e corpus focados: **98/98 testes**. Auditoria sem violações: similaridade máxima entre seções **37,406855% (<42%)**, flashcards **4,166667% (<78%)**, exercícios detalhados **100%**, pares altamente similares zero, snippets duplicados zero. Os testes materializam a fonte e conferem checkChapter, checkSource e checkEditorialSource, cardinalidades, chaves e densidade. Piso, thresholds, assertions e timeouts permanecem intactos.

Na primeira auditoria, o frame comum redundante elevou a similaridade a 43,548387%. Foi removido texto repetitivo de orientação, preservando toda prosa específica e o piso. O corpus inteiro e os contratos foram reexecutados sobre os textos finais e passaram. A estrutura de source/test/materialização segue o padrão anterior; prosa, fixtures, mutants, perguntas, respostas e exercícios foram escritos especificamente em scripts/copilot-lessons-01.mjs a 12.mjs. Nenhuma prosa Claude Code, Cursor ou Office foi importada.

## Revisão semântica

- Sugestão textual, execução observada e ação remota permanecem distintas; a matriz de suporte do exercício é sintética, não uma tabela de versões instaladas.
- Seleção de fragmentos e referências usa metadados fornecidos; não demonstra parser, índice de símbolos ou aceitação nativa. Soma, sort e conversão usam operações reais e oracles discriminantes.
- Deduplicação conserva conflito URL/licença sem decidir licenciamento. Ausência de referência pública não prova originalidade universal.
- Prefixo de pasta é dialeto restrito com barra final, **não** implementação de applyTo/glob. Normalização CLI é POSIX sem symlink ou volume, **não** barreira operacional Windows.
- Script exigido é lista estruturada, **não** parser de Markdown. Campos de prompt e classes de avaliação conferem cobertura declarada, não qualidade semântica universal.
- SHA-256 usa crypto real e base literal independente; não interpreta conciliação de patches. Ownership é manifesto didático, não garantia de rastreamento do produto.
- Ferramenta MCP usa identidade composta; capacidade e retorno são contratos locais, não autenticação ou enforcement remoto.
- Replay por JSON.stringify restringe objeto/ordem declarados; a projeção tenant/sku/qty explicita domínio, sem canonicalização JSON universal ou armazenamento atômico.
- Hook usa envelope didático explicitamente descrito; os campos da fixture **não** são configuração pronta ou schema completo Copilot. Evento posterior não previne efeito já ocorrido.
- Code review confere completude do achado e cobertura declarada, não precisão do modelo. Aprovação contável depende da política efetiva; não ensinar que Copilot sempre conta ou nunca conta.
- Exclusão depende do modo e tem limites documentados; não equivale a gitignore ou isolamento universal. Projeção de log é allowlist conhecida, não scanner completo de segredos.
- Integer seguro, autorização de tenant e conservação são regras executadas sobre valores fornecidos. O traço de atualização perdida é sintético: não houve threads, transação ou banco concorrente nesta prova.
- Métrica inclui retrabalho e declara população; não mede tokens, custo faturado ou produtividade universal. Nenhum catálogo de modelos, tarifa, quota ou retenção universal foi fixado.

## Integração e gates

runSeed() integra uma fonte built_in de ferramenta imediatamente após Claude Code. O teste de seed confere unicidade, ordem e conteúdo completo. Chunk dedicado book-github-copilot conserva o teto de precache de 6 MiB. Resultados finais de typecheck, build/PWA e regressão estão registrados abaixo.

Typecheck e build/PWA aprovados: principal **6.085,74 kB**, book-github-copilot **324,95 kB** (gzip 65,45), precache **41 entradas / 93.280,08 KiB**, chunk Copilot offline e teto **6 MiB** preservado. Warnings históricos de chunks grandes e Supabase estático/dinâmico permanecem. Build gera artefatos locais, sem deploy externo.

Regressão local final aprovada: **104 arquivos / 1454 testes passed**, 5 arquivos / 19 testes skipped preexistentes, 349.43 s, maxWorkers=1. Exclusão explícita somente de ubuntuLinux.examples.test.ts: seus 96 casos WSL não foram executados, não contam como aprovações nem novos skips. Nenhum teste, assertion, timeout ou threshold foi reduzido. A suíte global completa não é chamada de verde. Todos os 96 digests finais de GitHub Copilot foram reconferidos contra a execução aprovada.

## Alcance operacional pendente

Não foram executados conta/provider/modelos Copilot, extensão/IDE/app/web, sugestões inline/next edit, referências públicas nativas, Chat e recuperação de contexto reais, carregamento de instruções/applyTo/prompts/skills, agente cloud/setup/Actions/branch/PR/review e política de merge reais, CLI e permissões efetivas, agente personalizado, hooks instalados, MCP/protocolo/credenciais, firewall/sandbox, cancelamento/replay remoto, privacidade/retention/custo/acessibilidade, backend durável concorrente, Lab real, publicação ou rollback operacional. Consulta read-only de `copilot` no PATH não encontrou comando; isso não inspeciona todas as possíveis instalações do computador. Nenhuma infraestrutura foi instalada para simular essas provas.

Gate WSL é independente conforme autorização e histórico: ubuntuLinux.examples.test.ts é excluído explicitamente na invocação local final; seus 96 casos não são aprovações nem novos skips. Não houve reinício de distribuição ou alteração dos testes. A suíte global completa não é chamada de verde.

## Fontes primárias consultadas em 2026-10-05

- [Copilot no IDE](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides): experiências e referências públicas.
- [Prompt engineering](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering): exemplos, contexto e histórico.
- [Customização e prompts](https://docs.github.com/en/copilot/concepts/prompting/response-customization).
- [Instruções de repositório](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions).
- [Matriz de instruções](https://docs.github.com/en/copilot/reference/custom-instructions-support).
- [Agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills).
- [MCP no repositório](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers) e [MCP no IDE](https://docs.github.com/en/copilot/tutorials/enhance-agent-mode-with-mcp).
- [Agente cloud](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent), [setup](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment) e [riscos/mitigações](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations).
- [Firewall](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall): alcance e exceções, inclusive processos MCP e setup.
- [Code review](https://docs.github.com/en/copilot/concepts/agents/code-review): recursos e approvals dependentes de configuração.
- [CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli).
- [Custom agents](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents).
- [Hooks](https://docs.github.com/en/copilot/concepts/agents/hooks) e [referência de hooks](https://docs.github.com/en/copilot/reference/hooks-reference).
- [Exclusão de conteúdo](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion): limites por modo e fontes indiretas.

## Reprodução

```powershell
$env:CHIRON_WRITE_GITHUB_COPILOT_EVIDENCE='1'
pnpm exec vitest run src/lib/study/seeds/content/githubCopilot.test.ts src/lib/study/seeds/content/githubCopilot.examples.test.ts --maxWorkers=1 --reporter=dot
pnpm typecheck
pnpm build
pnpm exec vitest run --maxWorkers=1 --reporter=dot --exclude src/lib/study/seeds/content/ubuntuLinux.examples.test.ts
```

Evidências: scripts/githubCopilot-evidence.json, scripts/githubCopilot-editorial-evidence.json e logs copilot-focused-run, copilot-typecheck-run, copilot-build-run, copilot-local-suite-run. Registros de autoria permitem revisar previsões e variantes; scripts/create-copilot-builder.mjs e build-copilot-content.mjs apenas materializam o corpus completo. PLANO.md/HANDOFF.md são atualizados somente quando todos os gates aplicáveis concluem.
