/**
 * Screenshots de validação (Chrome headless via puppeteer-core).
 *
 *   node scripts/shots.mjs <url> <outDir> [prefixo]
 *
 * Para CADA viewport gera DOIS arquivos:
 *   <prefixo>-<W>x<H>-fold.png  → só a primeira dobra (o que a pessoa vê ao abrir)
 *   <prefixo>-<W>-full.png      → página inteira
 *
 * A dobra é o que importa: captura de página inteira ESCONDE o defeito de tela
 * curta (o texto que sobe e tapa o rosto no iPhone SE só aparece no fold).
 *
 * Também acusa: erro de console, imagem quebrada, overflow horizontal e alvo de
 * toque menor que 44px. Exit ≠ 0 = tem bug.
 */
import { mkdirSync, readdirSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import puppeteer from 'puppeteer-core'

const [url, outDir = '/tmp/shots', prefix = 'shot'] = process.argv.slice(2)
if (!url) {
  console.error('uso: node scripts/shots.mjs <url> [outDir] [prefixo]')
  process.exit(1)
}

const cacheDir = `${process.env.HOME}/.cache/puppeteer/chrome-headless-shell`
const version = existsSync(cacheDir) ? readdirSync(cacheDir).sort().pop() : null
const executablePath = version && `${cacheDir}/${version}/chrome-headless-shell-linux64/chrome-headless-shell`
if (!executablePath || !existsSync(executablePath)) {
  console.error('chrome-headless-shell não encontrado no cache do puppeteer')
  process.exit(1)
}

// O chrome-headless-shell precisa de libasound.so.2, que não vem no WSL.
const libDir = execSync(
  'find /tmp/claude-* -maxdepth 10 -type d -path "*chrome/libs/usr/lib/x86_64-linux-gnu" 2>/dev/null | head -1',
  { shell: '/bin/bash' },
)
  .toString()
  .trim()
if (libDir) process.env.LD_LIBRARY_PATH = [libDir, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':')

mkdirSync(outDir, { recursive: true })

/**
 * Celulares reais primeiro. O SE (375×667) é o caso que quebra: tela CURTA.
 * Se a primeira dobra funciona nele, funciona em qualquer celular.
 */
const VIEWPORTS = [
  { w: 320, h: 568, dsf: 2, nome: 'iPhone SE 1ª ger — o piso' },
  { w: 375, h: 667, dsf: 2, nome: 'iPhone SE 2/3 — tela curta' },
  { w: 390, h: 844, dsf: 2, nome: 'iPhone 14/15' },
  { w: 414, h: 896, dsf: 2, nome: 'iPhone Plus/Max' },
  { w: 768, h: 1024, dsf: 1, nome: 'tablet' },
  { w: 1440, h: 900, dsf: 1, nome: 'desktop' },
]

const browser = await puppeteer.launch({
  executablePath,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

const problems = []

for (const { w, h, dsf, nome } of VIEWPORTS) {
  const page = await browser.newPage()
  page.on('console', (m) => m.type() === 'error' && problems.push(`[console ${w}] ${m.text()}`))
  page.on('pageerror', (e) => problems.push(`[pageerror ${w}] ${e.message}`))
  page.on('requestfailed', (r) => problems.push(`[404 ${w}] ${r.url()}`))
  await page.setViewport({ width: w, height: h, deviceScaleFactor: dsf })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60_000 })
  await new Promise((r) => setTimeout(r, 1200)) // animação de entrada termina

  const overflow = await page.evaluate(() => {
    const el = document.scrollingElement
    return el.scrollWidth > el.clientWidth + 1 ? `${el.scrollWidth}px > ${el.clientWidth}px` : null
  })
  if (overflow) problems.push(`[overflow-x ${w}] rola na horizontal: ${overflow}`)

  const broken = await page.evaluate(() =>
    [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  )
  broken.forEach((src) => problems.push(`[img quebrada ${w}] ${src}`))

  // Alvo de toque: só no celular, e só o que está visível.
  if (w <= 430) {
    const small = await page.evaluate(() => {
      const out = []
      for (const el of document.querySelectorAll('a, button, summary, [role="button"], [role="tab"]')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        if (getComputedStyle(el).visibility === 'hidden') continue
        if (r.height < 44 || r.width < 44) {
          out.push(`${el.tagName.toLowerCase()}.${el.className || '—'} ${Math.round(r.width)}×${Math.round(r.height)}`)
        }
      }
      return out.slice(0, 6)
    })
    small.forEach((s) => problems.push(`[toque <44px ${w}] ${s}`))
  }

  await page.screenshot({ path: `${outDir}/${prefix}-${w}x${h}-fold.png` })
  await page.screenshot({ path: `${outDir}/${prefix}-${w}-full.png`, fullPage: true })
  console.log(`✓ ${w}×${h} (${nome})`)
  await page.close()
}

await browser.close()

if (problems.length) {
  console.log('\n⚠ problemas:')
  problems.forEach((p) => console.log('  ' + p))
  process.exitCode = 1
} else {
  console.log('\n✓ sem erro de console, sem imagem quebrada, sem overflow-x, sem alvo de toque < 44px')
  console.log('  (o automático passou — agora OLHE os *-fold.png, principalmente 375×667)')
}
