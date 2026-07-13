/**
 * Miniaturas das propostas para a página de escolha (mockup/portifolios/index.html).
 * Roda DEPOIS do build (o build limpa o outDir). Servidor precisa estar no ar.
 *
 *   npx vite preview --port 5190 --strictPort &
 *   node scripts/thumbs.mjs http://localhost:5190
 */
import { mkdirSync, readdirSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import puppeteer from 'puppeteer-core'

const base = (process.argv[2] || 'http://localhost:5190').replace(/\/$/, '')
const OUT = 'mockup/portifolios/shots'
mkdirSync(OUT, { recursive: true })

const cacheDir = `${process.env.HOME}/.cache/puppeteer/chrome-headless-shell`
const version = readdirSync(cacheDir).sort().pop()
const executablePath = `${cacheDir}/${version}/chrome-headless-shell-linux64/chrome-headless-shell`
if (!existsSync(executablePath)) throw new Error('chrome-headless-shell ausente')

const libDir = execSync(
  'find /tmp/claude-* -maxdepth 10 -type d -path "*chrome/libs/usr/lib/x86_64-linux-gnu" 2>/dev/null | head -1',
  { shell: '/bin/bash' },
)
  .toString()
  .trim()
if (libDir) process.env.LD_LIBRARY_PATH = [libDir, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':')

const browser = await puppeteer.launch({
  executablePath,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

for (const v of ['v1', 'v2', 'v3', 'v4', 'v5']) {
  const page = await browser.newPage()
  // 16:10 — mesma proporção do card no seletor; só a primeira dobra.
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.goto(`${base}/${v}/`, { waitUntil: 'networkidle0', timeout: 60_000 })
  await new Promise((r) => setTimeout(r, 1500))
  await page.screenshot({ path: `${OUT}/${v}.png` })
  console.log(`✓ ${OUT}/${v}.png`)
  await page.close()
}

await browser.close()
