# Build toolkit

Tudo que foi preciso pra construir o portfólio do Silas
(`../silasAssisMachado.github.io`) com acabamento de produção. Reaproveite aqui.
Ambiente: WSL (Ubuntu noble), sem `sudo`, sem `pip`. Ferramentas disponíveis:
`node`, `npm`, `gs` (ghostscript), e um Chrome headless em cache do puppeteer.

---

## 1. Validar visual com screenshots (Chrome headless)

Não dá pra "ver" o resultado sem renderizar. Use o chrome-headless-shell do
cache do puppeteer. Ele precisa do `libasound.so.2`, que não vem instalado —
extraia sem sudo uma vez:

```bash
SC=/tmp/scratch        # qualquer pasta de trabalho
cd "$SC"
apt-get download libasound2t64                 # baixa .deb sem root
dpkg-deb -x libasound2t64_*.deb libs/          # extrai
# binário:
SB="$HOME/.cache/puppeteer/chrome-headless-shell/linux-*/chrome-headless-shell-linux64/chrome-headless-shell"
export LD_LIBRARY_PATH="$SC:$SC/libs/usr/lib/x86_64-linux-gnu"
```

Screenshot de um arquivo local (mobile e desktop):

```bash
$SB --headless --no-sandbox --disable-gpu --hide-scrollbars \
  --window-size=390,844 --virtual-time-budget=5000 \
  --screenshot=shot-mobile.png "file://$PWD/index.html"

$SB --headless --no-sandbox --disable-gpu --hide-scrollbars \
  --window-size=1440,900 --virtual-time-budget=5000 \
  --screenshot=shot-desktop.png "file://$PWD/index.html#about"
```

- `--virtual-time-budget=5000` deixa animações de entrada terminarem antes do print.
- Depois abra os PNGs com a ferramenta de leitura de imagem pra inspecionar.
- Testar **cada breakpoint** (390 mobile, 768 tablet, 1440 desktop) e cada aba/estado.

Também dá pra imprimir HTML → PDF (ex.: gerar um CV):
```bash
$SB --headless --no-sandbox --disable-gpu \
  --print-to-pdf=out.pdf --no-pdf-header-footer \
  --virtual-time-budget=6000 "file://$PWD/cv.html"
```

---

## 2. Fontes self-hosted em base64 (sem CDN)

O CSP de artifacts (e a robustez geral) pedem fontes embutidas, não `<link>` pro
Google Fonts. Baixe os `.woff2` e embuta como data URI num `fonts.css`:

```bash
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
# pega o CSS do Google já com URLs woff2 (UA moderno):
curl -s -A "$UA" "https://fonts.googleapis.com/css2?family=NomeDaFonte:wght@400..700&display=swap" -o f.css
```

Depois, em Node: para cada `url(https://...woff2)` no CSS, baixe o arquivo,
`base64`, e troque por `url(data:font/woff2;base64,...)`. Mantenha só os subsets
`latin` e `latin-ext` (acentos PT). Resultado: um `assets/fonts.css` que funciona
no GitHub Pages **e** em artifacts, sem dependência externa. (O script completo
que usei está no histórico do repo do Silas; ~200KB pra 2 famílias.)

Escolha de fonte: seguir o procedimento do `/impeccable` (evitar a lista de
fontes-reflexo). Pra Aline, uma serifada de caráter + uma sans limpa, ou uma
família só com contraste de peso.

---

## 3. PDF: renderizar, recortar, extrair foto (ghostscript)

Renderizar páginas de PDF pra PNG (ler conteúdo, extrair paleta):
```bash
gs -q -sDEVICE=png16m -r90 -o page-%d.png entrada.pdf
```

Recortar uma região (ex.: uma foto dentro do PDF) — `FIXEDMEDIA` + `PageOffset`
sobrevive ao setpagedevice do PDF (offsets em pontos, origem inferior-esquerda):
```bash
gs -q -sDEVICE=jpeg -dJPEGQ=80 -r300 -g<Wpx>x<Hpx> -dFIXEDMEDIA -o crop.jpg \
  -c "<</PageOffset [-<x> <y>]>> setpagedevice" -f entrada.pdf
```
Itere o offset olhando o resultado até enquadrar.

---

## 4. Recorte/rotação de foto via canvas (Chrome headless)

Fotos de celular vêm com **orientação EXIF** — o `<img>`/canvas do Chrome já
aplica a rotação (não rotacione de novo à mão). Pra recortar com precisão e
exportar JPEG na qualidade que quiser: carregue a imagem como data URI numa
página, desenhe a região no `<canvas>` com `drawImage(img, sx,sy,sw,sh, 0,0,W,H)`,
gere `canvas.toDataURL('image/jpeg', 0.85)`, coloque num `<div id="out">` e leia
com `--dump-dom`, então `base64 -d` pro arquivo final. (Exemplo completo no
histórico do repo do Silas.) Enquadre rosto no terço superior pra hero.

---

## 5. Padrão foto-first (opcional — é a "cara" do site do Silas)

Foto full-bleed carrega a identidade; conteúdo em abas.
- **Mobile**: foto 100dvh → snap suave pro conteúdo, que abre em abas sticky.
- **Desktop**: split — foto fixa à esquerda (~40%), conteúdo rola à direita.
- Identidade (nome/role/links) sobre a foto, num gradiente escuro embaixo.

Referência viva: o site do Silas herdou isso do perfil público do StreetSlopes.
**Pra Aline, provavelmente uma direção diferente** (mais calor, respiro, foto
dela acolhedora) — use como uma das propostas, não como obrigação.

---

## 6. Armadilhas aprendidas (não repita)

- **Bug do fade / reveal preso**: NÃO condicione a visibilidade do conteúdo a
  uma animação (`animation: ... both` que segura `opacity:0`). O Chrome pausa
  animações em reload/aba oculta e o conteúdo trava semitransparente. Regra:
  conteúdo **sempre visível por padrão**; animação de entrada é uma **classe
  transitória** aplicada só na troca e removida ao fim (com timeout de
  segurança). Toda animação precisa de alternativa em
  `@media (prefers-reduced-motion: reduce)`.
- **Scroll no desktop**: deixe **só o conteúdo rolar** (não o container todo) e
  use `scrollbar-gutter: stable` pra a barra não empurrar o layout ao trocar de
  aba.
- **Contraste**: nada de cinza-claro "elegante" no corpo. Corpo ≥ 4.5:1.
- **Cores**: OKLCH. Cuidado com o default creme/bege de IA (ver anti-references).

---

## 7. Publicar no GitHub Pages

Site de usuário (`<user>.github.io`) publica do branch **`main`**, raiz `/`.
Paths **relativos** (`assets/...`) funcionam direto. Basta:
```bash
git add -A && git commit -m "..." && git push origin main
```
Espere ~30–60s a propagação. Verifique:
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://alineferezin.github.io/
```
Domínio próprio depois: adicionar `CNAME` no repo + apontar DNS no GoDaddy.

---

## 8. Design

Rodar o skill **`/impeccable`** e seguir as regras dele (registro brand, paleta
OKLCH com estratégia, tipografia fora da lista-reflexo, mobile-first, bans de
slop). O `PRODUCT.md` já traz o registro e os princípios pra Aline.
