export type OracleCloudLevel = "basico" | "intermediario" | "avancado";
export type OracleCloudLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type OracleCloudChapter = readonly [title: string, level: OracleCloudLevel, primer: string, lessons: readonly OracleCloudLesson[]];

/** Oracle Cloud curriculum; OCI tenancy, account, provider and data-plane claims require an isolated sandbox. */
export const ORACLE_CLOUD_CURRICULUM: readonly OracleCloudChapter[] = [
  [
    "1. Tenancy, regiões e governança",
    "basico",
    "Este capítulo integra 1. Tenancy, regiões e governança ao contrato operacional do Quíron: fonte de verdade, identidade mínima, evidência e recuperação verificável.",
    [
      [
        "Tenancy, compartments e ownership",
        "Tenancy, compartments e ownership exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Regiões, availability domains e fault domains",
        "Regiões, availability domains e fault domains exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Tags, cost tracking e policies organizacionais",
        "Tags, cost tracking e policies organizacionais exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Landing zone e baseline do Quíron",
        "Landing zone e baseline do Quíron exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ]
    ]
  ],
  [
    "2. IAM e identidade",
    "basico",
    "Este capítulo integra 2. IAM e identidade ao contrato operacional do Quíron: fonte de verdade, identidade mínima, evidência e recuperação verificável.",
    [
      [
        "Users, groups e least privilege",
        "Users, groups e least privilege exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Policies e dynamic groups",
        "Policies e dynamic groups exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Federation, MFA e break-glass",
        "Federation, MFA e break-glass exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "API keys, auth tokens e revoke",
        "API keys, auth tokens e revoke exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ]
    ]
  ],
  [
    "3. Rede e conectividade",
    "basico",
    "Este capítulo integra 3. Rede e conectividade ao contrato operacional do Quíron: fonte de verdade, identidade mínima, evidência e recuperação verificável.",
    [
      [
        "VCN, subnets e route tables",
        "VCN, subnets e route tables exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Security lists, NSGs e microsegmentação",
        "Security lists, NSGs e microsegmentação exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Gateways e DNS",
        "Gateways e DNS exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "VPN, FastConnect e desenho híbrido",
        "VPN, FastConnect e desenho híbrido exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ]
    ]
  ],
  [
    "4. Compute e imagens",
    "intermediario",
    "Este capítulo integra 4. Compute e imagens ao contrato operacional do Quíron: fonte de verdade, identidade mínima, evidência e recuperação verificável.",
    [
      [
        "Shapes, capacity e placement",
        "Shapes, capacity e placement exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Images, cloud-init e bootstrap seguro",
        "Images, cloud-init e bootstrap seguro exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Instance pools, autoscaling e health",
        "Instance pools, autoscaling e health exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Patching, bastion e acesso operacional",
        "Patching, bastion e acesso operacional exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ]
    ]
  ],
  [
    "5. Storage e dados",
    "intermediario",
    "Este capítulo integra 5. Storage e dados ao contrato operacional do Quíron: fonte de verdade, identidade mínima, evidência e recuperação verificável.",
    [
      [
        "Block volumes e backups",
        "Block volumes e backups exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Object Storage e lifecycle",
        "Object Storage e lifecycle exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "File Storage e compartilhamento",
        "File Storage e compartilhamento exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Data transfer e integridade",
        "Data transfer e integridade exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ]
    ]
  ],
  [
    "6. Bancos e consistência",
    "intermediario",
    "Este capítulo integra 6. Bancos e consistência ao contrato operacional do Quíron: fonte de verdade, identidade mínima, evidência e recuperação verificável.",
    [
      [
        "Autonomous Database e conexão",
        "Autonomous Database e conexão exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Oracle Database service e operações",
        "Oracle Database service e operações exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Transactions, última vaga e idempotência",
        "Transactions, última vaga e idempotência exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Migration, restore e residência",
        "Migration, restore e residência exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ]
    ]
  ],
  [
    "7. Containers e serverless",
    "intermediario",
    "Este capítulo integra 7. Containers e serverless ao contrato operacional do Quíron: fonte de verdade, identidade mínima, evidência e recuperação verificável.",
    [
      [
        "Container Registry e supply chain",
        "Container Registry e supply chain exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "OKE clusters e nodes",
        "OKE clusters e nodes exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Kubernetes network e workload identity",
        "Kubernetes network e workload identity exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Functions e eventos",
        "Functions e eventos exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ]
    ]
  ],
  [
    "8. Load balancing, edge e entrega",
    "intermediario",
    "Este capítulo integra 8. Load balancing, edge e entrega ao contrato operacional do Quíron: fonte de verdade, identidade mínima, evidência e recuperação verificável.",
    [
      [
        "Load balancers e health checks",
        "Load balancers e health checks exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "API Gateway e autenticação",
        "API Gateway e autenticação exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "WAF, DDoS e bot controls",
        "WAF, DDoS e bot controls exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "CDN, cache e domains",
        "CDN, cache e domains exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ]
    ]
  ],
  [
    "9. Observabilidade e segurança",
    "avancado",
    "Este capítulo integra 9. Observabilidade e segurança ao contrato operacional do Quíron: fonte de verdade, identidade mínima, evidência e recuperação verificável.",
    [
      [
        "Logging, audit e retention",
        "Logging, audit e retention exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Metrics, alarms e SLO",
        "Metrics, alarms e SLO exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Cloud Guard, Vulnerability Scanning e Security Zones",
        "Cloud Guard, Vulnerability Scanning e Security Zones exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Incident, revoke e recovery",
        "Incident, revoke e recovery exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ]
    ]
  ],
  [
    "10. IaC, CI/CD e mudanças",
    "avancado",
    "Este capítulo integra 10. IaC, CI/CD e mudanças ao contrato operacional do Quíron: fonte de verdade, identidade mínima, evidência e recuperação verificável.",
    [
      [
        "Terraform e Resource Manager",
        "Terraform e Resource Manager exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "DevOps pipelines e artifacts",
        "DevOps pipelines e artifacts exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Change management e policy as code",
        "Change management e policy as code exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Rollback coordenado",
        "Rollback coordenado exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ]
    ]
  ],
  [
    "11. Custos, quotas e operação",
    "avancado",
    "Este capítulo integra 11. Custos, quotas e operação ao contrato operacional do Quíron: fonte de verdade, identidade mínima, evidência e recuperação verificável.",
    [
      [
        "Billing, budgets e forecasts",
        "Billing, budgets e forecasts exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Quotas, limits e capacity planning",
        "Quotas, limits e capacity planning exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Disaster recovery e game days",
        "Disaster recovery e game days exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Runbooks, support e operação diária",
        "Runbooks, support e operação diária exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ]
    ]
  ],
  [
    "12. Projeto Quíron na Oracle Cloud",
    "avancado",
    "Este capítulo integra 12. Projeto Quíron na Oracle Cloud ao contrato operacional do Quíron: fonte de verdade, identidade mínima, evidência e recuperação verificável.",
    [
      [
        "Baseline Quíron e landing zone",
        "Baseline Quíron e landing zone exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Reserva concorrente e dados autoritativos",
        "Reserva concorrente e dados autoritativos exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Release segura e jornada externa",
        "Release segura e jornada externa exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ],
      [
        "Banca de incidente e restore",
        "Banca de incidente e restore exige limite explícito, owner e evidência que não dependa de uma tela de console",
        "manifest versionado, política mínima, probe positivo/negativo, observação redigida e reconciliação",
        "uma mudança não rastreada aparentou sucesso mas ampliou acesso, duplicou efeito ou impediu recuperação"
      ]
    ]
  ]
] as const;

