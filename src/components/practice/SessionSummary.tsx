import { ProgressBar } from '../common/ProgressBar';
import type { SessionSummary as SessionSummaryData } from '../../features/practice/scoring';

export interface SessionSummaryProps {
  summary: SessionSummaryData;
  /** Only shown for a single-chapter session, where the queue is meaningful. */
  openReviewFlags?: number;
}

/** The scoreboard shown after a practice session or a cumulative review. */
export function SessionSummary({ summary, openReviewFlags }: SessionSummaryProps) {
  return (
    <div className="stack">
      <ProgressBar
        label="Weighted score"
        value={summary.scorePercent}
        valueText={`${summary.scorePercent}%`}
      />
      <ul>
        <li>
          Answered: {summary.answeredCount} of {summary.totalExercises}
        </li>
        <li>
          Points: {summary.rawScore} of {summary.maxScore} (1 point for a correct first
          attempt, 0.5 for a correct second attempt)
        </li>
        <li>First-attempt accuracy: {summary.firstAttemptAccuracy}%</li>
        <li>Correct text-input exercises: {summary.correctTextInputs}</li>
        {openReviewFlags !== undefined && (
          <li>Exercises in the review queue for this chapter: {openReviewFlags}</li>
        )}
      </ul>
    </div>
  );
}
