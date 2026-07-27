import { useEffect, useRef } from 'react';
import type { FeedbackState } from '../../features/practice/practiceStore';

export interface ExerciseFeedbackProps {
  feedback: FeedbackState | null;
  /** The chapter-authored explanation of the correct answer. */
  explanation: string;
}

const HEADLINES: Record<FeedbackState['kind'], { icon: string; text: string }> = {
  correct: { icon: '✓', text: 'Correct' },
  incorrect: { icon: '✗', text: 'Not correct yet' },
  revealed: { icon: '!', text: 'Answer shown' },
};

/**
 * Feedback is announced through an aria-live region and never relies on colour
 * alone: every state also has an icon and a text label.
 */
export function ExerciseFeedback({ feedback, explanation }: ExerciseFeedbackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedback) containerRef.current?.focus();
  }, [feedback]);

  return (
    <div aria-live="polite" aria-atomic="true">
      {feedback && (
        <div
          className={`feedback feedback--${feedback.kind}`}
          ref={containerRef}
          tabIndex={-1}
          data-testid="exercise-feedback"
        >
          <p className="feedback__headline">
            <span className="feedback__icon" aria-hidden="true">
              {HEADLINES[feedback.kind].icon}
            </span>
            <span>{HEADLINES[feedback.kind].text}</span>
          </p>

          {feedback.submittedAnswer.length > 0 && (
            <p>
              Your answer: <strong lang="de">{feedback.submittedAnswer}</strong>
            </p>
          )}

          {feedback.note && <p>{feedback.note}</p>}

          {feedback.canRetry && <p>You have one more attempt.</p>}

          {/* The expected answer is only useful when the learner did not find it. */}
          {!feedback.canRetry &&
            feedback.kind !== 'correct' &&
            feedback.expectedAnswer && (
              <p>
                Expected answer: <strong lang="de">{feedback.expectedAnswer}</strong>
              </p>
            )}

          {!feedback.canRetry && <p>{explanation}</p>}
        </div>
      )}
    </div>
  );
}
