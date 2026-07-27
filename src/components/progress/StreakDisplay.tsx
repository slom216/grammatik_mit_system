import type { ExerciseHistory } from '../../schemas/progressSchema';
import { calculateStreak } from '../../features/progress/streak';

export interface StreakDisplayProps {
  histories: readonly ExerciseHistory[];
  now?: Date;
}

export function StreakDisplay({ histories, now }: StreakDisplayProps) {
  const streak = calculateStreak(histories, now);
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
