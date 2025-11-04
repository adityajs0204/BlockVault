import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ modern integration
  ],
  server: {
    port: 5173,
    strictPort: true, // don't auto-switch; fail if taken
  },
});
