import { describe, expect, it } from 'vitest';
import {
  checkSingleChoiceAnswer,
  checkTextAnswer,
  normalizeBasic,
  normalizeForMode,
  primaryAcceptedAnswer,
  tokenize,
} from './answerNormalization';
import type {
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
