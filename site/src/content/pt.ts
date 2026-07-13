/**
 * Conteúdo em português — língua principal.
 *
 * O TIPO `Content` (em ../i18n.ts) é derivado deste arquivo. Traduzir = copiar
 * esta estrutura em `en.ts`; o TypeScript acusa qualquer chave faltando.
 * As 5 versões consomem SÓ este objeto — nenhuma copy fica solta no JSX.
 */
export const pt = {
  meta: {
    title: 'Aline Ferezin — Psicóloga clínica (TCC)',
    description:
      'Psicoterapia para adultos, online e presencial, com segurança e cuidado. Aline Ferezin, psicóloga clínica especialista em Terapia Cognitivo-Comportamental.',
    lang: 'pt-BR',
  },

  nav: {
    about: 'Sobre',
    work: 'Como trabalho',
    space: 'Nosso espaço',
    session: 'A sessão',
    faq: 'Dúvidas',
    contact: 'Contato',
  },

  hero: {
    greeting: 'Olá, boas vindas!',
    headline: 'Você está no lugar certo.',
    subhead: 'Te guio no processo, corajoso, de mudar a si mesma.',
    tagline: 'Psicoterapia para adultos, online e presencial, com segurança e cuidado.',
    scroll: 'Role para conhecer',
  },

  cta: {
    primary: 'Vamos conversar?',
    secondary: 'Conheça meu trabalho',
    /** Mensagem pré-preenchida no WhatsApp. */
    whatsappMessage: 'Olá, Aline! Vim pelo seu site e gostaria de saber mais sobre a terapia.',
    note: 'O botão abre uma conversa direta no meu WhatsApp.',
    instagram: 'Ver o Instagram',
  },

  change: {
    title: 'Por que é difícil mudar?',
    paragraphs: [
      'Por vezes não conseguimos enxergar os problemas mais desafiadores da nossa vida — e mesmo depois dessa consciência, é difícil agir sobre eles.',
      'É como se, depois de muito esforço, para finalmente enxergar que precisamos mudar algo em nós, nos deparássemos com: “como?”. Como mudar, se estamos vivendo desse ou daquele modo há tanto tempo?',
      'É complexo mudar. Mas, afinal, já lidamos com diversas mudanças ao acordarmos para viver um novo dia. Exige coragem encarar as transformações constantes de quem somos — e também exige ação.',
    ],
    question: 'Dentro do que você pode fazer hoje, qual seria a primeira ação possível?',
    stepsIntro: 'Porque é a partir da:',
    steps: [
      'consciência da necessidade de mudança;',
      'aceitação de que é preciso mudar, apesar das dificuldades;',
      'ações pequenas, concretas e constantes;',
    ],
    stepsOutro: 'que saímos da inércia e iniciamos uma jornada para a resolução.',
  },

  about: {
    title: 'Muito prazer! Sou Aline Ferezin',
    shortTitle: 'Me chamo Aline Ferezin',
    role: 'Psicóloga clínica · Terapia Cognitivo-Comportamental',
    paragraphs: [
      'Psicóloga clínica, especialista em Terapia Cognitivo-Comportamental. Atuo há seis anos no atendimento online e presencial de adultos.',
      'Tenho experiência com estratégias de regulação emocional, comportamentos disfuncionais e construção de habilidades socioemocionais. O meu foco de estudo são os impactos emocionais em processos de mudança.',
      'Sou paulista de nascimento, carioca de coração e residente de Vila Nova de Gaia. Dedico-me a partilhar conhecimentos sobre bem-estar psicológico no Instagram e, nas horas vagas, passear em um passadiço, saborear um delicioso sushi e maratonar séries com o meu esposo.',
    ],
    facts: [
      { value: '6 anos', label: 'de prática clínica' },
      { value: 'TCC', label: 'Terapia Cognitivo-Comportamental' },
      { value: 'Online e presencial', label: 'Brasil e Portugal' },
    ],
  },

  work: {
    title: 'Meu trabalho como psicóloga',
    intro:
      'Eu utilizo no processo terapêutico a Terapia Cognitivo-Comportamental (TCC). O que acredito que seja importante você saber sobre essa abordagem, no sentido de como ela irá te ajudar na terapia:',
    points: [
      {
        title: 'Em conjunto, do começo ao fim',
        text: 'Trabalhamos juntos em todo o processo — você não é espectador da própria terapia.',
      },
      {
        title: 'Objetivos claros e alcançáveis',
        text: 'Definimos juntos onde queremos chegar, para que dê para enxergar o caminho andado.',
      },
      {
        title: 'Sessões estruturadas',
        text: 'Há tempo para atualizações da semana e para o que você quiser trazer, mas a maior parte da sessão é dedicada aos objetivos que definimos — contando sempre com os seus comentários sobre o processo.',
      },
      {
        title: 'Psicoeducação',
        text: 'Momentos em que eu explico temas e conteúdos da Psicologia e de áreas afins, para nos aproximarmos dos objetivos e das resoluções.',
      },
    ],
  },

  benefits: {
    title: 'O que a terapia faz?',
    intro: 'Alguns benefícios que podem acontecer na terapia:',
    items: [
      {
        title: 'Novas formas de lidar',
        text: 'Maneiras mais adequadas de lidar com suas emoções, pensamentos e comportamentos.',
      },
      {
        title: 'Ansiedade e desconfortos',
        text: 'Aprendizados de como gerenciar as ansiedades, estresses e outros desconfortos que surgem em momentos das nossas vidas.',
      },
      {
        title: 'Autoconhecimento e autoestima',
        text: 'Melhora na capacidade de resolução de problemas, aumento do autoconhecimento e da autoestima — e alcance dos objetivos que veio buscar.',
      },
    ],
  },

  space: {
    title: 'Nosso espaço',
    lead: 'Esse espaço é seguro e sigiloso.',
    paragraphs: [
      'Justamente para podermos nos conhecer e construir uma das partes mais importantes da terapia: o vínculo.',
      'Afinal, contar a uma pessoa (até então) desconhecida aquilo que talvez você não tenha falado para ninguém não é fácil, pois não?',
    ],
    highlight: 'O vínculo',
  },

  session: {
    title: 'Nosso local e horário',
    lead: 'Combinamos um dia da semana e horário fixo, que será inteiramente seu.',
    format: 'Encontro de 50 minutos, por link do Google Meet — ou presencial, em Vila Nova de Gaia.',
    structureTitle: 'Dentro da sessão, seguimos uma estrutura:',
    structure: [
      { title: 'Um momento livre', text: 'Para falar sobre a sua semana e os temas que quiser.' },
      { title: 'O objetivo que te trouxe', text: 'A maior parte do tempo, focada no que viemos construir.' },
      { title: 'Feedbacks', text: 'Uns minutinhos, no fim, sobre como está sendo a terapia para você.' },
    ],
    frequencyNote:
      'Os nossos encontros são semanais, com o objetivo de dar efetividade ao processo terapêutico. A frequência quinzenal é geralmente reservada para a finalização.',
  },

  first: {
    title: 'Te espero!',
    paragraphs: [
      'Nesta primeira sessão, o objetivo é conhecer-nos.',
      'Quero, acima de tudo, te ouvir — e explicar detalhadamente como funciona a terapia e o que pode esperar.',
      'Venha com tranquilidade e, se tiver qualquer dúvida, estou à disposição.',
    ],
  },

  faq: {
    title: 'Perguntas frequentes',
    items: [
      {
        q: 'Como funciona o primeiro contato?',
        a: 'Entrando em contato pelo WhatsApp terei o prazer de te conhecer e tirar suas dúvidas. Ali mesmo te encaminho um PDF com todas as informações sobre o funcionamento da terapia, horários e valores — e em seguida podemos fazer o agendamento.',
      },
      {
        q: 'Como funciona o atendimento?',
        a: 'A duração do atendimento é de aproximadamente 50 minutos, com a frequência mínima de uma vez por semana, no formato online pelo Google Meet ou presencial.',
      },
      {
        q: 'Terapia online funciona mesmo?',
        a: 'Sim. O compromisso com o sigilo e a privacidade permanecem em ambos os formatos, e as técnicas empregadas são similares — salvo algumas adaptações, como o registro de emoções, que em vez de papel passa a ser feito no compartilhamento de tela. Por isso é importante que você esteja em um ambiente confortável e privativo para o bom andamento da sessão; se isso não for possível, as sessões online não são indicadas.',
      },
    ],
  },

  quote: {
    text: 'a vida é assim: esquenta e esfria, aperta e daí afrouxa, sossega e depois desinquieta. O que ela quer da gente é coragem.',
    emphasis: 'coragem',
    source: 'Guimarães Rosa, Grande Sertão: Veredas',
  },

  closing: {
    title: 'Vamos conversar?',
    text: 'Se o meu trabalho fez sentido para você, sinta-se à vontade para entrar em contato. O botão te leva direto ao meu WhatsApp.',
  },

  footer: {
    name: 'Aline Ferezin dos Santos',
    role: 'Psicóloga',
    credentials: 'CPP 30603 · CRP 06/162739',
    location: 'Vila Nova de Gaia, Portugal · Atendimento online',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
  },

  a11y: {
    portraitAlt: 'Aline Ferezin, sorrindo com a mão apoiada no queixo, de camisa preta e óculos.',
    smileAlt: 'Aline Ferezin sorrindo, olhando para o lado, em um ambiente claro.',
    talkAlt: 'Aline Ferezin falando ao microfone durante uma palestra, de blazer caramelo.',
    skipToContent: 'Ir para o conteúdo',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
  },
}
