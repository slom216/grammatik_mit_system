import { useEffect, useRef } from 'react';
import { Button } from '../common/Button';

export interface ExerciseNavigationProps {
  canSubmit: boolean;
  /** False when the answer is submitted automatically on selection (e.g. single choice). */
  showCheckAnswer: boolean;
  resolved: boolean;
  canRetry: boolean;
  isLast: boolean;
  onRetry: () => void;
  onReveal: () => void;
  onNext: () => void;
  onFinish: () => void;
  onExit: () => void;
}

export function ExerciseNavigation({
  canSubmit,
  showCheckAnswer,
  resolved,
  canRetry,
  isLast,
  onRetry,
  onReveal,
  onNext,
  onFinish,
  onExit,
}: ExerciseNavigationProps) {
  const tryAgainRef = useRef<HTMLButtonElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);

  // Moves keyboard focus straight to the next action: "Try again" for an
  // answer that can still be retried, otherwise "Next exercise" / "Finish"
  // once the exercise is resolved (correct, revealed, or out of attempts).
  useEffect(() => {
    if (canRetry) {
      tryAgainRef.current?.focus();
    } else if (resolved) {
      continueRef.current?.focus();
    }
  }, [canRetry, resolved]);

  return (
    <div className="exercise-navigation">
      <div className="row">
        {showCheckAnswer && !resolved && !canRetry && (
          <Button type="submit" disabled={!canSubmit}>
            Check answer
          </Button>
        )}

        {canRetry && (
          <Button type="button" ref={tryAgainRef} onClick={onRetry}>
            Try again
          </Button>
        )}

        {/* Available from the start, not only after a wrong guess: an exercise
            you have no idea about should not need a throwaway answer before it
            will tell you anything. Revealing scores zero either way. */}
        {!resolved && (
          <Button type="button" variant="secondary" onClick={onReveal}>
            {canRetry ? 'Show answer' : "I don't know"}
          </Button>
        )}

        {resolved &&
          (isLast ? (
            <Button type="button" ref={continueRef} onClick={onFinish}>
              Finish and see results
            </Button>
          ) : (
            <Button type="button" ref={continueRef} onClick={onNext}>
              Next exercise
            </Button>
          ))}
      </div>

      <Button type="button" variant="ghost" onClick={onExit}>
        Exit practice
      </Button>
    </div>
  );
}
