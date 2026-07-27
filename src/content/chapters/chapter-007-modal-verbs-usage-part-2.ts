import type { ChapterDefinition } from '../../schemas/chapterSchema';

export const chapter007: ChapterDefinition = {
  id: 'chapter-007',
  number: 7,
  slug: 'modal-verbs-usage-part-2',
  title: 'Modal Verbs: Usage, Part 2',
  germanTitle: 'Modalverben im Gebrauch, Teil 2',
  level: 'A1',
  section: 'verbs-1',
  objective:
    'Use sollen to give advice and report expectations, use mögen and möchte correctly for likes and polite wishes, and tell nicht müssen and nicht dürfen apart when choosing the right modal verb for a social situation.',
  prerequisites: [6],
  estimatedMinutes: 25,
  tags: [
    'modal-verbs',
    'sollen',
    'moegen-moechte',
    'permission-vs-obligation',
    'polite-requests',
  ],
  explanation: {
    introduction: [
      'This chapter continues the modal verbs from the previous one, adding sollen (should, be supposed to) and mögen (to like), and looking closely at what happens when you put nicht in front of a modal verb.',
      'The trickiest part of this chapter is not learning new words — it is realising that müssen and dürfen behave very differently once you negate them. Getting nicht müssen and nicht dürfen mixed up is one of the most common mistakes learners make, because a word-for-word translation from English can point you in the wrong direction.',
      'By the end of this chapter you should be able to pick the right modal verb for the situation: are you giving advice, stating an obligation, granting or denying permission, or expressing a preference?',
    ],
    rules: [
      {
        id: 'ch07-rule-01',
        heading: 'sollen: advice and someone else’s expectation',
        paragraphs: [
          'sollen expresses what is expected, recommended, or asked of you by someone else, by an authority, or by a situation — it does not describe a necessity you have decided on yourself.',
          'Use sollen to give friendly advice: Du sollst mehr schlafen. (You should sleep more.) It is also the natural choice when you report what another person wants: Der Arzt sagt, ich soll weniger Kaffee trinken. (The doctor says I should drink less coffee.)',
          'sollen is also common in questions that ask for instructions or offer to do something: Soll ich das Fenster öffnen? (Should I open the window?)',
        ],
        notes: [
          'Contrast with müssen: müssen expresses a necessity that comes from objective circumstances or from your own conviction, while sollen points outward, to someone else’s expectation or to a piece of advice.',
        ],
      },
      {
        id: 'ch07-rule-02',
        heading: 'mögen and möchte: liking versus polite wanting',
        paragraphs: [
          'mögen expresses a general liking or preference, most often together with a noun: Ich mag Musik. (I like music.) Ich mag keinen Regen. (I don’t like rain.)',
          'möchte comes historically from mögen, but today it works as its own polite way of saying "would like" — a soft wish or a polite request in the here and now, not a general statement about taste: Ich möchte einen Kaffee. (I would like a coffee.)',
          'Use möchte, not mögen, when you want something right now or want to ask for something politely; use mögen for likes and dislikes in general, including with an infinitive only in fairly formal writing — everyday speech prefers möchte for wishes.',
        ],
      },
      {
        id: 'ch07-rule-03',
        heading: 'nicht müssen versus nicht dürfen: two very different negatives',
        paragraphs: [
          'Adding nicht to müssen and to dürfen does not simply attach a plain "not" to their basic meaning — the two negated forms point in opposite directions, and this is the single most important distinction in this chapter.',
          'nicht müssen removes the obligation: doing the thing becomes optional. Du musst nicht kommen. = You don’t have to come (but you may, if you want to).',
          'nicht dürfen removes the permission: doing the thing becomes forbidden. Du darfst nicht kommen. = You are not allowed to come (under no circumstances).',
          'A useful way to remember it: think of müssen as "it is necessary" and dürfen as "it is permitted." Negating a necessity sets you free (nicht müssen); negating a permission creates a prohibition (nicht dürfen).',
        ],
        notes: [
          'English "must not" corresponds to German nicht dürfen, not nicht müssen — this is the opposite of what a literal word-by-word translation might suggest, so it is worth memorising as a fixed pair.',
        ],
      },
      {
        id: 'ch07-rule-04',
        heading: 'Choosing the right modal verb for the situation',
        paragraphs: [
          'Each German modal verb carries its own social meaning, so choosing the right one changes how your sentence is understood: müssen = necessity or obligation, dürfen = permission (nicht dürfen = prohibition), sollen = advice or someone else’s expectation, wollen = firm intention or plan, mögen/möchten = liking or a polite wish.',
          'When you want to advise someone, reach for sollen. When you want to state a rule or grant/deny permission, use dürfen (with or without nicht). When something is simply required, use müssen. When you are expressing a wish or ordering something politely, use möchte.',
          'Short two-line dialogues are a good test of this skill: if the reply reports what a doctor, teacher, or parent said, expect sollen; if it states a strict rule, expect müssen or nicht dürfen; if it states a firm, already-decided plan, expect wollen rather than the softer möchte.',
        ],
      },
    ],
    tables: [
      {
        id: 'ch07-table-01',
        title: 'sollen, mögen, and möchte in the present tense',
        columns: ['Person', 'sollen', 'mögen', 'möchte'],
        rows: [
          ['ich', 'soll', 'mag', 'möchte'],
          ['du', 'sollst', 'magst', 'möchtest'],
          ['er/sie/es', 'soll', 'mag', 'möchte'],
          ['wir', 'sollen', 'mögen', 'möchten'],
          ['ihr', 'sollt', 'mögt', 'möchtet'],
          ['sie/Sie', 'sollen', 'mögen', 'möchten'],
        ],
        note: 'möchte has no separate infinitive of its own in everyday use; it is treated as the polite counterpart of mögen.',
      },
      {
        id: 'ch07-table-02',
        title: 'nicht müssen vs. nicht dürfen at a glance',
        columns: ['Expression', 'Meaning', 'Example'],
        rows: [
          [
            'nicht müssen',
            'not required to — it is optional',
            'Du musst nicht kommen. (You don’t have to come.)',
          ],
          [
            'nicht dürfen',
            'not allowed to — it is forbidden',
            'Du darfst nicht rauchen. (You are not allowed to smoke.)',
          ],
        ],
      },
    ],
    examples: [
      {
        german: 'Ich mag Kaffee.',
        english: 'I like coffee.',
        highlight: ['mag'],
        explanation: 'mögen with a noun states a general liking.',
      },
      {
        german: 'Er mag keine Katzen.',
        english: 'He doesn’t like cats.',
        highlight: ['mag'],
        explanation: 'A negative liking is simply mag + kein-.',
      },
      {
        german: 'Ich möchte einen Tee, bitte.',
        english: 'I would like a tea, please.',
        highlight: ['möchte'],
        explanation: 'möchte makes an order or wish sound polite.',
      },
      {
        german: 'Möchtest du mitkommen?',
        english: 'Would you like to come along?',
        highlight: ['Möchtest'],
        explanation: 'A polite invitation uses möchte, not mögen.',
      },
      {
        german: 'Ich mag Pizza, aber jetzt möchte ich lieber Salat.',
        english: 'I like pizza, but right now I’d rather have salad.',
        highlight: ['mag', 'möchte'],
        explanation:
          'mag states a general taste; möchte states what is wanted right now.',
      },
      {
        german: 'Der Arzt sagt, du sollst mehr schlafen.',
        english: 'The doctor says you should sleep more.',
        highlight: ['sollst'],
        explanation: 'Reported advice from someone else uses sollen.',
      },
      {
        german: 'Meine Mutter sagt, ich soll öfter anrufen.',
        english: 'My mother says I should call more often.',
        highlight: ['soll'],
        explanation: 'sollen reports another person’s wish or expectation.',
      },
      {
        german: 'Soll ich das Fenster öffnen?',
        english: 'Should I open the window?',
        highlight: ['Soll'],
        explanation:
          'sollen is also used to offer to do something or ask for instructions.',
      },
      {
        german: 'Du musst nicht mitkommen.',
        english: 'You don’t have to come along.',
        highlight: ['musst nicht'],
        explanation: 'nicht müssen: coming along is optional, not required.',
      },
      {
        german: 'Du darfst nicht mitkommen.',
        english: 'You are not allowed to come along.',
        highlight: ['darfst nicht'],
        explanation:
          'nicht dürfen: coming along is forbidden — the exact opposite of the sentence above.',
      },
      {
        german: 'Wir müssen heute nicht kochen, wir bestellen Pizza.',
        english: 'We don’t have to cook today, we’re ordering pizza.',
        explanation: 'Cooking is simply optional today (nicht müssen).',
      },
      {
        german: 'Hier darf man nicht rauchen.',
        english: 'Smoking is not allowed here.',
        explanation: 'A public rule or prohibition uses nicht dürfen.',
      },
      {
        german: 'Sie muss heute nicht arbeiten, sie hat frei.',
        english: 'She doesn’t have to work today, she has the day off.',
        explanation:
          'Having the day off removes the obligation (nicht müssen), it does not forbid anything.',
      },
      {
        german: 'Im Museum darf man nicht fotografieren.',
        english: 'Photography is not allowed in the museum.',
        explanation: 'A museum rule is a prohibition, so nicht dürfen is used.',
      },
      {
        german:
          'Ich habe schon die Fahrkarten gekauft. Ich will nächste Woche nach Berlin fahren.',
        english:
          'I’ve already bought the tickets. I’m going to travel to Berlin next week.',
        explanation:
          'A firm, already-decided plan is expressed with wollen, not the softer möchte.',
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Du musst hier nicht rauchen. (meaning: smoking is forbidden here)',
        correct: 'Du darfst hier nicht rauchen.',
        explanation:
          'nicht müssen only says that something is optional, not that it is forbidden. To express a prohibition, use nicht dürfen.',
      },
      {
        incorrect: 'Du musst mehr Wasser trinken. (said gently, as friendly advice)',
        correct: 'Du sollst mehr Wasser trinken.',
        explanation:
          'müssen sounds like a strict, personal necessity or a command. Friendly advice or a recommendation from someone else is expressed with sollen instead.',
      },
      {
        incorrect: 'Ich mag ins Kino gehen.',
        correct: 'Ich möchte ins Kino gehen.',
        explanation:
          'mögen together with an infinitive is unusual in everyday speech. For "would like to do something", use möchte, not mögen.',
      },
      {
        incorrect: 'Ich möchtet einen Kaffee.',
        correct: 'Ich möchte einen Kaffee.',
        explanation:
          'möchte does not take a -t ending in the ich-form; that ending belongs to the du- or ihr-form pattern of other verbs, not to ich möchte.',
      },
      {
        incorrect: 'Ich darf nicht heute arbeiten.',
        correct: 'Ich darf heute nicht arbeiten.',
        explanation:
          'nicht normally stands close to the end of the sentence, right before the part it negates (here, arbeiten), not directly after the modal verb.',
      },
    ],
    remember: [
      'sollen = advice or someone else’s expectation; müssen = necessity that comes from circumstances or your own conviction.',
      'mögen + noun = a general liking; möchte = a polite "would like", used for a wish or request right now.',
      'nicht müssen = not required, it’s optional; nicht dürfen = not allowed, it’s forbidden — never mix these two up.',
      'Match the modal verb to the social situation: sollen for advice, dürfen for permission or prohibition, müssen for obligation, mögen/möchten for preference and polite wishes.',
    ],
  },
  mastery: {
    passingPercent: 80,
    minimumAnswered: 24,
    requiredCorrectTextInputs: 8,
    maxOpenReviewFlags: 3,
  },
  exercises: [
    {
      id: 'ch07-ex-01',
      chapterNumber: 7,
      order: 1,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['nicht-muessen'],
      instruction: 'Choose the modal verb that correctly completes the sentence.',
      prompt: 'Du hast heute frei. Du ___ nicht arbeiten.',
      options: [
        { id: 'a', text: 'musst' },
        { id: 'b', text: 'darfst' },
        { id: 'c', text: 'sollst' },
        { id: 'd', text: 'kannst' },
      ],
      correctOptionId: 'a',
      explanation:
        'Having the day off removes any obligation — work is simply optional today, which is nicht müssen.',
    },
    {
      id: 'ch07-ex-02',
      chapterNumber: 7,
      order: 2,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['nicht-duerfen'],
      instruction: 'Choose the modal verb that correctly completes the sentence.',
      prompt: 'Rauchen ist hier verboten. Du ___ hier nicht rauchen.',
      options: [
        { id: 'a', text: 'darfst' },
        { id: 'b', text: 'musst' },
        { id: 'c', text: 'sollst' },
        { id: 'd', text: 'möchtest' },
      ],
      correctOptionId: 'a',
      explanation:
        'verboten (forbidden) signals a prohibition, which is expressed with nicht dürfen.',
    },
    {
      id: 'ch07-ex-03',
      chapterNumber: 7,
      order: 3,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['sollen', 'advice'],
      instruction: 'Choose the modal verb that correctly completes the sentence.',
      prompt: 'Der Arzt sagt: Sie ___ mehr Wasser trinken.',
      options: [
        { id: 'a', text: 'sollen' },
        { id: 'b', text: 'müssen' },
        { id: 'c', text: 'dürfen' },
        { id: 'd', text: 'mögen' },
      ],
      correctOptionId: 'a',
      explanation:
        'Reported advice from the doctor is expressed with sollen, not with the stronger müssen.',
    },
    {
      id: 'ch07-ex-04',
      chapterNumber: 7,
      order: 4,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['muessen', 'obligation'],
      instruction: 'Choose the modal verb that correctly completes the sentence.',
      prompt: 'Der Test beginnt in fünf Minuten. Wir ___ jetzt gehen.',
      options: [
        { id: 'a', text: 'müssen' },
        { id: 'b', text: 'sollen' },
        { id: 'c', text: 'dürfen' },
        { id: 'd', text: 'mögen' },
      ],
      correctOptionId: 'a',
      explanation:
        'A real, urgent necessity from the circumstances calls for müssen; sollen would sound like a mere suggestion here.',
    },
    {
      id: 'ch07-ex-05',
      chapterNumber: 7,
      order: 5,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['moegen', 'preference'],
      instruction: 'Choose the modal verb that correctly completes the sentence.',
      prompt: 'Ich ___ Schokolade. Das ist meine Lieblingssüßigkeit seit der Kindheit.',
      options: [
        { id: 'a', text: 'mag' },
        { id: 'b', text: 'will' },
        { id: 'c', text: 'möchte' },
        { id: 'd', text: 'soll' },
      ],
      correctOptionId: 'a',
      explanation:
        'A lifelong, general taste is a statement of liking, so mögen (mag) is correct; möchte would suggest a wish right now, not a lasting preference.',
    },
    {
      id: 'ch07-ex-06',
      chapterNumber: 7,
      order: 6,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['wollen', 'intention'],
      instruction: 'Choose the modal verb that correctly completes the sentence.',
      prompt:
        'Ich habe schon die Fahrkarten gekauft. Ich ___ nächste Woche nach Berlin fahren.',
      options: [
        { id: 'a', text: 'will' },
        { id: 'b', text: 'möchte' },
        { id: 'c', text: 'mag' },
        { id: 'd', text: 'soll' },
      ],
      correctOptionId: 'a',
      explanation:
        'Having already bought the tickets shows a firm, decided plan — that calls for wollen, not the softer wish möchte.',
    },
    {
      id: 'ch07-ex-07',
      chapterNumber: 7,
      order: 7,
      type: 'singleChoice',
      level: 'production',
      grammarFocus: ['moechte', 'polite-requests'],
      instruction: 'Choose the most appropriate sentence for the situation.',
      prompt: 'In a restaurant, you want to politely ask the waiter for the menu.',
      options: [
        { id: 'a', text: 'Ich möchte die Speisekarte, bitte.' },
        { id: 'b', text: 'Ich mag die Speisekarte.' },
        { id: 'c', text: 'Ich will die Speisekarte.' },
        { id: 'd', text: 'Ich soll die Speisekarte.' },
      ],
      correctOptionId: 'a',
      explanation:
        'möchte + bitte is the polite way to ask for something; mag states a like, will sounds demanding, and soll is not idiomatic here.',
    },
    {
      id: 'ch07-ex-08',
      chapterNumber: 7,
      order: 8,
      type: 'singleChoice',
      level: 'transfer',
      grammarFocus: ['sollen', 'advice', 'dialogue'],
      instruction:
        'Read the short dialogue and choose the modal verb that fits B’s reply.',
      prompt: 'A: Ich habe Kopfschmerzen.\nB: Dann ___ du eine Pause machen.',
      options: [
        { id: 'a', text: 'sollst' },
        { id: 'b', text: 'musst' },
        { id: 'c', text: 'darfst' },
        { id: 'd', text: 'möchtest' },
      ],
      correctOptionId: 'a',
      explanation:
        'Friendly advice in response to a complaint is expressed with sollen, not the stronger müssen.',
    },
    {
      id: 'ch07-ex-09',
      chapterNumber: 7,
      order: 9,
      type: 'singleChoice',
      level: 'transfer',
      grammarFocus: ['nicht-muessen', 'dialogue'],
      instruction:
        'Read the short dialogue and choose the modal verb that fits B’s reply.',
      prompt:
        'A: Muss ich heute zur Schule gehen?\nB: Nein, heute ist Feiertag. Du ___ nicht zur Schule gehen.',
      options: [
        { id: 'a', text: 'musst' },
        { id: 'b', text: 'darfst' },
        { id: 'c', text: 'sollst' },
        { id: 'd', text: 'magst' },
      ],
      correctOptionId: 'a',
      explanation:
        'A holiday removes the obligation to go to school — it becomes optional (nicht müssen), not forbidden.',
    },
    {
      id: 'ch07-ex-10',
      chapterNumber: 7,
      order: 10,
      type: 'singleChoice',
      level: 'transfer',
      grammarFocus: ['nicht-duerfen', 'dialogue'],
      instruction:
        'Read the short dialogue and choose the modal verb that fits B’s reply.',
      prompt:
        'A: Kann ich hier parken?\nB: Nein, hier ___ man nicht parken. Das ist verboten.',
      options: [
        { id: 'a', text: 'darf' },
        { id: 'b', text: 'muss' },
        { id: 'c', text: 'soll' },
        { id: 'd', text: 'mag' },
      ],
      correctOptionId: 'a',
      explanation:
        'A parking ban is a prohibition, so nicht dürfen is the correct choice.',
    },
    {
      id: 'ch07-ex-11',
      chapterNumber: 7,
      order: 11,
      type: 'singleChoice',
      level: 'transfer',
      grammarFocus: ['sollen', 'reported-advice', 'dialogue'],
      instruction:
        'Read the short dialogue and choose the modal verb that fits B’s reply.',
      prompt:
        'A: Was hat der Zahnarzt gesagt?\nB: Ich ___ zweimal am Tag die Zähne putzen.',
      options: [
        { id: 'a', text: 'soll' },
        { id: 'b', text: 'mag' },
        { id: 'c', text: 'darf' },
        { id: 'd', text: 'möchte' },
      ],
      correctOptionId: 'a',
      explanation: 'Reporting the dentist’s recommendation uses sollen.',
    },
    {
      id: 'ch07-ex-12',
      chapterNumber: 7,
      order: 12,
      type: 'singleChoice',
      level: 'transfer',
      grammarFocus: ['nicht-duerfen', 'nicht-muessen'],
      instruction:
        'Choose the sentence that correctly says smoking is forbidden in the flat.',
      prompt:
        'Your friend asks if smoking is allowed in your flat. Choose the correct answer: "No, you are not allowed to smoke here."',
      options: [
        { id: 'a', text: 'Nein, du darfst hier nicht rauchen.' },
        { id: 'b', text: 'Nein, du musst hier nicht rauchen.' },
        { id: 'c', text: 'Nein, du sollst hier nicht rauchen.' },
        { id: 'd', text: 'Nein, du magst hier nicht rauchen.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Forbidding something requires nicht dürfen; nicht müssen would only say that smoking is optional, not that it is banned.',
    },
    {
      id: 'ch07-ex-13',
      chapterNumber: 7,
      order: 13,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['sollen', 'conjugation'],
      instruction:
        'Write the correct present-tense form of sollen. Capitalisation is not checked.',
      prompt: 'Er ___ (sollen) heute pünktlich sein.',
      acceptedAnswers: ['soll'],
      answerMode: 'caseInsensitive',
      placeholder: 'form of sollen',
      maxLength: 15,
      explanation: 'The er/sie/es-form of sollen is soll.',
    },
    {
      id: 'ch07-ex-14',
      chapterNumber: 7,
      order: 14,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['moegen', 'conjugation'],
      instruction:
        'Write the correct present-tense form of mögen. Capitalisation is not checked.',
      prompt: 'Ich ___ (mögen) Tee mehr als Kaffee.',
      acceptedAnswers: ['mag'],
      answerMode: 'caseInsensitive',
      placeholder: 'form of mögen',
      maxLength: 15,
      explanation: 'The ich-form of mögen is mag.',
    },
    {
      id: 'ch07-ex-15',
      chapterNumber: 7,
      order: 15,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['moechte', 'conjugation'],
      instruction:
        'Write the correct present-tense form of möchte. Capitalisation is not checked.',
      prompt: 'Wir ___ (möchten) am Fenster sitzen.',
      acceptedAnswers: ['möchten'],
      answerMode: 'caseInsensitive',
      placeholder: 'form of möchten',
      maxLength: 15,
      explanation: 'The wir-form of möchten is möchten.',
    },
    {
      id: 'ch07-ex-16',
      chapterNumber: 7,
      order: 16,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['nicht-muessen'],
      instruction:
        'Write the missing modal verb. The rest of the sentence, including nicht, is already given.',
      prompt: 'Du hast schon bezahlt. Du ___ nicht noch einmal bezahlen.',
      acceptedAnswers: ['musst'],
      answerMode: 'caseInsensitive',
      placeholder: 'modal verb',
      maxLength: 15,
      explanation:
        'Having already paid removes the obligation to pay again — that is nicht müssen, not a prohibition.',
    },
    {
      id: 'ch07-ex-17',
      chapterNumber: 7,
      order: 17,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['nicht-duerfen'],
      instruction:
        'Write the missing modal verb. The rest of the sentence, including nicht, is already given.',
      prompt: 'Alkohol ist hier verboten. Du ___ nicht Alkohol trinken.',
      acceptedAnswers: ['darfst'],
      answerMode: 'caseInsensitive',
      placeholder: 'modal verb',
      maxLength: 15,
      explanation: 'verboten (forbidden) is a prohibition, so nicht dürfen is required.',
    },
    {
      id: 'ch07-ex-18',
      chapterNumber: 7,
      order: 18,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['sollen', 'reported-instruction'],
      instruction: 'Write the missing modal verb. Capitalisation is not checked.',
      prompt: 'Die Lehrerin sagt, wir ___ die Hausaufgaben bis Montag fertig haben.',
      acceptedAnswers: ['sollen'],
      answerMode: 'caseInsensitive',
      placeholder: 'modal verb',
      maxLength: 15,
      explanation: 'Reporting the teacher’s expectation uses sollen (wir sollen).',
    },
    {
      id: 'ch07-ex-19',
      chapterNumber: 7,
      order: 19,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['moechte', 'polite-requests'],
      instruction:
        'Write a complete, polite request for a coffee, using möchte and bitte.',
      prompt: 'Politely ask for a coffee.',
      acceptedAnswers: [
        'Ich möchte einen Kaffee, bitte.',
        'Ich möchte bitte einen Kaffee.',
      ],
      answerMode: 'normalized',
      placeholder: 'Ich möchte ...',
      maxLength: 60,
      explanation:
        'möchte combined with bitte is the standard polite way to order or request something.',
    },
    {
      id: 'ch07-ex-20',
      chapterNumber: 7,
      order: 20,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['sollen', 'advice', 'dialogue'],
      instruction:
        'Write B’s reply as a complete sentence, advising A to sleep more. Use sollen.',
      prompt: 'A: Ich bin so müde.\nB: ___',
      acceptedAnswers: ['Du sollst mehr schlafen.'],
      answerMode: 'normalized',
      placeholder: 'Du sollst ...',
      maxLength: 60,
      explanation:
        'Friendly advice in reply to a complaint is expressed with sollen: Du sollst mehr schlafen.',
    },
    {
      id: 'ch07-ex-21',
      chapterNumber: 7,
      order: 21,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['nicht-muessen', 'translation'],
      instruction: 'Translate the sentence into German, using nicht müssen.',
      prompt: 'You don’t have to come to the party.',
      acceptedAnswers: ['Du musst nicht zur Party kommen.'],
      answerMode: 'normalized',
      placeholder: 'Du musst ...',
      maxLength: 60,
      explanation:
        'Since attending is optional, not forbidden, the correct choice is nicht müssen.',
    },
    {
      id: 'ch07-ex-22',
      chapterNumber: 7,
      order: 22,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['nicht-duerfen', 'translation'],
      instruction: 'Translate the sentence into German, using nicht dürfen.',
      prompt: 'Children are not allowed to swim alone here.',
      acceptedAnswers: [
        'Kinder dürfen hier nicht allein schwimmen.',
        'Hier dürfen Kinder nicht allein schwimmen.',
      ],
      answerMode: 'normalized',
      placeholder: 'Kinder dürfen ...',
      maxLength: 60,
      explanation: 'A prohibition requires nicht dürfen, not nicht müssen.',
    },
    {
      id: 'ch07-ex-23',
      chapterNumber: 7,
      order: 23,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['wollen', 'intention', 'dialogue'],
      instruction:
        'Write B’s reply as a complete sentence, describing a firm, already-decided plan. Use wollen.',
      prompt: 'A: Was macht ihr im Sommer?\nB: ___ (we are going to travel to Italy)',
      acceptedAnswers: [
        'Wir wollen nach Italien reisen.',
        'Wir wollen nach Italien fahren.',
      ],
      answerMode: 'normalized',
      placeholder: 'Wir wollen ...',
      maxLength: 60,
      explanation:
        'A firm plan is expressed with wollen, not the softer, more tentative möchten.',
    },
    {
      id: 'ch07-ex-24',
      chapterNumber: 7,
      order: 24,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['nicht-duerfen', 'nicht-muessen', 'error-correction'],
      instruction:
        'This sentence was meant to say that smoking is forbidden here, but it uses the wrong modal verb. Correct it and write the full sentence.',
      prompt:
        'Du musst hier nicht rauchen. (intended meaning: smoking is forbidden here)',
      acceptedAnswers: ['Du darfst hier nicht rauchen.'],
      answerMode: 'normalized',
      placeholder: 'Du darfst ...',
      maxLength: 60,
      explanation:
        'To express a prohibition, use nicht dürfen; nicht müssen only says that smoking is optional, which is not what was meant.',
    },
  ],
};
