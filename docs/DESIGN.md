# Design system — site da Aline

Como o site é construído. A **identidade** (cores, fontes) está em `BRAND.md` e é
lei; este arquivo descreve o **sistema** que a implementa.

## Stack

Vite 8 + React 19 + TypeScript, **multi-page** (uma entrada por proposta). Sem
backend, sem router: cada proposta é uma página estática independente.

```
site/
  index.html          # hub /mockup/ — a área de rascunhos (HTML puro, sem React)
  portifolios/
    index.html        # seletor das 5 propostas, com miniaturas
    v1/ … v5/         # uma entrada por proposta: index.html + main.tsx
  src/
    content/pt.ts     # TODA a copy em português (fonte de verdade)
    content/en.ts     # tradução completa, tipada contra o PT
    i18n.ts           # getContent() · ?lang=en · applyLangToDocument()
    config.ts         # WhatsApp, Instagram, CRP/CPP
    shared/tokens.css # tokens da marca em OKLCH + reset + a11y
    shared/photos.ts  # as 3 fotos dela, com srcset pronto
    assets/fonts.css  # Alice + Montserrat em base64 (sem CDN)
    assets/img/       # fotos otimizadas (geradas de materials/)
    versions/v1..v5/  # o design de cada proposta (App.tsx + css)
```

`npm run build` → `mockup/` (hub) + `mockup/portifolios/{v1..v5}/` (propostas),
com `base: './'` — paths relativos, então **o mesmo build serve em
`alineferezin.com` e em `alineferezin.github.io`**, em qualquer profundidade.
A raiz `/` do repo continua sendo o site publicado: **o build não toca nela**.

Cuidado: `emptyOutDir` limpa `mockup/` a cada build — as miniaturas do seletor
são regeneradas depois (`node scripts/thumbs.mjs`), não edite nada à mão lá.

## Regras que o sistema impõe

- **Nenhuma copy no JSX.** Todo texto vem de `content/pt.ts` via `getContent()`.
  Consequência: traduzir = escrever um arquivo; o TypeScript acusa chave faltando.
  O inglês já existe e roda em `?lang=en` — falta só um seletor visível na UI.
- **Nenhum contato hardcoded.** WhatsApp/Instagram/CRP saem de `config.ts`.
  Trocar o número = uma linha, as 5 propostas seguem.
- **Fotos com `<picture>` + srcset** (WebP + JPEG, 900/1600), `width`/`height`
  explícitos (sem CLS). Hero: `eager` + `fetchpriority="high"`.
- **Fontes self-hosted em base64** (`npm run fonts` regenera). Sem Google Fonts
  em runtime: sem FOIT, sem terceiro, funciona offline.
- **TAN Headline** (títulos 2 da marca) é paga e ainda não temos o arquivo —
  Alice cobre os dois níveis. Quando chegar: embutir do mesmo jeito em `fonts.css`.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Vite dev. As propostas em `/v1/`…`/v5/`, o seletor em `/` |
| `npm run build` | Build das 5 → `mockup/portifolios/` |
| `npm run fonts` | Baixa Alice + Montserrat e embute em base64 (subset `latin`) |
| `npm run photos` | Otimiza as fotos de `materials/` → `src/assets/img/` |
| `npm run shots` | `node scripts/shots.mjs <url> <dir> <prefixo>` — printa 390/768/1440 página inteira **e falha** se houver erro de console, imagem quebrada ou overflow horizontal |
| `node scripts/thumbs.mjs` | Miniaturas das 5 pro seletor (rodar depois do build, com `vite preview` no ar) |

`scripts/shots.mjs` é o portão de qualidade: nenhuma proposta foi entregue sem
sair 0 nos três breakpoints.

## Armadilhas já pagas (não repita)

- **Reveal que segura `opacity: 0`** trava a seção invisível pra sempre (o Chrome
  pausa animação em aba oculta/reload). Regra: conteúdo **visível por padrão**;
  animação só enriquece. As 5 propostas seguem isso — v2/v5 animam só `transform`.
- **`loading="lazy"` + captura de página inteira**: o Chrome adia a *pintura* e a
  foto sai em branco. Fotos fora da dobra vão `eager` + `fetchpriority="low"`
  (+ `decoding="sync"` onde precisou). São 3 fotos, ~130 KB cada — cabe.
- **`<picture>` é inline**: `height: 100%` na `<img>` mede a `<picture>`, não o
  container — deixa faixa de fundo sob a foto. Dar `display: block` na picture.
- **Medida de linha**: o `ch` do Montserrat é largo; `65ch` dá ~85 caracteres
  reais. Para 65–75 caracteres, mirar ~56ch.

## Acessibilidade (piso, não teto)

Contraste AA verificado em todas (corpo ≥ 4.5:1, display ≥ 3:1), landmarks
semânticos, `h1` único, skip-link (`.skip-link` nos tokens), foco visível,
`prefers-reduced-motion` com alternativa em toda animação, alvos de toque ≥ 44px,
alt text descritivo vindo de `content.a11y`.
