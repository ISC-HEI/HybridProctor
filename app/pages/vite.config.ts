import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@srvtypes": path.resolve(__dirname, "../backend/src/lib/types"),
      "@style": path.resolve(__dirname, "./src/styles"),
      "@utils": path.resolve(__dirname, "./src/lib/utils/"),
      "@srvutils": path.resolve(__dirname, "../backend/src/lib/utils/"),
    }
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true 
      }
    }
  }
})
