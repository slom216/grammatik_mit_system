import { useId, useRef } from 'react';
import type { ErrorSpottingExercise as ErrorSpottingExerciseData } from '../../schemas/exerciseSchema';
import { requiresCorrectionInput } from '../../features/practice/answerNormalization';
import { UmlautHelper } from './UmlautHelper';

export interface ErrorSpottingExerciseProps {
  exercise: ErrorSpottingExerciseData;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  /** The correction the learner typed. Unused when the exercise asks for none. */
  correction: string;
  onCorrectionChange: (correction: string) => void;
  /** True once the exercise is finished and the correct token may be shown. */
  showAnswer: boolean;
  disabled: boolean;
  showUmlautHelper: boolean;
}

export function ErrorSpottingExercise({
  exercise,
  selectedIndex,
  onSelect,
  correction,
  onCorrectionChange,
  showAnswer,
  disabled,
  showUmlautHelper,
}: ErrorSpottingExerciseProps) {
  const inputId = useId();
  const helperId = useId();
  const fieldRef = useRef<HTMLInputElement>(null);
  const needsCorrection = requiresCorrectionInput(exercise);

  return (
    <fieldset className="error-spotting">
      <legend className="exercise__prompt" lang="de">
        {exercise.prompt}
      </legend>
      <div className="error-spotting__sentence">
        {exercise.tokens.map((token, index) => {
          const isSelected = selectedIndex === index;
          const isError = index === exercise.errorTokenIndex;
          const classes = ['error-spotting__token'];
          if (isSelected && !showAnswer) classes.push('error-spotting__token--selected');
          if (showAnswer && isError) classes.push('error-spotting__token--correct');
          if (showAnswer && isSelected && !isError) {
            classes.push('error-spotting__token--incorrect');
          }

          return (
            <button
              key={index}
              type="button"
              className={classes.join(' ')}
              disabled={disabled}
              onClick={() => {
                onSelect(index);
                // The correction is what the exercise is really asking for, so
                // send the learner straight there rather than making them find
                // the field themselves.
                if (needsCorrection) fieldRef.current?.focus();
              }}
              lang="de"
            >
              {token}
            </button>
          );
        })}
      </div>

      {needsCorrection && (
        <div className="error-spotting__answer">
          <label htmlFor={inputId} className="text-sm text-muted">
            Replace it with
          </label>
          <input
            id={inputId}
            ref={fieldRef}
            type="text"
            className="text-answer__field"
            value={correction}
            disabled={disabled}
            onChange={(event) => onCorrectionChange(event.target.value)}
            lang="de"
            spellCheck={false}
            autoComplete="off"
            aria-describedby={showUmlautHelper ? helperId : undefined}
          />
          {showUmlautHelper && (
            <UmlautHelper
              id={helperId}
              fieldRef={fieldRef}
              value={correction}
              onChange={onCorrectionChange}
              disabled={disabled}
            />
          )}
        </div>
      )}

      {showAnswer && (
        <p className="error-spotting__correction">
          Correction: <strong lang="de">{exercise.correction}</strong>
        </p>
      )}
    </fieldset>
  );
}
