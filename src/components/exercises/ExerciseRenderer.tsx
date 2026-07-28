import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { Exercise } from '../../schemas/exerciseSchema';
import type { FeedbackState } from '../../features/practice/practiceStore';
import { DialogueExchange } from './DialogueExchange';
import { DragToSlotsExercise } from './DragToSlotsExercise';
import { ErrorSpottingExercise } from './ErrorSpottingExercise';
import { ExerciseFeedback } from './ExerciseFeedback';
import { ExerciseNavigation } from './ExerciseNavigation';
import { MatchingExercise } from './MatchingExercise';
import { SentenceOrderingExercise } from './SentenceOrderingExercise';
import { SingleChoiceExercise } from './SingleChoiceExercise';
import { TextInputExercise } from './TextInputExercise';

export interface ExerciseRendererProps {
  exercise: Exercise;
  /** Display order of option ids for single-choice exercises. */
  optionOrder: string[];
  /** Display order of segment ids for sentence-ordering exercises. */
  segmentOrder: string[];
  /** Display order of word-bank indices for drag-to-slots exercises. */
  wordBankOrder: number[];
  /** Display order of pair ids for the right column of matching exercises. */
  matchingRightOrder: string[];
  feedback: FeedbackState | null;
  resolved: boolean;
  isLast: boolean;
  showHints: boolean;
  showUmlautHelper: boolean;
  onSubmitChoice: (optionId: string) => void;
  onSubmitText: (value: string) => void;
  onSubmitOrdering: (orderedIds: string[]) => void;
  onSubmitSlots: (placedWords: Record<string, string>) => void;
  onSubmitMatching: (matches: Record<string, string>) => void;
  onSubmitErrorSpotting: (tokenIndex: number) => void;
  onRetry: () => void;
  onReveal: () => void;
  onNext: () => void;
  onFinish: () => void;
  onExit: () => void;
}

/**
 * Single-choice and error-spotting answers are checked automatically once the
 * user settles on a selection, instead of requiring a separate "Check answer"
 * click. Selecting is debounced rather than committed on every change so that
 * browsing options with the arrow keys (which checks each one it passes over)
 * doesn't burn through the limited retry attempts before the user has
 * actually decided.
 */
const CHOICE_COMMIT_DELAY_MS = 300;

/** Exercise types resolved by a single click rather than an explicit "Check answer". */
const AUTO_SUBMIT_TYPES = new Set<Exercise['type']>(['singleChoice', 'errorSpotting']);

/**
 * Renders one exercise of any supported type together with its feedback and
 * navigation. The parent must remount it per exercise (`key={exercise.id}`) so
 * the local answer state resets.
 */
export function ExerciseRenderer({
  exercise,
  optionOrder,
  segmentOrder,
  wordBankOrder,
  matchingRightOrder,
  feedback,
  resolved,
  isLast,
  showHints,
  showUmlautHelper,
  onSubmitChoice,
  onSubmitText,
  onSubmitOrdering,
  onSubmitSlots,
  onSubmitMatching,
  onSubmitErrorSpotting,
  onRetry,
  onReveal,
  onNext,
  onFinish,
  onExit,
}: ExerciseRendererProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [textValue, setTextValue] = useState('');
  const [orderedIds, setOrderedIds] = useState<string[]>(segmentOrder);
  const [placedIndices, setPlacedIndices] = useState<Record<string, number>>({});
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const commitTimeoutRef = useRef<number | undefined>(undefined);
  const resolvedRef = useRef(resolved);

  useEffect(() => {
    resolvedRef.current = resolved;
  }, [resolved]);

  useEffect(() => () => window.clearTimeout(commitTimeoutRef.current), []);

  const canRetry = feedback?.canRetry === true;
  const inputsDisabled = resolved;
  const isAutoSubmit = AUTO_SUBMIT_TYPES.has(exercise.type);

  const canSubmit = (() => {
    switch (exercise.type) {
      case 'singleChoice':
        return selectedOptionId !== null;
      case 'textInput':
        return textValue.trim().length > 0;
      case 'sentenceOrdering':
        return orderedIds.length === exercise.segments.length;
      case 'dragToSlots':
        return Object.keys(placedIndices).length === exercise.slots.length;
      case 'matching':
        return Object.keys(matches).length === exercise.pairs.length;
      case 'errorSpotting':
        return selectedTokenIndex !== null;
    }
  })();

  const commitChoice = (optionId: string) => {
    setSelectedOptionId(optionId);
    window.clearTimeout(commitTimeoutRef.current);
    if (resolved) return;
    commitTimeoutRef.current = window.setTimeout(() => {
      if (!resolvedRef.current) onSubmitChoice(optionId);
    }, CHOICE_COMMIT_DELAY_MS);
  };

  const commitErrorSpotting = (index: number) => {
    setSelectedTokenIndex(index);
    window.clearTimeout(commitTimeoutRef.current);
    if (resolved) return;
    commitTimeoutRef.current = window.setTimeout(() => {
      if (!resolvedRef.current) onSubmitErrorSpotting(index);
    }, CHOICE_COMMIT_DELAY_MS);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (resolved || canRetry || !canSubmit || isAutoSubmit) return;
    switch (exercise.type) {
      case 'textInput':
        onSubmitText(textValue);
        break;
      case 'sentenceOrdering':
        onSubmitOrdering(orderedIds);
        break;
      case 'dragToSlots': {
        const placedWords: Record<string, string> = {};
        for (const slot of exercise.slots) {
          const index = placedIndices[slot.id];
          if (index !== undefined) placedWords[slot.id] = exercise.wordBank[index] ?? '';
        }
        onSubmitSlots(placedWords);
        break;
      }
      case 'matching':
        onSubmitMatching(matches);
        break;
      default:
        break;
    }
  };

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      {exercise.instruction && <p className="text-muted">{exercise.instruction}</p>}

      {exercise.dialogue && <DialogueExchange lines={exercise.dialogue} />}

      {exercise.type === 'singleChoice' && (
        <SingleChoiceExercise
          exercise={exercise}
          optionOrder={optionOrder}
          selectedOptionId={selectedOptionId}
          onSelect={commitChoice}
          showAnswer={resolved}
          disabled={inputsDisabled}
        />
      )}

      {exercise.type === 'textInput' && (
        <TextInputExercise
          exercise={exercise}
          value={textValue}
          onChange={setTextValue}
          disabled={inputsDisabled}
          showUmlautHelper={showUmlautHelper}
        />
      )}

      {exercise.type === 'sentenceOrdering' && (
        <SentenceOrderingExercise
          exercise={exercise}
          order={orderedIds}
          onChange={setOrderedIds}
          showAnswer={resolved}
          disabled={inputsDisabled}
        />
      )}

      {exercise.type === 'dragToSlots' && (
        <DragToSlotsExercise
          exercise={exercise}
          wordBankOrder={wordBankOrder}
          placedIndices={placedIndices}
          onChange={setPlacedIndices}
          showAnswer={resolved}
          disabled={inputsDisabled}
        />
      )}

      {exercise.type === 'matching' && (
        <MatchingExercise
          exercise={exercise}
          rightOrder={matchingRightOrder}
          matches={matches}
          onChange={setMatches}
          showAnswer={resolved}
          disabled={inputsDisabled}
        />
      )}

      {exercise.type === 'errorSpotting' && (
        <ErrorSpottingExercise
          exercise={exercise}
          selectedIndex={selectedTokenIndex}
          onSelect={commitErrorSpotting}
          showAnswer={resolved}
          disabled={inputsDisabled}
        />
      )}

      {showHints && exercise.hint && (
        <div>
          {hintVisible ? (
            <p className="text-sm text-muted">Hint: {exercise.hint}</p>
          ) : (
            <button
              type="button"
              className="button button--ghost"
              onClick={() => setHintVisible(true)}
            >
              Show hint
            </button>
          )}
        </div>
      )}

      <ExerciseFeedback feedback={feedback} explanation={exercise.explanation} />

      <ExerciseNavigation
        canSubmit={canSubmit}
        showCheckAnswer={!isAutoSubmit}
        resolved={resolved}
        canRetry={canRetry}
        isLast={isLast}
        onRetry={onRetry}
        onReveal={onReveal}
        onNext={onNext}
        onFinish={onFinish}
        onExit={onExit}
      />
    </form>
  );
}
