import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['teresitalogo.png'],
      manifest: {
        name: 'Generador de Certificados - Parroquia Sta. Teresita',
        short_name: 'Certificados Teresita',
        description: 'Herramienta local para el llenado e impresión de certificados eclesiásticos',
        theme_color: '#603828',
        background_color: '#FAF6F0',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'teresitalogo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'teresitalogo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});