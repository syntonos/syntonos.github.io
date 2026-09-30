import { defineConfig } from 'vite';

// base './' lets the built site work from any path (GitHub Pages project sites included).
export default defineConfig({ base: './', build: { chunkSizeWarningLimit: 800 } });
