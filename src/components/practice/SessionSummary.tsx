import { ProgressRing } from '../progress/ProgressRing';
import type { SessionSummary as SessionSummaryData } from '../../features/practice/scoring';
import { describeDuration } from '../../features/progress/studyTime';

export interface SessionSummaryProps {
  summary: SessionSummaryData;
  /** Only shown for a single-chapter session, where the queue is meaningful. */
  openReviewFlags?: number;
  /** Focused time on this session. Omitted when it was not measured. */
  durationMs?: number | null;
}

/** Three bands, so the headline says something without inventing praise. */
function verdictFor(scorePercent: number): string {
  if (scorePercent >= 90) return 'Strong session.';
  if (scorePercent >= 70) return 'Solid work.';
  return 'Worth another run.';
}

/** The scoreboard shown after a practice session or a cumulative review. */
export function SessionSummary({
  summary,
  openReviewFlags,
  durationMs,
}: SessionSummaryProps) {
  return (
    <div className="session-summary">
      <ProgressRing
        percent={summary.scorePercent}
        label="Weighted score"
        caption="weighted score"
      />

      <div className="stack stack--tight">
        <p className="session-summary__verdict">{verdictFor(summary.scorePercent)}</p>

        <dl className="stat-grid">
          <div className="stat">
            <dt className="stat__label">First-attempt accuracy</dt>
            <dd className="stat__value">{summary.firstAttemptAccuracy}%</dd>
          </div>
          <div className="stat">
            <dt className="stat__label">Points</dt>
            <dd className="stat__value">
              {summary.rawScore}
              <span className="stat__of"> / {summary.maxScore}</span>
            </dd>
          </div>
          {/* The clock the learner watched all session: it disappeared at the
              exact moment it meant something. */}
          {durationMs !== undefined && durationMs !== null && durationMs > 0 && (
            <div className="stat">
              <dt className="stat__label">Time on this session</dt>
              <dd className="stat__value">{describeDuration(durationMs)}</dd>
            </div>
          )}
          {openReviewFlags !== undefined && (
            <div className="stat">
              <dt className="stat__label">In the review queue</dt>
              <dd className="stat__value">{openReviewFlags}</dd>
            </div>
          )}
        </dl>

        {/* The "Answered: N of N" wording is asserted verbatim by
            e2e/lesson-flow.spec.ts — it must stay inside one element, since a
            <dt>/<dd> pair would render as "AnsweredN of N" with no colon. */}
        <p className="text-sm text-muted">
          Answered: {summary.answeredCount} of {summary.totalExercises} · 1 point for a
          correct first attempt, 0.5 for a correct second attempt.
        </p>
      </div>
    </div>
  );
}
