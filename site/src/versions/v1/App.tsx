/**
 * PROPOSTA V1 — "Acolhida"
 *
 * A tela inteira mergulhada no verde escuro da marca; a foto dela é a primeira
 * coisa que se vê, olhando pra quem chega. Marrom quente só em detalhe.
 * As curvas orgânicas da identidade costuram as viradas de seção.
 *
 * Toda a copy vem de src/content — nada de texto solto aqui.
 */
import { useEffect, useRef, useState } from 'react'
import { getContent } from '../../i18n'
import { CONTACT, CREDENTIALS } from '../../config'
import { PHOTOS, type Photo } from '../../shared/photos'
import { CurveFlow, CurveFlowAlt, CurveThread, CurveUnderline, Monogram } from './Curves'
import './App.css'

function Picture({
  photo,
  alt,
  sizes,
  className,
  eager = false,
  position,
}: {
  photo: Photo
  alt: string
  sizes: string
  className?: string
  eager?: boolean
  position?: string
}) {
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={photo.webpSrcSet} sizes={sizes} />
      <img
        src={photo.jpg900}
        srcSet={photo.jpgSrcSet}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={alt}
        /* Só 3 fotos na página inteira (~130 KB em webp). As de baixo carregam
           sem bloquear nada — prioridade baixa, decode assíncrono — mas não
           ficam em branco quando a página é capturada/impressa de uma vez. */
        loading="eager"
        fetchPriority={eager ? 'high' : 'low'}
        decoding="sync"
        style={position ? { objectPosition: position } : undefined}
      />
    </picture>
  )
}

export function App() {
  const t = getContent()
  const whatsapp = CONTACT.whatsapp(t.cta.whatsappMessage)

  /** Barra de ação fixa no mobile: só aparece depois que o hero sai de cena.
   *  Não é conteúdo — o CTA do hero e o do fim existem independentes disto. */
  const heroEnd = useRef<HTMLDivElement>(null)
  const [pastHero, setPastHero] = useState(false)
  useEffect(() => {
    const sentinel = heroEnd.current
    if (!sentinel) return
    const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), {
      rootMargin: '0px',
    })
    io.observe(sentinel)
    return () => io.disconnect()
  }, [])

  const Cta = ({ variant = 'solid' }: { variant?: 'solid' | 'ghost' }) => (
    <a
      className={`btn btn--${variant}`}
      href={whatsapp}
      target="_blank"
      rel="noopener noreferrer"
    >
      {t.cta.primary}
    </a>
  )

  return (
    <>
      <a className="skip-link" href="#conteudo">
        {t.a11y.skipToContent}
      </a>

      <header className="topbar">
        <div className="wrap topbar__inner">
          <a className="brandmark" href="#topo">
            <Monogram />
            <span className="brandmark__name">Aline Ferezin</span>
          </a>
          <nav className="topnav">
            <a href="#sobre">{t.nav.about}</a>
            <a href="#trabalho">{t.nav.work}</a>
            <a href="#sessao">{t.nav.session}</a>
            <a href="#duvidas">{t.nav.faq}</a>
            <a className="topnav__cta" href={whatsapp} target="_blank" rel="noopener noreferrer">
              {t.nav.contact}
            </a>
          </nav>
        </div>
      </header>

      <main id="conteudo">
        {/* ---------------------------------------------------------- hero */}
        <section className="hero" id="topo">
          <div className="hero__media">
            <Picture
              photo={PHOTOS.retrato}
              alt={t.a11y.portraitAlt}
              sizes="100vw"
              className="hero__picture"
              eager
            />
            <div className="hero__tint" aria-hidden="true" />
          </div>
          <div className="hero__scrim" aria-hidden="true" />

          <div className="wrap hero__inner">
            <p className="hero__greeting">{t.hero.greeting}</p>
            <h1 className="hero__headline">{t.hero.headline}</h1>
            <p className="hero__subhead">{t.hero.subhead}</p>
            <p className="hero__tagline">{t.hero.tagline}</p>
            <div className="hero__actions">
              <Cta />
              <a
                className="btn btn--ghost"
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.cta.instagram}
              </a>
            </div>
            <p className="hero__scrollhint">{t.hero.scroll}</p>
          </div>

          <CurveFlow className="curve--hero" />
        </section>

        <div ref={heroEnd} aria-hidden="true" />

        {/* -------------------------------------------------------- change */}
        <section className="section section--deep change" aria-labelledby="change-t">
          {/* Grid nomeado: no desktop vira duas colunas sem trocar a ordem do DOM. */}
          <div className="wrap change__grid">
            <h2 className="h-display ga-title" id="change-t">
              {t.change.title}
            </h2>
            <div className="prose ga-prose">
              {t.change.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <p className="change__question ga-aside">{t.change.question}</p>

            <div className="steps ga-steps">
              <p className="steps__lead">{t.change.stepsIntro}</p>
              <div className="steps__body">
                <CurveThread className="curve--steps" />
                <ol className="steps__list">
                  {t.change.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
              <p className="steps__outro">{t.change.stepsOutro}</p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- about */}
        <section className="section section--mid about" id="sobre" aria-labelledby="about-t">
          <div className="wrap about__grid">
            <Picture
              photo={PHOTOS.sorriso}
              alt={t.a11y.smileAlt}
              sizes="(min-width: 64rem) 42vw, 100vw"
              className="framed about__photo"
              position="50% 22%"
            />
            <div className="about__text">
              <p className="kicker">{t.about.role}</p>
              <h2 className="h-display" id="about-t">
                {t.about.title}
              </h2>
              <div className="prose">
                {t.about.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <dl className="facts">
                {t.about.facts.map((f) => (
                  <div className="facts__item" key={f.value}>
                    <dt>{f.value}</dt>
                    <dd>{f.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- work */}
        <section className="section section--deep work" id="trabalho" aria-labelledby="work-t">
          <div className="wrap work__head">
            <div>
              <h2 className="h-display" id="work-t">
                {t.work.title}
              </h2>
              <p className="lead">{t.work.intro}</p>
            </div>
            <Picture
              photo={PHOTOS.palestra}
              alt={t.a11y.talkAlt}
              sizes="(min-width: 64rem) 34vw, 100vw"
              className="framed work__photo"
              position="50% 18%"
            />
          </div>

          <div className="wrap">
            <ul className="points">
              {t.work.points.map((p) => (
                <li className="points__item" key={p.title}>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
            <div className="work__cta">
              <Cta />
              <p className="note">{t.cta.note}</p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ benefits */}
        <section className="section section--light benefits" aria-labelledby="benefits-t">
          <CurveFlowAlt className="curve--benefits" />
          <div className="wrap">
            <h2 className="h-display" id="benefits-t">
              {t.benefits.title}
            </h2>
            <p className="lead">{t.benefits.intro}</p>
            <dl className="rows">
              {t.benefits.items.map((b) => (
                <div className="rows__row" key={b.title}>
                  <dt>{b.title}</dt>
                  <dd>{b.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------------------- space */}
        <section className="section section--mid space" id="espaco" aria-labelledby="space-t">
          <div className="wrap space__inner">
            <h2 className="kicker kicker--solo sp-kicker" id="space-t">
              {t.space.title}
            </h2>
            <p className="space__lead sp-lead">{t.space.lead}</p>
            <div className="prose sp-prose">
              {t.space.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="space__highlight sp-mark">
              <span className="marked">
                {t.space.highlight}
                <CurveUnderline />
              </span>
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------- session */}
        <section className="section section--deep session" id="sessao" aria-labelledby="session-t">
          <div className="wrap session__grid">
            <h2 className="h-display sg-title" id="session-t">
              {t.session.title}
            </h2>
            <p className="lead sg-lead">{t.session.lead}</p>
            <p className="session__format sg-format">{t.session.format}</p>

            <h3 className="session__subtitle sg-sub">{t.session.structureTitle}</h3>
            <div className="steps__body session__structure sg-list">
              <CurveThread className="curve--steps" />
              <ol className="structure">
                {t.session.structure.map((s) => (
                  <li key={s.title}>
                    <strong>{s.title}</strong>
                    <span>{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="note note--rule sg-note">{t.session.frequencyNote}</p>
          </div>
        </section>

        {/* --------------------------------------------------------- first */}
        <section className="section section--mid first" aria-labelledby="first-t">
          <CurveFlow className="curve--first" />
          <div className="wrap first__inner">
            <h2 className="h-display first__title" id="first-t">
              {t.first.title}
            </h2>
            <div className="prose prose--center">
              {t.first.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Cta />
          </div>
        </section>

        {/* --------------------------------------------------------- quote */}
        <section className="section quote" aria-label={t.quote.source}>
          <div className="wrap quote__inner">
            <blockquote>
              <p>
                <span aria-hidden="true" className="quote__mark">
                  “
                </span>
                {t.quote.text.split(t.quote.emphasis)[0]}
                <span className="marked marked--warm">
                  {t.quote.emphasis}
                  <CurveUnderline />
                </span>
                {t.quote.text.split(t.quote.emphasis)[1]}
              </p>
              <cite>{t.quote.source}</cite>
            </blockquote>
          </div>
        </section>

        {/* ----------------------------------------------------------- faq */}
        <section className="section section--deep faq" id="duvidas" aria-labelledby="faq-t">
          <div className="wrap faq__inner">
            <h2 className="h-display" id="faq-t">
              {t.faq.title}
            </h2>
            <div className="faq__list">
              {t.faq.items.map((item) => (
                <details className="qa" key={item.q}>
                  <summary>
                    <span>{item.q}</span>
                    <span className="qa__sign" aria-hidden="true" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- closing */}
        <section className="section section--mid closing" id="contato" aria-labelledby="closing-t">
          <CurveFlowAlt className="curve--closing" />
          <div className="wrap closing__inner">
            <h2 className="closing__title" id="closing-t">
              {t.closing.title}
            </h2>
            <p className="closing__text">{t.closing.text}</p>
            <div className="closing__actions">
              <Cta />
              <a
                className="btn btn--ghost"
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.cta.instagram}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <div className="footer__id">
            <Monogram className="monogram--big" />
            <p className="footer__name">{CREDENTIALS.fullName}</p>
            <p className="footer__role">{t.footer.role}</p>
          </div>
          <div className="footer__meta">
            <p>{`${CREDENTIALS.cpp} · ${CREDENTIALS.crp}`}</p>
            <p>{t.footer.location}</p>
          </div>
          <nav className="footer__links" aria-label={t.nav.contact}>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer">
              {t.footer.whatsapp}
            </a>
            <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer">
              {`${t.footer.instagram} · ${CONTACT.instagramHandle}`}
            </a>
          </nav>
        </div>
      </footer>

      {/* Barra fixa no mobile — polegar alcança sem rolar de volta. */}
      <div className={`stickybar ${pastHero ? 'is-on' : ''}`}>
        <a
          className="btn btn--solid stickybar__cta"
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.cta.primary}
        </a>
      </div>
    </>
  )
}
