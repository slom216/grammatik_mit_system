import { describe, expect, it } from 'vitest';
import {
  chapterPath,
  exerciseCounts,
  findExercise,
  findExerciseAcrossChapters,
  formatChapterNumber,
  matchingRightOrderFor,
  optionOrderFor,
  segmentOrderFor,
  shuffle,
  sortedExercises,
  wordBankOrderFor,
} from './chapterUtils';
import { demoChapter } from '../../content/chapters/chapter-000-demo';
import { makeChapter, makeSingleChoice } from '../../test/fixtures/chapterFixture';
import type {
  DragToSlotsExercise,
  MatchingExercise,
  SentenceOrderingExercise,
} from '../../schemas/exerciseSchema';

/** Deterministic pseudo-random source so shuffling can be asserted. */
function sequenceRandom(values: number[]): () => number {
  let index = 0;
  return () => values[index++ % values.length] ?? 0;
}

describe('formatChapterNumber', () => {
  it('pads to two digits', () => {
    expect(formatChapterNumber(1)).toBe('01');
    expect(formatChapterNumber(85)).toBe('85');
  });
});

describe('chapterPath', () => {
  it('builds chapter routes', () => {
    expect(chapterPath(7)).toBe('/chapter/7');
    expect(chapterPath(7, 'practice')).toBe('/chapter/7/practice');
  });
});

describe('shuffle', () => {
  it('keeps every item exactly once', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];
    const result = shuffle(items, sequenceRandom([0.1, 0.9, 0.4, 0.7]));
    expect([...result].sort()).toEqual([...items].sort());
  });

  it('does not modify the input array', () => {
    const items = ['a', 'b', 'c'];
    shuffle(items, sequenceRandom([0.5]));
    expect(items).toEqual(['a', 'b', 'c']);
  });

  it('is deterministic for a given random source', () => {
    const first = shuffle([1, 2, 3, 4], sequenceRandom([0.2, 0.8, 0.5]));
    const second = shuffle([1, 2, 3, 4], sequenceRandom([0.2, 0.8, 0.5]));
    expect(first).toEqual(second);
  });

  it('actually changes the order for a non-identity source', () => {
    expect(shuffle([1, 2, 3, 4], sequenceRandom([0, 0, 0]))).not.toEqual([1, 2, 3, 4]);
  });
});

describe('optionOrderFor', () => {
  const exercise = makeSingleChoice(1);

  it('keeps the authored order when shuffling is off', () => {
    expect(optionOrderFor(exercise, false)).toEqual(['a', 'b', 'c']);
  });

  it('returns all option ids when shuffling is on', () => {
    const order = optionOrderFor(exercise, true, sequenceRandom([0.7, 0.2]));
    expect([...order].sort()).toEqual(['a', 'b', 'c']);
  });
});

function sentenceOrderingFixture(): SentenceOrderingExercise {
  return {
    id: 'fixture-ordering-1',
    chapterNumber: 1,
    order: 1,
    type: 'sentenceOrdering',
    prompt: 'Order the words.',
    level: 'production',
    grammarFocus: ['word order'],
    explanation: 'The verb comes second.',
    segments: [
      { id: 's1', text: 'Ich' },
      { id: 's2', text: 'gehe' },
      { id: 's3', text: 'heim' },
    ],
  };
}

function dragToSlotsFixture(): DragToSlotsExercise {
  return {
    id: 'fixture-slots-1',
    chapterNumber: 1,
    order: 1,
    type: 'dragToSlots',
    prompt: 'Fill the gap.',
    level: 'controlled',
    grammarFocus: ['modal verbs'],
    explanation: 'ich takes kann.',
    templateParts: ['Ich ', ' schwimmen.'],
    slots: [{ id: 'slot1', correctWord: 'kann' }],
    wordBank: ['kann', 'können', 'kannst'],
  };
}

function matchingFixture(): MatchingExercise {
  return {
    id: 'fixture-matching-1',
    chapterNumber: 1,
    order: 1,
    type: 'matching',
    prompt: 'Match the pairs.',
    level: 'recognition',
    grammarFocus: ['possessives'],
    explanation: 'Each pronoun has one possessive.',
    pairs: [
      { id: 'p1', left: 'ich', right: 'mein' },
      { id: 'p2', left: 'du', right: 'dein' },
      { id: 'p3', left: 'er', right: 'sein' },
    ],
  };
}

describe('segmentOrderFor', () => {
  const exercise = sentenceOrderingFixture();

  it('keeps the authored order when shuffling is off', () => {
    expect(segmentOrderFor(exercise, false)).toEqual(['s1', 's2', 's3']);
  });

  it('returns all segment ids when shuffling is on', () => {
    const order = segmentOrderFor(exercise, true, sequenceRandom([0.7, 0.2]));
    expect([...order].sort()).toEqual(['s1', 's2', 's3']);
  });
});

describe('wordBankOrderFor', () => {
  const exercise = dragToSlotsFixture();

  it('keeps the authored order when shuffling is off', () => {
    expect(wordBankOrderFor(exercise, false)).toEqual([0, 1, 2]);
  });

  it('returns all word-bank indices when shuffling is on', () => {
    const order = wordBankOrderFor(exercise, true, sequenceRandom([0.7, 0.2]));
    expect([...order].sort()).toEqual([0, 1, 2]);
  });
});

describe('matchingRightOrderFor', () => {
  const exercise = matchingFixture();

  it('keeps the authored order when shuffling is off', () => {
    expect(matchingRightOrderFor(exercise, false)).toEqual(['p1', 'p2', 'p3']);
  });

  it('returns all pair ids when shuffling is on', () => {
    const order = matchingRightOrderFor(exercise, true, sequenceRandom([0.7, 0.2]));
    expect([...order].sort()).toEqual(['p1', 'p2', 'p3']);
  });
});

describe('sortedExercises', () => {
  it('sorts by the authored order value', () => {
    const chapter = makeChapter();
    const shuffled = makeChapter({ exercises: [...chapter.exercises].reverse() });
    expect(sortedExercises(shuffled).map((exercise) => exercise.order)).toEqual(
      chapter.exercises.map((exercise) => exercise.order),
    );
  });
});

describe('findExercise and exerciseCounts', () => {
  it('finds an exercise by id', () => {
    expect(findExercise(demoChapter, 'demo-ex-01')?.order).toBe(1);
    expect(findExercise(demoChapter, 'nope')).toBeUndefined();
  });

  it('counts exercises by type', () => {
    expect(exerciseCounts(demoChapter)).toEqual({
      total: 24,
      singleChoice: 12,
      textInput: 12,
      sentenceOrdering: 0,
      dragToSlots: 0,
      matching: 0,
      errorSpotting: 0,
    });
  });
});

describe('findExerciseAcrossChapters', () => {
  it('finds an exercise in whichever chapter has it', () => {
    const other = makeChapter({ number: 2, exercises: [] });
    expect(findExerciseAcrossChapters([other, demoChapter], 'demo-ex-01')?.order).toBe(1);
  });

  it('returns undefined when no chapter has the exercise', () => {
    expect(findExerciseAcrossChapters([demoChapter], 'nope')).toBeUndefined();
  });
});
