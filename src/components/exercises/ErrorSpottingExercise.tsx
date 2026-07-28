import type { ErrorSpottingExercise as ErrorSpottingExerciseData } from '../../schemas/exerciseSchema';

export interface ErrorSpottingExerciseProps {
  exercise: ErrorSpottingExerciseData;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  /** True once the exercise is finished and the correct token may be shown. */
  showAnswer: boolean;
  disabled: boolean;
}

export function ErrorSpottingExercise({
  exercise,
  selectedIndex,
  onSelect,
  showAnswer,
  disabled,
}: ErrorSpottingExerciseProps) {
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
              onClick={() => onSelect(index)}
              lang="de"
            >
              {token}
            </button>
          );
        })}
      </div>
      {showAnswer && (
        <p className="error-spotting__correction">
          Correction: <strong lang="de">{exercise.correction}</strong>
        </p>
      )}
    </fieldset>
  );
}
