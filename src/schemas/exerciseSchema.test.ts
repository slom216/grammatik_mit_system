import { describe, expect, it } from 'vitest';
import {
  dragToSlotsExerciseSchema,
  errorSpottingExerciseSchema,
  matchingExerciseSchema,
  sentenceOrderingExerciseSchema,
} from './exerciseSchema';

const base = {
  id: 'ex-1',
  chapterNumber: 1,
  order: 1,
  level: 'controlled' as const,
  grammarFocus: ['test'],
  explanation: 'because.',
};

describe('sentenceOrderingExerciseSchema', () => {
  const valid = {
    ...base,
    type: 'sentenceOrdering' as const,
    prompt: 'Order the words.',
    segments: [
      { id: 's1', text: 'Ich' },
      { id: 's2', text: 'gehe' },
      { id: 's3', text: 'heim' },
    ],
  };

  it('accepts a well-formed exercise', () => {
    expect(sentenceOrderingExerciseSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects fewer than 3 segments', () => {
    const result = sentenceOrderingExerciseSchema.safeParse({
      ...valid,
      segments: valid.segments.slice(0, 2),
    });
    expect(result.success).toBe(false);
  });

  it('rejects duplicate segment ids', () => {
    const result = sentenceOrderingExerciseSchema.safeParse({
      ...valid,
      segments: [...valid.segments, { id: 's1', text: 'nochmal' }],
    });
    expect(result.success).toBe(false);
  });
});

describe('dragToSlotsExerciseSchema', () => {
  const valid = {
    ...base,
    type: 'dragToSlots' as const,
    prompt: 'Fill the gap.',
    templateParts: ['Ich ', ' heute nicht arbeiten.'],
    slots: [{ id: 'slot1', correctWord: 'kann' }],
    wordBank: ['kann', 'können', 'kannst'],
  };

  it('accepts a well-formed exercise', () => {
    expect(dragToSlotsExerciseSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a mismatched templateParts/slots length', () => {
    const result = dragToSlotsExerciseSchema.safeParse({
      ...valid,
      templateParts: ['Ich ', ' heute ', ' nicht arbeiten.'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects a word bank missing a slot correct word', () => {
    const result = dragToSlotsExerciseSchema.safeParse({
      ...valid,
      wordBank: ['können', 'kannst'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects a word bank with no distractor', () => {
    const result = dragToSlotsExerciseSchema.safeParse({
      ...valid,
      wordBank: ['kann'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects duplicate slot ids', () => {
    const result = dragToSlotsExerciseSchema.safeParse({
      ...valid,
      templateParts: ['Ich ', ' heute ', ' arbeiten.'],
      slots: [
        { id: 'slot1', correctWord: 'kann' },
        { id: 'slot1', correctWord: 'kannst' },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe('matchingExerciseSchema', () => {
  const valid = {
    ...base,
    type: 'matching' as const,
    prompt: 'Match the pairs.',
    pairs: [
      { id: 'p1', left: 'ich', right: 'mein' },
      { id: 'p2', left: 'du', right: 'dein' },
      { id: 'p3', left: 'er', right: 'sein' },
    ],
  };

  it('accepts a well-formed exercise', () => {
    expect(matchingExerciseSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects fewer than 3 pairs', () => {
    const result = matchingExerciseSchema.safeParse({
      ...valid,
      pairs: valid.pairs.slice(0, 2),
    });
    expect(result.success).toBe(false);
  });

  it('rejects duplicate left-column text', () => {
    const result = matchingExerciseSchema.safeParse({
      ...valid,
      pairs: [...valid.pairs.slice(0, 2), { id: 'p3', left: 'ich', right: 'sein' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects duplicate right-column text', () => {
    const result = matchingExerciseSchema.safeParse({
      ...valid,
      pairs: [...valid.pairs.slice(0, 2), { id: 'p3', left: 'er', right: 'mein' }],
    });
    expect(result.success).toBe(false);
  });
});

describe('errorSpottingExerciseSchema', () => {
  const valid = {
    ...base,
    type: 'errorSpotting' as const,
    prompt: 'Click the wrong word.',
    tokens: ['Ihr', 'sind', 'sehr', 'freundlich.'],
    errorTokenIndex: 1,
    correction: 'seid',
  };

  it('accepts a well-formed exercise', () => {
    expect(errorSpottingExerciseSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects fewer than 4 tokens', () => {
    const result = errorSpottingExerciseSchema.safeParse({
      ...valid,
      tokens: ['Ihr', 'sind', 'da.'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects an out-of-bounds errorTokenIndex', () => {
    const result = errorSpottingExerciseSchema.safeParse({
      ...valid,
      errorTokenIndex: 10,
    });
    expect(result.success).toBe(false);
  });

  it('rejects a correction identical to the erroneous token', () => {
    const result = errorSpottingExerciseSchema.safeParse({
      ...valid,
      correction: 'sind',
    });
    expect(result.success).toBe(false);
  });
});
