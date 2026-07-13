// Otimiza as fotos da Aline (materials/, git-ignorado) para site/src/assets/img/ (versionado).
// Gera JPEG progressivo em 2 larguras + WebP. EXIF rotation aplicada por sharp (.rotate()).
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const SRC = 'materials'
const OUT = 'site/src/assets/img'
mkdirSync(OUT, { recursive: true })

const JOBS = [
  // retrato principal: olhando pra câmera, mão no queixo — o "olá" do hero
  { in: `${SRC}/IMG-20260415-WA0023.jpg.jpeg`, name: 'aline-retrato', widths: [900, 1600] },
  // sorriso, olhar de lado — mais leve, bom pra seções de meio
  { in: `${SRC}/IMG-20260415-WA0027-1.jpg.jpeg`, name: 'aline-sorriso', widths: [900, 1600] },
  // palestrando, blazer camel, perfil — autoridade/prova
  { in: `${SRC}/IMG_7129.JPG.jpeg`, name: 'aline-palestra', widths: [900, 1600] },
]

for (const job of JOBS) {
  for (const w of job.widths) {
    const suffix = w === Math.max(...job.widths) ? '' : `-${w}`
    const base = sharp(job.in).rotate().resize({ width: w, withoutEnlargement: true })
    await base.clone().jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(`${OUT}/${job.name}${suffix}.jpg`)
    await base.clone().webp({ quality: 80 }).toFile(`${OUT}/${job.name}${suffix}.webp`)
  }
  const meta = await sharp(job.in).metadata()
  console.log(`✓ ${job.name} (origem ${meta.width}×${meta.height})`)
}
