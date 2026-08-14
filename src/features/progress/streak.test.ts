import { describe, expect, it } from 'vitest';
import { calculateStreak } from './streak';

// Local noon, so the day the test means is the day the key resolves to
// regardless of the machine's time zone.
const now = new Date(2026, 2, 10, 12, 0, 0);

describe('calculateStreak', () => {
  it('is zero without any practice', () => {
    expect(calculateStreak({}, now)).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    const answersByDay = {
      '2026-03-10': 4,
      '2026-03-09': 12,
      '2026-03-08': 1,
    };
    expect(calculateStreak(answersByDay, now)).toBe(3);
  });

  it('still counts a streak that ends yesterday', () => {
    expect(calculateStreak({ '2026-03-09': 3 }, now)).toBe(1);
  });

  it('breaks after a missed day', () => {
    expect(calculateStreak({ '2026-03-10': 2, '2026-03-08': 5 }, now)).toBe(1);
  });

  it('is zero when the last practice is older than yesterday', () => {
    expect(calculateStreak({ '2026-03-01': 9 }, now)).toBe(0);
  });

  it('ignores a day whose count fell to zero', () => {
    expect(calculateStreak({ '2026-03-10': 0, '2026-03-09': 3 }, now)).toBe(1);
  });

  // The regression this whole field exists for: progress used to derive days
  // from each exercise's `lastAnsweredAt`, which a re-answer overwrites, so
  // drilling the same exercises two days running erased the first day.
  it('keeps an earlier day after the same exercises are answered again', () => {
    const answersByDay = { '2026-03-09': 2, '2026-03-10': 2 };
    expect(calculateStreak(answersByDay, now)).toBe(2);
  });

  it('counts across a month boundary', () => {
    const endOfFebruary = new Date(2026, 2, 1, 12, 0, 0);
    const answersByDay = { '2026-03-01': 1, '2026-02-28': 1, '2026-02-27': 1 };
    expect(calculateStreak(answersByDay, endOfFebruary)).toBe(3);
  });
});
