# Ubuntu / Linux — evidência e limites (2026-10-01)

Fonte integrada: `ubuntuLinux.ts`. Currículo original preservado em 12 capítulos/48 seções. Prosa autoral em `ubuntuLinuxProse01.ts` a `ubuntuLinuxProse12.ts`, reunida por `ubuntuLinuxAuthoredProse.ts`; exemplos e avaliações têm arquivos próprios. Os dois rascunhos anteriores permanecem como histórico e não são importados pelo seed. Não houve instalação de infraestrutura, alteração de thresholds, restart de serviço, mudança de conta, mount, firewall ou policy do host.

## Corpus e auditoria

12 capítulos, 48 seções, 33.743 palavras de prosa, piso observado de 676 palavras por seção (piso contratual continua 600), 96 blocos de código únicos, 36 exercícios específicos de design/risco/fluxo e 48 flashcards. Cada seção contém `porque` e `quebraria`; a última referencia `agora/reserva-estoque-concorrencia`.

`ubuntuLinux.test.ts` materializa a fonte, exige cardinalidades e chaves exatas, aplica `checkChapter`, `checkSource` e `checkEditorialSource`: zero violações; similaridade máxima de seções 0,430416% (<42%), cards 0% (<78%), exercícios detalhados 100% (≥65%), código duplicado zero. O gate de n-gramas mede repetição textual; não substitui revisão de semântica e escopo. Prosa, captions e avaliações foram revisados para distinguir modelo e mecanismo real.

`scripts/ubuntu-linux-editorial-evidence.json` conserva contagens por seção e violações. `scripts/ubuntu-linux-evidence.json` conserva por exemplo ID, SHA-256 do texto executado, escopo, status sintático, status de execução, duração e saída, mais versões e gates operacionais.

## Execução real, sem extrapolar escopo

Os 96 exemplos passaram parsing e execução em processos separados e diretórios temporários: 40 `local-real`, 53 `model`, 3 `native-config`. Bash usa `bash -n` antes de execução; Python usa AST antes de execução com assertions ativas. O runner WSL é assíncrono para não bloquear RPC de Vitest; cada snippet tem timeout e cwd próprio. Rede usa somente loopback com porta efêmera. Threads, processos, locks, arquivos, hashes, archives e consultas são realmente exercitados quando indicados. Modelos usam fixtures e não são dados retornados por serviços externos.

Ambiente observado: Ubuntu 24.04.4 LTS já existente no WSL2, kernel `6.18.33.2-microsoft-standard-WSL2`, Python 3.12.3, Bash 5.2.21, systemd 255.4-1ubuntu8.12, cloud-init 25.2-0ubuntu1~24.04.1 e PID 1 systemd. O runner depende desse WSL e dessas ferramentas; falha se faltarem, sem download ou skip silencioso.

As três verificações nativas são `systemd-analyze verify`, `systemd-analyze calendar` e `cloud-init schema`. Aprovam configuração/calendário, não start, timer disparado, boot de VM ou readiness. A attestation `examplesVerified` cobre os snippets publicados com seus captions e escopos. Não representa certificação de um servidor ou da stack Quíron completa.

## Gates operacionais Pending

| Fronteira | Prova que ainda exige ambiente isolado |
|---|---|
| Firmware/GRUB/initramfs/console | Boot convencional e recuperação com console independente |
| systemd em execução | Start, readiness, restrições, shutdown, timer e efeitos |
| Rede/DNS/firewall/proxy/TLS | Topologia, caminho permitido e negado, handshake e propagação |
| Partições/LVM/ext4/XFS | Dispositivos descartáveis, integridade e crash recovery |
| Contas/sudo/PAM/MFA/capabilities/LSM | Credenciais e policy reais, tentativas no contexto correto |
| Containers/cgroups/rootless | Runtime, mappings, limites aplicados e enforcement |
| HA/fencing/broker/banco/outbox | Instâncias e storage duráveis, partição, kill points e replay |
| Cloud/Ansible/CI/deploy | Plataformas autorizadas, alvos reais e cadeia de promoção |
| Serviço/restore/RPO/RTO/paging | Dados representativos, reconciliação, alerta e game day |

Modelo que rejeita entrada comprova somente sua regra. Arquivo restaurado comprova restore daquela fixture. Lock de threads não comprova exclusão entre hosts; maioria aritmética não implementa consenso; hash não prova autenticidade sozinho. Não substituir esses gates por saídas fabricadas, parser, manifesto, mock ou dashboard.

## Reprodução

No PowerShell deste workspace:

```powershell
$env:CHIRON_WRITE_UBUNTU_EVIDENCE = '1'
pnpm exec vitest run src/lib/study/seeds/content/ubuntuLinux.examples.test.ts src/lib/study/seeds/content/ubuntuLinux.test.ts --maxWorkers=1
Remove-Item Env:CHIRON_WRITE_UBUNTU_EVIDENCE
pnpm exec vitest run src/lib/study/seeds/index.test.ts --maxWorkers=1
pnpm typecheck
pnpm build
```

Corpus/editorial 98/98; integração/editorial 8/8; typecheck e build/PWA verdes. Suíte global `pnpm exec vitest run --maxWorkers=2 --reporter=dot`: 91 arquivos/857 testes aprovados, 5 arquivos/19 testes skipped preexistentes, duração 208,42 s. Ubuntu/Linux sem skips. Build: principal 5.766,32 kB, 27 entradas e 42.736,07 KiB de precache. Permanecem warnings conhecidos de chunks e import estático/dinâmico do Supabase. Nenhum limite de bundle ou editorial foi alterado.

## Referências consultadas

Quoting: [manual oficial Bash](https://www.gnu.org/software/bash/manual/html_node/Quoting.html). SSH: [Ubuntu OpenSSH Server](https://ubuntu.com/server/docs/how-to/security/openssh-server/). Recursos: [kernel cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html). Perfis: [Ubuntu AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/index.html). Atualizações: [Ubuntu Security Updates](https://documentation.ubuntu.com/security/security-updates/). A consulta web de systemd.unit retornou HTTP 403; não foi apresentada como consulta bem-sucedida. O parsing nativo local foi executado e está no relatório.
