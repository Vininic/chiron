import type { ChapterLevel } from "@/lib/study/types";
export interface UbuntuLinuxChapter { title: string; level: ChapterLevel; sections: string[] }
export const UBUNTU_LINUX_CURRICULUM: UbuntuLinuxChapter[] = [
  { title: "Sistema, boot e distribuição", level: "basico", sections: ["Kernel, user space e init", "Boot, systemd e targets", "Pacotes, repositórios e proveniência", "Filesystem hierarchy e ownership"] },
  { title: "Shell e automação segura", level: "basico", sections: ["Bash, quoting e expansão", "Processos, signals e jobs", "Pipes, redirection e status", "Scripts idempotentes e logs"] },
  { title: "Usuários, permissões e acesso", level: "basico", sections: ["Users, groups e sudo", "ACLs, umask e capabilities", "SSH, chaves e bastion", "PAM, MFA e break-glass"] },
  { title: "Rede e serviços", level: "intermediario", sections: ["IP, DNS e rotas", "Sockets, ports e firewall", "systemd services e timers", "Reverse proxy e TLS"] },
  { title: "Armazenamento e integridade", level: "intermediario", sections: ["Partições, LVM e mounts", "ext4, XFS e permissões", "Backups, restore e retenção", "Logs, journal e rotação"] },
  { title: "Observabilidade e desempenho", level: "intermediario", sections: ["CPU, memória e load", "Disco, I/O e inode pressure", "Rede, conexões e latência", "Métricas, alertas e SLO"] },
  { title: "Containers e isolamento", level: "avancado", sections: ["Namespaces, cgroups e limits", "Rootless e user namespaces", "Seccomp, AppArmor e SELinux", "Imagens, volumes e runtime"] },
  { title: "Segurança e patching", level: "avancado", sections: ["Atualizações e rollback", "Hardening e baseline", "Secrets, cryptography e audit", "Vulnerabilidades e resposta"] },
  { title: "Operação distribuída", level: "avancado", sections: ["NTP, DNS e configuração", "HA, quorum e fencing", "Filas, workers e backpressure", "Incidentes e comunicação"] },
  { title: "Infraestrutura como código", level: "avancado", sections: ["Cloud-init e imagens", "Ansible e estado desejado", "CI, artifacts e promoção", "Drift, approval e rollback"] },
  { title: "Recuperação e continuidade", level: "avancado", sections: ["RPO, RTO e topology", "Restore de serviço e dados", "Game days e evidência", "Postmortem e ações verificáveis"] },
  { title: "Projeto Quíron no Linux", level: "avancado", sections: ["Baseline de host e deploy", "Reserva concorrente e outbox", "Release, canary e observação", "Banca de incidente e restore"] },
];
