import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Narendra Modi - One Leader, One Vision',
        short_name: 'Modi Portfolio',
        description: 'Cinematic political portfolio of Narendra Modi',
        theme_color: '#FF6B00',
        background_color: '#F5F0EB',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=192&h=192&fit=crop',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=512&h=512&fit=crop',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
