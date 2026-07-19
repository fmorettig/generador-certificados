import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'arquibqto.png',
        'personal_isotipo.png',
        'personal_monotipo.png',
        'personal_monotipo1.png',
        'stateresita.png',
        'tere.png',
        'teresitalogo.png',
        'vite.svg'
      ],
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
            // CAMBIADO AQUÍ PARA LA PWA
            src: 'tere.png', 
            sizes: '192x192',
            type: 'image/png'
          },
          {
            // CAMBIADO AQUÍ PARA LA PWA
            src: 'tere.png', 
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});