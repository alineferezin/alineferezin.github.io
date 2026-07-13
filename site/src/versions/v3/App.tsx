/**
 * Proposta V3 — "Consultório".
 *
 * Desktop: split. Foto fixa à esquerda (a "porta" do consultório), conteúdo rola
 * à direita numa coluna única, com uma barra de seções grudada no topo.
 * Mobile: a mesma placa vira hero de tela cheia, e a barra de seções gruda no
 * topo depois dela. O CTA fica sempre à mão (na placa no desktop, numa barra
 * fixa embaixo no mobile).
 *
 * Navegação = âncoras reais + scroll-spy (todo o conteúdo sempre no DOM e
 * alcançável por rolagem e por teclado — nada escondido atrás de estado).
 */
import { useEffect, useRef, useState } from 'react'
import { getContent } from '../../i18n'
import { CONTACT, CREDENTIALS } from '../../config'
import { PHOTOS, type Photo } from '../../shared/photos'
import './v3.css'

type NavKey = 'about' | 'work' | 'space' | 'session' | 'faq' | 'contact'

/** Itens da barra de seções (rótulos vêm de t.nav). */
const NAV: { key: NavKey; target: string }[] = [
  { key: 'about', target: 'about' },
  { key: 'work', target: 'work' },
  { key: 'space', target: 'space' },
  { key: 'session', target: 'session' },
  { key: 'faq', target: 'faq' },
  { key: 'contact', target: 'closing' },
]

/** Seção observada → item da barra que acende. Ordem = ordem no documento. */
const SPY: [string, NavKey][] = [
  ['start', 'about'],
  ['change', 'about'],
  ['about', 'about'],
  ['work', 'work'],
  ['benefits', 'work'],
  ['space', 'space'],
  ['session', 'session'],
  ['first', 'session'],
  ['quote', 'session'],
  ['faq', 'faq'],
  ['closing', 'contact'],
]

/**
 * `priority`: 'high' = hero (eager, prioritário); 'low' = carrega junto, mas por
 * último (a foto do "nosso espaço" entra em cena cedo demais pro lazy loading);
 * ausente = lazy.
 */
function Img({
  photo,
  alt,
  sizes,
  className,
  priority,
}: {
  photo: Photo
  alt: string
  sizes: string
  className?: string
  priority?: 'high' | 'low'
}) {
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={photo.webpSrcSet} sizes={sizes} />
      <img
        src={photo.jpg900}
        srcSet={photo.jpgSrcSet}
        sizes={sizes}
        alt={alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ?? 'auto'}
        decoding="async"
      />
    </picture>
  )
}

export function App() {
  const t = getContent()
  const whatsappHref = CONTACT.whatsapp(t.cta.whatsappMessage)

  const [active, setActive] = useState<NavKey>('about')
  const navListRef = useRef<HTMLUListElement>(null)
  const navItemRefs = useRef<Partial<Record<NavKey, HTMLAnchorElement | null>>>({})

  /* Scroll-spy: root = viewport (funciona igual com o painel rolando por dentro). */
  useEffect(() => {
    const ids = SPY.map(([id]) => id)
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    const visible = new Set<string>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        const first = SPY.find(([id]) => visible.has(id))
        if (first) setActive(first[1])
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  /* Mantém o item ativo visível na barra rolável (só na horizontal). */
  useEffect(() => {
    const list = navListRef.current
    const item = navItemRefs.current[active]
    if (!list || !item || list.scrollWidth <= list.clientWidth + 1) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.scrollTo({ left: item.offsetLeft - 16, behavior: reduced ? 'auto' : 'smooth' })
  }, [active])

  /* Reveal: o conteúdo já está visível; a classe é transitória e sai sozinha. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timers: number[] = []
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const el = e.target as HTMLElement
          obs.unobserve(el)
          el.classList.add('is-revealing')
          const clear = () => el.classList.remove('is-revealing')
          el.addEventListener('animationend', clear, { once: true })
          timers.push(window.setTimeout(clear, 1400)) // rede de segurança
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.04 },
    )
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])

  const [before, emphasis, after] = splitOnce(t.quote.text, t.quote.emphasis)

  return (
    <div className="v3">
      <a className="skip-link" href="#conteudo">
        {t.a11y.skipToContent}
      </a>

      {/* A placa: foto + identidade + CTA. Fixa à esquerda no desktop, hero no mobile. */}
      <header className="plate">
        <Img
          photo={PHOTOS.retrato}
          alt={t.a11y.portraitAlt}
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="plate__photo"
          priority="high"
        />
        <span className="plate__mark" aria-hidden="true">
          a
        </span>
        <div className="plate__scrim">
          <p className="plate__greeting">{t.hero.greeting}</p>
          <p className="plate__name">Aline Ferezin</p>
          <p className="plate__role">{t.about.role}</p>
          <p className="plate__cred">
            {CREDENTIALS.cpp} · {CREDENTIALS.crp}
          </p>
          <div className="plate__actions">
            <a
              className="btn btn--primary"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.cta.primary}
            </a>
            <a
              className="btn btn--ghost"
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.cta.instagram}
            </a>
          </div>
          <p className="plate__scroll" aria-hidden="true">
            {t.hero.scroll}
          </p>
        </div>
      </header>

      <main className="panel" id="conteudo" tabIndex={-1}>
        {/* Nav único da página: não precisa de aria-label (não há outro pra desambiguar). */}
        <nav className="secnav">
          <ul className="secnav__list" ref={navListRef}>
            {NAV.map(({ key, target }) => (
              <li key={key}>
                <a
                  href={`#${target}`}
                  ref={(el) => {
                    navItemRefs.current[key] = el
                  }}
                  aria-current={active === key ? 'true' : undefined}
                >
                  {t.nav[key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section className="block block--start" id="start" data-reveal aria-labelledby="start-h">
          <h1 className="start__headline" id="start-h">
            {t.hero.headline}
          </h1>
          <p className="start__subhead">{t.hero.subhead}</p>
          <p className="start__tagline">{t.hero.tagline}</p>
        </section>

        <section className="block" id="change" data-reveal aria-labelledby="change-h">
          <h2 className="block__title" id="change-h">
            {t.change.title}
          </h2>
          <div className="prose">
            {t.change.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="change__question">{t.change.question}</p>
          <div className="change__steps">
            <p className="change__intro">{t.change.stepsIntro}</p>
            <ul className="ticks">
              {t.change.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="change__outro">{t.change.stepsOutro}</p>
          </div>
        </section>

        <section className="block" id="about" data-reveal aria-labelledby="about-h">
          <h2 className="block__title" id="about-h">
            {t.about.title}
          </h2>
          <p className="about__role">{t.about.role}</p>
          <div className="about__body">
            <div className="prose">
              {t.about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Img
              photo={PHOTOS.palestra}
              alt={t.a11y.talkAlt}
              sizes="(min-width: 1024px) 220px, 45vw"
              className="about__photo"
            />
          </div>
          <dl className="facts">
            {t.about.facts.map((f) => (
              <div className="fact" key={f.value}>
                <dt>{f.value}</dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="block" id="work" data-reveal aria-labelledby="work-h">
          <h2 className="block__title" id="work-h">
            {t.work.title}
          </h2>
          <p className="lead">{t.work.intro}</p>
          <ul className="rows">
            {t.work.points.map((p) => (
              <li className="row" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="block" id="benefits" data-reveal aria-labelledby="benefits-h">
          <h2 className="block__title" id="benefits-h">
            {t.benefits.title}
          </h2>
          <p className="lead">{t.benefits.intro}</p>
          <div className="benefits">
            {t.benefits.items.map((i) => (
              <div className="benefit" key={i.title}>
                <h3>{i.title}</h3>
                <p>{i.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="block block--dark space" id="space" data-reveal aria-labelledby="space-h">
          <div className="space__text">
            <h2 className="block__title" id="space-h">
              {t.space.title}
            </h2>
            <p className="space__lead">{t.space.lead}</p>
            <div className="prose">
              {t.space.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="space__highlight">{t.space.highlight}</p>
          </div>
          <Img
            photo={PHOTOS.sorriso}
            alt={t.a11y.smileAlt}
            sizes="(min-width: 1024px) 260px, 50vw"
            className="space__photo"
            priority="low"
          />
        </section>

        <section className="block" id="session" data-reveal aria-labelledby="session-h">
          <h2 className="block__title" id="session-h">
            {t.session.title}
          </h2>
          <p className="lead">{t.session.lead}</p>
          <p className="session__format">{t.session.format}</p>
          <h3 className="session__structure-title">{t.session.structureTitle}</h3>
          <ol className="rail">
            {t.session.structure.map((s) => (
              <li key={s.title}>
                <p className="rail__title">{s.title}</p>
                <p className="rail__text">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="fineprint">{t.session.frequencyNote}</p>
        </section>

        <section className="block block--first" id="first" data-reveal aria-labelledby="first-h">
          <h2 className="block__title" id="first-h">
            {t.first.title}
          </h2>
          <div className="prose">
            {t.first.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section className="block block--quote" id="quote" data-reveal aria-label={t.quote.source}>
          <blockquote>
            <p>
              {before}
              <em>{emphasis}</em>
              {after}
            </p>
            <cite>{t.quote.source}</cite>
          </blockquote>
        </section>

        <section className="block" id="faq" data-reveal aria-labelledby="faq-h">
          <h2 className="block__title" id="faq-h">
            {t.faq.title}
          </h2>
          <div className="faq">
            {t.faq.items.map((item) => (
              <details key={item.q}>
                <summary>
                  <span>{item.q}</span>
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="block block--closing" id="closing" data-reveal aria-labelledby="closing-h">
          <h2 className="closing__title" id="closing-h">
            {t.closing.title}
          </h2>
          <p className="closing__text">{t.closing.text}</p>
          <div className="closing__actions">
            <a
              className="btn btn--primary"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.cta.primary}
            </a>
            <a
              className="btn btn--ghost"
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.cta.instagram}
            </a>
          </div>
          <p className="closing__note">{t.cta.note}</p>
        </section>

        <footer className="foot">
          <p className="foot__name">{t.footer.name}</p>
          <p className="foot__line">
            {t.footer.role} · {t.footer.credentials}
          </p>
          <p className="foot__line">{t.footer.location}</p>
          <ul className="foot__links">
            <li>
              <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer">
                {t.footer.instagram}
              </a>
              <span className="foot__handle">{CONTACT.instagramHandle}</span>
            </li>
            <li>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                {t.footer.whatsapp}
              </a>
            </li>
          </ul>
        </footer>
      </main>

      {/* Mobile: o CTA nunca sai da mão. */}
      <div className="bar">
        <a
          className="btn btn--primary"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.cta.primary}
        </a>
        <a
          className="btn btn--ghost"
          href={CONTACT.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.footer.instagram}
        </a>
      </div>
    </div>
  )
}

/** Divide o texto na primeira ocorrência da palavra a destacar (sem inventar copy). */
function splitOnce(text: string, word: string): [string, string, string] {
  const i = text.indexOf(word)
  if (i < 0) return [text, '', '']
  return [text.slice(0, i), word, text.slice(i + word.length)]
}
