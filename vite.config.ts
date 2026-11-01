import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({base:'/history/',plugins:[react(),VitePWA({registerType:'autoUpdate',includeAssets:['icon.svg','icon-192.png','icon-512.png'],manifest:{name:'조선 518',short_name:'조선518',lang:'ko',theme_color:'#101211',background_color:'#101211',display:'standalone',start_url:'/history/',scope:'/history/',id:'/history/',icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]},workbox:{globPatterns:['**/*.{js,css,html,svg,png,woff2}']}})],test:{include:['src/**/*.test.{ts,tsx}'],environment:'jsdom',setupFiles:['./src/test-setup.ts']}});
