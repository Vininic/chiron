# Ubuntu / Linux — currículo em rascunho não materializado

## Sistema, boot e distribuição
- Kernel, user space e init
- Boot, systemd e targets
- Pacotes, repositórios e proveniência
- Filesystem hierarchy e ownership

## Shell e automação segura
- Bash, quoting e expansão
- Processos, signals e jobs
- Pipes, redirection e status
- Scripts idempotentes e logs

## Usuários, permissões e acesso
- Users, groups e sudo
- ACLs, umask e capabilities
- SSH, chaves e bastion
- PAM, MFA e break-glass

## Rede e serviços
- IP, DNS e rotas
- Sockets, ports e firewall
- systemd services e timers
- Reverse proxy e TLS

## Armazenamento e integridade
- Partições, LVM e mounts
- ext4, XFS e permissões
- Backups, restore e retenção
- Logs, journal e rotação

## Observabilidade e desempenho
- CPU, memória e load
- Disco, I/O e inode pressure
- Rede, conexões e latência
- Métricas, alertas e SLO

## Containers e isolamento
- Namespaces, cgroups e limits
- Rootless e user namespaces
- Seccomp, AppArmor e SELinux
- Imagens, volumes e runtime

## Segurança e patching
- Atualizações e rollback
- Hardening e baseline
- Secrets, cryptography e audit
- Vulnerabilidades e resposta

## Operação distribuída
- NTP, DNS e configuração
- HA, quorum e fencing
- Filas, workers e backpressure
- Incidentes e comunicação

## Infraestrutura como código
- Cloud-init e imagens
- Ansible e estado desejado
- CI, artifacts e promoção
- Drift, approval e rollback

## Recuperação e continuidade
- RPO, RTO e topology
- Restore de serviço e dados
- Game days e evidência
- Postmortem e ações verificáveis

## Projeto Quíron no Linux
- Baseline de host e deploy
- Reserva concorrente e outbox
- Release, canary e observação
- Banca de incidente e restore

