import { useState } from 'react';
import type { DragToSlotsExercise as DragToSlotsExerciseData } from '../../schemas/exerciseSchema';
import { isCoarsePointer } from './coarsePointer';

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

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Most prompts restate the gapped sentence that is rendered right below them,
 * which puts the same German on screen twice. Strip that restatement and keep
 * only what the sentence itself does not say — the situation, or a hint like
 * "(Dativ, feminin)". Returns null when nothing is left worth showing.
 */
export function promptWithoutSentence(
  prompt: string,
  templateParts: string[],
): string | null {
  const sentence = new RegExp(
    templateParts
      .map((part) => escapeRegExp(part.trim()).replace(/\s+/g, '\\s+'))
      .join('\\s*(?:_{2,}|＿+)\\s*'),
  );
  const match = sentence.exec(prompt);
  // No restatement to strip: leave the prompt exactly as authored.
  if (!match) return prompt;

  const residual = (prompt.slice(0, match.index) + prompt.slice(match.index + match[0].length))
    .replace(/["„“”]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s:;,–—-]+|[\s:;,–—-]+$/g, '')
    // "Vervollständige den Satz: (reparieren)" — the colon introduced the
    // sentence that just went away.
    .replace(/:\s*\(/, ' (');
  return /\p{L}/u.test(residual) ? residual : null;
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
  const canDrag = !disabled && !isCoarsePointer();

  const usedIndices = new Set(Object.values(placedIndices));
  const emptySlots = exercise.slots.filter(
    (slot) => placedIndices[slot.id] === undefined,
  );

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

  const prompt = promptWithoutSentence(exercise.prompt, exercise.templateParts);

  return (
    <div className="drag-slots">
      {prompt && (
        <p className="exercise__prompt" lang="de">
          {prompt}
        </p>
      )}

      <p className="drag-slots__sentence" lang="de">
        {exercise.templateParts.map((part, index) => {
          const slot = exercise.slots[index];
          const placedIndex = slot ? placedIndices[slot.id] : undefined;
          const placedWord =
            placedIndex !== undefined ? exercise.wordBank[placedIndex] : undefined;
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
                    showAnswer &&
                      (isCorrect
                        ? 'drag-slots__slot--correct'
                        : 'drag-slots__slot--incorrect'),
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
                draggable={canDrag && !isUsed}
                disabled={disabled || isUsed}
                // Selection is otherwise carried by colour alone, which a
                // screen reader cannot report back.
                aria-pressed={selectedIndex === bankIndex}
                onDragStart={() => setDraggedIndex(bankIndex)}
                onDragEnd={() => setDraggedIndex(null)}
                onClick={() => {
                  const [onlyEmptySlot] = emptySlots;
                  if (onlyEmptySlot && emptySlots.length === 1) {
                    placeInSlot(onlyEmptySlot.id, bankIndex);
                  } else {
                    setSelectedIndex(selectedIndex === bankIndex ? null : bankIndex);
                  }
                }}
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
