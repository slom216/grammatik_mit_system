import { useEffect, useRef } from 'react';
import { GERMAN_SPECIAL_CHARACTERS } from '../../features/practice/answerNormalization';

export interface UmlautHelperProps {
  id: string;
  /** The field the characters are inserted into. */
  fieldRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  maxLength?: number;
}

/**
 * A row of buttons that types the German characters an English keyboard has no
 * key for, at the caret rather than at the end.
 */
export function UmlautHelper({
  id,
  fieldRef,
  value,
  onChange,
  disabled,
  maxLength,
}: UmlautHelperProps) {
  const pendingCaret = useRef<number | null>(null);

  // Restores the caret after an insertion, once React has written the new value
  // to the DOM.
  useEffect(() => {
    const caret = pendingCaret.current;
    if (caret === null) return;
    pendingCaret.current = null;
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    field.setSelectionRange(caret, caret);
  });

  const insertCharacter = (character: string) => {
    const field = fieldRef.current;
    if (!field) {
      onChange(value + character);
      return;
    }
    const start = field.selectionStart ?? value.length;
    const end = field.selectionEnd ?? value.length;
    const next = value.slice(0, start) + character + value.slice(end);
    onChange(maxLength ? next.slice(0, maxLength) : next);
    pendingCaret.current = start + character.length;
  };

  return (
    <div className="umlaut-helper" id={id}>
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
  );
}
