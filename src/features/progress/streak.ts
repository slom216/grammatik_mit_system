import type { ExerciseHistory } from '../../schemas/progressSchema';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Consecutive days on which the learner answered at least one exercise.
 *
 * The streak may end today or yesterday, so a learner who has not practised yet
 * today does not lose the streak.
 */
export function calculateStreak(
  histories: readonly ExerciseHistory[],
  now: Date = new Date(),
): number {
  const days = new Set(
    histories
      .map((history) => history.lastAnsweredAt)
      .filter((value): value is string => value !== undefined)
      .map((value) => value.slice(0, 10)),
  );
  if (days.size === 0) return 0;

  let cursor = new Date(now.getTime());
  if (!days.has(toDayKey(cursor))) {
    cursor = new Date(cursor.getTime() - DAY_IN_MS);
    if (!days.has(toDayKey(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(toDayKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - DAY_IN_MS);
  }
  return streak;
}
