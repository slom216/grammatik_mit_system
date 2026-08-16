import { useState } from 'react';
import type { SentenceOrderingExercise as SentenceOrderingExerciseData } from '../../schemas/exerciseSchema';
import { promptListsSegments } from '../../features/practice/answerNormalization';
import { Icon } from '../common/Icon';
import { isCoarsePointer } from './coarsePointer';

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
 * Segments can be reordered three ways, none of which needs a drag-and-drop
 * library: dragging with a mouse, the move buttons (which keep this
 * keyboard-usable), and tapping one segment then another to move the first
 * before the second. The last is what touch actually gets — native HTML5 drag
 * does not fire from a touch — so the drag affordances are withdrawn there.
 */
export function SentenceOrderingExercise({
  exercise,
  order,
  onChange,
  showAnswer,
  disabled,
}: SentenceOrderingExerciseProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const correctOrder = exercise.segments.map((segment) => segment.id);
  const draggable = !disabled && !isCoarsePointer();

  // The full stop or question mark rides on the last segment in the content, so
  // shuffling it into the pile hands the learner the answer's final position for
  // free. It is shown after the row instead, and stripped from the segment.
  const lastSegment = exercise.segments.at(-1);
  const lastText = lastSegment?.text ?? '';
  const terminator = /[.!?]$/.test(lastText) ? lastText.slice(-1) : '';
  const segmentById = new Map(
    exercise.segments.map((segment) => [
      segment.id,
      segment.id === lastSegment?.id && terminator
        ? { ...segment, text: segment.text.slice(0, -1) }
        : segment,
    ]),
  );

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

  /** Tap one segment to pick it up, tap another to drop it before that one. */
  const tap = (id: string) => {
    if (disabled) return;
    if (selectedId === null) {
      setSelectedId(id);
    } else if (selectedId === id) {
      setSelectedId(null);
    } else {
      moveTo(selectedId, order.indexOf(id));
      setSelectedId(null);
    }
  };

  const tapLabel = (id: string, text: string): string => {
    if (selectedId === null) return `Pick up "${text}" to move it`;
    if (selectedId === id) return `Put "${text}" back down`;
    const selectedText = segmentById.get(selectedId)?.text ?? '';
    return `Move "${selectedText}" in front of "${text}"`;
  };

  return (
    <fieldset className="sentence-ordering">
      {/* Many prompts are the words with slashes between them, in the answer's
          own order — that is the answer, printed above the puzzle. Dropped in
          favour of a plain label, which still names the fieldset. */}
      {promptListsSegments(exercise) ? (
        <legend className="visually-hidden">Put the words in the correct order.</legend>
      ) : (
        <legend className="exercise__prompt" lang="de">
          {exercise.prompt}
        </legend>
      )}
      <ol className="sentence-ordering__list">
        {order.map((id, index) => {
          const segment = segmentById.get(id);
          if (!segment) return null;
          const isCorrectPosition = showAnswer && correctOrder[index] === id;
          const classes = ['sentence-ordering__token'];
          if (draggedId === id) classes.push('sentence-ordering__token--dragging');
          if (selectedId === id) classes.push('sentence-ordering__token--selected');
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
              draggable={draggable}
              onDragStart={() => setDraggedId(id)}
              onDragEnd={() => setDraggedId(null)}
              onDragOver={(event) => {
                event.preventDefault();
                if (disabled || draggedId === null || draggedId === id) return;
                moveTo(draggedId, index);
              }}
              onDrop={(event) => event.preventDefault()}
            >
              <span className="sentence-ordering__handle">
                <Icon name="grip" />
              </span>
              {/* A button, not a span: tapping it is a real action, and the
                  move buttons beside it then need no stopPropagation. */}
              <button
                type="button"
                className="sentence-ordering__text"
                disabled={disabled}
                aria-pressed={selectedId === id}
                aria-label={tapLabel(id, segment.text)}
                onClick={() => tap(id)}
                lang="de"
              >
                {segment.text}
              </button>
              <span className="sentence-ordering__controls">
                <button
                  type="button"
                  className="sentence-ordering__move"
                  disabled={disabled || index === 0}
                  onClick={() => move(id, -1)}
                  aria-label={`Move "${segment.text}" earlier in the sentence`}
                >
                  <Icon name="arrow-left" />
                </button>
                <button
                  type="button"
                  className="sentence-ordering__move"
                  disabled={disabled || index === order.length - 1}
                  onClick={() => move(id, 1)}
                  aria-label={`Move "${segment.text}" later in the sentence`}
                >
                  <Icon name="arrow-right" />
                </button>
              </span>
            </li>
          );
        })}
        {terminator && (
          <li className="sentence-ordering__terminator" aria-label="End of the sentence">
            {terminator}
          </li>
        )}
      </ol>
    </fieldset>
  );
}
