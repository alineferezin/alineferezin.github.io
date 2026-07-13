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
  mkdirSync(`site/portifolios/${id}`, { recursive: true })

  writeFileSync(
    `site/portifolios/${id}/index.html`,
    `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Aline Ferezin — Psicóloga clínica (TCC)</title>
    <meta name="description" content="Psicoterapia para adultos, online e presencial, com segurança e cuidado." />
    <meta name="robots" content="noindex" />
    <meta name="theme-color" content="#67735c" />

    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32.png" sizes="32x32" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- Cartão de compartilhamento: mandar a proposta ${id.toUpperCase()} no WhatsApp também
         mostra a marca dela, não um link pelado. A imagem precisa de URL absoluta. -->
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="Aline Ferezin" />
    <meta property="og:title" content="Aline Ferezin — Psicóloga clínica (TCC)" />
    <meta property="og:description" content="Proposta ${id.toUpperCase()} · ${name} — uma das cinco direções para o novo site." />
    <meta property="og:url" content="https://alineferezin.com/mockup/portifolios/${id}/" />
    <meta property="og:image" content="https://alineferezin.com/og.jpg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Aline Ferezin, psicóloga clínica, ao lado da frase “Você está no lugar certo.”" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="https://alineferezin.com/og.jpg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
`,
  )

  writeFileSync(
    `site/portifolios/${id}/main.tsx`,
    `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../src/assets/fonts.css'
import '../../src/shared/tokens.css'
import { applyLangToDocument } from '../../src/i18n'
import { App } from '../../src/versions/${id}/App'

applyLangToDocument()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`,
  )
  console.log(`✓ site/portifolios/${id}/`)
}
