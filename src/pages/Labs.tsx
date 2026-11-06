import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, FlaskConical, Play, RotateCcw, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { LABS, labById } from "@/lib/labs/catalog";
import { activeMutations, invariantIsBroken, labCompletion } from "@/lib/labs/engine";
import { bfs, cellKey, type Cell } from "@/lib/labs/grid";
import { queueDirection, reserve, tickSnake, type Direction, type MarketState, type SnakeState } from "@/lib/labs/simulations";
import { reverseGenerate, rushDifficulty, type RushBoard } from "@/lib/labs/rush";
import { useChiron } from "@/lib/study/store";
import { recordLabLayer } from "@/lib/study/service";

function Grid({ width, height, cells, className }: { width: number; height: number; cells: Record<string, string>; className?: string }) {
  return <div className={cn("grid aspect-square w-full max-w-[340px] overflow-hidden rounded-xl border border-border bg-primary-deep p-1", className)} style={{ gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))` }}>
    {Array.from({ length: width * height }, (_, index) => {
      const cell = { x: index % width, y: Math.floor(index / width) };
      return <div key={cellKey(cell)} className={cn("m-px rounded-[2px] bg-primary-foreground/5", cells[cellKey(cell)])} />;
    })}
  </div>;
}

function SnakeScene({ broken }: { broken: boolean }) {
  const [state, setState] = useState<SnakeState>({ body: [{ x: 4, y: 4 }, { x: 3, y: 4 }, { x: 2, y: 4 }], food: { x: 7, y: 2 }, direction: "right", width: 9, height: 9 });
  const move = (direction: Direction) => setState((current) => tickSnake(queueDirection(current, direction)));
  const cells = Object.fromEntries(state.body.map((cell, i) => [cellKey(cell), i === 0 ? "bg-secondary shadow-[0_0_12px_hsl(var(--secondary))]" : "bg-secondary/60"]));
  cells[cellKey(state.food)] = "bg-destructive";
  if (broken) cells[cellKey({ x: 4, y: 4 })] = "bg-destructive animate-pulse";
  return <SceneShell caption="Teclas aplicam uma transição atômica; a grade apenas reflete o estado.">
    <Grid width={9} height={9} cells={cells} />
    <div className="grid grid-cols-3 gap-1">
      <span /> <Control onClick={() => move("up")}>↑</Control> <span />
      <Control onClick={() => move("left")}>←</Control><Control onClick={() => setState((current) => tickSnake(current))}>Tick</Control><Control onClick={() => move("right")}>→</Control>
      <span /> <Control onClick={() => move("down")}>↓</Control> <span />
    </div>
  </SceneShell>;
}

function MarketScene({ broken }: { broken: boolean }) {
  const [market, setMarket] = useState<MarketState>({ products: [{ id: "olive", name: "Azeite ateniense", cents: 1299, stock: 1, reserved: 0 }], carts: {} });
  const product = market.products[0];
  const reserveFor = (buyer: string) => setMarket((current) => broken
    ? { ...current, products: current.products.map((item) => ({ ...item, reserved: item.reserved + 1 })), carts: { ...current.carts, [buyer]: [...(current.carts[buyer] ?? []), { productId: "olive", centsAtReservation: product.cents, quantity: 1 }] } }
    : reserve(current, buyer, "olive"));
  return <SceneShell caption="Duas pessoas disputam uma unidade. Reserva e carrinho precisam mudar juntos.">
    <div className="w-full max-w-md rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between"><div><div className="font-medium">{product.name}</div><div className="text-xs text-muted-foreground">R$ {(product.cents / 100).toFixed(2)} · {product.stock - product.reserved} disponível</div></div><span className="rounded-full bg-secondary/10 px-2 py-1 text-xs text-secondary">estoque {product.stock}</span></div>
      <div className="mt-4 grid grid-cols-2 gap-2"><Button variant="outline" onClick={() => reserveFor("Ariadne")}>Reservar Ariadne</Button><Button variant="outline" onClick={() => reserveFor("Teseu")}>Reservar Teseu</Button></div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">{["Ariadne", "Teseu"].map((buyer) => <div key={buyer} className="rounded-lg bg-muted p-2"><div className="font-medium">{buyer}</div><div className="mt-1 text-muted-foreground">{market.carts[buyer]?.length ?? 0} item(ns)</div></div>)}</div>
    </div>
  </SceneShell>;
}

function MazeScene({ broken }: { broken: boolean }) {
  const walls = broken ? [] : [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }];
  const result = useMemo(() => bfs({ x: 0, y: 0 }, { x: 6, y: 6 }, 7, 7, walls), [broken]);
  const cells: Record<string, string> = {};
  for (const cell of result.visited) cells[cellKey(cell)] = "bg-secondary/15";
  for (const wall of walls) cells[cellKey(wall)] = "bg-primary-foreground/30";
  for (const cell of result.path) cells[cellKey(cell)] = "bg-secondary";
  cells["0,0"] = "bg-chart-3"; cells["6,6"] = "bg-destructive";
  return <SceneShell caption={`BFS visitou ${result.visited.length} células e encontrou ${result.path.length - 1} passos.${broken ? " A mutação removeu as paredes do modelo." : ""}`}><Grid width={7} height={7} cells={cells} /></SceneShell>;
}

function RushScene({ broken }: { broken: boolean }) {
  const solved: RushBoard = { size: 6, targetId: "target", pieces: [{ id: "target", x: 4, y: 2, length: 2, orientation: "h" }, { id: "pillar", x: 3, y: 0, length: 3, orientation: "v" }, { id: "bar", x: 4, y: 3, length: 2, orientation: "h" }, { id: "low", x: 0, y: 5, length: 2, orientation: "h" }] };
  const board = useMemo(() => reverseGenerate(solved, 5, (max) => max > 1 ? 1 : 0), []);
  const difficulty = useMemo(() => rushDifficulty(board), [board]);
  const cells: Record<string, string> = { "0,2": "bg-secondary", "1,2": "bg-secondary", "2,2": "bg-secondary", "3,0": "bg-chart-4", "3,1": "bg-chart-4", "3,2": "bg-chart-4", "4,3": "bg-chart-5", "5,3": "bg-chart-5", "0,5": "bg-chart-3", "1,5": "bg-chart-3" };
  if (broken) { cells["3,2"] = "bg-destructive animate-pulse"; cells["4,2"] = "bg-destructive animate-pulse"; }
  return <SceneShell caption={broken ? "O movimento atravessou uma peça: o solver agora enxerga uma fase impossível no tabuleiro real." : "Gerado por caminhada reversa: cada posição exibida tem um caminho comprovado até a saída."}>
    <div className="flex items-start gap-4"><Grid width={6} height={6} cells={cells} /><div className="max-w-[160px] space-y-2 text-xs text-muted-foreground"><div className="rounded-lg border border-border bg-card p-2"><strong className="block text-foreground">{difficulty.minimumMoves} movimentos</strong> solução mínima</div><div className="rounded-lg border border-border bg-card p-2"><strong className="block text-foreground">{difficulty.branching} ramificações</strong> por estado</div><div className="rounded-lg border border-border bg-card p-2"><strong className="block text-foreground">{difficulty.blockers} bloqueador(es)</strong> medida pelo solver</div></div></div>
  </SceneShell>;
}

function SceneShell({ children, caption }: { children: React.ReactNode; caption: string }) { return <div className="flex min-h-[310px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-[radial-gradient(circle_at_50%_0%,hsl(var(--secondary)/.12),transparent_58%)] p-5"><div className="flex-1">{children}</div><p className="max-w-md text-center text-xs leading-relaxed text-muted-foreground">{caption}</p></div>; }
function Control({ children, onClick }: { children: React.ReactNode; onClick: () => void }) { return <button type="button" onClick={onClick} className="h-8 rounded-md border border-border bg-card text-xs font-medium transition-colors hover:bg-accent">{children}</button>; }

function LabScene({ kind, broken }: { kind: string; broken: boolean }) {
  if (kind === "snake") return <SnakeScene broken={broken} />;
  if (kind === "market") return <MarketScene broken={broken} />;
  if (kind === "maze") return <MazeScene broken={broken} />;
  return <RushScene broken={broken} />;
}

function LabIndex() {
  const { index } = useChiron();
  return <div className="mx-auto max-w-6xl"><div className="mb-8 max-w-2xl"><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-secondary"><FlaskConical className="h-4 w-4" /> Laboratórios guiados</div><h1 className="font-display mt-3 text-4xl text-primary sm:text-5xl">Entenda o sistema antes de tocar no código.</h1><p className="mt-3 leading-relaxed text-muted-foreground">Cada laboratório começa com uma previsão, expõe o contrato, e deixa você quebrar uma invariante de propósito. O simulador não é uma recompensa: é a evidência.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{LABS.map((lab) => { const complete = labCompletion(lab, index.labProgress.filter((item) => item.labId === lab.id).map((item) => item.layerId)); return <Link key={lab.id} to={`/labs/${lab.id}`} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-lg"><div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: lab.accent }} /><div className="flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-lg" style={{ color: lab.accent }}><FlaskConical className="h-5 w-5" /></div><span className="num text-xs text-muted-foreground">{complete}%</span></div><h2 className="font-display mt-5 text-2xl text-primary">{lab.name}</h2><div className="text-xs uppercase tracking-[0.13em] text-secondary">{lab.subtitle}</div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{lab.description}</p><div className="mt-5 flex items-center justify-between text-xs font-medium text-card-foreground">{lab.layers.length} camadas <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div></Link>; })}</div></div>;
}

function LabDetail() {
  const { labId } = useParams(); const lab = labById(labId); const { index, replaceIndex } = useChiron();
  const [layerIndex, setLayerIndex] = useState(0); const [selectedMutations, setSelectedMutations] = useState<string[]>([]); const [prediction, setPrediction] = useState(""); const [explanation, setExplanation] = useState("");
  if (!lab) return <div className="mx-auto max-w-3xl"><Link to="/labs" className="text-sm text-secondary">← Voltar aos laboratórios</Link><h1 className="font-display mt-4 text-4xl">Laboratório não encontrado</h1></div>;
  const layer = lab.layers[layerIndex]; const active = activeMutations(layer, selectedMutations); const completed = index.labProgress.some((item) => item.labId === lab.id && item.layerId === layer.id);
  const broken = active.length > 0; const completion = labCompletion(lab, index.labProgress.filter((item) => item.labId === lab.id).map((item) => item.layerId));
  const toggleMutation = (id: string) => setSelectedMutations((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const complete = () => { if (!prediction.trim() || !explanation.trim()) return; replaceIndex(recordLabLayer(index, { labId: lab.id, layerId: layer.id, predictedCorrect: true, explanation, completedAt: new Date().toISOString() })); };
  return <div className="mx-auto max-w-7xl"><div className="mb-5 flex items-center justify-between"><Link to="/labs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Laboratórios</Link><div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted"><div className="h-full bg-secondary" style={{ width: `${completion}%` }} /></div>{completion}% concluído</div></div><div className="grid gap-5 xl:grid-cols-[230px_minmax(0,1fr)_340px]"><aside className="order-2 xl:order-1"><div className="sticky top-3 rounded-xl border border-border bg-card p-3"><div className="px-2 pb-3 text-xs uppercase tracking-[0.17em] text-muted-foreground">{lab.name}</div>{lab.layers.map((item, i) => { const done = index.labProgress.some((p) => p.labId === lab.id && p.layerId === item.id); return <button key={item.id} type="button" onClick={() => { setLayerIndex(i); setSelectedMutations([]); setPrediction(""); setExplanation(""); }} className={cn("flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left text-sm", i === layerIndex ? "bg-secondary/10 text-primary" : "text-muted-foreground hover:bg-accent")}><span className={cn("grid h-5 w-5 place-items-center rounded-full border text-[10px]", done ? "border-secondary bg-secondary text-secondary-foreground" : "border-border")}>{done ? <Check className="h-3 w-3" /> : i + 1}</span><span className="min-w-0 flex-1 truncate">{item.title}</span></button>; })}</div></aside><main className="order-1 min-w-0 xl:order-2"><div className="rounded-2xl border border-border bg-card p-6 sm:p-8"><div className="text-xs font-medium uppercase tracking-[0.18em] text-secondary">Camada {layerIndex + 1} · {layer.concept}</div><h1 className="font-display mt-2 text-3xl text-primary sm:text-4xl">{layer.title}</h1><div className="mt-6 rounded-xl border border-secondary/25 bg-secondary/5 p-4"><div className="text-xs font-medium uppercase tracking-[0.14em] text-secondary">Antes de ver o resultado</div><p className="mt-2 font-display text-xl leading-snug text-primary">{layer.question}</p><Textarea value={prediction} onChange={(event) => setPrediction(event.target.value)} placeholder="Escreva sua previsão antes de testar…" className="mt-4 min-h-20 bg-card" /></div><div className="mt-6"><div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Contrato da camada</div><p className="mt-2 text-sm leading-relaxed text-card-foreground">{layer.contract}</p><pre className="mt-4 overflow-x-auto rounded-lg bg-primary-deep p-4 text-xs text-primary-foreground"><code>{layer.code}</code></pre></div><div className="mt-6"><LabScene kind={lab.kind} broken={broken} /></div></div></main><aside className="order-3"><div className="sticky top-3 space-y-4"><div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"><ShieldCheck className="h-4 w-4 text-secondary" /> Invariantes ao vivo</div><div className="mt-3 space-y-2">{layer.invariants.map((invariant) => { const fails = invariantIsBroken(invariant.id, active); return <div key={invariant.id} className={cn("rounded-lg border p-3", fails ? "border-destructive/40 bg-destructive/5" : "border-secondary/25 bg-secondary/5")}><div className="flex items-center gap-2 text-sm font-medium"><span className={cn("grid h-5 w-5 place-items-center rounded-full", fails ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground")}>{fails ? <TriangleAlert className="h-3 w-3" /> : <Check className="h-3 w-3" />}</span>{invariant.label}</div>{fails && <p className="mt-2 text-xs leading-relaxed text-destructive">{invariant.failure}</p>}</div>; })}</div></div>{layer.mutations.length > 0 && <div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"><Sparkles className="h-4 w-4 text-secondary" /> Mutações deliberadas</div><div className="mt-3 space-y-2">{layer.mutations.map((mutation) => <label key={mutation.id} className="block cursor-pointer rounded-lg border border-border p-3 text-sm hover:bg-accent"><div className="flex gap-2"><input type="checkbox" checked={selectedMutations.includes(mutation.id)} onChange={() => toggleMutation(mutation.id)} className="mt-0.5 accent-[hsl(var(--secondary))]" /><span><span className="font-medium">{mutation.label}</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{mutation.hypothesis}</span></span></div></label>)}</div></div>}<div className="rounded-xl border border-border bg-card p-4"><label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Explique o que a invariante prova</label><Textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} placeholder="Não descreva só o vermelho; explique a causa…" className="mt-3 min-h-24" /><Button className="mt-3 w-full" onClick={complete} disabled={completed || !prediction.trim() || !explanation.trim()}>{completed ? <><Check className="mr-2 h-4 w-4" /> Camada concluída</> : "Registrar entendimento"}</Button>{completed && layerIndex < lab.layers.length - 1 && <Button variant="outline" className="mt-2 w-full" onClick={() => setLayerIndex(layerIndex + 1)}>Próxima camada <ArrowRight className="ml-2 h-4 w-4" /></Button>}</div></div></aside></div></div>;
}

export default function Labs() { const { labId } = useParams(); return labId ? <LabDetail /> : <LabIndex />; }
