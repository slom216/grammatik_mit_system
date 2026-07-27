import type { ChapterDefinition } from '../../schemas/chapterSchema';

/**
 * Phase 0 engine demo.
 *
 * This chapter is NOT part of the published 85-chapter course. It exists so the
 * lesson renderer, both exercise types, scoring, mastery, review scheduling and
 * persistence can be exercised end to end before production content is written.
 * It is removed from the catalogue as soon as Phase 1 chapters land.
 *
 * All wording, examples and exercises are original.
 */
export const demoChapter: ChapterDefinition = {
  id: 'chapter-000-demo',
  number: 0,
  slug: 'engine-demo-sein-and-pronouns',
  title: 'Engine Demo: Subject Pronouns and sein',
  germanTitle: 'Demo: Personalpronomen und sein',
  level: 'A1',
  section: 'verbs-1',
  objective:
    'Try the learning engine: read a short explanation, then practise subject pronouns and the present tense of sein in both exercise formats.',
  prerequisites: [],
  estimatedMinutes: 20,
  tags: ['demo', 'pronouns', 'sein', 'present-tense'],
  isDemo: true,
  explanation: {
    introduction: [
      'This demo chapter shows how every lesson in the course is built. The explanation comes first, then examples, typical mistakes, a short summary, and finally a practice session of 24 exercises.',
      'The grammar topic here is small on purpose: German subject pronouns (Personalpronomen) and the present tense of the verb sein ("to be").',
    ],
    rules: [
      {
        id: 'demo-rule-01',
        heading: 'Subject pronouns name who acts',
        paragraphs: [
          'A subject pronoun (Personalpronomen im Nominativ) replaces the person or thing that performs the action: ich, du, er, sie, es, wir, ihr, sie, Sie.',
          'German has three ways to say "you". Use du for one person you know well, ihr for several people you know well, and Sie for formal address to one or more people.',
        ],
        notes: [
          'The formal Sie is always written with a capital S, also in the middle of a sentence.',
        ],
      },
      {
        id: 'demo-rule-02',
        heading: 'Pronouns follow the gender of the noun, not the meaning',
        paragraphs: [
          'A noun is replaced by er, sie or es according to its article: der Tisch becomes er, die Lampe becomes sie, das Fenster becomes es.',
          'Plural nouns are always replaced by sie, whatever their gender in the singular.',
        ],
      },
      {
        id: 'demo-rule-03',
        heading: 'sein is irregular in the present tense',
        paragraphs: [
          'sein does not follow the regular ending pattern. Its forms have to be memorised: bin, bist, ist, sind, seid, sind.',
          'sein is used for identity, origin, profession and states: Ich bin Ärztin. Wir sind aus Wien. Das Kind ist müde.',
        ],
        notes: [
          'Be careful with seid (the verb form for ihr) and seit (the preposition "since"). They sound the same but are written differently.',
        ],
      },
    ],
    tables: [
      {
        id: 'demo-table-01',
        title: 'Subject pronouns',
        columns: ['Person', 'Singular', 'Plural'],
        rows: [
          ['1st', 'ich (I)', 'wir (we)'],
          ['2nd, informal', 'du (you)', 'ihr (you)'],
          ['3rd', 'er / sie / es (he, she, it)', 'sie (they)'],
          ['2nd, formal', 'Sie (you)', 'Sie (you)'],
        ],
        note: 'The formal Sie has the same form in the singular and in the plural.',
      },
      {
        id: 'demo-table-02',
        title: 'Present tense of sein',
        columns: ['Pronoun', 'Form', 'Example'],
        rows: [
          ['ich', 'bin', 'Ich bin zu Hause.'],
          ['du', 'bist', 'Du bist pünktlich.'],
          ['er / sie / es', 'ist', 'Sie ist Lehrerin.'],
          ['wir', 'sind', 'Wir sind im Büro.'],
          ['ihr', 'seid', 'Ihr seid schon fertig.'],
          ['sie / Sie', 'sind', 'Sind Sie Frau Berg?'],
        ],
      },
    ],
    examples: [
      {
        german: 'Ich bin heute zu Hause.',
        english: 'I am at home today.',
        highlight: ['bin'],
        explanation: 'ich takes the form bin.',
      },
      {
        german: 'Du bist sehr freundlich.',
        english: 'You are very friendly.',
        highlight: ['bist'],
        explanation: 'du takes the form bist.',
      },
      {
        german: 'Das Fenster ist offen.',
        english: 'The window is open.',
        highlight: ['ist'],
        explanation: 'A singular noun uses the same verb form as er, sie or es.',
      },
      {
        german: 'Wir sind am Bahnhof.',
        english: 'We are at the station.',
        highlight: ['sind'],
      },
      {
        german: 'Ihr seid pünktlich.',
        english: 'You are on time.',
        highlight: ['seid'],
        explanation: 'ihr addresses several people informally.',
      },
      {
        german: 'Sind Sie Herr Klein?',
        english: 'Are you Mr Klein?',
        highlight: ['Sind', 'Sie'],
        explanation:
          'In a yes/no question the verb comes first; formal Sie keeps its capital letter.',
      },
      {
        german: 'Die Kinder sind im Garten.',
        english: 'The children are in the garden.',
        highlight: ['sind'],
      },
      {
        german: 'Der Bus ist heute spät.',
        english: 'The bus is late today.',
        highlight: ['ist'],
      },
      {
        german: 'Sie ist Ärztin und er ist Krankenpfleger.',
        english: 'She is a doctor and he is a nurse.',
        highlight: ['ist'],
        explanation: 'Professions are used without an article after sein.',
      },
      {
        german: 'Meine Eltern sind nicht zu Hause.',
        english: 'My parents are not at home.',
        highlight: ['sind'],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Ihr sind müde.',
        correct: 'Ihr seid müde.',
        explanation: 'ihr uses seid; sind belongs to wir, sie and formal Sie.',
      },
      {
        incorrect: 'Wo ist ihr?',
        correct: 'Wo seid ihr?',
        explanation:
          'The verb has to agree with the plural pronoun ihr, so ist is not possible here.',
      },
      {
        incorrect: 'Sind sie Frau Berg? (formal address)',
        correct: 'Sind Sie Frau Berg?',
        explanation:
          'Written formal address always uses a capital S. Lowercase sie would mean "they".',
      },
      {
        incorrect: 'Ihr seit hier.',
        correct: 'Ihr seid hier.',
        explanation: 'seid is the verb form; seit is the preposition "since".',
      },
    ],
    remember: [
      'bin – bist – ist – sind – seid – sind: learn the six forms of sein as a block.',
      'du, ihr and Sie are three different ways to say "you"; only Sie is capitalised.',
      'Nouns are replaced by er, sie or es according to their article; all plurals become sie.',
    ],
  },
  mastery: {
    passingPercent: 80,
    minimumAnswered: 24,
    requiredCorrectTextInputs: 8,
    maxOpenReviewFlags: 3,
  },
  exercises: [
    /* 1–4 · recognition */
    {
      id: 'demo-ex-01',
      chapterNumber: 0,
      order: 1,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['subject-pronouns'],
      instruction: 'Choose the subject pronoun used in the sentence.',
      prompt: 'Wir sind heute zu Hause.',
      options: [
        { id: 'a', text: 'wir' },
        { id: 'b', text: 'ihr' },
        { id: 'c', text: 'sie' },
        { id: 'd', text: 'du' },
      ],
      correctOptionId: 'a',
      explanation:
        'The subject of the sentence is wir ("we"). The verb form sind confirms it: wir and sind belong together.',
    },
    {
      id: 'demo-ex-02',
      chapterNumber: 0,
      order: 2,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['sein', 'subject-verb-agreement'],
      instruction: 'Choose the sentence with the correct form of sein.',
      prompt: 'Which sentence is correct?',
      options: [
        { id: 'a', text: 'Du bist müde.' },
        { id: 'b', text: 'Du bin müde.' },
        { id: 'c', text: 'Du ist müde.' },
        { id: 'd', text: 'Du seid müde.' },
      ],
      correctOptionId: 'a',
      explanation:
        'du takes bist. bin belongs to ich, ist to er/sie/es, and seid to ihr.',
    },
    {
      id: 'demo-ex-03',
      chapterNumber: 0,
      order: 3,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['subject-pronouns', 'gender'],
      instruction: 'Choose the pronoun that replaces the underlined noun.',
      prompt: 'Der Lehrer ist neu. → ___ ist neu.',
      hint: 'The article der tells you the gender.',
      options: [
        { id: 'a', text: 'er' },
        { id: 'b', text: 'sie' },
        { id: 'c', text: 'es' },
        { id: 'd', text: 'wir' },
      ],
      correctOptionId: 'a',
      explanation:
        'der Lehrer is masculine, so it is replaced by er. sie would replace a feminine or plural noun, es a neuter one.',
    },
    {
      id: 'demo-ex-04',
      chapterNumber: 0,
      order: 4,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['formal-address'],
      instruction: 'Choose the sentence that addresses one person formally.',
      prompt: 'Which sentence is formal?',
      options: [
        { id: 'a', text: 'Sind Sie Herr Weber?' },
        { id: 'b', text: 'Bist du Herr Weber?' },
        { id: 'c', text: 'Seid ihr Herr Weber?' },
        { id: 'd', text: 'Bin ich Herr Weber?' },
      ],
      correctOptionId: 'a',
      explanation:
        'Formal address uses capitalised Sie with the verb form sind. du and ihr are informal.',
    },

    /* 5–8 · form identification */
    {
      id: 'demo-ex-05',
      chapterNumber: 0,
      order: 5,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['sein', 'spelling'],
      instruction: 'Choose the correct form.',
      prompt: 'Ihr ___ pünktlich.',
      options: [
        { id: 'a', text: 'seid' },
        { id: 'b', text: 'seit' },
        { id: 'c', text: 'sind' },
        { id: 'd', text: 'bist' },
      ],
      correctOptionId: 'a',
      explanation:
        'ihr takes seid. seit is a preposition ("since") and is never a verb form; sind belongs to wir/sie/Sie.',
    },
    {
      id: 'demo-ex-06',
      chapterNumber: 0,
      order: 6,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['sein', 'subject-verb-agreement'],
      instruction: 'Choose the correct form.',
      prompt: 'Das Kind ___ krank.',
      options: [
        { id: 'a', text: 'ist' },
        { id: 'b', text: 'sind' },
        { id: 'c', text: 'bin' },
        { id: 'd', text: 'seid' },
      ],
      correctOptionId: 'a',
      explanation: 'das Kind is a singular noun, so it behaves like es and takes ist.',
    },
    {
      id: 'demo-ex-07',
      chapterNumber: 0,
      order: 7,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['sein', 'questions'],
      instruction: 'Choose the correct verb form to open the question.',
      prompt: '___ ihr aus Polen?',
      options: [
        { id: 'a', text: 'Seid' },
        { id: 'b', text: 'Sind' },
        { id: 'c', text: 'Bist' },
        { id: 'd', text: 'Ist' },
      ],
      correctOptionId: 'a',
      explanation:
        'The subject is ihr, so the verb is seid — also when it stands in first position in a yes/no question.',
    },
    {
      id: 'demo-ex-08',
      chapterNumber: 0,
      order: 8,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['sein'],
      instruction: 'Choose the form that belongs to the pronoun.',
      prompt: 'Which form of sein goes with wir?',
      options: [
        { id: 'a', text: 'sind' },
        { id: 'b', text: 'seid' },
        { id: 'c', text: 'ist' },
        { id: 'd', text: 'bin' },
      ],
      correctOptionId: 'a',
      explanation: 'wir, sie (plural) and formal Sie all take sind.',
    },

    /* 9–12 · controlled multiple choice */
    {
      id: 'demo-ex-09',
      chapterNumber: 0,
      order: 9,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['sein', 'plural'],
      instruction: 'Choose the correct form.',
      prompt: 'Meine Eltern ___ im Urlaub.',
      options: [
        { id: 'a', text: 'sind' },
        { id: 'b', text: 'ist' },
        { id: 'c', text: 'seid' },
        { id: 'd', text: 'bin' },
      ],
      correctOptionId: 'a',
      explanation:
        'Eltern is plural, so the verb is sind. ist would only fit a singular subject.',
    },
    {
      id: 'demo-ex-10',
      chapterNumber: 0,
      order: 10,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['sein', 'informal-address'],
      instruction: 'You are talking to two friends. Choose the correct question.',
      prompt: 'Which question is correct?',
      options: [
        { id: 'a', text: 'Wo seid ihr?' },
        { id: 'b', text: 'Wo sind ihr?' },
        { id: 'c', text: 'Wo bist ihr?' },
        { id: 'd', text: 'Wo ist ihr?' },
      ],
      correctOptionId: 'a',
      explanation:
        'Two friends are addressed with ihr, and ihr takes seid. The other forms belong to other pronouns.',
    },
    {
      id: 'demo-ex-11',
      chapterNumber: 0,
      order: 11,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['sein', 'questions'],
      instruction: 'Choose the correct verb form.',
      prompt: '___ du heute im Büro?',
      options: [
        { id: 'a', text: 'Bist' },
        { id: 'b', text: 'Bin' },
        { id: 'c', text: 'Seid' },
        { id: 'd', text: 'Sind' },
      ],
      correctOptionId: 'a',
      explanation: 'The subject du always takes bist, in statements and in questions.',
    },
    {
      id: 'demo-ex-12',
      chapterNumber: 0,
      order: 12,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['formal-address', 'capitalisation'],
      instruction: 'You are writing to a customer. Choose the correct spelling.',
      prompt: 'Which sentence is written correctly?',
      options: [
        { id: 'a', text: 'Sind Sie Frau Meier?' },
        { id: 'b', text: 'Sind sie Frau Meier?' },
        { id: 'c', text: 'sind Sie Frau Meier?' },
        { id: 'd', text: 'Sind SIE Frau Meier?' },
      ],
      correctOptionId: 'a',
      explanation:
        'Formal Sie is capitalised, the sentence starts with a capital letter, and full capitals are not a German spelling rule.',
    },

    /* 13–16 · short text input */
    {
      id: 'demo-ex-13',
      chapterNumber: 0,
      order: 13,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['sein'],
      instruction:
        'Write the missing form of sein. Only the verb form is checked, so capitalisation does not matter here.',
      prompt: 'Ich ___ heute müde.',
      acceptedAnswers: ['bin'],
      answerMode: 'caseInsensitive',
      placeholder: 'form of sein',
      maxLength: 20,
      explanation: 'ich takes bin.',
    },
    {
      id: 'demo-ex-14',
      chapterNumber: 0,
      order: 14,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['sein'],
      instruction: 'Write the missing form of sein. Capitalisation is not checked.',
      prompt: 'Du ___ sehr freundlich.',
      acceptedAnswers: ['bist'],
      answerMode: 'caseInsensitive',
      placeholder: 'form of sein',
      maxLength: 20,
      explanation: 'du takes bist.',
    },
    {
      id: 'demo-ex-15',
      chapterNumber: 0,
      order: 15,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['sein', 'spelling'],
      instruction: 'Write the missing form of sein. Capitalisation is not checked.',
      prompt: 'Ihr ___ schon fertig.',
      hint: 'The verb form ends in -d, not in -t.',
      acceptedAnswers: ['seid'],
      answerMode: 'caseInsensitive',
      placeholder: 'form of sein',
      maxLength: 20,
      explanation:
        'ihr takes seid. The spelling seit belongs to the preposition "since".',
    },
    {
      id: 'demo-ex-16',
      chapterNumber: 0,
      order: 16,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['sein', 'plural'],
      instruction: 'Write the missing form of sein. Capitalisation is not checked.',
      prompt: 'Die Kinder ___ im Garten.',
      acceptedAnswers: ['sind'],
      answerMode: 'caseInsensitive',
      placeholder: 'form of sein',
      maxLength: 20,
      explanation: 'die Kinder is plural and behaves like sie (plural): sind.',
    },

    /* 17–20 · sentence completion */
    {
      id: 'demo-ex-17',
      chapterNumber: 0,
      order: 17,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['sein', 'word-order'],
      instruction:
        'Write the complete sentence. Capitalisation and the full stop are checked.',
      prompt: 'wir – im Kino – sein',
      acceptedAnswers: ['Wir sind im Kino.'],
      answerMode: 'normalized',
      placeholder: 'Wir ...',
      maxLength: 60,
      explanation:
        'The finite verb stands in second position: Wir sind im Kino. A statement ends with a full stop.',
    },
    {
      id: 'demo-ex-18',
      chapterNumber: 0,
      order: 18,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['questions', 'word-order'],
      instruction:
        'Turn the statement into a yes/no question. Capitalisation and the question mark are checked.',
      prompt: 'Du bist Lehrer.',
      acceptedAnswers: ['Bist du Lehrer?'],
      answerMode: 'normalized',
      placeholder: 'Bist ...',
      maxLength: 60,
      explanation:
        'In a yes/no question the verb moves to first position and the subject follows: Bist du Lehrer?',
    },
    {
      id: 'demo-ex-19',
      chapterNumber: 0,
      order: 19,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['subject-pronouns', 'capitalisation'],
      instruction:
        'Write only the missing pronoun. It starts the sentence, so capitalisation matters.',
      prompt: 'Die Wohnung ist neu. → ___ ist neu.',
      acceptedAnswers: ['Sie'],
      answerMode: 'normalized',
      placeholder: 'pronoun',
      maxLength: 10,
      explanation:
        'die Wohnung is feminine and is replaced by sie, written with a capital S here because it opens the sentence.',
    },
    {
      id: 'demo-ex-20',
      chapterNumber: 0,
      order: 20,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['formal-address', 'questions'],
      instruction:
        'Ask Frau Berg formally whether she is ready. Use only the words sein, Sie and fertig.',
      prompt: 'Frau Berg / fertig?',
      acceptedAnswers: ['Sind Sie fertig?'],
      answerMode: 'normalized',
      placeholder: 'Sind ...',
      maxLength: 60,
      explanation:
        'Formal questions use Sie with sind, the verb comes first: Sind Sie fertig?',
    },

    /* 21–24 · mixed review and transfer */
    {
      id: 'demo-ex-21',
      chapterNumber: 0,
      order: 21,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['sein', 'error-correction'],
      instruction: 'Correct the sentence and write it out completely.',
      prompt: 'Er sind mein Bruder.',
      acceptedAnswers: ['Er ist mein Bruder.'],
      answerMode: 'normalized',
      placeholder: 'Er ...',
      maxLength: 60,
      explanation: 'er is singular, so the verb form is ist, not sind.',
    },
    {
      id: 'demo-ex-22',
      chapterNumber: 0,
      order: 22,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['sein', 'answers'],
      instruction:
        'Answer for yourself and your brother in a full sentence. Punctuation is not checked here.',
      prompt: 'Seid ihr aus Deutschland? – Ja, ...',
      acceptedAnswers: ['Ja, wir sind aus Deutschland.'],
      answerMode: 'punctuationInsensitive',
      requiredTokens: ['wir', 'sind'],
      placeholder: 'Ja, wir ...',
      maxLength: 80,
      explanation:
        'A question with ihr is answered with wir, and wir takes sind: Ja, wir sind aus Deutschland.',
    },
    {
      id: 'demo-ex-23',
      chapterNumber: 0,
      order: 23,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['sein', 'umlauts'],
      instruction:
        'Translate into German using ihr. The umlaut buttons under the field can help.',
      prompt: 'You (several friends) are late. Use the word spät.',
      acceptedAnswers: ['Ihr seid spät.'],
      answerMode: 'normalized',
      placeholder: 'Ihr ...',
      maxLength: 60,
      explanation:
        'Several friends are addressed with ihr, which takes seid: Ihr seid spät. The ä in spät is required.',
    },
    {
      id: 'demo-ex-24',
      chapterNumber: 0,
      order: 24,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['sein', 'word-order', 'negation'],
      instruction: 'Put the elements in the correct order and write the whole sentence.',
      prompt: 'nicht – ist – das Auto – neu',
      acceptedAnswers: ['Das Auto ist nicht neu.'],
      answerMode: 'normalized',
      placeholder: 'Das Auto ...',
      maxLength: 60,
      explanation:
        'The subject opens the sentence, the finite verb follows in second position, and nicht stands before the adjective: Das Auto ist nicht neu.',
    },
  ],
};
