import { BookMarked, FlaskConical, Github, Sparkles } from "lucide-react";
import type { ContentOrigin } from "@/lib/study/types";
import { cn } from "@/lib/utils";

// Where a source came from (PLANO.md §R.4). Told apart by icon and outline,
// not only colour: Sistema (curated, ships with the app) is solid; Criada no
// app is the person's AI-generated book; GitHub is an ingested repository;
// Demonstração is legacy placeholder content, dashed because it is not a book.
const ORIGIN: Record<ContentOrigin, { label: string; icon: typeof BookMarked; className: string }> = {
  built_in: { label: "Sistema", icon: BookMarked, className: "border-secondary/40 bg-secondary/10 text-secondary" },
  ai_generated: { label: "Criada no app", icon: Sparkles, className: "border-primary/30 bg-primary/5 text-primary" },
  github_ingested: { label: "Ingerida do GitHub", icon: Github, className: "border-border bg-muted text-card-foreground" },
  legacy_seed: { label: "Demonstração", icon: FlaskConical, className: "border-dashed border-muted-foreground/50 text-muted-foreground" },
};

export function originLabel(origin: ContentOrigin | undefined): string | null {
  return origin ? ORIGIN[origin].label : null;
}

/** `compact` keeps only the icon (with the label as tooltip and for screen
 *  readers) for dense rows like the map's source selector. */
export default function OriginBadge({ origin, className, compact }: { origin: ContentOrigin | undefined; className?: string; compact?: boolean }) {
  if (!origin) return null;
  const { label, icon: Icon, className: tone } = ORIGIN[origin];
  if (compact) {
    return (
      <span title={label} className={cn("inline-grid h-4 w-4 shrink-0 place-items-center rounded-full border", tone, className)}>
        <Icon className="h-2.5 w-2.5" aria-hidden />
        <span className="sr-only">{label}</span>
      </span>
    );
  }
  return (
    <span
      title={label}
      className={cn("inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-px text-[9px] font-medium uppercase tracking-[0.1em]", tone, className)}
    >
      <Icon className="h-2.5 w-2.5" aria-hidden />
      {label}
    </span>
  );
}
