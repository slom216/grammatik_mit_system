import { ProgressBar } from '../common/ProgressBar';
import { toDayKey } from '../../features/progress/dayKey';

export interface DailyGoalProgressProps {
  /** Exercises answered per local day, `YYYY-MM-DD` → count. */
  answersByDay: Record<string, number>;
  /** Exercises to answer today. `0` means the goal is switched off. */
  goal: number;
  now?: Date;
}

/** Today's practice against the learner's daily goal. Renders nothing if off. */
export function DailyGoalProgress({
  answersByDay,
  goal,
  now = new Date(),
}: DailyGoalProgressProps) {
  if (goal <= 0) return null;

  const answered = answersByDay[toDayKey(now)] ?? 0;
  const met = answered >= goal;

  return (
    <div className="stack stack--tight">
      <ProgressBar
        label="Today's goal"
        value={answered}
        max={goal}
        valueText={`${answered} / ${goal} exercises`}
      />
      <p className="text-sm text-muted">
        {met
          ? 'Goal reached for today. Anything further is a bonus.'
          : `${goal - answered} to go.`}
      </p>
    </div>
  );
}
