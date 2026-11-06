# Ubuntu / Linux — Sistema, boot e distribuição — rascunho não materializado

## Kernel, user space e init

Ubuntu é uma distribuição que reúne kernel Linux, bibliotecas, ferramentas de user space, serviços, repositórios e política de atualização. Separar essas camadas é operacionalmente importante: o kernel media processos, memória, rede, dispositivos e sistemas de arquivos; já a aplicação conversa com interfaces de sistema e serviços cujo ciclo pode mudar sem trocar o kernel. Um host saudável não é o que responde a um único comando, mas o que apresenta versão, arquitetura, origem de pacotes, units ativas, mounts, tempo e identidade de máquina coerentes com um inventário esperado. O baseline Quíron registra essa fotografia antes de qualquer mutação.

### Fonte de verdade do host

Inventário começa por `uname`, `/etc/os-release`, boot ID, kernel command line, tabela de mounts e versão dos pacotes críticos. Cada coleta recebe horário, hostname lógico, ambiente e digest do relatório. O hostname não autoriza acesso e não prova que a máquina é o alvo certo; a automação também valida chave de host, grupo de inventário e principal usado. Um mutante reaproveita IP de uma VM removida e executa patch no host errado. O aceite exige que preflight recuse identidade divergente antes de usar sudo, reiniciar serviço ou copiar arquivo.

### Systemd como plano de controle

PID 1 coordena units de serviço, socket, mount, target e timer. `systemctl is-active` é sinal estreito: processo ativo pode não estar pronto, pode escutar apenas loopback ou servir configuração antiga. Uma unit robusta declara dependências reais, usuário, diretórios graváveis, limites, restart policy e condição de readiness observável. Alterar unit exige `daemon-reload`, validação de sintaxe, restart controlado e confirmação independente do processo. O mutante edita arquivo em `/etc/systemd/system` e esquece reload; dashboard mantém verde porque a instância antiga continua executando. Evidence deve ligar source, drop-in efetivo, PID e probe externo.

### Falha, rollback e evidência

Boot é uma fronteira de recuperação, não uma ocasião para testar mudança arriscada sem plano. Antes de mexer em kernel, initramfs, fstab, GRUB, rede ou storage, o runbook define console disponível, janela, backup, último estado conhecido, critério de abortar e caminho de retorno. Uma entrada inválida em fstab pode bloquear boot; uma unit com dependência circular pode impedir alvo de subir. Em sandbox, a apostila testa parser, manifest e comando de consulta; boot, console e recuperação real ficam Pending sem host isolado. O relatório preserva antes/depois, exit status, journal redigido, probe negativo e cleanup.

## Boot, systemd e targets

O boot percorre firmware, boot loader, kernel, initramfs e PID 1; cada fase tem fontes de falha e ferramentas diferentes. O operador não deve tratar uma mensagem final de SSH como prova de boot íntegro, pois rede pode chegar antes de volumes, serviços de negócio ou sincronização de relógio. Targets descrevem conjuntos de units desejados; dependências ordenam apenas o que foi declarado. O baseline mede duração e falhas por etapa e ensaia acesso por console fora de banda para que um erro de rede não vire perda total de controle.

### Ordem e readiness

`After=` ordena e não cria requisito; `Requires=` pode propagar falha; `Wants=` expressa dependência fraca. Serviço que depende de banco precisa teste de conexão com timeout e retry limitado, não somente `network.target`. Um mutante usa `sleep 10` como readiness e passa em carga baixa, mas inicia antes de DNS ou volume durante reboot concorrente. O contrato declara sinal de pronto, janela, dependência, comportamento de falha e observador. A aceitação inclui reboot controlado no ambiente permitido, logs de unit e probe funcional que atravessa a fronteira correta.

### Recuperação segura

Rollback de configuração de boot preserva artefato anterior e não apaga a evidência da falha. A equipe mantém kernel conhecido, entry de boot, initramfs verificável e procedimento para selecionar versão anterior sem editar às pressas um filesystem montado de forma incerta. Mudança de target padrão ou máscara de unit precisa revisão porque pode impedir SSH, monitoramento ou agente de recuperação. O teste negativo remove uma dependência sintética e prova que a unit falha fechada, com mensagem acionável, sem loop infinito de restart. Repetir um comando até o host responder não substitui diagnosticar qual etapa recuperou.
