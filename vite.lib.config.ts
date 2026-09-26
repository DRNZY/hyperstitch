import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

/**
 * Library build target.
 *
 * The README claimed this package provided "TypeScript components for spatial
 * canvas layouts", but there was no library build: `npm run build` produced the
 * studio app's hashed bundles and nothing a consumer could import. This config
 * is the missing half, emitting a single ES module plus its type declarations.
 *
 * Two entries, on purpose:
 *
 * - `hyperstitch` — the full surface, including the React components and the
 *   mock catalog. Pulling in `App` transitively pulls the whole studio, so
 *   consumers who only want the auditor should use the other entry.
 * - `hyperstitch/audit` — the parser, the rule table and the engine, with React
 *   and react-dom as peer dependencies. This is the part meant to run in CI,
 *   and keeping it free of component imports is what makes that possible.
 *
 * `react` and `react-dom` stay external so a consuming app never ends up with
 * two copies of React, which is the usual cause of "Invalid hook call".
 */
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: {
        hyperstitch: resolve(__dirname, 'src/index.ts'),
        'hyperstitch/audit': resolve(__dirname, 'src/audit/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'],
      output: {
        entryFileNames: '[name].mjs',
        chunkFileNames: 'chunks/[name]-[hash].mjs',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
