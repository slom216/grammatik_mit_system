import type { ChapterDefinition } from '../../schemas/chapterSchema';

export const chapter050: ChapterDefinition = {
  id: 'chapter-050',
  number: 50,
  slug: 'modal-and-conversational-particles',
  title: 'Modal and Conversational Particles',
  germanTitle: 'Modalpartikeln',
  level: 'B1',
  section: 'words-and-word-formation',
  objective:
    'Recognize and correctly use the modal (conversational) particles doch, mal, ja, denn, eigentlich, and wohl to soften requests, ask genuine spoken questions, mark shared or surprising knowledge, shift topic, and express uncertainty — and tell each particle\'s pragmatic use apart from its literal, stressed meaning (e.g. mal "once" vs. the softening particle mal).',
  prerequisites: [9, 5, 11],
  estimatedMinutes: 30,
  tags: [
    'modal particles',
    'modalpartikeln',
    'doch',
    'mal',
    'ja',
    'denn',
    'eigentlich',
    'wohl',
    'pragmatics',
    'spoken register',
    'dialogue',
  ],
  explanation: {
    introduction: [
      'German conversation is full of small, unstressed words that add almost nothing to the literal content of a sentence but change everything about how it is meant: doch, mal, ja, denn, eigentlich, and wohl. These are called modal particles (Modalpartikeln) or conversational particles, and they are one of the clearest markers of natural, spoken German — leaving them out does not make a sentence wrong, but it makes it sound flat, foreign, or oddly blunt.',
      'Modal particles do not have a one-to-one English translation. English usually conveys the same nuance through intonation, word order, or an added phrase ("after all", "just", "I wonder", "actually") rather than through a single dedicated word. Because of this, you cannot learn what a particle "means" in isolation — you have to learn what job it does in a specific conversational moment: softening a command, turning a statement into a genuine question, signalling that something should already be obvious, or hedging a guess.',
      'A crucial feature of modal particles is that they are normally unstressed and sit in the middle of the sentence (in the "middle field", right after the finite verb or the subject) — never at the very front, and never carrying the main sentence stress. Several of these words are spelled exactly like other, ordinary words (mal = "once", ja = "yes", denn = "because/for", wohl = "well/probably" as a plain adverb), so the same word can be either a heavy, literal word or a light, pragmatic particle depending entirely on context and stress.',
    ],
    rules: [
      {
        id: 'ch50-rule-01',
        heading: 'doch — reminding, contradicting, or insisting',
        paragraphs: [
          'doch as a particle reminds the listener of something both speakers already know, or insists on something despite an apparent objection. In statements it means roughly "as you know" or "after all"; in imperatives it softens a command into a friendly urging, almost like "come on" or "won\'t you".',
          "Du weißt doch, dass ich morgen arbeite. (You know, after all, that I'm working tomorrow — a reminder, not new information.) Komm doch mit! (Come along, why don't you! — a warm invitation, much softer than the bare imperative Komm mit!)",
          'doch is also the standard way to contradict a negative statement or question ("Bist du nicht müde?" — "Doch!"), but that use is a stand-alone answer particle, not the mid-sentence modal particle this chapter focuses on.',
        ],
      },
      {
        id: 'ch50-rule-02',
        heading: 'mal — softening a request (vs. mal "once")',
        paragraphs: [
          'As a particle, mal takes the edge off a request or suggestion, making it sound casual and easy rather than like an order — similar to English "just" in "just take a look". It is extremely common with imperatives and with können-questions used as polite requests.',
          'Zeig mir mal deine Fotos! (Show me your photos, will you — a casual, friendly nudge, not a command.) Kannst du mal das Fenster aufmachen? (Could you open the window for a sec? — a mild, everyday request.)',
          'Do not confuse this with mal as a literal adverb meaning "once" or "one time", as in Ich war nur einmal in Berlin (I was only once in Berlin) or Er hat das schon mal gemacht (He has done that once/before). There, mal carries real informational content about frequency; as a particle, it carries none — removing it barely changes the factual meaning, only the tone.',
        ],
      },
      {
        id: 'ch50-rule-03',
        heading: 'ja — marking something as obvious or as a surprising discovery',
        paragraphs: [
          'ja as a particle points out that a fact is (or should be) obvious to both speakers, or expresses mild surprise at a fact just discovered. It is unstressed and never means "yes" in this role.',
          "Du bist ja schon fertig! (You're already done — oh! I hadn't realized; surprise at a new discovery.) Das ist ja klar. (That's obvious, of course — pointing to shared, uncontested knowledge.)",
          'Because ja also exists as the free-standing answer word for "yes", context is essential: a lone Ja! answering a question is the answer word; a ja buried in the middle of a full sentence, unstressed, is the particle.',
        ],
      },
      {
        id: 'ch50-rule-04',
        heading: 'denn — genuine curiosity in spoken questions',
        paragraphs: [
          'denn appears in real, spoken w-questions and yes/no-questions to signal genuine interest or engagement — it makes a question sound like it grows naturally out of the conversation rather than being an abrupt interrogation. Without denn, a question can sound unexpectedly sharp or official in spoken German.',
          'Wie geht es dir denn? (So, how are you? — warm, conversational interest, picking up on something just said.) Was machst du denn hier? (What on earth are you doing here? — genuine surprise/curiosity, not a formal inquiry.)',
          'denn only occurs in questions; it never appears in statements or imperatives. Do not confuse it with the coordinating conjunction denn meaning "because/for", which links two full clauses (Ich bleibe zu Hause, denn es regnet — I\'m staying home, because it\'s raining) and is stressed and clause-initial rather than a light, mid-sentence particle.',
        ],
      },
      {
        id: 'ch50-rule-05',
        heading: 'eigentlich — shifting or introducing a topic',
        paragraphs: [
          'eigentlich as a particle introduces a new topic, a side thought, or gently changes the subject — roughly "by the way" or "actually, now that I think of it". It often opens a question that is only loosely connected to what was just said.',
          'Eigentlich, wo wohnst du jetzt? (Actually, where do you live now? — a topic shift, moving the conversation somewhere new.) Was machst du eigentlich beruflich? (So what do you actually do for work? — mild curiosity, changing direction.)',
          'As a plain adverb, eigentlich can also mean "actually/strictly speaking" in a more contrastive sense (Eigentlich sollte ich arbeiten, aber ich bin müde — I\'m actually supposed to be working, but I\'m tired), which shades into the particle use; both share the core idea of gently reframing what is true or relevant right now.',
        ],
      },
      {
        id: 'ch50-rule-06',
        heading: 'wohl — hedging a guess or expressing probability',
        paragraphs: [
          'wohl as a particle marks a statement as the speaker\'s best guess rather than a certain fact — similar to English "probably" or "I suppose". It softens a claim so it does not sound overconfident.',
          "Er ist wohl schon zu Hause. (He's probably home by now — a guess, not confirmed knowledge.) Das wird wohl stimmen. (That's probably right — a hedge, not a flat assertion.)",
          'wohl overlaps with the plain adverb wohl meaning "well" (as in Ich fühle mich wohl — I feel well/comfortable), but the particle use — hedging a claim about a fact — is a distinct, very common conversational function and is the one this chapter focuses on.',
        ],
      },
      {
        id: 'ch50-rule-07',
        heading: 'Word order: unstressed, in the middle field',
        paragraphs: [
          'Modal particles are unstressed and sit in the middle field of the sentence — typically right after the finite verb (in statements) or right after the verb and subject (in questions and imperatives). They never stand in the front field (position 1) and never carry heavy sentence stress; the stress falls on the surrounding content words instead.',
          'Komm doch mal vorbei! stacks two particles together (doch mal) — this is completely normal; particles can combine, each adding its own shade of meaning (doch = friendly insistence, mal = casual softening) on top of the same imperative.',
        ],
      },
    ],
    tables: [
      {
        id: 'ch50-table-01',
        title: 'Modal particles: core pragmatic function and example',
        columns: ['Particle', 'Core pragmatic function', 'Example'],
        rows: [
          [
            'doch',
            'Reminds of shared knowledge; softens or insists on a command',
            'Komm doch mit! (Do come along!)',
          ],
          [
            'mal',
            'Softens a request or suggestion, making it casual',
            'Zeig mir mal das Foto. (Show me the photo, will you.)',
          ],
          [
            'ja',
            'Marks a fact as obvious or as a surprising discovery',
            "Du bist ja schon da! (Oh, you're already here!)",
          ],
          [
            'denn',
            'Signals genuine curiosity in a spoken question',
            'Wo warst du denn? (So where were you, then?)',
          ],
          [
            'eigentlich',
            'Introduces a new topic or gently shifts the subject',
            'Was machst du eigentlich beruflich? (So what do you actually do?)',
          ],
          [
            'wohl',
            'Hedges a statement as a guess, not a certain fact',
            "Sie ist wohl im Büro. (She's probably at the office.)",
          ],
        ],
        note: 'All six particles are normally unstressed and sit in the middle field of the sentence; several also exist as ordinary, stressed words with a literal, non-pragmatic meaning (mal "once", ja "yes", denn "because", wohl "well").',
      },
    ],
    examples: [
      {
        german: 'Du weißt doch, dass wir morgen frei haben.',
        english: 'You know, after all, that we have the day off tomorrow.',
        highlight: ['doch'],
        explanation:
          'doch reminds the listener of something both already know; it adds no new information, only tone.',
      },
      {
        german: 'Mach doch das Licht an, es ist so dunkel!',
        english: "Do turn the light on, it's so dark!",
        highlight: ['doch'],
        explanation:
          'doch turns a bare command into a warm, urging suggestion rather than a blunt order.',
      },
      {
        german: 'Kannst du mir mal helfen?',
        english: 'Could you help me for a second?',
        highlight: ['mal'],
        explanation:
          'mal softens the request, making it sound casual and easy rather than demanding.',
      },
      {
        german: 'Ich war schon einmal in dieser Stadt.',
        english: "I've already been to this city once (before).",
        highlight: ['einmal'],
        explanation:
          'Here mal (as einmal) is the literal adverb of frequency, not the softening particle; it carries real information.',
      },
      {
        german: 'Das schmeckt ja hervorragend!',
        english: 'Oh, this tastes excellent!',
        highlight: ['ja'],
        explanation:
          "ja marks the speaker's pleasant surprise at discovering how good the food is.",
      },
      {
        german: 'Du hast ja recht, das hatte ich vergessen.',
        english: "Oh, you're right — I had forgotten that.",
        highlight: ['ja'],
        explanation:
          'ja here signals a small realization: the speaker suddenly recognizes an obvious fact.',
      },
      {
        german: 'Was liest du denn da?',
        english: 'So what are you reading there?',
        highlight: ['denn'],
        explanation:
          'denn makes the question sound like genuine, friendly curiosity rather than an interrogation.',
      },
      {
        german: 'Ich bleibe zu Hause, denn es regnet in Strömen.',
        english: "I'm staying home, because it's pouring rain.",
        highlight: ['denn'],
        explanation:
          'Here denn is the coordinating conjunction meaning "because", linking two full clauses — a different word from the question particle.',
      },
      {
        german: 'Was studierst du eigentlich?',
        english: 'So, what do you actually study?',
        highlight: ['eigentlich'],
        explanation:
          'eigentlich introduces a new thread of conversation, shifting gently to a fresh topic.',
      },
      {
        german: 'Er ist wohl noch im Stau.',
        english: "He's probably still stuck in traffic.",
        highlight: ['wohl'],
        explanation:
          "wohl hedges the claim as the speaker's best guess, not a confirmed fact.",
      },
      {
        german: 'Komm doch mal vorbei, wenn du Zeit hast!',
        english: 'Do drop by sometime, if you have time!',
        highlight: ['doch mal'],
        explanation:
          'Two particles stack here: doch adds friendly insistence, mal softens it further into a casual suggestion.',
      },
      {
        german: 'Das ist ja unglaublich!',
        english: "That's just unbelievable!",
        highlight: ['ja'],
        explanation:
          "ja underscores the speaker's emotional reaction (surprise, disbelief) to an obvious fact just observed.",
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Doch komm mit!',
        correct: 'Komm doch mit!',
        explanation:
          'A modal particle never stands in the front field (position 1) of the sentence; doch belongs in the middle field, right after the verb.',
      },
      {
        incorrect:
          'Ich war MAL in Berlin. (spoken with heavy stress on mal, meaning "just once, casually")',
        correct:
          'Ich war einmal in Berlin. / Ich war mal in Berlin. (unstressed, as a light aside)',
        explanation:
          'As a particle, mal is unstressed; putting heavy stress on it turns it back into the literal adverb "once", which changes what the sentence claims.',
      },
      {
        incorrect: 'Wo warst du? (flat, out of the blue, with no conversational lead-in)',
        correct: 'Wo warst du denn?',
        explanation:
          'Without denn, a spoken question can sound unexpectedly sharp or official; denn signals that the question grows naturally out of the conversation.',
      },
      {
        incorrect:
          'Er ist wohl schon zu Hause. (used to state a fact the speaker knows for certain)',
        correct:
          'Er ist schon zu Hause. (if certain) / Er ist wohl schon zu Hause. (if guessing)',
        explanation:
          'wohl marks a statement as a guess; using it when you are certain misleads the listener about your confidence.',
      },
      {
        incorrect: 'Er kommt, denn er will das Spiel sehen. (used to ask a question)',
        correct: 'Warum kommt er denn?',
        explanation:
          'denn as a conjunction ("because") links two clauses in a statement; denn as a particle only ever appears inside a question.',
      },
    ],
    remember: [
      'Modal particles (doch, mal, ja, denn, eigentlich, wohl) are unstressed, sit in the middle field, and change how a sentence is meant, not what it literally states — there is no single English equivalent for any of them.',
      'doch reminds/insists, mal softens a request, ja marks something as obvious or surprising, denn signals genuine curiosity in a question, eigentlich shifts topic, and wohl hedges a guess.',
      'Several particles double as ordinary, stressed words with a literal meaning: mal ("once"), ja ("yes"), denn ("because"), wohl ("well") — context and stress tell them apart from the light, pragmatic particle.',
      'Particles are most at home in spoken register; adding one to a command or question is often exactly what makes a written sentence sound naturally spoken rather than stiff.',
    ],
  },
  mastery: {
    passingPercent: 80,
    minimumAnswered: 88,
    requiredCorrectTextInputs: 16,
    maxOpenReviewFlags: 3,
  },
  exercises: [
    {
      id: 'ch50-ex-01',
      chapterNumber: 50,
      order: 1,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['doch', 'reminding'],
      instruction: 'Choose the particle that fits the pragmatic function described.',
      prompt:
        'Which particle reminds the listener of something both speakers already know? "Du weißt ___, dass ich morgen arbeite."',
      options: [
        { id: 'a', text: 'doch' },
        { id: 'b', text: 'denn' },
        { id: 'c', text: 'wohl' },
        { id: 'd', text: 'eigentlich' },
      ],
      correctOptionId: 'a',
      explanation:
        'doch signals "as you already know" — it points back to shared knowledge rather than presenting new information.',
    },
    {
      id: 'ch50-ex-02',
      chapterNumber: 50,
      order: 2,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['mal', 'softening'],
      instruction: 'Choose the particle that fits the pragmatic function described.',
      prompt:
        'Which particle makes a request sound casual and easy rather than like an order? "Zeig mir ___ deine Fotos!"',
      options: [
        { id: 'a', text: 'mal' },
        { id: 'b', text: 'ja' },
        { id: 'c', text: 'denn' },
        { id: 'd', text: 'wohl' },
      ],
      correctOptionId: 'a',
      explanation:
        'mal softens the imperative into a friendly, casual nudge instead of a blunt command.',
    },
    {
      id: 'ch50-ex-03',
      chapterNumber: 50,
      order: 3,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['ja', 'obviousness'],
      instruction: 'Choose the particle that fits the pragmatic function described.',
      prompt:
        'Which particle marks something as obvious or as a surprising discovery? "Du bist ___ schon fertig!"',
      options: [
        { id: 'a', text: 'ja' },
        { id: 'b', text: 'mal' },
        { id: 'c', text: 'eigentlich' },
        { id: 'd', text: 'denn' },
      ],
      correctOptionId: 'a',
      explanation:
        'ja here expresses the speaker\'s surprise at a fact just noticed, not the answer word "yes".',
    },
    {
      id: 'ch50-ex-04',
      chapterNumber: 50,
      order: 4,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['denn', 'genuine-question'],
      instruction: 'Choose the particle that fits the pragmatic function described.',
      prompt:
        'Which particle makes a spoken question sound like genuine, friendly curiosity? "Wie geht es dir ___?"',
      options: [
        { id: 'a', text: 'denn' },
        { id: 'b', text: 'doch' },
        { id: 'c', text: 'wohl' },
        { id: 'd', text: 'ja' },
      ],
      correctOptionId: 'a',
      explanation:
        'denn appears in spoken questions to signal warm, engaged interest rather than a flat inquiry.',
    },
    {
      id: 'ch50-ex-05',
      chapterNumber: 50,
      order: 5,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['eigentlich', 'topic-shift'],
      instruction: 'Choose the particle that fits the pragmatic function described.',
      prompt:
        'Which particle gently introduces a new topic or shifts the subject? "Was machst du ___ beruflich?"',
      options: [
        { id: 'a', text: 'eigentlich' },
        { id: 'b', text: 'mal' },
        { id: 'c', text: 'doch' },
        { id: 'd', text: 'ja' },
      ],
      correctOptionId: 'a',
      explanation:
        'eigentlich signals a topic shift, roughly "by the way" — moving the conversation in a new direction.',
    },
    {
      id: 'ch50-ex-06',
      chapterNumber: 50,
      order: 6,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['wohl', 'hedging'],
      instruction: 'Choose the particle that fits the pragmatic function described.',
      prompt:
        'Which particle marks a statement as the speaker\'s best guess, not a certain fact? "Er ist ___ schon zu Hause."',
      options: [
        { id: 'a', text: 'wohl' },
        { id: 'b', text: 'ja' },
        { id: 'c', text: 'denn' },
        { id: 'd', text: 'doch' },
      ],
      correctOptionId: 'a',
      explanation: 'wohl hedges the claim, marking it as probable rather than confirmed.',
    },
    {
      id: 'ch50-ex-07',
      chapterNumber: 50,
      order: 7,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['denn', 'dialogue', 'genuine-question'],
      instruction:
        'Read the exchange, then choose the particle that best completes the final line.',
      prompt: 'Complete: "Wo warst du ___?"',
      dialogue: [
        {
          speaker: 'Lena',
          german: 'Du siehst ja ganz außer Atem aus!',
          english: 'You look completely out of breath!',
        },
        {
          speaker: 'Tom',
          german: 'Ich bin gerade vom Bahnhof gelaufen.',
          english: 'I just ran from the train station.',
        },
        {
          speaker: 'Lena',
          german: 'Wo warst du ___?',
          english: 'So where were you, then?',
        },
      ],
      options: [
        { id: 'a', text: 'denn' },
        { id: 'b', text: 'wohl' },
        { id: 'c', text: 'eigentlich' },
        { id: 'd', text: 'ja' },
      ],
      correctOptionId: 'a',
      explanation:
        'Lena is genuinely curious after noticing Tom is out of breath — denn is the natural particle for a spoken question growing out of what was just said.',
    },
    {
      id: 'ch50-ex-08',
      chapterNumber: 50,
      order: 8,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['doch', 'dialogue', 'reminding'],
      instruction:
        'Read the exchange, then choose the particle that best completes the final line.',
      prompt: 'Complete: "Du weißt ___, dass er kein Fleisch isst."',
      dialogue: [
        {
          speaker: 'Paul',
          german: 'Ich mache heute Abend ein Steak für alle.',
          english: "I'm making steak for everyone tonight.",
        },
        {
          speaker: 'Mira',
          german: 'Du weißt ___, dass er kein Fleisch isst.',
          english: "You know, don't you, that he doesn't eat meat.",
        },
      ],
      options: [
        { id: 'a', text: 'doch' },
        { id: 'b', text: 'denn' },
        { id: 'c', text: 'mal' },
        { id: 'd', text: 'wohl' },
      ],
      correctOptionId: 'a',
      explanation:
        'Mira is reminding Paul of a fact he already knows (or should know) — the classic use of doch.',
    },
    {
      id: 'ch50-ex-09',
      chapterNumber: 50,
      order: 9,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['mal', 'dialogue', 'softening'],
      instruction:
        'Read the exchange, then choose the particle that best completes the final line.',
      prompt: 'Complete: "Kannst du mir ___ helfen, den Schrank zu tragen?"',
      dialogue: [
        {
          speaker: 'Jonas',
          german: 'Ich muss den Schrank ins andere Zimmer bringen.',
          english: 'I need to move the wardrobe to the other room.',
        },
        {
          speaker: 'Jonas',
          german: 'Kannst du mir ___ helfen, den Schrank zu tragen?',
          english: 'Could you help me carry the wardrobe for a sec?',
        },
      ],
      options: [
        { id: 'a', text: 'mal' },
        { id: 'b', text: 'ja' },
        { id: 'c', text: 'denn' },
        { id: 'd', text: 'eigentlich' },
      ],
      correctOptionId: 'a',
      explanation:
        'mal turns a potentially demanding request into a casual, easy-going ask.',
    },
    {
      id: 'ch50-ex-10',
      chapterNumber: 50,
      order: 10,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['ja', 'dialogue', 'surprise'],
      instruction:
        'Read the exchange, then choose the particle that best completes the final line.',
      prompt: 'Complete: "Ihr seid ___ schon alle da!"',
      dialogue: [
        {
          speaker: 'Sabine',
          german: 'Ich komme rein, entschuldigt die Verspätung.',
          english: "I'm coming in, sorry for being late.",
        },
        {
          speaker: 'Sabine',
          german: 'Ihr seid ___ schon alle da!',
          english: "Oh, you're all already here!",
        },
      ],
      options: [
        { id: 'a', text: 'ja' },
        { id: 'b', text: 'wohl' },
        { id: 'c', text: 'denn' },
        { id: 'd', text: 'mal' },
      ],
      correctOptionId: 'a',
      explanation:
        "ja marks Sabine's surprise at discovering that everyone has already arrived.",
    },
    {
      id: 'ch50-ex-11',
      chapterNumber: 50,
      order: 11,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['wohl', 'dialogue', 'hedging'],
      instruction:
        'Read the exchange, then choose the particle that best completes the final line.',
      prompt: 'Complete: "Er ist ___ noch im Stau."',
      dialogue: [
        {
          speaker: 'Katrin',
          german: 'Wo bleibt Max denn? Das Meeting beginnt gleich.',
          english: "Where's Max? The meeting is starting soon.",
        },
        {
          speaker: 'Nils',
          german: 'Er ist ___ noch im Stau.',
          english: "He's probably still stuck in traffic.",
        },
      ],
      options: [
        { id: 'a', text: 'wohl' },
        { id: 'b', text: 'ja' },
        { id: 'c', text: 'doch' },
        { id: 'd', text: 'mal' },
      ],
      correctOptionId: 'a',
      explanation:
        'Nils does not actually know where Max is — wohl hedges the statement as a plausible guess.',
    },
    {
      id: 'ch50-ex-12',
      chapterNumber: 50,
      order: 12,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['eigentlich', 'dialogue', 'topic-shift'],
      instruction:
        'Read the exchange, then choose the particle that best completes the final line.',
      prompt: 'Complete: "Was machst du ___ am Wochenende?"',
      dialogue: [
        {
          speaker: 'Ali',
          german: 'Die Prüfung war echt anstrengend.',
          english: 'The exam was really exhausting.',
        },
        {
          speaker: 'Ali',
          german: 'Was machst du ___ am Wochenende?',
          english: 'So, what are you actually doing this weekend?',
        },
      ],
      options: [
        { id: 'a', text: 'eigentlich' },
        { id: 'b', text: 'denn' },
        { id: 'c', text: 'wohl' },
        { id: 'd', text: 'doch' },
      ],
      correctOptionId: 'a',
      explanation:
        'Ali shifts away from talking about the exam to a new, loosely related topic — the classic function of eigentlich.',
    },
    {
      id: 'ch50-ex-13',
      chapterNumber: 50,
      order: 13,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['doch', 'imperative', 'dialogue'],
      instruction:
        'Read the exchange, then choose the particle that best completes the final line.',
      prompt: 'Complete: "Komm ___ mit ins Kino!"',
      dialogue: [
        {
          speaker: 'Anna',
          german: 'Ich glaube, ich bleibe heute lieber zu Hause.',
          english: "I think I'd rather stay home today.",
        },
        {
          speaker: 'Ben',
          german: 'Ach, komm ___ mit ins Kino!',
          english: 'Oh, come on, come to the cinema with us!',
        },
      ],
      options: [
        { id: 'a', text: 'doch' },
        { id: 'b', text: 'denn' },
        { id: 'c', text: 'ja' },
        { id: 'd', text: 'wohl' },
      ],
      correctOptionId: 'a',
      explanation:
        "doch turns the bare imperative into a warm, persuasive invitation despite Anna's reluctance.",
    },
    {
      id: 'ch50-ex-14',
      chapterNumber: 50,
      order: 14,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['mal', 'literal-vs-particle'],
      instruction: 'Fill in the missing word. Capitalisation is not checked.',
      prompt:
        'Ich war schon ein___ in Wien, aber das ist Jahre her. (literal "once", not the softening particle)',
      acceptedAnswers: ['mal'],
      answerMode: 'caseInsensitive',
      placeholder: 'mal',
      maxLength: 10,
      explanation:
        'einmal here is the literal adverb of frequency ("one time"), carrying real informational content, not the unstressed softening particle.',
    },
    {
      id: 'ch50-ex-15',
      chapterNumber: 50,
      order: 15,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['denn', 'conjunction-vs-particle'],
      instruction: 'Fill in the missing word. Capitalisation is not checked.',
      prompt:
        'Ich bleibe zu Hause, ___ es regnet in Strömen. (conjunction "because", linking two clauses)',
      acceptedAnswers: ['denn'],
      answerMode: 'caseInsensitive',
      placeholder: 'denn',
      maxLength: 10,
      explanation:
        'This denn is the coordinating conjunction "because/for", not the question particle — it links two independent clauses.',
    },
    {
      id: 'ch50-ex-16',
      chapterNumber: 50,
      order: 16,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['ja', 'literal-vs-particle'],
      instruction: 'Fill in the missing word. Capitalisation is not checked.',
      prompt: 'Kommst du mit? — ___, gerne! (the plain answer word "yes")',
      acceptedAnswers: ['Ja', 'ja'],
      answerMode: 'caseInsensitive',
      placeholder: 'Ja',
      maxLength: 10,
      explanation:
        'A stand-alone Ja! answering a question is the ordinary answer word, unlike the unstressed particle ja buried inside a full sentence.',
    },
    {
      id: 'ch50-ex-17',
      chapterNumber: 50,
      order: 17,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['wohl', 'literal-vs-particle'],
      instruction: 'Fill in the missing word. Capitalisation is not checked.',
      prompt:
        'Nach der langen Wanderung fühle ich mich richtig ___. (plain adverb: "well, comfortable")',
      acceptedAnswers: ['wohl'],
      answerMode: 'caseInsensitive',
      placeholder: 'wohl',
      maxLength: 10,
      explanation:
        'Here wohl is the ordinary adverb meaning "well/comfortable" (sich wohl fühlen), not the hedging particle.',
    },
    {
      id: 'ch50-ex-18',
      chapterNumber: 50,
      order: 18,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['doch', 'dialogue', 'production'],
      instruction:
        'Read the exchange and fill in the missing particle. Capitalisation is not checked.',
      prompt: 'Complete: "Mach ___ das Fenster zu, mir ist kalt!"',
      dialogue: [
        {
          speaker: 'Opa',
          german: 'Es zieht hier ganz schön.',
          english: "It's quite drafty in here.",
        },
        {
          speaker: 'Opa',
          german: 'Mach ___ das Fenster zu, mir ist kalt!',
          english: "Do close the window, I'm cold!",
        },
      ],
      acceptedAnswers: ['doch'],
      answerMode: 'caseInsensitive',
      placeholder: 'doch',
      maxLength: 10,
      explanation:
        'doch softens the imperative into a friendly urging rather than a curt order.',
    },
    {
      id: 'ch50-ex-19',
      chapterNumber: 50,
      order: 19,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['denn', 'dialogue', 'production'],
      instruction:
        'Read the exchange and fill in the missing particle. Capitalisation is not checked.',
      prompt: 'Complete: "Was liest du ___ da?"',
      dialogue: [
        {
          speaker: 'Frau Berger',
          german: 'Du bist ja schon seit einer Stunde in dieses Buch vertieft.',
          english: "You've been absorbed in that book for an hour already.",
        },
        {
          speaker: 'Frau Berger',
          german: 'Was liest du ___ da?',
          english: 'So what are you reading there?',
        },
      ],
      acceptedAnswers: ['denn'],
      answerMode: 'caseInsensitive',
      placeholder: 'denn',
      maxLength: 10,
      explanation:
        'denn makes the question sound like natural, engaged curiosity growing out of what was just observed.',
    },
    {
      id: 'ch50-ex-20',
      chapterNumber: 50,
      order: 20,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['mal', 'dialogue', 'production'],
      instruction:
        'Read the exchange and fill in the missing particle. Capitalisation is not checked.',
      prompt: 'Complete: "Probier ___ diesen Kuchen!"',
      dialogue: [
        {
          speaker: 'Oma',
          german: 'Ich habe heute Nachmittag gebacken.',
          english: 'I baked this afternoon.',
        },
        {
          speaker: 'Oma',
          german: 'Probier ___ diesen Kuchen!',
          english: 'Just try this cake!',
        },
      ],
      acceptedAnswers: ['mal'],
      answerMode: 'caseInsensitive',
      placeholder: 'mal',
      maxLength: 10,
      explanation:
        'mal softens the invitation into a casual, low-pressure suggestion, similar to English "just try".',
    },
    {
      id: 'ch50-ex-21',
      chapterNumber: 50,
      order: 21,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['ja', 'dialogue', 'production'],
      instruction:
        'Read the exchange and fill in the missing particle. Capitalisation is not checked.',
      prompt: 'Complete: "Das ist ___ eine Überraschung!"',
      dialogue: [
        {
          speaker: 'Timo',
          german: 'Ich habe die Prüfung bestanden!',
          english: 'I passed the exam!',
        },
        {
          speaker: 'Timo',
          german: 'Das ist ___ eine Überraschung!',
          english: "Well, that's a surprise!",
        },
      ],
      acceptedAnswers: ['ja'],
      answerMode: 'caseInsensitive',
      placeholder: 'ja',
      maxLength: 10,
      explanation:
        "ja marks the speaker's spontaneous surprise at the good news just announced.",
    },
    {
      id: 'ch50-ex-22',
      chapterNumber: 50,
      order: 22,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['wohl', 'dialogue', 'production'],
      instruction:
        'Read the exchange and fill in the missing particle. Capitalisation is not checked.',
      prompt: 'Complete: "Sie ist ___ im Büro, ich habe sie heute noch nicht gesehen."',
      dialogue: [
        {
          speaker: 'Herr Klein',
          german: 'Wissen Sie, wo Frau Vogel gerade ist?',
          english: 'Do you know where Ms. Vogel is right now?',
        },
        {
          speaker: 'Kollegin',
          german: 'Sie ist ___ im Büro, ich habe sie heute noch nicht gesehen.',
          english: "She's probably in the office, I haven't seen her today.",
        },
      ],
      acceptedAnswers: ['wohl'],
      answerMode: 'caseInsensitive',
      placeholder: 'wohl',
      maxLength: 10,
      explanation:
        'The colleague is not certain, only guessing — wohl marks the claim as probable rather than confirmed.',
    },
    {
      id: 'ch50-ex-23',
      chapterNumber: 50,
      order: 23,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['eigentlich', 'dialogue', 'production'],
      instruction:
        'Read the exchange and fill in the missing particle. Capitalisation is not checked.',
      prompt: 'Complete: "Wie heißt du ___ mit Nachnamen?"',
      dialogue: [
        {
          speaker: 'Fahrgast',
          german: 'Wir fahren jetzt schon seit zwei Stunden zusammen im Zug.',
          english: "We've been riding together on this train for two hours now.",
        },
        {
          speaker: 'Fahrgast',
          german: 'Wie heißt du ___ mit Nachnamen?',
          english: "So, what's your last name, by the way?",
        },
      ],
      acceptedAnswers: ['eigentlich'],
      answerMode: 'caseInsensitive',
      placeholder: 'eigentlich',
      maxLength: 15,
      explanation:
        'eigentlich introduces a fresh, only loosely related question, shifting the conversation to a new topic.',
    },
    {
      id: 'ch50-ex-24',
      chapterNumber: 50,
      order: 24,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['rewriting', 'directness', 'mal', 'doch'],
      instruction:
        'Rewrite the overly direct request to sound polite and natural in spoken German, using mal and/or doch. Capitalisation and punctuation are checked.',
      prompt:
        'Zu direkt: "Öffne das Fenster!" — Schreibe eine höflichere, natürlichere Version.',
      acceptedAnswers: [
        'Öffne doch mal das Fenster!',
        'Öffne mal das Fenster!',
        'Öffne doch das Fenster!',
        'Öffnest du mal das Fenster?',
        'Kannst du mal das Fenster öffnen?',
      ],
      answerMode: 'normalized',
      placeholder: 'Öffne doch mal das Fenster!',
      maxLength: 60,
      explanation:
        'Adding doch and/or mal turns the blunt command into a casual, friendly request — exactly what native speakers do to soften an imperative.',
    },
    {
      id: 'ch50-ex-25',
      chapterNumber: 50,
      order: 25,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['rewriting', 'directness', 'mal'],
      instruction:
        'Rewrite the overly direct request to sound polite and natural in spoken German, using mal. Capitalisation and punctuation are checked.',
      prompt: 'Zu direkt: "Hilf mir!" — Schreibe eine höflichere, natürlichere Version.',
      acceptedAnswers: [
        'Hilf mir mal!',
        'Kannst du mir mal helfen?',
        'Hilfst du mir mal?',
      ],
      answerMode: 'normalized',
      placeholder: 'Hilf mir mal!',
      maxLength: 60,
      explanation:
        'mal softens the bare imperative Hilf mir! into a casual, easy-going request rather than a demand.',
    },
    {
      id: 'ch50-ex-26',
      chapterNumber: 50,
      order: 26,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['error-correction', 'word-order', 'doch'],
      instruction:
        'Correct the mistake in particle placement. Write the full, corrected sentence. Capitalisation and punctuation are checked.',
      prompt: 'Falsch: Doch komm mit!',
      acceptedAnswers: ['Komm doch mit!'],
      answerMode: 'normalized',
      placeholder: 'Komm doch mit!',
      maxLength: 40,
      explanation:
        'A modal particle never stands in the front field (position 1); doch must sit in the middle field, right after the verb.',
    },
    {
      id: 'ch50-ex-27',
      chapterNumber: 50,
      order: 27,
      type: 'singleChoice',
      level: 'transfer',
      grammarFocus: ['denn', 'dialogue', 'transfer'],
      instruction:
        'Read the exchange and choose the particle that best fits the pragmatic tone of the final line.',
      prompt: 'Complete: "Warum bist du ___ so spät dran?"',
      dialogue: [
        {
          speaker: 'Chef',
          german: 'Guten Morgen — es ist schon halb zehn.',
          english: "Good morning — it's already half past nine.",
        },
        {
          speaker: 'Chef',
          german: 'Warum bist du ___ so spät dran?',
          english: 'So why are you so late, then?',
        },
      ],
      options: [
        { id: 'a', text: 'denn' },
        { id: 'b', text: 'wohl' },
        { id: 'c', text: 'mal' },
        { id: 'd', text: 'eigentlich' },
      ],
      correctOptionId: 'a',
      explanation:
        'denn frames this as a genuinely curious (if pointed) spoken question rather than a flat, official demand.',
    },
    {
      id: 'ch50-ex-28',
      chapterNumber: 50,
      order: 28,
      type: 'singleChoice',
      level: 'transfer',
      grammarFocus: ['ja', 'wohl', 'dialogue', 'transfer'],
      instruction:
        'Read the exchange and choose the particle that best fits the pragmatic tone of the final line.',
      prompt: 'Complete: "Das war ___ keine gute Idee."',
      dialogue: [
        {
          speaker: 'Felix',
          german: 'Der Kuchen ist mir beim Backen komplett zusammengefallen.',
          english: 'The cake completely collapsed while I was baking it.',
        },
        {
          speaker: 'Nora',
          german: 'Das war ___ keine gute Idee, die Ofentür so oft zu öffnen.',
          english:
            "Well, that clearly wasn't a good idea, opening the oven door so often.",
        },
      ],
      options: [
        { id: 'a', text: 'ja' },
        { id: 'b', text: 'denn' },
        { id: 'c', text: 'eigentlich' },
        { id: 'd', text: 'doch' },
      ],
      correctOptionId: 'a',
      explanation:
        'ja marks this as an obvious conclusion given the visible result (the collapsed cake), not a hedge or a question.',
    },
    {
      id: 'ch50-ex-29',
      chapterNumber: 50,
      order: 29,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['doch', 'reminding'],
      instruction: 'Choose the particle that fits the pragmatic function described.',
      prompt:
        'Which particle reminds the listener of something both already know? "Du kennst ___ meine Schwester, oder?"',
      options: [
        { id: 'a', text: 'doch' },
        { id: 'b', text: 'mal' },
        { id: 'c', text: 'wohl' },
        { id: 'd', text: 'denn' },
      ],
      correctOptionId: 'a',
      explanation:
        'doch points back to something the speaker assumes the listener already knows.',
    },
    {
      id: 'ch50-ex-30',
      chapterNumber: 50,
      order: 30,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['mal', 'softening'],
      instruction: 'Choose the particle that fits the pragmatic function described.',
      prompt:
        'Which particle softens a suggestion into a casual, low-pressure nudge? "Ruf mich ___ an, wenn du Zeit hast."',
      options: [
        { id: 'a', text: 'mal' },
        { id: 'b', text: 'ja' },
        { id: 'c', text: 'eigentlich' },
        { id: 'd', text: 'doch' },
      ],
      correctOptionId: 'a',
      explanation:
        'mal keeps the suggestion light and casual rather than making it sound like a demand.',
    },
    {
      id: 'ch50-ex-31',
      chapterNumber: 50,
      order: 31,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['ja', 'obviousness'],
      instruction: 'Choose the particle that fits the pragmatic function described.',
      prompt:
        'Which particle marks the speaker\'s emotional reaction to an obvious fact? "Das Wetter ist ___ furchtbar heute!"',
      options: [
        { id: 'a', text: 'ja' },
        { id: 'b', text: 'wohl' },
        { id: 'c', text: 'mal' },
        { id: 'd', text: 'denn' },
      ],
      correctOptionId: 'a',
      explanation:
        "ja underscores the speaker's reaction to a plainly visible fact — the awful weather.",
    },
    {
      id: 'ch50-ex-32',
      chapterNumber: 50,
      order: 32,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['denn', 'genuine-question'],
      instruction: 'Choose the particle that fits the pragmatic function described.',
      prompt:
        'Which particle makes this spoken question sound naturally conversational? "Wie spät ist es ___?"',
      options: [
        { id: 'a', text: 'denn' },
        { id: 'b', text: 'ja' },
        { id: 'c', text: 'doch' },
        { id: 'd', text: 'eigentlich' },
      ],
      correctOptionId: 'a',
      explanation:
        'denn softens the question, making it sound like a natural, engaged inquiry rather than an interrogation.',
    },
    {
      id: 'ch50-ex-33',
      chapterNumber: 50,
      order: 33,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['eigentlich', 'topic-shift'],
      instruction: 'Choose the particle that fits the pragmatic function described.',
      prompt:
        'Which particle gently shifts to a new, loosely related topic? "Wo arbeitest du ___?"',
      options: [
        { id: 'a', text: 'eigentlich' },
        { id: 'b', text: 'wohl' },
        { id: 'c', text: 'ja' },
        { id: 'd', text: 'mal' },
      ],
      correctOptionId: 'a',
      explanation:
        'eigentlich signals that this question introduces a fresh direction in the conversation.',
    },
    {
      id: 'ch50-ex-34',
      chapterNumber: 50,
      order: 34,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['wohl', 'hedging'],
      instruction: 'Choose the particle that fits the pragmatic function described.',
      prompt:
        'Which particle marks a guess rather than a confirmed fact? "Das Konzert ist ___ schon ausverkauft."',
      options: [
        { id: 'a', text: 'wohl' },
        { id: 'b', text: 'doch' },
        { id: 'c', text: 'denn' },
        { id: 'd', text: 'ja' },
      ],
      correctOptionId: 'a',
      explanation:
        'wohl hedges the claim — the speaker suspects but does not know for certain.',
    },
    {
      id: 'ch50-ex-35',
      chapterNumber: 50,
      order: 35,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['doch', 'dialogue', 'imperative'],
      instruction:
        'Read the exchange, then choose the particle that best completes the final line.',
      prompt: 'Complete: "Ach, komm ___ mit auf die Party!"',
      dialogue: [
        {
          speaker: 'Sara',
          german: 'Ich bin heute so müde, ich glaube ich bleibe lieber zu Hause.',
          english: "I'm so tired today, I think I'd rather stay home.",
        },
        {
          speaker: 'Jan',
          german: 'Ach, komm ___ mit auf die Party!',
          english: 'Oh, come on, come to the party with us!',
        },
      ],
      options: [
        { id: 'a', text: 'doch' },
        { id: 'b', text: 'denn' },
        { id: 'c', text: 'wohl' },
        { id: 'd', text: 'eigentlich' },
      ],
      correctOptionId: 'a',
      explanation:
        "doch turns Jan's invitation into a warm, persuasive urging despite Sara's reluctance.",
    },
    {
      id: 'ch50-ex-36',
      chapterNumber: 50,
      order: 36,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['mal', 'dialogue', 'softening'],
      instruction:
        'Read the exchange, then choose the particle that best completes the final line.',
      prompt: 'Complete: "Kannst du mir ___ diese E-Mail übersetzen?"',
      dialogue: [
        {
          speaker: 'Kollegin',
          german: 'Ich verstehe diesen englischen Satz überhaupt nicht.',
          english: "I don't understand this English sentence at all.",
        },
        {
          speaker: 'Kollegin',
          german: 'Kannst du mir ___ diese E-Mail übersetzen?',
          english: 'Could you translate this email for me for a second?',
        },
      ],
      options: [
        { id: 'a', text: 'mal' },
        { id: 'b', text: 'ja' },
        { id: 'c', text: 'doch' },
        { id: 'd', text: 'wohl' },
      ],
      correctOptionId: 'a',
      explanation:
        'mal makes the favor sound easy and casual rather than like a big imposition.',
    },
    {
      id: 'ch50-ex-37',
      chapterNumber: 50,
      order: 37,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['ja', 'dialogue', 'surprise'],
      instruction:
        'Read the exchange, then choose the particle that best completes the final line.',
      prompt: 'Complete: "Du bist ___ groß geworden!"',
      dialogue: [
        {
          speaker: 'Tante Rosa',
          german: 'Hallo, schön dich zu sehen!',
          english: 'Hello, lovely to see you!',
        },
        {
          speaker: 'Tante Rosa',
          german: 'Du bist ___ groß geworden!',
          english: "Wow, you've gotten so tall!",
        },
      ],
      options: [
        { id: 'a', text: 'ja' },
        { id: 'b', text: 'denn' },
        { id: 'c', text: 'eigentlich' },
        { id: 'd', text: 'mal' },
      ],
      correctOptionId: 'a',
      explanation:
        "ja captures Tante Rosa's pleasant surprise at noticing how much the child has grown.",
    },
    {
      id: 'ch50-ex-38',
      chapterNumber: 50,
      order: 38,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['denn', 'dialogue', 'genuine-question'],
      instruction:
        'Read the exchange, then choose the particle that best completes the final line.',
      prompt: 'Complete: "Wohin fährst du ___ mit so viel Gepäck?"',
      dialogue: [
        {
          speaker: 'Nachbar',
          german: 'Du hast ja drei riesige Koffer dabei!',
          english: "You've got three huge suitcases with you!",
        },
        {
          speaker: 'Nachbar',
          german: 'Wohin fährst du ___ mit so viel Gepäck?',
          english: 'So where are you going with all that luggage?',
        },
      ],
      options: [
        { id: 'a', text: 'denn' },
        { id: 'b', text: 'wohl' },
        { id: 'c', text: 'mal' },
        { id: 'd', text: 'ja' },
      ],
      correctOptionId: 'a',
      explanation:
        "denn signals the neighbor's genuine, friendly curiosity, prompted by noticing the suitcases.",
    },
    {
      id: 'ch50-ex-39',
      chapterNumber: 50,
      order: 39,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['eigentlich', 'dialogue', 'topic-shift'],
      instruction:
        'Read the exchange, then choose the particle that best completes the final line.',
      prompt: 'Complete: "Wie läuft es ___ mit deinem neuen Job?"',
      dialogue: [
        {
          speaker: 'Nina',
          german: 'So ein schöner sonniger Tag heute.',
          english: 'What a nice sunny day today.',
        },
        {
          speaker: 'Nina',
          german: 'Wie läuft es ___ mit deinem neuen Job?',
          english: "So, how's your new job going, by the way?",
        },
      ],
      options: [
        { id: 'a', text: 'eigentlich' },
        { id: 'b', text: 'doch' },
        { id: 'c', text: 'ja' },
        { id: 'd', text: 'denn' },
      ],
      correctOptionId: 'a',
      explanation:
        'eigentlich moves the conversation from small talk about the weather to a new topic.',
    },
    {
      id: 'ch50-ex-40',
      chapterNumber: 50,
      order: 40,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['wohl', 'dialogue', 'hedging'],
      instruction:
        'Read the exchange, then choose the particle that best completes the final line.',
      prompt: 'Complete: "Morgen wird es ___ regnen."',
      dialogue: [
        {
          speaker: 'Petra',
          german: 'Sollen wir morgen wandern gehen?',
          english: 'Should we go hiking tomorrow?',
        },
        {
          speaker: 'Felix',
          german: 'Morgen wird es ___ regnen, laut der Vorhersage.',
          english: "It'll probably rain tomorrow, according to the forecast.",
        },
      ],
      options: [
        { id: 'a', text: 'wohl' },
        { id: 'b', text: 'ja' },
        { id: 'c', text: 'doch' },
        { id: 'd', text: 'eigentlich' },
      ],
      correctOptionId: 'a',
      explanation: 'wohl marks this as a forecast-based guess, not a certain fact.',
    },
    {
      id: 'ch50-ex-41',
      chapterNumber: 50,
      order: 41,
      type: 'singleChoice',
      level: 'transfer',
      grammarFocus: ['doch', 'dialogue', 'insisting'],
      instruction:
        'Read the exchange, then choose the particle that best fits the pragmatic tone of the final line.',
      prompt: 'Complete: "Probier ___ noch ein Stück, es schadet doch nicht!"',
      dialogue: [
        {
          speaker: 'Gast',
          german: 'Nein danke, ich bin schon satt.',
          english: "No thanks, I'm already full.",
        },
        {
          speaker: 'Gastgeberin',
          german: 'Probier ___ noch ein Stück, es schadet doch nicht!',
          english: "Come on, try one more piece, it won't hurt!",
        },
      ],
      options: [
        { id: 'a', text: 'doch' },
        { id: 'b', text: 'denn' },
        { id: 'c', text: 'wohl' },
        { id: 'd', text: 'ja' },
      ],
      correctOptionId: 'a',
      explanation:
        "doch presses the friendly insistence further, despite the guest's initial refusal.",
    },
    {
      id: 'ch50-ex-42',
      chapterNumber: 50,
      order: 42,
      type: 'singleChoice',
      level: 'transfer',
      grammarFocus: ['mal', 'ja', 'dialogue', 'transfer'],
      instruction:
        'Read the exchange and choose the particle that best fits the pragmatic tone of the final line, distinguishing a casual request from an expression of surprise.',
      prompt:
        'Complete: "Zeig mir ___ dein neues Auto, das habe ich noch nicht gesehen!"',
      dialogue: [
        {
          speaker: 'Basti',
          german: 'Ich habe mir letzte Woche ein neues Auto gekauft.',
          english: 'I bought a new car last week.',
        },
        {
          speaker: 'Lea',
          german: 'Zeig mir ___ dein neues Auto, das habe ich noch nicht gesehen!',
          english: "Show me your new car sometime, I haven't seen it yet!",
        },
      ],
      options: [
        { id: 'a', text: 'mal' },
        { id: 'b', text: 'ja' },
        { id: 'c', text: 'denn' },
        { id: 'd', text: 'wohl' },
      ],
      correctOptionId: 'a',
      explanation:
        'Lea is making a casual, friendly request, not expressing surprise or asking a curious question — mal fits, not ja.',
    },
    {
      id: 'ch50-ex-43',
      chapterNumber: 50,
      order: 43,
      type: 'singleChoice',
      level: 'transfer',
      grammarFocus: ['denn', 'eigentlich', 'dialogue', 'transfer'],
      instruction:
        'Read the exchange and choose the particle that best fits the pragmatic tone of the final line, distinguishing genuine curiosity from a topic shift.',
      prompt: 'Complete: "Warum weinst du ___?"',
      dialogue: [
        {
          speaker: 'Lehrerin',
          german: 'Sofia, du siehst traurig aus.',
          english: 'Sofia, you look sad.',
        },
        {
          speaker: 'Lehrerin',
          german: 'Warum weinst du ___?',
          english: 'So why are you crying?',
        },
      ],
      options: [
        { id: 'a', text: 'denn' },
        { id: 'b', text: 'eigentlich' },
        { id: 'c', text: 'wohl' },
        { id: 'd', text: 'doch' },
      ],
      correctOptionId: 'a',
      explanation:
        'The teacher reacts directly to what she just noticed — genuine, concerned curiosity calls for denn, not a topic-shifting eigentlich.',
    },
    {
      id: 'ch50-ex-44',
      chapterNumber: 50,
      order: 44,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['mal', 'literal-vs-particle'],
      instruction: 'Fill in the missing word. Capitalisation is not checked.',
      prompt:
        'Ich habe dieses Spiel schon ein___ gesehen, im letzten Jahr. (literal "once", not the softening particle)',
      acceptedAnswers: ['mal'],
      answerMode: 'caseInsensitive',
      placeholder: 'mal',
      maxLength: 10,
      explanation:
        'einmal here states a real fact about frequency ("one time"), not the unstressed softening particle.',
    },
    {
      id: 'ch50-ex-45',
      chapterNumber: 50,
      order: 45,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['ja', 'literal-vs-particle'],
      instruction: 'Fill in the missing word. Capitalisation is not checked.',
      prompt: 'Hast du morgen Zeit? — ___, klar! (the plain answer word "yes")',
      acceptedAnswers: ['Ja', 'ja'],
      answerMode: 'caseInsensitive',
      placeholder: 'Ja',
      maxLength: 10,
      explanation:
        'A stand-alone Ja! answering a question is the ordinary answer word, not the unstressed mid-sentence particle.',
    },
    {
      id: 'ch50-ex-46',
      chapterNumber: 50,
      order: 46,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['denn', 'conjunction-vs-particle'],
      instruction: 'Fill in the missing word. Capitalisation is not checked.',
      prompt:
        'Wir bleiben heute drinnen, ___ es schneit ununterbrochen. (conjunction "because", linking two clauses)',
      acceptedAnswers: ['denn'],
      answerMode: 'caseInsensitive',
      placeholder: 'denn',
      maxLength: 10,
      explanation:
        'This denn is the coordinating conjunction "because/for", not the question particle.',
    },
    {
      id: 'ch50-ex-47',
      chapterNumber: 50,
      order: 47,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['wohl', 'literal-vs-particle'],
      instruction: 'Fill in the missing word. Capitalisation is not checked.',
      prompt:
        'Nach der Massage fühle ich mich richtig ___. (plain adverb: "well, comfortable")',
      acceptedAnswers: ['wohl'],
      answerMode: 'caseInsensitive',
      placeholder: 'wohl',
      maxLength: 10,
      explanation:
        'Here wohl is the ordinary adverb meaning "well/comfortable" (sich wohl fühlen), not the hedging particle.',
    },
    {
      id: 'ch50-ex-48',
      chapterNumber: 50,
      order: 48,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['doch', 'dialogue', 'production'],
      instruction:
        'Read the exchange and fill in the missing particle. Capitalisation is not checked.',
      prompt: 'Complete: "Nimm ___ meinen Regenschirm mit, es regnet!"',
      dialogue: [
        {
          speaker: 'Mama',
          german: 'Du gehst jetzt ohne Schirm raus?',
          english: "You're going out without an umbrella?",
        },
        {
          speaker: 'Mama',
          german: 'Nimm ___ meinen Regenschirm mit, es regnet!',
          english: "Do take my umbrella, it's raining!",
        },
      ],
      acceptedAnswers: ['doch'],
      answerMode: 'caseInsensitive',
      placeholder: 'doch',
      maxLength: 10,
      explanation:
        "doch turns Mama's concern into a warm, insistent suggestion rather than a bare command.",
    },
    {
      id: 'ch50-ex-49',
      chapterNumber: 50,
      order: 49,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['mal', 'dialogue', 'production'],
      instruction:
        'Read the exchange and fill in the missing particle. Capitalisation is not checked.',
      prompt:
        'Complete: "Probier ___ diese Suppe, ich habe ein neues Rezept ausprobiert."',
      dialogue: [
        {
          speaker: 'Opa',
          german: 'Was kochst du denn da?',
          english: 'What are you cooking there?',
        },
        {
          speaker: 'Enkelin',
          german: 'Probier ___ diese Suppe, ich habe ein neues Rezept ausprobiert.',
          english: 'Just try this soup, I tried a new recipe.',
        },
      ],
      acceptedAnswers: ['mal'],
      answerMode: 'caseInsensitive',
      placeholder: 'mal',
      maxLength: 10,
      explanation: 'mal keeps the invitation light and casual, like English "just try".',
    },
    {
      id: 'ch50-ex-50',
      chapterNumber: 50,
      order: 50,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['ja', 'dialogue', 'production'],
      instruction:
        'Read the exchange and fill in the missing particle. Capitalisation is not checked.',
      prompt: 'Complete: "Das ist ___ viel teurer geworden!"',
      dialogue: [
        {
          speaker: 'Tim',
          german: 'Ich habe gerade die neuen Preise im Café gesehen.',
          english: 'I just saw the new prices at the café.',
        },
        {
          speaker: 'Tim',
          german: 'Das ist ___ viel teurer geworden!',
          english: "Wow, that's gotten a lot more expensive!",
        },
      ],
      acceptedAnswers: ['ja'],
      answerMode: 'caseInsensitive',
      placeholder: 'ja',
      maxLength: 10,
      explanation: "ja marks Tim's spontaneous surprise at noticing the price increase.",
    },
    {
      id: 'ch50-ex-51',
      chapterNumber: 50,
      order: 51,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['denn', 'dialogue', 'production'],
      instruction:
        'Read the exchange and fill in the missing particle. Capitalisation is not checked.',
      prompt: 'Complete: "Warum weinst du ___, ist etwas passiert?"',
      dialogue: [
        {
          speaker: 'Freund',
          german: 'Hey, geht es dir gut? Du siehst mitgenommen aus.',
          english: 'Hey, are you okay? You look upset.',
        },
        {
          speaker: 'Freund',
          german: 'Warum weinst du ___, ist etwas passiert?',
          english: 'So why are you crying, did something happen?',
        },
      ],
      acceptedAnswers: ['denn'],
      answerMode: 'caseInsensitive',
      placeholder: 'denn',
      maxLength: 10,
      explanation:
        'denn frames this as warm, concerned curiosity growing directly out of what the friend just noticed.',
    },
    {
      id: 'ch50-ex-52',
      chapterNumber: 50,
      order: 52,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['eigentlich', 'dialogue', 'production'],
      instruction:
        'Read the exchange and fill in the missing particle. Capitalisation is not checked.',
      prompt: 'Complete: "Was machst du ___ in den Sommerferien?"',
      dialogue: [
        {
          speaker: 'Marek',
          german: 'Die letzte Prüfung ist endlich vorbei.',
          english: 'The last exam is finally over.',
        },
        {
          speaker: 'Marek',
          german: 'Was machst du ___ in den Sommerferien?',
          english: 'So, what are you actually doing over summer break?',
        },
      ],
      acceptedAnswers: ['eigentlich'],
      answerMode: 'caseInsensitive',
      placeholder: 'eigentlich',
      maxLength: 15,
      explanation:
        'eigentlich shifts the conversation away from exams toward a new, loosely related topic.',
    },
    {
      id: 'ch50-ex-53',
      chapterNumber: 50,
      order: 53,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['wohl', 'dialogue', 'production'],
      instruction:
        'Read the exchange and fill in the missing particle. Capitalisation is not checked.',
      prompt: 'Complete: "Die Schlüssel liegen ___ noch im Auto."',
      dialogue: [
        {
          speaker: 'Mitbewohner',
          german: 'Ich finde meine Schlüssel nirgendwo.',
          english: "I can't find my keys anywhere.",
        },
        {
          speaker: 'Mitbewohnerin',
          german: 'Die Schlüssel liegen ___ noch im Auto.',
          english: 'Your keys are probably still in the car.',
        },
      ],
      acceptedAnswers: ['wohl'],
      answerMode: 'caseInsensitive',
      placeholder: 'wohl',
      maxLength: 10,
      explanation: 'wohl marks this as a plausible guess rather than a confirmed fact.',
    },
    {
      id: 'ch50-ex-54',
      chapterNumber: 50,
      order: 54,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['rewriting', 'directness', 'denn'],
      instruction:
        'Rewrite the overly blunt question to sound natural and conversational in spoken German, using denn. Capitalisation and punctuation are checked.',
      prompt:
        'Zu direkt: "Warum kommst du zu spät?" — Schreibe eine natürlichere, gesprochene Version.',
      acceptedAnswers: ['Warum kommst du denn zu spät?'],
      answerMode: 'normalized',
      placeholder: 'Warum kommst du denn zu spät?',
      maxLength: 60,
      explanation:
        'Adding denn turns the flat, official-sounding question into genuine, conversational curiosity.',
    },
    {
      id: 'ch50-ex-55',
      chapterNumber: 50,
      order: 55,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['rewriting', 'certainty', 'wohl'],
      instruction:
        'Rewrite the overconfident statement so it sounds like a hedge, using wohl. Capitalisation and punctuation are checked.',
      prompt:
        'Zu sicher klingend: "Sie ist im Büro." — Schreibe eine Version, die klingt, als würdest du nur vermuten.',
      acceptedAnswers: ['Sie ist wohl im Büro.'],
      answerMode: 'normalized',
      placeholder: 'Sie ist wohl im Büro.',
      maxLength: 40,
      explanation:
        "wohl softens the flat assertion into a guess, matching the speaker's actual (uncertain) knowledge.",
    },
    {
      id: 'ch50-ex-56',
      chapterNumber: 50,
      order: 56,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['error-correction', 'word-order', 'mal'],
      instruction:
        'Correct the mistake in particle placement. Write the full, corrected sentence. Capitalisation and punctuation are checked.',
      prompt: 'Falsch: Mal zeig mir deine Fotos!',
      acceptedAnswers: ['Zeig mir mal deine Fotos!'],
      answerMode: 'normalized',
      placeholder: 'Zeig mir mal deine Fotos!',
      maxLength: 40,
      explanation:
        'A modal particle never stands in the front field (position 1); mal must sit in the middle field, after the verb.',
    },
    {
      id: 'ch50-ex-57',
      chapterNumber: 50,
      order: 57,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['error-correction', 'particle-choice', 'ja', 'wohl'],
      instruction:
        'Replace the wrongly chosen particle. This statement should sound like an obvious realization, not a guess. Write the full, corrected sentence. Capitalisation and punctuation are checked.',
      prompt:
        'Falsch (klingt wie eine Vermutung, sollte aber eine offensichtliche Feststellung sein): Du bist wohl schon fertig!',
      acceptedAnswers: ['Du bist ja schon fertig!'],
      answerMode: 'normalized',
      placeholder: 'Du bist ja schon fertig!',
      maxLength: 40,
      explanation:
        'The speaker is reacting to an obvious, just-noticed fact, so ja fits — wohl would wrongly suggest the speaker is only guessing.',
    },
    {
      id: 'ch50-ex-58',
      chapterNumber: 50,
      order: 58,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['rewriting', 'directness', 'doch', 'mal'],
      instruction:
        'Rewrite the overly direct request to sound polite and natural in spoken German, using doch and/or mal. Capitalisation and punctuation are checked.',
      prompt:
        'Zu direkt: "Mach das Licht aus!" — Schreibe eine höflichere, natürlichere Version.',
      acceptedAnswers: [
        'Mach doch mal das Licht aus!',
        'Mach mal das Licht aus!',
        'Mach doch das Licht aus!',
        'Machst du mal das Licht aus?',
        'Kannst du mal das Licht ausmachen?',
      ],
      answerMode: 'normalized',
      placeholder: 'Mach doch mal das Licht aus!',
      maxLength: 60,
      explanation:
        'Adding doch and/or mal softens the blunt command into a casual, friendly request.',
    },
    {
      id: 'ch50-ex-59',
      chapterNumber: 50,
      order: 59,
      type: 'matching',
      level: 'recognition',
      grammarFocus: ['particles', 'core-function', 'matching'],
      instruction: 'Match each particle to its core pragmatic function.',
      prompt:
        'Match the particle on the left to its core pragmatic function on the right.',
      pairs: [
        {
          id: 'p1',
          left: 'doch',
          right: 'Reminds of shared knowledge or softens/insists on a command',
        },
        {
          id: 'p2',
          left: 'mal',
          right: 'Softens a request or suggestion, making it casual',
        },
        {
          id: 'p3',
          left: 'ja',
          right: 'Marks a fact as obvious or as a surprising discovery',
        },
        {
          id: 'p4',
          left: 'denn',
          right: 'Signals genuine curiosity in a spoken question',
        },
        {
          id: 'p5',
          left: 'eigentlich',
          right: 'Introduces a new topic or gently shifts the subject',
        },
        {
          id: 'p6',
          left: 'wohl',
          right: 'Hedges a statement as a guess, not a certain fact',
        },
      ],
      explanation:
        'Each modal particle does one recurring conversational job, independent of its literal dictionary meaning.',
    },
    {
      id: 'ch50-ex-60',
      chapterNumber: 50,
      order: 60,
      type: 'matching',
      level: 'controlled',
      grammarFocus: ['particles', 'examples', 'matching'],
      instruction: 'Match each particle to an example sentence that uses it.',
      prompt:
        'Match the particle on the left to a sentence that uses it as a modal particle.',
      pairs: [
        { id: 'p1', left: 'doch', right: 'Mach doch das Fenster zu!' },
        { id: 'p2', left: 'mal', right: 'Kannst du mir mal helfen?' },
        { id: 'p3', left: 'ja', right: 'Du bist ja schon da!' },
        { id: 'p4', left: 'denn', right: 'Was liest du denn da?' },
        { id: 'p5', left: 'eigentlich', right: 'Was machst du eigentlich beruflich?' },
        { id: 'p6', left: 'wohl', right: 'Er ist wohl noch im Stau.' },
      ],
      explanation:
        'Each sentence shows the particle unstressed, in the middle field, doing its typical pragmatic job.',
    },
    {
      id: 'ch50-ex-61',
      chapterNumber: 50,
      order: 61,
      type: 'matching',
      level: 'controlled',
      grammarFocus: ['particles', 'english-equivalent', 'matching'],
      instruction:
        'Match each particle to the English phrase that best captures its nuance.',
      prompt:
        'Match the particle on the left to the closest English equivalent phrase on the right.',
      pairs: [
        { id: 'p1', left: 'doch', right: '"after all" / "come on"' },
        { id: 'p2', left: 'mal', right: '"just" (casual, low-pressure)' },
        { id: 'p3', left: 'ja', right: '"oh!" (realizing something obvious)' },
        { id: 'p4', left: 'denn', right: '"so...then" (genuinely curious)' },
        { id: 'p5', left: 'eigentlich', right: '"by the way" / "actually"' },
        { id: 'p6', left: 'wohl', right: '"probably" / "I suppose"' },
      ],
      explanation:
        'None of these particles translate one-to-one, but each maps onto a recognizable English conversational nuance.',
    },
    {
      id: 'ch50-ex-62',
      chapterNumber: 50,
      order: 62,
      type: 'matching',
      level: 'controlled',
      grammarFocus: ['particles', 'context', 'matching'],
      instruction:
        'Match each conversational situation to the particle that best fits it.',
      prompt: 'Match the situation on the left to the particle that best fits it.',
      pairs: [
        {
          id: 'p1',
          left: 'Reminding a friend of something both of you already know',
          right: 'doch',
        },
        { id: 'p2', left: 'Asking a coworker for a small, casual favor', right: 'mal' },
        {
          id: 'p3',
          left: 'Reacting with surprise to something just discovered',
          right: 'ja',
        },
        {
          id: 'p4',
          left: 'Asking a spoken question out of genuine, friendly interest',
          right: 'denn',
        },
        {
          id: 'p5',
          left: 'Gently steering small talk toward a new topic',
          right: 'eigentlich',
        },
        { id: 'p6', left: 'Guessing where someone probably is right now', right: 'wohl' },
      ],
      explanation:
        'Matching the situation to the particle is the practical skill this chapter builds — the particle is chosen by pragmatic context, not by dictionary meaning.',
    },
    {
      id: 'ch50-ex-63',
      chapterNumber: 50,
      order: 63,
      type: 'matching',
      level: 'production',
      grammarFocus: ['particles', 'literal-meaning', 'matching'],
      instruction: 'Match each particle to its literal, non-particle meaning.',
      prompt:
        'Match the word on the left to its ordinary, literal meaning (as opposed to its particle use).',
      pairs: [
        { id: 'p1', left: 'mal (literal)', right: '"once, one time" (frequency)' },
        { id: 'p2', left: 'ja (literal)', right: '"yes" (stand-alone answer word)' },
        {
          id: 'p3',
          left: 'denn (literal)',
          right: '"because, for" (coordinating conjunction)',
        },
        {
          id: 'p4',
          left: 'wohl (literal)',
          right: '"well, comfortable" (sich wohl fühlen)',
        },
        {
          id: 'p5',
          left: 'doch (literal)',
          right: '"yes it is!" (contradicting a negative question)',
        },
      ],
      explanation:
        'Several particles double as ordinary, stressed words with a completely different, literal function.',
    },
    {
      id: 'ch50-ex-64',
      chapterNumber: 50,
      order: 64,
      type: 'matching',
      level: 'production',
      grammarFocus: ['particles', 'dialogue', 'matching'],
      instruction:
        "Match each German sentence to the English gloss that captures its particle's nuance.",
      prompt: 'Match the German sentence on the left to its English gloss on the right.',
      pairs: [
        { id: 'p1', left: 'Komm doch mit!', right: "Do come along, why don't you!" },
        {
          id: 'p2',
          left: 'Zeig mir mal deine Fotos!',
          right: 'Show me your photos sometime!',
        },
        {
          id: 'p3',
          left: 'Das schmeckt ja hervorragend!',
          right: 'Oh, this tastes excellent!',
        },
        { id: 'p4', left: 'Wo warst du denn?', right: 'So where were you, then?' },
        {
          id: 'p5',
          left: 'Was studierst du eigentlich?',
          right: 'So, what do you actually study?',
        },
      ],
      explanation:
        'Each gloss captures the tone the particle adds, which a literal word-for-word translation would miss.',
    },
    {
      id: 'ch50-ex-65',
      chapterNumber: 50,
      order: 65,
      type: 'matching',
      level: 'production',
      grammarFocus: ['particles', 'dialogue', 'matching'],
      instruction:
        'Match each dialogue opening line to the particle that would naturally complete a fitting response.',
      prompt:
        'Match the opening line on the left to the particle that best completes a natural response to it.',
      pairs: [
        {
          id: 'p1',
          left: '"Ich bin gerade vom Bahnhof gelaufen." — "Wo warst du ___?"',
          right: 'denn',
        },
        {
          id: 'p2',
          left: '"Ich mache heute ein Steak." — "Du weißt ___, dass er kein Fleisch isst."',
          right: 'doch',
        },
        {
          id: 'p3',
          left: '"Ich komme rein, sorry für die Verspätung." — "Ihr seid ___ schon alle da!"',
          right: 'ja',
        },
        {
          id: 'p4',
          left: '"Wo bleibt Max? Das Meeting beginnt gleich." — "Er ist ___ noch im Stau."',
          right: 'wohl',
        },
        {
          id: 'p5',
          left: '"Die Prüfung war anstrengend." — "Was machst du ___ am Wochenende?"',
          right: 'eigentlich',
        },
      ],
      explanation:
        'The best-fitting particle depends entirely on what was just said in the conversation.',
    },
    {
      id: 'ch50-ex-66',
      chapterNumber: 50,
      order: 66,
      type: 'matching',
      level: 'production',
      grammarFocus: ['particles', 'sentence-type', 'matching'],
      instruction:
        'Match each sentence type to a particle that is naturally at home in it.',
      prompt: 'Match the sentence type on the left to a particle commonly used with it.',
      pairs: [
        { id: 'p1', left: 'Friendly imperative (softened command)', right: 'doch' },
        { id: 'p2', left: 'Casual request phrased as a question', right: 'mal' },
        { id: 'p3', left: 'Spoken w-question with genuine interest', right: 'denn' },
        { id: 'p4', left: 'Statement expressing surprise', right: 'ja' },
        { id: 'p5', left: 'Statement hedging an uncertain guess', right: 'wohl' },
      ],
      explanation:
        'Certain particles cluster with certain sentence types, though several also combine within one sentence (doch mal, ja doch).',
    },
    {
      id: 'ch50-ex-67',
      chapterNumber: 50,
      order: 67,
      type: 'matching',
      level: 'transfer',
      grammarFocus: ['particles', 'literal-vs-particle', 'matching'],
      instruction: 'Match each particle to what it must NOT be confused with.',
      prompt:
        'Match the particle on the left to the ordinary word it is easily confused with.',
      pairs: [
        { id: 'p1', left: 'mal (particle)', right: 'Not the same as einmal, "one time"' },
        {
          id: 'p2',
          left: 'ja (particle)',
          right: 'Not the same as the stand-alone answer word "Ja!"',
        },
        {
          id: 'p3',
          left: 'denn (particle)',
          right: 'Not the same as the conjunction denn, "because"',
        },
        {
          id: 'p4',
          left: 'wohl (particle)',
          right: 'Not the same as the adverb wohl, "well/comfortable"',
        },
      ],
      explanation:
        'Recognizing what a particle is NOT is often the fastest way to catch the difference between its light, pragmatic use and its heavier literal one.',
    },
    {
      id: 'ch50-ex-68',
      chapterNumber: 50,
      order: 68,
      type: 'matching',
      level: 'transfer',
      grammarFocus: ['particles', 'identification', 'matching'],
      instruction: 'Match each full sentence to the particle it contains.',
      prompt: 'Match the sentence on the left to the modal particle it contains.',
      pairs: [
        { id: 'p1', left: 'Er ist wohl schon zu Hause.', right: 'wohl' },
        { id: 'p2', left: 'Komm doch mal vorbei!', right: 'doch (and mal)' },
        { id: 'p3', left: 'Das ist ja unglaublich!', right: 'ja' },
        { id: 'p4', left: 'Was machst du denn hier?', right: 'denn' },
        { id: 'p5', left: 'Wie heißt du eigentlich mit Nachnamen?', right: 'eigentlich' },
      ],
      explanation:
        'Spotting the particle in a full sentence is the same skill as producing one — recognizing its unstressed, mid-sentence position.',
    },
    {
      id: 'ch50-ex-69',
      chapterNumber: 50,
      order: 69,
      type: 'dragToSlots',
      level: 'controlled',
      grammarFocus: ['mal', 'dragToSlots', 'softening'],
      instruction: 'Drag the correct particle into the slot.',
      prompt: 'Complete the casual request.',
      templateParts: ['Kannst du mir ', ' helfen?'],
      slots: [{ id: 's1', correctWord: 'mal' }],
      wordBank: ['mal', 'ja', 'denn', 'wohl'],
      explanation: 'mal softens the request into a casual, easy-going ask.',
    },
    {
      id: 'ch50-ex-70',
      chapterNumber: 50,
      order: 70,
      type: 'dragToSlots',
      level: 'controlled',
      grammarFocus: ['doch', 'dragToSlots', 'reminding'],
      instruction: 'Drag the correct particle into the slot.',
      prompt: 'Complete the reminder.',
      templateParts: ['Du weißt ', ', dass ich das nicht mag.'],
      slots: [{ id: 's1', correctWord: 'doch' }],
      wordBank: ['doch', 'denn', 'eigentlich', 'mal'],
      explanation: 'doch reminds the listener of something both already know.',
    },
    {
      id: 'ch50-ex-71',
      chapterNumber: 50,
      order: 71,
      type: 'dragToSlots',
      level: 'controlled',
      grammarFocus: ['ja', 'dragToSlots', 'surprise'],
      instruction: 'Drag the correct particle into the slot.',
      prompt: 'Complete the reaction of pleasant surprise.',
      templateParts: ['Das schmeckt ', ' hervorragend!'],
      slots: [{ id: 's1', correctWord: 'ja' }],
      wordBank: ['ja', 'wohl', 'doch', 'denn'],
      explanation:
        "ja marks the speaker's surprised delight at how good the food tastes.",
    },
    {
      id: 'ch50-ex-72',
      chapterNumber: 50,
      order: 72,
      type: 'dragToSlots',
      level: 'controlled',
      grammarFocus: ['denn', 'dragToSlots', 'genuine-question'],
      instruction: 'Drag the correct particle into the slot.',
      prompt: 'Complete the genuinely curious question.',
      templateParts: ['Wo warst du ', '?'],
      slots: [{ id: 's1', correctWord: 'denn' }],
      wordBank: ['denn', 'ja', 'mal', 'wohl'],
      explanation: 'denn makes the question sound like natural, engaged curiosity.',
    },
    {
      id: 'ch50-ex-73',
      chapterNumber: 50,
      order: 73,
      type: 'dragToSlots',
      level: 'controlled',
      grammarFocus: ['eigentlich', 'dragToSlots', 'topic-shift'],
      instruction: 'Drag the correct particle into the slot.',
      prompt: 'Complete the topic-shifting question.',
      templateParts: ['Was machst du ', ' beruflich?'],
      slots: [{ id: 's1', correctWord: 'eigentlich' }],
      wordBank: ['eigentlich', 'doch', 'ja', 'mal'],
      explanation: 'eigentlich gently shifts the conversation toward a new topic.',
    },
    {
      id: 'ch50-ex-74',
      chapterNumber: 50,
      order: 74,
      type: 'dragToSlots',
      level: 'controlled',
      grammarFocus: ['wohl', 'dragToSlots', 'hedging'],
      instruction: 'Drag the correct particle into the slot.',
      prompt: 'Complete the hedged guess.',
      templateParts: ['Er ist ', ' schon zu Hause.'],
      slots: [{ id: 's1', correctWord: 'wohl' }],
      wordBank: ['wohl', 'ja', 'denn', 'doch'],
      explanation:
        'wohl marks the claim as a probable guess rather than a confirmed fact.',
    },
    {
      id: 'ch50-ex-75',
      chapterNumber: 50,
      order: 75,
      type: 'dragToSlots',
      level: 'production',
      grammarFocus: ['doch', 'dragToSlots', 'imperative'],
      instruction: 'Drag the correct particle into the slot.',
      prompt: 'Complete the warm invitation.',
      templateParts: ['Komm ', ' mit!'],
      slots: [{ id: 's1', correctWord: 'doch' }],
      wordBank: ['doch', 'mal', 'ja', 'denn'],
      explanation: 'doch turns the bare imperative into a warm, urging invitation.',
    },
    {
      id: 'ch50-ex-76',
      chapterNumber: 50,
      order: 76,
      type: 'dragToSlots',
      level: 'production',
      grammarFocus: ['mal', 'dragToSlots', 'softening'],
      instruction: 'Drag the correct particle into the slot.',
      prompt: 'Complete the casual invitation to show something.',
      templateParts: ['Zeig mir ', ' dein neues Handy!'],
      slots: [{ id: 's1', correctWord: 'mal' }],
      wordBank: ['mal', 'doch', 'wohl', 'ja'],
      explanation: 'mal keeps the request casual and low-pressure.',
    },
    {
      id: 'ch50-ex-77',
      chapterNumber: 50,
      order: 77,
      type: 'dragToSlots',
      level: 'production',
      grammarFocus: ['doch', 'mal', 'dragToSlots', 'stacked-particles'],
      instruction:
        'Drag the correct particles into the slots. Two particles can stack, each adding its own shade of meaning.',
      prompt: 'Complete the friendly, casual invitation, which stacks two particles.',
      templateParts: ['Komm ', ' ', ' vorbei, wenn du Zeit hast!'],
      slots: [
        { id: 's1', correctWord: 'doch' },
        { id: 's2', correctWord: 'mal' },
      ],
      wordBank: ['doch', 'mal', 'ja', 'denn', 'wohl'],
      explanation:
        'doch adds friendly insistence and mal softens it further into a casual suggestion — particles can combine.',
    },
    {
      id: 'ch50-ex-78',
      chapterNumber: 50,
      order: 78,
      type: 'dragToSlots',
      level: 'production',
      grammarFocus: ['ja', 'dragToSlots', 'surprise'],
      instruction: 'Drag the correct particle into the slot.',
      prompt: 'Complete the surprised realization.',
      templateParts: ['Ihr seid ', ' schon alle hier!'],
      slots: [{ id: 's1', correctWord: 'ja' }],
      wordBank: ['ja', 'doch', 'mal', 'denn'],
      explanation:
        "ja marks the speaker's surprise at discovering everyone has already arrived.",
    },
    {
      id: 'ch50-ex-79',
      chapterNumber: 50,
      order: 79,
      type: 'dragToSlots',
      level: 'transfer',
      grammarFocus: ['denn', 'dragToSlots', 'genuine-question'],
      instruction: 'Drag the correct particle into the slot.',
      prompt:
        'Complete the curious question, prompted by noticing what someone is reading.',
      templateParts: ['Was liest du ', ' da?'],
      slots: [{ id: 's1', correctWord: 'denn' }],
      wordBank: ['denn', 'eigentlich', 'wohl', 'ja'],
      explanation:
        'denn signals genuine curiosity, growing directly out of noticing the book.',
    },
    {
      id: 'ch50-ex-80',
      chapterNumber: 50,
      order: 80,
      type: 'dragToSlots',
      level: 'transfer',
      grammarFocus: ['eigentlich', 'dragToSlots', 'topic-shift'],
      instruction: 'Drag the correct particle into the slot.',
      prompt:
        'Complete the topic-shifting question, moving toward a new, only loosely related subject.',
      templateParts: ['Wie heißt du ', ' mit Vornamen?'],
      slots: [{ id: 's1', correctWord: 'eigentlich' }],
      wordBank: ['eigentlich', 'denn', 'doch', 'mal'],
      explanation: 'eigentlich introduces this as a fresh, loosely connected question.',
    },
    {
      id: 'ch50-ex-81',
      chapterNumber: 50,
      order: 81,
      type: 'sentenceOrdering',
      level: 'production',
      grammarFocus: ['mal', 'word-order', 'sentenceOrdering'],
      instruction: 'Put the segments in the correct order to form the sentence.',
      prompt: 'Arrange the segments to form a casual, softened request.',
      segments: [
        { id: 'seg1', text: 'Kannst' },
        { id: 'seg2', text: 'du' },
        { id: 'seg3', text: 'mir' },
        { id: 'seg4', text: 'mal' },
        { id: 'seg5', text: 'helfen?' },
      ],
      explanation:
        'mal sits in the middle field, right after the pronouns and before the infinitive, keeping the request casual.',
    },
    {
      id: 'ch50-ex-82',
      chapterNumber: 50,
      order: 82,
      type: 'sentenceOrdering',
      level: 'production',
      grammarFocus: ['doch', 'word-order', 'sentenceOrdering'],
      instruction: 'Put the segments in the correct order to form the sentence.',
      prompt:
        'Arrange the segments to form a sentence that reminds the listener of shared knowledge.',
      segments: [
        { id: 'seg1', text: 'Du' },
        { id: 'seg2', text: 'weißt' },
        { id: 'seg3', text: 'doch,' },
        { id: 'seg4', text: 'dass' },
        { id: 'seg5', text: 'ich' },
        { id: 'seg6', text: 'morgen' },
        { id: 'seg7', text: 'arbeite.' },
      ],
      explanation:
        'doch follows the finite verb weißt, right in the middle field, before the subordinate clause.',
    },
    {
      id: 'ch50-ex-83',
      chapterNumber: 50,
      order: 83,
      type: 'sentenceOrdering',
      level: 'production',
      grammarFocus: ['eigentlich', 'word-order', 'sentenceOrdering'],
      instruction: 'Put the segments in the correct order to form the sentence.',
      prompt: 'Arrange the segments to form a topic-shifting question.',
      segments: [
        { id: 'seg1', text: 'Was' },
        { id: 'seg2', text: 'machst' },
        { id: 'seg3', text: 'du' },
        { id: 'seg4', text: 'eigentlich' },
        { id: 'seg5', text: 'beruflich?' },
      ],
      explanation:
        'eigentlich sits after the subject, in the unstressed middle field, before the content word beruflich.',
    },
    {
      id: 'ch50-ex-84',
      chapterNumber: 50,
      order: 84,
      type: 'sentenceOrdering',
      level: 'production',
      grammarFocus: ['wohl', 'word-order', 'sentenceOrdering'],
      instruction: 'Put the segments in the correct order to form the sentence.',
      prompt: 'Arrange the segments to form a hedged guess.',
      segments: [
        { id: 'seg1', text: 'Er' },
        { id: 'seg2', text: 'ist' },
        { id: 'seg3', text: 'wohl' },
        { id: 'seg4', text: 'noch' },
        { id: 'seg5', text: 'im' },
        { id: 'seg6', text: 'Stau.' },
      ],
      explanation:
        'wohl follows the finite verb ist, in the middle field, hedging the claim as a guess.',
    },
    {
      id: 'ch50-ex-85',
      chapterNumber: 50,
      order: 85,
      type: 'errorSpotting',
      level: 'transfer',
      grammarFocus: ['wohl', 'ja', 'errorSpotting', 'particle-choice'],
      instruction:
        'Click the token that uses the wrong particle for the intended meaning: an uncertain guess, not a confirmed fact.',
      prompt: 'Er ist ja schon zu Hause, denke ich.',
      tokens: ['Er', 'ist', 'ja', 'schon', 'zu', 'Hause,', 'denke', 'ich.'],
      errorTokenIndex: 2,
      correction: 'wohl',
      explanation:
        '"denke ich" shows the speaker is only guessing, so wohl (a hedge) fits, not ja (which marks an obvious, confirmed fact).',
    },
    {
      id: 'ch50-ex-86',
      chapterNumber: 50,
      order: 86,
      type: 'errorSpotting',
      level: 'transfer',
      grammarFocus: ['denn', 'eigentlich', 'errorSpotting', 'particle-choice'],
      instruction:
        'Click the token that uses the wrong particle for the intended meaning: genuine curiosity about something just noticed, not a topic shift.',
      prompt: 'Was liest du eigentlich da?',
      tokens: ['Was', 'liest', 'du', 'eigentlich', 'da?'],
      errorTokenIndex: 3,
      correction: 'denn',
      explanation:
        'The question grows directly out of noticing what the listener is reading, so denn fits — eigentlich would wrongly suggest an unrelated new topic.',
    },
    {
      id: 'ch50-ex-87',
      chapterNumber: 50,
      order: 87,
      type: 'errorSpotting',
      level: 'transfer',
      grammarFocus: ['doch', 'mal', 'errorSpotting', 'particle-choice'],
      instruction:
        'Click the token that uses the wrong particle for the intended meaning: reminding the listener of shared knowledge, not softening a request.',
      prompt: 'Du weißt mal, dass er kein Fleisch isst.',
      tokens: ['Du', 'weißt', 'mal,', 'dass', 'er', 'kein', 'Fleisch', 'isst.'],
      errorTokenIndex: 2,
      correction: 'doch,',
      explanation:
        "This sentence reminds the listener of something already known, which is doch's job — mal only softens requests, it doesn't fit a reminder like this.",
    },
    {
      id: 'ch50-ex-88',
      chapterNumber: 50,
      order: 88,
      type: 'errorSpotting',
      level: 'transfer',
      grammarFocus: ['mal', 'wohl', 'errorSpotting', 'particle-choice'],
      instruction:
        'Click the token that uses the wrong particle for the intended meaning: a casual request, not a hedged guess.',
      prompt: 'Kannst du mir wohl helfen?',
      tokens: ['Kannst', 'du', 'mir', 'wohl', 'helfen?'],
      errorTokenIndex: 3,
      correction: 'mal',
      explanation:
        'This is a casual request for help, which calls for the softening particle mal — wohl would nonsensically hedge the request as a guess.',
    },
  ],
};
