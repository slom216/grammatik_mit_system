import { addDays, toDayKey } from './dayKey';

/**
 * Consecutive days on which the learner answered at least one exercise.
 *
 * The streak may end today or yesterday, so a learner who has not practised yet
 * today does not lose the streak. Days after today (the clock was set back, or
 * a backup carried a later date) are not skipped: the walk starts from the
 * latest practised day instead.
 */
export function calculateStreak(
  answersByDay: Record<string, number>,
  now: Date = new Date(),
): number {
  const practised = (date: Date) => (answersByDay[toDayKey(date)] ?? 0) > 0;

  const latest = Object.keys(answersByDay)
    .filter((key) => (answersByDay[key] ?? 0) > 0)
    .sort()
    .pop();
  let cursor = now;
  if (latest !== undefined && latest > toDayKey(now)) {
    const [year, month, day] = latest.split('-').map(Number);
    cursor = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
  }
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
