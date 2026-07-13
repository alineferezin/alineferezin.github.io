/**
 * PROPOSTA V5 — "Coragem"
 *
 * Manifesto acolhedor: dobras alternadas (verde profundo ↔ verde claríssimo),
 * tipografia grande, fotos sangrando pela borda. O clímax é a citação do
 * Guimarães Rosa, que ocupa uma dobra inteira como um cartaz.
 *
 * A ABERTURA é um CARTAZ TIPOGRÁFICO: primeira dobra sem foto nenhuma — só
 * palavra sobre verde profundo, em escala de pôster. O retrato entra logo
 * DEPOIS, numa banda full-bleed, cru e sem véu. (A V1 é a proposta foto-first,
 * com a foto ao lado do texto na primeira dobra; aqui a foto é a resposta ao
 * manifesto, não o seu cenário.)
 *
 * Motion: o conteúdo NUNCA depende de animação para ficar visível.
 *  - entrada do herói: transição com rede de segurança (setTimeout) — se o rAF
 *    for pausado (aba oculta), o estado "entrou" chega pelo timeout mesmo assim;
 *  - reveal de scroll: SÓ transform (translateY). Se o observer nunca disparar,
 *    o conteúdo continua legível — o reveal enriquece, não revela.
 */
import { useEffect, useRef, type CSSProperties } from 'react'
import { getContent } from '../../i18n'
import { CONTACT, CREDENTIALS } from '../../config'
import { PHOTOS, type Photo } from '../../shared/photos'
import './v5.css'

const t = getContent()
const whatsappHref = CONTACT.whatsapp(t.cta.whatsappMessage)

/** Delay escalonado do reveal, via custom property. */
const d = (i: number) => ({ '--d': i }) as CSSProperties

function Picture({
  photo,
  alt,
  sizes,
  eager = false,
  priority = 'high',
}: {
  photo: Photo
  alt: string
  sizes: string
  eager?: boolean
  priority?: 'high' | 'low'
}) {
  return (
    <picture>
      <source type="image/webp" srcSet={photo.webpSrcSet} sizes={sizes} />
      <img
        src={photo.jpg900}
        srcSet={photo.jpgSrcSet}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding={eager && priority === 'high' ? 'sync' : 'async'}
        fetchPriority={eager ? priority : 'auto'}
      />
    </picture>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M4 12h15M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PrimaryCta({ label = t.cta.primary, block = false }: { label?: string; block?: boolean }) {
  return (
    <a
      className={`v5-btn${block ? ' v5-btn--block' : ''}`}
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
      <ArrowIcon />
    </a>
  )
}

/**
 * Radical da palavra-tese da versão. Sai de `t.quote.emphasis` ("coragem") — o
 * mesmo radical de "corajoso", no subhead do herói. Nenhuma copy nova: só a
 * marcação de ênfase encontra a palavra que já existe no conteúdo.
 */
const COURAGE_ROOT = t.quote.emphasis.slice(0, 4).toLocaleLowerCase() // "cora"

/** Destaca, dentro de uma frase da copy, a palavra do radical da coragem. */
function Courage({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => {
        const bare = word.replace(/[.,;:!?"“”]/g, '').toLocaleLowerCase()
        return (
          <span key={`${word}-${i}`}>
            {bare.startsWith(COURAGE_ROOT) ? <em className="v5-em">{word}</em> : word}{' '}
          </span>
        )
      })}
    </>
  )
}

/** A citação, palavra a palavra — a ênfase ("coragem") ganha cor e sublinhado. */
function QuoteWords() {
  const words = t.quote.text.split(' ')
  const emphasis = t.quote.emphasis.toLocaleLowerCase()
  return (
    <>
      {words.map((word, i) => {
        const bare = word.replace(/[.,;:!?"“”]/g, '').toLocaleLowerCase()
        const isEm = bare === emphasis
        // O espaço fica FORA do inline-block: dentro dele o espaço final colapsa.
        return (
          <span key={`${word}-${i}`}>
            <span className="v5-quote__w" style={d(i)}>
              {isEm ? <em className="v5-quote__em">{word}</em> : word}
            </span>{' '}
          </span>
        )
      })}
    </>
  )
}

export function App() {
  const rootRef = useRef<HTMLDivElement>(null)

  // Entrada do herói. Rede de segurança: mesmo sem rAF (aba oculta), entra em 600ms.
  // Estado de classe vive SÓ no DOM (nunca no className do React): se o React
  // re-renderizasse a raiz, o className recalculado apagaria as classes que os
  // outros efeitos adicionam (is-js, is-armed, is-past-hero) — foi o que deixava
  // a barra fixa aparecendo por cima do herói.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const enter = () => root.classList.add('is-entered')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      enter()
      return
    }
    const raf = requestAnimationFrame(() => requestAnimationFrame(enter))
    const timer = window.setTimeout(enter, 600)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [])

  // Aquece o decode das fotos abaixo da dobra: sem isto o navegador só decodifica
  // quando elas entram na tela — e a foto aparece em branco num scroll rápido
  // (e some em captura/impressão de página inteira).
  useEffect(() => {
    const imgs = [...(rootRef.current?.querySelectorAll('img') ?? [])]
    const warm = () => imgs.forEach((img) => void img.decode?.().catch(() => {}))
    const ric = (window as { requestIdleCallback?: (cb: () => void, o?: object) => number })
      .requestIdleCallback
    if (ric) ric(warm, { timeout: 1200 })
    else window.setTimeout(warm, 300)
  }, [])

  // Reveal (só transform) + progresso de scroll + estados do header/barra.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.classList.add('is-js')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let io: IntersectionObserver | undefined

    if (!reduced && 'IntersectionObserver' in window) {
      root.classList.add('is-armed')
      io = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in')
              obs.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
      )
      root.querySelectorAll('[data-rise]').forEach((el) => io!.observe(el))
    }

    const parallax = reduced ? [] : ([...root.querySelectorAll('[data-parallax]')] as HTMLElement[])
    let ticking = 0
    const update = () => {
      ticking = 0
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      root.style.setProperty('--v5-progress', String(max > 0 ? Math.min(1, y / max) : 0))
      root.classList.toggle('is-scrolled', y > 24)
      root.classList.toggle('is-past-hero', y > window.innerHeight * 0.65)
      for (const el of parallax) {
        const r = el.getBoundingClientRect()
        if (r.bottom < -200 || r.top > window.innerHeight + 200) continue
        const c = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight
        el.style.setProperty('--py', `${(c * -26).toFixed(2)}px`)
      }
    }
    const onScroll = () => {
      if (!ticking) ticking = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      io?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (ticking) cancelAnimationFrame(ticking)
    }
  }, [])

  return (
    <div className="v5" ref={rootRef}>
      <a className="skip-link" href="#conteudo">
        {t.a11y.skipToContent}
      </a>

      <header className="v5-header">
        <a className="v5-wordmark" href="#topo">
          Aline Ferezin
        </a>
        <nav className="v5-nav" aria-label="Principal">
          <a href="#sobre">{t.nav.about}</a>
          <a href="#trabalho">{t.nav.work}</a>
          <a href="#espaco">{t.nav.space}</a>
          <a href="#sessao">{t.nav.session}</a>
          <a href="#duvidas">{t.nav.faq}</a>
        </nav>
        <a
          className="v5-header__cta"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.nav.contact}
          <ArrowIcon />
        </a>
        <span className="v5-progress" aria-hidden="true" />
      </header>

      <main id="conteudo">
        {/* ------------------------------------------- HERÓI: CARTAZ (sem foto) */}
        <section className="v5-hero" id="topo">
          <div className="v5-hero__inner">
            <p className="v5-hero__greeting v5-in" style={d(0)}>
              {t.hero.greeting}
            </p>
            <h1 className="v5-hero__title v5-in" style={d(1)}>
              {t.hero.headline}
            </h1>
            <p className="v5-hero__subhead v5-in" style={d(2)}>
              <Courage text={t.hero.subhead} />
            </p>
            <div className="v5-hero__meta">
              <p className="v5-hero__tagline v5-in" style={d(3)}>
                {t.hero.tagline}
              </p>
              <div className="v5-hero__actions v5-in" style={d(4)}>
                <PrimaryCta />
                <a className="v5-btn v5-btn--ghost" href="#trabalho">
                  {t.cta.secondary}
                </a>
              </div>
            </div>
            <p className="v5-scroll v5-in" style={d(5)}>
              <span className="v5-scroll__line" aria-hidden="true" />
              {t.hero.scroll}
            </p>
          </div>
        </section>

        {/* --------------------- A RESPOSTA AO CARTAZ: O RETRATO, FULL-BLEED */}
        {/* Sem véu, sem filtro: a foto crua ocupa a largura toda. É o LCP. */}
        <div className="v5-plate" data-parallax>
          <Picture photo={PHOTOS.retrato} alt={t.a11y.portraitAlt} sizes="100vw" eager />
        </div>

        {/* ------------------------------------------- POR QUE É DIFÍCIL MUDAR */}
        <section className="v5-band v5-band--paper" aria-labelledby="mudar-t">
          <h2 className="v5-h2" id="mudar-t" data-rise>
            {t.change.title}
          </h2>
          <div className="v5-change">
            <div className="v5-prose">
              {t.change.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? 'v5-lead' : undefined} data-rise style={d(i)}>
                  {p}
                </p>
              ))}
            </div>
            <p className="v5-question" data-rise>
              {t.change.question}
            </p>
          </div>
          <div className="v5-steps" data-rise>
            <p className="v5-steps__intro">{t.change.stepsIntro}</p>
            <ol className="v5-steps__list">
              {t.change.steps.map((s, i) => (
                <li key={i} style={d(i)}>
                  {s}
                </li>
              ))}
            </ol>
            <p className="v5-steps__outro">{t.change.stepsOutro}</p>
          </div>
        </section>

        {/* -------------------------------------------------------- SOBRE */}
        <section className="v5-band v5-band--deep v5-band--flush" id="sobre" aria-labelledby="sobre-t">
          <div className="v5-about">
            <div className="v5-about__media" data-parallax>
              {/* Abaixo da dobra, mas em prioridade baixa: não disputa com o herói. */}
              <Picture
                photo={PHOTOS.palestra}
                alt={t.a11y.talkAlt}
                sizes="(min-width: 900px) 44vw, 100vw"
                eager
                priority="low"
              />
            </div>
            <div className="v5-about__copy">
              <h2 className="v5-h2" id="sobre-t" data-rise>
                {t.about.title}
              </h2>
              <p className="v5-role" data-rise style={d(1)}>
                {t.about.role}
              </p>
              <div className="v5-prose">
                {t.about.paragraphs.map((p, i) => (
                  <p key={i} data-rise style={d(i + 1)}>
                    {p}
                  </p>
                ))}
              </div>
              <ul className="v5-facts" data-rise>
                {t.about.facts.map((f) => (
                  <li key={f.value}>
                    <strong>{f.value}</strong>
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- COMO TRABALHO */}
        <section className="v5-band v5-band--paper" id="trabalho" aria-labelledby="trabalho-t">
          <h2 className="v5-h2" id="trabalho-t" data-rise>
            {t.work.title}
          </h2>
          <p className="v5-lead v5-lead--wide" data-rise style={d(1)}>
            {t.work.intro}
          </p>
          <div className="v5-list">
            {t.work.points.map((p, i) => (
              <article className="v5-row" key={p.title} data-rise style={d(i)}>
                <span className="v5-row__rule" aria-hidden="true" />
                <h3 className="v5-row__title">{p.title}</h3>
                <p className="v5-row__text">{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------- BENEFÍCIOS */}
        <section className="v5-band v5-band--deep" aria-labelledby="beneficios-t">
          <h2 className="v5-h2" id="beneficios-t" data-rise>
            {t.benefits.title}
          </h2>
          <p className="v5-lead v5-lead--wide" data-rise style={d(1)}>
            {t.benefits.intro}
          </p>
          <div className="v5-benefits">
            {t.benefits.items.map((item, i) => (
              <article className="v5-benefit" key={item.title} data-rise style={d(i)}>
                <h3 className="v5-benefit__title">{item.title}</h3>
                <p className="v5-benefit__text">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------- NOSSO ESPAÇO */}
        <section className="v5-band v5-band--paper" id="espaco" aria-labelledby="espaco-t">
          <h2 className="v5-h2" id="espaco-t" data-rise>
            {t.space.title}
          </h2>
          <div className="v5-space">
            <p className="v5-space__lead" data-rise>
              {t.space.lead}
            </p>
            <div className="v5-prose v5-space__prose">
              {t.space.paragraphs.map((p, i) => (
                <p key={i} data-rise style={d(i)}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <p className="v5-huge" data-rise>
            {t.space.highlight}
          </p>
        </section>

        {/* ----------------------------------------------------- A SESSÃO */}
        <section className="v5-band v5-band--deep" id="sessao" aria-labelledby="sessao-t">
          <h2 className="v5-h2" id="sessao-t" data-rise>
            {t.session.title}
          </h2>
          <p className="v5-session__lead" data-rise style={d(1)}>
            {t.session.lead}
          </p>
          <p className="v5-session__format" data-rise style={d(2)}>
            {t.session.format}
          </p>
          <h3 className="v5-session__sub" data-rise>
            {t.session.structureTitle}
          </h3>
          <div className="v5-structure">
            {t.session.structure.map((s, i) => (
              <div className="v5-structure__item" key={s.title} data-rise style={d(i)}>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
          <p className="v5-note" data-rise>
            {t.session.frequencyNote}
          </p>
        </section>

        {/* ---------------------------------------------- PRIMEIRA SESSÃO */}
        <section className="v5-band v5-band--paper v5-band--flush" aria-labelledby="primeira-t">
          <div className="v5-first">
            <div className="v5-first__copy">
              <h2 className="v5-first__title" id="primeira-t" data-rise>
                {t.first.title}
              </h2>
              <div className="v5-prose">
                {t.first.paragraphs.map((p, i) => (
                  <p key={i} className={i === 0 ? 'v5-lead' : undefined} data-rise style={d(i)}>
                    {p}
                  </p>
                ))}
              </div>
              <div className="v5-first__actions" data-rise>
                <PrimaryCta />
              </div>
            </div>
            <div className="v5-first__media" data-parallax>
              <Picture
                photo={PHOTOS.sorriso}
                alt={t.a11y.smileAlt}
                sizes="(min-width: 900px) 44vw, 100vw"
                eager
                priority="low"
              />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ O CLÍMAX: CITAÇÃO */}
        <section className="v5-quote" aria-label={t.quote.source}>
          <blockquote className="v5-quote__block">
            <p className="v5-quote__text" data-rise>
              <QuoteWords />
            </p>
            <footer className="v5-quote__source" data-rise>
              <cite>{t.quote.source}</cite>
            </footer>
          </blockquote>
        </section>

        {/* ------------------------------------------------------- DÚVIDAS */}
        <section className="v5-band v5-band--paper" id="duvidas" aria-labelledby="duvidas-t">
          <h2 className="v5-h2" id="duvidas-t" data-rise>
            {t.faq.title}
          </h2>
          <div className="v5-faq">
            {t.faq.items.map((item, i) => (
              <details className="v5-faq__item" key={item.q} name="v5-faq" data-rise style={d(i)}>
                <summary>
                  <span>{item.q}</span>
                  <span className="v5-faq__sign" aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- CONTATO */}
        <section className="v5-band v5-closing" id="contato" aria-labelledby="contato-t">
          <h2 className="v5-closing__title" id="contato-t" data-rise>
            {t.closing.title}
          </h2>
          <p className="v5-closing__text" data-rise style={d(1)}>
            {t.closing.text}
          </p>
          <div className="v5-closing__actions" data-rise style={d(2)}>
            <PrimaryCta />
            <a
              className="v5-btn v5-btn--ghost"
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.cta.instagram}
            </a>
          </div>
          <p className="v5-closing__note" data-rise style={d(3)}>
            {t.cta.note}
          </p>
        </section>
      </main>

      <footer className="v5-footer">
        <div className="v5-footer__brand">
          <p className="v5-wordmark v5-wordmark--footer">{t.footer.name}</p>
          <p className="v5-footer__role">
            {t.footer.role} · {CREDENTIALS.cpp} · {CREDENTIALS.crp}
          </p>
          <p className="v5-footer__where">{t.footer.location}</p>
        </div>
        <nav className="v5-footer__links" aria-label="Contato">
          <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer">
            {t.footer.instagram} · {CONTACT.instagramHandle}
          </a>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            {t.footer.whatsapp}
          </a>
        </nav>
      </footer>

      {/* Barra fixa no mobile: visível por padrão; o JS só a esconde enquanto o herói está na tela. */}
      <div className="v5-bar">
        <PrimaryCta block />
      </div>
    </div>
  )
}
