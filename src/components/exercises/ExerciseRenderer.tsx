import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { Exercise } from '../../schemas/exerciseSchema';
import type { FeedbackState } from '../../features/practice/practiceStore';
import { requiresCorrectionInput } from '../../features/practice/answerNormalization';
import { Icon } from '../common/Icon';
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
  /** Move on by itself once an answer is correct ("Move on automatically"). */
  autoAdvance: boolean;
  /** Exercises right on the first attempt in a row, current one included. */
  streak?: number;
  /** How many times "Try again" was used. Non-zero means this is a retry. */
  retryCount?: number;
  onSubmitChoice: (optionId: string) => void;
  onSubmitText: (value: string) => void;
  onSubmitOrdering: (orderedIds: string[]) => void;
  onSubmitSlots: (placedWords: Record<string, string>) => void;
  onSubmitMatching: (matches: Record<string, string>) => void;
  onSubmitErrorSpotting: (tokenIndex: number, correction: string) => void;
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

/** Long enough to read "Correct" and the explanation before moving on. */
export const AUTO_ADVANCE_DELAY_MS = 1200;

/** True for exercises resolved by a single click rather than an explicit "Check answer". */
function isAutoSubmitExercise(exercise: Exercise): boolean {
  if (exercise.type === 'singleChoice') return true;
  // Error spotting only auto-submits while the click is the whole answer; once
  // a correction has to be typed there is more to say after it.
  return exercise.type === 'errorSpotting' && !requiresCorrectionInput(exercise);
}

/**
 * Longer than a click's debounce: filling the last slot is often followed by
 * moving a word that turned out to be in the wrong place, and that second
 * thought must not cost an attempt.
 */
const COMPLETION_COMMIT_DELAY_MS = 600;

/** Slot id -> the word placed in it, which is what the store checks against. */
function placedWordsFor(
  exercise: Extract<Exercise, { type: 'dragToSlots' }>,
  placedIndices: Record<string, number>,
): Record<string, string> {
  const placedWords: Record<string, string> = {};
  for (const slot of exercise.slots) {
    const index = placedIndices[slot.id];
    if (index !== undefined) placedWords[slot.id] = exercise.wordBank[index] ?? '';
  }
  return placedWords;
}

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
  autoAdvance,
  streak = 0,
  retryCount = 0,
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
  const [correctionValue, setCorrectionValue] = useState('');
  const [hintVisible, setHintVisible] = useState(false);
  const [advanceCancelled, setAdvanceCancelled] = useState(false);
  const commitTimeoutRef = useRef<number | undefined>(undefined);
  const resolvedRef = useRef(resolved);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    resolvedRef.current = resolved;
  }, [resolved]);

  useEffect(() => () => window.clearTimeout(commitTimeoutRef.current), []);

  // "Try again" removes the button that had focus, leaving it on <body>. Put it
  // back on the first control of the exercise so the keyboard path continues.
  // Focusing a radio only moves the ring; it does not check it, so no attempt
  // is spent. This has to wait for the render that removes the button, hence an
  // effect rather than the handler below.
  useEffect(() => {
    if (retryCount === 0) return;
    const form = formRef.current;
    if (!form || form.contains(document.activeElement)) return;
    form
      .querySelector<HTMLElement>(
        'input:not(:disabled), textarea:not(:disabled), button:not(:disabled)',
      )
      ?.focus();
  }, [retryCount]);

  /**
   * A retry keeps the answer — it is a correction, not a rebuild — with one
   * exception. Single choice and click-only error spotting carry their whole
   * answer in a single selection, and a radio that is already `checked` fires
   * no `onChange` when clicked again, so leaving the wrong choice in place
   * would make it unpickable on the second attempt. Error spotting that also
   * asks for a typed correction keeps both: the token was often already right.
   */
  const handleRetry = () => {
    setSelectedOptionId(null);
    if (isAutoSubmit) setSelectedTokenIndex(null);
    onRetry();
  };

  const canRetry = feedback?.canRetry === true;
  const inputsDisabled = resolved;
  const isAutoSubmit = isAutoSubmitExercise(exercise);
  // Derived rather than stored, so the countdown cannot disagree with the
  // effect that owns the timer. Only the cancellation needs remembering.
  const advancing =
    autoAdvance &&
    resolved &&
    !isLast &&
    feedback?.kind === 'correct' &&
    !advanceCancelled;

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
        return (
          selectedTokenIndex !== null &&
          (!requiresCorrectionInput(exercise) || correctionValue.trim().length > 0)
        );
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
    if (resolved || !isAutoSubmit) return;
    commitTimeoutRef.current = window.setTimeout(() => {
      if (!resolvedRef.current) onSubmitErrorSpotting(index, '');
    }, CHOICE_COMMIT_DELAY_MS);
  };

  /**
   * Submits once the last position is filled. Nothing is left to decide at that
   * point, so the separate "Check answer" click was ceremony between the
   * learner and the next exercise. Cancelled again the moment a position opens
   * up, and held long enough to move the piece you just put down.
   */
  const scheduleCompletionCommit = (complete: boolean, submit: () => void) => {
    window.clearTimeout(commitTimeoutRef.current);
    if (resolved || !complete) return;
    commitTimeoutRef.current = window.setTimeout(() => {
      if (!resolvedRef.current) submit();
    }, COMPLETION_COMMIT_DELAY_MS);
  };

  const commitSlots = (next: Record<string, number>) => {
    setPlacedIndices(next);
    if (exercise.type !== 'dragToSlots') return;
    scheduleCompletionCommit(Object.keys(next).length === exercise.slots.length, () =>
      onSubmitSlots(placedWordsFor(exercise, next)),
    );
  };

  /**
   * Matching deliberately does not auto-submit: the last pair is often placed
   * by elimination, and the learner wants to look over the whole board before
   * committing. "Check answer" stays.
   */
  const commitMatches = (next: Record<string, string>) => {
    setMatches(next);
  };

  /**
   * "Move on automatically": once an answer is right, step to the next exercise
   * after a beat long enough to read the feedback. Any key or click cancels it,
   * so it never takes the session away from someone still reading.
   */
  useEffect(() => {
    if (!autoAdvance || !resolved || isLast || feedback?.kind !== 'correct') return;

    const timer = window.setTimeout(onNext, AUTO_ADVANCE_DELAY_MS);
    // Cancelling used to leave no trace on screen, so the countdown appeared to
    // stall for no reason. Recording it removes the bar along with the timer.
    const cancel = () => {
      window.clearTimeout(timer);
      setAdvanceCancelled(true);
    };
    window.addEventListener('pointerdown', cancel);
    window.addEventListener('keydown', cancel);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerdown', cancel);
      window.removeEventListener('keydown', cancel);
    };
  }, [autoAdvance, resolved, isLast, feedback?.kind, onNext]);

  /** Number keys pick the matching option and check it right away. */
  useEffect(() => {
    if (exercise.type !== 'singleChoice' || resolved) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input:not([type="radio"]), textarea, select')) return;
      const index = Number(event.key) - 1;
      const optionId = optionOrder[index];
      if (!Number.isInteger(index) || index < 0 || !optionId) return;
      event.preventDefault();
      window.clearTimeout(commitTimeoutRef.current);
      setSelectedOptionId(optionId);
      onSubmitChoice(optionId);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exercise.type, resolved, optionOrder, onSubmitChoice]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (resolved || canRetry || !canSubmit || isAutoSubmit) return;
    // Beat the completion timer to it rather than submitting twice.
    window.clearTimeout(commitTimeoutRef.current);
    switch (exercise.type) {
      case 'textInput':
        onSubmitText(textValue);
        break;
      case 'sentenceOrdering':
        onSubmitOrdering(orderedIds);
        break;
      case 'dragToSlots':
        onSubmitSlots(placedWordsFor(exercise, placedIndices));
        break;
      case 'matching':
        onSubmitMatching(matches);
        break;
      case 'errorSpotting':
        if (selectedTokenIndex !== null) {
          onSubmitErrorSpotting(selectedTokenIndex, correctionValue);
        }
        break;
      default:
        break;
    }
  };

  return (
    <form className="stack" ref={formRef} onSubmit={handleSubmit} noValidate>
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
          onChange={commitSlots}
          showAnswer={resolved}
          disabled={inputsDisabled}
        />
      )}

      {exercise.type === 'matching' && (
        <MatchingExercise
          exercise={exercise}
          rightOrder={matchingRightOrder}
          matches={matches}
          onChange={commitMatches}
          showAnswer={resolved}
          disabled={inputsDisabled}
        />
      )}

      {exercise.type === 'errorSpotting' && (
        <ErrorSpottingExercise
          exercise={exercise}
          selectedIndex={selectedTokenIndex}
          onSelect={commitErrorSpotting}
          correction={correctionValue}
          onCorrectionChange={setCorrectionValue}
          showAnswer={resolved}
          disabled={inputsDisabled}
          showUmlautHelper={showUmlautHelper}
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

      {/* Deliberately outside the live region below: a run of right answers is
          reinforcement, not something the learner is waiting to hear. Three is
          where a run stops being a coincidence. */}
      {streak >= 3 && feedback?.kind === 'correct' && (
        <p className="row">
          <span className="badge badge--accent streak-chip">
            <Icon name="flame" />
            <span>{streak} correct in a row</span>
          </span>
        </p>
      )}

      <ExerciseFeedback feedback={feedback} explanation={exercise.explanation} />

      {/* No aria-live: the feedback region above has already announced, and a
          second live region would talk over it. */}
      {advancing && (
        <div className="auto-advance">
          <span className="auto-advance__track">
            <span className="auto-advance__bar" />
          </span>
          <span>Moving on… press any key or click to stay.</span>
        </div>
      )}

      <ExerciseNavigation
        canSubmit={canSubmit}
        showCheckAnswer={!isAutoSubmit}
        resolved={resolved}
        canRetry={canRetry}
        isLast={isLast}
        onRetry={handleRetry}
        onReveal={onReveal}
        onNext={onNext}
        onFinish={onFinish}
        onExit={onExit}
      />
    </form>
  );
}
