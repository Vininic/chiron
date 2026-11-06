// Shared lazy Prism loader — extracted from reader/CodeBlock.tsx so Markdown's
// fenced code rendering (exercise prompts, Aetheris chat) can reuse the same
// dynamic-import discipline instead of loading Prism a second time.
export const LANG_ALIASES: Record<string, string> = {
  py: "python", js: "javascript", ts: "typescript", jsx: "jsx", tsx: "tsx",
  sh: "bash", shell: "bash", json: "json", css: "css", html: "markup",
};

let prismReady: Promise<typeof import("prismjs")> | null = null;

export function loadPrism() {
  if (!prismReady) {
    prismReady = (async () => {
      const Prism = (await import("prismjs")).default;
      await Promise.all([
        import("prismjs/components/prism-python"),
        import("prismjs/components/prism-typescript"),
        import("prismjs/components/prism-jsx"),
        import("prismjs/components/prism-tsx"),
        import("prismjs/components/prism-bash"),
        import("prismjs/components/prism-json"),
        import("prismjs/components/prism-css"),
      ]);
      return Prism;
    })();
  }
  return prismReady;
}
