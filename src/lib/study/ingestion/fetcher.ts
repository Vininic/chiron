export interface FetchedFile {
  path: string;
  content: string;
  size: number;
}

export interface RepoInfo {
  owner: string;
  repo: string;
  defaultBranch: string;
}

const GITHUB_API = "https://api.github.com";

export function parseRepoUrl(url: string): RepoInfo | null {
  const m = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/|$)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, ""), defaultBranch: "main" };
}

export async function fetchDefaultBranch(owner: string, repo: string, token?: string): Promise<string> {
  const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = await res.json();
  return data.default_branch as string;
}

export async function fetchRepoTree(
  owner: string,
  repo: string,
  branch: string,
  token?: string,
): Promise<FetchedFile[]> {
  const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const treeRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers },
  );
  if (!treeRes.ok) throw new Error(`GitHub tree error: ${treeRes.status}`);
  const tree = await treeRes.json() as { tree: Array<{ path: string; type: string; size?: number }> };

  const sourceExtensions = new Set([
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".py", ".rs", ".go", ".java", ".rb", ".php",
    ".swift", ".kt", ".scala", ".hs", ".ex", ".exs",
    ".vue", ".svelte", ".astro", ".css", ".scss",
    ".html", ".json", ".yaml", ".yml", ".toml",
    ".sql", ".prisma", ".graphql", ".proto", ".md",
  ]);

  const skipDirs = new Set([
    "node_modules", ".git", "dist", "build", ".next",
    ".nuxt", ".output", "target", "vendor",
    "__pycache__", ".venv", "venv", ".git",
  ]);

  const fileNodes = tree.tree.filter(
    (n) =>
      n.type === "blob" &&
      n.size &&
      n.size > 0 &&
      n.size < 50_000 &&
      sourceExtensions.has(
        n.path.slice(n.path.lastIndexOf(".")),
      ) &&
      !n.path.split("/").some((p) => skipDirs.has(p)),
  );

  const MAX_FILES = 30;
  const selected = fileNodes.slice(0, MAX_FILES);

  const files: FetchedFile[] = [];
  for (const node of selected) {
    try {
      const contentRes = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/contents/${node.path}?ref=${branch}`,
        { headers },
      );
      if (!contentRes.ok) continue;
      const data = await contentRes.json() as { content?: string; encoding?: string };
      if (data.encoding === "base64" && data.content) {
        const decoded = atob(data.content.replace(/\n/g, ""));
        files.push({ path: node.path, content: decoded, size: node.size ?? 0 });
      }
    } catch {
      continue;
    }
  }

  return files;
}

const README_FALLBACKS = ["README.md", "readme.md", "Readme.md"];

export async function fetchReadme(
  owner: string,
  repo: string,
  branch: string,
  token?: string,
): Promise<string | null> {
  const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  for (const name of README_FALLBACKS) {
    try {
      const res = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/contents/${name}?ref=${branch}`,
        { headers },
      );
      if (!res.ok) continue;
      const data = await res.json() as { content?: string; encoding?: string };
      if (data.encoding === "base64" && data.content) {
        return atob(data.content.replace(/\n/g, ""));
      }
    } catch {
      continue;
    }
  }
  return null;
}
