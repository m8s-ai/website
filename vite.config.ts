import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: 'localhost',   // or '0.0.0.0' if you need LAN access
    port: 8080,
    strictPort: true,    // fail instead of auto-switching to 8081, etc.
  },
  preview: {
    host: 'localhost',
    port: 8080,
    strictPort: true,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    // Let Vite handle chunking automatically to prevent React splitting issues
    chunkSizeWarningLimit: 1000
  }
}));