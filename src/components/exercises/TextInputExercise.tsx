import { useEffect, useId, useRef } from 'react';
import type { TextInputExercise as TextInputExerciseData } from '../../schemas/exerciseSchema';
import { checkTextAnswer } from '../../features/practice/answerNormalization';
import { UmlautHelper } from './UmlautHelper';

export interface TextInputExerciseProps {
  exercise: TextInputExerciseData;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  showUmlautHelper: boolean;
}

export function TextInputExercise({
  exercise,
  value,
  onChange,
  disabled,
  showUmlautHelper,
}: TextInputExerciseProps) {
  const inputId = useId();
  const helperId = useId();
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Focuses the field as soon as this exercise appears, so learners can start
  // typing straight away instead of having to click into it first.
  useEffect(() => {
    fieldRef.current?.focus();
  }, []);

  // Many chapters set the answer itself as placeholder, which gives it away.
  // Only show a hint that would not be graded as a correct answer.
  const hint = exercise.placeholder;
  const hintCheck = hint ? checkTextAnswer(exercise, hint) : undefined;
  const placeholder =
    hintCheck && (hintCheck.correct || hintCheck.capitalisationOnlyMismatch) ? undefined : hint;

  const sharedProps = {
    id: inputId,
    className: 'text-answer__field',
    value,
    disabled,
    lang: 'de',
    spellCheck: false,
    autoComplete: 'off' as const,
    // Phone keyboards capitalise the first letter, which German grading rejects.
    autoCapitalize: 'none',
    autoCorrect: 'off',
    'aria-describedby': showUmlautHelper ? helperId : undefined,
    placeholder,
    maxLength: exercise.maxLength,
  };

  return (
    <div className="text-answer">
      <label htmlFor={inputId} className="exercise__prompt" lang="de">
        {exercise.prompt}
      </label>

      {exercise.multiline ? (
        <textarea
          {...sharedProps}
          ref={fieldRef as React.RefObject<HTMLTextAreaElement>}
          rows={3}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          {...sharedProps}
          ref={fieldRef as React.RefObject<HTMLInputElement>}
          type="text"
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {showUmlautHelper && (
        <UmlautHelper
          id={helperId}
          fieldRef={fieldRef}
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={exercise.maxLength}
        />
      )}
    </div>
  );
}
