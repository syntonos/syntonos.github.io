import { defineConfig } from 'vite';
import contentPlugin from './vite-plugins/content.js';

// base './' lets the built site work from any path (GitHub Pages project sites included).
// The content plugin (vite-plugins/content.js) reads /content, checks it, and resizes pictures at build time.
export default defineConfig({
  base: './',
  plugins: [contentPlugin()],
  build: { chunkSizeWarningLimit: 800 },
});
