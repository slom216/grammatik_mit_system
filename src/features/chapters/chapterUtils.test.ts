import { describe, expect, it } from 'vitest';
import {
  chapterPath,
  exerciseCounts,
  findExercise,
  findExerciseAcrossChapters,
  formatChapterNumber,
  optionOrderFor,
  shuffle,
  sortedExercises,
} from './chapterUtils';
import { demoChapter } from '../../content/chapters/chapter-000-demo';
import { makeChapter, makeSingleChoice } from '../../test/fixtures/chapterFixture';

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
