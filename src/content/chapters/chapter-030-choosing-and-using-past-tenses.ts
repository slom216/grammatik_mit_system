import type { ChapterDefinition } from '../../schemas/chapterSchema';

export const chapter030: ChapterDefinition = {
  id: 'chapter-030',
  number: 30,
  slug: 'choosing-and-using-past-tenses',
  title: 'Choosing and Using Past Tenses',
  germanTitle: 'Präteritum oder Perfekt?',
  level: 'A2',
  section: 'verbs-2',
  objective:
    'Choose naturally between the present perfect and the simple past for the same past event, know which verbs (sein, haben, the modal verbs) are normally used in the simple past even in speech, and keep tense use consistent within a short text.',
  prerequisites: [25, 26, 27, 29],
  estimatedMinutes: 28,
  tags: ['perfekt', 'präteritum', 'past-tense', 'register', 'review'],
  explanation: {
    introduction: [
      'By now you can build the present perfect (Perfekt) with haben or sein, and you know the simple past (Präteritum) of sein, haben, and the modal verbs. Both tenses can describe the very same event in the past: Ich habe den Film gesehen and Ich sah den Film both mean "I saw the film." At this level, the two tenses do not change the meaning — they are not like English "I have seen" versus "I saw." The real difference is one of style: which tense sounds natural in which situation.',
      'This chapter does not teach a new grammar form. Instead, it brings together everything you already know about the Perfekt and the Präteritum and helps you decide, in a given context, which one a native speaker would actually reach for. The short answer: in conversation, most verbs prefer the Perfekt, but sein, haben, and the modal verbs prefer the Präteritum — even when everything else in the sentence is in the Perfekt. In written stories and reports, the Präteritum is the normal choice for almost all verbs.',
    ],
    rules: [
      {
        id: 'ch30-rule-01',
        heading: 'Same time, same meaning, different register',
        paragraphs: [
          'The Perfekt and the Präteritum both place an action in the past, and for regular past-time statements they are interchangeable in meaning: Er hat lange geschlafen and Er schlief lange both simply say "He slept for a long time." Neither sentence is more "finished" or more "recent" than the other — German does not use these two tenses to mark that kind of difference the way some other languages do.',
          'What changes is how natural the sentence sounds in a given medium: spoken conversation or a written narrative. Choosing the tense is a question of register, not of correctness.',
        ],
      },
      {
        id: 'ch30-rule-02',
        heading: 'Spoken German: Perfekt is the default, with three exceptions',
        paragraphs: [
          'In everyday conversation, on the phone, or in an informal message, German speakers overwhelmingly use the Perfekt to talk about the past: Ich habe gestern gearbeitet. Wir haben ein neues Auto gekauft. Hast du das gehört?',
          'There is one important group of exceptions: sein, haben, and the modal verbs (können, müssen, wollen, dürfen, sollen, mögen) are commonly used in the Präteritum even in relaxed spoken German, because their Präteritum forms are short and easy to say — often shorter than the Perfekt would be. So a spoken sentence quite naturally mixes tenses: Ich war müde, deshalb habe ich früh geschlafen. (I was tired, so I went to sleep early.) war stays in the Präteritum while geschlafen appears in the Perfekt, in the very same sentence.',
          'This is exactly the pattern you already met verb by verb in earlier chapters: the Präteritum of sein and haben, the Perfekt with haben, the Perfekt with sein, and the Präteritum of the modal verbs. This chapter simply asks you to combine those pieces correctly in real, connected speech.',
        ],
      },
      {
        id: 'ch30-rule-03',
        heading: 'Written narratives: Präteritum is the default',
        paragraphs: [
          'In stories, novels, newspaper reports, and other connected written narration, the Präteritum is the normal tense for describing a sequence of past events, even for verbs that would use the Perfekt in speech: Die Frau öffnete die Tür und sah ihren Freund. (The woman opened the door and saw her friend.) A spoken retelling of the same event would more likely use Die Frau hat die Tür geöffnet und hat ihren Freund gesehen.',
          'This is why the Präteritum is often called the "narrative past" (Erzähltempus): it lets a writer move a story forward without repeating haben or sein as an auxiliary in every sentence, which would feel heavy in a long written text.',
        ],
      },
      {
        id: 'ch30-rule-04',
        heading: 'A short list worth knowing actively for speech',
        paragraphs: [
          'Because sein, haben, and the modal verbs appear so often, it is worth being able to produce their Präteritum forms without hesitation, even in casual conversation: war, hatte, konnte, musste, wollte, durfte, sollte, mochte. One more verb is worth adding to this short list because its Präteritum es gab (there was/were) is far more common in speech than the Perfekt es hat gegeben: Es gab kein Brot mehr. (There was no more bread.)',
          'Outside this small set, most other verbs still sound most natural in the Perfekt when you are speaking, so there is no need to memorize the Präteritum of every verb for conversation at this level.',
        ],
      },
      {
        id: 'ch30-rule-05',
        heading: 'Stay consistent within one text or conversation',
        paragraphs: [
          'Within a single short narrative, keep the tense choice consistent unless there is a real reason to switch, such as moving from narration into a quoted remark. Randomly alternating Ich ging ... Ich bin gegangen ... Ich ging ... for the same story, without any change in register, sounds inconsistent rather than stylistically varied.',
          'A written story that starts in the Präteritum should generally stay in the Präteritum from one sentence to the next; a spoken account that starts in the Perfekt should generally stay in the Perfekt (remembering that sein, haben, and the modal verbs are still allowed to appear in the Präteritum throughout, since that is normal even in an otherwise Perfekt-based text).',
        ],
      },
      {
        id: 'ch30-rule-06',
        heading: 'No sentence is "wrong" just because it uses the other tense',
        paragraphs: [
          'It is important not to overcorrect: there is no absolute rule that says "Präteritum is wrong in speech" or "Perfekt is wrong in writing." Both Ich habe das Buch gelesen and Ich las das Buch are grammatically correct sentences with the same meaning. Regional habits also vary — in southern Germany, Austria, and Switzerland, the Perfekt is even more strongly preferred in speech than in the north, sometimes for almost every verb.',
          'This chapter is about sounding natural and idiomatic in a given context, not about avoiding a grammar mistake. If you are ever unsure which tense to pick, the Perfekt is always a safe, correct choice in spoken German.',
        ],
      },
    ],
    tables: [
      {
        id: 'ch30-table-01',
        title: 'Typical tense choice by context',
        columns: ['Context', 'Most verbs', 'sein / haben / modal verbs'],
        rows: [
          ['Conversation, phone call, message', 'Perfekt', 'Präteritum'],
          ['Story, report, news article', 'Präteritum', 'Präteritum'],
        ],
        note: 'sein, haben, and the modal verbs are usually in the Präteritum in both contexts; other verbs switch depending on whether the language is spoken or written.',
      },
      {
        id: 'ch30-table-02',
        title:
          'High-frequency Präteritum forms worth knowing for speech (ich / er-sie-es)',
        columns: ['Infinitive', 'Präteritum (ich)', 'Präteritum (er/sie/es)', 'Meaning'],
        rows: [
          ['sein', 'war', 'war', 'to be'],
          ['haben', 'hatte', 'hatte', 'to have'],
          ['können', 'konnte', 'konnte', 'can, to be able to'],
          ['müssen', 'musste', 'musste', 'must, to have to'],
          ['wollen', 'wollte', 'wollte', 'to want to'],
          ['dürfen', 'durfte', 'durfte', 'to be allowed to'],
          ['sollen', 'sollte', 'sollte', 'to be supposed to'],
          ['mögen', 'mochte', 'mochte', 'to like'],
          ['geben (es gibt)', '—', 'es gab', 'there was/were'],
        ],
      },
      {
        id: 'ch30-table-03',
        title: 'Same event, two equally correct sentences',
        columns: ['Perfekt (typical in speech)', 'Präteritum (typical in a story)'],
        rows: [
          ['Ich habe den Brief geschrieben.', 'Ich schrieb den Brief.'],
          ['Wir sind nach Hause gefahren.', 'Wir fuhren nach Hause.'],
          ['Sie hat ihm das Buch gegeben.', 'Sie gab ihm das Buch.'],
        ],
        note: 'Both columns describe the same past event and are grammatically correct; the choice depends on whether you are speaking or narrating in writing.',
      },
    ],
    examples: [
      {
        german: 'Ich habe gestern meiner Schwester geholfen.',
        english: 'I helped my sister yesterday.',
        highlight: ['habe', 'geholfen'],
        explanation:
          'A typical spoken sentence: an ordinary verb (helfen) appears in the Perfekt, as expected in conversation.',
      },
      {
        german: 'Ich war gestern sehr müde, aber ich habe trotzdem gearbeitet.',
        english: 'I was very tired yesterday, but I worked anyway.',
        highlight: ['war', 'habe', 'gearbeitet'],
        explanation:
          'In the same spoken sentence, sein stays in the Präteritum (war) while the ordinary verb arbeiten uses the Perfekt — this mixing is completely normal.',
      },
      {
        german: 'Er konnte gestern nicht kommen, weil er krank war.',
        english: 'He could not come yesterday because he was sick.',
        highlight: ['konnte', 'war'],
        explanation:
          'The modal verb können and sein both appear in the Präteritum, even though this is a spoken-style sentence about yesterday.',
      },
      {
        german:
          'Früher wohnte die Familie in einem kleinen Dorf. Der Vater arbeitete auf einem Bauernhof, und die Kinder gingen jeden Tag zu Fuß zur Schule.',
        english:
          'In earlier times, the family lived in a small village. The father worked on a farm, and the children walked to school every day.',
        highlight: ['wohnte', 'arbeitete', 'gingen'],
        explanation:
          'A written narrative: every verb, not only sein and haben, appears in the Präteritum, because this is the normal narrative tense in a story.',
      },
      {
        german:
          'Letztes Wochenende haben wir einen Ausflug gemacht und sind an einen See gefahren.',
        english: 'Last weekend we went on a trip and drove to a lake.',
        highlight: ['haben', 'gemacht', 'sind', 'gefahren'],
        explanation:
          'A spoken retelling of a weekend: both the haben-Perfekt and the sein-Perfekt are used, matching how this would actually be said aloud.',
      },
      {
        german: 'Letztes Wochenende machten wir einen Ausflug und fuhren an einen See.',
        english: 'Last weekend we went on a trip and drove to a lake.',
        highlight: ['machten', 'fuhren'],
        explanation:
          'The same event told as a short written narrative instead: both verbs shift to the Präteritum, and the meaning stays exactly the same.',
      },
      {
        german: 'Es gab gestern kein warmes Wasser in der Küche.',
        english: 'There was no hot water in the kitchen yesterday.',
        highlight: ['Es gab'],
        explanation:
          'es gab is the Präteritum of es gibt and is used far more often than es hat gegeben, even in casual speech.',
      },
      {
        german: 'Ich habe den Ring verloren, dann habe ich ihn zum Glück wiedergefunden.',
        english: 'I lost the ring, then luckily I found it again.',
        highlight: ['habe', 'verloren', 'habe', 'wiedergefunden'],
        explanation:
          'A consistent spoken account: both verbs stay in the Perfekt from one sentence to the next, without switching for no reason.',
      },
      {
        german: 'Meine Oma hat mir oft Geschichten erzählt, wenn ich klein war.',
        english: 'My grandmother often told me stories when I was little.',
        highlight: ['hat', 'erzählt', 'war'],
        explanation:
          'erzählen uses the Perfekt as expected in speech, while sein still appears in its usual Präteritum form war.',
      },
      {
        german:
          'Der Zug hatte Verspätung, deshalb sind die Passagiere lange auf dem Bahnsteig gestanden.',
        english:
          'The train was delayed, so the passengers stood on the platform for a long time.',
        highlight: ['hatte', 'sind', 'gestanden'],
        explanation:
          'haben appears in the Präteritum (hatte Verspätung), while stehen (a sein-verb) uses the Perfekt — a natural spoken mix.',
      },
      {
        german: 'Wolltest du mich gestern Abend anrufen?',
        english: 'Did you want to call me yesterday evening?',
        highlight: ['Wolltest'],
        explanation:
          'The modal verb wollen appears naturally in the Präteritum even in a spoken question about yesterday.',
      },
      {
        german: 'Sie hat mir das Foto gezeigt, das sie im Urlaub gemacht hat.',
        english: 'She showed me the photo that she took on vacation.',
        highlight: ['hat', 'gezeigt', 'gemacht hat'],
        explanation:
          'Both verb phrases stay in the Perfekt throughout the sentence, keeping the spoken register consistent.',
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Ich bin müde gewesen, deshalb habe ich früh geschlafen.',
        correct: 'Ich war müde, deshalb habe ich früh geschlafen.',
        explanation:
          'sein is normally used in the Präteritum (war), not in the Perfekt (bin gewesen), even in a sentence that otherwise uses the Perfekt.',
      },
      {
        incorrect: 'Er hat gestern nicht kommen gekonnt, weil er hat krank gewesen.',
        correct: 'Er konnte gestern nicht kommen, weil er krank war.',
        explanation:
          'Modal verbs and sein are the exception to the spoken preference for the Perfekt; konnte and war are the natural forms here, not their (rarely used) Perfekt equivalents.',
      },
      {
        incorrect: 'Die Frau öffnete die Tür und hat ihren Freund gesehen.',
        correct:
          'Die Frau öffnete die Tür und sah ihren Freund. / Die Frau hat die Tür geöffnet und hat ihren Freund gesehen.',
        explanation:
          'Within one written narrative sentence, keep the tense consistent: either both verbs in the Präteritum for a story, or both in the Perfekt for a spoken-style account — not one of each without reason.',
      },
      {
        incorrect: 'Präteritum ist im Gespräch immer falsch.',
        correct:
          'Präteritum ist im Gespräch nicht falsch, aber im Gespräch weniger üblich (außer bei sein, haben und den Modalverben).',
        explanation:
          'There is no rule that the Präteritum is wrong in speech — both tenses are grammatically correct; this chapter is about natural style, not correctness.',
      },
      {
        incorrect:
          'Ich ging ins Kino. Ich habe einen Film gesehen. Danach ging ich nach Hause.',
        correct:
          'Ich ging ins Kino. Ich sah einen Film. Danach ging ich nach Hause. (or entirely in the Perfekt: Ich bin ins Kino gegangen. Ich habe einen Film gesehen. Danach bin ich nach Hause gegangen.)',
        explanation:
          'Switching tense mid-story for no reason (Präteritum, then Perfekt, then Präteritum again) reads as inconsistent; pick one register and stay with it.',
      },
      {
        incorrect: 'Es hat gestern kein Brot mehr gegeben.',
        correct: 'Es gab gestern kein Brot mehr.',
        explanation:
          'geben in the es gibt construction almost always appears as es gab in the past, even in casual conversation; the Perfekt es hat gegeben sounds unnatural here.',
      },
    ],
    remember: [
      'The Perfekt and the Präteritum describe the same past event with the same meaning at this level — the choice is about natural style, not about correctness.',
      'In speech, prefer the Perfekt for most verbs, but keep sein, haben, and the modal verbs (können, müssen, wollen, dürfen, sollen, mögen) in the Präteritum — war, hatte, konnte, musste, wollte, durfte, sollte, mochte — and remember es gab for "there was/were."',
      'In written narratives (stories, reports, news), the Präteritum is the normal choice for nearly all verbs, including ordinary ones.',
      'Stay consistent within one short text or conversation instead of switching tense at random.',
      'Both tenses are always grammatically correct; if you are unsure, the Perfekt is a safe choice in spoken German.',
    ],
  },
  mastery: {
    passingPercent: 80,
    minimumAnswered: 65,
    requiredCorrectTextInputs: 20,
    maxOpenReviewFlags: 3,
  },
  exercises: [
    {
      id: 'ch30-ex-01',
      chapterNumber: 30,
      order: 1,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['register', 'spoken-german'],
      instruction: 'Decide which tense sounds more natural in the given context.',
      prompt:
        'A friend tells you on the phone about her day: "___ ich habe viel gearbeitet." Which tense is this?',
      options: [
        { id: 'a', text: 'Perfekt' },
        { id: 'b', text: 'Präteritum' },
        { id: 'c', text: 'Futur' },
        { id: 'd', text: 'Präsens' },
      ],
      correctOptionId: 'a',
      explanation:
        'habe ... gearbeitet is the Perfekt, the tense most naturally used for ordinary verbs in spoken conversation.',
    },
    {
      id: 'ch30-ex-02',
      chapterNumber: 30,
      order: 2,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['register', 'narrative'],
      instruction: 'Decide which tense sounds more natural in the given context.',
      prompt:
        'The opening line of a short story reads: "Der Mann ging langsam durch den Wald." Which tense is this?',
      options: [
        { id: 'a', text: 'Perfekt' },
        { id: 'b', text: 'Präteritum' },
        { id: 'c', text: 'Präsens' },
        { id: 'd', text: 'Futur' },
      ],
      correctOptionId: 'b',
      explanation:
        'ging is the Präteritum of gehen, the typical narrative tense for written stories.',
    },
    {
      id: 'ch30-ex-03',
      chapterNumber: 30,
      order: 3,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['sein', 'haben', 'exception'],
      instruction: 'Identify the verb group that prefers the Präteritum even in speech.',
      prompt:
        'Which group of verbs is commonly used in the Präteritum even in casual conversation?',
      options: [
        { id: 'a', text: 'sein, haben, and the modal verbs' },
        { id: 'b', text: 'all separable verbs' },
        { id: 'c', text: 'all reflexive verbs' },
        { id: 'd', text: 'all verbs ending in -ieren' },
      ],
      correctOptionId: 'a',
      explanation:
        'sein, haben, and the modal verbs (können, müssen, wollen, dürfen, sollen, mögen) are the well-known exception, favoured in the Präteritum even in speech.',
    },
    {
      id: 'ch30-ex-04',
      chapterNumber: 30,
      order: 4,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['meaning', 'perfekt-vs-präteritum'],
      instruction:
        'Choose the statement that correctly describes the meaning difference.',
      prompt:
        'What is the main difference in meaning between Ich habe das gemacht and Ich machte das?',
      options: [
        {
          id: 'a',
          text: 'There is basically no difference in meaning; it is a difference in style.',
        },
        { id: 'b', text: 'Ich habe das gemacht happened more recently.' },
        { id: 'c', text: 'Ich machte das is grammatically incorrect.' },
        { id: 'd', text: 'Ich habe das gemacht refers to the future.' },
      ],
      correctOptionId: 'a',
      explanation:
        'At this level, the Perfekt and the Präteritum describe the same past event with the same meaning; the choice is about natural register, not meaning.',
    },
    {
      id: 'ch30-ex-05',
      chapterNumber: 30,
      order: 5,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['identification', 'tense-form'],
      instruction:
        'Identify the tense of the underlined-style verb form in the sentence.',
      prompt: 'In "Wir mussten gestern früh aufstehen," which tense is mussten?',
      options: [
        { id: 'a', text: 'Präteritum' },
        { id: 'b', text: 'Perfekt' },
        { id: 'c', text: 'Präsens' },
        { id: 'd', text: 'Konjunktiv' },
      ],
      correctOptionId: 'a',
      explanation:
        'mussten is the Präteritum of müssen, the normal form for a modal verb even in an everyday spoken sentence.',
    },
    {
      id: 'ch30-ex-06',
      chapterNumber: 30,
      order: 6,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['identification', 'tense-form'],
      instruction: 'Identify the tense of the verb form in the sentence.',
      prompt:
        'In "Sie hat mir gestern die Fotos gezeigt," which tense is hat ... gezeigt?',
      options: [
        { id: 'a', text: 'Perfekt' },
        { id: 'b', text: 'Präteritum' },
        { id: 'c', text: 'Plusquamperfekt' },
        { id: 'd', text: 'Präsens' },
      ],
      correctOptionId: 'a',
      explanation:
        'hat ... gezeigt is the Perfekt of zeigen, the expected form for an ordinary verb in a spoken-style sentence.',
    },
    {
      id: 'ch30-ex-07',
      chapterNumber: 30,
      order: 7,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['identification', 'es-gab'],
      instruction: 'Identify the tense of the verb form in the sentence.',
      prompt: 'In "Es gab keinen Parkplatz mehr," which tense is gab?',
      options: [
        { id: 'a', text: 'Präteritum' },
        { id: 'b', text: 'Perfekt' },
        { id: 'c', text: 'Präsens' },
        { id: 'd', text: 'Imperativ' },
      ],
      correctOptionId: 'a',
      explanation:
        'gab is the Präteritum of geben; es gab is the natural way to say "there was/were" in the past, even in speech.',
    },
    {
      id: 'ch30-ex-08',
      chapterNumber: 30,
      order: 8,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['identification', 'mixed-tense'],
      instruction:
        'Identify which two tenses appear together in this natural spoken sentence.',
      prompt:
        'In "Ich hatte keine Zeit, deshalb habe ich nicht angerufen," which two tenses are used?',
      options: [
        { id: 'a', text: 'Präteritum (hatte) and Perfekt (habe ... angerufen)' },
        { id: 'b', text: 'Präsens and Futur' },
        { id: 'c', text: 'Perfekt and Plusquamperfekt' },
        { id: 'd', text: 'Präteritum and Präsens' },
      ],
      correctOptionId: 'a',
      explanation:
        'haben appears in the Präteritum (hatte), while anrufen appears in the Perfekt (habe ... angerufen) — a very common and natural mix in speech.',
    },
    {
      id: 'ch30-ex-09',
      chapterNumber: 30,
      order: 9,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['register-choice', 'spoken'],
      instruction: 'Choose the more natural option for the given context.',
      prompt:
        'You are chatting casually with a colleague about the weekend. Which sentence sounds more natural?',
      options: [
        { id: 'a', text: 'Ich habe am Samstag meine Eltern besucht.' },
        { id: 'b', text: 'Ich besuchte am Samstag meine Eltern.' },
        { id: 'c', text: 'Ich besuche am Samstag meine Eltern gehabt.' },
        { id: 'd', text: 'Ich hatte am Samstag meine Eltern besucht gehabt.' },
      ],
      correctOptionId: 'a',
      explanation:
        'For an ordinary verb like besuchen in a casual spoken exchange, the Perfekt (habe besucht) is the natural choice.',
    },
    {
      id: 'ch30-ex-10',
      chapterNumber: 30,
      order: 10,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['register-choice', 'narrative'],
      instruction: 'Choose the more natural option for the given context.',
      prompt:
        'You are writing the next sentence of a short story. Which option fits the narrative style best?',
      options: [
        { id: 'a', text: 'Der Junge fand einen Hund und brachte ihn nach Hause.' },
        {
          id: 'b',
          text: 'Der Junge hat einen Hund gefunden und hat ihn nach Hause gebracht.',
        },
        { id: 'c', text: 'Der Junge findet einen Hund und bringt ihn nach Hause.' },
        { id: 'd', text: 'Der Junge wird einen Hund finden und nach Hause bringen.' },
      ],
      correctOptionId: 'a',
      explanation:
        'A written narrative normally uses the Präteritum throughout (fand, brachte), even for ordinary verbs.',
    },
    {
      id: 'ch30-ex-11',
      chapterNumber: 30,
      order: 11,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['register-choice', 'sein-haben-modal'],
      instruction: 'Choose the more natural option for the given context.',
      prompt:
        'A spoken sentence about being unable to attend a party. Which option is most natural?',
      options: [
        { id: 'a', text: 'Ich konnte nicht kommen, weil ich krank war.' },
        { id: 'b', text: 'Ich habe nicht kommen gekonnt, weil ich krank gewesen bin.' },
        { id: 'c', text: 'Ich kommen nicht konnte, weil krank ich war.' },
        { id: 'd', text: 'Ich bin nicht gekonnt zu kommen, weil ich hatte krank.' },
      ],
      correctOptionId: 'a',
      explanation:
        'können and sein naturally appear in the Präteritum (konnte, war), even in a spoken sentence about the past.',
    },
    {
      id: 'ch30-ex-12',
      chapterNumber: 30,
      order: 12,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['consistency', 'narrative'],
      instruction:
        'Choose the sentence pair that keeps the tense consistent for a written story.',
      prompt: 'Which pair of sentences keeps a consistent narrative tense?',
      options: [
        { id: 'a', text: 'Sie öffnete das Fenster und sah den Garten.' },
        { id: 'b', text: 'Sie öffnete das Fenster und hat den Garten gesehen.' },
        { id: 'c', text: 'Sie hat das Fenster geöffnet und sah den Garten.' },
        { id: 'd', text: 'Sie öffnet das Fenster und hat den Garten gesehen.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Both verbs stay in the Präteritum (öffnete, sah), matching the consistent tense expected in a short written narrative.',
    },
    {
      id: 'ch30-ex-13',
      chapterNumber: 30,
      order: 13,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['sein', 'präteritum'],
      instruction:
        'Complete the sentence with the correct Präteritum form of sein. Capitalisation is not checked.',
      prompt: 'Gestern ___ ich den ganzen Tag zu Hause. (sein, ich)',
      acceptedAnswers: ['war'],
      answerMode: 'caseInsensitive',
      placeholder: 'war',
      maxLength: 10,
      explanation: 'The Präteritum of sein for ich is war, the normal spoken form.',
    },
    {
      id: 'ch30-ex-14',
      chapterNumber: 30,
      order: 14,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['haben', 'präteritum'],
      instruction:
        'Complete the sentence with the correct Präteritum form of haben. Capitalisation is not checked.',
      prompt: 'Er ___ leider keine Zeit für das Treffen. (haben, er)',
      acceptedAnswers: ['hatte'],
      answerMode: 'caseInsensitive',
      placeholder: 'hatte',
      maxLength: 10,
      explanation: 'The Präteritum of haben for er is hatte, the normal spoken form.',
    },
    {
      id: 'ch30-ex-15',
      chapterNumber: 30,
      order: 15,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['modal-verb', 'präteritum'],
      instruction:
        'Complete the sentence with the correct Präteritum form of wollen. Capitalisation is not checked.',
      prompt: 'Wir ___ gestern ins Kino gehen, aber es war schon voll. (wollen, wir)',
      acceptedAnswers: ['wollten'],
      answerMode: 'caseInsensitive',
      placeholder: 'wollten',
      maxLength: 10,
      explanation:
        'The Präteritum of wollen for wir is wollten, natural even in casual speech.',
    },
    {
      id: 'ch30-ex-16',
      chapterNumber: 30,
      order: 16,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['es-gab'],
      instruction:
        'Complete the sentence with the natural past-tense expression for "there was." Capitalisation is not checked.',
      prompt: '___ gestern keinen Kaffee mehr im Büro. (es gibt, past)',
      acceptedAnswers: ['es gab'],
      answerMode: 'caseInsensitive',
      placeholder: 'Es gab',
      maxLength: 15,
      explanation:
        'es gab is the natural past-tense form of es gibt, used in speech far more than es hat gegeben.',
    },
    {
      id: 'ch30-ex-17',
      chapterNumber: 30,
      order: 17,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['perfekt', 'spoken-register'],
      instruction:
        'Rewrite the sentence in the Perfekt, as you would naturally say it in conversation. Capitalisation is checked; no full stop is required.',
      prompt: 'Er schrieb seiner Freundin eine lange E-Mail. (rewrite in the Perfekt)',
      acceptedAnswers: [
        'Er hat seiner Freundin eine lange E-Mail geschrieben.',
        'Er hat seiner Freundin eine lange E-Mail geschrieben',
      ],
      answerMode: 'normalized',
      placeholder: 'Er hat ...',
      maxLength: 70,
      explanation:
        'schreiben forms its Perfekt with haben and the participle geschrieben: Er hat seiner Freundin eine lange E-Mail geschrieben.',
    },
    {
      id: 'ch30-ex-18',
      chapterNumber: 30,
      order: 18,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['präteritum', 'narrative-register'],
      instruction:
        'Rewrite the sentence in the Präteritum, as it would appear in a written story. Capitalisation is checked; no full stop is required.',
      prompt: 'Die Kinder haben im Garten gespielt. (rewrite in the Präteritum)',
      acceptedAnswers: [
        'Die Kinder spielten im Garten.',
        'Die Kinder spielten im Garten',
      ],
      answerMode: 'normalized',
      placeholder: 'Die Kinder ...',
      maxLength: 70,
      explanation:
        'spielen forms a regular Präteritum with -te: spielten. In a written narrative, this replaces the spoken haben gespielt.',
    },
    {
      id: 'ch30-ex-19',
      chapterNumber: 30,
      order: 19,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['mixed-tense', 'sein-modal-exception'],
      instruction:
        'Complete the spoken sentence, remembering that sein and modal verbs stay in the Präteritum while the other verb takes the Perfekt. Capitalisation is checked.',
      prompt:
        'Ich ___ müde, deshalb ___ ich früh ins Bett gegangen. (sein: war; gehen: bin ... gegangen — write the full sentence)',
      acceptedAnswers: [
        'Ich war müde, deshalb bin ich früh ins Bett gegangen.',
        'Ich war müde, deshalb bin ich früh ins Bett gegangen',
      ],
      answerMode: 'normalized',
      placeholder: 'Ich war ..., deshalb bin ich ...',
      maxLength: 90,
      explanation:
        'sein stays in the Präteritum (war), while gehen (a sein-verb) appears in the Perfekt (bin ... gegangen) — the typical spoken mix.',
    },
    {
      id: 'ch30-ex-20',
      chapterNumber: 30,
      order: 20,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['sentence-completion', 'modal-präteritum'],
      instruction:
        'Complete the sentence with the correct Präteritum form of müssen. Capitalisation is checked.',
      prompt:
        'Complete: "___ du gestern lange arbeiten?" (müssen, du — write the full question with question mark)',
      acceptedAnswers: ['Musstest du gestern lange arbeiten?'],
      answerMode: 'normalized',
      placeholder: 'Musstest du ...?',
      maxLength: 50,
      explanation:
        'The Präteritum of müssen for du is musstest, the natural spoken form for asking about a past obligation.',
    },
    {
      id: 'ch30-ex-21',
      chapterNumber: 30,
      order: 21,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['error-spotting', 'mixed-tense'],
      instruction:
        'This short story is told in the Präteritum, but one verb accidentally breaks the pattern. Write only the corrected verb form (in the Präteritum) that should replace it. Capitalisation is not checked.',
      prompt:
        'Story: "Der alte Mann wohnte allein in einem kleinen Haus. Jeden Morgen ging er in den Park. Er hat immer die Vögel gefüttert. Danach kehrte er nach Hause zurück." Which Präteritum form should replace hat ... gefüttert?',
      acceptedAnswers: ['fütterte'],
      answerMode: 'caseInsensitive',
      placeholder: 'fütterte',
      maxLength: 15,
      explanation:
        'The rest of the story is told in the Präteritum (wohnte, ging, kehrte zurück); to stay consistent, füttern should also appear as fütterte, not as the Perfekt hat gefüttert.',
    },
    {
      id: 'ch30-ex-22',
      chapterNumber: 30,
      order: 22,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['register-judgment', 'both-correct'],
      instruction:
        'Rewrite the sentence so that it fits a spoken conversation instead of a written story: change the Präteritum verb to the Perfekt. Capitalisation is checked; no full stop is required.',
      prompt:
        'Written narrative: "Wir kauften das Geschenk zusammen." Rewrite it as you would say it out loud.',
      acceptedAnswers: [
        'Wir haben das Geschenk zusammen gekauft.',
        'Wir haben das Geschenk zusammen gekauft',
      ],
      answerMode: 'normalized',
      placeholder: 'Wir haben ...',
      maxLength: 60,
      explanation:
        'Both Wir kauften das Geschenk zusammen and Wir haben das Geschenk zusammen gekauft are correct and describe the same event; the Perfekt is the natural spoken version.',
    },
    {
      id: 'ch30-ex-23',
      chapterNumber: 30,
      order: 23,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['rewrite', 'perfekt-to-präteritum'],
      instruction:
        'Rewrite this short two-sentence narrative from the Perfekt (spoken style) into the Präteritum (written narrative style). Capitalisation is checked.',
      prompt:
        'Rewrite: "Die Frau hat den Brief gelesen. Danach hat sie geweint." into the Präteritum.',
      acceptedAnswers: [
        'Die Frau las den Brief. Danach weinte sie.',
        'Die Frau las den Brief. Danach weinte sie',
      ],
      answerMode: 'normalized',
      placeholder: 'Die Frau ... Danach ...',
      multiline: true,
      maxLength: 90,
      explanation:
        'lesen becomes las and weinen becomes weinte in the Präteritum, giving the natural written-narrative version of the same two events.',
    },
    {
      id: 'ch30-ex-24',
      chapterNumber: 30,
      order: 24,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['rewrite', 'consistency', 'mixed-review'],
      instruction:
        'Complete this natural spoken sentence: sollen and sein go in the Präteritum, and "there was no food" uses the es gab construction. Capitalisation is checked.',
      prompt:
        'Complete: "Ich sollte zur Party kommen, aber ich war krank, und es ___ dort sowieso kein Essen." (geben, past)',
      acceptedAnswers: [
        'Ich sollte zur Party kommen, aber ich war krank, und es gab dort sowieso kein Essen.',
        'Ich sollte zur Party kommen, aber ich war krank, und es gab dort sowieso kein Essen',
      ],
      answerMode: 'normalized',
      placeholder: 'Ich sollte ..., aber ich war ..., und es gab ...',
      multiline: true,
      maxLength: 110,
      explanation:
        'sollen and sein correctly stay in the Präteritum (sollte, war), and geben also takes its natural Präteritum form es gab rather than the unnatural es hat gegeben.',
    },
    {
      id: 'ch30-ex-25',
      chapterNumber: 30,
      order: 25,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['register', 'sein-exception'],
      instruction: 'Decide which form sounds more natural in casual speech.',
      prompt:
        'A text message to a friend says: "Bist du gestern zu Hause gewesen?" Which form would sound more natural here?',
      options: [
        { id: 'a', text: 'gewesen — Warst du gestern zu Hause? would be more natural' },
        { id: 'b', text: 'Bist — it is already the most natural form' },
        { id: 'c', text: 'gestern — it should be heute' },
        { id: 'd', text: 'zu Hause — it should be daheim' },
      ],
      correctOptionId: 'a',
      explanation:
        'sein is normally used in the Präteritum (war) even in casual speech, so Warst du gestern zu Hause? is more natural than bist ... gewesen.',
    },
    {
      id: 'ch30-ex-26',
      chapterNumber: 30,
      order: 26,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['identification', 'modal-präteritum'],
      instruction: 'Identify the tense of the verb form in the sentence.',
      prompt: 'In "Wir sollten pünktlich sein," which tense is sollten?',
      options: [
        { id: 'a', text: 'Präteritum' },
        { id: 'b', text: 'Perfekt' },
        { id: 'c', text: 'Präsens' },
        { id: 'd', text: 'Imperativ' },
      ],
      correctOptionId: 'a',
      explanation:
        'sollten is the Präteritum of sollen, the natural form for this modal verb even in speech.',
    },
    {
      id: 'ch30-ex-27',
      chapterNumber: 30,
      order: 27,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['register', 'narrative'],
      instruction: 'Decide what kind of text this sentence most likely comes from.',
      prompt:
        'Which type of text is "Meine Großeltern lebten in einer kleinen Stadt" most likely from?',
      options: [
        { id: 'a', text: 'A written story or narrative' },
        { id: 'b', text: 'A phone call' },
        { id: 'c', text: 'A casual text message' },
        { id: 'd', text: 'A spoken greeting' },
      ],
      correctOptionId: 'a',
      explanation:
        'An ordinary verb (leben) in the Präteritum, describing background, is typical of written narration rather than casual speech.',
    },
    {
      id: 'ch30-ex-28',
      chapterNumber: 30,
      order: 28,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['register-choice', 'spoken'],
      instruction: 'Choose the more natural option for the given context.',
      prompt:
        "You are telling a colleague about last night's dinner. Which sentence sounds more natural?",
      options: [
        { id: 'a', text: 'Wir haben gestern Abend zusammen gegessen.' },
        { id: 'b', text: 'Wir aßen gestern Abend zusammen.' },
        { id: 'c', text: 'Wir essen gestern Abend zusammen gehabt.' },
        { id: 'd', text: 'Wir sind gestern Abend zusammen gegessen gehabt.' },
      ],
      correctOptionId: 'a',
      explanation:
        'For an ordinary verb like essen in a casual spoken account, the Perfekt (haben gegessen) is the natural choice.',
    },
    {
      id: 'ch30-ex-29',
      chapterNumber: 30,
      order: 29,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['register-choice', 'narrative'],
      instruction: 'Choose the more natural option for the given context.',
      prompt:
        'You are writing a detective story. Which sentence fits the narrative style best?',
      options: [
        { id: 'a', text: 'Der Detektiv untersuchte den Tatort genau.' },
        { id: 'b', text: 'Der Detektiv hat den Tatort genau untersucht.' },
        { id: 'c', text: 'Der Detektiv untersucht den Tatort genau gehabt.' },
        { id: 'd', text: 'Der Detektiv wird den Tatort genau untersuchen.' },
      ],
      correctOptionId: 'a',
      explanation:
        'A written narrative normally uses the Präteritum (untersuchte), even for an ordinary verb.',
    },
    {
      id: 'ch30-ex-30',
      chapterNumber: 30,
      order: 30,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['register-choice', 'modal-verb', 'dürfen'],
      instruction: 'Choose the more natural option for the given context.',
      prompt:
        'You are telling a friend about your childhood. Which sentence sounds more natural?',
      options: [
        { id: 'a', text: 'Als Kind durfte ich nicht spät fernsehen.' },
        { id: 'b', text: 'Als Kind habe ich nicht spät fernsehen gedurft.' },
        { id: 'c', text: 'Als Kind darf ich nicht spät fernsehen gehabt.' },
        { id: 'd', text: 'Als Kind werde ich nicht spät ferngesehen haben.' },
      ],
      correctOptionId: 'a',
      explanation:
        'dürfen naturally appears in the Präteritum (durfte), even in a spoken account of the past.',
    },
    {
      id: 'ch30-ex-31',
      chapterNumber: 30,
      order: 31,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['register-choice', 'modal-verb', 'mögen'],
      instruction: 'Choose the more natural option for the given context.',
      prompt:
        'You are describing a childhood habit to a friend. Which sentence sounds more natural?',
      options: [
        { id: 'a', text: 'Sie mochte als Kind keinen Fisch.' },
        { id: 'b', text: 'Sie hat als Kind keinen Fisch gemocht.' },
        { id: 'c', text: 'Sie mag als Kind keinen Fisch gehabt.' },
        { id: 'd', text: 'Sie wird als Kind keinen Fisch mögen.' },
      ],
      correctOptionId: 'a',
      explanation:
        'mögen prefers the Präteritum (mochte), even in casual conversation about the past.',
    },
    {
      id: 'ch30-ex-32',
      chapterNumber: 30,
      order: 32,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['register-choice', 'modal-verb', 'sollen'],
      instruction:
        'Choose the sentence that keeps sollen in its natural spoken past form.',
      prompt: 'Which sentence correctly keeps sollen in its natural spoken past form?',
      options: [
        { id: 'a', text: 'Ich sollte um acht Uhr da sein, aber ich kam zu spät.' },
        {
          id: 'b',
          text: 'Ich habe um acht Uhr da sein gesollt, aber ich bin zu spät gekommen.',
        },
        { id: 'c', text: 'Ich soll um acht Uhr da sein gehabt.' },
        { id: 'd', text: 'Ich werde um acht Uhr da gewesen sein.' },
      ],
      correctOptionId: 'a',
      explanation:
        'sollen naturally appears in the Präteritum (sollte), the form used even in relaxed speech.',
    },
    {
      id: 'ch30-ex-33',
      chapterNumber: 30,
      order: 33,
      type: 'singleChoice',
      level: 'production',
      grammarFocus: ['consistency', 'narrative'],
      instruction:
        'Choose the sentence that keeps a consistent narrative tense throughout.',
      prompt:
        'Which sentence keeps a consistent narrative tense for a written story about a king?',
      options: [
        { id: 'a', text: 'Der König herrschte lange und regierte weise.' },
        { id: 'b', text: 'Der König herrschte lange und hat weise regiert.' },
        { id: 'c', text: 'Der König hat lange geherrscht und regierte weise.' },
        { id: 'd', text: 'Der König herrscht lange und hat weise regiert.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Both verbs stay in the Präteritum (herrschte, regierte), matching the consistent tense expected in a short written narrative.',
    },
    {
      id: 'ch30-ex-34',
      chapterNumber: 30,
      order: 34,
      type: 'singleChoice',
      level: 'production',
      grammarFocus: ['consistency', 'mixed-tense', 'spoken'],
      instruction:
        'Choose the sentence that mixes tenses correctly for natural spoken German.',
      prompt:
        'Which spoken sentence correctly mixes tenses (modal in the Präteritum, ordinary verb in the Perfekt)?',
      options: [
        { id: 'a', text: 'Ich musste früh aufstehen und habe den Bus verpasst.' },
        { id: 'b', text: 'Ich musste früh aufstehen und verpasste den Bus.' },
        { id: 'c', text: 'Ich habe früh aufstehen gemusst und habe den Bus verpasst.' },
        { id: 'd', text: 'Ich muss früh aufstehen und habe den Bus verpasst gehabt.' },
      ],
      correctOptionId: 'a',
      explanation:
        'musste (a modal, in the Präteritum) combined with habe ... verpasst (an ordinary verb, in the Perfekt) is the natural spoken mix.',
    },
    {
      id: 'ch30-ex-35',
      chapterNumber: 30,
      order: 35,
      type: 'singleChoice',
      level: 'transfer',
      grammarFocus: ['regional-variation'],
      instruction: 'Choose the fact that correctly describes regional variation.',
      prompt:
        'In southern Germany, Austria, and Switzerland, which tense is even more dominant in speech than in the north?',
      options: [
        { id: 'a', text: 'Perfekt' },
        { id: 'b', text: 'Präteritum' },
        { id: 'c', text: 'Plusquamperfekt' },
        { id: 'd', text: 'Futur II' },
      ],
      correctOptionId: 'a',
      explanation:
        'In the south, the Perfekt is preferred even more strongly in speech, sometimes for almost every verb.',
    },
    {
      id: 'ch30-ex-36',
      chapterNumber: 30,
      order: 36,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['safe-default', 'spoken'],
      instruction: 'Choose the generally safer default for spoken German.',
      prompt:
        'If you are unsure whether to use the Perfekt or the Präteritum in a spoken sentence, which is generally the safer choice?',
      options: [
        { id: 'a', text: 'Perfekt' },
        { id: 'b', text: 'Präteritum' },
        { id: 'c', text: 'Plusquamperfekt' },
        { id: 'd', text: 'Futur I' },
      ],
      correctOptionId: 'a',
      explanation:
        'The Perfekt is always a safe, correct choice in spoken German, even when a verb could also take the Präteritum.',
    },
    {
      id: 'ch30-ex-37',
      chapterNumber: 30,
      order: 37,
      type: 'singleChoice',
      level: 'recognition',
      grammarFocus: ['meaning', 'perfekt-vs-präteritum'],
      instruction:
        'Choose the statement that correctly describes the meaning difference.',
      prompt: 'What is true of Er ist gefahren and Er fuhr?',
      options: [
        { id: 'a', text: 'Both describe the same event with the same meaning.' },
        { id: 'b', text: 'Er ist gefahren is grammatically incorrect.' },
        { id: 'c', text: 'Er fuhr refers to the future.' },
        { id: 'd', text: 'Er ist gefahren means he is still travelling now.' },
      ],
      correctOptionId: 'a',
      explanation:
        'At this level, the Perfekt and the Präteritum describe the same past event with the same meaning; only the register differs.',
    },
    {
      id: 'ch30-ex-38',
      chapterNumber: 30,
      order: 38,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['register', 'narrative'],
      instruction: 'Decide which register this sentence belongs to.',
      prompt:
        'A newspaper article reports on an accident: "Ein Fahrer verlor die Kontrolle über sein Auto." Which register is this?',
      options: [
        { id: 'a', text: 'Written narration (Präteritum)' },
        { id: 'b', text: 'Casual spoken German (Perfekt)' },
        { id: 'c', text: 'Present tense narration' },
        { id: 'd', text: 'A future prediction' },
      ],
      correctOptionId: 'a',
      explanation:
        'verlor is the Präteritum of verlieren, the normal tense for a news report describing a past event.',
    },
    {
      id: 'ch30-ex-39',
      chapterNumber: 30,
      order: 39,
      type: 'singleChoice',
      level: 'controlled',
      grammarFocus: ['register-choice', 'spoken'],
      instruction: 'Choose the more natural option for a casual text message.',
      prompt:
        'Choose the most natural way to text a friend: "Guess what happened to me today!"',
      options: [
        { id: 'a', text: 'Stell dir vor, was mir heute passiert ist!' },
        { id: 'b', text: 'Stell dir vor, was mir heute passierte!' },
        { id: 'c', text: 'Stell dir vor, was mir heute passieren gehabt hat!' },
        { id: 'd', text: 'Stell dir vor, was mir heute passieren wird!' },
      ],
      correctOptionId: 'a',
      explanation:
        'passiert ist (Perfekt) is the natural choice for an ordinary verb in a casual written message.',
    },
    {
      id: 'ch30-ex-40',
      chapterNumber: 30,
      order: 40,
      type: 'singleChoice',
      level: 'transfer',
      grammarFocus: ['narrative', 'stylistics'],
      instruction:
        'Choose the correct explanation for why narratives favour the Präteritum.',
      prompt:
        'Why do written narratives often prefer the Präteritum over the Perfekt for a whole story?',
      options: [
        {
          id: 'a',
          text: 'It avoids repeating haben or sein as an auxiliary in every sentence.',
        },
        { id: 'b', text: 'The Perfekt is grammatically wrong in stories.' },
        { id: 'c', text: 'The Präteritum only exists in stories.' },
        { id: 'd', text: 'The Perfekt can only refer to the future.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Using the Präteritum lets a writer move a story forward without repeating an auxiliary verb in every sentence.',
    },
    {
      id: 'ch30-ex-41',
      chapterNumber: 30,
      order: 41,
      type: 'errorSpotting',
      level: 'recognition',
      grammarFocus: ['sein', 'register', 'error-correction'],
      instruction:
        'Find the token that uses a less natural form for spoken German, and give the natural correction.',
      prompt: 'Ein Freund erzählt von seinem Tag. Etwas klingt unnatürlich.',
      tokens: ['Ich', 'bin', 'gestern', 'sehr', 'müde', 'gewesen.'],
      errorTokenIndex: 1,
      correction: 'war',
      explanation:
        'sein is normally used in the Präteritum (war), even in speech, rather than the Perfekt (bin ... gewesen): Ich war gestern sehr müde.',
    },
    {
      id: 'ch30-ex-42',
      chapterNumber: 30,
      order: 42,
      type: 'errorSpotting',
      level: 'recognition',
      grammarFocus: ['haben', 'register', 'error-correction'],
      instruction:
        'Find the token that uses a less natural form for spoken German, and give the natural correction.',
      prompt: 'Jemand beschreibt seinen Terminplan. Etwas klingt unnatürlich.',
      tokens: ['Er', 'hat', 'keine', 'Zeit', 'gehabt.'],
      errorTokenIndex: 1,
      correction: 'hatte',
      explanation:
        'haben prefers the Präteritum (hatte) even in speech; hat ... gehabt sounds unusual compared to Er hatte keine Zeit.',
    },
    {
      id: 'ch30-ex-43',
      chapterNumber: 30,
      order: 43,
      type: 'errorSpotting',
      level: 'controlled',
      grammarFocus: ['modal-verb', 'können', 'register', 'error-correction'],
      instruction:
        'Find the token that uses a less natural form for spoken German, and give the natural correction.',
      prompt:
        'Jemand erklärt, warum sie etwas nicht begriffen hat. Etwas klingt unnatürlich.',
      tokens: ['Sie', 'hat', 'das', 'nicht', 'verstehen', 'gekonnt.'],
      errorTokenIndex: 1,
      correction: 'konnte',
      explanation:
        'können naturally appears in the Präteritum (konnte) even in speech; the natural sentence is Sie konnte das nicht verstehen.',
    },
    {
      id: 'ch30-ex-44',
      chapterNumber: 30,
      order: 44,
      type: 'errorSpotting',
      level: 'controlled',
      grammarFocus: ['modal-verb', 'müssen', 'register', 'error-correction'],
      instruction:
        'Find the token that uses a less natural form for spoken German, and give the natural correction.',
      prompt: 'Jemand erzählt vom Morgen. Etwas klingt unnatürlich.',
      tokens: ['Wir', 'haben', 'früh', 'aufstehen', 'gemusst.'],
      errorTokenIndex: 1,
      correction: 'mussten',
      explanation:
        'müssen naturally appears in the Präteritum (mussten) even in speech; the natural sentence is Wir mussten früh aufstehen.',
    },
    {
      id: 'ch30-ex-45',
      chapterNumber: 30,
      order: 45,
      type: 'errorSpotting',
      level: 'controlled',
      grammarFocus: ['modal-verb', 'wollen', 'register', 'error-correction'],
      instruction:
        'Find the token that uses a less natural form for spoken German, and give the natural correction.',
      prompt: 'Jemand erklärt, warum er etwas abgelehnt hat. Etwas klingt unnatürlich.',
      tokens: ['Ich', 'habe', 'das', 'nicht', 'gewollt.'],
      errorTokenIndex: 1,
      correction: 'wollte',
      explanation:
        'wollen naturally appears in the Präteritum (wollte) even in speech; the natural sentence is Ich wollte das nicht.',
    },
    {
      id: 'ch30-ex-46',
      chapterNumber: 30,
      order: 46,
      type: 'errorSpotting',
      level: 'controlled',
      grammarFocus: ['modal-verb', 'dürfen', 'register', 'error-correction'],
      instruction:
        'Find the token that uses a less natural form for spoken German, and give the natural correction.',
      prompt: 'Jemand erzählt von seiner Kindheit. Etwas klingt unnatürlich.',
      tokens: ['Er', 'hat', 'als', 'Kind', 'nicht', 'fernsehen', 'gedurft.'],
      errorTokenIndex: 1,
      correction: 'durfte',
      explanation:
        'dürfen naturally appears in the Präteritum (durfte) even in speech; the natural sentence is Er durfte als Kind nicht fernsehen.',
    },
    {
      id: 'ch30-ex-47',
      chapterNumber: 30,
      order: 47,
      type: 'errorSpotting',
      level: 'controlled',
      grammarFocus: ['modal-verb', 'sollen', 'register', 'error-correction'],
      instruction:
        'Find the token that uses a less natural form for spoken German, and give the natural correction.',
      prompt: 'Jemand macht einem Freund einen Vorwurf. Etwas klingt unnatürlich.',
      tokens: ['Du', 'hast', 'pünktlich', 'kommen', 'gesollt.'],
      errorTokenIndex: 1,
      correction: 'solltest',
      explanation:
        'sollen naturally appears in the Präteritum (solltest) even in speech; the natural sentence is Du solltest pünktlich kommen.',
    },
    {
      id: 'ch30-ex-48',
      chapterNumber: 30,
      order: 48,
      type: 'errorSpotting',
      level: 'production',
      grammarFocus: ['es-gab', 'register', 'error-correction'],
      instruction:
        'Find the token that uses a less natural form for spoken German, and give the natural correction.',
      prompt: 'Jemand beschreibt einen Engpass in der Küche. Etwas klingt unnatürlich.',
      tokens: ['Es', 'hat', 'gestern', 'kein', 'Brot', 'mehr', 'gegeben.'],
      errorTokenIndex: 1,
      correction: 'gab',
      explanation:
        'es gab is the natural past-tense expression for "there was/were"; es hat ... gegeben sounds unnatural even though it is grammatically possible.',
    },
    {
      id: 'ch30-ex-49',
      chapterNumber: 30,
      order: 49,
      type: 'errorSpotting',
      level: 'production',
      grammarFocus: ['modal-verb', 'mögen', 'register', 'error-correction'],
      instruction:
        'Find the token that uses a less natural form for spoken German, and give the natural correction.',
      prompt:
        'Jemand erzählt von den Essgewohnheiten einer Freundin als Kind. Etwas klingt unnatürlich.',
      tokens: ['Sie', 'hat', 'als', 'Kind', 'keinen', 'Fisch', 'gemocht.'],
      errorTokenIndex: 1,
      correction: 'mochte',
      explanation:
        'mögen naturally appears in the Präteritum (mochte) even in speech; the natural sentence is Sie mochte als Kind keinen Fisch.',
    },
    {
      id: 'ch30-ex-50',
      chapterNumber: 30,
      order: 50,
      type: 'errorSpotting',
      level: 'transfer',
      grammarFocus: ['narrative', 'consistency', 'error-correction'],
      instruction:
        'Find the token that breaks the narrative tense pattern, and give the natural correction.',
      prompt:
        'Eine Geschichte wird im Präteritum erzählt, aber ein Verb bricht das Muster.',
      tokens: [
        'Die',
        'Frau',
        'öffnete',
        'die',
        'Tür',
        'und',
        'hat',
        'ihren',
        'Freund',
        'gesehen.',
      ],
      errorTokenIndex: 6,
      correction: 'sah',
      explanation:
        'The rest of the sentence is in the Präteritum (öffnete); to stay consistent, sehen should also appear as sah, not as the Perfekt hat ... gesehen.',
    },
    {
      id: 'ch30-ex-51',
      chapterNumber: 30,
      order: 51,
      type: 'errorSpotting',
      level: 'transfer',
      grammarFocus: ['narrative', 'consistency', 'error-correction'],
      instruction:
        'Find the token that breaks the narrative tense pattern, and give the natural correction.',
      prompt:
        'Eine Geschichte wird im Präteritum erzählt, aber ein Verb bricht das Muster.',
      tokens: [
        'Der',
        'Junge',
        'lief',
        'durch',
        'den',
        'Park',
        'und',
        'ist',
        'gestolpert.',
      ],
      errorTokenIndex: 7,
      correction: 'stolperte',
      explanation:
        'The rest of the sentence is in the Präteritum (lief); to stay consistent, stolpern should also appear as stolperte, not as the Perfekt ist gestolpert.',
    },
    {
      id: 'ch30-ex-52',
      chapterNumber: 30,
      order: 52,
      type: 'errorSpotting',
      level: 'transfer',
      grammarFocus: ['spoken-register', 'consistency', 'error-correction'],
      instruction:
        'Find the token that breaks the spoken tense pattern, and give the natural correction.',
      prompt:
        'Jemand erzählt mündlich von seinem Urlaub, wechselt aber ohne Grund die Zeitform.',
      tokens: [
        'Wir',
        'sind',
        'ans',
        'Meer',
        'gefahren',
        'und',
        'badeten',
        'den',
        'ganzen',
        'Tag.',
      ],
      errorTokenIndex: 6,
      correction: 'haben gebadet',
      explanation:
        'This spoken account starts in the Perfekt (sind ... gefahren); for consistency, baden should also stay in the Perfekt (haben gebadet) instead of switching to the Präteritum badeten without reason.',
    },
    {
      id: 'ch30-ex-53',
      chapterNumber: 30,
      order: 53,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['modal-verb', 'dürfen', 'präteritum'],
      instruction:
        'Complete the sentence with the correct Präteritum form of dürfen. Capitalisation is not checked.',
      prompt: 'Als Kind ___ ich nicht allein zur Schule gehen. (dürfen, ich)',
      acceptedAnswers: ['durfte'],
      answerMode: 'caseInsensitive',
      placeholder: 'durfte',
      maxLength: 10,
      explanation:
        'The Präteritum of dürfen for ich is durfte, the normal form even in casual speech.',
    },
    {
      id: 'ch30-ex-54',
      chapterNumber: 30,
      order: 54,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['modal-verb', 'sollen', 'präteritum'],
      instruction:
        'Complete the sentence with the correct Präteritum form of sollen. Capitalisation is not checked.',
      prompt: 'Du ___ mich gestern anrufen. (sollen, du)',
      acceptedAnswers: ['solltest'],
      answerMode: 'caseInsensitive',
      placeholder: 'solltest',
      maxLength: 12,
      explanation:
        'The Präteritum of sollen for du is solltest, the normal form even in casual speech.',
    },
    {
      id: 'ch30-ex-55',
      chapterNumber: 30,
      order: 55,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['modal-verb', 'mögen', 'präteritum'],
      instruction:
        'Complete the sentence with the correct Präteritum form of mögen. Capitalisation is not checked.',
      prompt: 'Sie ___ als Kind kein Gemüse. (mögen, sie/singular)',
      acceptedAnswers: ['mochte'],
      answerMode: 'caseInsensitive',
      placeholder: 'mochte',
      maxLength: 10,
      explanation:
        'The Präteritum of mögen for sie (singular) is mochte, the normal form even in casual speech.',
    },
    {
      id: 'ch30-ex-56',
      chapterNumber: 30,
      order: 56,
      type: 'textInput',
      level: 'controlled',
      grammarFocus: ['modal-verb', 'können', 'präteritum'],
      instruction:
        'Complete the sentence with the correct Präteritum form of können. Capitalisation is not checked.',
      prompt: 'Wir ___ leider nicht kommen. (können, wir)',
      acceptedAnswers: ['konnten'],
      answerMode: 'caseInsensitive',
      placeholder: 'konnten',
      maxLength: 12,
      explanation:
        'The Präteritum of können for wir is konnten, the normal form even in casual speech.',
    },
    {
      id: 'ch30-ex-57',
      chapterNumber: 30,
      order: 57,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['perfekt', 'spoken-register'],
      instruction:
        'Rewrite the sentence in the Perfekt, as you would naturally say it in conversation. Capitalisation is checked; no full stop is required.',
      prompt:
        'Die Kinder spielten den ganzen Nachmittag im Garten. (rewrite in the Perfekt)',
      acceptedAnswers: [
        'Die Kinder haben den ganzen Nachmittag im Garten gespielt.',
        'Die Kinder haben den ganzen Nachmittag im Garten gespielt',
      ],
      answerMode: 'normalized',
      placeholder: 'Die Kinder haben ...',
      maxLength: 80,
      explanation:
        'spielen forms its Perfekt with haben and the participle gespielt: Die Kinder haben den ganzen Nachmittag im Garten gespielt.',
    },
    {
      id: 'ch30-ex-58',
      chapterNumber: 30,
      order: 58,
      type: 'textInput',
      level: 'production',
      grammarFocus: ['präteritum', 'narrative-register'],
      instruction:
        'Rewrite the sentence in the Präteritum, as it would appear in a written story. Capitalisation is checked; no full stop is required.',
      prompt:
        'Der Mann hat die Zeitung gelesen und hat Kaffee getrunken. (rewrite in the Präteritum)',
      acceptedAnswers: [
        'Der Mann las die Zeitung und trank Kaffee.',
        'Der Mann las die Zeitung und trank Kaffee',
      ],
      answerMode: 'normalized',
      placeholder: 'Der Mann las ...',
      multiline: true,
      maxLength: 80,
      explanation:
        'lesen becomes las and trinken becomes trank in the Präteritum, giving the natural written-narrative version of the same two events.',
    },
    {
      id: 'ch30-ex-59',
      chapterNumber: 30,
      order: 59,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['mixed-tense', 'modal-exception'],
      instruction:
        'Complete the spoken sentence, remembering that müssen stays in the Präteritum while verpassen takes the Perfekt. Capitalisation is checked.',
      prompt:
        'Complete: "Ich ___ mich beeilen, aber ich ___ trotzdem den Zug verpasst." (müssen: musste; verpassen: habe ... verpasst — write the full sentence)',
      acceptedAnswers: [
        'Ich musste mich beeilen, aber ich habe trotzdem den Zug verpasst.',
        'Ich musste mich beeilen, aber ich habe trotzdem den Zug verpasst',
      ],
      answerMode: 'normalized',
      placeholder: 'Ich musste ..., aber ich habe ...',
      multiline: true,
      maxLength: 100,
      explanation:
        'müssen correctly stays in the Präteritum (musste), while the ordinary verb verpassen appears in the Perfekt (habe ... verpasst) — the typical spoken mix.',
    },
    {
      id: 'ch30-ex-60',
      chapterNumber: 30,
      order: 60,
      type: 'textInput',
      level: 'transfer',
      grammarFocus: ['error-spotting', 'mixed-tense'],
      instruction:
        'This short story is told in the Präteritum, but one verb accidentally breaks the pattern. Write only the corrected verb form (in the Präteritum) that should replace it. Capitalisation is not checked.',
      prompt:
        'Story: "Die Kinder rannten zum See. Sie sprangen ins Wasser. Sie haben laut gelacht. Danach liefen sie nach Hause." Which Präteritum form should replace haben ... gelacht?',
      acceptedAnswers: ['lachten'],
      answerMode: 'caseInsensitive',
      placeholder: 'lachten',
      maxLength: 15,
      explanation:
        'The rest of the story is told in the Präteritum (rannten, sprangen, liefen); to stay consistent, lachen should also appear as lachten, not as the Perfekt haben gelacht.',
    },
    {
      id: 'ch30-ex-61',
      chapterNumber: 30,
      order: 61,
      type: 'sentenceOrdering',
      level: 'controlled',
      grammarFocus: ['präteritum', 'narrative', 'word-order'],
      instruction:
        'Put the words in order to form a correct Präteritum narrative sentence.',
      prompt:
        'Ordne die Wörter zu einem Satz im Präteritum: "Der alte Mann ging langsam nach Hause."',
      segments: [
        { id: 'ch30-ex61-seg1', text: 'Der' },
        { id: 'ch30-ex61-seg2', text: 'alte' },
        { id: 'ch30-ex61-seg3', text: 'Mann' },
        { id: 'ch30-ex61-seg4', text: 'ging' },
        { id: 'ch30-ex61-seg5', text: 'langsam' },
        { id: 'ch30-ex61-seg6', text: 'nach' },
        { id: 'ch30-ex61-seg7', text: 'Hause.' },
      ],
      explanation:
        'ging is the Präteritum of gehen, placed in second position, with the rest of the sentence following the normal German word order.',
    },
    {
      id: 'ch30-ex-62',
      chapterNumber: 30,
      order: 62,
      type: 'sentenceOrdering',
      level: 'controlled',
      grammarFocus: ['präteritum', 'narrative', 'word-order'],
      instruction:
        'Put the words in order to form a correct Präteritum narrative sentence.',
      prompt:
        'Ordne die Wörter zu einem Satz im Präteritum: "Die Kinder spielten fröhlich im Garten."',
      segments: [
        { id: 'ch30-ex62-seg1', text: 'Die' },
        { id: 'ch30-ex62-seg2', text: 'Kinder' },
        { id: 'ch30-ex62-seg3', text: 'spielten' },
        { id: 'ch30-ex62-seg4', text: 'fröhlich' },
        { id: 'ch30-ex62-seg5', text: 'im' },
        { id: 'ch30-ex62-seg6', text: 'Garten.' },
      ],
      explanation:
        'spielten is the Präteritum of spielen, placed in second position, a typical sentence in a written story.',
    },
    {
      id: 'ch30-ex-63',
      chapterNumber: 30,
      order: 63,
      type: 'sentenceOrdering',
      level: 'production',
      grammarFocus: ['präteritum', 'narrative', 'separable-verb', 'word-order'],
      instruction:
        'Put the words in order to form a correct Präteritum narrative sentence with a separable verb.',
      prompt:
        'Ordne die Wörter zu einem Satz im Präteritum: "Der Zug fuhr pünktlich um acht Uhr ab."',
      segments: [
        { id: 'ch30-ex63-seg1', text: 'Der' },
        { id: 'ch30-ex63-seg2', text: 'Zug' },
        { id: 'ch30-ex63-seg3', text: 'fuhr' },
        { id: 'ch30-ex63-seg4', text: 'pünktlich' },
        { id: 'ch30-ex63-seg5', text: 'um' },
        { id: 'ch30-ex63-seg6', text: 'acht' },
        { id: 'ch30-ex63-seg7', text: 'Uhr' },
        { id: 'ch30-ex63-seg8', text: 'ab.' },
      ],
      explanation:
        'abfahren is separable: fuhr stays in second position while the prefix ab moves to the end of the sentence, as usual in the Präteritum.',
    },
    {
      id: 'ch30-ex-64',
      chapterNumber: 30,
      order: 64,
      type: 'matching',
      level: 'controlled',
      grammarFocus: ['register', 'context-tense'],
      instruction: 'Match each context to the tense pattern that is most natural for it.',
      prompt: 'Ordne jeden Kontext dem passenden Zeitform-Muster zu.',
      pairs: [
        {
          id: 'ch30-ex64-pair1',
          left: 'Ein Telefongespräch mit einem Freund',
          right: 'Perfekt für die meisten Verben, Präteritum für sein/haben/Modalverben',
        },
        {
          id: 'ch30-ex64-pair2',
          left: 'Eine Kurzgeschichte in einem Buch',
          right: 'Präteritum für fast alle Verben',
        },
        {
          id: 'ch30-ex64-pair3',
          left: 'Ein Zeitungsbericht über ein Ereignis',
          right: 'Präteritum als Erzähltempus',
        },
        {
          id: 'ch30-ex64-pair4',
          left: 'sein in einer lockeren Unterhaltung',
          right: 'Präteritum (war), auch im Gespräch',
        },
        {
          id: 'ch30-ex64-pair5',
          left: 'es gibt in der Vergangenheit',
          right: 'es gab, nicht es hat gegeben',
        },
      ],
      explanation:
        'Spoken contexts generally favour the Perfekt except for sein, haben, modals, and es gab, while written narration favours the Präteritum for nearly every verb.',
    },
    {
      id: 'ch30-ex-65',
      chapterNumber: 30,
      order: 65,
      type: 'matching',
      level: 'controlled',
      grammarFocus: ['präteritum', 'sein-haben-modal', 'forms'],
      instruction: 'Match each infinitive to its correct Präteritum form (ich).',
      prompt: 'Ordne jeden Infinitiv der richtigen Präteritum-Form (ich) zu.',
      pairs: [
        { id: 'ch30-ex65-pair1', left: 'sein', right: 'war' },
        { id: 'ch30-ex65-pair2', left: 'haben', right: 'hatte' },
        { id: 'ch30-ex65-pair3', left: 'können', right: 'konnte' },
        { id: 'ch30-ex65-pair4', left: 'müssen', right: 'musste' },
        { id: 'ch30-ex65-pair5', left: 'wollen', right: 'wollte' },
        { id: 'ch30-ex65-pair6', left: 'dürfen', right: 'durfte' },
      ],
      explanation:
        'These are the high-frequency Präteritum forms (ich) of sein, haben, and the modal verbs, all worth knowing actively for speech.',
    },
  ],
};
