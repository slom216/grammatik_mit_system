import type { FeedbackState } from '../../features/practice/practiceStore';
import { Icon, type IconName } from '../common/Icon';
import { SpeakButton } from '../common/SpeakButton';

export interface ExerciseFeedbackProps {
  feedback: FeedbackState | null;
  /** The chapter-authored explanation of the correct answer. */
  explanation: string;
}

const HEADLINES: Record<FeedbackState['kind'], { icon: IconName; text: string }> = {
  correct: { icon: 'check', text: 'Correct' },
  incorrect: { icon: 'cross', text: 'Not correct yet' },
  revealed: { icon: 'alert', text: 'Answer shown' },
};

/**
 * Feedback is announced through an aria-live region and never relies on colour
 * alone: every state also has an icon and a text label. Keyboard focus moves
 * straight to the next action button (see ExerciseNavigation) rather than to
 * this element, so the learner can keep going without an extra Tab press.
 */
export function ExerciseFeedback({ feedback, explanation }: ExerciseFeedbackProps) {
  return (
    <div aria-live="polite" aria-atomic="true">
      {feedback && (
        <div
          className={`feedback feedback--${feedback.kind}`}
          data-testid="exercise-feedback"
        >
          <p className="feedback__headline">
            <span className="feedback__icon">
              <Icon name={HEADLINES[feedback.kind].icon} />
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
                Expected answer: <strong lang="de">{feedback.expectedAnswer}</strong>{' '}
                {/* An explicit short label rather than the default "Listen to
                    <sentence>": this sits inside the live region, and the
                    default would make a screen reader read the answer twice. */}
                <SpeakButton
                  text={feedback.expectedAnswer}
                  label="Listen to the expected answer"
                />
              </p>
            )}

          {!feedback.canRetry && <p>{explanation}</p>}
        </div>
      )}
    </div>
  );
}
