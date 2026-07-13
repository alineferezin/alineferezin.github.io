/**
 * Promove uma proposta para o site público (raiz `/`).
 *
 *   node scripts/promote.mjs v1
 *
 * Quando a Aline escolher outra, é só trocar o argumento: um comando, sem
 * reescrever nada à mão.
 *
 * O que faz:
 *  1. aponta `site/root/main.tsx` para a versão escolhida;
 *  2. builda com `vite.root.config.ts` numa pasta temporária;
 *  3. copia `index.html` + `assets/` pra raiz do repo.
 *
 * O que NÃO faz (de propósito): nunca roda o Vite com `outDir` na raiz —
 * `emptyOutDir` apagaria o repositório inteiro. Só o `index.html` e a pasta
 * `assets/` da raiz são substituídos; CNAME, robots.txt, docs/, site/ e mockup/
 * ficam intactos.
 */
import { writeFileSync, rmSync, cpSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

const version = process.argv[2]
if (!/^v[1-5]$/.test(version ?? '')) {
  console.error('uso: node scripts/promote.mjs <v1|v2|v3|v4|v5>')
  process.exit(1)
}

writeFileSync(
  'site/root/main.tsx',
  `// GERADO por scripts/promote.mjs — não edite à mão.
// A proposta publicada hoje na raiz do site é a ${version.toUpperCase()}.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/assets/fonts.css'
import '../src/shared/tokens.css'
import { applyLangToDocument } from '../src/i18n'
import { App } from '../src/versions/${version}/App'

applyLangToDocument()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`,
)
console.log(`✓ site/root/main.tsx → versions/${version}`)

execSync('npx vite build --config vite.root.config.ts', { stdio: 'inherit' })

// Substitui só o que é gerado. `force: true` não reclama se ainda não existe.
rmSync('assets', { recursive: true, force: true })
cpSync('.build-root/assets', 'assets', { recursive: true })
cpSync('.build-root/root/index.html', 'index.html')
rmSync('.build-root', { recursive: true, force: true })

if (!existsSync('index.html') || !existsSync('assets')) {
  console.error('✗ a raiz não recebeu o build — abortando sem publicar')
  process.exit(1)
}

console.log(`\n✓ ${version.toUpperCase()} promovida para a raiz /`)
console.log('  index.html + assets/ atualizados. CNAME, robots.txt e /mockup/ intactos.')
