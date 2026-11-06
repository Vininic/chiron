// The F5 map canvas: real DAG layout (lib/maps/layout.ts) rendered as pan/
// zoomable SVG, nodes tinted by mastery, prerequisite edges with a
// directional arrowhead, locked nodes dimmed with a lock glyph. Hand-rolled
// pan/zoom on the SVG viewBox — same "no new dependency for a chart-shaped
// thing" call as F4's charts.tsx, and pan/zoom-on-viewBox is a well-known,
// small technique that doesn't need a library.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { computeDagLayout, NODE_WIDTH, NODE_HEIGHT } from "@/lib/maps/layout";
import { MASTERY_VARS } from "@/lib/color";
import type { MapNode, Mastery } from "@/lib/study/types";

const PADDING = 48;
const MIN_SCALE = 0.3;
const MAX_SCALE = 2.5;

interface ViewBox { x: number; y: number; w: number; h: number }

function isLocked(node: MapNode, byId: Map<string, MapNode>): boolean {
  return node.requires.some((reqId) => {
    const req = byId.get(reqId);
    return req !== undefined && req.mastery < 3;
  });
}

export default function MapCanvas({
  nodes, selectedId, onSelect,
}: {
  nodes: MapNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const layout = useMemo(() => computeDagLayout(nodes), [nodes]);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const layoutById = useMemo(() => new Map(layout.nodes.map((n) => [n.id, n])), [layout.nodes]);

  const fitViewBox = useMemo<ViewBox>(() => ({
    x: -PADDING, y: -PADDING,
    w: layout.width + PADDING * 2, h: layout.height + PADDING * 2,
  }), [layout.width, layout.height]);

  const [viewBox, setViewBox] = useState<ViewBox>(fitViewBox);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; vb: ViewBox } | null>(null);

  // Reset the view whenever the node SET changes (a different source was
  // selected) — keyed on the sorted id list, not on `fitViewBox` itself, so
  // a mastery update (which changes nothing about which nodes exist, only
  // their color) never yanks the view out from under someone mid pan/zoom.
  const nodeSetKey = useMemo(() => [...nodes.map((n) => n.id)].sort().join(","), [nodes]);
  useEffect(() => {
    setViewBox(fitViewBox);
    // fitViewBox intentionally excluded — see comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeSetKey]);

  const fitToScreen = useCallback(() => {
    setViewBox(fitViewBox);
  }, [fitViewBox]);

  // React attaches its synthetic onWheel as a passive listener (it assumes
  // wheel handlers only read scroll, never block it), so calling
  // preventDefault() through that prop throws "Unable to preventDefault
  // inside passive event listener invocation" — confirmed live, it doesn't
  // just warn, the page also scrolls out from under the zoom gesture.
  // Attaching the native listener ourselves with { passive: false } is the
  // documented fix, not a workaround.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      const rect = svg!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      setViewBox((vb) => {
        const scale = Math.exp(-e.deltaY * 0.001);
        const newW = Math.min(fitViewBox.w / MIN_SCALE, Math.max(fitViewBox.w / MAX_SCALE, vb.w / scale));
        const newH = newW * (vb.h / vb.w);
        const cx = vb.x + px * vb.w;
        const cy = vb.y + py * vb.h;
        return { x: cx - px * newW, y: cy - py * newH, w: newW, h: newH };
      });
    }

    svg.addEventListener("wheel", handleWheel, { passive: false });
    return () => svg.removeEventListener("wheel", handleWheel);
  }, [fitViewBox]);

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if ((e.target as SVGElement).closest("[data-node]")) return; // let node clicks through
    dragRef.current = { startX: e.clientX, startY: e.clientY, vb: viewBox };
    (e.target as Element).setPointerCapture(e.pointerId);
  }, [viewBox]);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragRef.current.startX) * (dragRef.current.vb.w / rect.width);
    const dy = (e.clientY - dragRef.current.startY) * (dragRef.current.vb.h / rect.height);
    setViewBox({ ...dragRef.current.vb, x: dragRef.current.vb.x - dx, y: dragRef.current.vb.y - dy });
  }, []);

  const onPointerUp = useCallback(() => { dragRef.current = null; }, []);

  const scalePct = Math.round((fitViewBox.w / viewBox.w) * 100);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card" style={{ height: 520 }}>
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <defs>
          <marker id="map-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="fill-muted-foreground" />
          </marker>
        </defs>

        {/* Edges — drawn first, under nodes */}
        {nodes.map((n) =>
          n.requires.map((reqId) => {
            const from = layoutById.get(reqId);
            const to = layoutById.get(n.id);
            if (!from || !to) return null;
            const x1 = from.x + NODE_WIDTH / 2;
            const y1 = from.y + NODE_HEIGHT;
            const x2 = to.x + NODE_WIDTH / 2;
            const y2 = to.y;
            const midY = (y1 + y2) / 2;
            return (
              <path
                key={`${reqId}-${n.id}`}
                d={`M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`}
                fill="none"
                className="stroke-border"
                strokeWidth={1.5}
                markerEnd="url(#map-arrow)"
              />
            );
          }),
        )}

        {/* Nodes */}
        {layout.nodes.map((pos) => {
          const node = byId.get(pos.id);
          if (!node) return null;
          const locked = isLocked(node, byId);
          const selected = selectedId === node.id;
          return (
            <g
              key={node.id}
              data-node
              transform={`translate(${pos.x}, ${pos.y})`}
              className={locked ? "cursor-not-allowed" : "cursor-pointer"}
              onClick={() => { if (!locked) onSelect(node.id); }}
            >
              <rect
                width={NODE_WIDTH} height={NODE_HEIGHT} rx={10}
                fill={locked ? "hsl(var(--muted))" : "hsl(var(--card))"}
                stroke={selected ? "hsl(var(--secondary))" : MASTERY_VARS[node.mastery]}
                strokeWidth={selected ? 3 : 2}
                opacity={locked ? 0.55 : 1}
              />
              {!locked && (
                <rect x={0} y={0} width={5} height={NODE_HEIGHT} rx={2} fill={MASTERY_VARS[node.mastery]} />
              )}
              {locked ? (
                <Lock x={10} y={NODE_HEIGHT / 2 - 7} width={14} height={14} className="text-muted-foreground" />
              ) : null}
              <foreignObject x={locked ? 30 : 14} y={6} width={NODE_WIDTH - (locked ? 40 : 24)} height={NODE_HEIGHT - 12}>
                <div className="flex h-full flex-col justify-center overflow-hidden">
                  <div className={`truncate text-[12px] font-medium leading-tight ${locked ? "text-muted-foreground" : "text-card-foreground"}`}>
                    {node.title}
                  </div>
                  <div className="truncate text-[10px] text-muted-foreground">{node.kind}</div>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      {/* Minimap */}
      <div className="absolute bottom-3 right-3 h-24 w-32 overflow-hidden rounded-md border border-border bg-background/90 shadow-sm">
        <svg viewBox={`${-PADDING} ${-PADDING} ${layout.width + PADDING * 2} ${layout.height + PADDING * 2}`} className="h-full w-full">
          {layout.nodes.map((pos) => {
            const node = byId.get(pos.id);
            return (
              <rect
                key={pos.id}
                x={pos.x} y={pos.y} width={NODE_WIDTH} height={NODE_HEIGHT} rx={6}
                fill={node ? MASTERY_VARS[node.mastery] : "hsl(var(--border))"}
                opacity={0.7}
              />
            );
          })}
          <rect
            x={viewBox.x} y={viewBox.y} width={viewBox.w} height={viewBox.h}
            fill="none" className="stroke-secondary" strokeWidth={Math.max(2, layout.width / 200)}
          />
        </svg>
      </div>

      <button
        type="button"
        onClick={fitToScreen}
        className="absolute bottom-3 left-3 rounded-md border border-border bg-background/90 px-2.5 py-1.5 text-[11px] text-muted-foreground shadow-sm transition-colors hover:text-foreground"
      >
        Ajustar à tela · {scalePct}%
      </button>
    </div>
  );
}
