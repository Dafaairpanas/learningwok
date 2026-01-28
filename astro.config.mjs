// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(), 
    tailwind(), 
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: false, // We use our own manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*supabase\.co\/.*/i,
            handler: 'CacheFirst', // Always use cache first for offline-first experience
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 500, // Keep more entries
                // No maxAgeSeconds = permanent cache until new build
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  site: 'https://nihongoin.com',
  output: 'static',
  prefetch: true,
  compressHTML: true,
});