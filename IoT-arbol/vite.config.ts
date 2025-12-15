import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (development/production)
  // El tercer parámetro '' le dice a Vite que cargue todas las variables, no solo las que dicen VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_THINGSBOARD_URL, // Leemos la URL del .env
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})