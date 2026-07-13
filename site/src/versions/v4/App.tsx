/**
 * V4 — "Diálogo".
 *
 * A página é uma conversa transcrita, e as duas vozes têm cor e letra próprias:
 *
 *   quem chega → perguntas em Montserrat, rentes à margem esquerda, sobre faixas
 *                cheias no AZUL DA MARCA (#7891ae).
 *   ela        → falas em Alice, travessão pendurado, recuadas, em tinta VERDE
 *                (verde quase-preto no corpo; verde da marca no travessão e nos botões).
 *
 * O herói já é o primeiro turno: ela cumprimenta ("— Olá, boas vindas!") e, logo
 * abaixo, ainda na primeira dobra, entra a dúvida de quem chegou, em azul.
 *
 * NO CELULAR, a fala dela COMEÇA e continua sob demanda: cada turno longo abre
 * com o primeiro parágrafo e guarda o resto atrás de um "continuar lendo"
 * (<details> nativo — o conteúdo nunca sai do DOM). No desktop (≥48rem) o
 * <details> nasce aberto e o <summary> some: a página é exatamente a de sempre.
 *
 * Toda a copy de página vem de `content/pt.ts` — nada de texto solto no JSX.
 */
import { useEffect, useState, type ReactNode } from 'react'
import { CONTACT, CREDENTIALS } from '../../config'
import { getContent } from '../../i18n'
import { PHOTOS, type Photo } from '../../shared/photos'
import './v4.css'

/** Wordmark derivado do nome oficial — sem copy inventada. */
const WORDMARK = CREDENTIALS.fullName.split(' ').slice(0, 2).join(' ')

/**
 * Rótulos do controle de divulgação progressiva. São rótulos de CONTROLE (UI),
 * não copy de página — por isso vivem aqui e não em `content/pt.ts`. Cada um diz
 * o que abre, na voz da conversa. Se a V4 for a escolhida, promover para
 * `cta.more` no content (com o par em `en.ts`).
 */
const MORE = {
  close: 'Fechar',
  change: 'Continuar lendo a resposta',
  about: 'Continuar lendo sobre mim',
  work: 'Ver os pontos da abordagem',
  benefits: 'Ver os benefícios',
  space: 'Continuar lendo',
  session: 'Ver a estrutura da sessão',
  first: 'Continuar lendo',
}

/** Breakpoint único da divulgação progressiva — casa com o CSS (48rem = 768px). */
const DESKTOP_QUERY = '(min-width: 48rem)'

function useDesktop() {
  const [desktop, setDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const sync = () => setDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return desktop
}

/**
 * "Continuar lendo": a fala dela começa e segue sob demanda.
 *
 * - No celular: <details> fechado. O texto continua no DOM (Ctrl+F, leitor de
 *   tela e busca acham); o <summary> nativo já anuncia expandido/recolhido.
 * - No desktop: `open` e o <summary> escondido no CSS — nada muda.
 *
 * `gap` reproduz, no elemento <details>, a margem que o primeiro filho tinha
 * quando era irmão direto — para o desktop ficar milimetricamente igual.
 */
function More({
  label,
  gap = 'flow',
  onDark = false,
  children,
  open,
}: {
  label: string
  gap?: 'flow' | 'block' | 'none'
  onDark?: boolean
  children: ReactNode
  open: boolean
}) {
  return (
    <details className={`more more--${gap}${onDark ? ' more--onDark' : ''}`} open={open}>
      <summary className="more__sum">
        <span className="more__txt more__txt--closed">{label}</span>
        <span className="more__txt more__txt--open">{MORE.close}</span>
        <span className="more__chev" aria-hidden="true" />
      </summary>
      <div className="more__body">{children}</div>
    </details>
  )
}

/** Instagram: no celular só o ícone (alvo de 48px); no desktop, o texto de sempre. */
function InstagramLink({ label, className = '' }: { label: string; className?: string }) {
  return (
    <a
      className={`btn btn--quiet btn--ig ${className}`.trim()}
      href={CONTACT.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <svg className="btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" />
        <circle cx="12" cy="12" r="4.1" />
        <circle cx="17.3" cy="6.7" r="1.15" className="btn__icon-dot" />
      </svg>
      <span className="btn__label">{label}</span>
    </a>
  )
}

function Foto({
  photo,
  alt,
  sizes,
  className,
  eager = false,
  priority = false,
}: {
  photo: Photo
  alt: string
  sizes: string
  className?: string
  /** `loading="eager"` — as três fotos da página são poucas e leves. */
  eager?: boolean
  priority?: boolean
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
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="sync"
      />
    </picture>
  )
}

export function App() {
  const t = getContent()
  const zap = CONTACT.whatsapp(t.cta.whatsappMessage)
  const open = useDesktop()

  const Zap = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <a className={className} href={zap} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )

  return (
    <div className="v4">
      <a className="skip-link" href="#conversa">
        {t.a11y.skipToContent}
      </a>

      <header className="top">
        <div className="top__in">
          <a className="top__mark" href="#conversa">
            <span className="top__name">{WORDMARK}</span>
            <span className="top__role">{t.about.role}</span>
          </a>
          <nav className="top__nav" aria-label={t.nav.contact}>
            <a href="#sobre">{t.nav.about}</a>
            <a href="#trabalho">{t.nav.work}</a>
            <a href="#sessao">{t.nav.session}</a>
            <a href="#duvidas">{t.nav.faq}</a>
          </nav>
          <Zap className="top__cta">{t.cta.primary}</Zap>
        </div>
      </header>

      <main id="conversa">
        {/* ─── Turno 1: ela abre a conversa (o herói É a primeira fala) ─── */}
        <section className="hero" aria-labelledby="hero-h">
          <div className="hero__speaker">
            <Foto
              photo={PHOTOS.retrato}
              alt={t.a11y.portraitAlt}
              sizes="(max-width: 56rem) 4rem, 21rem"
              className="hero__photo"
              eager
              priority
            />
            <p className="hero__greeting">{t.hero.greeting}</p>
          </div>

          <div className="hero__turn">
            <h1 className="hero__headline" id="hero-h">
              {t.hero.headline}
            </h1>
            <p className="hero__subhead">{t.hero.subhead}</p>
            <p className="hero__tagline">{t.hero.tagline}</p>
            <div className="hero__actions">
              <Zap className="btn btn--solid">{t.cta.primary}</Zap>
              <a className="btn btn--quiet hero__second" href="#trabalho">
                {t.cta.secondary}
              </a>
            </div>
          </div>
        </section>

        {/* ─── Turno 2: a dúvida de quem chega — e a resposta dela ─── */}
        <section className="turn" id="mudanca" aria-labelledby="mudanca-h">
          <div className="askband">
            <div className="askband__in">
              <h2 className="ask" id="mudanca-h">
                {t.change.title}
              </h2>
            </div>
          </div>

          <div className="turn__in">
            <div className="say">
              <p className="say__p dash">{t.change.paragraphs[0]}</p>

              <More label={MORE.change} gap="flow" open={open}>
                {t.change.paragraphs.slice(1).map((p, i) => (
                  <p className="say__p" key={i}>
                    {p}
                  </p>
                ))}
                <p className="say__lead">{t.change.question}</p>

                <div className="steps">
                  <p className="steps__intro">{t.change.stepsIntro}</p>
                  <ol className="steps__list">
                    {t.change.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                  <p className="steps__outro">{t.change.stepsOutro}</p>
                </div>
              </More>
            </div>
          </div>
        </section>

        {/* ─── Turno 3: ela se apresenta ─── */}
        <section className="about" id="sobre" aria-labelledby="sobre-h">
          <div className="about__in">
            <Foto
              photo={PHOTOS.sorriso}
              alt={t.a11y.smileAlt}
              sizes="(max-width: 56rem) 14rem, 18rem"
              className="about__photo"
              eager
            />
            <div className="about__text">
              <h2 className="say__lead say__lead--h dash" id="sobre-h">
                {t.about.title}
              </h2>
              <p className="about__role">{t.about.role}</p>
              <p className="say__p">{t.about.paragraphs[0]}</p>

              <More label={MORE.about} gap="flow" open={open}>
                {t.about.paragraphs.slice(1).map((p, i) => (
                  <p className="say__p" key={i}>
                    {p}
                  </p>
                ))}
              </More>

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

        {/* ─── Turno 4: como ela trabalha (TCC) ─── */}
        <section className="turn" id="trabalho" aria-labelledby="trabalho-h">
          <div className="turn__in">
            <div className="say say--wide">
              <h2 className="say__lead say__lead--h dash" id="trabalho-h">
                {t.work.title}
              </h2>
              <p className="say__p">{t.work.intro}</p>

              <More label={MORE.work} gap="block" open={open}>
                <dl className="points">
                  {t.work.points.map((p) => (
                    <div className="points__item" key={p.title}>
                      <dt>{p.title}</dt>
                      <dd>{p.text}</dd>
                    </div>
                  ))}
                </dl>
              </More>
            </div>
          </div>
        </section>

        {/* ─── Turno 5: pergunta em azul, resposta em bloco verde ─── */}
        <section className="turn" aria-labelledby="beneficios-h">
          <div className="askband">
            <div className="askband__in">
              <h2 className="ask" id="beneficios-h">
                {t.benefits.title}
              </h2>
            </div>
          </div>

          <div className="band band--green">
            <div className="band__in">
              <div className="say say--onDark">
                <p className="say__lead dash">{t.benefits.intro}</p>

                <More label={MORE.benefits} gap="block" onDark open={open}>
                  <dl className="points points--onDark">
                    {t.benefits.items.map((it) => (
                      <div className="points__item" key={it.title}>
                        <dt>{it.title}</dt>
                        <dd>{it.text}</dd>
                      </div>
                    ))}
                  </dl>
                </More>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Turno 6: o espaço / o vínculo ─── */}
        <section className="turn" id="espaco" aria-labelledby="espaco-h">
          <div className="turn__in">
            <div className="say">
              <h2 className="say__lead say__lead--h dash" id="espaco-h">
                {t.space.title}
              </h2>
              <div className="space__panel">
                <p className="space__lead">{t.space.lead}</p>

                <More label={MORE.space} gap="none" open={open}>
                  {t.space.paragraphs.map((p, i) => (
                    <p className="say__p" key={i}>
                      {p}
                    </p>
                  ))}
                  <p className="space__word" aria-hidden="true">
                    {t.space.highlight}
                  </p>
                </More>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Convite no meio da conversa ─── */}
        <aside className="mid" aria-label={t.cta.primary}>
          <div className="mid__in">
            <Zap className="btn btn--solid">{t.cta.primary}</Zap>
            <InstagramLink label={t.cta.instagram} />
          </div>
        </aside>

        {/* ─── Turno 7: local, horário, estrutura ─── */}
        <section className="turn" id="sessao" aria-labelledby="sessao-h">
          <div className="turn__in">
            <div className="say say--wide">
              <h2 className="say__lead say__lead--h dash" id="sessao-h">
                {t.session.title}
              </h2>
              <p className="say__lead">{t.session.lead}</p>
              <p className="say__p">{t.session.format}</p>

              <More label={MORE.session} gap="block" open={open}>
                <p className="points__intro">{t.session.structureTitle}</p>
                <dl className="points">
                  {t.session.structure.map((s) => (
                    <div className="points__item" key={s.title}>
                      <dt>{s.title}</dt>
                      <dd>{s.text}</dd>
                    </div>
                  ))}
                </dl>
                <p className="note">{t.session.frequencyNote}</p>
              </More>
            </div>
          </div>
        </section>

        {/* ─── Turno 8: o convite ─── */}
        <section className="first" id="primeira" aria-labelledby="primeira-h">
          <div className="first__in">
            <div className="first__text">
              <h2 className="first__title dash" id="primeira-h">
                {t.first.title}
              </h2>
              <p className="say__lead">{t.first.paragraphs[0]}</p>

              <More label={MORE.first} gap="none" open={open}>
                {t.first.paragraphs.slice(1).map((p, i) => (
                  <p className="say__p" key={i}>
                    {p}
                  </p>
                ))}
              </More>
            </div>
            <Foto
              photo={PHOTOS.palestra}
              alt={t.a11y.talkAlt}
              sizes="(max-width: 56rem) 12rem, 16rem"
              className="first__photo"
              eager
            />
          </div>
        </section>

        {/* ─── A fala mais alta da página ─── */}
        <section className="quote" aria-label={t.quote.source}>
          <figure className="quote__in">
            <blockquote>
              <p>
                {t.quote.text.split(t.quote.emphasis)[0]}
                <em>{t.quote.emphasis}</em>
                {t.quote.text.split(t.quote.emphasis).slice(1).join(t.quote.emphasis)}
              </p>
            </blockquote>
            <figcaption>{t.quote.source}</figcaption>
          </figure>
        </section>

        {/* ─── As outras perguntas de quem chega ─── */}
        <section className="faq" id="duvidas" aria-labelledby="duvidas-h">
          <div className="faq__in">
            <h2 className="faq__title" id="duvidas-h">
              {t.faq.title}
            </h2>
            <div className="faq__list">
              {t.faq.items.map((item, i) => (
                <details className="faq__item" key={item.q} name="faq" open={i === 0}>
                  <summary>
                    <span className="faq__q">{item.q}</span>
                    <span className="faq__sign" aria-hidden="true" />
                  </summary>
                  <p className="faq__a">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Última fala ─── */}
        <section className="closing" id="contato" aria-labelledby="contato-h">
          <div className="closing__in">
            <h2 className="closing__title" id="contato-h">
              {t.closing.title}
            </h2>
            <p className="closing__text">{t.closing.text}</p>
            <div className="closing__actions">
              <Zap className="btn btn--solid btn--big">{t.cta.primary}</Zap>
              <InstagramLink label={t.cta.instagram} className="btn--ig-big" />
            </div>
            <p className="closing__note">{t.cta.note}</p>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="foot__in">
          <div className="foot__id">
            <p className="foot__name">{t.footer.name}</p>
            <p className="foot__role">
              {t.footer.role} · {CREDENTIALS.cpp} · {CREDENTIALS.crp}
            </p>
            <p className="foot__loc">{t.footer.location}</p>
          </div>
          <ul className="foot__links">
            <li>
              <Zap>{t.footer.whatsapp}</Zap>
            </li>
            <li>
              <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer">
                {t.footer.instagram} {CONTACT.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </footer>

      {/* Barra discreta no mobile — o convite sempre à mão, na zona do polegar. */}
      <div className="dock">
        <Zap className="btn btn--solid dock__btn">{t.cta.primary}</Zap>
      </div>
    </div>
  )
}
