import { Fragment, useEffect, useState, type ReactNode } from "react";
import { LANG_ALIASES, loadPrism } from "@/lib/prism";

/** Same lazy Prism highlighting as reader/CodeBlock.tsx, applied to Markdown's
 *  own fenced code blocks (exercise prompts, Aetheris chat replies) — those
 *  never go through CodeBlock since they arrive as one mixed prose+code
 *  string, not a structured `Block`. */
function FencedCode({ lang, code }: { lang: string; code: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const normalizedLang = LANG_ALIASES[lang.toLowerCase()] ?? lang.toLowerCase();

  useEffect(() => {
    let cancelled = false;
    loadPrism().then((Prism) => {
      if (cancelled) return;
      const grammar = Prism.languages[normalizedLang];
      setHtml(grammar ? Prism.highlight(code, grammar, normalizedLang) : null);
    });
    return () => { cancelled = true; };
  }, [code, normalizedLang]);

  return (
    <pre className="mb-4 overflow-x-auto rounded-lg border border-border bg-primary-deep p-4 text-[13px] leading-relaxed text-primary-foreground">
      {html ? (
        <code className={`language-${lang}`} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <code className={`language-${lang}`}>{code}</code>
      )}
    </pre>
  );
}

/** Dependency-free markdown renderer for Chiron apostilas. The seed content is a
 *  predictable subset — headings, fenced code blocks, bullet/numbered lists,
 *  bold/italic/inline-code — so a small block scanner covers it without pulling in
 *  a full markdown stack. Crucially it renders fenced ```code blocks``` as real
 *  <pre> (the apostilas lean on code samples heavily), which the previous
 *  line-per-<p> approach dumped as raw backticked text. */

/** Heading → anchor id, so a section's own headings are link-targetable
 *  (F6's "âncoras por heading"). Not unique-guaranteed across an entire
 *  document — two sections with an identically-worded heading would collide
 *  — but every consumer today renders one section's markdown at a time, so
 *  that collision isn't reachable in practice. */
function slugify(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

function renderInline(text: string, keyBase: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*|`(.+?)`|\*(.+?)\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[2] !== undefined) parts.push(<strong key={`${keyBase}-${i}`}>{match[2]}</strong>);
    else if (match[3] !== undefined)
      parts.push(
        <code key={`${keyBase}-${i}`} className="rounded bg-foreground/10 px-1 py-0.5 text-[0.85em] text-secondary">{match[3]}</code>,
      );
    else if (match[4] !== undefined) parts.push(<em key={`${keyBase}-${i}`}>{match[4]}</em>);
    last = re.lastIndex;
    i += 1;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let code: { lang: string; lines: string[] } | null = null;

  const flushList = (key: string) => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={key} className={list.ordered ? "mb-4 list-decimal space-y-1 pl-6" : "mb-4 list-disc space-y-1 pl-6"}>
        {list.items.map((item, idx) => (
          <li key={idx} className="leading-relaxed">{renderInline(item, `${key}-${idx}`)}</li>
        ))}
      </Tag>,
    );
    list = null;
  };

  lines.forEach((line, idx) => {
    const fence = /^```(\w*)\s*$/.exec(line.trim());

    // Inside a fenced code block: accumulate raw lines until the closing fence.
    if (code) {
      if (fence) {
        blocks.push(<FencedCode key={`code-${idx}`} lang={code.lang} code={code.lines.join("\n")} />);
        code = null;
      } else {
        code.lines.push(line);
      }
      return;
    }

    if (fence) {
      flushList(`list-${idx}`);
      code = { lang: fence[1] || "text", lines: [] };
      return;
    }

    const heading = /^(#{1,4})\s+(.*)/.exec(line);
    const bullet = /^\s*[-*]\s+(.*)/.exec(line);
    const numbered = /^\s*\d+[.)]\s+(.*)/.exec(line);

    if (heading) {
      flushList(`list-${idx}`);
      const level = heading[1].length;
      const cls =
        level === 1 ? "mb-3 mt-6 font-display text-xl text-primary"
        : level === 2 ? "mb-2 mt-5 font-display text-lg text-primary"
        : "mb-2 mt-4 text-sm font-semibold uppercase tracking-wide text-secondary";
      const slug = slugify(heading[2]);
      blocks.push(<p key={idx} id={slug} className={`scroll-mt-20 ${cls}`}>{renderInline(heading[2], `h-${idx}`)}</p>);
    } else if (bullet) {
      if (!list || list.ordered) flushList(`list-${idx}`);
      list ??= { ordered: false, items: [] };
      list.items.push(bullet[1]);
    } else if (numbered) {
      if (!list || !list.ordered) flushList(`list-${idx}`);
      list ??= { ordered: true, items: [] };
      list.items.push(numbered[1]);
    } else if (line.trim() === "") {
      flushList(`list-${idx}`);
    } else {
      flushList(`list-${idx}`);
      blocks.push(<p key={idx} className="mb-3 leading-relaxed">{renderInline(line, `p-${idx}`)}</p>);
    }
  });
  flushList("list-end");
  if (code) {
    // Unclosed fence — still render what we captured rather than dropping it.
    blocks.push(<FencedCode key="code-end" lang={code.lang} code={code.lines.join("\n")} />);
  }

  return <div>{blocks.map((b, i) => <Fragment key={i}>{b}</Fragment>)}</div>;
}
