import { describe, expect, it } from 'vitest';
import { humanizeTag, selectWeakSpots } from './weakSpots';
import { createHistory } from '../practice/reviewScheduler';
import type { ExerciseHistory } from '../../schemas/progressSchema';

function history(
  exerciseId: string,
  chapterNumber: number,
  grammarFocus: string[],
  timesAnswered: number,
  timesCorrect: number,
): ExerciseHistory {
  return {
    ...createHistory(exerciseId, chapterNumber, grammarFocus),
    timesAnswered,
    timesCorrect,
    timesIncorrect: timesAnswered - timesCorrect,
  };
}

function byId(...entries: ExerciseHistory[]): Record<string, ExerciseHistory> {
  return Object.fromEntries(entries.map((entry) => [entry.exerciseId, entry]));
}

describe('humanizeTag', () => {
  it('turns a kebab-case tag into a readable label', () => {
    expect(humanizeTag('ending-agreement')).toBe('Ending agreement');
    expect(humanizeTag('dative')).toBe('Dative');
  });
});

describe('selectWeakSpots', () => {
  it('is empty without any answered exercises', () => {
    expect(selectWeakSpots({})).toEqual([]);
  });

  it('ranks the least accurate topic first', () => {
    const spots = selectWeakSpots(
      byId(
        history('a', 1, ['dative'], 10, 2),
        history('b', 2, ['accusative'], 10, 9),
        history('c', 3, ['word-order'], 10, 5),
      ),
    );

    expect(spots.map((spot) => spot.tag)).toEqual(['dative', 'word-order', 'accusative']);
    expect(spots[0]).toMatchObject({
      tag: 'dative',
      label: 'Dative',
      answered: 10,
      correct: 2,
      accuracyPercent: 20,
    });
  });

  it('adds up a topic that spans several exercises and chapters', () => {
    const spots = selectWeakSpots(
      byId(
        history('a', 4, ['ending-agreement'], 6, 3),
        history('b', 9, ['ending-agreement'], 4, 1),
      ),
    );

    expect(spots).toHaveLength(1);
    expect(spots[0]).toMatchObject({
      answered: 10,
      correct: 4,
      accuracyPercent: 40,
      chapterNumbers: [4, 9],
    });
  });

  it('counts an exercise towards each of its tags', () => {
    const spots = selectWeakSpots(
      byId(history('a', 1, ['possessive-articles', 'owner-stem'], 8, 4)),
      { minimumAnswers: 5 },
    );

    expect(spots.map((spot) => spot.tag).sort()).toEqual([
      'owner-stem',
      'possessive-articles',
    ]);
  });

  // The tag vocabulary has a long tail, so a topic seen twice must not be
  // allowed to outrank one the learner has genuinely struggled with.
  it('ignores a topic with too little evidence behind it', () => {
    const spots = selectWeakSpots(
      byId(history('a', 1, ['rare-tag'], 2, 0), history('b', 2, ['dative'], 20, 12)),
      { minimumAnswers: 5 },
    );

    expect(spots.map((spot) => spot.tag)).toEqual(['dative']);
  });

  it('skips exercises that have never been answered', () => {
    expect(selectWeakSpots(byId(history('a', 1, ['dative'], 0, 0)))).toEqual([]);
  });

  it('honours a limit', () => {
    const spots = selectWeakSpots(
      byId(
        history('a', 1, ['one'], 10, 1),
        history('b', 2, ['two'], 10, 2),
        history('c', 3, ['three'], 10, 3),
      ),
      { limit: 2 },
    );

    expect(spots.map((spot) => spot.tag)).toEqual(['one', 'two']);
  });

  it('breaks an accuracy tie by how much evidence there is', () => {
    const spots = selectWeakSpots(
      byId(history('a', 1, ['thin'], 6, 3), history('b', 2, ['thick'], 20, 10)),
    );

    expect(spots.map((spot) => spot.tag)).toEqual(['thick', 'thin']);
  });
});
