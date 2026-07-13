/**
 * Gera os arquivos de compartilhamento e de aba:
 *
 *   og.png              1200×630 — o cartão que aparece no WhatsApp/Instagram/LinkedIn
 *   favicon.svg         monograma "a" (aba do navegador, tema claro e escuro)
 *   favicon-32.png      fallback pra quem não lê SVG
 *   apple-touch-icon.png 180×180 — atalho na tela inicial do iPhone
 *
 *   node scripts/social.mjs
 *
 * Renderiza com o mesmo Chrome headless dos screenshots, usando as fontes e a
 * foto reais — o cartão é a marca dela, não um genérico.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, rmSync } from 'node:fs'
import { execSync } from 'node:child_process'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'

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

const fonts = readFileSync('site/src/assets/fonts.css', 'utf8')
const photo = readFileSync('site/src/assets/img/aline-retrato.jpg').toString('base64')

const GREEN_900 = '#2f3a29'
const GREEN_700 = '#67735c'
const BROWN = '#a67449'

/** O cartão: verde da marca, foto dela sangrando à direita, nome + a linha que fica. */
const ogHtml = `<!doctype html><meta charset="utf-8">
<style>
  ${fonts}
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; display: grid; grid-template-columns: 1fr 1fr;
    background: ${GREEN_900}; color: #fff; font-family: Montserrat, sans-serif; overflow: hidden;
  }
  .copy { padding: 72px 56px 72px 72px; display: flex; flex-direction: column; justify-content: center; gap: 20px; }
  .greeting { font-family: Alice, serif; font-size: 30px; color: #e6c9a8; }
  h1 { font-family: Alice, serif; font-size: 74px; line-height: 1.02; letter-spacing: -0.01em; max-width: 11ch; }
  p { font-size: 25px; line-height: 1.45; color: #e8ebe4; max-width: 30ch; }
  .rule { width: 96px; height: 3px; background: ${BROWN}; border-radius: 2px; }
  .cred { font-size: 17px; color: #b9c2b0; letter-spacing: 0.01em; white-space: nowrap; }
  .media { position: relative; }
  .media img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 12%; }
  /* Puxa a foto pro verde da marca e derrete a borda esquerda no fundo. */
  .tint { position: absolute; inset: 0; background: ${GREEN_700}; mix-blend-mode: color; opacity: 0.42; }
  .fade { position: absolute; inset: 0; background: linear-gradient(90deg, ${GREEN_900} 0%, rgba(47,58,41,0.55) 22%, rgba(47,58,41,0) 55%); }
</style>
<div class="copy">
  <span class="greeting">Olá, boas vindas!</span>
  <h1>Você está no lugar certo.</h1>
  <div class="rule"></div>
  <p>Psicoterapia para adultos, online e presencial, com segurança e cuidado.</p>
  <span class="cred">Aline Ferezin · Psicóloga clínica (TCC) · CPP 30603</span>
</div>
<div class="media">
  <img src="data:image/jpeg;base64,${photo}" alt="">
  <div class="tint"></div>
  <div class="fade"></div>
</div>`

/** Monograma "a" — o mesmo da identidade dela: letra serifada dentro de um anel. */
const iconHtml = (size) => `<!doctype html><meta charset="utf-8">
<style>
  ${fonts}
  * { margin: 0; box-sizing: border-box; }
  body { width: ${size}px; height: ${size}px; display: grid; place-items: center; background: ${GREEN_900}; }
  .ring {
    width: ${size * 0.78}px; height: ${size * 0.78}px; border-radius: 50%;
    border: ${Math.max(1, size * 0.035)}px solid ${BROWN};
    display: grid; place-items: center;
  }
  span {
    font-family: Alice, serif; color: #fff; font-size: ${size * 0.5}px;
    line-height: 1; transform: translateY(${size * 0.02}px);
  }
</style>
<div class="ring"><span>a</span></div>`

const browser = await puppeteer.launch({
  executablePath,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

async function shoot(html, width, height, out) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: out })
  await page.close()
  const kb = (readFileSync(out).length / 1024).toFixed(0)
  console.log(`✓ ${out} (${width}×${height}, ${kb} KB)`)
}

// PNG de 1200×630 dá ~350 KB. O WhatsApp engasga com cartão pesado (acima de
// ~300 KB ele às vezes não busca a imagem) — então o entregável é JPEG.
await shoot(ogHtml, 1200, 630, '.og-tmp.png')
await sharp('.og-tmp.png').jpeg({ quality: 88, progressive: true, mozjpeg: true }).toFile('og.jpg')
rmSync('.og-tmp.png')
console.log(`✓ og.jpg (1200×630, ${(readFileSync('og.jpg').length / 1024).toFixed(0)} KB)`)

await shoot(iconHtml(180), 180, 180, 'apple-touch-icon.png')
await shoot(iconHtml(32), 32, 32, 'favicon-32.png')

await browser.close()

// SVG pro favicon: nítido em qualquer tamanho. A letra vai como texto com
// fallback serifado — nenhum navegador tem "Alice" instalada, e é aceitável:
// o que identifica é o anel marrom sobre o verde.
writeFileSync(
  'favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="${GREEN_900}"/>
  <circle cx="16" cy="16" r="12" fill="none" stroke="${BROWN}" stroke-width="1.4"/>
  <text x="16" y="16" fill="#fff" font-family="Georgia, 'Times New Roman', serif" font-size="16"
        text-anchor="middle" dominant-baseline="central">a</text>
</svg>
`,
)
console.log('✓ favicon.svg')
