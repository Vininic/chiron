import type { Block } from "@/lib/study/types";
import Markdown from "@/components/Markdown";
import CodeBlock from "@/components/reader/CodeBlock";
import { AlertTriangle, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

/** Renders a section's typed `Block[]` (types.ts). This is a minimal bridge,
 *  not the real reader — PLANO.md §7 (F6) replaces this with the three-pane
 *  layout (margin rail, syntax highlighting, step-by-step `algo`, side-by-side
 *  `compare`). This exists so F1's model change doesn't leave the Apostila
 *  page rendering nothing; every block kind gets *some* legible treatment,
 *  even the ones (`labref`/`exref`) that only make sense once Labs (F7) and
 *  the richer Practice runner (F6) exist to link to. */
export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <BlockItem key={i} block={block} />
      ))}
    </div>
  );
}

function BlockItem({ block }: { block: Block }) {
  switch (block.kind) {
    case "prose":
      return <Markdown text={block.md} />;

    case "code":
      return <CodeBlock code={block.code} lang={block.lang} caption={block.caption} highlight={block.highlight} />;

    case "porque":
      return (
        <div className="flex gap-2.5 rounded-lg border border-secondary/30 bg-secondary/5 p-4">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
          <div className="min-w-0 flex-1 text-sm text-card-foreground">
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-secondary">Por que</div>
            <Markdown text={block.md} />
          </div>
        </div>
      );

    case "quebraria":
      return (
        <div className="flex gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div className="min-w-0 flex-1 text-sm text-card-foreground">
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-destructive">O que quebraria</div>
            <Markdown text={block.md} />
          </div>
        </div>
      );

    case "compare":
      return (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {[block.left, block.right].map((side, i) => (
              <CodeBlock key={i} code={side.code} lang={side.lang} caption={side.caption} />
            ))}
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-sm text-card-foreground">
            <Markdown text={block.verdictMd} />
          </div>
        </div>
      );

    case "algo":
      return (
        <ol className="space-y-3">
          {block.steps.map((step, i) => (
            <li key={i} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-secondary/10 text-[11px] text-secondary">{i + 1}</span>
                {step.title}
              </div>
              <div className="mt-2 text-sm text-card-foreground"><Markdown text={step.md} /></div>
              {step.code && (
                <pre className="mt-2 overflow-x-auto rounded-md bg-primary-deep p-3 text-xs text-primary-foreground">
                  <code>{step.code}</code>
                </pre>
              )}
            </li>
          ))}
        </ol>
      );

    case "diagram":
      return (
        <figure className="rounded-lg border border-border bg-card p-4">
          <div className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: block.svg }} />
          <figcaption className="mt-2 text-center text-xs text-muted-foreground">{block.caption}</figcaption>
        </figure>
      );

    case "cite": {
      const label = [block.file, block.symbol].filter(Boolean).join(" · ");
      const content = (
        <div className="rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
          <span className="font-mono">{label}</span>
          {block.lines && <span> · linhas {block.lines[0]}–{block.lines[1]}</span>}
        </div>
      );
      return block.url ? (
        <a href={block.url} target="_blank" rel="noreferrer" className="block hover:opacity-80">{content}</a>
      ) : content;
    }

    case "labref":
      return (
        <Link to={`/labs/${block.labId}`} className="block rounded-lg border border-dashed border-secondary/40 bg-secondary/5 p-3 text-xs text-secondary transition-colors hover:bg-secondary/10">
          Abrir laboratório · camada {block.layerId}
        </Link>
      );

    case "exref":
      return (
        <div className="rounded-lg border border-dashed border-border bg-card p-3 text-xs text-muted-foreground">
          Exercício relacionado disponível na Prática
        </div>
      );

    default:
      return null;
  }
}
