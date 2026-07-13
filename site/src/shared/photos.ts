/**
 * Fotos reais da Aline (geradas por `npm run photos` a partir de materials/).
 * Cada foto tem 2 larguras (900 / 1600) em JPEG e WebP — use <picture> + srcset.
 */
import retratoJpg from '../assets/img/aline-retrato.jpg'
import retratoJpg900 from '../assets/img/aline-retrato-900.jpg'
import retratoWebp from '../assets/img/aline-retrato.webp'
import retratoWebp900 from '../assets/img/aline-retrato-900.webp'
import sorrisoJpg from '../assets/img/aline-sorriso.jpg'
import sorrisoJpg900 from '../assets/img/aline-sorriso-900.jpg'
import sorrisoWebp from '../assets/img/aline-sorriso.webp'
import sorrisoWebp900 from '../assets/img/aline-sorriso-900.webp'
import palestraJpg from '../assets/img/aline-palestra.jpg'
import palestraJpg900 from '../assets/img/aline-palestra-900.jpg'
import palestraWebp from '../assets/img/aline-palestra.webp'
import palestraWebp900 from '../assets/img/aline-palestra-900.webp'

export type Photo = {
  jpg: string
  jpg900: string
  webp: string
  webp900: string
  width: number
  height: number
  /** srcset pronto para <source type="image/webp"> */
  webpSrcSet: string
  jpgSrcSet: string
}

const make = (
  jpg: string,
  jpg900: string,
  webp: string,
  webp900: string,
  width: number,
  height: number,
): Photo => ({
  jpg,
  jpg900,
  webp,
  webp900,
  width,
  height,
  webpSrcSet: `${webp900} 900w, ${webp} 1600w`,
  jpgSrcSet: `${jpg900} 900w, ${jpg} 1600w`,
})

export const PHOTOS = {
  /** Olhando pra câmera, mão no queixo. O "olá" — melhor candidata a hero. */
  retrato: make(retratoJpg, retratoJpg900, retratoWebp, retratoWebp900, 1200, 1600),
  /** Sorrindo, olhar de lado. Mais leve — bom pro meio da página. */
  sorriso: make(sorrisoJpg, sorrisoJpg900, sorrisoWebp, sorrisoWebp900, 1200, 1600),
  /** Palestrando ao microfone, blazer caramelo. Autoridade / prova. */
  palestra: make(palestraJpg, palestraJpg900, palestraWebp, palestraWebp900, 1584, 2816),
}
