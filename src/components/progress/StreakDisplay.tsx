import { calculateStreak } from '../../features/progress/streak';

export interface StreakDisplayProps {
  /** Exercises answered per local day, `YYYY-MM-DD` → count. */
  answersByDay: Record<string, number>;
  now?: Date;
}

export function StreakDisplay({ answersByDay, now }: StreakDisplayProps) {
  const streak = calculateStreak(answersByDay, now);
  return (
    <p className="row">
      <span className="badge badge--accent">
        <span aria-hidden="true">▲</span>
        <span>
          {streak} {streak === 1 ? 'day' : 'days'} in a row
        </span>
      </span>
      <span className="text-sm text-muted">
        {streak === 0 ? 'Answer an exercise today to start a streak.' : 'Keep it going.'}
      </span>
    </p>
  );
}
