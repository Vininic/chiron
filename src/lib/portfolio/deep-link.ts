// Handle deep-links from the portfolio TUI
// The portfolio can link to:
//   /?analyze=owner/repo  →  redirect to /maps?source=<source-id>
//   /?card=cardId        →  redirect to /review

export interface PortfolioLink {
  type: "analyze" | "card" | "unknown";
  payload: string;
}

export function parsePortfolioLink(search: string): PortfolioLink {
  const params = new URLSearchParams(search);
  const analyze = params.get("analyze");
  const card = params.get("card");
  if (analyze) return { type: "analyze", payload: analyze };
  if (card) return { type: "card", payload: card };
  return { type: "unknown", payload: "" };
}

export function buildPortfolioAnalyzeUrl(owner: string, repo: string): string {
  return `/?analyze=${encodeURIComponent(`${owner}/${repo}`)}`;
}

export function buildPortfolioCardUrl(cardId: string): string {
  return `/?card=${encodeURIComponent(cardId)}`;
}
