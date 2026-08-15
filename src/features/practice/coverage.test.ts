import { describe, expect, it } from 'vitest';
import { uncoveredFirst } from './coverage';
import { makeChapter, makeSingleChoice } from '../../test/fixtures/chapterFixture';

/** Six exercises, authored in order 1..6. */
const chapter = makeChapter({
  exercises: Array.from({ length: 6 }, (_unused, index) =>
    makeSingleChoice(index + 1, { id: `ch1-ex-${index + 1}` }),
  ),
});

const ALL = ['ch1-ex-1', 'ch1-ex-2', 'ch1-ex-3', 'ch1-ex-4', 'ch1-ex-5', 'ch1-ex-6'];

describe('uncoveredFirst', () => {
  it('is the authored order when nothing has been covered', () => {
    expect(uncoveredFirst(chapter, new Set())).toEqual(ALL);
  });

  it('leads with the uncovered exercises, each half in authored order', () => {
    const covered = new Set(['ch1-ex-1', 'ch1-ex-2', 'ch1-ex-5']);
    expect(uncoveredFirst(chapter, covered)).toEqual([
      'ch1-ex-3',
      'ch1-ex-4',
      'ch1-ex-6',
      'ch1-ex-1',
      'ch1-ex-2',
      'ch1-ex-5',
    ]);
  });

  it('still returns the whole pool once everything is covered', () => {
    expect(uncoveredFirst(chapter, new Set(ALL))).toEqual(ALL);
  });
});
