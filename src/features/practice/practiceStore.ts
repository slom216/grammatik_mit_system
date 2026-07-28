import { create } from 'zustand';
import type { ChapterDefinition } from '../../schemas/chapterSchema';
import type {
  DragToSlotsExercise,
  ErrorSpottingExercise,
  Exercise,
  MatchingExercise,
  SentenceOrderingExercise,
  SingleChoiceExercise,
  TextInputExercise,
} from '../../schemas/exerciseSchema';
import {
  SESSION_SCHEMA_VERSION,
  persistedSessionV1Schema,
  type AttemptOutcome,
  type ExerciseAttemptRecord,
  type PersistedSessionV1,
  type PracticeMode,
} from '../../schemas/progressSchema';
import {
  matchingRightOrderFor,
  optionOrderFor,
  segmentOrderFor,
  sortedExercises,
  wordBankOrderFor,
} from '../chapters/chapterUtils';
import { createJsonStore } from '../progress/progressPersistence';
import { useProgressStore } from '../progress/progressStore';
import {
  checkDragToSlotsAnswer,
  checkErrorSpottingAnswer,
  checkMatchingAnswer,
  checkSentenceOrderingAnswer,
  checkSingleChoiceAnswer,
  checkTextAnswer,
  correctDragToSlotsText,
  correctErrorSpottingText,
  correctMatchingText,
  correctSentenceOrderingText,
  dragToSlotsAnswerText,
  errorSpottingAnswerText,
  matchingAnswerText,
  primaryAcceptedAnswer,
  sentenceOrderingAnswerText,
} from './answerNormalization';
import {
  MAX_ATTEMPTS,
  outcomeForAttempt,
  scoreForOutcome,
  summarizeSession,
} from './scoring';
import type { SessionSummary } from './scoring';

export const SESSION_STORAGE_KEY = 'grammatik-mit-system:session';

const sessionStore = createJsonStore(SESSION_STORAGE_KEY, persistedSessionV1Schema);

export type PracticeStatus = 'idle' | 'active' | 'finished';

export type FeedbackKind = 'correct' | 'incorrect' | 'revealed';

export interface FeedbackState {
  exerciseId: string;
  kind: FeedbackKind;
  attempts: number;
  /** True when the learner may try the same exercise once more. */
  canRetry: boolean;
  submittedAnswer: string;
  /** Filled once the answer is resolved and may be shown to the learner. */
  expectedAnswer?: string;
  chosenOptionId?: string;
  /** Additional targeted note, e.g. about capitalisation. */
  note?: string;
}

export interface PracticeState {
  status: PracticeStatus;
  mode: PracticeMode;
  chapterNumber: number | null;
  /** Set instead of `chapterNumber` for a cumulative, multi-chapter session. */
  chapterNumbers: number[] | null;
  exerciseIds: string[];
  optionOrder: Record<string, string[]>;
  segmentOrder: Record<string, string[]>;
  wordBankOrder: Record<string, number[]>;
  matchingRightOrder: Record<string, string[]>;
  currentIndex: number;
  results: Record<string, ExerciseAttemptRecord>;
  attempts: Record<string, number>;
  feedback: FeedbackState | null;
  startedAt: string | null;
  summary: SessionSummary | null;

  startSession: (
    chapter: ChapterDefinition,
    options?: { mode?: PracticeMode; exerciseIds?: string[]; shuffleOptions?: boolean },
  ) => void;
  /**
   * Starts a session pooling exercises from several chapters at once (a
   * "cumulative review"). Unlike `startSession`, this is never persisted
   * across a page refresh, since the session isn't tied to one chapter.
   */
  startCumulativeSession: (
    chapters: ChapterDefinition[],
    exerciseIds: string[],
    options?: { shuffleOptions?: boolean },
  ) => void;
  resumeSession: (chapter: ChapterDefinition) => boolean;
  hasStoredSession: (chapterNumber: number) => boolean;
  submitSingleChoice: (exercise: SingleChoiceExercise, optionId: string) => FeedbackState;
  submitTextAnswer: (exercise: TextInputExercise, value: string) => FeedbackState;
  submitSentenceOrdering: (
    exercise: SentenceOrderingExercise,
    orderedIds: string[],
  ) => FeedbackState;
  submitDragToSlots: (
    exercise: DragToSlotsExercise,
    placedWords: Record<string, string>,
  ) => FeedbackState;
  submitMatching: (
    exercise: MatchingExercise,
    matches: Record<string, string>,
  ) => FeedbackState;
  submitErrorSpotting: (
    exercise: ErrorSpottingExercise,
    tokenIndex: number,
  ) => FeedbackState;
  revealAnswer: (exercise: Exercise) => FeedbackState;
  goToNext: () => void;
  finish: (chapter: ChapterDefinition) => SessionSummary;
  /** Ends a cumulative session. No single chapter's mastery is updated. */
  finishCumulative: () => SessionSummary;
  /** Leaves the session but keeps it stored so it can be resumed. */
  pauseSession: () => void;
  /** Discards the session, including the stored copy. */
  exitSession: () => void;
}

function expectedAnswerFor(exercise: Exercise): string {
  switch (exercise.type) {
    case 'textInput':
      return primaryAcceptedAnswer(exercise);
    case 'singleChoice':
      return (
        exercise.options.find((option) => option.id === exercise.correctOptionId)?.text ??
        ''
      );
    case 'sentenceOrdering':
      return correctSentenceOrderingText(exercise);
    case 'dragToSlots':
      return correctDragToSlotsText(exercise);
    case 'matching':
      return correctMatchingText(exercise);
    case 'errorSpotting':
      return correctErrorSpottingText(exercise);
  }
}

interface DisplayOrders {
  optionOrder: Record<string, string[]>;
  segmentOrder: Record<string, string[]>;
  wordBankOrder: Record<string, number[]>;
  matchingRightOrder: Record<string, string[]>;
}

/**
 * Computes every exercise-type's shuffled display order up front, once per
 * session start, so it stays stable across re-renders and page refreshes
 * (mirrors the pre-existing `optionOrder` approach for single-choice).
 */
function displayOrdersFor(
  exercises: readonly Exercise[],
  includedIds: readonly string[],
  shuffle: boolean,
): DisplayOrders {
  const optionOrder: Record<string, string[]> = {};
  const segmentOrder: Record<string, string[]> = {};
  const wordBankOrder: Record<string, number[]> = {};
  const matchingRightOrder: Record<string, string[]> = {};

  for (const exercise of exercises) {
    if (!includedIds.includes(exercise.id)) continue;
    switch (exercise.type) {
      case 'singleChoice':
        optionOrder[exercise.id] = optionOrderFor(exercise, shuffle);
        break;
      case 'sentenceOrdering':
        segmentOrder[exercise.id] = segmentOrderFor(exercise, shuffle);
        break;
      case 'dragToSlots':
        wordBankOrder[exercise.id] = wordBankOrderFor(exercise, shuffle);
        break;
      case 'matching':
        matchingRightOrder[exercise.id] = matchingRightOrderFor(exercise, shuffle);
        break;
      default:
        break;
    }
  }

  return { optionOrder, segmentOrder, wordBankOrder, matchingRightOrder };
}

export const usePracticeStore = create<PracticeState>()((set, get) => {
  const persistSession = () => {
    const state = get();
    if (state.status !== 'active' || state.chapterNumber === null) return;
    const session: PersistedSessionV1 = {
      schemaVersion: SESSION_SCHEMA_VERSION,
      chapterNumber: state.chapterNumber,
      mode: state.mode,
      exerciseIds: state.exerciseIds,
      optionOrder: state.optionOrder,
      segmentOrder: state.segmentOrder,
      wordBankOrder: state.wordBankOrder,
      matchingRightOrder: state.matchingRightOrder,
      currentIndex: state.currentIndex,
      results: state.results,
      startedAt: state.startedAt ?? new Date().toISOString(),
    };
    sessionStore.write(session);
  };

  /** Writes the final result of an exercise and reports it to the progress store. */
  const resolveExercise = (
    exercise: Exercise,
    outcome: AttemptOutcome,
    attempts: number,
    submittedAnswer: string,
  ) => {
    const previousAnswers = get().results[exercise.id]?.submittedAnswers ?? [];
    const record: ExerciseAttemptRecord = {
      exerciseId: exercise.id,
      type: exercise.type,
      attempts,
      outcome,
      score: scoreForOutcome(outcome),
      submittedAnswers: [...previousAnswers, submittedAnswer],
    };
    set((state) => ({ results: { ...state.results, [exercise.id]: record } }));
    useProgressStore.getState().recordAttempt({
      exerciseId: exercise.id,
      chapterNumber: exercise.chapterNumber,
      outcome,
    });
    persistSession();
  };

  const setFeedback = (feedback: FeedbackState): FeedbackState => {
    set({ feedback });
    return feedback;
  };

  return {
    status: 'idle',
    mode: 'chapter',
    chapterNumber: null,
    chapterNumbers: null,
    exerciseIds: [],
    optionOrder: {},
    segmentOrder: {},
    wordBankOrder: {},
    matchingRightOrder: {},
    currentIndex: 0,
    results: {},
    attempts: {},
    feedback: null,
    startedAt: null,
    summary: null,

    startSession: (chapter, options = {}) => {
      const ordered = sortedExercises(chapter);
      const exerciseIds =
        options.exerciseIds && options.exerciseIds.length > 0
          ? ordered
              .filter((exercise) => options.exerciseIds?.includes(exercise.id))
              .map((exercise) => exercise.id)
          : ordered.map((exercise) => exercise.id);

      const shuffleOptions = options.shuffleOptions ?? true;
      const orders = displayOrdersFor(ordered, exerciseIds, shuffleOptions);

      set({
        status: 'active',
        mode: options.mode ?? 'chapter',
        chapterNumber: chapter.number,
        chapterNumbers: null,
        exerciseIds,
        ...orders,
        currentIndex: 0,
        results: {},
        attempts: {},
        feedback: null,
        startedAt: new Date().toISOString(),
        summary: null,
      });
      persistSession();
    },

    startCumulativeSession: (chapters, exerciseIds, options = {}) => {
      const shuffleOptions = options.shuffleOptions ?? true;
      const allExercises = chapters.flatMap((chapter) => chapter.exercises);
      const orders = displayOrdersFor(allExercises, exerciseIds, shuffleOptions);

      set({
        status: 'active',
        mode: 'cumulative',
        chapterNumber: null,
        chapterNumbers: chapters.map((chapter) => chapter.number),
        exerciseIds,
        ...orders,
        currentIndex: 0,
        results: {},
        attempts: {},
        feedback: null,
        startedAt: new Date().toISOString(),
        summary: null,
      });
      // Not persisted: persistSession() no-ops while chapterNumber is null,
      // since a cumulative session isn't tied to one chapter.
    },

    hasStoredSession: (chapterNumber) => {
      const stored = sessionStore.read();
      return stored !== null && stored.chapterNumber === chapterNumber;
    },

    resumeSession: (chapter) => {
      const stored = sessionStore.read();
      if (!stored || stored.chapterNumber !== chapter.number) return false;

      const known = new Set(chapter.exercises.map((exercise) => exercise.id));
      const exerciseIds = stored.exerciseIds.filter((id) => known.has(id));
      if (exerciseIds.length === 0) return false;

      set({
        status: 'active',
        mode: stored.mode,
        chapterNumber: stored.chapterNumber,
        chapterNumbers: null,
        exerciseIds,
        optionOrder: stored.optionOrder,
        segmentOrder: stored.segmentOrder,
        wordBankOrder: stored.wordBankOrder,
        matchingRightOrder: stored.matchingRightOrder,
        currentIndex: Math.min(stored.currentIndex, exerciseIds.length - 1),
        results: stored.results,
        attempts: {},
        feedback: null,
        startedAt: stored.startedAt,
        summary: null,
      });
      return true;
    },

    submitSingleChoice: (exercise, optionId) => {
      const attempts = (get().attempts[exercise.id] ?? 0) + 1;
      set((state) => ({ attempts: { ...state.attempts, [exercise.id]: attempts } }));

      const correct = checkSingleChoiceAnswer(exercise, optionId);
      const chosenText =
        exercise.options.find((option) => option.id === optionId)?.text ?? '';

      if (correct) {
        const outcome = outcomeForAttempt(attempts, true);
        resolveExercise(exercise, outcome, attempts, chosenText);
        return setFeedback({
          exerciseId: exercise.id,
          kind: 'correct',
          attempts,
          canRetry: false,
          submittedAnswer: chosenText,
          chosenOptionId: optionId,
          expectedAnswer: expectedAnswerFor(exercise),
        });
      }

      const canRetry = attempts < MAX_ATTEMPTS;
      if (!canRetry) {
        resolveExercise(exercise, 'incorrect', attempts, chosenText);
      }
      return setFeedback({
        exerciseId: exercise.id,
        kind: 'incorrect',
        attempts,
        canRetry,
        submittedAnswer: chosenText,
        chosenOptionId: optionId,
        ...(canRetry ? {} : { expectedAnswer: expectedAnswerFor(exercise) }),
      });
    },

    submitTextAnswer: (exercise, value) => {
      const attempts = (get().attempts[exercise.id] ?? 0) + 1;
      set((state) => ({ attempts: { ...state.attempts, [exercise.id]: attempts } }));

      const check = checkTextAnswer(exercise, value);

      if (check.correct) {
        const outcome = outcomeForAttempt(attempts, true);
        resolveExercise(exercise, outcome, attempts, value);
        return setFeedback({
          exerciseId: exercise.id,
          kind: 'correct',
          attempts,
          canRetry: false,
          submittedAnswer: value,
          expectedAnswer: expectedAnswerFor(exercise),
        });
      }

      const canRetry = attempts < MAX_ATTEMPTS;
      if (!canRetry) {
        resolveExercise(exercise, 'incorrect', attempts, value);
      }

      const note = check.capitalisationOnlyMismatch
        ? 'Only the capitalisation is different — in German it is part of the grammar.'
        : check.missingTokens.length > 0
          ? `Your answer is missing: ${check.missingTokens.join(', ')}.`
          : undefined;

      return setFeedback({
        exerciseId: exercise.id,
        kind: 'incorrect',
        attempts,
        canRetry,
        submittedAnswer: value,
        ...(note ? { note } : {}),
        // The expected answer is shown after the second incorrect attempt.
        ...(canRetry ? {} : { expectedAnswer: expectedAnswerFor(exercise) }),
      });
    },

    submitSentenceOrdering: (exercise, orderedIds) => {
      const attempts = (get().attempts[exercise.id] ?? 0) + 1;
      set((state) => ({ attempts: { ...state.attempts, [exercise.id]: attempts } }));

      const correct = checkSentenceOrderingAnswer(exercise, orderedIds);
      const submittedAnswer = sentenceOrderingAnswerText(exercise, orderedIds);

      if (correct) {
        const outcome = outcomeForAttempt(attempts, true);
        resolveExercise(exercise, outcome, attempts, submittedAnswer);
        return setFeedback({
          exerciseId: exercise.id,
          kind: 'correct',
          attempts,
          canRetry: false,
          submittedAnswer,
          expectedAnswer: expectedAnswerFor(exercise),
        });
      }

      const canRetry = attempts < MAX_ATTEMPTS;
      if (!canRetry) {
        resolveExercise(exercise, 'incorrect', attempts, submittedAnswer);
      }
      return setFeedback({
        exerciseId: exercise.id,
        kind: 'incorrect',
        attempts,
        canRetry,
        submittedAnswer,
        ...(canRetry ? {} : { expectedAnswer: expectedAnswerFor(exercise) }),
      });
    },

    submitDragToSlots: (exercise, placedWords) => {
      const attempts = (get().attempts[exercise.id] ?? 0) + 1;
      set((state) => ({ attempts: { ...state.attempts, [exercise.id]: attempts } }));

      const correct = checkDragToSlotsAnswer(exercise, placedWords);
      const submittedAnswer = dragToSlotsAnswerText(exercise, placedWords);

      if (correct) {
        const outcome = outcomeForAttempt(attempts, true);
        resolveExercise(exercise, outcome, attempts, submittedAnswer);
        return setFeedback({
          exerciseId: exercise.id,
          kind: 'correct',
          attempts,
          canRetry: false,
          submittedAnswer,
          expectedAnswer: expectedAnswerFor(exercise),
        });
      }

      const canRetry = attempts < MAX_ATTEMPTS;
      if (!canRetry) {
        resolveExercise(exercise, 'incorrect', attempts, submittedAnswer);
      }
      return setFeedback({
        exerciseId: exercise.id,
        kind: 'incorrect',
        attempts,
        canRetry,
        submittedAnswer,
        ...(canRetry ? {} : { expectedAnswer: expectedAnswerFor(exercise) }),
      });
    },

    submitMatching: (exercise, matches) => {
      const attempts = (get().attempts[exercise.id] ?? 0) + 1;
      set((state) => ({ attempts: { ...state.attempts, [exercise.id]: attempts } }));

      const correct = checkMatchingAnswer(exercise, matches);
      const submittedAnswer = matchingAnswerText(exercise, matches);

      if (correct) {
        const outcome = outcomeForAttempt(attempts, true);
        resolveExercise(exercise, outcome, attempts, submittedAnswer);
        return setFeedback({
          exerciseId: exercise.id,
          kind: 'correct',
          attempts,
          canRetry: false,
          submittedAnswer,
          expectedAnswer: expectedAnswerFor(exercise),
        });
      }

      const canRetry = attempts < MAX_ATTEMPTS;
      if (!canRetry) {
        resolveExercise(exercise, 'incorrect', attempts, submittedAnswer);
      }
      return setFeedback({
        exerciseId: exercise.id,
        kind: 'incorrect',
        attempts,
        canRetry,
        submittedAnswer,
        ...(canRetry ? {} : { expectedAnswer: expectedAnswerFor(exercise) }),
      });
    },

    submitErrorSpotting: (exercise, tokenIndex) => {
      const attempts = (get().attempts[exercise.id] ?? 0) + 1;
      set((state) => ({ attempts: { ...state.attempts, [exercise.id]: attempts } }));

      const correct = checkErrorSpottingAnswer(exercise, tokenIndex);
      const submittedAnswer = errorSpottingAnswerText(exercise, tokenIndex);

      if (correct) {
        const outcome = outcomeForAttempt(attempts, true);
        resolveExercise(exercise, outcome, attempts, submittedAnswer);
        return setFeedback({
          exerciseId: exercise.id,
          kind: 'correct',
          attempts,
          canRetry: false,
          submittedAnswer,
          expectedAnswer: expectedAnswerFor(exercise),
        });
      }

      const canRetry = attempts < MAX_ATTEMPTS;
      if (!canRetry) {
        resolveExercise(exercise, 'incorrect', attempts, submittedAnswer);
      }
      return setFeedback({
        exerciseId: exercise.id,
        kind: 'incorrect',
        attempts,
        canRetry,
        submittedAnswer,
        ...(canRetry ? {} : { expectedAnswer: expectedAnswerFor(exercise) }),
      });
    },

    revealAnswer: (exercise) => {
      const attempts = get().attempts[exercise.id] ?? 0;
      const submitted = get().feedback?.submittedAnswer ?? '';
      resolveExercise(exercise, 'revealed', attempts, submitted);
      return setFeedback({
        exerciseId: exercise.id,
        kind: 'revealed',
        attempts,
        canRetry: false,
        submittedAnswer: submitted,
        expectedAnswer: expectedAnswerFor(exercise),
      });
    },

    goToNext: () => {
      const { currentIndex, exerciseIds } = get();
      const nextIndex = Math.min(currentIndex + 1, exerciseIds.length - 1);
      set({ currentIndex: nextIndex, feedback: null });
      persistSession();
    },

    finish: (chapter) => {
      const state = get();
      const records = state.exerciseIds
        .map((id) => state.results[id])
        .filter((record): record is ExerciseAttemptRecord => record !== undefined);
      const summary = summarizeSession(records, state.exerciseIds.length);

      useProgressStore.getState().recordSessionResult({
        chapterNumber: chapter.number,
        summary,
        mastery: chapter.mastery,
      });

      sessionStore.clear();
      set({ status: 'finished', summary, feedback: null });
      return summary;
    },

    finishCumulative: () => {
      const state = get();
      const records = state.exerciseIds
        .map((id) => state.results[id])
        .filter((record): record is ExerciseAttemptRecord => record !== undefined);
      const summary = summarizeSession(records, state.exerciseIds.length);

      set({ status: 'finished', summary, feedback: null });
      return summary;
    },

    pauseSession: () => {
      persistSession();
      set({ status: 'idle', feedback: null });
    },

    exitSession: () => {
      sessionStore.clear();
      set({
        status: 'idle',
        chapterNumber: null,
        chapterNumbers: null,
        exerciseIds: [],
        optionOrder: {},
        segmentOrder: {},
        wordBankOrder: {},
        matchingRightOrder: {},
        currentIndex: 0,
        results: {},
        attempts: {},
        feedback: null,
        startedAt: null,
      });
    },
  };
});

/* ------------------------------------------------------------------ */
/* Selectors                                                           */
/* ------------------------------------------------------------------ */

export function selectCurrentExerciseId(state: PracticeState): string | undefined {
  return state.exerciseIds[state.currentIndex];
}

export function selectIsResolved(state: PracticeState, exerciseId: string): boolean {
  return state.results[exerciseId] !== undefined;
}

export function selectAnsweredCount(state: PracticeState): number {
  return Object.keys(state.results).length;
}

export function selectIsLastExercise(state: PracticeState): boolean {
  return state.currentIndex >= state.exerciseIds.length - 1;
}

export function selectSessionRecords(state: PracticeState): ExerciseAttemptRecord[] {
  return state.exerciseIds
    .map((id) => state.results[id])
    .filter((record): record is ExerciseAttemptRecord => record !== undefined);
}
