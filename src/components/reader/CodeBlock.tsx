// Syntax-highlighted code block for the F6 reader. `prismjs` is dynamically
// imported (same call as F3's exceljs/F4's charts precedent: a real but
// occasional-use dependency shouldn't sit in the main bundle every route
// pays for) — only the languages this app's content actually uses are
// registered, not Prism's full component set.
import { useEffect, useState } from "react";
import { LANG_ALIASES, loadPrism } from "@/lib/prism";

export default function CodeBlock({
  code, lang, caption, highlight,
}: {
  code: string; lang: string; caption?: string; highlight?: number[];
}) {
  const [html, setHtml] = useState<string | null>(null);
  const normalizedLang = LANG_ALIASES[lang.toLowerCase()] ?? lang.toLowerCase();
  const highlighted = new Set(highlight ?? []);

  useEffect(() => {
    let cancelled = false;
    loadPrism().then((Prism) => {
      if (cancelled) return;
      const grammar = Prism.languages[normalizedLang];
      setHtml(grammar ? Prism.highlight(code, grammar, normalizedLang) : null);
    });
    return () => { cancelled = true; };
  }, [code, normalizedLang]);

  const lines = (html ?? escapeHtml(code)).split("\n");

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {caption && (
        <div className="border-b border-border bg-muted px-3 py-1.5 text-[11px] text-muted-foreground">{caption}</div>
      )}
      <pre className="prism-code overflow-x-auto bg-primary-deep p-0 text-xs leading-relaxed text-primary-foreground">
        <code>
          {lines.map((line, i) => (
            <div
              key={i}
              className={highlighted.has(i + 1) ? "bg-secondary/15 px-4" : "px-4"}
              style={{ borderLeft: highlighted.has(i + 1) ? "2px solid hsl(var(--secondary))" : "2px solid transparent" }}
              dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
            />
          ))}
        </code>
      </pre>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
