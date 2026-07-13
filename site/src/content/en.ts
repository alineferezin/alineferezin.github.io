import type { Content } from '../i18n'

/**
 * English — já completo, mas ainda não exposto na UI (sem seletor de idioma).
 * Acessível hoje por `?lang=en`. Quando a Aline quiser o site bilíngue, basta
 * ligar o seletor: o conteúdo já existe e o tipo garante paridade com o PT.
 */
export const en: Content = {
  meta: {
    title: 'Aline Ferezin — Clinical psychologist (CBT)',
    description:
      'Psychotherapy for adults, online and in person, with safety and care. Aline Ferezin, clinical psychologist specialised in Cognitive Behavioural Therapy.',
    lang: 'en',
  },

  nav: {
    about: 'About',
    work: 'How I work',
    space: 'Our space',
    session: 'The session',
    faq: 'Questions',
    contact: 'Contact',
  },

  hero: {
    greeting: 'Hello, and welcome!',
    headline: 'You are in the right place.',
    subhead: 'I guide you through the courageous process of changing yourself.',
    tagline: 'Psychotherapy for adults, online and in person, with safety and care.',
    scroll: 'Scroll to know more',
  },

  cta: {
    primary: 'Shall we talk?',
    secondary: 'See how I work',
    whatsappMessage: 'Hello, Aline! I found your website and I would like to know more about therapy.',
    note: 'The button opens a direct conversation on my WhatsApp.',
    instagram: 'See Instagram',
  },

  change: {
    title: 'Why is change so hard?',
    paragraphs: [
      'Sometimes we cannot see the most challenging problems in our own lives — and even once we do see them, acting on them is hard.',
      'It is as if, after so much effort to finally see that something in us needs to change, we run into a single question: “how?” How do you change, when you have been living this way for so long?',
      'Change is complex. And yet we already handle plenty of it every time we wake up to a new day. Facing the constant transformations of who we are takes courage — and it takes action.',
    ],
    question: 'Within what you can do today, what would be the first possible action?',
    stepsIntro: 'Because it is from:',
    steps: [
      'the awareness that change is needed;',
      'the acceptance that we must change, despite the difficulty;',
      'small, concrete, consistent actions;',
    ],
    stepsOutro: 'that we leave inertia behind and begin a journey towards resolution.',
  },

  about: {
    title: 'Lovely to meet you! I am Aline Ferezin',
    shortTitle: 'My name is Aline Ferezin',
    role: 'Clinical psychologist · Cognitive Behavioural Therapy',
    paragraphs: [
      'Clinical psychologist, specialised in Cognitive Behavioural Therapy. I have spent six years working with adults, online and in person.',
      'I work with emotional regulation strategies, dysfunctional behaviours and the building of social and emotional skills. My study focus is the emotional impact of processes of change.',
      'Born in São Paulo, carioca at heart, and living in Vila Nova de Gaia. I share psychological well-being content on Instagram and, in my spare time, walk the boardwalks, enjoy good sushi and binge series with my husband.',
    ],
    facts: [
      { value: '6 years', label: 'of clinical practice' },
      { value: 'CBT', label: 'Cognitive Behavioural Therapy' },
      { value: 'Online and in person', label: 'Brazil and Portugal' },
    ],
  },

  work: {
    title: 'My work as a psychologist',
    intro:
      'I use Cognitive Behavioural Therapy (CBT) in the therapeutic process. Here is what I believe matters for you to know about it, in terms of how it will help you in therapy:',
    points: [
      {
        title: 'Together, from start to finish',
        text: 'We work together throughout the process — you are not a spectator of your own therapy.',
      },
      {
        title: 'Clear, reachable goals',
        text: 'We define together where we want to get to, so you can see the ground you have covered.',
      },
      {
        title: 'Structured sessions',
        text: 'There is time for the week’s updates and for whatever you want to bring, but most of the session is devoted to the goals we set — always with your own feedback on the process.',
      },
      {
        title: 'Psychoeducation',
        text: 'Moments where I explain themes and concepts from Psychology and related fields, to bring us closer to the goals and their resolution.',
      },
    ],
  },

  benefits: {
    title: 'What does therapy do?',
    intro: 'Some of the benefits therapy can bring:',
    items: [
      {
        title: 'New ways of coping',
        text: 'More suitable ways of dealing with your emotions, thoughts and behaviours.',
      },
      {
        title: 'Anxiety and discomfort',
        text: 'Learning how to manage the anxiety, stress and other discomforts that show up at moments in our lives.',
      },
      {
        title: 'Self-knowledge and self-esteem',
        text: 'Better problem-solving, greater self-knowledge and self-esteem — and reaching the goals that brought you here.',
      },
    ],
  },

  space: {
    title: 'Our space',
    lead: 'This space is safe and confidential.',
    paragraphs: [
      'Precisely so that we can get to know each other and build one of the most important parts of therapy: the bond.',
      'After all, telling a (so far) unknown person what you may never have told anyone is not easy, is it?',
    ],
    highlight: 'The bond',
  },

  session: {
    title: 'Our place and time',
    lead: 'We agree on a fixed weekday and time that will be entirely yours.',
    format: 'A 50-minute meeting over a Google Meet link — or in person, in Vila Nova de Gaia.',
    structureTitle: 'Inside the session, we follow a structure:',
    structure: [
      { title: 'An open moment', text: 'To talk about your week and any topics you wish.' },
      { title: 'The goal that brought you', text: 'Most of the time, focused on what we came to build.' },
      { title: 'Feedback', text: 'A few minutes at the end, on how therapy is going for you.' },
    ],
    frequencyNote:
      'Our meetings are weekly, so the therapeutic process stays effective. Fortnightly frequency is usually reserved for the closing stage.',
  },

  first: {
    title: 'I’ll be waiting for you!',
    paragraphs: [
      'In this first session, the goal is for us to get to know each other.',
      'Above all I want to listen to you — and to explain in detail how therapy works and what you can expect.',
      'Come with a calm mind, and if you have any questions at all, I am here.',
    ],
  },

  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'How does the first contact work?',
        a: 'Reach out on WhatsApp and it will be a pleasure to meet you and answer your questions. Right there I send you a PDF with all the information on how therapy works, schedules and fees — and then we can book your session.',
      },
      {
        q: 'How do sessions work?',
        a: 'Sessions last approximately 50 minutes, at a minimum frequency of once a week, online via Google Meet or in person.',
      },
      {
        q: 'Does online therapy really work?',
        a: 'Yes. The commitment to confidentiality and privacy remains in both formats, and the techniques are similar — apart from a few adaptations, such as emotion logs, which move from paper to screen sharing. That is why it matters that you are in a comfortable, private environment for the session to go well; if that is not possible, online sessions are not advisable.',
      },
    ],
  },

  quote: {
    text: 'life is like that: it heats and cools, it tightens and then loosens, it quiets down and then unsettles. What it wants from us is courage.',
    emphasis: 'courage',
    source: 'Guimarães Rosa, The Devil to Pay in the Backlands',
  },

  closing: {
    title: 'Shall we talk?',
    text: 'If my work made sense to you, feel free to get in touch. The button takes you straight to my WhatsApp.',
  },

  footer: {
    name: 'Aline Ferezin dos Santos',
    role: 'Psychologist',
    credentials: 'CPP 30603 · CRP 06/162739',
    location: 'Vila Nova de Gaia, Portugal · Online sessions',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
  },

  a11y: {
    portraitAlt: 'Aline Ferezin, smiling with her hand resting on her chin, wearing a black shirt and glasses.',
    smileAlt: 'Aline Ferezin smiling, looking to the side, in a bright room.',
    talkAlt: 'Aline Ferezin speaking into a microphone during a talk, wearing a caramel blazer.',
    skipToContent: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
}
