import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const entry = (p: string) => fileURLToPath(new URL(p, import.meta.url))

/**
 * Build do SITE PÚBLICO (a versão promovida pra raiz `/`).
 *
 * Sai numa pasta temporária — `scripts/promote.mjs` copia o resultado pra raiz
 * do repo. Nunca aponte `outDir` direto pra raiz: `emptyOutDir` apagaria o
 * repositório inteiro (docs, site/, mockup/, CNAME…).
 *
 * Qual versão é publicada: `scripts/promote.mjs <v1..v5>` reescreve
 * `site/root/main.tsx` apontando pra ela.
 */
export default defineConfig({
  root: 'site',
  base: './',
  plugins: [react()],
  build: {
    outDir: '../.build-root',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: { index: entry('site/root/index.html') },
    },
  },
})
