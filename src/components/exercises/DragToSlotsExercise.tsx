import { useState } from 'react';
import type { DragToSlotsExercise as DragToSlotsExerciseData } from '../../schemas/exerciseSchema';

export interface DragToSlotsExerciseProps {
  exercise: DragToSlotsExerciseData;
  /** Display order of `exercise.wordBank` indices. */
  wordBankOrder: number[];
  /** slotId -> the word-bank index currently placed in that slot. */
  placedIndices: Record<string, number>;
  onChange: (placedIndices: Record<string, number>) => void;
  /** True once the exercise is finished and correctness may be shown. */
  showAnswer: boolean;
  disabled: boolean;
}

/**
 * Words can be placed either by dragging a word bank tile onto a slot, or by
 * clicking a word to select it and then clicking a slot (or a filled slot to
 * clear it) — a keyboard- and touch-friendly alternative to drag-and-drop.
 */
export function DragToSlotsExercise({
  exercise,
  wordBankOrder,
  placedIndices,
  onChange,
  showAnswer,
  disabled,
}: DragToSlotsExerciseProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const usedIndices = new Set(Object.values(placedIndices));

  const placeInSlot = (slotId: string, bankIndex: number) => {
    if (disabled) return;
    const next = { ...placedIndices };
    for (const [existingSlotId, existingIndex] of Object.entries(next)) {
      if (existingIndex === bankIndex) delete next[existingSlotId];
    }
    next[slotId] = bankIndex;
    onChange(next);
    setSelectedIndex(null);
  };

  const clearSlot = (slotId: string) => {
    if (disabled) return;
    const next = { ...placedIndices };
    delete next[slotId];
    onChange(next);
  };

  return (
    <div className="drag-slots">
      <p className="exercise__prompt" lang="de">
        {exercise.prompt}
      </p>

      <p className="drag-slots__sentence" lang="de">
        {exercise.templateParts.map((part, index) => {
          const slot = exercise.slots[index];
          const placedIndex = slot ? placedIndices[slot.id] : undefined;
          const placedWord = placedIndex !== undefined ? exercise.wordBank[placedIndex] : undefined;
          const isCorrect = slot !== undefined && placedWord === slot.correctWord;

          return (
            <span key={index}>
              {part}
              {slot && (
                <button
                  type="button"
                  className={[
                    'drag-slots__slot',
                    placedWord !== undefined && 'drag-slots__slot--filled',
                    showAnswer && (isCorrect ? 'drag-slots__slot--correct' : 'drag-slots__slot--incorrect'),
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  disabled={disabled}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (draggedIndex !== null) placeInSlot(slot.id, draggedIndex);
                  }}
                  onClick={() => {
                    if (placedWord !== undefined) {
                      clearSlot(slot.id);
                    } else if (selectedIndex !== null) {
                      placeInSlot(slot.id, selectedIndex);
                    }
                  }}
                  aria-label={
                    placedWord !== undefined
                      ? `Slot filled with "${placedWord}", click to clear`
                      : 'Empty slot, select a word below and click to fill'
                  }
                  lang="de"
                >
                  {placedWord ?? '＿＿＿'}
                </button>
              )}
            </span>
          );
        })}
      </p>

      <ul className="drag-slots__bank">
        {wordBankOrder.map((bankIndex) => {
          const word = exercise.wordBank[bankIndex];
          const isUsed = usedIndices.has(bankIndex);
          return (
            <li key={bankIndex}>
              <button
                type="button"
                className={[
                  'drag-slots__word',
                  isUsed && 'drag-slots__word--used',
                  selectedIndex === bankIndex && 'drag-slots__word--selected',
                ]
                  .filter(Boolean)
                  .join(' ')}
                draggable={!disabled && !isUsed}
                disabled={disabled || isUsed}
                onDragStart={() => setDraggedIndex(bankIndex)}
                onDragEnd={() => setDraggedIndex(null)}
                onClick={() =>
                  setSelectedIndex(selectedIndex === bankIndex ? null : bankIndex)
                }
                lang="de"
              >
                {word}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
