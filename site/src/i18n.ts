import { pt } from './content/pt'
import { en } from './content/en'

/** O tipo vem do português: `en.ts` é obrigado a ter exatamente as mesmas chaves. */
export type Content = typeof pt

export const LANGS = ['pt', 'en'] as const
export type Lang = (typeof LANGS)[number]

const DICT: Record<Lang, Content> = { pt, en }

/** PT é o padrão. `?lang=en` alterna — o seletor de idioma na UI é o próximo passo. */
export function getLang(): Lang {
  const param = new URLSearchParams(window.location.search).get('lang')
  return (LANGS as readonly string[]).includes(param ?? '') ? (param as Lang) : 'pt'
}

export function getContent(lang: Lang = getLang()): Content {
  return DICT[lang]
}

/** Sincroniza `<html lang>`, título e meta description com o idioma ativo. */
export function applyLangToDocument(): Content {
  const t = getContent()
  document.documentElement.lang = t.meta.lang
  document.title = t.meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  return t
}
