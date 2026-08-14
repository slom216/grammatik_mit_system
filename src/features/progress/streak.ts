import { addDays, toDayKey } from './dayKey';

/**
 * Consecutive days on which the learner answered at least one exercise.
 *
 * The streak may end today or yesterday, so a learner who has not practised yet
 * today does not lose the streak.
 */
export function calculateStreak(
  answersByDay: Record<string, number>,
  now: Date = new Date(),
): number {
  const practised = (date: Date) => (answersByDay[toDayKey(date)] ?? 0) > 0;

  let cursor = now;
  if (!practised(cursor)) {
    cursor = addDays(cursor, -1);
    if (!practised(cursor)) return 0;
  }

  let streak = 0;
  while (practised(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
