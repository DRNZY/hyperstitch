import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Studio app build.
 *
 * `outDir` is `dist/app`, not `dist`. The library build (vite.lib.config.ts)
 * owns `dist/` because that is where `package.json` `exports` points, and Vite
 * empties `outDir` on every build. With both writing to `dist/`, running
 * `npm run build` silently deleted the library output and left every `exports`
 * entry pointing at a missing file.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist/app',
    emptyOutDir: true,
  },
  server: {
    port: 5185,
    host: true,
  },
  preview: {
    port: 5185,
    host: true,
  },
});
