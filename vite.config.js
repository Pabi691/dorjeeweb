import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Browser-visible variables. VITE_ is Vite's convention; bare names are also
// accepted so a dashboard that strips the prefix still builds a working site.
const ENV_PREFIXES = ['VITE_', 'API_URL', 'WEB_TOKEN', 'RAZORPAY_KEY'];

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), ENV_PREFIXES);
  return {
    plugins: [react()],
    envPrefix: ENV_PREFIXES,
    // Port 5173 matches SITE_URL in the backend .env — verification and
    // password-reset links point here.
    server: { port: 5173, open: false },
    preview: { port: 5173 },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion', 'lenis'],
            vendor: ['axios', 'sweetalert2', 'react-toastify', 'swiper'],
          },
        },
      },
    },
  };
});
