import { CheckCircle2, FilePlus2, FlaskConical, GraduationCap, Layers3, ListPlus, Sparkles } from "lucide-react";
import type { AetherisAction } from "@/lib/ai/actions";
import { describeAction } from "@/lib/ai/actions";
import type { ChironIndex } from "@/lib/study/types";

const ICON = { create_cards: Layers3, add_exercise: FilePlus2, adjust_mastery: GraduationCap, plan_session: ListPlus, add_source: FilePlus2, ingest_source: Sparkles, annotate_section: FilePlus2, generate_lab: FlaskConical } satisfies Record<AetherisAction["type"], typeof Sparkles>;
export default function ActionPill({ action, index, onApply }: { action: AetherisAction; index: ChironIndex; onApply: () => void }) {
  const Icon = ICON[action.type];
  return <button type="button" onClick={onApply} className="flex w-full items-center gap-2 rounded-lg border border-secondary/30 bg-secondary/5 px-3 py-2 text-left text-xs text-card-foreground transition-colors hover:bg-secondary/10"><span className="grid h-6 w-6 place-items-center rounded-full bg-secondary/15 text-secondary"><Icon className="h-3.5 w-3.5" /></span><span className="flex-1">{describeAction(index, action)}</span><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /></button>;
}
