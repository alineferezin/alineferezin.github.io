// GERADO por scripts/promote.mjs — não edite à mão.
// A proposta publicada hoje na raiz do site é a V1.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/assets/fonts.css'
import '../src/shared/tokens.css'
import { applyLangToDocument } from '../src/i18n'
import { App } from '../src/versions/v1/App'

applyLangToDocument()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
