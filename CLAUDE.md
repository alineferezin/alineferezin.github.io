# Aline Ferezin — portfólio / site (psicologia)

> **Este arquivo é o ponto de partida.** Uma nova sessão do Claude deve ler
> isto primeiro. O objetivo desta sessão inicial **não** foi construir o site,
> e sim deixar a base pronta: contexto, materiais e o toolkit de construção.
> Quem for continuar: **gere propostas antes de construir** (ver abaixo).

## O que é

Site/portfólio profissional de **Aline Ferezin**, psicóloga clínica. Vai
**substituir o site atual** dela. Ela tem domínio próprio (ajuste no GoDaddy
depois — por ora publica em `alineferezin.github.io`). Publicação via **GitHub
Pages** (site de usuário, serve do branch `main`, raiz `/`).

Inspiração de **qualidade e técnica**: o portfólio do marido, Silas
(`../silasAssisMachado.github.io`, no ar em https://silasassismachado.github.io).
O dela deve ser **diferente** — marca própria, psicóloga, não dev. Não copiar o
layout; herdar o nível de acabamento e o toolkit.

## Regras inegociáveis

1. **Mobile-first sempre.** Desenhar do 320px pra cima; desktop bonito e funcional depois.
2. **`/` tem que funcionar no GitHub Pages** pra ela conseguir ver a qualquer momento.
3. **Propostas antes de escolher.** Ela quer ver **2–3 direções visuais
   distintas** antes de commitar numa. Não construir uma só e pronto. Sugestão:
   cada proposta como uma página que dá pra abrir (ex.: `/propostas/1/`,
   `/propostas/2/`…), ou artifacts pra ela comparar. Depois que ela escolher,
   promover a escolhida pra raiz `/`.
4. **Português** é a língua principal (ela é BR, atende em PT). Bilíngue PT/EN é
   opcional — perguntar antes.
5. **Stack em aberto** — a próxima sessão escolhe (React/Vite, Astro, ou
   HTML/CSS/JS puro; o Silas curte algo "meio React"). Sem backend. Só cuidar
   que o **GitHub Pages** serve estático: framework → configurar export estático
   + workflow de deploy (ou publicar o build). Paths relativos.

> **Nota:** esta sessão inicial deixou **só a base (docs)** e um `index.html`
> **placeholder neutro** (sem marca aplicada, de propósito). O design/stack é
> trabalho da próxima sessão — não fui eu que apliquei nada visual.

## Quem é a Aline (extraído dos materiais dela)

- **Psicóloga clínica**, especialista em **Terapia Cognitivo-Comportamental (TCC)**.
- **6 anos** de atuação, atendimento **online e presencial**, de **adultos**.
- Experiência com **regulação emocional**, comportamentos disfuncionais e
  construção de habilidades socioemocionais. Foco de estudo: **impactos
  emocionais em processos de mudança**.
- Paulista de nascimento, carioca de coração, mora em **Vila Nova de Gaia,
  Portugal**. Partilha conteúdo de bem-estar psicológico no **Instagram**.
- Voz da marca: **acolhedora, humana, corajosa, segura**. Frases do site atual:
  *"Você está no lugar certo"*, *"Te guio no processo, corajoso, de mudar a si
  mesma"*, *"Psicoterapia para adultos online, com segurança e cuidado"*.
- CTA principal do site atual: **"Vamos conversar?"**.

## Marca

Identidade oficial (paleta exata + fontes) fornecida pela Aline está em
**`docs/BRAND.md`** — usar como fonte de verdade. Resumo: verde escuro `#67735c`
principal, verdes/marrons/azul de apoio, branco/cinza pra texto; fontes **Alice**
(títulos), **TAN Headline** (títulos 2, paga — pedir à Aline), **Montserrat**
(corpo). A identidade já existe (logo, monograma "a", curvas orgânicas, fotos) —
**preservar**; as propostas variam composição/tratamento, não descartam a marca.
Cuidado com o clichê de IA da categoria wellness (bege + serifada itálica +
folhinhas).

## Materiais da Aline

Ficam em **`materials/`** (git-ignorado — arquivos grandes, ~22 MB, ficam locais):

- `Olá, boas vindas! ...pdf` — apresentação dela (bio, foto de rosto, paleta). **A melhor fonte de bio + retrato frontal.**
- `Cópia de site psi.pdf` — export do site atual (copy, seções, tom, cores).
- `IMG_7129.JPG.jpeg` (1584×2816) — retrato dela apresentando, alta qualidade (perfil).
- `IMG-20260415-WA0023.jpg.jpeg`, `IMG-20260415-WA0027-1.jpg.jpeg` — mais fotos dela.

**Como ler PDFs/fotos** (não há leitor de PDF nativo; use ghostscript):
```bash
gs -q -sDEVICE=png16m -r90 -o page-%d.png materials/"Olá, boas vindas! ...pdf"
```
Depois abra os PNGs com a ferramenta de leitura de imagem. O retrato frontal de
rosto (na capa do "boas vindas") é o melhor candidato pra um hero foto-first;
dá pra extrair/recortar via canvas (ver toolkit).

## Fluxo sugerido pra próxima sessão

1. Rodar **`/impeccable init`** (ou ler `PRODUCT.md`, que já está semi-preenchido)
   e fazer uma entrevista curta com o Silas/Aline pra fechar público, objetivo,
   CTA e provas (depoimentos, CRP, etc.).
2. Ler os materiais em `materials/` (bio, fotos, site atual).
3. **Gerar 2–3 propostas** visuais distintas (`/impeccable shape` / `craft`),
   cada uma abrível no browser + como artifact. Mobile-first.
4. Aline escolhe. Promover a escolhida pra `/`, refinar (`/impeccable polish`).
5. Publicar (commit + push no `main`). Ajustar domínio no GoDaddy depois.

## Toolkit de construção

Tudo que foi preciso pra construir o site do Silas está em
**`docs/BUILD-TOOLKIT.md`**: fontes self-hosted em base64 (sem CDN), screenshots
headless pra validar visual, ghostscript pra PDF, recorte de foto via canvas,
padrão foto-first, i18n, a armadilha da animação de reveal (bug do fade) e como
publicar no Pages. **Ler antes de começar.**
