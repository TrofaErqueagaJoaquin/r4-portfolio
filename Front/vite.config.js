import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración mínima de Vite: plugin oficial de React (Fast Refresh + JSX)
// y el puerto de desarrollo fijo en 5173 para que coincida con la URL
// configurada como origen permitido (CORS) en el backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
