import { useNavigate } from "react-router-dom";
import { ExternalLink, FlaskConical, MessageCircleQuestion, Sparkles, Wand2 } from "lucide-react";
import type { ApostilaSection } from "@/lib/study/types";

export default function MarginRail({ section }: { section: ApostilaSection }) {
  const navigate = useNavigate();
  const cites = section.blocks.filter((b) => b.kind === "cite");
  const labref = section.blocks.find((b) => b.kind === "labref");

  function askAetheris(kind: "question" | "cards" | "deeper") {
    const prompts: Record<typeof kind, string> = {
      question: `Me questione sobre "${section.title}" para eu confirmar que entendi de verdade.`,
      cards: `Gere cards de revisão a partir da seção "${section.title}".`,
      deeper: `Explique "${section.title}" mais a fundo, com mais detalhe do que a seção cobre.`,
    };
    navigate(`/aetheris?prompt=${encodeURIComponent(prompts[kind])}`);
  }

  return (
    <aside className="space-y-4">
      <div className="chiron-card space-y-1.5 p-3">
        <button type="button" onClick={() => askAetheris("question")} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-card-foreground transition-colors hover:bg-accent">
          <MessageCircleQuestion className="h-3.5 w-3.5 shrink-0 text-secondary" /> Me questione sobre isso
        </button>
        <button type="button" onClick={() => askAetheris("cards")} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-card-foreground transition-colors hover:bg-accent">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-secondary" /> Gerar cards
        </button>
        <button type="button" onClick={() => askAetheris("deeper")} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-card-foreground transition-colors hover:bg-accent">
          <Wand2 className="h-3.5 w-3.5 shrink-0 text-secondary" /> Explicar mais fundo
        </button>
      </div>

      {labref && (
        <div className="chiron-card p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <FlaskConical className="h-3.5 w-3.5 text-secondary" /> Laboratório
          </div>
          <button type="button" onClick={() => navigate(`/labs/${labref.labId}`)} className="mt-1.5 text-left text-xs text-secondary hover:underline">
            Abrir a camada interativa
          </button>
        </div>
      )}

      {cites.length > 0 && (
        <div className="chiron-card space-y-2 p-3">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Citações</div>
          {cites.map((cite, i) => {
            if (cite.kind !== "cite") return null;
            const label = [cite.file, cite.symbol].filter(Boolean).join(" · ");
            const content = (
              <div className="rounded-md border border-border bg-muted px-2.5 py-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1 font-mono">
                  {label}
                  {cite.url && <ExternalLink className="h-2.5 w-2.5 shrink-0" />}
                </div>
                {cite.lines && <div>linhas {cite.lines[0]}–{cite.lines[1]}</div>}
              </div>
            );
            return cite.url ? (
              <a key={i} href={cite.url} target="_blank" rel="noreferrer" className="block hover:opacity-80">{content}</a>
            ) : <div key={i}>{content}</div>;
          })}
        </div>
      )}
    </aside>
  );
}
