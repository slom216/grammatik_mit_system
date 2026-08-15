/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // A new version waits until the learner reloads. Auto-updating would drop
      // the chunks a running practice session still needs.
      registerType: 'prompt',
      injectRegister: null,
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Grammatik mit System',
        short_name: 'Grammatik',
        description: 'A German grammar course for levels A1 to B1.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#285f74',
        background_color: '#f6fbfc',
        lang: 'en',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // The shell, page chunks, styles and fonts are precached (~600 KB).
        // Chapter chunks are not: precaching them would re-download the 4.4 MB
        // of course content the code split just removed from the first load.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        globIgnores: ['assets/chapters/**'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /\/assets\/chapters\/[^/]+\.js$/,
            // Filenames are content-hashed, so a cached chapter is never stale.
            handler: 'CacheFirst',
            options: {
              cacheName: 'chapter-content',
              expiration: { maxEntries: 100 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Chapter chunks live in their own directory so the service worker can
        // match them by path prefix rather than by hashed filename.
        chunkFileNames: (chunk) =>
          chunk.name.startsWith('chapter-')
            ? 'assets/chapters/[name]-[hash].js'
            : 'assets/[name]-[hash].js',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**'],
    restoreMocks: true,
  },
});
