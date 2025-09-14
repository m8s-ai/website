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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes('react') || id.includes('react-dom') || id.includes('react/jsx-runtime')) {
            return 'react-vendor';
          }
          
          // Radix UI components
          if (id.includes('@radix-ui/')) {
            return 'ui-vendor';
          }
          
          // React ecosystem
          if (id.includes('react-router') || id.includes('react-hook-form') || id.includes('@tanstack/')) {
            return 'react-ecosystem';
          }
          
          // Utility libraries
          if (id.includes('clsx') || id.includes('class-variance-authority') || id.includes('tailwind-merge') || id.includes('lucide-react')) {
            return 'utils-vendor';
          }
          
          // Large vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  }
}));