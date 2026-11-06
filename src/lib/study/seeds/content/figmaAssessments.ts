import type { ContentSource } from "./types";
import { FIGMA_CURRICULUM } from "./figmaCurriculum";
type Review = [question:string,answer:string,failure:string];
const REVIEWS: Review[] = [
  [
    "Por que nome de layer não basta para referência?",
    "Nome descreve papel; arquivo, node e revisão identificam o objeto pertinente, inclusive quando há cópias com rótulos iguais.",
    "Resolver por nome ou posição pode escolher exploração e quebrar vínculo com review."
  ],
  [
    "Como escolher frame ou group?",
    "Escolha pela responsabilidade de região e comportamento de layout, resize e clipping, inspecionando árvore e composição.",
    "Aparência igual num tamanho não prova comportamento; nome de frame não cria semântica HTML."
  ],
  [
    "Por que bounds precisam definição?",
    "Geometria local, bounds absolutos, área visual e região interativa podem divergir; indique contexto e transformação.",
    "Somar coordenadas ignorando rotação ou contar sombra como alvo produz medida sem significado correto."
  ],
  [
    "O que torna brief verificável?",
    "Objetivo, população, restrições e critérios com método e expectativa, além de fixtures de conteúdo e estado.",
    "Aprovar apenas aparência com sucesso fixo esconde recusa, desconhecido e conteúdo extremo."
  ],
  [
    "Qual diferença entre gap e padding?",
    "Gap separa filhos; padding separa conteúdo e borda. Direção e alinhamento organizam a relação dentro da região.",
    "Usar um para compensar outro cria comportamento frágil quando filhos aparecem ou conteúdo muda."
  ],
  [
    "Como interpretar Hug, Fill e Fixed?",
    "Considere eixo, pai, conteúdo e limites; Hug segue conteúdo, Fill espaço disponível e Fixed medida definida no contexto apropriado.",
    "Dependência circular ou mínimos que não cabem não são resolvidos por escolher modo sem observar resultado."
  ],
  [
    "Wrap equivale a grid ou guia?",
    "Wrap continua sequência em nova linha; grid usa tracks/células/spans; guias orientam alinhamento sem ser o mesmo mecanismo.",
    "Contar itens ou desenhar guias não prova cobertura, ordem e disposição responsiva."
  ],
  [
    "Clipping resolve overflow necessário?",
    "Ele limita visibilidade; informação obrigatória precisa permanecer acessível por composição ou interação adequada.",
    "Recortar ação ou foco pode esconder falha sem tornar conteúdo alcançável."
  ],
  [
    "Por que caracteres não medem fonte exatamente?",
    "Glifos, kerning, estilo, script e fallback mudam métricas; estimativa precisa limites e renderização real para confirmar.",
    "Uma escala numérica correta não prova quebra ou legibilidade com fonte ausente."
  ],
  [
    "Quando truncamento é inadequado?",
    "Quando remove informação necessária sem acesso equivalente; defina resize, quebra e alternativa conforme tarefa.",
    "Label que perde palavra distintiva ou condição recortada pode mudar decisão apesar de layout limpo."
  ],
  [
    "Estilo tipográfico cria heading semântico?",
    "Ele define aparência reutilizável; função e ordem semântica precisam contrato e implementação no runtime.",
    "Copiar style não aplica acessibilidade, e overrides sem motivo podem romper sistema."
  ],
  [
    "Como verificar localização além de tradução?",
    "Confira significado, formatos, unidade, fontes, quebra, direção e fallback, com fixtures por locale.",
    "Centavos exibidos como valor integral ou chave desconhecida ausente conserva aparência e perde domínio."
  ],
  [
    "O que uma razão de contraste comprova?",
    "A fórmula e o par avaliado sob contexto declarado; alpha precisa superfície e conformidade global exige outros ensaios.",
    "Cor isolada ou simulação visual não prova legibilidade de todos os estados."
  ],
  [
    "Como distinguir stroke e efeito de bounds?",
    "Declare alinhamento e composição; ocupação visual pode ultrapassar geometria, e export precisa inspeção no destino.",
    "Stroke externo recortado e opacidade herdada podem alterar aparência apesar de números locais corretos."
  ],
  [
    "Por que ícone e alvo são diferentes?",
    "Path comunica símbolo; região interativa pode ser maior e precisa contrato, hit testing e uso observados.",
    "Normalizar viewBox não garante reconhecimento nem área acionável adequada."
  ],
  [
    "Quando escolher cover ou contain?",
    "Cover preenche e pode recortar; contain conserva imagem integral. Decida por tarefa e ponto focal, observando conteúdo.",
    "Centro geométrico pode remover sujeito; manifesto preenchido não prova qualidade nem origem autorizada real."
  ],
  [
    "O que distingue instance de cópia?",
    "Instance mantém relação com main e overrides permitidos; cópia ou detach muda lifecycle e atualização.",
    "Nome igual não prova origem; update pode afetar consumidores e precisa ensaio de preservação."
  ],
  [
    "Como auditar variants?",
    "Compare tuplas permitidas, obrigatórias e inválidas, evitando duplicatas e separando estado visual e domínio.",
    "Quantidade de frames pode esconder falta de foco e confirmação indevida durante desconhecido."
  ],
  [
    "Qual contrato uma property deve ter?",
    "Nome, tipo, default, escolhas e função; composição ou slot precisa substitutos e limites apropriados.",
    "Booleano em string e slot irrestrito podem gerar configuração inválida sem erro visual evidente."
  ],
  [
    "Como publicar mudança compatível de library?",
    "Revise consumidores, props, tipos e dependências, documente impacto e ensaie update e migração.",
    "Remoção de property ou tipo alterado rompe contrato mesmo com nome e aparência parecidos."
  ],
  [
    "Por que alias precisa tipo e integridade?",
    "Ele referencia valor compatível e deve conservar origem explicável; o modelo detecta ciclo e ausência no grafo declarado.",
    "Cadeia cíclica ou coleção copiada por nome não prova binding válido."
  ],
  [
    "Mode de mobile cria breakpoint no produto?",
    "Ele representa contexto no documento; runtime precisa mecanismo próprio, e herança difere de escolha explícita.",
    "Trocar default pode deixar override fixo no modo anterior e não executa media query."
  ],
  [
    "Valor igual prova binding?",
    "Não; literal pode coincidir agora e não acompanhar update. Inspecione referência, tipo, unidade e contexto.",
    "Token de duração usado como largura ou hardcode sem exceção rompe intenção apesar de tipo numérico."
  ],
  [
    "O que exportar tokens exige?",
    "Schema, unidades, aliases, modes e mapeamento sem colisão, ligado a consumidores e revisão.",
    "Normalizar duas origens para uma chave ou acrescentar px à opacidade produz artefato incorreto."
  ],
  [
    "O que um flow comprova?",
    "Representa trajeto e tarefa; referências e condições precisam review, e protótipo real exige interação observada.",
    "Navegar para sucesso não confirma reserva nem prova backend ou pesquisa."
  ],
  [
    "Overlay desenhado aplica foco?",
    "Não; o desenho pode especificar abertura, saída, scroll e foco, que precisam implementação e ensaio apropriados.",
    "Dialog com ações fora do viewport ou tooltip obrigatório só por hover pode impedir tarefa."
  ],
  [
    "Animação local confirma efeito externo?",
    "Ela comunica apresentação; decisão de domínio precisa evento e fonte apropriados. Matching e renderer exigem ensaio nativo.",
    "Check animado após clique pode fabricar sucesso, e duração configurada não é performance medida."
  ],
  [
    "Como tornar simulação repetível?",
    "Declare estado inicial, eventos, condições, reset e orçamento, preservando fixtures e saídas alternativas.",
    "Estado residual e loop podem contaminar pesquisa; número de vaga simulado não prova concorrência."
  ],
  [
    "Por que testar reflow além de dois frames?",
    "Conteúdo e espaço variam entre tamanhos; use matriz por risco e observe runtime, zoom e estados.",
    "Largura intermediária ou texto ampliado pode perder ação apesar de desktop e mobile aprovados."
  ],
  [
    "Um ícone 24 prova Target Size Minimum?",
    "Não; critério considera alvo e condições próprias. Policy local pode adotar 44, distinguindo geometria planejada de interação real.",
    "Bounds do símbolo não mostram listener, e sequência de IDs não é teste de Tab."
  ],
  [
    "Como comunicar desconhecido com precisão?",
    "Conserve incerteza e identidade do comando, orientando consulta conforme contrato sem anunciar confirmação.",
    "Toast ao enviar ou retry sem consulta pode induzir duplicação e não aplica semântica por estar desenhado."
  ],
  [
    "Auditoria e pesquisa são intercambiáveis?",
    "Não; método, população, revisão e fonte sustentam conclusões distintas, com falha e pendência explícitas.",
    "Checklist verde não prova compreensão, e entrevista não registrada não pode ser inventada como evidência."
  ],
  [
    "Link de arquivo prova acesso a dependências?",
    "Não; principal e recurso precisam matriz e ensaio, incluindo libraries e superfícies de conteúdo sensível.",
    "Sharing amplo pode expor dados e acesso ao frame pode não incluir library necessária."
  ],
  [
    "Comment resolvido prova correção verificada?",
    "Não; pergunta, decisão, implementação e reteste são estados distintos, com owner e revisão.",
    "Encerrar sem evidência ou usar teste de revisão antiga perde vínculo com mudança."
  ],
  [
    "Branch Figma é cópia com merge garantido?",
    "Não; confirme recurso e processo nativos, base e conflitos, verificando composição final e dependências.",
    "Última aparência pode apagar decisão, e retornar documento não desfaz efeitos de handoff externos."
  ],
  [
    "Como manter naming útil?",
    "Use papel e contexto com convenção pequena, detecte colisões e conserve lifecycle e referências.",
    "Renomear em massa ou apagar arquivo histórico sem inventário pode quebrar consumidores e automações."
  ],
  [
    "Inspeção é especificação completa?",
    "Medidas precisam função, unidade, estado e comportamento de resize, além de semântica e critérios de implementação.",
    "CSS por coordenadas ou token copiado como literal pode parecer correto e falhar com conteúdo."
  ],
  [
    "Ready for dev executa testes?",
    "É comunicação de estado; policy de prontidão exige revisão, dependências e evidência pertinentes.",
    "Alteração depois de aprovação ou library inacessível invalida claim de pacote pronto."
  ],
  [
    "O que Code Connect acrescenta?",
    "Relaciona componente visual a implementação e exemplos reais, com mapeamento de props e disponibilidade verificada.",
    "Publicação da relação não prova release, comportamento, import existente ou acessibilidade do componente."
  ],
  [
    "Como interpretar QA visual?",
    "Compare referência e runtime com configuração e tolerância por propriedade, revisando impacto e significado.",
    "Diff pequeno pode omitir palavra crítica, e baseline atualizada sem review pode esconder regressão."
  ],
  [
    "Hash de export prova fidelidade e segurança?",
    "Ele prova identidade dos bytes ensaiados; formato, rendering, origem e processamento do destino exigem ensaios próprios.",
    "SVG com fonte ausente ou conteúdo externo não se torna seguro por digest ou regex de fixture."
  ],
  [
    "Como limitar mutation por Plugin API?",
    "Defina alvos, tipos, pré-condições e dependências de fonte, revalidando antes do efeito e registrando resultado por alvo.",
    "Plano antigo ou seleção por nome pode sobrescrever edição e atingir objetos fora do escopo."
  ],
  [
    "REST API equivale à Plugin API?",
    "Não; endpoints, scopes e formatos têm capacidades próprias. Valide resposta, budget e rate limit documentado.",
    "Paginação universal presumida ou retry de 401 gera cliente incorreto e não prova acesso real."
  ],
  [
    "Como revisar proposta de IA ou automação?",
    "Compare referências e estados com catálogo e vincule plano concreto à aprovação, mantendo geração e efeito separados.",
    "Token inventado e plano ampliado após review podem romper contrato mesmo com preview convincente."
  ],
  [
    "O que o sistema de reserva precisa cobrir?",
    "Componentes, tokens, conteúdo, estados e critérios ligados ao domínio, com unidades e dados representativos.",
    "Contar peças sem relação com desconhecido ou preço correto não demonstra experiência completa."
  ],
  [
    "Que mensagem usar após timeout da última vaga?",
    "Resultado pode ser desconhecido; preserve comando e consulte decisão antes de nova tentativa conforme contrato.",
    "Consulta inicial não garante vaga, e falhou com chave nova pode duplicar efeito já realizado."
  ],
  [
    "O que torna handoff aceitável?",
    "Referência identificável, contratos, dependências, owners e evidência por camada, conservando Pending.",
    "Status global verde ou digest antigo pode ocultar falta de acesso, mudança e gate operacional ausente."
  ],
  [
    "Quando a banca limita conclusão?",
    "Quando falta evidência pertinente ou gate obrigatório está Failed/Pending; ligue texto final, digest, oracle e resultado.",
    "Modelo local não certifica editor, renderer, teclado, pesquisa ou operação, e mutante não detectado enfraquece claim."
  ]
];
const SCENARIOS: [string,string][][] = [
  [
    [
      "Três frames têm nome Reserva, mas só um recebeu revisão; o pacote guarda apenas esse nome. A equipe duplicou o arquivo e moveu o badge para fora do card. Explique identidade, referência e hierarquia necessárias para preservar a decisão sem escolher objeto pela aparência.",
      "Usar arquivo/node/revisão, distinguir cópia e referência e inspecionar pai/filho. Frame e group precisam contrato de resize. Resolver ID aprovado e detectar órfão/ciclo; editor confirma objetos reais, modelo não comprova navegação."
    ],
    [
      "Um ícone rotacionado recebe posição absoluta pela soma simples de coordenadas e sua sombra é considerada área clicável. O brief só exige aparência moderna. Identifique três garantias que essa revisão não sustenta e proponha fixtures e critérios correspondentes.",
      "Compor matriz, distinguir bounds visual/interativo e definir tarefa/aceite. Fixture de rotação, sobreposição e alvo detecta erros geométricos. Brief precisa conteúdo/estado; runtime verifica hit testing, pesquisa observa compreensão."
    ],
    [
      "Uma proposta passa de disponível a desconhecida, mas o documento só contém nome curto e sucesso. Trace quais fixtures e critérios faltam, incluindo conteúdo extremo e links por revisão, e como separar completude local de existência real do arquivo.",
      "Cobrir loading, recusa e desconhecido com nome longo/ausência; critérios ligam domínio e método. Validators conferem manifest, não arquivo. Editor confirma referência, runtime confirma estado e pesquisa avalia tarefa."
    ]
  ],
  [
    [
      "Uma linha usa gap para simular padding, ícone fora do fluxo e botão que cresce pelo texto. Explique responsabilidades de região, modos por eixo e limites, incluindo o que deve acontecer quando dois rótulos longos não cabem no viewport previsto.",
      "Separar padding/gap e inserir ícone no contrato da linha. Calcular espaço restante e testar extremos; Hug/Fill/Fixed dependem do pai. Definir reorganização, sem inferir breakpoint do frame; editor confirma engine."
    ],
    [
      "Cards estão sobre guias e são chamados de grid responsivo; wrap perde item largo e span ultrapassa tracks. Identifique falhas de mecanismo e coverage e proponha oracles para ordem, cobertura, limites e conflito de células.",
      "Guias não são grid auto layout. Wrap conserva todos os itens ou recusa excesso; grid valida span/células. Testar vazio, limite, overflow e colisão. Modelos não provam layout nativo; resize real precisa ensaio."
    ],
    [
      "Redimensione no modelo um pai de largura 100 para 160, com filho x70 e largura20 ancorado à direita. Depois trace conteúdo parcialmente recortado e explique qual observação comprovaria acesso a ação e foco no editor e no runtime.",
      "Margem direita10 leva x130. Interseção distingue visível/parcial/oculto; clipping não cria acesso. Editor observa resize/scroll; runtime verifica foco e interação, sem usar shadow ou bounds como prova de alvo."
    ]
  ],
  [
    [
      "A equipe estima largura pela quantidade de caracteres, usa fonte indisponível no código e cria muitos estilos quase iguais. Explique escala por papéis, manifesto de fontes e ensaio de renderização, diferenciando relação numérica de métrica tipográfica real.",
      "Definir papéis e escala, verificar família/estilo e fallback. Caracteres não medem glifos. Fixture com acentos/texto longo e fonte real confirma quebra; validator local só confere contrato e dependências."
    ],
    [
      "Mensagem obrigatória é truncada sem alternativa, label perde palavra distintiva e override tipográfica não tem motivo. Identifique riscos de conteúdo e sistema e proponha critérios que evitem reduzir fonte apenas para fazer a caixa caber.",
      "Preservar informação obrigatória e alternativa acessível; rever composição/resize. Registrar override justificada, testar URL/palavra longa e mensagem crítica. Editor e runtime confirmam renderização/acesso; policy não garante leitura humana."
    ],
    [
      "Um preço 1299 centavos vira moeda 1299, locale estrangeiro não tem mensagem desconhecida e tradução longa rompe card. Trace unidade, formatação, coverage e fallback, incluindo como coletar evidência de significado e aparência sem copiar dados pessoais.",
      "Converter centavos para12.99 e usar Intl com locale/moeda. Conferir chaves e fallback aprovado, fontes e layout com fixtures sintéticas. Revisão linguística confirma significado, editor/runtime confirmam composição; não extrapolar um locale."
    ]
  ],
  [
    [
      "O projeto usa cor para comunicar resultado, label com alpha sobre foto e tema escuro com par insuficiente. Explique contraste e composição, selecionando quais pares e estados precisam evidência e por que cálculo não certifica toda a experiência.",
      "Linearizar sRGB, compor alpha sobre superfície e avaliar par pertinente. Acrescentar texto/ícone para significado. Matriz por modo/estado e critério apropriado; cálculo local não inspeciona aplicação nem prova conformidade global."
    ],
    [
      "Stroke externo sofre clipping, opacidade do grupo altera texto e booleano vetorial foi conferido apenas ampliado. Identifique diferenças entre geometria, aparência e export e proponha fixtures de escala e operação que tornem as falhas observáveis.",
      "Calcular expansão, observar composição e testar forma em tamanho de uso. Booleano discreto só modela células; export/renderer precisam ensaio. Região interativa e percepção não se deduzem de bounds ou número de paths."
    ],
    [
      "Imagem cover remove sujeito, ícone possui viewBox maior que o alvo e manifest não registra origem. Trace crop, normalização, região de interação e alternativa textual, indicando quais propriedades são locais e quais exigem inspeção real.",
      "Cover escala maior e recorta; escolher focal/contain conforme tarefa. Normalizar geometria sem reduzir alvo; registrar origem/licença/dimensões e texto pertinente. Modelo confere números/manifest, conteúdo/rendering/hit testing exigem observação."
    ]
  ],
  [
    [
      "Há cópias e instances chamadas Button; uma foi detached para ajustar padding, e update remove property usada. Explique reuse, origem, override e migração, com critérios para identificar consumidores e ensaiar mudança sem assumir preservação universal.",
      "IDs e vínculos distinguem main/instance/cópia; detach muda lifecycle. Inventariar props/consumidores e testar overrides em update real. Modelos resolvem fixtures sem mutar main, não certificam propagação Figma."
    ],
    [
      "A matriz contém duplicatas, omite foco e permite resultado confirmado durante unknown. Um slot aceita qualquer componente e booleano é string false. Identifique como tipo, combinação e domínio precisam ser validados antes de anunciar catálogo completo.",
      "Comparar tuplas obrigatórias/permitidas, recusar duplicata e estado inválido; schema exige booleano real e substitutos autorizados. Coverage não prova visual/runtime. Editor confirma properties/variants, produto confirma semântica."
    ],
    [
      "Uma library troca booleano por enum, mapa de depreciação forma ciclo e consumidor antigo fica sem substituto. Trace classificação de mudança, resolução e pacote de update, incluindo fixtures e evidencia necessária para dizer que a migração terminou.",
      "Tipo alterado exige migração; detectar ciclos/ausência e mapear consumidores. Changelog explica ação, testar casos extremos e overrides. Publicação/update reais e implementação precisam ensaio; diff local só classifica policy."
    ]
  ],
  [
    [
      "Collection copiada recebe o mesmo nome, alias de cor aponta para número e espaço não possui unidade. Explique identidade, tipos e função de primitivos e semânticos, indicando como detectar erro sem apresentar fixture como schema oficial.",
      "Usar IDs/origem e aliases compatíveis, unidades e valores por contexto. Detectar ciclo/ausência. Primitivos podem compartilhar valor, papéis preservam independência. Validator didático não importa variables; editor/API confirmam binding."
    ],
    [
      "Tema dark é herdado, mas card está explicitamente light; default muda e mobile mode é usado como media query. Identifique comportamentos esperados e cobertura por contexto, além do mecanismo de runtime necessário para temas e responsividade.",
      "Auto acompanha contexto/default, explícito conserva escolha. Matriz confere tokens/estados e combinações suportadas. Modes não criam media query. Editor confirma herança, produto aplica seleção e reflow."
    ],
    [
      "Dois nomes viram mesma chave CSS, opacidade recebe px e literal coincide com token atual. Trace export, binding e migração para consumidor antigo, diferenciando valor igual de relação real e definindo oracles para colisão e unidade.",
      "Detectar colisão antes de escrever, unidade por papel e mapping de consumidores. Igualdade não prova binding; mudança da fonte revela relação. Artefato/digest/revisão ligados a aplicação real, com gates nativos separados."
    ]
  ],
  [
    [
      "Flow não possui entrada conhecida, destino removido permanece ligado e sucesso aparece após submit. Explique grafo, trigger e estado de domínio, propondo caminhos de recusa e desconhecido e evidência apropriada para navegação e efeito.",
      "Validar start/destinos e transição por evento confirmado. Cobrir recusa/timeout/retorno. Modelo detecta referência/estado; protótipo real confirma interação, backend confirma decisão. Não chamar navegação de reserva executada."
    ],
    [
      "Dialog possui ações fora do viewport, tooltip contém condição obrigatória apenas por hover e animação perde contexto. Identifique contratos de overlay, scroll, foco e movimento, incluindo alternativa e ensaio que o desenho estático não oferece.",
      "Definir região/saída/scroll e informação acessível; foco/teclado no runtime. Movimento apoia continuidade sem ser única pista. Modelo pilha/visibilidade/interpolação não exerce gestos ou focus trap; nativo exige observação."
    ],
    [
      "Simulação conserva quantidade anterior, loop de retry não tem limite e check anima para confirmado sem resposta. Trace estado inicial, reset, budget e transições, indicando como pesquisa pode estudar compreensão sem afirmar backend ou performance reais.",
      "Reset restaura fixture, budget limita passos, decisão externa autoriza confirmação. Timeout mantém unknown. Registrar tarefa e limites; pesquisa observa representação, runtime mede performance e efeito. Testar evento inválido e estado residual."
    ]
  ],
  [
    [
      "Desktop e mobile passaram visualmente, mas viewport intermediário perde ação e texto ampliado recorta condição. Explique matriz por risco, reflow e prioridades, com fixtures e critérios que cubram comportamento entre frames e diferenças de runtime.",
      "Testar fronteiras, estados, conteúdo extremo, locale/tema e zoom conforme critério. Colunas mínimas e coverage locais ajudam; editor/runtime confirmam composição/acesso. Não esconder informação essencial nem chamar mode de breakpoint automático."
    ],
    [
      "Ícone tem24, alvo16, sequência omite ação e footer oculta foco. Identifique por que imagem não prova Target Size ou teclado, distinguindo policy local44 de critérios normativos e planejando ensaio de interação real.",
      "Alvo difere do path e policy44 é do exercício. Critérios têm condições/exceções; verificar região efetiva, Tab, foco e scroll. Array/retângulo modelam contrato, não listener ou conformidade completa."
    ],
    [
      "Relatório considera toast ao enviar como confirmação e mistura cálculo, checklist e entrevista não registrada numa nota verde. Trace estado desconhecido, semântica e fontes de auditoria, indicando pendências e método para avaliar tarefa e implementação.",
      "Conservar commandId/unknown e consulta; semântica/anúncio no runtime. Separar métodos/populações/revisões e não inventar pesquisa. Resumo mantém Failed/Pending; oracles específicos/mutantes e testes reais sustentam claims distintos."
    ]
  ],
  [
    [
      "Arquivo possui link amplo, token em comment e library inacessível ao implementador. Explique matriz por principal/recurso, minimização e lifecycle de acesso, incluindo superfícies históricas e limites de revogar a fonte depois de export.",
      "Mapear read/comment/edit e dependencies; fixtures sem secrets, inventariar history/cópias. Ensaiar acesso permitido/negado na plataforma. Revogação não recolhe exports; modelo role/projeção não prova sharing nem limpeza global."
    ],
    [
      "Comment resolvido não tem alteração, decisão cita revisão antiga e dois branches mudam mesmo label. Identifique lifecycle de achado e conflito, definindo owner e evidência da revisão final sem assumir equivalência completa com Git.",
      "Separar proposta/implementado/verificado, owner/critério/revisão. Merge base e mudanças divergentes exige decisão; retestar composição final. Modelos locais não criam comments/branches; editor e produto confirmam efeitos."
    ],
    [
      "Naming normalizado colide, referência vigente aponta para componente arquivado e equipe quer apagar explorações sem inventário. Trace manutenção, dependências e reversibilidade, definindo quais verificações são locais e quais exigem o arquivo real.",
      "Detectar duas origens na mesma chave, recusar uso indevido e classificar lifecycle por propósito. Inventariar antes de rename/delete. Editor confirma preservação e tarefa observa navegação; contagem não prova performance."
    ]
  ],
  [
    [
      "Dev Mode mostra coordenadas que são copiadas como CSS absoluto, token vira literal e contrato não cobre conteúdo longo. Explique inspeção e equivalência de implementação, com unidades, estados e tolerâncias que preservem função sem copiar árvore literalmente.",
      "Ligar medida à propriedade/propósito, layout por comportamento e tokens/unidades. Contrato inclui extremos e semântica. Comparação por viewport/conteúdo/revisão; modelo numérico não prova browser ou fonte real."
    ],
    [
      "Frame ready foi alterado após aprovação, Code Connect aponta para import removido e Disabled vira string false. Identifique rastreabilidade, disponibilidade e mapeamento, definindo gates separados para relação publicada, implementação e release.",
      "Digest muda prontidão; dependências/owners e props tipadas. Catálogo detecta import/versão inválidos. Code Connect nativo/publicação e componente real precisam ensaio; relação não prova release nem acessibilidade."
    ],
    [
      "Diff de pixels é pequeno mas remove palavra não; baseline foi atualizada sem review e screenshot usou fallback de fonte. Trace QA visual e impacto editorial, com configuração e processo para aceitar adaptação ou corrigir regressão.",
      "Referência/revisão/código/dados/fonte fixados, tolerância por propriedade e review de significado. Pequeno diff pode ser crítico. Reteste causa e baseline com owner; arrays de fixture só testam fórmula, não screenshots reais."
    ]
  ],
  [
    [
      "SVG contém fonte ausente, região exportada é maior que ícone e digest corresponde ao arquivo anterior. Explique formato, seleção, integridade e renderer, incluindo limites do serializer restrito e segurança de documentos arbitrários.",
      "Manifest formato/revisão/dimensões/hash e reexecute após alteração. Inspecionar export e renderer real, tratar fonte/texto e escala. Serializer só produz domínio limitado; hash não prova fidelidade/licença ou sanitização universal."
    ],
    [
      "Plugin seleciona por nome, ignora fontes mistas e aplica expectedValue antigo; cliente REST repete401 e cursor cíclico. Identifique escopo e pré-condições, dependências e orçamento, separando APIs e ensaios locais de efeito real.",
      "Planos por ID/tipo/valor, carregar fontes pertinentes nativamente e retornar conflitos. REST endpoint/scope/payload, ciclo/budget e erro auth recusa. Modelo não executa API; mutation/calls precisam fixture autorizada e evidence."
    ],
    [
      "Assistência inventa token e amplia plano de um frame para todas as páginas depois de review. Trace catálogo, estado, digest e autorização, definindo avaliação que detecte erro crítico sem usar preview bonito como prova de qualidade.",
      "Recusar referência/estado inexistentes, vincular plano/destino/quantidade/digest e revalidar. Mutantes demonstram oracles específicos; review/geração/efeito separados. Não publicar por score; providers e plataforma precisam ensaio real."
    ]
  ],
  [
    [
      "Projeto tem três componentes, mas nenhum mostra unknown, preço usa centavos incorretamente e botão confirma antes da resposta. Explique manifest do sistema e contrato editorial, incluindo conteúdo extremo, semântica e critérios de handoff que tornem essas falhas detectáveis.",
      "Ligar componentes/tokens/estados, converter unidade e apresentar proposta/loading até decisão. Fixtures longo/ausência/recusa/unknown e contratos de acesso. Validators locais não provam documento, runtime ou pesquisa; gates próprios."
    ],
    [
      "Duas pessoas veem última vaga; um timeout ocorre depois do efeito e interface oferece nova reserva com commandId novo. Identifique mensagens e próximo passo, separando disputa, replay e consulta e indicando a evidência do laboratório pertinente.",
      "Autoridade consistente decide disputa, commandId estável/fingerprint dedup. Unknown consulta original, não inventa falha. Uma confirmação/uma recusa e ledger no ensaio real; modelo serial/protótipo não prova concorrência."
    ],
    [
      "Pacote possui links sem revisão, snippet mudou depois da execução e banca considera modelo como Figma nativo testado. Trace aceitação final, digests, mutantes e gates, limitando conclusão quando editor, runtime ou pesquisa permanecem pendentes.",
      "Fonte inteira, contrato/auditoria e digest do texto final reexecutado. Oracles devem rejeitar mutantes. Manifest/owners/refs e Verified/Failed/Pending separados. Claims locais aprovados, nativo/humano/operacional só após ensaio pertinente."
    ]
  ]
];
const titles=FIGMA_CURRICULUM.flatMap(chapter=>chapter.sections);
if(REVIEWS.length!==48||SCENARIOS.length!==12||SCENARIOS.some(rows=>rows.length!==3)) throw new Error("Figma: avaliações incompletas");
export const FIGMA_REVIEW: Record<string,Review> = Object.fromEntries(titles.map((title,index)=>[title,REVIEWS[index]]));
export const FIGMA_CARDS: ContentSource["cards"] = FIGMA_CURRICULUM.flatMap(chapter=>chapter.sections.map(title=>({nodeTitle:chapter.title,frontMd:FIGMA_REVIEW[title][0],backMd:FIGMA_REVIEW[title][1]})));
export const FIGMA_EXERCISES: ContentSource["exercises"] = FIGMA_CURRICULUM.flatMap((chapter,index)=>SCENARIOS[index].map(([promptMd,answerKeyMd],position)=>({nodeTitle:chapter.title,type:([2,3,5] as const)[position],level:chapter.level==="basico"?"beginner" as const:chapter.level==="intermediario"?"intermediate" as const:"advanced" as const,promptMd,answerKeyMd,points:3})));

