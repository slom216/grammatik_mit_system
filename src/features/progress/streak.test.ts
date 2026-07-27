import { describe, expect, it } from 'vitest';
import { calculateStreak } from './streak';
import { createHistory } from '../practice/reviewScheduler';
import type { ExerciseHistory } from '../../schemas/progressSchema';

const now = new Date('2026-03-10T12:00:00.000Z');

function answeredOn(exerciseId: string, isoDate: string): ExerciseHistory {
  return { ...createHistory(exerciseId, 0), lastAnsweredAt: `${isoDate}T08:00:00.000Z` };
}

describe('calculateStreak', () => {
  it('is zero without any history', () => {
    expect(calculateStreak([], now)).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    const histories = [
      answeredOn('a', '2026-03-10'),
      answeredOn('b', '2026-03-09'),
      answeredOn('c', '2026-03-08'),
    ];
    expect(calculateStreak(histories, now)).toBe(3);
  });

  it('still counts a streak that ends yesterday', () => {
    expect(calculateStreak([answeredOn('a', '2026-03-09')], now)).toBe(1);
  });

  it('breaks after a missed day', () => {
    const histories = [answeredOn('a', '2026-03-10'), answeredOn('b', '2026-03-08')];
    expect(calculateStreak(histories, now)).toBe(1);
  });

  it('is zero when the last practice is older than yesterday', () => {
    expect(calculateStreak([answeredOn('a', '2026-03-01')], now)).toBe(0);
  });

  it('counts a day only once', () => {
    const histories = [answeredOn('a', '2026-03-10'), answeredOn('b', '2026-03-10')];
    expect(calculateStreak(histories, now)).toBe(1);
  });
});
