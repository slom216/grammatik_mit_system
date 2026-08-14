import { buildActivityCalendar, heatLevel } from '../../features/progress/dailyActivity';
import { calculateStreak } from '../../features/progress/streak';
import { Icon } from '../common/Icon';

export interface StreakDisplayProps {
  /** Exercises answered per local day, `YYYY-MM-DD` → count. */
  answersByDay: Record<string, number>;
  now?: Date;
}

export function StreakDisplay({ answersByDay, now }: StreakDisplayProps) {
  const streak = calculateStreak(answersByDay, now);
  // One week of the same grid the Activity page draws in full, so the streak
  // number has something visible behind it. Decorative: the sentence beside it
  // already carries the meaning, so the strip stays aria-hidden.
  const week = buildActivityCalendar(answersByDay, 1, now)[0]?.days ?? [];

  return (
    <p className="row">
      <span className="badge badge--accent">
        <Icon name="flame" />
        <span>
          {streak} {streak === 1 ? 'day' : 'days'} in a row
        </span>
      </span>
      <span className="week-strip" aria-hidden="true">
        {week.map((day) => (
          <span
            key={day.date}
            className={`activity-calendar__cell activity-calendar__cell--level-${heatLevel(day.count)}`}
          />
        ))}
      </span>
      <span className="text-sm text-muted">
        {streak === 0 ? 'Answer an exercise today to start a streak.' : 'Keep it going.'}
      </span>
    </p>
  );
}
