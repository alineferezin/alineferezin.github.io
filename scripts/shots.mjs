/**
 * Screenshots de validação (Chrome headless via puppeteer-core).
 *
 *   node scripts/shots.mjs <url> <outDir> [prefixo]
 *   node scripts/shots.mjs http://localhost:5173/v1/ /tmp/shots v1
 *
 * Gera <prefixo>-390.png (mobile), -768.png (tablet), -1440.png (desktop), página inteira.
 * Também imprime erros de console e imagens quebradas — falha silenciosa é o inimigo.
 */
import { mkdirSync, readdirSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import puppeteer from 'puppeteer-core'

const [url, outDir = '/tmp/shots', prefix = 'shot'] = process.argv.slice(2)
if (!url) {
  console.error('uso: node scripts/shots.mjs <url> [outDir] [prefixo]')
  process.exit(1)
}

// Node 20 não tem fs.globSync — resolvemos o binário lendo o diretório de versões.
const cacheDir = `${process.env.HOME}/.cache/puppeteer/chrome-headless-shell`
const version = existsSync(cacheDir) ? readdirSync(cacheDir).sort().pop() : null
const executablePath = version && `${cacheDir}/${version}/chrome-headless-shell-linux64/chrome-headless-shell`
if (!executablePath || !existsSync(executablePath)) {
  console.error('chrome-headless-shell não encontrado no cache do puppeteer')
  process.exit(1)
}

// O chrome-headless-shell precisa de libasound.so.2, que não vem no WSL.
// Extraída sem sudo em scratchpad/chrome/libs (ver docs/BUILD-TOOLKIT.md §1).
const libDir = execSync(
  'find /tmp/claude-* -maxdepth 10 -type d -path "*chrome/libs/usr/lib/x86_64-linux-gnu" 2>/dev/null | head -1',
  { shell: '/bin/bash' },
)
  .toString()
  .trim()
if (libDir) {
  process.env.LD_LIBRARY_PATH = [libDir, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':')
}

mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-prefers-reduced-motion=0'],
})

const problems = []
const VIEWPORTS = [
  { w: 390, h: 844, dsf: 2 }, // iPhone
  { w: 768, h: 1024, dsf: 1 },
  { w: 1440, h: 900, dsf: 1 },
]

for (const { w, h, dsf } of VIEWPORTS) {
  const page = await browser.newPage()
  page.on('console', (m) => m.type() === 'error' && problems.push(`[console ${w}] ${m.text()}`))
  page.on('pageerror', (e) => problems.push(`[pageerror ${w}] ${e.message}`))
  page.on('requestfailed', (r) => problems.push(`[404 ${w}] ${r.url()}`))
  await page.setViewport({ width: w, height: h, deviceScaleFactor: dsf })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60_000 })
  await new Promise((r) => setTimeout(r, 1200)) // deixa a animação de entrada terminar

  // Overflow horizontal é bug de responsivo — pega antes do print.
  const overflow = await page.evaluate(() => {
    const el = document.scrollingElement
    return el.scrollWidth > el.clientWidth + 1 ? `${el.scrollWidth}px > ${el.clientWidth}px` : null
  })
  if (overflow) problems.push(`[overflow-x ${w}] documento rola na horizontal: ${overflow}`)

  const broken = await page.evaluate(() =>
    [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  )
  broken.forEach((src) => problems.push(`[img quebrada ${w}] ${src}`))

  await page.screenshot({ path: `${outDir}/${prefix}-${w}.png`, fullPage: true })
  console.log(`✓ ${outDir}/${prefix}-${w}.png`)
  await page.close()
}

await browser.close()

if (problems.length) {
  console.log('\n⚠ problemas:')
  problems.forEach((p) => console.log('  ' + p))
  process.exitCode = 1
} else {
  console.log('\n✓ sem erros de console, sem imagem quebrada, sem overflow horizontal')
}
