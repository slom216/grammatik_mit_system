import type { SingleChoiceExercise as SingleChoiceExerciseData } from '../../schemas/exerciseSchema';

export interface SingleChoiceExerciseProps {
  exercise: SingleChoiceExerciseData;
  /** Display order of option ids (may be shuffled). */
  optionOrder: string[];
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  /** True once the exercise is finished and the correct answer may be shown. */
  showAnswer: boolean;
  disabled: boolean;
}

export function SingleChoiceExercise({
  exercise,
  optionOrder,
  selectedOptionId,
  onSelect,
  showAnswer,
  disabled,
}: SingleChoiceExerciseProps) {
  const options = optionOrder
    .map((id) => exercise.options.find((option) => option.id === id))
    .filter((option): option is SingleChoiceExerciseData['options'][number] =>
      Boolean(option),
    );

  return (
    <fieldset>
      <legend className="exercise__prompt" lang="de">
        {exercise.prompt}
      </legend>
      <ul className="option-list">
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === exercise.correctOptionId;
          const classes = ['option'];
          if (isSelected && !showAnswer) classes.push('option--selected');
          if (showAnswer && isCorrect) classes.push('option--correct');
          if (showAnswer && isSelected && !isCorrect) classes.push('option--incorrect');

          return (
            <li key={option.id}>
              <label className={classes.join(' ')}>
                <input
                  type="radio"
                  name={`exercise-${exercise.id}`}
                  value={option.id}
                  checked={isSelected}
                  disabled={disabled}
                  onChange={() => onSelect(option.id)}
                />
                <span className="option__number" aria-hidden="true">
                  {index + 1}
                </span>
                <span lang="de">{option.text}</span>
                {showAnswer && (isCorrect || isSelected) && (
                  <span className="option__marker">
                    <span aria-hidden="true">{isCorrect ? '✓' : '✗'}</span>
                    <span className="visually-hidden">
                      {isCorrect ? ' correct answer' : ' your answer, incorrect'}
                    </span>
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
