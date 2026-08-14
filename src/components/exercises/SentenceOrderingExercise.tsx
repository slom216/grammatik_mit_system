import { useState } from 'react';
import type { SentenceOrderingExercise as SentenceOrderingExerciseData } from '../../schemas/exerciseSchema';

export interface SentenceOrderingExerciseProps {
  exercise: SentenceOrderingExerciseData;
  /** Current display order of segment ids. */
  order: string[];
  onChange: (order: string[]) => void;
  /** True once the exercise is finished and the correct order may be shown. */
  showAnswer: boolean;
  disabled: boolean;
}

/**
 * Segments can be reordered either by dragging (mouse/touch, native HTML5
 * drag-and-drop) or with the move buttons, which keep this keyboard-usable
 * without a drag-and-drop library.
 */
export function SentenceOrderingExercise({
  exercise,
  order,
  onChange,
  showAnswer,
  disabled,
}: SentenceOrderingExerciseProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const segmentById = new Map(exercise.segments.map((segment) => [segment.id, segment]));
  const correctOrder = exercise.segments.map((segment) => segment.id);

  const moveTo = (id: string, targetIndex: number) => {
    if (disabled) return;
    const withoutId = order.filter((existing) => existing !== id);
    const clampedIndex = Math.max(0, Math.min(targetIndex, withoutId.length));
    onChange([...withoutId.slice(0, clampedIndex), id, ...withoutId.slice(clampedIndex)]);
  };

  const move = (id: string, delta: number) => {
    const index = order.indexOf(id);
    if (index === -1) return;
    moveTo(id, index + delta);
  };

  return (
    <fieldset className="sentence-ordering">
      <legend className="exercise__prompt" lang="de">
        {exercise.prompt}
      </legend>
      <ol className="sentence-ordering__list">
        {order.map((id, index) => {
          const segment = segmentById.get(id);
          if (!segment) return null;
          const isCorrectPosition = showAnswer && correctOrder[index] === id;
          const classes = ['sentence-ordering__token'];
          if (draggedId === id) classes.push('sentence-ordering__token--dragging');
          if (showAnswer) {
            classes.push(
              isCorrectPosition
                ? 'sentence-ordering__token--correct'
                : 'sentence-ordering__token--incorrect',
            );
          }

          return (
            <li
              key={id}
              className={classes.join(' ')}
              draggable={!disabled}
              onDragStart={() => setDraggedId(id)}
              onDragEnd={() => setDraggedId(null)}
              onDragOver={(event) => {
                event.preventDefault();
                if (disabled || draggedId === null || draggedId === id) return;
                moveTo(draggedId, index);
              }}
              onDrop={(event) => event.preventDefault()}
            >
              <span className="sentence-ordering__handle" aria-hidden="true">
                ⠿
              </span>
              <span className="sentence-ordering__text" lang="de">
                {segment.text}
              </span>
              <span className="sentence-ordering__controls">
                <button
                  type="button"
                  className="sentence-ordering__move"
                  disabled={disabled || index === 0}
                  onClick={() => move(id, -1)}
                  aria-label={`Move "${segment.text}" earlier in the sentence`}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="sentence-ordering__move"
                  disabled={disabled || index === order.length - 1}
                  onClick={() => move(id, 1)}
                  aria-label={`Move "${segment.text}" later in the sentence`}
                >
                  →
                </button>
              </span>
            </li>
          );
        })}
      </ol>
    </fieldset>
  );
}
