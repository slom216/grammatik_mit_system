import { useEffect, useId, useRef } from 'react';
import type { TextInputExercise as TextInputExerciseData } from '../../schemas/exerciseSchema';
import { GERMAN_SPECIAL_CHARACTERS } from '../../features/practice/answerNormalization';

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
  const pendingCaret = useRef<number | null>(null);

  // Restores the caret after a helper insertion, once React has written the
  // new value to the DOM.
  useEffect(() => {
    const caret = pendingCaret.current;
    if (caret === null) return;
    pendingCaret.current = null;
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    field.setSelectionRange(caret, caret);
  });

  /** Inserts a German special character at the caret and keeps focus. */
  const insertCharacter = (character: string) => {
    const field = fieldRef.current;
    if (!field) {
      onChange(value + character);
      return;
    }
    const start = field.selectionStart ?? value.length;
    const end = field.selectionEnd ?? value.length;
    const next = value.slice(0, start) + character + value.slice(end);
    onChange(exercise.maxLength ? next.slice(0, exercise.maxLength) : next);
    pendingCaret.current = start + character.length;
  };

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
        <div className="umlaut-helper" id={helperId}>
          <span className="visually-hidden">
            Buttons for inserting German special characters
          </span>
          {GERMAN_SPECIAL_CHARACTERS.map(({ character, label }) => (
            <button
              key={character}
              type="button"
              className="umlaut-helper__button"
              onClick={() => insertCharacter(character)}
              disabled={disabled}
              aria-label={`Insert ${label}`}
            >
              <span aria-hidden="true">{character}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
