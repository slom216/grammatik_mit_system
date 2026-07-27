import { describe, expect, it } from 'vitest';
import {
  addDays,
  countOpenReviewFlags,
  createHistory,
  isDue,
  isPending,
  scheduleNextReview,
  selectDueExercises,
} from './reviewScheduler';
import type { ExerciseHistory } from '../../schemas/progressSchema';

const now = new Date('2026-03-01T10:00:00.000Z');

function daysBetween(from: Date, iso: string | undefined): number {
  if (!iso) return Number.NaN;
  return Math.round((new Date(iso).getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
}

describe('scheduleNextReview', () => {
  it('does not schedule an exercise that was correct on the first try', () => {
    const history = scheduleNextReview({
      exerciseId: 'e1',
      chapterNumber: 1,
      outcome: 'correctFirstAttempt',
      now,
    });
    expect(history.dueAt).toBeUndefined();
    expect(history.stage).toBe('stable');
    expect(history.timesCorrect).toBe(1);
  });

  it('queues an exercise that needed a second attempt', () => {
    const history = scheduleNextReview({
      exerciseId: 'e1',
      chapterNumber: 1,
      outcome: 'correctSecondAttempt',
      now,
    });
    expect(daysBetween(now, history.dueAt)).toBe(3);
    expect(history.stage).toBe('review1');
  });

  it('schedules a wrong answer for the next day', () => {
    const history = scheduleNextReview({
      exerciseId: 'e1',
      chapterNumber: 1,
      outcome: 'incorrect',
      now,
    });
    expect(daysBetween(now, history.dueAt)).toBe(1);
    expect(history.stage).toBe('learning');
    expect(history.timesIncorrect).toBe(1);
  });

  it('keeps a one-day interval while the answer stays wrong', () => {
    const first = scheduleNextReview({
      exerciseId: 'e1',
      chapterNumber: 1,
      outcome: 'incorrect',
      now,
    });
    const second = scheduleNextReview({
      exerciseId: 'e1',
      chapterNumber: 1,
      outcome: 'incorrect',
      now,
      previous: first,
    });
    expect(daysBetween(now, second.dueAt)).toBe(1);
    expect(second.timesIncorrect).toBe(2);
    expect(second.consecutiveCorrect).toBe(0);
  });

  it('walks through 3 days, 7 days and then becomes stable', () => {
    let history = scheduleNextReview({
      exerciseId: 'e1',
      chapterNumber: 1,
      outcome: 'incorrect',
      now,
    });

    history = scheduleNextReview({
      exerciseId: 'e1',
      chapterNumber: 1,
      outcome: 'correctFirstAttempt',
      now,
      previous: history,
    });
    expect(daysBetween(now, history.dueAt)).toBe(3);
    expect(history.stage).toBe('review1');

    history = scheduleNextReview({
      exerciseId: 'e1',
      chapterNumber: 1,
      outcome: 'correctSecondAttempt',
      now,
      previous: history,
    });
    expect(daysBetween(now, history.dueAt)).toBe(7);
    expect(history.stage).toBe('review2');

    history = scheduleNextReview({
      exerciseId: 'e1',
      chapterNumber: 1,
      outcome: 'correctFirstAttempt',
      now,
      previous: history,
    });
    expect(history.dueAt).toBeUndefined();
    expect(history.stage).toBe('stable');
  });

  it('sends a revealed answer back into the queue', () => {
    const history = scheduleNextReview({
      exerciseId: 'e1',
      chapterNumber: 1,
      outcome: 'revealed',
      now,
    });
    expect(daysBetween(now, history.dueAt)).toBe(1);
    expect(history.consecutiveCorrect).toBe(0);
  });

  it('resets the streak after a relapse', () => {
    let history = scheduleNextReview({
      exerciseId: 'e1',
      chapterNumber: 1,
      outcome: 'incorrect',
      now,
    });
    history = scheduleNextReview({
      exerciseId: 'e1',
      chapterNumber: 1,
      outcome: 'correctFirstAttempt',
      now,
      previous: history,
    });
    history = scheduleNextReview({
      exerciseId: 'e1',
      chapterNumber: 1,
      outcome: 'incorrect',
      now,
      previous: history,
    });
    expect(history.consecutiveCorrect).toBe(0);
    expect(daysBetween(now, history.dueAt)).toBe(1);
  });
});

describe('isDue', () => {
  it('is due once the date has passed', () => {
    const history: ExerciseHistory = {
      ...createHistory('e1', 1),
      dueAt: addDays(now, -1).toISOString(),
    };
    expect(isDue(history, now)).toBe(true);
    expect(isPending(history, now)).toBe(false);
  });

  it('is pending while the date lies in the future', () => {
    const history: ExerciseHistory = {
      ...createHistory('e1', 1),
      dueAt: addDays(now, 2).toISOString(),
    };
    expect(isDue(history, now)).toBe(false);
    expect(isPending(history, now)).toBe(true);
  });

  it('is never due without a date', () => {
    expect(isDue(createHistory('e1', 1), now)).toBe(false);
  });
});

describe('selectDueExercises', () => {
  const due = (
    id: string,
    chapterNumber: number,
    offsetDays: number,
  ): ExerciseHistory => ({
    ...createHistory(id, chapterNumber),
    dueAt: addDays(now, offsetDays).toISOString(),
  });

  it('mixes chapters instead of replaying one chapter', () => {
    const histories = [
      due('c1-a', 1, -3),
      due('c1-b', 1, -3),
      due('c1-c', 1, -3),
      due('c2-a', 2, -2),
      due('c2-b', 2, -2),
    ];

    const selected = selectDueExercises(histories, now);
    expect(selected.map((history) => history.chapterNumber)).toEqual([1, 2, 1, 2, 1]);
  });

  it('excludes exercises that are not due yet and respects the limit', () => {
    const histories = [due('a', 1, -1), due('b', 1, 5), due('c', 2, -1)];
    expect(selectDueExercises(histories, now).map((h) => h.exerciseId)).toEqual([
      'a',
      'c',
    ]);
    expect(selectDueExercises(histories, now, 1)).toHaveLength(1);
  });
});

describe('countOpenReviewFlags', () => {
  it('counts queued exercises per chapter', () => {
    const histories = [
      { ...createHistory('a', 1), dueAt: addDays(now, 1).toISOString() },
      { ...createHistory('b', 1), dueAt: addDays(now, -1).toISOString() },
      { ...createHistory('c', 2), dueAt: addDays(now, 1).toISOString() },
      createHistory('d', 1),
    ];
    expect(countOpenReviewFlags(histories, 1)).toBe(2);
    expect(countOpenReviewFlags(histories, 2)).toBe(1);
  });
});
