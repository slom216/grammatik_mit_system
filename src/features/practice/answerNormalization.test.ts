import { describe, expect, it } from 'vitest';
import {
  checkDragToSlotsAnswer,
  checkErrorSpottingAnswer,
  checkMatchingAnswer,
  checkSentenceOrderingAnswer,
  checkSingleChoiceAnswer,
  checkTextAnswer,
  correctDragToSlotsText,
  correctErrorSpottingText,
  promptListsSegments,
  requiresCorrectionInput,
  correctMatchingText,
  correctSentenceOrderingText,
  dragToSlotsAnswerText,
  errorSpottingAnswerText,
  matchingAnswerText,
  normalizeBasic,
  normalizeForMode,
  primaryAcceptedAnswer,
  sentenceOrderingAnswerText,
  tokenize,
} from './answerNormalization';
import type {
  DragToSlotsExercise,
  ErrorSpottingExercise,
  MatchingExercise,
  SentenceOrderingExercise,
  SingleChoiceExercise,
  TextInputExercise,
} from '../../schemas/exerciseSchema';

function textExercise(overrides: Partial<TextInputExercise> = {}): TextInputExercise {
  return {
    id: 'test-text-1',
    chapterNumber: 0,
    order: 1,
    type: 'textInput',
    prompt: 'Wir ___ im Kino.',
    level: 'controlled',
    grammarFocus: ['sein'],
    explanation: 'wir takes sind.',
    acceptedAnswers: ['Wir sind im Kino.'],
    answerMode: 'normalized',
    ...overrides,
  };
}

function choiceExercise(): SingleChoiceExercise {
  return {
    id: 'test-choice-1',
    chapterNumber: 0,
    order: 2,
    type: 'singleChoice',
    prompt: 'Ihr ___ pünktlich.',
    level: 'recognition',
    grammarFocus: ['sein'],
    explanation: 'ihr takes seid.',
    options: [
      { id: 'a', text: 'seid' },
      { id: 'b', text: 'seit' },
      { id: 'c', text: 'sind' },
    ],
    correctOptionId: 'a',
  };
}

describe('normalizeBasic', () => {
  it('collapses repeated whitespace and trims', () => {
    expect(normalizeBasic('  Wir   sind    im Kino. ')).toBe('Wir sind im Kino.');
  });

  it('normalizes typographic quotation marks and apostrophes', () => {
    expect(normalizeBasic('„Guten Tag“')).toBe('"Guten Tag"');
    expect(normalizeBasic('Wie geht’s')).toBe("Wie geht's");
  });

  it('keeps capitalisation, umlauts and eszett intact', () => {
    expect(normalizeBasic('Ihr seid spät, Straße')).toBe('Ihr seid spät, Straße');
  });

  it('composes decomposed umlauts to NFC', () => {
    const decomposed = 'spät';
    expect(normalizeBasic(decomposed)).toBe('spät');
  });
});

describe('normalizeForMode', () => {
  it('exact only trims', () => {
    expect(normalizeForMode('  Das  Auto ', 'exact')).toBe('Das  Auto');
  });

  it('normalized keeps case and punctuation', () => {
    expect(normalizeForMode('Das  Auto ist neu.', 'normalized')).toBe(
      'Das Auto ist neu.',
    );
  });

  it('caseInsensitive lowercases with German rules', () => {
    expect(normalizeForMode('BIN', 'caseInsensitive')).toBe('bin');
    expect(normalizeForMode('Ärztin', 'caseInsensitive')).toBe('ärztin');
  });

  it('punctuationInsensitive removes punctuation but keeps case', () => {
    expect(normalizeForMode('Ja, wir sind da!', 'punctuationInsensitive')).toBe(
      'Ja wir sind da',
    );
  });
});

describe('tokenize', () => {
  it('splits on whitespace and punctuation and lowercases', () => {
    expect(tokenize('Ja, wir sind aus Deutschland.')).toEqual([
      'ja',
      'wir',
      'sind',
      'aus',
      'deutschland',
    ]);
  });
});

describe('checkTextAnswer', () => {
  it('accepts the exact expected answer', () => {
    const result = checkTextAnswer(textExercise(), 'Wir sind im Kino.');
    expect(result.correct).toBe(true);
    expect(result.matchedAnswer).toBe('Wir sind im Kino.');
  });

  it('accepts a declarative sentence missing its final full stop', () => {
    const result = checkTextAnswer(textExercise(), 'Wir sind im Kino');
    expect(result.correct).toBe(true);
    expect(result.matchedAnswer).toBe('Wir sind im Kino.');
  });

  it('accepts a declarative sentence with an extra final full stop', () => {
    const exercise = textExercise({ acceptedAnswers: ['Wir sind im Kino'] });
    expect(checkTextAnswer(exercise, 'Wir sind im Kino.').correct).toBe(true);
  });

  it('still requires the question mark on a question', () => {
    const exercise = textExercise({ acceptedAnswers: ['Sind Sie Lehrer?'] });
    expect(checkTextAnswer(exercise, 'Sind Sie Lehrer?').correct).toBe(true);
    expect(checkTextAnswer(exercise, 'Sind Sie Lehrer').correct).toBe(false);
  });

  it('does not forgive a missing full stop in exact mode', () => {
    const exercise = textExercise({ answerMode: 'exact' });
    expect(checkTextAnswer(exercise, 'Wir sind im Kino').correct).toBe(false);
  });

  it('rejects a wrong capitalisation in normalized mode and explains why', () => {
    const result = checkTextAnswer(textExercise(), 'wir sind im kino.');
    expect(result.correct).toBe(false);
    expect(result.capitalisationOnlyMismatch).toBe(true);
  });

  it('accepts any capitalisation in caseInsensitive mode', () => {
    const exercise = textExercise({
      acceptedAnswers: ['bin'],
      answerMode: 'caseInsensitive',
    });
    expect(checkTextAnswer(exercise, 'Bin').correct).toBe(true);
    expect(checkTextAnswer(exercise, ' bin ').correct).toBe(true);
    expect(checkTextAnswer(exercise, 'bist').correct).toBe(false);
  });

  it('ignores punctuation in punctuationInsensitive mode', () => {
    const exercise = textExercise({
      acceptedAnswers: ['Ja, wir sind aus Deutschland.'],
      answerMode: 'punctuationInsensitive',
    });
    expect(checkTextAnswer(exercise, 'Ja wir sind aus Deutschland').correct).toBe(true);
  });

  it('accepts several spelling variants', () => {
    const exercise = textExercise({
      acceptedAnswers: ['Wir sind im Kino.', 'Wir sind heute im Kino.'],
    });
    expect(checkTextAnswer(exercise, 'Wir sind heute im Kino.').correct).toBe(true);
  });

  it('requires every required token', () => {
    const exercise = textExercise({
      acceptedAnswers: ['Ja, wir sind aus Deutschland.'],
      answerMode: 'punctuationInsensitive',
      requiredTokens: ['wir', 'sind'],
    });
    const missing = checkTextAnswer(exercise, 'Ja, ich bin aus Deutschland.');
    expect(missing.correct).toBe(false);
    expect(missing.missingTokens).toEqual(['wir', 'sind']);
  });

  it('does not accept an empty answer', () => {
    expect(checkTextAnswer(textExercise(), '   ').correct).toBe(false);
  });

  it('accepts umlauts typed with the helper', () => {
    const exercise = textExercise({ acceptedAnswers: ['Ihr seid spät.'] });
    expect(checkTextAnswer(exercise, 'Ihr seid spät.').correct).toBe(true);
    expect(checkTextAnswer(exercise, 'Ihr seid spaet.').correct).toBe(false);
  });
});

describe('checkSingleChoiceAnswer', () => {
  it('accepts only the correct option id', () => {
    const exercise = choiceExercise();
    expect(checkSingleChoiceAnswer(exercise, 'a')).toBe(true);
    expect(checkSingleChoiceAnswer(exercise, 'b')).toBe(false);
    expect(checkSingleChoiceAnswer(exercise, null)).toBe(false);
  });
});

describe('primaryAcceptedAnswer', () => {
  it('returns the first accepted answer for the reveal feature', () => {
    expect(primaryAcceptedAnswer(textExercise())).toBe('Wir sind im Kino.');
  });
});

function sentenceOrderingExercise(): SentenceOrderingExercise {
  return {
    id: 'test-ordering-1',
    chapterNumber: 0,
    order: 3,
    type: 'sentenceOrdering',
    prompt: 'Bring the words into the correct order.',
    level: 'production',
    grammarFocus: ['word order'],
    explanation: 'The verb comes second.',
    segments: [
      { id: 's1', text: 'Ich' },
      { id: 's2', text: 'gehe' },
      { id: 's3', text: 'heute' },
      { id: 's4', text: 'ins Kino' },
    ],
  };
}

describe('checkSentenceOrderingAnswer', () => {
  const exercise = sentenceOrderingExercise();

  it('accepts the segments in their authored order', () => {
    expect(checkSentenceOrderingAnswer(exercise, ['s1', 's2', 's3', 's4'])).toBe(true);
  });

  it('rejects any other order', () => {
    expect(checkSentenceOrderingAnswer(exercise, ['s1', 's3', 's2', 's4'])).toBe(false);
  });

  it('rejects an incomplete order', () => {
    expect(checkSentenceOrderingAnswer(exercise, ['s1', 's2'])).toBe(false);
  });
});

describe('sentenceOrdering answer text', () => {
  const exercise = sentenceOrderingExercise();

  it('joins the submitted segments in the order given', () => {
    expect(sentenceOrderingAnswerText(exercise, ['s3', 's1'])).toBe('heute Ich');
  });

  it('renders the correct sentence', () => {
    expect(correctSentenceOrderingText(exercise)).toBe('Ich gehe heute ins Kino');
  });
});

function dragToSlotsExercise(): DragToSlotsExercise {
  return {
    id: 'test-slots-1',
    chapterNumber: 0,
    order: 4,
    type: 'dragToSlots',
    prompt: 'Fill in the modal verb.',
    level: 'controlled',
    grammarFocus: ['modal verbs'],
    explanation: 'ich takes kann.',
    templateParts: ['Ich ', ' heute nicht arbeiten.'],
    slots: [{ id: 'slot1', correctWord: 'kann' }],
    wordBank: ['kann', 'können', 'kannst'],
  };
}

describe('checkDragToSlotsAnswer', () => {
  const exercise = dragToSlotsExercise();

  it('accepts the correct word in every slot', () => {
    expect(checkDragToSlotsAnswer(exercise, { slot1: 'kann' })).toBe(true);
  });

  it('rejects a distractor', () => {
    expect(checkDragToSlotsAnswer(exercise, { slot1: 'können' })).toBe(false);
  });

  it('rejects a missing slot', () => {
    expect(checkDragToSlotsAnswer(exercise, {})).toBe(false);
  });
});

describe('dragToSlots answer text', () => {
  const exercise = dragToSlotsExercise();

  it('assembles the sentence around the placed words', () => {
    expect(dragToSlotsAnswerText(exercise, { slot1: 'kannst' })).toBe(
      'Ich kannst heute nicht arbeiten.',
    );
  });

  it('shows a placeholder for an empty slot', () => {
    expect(dragToSlotsAnswerText(exercise, {})).toBe('Ich ___ heute nicht arbeiten.');
  });

  it('renders the correct sentence', () => {
    expect(correctDragToSlotsText(exercise)).toBe('Ich kann heute nicht arbeiten.');
  });
});

function matchingExercise(): MatchingExercise {
  return {
    id: 'test-matching-1',
    chapterNumber: 0,
    order: 5,
    type: 'matching',
    prompt: 'Match the pronoun to its possessive.',
    level: 'recognition',
    grammarFocus: ['possessives'],
    explanation: 'Each pronoun has one matching possessive.',
    pairs: [
      { id: 'p1', left: 'ich', right: 'mein' },
      { id: 'p2', left: 'du', right: 'dein' },
      { id: 'p3', left: 'er', right: 'sein' },
    ],
  };
}

describe('checkMatchingAnswer', () => {
  const exercise = matchingExercise();

  it('accepts every left item matched to its own pair id', () => {
    expect(checkMatchingAnswer(exercise, { p1: 'p1', p2: 'p2', p3: 'p3' })).toBe(true);
  });

  it('rejects a swapped pairing', () => {
    expect(checkMatchingAnswer(exercise, { p1: 'p2', p2: 'p1', p3: 'p3' })).toBe(false);
  });

  it('rejects an incomplete set of pairings', () => {
    expect(checkMatchingAnswer(exercise, { p1: 'p1' })).toBe(false);
  });
});

describe('matching answer text', () => {
  const exercise = matchingExercise();

  it('renders the submitted pairing', () => {
    expect(matchingAnswerText(exercise, { p1: 'p2' })).toBe('ich → dein, du → ?, er → ?');
  });

  it('renders the correct pairing', () => {
    expect(correctMatchingText(exercise)).toBe('ich → mein, du → dein, er → sein');
  });
});

function errorSpottingExercise(): ErrorSpottingExercise {
  return {
    id: 'test-errorspotting-1',
    chapterNumber: 0,
    order: 6,
    type: 'errorSpotting',
    prompt: 'Click the word that is wrong.',
    level: 'controlled',
    grammarFocus: ['verb conjugation'],
    explanation: 'ihr takes seid, not sind.',
    tokens: ['Ihr', 'sind', 'sehr', 'freundlich.'],
    errorTokenIndex: 1,
    correction: 'seid',
  };
}

describe('promptListsSegments', () => {
  const exercise = (prompt: string): SentenceOrderingExercise => ({
    id: 'test-ordering-1',
    chapterNumber: 0,
    order: 1,
    type: 'sentenceOrdering',
    prompt,
    level: 'transfer',
    grammarFocus: ['word order'],
    explanation: 'The verb comes second.',
    segments: [
      { id: 's1', text: 'Ich' },
      { id: 's2', text: 'bin' },
      { id: 's3', text: 'sehr' },
      { id: 's4', text: 'müde.' },
    ],
  });

  it('spots a slash-separated word list, which is the answer in order', () => {
    expect(promptListsSegments(exercise('Ich / bin / sehr / müde.'))).toBe(true);
  });

  it('spots one behind an instruction, or with other separators', () => {
    expect(
      promptListsSegments(exercise('Order the words: Ich / bin / sehr / müde.')),
    ).toBe(true);
    expect(promptListsSegments(exercise('müde – Ich – sehr – bin'))).toBe(true);
    expect(promptListsSegments(exercise('Ich bin sehr müde.'))).toBe(true);
  });

  it('keeps a prompt that frames the task in its own words', () => {
    expect(promptListsSegments(exercise('Build a sentence: I am very tired.'))).toBe(
      false,
    );
  });

  it('keeps a prompt that lists only some of the words', () => {
    expect(promptListsSegments(exercise('Start from: Ich bin …'))).toBe(false);
  });
});

/** A correction that rewrites the whole sentence rather than swapping a token. */
function rewriteErrorSpottingExercise(): ErrorSpottingExercise {
  return {
    ...errorSpottingExercise(),
    id: 'test-errorspotting-2',
    correction: 'Ihr seid sehr freundlich.',
  };
}

describe('checkErrorSpottingAnswer', () => {
  const exercise = errorSpottingExercise();

  it('accepts the erroneous token index with the right correction', () => {
    expect(checkErrorSpottingAnswer(exercise, 1, 'seid')).toBe(true);
  });

  it('rejects any other index', () => {
    expect(checkErrorSpottingAnswer(exercise, 0, 'seid')).toBe(false);
  });

  it('rejects the right token with the wrong correction', () => {
    expect(checkErrorSpottingAnswer(exercise, 1, 'bist')).toBe(false);
  });

  it('forgives punctuation and surrounding space in the correction', () => {
    expect(checkErrorSpottingAnswer(exercise, 1, ' seid. ')).toBe(true);
  });

  it('still holds capitalisation against the learner', () => {
    expect(checkErrorSpottingAnswer(exercise, 1, 'Seid')).toBe(false);
  });

  it('asks for no correction when the fix is a whole-sentence rewrite', () => {
    const rewrite = rewriteErrorSpottingExercise();
    expect(requiresCorrectionInput(rewrite)).toBe(false);
    expect(checkErrorSpottingAnswer(rewrite, 1, '')).toBe(true);
  });
});

describe('errorSpotting answer text', () => {
  const exercise = errorSpottingExercise();

  it('pairs the token the learner clicked with the correction they typed', () => {
    expect(errorSpottingAnswerText(exercise, 2, 'sehr')).toBe('sehr → sehr');
  });

  it('returns the token alone when no correction was asked for', () => {
    expect(errorSpottingAnswerText(rewriteErrorSpottingExercise(), 2, '')).toBe('sehr');
  });

  it('renders the error and its correction', () => {
    expect(correctErrorSpottingText(exercise)).toBe('sind → seid');
  });
});
