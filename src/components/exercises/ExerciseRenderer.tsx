import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Exercise } from '../../schemas/exerciseSchema';
import type { FeedbackState } from '../../features/practice/practiceStore';
import { ExerciseFeedback } from './ExerciseFeedback';
import { ExerciseNavigation } from './ExerciseNavigation';
import { SingleChoiceExercise } from './SingleChoiceExercise';
import { TextInputExercise } from './TextInputExercise';

export interface ExerciseRendererProps {
  exercise: Exercise;
  /** Display order of option ids for single-choice exercises. */
  optionOrder: string[];
  feedback: FeedbackState | null;
  resolved: boolean;
  isLast: boolean;
  showHints: boolean;
  showUmlautHelper: boolean;
  onSubmitChoice: (optionId: string) => void;
  onSubmitText: (value: string) => void;
  onRetry: () => void;
  onReveal: () => void;
  onNext: () => void;
  onFinish: () => void;
  onExit: () => void;
}

/**
 * Renders one exercise of any supported type together with its feedback and
 * navigation. The parent must remount it per exercise (`key={exercise.id}`) so
 * the local answer state resets.
 */
export function ExerciseRenderer({
  exercise,
  optionOrder,
  feedback,
  resolved,
  isLast,
  showHints,
  showUmlautHelper,
  onSubmitChoice,
  onSubmitText,
  onRetry,
  onReveal,
  onNext,
  onFinish,
  onExit,
}: ExerciseRendererProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [textValue, setTextValue] = useState('');
  const [hintVisible, setHintVisible] = useState(false);

  const canRetry = feedback?.canRetry === true;
  const inputsDisabled = resolved;
  const canSubmit =
    exercise.type === 'singleChoice'
      ? selectedOptionId !== null
      : textValue.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (resolved || canRetry || !canSubmit) return;
    if (exercise.type === 'singleChoice') {
      if (selectedOptionId) onSubmitChoice(selectedOptionId);
    } else {
      onSubmitText(textValue);
    }
  };

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      {exercise.instruction && <p className="text-muted">{exercise.instruction}</p>}

      {exercise.type === 'singleChoice' ? (
        <SingleChoiceExercise
          exercise={exercise}
          optionOrder={optionOrder}
          selectedOptionId={selectedOptionId}
          onSelect={setSelectedOptionId}
          showAnswer={resolved}
          disabled={inputsDisabled}
        />
      ) : (
        <TextInputExercise
          exercise={exercise}
          value={textValue}
          onChange={setTextValue}
          disabled={inputsDisabled}
          showUmlautHelper={showUmlautHelper}
        />
      )}

      {showHints && exercise.hint && (
        <div>
          {hintVisible ? (
            <p className="text-sm text-muted">Hint: {exercise.hint}</p>
          ) : (
            <button
              type="button"
              className="button button--ghost"
              onClick={() => setHintVisible(true)}
            >
              Show hint
            </button>
          )}
        </div>
      )}

      <ExerciseFeedback feedback={feedback} explanation={exercise.explanation} />

      <ExerciseNavigation
        canSubmit={canSubmit}
        resolved={resolved}
        canRetry={canRetry}
        isLast={isLast}
        onRetry={onRetry}
        onReveal={onReveal}
        onNext={onNext}
        onFinish={onFinish}
        onExit={onExit}
      />
    </form>
  );
}
