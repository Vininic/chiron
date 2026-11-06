import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
  server: {
    host: "::",
    port: 8120,
    // Dev-only bridge to the suite's shared ai-proxy, whose CORS allowlist
    // holds deployed origins, not this local port (providers.ts picks it).
    proxy: env.VITE_SUPABASE_URL
      ? { "/__ai-proxy": { target: env.VITE_SUPABASE_URL, changeOrigin: true, rewrite: () => "/functions/v1/ai-proxy" } }
      : undefined,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      workbox: {
        // Curated offline-first apostilas are intentionally shipped in the seed
        // bundle. Keep enough headroom for the current catalog while retaining
        // an explicit ceiling that makes further growth visible in CI.
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
      manifest: {
        name: "Chiron — Learn to read code",
        short_name: "Chiron",
        description: "Source-code maps, annotated apostilas, guided practice and spaced review.",
        theme_color: "#0B1017",
        background_color: "#0B1017",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "book-olympus": [path.resolve(__dirname, "src/lib/study/seeds/content/olympus.ts")],
          "book-chiron": [path.resolve(__dirname, "src/lib/study/seeds/content/chiron.ts")],
          "book-jquery": [path.resolve(__dirname, "src/lib/study/seeds/content/jquery.ts")],
          "book-google-ai-studio": [path.resolve(__dirname, "src/lib/study/seeds/content/googleAiStudio.ts")],
          "book-lovable": [path.resolve(__dirname, "src/lib/study/seeds/content/lovable.ts")],
          "book-opencode": [path.resolve(__dirname, "src/lib/study/seeds/content/opencode.ts")],
          "book-github-copilot": [path.resolve(__dirname, "src/lib/study/seeds/content/githubCopilot.ts")],
          "book-claude-code": [path.resolve(__dirname, "src/lib/study/seeds/content/claudeCode.ts")],
          "book-cursor": [path.resolve(__dirname, "src/lib/study/seeds/content/cursor.ts")],
          "book-llm": [path.resolve(__dirname, "src/lib/study/seeds/content/llm.ts")],
          "book-office": [path.resolve(__dirname, "src/lib/study/seeds/content/office.ts")],
          // Keep the complete Figma book offline while preserving the 6 MiB
          // per-file precache ceiling as the curated catalog grows.
          "book-figma": [path.resolve(__dirname, "src/lib/study/seeds/content/figma.ts")],
          // Rewritten books (PLANO.md §R.2) are longer than the composed ones.
          "book-postgresql": [path.resolve(__dirname, "src/lib/study/seeds/content/postgresql.ts")],
          "book-tailwind": [path.resolve(__dirname, "src/lib/study/seeds/content/tailwindcss.ts")],
          "book-vite": [path.resolve(__dirname, "src/lib/study/seeds/content/vite.ts")],
          "book-vitest": [path.resolve(__dirname, "src/lib/study/seeds/content/vitest.ts")],
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-select", "@radix-ui/react-popover", "@radix-ui/react-tooltip", "@radix-ui/react-dropdown-menu"],
          "vendor-supabase": ["@supabase/supabase-js"],
        },
      },
    },
  },
};
});
