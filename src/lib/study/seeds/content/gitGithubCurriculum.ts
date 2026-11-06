export type GitGithubLevel = "basico" | "intermediario" | "avancado";
export type GitGithubLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type GitGithubChapter = readonly [title: string, level: GitGithubLevel, primer: string, lessons: readonly GitGithubLesson[]];

/** Baseline editorial: Git CLI e GitHub/gh atuais; versão, host e APIs serão fixados pelos gates. */
export const GIT_GITHUB_CURRICULUM: readonly GitGithubChapter[] = [
  ["Modelo de dados Git", "basico", "Git é um grafo de objetos e referências; comandos só ficam previsíveis quando o modelo é explícito.", [
    ["Objetos, hashes e content addressing", "blob, tree, commit e tag são objetos imutáveis identificados pelo conteúdo", "git hash-object, cat-file, object format, SHA-1/SHA-256 e fsck", "arquivo foi confundido com commit e corrupção passou despercebida"],
    ["Refs, HEAD e symbolic refs", "branches/tags são nomes mutáveis para objetos e HEAD define o contexto atual", "refs/heads, refs/tags, HEAD, rev-parse, show-ref e reflog", "script assumiu branch e moveu detached HEAD"],
    ["Index, working tree e repository", "working tree, index e HEAD são estados distintos que explicam add/commit/restore", "git status, diff, diff --cached, ls-files e update-index", "arquivo parcial foi incluído porque staged e unstaged foram confundidos"],
    ["Configuração, identidade e atributos", "config em escopos e atributos por path afetam autoria, merge, diff e segurança", "git config --show-origin, user identity, core settings, .gitattributes e .gitignore", "config global/filtro alterou conteúdo sem revisão"],
  ]],
  ["Mudanças e histórico", "basico", "Commits pequenos documentam decisões e o undo correto depende de publicação e alcance.", [
    ["Add seletivo e commits atômicos", "cada commit compila uma decisão coerente sem segredo ou ruído incidental", "git add -p, diff --check, commit, hooks e trailers", "commit misturou refactor, segredo e correção impossível de revisar"],
    ["Leitura do histórico e revisions", "revision syntax e filtros respondem ancestry, conteúdo e autoria sem inferir por UI", "git log, show, range, merge-base, blame, bisect e pickaxe", "range invertido omitiu commits críticos da auditoria"],
    ["Restore, reset, revert e reflog", "desfazer preserva trabalho e histórico conforme o estado foi ou não publicado", "restore, reset modes, revert, reflog e ORIG_HEAD", "reset hard apagou mudanças locais e reescreveu branch compartilhada"],
    ["Stash, worktree e trabalho paralelo", "estado temporário tem ownership e branch/worktree evitam mistura entre tarefas", "stash, worktree, clean dry-run e sparse checkout", "stash esquecido continha segredo e worktree compartilhou branch indevidamente"],
  ]],
  ["Branches, merge e rebase", "basico", "Integração é transformação verificável do grafo, não ritual de botões.", [
    ["Branches curtas e upstream", "branch aponta commit e seu upstream define comparação/push, não autoridade implícita", "branch, switch, upstream, ahead/behind e fork point", "push atualizou branch remota errada por upstream ambíguo"],
    ["Merge e estratégias", "merge combina histories a partir do merge-base e exige testar o resultado integrado", "fast-forward, three-way, ort, no-ff, squash e merge-tree", "branches verdes isoladas produziram merge quebrado"],
    ["Rebase e história publicada", "rebase recria commits e muda identidades, adequado antes de publicação ou com coordenação", "rebase interactive, autosquash, rebase-merges, abort/continue e force-with-lease", "force push sobrescreveu commit remoto não visto"],
    ["Conflitos e rerere", "resolver conflito é escolher semântica e validar base/result, não remover marcadores", "stages 1/2/3, checkout --ours/--theirs, mergetool, rerere e conflictStyle", "resolução compilou mas removeu invariante do outro lado"],
  ]],
  ["Remotes e distribuição", "intermediario", "Fetch, push e tags movem refs entre domínios com políticas e autenticação explícitas.", [
    ["Remotes, refspecs e fetch", "fetch atualiza remote-tracking refs segundo refspec sem alterar branch local", "remote, fetch, refspec, prune, FETCH_HEAD e protocol v2", "fetch amplo trouxe refs hostis e branch local foi confundida com origin"],
    ["Push seguro e concorrência", "push é compare-and-set de refs e reescrita usa lease verificável", "push refspec, force-with-lease, atomic, follow-tags e receive policy", "force-with-lease stale sobrescreveu trabalho após fetch incorreto"],
    ["Tags, versões e assinaturas", "release tag identifica commit imutável e assinatura atesta identidade, não qualidade", "annotated/lightweight tags, verify-tag, signing, semver e retag policy", "tag publicada foi movida e artifacts divergiram"],
    ["Protocolos, credenciais e clones", "HTTPS/SSH tokens e clone depth/filter seguem least privilege e reproducibility", "credential helpers, SSH host keys, PAT scopes, shallow/partial clone e alternates", "token apareceu em URL/log e shallow history invalidou versionamento"],
  ]],
  ["GitHub: colaboração e revisão", "intermediario", "Issues e pull requests são processos auditáveis ligados a commits e políticas do repositório.", [
    ["Repositórios, forks e permissões", "owner, visibility, default branch, teams e fork model definem boundary de colaboração", "GitHub repositories, roles, teams, rulesets, forks e CODEOWNERS", "fork público recebeu segredo e permissão write foi concedida em excesso"],
    ["Issues, templates e triagem", "issue captura problema, evidence, scope e decisão sem virar backlog sem owner", "issue forms, labels, milestones, assignees, projects e saved searches", "template coletou segredo e label substituiu reprodução"],
    ["Pull requests e diffs", "PR compara bases/head exatos, explica risco e mantém commits/checks revisáveis", "gh pr, compare, draft, reviewable diff, merge queue e auto-merge", "PR mostrou diff incompleto após base mudar e foi aprovado"],
    ["Reviews, CODEOWNERS e proteção", "review independente e rulesets exigem evidência atual sobre commit atual", "requested reviewers, dismiss stale approvals, branch protection, required checks e conversations", "novo push preservou aprovação antiga e bypassou owner crítico"],
  ]],
  ["GitHub Actions e CI", "intermediario", "Workflow é código privilegiado acionado por eventos não confiáveis e deve produzir evidência reproducível.", [
    ["Workflows, eventos e contexts", "trigger, permissions e dados do evento definem trust boundary antes de qualquer step", "workflow YAML, on, jobs, needs, if, contexts e expressions", "pull_request_target executou checkout hostil com secrets"],
    ["Runners, matrices e caches", "runner, matrix e cache key preservam isolamento, determinismo e recursos", "hosted/self-hosted runners, strategy matrix, concurrency, cache e artifacts", "runner persistente vazou credencial entre jobs"],
    ["Secrets, OIDC e environments", "credenciais são curtas, escopadas e liberadas somente após policy/environment", "GITHUB_TOKEN permissions, secrets, environments, OIDC e approvals", "token cloud longo ficou acessível a fork e logs"],
    ["Checks, artifacts e provenance", "status obrigatório precisa testar o commit integrado e artifact precisa digest/provenance", "checks API, test reports, artifacts, attestations, dependency review e merge queue", "check verde referia outro SHA e artifact foi reconstruído no deploy"],
  ]],
  ["Releases, packages e automação", "intermediario", "Release transforma tag verificada em artifacts, notas e packages imutáveis com rollback claro.", [
    ["Release notes e changelog", "notas derivam range correto e comunicam mudanças, riscos, migrações e rollback", "GitHub Releases, generated notes, changelog, conventional commits e comparison ranges", "range errado omitiu breaking change da release"],
    ["Artifacts e checksums", "artifact publicado liga source/tag/toolchain e possui checksum/assinatura/SBOM", "release assets, checksums, cosign/attestation e retention", "asset foi substituído sob a mesma versão"],
    ["GitHub Packages e registries", "package identity/version/scopes e immutability evitam confusion e overwrite", "npm/container packages, package permissions, provenance e cleanup", "package público homônimo venceu registry privado"],
    ["APIs, gh e idempotência", "automação usa API/gh com paginação, retries, idempotência e dry-run", "REST/GraphQL, gh api, jq, rate limits, conditional requests e audit log", "script parcial repetido criou releases e comentários duplicados"],
  ]],
  ["Segurança de código e repositório", "avancado", "Histórico, CI e colaboração precisam least privilege, integrity e resposta a segredo comprometido.", [
    ["Secret scanning e remoção", "segredo versionado é revogado primeiro; reescrever histórico não desfaz exposição", "secret scanning, push protection, git-filter-repo, rotation e cache/forks", "chave foi removida do HEAD mas permaneceu válida no histórico"],
    ["Assinaturas e identidade", "assinatura verificada associa objeto a identidade/chave no tempo, não valida conteúdo", "GPG/SSH signing, vigilant mode, key rotation e verified commits/tags", "badge Verified foi tratado como revisão e autorização"],
    ["Rulesets, tokens e audit", "políticas protegem refs e tokens/apps têm menor escopo, duração e trilha", "rulesets, bypass, fine-grained PAT, GitHub Apps, deploy keys e audit log", "admin bypass permanente tornou checks opcionais"],
    ["Dependências e code scanning", "findings são triados com alcance, exploitability, owner e prazo, não contados como qualidade", "Dependabot, dependency review, CodeQL, SARIF, licenses e security advisories", "scanner verde não detectou regra de autorização removida"],
  ]],
  ["Git avançado e escala", "avancado", "Repositórios grandes exigem formatos, filtros e manutenção que preservem correção e portabilidade.", [
    ["Internals, packfiles e manutenção", "refs/objects/packs/commit-graph aceleram sem mudar o grafo lógico e corrupção é detectável", "pack-objects, gc, maintenance, commit-graph, multi-pack-index e fsck", "cleanup removeu objeto ainda necessário por ref oculta"],
    ["Monorepos e sparse/partial clone", "paths/ownership/build graph e clone filters reduzem custo sem ocultar dependências", "sparse-checkout, partial clone, promisor remotes, path filters e CODEOWNERS", "workflow path-filter pulou teste afetado por dependência indireta"],
    ["Submodules, subtree e vendoring", "dependência de repositório fixa commit e update/recovery são explícitos", "submodule gitlink, recursive clone, subtree, vendoring e provenance", "submodule apontou commit inacessível e build não reproduziu"],
    ["LFS, binários e políticas de tamanho", "binários usam storage/locking/retention adequados e pointers permanecem íntegros", "Git LFS, attributes, locks, quotas, release assets e migration", "pointer LFS foi publicado sem objeto e clone ficou incompleto"],
  ]],
  ["Operação, diagnóstico e recuperação", "avancado", "Diagnóstico preserva evidência do grafo e recovery evita ampliar perda ou reescrever refs erradas.", [
    ["Bisect, blame e regressões", "busca de regressão usa oráculo determinístico e considera merges/build environment", "git bisect run, blame -w/-M/-C, log -S/-G e first-parent", "teste flaky acusou commit inocente no bisect"],
    ["Reflog, fsck e objetos perdidos", "reflog/ORIG_HEAD/fsck recuperam objetos enquanto retenção permite, após snapshot", "reflog expire, fsck --lost-found, dangling commits e bundles", "gc executou antes da recuperação e objeto ficou inalcançável"],
    ["Backups, bundles e disaster recovery", "clone remoto não é backup completo de refs/config/LFS/issues e restore precisa drill", "git bundle, mirror, refs, LFS/packages, GitHub export/API e RPO/RTO", "restore trouxe branches mas perdeu LFS, releases e protections"],
    ["Incidentes e cadeia de custódia", "contenção preserva logs/refs/artifacts, revoga acesso e registra timeline reproduzível", "audit logs, branch locks, token revocation, evidence hashes e postmortem", "force push corretivo destruiu evidência antes da análise"],
  ]],
  ["Governança e fluxo produtivo", "avancado", "Políticas devem tornar o caminho seguro fácil, mensurável e recuperável sem burocracia cega.", [
    ["Trunk, GitFlow e estratégia de branches", "estratégia deriva de cadência, release e risco e define integração/retorno", "trunk-based, release branches, GitFlow, feature flags e merge queue", "branches longas acumularam conflitos e fixes divergentes"],
    ["Commits, PRs e definição de pronto", "tamanho, mensagem, evidence e ownership permitem revisão e rollback confiáveis", "commit conventions, PR templates, CODEOWNERS, checklists e ADR links", "checklist marcada substituiu teste e diff compreendido"],
    ["Merge queue, bots e políticas", "automação opera sobre SHA atual com permissions/idempotência e não concede bypass silencioso", "merge groups, rulesets, GitHub Apps, stale/dependency bots e concurrency", "bot aprovou/mergeou SHA diferente do revisado"],
    ["Métricas, auditoria e melhoria", "lead time/failure/review metrics orientam sistema sem virar meta manipulável ou vigilância", "DORA-like metrics, review latency, change failure, audit sampling e postmortems", "meta de commits incentivou fragmentação e ocultou retrabalho"],
  ]],
  ["Projeto Quíron com GitHub", "avancado", "A banca integra grafo, PR, CI, segurança, release e recuperação no repositório Quíron.", [
    ["Repository baseline do Quíron", "repo reproduz build/test e possui ownership/config/docs sem segredo ou estado local oculto", "init/config/attributes/ignore, branches, CODEOWNERS, templates e bootstrap", "clone limpo não reproduziu porque arquivo ignorado era obrigatório"],
    ["PR da última vaga", "mudança concorrente chega em commits atômicos, PR revisável e checks que provam estado/efeito", "branch, commits, merge-base, PR, matrix, mutation e database/provider gates", "PR verde mockou concorrência e merge removeu constraint"],
    ["Release segura e rastreável", "tag assinada promove artifact atestado do SHA aprovado sem rebuild", "merge queue, tag/release, SBOM/provenance, packages e deployment environment", "release asset veio de SHA/build diferente do PR"],
    ["Banca, incidente e restore Git", "force-push/secret/runner/artifact/backup incidents preservam evidência e recuperam todos os ativos", "audit, reflog/bundle, token rotation, rollback, restore drill e evidence matrix", "branch voltou, mas protections/LFS/issues/effect evidence se perderam"],
  ]],
];
