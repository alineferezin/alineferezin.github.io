import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const entry = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// GitHub Pages serve estático da raiz do repo. As propostas são buildadas em
// /mockup/portifolios/{v1..v5}/ e o `/` da raiz continua sendo o site publicado.
// `base: './'` => todos os assets em caminho relativo (funciona em qualquer subpasta).
export default defineConfig({
  root: 'site',
  base: './',
  plugins: [react()],
  build: {
    outDir: '../mockup/portifolios',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        index: entry('site/index.html'),
        v1: entry('site/v1/index.html'),
        v2: entry('site/v2/index.html'),
        v3: entry('site/v3/index.html'),
        v4: entry('site/v4/index.html'),
        v5: entry('site/v5/index.html'),
      },
    },
  },
})
