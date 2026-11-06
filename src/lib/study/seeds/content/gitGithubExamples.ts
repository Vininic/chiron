export type GitGithubExample = { lang: "bash"; code: string; purpose: string };
export const GIT_GITHUB_EXAMPLES: Record<string, [GitGithubExample, GitGithubExample]> = {
  "Objetos, hashes e content addressing": [
    { lang: "bash", purpose: "Cria blob, tree e commit reais e valida tipos e relações no object database.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q "$repo"
git -C "$repo" config user.name "Chiron Test"
git -C "$repo" config user.email "chiron@example.invalid"
printf 'conteudo\n' >"$repo/nota.txt"
blob="$(git -C "$repo" hash-object -w -- nota.txt)"
git -C "$repo" add -- nota.txt
tree="$(git -C "$repo" write-tree)"
commit="$(printf 'snapshot\n' | git -C "$repo" commit-tree "$tree")"
test "$(git -C "$repo" cat-file -t "$blob")" = blob
test "$(git -C "$repo" cat-file -t "$tree")" = tree
test "$(git -C "$repo" cat-file -t "$commit")" = commit
git -C "$repo" fsck --no-dangling --strict` },
    { lang: "bash", purpose: "Demonstra content addressing sem assumir comprimento SHA-1 e detecta mudança de um byte.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q "$repo"
format="$(git -C "$repo" rev-parse --show-object-format)"
printf 'alpha\n' >"$repo/value.txt"
first="$(git -C "$repo" hash-object -- value.txt)"
cp "$repo/value.txt" "$repo/copy.txt"
same="$(git -C "$repo" hash-object -- copy.txt)"
printf 'alpha!\n' >"$repo/value.txt"
changed="$(git -C "$repo" hash-object -- value.txt)"
test "$first" = "$same"
test "$first" != "$changed"
test -n "$format" && test "\${#first}" -ge 40` },
  ],
  "Refs, HEAD e symbolic refs": [
    { lang: "bash", purpose: "Distingue HEAD anexado e destacado e preserva commit destacado criando branch explícita.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"
git -C "$repo" config user.name "Chiron Test"; git -C "$repo" config user.email "chiron@example.invalid"
printf 'base\n' >"$repo/file"; git -C "$repo" add file; git -C "$repo" commit -qm base
test "$(git -C "$repo" symbolic-ref --short HEAD)" = main
git -C "$repo" switch -q --detach HEAD
if git -C "$repo" symbolic-ref -q HEAD; then exit 1; fi
printf 'detached\n' >>"$repo/file"; git -C "$repo" commit -qam detached
detached="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" switch -qc recovery
test "$(git -C "$repo" rev-parse refs/heads/recovery)" = "$detached"` },
    { lang: "bash", purpose: "update-ref com old value implementa compare-and-set e rejeita escritor stale.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"
git -C "$repo" config user.name "Chiron Test"; git -C "$repo" config user.email "chiron@example.invalid"
printf 'one\n' >"$repo/file"; git -C "$repo" add file; git -C "$repo" commit -qm one
old="$(git -C "$repo" rev-parse HEAD)"
printf 'two\n' >>"$repo/file"; git -C "$repo" commit -qam two
new="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" update-ref refs/heads/release "$new"
if git -C "$repo" update-ref refs/heads/release "$old" "$old" 2>/dev/null; then exit 1; fi
test "$(git -C "$repo" rev-parse refs/heads/release)" = "$new"` },
  ],
  "Index, working tree e repository": [
    { lang: "bash", purpose: "Compara HEAD, index e working tree e confirma que commit usa somente o conteúdo staged.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"
git -C "$repo" config user.name "Chiron Test"; git -C "$repo" config user.email "chiron@example.invalid"
printf 'v1\n' >"$repo/app.txt"; git -C "$repo" add app.txt; git -C "$repo" commit -qm v1
printf 'v2 staged\n' >"$repo/app.txt"; git -C "$repo" add app.txt
printf 'v3 working\n' >"$repo/app.txt"
test "$(git -C "$repo" show :app.txt)" = "v2 staged"
test "$(cat "$repo/app.txt")" = "v3 working"
git -C "$repo" commit -qm v2
test "$(git -C "$repo" show HEAD:app.txt)" = "v2 staged"
git -C "$repo" diff --quiet -- app.txt && exit 1 || test "$?" -eq 1` },
    { lang: "bash", purpose: "Inspeciona stages 1/2/3 de conflito antes de gravar a resolução no stage zero.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"
git -C "$repo" config user.name "Chiron Test"; git -C "$repo" config user.email "chiron@example.invalid"
printf 'base\n' >"$repo/value"; git -C "$repo" add value; git -C "$repo" commit -qm base
git -C "$repo" switch -qc topic; printf 'topic\n' >"$repo/value"; git -C "$repo" commit -qam topic
git -C "$repo" switch -q main; printf 'main\n' >"$repo/value"; git -C "$repo" commit -qam main
git -C "$repo" merge topic >/dev/null 2>&1 && exit 1 || true
test "$(git -C "$repo" ls-files -u | wc -l | tr -d ' ')" -eq 3
printf 'resolved\n' >"$repo/value"; git -C "$repo" add value
test -z "$(git -C "$repo" ls-files -u)"
test "$(git -C "$repo" show :value)" = resolved` },
  ],
  "Configuração, identidade e atributos": [
    { lang: "bash", purpose: "Config isolada prova origem local de identidade e evita dependência da máquina do autor.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
export HOME="$root/home"; mkdir -p "$HOME"
repo="$root/repo"; git init -q "$repo"
git -C "$repo" config --local user.name "Chiron Bot"
git -C "$repo" config --local user.email "bot@example.invalid"
name="$(git -C "$repo" config --local --get user.name)"
email="$(git -C "$repo" config --local --get user.email)"
test "$name" = "Chiron Bot" && test "$email" = "bot@example.invalid"
git -C "$repo" config --show-origin --show-scope --get user.email | grep -F 'bot@example.invalid' >/dev/null` },
    { lang: "bash", purpose: "Attributes normalizam texto, marcam binário e ignore é diagnosticado pela origem real.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q "$repo"
printf '* text=auto eol=lf\n*.bin -text\n' >"$repo/.gitattributes"
printf '.env\nbuild/\n' >"$repo/.gitignore"
printf 'a\r\nb\r\n' >"$repo/readme.txt"; printf 'binary-data' >"$repo/data.bin"; printf 'SECRET=fake\n' >"$repo/.env"
git -C "$repo" add .gitattributes .gitignore readme.txt data.bin
git -C "$repo" check-attr text eol -- readme.txt | grep -F 'eol: lf' >/dev/null
git -C "$repo" check-attr text -- data.bin | grep -F 'text: unset' >/dev/null
git -C "$repo" check-ignore -q -- .env
test "$(git -C "$repo" show :readme.txt | tr -d '\r')" = $'a\nb'` },
  ],
  "Add seletivo e commits atômicos": [
    { lang: "bash", purpose: "Cria commit somente com a decisão staged e prova que ruído incidental ficou fora da tree.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"
git -C "$repo" config user.name "Chiron Test"; git -C "$repo" config user.email "chiron@example.invalid"
printf 'old\n' >"$repo/app.txt"; printf 'keep\n' >"$repo/notes.txt"
git -C "$repo" add app.txt notes.txt; git -C "$repo" commit -qm baseline
printf 'fixed\n' >"$repo/app.txt"; printf 'incidental\n' >"$repo/notes.txt"
git -C "$repo" add -- app.txt
git -C "$repo" diff --cached --check
git -C "$repo" commit -qm 'Fix reservation decision'
test "$(git -C "$repo" show HEAD:app.txt)" = fixed
test "$(git -C "$repo" show HEAD:notes.txt)" = keep
test "$(cat "$repo/notes.txt")" = incidental` },
    { lang: "bash", purpose: "Materializa o index em tree, verifica paths exatos e preserva mudança unstaged após o commit.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"
git -C "$repo" config user.name "Chiron Test"; git -C "$repo" config user.email "chiron@example.invalid"
printf 'v1\n' >"$repo/service"; printf 'test-v1\n' >"$repo/spec"
git -C "$repo" add service spec; git -C "$repo" commit -qm baseline
printf 'v2\n' >"$repo/service"; printf 'test-v2\n' >"$repo/spec"; printf 'draft\n' >"$repo/design"
git -C "$repo" add -- service spec
tree="$(git -C "$repo" write-tree)"
test "$(git -C "$repo" ls-tree -r --name-only "$tree" | tr '\n' ' ')" = 'service spec '
git -C "$repo" commit -qm 'Change service with its test'
test -f "$repo/design"
git -C "$repo" ls-files --error-unmatch design >/dev/null 2>&1 && exit 1 || true` },
  ],
  "Leitura do histórico e revisions": [
    { lang: "bash", purpose: "Compara ranges de dois e três pontos e valida ancestry em um grafo divergente.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'base\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" commit -qm base
base="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" switch -qc topic; printf 'topic\n' >"$repo/topic"; git -C "$repo" add topic; git -C "$repo" commit -qm topic
topic="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" switch -q main; printf 'main\n' >"$repo/main"; git -C "$repo" add main; git -C "$repo" commit -qm main
test "$(git -C "$repo" rev-list --count main..topic)" -eq 1
test "$(git -C "$repo" rev-list --count main...topic)" -eq 2
test "$(git -C "$repo" merge-base main topic)" = "$base"
git -C "$repo" merge-base --is-ancestor "$base" "$topic"` },
    { lang: "bash", purpose: "Usa pickaxe e formatos explícitos para localizar a introdução de um valor sem parsear log humano.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'limit=1\n' >"$repo/config"; git -C "$repo" add config; git -C "$repo" commit -qm baseline
printf 'limit=2\nfeature=reserve\n' >"$repo/config"; git -C "$repo" commit -qam 'Enable reserve'
introduced="$(git -C "$repo" log -Sfeature=reserve --format=%H -- config)"
test -n "$introduced"
test "$(git -C "$repo" show -s --format=%s "$introduced")" = 'Enable reserve'
test "$(git -C "$repo" show "$introduced":config | tail -n 1)" = 'feature=reserve'
git -C "$repo" rev-parse --verify --end-of-options "$introduced^{commit}" >/dev/null` },
  ],
  "Restore, reset, revert e reflog": [
    { lang: "bash", purpose: "Distingue restore do index e do working tree e preserva edição local deliberadamente.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'v1\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" commit -qm v1
printf 'v2 staged\n' >"$repo/f"; git -C "$repo" add f; printf 'v3 working\n' >"$repo/f"
git -C "$repo" restore --staged -- f
test "$(git -C "$repo" show :f)" = v1
test "$(cat "$repo/f")" = 'v3 working'
git -C "$repo" restore --source=HEAD --worktree -- f
test "$(cat "$repo/f")" = v1
test -z "$(git -C "$repo" status --porcelain)"` },
    { lang: "bash", purpose: "Reverte uma mudança publicada e recupera pelo reflog uma ponta movida por reset em clone temporário.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'safe\n' >"$repo/state"; git -C "$repo" add state; git -C "$repo" commit -qm safe
printf 'bad\n' >"$repo/state"; git -C "$repo" commit -qam bad; bad="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" revert --no-edit "$bad" >/dev/null
test "$(cat "$repo/state")" = safe
tip="$(git -C "$repo" rev-parse HEAD)"; git -C "$repo" reset --hard -q HEAD~1
recovered="$(git -C "$repo" reflog --format=%H -n 1 HEAD@{1})"
test "$recovered" = "$tip"
git -C "$repo" branch recovered "$recovered"
test "$(git -C "$repo" rev-parse recovered)" = "$tip"` },
  ],
  "Stash, worktree e trabalho paralelo": [
    { lang: "bash", purpose: "Guarda estados staged, unstaged e untracked, aplica por object ID e só então remove a entrada.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'base\n' >"$repo/a"; printf 'base\n' >"$repo/b"; git -C "$repo" add a b; git -C "$repo" commit -qm base
printf 'staged\n' >"$repo/a"; git -C "$repo" add a; printf 'working\n' >"$repo/b"; printf 'new\n' >"$repo/c"
git -C "$repo" stash push -u -m 'task reservation' >/dev/null
stash_id="$(git -C "$repo" rev-parse refs/stash)"
git -C "$repo" stash apply --index "$stash_id" >/dev/null
test "$(git -C "$repo" show :a)" = staged
test "$(cat "$repo/b")" = working; test "$(cat "$repo/c")" = new
git -C "$repo" reset --hard -q; git -C "$repo" clean -fdq
git -C "$repo" stash drop 'stash@{0}' >/dev/null
test -z "$(git -C "$repo" stash list)"` },
    { lang: "bash", purpose: "Cria duas worktrees com branches distintas e comprova HEADs isolados no mesmo object database.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
repo="$root/repo"; git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'base\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" commit -qm base
git -C "$repo" worktree add -qb feature "$root/feature" main
git -C "$repo" worktree add -qb hotfix "$root/hotfix" main
printf 'feature\n' >"$root/feature/feature"; git -C "$root/feature" add feature; git -C "$root/feature" commit -qm feature
printf 'hotfix\n' >"$root/hotfix/hotfix"; git -C "$root/hotfix" add hotfix; git -C "$root/hotfix" commit -qm hotfix
test "$(git -C "$root/feature" branch --show-current)" = feature
test "$(git -C "$root/hotfix" branch --show-current)" = hotfix
test "$(git -C "$repo" rev-list --count main..feature)" -eq 1
test "$(git -C "$repo" rev-list --count main..hotfix)" -eq 1` },
  ],
  "Branches curtas e upstream": [
    { lang: "bash", purpose: "Configura upstream explícito e mede ahead/behind depois de fetch contra remote bare local.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
git init -q --bare "$root/up.git"; git clone -q "$root/up.git" "$root/a"
git -C "$root/a" config user.name Test; git -C "$root/a" config user.email test@example.invalid
git -C "$root/a" switch -qc main; printf 'base\n' >"$root/a/f"; git -C "$root/a" add f; git -C "$root/a" commit -qm base; git -C "$root/a" push -qu origin main
git -C "$root/a" switch -qc feature; git -C "$root/a" push -qu origin feature
test "$(git -C "$root/a" rev-parse --abbrev-ref '@{upstream}')" = origin/feature
printf 'local\n' >"$root/a/local"; git -C "$root/a" add local; git -C "$root/a" commit -qm local
test "$(git -C "$root/a" rev-list --left-right --count '@{upstream}...HEAD' | tr '\t' ' ')" = '0 1'` },
    { lang: "bash", purpose: "Prova que HEAD destacado não fornece branch atual e exige branch explícita para preservar trabalho.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'base\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" commit -qm base
git -C "$repo" switch -q --detach HEAD; test -z "$(git -C "$repo" branch --show-current)"
printf 'work\n' >>"$repo/f"; git -C "$repo" commit -qam work; tip="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" branch task "$tip"; git -C "$repo" switch -q task
test "$(git -C "$repo" branch --show-current)" = task` },
  ],
  "Merge e estratégias": [
    { lang: "bash", purpose: "Distingue fast-forward de merge com dois pais e valida a tree integrada.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'base\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" commit -qm base
git -C "$repo" switch -qc topic; printf 'topic\n' >"$repo/topic"; git -C "$repo" add topic; git -C "$repo" commit -qm topic
git -C "$repo" switch -q main; printf 'main\n' >"$repo/main"; git -C "$repo" add main; git -C "$repo" commit -qm main
git -C "$repo" merge -q --no-ff -m integrate topic
test "$(git -C "$repo" show -s --format=%P HEAD | wc -w | tr -d ' ')" -eq 2
test "$(git -C "$repo" show HEAD:topic)" = topic; test "$(git -C "$repo" show HEAD:main)" = main` },
    { lang: "bash", purpose: "Mostra que squash preserva a tree pretendida sem tornar o head original ancestral.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'base\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" commit -qm base
git -C "$repo" switch -qc topic; printf 'feature\n' >"$repo/feature"; git -C "$repo" add feature; git -C "$repo" commit -qm feature; topic="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" switch -q main; git -C "$repo" merge -q --squash topic; git -C "$repo" commit -qm squash
test "$(git -C "$repo" show HEAD:feature)" = feature
git -C "$repo" merge-base --is-ancestor "$topic" HEAD && exit 1 || true
test "$(git -C "$repo" show -s --format=%P HEAD | wc -w | tr -d ' ')" -eq 1` },
  ],
  "Rebase e história publicada": [
    { lang: "bash", purpose: "Rebaseia commits sobre base avançada, conserva old tip e compara trees e identidades.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'base\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" commit -qm base
git -C "$repo" switch -qc topic; printf 'topic\n' >"$repo/t"; git -C "$repo" add t; git -C "$repo" commit -qm topic; old="$(git -C "$repo" rev-parse HEAD)"; git -C "$repo" branch backup "$old"
git -C "$repo" switch -q main; printf 'main\n' >"$repo/m"; git -C "$repo" add m; git -C "$repo" commit -qm main
git -C "$repo" switch -q topic; git -C "$repo" rebase main >/dev/null; new="$(git -C "$repo" rev-parse HEAD)"
test "$old" != "$new"; test "$(git -C "$repo" show HEAD:t)" = topic; test "$(git -C "$repo" show HEAD:m)" = main` },
    { lang: "bash", purpose: "Push com lease explícito rejeita escritor stale após avanço concorrente no remote local.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
git init -q --bare "$root/r.git"; git clone -q "$root/r.git" "$root/a"
git -C "$root/a" config user.name A; git -C "$root/a" config user.email a@example.invalid; git -C "$root/a" switch -qc main
printf 'base\n' >"$root/a/f"; git -C "$root/a" add f; git -C "$root/a" commit -qm base; git -C "$root/a" push -qu origin main
expected="$(git -C "$root/a" rev-parse origin/main)"; git clone -q "$root/r.git" "$root/b"; git -C "$root/b" switch -q main; git -C "$root/b" config user.name B; git -C "$root/b" config user.email b@example.invalid
printf 'other\n' >"$root/b/o"; git -C "$root/b" add o; git -C "$root/b" commit -qm other; git -C "$root/b" push -q origin main
printf 'mine\n' >"$root/a/m"; git -C "$root/a" add m; git -C "$root/a" commit -qm mine
git -C "$root/a" push --force-with-lease=refs/heads/main:"$expected" origin HEAD:main >/dev/null 2>&1 && exit 1 || true
test "$(git --git-dir="$root/r.git" show refs/heads/main:o)" = other` },
  ],
  "Conflitos e rerere": [
    { lang: "bash", purpose: "Inspeciona stages 1/2/3 e cria resolução semântica contendo requisitos de ambos os lados.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'limit=1\n' >"$repo/config"; git -C "$repo" add config; git -C "$repo" commit -qm base
git -C "$repo" switch -qc topic; printf 'limit=2\nfeature=on\n' >"$repo/config"; git -C "$repo" commit -qam topic
git -C "$repo" switch -q main; printf 'limit=3\naudit=on\n' >"$repo/config"; git -C "$repo" commit -qam main
git -C "$repo" merge topic >/dev/null 2>&1 && exit 1 || true
test "$(git -C "$repo" ls-files -u | wc -l | tr -d ' ')" -eq 3
printf 'limit=3\naudit=on\nfeature=on\n' >"$repo/config"; git -C "$repo" add config; git -C "$repo" commit -qm resolve
grep -q audit "$repo/config"; grep -q feature "$repo/config"` },
    { lang: "bash", purpose: "Registra resolução rerere e confirma que reaplicação ainda é revisada antes do commit.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid; git -C "$repo" config rerere.enabled true
printf 'base\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" commit -qm base
git -C "$repo" switch -qc topic; printf 'topic\n' >"$repo/f"; git -C "$repo" commit -qam topic
git -C "$repo" switch -q main; printf 'main\n' >"$repo/f"; git -C "$repo" commit -qam main; before="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" merge topic >/dev/null 2>&1 || true; printf 'combined\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" rerere; git -C "$repo" commit -qm resolved
git -C "$repo" reset --hard -q "$before"; git -C "$repo" merge topic >/dev/null 2>&1 || true
test "$(cat "$repo/f")" = combined; git -C "$repo" add f; git -C "$repo" diff --cached --check` },
  ],
  "Remotes, refspecs e fetch": [
    { lang: "bash", purpose: "Busca por refspec estreita e faz prune da remote-tracking sem apagar branch local homônima.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
git init -q --bare "$root/remote.git"; git init -q -b main "$root/source"
git -C "$root/source" config user.name Test; git -C "$root/source" config user.email test@example.invalid
printf 'base\n' >"$root/source/f"; git -C "$root/source" add f; git -C "$root/source" commit -qm base
git -C "$root/source" branch release/keep; git -C "$root/source" branch release/remove; git -C "$root/source" push -q "$root/remote.git" main release/keep release/remove
git init -q "$root/client"; git -C "$root/client" remote add origin "$root/remote.git"
git -C "$root/client" config remote.origin.fetch '+refs/heads/release/*:refs/remotes/origin/release/*'
git -C "$root/client" fetch -q origin; git -C "$root/client" show-ref --verify refs/remotes/origin/release/keep >/dev/null
git -C "$root/client" show-ref --verify refs/remotes/origin/main >/dev/null 2>&1 && exit 1 || true
git -C "$root/client" branch keep-local refs/remotes/origin/release/keep
git --git-dir="$root/remote.git" update-ref -d refs/heads/release/keep; git -C "$root/client" fetch -q --prune origin
git -C "$root/client" show-ref --verify refs/remotes/origin/release/keep >/dev/null 2>&1 && exit 1 || true
git -C "$root/client" show-ref --verify refs/remotes/origin/release/remove >/dev/null
git -C "$root/client" show-ref --verify refs/heads/keep-local >/dev/null` },
    { lang: "bash", purpose: "Mostra que FETCH_HEAD é transitório e que a remote-tracking ref só muda após fetch explícito.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
git init -q --bare "$root/r.git"; git clone -q "$root/r.git" "$root/a"
git -C "$root/a" config user.name Test; git -C "$root/a" config user.email test@example.invalid; git -C "$root/a" switch -qc main
printf 'one\n' >"$root/a/f"; git -C "$root/a" add f; git -C "$root/a" commit -qm one; git -C "$root/a" push -qu origin main
git clone -q "$root/r.git" "$root/b"; before="$(git -C "$root/b" rev-parse origin/main)"
printf 'two\n' >>"$root/a/f"; git -C "$root/a" commit -qam two; git -C "$root/a" push -q origin main; after="$(git -C "$root/a" rev-parse HEAD)"
test "$(git -C "$root/b" rev-parse origin/main)" = "$before"
git -C "$root/b" fetch -q origin main; test "$(git -C "$root/b" rev-parse origin/main)" = "$after"
grep -F "$after" "$root/b/.git/FETCH_HEAD" >/dev/null` },
  ],
  "Push seguro e concorrência": [
    { lang: "bash", purpose: "Rejeita lease stale e aceita atualização somente após integrar a ponta concorrente observada.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
git init -q --bare "$root/r.git"; git clone -q "$root/r.git" "$root/a"
git -C "$root/a" config user.name A; git -C "$root/a" config user.email a@example.invalid; git -C "$root/a" switch -qc main
printf 'base\n' >"$root/a/f"; git -C "$root/a" add f; git -C "$root/a" commit -qm base; git -C "$root/a" push -qu origin main
old="$(git -C "$root/a" rev-parse origin/main)"; git clone -q "$root/r.git" "$root/b"; git -C "$root/b" switch -q main; git -C "$root/b" config user.name B; git -C "$root/b" config user.email b@example.invalid
printf 'b\n' >"$root/b/b"; git -C "$root/b" add b; git -C "$root/b" commit -qm b; git -C "$root/b" push -q origin main
printf 'a\n' >"$root/a/a"; git -C "$root/a" add a; git -C "$root/a" commit -qm a
git -C "$root/a" push --force-with-lease=refs/heads/main:"$old" origin HEAD:main >/dev/null 2>&1 && exit 1 || true
git -C "$root/a" fetch -q origin; observed="$(git -C "$root/a" rev-parse origin/main)"; git -C "$root/a" rebase origin/main >/dev/null
git -C "$root/a" push -q --force-with-lease=refs/heads/main:"$observed" origin HEAD:main
test "$(git --git-dir="$root/r.git" show main:a)" = a; test "$(git --git-dir="$root/r.git" show main:b)" = b` },
    { lang: "bash", purpose: "Publica branch e annotated tag atomicamente e verifica os dois targets no remote.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
git init -q --bare "$root/r.git"; git init -q -b main "$root/a"
git -C "$root/a" config user.name Test; git -C "$root/a" config user.email test@example.invalid
printf 'release\n' >"$root/a/f"; git -C "$root/a" add f; git -C "$root/a" commit -qm release
commit="$(git -C "$root/a" rev-parse HEAD)"; git -C "$root/a" tag -a v1.0.0 -m 'release v1'
git -C "$root/a" push -q --atomic "$root/r.git" refs/heads/main:refs/heads/main refs/tags/v1.0.0:refs/tags/v1.0.0
test "$(git --git-dir="$root/r.git" rev-parse refs/heads/main)" = "$commit"
test "$(git --git-dir="$root/r.git" rev-parse 'refs/tags/v1.0.0^{commit}')" = "$commit"
test "$(git --git-dir="$root/r.git" cat-file -t refs/tags/v1.0.0)" = tag` },
  ],
  "Tags, versões e assinaturas": [
    { lang: "bash", purpose: "Distingue lightweight de annotated tag por tipo e confirma peeling para o commit da release.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'release\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" commit -qm release; commit="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" tag local-mark; git -C "$repo" tag -a v1.2.0 -m 'Quiron 1.2.0'
test "$(git -C "$repo" cat-file -t refs/tags/local-mark)" = commit
test "$(git -C "$repo" cat-file -t refs/tags/v1.2.0)" = tag
test "$(git -C "$repo" rev-parse 'v1.2.0^{commit}')" = "$commit"
git -C "$repo" for-each-ref --format='%(refname) %(objecttype)' refs/tags | grep -F 'refs/tags/v1.2.0 tag' >/dev/null` },
    { lang: "bash", purpose: "Demonstra que push normal recusa mover tag publicada e preserva o target remoto original.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
git init -q --bare "$root/r.git"; git init -q -b main "$root/a"; git -C "$root/a" config user.name Test; git -C "$root/a" config user.email test@example.invalid
printf 'one\n' >"$root/a/f"; git -C "$root/a" add f; git -C "$root/a" commit -qm one; first="$(git -C "$root/a" rev-parse HEAD)"; git -C "$root/a" tag -a v1 -m v1
git -C "$root/a" push -q "$root/r.git" main v1
printf 'two\n' >>"$root/a/f"; git -C "$root/a" commit -qam two; git -C "$root/a" tag -fa v1 -m moved
git -C "$root/a" push "$root/r.git" refs/tags/v1 >/dev/null 2>&1 && exit 1 || true
test "$(git --git-dir="$root/r.git" rev-parse 'refs/tags/v1^{commit}')" = "$first"` },
  ],
  "Protocolos, credenciais e clones": [
    { lang: "bash", purpose: "Compara clone completo e shallow real, detecta boundary e aprofunda até recuperar ancestry.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
git init -q --bare "$root/r.git"; git clone -q "$root/r.git" "$root/src"; git -C "$root/src" config user.name Test; git -C "$root/src" config user.email test@example.invalid; git -C "$root/src" switch -qc main
for n in 1 2 3; do printf '%s\n' "$n" >>"$root/src/f"; git -C "$root/src" add f; git -C "$root/src" commit -qm "c$n"; done; git -C "$root/src" push -qu origin main; git --git-dir="$root/r.git" symbolic-ref HEAD refs/heads/main
git clone -q "$root/r.git" "$root/full"; git clone -q --no-local --depth=1 "file://$root/r.git" "$root/shallow"
test "$(git -C "$root/full" rev-parse --is-shallow-repository)" = false
test "$(git -C "$root/shallow" rev-parse --is-shallow-repository)" = true; test "$(git -C "$root/shallow" rev-list --count HEAD)" -eq 1
git -C "$root/shallow" fetch -q --unshallow origin
test "$(git -C "$root/shallow" rev-parse --is-shallow-repository)" = false; test "$(git -C "$root/shallow" rev-list --count HEAD)" -eq 3` },
    { lang: "bash", purpose: "Cria mirror e clone dissociado, depois prova que o segundo permanece íntegro sem a referência original.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
git init -q --bare "$root/r.git"; git init -q -b main "$root/src"; git -C "$root/src" config user.name Test; git -C "$root/src" config user.email test@example.invalid
printf 'content\n' >"$root/src/f"; git -C "$root/src" add f; git -C "$root/src" commit -qm base; git -C "$root/src" tag snapshot; git -C "$root/src" push -q "$root/r.git" main snapshot; git --git-dir="$root/r.git" symbolic-ref HEAD refs/heads/main
git clone -q --mirror "$root/r.git" "$root/mirror.git"
git --git-dir="$root/mirror.git" show-ref --verify refs/heads/main >/dev/null; git --git-dir="$root/mirror.git" show-ref --verify refs/tags/snapshot >/dev/null
git clone -q --reference "$root/mirror.git" --dissociate "$root/r.git" "$root/independent"
git --git-dir="$root/mirror.git" repack -ad >/dev/null; rm -rf "$root/mirror.git"
git -C "$root/independent" fsck --full --no-dangling >/dev/null
test "$(git -C "$root/independent" show HEAD:f)" = content` },
  ],
  "Repositórios, forks e permissões": [
    { lang: "bash", purpose: "Modela fork e upstream como remotes distintos e envia somente ao destino gravável explícito.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
git init -q --bare "$root/upstream.git"; git init -q --bare "$root/fork.git"; git init -q -b main "$root/work"
git -C "$root/work" config user.name Test; git -C "$root/work" config user.email test@example.invalid
printf 'base\n' >"$root/work/f"; git -C "$root/work" add f; git -C "$root/work" commit -qm base
git -C "$root/work" remote add upstream "$root/upstream.git"; git -C "$root/work" remote add origin "$root/fork.git"
git -C "$root/work" push -q upstream main; git -C "$root/work" push -q origin main
printf 'feature\n' >"$root/work/feature"; git -C "$root/work" add feature; git -C "$root/work" commit -qm feature
git -C "$root/work" push -q origin HEAD:refs/heads/feature
git --git-dir="$root/fork.git" show-ref --verify refs/heads/feature >/dev/null
git --git-dir="$root/upstream.git" show-ref --verify refs/heads/feature >/dev/null 2>&1 && exit 1 || true` },
    { lang: "bash", purpose: "Valida a CLI GitHub real e documenta comandos de criação/configuração sem realizar mutação remota.", code: `set -euo pipefail
command -v gh >/dev/null
version="$(gh --version | head -n 1)"; test -n "$version"
gh repo create --help | grep -F -- '--private' >/dev/null
gh repo edit --help | grep -F -- '--default-branch' >/dev/null
gh api --help | grep -F -- '--method' >/dev/null
printf '%s\n' "$version" | grep -E '^gh version [0-9]+' >/dev/null` },
  ],
  "Issues, templates e triagem": [
    { lang: "bash", purpose: "Cria issue form versionado com campos de reprodução e proibição explícita de segredos.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q "$repo"; mkdir -p "$repo/.github/ISSUE_TEMPLATE"
form="$repo/.github/ISSUE_TEMPLATE/bug.yml"
printf '%s\n' 'name: Bug report' 'description: Relate uma falha reproduzível' 'title: "[Bug]: "' 'labels: ["type:bug"]' 'body:' '  - type: markdown' '    attributes:' '      value: "Não envie tokens ou dados pessoais."' '  - type: textarea' '    id: reproduction' '    attributes:' '      label: Passos para reproduzir' '    validations:' '      required: true' >"$form"
grep -F 'id: reproduction' "$form" >/dev/null; grep -F 'required: true' "$form" >/dev/null
grep -Ei 'tokens|segredos' "$form" >/dev/null
git -C "$repo" add .github/ISSUE_TEMPLATE/bug.yml
test "$(git -C "$repo" diff --cached --name-only)" = .github/ISSUE_TEMPLATE/bug.yml` },
    { lang: "bash", purpose: "Valida comandos gh de issue e uma chave idempotente local sem chamar a API sem autorização.", code: `set -euo pipefail
gh issue create --help | grep -F -- '--title' >/dev/null
gh issue list --help | grep -F -- '--json' >/dev/null
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
marker='<!-- chiron-triage:v1:incident-42 -->'
printf '%s\n%s\n' "$marker" 'Impacto: reservas indisponíveis' >"$root/body"
test "$(grep -Fxc "$marker" "$root/body")" -eq 1
if grep -E '(ghp_|github_pat_|BEGIN [A-Z ]+PRIVATE KEY)' "$root/body"; then exit 1; fi` },
  ],
  "Pull requests e diffs": [
    { lang: "bash", purpose: "Reproduz localmente base, head, merge-base e diff three-dot de um pull request.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'base\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" commit -qm base
git -C "$repo" switch -qc feature; printf 'feature\n' >"$repo/feature"; git -C "$repo" add feature; git -C "$repo" commit -qm feature; head="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" switch -q main; printf 'main\n' >"$repo/main"; git -C "$repo" add main; git -C "$repo" commit -qm main; base="$(git -C "$repo" rev-parse HEAD)"
merge_base="$(git -C "$repo" merge-base "$base" "$head")"
test "$(git -C "$repo" diff --name-only "$base...$head")" = feature
test "$(git -C "$repo" rev-list --count "$merge_base..$head")" -eq 1
test "$(git -C "$repo" rev-list --count "$merge_base..$base")" -eq 1` },
    { lang: "bash", purpose: "Confirma campos e opções estáveis da CLI para PR sem confundir help local com execução GitHub.", code: `set -euo pipefail
gh pr create --help | grep -F -- '--base' >/dev/null
gh pr create --help | grep -F -- '--head' >/dev/null
gh pr view --help | grep -F -- '--json' >/dev/null
gh pr diff --help | grep -F -- '--name-only' >/dev/null
gh pr merge --help | grep -E -- '--merge|--squash|--rebase' >/dev/null
gh pr checks --help | grep -F -- '--watch' >/dev/null` },
  ],
  "Reviews, CODEOWNERS e proteção": [
    { lang: "bash", purpose: "Versiona CODEOWNERS com fallback anterior a regras específicas e audita paths críticos.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q "$repo"; mkdir -p "$repo/.github/workflows" "$repo/db/migrations"
printf '%s\n' '* @org/general' '/.github/workflows/ @org/platform-security' '/db/migrations/ @org/database' '/CODEOWNERS @org/platform-security' >"$repo/CODEOWNERS"
test "$(tail -n 1 "$repo/CODEOWNERS")" = '/CODEOWNERS @org/platform-security'
grep -F '/.github/workflows/ @org/platform-security' "$repo/CODEOWNERS" >/dev/null
grep -F '/db/migrations/ @org/database' "$repo/CODEOWNERS" >/dev/null
git -C "$repo" add CODEOWNERS; git -C "$repo" diff --cached --check
test "$(git -C "$repo" show :CODEOWNERS | wc -l | tr -d ' ')" -eq 4` },
    { lang: "bash", purpose: "Valida superfície real de review/ruleset da CLI sem alegar enforcement remoto.", code: `set -euo pipefail
gh pr review --help | grep -E -- '--approve|--request-changes' >/dev/null
gh pr view --help | grep -F -- '--json' >/dev/null
gh api --help | grep -F -- '--paginate' >/dev/null
gh api --help | grep -F -- '--input' >/dev/null
version="$(gh --version | head -n 1)"; printf '%s\n' "$version" | grep -E '^gh version [0-9]+' >/dev/null` },
  ],
  "Workflows, eventos e contexts": [
    { lang: "bash", purpose: "Versiona workflow de PR não confiável com token somente leitura e sem secrets ou evento privilegiado.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT; mkdir -p "$repo/.github/workflows"
wf="$repo/.github/workflows/pr.yml"
printf '%s\n' 'name: pr-check' 'on:' '  pull_request:' 'permissions:' '  contents: read' 'jobs:' '  test:' '    runs-on: ubuntu-latest' '    timeout-minutes: 10' '    steps:' '      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683' '      - run: npm test' >"$wf"
grep -F 'pull_request:' "$wf" >/dev/null; grep -F 'contents: read' "$wf" >/dev/null
if grep -E 'pull_request_target|secrets\.|write-all' "$wf"; then exit 1; fi
git init -q "$repo"; git -C "$repo" add .github/workflows/pr.yml; git -C "$repo" diff --cached --check` },
    { lang: "bash", purpose: "Valida comandos reais para listar/ver/rodar workflow sem disparar execução remota.", code: `set -euo pipefail
gh workflow list --help | grep -F -- '--json' >/dev/null
gh workflow view --help | grep -F -- '--yaml' >/dev/null
gh workflow run --help | grep -F -- '--ref' >/dev/null
gh run view --help | grep -F -- '--log' >/dev/null
gh run list --help | grep -F -- '--workflow' >/dev/null` },
  ],
  "Runners, matrices e caches": [
    { lang: "bash", purpose: "Define matriz limitada com combinação experimental explícita e concurrency separada por workflow.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
wf="$root/matrix.yml"
printf '%s\n' 'name: matrix' 'on: [push]' 'permissions: {}' 'concurrency:' '  group: ci-ref' '  cancel-in-progress: true' 'jobs:' '  test:' '    strategy:' '      fail-fast: false' '      max-parallel: 3' '      matrix:' '        os: [ubuntu-latest, windows-latest]' '        node: [20, 22]' '    runs-on: ubuntu-latest' '    steps:' '      - run: npm test' >"$wf"
grep -F 'os: [ubuntu-latest, windows-latest]' "$wf" >/dev/null
grep -F 'max-parallel: 3' "$wf" >/dev/null; grep -F 'permissions: {}' "$wf" >/dev/null
if grep -F 'self-hosted' "$wf"; then exit 1; fi` },
    { lang: "bash", purpose: "Calcula cache key determinística pelo lockfile e prova que mudança de dependência produz outra chave.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
printf 'dependency=1\n' >"$root/lock"
first="node-linux-$(sha256sum "$root/lock" | cut -d' ' -f1)"
printf 'dependency=2\n' >"$root/lock"
second="node-linux-$(sha256sum "$root/lock" | cut -d' ' -f1)"
test "$first" != "$second"; case "$first" in node-linux-*) ;; *) exit 1;; esac
test "$(printf '%s' "$first" | wc -c | tr -d ' ')" -gt 60` },
  ],
  "Secrets, OIDC e environments": [
    { lang: "bash", purpose: "Valida trust policy OIDC restrita a repository, environment e audience por JSON real.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
policy="$root/policy.json"
printf '%s\n' '{"issuer":"https://token.actions.githubusercontent.com","audience":"cloud-prod","subject":"repo:acme/chiron:environment:production"}' >"$policy"
node -e 'const fs=require("fs"); const p=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); if(p.audience!=="cloud-prod"||p.subject!=="repo:acme/chiron:environment:production"||!p.issuer.startsWith("https://")||Object.values(p).includes("*")) process.exit(1)' "$policy"` },
    { lang: "bash", purpose: "Define job de produção com environment e permissões mínimas sem armazenar credencial cloud estática.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
wf="$root/deploy.yml"
printf '%s\n' 'name: deploy' 'on: [workflow_dispatch]' 'permissions: {}' 'jobs:' '  deploy:' '    environment: production' '    permissions:' '      contents: read' '      id-token: write' '    runs-on: ubuntu-latest' '    steps:' '      - run: ./deploy-by-digest.sh' >"$wf"
grep -F 'environment: production' "$wf" >/dev/null; grep -F 'id-token: write' "$wf" >/dev/null
if grep -E 'AWS_SECRET|AZURE_CLIENT_SECRET|GOOGLE_CREDENTIALS|write-all' "$wf"; then exit 1; fi` },
  ],
  "Checks, artifacts e provenance": [
    { lang: "bash", purpose: "Cria artifact e manifest de digest, valida bytes e rejeita alteração posterior.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
mkdir "$root/artifact"; printf 'quiron-build-v1\n' >"$root/artifact/app.bin"
(cd "$root/artifact" && sha256sum app.bin > SHA256SUMS)
(cd "$root/artifact" && sha256sum -c SHA256SUMS >/dev/null)
expected="$(cut -d' ' -f1 "$root/artifact/SHA256SUMS")"; test -n "$expected"
printf 'tampered\n' >>"$root/artifact/app.bin"
(cd "$root/artifact" && sha256sum -c SHA256SUMS >/dev/null 2>&1) && exit 1 || true` },
    { lang: "bash", purpose: "Valida a superfície real de checks, artifacts e attestations na GitHub CLI instalada.", code: `set -euo pipefail
gh pr checks --help | grep -F -- '--required' >/dev/null
gh run download --help | grep -F -- '--name' >/dev/null
gh run view --help | grep -F -- '--attempt' >/dev/null
gh attestation verify --help | grep -E -- '--repo|--owner' >/dev/null
gh attestation download --help | grep -F -- '--repo' >/dev/null` },
  ],
  "Release notes e changelog": [
    { lang: "bash", purpose: "Gera range de release entre annotated tags e prova que somente a mudança nova entra nas notas.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT
git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'one\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" commit -qm 'feat: initial'; git -C "$repo" tag -a v1.0.0 -m v1
printf 'two\n' >>"$repo/f"; git -C "$repo" commit -qam 'fix: preserve reservation'; git -C "$repo" tag -a v1.0.1 -m v1.0.1
notes="$(git -C "$repo" log --format='%s' v1.0.0..v1.0.1)"
test "$notes" = 'fix: preserve reservation'
test "$(git -C "$repo" rev-list --count v1.0.0..v1.0.1)" -eq 1
test "$(git -C "$repo" rev-parse 'v1.0.1^{commit}')" = "$(git -C "$repo" rev-parse HEAD)"` },
    { lang: "bash", purpose: "Valida changelog com versão única, seções operacionais e target existente.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
file="$root/CHANGELOG.md"
printf '%s\n' '# Changelog' '' '## [1.2.0] - 2026-09-19' '### Changed' '- Reserva usa compare-and-set.' '### Migration' '- Aplicar constraint antes do deploy.' '### Rollback' '- Reativar artifact 1.1.1; schema é compatível.' >"$file"
test "$(grep -Fxc '## [1.2.0] - 2026-09-19' "$file")" -eq 1
grep -F '### Migration' "$file" >/dev/null; grep -F '### Rollback' "$file" >/dev/null
if grep -Ei '(token|password|secret)=' "$file"; then exit 1; fi` },
  ],
  "Artifacts e checksums": [
    { lang: "bash", purpose: "Produz manifest ordenado para dois artifacts e detecta bytes truncados antes da promoção.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; mkdir "$root/dist"
printf 'linux-binary\n' >"$root/dist/chiron-linux"; printf 'windows-binary\n' >"$root/dist/chiron-windows.exe"
(cd "$root/dist" && sha256sum chiron-linux chiron-windows.exe > SHA256SUMS)
(cd "$root/dist" && sha256sum -c SHA256SUMS >/dev/null)
test "$(wc -l <"$root/dist/SHA256SUMS" | tr -d ' ')" -eq 2
cp "$root/dist/chiron-linux" "$root/corrupt"; truncate -s 4 "$root/corrupt"
expected="$(head -n 1 "$root/dist/SHA256SUMS" | cut -d' ' -f1)"; test "$(sha256sum "$root/corrupt" | cut -d' ' -f1)" != "$expected"` },
    { lang: "bash", purpose: "Cria archive determinístico duas vezes e compara digest sem reconstruir no deploy.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; mkdir "$root/src"
printf 'app\n' >"$root/src/app"; printf 'license\n' >"$root/src/LICENSE"
tar --sort=name --mtime='UTC 2020-01-01' --owner=0 --group=0 --numeric-owner -cf "$root/a.tar" -C "$root/src" .
tar --sort=name --mtime='UTC 2020-01-01' --owner=0 --group=0 --numeric-owner -cf "$root/b.tar" -C "$root/src" .
first="$(sha256sum "$root/a.tar" | cut -d' ' -f1)"; second="$(sha256sum "$root/b.tar" | cut -d' ' -f1)"
test "$first" = "$second"; tar -tf "$root/a.tar" | grep -F './LICENSE' >/dev/null` },
  ],
  "GitHub Packages e registries": [
    { lang: "bash", purpose: "Simula registry imutável: retry com mesmo digest é noop e bytes divergentes na versão falham.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; mkdir -p "$root/registry/@acme/chiron"
printf 'package-v1\n' >"$root/package.tgz"; digest="$(sha256sum "$root/package.tgz" | cut -d' ' -f1)"
printf '%s\n' "$digest" >"$root/registry/@acme/chiron/1.0.0.sha256"
test "$(cat "$root/registry/@acme/chiron/1.0.0.sha256")" = "$digest"
retry="$(sha256sum "$root/package.tgz" | cut -d' ' -f1)"; test "$retry" = "$digest"
printf 'different\n' >"$root/package.tgz"; candidate="$(sha256sum "$root/package.tgz" | cut -d' ' -f1)"
test "$candidate" != "$(cat "$root/registry/@acme/chiron/1.0.0.sha256")"` },
    { lang: "bash", purpose: "Valida comandos de packages/auth da CLI e configuração de namespace sem publicar remotamente.", code: `set -euo pipefail
gh auth status --help | grep -F -- '--hostname' >/dev/null
gh api --help | grep -F -- '--hostname' >/dev/null
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
printf '%s\n' '@acme:registry=https://npm.pkg.github.com' 'always-auth=true' >"$root/npmrc"
grep -F '@acme:registry=https://npm.pkg.github.com' "$root/npmrc" >/dev/null
if grep -Ei '(_authToken|password)=' "$root/npmrc"; then exit 1; fi` },
  ],
  "APIs, gh e idempotência": [
    { lang: "bash", purpose: "Processa páginas JSON locais, deduplica IDs e valida que cursor avança antes de concluir.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
printf '%s\n' '{"items":[{"id":1},{"id":2}],"next":"c2"}' >"$root/p1.json"
printf '%s\n' '{"items":[{"id":2},{"id":3}],"next":null}' >"$root/p2.json"
node -e 'const fs=require("fs"); const a=JSON.parse(fs.readFileSync(process.argv[1])); const b=JSON.parse(fs.readFileSync(process.argv[2])); if(a.next!=="c2"||b.next!==null) process.exit(1); const ids=[...new Set([...a.items,...b.items].map(x=>x.id))]; if(ids.join()!=="1,2,3") process.exit(1)' "$root/p1.json" "$root/p2.json"
test "$(wc -l <"$root/p1.json" | tr -d ' ')" -eq 1` },
    { lang: "bash", purpose: "Reconcilia desired state por marker e valida paginação/JSON na CLI real sem chamar API.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
marker='chiron-release:v1:v2.0.0'; printf '%s\n' "$marker" >"$root/state"
desired="$marker"; current="$(cat "$root/state")"; test "$current" = "$desired"
test "$(grep -Fxc "$marker" "$root/state")" -eq 1
gh api --help | grep -F -- '--paginate' >/dev/null
gh api --help | grep -F -- '--jq' >/dev/null
gh api --help | grep -F -- '--method' >/dev/null` },
  ],
  "Secret scanning e remoção": [
    { lang: "bash", purpose: "Detecta somente credencial sintética em diff staged e impede commit sem imprimir o valor.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT; git init -q "$repo"
printf 'api_key=fixture_not_a_real_secret_123456\n' >"$repo/.env"; git -C "$repo" add -f .env
matches="$(git -C "$repo" diff --cached --numstat -- .env | cut -f1)"; test "$matches" -eq 1
git -C "$repo" show :.env | grep -Eq '^api_key=fixture_not_a_real_secret_[0-9]+$'
printf '.env\n' >"$repo/.gitignore"; git -C "$repo" reset -q -- .env; rm "$repo/.env"
git -C "$repo" check-ignore -q .env
test -z "$(git -C "$repo" ls-files -- .env)"` },
    { lang: "bash", purpose: "Demonstra que remover segredo sintético do novo commit não apaga o blob antigo alcançável pelo reflog.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT; git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'fixture-secret\n' >"$repo/leak"; git -C "$repo" add leak; git -C "$repo" commit -qm leaked
old="$(git -C "$repo" rev-parse HEAD)"; blob="$(git -C "$repo" rev-parse HEAD:leak)"
git -C "$repo" rm -q leak; git -C "$repo" commit -qm remove
git -C "$repo" cat-file -e "$blob^{blob}"
git -C "$repo" show "$old":leak | grep -F 'fixture-secret' >/dev/null
git -C "$repo" reflog --format=%H | grep -F "$old" >/dev/null` },
  ],
  "Assinaturas e identidade": [
    { lang: "bash", purpose: "Assina commit com chave SSH efêmera, allowed signers isolado e verifica o objeto real.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
ssh-keygen -q -t ed25519 -N '' -C chiron@example.invalid -f "$root/key"
printf 'chiron@example.invalid %s\n' "$(cat "$root/key.pub")" >"$root/allowed_signers"
git init -q -b main "$root/repo"; git -C "$root/repo" config user.name Chiron; git -C "$root/repo" config user.email chiron@example.invalid
git -C "$root/repo" config gpg.format ssh; git -C "$root/repo" config user.signingkey "$root/key"; git -C "$root/repo" config gpg.ssh.allowedSignersFile "$root/allowed_signers"
printf 'signed\n' >"$root/repo/f"; git -C "$root/repo" add f; git -C "$root/repo" commit -q -S -m signed
git -C "$root/repo" verify-commit HEAD >/dev/null
git -C "$root/repo" log -1 --format=%G? | grep -F G >/dev/null` },
    { lang: "bash", purpose: "Prova que author configurado não é assinatura e que annotated tag assinada cobre target exato.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; ssh-keygen -q -t ed25519 -N '' -C release@example.invalid -f "$root/key"
printf 'release@example.invalid %s\n' "$(cat "$root/key.pub")" >"$root/allowed"
git init -q -b main "$root/repo"; git -C "$root/repo" config user.name Release; git -C "$root/repo" config user.email release@example.invalid
printf 'release\n' >"$root/repo/f"; git -C "$root/repo" add f; git -C "$root/repo" commit -qm unsigned; test "$(git -C "$root/repo" log -1 --format=%G?)" = N
git -C "$root/repo" config gpg.format ssh; git -C "$root/repo" config user.signingkey "$root/key"; git -C "$root/repo" config gpg.ssh.allowedSignersFile "$root/allowed"
target="$(git -C "$root/repo" rev-parse HEAD)"; git -C "$root/repo" tag -s v1 -m release
git -C "$root/repo" verify-tag v1 >/dev/null; test "$(git -C "$root/repo" rev-parse 'v1^{commit}')" = "$target"` },
  ],
  "Rulesets, tokens e audit": [
    { lang: "bash", purpose: "Valida desired policy local com proteção, checks e bypass vazio por JSON real.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; policy="$root/ruleset.json"
printf '%s\n' '{"enforcement":"active","target":"branch","bypass_actors":[],"rules":["pull_request","required_status_checks","non_fast_forward"]}' >"$policy"
node -e 'const fs=require("fs");const p=JSON.parse(fs.readFileSync(process.argv[1]));const need=["pull_request","required_status_checks","non_fast_forward"];if(p.enforcement!=="active"||p.target!=="branch"||p.bypass_actors.length||need.some(x=>!p.rules.includes(x)))process.exit(1)' "$policy"
gh api --help | grep -F -- '--method' >/dev/null` },
    { lang: "bash", purpose: "Audita inventário de credencial sem valor e rejeita token amplo, sem owner ou sem expiração.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; file="$root/credentials.json"
printf '%s\n' '[{"kind":"github-app","owner":"platform","repositories":["acme/chiron"],"permissions":{"contents":"read"},"expires":"2026-10-01"}]' >"$file"
node -e 'const fs=require("fs");const xs=JSON.parse(fs.readFileSync(process.argv[1]));if(!xs.length||xs.some(x=>!x.owner||!x.expires||x.repositories.includes("*")||Object.values(x.permissions).includes("admin")))process.exit(1)' "$file"
if grep -Ei '(token|secret|private_key)"[[:space:]]*:' "$file"; then exit 1; fi` },
  ],
  "Dependências e code scanning": [
    { lang: "bash", purpose: "Valida lockfile por origem e integrity e detecta troca silenciosa de registry.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; lock="$root/lock.json"
printf '%s\n' '{"packages":{"node_modules/example":{"version":"1.2.3","resolved":"https://registry.npmjs.org/example/-/example-1.2.3.tgz","integrity":"sha512-fixture"}}}' >"$lock"
node -e 'const fs=require("fs");const p=JSON.parse(fs.readFileSync(process.argv[1])).packages["node_modules/example"];if(p.version!=="1.2.3"||!p.resolved.startsWith("https://registry.npmjs.org/")||!p.integrity.startsWith("sha512-"))process.exit(1)' "$lock"
if grep -F 'http://' "$lock"; then exit 1; fi` },
    { lang: "bash", purpose: "Valida SARIF mínimo com finding, localização e ferramenta, rejeitando sucesso vazio de análise.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; sarif="$root/result.sarif"
printf '%s\n' '{"version":"2.1.0","runs":[{"tool":{"driver":{"name":"Chiron Fixture Scanner","rules":[{"id":"AUTH001"}]}},"results":[{"ruleId":"AUTH001","message":{"text":"authorization missing"},"locations":[{"physicalLocation":{"artifactLocation":{"uri":"src/auth.ts"}}}]}]}]}' >"$sarif"
node -e 'const fs=require("fs");const s=JSON.parse(fs.readFileSync(process.argv[1]));const r=s.runs[0];if(s.version!=="2.1.0"||!r.tool.driver.name||r.results.length!==1||r.results[0].ruleId!=="AUTH001"||!r.results[0].locations[0])process.exit(1)' "$sarif"
test "$(wc -c <"$sarif" | tr -d ' ')" -gt 200` },
  ],
  "Internals, packfiles e manutenção": [
    { lang: "bash", purpose: "Compacta objetos, escreve/verifica commit-graph e preserva todas as refs e trees.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT; git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
for n in 1 2 3 4 5; do printf '%s\n' "$n" >>"$repo/data"; git -C "$repo" add data; git -C "$repo" commit -qm "c$n"; done
before="$(git -C "$repo" rev-parse HEAD^{tree})"; count="$(git -C "$repo" rev-list --count HEAD)"
git -C "$repo" repack -ad; git -C "$repo" commit-graph write --reachable; git -C "$repo" commit-graph verify
git -C "$repo" fsck --full --no-dangling >/dev/null
test "$(git -C "$repo" rev-parse HEAD^{tree})" = "$before"; test "$(git -C "$repo" rev-list --count HEAD)" = "$count"
test -n "$(find "$repo/.git/objects/pack" -name '*.pack' -print -quit)"` },
    { lang: "bash", purpose: "Cria clone dissociado de object pool e prova integridade depois que a fonte deixa de existir.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; git init -q -b main "$root/source"; git -C "$root/source" config user.name Test; git -C "$root/source" config user.email test@example.invalid
printf 'object\n' >"$root/source/f"; git -C "$root/source" add f; git -C "$root/source" commit -qm base; git -C "$root/source" repack -ad
git clone -q --reference "$root/source" --dissociate "$root/source" "$root/copy"
mv "$root/source" "$root/source-offline"
git -C "$root/copy" fsck --full --no-dangling >/dev/null
test "$(git -C "$root/copy" show HEAD:f)" = object
test ! -f "$root/copy/.git/objects/info/alternates"` },
  ],
  "Monorepos e sparse/partial clone": [
    { lang: "bash", purpose: "Aplica sparse cone e prova que path ausente do disco continua presente na tree do commit.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT; git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
mkdir -p "$repo/apps/web" "$repo/apps/api" "$repo/packages/shared"; printf 'web\n' >"$repo/apps/web/app"; printf 'api\n' >"$repo/apps/api/app"; printf 'shared\n' >"$repo/packages/shared/lib"
git -C "$repo" add .; git -C "$repo" commit -qm monorepo
git -C "$repo" sparse-checkout init --cone; git -C "$repo" sparse-checkout set apps/web packages/shared
test -f "$repo/apps/web/app"; test -f "$repo/packages/shared/lib"; test ! -f "$repo/apps/api/app"
test "$(git -C "$repo" show HEAD:apps/api/app)" = api
git -C "$repo" ls-tree -r --name-only HEAD | grep -F 'apps/api/app' >/dev/null` },
    { lang: "bash", purpose: "Seleciona consumidores transitivos de pacote compartilhado em vez de confiar só no path alterado.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT
printf '%s\n' '{"web":["shared"],"api":["shared"],"shared":[]}' >"$root/graph.json"
node -e 'const fs=require("fs");const g=JSON.parse(fs.readFileSync(process.argv[1]));const changed="shared";const affected=Object.entries(g).filter(([n,deps])=>n===changed||deps.includes(changed)).map(([n])=>n).sort();if(affected.join()!=="api,shared,web")process.exit(1)' "$root/graph.json"
printf '%s\n' 'packages/shared/lib.ts' >"$root/changed"
grep -F 'packages/shared/' "$root/changed" >/dev/null` },
  ],
  "Submodules, subtree e vendoring": [
    { lang: "bash", purpose: "Fixa submodule por gitlink e prova que avanço upstream não muda superproject sem novo commit.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; git init -q -b main "$root/lib"; git -C "$root/lib" config user.name Test; git -C "$root/lib" config user.email test@example.invalid
printf 'v1\n' >"$root/lib/lib"; git -C "$root/lib" add lib; git -C "$root/lib" commit -qm v1; first="$(git -C "$root/lib" rev-parse HEAD)"
git init -q -b main "$root/app"; git -C "$root/app" config user.name Test; git -C "$root/app" config user.email test@example.invalid
git -C "$root/app" -c protocol.file.allow=always submodule add -q "$root/lib" deps/lib; git -C "$root/app" commit -qm 'add submodule'
test "$(git -C "$root/app" ls-tree HEAD deps/lib | awk '{print $1" "$3}')" = "160000 $first"
printf 'v2\n' >"$root/lib/lib"; git -C "$root/lib" commit -qam v2
test "$(git -C "$root/app" rev-parse HEAD:deps/lib)" = "$first"` },
    { lang: "bash", purpose: "Verifica import vendorizado por origem, versão, licença e digest antes de aceitá-lo.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; mkdir -p "$root/vendor/lib"
printf 'library source\n' >"$root/vendor/lib/source"; digest="$(sha256sum "$root/vendor/lib/source" | cut -d' ' -f1)"
printf '%s\n' 'origin=https://example.invalid/lib' 'version=1.2.3' "sha256=$digest" >"$root/vendor/lib/ORIGIN"
printf 'MIT fixture\n' >"$root/vendor/lib/LICENSE"
recorded="$(grep '^sha256=' "$root/vendor/lib/ORIGIN" | cut -d= -f2)"
test "$recorded" = "$(sha256sum "$root/vendor/lib/source" | cut -d' ' -f1)"
grep -F 'version=1.2.3' "$root/vendor/lib/ORIGIN" >/dev/null; test -s "$root/vendor/lib/LICENSE"` },
  ],
  "LFS, binários e políticas de tamanho": [
    { lang: "bash", purpose: "Audita pointer LFS sintético por versão, OID SHA-256 e tamanho sem fingir acesso ao serviço.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; bytes='binary-fixture'; printf '%s' "$bytes" >"$root/object"
oid="$(sha256sum "$root/object" | cut -d' ' -f1)"; size="$(wc -c <"$root/object" | tr -d ' ')"
printf '%s\n' 'version https://git-lfs.github.com/spec/v1' "oid sha256:$oid" "size $size" >"$root/pointer"
grep -Fx 'version https://git-lfs.github.com/spec/v1' "$root/pointer" >/dev/null
test "$(awk '/^oid /{print $2}' "$root/pointer")" = "sha256:$oid"
test "$(awk '/^size /{print $2}' "$root/pointer")" = "$size"` },
    { lang: "bash", purpose: "Bloqueia blob staged acima do limite e permite pointer pequeno explicitamente identificado.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT; git init -q "$repo"
dd if=/dev/zero of="$repo/large.bin" bs=1024 count=4 status=none; git -C "$repo" add large.bin
blob="$(git -C "$repo" rev-parse :large.bin)"; size="$(git -C "$repo" cat-file -s "$blob")"; test "$size" -gt 1024
git -C "$repo" reset -q -- large.bin; printf '%s\n' 'version https://git-lfs.github.com/spec/v1' 'oid sha256:0000000000000000000000000000000000000000000000000000000000000000' 'size 4096' >"$repo/large.bin"
git -C "$repo" add large.bin; pointer_size="$(git -C "$repo" cat-file -s :large.bin)"
test "$pointer_size" -lt 1024; git -C "$repo" show :large.bin | grep -F 'version https://git-lfs.github.com/spec/v1' >/dev/null` },
  ],
  "Bisect, blame e regressões": [
    { lang: "bash", purpose: "Executa bisect run com oráculo determinístico e encontra exatamente o commit introdutor.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'git -C "$repo" bisect reset >/dev/null 2>&1 || true; rm -rf "$repo"' EXIT; git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'limit=1\n' >"$repo/config"; git -C "$repo" add config; git -C "$repo" commit -qm good; good="$(git -C "$repo" rev-parse HEAD)"
printf 'note\n' >"$repo/note"; git -C "$repo" add note; git -C "$repo" commit -qm neutral
printf 'limit=0\n' >"$repo/config"; git -C "$repo" commit -qam regression; culprit="$(git -C "$repo" rev-parse HEAD)"
printf 'later\n' >>"$repo/note"; git -C "$repo" commit -qam later; bad="$(git -C "$repo" rev-parse HEAD)"
printf '%s\n' '#!/bin/sh' 'grep -q "limit=0" config && exit 1' 'exit 0' >"$repo/oracle.sh"; chmod +x "$repo/oracle.sh"
git -C "$repo" bisect start "$bad" "$good" >/dev/null; git -C "$repo" bisect run ./oracle.sh >/dev/null
test "$(git -C "$repo" rev-parse refs/bisect/bad)" = "$culprit"; git -C "$repo" bisect reset >/dev/null` },
    { lang: "bash", purpose: "Usa blame e pickaxe para recuperar contexto de linha movida sem tratar autor como causa.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT; git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'reserve=true\nlimit=1\n' >"$repo/config"; git -C "$repo" add config; git -C "$repo" commit -qm 'introduce reserve'; introduced="$(git -C "$repo" rev-parse HEAD)"
mkdir "$repo/settings"; git -C "$repo" mv config settings/app.conf; git -C "$repo" commit -qm 'move config'
found="$(git -C "$repo" log --all -S'reserve=true' --format=%H -- settings/app.conf config | tail -n 1)"
test "$found" = "$introduced"
git -C "$repo" blame -w -M -- settings/app.conf | grep -F 'reserve=true' >/dev/null` },
  ],
  "Reflog, fsck e objetos perdidos": [
    { lang: "bash", purpose: "Recupera branch apagada pelo reflog sem resetar sobre o trabalho corrente.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT; git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'base\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" commit -qm base
git -C "$repo" switch -qc lost; printf 'valuable\n' >"$repo/value"; git -C "$repo" add value; git -C "$repo" commit -qm valuable; lost="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" switch -q main; git -C "$repo" branch -D lost >/dev/null
git -C "$repo" reflog --all --format=%H | grep -F "$lost" >/dev/null
git -C "$repo" branch recovery/incident "$lost"
test "$(git -C "$repo" show recovery/incident:value)" = valuable; git -C "$repo" fsck --full >/dev/null` },
    { lang: "bash", purpose: "Corrompe somente uma cópia descartável e confirma que fsck detecta object alterado.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; git init -q -b main "$root/source"; git -C "$root/source" config user.name Test; git -C "$root/source" config user.email test@example.invalid
printf 'integrity\n' >"$root/source/f"; git -C "$root/source" add f; git -C "$root/source" commit -qm base; blob="$(git -C "$root/source" rev-parse HEAD:f)"
cp -R "$root/source" "$root/copy"; object="$root/copy/.git/objects/$(printf '%s' "$blob" | cut -c1-2)/$(printf '%s' "$blob" | cut -c3-)"
test -f "$object"; chmod u+w "$object"; printf 'corrupt' >"$object"
git -C "$root/copy" fsck --full >/dev/null 2>&1 && exit 1 || true
git -C "$root/source" fsck --full --no-dangling >/dev/null` },
  ],
  "Backups, bundles e disaster recovery": [
    { lang: "bash", purpose: "Cria bundle completo, verifica checksum e restaura branches e annotated tag em diretório vazio.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; git init -q -b main "$root/source"; git -C "$root/source" config user.name Test; git -C "$root/source" config user.email test@example.invalid
printf 'base\n' >"$root/source/f"; git -C "$root/source" add f; git -C "$root/source" commit -qm base; git -C "$root/source" branch release; git -C "$root/source" tag -a v1 -m release
git -C "$root/source" bundle create "$root/backup.bundle" --all; git -C "$root/source" bundle verify "$root/backup.bundle" >/dev/null; sha256sum "$root/backup.bundle" >"$root/backup.sha256"; (cd "$root" && sha256sum -c backup.sha256 >/dev/null)
git init -q "$root/restored"; git -C "$root/restored" fetch -q "$root/backup.bundle" 'refs/heads/*:refs/heads/*' 'refs/tags/*:refs/tags/*'; git -C "$root/restored" fsck --full --no-dangling >/dev/null
git -C "$root/restored" show-ref --verify refs/heads/main >/dev/null; git -C "$root/restored" show-ref --verify refs/tags/v1 >/dev/null
test "$(git -C "$root/restored" show v1^{commit}:f)" = base` },
    { lang: "bash", purpose: "Cria mirror manifestado e prova restauração seletiva sem mirror push destrutivo.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; git init -q --bare "$root/origin.git"; git init -q -b main "$root/work"; git -C "$root/work" config user.name Test; git -C "$root/work" config user.email test@example.invalid
printf 'source\n' >"$root/work/f"; git -C "$root/work" add f; git -C "$root/work" commit -qm source; git -C "$root/work" branch release; git -C "$root/work" push -q "$root/origin.git" main release
git clone -q --mirror "$root/origin.git" "$root/backup.git"; git --git-dir="$root/backup.git" show-ref | sort >"$root/refs.manifest"; git --git-dir="$root/backup.git" fsck --full --no-dangling >/dev/null
git init -q --bare "$root/restore.git"; git --git-dir="$root/backup.git" push -q "$root/restore.git" refs/heads/main:refs/heads/main refs/heads/release:refs/heads/release
test "$(git --git-dir="$root/restore.git" show main:f)" = source; test "$(wc -l <"$root/refs.manifest" | tr -d ' ')" -eq 2` },
  ],
  "Incidentes e cadeia de custódia": [
    { lang: "bash", purpose: "Preserva refs e bundle com manifest de hashes antes de qualquer recuperação mutável.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; git init -q -b main "$root/repo"; git -C "$root/repo" config user.name Test; git -C "$root/repo" config user.email test@example.invalid
printf 'evidence\n' >"$root/repo/f"; git -C "$root/repo" add f; git -C "$root/repo" commit -qm evidence
mkdir "$root/evidence"; git -C "$root/repo" show-ref >"$root/evidence/refs.txt"; git -C "$root/repo" bundle create "$root/evidence/repo.bundle" --all
(cd "$root/evidence" && sha256sum refs.txt repo.bundle > MANIFEST.sha256 && sha256sum -c MANIFEST.sha256 >/dev/null)
chmod -w "$root/evidence/refs.txt" "$root/evidence/repo.bundle" "$root/evidence/MANIFEST.sha256"
test "$(wc -l <"$root/evidence/MANIFEST.sha256" | tr -d ' ')" -eq 2` },
    { lang: "bash", purpose: "Constrói timeline UTC estruturada e valida ordem, IDs e ausência de credencial no registro.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; timeline="$root/timeline.json"
printf '%s\n' '[{"at":"2026-09-19T12:00:00Z","event":"detected","id":"run-42"},{"at":"2026-09-19T12:03:00Z","event":"credential-revoked","id":"cred-7"},{"at":"2026-09-19T12:10:00Z","event":"refs-preserved","id":"bundle-9"}]' >"$timeline"
node -e 'const fs=require("fs");const xs=JSON.parse(fs.readFileSync(process.argv[1]));if(xs.length!==3||xs.some(x=>!x.at.endsWith("Z")||!x.event||!x.id))process.exit(1);for(let i=1;i<xs.length;i++)if(xs[i].at<xs[i-1].at)process.exit(1)' "$timeline"
if grep -Ei '(ghp_|github_pat_|password|private.key)' "$timeline"; then exit 1; fi` },
  ],
  "Trunk, GitFlow e estratégia de branches": [
    { lang: "bash", purpose: "Aplica hotfix na linha de release e faz forward-port explícito para trunk preservando ancestry.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT; git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'v1\n' >"$repo/app"; git -C "$repo" add app; git -C "$repo" commit -qm v1; git -C "$repo" branch release/1
printf 'v2 work\n' >>"$repo/app"; git -C "$repo" commit -qam trunk
git -C "$repo" switch -q release/1; printf 'fix\n' >"$repo/fix"; git -C "$repo" add fix; git -C "$repo" commit -qm hotfix; hotfix="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" switch -q main; git -C "$repo" cherry-pick "$hotfix" >/dev/null; forward="$(git -C "$repo" rev-parse HEAD)"
test "$hotfix" != "$forward"; test "$(git -C "$repo" show HEAD:fix)" = fix
git -C "$repo" log -1 --format=%B | grep -F 'hotfix' >/dev/null` },
    { lang: "bash", purpose: "Valida que uma branch curta permanece um commit à frente e baseada no trunk observado.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT; git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'base\n' >"$repo/f"; git -C "$repo" add f; git -C "$repo" commit -qm base; base="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" switch -qc feature; printf 'flag=false\n' >"$repo/flags"; git -C "$repo" add flags; git -C "$repo" commit -qm 'add disabled flag'
test "$(git -C "$repo" merge-base main feature)" = "$base"
test "$(git -C "$repo" rev-list --count main..feature)" -eq 1
test "$(git -C "$repo" rev-list --count feature..main)" -eq 0` },
  ],
  "Commits, PRs e definição de pronto": [
    { lang: "bash", purpose: "Valida evidence de PR vinculada ao SHA atual e rejeita placeholders na definição de pronto.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; evidence="$root/pr.json"
printf '%s\n' '{"head":"abc123","tested":"abc123","risk":"database-concurrency","checks":["unit","two-session-db","mutation"],"migration":"expand-contract","rollback":"artifact sha256:fixture"}' >"$evidence"
node -e 'const fs=require("fs");const p=JSON.parse(fs.readFileSync(process.argv[1]));const required=["unit","two-session-db","mutation"];if(p.head!==p.tested||required.some(x=>!p.checks.includes(x))||!p.migration||!p.rollback||Object.values(p).includes("TODO"))process.exit(1)' "$evidence"
if grep -E 'TODO|TBD|N/?A' "$evidence"; then exit 1; fi` },
    { lang: "bash", purpose: "Cria dois commits atômicos e prova que cada snapshot contém código e teste correspondentes.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT; git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'v1\n' >"$repo/code"; printf 'test-v1\n' >"$repo/test"; git -C "$repo" add code test; git -C "$repo" commit -qm baseline
printf 'v2\n' >"$repo/code"; printf 'test-v2\n' >"$repo/test"; git -C "$repo" add code test; git -C "$repo" commit -qm 'change behavior with regression'
current="$(git -C "$repo" rev-parse HEAD)"; parent="$(git -C "$repo" rev-parse HEAD^)"
test "$(git -C "$repo" show "$current":code)" = v2; test "$(git -C "$repo" show "$current":test)" = test-v2
test "$(git -C "$repo" show "$parent":code)" = v1; test "$(git -C "$repo" show "$parent":test)" = test-v1` },
  ],
  "Merge queue, bots e políticas": [
    { lang: "bash", purpose: "Constrói candidato integrado de dois heads e detecta conflito semântico ausente nos testes isolados.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT; git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'capacity=2\n' >"$repo/config"; git -C "$repo" add config; git -C "$repo" commit -qm base
git -C "$repo" switch -qc a; printf 'worker_a=2\n' >"$repo/a"; git -C "$repo" add a; git -C "$repo" commit -qm a
git -C "$repo" switch -q main; git -C "$repo" switch -qc b; printf 'worker_b=2\n' >"$repo/b"; git -C "$repo" add b; git -C "$repo" commit -qm b
git -C "$repo" switch -q main; git -C "$repo" merge -q --no-ff -m a a; git -C "$repo" merge -q --no-ff -m b b
a="$(cut -d= -f2 "$repo/a")"; b="$(cut -d= -f2 "$repo/b")"; capacity="$(cut -d= -f2 "$repo/config")"
test "$a" -le "$capacity"; test "$b" -le "$capacity"; test "$((a+b))" -gt "$capacity"` },
    { lang: "bash", purpose: "Processa delivery duplicada por marker e recusa ação quando o SHA esperado ficou stale.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; state="$root/comments"
delivery='delivery-42'; marker="bot:v1:$delivery"; expected='abc123'; current='abc123'
test "$expected" = "$current"; grep -Fqx "$marker" "$state" 2>/dev/null || printf '%s\n' "$marker" >>"$state"
grep -Fqx "$marker" "$state" 2>/dev/null || printf '%s\n' "$marker" >>"$state"
test "$(grep -Fxc "$marker" "$state")" -eq 1
current='def456'; test "$expected" != "$current"` },
  ],
  "Métricas, auditoria e melhoria": [
    { lang: "bash", purpose: "Deduplica eventos e calcula lead time por cohort sem misturar bots e mudanças humanas.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; data="$root/events.json"
printf '%s\n' '[{"id":"e1","pr":1,"actor":"human","kind":"code","opened":0,"deployed":10},{"id":"e1","pr":1,"actor":"human","kind":"code","opened":0,"deployed":10},{"id":"e2","pr":2,"actor":"bot","kind":"dependency","opened":2,"deployed":7},{"id":"e3","pr":3,"actor":"human","kind":"docs","opened":3,"deployed":5}]' >"$data"
node -e 'const fs=require("fs");const xs=JSON.parse(fs.readFileSync(process.argv[1]));const unique=[...new Map(xs.map(x=>[x.id,x])).values()];const code=unique.filter(x=>x.actor==="human"&&x.kind==="code");if(unique.length!==3||code.length!==1||code[0].deployed-code[0].opened!==10)process.exit(1)' "$data"` },
    { lang: "bash", purpose: "Seleciona amostra estratificada de exceptions e valida evidence do SHA revisado.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; sample="$root/audit.json"
printf '%s\n' '[{"pr":10,"risk":"high","head":"aaa","checked":"aaa","bypass":true,"reason":"incident-7"},{"pr":11,"risk":"low","head":"bbb","checked":"bbb","bypass":false,"reason":null}]' >"$sample"
node -e 'const fs=require("fs");const xs=JSON.parse(fs.readFileSync(process.argv[1]));if(!xs.some(x=>x.risk==="high"&&x.bypass)||xs.some(x=>x.head!==x.checked)||xs.some(x=>x.bypass&&!x.reason))process.exit(1)' "$sample"
test "$(grep -o '"pr"' "$sample" | wc -l | tr -d ' ')" -eq 2` },
  ],
  "Repository baseline do Quíron": [
    { lang: "bash", purpose: "Cria baseline mínimo e prova que clone limpo preserva attributes, ignore, ownership e bootstrap.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; repo="$root/source"; git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
mkdir -p "$repo/.github/workflows"; printf '* text=auto eol=lf\n*.bin -text\n' >"$repo/.gitattributes"; printf '.env\ndist/\n' >"$repo/.gitignore"
printf '%s\n' '* @chiron/core' '/.github/workflows/ @chiron/platform' >"$repo/CODEOWNERS"; printf '# Quíron\n\nRun: ./verify.sh\n' >"$repo/README.md"
printf '%s\n' '#!/bin/sh' 'set -eu' 'test -f .gitattributes' 'test -f CODEOWNERS' >"$repo/verify.sh"; chmod +x "$repo/verify.sh"
git -C "$repo" add .; git -C "$repo" commit -qm baseline; git clone -q "$repo" "$root/clone"
(cd "$root/clone" && ./verify.sh); test -z "$(git -C "$root/clone" status --porcelain)"; git -C "$root/clone" check-ignore -q .env` },
    { lang: "bash", purpose: "Isola configuração global e prova que identidade/line endings do clone não dependem da máquina autora.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; export HOME="$root/home"; mkdir -p "$HOME"; git init -q -b main "$root/repo"
printf '* text=auto eol=lf\n' >"$root/repo/.gitattributes"; printf 'line1\r\nline2\r\n' >"$root/repo/file"
git -C "$root/repo" config user.name Chiron; git -C "$root/repo" config user.email chiron@example.invalid; git -C "$root/repo" add .
test "$(git -C "$root/repo" show :file | tr -d '\r')" = $'line1\nline2'
test "$(git -C "$root/repo" config --global --get user.name || true)" = ''
test "$(git -C "$root/repo" config --local --get user.name)" = Chiron` },
  ],
  "PR da última vaga": [
    { lang: "bash", purpose: "Valida evidence do PR de concorrência com engine, duas sessões, mutante e SHA do candidato.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; file="$root/evidence.json"
printf '%s\n' '{"head":"merge-group-abc","tested":"merge-group-abc","engine":"postgresql-18","sessions":2,"barrier":true,"winnerCount":1,"effectCount":1,"mutants":["no-atomic-predicate","no-unique-constraint","no-outbox-dedupe"],"pending":[]}' >"$file"
node -e 'const fs=require("fs");const e=JSON.parse(fs.readFileSync(process.argv[1]));if(e.head!==e.tested||e.sessions<2||!e.barrier||e.winnerCount!==1||e.effectCount!==1||e.mutants.length<3||e.pending.length)process.exit(1)' "$file"` },
    { lang: "bash", purpose: "Mantém commits de schema e aplicação revisáveis e confirma o range exato do PR.", code: `set -euo pipefail
repo="$(mktemp -d)"; trap 'rm -rf "$repo"' EXIT; git init -q -b main "$repo"; git -C "$repo" config user.name Test; git -C "$repo" config user.email test@example.invalid
printf 'schema-v1\n' >"$repo/schema"; git -C "$repo" add schema; git -C "$repo" commit -qm baseline; base="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" switch -qc last-seat; printf 'constraint=capacity_nonnegative\n' >>"$repo/schema"; git -C "$repo" commit -qam 'Expand reservation constraint'
printf 'update=conditional\n' >"$repo/service"; git -C "$repo" add service; git -C "$repo" commit -qm 'Reserve capacity atomically'; head="$(git -C "$repo" rev-parse HEAD)"
test "$(git -C "$repo" rev-list --count "$base..$head")" -eq 2
test "$(git -C "$repo" diff --name-only "$base...$head" | sort | tr '\n' ' ')" = 'schema service '
git -C "$repo" merge-base --is-ancestor "$base" "$head"` },
  ],
  "Release segura e rastreável": [
    { lang: "bash", purpose: "Assina tag, produz artifact determinístico e liga target, manifest e digest na cadeia local.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; ssh-keygen -q -t ed25519 -N '' -C release@example.invalid -f "$root/key"; printf 'release@example.invalid %s\n' "$(cat "$root/key.pub")" >"$root/allowed"
git init -q -b main "$root/repo"; git -C "$root/repo" config user.name Release; git -C "$root/repo" config user.email release@example.invalid; git -C "$root/repo" config gpg.format ssh; git -C "$root/repo" config user.signingkey "$root/key"; git -C "$root/repo" config gpg.ssh.allowedSignersFile "$root/allowed"
printf 'quiron-release\n' >"$root/repo/app"; git -C "$root/repo" add app; git -C "$root/repo" commit -qm release; commit="$(git -C "$root/repo" rev-parse HEAD)"; git -C "$root/repo" tag -s v1.0.0 -m release; git -C "$root/repo" verify-tag v1.0.0 >/dev/null
tar --sort=name --mtime='UTC 2020-01-01' --owner=0 --group=0 --numeric-owner -cf "$root/chiron.tar" -C "$root/repo" app; digest="$(sha256sum "$root/chiron.tar" | cut -d' ' -f1)"
printf '%s %s %s\n' "$commit" "$digest" 'chiron.tar' >"$root/manifest"; test "$(awk '{print $1}' "$root/manifest")" = "$(git -C "$root/repo" rev-parse 'v1.0.0^{commit}')"` },
    { lang: "bash", purpose: "Recusa promoção de artifact alterado e mantém o digest aprovado como identidade.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; printf 'approved-bytes\n' >"$root/artifact"; approved="$(sha256sum "$root/artifact" | cut -d' ' -f1)"
cp "$root/artifact" "$root/promoted"; test "$(sha256sum "$root/promoted" | cut -d' ' -f1)" = "$approved"
printf 'rebuilt\n' >"$root/rebuilt"; rebuilt="$(sha256sum "$root/rebuilt" | cut -d' ' -f1)"; test "$rebuilt" != "$approved"
printf '%s\n' "$approved" >"$root/deployment.digest"; test "$(cat "$root/deployment.digest")" = "$approved"` },
  ],
  "Banca, incidente e restore Git": [
    { lang: "bash", purpose: "Preserva bundle e restaura refs em destino novo, verificando árvore e tag da banca.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; git init -q -b main "$root/source"; git -C "$root/source" config user.name Test; git -C "$root/source" config user.email test@example.invalid
printf 'quiron\n' >"$root/source/app"; git -C "$root/source" add app; git -C "$root/source" commit -qm baseline; git -C "$root/source" tag -a accepted -m accepted; tree="$(git -C "$root/source" rev-parse HEAD^{tree})"
git -C "$root/source" bundle create "$root/evidence.bundle" --all; sha256sum "$root/evidence.bundle" >"$root/evidence.sha256"; (cd "$root" && sha256sum -c evidence.sha256 >/dev/null)
git init -q "$root/restore"; git -C "$root/restore" fetch -q "$root/evidence.bundle" 'refs/heads/*:refs/heads/*' 'refs/tags/*:refs/tags/*'
test "$(git -C "$root/restore" rev-parse refs/heads/main^{tree})" = "$tree"; test "$(git -C "$root/restore" show accepted^{commit}:app)" = quiron
git -C "$root/restore" fsck --full --no-dangling >/dev/null` },
    { lang: "bash", purpose: "Audita matriz final de gates e impede aprovação quando qualquer fronteira obrigatória está Pending.", code: `set -euo pipefail
root="$(mktemp -d)"; trap 'rm -rf "$root"' EXIT; matrix="$root/gates.json"
printf '%s\n' '[{"gate":"git-refs-bundle","status":"passed","evidence":"bundle-42"},{"gate":"github-rules-audit","status":"passed","evidence":"sandbox-run-7"},{"gate":"database-last-seat","status":"passed","evidence":"db-run-9"},{"gate":"provider-effect","status":"passed","evidence":"provider-run-3"}]' >"$matrix"
node -e 'const fs=require("fs");const xs=JSON.parse(fs.readFileSync(process.argv[1]));const need=["git-refs-bundle","github-rules-audit","database-last-seat","provider-effect"];if(need.some(g=>!xs.some(x=>x.gate===g&&x.status==="passed"&&x.evidence))||xs.some(x=>x.status==="pending"))process.exit(1)' "$matrix"
test "$(grep -o '"status":"passed"' "$matrix" | wc -l | tr -d ' ')" -eq 4` },
  ],
};
