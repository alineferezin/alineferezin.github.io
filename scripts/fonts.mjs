// Baixa Alice + Montserrat do Google Fonts e embute como data URI (subsets latin + latin-ext).
// Resultado: site/src/assets/fonts.css — sem CDN, funciona no Pages e offline.
import { writeFileSync } from 'node:fs'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

const FAMILIES = [
  'Alice',
  'Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400',
]

// Só `latin`: cobre todos os acentos do português (ã ç õ é í ú â ê ô à).
// `latin-ext` é para o Leste Europeu — dobraria o peso do CSS sem ganho aqui.
const wanted = new Set(['latin'])

let out = '/* Fontes da marca (BRAND.md): Alice (títulos) + Montserrat (corpo). Self-hosted base64. */\n'

for (const family of FAMILIES) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%3A/g, ':').replace(/%40/g, '@').replace(/%2C/g, ',').replace(/%3B/g, ';')}&display=swap`
  const css = await fetch(url, { headers: { 'User-Agent': UA } }).then((r) => r.text())

  // Cada bloco vem precedido de um comentário com o nome do subset.
  const blocks = css.split('/* ').slice(1)
  for (const block of blocks) {
    const subset = block.slice(0, block.indexOf(' */')).trim()
    if (!wanted.has(subset)) continue
    let face = block.slice(block.indexOf('*/') + 2)
    const m = face.match(/url\((https:\/\/[^)]+\.woff2)\)/)
    if (!m) continue
    const buf = Buffer.from(await fetch(m[1], { headers: { 'User-Agent': UA } }).then((r) => r.arrayBuffer()))
    face = face.replace(m[0], `url(data:font/woff2;base64,${buf.toString('base64')})`)
    out += `/* ${family.split(':')[0]} — ${subset} */\n${face.trim()}\n`
  }
  console.log(`✓ ${family.split(':')[0]}`)
}

writeFileSync('site/src/assets/fonts.css', out)
console.log(`fonts.css: ${(out.length / 1024).toFixed(0)} KB`)
