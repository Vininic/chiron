// Hand-rolled SVG chart primitives for the F4 dashboard — no charting
// library in the project, and the dataviz skill's own guidance is to build
// each mark in plain markup rather than reach for a dependency. Mark specs
// (2px lines, 4px rounded bar caps, ~10% area fill, hairline gridlines,
// direct labels, legend for 2+ series) follow the skill's
// marks-and-anatomy.md. Colors are the theme-safe `CHART_VARS`/`MASTERY_VARS`
// (`hsl(var(--chart-N))`) from lib/color.ts, never the frozen-light-mode
// `CHART_HEX`/`MASTERY_HEX` hex strings — a mark painted with raw hex would
// stay light-mode-colored after switching to dark, silently stepping outside
// the palette validated for the dark chart surface.
import { useMemo, useState } from "react";
import { CHART_VARS, MASTERY_VARS } from "@/lib/color";

const RUBRIC = CHART_VARS[0];
const IRON_BLUE = CHART_VARS[1];
const VERDIGRIS = CHART_VARS[2];
const VIOLET = CHART_VARS[3];

// ── Sparkline ────────────────────────────────────────────────────────────
export function Sparkline({ values, width = 120, height = 32, color = IRON_BLUE }: {
  values: number[]; width?: number; height?: number; color?: string;
}) {
  const max = Math.max(1, ...values);
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;
  const points = values.map((v, i) => `${i * stepX},${height - (v / max) * (height - 4) - 2}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" aria-hidden>
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Streak ring: last N days as segments around a circle ────────────────
export function StreakRing({ days, size = 92, label }: { days: boolean[]; size?: number; label: string }) {
  const stroke = 7;
  const r = size / 2 - stroke;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  const gap = 3; // px of surface-color gap between segments
  const segLen = circumference / days.length - gap;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={c} cy={c} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
        {days.map((studied, i) => (
          <circle
            key={i}
            cx={c} cy={c} r={r}
            fill="none"
            stroke={studied ? RUBRIC : "transparent"}
            strokeWidth={stroke}
            strokeDasharray={`${segLen} ${circumference - segLen}`}
            strokeDashoffset={-(i * (circumference / days.length))}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display num text-2xl text-card-foreground">{days.filter(Boolean).length > 0 ? label : "0"}</div>
        </div>
      </div>
    </div>
  );
}

// ── Mastery donut: 5-step ordered ramp, proportional segments ───────────
export function MasteryDonut({ counts, size = 92 }: { counts: number[]; size?: number }) {
  const stroke = 12;
  const r = size / 2 - stroke;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  let offset = 0;
  const segments = counts.map((count, i) => {
    const len = (count / total) * circumference;
    const seg = { i, len, offset };
    offset += len;
    return seg;
  });
  const masteredPct = total > 0 ? Math.round(((counts[3] + counts[4]) / total) * 100) : 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={c} cy={c} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
        {segments.filter((s) => s.len > 0).map((s) => (
          <circle
            key={s.i}
            cx={c} cy={c} r={r}
            fill="none"
            stroke={MASTERY_VARS[s.i]}
            strokeWidth={stroke}
            strokeDasharray={`${Math.max(0, s.len - 2)} ${circumference}`}
            strokeDashoffset={-s.offset}
          />
        ))}
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="font-display num text-xl text-card-foreground">{masteredPct}%</div>
      </div>
    </div>
  );
}

// ── Dual area chart: theory vs practice minutes, N days ──────────────────
export interface AreaSeriesPoint { date: string; theoryMin: number; practiceMin: number }

export function ActivityAreaChart({ data, width = 560, height = 200 }: {
  data: AreaSeriesPoint[]; width?: number; height?: number;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const padding = { top: 8, right: 8, bottom: 20, left: 32 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const max = Math.max(1, ...data.map((d) => Math.max(d.theoryMin, d.practiceMin)));
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
  const yTicks = useMemo(() => {
    const step = Math.ceil(max / 3 / 5) * 5 || 5;
    return [0, step, step * 2, step * 3].filter((v) => v <= max * 1.05);
  }, [max]);

  const x = (i: number) => padding.left + i * stepX;
  const y = (v: number) => padding.top + innerH - (v / max) * innerH;

  function pathFor(key: "theoryMin" | "practiceMin") {
    const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d[key])}`).join(" ");
    const area = `${line} L${x(data.length - 1)},${padding.top + innerH} L${x(0)},${padding.top + innerH} Z`;
    return { line, area };
  }
  const theory = pathFor("theoryMin");
  const practice = pathFor("practiceMin");

  const hovered = hoverIdx !== null ? data[hoverIdx] : null;

  return (
    <div className="relative">
      <svg
        width={width} height={height} viewBox={`0 0 ${width} ${height}`}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const relX = ((e.clientX - rect.left) / rect.width) * width - padding.left;
          const idx = Math.round(relX / stepX);
          setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
        }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={padding.left} x2={width - padding.right} y1={y(tick)} y2={y(tick)} stroke="hsl(var(--border))" strokeWidth={1} />
            <text x={padding.left - 6} y={y(tick)} textAnchor="end" dominantBaseline="middle" className="fill-muted-foreground text-[9px]">{tick}</text>
          </g>
        ))}

        {hoverIdx !== null && (
          <line x1={x(hoverIdx)} x2={x(hoverIdx)} y1={padding.top} y2={padding.top + innerH} stroke="hsl(var(--border))" strokeWidth={1} />
        )}

        <path d={theory.area} fill={RUBRIC} fillOpacity={0.1} stroke="none" />
        <path d={theory.line} fill="none" stroke={RUBRIC} strokeWidth={2} strokeLinejoin="round" />
        <path d={practice.area} fill={IRON_BLUE} fillOpacity={0.1} stroke="none" />
        <path d={practice.line} fill="none" stroke={IRON_BLUE} strokeWidth={2} strokeLinejoin="round" />

        {hovered && (
          <>
            <circle cx={x(hoverIdx!)} cy={y(hovered.theoryMin)} r={4} fill={RUBRIC} stroke="hsl(var(--card))" strokeWidth={2} />
            <circle cx={x(hoverIdx!)} cy={y(hovered.practiceMin)} r={4} fill={IRON_BLUE} stroke="hsl(var(--card))" strokeWidth={2} />
          </>
        )}

        {data.map((d, i) => (
          (i === 0 || i === data.length - 1 || i % 7 === 0) && (
            <text key={d.date} x={x(i)} y={height - 4} textAnchor="middle" className="fill-muted-foreground text-[9px]">
              {d.date.slice(5)}
            </text>
          )
        ))}
      </svg>

      {hovered && hoverIdx !== null && (
        <div
          className="pointer-events-none absolute top-1 rounded-md border border-border bg-popover px-2.5 py-1.5 text-[11px] shadow-md"
          style={{ left: Math.min(width - 140, Math.max(0, x(hoverIdx) - 60)) }}
        >
          <div className="text-muted-foreground">{hovered.date}</div>
          <div className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded-full" style={{ background: RUBRIC }} /> <span className="text-card-foreground">{hovered.theoryMin}min</span> teoria</div>
          <div className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded-full" style={{ background: IRON_BLUE }} /> <span className="text-card-foreground">{hovered.practiceMin}min</span> prática</div>
        </div>
      )}

      <div className="mt-1 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded-full" style={{ background: RUBRIC }} /> Teoria</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded-full" style={{ background: IRON_BLUE }} /> Prática</span>
      </div>
    </div>
  );
}

// ── Weekly retention: grouped bars (correct vs lapses) + recall-rate line ─
export interface RetentionPoint { weekStart: string; firstTryCorrect: number; lapses: number; recallRate: number }

export function RetentionChart({ data, width = 560, height = 200 }: { data: RetentionPoint[]; width?: number; height?: number }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const padding = { top: 8, right: 8, bottom: 20, left: 28 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const maxCount = Math.max(1, ...data.map((d) => d.firstTryCorrect + d.lapses));
  const groupW = data.length > 0 ? innerW / data.length : 0;
  const barW = Math.min(24, groupW * 0.32);
  const gap = 3;

  const yCount = (v: number) => padding.top + innerH - (v / maxCount) * innerH;
  const yRate = (v: number) => padding.top + innerH - v * innerH;

  const linePoints = data.map((d, i) => `${padding.left + i * groupW + groupW / 2},${yRate(d.recallRate)}`).join(" ");
  const hovered = hoverIdx !== null ? data[hoverIdx] : null;

  return (
    <div className="relative">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {[0, 0.5, 1].map((frac) => (
          <line key={frac} x1={padding.left} x2={width - padding.right} y1={padding.top + innerH * (1 - frac)} y2={padding.top + innerH * (1 - frac)} stroke="hsl(var(--border))" strokeWidth={1} />
        ))}

        {data.map((d, i) => {
          const gx = padding.left + i * groupW + groupW / 2;
          const correctH = innerH - (yCount(d.firstTryCorrect) - padding.top);
          const lapseH = innerH - (yCount(d.lapses) - padding.top);
          return (
            <g
              key={d.weekStart}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            >
              <rect x={gx - barW - gap / 2} y={yCount(d.firstTryCorrect)} width={barW} height={correctH} rx={4} fill={VERDIGRIS} opacity={hoverIdx === null || hoverIdx === i ? 1 : 0.4} />
              <rect x={gx + gap / 2} y={yCount(d.lapses)} width={barW} height={lapseH} rx={4} fill={RUBRIC} opacity={hoverIdx === null || hoverIdx === i ? 1 : 0.4} />
              <rect x={gx - groupW / 2} y={padding.top} width={groupW} height={innerH} fill="transparent" />
            </g>
          );
        })}

        <polyline points={linePoints} fill="none" stroke={VIOLET} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <circle key={d.weekStart} cx={padding.left + i * groupW + groupW / 2} cy={yRate(d.recallRate)} r={3} fill={VIOLET} stroke="hsl(var(--card))" strokeWidth={1.5} />
        ))}

        {data.map((d, i) => (
          <text key={d.weekStart} x={padding.left + i * groupW + groupW / 2} y={height - 4} textAnchor="middle" className="fill-muted-foreground text-[9px]">
            {d.weekStart.slice(5)}
          </text>
        ))}
      </svg>

      {hovered && hoverIdx !== null && (
        <div
          className="pointer-events-none absolute top-1 rounded-md border border-border bg-popover px-2.5 py-1.5 text-[11px] shadow-md"
          style={{ left: Math.min(width - 150, Math.max(0, padding.left + hoverIdx * groupW)) }}
        >
          <div className="text-muted-foreground">Semana de {hovered.weekStart}</div>
          <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: VERDIGRIS }} /> <span className="text-card-foreground">{hovered.firstTryCorrect}</span> acertos</div>
          <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: RUBRIC }} /> <span className="text-card-foreground">{hovered.lapses}</span> lapsos</div>
          <div className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded-full" style={{ background: VIOLET }} /> <span className="text-card-foreground">{Math.round(hovered.recallRate * 100)}%</span> retenção</div>
        </div>
      )}

      <div className="mt-1 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: VERDIGRIS }} /> Acertos de primeira</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: RUBRIC }} /> Lapsos</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded-full" style={{ background: VIOLET }} /> Retenção</span>
      </div>
    </div>
  );
}
