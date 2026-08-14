import { describe, expect, it } from 'vitest';
import { buildCumulativeExerciseIds } from './cumulativeSession';
import type { ChapterDefinition } from '../../schemas/chapterSchema';
import type { ExerciseHistory } from '../../schemas/progressSchema';
import {
  makeChapter,
  makeSingleChoice,
  makeTextInput,
} from '../../test/fixtures/chapterFixture';

/** Deterministic pseudo-random source so shuffling can be asserted. */
function sequenceRandom(values: number[]): () => number {
  let index = 0;
  return () => values[index++ % values.length] ?? 0;
}

function makeNumberedChapter(number: number): ChapterDefinition {
  const exercises = [
    ...Array.from({ length: 12 }, (_unused, index) =>
      makeSingleChoice(index + 1, {
        id: `ch${number}-ex-${index + 1}`,
        chapterNumber: number,
      }),
    ),
    ...Array.from({ length: 12 }, (_unused, index) =>
      makeTextInput(index + 13, {
        id: `ch${number}-ex-${index + 13}`,
        chapterNumber: number,
      }),
    ),
  ];
  return makeChapter({ number, exercises });
}

describe('buildCumulativeExerciseIds', () => {
  const chapterA = makeNumberedChapter(21);
  const chapterB = makeNumberedChapter(22);

  it('samples the requested number of exercises from every chapter when nothing is due', () => {
    const ids = buildCumulativeExerciseIds(
      [chapterA, chapterB],
      {},
      new Date('2026-01-01'),
      2,
      sequenceRandom([0.1, 0.4, 0.7, 0.9, 0.2, 0.6]),
    );

    expect(ids).toHaveLength(4);
    expect(new Set(ids).size).toBe(4);
    expect(ids.some((id) => id.startsWith('ch21-'))).toBe(true);
    expect(ids.some((id) => id.startsWith('ch22-'))).toBe(true);
  });

  it('always includes exercises currently due for review, on top of the sample', () => {
    const dueHistory: ExerciseHistory = {
      exerciseId: 'ch21-ex-1',
      chapterNumber: 21,
      grammarFocus: [],
      hasBeenWrong: true,
      timesAnswered: 1,
      timesCorrect: 0,
      timesIncorrect: 1,
      consecutiveCorrect: 0,
      stage: 'learning',
      dueAt: '2025-01-01T00:00:00.000Z',
    };

    const ids = buildCumulativeExerciseIds(
      [chapterA, chapterB],
      { [dueHistory.exerciseId]: dueHistory },
      new Date('2026-01-01'),
      0,
      sequenceRandom([0.5]),
    );

    expect(ids).toEqual(['ch21-ex-1']);
  });

  it('does not include an exercise from a history outside the given chapters', () => {
    const outsideHistory: ExerciseHistory = {
      exerciseId: 'ch99-ex-1',
      chapterNumber: 99,
      grammarFocus: [],
      hasBeenWrong: true,
      timesAnswered: 1,
      timesCorrect: 0,
      timesIncorrect: 1,
      consecutiveCorrect: 0,
      stage: 'learning',
      dueAt: '2025-01-01T00:00:00.000Z',
    };

    const ids = buildCumulativeExerciseIds(
      [chapterA, chapterB],
      { [outsideHistory.exerciseId]: outsideHistory },
      new Date('2026-01-01'),
      0,
      sequenceRandom([0.5]),
    );

    expect(ids).toEqual([]);
  });
});
