# Integração de IA LLM — verificação do corpus local

Fonte integral 12/48/96/36/48, integrada após Pacote Office somente depois de concluir o corpus e passar seus contratos. Revisão em 2026-10-03. São 30.796 palavras de prosa, mínimo 605, piso preservado de 600. Abrange tarefa, prompt, transporte, RAG, estado, ferramentas, workflows, multimodal, segurança, avaliação, operação e projeto Quíron.

## Método e limites

96 snippets JavaScript autônomos: 68 local-rule, 16 local-transform e 12 model. Cada seção contém fixture com resultado independente e contraprova que deve ser detectada por assertion. Ambiente Node v24.13.0, Windows x64; contexto VM novo por snippet confiável, require limitado a assert/crypto, timeout vigente de 2 s. VM não é sandbox adversarial. Nenhum SDK, modelo, provedor, helper falso de API ou infraestrutura foi instalado para produzir aprovação.

Arrays, matemática, Buffer/UTF-8, URL, serialização e políticas declaradas são mecanismos locais reais. Vetores são arrays escolhidos manualmente: o cosseno é real, mas nenhum embedding foi gerado. Unidades e tarifas de custo são parâmetros fictícios, sem tokenização ou cobrança medidas. Bytes demonstram fronteira UTF-8 restrita, não parser SSE completo. Assinatura de arquivo é checagem parcial, sem decoder ou sanitizador universal. Checks de schema/PII/ACL são domínios explícitos de fixtures, sem interpretação universal. Replay, revisão, workflow e ledger são modelos seriais em memória.

Não houve chamada de provider, geração de resposta, treinamento, benchmark remoto, pedido HTTP, stream real, cancelamento remoto, rate limit, UI de aprovação, sessão do tutor, escrita durável, concorrência, restore, estudo humano, deploy ou rollback. Toda afirmação sobre essas superfícies permanece Pending e exige ensaio próprio autorizado. O Lab Ágora liga o currículo ao cenário de última vaga sem atestar execução automática do laboratório.

## Evidência e reprodução

- `scripts/llm-evidence.json`: ID, SHA-256 do texto final, escopo, resultado, duração, ambiente e gates pendentes.
- `scripts/llm-editorial-evidence.json`: contagens, palavras por seção, métricas e violações.
- `scripts/llm-build-run.log` e `scripts/llm-local-suite-run.log`: logs dos gates aplicáveis finais.

```powershell
$env:CHIRON_WRITE_LLM_EVIDENCE='1'
pnpm exec vitest run src/lib/study/seeds/content/llm.test.ts src/lib/study/seeds/content/llm.examples.test.ts --maxWorkers=1 --reporter=dot
pnpm run typecheck
pnpm run build
pnpm exec vitest run --maxWorkers=1 --reporter=dot --exclude src/lib/study/seeds/content/ubuntuLinux.examples.test.ts
```

Corpus/contratos 98/98. Similaridade máxima de seções 31,114809% (<42%), cards 6,666667% (<78%), exercícios detalhados 100% (≥65%), código duplicado zero. Nenhum threshold alterado. A primeira montagem da prosa tinha seções abaixo do piso; explicações próprias das fixtures e contraprovas completaram o ensino dos mecanismos antes da integração. Digest de todos os 96 códigos finais reconferido.

Typecheck aprovado. Build/PWA aprovado: principal 6.085,41 kB, book-llm 302,67 kB, book-office 322,64 kB, precache 35 entradas/74.026,11 KiB. Os chunks constam no precache; teto de 6 MiB por arquivo permanece. Warnings conhecidos de chunks grandes e import estático/dinâmico Supabase continuam explícitos.

Regressão local final aprovada: 98 arquivos/1157 testes passed, 5 arquivos/19 testes skipped preexistentes, 223.17 s, maxWorkers=1. Exclusão explícita somente de ubuntuLinux.examples.test.ts: seus 96 casos WSL não foram executados, não são contabilizados como aprovados ou novos skips. A suíte global completa permanece com falha independente de WSL, não é chamada de verde. Office/LLM e demais casos Windows foram exercitados sem mudar timeouts, assertions ou thresholds.

## WSL e regressão por escopo

A suíte global completa de Office falhou no beforeAll Ubuntu/Linux: chamada WSL excedeu 100 s e seus 96 testes não executaram. `wsl --list --verbose` também não respondeu. A tentativa local com dois workers teve timeout de 2 s no primeiro snippet N8N; um worker aprovou a regressão Office, mantendo timeout. Nenhuma distribuição foi reiniciada e nenhuma tarefa alheia foi encerrada.

A instrução posterior autorizou usar executores locais e separar gates independentes. A regressão final exclui explicitamente somente o arquivo do executor WSL, sem editar ou marcar seus testes como skipped, sem alterar assertions ou timeout e sem afirmar aprovação da suíte global completa. Windows/Node não é substituído por Ubuntu nos claims históricos. Office e LLM têm seus 96 exemplos locais efetivamente exercitados; o gate de executor Ubuntu permanece indisponível até superfície real pertinente voltar a existir.

## Gates que exigem superfície real

| Superfície | Estado e método necessário |
|---|---|
| Modelo/provider/SDK/tokenizer | Pending: requests e respostas reais em conta autorizada, configuração e uso identificados |
| Embeddings, retrieval e RAG | Pending: documentos e índice reais, queries representativas, relevância e suporte avaliados |
| Transporte | Pending: stream, timeout, cancelamento e limitação reais observados |
| Ferramentas e autorização | Pending: ações permitidas/negadas e recursos reais com identidade e pré-condições |
| Aprovação e UI | Pending: decisão enviada, versão e efeito real; teclado e tecnologia assistiva pertinentes |
| Persistência e concorrência | Pending: ledger durável, disputa, replay, falha e restore no laboratório real |
| Qualidade e pesquisa | Pending: respostas reais, rubrica, dataset reservado e observações humanas pertinentes |
| Operação | Pending: traces, cobrança/uso, release, rollback e monitoramento reais |

## Referências primárias

OpenAI Docs consultada em 2026-10-01/03 para pontos de API. Formatos, modelos, limites e acesso devem ser confirmados no endpoint/conta alvo. O currículo não fixa catálogo, preços ou cotas universais e não implementa API remota em fixtures.

- [Function calling](https://developers.openai.com/api/docs/guides/function-calling): intenção de chamada, aplicação e resultado são etapas diferentes; a aplicação executa seu código.
- [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs): estrutura, recusa e incompletude precisam caminhos próprios; validade de domínio continua responsabilidade do consumidor.
- [Streaming](https://developers.openai.com/api/docs/guides/streaming-responses): transporte incremental e eventos exigem framing, sem confundir delta com conclusão.
- [Retrieval](https://developers.openai.com/api/docs/guides/retrieval): fonte para conferir capacidades nativas quando houver integração real; a fixture de vetores não as exercita.
- [Rate limits](https://developers.openai.com/api/docs/guides/rate-limits): verificar limites e política pertinentes à conta, sem cota universal inventada.
- [Safety best practices](https://developers.openai.com/api/docs/guides/safety-best-practices): referência de avaliação e controles de integração, sem tratar prompt como autoridade de efeito.
- [Evaluation](https://developers.openai.com/api/docs/guides/evals): documentação de avaliação; exemplos aqui são harness local, sem binding ou chamada à plataforma Evals.

Tentativas de abrir versões `.md` retornaram content-type não suportado pela ferramenta web; páginas HTML e trechos relevantes foram consultados. Tentativa falha não é evidência de capacidade. As conclusões sobre arquitetura e testes locais são explicações do contrato autoral, sem afirmar que um provider as executou.
