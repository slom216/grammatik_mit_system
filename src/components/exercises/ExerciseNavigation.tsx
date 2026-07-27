import { Button } from '../common/Button';

export interface ExerciseNavigationProps {
  canSubmit: boolean;
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
  resolved,
  canRetry,
  isLast,
  onRetry,
  onReveal,
  onNext,
  onFinish,
  onExit,
}: ExerciseNavigationProps) {
  return (
    <div className="exercise-navigation">
      <div className="row">
        {!resolved && !canRetry && (
          <Button type="submit" disabled={!canSubmit}>
            Check answer
          </Button>
        )}

        {canRetry && (
          <>
            <Button type="button" onClick={onRetry}>
              Try again
            </Button>
            <Button type="button" variant="secondary" onClick={onReveal}>
              Show answer
            </Button>
          </>
        )}

        {resolved &&
          (isLast ? (
            <Button type="button" onClick={onFinish}>
              Finish and see results
            </Button>
          ) : (
            <Button type="button" onClick={onNext}>
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
