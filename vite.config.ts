import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const entry = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// GitHub Pages serve estático da raiz do repo. A área de rascunhos é buildada
// inteira em /mockup/ — o hub em /mockup/, as propostas em /mockup/portifolios/.
// O `/` da raiz continua sendo o site publicado: o build não encosta nele.
// `base: './'` => assets em caminho relativo, então o MESMO build serve em
// alineferezin.com e em alineferezin.github.io, em qualquer profundidade.
export default defineConfig({
  root: 'site',
  base: './',
  plugins: [react()],
  build: {
    outDir: '../mockup',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        hub: entry('site/index.html'),
        portifolios: entry('site/portifolios/index.html'),
        v1: entry('site/portifolios/v1/index.html'),
        v2: entry('site/portifolios/v2/index.html'),
        v3: entry('site/portifolios/v3/index.html'),
        v4: entry('site/portifolios/v4/index.html'),
        v5: entry('site/portifolios/v5/index.html'),
      },
    },
  },
})
