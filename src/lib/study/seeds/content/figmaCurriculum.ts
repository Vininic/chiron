import type { ChapterLevel } from "@/lib/study/types";
export interface FigmaChapter { title: string; level: ChapterLevel; sections: string[] }
export const FIGMA_CURRICULUM: FigmaChapter[] = [
 {title:"Documento e fundamentos",level:"basico",sections:["Canvas, páginas e identidade", "Frames, groups e hierarquia", "Seleção, coordenadas e bounds", "Brief, conteúdo e critérios"]},
 {title:"Layout e comportamento",level:"basico",sections:["Auto layout: direção e espaçamento", "Hug, Fill, Fixed e limites", "Wrap, grid e composição", "Constraints, clipping e camadas"]},
 {title:"Tipografia e conteúdo",level:"basico",sections:["Escala, fontes e métricas", "Texto, resizing e quebra", "Estilos e hierarquia editorial", "Localização e conteúdo extremo"]},
 {title:"Cor, forma e imagem",level:"intermediario",sections:["Cor semântica e contraste", "Fills, strokes e efeitos", "Vetores, booleanos e ícones", "Imagens, crops e assets"]},
 {title:"Componentes e sistema",level:"intermediario",sections:["Main components e instances", "Variants e matriz de estados", "Properties, slots e composição", "Libraries, updates e depreciação"]},
 {title:"Variables e tokens",level:"intermediario",sections:["Collections, tipos e aliases", "Modes, temas e herança", "Binding, scopes e contrato", "Tokens para código e migração"]},
 {title:"Protótipos e interação",level:"avancado",sections:["Flows, triggers e navegação", "Overlays, scroll e foco", "Interactive components e animação", "Variables, condições e simulação"]},
 {title:"Responsividade e acessibilidade",level:"avancado",sections:["Matriz de viewports e reflow", "Teclado, foco e alvos", "Estados, mensagens e semântica", "Auditoria e testes com pessoas"]},
 {title:"Colaboração e governança",level:"avancado",sections:["Permissões, links e conteúdo sensível", "Comments, decisões e ownership", "Versions, branches e merge", "Naming, organização e manutenção"]},
 {title:"Dev Mode e entrega",level:"avancado",sections:["Inspeção e contrato de implementação", "Ready for dev e rastreabilidade", "Code Connect e componentes reais", "QA visual e diferenças de runtime"]},
 {title:"Export, plugins e APIs",level:"avancado",sections:["SVG, raster e integridade", "Plugin API e mutação segura", "REST API, paginação e limites", "Automação, IA e revisão"]},
 {title:"Projeto Quíron: armadilhas e banca",level:"avancado",sections:["Sistema da experiência de reserva", "Última vaga e estados de confiança", "Pacote de handoff e aceitação", "Banca de revisão e regressão"]},
];
