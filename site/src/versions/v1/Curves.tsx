/**
 * Curvas orgânicas da identidade da Aline, recriadas como SVG inline.
 * Linha fina, sinuosa, sem preenchimento — a assinatura da V1.
 *
 * `pathLength={1}` normaliza o comprimento do traço: o CSS anima
 * `stroke-dashoffset` de 1 → 0 sem precisar medir o path em JS.
 * Estado padrão (sem animação) = curva JÁ desenhada. Nunca escondemos nada.
 */

type Props = { className?: string }

/** Fio horizontal que atravessa a transição entre seções. */
export function CurveFlow({ className }: Props) {
  return (
    <svg
      className={`curve curve--flow ${className ?? ''}`}
      viewBox="0 0 1200 150"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        pathLength={1}
        d="M-40 104 C 130 24, 250 6, 402 58 C 554 110, 626 148, 782 126 C 918 107, 1044 40, 1240 74"
      />
    </svg>
  )
}

/** Mesmo fio, espelhado — para não repetir o mesmo desenho duas vezes na página. */
export function CurveFlowAlt({ className }: Props) {
  return (
    <svg
      className={`curve curve--flow ${className ?? ''}`}
      viewBox="0 0 1200 150"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        pathLength={1}
        d="M-40 52 C 150 128, 268 140, 430 92 C 592 44, 664 12, 812 30 C 950 47, 1058 112, 1240 78"
      />
    </svg>
  )
}

/** Fio vertical que costura uma sequência (os passos, a estrutura da sessão). */
export function CurveThread({ className }: Props) {
  return (
    <svg
      className={`curve curve--thread ${className ?? ''}`}
      viewBox="0 0 40 400"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        pathLength={1}
        d="M20 -10 C 2 62, 38 118, 20 190 C 3 258, 37 316, 20 410"
      />
    </svg>
  )
}

/** Traço solto embaixo de uma palavra — o grifo à mão. */
export function CurveUnderline({ className }: Props) {
  return (
    <svg
      className={`curve curve--underline ${className ?? ''}`}
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path pathLength={1} d="M3 9 C 42 2, 66 12, 104 7 C 142 2, 168 11, 197 4" />
    </svg>
  )
}

/** Monograma "a" da marca, aberto por uma curva. */
export function Monogram({ className }: Props) {
  return (
    <svg
      className={`monogram ${className ?? ''}`}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="monogram__ring"
        pathLength={1}
        d="M46 12 C 20 2, 2 22, 6 42 C 9 60, 34 66, 50 54"
      />
      <text className="monogram__letter" x="32" y="43" textAnchor="middle">
        a
      </text>
    </svg>
  )
}
