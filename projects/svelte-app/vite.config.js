import { defineConfig } from 'vite';
import svelte from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/app',
  optimizeDeps: { exclude: ["svelte-router-spa", "svelte-spa-router", "@roxi/routify"] },
  plugins: [svelte()],
  server: {
    port: 8181,
  },
});
