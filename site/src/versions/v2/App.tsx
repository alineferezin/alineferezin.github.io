/**
 * Proposta V2 — "Passadiço".
 *
 * A página é um percurso: superfície clara em verde, tinta verde-escura, e uma
 * linha condutora (a "espinha") que atravessa o scroll pela lateral — o corrimão
 * do passadiço. As fotos são paradas no caminho; os blocos verdes densos são os
 * trechos de sombra. O conteúdo NUNCA depende da animação para existir.
 */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { getContent } from '../../i18n'
import { CONTACT, CREDENTIALS } from '../../config'
import { PHOTOS, type Photo } from '../../shared/photos'
import './v2.css'

const t = getContent()
const whatsappHref = CONTACT.whatsapp(t.cta.whatsappMessage)

/** Marca = duas primeiras palavras do nome legal. Nada de copy solta no JSX. */
const WORDMARK = CREDENTIALS.fullName.split(' ').slice(0, 2).join(' ')

/**
 * Rótulos dos botões de divulgação progressiva (só existem no mobile).
 *
 * Isto é MICROCOPY DE INTERFACE — não é copy da marca: nenhuma frase do site
 * mora aqui, todo o conteúdo continua vindo de `content/pt.ts`. Cada rótulo diz
 * o que aquele botão abre naquela seção; nada de "Saiba mais" genérico repetido.
 */
const MORE = {
  change: 'Ler o resto e os três passos',
  about: 'Ler mais sobre a minha história',
  work: 'Ver os outros pontos da abordagem',
  space: 'Por que o vínculo importa',
  session: 'Ver a estrutura da sessão',
  first: 'O que acontece na primeira sessão',
  less: 'Mostrar menos',
} as const

const SECTIONS = {
  about: 'sobre',
  work: 'trabalho',
  space: 'espaco',
  session: 'sessao',
  faq: 'duvidas',
  contact: 'contato',
} as const

/* ---------------------------------------------------------------- espinha -- */

/**
 * A linha do passadiço. viewBox 100×1000 esticado (preserveAspectRatio=none)
 * sobre toda a altura do percurso; `vector-effect` mantém a espessura constante
 * apesar da escala não-uniforme. Trilho fraco sempre visível + traço pintado
 * conforme o avanço. Sem JS (ou com movimento reduzido) a linha aparece pronta.
 *
 * A onda é gerada com meias-ondas cúbicas de tangente vertical nas junções — a
 * curva sai contínua e o passo (SEG) é curto o bastante para a sinuosidade
 * continuar legível mesmo esticada em ~12.000px de página.
 */
const AMP = 26 // afastamento do eixo, em unidades do viewBox (x vai de 24 a 76)
const SEG = 32 // meia-onda: ~15 ondas ao longo do percurso

function buildSpine(): { d: string; markers: { x: number; y: number }[] } {
  const markers: { x: number; y: number }[] = []
  let d = 'M50,0'
  let y = 0
  let side = 1
  // Primeiro trecho sai do centro; os seguintes alternam entre os dois extremos.
  let from = 50
  while (y < 1000) {
    const next = Math.min(y + SEG, 1000)
    const to = next === 1000 ? 50 : 50 + AMP * side
    const h = next - y
    d += ` C${from},${y + h / 3} ${to},${next - h / 3} ${to},${next}`
    if (next < 1000) markers.push({ x: to, y: next })
    from = to
    y = next
    side *= -1
  }
  return { d, markers }
}

const { d: SPINE_PATH, markers: WAVE } = buildSpine()

/** Marcos: um a cada 4 cristas — pontos de parada, não serrilha. */
const MARKERS = WAVE.filter((_, i) => i % 4 === 1)

function Spine() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    const walk = svg?.parentElement
    if (!svg || !walk) return

    const line = svg.querySelector<SVGPathElement>('.spine-ink')!
    const dots = [...svg.querySelectorAll<SVGPathElement>('.spine-dot')]

    const paint = (p: number) => {
      line.style.strokeDashoffset = String(1 - p)
      for (const d of dots) d.classList.toggle('is-on', p >= Number(d.dataset.at))
    }

    // Movimento reduzido: o passadiço já está lá, inteiro. Sem desenho.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint(1)
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const box = walk.getBoundingClientRect()
      // Avanço = quanto do percurso já passou por baixo do "pé" (85% da viewport).
      const advanced = window.innerHeight * 0.85 - box.top
      paint(Math.min(1, Math.max(0, advanced / box.height)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    /* Abrir/fechar um "Saiba mais" muda a altura do percurso: o SVG (height:100%)
       se re-estica sozinho, mas a FRAÇÃO já pintada ficaria velha — a tinta
       apareceria boiando ou cortada em relação ao trilho. Remedir na mudança. */
    const ro =
      'ResizeObserver' in window ? new ResizeObserver(() => onScroll()) : null
    ro?.observe(walk)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      ro?.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <svg
      ref={ref}
      className="spine"
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="spine-track" d={SPINE_PATH} vectorEffect="non-scaling-stroke" />
      <path
        className="spine-ink"
        d={SPINE_PATH}
        pathLength={1}
        vectorEffect="non-scaling-stroke"
      />
      {MARKERS.map((m) => (
        <path
          key={m.y}
          className="spine-dot"
          data-at={m.y / 1000}
          d={`M${m.x},${m.y} h0.001`}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}

/* ----------------------------------------------------------------- peças --- */

/** Revela por deslocamento — a opacidade NUNCA entra: sem JS o conteúdo já está lá. */
function useReveal() {
  useEffect(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>('.reveal')]
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
}

function WhatsAppButton({ variant = 'solid' }: { variant?: 'solid' | 'invert' }) {
  return (
    <a
      className={`btn btn--${variant}`}
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
    >
      {t.cta.primary}
    </a>
  )
}

/**
 * Instagram: no celular é SÓ O ÍCONE (alvo de 48px, nome acessível intacto —
 * o rótulo continua sendo `t.cta.instagram`, escondido só para o olho). No
 * desktop o ícone some e o link volta a ser o texto de sempre.
 */
function InstagramLink({ dark = false }: { dark?: boolean }) {
  return (
    <a
      className={`link-quiet ig${dark ? ' link-quiet--dark' : ''}`}
      href={CONTACT.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.cta.instagram}
    >
      <svg className="ig-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle className="ig-dot" cx="17.2" cy="6.8" r="1.1" />
      </svg>
      <span className="ig-text">{t.cta.instagram}</span>
    </a>
  )
}

/** O breakpoint do mobile — o mesmo do CSS. Fonte única para as duas pontas. */
const MOBILE_Q = '(max-width: 767px)'

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_Q).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_Q)
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return mobile
}

/**
 * Divulgação progressiva — só no celular.
 *
 * No DESKTOP este componente é transparente: devolve os filhos como estão, sem
 * botão e sem invólucro. O DOM (e o layout) do desktop fica idêntico ao que era.
 *
 * No MOBILE o miolo entra num bloco recolhido (continua no DOM) e um botão com
 * `aria-expanded`/`aria-controls` abre no lugar — sem tirar a pessoa do contexto.
 */
function More({ label, children }: { label: string; children: ReactNode }) {
  const mobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const id = useId()

  if (!mobile) return <>{children}</>

  return (
    <>
      <div className={`more-body${open ? ' is-open' : ''}`} id={id}>
        {children}
      </div>
      <button
        type="button"
        className="more-btn"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="more-mark" aria-hidden="true" />
        {open ? MORE.less : label}
      </button>
    </>
  )
}

type StopProps = {
  photo: Photo
  alt: string
  className?: string
  sizes: string
  hero?: boolean
}

/**
 * Uma parada no caminho. São só três fotos: o hero entra com prioridade alta e
 * as outras duas em prioridade baixa (fora do caminho crítico do LCP, mas sem
 * `lazy` — o Chrome adia a *pintura* de imagem lazy fora da viewport e a parada
 * chega a aparecer vazia em captura/print de página inteira).
 */
function Stop({ photo, alt, className = '', sizes, hero }: StopProps) {
  return (
    <picture className={`shot ${className}`}>
      <source type="image/webp" srcSet={photo.webpSrcSet} sizes={sizes} />
      <img
        src={photo.jpg900}
        srcSet={photo.jpgSrcSet}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={alt}
        loading="eager"
        fetchPriority={hero ? 'high' : 'low'}
        decoding="sync"
      />
    </picture>
  )
}

/* ------------------------------------------------------------------ App ---- */

export function App() {
  useReveal()

  const heroRef = useRef<HTMLDivElement>(null)
  const [docked, setDocked] = useState(false)

  // Barra de contato no mobile: só depois que o BLOCO DE TEXTO do hero (é ele
  // quem tem o botão) sai de cena — não depois da foto, que vem bem depois.
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setDocked(!e.isIntersecting), {
      threshold: 0,
    })
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  const [quoteBefore, quoteAfter = ''] = t.quote.text.split(t.quote.emphasis)

  return (
    <div className="v2">
      <a className="skip-link" href="#conteudo">
        {t.a11y.skipToContent}
      </a>

      <header className="topbar">
        <div className="shell topbar-in">
          <a className="wordmark" href="#top">
            {WORDMARK}
          </a>
          <nav className="topnav" aria-label={t.nav.contact}>
            <a href={`#${SECTIONS.about}`}>{t.nav.about}</a>
            <a href={`#${SECTIONS.work}`}>{t.nav.work}</a>
            <a href={`#${SECTIONS.session}`}>{t.nav.session}</a>
            <a href={`#${SECTIONS.faq}`}>{t.nav.faq}</a>
            <a
              className="topnav-cta"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.nav.contact}
            </a>
          </nav>
        </div>
      </header>

      <main id="conteudo" className="walk">
        <Spine />

        {/* ---------------------------------------------------------- hero -- */}
        <section className="hero" aria-labelledby="hero-h">
          <div className="hero-copy" ref={heroRef}>
            <p className="hero-greeting">{t.hero.greeting}</p>
            <h1 id="hero-h">{t.hero.headline}</h1>
            <p className="hero-sub">{t.hero.subhead}</p>
            <p className="hero-tag">{t.hero.tagline}</p>
            <div className="hero-actions">
              <WhatsAppButton />
              <a className="link-quiet" href={`#${SECTIONS.work}`}>
                {t.cta.secondary}
              </a>
            </div>
            <p className="hero-scroll" aria-hidden="true">
              {t.hero.scroll}
            </p>
          </div>
          <Stop
            photo={PHOTOS.retrato}
            alt={t.a11y.portraitAlt}
            className="shot--hero"
            sizes="(min-width: 900px) 46vw, 100vw"
            hero
          />
        </section>

        {/* -------------------------------------------------------- change -- */}
        <section className="band band--dark change" aria-labelledby="change-h">
          <div className="shell">
            <h2 id="change-h" className="reveal">
              {t.change.title}
            </h2>
            {/* Abertura sempre visível; o resto do bloco desce para o "saiba mais"
                no celular (no desktop o <More> some e volta tudo a ser um só fluxo). */}
            <div className="prose reveal">
              <p>{t.change.paragraphs[0]}</p>
            </div>
            <More label={MORE.change}>
              <div className="prose prose--cont reveal">
                {t.change.paragraphs.slice(1).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="change-question reveal">{t.change.question}</p>

              <div className="steps-wrap reveal">
                <p className="steps-intro">{t.change.stepsIntro}</p>
                {/* Sequência real: consciência → aceitação → ação. Numerar aqui é honesto. */}
                <ol className="steps">
                  {t.change.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <p className="steps-outro">{t.change.stepsOutro}</p>
              </div>
            </More>
          </div>
        </section>

        {/* -------------------------------------- parada 1: a foto do sorriso */}
        <Stop
          photo={PHOTOS.sorriso}
          alt={t.a11y.smileAlt}
          className="shot--bleed shot--sorriso"
          sizes="100vw"
        />

        {/* --------------------------------------------------------- about -- */}
        <section id={SECTIONS.about} className="band about" aria-labelledby="about-h">
          <div className="shell">
            <h2 id="about-h" className="marco reveal">
              {t.about.title}
            </h2>
            <p className="about-role reveal">{t.about.role}</p>
            <div className="prose reveal">
              <p>{t.about.paragraphs[0]}</p>
            </div>
            <More label={MORE.about}>
              <div className="prose prose--cont reveal">
                {t.about.paragraphs.slice(1).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </More>
            <dl className="facts reveal">
              {t.about.facts.map((f) => (
                <div key={f.value}>
                  <dt>{f.value}</dt>
                  <dd>{f.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------------------------------------------------- work -- */}
        <section id={SECTIONS.work} className="band band--tint work" aria-labelledby="work-h">
          <div className="shell">
            <h2 id="work-h" className="marco reveal">
              {t.work.title}
            </h2>
            <p className="lead reveal">{t.work.intro}</p>
            <div className="points">
              {t.work.points.slice(0, 1).map((p) => (
                <article className="point reveal" key={p.title}>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </article>
              ))}
              <More label={MORE.work}>
                {t.work.points.slice(1).map((p) => (
                  <article className="point reveal" key={p.title}>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </article>
                ))}
              </More>
            </div>
          </div>
        </section>

        {/* ------------------------------------- parada 2: a foto da palestra */}
        <Stop
          photo={PHOTOS.palestra}
          alt={t.a11y.talkAlt}
          className="shot--bleed shot--palestra"
          sizes="100vw"
        />

        {/* ------------------------------------------------------ benefits -- */}
        <section className="band benefits" aria-labelledby="benefits-h">
          <div className="shell">
            <h2 id="benefits-h" className="marco reveal">
              {t.benefits.title}
            </h2>
            <p className="lead reveal">{t.benefits.intro}</p>
            <div className="clearings">
              {t.benefits.items.map((i) => (
                <article className="clearing reveal" key={i.title}>
                  <h3>{i.title}</h3>
                  <p>{i.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- space -- */}
        <section id={SECTIONS.space} className="band band--dark space" aria-labelledby="space-h">
          <div className="shell">
            <h2 id="space-h" className="reveal">
              {t.space.title}
            </h2>
            <p className="space-lead reveal">{t.space.lead}</p>
            <More label={MORE.space}>
              <div className="prose reveal">
                {t.space.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </More>
            <p className="space-highlight reveal" aria-hidden="true">
              {t.space.highlight}
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------- session -- */}
        <section id={SECTIONS.session} className="band session" aria-labelledby="session-h">
          <div className="shell">
            <h2 id="session-h" className="marco reveal">
              {t.session.title}
            </h2>
            <p className="lead reveal">{t.session.lead}</p>
            <p className="session-format reveal">{t.session.format}</p>

            <More label={MORE.session}>
              <p className="stages-intro reveal">{t.session.structureTitle}</p>
              {/* Segunda sequência real: os três momentos, na ordem em que acontecem. */}
              <ol className="stages">
                {t.session.structure.map((s) => (
                  <li className="reveal" key={s.title}>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </li>
                ))}
              </ol>
              <p className="note reveal">{t.session.frequencyNote}</p>
            </More>
          </div>
        </section>

        {/* --------------------------------------------------------- first -- */}
        <section className="band band--tint first" aria-labelledby="first-h">
          <div className="shell">
            <h2 id="first-h" className="reveal">
              {t.first.title}
            </h2>
            <div className="prose prose--wide reveal">
              <p>{t.first.paragraphs[0]}</p>
              <More label={MORE.first}>
                {t.first.paragraphs.slice(1).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </More>
            </div>
            <div className="first-actions reveal">
              <WhatsAppButton />
              <InstagramLink />
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- quote -- */}
        <section className="band band--dark quote" aria-label={t.quote.source}>
          <div className="shell">
            <blockquote className="reveal">
              <p>
                {quoteBefore}
                <em>{t.quote.emphasis}</em>
                {quoteAfter}
              </p>
              <cite>{t.quote.source}</cite>
            </blockquote>
          </div>
        </section>

        {/* ----------------------------------------------------------- faq -- */}
        <section id={SECTIONS.faq} className="band faq" aria-labelledby="faq-h">
          <div className="shell">
            <h2 id="faq-h" className="marco reveal">
              {t.faq.title}
            </h2>
            <div className="faq-list">
              {t.faq.items.map((item) => (
                <details className="reveal" key={item.q}>
                  <summary>
                    <h3>{item.q}</h3>
                    <span className="faq-mark" aria-hidden="true" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- closing -- */}
        <section
          id={SECTIONS.contact}
          className="band band--deep closing"
          aria-labelledby="closing-h"
        >
          <div className="shell">
            <h2 id="closing-h" className="reveal">
              {t.closing.title}
            </h2>
            <p className="closing-text reveal">{t.closing.text}</p>
            <div className="closing-actions reveal">
              <WhatsAppButton variant="invert" />
              <InstagramLink dark />
            </div>
            <p className="note note--dark reveal">{t.cta.note}</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer-in">
          <div>
            <p className="footer-name">{t.footer.name}</p>
            <p className="footer-line">
              {t.footer.role} · {CREDENTIALS.cpp} · {CREDENTIALS.crp}
            </p>
            <p className="footer-line">{t.footer.location}</p>
          </div>
          <nav className="footer-links" aria-label={t.nav.contact}>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              {t.footer.whatsapp}
            </a>
            <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer">
              {t.footer.instagram} {CONTACT.instagramHandle}
            </a>
          </nav>
        </div>
      </footer>

      <div className={`dock${docked ? ' is-up' : ''}`}>
        <a
          className="btn btn--solid btn--block"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.cta.primary}
        </a>
      </div>
    </div>
  )
}
