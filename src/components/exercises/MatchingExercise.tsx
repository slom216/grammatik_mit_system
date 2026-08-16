import { useState } from 'react';
import type { MatchingExercise as MatchingExerciseData } from '../../schemas/exerciseSchema';

export interface MatchingExerciseProps {
  exercise: MatchingExerciseData;
  /** Display order of pair ids for the right column. */
  rightOrder: string[];
  /** leftPairId -> the rightPairId it is currently connected to. */
  matches: Record<string, string>;
  onChange: (matches: Record<string, string>) => void;
  /** True once the exercise is finished and correctness may be shown. */
  showAnswer: boolean;
  disabled: boolean;
}

/**
 * Click-click pairing (select a left item, then a right item) rather than
 * drag-and-drop — matching doesn't need dragging to feel natural, and this
 * stays fully keyboard- and touch-accessible for free.
 */
export function MatchingExercise({
  exercise,
  rightOrder,
  matches,
  onChange,
  showAnswer,
  disabled,
}: MatchingExerciseProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const selectLeft = (leftId: string) => {
    if (disabled) return;
    setSelectedLeft(selectedLeft === leftId ? null : leftId);
  };

  const selectRight = (rightId: string) => {
    if (disabled || selectedLeft === null) return;
    const next = { ...matches };
    for (const [leftId, existingRightId] of Object.entries(next)) {
      if (existingRightId === rightId) delete next[leftId];
    }
    next[selectedLeft] = rightId;
    onChange(next);
    setSelectedLeft(null);
  };

  const clearPair = (leftId: string) => {
    if (disabled) return;
    const next = { ...matches };
    delete next[leftId];
    onChange(next);
  };

  return (
    <fieldset className="matching">
      <legend className="exercise__prompt" lang="de">
        {exercise.prompt}
      </legend>
      <div className="matching__columns">
        <ul className="matching__column">
          {exercise.pairs.map((pair, index) => {
            const matchedRightId = matches[pair.id];
            const isMatched = matchedRightId !== undefined;
            const isCorrect = showAnswer && matchedRightId === pair.id;
            const isIncorrect = showAnswer && isMatched && matchedRightId !== pair.id;

            return (
              <li key={pair.id}>
                <button
                  type="button"
                  className={[
                    'matching__item',
                    selectedLeft === pair.id && 'matching__item--selected',
                    isMatched && 'matching__item--matched',
                    isCorrect && 'matching__item--correct',
                    isIncorrect && 'matching__item--incorrect',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  disabled={disabled}
                  // Selection is otherwise carried by colour alone, which a
                  // screen reader cannot report back.
                  aria-pressed={selectedLeft === pair.id}
                  aria-label={
                    isMatched
                      ? `${index + 1}. ${pair.left} — matched with ${
                          exercise.pairs.find(
                            (candidate) => candidate.id === matchedRightId,
                          )?.right
                        }`
                      : `${index + 1}. ${pair.left}`
                  }
                  onClick={() => (isMatched ? clearPair(pair.id) : selectLeft(pair.id))}
                >
                  <span className="matching__badge" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span lang="de">{pair.left}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <ul className="matching__column">
          {rightOrder.map((rightId) => {
            const pair = exercise.pairs.find((candidate) => candidate.id === rightId);
            if (!pair) return null;
            const matchedLeft = exercise.pairs.find(
              (candidate) => matches[candidate.id] === rightId,
            );
            const matchedLeftIndex = matchedLeft
              ? exercise.pairs.indexOf(matchedLeft)
              : -1;
            const isUsed = matchedLeft !== undefined;

            return (
              <li key={rightId}>
                <button
                  type="button"
                  className={['matching__item', isUsed && 'matching__item--matched']
                    .filter(Boolean)
                    .join(' ')}
                  disabled={disabled}
                  aria-label={
                    matchedLeft
                      ? `${pair.right} — matched with ${matchedLeftIndex + 1}. ${matchedLeft.left}`
                      : `${pair.right} — not matched`
                  }
                  onClick={() => selectRight(rightId)}
                >
                  <span className="matching__badge" aria-hidden="true">
                    {isUsed ? matchedLeftIndex + 1 : ''}
                  </span>
                  <span lang="de">{pair.right}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </fieldset>
  );
}
