import { useEffect, useId, useRef } from 'react';
import type { TextInputExercise as TextInputExerciseData } from '../../schemas/exerciseSchema';
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

  const sharedProps = {
    id: inputId,
    className: 'text-answer__field',
    value,
    disabled,
    lang: 'de',
    spellCheck: false,
    autoComplete: 'off' as const,
    'aria-describedby': showUmlautHelper ? helperId : undefined,
    placeholder: exercise.placeholder,
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
