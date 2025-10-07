import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// Gebruik een function zodat we de juiste mode (development/production) env kunnen laden
export default defineConfig(({ mode }) => {
  // Gebruik globalThis om Node types te vermijden (process bestaat in Node runtime)
  const cwd = (globalThis as any).process ? (globalThis as any).process.cwd() : '.';
  const env = loadEnv(mode, cwd, '');
  const apiUrl = env.VITE_API_URL;

  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
  };
});
