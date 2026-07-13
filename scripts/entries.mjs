// Gera as 5 entradas (html + main.tsx) das propostas. Shape idêntico; só muda a versão.
import { writeFileSync, mkdirSync } from 'node:fs'

const VERSIONS = [
  { id: 'v1', name: 'Acolhida' },
  { id: 'v2', name: 'Passadiço' },
  { id: 'v3', name: 'Consultório' },
  { id: 'v4', name: 'Diálogo' },
  { id: 'v5', name: 'Coragem' },
]

for (const { id, name } of VERSIONS) {
  mkdirSync(`site/${id}`, { recursive: true })

  writeFileSync(
    `site/${id}/index.html`,
    `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Aline Ferezin — Psicóloga clínica (TCC)</title>
    <meta name="description" content="Psicoterapia para adultos, online e presencial, com segurança e cuidado." />
    <meta name="robots" content="noindex" />
    <!-- Proposta ${id.toUpperCase()} · ${name} -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
`,
  )

  writeFileSync(
    `site/${id}/main.tsx`,
    `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/assets/fonts.css'
import '../src/shared/tokens.css'
import { applyLangToDocument } from '../src/i18n'
import { App } from '../src/versions/${id}/App'

applyLangToDocument()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`,
  )
  console.log(`✓ site/${id}/`)
}
