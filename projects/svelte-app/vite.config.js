import { defineConfig } from 'vite';
import svelte from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/app/',
  optimizeDeps: { exclude: ['@roxi/routify'] },
  plugins: [svelte()],
  server: {
    port: 8081,
    strictPort: true,
    proxy: {
      '/login': 'http://localhost:8081/app/login',
      '/signup': 'http://localhost:8081/app/signup',
      '/.*': {
        rewrite: path => (path.startsWith('/app') ? path : '/app' + path),
      },
    },
  },
});
